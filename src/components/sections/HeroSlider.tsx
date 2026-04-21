'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Calendar, ArrowRight } from 'lucide-react';
import { openBookingDialog } from '@/components/ui/BookingDialog';

type SplashPanel = {
  href: string;
  label: string;
  image: string;
};

type Slide = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
  href?: string;
  seasonLocked?: boolean;
  panels?: SplashPanel[];
};

const SLIDES: Slide[] = [
  {
    id: 'splash',
    eyebrow: 'Головна',
    title: 'Глухомань',
    description:
      'Ресторан, готель, аквапарк і лазня на дровах — чотири напрямки відпочинку в одному місці. Оберіть свій вечір.',
    panels: [
      { href: '/restaurant', label: 'Ресторан', image: '/images/restaurant/terrace_hall_with_logo.jpg' },
      { href: '/hotel', label: 'Готель', image: '/images/9.jpg' },
      { href: '/sauna', label: 'Лазня', image: '/images/sauna/chan_exterior_stone_steps.jpg' },
      { href: '/aquapark', label: 'Аквапарк', image: '/images/akvapark.webp' },
    ],
  },
  {
    id: 'restaurant',
    eyebrow: 'Ресторан',
    title: 'Ресторан «Глухомань»',
    description:
      'Двоповерховий ресторан у старовинному казковому стилі, крита тераса і три літні майданчики на воді. Українська піч на дровах, крафтове пиво та жива музика на вихідних.',
    image: '/images/restaurant/terrace_hall_with_logo.jpg',
    href: '/restaurant',
  },
  {
    id: 'hotel',
    eyebrow: 'Готель',
    title: 'Готель «Глухомань»',
    description:
      'Затишні номери на території комплексу з видом на ставок, лебедів та фонтани. Поруч — ресторан, аквапарк і лазня на дровах.',
    image: '/images/9.jpg',
    href: '/hotel',
  },
  {
    id: 'sauna',
    eyebrow: 'Лазня',
    title: 'Лазня на дровах',
    description:
      'Чани на дровах з карпатськими травами, парна, дубові та бамбукові віники, масажі і кімнати відпочинку із самоварами.',
    image: '/images/sauna/exterior_small_sauna_building.jpg',
    href: '/sauna',
  },
  {
    id: 'aquapark',
    eyebrow: 'Аквапарк',
    title: 'Аквапарк «Глухомань»',
    description:
      'Відкритий аквапарк з водними гірками, басейнами з підігрівом та окремою дитячою зоною. Працює у літній сезон.',
    image: '/images/akvapark.webp',
    href: '/aquapark',
    seasonLocked: true,
  },
];

const AUTOPLAY_MS = 4000;
const SPLASH_AUTOPLAY_MS = 4000;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragStartX = useRef<number | null>(null);
  const dragStartY = useRef<number | null>(null);
  // Max horizontal distance travelled between pointerdown and pointerup.
  // Read by onClickCapture to decide whether to suppress the click on
  // child <Link>s — so drags don't accidentally trigger navigation.
  const dragDistance = useRef(0);

  const goTo = useCallback((i: number) => {
    setIndex((prev) => (i + SLIDES.length) % SLIDES.length);
    void prev;
  }, []);

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), []);
  const prev = useCallback(() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const delay = SLIDES[index].panels ? SPLASH_AUTOPLAY_MS : AUTOPLAY_MS;
    const t = setTimeout(next, delay);
    return () => clearTimeout(t);
  }, [index, paused, next]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.button !== 0) return;
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    dragDistance.current = 0;
    // NO setPointerCapture — it redirects all pointer events to the
    // section, which prevents child <Link> elements from receiving
    // their click events. onDragStart={preventDefault} on the section
    // already blocks native HTML5 image/link drag, so pointermove
    // events bubble up normally without capture.
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const dx = Math.abs(e.clientX - dragStartX.current);
    if (dx > dragDistance.current) dragDistance.current = dx;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX.current === null || dragStartY.current === null) return;
    const dx = e.clientX - dragStartX.current;
    const dy = e.clientY - dragStartY.current;
    // Require mostly-horizontal drag of at least 50 px. Prevents accidental
    // swipes from vertical scroll momentum.
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      (dx < 0 ? next : prev)();
    }
    dragStartX.current = null;
    dragStartY.current = null;
    // dragDistance.current is read by onClickCapture right after this
    // in the click event flow — it is reset there.
  };

  const onPointerCancel = () => {
    dragStartX.current = null;
    dragStartY.current = null;
    dragDistance.current = 0;
  };

  // Capture-phase click handler runs BEFORE child <Link> click handlers.
  // If the user just finished a real drag (> 10 px horizontally), we
  // suppress the child click so the slider doesn't accidentally navigate
  // away to a panel route. Small movements are treated as genuine clicks.
  const onClickCapture = (e: React.MouseEvent) => {
    if (dragDistance.current > 10) {
      e.preventDefault();
      e.stopPropagation();
    }
    dragDistance.current = 0;
  };

  return (
    <section
      id="hero-section"
      className="hero-section relative h-[100svh] max-h-[100svh] w-full overflow-clip bg-black touch-pan-y select-none cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onClickCapture={onClickCapture}
      // Kill native HTML5 drag-and-drop for ALL descendants (<img>, <a>).
      // Without this the browser starts a link/image drag on mousedown
      // and steals subsequent pointermove events from React, so the
      // slider drag handler never sees the movement.
      onDragStart={(e) => e.preventDefault()}
      aria-roledescription="carousel"
    >
      {/* Slides */}
      {SLIDES.map((slide, i) => {
        const active = i === index;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
              active ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
            aria-hidden={!active}
          >
            {slide.panels ? (
              <div className="absolute inset-0 bg-[#0f1f18]">
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1.5 p-1.5">
                  {slide.panels.map((panel) => (
                    <Link
                      key={panel.href}
                      href={panel.href}
                      className="group/tile relative block overflow-hidden rounded-2xl"
                      aria-label={panel.label}
                    >
                      <Image
                        src={panel.image}
                        alt={panel.label}
                        fill
                        priority={i === 0}
                        sizes="50vw"
                        quality={90}
                        className="object-cover [@media(hover:hover)]:transition-transform [@media(hover:hover)]:duration-[1400ms] ease-out [@media(hover:hover)]:group-hover/tile:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-black/25 transition-opacity duration-500 group-hover/tile:bg-black/15" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
                        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/70 mb-2">
                          <span className="h-px w-6 bg-white/50" />
                          Обрати
                        </div>
                        <div
                          className="font-display text-white text-3xl md:text-4xl lg:text-5xl font-light tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]"
                        >
                          {panel.label}
                        </div>
                      </div>
                      <div className="absolute right-6 bottom-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-md text-white opacity-0 translate-x-2 transition-all duration-500 group-hover/tile:opacity-100 group-hover/tile:translate-x-0">
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="absolute inset-0">
                <Image
                  src={slide.image!}
                  alt={slide.title}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  quality={95}
                  className="object-cover"
                />
              </div>
            )}
            {!slide.panels && (
              <>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/60 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />
              </>
            )}
            {slide.panels && (
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none z-[5]" />
            )}
          </div>
        );
      })}

      {/* Content */}
      <div className="relative z-20 h-full flex items-center pointer-events-none">
        <div className="max-w-7xl mx-auto w-full px-6 lg:px-12">
          <div className="max-w-3xl">
            {SLIDES.map((slide, i) => {
              const active = i === index;
              // On splash slide, hide the text block entirely — tiles are self-explanatory.
              if (slide.panels) return null;
              return (
                <div
                  key={slide.id}
                  className={`pointer-events-auto transition-all duration-1000 ${
                    active
                      ? 'opacity-100 translate-y-0 relative'
                      : 'opacity-0 translate-y-6 absolute pointer-events-none'
                  }`}
                >
                  <h1
                    className="font-display text-white mb-6 drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                    style={{
                      fontSize: "clamp(2.75rem, 6.5vw, 6.5rem)",
                      lineHeight: 0.95,
                      letterSpacing: "-0.02em",
                      fontWeight: 300,
                    }}
                  >
                    {slide.title}
                  </h1>

                  <p className="text-base md:text-lg text-white/85 max-w-2xl mb-10 leading-relaxed">
                    {slide.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    {slide.seasonLocked ? (
                      <div
                        className="group inline-flex flex-col items-start justify-center gap-0.5 px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/30 text-white/90 font-semibold text-base cursor-not-allowed"
                        aria-disabled
                      >
                        <span className="inline-flex items-center gap-3">
                          <Calendar className="h-5 w-5" />
                          Бронювання з травня
                        </span>
                        <span className="text-xs font-normal tracking-normal text-white/60 ml-8">
                          Аквапарк працює влітку
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => openBookingDialog()}
                        className="group inline-flex items-center justify-center gap-3 px-9 py-4 rounded-full bg-white text-[#0f1f18] font-medium text-sm uppercase tracking-[0.18em] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.4)] hover:bg-[#faf6ec] hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <Calendar className="h-4 w-4" />
                        Забронювати
                      </button>
                    )}

                    {slide.href && (
                      <Link
                        href={slide.href}
                        className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full border-2 border-white bg-black/50 backdrop-blur-md text-white font-semibold text-base shadow-xl hover:bg-black/70 hover:scale-[1.03] transition-all duration-300"
                      >
                        Детальніше
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        aria-label="Попередній слайд"
        className="group absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/30 bg-black/30 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 [@media(hover:hover)]:hover:scale-110 transition-all duration-300"
      >
        <ChevronLeft className="h-6 w-6 group-hover:-translate-x-0.5 transition-transform" />
      </button>
      <button
        onClick={next}
        aria-label="Наступний слайд"
        className="group absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/30 bg-black/30 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 [@media(hover:hover)]:hover:scale-110 transition-all duration-300"
      >
        <ChevronRight className="h-6 w-6 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* Dots + progress — hidden on splash slide (it already has tile labels) */}
      <div
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 transition-opacity duration-500 ${
          SLIDES[index].panels ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {SLIDES.map((s, i) => {
          const active = i === index;
          return (
            <button
              key={s.id}
              onClick={() => goTo(i)}
              aria-label={`Слайд ${i + 1}: ${s.eyebrow}`}
              className="group flex flex-col items-center gap-2"
            >
              <div
                className={`relative h-[2px] transition-all duration-500 ${
                  active ? 'w-14 bg-white/30' : 'w-8 bg-white/30 group-hover:bg-white/50'
                }`}
              >
                {active && !paused && (
                  <span
                    key={index}
                    className="absolute inset-y-0 left-0 bg-accent animate-progress"
                    style={{ animationDuration: `${AUTOPLAY_MS}ms` }}
                  />
                )}
                {active && paused && (
                  <span className="absolute inset-0 bg-accent" />
                )}
              </div>
              <span
                className={`text-[10px] tracking-[0.2em] uppercase transition-colors duration-300 ${
                  active ? 'text-white' : 'text-white/50 group-hover:text-white/80'
                }`}
              >
                {s.eyebrow}
              </span>
            </button>
          );
        })}
      </div>

    </section>
  );
}
