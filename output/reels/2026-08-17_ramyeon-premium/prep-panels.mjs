/**
 * Build the three product panels for the premium-ramyeon reel.
 *
 * PAD, DO NOT CROP. The kit's slot is a 0.535 portrait, and these packets are 0.79-0.82.
 * Cropping to the slot ratio would cut the left and right edges off a ramyeon packet,
 * which is where the brand mark and the Hangul live — the same product-identity failure
 * as the Torriden crop that read "Torrid". So each pack is trimmed tight to itself and
 * then padded on the top and bottom to reach 0.535, which keeps the whole pack and gives
 * every block an identical slot. The margin reads as a product card, which is the
 * shelf-tag metaphor the kit is built on anyway.
 *
 * Trimming is done by measured deviation from the border colour, not `sharp.trim()`,
 * which keys off the top-left pixel and has cropped into a subject before (2026-08-05).
 *
 * Run after dropping the two missing packs into output/packshots-incoming/. Files that
 * are not there yet are reported and skipped, so this is safe to run repeatedly.
 */
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';

const OUT = 'public/assets/reels/ramyeon-premium/media';
mkdirSync(OUT, { recursive: true });

const RATIO = 0.535;
/** Panel ground. Warm paper so a white pack shot does not float on pure white. */
const PAD = { r: 250, g: 245, b: 236 };

const JOBS = [
  {
    id: 'shin-standard',
    src: 'public/assets/images/posts/093/shin-ramyun-bag-official.jpg',
  },
  {
    id: 'shin-gold',
    src: 'output/packshots-incoming/shin-ramyun-gold-packet-official.jpg',
    alt: ['output/packshots-incoming/shin-ramyun-gold-packet-official.png'],
    note: 'request item 3',
  },
  {
    id: 'samyang-1963',
    src: 'output/packshots-incoming/samyang-1963-packet-official.jpg',
    alt: ['output/packshots-incoming/samyang-1963-packet-official.png'],
    note: 'request item 4',
  },
];

let missing = 0;

for (const job of JOBS) {
  const src = [job.src, ...(job.alt || [])].find((p) => existsSync(p));
  if (!src) {
    console.log(`SKIP  ${job.id.padEnd(14)} not dropped yet (${job.note})`);
    missing++;
    continue;
  }

  const { data, info } = await sharp(src).flatten({ background: PAD }).raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  // Border median as the sweep colour, sampled on all four edges.
  const edge = [];
  for (let x = 0; x < W; x += 4) for (const y of [0, 1, H - 2, H - 1]) edge.push(data[(y * W + x) * C]);
  for (let y = 0; y < H; y += 4) for (const x of [0, 1, W - 2, W - 1]) edge.push(data[(y * W + x) * C]);
  edge.sort((a, b) => a - b);
  const bg = edge[edge.length >> 1];

  const colHits = new Uint32Array(W);
  const rowHits = new Uint32Array(H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const o = (y * W + x) * C;
      const dev = Math.max(
        Math.abs(data[o] - bg), Math.abs(data[o + 1] - bg), Math.abs(data[o + 2] - bg));
      if (dev > 10) { colHits[x]++; rowHits[y]++; }
    }
  }
  const first = (a, min) => a.findIndex((v) => v >= min);
  const last = (a, min) => { for (let i = a.length - 1; i >= 0; i--) if (a[i] >= min) return i; return -1; };
  const x0 = first(colHits, Math.max(3, H * 0.006));
  const x1 = last(colHits, Math.max(3, H * 0.006));
  const y0 = first(rowHits, Math.max(3, W * 0.006));
  const y1 = last(rowHits, Math.max(3, W * 0.006));
  if (x1 < 0 || y1 < 0) throw new Error(`${job.id}: nothing measured`);

  const pw = x1 - x0 + 1;
  const ph = y1 - y0 + 1;
  const pack = await sharp(src).flatten({ background: PAD })
    .extract({ left: x0, top: y0, width: pw, height: ph }).toBuffer();

  // Target: pack fills ~74% of the panel height, centred, panel at RATIO.
  const panelH = Math.round(ph / 0.74);
  const panelW = Math.round(panelH * RATIO);
  const scale = Math.min(1, (panelW * 0.92) / pw);
  const drawW = Math.round(pw * scale);
  const drawH = Math.round(ph * scale);
  const scaled = await sharp(pack).resize(drawW, drawH).toBuffer();

  // Two passes, deliberately. sharp runs resize BEFORE composite regardless of the order
  // they are chained in, so composing and then resizing in one pipeline shrinks the canvas
  // first and then fails with "Image to composite must have same dimensions or smaller"
  // (measured: a 794x1485 canvas became 551x1030 before a 730x892 overlay landed on it).
  const composed = await sharp({
    create: { width: panelW, height: panelH, channels: 3, background: PAD },
  })
    .composite([{ input: scaled, left: Math.round((panelW - drawW) / 2), top: Math.round((panelH - drawH) / 2) }])
    .png()
    .toBuffer();

  const file = `${OUT}/${job.id}.png`;
  await sharp(composed).resize({ height: 1030, fit: 'inside' }).png({ compressionLevel: 9 }).toFile(file);

  const m = await sharp(file).metadata();
  console.log(`OK    ${job.id.padEnd(14)} src ${W}x${H} pack ${pw}x${ph} -> ${m.width}x${m.height} `
    + `ratio ${(m.width / m.height).toFixed(3)}  short edge ${Math.min(m.width, m.height)}`);
}

if (missing) {
  console.log(`\n${missing} panel(s) still missing — see docs/packshot-requests.md`);
} else {
  console.log('\nAll three panels built. Render: npx remotion render remotion/Root.tsx RamyeonPremium ...');
}
