import type { Metadata } from "next";
import Script from "next/script";
import {
  Trophy,
  Compass,
  Users,
  Shield,
  Clock,
  Mountain,
  Heart,
  Phone,
  ArrowUpRight,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BookingButton } from "@/components/ui/BookingButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "other_services.horses" });
  return {
    title: t("meta_title"),
    description: t("meta_description"),
    openGraph: {
      title: t("meta_og_title"),
      description: t("meta_og_description"),
      type: "website",
      locale: locale === "uk" ? "uk_UA" : "en_US",
    },
  };
}

const CREAM = "#faf6ec";
const SURFACE = "#f4ecd8";
const TAN = "#e6d9b8";
const DEEP = "#0f1f18";
const FOREST = "#1a3d2e";
const NEAR_BLACK = "#0b1410";

export default async function HorsesPage() {
  const t = await getTranslations("other_services.horses");

  const formats = [
    {
      numeral: "I",
      icon: Clock,
      title: t("fmt_1_title"),
      duration: t("fmt_1_duration"),
      body: t("fmt_1_body"),
    },
    {
      numeral: "II",
      icon: Mountain,
      title: t("fmt_2_title"),
      duration: t("fmt_2_duration"),
      body: t("fmt_2_body"),
    },
    {
      numeral: "III",
      icon: Heart,
      title: t("fmt_3_title"),
      duration: t("fmt_3_duration"),
      body: t("fmt_3_body"),
    },
  ];

  const included = [
    t("incl_1"),
    t("incl_2"),
    t("incl_3"),
    t("incl_4"),
  ];

  const horses = [
    { name: t("horse_1_name"), meta: t("horse_1_meta"), body: t("horse_1_body") },
    { name: t("horse_2_name"), meta: t("horse_2_meta"), body: t("horse_2_body") },
    { name: t("horse_3_name"), meta: t("horse_3_meta"), body: t("horse_3_body") },
    { name: t("horse_4_name"), meta: t("horse_4_meta"), body: t("horse_4_body") },
  ];

  const rules = [
    t("rule_1"),
    t("rule_2"),
    t("rule_3"),
    t("rule_4"),
    t("rule_5"),
  ];

  const prepare = [
    t("prep_1"),
    t("prep_2"),
    t("prep_3"),
  ];

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Horse riding",
    name: t("jsonld_name"),
    description: t("jsonld_description"),
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
    areaServed: "Полтавщина",
  });

  return (
    <main className="font-display" style={{ backgroundColor: CREAM, color: NEAR_BLACK }}>
      <Script id="horses-jsonld" type="application/ld+json">
        {jsonLd}
      </Script>

      {/* 1. HERO */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: DEEP, color: CREAM }}
      >
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="flex flex-col items-start gap-10 md:gap-14">
            <div
              className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full"
              style={{ backgroundColor: TAN, color: DEEP }}
            >
              <Compass className="h-9 w-9 md:h-11 md:w-11" strokeWidth={1.25} />
            </div>
            <p
              className="text-[11px] uppercase tracking-[0.22em]"
              style={{ color: TAN }}
            >
              {t("hero_eyebrow")}
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[0.95] max-w-4xl">
              {t("hero_title_pt1")}{" "}
              <em className="italic font-light" style={{ color: TAN }}>
                {t("hero_title_em")}
              </em>
            </h1>
            <p
              className="text-lg md:text-xl max-w-2xl leading-relaxed font-light"
              style={{ color: SURFACE }}
            >
              {t("hero_body")}
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <BookingButton
                className="inline-flex items-center gap-3 px-8 py-4 text-base uppercase tracking-[0.18em]"
                style={{ backgroundColor: TAN, color: DEEP }}
              >
                {t("book_ride")}
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
              </BookingButton>
              <a
                href="tel:+380500000000"
                className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] border-b pb-1"
                style={{ color: CREAM, borderColor: TAN }}
              >
                <Phone className="h-4 w-4" strokeWidth={1.5} />
                {t("contact_link")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTRO */}
      <section style={{ backgroundColor: CREAM, color: NEAR_BLACK }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16">
            <div className="md:col-span-5">
              <p
                className="text-[11px] uppercase tracking-[0.22em] mb-6"
                style={{ color: FOREST }}
              >
                {t("intro_eyebrow")}
              </p>
              <h2 className="text-4xl md:text-5xl leading-[1.05]">
                {t("intro_heading_pt1")}{" "}
                <em className="italic font-light" style={{ color: FOREST }}>
                  {t("intro_heading_em")}
                </em>
              </h2>
            </div>
            <div className="md:col-span-7">
              <p className="text-lg md:text-xl leading-relaxed font-light">
                {t("intro_body")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FORMATS */}
      <section style={{ backgroundColor: DEEP, color: CREAM }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="mb-16 md:mb-20 max-w-2xl">
            <p
              className="text-[11px] uppercase tracking-[0.22em] mb-6"
              style={{ color: TAN }}
            >
              {t("formats_eyebrow")}
            </p>
            <h2 className="text-4xl md:text-5xl leading-[1.05]">
              {t("formats_heading_pt1")}{" "}
              <em className="italic font-light" style={{ color: TAN }}>
                {t("formats_heading_em")}
              </em>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-px" style={{ backgroundColor: FOREST }}>
            {formats.map(({ numeral, icon: Icon, title, duration, body }) => (
              <article
                key={title}
                className="p-10 md:p-12 flex flex-col gap-6"
                style={{ backgroundColor: DEEP }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[11px] uppercase tracking-[0.22em]"
                    style={{ color: TAN }}
                  >
                    {numeral}
                  </span>
                  <Icon className="h-6 w-6" strokeWidth={1.25} style={{ color: TAN }} />
                </div>
                <h3 className="text-3xl leading-tight">{title}</h3>
                <p className="italic font-light text-lg" style={{ color: TAN }}>
                  {duration}
                </p>
                <p
                  className="text-base leading-relaxed font-light"
                  style={{ color: SURFACE }}
                >
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INCLUDED */}
      <section style={{ backgroundColor: CREAM, color: NEAR_BLACK }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16">
            <div className="md:col-span-4">
              <p
                className="text-[11px] uppercase tracking-[0.22em] mb-6"
                style={{ color: FOREST }}
              >
                {t("included_eyebrow")}
              </p>
              <h2 className="text-4xl md:text-5xl leading-[1.05]">
                {t("included_heading_pt1")}{" "}
                <em className="italic font-light" style={{ color: FOREST }}>
                  {t("included_heading_em")}
                </em>
              </h2>
            </div>
            <ul className="md:col-span-8 flex flex-col">
              {included.map((item, i) => (
                <li
                  key={item}
                  className="flex items-start gap-6 py-6 border-t"
                  style={{
                    borderColor: TAN,
                    borderBottomWidth: i === included.length - 1 ? 1 : 0,
                    borderBottomStyle: "solid",
                  }}
                >
                  <span
                    className="text-[11px] uppercase tracking-[0.22em] pt-1 w-10"
                    style={{ color: FOREST }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg md:text-xl font-light leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. HORSES */}
      <section style={{ backgroundColor: SURFACE, color: NEAR_BLACK }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="mb-16 md:mb-20 max-w-2xl">
            <p
              className="text-[11px] uppercase tracking-[0.22em] mb-6"
              style={{ color: FOREST }}
            >
              {t("horses_eyebrow")}
            </p>
            <h2 className="text-4xl md:text-5xl leading-[1.05]">
              {t("horses_heading_pt1")}{" "}
              <em className="italic font-light" style={{ color: FOREST }}>
                {t("horses_heading_em")}
              </em>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-px" style={{ backgroundColor: TAN }}>
            {horses.map(({ name, meta, body }) => (
              <article
                key={name}
                className="p-10 md:p-14 flex flex-col gap-4"
                style={{ backgroundColor: SURFACE }}
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full"
                  style={{ backgroundColor: TAN, color: DEEP }}
                >
                  <Trophy className="h-6 w-6" strokeWidth={1.25} />
                </div>
                <h3
                  className="text-4xl md:text-5xl italic font-light"
                  style={{ color: DEEP }}
                >
                  {name}
                </h3>
                <p
                  className="text-[11px] uppercase tracking-[0.22em]"
                  style={{ color: FOREST }}
                >
                  {meta}
                </p>
                <p className="text-base md:text-lg leading-relaxed font-light">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SAFETY */}
      <section style={{ backgroundColor: DEEP, color: CREAM }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16">
            <div className="md:col-span-4">
              <Shield
                className="h-10 w-10 mb-8"
                strokeWidth={1.25}
                style={{ color: TAN }}
              />
              <p
                className="text-[11px] uppercase tracking-[0.22em] mb-6"
                style={{ color: TAN }}
              >
                {t("safety_eyebrow")}
              </p>
              <h2 className="text-4xl md:text-5xl leading-[1.05]">
                {t("safety_heading_pt1")}{" "}
                <em className="italic font-light" style={{ color: TAN }}>
                  {t("safety_heading_em")}
                </em>
              </h2>
            </div>
            <ul className="md:col-span-8 flex flex-col">
              {rules.map((rule, i) => (
                <li
                  key={rule}
                  className="flex items-start gap-6 py-6 border-t"
                  style={{
                    borderColor: FOREST,
                    borderBottomWidth: i === rules.length - 1 ? 1 : 0,
                    borderBottomStyle: "solid",
                  }}
                >
                  <span
                    className="text-[11px] uppercase tracking-[0.22em] pt-1 w-10"
                    style={{ color: TAN }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="text-lg md:text-xl font-light leading-relaxed"
                    style={{ color: SURFACE }}
                  >
                    {rule}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 7. PRICES */}
      <section style={{ backgroundColor: CREAM, color: NEAR_BLACK }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-end">
            <div className="md:col-span-6">
              <p
                className="text-[11px] uppercase tracking-[0.22em] mb-6"
                style={{ color: FOREST }}
              >
                {t("prices_eyebrow")}
              </p>
              <h2 className="text-4xl md:text-5xl leading-[1.05]">
                {t("prices_heading_pt1")}{" "}
                <em className="italic font-light" style={{ color: FOREST }}>
                  {t("prices_heading_em")}
                </em>
              </h2>
            </div>
            <div className="md:col-span-6">
              <p className="text-lg md:text-xl leading-relaxed font-light">
                {t("prices_body")}
              </p>
              <div
                className="mt-8 pt-6 flex items-center gap-3 border-t"
                style={{ borderColor: TAN, color: FOREST }}
              >
                <Users className="h-5 w-5" strokeWidth={1.25} />
                <span className="text-[11px] uppercase tracking-[0.22em]">
                  {t("prices_group_label")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. PREPARE */}
      <section style={{ backgroundColor: SURFACE, color: NEAR_BLACK }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="mb-16 md:mb-20 max-w-2xl">
            <p
              className="text-[11px] uppercase tracking-[0.22em] mb-6"
              style={{ color: FOREST }}
            >
              {t("prepare_eyebrow")}
            </p>
            <h2 className="text-4xl md:text-5xl leading-[1.05]">
              {t("prepare_heading_pt1")}{" "}
              <em className="italic font-light" style={{ color: FOREST }}>
                {t("prepare_heading_em")}
              </em>
            </h2>
          </div>
          <ol className="grid md:grid-cols-3 gap-px" style={{ backgroundColor: TAN }}>
            {prepare.map((step, i) => (
              <li
                key={step}
                className="p-10 md:p-12 flex flex-col gap-6"
                style={{ backgroundColor: SURFACE }}
              >
                <span
                  className="text-[11px] uppercase tracking-[0.22em]"
                  style={{ color: FOREST }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-lg md:text-xl font-light leading-relaxed">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 9. CTA */}
      <section style={{ backgroundColor: DEEP, color: CREAM }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="flex flex-col items-start gap-10">
            <p
              className="text-[11px] uppercase tracking-[0.22em]"
              style={{ color: TAN }}
            >
              {t("cta_eyebrow")}
            </p>
            <h2 className="text-5xl md:text-6xl lg:text-7xl leading-[0.95] max-w-4xl">
              {t("cta_heading_pt1")}{" "}
              <em className="italic font-light" style={{ color: TAN }}>
                {t("cta_heading_em")}
              </em>
            </h2>
            <p
              className="text-lg md:text-xl max-w-2xl leading-relaxed font-light"
              style={{ color: SURFACE }}
            >
              {t("cta_body")}
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <BookingButton
                className="inline-flex items-center gap-3 px-8 py-4 text-base uppercase tracking-[0.18em]"
                style={{ backgroundColor: TAN, color: DEEP }}
              >
                {t("book_ride")}
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
              </BookingButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
