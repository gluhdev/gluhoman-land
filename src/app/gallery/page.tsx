import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Phone, Instagram, Send, Mail } from "lucide-react";
import { BLUR_DATA_URL } from "@/lib/blur-placeholder";
import { GalleryGrid } from "@/components/ui/GalleryGrid";
import { BookingButton } from "@/components/ui/BookingButton";
import { CONTACT_INFO } from "@/constants";
import { GALLERY_CATEGORIES } from "./gallery-data";

export const metadata: Metadata = {
  title: "Галерея — Глухомань",
  description:
    "Фотогалерея комплексу Глухомань: ресторан, лазня, аквапарк, події та природа Нижніх Млинів на Полтавщині.",
  openGraph: {
    title: "Галерея — Глухомань",
    description:
      "Фотогалерея комплексу Глухомань: ресторан, лазня, аквапарк, події та природа Нижніх Млинів на Полтавщині.",
    images: [
      {
        url: "/og-gallery.jpg",
        width: 1200,
        height: 630,
        alt: "Галерея — Глухомань",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Галерея — Глухомань",
    description:
      "Фотогалерея комплексу Глухомань: ресторан, лазня, аквапарк, події та природа Нижніх Млинів на Полтавщині.",
    images: ["/og-gallery.jpg"],
  },
};

type CategoryMeta = {
  id: string;
  label: string;
  roman: string;
  subtitle: string;
  essay: string;
  bg: "cream" | "forest";
};

const CATEGORY_META: Record<string, CategoryMeta> = {
  restoran: {
    id: "restoran",
    label: "Ресторан",
    roman: "I",
    subtitle: "біля тихої води",
    essay:
      "Автентичні інтер'єри з українською піччю, простора літня тераса над водою та приватні зали для тих, хто цінує тишу поміж розмовами.",
    bg: "cream",
  },
  laznya: {
    id: "laznya",
    label: "Лазня",
    roman: "II",
    subtitle: "ритуал тепла",
    essay:
      "Дубові парні, чани з карпатськими травами під зоряним небом і кімнати відпочинку з самоваром — тиха архітектура неспішного вечора.",
    bg: "forest",
  },
  akvapark: {
    id: "akvapark",
    label: "Аквапарк",
    roman: "III",
    subtitle: "родинне літо",
    essay:
      "Простір для сміху і бризок просто на території комплексу — день, який діти запам'ятають надовго.",
    bg: "cream",
  },
  podii: {
    id: "podii",
    label: "Події",
    roman: "IV",
    subtitle: "важливі вечори",
    essay:
      "Весілля і ювілеї, корпоративи, дитячі свята та жива музика — ми знаємо, як обрамити момент, що заслуговує на пам'ять.",
    bg: "forest",
  },
  pryroda: {
    id: "pryroda",
    label: "Природа",
    roman: "V",
    subtitle: "Нижні Млини",
    essay:
      "Мальовнича територія серед верб і води — повільні ранки, м'які сутінки, повітря, яке хочеться забрати із собою.",
    bg: "cream",
  },
};

const NAV_ITEMS = [
  { id: "restoran", label: "Ресторан" },
  { id: "laznya", label: "Лазня" },
  { id: "akvapark", label: "Аквапарк" },
  { id: "podii", label: "Події" },
  { id: "pryroda", label: "Природа" },
];

export default function GalleryPage() {
  const primaryPhone = CONTACT_INFO.phone[0];
  const telHref = `tel:${primaryPhone.replace(/[^+\d]/g, "")}`;

  return (
    <main className="min-h-[100svh] bg-[#faf6ec]">
      {/* Hero — deep forest */}
      <section className="relative isolate overflow-hidden bg-[#0b1410]">
        <div className="absolute inset-0">
          <Image
            src="/images/restaurant/exterior_summer_terrace_water.jpg"
            alt="Літня тераса Глухомані біля води"
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
            Галерея • Глухомань
          </span>
          <h1 className="font-display mt-6 max-w-4xl text-5xl leading-[1.05] text-[#faf6ec] sm:text-6xl md:text-7xl lg:text-[5.5rem]">
            Подивіться, як виглядає
            <span className="block italic text-[#e6d9b8]">наша Глухомань</span>
          </h1>
          <p className="font-display mt-8 max-w-2xl text-lg italic leading-relaxed text-[#faf6ec]/75 sm:text-xl">
            Ресторан, лазня, аквапарк і тихі пейзажі Нижніх Млинів —
            зібрані на одній сторінці, щоб ви могли відчути місце наперед.
          </p>
        </div>
      </section>

      {/* Sticky category nav — cream */}
      <nav
        aria-label="Категорії галереї"
        className="sticky top-0 z-30 border-b border-[#e6d9b8] bg-[#faf6ec]"
      >
        <div className="mx-auto max-w-6xl px-6">
          <ul className="flex gap-8 overflow-x-auto py-5 md:gap-12 md:py-6">
            {NAV_ITEMS.map((item) => (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  className="group relative inline-block text-[11px] uppercase tracking-[0.22em] font-medium text-[#0f1f18]"
                >
                  <span>{item.label}</span>
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
                Пори року
              </span>
              <h2 className="font-display mt-5 text-4xl leading-[1.1] text-[#faf6ec] sm:text-5xl md:text-6xl">
                Від зими
                <span className="block italic text-[#e6d9b8]">до зими</span>
              </h2>
            </div>
            <p className="max-w-md text-base leading-relaxed text-[#faf6ec]/70 md:text-right">
              Кожен сезон дарує Глухомані окремий характер — від перших весняних
              листків до тихих снігових ранків.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px bg-[#1a3d2e]/40 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                eyebrow: "Весна",
                title: "Перше тепло",
                desc: "Перші листки на терасі, жаб'ячий хор увечері, кольори розцвітання — ідеальний час для весіль.",
              },
              {
                eyebrow: "Літо",
                title: "Довгі вечори",
                desc: "Аквапарк відкрито, пиво з пивоварні, музика на терасі до опівночі.",
              },
              {
                eyebrow: "Осінь",
                title: "Мисливський настрій",
                desc: "Мисливський сезон, гриби у лісі, тепла лазня після прогулянки.",
              },
              {
                eyebrow: "Зима",
                title: "Самовар і тиша",
                desc: "Сніг на даху лазні, гарячий чай із самовара, тиша у номерах.",
              },
            ].map((card) => (
              <article
                key={card.eyebrow}
                className="flex flex-col gap-5 bg-[#0f1f18] p-10"
              >
                <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#e6d9b8]">
                  {card.eyebrow}
                </span>
                <h3 className="font-display text-3xl italic leading-[1.1] text-[#faf6ec]">
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#faf6ec]/70">
                  {card.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {GALLERY_CATEGORIES.map((category, categoryIndex) => {
        const meta = CATEGORY_META[category.id];
        if (!meta) return null;
        const isForest = meta.bg === "forest";

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
                      {meta.label}
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
                      {meta.roman}
                    </span>
                  </div>
                  <h2
                    className={`font-display mt-5 text-4xl leading-[1.1] sm:text-5xl md:text-6xl ${
                      isForest ? "text-[#faf6ec]" : "text-[#0b1410]"
                    }`}
                  >
                    {category.title}
                    <span
                      className={`block italic ${
                        isForest ? "text-[#e6d9b8]" : "text-[#1a3d2e]"
                      }`}
                    >
                      {meta.subtitle}
                    </span>
                  </h2>
                </div>
                <p
                  className={`max-w-md text-base leading-relaxed md:text-right ${
                    isForest ? "text-[#faf6ec]/70" : "text-[#0b1410]/70"
                  }`}
                >
                  {meta.essay}
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
                    Галерея у цифрах
                  </span>
                  <span aria-hidden="true" className="h-px w-12 bg-[#e6d9b8]/40" />
                </div>
                <div className="grid grid-cols-2 gap-px bg-[#1a3d2e]/40 md:grid-cols-4">
                  {[
                    { num: "500+", label: "фотографій на сайті" },
                    { num: "5 сезонів", label: "архіву" },
                    { num: "12", label: "фотографів з нашої команди" },
                    { num: "10 років", label: "історії комплексу" },
                  ].map((stat) => (
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
                Фотографи нашого комплексу
              </span>
              <h2 className="font-display mt-6 text-4xl leading-[1.1] text-[#0b1410] sm:text-5xl md:text-6xl">
                Кожен кадр —
                <span className="block italic text-[#1a3d2e]">наших рук справа</span>
              </h2>
              <div className="mt-8 max-w-xl space-y-5 text-[#0b1410]/75 leading-relaxed">
                <p>
                  Усі фотографії на цій сторінці зняті на території Глухомані —
                  нашою командою та гостями, які щедро ділились своїми кадрами з
                  нами. Ми віримо, що справжні емоції неможливо зрежисерувати.
                </p>
                <p>
                  Якщо ви теж зняли Глухомань так, як її ще ніхто не бачив —
                  напишіть нам. Ми із задоволенням додамо вашу роботу до архіву
                  із зазначенням авторства.
                </p>
              </div>
            </div>
            <div className="md:col-span-5">
              <div className="flex flex-col gap-6 border-l border-[#1a3d2e]/20 pl-8">
                <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/70">
                  Поділитись фото
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
                    Telegram-канал
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
              Запрошення
            </span>
            <h2 className="font-display max-w-4xl text-5xl leading-[1.05] text-[#faf6ec] sm:text-6xl md:text-7xl">
              Завітайте до нас,
              <span className="block italic text-[#e6d9b8]">особисто</span>
            </h2>
            <p className="font-display max-w-2xl text-lg italic leading-relaxed text-[#faf6ec]/75 sm:text-xl">
              Фото передають лише частину атмосфери. Забронюйте столик, чан або номер —
              і відчуйте Глухомань кожним диханням.
            </p>

            <div
              aria-hidden="true"
              className="h-px w-24 bg-[#e6d9b8]/40"
            />

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
              <Link
                href={telHref}
                className="group inline-flex items-center gap-3 text-[#faf6ec]"
              >
                <Phone className="h-4 w-4 text-[#e6d9b8]" aria-hidden="true" />
                <span className="font-display text-2xl italic transition-colors group-hover:text-[#e6d9b8]">
                  {primaryPhone}
                </span>
              </Link>
              <BookingButton className="inline-flex items-center justify-center border border-[#e6d9b8] bg-transparent px-10 py-4 text-[11px] uppercase tracking-[0.22em] font-medium text-[#faf6ec] transition-colors hover:bg-[#e6d9b8] hover:text-[#0b1410]">
                Забронювати
              </BookingButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
