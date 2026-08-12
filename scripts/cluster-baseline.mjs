#!/usr/bin/env node
/**
 * Cluster-lift measurement — baseline snapshot and later judgment.
 *
 * WHY THIS EXISTS
 * ───────────────
 * On 2026-08-02 we launched /convenience-store/ as a hub and wired ~20 existing
 * posts into it, then added two new spokes (376, 377). The stated reason was the
 * belief that "covering one subject in 8–12 posts that link to each other makes
 * Google treat the site as knowing the subject, so when one post rises it pulls
 * the others up."
 *
 * We have never measured that. It is a borrowed SEO claim, not something this
 * site has evidence for. If we do not take a baseline now, in six weeks we will
 * look at the numbers, see whatever we see, and tell ourselves a story about it.
 *
 * THE TRAP THIS SCRIPT EXISTS TO AVOID
 * ────────────────────────────────────
 * "Cluster posts got more clicks than before" proves nothing on its own. The
 * whole site is growing — total clicks went from about 13/day in May to about
 * 28/day in August. A rising tide lifts the cluster too. So the question is not
 *
 *   did the cluster grow?
 *
 * but
 *
 *   did the cluster grow MORE than comparable posts we did not touch?
 *
 * That is a difference-in-differences, and it needs a control group chosen
 * BEFORE we see the outcome — which is the only reason this runs today rather
 * than in six weeks.
 *
 * THE CONTROL GROUP
 * ─────────────────
 * Nearest-neighbour matched on baseline clicks. For each cluster post we take
 * the unused non-cluster post with the closest baseline click count. This matters
 * because click counts here are tiny and skewed: a post on 64 clicks and a post
 * on 0 clicks have completely different room to move, and regression to the mean
 * pushes them in opposite directions. Matching on the baseline value makes that
 * force act on both groups equally, so it cancels in the difference.
 *
 * Matching is greedy over posts sorted by descending baseline clicks, so it is
 * deterministic — rerunning gives the same control set.
 *
 * MEASUREMENT RULES INHERITED FROM CLAUDE.md
 * ──────────────────────────────────────────
 * - CLICKS ONLY across time. Google confirmed an impressions over-reporting bug
 *   from 2025-05-13 to ~April 2026. Impressions and CTR are recorded here for
 *   context but must not be trended. The judgment reads clicks.
 * - Both measurements must use the same window length (GSC UI "지난 3개월").
 *
 * WHAT THIS CANNOT TELL US
 * ────────────────────────
 * With ~20 posts and a median around 1 click each, the noise floor is high. A
 * swing of a few clicks per post is not a result. The script prints the minimum
 * detectable effect so the judgment is not made on noise. If the answer comes
 * back "too small to call", that is a real answer and should be reported as one.
 *
 * USAGE
 *   node scripts/cluster-baseline.mjs                    # write the baseline
 *   node scripts/cluster-baseline.mjs --judge            # compare latest extract to it
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const GSC_DIR = join(ROOT, 'output', 'gsc');
const OUT = join(ROOT, 'output', 'strategy', 'cluster-baseline_convenience-store.json');

const args = process.argv.slice(2);
const JUDGE = args.includes('--judge');

/* ─────────── the cluster, read from the hub itself ───────────
   Read from lib/convenience-store.ts rather than hard-coded here, so the
   treatment group cannot silently drift away from what the hub actually links. */
function clusterSlugs() {
  const src = readFileSync(join(ROOT, 'lib', 'convenience-store.ts'), 'utf8');
  // Only the GUIDE_GROUPS block — the price table and how-to rows carry slugs
  // too, but those are inline references, not hub cards.
  const start = src.indexOf('export const GUIDE_GROUPS');
  const end = src.indexOf('export const CVS_SLUGS');
  const block = src.slice(start, end);
  const found = [...block.matchAll(/slug:\s*'(\d+)'/g)].map((m) => m[1]);
  return [...new Set(found)];
}

/* ─────────── GSC extract reading ─────────── */
function latestExtract() {
  const dirs = readdirSync(GSC_DIR)
    .filter((d) => d.includes('Performance-on-Search'))
    .sort();
  if (!dirs.length) throw new Error('no GSC extract under output/gsc/');
  return join(GSC_DIR, dirs[dirs.length - 1]);
}

function extractDate(dir) {
  return dir.match(/(\d{4}-\d{2}-\d{2})$/)?.[1] ?? 'unknown';
}

/** The chart CSV carries the actual covered range, which the folder name does not. */
function windowOf(dir) {
  const rows = readFileSync(join(dir, '차트.csv'), 'utf8').trim().split(/\r?\n/).slice(1);
  const days = rows.map((r) => r.split(',')[0]).filter(Boolean);
  return { from: days[0], to: days[days.length - 1], days: days.length };
}

/** slug -> {clicks, impressions, ctr, position} for every /blog/{n} page. */
function pageStats(dir) {
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

/* Filenames come in two shapes: `171.md` and
   `059-discover-the-tastiest-picks-at-korean-convenience-stores-....md`.
   Only the `slug:` frontmatter field is authoritative — GSC URLs are /blog/059,
   not /blog/059-discover-.... Building the index off filenames alone silently
   reported six of the oldest convenience-store posts as brand new. */
const POSTS = (() => {
  const dir = join(ROOT, 'content', 'blog');
  const index = new Map();
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const text = readFileSync(join(dir, file), 'utf8');
    // Frontmatter uses both quote styles: slug: "171" and slug: '003'.
    const slug = text.match(/^slug:\s*['"]?([^'"\n]+)['"]?/m)?.[1]?.trim()
      ?? file.match(/^(\d+)/)?.[1];
    if (!slug) continue;
    index.set(slug, {
      file,
      date: text.match(/^date:\s*"?(\d{4}-\d{2}-\d{2})/m)?.[1] ?? null,
      visibility: text.match(/^visibility:\s*"?(\w+)/m)?.[1] ?? 'public',
    });
  }
  return index;
})();

/** Every published post slug, so posts with zero GSC rows still count as zero. */
function allSlugs() {
  return [...POSTS.entries()].filter(([, p]) => p.visibility === 'public').map(([s]) => s);
}

/** Published date from frontmatter — used to exclude posts too new to have a baseline. */
function publishedAt(slug) {
  return POSTS.get(slug)?.date ?? null;
}

/* ─────────── matched control ───────────
   Matched on TWO axes, clicks then publication age, in that priority.

   Age is not a refinement — leaving it out produced a control group that would
   have manufactured a false positive. Matching on clicks alone paired twelve
   zero-click cluster posts against the twelve oldest posts on the site (slugs
   001–019, all July 2024), while ten of those cluster posts had been published
   in July–August 2026, three of them on 2026-08-04 — one day before the baseline
   window closed. Brand-new posts climb on indexing alone. Six weeks later that
   ordinary maturation would have shown up as cluster lift, and we would have
   "proved" the hypothesis using nothing but the calendar.

   So: nearest click count wins first, and among equally close candidates the one
   published nearest in time wins. Greedy from the highest baseline down, so the
   scarce high-click controls get allocated before they are used up. */
function matchControls(treatment, pool, stats, dateOf) {
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

const sum = (xs) => xs.reduce((a, b) => a + b, 0);

/* ─────────── baseline ─────────── */
function writeBaseline() {
  const dir = latestExtract();
  const win = windowOf(dir);
  const stats = pageStats(dir);
  const cluster = clusterSlugs();

  // A post published after the window closed has no baseline to measure from.
  // 376 and 377 are exactly this case — brand new spokes. They are tracked as
  // absolute numbers, not as part of the difference.
  const withBaseline = cluster.filter((s) => {
    const d = publishedAt(s);
    return d && d <= win.to;
  });
  const newSpokes = cluster.filter((s) => !withBaseline.includes(s));

  const pool = allSlugs().filter(
    (s) => !cluster.includes(s) && (publishedAt(s) ?? '9999') <= win.to
  );

  const pairs = matchControls(withBaseline, pool, stats, publishedAt);
  const worstAgeGap = Math.max(...pairs.map((p) => p.ageGapDays));

  const tClicks = sum(pairs.map((p) => p.treatmentClicks));
  const cClicks = sum(pairs.map((p) => p.controlClicks));

  // pairs is already sorted by descending treatment clicks, so [0] is the outlier.
  const [outlier, ...trimmed] = pairs;

  const siteClicks = sum([...stats.values()].map((v) => v.clicks));

  const baseline = {
    subject: 'convenience-store cluster',
    hypothesis:
      'Wiring ~20 posts into a hub raises the cluster more than comparable untouched posts.',
    interventions: [
      { date: '2026-08-02', what: 'Hub /convenience-store/ launched, 19 posts wired in' },
      { date: '2026-08-11', what: 'New spoke 376 (1+1) published and wired' },
      { date: '2026-08-12', what: 'New spoke 377 (hangover drinks) published and wired' },
    ],
    baselineTakenOn: '2026-08-12',
    source: {
      extract: dir.replace(ROOT, '').replace(/\\/g, '/'),
      extractDate: extractDate(dir),
      window: win,
      note:
        'The window closes 2026-08-04, two days after the hub launched and before ' +
        'either new spoke existed. Effectively a pre-intervention read.',
    },
    metric: 'clicks',
    metricNote:
      'Clicks only. Impressions/CTR recorded for context but not comparable across ' +
      'the 2025-05-13~2026-04 GSC over-reporting bug.',
    secondMetric: 'livePosts',
    secondMetricNote:
      'Count of posts in the group earning at least one click. This exists because ' +
      'the click total is dangerously concentrated: one post (171) holds 84% of the ' +
      'treatment total, so a total-clicks verdict is really a verdict on that one ' +
      'post. It is also the closer test of the actual hypothesis — the claim is ' +
      'that a hub wakes up the posts nobody reaches, and 12 of 17 cluster posts ' +
      'currently earn zero clicks. If clustering works, that number should fall ' +
      'faster in the treatment group than in the control.',
    judgeOn: '2026-09-23',
    judgeNote:
      'Six weeks after the last spoke. Pull a fresh GSC extract with the same ' +
      '"지난 3개월" window, then run: node scripts/cluster-baseline.mjs --judge',
    treatment: {
      slugs: withBaseline,
      count: withBaseline.length,
      clicks: tClicks,
      livePosts: withBaseline.filter((s) => (stats.get(s)?.clicks ?? 0) > 0).length,
      perPost: Object.fromEntries(withBaseline.map((s) => [s, stats.get(s)?.clicks ?? 0])),
    },
    control: {
      method:
        'greedy nearest-neighbour, primary key baseline clicks, tie-break publication date',
      worstAgeGapDays: worstAgeGap,
      ageNote:
        'Age matching is load-bearing. Without it the control group was two years ' +
        'older than the treatment group, and ordinary indexing growth on ten ' +
        'recently published cluster posts would have read as cluster lift.',
      slugs: pairs.map((p) => p.control),
      count: pairs.length,
      clicks: cClicks,
      livePosts: pairs.filter((p) => p.controlClicks > 0).length,
      perPost: Object.fromEntries(pairs.map((p) => [p.control, p.controlClicks])),
    },
    concentration: {
      topSlug: outlier.treatment,
      topShare: tClicks ? Math.round((outlier.treatmentClicks / tClicks) * 100) : 0,
      warning:
        'Read the clicks verdict together with the livePosts verdict. If they ' +
        'disagree, the clicks verdict is the one being driven by a single post.',
    },
    /* The cleanest of the three readings. One pair is both the dominant post and
       the only badly matched one: 171 sits on 64 clicks with nothing on the site
       resembling it, so it draws 082 from two years earlier on 49 clicks. Drop
       that pair and the remaining 16 are matched exactly on clicks and within two
       days on publication date — 12 clicks against 12, 4 live posts against 4.
       If the hypothesis has an effect, this is where it shows up unpolluted.
       171 is then judged on its own, as a single post, which is what it is. */
    excludingOutlier: {
      excluded: { treatment: outlier.treatment, control: outlier.control, reason: 'dominant and worst-matched pair' },
      treatmentSlugs: trimmed.map((p) => p.treatment),
      controlSlugs: trimmed.map((p) => p.control),
      count: trimmed.length,
      treatmentClicks: sum(trimmed.map((p) => p.treatmentClicks)),
      controlClicks: sum(trimmed.map((p) => p.controlClicks)),
      treatmentLive: trimmed.filter((p) => p.treatmentClicks > 0).length,
      controlLive: trimmed.filter((p) => p.controlClicks > 0).length,
      worstAgeGapDays: Math.max(...trimmed.map((p) => p.ageGapDays)),
    },
    pairs,
    newSpokes: {
      slugs: newSpokes,
      note: 'Published after the baseline window. Baseline is zero by construction; ' +
        'judge these on absolute clicks, not on the difference.',
    },
    siteWide: { clicks: siteClicks, pagesWithClicks: [...stats.values()].filter((v) => v.clicks > 0).length },
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(baseline, null, 2) + '\n');

  console.log(`Baseline written → ${OUT.replace(ROOT, '.')}`);
  console.log(`  window          ${win.from} → ${win.to}  (${win.days} days)`);
  console.log(`  treatment       ${withBaseline.length} posts, ${tClicks} clicks, ${baseline.treatment.livePosts} earning anything`);
  console.log(`  matched control ${pairs.length} posts, ${cClicks} clicks, ${baseline.control.livePosts} earning anything`);
  console.log(`  new spokes      ${newSpokes.join(', ') || '(none)'} — no baseline, judge on absolutes`);
  console.log(`  site-wide       ${siteClicks} clicks across ${baseline.siteWide.pagesWithClicks} pages`);
  console.log('');
  console.log(`  CONCENTRATION: ${baseline.concentration.topSlug} alone is ${baseline.concentration.topShare}% of the treatment total.`);
  console.log(`  ${withBaseline.length - baseline.treatment.livePosts} of ${withBaseline.length} cluster posts earn zero clicks today.`);
  console.log('  That is why livePosts is tracked alongside clicks — see the JSON note.');
  console.log('');
  console.log(`  CLEAN SUBSET: dropping the ${outlier.treatment}/${outlier.control} pair leaves ${trimmed.length} pairs matched`);
  console.log(`  exactly on clicks and within ${baseline.excludingOutlier.worstAgeGapDays} days on publication date —`);
  console.log(`  ${baseline.excludingOutlier.treatmentClicks} clicks vs ${baseline.excludingOutlier.controlClicks}, ${baseline.excludingOutlier.treatmentLive} live vs ${baseline.excludingOutlier.controlLive}. This is the reading to trust.`);
  console.log('');
  console.log('  Minimum detectable effect:');
  // A group of N posts summing to C clicks has Poisson-ish noise of about sqrt(C)
  // on each measurement; the difference of two differences stacks four of those.
  const noise = Math.sqrt(tClicks) * 2;
  console.log(`    treatment total is ${tClicks}; two-sided noise on a difference-in-differences`);
  console.log(`    is roughly ±${noise.toFixed(0)} clicks. Anything smaller is not a result.`);
  console.log(`    To call it real, treatment must beat control by more than ~${Math.ceil(noise)} clicks.`);
}

/* ─────────── judgment ─────────── */
function judge() {
  if (!existsSync(OUT)) throw new Error('no baseline — run without --judge first');
  const base = JSON.parse(readFileSync(OUT, 'utf8'));
  const dir = latestExtract();
  const win = windowOf(dir);
  const stats = pageStats(dir);

  if (extractDate(dir) === base.source.extractDate) {
    console.log('The latest extract is the same one the baseline used.');
    console.log('Pull a fresh GSC export first, then rerun with --judge.');
    return;
  }

  const now = (s) => stats.get(s)?.clicks ?? 0;
  const tNow = sum(base.treatment.slugs.map(now));
  const cNow = sum(base.control.slugs.map(now));
  const tWas = base.treatment.clicks;
  const cWas = base.control.clicks;

  const did = (tNow - tWas) - (cNow - cWas);

  /* Noise floor must be computed from the base the comparison actually rests on.
     Using the full treatment total (dominated by 171) as the yardstick for the
     16-pair subset buries a real effect: in a rehearsal, a +10-click cluster gain
     on a base of 12 was reported "too small to call" against 171's ±17 floor. */
  const floor = (base_) => Math.sqrt(Math.max(base_, 1)) * 2;

  console.log(`Baseline window  ${base.source.window.from} → ${base.source.window.to}`);
  console.log(`Current window   ${win.from} → ${win.to}`);

  /* ── The headline: the clean 16-pair subset ──
     Matched exactly on clicks and within two days on publication date, with the
     one pair that was neither dropped out. Everything else below is context. */
  const ex = base.excludingOutlier;
  const exTNow = sum(ex.treatmentSlugs.map(now));
  const exCNow = sum(ex.controlSlugs.map(now));
  const exTLive = ex.treatmentSlugs.filter((s) => now(s) > 0).length;
  const exCLive = ex.controlSlugs.filter((s) => now(s) > 0).length;
  const exDid = (exTNow - ex.treatmentClicks) - (exCNow - ex.controlClicks);
  const exLiveDid = (exTLive - ex.treatmentLive) - (exCLive - ex.controlLive);
  const exFloor = floor(ex.treatmentClicks);

  console.log('');
  console.log(`═══ VERDICT — ${ex.count} matched pairs, ${ex.excluded.treatment}/${ex.excluded.control} excluded ═══`);
  console.log(`  clicks      ${ex.treatmentClicks} → ${exTNow}    control ${ex.controlClicks} → ${exCNow}    difference ${exDid >= 0 ? '+' : ''}${exDid}  (floor ±${exFloor.toFixed(0)})`);
  console.log(`  live posts  ${ex.treatmentLive}/${ex.count} → ${exTLive}/${ex.count}    control ${ex.controlLive}/${ex.count} → ${exCLive}/${ex.count}    difference ${exLiveDid >= 0 ? '+' : ''}${exLiveDid}`);
  console.log('');

  const clicksCall = Math.abs(exDid) <= exFloor ? 'flat' : exDid > 0 ? 'up' : 'down';
  // One post waking up is one post; two or more is a pattern worth acting on.
  const liveCall = Math.abs(exLiveDid) < 2 ? 'flat' : exLiveDid > 0 ? 'up' : 'down';

  if (clicksCall === 'up' || liveCall === 'up') {
    console.log('  The cluster beat its matched control. This is the first evidence');
    console.log('  this site has that hub-clustering does anything. Worth repeating');
    console.log('  on the next package — and worth re-measuring the same way.');
  } else if (clicksCall === 'down' || liveCall === 'down') {
    console.log('  The cluster grew LESS than its matched control. The wiring did not');
    console.log('  pay for itself. Do not build the next package around clustering');
    console.log('  without a different mechanism.');
  } else {
    console.log('  No measurable difference. Report this as "no evidence either way",');
    console.log('  not as failure — six weeks and 12 baseline clicks may simply be too');
    console.log('  little to resolve. Either extend the window or stop claiming the');
    console.log('  effect exists. Do not split the difference and call it promising.');
  }
  if (clicksCall !== 'flat' && liveCall !== 'flat' && clicksCall !== liveCall) {
    console.log('');
    console.log('  ⚠ The two metrics disagree. Trust live posts — the hypothesis is');
    console.log('  about waking dead pages, and click totals here move on few pages.');
  }

  console.log('');
  console.log('─── context ───');
  console.log(`  ${ex.excluded.treatment} alone (the unicorn, no comparable control): ${base.treatment.perPost[ex.excluded.treatment]} → ${now(ex.excluded.treatment)} clicks`);
  console.log(`  full 17-pair group:  treatment ${tWas} → ${tNow},  control ${cWas} → ${cNow},  difference ${did >= 0 ? '+' : ''}${did}`);
  console.log(`  (that line includes ${ex.excluded.treatment}; it is here for completeness, not for the verdict)`);
  console.log('');
  console.log('  New spokes (absolute, no baseline):');
  for (const s of base.newSpokes.slugs) console.log(`    ${s}  ${now(s)} clicks`);
}

JUDGE ? judge() : writeBaseline();
