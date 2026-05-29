import type { Metadata } from "next";
import { Phone, Mail, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { CONTACT_INFO } from "@/constants";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.og_title"),
      description: t("meta.og_description"),
      type: "article",
      locale: locale === "uk" ? "uk_UA" : "en_US",
    },
    twitter: {
      card: "summary",
      title: t("meta.twitter_title"),
      description: t("meta.twitter_description"),
    },
    robots: { index: true, follow: true },
  };
}

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

function SectionHeading({
  numeral,
  title,
}: {
  numeral: string;
  title: string;
}) {
  return (
    <header className="mb-6">
      <div className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/60 mb-3">
        {numeral}
      </div>
      <h2 className="font-display text-3xl md:text-4xl text-[#1a3d2e] leading-tight">
        {title}
      </h2>
    </header>
  );
}

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");

  return (
    <main className="min-h-[100svh] bg-[#faf6ec]">
      {/* Editorial hero */}
      <section className="pt-28 md:pt-36 pb-24 bg-[#faf6ec]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e] mb-6">
            {t("hero.eyebrow")}
          </div>
          <h1 className="font-display text-5xl md:text-6xl text-[#1a3d2e] leading-[1.05] mb-5">
            {t("hero.title")}
          </h1>
          <p className="font-display italic text-xl md:text-2xl text-[#1a3d2e]/70 mb-8">
            {t("hero.subtitle")}
          </p>
          <p className="text-xs uppercase tracking-[0.18em] text-[#1a3d2e]/40">
            {t("hero.last_updated_label", { date: t("last_updated_date") })}
          </p>
        </div>
      </section>

      {/* Main editorial column */}
      <section className="py-20 md:py-28 bg-[#faf6ec]">
        <article className="max-w-3xl mx-auto px-6 text-[#0f1f18]/80 leading-relaxed">
          <section>
            <SectionHeading numeral={ROMAN[0]} title={t("section_1.heading")} />
            <p>{t("section_1.body_p1")}</p>
            <p className="mt-4">{t("section_1.body_p2")}</p>
          </section>

          <section className="border-t border-[#e6d9b8]/60 pt-12 mt-12">
            <SectionHeading numeral={ROMAN[1]} title={t("section_2.heading")} />
            <p>{t("section_2.intro")}</p>
            <ul className="mt-5 space-y-3 list-none">
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>
                  <strong className="text-[#1a3d2e]">{t("section_2.contact_label")}</strong>{" "}
                  {t("section_2.contact_body")}
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>
                  <strong className="text-[#1a3d2e]">{t("section_2.technical_label")}</strong>{" "}
                  {t("section_2.technical_body")}
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>
                  <strong className="text-[#1a3d2e]">{t("section_2.analytics_label")}</strong>{" "}
                  {t("section_2.analytics_body")}
                </span>
              </li>
            </ul>
          </section>

          <section className="border-t border-[#e6d9b8]/60 pt-12 mt-12">
            <SectionHeading numeral={ROMAN[2]} title={t("section_3.heading")} />
            <p>{t("section_3.intro")}</p>
            <ul className="mt-5 space-y-3 list-none">
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>{t("section_3.item_1")}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>{t("section_3.item_2")}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>{t("section_3.item_3")}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>{t("section_3.item_4")}</span>
              </li>
            </ul>
          </section>

          <section className="border-t border-[#e6d9b8]/60 pt-12 mt-12">
            <SectionHeading numeral={ROMAN[3]} title={t("section_4.heading")} />
            <p>{t("section_4.body_p1")}</p>
            <p className="mt-4">{t("section_4.body_p2")}</p>
          </section>

          <section className="border-t border-[#e6d9b8]/60 pt-12 mt-12">
            <SectionHeading numeral={ROMAN[4]} title={t("section_5.heading")} />
            <p>{t("section_5.intro")}</p>
            <ul className="mt-5 space-y-3 list-none">
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>{t("section_5.item_1")}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>{t("section_5.item_2")}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>{t("section_5.item_3")}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>{t("section_5.item_4")}</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1 w-3 flex-none bg-[#e6d9b8]" />
                <span>{t("section_5.item_5")}</span>
              </li>
            </ul>
          </section>

          <section className="border-t border-[#e6d9b8]/60 pt-12 mt-12">
            <SectionHeading numeral={ROMAN[5]} title={t("section_6.heading")} />
            <h3 className="font-display text-xl text-[#1a3d2e]/80 mt-4 mb-3">
              {t("section_6.subheading")}
            </h3>
            <p>{t("section_6.body")}</p>
          </section>

          <section className="border-t border-[#e6d9b8]/60 pt-12 mt-12">
            <SectionHeading numeral={ROMAN[6]} title={t("section_7.heading")} />
            <p>{t("section_7.body")}</p>
          </section>
        </article>
      </section>

      {/* Deep forest contacts */}
      <section className="py-16 bg-[#0f1f18] text-[#f4ecd8]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#f4ecd8]/60 mb-4">
            {t("contacts.eyebrow")}
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-[#f4ecd8] mb-10">
            {t("contacts.heading")}
          </h2>

          <ul className="space-y-4">
            {CONTACT_INFO.phone.map((p) => (
              <li key={p} className="flex items-center gap-4">
                <Phone
                  className="w-4 h-4 text-[#e6d9b8]/70"
                  aria-hidden="true"
                />
                <a
                  href={`tel:${p.replace(/\s+/g, "")}`}
                  className="font-display text-2xl md:text-3xl tracking-wide text-[#f4ecd8] hover:text-[#e6d9b8] transition-colors"
                >
                  {p}
                </a>
              </li>
            ))}
            <li className="flex items-center gap-4 pt-2">
              <Mail
                className="w-4 h-4 text-[#e6d9b8]/70"
                aria-hidden="true"
              />
              <a
                href="mailto:hello@gluhoman.com.ua"
                className="font-display text-xl md:text-2xl tracking-wide text-[#f4ecd8] hover:text-[#e6d9b8] transition-colors"
              >
                hello@gluhoman.com.ua
              </a>
            </li>
            <li className="flex items-center gap-4 pt-2">
              <MapPin
                className="w-4 h-4 text-[#e6d9b8]/70"
                aria-hidden="true"
              />
              <span className="text-[#f4ecd8]/80 text-base">
                {CONTACT_INFO.address}
              </span>
            </li>
          </ul>
        </div>
      </section>

      {/* Back link */}
      <section className="py-12 bg-[#faf6ec]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <Link
            href="/"
            className="inline-block text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e] border-b border-[#1a3d2e]/30 hover:border-[#1a3d2e] pb-1 transition-colors"
          >
            {t("back_home")}
          </Link>
        </div>
      </section>
    </main>
  );
}
