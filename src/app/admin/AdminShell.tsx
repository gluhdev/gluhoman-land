'use client';

import { ReactNode, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Hotel,
  Waves,
  Flame,
  FileText,
  LogOut,
  Menu as MenuIcon,
  X,
} from 'lucide-react';
import type { Session } from 'next-auth';

interface Props {
  children: ReactNode;
  session: Session | null;
}

const NAV = [
  { href: '/admin', label: 'Огляд', icon: LayoutDashboard, exact: true },
  { href: '/admin/orders', label: 'Замовлення', icon: ShoppingBag },
  { href: '/admin/menu', label: 'Меню', icon: UtensilsCrossed },
  { href: '/admin/hotel', label: 'Готель', icon: Hotel },
  { href: '/admin/aquapark', label: 'Аквапарк', icon: Waves },
  { href: '/admin/sauna', label: 'Лазня', icon: Flame },
  { href: '/admin/content', label: 'Контент сайту', icon: FileText },
];

const SECTION_LABEL: Record<string, string> = {
  '/admin': 'Огляд',
  '/admin/orders': 'Замовлення',
  '/admin/menu': 'Меню',
  '/admin/hotel': 'Готель',
  '/admin/aquapark': 'Аквапарк',
  '/admin/sauna': 'Лазня',
  '/admin/today': 'Сьогодні',
  '/admin/telegram': 'Telegram',
  '/admin/exports': 'Експорт',
  '/admin/content': 'Контент сайту',
};

function currentSectionLabel(pathname: string): string {
  if (pathname === '/admin') return 'Огляд';
  const match = Object.keys(SECTION_LABEL)
    .filter((k) => k !== '/admin' && pathname.startsWith(k))
    .sort((a, b) => b.length - a.length)[0];
  return match ? SECTION_LABEL[match] : 'Розділ';
}

export function AdminShell({ children, session }: Props) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Login page renders without the shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const sectionLabel = currentSectionLabel(pathname);

  return (
    <div className="min-h-screen bg-[#faf6ec] text-[#0f1f18] flex">
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#0f1f18] border-b border-[#e6d9b8]/15 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 text-[#f4ecd8]"
          aria-label="Меню"
        >
          <MenuIcon className="h-5 w-5" />
        </button>
        <p className="font-display italic text-base text-[#e6d9b8]">Глухомань · CRM</p>
        <div className="w-9" />
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 bg-[#0f1f18] border-r border-[#e6d9b8]/10 p-6 overflow-y-auto">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-[#f4ecd8]/60 hover:text-[#e6d9b8]"
              aria-label="Закрити"
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar pathname={pathname} session={session} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 fixed top-0 left-0 bottom-0 bg-[#0f1f18] border-r border-[#e6d9b8]/10 flex-col p-6 overflow-y-auto">
        <Sidebar pathname={pathname} session={session} />
      </aside>

      {/* Main */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 min-h-screen flex flex-col">
        {/* Top bar — breadcrumbs */}
        <div className="hidden lg:flex items-center justify-between px-10 py-5 bg-[#faf6ec] border-b border-[#1a3d2e]/12">
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/60 font-medium">
            <span>CRM</span>
            <span className="text-[#1a3d2e]/25">/</span>
            <span className="text-[#1a3d2e]">{sectionLabel}</span>
          </div>
          {session?.user?.email && (
            <div className="flex items-center gap-3">
              <span className="text-[11px] uppercase tracking-[0.22em] text-[#1a3d2e]/50 font-medium">
                {session.user.email}
              </span>
              <div className="w-8 h-8 rounded-full bg-[#1a3d2e] text-[#e6d9b8] flex items-center justify-center text-xs font-semibold">
                {(session.user.email ?? 'A').slice(0, 1).toUpperCase()}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 bg-[#faf6ec] text-[#0f1f18]">{children}</div>
      </main>
    </div>
  );
}

function Sidebar({
  pathname,
  session,
  onNavigate,
}: {
  pathname: string;
  session: Session | null;
  onNavigate?: () => void;
}) {
  return (
    <>
      {/* Brand */}
      <div className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-[#e6d9b8]/60 font-medium">
          Editorial CRM
        </p>
        <p className="font-display italic text-2xl text-[#e6d9b8] mt-1">
          Глухомань <span className="not-italic text-[#e6d9b8]/60">·</span> CRM
        </p>
        <div className="mt-4 h-px w-full bg-[#e6d9b8]/15" />
      </div>

      {/* Nav */}
      <nav className="flex-1 -mx-6">
        {NAV.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-6 py-3 text-[11px] uppercase tracking-[0.22em] font-medium transition-colors border-l-2 ${
                isActive
                  ? 'border-[#e6d9b8] text-[#e6d9b8] bg-white/5'
                  : 'border-transparent text-[#f4ecd8]/70 hover:bg-white/5 hover:text-[#e6d9b8]'
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User block */}
      {session?.user && (
        <div className="mt-6 pt-6 border-t border-[#e6d9b8]/15">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#1a3d2e] border border-[#e6d9b8]/20 flex items-center justify-center text-sm font-semibold text-[#e6d9b8]">
              {(session.user.email ?? 'A').slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-[#f4ecd8] truncate">{session.user.email}</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#e6d9b8]/50 font-medium mt-0.5">
                Адміністратор
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border border-[#e6d9b8]/20 text-[#f4ecd8]/80 hover:bg-white/5 hover:text-[#e6d9b8] transition-colors font-display italic text-sm"
          >
            <LogOut className="h-4 w-4" />
            Вийти
          </button>
        </div>
      )}
    </>
  );
}
