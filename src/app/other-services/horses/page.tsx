import type { Metadata } from "next";
import Script from "next/script";
import {
  Trophy,
  Compass,
  Users,
  Shield,
  Clock,
  Mountain,
  Heart,
  Phone,
  ArrowUpRight,
} from "lucide-react";
import { BookingButton } from "@/components/ui/BookingButton";

export const metadata: Metadata = {
  title: "Прогулянки на конях — Глухомань",
  description:
    "Верхові прогулянки лісовими стежками у заповіднику навколо рекреаційного комплексу «Глухомань». Для досвідчених і новачків. Полтавщина.",
  openGraph: {
    title: "Прогулянки на конях у Глухомані",
    description: "Верхові прогулянки заповідними стежками",
    type: "website",
    locale: "uk_UA",
  },
};

const CREAM = "#faf6ec";
const SURFACE = "#f4ecd8";
const TAN = "#e6d9b8";
const DEEP = "#0f1f18";
const FOREST = "#1a3d2e";
const NEAR_BLACK = "#0b1410";

const formats = [
  {
    numeral: "I",
    icon: Clock,
    title: "Для початківців",
    duration: "30 хвилин",
    body: "Інструктор поруч, коло біля стайні. Ідеально для першого досвіду і дітей від 8 років.",
  },
  {
    numeral: "II",
    icon: Mountain,
    title: "Лісова прогулянка",
    duration: "1 година",
    body: "Супровід інструктора, маршрут стежками заповідника. Для гостей з мінімальним досвідом.",
  },
  {
    numeral: "III",
    icon: Heart,
    title: "Романтична прогулянка",
    duration: "1,5 години",
    body: "Удвох на двох конях, тиха стежка до ставка і назад. З кави-брейком.",
  },
];

const included = [
  "Інструктаж від досвідченого вершника перед виїздом",
  "Каска і захисне спорядження",
  "Супровід інструктора протягом усієї прогулянки",
  "Час на фото з кіньми у стайні",
];

const horses = [
  {
    name: "Зоря",
    meta: "гнідий мерин · 10 років",
    body: "Спокійна і терпляча. Ідеально для дітей.",
  },
  {
    name: "Вітер",
    meta: "сірий жеребчик · 8 років",
    body: "Енергійний. Підходить досвідченим вершникам.",
  },
  {
    name: "Маруся",
    meta: "рудо-біла кобила · 12 років",
    body: "Найспокійніша у табунці. Для перших спроб.",
  },
  {
    name: "Буян",
    meta: "чорний жеребець · 7 років",
    body: "Сильний і гарний. Для романтичних фото.",
  },
];

const rules = [
  "Прогулянки з 8 років (до 12 — у супроводі дорослого поруч)",
  "Максимальна вага вершника — 100 кг",
  "Зручний одяг: довгі штани, закрите взуття",
  "Алкоголь заборонений",
  "У разі дощу або грози прогулянки скасовуються",
];

const prepare = [
  "Одягніть довгі штани і закрите взуття (кеди, черевики)",
  "Не їжте важкої їжі за 1 годину до прогулянки",
  "Прибувайте за 15 хвилин до часу — для інструктажу і знайомства з конем",
];

const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Horse riding",
  name: "Прогулянки на конях — Глухомань",
  description:
    "Верхові прогулянки лісовими стежками у заповіднику навколо рекреаційного комплексу «Глухомань».",
  provider: {
    "@type": "LodgingBusiness",
    name: "Глухомань",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Нижні Млини",
      addressRegion: "Полтавська область",
      addressCountry: "UA",
    },
  },
  areaServed: "Полтавщина",
});

export default function HorsesPage() {
  return (
    <main className="font-display" style={{ backgroundColor: CREAM, color: NEAR_BLACK }}>
      <Script id="horses-jsonld" type="application/ld+json">
        {jsonLd}
      </Script>

      {/* 1. HERO */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: DEEP, color: CREAM }}
      >
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="flex flex-col items-start gap-10 md:gap-14">
            <div
              className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full"
              style={{ backgroundColor: TAN, color: DEEP }}
            >
              <Compass className="h-9 w-9 md:h-11 md:w-11" strokeWidth={1.25} />
            </div>
            <p
              className="text-[11px] uppercase tracking-[0.22em]"
              style={{ color: TAN }}
            >
              Прогулянки • Глухомань
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[0.95] max-w-4xl">
              На конях{" "}
              <em className="italic font-light" style={{ color: TAN }}>
                лісовими стежками
              </em>
            </h1>
            <p
              className="text-lg md:text-xl max-w-2xl leading-relaxed font-light"
              style={{ color: SURFACE }}
            >
              Верхові прогулянки заповідними стежками навколо комплексу. Для
              досвідчених вершників і перших спроб — спокійні коні, уважні
              інструктори, безпечне обладнання.
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <BookingButton
                className="inline-flex items-center gap-3 px-8 py-4 text-base uppercase tracking-[0.18em]"
                style={{ backgroundColor: TAN, color: DEEP }}
              >
                Забронювати прогулянку
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
              </BookingButton>
              <a
                href="tel:+380500000000"
                className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] border-b pb-1"
                style={{ color: CREAM, borderColor: TAN }}
              >
                <Phone className="h-4 w-4" strokeWidth={1.5} />
                Зв’язатися
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTRO */}
      <section style={{ backgroundColor: CREAM, color: NEAR_BLACK }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16">
            <div className="md:col-span-5">
              <p
                className="text-[11px] uppercase tracking-[0.22em] mb-6"
                style={{ color: FOREST }}
              >
                Про прогулянки
              </p>
              <h2 className="text-4xl md:text-5xl leading-[1.05]">
                Спокійні коні,{" "}
                <em className="italic font-light" style={{ color: FOREST }}>
                  лісові стежки
                </em>
              </h2>
            </div>
            <div className="md:col-span-7">
              <p className="text-lg md:text-xl leading-relaxed font-light">
                Прогулянки на конях — один із найромантичніших способів
                провести час на природі. Ми маємо невеликий табунок спокійних,
                добре видресируваних коней, які підходять як для досвідчених
                вершників, так і для новачків. Маршрути пролягають лісовими
                стежками, повз ставок, у заповідник.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FORMATS */}
      <section style={{ backgroundColor: DEEP, color: CREAM }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="mb-16 md:mb-20 max-w-2xl">
            <p
              className="text-[11px] uppercase tracking-[0.22em] mb-6"
              style={{ color: TAN }}
            >
              Формати
            </p>
            <h2 className="text-4xl md:text-5xl leading-[1.05]">
              Три способи{" "}
              <em className="italic font-light" style={{ color: TAN }}>
                сісти в сідло
              </em>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px" style={{ backgroundColor: FOREST }}>
            {formats.map(({ numeral, icon: Icon, title, duration, body }) => (
              <article
                key={title}
                className="p-10 md:p-12 flex flex-col gap-6"
                style={{ backgroundColor: DEEP }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[11px] uppercase tracking-[0.22em]"
                    style={{ color: TAN }}
                  >
                    {numeral}
                  </span>
                  <Icon className="h-6 w-6" strokeWidth={1.25} style={{ color: TAN }} />
                </div>
                <h3 className="text-3xl leading-tight">{title}</h3>
                <p
                  className="italic font-light text-lg"
                  style={{ color: TAN }}
                >
                  {duration}
                </p>
                <p
                  className="text-base leading-relaxed font-light"
                  style={{ color: SURFACE }}
                >
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INCLUDED */}
      <section style={{ backgroundColor: CREAM, color: NEAR_BLACK }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16">
            <div className="md:col-span-4">
              <p
                className="text-[11px] uppercase tracking-[0.22em] mb-6"
                style={{ color: FOREST }}
              >
                Що включено
              </p>
              <h2 className="text-4xl md:text-5xl leading-[1.05]">
                У вартість{" "}
                <em className="italic font-light" style={{ color: FOREST }}>
                  кожної прогулянки
                </em>
              </h2>
            </div>
            <ul className="md:col-span-8 flex flex-col">
              {included.map((item, i) => (
                <li
                  key={item}
                  className="flex items-start gap-6 py-6 border-t"
                  style={{
                    borderColor: TAN,
                    borderBottomWidth: i === included.length - 1 ? 1 : 0,
                    borderBottomStyle: "solid",
                  }}
                >
                  <span
                    className="text-[11px] uppercase tracking-[0.22em] pt-1 w-10"
                    style={{ color: FOREST }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg md:text-xl font-light leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. HORSES */}
      <section style={{ backgroundColor: SURFACE, color: NEAR_BLACK }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="mb-16 md:mb-20 max-w-2xl">
            <p
              className="text-[11px] uppercase tracking-[0.22em] mb-6"
              style={{ color: FOREST }}
            >
              Наші коні
            </p>
            <h2 className="text-4xl md:text-5xl leading-[1.05]">
              Знайомтеся —{" "}
              <em className="italic font-light" style={{ color: FOREST }}>
                табунець
              </em>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-px" style={{ backgroundColor: TAN }}>
            {horses.map(({ name, meta, body }) => (
              <article
                key={name}
                className="p-10 md:p-14 flex flex-col gap-4"
                style={{ backgroundColor: SURFACE }}
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full"
                  style={{ backgroundColor: TAN, color: DEEP }}
                >
                  <Trophy className="h-6 w-6" strokeWidth={1.25} />
                </div>
                <h3
                  className="text-4xl md:text-5xl italic font-light"
                  style={{ color: DEEP }}
                >
                  {name}
                </h3>
                <p
                  className="text-[11px] uppercase tracking-[0.22em]"
                  style={{ color: FOREST }}
                >
                  {meta}
                </p>
                <p className="text-base md:text-lg leading-relaxed font-light">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SAFETY */}
      <section style={{ backgroundColor: DEEP, color: CREAM }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16">
            <div className="md:col-span-4">
              <Shield
                className="h-10 w-10 mb-8"
                strokeWidth={1.25}
                style={{ color: TAN }}
              />
              <p
                className="text-[11px] uppercase tracking-[0.22em] mb-6"
                style={{ color: TAN }}
              >
                Правила безпеки
              </p>
              <h2 className="text-4xl md:text-5xl leading-[1.05]">
                Безпека{" "}
                <em className="italic font-light" style={{ color: TAN }}>
                  передусім
                </em>
              </h2>
            </div>
            <ul className="md:col-span-8 flex flex-col">
              {rules.map((rule, i) => (
                <li
                  key={rule}
                  className="flex items-start gap-6 py-6 border-t"
                  style={{
                    borderColor: FOREST,
                    borderBottomWidth: i === rules.length - 1 ? 1 : 0,
                    borderBottomStyle: "solid",
                  }}
                >
                  <span
                    className="text-[11px] uppercase tracking-[0.22em] pt-1 w-10"
                    style={{ color: TAN }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="text-lg md:text-xl font-light leading-relaxed"
                    style={{ color: SURFACE }}
                  >
                    {rule}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 7. PRICES */}
      <section style={{ backgroundColor: CREAM, color: NEAR_BLACK }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-end">
            <div className="md:col-span-6">
              <p
                className="text-[11px] uppercase tracking-[0.22em] mb-6"
                style={{ color: FOREST }}
              >
                Ціни
              </p>
              <h2 className="text-4xl md:text-5xl leading-[1.05]">
                За{" "}
                <em className="italic font-light" style={{ color: FOREST }}>
                  запитом
                </em>
              </h2>
            </div>
            <div className="md:col-span-6">
              <p className="text-lg md:text-xl leading-relaxed font-light">
                Залежить від формату і тривалості. Групові знижки при
                замовленні на 4+ осіб.
              </p>
              <div
                className="mt-8 pt-6 flex items-center gap-3 border-t"
                style={{ borderColor: TAN, color: FOREST }}
              >
                <Users className="h-5 w-5" strokeWidth={1.25} />
                <span className="text-[11px] uppercase tracking-[0.22em]">
                  Для груп 4+ — знижки
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PREPARE */}
      <section style={{ backgroundColor: SURFACE, color: NEAR_BLACK }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="mb-16 md:mb-20 max-w-2xl">
            <p
              className="text-[11px] uppercase tracking-[0.22em] mb-6"
              style={{ color: FOREST }}
            >
              Як підготуватися
            </p>
            <h2 className="text-4xl md:text-5xl leading-[1.05]">
              Три кроки{" "}
              <em className="italic font-light" style={{ color: FOREST }}>
                перед виїздом
              </em>
            </h2>
          </div>
          <ol className="grid md:grid-cols-3 gap-px" style={{ backgroundColor: TAN }}>
            {prepare.map((step, i) => (
              <li
                key={step}
                className="p-10 md:p-12 flex flex-col gap-6"
                style={{ backgroundColor: SURFACE }}
              >
                <span
                  className="text-[11px] uppercase tracking-[0.22em]"
                  style={{ color: FOREST }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-lg md:text-xl font-light leading-relaxed">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 9. CTA */}
      <section style={{ backgroundColor: DEEP, color: CREAM }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="flex flex-col items-start gap-10">
            <p
              className="text-[11px] uppercase tracking-[0.22em]"
              style={{ color: TAN }}
            >
              Забронювати
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl leading-[0.95] max-w-4xl">
              У сідло —{" "}
              <em className="italic font-light" style={{ color: TAN }}>
                і в ліс
              </em>
            </h2>
            <p
              className="text-lg md:text-xl max-w-2xl leading-relaxed font-light"
              style={{ color: SURFACE }}
            >
              Зателефонуйте або залиште заявку — ми підберемо коня, маршрут і
              час під ваш досвід.
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <BookingButton
                className="inline-flex items-center gap-3 px-8 py-4 text-base uppercase tracking-[0.18em]"
                style={{ backgroundColor: TAN, color: DEEP }}
              >
                Забронювати прогулянку
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
              </BookingButton>
              <a
                href="tel:+380500000000"
                className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] border-b pb-1"
                style={{ color: CREAM, borderColor: TAN }}
              >
                <Phone className="h-4 w-4" strokeWidth={1.5} />
                +38 050 000 00 00
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
