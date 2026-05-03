import { Translator, type DeepLError } from 'deepl-node';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { applyPreGlossary, applyPostGlossary } from './glossary';

const ROOT = resolve(__dirname, '../..');
const UK_PATH = resolve(ROOT, 'messages/uk.json');
const EN_PATH = resolve(ROOT, 'messages/en.json');
const HASHES_PATH = resolve(ROOT, 'messages/.hashes.json');

const SAVE_EVERY = 10;
const REQUEST_INTERVAL_MS = 60;
const MAX_RETRIES = 4;
const BASE_BACKOFF_MS = 4000;

const apiKey = process.env.DEEPL_API_KEY;
if (!apiKey) {
  console.error('DEEPL_API_KEY not set. Add it to .env.local.');
  process.exit(1);
}

const translator = new Translator(apiKey);

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

function setNested(obj: Json, path: string, value: string): void {
  const parts = path.split('.');
  let cur: Json = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (typeof cur[parts[i]] !== 'object' || cur[parts[i]] === null) cur[parts[i]] = {};
    cur = cur[parts[i]] as Json;
  }
  cur[parts[parts.length - 1]] = value;
}

function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}

function isRateLimitError(err: unknown): boolean {
  const e = err as DeepLError & { httpStatusCode?: number };
  if (!e) return false;
  if (e.httpStatusCode === 429) return true;
  const msg = (e.message ?? '').toLowerCase();
  return msg.includes('too many requests') || msg.includes('quota') || msg.includes('429');
}

async function translateOnce(uk: string): Promise<string> {
  const { output, used } = applyPreGlossary(uk);
  const result = await translator.translateText(output, 'uk', 'en-US', {
    preserveFormatting: true,
  });
  return applyPostGlossary(result.text, used);
}

async function translateWithRetry(uk: string): Promise<string> {
  let lastErr: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await translateOnce(uk);
    } catch (err) {
      lastErr = err;
      if (!isRateLimitError(err) || attempt === MAX_RETRIES) {
        throw err;
      }
      const backoff = BASE_BACKOFF_MS * Math.pow(2, attempt);
      console.error(`  ⏳ rate-limited, retrying in ${backoff}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
      await sleep(backoff);
    }
  }
  throw lastErr;
}

function saveProgress(en: Json, hashes: Record<string, string>): void {
  writeFileSync(EN_PATH, JSON.stringify(en, null, 2) + '\n');
  writeFileSync(HASHES_PATH, JSON.stringify(hashes, null, 2) + '\n');
}

async function main() {
  if (!existsSync(UK_PATH)) {
    console.error(`Source missing: ${UK_PATH}`);
    process.exit(1);
  }
  const uk = JSON.parse(readFileSync(UK_PATH, 'utf-8')) as Json;
  const en = existsSync(EN_PATH) ? (JSON.parse(readFileSync(EN_PATH, 'utf-8')) as Json) : {};
  const existingHashes = existsSync(HASHES_PATH)
    ? (JSON.parse(readFileSync(HASHES_PATH, 'utf-8')) as Record<string, string>)
    : {};

  const flat = flatten(uk);
  const flatEn = flatten(en);
  const newHashes: Record<string, string> = { ...existingHashes };

  let translated = 0;
  let unchanged = 0;
  let errors = 0;
  let sinceLastSave = 0;
  const failedKeys: string[] = [];

  // Wrap the loop body in a try so SIGINT / fatal errors still write partial progress.
  const writeOnExit = () => saveProgress(en, newHashes);
  process.on('SIGINT', () => { writeOnExit(); process.exit(130); });
  process.on('SIGTERM', () => { writeOnExit(); process.exit(143); });

  for (const [key, ukValue] of Object.entries(flat)) {
    const hash = sha1(ukValue);
    const isNew = !(key in flatEn);
    const sourceChanged = existingHashes[key] !== hash;

    if (!isNew && !sourceChanged) {
      newHashes[key] = hash;
      unchanged++;
      continue;
    }

    try {
      console.log(`→ ${key}`);
      if (ukValue === '') {
        setNested(en, key, '');
        newHashes[key] = hash;
        translated++;
        sinceLastSave++;
        if (sinceLastSave >= SAVE_EVERY) {
          saveProgress(en, newHashes);
          sinceLastSave = 0;
        }
        continue;
      }
      const enValue = await translateWithRetry(ukValue);
      setNested(en, key, enValue);
      newHashes[key] = hash;
      translated++;
      sinceLastSave++;
      if (sinceLastSave >= SAVE_EVERY) {
        saveProgress(en, newHashes);
        sinceLastSave = 0;
      }
      // Spread requests slightly to avoid hammering DeepL.
      await sleep(REQUEST_INTERVAL_MS);
    } catch (err) {
      const msg = (err as Error).message;
      console.error(`  ✗ ${key}: ${msg}`);
      errors++;
      failedKeys.push(key);
      // Don't update hash on failure — next run will retry this key.
      newHashes[key] = existingHashes[key] ?? '';
    }
  }

  saveProgress(en, newHashes);

  console.log(`\nTranslated: ${translated}, unchanged: ${unchanged}, errors: ${errors}`);
  if (failedKeys.length > 0) {
    console.error('\nFailed keys (re-run `npm run i18n:sync` to retry):');
    failedKeys.forEach((k) => console.error(`  - ${k}`));
  }
  if (errors > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
