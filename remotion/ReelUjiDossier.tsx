/**
 * 우지 파동 — the first reel on the DOSSIER kit, and the first EpicKor reel that is a story
 * rather than a list.
 *
 * WHY THIS TOPIC
 *   Post `219` carries four sourced, dated beats and one closing number, which is exactly the
 *   shape DOSSIER was built for and a shape neither COUNTER nor RECEIPT can hold. It is also
 *   the single best anecdote on the site: a company destroyed by an accusation that was false,
 *   cleared eight years too late, that relaunched the accused product on the anniversary of
 *   the accusation with the incriminating ingredient printed on the front of the bag.
 *
 * EVERY BEAT IS TRANSCRIBED FROM THE POST, NOT PARAPHRASED FROM MEMORY
 *   1989-11-03  anonymous letter to prosecutors; industrial-grade beef tallow alleged;
 *               executives arrested under food-safety and public-health statutes
 *   (months)    Dobong-dong plant shut about three months; share roughly 60% -> 15%
 *   1997-08-26  Supreme Court acquits — the tallow was edible
 *   2025-11-03  삼양1963 launches, thirty-six years to the day, fried in beef tallow
 *   close       우지 6.87% printed on the front of a 131 g packet
 *   Sources on `219`: ZDNet Korea, Lawtimes, Kyunghyang Shinmun.
 *
 * ENTRY 2 SHARES ENTRY 1'S YEAR, DELIBERATELY
 *   The kit inserts a year counter only where the year advances. The collapse followed the
 *   accusation immediately, so there is no gap to cross and no counter — the reel cuts
 *   straight from the letter to the damage. The counter then runs 1989 -> 1997, which reads
 *   "8 YEARS LATER" and matches the post's "nearly eight years after the accusation" exactly.
 *   Dating the collapse to 1990 would have produced a seven-year count and quietly contradicted
 *   the article.
 *
 * PALETTE
 *   FILM_DEFAULT unchanged. The other four reels take their palette from the product, because
 *   they are about products. This one is about a legal record, so the red is a stamp red
 *   rather than a brand red, and inventing a 삼양 brand colour off an unmeasured bag would be
 *   the same mistake as pairing a cup price with a packet photo.
 */
import { ReelDossier, dossierDuration, FILM_DEFAULT, type DossierSpec } from './DossierKit';

export const UJI_SPEC: DossierSpec = {
  caseLine: 'Case file · Korea · 우지 파동',
  // Three beats that mirror the reel's own structure. Frame 0 is the grid thumbnail.
  title: ['ACCUSED.', 'DESTROYED.', 'INNOCENT.'],
  titleSub:
    "Korea's first instant-noodle company was accused of a crime in 1989, cleared in 1997, and lost three quarters of its market in between.",
  entries: [
    {
      year: 1963,
      stamp: '1963',
      head: ['KOREA’S FIRST', 'RAMYEON'],
      // One paragraph, because this card carries an exhibit and the plate starts at y920.
      body: ['삼양라면 — the first instant noodle made in Korea. By the late 1980s Samyang holds roughly 60% of the market.'],
      exhibit: {
        media: 'assets/reels/uji-dossier/media/tv-1963.png',
        ratio: 1.353,
        label: 'Exhibit A',
        caption: 'Samyang’s own 1960s television advertisement, still on their brand page: 우리나라 최초의 INSTANT 라면.',
      },
    },
    {
      year: 1989,
      stamp: '1989 · 11 · 03',
      head: ['AN ANONYMOUS', 'LETTER'],
      body: [
        'Prosecutors receive a tip: Samyang Foods fries its noodles in industrial-grade beef tallow.',
        'Executives are arrested under food-safety statutes. The press runs with it.',
      ],
      detail: 'Source · an anonymous letter',
    },
    {
      year: 1989,
      stamp: 'WITHIN 3 MONTHS',
      head: ['THE DAMAGE', 'IS INSTANT'],
      body: [
        'The Dobong-dong plant shuts for about three months.',
        'Nothing has been proven. It no longer matters.',
      ],
      figure: {
        from: 60,
        to: 15,
        unit: '%',
        // Share of a market, so the bar is scaled to 100 and starts at 60% of the track.
        // Scaled to its own maximum it would start full, which reads as "all of it".
        scale: 100,
        label: 'Market share',
        note: 'Roughly 60% to 15%. Koreans still call the whole episode 우지 파동 — the beef tallow crisis.',
      },
    },
    {
      year: 1997,
      stamp: '1997 · 08 · 26',
      head: ['THE TALLOW', 'WAS EDIBLE'],
      body: [
        'Investigators, and then the courts, find the tallow was edible.',
        'The Supreme Court acquits — nearly eight years after the accusation. By then it does not matter.',
      ],
      detail: 'Supreme Court of Korea · 26 August 1997',
    },
    {
      year: 2025,
      stamp: '2025 · 11 · 03',
      turn: true,
      head: ['THEY PICKED', 'THE DATE'],
      body: ['Samyang launches 삼양1963 — same calendar date, thirty-six years later, and fried in beef tallow. The exact ingredient.'],
      exhibit: {
        media: 'assets/reels/uji-dossier/media/pack-1963.png',
        ratio: 0.816,
        label: 'Exhibit B',
        caption: '삼양1963, 131 g. Roughly 7 million packets a month, five months in.',
      },
    },
  ],
  close: {
    label: 'Printed on the front of the bag',
    figure: '6.87%',
    media: 'assets/reels/uji-dossier/media/print-front.png',
    mediaRatio: 3.333,
    // Transcribed off the photograph above it, which is the whole point of putting it there.
    mediaCaption: '제품 중 우지 6.87%, 비프추출물 1.05%, 사골풍미분 1.02% 함유. · 131 g',
    note:
      'Not buried in a panel on the back. The ingredient that nearly destroyed the company is a line you can read on the front of the bag.',
  },
  sourceLine: 'Sources · ZDNet Korea · Kyunghyang Shinmun · Lawtimes',
  outroHook: 'WE WROTE IT\nALL DOWN.',
  outroSub:
    'Why a packet of Korean ramyeon now costs ₩1,900, what 삼양1963 and 신라면 골드 actually are, and which ones are worth suitcase space.',
};

export const UJI_DURATION = dossierDuration(UJI_SPEC);

export function ReelUjiDossier() {
  return <ReelDossier spec={UJI_SPEC} palette={FILM_DEFAULT} />;
}
