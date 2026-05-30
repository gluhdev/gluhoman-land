import { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import { Phone, Flame } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BookingButton } from "@/components/ui/BookingButton";
import { HallSlider, type HallSlide } from "@/components/restaurant/HallSlider";
import { Reveal } from "@/components/restaurant/Reveal";
import { SectionFlourish } from "@/components/restaurant/SectionFlourish";
import { HeroParallax } from "@/components/restaurant/HeroParallax";
import { FloatingNav } from "@/components/restaurant/FloatingNav";
import { PriceList } from "@/components/sauna/PriceList";
import { SITE_URL } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sauna" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.og_title"),
      description: t("meta.og_description"),
      type: "website",
      locale: locale === "uk" ? "uk_UA" : "en_US",
      images: [
        {
          url: "/og-sauna.jpg",
          width: 1200,
          height: 630,
          alt: t("meta.og_image_alt"),
        },
      ],
    },
  };
}

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
    `${SITE_URL}${S(1)}`,
    `${SITE_URL}${S(7)}`,
    `${SITE_URL}${S(17)}`,
  ],
  telephone: PHONE_SAUNA_TEL,
  address: {
    "@type": "PostalAddress",
    addressCountry: "UA",
    addressRegion: "Полтавська область",
    addressLocality: "с. Нижні Млини",
  },
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
  label,
  prefix,
  light = false,
}: {
  label: string;
  prefix: string;
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
  ctaLabel,
  ctaPrefix,
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
  ctaLabel: string;
  ctaPrefix: string;
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
            {!noCta && <BookingCTA light={light} label={ctaLabel} prefix={ctaPrefix} />}
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

export default async function SaunaPage() {
  const t = await getTranslations("sauna");

  const navEntries = [
    { id: "intro", roman: "0", label: t("nav.intro") },
    { id: "mala", roman: "I", label: t("nav.mala") },
    { id: "velyka", roman: "II", label: t("nav.velyka") },
    { id: "prices", roman: "§", label: t("nav.prices") },
    { id: "oak", roman: "III", label: t("nav.oak") },
    { id: "carpathian", roman: "IV", label: t("nav.carpathian") },
    { id: "citrus", roman: "V", label: t("nav.citrus") },
    { id: "tea", roman: "VI", label: t("nav.tea") },
    { id: "beer", roman: "VII", label: t("nav.beer") },
    { id: "stone", roman: "VIII", label: t("nav.stone") },
    { id: "classic", roman: "IX", label: t("nav.classic") },
    { id: "thai", roman: "X", label: t("nav.thai") },
    { id: "bamboo", roman: "XI", label: t("nav.bamboo") },
    { id: "scrub", roman: "XII", label: t("nav.scrub") },
  ];

  const ctaLabel = t("booking_cta.label");
  const ctaPrefix = t("booking_cta.prefix");

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
            alt={t("hero.img_alt")}
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
            {t("hero.eyebrow")}
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-6 font-light">
            {t("hero.title")}
          </h1>
          <p className="font-display text-3xl md:text-5xl text-[#f4ecd8] max-w-3xl mx-auto leading-[1.05] mb-2">
            {t("hero.subtitle")}
          </p>
          <p className="font-display italic text-2xl md:text-4xl text-[#e6d9b8]/90 max-w-3xl mx-auto leading-snug mb-10">
            {t("hero.subtitle2")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <BookingButton
              service="sauna"
              className="inline-flex items-center justify-center gap-2 bg-[#e6d9b8] text-[#0f1f18] px-8 sm:px-10 py-4 text-sm font-medium tracking-wide hover:bg-[#f4ecd8] transition-colors min-h-[44px] w-full sm:w-auto"
            >
              <Phone className="w-4 h-4" strokeWidth={2} />
              {t("hero.cta_book")}
            </BookingButton>
            <a
              href="#prices"
              className="inline-flex items-center justify-center gap-2 border border-[#e6d9b8]/70 text-[#f4ecd8] px-8 sm:px-10 py-4 text-sm font-medium tracking-wide hover:bg-[#e6d9b8]/10 transition-colors min-h-[44px] w-full sm:w-auto"
            >
              <Flame className="w-4 h-4" strokeWidth={2} />
              {t("hero.cta_prices")}
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
                <SectionEyebrow>{t("intro.eyebrow")}</SectionEyebrow>
              </div>
              <SectionTitle>
                {t("intro.title")}
                <span className="block font-display italic text-[#1a3d2e]/65 mt-2">
                  {t("intro.title_italic")}
                </span>
              </SectionTitle>
              <Paragraph>
                {t("intro.body")}
              </Paragraph>
              <BookingCTA label={ctaLabel} prefix={ctaPrefix} />
            </Reveal>

            <Reveal className="md:col-span-7" delay={0.15}>
              <HallSlider
                aspect="aspect-[4/3]"
                base="/images/sauna/doc/"
                photos={[
                  { n: 1, alt: t("intro.slider_1_alt") },
                  { n: 7, alt: t("intro.slider_2_alt") },
                  { n: 5, alt: t("intro.slider_3_alt") },
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
        eyebrow={t("mala.eyebrow")}
        titleBold={t("mala.title")}
        titleItalic={t("mala.title_italic")}
        body={t("mala.body")}
        aspect="aspect-[4/3]"
        ctaLabel={ctaLabel}
        ctaPrefix={ctaPrefix}
        photos={[
          { n: 1, alt: t("mala.photo_1_alt") },
          { n: 2, alt: t("mala.photo_2_alt") },
          { n: 3, alt: t("mala.photo_3_alt") },
          { n: 4, alt: t("mala.photo_4_alt") },
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
        eyebrow={t("velyka.eyebrow")}
        titleBold={t("velyka.title")}
        titleItalic={t("velyka.title_italic")}
        body={t("velyka.body")}
        light
        reverse
        aspect="aspect-[4/3]"
        ctaLabel={ctaLabel}
        ctaPrefix={ctaPrefix}
        photos={[
          { n: 5, alt: t("velyka.photo_1_alt") },
          { n: 6, alt: t("velyka.photo_2_alt") },
          { n: 7, alt: t("velyka.photo_3_alt") },
          { n: 8, alt: t("velyka.photo_4_alt") },
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
              <SectionEyebrow>{t("prices.eyebrow")}</SectionEyebrow>
            </div>
            <SectionTitle>
              {t("prices.title")}
              <span className="block font-display italic text-[#1a3d2e]/65 mt-2">
                {t("prices.title_italic")}
              </span>
            </SectionTitle>
            <Paragraph className="max-w-2xl mx-auto">
              {t("prices.body")}
            </Paragraph>
            <div className="flex justify-center">
              <BookingCTA label={t("prices.book_label")} prefix={ctaPrefix} />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="max-w-5xl mx-auto">
              <p className="text-center text-[10px] uppercase tracking-[0.32em] text-[#1a3d2e]/50 mb-6">
                {t("prices.pricelist_label")}
              </p>
              <PriceList />
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <p className="max-w-3xl mx-auto text-center text-[16px] leading-[1.7] text-[#0f1f18]/75 mt-12">
              {t("prices.staff_note")}
            </p>
          </Reveal>
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
        eyebrow={t("oak.eyebrow")}
        titleBold={t("oak.title")}
        titleItalic={t("oak.title_italic")}
        body={
          <>
            {t("oak.body_p1")}
            <span className="block mt-4">
              {t("oak.body_p2")}
            </span>
          </>
        }
        extra={
          <div className="rounded-sm bg-[#0f1f18]/50 ring-1 ring-[#e6d9b8]/20 px-5 py-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#e6d9b8]/70 mb-2">
              {t("oak.aroma_label")}
            </p>
            <p className="font-display italic text-[#f4ecd8]/90 text-lg">
              {t("oak.aroma_items")}
            </p>
          </div>
        }
        light
        ctaLabel={ctaLabel}
        ctaPrefix={ctaPrefix}
        photos={[
          { n: 14, alt: t("oak.photo_1_alt"), objectPosition: "center 30%" },
          { n: 15, alt: t("oak.photo_2_alt") },
          { n: 16, alt: t("oak.photo_3_alt") },
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
        eyebrow={t("carpathian.eyebrow")}
        titleBold={t("carpathian.title")}
        titleItalic={t("carpathian.title_italic")}
        body={t("carpathian.body")}
        extra={
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-sm bg-white/60 ring-1 ring-[#1a3d2e]/10 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/55 mb-1">
                {t("carpathian.with_sauna_label")}
              </p>
              <p className="font-display text-2xl text-[#1a3d2e]">{t("carpathian.with_sauna_price")}</p>
              <p className="text-[11px] text-[#0f1f18]/55 mt-0.5 italic">
                {t("carpathian.min_order")}
              </p>
            </div>
            <div className="rounded-sm bg-white/60 ring-1 ring-[#1a3d2e]/10 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/55 mb-1">
                {t("carpathian.without_sauna_label")}
              </p>
              <p className="font-display text-2xl text-[#1a3d2e]">{t("carpathian.without_sauna_price")}</p>
              <p className="text-[11px] text-[#0f1f18]/55 mt-0.5 italic">
                {t("carpathian.min_order")}
              </p>
            </div>
            <p className="sm:col-span-2 text-[12px] text-[#0f1f18]/55 italic leading-relaxed">
              {t("carpathian.hygiene_note")}
            </p>
          </div>
        }
        aspect="aspect-[4/3]"
        ctaLabel={ctaLabel}
        ctaPrefix={ctaPrefix}
        photos={[
          { n: 17, alt: t("carpathian.photo_1_alt") },
          { n: 18, alt: t("carpathian.photo_2_alt") },
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
        eyebrow={t("citrus.eyebrow")}
        titleBold={t("citrus.title")}
        titleItalic={t("citrus.title_italic")}
        body={t("citrus.body")}
        extra={
          <div className="grid sm:grid-cols-2 gap-3">
            <div className="rounded-sm bg-[#0f1f18]/50 ring-1 ring-[#e6d9b8]/20 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#e6d9b8]/65 mb-1">
                {t("citrus.with_sauna_label")}
              </p>
              <p className="font-display text-2xl text-[#e6d9b8]">{t("citrus.with_sauna_price")}</p>
              <p className="text-[11px] text-[#f4ecd8]/55 mt-0.5 italic">
                {t("citrus.min_order")}
              </p>
            </div>
            <div className="rounded-sm bg-[#0f1f18]/50 ring-1 ring-[#e6d9b8]/20 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#e6d9b8]/65 mb-1">
                {t("citrus.without_sauna_label")}
              </p>
              <p className="font-display text-2xl text-[#e6d9b8]">{t("citrus.without_sauna_price")}</p>
              <p className="text-[11px] text-[#f4ecd8]/55 mt-0.5 italic">
                {t("citrus.min_order")}
              </p>
            </div>
            <p className="sm:col-span-2 text-[12px] text-[#f4ecd8]/55 italic leading-relaxed">
              {t("citrus.hygiene_note")}
            </p>
          </div>
        }
        light
        reverse
        aspect="aspect-[4/3]"
        ctaLabel={ctaLabel}
        ctaPrefix={ctaPrefix}
        photos={[
          { n: 19, alt: t("citrus.photo_1_alt") },
          { n: 20, alt: t("citrus.photo_2_alt") },
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
        eyebrow={t("tea.eyebrow")}
        titleBold={t("tea.title")}
        titleItalic={t("tea.title_italic")}
        body={t("tea.body")}
        extra={
          <div>
            <p className="text-[14px] text-[#0f1f18]/80 mb-3">
              {t("tea.honey_intro")}
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-[15px] text-[#0f1f18]/85">
              <li className="flex gap-2">
                <span className="text-[#1a3d2e] font-display italic">·</span>
                {t("tea.honey_1")}
              </li>
              <li className="flex gap-2">
                <span className="text-[#1a3d2e] font-display italic">·</span>
                {t("tea.honey_2")}
              </li>
              <li className="flex gap-2">
                <span className="text-[#1a3d2e] font-display italic">·</span>
                {t("tea.honey_3")}
              </li>
              <li className="flex gap-2">
                <span className="text-[#1a3d2e] font-display italic">·</span>
                {t("tea.honey_4")}
              </li>
            </ul>
          </div>
        }
        noCta
        aspect="aspect-[4/3]"
        ctaLabel={ctaLabel}
        ctaPrefix={ctaPrefix}
        photos={[
          { n: 21, alt: t("tea.photo_1_alt") },
          { n: 22, alt: t("tea.photo_2_alt") },
          { n: 23, alt: t("tea.photo_3_alt") },
          { n: 24, alt: t("tea.photo_4_alt") },
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
                <SectionEyebrow light>{t("beer.eyebrow")}</SectionEyebrow>
              </div>
              <SectionTitle light>
                {t("beer.title")}
                <span className="block font-display italic text-[#e6d9b8]/80 mt-2">
                  {t("beer.title_italic")}
                </span>
              </SectionTitle>
              <Paragraph light>
                {t("beer.body")}
              </Paragraph>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px]">
                <span className="text-[#f4ecd8]/60 tracking-wide">
                  {t("beer.order_label")}
                </span>
                <a
                  href={`tel:${PHONE_RESTAURANT_TEL}`}
                  className="font-display italic text-[#e6d9b8] hover:text-[#f4ecd8] underline underline-offset-[5px] decoration-1 decoration-current/40 hover:decoration-current transition-colors"
                >
                  {PHONE_RESTAURANT}
                </a>
              </div>

              <BookingCTA light label={ctaLabel} prefix={ctaPrefix} />
            </Reveal>

            <Reveal className="md:col-span-7" delay={0.15}>
              <HallSlider
                light
                aspect="aspect-[4/3]"
                base="/images/sauna/doc/"
                photos={[
                  { n: 25, alt: t("beer.photo_1_alt") },
                  { n: 26, alt: t("beer.photo_2_alt") },
                  { n: 27, alt: t("beer.photo_3_alt") },
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
        eyebrow={t("stone.eyebrow")}
        titleBold={t("stone.title")}
        titleItalic={t("stone.title_italic")}
        body={t("stone.body")}
        extra={
          <div className="space-y-2">
            <PriceRow
              label={t("stone.price_label")}
              italic={t("stone.price_duration")}
              value={t("stone.price_value")}
            />
            <p className="text-[11px] text-[#0f1f18]/55 mt-3 italic">
              {t("stone.certified_note")}
            </p>
          </div>
        }
        aspect="aspect-[4/3]"
        ctaLabel={ctaLabel}
        ctaPrefix={ctaPrefix}
        photos={[
          { n: 28, alt: t("stone.photo_1_alt") },
          { n: 29, alt: t("stone.photo_2_alt") },
          { n: 30, alt: t("stone.photo_3_alt") },
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
        eyebrow={t("classic.eyebrow")}
        titleBold={t("classic.title")}
        body={t("classic.body")}
        extra={
          <div className="space-y-2">
            <PriceRow light label={t("classic.price_label")} italic={t("classic.price_20_duration")} value={t("classic.price_20_value")} />
            <PriceRow light label={t("classic.price_label")} italic={t("classic.price_30_duration")} value={t("classic.price_30_value")} />
            <PriceRow light label={t("classic.price_label")} italic={t("classic.price_50_duration")} value={t("classic.price_50_value")} />
            <p className="text-[11px] text-[#f4ecd8]/60 mt-3 italic">
              {t("classic.certified_note")}
            </p>
          </div>
        }
        light
        reverse
        aspect="aspect-[4/3]"
        ctaLabel={ctaLabel}
        ctaPrefix={ctaPrefix}
        photos={[
          { n: 31, alt: t("classic.photo_1_alt") },
          { n: 32, alt: t("classic.photo_2_alt") },
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
        eyebrow={t("thai.eyebrow")}
        titleBold={t("thai.title")}
        titleItalic={t("thai.title_italic")}
        body={
          <>
            {t("thai.body_p1")}
            <span className="block mt-4">
              {t("thai.body_p2")}
            </span>
          </>
        }
        extra={
          <div className="space-y-2">
            <PriceRow label={t("thai.price_1_label")} italic={t("thai.price_1_duration")} value={t("thai.price_1_value")} />
            <PriceRow label={t("thai.price_2_label")} italic={t("thai.price_2_duration")} value={t("thai.price_2_value")} />
            <PriceRow label={t("thai.price_3_label")} italic={t("thai.price_3_duration")} value={t("thai.price_3_value")} />
            <PriceRow label={t("thai.price_4_label")} italic={t("thai.price_4_duration")} value={t("thai.price_4_value")} />
            <p className="text-[11px] text-[#0f1f18]/55 mt-3 italic">
              {t("thai.certified_note")}
            </p>
          </div>
        }
        aspect="aspect-[4/3]"
        ctaLabel={ctaLabel}
        ctaPrefix={ctaPrefix}
        photos={[
          { n: 33, alt: t("thai.photo_1_alt") },
          { n: 34, alt: t("thai.photo_2_alt") },
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
        eyebrow={t("bamboo.eyebrow")}
        titleBold={t("bamboo.title")}
        titleItalic={t("bamboo.title_italic")}
        body={t("bamboo.body")}
        extra={
          <div className="space-y-2">
            <PriceRow light label={t("bamboo.price_label")} italic={t("bamboo.price_duration")} value={t("bamboo.price_value")} />
            <p className="text-[11px] text-[#f4ecd8]/60 mt-3 italic">
              {t("bamboo.certified_note")}
            </p>
          </div>
        }
        light
        reverse
        aspect="aspect-[4/3]"
        ctaLabel={ctaLabel}
        ctaPrefix={ctaPrefix}
        photos={[
          { n: 35, alt: t("bamboo.photo_1_alt") },
          { n: 36, alt: t("bamboo.photo_2_alt") },
          { n: 37, alt: t("bamboo.photo_3_alt") },
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
        eyebrow={t("scrub.eyebrow")}
        titleBold={t("scrub.title")}
        titleItalic={t("scrub.title_italic")}
        body={t("scrub.body")}
        extra={
          <div className="space-y-1.5">
            <PriceRow label={t("scrub.price_1_label")} value={t("scrub.price_1_value")} />
            <PriceRow label={t("scrub.price_2_label")} value={t("scrub.price_2_value")} />
            <PriceRow label={t("scrub.price_3_label")} value={t("scrub.price_3_value")} />
            <PriceRow label={t("scrub.price_4_label")} value={t("scrub.price_4_value")} />
            <PriceRow label={t("scrub.price_5_label")} value={t("scrub.price_5_value")} />
            <PriceRow label={t("scrub.price_6_label")} value={t("scrub.price_6_value")} />
            <PriceRow label={t("scrub.price_7_label")} value={t("scrub.price_7_value")} />
            <PriceRow
              label={t("scrub.price_8_label")}
              italic={t("scrub.price_8_note")}
              value={t("scrub.price_8_value")}
            />
            <p className="text-[11px] text-[#0f1f18]/55 mt-3 italic">
              {t("scrub.certified_note")}
            </p>
          </div>
        }
        aspect="aspect-[4/3]"
        ctaLabel={ctaLabel}
        ctaPrefix={ctaPrefix}
        photos={[
          { n: 38, alt: t("scrub.photo_1_alt") },
          { n: 39, alt: t("scrub.photo_2_alt") },
        ]}
      />

    </div>
  );
}
