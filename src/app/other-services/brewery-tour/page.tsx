import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
import { CONTACT_INFO } from "@/constants";
import { BookingButton } from "@/components/ui/BookingButton";

export const metadata: Metadata = {
  title: "Тур по крафтовій пивоварні — Глухомань",
  description:
    "Екскурсія власною пивоварнею «Глухомань» з дегустацією 4 сортів крафтового пива і пивним снеком. Чеські і німецькі рецепти, артезіанська вода.",
  openGraph: {
    title: "Пивоварня Глухомань",
    description: "Тур з дегустацією крафту",
    type: "website",
    locale: "uk_UA",
    images: [
      {
        url: "/images/restaurant/craft_beer_glasses_snacks.jpg",
        width: 1200,
        height: 630,
        alt: "Крафтове пиво Глухомань",
      },
    ],
  },
};

const INCLUDED = [
  {
    numeral: "I",
    icon: Factory,
    title: "Власне виробництво",
    description: "Артезіанська вода і відбірний солод",
  },
  {
    numeral: "II",
    icon: Wine,
    title: "4 сорти на дегустацію",
    description: "Лагер, IPA, портер, сезонний",
  },
  {
    numeral: "III",
    icon: Beer,
    title: "Пивний снек",
    description: "Сало, сир, пшеничні палички",
  },
  {
    numeral: "IV",
    icon: Users,
    title: "Гід-пивовар",
    description: "Розкаже усе про процес",
  },
];

const BEERS = [
  {
    name: "Глухоманський Лагер",
    abv: "4.5% ABV",
    description:
      "Класичний світлий лагер, чеський рецепт. Легкий, освіжаючий, з квітковими нотами хмелю.",
  },
  {
    name: "Лісова IPA",
    abv: "6.2% ABV",
    description:
      "Американська IPA зі складним хмельовим профілем. Цитрус, хвоя, гіркувато-фруктовий післясмак.",
  },
  {
    name: "Темний Портер",
    abv: "5.8% ABV",
    description:
      "Насичений стаут із нотами шоколаду і кави. Глибокий, щільний, ідеально з м'ясом.",
  },
  {
    name: "Сезонний",
    abv: "Змінюється",
    description:
      "Щоквартально змінюється. Може бути вітбір, сесійний ель, імперський стаут. Уточнюйте при візиті.",
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Приготування сусла",
    description:
      "Солод замочується, нагрівається, фільтрується. Хміль додається у різні моменти для аромату і гіркоти.",
  },
  {
    step: "02",
    title: "Ферментація",
    description:
      "У мідних чанах дріжджі перетворюють цукор на алкоголь. 1-2 тижні залежно від сорту.",
  },
  {
    step: "03",
    title: "Дозрівання та розлив",
    description:
      "Пиво відстоюється, фільтрується (або ні — для нефільтрованих варіантів), розливається у танки або бочки.",
  },
];

const RULES = [
  {
    title: "Лише для 18+",
    description: "з документом",
  },
  {
    title: "За попереднім записом",
    description: "мінімум 4 особи в групі",
  },
  {
    title: "Максимум",
    description: "16 осіб в одній групі (більше — розділяємо)",
  },
  {
    title: "Не за кермом",
    description:
      "після туру краще залишитись у готелі або викликати таксі",
  },
];

export default function BreweryTourPage() {
  const primaryPhone = CONTACT_INFO.phone[0];
  const telHref = `tel:${primaryPhone.replace(/[^+\d]/g, "")}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Тур по пивоварні",
    serviceType: "Brewery Tour",
    description:
      "Екскурсія власною пивоварнею «Глухомань» з дегустацією 4 сортів крафтового пива і пивним снеком.",
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
        id="brewery-tour-jsonld"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(jsonLd)}
      </Script>

      {/* 1. HERO */}
      <section className="relative overflow-hidden bg-[#0b1410] text-[#faf6ec]">
        <Image
          src="/images/restaurant/craft_beer_glasses_snacks.jpg"
          alt="Крафтове пиво Глухомань"
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
              Пивоварня • Глухомань
            </p>
            <h1 className="font-display mt-6 text-5xl md:text-7xl text-[#faf6ec]">
              Тур по пивоварні
            </h1>
            <p className="font-display mt-3 text-2xl md:text-3xl italic text-[#e6d9b8]">
              «Глухомань»
            </p>
            <p className="mt-8 max-w-2xl text-base md:text-lg leading-relaxed text-[#faf6ec]/85">
              Власна крафтова пивоварня у серці комплексу — чеські і німецькі
              рецепти, артезіанська вода, мідні чани. Екскурсія, дегустація 4
              сортів і пивний снек. Для дорослих, які знають толк.
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
                Про пивоварню
              </p>
              <h2 className="font-display mt-5 text-4xl md:text-5xl text-[#0f1f18]">
                Крафт із <span className="italic">мідних</span> чанів
              </h2>
              <div className="mt-8 h-px w-16 bg-[#e6d9b8]" />
              <div className="mt-10 relative aspect-[4/5] overflow-hidden bg-[#1a3d2e]">
                <Image
                  src="/images/restaurant/about_craft_beer.jpg"
                  alt="Про крафтове пиво Глухомань"
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="space-y-6">
              <p className="text-base md:text-lg leading-relaxed text-[#0b1410]/80">
                Власна пивоварня «Глухомань» — гордість комплексу. Ми варимо
                крафтове пиво за традиційними чеськими і німецькими рецептами
                на місцевій воді з артезіанської свердловини. Тур включає
                екскурсію по виробництву, дегустацію 4 сортів пива і легкий
                пивний снек.
              </p>
              <p className="text-base md:text-lg leading-relaxed text-[#0b1410]/80">
                Гід-пивовар розповість про процес від солоду до бочки, покаже
                сучасне обладнання і традиційні мідні чани. Підходить для
                дорослих компаній (від 18 років), цінителів крафту і просто
                допитливих гостей.
              </p>
              <div className="pt-6 grid grid-cols-2 gap-px bg-[#e6d9b8]">
                <div className="bg-[#faf6ec] p-6">
                  <Droplets
                    className="h-6 w-6 text-[#1a3d2e]"
                    strokeWidth={1.25}
                  />
                  <p className="font-display mt-4 text-xl text-[#0f1f18]">
                    Артезіанська вода
                  </p>
                </div>
                <div className="bg-[#faf6ec] p-6">
                  <Factory
                    className="h-6 w-6 text-[#1a3d2e]"
                    strokeWidth={1.25}
                  />
                  <p className="font-display mt-4 text-xl text-[#0f1f18]">
                    Мідні чани
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
              III • Що включено
            </p>
            <h2 className="font-display mt-5 text-4xl md:text-5xl">
              Усе для <span className="italic">справжнього</span> туру
            </h2>
          </div>
          <div className="mt-16 grid gap-px bg-[#e6d9b8]/20 md:grid-cols-2">
            {INCLUDED.map(({ numeral, icon: Icon, title, description }) => (
              <div key={title} className="bg-[#0f1f18] p-10 md:p-12">
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

      {/* 4. BEERS */}
      <section className="bg-[#faf6ec]">
        <div className="max-w-6xl mx-auto px-6 py-28 md:py-36">
          <div className="grid gap-16 md:grid-cols-12 md:gap-20">
            <div className="md:col-span-4">
              <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]">
                IV • Сорти пива
              </p>
              <h2 className="font-display mt-5 text-4xl md:text-5xl text-[#0f1f18]">
                Чотири <span className="italic">смаки</span>
              </h2>
              <div className="mt-8 h-px w-16 bg-[#e6d9b8]" />
              <div className="mt-10 relative aspect-square overflow-hidden bg-[#1a3d2e]"
                style={{
                  borderRadius: "62% 38% 54% 46% / 48% 55% 45% 52%",
                }}
              >
                <Image
                  src="/images/sauna/craft_beer_coffee_table.jpg"
                  alt="Крафтове пиво на столику"
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-8 grid gap-px bg-[#e6d9b8] sm:grid-cols-2">
              {BEERS.map((beer) => (
                <div
                  key={beer.name}
                  className="bg-[#faf6ec] p-8 md:p-10"
                >
                  <Wine
                    className="h-6 w-6 text-[#1a3d2e]"
                    strokeWidth={1.25}
                  />
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
                V • Процес
              </p>
              <h2 className="font-display mt-5 text-4xl md:text-5xl">
                Від солоду <span className="italic">до бочки</span>
              </h2>
              <div className="mt-8 h-px w-16 bg-[#e6d9b8]/50" />
              <p className="mt-8 text-sm md:text-base leading-relaxed text-[#faf6ec]/75">
                Кожен сорт народжується через три етапи. Гід-пивовар проведе
                вас усіма ними і покаже, що відбувається у мідних чанах.
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
                VI • Формат туру
              </p>
              <h2 className="font-display mt-5 text-4xl md:text-5xl text-[#0f1f18]">
                Дев&apos;яносто <span className="italic">хвилин</span>
              </h2>
              <div className="mt-8 h-px w-16 bg-[#e6d9b8]" />
              <p className="mt-8 text-base md:text-lg leading-relaxed text-[#0b1410]/80">
                Стандартний тур триває 90 хвилин. Починаємо з короткої
                презентації історії пивоварні, потім — екскурсія виробництвом
                (10-15 хвилин), далі дегустація 4 сортів з легкою закускою (60
                хвилин). Можна також замовити розширений тур з майстер-класом
                або обідом у ресторані «Глухомань».
              </p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-[#e6d9b8] self-start">
              <div className="bg-[#f4ecd8] p-8 md:p-10">
                <Clock
                  className="h-6 w-6 text-[#1a3d2e]"
                  strokeWidth={1.25}
                />
                <p className="font-display mt-6 text-4xl md:text-5xl text-[#0f1f18]">
                  90
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]">
                  хвилин
                </p>
              </div>
              <div className="bg-[#f4ecd8] p-8 md:p-10">
                <Wine
                  className="h-6 w-6 text-[#1a3d2e]"
                  strokeWidth={1.25}
                />
                <p className="font-display mt-6 text-4xl md:text-5xl text-[#0f1f18]">
                  4
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]">
                  сорти
                </p>
              </div>
              <div className="bg-[#f4ecd8] p-8 md:p-10">
                <Users
                  className="h-6 w-6 text-[#1a3d2e]"
                  strokeWidth={1.25}
                />
                <p className="font-display mt-6 text-4xl md:text-5xl text-[#0f1f18]">
                  4–16
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]">
                  осіб
                </p>
              </div>
              <div className="bg-[#f4ecd8] p-8 md:p-10">
                <Beer
                  className="h-6 w-6 text-[#1a3d2e]"
                  strokeWidth={1.25}
                />
                <p className="font-display mt-6 text-4xl md:text-5xl text-[#0f1f18]">
                  18+
                </p>
                <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]">
                  вік
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
                VII • Правила
              </p>
              <h2 className="font-display mt-5 text-4xl md:text-5xl text-[#0f1f18]">
                Зверніть <span className="italic">увагу</span>
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
                      <p className="font-display text-xl text-[#0f1f18]">
                        {rule.title}
                      </p>
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
                Ціни
              </p>
              <h2 className="font-display mt-5 text-4xl md:text-5xl text-[#0f1f18]">
                За <span className="italic">запитом</span>
              </h2>
              <div className="mt-8 h-px w-16 bg-[#e6d9b8]" />
              <p className="mt-8 text-base md:text-lg leading-relaxed text-[#0b1410]/80">
                Стандартний тур з дегустацією — за запитом. Знижки для груп
                від 8 осіб. Розширені формати (майстер-клас, обід) — окрема
                вартість.
              </p>
              <div className="mt-10 relative aspect-[4/3] overflow-hidden bg-[#1a3d2e]">
                <Image
                  src="/images/sauna/craft_beer_roasted_chicken.jpg"
                  alt="Крафтове пиво з печеною куркою"
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
          alt="Рустикальний бар Глухомань"
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
                VIII • Бронювання
              </p>
              <h2 className="font-display mt-5 text-4xl md:text-5xl">
                Заздалегідь <span className="italic">записатися</span> на тур
              </h2>
              <div className="mt-8 h-px w-16 bg-[#e6d9b8]/50" />
              <p className="mt-8 text-base leading-relaxed text-[#faf6ec]/80">
                Тур проводиться за попереднім записом. Зв&apos;яжіться з нами,
                щоб обрати дату та узгодити деталі — кількість осіб,
                додаткові опції, обід у ресторані.
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
                  Забронювати тур
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
