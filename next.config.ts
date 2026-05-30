import type { NextConfig } from "next";
import path from "path";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Suppress Sentry's "missing instrumentation file" warning when Sentry is not
// fully wired up in this environment (instrumentation files ship as .prod stubs).
process.env.SENTRY_SUPPRESS_INSTRUMENTATION_FILE_WARNING = "1";

const nextConfig: NextConfig = {
  // Self-hosted production deployment (Docker/VPS).
  // Outputs a minimal standalone server in .next/standalone with all deps bundled.
  // NOTE: enabled unconditionally. The previous `NODE_ENV === "production"` guard
  // evaluated to false at config-load time during `next build`, so the standalone
  // directory was silently never emitted. `output: "standalone"` only affects the
  // build output artifact — `next dev` ignores it, so it is safe to leave on.
  output: "standalone",
  // Pin the file-tracing root to this project to prevent Next from walking up to
  // an ancestor lockfile and either producing a bloated bundle or missing files.
  outputFileTracingRoot: path.join(__dirname, "./"),
  poweredByHeader: false,
  compress: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Cache headers для сирих public-картинок: ревалідація щогодини, щоб
  // після регенерації файлу (той самий шлях, новий вміст) користувачі
  // побачили свіже зображення ≤1 год без чистки кешу вручну.
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          {
            // 1 day, revalidatable (NOT immutable): photos are sometimes
            // replaced in place, so browsers must be able to pick up new
            // versions within a day instead of being stuck for a month.
            key: "Cache-Control",
            value: "public, max-age=86400, must-revalidate",
          },
        ],
      },
    ];
  },
  images: {
    // WebP-only (AVIF dropped intentionally): AVIF encoding is ~5–10× slower
    // than WebP and is done on-demand by the standalone server. On the modest
    // VPS that made first-load of large room photos crawl — especially right
    // after a deploy when the optimizer cache is cold. WebP is plenty small
    // and encodes fast. Pair this with the persisted .next/cache volume.
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 85, 90, 95],
    // 1 day — long enough to keep the optimizer cache warm (good perf), short
    // enough that an in-place photo replacement propagates to browsers within
    // a day instead of a month.
    minimumCacheTTL: 60 * 60 * 24,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.shaketopay.com.ua',
        pathname: '/**',
      },
    ],
  },
};

export default process.env.NODE_ENV === "production"
  ? withSentryConfig(withNextIntl(nextConfig), {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      silent: !process.env.CI,
      widenClientFileUpload: true,
      tunnelRoute: "/monitoring",
    })
  : withNextIntl(nextConfig);
