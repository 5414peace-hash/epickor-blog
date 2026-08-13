/**
 * Reel 379 — "The bridge is the launcher" (Timeline, MATCH 03).
 *
 * NOTE on `at`: the readout is the page HEADER, not a punchline, so it comes up
 * early in its cut. A first pass pinned each one to the beat that speaks its
 * number, which left cut 3 blank for 4.4s of a 6.9s cut. Only cut 2 is delayed,
 * because "the deck itself is the launch platform" is a reveal.
 *
 * Source post: content/blog/379.md — Busan Fireworks Festival 2026.
 *
 * Timed from beat indices as with 376 and 377; `rebuild-timeline.mjs` owns the
 * frames. The rail head is the one thing set by hand, because it is an editorial
 * claim about where each sentence sits in the calendar rather than a timing.
 *
 * The head moves BACKWARDS between cuts 2 and 3, from November to August. That is
 * the reel's argument drawn: the show is 7 November, and the only thing the viewer
 * has to act on falls in late August. Do not "fix" it into a monotonic sweep.
 *
 * Every figure here is 2025 fact or an explicitly hedged 2026 projection. The 2026
 * ticket details have not been published — the official notice board has not moved
 * since November 2025 — so the HUD carries `2025 PATTERN / 2026 UNCONFIRMED` on the
 * cuts that touch tickets, and the readout on cut 4 says LATE AUG under a label
 * that names it as a projection.
 */
import manifest from '../output/reels/2026-08-13_379/render-manifest.json';
import { ReelTimeline, type CutFrame, type Manifest, type Stop } from './TimelineKit';

const M = manifest as Manifest;

/** Root reads this so the composition length can never drift from the manifest. */
export const REEL_379_FRAMES = M.durationInFrames;

const media = (f: string) => `assets/reels/379/media/${f}`;

function at(cut: number, beat: number, lead = 8) {
  const from = M.cuts.find((c) => c.n === cut)?.from;
  if (from === undefined) throw new Error(`Reel379: no cut ${cut} in manifest`);
  const b = M.beats[beat];
  if (!b) throw new Error(`Reel379: no beat ${beat} in manifest`);
  return Math.max(2, b.startFrame - from - lead);
}

/** The event calendar. These are the real 2025 dates; 2026's are unpublished. */
const STOPS: Stop[] = [
  { label: 'LATE AUG', at: 0.04 },   // early-bird window, 2025: opened 22 Aug
  { label: '1 SEP', at: 0.34 },      // general sale, 2025: 2:00pm, YES24 / BNK
  { label: 'NOV 7', at: 1 },         // the night itself, 2026 — the one confirmed date
];

const FRAMES: CutFrame[] = [
  {
    cut: 1,
    src: media('fireworks-span.jpg'),
    hud: ['GWANGALLI · BUSAN', '21ST FESTIVAL'],
    readout: 'NOV 7',
    label: 'The bridge is the launcher',
    head: 1,
    at: 6,
    pan: 'left',
  },
  {
    cut: 2,
    src: media('bridge-pylon-night.jpg'),
    hud: ['GWANGAN BRIDGE', 'THE DECK'],
    // The post says "along its 7.4km span"; a more precise figure than the source
    // carries would be my invention. Korean coverage calls the cascade the Niagara.
    readout: '7.4 KM',
    label: 'of span, firing. Korea calls it the Niagara.',
    head: 1,
    at: at(2, 3, 20),
    pan: 'right',
  },
  {
    cut: 3,
    src: media('gwangalli-sightline.jpg'),
    hud: ['PAID SEATING · 2025', '2026 UNCONFIRMED'],
    readout: '1 MIN',
    label: 'Early-bird sold out, 2025',
    head: 0.04,
    at: 8,
    pan: 'left',
  },
  {
    cut: 4,
    src: media('crowd-waiting.jpg'),
    hud: ['2025 PATTERN', '2026 UNCONFIRMED'],
    readout: 'LATE AUG',
    label: 'When to watch, if 2026 follows',
    head: 0.04,
    at: 8,
    pan: 'right',
  },
  {
    cut: 5,
    src: media('bay-from-igidae.jpg'),
    hud: ['FESTIVAL DAY', 'GWANGAN BRIDGE'],
    readout: 'CLOSED',
    label: 'Explosives, from a motorway',
    head: 1,
    at: 8,
    pan: 'left',
  },
  {
    cut: 6,
    src: media('gwangalli-wide.jpg'),
    hud: ['THE REST OF THE BEACH', 'FREE'],
    readout: '14,000',
    label: 'paid seats. The rest is sand.',
    head: 1,
    at: 8,
    pan: 'right',
  },
];

export const Reel379: React.FC = () => (
  <ReelTimeline
    manifest={M}
    frames={FRAMES}
    stops={STOPS}
    outro={{
      hook: 'BEFORE\nYOU LAND',
      sub: 'Where to stand, and when the tickets actually go',
      src: media('outro-fireworks.jpg'),
    }}
  />
);
