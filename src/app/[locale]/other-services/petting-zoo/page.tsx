import type { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import { CONTACT_INFO } from "@/constants";
import {
  Cat,
  Rabbit,
  Feather,
  Baby,
  Heart,
  AlertCircle,
  Clock,
  Phone,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "other_services.petting_zoo" });
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

export default async function PettingZooPage() {
  const t = await getTranslations("other_services.petting_zoo");

  const residents = [
    { icon: Cat,     name: t("res_1_name"), desc: t("res_1_desc") },
    { icon: Rabbit,  name: t("res_2_name"), desc: t("res_2_desc") },
    { icon: Feather, name: t("res_3_name"), desc: t("res_3_desc") },
    { icon: Feather, name: t("res_4_name"), desc: t("res_4_desc") },
    { icon: Heart,   name: t("res_5_name"), desc: t("res_5_desc") },
    { icon: Baby,    name: t("res_6_name"), desc: t("res_6_desc") },
  ];

  const allowed = [
    t("allow_1"),
    t("allow_2"),
    t("allow_3"),
    t("allow_4"),
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
    serviceType: "Petting Zoo",
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
  });

  return (
    <main style={{ backgroundColor: CREAM }} className="font-sans">
      <Script id="petting-zoo-jsonld" type="application/ld+json">
        {jsonLd}
      </Script>

      {/* 1. HERO */}
      <section
        style={{ backgroundColor: DEEP, color: CREAM }}
        className="py-28 md:py-36"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-[1fr_auto] gap-12 items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] opacity-70">
                {t("hero_eyebrow")}
              </p>
              <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mt-6">
                {t("hero_title")}
                <br />
                <span className="italic opacity-80">{t("hero_title_em")}</span>
              </h1>
              <p
                className="mt-8 text-lg md:text-xl max-w-xl leading-relaxed opacity-80"
                style={{ color: SURFACE }}
              >
                {t("hero_body")}
              </p>
              <div className="mt-12 flex items-center gap-6">
                <div
                  className="h-px w-16"
                  style={{ backgroundColor: TAN, opacity: 0.4 }}
                />
                <span className="text-[11px] uppercase tracking-[0.22em] opacity-60">
                  {t("hero_hours")}
                </span>
              </div>
            </div>
            <div className="hidden md:block">
              <div
                className="relative w-72 h-72 overflow-hidden"
                style={{ backgroundColor: FOREST }}
              >
                <Image
                  src="/images/restaurant/peacock_aviary_zhar_ptytsi.jpg"
                  alt={t("hero_img_alt")}
                  fill
                  className="object-cover opacity-90"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INTRO */}
      <section
        style={{ backgroundColor: CREAM, color: NEAR_BLACK }}
        className="py-28 md:py-36"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="text-[11px] uppercase tracking-[0.22em] opacity-60">
                {t("intro_eyebrow")}
              </p>
              <h2 className="font-display text-4xl md:text-5xl mt-6 leading-[1.1]">
                {t("intro_heading_pt1")}
                <br />
                <span className="italic">{t("intro_heading_em")}</span>
              </h2>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <p className="text-lg md:text-xl leading-relaxed opacity-85">
                {t("intro_body")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. RESIDENTS */}
      <section
        style={{ backgroundColor: DEEP, color: CREAM }}
        className="py-28 md:py-36"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-16">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] opacity-60">
                {t("residents_eyebrow")}
              </p>
              <h2 className="font-display text-4xl md:text-5xl mt-6 leading-[1.1]">
                {t("residents_heading_pt1")}{" "}
                <span className="italic">{t("residents_heading_em")}</span>
              </h2>
            </div>
            <p className="text-sm opacity-60 max-w-xs">
              {t("residents_note")}
            </p>
          </div>

          <div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-px"
            style={{ backgroundColor: "rgba(230, 217, 184, 0.15)" }}
          >
            {residents.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.name}
                  style={{ backgroundColor: DEEP }}
                  className="p-10"
                >
                  <div
                    className="w-12 h-12 flex items-center justify-center"
                    style={{ border: `1px solid ${TAN}`, color: TAN }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-2xl mt-8">{r.name}</h3>
                  <p className="mt-4 text-sm leading-relaxed opacity-70">{r.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. WHAT YOU CAN DO */}
      <section
        style={{ backgroundColor: CREAM, color: NEAR_BLACK }}
        className="py-28 md:py-36"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <p className="text-[11px] uppercase tracking-[0.22em] opacity-60">
                {t("allowed_eyebrow")}
              </p>
              <h2 className="font-display text-4xl md:text-5xl mt-6 leading-[1.1]">
                {t("allowed_heading_pt1")}{" "}
                <span className="italic">{t("allowed_heading_em")}</span>
              </h2>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <ul>
                {allowed.map((a, i) => (
                  <li
                    key={a}
                    className="py-6 flex items-start gap-6"
                    style={{
                      borderTop: `1px solid ${TAN}`,
                      borderBottom:
                        i === allowed.length - 1 ? `1px solid ${TAN}` : undefined,
                    }}
                  >
                    <span className="font-display text-2xl opacity-40 w-8">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg leading-relaxed opacity-85 flex-1">{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. RULES */}
      <section
        style={{ backgroundColor: SURFACE, color: NEAR_BLACK }}
        className="py-28 md:py-36"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <div
                className="w-12 h-12 flex items-center justify-center"
                style={{ border: `1px solid ${FOREST}`, color: FOREST }}
              >
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="text-[11px] uppercase tracking-[0.22em] opacity-60 mt-8">
                {t("rules_eyebrow")}
              </p>
              <h2 className="font-display text-4xl md:text-5xl mt-6 leading-[1.1]">
                {t("rules_heading_pt1")}{" "}
                <span className="italic">{t("rules_heading_em")}</span>
              </h2>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <ul>
                {rules.map((rule, i) => (
                  <li
                    key={rule}
                    className="py-5 flex items-start gap-5"
                    style={{
                      borderTop: `1px solid ${TAN}`,
                      borderBottom:
                        i === rules.length - 1 ? `1px solid ${TAN}` : undefined,
                    }}
                  >
                    <span
                      className="mt-2 w-1.5 h-1.5"
                      style={{ backgroundColor: FOREST }}
                    />
                    <span className="text-base md:text-lg leading-relaxed opacity-85 flex-1">
                      {rule}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SCHEDULE & PRICES */}
      <section
        style={{ backgroundColor: DEEP, color: CREAM }}
        className="py-28 md:py-36"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <div
                className="w-12 h-12 flex items-center justify-center"
                style={{ border: `1px solid ${TAN}`, color: TAN }}
              >
                <Clock className="w-5 h-5" />
              </div>
              <p className="text-[11px] uppercase tracking-[0.22em] opacity-60 mt-8">
                {t("schedule_eyebrow")}
              </p>
              <h3 className="font-display text-3xl md:text-4xl mt-4 leading-tight">
                {t("schedule_heading")}{" "}
                <span className="italic">{t("schedule_heading_em")}</span>
              </h3>
              <p className="mt-6 text-base md:text-lg leading-relaxed opacity-80">
                {t("schedule_body")}
              </p>
            </div>
            <div>
              <div
                className="w-12 h-12 flex items-center justify-center"
                style={{ border: `1px solid ${TAN}`, color: TAN }}
              >
                <Heart className="w-5 h-5" />
              </div>
              <p className="text-[11px] uppercase tracking-[0.22em] opacity-60 mt-8">
                {t("prices_eyebrow")}
              </p>
              <h3 className="font-display text-3xl md:text-4xl mt-4 leading-tight">
                {t("prices_heading")}{" "}
                <span className="italic">{t("prices_heading_em")}</span>
              </h3>
              <p className="mt-6 text-base md:text-lg leading-relaxed opacity-80">
                {t("prices_body")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CTA */}
      <section
        style={{ backgroundColor: CREAM, color: NEAR_BLACK }}
        className="py-28 md:py-36"
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] opacity-60">
            {t("cta_eyebrow")}
          </p>
          <h2 className="font-display text-5xl md:text-6xl mt-6 leading-[1.05]">
            {t("cta_heading_pt1")}{" "}
            <span className="italic">{t("cta_heading_em")}</span>
          </h2>
          <p className="mt-8 text-lg md:text-xl leading-relaxed opacity-80 max-w-2xl mx-auto">
            {t("cta_body")}
          </p>
          <div className="mt-12 inline-flex items-center gap-4">
            <div
              className="h-px w-12"
              style={{ backgroundColor: FOREST, opacity: 0.4 }}
            />
            <Link
              href={`tel:${CONTACT_INFO.phone[0].replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-3 px-8 py-4 text-sm uppercase tracking-[0.18em]"
              style={{ backgroundColor: FOREST, color: CREAM }}
            >
              <Phone className="w-4 h-4" />
              {CONTACT_INFO.phone[0]}
            </Link>
            <div
              className="h-px w-12"
              style={{ backgroundColor: FOREST, opacity: 0.4 }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
