#!/usr/bin/env node
/**
 * Reel 376 — build 1080x1920 full-bleed plates for the Split Grid frame.
 *
 * Every source is a still, so each crop region is chosen by hand: the mosaic
 * needs a full-bleed image, and a centre crop would cut the exact object the
 * narration names. Crop boxes are recorded here so the choice is auditable.
 *
 * Assignment rule: the plate goes where its subject is SPOKEN, not where it
 * looks nicest. A first pass put the ice-cream bins on cut 2 and a cup-ice
 * freezer on cut 4 under the line "lug a second ice cream" — screen contradicting
 * words, the exact 2026-08-05 reject. Re-mapping fixed it without touching the
 * narration; `335/cu-store-freezer.jpg` (bagged ice and cup ice, half empty) was
 * dropped entirely rather than given a line it does not illustrate.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const OUT = 'public/assets/reels/376/media';
fs.mkdirSync(OUT, { recursive: true });

const W = 1080;
const H = 1920;

const PLATES = [
  {
    cut: 1,
    name: 'c1-2plus1-freezer.jpg',
    src: 'public/assets/images/posts/376/cu-store-interior-2plus1-freezer.jpg',
    crop: { left: 230, top: 0, width: 650, height: 1125 },
    line: 'half the fridge is wearing a sticker / one plus one / two plus one',
    shows: 'CU ice-cream freezer carrying the real blue 2+1 product strip',
  },
  {
    cut: 2,
    name: 'c2-app-giftcards.jpg',
    src: 'public/assets/images/posts/376/cu-store-interior-2plus1-freezer.jpg',
    // Deliberate second derivative of the cut-1 source: a different region and a
    // different subject. Saved under its own path so no image path repeats.
    crop: { left: 590, top: 150, width: 478, height: 850 },
    line: 'no membership card / no coupon / no app, and no minimum spend',
    shows: 'Google Play and ONE store gift-card rack — the card and the app the deal does not need, both physically in frame',
  },
  {
    cut: 3,
    name: 'c3-shelf-tags.jpg',
    src: 'public/assets/images/posts/376/gs25-shelf-edge-price-tags.jpg',
    crop: { left: 137, top: 0, width: 825, height: 1467 },
    line: 'settled right at the shelf edge / if the tag says it',
    shows: 'GS25 shelf-edge price tags with real won prices',
  },
  {
    cut: 4,
    name: 'c4-icecream-bins.jpg',
    src: 'public/assets/images/posts/335/cu-store-ice-cream-section.jpg',
    crop: { left: 175, top: 0, width: 1050, height: 1866 },
    line: 'lug a second ice cream around Seoul all afternoon',
    shows: 'freezer bins of Korean ice cream — the second one you would be carrying',
  },
  {
    cut: 5,
    name: 'c5-gs25-storefront.jpg',
    src: 'public/assets/images/posts/376/gs25-storefront-seoul-atm.jpg',
    // Cropped below the HONEY GYM fascia: the first pass let a gym sign dominate
    // the frame on a convenience-store line (QA 2026-08-13).
    crop: { left: 250, top: 260, width: 605, height: 1075 },
    line: 'the tip every English guide hands you / here is the problem',
    shows: 'GS25 Yeoksam storefront — the chain whose app the guides recommend',
  },
  {
    cut: 6,
    name: 'c6-gs25-atm-tight.jpg',
    src: 'public/assets/images/posts/376/gs25-storefront-seoul-atm.jpg',
    // Push-in on the same storefront: the payoff lands tighter than its setup.
    crop: { left: 430, top: 560, width: 436, height: 775 },
    line: 'signing up runs through Korean identity verification',
    shows: 'the bank ATM in the GS25 doorway — identity hardware, in frame on the payoff line',
  },
];

const report = [];

for (const plate of PLATES) {
  const meta = await sharp(plate.src).metadata();
  const c = plate.crop;
  if (c.left + c.width > meta.width || c.top + c.height > meta.height) {
    throw new Error(`${plate.name}: crop box ${JSON.stringify(c)} exceeds ${meta.width}x${meta.height}`);
  }
  const dest = path.join(OUT, plate.name);
  await sharp(plate.src)
    .extract({ left: c.left, top: c.top, width: c.width, height: c.height })
    .resize(W, H, { fit: 'cover', position: 'centre', kernel: 'lanczos3' })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(dest);

  const stats = await sharp(dest).greyscale().stats();
  report.push({
    cut: plate.cut,
    file: plate.name,
    source: plate.src,
    crop: c,
    sourceSize: `${meta.width}x${meta.height}`,
    upscale: Number((W / c.width).toFixed(2)),
    luma: Math.round(stats.channels[0].mean),
    line: plate.line,
    shows: plate.shows,
    bytes: fs.statSync(dest).size,
  });
}

fs.writeFileSync(
  'output/reels/2026-08-13_376/media-report.json',
  `${JSON.stringify({ slug: '376', width: W, height: H, plates: report }, null, 2)}\n`,
);

for (const r of report) {
  console.log(
    `C${r.cut} ${r.file.padEnd(26)} up ${String(r.upscale).padStart(4)}x  luma ${String(r.luma).padStart(3)}  ${(r.bytes / 1024).toFixed(0)}KB`,
  );
}
