'use client';

import { useState } from 'react';

/* ══════════════════════════════════════════════════════════════════
   Data — дослівно спарсено з прайс-карток /images/sauna/doc/9–13.jpg
   ══════════════════════════════════════════════════════════════════ */

interface PriceItem {
  label: string;
  note?: string;
  price: string;
  accent?: boolean;
}

interface PriceGroup {
  id: string;
  roman: string;
  title: string;
  subtitle?: string;
  items: PriceItem[];
}

const GROUPS: PriceGroup[] = [
  {
    id: 'rent',
    roman: 'I',
    title: 'Оренда лазні',
    subtitle: 'Мінімальне замовлення — 2 години, до 7-ми осіб',
    items: [
      { label: 'Оренда лазні', note: 'до 7-ми осіб, мін. 2 год', price: '1000 грн/год', accent: true },
      { label: 'З 8-ої людини', note: 'за кожну додаткову', price: '200 грн/год' },
      { label: 'Бронювання альтанки', note: 'літній період', price: '700 грн/год' },
    ],
  },
  {
    id: 'chans',
    roman: 'II',
    title: 'Карпатські чани',
    subtitle: 'Мінімальне замовлення — 2 години',
    items: [
      { label: 'Карпатський чан', note: 'при замовленні лазні', price: '700 грн/год' },
      { label: 'Хвойно-цитрусовий чан', note: 'при замовленні лазні', price: '1100 грн/год' },
      { label: 'Карпатський чан', note: 'без замовлення лазні', price: '1200 грн/год' },
      { label: 'Хвойно-цитрусовий чан', note: 'без замовлення лазні', price: '1500 грн/год' },
    ],
  },
  {
    id: 'massage',
    roman: 'III',
    title: 'Масажі',
    subtitle: 'Послуги сертифікованого майстра — за попереднім записом',
    items: [
      { label: 'Стоун масаж', note: '50 / 80 хв', price: '900 / 1200 грн', accent: true },
      { label: 'Тайський + «Пахоп»', note: '45 хв', price: '700 грн' },
      { label: 'Традиційний тайський', note: '40 хв', price: '550 грн' },
      { label: 'Тайський релакс арома-ойл', note: '40 хв', price: '550 грн' },
      { label: 'Тайський фут-масаж (стоп)', note: '35 хв', price: '450 грн' },
      { label: 'Класичний масаж', note: '20 / 30 / 50 хв', price: '350 / 450 / 550 грн' },
      { label: 'Масаж «Глухомань»', price: '400 грн' },
      { label: 'Масаж «Сибір»', price: '400 грн' },
      { label: 'Масаж «Медовий»', price: '400 грн' },
      { label: 'Масаж бамбуковими віниками', note: '20 хв', price: '400 грн' },
      { label: 'Кріомасаж з віниками', price: '400 грн' },
      { label: 'Прогрів ніг віниками', note: 'до поперекового відділу', price: '200 грн' },
      { label: 'Масаж віниками', price: '400 грн' },
      { label: 'Гарячий мильно-березовий обмив', price: '250 грн' },
      { label: 'Релакс-процедура «Банні втіхи»', price: '300 грн' },
      { label: 'Прогрівання льняним простирадлом', price: '170 грн' },
    ],
  },
  {
    id: 'scrubs',
    roman: 'IV',
    title: 'Скраби',
    items: [
      { label: 'Сіль-глина', price: '300 грн' },
      { label: 'Сода-лимон', price: '300 грн' },
      { label: 'Сіль-арома', price: '300 грн' },
      { label: '«Кавово-медовий»', price: '400 грн' },
      { label: '«Кавово-сольовий»', price: '400 грн' },
      { label: '«Шоколад»', price: '400 грн' },
      { label: '«Сіль, гірчиця, мед, пиво»', price: '400 грн' },
      { label: 'Фруктова аплікація', note: 'яблуко, апельсин, банан, морква', price: '400 грн' },
    ],
  },
  {
    id: 'wellness',
    roman: 'V',
    title: 'Оздоровчі процедури',
    items: [
      { label: 'Аромотерапія', note: "м'ята, липа, карамель", price: '150 грн' },
      { label: '«Хвойний» віксовий напар', price: '130 грн' },
      { label: 'Сольове обгортання', price: '130 грн' },
      { label: 'Холодні мінеральні обливання', price: '170 грн' },
      { label: 'Снігові обгортання', price: '300 грн' },
      { label: 'Натирання березовим крошином', note: 'на льняному полотні', price: '250 грн' },
    ],
  },
  {
    id: 'baths',
    roman: 'VI',
    title: 'Сольові ванночки',
    items: [
      { label: 'Хвойна', price: '75 грн' },
      { label: "Трав'яний збір", price: '75 грн' },
      { label: 'Рапова', price: '75 грн' },
      { label: '«Морський бриз»', price: '75 грн' },
      { label: '«Мінеральна»', price: '150 грн' },
      { label: "Кропив'яна", price: '75 грн' },
      { label: 'Тонізуюча', price: '75 грн' },
      { label: '«Джентельмен»', price: '75 грн' },
    ],
  },
  {
    id: 'extras',
    roman: 'VII',
    title: 'Банне приладдя',
    items: [
      { label: 'Віник дубовий / березовий', price: '200 грн' },
      { label: 'Віник при замовленні процедур', price: '170 грн' },
      { label: 'Простирадло', price: '45 грн' },
      { label: 'Рушник', price: '45 грн' },
      { label: 'Банні напої', note: "трав'яний збір, бублики, мед", price: '350 грн' },
      { label: 'Капці одноразові', price: '40 грн' },
    ],
  },
];

interface ComplexProgram {
  id: string;
  title: string;
  duration: string;
  price: string;
  includes: string[];
  procedures: string[];
}

const PROGRAMS: ComplexProgram[] = [
  {
    id: 'health',
    title: "Здоров'я",
    duration: '3 години без вартості часу',
    price: '2400 грн / особа',
    includes: ['Простирадла та рушники', 'Одноразові капці', 'Віники (дуб, береза)', "Трав'яний чай"],
    procedures: [
      'Аромотерапія',
      'Прогрів ніг віником',
      'Сольові ванночки',
      'Сольовий скраб',
      'Масаж віниками',
      'Медовий масаж',
      'Мильно-березовий масаж',
    ],
  },
  {
    id: 'slavic',
    title: "Слов'янський еліксир",
    duration: '3 години без вартості часу',
    price: '2800 грн / особа',
    includes: ['Простирадла та рушники', 'Одноразові капці', 'Віники (дуб/береза)', "Трав'яний чай"],
    procedures: [
      'Аромотерапія',
      'Сольове обгортання',
      'Прогрів ніг віником',
      'Сольові ванночки',
      'Масаж віниками з душем Шарко',
      'Кріомасаж з віниками',
      'Релакс-процедура «Банні втіхи»',
      'Гарячий мильно-березовий обмив',
      'Соляний скраб',
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════
   Atoms
   ══════════════════════════════════════════════════════════════════ */

function PriceRow({ item }: { item: PriceItem }) {
  return (
    <li className="group/row flex items-baseline gap-3 py-3 border-b border-[#1a3d2e]/10 last:border-b-0">
      <span
        className={`flex-1 text-[15px] md:text-[16px] leading-snug text-[#0f1f18]/90 ${
          item.accent ? 'font-semibold text-[#0f1f18]' : ''
        }`}
      >
        {item.label}
        {item.note && (
          <span className="block sm:inline sm:ml-2 text-[12px] italic text-[#0f1f18]/55">
            {item.note}
          </span>
        )}
      </span>
      <span
        aria-hidden
        className="flex-1 border-b border-dotted border-[#1a3d2e]/20 translate-y-[-2px] hidden sm:block"
      />
      <span
        className={`shrink-0 tracking-tight whitespace-nowrap text-[15px] md:text-[16px] text-[#1a3d2e] ${
          item.accent ? 'font-semibold' : 'font-medium'
        }`}
      >
        {item.price}
      </span>
    </li>
  );
}

function SectionCard({ group }: { group: PriceGroup }) {
  return (
    <div
      id={`price-${group.id}`}
      className="rounded-sm bg-white/70 ring-1 ring-[#1a3d2e]/10 shadow-[0_10px_30px_-15px_rgba(26,61,46,0.18)] px-5 sm:px-7 py-6 sm:py-8 scroll-mt-24"
    >
      <div className="flex items-baseline gap-4 mb-4 sm:mb-5 pb-4 border-b-2 border-[#1a3d2e]/15">
        <span className="font-display italic text-2xl sm:text-3xl leading-none text-[#1a3d2e]/35">
          {group.roman}
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-[20px] sm:text-[24px] text-[#0f1f18] leading-tight">
            {group.title}
          </h3>
          {group.subtitle && (
            <p className="text-[11px] sm:text-[12px] uppercase tracking-[0.2em] text-[#1a3d2e]/55 mt-1.5">
              {group.subtitle}
            </p>
          )}
        </div>
      </div>
      <ul className="divide-transparent">
        {group.items.map((it, i) => (
          <PriceRow key={`${group.id}-${i}`} item={it} />
        ))}
      </ul>
    </div>
  );
}

function ProgramCard({ p, featured }: { p: ComplexProgram; featured?: boolean }) {
  return (
    <div
      className={`relative rounded-sm px-6 py-7 ring-1 transition-shadow duration-300 hover:shadow-[0_25px_50px_-20px_rgba(26,61,46,0.4)] ${
        featured
          ? 'bg-[#0f1f18] text-[#f4ecd8] ring-[#e6d9b8]/30 shadow-[0_20px_45px_-18px_rgba(0,0,0,0.45)]'
          : 'bg-white/90 text-[#0f1f18] ring-[#1a3d2e]/15 shadow-[0_15px_35px_-18px_rgba(26,61,46,0.2)]'
      }`}
    >
      {featured && (
        <span className="absolute -top-2.5 left-6 text-[9px] uppercase tracking-[0.28em] bg-[#e6d9b8] text-[#0f1f18] px-2.5 py-1 rounded-sm">
          Найпопулярніше
        </span>
      )}
      <p
        className={`text-[10px] uppercase tracking-[0.3em] mb-3 ${
          featured ? 'text-[#e6d9b8]/70' : 'text-[#1a3d2e]/55'
        }`}
      >
        Комплексна програма
      </p>
      <h3
        className={`font-display italic text-2xl md:text-[28px] leading-tight mb-1.5 ${
          featured ? 'text-[#e6d9b8]' : 'text-[#0f1f18]'
        }`}
      >
        «{p.title}»
      </h3>
      <p
        className={`text-[12px] italic mb-5 ${
          featured ? 'text-[#f4ecd8]/65' : 'text-[#0f1f18]/55'
        }`}
      >
        {p.duration}
      </p>

      <div
        className={`font-display text-3xl md:text-[38px] tracking-tight mb-6 pb-5 border-b ${
          featured
            ? 'text-[#e6d9b8] border-[#e6d9b8]/20'
            : 'text-[#1a3d2e] border-[#1a3d2e]/15'
        }`}
      >
        {p.price}
      </div>

      <p
        className={`text-[10px] uppercase tracking-[0.24em] mb-2 ${
          featured ? 'text-[#e6d9b8]/70' : 'text-[#1a3d2e]/60'
        }`}
      >
        Входить до програми
      </p>
      <ul className={`mb-5 text-[13px] space-y-1 ${featured ? 'text-[#f4ecd8]/90' : 'text-[#0f1f18]/85'}`}>
        {p.includes.map((x) => (
          <li key={x} className="flex gap-2">
            <span className={featured ? 'text-[#e6d9b8]/50' : 'text-[#1a3d2e]/45'}>·</span>
            {x}
          </li>
        ))}
      </ul>

      <p
        className={`text-[10px] uppercase tracking-[0.24em] mb-2 ${
          featured ? 'text-[#e6d9b8]/70' : 'text-[#1a3d2e]/60'
        }`}
      >
        Оздоровчі процедури
      </p>
      <ul className={`text-[13px] space-y-1 ${featured ? 'text-[#f4ecd8]/90' : 'text-[#0f1f18]/85'}`}>
        {p.procedures.map((x) => (
          <li key={x} className="flex gap-2">
            <span className={featured ? 'text-[#e6d9b8]/50' : 'text-[#1a3d2e]/45'}>·</span>
            {x}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Main component
   ══════════════════════════════════════════════════════════════════ */

const TABS: { id: string; label: string }[] = [
  { id: 'rent', label: 'Оренда' },
  { id: 'chans', label: 'Чани' },
  { id: 'massage', label: 'Масажі' },
  { id: 'scrubs', label: 'Скраби' },
  { id: 'wellness', label: 'Оздоровчі' },
  { id: 'baths', label: 'Ванночки' },
  { id: 'extras', label: 'Приладдя' },
  { id: 'programs', label: 'Програми' },
];

export function PriceList() {
  const [activeTab, setActiveTab] = useState<string>('rent');

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const el = document.getElementById(`price-${id}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Sticky quick-nav */}
      <div className="sticky top-16 z-20 -mx-6 sm:mx-0 mb-8 overflow-x-auto bg-[#faf6ec]/95 backdrop-blur-sm border-y border-[#1a3d2e]/10 py-3">
        <div className="flex items-center gap-1.5 sm:gap-2 px-6 sm:px-0 sm:justify-center whitespace-nowrap">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => scrollToSection(t.id)}
              className={`text-[11px] sm:text-[12px] uppercase tracking-[0.18em] px-3 sm:px-4 py-2 rounded-sm transition-all ${
                activeTab === t.id
                  ? 'bg-[#1a3d2e] text-[#f4ecd8]'
                  : 'text-[#0f1f18]/70 hover:bg-[#1a3d2e]/8 hover:text-[#0f1f18]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main price sections */}
      <div className="space-y-6 md:space-y-8">
        {GROUPS.map((g) => (
          <SectionCard key={g.id} group={g} />
        ))}

        {/* Complex wellness programs */}
        <div id="price-programs" className="pt-6 scroll-mt-24">
          <div className="text-center mb-8">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#1a3d2e]/55 mb-3">
              VIII · Комплексні оздоровчі програми
            </p>
            <h3 className="font-display italic text-3xl md:text-4xl text-[#0f1f18] leading-tight">
              Авторські програми
              <span className="block text-[#1a3d2e]/65 text-2xl md:text-3xl mt-1.5">
                на 3 години.
              </span>
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto">
            <ProgramCard p={PROGRAMS[0]} />
            <ProgramCard p={PROGRAMS[1]} featured />
          </div>
        </div>
      </div>
    </>
  );
}
