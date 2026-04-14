import 'server-only';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';

export type ContentType = 'text' | 'richtext' | 'image' | 'number' | 'url';

export interface ContentEntry {
  key: string;
  type: ContentType;
  value: string | number | null;
  updatedAt: string;
}

/**
 * Load all site content into a Map once per render. Per-request cached
 * via React.cache so multiple <EditableText>/<EditableImage> nodes on
 * one page hit the DB exactly once.
 */
export const loadAllContent = cache(async (): Promise<Map<string, ContentEntry>> => {
  try {
    const rows = await prisma.siteContent.findMany();
    const map = new Map<string, ContentEntry>();
    for (const row of rows) {
      let parsed: string | number | null = null;
      try {
        parsed = JSON.parse(row.value);
      } catch {
        parsed = row.value;
      }
      map.set(row.key, {
        key: row.key,
        type: row.type as ContentType,
        value: parsed,
        updatedAt: row.updatedAt.toISOString(),
      });
    }
    return map;
  } catch {
    // Table may not exist yet during initial deploy — fall back to empty
    return new Map();
  }
});

export async function getContent(key: string): Promise<ContentEntry | undefined> {
  const map = await loadAllContent();
  return map.get(key);
}

export async function getText(key: string, fallback: string): Promise<string> {
  const entry = await getContent(key);
  if (!entry) return fallback;
  return typeof entry.value === 'string' ? entry.value : fallback;
}

export async function getImage(key: string, fallback: string): Promise<string> {
  const entry = await getContent(key);
  if (!entry) return fallback;
  return typeof entry.value === 'string' && entry.value.length > 0 ? entry.value : fallback;
}
