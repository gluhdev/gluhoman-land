import type { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import { Heart, Sparkles, MapPin, Users, Music, Camera } from "lucide-react";
import { CONTACT_INFO } from "@/constants";
import { BookingButton } from "@/components/ui/BookingButton";
import { GalleryGrid } from "@/components/ui/GalleryGrid";

export const metadata: Metadata = {
  title: "Виїзні весільні церемонії — Глухомань",
  description:
    "Затишні весільні церемонії на природі у рекреаційному комплексі «Глухомань». Локації біля води, банкетні зали, координатор, кейтеринг. Полтавщина.",
  openGraph: {
    title: "Весілля у Глухомані",
    description: "Виїзні весільні церемонії серед природи",
    type: "website",
    locale: "uk_UA",
    images: [
      {
        url: "/images/restaurant/exterior_summer_terrace_water.jpg",
        width: 1200,
        height: 630,
        alt: "Виїзна весільна церемонія у Глухомані",
      },
    ],
  },
};

const SHAPES = [
  "58% 42% 63% 37% / 45% 55% 45% 55%",
  "40% 60% 50% 50% / 55% 35% 65% 45%",
  "65% 35% 45% 55% / 50% 60% 40% 50%",
  "45% 55% 40% 60% / 60% 45% 55% 40%",
];

const INCLUSIONS = [
  {
    icon: MapPin,
    title: "Локації для церемонії",
    text: "альтанка біля ставка, літня тераса, зелена альтанка",
  },
  {
    icon: Music,
    title: "Технічне забезпечення",
    text: "звук, підсилювачі, мікрофони для реєстрації",
  },
  {
    icon: Sparkles,
    title: "Прикраси та декор",
    text: "живі квіти, арки, доріжки зі стрічок",
  },
  {
    icon: Users,
    title: "Координатор",
    text: "ведення програми, комунікація з підрядниками",
  },
  {
    icon: Camera,
    title: "Фотозона",
    text: "зелена жива альтанка, кущі троянд, вихід до води",
  },
  {
    icon: Heart,
    title: "Послуги кейтерингу",
    text: "банкет у ресторані «Глухомань», кухня з української печі",
  },
];

const FORMATS = [
  {
    n: "01",
    title: "Коротка церемонія",
    text: "2–3 години, до 30 гостей, без банкету. Фото сесія + легкі закуски.",
  },
  {
    n: "02",
    title: "Класичне весілля",
    text: "до 80 гостей, банкет у залі «Глухомань», програма до 6 годин.",
  },
  {
    n: "03",
    title: "Весільний day-out",
    text: "повний день, до 120 гостей, виїзна церемонія + банкет + ранкова прогулянка наступного дня з проживанням у готелі.",
  },
];

const LOCATIONS = [
  {
    title: "Літня тераса біля води",
    src: "/images/restaurant/exterior_summer_terrace_water.jpg",
  },
  {
    title: "Зелена альтанка",
    src: "/images/restaurant/decor_photozone_green_hedge.jpg",
  },
  {
    title: "Банкетна зала з каміном",
    src: "/images/restaurant/hall_banquet.jpg",
  },
  {
    title: "Святкова вечеря з десертами",
    src: "/images/restaurant/event_fruit_table_terrace.jpg",
  },
];

const GALLERY = [
  {
    src: "/images/restaurant/event_01.jpg",
    alt: "Весільна подія у Глухомані",
  },
  {
    src: "/images/restaurant/event_02.jpg",
    alt: "Гості на весіллі",
  },
  {
    src: "/images/restaurant/event_03.jpg",
    alt: "Святкування весілля",
  },
  {
    src: "/images/restaurant/event_04_music.jpg",
    alt: "Музичний супровід весілля",
  },
  {
    src: "/images/restaurant/decor_photozone_green_hedge.jpg",
    alt: "Фотозона з зеленою альтанкою",
  },
  {
    src: "/images/restaurant/exterior_summer_terrace_water.jpg",
    alt: "Літня тераса біля води",
  },
];

const REQUIREMENTS = [
  "Дата події за 2 місяці наперед (чим раніше, тим кращі локації)",
  "Попередній список гостей (для розміру залу)",
  "Ваші уподобання щодо декору і музики",
  "Вимоги до меню (ми складаємо індивідуальне)",
];

const phone = CONTACT_INFO.phone[0];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Wedding",
  name: "Виїзні весільні церемонії — Глухомань",
  description:
    "Затишні виїзні весільні церемонії на території рекреаційного комплексу «Глухомань» у с. Нижні Млини, Полтавська область.",
  areaServed: {
    "@type": "Place",
    name: "Полтавська область, Україна",
  },
  provider: {
    "@type": "LodgingBusiness",
    name: "Рекреаційний комплекс «Глухомань»",
    address: {
      "@type": "PostalAddress",
      addressCountry: "UA",
      addressRegion: "Полтавська область",
      addressLocality: "Нижні Млини",
    },
    telephone: phone,
  },
};

export default function WeddingPage() {
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
            alt="Літня тераса Глухомані біля води"
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
            <span>Весілля • Глухомань</span>
          </div>
          <h1 className="font-display mt-6 text-5xl leading-[1.05] md:text-7xl lg:text-8xl">
            Весільна церемонія
            <span className="block font-display italic text-[#e6d9b8]">
              серед природи
            </span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#faf6ec]/85 md:text-xl">
            Затишні виїзні церемонії на березі ставка, під зеленню альтанок.
            Тиха природа замість галасу міста — і день, що запам&apos;ятається
            на все життя.
          </p>
        </div>
      </section>

      {/* 2. ПРО */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]">
                Про нас
              </div>
              <h2 className="font-display mt-6 text-4xl leading-tight md:text-5xl">
                День,
                <span className="block font-display italic text-[#1a3d2e]">
                  який належить вам
                </span>
              </h2>
            </div>
            <div className="md:col-span-8">
              <p className="text-lg leading-relaxed text-[#0b1410]/80 md:text-xl">
                Ми проводимо виїзні весільні церемонії на території комплексу
                «Глухомань» у с. Нижні Млини. Наш майданчик — це поєднання
                автентичної української природи, затишної тераси біля води,
                романтичних альтанок і живописних закутків для найкращих фото.
                Місце, де час сповільнюється, а молодята можуть насолодитися
                кожним моментом.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ЩО ВКЛЮЧЕНО */}
      <section className="bg-[#0f1f18] py-28 text-[#faf6ec] md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]">
              Що включено
            </div>
            <h2 className="font-display mt-6 text-4xl leading-tight md:text-5xl">
              Від ідеї{" "}
              <span className="font-display italic text-[#e6d9b8]">
                до останнього тосту
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

      {/* 4. ФОРМАТИ */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]">
              Формати
            </div>
            <h2 className="font-display mt-6 text-4xl leading-tight md:text-5xl">
              Три варіанти,{" "}
              <span className="font-display italic text-[#1a3d2e]">
                одна атмосфера
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

      {/* 5. ЛОКАЦІЇ */}
      <section className="bg-[#0f1f18] py-28 text-[#faf6ec] md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]">
              Локації
            </div>
            <h2 className="font-display mt-6 text-4xl leading-tight md:text-5xl">
              Місця, де{" "}
              <span className="font-display italic text-[#e6d9b8]">
                все починається
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

      {/* 6. ГАЛЕРЕЯ */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]">
              Галерея подій
            </div>
            <h2 className="font-display mt-6 text-4xl leading-tight md:text-5xl">
              Моменти,{" "}
              <span className="font-display italic text-[#1a3d2e]">
                що залишаються
              </span>
            </h2>
          </div>
          <div className="mt-16">
            <GalleryGrid images={GALLERY} columns={3} aspect="landscape" />
          </div>
        </div>
      </section>

      {/* 7. ПРОВЕДЕНІ ВЕСІЛЛЯ */}
      <section className="bg-[#faf6ec] pb-28 md:pb-36">
        <div className="mx-auto max-w-4xl px-6">
          <div className="border-t border-[#0b1410]/15 pt-16">
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]">
              Проведені весілля
            </div>
            <p className="font-display mt-8 text-3xl leading-[1.3] text-[#0b1410] md:text-4xl">
              За роки існування комплексу ми провели{" "}
              <span className="italic text-[#1a3d2e]">десятки весіль</span> —
              від інтимних церемоній на 20 гостей до святкувань на 100+ осіб.
              Кожне весілля ми робимо унікальним — прислухаючись до побажань
              пари.
            </p>
          </div>
        </div>
      </section>

      {/* 8. ЩО ВІД НАС ПОТРІБНО */}
      <section className="bg-[#0f1f18] py-28 text-[#faf6ec] md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-5">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]">
                Що від нас потрібно
              </div>
              <h2 className="font-display mt-6 text-4xl leading-tight md:text-5xl">
                Декілька{" "}
                <span className="font-display italic text-[#e6d9b8]">
                  простих деталей
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
          <Heart
            className="mx-auto h-7 w-7 text-[#e6d9b8]"
            strokeWidth={1.25}
          />
          <h2 className="font-display mx-auto mt-8 max-w-4xl text-5xl leading-[1.05] md:text-7xl">
            Почнемо планувати{" "}
            <span className="font-display italic text-[#e6d9b8]">
              ваше весілля
            </span>
          </h2>
          <div className="mt-14 flex flex-col items-center gap-8">
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="font-display text-3xl text-[#faf6ec] underline-offset-8 hover:underline md:text-4xl"
            >
              {phone}
            </a>
            <BookingButton
              className="border border-[#e6d9b8] bg-[#e6d9b8] px-12 py-5 text-[11px] uppercase tracking-[0.22em] text-[#0b1410] transition-colors hover:bg-[#faf6ec]"
            >
              Забронювати дату
            </BookingButton>
          </div>
        </div>
      </section>
    </main>
  );
}
