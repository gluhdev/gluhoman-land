import { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import { BLUR_DATA_URL } from '@/lib/blur-placeholder';
import { BookingButton } from '@/components/ui/BookingButton';
import { GalleryGrid } from '@/components/ui/GalleryGrid';
import {
  MapPin,
  Bed,
  Wifi,
  Car,
  Coffee,
  Baby,
  Leaf,
  UtensilsCrossed,
  Navigation as NavIcon,
  ArrowUpRight,
  Users,
  Ruler,
  Check,
  History,
  Star,
  Camera,
  Compass,
} from 'lucide-react';
import { CONTACT_INFO } from '@/constants';

export const metadata: Metadata = {
  title: 'Готель «Глухомань» — Проживання серед соснового лісу Полтавщини',
  description:
    'Готель «Глухомань» у с. Нижні Млини — затишні номери серед соснового лісу, авторська кухня, SPA та тиша природи. Ідеальне місце для відпочинку на Полтавщині.',
  keywords:
    'готель глухомань, проживання полтава, готель нижні млини, відпочинок полтавська область, номери, бронювання готелю',
  openGraph: {
    title: 'Готель «Глухомань» — Проживання серед соснового лісу Полтавщини',
    description:
      'Затишні номери серед соснового лісу, авторська кухня та тиша природи — ваш ідеальний відпочинок у Глухомані.',
    type: 'website',
    locale: 'uk_UA',
    images: [
      {
        url: '/og-hotel.jpg',
        width: 1200,
        height: 630,
        alt: 'Готель Глухомань',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Готель «Глухомань» — Проживання серед природи',
    description:
      'Затишні номери, авторська кухня та тиша природи у с. Нижні Млини.',
    images: ['/og-hotel.jpg'],
  },
};

const hotelJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Hotel',
  name: 'Готель Глухомань',
  description:
    'Готель у рекреаційному комплексі «Глухомань» — комфортні номери серед природи Полтавщини, з авторською кухнею, SPA та аквапарком.',
  image: [
    'https://gluhoman.com.ua/images/9.jpg',
    'https://gluhoman.com.ua/images/restaurant/hall_floor1_rustic_wide.jpg',
    'https://gluhoman.com.ua/images/restaurant/balcony_floor2_wooden_furniture.jpg',
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'UA',
    addressRegion: 'Полтавська область',
    addressLocality: 'с. Нижні Млини',
    streetAddress: 'с. Нижні Млини',
  },
  telephone: CONTACT_INFO.phone[0],
  priceRange: '$$',
  starRating: { '@type': 'Rating', ratingValue: '4' },
  checkinTime: '14:00',
  checkoutTime: '12:00',
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Безкоштовний Wi-Fi', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Безкоштовна парковка', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Сніданок', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Трансфер', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Дитяча кімната', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Ресторан', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'SPA', value: true },
  ],
  makesOffer: [
    {
      '@type': 'Offer',
      name: 'Номер «Стандарт»',
      description: 'Затишний номер для двох з краєвидом на ліс. 22 м², двоспальне ліжко.',
      priceCurrency: 'UAH',
      availability: 'https://schema.org/InStock',
      priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'UAH', description: 'За запитом' },
      itemOffered: {
        '@type': 'HotelRoom',
        name: 'Стандарт',
        occupancy: { '@type': 'QuantitativeValue', maxValue: 2 },
        bed: { '@type': 'BedDetails', typeOfBed: 'Двоспальне', numberOfBeds: 1 },
      },
    },
    {
      '@type': 'Offer',
      name: 'Номер «Сімейний»',
      description: 'Простора кімната для всієї родини. 36 м², двоспальне + диван.',
      priceCurrency: 'UAH',
      availability: 'https://schema.org/InStock',
      priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'UAH', description: 'За запитом' },
      itemOffered: {
        '@type': 'HotelRoom',
        name: 'Сімейний',
        occupancy: { '@type': 'QuantitativeValue', maxValue: 4 },
        bed: { '@type': 'BedDetails', typeOfBed: 'Двоспальне + диван', numberOfBeds: 2 },
      },
    },
    {
      '@type': 'Offer',
      name: 'Номер «Люкс»',
      description: 'Преміум-номер з окремою вітальнею і балконом. 55 м², king-size.',
      priceCurrency: 'UAH',
      availability: 'https://schema.org/InStock',
      priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'UAH', description: 'За запитом' },
      itemOffered: {
        '@type': 'HotelRoom',
        name: 'Люкс',
        occupancy: { '@type': 'QuantitativeValue', maxValue: 2 },
        bed: { '@type': 'BedDetails', typeOfBed: 'King-size', numberOfBeds: 1 },
      },
    },
  ],
};

const SHAPES = [
  '58% 42% 63% 37% / 45% 55% 45% 55%',
  '46% 54% 38% 62% / 55% 40% 60% 45%',
  '62% 38% 55% 45% / 40% 60% 40% 60%',
];

const ROTS = ['-2deg', '1.5deg', '-1deg'];

const features = [
  {
    icon: Leaf,
    title: 'Природа',
    italic: 'серед сосен',
    text: 'Сосновий ліс, чисте повітря й тиша за вікном номера.',
  },
  {
    icon: Bed,
    title: 'Комфорт',
    italic: 'до дрібниць',
    text: 'Ортопедичні матраци, лляна постіль і все необхідне для сну.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Кухня',
    italic: 'авторська',
    text: 'Ресторан комплексу — українські страви з локальних продуктів.',
  },
  {
    icon: NavIcon,
    title: 'Розташування',
    italic: '10 км від Полтави',
    text: 'Зручний під’їзд, безкоштовна парковка та трансфер на замовлення.',
  },
];

const rooms = [
  {
    type: 'Стандарт',
    italicSub: 'для двох',
    image: '/images/9.jpg',
    guests: 'до 2 осіб',
    size: '22 м²',
    description:
      'Затишний номер для двох з краєвидом на сосновий ліс. Усе необхідне для тихого відпочинку вдвох.',
    features: [
      'Двоспальне ліжко',
      'Краєвид на сосновий ліс',
      'Wi-Fi, ТВ, фен',
      'Ванна кімната з душем',
    ],
  },
  {
    type: 'Сімейний',
    italicSub: 'для родини',
    image: '/images/restaurant/hall_floor1_rustic_wide.jpg',
    guests: 'до 4 осіб',
    size: '36 м²',
    description:
      'Простора кімната для всієї родини з окремим спальним місцем для дітей та дитячим ліжечком за запитом.',
    features: [
      'Двоспальне ліжко + диван',
      'До 4 осіб',
      'Дитяче ліжечко за запитом',
      'Мінібар, ванна, ТВ',
    ],
  },
  {
    type: 'Люкс',
    italicSub: 'преміум',
    image: '/images/restaurant/balcony_floor2_wooden_furniture.jpg',
    guests: 'до 2 осіб',
    size: '55 м²',
    description:
      'Преміум-номер з окремою вітальнею, балконом та гідромасажною ванною — вищий рівень усамітнення.',
    features: [
      'King-size ліжко',
      'Гідромасажна ванна',
      'Балкон із краєвидом',
      'Кавомашина та сніданок у номер',
    ],
  },
];

const atmospherePhotos = [
  { src: '/images/9.jpg', alt: 'Готель Глухомань — фасад' },
  { src: '/images/33.jpg', alt: "Інтер'єр номера" },
  { src: '/images/restaurant/hall_fireplace_balcony.jpg', alt: 'Камін та балкон' },
  { src: '/images/restaurant/balcony_floor2_wooden_furniture.jpg', alt: "Балкон з дерев'яними меблями" },
  { src: '/images/restaurant/exterior_summer_terrace_water.jpg', alt: 'Тераса біля води' },
  { src: '/images/restaurant/decor_photozone_green_hedge.jpg', alt: 'Зелена альтанка' },
];

const amenities = [
  { icon: Wifi, label: 'Wi-Fi', hint: 'На всій території' },
  { icon: Car, label: 'Парковка', hint: 'Безкоштовна, під охороною' },
  { icon: Coffee, label: 'Сніданок', hint: 'Щоранку у ресторані' },
  { icon: NavIcon, label: 'Трансфер', hint: 'З Полтави, за запитом' },
  { icon: Baby, label: 'Дитяча кімната', hint: 'Ігрова зона для малечі' },
];

export default function HotelPage() {
  return (
    <div className="bg-[#faf6ec]">
      <Script id="hotel-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(hotelJsonLd)}
      </Script>

      {/* ───────────────────── HERO ───────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0b1410]">
        <Image
          src="/images/9.jpg"
          alt="Готель Глухомань серед соснового лісу"
          fill
          priority
          quality={85}
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1410]/40 via-[#0b1410]/20 to-[#0b1410]" />

        <div className="relative z-10 max-w-5xl px-6 text-center text-[#f4ecd8]">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#e6d9b8] mb-6">
            Проживання · I
          </p>
          <h1 className="font-display text-5xl md:text-8xl leading-[0.9] mb-8">
            Готель
            <span className="block italic text-[#e6d9b8] mt-2">«Глухомань»</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-[#f4ecd8]/80 mb-10 font-light leading-relaxed">
            Затишні номери серед соснового лісу Полтавщини, авторська кухня й тиша
            природи — місце, де час нарешті уповільнюється.
          </p>
          <BookingButton
            service="hotel"
            className="inline-flex items-center justify-center gap-3 bg-[#e6d9b8] text-[#0f1f18] px-8 sm:px-10 py-4 font-medium tracking-wide hover:bg-[#f4ecd8] transition-colors min-h-[44px]"
          >
            Забронювати номер <ArrowUpRight className="w-4 h-4" />
          </BookingButton>
        </div>
      </section>

      {/* ───────────────────── STORY ───────────────────── */}
      <section className="py-28 md:py-36 bg-[#faf6ec]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/70 font-medium mb-6">
                II · Про готель
              </p>
              <h2 className="font-display text-5xl md:text-6xl leading-[0.95] text-[#1a3d2e] mb-4">
                Тиша, що лікує.
              </h2>
              <p className="font-display italic text-3xl md:text-4xl text-[#1a3d2e]/70 mb-8">
                І стеля з дерева над головою.
              </p>
              <p className="text-[#0f1f18]/75 leading-relaxed mb-4">
                Ми збудували цей готель як притулок для тих, хто втомився від міста.
                Номери ховаються серед сосен, вікна відчиняються у ліс, а зранку вас
                будить не будильник, а світло крізь шторки й щебет птахів.
              </p>
              <p className="text-[#0f1f18]/75 leading-relaxed">
                Усі матеріали — натуральні. Усі дрібниці — продумані. А все, що вам
                знадобиться, — уже чекає в межах кількох хвилин пішки: ресторан,
                аквапарк, сауни й озеро.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="bg-[#f4ecd8] border border-[#e6d9b8] p-7 rounded-2xl transition-transform duration-500 hover:-translate-y-1"
                    style={{ transform: `rotate(${i % 2 === 0 ? '-0.6deg' : '0.8deg'})` }}
                  >
                    <Icon className="w-6 h-6 text-[#1a3d2e] mb-5" strokeWidth={1.5} />
                    <h3 className="font-display text-2xl text-[#1a3d2e] leading-tight">
                      {f.title}
                    </h3>
                    <p className="font-display italic text-lg text-[#1a3d2e]/60 mb-3">
                      {f.italic}
                    </p>
                    <p className="text-[13px] text-[#0f1f18]/70 leading-relaxed">
                      {f.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────── HERITAGE TIMELINE ───────────────────── */}
      <section className="py-28 md:py-36 bg-[#0f1f18] text-[#f4ecd8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-14 md:gap-20">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8] font-medium mb-6">
                Спадщина · Глухомань
              </p>
              <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mb-3">
                Місце з історією
              </h2>
              <p className="font-display italic text-3xl md:text-4xl text-[#e6d9b8] mb-8">
                на Полтавщині.
              </p>
              <p className="text-[#f4ecd8]/75 leading-relaxed mb-4">
                Усе починалося зі старого фермерського будинку серед соснового лісу.
                Крок за кроком, рік за роком, «Глухомань» перетворювалася з тихого
                сімейного проєкту на повноцінний рекреаційний комплекс.
              </p>
              <p className="text-[#f4ecd8]/75 leading-relaxed">
                Ми зберегли головне — відчуття домашньої тиші, запах смоли й те
                особливе світло, що буває лише у сосновому лісі під вечір.
              </p>
            </div>

            <ol className="relative">
              {[
                {
                  year: '2012',
                  title: 'Початок',
                  text: 'Заснування комплексу на місці старого фермерського будинку. Перший ресторан відкриває двері.',
                },
                {
                  year: '2016',
                  title: 'Готель і конюшні',
                  text: 'Побудовано готель на 20 номерів. Разом з ним — конюшні і прогулянковий маршрут навколо ставка.',
                },
                {
                  year: '2019',
                  title: 'Аквапарк',
                  text: 'Відкриття аквапарку. Комплекс стає повноцінним рекреаційним місцем для сімейного відпочинку.',
                },
                {
                  year: '2023',
                  title: 'Лазня і пивоварня',
                  text: '«Глухомань» стає одним з найкращих відпочинкових місць Полтавщини — з власною лазнею на дровах і пивоварнею.',
                },
              ].map((item, i, arr) => (
                <li
                  key={item.year}
                  className={`grid grid-cols-[auto_1fr] gap-6 md:gap-10 py-8 ${
                    i < arr.length - 1 ? 'border-b border-[#e6d9b8]/20' : ''
                  }`}
                >
                  <span className="font-display text-5xl md:text-6xl text-[#e6d9b8] leading-none">
                    {item.year}
                  </span>
                  <div>
                    <p className="font-display italic text-2xl md:text-3xl text-[#f4ecd8] leading-tight mb-2">
                      {item.title}
                    </p>
                    <p className="text-[13px] text-[#f4ecd8]/65 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ───────────────────── ROOMS ───────────────────── */}
      <section className="py-28 md:py-36 bg-[#0f1f18] text-[#f4ecd8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8] font-medium mb-5">
              III · Номери
            </p>
            <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mb-3">
              Три настрої.
            </h2>
            <p className="font-display italic text-3xl md:text-4xl text-[#e6d9b8]">
              Одна тиша для всіх.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-14">
            {rooms.map((room, i) => (
              <article key={room.type} className="group flex flex-col">
                <div
                  className="relative aspect-[4/5] overflow-hidden mb-7"
                  style={{
                    borderRadius: SHAPES[i],
                    transform: `rotate(${ROTS[i]})`,
                  }}
                >
                  <Image
                    src={room.image}
                    alt={`Номер ${room.type}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]/70 mb-2">
                  Номер · {['I', 'II', 'III'][i]}
                </p>
                <h3 className="font-display text-4xl text-[#f4ecd8] leading-none mb-1">
                  {room.type}
                </h3>
                <p className="font-display italic text-2xl text-[#e6d9b8] mb-5">
                  {room.italicSub}
                </p>

                <div className="flex items-center gap-5 text-[12px] uppercase tracking-[0.18em] text-[#f4ecd8]/60 mb-5">
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> {room.guests}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5" /> {room.size}
                  </span>
                </div>

                <p className="text-[#f4ecd8]/75 text-sm leading-relaxed mb-6">
                  {room.description}
                </p>

                <ul className="flex flex-col gap-2 mb-8">
                  {room.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2.5 text-sm text-[#f4ecd8]/80"
                    >
                      <Check className="w-4 h-4 text-[#e6d9b8] mt-0.5 shrink-0" strokeWidth={1.5} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <BookingButton
                  service="hotel"
                  className="mt-auto inline-flex items-center gap-2 self-start border-b border-[#e6d9b8]/50 pb-1 text-[12px] uppercase tracking-[0.22em] text-[#e6d9b8] hover:border-[#e6d9b8] transition-colors"
                >
                  Забронювати <ArrowUpRight className="w-3.5 h-3.5" />
                </BookingButton>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────── AMENITIES ───────────────────── */}
      <section className="py-28 md:py-36 bg-[#faf6ec]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/70 font-medium mb-5">
              IV · Зручності
            </p>
            <h2 className="font-display text-5xl md:text-6xl leading-[0.95] text-[#1a3d2e] mb-3">
              Усе поруч.
            </h2>
            <p className="font-display italic text-3xl md:text-4xl text-[#1a3d2e]/70">
              Нічого зайвого.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 border-t border-[#e6d9b8]">
            {amenities.map((a) => {
              const Icon = a.icon;
              return (
                <div
                  key={a.label}
                  className="py-8 md:py-10 md:px-6 border-b md:border-b-0 md:border-r last:border-r-0 border-[#e6d9b8] flex md:flex-col items-start md:items-start gap-4"
                >
                  <Icon className="w-6 h-6 text-[#1a3d2e]" strokeWidth={1.5} />
                  <div>
                    <p className="font-display text-2xl text-[#1a3d2e] leading-tight">
                      {a.label}
                    </p>
                    <p className="text-[13px] text-[#0f1f18]/60 mt-1 leading-relaxed">
                      {a.hint}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────── CHECK-IN EXPERIENCE ───────────────────── */}
      <section className="py-24 md:py-28 bg-[#faf6ec]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-14">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/70 font-medium mb-5">
              Заселення
            </p>
            <h2 className="font-display text-5xl md:text-6xl leading-[0.95] text-[#1a3d2e] mb-3">
              Чекінг з душею.
            </h2>
            <p className="font-display italic text-3xl md:text-4xl text-[#1a3d2e]/70">
              Перші хвилини на місці.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-[#e6d9b8]">
            {[
              {
                icon: Coffee,
                title: 'Привітальний напій',
                italic: 'на терасі',
                text: 'Чашка трав’яного чаю або домашній узвар — з дороги, на терасі біля ставка.',
              },
              {
                icon: Compass,
                title: 'Екскурсія',
                italic: 'територією',
                text: 'Після заселення проведемо коротку прогулянку й покажемо ключові місця комплексу.',
              },
              {
                icon: MapPin,
                title: 'Карта',
                italic: 'і поради',
                text: 'Карта території, маршрути для прогулянок і рекомендації від команди готелю.',
              },
              {
                icon: Car,
                title: 'Трансфер',
                italic: 'від парковки',
                text: 'Допоможемо з багажем від парковки до номера — за першим запитом.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-[#f4ecd8] p-8 md:p-10 flex flex-col"
                >
                  <Icon className="w-6 h-6 text-[#1a3d2e] mb-6" strokeWidth={1.5} />
                  <p className="font-display text-2xl text-[#1a3d2e] leading-tight">
                    {item.title}
                  </p>
                  <p className="font-display italic text-lg text-[#1a3d2e]/60 mb-3">
                    {item.italic}
                  </p>
                  <p className="text-[13px] text-[#0f1f18]/70 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────── GALLERY ───────────────────── */}
      <section className="py-28 md:py-36 bg-[#0f1f18]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8] font-medium mb-5">
              V · Атмосфера
            </p>
            <h2 className="font-display text-5xl md:text-6xl leading-[0.95] text-[#f4ecd8] mb-3">
              Як виглядає готель.
            </h2>
            <p className="font-display italic text-3xl md:text-4xl text-[#e6d9b8]">
              Кімнати, балкони, ліс.
            </p>
          </div>

          <GalleryGrid
            images={atmospherePhotos}
            columns={3}
            aspect="landscape"
            showCaptions={false}
          />
        </div>
      </section>

      {/* ───────────────────── TESTIMONIALS ───────────────────── */}
      <section className="py-28 md:py-36 bg-[#0f1f18] text-[#f4ecd8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8] font-medium mb-5">
              Відгуки
            </p>
            <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mb-3">
              Голоси наших гостей.
            </h2>
            <p className="font-display italic text-3xl md:text-4xl text-[#e6d9b8]">
              Коротко й щиро.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                quote:
                  'Повернулися додому і досі сняться звуки води і шум сосен. Номер «Люкс» з балконом — це місце, куди хочеться повертатися.',
                name: 'Ірина',
                city: 'Київ',
              },
              {
                quote:
                  'Дітям сподобався аквапарк, нам — лазня і тиша ввечері на терасі біля ставка. Сімейний номер просторий, з усім необхідним.',
                name: 'Олексій і Марія',
                city: 'Харків',
              },
              {
                quote:
                  'Приїхали на одну ніч — залишилися на три. Ресторан з українською піччю — окрема історія. Повернемося обов’язково.',
                name: 'Наталія',
                city: 'Дніпро',
              },
            ].map((t) => (
              <figure
                key={t.name}
                className="bg-[#faf6ec] text-[#0f1f18] p-6 sm:p-10 md:p-12 flex flex-col"
              >
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-[#e6d9b8] fill-[#e6d9b8]"
                      strokeWidth={1}
                    />
                  ))}
                </div>
                <blockquote className="font-display italic text-2xl md:text-[26px] leading-snug text-[#1a3d2e] mb-8">
                  «{t.quote}»
                </blockquote>
                <figcaption className="mt-auto">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/70">
                    {t.name} · {t.city}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────── LOCATION ───────────────────── */}
      <section className="py-28 md:py-36 bg-[#faf6ec]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/70 font-medium mb-5">
                VI · Як дістатися
              </p>
              <h2 className="font-display text-5xl md:text-6xl leading-[0.95] text-[#1a3d2e] mb-3">
                10 хвилин
              </h2>
              <p className="font-display italic text-3xl md:text-4xl text-[#1a3d2e]/70 mb-8">
                від центру Полтави.
              </p>
              <p className="text-[#0f1f18]/75 leading-relaxed mb-8">
                Ми ховаємось у селі Нижні Млини, лише за 10 км від Полтави.
                Дорога зручна у будь-яку пору року, на території — безкоштовна
                парковка, а за потреби організуємо трансфер.
              </p>

              <div className="flex items-start gap-3 text-[#1a3d2e] mb-2">
                <MapPin className="h-5 w-5 mt-1" strokeWidth={1.5} />
                <div>
                  <p className="font-display text-2xl leading-tight">
                    {CONTACT_INFO.address}
                  </p>
                  <p className="text-[13px] text-[#0f1f18]/60 mt-1">
                    {CONTACT_INFO.workingHours}
                  </p>
                </div>
              </div>
            </div>

            <div
              className="relative aspect-[5/6] overflow-hidden"
              style={{
                borderRadius: '58% 42% 63% 37% / 45% 55% 45% 55%',
                transform: 'rotate(-1.5deg)',
              }}
            >
              <Image
                src="/images/restaurant/exterior_summer_terrace_water.jpg"
                alt="Розташування Глухомань"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1410]/70 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-[#f4ecd8]">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8] mb-1">
                  Полтавщина
                </p>
                <p className="font-display italic text-3xl">с. Нижні Млини</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────── NEARBY ───────────────────── */}
      <section className="py-28 md:py-36 bg-[#faf6ec]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/70 font-medium mb-5">
              Навколо
            </p>
            <h2 className="font-display text-5xl md:text-6xl leading-[0.95] text-[#1a3d2e] mb-3">
              Що поруч.
            </h2>
            <p className="font-display italic text-3xl md:text-4xl text-[#1a3d2e]/70">
              На день, на пів дня, на прогулянку.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e6d9b8] border border-[#e6d9b8]">
            {[
              {
                icon: MapPin,
                distance: '10 км',
                time: '15 хв',
                name: 'Полтава',
                text: 'Обласний центр з музеями, Круглою площею, галереями й затишними кав’ярнями старого міста.',
              },
              {
                icon: Camera,
                distance: '18 км',
                time: '25 хв',
                name: 'Диканька',
                text: 'Історичне село — Тріумфальна арка, гоголівські місця й тихі алеї старого парку.',
              },
              {
                icon: History,
                distance: '15 км',
                time: '20 хв',
                name: 'Полтавська битва',
                text: 'Музей-заповідник поля Полтавської битви 1709 року — просторе місце для прогулянки і роздумів.',
              },
              {
                icon: Compass,
                distance: '30 км',
                time: '35 хв',
                name: 'Опішне',
                text: 'Центр народної кераміки: музей українського гончарства, живі майстерні й приватні гончарні.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.name}
                  className="bg-[#faf6ec] p-8 md:p-10 flex flex-col"
                >
                  <Icon className="w-6 h-6 text-[#1a3d2e] mb-6" strokeWidth={1.5} />
                  <p className="font-display text-4xl md:text-5xl text-[#1a3d2e] leading-none">
                    {item.distance}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 mt-2 mb-5">
                    {item.time} їзди
                  </p>
                  <p className="font-display italic text-2xl text-[#1a3d2e] mb-3">
                    {item.name}
                  </p>
                  <p className="text-[13px] text-[#0f1f18]/70 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────── BOOKING CTA ───────────────────── */}
      <section className="py-28 md:py-36 bg-[#0f1f18] text-[#f4ecd8] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#e6d9b8] mb-6">
            VII · Запрошуємо
          </p>
          <h2 className="font-display text-5xl md:text-8xl leading-[0.9] mb-6">
            Готові відпочити?
          </h2>
          <p className="font-display italic text-3xl md:text-5xl text-[#e6d9b8] mb-10">
            Ми вже чекаємо.
          </p>
          <p className="max-w-xl mx-auto text-[#f4ecd8]/75 leading-relaxed mb-12">
            Напишіть нам — і ми підберемо ідеальний номер, підтвердимо бронювання
            та розкажемо, як краще дістатися. Усе інше вже готове.
          </p>
          <BookingButton
            service="hotel"
            className="inline-flex items-center gap-3 bg-[#e6d9b8] text-[#0f1f18] px-12 py-5 font-medium tracking-wide hover:bg-[#f4ecd8] transition-colors"
          >
            Забронювати номер <ArrowUpRight className="w-4 h-4" />
          </BookingButton>
        </div>
      </section>
    </div>
  );
}
