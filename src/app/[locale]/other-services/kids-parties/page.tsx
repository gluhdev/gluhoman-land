import type { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import {
  PartyPopper,
  Gift,
  Cake,
  Users,
  MapPin,
  Camera,
  Music,
  Phone,
  ArrowUpRight,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { BookingButton } from "@/components/ui/BookingButton";
import { GalleryGrid } from "@/components/ui/GalleryGrid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "other_services.kids_parties" });
  return {
    title: t("meta_title"),
    description: t("meta_description"),
    openGraph: {
      title: t("meta_og_title"),
      description: t("meta_og_description"),
      type: "website",
      locale: locale === "uk" ? "uk_UA" : "en_US",
      images: [
        {
          url: "/images/restaurant/event_birthday_balloon_decor.jpg",
          width: 1200,
          height: 630,
          alt: t("meta_og_image_alt"),
        },
      ],
    },
  };
}

const CREAM = "#faf6ec";
const SURFACE = "#f4ecd8";
const TAN = "#e6d9b8";
const DEEP = "#0f1f18";
const FOREST = "#1a3d2e";
const NEAR_BLACK = "#0b1410";

export default async function KidsPartiesPage() {
  const t = await getTranslations("other_services.kids_parties");

  const formats = [
    { roman: "I",  title: t("fmt_1_title"), description: t("fmt_1_desc"), image: "/images/restaurant/animation_lasertag_kids_outdoor.jpg", icon: PartyPopper },
    { roman: "II", title: t("fmt_2_title"), description: t("fmt_2_desc"), image: "/images/restaurant/animation_kids_pirate_night.jpg",      icon: Gift },
    { roman: "III",title: t("fmt_3_title"), description: t("fmt_3_desc"), image: "/images/restaurant/animation_clown_with_child.jpg",        icon: Cake },
    { roman: "IV", title: t("fmt_4_title"), description: t("fmt_4_desc"), image: "/images/restaurant/event_happy_birthday_number2_pink.jpg", icon: Users },
  ];

  const imgAlts = [t("fmt_1_img_alt"), t("fmt_2_img_alt"), t("fmt_3_img_alt"), t("fmt_4_img_alt")];

  const included = [
    { icon: Users,      title: t("incl_1_title"), text: t("incl_1_text") },
    { icon: Cake,       title: t("incl_2_title"), text: t("incl_2_text") },
    { icon: Gift,       title: t("incl_3_title"), text: t("incl_3_text") },
    { icon: PartyPopper,title: t("incl_4_title"), text: t("incl_4_text") },
    { icon: Music,      title: t("incl_5_title"), text: t("incl_5_text") },
    { icon: Camera,     title: t("incl_6_title"), text: t("incl_6_text") },
  ];

  const locations = [
    { title: t("loc_1_title"), text: t("loc_1_text") },
    { title: t("loc_2_title"), text: t("loc_2_text") },
    { title: t("loc_3_title"), text: t("loc_3_text") },
  ];

  const gallery = [
    { src: "/images/restaurant/event_birthday_balloon_decor.jpg",    alt: t("gallery_alt_1") },
    { src: "/images/restaurant/event_happy_birthday_number1_red.jpg", alt: t("gallery_alt_2") },
    { src: "/images/restaurant/animation_clown_with_child.jpg",      alt: t("gallery_alt_3") },
    { src: "/images/restaurant/animation_kids_pirate_night.jpg",     alt: t("gallery_alt_4") },
    { src: "/images/restaurant/decor_photozone_green_hedge.jpg",     alt: t("gallery_alt_5") },
    { src: "/images/restaurant/event_fruit_table_terrace.jpg",       alt: t("gallery_alt_6") },
  ];

  const preparation = [
    { n: t("prep_1_n"), title: t("prep_1_title"), text: t("prep_1_text") },
    { n: t("prep_2_n"), title: t("prep_2_title"), text: t("prep_2_text") },
    { n: t("prep_3_n"), title: t("prep_3_title"), text: t("prep_3_text") },
    { n: t("prep_4_n"), title: t("prep_4_title"), text: t("prep_4_text") },
    { n: t("prep_5_n"), title: t("prep_5_title"), text: t("prep_5_text") },
  ];

  const jsonLdString = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Children's Party",
    name: t("jsonld_name"),
    description: t("jsonld_description"),
    areaServed: "Полтавська область, Україна",
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
  });

  return (
    <main style={{ backgroundColor: CREAM }} className="text-[#0b1410]">
      <Script id="kids-parties-jsonld" type="application/ld+json">
        {jsonLdString}
      </Script>

      {/* 1. HERO */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: DEEP, color: CREAM }}
      >
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/images/restaurant/event_birthday_balloon_decor.jpg"
            alt={t("hero_img_alt")}
            fill
            priority
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, ${DEEP}cc, ${NEAR_BLACK}ee)`,
            }}
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-36">
          <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: TAN }}>
            {t("hero_eyebrow")}
          </p>
          <h1 className="font-display mt-6 text-5xl md:text-7xl lg:text-8xl leading-[0.95]">
            {t("hero_title")}{" "}
            <span className="italic font-light" style={{ color: TAN }}>
              {t("hero_title_em")}
            </span>
          </h1>
          <p
            className="mt-8 max-w-2xl text-lg md:text-xl leading-relaxed"
            style={{ color: `${CREAM}cc` }}
          >
            {t("hero_body")}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <BookingButton />
            <Link
              href="#formats"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] border-b pb-1 transition-opacity hover:opacity-80"
              style={{ borderColor: TAN, color: TAN }}
            >
              {t("hero_formats_link")} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. INTRO */}
      <section style={{ backgroundColor: CREAM }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4">
              <p
                className="text-[11px] uppercase tracking-[0.22em]"
                style={{ color: FOREST }}
              >
                {t("intro_eyebrow")}
              </p>
              <h2 className="font-display mt-6 text-4xl md:text-5xl leading-tight">
                {t("intro_heading_pt1")}{" "}
                <span className="italic font-light">{t("intro_heading_em")}</span>
              </h2>
            </div>
            <div className="md:col-span-8">
              <p className="text-lg md:text-xl leading-relaxed text-[#0b1410]/80">
                {t("intro_body")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FORMATS */}
      <section id="formats" style={{ backgroundColor: DEEP, color: CREAM }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="max-w-3xl">
            <p
              className="text-[11px] uppercase tracking-[0.22em]"
              style={{ color: TAN }}
            >
              {t("formats_eyebrow")}
            </p>
            <h2 className="font-display mt-6 text-4xl md:text-5xl leading-tight">
              {t("formats_heading_pt1")}{" "}
              <span className="italic font-light" style={{ color: TAN }}>
                {t("formats_heading_em")}
              </span>
            </h2>
          </div>

          <div className="mt-20 grid md:grid-cols-2 gap-x-12 gap-y-20">
            {formats.map((f, idx) => {
              const Icon = f.icon;
              return (
                <article key={f.title}>
                  <div
                    className="relative overflow-hidden"
                    style={{
                      aspectRatio: "4 / 5",
                      borderRadius: "55% 45% 60% 40% / 50% 55% 45% 50%",
                    }}
                  >
                    <Image
                      src={f.image}
                      alt={imgAlts[idx]}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-8 flex items-start gap-6">
                    <span
                      className="font-display text-5xl italic font-light shrink-0"
                      style={{ color: TAN }}
                    >
                      {f.roman}
                    </span>
                    <div>
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" style={{ color: TAN }} />
                        <h3 className="font-display text-2xl md:text-3xl">{f.title}</h3>
                      </div>
                      <p
                        className="mt-4 leading-relaxed"
                        style={{ color: `${CREAM}bb` }}
                      >
                        {f.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. INCLUDED */}
      <section style={{ backgroundColor: CREAM }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="max-w-3xl">
            <p
              className="text-[11px] uppercase tracking-[0.22em]"
              style={{ color: FOREST }}
            >
              {t("included_eyebrow")}
            </p>
            <h2 className="font-display mt-6 text-4xl md:text-5xl leading-tight">
              {t("included_heading_pt1")}{" "}
              <span className="italic font-light">{t("included_heading_em")}</span>
            </h2>
          </div>

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 border-t border-[#0f1f18]/15">
            {included.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-8 md:p-10 border-b border-r border-[#0f1f18]/15"
                >
                  <Icon className="h-6 w-6" style={{ color: FOREST }} />
                  <h3 className="font-display mt-6 text-2xl">{item.title}</h3>
                  <p className="mt-3 text-[#0b1410]/70 leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </div>

          <div
            className="mt-16 p-8 md:p-12 border-l-2"
            style={{ backgroundColor: SURFACE, borderColor: FOREST }}
          >
            <p
              className="text-[11px] uppercase tracking-[0.22em]"
              style={{ color: FOREST }}
            >
              {t("prices_label")}
            </p>
            <p className="mt-4 font-display text-2xl md:text-3xl italic font-light leading-snug">
              {t("prices_note")}
            </p>
          </div>
        </div>
      </section>

      {/* 5. LOCATIONS */}
      <section style={{ backgroundColor: DEEP, color: CREAM }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="max-w-3xl">
            <p
              className="text-[11px] uppercase tracking-[0.22em]"
              style={{ color: TAN }}
            >
              {t("locations_eyebrow")}
            </p>
            <h2 className="font-display mt-6 text-4xl md:text-5xl leading-tight">
              {t("locations_heading_pt1")}{" "}
              <span className="italic font-light" style={{ color: TAN }}>
                {t("locations_heading_em")}
              </span>
            </h2>
          </div>

          <div
            className="mt-16 grid md:grid-cols-3 gap-px"
            style={{ backgroundColor: `${TAN}33` }}
          >
            {locations.map((loc, i) => (
              <div
                key={loc.title}
                className="p-10 md:p-12"
                style={{ backgroundColor: DEEP }}
              >
                <div className="flex items-center gap-4">
                  <span
                    className="font-display text-3xl italic font-light"
                    style={{ color: TAN }}
                  >
                    0{i + 1}
                  </span>
                  <MapPin className="h-5 w-5" style={{ color: TAN }} />
                </div>
                <h3 className="font-display mt-6 text-2xl md:text-3xl">{loc.title}</h3>
                <p
                  className="mt-4 leading-relaxed"
                  style={{ color: `${CREAM}bb` }}
                >
                  {loc.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GALLERY */}
      <section style={{ backgroundColor: CREAM }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="max-w-3xl">
            <p
              className="text-[11px] uppercase tracking-[0.22em]"
              style={{ color: FOREST }}
            >
              {t("gallery_eyebrow")}
            </p>
            <h2 className="font-display mt-6 text-4xl md:text-5xl leading-tight">
              {t("gallery_heading_pt1")}{" "}
              <span className="italic font-light">{t("gallery_heading_em")}</span>
            </h2>
          </div>
          <div className="mt-16">
            <GalleryGrid images={gallery} columns={3} aspect="square" />
          </div>
        </div>
      </section>

      {/* 7. PREPARATION */}
      <section style={{ backgroundColor: CREAM }}>
        <div className="max-w-6xl mx-auto px-6 pb-28 md:pb-36">
          <div className="border-t border-[#0f1f18]/15 pt-20">
            <div className="max-w-3xl">
              <p
                className="text-[11px] uppercase tracking-[0.22em]"
                style={{ color: FOREST }}
              >
                {t("prep_eyebrow")}
              </p>
              <h2 className="font-display mt-6 text-4xl md:text-5xl leading-tight">
                {t("prep_heading_pt1")}{" "}
                <span className="italic font-light">{t("prep_heading_em")}</span>
              </h2>
            </div>

            <ol className="mt-16 space-y-12">
              {preparation.map((step) => (
                <li
                  key={step.n}
                  className="grid md:grid-cols-12 gap-6 md:gap-12 pb-12 border-b border-[#0f1f18]/10 last:border-b-0"
                >
                  <div className="md:col-span-2">
                    <span
                      className="font-display text-5xl italic font-light"
                      style={{ color: FOREST }}
                    >
                      {step.n}
                    </span>
                  </div>
                  <div className="md:col-span-4">
                    <h3 className="font-display text-2xl md:text-3xl">{step.title}</h3>
                  </div>
                  <div className="md:col-span-6">
                    <p className="text-lg text-[#0b1410]/75 leading-relaxed">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <section style={{ backgroundColor: DEEP, color: CREAM }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36 text-center">
          <p
            className="text-[11px] uppercase tracking-[0.22em]"
            style={{ color: TAN }}
          >
            {t("cta_eyebrow")}
          </p>
          <h2 className="font-display mt-6 text-5xl md:text-7xl leading-[0.95]">
            {t("cta_heading_pt1")}{" "}
            <span className="italic font-light" style={{ color: TAN }}>
              {t("cta_heading_em")}
            </span>
          </h2>
          <p
            className="mt-8 max-w-xl mx-auto text-lg leading-relaxed"
            style={{ color: `${CREAM}cc` }}
          >
            {t("cta_body")}
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <BookingButton />
          </div>
        </div>
      </section>
    </main>
  );
}
