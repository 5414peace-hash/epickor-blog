/**
 * Reel 377 — "Korea made them prove it" (Spec Sheet, MATCH 02).
 *
 * Source post: content/blog/377.md — Korean hangover drinks (숙취해소제).
 *
 * As with 376, nothing is timed by hand: every `at` resolves a BEAT INDEX against
 * the forced-aligned frames in the manifest. Re-time the narration with
 * `rebuild-timeline.mjs` and this file needs no edit.
 *
 * The page sequence follows the argument rather than the assets:
 *
 *   1 specimen  the seven-stick rack, the shelf you cannot read
 *   2 specimen  the 1992 bottle, carrying the BEFORE / AFTER correction
 *   3 lineup    four more SKUs, under the 44% market figure
 *   4 callout   back to the sticks, tight, with a leader line to the badge
 *   5 specimen  the pill format, under the regulation itself
 *   6 tally     28 / 25 / 3 — and NO product, on purpose (see below)
 *   — outro     해장국, the morning-after remedy, under a spoken close
 *
 * Cut 6 carries no pack shot because the narration there says three products
 * failed. Neither the article nor the Korean reporting names them, so putting any
 * branded package under that sentence would accuse a company the evidence does not
 * accuse. The tally page exists for that reason, not for variety.
 *
 * Cut 4 returns to the cut-1 source. That is narratively required — the line is
 * "now look near the bottom of the stick" — and the framings are a full rack versus
 * a tight badge crop, two cuts apart.
 */
import manifest from '../output/reels/2026-08-13_377/render-manifest.json';
import { ReelSpecSheet, type CutPage, type Manifest } from './SpecSheetKit';

const M = manifest as Manifest;

/** Root reads this so the composition length can never drift from the manifest. */
export const REEL_377_FRAMES = M.durationInFrames;

const media = (f: string) => `assets/reels/377/media/${f}`;

function at(cut: number, beat: number, lead = 8) {
  const from = M.cuts.find((c) => c.n === cut)?.from;
  if (from === undefined) throw new Error(`Reel377: no cut ${cut} in manifest`);
  const b = M.beats[beat];
  if (!b) throw new Error(`Reel377: no beat ${beat} in manifest`);
  return Math.max(2, b.startFrame - from - lead);
}

const PAGES: CutPage[] = [
  {
    mode: 'specimen',
    cut: 1,
    kicker: 'KOREA · CONVENIENCE STORE',
    index: '숙취해소제',
    title: 'The shelf beside the till',
    sub: 'sukchwi-haeso-je · hangover relief',
    src: media('sticks.png'),
    // Seven products across; a portrait box shrank the rack to a stripe.
    wide: true,
    rows: [
      { label: 'Category since', value: '1992', at: at(1, 1) },
      { label: 'Market, per year', value: '₩350 bn', at: at(1, 3) },
      { label: 'Price, Aug 2026', value: '₩3,600–3,900', at: at(1, 4) },
    ],
  },
  {
    mode: 'specimen',
    cut: 2,
    kicker: 'THE TIMING',
    index: '음주 전',
    title: 'Taken before. Not after.',
    src: media('bottle-green.png'),
    rows: [
      { label: 'Condition', value: 'BEFORE', at: at(2, 6), cert: true },
      { label: 'Yeomyeong 808', value: 'BEFORE', at: at(2, 6, 2), cert: true },
      { label: 'Heutgae drinks', value: 'AFTER', at: at(2, 7) },
    ],
    headline: { line1: 'ON THE WAY IN,', line2: 'NOT THE WAY HOME' },
  },
  {
    mode: 'lineup',
    cut: 3,
    kicker: 'THE ONE THAT STARTED IT',
    index: '컨디션',
    title: 'Condition, 1992',
    sub: 'HK inno.N · number one for 33 straight years',
    items: [
      { src: media('bottle-ceo.png'), label: 'CEO', at: at(3, 8) },
      { src: media('bottle-lady.png'), label: 'Lady', at: at(3, 9) },
      { src: media('bottle-sparkling.png'), label: 'Zero sparkling', at: at(3, 9, 2) },
      { src: media('bottle-zero.png'), label: 'Zero grapefruit', at: at(3, 10) },
    ],
    figure: { value: '44%', label: 'of the Korean market, still', at: at(3, 11) },
  },
  {
    mode: 'callout',
    cut: 4,
    kicker: 'ON THE PACKAGE',
    index: '인체적용시험완료',
    title: 'The badge nobody reads',
    src: media('sticks-badge.png'),
    // Measured against the render: the badge row sits around y=560 in this crop.
    anchor: { x: 392, y: 560 },
    note: {
      label: '숙취개선효과 인체적용시험완료',
      body: 'Hangover-improvement effect: human trial completed',
      at: at(4, 13),
    },
  },
  {
    mode: 'specimen',
    cut: 5,
    kicker: 'THE RULE',
    index: 'MFDS',
    title: 'Prove it, on humans',
    sub: 'Ministry of Food and Drug Safety',
    src: media('pill-sachet.png'),
    rows: [
      { label: 'In force from', value: '1 Jan 2025', at: at(5, 15) },
      { label: 'Evidence required', value: '인체적용시험', at: at(5, 17), cert: true },
      { label: 'Or', value: 'human-trial review', at: at(5, 17, 2) },
    ],
    headline: { line1: 'NO EVIDENCE,', line2: 'NO CLAIM' },
  },
  {
    mode: 'tally',
    cut: 6,
    kicker: 'THE REVIEW',
    index: '28 → 3',
    title: 'What the ministry found',
    entries: [
      { value: '28', label: 'products reviewed', tone: 'ink', at: at(6, 19) },
      { value: '25', label: 'cleared the bar', tone: 'cert', at: at(6, 19, 2) },
      { value: '3', label: 'barred from the claim, from 2026', tone: 'red', at: at(6, 20) },
    ],
    // The post is explicit that this governs advertising, not efficacy. The reel
    // must not let a number imply the survivors are proven cures.
    foot: 'A floor on advertising honesty — not a medical endorsement.',
  },
];

export const Reel377: React.FC = () => (
  <ReelSpecSheet
    manifest={M}
    pages={PAGES}
    outro={{
      hook: 'LOCALS KNOW\nTHE REST',
      sub: 'Which one to grab, and what Korea made them prove',
      src: media('haejangguk.jpg'),
    }}
  />
);
