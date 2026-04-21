"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Smooth scroll via Lenis — desktop only.
 *
 * CRITICAL: html and body MUST NOT have overflow-x:hidden,
 * overflow:hidden, overscroll-behavior, or height:100% — any of
 * these creates a scroll container that fights Lenis on macOS.
 * See memory: feedback_macos_scroll_fix.md
 *
 * On touch devices Lenis is DISABLED — native momentum scrolling
 * is better than anything JS can replicate.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const isSmallViewport = window.innerWidth < 1024;
    if (isTouch || isSmallViewport) return;

    const lenis = new Lenis({
      duration: 1.2,
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
