/**
 * Reel 376 — "The tag decides, not the app" (Split Grid, MATCH 01).
 *
 * Source post: content/blog/376.md — Korean convenience-store 1+1 and 2+1 deals.
 *
 * Nothing here is timed by hand. Each tile is pinned to the BEAT INDEX of the
 * sentence it belongs to, and `at()` resolves that against the forced-aligned
 * frames in the manifest. The first version hard-coded cut-relative frames, and
 * every one of them desynced the moment the narration gaps were re-cut to clear
 * the audio gate. Re-time with `rebuild-timeline.mjs`; this file needs no edit.
 *
 * The grid is a device, not a state (representative note 2026-08-13). Each cut
 * gets the treatment its sentence actually is:
 *
 *   1  assemble   the mosaic builds, then RESOLVES on "one plus one / two plus
 *                 one" while the 1+1 and 2+1 cards flip in on those same words, so
 *                 what the dissolve leaves behind is the photograph plus exactly
 *                 two cards. The cards sit on row 3: the plate's own pink 2+1 tags
 *                 own rows 0-1 and a card up there covers the hook's evidence.
 *   2  cards      the only cut with no photograph behind it. "No card, no coupon,
 *                 no app" is literally a list of three, so it is built as three
 *                 cards beside a photo card of the gift-card rack.
 *   3  lift       the tag wall stays whole and four tiles peel off its surface.
 *   4  lift       same, on bins that are already a lattice in the photograph.
 *   5  quiet      full bleed, hairlines only. The turn should not be busy.
 *   6  shutOpen   the seams close and dim onto the ATM, then OPEN. v003 closed and
 *                 stayed closed, which reads as ending rather than revealing.
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
    mode: 'assemble',
    kicker: 'KOREA STORE RULE',
    headline: {
      line1: 'THE TAG DECIDES,',
      line2: 'NOT THE APP',
      foot: 'Korean convenience-store deals',
      // Lifted off the default 700 so the card stack below it clears y=1340 and the
      // plate's own 2+1 tags keep the top of the frame to themselves.
      top: 580,
    },
    // The grid resolves across "One plus one." (beat 2) into "Two plus one." (beat 3)
    // and the two cards flip in on the same words, so what the dissolve leaves behind
    // is the photograph plus exactly two cards. Representative note 2026-08-13:
    // "1+1 2+1 할때 카드형식으로 바뀌는 인트로 좋았는데 그걸 없애버렸네. 그걸 살려다오."
    dissolveAt: at(1, 2, 4),
    tiles: [
      // Row 3. The real pink 2+1 tags in this plate sit in rows 0-1; a card up there
      // would cover the evidence the hook rests on.
      { i: 12, kind: 'chip', label: '1+1', at: at(1, 2) },   // "One plus one."
      { i: 15, kind: 'cyan', label: '2+1', at: at(1, 3) },   // "Two plus one."
    ],
  },
  {
    cut: 2,
    mode: 'cards',
    kicker: "WHAT YOU DON'T NEED",
    cardNote: 'Google Play · ONE store · the rack the deal ignores',
    // Straight from the post: "The register applies it when the barcodes are scanned."
    cardFoot: { label: 'THE REGISTER DOES IT', sub: 'applied when the barcodes scan' },
    tiles: [
      { i: 0, kind: 'chip', label: 'NO CARD', at: at(2, 6) },     // "No membership card."
      { i: 1, kind: 'ink', label: 'NO COUPON', at: at(2, 7) },    // "No coupon."
      { i: 2, kind: 'cyan', label: 'NO APP', sub: 'and no minimum spend', at: at(2, 8) },
    ],
  },
  {
    cut: 3,
    mode: 'lift',
    kicker: "WHERE IT'S DECIDED",
    lift: [3, 8, 14, 19],
    tiles: [
      { i: 4, kind: 'bone', label: '₩', sub: 'the tag is the rule', at: at(3, 9) },
      { i: 11, kind: 'chip', label: 'SHELF EDGE', at: at(3, 10) }, // "If the tag says it,"
      { i: 13, kind: 'ink', label: 'NO SCAN', at: at(3, 13) },     // "Nobody scans anything."
    ],
  },
  {
    cut: 4,
    mode: 'lift',
    kicker: 'THE SECOND ONE',
    lift: [2, 10, 15, 18],
    tiles: [
      { i: 7, kind: 'amber', label: 'TAKE TWO', at: at(4, 14) },
      { i: 9, kind: 'chip', label: '1+1', at: at(4, 15) },         // "a second ice cream…"
      { i: 12, kind: 'cyan', label: 'SAVE IT?', sub: 'bank it in the app', at: at(4, 16) },
    ],
  },
  {
    cut: 5,
    mode: 'quiet',
    kicker: 'THE ADVICE',
    tiles: [
      // Column 0: at i=5 this tile clipped the G of the GS25 fascia (QA v002).
      { i: 4, kind: 'bone', label: 'EVERY GUIDE', sub: 'says do this', at: at(5, 18) },
      { i: 10, kind: 'chip', label: 'BUT', at: at(5, 19) },        // "Here's the problem."
    ],
  },
  {
    cut: 6,
    mode: 'shutOpen',
    kicker: 'THE CATCH',
    tiles: [
      // Column 3 only. The ATM occupies columns 1-2, and a first pass put both
      // labels on top of it — the payoff photo hidden by the payoff copy.
      { i: 7, kind: 'chip', label: 'KOREAN ID', sub: 'required to sign up', at: at(6, 21) },
      { i: 15, kind: 'ink', label: 'APPLE LOGIN', sub: "doesn't help", at: at(6, 22) },
    ],
    // Tiles 13/14 are where the ATM body actually sits in c6-gs25-atm-tight.jpg
    // (measured: 59.3% and 24.4% ATM-blue coverage); 9/10 square the block off
    // above it. A first pass lit tile 9 alone, which spotlit the battery locker.
    keepLit: [9, 10, 13, 14],
  },
];

export const Reel376: React.FC = () => (
  <ReelSplitGrid
    manifest={M}
    ons={ONS}
    cardSrc="assets/reels/376/media/c2-giftcards-card.jpg"
    outro={{
      hook: "DON'T ORDER BLIND",
      sub: 'Which convenience-store deals actually work for visitors',
    }}
  />
);
