/**
 * Build every cut plate for the Olive Young NEWSDESK reel at 1080x1920.
 *
 * WHY PLATES RATHER THAN LETTING THE KIT CROP
 *   NewsdeskKit renders each cut with objectFit:'cover' into 1080x1920. For a
 *   landscape source that keeps a centre sliver and throws the rest away, and
 *   for a 1080x1440 portrait it upscales 1.33x before cropping. Deciding the
 *   window here means the framing is chosen rather than inherited.
 *
 * THE SIGN CROP WAS CHOSEN BY READING IT, NOT BY LOOKING AT A THUMBNAIL
 *   left=700 is not arbitrary. At left=1000 the strip reads "SICAL PASSPORT",
 *   at 560 it loses "TAX REFUND"; only 700 fits the whole phrase
 *   "PREPARE YOUR PHYSICAL PASSPORT (FOR IMMEDIATE TAX REFUND)". This was
 *   checked at 1:1 pixels, because the Dongmyo kicker proved a contact sheet
 *   will happily show text you cannot actually read.
 *
 * THE FLOOR AT THE BOTTOM IS DELIBERATE
 *   tokens/core.ts puts the lower third at y1180, the ticker at y1348 and the
 *   caption at y1410. Empty tiling under y1180 is not wasted frame, it is the
 *   bed those three graphics sit on.
 */
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';

const D = 'output/reels/2026-09-04_oliveyoung-news';
const S = `${D}/sources`;
const OUT = 'public/assets/reels/oliveyoung-news/media';
fs.mkdirSync(OUT, { recursive: true });

/** Fit the whole image inside 1080x1920 over a blurred cover of itself. Used
 *  only where a 9:16 crop would destroy the subject or demand a big upscale. */
async function blurPlate(src, dest) {
  const bg = await sharp(src).resize(1080, 1920, { fit: 'cover' }).blur(38)
    .modulate({ brightness: 0.55 }).toBuffer();
  const fg = await sharp(src).resize(1080, 1920, { fit: 'inside' }).toBuffer();
  const m = await sharp(fg).metadata();
  await sharp(bg)
    .composite([{ input: fg, left: Math.round((1080 - m.width) / 2), top: Math.round((1920 - m.height) / 2) }])
    .jpeg({ quality: 92 }).toFile(dest);
  console.log('blur-plate', dest, `(source ${(await sharp(src).metadata()).width}x${(await sharp(src).metadata()).height})`);
}

/** A true 9:16 window of a large original: chosen crop, then downscale only. */
async function window9x16(src, dest, left, top, width) {
  const height = Math.round(width * 16 / 9);
  await sharp(src).extract({ left, top, width, height }).resize(1080, 1920)
    .jpeg({ quality: 93 }).toFile(dest);
  console.log('window   ', dest, `${width}x${height} -> 1080x1920 (${(1080 / width).toFixed(2)}x)`);
}

await blurPlate(`${S}/OliveYoung_store.png`, `${OUT}/still_storefront.jpg`);
await blurPlate(`${S}/OliveYoung_Skin-care_zone.jpg`, `${OUT}/still_aisle.jpg`);
await blurPlate(`${S}/OliveYoung_Make-up_zone.jpg`, `${OUT}/still_makeup.jpg`);

/* Four windows onto one 4000x2584 photograph, because one window could not
   support four sentences. The first cut sheet showed the narration saying
   "Fourteen lanes" over a frame containing 11, 12 and 13 - the number the
   sentence names was not in the picture - and one still holding for 178 frames
   across three beats. Distinct derivative assets with their own paths are
   allowed; identical repeats are not. Each window below exists to prove its
   own sentence:
     hall  -> "This is the checkout hall in Myeongdong."  queue, green wall,
              and lanes 12-14 across the top
     lanes -> "Fourteen lanes."                            13 and 14 large
     rows  -> "The same sign on every one."                two strips repeating
     sign  -> the kicker                                   one strip, readable */
await window9x16(`${S}/Olive_Young_Myeongdong.jpg`, `${OUT}/still_checkout_hall.jpg`, 1850, 0, 1453);
await window9x16(`${S}/Olive_Young_Myeongdong.jpg`, `${OUT}/still_checkout_lanes.jpg`, 2520, 0, 708);
await window9x16(`${S}/Olive_Young_Myeongdong.jpg`, `${OUT}/still_checkout_rows.jpg`, 1500, 500, 1100);
await window9x16(`${S}/Olive_Young_Myeongdong.jpg`, `${OUT}/still_checkout_sign.jpg`, 700, 600, 1000);

/* Video. 3840x2160 -> centre crop 1215x2160 -> 1080x1920, so no upscale.
   The source is 23.976fps and the composition is 30. Duplicating every fourth
   frame to reach 30 is the judder CLAUDE.md forbids, so instead each source
   frame becomes exactly one output frame: setpts=PTS/1.2513 with -r 30. Motion
   runs 25% quicker, which on a walking crowd reads as brisk rather than wrong,
   and nothing is duplicated or interpolated.
   Window 3.9s-12.2s: before 3.9 a passer-by's back fills the frame, and after
   about 12 another one does. 200 frames encoded, 175 used - the tail is safety. */
execFileSync('ffmpeg', ['-v', 'error', '-ss', '3.9', '-i', `${D}/candidate-videos/31801692.mp4`,
  '-t', '8.35', '-vf', 'crop=1215:2160:(iw-1215)/2:0,scale=1080:1920,setpts=PTS/1.2513',
  '-r', '30', '-an', '-c:v', 'libx264', '-crf', '16', '-preset', 'slow', '-pix_fmt', 'yuv420p',
  '-y', `${OUT}/cut_street_night.mp4`], { stdio: 'inherit' });
const probe = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0',
  '-show_entries', 'stream=width,height,r_frame_rate,nb_read_frames', '-count_frames',
  '-of', 'csv=p=0', `${OUT}/cut_street_night.mp4`]).toString().trim();
console.log('video    ', `${OUT}/cut_street_night.mp4`, probe);
