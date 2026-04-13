'use client';

import { Lightbox, useLightbox, type LightboxImage } from './Lightbox';

type Columns = 2 | 3 | 4;
type AspectPreset = 'square' | 'landscape' | 'portrait' | 'auto';

interface GalleryGridProps {
  images: LightboxImage[];
  columns?: Columns;
  aspect?: AspectPreset;
  showCaptions?: boolean;
  className?: string;
  itemClassName?: string;
}

const columnClass: Record<Columns, string> = {
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
};

const aspectClass: Record<Exclude<AspectPreset, 'auto'>, string> = {
  square: 'aspect-square',
  landscape: 'aspect-[3/2]',
  portrait: 'aspect-[3/4]',
};

export function GalleryGrid({
  images,
  columns = 3,
  aspect = 'landscape',
  showCaptions = true,
  className = '',
  itemClassName = '',
}: GalleryGridProps) {
  const { openAt, lightboxProps } = useLightbox(images);

  return (
    <>
      <div className={`grid gap-4 md:gap-6 ${columnClass[columns]} ${className}`}>
        {images.map((img, i) => (
          <button
            key={img.src}
            type="button"
            onClick={() => openAt(i)}
            aria-label={`Відкрити зображення: ${img.alt}`}
            className={`group block overflow-hidden rounded-2xl border border-neutral-200 bg-white text-left shadow-sm transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 ${itemClassName}`}
          >
            {aspect === 'auto' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={img.src}
                alt={img.alt}
                className="block h-auto w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              />
            ) : (
              <div className={`relative w-full overflow-hidden ${aspectClass[aspect]}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-"
                />
              </div>
            )}
            {showCaptions && img.caption && (
              <div className="border-t border-neutral-200 bg-white px-5 py-4">
                <p className="text-center text-sm font-medium uppercase tracking-wider text-neutral-700">
                  {img.caption}
                </p>
              </div>
            )}
          </button>
        ))}
      </div>
      <Lightbox {...lightboxProps} />
    </>
  );
}
