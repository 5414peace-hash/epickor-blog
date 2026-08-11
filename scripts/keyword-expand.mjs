#!/usr/bin/env node
/**
 * The demand half of the keyword gate: romanization check + Two-Curl, batched.
 *
 *   node scripts/keyword-expand.mjs --seeds .tmp/seeds.json
 *   node scripts/keyword-expand.mjs --en "samgak kimbap" --ko 삼각김밥
 *
 * docs/keyword-selection-playbook.md §5.1 has asked for this script since
 * 2026-07-31 and it was never written, so every cycle has been re-typing curl
 * commands. It does not decide anything — it collects the four readings a human
 * then judges.
 *
 * Order matters and is not the obvious one. §4.1b: measure the ROMANIZATION
 * BEFORE Naver. W33 lost 6 of 31 seeds to romanization pollution alone
 * (`mychew` -> chewy.com, `matbam` -> matbao, `dezawa` -> stem-cell papers),
 * and that verdict costs one request. Confirming Korean demand first and then
 * dying on the handle wastes the Korean lookup.
 *
 * Readings, per seed:
 *   1. EN autocomplete on the romanization   — is there an English handle at all?
 *   2. EN autocomplete on a descriptive phrase — the fallback handle (§4.1b)
 *   3. Template expansion on whichever handle lives — shape-classified (§1.1, §2)
 *   4. Naver autocomplete on the Hangul       — Korean demand (§4.1)
 *
 * Caveats worth remembering while reading the output:
 *   - Naver truncates at 10. Ten is a CEILING, not a strength score (§4.1c) —
 *     read the branches, do not compare counts.
 *   - `gl=` is ignored; suggestions key off the requesting IP. Run from Seoul,
 *     get Korea-IP suggestions. Do not call these US results (§1.1).
 *   - Shallow English autocomplete is not a dead topic. Our best-converting
 *     query has two suggestions and 14.75% CTR (§1.1).
 */
import fs from 'node:fs';

const args = {};
for (let i = 2; i < process.argv.length; i += 1) {
  if (process.argv[i].startsWith('--')) { args[process.argv[i].slice(2)] = process.argv[i + 1] ?? true; }
}

const UA = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function google(q) {
  const url = `https://www.google.com/complete/search?client=chrome&hl=en&q=${encodeURIComponent(q)}`;
  try {
    const r = await fetch(url, { headers: UA });
    const j = JSON.parse(await r.text());
    return j[1] ?? [];
  } catch { return null; }
}

async function naver(q) {
  const url = `https://ac.search.naver.com/nx/ac?q=${encodeURIComponent(q)}&st=100&r_format=json&r_enc=UTF-8&frm=nv`;
  try {
    const r = await fetch(url, { headers: UA });
    const j = JSON.parse(await r.text());
    return (j.items?.[0] ?? []).map((x) => x[0]);
  } catch { return null; }
}

/** §2.3 marker table. Classification only — the human still reads them. */
function shape(kw) {
  const s = kw.toLowerCase();
  if (/\b(meaning|means|definition|what does|artinya|significado)\b/.test(s)) return 'definitional';
  if (/\b(where to buy|near me|price|cheap|for sale|order|delivery|coupon|discount|buy)\b/.test(s)) return 'retail';
  if (/\b(vs|versus|or |difference|better than|compared to)\b/.test(s)) return 'comparison';
  if (/\b(how to|how do|how does|instructions|why is|why do|why are)\b/.test(s)) return 'mechanism';
  if (/\b(worth it|actually|really|is it good)\b/.test(s)) return 'experience';
  if (/\breddit\b/.test(s)) return 'reddit-flag';
  return 'other';
}

const TEMPLATES = ['what is', 'why is', 'how to eat', 'is', ''];

async function run(seed) {
  const out = { ...seed };
  out.romanization = await google(seed.en);
  await sleep(260);
  out.descriptive = seed.desc ? await google(seed.desc) : null;
  await sleep(260);

  const handle = (out.romanization?.length ?? 0) > 0 ? seed.en : seed.desc;
  out.handle = handle;
  out.expanded = [];
  if (handle) {
    for (const t of TEMPLATES) {
      const q = t ? `${t} ${handle}` : `${handle} `;
      const res = await google(q);
      for (const kw of res ?? []) out.expanded.push(kw);
      await sleep(240);
    }
    out.expanded = [...new Set(out.expanded)];
  }
  out.naver = await naver(seed.ko);
  await sleep(300);
  return out;
}

const seeds = args.seeds
  ? JSON.parse(fs.readFileSync(args.seeds, 'utf8'))
  : [{ en: args.en, ko: args.ko, desc: args.desc }];

const results = [];
for (const s of seeds) {
  const r = await run(s);
  results.push(r);

  const en = r.romanization;
  const de = r.descriptive;
  console.log(`\n${'='.repeat(78)}\n${s.ko}  /  ${s.en}${s.desc ? `  /  "${s.desc}"` : ''}`);
  console.log(`  EN(romanization) ${en === null ? 'ERROR' : `${en.length} — ${en.slice(0, 6).join(' · ') || '(empty)'}`}`);
  if (de) console.log(`  EN(descriptive)  ${de.length} — ${de.slice(0, 6).join(' · ') || '(empty)'}`);
  console.log(`  KR(naver)        ${r.naver === null ? 'ERROR' : `${r.naver.length} — ${r.naver.slice(0, 8).join(' · ') || '(empty)'}`}`);

  const keep = r.expanded.filter((k) => ['comparison', 'mechanism', 'experience'].includes(shape(k)));
  const kill = r.expanded.filter((k) => ['definitional', 'retail'].includes(shape(k)));
  if (keep.length) console.log(`  winnable shapes  ${keep.slice(0, 8).map((k) => `${k} [${shape(k)}]`).join('\n                   ')}`);
  if (kill.length) console.log(`  auto-reject      ${kill.length} (${[...new Set(kill.map(shape))].join(', ')})`);
}

const dest = args.out ?? '.tmp/keyword-expand.json';
fs.writeFileSync(dest, `${JSON.stringify(results, null, 1)}\n`);
console.log(`\nwrote ${dest}\nNaver 10 = ceiling, not strength — read branches, don't compare counts.`);
