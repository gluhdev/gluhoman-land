/**
 * Next.js middleware — combined:
 *   1. next-intl locale detection for public routes (skips /api, /admin)
 *   2. NextAuth admin protection for /admin/* routes
 *
 * next-intl handles locale routing; auth.ts authorized() callback handles
 * admin gating. Both matchers are listed so Next.js invokes this file for
 * both route sets.
 */
import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { auth } from '@/lib/auth';
import { routing } from './i18n/routing';

const intlMiddleware = createIntlMiddleware(routing);

const LOCALE_COOKIE = 'NEXT_LOCALE';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

function firstAcceptLanguageTag(header: string | null): string {
  if (!header) return '';
  return (header.split(',')[0] ?? '').split(';')[0].trim().toLowerCase();
}

/**
 * Strict locale rule: device language MUST start with `en` for the user to
 * land on /en. Anything else (uk, ru, de, fr…) lands on Ukrainian default.
 * Users can override manually via the header LanguageSwitcher, which sets
 * the same NEXT_LOCALE cookie and disables this detection on next visit.
 */
function detectLocale(request: NextRequest): 'uk' | 'en' {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie === 'uk' || cookie === 'en') return cookie;
  const primary = firstAcceptLanguageTag(request.headers.get('accept-language'));
  return primary.startsWith('en') ? 'en' : 'uk';
}

const AQUAPARK_BOOKING_URL = 'https://gluhoman.pl.ua/';

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Aquapark tickets are sold by an external system — every locale of
  // /aquapark/booking must hard-redirect there. This lives in middleware (not
  // the page's redirect()) because redirect() to an EXTERNAL URL only soft-
  // redirects on client navigation; a direct browser hit needs a real HTTP 307,
  // which only the routing layer can emit.
  const withoutLocale = pathname.replace(/^\/(uk|en)(?=\/|$)/, '');
  if (withoutLocale === '/aquapark/booking') {
    return NextResponse.redirect(AQUAPARK_BOOKING_URL);
  }

  // Admin routes: delegate entirely to NextAuth auth middleware
  if (pathname.startsWith('/admin')) {
    return (auth as unknown as (req: NextRequest) => Promise<NextResponse>)(request);
  }

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  const hasLocalePrefix =
    pathname === '/en' ||
    pathname === '/uk' ||
    pathname.startsWith('/en/') ||
    pathname.startsWith('/uk/');

  // First-time visitor on a non-prefixed URL: apply strict device detection.
  if (!cookieLocale && !hasLocalePrefix) {
    const target = detectLocale(request);
    if (target === 'en') {
      const url = request.nextUrl.clone();
      url.pathname = pathname === '/' ? '/en' : `/en${pathname}`;
      const res = NextResponse.redirect(url);
      res.cookies.set(LOCALE_COOKIE, 'en', {
        maxAge: COOKIE_MAX_AGE,
        path: '/',
        sameSite: 'lax',
      });
      return res;
    }
    // Ukrainian default: continue with next-intl, persist cookie so we skip
    // detection on subsequent visits.
    const res = intlMiddleware(request);
    res.cookies.set(LOCALE_COOKIE, 'uk', {
      maxAge: COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
    });
    return res;
  }

  return intlMiddleware(request);
}

export const config = {
  // Covers both admin routes AND locale-eligible public routes.
  // Static files, _next internals, api routes, and dotfile paths are excluded.
  matcher: [
    '/admin/:path*',
    '/((?!api|admin|_next|_vercel|.*\\..*).+)',
    '/',
  ],
};
