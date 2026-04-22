'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface HallSlide {
  n: number;
  alt: string;
  objectPosition?: string;
}

interface Props {
  photos: HallSlide[];
  light?: boolean;
  aspect?: string;
}

/**
 * Premium horizontal photo slider for restaurant halls.
 *  - Main slide: full-width, scroll-snap, arrows, swipe/trackpad-friendly
 *  - Thumbnail strip underneath: clickable previews so users immediately
 *    see there are more photos to explore
 *  - Gold ring + inner border + soft shadow — matches brand language
 *  - data-lenis-prevent so horizontal wheel inside doesn't fight outer Lenis
 */
export function HallSlider({
  photos,
  light = false,
  aspect = 'aspect-[16/10]',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  const ringColor = light ? 'ring-[#e6d9b8]/15' : 'ring-[#1a3d2e]/15';
  const innerBorder = light ? 'ring-[#e6d9b8]/10' : 'ring-[#1a3d2e]/10';
  const shadow = light
    ? 'shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]'
    : 'shadow-[0_25px_60px_-18px_rgba(26,61,46,0.25)]';
  const btnBg = light
    ? 'bg-[#e6d9b8]/90 text-[#0f1f18] hover:bg-[#f4ecd8] ring-1 ring-[#e6d9b8]/40'
    : 'bg-[#1a3d2e] text-[#f4ecd8] hover:bg-[#0f1f18] ring-1 ring-[#1a3d2e]/40';
  const counterColor = light ? 'text-[#e6d9b8]/60' : 'text-[#1a3d2e]/55';
  const thumbRingActive = light ? 'ring-[#e6d9b8]' : 'ring-[#1a3d2e]';
  const thumbRingIdle = light ? 'ring-[#e6d9b8]/20' : 'ring-[#1a3d2e]/15';

  const scrollByOne = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
  };

  const jumpTo = useCallback((i: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  }, []);

  // Track current slide via inner scroll position
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const handler = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const i = Math.round(el.scrollLeft / el.clientWidth);
        setIdx(i);
      });
    };
    el.addEventListener('scroll', handler, { passive: true });
    return () => {
      el.removeEventListener('scroll', handler);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Keep active thumbnail in view
  useEffect(() => {
    const strip = thumbsRef.current;
    if (!strip) return;
    const active = strip.querySelector<HTMLElement>(`[data-thumb="${idx}"]`);
    if (!active) return;
    const left =
      active.offsetLeft - strip.clientWidth / 2 + active.clientWidth / 2;
    strip.scrollTo({ left, behavior: 'smooth' });
  }, [idx]);

  return (
    <div className="relative">
      {/* Main slide viewport.
          NO data-lenis-prevent* here — that's meant for elements with their
          own *vertical* scroll (like an embedded menu). This slider is
          horizontal-only, so Lenis (with its default gestureOrientation:'vertical')
          correctly ignores horizontal wheel/touch and animates vertical scroll
          of the page. Mixing in data-lenis-prevent would make vertical wheels
          fall through to native scroll while Lenis is still running its RAF
          loop — that caused the jitter.
          touch-action:pan-x lets mobile do horizontal swipe for the slider
          while vertical swipes bubble to the page scroll. */}
      <div
        ref={ref}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide [touch-action:pan-x] [overscroll-behavior-x:contain]"
        style={{ scrollbarWidth: 'none' }}
      >
        {photos.map((p, i) => (
          <div key={`${p.n}-${i}`} className="min-w-full shrink-0 snap-start">
            <div
              className={`group relative ${aspect} overflow-hidden rounded-[4px] ring-1 ${ringColor} ${shadow}`}
            >
              <Image
                src={`/images/restaurant/doc/${p.n}.jpg`}
                alt={p.alt}
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                style={
                  p.objectPosition ? { objectPosition: p.objectPosition } : undefined
                }
                className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
              />
              <div
                aria-hidden
                className={`absolute inset-2 rounded-[2px] ring-1 ring-inset ${innerBorder} pointer-events-none`}
              />
            </div>
          </div>
        ))}
      </div>

      {photos.length > 1 && (
        <>
          {/* Prev/next arrows — positioned on the main slide */}
          <button
            type="button"
            onClick={() => scrollByOne(-1)}
            aria-label="Попереднє фото"
            className={`absolute left-3 md:left-5 top-[40%] -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center ${btnBg} transition-colors shadow-lg backdrop-blur-sm`}
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => scrollByOne(1)}
            aria-label="Наступне фото"
            className={`absolute right-3 md:right-5 top-[40%] -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center ${btnBg} transition-colors shadow-lg backdrop-blur-sm`}
          >
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </button>

          {/* Thumbnail strip — signals "more photos available" */}
          <div className="mt-5 flex items-center gap-4">
            <div
              ref={thumbsRef}
              className="flex-1 flex items-center gap-2.5 overflow-x-auto scrollbar-hide [touch-action:pan-x] [overscroll-behavior-x:contain]"
              style={{ scrollbarWidth: 'none' }}
            >
              {photos.map((p, i) => {
                const active = i === idx;
                return (
                  <button
                    key={`thumb-${p.n}-${i}`}
                    data-thumb={i}
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-label={`Фото ${i + 1}`}
                    aria-current={active}
                    className={`relative shrink-0 overflow-hidden rounded-[3px] transition-all duration-500 ease-out ${
                      active
                        ? `w-20 h-16 md:w-[88px] md:h-[64px] ring-2 ring-offset-2 ${thumbRingActive} ${
                            light ? 'ring-offset-[#0f1f18]' : 'ring-offset-[#faf6ec]'
                          }`
                        : `w-14 h-14 md:w-16 md:h-16 ring-1 ${thumbRingIdle} opacity-75 hover:opacity-100`
                    }`}
                  >
                    <Image
                      src={`/images/restaurant/doc/${p.n}.jpg`}
                      alt=""
                      fill
                      sizes="88px"
                      style={
                        p.objectPosition
                          ? { objectPosition: p.objectPosition }
                          : undefined
                      }
                      className="object-cover"
                    />
                    {!active && (
                      <div
                        aria-hidden
                        className={`absolute inset-0 ${
                          light ? 'bg-[#0f1f18]/20' : 'bg-[#faf6ec]/15'
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <span
              className={`shrink-0 text-[10px] uppercase tracking-[0.32em] font-display ${counterColor}`}
            >
              {String(idx + 1).padStart(2, '0')}
              <span className="mx-1 opacity-50">/</span>
              {String(photos.length).padStart(2, '0')}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
