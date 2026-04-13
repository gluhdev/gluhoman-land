"use client";

import { useEffect, useState } from "react";

/**
 * Detects touch-primary devices and small viewports so expensive effects
 * (parallax, scroll-linked transforms, Lenis smooth scroll) can be skipped.
 *
 * Returns true on:
 *  - Any device whose primary pointer is coarse (phones, tablets)
 *  - Any desktop resized below 1024px (editing narrow windows)
 *  - Users with `prefers-reduced-motion: reduce`
 *
 * The hook runs client-only; SSR returns `false` (desktop assumption)
 * and flips on mount. Effects that read it should gracefully fall back.
 */
export function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const update = () => {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const small = window.innerWidth < 1024;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setIsTouch(coarse || small || reduced);
    };

    update();

    // Re-evaluate on resize AND orientationchange (iOS address-bar collapse)
    const coarseQuery = window.matchMedia("(pointer: coarse)");
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    window.addEventListener("resize", update, { passive: true });
    window.addEventListener("orientationchange", update, { passive: true });
    coarseQuery.addEventListener?.("change", update);
    reducedQuery.addEventListener?.("change", update);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      coarseQuery.removeEventListener?.("change", update);
      reducedQuery.removeEventListener?.("change", update);
    };
  }, []);

  return isTouch;
}
