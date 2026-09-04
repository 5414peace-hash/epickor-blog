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
  // .rotate() with no argument applies the EXIF orientation tag. sharp ignores it
  // otherwise, and three of the candidates for this reel are portrait frames that
  // came out on their side in the review sheet before this was added.
  const src = await sharp(`${S}/${file}`).rotate().toBuffer();
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

/* c1, c2 and c4 were replaced on 2026-09-04 after the representative rejected
   them: "성수는 1,2,4 번째 이미지 들이 다 너무 별로다". They were an empty
   boulevard with nothing but sky and road, a hazy drab workshop, and a beige
   cafe that was not fashion at all. The replacements each show people and
   commerce, which is what all three sentences are actually about. */

// c1  "not in a fashion district" - so the frame has to BE a fashion district.
//     Garosu-gil, with a queue outside the flagship. The chyron reads NOT
//     GAROSU-GIL, which is the Dongmyo opening pattern: name what is on screen,
//     then negate it. A chyron saying "NOT A FASHION DISTRICT" over a photo of
//     one would have read as a claim about the picture.
await window916('Apple_가로수길_01.jpg', `${OUT}/c1_garosugil.jpg`, 0.5);
// c2  "old factories" - brick industrial Seongsu with people in it
await window916('Seongsu_Street_01.jpg', `${OUT}/c2_brick.jpg`, 0.5);
// c3  "and now this" - the white wall and red block of concept retail
await window916('Small_intersection_in_Seongsu-dong.jpg', `${OUT}/c3_intersection.jpg`, 0.5);
// c4  the shops the visitors actually come to - a street full of them
await window916('Seongsu_Street.jpg', `${OUT}/c4_crowd.jpg`, 0.5);
// c5  "that was one day" - dusk, the day ending
await window916('Evening_street_in_Seongsu-dong.jpg', `${OUT}/c5_evening.jpg`, 0.5);
// c6  the figure
await window916('Urban_nightscape_of_Seongsu-dong.jpg', `${OUT}/c6_night.jpg`, 0.5);
// c7  the kicker - a shopfront that says CLOSED, on a building that says INDUSTRIAL
await window916('A_closed_shop_in_Seongsu-dong.jpg', `${OUT}/c7_closed.jpg`, 0.45);
