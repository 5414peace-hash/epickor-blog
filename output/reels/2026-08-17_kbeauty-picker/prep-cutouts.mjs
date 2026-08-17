/**
 * Crop each bottle to a portrait product panel.
 *
 * The first version of this script tried to lift the bottles off their studio
 * backgrounds with a border flood fill, the technique that worked on the hy Mobility
 * carts in 2026-08-05. It failed, and the failure is worth recording because the
 * setup looked identical: a product on a bright achromatic sweep.
 *
 * The difference is the product. A cream-coloured cart body carries chroma 44, so
 * `maxCh - minCh < 14` separates it from a chroma-0 sweep cleanly. A frosted white
 * COSRX bottle and a clear Round Lab bottle carry chroma ~2 and luma ~235 — they ARE
 * bright and achromatic, they match the background test exactly, and because their
 * soft edges never break the connectivity the flood walked straight through them. The
 * rendered check showed three bottles gone with only their dark caps and printed
 * labels left floating. White-on-white cannot be solved by a colour test.
 *
 * So the bottles stay on their sweeps and become panels instead of cutouts. This is
 * also the more honest form: they are studio product shots, and a product shot on its
 * own ground reads as an Olive Young shelf tag, which is exactly where a Korean
 * shopper meets these four.
 *
 * The bbox is still measured rather than eyeballed, but by deviation from the border
 * colour with no flood step — an interior pixel that matches the sweep is kept,
 * because it is inside the bottle.
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const OUT = 'public/assets/reels/kbeauty-picker/media';
mkdirSync(OUT, { recursive: true });

const JOBS = [
  { id: 'cosrx', src: 'public/assets/images/posts/395/cosrx-snail-96-essence-bottle.jpg' },
  { id: 'anua', src: 'public/assets/images/posts/396/anua-heartleaf-77-toner-bottle.jpg' },
  { id: 'roundlab', src: 'public/assets/images/posts/401/roundlab-dokdo-toner-bottle.jpg' },
];

/** Target panel aspect. Matches the slot in CounterKit (806 tall / ~430 wide). */
const RATIO = 0.535;

for (const job of JOBS) {
  const { data, info } = await sharp(job.src).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;

  // Border median as the sweep colour. A single corner pixel would be hostage to
  // JPEG ringing.
  const edge = [];
  for (let x = 0; x < W; x += 4) {
    for (const y of [0, 1, H - 2, H - 1]) edge.push(data[(y * W + x) * C]);
  }
  edge.sort((a, b) => a - b);
  const bg = edge[edge.length >> 1];

  // Row/column occupancy. Threshold 8 catches a frosted edge and its contact shadow
  // while ignoring compression noise, which measures 2-4 levels on these files.
  const colHits = new Uint32Array(W);
  const rowHits = new Uint32Array(H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const o = (y * W + x) * C;
      const dev = Math.max(
        Math.abs(data[o] - bg),
        Math.abs(data[o + 1] - bg),
        Math.abs(data[o + 2] - bg),
      );
      if (dev > 8) {
        colHits[x]++;
        rowHits[y]++;
      }
    }
  }
  const firstIdx = (a, min) => a.findIndex((v) => v >= min);
  const lastIdx = (a, min) => {
    for (let i = a.length - 1; i >= 0; i--) if (a[i] >= min) return i;
    return -1;
  };
  // A line counts as occupied at 0.8% of its length, so a stray speck cannot widen
  // the box to the full frame the way an unfiltered scan would.
  const x0 = firstIdx(colHits, Math.max(3, H * 0.008));
  const x1 = lastIdx(colHits, Math.max(3, H * 0.008));
  const y0 = firstIdx(rowHits, Math.max(3, W * 0.008));
  const y1 = lastIdx(rowHits, Math.max(3, W * 0.008));
  if (x1 < 0 || y1 < 0) throw new Error(`${job.id}: nothing measured`);

  // Grow the measured box to the panel ratio around the subject's own centre, then
  // clamp inside the source. Padding is proportional so a tall bottle is not tighter
  // than a short one.
  const pad = Math.round((y1 - y0) * 0.05);
  let top = Math.max(0, y0 - pad);
  let bot = Math.min(H, y1 + pad);
  let h = bot - top;
  let w = Math.round(h * RATIO);
  const cx = (x0 + x1) / 2;
  let left = Math.round(cx - w / 2);
  if (w > W) {
    w = W;
    left = 0;
    h = Math.round(w / RATIO);
    top = Math.max(0, Math.min(H - h, Math.round((y0 + y1) / 2 - h / 2)));
  }
  left = Math.max(0, Math.min(W - w, left));
  h = Math.min(h, H - top);

  const file = `${OUT}/${job.id}.png`;
  await sharp(job.src)
    .extract({ left, top, width: w, height: h })
    .resize({ height: 1030, fit: 'inside' })
    .png({ compressionLevel: 9 })
    .toFile(file);
  console.log(
    `${job.id.padEnd(9)} src ${W}x${H} sweep ${bg}  subject x${x0}-${x1} y${y0}-${y1}` +
      `  panel ${w}x${h} @ ${left},${top}`,
  );
}
