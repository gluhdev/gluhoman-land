"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Slide = { src: string; caption: string; tag: string };

const SLIDES: Slide[] = [
  { src: "/images/restaurant/terrace_hall_green_columns_far.jpg", caption: "Тераса серед зелених колон", tag: "Ресторан" },
  { src: "/images/sauna/chan_carpathian_herbs_steam.jpg", caption: "Чан з карпатськими травами", tag: "Лазня" },
  { src: "/images/restaurant/main_hall_long_table_evening.jpg", caption: "Вечір у головній залі", tag: "Ресторан" },
  { src: "/images/sauna/relaxation_room_big_sauna_leather_sofa.jpg", caption: "Кімната відпочинку з шкіряним диваном", tag: "Лазня" },
  { src: "/images/restaurant/hall_fireplace_balcony.jpg", caption: "Зала з каміном", tag: "Ресторан" },
  { src: "/images/sauna/pool_big_sauna_indoor_full.jpg", caption: "Басейн великої лазні", tag: "Лазня" },
  { src: "/images/restaurant/ukrainian_clay_oven_pich_food.jpg", caption: "Страви з української печі", tag: "Кухня" },
  { src: "/images/sauna/small_sauna_outdoor_pool_barrel.jpg", caption: "Зовнішній басейн-бочка", tag: "Лазня" },
  { src: "/images/restaurant/bar_rustic_tree_trunk.jpg", caption: "Бар із живого дерева", tag: "Ресторан" },
  { src: "/images/restaurant/hall_floor1_rustic_wide.jpg", caption: "Рустикальна зала", tag: "Ресторан" },
];

export default function HomeGallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true, containScroll: "trimSnaps" },
    [Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })]
  );
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    setSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
  }, [emblaApi]);

  return (
    <section className="relative overflow-hidden bg-[#faf6ec] py-28 md:py-36">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.36 }}
          className="flex items-end justify-between gap-8 border-b border-[#1a3d2e]/15 pb-10"
        >
          <div>
            <p className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.32em] text-[#1a3d2e]/70">
              <span className="h-px w-10 bg-[#1a3d2e]/40" />
              Галерея &nbsp;—&nbsp; Сорок кадрів тиші
            </p>
            <h2
              className="font-display text-[#1a3d2e]"
              style={{
                fontSize: "clamp(2.25rem, 5vw, 4.75rem)",
                lineHeight: 0.98,
                letterSpacing: "-0.02em",
                fontWeight: 300,
              }}
            >
              Декілька <span className="italic">настроїв</span>, зроблених
              <br className="hidden md:block" /> у Глухомані
            </h2>
          </div>

          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <button
              onClick={scrollPrev}
              aria-label="Попередній слайд"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#1a3d2e]/25 text-[#1a3d2e] transition-colors hover:border-[#1a3d2e] hover:bg-[#1a3d2e] hover:text-[#f4ecd8]"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={scrollNext}
              aria-label="Наступний слайд"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-[#1a3d2e]/25 text-[#1a3d2e] transition-colors hover:border-[#1a3d2e] hover:bg-[#1a3d2e] hover:text-[#f4ecd8]"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Embla edge-to-edge */}
      <div className="mt-14">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex touch-pan-y gap-5 pl-6 pr-6 md:gap-6 md:pl-12 md:pr-12 lg:pl-16 lg:pr-16">
            {SLIDES.map((s, i) => (
              <div
                key={s.src}
                className="relative shrink-0 basis-[80%] sm:basis-[55%] md:basis-[42%] lg:basis-[34%] xl:basis-[28%]"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#1a3d2e]/5">
                  <Image
                    src={s.src}
                    alt={s.caption}
                    fill
                    sizes="(min-width: 1280px) 28vw, (min-width: 1024px) 34vw, (min-width: 640px) 55vw, 80vw"
                    className="object-cover"
                  />
                </div>
                <div className="mt-3 text-[10px] uppercase tracking-[0.2em] text-[#1a3d2e]/60">
                  <span>{s.tag}</span>
                </div>
                <div className="mt-1 max-w-xs text-sm text-[#1a3d2e]/80">
                  {s.caption}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress dots */}
        <div className="mx-auto mt-10 flex max-w-[1400px] items-center justify-between gap-6 px-6 md:px-12 lg:px-16">
          <div className="flex flex-1 items-center gap-1.5">
            {snaps.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                aria-label={`Слайд ${i + 1}`}
                className={`h-px flex-1 transition-colors ${
                  i === selected ? "bg-[#1a3d2e]" : "bg-[#1a3d2e]/20"
                }`}
              />
            ))}
          </div>
          <div className="shrink-0 font-display text-sm text-[#1a3d2e]/70">
            {String(selected + 1).padStart(2, "0")}{" "}
            <span className="text-[#1a3d2e]/40">
              / {String(snaps.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
