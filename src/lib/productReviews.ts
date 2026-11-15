/** A customer review left on a product page (stored by /api/reviews). */
export type ProductReview = {
  id: string;
  productId: string;
  rating: number;
  name: string;
  title: string;
  text: string;
  /** Phone the case was bought for, if the reviewer said. */
  device: string;
  /** ISO date. */
  createdAt: string;
};
