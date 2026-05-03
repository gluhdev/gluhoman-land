import { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import { BLUR_DATA_URL } from '@/lib/blur-placeholder';
import { EditableText } from '@/components/content/EditableText';
import { getText, getImage } from '@/lib/site-content';
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
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('hotel.meta');
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: t('og_title'),
      description: t('og_description'),
      type: 'website',
      locale: 'uk_UA',
      images: [
        {
          url: '/og-hotel.jpg',
          width: 1200,
          height: 630,
          alt: t('og_image_alt'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('twitter_title'),
      description: t('twitter_description'),
      images: ['/og-hotel.jpg'],
    },
  };
}

const SHAPES = [
  '58% 42% 63% 37% / 45% 55% 45% 55%',
  '46% 54% 38% 62% / 55% 40% 60% 45%',
  '62% 38% 55% 45% / 40% 60% 40% 60%',
];

const ROTS = ['-2deg', '1.5deg', '-1deg'];

export default async function HotelPage() {
  const t = await getTranslations('hotel');
  const heroImage = await getImage('hotel.hero.image', '/images/9.jpg');
  const heroSubtitle = await getText(
    'hotel.hero.subtitle',
    t('hero.subtitle')
  );

  const hotelJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: t('jsonld.hotel_name'),
    description: t('jsonld.hotel_description'),
    image: [
      'https://gluhoman.com.ua/images/9.jpg',
      'https://gluhoman.com.ua/images/restaurant/hall_floor1_rustic_wide.jpg',
      'https://gluhoman.com.ua/images/restaurant/balcony_floor2_wooden_furniture.jpg',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'UA',
      addressRegion: t('jsonld.address_region'),
      addressLocality: t('jsonld.address_locality'),
      streetAddress: t('jsonld.street_address'),
    },
    telephone: CONTACT_INFO.phone[0],
    priceRange: '$$',
    starRating: { '@type': 'Rating', ratingValue: '4' },
    checkinTime: '14:00',
    checkoutTime: '12:00',
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: t('jsonld.amenity_wifi'), value: true },
      { '@type': 'LocationFeatureSpecification', name: t('jsonld.amenity_parking'), value: true },
      { '@type': 'LocationFeatureSpecification', name: t('jsonld.amenity_breakfast'), value: true },
      { '@type': 'LocationFeatureSpecification', name: t('jsonld.amenity_transfer'), value: true },
      { '@type': 'LocationFeatureSpecification', name: t('jsonld.amenity_kids'), value: true },
      { '@type': 'LocationFeatureSpecification', name: t('jsonld.amenity_restaurant'), value: true },
      { '@type': 'LocationFeatureSpecification', name: t('jsonld.amenity_spa'), value: true },
    ],
    makesOffer: [
      {
        '@type': 'Offer',
        name: t('jsonld.room_standard_offer_name'),
        description: t('jsonld.room_standard_offer_description'),
        priceCurrency: 'UAH',
        availability: 'https://schema.org/InStock',
        priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'UAH', description: t('jsonld.price_on_request') },
        itemOffered: {
          '@type': 'HotelRoom',
          name: t('jsonld.room_standard_name'),
          occupancy: { '@type': 'QuantitativeValue', maxValue: 2 },
          bed: { '@type': 'BedDetails', typeOfBed: t('jsonld.room_standard_bed'), numberOfBeds: 1 },
        },
      },
      {
        '@type': 'Offer',
        name: t('jsonld.room_family_offer_name'),
        description: t('jsonld.room_family_offer_description'),
        priceCurrency: 'UAH',
        availability: 'https://schema.org/InStock',
        priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'UAH', description: t('jsonld.price_on_request') },
        itemOffered: {
          '@type': 'HotelRoom',
          name: t('jsonld.room_family_name'),
          occupancy: { '@type': 'QuantitativeValue', maxValue: 4 },
          bed: { '@type': 'BedDetails', typeOfBed: t('jsonld.room_family_bed'), numberOfBeds: 2 },
        },
      },
      {
        '@type': 'Offer',
        name: t('jsonld.room_lux_offer_name'),
        description: t('jsonld.room_lux_offer_description'),
        priceCurrency: 'UAH',
        availability: 'https://schema.org/InStock',
        priceSpecification: { '@type': 'PriceSpecification', priceCurrency: 'UAH', description: t('jsonld.price_on_request') },
        itemOffered: {
          '@type': 'HotelRoom',
          name: t('jsonld.room_lux_name'),
          occupancy: { '@type': 'QuantitativeValue', maxValue: 2 },
          bed: { '@type': 'BedDetails', typeOfBed: t('jsonld.room_lux_bed'), numberOfBeds: 1 },
        },
      },
    ],
  };

  const features = [
    {
      icon: Leaf,
      title: t('features.nature_title'),
      italic: t('features.nature_italic'),
      text: t('features.nature_text'),
    },
    {
      icon: Bed,
      title: t('features.comfort_title'),
      italic: t('features.comfort_italic'),
      text: t('features.comfort_text'),
    },
    {
      icon: UtensilsCrossed,
      title: t('features.cuisine_title'),
      italic: t('features.cuisine_italic'),
      text: t('features.cuisine_text'),
    },
    {
      icon: NavIcon,
      title: t('features.location_title'),
      italic: t('features.location_italic'),
      text: t('features.location_text'),
    },
  ];

  const rooms = [
    {
      type: t('rooms.standard_type'),
      italicSub: t('rooms.standard_italic'),
      image: '/images/9.jpg',
      guests: t('rooms.standard_guests'),
      size: t('rooms.standard_size'),
      description: t('rooms.standard_description'),
      features: [
        t('rooms.standard_feat_1'),
        t('rooms.standard_feat_2'),
        t('rooms.standard_feat_3'),
        t('rooms.standard_feat_4'),
      ],
    },
    {
      type: t('rooms.family_type'),
      italicSub: t('rooms.family_italic'),
      image: '/images/restaurant/hall_floor1_rustic_wide.jpg',
      guests: t('rooms.family_guests'),
      size: t('rooms.family_size'),
      description: t('rooms.family_description'),
      features: [
        t('rooms.family_feat_1'),
        t('rooms.family_feat_2'),
        t('rooms.family_feat_3'),
        t('rooms.family_feat_4'),
      ],
    },
    {
      type: t('rooms.lux_type'),
      italicSub: t('rooms.lux_italic'),
      image: '/images/restaurant/balcony_floor2_wooden_furniture.jpg',
      guests: t('rooms.lux_guests'),
      size: t('rooms.lux_size'),
      description: t('rooms.lux_description'),
      features: [
        t('rooms.lux_feat_1'),
        t('rooms.lux_feat_2'),
        t('rooms.lux_feat_3'),
        t('rooms.lux_feat_4'),
      ],
    },
  ];

  const atmospherePhotos = [
    { src: '/images/9.jpg', alt: t('gallery.photo_1_alt') },
    { src: '/images/33.jpg', alt: t('gallery.photo_2_alt') },
    { src: '/images/restaurant/hall_fireplace_balcony.jpg', alt: t('gallery.photo_3_alt') },
    { src: '/images/restaurant/balcony_floor2_wooden_furniture.jpg', alt: t('gallery.photo_4_alt') },
    { src: '/images/restaurant/exterior_summer_terrace_water.jpg', alt: t('gallery.photo_5_alt') },
    { src: '/images/restaurant/decor_photozone_green_hedge.jpg', alt: t('gallery.photo_6_alt') },
  ];

  const amenities = [
    { icon: Wifi, label: t('amenities.wifi_label'), hint: t('amenities.wifi_hint') },
    { icon: Car, label: t('amenities.parking_label'), hint: t('amenities.parking_hint') },
    { icon: Coffee, label: t('amenities.breakfast_label'), hint: t('amenities.breakfast_hint') },
    { icon: NavIcon, label: t('amenities.transfer_label'), hint: t('amenities.transfer_hint') },
    { icon: Baby, label: t('amenities.kids_label'), hint: t('amenities.kids_hint') },
  ];

  return (
    <div className="bg-[#faf6ec]">
      <Script id="hotel-jsonld" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(hotelJsonLd)}
      </Script>

      {/* ───────────────────── HERO ───────────────────── */}
      <section id="hero-section" className="hero-section relative min-h-[90svh] flex items-center justify-center overflow-clip bg-[#0b1410]">
        <Image
          src={heroImage}
          alt={t('hero.image_alt')}
          fill
          priority
          quality={85}
          sizes="100vw"
          placeholder={heroImage === '/images/9.jpg' ? 'blur' : 'empty'}
          blurDataURL={BLUR_DATA_URL}
          unoptimized={heroImage.startsWith('/uploads/')}
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1410]/40 via-[#0b1410]/20 to-[#0b1410]" />

        <div className="relative z-10 max-w-5xl px-6 text-center text-[#f4ecd8]">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#e6d9b8] mb-6">
            <EditableText k="hotel.hero.eyebrow" fallback={t('hero.eyebrow')} as="span" />
          </p>
          <h1 className="font-display text-5xl md:text-8xl leading-[0.9] mb-8">
            <EditableText k="hotel.hero.title" fallback={t('hero.title')} as="span" />
            <span className="block italic text-[#e6d9b8] mt-2">{t('hero.brand')}</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-[#f4ecd8]/80 mb-10 font-light leading-relaxed">
            {heroSubtitle}
          </p>
          <BookingButton
            service="hotel"
            className="inline-flex items-center justify-center gap-3 bg-[#e6d9b8] text-[#0f1f18] px-8 sm:px-10 py-4 font-medium tracking-wide hover:bg-[#f4ecd8] transition-colors min-h-[44px]"
          >
            {t('hero.cta')} <ArrowUpRight className="w-4 h-4" />
          </BookingButton>
        </div>
      </section>

      {/* ───────────────────── STORY ───────────────────── */}
      <section className="py-28 md:py-36 bg-[#faf6ec]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/70 font-medium mb-6">
                {t('story.eyebrow')}
              </p>
              <h2 className="font-display text-5xl md:text-6xl leading-[0.95] text-[#1a3d2e] mb-4">
                {t('story.title')}
              </h2>
              <p className="font-display italic text-3xl md:text-4xl text-[#1a3d2e]/70 mb-8">
                {t('story.title_italic')}
              </p>
              <p className="text-[#0f1f18]/75 leading-relaxed mb-4">
                {t('story.body_1')}
              </p>
              <p className="text-[#0f1f18]/75 leading-relaxed">
                {t('story.body_2')}
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
                {t('heritage.eyebrow')}
              </p>
              <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mb-3">
                {t('heritage.title')}
              </h2>
              <p className="font-display italic text-3xl md:text-4xl text-[#e6d9b8] mb-8">
                {t('heritage.title_italic')}
              </p>
              <p className="text-[#f4ecd8]/75 leading-relaxed mb-4">
                {t('heritage.body_1')}
              </p>
              <p className="text-[#f4ecd8]/75 leading-relaxed">
                {t('heritage.body_2')}
              </p>
            </div>

            <ol className="relative">
              {[
                {
                  year: '2012',
                  title: t('heritage.year_2012_title'),
                  text: t('heritage.year_2012_text'),
                },
                {
                  year: '2016',
                  title: t('heritage.year_2016_title'),
                  text: t('heritage.year_2016_text'),
                },
                {
                  year: '2019',
                  title: t('heritage.year_2019_title'),
                  text: t('heritage.year_2019_text'),
                },
                {
                  year: '2023',
                  title: t('heritage.year_2023_title'),
                  text: t('heritage.year_2023_text'),
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
              {t('rooms.eyebrow')}
            </p>
            <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mb-3">
              {t('rooms.title')}
            </h2>
            <p className="font-display italic text-3xl md:text-4xl text-[#e6d9b8]">
              {t('rooms.title_italic')}
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
                    alt={t('rooms.img_alt', { type: room.type })}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]/70 mb-2">
                  {t('rooms.room_label', { numeral: ['I', 'II', 'III'][i] })}
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
                  {t('rooms.cta')} <ArrowUpRight className="w-3.5 h-3.5" />
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
              {t('amenities.eyebrow')}
            </p>
            <h2 className="font-display text-5xl md:text-6xl leading-[0.95] text-[#1a3d2e] mb-3">
              {t('amenities.title')}
            </h2>
            <p className="font-display italic text-3xl md:text-4xl text-[#1a3d2e]/70">
              {t('amenities.title_italic')}
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
              {t('checkin.eyebrow')}
            </p>
            <h2 className="font-display text-5xl md:text-6xl leading-[0.95] text-[#1a3d2e] mb-3">
              {t('checkin.title')}
            </h2>
            <p className="font-display italic text-3xl md:text-4xl text-[#1a3d2e]/70">
              {t('checkin.title_italic')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-[#e6d9b8]">
            {[
              {
                icon: Coffee,
                title: t('checkin.welcome_title'),
                italic: t('checkin.welcome_italic'),
                text: t('checkin.welcome_text'),
              },
              {
                icon: Compass,
                title: t('checkin.tour_title'),
                italic: t('checkin.tour_italic'),
                text: t('checkin.tour_text'),
              },
              {
                icon: MapPin,
                title: t('checkin.map_title'),
                italic: t('checkin.map_italic'),
                text: t('checkin.map_text'),
              },
              {
                icon: Car,
                title: t('checkin.transfer_title'),
                italic: t('checkin.transfer_italic'),
                text: t('checkin.transfer_text'),
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
              {t('gallery.eyebrow')}
            </p>
            <h2 className="font-display text-5xl md:text-6xl leading-[0.95] text-[#f4ecd8] mb-3">
              {t('gallery.title')}
            </h2>
            <p className="font-display italic text-3xl md:text-4xl text-[#e6d9b8]">
              {t('gallery.title_italic')}
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
              {t('testimonials.eyebrow')}
            </p>
            <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mb-3">
              {t('testimonials.title')}
            </h2>
            <p className="font-display italic text-3xl md:text-4xl text-[#e6d9b8]">
              {t('testimonials.title_italic')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {[
              {
                quote: t('testimonials.review_1_quote'),
                name: t('testimonials.review_1_name'),
                city: t('testimonials.review_1_city'),
              },
              {
                quote: t('testimonials.review_2_quote'),
                name: t('testimonials.review_2_name'),
                city: t('testimonials.review_2_city'),
              },
              {
                quote: t('testimonials.review_3_quote'),
                name: t('testimonials.review_3_name'),
                city: t('testimonials.review_3_city'),
              },
            ].map((review) => (
              <figure
                key={review.name}
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
                  «{review.quote}»
                </blockquote>
                <figcaption className="mt-auto">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/70">
                    {review.name} · {review.city}
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
                {t('location.eyebrow')}
              </p>
              <h2 className="font-display text-5xl md:text-6xl leading-[0.95] text-[#1a3d2e] mb-3">
                {t('location.title')}
              </h2>
              <p className="font-display italic text-3xl md:text-4xl text-[#1a3d2e]/70 mb-8">
                {t('location.title_italic')}
              </p>
              <p className="text-[#0f1f18]/75 leading-relaxed mb-8">
                {t('location.body')}
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
                alt={t('location.map_img_alt')}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1410]/70 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-[#f4ecd8]">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8] mb-1">
                  {t('location.region_label')}
                </p>
                <p className="font-display italic text-3xl">{t('location.village_label')}</p>
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
              {t('nearby.eyebrow')}
            </p>
            <h2 className="font-display text-5xl md:text-6xl leading-[0.95] text-[#1a3d2e] mb-3">
              {t('nearby.title')}
            </h2>
            <p className="font-display italic text-3xl md:text-4xl text-[#1a3d2e]/70">
              {t('nearby.title_italic')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e6d9b8] border border-[#e6d9b8]">
            {[
              {
                icon: MapPin,
                distance: t('nearby.poltava_distance'),
                time: t('nearby.poltava_time'),
                name: t('nearby.poltava_name'),
                text: t('nearby.poltava_text'),
              },
              {
                icon: Camera,
                distance: t('nearby.dykanka_distance'),
                time: t('nearby.dykanka_time'),
                name: t('nearby.dykanka_name'),
                text: t('nearby.dykanka_text'),
              },
              {
                icon: History,
                distance: t('nearby.battle_distance'),
                time: t('nearby.battle_time'),
                name: t('nearby.battle_name'),
                text: t('nearby.battle_text'),
              },
              {
                icon: Compass,
                distance: t('nearby.opishne_distance'),
                time: t('nearby.opishne_time'),
                name: t('nearby.opishne_name'),
                text: t('nearby.opishne_text'),
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
                    {item.time} {t('nearby.drive_suffix')}
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
            {t('cta.eyebrow')}
          </p>
          <h2 className="font-display text-5xl md:text-8xl leading-[0.9] mb-6">
            {t('cta.title')}
          </h2>
          <p className="font-display italic text-3xl md:text-5xl text-[#e6d9b8] mb-10">
            {t('cta.title_italic')}
          </p>
          <p className="max-w-xl mx-auto text-[#f4ecd8]/75 leading-relaxed mb-12">
            {t('cta.body')}
          </p>
          <BookingButton
            service="hotel"
            className="inline-flex items-center gap-3 bg-[#e6d9b8] text-[#0f1f18] px-12 py-5 font-medium tracking-wide hover:bg-[#f4ecd8] transition-colors"
          >
            {t('cta.button')} <ArrowUpRight className="w-4 h-4" />
          </BookingButton>
        </div>
      </section>
    </div>
  );
}
