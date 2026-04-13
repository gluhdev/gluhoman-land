'use client';

/**
 * EmbeddedMenu — compact one-screen menu widget for embedding inside other
 * pages (e.g. /restaurant). Loads the same menu.json the /menu page uses.
 *
 * UX:
 *  • Fixed height (one viewport-ish), internal scroll
 *  • Horizontal category pill nav sticky inside the box
 *  • When the inner scroll hits top/bottom, the wheel bubbles up so the user
 *    can easily continue scrolling the parent page
 *  • Click a category → smooth scroll WITHIN the box (not the page)
 *  • Active category tracked via inner-scroll IntersectionObserver
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import menuData from '@/data/menu.json';

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  weight?: string;
  image?: string;
}
interface MenuCategory {
  id: string;
  name: string;
  icon?: string;
  items: MenuItem[];
}
interface Menu {
  categories: MenuCategory[];
}

const menu = menuData as unknown as Menu;

export function EmbeddedMenu() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const navScrollerRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(menu.categories[0]?.id ?? '');

  // Total dish count (for header)
  const totals = useMemo(() => {
    const cats = menu.categories.length;
    const dishes = menu.categories.reduce((s, c) => s + c.items.length, 0);
    return { cats, dishes };
  }, []);

  // IntersectionObserver scoped to the inner scroll container
  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        root,
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      }
    );

    menu.categories.forEach((cat) => {
      const el = root.querySelector(`#emb-${cat.id}`);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Auto-center the active pill in the horizontal nav
  useEffect(() => {
    const nav = navScrollerRef.current;
    if (!nav) return;
    const btn = nav.querySelector(`[data-cat="${activeId}"]`) as HTMLElement | null;
    if (btn) {
      const left = btn.offsetLeft - nav.clientWidth / 2 + btn.clientWidth / 2;
      nav.scrollTo({ left, behavior: 'smooth' });
    }
  }, [activeId]);

  const handleClick = (id: string) => {
    const root = scrollerRef.current;
    if (!root) return;
    const el = root.querySelector(`#emb-${id}`) as HTMLElement | null;
    if (!el) return;
    // Scroll WITHIN the inner container, not the page
    const top = el.offsetTop - 64; // account for sticky nav
    root.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#fdfaf0] border border-[#e6d9b8] shadow-2xl shadow-[#0f1f18]/40 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 lg:px-8 py-5 border-b border-[#e6d9b8] bg-gradient-to-b from-[#fdfaf0] to-[#f4ecd8]/40 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
            Меню ресторану
          </p>
          <h3 className="font-display text-2xl text-[#0f1f18] mt-0.5">«Глухомань»</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-[#1a3d2e]/55">
              {totals.cats} категорій · {totals.dishes} страв
            </p>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a3d2e] hover:text-[#0f1f18] underline underline-offset-4"
          >
            Повна сторінка
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Category pill nav (sticky inside the box) */}
      <div className="border-b border-[#e6d9b8] bg-[#fdfaf0]">
        <div
          ref={navScrollerRef}
          data-lenis-prevent
          data-lenis-prevent-wheel
          data-lenis-prevent-touch
          className="overflow-x-auto scrollbar-hide py-3 px-4"
        >
          <div className="flex gap-2 min-w-max">
            {menu.categories.map((cat) => {
              const isActive = activeId === cat.id;
              return (
                <button
                  key={cat.id}
                  data-cat={cat.id}
                  onClick={() => handleClick(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#0f1f18] text-[#fdfaf0] shadow-md scale-105'
                      : 'bg-[#1a3d2e]/5 text-[#1a3d2e]/75 hover:bg-[#1a3d2e]/12'
                  }`}
                >
                  {cat.icon && <span className="text-sm">{cat.icon}</span>}
                  <span>{cat.name}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                      isActive ? 'bg-[#fdfaf0]/25 text-[#fdfaf0]' : 'bg-[#1a3d2e]/12 text-[#1a3d2e]'
                    }`}
                  >
                    {cat.items.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scrollable dish area — fixed height, internal scroll.
          data-lenis-prevent: opts this container OUT of Lenis smooth scroll
          so the wheel/touch events drive native scroll inside the box.
          When the inner scroll hits top/bottom, the wheel naturally bubbles
          up to the page (default browser behavior) so users can easily leave
          the block. */}
      <div
        ref={scrollerRef}
        data-lenis-prevent
        data-lenis-prevent-wheel
        data-lenis-prevent-touch
        tabIndex={0}
        role="region"
        aria-label="Меню страв"
        className="overflow-y-auto bg-[#f4ecd8]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a3d2e]/40"
        style={{ maxHeight: '70vh', minHeight: '480px', overscrollBehavior: 'auto' }}
      >
        {menu.categories.map((cat) => {
          const withImages = cat.items.filter((i) => i.image);
          const withoutImages = cat.items.filter((i) => !i.image);
          return (
            <section key={cat.id} id={`emb-${cat.id}`} className="px-6 lg:px-8 py-8">
              <div className="mb-5">
                <h4 className="font-display text-2xl text-[#0f1f18] flex items-center gap-2.5">
                  {cat.icon && <span className="text-2xl">{cat.icon}</span>}
                  <span>{cat.name}</span>
                </h4>
                <div className="mt-2 h-px w-12 bg-[#1a3d2e]/40" />
              </div>

              {/* Image cards (if any) */}
              {withImages.length > 0 && (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {withImages.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-[#e6d9b8] rounded-xl overflow-hidden flex flex-col"
                    >
                      <div className="relative aspect-[4/3] bg-[#f4ecd8]">
                        <Image
                          src={item.image!}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 50vw, 33vw"
                        />
                        <div className="absolute top-2 right-2 inline-flex items-baseline gap-0.5 bg-white/95 backdrop-blur-sm text-[#1a3d2e] font-bold px-2.5 py-1 rounded-full shadow text-xs">
                          <span>{item.price}</span>
                          <span className="text-[9px]">₴</span>
                        </div>
                      </div>
                      <div className="p-3">
                        <h5 className="font-display text-sm font-semibold text-[#0f1f18] leading-snug line-clamp-2">
                          {item.name}
                        </h5>
                        {item.weight && (
                          <p className="text-[10px] text-[#1a3d2e]/55 uppercase tracking-wider mt-0.5">
                            {item.weight}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Text-only list */}
              {withoutImages.length > 0 && (
                <div className="bg-white/60 border border-[#e6d9b8] rounded-xl overflow-hidden">
                  {withoutImages.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-baseline gap-3 px-4 py-3 border-b border-dashed border-[#1a3d2e]/15 last:border-b-0 hover:bg-[#1a3d2e]/4 transition-colors"
                    >
                      <div className="flex-shrink min-w-0">
                        <h5 className="font-display text-base font-semibold text-[#0f1f18] leading-snug">
                          {item.name}
                        </h5>
                        {item.description && (
                          <p className="text-[11px] text-[#1a3d2e]/65 mt-0.5 line-clamp-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                      <div className="flex-1 border-b border-dotted border-[#1a3d2e]/25 mb-1.5 min-w-[20px]" />
                      {item.weight && (
                        <span className="text-[10px] text-[#1a3d2e]/55 font-medium whitespace-nowrap uppercase tracking-wider">
                          {item.weight}
                        </span>
                      )}
                      <span className="text-sm font-bold text-[#1a3d2e] whitespace-nowrap tabular-nums">
                        {item.price} <span className="text-[10px]">₴</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Footer link to full menu */}
      <div className="px-6 py-4 border-t border-[#e6d9b8] bg-[#f4ecd8]/40 text-center">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f1f18] hover:text-[#1a3d2e] transition-colors"
        >
          Відкрити повне меню в окремій вкладці
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
