import type { Metadata } from "next";
import Script from "next/script";
import {
  Target,
  Users,
  Cake,
  Beer,
  Shield,
  Clock,
  ArrowUpRight,
  Phone,
} from "lucide-react";
import { CONTACT_INFO } from "@/constants";
import { BookingButton } from "@/components/ui/BookingButton";

export const metadata: Metadata = {
  title: "Пейнтбол у Глухомані — лісовий полігон",
  description:
    "Пейнтбол у сосновому лісі на території Глухоманю. Корпоративи, дитячі ігри, парубоцькі вечірки. Полтавщина.",
  openGraph: {
    title: "Пейнтбол у Глухомані",
    description: "Адреналін і тактика у сосновому лісі",
    type: "website",
    locale: "uk_UA",
  },
};

const CREAM = "#faf6ec";
const SURFACE = "#f4ecd8";
const TAN = "#e6d9b8";
const DEEP_FOREST = "#0f1f18";
const FOREST = "#1a3d2e";
const NEAR_BLACK = "#0b1410";

const longDescription = `Адреналін, тактика і командна гра у власному пейнтбольному клубі «Глухомань». Майданчик розташований у сосновому лісі — натуральні укриття, штучні барикади і безпечне обладнання забезпечують яскравий досвід для команд будь-якого розміру.

Ми проводимо корпоративні турніри, дитячі та підліткові ігри (від 12 років), а також святкові формати — день народження у форматі бойової місії, парубоцькі вечірки, тимбілдинги. Інструктор проводить інструктаж і супроводжує гру.`;

const features = [
  { title: "Лісовий полігон", desc: "Природні укриття серед сосен" },
  { title: "Професійне обладнання", desc: "Маркери, маски, захисний одяг" },
  { title: "Інструктор", desc: "Безпека і інструктаж перед грою" },
  { title: "Декілька сценаріїв", desc: "Захоплення прапора, штурм, командний бій" },
];

const scenarios = [
  {
    roman: "I",
    title: "Захоплення прапора",
    desc: "Класика пейнтболу. Дві команди, два прапори, одна ціль — захопити ворожий і принести на свою базу.",
  },
  {
    roman: "II",
    title: "Штурм фортеці",
    desc: "Одна команда захищає, інша атакує. Динаміка і тактика.",
  },
  {
    roman: "III",
    title: "Командний бій",
    desc: "Хто останній — той переможе. Швидко, інтенсивно, для невеликих груп.",
  },
  {
    roman: "IV",
    title: "Бойова місія",
    desc: "Спеціальний сценарій на замовлення для днів народження і тимбілдингів.",
  },
];

const audiences = [
  {
    icon: Users,
    title: "Корпоративи",
    desc: "Тимбілдинг, перемикання після робочого тижня",
  },
  {
    icon: Cake,
    title: "День народження",
    desc: "Від 12 років, у форматі пригодницької місії",
  },
  {
    icon: Beer,
    title: "Парубоцькі вечірки",
    desc: "Адреналін без класичних штампів",
  },
];

const preparation = [
  "Зручний одяг, який не шкода забруднити (на пейнтболі бувають фарбові плями)",
  "Закрите спортивне взуття (кеди, кросівки — але не сандалі)",
  "Бажано прибути за 15 хвилин до початку для брифінгу з інструктором",
  "Пейнтбол дозволений з 12 років, до 16 років — лише в супроводі батьків",
];

const primaryPhone = CONTACT_INFO.phone[0];
const [introParagraph, detailParagraph] = longDescription.split("\n\n");

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Paintball",
  name: "Пейнтбол у Глухомані",
  description:
    "Пейнтбол у сосновому лісі на території рекреаційного комплексу «Глухомань». Корпоративи, дитячі ігри, парубоцькі вечірки.",
  areaServed: "Полтавська область, Україна",
  provider: {
    "@type": "LodgingBusiness",
    name: "Глухомань",
    address: {
      "@type": "PostalAddress",
      addressCountry: "UA",
      addressRegion: "Полтавська область",
      addressLocality: "с. Нижні Млини",
    },
    telephone: primaryPhone,
  },
};

export default function PaintballPage() {
  return (
    <>
      <Script
        id="paintball-jsonld"
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main style={{ backgroundColor: CREAM }} className="font-display">
        {/* 1. HERO */}
        <section
          style={{ backgroundColor: NEAR_BLACK, color: CREAM }}
          className="relative py-28 md:py-36"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col items-start gap-10">
              <div
                className="flex h-20 w-20 items-center justify-center rounded-full"
                style={{ backgroundColor: TAN, color: DEEP_FOREST }}
              >
                <Target className="h-9 w-9" strokeWidth={1.5} />
              </div>
              <div
                className="text-[11px] uppercase tracking-[0.22em]"
                style={{ color: TAN }}
              >
                Глухомань · Активний відпочинок
              </div>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[1.02]">
                Пейнтбол
                <br />
                <span className="italic" style={{ color: TAN }}>
                  лісовий полігон
                </span>
              </h1>
              <p
                className="max-w-xl text-lg md:text-xl leading-relaxed"
                style={{ color: SURFACE }}
              >
                Сосновий ліс, тактика, адреналін. Команди від 6 до 20 гравців —
                під супроводом інструктора.
              </p>
            </div>
          </div>
        </section>

        {/* 2. ПРО ГРУ */}
        <section
          style={{ backgroundColor: CREAM, color: DEEP_FOREST }}
          className="py-28 md:py-36"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-12 gap-12 md:gap-16">
              <div className="md:col-span-4">
                <div className="text-[11px] uppercase tracking-[0.22em] mb-6">
                  Про гру
                </div>
                <h2 className="font-display text-4xl md:text-5xl leading-[1.05]">
                  Тактика у
                  <br />
                  <span className="italic">сосновому лісі</span>
                </h2>
              </div>
              <div className="md:col-span-8 space-y-6">
                <p className="text-lg md:text-xl leading-relaxed">
                  {introParagraph}
                </p>
                {detailParagraph && (
                  <p
                    className="text-base md:text-lg leading-relaxed"
                    style={{ color: FOREST }}
                  >
                    {detailParagraph}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. ОСОБЛИВОСТІ */}
        <section
          style={{ backgroundColor: DEEP_FOREST, color: CREAM }}
          className="py-28 md:py-36"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-16 flex items-end justify-between flex-wrap gap-6">
              <div>
                <div
                  className="text-[11px] uppercase tracking-[0.22em] mb-5"
                  style={{ color: TAN }}
                >
                  Особливості
                </div>
                <h2 className="font-display text-4xl md:text-5xl leading-[1.05]">
                  Що на <span className="italic">полігоні</span>
                </h2>
              </div>
            </div>
            <div
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l"
              style={{ borderColor: "rgba(230,217,184,0.18)" }}
            >
              {features.map((f) => (
                <div
                  key={f.title}
                  className="border-r border-b p-8 md:p-10"
                  style={{ borderColor: "rgba(230,217,184,0.18)" }}
                >
                  <Shield
                    className="h-6 w-6 mb-6"
                    strokeWidth={1.4}
                    style={{ color: TAN }}
                  />
                  <h3 className="font-display text-2xl mb-3">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: SURFACE }}>
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. СЦЕНАРІЇ */}
        <section
          style={{ backgroundColor: CREAM, color: DEEP_FOREST }}
          className="py-28 md:py-36"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-16">
              <div className="text-[11px] uppercase tracking-[0.22em] mb-5">
                Сценарії
              </div>
              <h2 className="font-display text-4xl md:text-5xl leading-[1.05]">
                Чотири <span className="italic">режими гри</span>
              </h2>
            </div>
            <div
              className="grid md:grid-cols-2 gap-px"
              style={{ backgroundColor: TAN }}
            >
              {scenarios.map((s) => (
                <article
                  key={s.roman}
                  className="p-10 md:p-12"
                  style={{ backgroundColor: CREAM }}
                >
                  <div className="flex items-start gap-6">
                    <div
                      className="font-display text-5xl italic leading-none"
                      style={{ color: FOREST }}
                    >
                      {s.roman}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display text-3xl mb-4 leading-tight">
                        {s.title}
                      </h3>
                      <p
                        className="text-base leading-relaxed"
                        style={{ color: FOREST }}
                      >
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 5. ДЛЯ КОГО */}
        <section
          style={{ backgroundColor: DEEP_FOREST, color: CREAM }}
          className="py-28 md:py-36"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-16">
              <div
                className="text-[11px] uppercase tracking-[0.22em] mb-5"
                style={{ color: TAN }}
              >
                Для кого
              </div>
              <h2 className="font-display text-4xl md:text-5xl leading-[1.05]">
                Формати <span className="italic">для різних нагод</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-10 md:gap-8">
              {audiences.map((a) => {
                const Icon = a.icon;
                return (
                  <div
                    key={a.title}
                    className="border-t pt-8"
                    style={{ borderColor: "rgba(230,217,184,0.28)" }}
                  >
                    <Icon
                      className="h-7 w-7 mb-6"
                      strokeWidth={1.4}
                      style={{ color: TAN }}
                    />
                    <h3 className="font-display text-2xl mb-4">{a.title}</h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: SURFACE }}
                    >
                      {a.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. ЦІНИ */}
        <section
          style={{ backgroundColor: CREAM, color: DEEP_FOREST }}
          className="py-28 md:py-36"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-12 gap-12 md:gap-16">
              <div className="md:col-span-5">
                <div className="text-[11px] uppercase tracking-[0.22em] mb-5">
                  Ціни та умови
                </div>
                <h2 className="font-display text-4xl md:text-5xl leading-[1.05]">
                  Просто й <span className="italic">прозоро</span>
                </h2>
              </div>
              <div className="md:col-span-7">
                <p className="text-lg md:text-xl leading-relaxed mb-6">
                  Базовий пакет — від 200 куль на гравця. Додаткові кулі за
                  запитом. Усе обладнання (маркер, маска, захисний костюм)
                  входить у вартість. Мінімальна кількість гравців — 6 осіб,
                  максимальна — 20.
                </p>
                <p
                  className="text-base leading-relaxed"
                  style={{ color: FOREST }}
                >
                  Від 6 до 20 осіб. Оптимальний розмір команди — 5–8 гравців.
                </p>
              </div>
            </div>

            <div
              className="mt-16 grid sm:grid-cols-3 gap-0 border-t"
              style={{ borderColor: TAN }}
            >
              {[
                {
                  icon: Users,
                  label: "Розмір групи",
                  value: "6–20 гравців",
                },
                {
                  icon: Target,
                  label: "Базовий пакет",
                  value: "від 200 куль",
                },
                {
                  icon: Clock,
                  label: "Тривалість",
                  value: "1,5–2 години",
                },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="py-10 pr-6 border-b sm:border-b-0 sm:border-r last:border-r-0"
                    style={{ borderColor: TAN }}
                  >
                    <Icon
                      className="h-6 w-6 mb-5"
                      strokeWidth={1.4}
                      style={{ color: FOREST }}
                    />
                    <div
                      className="text-[11px] uppercase tracking-[0.22em] mb-2"
                      style={{ color: FOREST }}
                    >
                      {stat.label}
                    </div>
                    <div className="font-display text-2xl md:text-3xl">
                      {stat.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. ЯК ПІДГОТУВАТИСЯ */}
        <section
          style={{ backgroundColor: SURFACE, color: DEEP_FOREST }}
          className="py-28 md:py-36"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="mb-16">
              <div className="text-[11px] uppercase tracking-[0.22em] mb-5">
                Як підготуватися
              </div>
              <h2 className="font-display text-4xl md:text-5xl leading-[1.05]">
                Перед <span className="italic">грою</span>
              </h2>
            </div>
            <ol className="space-y-0 border-t" style={{ borderColor: TAN }}>
              {preparation.map((item, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[auto_1fr] gap-8 md:gap-12 py-8 border-b"
                  style={{ borderColor: TAN }}
                >
                  <div
                    className="font-display text-3xl md:text-4xl italic"
                    style={{ color: FOREST }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className="text-base md:text-lg leading-relaxed self-center">
                    {item}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 8. CTA */}
        <section
          style={{ backgroundColor: DEEP_FOREST, color: CREAM }}
          className="py-28 md:py-36"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-12 gap-12 items-end">
              <div className="md:col-span-8">
                <div
                  className="text-[11px] uppercase tracking-[0.22em] mb-6"
                  style={{ color: TAN }}
                >
                  Бронювання
                </div>
                <h2 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.02]">
                  Забронюйте
                  <br />
                  <span className="italic" style={{ color: TAN }}>
                    гру
                  </span>
                </h2>
                <p
                  className="mt-8 max-w-xl text-lg leading-relaxed"
                  style={{ color: SURFACE }}
                >
                  Зв&apos;яжіться з нами, щоб узгодити сценарій, склад команди
                  та час проведення гри.
                </p>
              </div>
              <div className="md:col-span-4 flex flex-col gap-5">
                <a
                  href={`tel:${primaryPhone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center justify-between gap-4 border px-6 py-5"
                  style={{ borderColor: TAN, color: CREAM }}
                >
                  <span className="flex items-center gap-3">
                    <Phone className="h-5 w-5" strokeWidth={1.5} />
                    <span className="font-display text-xl">
                      {primaryPhone}
                    </span>
                  </span>
                  <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
                </a>
                <BookingButton
                  className="inline-flex items-center justify-between gap-4 px-6 py-5 font-display text-xl"
                  style={{ backgroundColor: TAN, color: DEEP_FOREST }}
                >
                  <span>Забронювати</span>
                  <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
                </BookingButton>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
