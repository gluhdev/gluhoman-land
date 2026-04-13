import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
import { CONTACT_INFO } from "@/constants";
import { BookingButton } from "@/components/ui/BookingButton";

export const metadata: Metadata = {
  title: "Апітерапія — Оздоровлення у Глухомані",
  description:
    "Оздоровчі програми з продуктами бджільництва у рекреаційному комплексі «Глухомань». Мед, прополіс, воскові аплікації в спокійній атмосфері природи Полтавщини.",
  openGraph: {
    title: "Апітерапія у Глухомані",
    description: "Оздоровчі процедури з бджолиними продуктами.",
    type: "website",
    locale: "uk_UA",
  },
};

const BENEFITS = [
  {
    numeral: "I",
    icon: Sparkles,
    title: "Зміцнення імунітету",
    description:
      "Натуральні вітаміни і антиоксиданти з бджолиних продуктів",
  },
  {
    numeral: "II",
    icon: Leaf,
    title: "Зняття стресу",
    description: "Релакс у спокійному середовищі серед природи",
  },
  {
    numeral: "III",
    icon: Flower2,
    title: "Покращення сну",
    description: "Заспокійливі властивості меду та прополісу",
  },
  {
    numeral: "IV",
    icon: Heart,
    title: "Підтримка серцево-судинної системи",
    description: "Тривала користь для здоров'я",
  },
];

const INCLUDED = [
  "Консультація з фахівцем перед процедурами",
  "Дегустація різних сортів меду (гречаний, липовий, травний)",
  "Воскові аплікації на тіло",
  "Інгаляції із прополісом",
  "Чайна церемонія з медом та фітозборами",
];

const CONTRAINDICATIONS = [
  "Алергія на бджолині продукти",
  "Загострення хронічних захворювань",
  "Діабет (потрібна консультація лікаря)",
  "Вагітність (потрібна консультація)",
];

export default function ApitherapyPage() {
  const primaryPhone = CONTACT_INFO.phone[0];
  const telHref = `tel:${primaryPhone.replace(/[^+\d]/g, "")}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Апітерапія",
    serviceType: "Apitherapy",
    description:
      "Оздоровчі програми з продуктами бджільництва у рекреаційному комплексі «Глухомань».",
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
              Оздоровлення • Глухомань
            </p>
            <h1 className="font-display mt-6 text-5xl md:text-7xl text-[#faf6ec]">
              Апітерапія
            </h1>
            <p className="font-display mt-3 text-2xl md:text-3xl italic text-[#e6d9b8]">
              лікування медом
            </p>
            <p className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-[#faf6ec]/80">
              Древня традиція оздоровлення продуктами бджільництва — мед,
              прополіс, воскові аплікації. Тиша, запах трав і турбота природи.
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
                Дізнатись більше
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
                Про апітерапію
              </p>
              <h2 className="font-display mt-5 text-4xl md:text-5xl text-[#0f1f18]">
                Сила
                <span className="italic"> бджолиних </span>
                продуктів
              </h2>
              <div className="mt-8 h-px w-16 bg-[#e6d9b8]" />
            </div>
            <div>
              <p className="text-base md:text-lg leading-relaxed text-[#0b1410]/80">
                Апітерапія — це цілюща сила бджолиних продуктів, що
                використовується в оздоровчих цілях уже тисячі років. У
                «Глухомані» ми пропонуємо програми із застосуванням меду,
                прополісу, маточного молочка та бджолиного пилку. Усі процедури
                проходять у спокійній атмосфері серед природи Полтавщини —
                далеко від міста та шуму.
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
              Переваги
            </p>
            <h2 className="font-display mt-5 text-4xl md:text-5xl">
              Що ви <span className="italic">отримаєте</span>
            </h2>
          </div>
          <div className="mt-16 grid gap-px bg-[#e6d9b8]/20 md:grid-cols-2">
            {BENEFITS.map(({ numeral, icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-[#0f1f18] p-10 md:p-12"
              >
                <div className="flex items-start justify-between">
                  <Icon
                    className="h-7 w-7 text-[#e6d9b8]"
                    strokeWidth={1.25}
                  />
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
                V • Що включено
              </p>
              <h2 className="font-display mt-5 text-4xl md:text-5xl text-[#0f1f18]">
                Програма <span className="italic">оздоровлення</span>
              </h2>
              <div className="mt-8 h-px w-16 bg-[#e6d9b8]" />
              <p className="mt-8 text-base leading-relaxed text-[#0b1410]/70">
                Кожна процедура підібрана з турботою про ваше самопочуття та
                гармонію з природою.
              </p>
            </div>
            <ul className="space-y-6">
              {INCLUDED.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-5 border-b border-[#e6d9b8] pb-6"
                >
                  <span className="mt-1 flex h-6 w-6 flex-none items-center justify-center border border-[#1a3d2e]/30 bg-[#f4ecd8]">
                    <Check
                      className="h-3.5 w-3.5 text-[#1a3d2e]"
                      strokeWidth={2}
                    />
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
                  VI • Протипоказання
                </p>
                <h2 className="font-display mt-4 text-3xl md:text-4xl text-[#0f1f18]">
                  Зверніть <span className="italic">увагу</span>
                </h2>
                <p className="mt-5 max-w-xl text-sm md:text-base leading-relaxed text-[#0b1410]/70">
                  Перед відвідуванням рекомендуємо ознайомитись із
                  протипоказаннями. У разі сумнівів — проконсультуйтесь із
                  лікарем.
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
                style={{
                  borderRadius: "62% 38% 54% 46% / 48% 55% 45% 52%",
                }}
              >
                <Image
                  src="/images/sauna/honey_jar_gluhoman.jpg"
                  alt="Мед у банці — Глухомань"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#e6d9b8]">
                VII • Як це проходить
              </p>
              <h2 className="font-display mt-5 text-4xl md:text-5xl">
                Година <span className="italic">тиші</span> та меду
              </h2>
              <div className="mt-8 h-px w-16 bg-[#e6d9b8]/50" />
              <p className="mt-8 text-base md:text-lg leading-relaxed text-[#faf6ec]/80">
                Програма триває 1,5–2 години. Починаємо з короткої
                консультації — розповідаємо про властивості продуктів та
                перевіряємо відсутність алергії. Далі — процедури в спокійному
                просторі з природним освітленням. Завершуємо чайною церемонією
                з медом з наших власних пасік.
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
              VIII • Ціни
            </p>
            <h2 className="font-display mt-5 text-5xl md:text-6xl text-[#0f1f18]">
              За <span className="italic">запитом</span>
            </h2>
            <div className="mx-auto mt-8 h-px w-16 bg-[#e6d9b8]" />
            <p className="mt-8 text-base md:text-lg leading-relaxed text-[#0b1410]/75">
              Індивідуальні програми залежно від потреб. Зв&apos;яжіться з
              нами, щоб обрати ідеальну тривалість та набір процедур.
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
                IX • Контакти та бронювання
              </p>
              <h2 className="font-display mt-5 text-4xl md:text-5xl">
                Завітайте до <span className="italic">Глухомані</span>
              </h2>
              <div className="mt-8 h-px w-16 bg-[#e6d9b8]/50" />
              <p className="mt-8 text-base leading-relaxed text-[#faf6ec]/75">
                Залиште заявку — ми зв&apos;яжемось, щоб обговорити деталі
                програми та підібрати зручний час.
              </p>
            </div>
            <div className="space-y-10">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]/70">
                  Телефон
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
                  Години роботи
                </p>
                <p className="mt-4 font-display text-xl italic text-[#faf6ec]/90">
                  {CONTACT_INFO.workingHours}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]/70">
                  Адреса
                </p>
                <p className="mt-4 text-base text-[#faf6ec]/85">
                  {CONTACT_INFO.address}
                </p>
              </div>
              <div className="pt-4">
                <BookingButton
                  service="hotel"
                  className="inline-flex items-center gap-3 border border-[#e6d9b8] bg-[#e6d9b8] px-8 py-4 text-sm uppercase tracking-[0.18em] text-[#0f1f18] transition-colors hover:bg-transparent hover:text-[#faf6ec]"
                >
                  Забронювати візит
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
