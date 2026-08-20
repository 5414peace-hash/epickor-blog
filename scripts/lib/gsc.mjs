/**
 * Shared GSC reading helpers.
 *
 * Two things here exist because both were learned the hard way on 2026-08-20.
 *
 * 1. `parseCsv` is a real RFC4180 parser. A naive one that treats every `"` as a
 *    toggle and discards it will silently merge distinct queries: GSC exports
 *    `"hongdae station" "underground shopping mall"` (a quote-operator search)
 *    and `hongdae station underground shopping mall` (a plain search) as
 *    different rows, but stripping the quotes collapses them into one string.
 *    The symptom is the same query appearing two or three times with different
 *    impressions — which is what first exposed the bug.
 *
 * 2. `isOperatorQuery` marks searches nobody typed by hand. Quote operators at
 *    scale are rank trackers and scrapers, and they do not click, so their rows
 *    look like "great position, zero clicks" — a fake opportunity. Post 074 held
 *    2,459 such impressions and was very nearly rewritten on the strength of
 *    them. Site-wide contamination is only ~1%, but it is concentrated, so it
 *    has to be filtered per page rather than waved off as noise.
 */
import fs from 'node:fs';
import path from 'node:path';

/** RFC4180: inside a quoted field, `""` is one literal quote. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cur = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"') {
        if (text[i + 1] === '"') { cur += '"'; i++; } else { quoted = false; }
      } else cur += ch;
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(cur); cur = ''; }
    else if (ch === '\n') { row.push(cur); rows.push(row); row = []; cur = ''; }
    else if (ch !== '\r') cur += ch;
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
  const header = rows.shift();
  if (!header) return [];
  return rows
    .filter((r) => r.length === header.length)
    .map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])));
}

/**
 * A search a person did not type. Quote operators are the one reliable tell.
 *
 * A trailing-year rule was considered and rejected: 074's scraped cluster did
 * carry `... 2023` / `... june 2023` forms, but the same shape covers real,
 * converting queries elsewhere on the site — `drakor terbaru 2026` ranks 1.4 and
 * earns clicks on 167. Filtering by year would delete demand we are winning in
 * order to catch a pattern quote-matching already catches.
 */
export function isOperatorQuery(q) {
  return q.includes('"');
}

export function slugFromUrl(url) {
  const m = /epickor\.com\/(blog|business)\/([^/?#]+)/.exec(url || '');
  return m ? { section: m[1], slug: decodeURIComponent(m[2]) } : null;
}

/** Newest API pull of a given dimension stem, e.g. 'page' or 'query-page'. */
export function newestApiPull(stem, dir = 'output/gsc/api') {
  if (!fs.existsSync(dir)) return null;
  const re = new RegExp(`^${stem}_(\\d{4}-\\d{2}-\\d{2})_(\\d{4}-\\d{2}-\\d{2})\\.csv$`);
  const found = fs.readdirSync(dir)
    .map((f) => { const m = re.exec(f); return m ? { file: path.join(dir, f), start: m[1], end: m[2] } : null; })
    .filter(Boolean)
    .sort((a, b) => a.end.localeCompare(b.end));
  return found.length ? found[found.length - 1] : null;
}
