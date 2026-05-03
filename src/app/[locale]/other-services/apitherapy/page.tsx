import type { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import {
  Leaf,
  Flower2,
  Heart,
  Sparkles,
  Check,
  Phone,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { CONTACT_INFO } from "@/constants";
import { BookingButton } from "@/components/ui/BookingButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "other_services.apitherapy" });
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

export default async function ApitherapyPage() {
  const t = await getTranslations("other_services.apitherapy");
  const tconst = await getTranslations("constants");
  const primaryPhone = CONTACT_INFO.phone[0];
  const telHref = `tel:${primaryPhone.replace(/[^+\d]/g, "")}`;

  const BENEFITS = [
    {
      numeral: "I",
      icon: Sparkles,
      title: t("benefit_1_title"),
      description: t("benefit_1_desc"),
    },
    {
      numeral: "II",
      icon: Leaf,
      title: t("benefit_2_title"),
      description: t("benefit_2_desc"),
    },
    {
      numeral: "III",
      icon: Flower2,
      title: t("benefit_3_title"),
      description: t("benefit_3_desc"),
    },
    {
      numeral: "IV",
      icon: Heart,
      title: t("benefit_4_title"),
      description: t("benefit_4_desc"),
    },
  ];

  const INCLUDED = [
    t("included_1"),
    t("included_2"),
    t("included_3"),
    t("included_4"),
    t("included_5"),
  ];

  const CONTRAINDICATIONS = [
    t("contra_1"),
    t("contra_2"),
    t("contra_3"),
    t("contra_4"),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("jsonld_name"),
    serviceType: "Apitherapy",
    description: t("jsonld_description"),
    areaServed: "UA",
    provider: {
      "@type": "LodgingBusiness",
      name: "Глухомань",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Нижні Млини",
        addressRegion: "Полтавська область",
        addressCountry: "UA",
      },
      telephone: primaryPhone,
    },
  };

  return (
    <main className="bg-[#faf6ec] text-[#0b1410]">
      <Script
        id="apitherapy-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(jsonLd)}
      </Script>

      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-[#0b1410] text-[#faf6ec]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #e6d9b8 0, transparent 40%), radial-gradient(circle at 80% 70%, #e6d9b8 0, transparent 40%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="flex flex-col items-center text-center">
            <div className="mb-10 flex h-24 w-24 items-center justify-center rounded-full border border-[#e6d9b8]/30 bg-[#1a3d2e]">
              <Leaf className="h-10 w-10 text-[#e6d9b8]" strokeWidth={1.25} />
            </div>
            <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#e6d9b8]">
              {t("hero_eyebrow")}
            </p>
            <h1 className="font-display mt-6 text-5xl md:text-7xl text-[#faf6ec]">
              {t("hero_title")}
            </h1>
            <p className="font-display mt-3 text-2xl md:text-3xl italic text-[#e6d9b8]">
              {t("hero_subtitle")}
            </p>
            <p className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-[#faf6ec]/80">
              {t("hero_body")}
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center gap-5">
              <a
                href={telHref}
                className="inline-flex items-center gap-3 border border-[#e6d9b8]/40 px-8 py-4 text-sm uppercase tracking-[0.18em] text-[#faf6ec] transition-colors hover:bg-[#1a3d2e]"
              >
                <Phone className="h-4 w-4" strokeWidth={1.5} />
                {primaryPhone}
              </a>
              <Link
                href="#about"
                className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-[#e6d9b8] transition-colors hover:text-[#faf6ec]"
              >
                {t("hero_learn_more")}
                <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT */}
      <section id="about" className="bg-[#faf6ec]">
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid gap-16 md:grid-cols-2 md:gap-20">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]">
                {t("about_eyebrow")}
              </p>
              <h2 className="font-display mt-5 text-4xl md:text-5xl text-[#0f1f18]">
                {t("about_heading_pt1")}
                <span className="italic"> {t("about_heading_em")} </span>
                {t("about_heading_pt2")}
              </h2>
              <div className="mt-8 h-px w-16 bg-[#e6d9b8]" />
            </div>
            <div>
              <p className="text-base md:text-lg leading-relaxed text-[#0b1410]/80">
                {t("about_body")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BENEFITS */}
      <section className="bg-[#0f1f18] text-[#faf6ec]">
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#e6d9b8]">
              {t("benefits_eyebrow")}
            </p>
            <h2 className="font-display mt-5 text-4xl md:text-5xl">
              {t("benefits_heading_pt1")}{" "}
              <span className="italic">{t("benefits_heading_em")}</span>
            </h2>
          </div>
          <div className="mt-16 grid gap-px bg-[#e6d9b8]/20 md:grid-cols-2">
            {BENEFITS.map(({ numeral, icon: Icon, title, description }) => (
              <div key={title} className="bg-[#0f1f18] p-10 md:p-12">
                <div className="flex items-start justify-between">
                  <Icon className="h-7 w-7 text-[#e6d9b8]" strokeWidth={1.25} />
                  <span className="font-display text-2xl italic text-[#e6d9b8]/60">
                    {numeral}
                  </span>
                </div>
                <h3 className="font-display mt-10 text-2xl md:text-3xl text-[#faf6ec]">
                  {title}
                </h3>
                <p className="mt-4 text-sm md:text-base leading-relaxed text-[#faf6ec]/70">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. INCLUDED */}
      <section className="bg-[#faf6ec]">
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid gap-16 md:grid-cols-2 md:gap-20">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]">
                {t("included_eyebrow")}
              </p>
              <h2 className="font-display mt-5 text-4xl md:text-5xl text-[#0f1f18]">
                {t("included_heading_pt1")}{" "}
                <span className="italic">{t("included_heading_em")}</span>
              </h2>
              <div className="mt-8 h-px w-16 bg-[#e6d9b8]" />
              <p className="mt-8 text-base leading-relaxed text-[#0b1410]/70">
                {t("included_body")}
              </p>
            </div>
            <ul className="space-y-6">
              {INCLUDED.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-5 border-b border-[#e6d9b8] pb-6"
                >
                  <span className="mt-1 flex h-6 w-6 flex-none items-center justify-center border border-[#1a3d2e]/30 bg-[#f4ecd8]">
                    <Check className="h-3.5 w-3.5 text-[#1a3d2e]" strokeWidth={2} />
                  </span>
                  <span className="text-base md:text-lg leading-relaxed text-[#0b1410]/85">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. CONTRAINDICATIONS */}
      <section className="bg-[#faf6ec]">
        <div className="max-w-6xl mx-auto px-6 pb-28 md:pb-36">
          <div className="border-l-2 border-[#1a3d2e]/40 bg-[#f4ecd8] px-8 py-10 md:px-12 md:py-14">
            <div className="flex items-start gap-4">
              <AlertCircle
                className="mt-1 h-5 w-5 flex-none text-[#1a3d2e]"
                strokeWidth={1.5}
              />
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]">
                  {t("contra_eyebrow")}
                </p>
                <h2 className="font-display mt-4 text-3xl md:text-4xl text-[#0f1f18]">
                  {t("contra_heading_pt1")}{" "}
                  <span className="italic">{t("contra_heading_em")}</span>
                </h2>
                <p className="mt-5 max-w-xl text-sm md:text-base leading-relaxed text-[#0b1410]/70">
                  {t("contra_intro")}
                </p>
                <ul className="mt-8 space-y-3">
                  {CONTRAINDICATIONS.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm md:text-base text-[#0b1410]/80"
                    >
                      <span className="mt-2 h-1 w-1 flex-none bg-[#1a3d2e]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT GOES */}
      <section className="bg-[#0f1f18] text-[#faf6ec]">
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid items-center gap-16 md:grid-cols-2 md:gap-20">
            <div className="relative order-2 md:order-1">
              <div
                className="relative aspect-[4/5] overflow-hidden bg-[#1a3d2e]"
                style={{ borderRadius: "62% 38% 54% 46% / 48% 55% 45% 52%" }}
              >
                <Image
                  src="/images/sauna/honey_jar_gluhoman.jpg"
                  alt={t("how_img_alt")}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#e6d9b8]">
                {t("how_eyebrow")}
              </p>
              <h2 className="font-display mt-5 text-4xl md:text-5xl">
                {t("how_heading_pt1")}{" "}
                <span className="italic">{t("how_heading_em")}</span>{" "}
                {t("how_heading_pt2")}
              </h2>
              <div className="mt-8 h-px w-16 bg-[#e6d9b8]/50" />
              <p className="mt-8 text-base md:text-lg leading-relaxed text-[#faf6ec]/80">
                {t("how_body")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PRICING */}
      <section className="bg-[#faf6ec]">
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]">
              {t("pricing_eyebrow")}
            </p>
            <h2 className="font-display mt-5 text-5xl md:text-6xl text-[#0f1f18]">
              {t("pricing_heading_pt1")}{" "}
              <span className="italic">{t("pricing_heading_em")}</span>
            </h2>
            <div className="mx-auto mt-8 h-px w-16 bg-[#e6d9b8]" />
            <p className="mt-8 text-base md:text-lg leading-relaxed text-[#0b1410]/75">
              {t("pricing_body")}
            </p>
            <a
              href={telHref}
              className="mt-12 inline-flex items-center gap-3 border border-[#0f1f18] px-8 py-4 text-sm uppercase tracking-[0.18em] text-[#0f1f18] transition-colors hover:bg-[#0f1f18] hover:text-[#faf6ec]"
            >
              <Phone className="h-4 w-4" strokeWidth={1.5} />
              {primaryPhone}
            </a>
          </div>
        </div>
      </section>

      {/* 8. CONTACT & BOOKING */}
      <section className="bg-[#0b1410] text-[#faf6ec]">
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid gap-16 md:grid-cols-2 md:gap-20">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#e6d9b8]">
                {t("contact_eyebrow")}
              </p>
              <h2 className="font-display mt-5 text-4xl md:text-5xl">
                {t("contact_heading_pt1")}{" "}
                <span className="italic">{t("contact_heading_em")}</span>
              </h2>
              <div className="mt-8 h-px w-16 bg-[#e6d9b8]/50" />
              <p className="mt-8 text-base leading-relaxed text-[#faf6ec]/75">
                {t("contact_body")}
              </p>
            </div>
            <div className="space-y-10">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]/70">
                  {t("cta_phone_label")}
                </p>
                <div className="mt-4 space-y-2">
                  {CONTACT_INFO.phone.map((p) => (
                    <a
                      key={p}
                      href={`tel:${p.replace(/[^+\d]/g, "")}`}
                      className="block font-display text-2xl md:text-3xl text-[#faf6ec] transition-colors hover:text-[#e6d9b8]"
                    >
                      {p}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]/70">
                  {t("cta_hours_label")}
                </p>
                <p className="mt-4 font-display text-xl italic text-[#faf6ec]/90">
                  {tconst('working_hours')}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]/70">
                  {t("cta_address_label")}
                </p>
                <p className="mt-4 text-base text-[#faf6ec]/85">
                  {tconst('address')}
                </p>
              </div>
              <div className="pt-4">
                <BookingButton
                  service="hotel"
                  className="inline-flex items-center gap-3 border border-[#e6d9b8] bg-[#e6d9b8] px-8 py-4 text-sm uppercase tracking-[0.18em] text-[#0f1f18] transition-colors hover:bg-transparent hover:text-[#faf6ec]"
                >
                  {t("book_visit")}
                  <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                </BookingButton>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
