import { Metadata } from "next";
import Image from "next/image";
import {
  Wifi,
  Car,
  Coffee,
  UtensilsCrossed,
  Flame,
  Tv,
  Sparkles,
  Phone,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/restaurant/Reveal";
import { SectionFlourish } from "@/components/restaurant/SectionFlourish";
import { HeroParallax } from "@/components/restaurant/HeroParallax";
import { HotelOverviewCard } from "@/components/hotel/HotelOverviewCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hotels_overview" });
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
          url: "/images/hotels/aquapark/exterior/1.jpg",
          width: 1920,
          height: 1280,
          alt: t("meta.og_image_alt"),
        },
      ],
    },
  };
}

const PHONE_RESERVATIONS = "050 406 35 55";
const PHONE_RESERVATIONS_TEL = "+380504063555";

const hotelsJsonLd = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: "Готелі РГК «Глухомань»",
  description:
    "Чотири готелі на території РГК «Глухомань»: Готель-Аквапарк, Центральний Готель, Будиночки серед лісу.",
  telephone: PHONE_RESERVATIONS_TEL,
  address: {
    "@type": "PostalAddress",
    addressCountry: "UA",
    addressRegion: "Полтавська область",
    addressLocality: "с. Нижні Млини",
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Wi-Fi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Паркінг", value: true },
    { "@type": "LocationFeatureSpecification", name: "Сніданок", value: true },
    { "@type": "LocationFeatureSpecification", name: "Ресторан", value: true },
  ],
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

export default async function HotelsOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hotels_overview" });

  const cards: Array<{
    key: "aquapark" | "central" | "cottages" | "brewery";
    href: string;
    image: string;
  }> = [
    {
      key: "aquapark",
      href: "/hotel/aquapark",
      image: "/images/hotels/aquapark/exterior/1.jpg",
    },
    {
      key: "central",
      href: "/hotel/central",
      image: "/images/hotels/central/1.jpg",
    },
    {
      key: "cottages",
      href: "/cottages",
      image: "/images/cottages/yaga/1.jpg",
    },
    {
      key: "brewery",
      href: "/hotel/brewery",
      // Use a Central-Hotel photo as brewery placeholder until user supplies dedicated photos.
      image: "/images/hotels/central/15.jpg",
    },
  ];

  const amenityItems = [
    { Icon: Wifi, key: "wifi" },
    { Icon: Car, key: "parking" },
    { Icon: Coffee, key: "breakfast" },
    { Icon: UtensilsCrossed, key: "restaurant" },
    { Icon: Flame, key: "sauna" },
    { Icon: Tv, key: "tv" },
    { Icon: Sparkles, key: "cleaning" },
    { Icon: Phone, key: "support" },
  ] as const;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelsJsonLd) }}
      />

      {/* HERO */}
      <section className="relative min-h-[92svh] flex items-center justify-center overflow-clip bg-[#0b1410] text-[#f4ecd8] rest-grain">
        <HeroParallax>
          <Image
            src="/images/hotels/aquapark/exterior/1.jpg"
            alt={t("hero.img_alt")}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-55"
          />
        </HeroParallax>
        {/* Heavier overlay so cream title is readable against any sky/background */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-[#0b1410]/85 via-[#0b1410]/65 to-[#0b1410]/95"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[#0b1410]/30"
        />
        <div className="relative z-10 max-w-5xl px-6 md:px-10 text-center">
          <Reveal>
            <Eyebrow light>{t("hero.eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h1
              className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mt-6 text-[#f4ecd8]"
              style={{ textShadow: "0 2px 24px rgba(0,0,0,0.55)" }}
            >
              {t("hero.title")}
              <span className="block font-display italic text-[#e6d9b8] mt-3 text-3xl md:text-5xl">
                {t("hero.title_italic")}
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <P
              light
              className="mt-6 max-w-2xl mx-auto"
            >
              {t("hero.lead")}
            </P>
          </Reveal>
          <Reveal delay={0.3}>
            <a
              href="#hotels"
              className="mt-10 inline-flex items-center gap-2.5 px-7 py-4 bg-[#e6d9b8] text-[#0f1f18] hover:bg-[#f4ecd8] text-sm font-medium tracking-wide transition-colors min-h-[48px]"
            >
              {t("hero.cta_explore")}
            </a>
          </Reveal>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-20 md:py-28 bg-[#faf6ec] relative overflow-hidden rest-grain rest-grain--light">
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 text-center">
          <Reveal>
            <Eyebrow>{t("intro.eyebrow")}</Eyebrow>
            <H2>
              {t("intro.title")}
              <span className="block font-display italic text-[#1a3d2e]/65 mt-2 md:mt-3">
                {t("intro.title_italic")}
              </span>
            </H2>
            <P>{t("intro.body")}</P>
          </Reveal>
        </div>
        <SectionFlourish />
      </section>

      {/* 4 HOTEL CARDS */}
      <section
        id="hotels"
        className="py-20 md:py-28 bg-[#faf6ec] relative overflow-hidden rest-grain rest-grain--light scroll-mt-20"
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {cards.map((card, idx) => (
              <Reveal key={card.key} delay={0.05 * idx}>
                <HotelOverviewCard
                  index={idx}
                  kicker={t(`cards.${card.key}.kicker`)}
                  name={t(`cards.${card.key}.name`)}
                  tagline={t(`cards.${card.key}.tagline`)}
                  highlights={[
                    t(`cards.${card.key}.highlights_1`),
                    t(`cards.${card.key}.highlights_2`),
                    t(`cards.${card.key}.highlights_3`),
                  ]}
                  cta={t(`cards.${card.key}.cta`)}
                  href={card.href}
                  imageSrc={card.image}
                  imageAlt={t(`cards.${card.key}.img_alt`)}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* COMMON AMENITIES */}
      <section className="py-20 md:py-28 bg-[#0f1f18] text-[#f4ecd8] relative overflow-hidden rest-grain">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 30%, #e6a23c 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal>
              <Eyebrow light>{t("amenities.eyebrow")}</Eyebrow>
              <H2 light>
                {t("amenities.title")}
                <span className="block font-display italic text-[#e6d9b8]/85 mt-2 md:mt-3">
                  {t("amenities.title_italic")}
                </span>
              </H2>
              <P light>{t("amenities.lead")}</P>
            </Reveal>
          </div>
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-5">
            {amenityItems.map(({ Icon, key }, idx) => (
              <Reveal key={key} delay={0.04 * idx}>
                <div className="h-full p-5 md:p-6 bg-[#1a3d2e]/40 ring-1 ring-[#e6d9b8]/10 backdrop-blur-sm text-center">
                  <Icon
                    className="w-6 h-6 text-[#e6d9b8] mx-auto mb-3"
                    strokeWidth={1.5}
                  />
                  <p className="text-[14px] leading-[1.5] text-[#f4ecd8]/85">
                    {t(`amenities.items.${key}` as Parameters<typeof t>[0])}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 md:py-32 bg-[#faf6ec] text-[#1a3d2e] relative overflow-hidden rest-grain rest-grain--light">
        <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-10 text-center">
          <Reveal>
            <Eyebrow>{t("final.eyebrow")}</Eyebrow>
            <H2>
              {t("final.title")}
              <span className="block font-display italic text-[#1a3d2e]/65 mt-2 md:mt-3">
                {t("final.title_italic")}
              </span>
            </H2>
            <P className="mt-2">{t("final.body")}</P>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
              <a
                href={`tel:${PHONE_RESERVATIONS_TEL}`}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#1a3d2e] text-[#f4ecd8] hover:bg-[#0f1f18] text-sm font-medium tracking-wide transition-colors min-h-[44px]"
              >
                <Phone className="w-4 h-4" strokeWidth={2} />
                {t("final.cta")}
              </a>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px]">
                <span className="text-[#0f1f18]/55 tracking-wide">
                  {t("final.prefix")}
                </span>
                <a
                  href={`tel:${PHONE_RESERVATIONS_TEL}`}
                  className="font-display italic underline underline-offset-[5px] decoration-1 decoration-current/40 hover:decoration-current text-[#1a3d2e] hover:text-[#0f1f18] transition-colors"
                >
                  {PHONE_RESERVATIONS}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
