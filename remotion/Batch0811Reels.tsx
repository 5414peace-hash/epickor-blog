/**
 * The three Reels of the 2026-08-11 batch.
 *
 * ONS beats are placed against the forced-aligned caption frames in
 * output/reels/{slug}/caption-timings-v02.json, so a statement is on screen while
 * its sentence is being spoken and gone before the next one starts. Frame numbers
 * below are not guesses.
 *
 * v02, not v01: the first render failed qa-audio on all three with 0.65-0.81s
 * holes at part boundaries against a 0.6s limit. The design gap was only 9 frames
 * (0.30s) — the rest was ElevenLabs lead-in padding, which was trimmed and
 * re-padded at the tail so durations held, plus a small pull-forward of the
 * offending parts (D parts 3-4 by 12 frames, E parts 2-4 by 7, F parts 2-5 by 4).
 * The comment ranges above are from v01 and are within ~12 frames of v02.
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
      // "was six lanes of elevated motorway, up on concrete stilts" — f112-265
      { from: 16, to: 210, tape: 'Cheonggyecheon · Seoul', line2: 'SIX LANES', note: 'Elevated. On concrete stilts.' },
      // The signature beat. "And underneath it, sealed under a concrete lid,
      // there was a stream." — f274-377. The strike is the whole film.
      { from: 279, to: 389, tape: 'What was under it', line1: 'HIGHWAY', strike: true, line2: 'A STREAM', note: 'Buried since the 1950s', size: 118 },
      // "Five point eight kilometres… three hundred and eighty six billion won" — f816-936
      { from: 803, to: 985, tape: 'Demolished · 2003', line1: '5.84 KM', line2: '₩386.7 BN', note: 'Two years, three months', size: 116 },
      // "about three degrees cooler down here than the street up there" — f1096-1197
      { from: 1075, to: 1200, tape: 'Measured by the city', line1: 'ABOUT', line2: '3°C COOLER', note: 'than the street above', size: 112 },
    ]}
    outro={{ from: 1207, hook: "There's more", sub: 'The parts of Seoul that used to be something else' }}
    audio={[{ part: 1, startFrame: 10 }, { part: 2, startFrame: 271 }, { part: 3, startFrame: 653 }, { part: 4, startFrame: 998 }]}
  />
);

/* ---------------------------------------------------------- E sungnyemun */

export const SungnyemunReel: React.FC = () => (
  <ReelRecord
    manifest={sungnyemunManifest as Manifest}
    ons={[
      // "Except the wood you're looking at was cut in twenty thirteen." — f156-242
      { from: 16, to: 235, field: 'The wood you see', value: 'CUT IN 2013', note: 'Not 1398.' },
      // "On February tenth, two thousand eight…" — f252-596
      { from: 251, to: 423, field: '10 Feb 2008', value: 'ARSON', note: 'Paint thinner and a lighter.\nFive hours, live on national TV.' },
      // "He had done it before… a palace hall in two thousand six" — f652-748
      { from: 653, to: 908, field: 'He had done it before', value: '2006', note: 'A palace hall. Suspended sentence.\nHe walked out.' },
      // The correction, and the only stamp in the batch.
      // "National Treasure Number One? Korea scrapped those numbers…" — f1067-1281
      {
        from: 1053, to: 1283, field: 'Designation', value: '', size: 72,
        struck: 'NATIONAL TREASURE No.1', stamp: '국보 숭례문',
        note: 'Numbers dropped in 2021.\nThey came off the colonial list.',
      },
    ]}
    outro={{ from: 1289, hook: 'Locals know the rest', sub: 'What the guidebooks still get wrong about Seoul' }}
    audio={[{ part: 1, startFrame: 10 }, { part: 2, startFrame: 245 }, { part: 3, startFrame: 598 }, { part: 4, startFrame: 920 }]}
  />
);

/* ------------------------------------------------------------- F suneung */

export const SuneungReel: React.FC = () => (
  <ReelHold
    manifest={suneungManifest as Manifest}
    ons={[
      // "South Korea stops every plane in the sky." — f27-93
      { from: 18, to: 100, head: '19 Nov 2026 · 13:05 KST', rows: [{ label: 'Aircraft', status: 'HELD', alert: true }] },
      // "Aircraft hold above three kilometres. Artillery drills stop. No horns
      //  within two hundred metres of a school." — f335-490
      {
        from: 336, to: 491, head: 'For 35 minutes',
        rows: [
          { label: 'Aircraft', status: 'ABOVE 3 KM' },
          { label: 'Artillery', status: 'STOPPED', alert: true },
          { label: 'Horns', status: 'BANNED 200 M' },
        ],
      },
      // "The stock market opens an hour late… Offices start at ten. Police cars
      //  run late students to the gate." — f499-707
      {
        from: 501, to: 696, head: 'And the rest of it',
        rows: [
          { label: 'Markets', status: '10:00–16:30' },
          { label: 'Offices', status: 'START 10:00' },
          { label: 'Police', status: 'ESCORTING' },
        ],
      },
      // "about three in every ten people in that room are sitting it again" — f961-1067
      {
        from: 961, to: 1061, head: 'Who is in that room',
        rows: [
          { label: 'Registered', status: '554,174' },
          { label: 'Sitting it again', status: '28.9%', alert: true },
        ],
      },
    ]}
    // The clock leaves at f800, long before the parents cut at f1110. Its absence
    // is the point: the last beat is not data.
    clock={{ from: 296, to: 796 }}
    outro={{ from: 1242, hook: 'We wrote it all down', sub: 'Korea exam day, hour by hour' }}
    audio={[
      { part: 1, startFrame: 10 }, { part: 2, startFrame: 99 }, { part: 3, startFrame: 495 },
      { part: 4, startFrame: 794 }, { part: 5, startFrame: 1073 },
    ]}
  />
);
