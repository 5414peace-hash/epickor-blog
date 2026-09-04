/**
 * 올리브영 — the second reel on the NEWSDESK kit, and the first that exists to
 * separate format effect from subject effect. Dongmyo could not do that alone:
 * one reel cannot tell you whether the news grammar worked or whether a market
 * with a 46% weekend swing was simply a good story.
 *
 * THE NEWS SHAPE
 *   A dated institutional figure with a reversal underneath it. Foreign
 *   customers were 2% of Olive Young's domestic offline sales in 2022 and are
 *   now about 33%; cumulative foreign spending in its Korean stores passed
 *   ₩1 trillion in August 2026, three months ahead of the company's own
 *   forecast. The payoff is the physical consequence of that number: a
 *   checkout hall where every counter carries a lit strip telling you to bring
 *   the actual passport, because a photograph of one does not work.
 *
 * WHAT WAS CUT, AND WHY
 *   The post also reports the 센트럴 명동 타운 branch at roughly 95% foreign
 *   sales. That line is NOT in the reel. The only usable photograph is titled
 *   "Olive Young Myeongdong" with no branch named, and there are nine branches
 *   in Myeongdong — so a sentence about *that* branch over *this* frame would
 *   be a claim the picture cannot support. The rule is that the specificity of
 *   the sentence matches the specificity of the frame, and here the honest
 *   level is "the checkout hall in Myeongdong".
 *
 * EVERY FIGURE IS FROM `/blog/192`, REFRESHED AND VERIFIED 2026-09-04
 *   2% (2022) -> ~33%            CJ Olive Young corporate / Korean retail coverage 2026
 *   ₩1 trillion, August 2026     same, three months ahead of company forecast
 *   fourteen lanes, the sign     read off the 4000x2584 Commons original itself
 *   ₩15,000 minimum, 5-8% back   Korean tourist VAT refund rules
 *   caps doubled 1 Jan 2024      same
 *
 * THE FOOTAGE PROBLEM
 *   Two gate passes over 1,020 candidates returned no Korean cosmetics-store
 *   interior at all. The instructive failure was the four clips whose Pexels
 *   slug says "myeongdong": three show the Bank of Korea's stone head office
 *   and one an empty paved plaza. Trusting the slug would have put a colonial
 *   -era bank under a line about a beauty chain. So one clip carries the one
 *   generic sentence, and every sentence that names Olive Young sits on a
 *   photograph of Olive Young.
 *
 *     c1  still_aisle          FILE PHOTO  opener and thumbnail. Bright K-beauty
 *                                          shelving, Korean price tags, Dr.Jart+
 *                                          / BOH / isoi signage. Chosen over the
 *                                          storefront, which is a dark night
 *                                          exterior and a weak grid thumbnail.
 *     c2  still_storefront     FILE PHOTO  the brand mark: OLIVE YOUNG, HEALTH &
 *                                          BEAUTY STORE.
 *     c3  still_makeup         FILE PHOTO  lands on "now thirty-three".
 *     c4  cut_street_night     FILE        the only generic beat - foreign
 *                                          spending. A neon Seoul street with a
 *                                          dense crowd and shopping bags. 23.976
 *                                          source remapped 1:1 to 30fps rather
 *                                          than frame-doubled.
 *     c5-c8                    FILE PHOTO  four windows onto the one Myeongdong
 *                                          photograph, each proving its own line.
 *
 *   THE FIRST CUT SHEET CAUGHT A MISMATCH IN c5-c8, AND IT IS WORTH KEEPING.
 *   One window ran 178 frames across three beats, and the narration said
 *   "Fourteen lanes" over a frame containing 11, 12 and 13. The number the
 *   sentence names was not in the picture. Re-cut to four windows:
 *     hall  (L1850 w1453, 0.74x)  queue, green wall, lanes 12-14 across the top
 *     lanes (L2520 w708, 1.53x)   13 and 14 large - the claim, shown
 *     rows  (L1500 w1100, 0.98x)  two strips repeating - "on every one"
 *     sign  (L700  w1000, 1.08x)  one strip, readable at 1:1
 *   That also lifted the cadence from 15 state changes to 17 across the same
 *   24.5 seconds of programme.
 *
 * TIMING IS MEASURED
 *   Beat frames come from silencedetect on the three rendered narration parts.
 *   Daniel ran 2.12 words/sec here against the 2.01 on record. Every beat ends
 *   where the next begins, so two captions are never live at once.
 *
 * THE OUTRO IS SPOKEN, WHICH THE PILOT'S WAS NOT
 *   The bank has required a spoken tag naming the domain since Reel 377, on the
 *   representative's 2026-08-13 instruction. Dongmyo shipped silent; that was a
 *   miss, not a choice. Here the tag is the tail of narration part 3, so forced
 *   alignment carries it and no fourth clip is needed. Bank B, not C - the same
 *   ID must not run on consecutive reels, and mistake-avoidance is the right
 *   mechanism for a story whose punchline is a thing people get wrong at the till.
 */
import { Newsdesk, type NewsSpec } from './NewsdeskKit';

const M = 'assets/reels/oliveyoung-news/media/';

export const OLIVEYOUNG_NEWS_DURATION = 855; // 28.5s at 30fps

const spec: NewsSpec = {
  breaking: 'SEOUL · RETAIL',

  cuts: [
    { src: `${M}still_aisle.jpg`, kind: 'still', from: 0, dur: 90, provenance: 'FILE PHOTO' },
    { src: `${M}still_storefront.jpg`, kind: 'still', from: 90, dur: 81, provenance: 'FILE PHOTO' },
    { src: `${M}still_makeup.jpg`, kind: 'still', from: 171, dur: 62, provenance: 'FILE PHOTO' },
    { src: `${M}cut_street_night.mp4`, kind: 'video', from: 233, dur: 175, provenance: 'FILE' },
    { src: `${M}still_checkout_hall.jpg`, kind: 'still', from: 408, dur: 78, provenance: 'FILE PHOTO' },
    { src: `${M}still_checkout_lanes.jpg`, kind: 'still', from: 486, dur: 44, provenance: 'FILE PHOTO' },
    { src: `${M}still_checkout_rows.jpg`, kind: 'still', from: 530, dur: 68, provenance: 'FILE PHOTO' },
    { src: `${M}still_checkout_sign.jpg`, kind: 'still', from: 598, dur: 138, provenance: 'FILE PHOTO' },
  ],

  beats: [
    { from: 0, dur: 171, chyron: 'TWO PERCENT', sub: '2022', caption: "In 2022, foreign shoppers were two percent of Olive Young's sales." },
    { from: 171, dur: 62, chyron: 'NOW THIRTY-THREE', caption: 'They are now thirty-three.' },
    { from: 233, dur: 132, chyron: '₩1 TRILLION', sub: 'AUGUST 2026', caption: 'Foreign spending passed one trillion won in August.' },
    { from: 365, dur: 43, chyron: 'AHEAD OF FORECAST', caption: 'Three months early.' },
    { from: 408, dur: 78, chyron: 'MYEONGDONG', sub: 'CHECKOUT HALL', caption: 'This is the checkout hall in Myeongdong.' },
    { from: 486, dur: 44, chyron: 'FOURTEEN LANES', caption: 'Fourteen lanes.' },
    { from: 530, dur: 68, chyron: 'ONE SIGN, REPEATED', caption: 'The same sign on every one.' },
    { from: 598, dur: 138, chyron: 'PHOTOS NOT ACCEPTED', sub: 'PHYSICAL PASSPORT ONLY', caption: 'Bring the actual passport. A photo does not work.' },
  ],

  // Sits exactly on its own sentence, the way Dongmyo's did.
  figure: { from: 171, dur: 62, value: 33, decimals: 0, suffix: '%', label: 'FOREIGN SHARE · WAS 2% IN 2022' },

  // Every line appears in /blog/192. A ticker carrying filler is decoration.
  ticker: [
    'OLIVE YOUNG · ABOUT 1,300 BRANCHES NATIONWIDE',
    'FOREIGN SHARE OF DOMESTIC OFFLINE SALES · 2% IN 2022 · ~33% NOW',
    'CUMULATIVE FOREIGN SPEND PASSED ₩1 TRILLION · AUGUST 2026',
    'TAX REFUND AT THE TILL · ₩15,000 MINIMUM PER STORE · 5-8% BACK',
    'IMMEDIATE-REFUND CAPS DOUBLED ON 1 JANUARY 2024',
    'PHYSICAL PASSPORT REQUIRED · A PHOTO OR PHOTOCOPY IS NOT ACCEPTED',
  ],

  outro: { from: 736, dur: 119, hook: "DON'T ORDER\nBLIND" },
};

export function ReelOliveYoungNews() {
  return <Newsdesk spec={spec} />;
}
