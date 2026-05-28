import { Metadata } from "next";
import Image from "next/image";
import { Clock, Coffee, Users, Check, Phone, Wifi, Car, Bed } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { HallSlider, type HallSlide } from "@/components/restaurant/HallSlider";
import { Reveal } from "@/components/restaurant/Reveal";
import { SectionFlourish } from "@/components/restaurant/SectionFlourish";
import { HeroParallax } from "@/components/restaurant/HeroParallax";
import { HotelBookingTrigger } from "@/components/hotel/HotelBookingTrigger";
import { getText } from "@/lib/site-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hotel_central" });
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
          url: "/images/hotels/central/1.jpg",
          width: 1920,
          height: 1280,
          alt: t("meta.og_image_alt"),
        },
      ],
    },
  };
}

const PHONE_PRIMARY = "050 406 35 55";
const PHONE_PRIMARY_TEL = "+380504063555";
const PHONE_SECONDARY = "0532 648 548";
const PHONE_SECONDARY_TEL = "+380532648548";

type RoomSlug =
  | "lux-balcony"
  | "standard-balcony-1f"
  | "standard-balcony-2f"
  | "standard-no-balcony-twin"
  | "standard-no-balcony-double";

const ROOMS: RoomSlug[] = [
  "lux-balcony",
  "standard-balcony-1f",
  "standard-balcony-2f",
  "standard-no-balcony-twin",
  "standard-no-balcony-double",
];

const ROMAN = ["I", "II", "III", "IV", "V"] as const;

const GALLERY_PHOTOS: HallSlide[] = Array.from({ length: 64 }, (_, i) => ({
  n: i + 1,
  alt: "",
}));

const centralJsonLd = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: "Центральний Готель «Глухомань»",
  description:
    "Тризірковий готель «Глухомань» на 23 номери у мальовничому місці біля с. Нижні Млини, Полтавська область.",
  starRating: { "@type": "Rating", ratingValue: "3" },
  telephone: PHONE_PRIMARY_TEL,
  faxNumber: PHONE_SECONDARY_TEL,
  address: {
    "@type": "PostalAddress",
    addressCountry: "UA",
    addressRegion: "Полтавська область",
    addressLocality: "с. Нижні Млини",
  },
  checkinTime: "14:30",
  checkoutTime: "12:00",
};

function Eyebrow({
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

function H2({
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

function P({
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

async function RoomCard({
  slug,
  index,
  locale,
}: {
  slug: RoomSlug;
  index: number;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "hotel_central" });
  const k = (suffix: string) =>
    `rooms.${slug}.${suffix}` as Parameters<typeof t>[0];
  const price = await getText(
    `hotel.central.${slug}.price`,
    t("labels.price_hint")
  );

  const bullets = (
    ["bullet_1", "bullet_2", "bullet_3", "bullet_4", "bullet_5", "bullet_6", "bullet_7"] as const
  )
    .map((b) => t(k(b)))
    .filter((s) => s && s.length > 0);

  return (
    <Reveal>
      <article className="h-full p-7 md:p-8 bg-white ring-1 ring-[#1a3d2e]/10 shadow-[0_20px_60px_-30px_rgba(26,61,46,0.2)] flex flex-col">
        <div className="flex items-baseline gap-3 mb-4">
          <span className="font-display italic text-3xl text-[#1a3d2e]/35 leading-none">
            {ROMAN[index] ?? ""}
          </span>
          <Eyebrow>{t(k("kicker"))}</Eyebrow>
        </div>
        <h3 className="font-display text-2xl md:text-[26px] leading-[1.15] text-[#1a3d2e]">
          {t(k("name"))}
        </h3>
        <p className="mt-1 font-display italic text-[16px] text-[#1a3d2e]/65 leading-snug">
          {t(k("tagline"))}
        </p>
        <p className="mt-4 text-[15px] text-[#0f1f18]/80 leading-[1.7]">
          {t(k("subtitle"))}
        </p>

        {bullets.length > 0 && (
          <ul className="mt-5 space-y-2.5">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <Check
                  className="w-4 h-4 mt-1 text-[#1a3d2e] flex-shrink-0"
                  strokeWidth={1.7}
                />
                <span className="text-[14px] leading-[1.5] text-[#0f1f18]/80">
                  {b}
                </span>
              </li>
            ))}
          </ul>
        )}

        {t(k("capacity")) && (
          <p className="mt-5 flex items-start gap-2.5 text-[13px] text-[#1a3d2e]/70 leading-snug">
            <Users className="w-4 h-4 mt-0.5 flex-shrink-0" strokeWidth={1.7} />
            <span>{t(k("capacity"))}</span>
          </p>
        )}

        <div className="mt-auto pt-6 border-t border-[#1a3d2e]/10 flex flex-wrap items-center gap-x-4 gap-y-2">
          <HotelBookingTrigger
            hotelSlug="central"
            roomCategorySlug={slug}
            roomName={t(k("name"))}
            priceLabel={price}
            label={t("labels.book_cta", { name: t(k("name")) })}
          />
          <span className="font-display italic text-[14px] text-[#1a3d2e]/60">
            {price}
          </span>
        </div>
      </article>
    </Reveal>
  );
}

export default async function HotelCentralPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hotel_central" });

  const paidItems = ["item_1", "item_2", "item_3", "item_4", "item_5"] as const;
  const freeItems = [
    "item_1",
    "item_2",
    "item_3",
    "item_4",
    "item_5",
    "item_6",
    "item_7",
    "item_8",
    "item_9",
  ] as const;

  const gallerySlides = GALLERY_PHOTOS.map((s) => ({
    ...s,
    alt: t("gallery.alt"),
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(centralJsonLd) }}
      />

      {/* HERO */}
      <section className="relative min-h-[92svh] flex items-center justify-center overflow-clip bg-[#0b1410] text-[#f4ecd8] rest-grain">
        <HeroParallax>
          <Image
            src="/images/hotels/central/1.jpg"
            alt={t("hero.img_alt")}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-55"
          />
        </HeroParallax>
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-[#0b1410]/50 via-[#0b1410]/35 to-[#0b1410]/85"
        />
        <div className="relative z-10 max-w-5xl px-6 md:px-10 text-center">
          <Reveal>
            <Eyebrow light>{t("hero.eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mt-6 text-[#f4ecd8]">
              {t("hero.title")}
              <span className="block font-display italic text-[#e6d9b8] mt-3 text-3xl md:text-5xl">
                {t("hero.title_italic")}
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <P light className="mt-6 max-w-2xl mx-auto">
              {t("hero.lead")}
            </P>
          </Reveal>
          <Reveal delay={0.3}>
            <a
              href="#rooms"
              className="mt-10 inline-flex items-center gap-2.5 px-7 py-4 bg-[#e6d9b8] text-[#0f1f18] hover:bg-[#f4ecd8] text-sm font-medium tracking-wide transition-colors min-h-[48px]"
            >
              {t("hero.cta_explore")}
            </a>
          </Reveal>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-20 md:py-28 bg-[#faf6ec] relative overflow-hidden rest-grain rest-grain--light">
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <Reveal>
            <Eyebrow>{t("intro.eyebrow")}</Eyebrow>
            <H2>
              {t("intro.title")}
              <span className="block font-display italic text-[#1a3d2e]/65 mt-2 md:mt-3">
                {t("intro.title_italic")}
              </span>
            </H2>
            <P>{t("intro.body")}</P>
            <P className="mt-4">{t("intro.body_extra")}</P>
            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
              {(["bullet_1", "bullet_2", "bullet_3", "bullet_4"] as const).map((k) => (
                <li key={k} className="flex items-start gap-3">
                  <Bed
                    className="w-5 h-5 mt-0.5 text-[#1a3d2e] flex-shrink-0"
                    strokeWidth={1.7}
                  />
                  <span className="text-[15px] text-[#0f1f18]/85 leading-[1.55]">
                    {t(`intro.${k}`)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 font-display italic text-[17px] text-[#1a3d2e]/70">
              {t("intro.note")}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <figure className="relative aspect-[4/5] overflow-hidden ring-1 ring-[#1a3d2e]/15 shadow-[0_30px_60px_-25px_rgba(26,61,46,0.35)]">
              <Image
                src="/images/hotels/central/8.jpg"
                alt={t("hero.img_alt")}
                fill
                priority
                fetchPriority="high"
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </figure>
          </Reveal>
        </div>
        <SectionFlourish />
      </section>

      {/* PHONE CARD */}
      <section className="py-16 md:py-20 bg-[#1a3d2e] text-[#f4ecd8] relative overflow-hidden rest-grain">
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 text-center">
          <Reveal>
            <Eyebrow light>{t("phone.eyebrow")}</Eyebrow>
            <H2 light>{t("phone.title")}</H2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              <a
                href={`tel:${PHONE_PRIMARY_TEL}`}
                className="font-display text-3xl md:text-4xl text-[#e6d9b8] hover:text-[#f4ecd8] transition-colors"
              >
                {PHONE_PRIMARY}
              </a>
              <span className="text-[#e6d9b8]/40 text-2xl">/</span>
              <a
                href={`tel:${PHONE_SECONDARY_TEL}`}
                className="font-display text-2xl md:text-3xl text-[#e6d9b8] hover:text-[#f4ecd8] transition-colors"
              >
                {PHONE_SECONDARY}
              </a>
            </div>
            <P light className="mt-6">
              {t("phone.note")}
            </P>
          </Reveal>
        </div>
      </section>

      {/* GENERAL GALLERY */}
      <section className="py-20 md:py-28 bg-[#0f1f18] text-[#f4ecd8] relative overflow-hidden rest-grain">
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10">
          <Reveal>
            <Eyebrow light>{t("gallery.eyebrow")}</Eyebrow>
            <H2 light>{t("gallery.title")}</H2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12">
              <HallSlider
                photos={gallerySlides}
                light
                aspect="aspect-[16/10]"
                base="/images/hotels/central/"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ROOMS GRID */}
      <section
        id="rooms"
        className="py-20 md:py-28 bg-[#faf6ec] relative overflow-hidden rest-grain rest-grain--light scroll-mt-20"
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <Reveal>
              <Eyebrow>{t("rooms_eyebrow")}</Eyebrow>
            </Reveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {ROOMS.map((slug, idx) => (
              <RoomCard key={slug} slug={slug} index={idx} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* AMENITIES */}
      <section className="py-20 md:py-28 bg-[#1a3d2e] text-[#f4ecd8] relative overflow-hidden rest-grain">
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-10 md:gap-16">
          <Reveal>
            <Eyebrow light>{t("amenities_paid.eyebrow")}</Eyebrow>
            <H2 light>{t("amenities_paid.title")}</H2>
            <ul className="space-y-3">
              {paidItems.map((k) => (
                <li key={k} className="flex items-start gap-3">
                  <Coffee
                    className="w-5 h-5 mt-0.5 text-[#e6d9b8] flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <span className="text-[15px] text-[#f4ecd8]/90 leading-snug">
                    {t(`amenities_paid.${k}` as Parameters<typeof t>[0])}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <Eyebrow light>{" "}</Eyebrow>
            <H2 light>{t("amenities_free.title")}</H2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {freeItems.map((k) => (
                <li key={k} className="flex items-start gap-3">
                  <Wifi
                    className="w-5 h-5 mt-0.5 text-[#e6d9b8] flex-shrink-0"
                    strokeWidth={1.5}
                  />
                  <span className="text-[15px] text-[#f4ecd8]/90 leading-snug">
                    {t(`amenities_free.${k}` as Parameters<typeof t>[0])}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* RULES */}
      <section className="py-20 md:py-28 bg-[#faf6ec] relative overflow-hidden rest-grain rest-grain--light">
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 text-center">
          <Reveal>
            <Eyebrow>{t("rules.eyebrow")}</Eyebrow>
            <H2>
              {t("rules.title")}
              <span className="block font-display italic text-[#1a3d2e]/65 mt-2 md:mt-3">
                {t("rules.title_italic")}
              </span>
            </H2>
            <P>{t("rules.body")}</P>
            <div className="mt-8 grid sm:grid-cols-2 gap-5">
              <div className="p-6 bg-white ring-1 ring-[#1a3d2e]/10 shadow-[0_20px_50px_-25px_rgba(26,61,46,0.2)]">
                <Car
                  className="w-5 h-5 text-[#1a3d2e]/60 mb-2"
                  strokeWidth={1.6}
                />
                <p className="text-[14px] text-[#0f1f18]/80 leading-snug">
                  {t("rules.extra_bed")}
                </p>
              </div>
              <div className="p-6 bg-white ring-1 ring-[#1a3d2e]/10 shadow-[0_20px_50px_-25px_rgba(26,61,46,0.2)]">
                <Clock
                  className="w-5 h-5 text-[#1a3d2e]/60 mb-2"
                  strokeWidth={1.6}
                />
                <p className="text-[14px] text-[#0f1f18]/80 leading-snug">
                  {t("rules.timing")}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 md:py-32 bg-[#0f1f18] text-[#f4ecd8] relative overflow-hidden rest-grain">
        <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-10 text-center">
          <Reveal>
            <Eyebrow light>{t("final.eyebrow")}</Eyebrow>
            <H2 light>
              {t("final.title")}
              <span className="block font-display italic text-[#e6d9b8]/85 mt-2 md:mt-3">
                {t("final.title_italic")}
              </span>
            </H2>
            <P light className="mt-2">
              {t("final.body")}
            </P>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
              <a
                href={`tel:${PHONE_PRIMARY_TEL}`}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#e6d9b8] text-[#0f1f18] hover:bg-[#f4ecd8] text-sm font-medium tracking-wide transition-colors min-h-[44px]"
              >
                <Phone className="w-4 h-4" strokeWidth={2} />
                {t("final.cta")}
              </a>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px]">
                <span className="text-[#f4ecd8]/60 tracking-wide">
                  {t("final.prefix")}
                </span>
                <a
                  href={`tel:${PHONE_PRIMARY_TEL}`}
                  className="font-display italic underline underline-offset-[5px] decoration-1 decoration-current/40 hover:decoration-current text-[#e6d9b8] hover:text-[#f4ecd8] transition-colors"
                >
                  {PHONE_PRIMARY}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
