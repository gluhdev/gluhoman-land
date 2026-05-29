/**
 * Per-room photo galleries.
 *
 * Maps `${hotel}:${slug}` to an ordered list of image URLs that exist on disk
 * under /public/images. Verified against the filesystem.
 *
 * Rooms without a dedicated photo folder (central + brewery rooms) fall back to
 * the single cover image passed in by the caller.
 */

/** Build /images/<base>/<n>.jpg for each n in `nums`. */
function build(base: string, nums: number[]): string[] {
  return nums.map((n) => `/images/${base}/${n}.jpg`);
}

/** Inclusive integer range [from, to]. */
function range(from: number, to: number): number[] {
  const out: number[] = [];
  for (let n = from; n <= to; n++) out.push(n);
  return out;
}

/**
 * Curated galleries keyed by `${hotel}:${slug}`.
 * Arrays are emitted as literal URL lists (built once at module load).
 */
const GALLERIES: Record<string, string[]> = {
  // ── Aquapark hotel ───────────────────────────────────────────────
  "aquapark:lux-balcony": build("hotels/aquapark/lux-balcony", range(8, 18)),
  "aquapark:standard-aqua": build("hotels/aquapark/standard-aqua", range(19, 28)),
  "aquapark:standard-balcony": build("hotels/aquapark/standard-balcony", range(29, 34)),
  "aquapark:standard-twin": build("hotels/aquapark/standard-twin", range(35, 38)),
  "aquapark:lux-attic": build("hotels/aquapark/lux-attic", range(39, 46)),
  "aquapark:standard-basic": build("hotels/aquapark/standard-basic", range(47, 51)),

  // ── Cottages ─────────────────────────────────────────────────────
  // NOTE: yaga has no 3.jpg on disk.
  "cottages:yaga": build("cottages/yaga", [1, 2, 4, 5, 6, 7, 8, 9, 10]),
  "cottages:lisovyk": build("cottages/lisovyk", range(1, 9)),
  "cottages:teremok": build("cottages/teremok", range(1, 8)),
  "cottages:terem-lux": build("cottages/terem-lux", range(1, 10)),
};

/**
 * Return the curated photo gallery for a room.
 *
 * @param hotel  hotel slug (e.g. "aquapark", "cottages")
 * @param slug   room-category slug (e.g. "lux-balcony")
 * @param cover  single cover image used as fallback for rooms without a folder
 * @returns ordered list of image URLs; falls back to `[cover]` (or `[]`)
 */
export function roomGallery(
  hotel: string | undefined,
  slug: string | undefined,
  cover?: string,
): string[] {
  if (hotel && slug) {
    const curated = GALLERIES[`${hotel}:${slug}`];
    if (curated && curated.length > 0) return curated;
  }
  return cover ? [cover] : [];
}
