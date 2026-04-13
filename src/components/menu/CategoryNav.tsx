'use client';

import { useEffect, useState, useRef, useCallback, CSSProperties } from 'react';
import { MenuCategory } from '@/types/menu';

interface CategoryNavProps {
  categories: MenuCategory[];
  /** Top offset (px) for the desktop pinned sidebar — clears the fixed site header. */
  desktopTopOffset?: number;
  /** Top offset (px) for the mobile pinned nav. */
  mobileTopOffset?: number;
}

/**
 * Desktop: a sidebar that lives inside its column (right column of a flex layout).
 *   The wrapper <div> is a real layout slot. The inner panel is JS-positioned across
 *   three modes (absolute-top → fixed → absolute-bottom) to polyfill `position: sticky`,
 *   which is broken in this project by parents with overflow:clip and Lenis scroll.
 *   The fixed mode reads the wrapper's getBoundingClientRect every scroll/resize so the
 *   panel always stays inside the right column boundary and never overlaps content.
 *
 * Mobile: horizontal nav pinned to top after user scrolls past hero. Same as before.
 */
export function CategoryNav({
  categories,
  desktopTopOffset = 112,
  mobileTopOffset = 96,
}: CategoryNavProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? '');
  const [mobilePinned, setMobilePinned] = useState(false);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
  });

  const mobileSentinelRef = useRef<HTMLDivElement>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  /* ─────────────── Active section observer ─────────────── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-180px 0px -60% 0px', threshold: 0 }
    );

    categories.forEach((cat) => {
      const el = document.getElementById(cat.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories]);

  /* ─────────────── Mobile pinning ─────────────── */
  useEffect(() => {
    const sentinel = mobileSentinelRef.current;
    if (!sentinel) return;

    const onScroll = () => {
      const rect = sentinel.getBoundingClientRect();
      setMobilePinned(rect.top <= mobileTopOffset);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [mobileTopOffset]);

  /* ─────────────── Desktop sticky polyfill ─────────────── */
  const updateDesktopPosition = useCallback(() => {
    const wrapper = wrapperRef.current;
    const panel = panelRef.current;
    if (!wrapper || !panel) return;

    const wrapperRect = wrapper.getBoundingClientRect();
    const panelHeight = panel.offsetHeight;
    const pinTop = desktopTopOffset;

    // Mode 1: wrapper top hasn't reached the pin line yet — panel sits at top of wrapper
    if (wrapperRect.top >= pinTop) {
      setPanelStyle({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
      });
      return;
    }

    // Mode 3: wrapper is scrolling out — panel locks to bottom of wrapper
    if (wrapperRect.bottom < pinTop + panelHeight) {
      setPanelStyle({
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
      });
      return;
    }

    // Mode 2: pinned to viewport, but `left` and `width` measured from wrapper rect.
    // This keeps the panel inside its column boundary even though it's fixed.
    setPanelStyle({
      position: 'fixed',
      top: pinTop,
      left: wrapperRect.left,
      width: wrapperRect.width,
    });
  }, [desktopTopOffset]);

  useEffect(() => {
    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(updateDesktopPosition);
    };

    schedule();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    // ResizeObserver — content reflows (e.g. images load) change wrapper height
    const ro = new ResizeObserver(schedule);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    if (document.body) ro.observe(document.body);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      ro.disconnect();
    };
  }, [updateDesktopPosition]);

  /* ─────────────── Auto-scroll active item into view (sidebar + mobile) ─────────────── */
  useEffect(() => {
    const list = listRef.current;
    if (list) {
      const activeBtn = list.querySelector(
        `[data-cat-id="${activeId}"]`
      ) as HTMLElement | null;
      if (activeBtn) {
        const top =
          activeBtn.offsetTop - list.clientHeight / 2 + activeBtn.clientHeight / 2;
        list.scrollTo({ top, behavior: 'smooth' });
      }
    }
    const mobile = mobileScrollRef.current;
    if (mobile) {
      const activeBtn = mobile.querySelector(
        `[data-cat-id="${activeId}"]`
      ) as HTMLElement | null;
      if (activeBtn) {
        const left =
          activeBtn.offsetLeft - mobile.clientWidth / 2 + activeBtn.clientWidth / 2;
        mobile.scrollTo({ left, behavior: 'smooth' });
      }
    }
  }, [activeId]);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* ─────────────── Render ─────────────── */
  return (
    <>
      {/* ─── Mobile pin sentinel & spacer ─── */}
      <div ref={mobileSentinelRef} aria-hidden="true" className="lg:hidden" />
      {mobilePinned && (
        <div className="lg:hidden" style={{ height: 70 }} aria-hidden="true" />
      )}

      {/* ─── MOBILE: horizontal scrollable nav, pinned to top after hero ─── */}
      <nav
        className={`lg:hidden ${
          mobilePinned ? 'fixed left-0 right-0' : 'relative'
        } z-40 bg-[#fdfaf0]/95 backdrop-blur-xl border-y border-[#1a3d2e]/10 shadow-md shadow-[#1a3d2e]/5`}
        style={mobilePinned ? { top: mobileTopOffset } : undefined}
      >
        <div ref={mobileScrollRef} className="overflow-x-auto scrollbar-hide py-3 px-4">
          <div className="flex gap-2 min-w-max">
            {categories.map((cat) => {
              const isActive = activeId === cat.id;
              return (
                <button
                  key={cat.id}
                  data-cat-id={cat.id}
                  onClick={() => handleClick(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#1a3d2e] text-[#fdfaf0] shadow-md shadow-[#1a3d2e]/30 scale-[1.03]'
                      : 'bg-[#1a3d2e]/5 text-[#1a3d2e]/75 hover:bg-[#1a3d2e]/10'
                  }`}
                >
                  {cat.icon && <span className="text-base">{cat.icon}</span>}
                  <span>{cat.name}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none ${
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
      </nav>

      {/* ─── DESKTOP: column placeholder + JS-positioned panel ───
          Wrapper is a real flex column (in page layout). Panel modes:
          1. above pin → absolute top of wrapper
          2. in pin range → fixed with measured left/width
          3. wrapper scrolling out → absolute bottom of wrapper       */}
      <div ref={wrapperRef} className="hidden lg:block relative h-full w-full">
        <div
          ref={panelRef}
          style={panelStyle}
          className="flex flex-col bg-[#fdfaf0] border border-[#1a3d2e]/12 rounded-2xl shadow-[0_2px_24px_-12px_rgba(26,61,46,0.18)] overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-4 border-b border-[#1a3d2e]/10">
            <div className="flex items-baseline justify-between gap-3 mb-1">
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-[#1a3d2e]/55">
                Меню
              </p>
              <span className="font-display text-xs text-[#1a3d2e]/40 tabular-nums">
                {categories.length} / {categories.reduce((s, c) => s + c.items.length, 0)}
              </span>
            </div>
            <h2 className="font-display text-2xl font-semibold text-[#1a3d2e] leading-tight">
              Категорії
            </h2>
            <div className="mt-3 h-px w-10 bg-[#1a3d2e]/40" />
          </div>

          {/* Scrollable list */}
          <div
            ref={listRef}
            className="overflow-y-auto py-2 px-2 flex-1 custom-scroll"
            style={{ maxHeight: `calc(100vh - ${desktopTopOffset + 32}px - 8.5rem)` }}
          >
            {categories.map((cat) => {
              const isActive = activeId === cat.id;
              return (
                <button
                  key={cat.id}
                  data-cat-id={cat.id}
                  onClick={() => handleClick(cat.id)}
                  className={`group/item w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-sm transition-all duration-300 mb-0.5 ${
                    isActive
                      ? 'bg-[#1a3d2e] text-[#fdfaf0] shadow-md shadow-[#1a3d2e]/25'
                      : 'text-[#1a3d2e]/75 hover:bg-[#1a3d2e]/6 hover:text-[#1a3d2e]'
                  }`}
                >
                  {cat.icon && (
                    <span className="text-base flex-shrink-0 leading-none">{cat.icon}</span>
                  )}
                  <span
                    className={`flex-1 leading-tight font-medium ${
                      isActive ? '' : 'group-hover/item:translate-x-0.5 transition-transform duration-300'
                    }`}
                  >
                    {cat.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none flex-shrink-0 tabular-nums ${
                      isActive
                        ? 'bg-[#fdfaf0]/25 text-[#fdfaf0]'
                        : 'bg-[#1a3d2e]/10 text-[#1a3d2e]/70'
                    }`}
                  >
                    {cat.items.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Footer accent */}
          <div className="px-5 py-3 border-t border-[#1a3d2e]/10 bg-[#f4ecd8]/30">
            <p className="text-[10px] uppercase tracking-[0.18em] text-[#1a3d2e]/50 text-center">
              Глухомань · Кухня
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
