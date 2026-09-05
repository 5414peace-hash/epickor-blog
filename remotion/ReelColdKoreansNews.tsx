/**
 * 440 — "Why Koreans seem cold to foreigners", as a NEWSDESK reel.
 *
 * THE NEWS SHAPE: TWO OFFICIAL NUMBERS THAT DISAGREE
 *   Korea's 2025 national image survey (문체부, 26 countries, 13,000 people)
 *   put favourability at 82.3%, the highest since the survey began. The same
 *   year InterNations asked 10,085 expats who actually live abroad, and ranked
 *   Korea 39th of 46 for local friendliness. The reel reports both, then the
 *   number Koreans gave about themselves: 83.6% would not trust a stranger they
 *   had just met (문체부 의식·가치관 조사 2025, 6,180 people). The kicker is the
 *   word Koreans use for their own warmth.
 *
 * EVERY FIGURE IS FROM `/blog/440`, PUBLISHED 2026-09-05
 *   82.3% favourable (2025 국가이미지 조사) · Expat Insider 2025: 39th local
 *   friendliness, 38th finding friends, 44th overall of 46 · Koreans on Korea
 *   "kind and considerate" 62.3 vs the world's 72.5 · 83.6% would not trust a
 *   stranger, 77.2% a foreign resident.
 *
 * THE IMAGERY — ALL STILLS, ALL COMMONS, NO UPSCALE
 *   c1  c1_myeongdong  the Korea the 82% is about: a Myeongdong shopping crowd
 *   c2  c2_hongdae     the same Korea, Hongdae — tourists, K-fashion
 *   c3  c3_itaewon     "the foreigners who actually live here": Itaewon, at night
 *   c4  c4_peak        the figure counts over a packed 08:32 train
 *   c5  c5_carriage    "would not trust a stranger": a carriage, every face away
 *   c6  c6_gwangjang   "the warm ones": a Gwangjang vendor — 정 has a face,
 *                      and it is the one you get once you are a customer
 *   c7  c7_seoul_night outro: Seoul from Itaewon, Namsan lit
 *   Two of the plates (Myeongdong, Gwangjang) are the post's own images.
 *
 * TIMING IS MEASURED on the concatenated narration.wav (silencedetect
 *   -32 dB / 0.16 s). Beat frames are silence END frames; the foley builder
 *   leads them by 3-5 frames inside the silence.
 *
 * SOUND: palette `commute` — turnstile beep on the wipe, train doors on the
 *   cut, a pen tick tally under the counter, the Seoul Metro arrival chime on
 *   the sign-off. The Korea a foreigner meets first.
 *
 * OUTRO: Bank E — WE WROTE IT ALL DOWN. The other three reels in the window
 *   use B, C and D.
 */
import { Newsdesk, type NewsSpec } from './NewsdeskKit';

const M = 'assets/reels/cold-koreans-news/media/';

export const COLD_KOREANS_NEWS_DURATION = 870; // 29.0s at 30fps

const spec: NewsSpec = {
  breaking: 'SEOUL · SOCIETY',

  cuts: [
    { src: `${M}c1_myeongdong.jpg`, kind: 'still', from: 0, dur: 99, provenance: 'FILE PHOTO' },
    { src: `${M}c2_hongdae.jpg`, kind: 'still', from: 99, dur: 60, provenance: 'FILE PHOTO' },
    { src: `${M}c3_itaewon.jpg`, kind: 'still', from: 159, dur: 136, provenance: 'FILE PHOTO' },
    { src: `${M}c4_peak.jpg`, kind: 'still', from: 295, dur: 129, provenance: 'FILE PHOTO' },
    { src: `${M}c5_carriage.jpg`, kind: 'still', from: 424, dur: 162, provenance: 'FILE PHOTO' },
    { src: `${M}c6_gwangjang.jpg`, kind: 'still', from: 586, dur: 162, provenance: 'FILE PHOTO' },
    { src: `${M}c7_seoul_night.jpg`, kind: 'still', from: 748, dur: 122, provenance: 'FILE PHOTO' },
  ],

  beats: [
    { from: 0, dur: 99, chyron: 'MOST LIKED, EVER', sub: '국가이미지 조사 2025 · 26 COUNTRIES', caption: 'Korea has never been more popular abroad.' },
    { from: 99, dur: 60, chyron: '82.3% FAVOURABLE', sub: 'HIGHEST SINCE THE SURVEY BEGAN', caption: 'Eighty-two percent favourable.' },
    { from: 159, dur: 136, chyron: 'ASK THE EXPATS', sub: '이태원 · ITAEWON', caption: 'Ask the foreigners who actually live here, and it turns over.' },
    { from: 295, dur: 129, chyron: '39TH OF 46', sub: 'LOCAL FRIENDLINESS · EXPAT INSIDER 2025', caption: 'Friendliness: thirty-ninth of forty-six countries.' },
    { from: 424, dur: 100, chyron: 'NO TRUST FOR STRANGERS', sub: '한국인 6,180명 · 문체부 2025', caption: 'Koreans themselves would not trust a stranger.' },
    { from: 524, dur: 62, chyron: '84% SAY SO', sub: '처음 만난 낯선 사람 · STRANGERS', caption: 'Eighty-four percent say so.' },
    { from: 586, dur: 84, chyron: 'THE WARM ONES', sub: '정 · JEONG', caption: 'And they call themselves the warm ones.' },
    { from: 670, dur: 78, chyron: 'WHY THE GAP', sub: 'AND HOW TO GET INSIDE IT', caption: 'Why, and how to get inside.' },
  ],

  figure: { from: 295, dur: 129, value: 39, decimals: 0, suffix: 'th', label: 'OF 46 COUNTRIES · LOCAL FRIENDLINESS' },

  ticker: [
    'NATIONAL IMAGE SURVEY 2025 · 82.3% FAVOURABLE · HIGHEST SINCE 2018',
    'EXPAT INSIDER 2025 · 10,085 EXPATS · 172 NATIONALITIES · 46 DESTINATIONS',
    'KOREA · 39TH LOCAL FRIENDLINESS · 38TH FINDING FRIENDS · 44TH OVERALL',
    'KOREANS RATE KOREA "KIND" AT 62.3 · THE WORLD SAYS 72.5',
    '83.6% OF KOREANS WOULD NOT TRUST A STRANGER · 77.2% A FOREIGN RESIDENT',
    '정 LIVES INSIDE 우리 · A STRANGER STARTS OUTSIDE IT',
  ],

  outro: { from: 748, dur: 122, hook: 'WE WROTE IT\nALL DOWN' },
};

export function ReelColdKoreansNews() {
  return <Newsdesk spec={spec} />;
}
