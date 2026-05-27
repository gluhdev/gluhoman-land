'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { useTransition, useEffect, useRef, useState, useCallback } from 'react';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type Code = 'uk' | 'en';

const LABEL: Record<Code, { short: string; long: string }> = {
  uk: { short: 'UA', long: 'Українська' },
  en: { short: 'EN', long: 'English' },
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
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5',
          'text-[12px] font-medium uppercase tracking-[0.16em]',
          'transition-colors duration-150',
          'text-[#0f1f18]/80 hover:text-[#0f1f18]',
          'ring-1 ring-[#0f1f18]/15 hover:ring-[#0f1f18]/35',
          isPending && 'pointer-events-none opacity-60'
        )}
      >
        <Globe className="h-3.5 w-3.5" strokeWidth={1.75} />
        <span>{LABEL[locale].short}</span>
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
                  'flex w-full items-center justify-between gap-3 px-4 py-2.5',
                  'text-[13px] tracking-wide transition-colors',
                  active
                    ? 'bg-[#0f1f18]/5 text-[#0f1f18] font-medium'
                    : 'text-[#0f1f18]/85 hover:bg-[#0f1f18]/5'
                )}
              >
                <span>{LABEL[code].long}</span>
                {active ? (
                  <Check className="h-3.5 w-3.5 text-[#1a3d2e]" strokeWidth={2} />
                ) : (
                  <span className="text-[10px] uppercase tracking-[0.18em] text-[#0f1f18]/50">
                    {LABEL[code].short}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
