import type { NextConfig } from "next";
import path from "path";
import { withSentryConfig } from "@sentry/nextjs";

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
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75, 85, 90, 95],
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
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      silent: !process.env.CI,
      widenClientFileUpload: true,
      tunnelRoute: "/monitoring",
    })
  : nextConfig;
