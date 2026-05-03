import { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import { Phone, UtensilsCrossed, ArrowUpRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BookingButton } from "@/components/ui/BookingButton";
import { HallSlider, type HallSlide } from "@/components/restaurant/HallSlider";
import { Reveal } from "@/components/restaurant/Reveal";
import { SectionFlourish } from "@/components/restaurant/SectionFlourish";
import { HeroParallax } from "@/components/restaurant/HeroParallax";
import { FloatingNav } from "@/components/restaurant/FloatingNav";
import { MenuDialog } from "@/components/restaurant/MenuDialog";
import { MenuTrigger } from "@/components/restaurant/MenuTrigger";
import { MenuPreview } from "@/components/restaurant/MenuPreview";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("restaurant.meta");
  return {
    title: t("title"),
    description: t("description"),
  };
}

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
  label,
  prefix,
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
  ctaLabel,
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

export default async function RestaurantPage() {
  const t = await getTranslations("restaurant");

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
            alt={t("intro.img_alt_1")}
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
            {t("hero.eyebrow")}
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] mb-6 font-light">
            {t("hero.name")}
          </h1>
          <p className="font-display text-3xl md:text-5xl text-[#f4ecd8] max-w-3xl mx-auto leading-[1.05] mb-2">
            {t("hero.tagline")}
          </p>
          <p className="font-display italic text-2xl md:text-4xl text-[#e6d9b8]/90 max-w-3xl mx-auto leading-snug mb-10">
            {t("hero.tagline_italic")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <BookingButton
              service="restaurant"
              className="inline-flex items-center justify-center gap-2 bg-[#e6d9b8] text-[#0f1f18] px-8 sm:px-10 py-4 text-sm font-medium tracking-wide hover:bg-[#f4ecd8] transition-colors min-h-[44px] w-full sm:w-auto"
            >
              <Phone className="w-4 h-4" strokeWidth={2} />
              {t("hero.cta_book")}
            </BookingButton>
            <MenuTrigger className="inline-flex items-center justify-center gap-2 border border-[#e6d9b8]/70 text-[#f4ecd8] px-8 sm:px-10 py-4 text-sm font-medium tracking-wide hover:bg-[#e6d9b8]/10 transition-colors min-h-[44px] w-full sm:w-auto cursor-pointer">
              <UtensilsCrossed className="w-4 h-4" strokeWidth={2} />
              {t("hero.cta_menu")}
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
              <BookingCTA label={t("booking_cta.book_table")} prefix={t("booking_cta.or_by_phone")} />
            </Reveal>

            <Reveal className="md:col-span-7" delay={0.15}>
              <HallSlider
                aspect="aspect-[4/3]"
                photos={[
                  { n: 2, alt: t("intro.img_alt_1") },
                  { n: 3, alt: t("intro.img_alt_2") },
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
                <SectionEyebrow light>{t("cuisine.eyebrow")}</SectionEyebrow>
              </div>
              <SectionTitle light>
                {t("cuisine.title")}
                <span className="block font-display italic text-[#e6d9b8]/80 mt-2">
                  {t("cuisine.title_italic")}
                </span>
              </SectionTitle>
              <Paragraph light>
                {t("cuisine.body")}
              </Paragraph>
            </Reveal>

            <Reveal className="md:col-span-7" delay={0.15}>
              <HallSlider
                light
                aspect="aspect-[4/3]"
                photos={[
                  { n: 5, alt: t("cuisine.img_alt_1") },
                  { n: 4, alt: t("cuisine.img_alt_2") },
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
                <SectionEyebrow>{t("music.eyebrow")}</SectionEyebrow>
              </div>
              <SectionTitle>
                {t("music.title")}
                <span className="block font-display italic text-[#1a3d2e]/65 mt-2">
                  {t("music.title_italic")}
                </span>
              </SectionTitle>
              <Paragraph>
                {t("music.body")}
              </Paragraph>
              <BookingCTA label={t("booking_cta.book_table")} prefix={t("booking_cta.or_by_phone")} />
            </Reveal>

            <Reveal className="md:col-span-7" delay={0.15}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] ring-1 ring-[#1a3d2e]/15 shadow-[0_25px_60px_-18px_rgba(26,61,46,0.25)]">
                <Image
                  src="/images/restaurant/doc/6.jpg"
                  alt={t("music.img_alt")}
                  fill
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-2 rounded-[2px] ring-1 ring-inset ring-[#1a3d2e]/10 pointer-events-none"
                />
                {/* QR overlay */}
                <div className="absolute bottom-3 right-3 md:bottom-6 md:right-6 flex items-end gap-2 md:gap-3">
                  <div className="hidden sm:block rounded-sm bg-[#0f1f18]/80 backdrop-blur-sm ring-1 ring-[#e6d9b8]/25 px-3 py-2 text-[#f4ecd8] text-right">
                    <p className="text-[9px] uppercase tracking-[0.28em] text-[#e6d9b8]/70">Instagram</p>
                    <p className="font-display italic text-sm">@danilreveka</p>
                  </div>
                  <a
                    href="https://instagram.com/danilreveka"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t("music.ig_aria_label")}
                    className="block w-20 h-20 md:w-28 md:h-28 rounded-sm overflow-hidden bg-white p-1.5 md:p-2 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.5)] ring-1 ring-[#e6d9b8]/25 transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
                  >
                    <Image
                      src="/images/restaurant/doc/40.jpg"
                      alt={t("music.qr_img_alt")}
                      width={224}
                      height={224}
                      className="w-full h-full object-contain"
                    />
                  </a>
                </div>
                {/* Mobile caption */}
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
          5. ЗАЛ I — УКРАЇНСЬКА ПІЧ
          ═══════════════════════════════════════════════════════════ */}
      <HallSection
        id="hall-i"
        light
        ghost="I"
        roman="I"
        eyebrow={t("halls.hall_i.eyebrow")}
        titleBold={t("halls.hall_i.title")}
        titleItalic={t("halls.hall_i.title_italic")}
        body={t("halls.hall_i.body")}
        photos={[
          { n: 8, alt: t("halls.hall_i.img_alt_1") },
          { n: 9, alt: t("halls.hall_i.img_alt_2") },
          { n: 10, alt: t("halls.hall_i.img_alt_3") },
        ]}
        ctaLabel={t("booking_cta.book_table")}
        reverse
      />

      <SectionFlourish light />

      {/* ═══════════════════════════════════════════════════════════
          6. ЗАЛ II — ВІДОКРЕМЛЕНИЙ
          ═══════════════════════════════════════════════════════════ */}
      <HallSection
        id="hall-ii"
        ghost="II"
        roman="II"
        eyebrow={t("halls.hall_ii.eyebrow")}
        titleBold={t("halls.hall_ii.title")}
        titleItalic={t("halls.hall_ii.title_italic")}
        body={t("halls.hall_ii.body")}
        photos={[
          { n: 13, alt: t("halls.hall_ii.img_alt_1") },
          { n: 11, alt: t("halls.hall_ii.img_alt_2") },
          { n: 12, alt: t("halls.hall_ii.img_alt_3") },
        ]}
        ctaLabel={t("booking_cta.book_table")}
      />

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          7. ЗАЛ III — ЖАР-ПТИЦІ
          ═══════════════════════════════════════════════════════════ */}
      <HallSection
        id="hall-iii"
        light
        ghost="III"
        roman="III"
        eyebrow={t("halls.hall_iii.eyebrow")}
        titleBold={t("halls.hall_iii.title")}
        titleItalic={t("halls.hall_iii.title_italic")}
        body={t("halls.hall_iii.body")}
        aspect="aspect-[4/5]"
        photos={[
          { n: 15, alt: t("halls.hall_iii.img_alt_1") },
          { n: 14, alt: t("halls.hall_iii.img_alt_2") },
          { n: 16, alt: t("halls.hall_iii.img_alt_3") },
          { n: 17, alt: t("halls.hall_iii.img_alt_4") },
        ]}
        ctaLabel={t("booking_cta.book_table")}
        reverse
      />

      <SectionFlourish light />

      {/* ═══════════════════════════════════════════════════════════
          8. ЗАЛ IV — КАМІН + БАЛКОН
          ═══════════════════════════════════════════════════════════ */}
      <HallSection
        id="hall-iv"
        ghost="IV"
        roman="IV"
        eyebrow={t("halls.hall_iv.eyebrow")}
        titleBold={t("halls.hall_iv.title")}
        titleItalic={t("halls.hall_iv.title_italic")}
        body={t("halls.hall_iv.body")}
        photos={[
          { n: 20, alt: t("halls.hall_iv.img_alt_1") },
          { n: 21, alt: t("halls.hall_iv.img_alt_2") },
          { n: 18, alt: t("halls.hall_iv.img_alt_3") },
          { n: 22, alt: t("halls.hall_iv.img_alt_4") },
        ]}
        ctaLabel={t("booking_cta.book_table")}
      />

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          9. ЗАЛ V — VIP БІЛЬЯРД
          ═══════════════════════════════════════════════════════════ */}
      <HallSection
        id="hall-v"
        light
        ghost="V"
        roman="V"
        eyebrow={t("halls.hall_v.eyebrow")}
        titleBold={t("halls.hall_v.title")}
        titleItalic={t("halls.hall_v.title_italic")}
        body={t("halls.hall_v.body")}
        photos={[
          { n: 23, alt: t("halls.hall_v.img_alt_1") },
          { n: 24, alt: t("halls.hall_v.img_alt_2") },
          { n: 25, alt: t("halls.hall_v.img_alt_3") },
        ]}
        ctaLabel={t("booking_cta.book_table")}
        reverse
      />

      <SectionFlourish light />

      {/* ═══════════════════════════════════════════════════════════
          10. ЗАЛ VI — ТЕРАСА
          ═══════════════════════════════════════════════════════════ */}
      <HallSection
        id="hall-vi"
        ghost="VI"
        roman="VI"
        eyebrow={t("halls.hall_vi.eyebrow")}
        titleBold={t("halls.hall_vi.title")}
        titleItalic={t("halls.hall_vi.title_italic")}
        body={t("halls.hall_vi.body")}
        photos={[
          { n: 27, alt: t("halls.hall_vi.img_alt_1") },
          { n: 28, alt: t("halls.hall_vi.img_alt_2") },
          { n: 26, alt: t("halls.hall_vi.img_alt_3") },
          { n: 31, alt: t("halls.hall_vi.img_alt_4") },
          { n: 30, alt: t("halls.hall_vi.img_alt_5") },
        ]}
        ctaLabel={t("booking_cta.book_table")}
      />

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          11. ЗАЛ VII — БАНКЕТНА ЗАЛА
          ═══════════════════════════════════════════════════════════ */}
      <HallSection
        id="hall-vii"
        light
        ghost="VII"
        roman="VII"
        eyebrow={t("halls.hall_vii.eyebrow")}
        titleBold={t("halls.hall_vii.title")}
        titleItalic={t("halls.hall_vii.title_italic")}
        body={t("halls.hall_vii.body")}
        ctaLabel={t("booking_cta.book_table_details")}
        photos={[
          { n: 35, alt: t("halls.hall_vii.img_alt_1") },
          { n: 34, alt: t("halls.hall_vii.img_alt_2") },
          { n: 32, alt: t("halls.hall_vii.img_alt_3") },
          { n: 36, alt: t("halls.hall_vii.img_alt_4") },
        ]}
        reverse
      />

      <SectionFlourish light />

      {/* ═══════════════════════════════════════════════════════════
          12. ЗАЛ VIII — СВЯТА
          ═══════════════════════════════════════════════════════════ */}
      <HallSection
        id="hall-viii"
        ghost="VIII"
        roman="VIII"
        eyebrow={t("halls.hall_viii.eyebrow")}
        titleBold={
          <>
            {t("halls.hall_viii.title_line1")}
            <br />
            {t("halls.hall_viii.title_line2")}
          </>
        }
        titleItalic={t("halls.hall_viii.title_italic")}
        body={t("halls.hall_viii.body")}
        ctaLabel={t("booking_cta.book_table_details")}
        aspect="aspect-[4/5]"
        photos={[
          { n: 29, alt: t("halls.hall_viii.img_alt_1") },
          { n: 39, alt: t("halls.hall_viii.img_alt_2") },
          { n: 37, alt: t("halls.hall_viii.img_alt_3") },
          { n: 38, alt: t("halls.hall_viii.img_alt_4") },
          { n: 30, alt: t("halls.hall_viii.img_alt_5") },
        ]}
      />

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          13. ЗАЛ IX — ДИТЯЧА КІМНАТА
          ═══════════════════════════════════════════════════════════ */}
      <HallSection
        id="hall-ix"
        light
        ghost="IX"
        roman="IX"
        eyebrow={t("halls.hall_ix.eyebrow")}
        titleBold={t("halls.hall_ix.title")}
        titleItalic={t("halls.hall_ix.title_italic")}
        body={t("halls.hall_ix.body")}
        ctaLabel={t("booking_cta.book_table_details")}
        aspect="aspect-[4/5]"
        photos={[
          { n: 42, alt: t("halls.hall_ix.img_alt_1") },
          { n: 41, alt: t("halls.hall_ix.img_alt_2") },
          { n: 43, alt: t("halls.hall_ix.img_alt_3") },
        ]}
        reverse
      />

      <SectionFlourish light />

      {/* ═══════════════════════════════════════════════════════════
          14. ЗАЛ X — АНІМАТОРИ
          ═══════════════════════════════════════════════════════════ */}
      <HallSection
        id="hall-x"
        ghost="X"
        roman="X"
        eyebrow={t("halls.hall_x.eyebrow")}
        titleBold={t("halls.hall_x.title")}
        titleItalic={t("halls.hall_x.title_italic")}
        body={t("halls.hall_x.body")}
        ctaLabel={t("booking_cta.book_table_details")}
        aspect="aspect-[4/5]"
        photos={[
          { n: 46, alt: t("halls.hall_x.img_alt_1") },
          { n: 45, alt: t("halls.hall_x.img_alt_2") },
          { n: 44, alt: t("halls.hall_x.img_alt_3") },
          { n: 47, alt: t("halls.hall_x.img_alt_4") },
          { n: 48, alt: t("halls.hall_x.img_alt_5") },
          { n: 49, alt: t("halls.hall_x.img_alt_6") },
        ]}
      />

      <SectionFlourish />

      {/* ═══════════════════════════════════════════════════════════
          15. МЕНЮ
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
                {t("menu_section.eyebrow")}
              </p>
              <h2 className="font-display text-5xl md:text-6xl lg:text-[68px] leading-[0.95] tracking-tight font-light">
                {t("menu_section.title")}
                <span className="block font-display italic text-[#e6d9b8]/90 mt-3">
                  {t("menu_section.title_italic")}
                </span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <MenuPreview />
          </Reveal>

          <p className="mt-10 text-center text-[10px] uppercase tracking-[0.32em] text-[#e6d9b8]/55">
            {t("menu_section.click_hint")}
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
            <SectionEyebrow>{t("final_cta.eyebrow")}</SectionEyebrow>
            <h2 className="mt-4 font-display text-4xl md:text-6xl leading-[1.05] text-[#1a3d2e] mb-10 tracking-tight">
              {t("final_cta.heading")}
              <span className="block mt-3">
                <a
                  href={`tel:${PHONE_PRIMARY_TEL}`}
                  className="font-display italic hover:opacity-70 transition-opacity"
                >
                  {PHONE_PRIMARY}
                </a>{" "}
                <span className="text-[#1a3d2e]/40">{t("final_cta.or")}</span>{" "}
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
              {t("final_cta.cta_button")}
            </BookingButton>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
