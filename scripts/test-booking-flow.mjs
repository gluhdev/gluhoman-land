#!/usr/bin/env node
/**
 * Functional audit helper: logs in as admin and fetches every
 * admin page + public booking flow, reporting HTTP code and
 * whether a list of expected markers is present in the HTML.
 *
 * Usage:  node scripts/test-booking-flow.mjs
 * Env:    BASE_URL (default http://localhost:3002)
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3002';
const EMAIL = process.env.ADMIN_EMAIL || 'admin@gluhoman.local';
const PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const JAR = new Map();
function cookieHeader() {
  return [...JAR.entries()].map(([k, v]) => `${k}=${v}`).join('; ');
}
function absorb(res) {
  const sc = typeof res.headers.getSetCookie === 'function' ? res.headers.getSetCookie() : [];
  for (const raw of sc) {
    const [pair] = raw.split(';');
    const eq = pair.indexOf('=');
    if (eq === -1) continue;
    JAR.set(pair.slice(0, eq).trim(), pair.slice(eq + 1).trim());
  }
}
async function req(method, path, opts = {}) {
  const h = { ...(opts.headers || {}) };
  const ck = cookieHeader();
  if (ck) h['Cookie'] = ck;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: h,
    body: opts.body,
    redirect: 'manual',
  });
  absorb(res);
  return res;
}

async function login() {
  const csrfRes = await req('GET', '/api/auth/csrf');
  const { csrfToken } = await csrfRes.json();
  const form = new URLSearchParams({
    email: EMAIL,
    password: PASSWORD,
    csrfToken,
    callbackUrl: '/admin',
  });
  const r = await req('POST', '/api/auth/callback/credentials', {
    body: form.toString(),
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  if (r.status !== 302) throw new Error(`login failed: ${r.status}`);
}

function check(name, html, markers) {
  const results = markers.map((m) => ({ m, found: html.includes(m) }));
  const hits = results.filter((r) => r.found).length;
  const status = hits === markers.length ? 'PASS' : hits > 0 ? 'PARTIAL' : 'FAIL';
  console.log(`[${status}] ${name}  (${hits}/${markers.length})`);
  for (const r of results) {
    console.log(`         ${r.found ? '+' : '-'} ${r.m}`);
  }
  return status;
}

const results = [];
async function fetchPage(path) {
  const r = await req('GET', path);
  const body = await r.text();
  return { status: r.status, body, length: body.length };
}

async function main() {
  console.log(`Base: ${BASE_URL}\n`);
  await login();
  console.log('login OK\n');

  const tests = [
    {
      name: 'admin /admin/menu contains seeded dishes',
      path: '/admin/menu',
      markers: ['меню', 'Борщ', 'Салат'],
    },
    {
      name: 'admin /admin/hotel contains room types',
      path: '/admin/hotel',
      markers: ['Стандарт', 'Сімейний', 'Люкс'],
    },
    {
      name: 'admin /admin/orders',
      path: '/admin/orders',
      markers: ['амовлен'],
    },
    {
      name: 'admin /admin/aquapark has tariff names',
      path: '/admin/aquapark',
      markers: ['Дорослий', 'Дитячий'],
    },
    {
      name: 'admin /admin/sauna 200',
      path: '/admin/sauna',
      markers: [],
    },
    {
      name: 'public / (BookingDialog + calendar)',
      path: '/',
      markers: ['BookingDialog', 'font-display'],
    },
    {
      name: 'public /hotel/booking',
      path: '/hotel/booking',
      markers: ['Заїзд', 'Виїзд'],
    },
    {
      name: 'public /aquapark/buy',
      path: '/aquapark/buy',
      markers: ['квиток', 'Дата'],
    },
    {
      name: 'public /sauna/booking',
      path: '/sauna/booking',
      markers: ['азн', 'Дата'],
    },
    {
      name: 'public /menu/checkout',
      path: '/menu/checkout',
      markers: ['Оформ', 'замовлен'],
    },
  ];

  for (const t of tests) {
    const r = await fetchPage(t.path);
    console.log(`\nGET ${t.path} -> ${r.status} (${r.length}b)`);
    const statusLabel = r.status === 200 ? check(t.name, r.body, t.markers) : 'FAIL';
    results.push({ name: t.name, http: r.status, status: statusLabel });
  }

  // API smoke
  console.log('\n--- API smoke ---');
  const apis = [
    ['/api/hotel/availability?checkIn=2026-05-01&checkOut=2026-05-03&guests=2', 'GET'],
    ['/api/sauna/availability?date=2026-05-01', 'GET'],
    ['/api/aquapark/tariffs', 'GET'],
  ];
  for (const [p] of apis) {
    const r = await req('GET', p);
    const txt = await r.text();
    console.log(`${r.status} ${p}  (${txt.length}b)`);
    results.push({ name: `API ${p}`, http: r.status, status: r.status === 200 ? 'PASS' : 'FAIL' });
  }

  const pass = results.filter((r) => r.status === 'PASS').length;
  const partial = results.filter((r) => r.status === 'PARTIAL').length;
  const fail = results.filter((r) => r.status === 'FAIL').length;
  console.log(`\n=== SUMMARY ===`);
  console.log(`PASS:    ${pass}`);
  console.log(`PARTIAL: ${partial}`);
  console.log(`FAIL:    ${fail}`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
