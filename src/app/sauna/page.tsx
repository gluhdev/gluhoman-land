import { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import { Phone, Flame } from "lucide-react";
import { BookingButton } from "@/components/ui/BookingButton";
import { HallSlider, type HallSlide } from "@/components/restaurant/HallSlider";
import { Reveal } from "@/components/restaurant/Reveal";
import { SectionFlourish } from "@/components/restaurant/SectionFlourish";
import { HeroParallax } from "@/components/restaurant/HeroParallax";
import { FloatingNav } from "@/components/restaurant/FloatingNav";

export const metadata: Metadata = {
  title: "Лазня на дровах Глухомань — Чани, віники та масажі під Полтавою",
  description:
    "Дві лазні на дровах з карпатськими чанами під відкритим небом. Масажі дубовими, бамбуковими віниками, стоун-масаж, тайський масаж, скраби. Крафтове пиво, трав'яний чай та мед з пасіки «Глухомані».",
  openGraph: {
    title: "Лазня на дровах Глухомань — Тіло та дух",
    description:
      "Чани на дровах, віники, масажі, скраби та крафтове пиво у комплексі «Глухомань».",
    type: "website",
    locale: "uk_UA",
    images: [
      {
        url: "/og-sauna.jpg",
        width: 1200,
        height: 630,
        alt: "Лазня на дровах Глухомань",
      },
    ],
  },
};

const PHONE_COMPLEX = "0532-648-548";
const PHONE_RESTAURANT = "050 850 3 555";
const PHONE_HOTEL = "050 406 3 555";
const PHONE_HOTEL_2 = "067 640 3 555";
const PHONE_SAUNA = "066 007 65 56";
const PHONE_SAUNA_TEL = "+380660076556";
const PHONE_RESTAURANT_TEL = "+380508503555";

const S = (n: number) => `/images/sauna/doc/${n}.jpg`;

const saunaJsonLd = {
  "@context": "https://schema.org",
  "@type": "HealthClub",
  name: "Лазня «Глухомань»",
  description:
    "Дві лазні на дровах з карпатськими чанами, масажі, скраби та крафтове пиво.",
  image: [
    `https://gluhoman.com.ua${S(1)}`,
    `https://gluhoman.com.ua${S(7)}`,
    `https://gluhoman.com.ua${S(17)}`,
  ],
  telephone: PHONE_SAUNA_TEL,
  address: {
    "@type": "PostalAddress",
    addressCountry: "UA",
    addressRegion: "Полтавська область",
    addressLocality: "с. Нижні Млини",
  },
};

const navEntries = [
  { id: "intro", roman: "0", label: "Про лазню" },
  { id: "mala", roman: "I", label: "Мала лазня" },
  { id: "velyka", roman: "II", label: "Велика лазня" },
  { id: "prices", roman: "§", label: "Оренда та ціни" },
  { id: "oak", roman: "III", label: "Дубові віники" },
  { id: "carpathian", roman: "IV", label: "Карпатський чан" },
  { id: "citrus", roman: "V", label: "Цитрусовий чан" },
  { id: "tea", roman: "VI", label: "Чай та мед" },
  { id: "beer", roman: "VII", label: "Крафтове пиво" },
  { id: "stone", roman: "VIII", label: "Стоун масаж" },
  { id: "classic", roman: "IX", label: "Класичний" },
  { id: "thai", roman: "X", label: "Тайський" },
  { id: "bamboo", roman: "XI", label: "Бамбук" },
  { id: "scrub", roman: "XII", label: "Скрабування" },
];

/* ══════════════════════════════════════════════════════════════════
   Atoms
   ══════════════════════════════════════════════════════════════════ */

function SectionEyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <p
      className={`text-[11px] uppercase tracking-[0.28em] font-medium ${
        light ? "text-[#e6d9b8]" : "text-[#1a3d2e]/70"
      }`}
    >
      {children}
    </p>
  );
}

function SectionTitle({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <h2
      className={`font-display text-3xl md:text-4xl lg:text-[44px] leading-[1.1] tracking-tight mb-6 ${
        light ? "text-[#f4ecd8]" : "text-[#1a3d2e]"
      }`}
    >
      {children}
    </h2>
  );
}

function Paragraph({
  children,
  light = false,
  className = "",
}: {
  children: React.ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <p
      className={`text-[17px] leading-[1.7] ${
        light ? "text-[#f4ecd8]/80" : "text-[#0f1f18]/80"
      } ${className}`}
    >
      {children}
    </p>
  );
}

function BookingCTA({
  label = "Забронювати лазню",
  prefix = "або за тел:",
  light = false,
}: {
  label?: string;
  prefix?: string;
  light?: boolean;
}) {
  const mutedText = light ? "text-[#f4ecd8]/60" : "text-[#0f1f18]/55";
  const phoneText = light
    ? "text-[#e6d9b8] hover:text-[#f4ecd8]"
    : "text-[#1a3d2e] hover:text-[#0f1f18]";

  return (
    <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
      <BookingButton
        service="sauna"
        className={`inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-medium tracking-wide transition-colors min-h-[44px] ${
          light
            ? "bg-[#e6d9b8] text-[#0f1f18] hover:bg-[#f4ecd8]"
            : "bg-[#1a3d2e] text-[#f4ecd8] hover:bg-[#0f1f18]"
        }`}
      >
        <Phone className="w-4 h-4" strokeWidth={2} />
        {label}
      </BookingButton>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px]">
        <span className={`${mutedText} tracking-wide`}>{prefix}</span>
        <a
          href={`tel:${PHONE_SAUNA_TEL}`}
          className={`font-display italic underline underline-offset-[5px] decoration-1 decoration-current/40 hover:decoration-current transition-colors ${phoneText}`}
        >
          {PHONE_SAUNA}
        </a>
      </div>
    </div>
  );
}

function PriceRow({
  label,
  value,
  italic,
  light = false,
}: {
  label: string;
  value: string;
  italic?: string;
  light?: boolean;
}) {
  const labelColor = light ? "text-[#f4ecd8]" : "text-[#0f1f18]";
  const italicColor = light ? "text-[#f4ecd8]/55" : "text-[#0f1f18]/55";
  const valueColor = light ? "text-[#e6d9b8]" : "text-[#1a3d2e]";
  const dot = light ? "border-[#e6d9b8]/30" : "border-[#1a3d2e]/25";
  return (
    <div className="flex items-baseline gap-3">
      <span className={`text-[15px] ${labelColor}`}>{label}</span>
      {italic && (
        <span className={`font-display italic text-[14px] ${italicColor}`}>
          {italic}
        </span>
      )}
      <span
        aria-hidden
        className={`flex-1 border-b border-dotted ${dot}`}
      />
      <span className={`font-display text-lg ${valueColor} whitespace-nowrap`}>
        {value}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Reusable section
   ══════════════════════════════════════════════════════════════════ */

function SaunaSection({
  id,
  roman,
  eyebrow,
  titleBold,
  titleItalic,
  body,
  extra,
  photos,
  aspect = "aspect-[16/10]",
  light = false,
  reverse = false,
  ghost,
  ctaLabel = "Забронювати лазню",
  noCta = false,
}: {
  id: string;
  roman: string;
  eyebrow: string;
  titleBold: React.ReactNode;
  titleItalic?: string;
  body: React.ReactNode;
  extra?: React.ReactNode;
  photos: HallSlide[];
  aspect?: string;
  light?: boolean;
  reverse?: boolean;
  ghost?: string;
  ctaLabel?: string;
  noCta?: boolean;
}) {
  const bg = light ? "bg-[#0f1f18] text-[#f4ecd8]" : "bg-[#faf6ec]";
  const romanColor = light ? "text-[#e6d9b8]/60" : "text-[#1a3d2e]/35";
  const italicColor = light ? "text-[#e6d9b8]/80" : "text-[#1a3d2e]/65";

  return (
    <section
      id={id}
      className={`py-20 md:py-28 ${bg} relative overflow-hidden scroll-mt-20 rest-grain ${
        light ? "" : "rest-grain--light"
      }`}
    >
      {light && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            background:
              "radial-gradient(55% 45% at 75% 30%, #e6a23c 0%, transparent 70%)",
          }}
        />
      )}

      {ghost && (
        <span
          aria-hidden
          className={`rest-ghost-roman ${light ? "rest-ghost-roman--light" : ""}`}
          style={{
            top: "50%",
            [reverse ? "left" : "right"]: "-4vw",
            transform: "translateY(-50%)",
          }}
        >
          {ghost}
        </span>
      )}

      <div className="max-w-6xl mx-auto px-6 relative">
        <div
          className={`grid md:grid-cols-12 gap-10 md:gap-12 items-center ${
            reverse ? "md:[&>*:first-child]:order-2" : ""
          }`}
        >
          <Reveal className="md:col-span-5">
            <div className="flex items-baseline gap-4 mb-5">
              <span
                className={`font-display italic text-4xl md:text-5xl leading-none ${romanColor}`}
              >
                {roman}
              </span>
              <SectionEyebrow light={light}>{eyebrow}</SectionEyebrow>
            </div>
            <SectionTitle light={light}>
              {titleBold}
              {titleItalic && (
                <span
                  className={`block font-display italic mt-2 ${italicColor}`}
                >
                  {titleItalic}
                </span>
              )}
            </SectionTitle>
            <Paragraph light={light}>{body}</Paragraph>
            {extra && <div className="mt-6">{extra}</div>}
            {!noCta && <BookingCTA light={light} label={ctaLabel} />}
          </Reveal>

          <Reveal className="md:col-span-7" delay={0.15}>
            <HallSlider
              photos={photos}
              light={light}
              aspect={aspect}
              base="/images/sauna/doc/"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Page
   ══════════════════════════════════════════════════════════════════ */

export default function SaunaPage() {
  return (
    <div className="bg-[#faf6ec]">
      <Script
        id="sauna-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(saunaJsonLd)}
      </Script>

      <FloatingNav entries={navEntries} />

      {/* ═══════════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92svh] flex items-center justify-center overflow-clip bg-[#0b1410] text-[#f4ecd8] rest-grain">
        <HeroParallax>
          <Image
            src={S(1)}
            alt="Лазня на дровах Глухомань — зовнішній вигляд"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover opacity-55"
          />
        </HeroParallax>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1410]/55 via-[#0b1410]/30 to-[#0b1410]" />

        <Reveal className="relative z-10 max-w-5xl px-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#e6d9b8] mb-6">
            Лазня
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-6 font-light">
            Лазня + Чан
          </h1>
          <p className="font-display text-3xl md:text-5xl text-[#f4ecd8] max-w-3xl mx-auto leading-[1.05] mb-2">
            Джерело здоров&apos;я серед лісу.
          </p>
          <p className="font-display italic text-2xl md:text-4xl text-[#e6d9b8]/90 max-w-3xl mx-auto leading-snug mb-10">
            Дві лазні на дровах. Карпатські чани під відкритим небом.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <BookingButton
              service="sauna"
              className="inline-flex items-center justify-center gap-2 bg-[#e6d9b8] text-[#0f1f18] px-8 sm:px-10 py-4 text-sm font-medium tracking-wide hover:bg-[#f4ecd8] transition-colors min-h-[44px] w-full sm:w-auto"
            >
              <Phone className="w-4 h-4" strokeWidth={2} />
              Забронювати лазню
            </BookingButton>
            <a
              href="#prices"
              className="inline-flex items-center justify-center gap-2 border border-[#e6d9b8]/70 text-[#f4ecd8] px-8 sm:px-10 py-4 text-sm font-medium tracking-wide hover:bg-[#e6d9b8]/10 transition-colors min-h-[44px] w-full sm:w-auto"
            >
              <Flame className="w-4 h-4" strokeWidth={2} />
              Переглянути ціни
            </a>
          </div>
        </Reveal>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          INTRO — Про лазню
          ═══════════════════════════════════════════════════════════ */}
      <section
        id="intro"
        className="py-20 md:py-28 bg-[#faf6ec] relative overflow-hidden scroll-mt-20 rest-grain rest-grain--light"
      >
        <span
          aria-hidden
          className="rest-ghost-roman"
          style={{ top: "50%", right: "-6vw", transform: "translateY(-50%)" }}
        >
          0
        </span>
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid md:grid-cols-12 gap-10 md:gap-12 items-center">
            <Reveal className="md:col-span-5">
              <div className="flex items-baseline gap-4 mb-5">
                <span className="font-display italic text-4xl md:text-5xl leading-none text-[#1a3d2e]/35">
                  0
                </span>
                <SectionEyebrow>Про лазню</SectionEyebrow>
              </div>
              <SectionTitle>
                Джерело здоров&apos;я
                <span className="block font-display italic text-[#1a3d2e]/65 mt-2">
                  та відпочинку на свій смак.
                </span>
              </SectionTitle>
              <Paragraph>
                Лазня — це унікальне місце, де кожен зможе знайти джерело
                здоров&apos;я та відпочинку на свій смак. На території
                ресторанно – готельного комплексу «Глухомань» біля лісу
                знаходяться дві лазні на дровах з карпатськими чанами під
                відкритим небом: Мала лазня та Велика лазня, де Ви маєте змогу
                насолодитися всіма перевагами та традиціями оздоровчих процедур:
                різноманітні масажі, скраби, обгортання, закарпатський та
                цитрусовий чан.
              </Paragraph>
              <BookingCTA />
            </Reveal>

            <Reveal className="md:col-span-7" delay={0.15}>
              <HallSlider
                aspect="aspect-[4/3]"
                base="/images/sauna/doc/"
                photos={[
                  { n: 1, alt: "Мала лазня — зовнішній вигляд серед лісу" },
                  { n: 7, alt: "Басейн Великої лазні у приміщенні" },
                  { n: 5, alt: "Карпатські чани під відкритим небом" },
                ]}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          I — Мала лазня
          ═══════════════════════════════════════════════════════════ */}
      <SaunaSection
        id="mala"
        roman="I"
        ghost="I"
        eyebrow="Мала лазня"
        titleBold="Мала лазня"
        titleItalic="з басейном просто неба."
        body="Басейн у Малій лазні знаходиться на вулиці. Дерев'яний зруб з липи, просторі лавки та кімната відпочинку з самоваром — усе, що потрібно для тихого вечора вдвох або з найближчими."
        aspect="aspect-[4/3]"
        photos={[
          { n: 1, alt: "Мала лазня — дерев'яний зруб, червоний дах" },
          { n: 2, alt: "Басейн на вулиці та купіль у Малій лазні" },
          { n: 3, alt: "Кімната відпочинку Малої лазні з самоваром" },
          { n: 4, alt: "Кам'яний майданчик перед чаном серед дерев" },
        ]}
      />

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          II — Велика лазня
          ═══════════════════════════════════════════════════════════ */}
      <SaunaSection
        id="velyka"
        roman="II"
        ghost="II"
        eyebrow="Велика лазня"
        titleBold="Велика лазня"
        titleItalic="з басейном у приміщенні."
        body="У Великій лазні басейн знаходиться в приміщенні — можна парити і охолоджуватись незалежно від погоди. Просторі кімнати відпочинку з дубовими лавками, стеля, прикрашена зв'язками лозового листя."
        light
        reverse
        aspect="aspect-[4/3]"
        photos={[
          { n: 7, alt: "Басейн Великої лазні в приміщенні" },
          { n: 5, alt: "Карпатський чан на вулиці Великої лазні" },
          { n: 6, alt: "Кімната відпочинку з листям, шкіряний диван" },
          { n: 8, alt: "Кімната відпочинку з самоваром у Великій лазні" },
        ]}
      />

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          § — Оренда, влаштування + прайс-картки
          ═══════════════════════════════════════════════════════════ */}
      <section
        id="prices"
        className="py-20 md:py-28 bg-[#faf6ec] relative overflow-hidden scroll-mt-20 rest-grain rest-grain--light"
      >
        <span
          aria-hidden
          className="rest-ghost-roman"
          style={{ top: "50%", right: "-6vw", transform: "translateY(-50%)" }}
        >
          §
        </span>
        <div className="max-w-6xl mx-auto px-6 relative">
          <Reveal className="max-w-3xl mx-auto text-center mb-14">
            <div className="flex items-baseline gap-4 mb-5 justify-center">
              <span className="font-display italic text-4xl md:text-5xl leading-none text-[#1a3d2e]/35">
                §
              </span>
              <SectionEyebrow>Оренда та ціни</SectionEyebrow>
            </div>
            <SectionTitle>
              Оренда лазні — 900 грн/год
              <span className="block font-display italic text-[#1a3d2e]/65 mt-2">
                мінімальне замовлення 2 години, до 7-ми осіб.
              </span>
            </SectionTitle>
            <Paragraph className="max-w-2xl mx-auto">
              Як влаштована лазня на дровах? По-перше, справжні лазні повністю
              дерев&apos;яні, за винятком печі-кам&apos;янки. Лазня в
              «Глухомані» облицьована липою і обладнана декількома полками
              виготовленими з липи. Температура повітря в парній досягає 90
              – 100 °С.
            </Paragraph>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="max-w-5xl mx-auto">
              <p className="text-center text-[10px] uppercase tracking-[0.32em] text-[#1a3d2e]/50 mb-6">
                Перелік послуг 2025–2026
              </p>
              <HallSlider
                aspect="aspect-[3/4]"
                base="/images/sauna/doc/"
                photos={[
                  { n: 9, alt: "Прайс: оренда лазні, чани, оздоровчі процедури" },
                  { n: 10, alt: "Прайс: масажі та оздоровчі комплекси" },
                  { n: 11, alt: "Комплексна програма «Слов'янський еліксир»" },
                  { n: 12, alt: "Комплексна програма «Богатир»" },
                  { n: 13, alt: "Комплексна програма «Новачок» та контакти" },
                ]}
              />
              <p className="text-center text-[13px] text-[#0f1f18]/55 mt-6 italic">
                Портретні картки — проведіть пальцем або клікніть стрілки, щоб
                подивитись повний перелік послуг і цін.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 flex justify-center">
            <BookingCTA label="Забронювати лазню" />
          </div>
        </div>
      </section>

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          III — Дубові віники
          ═══════════════════════════════════════════════════════════ */}
      <SaunaSection
        id="oak"
        roman="III"
        ghost="III"
        eyebrow="Масаж дубовими віниками"
        titleBold="Віники в парній"
        titleItalic="— серце лазні."
        body={
          <>
            Пропарка віниками покращує кровообіг, очищає шкіру та виводить
            токсини, а також розслабляє м&apos;язи та зміцнює імунітет. Під час
            процедури розпарений віник виділяє ефірні олії та фітонциди, які
            живлять шкіру та мають антибактеріальну дію.
            <span className="block mt-4">
              Через високий вміст пари в повітрі прогрів організму набагато
              сильніший, ніж в сауні: піт не випаровується, і за рахунок
              посиленої циркуляції крові починають прогріватися внутрішні
              тканини. Після зігріву — охолодження в басейні з холодною водою,
              і так кілька разів з тепла в холод і назад. Чудове загартовування
              організму і тренування судин!
            </span>
          </>
        }
        extra={
          <div className="rounded-sm bg-[#0f1f18]/50 ring-1 ring-[#e6d9b8]/20 px-5 py-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#e6d9b8]/70 mb-2">
              Додатково — аромотерапія
            </p>
            <p className="font-display italic text-[#f4ecd8]/90 text-lg">
              м&apos;ята · евкаліпт · прополіс
            </p>
          </div>
        }
        light
        photos={[
          { n: 14, alt: "Масаж дубовими віниками в парній" },
          { n: 15, alt: "Дубовий віник розкриває ефірні олії" },
          { n: 16, alt: "Охолодження в басейні після парної" },
        ]}
      />

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          IV — Карпатський чан
          ═══════════════════════════════════════════════════════════ */}
      <SaunaSection
        id="carpathian"
        roman="IV"
        ghost="IV"
        eyebrow="Карпатський чан"
        titleBold="Карпатський чан"
        titleItalic="на лікарських травах."
        body="Доповнення до лазні «Карпатський чан» — це унікальна спа-процедура, завдяки якій можна забути про стреси і стимулювати роботу серцево-судинної системи і нирок. Процедури можуть зняти болі при ревматизмі, нормалізувати обмін речовин, знизити ризик простудних захворювань. Температура води в чані — 38–40 °С. Настоюється на ромашці, полині, звіробої та інших травах."
        extra={
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-sm bg-white/60 ring-1 ring-[#1a3d2e]/10 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/55 mb-1">
                із замовленням лазні
              </p>
              <p className="font-display text-2xl text-[#1a3d2e]">600 грн/год</p>
              <p className="text-[11px] text-[#0f1f18]/55 mt-0.5 italic">
                мін. замовлення 2 год
              </p>
            </div>
            <div className="rounded-sm bg-white/60 ring-1 ring-[#1a3d2e]/10 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/55 mb-1">
                без замовлення лазні
              </p>
              <p className="font-display text-2xl text-[#1a3d2e]">1000 грн/год</p>
              <p className="text-[11px] text-[#0f1f18]/55 mt-0.5 italic">
                мін. замовлення 2 год
              </p>
            </div>
            <p className="sm:col-span-2 text-[12px] text-[#0f1f18]/55 italic leading-relaxed">
              Щоб Ваш відпочинок був максимально приємним, після кожних гостей
              ми повністю міняємо воду в чані та проводимо дезінфекцію.
            </p>
          </div>
        }
        aspect="aspect-[4/3]"
        photos={[
          { n: 17, alt: "Карпатський чан з лікарськими травами — зимовий вечір" },
          { n: 18, alt: "Карпатський чан біля дерев'яної лазні" },
        ]}
      />

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          V — Хвойно-цитрусовий чан
          ═══════════════════════════════════════════════════════════ */}
      <SaunaSection
        id="citrus"
        roman="V"
        ghost="V"
        eyebrow="Хвойно-цитрусовий чан"
        titleBold="Хвойно-цитрусовий чан"
        titleItalic="тонус і свіжість."
        body="«Хвойно – цитрусовий карпатський чан»: аромати хвої, апельсина, лимона та грейпфрута дають тонізуючий ефект Вашому організму та дарують незрівнянний прилив енергії та гарного настрою."
        extra={
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-sm bg-[#0f1f18]/50 ring-1 ring-[#e6d9b8]/20 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#e6d9b8]/65 mb-1">
                із замовленням лазні
              </p>
              <p className="font-display text-2xl text-[#e6d9b8]">950 грн/год</p>
              <p className="text-[11px] text-[#f4ecd8]/55 mt-0.5 italic">
                мін. замовлення 2 год
              </p>
            </div>
            <div className="rounded-sm bg-[#0f1f18]/50 ring-1 ring-[#e6d9b8]/20 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#e6d9b8]/65 mb-1">
                без замовлення лазні
              </p>
              <p className="font-display text-2xl text-[#e6d9b8]">1350 грн/год</p>
              <p className="text-[11px] text-[#f4ecd8]/55 mt-0.5 italic">
                мін. замовлення 2 год
              </p>
            </div>
            <p className="sm:col-span-2 text-[12px] text-[#f4ecd8]/55 italic leading-relaxed">
              Після кожних гостей вода та цитрусові повністю оновлюються, а
              сам чан дезінфікується — Ви заходите завжди в чистоту та свіжість.
            </p>
          </div>
        }
        light
        reverse
        aspect="aspect-[4/3]"
        photos={[
          { n: 19, alt: "Пара в чані з цитрусовими і хвоєю" },
          { n: 20, alt: "Цитрусовий чан — вид згори" },
        ]}
      />

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          VI — Чай, мед та квас
          ═══════════════════════════════════════════════════════════ */}
      <SaunaSection
        id="tea"
        roman="VI"
        ghost="VI"
        eyebrow="Чай, мед та квас"
        titleBold="Водний баланс"
        titleItalic="по-нашому."
        body="Під час відвідування лазні тіло втрачає велику кількість води — щоб відновити водний баланс, Ви можете замовити трав'яний чай з баранками та медом або крафтовий квас власного виробництва."
        extra={
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#1a3d2e]/60 mb-3">
              Мед з пасіки «Глухомані» — головні переваги
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-[15px] text-[#0f1f18]/85">
              <li className="flex gap-2">
                <span className="text-[#1a3d2e] font-display italic">·</span>
                підтримка імунітету
              </li>
              <li className="flex gap-2">
                <span className="text-[#1a3d2e] font-display italic">·</span>
                природний антиоксидант
              </li>
              <li className="flex gap-2">
                <span className="text-[#1a3d2e] font-display italic">·</span>
                легке джерело енергії
              </li>
              <li className="flex gap-2">
                <span className="text-[#1a3d2e] font-display italic">·</span>
                покращує сон
              </li>
            </ul>
          </div>
        }
        noCta
        aspect="aspect-[4/3]"
        photos={[
          { n: 22, alt: "Самовар і кошик з баранками" },
          { n: 21, alt: "Крафтовий квас «Глухомань»" },
          { n: 23, alt: "Квітковий мед з пасіки «Глухомані»" },
          { n: 24, alt: "Мед у глиняному горщику з баранками" },
        ]}
      />

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          VII — Крафтове пиво
          ═══════════════════════════════════════════════════════════ */}
      <section
        id="beer"
        className="py-20 md:py-28 bg-[#0f1f18] text-[#f4ecd8] relative overflow-hidden scroll-mt-20 rest-grain"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            background:
              "radial-gradient(55% 45% at 20% 60%, #e6a23c 0%, transparent 70%)",
          }}
        />
        <span
          aria-hidden
          className="rest-ghost-roman rest-ghost-roman--light"
          style={{ top: "50%", left: "-6vw", transform: "translateY(-50%)" }}
        >
          VII
        </span>

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid md:grid-cols-12 gap-10 md:gap-12 items-center md:[&>*:first-child]:order-2">
            <Reveal className="md:col-span-5">
              <div className="flex items-baseline gap-4 mb-5">
                <span className="font-display italic text-4xl md:text-5xl leading-none text-[#e6d9b8]/60">
                  VII
                </span>
                <SectionEyebrow light>Крафтове пиво</SectionEyebrow>
              </div>
              <SectionTitle light>
                Банний відпочинок
                <span className="block font-display italic text-[#e6d9b8]/80 mt-2">
                  зі смачною вечерею.
                </span>
              </SectionTitle>
              <Paragraph light>
                А для тих, хто любить комбінувати банний відпочинок зі смачною
                вечерею, є можливість замовити їжу, коктейлі та крафтове пиво
                власного виробництва з нашого ресторану. Лазня «Глухомань» —
                ідеальне місце для тих, хто шукає якісний та незабутній
                відпочинок.
              </Paragraph>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px]">
                <span className="text-[#f4ecd8]/60 tracking-wide">
                  Замовлення їжі з ресторану:
                </span>
                <a
                  href={`tel:${PHONE_RESTAURANT_TEL}`}
                  className="font-display italic text-[#e6d9b8] hover:text-[#f4ecd8] underline underline-offset-[5px] decoration-1 decoration-current/40 hover:decoration-current transition-colors"
                >
                  {PHONE_RESTAURANT}
                </a>
              </div>

              <BookingCTA light />
            </Reveal>

            <Reveal className="md:col-span-7" delay={0.15}>
              <HallSlider
                light
                aspect="aspect-[4/3]"
                base="/images/sauna/doc/"
                photos={[
                  { n: 25, alt: "Крафтове пиво та копчене м'ясо в лазні" },
                  { n: 27, alt: "Дегустація пива «Глухомані»" },
                  { n: 26, alt: "Гості у лазні за пивом" },
                ]}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          VIII — Стоун масаж
          ═══════════════════════════════════════════════════════════ */}
      <SaunaSection
        id="stone"
        roman="VIII"
        ghost="VIII"
        eyebrow="Стоун масаж"
        titleBold="Стоун масаж."
        titleItalic="Гармонія та сила."
        body="Стоун масаж надає користь завдяки глибокому розслабленню м'язів, покращенню кровообігу, зменшенню стресу та полегшенню болю. А також гармонізує нервову систему. Дарує відчуття легкості, гармонії та припливу сил."
        extra={
          <div className="space-y-2">
            <PriceRow label="Стоун масаж" italic="50 / 80 хв" value="900 / 1200 грн" />
            <p className="text-[11px] text-[#0f1f18]/55 mt-3 italic">
              Послуги сертифікованого масажиста доступні за попереднім записом.
            </p>
          </div>
        }
        aspect="aspect-[4/3]"
        photos={[
          { n: 30, alt: "Стоун масаж у лазні «Глухомань»" },
          { n: 28, alt: "Гаряче каміння на спині при свічках" },
          { n: 29, alt: "Сертифікати SPA Professional майстрів лазні" },
        ]}
      />

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          IX — Класичний масаж
          ═══════════════════════════════════════════════════════════ */}
      <SaunaSection
        id="classic"
        roman="IX"
        ghost="IX"
        eyebrow="Класичний масаж тіла"
        titleBold="Класичний масаж тіла."
        body="Класичний масаж корисний для розслаблення м'язів, зняття болю та стресу, поліпшення кровообігу та лімфотоку. Він сприяє підвищенню еластичності шкіри, покращенню якості сну, зміцненню імунної системи та відновленню працездатності після фізичних навантажень або травм."
        extra={
          <div className="space-y-2">
            <PriceRow light label="Масаж «Класичний»" italic="20 хв" value="350 грн" />
            <PriceRow light label="Масаж «Класичний»" italic="30 хв" value="450 грн" />
            <PriceRow light label="Масаж «Класичний»" italic="50 хв" value="550 грн" />
            <p className="text-[11px] text-[#f4ecd8]/60 mt-3 italic">
              Послуги сертифікованого масажиста доступні за попереднім записом.
            </p>
          </div>
        }
        light
        reverse
        aspect="aspect-[4/3]"
        photos={[
          { n: 32, alt: "Класичний масаж тіла — майстер лазні" },
          { n: 31, alt: "Класичний масаж — близький кадр" },
        ]}
      />

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          X — Тайський масаж
          ═══════════════════════════════════════════════════════════ */}
      <SaunaSection
        id="thai"
        roman="X"
        ghost="X"
        eyebrow="Тайський масаж"
        titleBold="Тайський масаж"
        titleItalic="та «Пахоп»."
        body={
          <>
            Тайський масаж — це стародавній вид лікувального масажу, який поєднує
            в собі елементи розтягування, натискання та йоги. Він сприяє
            глибокому розслабленню, покращує гнучкість, кровообіг і загальне
            самопочуття, а також допомагає зняти м&apos;язову напругу.
            <span className="block mt-4">
              «Пахоп» — це вид тайського масажу, який виконується теплими
              трав&apos;яними мішечками. Процедура поєднує тепловий вплив,
              ароматерапію та масажні прийоми. Трав&apos;яні мішечки містять
              суміш лікувальних трав, які підігріваються перед процедурою.
            </span>
          </>
        }
        extra={
          <div className="space-y-2">
            <PriceRow label="Традиційний тайський + «Пахоп»" italic="45 хв" value="700 грн" />
            <PriceRow label="Традиційний тайський" italic="40 хв" value="550 грн" />
            <PriceRow label="Тайський релакс арома-ойл" italic="40 хв" value="550 грн" />
            <PriceRow label="Тайський фут-масаж (стоп)" italic="35 хв" value="450 грн" />
            <p className="text-[11px] text-[#0f1f18]/55 mt-3 italic">
              Послуги сертифікованого масажиста доступні за попереднім записом.
            </p>
          </div>
        }
        aspect="aspect-[4/3]"
        photos={[
          { n: 33, alt: "Тайський масаж — розтягнення в лазні" },
          { n: 34, alt: "Тайський масаж — робота з суглобами" },
        ]}
      />

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          XI — Бамбуковий масаж
          ═══════════════════════════════════════════════════════════ */}
      <SaunaSection
        id="bamboo"
        roman="XI"
        ghost="XI"
        eyebrow="Бамбуковий масаж"
        titleBold="Масаж"
        titleItalic="бамбуковими віниками."
        body="Масаж бамбуковими віниками має давнє східне коріння — з Китаю та Японії. Бамбук здавна вважають символом сили, гнучкості та оздоровлення. Масаж приносить глибоке розслаблення м'язів, зняття напруги та стресу, покращення кровообігу і лімфотоку, а також боротьбу з целюлітом. Додатково — поліпшує рухливість суглобів та сприяє загальному покращенню самопочуття."
        extra={
          <div className="space-y-2">
            <PriceRow light label="Масаж бамбуковими віниками" italic="20 хв" value="400 грн" />
            <p className="text-[11px] text-[#f4ecd8]/60 mt-3 italic">
              Послуги сертифікованого масажиста доступні за попереднім записом.
            </p>
          </div>
        }
        light
        reverse
        aspect="aspect-[4/3]"
        photos={[
          { n: 36, alt: "Бамбуковий масаж у лазні" },
          { n: 37, alt: "Бамбукові віники — майстер за роботою" },
          { n: 35, alt: "Бамбукові палички підготовлені до процедури" },
        ]}
      />

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          XII — Скрабування
          ═══════════════════════════════════════════════════════════ */}
      <SaunaSection
        id="scrub"
        roman="XII"
        ghost="XII"
        eyebrow="Скрабування"
        titleBold="Скраби в лазні"
        titleItalic="— оновлення шкіри."
        body="Скраб у лазні приносить користь завдяки поєднанню ефектів від гарячого пару та механічного очищення. Він глибоко очищає шкіру, стимулює кровообіг, виводить токсини. В результаті шкіра стає гладенькою, м'якою, зволоженою та оновленою."
        extra={
          <div className="space-y-1.5">
            <PriceRow label="Сіль-глина" value="300 грн" />
            <PriceRow label="Сода-лимон" value="300 грн" />
            <PriceRow label="Сіль-арома" value="300 грн" />
            <PriceRow label="«Кавово-медовий»" value="400 грн" />
            <PriceRow label="«Кавово-сольовий»" value="400 грн" />
            <PriceRow label="«Шоколад»" value="400 грн" />
            <PriceRow label="«Сіль, гірчиця, мед, пиво»" value="—" />
            <PriceRow
              label="Фруктова аплікація"
              italic="яблуко, апельсин, банан, морква"
              value="400 грн"
            />
            <p className="text-[11px] text-[#0f1f18]/55 mt-3 italic">
              Послуги сертифікованого масажиста доступні за попереднім записом.
            </p>
          </div>
        }
        aspect="aspect-[4/3]"
        photos={[
          { n: 38, alt: "Скрабування у лазні" },
          { n: 39, alt: "Кавовий скраб — процедура для ніг" },
        ]}
      />

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 bg-[#0b1410] text-[#f4ecd8] overflow-hidden rest-grain">
        <Image
          src={S(17)}
          alt=""
          fill
          aria-hidden
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1410]/80 via-[#0b1410]/70 to-[#0b1410]" />
        <Reveal className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#e6d9b8] mb-6">
            Лазня «Глухомань»
          </p>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] mb-5">
            Тіло, дух і вогонь дров.
          </h2>
          <p className="font-display italic text-xl md:text-3xl text-[#e6d9b8]/85 mb-10">
            Приїздіть — ми нагріємо парну заздалегідь.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <BookingButton
              service="sauna"
              className="inline-flex items-center justify-center gap-2 bg-[#e6d9b8] text-[#0f1f18] px-8 sm:px-10 py-4 text-sm font-medium tracking-wide hover:bg-[#f4ecd8] transition-colors min-h-[44px] w-full sm:w-auto"
            >
              <Phone className="w-4 h-4" strokeWidth={2} />
              Забронювати лазню
            </BookingButton>
            <a
              href={`tel:${PHONE_SAUNA_TEL}`}
              className="inline-flex items-center justify-center gap-2 border border-[#e6d9b8]/70 text-[#f4ecd8] px-8 sm:px-10 py-4 text-sm font-medium tracking-wide hover:bg-[#e6d9b8]/10 transition-colors min-h-[44px] w-full sm:w-auto"
            >
              <Phone className="w-4 h-4" strokeWidth={2} />
              {PHONE_SAUNA}
            </a>
          </div>

          <div className="mt-10 pt-8 border-t border-[#e6d9b8]/15 text-[13px] text-[#f4ecd8]/60 flex flex-wrap justify-center gap-x-6 gap-y-2">
            <span>
              Комплекс: <span className="text-[#e6d9b8]">{PHONE_COMPLEX}</span>
            </span>
            <span className="text-[#e6d9b8]/25">·</span>
            <span>
              Ресторан: <span className="text-[#e6d9b8]">{PHONE_RESTAURANT}</span>
            </span>
            <span className="text-[#e6d9b8]/25">·</span>
            <span>
              Готель: <span className="text-[#e6d9b8]">{PHONE_HOTEL}</span>,{" "}
              <span className="text-[#e6d9b8]">{PHONE_HOTEL_2}</span>
            </span>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
