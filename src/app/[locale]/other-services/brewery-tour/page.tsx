import type { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import {
  Beer,
  Droplets,
  Users,
  Wine,
  Clock,
  Factory,
  Phone,
  ArrowUpRight,
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
  const t = await getTranslations({ locale, namespace: "other_services.brewery_tour" });
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
          url: "/images/restaurant/craft_beer_glasses_snacks.jpg",
          width: 1200,
          height: 630,
          alt: t("meta_og_image_alt"),
        },
      ],
    },
  };
}

export default async function BreweryTourPage() {
  const t = await getTranslations("other_services.brewery_tour");
  const tconst = await getTranslations("constants");
  const primaryPhone = CONTACT_INFO.phone[0];
  const telHref = `tel:${primaryPhone.replace(/[^+\d]/g, "")}`;

  const INCLUDED = [
    { numeral: "I",  icon: Factory, title: t("incl_1_title"), description: t("incl_1_desc") },
    { numeral: "II", icon: Wine,    title: t("incl_2_title"), description: t("incl_2_desc") },
    { numeral: "III",icon: Beer,    title: t("incl_3_title"), description: t("incl_3_desc") },
    { numeral: "IV", icon: Users,   title: t("incl_4_title"), description: t("incl_4_desc") },
  ];

  const BEERS = [
    { name: t("beer_1_name"), abv: t("beer_1_abv"), description: t("beer_1_desc") },
    { name: t("beer_2_name"), abv: t("beer_2_abv"), description: t("beer_2_desc") },
    { name: t("beer_3_name"), abv: t("beer_3_abv"), description: t("beer_3_desc") },
    { name: t("beer_4_name"), abv: t("beer_4_abv"), description: t("beer_4_desc") },
  ];

  const PROCESS = [
    { step: t("proc_1_step"), title: t("proc_1_title"), description: t("proc_1_desc") },
    { step: t("proc_2_step"), title: t("proc_2_title"), description: t("proc_2_desc") },
    { step: t("proc_3_step"), title: t("proc_3_title"), description: t("proc_3_desc") },
  ];

  const RULES = [
    { title: t("rule_1_title"), description: t("rule_1_desc") },
    { title: t("rule_2_title"), description: t("rule_2_desc") },
    { title: t("rule_3_title"), description: t("rule_3_desc") },
    { title: t("rule_4_title"), description: t("rule_4_desc") },
  ];

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("jsonld_name"),
    serviceType: "Brewery Tour",
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
  });

  return (
    <main className="bg-[#faf6ec] text-[#0b1410]">
      <Script
        id="brewery-tour-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {jsonLd}
      </Script>

      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-[#0b1410] text-[#faf6ec]">
        <Image
          src="/images/restaurant/craft_beer_glasses_snacks.jpg"
          alt={t("hero_img_alt")}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0b1410]/70 via-[#0b1410]/40 to-[#0b1410]/90"
        />
        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="flex flex-col items-center text-center">
            <div className="mb-10 flex h-24 w-24 items-center justify-center border border-[#e6d9b8]/30 bg-[#1a3d2e]/70">
              <Beer className="h-10 w-10 text-[#e6d9b8]" strokeWidth={1.25} />
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
            <p className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-[#faf6ec]/85">
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
                {t("about_heading_pt1")}{" "}
                <span className="italic">{t("about_heading_em")}</span>{" "}
                {t("about_heading_pt2")}
              </h2>
              <div className="mt-8 h-px w-16 bg-[#e6d9b8]" />
              <div className="mt-10 relative aspect-[4/5] overflow-hidden bg-[#1a3d2e]">
                <Image
                  src="/images/restaurant/about_craft_beer.jpg"
                  alt={t("about_img_alt")}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-6">
              <p className="text-base md:text-lg leading-relaxed text-[#0b1410]/80">
                {t("about_p1")}
              </p>
              <p className="text-base md:text-lg leading-relaxed text-[#0b1410]/80">
                {t("about_p2")}
              </p>
              <div className="pt-6 grid grid-cols-2 gap-px bg-[#e6d9b8]">
                <div className="bg-[#faf6ec] p-6">
                  <Droplets className="h-6 w-6 text-[#1a3d2e]" strokeWidth={1.25} />
                  <p className="font-display mt-4 text-xl text-[#0f1f18]">
                    {t("about_stat_1")}
                  </p>
                </div>
                <div className="bg-[#faf6ec] p-6">
                  <Factory className="h-6 w-6 text-[#1a3d2e]" strokeWidth={1.25} />
                  <p className="font-display mt-4 text-xl text-[#0f1f18]">
                    {t("about_stat_2")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INCLUDED */}
      <section className="bg-[#0f1f18] text-[#faf6ec]">
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#e6d9b8]">
              {t("included_eyebrow")}
            </p>
            <h2 className="font-display mt-5 text-4xl md:text-5xl">
              {t("included_heading_pt1")}{" "}
              <span className="italic">{t("included_heading_em")}</span>{" "}
              {t("included_heading_pt2")}
            </h2>
          </div>
          <div className="mt-16 grid gap-px bg-[#e6d9b8]/20 md:grid-cols-2">
            {INCLUDED.map(({ numeral, icon: Icon, title, description }) => (
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

      {/* 4. BEERS */}
      <section className="bg-[#faf6ec]">
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid gap-16 md:grid-cols-12 md:gap-20">
            <div className="md:col-span-4">
              <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]">
                {t("beers_eyebrow")}
              </p>
              <h2 className="font-display mt-5 text-4xl md:text-5xl text-[#0f1f18]">
                {t("beers_heading_pt1")}{" "}
                <span className="italic">{t("beers_heading_em")}</span>
              </h2>
              <div className="mt-8 h-px w-16 bg-[#e6d9b8]" />
              <div
                className="mt-10 relative aspect-square overflow-hidden bg-[#1a3d2e]"
                style={{ borderRadius: "62% 38% 54% 46% / 48% 55% 45% 52%" }}
              >
                <Image
                  src="/images/sauna/craft_beer_coffee_table.jpg"
                  alt={t("beers_img_alt")}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-8 grid gap-px bg-[#e6d9b8] sm:grid-cols-2">
              {BEERS.map((beer) => (
                <div key={beer.name} className="bg-[#faf6ec] p-8 md:p-10">
                  <Wine className="h-6 w-6 text-[#1a3d2e]" strokeWidth={1.25} />
                  <h3 className="font-display mt-6 text-2xl md:text-3xl text-[#0f1f18]">
                    {beer.name}
                  </h3>
                  <p className="font-display mt-2 text-sm italic text-[#1a3d2e]">
                    {beer.abv}
                  </p>
                  <div className="mt-6 h-px w-10 bg-[#e6d9b8]" />
                  <p className="mt-6 text-sm md:text-base leading-relaxed text-[#0b1410]/75">
                    {beer.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROCESS */}
      <section className="bg-[#0f1f18] text-[#faf6ec]">
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid items-start gap-16 md:grid-cols-12 md:gap-20">
            <div className="md:col-span-4">
              <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#e6d9b8]">
                {t("process_eyebrow")}
              </p>
              <h2 className="font-display mt-5 text-4xl md:text-5xl">
                {t("process_heading_pt1")}{" "}
                <span className="italic">{t("process_heading_em")}</span>
              </h2>
              <div className="mt-8 h-px w-16 bg-[#e6d9b8]/50" />
              <p className="mt-8 text-sm md:text-base leading-relaxed text-[#faf6ec]/75">
                {t("process_note")}
              </p>
            </div>
            <div className="md:col-span-8 space-y-12">
              {PROCESS.map((p) => (
                <div
                  key={p.step}
                  className="grid grid-cols-12 gap-6 border-b border-[#e6d9b8]/20 pb-12 last:border-b-0 last:pb-0"
                >
                  <div className="col-span-2">
                    <p className="font-display text-4xl md:text-5xl italic text-[#e6d9b8]/60">
                      {p.step}
                    </p>
                  </div>
                  <div className="col-span-10">
                    <h3 className="font-display text-2xl md:text-3xl text-[#faf6ec]">
                      {p.title}
                    </h3>
                    <p className="mt-4 text-sm md:text-base leading-relaxed text-[#faf6ec]/75">
                      {p.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. FORMAT */}
      <section className="bg-[#faf6ec]">
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid gap-16 md:grid-cols-2 md:gap-20">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]">
                {t("format_eyebrow")}
              </p>
              <h2 className="font-display mt-5 text-4xl md:text-5xl text-[#0f1f18]">
                {t("format_heading_pt1")}{" "}
                <span className="italic">{t("format_heading_em")}</span>
              </h2>
              <div className="mt-8 h-px w-16 bg-[#e6d9b8]" />
              <p className="mt-8 text-base md:text-lg leading-relaxed text-[#0b1410]/80">
                {t("format_body")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-[#e6d9b8] self-start">
              <div className="bg-[#f4ecd8] p-8 md:p-10">
                <Clock className="h-6 w-6 text-[#1a3d2e]" strokeWidth={1.25} />
                <p className="font-display mt-6 text-4xl md:text-5xl text-[#0f1f18]">90</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]">
                  {t("stat_1_label")}
                </p>
              </div>
              <div className="bg-[#f4ecd8] p-8 md:p-10">
                <Wine className="h-6 w-6 text-[#1a3d2e]" strokeWidth={1.25} />
                <p className="font-display mt-6 text-4xl md:text-5xl text-[#0f1f18]">4</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]">
                  {t("stat_2_label")}
                </p>
              </div>
              <div className="bg-[#f4ecd8] p-8 md:p-10">
                <Users className="h-6 w-6 text-[#1a3d2e]" strokeWidth={1.25} />
                <p className="font-display mt-6 text-4xl md:text-5xl text-[#0f1f18]">4–16</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]">
                  {t("stat_3_label")}
                </p>
              </div>
              <div className="bg-[#f4ecd8] p-8 md:p-10">
                <Beer className="h-6 w-6 text-[#1a3d2e]" strokeWidth={1.25} />
                <p className="font-display mt-6 text-4xl md:text-5xl text-[#0f1f18]">18+</p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]">
                  {t("stat_4_label")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. RULES + PRICING */}
      <section className="bg-[#faf6ec]">
        <div className="max-w-6xl mx-auto px-6 pb-28 md:pb-36">
          <div className="grid gap-16 md:grid-cols-2 md:gap-20">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]">
                {t("rules_eyebrow")}
              </p>
              <h2 className="font-display mt-5 text-4xl md:text-5xl text-[#0f1f18]">
                {t("rules_heading_pt1")}{" "}
                <span className="italic">{t("rules_heading_em")}</span>
              </h2>
              <div className="mt-8 h-px w-16 bg-[#e6d9b8]" />
              <ul className="mt-10 space-y-6">
                {RULES.map((rule) => (
                  <li
                    key={rule.title}
                    className="flex items-start gap-5 border-b border-[#e6d9b8] pb-6"
                  >
                    <span className="mt-2 h-1 w-6 flex-none bg-[#1a3d2e]" />
                    <div>
                      <p className="font-display text-xl text-[#0f1f18]">{rule.title}</p>
                      <p className="mt-1 text-sm md:text-base text-[#0b1410]/70">
                        {rule.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]">
                {t("prices_eyebrow")}
              </p>
              <h2 className="font-display mt-5 text-4xl md:text-5xl text-[#0f1f18]">
                {t("prices_heading_pt1")}{" "}
                <span className="italic">{t("prices_heading_em")}</span>
              </h2>
              <div className="mt-8 h-px w-16 bg-[#e6d9b8]" />
              <p className="mt-8 text-base md:text-lg leading-relaxed text-[#0b1410]/80">
                {t("prices_body")}
              </p>
              <div className="mt-10 relative aspect-[4/3] overflow-hidden bg-[#1a3d2e]">
                <Image
                  src="/images/sauna/craft_beer_roasted_chicken.jpg"
                  alt={t("prices_img_alt")}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <section className="relative overflow-hidden bg-[#0b1410] text-[#faf6ec]">
        <Image
          src="/images/restaurant/bar_rustic_tree_trunk.jpg"
          alt={t("cta_bar_img_alt")}
          fill
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[#0b1410]/70"
        />
        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid gap-16 md:grid-cols-2 md:gap-20">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#e6d9b8]">
                {t("cta_eyebrow")}
              </p>
              <h2 className="font-display mt-5 text-4xl md:text-5xl">
                {t("cta_heading_pt1")}{" "}
                <span className="italic">{t("cta_heading_em")}</span>{" "}
                {t("cta_heading_pt2")}
              </h2>
              <div className="mt-8 h-px w-16 bg-[#e6d9b8]/50" />
              <p className="mt-8 text-base leading-relaxed text-[#faf6ec]/80">
                {t("cta_body")}
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
                  {t("cta_book")}
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
