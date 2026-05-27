'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useTransition, useEffect, useRef, useState, useCallback } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

type Code = 'uk' | 'en';

const LABEL: Record<Code, { short: string; long: string }> = {
  uk: { short: 'UA', long: 'Українська' },
  en: { short: 'EN', long: 'English' },
};

const FLAGS: Record<Code, React.ReactNode> = {
  uk: (
    <svg viewBox="0 0 24 24" aria-hidden className="block h-full w-full">
      <circle cx="12" cy="12" r="12" fill="#005BBB" />
      <path d="M0 12 a12 12 0 0 0 24 0z" fill="#FFD500" />
    </svg>
  ),
  en: (
    <svg viewBox="0 0 24 24" aria-hidden className="block h-full w-full">
      <defs>
        <clipPath id="lsCircleClip">
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath="url(#lsCircleClip)">
        <rect width="24" height="24" fill="#012169" />
        <path d="M0 0L24 24M24 0L0 24" stroke="#fff" strokeWidth="3" />
        <path d="M0 0L24 24M24 0L0 24" stroke="#C8102E" strokeWidth="1.5" />
        <path d="M12 0V24M0 12H24" stroke="#fff" strokeWidth="4" />
        <path d="M12 0V24M0 12H24" stroke="#C8102E" strokeWidth="2.4" />
      </g>
    </svg>
  ),
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Code;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const switchTo = useCallback(
    (target: Code) => {
      setOpen(false);
      if (target === locale || isPending) return;
      document.cookie = `NEXT_LOCALE=${target}; path=/; max-age=31536000; samesite=lax`;
      startTransition(() => {
        router.replace(pathname, { locale: target });
      });
    },
    [locale, isPending, pathname, router]
  );

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={LABEL[locale].long}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full p-1 pr-1.5',
          'transition-all duration-150',
          'ring-1 ring-[#0f1f18]/15 hover:ring-[#0f1f18]/35',
          isPending && 'pointer-events-none opacity-60'
        )}
      >
        <span className="block h-6 w-6 overflow-hidden rounded-full ring-1 ring-[#0f1f18]/5">
          {FLAGS[locale]}
        </span>
        <ChevronDown
          className={cn(
            'h-3 w-3 text-[#0f1f18]/55 transition-transform duration-200',
            open && 'rotate-180'
          )}
          strokeWidth={1.75}
        />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            'absolute right-0 top-full z-50 mt-2 min-w-[160px]',
            'bg-white shadow-[0_18px_40px_-18px_rgba(15,31,24,0.35)]',
            'ring-1 ring-[#0f1f18]/10 overflow-hidden'
          )}
        >
          {(['uk', 'en'] as const).map((code) => {
            const active = code === locale;
            return (
              <button
                key={code}
                type="button"
                role="menuitem"
                onClick={() => switchTo(code)}
                className={cn(
                  'flex w-full items-center gap-3 px-4 py-2.5',
                  'text-[13px] tracking-wide transition-colors',
                  active
                    ? 'bg-[#0f1f18]/5 text-[#0f1f18] font-medium'
                    : 'text-[#0f1f18]/85 hover:bg-[#0f1f18]/5'
                )}
              >
                <span className="block h-5 w-5 overflow-hidden rounded-full ring-1 ring-[#0f1f18]/10 flex-shrink-0">
                  {FLAGS[code]}
                </span>
                <span className="flex-1 text-left">{LABEL[code].long}</span>
                {active && (
                  <Check className="h-3.5 w-3.5 text-[#1a3d2e]" strokeWidth={2} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
