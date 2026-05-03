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

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes: delegate entirely to NextAuth auth middleware
  if (pathname.startsWith('/admin')) {
    return (auth as unknown as (req: NextRequest) => Promise<NextResponse>)(request);
  }

  // All other public routes: run next-intl locale middleware
  return intlMiddleware(request);
}

export const config = {
  // Covers both admin routes AND locale-eligible public routes.
  // Static files, _next internals, api routes, and dotfile paths are excluded.
  matcher: [
    '/admin/:path*',
    '/((?!api|admin|_next|_vercel|.*\\..*)(.*))' ,
  ],
};
