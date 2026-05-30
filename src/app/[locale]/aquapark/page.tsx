import { Metadata } from 'next';
import Image from 'next/image';
import Script from 'next/script';
import { BLUR_DATA_URL } from '@/lib/blur-placeholder';
import { BookingButton } from '@/components/ui/BookingButton';
import { EditableText } from '@/components/content/EditableText';
import { getText, getImage } from '@/lib/site-content';
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
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'aquapark.meta' });
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    openGraph: {
      title: t('og_title'),
      description: t('og_description'),
      type: 'website',
      locale: locale === 'uk' ? 'uk_UA' : 'en_US',
      images: [
        {
          url: '/og-aquapark.jpg',
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
      images: ['/og-aquapark.jpg'],
    },
  };
}

const phonePrimary = CONTACT_INFO.phone[0];
const telHref = `tel:${phonePrimary.replace(/\s+/g, '')}`;

const SHAPES = [
  '58% 42% 63% 37% / 45% 55% 45% 55%',
  '40% 60% 50% 50% / 55% 35% 65% 45%',
  '65% 35% 45% 55% / 50% 60% 40% 50%',
  '45% 55% 40% 60% / 60% 45% 55% 40%',
];
const ROTS = ['rotate(-2deg)', 'rotate(2.5deg)', 'rotate(-1.5deg)', 'rotate(2deg)'];

export default async function AquaparkPage() {
  const t = await getTranslations('aquapark');

  const heroImage = await getImage('aquapark.hero.image', '/images/akvapark.webp');
  const heroSubtitle = await getText(
    'aquapark.hero.subtitle',
    t('hero.subtitle')
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: t('jsonld.name'),
    description: t('jsonld.description'),
    image: 'https://gluhoman.com.ua/images/akvapark.webp',
    telephone: phonePrimary,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'UA',
      addressRegion: t('jsonld.address_region'),
      addressLocality: t('jsonld.address_locality'),
    },
    isAccessibleForFree: false,
    publicAccess: true,
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday', 'Tuesday', 'Wednesday', 'Thursday',
          'Friday', 'Saturday', 'Sunday',
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
      { '@type': 'Question', name: t('faq.q1'), acceptedAnswer: { '@type': 'Answer', text: t('faq.a1') } },
      { '@type': 'Question', name: t('faq.q2'), acceptedAnswer: { '@type': 'Answer', text: t('faq.a2') } },
      { '@type': 'Question', name: t('faq.q3'), acceptedAnswer: { '@type': 'Answer', text: t('faq.a3') } },
      { '@type': 'Question', name: t('faq.q4'), acceptedAnswer: { '@type': 'Answer', text: t('faq.a4') } },
      { '@type': 'Question', name: t('faq.q5'), acceptedAnswer: { '@type': 'Answer', text: t('faq.a5') } },
      { '@type': 'Question', name: t('faq.q6'), acceptedAnswer: { '@type': 'Answer', text: t('faq.a6') } },
    ],
  };

  const zones = [
    {
      n: 'I',
      kicker: t('zones.zone_1.kicker'),
      title: t('zones.zone_1.title'),
      italic: t('zones.zone_1.italic'),
      description: t('zones.zone_1.description'),
      features: [t('zones.zone_1.feature_1'), t('zones.zone_1.feature_2'), t('zones.zone_1.feature_3')],
      image: '/images/akvapark.webp',
      imageAlt: t('zones.zone_1.image_alt'),
    },
    {
      n: 'II',
      kicker: t('zones.zone_2.kicker'),
      title: t('zones.zone_2.title'),
      italic: t('zones.zone_2.italic'),
      description: t('zones.zone_2.description'),
      features: [t('zones.zone_2.feature_1'), t('zones.zone_2.feature_2'), t('zones.zone_2.feature_3')],
      image: '/images/akvapark.webp',
      imageAlt: t('zones.zone_2.image_alt'),
    },
    {
      n: 'III',
      kicker: t('zones.zone_3.kicker'),
      title: t('zones.zone_3.title'),
      italic: t('zones.zone_3.italic'),
      description: t('zones.zone_3.description'),
      features: [t('zones.zone_3.feature_1'), t('zones.zone_3.feature_2'), t('zones.zone_3.feature_3')],
      image: '/images/akvapark.webp',
      imageAlt: t('zones.zone_3.image_alt'),
    },
    {
      n: 'IV',
      kicker: t('zones.zone_4.kicker'),
      title: t('zones.zone_4.title'),
      italic: t('zones.zone_4.italic'),
      description: t('zones.zone_4.description'),
      features: [t('zones.zone_4.feature_1'), t('zones.zone_4.feature_2'), t('zones.zone_4.feature_3')],
      image: '/images/akvapark.webp',
      imageAlt: t('zones.zone_4.image_alt'),
    },
  ];

  const inclusions = [
    t('includes.item_1'), t('includes.item_2'), t('includes.item_3'),
    t('includes.item_4'), t('includes.item_5'), t('includes.item_6'),
  ];

  const rules = [
    { icon: Clock, title: t('includes.rule_1_title'), text: t('includes.rule_1_text') },
    { icon: Users, title: t('includes.rule_2_title'), text: t('includes.rule_2_text') },
    { icon: ShieldCheck, title: t('includes.rule_3_title'), text: t('includes.rule_3_text') },
  ];

  const faqItems = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
    { q: t('faq.q6'), a: t('faq.a6') },
  ];

  const slides = [
    {
      n: 'I',
      name: t('slides.slide_1.name'),
      stats: [
        { k: t('slides.slide_1.stat_1_k'), v: t('slides.slide_1.stat_1_v') },
        { k: t('slides.slide_1.stat_2_k'), v: t('slides.slide_1.stat_2_v') },
        { k: t('slides.slide_1.stat_3_k'), v: t('slides.slide_1.stat_3_v') },
      ],
      text: t('slides.slide_1.text'),
    },
    {
      n: 'II',
      name: t('slides.slide_2.name'),
      stats: [
        { k: t('slides.slide_2.stat_1_k'), v: t('slides.slide_2.stat_1_v') },
        { k: t('slides.slide_2.stat_2_k'), v: t('slides.slide_2.stat_2_v') },
        { k: t('slides.slide_2.stat_3_k'), v: t('slides.slide_2.stat_3_v') },
      ],
      text: t('slides.slide_2.text'),
    },
    {
      n: 'III',
      name: t('slides.slide_3.name'),
      stats: [
        { k: t('slides.slide_3.stat_1_k'), v: t('slides.slide_3.stat_1_v') },
        { k: t('slides.slide_3.stat_2_k'), v: t('slides.slide_3.stat_2_v') },
        { k: t('slides.slide_3.stat_3_k'), v: t('slides.slide_3.stat_3_v') },
      ],
      text: t('slides.slide_3.text'),
    },
    {
      n: 'IV',
      name: t('slides.slide_4.name'),
      stats: [
        { k: t('slides.slide_4.stat_1_k'), v: t('slides.slide_4.stat_1_v') },
        { k: t('slides.slide_4.stat_2_k'), v: t('slides.slide_4.stat_2_v') },
        { k: t('slides.slide_4.stat_3_k'), v: t('slides.slide_4.stat_3_v') },
      ],
      text: t('slides.slide_4.text'),
    },
  ];

  const scheduleRows = [
    { t: '09:00', h: t('schedule.row_1_h'), d: t('schedule.row_1_d') },
    { t: '11:00', h: t('schedule.row_2_h'), d: t('schedule.row_2_d') },
    { t: '13:00', h: t('schedule.row_3_h'), d: t('schedule.row_3_d') },
    { t: '15:00', h: t('schedule.row_4_h'), d: t('schedule.row_4_d') },
    { t: '18:00', h: t('schedule.row_5_h'), d: t('schedule.row_5_d') },
    { t: '21:00', h: t('schedule.row_6_h'), d: t('schedule.row_6_d') },
  ];

  const safetyCards = [
    { icon: ShieldCheck, title: t('safety.card_1_title'), text: t('safety.card_1_text') },
    { icon: Heart, title: t('safety.card_2_title'), text: t('safety.card_2_text') },
    { icon: Droplets, title: t('safety.card_3_title'), text: t('safety.card_3_text') },
    { icon: Users, title: t('safety.card_4_title'), text: t('safety.card_4_text') },
  ];

  const packingItems = [
    { icon: Shirt, title: t('packing.item_1_title'), text: t('packing.item_1_text') },
    { icon: Sun, title: t('packing.item_2_title'), text: t('packing.item_2_text') },
    { icon: Droplet, title: t('packing.item_3_title'), text: t('packing.item_3_text') },
    { icon: FileText, title: t('packing.item_4_title'), text: t('packing.item_4_text') },
  ];

  const familyFeatures = [
    { icon: Baby, label: t('family.feature_1') },
    { icon: ShieldCheck, label: t('family.feature_2') },
    { icon: Sun, label: t('family.feature_3') },
    { icon: Waves, label: t('family.feature_4') },
  ];

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

      {/* 1. HERO */}
      <section id="hero-section" className="hero-section relative min-h-[90svh] flex items-center justify-center overflow-clip bg-[#0b1410]">
        <Image
          fill
          priority
          src={heroImage}
          alt={t('hero.img_alt')}
          className="object-cover opacity-55"
          sizes="100vw"
          quality={90}
          placeholder={heroImage === '/images/akvapark.webp' ? 'blur' : 'empty'}
          blurDataURL={BLUR_DATA_URL}
          unoptimized={heroImage.startsWith('/uploads/')}
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
            <EditableText k="aquapark.hero.eyebrow" fallback={t('hero.eyebrow')} as="span" />
            <span className="h-px w-10 bg-[#e6d9b8]/50" />
          </p>
          <h1
            className="font-display mb-6"
            style={{
              fontSize: 'clamp(2.25rem, 9vw, 7.5rem)',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              fontWeight: 300,
            }}
          >
            <EditableText k="aquapark.hero.title" fallback={t('hero.title')} as="span" />
            <span className="block italic text-[#e6d9b8]">{t('hero.brand')}</span>
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-lg md:text-xl font-light leading-relaxed text-[#f4ecd8]/80">
            {heroSubtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
            <BookingButton
              service="aquapark"
              className="inline-flex items-center gap-3 bg-[#e6d9b8] text-[#0f1f18] px-10 py-4 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#f4ecd8] transition"
            >
              {t('hero.cta_book')}
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

      {/* 2. SEASON CALLOUT */}
      <section className="bg-[#faf6ec] py-20 md:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="mb-5 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/70">
            <span className="h-px w-8 bg-[#1a3d2e]/30" />
            {t('season.kicker')}
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
            {t('season.title_p1')}{' '}
            <span className="italic">{t('season.title_may')}</span>{' '}
            {t('season.title_to')}{' '}
            <span className="italic">{t('season.title_sep')}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#0f1f18]/65">
            {t('season.description')}
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

      {/* 3. ZONES */}
      <section className="relative overflow-hidden bg-[#faf6ec] py-28 md:py-36">
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-12 lg:px-16">
          <div className="flex items-end justify-between gap-8 border-b border-[#0f1f18]/15 pb-10">
            <div>
              <p className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/80">
                <span className="h-px w-10 bg-[#1a3d2e]/40" />
                {t('zones.kicker')}
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
                {t('zones.title_p1')}{' '}
                <span className="italic">{t('zones.title_italic')}</span>
              </h2>
            </div>
            <div className="hidden max-w-xs text-sm leading-relaxed text-[#0f1f18]/65 md:block">
              {t('zones.description')}
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

      {/* 3b. SLIDE CATALOG */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-20 max-w-3xl">
            <p className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/80">
              <span className="h-px w-10 bg-[#1a3d2e]/40" />
              {t('slides.kicker')}
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
              {t('slides.title_p1')}{' '}
              <span className="italic">{t('slides.title_italic')}</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#0f1f18]/65">
              {t('slides.description')}
            </p>
          </div>

          <div className="border-t border-[#0f1f18]/15">
            {slides.map((s) => (
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

      {/* 4. FAMILY */}
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
                    alt={t('family.img_alt')}
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
                {t('family.kicker')}
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
                {t('family.title_p1')}
                <br />
                <span className="italic text-[#e6d9b8]">{t('family.title_italic')}</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-[#f4ecd8]/75">
                {t('family.description_p1')}
              </p>
              <p className="mt-4 max-w-md text-base leading-relaxed text-[#f4ecd8]/65">
                {t('family.description_p2')}
              </p>

              <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-5">
                {familyFeatures.map(({ icon: Icon, label }) => (
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

      {/* 5. INCLUDES / RULES */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
            <div className="lg:col-span-5">
              <p className="mb-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/80">
                <span className="h-px w-8 bg-[#1a3d2e]/40" />
                {t('includes.kicker')}
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
                {t('includes.title_p1')}{' '}
                <span className="italic">{t('includes.title_italic')}</span>
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-[#0f1f18]/65">
                {t('includes.description')}
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

      {/* 5b. SAFETY */}
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
              {t('safety.kicker')}
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
              {t('safety.title_p1')}{' '}
              <span className="italic text-[#e6d9b8]">
                {t('safety.title_italic')}
              </span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#f4ecd8]/70">
              {t('safety.description')}
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 border-t border-[#e6d9b8]/20 pt-16">
            {safetyCards.map(({ icon: Icon, title, text }) => (
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

      {/* 5c. DAILY SCHEDULE */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-20 max-w-3xl">
            <p className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/80">
              <span className="h-px w-10 bg-[#1a3d2e]/40" />
              {t('schedule.kicker')}
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
              {t('schedule.title_p1')}{' '}
              <span className="italic">{t('schedule.title_italic')}</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#0f1f18]/65">
              {t('schedule.description')}
            </p>
          </div>

          <div className="border-t border-[#0f1f18]/15">
            {scheduleRows.map((row, idx, arr) => (
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

      {/* 6. PRICING */}
      <section className="bg-[#f4ecd8] py-28 md:py-36">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="mb-6 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/80">
            <span className="h-px w-8 bg-[#1a3d2e]/40" />
            {t('pricing.kicker')}
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
            {t('pricing.title_p1')}{' '}
            <span className="italic">{t('pricing.title_italic')}</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-base md:text-lg leading-relaxed text-[#0f1f18]/65">
            {t('pricing.description')}
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
              {t('pricing.cta_book')}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </BookingButton>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <p className="mb-6 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/80">
              <span className="h-px w-8 bg-[#1a3d2e]/40" />
              {t('faq.kicker')}
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
              {t('faq.title_p1')}{' '}
              <span className="italic">{t('faq.title_italic')}</span>
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

      {/* 7b. PACKING LIST */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-b border-[#0f1f18]/15 pb-10">
            <div className="max-w-xl">
              <p className="mb-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/80">
                <span className="h-px w-10 bg-[#1a3d2e]/40" />
                {t('packing.kicker')}
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
                {t('packing.title_p1')}{' '}
                <span className="italic">{t('packing.title_italic')}</span>
              </h2>
            </div>
            <p className="max-w-sm text-base leading-relaxed text-[#0f1f18]/65">
              {t('packing.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {packingItems.map(({ icon: Icon, title, text }) => (
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

      {/* 8. BOOKING CTA */}
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
            {t('cta.kicker')}
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
            {t('cta.title_p1')}{' '}
            <span className="italic text-[#e6d9b8]">{t('cta.title_italic')}</span>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-base md:text-lg font-light leading-relaxed text-[#f4ecd8]/75">
            {t('cta.description')}
          </p>
          <div className="mt-12 flex flex-col sm:flex-row gap-5 items-center justify-center">
            <BookingButton
              service="aquapark"
              className="inline-flex items-center gap-3 bg-[#e6d9b8] text-[#0f1f18] px-10 py-4 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#f4ecd8] transition"
            >
              {t('cta.cta_book')}
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
