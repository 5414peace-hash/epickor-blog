#!/usr/bin/env node
/**
 * Find posts where the reader is close to buying but the affiliate link is cheap.
 *
 * Why this exists. On 2026-08-15 the whole link database was measured: 78 links,
 * highest price $29.99, median $18.99, **zero items over $50**. Post `260` is a
 * 2,761-word Korean rice-cooker buying guide — Cuckoo vs Cuchen, pressure vs basic,
 * what size to get — and its links point at a rice measuring cup and a bare Amazon
 * search. A reader arriving to spend $300 was being handed a $12 accessory.
 *
 * Commission is `price × category rate`, and the rate swings 10x, so neither term
 * can be read alone:
 *   Luxury Beauty 10% · Kitchen/Household 4.5% · Electronics 1-2%
 *   Health & Personal Care 1% · Grocery 1%
 * A $150 ginseng box at 1% pays less than a $40 pan at 4.5%. Ranking by price alone
 * would put ginseng first and be wrong.
 *
 * The script does not guess prices for /dp/ links it has no record of — it reports
 * them as unknown rather than inventing a number.
 *
 * Usage: node scripts/audit-affiliate-value.mjs [--top 25]
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const TOP = (() => {
  const i = process.argv.indexOf('--top');
  return i === -1 ? 25 : Number(process.argv[i + 1]);
})();

// Category rates, secondary-sourced 2026-08-15 and NOT yet confirmed against
// Amazon's own schedule. Treat as ranking guidance, not as a payout calculation.
const RATE = {
  'Luxury Beauty': 0.10, Handmade: 0.10,
  Kitchen: 0.045, Home: 0.045, Books: 0.045, Shopping: 0.045,
  Beauty: 0.03, Fashion: 0.04, Grooming: 0.03,
  Culture: 0.04, Music: 0.03, Stationery: 0.03, Heritage: 0.03, Travel: 0.03,
  Coffee: 0.01, Food: 0.01, Grocery: 0.01, Electronics: 0.015,
};

const links = (() => {
  const d = JSON.parse(readFileSync('content/data/amazon-links.json', 'utf8'));
  const arr = Array.isArray(d) ? d : (d.products || d.links || Object.values(d).flat());
  const byAsin = new Map();
  for (const p of arr) {
    const asin = (String(p.url || '').match(/\/dp\/([A-Z0-9]{10})/) || [])[1];
    const price = parseFloat(String(p.price || '').replace(/[^\d.]/g, '')) || 0;
    if (asin) byAsin.set(asin, { price, category: p.category || '', name: p.name || '' });
  }
  return byAsin;
})();

// Language that means the reader is choosing a product, not reading about culture.
const INTENT = [
  /\bworth it\b/i, /\bbuying (guide|checklist)\b/i, /\bwhich (one|model|brand)\b/i,
  /\bvs\.?\b/i, /\bcompare\b/i, /\bwhat size\b/i, /\bhow much (does|is)\b/i,
  /\bbefore you buy\b/i, /\bshould you buy\b/i, /\bbest\b/i, /\bguide\b/i,
];

const rows = [];
for (const file of readdirSync('content/blog').filter((f) => f.endsWith('.md'))) {
  const raw = readFileSync(join('content/blog', file), 'utf8');
  const title = (raw.match(/^title:\s*"([^"]+)"/m) || [, ''])[1];
  const words = raw.split(/\s+/).length;

  const urls = raw.match(/https:\/\/www\.amazon\.com\/[^\s")]+/g) || [];
  if (!urls.length) continue;

  let search = 0, dp = 0, known = 0, best = 0, bestName = '', bestCat = '';
  for (const u of urls) {
    if (u.includes('/s?k=')) { search++; continue; }
    const asin = (u.match(/\/dp\/([A-Z0-9]{10})/) || [])[1];
    if (!asin) continue;
    dp++;
    const rec = links.get(asin);
    if (!rec) continue;
    known++;
    const value = rec.price * (RATE[rec.category] ?? 0.03);
    if (value > best) { best = value; bestName = rec.name; bestCat = rec.category; }
  }

  // Intent measured on the title plus the section headings — that is where a
  // buying guide announces itself.
  const heads = (raw.match(/^##\s.+$/gm) || []).join(' ');
  const intent = INTENT.filter((r) => r.test(`${title} ${heads}`)).length;
  if (!intent) continue;

  rows.push({
    slug: file.replace(/\.md$/, '').slice(0, 12),
    title: title.slice(0, 46),
    words,
    urls: urls.length,
    search,
    dp,
    known,
    best,
    bestName: bestName.slice(0, 30),
    bestCat,
    intent,
  });
}

// Worst first: strong buying intent, nothing valuable linked.
rows.sort((a, b) => (b.intent - a.intent) || (a.best - b.best) || (b.words - a.words));

console.log('구매의도 있는 글의 제휴 링크 실태 (최대 기대수수료 낮은 순)\n');
console.log('의도 | 단어  | 링크(검색/상품) | 최대기대수수료 | 글');
for (const r of rows.slice(0, TOP)) {
  const val = r.known ? `$${r.best.toFixed(2)}` : '알수없음';
  console.log(
    ` ${String(r.intent).padStart(2)}  | ${String(r.words).padStart(5)} | ` +
    `${String(r.urls).padStart(2)} (${r.search}/${r.dp})`.padEnd(15) +
    ` | ${val.padStart(9)}${r.bestCat ? ' ' + r.bestCat : ''}`.padEnd(22) +
    ` | ${r.slug} ${r.title}`,
  );
}

const noDp = rows.filter((r) => r.dp === 0).length;
const searchOnly = rows.filter((r) => r.search > 0 && r.dp === 0).length;
console.log(`\n구매의도 글 ${rows.length}편`);
console.log(`  상품 링크가 하나도 없는 글: ${noDp}편 (그중 검색 링크만 거는 글 ${searchOnly}편)`);
console.log(`  가격을 아는 상품이 하나라도 걸린 글: ${rows.filter((r) => r.known > 0).length}편`);
