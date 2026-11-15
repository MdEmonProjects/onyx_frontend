"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

/** The live Lenis instance, so route changes can move it as well. */
let lenis: Lenis | null = null;

/**
 * Site-wide smooth scrolling: Lenis eases the wheel and anchor jumps for a
 * smoother, heavier scroll. Skipped for people who ask for reduced motion.
 */
export function ScrollEffects() {
  // Smooth scrolling.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: { offset: -88 },
      autoRaf: true,
    });
    lenis = instance;

    // Menus lock the page by setting overflow: hidden on <html>; pause Lenis meanwhile.
    const root = document.documentElement;
    const syncLock = () => {
      if (root.style.overflow === "hidden") instance.stop();
      else instance.start();
    };
    const mo = new MutationObserver(syncLock);
    mo.observe(root, { attributes: true, attributeFilter: ["style"] });

    return () => {
      mo.disconnect();
      instance.destroy();
      if (lenis === instance) lenis = null;
    };
  }, []);

  /*
   * The reveal-on-scroll lives in globals.css as a CSS scroll-driven
   * animation. It used to set data-reveal on sections from here, but that
   * could touch page markup before React hydrated it (the product page
   * streams in after the layout) and caused hydration mismatch errors.
   */

  // usePathname can suspend under Cache Components; keep that out of the layout's shell.
  return (
    <Suspense fallback={null}>
      <ScrollToTopOnNavigate />
    </Suspense>
  );
}

/**
 * Next.js only scrolls a new page into view when its top is off screen, and
 * Lenis keeps its own idea of the scroll position. Opening a product from far
 * down the home page could therefore land on the next page's footer: the
 * short loading skeleton clamps the old position, then the content streams
 * in above it. So every link navigation starts at the top. Back/forward keeps
 * the browser's restored position, and #anchor links keep their jump.
 */
function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const first = useRef(true);
  const fromHistory = useRef(false);

  useEffect(() => {
    const onPop = () => {
      fromHistory.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (fromHistory.current) {
      fromHistory.current = false;
      lenis?.resize();
      return;
    }
    if (window.location.hash) return;

    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
