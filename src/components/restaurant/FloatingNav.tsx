'use client';

import { useEffect, useState } from 'react';

interface Entry {
  id: string;
  roman: string;
  label: string;
}

const defaultEntries: Entry[] = [
  { id: 'intro', roman: '0', label: 'Про ресторан' },
  { id: 'cuisine', roman: '§', label: 'Кухня та пиво' },
  { id: 'music', roman: '♪', label: 'Жива музика' },
  { id: 'hall-i', roman: 'I', label: 'Піч' },
  { id: 'hall-ii', roman: 'II', label: 'Відокремлений' },
  { id: 'hall-iii', roman: 'III', label: 'Жар-Птиці' },
  { id: 'hall-iv', roman: 'IV', label: 'Камін + балкон' },
  { id: 'hall-v', roman: 'V', label: 'VIP' },
  { id: 'hall-vi', roman: 'VI', label: 'Тераса' },
  { id: 'hall-vii', roman: 'VII', label: 'Банкет' },
  { id: 'hall-viii', roman: 'VIII', label: 'Свята' },
  { id: 'hall-ix', roman: 'IX', label: 'Діти' },
  { id: 'hall-x', roman: 'X', label: 'Аніматори' },
  { id: 'menu', roman: '∎', label: 'Меню' },
];

/**
 * Floating section index (xl+). Uses mix-blend-mode:difference so the nav
 * automatically inverts against whatever section is behind it — readable
 * on both cream and dark-green backgrounds without theme tracking.
 */
export function FloatingNav({
  entries = defaultEntries,
}: {
  entries?: Entry[];
} = {}) {
  const [activeId, setActiveId] = useState<string>(entries[0]?.id ?? 'intro');

  useEffect(() => {
    const targets = entries
      .map((e) => document.getElementById(e.id))
      .filter((el): el is HTMLElement => !!el);

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (records) => {
        const visible = records
          .filter((r) => r.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top,
          );
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-45% 0px -45% 0px',
        threshold: 0,
      },
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [entries]);

  const jumpTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 24;
    window.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <nav
      aria-label="Зміст"
      className="fixed right-5 top-1/2 -translate-y-1/2 z-30 hidden xl:flex flex-col gap-0 text-white"
      style={{ mixBlendMode: 'difference', isolation: 'isolate' }}
    >
      {entries.map((e) => {
        const active = activeId === e.id;
        return (
          <button
            key={e.id}
            type="button"
            onClick={() => jumpTo(e.id)}
            aria-current={active}
            aria-label={e.label}
            className="group relative flex items-center justify-end py-1.5 pr-1 cursor-pointer"
          >
            <span
              className={`font-display italic transition-all duration-500 ease-out ${
                active
                  ? 'text-base opacity-100'
                  : 'text-xs opacity-45 group-hover:opacity-90'
              }`}
            >
              {e.roman}
            </span>
            <span
              aria-hidden
              className={`pointer-events-none absolute right-full mr-3 whitespace-nowrap text-[10px] uppercase tracking-[0.32em] transition-all duration-500 ease-out ${
                active
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0'
              }`}
            >
              {e.label}
            </span>
            <span
              aria-hidden
              className={`ml-2 h-px bg-current transition-all duration-500 ease-out ${
                active ? 'w-6 opacity-80' : 'w-2 opacity-35'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
