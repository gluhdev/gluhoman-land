import { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import { BLUR_DATA_URL } from '@/lib/blur-placeholder';
import { BookingButton } from '@/components/ui/BookingButton';
import {
  Phone,
  ArrowUpRight,
  ChevronDown,
  Baby,
  Waves,
  Droplets,
  Sun,
  Check,
  CalendarDays,
  ShieldCheck,
  Clock,
  Users,
  Heart,
  Shirt,
  Droplet,
  FileText,
} from 'lucide-react';
import { CONTACT_INFO } from '@/constants';

export const metadata: Metadata = {
  title: 'Аквапарк «Глухомань» — літо, вода та сонце для всієї родини',
  description:
    'Водні гірки, басейни з підігрівом та окрема дитяча зона. Цілий день відпочинку для всієї родини — від ранку до заходу сонця. Сезон: травень — вересень.',
  keywords:
    'аквапарк, глухомань, водні гірки, басейни, відпочинок, полтавська область, нижні млини, водні розваги',
  openGraph: {
    title: 'Аквапарк «Глухомань» — літо, вода та сонце',
    description:
      'Преміум аквапарк у Нижніх Млинах: гірки, басейни з підігрівом, дитяча зона, бар та лежаки під тінню.',
    type: 'website',
    locale: 'uk_UA',
    images: [
      {
        url: '/og-aquapark.jpg',
        width: 1200,
        height: 630,
        alt: 'Аквапарк Глухомань',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Аквапарк «Глухомань»',
    description:
      'Літній аквапарк у Нижніх Млинах: гірки, басейни, дитяча зона та бар.',
    images: ['/og-aquapark.jpg'],
  },
};

const phonePrimary = CONTACT_INFO.phone[0];
const telHref = `tel:${phonePrimary.replace(/\s+/g, '')}`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TouristAttraction',
  name: 'Аквапарк Глухомань',
  description:
    'Сучасний аквапарк рекреаційного комплексу Глухомань: водні гірки, басейни, дитяча зона, бар та зона відпочинку.',
  image: 'https://gluhoman.com.ua/images/akvapark.webp',
  telephone: phonePrimary,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'UA',
    addressRegion: 'Полтавська область',
    addressLocality: 'с. Нижні Млини',
  },
  isAccessibleForFree: false,
  publicAccess: true,
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '09:00',
      closes: '22:00',
    },
  ],
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Коли працює аквапарк?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Сезон триває з травня до вересня. Точну дату відкриття уточнюйте за телефоном — вона залежить від погоди.',
      },
    },
    {
      '@type': 'Question',
      name: 'Чи є дитяча зона?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Так, у нас є окрема дитяча зона з мілководними басейнами, маленькими гірками та водними іграшками. Безпека гарантована — за дітьми наглядають професійні рятувальники.',
      },
    },
    {
      '@type': 'Question',
      name: 'Чи можна приходити з немовлятами?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Так, ви можете прийти з немовлям, але купання дозволено лише в дитячих басейнах. Шафки та стільчики для годування — за запитом.',
      },
    },
    {
      '@type': 'Question',
      name: 'Чи є рятувальники?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'На території аквапарку постійно чергують професійні рятувальники з медичною підготовкою.',
      },
    },
    {
      '@type': 'Question',
      name: 'Що включено у вартість?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Вхід до аквапарку, доступ до всіх басейнів, гірок, шафок, душових та зони відпочинку. Рушники — за окрему оплату або за запитом.',
      },
    },
    {
      '@type': 'Question',
      name: 'Чи можна забронювати окрему зону для свята?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Так, ми приймаємо групові замовлення для днів народження, корпоративів та інших свят. Зв'яжіться з нами для деталей.",
      },
    },
  ],
};

type Zone = {
  n: string;
  kicker: string;
  title: string;
  italic: string;
  description: string;
  features: string[];
  image: string;
  imageAlt: string;
};

const SHAPES = [
  '58% 42% 63% 37% / 45% 55% 45% 55%',
  '40% 60% 50% 50% / 55% 35% 65% 45%',
  '65% 35% 45% 55% / 50% 60% 40% 50%',
  '45% 55% 40% 60% / 60% 45% 55% 40%',
];
const ROTS = ['rotate(-2deg)', 'rotate(2.5deg)', 'rotate(-1.5deg)', 'rotate(2deg)'];

const zones: Zone[] = [
  {
    n: 'I',
    kicker: 'Вода і ігри',
    title: 'Дитяча зона',
    italic: 'для найменших',
    description:
      'Безпечні мілководні басейнчики, м’які гірочки та водні іграшки для наймолодших гостей — усе під постійним наглядом рятувальників.',
    features: ['Мілкі басейнчики', 'Міні гірки', 'Постійний нагляд'],
    image: '/images/akvapark.webp',
    imageAlt: 'Дитяча зона аквапарку Глухомань',
  },
  {
    n: 'II',
    kicker: 'Швидкість',
    title: 'Дорослі гірки',
    italic: 'та адреналін',
    description:
      'Захоплюючі швидкісні та звивисті спуски різного рівня складності — для підлітків, молоді та дорослих, які шукають трохи адреналіну.',
    features: ['Швидкісні спуски', 'Звивисті траси', 'Безпечні покриття'],
    image: '/images/akvapark.webp',
    imageAlt: 'Водні гірки аквапарку Глухомань',
  },
  {
    n: 'III',
    kicker: 'Тепла вода',
    title: 'Басейни',
    italic: 'з підігрівом',
    description:
      'Басейни різних глибин — від релаксаційних до спортивних. Джакузі для ідеального завершення дня біля води.',
    features: ['Мілководна зона', 'Басейн для плавання', 'Джакузі'],
    image: '/images/akvapark.webp',
    imageAlt: 'Басейни аквапарку Глухомань',
  },
  {
    n: 'IV',
    kicker: 'Тінь і спокій',
    title: 'Зона відпочинку',
    italic: 'під навісами',
    description:
      'Комфортні лежаки, тіньові навіси і бар із прохолодними напоями для приємних пауз між купанням.',
    features: ['Зручні лежаки', 'Тіньові навіси', 'Бар та снеки'],
    image: '/images/akvapark.webp',
    imageAlt: 'Зона відпочинку аквапарку Глухомань',
  },
];

const inclusions = [
  'Рушники для кожного гостя',
  'Індивідуальні шафки для речей',
  'Професійні рятувальники на всіх зонах',
  'Бар із напоями та снеками',
  'Душові та переодягальні',
  'Безкоштовний Wi-Fi',
];

const rules = [
  {
    icon: Clock,
    title: 'Режим роботи',
    text: 'Щоденно з 09:00 до 22:00, без вихідних.',
  },
  {
    icon: Users,
    title: 'Вікові обмеження',
    text: 'Діти до 12 років — лише у супроводі дорослих.',
  },
  {
    icon: ShieldCheck,
    title: 'Безпека',
    text: 'Професійні рятувальники чергують на всіх зонах постійно.',
  },
];

const faqItems = [
  {
    q: 'Коли працює аквапарк?',
    a: 'Сезон триває з травня до вересня. Точну дату відкриття уточнюйте за телефоном — вона залежить від погоди.',
  },
  {
    q: 'Чи є дитяча зона?',
    a: 'Так, у нас є окрема дитяча зона з мілководними басейнами, маленькими гірками та водними іграшками. Безпека гарантована — за дітьми наглядають професійні рятувальники.',
  },
  {
    q: 'Чи можна приходити з немовлятами?',
    a: 'Так, ви можете прийти з немовлям, але купання дозволено лише в дитячих басейнах. Шафки та стільчики для годування — за запитом.',
  },
  {
    q: 'Чи є рятувальники?',
    a: 'На території аквапарку постійно чергують професійні рятувальники з медичною підготовкою.',
  },
  {
    q: 'Що включено у вартість?',
    a: 'Вхід до аквапарку, доступ до всіх басейнів, гірок, шафок, душових та зони відпочинку. Рушники — за окрему оплату або за запитом.',
  },
  {
    q: 'Чи можна забронювати окрему зону для свята?',
    a: "Так, ми приймаємо групові замовлення для днів народження, корпоративів та інших свят. Зв'яжіться з нами для деталей.",
  },
];

export default function AquaparkPage() {
  return (
    <>
      <Script
        id="aquapark-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="aquapark-faq-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* 1. HERO — dark forest */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0b1410]">
        <Image
          fill
          priority
          src="/images/akvapark.webp"
          alt="Аквапарк Глухомань"
          className="object-cover opacity-55"
          sizes="100vw"
          quality={90}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1410]/40 via-[#0b1410]/20 to-[#0b1410]" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />

        <div className="relative z-10 max-w-5xl px-6 text-center text-[#f4ecd8]">
          <p className="mb-6 flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.32em] text-[#e6d9b8]">
            <span className="h-px w-10 bg-[#e6d9b8]/50" />
            Вода та сонце • II
            <span className="h-px w-10 bg-[#e6d9b8]/50" />
          </p>
          <h1
            className="font-display mb-6"
            style={{
              fontSize: 'clamp(3rem, 8vw, 7.5rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              fontWeight: 300,
            }}
          >
            Аквапарк
            <span className="block italic text-[#e6d9b8]">«Глухомань»</span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg md:text-xl font-light leading-relaxed text-[#f4ecd8]/80">
            Водні гірки, басейни з підігрівом та окрема дитяча зона. Цілий день
            відпочинку для всієї родини — від ранку до заходу сонця.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
            <BookingButton
              service="aquapark"
              className="inline-flex items-center gap-3 bg-[#e6d9b8] text-[#0f1f18] px-10 py-4 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#f4ecd8] transition"
            >
              Забронювати візит
              <ArrowUpRight className="h-4 w-4" />
            </BookingButton>
            <a
              href={telHref}
              className="inline-flex items-center gap-3 border-b border-[#e6d9b8]/40 pb-1 text-xs uppercase tracking-[0.22em] text-[#e6d9b8] hover:border-[#e6d9b8] transition"
            >
              <Phone className="h-3.5 w-3.5" />
              {phonePrimary}
            </a>
          </div>
        </div>
      </section>

      {/* 2. SEASON CALLOUT — cream */}
      <section className="bg-[#faf6ec] py-20 md:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-5 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/70">
            <span className="h-px w-8 bg-[#1a3d2e]/30" />
            Сезон 2026
            <span className="h-px w-8 bg-[#1a3d2e]/30" />
          </p>
          <h2
            className="font-display text-[#0f1f18]"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.25rem)',
              lineHeight: 1,
              letterSpacing: '-0.02em',
              fontWeight: 300,
            }}
          >
            Працюємо з <span className="italic">травня</span> до{' '}
            <span className="italic">вересня</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#0f1f18]/65">
            Графік відкриття залежить від погоди — уточнюйте за телефоном. У
            сезон аквапарк відкритий щодня з 09:00 до 22:00.
          </p>
          <a
            href={telHref}
            className="mt-10 inline-flex items-center gap-3 border-b border-[#1a3d2e]/40 pb-1 text-xs uppercase tracking-[0.22em] text-[#1a3d2e] hover:border-[#1a3d2e] transition"
          >
            <Phone className="h-3.5 w-3.5" />
            {phonePrimary}
          </a>
        </div>
      </section>

      {/* 3. ZONES — editorial cards on cream */}
      <section className="relative overflow-hidden bg-[#faf6ec] py-28 md:py-36">
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-12 lg:px-16">
          <div className="flex items-end justify-between gap-8 border-b border-[#0f1f18]/15 pb-10">
            <div>
              <p className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/80">
                <span className="h-px w-10 bg-[#1a3d2e]/40" />
                Чотири зони
              </p>
              <h2
                className="font-display text-[#0f1f18]"
                style={{
                  fontSize: 'clamp(2.25rem, 5.2vw, 5rem)',
                  lineHeight: 0.98,
                  letterSpacing: '-0.02em',
                  fontWeight: 300,
                }}
              >
                Простір для кожного —{' '}
                <span className="italic">від малюків до дорослих</span>
              </h2>
            </div>
            <div className="hidden max-w-xs text-sm leading-relaxed text-[#0f1f18]/65 md:block">
              Кожна зона створена з увагою до деталей: безпека, комфорт і
              простір для відпочинку всієї родини.
            </div>
          </div>

          <div className="mt-24 flex flex-col gap-32 md:gap-44">
            {zones.map((z, i) => {
              const reverse = i % 2 === 1;
              return (
                <article
                  key={z.n}
                  className="group grid grid-cols-12 items-center gap-y-10"
                >
                  {/* Image */}
                  <div
                    className={`col-span-12 lg:col-span-7 ${
                      reverse ? 'lg:col-start-6' : 'lg:col-start-1'
                    }`}
                  >
                    <div className="relative px-4 md:px-6">
                      <div
                        aria-hidden
                        className="absolute inset-6 -z-10 blur-3xl opacity-40"
                        style={{
                          background:
                            'radial-gradient(60% 50% at 50% 50%, rgba(134,180,120,0.45), transparent 70%)',
                        }}
                      />
                      <div
                        className="relative aspect-[5/4] w-full overflow-hidden"
                        style={{
                          borderRadius: SHAPES[i],
                          transform: ROTS[i],
                          boxShadow:
                            '0 40px 80px -30px rgba(15,31,24,0.35), 0 0 0 1px rgba(15,31,24,0.06) inset',
                        }}
                      >
                        <Image
                          src={z.image}
                          alt={z.imageAlt}
                          fill
                          sizes="(min-width: 1024px) 58vw, 100vw"
                          placeholder="blur"
                          blurDataURL={BLUR_DATA_URL}
                          className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.08]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1f18]/35 via-transparent to-[#0f1f18]/5" />
                        <div
                          className="absolute left-6 top-6 font-display text-2xl text-[#f4ecd8]/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                          style={{ fontWeight: 300 }}
                        >
                          {z.n}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text */}
                  <div
                    className={`col-span-12 lg:col-span-5 ${
                      reverse
                        ? 'lg:col-start-1 lg:row-start-1 lg:pr-12'
                        : 'lg:col-start-8 lg:pl-12'
                    }`}
                  >
                    <p className="mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-medium text-[#1a3d2e]/80">
                      <span className="h-px w-6 bg-[#1a3d2e]/40" />
                      {z.kicker}
                    </p>
                    <h3
                      className="font-display text-[#0f1f18]"
                      style={{
                        fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                        lineHeight: 1,
                        letterSpacing: '-0.02em',
                        fontWeight: 300,
                      }}
                    >
                      {z.title}
                      <br />
                      <span className="italic text-[#1a3d2e]">{z.italic}</span>
                    </h3>
                    <p className="mt-6 max-w-md text-base leading-relaxed text-[#0f1f18]/70">
                      {z.description}
                    </p>
                    <ul className="mt-8 space-y-3">
                      {z.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-3 text-sm text-[#0f1f18]/80"
                        >
                          <span className="h-px w-6 bg-[#1a3d2e]/40" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3b. SLIDE CATALOG — cream */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-20 max-w-3xl">
            <p className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/80">
              <span className="h-px w-10 bg-[#1a3d2e]/40" />
              Каталог гірок
            </p>
            <h2
              className="font-display text-[#0f1f18]"
              style={{
                fontSize: 'clamp(2.25rem, 5vw, 4.25rem)',
                lineHeight: 0.98,
                letterSpacing: '-0.02em',
                fontWeight: 300,
              }}
            >
              Чотири траси — <span className="italic">чотири настрої</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#0f1f18]/65">
              Від швидкісних спусків до спокійних сімейних маршрутів. Кожна
              гірка має свій характер, свою довжину та свій темп.
            </p>
          </div>

          <div className="border-t border-[#0f1f18]/15">
            {[
              {
                n: 'I',
                name: 'Лісова блискавка',
                stats: [
                  { k: 'Довжина', v: '68 м' },
                  { k: 'Перепад', v: '12 м' },
                  { k: 'Зріст', v: 'від 140 см' },
                ],
                text: 'Швидкісний спуск з двох паралельних трас. Перепад дванадцять метрів, час проходження — шість секунд. Для відвідувачів від 140 сантиметрів зросту.',
              },
              {
                n: 'II',
                name: 'Чорний тунель',
                stats: [
                  { k: 'Довжина', v: '82 м' },
                  { k: 'Вік', v: '12+' },
                  { k: 'Тип', v: 'закрита' },
                ],
                text: 'Закрита труба з крутими поворотами у повній темряві. Сцена «лісова печера» з підсвіткою та звуком. Не для тих, хто боїться невідомого.',
              },
              {
                n: 'III',
                name: 'Рафтинг «Родина»',
                stats: [
                  { k: 'Місткість', v: '4 особи' },
                  { k: 'Темп', v: 'спокійний' },
                  { k: 'Для', v: 'родини' },
                ],
                text: 'Широка гірка, яка приймає до чотирьох осіб одночасно. Спокійний темп і безпечна траєкторія — ідеально для першого спільного спуску всієї родини.',
              },
              {
                n: 'IV',
                name: 'Дитячий потічок',
                stats: [
                  { k: 'Висота', v: '2 м' },
                  { k: 'Вік', v: '4–8 років' },
                  { k: 'Нагляд', v: 'аніматор' },
                ],
                text: 'Невелика хвиляста гірка для наймолодших. Висота два метри, м’яке приземлення у мілководний басейнчик. Поруч завжди чергує аніматор.',
              },
            ].map((s) => (
              <article
                key={s.n}
                className="grid grid-cols-12 items-start gap-6 border-b border-[#0f1f18]/15 py-12 md:py-16"
              >
                <div className="col-span-12 md:col-span-1">
                  <div
                    className="font-display text-3xl text-[#1a3d2e]"
                    style={{ fontWeight: 300 }}
                  >
                    {s.n}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-5">
                  <h3
                    className="font-display italic text-[#0f1f18]"
                    style={{
                      fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                      lineHeight: 1,
                      letterSpacing: '-0.01em',
                      fontWeight: 400,
                    }}
                  >
                    {s.name}
                  </h3>
                  <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                    {s.stats.map((st) => (
                      <div key={st.k}>
                        <div className="text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/60">
                          {st.k}
                        </div>
                        <div className="mt-1 font-display text-base text-[#0f1f18]">
                          {st.v}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-6 md:pl-8">
                  <p className="text-base leading-relaxed text-[#0f1f18]/70">
                    {s.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FAMILY — deep forest */}
      <section className="relative overflow-hidden bg-[#0f1f18] py-28 md:py-36 text-[#f4ecd8]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-12 items-center gap-y-12">
            <div className="col-span-12 lg:col-span-7">
              <div className="relative px-4 md:px-6">
                <div
                  aria-hidden
                  className="absolute inset-6 -z-10 blur-3xl opacity-50"
                  style={{
                    background:
                      'radial-gradient(60% 50% at 50% 50%, rgba(134,180,120,0.55), transparent 70%)',
                  }}
                />
                <div
                  className="relative aspect-[5/4] w-full overflow-hidden"
                  style={{
                    borderRadius: '55% 45% 58% 42% / 50% 55% 45% 50%',
                    transform: 'rotate(-1.5deg)',
                    boxShadow:
                      '0 40px 80px -30px rgba(0,0,0,0.55), 0 0 0 1px rgba(244,236,216,0.08) inset',
                  }}
                >
                  <Image
                    src="/images/restaurant/aquapark_entrance_family.jpg"
                    alt="Сім'я біля входу до аквапарку Глухомань"
                    fill
                    sizes="(min-width: 1024px) 58vw, 100vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5 lg:pl-12">
              <p className="mb-5 flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[#e6d9b8]/80">
                <span className="h-px w-6 bg-[#e6d9b8]/50" />
                Для всієї родини
              </p>
              <h2
                className="font-display text-[#f4ecd8]"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3.75rem)',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  fontWeight: 300,
                }}
              >
                Місце, де відпочиває
                <br />
                <span className="italic text-[#e6d9b8]">вся сім’я</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-[#f4ecd8]/75">
                Аквапарк Глухомань створений так, щоб кожен член родини знайшов
                своє улюблене заняття: малюки плескаються у безпечних мілких
                басейнчиках, підлітки куштують швидкісні гірки, а дорослі
                відпочивають у джакузі або на тіньових лежаках біля бару.
              </p>
              <p className="mt-4 max-w-md text-base leading-relaxed text-[#f4ecd8]/65">
                Наші рятувальники пильно стежать за порядком у всіх зонах —
                можете спокійно насолоджуватися сонячним днем, знаючи, що діти у
                надійних руках.
              </p>

              <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5">
                {[
                  { icon: Baby, label: 'Дитяча зона' },
                  { icon: ShieldCheck, label: 'Безпека 24/7' },
                  { icon: Sun, label: 'Літнє сонце' },
                  { icon: Waves, label: 'Вода з підігрівом' },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 text-sm text-[#f4ecd8]/80"
                  >
                    <Icon className="h-4 w-4 text-[#e6d9b8]" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INCLUDES / RULES — cream */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
            <div className="lg:col-span-5">
              <p className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/80">
                <span className="h-px w-8 bg-[#1a3d2e]/40" />
                Що включено
              </p>
              <h2
                className="font-display text-[#0f1f18]"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  fontWeight: 300,
                }}
              >
                Всі деталі —{' '}
                <span className="italic">про вас подбали</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-[#0f1f18]/65">
                Від рушника до прохолодного напою — ми подбали про кожну деталь,
                щоб ваш візит був комфортним від першої до останньої хвилини.
              </p>
            </div>

            <div className="lg:col-span-7">
              <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-5 border-t border-[#0f1f18]/15 pt-8">
                {inclusions.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-base text-[#0f1f18]/85"
                  >
                    <Check className="h-4 w-4 mt-1 text-[#1a3d2e] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-16 grid sm:grid-cols-3 gap-10 border-t border-[#0f1f18]/15 pt-10">
                {rules.map((r) => {
                  const Icon = r.icon;
                  return (
                    <div key={r.title}>
                      <Icon className="h-5 w-5 text-[#1a3d2e] mb-4" />
                      <h3 className="font-display text-xl text-[#0f1f18] mb-2">
                        {r.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-[#0f1f18]/65">
                        {r.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5b. SAFETY — deep forest */}
      <section className="relative overflow-hidden bg-[#0f1f18] py-28 md:py-36 text-[#f4ecd8]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="max-w-3xl">
            <p className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]/80">
              <span className="h-px w-10 bg-[#e6d9b8]/50" />
              Безпека та правила
            </p>
            <h2
              className="font-display text-[#f4ecd8]"
              style={{
                fontSize: 'clamp(2.25rem, 5vw, 4.5rem)',
                lineHeight: 0.98,
                letterSpacing: '-0.02em',
                fontWeight: 300,
              }}
            >
              Безпека понад усе —{' '}
              <span className="italic text-[#e6d9b8]">
                комфорт для кожного
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#f4ecd8]/70">
              Ми створили середовище, у якому можна повністю довіритися відпочинку.
              Професійна команда, суворі протоколи й чистота, яка не потребує
              пояснень.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 border-t border-[#e6d9b8]/20 pt-16">
            {[
              {
                icon: ShieldCheck,
                title: 'Рятувальники',
                text: 'Троє професійних рятувальників на зміну. Сертифікація Ministry of Sport та регулярні тренування.',
              },
              {
                icon: Heart,
                title: 'Медпункт',
                text: 'Медсестра на території, автоматичний дефібрилятор і повна аптечка — на випадок будь-яких ситуацій.',
              },
              {
                icon: Droplets,
                title: 'Контроль води',
                text: 'Хімічний аналіз кожні дві години. Автоматична система фільтрації та знезараження працює постійно.',
              },
              {
                icon: Users,
                title: 'Вік і зріст',
                text: 'Для кожної гірки — чіткі правила за віком та зростом. Персонал уважно стежить за дотриманням.',
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <Icon className="h-5 w-5 text-[#e6d9b8] mb-5" />
                <h3 className="font-display text-xl text-[#f4ecd8] mb-3" style={{ fontWeight: 400 }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-[#f4ecd8]/65">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5c. DAILY SCHEDULE — cream */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-20 max-w-3xl">
            <p className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/80">
              <span className="h-px w-10 bg-[#1a3d2e]/40" />
              Один день у аквапарку
            </p>
            <h2
              className="font-display text-[#0f1f18]"
              style={{
                fontSize: 'clamp(2.25rem, 5vw, 4.25rem)',
                lineHeight: 0.98,
                letterSpacing: '-0.02em',
                fontWeight: 300,
              }}
            >
              Від першого променя —{' '}
              <span className="italic">до золотого заходу</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#0f1f18]/65">
              Кожна година має свій настрій. Ось як зазвичай минає літній день
              на території аквапарку «Глухомань».
            </p>
          </div>

          <div className="border-t border-[#0f1f18]/15">
            {[
              {
                t: '09:00',
                h: 'Відкриття',
                d: 'Прохолодна вода, перші сонячні промені крізь дерева, майже пусті гірки. Час для тих, хто цінує тишу.',
              },
              {
                t: '11:00',
                h: 'Аніматори на старті',
                d: 'Аніматори починають активності для дітей біля дитячої зони — ігри, конкурси й водні пригоди.',
              },
              {
                t: '13:00',
                h: 'Обідня перерва',
                d: 'Тераса ресторану «Глухомань» — у трьох хвилинах пішки. Літнє меню, холодні напої, тіньові столики.',
              },
              {
                t: '15:00',
                h: 'Піковий час',
                d: 'Найбільше людей, найбільше сміху. Жива музика на літній площадці й черги біля улюблених гірок.',
              },
              {
                t: '18:00',
                h: 'Вечірні знижки',
                d: 'Натовп рідшає, вода залишається теплою, а сонце стає золотим. Найкрасивіша година дня.',
              },
              {
                t: '21:00',
                h: 'Закриття',
                d: 'Повертаємось у готель «Глухомань» — теплий душ, вечеря та довгий спокійний сон у лісовій тиші.',
              },
            ].map((row, idx, arr) => (
              <div
                key={row.t}
                className={`grid grid-cols-12 items-start gap-6 py-10 md:py-12 ${
                  idx !== arr.length - 1 ? 'border-b border-[#0f1f18]/15' : ''
                }`}
              >
                <div className="col-span-12 md:col-span-3">
                  <div
                    className="font-display text-[#e6d9b8]"
                    style={{
                      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                      lineHeight: 1,
                      fontWeight: 300,
                      letterSpacing: '-0.02em',
                      WebkitTextStroke: '1px #1a3d2e',
                    }}
                  >
                    {row.t}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-4 md:border-l md:border-[#0f1f18]/15 md:pl-8">
                  <h3
                    className="font-display italic text-[#0f1f18]"
                    style={{
                      fontSize: 'clamp(1.5rem, 2.4vw, 2rem)',
                      lineHeight: 1.05,
                      fontWeight: 400,
                    }}
                  >
                    {row.h}
                  </h3>
                </div>
                <div className="col-span-12 md:col-span-5 md:border-l md:border-[#0f1f18]/15 md:pl-8">
                  <p className="text-base leading-relaxed text-[#0f1f18]/70">
                    {row.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PRICING — cream editorial */}
      <section className="bg-[#f4ecd8] py-28 md:py-36">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="mb-6 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/80">
            <span className="h-px w-8 bg-[#1a3d2e]/40" />
            Тарифи
            <span className="h-px w-8 bg-[#1a3d2e]/40" />
          </p>
          <h2
            className="font-display text-[#0f1f18]"
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 4rem)',
              lineHeight: 0.98,
              letterSpacing: '-0.02em',
              fontWeight: 300,
            }}
          >
            Ціни — <span className="italic">за запитом</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-base md:text-lg leading-relaxed text-[#0f1f18]/65">
            Щоб ви завжди отримували актуальну інформацію про сімейні пакети,
            акції та групові замовлення, ми радимо звертатися напряму. Один
            дзвінок — і ми підкажемо найкраще рішення для вашої родини.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
            <a
              href={telHref}
              className="inline-flex items-center gap-3 bg-[#0f1f18] text-[#f4ecd8] px-10 py-4 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#1a3d2e] transition"
            >
              <Phone className="h-3.5 w-3.5" />
              {phonePrimary}
            </a>
            <BookingButton
              service="aquapark"
              className="inline-flex items-center gap-3 border-b border-[#1a3d2e]/40 pb-1 text-xs uppercase tracking-[0.22em] text-[#1a3d2e] hover:border-[#1a3d2e] transition"
            >
              Забронювати візит
              <ArrowUpRight className="h-3.5 w-3.5" />
            </BookingButton>
          </div>
        </div>
      </section>

      {/* 7. FAQ — cream */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <p className="mb-6 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/80">
              <span className="h-px w-8 bg-[#1a3d2e]/40" />
              Питання та відповіді
              <span className="h-px w-8 bg-[#1a3d2e]/40" />
            </p>
            <h2
              className="font-display text-[#0f1f18]"
              style={{
                fontSize: 'clamp(2.25rem, 5vw, 4rem)',
                lineHeight: 0.98,
                letterSpacing: '-0.02em',
                fontWeight: 300,
              }}
            >
              Часті <span className="italic">запитання</span>
            </h2>
          </div>

          <div className="divide-y divide-[#0f1f18]/15 border-y border-[#0f1f18]/15">
            {faqItems.map((item) => (
              <details
                key={item.q}
                className="group py-6 md:py-7"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none gap-6">
                  <span className="font-display text-xl md:text-2xl text-[#0f1f18]" style={{ fontWeight: 400 }}>
                    {item.q}
                  </span>
                  <ChevronDown className="h-5 w-5 text-[#1a3d2e] transition-transform group-open:rotate-180 flex-shrink-0" />
                </summary>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-[#0f1f18]/70">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 7b. PACKING LIST — cream */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-b border-[#0f1f18]/15 pb-10">
            <div className="max-w-xl">
              <p className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/80">
                <span className="h-px w-10 bg-[#1a3d2e]/40" />
                Що взяти з собою
              </p>
              <h2
                className="font-display text-[#0f1f18]"
                style={{
                  fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  fontWeight: 300,
                }}
              >
                Коротка <span className="italic">валіза</span>
              </h2>
            </div>
            <p className="max-w-sm text-base leading-relaxed text-[#0f1f18]/65">
              Усе інше можна орендувати або купити на місці — рушники, шапочки,
              крем і прохолодні напої чекають на ресепшені.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              {
                icon: Shirt,
                title: 'Одяг',
                text: 'Купальник або плавки, шльопанці та шапочка для басейнів — обов’язкова в усіх спортивних зонах.',
              },
              {
                icon: Sun,
                title: 'Захист',
                text: 'Сонцезахисний крем SPF 50, капелюх або панама для тіні. Сонце у Нижніх Млинах — щедре.',
              },
              {
                icon: Droplet,
                title: 'Комфорт',
                text: 'Рушник (або орендуйте на місці) та пляшка питної води. Решту принесе бар.',
              },
              {
                icon: FileText,
                title: 'Документи',
                text: 'Паспорт для дорослих і квиток на вхід. Ключ від шафки — отримаєте на ресепшені.',
              },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <Icon className="h-5 w-5 text-[#1a3d2e] mb-5" />
                <h3
                  className="font-display text-xl text-[#0f1f18] mb-3"
                  style={{ fontWeight: 400 }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-[#0f1f18]/65">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. BOOKING CTA — deep forest */}
      <section className="relative overflow-hidden bg-[#0f1f18] py-28 md:py-36 text-[#f4ecd8]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <p className="mb-6 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]/80">
            <span className="h-px w-8 bg-[#e6d9b8]/50" />
            <CalendarDays className="h-3.5 w-3.5" />
            Літній сезон
            <span className="h-px w-8 bg-[#e6d9b8]/50" />
          </p>
          <h2
            className="font-display text-[#f4ecd8]"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              fontWeight: 300,
            }}
          >
            Готові до <span className="italic text-[#e6d9b8]">розваг?</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-base md:text-lg font-light leading-relaxed text-[#f4ecd8]/75">
            Забронюйте свій візит уже зараз — і ми підготуємо для вас найкращий
            день біля води.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-5 items-center justify-center">
            <BookingButton
              service="aquapark"
              className="inline-flex items-center gap-3 bg-[#e6d9b8] text-[#0f1f18] px-10 py-4 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#f4ecd8] transition"
            >
              Забронювати візит
              <ArrowUpRight className="h-4 w-4" />
            </BookingButton>
            <a
              href={telHref}
              className="inline-flex items-center gap-3 border-b border-[#e6d9b8]/40 pb-1 text-xs uppercase tracking-[0.22em] text-[#e6d9b8] hover:border-[#e6d9b8] transition"
            >
              <Phone className="h-3.5 w-3.5" />
              {phonePrimary}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
