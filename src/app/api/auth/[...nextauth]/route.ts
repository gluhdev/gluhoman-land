/**
 * NextAuth v5 catch-all route handler.
 * Exports both GET and POST as required by Auth.js.
 */
import { handlers } from '@/lib/auth';
export const { GET, POST } = handlers;
