"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ProductReview } from "@/lib/productReviews";

type Reviews = {
  reviews: ProductReview[];
  loading: boolean;
  error: boolean;
  average: number;
  /** Count per star, index 0 = 1 star ... index 4 = 5 stars. */
  histogram: number[];
  addReview: (review: ProductReview) => void;
};

const ReviewsContext = createContext<Reviews | null>(null);

/**
 * Loads a product's reviews once and shares them between the rating line
 * in the buy panel and the reviews section further down.
 */
export function ReviewsProvider({ productId, children }: { productId: string; children: React.ReactNode }) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // A "cancelled" flag instead of AbortController: aborting in cleanup (which
    // Strict Mode does on every dev mount) surfaces as an AbortError in the
    // Next dev overlay even when caught. Stale responses are simply ignored.
    // The product page keys this provider by product id, so moving to another
    // product remounts it with fresh loading/error state.
    let cancelled = false;
    fetch(`/api/reviews?product=${encodeURIComponent(productId)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data: { reviews: ProductReview[] }) => {
        if (!cancelled) setReviews(data.reviews);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const addReview = useCallback((review: ProductReview) => {
    setReviews((current) => [review, ...current]);
  }, []);

  const value = useMemo<Reviews>(() => {
    const histogram = [0, 0, 0, 0, 0];
    let total = 0;
    for (const r of reviews) {
      histogram[r.rating - 1] += 1;
      total += r.rating;
    }
    return {
      reviews,
      loading,
      error,
      average: reviews.length ? total / reviews.length : 0,
      histogram,
      addReview,
    };
  }, [reviews, loading, error, addReview]);

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews(): Reviews {
  const value = useContext(ReviewsContext);
  if (!value) throw new Error("useReviews must be used inside <ReviewsProvider>");
  return value;
}
