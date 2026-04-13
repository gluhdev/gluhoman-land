"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Calendar, Phone } from "lucide-react";
import { openBookingDialog } from "@/components/ui/BookingDialog";

const CONTACT_PHONE = "+38 050 850 3555";

/**
 * HomeBookingCta — cinematic closing invitation.
 * Composition: full-bleed photo, layered dark wash, oversized italic serif title,
 * a vertical gold hairline rail with "RSVP" ghost-type, split two-card CTA
 * (book online / call), and a signature ornament below.
 */
export default function HomeBookingCta() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "12%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#0b1410] text-[#f4ecd8]"
    >
      {/* Background photo with parallax */}
      <motion.div
        style={reduceMotion ? undefined : { y: bgY }}
        className="absolute inset-[-8%] will-change-transform"
      >
        <Image
          src="/images/restaurant/exterior_summer_terrace_water.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Layered darkening — radial vignette + gradient */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 40%, rgba(11,20,16,0.55) 0%, rgba(11,20,16,0.85) 50%, rgba(11,20,16,0.97) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0b1410]/90 to-transparent"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0b1410]/90 to-transparent"
      />

      {/* Subtle noise */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Decorative huge italic letter watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[4vw] top-[50%] -translate-y-1/2 select-none font-display italic text-[36vw] leading-[0.8] text-[#c9a95c]/[0.06] md:text-[28vw]"
      >
        R
      </div>

      {/* Content */}
      <div className="relative mx-auto grid max-w-[1400px] grid-cols-12 gap-y-16 px-6 py-32 md:gap-x-12 md:px-12 md:py-44 lg:px-16">
        {/* Left vertical ghost rail */}
        <div
          aria-hidden
          className="pointer-events-none col-span-12 hidden items-center md:col-span-1 md:flex"
        >
          <div
            className="flex items-center gap-6 text-[10px] uppercase tracking-[0.45em] text-[#e6d9b8]/40"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            <span>RSVP</span>
            <span className="h-px w-20 bg-[#e6d9b8]/30" />
            <span>Gluhoman ’26</span>
          </div>
        </div>

        {/* Main editorial column */}
        <div className="col-span-12 md:col-span-11 md:pl-6">
          {/* Kicker row */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="mb-10 flex items-center gap-5"
          >
            <span className="h-px w-12 bg-[#c9a95c]/70" />
            <span className="text-[11px] uppercase tracking-[0.34em] text-[#c9a95c]/90">
              Запрошення
            </span>
            <span className="h-px w-12 bg-[#c9a95c]/70" />
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[#f4ecd8]"
            style={{
              fontSize: "clamp(3rem, 8.5vw, 9rem)",
              lineHeight: 0.85,
              letterSpacing: "-0.03em",
              fontWeight: 300,
            }}
          >
            Забронюйте
            <br />
            <span className="italic text-[#e6d9b8]">незабутній</span>{" "}
            <span className="italic">вечір</span>
          </motion.h2>

          {/* Ornament + sub-copy */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="mt-14 flex items-center gap-5"
          >
            <span className="h-px w-16 bg-[#c9a95c]/60" />
            <span className="font-display text-xl italic text-[#c9a95c]/90">&#10086;</span>
            <span className="h-px w-16 bg-[#c9a95c]/60" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="mt-10 max-w-xl font-display italic text-xl leading-[1.6] text-[#f4ecd8]/90 md:text-2xl"
          >
            На краю села, над ставом з лебедями й фонтанами —
            тут починається ваш справжній відпочинок.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.38 }}
            className="mt-6 max-w-xl text-sm leading-relaxed text-[#f4ecd8]/65 md:text-base"
          >
            Номер у готелі, стіл у ресторані, чан на дровах, банкет на
            90 гостей чи сімейний вихідний&nbsp;— залиште заявку або зателефонуйте,
            ми подбаємо про решту.
          </motion.p>

          {/* Split CTA row — two framed cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mt-14 grid max-w-3xl grid-cols-1 gap-5 md:grid-cols-2"
          >
            {/* Primary — book online */}
            <button
              type="button"
              onClick={() => openBookingDialog()}
              className="group relative flex items-center justify-between overflow-hidden rounded-sm border border-[#e6d9b8]/30 bg-[#f4ecd8]/[0.03] px-7 py-6 text-left transition-all duration-500 hover:border-[#e6d9b8] hover:bg-[#f4ecd8] hover:text-[#0b1410]"
            >
              <span className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-[#f4ecd8] transition-transform duration-700 ease-out group-hover:scale-x-100" />
              <div className="relative z-10">
                <div className="mb-1 text-[10px] uppercase tracking-[0.28em] text-[#c9a95c] group-hover:text-[#1a3d2e]/70">
                  Онлайн
                </div>
                <div className="font-display text-2xl font-light text-[#f4ecd8] transition-colors group-hover:text-[#0b1410] md:text-3xl">
                  Забронювати зараз
                </div>
              </div>
              <Calendar className="relative z-10 h-6 w-6 shrink-0 text-[#f4ecd8] transition-all duration-500 group-hover:translate-x-1 group-hover:text-[#0b1410]" />
            </button>

            {/* Secondary — call */}
            <a
              href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}
              className="group relative flex items-center justify-between overflow-hidden rounded-sm border border-[#e6d9b8]/30 bg-[#f4ecd8]/[0.03] px-7 py-6 text-left transition-all duration-500 hover:border-[#c9a95c] hover:bg-[#0f1f18]"
            >
              <div className="relative z-10">
                <div className="mb-1 text-[10px] uppercase tracking-[0.28em] text-[#c9a95c]">
                  Телефон
                </div>
                <div className="font-display text-2xl font-light text-[#f4ecd8] md:text-3xl">
                  {CONTACT_PHONE}
                </div>
              </div>
              <Phone className="relative z-10 h-6 w-6 shrink-0 text-[#c9a95c] transition-transform duration-500 group-hover:-rotate-12" />
            </a>
          </motion.div>

          {/* Signature */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-16 flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-[#e6d9b8]/45"
          >
            <span className="h-px w-10 bg-[#e6d9b8]/30" />
            <span>с. Нижні Млини</span>
            <span>·</span>
            <span>Полтавська область</span>
            <span className="h-px w-10 bg-[#e6d9b8]/30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
