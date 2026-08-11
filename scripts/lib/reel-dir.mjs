/**
 * Resolve a reel slug to its dated folder name.
 *
 * One reel is one folder: `output/reels/YYYY-MM-DD_{slug}/`, holding the working
 * files at its root and the delivered package under `final/`. Every script still
 * takes the plain `--slug cheonggyecheon`; this is what turns that into
 * `2026-08-11_cheonggyecheon`.
 *
 * A slug with no folder yet is a new reel and gets today's date, which is why new
 * work cannot accidentally land undated.
 *
 * There used to be a second tree at `output/final/reels/`, merged away on
 * 2026-08-11 — it sat inside the blog-post finals directory (`166_final.md`, ...),
 * which is what made a reel's files feel like they lived in two unrelated places.
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
