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
            // 30 days for raw /images/* — they're effectively content-addressed
            // by path (room photos don't change in place; we add new slugs when
            // content changes). Big perf win on repeat visits.
            key: "Cache-Control",
            value: "public, max-age=2592000, immutable",
          },
        ],
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 85, 90, 95],
    // 30 days — site photos are immutable per path. Long TTL means Next
    // image optimizer hits its on-disk cache instead of re-encoding AVIF/WebP
    // on every request; major perf gain for repeat visitors AND lower CPU.
    minimumCacheTTL: 60 * 60 * 24 * 30,
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
