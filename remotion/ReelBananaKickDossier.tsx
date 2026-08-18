/**
 * 바나나킥 — the second reel on the DOSSIER kit.
 *
 * WHY THIS TOPIC
 *   Post `367` has the shape DOSSIER needs and the imagery to prove it: a dated origin, a
 *   claim the bag itself makes and contradicts, two dated outside events that reframe it, and
 *   one small printed number to close on. It is also the reverse of 우지 — nobody was hurt,
 *   nothing was overturned in court. The reversal is entirely in the viewer's head: they
 *   arrive believing they are looking at a banana snack.
 *
 * EVERY BEAT IS TRANSCRIBED FROM THE POST, NOT PARAPHRASED FROM MEMORY
 *   1978-05  롯데공업 renames itself 농심; Banana Kick is the first snack under the new name
 *   (same)   puffed corn, banana-shaped, thin sugar coat, 1.6% banana powder in the original
 *   2025-03  Jennie of BLACKPINK names it on a US talk show; Korean sources put the resulting
 *            jump in Nongshim's market capitalisation at roughly ₩264 billion
 *   2026-03  a 12-month-old reaches into a bag on Instagram; the clip passes 25.8m views
 *   2026-08  Nongshim prints her face on a one-off set — 바나나킥 베이비 — and will not sell it
 *   close    1.6% banana powder
 *
 * THE TURN IS THE ONE-OFF BAG, NOT THE VIRAL CLIP
 *   A snack going viral is not a reversal, it is weather. A fifty-year-old company printing a
 *   stranger's baby on packaging it has decided never to sell is a deliberate act, and it is
 *   the same species of act as 삼양 relaunching on the anniversary of its own accusation.
 *
 * ENTRY 2 SHARES ENTRY 1'S YEAR, DELIBERATELY
 *   The kit inserts a year counter only where the year advances. What is in the bag was true
 *   on day one, so there is no gap to cross — the reel cuts straight from the launch to the
 *   contents. The counters then run 1978 -> 2025 ("47 YEARS LATER", which is exactly the
 *   figure the post uses for how long it had been a staple before Jennie) and 2025 -> 2026.
 *
 * PALETTE
 *   FILM_DEFAULT unchanged, as with 우지. The bag is aggressively yellow and the plates carry
 *   that on their own; pulling the kit's own accent toward it would leave nothing for the
 *   stamp red to do, and the red is what marks the turn.
 */
import { ReelDossier, dossierDuration, FILM_DEFAULT, type DossierSpec } from './DossierKit';

export const BANANA_KICK_SPEC: DossierSpec = {
  caseLine: 'Case file · Korea · 바나나킥',
  // Three beats. The first two are what the viewer already believes, the third takes it away.
  title: ['IT IS YELLOW.', 'IT IS CURVED.', 'IT IS CORN.'],
  titleSub:
    'Korea has been selling the same yellow bag since 1978. It is 1.6% banana, and the other 98.4% is the reason a one-year-old can eat it.',
  entries: [
    {
      year: 1978,
      stamp: '1978 · 05',
      head: ['FIRST SNACK', 'AS NONGSHIM'],
      body: ['Until 1978 the company was 롯데공업. It renamed itself 농심 that May, and Banana Kick was the first snack released under the new name.'],
      exhibit: {
        media: 'assets/reels/banana-kick-dossier/media/exhibit-pack.png',
        ratio: 1.035,
        label: 'Exhibit A',
        caption: 'Nongshim’s own brand artwork. The bag’s line reads 바나나맛 그대로 — “banana taste, just as it is.”',
      },
    },
    {
      year: 1978,
      stamp: 'WHAT IS IN THE BAG',
      head: ['IT IS CORN'],
      body: ['Puffed corn, shaped like a banana, under a thin sugar coat. The banana is 1.6% powder.'],
      exhibit: {
        media: 'assets/reels/banana-kick-dossier/media/exhibit-puffs.png',
        ratio: 1.686,
        label: 'Exhibit B',
        caption: 'The curve is the design brief: a banana in the hand, corn in the mouth.',
      },
    },
    {
      year: 2025,
      stamp: '2025 · 03',
      head: ['JENNIE NAMES', 'IT ON US TV'],
      body: [
        'Nongshim’s market capitalisation jumps roughly ₩264 billion.',
        'She did not make it popular in Korea — it had been a staple for forty-seven years. She made it visible everywhere else.',
      ],
      detail: 'BLACKPINK · US talk show · March 2025',
    },
    {
      year: 2026,
      stamp: '2026 · 03',
      head: ['A BABY', 'REACHES IN'],
      // One paragraph, not two: this card carries an exhibit, so the text has to clear y920.
      body: ['Her mother says 안 되는데 — “you shouldn’t.” The clip passes 25.8 million views. She can eat it because every puff is hollow.'],
      exhibit: {
        media: 'assets/reels/banana-kick-dossier/media/exhibit-inbag.png',
        ratio: 1.517,
        label: 'Exhibit C',
        caption: 'Inside the bag she reached into. There is nothing here to bite through.',
      },
    },
    {
      year: 2026,
      stamp: '2026 · 08',
      turn: true,
      head: ['THEY PRINTED', 'HER FACE ON IT'],
      body: ['Nongshim makes one custom set — 바나나킥 베이비 — with the child’s real face on the packaging, in a bag taller than she is. Korean press reported there are no plans to sell it.'],
      detail: 'One set. Not for sale.',
    },
  ],
  close: {
    label: 'Banana powder in the original bag',
    figure: '1.6%',
    media: 'assets/reels/banana-kick-dossier/media/close-texture.png',
    mediaRatio: 3.333,
    mediaCaption: 'The other 98.4%, photographed inside the bag. Corn, air, and sugar dust.',
    note:
      'It is not competing with a banana. It is competing with the memory of one — which is why the number is not a scandal, and why the bag has not changed in nearly fifty years.',
  },
  sourceLine: 'Sources · Nongshim brand materials · Korean press, 5 August 2026',
  outroHook: 'DON’T ORDER\nBLIND.',
  outroSub:
    'What Melon Kick and Mango Kick actually are, what a bag costs in August 2026, and which Korean snacks are worth suitcase space.',
};

export const BANANA_KICK_DURATION = dossierDuration(BANANA_KICK_SPEC);

export function ReelBananaKickDossier() {
  return <ReelDossier spec={BANANA_KICK_SPEC} palette={FILM_DEFAULT} />;
}
