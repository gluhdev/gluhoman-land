import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(__dirname, '../..');
const UK_PATH = resolve(ROOT, 'messages/uk.json');
const EN_PATH = resolve(ROOT, 'messages/en.json');
const HASHES_PATH = resolve(ROOT, 'messages/.hashes.json');

type Json = Record<string, unknown>;

function sha1(s: string): string {
  return createHash('sha1').update(s).digest('hex');
}

function flatten(obj: Json, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') out[key] = v;
    else if (v && typeof v === 'object') Object.assign(out, flatten(v as Json, key));
  }
  return out;
}

const uk = JSON.parse(readFileSync(UK_PATH, 'utf-8')) as Json;
const en = existsSync(EN_PATH) ? (JSON.parse(readFileSync(EN_PATH, 'utf-8')) as Json) : {};
const hashes = existsSync(HASHES_PATH)
  ? (JSON.parse(readFileSync(HASHES_PATH, 'utf-8')) as Record<string, string>)
  : {};

const flatUk = flatten(uk);
const flatEn = flatten(en);

const missing: string[] = [];
const stale: string[] = [];

for (const [key, value] of Object.entries(flatUk)) {
  if (!(key in flatEn)) missing.push(key);
  else if (hashes[key] !== sha1(value)) stale.push(key);
}

const orphaned = Object.keys(flatEn).filter((k) => !(k in flatUk));

if (missing.length === 0 && stale.length === 0 && orphaned.length === 0) {
  console.log('✓ Translations in sync.');
  process.exit(0);
}

if (missing.length) {
  console.error(`Missing in en.json (${missing.length}):`);
  missing.forEach((k) => console.error(`  - ${k}`));
}
if (stale.length) {
  console.error(`Stale (UA changed since last sync) (${stale.length}):`);
  stale.forEach((k) => console.error(`  - ${k}`));
}
if (orphaned.length) {
  console.error(`Orphaned in en.json (no UA source) (${orphaned.length}):`);
  orphaned.forEach((k) => console.error(`  - ${k}`));
}
console.error('\nRun `npm run i18n:sync` to fix.');
process.exit(1);
