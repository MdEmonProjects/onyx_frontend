"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { products, taka } from "@/lib/catalog";
import { PlayIcon } from "./Icons";
import styles from "./Materials.module.css";

/**
 * Sample reels. Drop the clips into /public/videos and point `src` at them.
 * `poster` shows until the clip loads (and if it fails). `productId` picks
 * the product shown on the card at the bottom.
 */
const reels = [
  { id: "reel-1", src: "/videos/1.mp4", poster: "/images/10001.jpeg", productId: "banded" },
  { id: "reel-2", src: "/videos/2.mp4", poster: "/images/10002.jpeg", productId: "aramid-weave" },
  { id: "reel-3", src: "/videos/3.mp4", poster: "/images/10003.jpeg", productId: "saddle" },
  { id: "reel-4", src: "/videos/4.mp4", poster: "/images/10004.jpeg", productId: "frost-clear" },
].map((reel) => ({ ...reel, product: products.find((p) => p.id === reel.productId)! }));

function clock(seconds: number) {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

const VolumeOffIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
    <path d="m16 9.5 5 5M21 9.5l-5 5" />
  </svg>
);

const VolumeOnIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" />
    <path d="M15.5 9a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export function Materials() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [durations, setDurations] = useState<number[]>([]);
  const [failed, setFailed] = useState<boolean[]>([]);

  // Only run while the section is on screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // No automatic playback for people who asked for reduced motion; hover still plays.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAutoplay(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const shouldPlay = inView && (autoplay || hovering);

  // Play the active clip, pause the rest.
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      video.muted = muted;
      if (i === active && shouldPlay && !failed[i]) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [active, shouldPlay, muted, failed]);

  const next = useCallback(
    (from: number) => {
      for (let step = 1; step <= reels.length; step++) {
        const i = (from + step) % reels.length;
        if (!failed[i]) return i;
      }
      return from;
    },
    [failed],
  );

  const goTo = (i: number) => {
    if (i === active) return;
    const video = videoRefs.current[i];
    if (video) video.currentTime = 0;
    setProgress(0);
    setActive(i);
  };

  const handleEnded = (i: number) => {
    if (i !== active) return;
    if (hovering) {
      // Keep looping the clip under the pointer.
      const video = videoRefs.current[i];
      if (video) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
      return;
    }
    goTo(next(i));
  };

  const handleError = (i: number) => {
    setFailed((prev) => {
      const copy = [...prev];
      copy[i] = true;
      return copy;
    });
    if (i === active) goTo(next(i));
  };

  return (
    <section
      ref={sectionRef}
      id="materials"
      className={`${styles.section} onDark`}
      aria-labelledby="materials-title"
    >
      <div className="wrap">
        <div className={styles.head}>
          <h2 id="materials-title" className="title">
            Shop by material
          </h2>
          <Link href="/collections" className="textLink">
            See all collections
          </Link>
        </div>

        <ul className={styles.track}>
          {reels.map((reel, i) => {
            const isActive = i === active;
            const playing = isActive && shouldPlay && !failed[i];
            const href = `/products/${reel.product.id}`;

            return (
              <li
                key={reel.id}
                className={styles.card}
                data-active={isActive}
                onMouseEnter={() => {
                  setHovering(true);
                  goTo(i);
                }}
                onMouseLeave={() => setHovering(false)}
                onFocus={() => goTo(i)}
              >
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  className={styles.video}
                  src={reel.src}
                  poster={reel.poster}
                  muted
                  playsInline
                  preload="metadata"
                  aria-label={`${reel.product.name} video`}
                  onLoadedMetadata={(e) => {
                    const d = e.currentTarget.duration;
                    setDurations((prev) => {
                      const copy = [...prev];
                      copy[i] = d;
                      return copy;
                    });
                  }}
                  onTimeUpdate={(e) => {
                    if (!isActive) return;
                    const v = e.currentTarget;
                    if (v.duration) setProgress(v.currentTime / v.duration);
                  }}
                  onEnded={() => handleEnded(i)}
                  onError={() => handleError(i)}
                />

                <div className={styles.shade} aria-hidden="true" />

                <div className={styles.top}>
                  {isActive && (
                    <span className={styles.progress} aria-hidden="true">
                      <span style={{ transform: `scaleX(${progress})` }} />
                    </span>
                  )}
                  <span className={styles.status}>
                    <PlayIcon />
                    {playing ? "Playing" : durations[i] ? clock(durations[i]) : "Video"}
                  </span>
                  <button
                    type="button"
                    className={styles.sound}
                    aria-label={muted ? "Turn sound on" : "Turn sound off"}
                    aria-pressed={!muted}
                    onClick={() => {
                      goTo(i);
                      setMuted((m) => !m);
                    }}
                  >
                    {muted ? <VolumeOffIcon /> : <VolumeOnIcon />}
                  </button>
                </div>

                <Link href={href} className={styles.product}>
                  <span className={styles.thumb}>
                    <Image src={reel.poster} alt="" fill sizes="40px" />
                  </span>
                  <span className={styles.meta}>
                    <span className={styles.name}>{reel.product.name}</span>
                    <span className={styles.price}>{taka(reel.product.price)}</span>
                  </span>
                  <span className={styles.arrow}>
                    <ArrowIcon />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
