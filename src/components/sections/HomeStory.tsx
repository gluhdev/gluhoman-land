"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useIsTouch } from "@/lib/use-is-touch";
import { useRef } from "react";
import Image from "next/image";

/**
 * HomeStory — editorial "chapter opening" spread.
 * Uses a magazine-style layered composition: massive serif title, drop-cap prose,
 * pull quote, decorative ornament, and two asymmetric photos with parallax.
 */
export default function HomeStory() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const isTouch = useIsTouch();
  const disableParallax = reduceMotion || isTouch;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const photoAY = useTransform(scrollYProgress, [0, 1], ["-12%", "14%"]);
  const photoBY = useTransform(scrollYProgress, [0, 1], ["18%", "-14%"]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);

  return (
    <section
      id="story"
      ref={ref}
      className="relative overflow-hidden bg-[#faf6ec] py-28 md:py-40"
    >
      {/* Decorative giant serif watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[6vw] top-[8%] select-none font-display italic text-[42vw] leading-[0.8] text-[#1a3d2e]/[0.035] md:-left-[4vw] md:top-[6%] md:text-[32vw]"
      >
        Г
      </div>

      {/* Subtle dotted grid accent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-[#1a3d2e]/10"
      />

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-12 gap-x-6 gap-y-14 px-6 md:px-12 lg:gap-x-10 lg:px-16">
        {/* Left rail — chapter number + kicker */}
        <div className="col-span-12 lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-start gap-4 lg:sticky lg:top-32 lg:block"
          >
            <div className="font-display text-5xl font-light italic text-[#1a3d2e] md:text-6xl lg:text-7xl">
              №01
            </div>
            <div className="mt-0 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[#1a3d2e]/60 lg:mt-8">
              <span className="hidden h-px w-8 bg-[#1a3d2e]/40 lg:inline-block" />
              Про комплекс
            </div>
          </motion.div>
        </div>

        {/* Main editorial column — title + prose */}
        <motion.div
          style={disableParallax ? undefined : { y: titleY }}
          className="col-span-12 lg:col-span-7"
        >
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[#1a3d2e]"
            style={{
              fontSize: "clamp(2.5rem, 6.4vw, 6.5rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.025em",
              fontWeight: 300,
            }}
          >
            Світ, де <span className="italic">казка</span>
            <br />
            стає реальністю
          </motion.h2>

          {/* Mobile-only first photo — appears right after headline on phones */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.41, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 lg:hidden"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-[0_24px_48px_-20px_rgba(26,61,46,0.35)]">
              <Image
                src="/images/restaurant/exterior_summer_terrace_water.jpg"
                alt="Літня тераса над ставком"
                fill
                sizes="100vw"
                className="object-cover"
                priority={false}
              />
            </div>
            <div className="mt-3 flex items-center gap-3 text-[9px] uppercase tracking-[0.28em] text-[#1a3d2e]/55">
              <span>01</span>
              <span className="h-px flex-1 bg-[#1a3d2e]/25" />
              <span>Тераса над водою</span>
            </div>
          </motion.div>

          {/* Ornament divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.54, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex origin-left items-center gap-5"
          >
            <span className="h-px w-24 bg-[#1a3d2e]/50" />
            <span className="font-display text-xl italic text-[#1a3d2e]/70">&#10086;</span>
            <span className="h-px w-24 bg-[#1a3d2e]/50" />
          </motion.div>

          {/* Prose with drop cap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.41, delay: 0.12 }}
            className="mt-10 max-w-2xl"
          >
            <p className="text-lg leading-[1.8] text-[#1a3d2e]/85 md:text-xl">
              <span
                className="float-left mr-3 mt-2 font-display text-6xl font-light leading-[0.75] text-[#1a3d2e] md:text-[96px]"
                aria-hidden
              >
                Н
              </span>
              а території села Нижні Млини, серед вербового гаю й тихого ставка
              з лебедями, збудовано цілий світ для тих, хто стомився від міста.
              Двоповерховий ресторан у старовинному казковому стилі, готель
              серед природи, лазня на дровах з карпатськими травами та
              відкритий аквапарк — усе це в одному місці.
            </p>
          </motion.div>

          {/* Pull quote */}
          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-16 border-l-2 border-[#1a3d2e]/50 pl-8 md:mt-20 md:pl-10"
          >
            <p
              className="font-display italic text-[#1a3d2e]"
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                lineHeight: 1.2,
                fontWeight: 300,
              }}
            >
              «Три літні майданчики на воді, оточені фонтанами та лебедями — тут
              починається справжній відпочинок.»
            </p>
            <div className="mt-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] text-[#1a3d2e]/55">
              <span className="h-px w-8 bg-[#1a3d2e]/40" />
              Родина Глухомань
            </div>
          </motion.blockquote>

          {/* Stats strip — editorial footer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.41, delay: 0.28 }}
            className="mt-20 max-w-3xl border-t border-[#1a3d2e]/15 pt-10"
          >
            <p className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[#1a3d2e]/55">
              <span className="h-px w-8 bg-[#1a3d2e]/35" />
              Глухомань · у цифрах
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { roman: "I", n: "295", l: "Фірмових страв", sub: "у меню" },
                { roman: "II", n: "7", l: "Унікальних залів", sub: "ресторану" },
                { roman: "III", n: "2", l: "Лазні на дровах", sub: "з чанами" },
                { roman: "IV", n: "4", l: "Напрямки", sub: "відпочинку" },
              ].map((s, idx) => (
                <div
                  key={s.l}
                  className={`relative px-5 py-4 first:pl-0 md:px-7 md:first:pl-0 ${
                    idx > 0 ? "border-l border-[#1a3d2e]/15" : ""
                  } ${idx === 2 ? "border-l md:border-l" : ""}`}
                >
                  <span className="font-display italic text-[10px] text-[#1a3d2e]/45">
                    № {s.roman}
                  </span>
                  <div
                    className="font-display text-[#1a3d2e] mt-1 tabular-nums"
                    style={{
                      fontWeight: 300,
                      fontSize: "clamp(2.8rem, 4.4vw, 4.5rem)",
                      lineHeight: 0.88,
                      letterSpacing: "-0.035em",
                    }}
                  >
                    {s.n}
                  </div>
                  <div className="mt-3 text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/75 leading-tight font-medium">
                    {s.l}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/45 font-medium leading-tight mt-0.5">
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right column — two asymmetric parallax photos.
            Mobile: stacked flex column with spacing between (no overlap).
            Desktop (lg+): absolute-positioned overlapping layout. */}
        <div className="col-span-12 lg:col-span-3">
          <div className="relative flex flex-col gap-10 lg:block lg:h-full lg:min-h-[420px] lg:gap-0">
            {/* Top small photo */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 1, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
              className="hidden lg:block w-[85%] self-end lg:absolute lg:-left-8 lg:right-auto lg:top-4 lg:w-[115%] lg:self-auto"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)]">
                <motion.div
                  style={disableParallax ? undefined : { y: photoAY }}
                  className="absolute inset-[-10%] will-change-transform"
                >
                  <Image
                    src="/images/restaurant/exterior_summer_terrace_water.jpg"
                    alt="Літня тераса над ставком"
                    fill
                    sizes="(min-width: 1024px) 28vw, 85vw"
                    className="object-cover"
                  />
                </motion.div>
              </div>
              <div className="mt-3 flex items-center gap-3 text-[9px] uppercase tracking-[0.28em] text-[#1a3d2e]/50">
                <span>01</span>
                <span className="h-px flex-1 bg-[#1a3d2e]/25" />
                <span>Тераса над водою</span>
              </div>
            </motion.div>

            {/* Bottom small photo — offset right & down on desktop, left-aligned on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 1, delay: 0.17, ease: [0.16, 1, 0.3, 1] }}
              className="w-[70%] self-start lg:absolute lg:bottom-8 lg:-right-4 lg:left-auto lg:w-[95%] lg:self-auto"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-[0_30px_60px_-30px_rgba(0,0,0,0.35)]">
                <motion.div
                  style={disableParallax ? undefined : { y: photoBY }}
                  className="absolute inset-[-10%] will-change-transform"
                >
                  <Image
                    src="/images/9.jpg"
                    alt="Готель «Глухомань» нічний екстер'єр"
                    fill
                    sizes="(min-width: 1024px) 22vw, 70vw"
                    className="object-cover"
                  />
                </motion.div>
              </div>
              <div className="mt-3 flex items-center gap-3 text-[9px] uppercase tracking-[0.28em] text-[#1a3d2e]/50">
                <span>02</span>
                <span className="h-px flex-1 bg-[#1a3d2e]/25" />
                <span>Готель уночі</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
