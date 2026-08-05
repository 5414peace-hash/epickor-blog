/**
 * The three category Reels. Structure and the reason for the Remotion rebuild
 * are documented in HubReel.tsx.
 *
 * Round 2 (2026-08-05), from representative review of v011:
 *
 *  - **A place or a product gets its name as the punch line, large.** v011 put
 *    "Bukchon" and "Ikseon-dong" in the 23px kicker, and the narration never
 *    says either name, so a viewer had no way to tell one neighbourhood from
 *    the next. Name cards now run at size 140 (punch ~160px) and are numbered,
 *    so the section change is legible in the first half second.
 *  - **Every reel plays on past the last spoken word.** v011 ended 0.23s after
 *    narration, which read as the file simply stopping. Narration part 5 is a
 *    spoken CTA, force-aligned like the rest, under a held closing card.
 *
 * Outro hooks come from output/reels/outro-cta-bank.md and use three different
 * mechanisms across the batch (friction removal / mistake avoidance / insider
 * knowledge) so a viewer who sees all three in one week is not sold the same
 * way three times.
 */
import drinksManifest from '../output/reels/hub-drinks/render-manifest.json';
import ramyunManifest from '../output/reels/hub-ramyun/render-manifest.json';
import seoulManifest from '../output/reels/hub-seoul/render-manifest.json';
import { HubReel, type Manifest, type OnsBeat } from './HubReel';

/** Name cards run large; explanatory statements sit at the normal weight. */
const NAME = 140;

/* ------------------------------------------------------------------ drinks */

/**
 * Cuts 1-6 hold the COCO cart through the whole spec run, one angle per line.
 * Representative direction: "스펙 얘기할때는 그 전동카트를 계속 보여주는게 좋지
 * 않겠어? 여러 각도에서 보여주면 지루함도 없을거고."
 *
 * 220 litres is the refrigerated compartment specifically — hy Mobility's spec
 * table gives 260 L total as 220 L at 0-10°C plus 40 L at 0-25°C.
 */
const DRINKS_ONS: OnsBeat[] = [
  { from: 14, to: 150, kicker: 'Seoul roads', topLine: 'THIS IS A', punch: 'REFRIGERATOR', sub: '220 litres, and it does 8 km/h' },
  { from: 236, to: 320, kicker: 'And legally', punch: 'A MOPED', sub: 'Licence and helmet required', size: NAME },
  { from: 390, to: 546, kicker: 'Who rides one', topLine: '11,000', punch: 'FRESH MANAGERS', sub: 'Everyone still says "yogurt lady"' },
  { from: 620, to: 760, kicker: 'Product 01 · not yogurt', punch: 'YAKULT', sub: 'The curd is broken on purpose, so it pours', size: NAME },
  { from: 812, to: 995, kicker: 'Product 02 · says cider', punch: 'CHILSUNG', sub: 'No apples. Clear lemon-lime, on shelves since 1950.', size: NAME },
  { from: 1000, to: 1150, kicker: 'The actual order', topLine: 'SPRITE CAME', punch: '11 YEARS LATE', sub: '1961. Chilsung got there first.' },
  { from: 1160, to: 1250, kicker: 'Product 03 · by the till', punch: 'BACCHUS', sub: "The little brown bottle isn't what it looks like", size: NAME },
  { from: 1255, to: 1350, kicker: 'Past 1,000 mg of taurine', punch: "IT'S A DRUG", sub: 'The strong one sits behind a pharmacy counter' },
  { from: 1419, to: 1480, kicker: 'Product 04 · what you can buy', punch: 'VITA 500', sub: 'The weaker one, on the open shelf', size: NAME },
];

export const HubDrinksReel: React.FC = () => (
  <HubReel
    manifest={drinksManifest as Manifest}
    ons={DRINKS_ONS}
    outro={{ from: 1539, hook: 'No paywall. No app.', sub: 'The whole Korean drinks aisle, decoded' }}
    audio={[
      { part: 1, startFrame: 10 }, { part: 2, startFrame: 320 }, { part: 3, startFrame: 762 },
      { part: 4, startFrame: 1157 }, { part: 5, startFrame: 1596 },
    ]}
  />
);

/* ------------------------------------------------------------------ ramyun */

const RAMYUN_ONS: OnsBeat[] = [
  { from: 112, to: 192, kicker: 'The scary one', topLine: '4,400 SHU', punch: 'BULDAK', sub: 'The noodle your feed cries over', size: NAME },
  { from: 261, to: 420, kicker: 'What Koreans actually use', topLine: '10,000 SHU', punch: 'CHEONGYANG', sub: 'Sliced raw into soup, straight from the fridge', size: NAME },
  { from: 504, to: 606, kicker: 'So', punch: 'NOT HALFWAY', sub: "Buldak doesn't reach the pepper in a grandmother's stew" },
  { from: 712, to: 835, kicker: 'What actually sells', topLine: '26% OF KOREA', punch: 'JIN RAMEN', sub: 'And the mild one is mild enough for five-year-olds', size: NAME },
  { from: 960, to: 1080, kicker: 'The free bowl', punch: 'ALWAYS JIN', sub: 'Ottogi held the price still for 13 years', size: NAME },
];

export const HubRamyunReel: React.FC = () => (
  <HubReel
    manifest={ramyunManifest as Manifest}
    ons={RAMYUN_ONS}
    outro={{ from: 1272, hook: "Don't order blind", sub: 'Every Korean ramyun, ranked by published Scoville' }}
    audio={[
      { part: 1, startFrame: 10 }, { part: 2, startFrame: 199 }, { part: 3, startFrame: 615 },
      { part: 4, startFrame: 923 }, { part: 5, startFrame: 1315 },
    ]}
  />
);

/* ------------------------------------------------------------------- seoul */

/**
 * Numbered name cards. The narration never says "Ikseon-dong" or "Yeonnam-dong"
 * out loud, so without these the reel is five unlabelled neighbourhoods.
 */
const SEOUL_ONS: OnsBeat[] = [
  { from: 14, to: 190, kicker: 'Seoul', topLine: 'NO TOURISTS', punch: 'AFTER 5PM', sub: '₩100,000 fine, and they do collect it' },
  { from: 250, to: 340, kicker: 'Neighbourhood 01', topLine: 'THIS IS', punch: 'BUKCHON', sub: 'People live here. Those are houses.', size: NAME },
  { from: 542, to: 685, kicker: 'The Seoul rule', topLine: 'LOOKS LIKE', punch: 'AN ATTRACTION?', sub: "Then it usually isn't", size: 100 },
  { from: 693, to: 800, kicker: 'Neighbourhood 02', topLine: 'THIS IS', punch: 'IKSEON-DONG', sub: 'Looks 300 years old. Built in the 1920s.', size: NAME },
  { from: 956, to: 1055, kicker: 'Neighbourhood 03', topLine: 'THIS IS', punch: 'YEONNAM-DONG', sub: 'The park is a buried railway — six kilometres of it', size: NAME },
  { from: 1128, to: 1235, kicker: 'Neighbourhood 04', topLine: 'THIS IS', punch: 'MULLAE', sub: 'A working steel district, with artists in it', size: NAME },
  { from: 1272, to: 1385, kicker: 'Neighbourhood 05', topLine: 'THIS IS', punch: 'EULJIRO', sub: 'Tools by day, bars by night. No sign anywhere.', size: NAME },
];

export const HubSeoulReel: React.FC = () => (
  <HubReel
    manifest={seoulManifest as Manifest}
    ons={SEOUL_ONS}
    outro={{ from: 1452, hook: 'Locals know the rest', sub: 'All twelve Seoul neighbourhoods, compared' }}
    audio={[
      { part: 1, startFrame: 10 }, { part: 2, startFrame: 247 }, { part: 3, startFrame: 690 },
      { part: 4, startFrame: 1125 }, { part: 5, startFrame: 1503 },
    ]}
  />
);
