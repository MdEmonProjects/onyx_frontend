"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type CartLine = {
  productId: string;
  finishId: string;
  /** Empty when the shopper has not picked an iPhone yet. */
  modelId?: string;
  qty: number;
};

type Cart = {
  lines: CartLine[];
  count: number;
  add: (line: Omit<CartLine, "qty">) => void;
};

const CartContext = createContext<Cart | null>(null);

/**
 * In-memory cart, enough to make the header count and "Add to cart"
 * buttons work on the home page. Swap the state here for your real cart
 * (API calls, cookies or localStorage) when the cart page is built.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const add = useCallback((line: Omit<CartLine, "qty">) => {
    setLines((current) => {
      const match = current.findIndex(
        (l) =>
          l.productId === line.productId &&
          l.finishId === line.finishId &&
          l.modelId === line.modelId,
      );
      if (match === -1) return [...current, { ...line, qty: 1 }];
      return current.map((l, i) => (i === match ? { ...l, qty: l.qty + 1 } : l));
    });
  }, []);

  const value = useMemo<Cart>(
    () => ({ lines, add, count: lines.reduce((sum, l) => sum + l.qty, 0) }),
    [lines, add],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): Cart {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside <CartProvider>");
  return cart;
}
