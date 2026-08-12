#!/usr/bin/env node
/**
 * Refresh-programme measurement — baseline snapshot and later judgment.
 *
 * WHY THIS EXISTS
 * ───────────────
 * The plan gated this track explicitly: "T3는 스펙이 잘 안 붙는 층이라 다음 GSC
 * 추출에서 리프레시 45편 효과를 판정한 뒤 계속 여부를 결정한다." The judgment
 * never happened, and the programme kept running anyway — 35 posts refreshed
 * between 2026-08-06 and 2026-08-12 with no baseline recorded for any of them.
 *
 * Worse, the same session that built `cluster-baseline.mjs` specifically to stop
 * repeating an unmeasured belief then spent the afternoon repeating one. This
 * script exists so that mistake produces a measurement instead of a lesson.
 *
 * WHY THE BASELINE IS STILL RECOVERABLE
 * ─────────────────────────────────────
 * The 2026-08-07 GSC extract covers 2026-05-05 to 2026-08-04. Its window CLOSES
 * on 08-04, so for anything refreshed from 08-06 onward it is a clean
 * pre-intervention read even though it was pulled afterwards. Refreshes dated
 * 08-03 and 08-04 (167, 198, 200) fall inside the window and are therefore
 * contaminated — they are recorded here but excluded from the comparison.
 *
 * THE CONTROL GROUP
 * ─────────────────
 * Posts not refreshed in this programme, matched on baseline clicks first and
 * publication date second (see lib/cohort-baseline.mjs for why age matching is
 * load-bearing rather than decorative). The 25 posts still pending in
 * refresh-queue.json sit naturally in that pool: same tier, same selection
 * script, same gap criteria — they differ only in not having been done yet.
 *
 * WHAT THIS CANNOT SETTLE
 * ───────────────────────
 * The refreshes were not uniform. Some were fact corrections, some were spec
 * application, one was a de-cannibalisation retitle. A positive result says the
 * programme moved clicks; it does not say which kind of edit did it. If the
 * answer is positive and we want to know why, that needs a second, narrower
 * experiment — not a re-reading of this one.
 *
 * USAGE
 *   node scripts/refresh-baseline.mjs           # write the baseline
 *   node scripts/refresh-baseline.mjs --judge   # compare a fresh extract to it
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import {
  ROOT, publishedAt, allSlugs,
  latestExtract, extractDate, windowOf, pageStats,
  matchControls, sum, noiseFloor, liveCount,
} from './lib/cohort-baseline.mjs';

const OUT = join(ROOT, 'output', 'strategy', 'refresh-baseline.json');
const JUDGE = process.argv.slice(2).includes('--judge');

/* ─────────── the treatment cohorts ───────────
   Taken from git history rather than the queue file, because the queue is
   regenerated from measured gaps: a post that has been fixed drops out of it
   entirely, so the queue cannot tell you what was refreshed. Grouped by the
   date the refresh was committed. */
const COHORTS = [
  { date: '2026-08-03', slugs: ['167'], clean: false },
  { date: '2026-08-04', slugs: ['198', '200'], clean: false },
  { date: '2026-08-06', slugs: ['259', '274', '275'], clean: true },
  { date: '2026-08-07', slugs: ['074', '278', '281', '219', '128'], clean: true },
  { date: '2026-08-08', slugs: ['093', '335', '277', '279', '282', '250', '174', '223', '140'], clean: true },
  { date: '2026-08-09', slugs: ['288', '267', '254', '270', '315', '062', '311', '258', '175', '233', '263', '255'], clean: true },
  { date: '2026-08-12', slugs: ['145', '302', '186', '179', '215', '130'], clean: true },
];

const CONTAMINATED = COHORTS.filter((c) => !c.clean).flatMap((c) => c.slugs);
const TREATMENT = COHORTS.filter((c) => c.clean).flatMap((c) => c.slugs);

/** Still-pending queue items — the most directly comparable untouched posts. */
function pendingQueue() {
  const p = join(ROOT, 'content', 'data', 'refresh-queue.json');
  if (!existsSync(p)) return [];
  const q = JSON.parse(readFileSync(p, 'utf8'));
  const arr = Array.isArray(q) ? q : (q.items || q.queue || []);
  return arr.filter((x) => x.status === 'pending').map((x) => String(x.slug));
}

function writeBaseline() {
  const dir = latestExtract();
  const win = windowOf(dir);
  const stats = pageStats(dir);
  const clicks = (s) => stats.get(s)?.clicks ?? 0;

  const pending = pendingQueue();
  const treated = TREATMENT.filter((s) => (publishedAt(s) ?? '9999') <= win.to);
  const missing = TREATMENT.filter((s) => !treated.includes(s));

  const excluded = new Set([...TREATMENT, ...CONTAMINATED]);
  const pool = allSlugs().filter(
    (s) => !excluded.has(s) && (publishedAt(s) ?? '9999') <= win.to
  );

  const pairs = matchControls(treated, pool, stats);
  const tClicks = sum(pairs.map((p) => p.treatmentClicks));
  const cClicks = sum(pairs.map((p) => p.controlClicks));
  const controls = pairs.map((p) => p.control);

  // How many of the matched controls came from the pending queue — the closest
  // possible comparison, since those were selected by the same script for the
  // same reasons and simply have not been done.
  const fromQueue = controls.filter((s) => pending.includes(s)).length;

  /* The tight subset. High-click posts have few comparable partners, so the
     matcher reaches across time to find them: 275 (33 clicks) drew a control
     published two years earlier. Median age gap across all pairs is 2 days, so
     the damage is confined to a handful of pairs — but those are the pairs
     carrying the most clicks, which is exactly where a bad match does harm.
     This subset keeps only pairs matched EXACTLY on clicks and within 30 days
     on publication date, and is the reading to trust. */
  const tight = pairs.filter((p) => p.treatmentClicks === p.controlClicks && p.ageGapDays <= 30);
  const loose = pairs.filter((p) => !tight.includes(p));

  /* A second, differently-built comparison. The 25 posts still pending in the
     queue were chosen by the same script, for the same measured gaps, at the
     same tier — they are the closest thing this programme has to a control arm
     assigned by something other than our judgement. They are NOT click-matched
     to the treatment group, so this is a weaker instrument taken as a whole;
     its value is that its selection mechanism is identical. */
  const queueArm = pending.filter((s) => (publishedAt(s) ?? '9999') <= win.to);

  const byCohort = COHORTS.filter((c) => c.clean).map((c) => {
    const inPlay = c.slugs.filter((s) => treated.includes(s));
    return {
      date: c.date,
      count: inPlay.length,
      clicks: sum(inPlay.map(clicks)),
      live: liveCount(inPlay, stats),
      perPost: Object.fromEntries(inPlay.map((s) => [s, clicks(s)])),
    };
  });

  const baseline = {
    subject: 'refresh programme, 2026-08-06 onward',
    hypothesis:
      'Applying product-spec v1 and fact corrections to existing posts raises their ' +
      'clicks more than comparable posts left alone.',
    baselineTakenOn: '2026-08-12',
    source: {
      extract: dir.replace(ROOT, '').replace(/\\/g, '/'),
      extractDate: extractDate(dir),
      window: win,
      note:
        'The window closes 2026-08-04. Every cohort from 2026-08-06 onward was ' +
        'therefore untouched during the measured period, so this extract is a ' +
        'clean pre-intervention read despite being pulled later.',
    },
    excludedAsContaminated: {
      slugs: CONTAMINATED,
      why: 'Refreshed on 08-03 and 08-04, inside the measurement window. Their ' +
        'baseline already contains part of the effect, so they cannot be judged ' +
        'against it and are left out of both groups.',
    },
    metric: 'clicks',
    metricNote:
      'Clicks only. Impressions and CTR are not comparable across the ' +
      '2025-05-13~2026-04 GSC over-reporting bug.',
    secondMetric: 'livePosts',
    secondMetricNote:
      'Count of posts earning at least one click. Refresh targets are low-traffic ' +
      'by selection, so totals move on very few pages; this reading does not.',
    judgeOn: '2026-09-23',
    judgeNote:
      'Same date as the cluster judgment, so one GSC pull settles both. Pull with ' +
      'the same "지난 3개월" window, then: node scripts/refresh-baseline.mjs --judge',
    treatment: {
      slugs: treated,
      count: treated.length,
      clicks: tClicks,
      livePosts: liveCount(treated, stats),
      perPost: Object.fromEntries(treated.map((s) => [s, clicks(s)])),
      notFoundInIndex: missing,
      byCohort,
    },
    control: {
      method: 'greedy nearest-neighbour, primary key baseline clicks, tie-break publication date',
      count: pairs.length,
      clicks: cClicks,
      livePosts: liveCount(controls, stats),
      slugs: controls,
      drawnFromPendingQueue: fromQueue,
      queueNote:
        `${fromQueue} of ${pairs.length} matched controls are posts still pending in ` +
        'refresh-queue.json — same tier, same selection script, same measured gaps, ' +
        'differing only in not having been refreshed yet.',
      worstAgeGapDays: Math.max(...pairs.map((p) => p.ageGapDays)),
      perPost: Object.fromEntries(pairs.map((p) => [p.control, p.controlClicks])),
    },
    tightSubset: {
      rule: 'clicks matched exactly and publication dates within 30 days',
      count: tight.length,
      excludedPairs: loose.map((p) => ({ treatment: p.treatment, control: p.control, ageGapDays: p.ageGapDays, clickGap: p.treatmentClicks - p.controlClicks })),
      treatmentSlugs: tight.map((p) => p.treatment),
      controlSlugs: tight.map((p) => p.control),
      treatmentClicks: sum(tight.map((p) => p.treatmentClicks)),
      controlClicks: sum(tight.map((p) => p.controlClicks)),
      treatmentLive: tight.filter((p) => p.treatmentClicks > 0).length,
      controlLive: tight.filter((p) => p.controlClicks > 0).length,
      note: 'This is the verdict subset. The excluded pairs are the high-click ' +
        'posts, which have few comparable partners and drew controls from years ' +
        'away; they are reported separately rather than allowed to drive the result.',
    },
    queueArm: {
      slugs: queueArm,
      count: queueArm.length,
      clicks: sum(queueArm.map(clicks)),
      livePosts: liveCount(queueArm, stats),
      note: 'Posts still pending in refresh-queue.json. Same selection script, ' +
        'same tier, same measured gaps — untouched only because the queue ran ' +
        'out of session. Not click-matched, so read this as a second opinion ' +
        'with an unusually honest assignment mechanism, not as the primary test.',
    },
    pairs,
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(baseline, null, 2) + '\n');

  const floor = noiseFloor(tClicks);
  console.log(`Baseline written → ${OUT.replace(ROOT, '.')}`);
  console.log(`  window        ${win.from} → ${win.to}  (${win.days} days)`);
  console.log(`  treatment     ${treated.length} posts, ${tClicks} clicks, ${baseline.treatment.livePosts} earning anything`);
  console.log(`  control       ${pairs.length} posts, ${cClicks} clicks, ${baseline.control.livePosts} earning anything`);
  console.log(`                ${fromQueue} drawn from the still-pending queue; worst age gap ${baseline.control.worstAgeGapDays} days`);
  if (missing.length) console.log(`  NOT INDEXED   ${missing.join(', ')}`);
  console.log(`  excluded      ${CONTAMINATED.join(', ')} — refreshed inside the window`);
  console.log('');
  console.log('  By cohort:');
  for (const c of byCohort) console.log(`    ${c.date}  ${String(c.count).padStart(2)} posts  ${String(c.clicks).padStart(3)} clicks  ${c.live} live`);
  const tFloor = noiseFloor(baseline.tightSubset.treatmentClicks);
  console.log('');
  console.log(`  TIGHT SUBSET (the verdict): ${tight.length} of ${pairs.length} pairs matched exactly on`);
  console.log(`  clicks and within 30 days — ${baseline.tightSubset.treatmentClicks} clicks vs ${baseline.tightSubset.controlClicks}, ${baseline.tightSubset.treatmentLive} live vs ${baseline.tightSubset.controlLive}.`);
  console.log(`  Excluded: ${loose.map((p) => p.treatment).join(', ')} — high-click posts with no near partner.`);
  console.log('');
  console.log(`  QUEUE ARM (second opinion): ${queueArm.length} still-pending posts, ${baseline.queueArm.clicks} clicks, ${baseline.queueArm.livePosts} live.`);
  console.log('');
  console.log(`  Noise floor ±${tFloor.toFixed(0)} on the tight subset (±${floor.toFixed(0)} on all ${pairs.length} pairs).`);
  console.log(`  To call the programme real, the tight subset must move by more than ${Math.ceil(tFloor)}.`);
}

function judge() {
  if (!existsSync(OUT)) throw new Error('no baseline — run without --judge first');
  const base = JSON.parse(readFileSync(OUT, 'utf8'));
  const dir = latestExtract();
  if (extractDate(dir) === base.source.extractDate) {
    console.log('The latest extract is the same one the baseline used.');
    console.log('Pull a fresh GSC export first, then rerun with --judge.');
    return;
  }
  const win = windowOf(dir);
  const stats = pageStats(dir);
  const now = (s) => stats.get(s)?.clicks ?? 0;

  /* Headline is the tight subset — pairs matched exactly on clicks and within
     30 days. The five excluded pairs are the high-click posts, which drew
     partners from years away and would otherwise drive the whole result. */
  const ts = base.tightSubset;
  const tNow = sum(ts.treatmentSlugs.map(now));
  const cNow = sum(ts.controlSlugs.map(now));
  const did = (tNow - ts.treatmentClicks) - (cNow - ts.controlClicks);
  const floor = noiseFloor(ts.treatmentClicks);

  const tLive = liveCount(ts.treatmentSlugs, stats);
  const cLive = liveCount(ts.controlSlugs, stats);
  const liveDid = (tLive - ts.treatmentLive) - (cLive - ts.controlLive);

  console.log(`Baseline window  ${base.source.window.from} → ${base.source.window.to}`);
  console.log(`Current window   ${win.from} → ${win.to}`);
  console.log('');
  console.log(`═══ VERDICT — ${ts.count} matched pairs (${ts.rule}) ═══`);
  console.log(`  clicks      ${ts.treatmentClicks} → ${tNow}    control ${ts.controlClicks} → ${cNow}    difference ${did >= 0 ? '+' : ''}${did}  (floor ±${floor.toFixed(0)})`);
  console.log(`  live posts  ${ts.treatmentLive}/${ts.count} → ${tLive}/${ts.count}    control ${ts.controlLive}/${ts.count} → ${cLive}/${ts.count}    difference ${liveDid >= 0 ? '+' : ''}${liveDid}`);
  console.log('');

  const clicksCall = Math.abs(did) <= floor ? 'flat' : did > 0 ? 'up' : 'down';
  const liveCall = Math.abs(liveDid) < 2 ? 'flat' : liveDid > 0 ? 'up' : 'down';

  if (clicksCall === 'up' || liveCall === 'up') {
    console.log('  The refreshed posts beat their matched controls. The programme earns');
    console.log('  its slot in the daily rhythm. Note it does NOT say which kind of edit');
    console.log('  did it — that needs a separate, narrower test.');
  } else if (clicksCall === 'down' || liveCall === 'down') {
    console.log('  The refreshed posts did WORSE than comparable untouched posts. Stop the');
    console.log('  programme and spend the slot on new posts in the primary lane.');
  } else {
    console.log('  No measurable difference. That is the answer the plan asked for, and it');
    console.log('  means the refresh slot is not earning its place — 35 posts of effort did');
    console.log('  not separate from doing nothing. Do not restart the track on the grounds');
    console.log('  that the writing was better; the writing being better was never in doubt.');
  }

  console.log('');
  console.log('─── context ───');
  const allT = sum(base.treatment.slugs.map(now));
  const allC = sum(base.control.slugs.map(now));
  console.log(`  all ${base.treatment.count} pairs:  treatment ${base.treatment.clicks} → ${allT},  control ${base.control.clicks} → ${allC},  difference ${(allT - base.treatment.clicks) - (allC - base.control.clicks) >= 0 ? '+' : ''}${(allT - base.treatment.clicks) - (allC - base.control.clicks)}`);
  console.log(`  excluded high-click posts: ${ts.excludedPairs.map((p) => p.treatment).join(', ')}`);

  const qNow = sum(base.queueArm.slugs.map(now));
  const qLive = liveCount(base.queueArm.slugs, stats);
  console.log('');
  console.log(`  Queue arm — ${base.queueArm.count} posts we never refreshed, chosen by the same script:`);
  console.log(`    clicks ${base.queueArm.clicks} → ${qNow},  live ${base.queueArm.livePosts} → ${qLive}`);
  console.log('    If this moved as much as the treatment group, the refreshing was not the cause.');

  console.log('');
  console.log('  Per cohort (older cohorts have had longer to move):');
  for (const c of base.treatment.byCohort) {
    const nowClicks = sum(Object.keys(c.perPost).map(now));
    console.log(`    ${c.date}  ${String(c.count).padStart(2)} posts  ${String(c.clicks).padStart(3)} → ${String(nowClicks).padStart(3)}`);
  }
}

JUDGE ? judge() : writeBaseline();
