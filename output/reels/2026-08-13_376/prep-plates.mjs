#!/usr/bin/env node
/**
 * Reel 376 — build 1080x1920 full-bleed plates.
 *
 * Every source is a still, so each crop region is chosen by hand: a centre crop
 * would cut the exact object the narration names. Crop boxes are recorded here so
 * the choice is auditable.
 *
 * Assignment rule: the plate goes where its subject is SPOKEN, not where it looks
 * nicest. Two rounds of this were wrong before it settled.
 *
 *  - v001: a cup-ice freezer sat under "lug a second ice cream". Screen
 *    contradicting words, the 2026-08-05 reject. `335/cu-store-freezer.jpg` was
 *    dropped rather than given a line it does not illustrate.
 *  - v004 (representative note, 2026-08-13): "뒤에 백그라운드 이미지가 두번씩 연속으로
 *    나오는건 좀 아닌거 같다." Cuts 1-2 were two crops of one photograph and cuts 5-6
 *    were two framings of one storefront. Re-sourcing found
 *    `171/korean-convenience-store-breakfast.jpg` — a chilled shelf carrying four
 *    literal pink 2+1 tags with the 4.1~4.30 promo window printed on them, over
 *    Binggrae banana milk with green ₩1,800 tags below. It is the most direct
 *    evidence image in the cluster and it had been sitting unused. It takes the
 *    hook, everything shifts down, and cut 2 stops using a photo ground entirely.
 *
 * Rejected on purpose: `059/convenience-store-lunchbox-01.jpg` is a natural 3x2
 * grid of six lunchboxes and visually ideal for this frame, but post 376 states
 * that fresh food rarely goes 1+1 because it runs on 마감할인 markdowns instead.
 * Using it would have the screen contradict the article.
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
    name: 'c1-2plus1-tags.jpg',
    src: 'public/assets/images/posts/171/korean-convenience-store-breakfast.jpg',
    // Three of the four pink 2+1 tags, the banana-milk bottles under them, and the
    // green ₩1,800 shelf tags. Frame 0 is the Instagram grid thumbnail and "2+1"
    // has to be legible at that size, which the wide aisle shot never was.
    crop: { left: 120, top: 0, width: 525, height: 933 },
    line: 'half the fridge is wearing a sticker / one plus one / two plus one',
    shows: 'chilled shelf with four pink 2+1 tags (4.1~4.30) and ₩1,800 price tags',
  },
  {
    cut: 2,
    name: 'c2-giftcards-card.jpg',
    src: 'public/assets/images/posts/376/cu-store-interior-2plus1-freezer.jpg',
    // Not a background. Cut 2 has no photo ground — this runs as a photo card
    // inside a card layout, which is why the same source no longer reads as a
    // repeat of the aisle shot on cut 5.
    crop: { left: 600, top: 170, width: 460, height: 818 },
    line: 'no membership card / no coupon / no app, and no minimum spend',
    shows: 'Google Play and ONE store gift-card rack — the card and the app the deal does not need',
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
    name: 'c5-store-aisle.jpg',
    src: 'public/assets/images/posts/376/cu-store-interior-2plus1-freezer.jpg',
    crop: { left: 230, top: 0, width: 650, height: 1125 },
    line: 'the tip every English guide hands you / here is the problem',
    shows: 'CU aisle with the real blue 2+1 ICECREAM strip — the shop the advice is about',
  },
  {
    cut: 6,
    name: 'c6-gs25-atm-tight.jpg',
    src: 'public/assets/images/posts/376/gs25-storefront-seoul-atm.jpg',
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

const sources = new Set(report.map((r) => r.source));
console.log(`${report.length} plates from ${sources.size} source photographs`);
for (const r of report) {
  console.log(
    `C${r.cut} ${r.file.padEnd(24)} up ${String(r.upscale).padStart(4)}x  luma ${String(r.luma).padStart(3)}  ${(r.bytes / 1024).toFixed(0)}KB`,
  );
}
