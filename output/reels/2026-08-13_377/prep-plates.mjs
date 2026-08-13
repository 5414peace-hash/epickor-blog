#!/usr/bin/env node
/**
 * Reel 377 — cut the studio white off the manufacturer pack shots.
 *
 * The Spec Sheet frame draws its own ground, so the products have to arrive as
 * transparent PNGs rather than as full-bleed plates. Everything else about the
 * layout then lives in the composition, where it is cheap to iterate.
 *
 * Source: HK inno.N's own product page, `inno-n.com/assets/front/pc/img/pr/condition/`,
 * seven SKUs at 1106x1106 on solid white. Editorial product identification; no
 * sponsorship is implied and none exists. The post already uses two of these and
 * documents the terms in `public/assets/images/posts/377/image-sources.md`.
 *
 * The keying follows the recipe measured on 2026-08-05 (CLAUDE.md):
 *  - Judge the background by SATURATION, not brightness. A brightness cut deletes
 *    pale product bodies; `maxCh - minCh < 14 && mean > 200` does not.
 *  - Flood fill from the border only, so white highlights on caps, foil and glass
 *    survive instead of being punched out.
 *  - Compute the alpha bounding box by hand. `sharp.trim()` keys off the top-left
 *    pixel and cropped an 861x594 subject to 934x182 the last time it was trusted.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'output/reels/2026-08-13_377';
const OUT = 'public/assets/reels/377/media';
fs.mkdirSync(OUT, { recursive: true });

/** Border flood fill over low-saturation bright pixels. */
async function keyWhite(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: ch } = info;
  const isBg = new Uint8Array(w * h);
  for (let i = 0, p = 0; p < w * h; p += 1, i += ch) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    isBg[p] = (max - min < 14 && (r + g + b) / 3 > 200) ? 1 : 0;
  }

  const out = new Uint8Array(w * h);          // 1 = keep as background
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const p = y * w + x;
    if (out[p] || !isBg[p]) return;
    out[p] = 1;
    stack.push(p);
  };
  for (let x = 0; x < w; x += 1) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y += 1) { push(0, y); push(w - 1, y); }
  while (stack.length) {
    const p = stack.pop();
    const x = p % w, y = (p - x) / w;
    push(x - 1, y); push(x + 1, y); push(x, y - 1); push(x, y + 1);
  }

  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let p = 0; p < w * h; p += 1) {
    const i = p * ch;
    if (out[p]) { data[i + 3] = 0; continue; }
    const x = p % w, y = (p - x) / w;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  if (maxX < 0) throw new Error(`${file}: flood fill removed everything`);

  return {
    buffer: await sharp(data, { raw: { width: w, height: h, channels: ch } })
      .extract({ left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 })
      .png()
      .toBuffer(),
    box: { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 },
  };
}

const SPECIMENS = [
  { file: 'cl-04', name: 'sticks.png', shows: 'seven Condition sticks, the rack the reel opens on' },
  { file: 'cl-01', name: 'bottle-green.png', shows: 'the 1992 bottle format, still sold' },
  { file: 'cl-02', name: 'bottle-ceo.png', shows: 'Condition CEO' },
  { file: 'cl-03', name: 'bottle-lady.png', shows: 'Condition Lady' },
  { file: 'cl-05', name: 'pill-sachet.png', shows: 'Condition 환, the pill format' },
  { file: 'cl-06', name: 'bottle-sparkling.png', shows: 'Condition ZERO sparkling' },
  { file: 'cl-07', name: 'bottle-zero.png', shows: 'Condition Zero grapefruit' },
];

const report = [];

for (const s of SPECIMENS) {
  const src = path.join('.tmp', `${s.file}.png`);
  const { buffer, box } = await keyWhite(src);
  const dest = path.join(OUT, s.name);
  await sharp(buffer).png({ compressionLevel: 9 }).toFile(dest);
  const meta = await sharp(dest).metadata();
  report.push({
    file: s.name, source: `inno-n.com/.../${s.file.replace('cl-', 'con_list-')}.png`,
    keyedBox: box, size: `${meta.width}x${meta.height}`,
    bytes: fs.statSync(dest).size, shows: s.shows,
  });
}

/**
 * The badge crop. It is NOT here to be read — at 1106px one stick is ~140px wide
 * and the badge ~106px, so legible 8pt Hangul would need a 6x upscale. The frame
 * annotates it with a leader line instead. This crop only has to make the viewer
 * see that a printed badge is there.
 */
{
  const { buffer } = await keyWhite(path.join('.tmp', 'cl-04.png'));
  const m = await sharp(buffer).metadata();
  const crop = {
    left: Math.round(m.width * 0.36),
    top: Math.round(m.height * 0.60),
    width: Math.round(m.width * 0.34),
    height: Math.round(m.height * 0.30),
  };
  const dest = path.join(OUT, 'sticks-badge.png');
  await sharp(buffer).extract(crop).resize({ width: 1000, kernel: 'lanczos3' }).png().toFile(dest);
  report.push({
    file: 'sticks-badge.png', source: 'crop of con_list-04', keyedBox: crop,
    size: `1000x?`, bytes: fs.statSync(dest).size,
    shows: 'the 인체적용시험완료 badge row — shown, not asked to be read',
  });
}

/** The one photograph in the reel, for the outro. */
{
  const dest = path.join(OUT, 'haejangguk.jpg');
  await sharp('public/assets/images/posts/377/haejangguk-hangover-soup.jpg')
    .extract({ left: 175, top: 0, width: 525, height: 933 })
    .resize(1080, 1920, { fit: 'cover', kernel: 'lanczos3' })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(dest);
  const stats = await sharp(dest).greyscale().stats();
  report.push({
    file: 'haejangguk.jpg', source: 'Commons, CC0', keyedBox: null,
    size: '1080x1920', bytes: fs.statSync(dest).size,
    luma: Math.round(stats.channels[0].mean),
    shows: '해장국 — the morning-after remedy, under the outro',
  });
}

fs.writeFileSync(`${SRC}/media-report.json`, `${JSON.stringify({ slug: '377', specimens: report }, null, 2)}\n`);
for (const r of report) {
  console.log(`${r.file.padEnd(22)} ${String(r.size).padEnd(12)} ${(r.bytes / 1024).toFixed(0)}KB`);
}
