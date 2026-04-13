/**
 * Next.js middleware — protects /admin/* routes via NextAuth.
 *
 * Uses the `authorized` callback in src/lib/auth.ts to allow/deny.
 * Unauthenticated users are redirected to /admin/login.
 */
import { auth } from '@/lib/auth';

export default auth;

export const config = {
  matcher: ['/admin/:path*'],
};
