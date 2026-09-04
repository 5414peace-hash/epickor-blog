/**
 * Cut plates for the Seongsu NEWSDESK reel, 1080x1920.
 *
 * Every source is 4032x3024, so a 9:16 window is 1701x3024 and the plate is a
 * pure downscale - no upscale anywhere in this reel. The only exception is the
 * Cheongdam frame, which is smaller and is measured rather than assumed.
 *
 * WINDOWS ARE CHOSEN, NOT CENTRED BY DEFAULT
 *   Two frames carry text the narration depends on: the closed shop's neon
 *   CLOSED and the old workshop's Korean signage. A centre crop that clips
 *   either one would leave a sentence unproven, which is the failure the Olive
 *   Young cut sheet caught ("Fourteen lanes" over lanes 11-13).
 */
import fs from 'node:fs';
import sharp from 'sharp';

const S = 'output/reels/2026-09-04_seongsu-news/sources';
const OUT = 'public/assets/reels/seongsu-news/media';
fs.mkdirSync(OUT, { recursive: true });

/** A 9:16 window given as a fraction of the source width (0 = left, 1 = right). */
async function window916(file, dest, xFrac = 0.5) {
  const src = `${S}/${file}`;
  const m = await sharp(src).metadata();
  const cw = Math.min(m.width, Math.round(m.height * 9 / 16));
  const left = Math.round((m.width - cw) * xFrac);
  await sharp(src)
    .extract({ left, top: 0, width: cw, height: m.height })
    .resize(1080, 1920)
    .jpeg({ quality: 92 })
    .toFile(dest);
  const scale = 1080 / cw;
  console.log(
    dest.split('/').pop().padEnd(26)
    + `${m.width}x${m.height} -> window ${cw} at x${left} -> 1080x1920 `
    + `(${scale.toFixed(2)}x${scale > 1 ? ' UPSCALE' : ''})`,
  );
}

// c1  "not in a fashion district" - the district it is not
await window916('Cheongdam_Intersection.jpg', `${OUT}/c1_cheongdam.jpg`, 0.5);
// c2  "old factories" - the workshop sign and the towers behind it
await window916('Industrial_buildings_in_Seongsu-dong.jpg', `${OUT}/c2_industrial.jpg`, 0.45);
// c3  "and now this" - the white wall and red block of concept retail
await window916('Small_intersection_in_Seongsu-dong.jpg', `${OUT}/c3_intersection.jpg`, 0.5);
// c4  the shops the visitors actually come to
await window916('Seongsu-dong_storefronts.jpg', `${OUT}/c4_storefronts.jpg`, 0.5);
// c5  "that was one day" - dusk, the day ending
await window916('Evening_street_in_Seongsu-dong.jpg', `${OUT}/c5_evening.jpg`, 0.5);
// c6  the figure
await window916('Urban_nightscape_of_Seongsu-dong.jpg', `${OUT}/c6_night.jpg`, 0.5);
// c7  the kicker - a shopfront that says CLOSED, on a building that says INDUSTRIAL
await window916('A_closed_shop_in_Seongsu-dong.jpg', `${OUT}/c7_closed.jpg`, 0.45);
