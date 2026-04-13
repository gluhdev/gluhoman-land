#!/usr/bin/env node
/**
 * One-time migration helper: copies Booking rows from the local SQLite
 * dev database (`prisma/dev.db`) into the production Postgres database
 * referenced by the current `DATABASE_URL` environment variable.
 *
 * Usage:
 *   DATABASE_URL="postgresql://user:pass@host:5432/db" \
 *     node scripts/migrate-sqlite-to-postgres.mjs [--dry-run]
 *
 * Notes:
 *   - Preserves id, createdAt, updatedAt of each booking.
 *   - --dry-run only previews; no writes are performed.
 *   - Gracefully exits if prisma/dev.db does not exist.
 *   - Requires `@prisma/client` for Postgres to have been generated
 *     from `prisma/schema.postgres.prisma` beforehand.
 */

import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");
const sqlitePath = resolve(projectRoot, "prisma/dev.db");
const dryRun = process.argv.includes("--dry-run");

if (!existsSync(sqlitePath)) {
  console.log(`[migrate] No SQLite database found at ${sqlitePath}. Nothing to migrate.`);
  process.exit(0);
}

if (!process.env.DATABASE_URL) {
  console.error("[migrate] ERROR: DATABASE_URL is not set. Point it at your Postgres instance.");
  process.exit(1);
}

if (process.env.DATABASE_URL.startsWith("file:")) {
  console.error("[migrate] ERROR: DATABASE_URL points at SQLite. Set it to the Postgres URL before running.");
  process.exit(1);
}

// Dynamically import Prisma clients so the script can run with whichever
// client has been generated most recently.
const { PrismaClient } = await import("@prisma/client");

// Source: SQLite (override datasource URL explicitly so we can read dev.db
// regardless of the current DATABASE_URL env var, which points at Postgres).
const sqliteUrl = `file:${sqlitePath}`;
const source = new PrismaClient({
  datasources: { db: { url: sqliteUrl } },
});

// Target: Postgres (uses process.env.DATABASE_URL by default).
const target = new PrismaClient();

let migrated = 0;
const errors = [];

try {
  const bookings = await source.booking.findMany({ orderBy: { createdAt: "asc" } });
  console.log(`[migrate] Found ${bookings.length} booking(s) in SQLite.`);

  if (dryRun) {
    console.log("[migrate] --dry-run enabled; skipping writes.");
    for (const b of bookings) {
      console.log(`  - ${b.id}  ${b.service}  ${b.name}  ${b.createdAt.toISOString()}`);
    }
  } else {
    for (const b of bookings) {
      try {
        await target.booking.upsert({
          where: { id: b.id },
          update: {},
          create: {
            id: b.id,
            service: b.service,
            status: b.status,
            name: b.name,
            phone: b.phone,
            email: b.email,
            guests: b.guests,
            dateFrom: b.dateFrom,
            dateTo: b.dateTo,
            time: b.time,
            comment: b.comment,
            telegramStatus: b.telegramStatus,
            telegramError: b.telegramError,
            emailStatus: b.emailStatus,
            emailError: b.emailError,
            ipAddress: b.ipAddress,
            userAgent: b.userAgent,
            createdAt: b.createdAt,
            updatedAt: b.updatedAt,
          },
        });
        migrated++;
      } catch (err) {
        errors.push({ id: b.id, error: err instanceof Error ? err.message : String(err) });
      }
    }
  }
} catch (err) {
  console.error("[migrate] Fatal error:", err);
  process.exitCode = 1;
} finally {
  await source.$disconnect();
  await target.$disconnect();
}

console.log(`[migrate] Done. Migrated: ${migrated}. Errors: ${errors.length}.`);
if (errors.length > 0) {
  for (const e of errors) {
    console.error(`  ! ${e.id}: ${e.error}`);
  }
  process.exitCode = 1;
}
