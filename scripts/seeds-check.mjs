/**
 * seeds-check — walk the field and see which seeds came up.
 *
 * WHY THIS EXISTS
 * ───────────────
 * Measured 2026-08-21 (`output/strategy/breakout-prediction_2026-08-21.md`):
 *
 *   1. Nothing knowable *before* publishing separates a winner from a corpse.
 *      Title length 1.01x, proper nouns in title 1.02x, word count 1.11x,
 *      category no split at all. The median post returns 0 clicks and the top
 *      10 pages carry 45.5% of all clicks. Picking the next 델리만주 on purpose
 *      is not a strategy that exists.
 *
 *   2. But the outcome is already decided by week 4-8, and it is readable.
 *      On fully disjoint windows (early = snapshot ending 2026-07-08, late =
 *      2026-08-01..08-18) Spearman was 0.630, and:
 *
 *        early clicks   n    mean clicks in August
 *        ────────────────────────────────────────
 *              0        33          0.06
 *              1        12          1.17
 *            2-3         8          1.75
 *            4-9        14          2.21
 *            10+         8          4.75
 *
 *      The cliff is between 0 and 1 — a 20x jump — not between 1 and 2. So the
 *      rule is binary: **any click at all means alive; zero means dormant.**
 *
 *   3. Dormant posts do not revive when you work on them. Eight genuinely-old
 *      zero-click posts were refreshed between 2026-07-28 and 08-14 and
 *      returned **0 clicks**. Seventeen posts that already had clicks returned
 *      71. That is the waste this script exists to stop.
 *
 * Nobody was reading the week-4 number, which is why refresh effort kept
 * landing on corpses. `refresh-queue.json` sorts by impressions inside each
 * tier — sound reasoning (clicks top out at 7 there, so clicks cannot *rank*
 * the queue) but it lets high-impression zero-click pages keep arriving at the
 * front. The fix is not a different sort. It is a **filter**, and this is it.
 *
 * WHAT IT MEASURES
 * ────────────────
 * Not "clicks during days 28-56 of this post's life" — GSC gives us a window,
 * not a per-post timeline. It measures **recent clicks for posts old enough to
 * have been judged**, which is the same question asked a way we can answer:
 *
 *   - the post must have been published at least LAG_DAYS before the data
 *     window opens, so we are never scoring a post for the weeks Google had
 *     not indexed it yet;
 *   - and no more than MAX_AGE_DAYS before the window closes, so the list stays
 *     a nursery rather than the whole archive.
 *
 * Run:
 *   node scripts/seeds-check.mjs            # read the newest pull on disk
 *   node scripts/seeds-check.mjs --pull     # fetch fresh GSC data first
 *   node scripts/seeds-check.mjs --all      # ignore the age window, judge everything
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseCsv, slugFromUrl } from './lib/gsc.mjs';

const OUT = 'content/data/seed-check.json';

/**
 * Definitional dead ends. CLAUDE.md forbids further investment in these by name
 * — they rank well, carry enormous impression pools and convert at ~0.1%,
 * because Google answers the question in the snippet.
 *
 * They are listed here because the first version of this script recommended
 * `301` and `210` on its very first run. Ranking by impressions walked straight
 * into the same trap `refresh-queue.json` is in. A standing decision by the
 * representative is not something a script gets to re-derive.
 */
const DEAD_END = new Set(['090', '082', '210', '301']);

/**
 * The shape of a dead end, so a *new* one gets flagged without waiting for
 * someone to add it to the list above: a large audience that does not click.
 */
const isImpressionHeavy = (p) => p.impressions >= 1000 && p.clicks / p.impressions < 0.005;

/** Days after publishing before a post's silence means anything. */
const LAG_DAYS = 14;
/** Past this age a post is no longer a seedling; it belongs to the archive. */
const MAX_AGE_DAYS = 84;
/** How many posts to nominate for work each run. */
const WATER_COUNT = 3;
/** Do not nominate the same post again within this many days. */
const COOLDOWN_DAYS = 45;

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const arg = (f, d = null) => { const i = args.indexOf(f); return i === -1 ? d : (args[i + 1] ?? d); };

// ── data ────────────────────────────────────────────────────────────────────

/**
 * Newest `date,page` pull, accepting the `--suffix` variants gsc-pull can write
 * (`date-page-aug_...`), which the shared newestApiPull deliberately does not.
 *
 * It must be a `date,page` pull, not a plain `page` pull. A plain one collapses
 * its whole span into a single number, and the spans on disk are three months
 * long — which cannot answer "is this post earning clicks *now*". The first
 * version of this script picked one of those and reported 0 posts judged,
 * because the age filter then demanded a post be published both before and
 * after the same date.
 */
function newestDatePagePull(dir = 'output/gsc/api') {
  if (!fs.existsSync(dir)) return null;
  const found = [];
  for (const f of fs.readdirSync(dir)) {
    const m = /^date-page(?:-[a-z0-9]+)?_(\d{4}-\d{2}-\d{2})_(\d{4}-\d{2}-\d{2})\.csv$/.exec(f);
    if (m) found.push({ file: path.join(dir, f), start: m[1], end: m[2] });
  }
  if (!found.length) return null;
  found.sort((a, b) => a.end.localeCompare(b.end) || a.start.localeCompare(b.start));
  return found[found.length - 1];
}

if (has('--pull')) {
  console.log('Pulling fresh GSC data (date,page over the last 28 days)…');
  const r = spawnSync(process.execPath, ['scripts/gsc-pull.mjs', '--dimensions', 'date,page', '--days', '28'], { stdio: 'inherit' });
  if (r.status !== 0) {
    console.error('\nGSC pull failed. Falling back to the newest data already on disk.');
  }
}

const found = newestDatePagePull();
if (!found) {
  console.error('No `date,page` GSC pull found under output/gsc/api/.');
  console.error('Run: npm run seeds:check -- --pull');
  process.exit(1);
}

const rows = parseCsv(fs.readFileSync(found.file, 'utf8')).filter((r) => r.date);
const dates = [...new Set(rows.map((r) => r.date))].sort();
/** Keep only the most recent WINDOW_DAYS of whatever the file holds. */
const windowDays = Number(arg('--window', 28));
const keep = new Set(dates.slice(-windowDays));
const pull = { file: found.file, start: dates.length ? dates.slice(-windowDays)[0] : found.start, end: dates.at(-1) || found.end };

/**
 * Split the window in half so the report can say whether a seed is still
 * growing. `198` 워터밤 pulled 84 clicks in the 2026-07-22..08-19 window and
 * looked like the strongest page on the site — but the festival was in July,
 * and almost all of it was in the first half. A total alone cannot tell a
 * rising page from a finished season.
 */
const kept = dates.slice(-windowDays);
const midpoint = kept[Math.floor(kept.length / 2)];

/** page -> {clicks, impressions, position, firstHalf, secondHalf} */
const stats = {};
for (const row of rows) {
  if (!keep.has(row.date)) continue;
  const u = slugFromUrl(row.page);
  if (!u) continue;
  const i = Number(row.impressions) || 0;
  const c = Number(row.clicks) || 0;
  const s = (stats[u.slug] ||= { section: u.section, clicks: 0, impressions: 0, posSum: 0, firstHalf: 0, secondHalf: 0 });
  s.clicks += c;
  s.impressions += i;
  s.posSum += (Number(row.position) || 0) * i;   // impression-weighted, so a one-impression day cannot swing it
  if (row.date < midpoint) s.firstHalf += c; else s.secondHalf += c;
}
for (const s of Object.values(stats)) s.position = s.impressions ? s.posSum / s.impressions : null;

// ── posts ───────────────────────────────────────────────────────────────────

const DAY = 86400000;
const winStart = new Date(pull.start + 'T00:00:00Z');
const winEnd = new Date(pull.end + 'T00:00:00Z');
const staleDays = Math.round((Date.now() - winEnd) / DAY);

/** Published early enough that the window is scoring a real, indexed post. */
const readyBy = new Date(winStart - LAG_DAYS * DAY);
/** Still a seedling rather than archive. */
const oldestJudged = new Date(winEnd - MAX_AGE_DAYS * DAY);

const prev = fs.existsSync(OUT) ? JSON.parse(fs.readFileSync(OUT, 'utf8')) : {};
const prevBySlug = Object.fromEntries((prev.posts || []).map((r) => [r.slug, r]));

const posts = [];
for (const dir of ['content/blog', 'content/business']) {
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith('.md')) continue;
    const text = fs.readFileSync(path.join(dir, f), 'utf8');
    const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
    if (!fm) continue;
    const get = (k) => (new RegExp(`^${k}:\\s*"?(.*?)"?\\s*$`, 'm').exec(fm[1]) || [, ''])[1].trim();
    const slug = get('slug');
    const date = get('date');
    if (!slug || !date) continue;
    if (get('visibility') === 'private') continue;

    const pub = new Date(date + 'T00:00:00Z');
    if (Number.isNaN(+pub)) continue;
    const inWindow = pub <= readyBy && pub >= oldestJudged;
    if (!inWindow && !has('--all')) continue;

    const s = stats[slug] || { clicks: 0, impressions: 0, position: null, firstHalf: 0, secondHalf: 0, section: dir.includes('business') ? 'business' : 'blog' };
    const p = prevBySlug[slug] || {};
    const won = (text.match(/₩/g) || []).length;
    const hangul = new Set(text.match(/[가-힣]+/g) || []).size;

    /**
     * A year in the title is usually staleness bait — but not when the post is
     * ABOUT dates. "Chuseok 2026" IS the query. "Food Halls 2026" is decoration
     * that will rot. Tell them apart by whether the post pins a calendar date:
     * an event post always does, an evergreen guide never does.
     *
     * The first version flagged both, and that sent a session to re-refresh
     * `200` the day after it had correctly been updated with the real Korail
     * sale dates — the one post on the list with nothing left to fix.
     */
    const MONTHS = 'January|February|March|April|May|June|July|August|September|October|November|December';
    const pinsADate = new RegExp(
      `\\b\\d{1,2}\\s*(?:[-–]\\s*\\d{1,2}\\s*)?(?:${MONTHS})\\b|\\b(?:${MONTHS})\\s+\\d{1,2}\\b`,
      'i',
    ).test(`${get('title')} ${get('description')}`);

    posts.push({
      slug,
      section: s.section,
      title: get('title'),
      published: date,
      ageDays: Math.round((winEnd - pub) / DAY),
      clicks: s.clicks,
      impressions: s.impressions,
      position: s.position === null ? null : Number(s.position.toFixed(1)),
      firstHalf: s.firstHalf,
      secondHalf: s.secondHalf,
      verdict: s.clicks > 0 ? 'alive' : (s.impressions > 0 ? 'dormant-seen' : 'dormant-unseen'),
      gaps: { won, hangul, yearInTitle: /\b20\d{2}\b/.test(get('title')) && !pinsADate },
      /** The post's own record of when it was last touched. See `cooled()`. */
      updatedAt: get('updatedAt') || null,
      // preserved across runs
      worked: p.worked || null,
      note: p.note || null,
    });
  }
}

// ── the water list ──────────────────────────────────────────────────────────

/**
 * Order living posts by CLICKS, not impressions.
 *
 * `refresh-queue.json` sorts by impressions and is right to: clicks top out at
 * 7 across that whole queue, so they cannot tell 52 posts apart. Here they
 * range 1 to 25 and they discriminate cleanly, and the measured gradient says
 * they are what to follow — 0 early clicks predicted 0.06 later, 1 predicted
 * 1.17, 10+ predicted 4.75.
 *
 * Sorting this list by impressions instead put `301` (2,633 impressions, 1
 * click, 0.04%) above `218` (522 impressions, 25 clicks, 4.8%). Impressions
 * measure the size of an audience; only clicks say the audience wants the page.
 *
 * And it is the SECOND HALF of the window that orders the list, not the total.
 * `198` 워터밤 went 76 clicks then 8 across the two halves — the festival was in
 * July. On totals it was the site's strongest page and topped the nomination
 * list; on recent clicks it sits fourth, behind pages that are still climbing.
 * A finished season demotes itself this way without needing a special case.
 */
const alive = posts.filter((p) => p.verdict === 'alive');

/**
 * `worked` only knows about work done SINCE this script existed, and it shipped
 * with an empty state file. On the second run that cost a session: the top three
 * nominees — `200`, `198`, `255` — had all been refreshed within the previous
 * three weeks, and `200` only the day before.
 *
 * The posts already carry that history in their own frontmatter. `updatedAt` is
 * the authority on when a post was last touched, so read it as an implicit
 * `worked` date. Keep the two fields separate in the JSON: `worked` stays a
 * record of what this gate sent someone to do, `updatedAt` is what the file says.
 */
const lastTouched = (p) => {
  const dates = [p.worked, p.updatedAt].filter(Boolean).sort();
  return dates.length ? dates[dates.length - 1] : null;
};
const cooled = (p) => {
  const d = lastTouched(p);
  return !d || (Date.now() - new Date(d + 'T00:00:00Z')) / DAY > COOLDOWN_DAYS;
};

/**
 * A gap is something concrete to go and fix. Without one the nomination reads
 * "스펙은 채워져 있음" — which is not an instruction, and is how `198` reached
 * the list with nothing to do while `255` sat below it carrying exactly one
 * price in a 3,000-word guide about what things cost.
 */
const gapsOf = (p) => {
  const g = [];
  if (!p.gaps.won) g.push('₩ 없음');
  if (p.gaps.hangul < 3) g.push('한글 병기 부족');
  if (p.gaps.yearInTitle) g.push('제목 연도 확인');
  return g;
};
const hasGap = (p) => gapsOf(p).length > 0;

/**
 * A page in free-fall is the wrong bet for this week, even when its raw click
 * count is the highest on the list.
 *
 * `trend()` below already computes this and prints a down arrow. Until
 * 2026-08-25 the arrow was decoration: the sort ignored it, and the week's #1
 * pick came back as `197` Boryeong Mud Festival -- a July festival, marked with
 * that arrow in the very row recommending it. Checked directly: 134 impressions
 * and ZERO clicks during the festival window, 10 impressions and zero clicks two
 * weeks ago. It has never converted, and its season is over.
 *
 * This is the same failure CLAUDE.md records for `198` Waterbomb, which is why
 * the sort moved to recent clicks in the first place. Recent clicks alone were
 * not enough, because a season decays over weeks rather than falling to zero
 * inside one window. Direction has to be a sort key, not a glyph.
 */
const falling = (p) => {
  const a = p.firstHalf, b = p.secondHalf;
  return a + b >= 3 && a > b * 1.5;
};

const water = alive
  .filter((p) => cooled(p) && !DEAD_END.has(p.slug) && !isImpressionHeavy(p))
  .sort((a, b) => (falling(a) - falling(b))
    || (hasGap(b) - hasGap(a))
    || b.secondHalf - a.secondHalf || b.clicks - a.clicks || b.impressions - a.impressions)
  .slice(0, WATER_COUNT);

const seenNoClick = posts.filter((p) => p.verdict === 'dormant-seen');
const unseen = posts.filter((p) => p.verdict === 'dormant-unseen');

// ── report ──────────────────────────────────────────────────────────────────

const pad = (v, n) => String(v).padStart(n);
const short = (s) => (s.length > 12 ? s.slice(0, 11) + '…' : s);
const ctr = (p) => (p.impressions ? (100 * p.clicks / p.impressions).toFixed(2) : '0.00');
const mark = (p) => (DEAD_END.has(p.slug) ? ' ✗dead-end' : isImpressionHeavy(p) ? ' ✗노출형' : '');
/** Second half of the window against the first. A finished season reads as a fall. */
const trend = (p) => {
  const a = p.firstHalf, b = p.secondHalf;
  if (a + b < 3) return ' ';                 // too few clicks to call a direction
  if (b > a * 1.5) return '↑';
  if (a > b * 1.5) return '↓';
  return '→';
};
const fmt = (p) => `  ${short(p.slug).padEnd(13)} ${pad(p.ageDays, 3)}일  클릭 ${pad(p.clicks, 3)}  노출 ${pad(p.impressions, 5)}  CTR ${pad(ctr(p), 5)}% ${trend(p)}  순위 ${pad(p.position ?? '-', 5)}  ${(p.title || '').slice(0, 40)}${mark(p)}`;

console.log('');
console.log(`측정 창   ${pull.start} ~ ${pull.end}   (${path.basename(pull.file)})`);
console.log(has('--all')
  ? `판정 대상 ${posts.length}편 — --all: 나이 제한 없이 전부`
  : `판정 대상 ${posts.length}편 — 창이 열리기 ${LAG_DAYS}일 전까지 발행됐고, 창이 닫힐 때 ${MAX_AGE_DAYS}일 이하인 글`);
if (staleDays > 9) console.log(`\n⚠ 데이터가 ${staleDays}일 지났습니다. 새로 당기려면: npm run seeds:check -- --pull`);

console.log(`\n■ 싹이 났다 — 클릭 1개 이상 (${alive.length}편)`);
alive.sort((a, b) => b.clicks - a.clicks).slice(0, 20).forEach((p) => console.log(fmt(p)));
if (alive.length > 20) console.log(`  … 외 ${alive.length - 20}편 (전체는 ${OUT})`);

console.log(`\n■ 노출은 있는데 클릭 0 (${seenNoClick.length}편) — 리프레시해도 안 살아납니다`);
seenNoClick.sort((a, b) => b.impressions - a.impressions).slice(0, 10).forEach((p) => console.log(fmt(p)));
if (seenNoClick.length > 10) console.log(`  … 외 ${seenNoClick.length - 10}편`);

console.log(`\n■ 노출도 없다 (${unseen.length}편)`);
console.log('  ' + unseen.map((p) => p.slug).join(' '));

console.log(`\n■ 이번 주 물 줄 글 ${water.length}편 — 하락세를 뒤로 보낸 뒤 창 후반 클릭 순 (dead-end·노출형 제외)`);
for (const p of water) {
  const g = gapsOf(p);
  console.log(fmt(p));
  console.log(`        → ${g.length ? g.join(' · ') : '스펙은 채워져 있음 — 내부링크·사실 갱신·소셜 후보로'}`);
}
if (!water.length) console.log('  (없음 — 살아 있는 글이 모두 최근에 작업됐거나 판정 대상이 비어 있습니다)');

/**
 * A post can be skipped for cooling down and still have a hole in it. `255` is
 * the case: refreshed 12 days ago and left with exactly one price in a guide
 * about what food costs. That is a real gap, but re-opening a post someone
 * touched last week is the churn the cooldown exists to stop — so name it here
 * and let the next cycle pick it up instead of losing it.
 */
const coolingWithGaps = alive
  .filter((p) => !cooled(p) && hasGap(p) && !DEAD_END.has(p.slug) && !isImpressionHeavy(p))
  .sort((a, b) => b.secondHalf - a.secondHalf);
if (coolingWithGaps.length) {
  console.log(`\n■ 쿨다운 중이지만 결손이 남아 있다 (${coolingWithGaps.length}편) — 다음 사이클 후보`);
  for (const p of coolingWithGaps.slice(0, 5)) {
    console.log(`  ${short(p.slug).padEnd(13)} ${lastTouched(p)} 작업  최근2주 클릭 ${pad(p.secondHalf, 2)}  → ${gapsOf(p).join(' · ')}`);
  }
}

console.log(`\n작업을 마치면 ${OUT}의 해당 슬러그에 "worked": "YYYY-MM-DD"를 적으세요.`);
console.log(`그러면 ${COOLDOWN_DAYS}일간 이 목록에 다시 오르지 않습니다.\n`);

fs.writeFileSync(OUT, JSON.stringify({
  generated: new Date(winEnd).toISOString().slice(0, 10),
  window: { start: pull.start, end: pull.end, source: path.basename(pull.file) },
  rule: 'clicks > 0 = alive. Measured 2026-08-21: 0 clicks -> 0.06 mean clicks later, 1 click -> 1.17. See output/strategy/breakout-prediction_2026-08-21.md',
  counts: { judged: posts.length, alive: alive.length, dormantSeen: seenNoClick.length, dormantUnseen: unseen.length },
  water: water.map((p) => p.slug),
  deadEndExcluded: [...DEAD_END],
  posts: posts.sort((a, b) => b.clicks - a.clicks || b.impressions - a.impressions),
}, null, 2) + '\n');
