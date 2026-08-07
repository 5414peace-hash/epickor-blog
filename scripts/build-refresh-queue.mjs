/**
 * Build content/data/refresh-queue.json — the standing list of published posts
 * waiting for a 제품 글 스펙 v1 refresh.
 *
 * Why this file exists: CLAUDE.md has stated the refresh *order* since
 * 2026-07-31 ("음식-구체 먼저, 그다음 클릭 상위 30편") but nobody ever wrote the
 * list. So every session re-derived it with an ad-hoc script, the count moved
 * each time (20 one day, 56 the next, depending on the regex), and the two
 * refreshes on 2026-08-06 were pulled from the click-top group instead of the
 * food lane without anyone noticing the order had been skipped.
 *
 * Design: **tiers are editorial, gaps are measured.**
 *   - TIER1/TIER2 are explicit slug lists, because "is this a product post or a
 *     culture post" is a judgement a regex cannot make. Everything else that
 *     matches the food filter falls to tier 3.
 *   - The gap columns (₩, Hangul, year stamp, word count) are read from the
 *     files every run, so a post drops out of the queue when it is actually
 *     fixed rather than when someone remembers to tick it off.
 *   - `status` is preserved from the previous queue file, so manual notes and
 *     deliberate skips survive regeneration.
 *
 * Run: node scripts/build-refresh-queue.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'content/data/refresh-queue.json';

/** Named product/brand posts — spec v1 applies literally. */
const TIER1 = ['219', '277', '278', '279', '250', '335', '128', '281', '282', '093', '259'];

/** Place and action posts — the spec lands as prices, hours, exits. */
const TIER2 = [
  '258', '255', '270', '288', '315', '087', '311', '267', '263', '254', '062',
  // 2026-08-07 sweep: the food filter blinded the queue to the site's largest
  // unworked action-shape impression pools. These are traveler/shopping/
  // transaction pages (not food), impressions >= 1,500 in the 08-07 pull,
  // no content refresh on record — last commits were link retags and image
  // fixes only. Definitional "why/meaning" pages from the same sweep (043,
  // 055, 135, 166, 014, 008, 011, 137, 181) were deliberately NOT added.
  '074', // Seoul underground shopping malls — 9,613i / 0.11% / p8.1; unanswered hongik-station cluster
  '140', // public toilets in Korea — 6,644i / 0.41%
  '170', // PC bang count/prices/rules — 5,610i / 0.34%
  '174', // Seoul subway etiquette — 2,650i / 0.45%
  '227', // shipping Korea→US, 15% duty — 2,435i / 0.33%; transaction shape
  '223', // e-Arrival vs K-ETA — 2,298i / 1.09% p12; entry rules churn, "still true?" gate applies
  '175', // Namdaemun vs Dongdaemun — 1,975i / 0.25% p12.2
  '233', // KBO game in Seoul — 1,621i / 0.37%; season runs through October
];

/**
 * Caught by the food filter but not food. Kept explicit rather than silently
 * filtered so the next reader can see the filter's known blind spots.
 */
const EXCLUDE = {
  '261': 'semiconductors — matched on "chip" in "AI Chips"',
  '265': 'semiconductors — matched on "chip"',
  '260': 'home appliance (rice cookers), not a food product',
  '287': 'home appliance (grills), not a food product',
};

/** Refreshed before this queue existed; recorded so they are not re-picked. */
const ALREADY_REFRESHED = {
  '071': '2026-07-31', '171': '2026-07-31', '220': '2026-07-31', '059': '2026-07-31',
  '048': '2026-07-31', '038': '2026-07-31', '029': '2026-07-31', '280': '2026-07-31',
  '153': '2026-07-31', '032': '2026-07-31', '083': '2026-07-31', '018': '2026-07-31',
  '089': '2026-07-31', '172': '2026-07-31',
  '198': '2026-08-04', '200': '2026-08-04', '275': '2026-08-06', '274': '2026-08-06',
  '259': '2026-08-06', '128': '2026-08-07', '219': '2026-08-07', '281': '2026-08-07',
  '278': '2026-08-07',
};

const FOOD_TAG = /KoreanSnacks|ConvenienceStore|StreetFood|KoreanFood|KoreanRamyun|KoreanDrinks|KoreanPantry|Dosirak|KoreaAtHome/i;
const FOOD_TITLE = /snack|ramyun|ramyeon|ramen|noodle|chip|convenience|candy|biscuit|cookie|drink|soda|cider|milk|tea|bread|bun|kimbap|tteokbokki|chicken|dessert|ice cream|street food|pantry|sauce|seaweed|yogurt|coffee/i;

/** Newest GSC page export wins; the folder name carries the pull date. */
function loadGsc() {
  const root = 'output/gsc';
  if (!fs.existsSync(root)) return { rows: {}, source: null };
  const dirs = fs.readdirSync(root).filter((d) => /Performance-on-Search-\d{4}-\d{2}-\d{2}$/.test(d)).sort();
  for (const dir of dirs.reverse()) {
    const csv = path.join(root, dir, '페이지.csv');
    if (!fs.existsSync(csv)) continue;
    const rows = {};
    for (const line of fs.readFileSync(csv, 'utf8').split(/\r?\n/).slice(1)) {
      const [url, clicks, impr, ctr, pos] = line.split(',');
      const m = /\/blog\/([^/?#]+)/.exec(url || '');
      if (!m) continue;
      rows[m[1]] = { clicks: +clicks || 0, impressions: +impr || 0, ctr, position: +pos || null };
    }
    return { rows, source: `${csv} (${dir.slice(-10)})` };
  }
  return { rows: {}, source: null };
}

const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : { queue: [] };
const prevStatus = Object.fromEntries((prev.queue || []).map((r) => [r.slug, r]));
const { rows: gsc, source: gscSource } = loadGsc();

const posts = [];
for (const f of fs.readdirSync('content/blog')) {
  if (!f.endsWith('.md')) continue;
  const text = fs.readFileSync(`content/blog/${f}`, 'utf8');
  const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!fm) continue;
  const get = (k) => (new RegExp(`^${k}:\\s*"?(.*?)"?\\s*$`, 'm').exec(fm[1]) || [, ''])[1].trim();
  const slug = get('slug');
  const title = get('title');
  if (!slug) continue;

  const tier = TIER1.includes(slug) ? 1 : TIER2.includes(slug) ? 2 : 3;
  const isFood = FOOD_TAG.test((/^tags:.*$/m.exec(fm[1]) || [''])[0]) || FOOD_TITLE.test(title);
  if (tier === 3 && !isFood) continue;

  const won = (text.match(/₩/g) || []).length;
  const hangul = new Set(text.match(/[가-힣]+/g) || []).size;
  const gaps = {
    won,
    hangul,
    yearInTitle: /\b20\d{2}\b/.test(title),
    words: text.split(/\s+/).length,
  };
  // A post leaves the queue when the two objectively checkable spec markers are
  // present. The other three (Korean-source fact, on-the-ground detail, honest
  // counter-info) cannot be measured, so they stay a human check.
  const specApplied = won > 0 && hangul >= 3;

  posts.push({
    slug,
    title,
    tier,
    excluded: EXCLUDE[slug] || null,
    refreshedOn: ALREADY_REFRESHED[slug] || null,
    specApplied,
    gaps,
    gsc: gsc[slug] || null,
    status: prevStatus[slug]?.status || (specApplied ? 'done' : 'pending'),
    note: prevStatus[slug]?.note || null,
  });
}

/**
 * Sort within a tier by impressions, not clicks.
 *
 * Clicks top out at 7 across this entire queue, so click-ordering is noise —
 * it cannot tell 52 posts apart. Impressions measure how many people Google is
 * already showing the page to, which is the actual leverage a refresh acts on:
 * 263 has 459 impressions at 1.31% CTR and real headroom; 277 has 12.
 *
 * This does not violate CLAUDE.md's "시계열 비교는 클릭으로만" rule. That rule
 * exists because Google over-counted impressions from 2025-05-13 to 2026-04 and
 * bans comparing impressions *across time*. Ranking pages inside one export is
 * a different operation, and the 2026-07-24 pull is outside the buggy window.
 */
const queue = posts
  .filter((p) => !p.excluded && !p.specApplied)
  .sort((a, b) => a.tier - b.tier
    || (b.gsc?.impressions || 0) - (a.gsc?.impressions || 0)
    || (b.gsc?.clicks || 0) - (a.gsc?.clicks || 0)
    || a.slug.localeCompare(b.slug));

const out = {
  generatedAt: new Date().toISOString().slice(0, 10),
  generator: 'scripts/build-refresh-queue.mjs',
  rule: 'CLAUDE.md 실행계획 챕터 1 — 하루 리듬 "신규 2편 + 리프레시 1편". 순서: tier 1 → 2 → 3, 각 tier 안에서는 GSC 노출 내림차순 (이 큐 전체의 클릭 최대값이 7이라 클릭은 정렬 신호가 되지 못한다).',
  gate: '스펙 적용 전에 "이 글이 아직 사실인가"를 먼저 검사한다 (CLAUDE.md 2026-08-04 신설). 4회 연속 그쪽이 더 값어치 있었다.',
  gscSource,
  tiers: {
    1: '제품·브랜드 이름이 나오는 글 — 스펙 v1이 그대로 적용된다',
    2: '장소·행동 글 — 스펙이 가격·영업시간·출구번호로 착지한다',
    3: '음식이 나오지만 실은 문화 설명글 — 스펙이 잘 맞지 않아 후순위',
  },
  excluded: EXCLUDE,
  counts: {
    pending: queue.length,
    tier1: queue.filter((p) => p.tier === 1).length,
    tier2: queue.filter((p) => p.tier === 2).length,
    tier3: queue.filter((p) => p.tier === 3).length,
    alreadyRefreshed: Object.keys(ALREADY_REFRESHED).length,
    excluded: Object.keys(EXCLUDE).length,
  },
  queue: queue.map(({ excluded, ...r }) => r),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(`${OUT}: ${queue.length} pending (tier1 ${out.counts.tier1}, tier2 ${out.counts.tier2}, tier3 ${out.counts.tier3})`);
console.log(`GSC: ${gscSource || 'none found'}\n`);
for (const p of queue.slice(0, 12)) {
  const c = p.gsc ? `${String(p.gsc.impressions).padStart(5)} impr ${String(p.gsc.clicks).padStart(2)}c` : '   no gsc   ';
  console.log(`  T${p.tier} ${p.slug}  ${c}  ₩${String(p.gaps.won).padStart(2)} 한글${String(p.gaps.hangul).padStart(3)}${p.gaps.yearInTitle ? ' [연도]' : '       '}  ${p.title.slice(0, 52)}`);
}
