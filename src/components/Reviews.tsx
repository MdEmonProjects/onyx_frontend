"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { products } from "@/lib/catalog";
import { reviews } from "@/lib/reviews";
import { ChevronLeftIcon, ChevronRightIcon } from "./Icons";
import styles from "./Reviews.module.css";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

const Star = () => (
  <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
    <path d="M6 .8l1.5 3.3 3.6.4-2.7 2.4.8 3.5L6 8.6 2.8 10.4l.8-3.5L.9 4.5l3.6-.4z" fill="currentColor" />
  </svg>
);

export function Reviews() {
  const trackRef = useRef<HTMLUListElement>(null);

  const scroll = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 20 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className={styles.section} aria-labelledby="reviews-title">
      <div className="wrap">
        <div className={styles.head}>
          <h2 id="reviews-title" className="title">
            Trusted by thousands
          </h2>
          <div className={styles.nav}>
            <button type="button" className={styles.navBtn} onClick={() => scroll(-1)} aria-label="Previous reviews">
              <ChevronLeftIcon />
            </button>
            <button type="button" className={styles.navBtn} onClick={() => scroll(1)} aria-label="Next reviews">
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>

      <ul ref={trackRef} className={styles.track}>
        {reviews.map((review) => {
          const product = products.find((p) => p.id === review.productId);
          return (
            <li key={review.id} className={styles.card} data-tone={review.tone}>
              <p className={styles.stars} aria-label={`${review.rating} out of 5 stars`}>
                {Array.from({ length: review.rating }, (_, i) => (
                  <Star key={i} />
                ))}
              </p>

              <blockquote className={styles.quote}>&ldquo;{review.quote}&rdquo;</blockquote>

              {product && (
                <Link href={`/products/${product.id}`} className={styles.product}>
                  <span className={styles.thumb}>
                    <Image src={review.thumb} alt="" fill sizes="48px" />
                  </span>
                  <span className={styles.productText}>
                    <span className={styles.productName}>{product.name}</span>
                    <span className={styles.finish}>{review.finish}</span>
                  </span>
                </Link>
              )}

              <footer className={styles.author}>
                <span className={styles.avatar} aria-hidden="true">
                  {initials(review.name)}
                </span>
                <span>
                  <span className={styles.name}>{review.name}</span>
                  <span className={styles.verified}>Verified buyer</span>
                </span>
              </footer>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
