'use client';

import Image from 'next/image';
import { Expand } from 'lucide-react';
import { Lightbox, useLightbox } from '@/components/ui/Lightbox';

export interface PriceCard {
  n: number;
  label: string;
  caption: string;
}

interface Props {
  cards: PriceCard[];
  base?: string;
}

/**
 * Premium price-card grid for sauna services.
 * — Компактные thumbnails с подписью, 2 кол. на мобайле / 3 на планшете / 5 на десктопе
 * — Клик → open full-size in Lightbox со свайпом/стрелками/закрытием
 * — Gold-leaf hover frame, brand palette
 */
export function PriceGrid({ cards, base = '/images/sauna/doc/' }: Props) {
  const images = cards.map((c) => ({
    src: `${base}${c.n}.jpg`,
    alt: c.label,
    caption: c.caption,
  }));
  const { openAt, lightboxProps } = useLightbox(images);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
        {cards.map((c, i) => (
          <button
            key={c.n}
            type="button"
            onClick={() => openAt(i)}
            className="group relative text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a3d2e] focus-visible:ring-offset-2 focus-visible:ring-offset-[#faf6ec] rounded-[4px]"
            aria-label={`Відкрити прайс «${c.label}»`}
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-[4px] ring-1 ring-[#1a3d2e]/15 bg-white shadow-[0_10px_30px_-12px_rgba(26,61,46,0.25)] transition-all duration-500 group-hover:shadow-[0_20px_40px_-12px_rgba(26,61,46,0.35)] group-hover:ring-[#1a3d2e]/30 group-hover:-translate-y-0.5">
              <Image
                src={`${base}${c.n}.jpg`}
                alt={c.label}
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              {/* Gold inner border */}
              <div
                aria-hidden
                className="absolute inset-1.5 rounded-[2px] ring-1 ring-inset ring-[#e6d9b8]/0 group-hover:ring-[#e6d9b8]/60 transition-colors duration-500 pointer-events-none"
              />
              {/* Zoom hint overlay */}
              <div
                aria-hidden
                className="absolute inset-0 flex items-center justify-center bg-[#0f1f18]/0 group-hover:bg-[#0f1f18]/30 transition-colors duration-300"
              >
                <span className="flex items-center gap-1.5 rounded-full bg-[#0f1f18]/85 text-[#e6d9b8] text-[10px] uppercase tracking-[0.22em] px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                  <Expand className="w-3 h-3" strokeWidth={2} />
                  Відкрити
                </span>
              </div>
            </div>
            <p className="mt-2.5 text-center text-[11px] md:text-[12px] uppercase tracking-[0.18em] text-[#0f1f18]/70 font-medium leading-snug">
              {c.label}
            </p>
          </button>
        ))}
      </div>
      <Lightbox {...lightboxProps} />
    </>
  );
}
