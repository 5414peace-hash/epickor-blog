/**
 * Shared machinery for before/after measurement of an editorial intervention.
 *
 * WHY THIS IS A LIBRARY
 * ─────────────────────
 * `cluster-baseline.mjs` was written first, for the convenience-store hub. When
 * the refresh programme needed the same treatment, copying the file would have
 * duplicated logic that had already been wrong twice in one afternoon:
 *
 *   - matching a control group on outcome alone, which paired brand-new posts
 *     against two-year-old ones and would have reported ordinary indexing
 *     growth as an intervention effect;
 *   - computing the noise floor from a total the comparison did not rest on,
 *     which buried a real +10 on a base of 12 under a ±17 threshold.
 *
 * Both fixes live here once. A second copy would have drifted from them.
 *
 * MEASUREMENT RULES (CLAUDE.md)
 * ─────────────────────────────
 * Compare CLICKS across time. Google confirmed an impressions over-reporting
 * bug from 2025-05-13 to ~April 2026, so impressions and CTR are recorded for
 * context and must not be trended.
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const GSC_DIR = join(ROOT, 'output', 'gsc');

/* ─────────── post index ───────────
   Filenames come in two shapes: `171.md` and `059-discover-the-tastiest-....md`.
   Only the `slug:` frontmatter field is authoritative, because GSC URLs are
   /blog/059, not /blog/059-discover-.... Indexing off filenames alone once
   reported six of the oldest convenience-store posts as brand new.
   Frontmatter also uses both quote styles: slug: "171" and slug: '003'. */
export const POSTS = (() => {
  const dir = join(ROOT, 'content', 'blog');
  const index = new Map();
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const text = readFileSync(join(dir, file), 'utf8');
    const slug = text.match(/^slug:\s*['"]?([^'"\n]+)['"]?/m)?.[1]?.trim()
      ?? file.match(/^(\d+)/)?.[1];
    if (!slug) continue;
    index.set(slug, {
      file,
      date: text.match(/^date:\s*['"]?(\d{4}-\d{2}-\d{2})/m)?.[1] ?? null,
      visibility: text.match(/^visibility:\s*['"]?(\w+)/m)?.[1] ?? 'public',
    });
  }
  return index;
})();

export const publishedAt = (slug) => POSTS.get(slug)?.date ?? null;
export const allSlugs = () =>
  [...POSTS.entries()].filter(([, p]) => p.visibility === 'public').map(([s]) => s);

/* ─────────── GSC extracts ─────────── */
export function latestExtract() {
  const dirs = readdirSync(GSC_DIR).filter((d) => d.includes('Performance-on-Search')).sort();
  if (!dirs.length) throw new Error('no GSC extract under output/gsc/');
  return join(GSC_DIR, dirs[dirs.length - 1]);
}

export const extractDate = (dir) => dir.match(/(\d{4}-\d{2}-\d{2})$/)?.[1] ?? 'unknown';

/** The chart CSV carries the actual covered range, which the folder name does not. */
export function windowOf(dir) {
  const rows = readFileSync(join(dir, '차트.csv'), 'utf8').trim().split(/\r?\n/).slice(1);
  const days = rows.map((r) => r.split(',')[0]).filter(Boolean);
  return { from: days[0], to: days[days.length - 1], days: days.length };
}

/** slug -> {clicks, impressions, ctr, position} for every /blog/{n} page. */
export function pageStats(dir) {
  const rows = readFileSync(join(dir, '페이지.csv'), 'utf8').trim().split(/\r?\n/).slice(1);
  const out = new Map();
  for (const row of rows) {
    const [url, clicks, impressions, ctr, position] = row.split(',');
    const m = url?.match(/\/blog\/(\d+)\/?$/);
    if (!m) continue;
    out.set(m[1], {
      clicks: Number(clicks) || 0,
      impressions: Number(impressions) || 0,
      ctr,
      position: Number(position) || 0,
    });
  }
  return out;
}

/* ─────────── matched control ───────────
   Matched on TWO axes, outcome then publication age, in that priority.

   Age is not a refinement. Matching on clicks alone once paired twelve
   zero-click treatment posts against the twelve oldest posts on the site, while
   ten of the treatment posts had been published within the previous six weeks.
   Brand-new posts climb on indexing alone, so six weeks later that ordinary
   maturation would have read as an intervention effect.

   Greedy from the highest baseline down, so the scarce high-click controls get
   allocated before they are used up. Deterministic: same inputs, same pairs. */
export function matchControls(treatment, pool, stats, dateOf = publishedAt) {
  const clicks = (s) => stats.get(s)?.clicks ?? 0;
  const day = (s) => (dateOf(s) ? Date.parse(dateOf(s)) / 86400000 : 0);
  const available = [...pool];
  const pairs = [];

  for (const t of [...treatment].sort((a, b) => clicks(b) - clicks(a))) {
    let best = null;
    let bestScore = [Infinity, Infinity];
    for (const c of available) {
      const score = [Math.abs(clicks(c) - clicks(t)), Math.abs(day(c) - day(t))];
      if (score[0] < bestScore[0] || (score[0] === bestScore[0] && score[1] < bestScore[1])) {
        bestScore = score;
        best = c;
      }
    }
    if (!best) continue;
    available.splice(available.indexOf(best), 1);
    pairs.push({
      treatment: t,
      control: best,
      treatmentClicks: clicks(t),
      controlClicks: clicks(best),
      treatmentDate: dateOf(t),
      controlDate: dateOf(best),
      ageGapDays: Math.round(bestScore[1]),
    });
  }
  return pairs;
}

export const sum = (xs) => xs.reduce((a, b) => a + b, 0);

/**
 * Two-sided noise threshold for a difference-in-differences.
 *
 * MUST be passed the base the comparison actually rests on, not a larger total
 * that happens to be nearby. Using a group total dominated by one post inflates
 * this and hides real movement: computed from 76 it reads ±17, which in a
 * rehearsal buried a genuine +10 measured against a base of 12.
 */
export const noiseFloor = (base) => Math.sqrt(Math.max(base, 1)) * 2;

/** Count of members earning at least one click — immune to concentration in one member. */
export const liveCount = (slugs, stats) =>
  slugs.filter((s) => (stats.get(s)?.clicks ?? 0) > 0).length;
