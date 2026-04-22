'use client';

import { useScroll, useTransform, motion, useReducedMotion } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

/**
 * Gentle parallax: background image moves slower than the scroll (≈30%).
 * Honors prefers-reduced-motion.
 */
export function HeroParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <div ref={ref} className="absolute inset-0">
      <motion.div
        style={
          reduce
            ? undefined
            : { y, scale, willChange: 'transform' }
        }
        className="absolute inset-0"
      >
        {children}
      </motion.div>
    </div>
  );
}
