import { ReactNode } from 'react';
import { Metadata } from 'next';
import { Manrope, Cormorant_Garamond } from 'next/font/google';
import '../globals.css';
import { AdminShell } from './AdminShell';
import { auth } from '@/lib/auth';

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-manrope',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-fraunces',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CRM — Глухомань',
  robots: { index: false, follow: false },
};

// Admin routes live outside the [locale] segment, so they don't inherit the
// locale layout's <html>/<body>, fonts, or globals.css. This layout provides
// its own self-contained styled shell. Access is guarded by src/middleware.ts;
// the /admin/login page is allowed through and AdminShell renders it bare.
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  return (
    <html lang="uk" className={`${manrope.variable} ${cormorant.variable}`}>
      <body className="font-sans antialiased bg-[#faf6ec] text-[#0f1f18]">
        <AdminShell session={session}>{children}</AdminShell>
      </body>
    </html>
  );
}
