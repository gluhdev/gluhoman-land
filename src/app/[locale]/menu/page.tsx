import { Metadata } from 'next';
import Script from 'next/script';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { getTranslations, getLocale } from 'next-intl/server';
import menuData from '@/data/menu.json';
import { Menu } from '@/types/menu';
import { MenuHero } from '@/components/menu/MenuHero';
import { CategoryNav } from '@/components/menu/CategoryNav';
import { CategorySection } from '@/components/menu/CategorySection';
import { MenuFooter } from '@/components/menu/MenuFooter';
import { BackToTop } from '@/components/menu/BackToTop';
import { CartButton } from '@/components/menu/CartButton';
import { CartDrawer } from '@/components/menu/CartDrawer';
import { MenuBookingCTA } from './MenuBookingCTA';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('menu.meta');
  return {
    title: t('title'),
    description: t('description'),
    keywords:
      'меню, ресторан, глухомань, українська кухня, європейська кухня, крафтове пиво, полтавська область',
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      type: 'website',
      locale: 'uk_UA',
      images: [
        {
          url: '/og-restaurant.jpg',
          width: 1200,
          height: 630,
          alt: t('ogTitle'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('twitterTitle'),
      description: t('twitterDescription'),
      images: ['/og-restaurant.jpg'],
    },
  };
}

const menu = menuData as unknown as Menu;

const totalCategories = menu.categories.length;
const totalItems = menu.categories.reduce((sum, cat) => sum + cat.items.length, 0);

export default async function MenuPage() {
  const t = await getTranslations('menu');
  const locale = await getLocale();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: t('jsonLd.name'),
    inLanguage: locale,
    description: t('jsonLd.description'),
    provider: {
      '@type': 'Restaurant',
      name: t('jsonLd.restaurantName'),
      servesCuisine: [t('jsonLd.cuisine1'), t('jsonLd.cuisine2')],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Нижні Млини',
        addressRegion: 'Полтавська область',
        addressCountry: 'UA',
      },
    },
    hasMenuSection: menu.categories.map((category) => ({
      '@type': 'MenuSection',
      name: locale === 'en' ? category.name : category.name,
      hasMenuItem: category.items.map((item) => ({
        '@type': 'MenuItem',
        name: locale === 'en' ? (item.name_en ?? item.name) : item.name,
        description: (locale === 'en' ? (item.description_en ?? item.description) : item.description) ?? undefined,
        offers: {
          '@type': 'Offer',
          price: item.price,
          priceCurrency: 'UAH',
        },
      })),
    })),
  };

  return (
    <>
      <Script id="menu-jsonld" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>

      {/* 1. HERO — deep forest */}
      <MenuHero
        totalCategories={totalCategories}
        totalItems={totalItems}
        kicker={t('hero.kicker')}
        headline={t('hero.headline')}
        subheadline={t('hero.subheadline')}
        intro={t('hero.intro')}
        statsCategories={t('hero.statsCategories')}
        statsDishes={t('hero.statsDishes')}
      />

      {/* 2. INTRO STRIP — cream editorial philosophy */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-4">
              <div className="flex items-center gap-4">
                <span className="font-display italic text-[#1a3d2e] text-lg">I</span>
                <span className="h-px w-10 bg-[#1a3d2e]/40" />
                <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/70">
                  {t('philosophy.kicker')}
                </span>
              </div>
            </div>
            <div className="md:col-span-8">
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light leading-[0.98] text-[#0f1f18]">
                {t('philosophy.headline')}
                <span className="block font-display italic text-[#1a3d2e]/80">
                  {t('philosophy.headlineItalic')}
                </span>
              </h2>
              <div className="mt-8 max-w-xl space-y-5 text-[#1a3d2e]/80 leading-relaxed">
                <p>{t('philosophy.para1')}</p>
                <p>{t('philosophy.para2')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2b. CHEF'S PICKS — "Зірки меню" (cream) */}
      <section className="bg-[#faf6ec] py-28 md:py-36 border-t border-[#e6d9b8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]">
                {t('chefPicks.kicker')}
              </span>
              <h2 className="font-display mt-6 text-4xl leading-[1.1] text-[#0f1f18] sm:text-5xl md:text-6xl">
                {t('chefPicks.headline')}
                <span className="block italic text-[#1a3d2e]">{t('chefPicks.headlineItalic')}</span>
              </h2>
            </div>
            <p className="max-w-md text-base leading-relaxed text-[#0f1f18]/70 md:text-right">
              {t('chefPicks.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px bg-[#1a3d2e]/20 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: t('chefPicks.dish1Name'), desc: t('chefPicks.dish1Desc') },
              { name: t('chefPicks.dish2Name'), desc: t('chefPicks.dish2Desc') },
              { name: t('chefPicks.dish3Name'), desc: t('chefPicks.dish3Desc') },
              { name: t('chefPicks.dish4Name'), desc: t('chefPicks.dish4Desc') },
            ].map((item) => (
              <article
                key={item.name}
                className="flex flex-col gap-5 bg-[#faf6ec] p-10"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center border border-[#1a3d2e]/30">
                    <Star
                      className="h-4 w-4 text-[#1a3d2e]"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="border border-[#e6d9b8] bg-[#e6d9b8]/50 px-3 py-1 text-[10px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]">
                    {t('chefPicks.badge')}
                  </span>
                </div>
                <h3 className="font-display text-2xl italic leading-[1.15] text-[#0f1f18]">
                  {item.name}
                </h3>
                <p className="text-sm leading-relaxed text-[#0f1f18]/70">
                  {item.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 3. MENU CATEGORIES — cream with sticky nav */}
      <div className="bg-[#faf6ec]">
        {/* Mobile-only nav pin */}
        <div className="lg:hidden">
          <CategoryNav categories={menu.categories} />
        </div>

        <div className="max-w-6xl mx-auto px-6 pb-24">
          <div className="lg:flex lg:items-stretch lg:gap-12 xl:gap-16">
            <main className="flex-1 min-w-0">
              {menu.categories.map((category) => (
                <CategorySection
                  key={category.id}
                  category={category}
                  locale={locale}
                  itemCountLabels={{
                    one: t('category.itemCount_one', { count: 1 }),
                    few: t('category.itemCount_few', { count: 2 }),
                    many: t('category.itemCount_many', { count: 5 }),
                  }}
                />
              ))}
            </main>

            <aside className="hidden lg:block lg:w-64 xl:w-72 flex-shrink-0">
              <CategoryNav categories={menu.categories} />
            </aside>
          </div>
        </div>
      </div>

      {/* 3b. FROM THE OVEN — "Що готують у печі" (deep forest) */}
      <section className="bg-[#0f1f18] py-28 md:py-36">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-16 md:grid-cols-12 md:items-center">
            <div className="md:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/images/restaurant/ukrainian_clay_oven_pich_food.jpg"
                  alt={t('oven.imageAlt')}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-7">
              <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#e6d9b8]">
                {t('oven.kicker')}
              </span>
              <h2 className="font-display mt-6 text-4xl leading-[1.05] text-[#faf6ec] sm:text-5xl md:text-6xl">
                {t('oven.headline')}
                <span className="block italic text-[#e6d9b8]">{t('oven.headlineItalic')}</span>
              </h2>
              <div className="mt-8 max-w-xl space-y-5 text-[#faf6ec]/75 leading-relaxed">
                <p>{t('oven.para1')}</p>
                <p>{t('oven.para2')}</p>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-px bg-[#1a3d2e]/40 border border-[#1a3d2e]/40">
                {[
                  { num: t('oven.stat1Num'), label: t('oven.stat1Label') },
                  { num: t('oven.stat2Num'), label: t('oven.stat2Label') },
                  { num: t('oven.stat3Num'), label: t('oven.stat3Label') },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col gap-2 bg-[#0f1f18] p-6"
                  >
                    <span className="font-display text-2xl italic text-[#e6d9b8] md:text-3xl">
                      {stat.num}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.16em] leading-snug text-[#faf6ec]/60">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INLINE BOOKING CTA — deep forest */}
      <section className="bg-[#0f1f18] text-[#faf6ec] py-28 md:py-36">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-4 mb-8">
            <span className="h-px w-10 bg-[#e6d9b8]/50" />
            <span className="text-[11px] uppercase tracking-[0.32em] text-[#e6d9b8]">
              {t('booking.kicker')}
            </span>
            <span className="h-px w-10 bg-[#e6d9b8]/50" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light leading-[0.98] text-[#faf6ec]">
            {t('booking.headline')}
          </h2>
          <p className="font-display italic text-xl md:text-2xl text-[#e6d9b8] mt-3 mb-10">
            {t('booking.headlineItalic')}
          </p>
          <p className="max-w-xl mx-auto text-[#faf6ec]/75 leading-relaxed mb-12">
            {t('booking.description')}
          </p>
          <div className="flex justify-center">
            <MenuBookingCTA label={t('booking.cta')} />
          </div>
        </div>
      </section>

      {/* 4b. LOCAL PRODUCERS — "Ми підтримуємо" (cream) */}
      <section className="bg-[#faf6ec] py-28 md:py-36 border-t border-[#e6d9b8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]">
                {t('producers.kicker')}
              </span>
              <h2 className="font-display mt-6 text-4xl leading-[1.1] text-[#0f1f18] sm:text-5xl md:text-6xl">
                {t('producers.headline')}
                <span className="block italic text-[#1a3d2e]">{t('producers.headlineItalic')}</span>
              </h2>
            </div>
            <p className="max-w-md text-base leading-relaxed text-[#0f1f18]/70 md:text-right">
              {t('producers.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px bg-[#1a3d2e]/20 border border-[#1a3d2e]/20 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { name: t('producers.producer1Name'), desc: t('producers.producer1Desc') },
              { name: t('producers.producer2Name'), desc: t('producers.producer2Desc') },
              { name: t('producers.producer3Name'), desc: t('producers.producer3Desc') },
              { name: t('producers.producer4Name'), desc: t('producers.producer4Desc') },
              { name: t('producers.producer5Name'), desc: t('producers.producer5Desc') },
            ].map((producer) => (
              <div
                key={producer.name}
                className="flex flex-col gap-3 bg-[#faf6ec] p-8"
              >
                <span className="text-[11px] uppercase tracking-[0.18em] font-medium leading-snug text-[#1a3d2e]">
                  {producer.name}
                </span>
                <span className="font-display text-sm italic leading-snug text-[#0f1f18]/70">
                  {producer.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FOOTER CTA — deep forest editorial */}
      <MenuFooter
        kicker={t('footer.kicker')}
        headline={t('footer.headline')}
        headlineItalic={t('footer.headlineItalic')}
        description={t('footer.description')}
        phone={t('footer.phone')}
        aboutRestaurant={t('footer.aboutRestaurant')}
      />

      <BackToTop ariaLabel={t('backToTop')} />

      {/* Cart UI — floating button + drawer (client) */}
      <CartButton />
      <CartDrawer />
    </>
  );
}
