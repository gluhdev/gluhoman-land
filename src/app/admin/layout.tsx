import { ReactNode } from 'react';
import { Metadata } from 'next';
import { AdminShell } from './AdminShell';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'CRM — Глухомань',
  robots: { index: false, follow: false },
};

// Note: admin access is guarded by src/middleware.ts. The login page sits at
// /admin/login which the middleware allows through. This layout only needs
// to pass the session to AdminShell.
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  return <AdminShell session={session}>{children}</AdminShell>;
}
