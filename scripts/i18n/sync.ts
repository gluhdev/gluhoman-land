import { Translator } from 'deepl-node';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { applyPreGlossary, applyPostGlossary } from './glossary';

const ROOT = resolve(__dirname, '../..');
const UK_PATH = resolve(ROOT, 'messages/uk.json');
const EN_PATH = resolve(ROOT, 'messages/en.json');
const HASHES_PATH = resolve(ROOT, 'messages/.hashes.json');

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

async function translate(uk: string): Promise<string> {
  const { output, used } = applyPreGlossary(uk);
  const result = await translator.translateText(output, 'uk', 'en-US', {
    preserveFormatting: true,
  });
  return applyPostGlossary(result.text, used);
}

async function main() {
  if (!existsSync(UK_PATH)) {
    console.error(`Source missing: ${UK_PATH}`);
    process.exit(1);
  }
  const uk = JSON.parse(readFileSync(UK_PATH, 'utf-8')) as Json;
  const en = existsSync(EN_PATH) ? (JSON.parse(readFileSync(EN_PATH, 'utf-8')) as Json) : {};
  const hashes = existsSync(HASHES_PATH)
    ? (JSON.parse(readFileSync(HASHES_PATH, 'utf-8')) as Record<string, string>)
    : {};

  const flat = flatten(uk);
  const flatEn = flatten(en);
  const newHashes: Record<string, string> = {};

  let translated = 0;
  let unchanged = 0;
  let errors = 0;

  for (const [key, ukValue] of Object.entries(flat)) {
    const hash = sha1(ukValue);
    newHashes[key] = hash;

    const isNew = !(key in flatEn);
    const sourceChanged = hashes[key] !== hash;

    if (!isNew && !sourceChanged) {
      unchanged++;
      continue;
    }

    try {
      console.log(`→ ${key}`);
      const enValue = await translate(ukValue);
      setNested(en, key, enValue);
      translated++;
    } catch (err) {
      console.error(`  ✗ ${key}: ${(err as Error).message}`);
      errors++;
    }
  }

  writeFileSync(EN_PATH, JSON.stringify(en, null, 2) + '\n');
  writeFileSync(HASHES_PATH, JSON.stringify(newHashes, null, 2) + '\n');

  console.log(`\nTranslated: ${translated}, unchanged: ${unchanged}, errors: ${errors}`);
  if (errors > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
