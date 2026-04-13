'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, ChevronDown, Home } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { openBookingDialog } from '@/components/ui/BookingDialog';
import { ADDITIONAL_SERVICES, CONTACT_INFO } from '@/constants';

/* ------------------------------------------------------------------ */
/* Local navigation model — does NOT mutate constants                 */
/* ------------------------------------------------------------------ */

type PrimaryItem = { name: string; href: string };

const PRIMARY_NAV: PrimaryItem[] = [
  { name: 'Аквапарк', href: '/aquapark' },
  { name: 'Готель', href: '/hotel' },
  { name: 'Ресторан', href: '/restaurant' },
  { name: 'Лазня', href: '/sauna' },
];

/** Group ADDITIONAL_SERVICES into 3 editorial columns by id. */
const SERVICE_GROUPS: { eyebrow: string; ids: string[] }[] = [
  {
    eyebrow: 'Активний відпочинок',
    ids: ['paintball', 'horses', 'brewery-tour'],
  },
  {
    eyebrow: 'Велнес та відпочинок',
    ids: ['apitherapy', 'bbq-zone'],
  },
  {
    eyebrow: 'Події та свята',
    ids: ['wedding', 'kids-parties', 'petting-zoo'],
  },
];

const findService = (id: string) =>
  ADDITIONAL_SERVICES.find((s) => s.id === id);

/* ------------------------------------------------------------------ */
/* Header                                                             */
/* ------------------------------------------------------------------ */

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [otherOpen, setOtherOpen] = useState(false);

  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  /* --- scroll state ---------------------------------------------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* --- mobile drawer: scroll lock + escape + focus trap ---------- */
  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const drawer = drawerRef.current;
    const focusables = drawer
      ? Array.from(
          drawer.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        )
      : [];
    focusables[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMobileOpen(false);
        return;
      }
      if (e.key === 'Tab' && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      // restore focus to hamburger
      hamburgerRef.current?.focus();
    };
  }, [mobileOpen]);

  /* --- helpers --------------------------------------------------- */
  const isActive = useCallback(
    (href: string) => {
      if (href === '/') return pathname === '/';
      return pathname === href || pathname.startsWith(href + '/');
    },
    [pathname]
  );

  const phone = CONTACT_INFO.phone[0];
  const phoneHref = `tel:${phone.replace(/\s/g, '')}`;

  const headerBgClass = scrolled
    ? 'bg-[#FBFAF6]/95 backdrop-blur-md border-b border-black/10 shadow-[0_1px_0_0_rgba(0,0,0,0.04)]'
    : 'bg-gradient-to-b from-black/50 via-black/25 to-transparent border-b border-transparent backdrop-blur-[5px]';

  const heightClass = scrolled ? 'h-16' : 'h-24';

  const linkBase =
    'group/nav relative inline-flex items-center px-1 py-1 text-[11px] uppercase tracking-[0.22em] font-medium transition-all duration-500 ' +
    'after:absolute after:left-1/2 after:-bottom-0.5 after:h-px after:w-0 after:-translate-x-1/2 after:bg-current after:opacity-60 ' +
    'after:transition-all after:duration-500 ' +
    'hover:after:w-[calc(100%-0.5rem)] hover:after:opacity-100 ' +
    'focus-visible:outline-none focus-visible:ring-0 ';

  const linkColor = scrolled ? 'text-neutral-800 hover:text-black' : 'text-white hover:text-white';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${headerBgClass}`}
      >
        <nav
          aria-label="Головна навігація"
          className={`!overflow-visible mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 transition-[height] duration-500 ${heightClass}`}
        >
          {/* Logo --------------------------------------------------- */}
          <Link
            href="/"
            aria-label="Глухомань — на головну"
            className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-sm"
          >
            <Image
              src="/images/logo.png"
              alt="Глухомань — ресторанно-готельний комплекс"
              width={200}
              height={104}
              priority
              className={`w-auto transition-all duration-500 ${
                scrolled ? 'h-11' : 'h-14 drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]'
              }`}
            />
          </Link>

          {/* Desktop nav ------------------------------------------- */}
          <div className="hidden lg:flex flex-1 justify-center">
            <NavigationMenu viewport={false} className="!max-w-none">
              <NavigationMenuList className="gap-8">
                {/* Home icon */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      aria-label="Головна"
                      className={`${linkBase} ${linkColor} ${
                        isActive('/') ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                      }`}
                    >
                      <Home className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                {PRIMARY_NAV.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className={`${linkBase} ${linkColor} ${
                            active ? 'after:w-full' : 'after:w-0 hover:after:w-full'
                          }`}
                        >
                          {item.name}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}

                {/* Інші послуги megamenu */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={`!bg-transparent !p-0 !h-auto ${linkBase} ${linkColor} after:w-0 hover:after:w-full data-[state=open]:after:w-full`}
                  >
                    Інші послуги
                  </NavigationMenuTrigger>
                  <NavigationMenuContent
                    className="!p-0 !bg-transparent !border-0 !shadow-none !left-1/2 !-translate-x-1/2 !w-[680px] !max-w-[92vw]"
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-[#faf6ec] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] ring-1 ring-[#1a3d2e]/10 p-8">
                      <div className="grid grid-cols-3 gap-8">
                        {SERVICE_GROUPS.map((group) => (
                          <div key={group.eyebrow}>
                            <div className="text-[10px] uppercase tracking-[0.22em] text-[#1a3d2e]/50 mb-5 flex items-center gap-3">
                              <span className="h-px w-6 bg-[#1a3d2e]/30" />
                              {group.eyebrow}
                            </div>
                            <ul className="space-y-3">
                              {group.ids.map((id) => {
                                const svc = findService(id);
                                if (!svc) return null;
                                return (
                                  <li key={id}>
                                    <NavigationMenuLink asChild>
                                      <Link
                                        href={svc.href}
                                        className="group/item relative block px-3 py-2 -mx-3 rounded-md hover:bg-[#1a3d2e]/[0.04] transition-colors"
                                      >
                                        <div className="text-sm font-semibold text-[#1a3d2e] transition-transform duration-500 group-hover/item:translate-x-1">
                                          {svc.title}
                                        </div>
                                        <div className="text-[11px] text-[#1a3d2e]/75 mt-1 line-clamp-1">
                                          {svc.description}
                                        </div>
                                      </Link>
                                    </NavigationMenuLink>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right cluster ----------------------------------------- */}
          <div className="hidden lg:flex items-center gap-5">
            <a
              href={phoneHref}
              aria-label={`Зателефонувати ${phone}`}
              className={`group flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm ${linkColor}`}
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden xl:inline">{phone}</span>
            </a>
            <button
              type="button"
              onClick={() => openBookingDialog()}
              className={`text-[11px] uppercase tracking-[0.22em] font-medium px-5 py-2.5 border rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                scrolled
                  ? 'border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white'
                  : 'border-white text-white hover:bg-white hover:text-neutral-900'
              }`}
            >
              Забронювати
            </button>
          </div>

          {/* Mobile cluster ---------------------------------------- */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={phoneHref}
              aria-label={`Зателефонувати ${phone}`}
              className={`p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${linkColor}`}
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
            </a>
            <button
              ref={hamburgerRef}
              type="button"
              aria-label={mobileOpen ? 'Закрити меню' : 'Відкрити меню'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-drawer"
              onClick={() => setMobileOpen((v) => !v)}
              className={`p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${linkColor}`}
            >
              {mobileOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer ------------------------------------------------ */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={drawerRef}
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Головне меню"
            className="absolute right-0 top-0 h-full w-[85vw] max-w-sm bg-[#FBFAF6] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
          >
            <div className="flex items-center justify-between px-6 h-20 border-b border-black/10">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                <Image
                  src="/images/logo.png"
                  alt="Глухомань"
                  width={200}
                  height={104}
                  className="h-11 w-auto"
                />
              </Link>
              <button
                type="button"
                aria-label="Закрити меню"
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-full text-neutral-800 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <nav
              aria-label="Мобільна навігація"
              className="flex-1 overflow-y-auto px-6 py-8"
            >
              <ul className="space-y-1">
                {PRIMARY_NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`block py-3 text-[13px] uppercase tracking-[0.22em] font-medium border-b border-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm ${
                        isActive(item.href) ? 'text-primary' : 'text-neutral-900'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}

                {/* Other services accordion */}
                <li>
                  <button
                    type="button"
                    aria-expanded={otherOpen}
                    aria-controls="mobile-other-services"
                    onClick={() => setOtherOpen((v) => !v)}
                    className="flex items-center justify-between w-full py-3 text-[13px] uppercase tracking-[0.22em] font-medium text-neutral-900 border-b border-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                  >
                    Інші послуги
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 transition-transform ${
                        otherOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {otherOpen && (
                    <div id="mobile-other-services" className="py-3 space-y-5">
                      {SERVICE_GROUPS.map((group) => (
                        <div key={group.eyebrow}>
                          <div className="text-[10px] uppercase tracking-[0.18em] font-semibold text-neutral-500 mb-2">
                            {group.eyebrow}
                          </div>
                          <ul className="space-y-1 pl-2">
                            {group.ids.map((id) => {
                              const svc = findService(id);
                              if (!svc) return null;
                              return (
                                <li key={id}>
                                  <Link
                                    href={svc.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block py-1.5 text-sm text-neutral-800 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                                  >
                                    {svc.title}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </li>

                <li>
                  <Link
                    href="/restaurant"
                    onClick={() => setMobileOpen(false)}
                    className={`block py-3 text-[13px] uppercase tracking-[0.22em] font-medium border-b border-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm ${
                      isActive('/restaurant') ? 'text-primary' : 'text-neutral-900'
                    }`}
                  >
                    Ресторан
                  </Link>
                </li>
                <li>
                  <Link
                    href="/menu"
                    onClick={() => setMobileOpen(false)}
                    className={`block py-3 pl-4 text-[12px] uppercase tracking-[0.22em] font-medium border-b border-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm ${
                      isActive('/menu') ? 'text-primary' : 'text-neutral-700'
                    }`}
                  >
                    Дивитися меню
                  </Link>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-black/10 space-y-3">
                <div className="text-[10px] uppercase tracking-[0.18em] font-semibold text-neutral-500">
                  Зв&apos;яжіться з нами
                </div>
                {CONTACT_INFO.phone.slice(0, 2).map((p) => (
                  <a
                    key={p}
                    href={`tel:${p.replace(/\s/g, '')}`}
                    className="flex items-center gap-3 text-sm text-neutral-800 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {p}
                  </a>
                ))}
              </div>
            </nav>

            <div className="px-6 py-5 border-t border-black/10">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  openBookingDialog();
                }}
                className="w-full text-[12px] uppercase tracking-[0.22em] font-medium px-5 py-3.5 border border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Забронювати
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}
