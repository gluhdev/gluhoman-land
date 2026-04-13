"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { openBookingDialog } from "@/components/ui/BookingDialog";
import { ArrowDown } from "lucide-react";

export default function HomeHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#0b1410]"
    >
      {/* Video background */}
      <motion.div
        style={{ y, scale }}
        className="absolute inset-0 will-change-transform"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/restaurant/exterior_summer_terrace_water.jpg"
          className="h-full w-full object-cover"
        >
          <source src="/videos/main.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.55))]" />
      </motion.div>

      {/* Grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.6'/></svg>\")",
        }}
      />

      {/* Editorial top bar */}
      <motion.div
        style={{ opacity }}
        className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-6 pt-28 text-[11px] uppercase tracking-[0.28em] text-white/75 md:px-12 lg:px-16"
      >
        <span className="hidden md:inline">с. Нижні Млини &nbsp;·&nbsp; Полтавщина</span>
        <span className="hidden md:inline">Est. &nbsp;Природа · Тиша · Гостинність</span>
      </motion.div>

      {/* Main editorial content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex h-full w-full flex-col justify-end px-6 pb-20 md:px-12 lg:px-16 lg:pb-28"
      >
        <div className="max-w-[1400px]">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.36em] text-[#e6d9b8]"
          >
            <span className="h-px w-10 bg-[#e6d9b8]" />
            Рекреаційний комплекс
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-white"
            style={{
              fontSize: "clamp(3.25rem, 10vw, 11rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.025em",
              fontWeight: 300,
            }}
          >
            Глухо<span className="italic font-[350]">мань</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-10 grid gap-10 md:grid-cols-[1fr_auto] md:items-end"
          >
            <p className="max-w-xl font-display text-lg leading-relaxed text-white/85 md:text-xl">
              Там, де зникає гул міста&nbsp;— починається шепіт лісу, дим
              лазні та дзюркіт ставу з дикими качками.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => openBookingDialog()}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#f4ecd8] px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-[#1a3d2e] transition-transform hover:-translate-y-0.5"
              >
                <span className="relative z-10">Забронювати</span>
                <span className="relative z-10 inline-block h-1.5 w-1.5 rounded-full bg-[#1a3d2e] transition-transform group-hover:translate-x-1" />
                <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-out group-hover:scale-x-100" />
              </button>
              <a
                href="#story"
                className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-white/85 transition-colors hover:text-white"
              >
                Досліджувати
                <ArrowDown className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
        className="absolute bottom-6 right-6 z-20 hidden text-[10px] uppercase tracking-[0.3em] text-white/60 md:right-12 md:block lg:right-16"
      >
        <span className="inline-block [writing-mode:vertical-rl]">
          Scroll · Прокрутіть
        </span>
      </motion.div>
    </section>
  );
}
