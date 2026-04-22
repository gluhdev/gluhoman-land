'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  shown: { opacity: 1, y: 0 },
};

/**
 * Scroll-triggered fade + subtle rise. Premium pacing: 900ms with custom
 * ease so movement feels effortless. Fires once per viewport entry.
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = '',
  as = 'div',
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'section' | 'figure' | 'header';
}) {
  const Tag = motion[as];
  return (
    <Tag
      initial={{ opacity: 0, y }}
      whileInView="shown"
      viewport={{ once: true, margin: '-60px' }}
      variants={variants}
      transition={{ duration: 0.9, delay, ease: [0.19, 1, 0.22, 1] }}
      className={className}
    >
      {children}
    </Tag>
  );
}
