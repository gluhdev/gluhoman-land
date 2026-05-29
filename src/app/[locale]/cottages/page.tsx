import { Metadata } from "next";
import Image from "next/image";
import {
  Clock,
  Coffee,
  Flame,
  Users,
  Bed,
  Tv,
  Refrigerator,
  Wifi,
  Bath,
  Shirt,
  Sparkles,
  Wind,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { HallSlider, type HallSlide } from "@/components/restaurant/HallSlider";
import { Reveal } from "@/components/restaurant/Reveal";
import { SectionFlourish } from "@/components/restaurant/SectionFlourish";
import { HeroParallax } from "@/components/restaurant/HeroParallax";
import { CottageBookingTrigger } from "@/components/cottages/CottageBookingTrigger";
import { RoomPrice } from "@/components/hotel/RoomPrice";
import { getText } from "@/lib/site-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cottages" });
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
          url: "/images/cottages/yaga/1.jpg",
          width: 1920,
          height: 1280,
          alt: t("meta.og_image_alt"),
        },
      ],
    },
  };
}

type CottageSlug = "yaga" | "lisovyk" | "teremok" | "terem-lux";

const ROMAN = ["I", "II", "III", "IV"] as const;

interface Cottage {
  slug: CottageSlug;
  capacity: number;
  rooms: 1 | 2;
  /** Explicit list of photo numbers — gaps are intentional (e.g. yaga missing #3). */
  photos: number[];
}

const COTTAGES: Cottage[] = [
  { slug: "yaga", capacity: 2, rooms: 1, photos: [1, 2, 4, 5, 6, 7, 8, 9, 10] },
  { slug: "lisovyk", capacity: 2, rooms: 1, photos: [1, 2, 3, 4, 5, 6, 7, 8, 9] },
  { slug: "teremok", capacity: 2, rooms: 1, photos: [1, 2, 3, 4, 5, 6, 7, 8] },
  { slug: "terem-lux", capacity: 4, rooms: 2, photos: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
];

const cottagesJsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  name: "Будиночки РГК «Глухомань»",
  description:
    "Чотири авторські будиночки на території комплексу «Глухомань»: казкові інтерʼєри, повна комплектація, сніданок та 2 години карпатського чану включено.",
  image: COTTAGES.map(
    (c) => `https://gluhoman.com.ua/images/cottages/${c.slug}/1.jpg`
  ),
  telephone: "+380508503555",
  address: {
    "@type": "PostalAddress",
    addressCountry: "UA",
    addressRegion: "Полтавська область",
    addressLocality: "с. Нижні Млини",
  },
  checkinTime: "14:30",
  checkoutTime: "12:00",
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

/* ── Cottage Block ─────────────────────────────────────────────── */

async function CottageBlock({
  cottage,
  index,
  locale,
}: {
  cottage: Cottage;
  index: number;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "cottages" });
  const k = (suffix: string) =>
    `items.${cottage.slug}.${suffix}` as Parameters<typeof t>[0];
  const price = await getText(
    `cottages.${cottage.slug}.price`,
    t("labels.price_hint")
  );

  const reverse = index % 2 === 1;
  const light = index % 2 === 1;

  // Use cottage name as a single shared alt — keys gallery_alt_5..10 don't
  // exist in i18n for the larger cottages and the per-photo specificity
  // adds no value to screen readers.
  const slides: HallSlide[] = cottage.photos.map((n) => ({
    n,
    alt: t(k("name")),
  }));

  const sectionBg = light
    ? "bg-[#0f1f18] text-[#f4ecd8]"
    : "bg-[#faf6ec] text-[#1a3d2e]";

  return (
    <section
      className={`py-20 md:py-28 relative overflow-hidden rest-grain ${
        light ? "" : "rest-grain--light"
      } ${sectionBg}`}
    >
      {light && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            background: `radial-gradient(55% 45% at ${
              reverse ? "75%" : "25%"
            } 30%, #e6a23c 0%, transparent 70%)`,
          }}
        />
      )}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10">
        <div
          className={`grid md:grid-cols-2 gap-12 md:gap-16 items-center ${
            reverse ? "md:[&>*:first-child]:order-2" : ""
          }`}
        >
          {/* Copy */}
          <Reveal>
            <div className="flex items-baseline gap-4 mb-5">
              <span
                className={`font-display italic text-4xl md:text-5xl leading-none ${
                  light ? "text-[#e6d9b8]/45" : "text-[#1a3d2e]/35"
                }`}
              >
                {ROMAN[index] ?? ""}
              </span>
              <Eyebrow light={light}>{t(k("kicker"))}</Eyebrow>
            </div>
            <H2 light={light}>
              {t(k("name"))}
              <span
                className={`block font-display italic mt-2 md:mt-3 text-2xl md:text-3xl lg:text-[32px] leading-[1.15] ${
                  light ? "text-[#e6d9b8]/85" : "text-[#1a3d2e]/65"
                }`}
              >
                {t(k("tagline"))}
              </span>
            </H2>
            <P light={light}>{t(k("description"))}</P>

            <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex items-start gap-3">
                <Users
                  className={`w-5 h-5 mt-0.5 ${
                    light ? "text-[#e6d9b8]" : "text-[#1a3d2e]"
                  } flex-shrink-0`}
                  strokeWidth={1.7}
                />
                <div>
                  <p
                    className={`text-[11px] uppercase tracking-[0.2em] ${
                      light ? "text-[#e6d9b8]/70" : "text-[#1a3d2e]/55"
                    }`}
                  >
                    {t("labels.capacity")}
                  </p>
                  <p
                    className={`text-[15px] mt-1 ${
                      light ? "text-[#f4ecd8]" : "text-[#0f1f18]"
                    }`}
                  >
                    {t("labels.capacity_value", { count: cottage.capacity })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock
                  className={`w-5 h-5 mt-0.5 ${
                    light ? "text-[#e6d9b8]" : "text-[#1a3d2e]"
                  } flex-shrink-0`}
                  strokeWidth={1.7}
                />
                <div>
                  <p
                    className={`text-[11px] uppercase tracking-[0.2em] ${
                      light ? "text-[#e6d9b8]/70" : "text-[#1a3d2e]/55"
                    }`}
                  >
                    {t("labels.timing")}
                  </p>
                  <p
                    className={`text-[15px] mt-1 ${
                      light ? "text-[#f4ecd8]" : "text-[#0f1f18]"
                    }`}
                  >
                    {t("labels.timing_value")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Coffee
                  className={`w-5 h-5 mt-0.5 ${
                    light ? "text-[#e6d9b8]" : "text-[#1a3d2e]"
                  } flex-shrink-0`}
                  strokeWidth={1.7}
                />
                <div>
                  <p
                    className={`text-[11px] uppercase tracking-[0.2em] ${
                      light ? "text-[#e6d9b8]/70" : "text-[#1a3d2e]/55"
                    }`}
                  >
                    {t("labels.breakfast")}
                  </p>
                  <p
                    className={`text-[15px] mt-1 ${
                      light ? "text-[#f4ecd8]" : "text-[#0f1f18]"
                    }`}
                  >
                    {t("labels.breakfast_value")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Flame
                  className={`w-5 h-5 mt-0.5 ${
                    light ? "text-[#e6d9b8]" : "text-[#1a3d2e]"
                  } flex-shrink-0`}
                  strokeWidth={1.7}
                />
                <div>
                  <p
                    className={`text-[11px] uppercase tracking-[0.2em] ${
                      light ? "text-[#e6d9b8]/70" : "text-[#1a3d2e]/55"
                    }`}
                  >
                    {t("labels.chan")}
                  </p>
                  <p
                    className={`text-[15px] mt-1 ${
                      light ? "text-[#f4ecd8]" : "text-[#0f1f18]"
                    }`}
                  >
                    {t("labels.chan_value")}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-5">
              <RoomPrice
                hotelSlug="cottages"
                slug={cottage.slug}
                locale={locale}
                fallback={price}
                light={light}
              />
              <CottageBookingTrigger
                label={t("labels.book_cta", { name: t(k("name")) })}
                prefill={t(k("book_prefill"))}
                priceLabel={price}
                cottageSlug={cottage.slug}
                roomName={t(k("name"))}
                photoUrl={`/images/cottages/${cottage.slug}/${cottage.photos[0]}.jpg`}
                light={light}
              />
            </div>
          </Reveal>

          {/* Gallery */}
          <Reveal delay={0.15}>
            <HallSlider
              photos={slides}
              light={light}
              aspect="aspect-[4/3]"
              base={`/images/cottages/${cottage.slug}/`}
            />
          </Reveal>
        </div>
      </div>
      {!light && <SectionFlourish />}
    </section>
  );
}

/* ── Page ──────────────────────────────────────────────────────── */

export default async function CottagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cottages" });

  const commonItems: { Icon: typeof Bed; key: string }[] = [
    { Icon: Bed, key: "bed" },
    { Icon: Tv, key: "tv" },
    { Icon: Refrigerator, key: "fridge" },
    { Icon: Wifi, key: "wifi" },
    { Icon: Bath, key: "bathroom" },
    { Icon: Shirt, key: "robes" },
    { Icon: Sparkles, key: "cosmetics" },
    { Icon: Wind, key: "kettle" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cottagesJsonLd) }}
      />

      {/* HERO */}
      <section className="relative min-h-[92svh] flex items-center justify-center overflow-clip bg-[#0b1410] text-[#f4ecd8] rest-grain">
        <HeroParallax>
          <Image
            src="/images/cottages/yaga/1.jpg"
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
              href="#cottages"
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

      {/* COTTAGES */}
      <div id="cottages" className="scroll-mt-20">
        {COTTAGES.map((cottage, index) => (
          <CottageBlock
            key={cottage.slug}
            cottage={cottage}
            index={index}
            locale={locale}
          />
        ))}
      </div>

      {/* COMMON AMENITIES */}
      <section className="py-20 md:py-28 bg-[#1a3d2e] text-[#f4ecd8] relative overflow-hidden rest-grain">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 30%, #e6a23c 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10">
          <div className="text-center max-w-3xl mx-auto">
            <Reveal>
              <Eyebrow light>{t("common.eyebrow")}</Eyebrow>
              <H2 light>{t("common.title")}</H2>
              <P light>{t("common.lead")}</P>
            </Reveal>
          </div>
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-5">
            {commonItems.map(({ Icon, key }, idx) => (
              <Reveal key={key} delay={0.04 * idx}>
                <div className="h-full p-5 md:p-6 bg-[#0f1f18]/40 ring-1 ring-[#e6d9b8]/10 backdrop-blur-sm text-center">
                  <Icon
                    className="w-6 h-6 text-[#e6d9b8] mx-auto mb-3"
                    strokeWidth={1.5}
                  />
                  <p className="text-[14px] leading-[1.5] text-[#f4ecd8]/85">
                    {t(`common.items.${key}` as Parameters<typeof t>[0])}
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
            <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-5">
              <CottageBookingTrigger
                label={t("final.cta")}
                prefill={t("final.prefill")}
                light={false}
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
