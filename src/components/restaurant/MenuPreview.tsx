'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import menuData from '@/data/menu.json';
import { openMenuDialog } from './MenuDialog';

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

const totalCats = menu.categories.length;
const totalDishes = menu.categories.reduce((s, c) => s + c.items.length, 0);

// Pick a food-ish first category for the preview body (skip drinks at start)
const previewCategory =
  menu.categories.find((c) =>
    ['Холодні', 'Салати', 'Гарячі', 'Закуски', 'Основні', 'Страви'].some((p) =>
      c.name.startsWith(p),
    ),
  ) ?? menu.categories[0];

const previewDishes = previewCategory.items
  .filter((i) => i.image && i.image.startsWith('https://'))
  .slice(0, 4);

const navCategories = menu.categories.slice(0, 8);

/**
 * Non-interactive preview of the menu, shaped exactly like the real
 * EmbeddedMenu widget. Entire block is a button → opens MenuDialog.
 * Gradient fade at bottom signals "there's more". Hover darkens & scales.
 */
export function MenuPreview() {
  return (
    <button
      type="button"
      onClick={openMenuDialog}
      aria-label="Відкрити повне меню"
      className="group relative block w-full max-w-4xl mx-auto text-left cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-[4px] bg-[#fdfaf0] ring-1 ring-[#e6d9b8] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.65)] transition-all duration-700 group-hover:shadow-[0_50px_120px_-20px_rgba(0,0,0,0.8)] group-hover:ring-[#e6d9b8]/80 group-hover:-translate-y-1">
        {/* Header bar (matches EmbeddedMenu header) */}
        <div className="px-6 lg:px-8 py-5 border-b border-[#e6d9b8] bg-gradient-to-b from-[#fdfaf0] to-[#f4ecd8]/40 flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
              Меню ресторану
            </p>
            <h3 className="font-display text-2xl text-[#0f1f18] mt-0.5">
              «Глухомань»
            </h3>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-[#1a3d2e]/55">
              {totalCats} категорій · {totalDishes} страв
            </p>
          </div>
        </div>

        {/* Category pills nav */}
        <div className="border-b border-[#e6d9b8] bg-[#fdfaf0]">
          <div className="py-3 px-4 overflow-hidden">
            <div className="flex gap-2 min-w-max">
              {navCategories.map((cat, i) => {
                const isActive = i === 0;
                return (
                  <span
                    key={cat.id}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#0f1f18] text-[#fdfaf0] shadow-md scale-105'
                        : 'bg-[#1a3d2e]/5 text-[#1a3d2e]/75'
                    }`}
                  >
                    {cat.icon && <span className="text-sm">{cat.icon}</span>}
                    <span>{cat.name}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
                        isActive
                          ? 'bg-[#fdfaf0]/25 text-[#fdfaf0]'
                          : 'bg-[#1a3d2e]/12 text-[#1a3d2e]'
                      }`}
                    >
                      {cat.items.length}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Dish list — first category preview */}
        <div className="px-6 lg:px-8 pt-6 pb-12">
          <div className="flex items-baseline gap-2 mb-5">
            {previewCategory.icon && (
              <span className="text-xl">{previewCategory.icon}</span>
            )}
            <h4 className="font-display text-xl text-[#0f1f18]">
              {previewCategory.name}
            </h4>
            <span className="ml-auto text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/45">
              {previewCategory.items.length} страв
            </span>
          </div>

          <ul className="space-y-5">
            {previewDishes.map((d) => (
              <li key={d.id} className="flex gap-4 items-start">
                {d.image && (
                  <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-[#1a3d2e]/10">
                    <Image
                      src={d.image}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-[15px] font-medium text-[#0f1f18] truncate">
                      {d.name}
                    </span>
                    <span
                      aria-hidden
                      className="flex-1 border-b border-dotted border-[#1a3d2e]/25"
                    />
                    <span className="font-display text-lg text-[#1a3d2e]">
                      {d.price} ₴
                    </span>
                  </div>
                  {d.weight && (
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#1a3d2e]/50 mt-1">
                      {d.weight}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom fade: hints at more content */}
        <div
          aria-hidden
          className="absolute left-0 right-0 bottom-0 h-64 bg-gradient-to-t from-[#fdfaf0] via-[#fdfaf0]/90 to-transparent pointer-events-none"
        />

        {/* Hover darken on top of fade */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[#0b1410]/0 group-hover:bg-[#0b1410]/10 transition-colors duration-500 pointer-events-none"
        />

        {/* CTA pill at the bottom of the preview card */}
        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2 bottom-7 flex items-center gap-3 bg-[#0f1f18] text-[#f4ecd8] px-8 md:px-10 py-4 text-[12px] font-medium uppercase tracking-[0.24em] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)] ring-1 ring-[#e6d9b8]/30 rounded-sm transition-all duration-500 group-hover:px-12 group-hover:-translate-x-1/2 group-hover:-translate-y-1"
        >
          <span>Відкрити меню</span>
          <ArrowUpRight
            className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
            strokeWidth={2}
          />
        </div>
      </div>

      {/* Ambient cream glow behind card on hover */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 rounded-[4px] bg-[#e6d9b8]/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
      />
    </button>
  );
}
