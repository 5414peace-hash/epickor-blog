/**
 * Build the four product panels for the convenience-store shelf-tag reel.
 *
 * DIFFERENT FIT RULE FROM THE RAMYEON REEL, and the reason matters.
 *
 * The ramyeon panels were three packets of near-identical aspect (0.79-0.82), so "fill 74%
 * of the panel height" produced three consistent-looking cards. This reel mixes shapes: a
 * ramyeon cup and a large cup are close to square (0.96, 0.99), a Milkis can is tall and
 * narrow, and the Pocachip shot is two bags side by side and wide. Scaling those by height
 * would overflow the panel width on the square ones and shrink the can to nothing.
 *
 * So the product is fitted inside a box — 92% of the panel width and 88% of its height,
 * whichever binds first — and centred. The panel itself stays a constant 0.535 so the
 * layout slot never moves; only the margin around the product varies, which reads as a
 * product card rather than as an inconsistency. A square product can physically only fill
 * about half a 0.535 portrait's height, and that is fine: it still renders ~370px wide on a
 * 1080px frame.
 *
 * The Jin Ramen cup arrives letterboxed inside a 1920x1280 canvas. The border-deviation
 * trim removes the bars for free, which is why the trim is measured rather than assumed —
 * `sharp.trim()` keys off the top-left pixel, and here that pixel is inside a black bar.
 */
import sharp from 'sharp';
import { existsSync, mkdirSync } from 'node:fs';

const OUT = 'public/assets/reels/cvs-shelf-tag/media';
mkdirSync(OUT, { recursive: true });

const RATIO = 0.535;
/**
 * Padding colour is measured PER IMAGE, not fixed. The first pass padded everything with
 * pure white and the Milkis panel showed a visible grey rectangle inside it: that shot sits
 * on a grey studio sweep with a gradient, not on white. Matching each pack's own sweep makes
 * the pad invisible, and it also means a loose trim does not matter — whatever sweep the trim
 * leaves attached blends into the padding.
 */
const FLATTEN = { r: 255, g: 255, b: 255 };

const JOBS = [
  { id: 'jin-cup', src: 'public/assets/images/posts/361/jin-ramen-spicy-cup-official.jpg' },
  { id: 'neoguri-cup', src: 'public/assets/images/posts/359/neoguri-large-cup-official.jpg' },
  { id: 'milkis', src: 'public/assets/images/posts/360/milkis-can.jpg' },
  { id: 'pocachip', src: 'public/assets/images/posts/366/pocachip-original-onion-bags.jpg' },
];

for (const job of JOBS) {
  if (!existsSync(job.src)) { console.log(`SKIP  ${job.id} missing ${job.src}`); continue; }

  const { data, info } = await sharp(job.src).flatten({ background: FLATTEN }).raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  // Border median per channel: the pad colour needs full RGB, and a single-channel median
  // would tint a coloured sweep.
  const chans = [[], [], []];
  const pushEdge = (x, y) => {
    const o = (y * W + x) * C;
    for (let k = 0; k < 3; k++) chans[k].push(data[o + k]);
  };
  for (let x = 0; x < W; x += 4) for (const y of [0, 1, H - 2, H - 1]) pushEdge(x, y);
  for (let y = 0; y < H; y += 4) for (const x of [0, 1, W - 2, W - 1]) pushEdge(x, y);
  const med = chans.map((a) => { a.sort((p, q) => p - q); return a[a.length >> 1]; });
  const PAD = { r: med[0], g: med[1], b: med[2] };
  const bg = med[0];

  const col = new Uint32Array(W), row = new Uint32Array(H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const o = (y * W + x) * C;
      const dev = Math.max(
        Math.abs(data[o] - bg), Math.abs(data[o + 1] - bg), Math.abs(data[o + 2] - bg));
      if (dev > 10) { col[x]++; row[y]++; }
    }
  }
  const first = (a, m) => a.findIndex((v) => v >= m);
  const last = (a, m) => { for (let i = a.length - 1; i >= 0; i--) if (a[i] >= m) return i; return -1; };
  const x0 = first(col, Math.max(3, H * 0.006)), x1 = last(col, Math.max(3, H * 0.006));
  const y0 = first(row, Math.max(3, W * 0.006)), y1 = last(row, Math.max(3, W * 0.006));
  if (x1 < 0 || y1 < 0) throw new Error(`${job.id}: nothing measured`);

  const pw = x1 - x0 + 1, ph = y1 - y0 + 1;
  const pack = await sharp(job.src).flatten({ background: FLATTEN })
    .extract({ left: x0, top: y0, width: pw, height: ph }).toBuffer();

  // Panel sized so the product fills its allowance on whichever axis binds.
  const byHeight = Math.round(ph / 0.88);
  const byWidth = Math.round(pw / (0.92 * RATIO));
  const panelH = Math.max(byHeight, byWidth);
  const panelW = Math.round(panelH * RATIO);
  const scale = Math.min((panelW * 0.92) / pw, (panelH * 0.88) / ph, 1);
  const drawW = Math.round(pw * scale), drawH = Math.round(ph * scale);
  const scaled = await sharp(pack).resize(drawW, drawH).toBuffer();

  // Two passes: sharp runs resize before composite regardless of chain order.
  const composed = await sharp({
    create: { width: panelW, height: panelH, channels: 3, background: PAD },
  })
    .composite([{ input: scaled, left: Math.round((panelW - drawW) / 2), top: Math.round((panelH - drawH) / 2) }])
    .png().toBuffer();

  const file = `${OUT}/${job.id}.png`;
  await sharp(composed).resize({ height: 1030, fit: 'inside' }).png({ compressionLevel: 9 }).toFile(file);

  const m = await sharp(file).metadata();
  const bind = (panelW * 0.92) / pw < (panelH * 0.88) / ph ? 'width' : 'height';
  console.log(`OK    ${job.id.padEnd(12)} subject ${String(pw).padStart(4)}x${String(ph).padEnd(4)}`
    + ` (${bind}-bound) pad rgb(${PAD.r},${PAD.g},${PAD.b})`
    + ` -> ${m.width}x${m.height} ratio ${(m.width / m.height).toFixed(3)}`);
}
