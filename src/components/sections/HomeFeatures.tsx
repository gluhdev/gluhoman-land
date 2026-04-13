"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { TreePine } from "lucide-react";

type Feature = {
  number: string;
  kicker: string;
  title: string;
  description: string;
  scale: "hero" | "wide" | "tall" | "small" | "text";
  image?: string;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  focal?: string; // object-position
  href: string; // where the tile navigates on click
};

const features: Feature[] = [
  {
    number: "01",
    kicker: "Ресторан",
    title: "Банкетна зала на 90 гостей",
    description:
      "Склепіння, світло свічок та довгий стіл для весіль, ювілеїв і урочистих подій.",
    scale: "hero",
    image: "/images/restaurant/terrace_hall_with_logo.jpg",
    focal: "center 40%",
    href: "/restaurant",
  },
  {
    number: "02",
    kicker: "Кухня",
    title: "Українська піч на дровах",
    description: "Автентичні страви з живого вогню за старовинними рецептами.",
    scale: "tall",
    image: "/images/restaurant/ukrainian_clay_oven_pich_food.jpg",
    focal: "center center",
    href: "/menu",
  },
  {
    number: "03",
    kicker: "Вечори",
    title: "Жива музика на вихідних",
    description:
      "П'ятниця, субота, неділя — акустичні сети у головній залі ресторану.",
    scale: "wide",
    image: "/images/restaurant/live_music_danil.jpg",
    focal: "center 35%",
    href: "/restaurant",
  },
  {
    number: "04",
    kicker: "Спа",
    title: "Чани на дровах з травами",
    description:
      "Купелі з настоями карпатських трав під зоряним небом — для двох.",
    scale: "tall",
    image: "/images/sauna/chan_citrus_couple_night.jpg",
    focal: "center center",
    href: "/sauna",
  },
  {
    number: "05",
    kicker: "Пивоварня",
    title: "Крафтова пивоварня",
    description: "Власне виробництво — дегустації та екскурсії для гостей.",
    scale: "wide",
    image: "/images/restaurant/about_craft_beer.jpg",
    focal: "center center",
    href: "/restaurant",
  },
  {
    number: "06",
    kicker: "Для дітей",
    title: "Дитячі розваги з аніматорами",
    description: "Лабіринт, лазертаг, мильне шоу та простора ігрова кімната.",
    scale: "small",
    image: "/images/restaurant/kids_room_labyrinth_maze.jpg",
    focal: "center center",
    href: "/restaurant",
  },
  {
    number: "07",
    kicker: "Унікальне",
    title: "Павичі у «Жар-Птиці»",
    description:
      "Окрема зала з живим вольєром — обід у товаристві казкових птахів.",
    scale: "small",
    image: "/images/restaurant/peacock_aviary_zhar_ptytsi.jpg",
    focal: "center center",
    href: "/restaurant",
  },
  {
    number: "08",
    kicker: "Літо",
    title: "Відкритий аквапарк",
    description: "Басейни, гірки та зона відпочинку у теплий сезон.",
    scale: "wide",
    image: "/images/akvapark.webp",
    focal: "center 45%",
    href: "/aquapark",
  },
  {
    number: "09",
    kicker: "На воді",
    title: "Літні тераси над ставком",
    description:
      "Три літні майданчики на воді в оточенні фонтанів та лебедів.",
    scale: "small",
    image: "/images/restaurant/exterior_summer_terrace_water.jpg",
    href: "/restaurant",
  },
  {
    number: "10",
    kicker: "VIP",
    title: "Більярдна з крафтовим пивом",
    description:
      "VIP-зал з 12-футовим столом і нефільтрованим пивом власного виробництва.",
    scale: "small",
    image: "/images/restaurant/vip_billiards_full_view.jpg",
    href: "/restaurant",
  },
];

export default function HomeFeatures() {
  const prefersReducedMotion = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.06,
        delayChildren: prefersReducedMotion ? 0 : 0.08,
      },
    },
  };

  const item: Variants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#0f1f18] py-28 text-[#f1e9d2] md:py-36"
    >
      {/* Ambient radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% 0%, rgba(201,169,92,0.08), transparent 60%), radial-gradient(ellipse 60% 60% at 90% 100%, rgba(46,94,71,0.35), transparent 60%)",
        }}
      />

      {/* Hairline column grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #f1e9d2 1px, transparent 1px)",
          backgroundSize: "calc(100% / 12) 100%",
        }}
      />

      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.08]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="container relative z-10 mx-auto max-w-[1440px] px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
          className="mb-16 md:mb-24"
        >
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <motion.div
                variants={item}
                className="mb-6 flex items-center gap-4 text-[#c9a95c]"
              >
                <span className="h-px w-12 bg-[#c9a95c]/60" />
                <span className="text-[0.7rem] font-medium uppercase tracking-[0.38em]">
                  Особливості комплексу
                </span>
              </motion.div>
              <motion.h2
                variants={item}
                className="font-display font-light leading-[0.92] text-[#f4ecd8]"
                style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)" }}
              >
                Глухомань
                <br />
                <span className="italic text-[#c9a95c]">
                  у десяти деталях
                </span>
              </motion.h2>
            </div>
            <motion.div variants={item} className="md:col-span-4">
              <div className="flex items-center gap-3 text-[#c9a95c]/70">
                <TreePine className="h-5 w-5" strokeWidth={1.3} />
                <span className="text-[0.65rem] uppercase tracking-[0.3em]">
                  Нижні Млини · Полтавщина
                </span>
              </div>
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#f1e9d2]/70">
                Від власної пивоварні та живої музики до чанів на дровах,
                павичів у вольєрі й ставка з лебедями — десять причин
                затриматися надовше.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Editorial asymmetric mosaic */}
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={container}
          className="flex snap-x snap-mandatory gap-px overflow-x-auto scroll-smooth bg-[#c9a95c]/15 px-6 -mx-6 pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-2 sm:overflow-visible sm:mx-0 sm:px-0 sm:pb-0 md:grid-cols-3 md:auto-rows-[minmax(280px,auto)]"
        >
          {features.map((f, idx) => {
            // Clean rhythm: first tile is a full-width banner across all 3 columns,
            // then the remaining 9 tiles form a uniform 3x3 grid.
            const span = idx === 0 ? "md:col-span-3 md:row-span-1" : "md:col-span-1";
            const mobileTile = "w-[82vw] max-w-[340px] flex-shrink-0 snap-center sm:w-auto sm:max-w-none sm:flex-shrink";
            const isHero = idx === 0;
            const isTall = false;
            const hasImage = Boolean(f.image);
            const Icon = f.icon;

            return (
              <motion.li
                key={f.number}
                variants={item}
                className={`group relative ${mobileTile} ${span}`}
              >
                <Link
                  href={f.href}
                  aria-label={f.title}
                  className={`relative flex ${isHero ? 'min-h-[300px] md:min-h-[440px]' : 'min-h-[260px] sm:min-h-[280px]'} flex-col justify-between overflow-hidden bg-[#0f1f18] p-7 md:p-10 h-full`}
                >
                {/* Background image */}
                {hasImage && f.image && (
                  <>
                    <div className="absolute inset-0 overflow-hidden">
                      <Image
                        src={f.image}
                        alt=""
                        fill
                        sizes={
                          isHero
                            ? "(max-width: 768px) 100vw, 66vw"
                            : isTall
                              ? "(max-width: 768px) 100vw, 33vw"
                              : "(max-width: 768px) 100vw, 50vw"
                        }
                        className="object-cover transition-transform duration-[1400ms] ease-out will-change-transform group-hover:scale-[1.08]"
                        style={{ objectPosition: f.focal ?? "center center" }}
                      />
                    </div>
                    {/* Readability gradient */}
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10 transition-opacity duration-700 group-hover:from-black/90 group-hover:via-black/50"
                    />
                    {/* Subtle green tint */}
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-[#0f1f18] mix-blend-multiply opacity-30"
                    />
                  </>
                )}

                {/* Gold hairline slide-in */}
                <span
                  aria-hidden
                  className="absolute bottom-0 left-0 z-10 h-px w-0 bg-[#c9a95c] transition-all duration-[900ms] ease-out group-hover:w-full"
                />

                {/* Top row: number + kicker */}
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <span className="text-[0.65rem] font-medium uppercase tracking-[0.32em] text-[#c9a95c]/90">
                    {f.kicker}
                  </span>
                  <span
                    className="font-display text-sm tabular-nums text-[#f1e9d2]/40"
                    aria-hidden
                  >
                    {f.number} / 10
                  </span>
                </div>

                {/* Bottom: title + description */}
                <div
                  className={`relative z-10 ${
                    isHero
                      ? "mt-20 md:mt-28"
                      : isTall
                        ? "mt-16 md:mt-24"
                        : "mt-12"
                  }`}
                >
                  {Icon && !hasImage && (
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full border border-[#c9a95c]/40 text-[#c9a95c] transition-colors duration-500 group-hover:bg-[#c9a95c] group-hover:text-[#0f1f18]">
                      <Icon className="h-[18px] w-[18px]" strokeWidth={1.4} />
                    </div>
                  )}
                  <h3
                    className={`font-display font-light leading-[1.05] text-[#f4ecd8] ${
                      isHero
                        ? "text-3xl md:text-[2.85rem]"
                        : isTall
                          ? "text-2xl md:text-[1.9rem]"
                          : "text-xl md:text-[1.55rem]"
                    }`}
                  >
                    {f.title}
                  </h3>
                  <p
                    className={`mt-3 max-w-[40ch] leading-relaxed text-[#f1e9d2]/75 ${
                      isHero ? "text-sm md:text-base" : "text-sm"
                    }`}
                  >
                    {f.description}
                  </p>
                </div>
                </Link>
              </motion.li>
            );
          })}
        </motion.ul>

        {/* Footer hairline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.15 }}
          className="mt-16 flex items-center gap-5 text-[#c9a95c]/60"
        >
          <span className="h-px flex-1 bg-[#c9a95c]/25" />
          <span className="text-[0.65rem] uppercase tracking-[0.35em]">
            Gluhoman · Est. 2011
          </span>
          <span className="h-px flex-1 bg-[#c9a95c]/25" />
        </motion.div>
      </div>
    </section>
  );
}
