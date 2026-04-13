"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth scroll wrapper — desktop only.
 *
 * On touch devices (mobile/tablet) Lenis is DISABLED because:
 *  - It hijacks the browser native momentum scrolling and causes jank
 *  - touchMultiplier adds measurable lag
 *  - fighting iOS/Android overscroll causes visible stutters
 *
 * Desktop (mouse wheel) still benefits from the smooth easing.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect user motion preference
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Detect touch-primary device OR small viewport -> skip Lenis entirely
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const isSmallViewport = window.innerWidth < 1024;
    if (isTouch || isSmallViewport) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
