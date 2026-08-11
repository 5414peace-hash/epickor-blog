/**
 * The three Reels of the 2026-08-11 batch. Second pass, after representative review.
 *
 * ONS beats are placed against the forced-aligned caption frames in
 * output/reels/{slug}/caption-timings-v02.json, so a statement is on screen while
 * its sentence is being spoken and gone before the next one starts. Frame numbers
 * below are not guesses, and the comment ranges are the actual aligned beats.
 *
 * What changed in this pass:
 *  - Every reel now ends on a spoken CTA instead of a silent card. Suneung was the
 *    worst case: narration stopped at f1201 and the card sat there for 7.3 seconds
 *    of silence, which is what the representative heard as the ending being cut off.
 *  - Suneung opens on a centred thumbnail card. Its old opening ONS was one board
 *    row reading "Aircraft HELD", which is unreadable at grid size.
 *  - Cheonggyecheon's cut plan was rebuilt around 7 distinct sources instead of 3.
 *
 * Outro hooks use three different psychological mechanisms, per
 * output/reels/outro-cta-bank.md, so a viewer who sees all three in one week is
 * not sold the same way three times:
 *   D THERE'S MORE          open loop
 *   E LOCALS KNOW THE REST  insider knowledge
 *   F WE WROTE IT ALL DOWN  reassurance
 */
import cheonggyecheonManifest from '../output/reels/cheonggyecheon/render-manifest.json';
import sungnyemunManifest from '../output/reels/sungnyemun/render-manifest.json';
import suneungManifest from '../output/reels/suneung/render-manifest.json';
import { ReelExcavation, ReelHold, ReelRecord, type Manifest } from './Batch0811Kit';

/* ------------------------------------------------------ D cheonggyecheon */

export const CheonggyecheonReel: React.FC = () => (
  <ReelExcavation
    manifest={cheonggyecheonManifest as Manifest}
    ons={[
      // "was six lanes of elevated motorway, up on concrete stilts" — f109-199
      { from: 96, to: 258, label: 'Cheonggyecheon · Seoul', value: 'SIX LANES', note: 'Elevated. On concrete stilts.' },
      // The signature beat. The lid lifts at ONS frame 40-62, i.e. f315-337, and
      // "there was a stream" is spoken at f329-371.
      {
        from: 275, to: 440, label: 'What was under it',
        then: 'HIGHWAY', value: 'A STREAM', note: 'Buried since the 1950s', lift: true, size: 112,
      },
      // "Three hundred and eighty six billion won" — f874-921
      { from: 795, to: 985, label: 'Demolished · 2003', value: '₩386.7 BN', note: '5.84 km · two years, three months' },
      // "about three degrees cooler down here than the street up there" — f1075-1177
      { from: 1068, to: 1220, label: 'Measured by the city', value: '3°C COOLER', note: 'than the street above' },
    ]}
    outro={{ from: 1288, hook: "There's more", sub: 'The parts of Seoul that used to be something else' }}
    audio={[
      { part: 1, startFrame: 10 }, { part: 2, startFrame: 271 }, { part: 3, startFrame: 653 },
      { part: 4, startFrame: 998 }, { part: 5, startFrame: 1293 },
    ]}
  />
);

/* ---------------------------------------------------------- E sungnyemun */

export const SungnyemunReel: React.FC = () => (
  <ReelRecord
    manifest={sungnyemunManifest as Manifest}
    ons={[
      // "at was cut in twenty thirteen" — f182-237. The value types in at f158-178,
      // just ahead of the line, which is the same small lead the captions use.
      { from: 138, to: 243, field: 'The wood you see', value: 'CUT IN 2013', note: 'Not 1398.' },
      // "On February tenth, two thousand eight… paint thinner and a lighter" — f245-398
      { from: 248, to: 440, field: '10 Feb 2008', value: 'ARSON', note: 'Paint thinner and a lighter.\nFive hours, live on national TV.' },
      // "He had done it before… a palace hall in two thousand six" — f645-741
      { from: 640, to: 800, field: 'He had done it before', value: '2006', note: 'A palace hall. Suspended sentence.\nHe walked out.' },
      // The correction, and the only seal in the batch. The strike completes at
      // f1108 and the 낙관 lands f1108-1120, against "Korea scrapped those numbers
      // in twenty twenty-one" at f1105-1182.
      {
        from: 1050, to: 1292, field: 'Designation', value: '', size: 54,
        struck: 'NATIONAL TREASURE No.1', stamp: '국보 숭례문',
        note: 'Numbers dropped in 2021.\nThey came off the colonial list.',
      },
    ]}
    outro={{ from: 1344, hook: 'Locals know the rest', sub: 'What the guidebooks still get wrong about Seoul' }}
    audio={[
      { part: 1, startFrame: 10 }, { part: 2, startFrame: 245 }, { part: 3, startFrame: 598 },
      { part: 4, startFrame: 920 }, { part: 5, startFrame: 1350 },
    ]}
  />
);

/* ------------------------------------------------------------- F suneung */

export const SuneungReel: React.FC = () => (
  <ReelHold
    manifest={suneungManifest as Manifest}
    ons={[
      // The thumbnail. Legible at frame 0 by design — see HeroCard.
      {
        from: 0, to: 152,
        hero: {
          eyebrow: 'Korea · Exam Day',
          line1: 'One day',
          line2: 'decides the rest',
          sub: 'and a whole country stops for it',
        },
      },
      // "Aircraft hold above three kilometres. Artillery drills stop. No horns
      //  within two hundred metres of a school." — f331-486
      {
        from: 326, to: 492, head: 'For 35 minutes',
        rows: [
          { label: 'Aircraft', status: 'ABOVE 3 KM' },
          { label: 'Artillery', status: 'STOPPED', alert: true },
          { label: 'Horns', status: 'BANNED 200 M' },
        ],
      },
      // "The stock market opens an hour late… Offices start at ten. Police cars
      //  run late students to the gate." — f495-699
      {
        from: 492, to: 700, head: 'And the rest of it',
        rows: [
          { label: 'Markets', status: '10:00–16:30' },
          { label: 'Offices', status: 'START 10:00' },
          { label: 'Police', status: 'ESCORTING' },
        ],
      },
      // "about three in every ten people in that room are sitting it again" — f957-1063
      {
        from: 950, to: 1066, head: 'Who is in that room',
        rows: [
          { label: 'Registered', status: '554,174' },
          { label: 'Sitting it again', status: '28.9%', alert: true },
        ],
      },
    ]}
    // The clock leaves at f800, long before the parents cut at f1070. Its absence
    // is the point: the last beat is not data.
    clock={{ from: 296, to: 800 }}
    // Starts at f1234, after the parents cut ends at f1230 — that cut carries the
    // payoff and must not have a CTA card over the man mid-prayer.
    outro={{ from: 1234, hook: 'We wrote it\nall down', sub: 'Korea exam day, hour by hour' }}
    audio={[
      { part: 1, startFrame: 10 }, { part: 2, startFrame: 99 }, { part: 3, startFrame: 495 },
      { part: 4, startFrame: 794 }, { part: 5, startFrame: 1073 }, { part: 6, startFrame: 1213 },
    ]}
  />
);
