/**
 * POST /admin/logout — terminates the NextAuth session and redirects to /admin/login.
 */
import { NextResponse } from 'next/server';
import { signOut } from '@/lib/auth';

export async function POST(request: Request) {
  await signOut({ redirect: false });
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  return NextResponse.redirect(new URL('/admin/login', base));
}
