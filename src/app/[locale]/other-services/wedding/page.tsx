import type { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import { Heart, Sparkles, MapPin, Users, Music, Camera } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { CONTACT_INFO } from "@/constants";
import { BookingButton } from "@/components/ui/BookingButton";
import { GalleryGrid } from "@/components/ui/GalleryGrid";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "other_services.wedding" });
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
          url: "/images/restaurant/exterior_summer_terrace_water.jpg",
          width: 1200,
          height: 630,
          alt: t("meta_og_image_alt"),
        },
      ],
    },
  };
}

const SHAPES = [
  "58% 42% 63% 37% / 45% 55% 45% 55%",
  "40% 60% 50% 50% / 55% 35% 65% 45%",
  "65% 35% 45% 55% / 50% 60% 40% 50%",
  "45% 55% 40% 60% / 60% 45% 55% 40%",
];

export default async function WeddingPage() {
  const t = await getTranslations("other_services.wedding");
  const phone = CONTACT_INFO.phone[0];

  const INCLUSIONS = [
    { icon: MapPin, title: t("incl_1_title"), text: t("incl_1_text") },
    { icon: Music, title: t("incl_2_title"), text: t("incl_2_text") },
    { icon: Sparkles, title: t("incl_3_title"), text: t("incl_3_text") },
    { icon: Users, title: t("incl_4_title"), text: t("incl_4_text") },
    { icon: Camera, title: t("incl_5_title"), text: t("incl_5_text") },
    { icon: Heart, title: t("incl_6_title"), text: t("incl_6_text") },
  ];

  const FORMATS = [
    { n: "01", title: t("format_1_title"), text: t("format_1_text") },
    { n: "02", title: t("format_2_title"), text: t("format_2_text") },
    { n: "03", title: t("format_3_title"), text: t("format_3_text") },
  ];

  const LOCATIONS = [
    { title: t("loc_1_title"), src: "/images/restaurant/exterior_summer_terrace_water.jpg" },
    { title: t("loc_2_title"), src: "/images/restaurant/decor_photozone_green_hedge.jpg" },
    { title: t("loc_3_title"), src: "/images/restaurant/hall_banquet.jpg" },
    { title: t("loc_4_title"), src: "/images/restaurant/event_fruit_table_terrace.jpg" },
  ];

  const GALLERY = [
    { src: "/images/restaurant/event_01.jpg", alt: t("gallery_alt_1") },
    { src: "/images/restaurant/event_02.jpg", alt: t("gallery_alt_2") },
    { src: "/images/restaurant/event_03.jpg", alt: t("gallery_alt_3") },
    { src: "/images/restaurant/event_04_music.jpg", alt: t("gallery_alt_4") },
    { src: "/images/restaurant/decor_photozone_green_hedge.jpg", alt: t("gallery_alt_5") },
    { src: "/images/restaurant/exterior_summer_terrace_water.jpg", alt: t("gallery_alt_6") },
  ];

  const REQUIREMENTS = [
    t("req_1"),
    t("req_2"),
    t("req_3"),
    t("req_4"),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Wedding",
    name: t("jsonld_name"),
    description: t("jsonld_description"),
    areaServed: {
      "@type": "Place",
      name: "Полтавська область, Україна",
    },
    provider: {
      "@type": "LodgingBusiness",
      name: t("jsonld_provider"),
      address: {
        "@type": "PostalAddress",
        addressCountry: "UA",
        addressRegion: "Полтавська область",
        addressLocality: "Нижні Млини",
      },
      telephone: phone,
    },
  };

  return (
    <main className="bg-[#faf6ec] text-[#0b1410]">
      <Script id="wedding-jsonld" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>

      {/* 1. HERO */}
      <section className="relative isolate overflow-hidden bg-[#0f1f18] text-[#faf6ec]">
        <div className="absolute inset-0">
          <Image
            src="/images/restaurant/exterior_summer_terrace_water.jpg"
            alt={t("hero_img_alt")}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1410]/80 via-[#0f1f18]/60 to-[#0f1f18]" />
        </div>
        <div className="relative mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-end px-6 py-28 md:py-36">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]">
            <Heart className="h-4 w-4" strokeWidth={1.5} />
            <span>{t("hero_eyebrow")}</span>
          </div>
          <h1 className="font-display mt-6 text-5xl leading-[1.05] md:text-7xl lg:text-8xl">
            {t("hero_title")}
            <span className="block font-display italic text-[#e6d9b8]">
              {t("hero_title_em")}
            </span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#faf6ec]/85 md:text-xl">
            {t("hero_body")}
          </p>
        </div>
      </section>

      {/* 2. ABOUT */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]">
                {t("about_eyebrow")}
              </div>
              <h2 className="font-display mt-6 text-4xl leading-tight md:text-5xl">
                {t("about_heading_pt1")}
                <span className="block font-display italic text-[#1a3d2e]">
                  {t("about_heading_em")}
                </span>
              </h2>
            </div>
            <div className="md:col-span-8">
              <p className="text-lg leading-relaxed text-[#0b1410]/80 md:text-xl">
                {t("about_body")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INCLUDED */}
      <section className="bg-[#0f1f18] py-28 text-[#faf6ec] md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]">
              {t("included_eyebrow")}
            </div>
            <h2 className="font-display mt-6 text-4xl leading-tight md:text-5xl">
              {t("included_heading_pt1")}{" "}
              <span className="font-display italic text-[#e6d9b8]">
                {t("included_heading_em")}
              </span>
            </h2>
          </div>
          <div className="mt-16 grid gap-px bg-[#faf6ec]/10 md:grid-cols-2 lg:grid-cols-3">
            {INCLUSIONS.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="bg-[#0f1f18] p-10 transition-colors hover:bg-[#1a3d2e]"
              >
                <Icon className="h-6 w-6 text-[#e6d9b8]" strokeWidth={1.25} />
                <h3 className="font-display mt-6 text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#faf6ec]/70">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FORMATS */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]">
              {t("formats_eyebrow")}
            </div>
            <h2 className="font-display mt-6 text-4xl leading-tight md:text-5xl">
              {t("formats_heading_pt1")}{" "}
              <span className="font-display italic text-[#1a3d2e]">
                {t("formats_heading_em")}
              </span>
            </h2>
          </div>
          <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
            {FORMATS.map((f) => (
              <article key={f.n} className="border-t border-[#0b1410]/15 pt-8">
                <div className="font-display text-5xl text-[#1a3d2e]/60">
                  {f.n}
                </div>
                <h3 className="font-display mt-6 text-2xl md:text-3xl">
                  {f.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#0b1410]/75">
                  {f.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. LOCATIONS */}
      <section className="bg-[#0f1f18] py-28 text-[#faf6ec] md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]">
              {t("locations_eyebrow")}
            </div>
            <h2 className="font-display mt-6 text-4xl leading-tight md:text-5xl">
              {t("locations_heading_pt1")}{" "}
              <span className="font-display italic text-[#e6d9b8]">
                {t("locations_heading_em")}
              </span>
            </h2>
          </div>
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {LOCATIONS.map((loc, i) => (
              <figure key={loc.title} className="flex flex-col">
                <div
                  className="relative aspect-[3/4] overflow-hidden bg-[#1a3d2e]"
                  style={{ borderRadius: SHAPES[i % SHAPES.length] }}
                >
                  <Image
                    src={loc.src}
                    alt={loc.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="font-display mt-6 text-xl text-[#faf6ec]">
                  {loc.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GALLERY */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]">
              {t("gallery_eyebrow")}
            </div>
            <h2 className="font-display mt-6 text-4xl leading-tight md:text-5xl">
              {t("gallery_heading_pt1")}{" "}
              <span className="font-display italic text-[#1a3d2e]">
                {t("gallery_heading_em")}
              </span>
            </h2>
          </div>
          <div className="mt-16">
            <GalleryGrid images={GALLERY} columns={3} aspect="landscape" />
          </div>
        </div>
      </section>

      {/* 7. PAST WEDDINGS */}
      <section className="bg-[#faf6ec] pb-28 md:pb-36">
        <div className="mx-auto max-w-4xl px-6">
          <div className="border-t border-[#0b1410]/15 pt-16">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]">
              {t("past_eyebrow")}
            </div>
            <p className="font-display mt-8 text-3xl leading-[1.3] text-[#0b1410] md:text-4xl">
              {t("past_body")}
            </p>
          </div>
        </div>
      </section>

      {/* 8. REQUIREMENTS */}
      <section className="bg-[#0f1f18] py-28 text-[#faf6ec] md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]">
                {t("requirements_eyebrow")}
              </div>
              <h2 className="font-display mt-6 text-4xl leading-tight md:text-5xl">
                {t("requirements_heading_pt1")}{" "}
                <span className="font-display italic text-[#e6d9b8]">
                  {t("requirements_heading_em")}
                </span>
              </h2>
            </div>
            <ul className="md:col-span-7">
              {REQUIREMENTS.map((req, i) => (
                <li
                  key={req}
                  className="flex gap-6 border-b border-[#faf6ec]/10 py-6 first:pt-0 last:border-b-0"
                >
                  <span className="font-display text-xl text-[#e6d9b8]/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-lg leading-relaxed text-[#faf6ec]/85">
                    {req}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 9. CTA */}
      <section className="bg-[#0b1410] py-28 text-[#faf6ec] md:py-36">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <Heart className="mx-auto h-7 w-7 text-[#e6d9b8]" strokeWidth={1.25} />
          <h2 className="font-display mx-auto mt-8 max-w-4xl text-5xl leading-[1.05] md:text-7xl">
            {t("cta_heading_pt1")}{" "}
            <span className="font-display italic text-[#e6d9b8]">
              {t("cta_heading_em")}
            </span>
          </h2>
          <div className="mt-14 flex flex-col items-center gap-8">
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="font-display text-3xl text-[#faf6ec] underline-offset-8 hover:underline md:text-4xl"
            >
              {phone}
            </a>
            <BookingButton className="border border-[#e6d9b8] bg-[#e6d9b8] px-12 py-5 text-[11px] uppercase tracking-[0.22em] text-[#0b1410] transition-colors hover:bg-[#faf6ec]">
              {t("book_date")}
            </BookingButton>
          </div>
        </div>
      </section>
    </main>
  );
}
