import { Metadata } from "next";
import Image from "next/image";
import Script from "next/script";
import { BLUR_DATA_URL } from "@/lib/blur-placeholder";
import Link from "next/link";
import {
  Leaf,
  ChefHat,
  Wheat,
  Phone,
  Salad,
  Soup,
  Beef,
  Cake,
  Wine,
  Users,
  Heart,
  PartyPopper,
  Home,
  ArrowUpRight,
  Utensils,
  Beer,
  Music,
  Clock,
  Star,
} from "lucide-react";
import { BookingButton } from "@/components/ui/BookingButton";
import { GalleryGrid } from "@/components/ui/GalleryGrid";
import { EmbeddedMenu } from "@/components/menu/EmbeddedMenu";
import { CONTACT_INFO } from "@/constants";

export const metadata: Metadata = {
  title: "Ресторан «Глухомань» — Кухня та музика у Полтавській області",
  description:
    "Ресторан «Глухомань» у с. Нижні Млини: європейсько-українська кухня, українська піч на дровах, крафтове пиво власної пивоварні, павлінарій у залі «Жар-Птиці» та жива музика на вихідних.",
  openGraph: {
    title: "Ресторан «Глухомань» — Кухня та музика",
    description:
      "Європейсько-українська кухня, піч на дровах, крафтове пиво власної пивоварні та жива музика на вихідних.",
    images: [
      {
        url: "/og-restaurant.jpg",
        width: 1200,
        height: 630,
        alt: "Ресторан Глухомань",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ресторан «Глухомань»",
    description:
      "Європейсько-українська кухня та жива музика у мальовничому куточку Полтавщини.",
    images: ["/og-restaurant.jpg"],
  },
};

const philosophy = [
  {
    icon: Leaf,
    title: "Місцеві фермери",
    text: "Сезонні продукти від перевірених господарств Полтавщини.",
  },
  {
    icon: ChefHat,
    title: "Авторські страви",
    text: "Шеф-кухар переосмислює класику української кухні.",
  },
  {
    icon: Wheat,
    title: "Домашня випічка",
    text: "Хліб та десерти з власної пекарні щодня зранку.",
  },
];

const interiorHalls = [
  {
    image: "/images/restaurant/hall_floor1_rustic_wide.jpg",
    caption: "Перший поверх",
    alt: "Перший поверх ресторану у рустикальному стилі",
  },
  {
    image: "/images/restaurant/hall_floor2_balcony_door.jpg",
    caption: "Другий поверх з балконом",
    alt: "Другий поверх ресторану з виходом на балкон",
  },
  {
    image: "/images/restaurant/hall_fireplace_balcony.jpg",
    caption: "Зала з каміном",
    alt: "Зала ресторану з каміном",
  },
  {
    image: "/images/restaurant/hall_banquet.jpg",
    caption: "Банкетна зала",
    alt: "Банкетна зала ресторану Глухомань",
  },
  {
    image: "/images/restaurant/hall_oven.jpg",
    caption: "Дровяна піч",
    alt: "Традиційна дровяна піч",
  },
  {
    image: "/images/restaurant/hall_terrace.jpg",
    caption: "Літня тераса",
    alt: "Літня тераса ресторану",
  },
];

const catering = [
  {
    title: "Кейтеринг",
    image: "/images/restaurant/hall_private.jpg",
    alt: "Приватна зала для кейтерингу",
    text: "Виїзне обслуговування для ділових зустрічей та приватних вечірок під ключ.",
  },
  {
    title: "Аніматори для дітей",
    image: "/images/restaurant/animation_clown_with_child.jpg",
    alt: "Клоун-аніматор з дитиною",
    text: "Професійні аніматори, ігри та конкурси — діти у захваті, поки дорослі відпочивають.",
  },
  {
    title: "Тематичні вечори",
    image: "/images/restaurant/animation_kids_pirate_night.jpg",
    alt: "Тематична піратська вечірка для дітей",
    text: "Піратські вечірки, костюмовані свята та авторські сценарії для будь-якого віку.",
  },
];

type MenuDish = {
  name: string;
  description: string;
  tags?: string[];
};

type MenuCategory = {
  icon: typeof Salad;
  title: string;
  items: MenuDish[];
};

const menuCategories: MenuCategory[] = [
  {
    icon: Salad,
    title: "Закуски",
    items: [
      {
        name: "Сало по-домашньому",
        description:
          "Шинка холодного копчення з часником, чорним хлібом і гірчицею",
      },
      {
        name: "Селедка з картоплею",
        description: "Філе оселедця, тепла молода картопля, цибуля, олія",
      },
      {
        name: "Грибна юшка з білих",
        description: "Дикоросла лісова грибна юшка зі сметаною",
      },
      {
        name: "Голубці з квашеною капустою",
        description: "Класичні голубці у томатно-сметанному соусі",
        tags: ["сезонне"],
      },
      {
        name: "Пиріжки з картоплею",
        description: "Домашня випічка з картопляною начинкою",
        tags: ["веган"],
      },
      {
        name: "Капусняк",
        description: "Жирний український капусняк з копченим м'ясом",
      },
    ],
  },
  {
    icon: Soup,
    title: "Перші страви",
    items: [
      {
        name: "Борщ український",
        description: "Класичний борщ із салом, пампушками і часником",
      },
      {
        name: "Куряча локшина",
        description: "Курячий бульйон з домашньою локшиною",
      },
      {
        name: "Гриб'яна крем-юшка",
        description: "Лісові гриби, картопля, вершки",
      },
      {
        name: "Рибна юшка",
        description: "Свіжа річкова риба, картопля, морква",
      },
      {
        name: "Холодник",
        description: "Літній буряковий холодник зі сметаною",
        tags: ["сезонне"],
      },
    ],
  },
  {
    icon: Beef,
    title: "Гарячі страви",
    items: [
      {
        name: "Качка з яблуками",
        description: "Запечена качка з фермерськими яблуками і медом",
      },
      {
        name: "Деруни зі сметаною",
        description: "Картопляні млинці з домашньою сметаною",
        tags: ["без глютену"],
      },
      {
        name: "Котлети по-київськи",
        description: "Класична котлета з вершковим маслом",
      },
      {
        name: "Шашлик зі свинячої шиї",
        description: "Маринований шашлик на дровах",
      },
      {
        name: "Форель на грилі",
        description: "Свіжа річкова форель з лимоном і травами",
      },
      {
        name: "Вареники з вишнею",
        description: "Літні вареники з лісовою вишнею",
        tags: ["сезонне"],
      },
      {
        name: "Голубці з рисом і м'ясом",
        description: "Класичні голубці у томатному соусі",
      },
    ],
  },
  {
    icon: Cake,
    title: "Десерти",
    items: [
      {
        name: "Сирники зі сметаною та варенням",
        description: "Класичні домашні сирники",
      },
      {
        name: "Медовик",
        description: "Багатошаровий торт з медом і вершковим кремом",
      },
      {
        name: "Узвар",
        description:
          "Традиційний український компот зі смаженими сухофруктами",
        tags: ["веган"],
      },
      {
        name: "Маківник",
        description: "Рулет з маком за бабусиним рецептом",
      },
      {
        name: "Морозиво з лісовими ягодами",
        description: "Домашнє ванільне морозиво",
      },
    ],
  },
  {
    icon: Wine,
    title: "Напої",
    items: [
      {
        name: "Узвар домашній",
        description: "Сухофрукти, мед, гвоздика",
        tags: ["веган"],
      },
      {
        name: "Глінтвейн",
        description: "Зимовий глінтвейн з прянощами",
        tags: ["сезонне"],
      },
      {
        name: "Крафтове пиво",
        description: "Власна пивоварня, 4 сорти на вибір",
      },
      {
        name: "Українські вина",
        description: "Винна карта місцевих виноробень",
      },
      {
        name: "Кава по-турецьки",
        description: "Класична варена кава",
      },
      {
        name: "Чай з трав і ягід",
        description: "Збір з власного саду",
      },
    ],
  },
];

const signatureDishes = [
  {
    name: "Качка з яблуками",
    image: "/images/restaurant/hall_oven.jpg",
    alt: "Запечена качка з яблуками у дровяній печі",
    text: "Запечена у печі на дровах, карамелізовані фермерські яблука, мед з нашої пасіки. Страва вечора.",
  },
  {
    name: "Борщ український",
    image: "/images/restaurant/ukrainian_clay_oven_pich_food.jpg",
    alt: "Український борщ з пампушками",
    text: "Класичний борщ з томленим салом, пампушками з часником, домашньою сметаною. Рецепт від бабусі шефа.",
  },
  {
    name: "Вареники з вишнею",
    image: "/images/restaurant/main_hall_long_table_evening.jpg",
    alt: "Вареники з лісовою вишнею",
    text: "Літні вареники з лісовою вишнею, сметана, мед. Сезонна страва.",
  },
  {
    name: "Сирники з топленим медом",
    image: "/images/restaurant/terrace_hall_banquet_food_table.jpg",
    alt: "Домашні сирники з медом",
    text: "Домашній сир, мед, лісові ягоди. Ідеальний десерт до кави.",
  },
];

const liveMusicSchedule = [
  {
    day: "П'ятниця",
    genre: "Акустичний джаз",
    time: "20:00 — 22:30",
  },
  {
    day: "Субота",
    genre: "Українська етно-музика, вечір автентики",
    time: "19:00 — 23:00",
  },
  {
    day: "Неділя",
    genre: "Спокійна класика на обід",
    time: "14:00 — 17:00",
  },
];

const events = [
  {
    icon: Users,
    title: "Корпоративи",
    text: "Просторий зал та власне меню для команди будь-якого масштабу.",
    image: "/images/restaurant/event_04_music.jpg",
    alt: "Корпоративний захід з музикою",
  },
  {
    icon: Heart,
    title: "Весілля",
    text: "Організація урочистостей під ключ — від декору до бенкетного меню.",
    image: "/images/restaurant/event_fruit_table_terrace.jpg",
    alt: "Весільний стіл з фруктами на терасі",
  },
  {
    icon: PartyPopper,
    title: "Дні народження",
    text: "Святкове меню, торт на замовлення та програма для гостей.",
    image: "/images/restaurant/event_birthday_balloon_decor.jpg",
    alt: "Декор з повітряними кульками на день народження",
  },
  {
    icon: Home,
    title: "Сімейні обіди",
    text: "Затишна атмосфера для недільних зустрічей усієї родини.",
    image: "/images/restaurant/event_03.jpg",
    alt: "Сімейний обід у ресторані",
  },
];

export default function RestaurantPage() {
  const primaryPhone = CONTACT_INFO.phone[0];
  const telHref = `tel:${primaryPhone.replace(/\s+/g, "")}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Ресторан Глухомань",
    description:
      "Ресторан української та європейської кухні у рекреаційному комплексі Глухомань, с. Нижні Млини, Полтавська область.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "UA",
      addressRegion: "Полтавська область",
      addressLocality: "с. Нижні Млини",
    },
    telephone: primaryPhone,
    servesCuisine: ["Українська", "Європейська"],
    priceRange: "$$",
    acceptsReservations: true,
    image: "/images/restaurant/exterior_summer_terrace_water.jpg",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "12:00",
        closes: "22:00",
      },
    ],
  };

  // Safe JSON-LD: JSON.stringify with </ escaped to avoid script tag breakout.
  const jsonLdString = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <>
      <Script
        id="restaurant-schema"
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {jsonLdString}
      </Script>

      {/* 1. HERO — dark forest editorial */}
      <section id="hero-section" className="hero-section relative min-h-[90svh] flex items-center justify-center overflow-hidden bg-[#0b1410]">
        <Image
          fill
          priority
          src="/images/restaurant/exterior_summer_terrace_water.jpg"
          alt="Літня тераса ресторану Глухомань біля води"
          className="object-cover opacity-55"
          sizes="100vw"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1410]/40 via-[#0b1410]/20 to-[#0b1410]" />
        <div className="relative z-10 max-w-5xl px-6 text-center text-[#f4ecd8]">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[#e6d9b8] mb-6">
            Кухня та музика • III
          </p>
          <h1 className="font-display text-6xl md:text-8xl leading-[0.9] mb-6">
            Ресторан
            <span className="block italic text-[#e6d9b8]">«Глухомань»</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-[#f4ecd8]/80 mb-10 font-light leading-relaxed">
            Європейсько-українська кухня, українська піч на дровах, крафтове
            пиво власної пивоварні, павлінарій у залі «Жар-Птиці» та жива
            музика на вихідних.
          </p>
          <BookingButton
            service="restaurant"
            className="inline-flex items-center gap-3 bg-[#e6d9b8] text-[#0f1f18] px-10 py-4 font-medium tracking-wide hover:bg-[#f4ecd8] transition"
          >
            Забронювати столик <ArrowUpRight className="w-4 h-4" />
          </BookingButton>
        </div>
      </section>

      {/* 2. PHILOSOPHY — cream editorial */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-20">
            <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e] mb-6">
              Філософія • I
            </p>
            <h2 className="font-display text-5xl md:text-6xl text-[#0f1f18] leading-[0.95] mb-6">
              Смак, що народжується
              <span className="block italic text-[#1a3d2e]">з поваги до землі</span>
            </h2>
            <p className="text-[#1a3d2e]/75 md:text-lg font-light leading-relaxed">
              Ми віримо, що справжній смак народжується з поваги до традицій,
              свіжих продуктів та щирої гостинності. Кожна страва — це історія
              полтавського краю на вашій тарілці.
            </p>
          </div>
          <div className="grid gap-px bg-[#e6d9b8] md:grid-cols-3 border border-[#e6d9b8]">
            {philosophy.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="bg-[#faf6ec] p-12 text-center"
              >
                <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center bg-[#e6d9b8] text-[#0f1f18]">
                  <Icon className="h-7 w-7" strokeWidth={1.4} />
                </div>
                <h3 className="font-display text-2xl text-[#0f1f18] mb-3">
                  {title}
                </h3>
                <p className="text-[#1a3d2e]/70 font-light leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2b. CHEF — deep forest editorial */}
      <section className="bg-[#0f1f18] py-28 md:py-36">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  borderRadius:
                    "62% 38% 54% 46% / 48% 52% 48% 52%",
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/images/restaurant/bar_staff_holding_menu.jpg"
                  alt="Шеф-кухар Андрій Коваленко"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              </div>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#e6d9b8] mb-6 flex items-center gap-3">
                <ChefHat className="w-4 h-4" strokeWidth={1.4} />
                Шеф-кухар
              </p>
              <h2 className="font-display text-5xl md:text-6xl text-[#f4ecd8] leading-[0.95] mb-8">
                Андрій Коваленко
                <span className="block italic text-[#e6d9b8] text-4xl md:text-5xl mt-3">
                  бо на кухні мусить бути душа
                </span>
              </h2>
              <div className="space-y-5 text-[#f4ecd8]/75 md:text-lg font-light leading-relaxed">
                <p>
                  Андрій почав кар&apos;єру у 16 років на кухні львівського
                  ресторану. Після 8 років роботи в Європі повернувся в
                  Україну — працював у Києві, а потім обрав Полтавщину як
                  місце, де можна зробити справді автентичну українську
                  кухню.
                </p>
                <p>
                  У «Глухомані» Андрій створив меню, яке об&apos;єднує
                  традиційні рецепти бабусиної кухні з європейськими
                  техніками. Усе м&apos;ясо, молочні продукти і зелень ми
                  отримуємо від місцевих фермерів з радіусу 30 км.
                </p>
              </div>
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-[#e6d9b8]/20 pt-10">
                <div>
                  <p className="font-display text-4xl md:text-5xl text-[#f4ecd8]">
                    15 років
                  </p>
                  <p className="italic text-[#e6d9b8]/80 text-sm mt-2 font-light">
                    досвіду на кухні
                  </p>
                </div>
                <div>
                  <p className="font-display text-4xl md:text-5xl text-[#f4ecd8]">
                    30 км
                  </p>
                  <p className="italic text-[#e6d9b8]/80 text-sm mt-2 font-light">
                    радіус пошуку продуктів
                  </p>
                </div>
                <div>
                  <p className="font-display text-4xl md:text-5xl text-[#f4ecd8]">
                    40 страв
                  </p>
                  <p className="italic text-[#e6d9b8]/80 text-sm mt-2 font-light">
                    в авторському меню
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTERIOR & HALLS — cream gallery */}
      <section className="bg-[#f4ecd8] py-28 md:py-36">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-20">
            <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e] mb-6">
              Інтер&apos;єр та зали • II
            </p>
            <h2 className="font-display text-5xl md:text-6xl text-[#0f1f18] leading-[0.95] mb-6">
              Шість просторів,
              <span className="block italic text-[#1a3d2e]">один настрій</span>
            </h2>
            <p className="text-[#1a3d2e]/75 md:text-lg font-light leading-relaxed">
              Від рустикального першого поверху до банкетної зали та літньої
              тераси серед зелені — для кожної події знайдеться своє місце.
            </p>
          </div>
          <GalleryGrid
            columns={3}
            aspect="landscape"
            images={interiorHalls.map(({ image, caption, alt }) => ({
              src: image,
              alt,
              caption,
            }))}
          />
        </div>
      </section>

      {/* 3b. SIGNATURE DISHES — cream editorial spotlight */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-20">
            <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e] mb-6 flex items-center justify-center gap-3">
              <Utensils className="w-4 h-4" strokeWidth={1.4} />
              Фірмові страви
            </p>
            <h2 className="font-display text-5xl md:text-6xl text-[#0f1f18] leading-[0.95] mb-6">
              Чотири страви,
              <span className="block italic text-[#1a3d2e]">заради яких повертаються</span>
            </h2>
            <p className="text-[#1a3d2e]/75 md:text-lg font-light leading-relaxed">
              Авторські позиції меню, які стали візитівкою «Глухомані» — від
              качки з дровяної печі до літніх вареників з лісовою вишнею.
            </p>
          </div>
          <div className="grid gap-16 md:grid-cols-2">
            {signatureDishes.map(({ name, image, alt, text }, idx) => (
              <article key={name} className="flex flex-col">
                <div className="relative aspect-[4/3] w-full mb-8">
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      borderRadius:
                        idx % 2 === 0
                          ? "58% 42% 60% 40% / 52% 48% 52% 48%"
                          : "44% 56% 42% 58% / 48% 54% 46% 52%",
                    }}
                  >
                    <Image
                      src={image}
                      alt={alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 50vw, 100vw"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  </div>
                </div>
                <p className="text-[10px] uppercase tracking-[0.24em] font-medium text-[#1a3d2e] mb-4 flex items-center gap-2">
                  <Star className="w-3 h-3" strokeWidth={1.6} />
                  <span className="bg-[#e6d9b8] text-[#0f1f18] px-3 py-1">
                    особлива
                  </span>
                </p>
                <h3 className="font-display italic text-4xl md:text-5xl text-[#0f1f18] mb-4 leading-[1]">
                  {name}
                </h3>
                <p className="text-[#1a3d2e]/75 md:text-lg font-light leading-relaxed">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MENU — deep forest contrast */}
      <section className="bg-[#0f1f18] py-28 md:py-36">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-20">
            <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#e6d9b8] mb-6">
              Меню • III
            </p>
            <h2 className="font-display text-5xl md:text-6xl text-[#f4ecd8] leading-[0.95] mb-6">
              Діалог
              <span className="block italic text-[#e6d9b8]">з полтавською землею</span>
            </h2>
            <p className="text-[#f4ecd8]/70 md:text-lg font-light leading-relaxed">
              Сезонні продукти від місцевих фермерів, рибалок і садівників;
              бабусині рецепти, перевірені поколіннями. Меню змінюється разом
              із порами року, щоб кожна страва розкривала смак того, що
              дозріло саме зараз.
            </p>
          </div>

          {/* Embedded interactive menu — internal scroll, sticky category nav.
              When user reaches top/bottom of inner scroll, wheel events bubble
              up so they can naturally continue scrolling the page. */}
          <EmbeddedMenu />
        </div>
      </section>

      {/* 4b. BREWERY — deep forest spotlight */}
      <section className="bg-[#0f1f18] py-28 md:py-36">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div className="relative aspect-[5/4] w-full order-2 md:order-1">
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  borderRadius:
                    "56% 44% 48% 52% / 44% 58% 42% 56%",
                }}
              >
                <Image
                  src="/images/restaurant/craft_beer_glasses_snacks.jpg"
                  alt="Крафтове пиво власної пивоварні Глухомань"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#e6d9b8] mb-6 flex items-center gap-3">
                <Beer className="w-4 h-4" strokeWidth={1.4} />
                Власне виробництво
              </p>
              <h2 className="font-display text-5xl md:text-6xl text-[#f4ecd8] leading-[0.95] mb-8">
                Крафтова пивоварня
                <span className="block italic text-[#e6d9b8]">«Глухомань»</span>
              </h2>
              <div className="space-y-5 text-[#f4ecd8]/75 md:text-lg font-light leading-relaxed">
                <p>
                  Власна пивоварня працює за класичними чесько-німецькими
                  рецептами. Пиво вариться на артезіанській воді з нашого
                  джерела — це дає йому характерну м&apos;якість і чистий
                  смак, який неможливо сплутати.
                </p>
                <p>
                  Чотири фірмові сорти: світлий лагер, напівтемний віденський,
                  пшеничний нефільтрований і міцний портер. Кожна партія —
                  ручна робота невеликої команди пивоварів.
                </p>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-[#e6d9b8]/20 pt-8 mb-10">
                <div>
                  <p className="font-display text-3xl md:text-4xl text-[#f4ecd8]">
                    4 сорти
                  </p>
                  <p className="italic text-[#e6d9b8]/80 text-xs mt-1 font-light">
                    на дегустацію
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl md:text-4xl text-[#f4ecd8]">
                    90 хв
                  </p>
                  <p className="italic text-[#e6d9b8]/80 text-xs mt-1 font-light">
                    тур з гідом
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl md:text-4xl text-[#f4ecd8]">
                    18+
                  </p>
                  <p className="italic text-[#e6d9b8]/80 text-xs mt-1 font-light">
                    лише для дорослих
                  </p>
                </div>
              </div>
              <Link
                href="/other-services/brewery-tour"
                className="inline-flex items-center gap-3 bg-[#e6d9b8] text-[#0f1f18] px-10 py-4 font-medium tracking-wide hover:bg-[#f4ecd8] transition"
              >
                Замовити тур <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ATMOSPHERE — cream, 2-col */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="max-w-6xl mx-auto px-6 grid items-center gap-16 md:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e] mb-6">
              Атмосфера • IV
            </p>
            <h2 className="font-display text-5xl md:text-6xl text-[#0f1f18] leading-[0.95] mb-8">
              Тепле світло,
              <span className="block italic text-[#1a3d2e]">шелест саду</span>
            </h2>
            <div className="space-y-5 text-[#1a3d2e]/80 md:text-lg font-light leading-relaxed">
              <p>
                Дерев&apos;яний інтер&apos;єр із теплим світлом, камін, що
                потріскує зимовими вечорами, і запах свіжої випічки — справжній
                український дім.
              </p>
              <p>
                Влітку відкривається тераса серед зелені саду — місце для
                неквапливих обідів під шелест листя та спів птахів.
              </p>
              <p>
                Ми продумали кожну деталь: від вишитих скатертин до глиняного
                посуду ручної роботи місцевих майстрів.
              </p>
            </div>
          </div>
          <GalleryGrid
            columns={2}
            aspect="landscape"
            showCaptions={false}
            images={[
              {
                src: "/images/restaurant/bar_staff_holding_menu.jpg",
                alt: "Персонал бару тримає меню",
              },
              {
                src: "/images/restaurant/decor_photozone_green_hedge.jpg",
                alt: "Фотозона з живоплотом",
              },
              {
                src: "/images/restaurant/balcony_floor2_wooden_furniture.jpg",
                alt: "Балкон другого поверху з дерев'яними меблями",
              },
              {
                src: "/images/restaurant/exterior_summer_terrace_water.jpg",
                alt: "Літня тераса біля води",
              },
            ]}
          />
        </div>
      </section>

      {/* 6. EVENTS — cream */}
      <section className="bg-[#f4ecd8] py-28 md:py-36">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-20">
            <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e] mb-6">
              Заходи • V
            </p>
            <h2 className="font-display text-5xl md:text-6xl text-[#0f1f18] leading-[0.95] mb-6">
              Від камерної вечері
              <span className="block italic text-[#1a3d2e]">до великого свята</span>
            </h2>
            <p className="text-[#1a3d2e]/75 md:text-lg font-light leading-relaxed">
              Допоможемо організувати подію будь-якого формату — від камерної
              вечері до весілля на сотню гостей.
            </p>
          </div>
          <div className="grid gap-px bg-[#e6d9b8] md:grid-cols-2 lg:grid-cols-4 border border-[#e6d9b8]">
            {events.map(({ icon: Icon, title, text, image, alt }) => (
              <div
                key={title}
                className="bg-[#faf6ec] flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={image}
                    alt={alt}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                  />
                </div>
                <div className="p-8 flex-1">
                  <div className="mb-5 flex h-10 w-10 items-center justify-center bg-[#e6d9b8] text-[#0f1f18]">
                    <Icon className="h-5 w-5" strokeWidth={1.4} />
                  </div>
                  <h3 className="font-display text-2xl text-[#0f1f18] mb-2">
                    {title}
                  </h3>
                  <p className="text-[#1a3d2e]/70 font-light leading-relaxed text-sm">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Catering & animation */}
          <div className="mt-24">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e] mb-6">
                Кейтеринг та анімація
              </p>
              <h3 className="font-display text-4xl md:text-5xl text-[#0f1f18] leading-[0.95]">
                Подбаємо про
                <span className="italic text-[#1a3d2e]"> ваших гостей</span>
              </h3>
            </div>
            <div className="grid gap-px bg-[#e6d9b8] md:grid-cols-3 border border-[#e6d9b8]">
              {catering.map(({ title, image, alt, text }) => (
                <div key={title} className="bg-[#faf6ec] flex flex-col">
                  <div className="relative aspect-[3/2] w-full overflow-hidden">
                    <Image
                      src={image}
                      alt={alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 33vw, 100vw"
                      placeholder="blur"
                      blurDataURL={BLUR_DATA_URL}
                    />
                  </div>
                  <div className="p-8 flex-1">
                    <h4 className="font-display text-2xl text-[#0f1f18] mb-2">
                      {title}
                    </h4>
                    <p className="text-[#1a3d2e]/70 font-light leading-relaxed text-sm">
                      {text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. HOURS — minimal cream strip */}
      <section className="bg-[#faf6ec] py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e] mb-6">
            Графік роботи • VI
          </p>
          <p className="font-display text-4xl md:text-6xl text-[#0f1f18] leading-[1.1]">
            Щодня <span className="italic text-[#1a3d2e]">12:00 — 22:00</span>
          </p>
          <p className="mt-4 text-[#1a3d2e]/70 md:text-lg font-light italic">
            кухня працює до 21:30
          </p>
        </div>
      </section>

      {/* 7b. LIVE MUSIC — cream editorial schedule */}
      <section className="bg-[#faf6ec] py-28 md:py-36">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-20">
            <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e] mb-6 flex items-center justify-center gap-3">
              <Music className="w-4 h-4" strokeWidth={1.4} />
              Жива музика
            </p>
            <h2 className="font-display text-5xl md:text-6xl text-[#0f1f18] leading-[0.95] mb-6">
              Вечори під
              <span className="block italic text-[#1a3d2e]">акустичні струни</span>
            </h2>
            <div className="relative mx-auto mt-10 mb-10 aspect-[16/9] max-w-xl">
              <div
                className="absolute inset-0 overflow-hidden"
                style={{
                  borderRadius: "48% 52% 46% 54% / 52% 46% 54% 48%",
                }}
              >
                <Image
                  src="/images/restaurant/live_music_danil.jpg"
                  alt="Жива музика у ресторані Глухомань"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 40vw, 90vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              </div>
            </div>
            <p className="text-[#1a3d2e]/75 md:text-lg font-light leading-relaxed">
              Щовихідних у залі звучить жива музика — від акустичного джазу
              до автентичної української етніки. Вечеря стає маленьким
              концертом, де кожна страва підкреслена настроєм музики.
            </p>
          </div>
          <div className="grid gap-px bg-[#e6d9b8] md:grid-cols-3 border border-[#e6d9b8]">
            {liveMusicSchedule.map(({ day, genre, time }) => (
              <div
                key={day}
                className="bg-[#faf6ec] p-12 text-center flex flex-col items-center"
              >
                <p className="font-display text-4xl md:text-5xl text-[#0f1f18] mb-4 leading-[1]">
                  {day}
                </p>
                <div className="w-12 h-px bg-[#1a3d2e]/40 mb-5" />
                <p className="italic text-[#1a3d2e] md:text-lg font-light leading-snug mb-6">
                  {genre}
                </p>
                <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/70 flex items-center gap-2 mt-auto">
                  <Clock className="w-3 h-3" strokeWidth={1.6} />
                  {time}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FINAL CTA — deep forest */}
      <section className="bg-[#0f1f18] py-32 md:py-40">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#e6d9b8] mb-6">
            Резервація • VII
          </p>
          <h2 className="font-display text-5xl md:text-7xl text-[#f4ecd8] leading-[0.95] mb-8">
            Зарезервуйте
            <span className="block italic text-[#e6d9b8]">столик</span>
          </h2>
          <p className="max-w-xl mx-auto text-[#f4ecd8]/75 md:text-lg font-light leading-relaxed mb-12">
            Залиште заявку — ми підберемо кращий час і столик для вашого
            візиту.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <BookingButton
              service="restaurant"
              className="inline-flex items-center gap-3 bg-[#e6d9b8] text-[#0f1f18] px-10 py-4 font-medium tracking-wide hover:bg-[#f4ecd8] transition"
            >
              Забронювати <ArrowUpRight className="w-4 h-4" />
            </BookingButton>
            <a
              href={telHref}
              className="inline-flex items-center gap-3 border border-[#e6d9b8]/40 text-[#f4ecd8] px-10 py-4 font-medium tracking-wide hover:bg-[#e6d9b8]/10 transition"
            >
              <Phone className="w-4 h-4" /> {primaryPhone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
