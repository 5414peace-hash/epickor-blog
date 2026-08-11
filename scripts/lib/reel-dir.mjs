/**
 * Resolve a reel slug to its dated folder name.
 *
 * Reel folders are `YYYY-MM-DD_{slug}` under both `output/reels/` and
 * `output/final/reels/`, so the two trees key on the same string and a reel's
 * working files and its delivered file sort together and by date. Every script
 * still takes the plain `--slug cheonggyecheon`; this is what turns that into
 * `2026-08-11_cheonggyecheon`.
 *
 * `output/reels/` is the register: the folder that exists there decides the date,
 * and `output/final/reels/` follows it. A slug with no folder yet is a new reel and
 * gets today's date, which is why new work cannot accidentally land undated.
 *
 * NOTE `public/assets/reels/` is deliberately NOT dated. It is the runtime asset
 * root that rendered compositions resolve `staticFile()` against, and every finished
 * reel's manifest already stores `assets/reels/{slug}/media/...`. Renaming it would
 * invalidate all of those at once for no gain — the browsing problem this solves is
 * in `output/`, not in a directory nobody opens by hand.
 */
import fs from 'node:fs';
import path from 'node:path';

const DATED = /^\d{4}-\d{2}-\d{2}_/;
const REGISTER = path.join(process.cwd(), 'output', 'reels');
const cache = new Map();

export function reelFolder(slug, { create = true } = {}) {
  if (!slug) return slug;
  if (DATED.test(slug)) return slug;
  if (cache.has(slug)) return cache.get(slug);

  let hit;
  try {
    // Exact segment match, not endsWith: `_drinks` would otherwise match
    // `2026-08-05_hub-drinks`.
    hit = fs.readdirSync(REGISTER).find((n) => DATED.test(n) && n.slice(11) === slug);
  } catch { /* register missing on a fresh checkout */ }

  const resolved = hit ?? (create ? `${new Date().toISOString().slice(0, 10)}_${slug}` : slug);
  cache.set(slug, resolved);
  return resolved;
}

export default reelFolder;
