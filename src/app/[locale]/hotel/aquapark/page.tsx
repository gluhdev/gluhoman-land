import { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import { Clock, Coffee, Users, Check, Phone, Wifi, Car } from "lucide-react";
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
  const t = await getTranslations({ locale, namespace: "hotel_aquapark" });
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

type RoomSlug =
  | "lux-balcony"
  | "standard-aqua"
  | "standard-balcony"
  | "standard-twin"
  | "lux-attic"
  | "standard-basic";

interface Room {
  slug: RoomSlug;
  photos: number[];
}

const ROOMS: Room[] = [
  { slug: "lux-balcony", photos: [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18] },
  { slug: "standard-aqua", photos: [19, 20, 21, 22, 23, 24, 25, 26, 27, 28] },
  { slug: "standard-balcony", photos: [30, 29, 31, 32, 33, 34] },
  { slug: "standard-twin", photos: [35, 36, 37, 38] },
  { slug: "lux-attic", photos: [39, 40, 41, 42, 43, 44, 45, 46] },
  { slug: "standard-basic", photos: [47, 48, 49, 50, 51] },
];

const ROMAN = ["I", "II", "III", "IV", "V", "VI"] as const;

const aquaparkJsonLd = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: "Готель-Аквапарк «Глухомань»",
  description:
    "Готель «Глухомань» з прямим виходом до Аквапарку. 12 стандартних, 5 люксів, 1 з двома односпальними ліжками. Сніданок та напій включено.",
  image: ROOMS.flatMap((r) =>
    r.photos.slice(0, 1).map((n) => `https://gluhoman.com.ua/images/hotels/aquapark/${r.slug}/${n}.jpg`)
  ),
  telephone: PHONE_RESERVATIONS_TEL,
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

async function RoomBlock({
  room,
  index,
  locale,
}: {
  room: Room;
  index: number;
  locale: string;
}) {
  const t = await getTranslations({ locale, namespace: "hotel_aquapark" });
  const k = (suffix: string) =>
    `rooms.${room.slug}.${suffix}` as Parameters<typeof t>[0];
  const price = await getText(
    `hotel.aquapark.${room.slug}.price`,
    t("labels.price_hint")
  );
  const reverse = index % 2 === 1;
  const light = index % 2 === 1;
  const sectionBg = light
    ? "bg-[#0f1f18] text-[#f4ecd8]"
    : "bg-[#faf6ec] text-[#1a3d2e]";

  const slides: HallSlide[] = room.photos.map((n) => ({
    n,
    alt: t(k("name")),
  }));

  const bullets = (["bullet_1", "bullet_2", "bullet_3", "bullet_4", "bullet_5", "bullet_6", "bullet_7"] as const)
    .map((b) => t(k(b)))
    .filter((s) => s && s.length > 0);

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
            <P light={light}>{t(k("subtitle"))}</P>

            {bullets.length > 0 && (
              <ul className="mt-8 space-y-3">
                {bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check
                      className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                        light ? "text-[#e6d9b8]" : "text-[#1a3d2e]"
                      }`}
                      strokeWidth={1.7}
                    />
                    <span
                      className={`text-[15px] leading-[1.55] ${
                        light ? "text-[#f4ecd8]/90" : "text-[#0f1f18]/85"
                      }`}
                    >
                      {b}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {t(k("capacity")) && (
              <div
                className={`mt-6 flex items-start gap-3 text-[13px] ${
                  light ? "text-[#e6d9b8]/80" : "text-[#1a3d2e]/70"
                }`}
              >
                <Users className="w-4 h-4 mt-0.5 flex-shrink-0" strokeWidth={1.7} />
                <span className="leading-snug">{t(k("capacity"))}</span>
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              <HotelBookingTrigger
                hotelSlug="aquapark"
                roomCategorySlug={room.slug}
                roomName={t(k("name"))}
                priceLabel={price}
                label={t("labels.book_cta", { name: t(k("name")) })}
                light={light}
              />
              <span
                className={`font-display italic text-[15px] ${
                  light ? "text-[#e6d9b8]/70" : "text-[#1a3d2e]/65"
                }`}
              >
                {price}
              </span>
            </div>
          </Reveal>

          {/* Gallery */}
          <Reveal delay={0.15}>
            <HallSlider
              photos={slides}
              light={light}
              aspect="aspect-[4/3]"
              base={`/images/hotels/aquapark/${room.slug}/`}
            />
          </Reveal>
        </div>
      </div>
      {!light && <SectionFlourish />}
    </section>
  );
}

export default async function HotelAquaparkPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hotel_aquapark" });

  const paidItems = ["item_1", "item_2", "item_3", "item_4"] as const;
  const freeItems = [
    "item_1",
    "item_2",
    "item_3",
    "item_4",
    "item_5",
    "item_6",
    "item_7",
    "item_8",
  ] as const;

  return (
    <>
      <Script
        id="hotel-aquapark-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aquaparkJsonLd) }}
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
            <ul className="mt-8 space-y-3">
              {(["bullet_1", "bullet_2", "bullet_3"] as const).map((k) => (
                <li key={k} className="flex items-start gap-3">
                  <Check
                    className="w-5 h-5 mt-1 text-[#1a3d2e] flex-shrink-0"
                    strokeWidth={1.7}
                  />
                  <span className="text-[16px] text-[#0f1f18]/85 leading-[1.6]">
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
                src="/images/hotels/aquapark/exterior/2.jpg"
                alt={t("hero.img_alt")}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </figure>
          </Reveal>
        </div>
        <SectionFlourish />
      </section>

      {/* ROOMS */}
      <div id="rooms" className="scroll-mt-20">
        <div className="bg-[#faf6ec] pt-16 md:pt-20 text-center">
          <Reveal>
            <Eyebrow>{t("rooms_eyebrow")}</Eyebrow>
          </Reveal>
        </div>
        {ROOMS.map((room, index) => (
          <RoomBlock
            key={room.slug}
            room={room}
            index={index}
            locale={locale}
          />
        ))}
      </div>

      {/* AMENITIES (paid + free) */}
      <section className="py-20 md:py-28 bg-[#1a3d2e] text-[#f4ecd8] relative overflow-hidden rest-grain">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 30%, #e6a23c 0%, transparent 70%)",
          }}
        />
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
                href={`tel:${PHONE_RESERVATIONS_TEL}`}
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
                  href={`tel:${PHONE_RESERVATIONS_TEL}`}
                  className="font-display italic underline underline-offset-[5px] decoration-1 decoration-current/40 hover:decoration-current text-[#e6d9b8] hover:text-[#f4ecd8] transition-colors"
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
