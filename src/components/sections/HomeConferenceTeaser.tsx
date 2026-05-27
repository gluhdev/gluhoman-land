"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight, Users, Wifi, Projector, Wind } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * HomeConferenceTeaser — compact B2B-focused band between HomeServices and
 * HomeGallery. Promotes /conference-hall to corporate clients without
 * disturbing the 4-pillar service layout above.
 */
export default function HomeConferenceTeaser() {
  const t = useTranslations("home.conference");
  const reduce = useReducedMotion();

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
      };

  const features = [
    { Icon: Users, key: "capacity" },
    { Icon: Projector, key: "tech" },
    { Icon: Wind, key: "comfort" },
    { Icon: Wifi, key: "internet" },
  ] as const;

  return (
    <section className="relative overflow-hidden bg-[#faf6ec] py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          background:
            "radial-gradient(60% 50% at 80% 30%, #1a3d2e 0%, transparent 70%)",
        }}
      />

      <div className="container relative z-10 mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="grid items-stretch gap-10 md:grid-cols-12 md:gap-14">
          {/* Photo */}
          <motion.figure
            {...fade}
            className="relative md:col-span-6 lg:col-span-7"
          >
            <div className="relative aspect-[4/3] md:aspect-[5/4] overflow-hidden ring-1 ring-[#1a3d2e]/15 shadow-[0_30px_60px_-25px_rgba(26,61,46,0.35)]">
              <Image
                src="/images/conference-hall/1.jpg"
                alt={t("img_alt")}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-tr from-[#0f1f18]/30 via-transparent to-transparent"
              />
            </div>
            <span
              aria-hidden
              className="absolute -top-3 -left-3 hidden md:block w-24 h-24 border-l-2 border-t-2 border-[#c9a95c]/40"
            />
          </motion.figure>

          {/* Copy */}
          <motion.div
            {...fade}
            transition={
              reduce
                ? undefined
                : { duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }
            }
            className="flex flex-col justify-center md:col-span-6 lg:col-span-5"
          >
            <div className="mb-5 flex items-center gap-3 text-[#1a3d2e]/70">
              <span className="h-px w-10 bg-[#c9a95c]/70" />
              <span className="text-[11px] font-medium uppercase tracking-[0.28em]">
                {t("kicker")}
              </span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl lg:text-[44px] leading-[1.08] tracking-tight text-[#1a3d2e]">
              {t("title")}{" "}
              <span className="font-display italic text-[#1a3d2e]/65">
                {t("title_italic")}
              </span>
            </h2>

            <p className="mt-6 text-[16px] md:text-[17px] leading-[1.7] text-[#0f1f18]/80">
              {t("body")}
            </p>

            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
              {features.map(({ Icon, key }) => (
                <li
                  key={key}
                  className="flex items-start gap-3 text-[14px] text-[#0f1f18]/85"
                >
                  <Icon
                    className="w-4 h-4 mt-1 text-[#1a3d2e]/70 flex-shrink-0"
                    strokeWidth={1.7}
                  />
                  <span className="leading-snug">{t(`features.${key}`)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/conference-hall"
                className="group inline-flex items-center gap-2.5 bg-[#1a3d2e] px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] text-[#f4ecd8] transition-colors hover:bg-[#0f1f18]"
              >
                {t("cta")}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <p className="font-display italic text-[15px] text-[#1a3d2e]/65">
                {t("price_hint")}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
