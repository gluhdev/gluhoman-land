// Canonical public base URL for absolute links in metadata / JSON-LD. Prod sets
// NEXT_PUBLIC_SITE_URL; the fallback is the live host (NOT the legacy
// gluhoman.com.ua, where the site no longer lives).
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://gluhoman.maxautomate.ai";
