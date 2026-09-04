/**
 * 성수 — the third NEWSDESK reel, and the one that makes the batch a batch.
 *
 * THE NEWS SHAPE: A CORRECTION
 *   The first two reels report a number. This one corrects one, which is the
 *   thing a news desk does that no other format does at all. Musinsa Megastore
 *   Seongsu opened on 24 April 2026 and took about ₩3bn of ₩7bn from foreign
 *   customers over its first fifty days - just over 40%. Several Korean outlets
 *   ran "two-thirds are foreigners" as a headline. That was 9 June, a single
 *   day's peak of 66%, not the norm. The honest figure is still remarkable, and
 *   saying so out loud is the beat the format was built for.
 *
 *   Underneath it is the reversal: Korea's biggest fashion store is not in a
 *   fashion district. It is in Seongsu, a shoe-and-leather factory quarter, and
 *   the guides still send people across the river to Apgujeong.
 *
 * EVERY FIGURE IS FROM `/blog/232`, REFRESHED AND VERIFIED 2026-09-04
 *   opened 24 April 2026, 성수이로 62, B1-4F, ~1,000 brands
 *   first fifty days 24 Apr - 13 Jun 2026: ~₩3bn of ₩7bn, just over 40%
 *   week to 13 Jun: 56%   ·   9 June single-day peak: 66%
 *   both big buildings open at 11:00, about fifteen minutes apart on foot
 *
 * THE IMAGERY, AND WHY IT IS ALL STILLS
 *   No photograph of the Musinsa building exists under a usable licence, and
 *   Commons has no Gentle Monster Seoul house either. So the reel is written at
 *   the level the pictures can support: it is about the DISTRICT, and every
 *   sentence names Seongsu rather than a building nobody can show. Commons has
 *   seven 4032x3024 frames of Seongsu by one photographer, so every plate is a
 *   pure downscale with no upscale anywhere.
 *
 *   There is no video cut at all, and that is worth stating plainly rather than
 *   padding around: no licensable Seongsu footage exists, and the 2026-08-05
 *   rule is that screen-speech agreement beats a video-share target. Seven cuts
 *   across six beats keep the cadence at about 1.5 s per state change, the same
 *   as the two reels before it.
 *
 *     c1  c1_garosugil     the district it is NOT - Garosu-gil, a queue outside
 *                          the flagship. The chyron names it and negates it,
 *                          which is the Dongmyo opening pattern; a chyron reading
 *                          "NOT A FASHION DISTRICT" over a photo of one would
 *                          have read as a claim about the picture.
 *     c2  c2_brick         "old factories" - brick industrial Seongsu, with people
 *     c3  c3_intersection  "and now this" - white wall, red block, concept retail
 *     c4  c4_crowd         the shops the visitors come for - a street full of them
 *     c5  c5_evening       "that was one day" - dusk, a day ending
 *     c6  c6_night         the figure
 *     c7  c7_closed        the kicker. A shopfront whose neon says CLOSED, on a
 *                          building whose facade says INDUSTRIAL - one frame
 *                          proving both the last line and the opening one.
 *
 * TIMING IS MEASURED
 *   Beat frames come from silencedetect on the CONCATENATED narration.wav, not
 *   from summing per-part measurements. That distinction is not academic: doing
 *   it per part is what left the Dongmyo captions up to 18 frames late, with the
 *   error growing down the reel.
 *
 * SOUND
 *   Palette `atelier` - camera shutter on the wipe, garment-bag zip on the cut,
 *   sewing machine under the counter, boutique door chime on the sign-off. Each
 *   reel gets its own vocabulary; the grammar is what stays constant.
 *
 * OUTRO
 *   Bank D - BEFORE YOU LAND. Not B or C, which the other two reels in this
 *   batch use, and the right mechanism for a story whose last line is a piece of
 *   scheduling nobody finds out until they are standing there at ten in the
 *   morning.
 */
import { Newsdesk, type NewsSpec } from './NewsdeskKit';

const M = 'assets/reels/seongsu-news/media/';

export const SEONGSU_NEWS_DURATION = 765; // 25.5s at 30fps

const spec: NewsSpec = {
  breaking: 'SEOUL · FASHION',

  cuts: [
    { src: `${M}c1_garosugil.jpg`, kind: 'still', from: 0, dur: 133, provenance: 'FILE PHOTO' },
    { src: `${M}c2_brick.jpg`, kind: 'still', from: 133, dur: 67, provenance: 'FILE PHOTO' },
    { src: `${M}c3_intersection.jpg`, kind: 'still', from: 200, dur: 76, provenance: 'FILE PHOTO' },
    { src: `${M}c4_crowd.jpg`, kind: 'still', from: 276, dur: 139, provenance: 'FILE PHOTO' },
    { src: `${M}c5_evening.jpg`, kind: 'still', from: 415, dur: 44, provenance: 'FILE PHOTO' },
    { src: `${M}c6_night.jpg`, kind: 'still', from: 459, dur: 107, provenance: 'FILE PHOTO' },
    { src: `${M}c7_closed.jpg`, kind: 'still', from: 566, dur: 84, provenance: 'FILE PHOTO' },
  ],

  beats: [
    { from: 0, dur: 133, chyron: 'NOT GAROSU-GIL', sub: '신사동 · SINSA-DONG', caption: "Korea's biggest fashion store is not in a fashion district." },
    { from: 133, dur: 143, chyron: 'IT IS SEONGSU', sub: '성수동 · SEONGDONG-GU', caption: 'It is in Seongsu — old factories, and now this.' },
    { from: 276, dur: 139, chyron: 'PRESS SAID TWO-THIRDS', caption: 'Korean headlines said two-thirds of its shoppers were foreign.' },
    { from: 415, dur: 44, chyron: 'THAT WAS ONE DAY', sub: '9 JUNE 2026', caption: 'That was one day.' },
    { from: 459, dur: 107, chyron: 'FORTY PERCENT', sub: 'FIRST 50 DAYS FROM 24 APR 2026', caption: 'Across fifty days it was forty percent.' },
    { from: 566, dur: 84, chyron: 'NOTHING OPENS BEFORE 11', caption: 'And nothing there opens before eleven.' },
  ],

  figure: { from: 459, dur: 107, value: 40, decimals: 0, suffix: '%', label: 'FOREIGN SHARE · FIRST FIFTY DAYS' },

  ticker: [
    'MUSINSA MEGASTORE SEONGSU · OPENED 24 APRIL 2026',
    '성수이로 62 · FIVE FLOORS B1-4F · ABOUT 1,000 BRANDS',
    'FIRST FIFTY DAYS · ABOUT ₩3BN OF ₩7BN FROM FOREIGN CUSTOMERS',
    'PEAK 66% ON 9 JUNE · ONE DAY, NOT THE NORM',
    'HAUS NOWHERE SEOUL · 뚝섬로 433 · OPENED SEPTEMBER 2025',
    'BOTH OPEN AT 11:00 · ABOUT FIFTEEN MINUTES APART ON FOOT',
  ],

  outro: { from: 650, dur: 115, hook: 'BEFORE YOU\nLAND' },
};

export function ReelSeongsuNews() {
  return <Newsdesk spec={spec} />;
}
