#!/usr/bin/env node
/**
 * Standalone runner for operators:
 *   node scripts/seed-menu.mjs
 *
 * Просто запускає prisma/seed.ts через tsx. Використовується,
 * коли потрібно засіяти меню без npm-скриптів.
 */
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedPath = resolve(__dirname, '..', 'prisma', 'seed.ts');

if (!process.env.DATABASE_URL) {
  // Fallback на локальну SQLite базу, якщо не задано ззовні
  const dbPath = resolve(__dirname, '..', 'prisma', 'dev.db');
  process.env.DATABASE_URL = `file:${dbPath}`;
  console.log(`[seed-menu] DATABASE_URL not set; using ${process.env.DATABASE_URL}`);
}

const result = spawnSync('npx', ['tsx', seedPath], {
  stdio: 'inherit',
  env: process.env,
});

process.exit(result.status ?? 1);
