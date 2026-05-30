import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Link } from "@/i18n/routing";
import Script from 'next/script';
import {
  Phone,
  MapPin,
  Clock,
  Sparkles,
  Users,
  Tag,
  CheckCircle,
  Bug,
  Heart,
  Target,
  Trophy,
  PartyPopper,
  Flame,
  Beer,
  Cat,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { ADDITIONAL_SERVICES, CONTACT_INFO } from '@/constants';

type Params = { slug: string; locale: string };

type ServiceContent = {
  longDescription: string;
  highlights: { title: string; description: string }[];
  pricing: string;
  preparation?: string[];
  groupSize?: string;
};

// SERVICE_CONTENT is now built from translations at render time (see buildContent below)

function iconForService(id: string): LucideIcon {
  const map: Record<string, LucideIcon> = {
    apitherapy: Bug,
    wedding: Heart,
    paintball: Target,
    horses: Trophy,
    'kids-parties': PartyPopper,
    'bbq-zone': Flame,
    'brewery-tour': Beer,
    'petting-zoo': Cat,
  };
  return map[id] ?? Sparkles;
}

function telHref(phone: string) {
  return `tel:${phone.replace(/\s+/g, '')}`;
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI'];

export function generateStaticParams(): { slug: string }[] {
  return ADDITIONAL_SERVICES.map((service) => ({ slug: service.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'constants.services.additional' });
  const tp = await getTranslations({ locale, namespace: 'slug_page' });
  const tl = await getTranslations({ locale, namespace: 'layout' });
  const service = ADDITIONAL_SERVICES.find((s) => s.id === slug);

  if (!service) {
    return { title: tp('not_found_meta') };
  }

  // Use id as key for both main and additional services
  const slugKey = service.id as Parameters<typeof t>[0];
  const title = t(`${slugKey}.title` as Parameters<typeof t>[0]);
  const description = t(`${slugKey}.description` as Parameters<typeof t>[0]);

  return {
    title: `${title} — ${tl('site_name_full')}`,
    description,
    openGraph: {
      title: `${title} — ${tl('site_name')}`,
      description,
      type: 'website',
      locale: locale === 'uk' ? 'uk_UA' : 'en_US',
      siteName: tl('site_name'),
    },
  };
}

export default async function OtherServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug, locale } = await params;
  const service = ADDITIONAL_SERVICES.find((s) => s.id === slug);

  if (!service) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: 'slug_page' });
  const tc = await getTranslations({ locale, namespace: 'constants.services.additional' });
  const tconst = await getTranslations({ locale, namespace: 'constants' });
  const serviceId = service.id as string;
  const serviceTitle = tc(`${serviceId}.title` as Parameters<typeof tc>[0]);
  const serviceDesc = tc(`${serviceId}.description` as Parameters<typeof tc>[0]);

  // Build SERVICE_CONTENT from translations for the 3 services that have extra detail
  type ServiceContent = {
    longDescription: string;
    highlights: { title: string; description: string }[];
    pricing: string;
    preparation?: string[];
    groupSize?: string;
  };
  const SUPPORTED_SLUGS = ['paintball', 'brewery-tour', 'kids-parties'] as const;
  type SupportedSlug = typeof SUPPORTED_SLUGS[number];

  function buildContent(id: string): ServiceContent | undefined {
    if (!SUPPORTED_SLUGS.includes(id as SupportedSlug)) return undefined;
    const sk = id as SupportedSlug;
    const tp = (key: string) => t(`${sk}.${key}` as Parameters<typeof t>[0]);
    return {
      longDescription: tp('long_desc'),
      highlights: [
        { title: tp('h1_title'), description: tp('h1_desc') },
        { title: tp('h2_title'), description: tp('h2_desc') },
        { title: tp('h3_title'), description: tp('h3_desc') },
        { title: tp('h4_title'), description: tp('h4_desc') },
      ],
      pricing: tp('pricing'),
      groupSize: tp('group_size'),
      preparation: ['prep_1', 'prep_2', 'prep_3']
        .map((k) => {
          try { return tp(k); } catch { return null; }
        })
        .filter((v): v is string => v !== null && v !== '' && !v.startsWith('slug_page.')),
    };
  }

  const Icon = iconForService(service.id);
  const content = buildContent(service.id);
  const otherServices = ADDITIONAL_SERVICES.filter((s) => s.id !== service.id).slice(0, 4);
  const primaryPhone = CONTACT_INFO.phone[0];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceTitle,
    description: serviceDesc,
    serviceType: serviceTitle,
    areaServed: 'Полтавська область, Україна',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Рекреаційний комплекс Глухомань',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'UA',
        addressRegion: 'Полтавська область',
        addressLocality: 'Нижні Млини',
        streetAddress: CONTACT_INFO.address,
      },
      telephone: CONTACT_INFO.phone[0],
      openingHours: CONTACT_INFO.workingHours,
    },
  };

  return (
    <>
      <Script
        id={`jsonld-service-${service.id}`}
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero — deep forest */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-[#0b1410]">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, #e6d9b8 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 80% 70%, #e6d9b8 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />
        <div className="relative z-10 max-w-5xl px-6 text-center text-[#f4ecd8]">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#e6d9b8] mb-6">
            {t('additional_service_eyebrow')}
          </p>
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#e6d9b8]/10 border border-[#e6d9b8]/30 mb-8">
            <Icon className="w-11 h-11 text-[#e6d9b8]" strokeWidth={1.25} />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-7xl leading-[0.95] mb-6">
            {serviceTitle}
            <span className="block italic text-[#e6d9b8]/80 text-3xl md:text-4xl mt-4">
              {t('hero_subtitle')}
            </span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-[#f4ecd8]/80 mb-10 font-light leading-relaxed">
            {serviceDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={telHref(primaryPhone)}
              className="inline-flex items-center justify-center gap-3 bg-[#e6d9b8] text-[#0f1f18] px-10 py-4 font-medium tracking-wide hover:bg-[#f4ecd8] transition"
            >
              <Phone className="w-4 h-4" /> {t('cta_call')}
            </a>
            <a
              href="#contacts"
              className="inline-flex items-center justify-center gap-3 border border-[#e6d9b8]/40 text-[#f4ecd8] px-10 py-4 font-medium tracking-wide hover:border-[#e6d9b8] transition"
            >
              {t('cta_learn_more')}
            </a>
          </div>
        </div>
      </section>

      {/* Про послугу — cream */}
      {content && (
        <section className="py-28 md:py-36 bg-[#faf6ec]">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12 md:gap-16">
            <div className="md:col-span-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e] mb-4">
                {t('about_eyebrow')}
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-[#1a3d2e] leading-tight">
                {t('about_heading')}
                <span className="block italic text-[#1a3d2e]/70">{t('about_heading_em')}</span>
              </h2>
            </div>
            <div className="md:col-span-8 space-y-6">
              {content.longDescription.split('\n\n').map((p, i) => (
                <p
                  key={i}
                  className="text-[#0f1f18]/80 leading-relaxed text-lg font-light"
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Особливості — deep forest */}
      {content && (
        <section className="py-28 md:py-36 bg-[#0f1f18] text-[#f4ecd8]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8] mb-4">
                {t('features_eyebrow')}
              </p>
              <h2 className="font-display text-4xl md:text-5xl">
                {t('features_heading')}
                <span className="block italic text-[#e6d9b8]/80">{t('features_heading_em')}</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#e6d9b8]/20">
              {content.highlights.map((h, i) => (
                <div key={i} className="bg-[#0f1f18] p-10 md:p-12">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]/70 mb-4">
                    {ROMAN[i] ?? i + 1}
                  </p>
                  <p className="font-display text-3xl mb-3">{h.title}</p>
                  <p className="text-[#f4ecd8]/70 leading-relaxed font-light">
                    {h.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick facts — cream */}
      {content && (
        <section className="py-28 md:py-36 bg-[#faf6ec]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e] mb-4">
                {t('facts_eyebrow')}
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-[#1a3d2e]">
                {t('facts_heading')}
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-px bg-[#e6d9b8]">
              <div className="bg-[#faf6ec] p-10 md:p-12 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#e6d9b8]/60 mb-6">
                  <Users className="w-5 h-5 text-[#1a3d2e]" strokeWidth={1.5} />
                </div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e] mb-3">
                  {t('group_size_label')}
                </p>
                <p className="font-display text-2xl text-[#1a3d2e]">
                  {content.groupSize ?? t('group_size_on_request')}
                </p>
              </div>
              <div className="bg-[#faf6ec] p-10 md:p-12 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#e6d9b8]/60 mb-6">
                  <Tag className="w-5 h-5 text-[#1a3d2e]" strokeWidth={1.5} />
                </div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e] mb-3">
                  {t('pricing_label')}
                </p>
                <p className="font-display text-xl text-[#1a3d2e] leading-snug">
                  {content.pricing}
                </p>
              </div>
              <div className="bg-[#faf6ec] p-10 md:p-12 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#e6d9b8]/60 mb-6">
                  <CheckCircle className="w-5 h-5 text-[#1a3d2e]" strokeWidth={1.5} />
                </div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e] mb-3">
                  {t('preparation_label')}
                </p>
                <p className="font-display text-2xl text-[#1a3d2e]">
                  {content.preparation && content.preparation.length > 0
                    ? t('preparation_steps', { n: content.preparation.length })
                    : t('preparation_minimal')}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Як підготуватися — cream */}
      {content && content.preparation && content.preparation.length > 0 && (
        <section className="py-28 md:py-36 bg-[#faf6ec]">
          <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12 md:gap-16">
            <div className="md:col-span-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e] mb-4">
                {t('prep_eyebrow')}
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-[#1a3d2e] leading-tight">
                {t('prep_heading')}
                <span className="block italic text-[#1a3d2e]/70">{t('prep_heading_em')}</span>
              </h2>
            </div>
            <ol className="md:col-span-8 space-y-px bg-[#e6d9b8]">
              {content.preparation.map((item, i) => (
                <li
                  key={i}
                  className="bg-[#faf6ec] flex items-start gap-8 p-8 md:p-10"
                >
                  <span className="font-display text-3xl text-[#1a3d2e]/50 min-w-[3rem]">
                    {ROMAN[i] ?? i + 1}
                  </span>
                  <span className="text-[#0f1f18]/80 text-lg font-light leading-relaxed pt-2">
                    {item}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* Contacts — deep forest */}
      <section id="contacts" className="py-28 md:py-36 bg-[#0f1f18] text-[#f4ecd8]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-12 md:gap-16">
          <div className="md:col-span-5">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8] mb-4">
              {t('contacts_eyebrow')}
            </p>
            <h2 className="font-display text-4xl md:text-6xl leading-[0.95] mb-6">
              {t('contacts_heading')}
              <span className="block italic text-[#e6d9b8]/80">{t('contacts_heading_em')}</span>
            </h2>
            <p className="text-[#f4ecd8]/70 font-light leading-relaxed mb-8">
              {t('contacts_body')}
            </p>
            <div className="flex items-center gap-3 text-sm text-[#f4ecd8]/70 mb-3">
              <Clock className="w-4 h-4 text-[#e6d9b8]" />
              <span>{tconst('working_hours')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#f4ecd8]/70">
              <MapPin className="w-4 h-4 text-[#e6d9b8]" />
              <span>{tconst('address')}</span>
            </div>
          </div>
          <div className="md:col-span-7">
            <ul className="divide-y divide-[#e6d9b8]/20 border-y border-[#e6d9b8]/20">
              {CONTACT_INFO.phone.map((phone) => (
                <li key={phone}>
                  <a
                    href={telHref(phone)}
                    className="group flex items-center justify-between py-6 transition"
                  >
                    <span className="flex items-center gap-4">
                      <Phone className="w-4 h-4 text-[#e6d9b8]" />
                      <span className="font-display text-2xl md:text-3xl text-[#f4ecd8] group-hover:text-[#e6d9b8] transition">
                        {phone}
                      </span>
                    </span>
                    <ArrowRight className="w-5 h-5 text-[#e6d9b8]/60 group-hover:text-[#e6d9b8] group-hover:translate-x-1 transition" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Related services — cream */}
      <section className="py-28 md:py-36 bg-[#faf6ec]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-16 gap-6 flex-wrap">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e] mb-4">
                {t('related_eyebrow')}
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-[#1a3d2e] leading-tight">
                {t('related_heading')}
                <span className="block italic text-[#1a3d2e]/70">{t('related_heading_em')}</span>
              </h2>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e] hover:text-[#0f1f18]"
            >
              {t('related_all')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e6d9b8]">
            {otherServices.map((other, i) => {
              const OIcon = iconForService(other.id);
              const num = String(i + 1).padStart(2, '0');
              return (
                <Link
                  key={other.id}
                  href={other.href}
                  className="group bg-[#faf6ec] p-10 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-8">
                    <span className="font-display text-3xl text-[#e6d9b8]">
                      {num}
                    </span>
                    <OIcon
                      className="w-5 h-5 text-[#1a3d2e]"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h3 className="font-display text-2xl text-[#1a3d2e] mb-3 leading-tight">
                    {tc(`${other.id}.title` as Parameters<typeof tc>[0])}
                  </h3>
                  <p className="text-sm text-[#0f1f18]/70 font-light leading-relaxed line-clamp-2 mb-6">
                    {tc(`${other.id}.description` as Parameters<typeof tc>[0])}
                  </p>
                  <span className="mt-auto inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]">
                    {t('related_detail')}
                    <span className="relative inline-block w-8 h-px bg-[#1a3d2e] transition-all duration-300 group-hover:w-12" />
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA — deep forest */}
      <section className="py-28 md:py-36 bg-[#0f1f18] text-[#f4ecd8]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8] mb-6">
            {t('final_eyebrow')}
          </p>
          <h2 className="font-display text-5xl md:text-6xl leading-[0.95] mb-6">
            {t('final_heading')}
            <span className="block italic text-[#e6d9b8]/80 text-3xl md:text-4xl mt-4">
              {t('final_heading_em')}
            </span>
          </h2>
          <p className="text-[#f4ecd8]/70 font-light text-lg mb-10 max-w-xl mx-auto">
            {t('final_body')}
          </p>
          <a
            href={telHref(primaryPhone)}
            className="inline-flex items-center gap-3 bg-[#e6d9b8] text-[#0f1f18] px-10 py-4 font-medium tracking-wide hover:bg-[#f4ecd8] transition"
          >
            <Phone className="w-4 h-4" />
            {primaryPhone}
          </a>
        </div>
      </section>
    </>
  );
}
