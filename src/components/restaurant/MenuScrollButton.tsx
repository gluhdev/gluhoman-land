'use client';

import { UtensilsCrossed, ArrowUpRight } from 'lucide-react';
import type { ReactNode } from 'react';

interface Props {
  className?: string;
  children?: ReactNode;
  targetId?: string;
}

/**
 * Smoothly scrolls the page to an anchored section.
 * Works alongside Lenis: we compute the absolute Y and call window.scrollTo,
 * which Lenis proxies and animates.
 */
export function MenuScrollButton({ className = '', children, targetId = 'menu' }: Props) {
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 16;
    window.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', `#${targetId}`);
  };

  return (
    <a href={`#${targetId}`} onClick={onClick} className={className}>
      {children ?? (
        <>
          <UtensilsCrossed className="w-4 h-4" strokeWidth={2} />
          Переглянути меню
          <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
        </>
      )}
    </a>
  );
}
