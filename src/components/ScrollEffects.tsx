"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

/**
 * Site-wide smooth scrolling: Lenis eases the wheel and anchor jumps for a
 * smoother, heavier scroll. Skipped for people who ask for reduced motion.
 */
export function ScrollEffects() {
  // Smooth scrolling.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: { offset: -88 },
      autoRaf: true,
    });

    // Menus lock the page by setting overflow: hidden on <html>; pause Lenis meanwhile.
    const root = document.documentElement;
    const syncLock = () => {
      if (root.style.overflow === "hidden") lenis.stop();
      else lenis.start();
    };
    const mo = new MutationObserver(syncLock);
    mo.observe(root, { attributes: true, attributeFilter: ["style"] });

    return () => {
      mo.disconnect();
      lenis.destroy();
    };
  }, []);

  /*
   * The reveal-on-scroll lives in globals.css as a CSS scroll-driven
   * animation. It used to set data-reveal on sections from here, but that
   * could touch page markup before React hydrated it (the product page
   * streams in after the layout) and caused hydration mismatch errors.
   */
  return null;
}
