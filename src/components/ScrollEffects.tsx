"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Site-wide scroll feel:
 * 1. Lenis eases the wheel and anchor jumps for a smoother, heavier scroll.
 * 2. Sections in <main> fade and rise in as they reach the viewport.
 * Both are skipped for people who ask for reduced motion.
 */
export function ScrollEffects() {
  const pathname = usePathname();

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

  // Reveal on scroll. Re-run on every page change.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(document.querySelectorAll<HTMLElement>("main > section"));
    const fold = window.innerHeight * 0.92;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-reveal", "in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    for (const el of targets) {
      // Anything already on screen stays put, so the first view never flickers.
      if (el.getBoundingClientRect().top < fold) continue;
      el.setAttribute("data-reveal", "");
      io.observe(el);
    }

    return () => io.disconnect();
  }, [pathname]);

  return null;
}
