#!/usr/bin/env node
/**
 * Which hub rows answer a question in one line and link no post?
 *
 *   node scripts/audit-hub-gaps.mjs
 *
 * A hub states an answer for every row it lists. When a row carries a `slug` it
 * routes the reader to a post that answers properly; when it does not, the hub
 * is the only answer that exists. Those rows are the cluster's real gaps, and
 * unlike a brainstorm they are measured.
 *
 * Found on 2026-08-11, against /convenience-store: 14 of 17 rows already had a
 * post. The three that did not — 1+1/2+1, parcels and ATMs, opening hours —
 * became the spoke list, and the exercise also killed a "convenience-store
 * sandwich" proposal, because the sandwich price row already pointed at 171.
 */
import fs from 'node:fs';
// A hub row that answers a question in one line and links no post is a spoke
// that does not exist yet. That is a measurable gap list, not a guess.
const src = fs.readFileSync('lib/convenience-store.ts', 'utf8');
for (const [name, re] of [
  ['HOW_TO', /export const HOW_TO[\s\S]*?\n\];/],
  ['PRICES', /export const PRICES[\s\S]*?\n\];/],
]) {
  const block = src.match(re)?.[0] ?? '';
  const rows = block.split(/\n  \{/).slice(1);
  console.log(`\n=== ${name}: ${rows.length} rows`);
  for (const r of rows) {
    const label = r.match(/(?:thing|item|name): '([^']+)'/)?.[1] ?? '?';
    const ans = r.match(/(?:answer|price): '([^']+)'/)?.[1] ?? '';
    const slug = r.match(/slug: '([^']+)'/)?.[1];
    console.log(`  ${slug ? `-> ${slug}`.padEnd(9) : '   NO POST'.padEnd(9)}  ${label.padEnd(26)} ${ans.slice(0, 44)}`);
  }
}
