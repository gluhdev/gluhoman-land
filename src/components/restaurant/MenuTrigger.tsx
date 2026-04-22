'use client';

import type { ReactNode } from 'react';
import { openMenuDialog } from './MenuDialog';

/**
 * Any button that should open the MenuDialog. Use anywhere on the page —
 * hero, menu teaser, floating CTAs, etc.
 */
export function MenuTrigger({
  className = '',
  children,
  'aria-label': ariaLabel,
}: {
  className?: string;
  children: ReactNode;
  'aria-label'?: string;
}) {
  return (
    <button
      type="button"
      onClick={openMenuDialog}
      aria-label={ariaLabel}
      className={className}
    >
      {children}
    </button>
  );
}
