import { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import {
  Phone,
  Users,
  Wifi,
  Projector,
  Wind,
  Presentation,
  CheckCircle2,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { HallSlider, type HallSlide } from "@/components/restaurant/HallSlider";
import { Reveal } from "@/components/restaurant/Reveal";
import { SectionFlourish } from "@/components/restaurant/SectionFlourish";
import { HeroParallax } from "@/components/restaurant/HeroParallax";
import { SITE_URL } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "conference_hall" });
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
          url: "/images/conference-hall/1.jpg",
          width: 1920,
          height: 1280,
          alt: t("meta.og_image_alt"),
        },
      ],
    },
  };
}

const PHONE_CONFERENCE = "050 850 35 55";
const PHONE_CONFERENCE_TEL = "+380508503555";

const C = (n: number) => `/images/conference-hall/${n}.jpg`;

const conferenceJsonLd = {
  "@context": "https://schema.org",
  "@type": "EventVenue",
  name: "Конференц-зал РГК «Глухомань»",
  description:
    "Конференц-зал на 45 осіб у Готелі Аквапарку: мультимедійний проектор, кондиціонер, Wi-Fi, кейтеринг від ресторану. Оренда від 500 грн/год.",
  image: [
    `${SITE_URL}${C(1)}`,
    `${SITE_URL}${C(2)}`,
    `${SITE_URL}${C(3)}`,
  ],
  maximumAttendeeCapacity: 45,
  telephone: PHONE_CONFERENCE_TEL,
  address: {
    "@type": "PostalAddress",
    addressCountry: "UA",
    addressRegion: "Полтавська область",
    addressLocality: "с. Нижні Млини",
  },
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Wi-Fi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Проектор", value: true },
    { "@type": "LocationFeatureSpecification", name: "Кондиціонер", value: true },
    { "@type": "LocationFeatureSpecification", name: "Флипчарт", value: true },
  ],
  priceRange: "₴₴",
};

/* ── Atoms ─────────────────────────────────────────────────────── */

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

function CallCTA({
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
      <a
        href={`tel:${PHONE_CONFERENCE_TEL}`}
        className={`inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-medium tracking-wide transition-colors min-h-[44px] ${
          light
            ? "bg-[#e6d9b8] text-[#0f1f18] hover:bg-[#f4ecd8]"
            : "bg-[#1a3d2e] text-[#f4ecd8] hover:bg-[#0f1f18]"
        }`}
      >
        <Phone className="w-4 h-4" strokeWidth={2} />
        {label}
      </a>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px]">
        <span className={`${mutedText} tracking-wide`}>{prefix}</span>
        <a
          href={`tel:${PHONE_CONFERENCE_TEL}`}
          className={`font-display italic underline underline-offset-[5px] decoration-1 decoration-current/40 hover:decoration-current transition-colors ${phoneText}`}
        >
          {PHONE_CONFERENCE}
        </a>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */

export default async function ConferenceHallPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "conference_hall" });

  const gallery: HallSlide[] = [
    { n: 1, alt: t("gallery.alt_1") },
    { n: 2, alt: t("gallery.alt_2") },
    { n: 3, alt: t("gallery.alt_3") },
    { n: 4, alt: t("gallery.alt_4") },
  ];

  const equipment: { Icon: typeof Wind; key: string }[] = [
    { Icon: Wind, key: "ac" },
    { Icon: Projector, key: "projector" },
    { Icon: Presentation, key: "flipchart" },
    { Icon: Wifi, key: "internet" },
  ];

  return (
    <>
      <Script
        id="conference-hall-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(conferenceJsonLd) }}
      />

      {/* HERO */}
      <section className="relative min-h-[92svh] flex items-center justify-center overflow-clip bg-[#0b1410] text-[#f4ecd8] rest-grain">
        <HeroParallax>
          <Image
            src={C(1)}
            alt={t("hero.img_alt")}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60"
          />
        </HeroParallax>
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-[#0b1410]/40 via-[#0b1410]/30 to-[#0b1410]/80"
        />
        <div className="relative z-10 max-w-5xl px-6 md:px-10 text-center">
          <Reveal>
            <Eyebrow light>{t("hero.eyebrow")}</Eyebrow>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mt-6 text-[#f4ecd8]">
              {t("hero.title")}
              <span className="block font-display italic text-[#e6d9b8] mt-3 text-3xl md:text-5xl">
                {t("hero.subtitle")}
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <P light className="mt-6 max-w-2xl mx-auto">
              {t("hero.lead")}
            </P>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`tel:${PHONE_CONFERENCE_TEL}`}
                className="inline-flex items-center gap-2.5 px-7 py-4 bg-[#e6d9b8] text-[#0f1f18] hover:bg-[#f4ecd8] text-sm font-medium tracking-wide transition-colors min-h-[48px]"
              >
                <Phone className="w-4 h-4" strokeWidth={2} />
                {t("hero.cta_call")}
              </a>
              <a
                href="#equipment"
                className="text-[15px] text-[#e6d9b8] hover:text-[#f4ecd8] underline underline-offset-[6px] decoration-1 decoration-current/40 hover:decoration-current transition-colors"
              >
                {t("hero.cta_details")}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-20 md:py-28 bg-[#faf6ec] relative overflow-hidden rest-grain rest-grain--light">
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <Reveal>
            <Eyebrow>{t("intro.eyebrow")}</Eyebrow>
            <H2>
              {t("intro.title")}{" "}
              <span className="font-display italic text-[#1a3d2e]/65">
                {t("intro.title_italic")}
              </span>
            </H2>
            <P>{t("intro.body")}</P>
            <ul className="mt-8 space-y-3">
              {(["bullet_1", "bullet_2", "bullet_3"] as const).map((k) => (
                <li key={k} className="flex items-start gap-3">
                  <CheckCircle2
                    className="w-5 h-5 mt-1 text-[#1a3d2e] flex-shrink-0"
                    strokeWidth={1.7}
                  />
                  <span className="text-[16px] text-[#0f1f18]/85 leading-[1.6]">
                    {t(`intro.${k}`)}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.15}>
            <figure className="relative aspect-[4/5] overflow-hidden ring-1 ring-[#1a3d2e]/15 shadow-[0_30px_60px_-25px_rgba(26,61,46,0.35)]">
              <Image
                src={C(2)}
                alt={t("intro.img_alt")}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </figure>
          </Reveal>
        </div>
        <SectionFlourish />
      </section>

      {/* EQUIPMENT */}
      <section
        id="equipment"
        className="py-20 md:py-28 bg-[#0f1f18] text-[#f4ecd8] relative overflow-hidden rest-grain scroll-mt-20"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            background:
              "radial-gradient(55% 45% at 25% 30%, #e6a23c 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10">
          <Reveal>
            <Eyebrow light>{t("equipment.eyebrow")}</Eyebrow>
            <H2 light>{t("equipment.title")}</H2>
            <P light className="max-w-2xl">
              {t("equipment.lead")}
            </P>
          </Reveal>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {equipment.map(({ Icon, key }, idx) => (
              <Reveal key={key} delay={0.05 * idx}>
                <div className="h-full p-7 bg-[#1a3d2e]/40 ring-1 ring-[#e6d9b8]/10 backdrop-blur-sm">
                  <Icon
                    className="w-7 h-7 text-[#e6d9b8] mb-5"
                    strokeWidth={1.5}
                  />
                  <h3 className="font-display text-xl text-[#f4ecd8] mb-2">
                    {t(`equipment.items.${key}.title`)}
                  </h3>
                  <p className="text-[14px] leading-[1.6] text-[#f4ecd8]/70">
                    {t(`equipment.items.${key}.body`)}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING + CAPACITY */}
      <section className="py-20 md:py-28 bg-[#faf6ec] relative overflow-hidden rest-grain rest-grain--light">
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-10 text-center">
          <Reveal>
            <Eyebrow>{t("pricing.eyebrow")}</Eyebrow>
            <H2>{t("pricing.title")}</H2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12 grid sm:grid-cols-2 gap-6">
              <div className="p-10 bg-white ring-1 ring-[#1a3d2e]/10 shadow-[0_20px_50px_-20px_rgba(26,61,46,0.18)]">
                <Users
                  className="w-7 h-7 text-[#1a3d2e]/60 mx-auto mb-5"
                  strokeWidth={1.5}
                />
                <p className="text-[12px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 mb-3">
                  {t("pricing.capacity_label")}
                </p>
                <p className="font-display text-5xl text-[#1a3d2e] leading-none">
                  45
                </p>
                <p className="font-display italic text-[#1a3d2e]/55 mt-2">
                  {t("pricing.capacity_unit")}
                </p>
              </div>
              <div className="p-10 bg-[#1a3d2e] text-[#f4ecd8] shadow-[0_20px_50px_-20px_rgba(26,61,46,0.45)]">
                <p className="text-[12px] uppercase tracking-[0.22em] text-[#e6d9b8] mb-3">
                  {t("pricing.price_label")}
                </p>
                <p className="font-display text-5xl text-[#f4ecd8] leading-none">
                  500
                </p>
                <p className="font-display italic text-[#e6d9b8]/85 mt-2">
                  {t("pricing.price_unit")}
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-10 font-display italic text-[17px] text-[#1a3d2e]/70">
              {t("pricing.note")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* CATERING */}
      <section className="py-20 md:py-28 bg-[#faf6ec] relative overflow-hidden rest-grain rest-grain--light">
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <Reveal delay={0.1}>
            <figure className="relative aspect-[4/5] overflow-hidden ring-1 ring-[#1a3d2e]/15 shadow-[0_30px_60px_-25px_rgba(26,61,46,0.35)]">
              <Image
                src={C(3)}
                alt={t("catering.img_alt")}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </figure>
          </Reveal>
          <Reveal>
            <Eyebrow>{t("catering.eyebrow")}</Eyebrow>
            <H2>{t("catering.title")}</H2>
            <P>{t("catering.body")}</P>
            <ul className="mt-8 space-y-3">
              {(["item_1", "item_2", "item_3"] as const).map((k) => (
                <li key={k} className="flex items-start gap-3">
                  <CheckCircle2
                    className="w-5 h-5 mt-1 text-[#1a3d2e] flex-shrink-0"
                    strokeWidth={1.7}
                  />
                  <span className="text-[16px] text-[#0f1f18]/85 leading-[1.6]">
                    {t(`catering.${k}`)}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-20 md:py-28 bg-[#0f1f18] text-[#f4ecd8] relative overflow-hidden rest-grain">
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10">
          <Reveal>
            <Eyebrow light>{t("gallery.eyebrow")}</Eyebrow>
            <H2 light>{t("gallery.title")}</H2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12">
              <HallSlider
                photos={gallery}
                light
                aspect="aspect-[16/10]"
                base="/images/conference-hall/"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 md:py-32 bg-[#1a3d2e] text-[#f4ecd8] relative overflow-hidden rest-grain">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            background:
              "radial-gradient(70% 55% at 50% 50%, #e6a23c 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-10 text-center">
          <Reveal>
            <Eyebrow light>{t("final.eyebrow")}</Eyebrow>
            <H2 light>
              {t("final.title")}{" "}
              <span className="font-display italic text-[#e6d9b8]">
                {t("final.title_italic")}
              </span>
            </H2>
            <P light className="mt-2">
              {t("final.body")}
            </P>
            <div className="mt-2 inline-flex">
              <CallCTA
                label={t("final.cta")}
                prefix={t("final.prefix")}
                light
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
