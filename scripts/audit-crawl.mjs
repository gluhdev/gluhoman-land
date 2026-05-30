// Runtime bug crawler. Visits a list of public routes (uk + en) on the target
// base URL and reports: console errors, failed network requests (404 assets),
// broken <img>/next-image (naturalWidth 0), raw i18n keys leaking into text,
// and horizontal overflow at mobile width. Read-only — no interactions beyond
// load + a short settle. Run: node scripts/audit-crawl.mjs [baseURL]
import { chromium } from "playwright";

const BASE = process.argv[2] || "https://gluhoman.maxautomate.ai";
const ROUTES = [
  "/",
  "/hotel",
  "/hotel/central",
  "/hotel/brewery",
  "/hotel/booking?hotel=cottages",
  "/hotel/booking?hotel=central",
  "/cottages",
  "/conference-hall",
  "/aquapark",
  "/aquapark/buy",
  "/restaurant",
  "/restaurant/booking",
  "/menu",
  "/sauna",
  "/sauna/booking",
  "/booking",
  "/gallery",
  "/privacy",
  "/terms",
  "/other-services/apitherapy",
  "/other-services/wedding",
  "/other-services/paintball",
  "/other-services/horses",
  "/other-services/kids-parties",
  "/other-services/bbq-zone",
  "/other-services/brewery-tour",
  "/other-services/petting-zoo",
];
const LOCALES = ["uk", "en"];
// Raw i18n key heuristic: token.like.this with no spaces, lowercase dotted.
const RAW_KEY = /(^|\s)[a-z0-9_]+(\.[a-z0-9_]+){1,}($|\s)/;

const findings = [];
function add(route, type, detail) {
  findings.push({ route, type, detail });
}

const browser = await chromium.launch();
for (const locale of LOCALES) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) audit",
  });
  for (const route of ROUTES) {
    const url = `${BASE}/${locale}${route}`;
    const page = await ctx.newPage();
    const consoleErrs = [];
    const netFails = [];
    page.on("console", (m) => {
      if (m.type() === "error") consoleErrs.push(m.text().slice(0, 200));
    });
    page.on("requestfailed", (r) => {
      netFails.push(`${r.failure()?.errorText} ${r.url().slice(0, 120)}`);
    });
    page.on("response", (r) => {
      const s = r.status();
      if (s >= 400) netFails.push(`HTTP ${s} ${r.url().slice(0, 120)}`);
    });
    let status = 0;
    try {
      const resp = await page.goto(url, {
        waitUntil: "networkidle",
        timeout: 30000,
      });
      status = resp?.status() ?? 0;
    } catch (e) {
      add(`${locale}${route}`, "NAV_ERROR", String(e).slice(0, 160));
      await page.close();
      continue;
    }
    if (status >= 400) add(`${locale}${route}`, "PAGE_STATUS", `HTTP ${status}`);

    // broken images
    const brokenImgs = await page.evaluate(() => {
      const out = [];
      for (const img of Array.from(document.images)) {
        if (img.complete && img.naturalWidth === 0) {
          out.push(img.currentSrc || img.src);
        }
      }
      return out.slice(0, 10);
    });
    for (const b of brokenImgs)
      add(`${locale}${route}`, "BROKEN_IMG", b.slice(0, 120));

    // horizontal overflow
    const overflow = await page.evaluate(() => {
      const de = document.documentElement;
      return de.scrollWidth - de.clientWidth;
    });
    if (overflow > 2)
      add(`${locale}${route}`, "H_OVERFLOW", `${overflow}px at 390w`);

    // raw i18n keys in visible text
    const rawKeys = await page.evaluate(() => {
      const bodyText = document.body.innerText || "";
      const lines = bodyText.split("\n").map((l) => l.trim());
      const hits = [];
      const re = /^[a-z0-9_]+(\.[a-z0-9_]+){1,}$/;
      for (const l of lines) {
        if (re.test(l) && l.length < 60) hits.push(l);
      }
      return [...new Set(hits)].slice(0, 10);
    });
    for (const k of rawKeys)
      add(`${locale}${route}`, "RAW_I18N_KEY", k);

    for (const c of consoleErrs.slice(0, 6))
      add(`${locale}${route}`, "CONSOLE_ERR", c);
    // only report asset/network fails that look like real misses
    const realFails = [...new Set(netFails)].filter(
      (f) => !/favicon|analytics|gtag|monitoring|sentry/i.test(f),
    );
    for (const f of realFails.slice(0, 8))
      add(`${locale}${route}`, "NET_FAIL", f);

    await page.close();
  }
  await ctx.close();
}
await browser.close();

// group + print
const byType = {};
for (const f of findings) (byType[f.type] ||= []).push(f);
console.log(`\n===== AUDIT ${BASE} — ${findings.length} findings =====\n`);
for (const type of Object.keys(byType).sort()) {
  console.log(`### ${type} (${byType[type].length})`);
  for (const f of byType[type]) console.log(`  [${f.route}] ${f.detail}`);
  console.log("");
}
