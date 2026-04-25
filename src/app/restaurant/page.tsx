import { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import { Phone, UtensilsCrossed, ArrowUpRight } from "lucide-react";
import { BookingButton } from "@/components/ui/BookingButton";
import { HallSlider, type HallSlide } from "@/components/restaurant/HallSlider";
import { Reveal } from "@/components/restaurant/Reveal";
import { SectionFlourish } from "@/components/restaurant/SectionFlourish";
import { HeroParallax } from "@/components/restaurant/HeroParallax";
import { FloatingNav } from "@/components/restaurant/FloatingNav";
import { MenuDialog } from "@/components/restaurant/MenuDialog";
import { MenuTrigger } from "@/components/restaurant/MenuTrigger";
import { MenuPreview } from "@/components/restaurant/MenuPreview";

export const metadata: Metadata = {
  title: "Ресторан «Глухомань» — Європейсько-українська кухня",
  description:
    "Двоповерховий ресторан у старовинному казковому стилі з критою терасою і трьома літніми майданчиками на воді. Європейсько-українська кухня, крафтове пиво, жива музика.",
};

const PHONE_PRIMARY = "050 850 3 555";
const PHONE_SECONDARY = "0532-648-548";
const PHONE_PRIMARY_TEL = "+380508503555";
const PHONE_SECONDARY_TEL = "+380532648548";

const P = (n: number) => `/images/restaurant/doc/${n}.jpg`;

const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Ресторан Глухомань",
  description:
    "Двоповерховий ресторан у старовинному казковому стилі з критою терасою і трьома літніми майданчиками на воді. Європейсько-українська кухня.",
  servesCuisine: ["Ukrainian", "European"],
  priceRange: "$$",
  image: [
    `https://gluhoman.com.ua${P(1)}`,
    `https://gluhoman.com.ua${P(8)}`,
    `https://gluhoman.com.ua${P(15)}`,
  ],
  telephone: PHONE_PRIMARY_TEL,
  address: {
    "@type": "PostalAddress",
    addressCountry: "UA",
    addressRegion: "Полтавська область",
    addressLocality: "с. Нижні Млини",
  },
  acceptsReservations: "True",
};

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
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <p
      className={`text-[17px] leading-[1.7] ${
        light ? "text-[#f4ecd8]/80" : "text-[#0f1f18]/80"
      }`}
    >
      {children}
    </p>
  );
}

function BookingCTA({
  label = "Забронювати столик",
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
  const dotColor = light ? "text-[#e6d9b8]/40" : "text-[#1a3d2e]/30";

  return (
    <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3">
      <BookingButton
        service="restaurant"
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
          href={`tel:${PHONE_PRIMARY_TEL}`}
          className={`font-display italic underline underline-offset-[5px] decoration-1 decoration-current/40 hover:decoration-current transition-colors ${phoneText}`}
        >
          {PHONE_PRIMARY}
        </a>
        <span className={dotColor}>·</span>
        <a
          href={`tel:${PHONE_SECONDARY_TEL}`}
          className={`font-display italic underline underline-offset-[5px] decoration-1 decoration-current/40 hover:decoration-current transition-colors ${phoneText}`}
        >
          {PHONE_SECONDARY}
        </a>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Reusable hall section — compact layout with horizontal slider
   ══════════════════════════════════════════════════════════════════ */

function HallSection({
  id,
  roman,
  eyebrow,
  titleBold,
  titleItalic,
  body,
  photos,
  aspect = "aspect-[16/10]",
  light = false,
  ctaLabel = "Забронювати столик",
  reverse = false,
  ghost,
}: {
  id: string;
  roman: string;
  eyebrow: string;
  titleBold: React.ReactNode;
  titleItalic?: string;
  body: React.ReactNode;
  photos: HallSlide[];
  aspect?: string;
  light?: boolean;
  ctaLabel?: string;
  reverse?: boolean;
  ghost?: string;
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

      {/* Ghost roman numeral in background */}
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
          {/* Text column */}
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
            <Paragraph light={light}>
              {body}
            </Paragraph>
            <BookingCTA light={light} label={ctaLabel} />
          </Reveal>

          {/* Slider column */}
          <Reveal className="md:col-span-7" delay={0.15}>
            <HallSlider photos={photos} light={light} aspect={aspect} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Page
   ══════════════════════════════════════════════════════════════════ */

export default function RestaurantPage() {
  return (
    <div className="bg-[#faf6ec]">
      <Script id="restaurant-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(restaurantJsonLd)}
      </Script>

      <FloatingNav />
      <MenuDialog />

      {/* ═══════════════════════════════════════════════════════════
          1. HERO (with parallax)
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92svh] flex items-center justify-center overflow-clip bg-[#0b1410] text-[#f4ecd8] rest-grain">
        <HeroParallax>
          <Image
            src={P(1)}
            alt="Літні майданчики ресторану Глухомань на воді"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover opacity-50"
          />
        </HeroParallax>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1410]/50 via-[#0b1410]/30 to-[#0b1410]" />

        <Reveal className="relative z-10 max-w-5xl px-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#e6d9b8] mb-6">
            Ресторан
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-6 font-light">
            «Глухомань»
          </h1>
          <p className="font-display text-3xl md:text-5xl text-[#f4ecd8] max-w-3xl mx-auto leading-[1.05] mb-2">
            Казковий світ смаку.
          </p>
          <p className="font-display italic text-2xl md:text-4xl text-[#e6d9b8]/90 max-w-3xl mx-auto leading-snug mb-10">
            Серед фонтанів і лебедів.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <BookingButton
              service="restaurant"
              className="inline-flex items-center justify-center gap-2 bg-[#e6d9b8] text-[#0f1f18] px-8 sm:px-10 py-4 text-sm font-medium tracking-wide hover:bg-[#f4ecd8] transition-colors min-h-[44px] w-full sm:w-auto"
            >
              <Phone className="w-4 h-4" strokeWidth={2} />
              Забронювати столик
            </BookingButton>
            <MenuTrigger className="inline-flex items-center justify-center gap-2 border border-[#e6d9b8]/70 text-[#f4ecd8] px-8 sm:px-10 py-4 text-sm font-medium tracking-wide hover:bg-[#e6d9b8]/10 transition-colors min-h-[44px] w-full sm:w-auto cursor-pointer">
              <UtensilsCrossed className="w-4 h-4" strokeWidth={2} />
              Переглянути меню
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2} />
            </MenuTrigger>
          </div>
        </Reveal>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          2. INTRO — двоповерховий ресторан
          ═══════════════════════════════════════════════════════════ */}
      <section id="intro" className="py-20 md:py-28 bg-[#faf6ec] relative overflow-hidden scroll-mt-20 rest-grain rest-grain--light">
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
                <SectionEyebrow>Про ресторан</SectionEyebrow>
              </div>
              <SectionTitle>
                Двоповерховий ресторан
                <span className="block font-display italic text-[#1a3d2e]/65 mt-2">
                  у старовинному казковому стилі.
                </span>
              </SectionTitle>
              <Paragraph>
                На території ресторанно – готельного комплексу «Глухомань» на
                Вас очікує двоповерховий ресторан в старовинному казковому
                стилі з критою терасою і трьома літніми майданчиками на воді в
                оточенні фонтанів та лебедів.
              </Paragraph>
              <BookingCTA />
            </Reveal>

            <Reveal className="md:col-span-7" delay={0.15}>
              <HallSlider
                aspect="aspect-[4/3]"
                photos={[
                  { n: 2, alt: "Зал ресторану, прикрашений до свят" },
                  { n: 3, alt: "Зал ресторану у день Св. Валентина" },
                ]}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          3. CUISINE & BEER
          ═══════════════════════════════════════════════════════════ */}
      <section id="cuisine" className="py-20 md:py-28 bg-[#0f1f18] text-[#f4ecd8] relative overflow-hidden scroll-mt-20 rest-grain">
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
          §
        </span>

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid md:grid-cols-12 gap-10 md:gap-12 items-center md:[&>*:first-child]:order-2">
            <Reveal className="md:col-span-5">
              <div className="flex items-baseline gap-4 mb-5">
                <span className="font-display italic text-4xl md:text-5xl leading-none text-[#e6d9b8]/60">
                  §
                </span>
                <SectionEyebrow light>Кухня та пиво</SectionEyebrow>
              </div>
              <SectionTitle light>
                Європейсько – українська кухня
                <span className="block font-display italic text-[#e6d9b8]/80 mt-2">
                  та крафтове пиво.
                </span>
              </SectionTitle>
              <Paragraph light>
                Ресторан «Глухомань» зустріне Вас з відмінною європейсько –
                українською кухнею та привітним персоналом. Це найкраще місце
                для любителів крафтового пива. У нас можна посмакувати пивом
                власного виробництва.
              </Paragraph>
            </Reveal>

            <Reveal className="md:col-span-7" delay={0.15}>
              <HallSlider
                light
                aspect="aspect-[4/3]"
                photos={[
                  { n: 5, alt: "Крафтове пиво з власної пивоварні" },
                  { n: 4, alt: "Персонал ресторану" },
                ]}
              />
            </Reveal>
          </div>
        </div>
      </section>

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          4. LIVE MUSIC — DANIL REVEKA
          ═══════════════════════════════════════════════════════════ */}
      <section id="music" className="py-20 md:py-28 bg-[#faf6ec] relative overflow-hidden scroll-mt-20 rest-grain rest-grain--light">
        <span
          aria-hidden
          className="rest-ghost-roman"
          style={{ top: "50%", right: "-6vw", transform: "translateY(-50%)" }}
        >
          ♪
        </span>

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid md:grid-cols-12 gap-10 md:gap-12 items-center">
            <Reveal className="md:col-span-5">
              <div className="flex items-baseline gap-4 mb-5">
                <span className="font-display italic text-4xl md:text-5xl leading-none text-[#1a3d2e]/35">
                  ♪
                </span>
                <SectionEyebrow>Жива музика</SectionEyebrow>
              </div>
              <SectionTitle>
                Музичні вечори
                <span className="block font-display italic text-[#1a3d2e]/65 mt-2">
                  п&apos;ятниця · субота · неділя
                </span>
              </SectionTitle>
              <Paragraph>
                У п&apos;ятницю, суботу та неділю запрошуємо Вас на музичні
                вечори. Жива музика у виконанні нашого вокаліста, музиканта,
                фронтмена «Кавер шоу Дискотека 90-х», учасник гурту «Живі
                барабани» DANIL REVEKA заворожить Вас своїм вокалом.
              </Paragraph>
              <BookingCTA />
            </Reveal>

            <Reveal className="md:col-span-7" delay={0.15}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] ring-1 ring-[#1a3d2e]/15 shadow-[0_25px_60px_-18px_rgba(26,61,46,0.25)]">
                <Image
                  src="/images/restaurant/doc/6.jpg"
                  alt="DANIL REVEKA виконує пісні"
                  fill
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-2 rounded-[2px] ring-1 ring-inset ring-[#1a3d2e]/10 pointer-events-none"
                />
                {/* QR overlay — Instagram музиканта. На мобайлі компактніше. */}
                <div className="absolute bottom-3 right-3 md:bottom-6 md:right-6 flex items-end gap-2 md:gap-3">
                  <div className="hidden sm:block rounded-sm bg-[#0f1f18]/80 backdrop-blur-sm ring-1 ring-[#e6d9b8]/25 px-3 py-2 text-[#f4ecd8] text-right">
                    <p className="text-[9px] uppercase tracking-[0.28em] text-[#e6d9b8]/70">Instagram</p>
                    <p className="font-display italic text-sm">@danilreveka</p>
                  </div>
                  <a
                    href="https://instagram.com/danilreveka"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram музиканта DANIL REVEKA — @danilreveka"
                    className="block w-20 h-20 md:w-28 md:h-28 rounded-sm overflow-hidden bg-white p-1.5 md:p-2 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.5)] ring-1 ring-[#e6d9b8]/25 transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
                  >
                    <Image
                      src="/images/restaurant/doc/40.jpg"
                      alt="QR-код Instagram музиканта"
                      width={224}
                      height={224}
                      className="w-full h-full object-contain"
                    />
                  </a>
                </div>
                {/* Підпис під QR на мобайлі (ховається коли є плашка поруч) */}
                <div className="sm:hidden absolute bottom-[calc(0.75rem+5rem+0.5rem)] right-3 rounded-sm bg-[#0f1f18]/80 backdrop-blur-sm ring-1 ring-[#e6d9b8]/25 px-2.5 py-1.5 text-[#f4ecd8]">
                  <p className="text-[8px] uppercase tracking-[0.24em] text-[#e6d9b8]/70 leading-none">Instagram</p>
                  <p className="font-display italic text-xs leading-tight mt-0.5">@danilreveka</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          5. ЗАЛ — І ПОВЕРХ — 25 МІСЦЬ — УКРАЇНСЬКА ПІЧ
          ═══════════════════════════════════════════════════════════ */}
      <HallSection
        id="hall-i"
        light
        ghost="I"
        roman="I"
        eyebrow="Зал · І поверх · 25 місць"
        titleBold="Справжня українська піч"
        titleItalic="на дровах."
        body="Гордістю нашого закладу є справжня українська піч, викладена вручну з глини та обпаленої цегли. Вона розташована в центрі залу, і в холодну пору року ми розпалюємо в ній дрова. Живий вогонь, аромат духмяного дерева та м'яке тепло, що розходиться від печі, створюють неповторну домашню атмосферу спокою та тепла. Також в меню з листопада по березень присутні страви які готуються в печі."
        photos={[
          { n: 8, alt: "Українська піч, розписана вручну" },
          { n: 9, alt: "Зал з піччю взимку" },
          { n: 10, alt: "Зал ресторану у день Св. Валентина" },
        ]}
        reverse
      />

      <SectionFlourish light />

      {/* ═══════════════════════════════════════════════════════════
          6. ВІДОКРЕМЛЕНИЙ ЗАЛ — І ПОВЕРХ — 8 МІСЦЬ
          ═══════════════════════════════════════════════════════════ */}
      <HallSection
        id="hall-ii"
        ghost="II"
        roman="II"
        eyebrow="Відокремлений зал · І поверх · 8 посадочних місць"
        titleBold="Відокремлений зал"
        titleItalic="для двох або сім'ї."
        body="Затишна атмосфера, що ідеально підходить як для вечірніх побачень, так і для сімейних обідів."
        photos={[
          { n: 13, alt: "Відокремлений столик для двох" },
          { n: 11, alt: "Відокремлений зал з квітковими шторами" },
          { n: 12, alt: "Затишний зал у дерев'яному стилі" },
        ]}
      />

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          7. ЗАЛ «ЖАР-ПТИЦІ» — І ПОВЕРХ — 20 МІСЦЬ
          ═══════════════════════════════════════════════════════════ */}
      <HallSection
        id="hall-iii"
        light
        ghost="III"
        roman="III"
        eyebrow="Зал «Жар-Птиці» · І поверх · 20 місць"
        titleBold="Павлінарій за склом"
        titleItalic="у серці залу."
        body="Серцем залу є наш просторий, елегантно оформлений павлінарій за скляною перегородкою. Спостереження за цими граційними птахами під час трапези додає атмосфері відчуття екзотики та спокою."
        aspect="aspect-[4/5]"
        photos={[
          { n: 15, alt: "Павич у павлінарії залу «Жар-Птиці»" },
          { n: 14, alt: "Зал «Жар-Птиці» з дерев'яними лампами" },
          { n: 16, alt: "Столики у залі «Жар-Птиці»" },
          { n: 17, alt: "Сервірований стіл у залі «Жар-Птиці»" },
        ]}
        reverse
      />

      <SectionFlourish light />

      {/* ═══════════════════════════════════════════════════════════
          8. ЗАЛ — ІІ ПОВЕРХ — 25 МІСЦЬ — БАЛКОН + КАМІН
          ═══════════════════════════════════════════════════════════ */}
      <HallSection
        id="hall-iv"
        ghost="IV"
        roman="IV"
        eyebrow="Зал · ІІ поверх · 25 місць · камін + балкон"
        titleBold="Камін, балкон"
        titleItalic="і тиха розмова."
        body="Запрошуємо вас до нашого затишного залу, який ідеально поєднує сучасний комфорт із класичною атмосферою відпочинку. Центральним елементом інтер'єру є стильний електричний камін. Він миттєво додає простору відчуття тепла та затишку без зайвого диму чи запаху. Поєднання затишної камінної зони та можливості вийти на балкон робить його улюбленим місцем наших гостей у будь-яку пору року."
        photos={[
          { n: 20, alt: "Електричний камін у залі на ІІ поверсі" },
          { n: 21, alt: "Балкон із видом на сосновий ліс" },
          { n: 18, alt: "Загальний вигляд залу" },
          { n: 22, alt: "Двері на балкон" },
        ]}
      />

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          9. VIP — 12-ФУТОВИЙ БІЛЬЯРДНИЙ СТІЛ
          ═══════════════════════════════════════════════════════════ */}
      <HallSection
        id="hall-v"
        light
        ghost="V"
        roman="V"
        eyebrow="VIP · 12-футовий більярд"
        titleBold="VIP-зал з більярдом"
        titleItalic="і м'яким куточком."
        body="Більярд допомагає відпочити, мотивує на дружню або ділову бесіду, заспокоює та допомагає розвинути мислення та логіку. В нашій VIP – кімнаті Ви можете насолодитися грою в будь який час доби, а також посмакувати нефільтрованим пивом власного виробництва."
        photos={[
          { n: 23, alt: "VIP-зал з 12-футовим більярдним столом" },
          { n: 24, alt: "Більярдний стіл з кіями і кулями" },
          { n: 25, alt: "М'який куточок та більярдний зал" },
        ]}
        reverse
      />

      <SectionFlourish light />

      {/* ═══════════════════════════════════════════════════════════
          10. ЗАЛ «ТЕРАСА» — І ПОВЕРХ — 50 МІСЦЬ
          ═══════════════════════════════════════════════════════════ */}
      <HallSection
        id="hall-vi"
        ghost="VI"
        roman="VI"
        eyebrow="Зал «Тераса» · І поверх · 50 місць"
        titleBold="Зал «Тераса»"
        titleItalic="для ваших свят і корпоративів."
        body="Ідеальна локація для ювілеїв, корпоративних вечірок або великих сімейних святкувань. Ми пропонуємо вам насолодитися вишуканою кухнею та першокласним сервісом в атмосфері легкості та свята. Просторе планування дозволяє легко трансформувати простір під будь-який формат заходу: від класичного банкетного розсадження до вільного лаунж – фуршету."
        photos={[
          { n: 27, alt: "Загальний вигляд зали «Тераса»" },
          { n: 28, alt: "Сервірування довгого столу" },
          { n: 26, alt: "Тераса у денному світлі" },
          { n: 31, alt: "Логотип Глухомань на зеленій стіні" },
          { n: 30, alt: "Святкова композиція з кулями для дня народження" },
        ]}
      />

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          11. БАНКЕТНА ЗАЛА — ІІ ПОВЕРХ — 90 МІСЦЬ
          ═══════════════════════════════════════════════════════════ */}
      <HallSection
        id="hall-vii"
        light
        ghost="VII"
        roman="VII"
        eyebrow="Банкетна зала · ІІ поверх · 90 місць"
        titleBold="Банкетна зала"
        titleItalic="до 90 гостей."
        body="Запрошуємо вас до нашого просторого та розкішного банкетного залу, який ідеально підходить для проведення масштабних святкувань. Зал комфортно вміщує до 90 гостей у форматі банкету. Планування дозволяє розмістити столи різними способами (П-подібно, круглими столами або «ялинкою»), з місцем для танцполу, сцени та окремої зони для фотосесій чи фуршету."
        ctaLabel="Детальна інформація"
        photos={[
          { n: 35, alt: "Банкетна зала з зеленими колонами" },
          { n: 34, alt: "Банкетна зала з довгим столом" },
          { n: 32, alt: "Вхід до банкетної зали з логотипом" },
          { n: 36, alt: "Банкет з повноцінним сервіруванням" },
        ]}
        reverse
      />

      <SectionFlourish light />

      {/* ═══════════════════════════════════════════════════════════
          12. СВЯТА
          ═══════════════════════════════════════════════════════════ */}
      <HallSection
        id="hall-viii"
        ghost="VIII"
        roman="VIII"
        eyebrow="Свята · Події"
        titleBold={
          <>
            День народження,
            <br />
            весілля, корпоратив
          </>
        }
        titleItalic="у «Глухомані»."
        body="Відзначте Ваш день народження, весілля або корпоратив у ресторані «Глухомань» та зробіть його незабутнім! Прийдіть разом з друзями та родиною, щоб насолодитися смачними стравами, вишуканою атмосферою та найкращим обслуговуванням. Також можна замовити індивідуальну фотозону для Вашого свята. А наш арт – директор DANIL REVEKA організує для Вас музичний супровід (жива музика, ді-джей, ведуча)."
        ctaLabel="Детальна інформація"
        aspect="aspect-[4/5]"
        photos={[
          { n: 29, alt: "Фотозона «З днем народження»" },
          { n: 39, alt: "Фотозона у червоно-золотих тонах" },
          { n: 37, alt: "Святковий декор з кульками" },
          { n: 38, alt: "Арт-директор ресторану DANIL REVEKA" },
          { n: 30, alt: "Фруктовий стіл на терасі" },
        ]}
      />

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          13. ДИТЯЧА КІМНАТА
          ═══════════════════════════════════════════════════════════ */}
      <HallSection
        id="hall-ix"
        light
        ghost="IX"
        roman="IX"
        eyebrow="Дитяча кімната"
        titleBold="Безкоштовна"
        titleItalic="ігрова дитяча кімната."
        body="Для малечі в ресторані «Глухомань» теж є дещо особливе – безкоштовна ігрова дитяча кімната (на ІІ поверсі ресторану) з іграшками, лабіринтом та розмальовками. Дітки весело проведуть час з нашими аніматорами. А також є дитяче меню і десерти, які потішать улюбленими смаками."
        ctaLabel="Детальна інформація"
        aspect="aspect-[4/5]"
        photos={[
          { n: 42, alt: "Дитяча кімната з мʼякою підлогою" },
          { n: 41, alt: "Дитячий лабіринт" },
          { n: 43, alt: "Спортивна зона для дітей" },
        ]}
        reverse
      />

      <SectionFlourish light />

      {/* ═══════════════════════════════════════════════════════════
          14. АНІМАТОРИ
          ═══════════════════════════════════════════════════════════ */}
      <HallSection
        id="hall-x"
        ghost="X"
        roman="X"
        eyebrow="Аніматори"
        titleBold="Квести, анімації, шоу,"
        titleItalic="лазертаг."
        body="Наші аніматори проводять різноманітні квести, анімації, мильні шоу, кріо – шоу, лазертаг."
        ctaLabel="Детальна інформація"
        aspect="aspect-[4/5]"
        photos={[
          { n: 46, alt: "Аніматор у костюмі з дитиною" },
          { n: 45, alt: "Дитяча піратська вечірка" },
          { n: 44, alt: "Лазертаг на природі" },
          { n: 47, alt: "Квест у аквапарку" },
          { n: 48, alt: "Пригоди надворі" },
          { n: 49, alt: "Мотузковий парк для дітей" },
        ]}
      />

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          15. МЕНЮ — тизер, відкриває модал
          ═══════════════════════════════════════════════════════════ */}
      <section
        id="menu"
        className="py-28 md:py-40 bg-[#0f1f18] text-[#f4ecd8] scroll-mt-24 relative overflow-hidden rest-grain"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 50%, #e6a23c 0%, transparent 75%)",
          }}
        />
        <span
          aria-hidden
          className="rest-ghost-roman rest-ghost-roman--light"
          style={{ top: "50%", right: "-8vw", transform: "translateY(-50%)" }}
        >
          ∎
        </span>

        <div className="max-w-5xl mx-auto px-6 relative">
          <Reveal>
            <div className="text-center mb-14 md:mb-16">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[#e6d9b8] mb-6 flex items-center justify-center gap-3">
                <UtensilsCrossed className="w-4 h-4" strokeWidth={1.5} />
                Меню
              </p>
              <h2 className="font-display text-5xl md:text-6xl lg:text-[68px] leading-[0.95] tracking-tight font-light">
                Меню ресторану
                <span className="block font-display italic text-[#e6d9b8]/90 mt-3">
                  «Глухомань».
                </span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <MenuPreview />
          </Reveal>

          <p className="mt-10 text-center text-[10px] uppercase tracking-[0.32em] text-[#e6d9b8]/55">
            Клікніть на превʼю, щоб відкрити повне меню
          </p>
        </div>
      </section>

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          16. FINAL CTA
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 bg-[#faf6ec] relative overflow-hidden rest-grain rest-grain--light">
        <Reveal>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <SectionEyebrow>Забронювати столик</SectionEyebrow>
            <h2 className="mt-4 font-display text-4xl md:text-6xl leading-[1.05] text-[#1a3d2e] mb-10 tracking-tight">
              Забронювати столик за тел:
              <span className="block mt-3">
                <a
                  href={`tel:${PHONE_PRIMARY_TEL}`}
                  className="font-display italic hover:opacity-70 transition-opacity"
                >
                  {PHONE_PRIMARY}
                </a>{" "}
                <span className="text-[#1a3d2e]/40">або</span>{" "}
                <a
                  href={`tel:${PHONE_SECONDARY_TEL}`}
                  className="font-display italic hover:opacity-70 transition-opacity"
                >
                  {PHONE_SECONDARY}
                </a>
              </span>
            </h2>
            <BookingButton
              service="restaurant"
              className="inline-flex items-center gap-3 bg-[#1a3d2e] text-[#f4ecd8] px-10 py-4 font-medium tracking-wide hover:bg-[#0f1f18] transition-colors min-h-[44px]"
            >
              <Phone className="w-4 h-4" />
              Забронювати столик
            </BookingButton>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
