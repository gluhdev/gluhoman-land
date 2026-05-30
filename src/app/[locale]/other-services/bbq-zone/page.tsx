import type { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import { CONTACT_INFO } from "@/constants";
import {
  Flame,
  Utensils,
  Users,
  Clock,
  Droplets,
  Phone,
  ArrowUpRight,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { BookingButton } from "@/components/ui/BookingButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "other_services.bbq_zone" });
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

const cream = "#faf6ec";
const surface = "#f4ecd8";
const tan = "#e6d9b8";
const deepForest = "#0f1f18";
const nearBlack = "#0b1410";

export default async function BbqZonePage() {
  const t = await getTranslations("other_services.bbq_zone");

  const included = [
    { icon: Flame,    title: t("equip_1_title"), desc: t("equip_1_desc") },
    { icon: Users,    title: t("equip_2_title"), desc: t("equip_2_desc") },
    { icon: Utensils, title: t("equip_3_title"), desc: t("equip_3_desc") },
    { icon: Droplets, title: t("equip_4_title"), desc: t("equip_4_desc") },
    { icon: Flame,    title: t("equip_5_title"), desc: t("equip_5_desc") },
    { icon: Utensils, title: t("equip_6_title"), desc: t("equip_6_desc") },
  ];

  const formats = [
    { tag: "01", title: t("fmt_1_title"), desc: t("fmt_1_desc") },
    { tag: "02", title: t("fmt_2_title"), desc: t("fmt_2_desc") },
  ];

  const addons = [
    t("addon_1"),
    t("addon_2"),
    t("addon_3"),
    t("addon_4"),
  ];

  const rules = [
    t("rule_1"),
    t("rule_2"),
    t("rule_3"),
    t("rule_4"),
    t("rule_5"),
  ];

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("jsonld_name"),
    serviceType: "Barbecue area",
    areaServed: "Полтавська область, Україна",
    provider: {
      "@type": "LodgingBusiness",
      name: "Рекреаційний комплекс «Глухомань»",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Нижні Млини",
        addressRegion: "Полтавська область",
        addressCountry: "UA",
      },
    },
  });

  return (
    <main style={{ backgroundColor: cream }} className="font-display">
      <Script
        id="ld-bbq-zone"
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {jsonLd}
      </Script>

      {/* 1 · HERO */}
      <section
        style={{ backgroundColor: deepForest, color: cream }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <Image
            src="/images/restaurant/hall_oven.jpg"
            alt={t("hero_img_alt")}
            fill
            priority
            className="object-cover opacity-55"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(11,20,16,0.55) 0%, rgba(11,20,16,0.85) 100%)",
            }}
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-36">
          <p
            className="text-[11px] uppercase tracking-[0.22em]"
            style={{ color: tan }}
          >
            {t("hero_eyebrow")}
          </p>
          <h1 className="mt-6 text-5xl md:text-7xl leading-[1.05]">
            {t("hero_title_pt1")}{" "}
            <span className="italic" style={{ color: tan }}>
              {t("hero_title_em")}
            </span>
          </h1>
          <p
            className="mt-8 max-w-2xl text-lg md:text-xl leading-relaxed"
            style={{ color: "#d8d0b8" }}
          >
            {t("hero_body")}
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-5">
            <BookingButton
              className="inline-flex items-center gap-2 px-8 py-4 text-sm uppercase tracking-[0.22em]"
              style={{ backgroundColor: cream, color: nearBlack }}
            >
              {t("book_zone")} <ArrowUpRight className="h-4 w-4" />
            </BookingButton>
            <Link
              href={`tel:${CONTACT_INFO.phone[0].replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-2 px-8 py-4 text-sm uppercase tracking-[0.22em] border"
              style={{ borderColor: tan, color: cream }}
            >
              <Phone className="h-4 w-4" /> {t("call_btn")}
            </Link>
          </div>
        </div>
      </section>

      {/* 2 · INTRO */}
      <section style={{ backgroundColor: cream, color: nearBlack }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <p className="text-[11px] uppercase tracking-[0.22em] text-black/50">
            {t("intro_eyebrow")}
          </p>
          <h2 className="mt-5 text-4xl md:text-5xl leading-[1.1] max-w-3xl">
            {t("intro_heading_pt1")}{" "}
            <span className="italic text-black/60">{t("intro_heading_em")}</span>
          </h2>
          <div className="mt-14 grid md:grid-cols-2 gap-12 md:gap-16 text-base md:text-lg leading-relaxed text-black/75">
            <p>{t("intro_p1")}</p>
            <p>{t("intro_p2")}</p>
          </div>
        </div>
      </section>

      {/* 3 · INCLUDED */}
      <section style={{ backgroundColor: deepForest, color: cream }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="flex items-end justify-between flex-wrap gap-6">
            <div>
              <p
                className="text-[11px] uppercase tracking-[0.22em]"
                style={{ color: tan }}
              >
                {t("equip_eyebrow")}
              </p>
              <h2 className="mt-5 text-4xl md:text-5xl leading-[1.1]">
                {t("equip_heading_pt1")}{" "}
                <span className="italic" style={{ color: tan }}>
                  {t("equip_heading_em")}
                </span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/60">
              {t("equip_note")}
            </p>
          </div>

          <div
            className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l"
            style={{ borderColor: "rgba(230,217,184,0.2)" }}
          >
            {included.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-8 md:p-10 border-r border-b"
                style={{ borderColor: "rgba(230,217,184,0.2)" }}
              >
                <Icon className="h-6 w-6" style={{ color: tan }} />
                <h3 className="mt-6 text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · TWO FORMATS */}
      <section style={{ backgroundColor: cream, color: nearBlack }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <p className="text-[11px] uppercase tracking-[0.22em] text-black/50">
            {t("formats_eyebrow")}
          </p>
          <h2 className="mt-5 text-4xl md:text-5xl leading-[1.1] max-w-3xl">
            {t("formats_heading_pt1")}{" "}
            <span className="italic text-black/60">{t("formats_heading_em")}</span>
          </h2>

          <div className="mt-16 grid md:grid-cols-2 gap-10">
            {formats.map((f) => (
              <article
                key={f.tag}
                className="p-10 md:p-12 border"
                style={{
                  borderColor: "rgba(15,31,24,0.18)",
                  backgroundColor: surface,
                }}
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-black/50">
                    {t("fmt_tag_prefix")} {f.tag}
                  </span>
                  <Flame className="h-5 w-5 text-black/40" />
                </div>
                <h3 className="mt-8 text-3xl md:text-4xl leading-tight">{f.title}</h3>
                <p className="mt-6 text-base leading-relaxed text-black/70">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5 · LOCATION */}
      <section style={{ backgroundColor: deepForest, color: cream }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/restaurant/exterior_summer_terrace_water.jpg"
                alt={t("location_img_alt")}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p
                className="text-[11px] uppercase tracking-[0.22em]"
                style={{ color: tan }}
              >
                {t("location_eyebrow")}
              </p>
              <h2 className="mt-5 text-4xl md:text-5xl leading-[1.1]">
                {t("location_heading_pt1")}{" "}
                <span className="italic" style={{ color: tan }}>
                  {t("location_heading_em")}
                </span>
              </h2>
              <p className="mt-8 text-lg leading-relaxed text-white/75">
                {t("location_body")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 · ADDONS */}
      <section style={{ backgroundColor: cream, color: nearBlack }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <p className="text-[11px] uppercase tracking-[0.22em] text-black/50">
            {t("addons_eyebrow")}
          </p>
          <h2 className="mt-5 text-4xl md:text-5xl leading-[1.1] max-w-3xl">
            {t("addons_heading_pt1")}{" "}
            <span className="italic text-black/60">{t("addons_heading_em")}</span>
          </h2>

          <ul className="mt-16">
            {addons.map((a, i) => (
              <li
                key={a}
                className="py-6 md:py-8 flex items-center gap-8 border-t last:border-b"
                style={{ borderColor: "rgba(15,31,24,0.15)" }}
              >
                <span className="text-xs tabular-nums text-black/40 w-10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-lg md:text-xl text-black/80">{a}</span>
                <Utensils className="h-4 w-4 ml-auto text-black/30" />
              </li>
            ))}
          </ul>

          <p className="mt-16 max-w-2xl text-base leading-relaxed text-black/65">
            {t("addons_pricing")}
          </p>
        </div>
      </section>

      {/* 7 · RULES */}
      <section style={{ backgroundColor: surface, color: nearBlack }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-black/50">
                {t("rules_eyebrow")}
              </p>
              <h2 className="mt-5 text-4xl md:text-5xl leading-[1.1]">
                {t("rules_heading_pt1")}{" "}
                <span className="italic text-black/60">{t("rules_heading_em")}</span>
              </h2>
            </div>
            <ol className="space-y-0">
              {rules.map((r, i) => (
                <li
                  key={r}
                  className="flex items-start gap-6 py-6 border-b"
                  style={{ borderColor: "rgba(15,31,24,0.18)" }}
                >
                  <span className="text-xs tabular-nums text-black/40 pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg md:text-xl text-black/80 leading-snug">
                    {r}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 8 · CTA */}
      <section
        style={{ backgroundColor: nearBlack, color: cream }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/images/restaurant/hall_terrace.jpg"
            alt=""
            fill
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(11,20,16,0.7) 0%, rgba(11,20,16,0.95) 100%)",
            }}
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-36 text-center">
          <p
            className="text-[11px] uppercase tracking-[0.22em]"
            style={{ color: tan }}
          >
            {t("cta_eyebrow")}
          </p>
          <h2 className="mt-6 text-4xl md:text-6xl leading-[1.05]">
            {t("cta_heading_pt1")}{" "}
            <span className="italic" style={{ color: tan }}>
              {t("cta_heading_em")}
            </span>
          </h2>
          <p
            className="mt-8 max-w-xl mx-auto text-base md:text-lg leading-relaxed"
            style={{ color: "#cfc6ae" }}
          >
            {t("cta_body")}
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
            <BookingButton
              className="inline-flex items-center gap-2 px-10 py-4 text-sm uppercase tracking-[0.22em]"
              style={{ backgroundColor: cream, color: nearBlack }}
            >
              {t("cta_book")} <ArrowUpRight className="h-4 w-4" />
            </BookingButton>
          </div>
          <p
            className="mt-14 text-[11px] uppercase tracking-[0.22em] flex items-center justify-center gap-3"
            style={{ color: tan }}
          >
            <Clock className="h-4 w-4" /> {t("cta_min_rental")}
          </p>
        </div>
      </section>
    </main>
  );
}
