#!/usr/bin/env node
/**
 * Reel 379 — plates for the Timeline frame.
 *
 * The Timeline design carries its media in a band across the top of the frame and
 * gives the lower two-thirds to a clock, a rail and its stops. So the plates are
 * built for that band (1080x1000, with room for the pan) rather than full-bleed.
 * Only the outro plate is 9:16.
 *
 * Licensing. Every image here is **public domain**. Commons also holds an ideal
 * shot for this reel — `2008 Busan Firework Festival-Niagara1.JPG`, the cascade
 * falling from the bridge deck, which is the article's central visual claim — but
 * it is CC BY-SA 2.0 kr. ShareAlike would propagate to the whole video, which is
 * not available to brand content, so it was left out despite being the best content
 * match. Attribution-only material was also skipped rather than carry a credit in
 * frame. Do not re-litigate this without checking the licence again.
 *
 * `Busan_Firework_Festival_2008-1.jpg` is the same photographer and shoot as the
 * post's hero (RedMosQ, PD) and reads as the same picture — it is used as a
 * RESOLUTION UPGRADE of that hero, at 3648x2736 against the post's 1400x1050, not
 * as a second distinct image. The genuinely new asset is the pylon at night.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'public/assets/reels/379/media';
fs.mkdirSync(OUT, { recursive: true });

/** The media band, with pan headroom. */
const BW = 1080;
const BH = 1000;

const PLATES = [
  {
    name: 'fireworks-span.jpg',
    src: '.tmp/379src/Busan_Firework_Festival_2008-1.jpg',
    crop: { left: 350, top: 0, width: 2955, height: 2736 },
    licence: 'Public domain — RedMosQ, Wikimedia Commons',
    shows: 'fireworks along the full span of the Gwangan Bridge over a crowd of raised cameras',
  },
  {
    name: 'bridge-pylon-night.jpg',
    src: '.tmp/379src/Busan_Gwangan_Bridge_pylon_at_night_01.jpg',
    // Tightened onto the lit structure. The wider crop measured luma 46 and the
    // rendered frame came out at 35, which qa-cuts flags DARK — most of it was
    // black sky. Measured alternatives: 0,520 = 46 · 200,900 = 55 · 300,1150 = 63.
    crop: { left: 300, top: 1150, width: 1350, height: 1250 },
    licence: 'Public domain — Spike, Wikimedia Commons',
    shows: 'the lit pylon and the underside of the deck — the structure that does the launching',
  },
  {
    // A second window of the hero, on the crowd rather than the sky. It carries the
    // "nothing has been published yet" beat, where the subject is people waiting.
    name: 'crowd-waiting.jpg',
    src: '.tmp/379src/Busan_Firework_Festival_2008-1.jpg',
    // Raised from y=1900: a crop on the silhouettes alone measured luma 18, which is
    // the range that shipped a black frame on 2026-08-04. Including the burst line
    // above the heads lights it without touching the file.
    crop: { left: 1200, top: 1380, width: 903, height: 836 },
    licence: 'Public domain — RedMosQ, Wikimedia Commons',
    shows: 'raised cameras against the burst line — the crowd waiting',
  },
  {
    name: 'gwangalli-sightline.jpg',
    src: 'public/assets/images/posts/379/gwangalli-beach-bridge-sightline.jpg',
    crop: { left: 300, top: 0, width: 913, height: 845 },
    licence: 'as documented in the post',
    shows: 'the beach the paid seating is laid out on, facing the bridge broadside',
  },
  {
    // The same beach from a second window, for the payoff beat that returns to the
    // sand. Three cuts away from the first, and a different framing of it.
    name: 'gwangalli-wide.jpg',
    src: 'public/assets/images/posts/379/gwangalli-beach-bridge-sightline.jpg',
    crop: { left: 550, top: 0, width: 913, height: 845 },
    licence: 'as documented in the post',
    shows: 'the free sand, facing the same bridge',
  },
  {
    name: 'bay-from-igidae.jpg',
    src: 'public/assets/images/posts/379/gwangan-bridge-from-igidae.jpg',
    crop: { left: 250, top: 0, width: 913, height: 844 },
    licence: 'as documented in the post',
    shows: 'the whole bay from Igidae — the city that has to move around the closure',
  },
];

const report = [];

for (const p of PLATES) {
  const meta = await sharp(p.src).metadata();
  const c = p.crop;
  if (c.left + c.width > meta.width || c.top + c.height > meta.height) {
    throw new Error(`${p.name}: crop ${JSON.stringify(c)} exceeds ${meta.width}x${meta.height}`);
  }
  const dest = path.join(OUT, p.name);
  await sharp(p.src)
    .extract(c)
    .resize(BW, BH, { fit: 'cover', kernel: 'lanczos3' })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(dest);
  const stats = await sharp(dest).greyscale().stats();
  report.push({
    file: p.name, source: p.src, licence: p.licence, crop: c,
    sourceSize: `${meta.width}x${meta.height}`, size: `${BW}x${BH}`,
    upscale: Number((BW / c.width).toFixed(2)),
    luma: Math.round(stats.channels[0].mean),
    bytes: fs.statSync(dest).size, shows: p.shows,
  });
}

/** The outro is full-bleed, so it gets its own 9:16 crop of the same hero. */
{
  const dest = path.join(OUT, 'outro-fireworks.jpg');
  await sharp('.tmp/379src/Busan_Firework_Festival_2008-1.jpg')
    .extract({ left: 1050, top: 0, width: 1539, height: 2736 })
    .resize(1080, 1920, { fit: 'cover', kernel: 'lanczos3' })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(dest);
  const stats = await sharp(dest).greyscale().stats();
  report.push({
    file: 'outro-fireworks.jpg', source: '.tmp/379src/Busan_Firework_Festival_2008-1.jpg',
    licence: 'Public domain — RedMosQ', crop: null, sourceSize: '3648x2736', size: '1080x1920',
    upscale: 0.7, luma: Math.round(stats.channels[0].mean),
    bytes: fs.statSync(dest).size, shows: 'the closing image, 9:16',
  });
}

fs.writeFileSync('output/reels/2026-08-13_379/media-report.json',
  `${JSON.stringify({ slug: '379', plates: report }, null, 2)}\n`);
for (const r of report) {
  console.log(`${r.file.padEnd(24)} ${r.size.padEnd(10)} up ${String(r.upscale).padStart(5)}x  luma ${String(r.luma).padStart(3)}  ${(r.bytes / 1024).toFixed(0)}KB`);
}
