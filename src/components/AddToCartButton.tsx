"use client";

import { useEffect, useState } from "react";
import { useCart, type CartLine } from "./CartProvider";
import { CheckIcon } from "./Icons";

type Props = {
  line: Omit<CartLine, "qty">;
  className?: string;
  /** Short label for tight spots such as product cards. */
  compact?: boolean;
  /** Read by screen readers so each button says what it adds. */
  itemName?: string;
};

/** Adds one case to the cart and confirms it on the button itself. */
export function AddToCartButton({ line, className, compact, itemName }: Props) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(timer);
  }, [added]);

  return (
    <button
      type="button"
      className={className}
      aria-label={itemName ? `Add ${itemName} to cart` : undefined}
      onClick={() => {
        add(line);
        setAdded(true);
      }}
    >
      {added ? (
        <>
          <CheckIcon />
          Added
        </>
      ) : (
        <>{compact ? "Add" : "Add to cart"}</>
      )}
      <span className="srOnly" role="status">
        {added ? "Added to cart" : ""}
      </span>
    </button>
  );
}
