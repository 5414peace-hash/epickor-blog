/**
 * 동묘 — the first reel on the NEWSDESK kit.
 *
 * WHY THIS TOPIC FOR THE PILOT
 *   It is an actual news story, which is the difference between a format and a parody. Seoul
 *   Metro published its first-half 2026 ridership analysis on 23 July: Dongmyo-ap averages
 *   28,785 boardings on a weekend day against 19,673 on a weekday, up 46.3%, the largest gap of
 *   any station in the city, and the company itself named the flea market as the cause. Second
 *   place is a stadium. Hongdae, the district everyone knows, swings 8.7%.
 *
 *   The arc underneath it is the reason it holds for 26 seconds. In December 2024 Korean
 *   business media ran the market's obituary — a thirty-year vendor telling The Scoop it "feels
 *   finished", clothing down to 3.9% of household spending, used-clothing supply to wholesalers
 *   off 20-30%. Then foreign shoppers arrived. English coverage tells only the second half.
 *
 * EVERY FIGURE IS FROM `/blog/242`, WHICH WAS REFRESHED 2026-09-03 AND VERIFIED LIVE
 *   28,785 / 19,673 / +46.3%      Seoul Metro, released 23 July 2026
 *   obituary, December 2024        The Scoop, 11 December 2024
 *   ₩1,000                         read off the handwritten cards in the photograph used in b8
 *   Exit 3, five minutes, ~600 stalls, Saturday-afternoon restock, cash-only street piles
 *                                  Seoul Metropolitan Government media hub
 *
 * THE FOOTAGE PROBLEM, AND HOW EACH CUT ANSWERS IT
 *   No licensable Dongmyo video exists. The gate ran 440 candidates over five queries and the
 *   two clean passes are generic Korean market footage; the instructive rejection was 34267123,
 *   4K and Korea-named, whose market sits along both kerbs so the 9:16 band keeps the empty road
 *   and throws the market away. So the rule is that a sentence naming Dongmyo gets a photograph
 *   OF Dongmyo, and only the generic sentences get generic clips:
 *
 *     b1-b2  cut1_station    FILE       "Seoul's busiest weekend station" — a Seoul platform,
 *                                       generic sentence, generic frame, honest.
 *     b3     still_b3        FILE PHOTO "it is Dongmyo" — the actual market, yellow 동묘의 빈티지
 *                                       sign in frame. Named place, real place.
 *     b4-b5  cut2_market     FILE       36718310, a covered Korean market arcade with a crowd
 *                                       and hangul signage. Carries the figure, not a claim.
 *     b6     still_b6        ARCHIVE    the obituary beat. Real Dongmyo stalls, dated label.
 *     b7     cut3_streetday  FILE       a Korean market street: red-awning stalls, a crowd
 *                                       moving through frame, GS25 signage, an exit marker.
 *                                       Third choice. 6120423 and 8565200 acted the beat better
 *                                       but turned out to be European flea markets, and 29078493
 *                                       was Korea but let Sungnyemun dominate the frame, which
 *                                       shows a viewer a different famous place while the line
 *                                       is about this one. Country match beats action; not
 *                                       naming the wrong landmark beats both.
 *     b8     still_b8        FILE PHOTO the kicker. Re-cropped from the 4032px Commons original
 *                                       rather than the 1180px blog asset, so the handwriting is
 *                                       readable rather than merely present, and sized y60..1180
 *                                       to meet the lower third instead of floating in black.
 *
 *   THE KICKER LINE WAS WRONG AND THE FRAME CAUGHT IT. The first cut said "shirts start at one
 *   thousand won", which is true of the market -- the piles run 1,000-5,000 won -- and is NOT
 *   what this photograph shows. Enlarged, its cards read 13,000 / 10,000 / 8,000 / 5,000: the
 *   folded-stall tier, on trousers. Shipping it would have been the exact screen-speech mismatch
 *   that got the 2026-08-04 batch rejected, committed by the person who built the provenance
 *   system to stop it. The narration was re-recorded to describe the frame, and 1,000 won moved
 *   to the ticker where it is a stated fact rather than a claim about what is on screen.
 *
 * THE KICKER IS A STILL, AND THAT WAS A DECISION
 *   2026-07-21 says a payoff must be a visual reveal rather than a board. A legible handwritten
 *   price card is a reveal of information the viewer can check, not an information graphic, and
 *   there is no Dongmyo video to reveal instead. Flagged to the representative before build and
 *   approved. If it reads wrong on the phone review, the fallback is to close on cut3 and move
 *   the price into the chyron.
 *
 * TWO REPAIRS AFTER THE FIRST SHIP (2026-09-04, found while building NEWSDESK 002)
 *   1. The outro was SILENT. The CTA bank has required a spoken tag naming the
 *      domain since Reel 377, on the representative's 2026-08-13 instruction --
 *      a viewer watching with sound cannot read a chip. Added as narration part
 *      4 rather than by regenerating part 3, because parts 1-3 are what every
 *      beat frame below was measured from and re-rendering them would move all
 *      eight. The tag lands at f732 against an outro that opens at f729, so the
 *      picture leads the voice by three frames, which is the intended feel.
 *   2. cut2 carried `credit: 'SEOUL METRO'`. The kit renders that as
 *      `SOURCE: SEOUL METRO` over a Pexels clip of a generic Korean market.
 *      Seoul Metro is the source of the ridership FIGURE, not of the picture.
 *      On a format whose entire premise is labelling provenance honestly, that
 *      was the one label that lied. Removed.
 *
 * TIMING IS MEASURED, NOT PLANNED
 *   The beat frames below come from silencedetect on the three rendered narration parts, not
 *   from a word-count estimate. Daniel reads at 2.01 words/sec, the first script overran by two
 *   seconds, beat 4 gave up four words, and these are the boundaries of the audio that exists.
 *   Every beat ends where the next begins, so two captions are never live at once.
 */
import { Newsdesk, type NewsSpec } from './NewsdeskKit';

const M = 'assets/reels/dongmyo-news/media/';

export const DONGMYO_NEWS_DURATION = 860; // 28.7s at 30fps

const spec: NewsSpec = {
  breaking: 'SEOUL · TRANSIT',

  cuts: [
    { src: `${M}cut1_station.mp4`, kind: 'video', from: 0, dur: 179, provenance: 'FILE' },
    { src: `${M}still_b3_dongmyo-street.jpg`, kind: 'still', from: 179, dur: 92, provenance: 'FILE PHOTO' },
    { src: `${M}cut2_market.mp4`, kind: 'video', from: 271, dur: 175, provenance: 'FILE' },
    { src: `${M}still_b6_dongmyo-crowd.jpg`, kind: 'still', from: 446, dur: 123, provenance: 'ARCHIVE' },
    { src: `${M}cut3_streetday.mp4`, kind: 'video', from: 569, dur: 63, provenance: 'FILE' },
    { src: `${M}still_b8_prices.jpg`, kind: 'still', from: 632, dur: 97, provenance: 'FILE PHOTO' },
  ],

  beats: [
    { from: 0, dur: 124, chyron: 'NOT HONGDAE', caption: "Seoul's busiest weekend subway station is not Hongdae." },
    { from: 124, dur: 55, chyron: 'NOT GANGNAM EITHER', caption: 'It is not Gangnam.' },
    { from: 179, dur: 92, chyron: 'IT IS DONGMYO', sub: '동묘앞 · LINE 1 / LINE 6', caption: 'Seoul Metro says it is Dongmyo.' },
    { from: 271, dur: 116, chyron: 'WEEKENDS RUN BUSIER', sub: '28,785 vs 19,673', caption: 'Weekends run more than forty-six percent busier there.' },
    { from: 387, dur: 59, chyron: 'BIGGEST JUMP IN SEOUL', caption: 'The biggest jump in Seoul.' },
    { from: 446, dur: 123, chyron: 'DECLARED FINISHED', sub: 'DEC 2024', caption: 'Korean media wrote its obituary in 2024.' },
    { from: 569, dur: 63, chyron: 'THEN THEY CAME BACK', caption: 'Then foreign shoppers arrived.' },
    { from: 632, dur: 97, chyron: 'TROUSERS ₩8,000', sub: 'PRICED BY HAND', caption: 'Handwritten cards. Eight thousand won.' },
  ],

  // Sits on the market cut, not on the platform, so the number arrives with the crowd.
  figure: { from: 271, dur: 116, value: 46.3, decimals: 1, prefix: '+', suffix: '%', label: 'WEEKEND VS WEEKDAY' },

  // Every line is a fact that appears in /blog/242. A ticker that carries filler is decoration.
  ticker: [
    'DONGMYO-AP · WEEKEND 28,785 · WEEKDAY 19,673',
    'HIGHEST WEEKEND INCREASE OF ANY SEOUL STATION',
    'MARKET OPEN YEAR-ROUND · NO CLOSING DAY',
    'NEW STOCK ARRIVES SATURDAY AFTERNOON',
    'STREET PILES ARE CASH ONLY · CLOTHING MOUNDS FROM ₩1,000',
    'EXIT 3 · ABOUT FIVE MINUTES ON FOOT · ~600 STALLS',
  ],

  // Bank C. The outro bank assigns the insider mechanism to culture and on-the-ground knowledge,
  // which is exactly what a market whose restock day is the useful fact trades in.
  outro: { from: 729, dur: 131, hook: 'LOCALS KNOW\nTHE REST' },
};

export function ReelDongmyoNews() {
  return <Newsdesk spec={spec} />;
}
