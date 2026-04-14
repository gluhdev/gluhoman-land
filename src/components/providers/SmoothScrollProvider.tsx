"use client";

/**
 * SmoothScrollProvider — currently a NO-OP pass-through.
 *
 * Removed Lenis because the combination of Lenis' wheel hijacking
 * with the surrounding CSS (see mobile.css / globals.css html+body
 * rules) caused mouse-wheel scroll to break on desktop. Native
 * browser scroll works fine now; smooth easing is a nice-to-have
 * that is not worth a P0 regression.
 *
 * If smooth scrolling becomes a requirement again, prefer the
 * one-liner `html { scroll-behavior: smooth }` in globals.css over
 * a JS library — it never fights the browser scroller.
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
