#!/usr/bin/env node
/**
 * The Two-Curl arbitrage test, batched.
 *
 * Naver only builds autocomplete branches for terms with real query volume, so a
 * Korean term with many branches and an empty English array is measured evidence
 * that demand exists in Korea and no English site has established the term.
 *
 * IMPORTANT — this measures DEMAND ONLY. It says nothing about SUPPLY. An empty
 * English array means nobody searches the romanization; it does not mean nobody has
 * written the story. The W31 짜르르 case failed exactly there: 0 English branches,
 * but Korea Herald, Korea Times and Stripes Korea had already covered the angle in
 * English. Every seed that passes here still has to clear the coverage gate by hand.
 *
 * Usage: node scripts/two-curl.mjs seeds.json
 *        seeds.json = [{ ko: "냉동김밥", en: ["frozen gimbap", "naengdong gimbap"] }, ...]
 */
import { readFileSync } from 'node:fs';

const seeds = JSON.parse(readFileSync(process.argv[2] || 'seeds.json', 'utf8'));

const NAVER = (q) =>
  `https://ac.search.naver.com/nx/ac?q=${encodeURIComponent(q)}&st=100&r_format=json&r_enc=UTF-8&frm=nv`;
const GOOGLE = (q) =>
  `https://suggestqueries.google.com/complete/search?client=firefox&hl=en&q=${encodeURIComponent(q)}`;

// Commercial modifiers are the strongest branch signal: they mean people are not
// asking what the thing is, they are deciding whether to buy it.
const COMMERCIAL = ['가격', '후기', '편의점', '칼로리', '어디서', '파는곳', '추천', '맛', '판매', '리뷰'];

async function get(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const t = await r.text();
  try { return JSON.parse(t); } catch { return null; }
}

async function naverBranches(q) {
  const j = await get(NAVER(q));
  const items = j?.items?.[0] ?? [];
  return items.map((x) => (Array.isArray(x) ? x[0] : x)).filter(Boolean);
}

async function googleBranches(q) {
  const j = await get(GOOGLE(q));
  return Array.isArray(j?.[1]) ? j[1] : [];
}

const rows = [];
for (const s of seeds) {
  const kr = await naverBranches(s.ko);
  const enSets = [];
  for (const e of s.en) enSets.push({ q: e, list: await googleBranches(e) });
  const enMax = Math.max(...enSets.map((x) => x.list.length));
  const commercial = kr.filter((b) => COMMERCIAL.some((c) => b.includes(c)));

  let verdict;
  if (kr.length >= 8 && enMax === 0) verdict = 'GAP — coverage gate next';
  else if (kr.length >= 8 && enMax <= 3) verdict = 'closing — coverage gate mandatory';
  else if (kr.length >= 8) verdict = 'too late — compete on specificity or skip';
  else verdict = `weak KR signal (${kr.length})`;

  rows.push({ ...s, kr, krN: kr.length, commercial, enSets, enMax, verdict });
  await new Promise((r) => setTimeout(r, 400));
}

rows.sort((a, b) => (a.enMax - b.enMax) || (b.krN - a.krN));

for (const r of rows) {
  console.log(`\n■ ${r.ko}  —  ${r.verdict}`);
  console.log(`   KR 가지 ${r.krN}개${r.commercial.length ? ` (상업어 ${r.commercial.length}: ${r.commercial.slice(0, 5).join(', ')})` : ''}`);
  if (r.krN) console.log(`   ${r.kr.slice(0, 8).join(' · ')}`);
  for (const e of r.enSets) console.log(`   EN "${e.q}": ${e.list.length}개${e.list.length ? ' — ' + e.list.slice(0, 4).join(' · ') : ''}`);
}
console.log(`\n총 ${rows.length}개 씨앗 / GAP ${rows.filter((r) => r.verdict.startsWith('GAP')).length}개`);
