"use client";

import { useState } from "react";
import type { ProductReview } from "@/lib/productReviews";
import { useReviews } from "./ReviewsProvider";
import { Stars } from "./Stars";
import styles from "./ProductReviews.module.css";

const PAGE = 5;

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

export function ProductReviews({ productId, productName }: { productId: string; productName: string }) {
  const { reviews, loading, error, average, histogram } = useReviews();
  const [shown, setShown] = useState(PAGE);
  const [writing, setWriting] = useState(false);
  const [thanks, setThanks] = useState(false);

  return (
    <section id="reviews" className={styles.section} aria-labelledby="reviews-title">
      <div className="wrap">
        <h2 id="reviews-title" className={styles.heading}>
          Customer reviews
        </h2>

        <div className={styles.layout}>
          {/* Summary */}
          <aside className={styles.summary}>
            {reviews.length > 0 ? (
              <>
                <p className={styles.average}>{average.toFixed(1)}</p>
                <Stars value={average} size={20} />
                <p className={styles.based}>
                  Based on {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </p>
                <ol className={styles.bars}>
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = histogram[star - 1];
                    return (
                      <li key={star}>
                        <span>{star}★</span>
                        <span className={styles.bar}>
                          <span style={{ width: `${(count / reviews.length) * 100}%` }} />
                        </span>
                        <span className={styles.count}>{count}</span>
                      </li>
                    );
                  })}
                </ol>
              </>
            ) : (
              <p className={styles.based}>{loading ? "Loading reviews…" : "No reviews yet."}</p>
            )}

            <button
              type="button"
              className={styles.write}
              aria-expanded={writing}
              aria-controls="review-form"
              onClick={() => {
                setWriting((w) => !w);
                setThanks(false);
              }}
            >
              {writing ? "Cancel" : "Write a review"}
            </button>
          </aside>

          {/* List + form */}
          <div className={styles.main}>
            {thanks && (
              <p className={styles.thanks} role="status">
                Thanks! Your review is posted.
              </p>
            )}

            {writing && (
              <ReviewForm
                productId={productId}
                productName={productName}
                onDone={() => {
                  setWriting(false);
                  setThanks(true);
                }}
              />
            )}

            {error && <p className={styles.empty}>Reviews could not be loaded. Please refresh the page.</p>}

            {!loading && !error && reviews.length === 0 && !writing && (
              <p className={styles.empty}>
                Be the first to review the {productName}. Tell others how it fits and feels.
              </p>
            )}

            {reviews.length > 0 && (
              <ul className={styles.list}>
                {reviews.slice(0, shown).map((review) => (
                  <ReviewItem key={review.id} review={review} />
                ))}
              </ul>
            )}

            {reviews.length > shown && (
              <button type="button" className={styles.more} onClick={() => setShown((n) => n + PAGE)}>
                Show more reviews ({reviews.length - shown})
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewItem({ review }: { review: ProductReview }) {
  return (
    <li className={styles.item}>
      <div className={styles.itemHead}>
        <Stars value={review.rating} size={14} />
        <time dateTime={review.createdAt} className={styles.date}>
          {dateFormat.format(new Date(review.createdAt))}
        </time>
      </div>
      {review.title && <h3 className={styles.itemTitle}>{review.title}</h3>}
      <p className={styles.itemText}>{review.text}</p>
      <p className={styles.author}>
        <span className={styles.avatar} aria-hidden="true">
          {review.name.charAt(0).toUpperCase()}
        </span>
        <span>
          <strong>{review.name}</strong>
          {review.device && <span className={styles.device}> · {review.device}</span>}
        </span>
      </p>
    </li>
  );
}

function ReviewForm({
  productId,
  productName,
  onDone,
}: {
  productId: string;
  productName: string;
  onDone: () => void;
}) {
  const { addReview } = useReviews();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    if (!rating) {
      setMessage("Pick a star rating.");
      return;
    }

    setSending(true);
    setMessage("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          name: form.get("name"),
          title: form.get("title"),
          text: form.get("text"),
          device: form.get("device"),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      addReview(data.review);
      onDone();
    } catch {
      setMessage("Could not send your review. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const shownRating = hover || rating;

  return (
    <form id="review-form" className={styles.form} onSubmit={onSubmit} noValidate>
      <h3 className={styles.formTitle}>Review the {productName}</h3>

      <fieldset className={styles.rate}>
        <legend>Your rating</legend>
        <div className={styles.rateStars} onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((star) => (
            <label key={star} onMouseEnter={() => setHover(star)} data-on={star <= shownRating}>
              <input
                type="radio"
                name="rating"
                value={star}
                className="srOnly"
                checked={rating === star}
                onChange={() => setRating(star)}
              />
              <svg viewBox="0 0 20 20" width="28" height="28" aria-hidden="true">
                <path d="M10 1.6l2.5 5.2 5.7.8-4.1 4 1 5.7L10 14.6l-5.1 2.7 1-5.7-4.1-4 5.7-.8z" />
              </svg>
              <span className="srOnly">
                {star} {star === 1 ? "star" : "stars"}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.fields}>
        <label className={styles.field}>
          <span>Name</span>
          <input name="name" required minLength={2} maxLength={60} autoComplete="name" />
        </label>
        <label className={styles.field}>
          <span>Phone model (optional)</span>
          <input name="device" maxLength={80} placeholder="e.g. iPhone 17 Pro" />
        </label>
      </div>

      <label className={styles.field}>
        <span>Title (optional)</span>
        <input name="title" maxLength={100} />
      </label>

      <label className={styles.field}>
        <span>Your review</span>
        <textarea name="text" required minLength={10} maxLength={2000} rows={5} />
      </label>

      {message && (
        <p className={styles.formError} role="alert">
          {message}
        </p>
      )}

      <button type="submit" className={styles.submit} disabled={sending}>
        {sending ? "Sending…" : "Post review"}
      </button>
    </form>
  );
}
