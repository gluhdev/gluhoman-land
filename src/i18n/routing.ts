import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['uk', 'en'],
  defaultLocale: 'uk',
  localePrefix: 'as-needed',
  // Auto-detection disabled; src/middleware.ts implements custom strict rule:
  // primary Accept-Language tag must start with "en" to land on /en,
  // anything else (uk, ru, de, ...) lands on Ukrainian default.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
