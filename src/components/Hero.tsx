"use client";

import { getImageProps } from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDownIcon, PauseIcon, PlayIcon } from "./Icons";
import styles from "./Hero.module.css";

/** "dark" = black text for light photos, "light" = white text for dark photos. */
type Tone = "dark" | "light";

type Slide = {
  id: string;
  title: string;
  /** Each entry is one line on desktop. */
  lines: string[];
  cta: string;
  href: string;
  mobile: { src: string; width: number; height: number };
  desktop: { src: string; width: number; height: number };
  tone: { mobile: Tone; desktop: Tone };
};

const m = (n: number, width = 1125, height = 1650) => ({ src: `/images/${n}.jpeg`, width, height });
const d = (n: number) => ({ src: `/images/${n}.jpeg`, width: 2880, height: 1080 });

const slides: Slide[] = [
  {
    id: "aramid",
    title: "Woven, not moulded",
    lines: ["Aramid fibre cases, woven thread by thread.", "Light in the hand, strong where it counts."],
    cta: "Shop aramid",
    href: "/collections/aramid",
    mobile: m(10001),
    desktop: d(10007),
    tone: { mobile: "dark", desktop: "dark" },
  },
  {
    id: "festive",
    title: "Gift something woven",
    lines: ["Festive patterns for the season,", "wrapped and ready to give."],
    cta: "Shop gifts",
    href: "/#best-sellers",
    mobile: m(10002),
    desktop: d(10006),
    tone: { mobile: "light", desktop: "light" },
  },
  {
    id: "everyday",
    title: "Built for every day",
    lines: ["Slim cases cut for iPhone 16", "through iPhone 18 Pro Max."],
    cta: "Shop now",
    href: "/shop",
    mobile: m(10003),
    desktop: d(10009),
    tone: { mobile: "dark", desktop: "dark" },
  },
  {
    id: "precision",
    title: "Precise to the lens",
    lines: ["Raised edges guard the camera,", "cut to fit your iPhone exactly."],
    cta: "Order now",
    href: "/shop",
    mobile: m(10004),
    desktop: d(10010),
    tone: { mobile: "dark", desktop: "light" },
  },
  {
    id: "magsafe",
    title: "Snaps on with MagSafe",
    lines: ["Wallets, stands and grips", "that click into place."],
    cta: "Shop MagSafe",
    href: "/collections/clear",
    mobile: m(10005, 1053, 1404),
    desktop: d(10008),
    tone: { mobile: "dark", desktop: "dark" },
  },
];

const AUTOPLAY_MS = 5000;
/** Must match the track transition in Hero.module.css. */
const SLIDE_MS = 700;
const SWIPE_PX = 50;
const N = slides.length;
/** Clones of the last and first slide at either end make the loop seamless. */
const track = [slides[N - 1], ...slides, slides[0]];

export function Hero() {
  const [pos, setPos] = useState(1); // index into `track`
  const [animate, setAnimate] = useState(true);
  const [drag, setDrag] = useState(0);
  const [playing, setPlaying] = useState(true);
  const active = (pos - 1 + N) % N;
  const slide = slides[active];

  const posRef = useRef(1);
  const moving = useRef(false);
  const settleTimer = useRef(0);
  const pointer = useRef<{ x: number; y: number; dx: number; swiping: boolean } | null>(null);
  const suppressClick = useRef(false);

  /**
   * Finish a move: if it landed on a clone, jump (without animation) to the
   * real slide it copies. Runs on transitionend, with a timer as a fallback
   * because browsers skip that event when animations are off or the tab is
   * hidden, which used to leave the slider locked.
   */
  const settle = useCallback(() => {
    window.clearTimeout(settleTimer.current);
    moving.current = false;
    const p = posRef.current;
    if (p <= 0 || p >= N + 1) {
      posRef.current = p <= 0 ? N : 1;
      setAnimate(false);
      setPos(posRef.current);
    }
  }, []);

  const go = useCallback(
    (next: number) => {
      if (next < 0 || next > N + 1 || next === posRef.current) return;
      moving.current = true;
      posRef.current = next;
      setAnimate(true);
      setPos(next);
      window.clearTimeout(settleTimer.current);
      settleTimer.current = window.setTimeout(settle, SLIDE_MS + 100);
    },
    [settle],
  );

  const step = useCallback((dir: 1 | -1) => go(posRef.current + dir), [go]);

  useEffect(() => () => window.clearTimeout(settleTimer.current), []);

  // After jumping from a clone back to its real slide, turn the animation back on.
  useEffect(() => {
    if (animate) return;
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setAnimate(true)));
    return () => cancelAnimationFrame(id);
  }, [animate]);

  // Autoplay. Restarts whenever the slide changes, so manual moves reset the timer.
  useEffect(() => {
    if (!playing || drag !== 0) return;
    const id = window.setTimeout(() => step(1), AUTOPLAY_MS);
    return () => window.clearTimeout(id);
  }, [playing, pos, drag, step]);

  // Tell the header which text colour sits on top of this slide.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.heroToneMobile = slide.tone.mobile;
    root.dataset.heroToneDesktop = slide.tone.desktop;
  }, [slide]);

  useEffect(
    () => () => {
      delete document.documentElement.dataset.heroToneMobile;
      delete document.documentElement.dataset.heroToneDesktop;
    },
    [],
  );

  const onTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    settle();
  };

  /* ---------- Swipe / drag ---------- */

  const onPointerDown = (e: React.PointerEvent) => {
    suppressClick.current = false;
    if (moving.current || (e.pointerType === "mouse" && e.button !== 0)) return;
    pointer.current = { x: e.clientX, y: e.clientY, dx: 0, swiping: false };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const p = pointer.current;
    if (!p) return;
    const dx = e.clientX - p.x;
    if (!p.swiping) {
      if (Math.abs(e.clientY - p.y) > Math.abs(dx) && Math.abs(e.clientY - p.y) > 8) {
        pointer.current = null; // vertical scroll, let the page handle it
        return;
      }
      if (Math.abs(dx) < 8) return;
      p.swiping = true;
      setAnimate(false);
    }
    p.dx = dx;
    setDrag(dx);
  };

  const onPointerEnd = () => {
    const p = pointer.current;
    pointer.current = null;
    if (!p?.swiping) return;
    suppressClick.current = true;
    setDrag(0);
    if (p.dx <= -SWIPE_PX) step(1);
    else if (p.dx >= SWIPE_PX) step(-1);
    else setAnimate(true);
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (suppressClick.current) {
      e.preventDefault();
      e.stopPropagation();
      suppressClick.current = false;
    }
  };

  return (
    <section
      className={styles.hero}
      aria-roledescription="carousel"
      aria-label="Featured"
      data-mobile-tone={slide.tone.mobile}
      data-desktop-tone={slide.tone.desktop}
    >
      <div
        className={styles.viewport}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onPointerLeave={onPointerEnd}
        onClickCapture={onClickCapture}
        aria-live={playing ? "off" : "polite"}
      >
        <div
          className={styles.track}
          data-animate={animate}
          style={{ transform: `translate3d(calc(${-pos * 100}% + ${drag}px), 0, 0)` }}
          onTransitionEnd={onTransitionEnd}
        >
          {track.map((s, i) => {
            const isClone = i === 0 || i === N + 1;
            const current = i === pos;
            return (
              <div
                key={`${s.id}-${i}`}
                className={styles.slide}
                role="group"
                aria-roledescription="slide"
                aria-label={`${((i - 1 + N) % N) + 1} of ${N}`}
                aria-hidden={!current}
                inert={!current}
                data-mobile-tone={s.tone.mobile}
                data-desktop-tone={s.tone.desktop}
              >
                <SlideImage slide={s} eager={i === 1} />
                <Link className={styles.cover} href={s.href} tabIndex={-1} draggable={false}>
                  <span className="srOnly">{s.title}</span>
                </Link>
                <div className={styles.content}>
                  <div className={styles.copy}>
                    <div className={styles.text}>
                      {i === 1 && !isClone ? (
                        <h1 className={styles.title}>{s.title}</h1>
                      ) : (
                        <h2 className={styles.title}>{s.title}</h2>
                      )}
                      <p className={styles.description}>
                        {s.lines.map((line) => (
                          <span key={line} className={styles.line}>
                            {line}{" "}
                          </span>
                        ))}
                      </p>
                    </div>
                    <Link href={s.href} className={styles.cta} draggable={false}>
                      {s.cta}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className={`${styles.arrow} ${styles.prev}`}
        onClick={() => step(-1)}
        aria-label="Previous slide"
      >
        <ChevronDownIcon />
      </button>
      <button
        type="button"
        className={`${styles.arrow} ${styles.next}`}
        onClick={() => step(1)}
        aria-label="Next slide"
      >
        <ChevronDownIcon />
      </button>

      <div className={styles.pagination} role="group" aria-label="Hero slides">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            className={styles.dot}
            data-active={i === active}
            aria-current={i === active}
            aria-label={`Show slide ${i + 1}`}
            onClick={() => go(i + 1)}
          />
        ))}
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setPlaying((v) => !v)}
          aria-label={playing ? "Pause slideshow" : "Play slideshow"}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
      </div>
    </section>
  );
}

/** One <picture>: the tall photo on phones, the wide one from 1024px up. */
function SlideImage({ slide, eager }: { slide: Slide; eager: boolean }) {
  const common = { alt: "", sizes: "100vw" };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({ ...common, ...slide.desktop });
  const { props: mobile } = getImageProps({
    ...common,
    ...slide.mobile,
    loading: eager ? "eager" : "lazy",
    fetchPriority: eager ? "high" : "auto",
  });

  return (
    <picture className={styles.picture}>
      <source media="(min-width: 1024px)" srcSet={desktopSrcSet} sizes="100vw" />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt="" comes from getImageProps */}
      <img {...mobile} className={styles.image} draggable={false} />
    </picture>
  );
}
