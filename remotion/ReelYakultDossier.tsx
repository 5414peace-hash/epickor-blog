/**
 * 야쿠르트 & the COCO cart — the third reel on the DOSSIER kit.
 *
 * WHY THIS TOPIC
 *   Post `362` carries two separate reversals, and both are things a visitor to Korea has
 *   physically seen and misread. The drink is not the thing they think it is, and the vehicle
 *   it arrives on is legally not the thing it looks like. The second one is the better card:
 *   a 220-litre refrigerator doing 4 km/h is, under the 도로교통법, a moped — licence, helmet,
 *   and banned from the pavement. That fact comes from Korean-language sources with no English
 *   equivalent, which is the whole EpicKor proposition in one card.
 *
 * EVERY BEAT IS TRANSCRIBED FROM THE POST, NOT PARAPHRASED FROM MEMORY
 *   1971     arrives in Korea as a joint venture with Japan's Yakult Honsha; 65 ml bottle,
 *            the waisted polystyrene shape a 1968 design by Isamu Kenmochi
 *   (same)   액상발효유 vs 호상발효유 — one production step, homogenisation after fermentation
 *   2019-03  야쿠르트 아줌마 becomes 프레시 매니저 at hy's 50th-anniversary event
 *   2026-04  ~11,000 Fresh Managers, down from a peak of ~13,000 in 2021
 *   (law)    도로교통법 classes COCO as 원동기장치자전거 — licence, helmet, roadway only
 *   close    2 — the number of Fresh Managers on Ulleungdo
 *
 * THE LAW CARD CARRIES NO DATE, ON PURPOSE
 *   It is standing law rather than an event, so its stamp names the statute instead of a day,
 *   exactly as 우지's collapse card was stamped WITHIN 3 MONTHS. Its `year` matches the card
 *   before it so the kit does not insert a counter between two things that did not advance.
 *
 * THE COUNTERS ARE THE POINT OF PUTTING 1971 FIRST
 *   1971 -> 2019 renders as 48 YEARS LATER, which is how long the job kept the same informal
 *   name before hy changed it, and 2019 -> 2026 as 7 YEARS LATER.
 *
 * PALETTE
 *   FILM_DEFAULT unchanged, as with the first two. The side-profile plate is already shot on
 *   black by hy Mobility, so it sits on the film ground with no treatment at all.
 */
import { ReelDossier, dossierDuration, FILM_DEFAULT, type DossierSpec } from './DossierKit';

export const YAKULT_SPEC: DossierSpec = {
  caseLine: 'Case file · Korea · 야쿠르트 & 코코',
  title: ['A FRIDGE.', 'IN TRAFFIC.', 'BY LAW.'],
  titleSub:
    'Korea’s 야쿠르트 아줌마 rides a 220-litre electric refrigerator. The Road Traffic Act classes it as a moped — licence, helmet, and off the pavement.',
  entries: [
    {
      year: 1971,
      stamp: '1971',
      head: ['IT HAS BEEN', 'HERE 55 YEARS'],
      body: [
        'Yakult arrives in Korea as a joint venture with Japan’s Yakult Honsha, in a 65 ml bottle.',
        'The waisted shape is not Korean and not new: it is a 1968 design by Isamu Kenmochi.',
      ],
      detail: 'hy — 한국야쿠르트 until the 2021 rebrand',
    },
    {
      year: 1971,
      stamp: 'WHAT IS IN THE BOTTLE',
      head: ['IT IS NOT', 'YOGURT'],
      body: ['One production step splits Korean fermented milk in two: homogenise after fermentation and it pours. Skip it and you need a spoon.'],
      exhibit: {
        media: 'assets/reels/yakult-dossier/media/exhibit-bottle.png',
        ratio: 1.12,
        label: 'Exhibit A',
        caption: '야쿠르트 프리미엄 라이트, gold seal intact. The glass is the evidence: it pours.',
      },
    },
    {
      year: 2019,
      stamp: '2019 · 03',
      head: ['SHE HAS', 'A JOB TITLE'],
      body: ['At hy’s 50th-anniversary event the 야쿠르트 아줌마 is renamed 프레시 매니저. Most Koreans still say the old name.'],
      exhibit: {
        media: 'assets/reels/yakult-dossier/media/exhibit-cart.png',
        ratio: 0.981,
        label: 'Exhibit B',
        caption: 'COCO — “Cold & Cool.” A 220-litre fridge that does 4 or 8 km/h and runs 10+ hours per charge.',
      },
    },
    {
      year: 2026,
      stamp: '2026 · 04',
      head: ['THE NETWORK', 'IS SHRINKING'],
      body: ['About 5,500 of them cover Seoul, Gyeonggi and Gangwon. Ninety are on Jeju.'],
      figure: {
        from: 13,
        to: 11,
        unit: 'k',
        // Scaled to the 2021 peak, so the bar reads as a decline from a known high rather than
        // as a full track. Written in thousands because the counter has no digit grouping.
        scale: 13,
        label: 'Fresh Managers',
        note: 'Roughly 13,000 at the 2021 peak, about 11,000 by April 2026. One forecast puts the point where delivery robots undercut people at 2028–2030.',
      },
    },
    {
      year: 2026,
      stamp: '도로교통법 · 원동기장치자전거',
      turn: true,
      head: ['IT IS A MOPED', 'BY LAW'],
      body: ['Licence mandatory, helmet required, pavement banned. So a 4 km/h refrigerator is legally obliged to share a lane with cars doing 50.'],
      exhibit: {
        media: 'assets/reels/yakult-dossier/media/exhibit-cart-side.png',
        ratio: 1.383,
        label: 'Exhibit C',
        caption: 'The side profile is the argument: a chest freezer with a steering column.',
      },
    },
  ],
  close: {
    label: 'Fresh Managers on Ulleungdo',
    figure: '2',
    hangul: '울릉도 · 2명',
    note:
      'Ulleungdo is a volcanic island in the East Sea, several hours by ferry. Two people run this route there. The network is not a Seoul marketing flourish — it reaches places that barely have a bus timetable.',
  },
  sourceLine: 'Sources · hy · 여성신문 · Korean industry reporting, April 2026',
  outroHook: 'LOCALS KNOW\nTHE REST.',
  outroSub:
    'What is actually in the 65 ml bottle, what it costs this month, how to find a cart, and what Koreans do with it that nobody tells visitors.',
};

export const YAKULT_DURATION = dossierDuration(YAKULT_SPEC);

export function ReelYakultDossier() {
  return <ReelDossier spec={YAKULT_SPEC} palette={FILM_DEFAULT} />;
}
