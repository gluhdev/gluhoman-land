"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useTranslations } from "next-intl";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { BLUR_CREAM } from "@/lib/blur";

/** True when slide `i` is the current one or an immediate neighbour (with wrap).
 *  Those get eager loading so the next/prev photo is already cached before the
 *  user clicks — no white flash on navigation. Far slides stay lazy to save
 *  bandwidth on slow mobile connections. */
function nearby(i: number, idx: number, count: number): boolean {
  return (
    i === idx ||
    i === (idx + 1) % count ||
    i === (idx - 1 + count) % count
  );
}

interface RoomGalleryProps {
  images: string[];
  alt: string;
}

export default function RoomGallery({ images, alt }: RoomGalleryProps) {
  const t = useTranslations("booking_page");
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const count = images.length;

  const goPrev = useCallback(() => {
    setIdx((i) => (i - 1 + count) % count);
  }, [count]);

  const goNext = useCallback(() => {
    setIdx((i) => (i + 1) % count);
  }, [count]);

  if (count === 0) return null;

  return (
    <div className="w-full min-w-0">
      <div className="relative w-full aspect-[16/10] rounded-[2px] ring-1 ring-[#1a3d2e]/10 overflow-hidden bg-[#faf6ec]">
        {/* All slides stay mounted in a translate track: already-seen photos are
            instant on the way back, and neighbours preload so the next click has
            its image ready. */}
        <div
          className="flex h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${idx * 100}%)` }}
        >
          {images.map((src, i) => (
            <div
              key={src}
              className="relative h-full w-full shrink-0 grow-0 basis-full bg-[#faf6ec]"
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes="(min-width:1024px) 60vw, 100vw"
                placeholder="blur"
                blurDataURL={BLUR_CREAM}
                {...(i === 0
                  ? { priority: true }
                  : { loading: nearby(i, idx, count) ? "eager" : "lazy" })}
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Transparent overlay opens the lightbox (sits under the nav arrows). */}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("gallery_open")}
          className="absolute inset-0 z-[1] cursor-zoom-in"
        />

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label={t("gallery_prev")}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#0b1410]/60 p-2 text-[#faf6ec] ring-1 ring-[#e6d9b8]/30 transition hover:bg-[#0b1410]/80"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label={t("gallery_next")}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#0b1410]/60 p-2 text-[#faf6ec] ring-1 ring-[#e6d9b8]/30 transition hover:bg-[#0b1410]/80"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        <div className="absolute bottom-2 right-2 z-10 rounded bg-[#0b1410]/70 px-2 py-0.5 text-xs text-white">
          {idx + 1}/{count}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIdx(i)}
              aria-current={i === idx}
              className={`relative h-16 w-20 shrink-0 rounded-[2px] overflow-hidden transition ${
                i === idx ? "ring-2 ring-[#1a3d2e]" : "ring-1 ring-[#1a3d2e]/15"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="80px"
                loading="lazy"
                placeholder="blur"
                blurDataURL={BLUR_CREAM}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {open && (
        <Lightbox
          images={images}
          alt={alt}
          startIndex={idx}
          onIndexChange={setIdx}
          onClose={() => setOpen(false)}
          closeRef={closeRef}
          restoreFocusTo={triggerRef}
        />
      )}
    </div>
  );
}

interface LightboxProps {
  images: string[];
  alt: string;
  startIndex: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
  closeRef: React.RefObject<HTMLButtonElement | null>;
  restoreFocusTo: React.RefObject<HTMLButtonElement | null>;
}

function Lightbox({
  images,
  alt,
  startIndex,
  onIndexChange,
  onClose,
  closeRef,
  restoreFocusTo,
}: LightboxProps) {
  const t = useTranslations("booking_page");
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Sync inline index with embla selection.
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => onIndexChange(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onIndexChange]);

  // Keyboard handling (open-gated by mount).
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        scrollPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        scrollNext();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, scrollPrev, scrollNext]);

  // Focus management + body scroll lock.
  useEffect(() => {
    const trigger = restoreFocusTo.current;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      trigger?.focus();
    };
  }, [closeRef, restoreFocusTo]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[120] bg-[#0b1410]/95 flex items-center justify-center"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label={t("gallery_close")}
        className="absolute right-4 top-4 z-10 rounded-full bg-[#0b1410]/60 p-2 text-[#faf6ec] ring-1 ring-[#e6d9b8]/30 transition hover:bg-[#0b1410]/80"
      >
        <X className="h-6 w-6" />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            aria-label={t("gallery_prev")}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#0b1410]/60 p-2 text-[#faf6ec] ring-1 ring-[#e6d9b8]/30 transition hover:bg-[#0b1410]/80"
          >
            <ChevronLeft className="h-7 w-7" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            aria-label={t("gallery_next")}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#0b1410]/60 p-2 text-[#faf6ec] ring-1 ring-[#e6d9b8]/30 transition hover:bg-[#0b1410]/80"
          >
            <ChevronRight className="h-7 w-7" />
          </button>
        </>
      )}

      <div className="h-full w-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {images.map((src) => (
            <div key={src} className="relative h-full min-w-0 flex-[0_0_100%]">
              <Image
                src={src}
                alt={alt}
                fill
                sizes="100vw"
                placeholder="blur"
                blurDataURL={BLUR_CREAM}
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
