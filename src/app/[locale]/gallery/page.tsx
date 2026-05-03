import type { Metadata } from "next";
import Image from "next/image";
import { Phone, Instagram, Send, Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { BLUR_DATA_URL } from "@/lib/blur-placeholder";
import { GalleryGrid } from "@/components/ui/GalleryGrid";
import { BookingButton } from "@/components/ui/BookingButton";
import { CONTACT_INFO } from "@/constants";
import { GALLERY_CATEGORIES } from "./gallery-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.og_title"),
      description: t("meta.og_description"),
      images: [
        {
          url: "/og-gallery.jpg",
          width: 1200,
          height: 630,
          alt: t("meta.og_image_alt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("meta.twitter_title"),
      description: t("meta.twitter_description"),
      images: ["/og-gallery.jpg"],
    },
  };
}

type CategoryId = "restoran" | "laznya" | "akvapark" | "podii" | "pryroda";

const CATEGORY_ROMAN: Record<CategoryId, string> = {
  restoran: "I",
  laznya: "II",
  akvapark: "III",
  podii: "IV",
  pryroda: "V",
};

const CATEGORY_BG: Record<CategoryId, "cream" | "forest"> = {
  restoran: "cream",
  laznya: "forest",
  akvapark: "cream",
  podii: "forest",
  pryroda: "cream",
};

const NAV_IDS: CategoryId[] = ["restoran", "laznya", "akvapark", "podii", "pryroda"];

export default async function GalleryPage() {
  const t = await getTranslations("gallery");
  const primaryPhone = CONTACT_INFO.phone[0];
  const telHref = `tel:${primaryPhone.replace(/[^+\d]/g, "")}`;

  return (
    <main className="min-h-[100svh] bg-[#faf6ec]">
      {/* Hero — deep forest */}
      <section className="relative isolate overflow-hidden bg-[#0b1410]">
        <div className="absolute inset-0">
          <Image
            src="/images/restaurant/exterior_summer_terrace_water.jpg"
            alt={t("hero.img_alt")}
            fill
            priority
            quality={90}
            sizes="100vw"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover opacity-55"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b1410]/70 via-[#0b1410]/50 to-[#0b1410]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-6xl flex-col justify-end px-6 py-28 md:py-36">
          <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#e6d9b8]">
            {t("hero.eyebrow")}
          </span>
          <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[1.05] text-[#faf6ec] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            {t("hero.title_p1")}
            <span className="block italic text-[#e6d9b8]">{t("hero.title_italic")}</span>
          </h1>
          <p className="font-display mt-8 max-w-2xl text-lg italic leading-relaxed text-[#faf6ec]/75 sm:text-xl">
            {t("hero.description")}
          </p>
        </div>
      </section>

      {/* Sticky category nav — cream */}
      <nav
        aria-label={t("nav.aria_label")}
        className="sticky top-0 z-30 border-b border-[#e6d9b8] bg-[#faf6ec]"
      >
        <div className="mx-auto max-w-6xl px-6">
          <ul className="flex gap-8 overflow-x-auto py-5 md:gap-12 md:py-6">
            {NAV_IDS.map((id) => (
              <li key={id} className="shrink-0">
                <a
                  href={`#${id}`}
                  className="group relative inline-block text-[11px] uppercase tracking-[0.22em] font-medium text-[#0f1f18]"
                >
                  <span>{t(`nav.${id}`)}</span>
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 h-px w-0 bg-[#1a3d2e] transition-all duration-500 ease-out group-hover:w-full"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Section A — Seasons strip (deep forest) */}
      <section className="bg-[#0f1f18] py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#e6d9b8]">
                {t("seasons.eyebrow")}
              </span>
              <h2 className="font-display mt-5 text-4xl leading-[1.1] text-[#faf6ec] sm:text-5xl md:text-6xl">
                {t("seasons.title_p1")}
                <span className="block italic text-[#e6d9b8]">{t("seasons.title_italic")}</span>
              </h2>
            </div>
            <p className="max-w-md text-base leading-relaxed text-[#faf6ec]/70 md:text-right">
              {t("seasons.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px bg-[#1a3d2e]/40 sm:grid-cols-2 lg:grid-cols-4">
            {(["spring", "summer", "autumn", "winter"] as const).map((season) => (
              <article
                key={season}
                className="flex flex-col gap-5 bg-[#0f1f18] p-10"
              >
                <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#e6d9b8]">
                  {t(`seasons.${season}.eyebrow`)}
                </span>
                <h3 className="font-display text-3xl italic leading-[1.1] text-[#faf6ec]">
                  {t(`seasons.${season}.title`)}
                </h3>
                <p className="text-sm leading-relaxed text-[#faf6ec]/70">
                  {t(`seasons.${season}.desc`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {GALLERY_CATEGORIES.map((category, categoryIndex) => {
        const catId = category.id as CategoryId;
        const roman = CATEGORY_ROMAN[catId];
        const bg = CATEGORY_BG[catId];
        if (!roman) return null;
        const isForest = bg === "forest";

        return (
          <div key={category.id}>
            <section
              id={category.id}
              className={`scroll-mt-28 py-28 md:py-36 ${
                isForest ? "bg-[#0f1f18]" : "bg-[#faf6ec]"
              }`}
            >
              <div className="mx-auto max-w-6xl px-6">
                <div className="mb-16 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-[11px] uppercase tracking-[0.22em] font-medium ${
                          isForest ? "text-[#e6d9b8]" : "text-[#1a3d2e]"
                        }`}
                      >
                        {t(`categories.${catId}.label`)}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`h-px w-12 ${
                          isForest ? "bg-[#e6d9b8]/40" : "bg-[#1a3d2e]/30"
                        }`}
                      />
                      <span
                        className={`font-display text-lg italic ${
                          isForest ? "text-[#e6d9b8]" : "text-[#1a3d2e]"
                        }`}
                      >
                        {roman}
                      </span>
                    </div>
                    <h2
                      className={`font-display mt-5 text-4xl leading-[1.1] sm:text-5xl md:text-6xl ${
                        isForest ? "text-[#faf6ec]" : "text-[#0b1410]"
                      }`}
                    >
                      {t(`categories.${catId}.title`)}
                      <span
                        className={`block italic ${
                          isForest ? "text-[#e6d9b8]" : "text-[#1a3d2e]"
                        }`}
                      >
                        {t(`categories.${catId}.subtitle`)}
                      </span>
                    </h2>
                  </div>
                  <p
                    className={`max-w-md text-base leading-relaxed md:text-right ${
                      isForest ? "text-[#faf6ec]/70" : "text-[#0b1410]/70"
                    }`}
                  >
                    {t(`categories.${catId}.essay`)}
                  </p>
                </div>

                <GalleryGrid
                  images={category.photos}
                  columns={4}
                  aspect="landscape"
                  showCaptions={false}
                />
              </div>
            </section>
            {categoryIndex === 0 && (
              <section className="bg-[#0f1f18] py-28 md:py-36">
                <div className="mx-auto max-w-6xl px-6">
                  <div className="mb-16 flex items-center gap-4">
                    <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#e6d9b8]">
                      {t("stats.eyebrow")}
                    </span>
                    <span aria-hidden="true" className="h-px w-12 bg-[#e6d9b8]/40" />
                  </div>
                  <div className="grid grid-cols-2 gap-px bg-[#1a3d2e]/40 md:grid-cols-4">
                    {([
                      { num: t("stats.photos_num"), label: t("stats.photos_label") },
                      { num: t("stats.seasons_num"), label: t("stats.seasons_label") },
                      { num: t("stats.photographers_num"), label: t("stats.photographers_label") },
                      { num: t("stats.years_num"), label: t("stats.years_label") },
                    ] as const).map((stat) => (
                      <div
                        key={stat.label}
                        className="flex flex-col gap-4 bg-[#0f1f18] p-10"
                      >
                        <span className="font-display text-5xl italic text-[#e6d9b8] md:text-6xl">
                          {stat.num}
                        </span>
                        <span className="text-sm leading-relaxed text-[#faf6ec]/70">
                          {stat.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>
        );
      })}

      {/* Section B — Photographers credits (cream) */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-16 md:grid-cols-12">
            <div className="md:col-span-7">
              <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]">
                {t("photographers.eyebrow")}
              </span>
              <h2 className="font-display mt-6 text-4xl leading-[1.1] text-[#0b1410] sm:text-5xl md:text-6xl">
                {t("photographers.title_p1")}
                <span className="block italic text-[#1a3d2e]">{t("photographers.title_italic")}</span>
              </h2>
              <div className="mt-8 max-w-xl space-y-5 text-[#0b1410]/75 leading-relaxed">
                <p>{t("photographers.body_p1")}</p>
                <p>{t("photographers.body_p2")}</p>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="flex flex-col gap-6 border-l border-[#1a3d2e]/20 pl-8">
                <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/70">
                  {t("photographers.share_label")}
                </span>
                <a
                  href="https://instagram.com/gluhomanland"
                  className="group inline-flex items-center gap-4 text-[#0b1410]"
                >
                  <Instagram className="h-4 w-4 text-[#1a3d2e]" aria-hidden="true" />
                  <span className="font-display text-xl italic transition-colors group-hover:text-[#1a3d2e]">
                    @gluhomanland
                  </span>
                </a>
                <a
                  href="https://t.me/gluhomanland"
                  className="group inline-flex items-center gap-4 text-[#0b1410]"
                >
                  <Send className="h-4 w-4 text-[#1a3d2e]" aria-hidden="true" />
                  <span className="font-display text-xl italic transition-colors group-hover:text-[#1a3d2e]">
                    {t("photographers.telegram_label")}
                  </span>
                </a>
                <a
                  href="mailto:photo@gluhoman.ua"
                  className="group inline-flex items-center gap-4 text-[#0b1410]"
                >
                  <Mail className="h-4 w-4 text-[#1a3d2e]" aria-hidden="true" />
                  <span className="font-display text-xl italic transition-colors group-hover:text-[#1a3d2e]">
                    photo@gluhoman.ua
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — deep forest */}
      <section className="relative bg-[#0b1410] py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-start gap-10">
            <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#e6d9b8]">
              {t("cta.eyebrow")}
            </span>
            <h2 className="font-display max-w-4xl text-5xl leading-[1.05] text-[#faf6ec] sm:text-6xl md:text-7xl">
              {t("cta.title_p1")}
              <span className="block italic text-[#e6d9b8]">{t("cta.title_italic")}</span>
            </h2>
            <p className="font-display max-w-2xl text-lg italic leading-relaxed text-[#faf6ec]/75 sm:text-xl">
              {t("cta.description")}
            </p>

            <div
              aria-hidden="true"
              className="h-px w-24 bg-[#e6d9b8]/40"
            />

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
              <a
                href={telHref}
                className="group inline-flex items-center gap-3 text-[#faf6ec]"
              >
                <Phone className="h-4 w-4 text-[#e6d9b8]" aria-hidden="true" />
                <span className="font-display text-2xl italic transition-colors group-hover:text-[#e6d9b8]">
                  {primaryPhone}
                </span>
              </a>
              <BookingButton className="inline-flex items-center justify-center border border-[#e6d9b8] bg-transparent px-10 py-4 text-[11px] uppercase tracking-[0.22em] font-medium text-[#faf6ec] transition-colors hover:bg-[#e6d9b8] hover:text-[#0b1410]">
                {t("cta.book_btn")}
              </BookingButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
