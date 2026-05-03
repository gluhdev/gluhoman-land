'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';

const FLAGS = {
  uk: (
    <svg viewBox="0 0 24 24" aria-hidden className="block h-full w-full">
      <circle cx="12" cy="12" r="12" fill="#005BBB" />
      <path d="M0 12 a12 12 0 0 0 24 0z" fill="#FFD500" />
    </svg>
  ),
  en: (
    <svg viewBox="0 0 24 24" aria-hidden className="block h-full w-full">
      <defs>
        <clipPath id="circleClip">
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath="url(#circleClip)">
        <rect width="24" height="24" fill="#012169" />
        <path d="M0 0L24 24M24 0L0 24" stroke="#fff" strokeWidth="3" />
        <path d="M0 0L24 24M24 0L0 24" stroke="#C8102E" strokeWidth="1.5" />
        <path d="M12 0V24M0 12H24" stroke="#fff" strokeWidth="4" />
        <path d="M12 0V24M0 12H24" stroke="#C8102E" strokeWidth="2.4" />
      </g>
    </svg>
  ),
} as const;

const LABELS = { uk: 'Українська', en: 'English' } as const;

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as 'uk' | 'en';
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(target: 'uk' | 'en') {
    if (target === locale || isPending) return;
    document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => {
      router.replace(pathname, { locale: target });
    });
  }

  return (
    <div className={cn('flex items-center gap-1.5', className)} role="group" aria-label="Language">
      {(['uk', 'en'] as const).map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            onClick={() => switchTo(code)}
            aria-label={LABELS[code]}
            aria-pressed={active}
            className={cn(
              'relative h-7 w-7 overflow-hidden rounded-full transition-all duration-200',
              'sm:h-7 sm:w-7',
              active
                ? 'scale-105 shadow-[0_0_0_1.5px_var(--color-accent,#c8a661)]'
                : 'scale-100 opacity-50 grayscale hover:opacity-90 hover:grayscale-0',
              isPending && 'pointer-events-none',
            )}
          >
            {FLAGS[code]}
          </button>
        );
      })}
    </div>
  );
}
