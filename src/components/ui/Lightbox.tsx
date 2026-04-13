'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type JSX,
} from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  open: boolean;
  initialIndex?: number;
  onClose: () => void;
}

export function Lightbox({
  images,
  open,
  initialIndex = 0,
  onClose,
}: LightboxProps): JSX.Element | null {
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(initialIndex);
  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) setIndex(initialIndex);
  }, [open, initialIndex]);

  const count = images.length;
  const hasMany = count > 1;

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + count) % count);
  }, [count]);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % count);
  }, [count]);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Focus management: save prior focus, focus dialog, restore on close
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    // Defer focus to after portal mount
    const id = window.setTimeout(() => {
      containerRef.current?.focus();
    }, 0);
    return () => {
      window.clearTimeout(id);
      previouslyFocused.current?.focus?.();
    };
  }, [open]);

  // Keyboard: Escape, arrows, Tab trap
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowLeft' && hasMany) {
        e.preventDefault();
        goPrev();
      } else if (e.key === 'ArrowRight' && hasMany) {
        e.preventDefault();
        goNext();
      } else if (e.key === 'Tab') {
        // Trap focus inside the dialog
        const container = containerRef.current;
        if (!container) return;
        const focusables = container.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (active === first || !container.contains(active)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, goPrev, goNext, hasMany]);

  if (!mounted || !open || count === 0) return null;

  const current = images[index];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null || !hasMany) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const dx = endX - touchStartX.current;
    if (Math.abs(dx) >= 50) {
      if (dx > 0) goPrev();
      else goNext();
    }
    touchStartX.current = null;
  };

  const overlay = (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Галерея"
      tabIndex={-1}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/95 backdrop-blur-sm outline-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Counter */}
      {hasMany && (
        <div className="pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
          {index + 1} / {count}
        </div>
      )}

      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Закрити"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Prev */}
      {hasMany && (
        <button
          type="button"
          onClick={goPrev}
          aria-label="Попереднє фото"
          className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60 md:h-14 md:w-14"
        >
          <ChevronLeft className="h-7 w-7" />
        </button>
      )}

      {/* Next */}
      {hasMany && (
        <button
          type="button"
          onClick={goNext}
          aria-label="Наступне фото"
          className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/60 md:h-14 md:w-14"
        >
          <ChevronRight className="h-7 w-7" />
        </button>
      )}

      {/* Image + caption */}
      <div className="flex max-h-full max-w-full flex-col items-center justify-center px-4 py-16 md:px-20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={current.src}
          alt={current.alt}
          className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl"
        />
        {current.caption && (
          <p className="mt-4 max-w-2xl text-center text-sm text-white/85 md:text-base">
            {current.caption}
          </p>
        )}
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}

export function useLightbox(images: LightboxImage[]) {
  const [open, setOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const openAt = useCallback((index: number) => {
    setInitialIndex(index);
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  return {
    open,
    openAt,
    close,
    lightboxProps: {
      images,
      open,
      initialIndex,
      onClose: close,
    },
  };
}
