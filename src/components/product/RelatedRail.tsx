"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/catalog";
import { ChevronLeftIcon, ChevronRightIcon } from "../Icons";
import { ProductCard } from "../ProductCard";
import styles from "./RelatedRail.module.css";

/** "You may also like": one row of cards that scrolls sideways. */
export function RelatedRail({ products }: { products: Product[] }) {
  const listRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);

  const sync = () => {
    const list = listRef.current;
    if (!list) return;
    setAtStart(list.scrollLeft <= 4);
    setAtEnd(list.scrollLeft + list.clientWidth >= list.scrollWidth - 4);
  };

  // Re-check the arrows when the row is first measured and whenever it resizes.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new ResizeObserver(sync);
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  const move = (direction: 1 | -1) => {
    const list = listRef.current;
    if (!list) return;
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollBy({ left: direction * list.clientWidth * 0.8, behavior: smooth ? "smooth" : "auto" });
  };

  return (
    <>
      <div className={styles.head}>
        <h2 id="related-title" className={styles.heading}>
          You may also like
        </h2>
        {!(atStart && atEnd) && (
          <div className={styles.arrows}>
            <button type="button" onClick={() => move(-1)} disabled={atStart} aria-label="Previous products">
              <ChevronLeftIcon />
            </button>
            <button type="button" onClick={() => move(1)} disabled={atEnd} aria-label="More products">
              <ChevronRightIcon />
            </button>
          </div>
        )}
      </div>

      <ul ref={listRef} className={styles.list} onScroll={sync}>
        {products.map((product) => (
          <li key={product.id} className={styles.item}>
            {/* Same card as the home page grid, so both look identical. */}
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </>
  );
}
