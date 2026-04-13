#!/usr/bin/env node
/**
 * scripts/test-admin-login.mjs
 *
 * End-to-end verification of the NextAuth v5 credentials-based admin login
 * flow for the Глухомань site.
 *
 * Usage:
 *   node scripts/test-admin-login.mjs
 *
 * Environment variables (all optional):
 *   BASE_URL       default http://localhost:3002
 *   ADMIN_EMAIL    default admin@gluhoman.local
 *   ADMIN_PASSWORD default admin123
 *
 * The script assumes a dev server is already running at BASE_URL. It does
 * NOT start one. To launch one manually:
 *   npm run dev -- --port 3002
 *
 * Steps performed:
 *   1. GET  /                 (sanity)
 *   2. GET  /admin            (should redirect to /admin/login or return 200)
 *   3. GET  /admin/login      (must be 200)
 *   4. GET  /api/auth/csrf    (fetch csrf token + cookie)
 *   5. POST /api/auth/callback/credentials  (login)
 *   6. GET  /api/auth/session (must contain user with role=admin)
 *   7. GET  /admin            (must be 200 with session cookie)
 *
 * Exit code is 0 on success, 1 on any failure.
 */

import { writeFileSync, readFileSync, unlinkSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3002';
const EMAIL = process.env.ADMIN_EMAIL || 'admin@gluhoman.local';
const PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const COOKIE_JAR = new Map(); // name -> value

function parseSetCookie(headerList) {
  // headerList: array of Set-Cookie strings
  for (const raw of headerList) {
    const [pair] = raw.split(';');
    const eq = pair.indexOf('=');
    if (eq === -1) continue;
    const name = pair.slice(0, eq).trim();
    const value = pair.slice(eq + 1).trim();
    COOKIE_JAR.set(name, value);
  }
}

function cookieHeader() {
  return [...COOKIE_JAR.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
}

async function req(method, path, { body, headers = {}, redirect = 'manual' } = {}) {
  const url = `${BASE_URL}${path}`;
  const h = { ...headers };
  const ck = cookieHeader();
  if (ck) h['Cookie'] = ck;
  const res = await fetch(url, { method, headers: h, body, redirect });
  // Node fetch exposes set-cookie via getSetCookie()
  const setCookies =
    typeof res.headers.getSetCookie === 'function' ? res.headers.getSetCookie() : [];
  if (setCookies.length) parseSetCookie(setCookies);
  return res;
}

function assert(cond, msg) {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  } else {
    console.log(`OK  : ${msg}`);
  }
}

async function main() {
  console.log(`Target: ${BASE_URL}`);
  console.log(`User  : ${EMAIL}`);

  // 1. /
  let r = await req('GET', '/');
  assert(r.status === 200, `GET /  -> ${r.status}`);

  // 2. /admin (no session) -> expect 200 or 3xx redirect to login
  r = await req('GET', '/admin');
  assert(
    r.status === 200 || (r.status >= 300 && r.status < 400),
    `GET /admin (no session) -> ${r.status}`,
  );

  // 3. /admin/login
  r = await req('GET', '/admin/login');
  assert(r.status === 200, `GET /admin/login -> ${r.status}`);

  // 4. CSRF
  r = await req('GET', '/api/auth/csrf');
  assert(r.status === 200, `GET /api/auth/csrf -> ${r.status}`);
  const { csrfToken } = await r.json();
  assert(typeof csrfToken === 'string' && csrfToken.length > 0, 'csrfToken present');

  // 5. Login
  const form = new URLSearchParams({
    email: EMAIL,
    password: PASSWORD,
    csrfToken,
    callbackUrl: '/admin',
  });
  r = await req('POST', '/api/auth/callback/credentials', {
    body: form.toString(),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  const loc = r.headers.get('location') || '';
  assert(
    r.status === 302 && !/\/admin\/login\?error/.test(loc) && !/[?&]error=/.test(loc),
    `POST callback/credentials -> ${r.status} Location=${loc}`,
  );

  // 6. Session
  r = await req('GET', '/api/auth/session');
  assert(r.status === 200, `GET /api/auth/session -> ${r.status}`);
  const session = await r.json();
  assert(
    session && session.user && session.user.email === EMAIL,
    `session.user.email == ${EMAIL} (got ${JSON.stringify(session)})`,
  );
  assert(session.user.role === 'admin', `session.user.role == admin (got ${session.user.role})`);

  // 7. /admin with session
  r = await req('GET', '/admin');
  assert(r.status === 200, `GET /admin (with session) -> ${r.status}`);

  console.log('\nAll checks passed.');
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
