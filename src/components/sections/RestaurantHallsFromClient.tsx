/**
 * RestaurantHallsFromClient
 *
 * Self-contained "Наші зали" section with all 7 halls from the client's
 * ОПИСАНИЕ РЕСТОРАН.docx. Built to be dropped into the restaurant page
 * without depending on any props or shared types.
 *
 * All copy and hall data is taken verbatim from the client brief — do NOT
 * paraphrase; these are the canonical descriptions.
 */

import Image from 'next/image';
import Link from 'next/link';
import { Phone, Users } from 'lucide-react';

type Hall = {
  n: string;
  title: string;
  floor: string;
  capacity: string;
  image: string;
  alt: string;
  lead: string;
  body: string[];
};

const HALLS: Hall[] = [
  {
    n: 'I',
    title: 'Зал з українською піччю',
    floor: 'І поверх',
    capacity: '25 посадочних місць',
    image: '/images/restaurant/main_hall_floor1_christmas_oven.jpg',
    alt: 'Зал І поверху зі справжньою українською піччю на дровах',
    lead:
      'Справжня українська піч, викладена вручну з глини та обпаленої цегли.',
    body: [
      'Гордістю нашого закладу є справжня українська піч, викладена вручну з глини та обпаленої цегли. Вона розташована в центрі залу, і в холодну пору року ми розпалюємо в ній дрова.',
      "Живий вогонь, аромат духмяного дерева та м'яке тепло, що розходиться від печі, створюють неповторну домашню атмосферу спокою та тепла. Також у меню з листопада по березень присутні страви, які готуються в печі.",
    ],
  },
  {
    n: 'II',
    title: 'Відокремлений зал',
    floor: 'І поверх',
    capacity: '8 посадочних місць',
    image: '/images/restaurant/private_room_floral_curtains.jpg',
    alt: 'Затишний відокремлений зал на 8 посадочних місць',
    lead:
      'Затишна атмосфера, що ідеально підходить як для вечірніх побачень, так і для сімейних обідів.',
    body: [
      "Відокремлений формат робить цей зал улюбленим місцем для побачень, камерних вечер і невеликих сімейних зустрічей у тиші й теплі.",
    ],
  },
  {
    n: 'III',
    title: 'Зал «Жар-Птиці»',
    floor: 'І поверх',
    capacity: '20 посадочних місць',
    image: '/images/restaurant/peacock_aviary_zhar_ptytsi.jpg',
    alt: 'Зал «Жар-Птиці» з павлінарієм за скляною перегородкою',
    lead:
      'Серцем залу є наш просторий, елегантно оформлений павлінарій за скляною перегородкою.',
    body: [
      'Спостереження за цими граційними птахами під час трапези додає атмосфері відчуття екзотики та спокою.',
    ],
  },
  {
    n: 'IV',
    title: 'Зал з електричним каміном та балконом',
    floor: 'ІІ поверх',
    capacity: '25 посадочних місць',
    image: '/images/restaurant/hall_floor2_electric_fireplace_tv.jpg',
    alt: 'Зал ІІ поверху з електричним каміном та виходом на балкон',
    lead:
      'Ідеальне поєднання сучасного комфорту з класичною атмосферою відпочинку.',
    body: [
      "Центральним елементом інтер'єру є стильний електричний камін. Він миттєво додає простору відчуття тепла та затишку без зайвого диму чи запаху. Реалістична імітація живого вогню слугує чудовим фоном для неспішних розмов.",
      'Поєднання затишної камінної зони та можливості вийти на балкон робить його улюбленим місцем наших гостей у будь-яку пору року.',
    ],
  },
  {
    n: 'V',
    title: 'VIP-зал з більярдом',
    floor: "12-футовий більярдний стіл і м'який куточок",
    capacity: 'Для камерної компанії',
    image: '/images/restaurant/vip_billiards_full_view.jpg',
    alt: 'VIP-зал з 12-футовим більярдним столом',
    lead:
      'Більярд допомагає відпочити, мотивує на дружню або ділову бесіду, заспокоює та допомагає розвинути мислення і логіку.',
    body: [
      "У нашій VIP-кімнаті Ви можете насолодитися грою в будь-який час доби, а також посмакувати нефільтрованим пивом власного виробництва.",
    ],
  },
  {
    n: 'VI',
    title: 'Зал «Тераса»',
    floor: 'І поверх',
    capacity: '50 посадочних місць',
    image: '/images/restaurant/terrace_hall_green_ivy_wide.jpg',
    alt: 'Зал «Тераса» на 50 посадочних місць',
    lead:
      'Ідеальна локація для ювілеїв, корпоративних вечірок або великих сімейних святкувань.',
    body: [
      'Ми пропонуємо вам насолодитися вишуканою кухнею та першокласним сервісом в атмосфері легкості та свята.',
      'Просторе планування дозволяє легко трансформувати простір під будь-який формат заходу: від класичного банкетного розсадження до вільного лаунж-фуршету.',
    ],
  },
  {
    n: 'VII',
    title: 'Банкетна зала',
    floor: 'ІІ поверх',
    capacity: 'до 90 гостей',
    image: '/images/restaurant/terrace_hall_banquet_long_table.jpg',
    alt: 'Банкетна зала ІІ поверху до 90 гостей',
    lead:
      'Просторий та розкішний банкетний зал, ідеальний для проведення масштабних святкувань.',
    body: [
      'Зал комфортно вміщує до 90 гостей у форматі банкету, забезпечуючи достатньо місця для танців, розваг та вільного пересування.',
      'Продумане планування дозволяє розмістити гостьові столи різними способами (П-подібно, окремими круглими столами або «ялинкою»), залишивши при цьому місце для танцполу, сцени для музикантів або ведучого, а також окремої зони для фотосесій чи фуршету. Ми можемо адаптувати простір під будь-який формат вашого заходу.',
    ],
  },
];

const PHONE_1 = '+380508503555';
const PHONE_1_DISPLAY = '050 850 3 555';
const PHONE_2 = '+380532648548';
const PHONE_2_DISPLAY = '0532 648 548';

export function RestaurantHallsFromClient() {
  return (
    <section
      id="halls"
      className="bg-[#faf6ec] py-28 md:py-36"
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-20">
          <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e] mb-6">
            Наші зали · VII просторів
          </p>
          <h2 className="font-display text-5xl md:text-6xl text-[#0f1f18] leading-[0.95] mb-6">
            Сім кімнат —
            <span className="block italic text-[#1a3d2e]">семи настроїв</span>
          </h2>
          <p className="text-[#1a3d2e]/75 md:text-lg font-light leading-relaxed">
            Двоповерховий ресторан у старовинному казковому стилі з критою
            терасою і трьома літніми майданчиками на воді в оточенні фонтанів
            та лебедів. Для кожної події — свій простір.
          </p>
          <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium">
            <Phone className="w-3.5 h-3.5" strokeWidth={1.6} />
            <span>Забронювати столик:</span>
            <a href={`tel:${PHONE_1}`} className="text-[#1a3d2e] hover:text-[#0b1410] underline underline-offset-4">
              {PHONE_1_DISPLAY}
            </a>
            <span className="text-[#1a3d2e]/40">·</span>
            <a href={`tel:${PHONE_2}`} className="text-[#1a3d2e] hover:text-[#0b1410] underline underline-offset-4">
              {PHONE_2_DISPLAY}
            </a>
          </div>
        </div>

        {/* Halls — alternating magazine spreads */}
        <div className="space-y-24 md:space-y-32">
          {HALLS.map((hall, idx) => {
            const imageOnLeft = idx % 2 === 0;
            return (
              <article
                key={hall.n}
                className="grid items-center gap-10 md:grid-cols-2 md:gap-16"
              >
                {/* Image */}
                <div
                  className={`relative aspect-[4/5] overflow-hidden md:aspect-[5/6] ${
                    imageOnLeft ? 'md:order-1' : 'md:order-2'
                  }`}
                >
                  <Image
                    src={hall.image}
                    alt={hall.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.03]"
                  />
                  {/* Gold inner border */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-3 border border-[#c9a95c]/50"
                  />
                  {/* Roman numeral */}
                  <span
                    aria-hidden
                    className="absolute left-5 top-5 font-display italic text-lg text-[#e6d9b8]"
                  >
                    № {hall.n}
                  </span>
                </div>

                {/* Text */}
                <div className={imageOnLeft ? 'md:order-2' : 'md:order-1'}>
                  <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#1a3d2e]/70 mb-5 flex items-center gap-3">
                    <span className="h-px w-8 bg-[#1a3d2e]/40" />
                    <span>{hall.floor} · {hall.capacity}</span>
                  </p>
                  <h3 className="font-display text-4xl md:text-5xl text-[#0f1f18] leading-[0.98] mb-6">
                    {hall.title}
                  </h3>
                  <p className="font-display italic text-lg md:text-xl text-[#1a3d2e] mb-6 leading-snug">
                    {hall.lead}
                  </p>
                  <div className="space-y-4 text-[#1a3d2e]/75 md:text-lg font-light leading-relaxed">
                    {hall.body.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                  <div className="mt-8 inline-flex items-center gap-2 text-sm text-[#1a3d2e]/70">
                    <Users className="w-4 h-4" strokeWidth={1.4} />
                    <span>{hall.capacity}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Closing CTA strip */}
        <div className="mt-28 border-t border-[#1a3d2e]/15 pt-14 text-center">
          <p className="font-display text-3xl md:text-4xl text-[#0f1f18] leading-tight mb-6">
            <span className="italic">Оберіть свій</span> простір —
            <br />
            ми збережемо його для вас
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`tel:${PHONE_1}`}
              className="inline-flex items-center gap-3 bg-[#0f1f18] text-[#f4ecd8] px-10 py-4 font-medium tracking-wide hover:bg-[#1a3d2e] transition"
            >
              <Phone className="w-4 h-4" />
              {PHONE_1_DISPLAY}
            </a>
            <a
              href={`tel:${PHONE_2}`}
              className="inline-flex items-center gap-3 border border-[#0f1f18]/30 text-[#0f1f18] px-10 py-4 font-medium tracking-wide hover:bg-[#0f1f18] hover:text-[#f4ecd8] transition"
            >
              <Phone className="w-4 h-4" />
              {PHONE_2_DISPLAY}
            </a>
            <Link
              href="/menu"
              className="inline-flex items-center gap-3 bg-[#e6d9b8] text-[#0f1f18] px-10 py-4 font-medium tracking-wide hover:bg-[#f4ecd8] transition"
            >
              Переглянути меню
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
