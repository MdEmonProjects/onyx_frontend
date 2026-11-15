/**
 * SAMPLE reviews and community clips. Every review below is placeholder
 * text: replace it with real customer reviews (with their permission)
 * before the site goes live. Never publish made-up reviews as real ones.
 */

export type ReviewTone = "onyx" | "tan" | "honed" | "rose" | "glacier";

export type Review = {
  id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  name: string;
  /** Product the review is about (id from catalog.ts). */
  productId: string;
  /** Finish the customer bought, shown under the product name. */
  finish: string;
  /** Small product photo inside /public. */
  thumb: string;
  tone: ReviewTone;
};

export const reviews: Review[] = [
  {
    id: "r1",
    rating: 5,
    quote: "Sample review. Replace with a real one: what the customer liked, in their own words.",
    name: "Customer name",
    productId: "banded",
    finish: "Onyx",
    thumb: "/images/10005.jpeg",
    tone: "onyx",
  },
  {
    id: "r2",
    rating: 5,
    quote: "Sample review. The grip is good and the buttons still click properly after a month.",
    name: "Customer name",
    productId: "saddle",
    finish: "Tan",
    thumb: "/images/10006.jpeg",
    tone: "tan",
  },
  {
    id: "r3",
    rating: 5,
    quote: "Sample review. Thin enough that the phone still fits in my pocket, MagSafe works fine.",
    name: "Customer name",
    productId: "aramid-weave",
    finish: "Black",
    thumb: "/images/10007.jpeg",
    tone: "honed",
  },
  {
    id: "r4",
    rating: 5,
    quote: "Sample review. Delivered to Chattogram in three days, packed well.",
    name: "Customer name",
    productId: "strata",
    finish: "Rose quartz",
    thumb: "/images/10008.jpeg",
    tone: "rose",
  },
  {
    id: "r5",
    rating: 5,
    quote: "Sample review. Clear case that has not turned yellow, shows the phone colour.",
    name: "Customer name",
    productId: "frost-clear",
    finish: "On glacier",
    thumb: "/images/10009.jpeg",
    tone: "glacier",
  },
  {
    id: "r6",
    rating: 5,
    quote: "Sample review. Bought it as a gift and the box looked premium.",
    name: "Customer name",
    productId: "stitch",
    finish: "Moss",
    thumb: "/images/10010.jpeg",
    tone: "tan",
  },
];

/** Customer clips in /public/reviews. They play muted, on a loop. */
export const communityClips = [
  { id: "c1", src: "/reviews/1.mp4", productId: "banded" },
  { id: "c2", src: "/reviews/2.mp4", productId: "saddle" },
  { id: "c3", src: "/reviews/3.mp4", productId: "aramid-weave" },
  { id: "c4", src: "/reviews/4.mp4", productId: "frost-clear" },
];
