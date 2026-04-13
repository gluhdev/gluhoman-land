import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
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

export const metadata: Metadata = {
  title: "Контактний зоопарк — Глухомань",
  description:
    "Маленький сімейний зоопарк у рекреаційному комплексі «Глухомань». Кози, кролики, павичі, гуси. Для дітей від 2 років. Полтавщина.",
  openGraph: {
    title: "Контактний зоопарк у Глухомані",
    description: "Дружба з природою для всієї родини",
    type: "website",
    locale: "uk_UA",
  },
};

const CREAM = "#faf6ec";
const SURFACE = "#f4ecd8";
const TAN = "#e6d9b8";
const DEEP = "#0f1f18";
const FOREST = "#1a3d2e";
const NEAR_BLACK = "#0b1410";

const residents = [
  {
    icon: Cat,
    name: "Карликові кози",
    desc: "Найвідкритіші і допитливі. Люблять гризти одяг — обережно.",
  },
  {
    icon: Rabbit,
    name: "Кролики",
    desc: "У окремій зоні, можна брати на руки (під наглядом).",
  },
  {
    icon: Feather,
    name: "Павичі",
    desc: "Красиві, гордовиті, іноді розкривають хвости. Не прирученні — тільки фото.",
  },
  {
    icon: Feather,
    name: "Курочки і гуси",
    desc: "Ходять вільно, клюють з рук. Малі діти в захваті.",
  },
  {
    icon: Heart,
    name: "Віслюк",
    desc: "Повільний, терплячий, дає себе гладити.",
  },
  {
    icon: Baby,
    name: "Поні (іноді)",
    desc: "Коли погода дозволяє — прогулянка на поні для дітей.",
  },
];

const allowed = [
  "Годувати з рук (корм надаємо при вході)",
  "Гладити кроликів і кіз",
  "Фотографувати без обмежень",
  "Брати фото і відео з тваринами",
];

const rules = [
  "Діти до 6 років — тільки у супроводі дорослого",
  "Не годуйте тварин своєю їжею (чіпси, цукерки — шкодять)",
  "Павичів не чіпати — вони агресивні, коли злякалися",
  "Кіз тримати на відстані — люблять гризти одяг і кишені",
  "Якщо маєте алергію на шерсть — попередьте",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Petting Zoo",
  name: "Контактний зоопарк — Глухомань",
  description:
    "Сімейний контактний зоопарк у рекреаційному комплексі «Глухомань». Кози, кролики, павичі, гуси, віслюк.",
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
};

export default function PettingZooPage() {
  return (
    <main style={{ backgroundColor: CREAM }} className="font-sans">
      <Script id="petting-zoo-jsonld" type="application/ld+json">
        {JSON.stringify(jsonLd)}
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
                Для родин • Глухомань
              </p>
              <h1 className="font-display text-5xl md:text-7xl leading-[1.05] mt-6">
                Контактний зоопарк
                <br />
                <span className="italic opacity-80">дружба з природою</span>
              </h1>
              <p
                className="mt-8 text-lg md:text-xl max-w-xl leading-relaxed opacity-80"
                style={{ color: SURFACE }}
              >
                Невеликий сімейний зоопарк із доброзичливими тваринами — кози,
                кролики, павичі, курочки і гуси. Можна годувати з рук,
                фотографувати і гладити. Ідеально для дітей від 2 років.
              </p>
              <div className="mt-12 flex items-center gap-6">
                <div
                  className="h-px w-16"
                  style={{ backgroundColor: TAN, opacity: 0.4 }}
                />
                <span className="text-[11px] uppercase tracking-[0.22em] opacity-60">
                  Щодня 10:00 — 19:00
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
                  alt="Павич у вольєрі"
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
                Про зоопарк
              </p>
              <h2 className="font-display text-4xl md:text-5xl mt-6 leading-[1.1]">
                Маленька ферма,
                <br />
                <span className="italic">велике враження</span>
              </h2>
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <p className="text-lg md:text-xl leading-relaxed opacity-85">
                Наш контактний зоопарк — не класичний зоосад з клітками. Це
                більше схоже на маленьку ферму, де тварини живуть у великих
                загонах і звикли до гостей. Ви можете підійти, годувати з рук,
                гладити і фотографувати. Для дітей — це магічний досвід першого
                знайомства з домашніми і трохи екзотичними тваринами.
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
                Знайомтесь
              </p>
              <h2 className="font-display text-4xl md:text-5xl mt-6 leading-[1.1]">
                Наші <span className="italic">мешканці</span>
              </h2>
            </div>
            <p className="text-sm opacity-60 max-w-xs">
              Шість видів тварин, які чекають вашого візиту
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
                    style={{
                      border: `1px solid ${TAN}`,
                      color: TAN,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-2xl mt-8">{r.name}</h3>
                  <p className="mt-4 text-sm leading-relaxed opacity-70">
                    {r.desc}
                  </p>
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
                Дозволено
              </p>
              <h2 className="font-display text-4xl md:text-5xl mt-6 leading-[1.1]">
                Що <span className="italic">можна</span>
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
                        i === allowed.length - 1
                          ? `1px solid ${TAN}`
                          : undefined,
                    }}
                  >
                    <span className="font-display text-2xl opacity-40 w-8">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-lg leading-relaxed opacity-85 flex-1">
                      {a}
                    </span>
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
                style={{
                  border: `1px solid ${FOREST}`,
                  color: FOREST,
                }}
              >
                <AlertCircle className="w-5 h-5" />
              </div>
              <p className="text-[11px] uppercase tracking-[0.22em] opacity-60 mt-8">
                Важливо
              </p>
              <h2 className="font-display text-4xl md:text-5xl mt-6 leading-[1.1]">
                Правила <span className="italic">безпеки</span>
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
                        i === rules.length - 1
                          ? `1px solid ${TAN}`
                          : undefined,
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
                Розклад
              </p>
              <h3 className="font-display text-3xl md:text-4xl mt-4 leading-tight">
                Коли <span className="italic">приходити</span>
              </h3>
              <p className="mt-6 text-base md:text-lg leading-relaxed opacity-80">
                Зоопарк відкритий щодня з 10:00 до 19:00. У спекотні дні тварини
                ховаються в тіні — найкращий час для відвідування: ранок (до 12)
                або вечір (після 17). Взимку зоопарк працює за домовленістю.
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
                Ціни
              </p>
              <h3 className="font-display text-3xl md:text-4xl mt-4 leading-tight">
                Доступно <span className="italic">для всіх</span>
              </h3>
              <p className="mt-6 text-base md:text-lg leading-relaxed opacity-80">
                Вхід до зоопарку включений для гостей комплексу. Для
                відвідувачів без проживання — символічна плата, корм надаємо
                окремо.
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
            Запрошуємо
          </p>
          <h2 className="font-display text-5xl md:text-6xl mt-6 leading-[1.05]">
            Приходьте <span className="italic">з дітьми</span>
          </h2>
          <p className="mt-8 text-lg md:text-xl leading-relaxed opacity-80 max-w-2xl mx-auto">
            Перше знайомство з тваринами, яке діти запам&apos;ятають надовго.
            Зателефонуйте, щоб уточнити деталі візиту.
          </p>
          <div className="mt-12 inline-flex items-center gap-4">
            <div
              className="h-px w-12"
              style={{ backgroundColor: FOREST, opacity: 0.4 }}
            />
            <Link
              href="tel:+380501234567"
              className="inline-flex items-center gap-3 px-8 py-4 text-sm uppercase tracking-[0.18em]"
              style={{
                backgroundColor: FOREST,
                color: CREAM,
              }}
            >
              <Phone className="w-4 h-4" />
              +38 (050) 123 45 67
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
