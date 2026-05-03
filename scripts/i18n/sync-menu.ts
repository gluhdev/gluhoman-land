/**
 * sync-menu.ts — Translates menu.json item names and descriptions to English via DeepL.
 *
 * For each item in src/data/menu.json:
 *  - If name_en is missing or the source Ukrainian name has changed (hash mismatch), translate it.
 *  - If description_en is missing or description changed, translate it.
 *  - Saves progress every SAVE_EVERY items.
 *  - Retries on DeepL rate-limit errors with exponential backoff.
 *
 * Usage: npm run i18n:sync:menu
 * Requires: DEEPL_API_KEY in .env.local
 */

import { Translator, type DeepLError } from 'deepl-node';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { applyPreGlossary, applyPostGlossary } from './glossary';

const ROOT = resolve(__dirname, '../..');
const MENU_PATH = resolve(ROOT, 'src/data/menu.json');
const HASHES_PATH = resolve(ROOT, 'messages/.menu-hashes.json');

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

interface MenuItem {
  id: string;
  name: string;
  name_en?: string;
  description?: string;
  description_en?: string;
  price: number;
  weight?: string;
  image?: string;
  tags?: string[];
}

interface MenuCategory {
  id: string;
  name: string;
  icon?: string;
  items: MenuItem[];
}

interface Menu {
  categories: MenuCategory[];
}

function sha1(s: string): string {
  return createHash('sha1').update(s).digest('hex');
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
      console.error(`  rate-limited, retrying in ${backoff}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
      await sleep(backoff);
    }
  }
  throw lastErr;
}

function saveProgress(menu: Menu, hashes: Record<string, string>): void {
  writeFileSync(MENU_PATH, JSON.stringify(menu, null, 2) + '\n');
  writeFileSync(HASHES_PATH, JSON.stringify(hashes, null, 2) + '\n');
}

async function main() {
  if (!existsSync(MENU_PATH)) {
    console.error(`Menu data missing: ${MENU_PATH}`);
    process.exit(1);
  }

  const menu = JSON.parse(readFileSync(MENU_PATH, 'utf-8')) as Menu;
  const existingHashes = existsSync(HASHES_PATH)
    ? (JSON.parse(readFileSync(HASHES_PATH, 'utf-8')) as Record<string, string>)
    : {};
  const newHashes: Record<string, string> = { ...existingHashes };

  let translated = 0;
  let unchanged = 0;
  let errors = 0;
  let sinceLastSave = 0;
  const failedItems: string[] = [];

  // Write partial progress on SIGINT/SIGTERM
  const writeOnExit = () => saveProgress(menu, newHashes);
  process.on('SIGINT', () => { writeOnExit(); process.exit(130); });
  process.on('SIGTERM', () => { writeOnExit(); process.exit(143); });

  for (const category of menu.categories) {
    for (const item of category.items) {
      const nameHashKey = `${item.id}:name`;
      const descHashKey = `${item.id}:description`;

      const nameHash = sha1(item.name);
      const needsNameTranslation =
        !item.name_en ||
        item.name_en === '' ||
        existingHashes[nameHashKey] !== nameHash;

      if (needsNameTranslation) {
        try {
          console.log(`→ [name] ${item.id}: ${item.name}`);
          item.name_en = await translateWithRetry(item.name);
          newHashes[nameHashKey] = nameHash;
          translated++;
          sinceLastSave++;
          await sleep(REQUEST_INTERVAL_MS);
        } catch (err) {
          const msg = (err as Error).message;
          console.error(`  x [name] ${item.id}: ${msg}`);
          errors++;
          failedItems.push(`${item.id}:name`);
          newHashes[nameHashKey] = existingHashes[nameHashKey] ?? '';
        }
      } else {
        newHashes[nameHashKey] = nameHash;
        unchanged++;
      }

      if (item.description) {
        const descHash = sha1(item.description);
        const needsDescTranslation =
          !item.description_en ||
          item.description_en === '' ||
          existingHashes[descHashKey] !== descHash;

        if (needsDescTranslation) {
          try {
            console.log(`→ [desc] ${item.id}`);
            item.description_en = await translateWithRetry(item.description);
            newHashes[descHashKey] = descHash;
            translated++;
            sinceLastSave++;
            await sleep(REQUEST_INTERVAL_MS);
          } catch (err) {
            const msg = (err as Error).message;
            console.error(`  x [desc] ${item.id}: ${msg}`);
            errors++;
            failedItems.push(`${item.id}:description`);
            newHashes[descHashKey] = existingHashes[descHashKey] ?? '';
          }
        } else {
          newHashes[descHashKey] = descHash;
          unchanged++;
        }
      }

      if (sinceLastSave >= SAVE_EVERY) {
        saveProgress(menu, newHashes);
        sinceLastSave = 0;
        console.log(`  [saved progress]`);
      }
    }
  }

  saveProgress(menu, newHashes);

  console.log(`\nTranslated: ${translated}, unchanged: ${unchanged}, errors: ${errors}`);
  if (failedItems.length > 0) {
    console.error('\nFailed items (re-run `npm run i18n:sync:menu` to retry):');
    failedItems.forEach((k) => console.error(`  - ${k}`));
  }
  if (errors > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
