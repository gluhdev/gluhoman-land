"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Calendar } from "lucide-react";
import { openBookingDialog } from "@/components/ui/BookingDialog";

/* ---------- palette ---------- */
const CREAM = "#faf6ec";
const FOREST = "#0f1f18";
const MOSS = "#1a3325";
const GOLD = "#c9a95c";
const INK = "#14241b";

type Stat = { value: string; label: string };

type Panel = {
  n: string;           // "01"
  total: string;       // "04"
  kicker: string;
  title: string;
  titleItalic?: string;
  verticalLabel: string; // the rotated decorative word
  tagline: string;       // short italic pull-quote style line
  description: string;
  highlights: string[];  // 3 bullet "фішки"
  stat: Stat;            // hero number
  priceHint?: string;
  hours?: string;
  href: string;
  image: string;
  imageAlt: string;
  secondaryImage?: string;
  secondaryAlt?: string;
  seasonLocked?: boolean;
  booking?: { rating: string; label: string; reviews?: string; href: string };
};

const PANELS: Panel[] = [
  {
    n: "01",
    total: "04",
    kicker: "Проживання",
    title: "Готель",
    titleItalic: "«Глухомань»",
    verticalLabel: "HOTEL",
    tagline: "Прокидайтесь під спів птахів за 20 метрів від ставка.",
    description:
      "Дерев'яні номери на території комплексу — від стандартних до сімейних котеджів. Крок до ресторану, аквапарку та лазні, тиша соснового лісу і власна парковка біля корпусу.",
    highlights: [
      "Дерев'яні номери з терасою",
      "Ставок, лебеді, фонтани під вікном",
      "Сніданок у ресторані комплексу",
    ],
    stat: { value: "10", label: "номерів та котеджів" },
    priceHint: "від 1 400 грн / ніч",
    hours: "Заїзд 14:00 · Виїзд 12:00",
    href: "/hotel",
    booking: {
      rating: "9.2",
      label: "Чудово",
      reviews: "відгуки на Booking.com",
      href: "https://www.booking.com/hotel/ua/gluhoman.uk.html",
    },
    image: "/images/9.jpg",
    imageAlt: "Готель Глухомань вночі",
  },
  {
    n: "02",
    total: "04",
    kicker: "Вода та сонце",
    title: "Аквапарк",
    titleItalic: "«Глухомань»",
    verticalLabel: "AQUA",
    tagline: "Ціле літо — у басейнах із підігрівом та під гірками.",
    description:
      "Відкритий аквапарк із водними гірками, басейнами для дорослих та окремою дитячою зоною. Лежаки, бар біля води, роздягальні та безпечне дно. Працює у теплий сезон.",
    highlights: [
      "5 водних гірок різної висоти",
      "Басейни з підігрівом води",
      "Дитяча зона та рятувальники",
    ],
    stat: { value: "5", label: "водних гірок" },
    priceHint: "вхід від 300 грн",
    hours: "Сезон: травень — вересень",
    href: "/aquapark",
    image: "/images/akvapark.webp",
    imageAlt: "Аквапарк Глухомань",
    seasonLocked: true,
  },
  {
    n: "03",
    total: "04",
    kicker: "Кухня та музика",
    title: "Ресторан",
    titleItalic: "«Глухомань»",
    verticalLabel: "CUISINE",
    tagline: "Страви з української печі на дровах і павичі у залі.",
    description:
      "Два поверхи, велика літня тераса, українська піч на дровах і крафтове пиво власного виробництва. Зал «Жар-Птиця» з павлінарієм, жива музика на вихідних та банкети до 150 гостей.",
    highlights: [
      "Українська піч на дровах",
      "Крафтове пиво власного виробництва",
      "Павлінарій у залі «Жар-Птиця»",
    ],
    stat: { value: "150", label: "посадкових місць" },
    priceHint: "середній чек від 450 грн",
    hours: "Щодня 10:00 — 23:00",
    href: "/restaurant",
    image: "/images/restaurant/terrace_hall_with_logo.jpg",
    imageAlt: "Ресторан Глухомань",
  },
  {
    n: "04",
    total: "04",
    kicker: "Тіло та дух",
    title: "Лазня",
    titleItalic: "на дровах",
    verticalLabel: "BANYA",
    tagline: "Чани з карпатськими травами під зоряним небом.",
    description:
      "Чани на дровах з карпатськими травами, парна з дубовими та бамбуковими віниками, кімната відпочинку із самоваром та холодна купіль. Класична українська традиція у сучасному виконанні.",
    highlights: [
      "Чани на дровах з травами",
      "Дубові та бамбукові віники",
      "Самовар та кімната відпочинку",
    ],
    stat: { value: "4", label: "чани на дровах" },
    priceHint: "від 1 200 грн / година",
    hours: "За попереднім бронюванням",
    href: "/sauna",
    image: "/images/sauna/exterior_small_sauna_building.jpg",
    imageAlt: "Лазня на дровах Глухомань",
  },
];

/* ---------- small subcomponents ---------- */

function BookButton({
  seasonLocked,
  dark,
}: {
  seasonLocked?: boolean;
  dark: boolean; // panel bg is forest? true=forest, false=cream
}) {
  if (seasonLocked) {
    return (
      <div
        aria-disabled
        className={`inline-flex flex-col items-start justify-center gap-0.5 rounded-full px-6 py-3.5 cursor-not-allowed border ${
          dark
            ? "border-[#f4ecd8]/25 bg-[#f4ecd8]/5 text-[#f4ecd8]/80"
            : "border-[#0f1f18]/25 bg-[#0f1f18]/5 text-[#0f1f18]/75"
        }`}
      >
        <span className="inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.2em]">
          <Calendar className="h-3.5 w-3.5" />
          Бронювання з травня
        </span>
        <span
          className={`ml-[22px] text-[10px] ${
            dark ? "text-[#f4ecd8]/55" : "text-[#0f1f18]/55"
          }`}
        >
          Аквапарк працює влітку
        </span>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={() => openBookingDialog()}
      className={`inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] transition-all duration-300 hover:-translate-y-0.5 ${
        dark
          ? "bg-[#faf6ec] text-[#0f1f18] hover:bg-white"
          : "bg-[#0f1f18] text-[#faf6ec] hover:bg-[#1a3325]"
      }`}
    >
      <Calendar className="h-3.5 w-3.5" />
      Забронювати
    </button>
  );
}

function DetailLink({ href, dark }: { href: string; dark: boolean }) {
  return (
    <Link
      href={href}
      className={`group/d inline-flex items-center gap-3 border-b pb-1 text-[11px] uppercase tracking-[0.24em] transition-colors ${
        dark
          ? "border-[#c9a95c]/50 text-[#e6d9b8] hover:border-[#c9a95c]"
          : "border-[#0f1f18]/40 text-[#0f1f18] hover:border-[#0f1f18]"
      }`}
    >
      Детальніше
      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/d:-translate-y-0.5 group-hover/d:translate-x-0.5" />
    </Link>
  );
}

function Hairline({ dark }: { dark: boolean }) {
  return (
    <span
      aria-hidden
      className={`inline-block h-px w-10 ${dark ? "bg-[#c9a95c]/60" : "bg-[#0f1f18]/40"}`}
    />
  );
}

/* ---------- panel layouts (each unique) ---------- */

type PanelProps = { p: Panel; reduced: boolean };

// Panel 01 — Готель: photo-left / structured info-card right with vertical HOTEL label
function PanelHotel({ p, reduced }: PanelProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      {/* vertical decorative label */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 md:block"
        style={{
          writingMode: "vertical-rl",
          transform: "translateY(-50%) rotate(180deg)",
          fontFamily: "var(--font-display, serif)",
          fontSize: "clamp(8rem, 14vw, 18rem)",
          lineHeight: 0.85,
          color: "rgba(15,31,24,0.05)",
          fontWeight: 300,
          letterSpacing: "-0.04em",
        }}
      >
        {p.verticalLabel}
      </div>

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-12 gap-y-12 px-6 py-24 md:gap-x-10 md:px-12 md:py-32 lg:gap-x-16 lg:px-16">
        {/* photo */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 40 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.41, ease: [0.16, 1, 0.3, 1] }}
          className="col-span-12 lg:col-span-7"
        >
          <Link href={p.href} className="group block">
            <div
              className="relative aspect-[5/4] w-full overflow-hidden"
              style={{ boxShadow: "0 40px 80px -32px rgba(15,31,24,0.35)" }}
            >
              <Image
                src={p.image}
                alt={p.imageAlt}
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
              />
              {/* gold hairline frame */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-3"
                style={{ border: `1px solid ${GOLD}80` }}
              />
              {/* roman numeral corner */}
              <div className="absolute left-6 top-6 font-display text-[11px] uppercase tracking-[0.3em] text-[#faf6ec]/90">
                {p.n} / {p.total}
              </div>
            </div>
          </Link>
        </motion.div>

        {/* text / passport */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 40 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.41, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
          className="col-span-12 lg:col-span-5 lg:pl-4"
        >
          <p className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em]">
            <Hairline dark={false} />
            <span style={{ color: `${INK}B3` }}>{p.kicker}</span>
          </p>
          <h3
            className="font-display"
            style={{
              fontSize: "clamp(2.4rem, 4.4vw, 4.2rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
              fontWeight: 300,
              color: INK,
            }}
          >
            {p.title}
            {p.titleItalic && (
              <>
                <br />
                <span className="italic" style={{ color: MOSS }}>
                  {p.titleItalic}
                </span>
              </>
            )}
          </h3>

          <p
            className="mt-5 font-display italic"
            style={{ fontSize: "1.15rem", color: `${INK}CC`, lineHeight: 1.4 }}
          >
            &ldquo;{p.tagline}&rdquo;
          </p>

          {/* stat big number */}
          <div className="mt-8 flex items-end gap-4">
            <span
              className="font-display"
              style={{
                fontSize: "clamp(3.5rem, 6vw, 5.5rem)",
                lineHeight: 0.85,
                fontWeight: 300,
                color: MOSS,
                letterSpacing: "-0.03em",
              }}
            >
              {p.stat.value}
            </span>
            <span
              className="pb-2 text-[11px] uppercase tracking-[0.22em]"
              style={{ color: `${INK}99` }}
            >
              {p.stat.label}
            </span>
          </div>

          <ul
            className="mt-8 space-y-2 text-sm"
            style={{ color: `${INK}CC` }}
          >
            {p.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="mt-[9px] inline-block h-px w-4"
                  style={{ backgroundColor: GOLD }}
                />
                {h}
              </li>
            ))}
          </ul>

          <div
            className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-[11px] uppercase tracking-[0.18em]"
            style={{ color: `${INK}80` }}
          >
            {p.priceHint && <span>{p.priceHint}</span>}
            {p.hours && <span>{p.hours}</span>}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <BookButton seasonLocked={p.seasonLocked} dark={false} />
            <DetailLink href={p.href} dark={false} />
          </div>

          {p.booking && (
            <a
              href={p.booking.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-10 inline-flex max-w-sm items-center gap-4 border px-5 py-4 transition-all duration-500 hover:-translate-y-0.5"
              style={{ borderColor: `${INK}20`, backgroundColor: `${INK}05` }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm font-display text-xl font-light"
                style={{ backgroundColor: "#003b95", color: CREAM }}
              >
                {p.booking.rating}
              </div>
              <div className="flex-1">
                <div
                  className="font-display text-base"
                  style={{ color: INK }}
                >
                  {p.booking.label}
                </div>
                <div
                  className="text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: `${INK}80` }}
                >
                  Booking.com · {p.booking.reviews}
                </div>
              </div>
              <span
                className="text-sm transition-transform duration-500 group-hover:translate-x-1"
                style={{ color: "#003b95" }}
              >
                →
              </span>
            </a>
          )}
        </motion.div>
      </div>
    </section>
  );
}

// Panel 02 — Аквапарк: photo-full background with floating cream text card
function PanelAqua({ p, reduced }: PanelProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: FOREST, color: CREAM }}
    >
      {/* full-bleed photo band */}
      <div className="relative h-[60svh] min-h-[520px] w-full">
        <Image
          src={p.image}
          alt={p.imageAlt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(120deg, rgba(15,31,24,0.75) 0%, rgba(15,31,24,0.35) 45%, rgba(15,31,24,0.15) 100%)",
          }}
        />
        {/* oversized italic word bleeding off the edge */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 bottom-4 hidden font-display italic md:block"
          style={{
            fontSize: "clamp(8rem, 16vw, 20rem)",
            lineHeight: 0.8,
            color: "rgba(250,246,236,0.08)",
            fontWeight: 300,
            letterSpacing: "-0.04em",
          }}
        >
          aqua
        </div>
      </div>

      {/* floating card */}
      <div className="relative mx-auto -mt-48 max-w-[1400px] px-6 pb-28 md:-mt-56 md:px-12 md:pb-36 lg:px-16">
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 50 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.41, ease: [0.16, 1, 0.3, 1] }}
          className="relative grid grid-cols-12 gap-6"
        >
          {/* sticky-ish number rail */}
          <div className="col-span-12 flex items-center gap-4 md:col-span-1 md:flex-col md:items-start md:gap-6">
            <span
              className="font-display text-xs uppercase tracking-[0.3em]"
              style={{ color: `${GOLD}` }}
            >
              {p.n}
            </span>
            <span
              aria-hidden
              className="h-px w-10 md:h-20 md:w-px"
              style={{ backgroundColor: `${CREAM}40` }}
            />
            <span
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: `${CREAM}60` }}
            >
              {p.total}
            </span>
          </div>

          <div
            className="col-span-12 p-8 md:col-span-11 md:p-12"
            style={{
              backgroundColor: MOSS,
              boxShadow: "0 50px 100px -40px rgba(0,0,0,0.6)",
              border: `1px solid ${GOLD}33`,
            }}
          >
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 md:col-span-7">
                <p
                  className="mb-5 text-[10px] uppercase tracking-[0.32em]"
                  style={{ color: `${GOLD}` }}
                >
                  {p.kicker}
                </p>
                <h3
                  className="font-display"
                  style={{
                    fontSize: "clamp(2.4rem, 4.8vw, 4.5rem)",
                    lineHeight: 0.95,
                    letterSpacing: "-0.025em",
                    fontWeight: 300,
                    color: CREAM,
                  }}
                >
                  {p.title}
                  {p.titleItalic && (
                    <>
                      <br />
                      <span className="italic" style={{ color: `${CREAM}CC` }}>
                        {p.titleItalic}
                      </span>
                    </>
                  )}
                </h3>
                <p
                  className="mt-5 font-display italic"
                  style={{ fontSize: "1.1rem", color: `${CREAM}B3` }}
                >
                  &ldquo;{p.tagline}&rdquo;
                </p>
                <p
                  className="mt-6 max-w-md text-sm leading-relaxed"
                  style={{ color: `${CREAM}B3` }}
                >
                  {p.description}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <BookButton seasonLocked={p.seasonLocked} dark={true} />
                  <DetailLink href={p.href} dark={true} />
                </div>
              </div>

              <div
                className="col-span-12 md:col-span-5 md:border-l md:pl-8"
                style={{ borderColor: `${CREAM}20` }}
              >
                <div className="flex items-end gap-3">
                  <span
                    className="font-display"
                    style={{
                      fontSize: "clamp(4rem, 7vw, 6rem)",
                      lineHeight: 0.85,
                      fontWeight: 300,
                      color: GOLD,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {p.stat.value}
                  </span>
                  <span
                    className="pb-2 text-[11px] uppercase tracking-[0.22em]"
                    style={{ color: `${CREAM}80` }}
                  >
                    {p.stat.label}
                  </span>
                </div>
                <ul
                  className="mt-6 space-y-2 text-sm"
                  style={{ color: `${CREAM}B3` }}
                >
                  {p.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="mt-[9px] inline-block h-px w-4"
                        style={{ backgroundColor: GOLD }}
                      />
                      {h}
                    </li>
                  ))}
                </ul>
                <div
                  className="mt-6 space-y-1 text-[11px] uppercase tracking-[0.18em]"
                  style={{ color: `${CREAM}70` }}
                >
                  {p.priceHint && <div>{p.priceHint}</div>}
                  {p.hours && <div>{p.hours}</div>}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Panel 03 — Ресторан: asymmetric three-column with big italic title on left, photo right, stat floating
function PanelRestaurant({ p, reduced }: PanelProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: CREAM, color: INK }}
    >
      {/* soft radial ornament */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, rgba(26,51,37,0.08), transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-12 gap-y-12 px-6 py-24 md:gap-x-10 md:px-12 md:py-32 lg:gap-x-14 lg:px-16">
        {/* left: big italic title + stat */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 40 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.41, ease: [0.16, 1, 0.3, 1] }}
          className="col-span-12 lg:col-span-5"
        >
          <p className="mb-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em]">
            <Hairline dark={false} />
            <span style={{ color: `${INK}B3` }}>
              {p.n} — {p.kicker}
            </span>
          </p>
          <h3
            className="font-display"
            style={{
              fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              fontWeight: 300,
              color: INK,
            }}
          >
            <span className="italic" style={{ color: MOSS }}>
              Ресторан
            </span>
            <br />
            на дровах
          </h3>
          <p
            className="mt-6 max-w-md text-sm leading-relaxed"
            style={{ color: `${INK}B3` }}
          >
            {p.description}
          </p>

          <div
            className="mt-10 flex items-baseline gap-5 border-t pt-8"
            style={{ borderColor: `${INK}20` }}
          >
            <span
              className="font-display"
              style={{
                fontSize: "clamp(4rem, 7vw, 6.5rem)",
                lineHeight: 0.8,
                fontWeight: 300,
                color: MOSS,
                letterSpacing: "-0.03em",
              }}
            >
              {p.stat.value}
            </span>
            <span
              className="text-[11px] uppercase tracking-[0.22em]"
              style={{ color: `${INK}80` }}
            >
              {p.stat.label}
              <br />
              на двох поверхах
            </span>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <BookButton seasonLocked={p.seasonLocked} dark={false} />
            <DetailLink href={p.href} dark={false} />
          </div>
        </motion.div>

        {/* right: tall photo + highlights card overlapping */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 40 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.41, delay: 0.07, ease: [0.16, 1, 0.3, 1] }}
          className="relative col-span-12 lg:col-span-7"
        >
          <Link href={p.href} className="group block">
            <div
              className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[5/6]"
              style={{ boxShadow: "0 40px 90px -30px rgba(15,31,24,0.4)" }}
            >
              <Image
                src={p.image}
                alt={p.imageAlt}
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-3"
                style={{ border: `1px solid ${GOLD}80` }}
              />
            </div>
          </Link>

          {/* overlapping highlights tablet */}
          <div
            className="relative z-10 -mt-16 ml-auto max-w-sm p-7 md:-mt-20 md:p-9"
            style={{
              backgroundColor: CREAM,
              border: `1px solid ${INK}1A`,
              boxShadow: "0 30px 60px -30px rgba(15,31,24,0.25)",
            }}
          >
            <p
              className="mb-4 text-[10px] uppercase tracking-[0.3em]"
              style={{ color: `${INK}80` }}
            >
              Ключові фішки
            </p>
            <ul className="space-y-3 text-sm" style={{ color: `${INK}CC` }}>
              {p.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-[9px] inline-block h-px w-4"
                    style={{ backgroundColor: GOLD }}
                  />
                  {h}
                </li>
              ))}
            </ul>
            <div
              className="mt-5 border-t pt-4 text-[11px] uppercase tracking-[0.18em]"
              style={{ borderColor: `${INK}1A`, color: `${INK}80` }}
            >
              {p.hours}
              {p.priceHint && (
                <>
                  <br />
                  {p.priceHint}
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Panel 04 — Лазня: centered "quote" style, single wide photo, verticals + ritual list
function PanelBanya({ p, reduced }: PanelProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: FOREST, color: CREAM }}
    >
      {/* subtle noise */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      {/* vertical decorative label */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-1/2 hidden -translate-y-1/2 md:block"
        style={{
          writingMode: "vertical-rl",
          transform: "translateY(-50%) rotate(180deg)",
          fontFamily: "var(--font-display, serif)",
          fontSize: "clamp(8rem, 14vw, 18rem)",
          lineHeight: 0.85,
          color: "rgba(201,169,92,0.07)",
          fontWeight: 300,
          letterSpacing: "-0.04em",
        }}
      >
        {p.verticalLabel}
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 py-28 md:px-12 md:py-36 lg:px-16">
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 40 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.41, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <p
            className="mb-6 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.32em]"
            style={{ color: `${GOLD}` }}
          >
            <Hairline dark={true} />
            {p.n} / {p.total} — {p.kicker}
            <Hairline dark={true} />
          </p>
          <h3
            className="font-display"
            style={{
              fontSize: "clamp(2.8rem, 6vw, 5.5rem)",
              lineHeight: 0.9,
              letterSpacing: "-0.025em",
              fontWeight: 300,
              color: CREAM,
            }}
          >
            {p.title}
            <br />
            <span className="italic" style={{ color: `${CREAM}CC` }}>
              {p.titleItalic}
            </span>
          </h3>
          <p
            className="mx-auto mt-6 max-w-xl font-display italic"
            style={{ fontSize: "1.2rem", color: `${CREAM}B3`, lineHeight: 1.5 }}
          >
            &ldquo;{p.tagline}&rdquo;
          </p>
        </motion.div>

        {/* Editorial diptych — main sauna photo + chan inset (offset down) */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 50 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.43, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-14 grid grid-cols-12 gap-6 md:gap-10"
        >
          {/* Main wide photo — takes 8 of 12 columns on desktop */}
          <Link
            href={p.href}
            className="group col-span-12 block md:col-span-8"
          >
            <div
              className="relative aspect-[4/3] w-full overflow-hidden md:aspect-[16/11]"
              style={{ boxShadow: "0 50px 100px -40px rgba(0,0,0,0.7)" }}
            >
              <Image
                src={p.image}
                alt={p.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 66vw"
                className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.04]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-3"
                style={{ border: `1px solid ${GOLD}66` }}
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(15,31,24,0.55), transparent 60%)",
                }}
              />
            </div>
            <p
              className="mt-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em]"
              style={{ color: `${GOLD}CC` }}
            >
              <span className="h-px w-8" style={{ backgroundColor: `${GOLD}66` }} />
              <span>Мала та велика лазня</span>
            </p>
          </Link>

          {/* Chan photo — tall, offset down on desktop for magazine diptych rhythm */}
          <Link
            href="/sauna/booking"
            className="group col-span-12 block md:col-span-4 md:mt-20 lg:mt-32"
          >
            <div
              className="relative aspect-[3/4] w-full overflow-hidden"
              style={{ boxShadow: "0 40px 80px -30px rgba(0,0,0,0.6)" }}
            >
              <Image
                src="/images/sauna/chan_citrus_couple_night.jpg"
                alt="Карпатський чан на дровах під відкритим небом"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.06]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-3"
                style={{ border: `1px solid ${GOLD}66` }}
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(15,31,24,0.65), transparent 55%)",
                }}
              />
              <span
                aria-hidden
                className="absolute left-5 top-5 font-display text-xs italic"
                style={{ color: `${GOLD}E6` }}
              >
                №&nbsp;II
              </span>
            </div>
            <p
              className="mt-4 flex items-center justify-end gap-3 text-[10px] uppercase tracking-[0.32em]"
              style={{ color: `${GOLD}CC` }}
            >
              <span>Карпатський чан</span>
              <span className="h-px w-8" style={{ backgroundColor: `${GOLD}66` }} />
            </p>
          </Link>
        </motion.div>

        {/* ritual row: stat + highlights + CTA */}
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 30 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px" }}
          transition={{ duration: 0.41, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 grid grid-cols-12 gap-y-10 gap-x-8"
        >
          <div className="col-span-12 md:col-span-3">
            <div className="flex items-end gap-3">
              <span
                className="font-display"
                style={{
                  fontSize: "clamp(4rem, 7vw, 6.5rem)",
                  lineHeight: 0.8,
                  fontWeight: 300,
                  color: GOLD,
                  letterSpacing: "-0.03em",
                }}
              >
                {p.stat.value}
              </span>
            </div>
            <p
              className="mt-2 text-[11px] uppercase tracking-[0.22em]"
              style={{ color: `${CREAM}80` }}
            >
              {p.stat.label}
            </p>
          </div>

          <div className="col-span-12 md:col-span-5">
            <p
              className="mb-4 text-[10px] uppercase tracking-[0.3em]"
              style={{ color: `${GOLD}` }}
            >
              Ритуал
            </p>
            <ul className="space-y-2 text-sm" style={{ color: `${CREAM}CC` }}>
              {p.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="mt-[9px] inline-block h-px w-4"
                    style={{ backgroundColor: GOLD }}
                  />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-12 md:col-span-4">
            <div
              className="mb-6 text-[11px] uppercase tracking-[0.2em]"
              style={{ color: `${CREAM}80` }}
            >
              {p.priceHint}
              {p.hours && (
                <>
                  <br />
                  {p.hours}
                </>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <BookButton seasonLocked={p.seasonLocked} dark={true} />
              <DetailLink href={p.href} dark={true} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ---------- section ---------- */

export default function HomeServices() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section id="services" className="relative">
      {/* Intro strip — cream, quiet */}
      <div
        className="relative overflow-hidden border-b"
        style={{
          backgroundColor: CREAM,
          color: INK,
          borderColor: `${INK}14`,
        }}
      >
        <div className="relative mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-28 lg:px-16">
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 30 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px" }}
            transition={{ duration: 0.41, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-12 items-end gap-y-8 gap-x-10"
          >
            <div className="col-span-12 lg:col-span-8">
              <p
                className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.32em]"
                style={{ color: `${INK}99` }}
              >
                <Hairline dark={false} />
                Чотири напрямки — один комплекс
              </p>
              <h2
                className="font-display"
                style={{
                  fontSize: "clamp(2.25rem, 5.2vw, 5rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.025em",
                  fontWeight: 300,
                  color: INK,
                }}
              >
                Кожен напрямок —{" "}
                <span className="italic" style={{ color: MOSS }}>
                  окрема історія
                </span>
                , одне місце.
              </h2>
            </div>
            <div
              className="col-span-12 text-sm leading-relaxed lg:col-span-4"
              style={{ color: `${INK}99` }}
            >
              Готель, ресторан, аквапарк і лазня на одній території. Приїздіть
              на обід, залишайтеся на вихідні, святкуйте весілля чи ювілей на
              150 гостей.
            </div>
          </motion.div>
        </div>
      </div>

      {/* Four alternating panels — each unique */}
      <PanelHotel p={PANELS[0]} reduced={reduced} />
      <PanelAqua p={PANELS[1]} reduced={reduced} />
      <PanelRestaurant p={PANELS[2]} reduced={reduced} />
      <PanelBanya p={PANELS[3]} reduced={reduced} />
    </section>
  );
}
