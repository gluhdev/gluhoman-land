import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  PartyPopper,
  Gift,
  Cake,
  Users,
  MapPin,
  Camera,
  Music,
  Phone,
  ArrowUpRight,
} from "lucide-react";
import { BookingButton } from "@/components/ui/BookingButton";
import { GalleryGrid } from "@/components/ui/GalleryGrid";

export const metadata: Metadata = {
  title: "Дитячі свята у Глухомані — Дні народження на природі",
  description:
    "Організація дитячих свят, днів народження і тематичних вечірок у рекреаційному комплексі «Глухомань». Аніматори, солодкий стіл, лісові квести. Полтавщина.",
  openGraph: {
    title: "Дитячі свята у Глухомані",
    description: "Незабутні дні народження з аніматорами",
    type: "website",
    locale: "uk_UA",
    images: [
      {
        url: "/images/restaurant/event_birthday_balloon_decor.jpg",
        width: 1200,
        height: 630,
        alt: "Дитяче свято у Глухомані",
      },
    ],
  },
};

const CREAM = "#faf6ec";
const SURFACE = "#f4ecd8";
const TAN = "#e6d9b8";
const DEEP = "#0f1f18";
const FOREST = "#1a3d2e";
const NEAR_BLACK = "#0b1410";

const formats = [
  {
    roman: "I",
    title: "Лісовий квест",
    description:
      "Пригода в сосновому гаю з мапою скарбів, загадками і перемогою у фіналі. Для 6+ років.",
    image: "/images/restaurant/animation_lasertag_kids_outdoor.jpg",
    icon: PartyPopper,
  },
  {
    roman: "II",
    title: "Піратська ніч",
    description:
      "Сценарій з капітаном, скринею скарбів і нічним вогнищем. Для 8+ років.",
    image: "/images/restaurant/animation_kids_pirate_night.jpg",
    icon: Gift,
  },
  {
    roman: "III",
    title: "Класичне свято з аніматором",
    description:
      "Ведучий у костюмі, конкурси, малювання на обличчі, мильні бульбашки. Для 3–8 років.",
    image: "/images/restaurant/animation_clown_with_child.jpg",
    icon: Cake,
  },
  {
    roman: "IV",
    title: "Спортивні естафети",
    description:
      "Командні ігри, смужка перешкод, нагороди. Для 7–14 років. Територія аквапарку або лісу.",
    image: "/images/restaurant/event_happy_birthday_number2_pink.jpg",
    icon: Users,
  },
];

const included = [
  { icon: Users, title: "Аніматор-педагог", text: "Супровід на всю програму свята." },
  { icon: Cake, title: "Святковий стіл", text: "Дитяча кухня без гострого і без алкоголю." },
  { icon: Gift, title: "Торт на вибір", text: "Класичний, без цукру або з фото дитини." },
  { icon: PartyPopper, title: "Прикраси зони", text: "Кульки, банери, тематична фотозона." },
  { icon: Music, title: "Музика і мікрофон", text: "Озвучення для ведучого і танців." },
  { icon: Camera, title: "Фото з події", text: "Базовий пакет — на телефон аніматора." },
];

const locations = [
  {
    title: "Зелена альтанка",
    text: "У саду комплексу, затишно, у тіні дерев. Ідеально для теплих днів.",
  },
  {
    title: "Банкетна зала",
    text: "Для дощу або холодної погоди. Вміщує до 30 дітей з батьками.",
  },
  {
    title: "Тераса біля води",
    text: "Видовищна локація для літніх свят — із видом на ставок.",
  },
];

const gallery = [
  {
    src: "/images/restaurant/event_birthday_balloon_decor.jpg",
    alt: "Святковий декор із кульок",
  },
  {
    src: "/images/restaurant/event_happy_birthday_number1_red.jpg",
    alt: "Декор Happy Birthday червоний",
  },
  {
    src: "/images/restaurant/animation_clown_with_child.jpg",
    alt: "Аніматор з дитиною",
  },
  {
    src: "/images/restaurant/animation_kids_pirate_night.jpg",
    alt: "Піратська ніч для дітей",
  },
  {
    src: "/images/restaurant/decor_photozone_green_hedge.jpg",
    alt: "Зелена фотозона",
  },
  {
    src: "/images/restaurant/event_fruit_table_terrace.jpg",
    alt: "Фруктовий стіл на терасі",
  },
];

const preparation = [
  {
    n: "01",
    title: "Бронювання за 2 тижні",
    text: "Щоб команда встигла підготувати сценарій, декор і меню.",
  },
  {
    n: "02",
    title: "Узгодження сценарію",
    text: "Разом з нашою командою обираємо формат, програму і меню.",
  },
  {
    n: "03",
    title: "Список гостей і вік",
    text: "Щоб підібрати правильну активність для кожної вікової групи.",
  },
  {
    n: "04",
    title: "Побажання щодо торта",
    text: "Класичний смак, без цукру або дієтичний — на вибір.",
  },
  {
    n: "05",
    title: "Алергії у дітей",
    text: "Обов'язково попередити заздалегідь для безпеки меню.",
  },
];

const jsonLdString = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Children's Party",
  name: "Дитячі свята у Глухомані",
  description:
    "Організація дитячих свят, днів народження і тематичних вечірок у рекреаційному комплексі «Глухомань».",
  areaServed: "Полтавська область, Україна",
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

export default function KidsPartiesPage() {
  return (
    <main style={{ backgroundColor: CREAM }} className="text-[#0b1410]">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />

      {/* 1. HERO */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: DEEP, color: CREAM }}
      >
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/images/restaurant/event_birthday_balloon_decor.jpg"
            alt="Дитяче свято у Глухомані"
            fill
            priority
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, ${DEEP}cc, ${NEAR_BLACK}ee)`,
            }}
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-36">
          <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: TAN }}>
            Свята • Глухомань
          </p>
          <h1 className="font-display mt-6 text-5xl md:text-7xl lg:text-8xl leading-[0.95]">
            Дитячі свята{" "}
            <span className="italic font-light" style={{ color: TAN }}>
              з душею
            </span>
          </h1>
          <p
            className="mt-8 max-w-2xl text-lg md:text-xl leading-relaxed"
            style={{ color: `${CREAM}cc` }}
          >
            Незабутні дні народження для дітей віком від 3 до 14 років — на
            свіжому повітрі, з аніматорами, солодким столом і програмою у
            форматі лісового квесту або піратської ночі.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <BookingButton />
            <Link
              href="#formats"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] border-b pb-1 transition-opacity hover:opacity-80"
              style={{ borderColor: TAN, color: TAN }}
            >
              Формати свят <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. INTRO */}
      <section style={{ backgroundColor: CREAM }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid md:grid-cols-12 gap-12 items-start">
            <div className="md:col-span-4">
              <p
                className="text-[11px] uppercase tracking-[0.22em]"
                style={{ color: FOREST }}
              >
                Про свята
              </p>
              <h2 className="font-display mt-6 text-4xl md:text-5xl leading-tight">
                Організуємо{" "}
                <span className="italic font-light">на природі</span>
              </h2>
            </div>
            <div className="md:col-span-8">
              <p className="text-lg md:text-xl leading-relaxed text-[#0b1410]/80">
                Ми організовуємо дитячі свята у «Глухомані» — на природі, з
                аніматорами, конкурсами, тортом і смачною дитячою їжею. Команда
                заздалегідь обговорює сценарій з батьками, готує святковий
                стіл, прикрашає зону і забезпечує програму від 2 до 4 годин.
                Усі дитячі активності супроводжує досвідчений
                аніматор-педагог.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FORMATS */}
      <section
        id="formats"
        style={{ backgroundColor: DEEP, color: CREAM }}
      >
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="max-w-3xl">
            <p
              className="text-[11px] uppercase tracking-[0.22em]"
              style={{ color: TAN }}
            >
              Формати
            </p>
            <h2 className="font-display mt-6 text-4xl md:text-5xl leading-tight">
              Чотири сценарії{" "}
              <span className="italic font-light" style={{ color: TAN }}>
                на вибір
              </span>
            </h2>
          </div>

          <div className="mt-20 grid md:grid-cols-2 gap-x-12 gap-y-20">
            {formats.map((f) => {
              const Icon = f.icon;
              return (
                <article key={f.title}>
                  <div
                    className="relative overflow-hidden"
                    style={{
                      aspectRatio: "4 / 5",
                      borderRadius: "55% 45% 60% 40% / 50% 55% 45% 50%",
                    }}
                  >
                    <Image
                      src={f.image}
                      alt={f.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="mt-8 flex items-start gap-6">
                    <span
                      className="font-display text-5xl italic font-light shrink-0"
                      style={{ color: TAN }}
                    >
                      {f.roman}
                    </span>
                    <div>
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" style={{ color: TAN }} />
                        <h3 className="font-display text-2xl md:text-3xl">
                          {f.title}
                        </h3>
                      </div>
                      <p
                        className="mt-4 leading-relaxed"
                        style={{ color: `${CREAM}bb` }}
                      >
                        {f.description}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. INCLUDED */}
      <section style={{ backgroundColor: CREAM }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="max-w-3xl">
            <p
              className="text-[11px] uppercase tracking-[0.22em]"
              style={{ color: FOREST }}
            >
              Що включено
            </p>
            <h2 className="font-display mt-6 text-4xl md:text-5xl leading-tight">
              Усе для свята{" "}
              <span className="italic font-light">під ключ</span>
            </h2>
          </div>

          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 border-t border-[#0f1f18]/15">
            {included.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-8 md:p-10 border-b border-r border-[#0f1f18]/15"
                >
                  <Icon className="h-6 w-6" style={{ color: FOREST }} />
                  <h3 className="font-display mt-6 text-2xl">{item.title}</h3>
                  <p className="mt-3 text-[#0b1410]/70 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>

          <div
            className="mt-16 p-8 md:p-12 border-l-2"
            style={{ backgroundColor: SURFACE, borderColor: FOREST }}
          >
            <p
              className="text-[11px] uppercase tracking-[0.22em]"
              style={{ color: FOREST }}
            >
              Ціни
            </p>
            <p className="mt-4 font-display text-2xl md:text-3xl italic font-light leading-snug">
              Пакети залежать від кількості гостей, програми і тривалості.
              Орієнтовний діапазон — від 2 до 4 годин, від 6 до 30 дітей. За
              запитом.
            </p>
          </div>
        </div>
      </section>

      {/* 5. LOCATIONS */}
      <section style={{ backgroundColor: DEEP, color: CREAM }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="max-w-3xl">
            <p
              className="text-[11px] uppercase tracking-[0.22em]"
              style={{ color: TAN }}
            >
              Локації
            </p>
            <h2 className="font-display mt-6 text-4xl md:text-5xl leading-tight">
              Три локації{" "}
              <span className="italic font-light" style={{ color: TAN }}>
                на території
              </span>
            </h2>
          </div>

          <div
            className="mt-16 grid md:grid-cols-3 gap-px"
            style={{ backgroundColor: `${TAN}33` }}
          >
            {locations.map((loc, i) => (
              <div
                key={loc.title}
                className="p-10 md:p-12"
                style={{ backgroundColor: DEEP }}
              >
                <div className="flex items-center gap-4">
                  <span
                    className="font-display text-3xl italic font-light"
                    style={{ color: TAN }}
                  >
                    0{i + 1}
                  </span>
                  <MapPin className="h-5 w-5" style={{ color: TAN }} />
                </div>
                <h3 className="font-display mt-6 text-2xl md:text-3xl">
                  {loc.title}
                </h3>
                <p
                  className="mt-4 leading-relaxed"
                  style={{ color: `${CREAM}bb` }}
                >
                  {loc.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GALLERY */}
      <section style={{ backgroundColor: CREAM }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="max-w-3xl">
            <p
              className="text-[11px] uppercase tracking-[0.22em]"
              style={{ color: FOREST }}
            >
              Галерея
            </p>
            <h2 className="font-display mt-6 text-4xl md:text-5xl leading-tight">
              Моменти{" "}
              <span className="italic font-light">свят</span>
            </h2>
          </div>
          <div className="mt-16">
            <GalleryGrid images={gallery} columns={3} aspect="square" />
          </div>
        </div>
      </section>

      {/* 7. PREPARATION */}
      <section style={{ backgroundColor: CREAM }}>
        <div className="max-w-6xl mx-auto px-6 pb-28 md:pb-36">
          <div className="border-t border-[#0f1f18]/15 pt-20">
            <div className="max-w-3xl">
              <p
                className="text-[11px] uppercase tracking-[0.22em]"
                style={{ color: FOREST }}
              >
                Як підготуватися
              </p>
              <h2 className="font-display mt-6 text-4xl md:text-5xl leading-tight">
                П&apos;ять кроків{" "}
                <span className="italic font-light">до свята</span>
              </h2>
            </div>

            <ol className="mt-16 space-y-12">
              {preparation.map((step) => (
                <li
                  key={step.n}
                  className="grid md:grid-cols-12 gap-6 md:gap-12 pb-12 border-b border-[#0f1f18]/10 last:border-b-0"
                >
                  <div className="md:col-span-2">
                    <span
                      className="font-display text-5xl italic font-light"
                      style={{ color: FOREST }}
                    >
                      {step.n}
                    </span>
                  </div>
                  <div className="md:col-span-4">
                    <h3 className="font-display text-2xl md:text-3xl">
                      {step.title}
                    </h3>
                  </div>
                  <div className="md:col-span-6">
                    <p className="text-lg text-[#0b1410]/75 leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 8. CTA */}
      <section style={{ backgroundColor: DEEP, color: CREAM }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36 text-center">
          <p
            className="text-[11px] uppercase tracking-[0.22em]"
            style={{ color: TAN }}
          >
            Зв&apos;язок
          </p>
          <h2 className="font-display mt-6 text-5xl md:text-7xl leading-[0.95]">
            Обговоримо{" "}
            <span className="italic font-light" style={{ color: TAN }}>
              свято
            </span>
          </h2>
          <p
            className="mt-8 max-w-xl mx-auto text-lg leading-relaxed"
            style={{ color: `${CREAM}cc` }}
          >
            Напишіть або зателефонуйте — підготуємо персональний сценарій
            свята для вашої дитини.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
            <a
              href="tel:+380951234567"
              className="inline-flex items-center gap-3 text-lg border-b pb-1 transition-opacity hover:opacity-80"
              style={{ borderColor: TAN, color: TAN }}
            >
              <Phone className="h-5 w-5" />
              +38 (095) 123-45-67
            </a>
            <BookingButton />
          </div>
        </div>
      </section>
    </main>
  );
}
