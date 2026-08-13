/**
 * Reel 376 — "The tag decides, not the app" (Split Grid, MATCH 01).
 *
 * Source post: content/blog/376.md — Korean convenience-store 1+1 and 2+1 deals.
 *
 * Nothing here is timed by hand. Each tile is pinned to the BEAT INDEX of the
 * sentence it belongs to, and `at()` resolves that against the forced-aligned
 * frames in the manifest. The first version hard-coded cut-relative frames, and
 * every one of them desynced the moment the narration gaps were re-cut to clear
 * the audio gate — which is exactly the failure this indirection removes. Re-time
 * the narration with `rebuild-timeline.mjs`; this file needs no edit when you do.
 *
 * Plate assignment follows the same discipline: each photo sits on the cut where
 * its subject is SPOKEN. A first pass had a cup-ice freezer under "lug a second
 * ice cream" — screen contradicting words, the 2026-08-05 reject — and was
 * re-mapped rather than narrated around. See prep-plates.mjs.
 */
import manifest from '../output/reels/2026-08-13_376/render-manifest.json';
import { ReelSplitGrid, type CutOns, type Manifest } from './SplitGridKit';

const M = manifest as Manifest;

/** Root reads this so the composition length can never drift from the manifest. */
export const REEL_376_FRAMES = M.durationInFrames;

/**
 * Cut-relative frame for the beat a tile belongs to, pulled slightly ahead so the
 * card is standing when the phrase lands — the same small lead the captions use.
 */
function at(cut: number, beat: number, lead = 8) {
  const from = M.cuts.find((c) => c.n === cut)?.from;
  if (from === undefined) throw new Error(`Reel376: no cut ${cut} in manifest`);
  const b = M.beats[beat];
  if (!b) throw new Error(`Reel376: no beat ${beat} in manifest`);
  return Math.max(2, b.startFrame - from - lead);
}

const ONS: CutOns[] = [
  {
    cut: 1,
    kicker: 'KOREA STORE RULE',
    headline: {
      line1: 'THE TAG DECIDES,',
      line2: 'NOT THE APP',
      foot: 'Korean convenience-store deals',
    },
    tiles: [
      { i: 4, kind: 'chip', label: '1+1', at: at(1, 2) },   // "One plus one."
      { i: 7, kind: 'cyan', label: '2+1', at: at(1, 3) },   // "Two plus one."
    ],
  },
  {
    cut: 2,
    kicker: "WHAT YOU DON'T NEED",
    tiles: [
      { i: 4, kind: 'chip', label: 'NO CARD', at: at(2, 6) },     // "No membership card."
      { i: 6, kind: 'ink', label: 'NO COUPON', at: at(2, 7) },    // "No coupon."
      { i: 13, kind: 'cyan', label: 'NO APP', sub: 'and no minimum', at: at(2, 8) },
    ],
  },
  {
    cut: 3,
    kicker: "WHERE IT'S DECIDED",
    tiles: [
      { i: 4, kind: 'bone', label: '₩', sub: 'the tag is the rule', at: at(3, 9) },
      { i: 11, kind: 'chip', label: 'SHELF EDGE', at: at(3, 10) }, // "If the tag says it,"
      { i: 13, kind: 'ink', label: 'NO SCAN', at: at(3, 13) },     // "Nobody scans anything."
    ],
  },
  {
    cut: 4,
    kicker: 'THE SECOND ONE',
    tiles: [
      { i: 7, kind: 'amber', label: 'TAKE TWO', at: at(4, 14) },
      { i: 9, kind: 'chip', label: '1+1', at: at(4, 15) },         // "a second ice cream…"
      { i: 12, kind: 'cyan', label: 'SAVE IT?', sub: 'bank it in the app', at: at(4, 16) },
    ],
  },
  {
    cut: 5,
    kicker: 'THE ADVICE',
    tiles: [
      // Column 0: at i=5 this tile clipped the G of the GS25 fascia (QA v002).
      { i: 4, kind: 'bone', label: 'EVERY GUIDE', sub: 'says do this', at: at(5, 18) },
      { i: 10, kind: 'chip', label: 'BUT', at: at(5, 19) },        // "Here's the problem."
    ],
  },
  {
    cut: 6,
    kicker: 'THE CATCH',
    tiles: [
      // Column 3 only. The ATM occupies columns 1-2, and a first pass put both
      // labels on top of it — the payoff photo hidden by the payoff copy.
      { i: 7, kind: 'chip', label: 'KOREAN ID', sub: 'required to sign up', at: at(6, 21) },
      { i: 15, kind: 'ink', label: 'APPLE LOGIN', sub: "doesn't help", at: at(6, 22) },
    ],
    // The seams close and the grid dims to a 2x2 spotlight as the gate is named.
    // Tiles 13/14 are where the ATM body actually sits in c6-gs25-atm-tight.jpg
    // (measured: 59.3% and 24.4% ATM-blue coverage); 9/10 square the block off
    // above it. A first pass lit tile 9 alone, which spotlit the battery locker.
    slamShut: true,
    keepLit: [9, 10, 13, 14],
  },
];

export const Reel376: React.FC = () => (
  <ReelSplitGrid
    manifest={M}
    ons={ONS}
    outro={{
      hook: "DON'T ORDER BLIND",
      sub: 'Which convenience-store deals actually work for visitors',
    }}
  />
);
