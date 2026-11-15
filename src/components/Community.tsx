"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { communityClips } from "@/lib/reviews";
import { site } from "@/lib/site";
import { ChevronRightIcon } from "./Icons";
import styles from "./Community.module.css";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

/** A muted clip that loops while it is on screen and pauses when it is not. */
function Clip({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.2 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={styles.video}
      src={`${src}#t=0.1`}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      controlsList="nodownload nofullscreen noremoteplayback"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}

export function Community() {
  return (
    <section className={`${styles.section} onDark`} aria-labelledby="community-title">
      <div className="wrap">
        <div className={styles.head}>
          <h2 id="community-title" className={styles.title}>
            <InstagramIcon />
            {site.name} Community
          </h2>
          <p className={styles.sub}>
            Real customers, real phones.{" "}
            <a href={site.contact.instagram} className="textLink" target="_blank" rel="noreferrer">
              Tag us on Instagram
            </a>{" "}
            to be featured.
          </p>
        </div>

        <ul className={styles.grid}>
          {communityClips.map((clip) => (
            <li key={clip.id} className={styles.card}>
              <Clip src={clip.src} />
              <Link href={`/products/${clip.productId}`} className={styles.shop}>
                Shop this look
                <ChevronRightIcon />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
