'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

/* ══════════════════════════════════════════════════════════════════
   Types
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

interface ComplexProgram {
  id: string;
  title: string;
  duration: string;
  price: string;
  includes: string[];
  procedures: string[];
}

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

function ProgramCard({ p, featured, badgeLabel, typeLabel, includesLabel, proceduresLabel }: {
  p: ComplexProgram;
  featured?: boolean;
  badgeLabel: string;
  typeLabel: string;
  includesLabel: string;
  proceduresLabel: string;
}) {
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
          {badgeLabel}
        </span>
      )}
      <p
        className={`text-[10px] uppercase tracking-[0.3em] mb-3 ${
          featured ? 'text-[#e6d9b8]/70' : 'text-[#1a3d2e]/55'
        }`}
      >
        {typeLabel}
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
        {includesLabel}
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
        {proceduresLabel}
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

export function PriceList() {
  const t = useTranslations('sauna.price_list');
  const [activeTab, setActiveTab] = useState<string>('rent');

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const el = document.getElementById(`price-${id}`);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const TABS: { id: string; label: string }[] = [
    { id: 'rent', label: t('tabs.rent') },
    { id: 'chans', label: t('tabs.chans') },
    { id: 'massage', label: t('tabs.massage') },
    { id: 'scrubs', label: t('tabs.scrubs') },
    { id: 'wellness', label: t('tabs.wellness') },
    { id: 'baths', label: t('tabs.baths') },
    { id: 'extras', label: t('tabs.extras') },
    { id: 'programs', label: t('tabs.programs') },
  ];

  const GROUPS: PriceGroup[] = [
    {
      id: 'rent',
      roman: 'I',
      title: t('groups.rent.title'),
      subtitle: t('groups.rent.subtitle'),
      items: [
        { label: t('groups.rent.item_1_label'), note: t('groups.rent.item_1_note'), price: t('groups.rent.item_1_price'), accent: true },
        { label: t('groups.rent.item_2_label'), note: t('groups.rent.item_2_note'), price: t('groups.rent.item_2_price') },
        { label: t('groups.rent.item_3_label'), note: t('groups.rent.item_3_note'), price: t('groups.rent.item_3_price') },
      ],
    },
    {
      id: 'chans',
      roman: 'II',
      title: t('groups.chans.title'),
      subtitle: t('groups.chans.subtitle'),
      items: [
        { label: t('groups.chans.item_1_label'), note: t('groups.chans.item_1_note'), price: t('groups.chans.item_1_price') },
        { label: t('groups.chans.item_2_label'), note: t('groups.chans.item_2_note'), price: t('groups.chans.item_2_price') },
        { label: t('groups.chans.item_3_label'), note: t('groups.chans.item_3_note'), price: t('groups.chans.item_3_price') },
        { label: t('groups.chans.item_4_label'), note: t('groups.chans.item_4_note'), price: t('groups.chans.item_4_price') },
      ],
    },
    {
      id: 'massage',
      roman: 'III',
      title: t('groups.massage.title'),
      subtitle: t('groups.massage.subtitle'),
      items: [
        { label: t('groups.massage.item_1_label'), note: t('groups.massage.item_1_note'), price: t('groups.massage.item_1_price'), accent: true },
        { label: t('groups.massage.item_2_label'), note: t('groups.massage.item_2_note'), price: t('groups.massage.item_2_price') },
        { label: t('groups.massage.item_3_label'), note: t('groups.massage.item_3_note'), price: t('groups.massage.item_3_price') },
        { label: t('groups.massage.item_4_label'), note: t('groups.massage.item_4_note'), price: t('groups.massage.item_4_price') },
        { label: t('groups.massage.item_5_label'), note: t('groups.massage.item_5_note'), price: t('groups.massage.item_5_price') },
        { label: t('groups.massage.item_6_label'), note: t('groups.massage.item_6_note'), price: t('groups.massage.item_6_price') },
        { label: t('groups.massage.item_7_label'), price: t('groups.massage.item_7_price') },
        { label: t('groups.massage.item_8_label'), price: t('groups.massage.item_8_price') },
        { label: t('groups.massage.item_9_label'), price: t('groups.massage.item_9_price') },
        { label: t('groups.massage.item_10_label'), note: t('groups.massage.item_10_note'), price: t('groups.massage.item_10_price') },
        { label: t('groups.massage.item_11_label'), price: t('groups.massage.item_11_price') },
        { label: t('groups.massage.item_12_label'), note: t('groups.massage.item_12_note'), price: t('groups.massage.item_12_price') },
        { label: t('groups.massage.item_13_label'), price: t('groups.massage.item_13_price') },
        { label: t('groups.massage.item_14_label'), price: t('groups.massage.item_14_price') },
        { label: t('groups.massage.item_15_label'), price: t('groups.massage.item_15_price') },
        { label: t('groups.massage.item_16_label'), price: t('groups.massage.item_16_price') },
      ],
    },
    {
      id: 'scrubs',
      roman: 'IV',
      title: t('groups.scrubs.title'),
      items: [
        { label: t('groups.scrubs.item_1_label'), price: t('groups.scrubs.item_1_price') },
        { label: t('groups.scrubs.item_2_label'), price: t('groups.scrubs.item_2_price') },
        { label: t('groups.scrubs.item_3_label'), price: t('groups.scrubs.item_3_price') },
        { label: t('groups.scrubs.item_4_label'), price: t('groups.scrubs.item_4_price') },
        { label: t('groups.scrubs.item_5_label'), price: t('groups.scrubs.item_5_price') },
        { label: t('groups.scrubs.item_6_label'), price: t('groups.scrubs.item_6_price') },
        { label: t('groups.scrubs.item_7_label'), price: t('groups.scrubs.item_7_price') },
        { label: t('groups.scrubs.item_8_label'), note: t('groups.scrubs.item_8_note'), price: t('groups.scrubs.item_8_price') },
      ],
    },
    {
      id: 'wellness',
      roman: 'V',
      title: t('groups.wellness.title'),
      items: [
        { label: t('groups.wellness.item_1_label'), note: t('groups.wellness.item_1_note'), price: t('groups.wellness.item_1_price') },
        { label: t('groups.wellness.item_2_label'), price: t('groups.wellness.item_2_price') },
        { label: t('groups.wellness.item_3_label'), price: t('groups.wellness.item_3_price') },
        { label: t('groups.wellness.item_4_label'), price: t('groups.wellness.item_4_price') },
        { label: t('groups.wellness.item_5_label'), price: t('groups.wellness.item_5_price') },
        { label: t('groups.wellness.item_6_label'), note: t('groups.wellness.item_6_note'), price: t('groups.wellness.item_6_price') },
      ],
    },
    {
      id: 'baths',
      roman: 'VI',
      title: t('groups.baths.title'),
      items: [
        { label: t('groups.baths.item_1_label'), price: t('groups.baths.item_1_price') },
        { label: t('groups.baths.item_2_label'), price: t('groups.baths.item_2_price') },
        { label: t('groups.baths.item_3_label'), price: t('groups.baths.item_3_price') },
        { label: t('groups.baths.item_4_label'), price: t('groups.baths.item_4_price') },
        { label: t('groups.baths.item_5_label'), price: t('groups.baths.item_5_price') },
        { label: t('groups.baths.item_6_label'), price: t('groups.baths.item_6_price') },
        { label: t('groups.baths.item_7_label'), price: t('groups.baths.item_7_price') },
        { label: t('groups.baths.item_8_label'), price: t('groups.baths.item_8_price') },
      ],
    },
    {
      id: 'extras',
      roman: 'VII',
      title: t('groups.extras.title'),
      items: [
        { label: t('groups.extras.item_1_label'), price: t('groups.extras.item_1_price') },
        { label: t('groups.extras.item_2_label'), price: t('groups.extras.item_2_price') },
        { label: t('groups.extras.item_3_label'), price: t('groups.extras.item_3_price') },
        { label: t('groups.extras.item_4_label'), price: t('groups.extras.item_4_price') },
        { label: t('groups.extras.item_5_label'), note: t('groups.extras.item_5_note'), price: t('groups.extras.item_5_price') },
        { label: t('groups.extras.item_6_label'), price: t('groups.extras.item_6_price') },
      ],
    },
  ];

  const PROGRAMS: ComplexProgram[] = [
    {
      id: 'health',
      title: t('programs.health.title'),
      duration: t('programs.health.duration'),
      price: t('programs.health.price'),
      includes: [
        t('programs.health.include_1'),
        t('programs.health.include_2'),
        t('programs.health.include_3'),
        t('programs.health.include_4'),
      ],
      procedures: [
        t('programs.health.proc_1'),
        t('programs.health.proc_2'),
        t('programs.health.proc_3'),
        t('programs.health.proc_4'),
        t('programs.health.proc_5'),
        t('programs.health.proc_6'),
        t('programs.health.proc_7'),
      ],
    },
    {
      id: 'slavic',
      title: t('programs.slavic.title'),
      duration: t('programs.slavic.duration'),
      price: t('programs.slavic.price'),
      includes: [
        t('programs.slavic.include_1'),
        t('programs.slavic.include_2'),
        t('programs.slavic.include_3'),
        t('programs.slavic.include_4'),
      ],
      procedures: [
        t('programs.slavic.proc_1'),
        t('programs.slavic.proc_2'),
        t('programs.slavic.proc_3'),
        t('programs.slavic.proc_4'),
        t('programs.slavic.proc_5'),
        t('programs.slavic.proc_6'),
        t('programs.slavic.proc_7'),
        t('programs.slavic.proc_8'),
        t('programs.slavic.proc_9'),
      ],
    },
  ];

  return (
    <>
      {/* Sticky quick-nav */}
      <div className="sticky top-16 z-20 -mx-6 sm:mx-0 mb-8 overflow-x-auto bg-[#faf6ec]/95 backdrop-blur-sm border-y border-[#1a3d2e]/10 py-3">
        <div className="flex items-center gap-1.5 sm:gap-2 px-6 sm:px-0 sm:justify-center whitespace-nowrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => scrollToSection(tab.id)}
              className={`text-[11px] sm:text-[12px] uppercase tracking-[0.18em] px-3 sm:px-4 py-2 rounded-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-[#1a3d2e] text-[#f4ecd8]'
                  : 'text-[#0f1f18]/70 hover:bg-[#1a3d2e]/8 hover:text-[#0f1f18]'
              }`}
            >
              {tab.label}
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
              {t('programs.section_roman')}
            </p>
            <h3 className="font-display italic text-3xl md:text-4xl text-[#0f1f18] leading-tight">
              {t('programs.section_title')}
              <span className="block text-[#1a3d2e]/65 text-2xl md:text-3xl mt-1.5">
                {t('programs.section_title_italic')}
              </span>
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-5 md:gap-6 max-w-4xl mx-auto">
            <ProgramCard
              p={PROGRAMS[0]}
              badgeLabel={t('programs.badge_popular')}
              typeLabel={t('programs.type_label')}
              includesLabel={t('programs.includes_label')}
              proceduresLabel={t('programs.procedures_label')}
            />
            <ProgramCard
              p={PROGRAMS[1]}
              featured
              badgeLabel={t('programs.badge_popular')}
              typeLabel={t('programs.type_label')}
              includesLabel={t('programs.includes_label')}
              proceduresLabel={t('programs.procedures_label')}
            />
          </div>
        </div>
      </div>
    </>
  );
}
