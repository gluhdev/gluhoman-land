import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import {
  Flame,
  Utensils,
  Users,
  Clock,
  Droplets,
  Phone,
  ArrowUpRight,
} from "lucide-react";
import { BookingButton } from "@/components/ui/BookingButton";

export const metadata: Metadata = {
  title: "Мангальна зона — Глухомань",
  description:
    "Обладнана мангальна зона для барбекю біля води у рекреаційному комплексі «Глухомань». Мангал на дровах, навіс, столи. Полтавщина.",
  openGraph: {
    title: "Мангальна зона у Глухомані",
    description: "Гриль-вечір на природі",
    type: "website",
    locale: "uk_UA",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Мангальна зона — Глухомань",
  serviceType: "Barbecue area",
  areaServed: "Полтавська область, Україна",
  provider: {
    "@type": "LodgingBusiness",
    name: "Рекреаційний комплекс «Глухомань»",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Нижні Млини",
      addressRegion: "Полтавська область",
      addressCountry: "UA",
    },
  },
};

const cream = "#faf6ec";
const surface = "#f4ecd8";
const tan = "#e6d9b8";
const deepForest = "#0f1f18";
const nearBlack = "#0b1410";

const included = [
  {
    icon: Flame,
    title: "Мангал на дровах",
    desc: "Великий, професійний, з ґратами і шампурами.",
  },
  {
    icon: Users,
    title: "Столи і лави",
    desc: "До 20 осіб комфортно за одним столом.",
  },
  {
    icon: Utensils,
    title: "Навіс",
    desc: "Захист від дощу і прямого сонця протягом дня.",
  },
  {
    icon: Droplets,
    title: "Раковина",
    desc: "Вбудована мийка для рук і продуктів поруч.",
  },
  {
    icon: Flame,
    title: "Дрова",
    desc: "Привозимо при бронюванні — сухі, готові до вогню.",
  },
  {
    icon: Utensils,
    title: "Посуд",
    desc: "За запитом — тарілки, склянки, прибори.",
  },
];

const formats = [
  {
    tag: "01",
    title: "Ваші продукти",
    desc:
      "Ви привозите м'ясо, маринади і напої, а ми надаємо простір, мангал, дрова і обладнання. Це найекономніший варіант для компанії, яка любить готувати сама.",
  },
  {
    tag: "02",
    title: "Наш мангальний сет",
    desc:
      "Ми готуємо маринований шашлик, овочі-гриль, соуси і хліб з нашої кухні. Ви приходите у зону — все вже готове до вогню і подачі.",
  },
];

const addons = [
  "Свинячий шашлик маринований — за запитом",
  "Курячі крильця і стегна — за запитом",
  "Грильовані овочі (баклажан, перець, цукіні)",
  "Салати, хліб, соуси — повний набір для пікніка",
];

const rules = [
  "Бронювання за 2 дні наперед.",
  "Мінімальний час оренди — 3 години.",
  "Залишки після себе прибираємо разом (штраф за залишений сміття).",
  "Алкоголь дозволений, але помірно.",
  "Діти під наглядом — мангал це вогонь.",
];

export default function BbqZonePage() {
  return (
    <main style={{ backgroundColor: cream }} className="font-display">
      <Script
        id="ld-bbq-zone"
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {JSON.stringify(jsonLd)}
      </Script>

      {/* 1 · HERO */}
      <section
        style={{ backgroundColor: deepForest, color: cream }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0">
          <Image
            src="/images/restaurant/hall_oven.jpg"
            alt="Мангал на дровах"
            fill
            priority
            className="object-cover opacity-55"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(11,20,16,0.55) 0%, rgba(11,20,16,0.85) 100%)",
            }}
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-36">
          <p
            className="text-[11px] uppercase tracking-[0.22em]"
            style={{ color: tan }}
          >
            Гриль • Глухомань
          </p>
          <h1 className="mt-6 text-5xl md:text-7xl leading-[1.05]">
            Мангальна зона{" "}
            <span className="italic" style={{ color: tan }}>
              біля води
            </span>
          </h1>
          <p
            className="mt-8 max-w-2xl text-lg md:text-xl leading-relaxed"
            style={{ color: "#d8d0b8" }}
          >
            Обладнана зона для барбекю у затишному кутку комплексу. Мангал на
            дровах, зручні столи, навіс від дощу і вид на ставок. Ви принесете
            продукти — ми зробимо вечір.
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-5">
            <BookingButton
              className="inline-flex items-center gap-2 px-8 py-4 text-sm uppercase tracking-[0.22em]"
              style={{ backgroundColor: cream, color: nearBlack }}
            >
              Забронювати зону <ArrowUpRight className="h-4 w-4" />
            </BookingButton>
            <Link
              href="tel:+380991234567"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm uppercase tracking-[0.22em] border"
              style={{ borderColor: tan, color: cream }}
            >
              <Phone className="h-4 w-4" /> Зателефонувати
            </Link>
          </div>
        </div>
      </section>

      {/* 2 · INTRO */}
      <section style={{ backgroundColor: cream, color: nearBlack }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <p className="text-[11px] uppercase tracking-[0.22em] text-black/50">
            Про зону
          </p>
          <h2 className="mt-5 text-4xl md:text-5xl leading-[1.1] max-w-3xl">
            Простір для своїх.{" "}
            <span className="italic text-black/60">Без поспіху.</span>
          </h2>
          <div className="mt-14 grid md:grid-cols-2 gap-12 md:gap-16 text-base md:text-lg leading-relaxed text-black/75">
            <p>
              У «Глухомані» є окрема мангальна зона, яку можна орендувати на
              вечір або цілий день. Це напівкрита зона з мангалом на дровах,
              зручними столами, лавами і вбудованою раковиною для миття рук та
              продуктів.
            </p>
            <p>
              Ми надаємо усе обладнання, а ви — приносите ваш шашлик, ковбаски,
              овочі й напої. Або можете замовити мангальний сет з ресторану
              «Глухомань» — ми підготуємо усе з нашої кухні.
            </p>
          </div>
        </div>
      </section>

      {/* 3 · INCLUDED */}
      <section style={{ backgroundColor: deepForest, color: cream }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="flex items-end justify-between flex-wrap gap-6">
            <div>
              <p
                className="text-[11px] uppercase tracking-[0.22em]"
                style={{ color: tan }}
              >
                Обладнання
              </p>
              <h2 className="mt-5 text-4xl md:text-5xl leading-[1.1]">
                Що{" "}
                <span className="italic" style={{ color: tan }}>
                  включено
                </span>
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/60">
              Усе, що потрібно для комфортного гриль-вечора на природі — ми вже
              підготували.
            </p>
          </div>

          <div
            className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l"
            style={{ borderColor: "rgba(230,217,184,0.2)" }}
          >
            {included.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-8 md:p-10 border-r border-b"
                style={{ borderColor: "rgba(230,217,184,0.2)" }}
              >
                <Icon className="h-6 w-6" style={{ color: tan }} />
                <h3 className="mt-6 text-2xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/70">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4 · TWO FORMATS */}
      <section style={{ backgroundColor: cream, color: nearBlack }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <p className="text-[11px] uppercase tracking-[0.22em] text-black/50">
            Формати
          </p>
          <h2 className="mt-5 text-4xl md:text-5xl leading-[1.1] max-w-3xl">
            Два шляхи до{" "}
            <span className="italic text-black/60">одного вечора</span>
          </h2>

          <div className="mt-16 grid md:grid-cols-2 gap-10">
            {formats.map((f) => (
              <article
                key={f.tag}
                className="p-10 md:p-12 border"
                style={{
                  borderColor: "rgba(15,31,24,0.18)",
                  backgroundColor: surface,
                }}
              >
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] uppercase tracking-[0.22em] text-black/50">
                    Формат {f.tag}
                  </span>
                  <Flame className="h-5 w-5 text-black/40" />
                </div>
                <h3 className="mt-8 text-3xl md:text-4xl leading-tight">
                  {f.title}
                </h3>
                <p className="mt-6 text-base leading-relaxed text-black/70">
                  {f.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5 · LOCATION */}
      <section style={{ backgroundColor: deepForest, color: cream }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/images/restaurant/exterior_summer_terrace_water.jpg"
                alt="Літня зона біля води"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p
                className="text-[11px] uppercase tracking-[0.22em]"
                style={{ color: tan }}
              >
                Локація
              </p>
              <h2 className="mt-5 text-4xl md:text-5xl leading-[1.1]">
                Куток з{" "}
                <span className="italic" style={{ color: tan }}>
                  видом на ставок
                </span>
              </h2>
              <p className="mt-8 text-lg leading-relaxed text-white/75">
                Мангальна зона розташована окремо від ресторану, у куточку з
                видом на ставок. Тиша, природа, жодних зайвих людей. Можна
                привести свою компанію і провести час у своєму колі.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 · ADDONS */}
      <section style={{ backgroundColor: cream, color: nearBlack }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <p className="text-[11px] uppercase tracking-[0.22em] text-black/50">
            Меню з кухні
          </p>
          <h2 className="mt-5 text-4xl md:text-5xl leading-[1.1] max-w-3xl">
            Що можна{" "}
            <span className="italic text-black/60">замовити додатково</span>
          </h2>

          <ul className="mt-16">
            {addons.map((a, i) => (
              <li
                key={a}
                className="py-6 md:py-8 flex items-center gap-8 border-t last:border-b"
                style={{ borderColor: "rgba(15,31,24,0.15)" }}
              >
                <span className="text-xs tabular-nums text-black/40 w-10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-lg md:text-xl text-black/80">{a}</span>
                <Utensils className="h-4 w-4 ml-auto text-black/30" />
              </li>
            ))}
          </ul>

          <p className="mt-16 max-w-2xl text-base leading-relaxed text-black/65">
            Оренда зони — залежить від часу (3/6/12 годин). Мангальний сет з
            ресторану — від <span className="italic">450 грн на особу</span>.
            Уточнюйте при бронюванні.
          </p>
        </div>
      </section>

      {/* 7 · RULES */}
      <section style={{ backgroundColor: surface, color: nearBlack }}>
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-20">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-black/50">
                Правила
              </p>
              <h2 className="mt-5 text-4xl md:text-5xl leading-[1.1]">
                Коротко про{" "}
                <span className="italic text-black/60">головне</span>
              </h2>
            </div>
            <ol className="space-y-0">
              {rules.map((r, i) => (
                <li
                  key={r}
                  className="flex items-start gap-6 py-6 border-b"
                  style={{ borderColor: "rgba(15,31,24,0.18)" }}
                >
                  <span className="text-xs tabular-nums text-black/40 pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-lg md:text-xl text-black/80 leading-snug">
                    {r}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 8 · CTA */}
      <section
        style={{ backgroundColor: nearBlack, color: cream }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-30">
          <Image
            src="/images/restaurant/hall_terrace.jpg"
            alt=""
            fill
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(11,20,16,0.7) 0%, rgba(11,20,16,0.95) 100%)",
            }}
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-36 text-center">
          <p
            className="text-[11px] uppercase tracking-[0.22em]"
            style={{ color: tan }}
          >
            Бронювання
          </p>
          <h2 className="mt-6 text-4xl md:text-6xl leading-[1.05]">
            Вечір біля{" "}
            <span className="italic" style={{ color: tan }}>
              вогню чекає
            </span>
          </h2>
          <p
            className="mt-8 max-w-xl mx-auto text-base md:text-lg leading-relaxed"
            style={{ color: "#cfc6ae" }}
          >
            Забронюйте мангальну зону за 2 дні наперед — ми підготуємо дрова,
            мангал і зустрінемо вашу компанію.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
            <BookingButton
              className="inline-flex items-center gap-2 px-10 py-4 text-sm uppercase tracking-[0.22em]"
              style={{ backgroundColor: cream, color: nearBlack }}
            >
              Забронювати <ArrowUpRight className="h-4 w-4" />
            </BookingButton>
            <Link
              href="tel:+380991234567"
              className="inline-flex items-center gap-2 px-10 py-4 text-sm uppercase tracking-[0.22em] border"
              style={{ borderColor: tan, color: cream }}
            >
              <Phone className="h-4 w-4" /> +38 (099) 123 45 67
            </Link>
          </div>
          <p
            className="mt-14 text-[11px] uppercase tracking-[0.22em] flex items-center justify-center gap-3"
            style={{ color: tan }}
          >
            <Clock className="h-4 w-4" /> Мін. оренда — 3 години
          </p>
        </div>
      </section>
    </main>
  );
}
