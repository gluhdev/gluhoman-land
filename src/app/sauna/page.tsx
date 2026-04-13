import { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import { BLUR_DATA_URL } from '@/lib/blur-placeholder';
import { GalleryGrid } from '@/components/ui/GalleryGrid';
import {
  Phone,
  Flame,
  Droplets,
  Leaf,
  Heart,
  Sparkles,
  Coffee,
  Bath,
  Send,
  Clock,
  Flower2,
  Beer,
  Flower,
  Sun,
  Snowflake,
} from 'lucide-react';
import { CONTACT_INFO } from '@/constants';

export const metadata: Metadata = {
  title: 'Лазня на дровах Глухомань — Чани, віники та масажі під Полтавою',
  description:
    'Лазня на дровах у комплексі «Глухомань»: чани з карпатськими травами, дубові та бамбукові віники, масажі, кімнати відпочинку з самоварами. Традиційне українське СПА під Полтавою.',
  openGraph: {
    title: 'Лазня на дровах Глухомань — Тіло та дух',
    description:
      'Чани на дровах, віники, масажі та кімнати відпочинку з самоварами у комплексі «Глухомань».',
    type: 'website',
    locale: 'uk_UA',
    images: [
      {
        url: '/og-sauna.jpg',
        width: 1200,
        height: 630,
        alt: 'Лазня на дровах Глухомань',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Лазня на дровах Глухомань',
    description:
      'Чани на дровах з карпатськими травами, віники, масажі та чайна церемонія.',
    images: ['/og-sauna.jpg'],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HealthAndBeautyBusiness',
  name: 'Лазня на дровах «Глухомань»',
  description:
    'Традиційна українська лазня на дровах з купіллю, кімнатою відпочинку та трав\'яними чаями у рекреаційному комплексі «Глухомань».',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'UA',
    addressRegion: 'Полтавська область',
    addressLocality: 'Нижні Млини',
    streetAddress: CONTACT_INFO.address,
  },
  telephone: CONTACT_INFO.phone[0],
  priceRange: '$$',
  image: '/images/sauna/exterior_small_sauna_building.jpg',
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
      opens: '10:00',
      closes: '22:00',
    },
  ],
};

const concepts = [
  {
    icon: Flame,
    title: 'Парна',
    desc: 'Жива пара з печі-кам\'янки, аромат дерева та глибоке прогрівання тіла.',
  },
  {
    icon: Bath,
    title: 'Купіль',
    desc: 'Контрастне занурення у чан з карпатськими травами після парної.',
  },
  {
    icon: Sparkles,
    title: 'Масаж',
    desc: 'Класика, тайський стретчинг, бамбукові віники та стоун-терапія.',
  },
  {
    icon: Coffee,
    title: 'Чайна церемонія',
    desc: 'Самовари, мед від «Глухомані» та трав\'яні чаї у кімнатах відпочинку.',
  },
];

const programs = [
  {
    title: 'Класична лазня',
    desc: 'Традиційні заходи у парну, занурення у купіль і відпочинок з чаєм. Ідеально для відновлення після робочого тижня.',
    image: '/images/sauna/pool_big_sauna_indoor_diving.jpg',
  },
  {
    title: 'Сімейна релакс-програма',
    desc: 'Спокійний ритм для пари або родини: м\'якший температурний режим, трав\'яний чай, кімната відпочинку.',
    image: '/images/sauna/couple_drinking_beer_sauna_hats.jpg',
  },
  {
    title: 'Фіто-парна',
    desc: 'Парна з ароматичними травами, віниками та фіточаєм — для глибокого розслаблення тіла й дихання.',
    image: '/images/sauna/chan_carpathian_herbs_steam.jpg',
  },
];

const priceLists = [
  { src: '/images/sauna/pricelist_sauna_full.jpg', alt: 'Прайс лазні та купелі', caption: 'Лазня та купіль' },
  { src: '/images/sauna/pricelist_massages.jpg', alt: 'Прайс масажів', caption: 'Масажі' },
  { src: '/images/sauna/pricelist_health_program_bogatyr.jpg', alt: 'Програма Богатир', caption: 'Оздоровча програма «Богатир»' },
  { src: '/images/sauna/pricelist_health_program_sokil.jpg', alt: 'Програма Сокіл', caption: 'Оздоровча програма «Сокіл»' },
  { src: '/images/sauna/pricelist_zdorovyachok.jpg', alt: 'Дитяча програма', caption: 'Дитяча програма «Здоров\'ячок»' },
  { src: '/images/sauna/pricelist_services2.jpg', alt: 'Додаткові послуги', caption: 'Додаткові послуги' },
];

const massages = [
  {
    title: 'Класичний масаж',
    desc: 'Глибоке розслаблення м\'язів спини та відновлення після парної.',
    image: '/images/sauna/massage_classic_back.jpg',
  },
  {
    title: 'Тайський стретчинг',
    desc: 'Витягнення та гнучкість тіла за давньою тайською традицією.',
    image: '/images/sauna/massage_thai_stretching.jpg',
  },
  {
    title: 'Бамбукові віники',
    desc: 'Тонізуюча процедура бамбуковими віниками для пружності шкіри.',
    image: '/images/sauna/massage_bamboo_broom_therapist.jpg',
  },
  {
    title: 'Стоун-терапія',
    desc: 'Гарячі камені та ефірні олії для глибокої гармонії тіла.',
    image: '/images/sauna/stone_massage_hot_stones_back.jpg',
  },
];

const atmosphereGallery = [
  { src: '/images/sauna/chan_citrus_couple_night.jpg', alt: 'Чан з цитрусами вночі', caption: 'Чан вночі' },
  { src: '/images/sauna/couple_drinking_beer_sauna_hats.jpg', alt: 'Пара у лазневих шапках', caption: 'У шапках для парної' },
  { src: '/images/sauna/relaxation_room_samovar_interior.jpg', alt: 'Кімната відпочинку із самоваром', caption: 'Кімната із самоваром' },
  { src: '/images/sauna/honey_jar_gluhoman.jpg', alt: 'Мед від Глухомані', caption: 'Мед від «Глухомані»' },
  { src: '/images/sauna/relaxation_room_big_sauna_leather_sofa.jpg', alt: 'Шкіряні дивани кімнати відпочинку', caption: 'Кімната відпочинку' },
  { src: '/images/sauna/chan_exterior_stone_steps.jpg', alt: 'Зовнішня купіль зі кам\'яними сходами', caption: 'Купіль на природі' },
];

const benefits = [
  { icon: Heart, title: 'Серце та судини', desc: 'Тренування судин завдяки чергуванню тепла та холоду.' },
  { icon: Leaf, title: 'Шкіра та дихання', desc: 'Очищення пор, оновлення шкіри та глибоке дихання трав.' },
  { icon: Droplets, title: 'Детокс організму', desc: 'Виведення токсинів через піт, легкість тіла наступного ранку.' },
  { icon: Flame, title: 'М\'язи та сон', desc: 'Глибоке розслаблення м\'язів та спокійний сон після процедур.' },
];

const tips = [
  'Не їжте щільно за 1–2 години до парної.',
  'Пийте достатньо води та трав\'яного чаю між заходами.',
  'Візьміть із собою змінний одяг, шапку для парної та рушник.',
  'Уникайте алкоголю до та під час процедур.',
  'За хронічних захворювань — порадьтеся з лікарем.',
];

export default function SaunaPage() {
  const phoneHref = `tel:${CONTACT_INFO.phone[0].replace(/\s+/g, '')}`;

  return (
    <>
      <Script id="sauna-jsonld" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>

      {/* 1. HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0b1410]">
        <Image
          fill
          priority
          src="/images/sauna/exterior_small_sauna_building.jpg"
          alt="Будівля лазні на дровах у Глухомані серед природи"
          className="object-cover opacity-60"
          sizes="100vw"
          quality={90}
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1410]/30 via-[#0b1410]/20 to-[#0b1410]" />
        <div className="relative z-10 max-w-5xl px-6 text-center text-[#f4ecd8]">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#e6d9b8] mb-6">
            Тіло та дух • IV
          </p>
          <h1 className="font-display text-5xl md:text-8xl leading-[0.9] mb-6">
            Лазня
            <span className="block italic text-[#e6d9b8]">на дровах</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-[#f4ecd8]/80 mb-10 font-light leading-relaxed">
            Чани на дровах з карпатськими травами, дубові та бамбукові віники,
            масажі і кімнати відпочинку з самоварами.
          </p>
          <a
            href={phoneHref}
            className="inline-flex items-center gap-3 bg-[#e6d9b8] text-[#0f1f18] px-10 py-4 font-medium tracking-wide hover:bg-[#f4ecd8] transition"
          >
            Зателефонувати <Phone className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* 2. PHILOSOPHY */}
      <section className="bg-[#faf6ec] py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/70 mb-5">
              Філософія лазні
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-[#0f1f18] leading-[1.05] mb-8">
              Українська лазня —
              <span className="block italic text-[#1a3d2e]">це обряд, не послуга</span>
            </h2>
            <p className="text-[#0f1f18]/75 text-lg md:text-xl font-light leading-relaxed">
              У «Глухомані» лазня на дровах живе так, як це робили діди: жива пара
              з печі-кам&apos;янки, дубові та бамбукові віники, чани з карпатськими
              травами під відкритим небом і неспішна чайна церемонія між заходами.
              Це чотири рухи одного ритуалу, які повертають тіло і дух до
              рівноваги.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e6d9b8]">
            {concepts.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-[#faf6ec] p-10 flex flex-col items-start"
              >
                <Icon className="w-7 h-7 text-[#1a3d2e] mb-6" strokeWidth={1.25} />
                <h3 className="font-display text-2xl text-[#0f1f18] mb-3">
                  {title}
                </h3>
                <p className="text-sm text-[#0f1f18]/70 leading-relaxed font-light">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* A. UKRAINIAN TRADITION */}
      <section className="bg-[#0f1f18] py-28 md:py-36 text-[#f4ecd8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8] mb-5">
              Традиція • 1000 років
            </p>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.05] mb-10">
              Парна як обряд
              <span className="block italic text-[#e6d9b8]">не просто баня</span>
            </h2>
            <div className="space-y-6 text-[#f4ecd8]/75 font-light leading-relaxed text-lg">
              <p>
                Українська лазня — це не просто купання у гарячій воді. Це ритуал,
                що передавався від баби до онуки, від діда до внука. Дубовий віник,
                трав&apos;яний настій, холодний кухоль квасу — кожна деталь має значення.
              </p>
              <p>
                У «Глухомані» ми відроджуємо цю традицію у її автентичному вигляді.
                Лазня топиться дровами — лише березовими і дубовими. Воду беремо з
                артезіанської свердловини. Трави збираємо самі, у Карпатах і на
                місцевих луках.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1a3d2e]/40 mt-12">
            {[
              { icon: Leaf, title: 'Березовий віник', desc: 'Власний збір, суха в\'язка' },
              { icon: Droplets, title: 'Артезіанська вода', desc: 'Глибинна свердловина' },
              { icon: Flower2, title: 'Карпатські трави', desc: 'Ручний збір у горах' },
              { icon: Beer, title: 'Квас з пивоварні', desc: 'Подача на заходи' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-[#0f1f18] p-8 flex flex-col items-start">
                <Icon className="w-7 h-7 text-[#e6d9b8] mb-5" strokeWidth={1.25} />
                <h3 className="font-display text-xl text-[#f4ecd8] mb-2">{title}</h3>
                <p className="text-xs text-[#f4ecd8]/60 font-light tracking-wide">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PROGRAMS */}
      <section className="bg-[#faf6ec] py-24 md:py-32 border-t border-[#e6d9b8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/70 mb-5">
              Програми
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-[#0f1f18] leading-[1.05]">
              Три ритми
              <span className="block italic text-[#1a3d2e]">однієї лазні</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {programs.map((p, i) => (
              <article key={p.title} className="group flex flex-col">
                <div
                  className="relative aspect-[4/5] mb-8 overflow-hidden"
                  style={{
                    borderRadius:
                      i === 0
                        ? '60% 40% 55% 45% / 50% 60% 40% 50%'
                        : i === 1
                        ? '45% 55% 40% 60% / 55% 45% 60% 40%'
                        : '50% 50% 60% 40% / 45% 55% 50% 50%',
                  }}
                >
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                </div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 mb-3">
                  {String(i + 1).padStart(2, '0')} / 03
                </p>
                <h3 className="font-display text-3xl text-[#0f1f18] mb-4">
                  {p.title}
                </h3>
                <p className="text-[#0f1f18]/70 font-light leading-relaxed mb-6">
                  {p.desc}
                </p>
                <a
                  href="#pricelist"
                  className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e] border-b border-[#1a3d2e]/40 pb-1 self-start hover:border-[#1a3d2e] transition"
                >
                  Дивитись прайс
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* B. BROOMS CATALOG */}
      <section className="bg-[#faf6ec] py-28 md:py-36 border-t border-[#e6d9b8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-end mb-20">
            <div className="md:col-span-2">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/70 mb-5">
                Каталог віників
              </p>
              <h2 className="font-display text-4xl md:text-6xl text-[#0f1f18] leading-[1.05]">
                Чотири в&apos;язки
                <span className="block italic text-[#1a3d2e]">одна традиція</span>
              </h2>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden hidden md:block">
              <Image
                src="/images/sauna/bamboo_whisks_brooms.png"
                alt="Віники для лазні"
                fill
                className="object-cover"
                sizes="33vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#e6d9b8]">
            {[
              {
                name: 'Дубовий',
                desc: 'Класика. Щільне листя, довгий термін використання, класична українська традиція. Виводить токсини, покращує кровообіг.',
                use: 'щотижня',
              },
              {
                name: 'Березовий',
                desc: 'Універсальний. М\'яке листя, тонкі гілки, заспокійлива дія. Гарно прогріває тіло, підходить для регулярних відвідувань.',
                use: 'щотижня',
              },
              {
                name: 'Ялівцевий',
                desc: 'Інтенсивний. Сильний хвойний аромат, бактерицидні властивості. Рекомендується для сезону застуд.',
                use: 'сезонно',
              },
              {
                name: 'Трав\'яний «Карпатський»',
                desc: 'Ексклюзив. Зелений збір з материнки, звіробою, м\'яти і чебрецю. Ароматерапія + фіто-ефект.',
                use: 'рідко',
              },
            ].map((b, i) => (
              <div key={b.name} className="bg-[#faf6ec] p-10 flex flex-col">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 mb-4">
                  {String(i + 1).padStart(2, '0')} / 04
                </p>
                <h3 className="font-display italic text-3xl text-[#0f1f18] mb-4">
                  {b.name}
                </h3>
                <p className="text-[#0f1f18]/70 font-light leading-relaxed mb-8 flex-1">
                  {b.desc}
                </p>
                <div className="flex items-center gap-3 pt-5 border-t border-[#e6d9b8]">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/60">
                    Використання
                  </span>
                  <span className="font-display italic text-lg text-[#1a3d2e]">
                    {b.use}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PRICELIST GALLERY (deep forest) */}
      <section id="pricelist" className="bg-[#0f1f18] py-24 md:py-32 text-[#f4ecd8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8] mb-5">
              Прайс-лист
            </p>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.05]">
              Усі ціни —
              <span className="block italic text-[#e6d9b8]">прозоро та чесно</span>
            </h2>
            <p className="mt-6 text-[#f4ecd8]/70 font-light max-w-2xl mx-auto">
              Натисніть на будь-яку картку, щоб збільшити прайс. Бронювання та уточнення — за телефоном.
            </p>
          </div>

          <GalleryGrid
            images={priceLists}
            columns={3}
            aspect="portrait"
            showCaptions
            itemClassName="bg-[#faf6ec] border-[#e6d9b8]"
          />
        </div>
      </section>

      {/* C. WELLNESS PROGRAMS */}
      <section className="bg-[#0f1f18] py-28 md:py-36 text-[#f4ecd8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8] mb-5">
              Оздоровчі програми
            </p>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.05]">
              Три ритуали
              <span className="block italic text-[#e6d9b8]">для тіла й духу</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1a3d2e]/40">
            {[
              {
                name: 'Богатир',
                subtitle: 'для чоловіків',
                duration: '3 години',
                desc: 'Класична парна + дубовий віник + холодна купіль + трав\'яний чай. Глибоке очищення, релакс м\'язів.',
              },
              {
                name: 'Берегиня',
                subtitle: 'для жінок',
                duration: '4 години',
                desc: 'Парна з карпатськими травами + медовий скраб + масаж + фіто-чай + холодне молочко з медом. Тонізація, омолодження шкіри.',
              },
              {
                name: 'Сімейна традиція',
                subtitle: 'для пар',
                duration: '5 годин',
                desc: 'Дві парни + купіль разом + чайна церемонія у кімнаті відпочинку + вечеря у ресторані «Глухомань». Спокійний вечір удвох.',
              },
            ].map((p, i) => (
              <article key={p.name} className="bg-[#0f1f18] p-10 flex flex-col">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]/70 mb-4">
                  Програма {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="font-display text-4xl text-[#f4ecd8] mb-2 leading-tight">
                  «{p.name}»
                </h3>
                <p className="font-display italic text-xl text-[#e6d9b8] mb-6">
                  {p.subtitle}
                </p>
                <span className="inline-block self-start bg-[#e6d9b8] text-[#0f1f18] px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] mb-6">
                  {p.duration}
                </span>
                <p className="text-sm text-[#f4ecd8]/70 font-light leading-relaxed mb-8 flex-1">
                  {p.desc}
                </p>
                <div className="pt-5 border-t border-[#1a3d2e]/60 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.22em] text-[#f4ecd8]/50">
                    Ціна за запитом
                  </span>
                  <a
                    href={phoneHref}
                    className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8] border-b border-[#e6d9b8]/40 pb-0.5 hover:border-[#e6d9b8] transition"
                  >
                    Запит
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MASSAGE & SPA */}
      <section className="bg-[#faf6ec] py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/70 mb-5">
              Масаж та СПА
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-[#0f1f18] leading-[1.05]">
              Чотири руки
              <span className="block italic text-[#1a3d2e]">для одного тіла</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {massages.map((m, i) => (
              <article key={m.title} className="flex flex-col">
                <div
                  className="relative aspect-square mb-6 overflow-hidden"
                  style={{
                    borderRadius:
                      i % 2 === 0
                        ? '58% 42% 52% 48% / 48% 58% 42% 52%'
                        : '45% 55% 48% 52% / 55% 45% 52% 48%',
                  }}
                >
                  <Image
                    src={m.image}
                    alt={m.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 25vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                </div>
                <h3 className="font-display text-2xl text-[#0f1f18] mb-3">
                  {m.title}
                </h3>
                <p className="text-sm text-[#0f1f18]/70 font-light leading-relaxed">
                  {m.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BENEFITS (deep forest motif) */}
      <section className="relative bg-[#0b1410] py-24 md:py-32 text-[#f4ecd8] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/sauna/chan_carpathian_herbs_steam.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8] mb-5">
              Користь
            </p>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.05]">
              Що лазня дає
              <span className="block italic text-[#e6d9b8]">тілу та духу</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1a3d2e]/40">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-[#0b1410] p-10 flex flex-col items-start">
                <Icon className="w-7 h-7 text-[#e6d9b8] mb-6" strokeWidth={1.25} />
                <h3 className="font-display text-xl text-[#f4ecd8] mb-3">{title}</h3>
                <p className="text-sm text-[#f4ecd8]/65 font-light leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PREPARATION TIPS */}
      <section className="bg-[#faf6ec] py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-16">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/70 mb-5">
              Як підготуватись
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-[#0f1f18] leading-[1.05]">
              Кілька порад
              <span className="block italic text-[#1a3d2e]">перед лазнею</span>
            </h2>
          </div>

          <ol className="divide-y divide-[#e6d9b8]">
            {tips.map((tip, i) => (
              <li key={tip} className="flex gap-4 sm:gap-8 py-6">
                <span className="font-display text-3xl italic text-[#1a3d2e] min-w-[3ch]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-[#0f1f18]/80 font-light leading-relaxed pt-2">
                  {tip}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 8. ATMOSPHERE GALLERY */}
      <section className="bg-[#faf6ec] py-24 md:py-32 border-t border-[#e6d9b8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/70 mb-5">
              Атмосфера
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-[#0f1f18] leading-[1.05]">
              Лазня
              <span className="block italic text-[#1a3d2e]">у кадрі</span>
            </h2>
          </div>

          <GalleryGrid images={atmosphereGallery} columns={3} aspect="landscape" />
        </div>
      </section>

      {/* 9. HOURS STRIP */}
      <section className="bg-[#f4ecd8] py-16 border-y border-[#e6d9b8]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <Clock className="w-6 h-6 text-[#1a3d2e] mx-auto mb-5" strokeWidth={1.25} />
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/70 mb-3">
            Графік роботи
          </p>
          <p className="font-display text-3xl md:text-5xl text-[#0f1f18] leading-tight">
            Щодня <span className="italic text-[#1a3d2e]">10:00 – 22:00</span>
          </p>
          <p className="mt-3 text-[#0f1f18]/70 font-light">
            за попереднім записом
          </p>
        </div>
      </section>

      {/* D. SEASONAL RITUALS */}
      <section className="bg-[#faf6ec] py-28 md:py-36 border-t border-[#e6d9b8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/70 mb-5">
              Календар року
            </p>
            <h2 className="font-display text-4xl md:text-6xl text-[#0f1f18] leading-[1.05]">
              Сезонні ритуали
              <span className="block italic text-[#1a3d2e]">лазні на дровах</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Flower, name: 'Весна', desc: 'Травневий збір трав, перший день для фіто-парної.' },
              { icon: Sun, name: 'Літо', desc: 'Купіль у природному ставку, холодний квас з пивоварні.' },
              { icon: Leaf, name: 'Осінь', desc: 'Дубовий віник, мед з власних пасік.' },
              { icon: Snowflake, name: 'Зима', desc: 'Санний спуск до купелі, чай з глінтвейном.' },
            ].map(({ icon: Icon, name, desc }, i) => (
              <div
                key={name}
                className={`p-10 flex flex-col border-[#e6d9b8] ${
                  i < 3 ? 'lg:border-r' : ''
                } ${i === 0 ? 'sm:border-r sm:border-b lg:border-b-0' : ''} ${
                  i === 1 ? 'sm:border-b lg:border-b-0' : ''
                } ${i === 2 ? 'sm:border-r' : ''}`}
              >
                <div className="inline-flex items-center gap-2 bg-[#e6d9b8] text-[#0f1f18] px-3 py-1 text-[10px] uppercase tracking-[0.22em] self-start mb-6">
                  Сезон
                </div>
                <Icon className="w-6 h-6 text-[#1a3d2e] mb-4" strokeWidth={1.25} />
                <h3 className="font-display italic text-3xl text-[#0f1f18] mb-4">
                  {name}
                </h3>
                <div className="w-10 h-px bg-[#1a3d2e]/40 mb-4" />
                <p className="text-sm text-[#0f1f18]/70 font-light leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. CTA */}
      <section className="bg-[#0f1f18] py-24 md:py-32 text-[#f4ecd8]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8] mb-5">
            Бронювання
          </p>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] mb-8">
            Готові до
            <span className="block italic text-[#e6d9b8]">справжньої лазні?</span>
          </h2>
          <p className="text-[#f4ecd8]/75 font-light max-w-2xl mx-auto mb-12 leading-relaxed">
            Забронюйте чан, парну та масаж заздалегідь — у вихідні місця розходяться швидко. Ми відповімо й допоможемо обрати програму під вас.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={phoneHref}
              className="inline-flex items-center justify-center gap-3 bg-[#e6d9b8] text-[#0f1f18] px-10 py-4 font-medium tracking-wide hover:bg-[#f4ecd8] transition"
            >
              <Phone className="w-4 h-4" />
              {CONTACT_INFO.phone[0]}
            </a>
            <a
              href="https://t.me/gluhoman"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 border border-[#e6d9b8]/50 text-[#f4ecd8] px-10 py-4 font-medium tracking-wide hover:bg-[#e6d9b8]/10 transition"
            >
              <Send className="w-4 h-4" />
              Telegram
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
