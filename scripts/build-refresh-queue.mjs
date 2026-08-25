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
 * ── Second lane added 2026-08-20: `push` ──────────────────────────────────
 * The spec lane above answers exactly one question — "which food-ish post is
 * missing spec markers?" — and by 2026-08-20 it had answered it: 31 entries
 * left, all tier 3, the leftovers the spec fits worst.
 *
 * Worse, it was structurally blind to the site's best work. Two lines did it:
 * the `!specApplied` filter drops a post the moment it has ₩ and Hangul, and the
 * food filter never admits a non-food post at all. So `071` (refreshed 07-31,
 * therefore "done") sat with **8,259 impressions parked at position 4-9** and
 * never appeared, and neither did `181` or `043`, which are not food.
 *
 * The push lane asks a different question: **which published page already has a
 * large impression pool sitting just off the top of page one?** That is where a
 * refresh actually converts — site-wide CTR is 1.53% at positions 1-3 and 0.14%
 * at 5-11, and 87% of impressions sit below position 5.
 *
 * It reads the query×page cross-tab and **discards quote-operator queries first**.
 * Without that filter this lane's top recommendation would be 074, whose 2,459
 * bot impressions look exactly like a great opportunity. See scripts/lib/gsc.mjs.
 *
 * Run: node scripts/build-refresh-queue.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseCsv, isOperatorQuery, slugFromUrl, newestApiPull } from './lib/gsc.mjs';

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
  '278': '2026-08-07', '074': '2026-08-07',
  '140': '2026-08-08', '223': '2026-08-08', '174': '2026-08-08', '250': '2026-08-08',
  '282': '2026-08-08', '279': '2026-08-08', '277': '2026-08-08', '335': '2026-08-08', '093': '2026-08-08',
};

const FOOD_TAG = /KoreanSnacks|ConvenienceStore|StreetFood|KoreanFood|KoreanRamyun|KoreanDrinks|KoreanPantry|Dosirak|KoreaAtHome/i;
const FOOD_TITLE = /snack|ramyun|ramyeon|ramen|noodle|chip|convenience|candy|biscuit|cookie|drink|soda|cider|milk|tea|bread|bun|kimbap|tteokbokki|chicken|dessert|ice cream|street food|pantry|sauce|seaweed|yogurt|coffee/i;

/**
 * Pages the push lane must never recommend.
 *
 * Kept explicit with reasons, the same way EXCLUDE is, so the next reader can
 * see what the impression pool is made of instead of rediscovering it.
 */
const PUSH_EXCLUDE = {
  '090': 'dead-end 정의형 (CLAUDE.md) — 4위에서도 CTR 0.3%대',
  '082': 'dead-end 정의형 (CLAUDE.md)',
  '210': 'dead-end 정의형 (CLAUDE.md)',
  '301': 'dead-end 정의형 (CLAUDE.md)',
  '074': '노출의 68.7%가 따옴표 연산자(봇). 사람 쿼리만 남기면 4~9위 노출 268개뿐 — 2026-08-20 실측',
  '181': '최대 풀이 `naver webtoon`/`naver series` — 네이버로 가려는 내비게이셔널 쿼리다. 우리 글이 1위여도 클릭되지 않는다',
};

/**
 * Push work already done; recorded so the lane does not re-recommend it.
 *
 * The baseline goes in the note, because this file's own numbers are overwritten
 * by the next GSC pull — which is the pull the work has to be judged against.
 */
const PUSH_WORKED = {
  '071': '2026-08-20 내부링크 3→11. 기준선: `deli manjoo` 3,336노출 7.0위 0.36% / `delimanjoo` 2,564노출 7.5위 0.27%. 판정 9/23, **순위로** (오타 쿼리 제외). 상세 output/strategy/071-internal-link-experiment.md',
  '153': '2026-08-25 사실 갱신. 기준선(90일): 79쿼리 2,057노출 14클릭, 클러스터 전체가 8.9~10.8위 — `isaac toast sauce` 1,105노출 9.2위 / `where to buy` 179노출 10.8위이지만 CTR 2.8%로 이미 전환 중 / `isaac toast jam` 168노출 8.9위 클릭 0. 넣은 것: 2026-04 해외 전용 수출 결정과 그 이유(가맹점 매출 보호 — 국내 미판매의 진짜 원인), 브랜드 과일잼 출시 계획(jam 쿼리에 직결), 아마존 US 부재 재검증. 판정 9/23, **순위로**.',
  '167': '2026-08-20 사실 리프레시. 기준선: 891쿼리 3,821노출 52클릭(1.36%), 4~9위 전환가능 874노출·20클릭. 원더풀스·기리고를 미공개로 잘못 서술한 것을 정정하고 8월 신작 2편(이런 엿같은 사랑·들쥐) 추가. 판정 9/23.',
};

/** Impressions below this are too small for a refresh to move anything. */
const PUSH_MIN_IMPRESSIONS = 250;

/**
 * Query shape, and why the push lane weighs by it.
 *
 * Ranking a page higher only pays if the demand underneath it converts at all.
 * Measured 2026-08-20 on this site, holding rank constant inside the 4-9 band
 * and excluding the four dead-end pages so 090's 42k `ahjussi meaning`
 * impressions could not carry the result:
 *
 *   행동형 (where/how/vs/buy/price…)  2,039 impr  1.324%   → 1.089% after removing top 3
 *   중립   (product and place names)  20,023 impr  0.664%   → 0.615%
 *   why형  (why is/why do…)            2,571 impr  0.156%   → 0.000%
 *   정의형 (meaning/what is/explained) 1,662 impr  0.060%   → 0.000%
 *
 * The remove-top-3 column is the point: action and neutral survive it, while
 * definitional and why-shaped demand collapses to literally zero clicks. That is
 * the same thing CLAUDE.md has said since 2026-07-31, now measured at controlled
 * rank rather than inferred from raw totals.
 *
 * Per-query median is not reported because it is 0.000% for every shape — most
 * individual queries have zero clicks at this granularity, so the median cannot
 * separate them. Aggregate plus remove-top-N is the usable test here.
 *
 * Known blind spot: shape is judged from wording, and a bare noun reads as
 * neutral even when the intent is definitional — `ahjussi` is the example, which
 * is exactly why the dead-end pages need PUSH_EXCLUDE and cannot be caught by
 * regex alone.
 */
const SHAPE_DEFINITIONAL = /\bmeaning\b|\bwhat is\b|\bwhat does\b|\bwho is\b|\bwhat are\b|\bexplained\b|artinya|adalah|apa itu|significado|\bdefinition\b/;
const SHAPE_WHY = /^why\b|\bwhy (is|are|do|does|did)\b/;

/**
 * Market, and why it belongs next to shape (added 2026-08-25).
 *
 * Shape asks whether demand converts to a click. This asks whether the click
 * can convert to money, and the two are independent. Measured on `167`
 * (Best Korean Dramas): 3,664 impressions at CTR 1.42%, three times the site
 * average, and the push lane ranked it 2nd. But 65% of its impressions are
 * non-English -- Arabic, Russian, Bengali, Spanish, Indonesian -- and the
 * queries actually converting at rank 1-3 are `series coreanas 2026` and the
 * Arabic equivalent. Pushing that page higher buys traffic that cannot reach
 * amazon.com. CLAUDE.md has recorded the same for Indonesian since 2026-07-24
 * (29,442 impressions, 1 click); this generalises it to every market.
 *
 * Non-Latin script is the reliable signal. The word list only covers
 * Latin-script languages that share our alphabet, and is deliberately short --
 * only terms that cannot appear in an English query.
 */
const FOREIGN_SCRIPT = /[؀-ۿЀ-ӿऀ-ॿঀ-৿฀-๿぀-ヿ一-鿿가-힯]/;
const FOREIGN_WORDS = /(itu apa|apa itu|artinya|arti|adalah|bahasa|drakor|terbaru|nonton|sub indo|romantis|coreana|coreano|coreanas|mejores|melhores|significado|signification|bedeutung|migliori|meilleur)/i;

function isForeignMarket(query) {
  return FOREIGN_SCRIPT.test(query) || FOREIGN_WORDS.test(query);
}

function isConvertible(query) {
  const q = query.toLowerCase();
  return !SHAPE_DEFINITIONAL.test(q) && !SHAPE_WHY.test(q);
}

/**
 * Per-page impressions sitting at position 4-9, counting human queries only.
 *
 * Position 4-9 is the band a refresh can realistically move and where the payoff
 * is steepest. Above it we already convert; below 11 a single refresh rarely
 * closes the gap.
 *
 * Caveat worth knowing when reading the numbers: the cross-tab only contains
 * queries Google is willing to name, and 77% of this site's clicks come from
 * anonymised long-tail it will not. So these pools are a consistent *sample*,
 * fine for ranking pages against each other, wrong as absolute demand.
 *
 * Second caveat, measured 2026-08-25 and worse than the first: a site-wide
 * `query,page` pull hits the API's 25,000-row ceiling. The pull taken that day
 * carried 302 of the site's ~1,900 clicks and looked complete. The truncation
 * keeps the highest-impression rows, so it is biased *towards* the dead-end
 * pages this lane is trying to avoid. Ranking pages against each other still
 * works; any single page's numbers should be re-pulled with
 * `gsc-fetch.mjs --dimension query --page blog/{slug}`, which filters
 * server-side and returns the full list.
 */
function loadPushSignal() {
  const pull = newestApiPull('query-page');
  if (!pull) return { pages: {}, source: null, dropped: 0 };
  const pages = {};
  let dropped = 0;
  for (const r of parseCsv(fs.readFileSync(pull.file, 'utf8'))) {
    const hit = slugFromUrl(r.page);
    if (!hit || hit.section !== 'blog') continue;
    const impressions = +r.impressions || 0;
    if (isOperatorQuery(r.query || '')) { dropped += impressions; continue; }
    const position = +r.position || 0;
    const p = (pages[hit.slug] ||= {
      band49: 0, convertible49: 0, foreign49: 0, clicks49: 0, queries49: 0,
      humanImpressions: 0, foreignImpressions: 0,
    });
    const foreign = isForeignMarket(r.query || '');
    p.humanImpressions += impressions;
    if (foreign) p.foreignImpressions += impressions;
    if (position >= 4 && position <= 9) {
      p.band49 += impressions;
      if (foreign) p.foreign49 += impressions;
      // convertible now means two things: the shape converts to a click, and
      // that click can reach a market we monetise. A foreign-market query fails
      // the second test even when its shape passes the first.
      if (isConvertible(r.query || '') && !foreign) p.convertible49 += impressions;
      p.clicks49 += +r.clicks || 0;
      p.queries49 += 1;
    }
  }
  for (const p of Object.values(pages)) {
    p.foreignShare = p.band49 ? +(p.foreign49 / p.band49).toFixed(3) : 0;
    // deadShare stays 'share of shape that does not convert', but measured on
    // the English remainder so the two numbers do not double-count each other.
    const english49 = p.band49 - p.foreign49;
    p.deadShare = english49 ? +(1 - p.convertible49 / english49).toFixed(3) : 0;
  }
  return { pages, source: `${pull.file} (${pull.start}~${pull.end})`, dropped };
}

/** Newest GSC page export wins; the folder name carries the pull date. */
function loadGsc() {
  const api = newestApiPull('page');
  if (api) {
    const rows = {};
    for (const r of parseCsv(fs.readFileSync(api.file, 'utf8'))) {
      const hit = slugFromUrl(r.page);
      if (!hit) continue;
      rows[hit.slug] = {
        clicks: +r.clicks || 0,
        impressions: +r.impressions || 0,
        ctr: r.ctr,
        position: +r.position || null,
      };
    }
    return { rows, source: `${api.file} (${api.start}~${api.end})` };
  }
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
const prevStatus = Object.fromEntries(
  [...(prev.queue || []), ...(prev.push || [])].map((r) => [r.slug, r]),
);
const { rows: gsc, source: gscSource } = loadGsc();
const { pages: pushSignal, source: pushSource, dropped: operatorImpressions } = loadPushSignal();

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
  // Non-food posts used to be dropped here outright, which is why the push lane
  // could never see 181 or 043. They are kept now and simply excluded from the
  // spec lane, which is the only lane the food filter was ever about.
  const inSpecLane = tier < 3 || isFood;

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
    inSpecLane,
    excluded: EXCLUDE[slug] || null,
    refreshedOn: ALREADY_REFRESHED[slug] || null,
    specApplied,
    gaps,
    gsc: gsc[slug] || null,
    push: pushSignal[slug] || null,
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
  .filter((p) => p.inSpecLane && !p.excluded && !p.specApplied)
  .sort((a, b) => a.tier - b.tier
    || (b.gsc?.impressions || 0) - (a.gsc?.impressions || 0)
    || (b.gsc?.clicks || 0) - (a.gsc?.clicks || 0)
    || a.slug.localeCompare(b.slug));

/**
 * The push lane. Ordered purely by the 4-9 impression pool — no tiers, because
 * the question here is not "what kind of post is this" but "where is Google
 * already showing us to a lot of people just below the fold".
 *
 * `specApplied` is deliberately ignored: 071 is spec-complete and was still the
 * site's single largest opportunity.
 */
const push = posts
  .filter((p) => (p.push?.convertible49 || 0) >= PUSH_MIN_IMPRESSIONS && !PUSH_EXCLUDE[p.slug])
  .sort((a, b) => b.push.convertible49 - a.push.convertible49 || a.slug.localeCompare(b.slug))
  .map((p) => ({
    slug: p.slug,
    title: p.title,
    convertible49: p.push.convertible49,
    band49Impressions: p.push.band49,
    deadShare: p.push.deadShare,
    foreignShare: p.push.foreignShare,
    band49Clicks: p.push.clicks49,
    band49Queries: p.push.queries49,
    humanImpressions: p.push.humanImpressions,
    sitePosition: p.gsc?.position ?? null,
    specApplied: p.specApplied,
    workedOn: PUSH_WORKED[p.slug] || null,
    status: PUSH_WORKED[p.slug] ? 'worked' : (prevStatus[p.slug]?.status === 'worked' ? 'worked' : 'pending'),
    note: prevStatus[p.slug]?.note || null,
  }));

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
  pushLane: {
    rule: `4~9위에 걸린 노출 중 **전환 가능한 형태**(행동형·중립)만 세어 내림차순. 최소 ${PUSH_MIN_IMPRESSIONS}. 스펙 완료 여부를 보지 않는다 — 071이 스펙 완료 상태로 사이트 최대 기회였다.`,
    shapeEvidence: '4~9위로 순위를 통제하고 dead-end 4편을 제외한 실측(2026-08-20): 행동형 1.324%(상위3 제거 후 1.089%) · 중립 0.664%(0.615%) · why형 0.156%(0.000%) · 정의형 0.060%(0.000%). 정의형과 why형은 상위 3개를 빼면 클릭이 정확히 0이므로 순위를 올려도 회수되지 않는다.',
    deadShare: 'deadShare는 그 페이지 4~9위 영어 노출 중 정의형·why형 비중이다. 높으면 노출이 커도 올릴 값어치가 없다.',
    foreignShare: 'foreignShare는 4~9위 노출 중 비영어 시장 비중이다 (2026-08-25 신설). 높으면 순위를 올려도 아마존에 닿지 않는 트래픽만 늘어난다 — 167이 65%였다.',
    sourceTruncation: '경고: query,page 교차추출은 API의 25,000행 상한에 걸린다. 2026-08-25 실측으로 사이트 클릭 1,900 중 302만 담겼다. 절단은 무작위가 아니라 고노출 행을 남기므로 dead-end 페이지 쪽으로 편향된다. 한 페이지를 정밀하게 보려면 gsc-fetch.mjs --dimension query --page blog/{slug} 로 따로 뽑을 것.',
    why: '스펙 레인은 "무엇이 빠졌나"를 묻고 이 레인은 "구글이 이미 어디서 우리를 많이 보여주고 있나"를 묻는다. 사이트 CTR은 1~3위 1.53%인데 5~11위는 0.14%이고, 노출의 87%가 5위 밖에 있다.',
    caveat: '교차표에는 구글이 이름을 공개하는 쿼리만 있다. 이 사이트 클릭의 77%는 익명 롱테일에서 오므로, 이 수치는 페이지끼리 줄 세우기에는 맞지만 절대 수요로 읽으면 틀린다.',
    source: pushSource,
    operatorImpressionsDropped: operatorImpressions,
    excluded: PUSH_EXCLUDE,
  },
  counts: {
    pending: queue.length,
    tier1: queue.filter((p) => p.tier === 1).length,
    tier2: queue.filter((p) => p.tier === 2).length,
    tier3: queue.filter((p) => p.tier === 3).length,
    alreadyRefreshed: Object.keys(ALREADY_REFRESHED).length,
    excluded: Object.keys(EXCLUDE).length,
    pushPending: push.filter((p) => p.status === 'pending').length,
  },
  queue: queue.map(({ excluded, inSpecLane, push: _p, ...r }) => r),
  push,
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(`${OUT}`);
console.log(`GSC: ${gscSource || 'none found'}`);

console.log(`\n── 스펙 레인 ${queue.length}편 (tier1 ${out.counts.tier1}, tier2 ${out.counts.tier2}, tier3 ${out.counts.tier3}) — "무엇이 빠졌나"`);
for (const p of queue.slice(0, 8)) {
  const c = p.gsc ? `${String(p.gsc.impressions).padStart(5)} impr ${String(p.gsc.clicks).padStart(2)}c` : '   no gsc   ';
  console.log(`  T${p.tier} ${p.slug}  ${c}  ₩${String(p.gaps.won).padStart(2)} 한글${String(p.gaps.hangul).padStart(3)}${p.gaps.yearInTitle ? ' [연도]' : '       '}  ${p.title.slice(0, 50)}`);
}
if (out.counts.tier1 === 0 && out.counts.tier2 === 0) {
  console.log('  ⚠ tier 1·2 소진 — 남은 것은 스펙이 가장 안 맞는 문화 설명글이다. 푸시 레인을 먼저 볼 것.');
}

const pushPending = push.filter((p) => p.status === 'pending');
console.log(`\n── 푸시 레인 ${pushPending.length}편 — "구글이 어디서 우리를 4~9위로 보여주고 있나"`);
console.log(`   ${pushSource || 'query-page API 추출본 없음 — node scripts/gsc-pull.mjs --dimensions query,page'}`);
if (operatorImpressions) console.log(`   따옴표 연산자(봇) 노출 ${operatorImpressions.toLocaleString()}개 제외됨`);
for (const p of pushPending.slice(0, 10)) {
  const dead = p.deadShare >= 0.2 ? `정의형${String(Math.round(p.deadShare * 100)).padStart(3)}%` : '          ';
  console.log(`  ${p.slug}  ${String(p.convertible49).padStart(5)} 전환가능 /${String(p.band49Impressions).padStart(5)} 전체  ${String(p.band49Clicks).padStart(2)}c  ${dead}  ${p.title.slice(0, 42)}`);
}
for (const p of push.filter((x) => x.status === 'worked')) {
  console.log(`  ${p.slug}  [작업됨] ${p.workedOn || ''}`);
}
