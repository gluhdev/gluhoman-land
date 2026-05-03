import { Metadata } from 'next';
import Script from 'next/script';
import Image from 'next/image';
import { Star } from 'lucide-react';
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

export const metadata: Metadata = {
  title: 'Меню ресторану Глухомань — Українська кухня',
  description:
    'Меню ресторану «Глухомань» у Нижніх Млинах: автентична українська кухня, європейські страви, дитяче меню та крафтове пиво власної пивоварні.',
  keywords:
    'меню, ресторан, глухомань, українська кухня, європейська кухня, крафтове пиво, полтавська область',
  openGraph: {
    title: 'Меню ресторану Глухомань — Українська кухня',
    description:
      'Меню ресторану «Глухомань»: автентична українська кухня, європейські страви та крафтове пиво власної пивоварні.',
    type: 'website',
    locale: 'uk_UA',
    images: [
      {
        url: '/og-restaurant.jpg',
        width: 1200,
        height: 630,
        alt: 'Меню ресторану Глухомань',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Меню ресторану Глухомань — Українська кухня',
    description:
      'Меню ресторану «Глухомань»: автентична українська кухня, європейські страви та крафтове пиво власної пивоварні.',
    images: ['/og-restaurant.jpg'],
  },
};

const menu = menuData as unknown as Menu;

const totalCategories = menu.categories.length;
const totalItems = menu.categories.reduce((sum, cat) => sum + cat.items.length, 0);

export default function MenuPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: 'Меню ресторану Глухомань',
    inLanguage: 'uk',
    description:
      'Меню ресторану «Глухомань»: українська та європейська кухня, крафтове пиво власного виробництва.',
    provider: {
      '@type': 'Restaurant',
      name: 'Ресторан Глухомань',
      servesCuisine: ['Українська', 'Європейська'],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Нижні Млини',
        addressRegion: 'Полтавська область',
        addressCountry: 'UA',
      },
    },
    hasMenuSection: menu.categories.map((category) => ({
      '@type': 'MenuSection',
      name: category.name,
      hasMenuItem: category.items.map((item) => ({
        '@type': 'MenuItem',
        name: item.name,
        description: item.description ?? undefined,
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
      <MenuHero totalCategories={totalCategories} totalItems={totalItems} />

      {/* 2. INTRO STRIP — cream editorial philosophy */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-10 items-start">
            <div className="md:col-span-4">
              <div className="flex items-center gap-4">
                <span className="font-display italic text-[#1a3d2e] text-lg">I</span>
                <span className="h-px w-10 bg-[#1a3d2e]/40" />
                <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/70">
                  Філософія кухні
                </span>
              </div>
            </div>
            <div className="md:col-span-8">
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light leading-[0.98] text-[#0f1f18]">
                Смак, що пам&apos;ятає
                <span className="block font-display italic text-[#1a3d2e]/80">
                  дім і сезон
                </span>
              </h2>
              <div className="mt-8 max-w-xl space-y-5 text-[#1a3d2e]/80 leading-relaxed">
                <p>
                  Наша кухня народжується з локальних продуктів: фермерське
                  м&apos;ясо, полтавські сири, овочі з власного городу, риба з
                  місцевих водойм і борошно старого млина.
                </p>
                <p>
                  Ми з&apos;єднуємо традиції української кухні з європейськими
                  техніками — і доповнюємо все крафтовим пивом власної пивоварні,
                  зібраним за рецептами головного броварника.
                </p>
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
                Зірки меню
              </span>
              <h2 className="font-display mt-6 text-4xl leading-[1.1] text-[#0f1f18] sm:text-5xl md:text-6xl">
                Обрані страви
                <span className="block italic text-[#1a3d2e]">від шефа</span>
              </h2>
            </div>
            <p className="max-w-md text-base leading-relaxed text-[#0f1f18]/70 md:text-right">
              Те, що гості замовляють найчастіше — і те, що ми радимо спробувати
              у перший візит.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px bg-[#1a3d2e]/20 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: "Качка з яблуками",
                desc: "Сезонний хіт, головна страва — запечена у печі до золотавої скоринки.",
              },
              {
                name: "Борщ український",
                desc: "Класика, що не виходить з меню. Сало, пампушки, сметана.",
              },
              {
                name: "Лісова IPA",
                desc: "Крафтове пиво власної пивоварні — лауреат регіонального фестивалю.",
              },
              {
                name: "Сирники з медом",
                desc: "Найпопулярніший десерт — з топленим медом власної пасіки.",
              },
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
                    хіт
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
                <CategorySection key={category.id} category={category} />
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
                  alt="Українська піч на дровах у ресторані Глухомань"
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-7">
              <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#e6d9b8]">
                З печі
              </span>
              <h2 className="font-display mt-6 text-4xl leading-[1.05] text-[#faf6ec] sm:text-5xl md:text-6xl">
                Справжня піч
                <span className="block italic text-[#e6d9b8]">на дровах</span>
              </h2>
              <div className="mt-8 max-w-xl space-y-5 text-[#faf6ec]/75 leading-relaxed">
                <p>
                  У серці нашої кухні стоїть справжня українська піч, викладена
                  вручну з глини та цегли. Ми топимо її тільки дровами — ніякого
                  газу, ніякої електрики. Це повільний спосіб готувати, але
                  єдиний, що дає той смак, який ми пам&apos;ятаємо з дитинства.
                </p>
                <p>
                  У печі народжується наша запечена качка, домашній житній хліб,
                  гречана каша у горщиках і пироги з вишнями. Страви, які
                  по-справжньому звучать лише тоді, коли їх торкнувся живий
                  вогонь.
                </p>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-px bg-[#1a3d2e]/40 border border-[#1a3d2e]/40">
                {[
                  { num: "180°C", label: "ідеальна температура" },
                  { num: "4 години", label: "готування качки" },
                  { num: "100% дров", label: "ніякого газу" },
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
              Столик на вечір
            </span>
            <span className="h-px w-10 bg-[#e6d9b8]/50" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light leading-[0.98] text-[#faf6ec]">
            Запрошуємо до столу
          </h2>
          <p className="font-display italic text-xl md:text-2xl text-[#e6d9b8] mt-3 mb-10">
            у ресторані «Глухомань»
          </p>
          <p className="max-w-xl mx-auto text-[#faf6ec]/75 leading-relaxed mb-12">
            Оберіть дату, кількість гостей і зал — ми підготуємо столик і
            зустрінемо вас із посмішкою.
          </p>
          <div className="flex justify-center">
            <MenuBookingCTA />
          </div>
        </div>
      </section>

      {/* 4b. LOCAL PRODUCERS — "Ми підтримуємо" (cream) */}
      <section className="bg-[#faf6ec] py-28 md:py-36 border-t border-[#e6d9b8]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16 flex flex-col gap-6 md:mb-20 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <span className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]">
                Ми підтримуємо
              </span>
              <h2 className="font-display mt-6 text-4xl leading-[1.1] text-[#0f1f18] sm:text-5xl md:text-6xl">
                Місцеві
                <span className="block italic text-[#1a3d2e]">виробники</span>
              </h2>
            </div>
            <p className="max-w-md text-base leading-relaxed text-[#0f1f18]/70 md:text-right">
              Усі продукти, з яких народжується наше меню, приходять від сусідів —
              господарів з Полтавщини, яких ми знаємо особисто.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px bg-[#1a3d2e]/20 border border-[#1a3d2e]/20 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                name: "Молочарка Білий Сад",
                desc: "Сир, сметана, йогурт",
              },
              {
                name: "Ферма «Соняшник»",
                desc: "Куряче м'ясо, яйця",
              },
              {
                name: "Сад «Полтавський»",
                desc: "Яблука, груші, зелень",
              },
              {
                name: "Рибалка Петренко",
                desc: "Свіжа риба з місцевого ставу",
              },
              {
                name: "Пасіка Глухомань",
                desc: "Мед, прополіс, віск",
              },
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
      <MenuFooter />

      <BackToTop />

      {/* Cart UI — floating button + drawer (client) */}
      <CartButton />
      <CartDrawer />
    </>
  );
}
