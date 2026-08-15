#!/usr/bin/env node
/**
 * Find queries Google already shows us for, that no post is actually written about.
 *
 * This is the cheapest kind of topic evidence we have. An impression means Google
 * has already decided the site is a plausible answer; if no post targets that query,
 * the impressions are landing on something written for a different purpose, which is
 * exactly the shape that produces high impressions and near-zero clicks.
 *
 * Deliberately NOT ranked by impressions alone. CLAUDE.md's own measurement says
 * volume is the wrong axis — `ahjussi` has 20,585 impressions at 0.058% CTR while
 * `korean convenience store breakfast` has 61 at 14.75%. So rows are scored by
 * whether the query looks like someone about to DO something, and definition-shaped
 * queries are pushed down rather than surfaced as opportunities.
 *
 * Usage: node scripts/gsc-gap.mjs [--min-impr 40] [--top 40]
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const num = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i === -1 ? d : Number(args[i + 1]);
};
const MIN_IMPR = num('min-impr', 40);
const TOP = num('top', 40);

const dirs = readdirSync('output/gsc').filter((d) => d.includes('Performance-on-Search')).sort();
const latest = join('output/gsc', dirs[dirs.length - 1]);
console.log(`추출본: ${dirs[dirs.length - 1]}\n`);

function rows(file) {
  const txt = readFileSync(join(latest, file), 'utf8').replace(/^﻿/, '');
  const [head, ...body] = txt.trim().split(/\r?\n/);
  const cols = head.split(',');
  return body.map((line) => {
    // Queries can contain commas inside quotes.
    const parts = line.match(/("([^"]|"")*"|[^,]*)(,|$)/g).map((s) => s.replace(/,$/, '').replace(/^"|"$/g, ''));
    const o = {};
    cols.forEach((c, i) => (o[c.trim()] = parts[i]));
    return o;
  });
}

const q = rows('검색어 수.csv');
const kQ = Object.keys(q[0]);
const [QK, CK, IK] = [kQ[0], kQ[1], kQ[2]];

// Words that mark a query as definitional — Google answers these in the snippet, so
// impressions there never convert. Measured on our own data, not assumed.
const DEF = /\b(meaning|means|what is|what are|definition|explained|artinya|adalah|significado|의미|뜻)\b/i;
// Words that mark someone mid-task.
const ACT = /\b(how to|where|buy|order|price|cost|near|best|vs|versus|compare|worth|should i|guide|itinerary|open|hours|book|reserve|tips)\b/i;

// Everything the site already writes about, as a bag of words per post title/slug.
const posts = readdirSync('content/blog').filter((f) => f.endsWith('.md'));
const corpus = posts.map((f) => {
  const t = readFileSync(join('content/blog', f), 'utf8').slice(0, 1200).toLowerCase();
  const title = (t.match(/^title:\s*"([^"]+)"/m) || [, ''])[1];
  const desc = (t.match(/^description:\s*"([^"]+)"/m) || [, ''])[1];
  return { f, blob: `${title} ${desc}`.toLowerCase() };
});

const STOP = new Set(['the', 'a', 'an', 'in', 'of', 'to', 'for', 'and', 'is', 'are', 'korea', 'korean', 'seoul', 'you', 'your', 'with', 'on', 'at', 'do', 'does']);

function covered(query) {
  const terms = query.toLowerCase().split(/[^a-z0-9가-힣]+/).filter((w) => w.length > 2 && !STOP.has(w));
  if (!terms.length) return true;
  // A post "covers" the query when its title/description carries most of the
  // distinctive terms. Matching one term is not coverage — that is how a snack
  // list ends up counted as a post about one snack.
  return corpus.some((p) => terms.filter((t) => p.blob.includes(t)).length >= Math.max(2, Math.ceil(terms.length * 0.7)));
}

const gaps = q
  .map((r) => ({
    query: r[QK],
    clicks: Number(r[CK] || 0),
    impr: Number(r[IK] || 0),
  }))
  .filter((r) => r.impr >= MIN_IMPR && !DEF.test(r.query) && !covered(r.query))
  .map((r) => ({
    ...r,
    ctr: r.impr ? (100 * r.clicks) / r.impr : 0,
    action: ACT.test(r.query),
  }))
  .sort((a, b) => (b.action - a.action) || (b.impr - a.impr));

console.log(`행동형 우선, 노출 ${MIN_IMPR}+ , 정의형 제외, 기존 글 미커버\n`);
console.log('행동형 | 노출  | 클릭 | CTR   | 쿼리');
for (const g of gaps.slice(0, TOP)) {
  console.log(
    `${g.action ? '  ✔  ' : '     '} | ${String(g.impr).padStart(5)} | ${String(g.clicks).padStart(4)} | ${g.ctr.toFixed(2).padStart(5)}% | ${g.query}`,
  );
}
console.log(`\n총 ${gaps.length}건 (행동형 ${gaps.filter((g) => g.action).length}건)`);
