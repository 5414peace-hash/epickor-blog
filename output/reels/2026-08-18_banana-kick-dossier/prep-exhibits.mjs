/**
 * Exhibit plates for the Banana Kick DOSSIER reel (post `367`).
 *
 * SOURCES, and why each one
 *   pack     Nongshim's own brand artwork, already vetted for the post. The bag's line
 *            바나나맛 그대로 is legible, which is the sentence the whole reel turns on.
 *   puffs    Commons original (2490x1338), not the blog's downscaled copy. Five puffs on a
 *            white plate on dark wood — the only framing that shows the banana curve and the
 *            porous surface at once, and the dark wood sits naturally on the film ground.
 *   inbag    Commons original (3000x2000). Inside the opened bag; the sugar dust reads as
 *            sparkle, which is the close plate's whole job.
 *
 * The two Commons files are fetched at full size rather than reused from
 * public/assets/images/posts/367/, because those copies are already downscaled and one of
 * them was upscaled on the way in. Those three crops are all DOWNSCALES.
 *
 * The pack plate is the exception and is fitted to the plate HEIGHT (566) rather than its
 * width, which lands at 585x566 — a downscale of 0.98. Fitting it to the 848 width instead
 * would have enlarged a 600px crop by 1.41x, on a source that Nongshim only publishes at
 * 1067px and that the blog copy had already upscaled once. Two enlargements stacked is how
 * a plate ends up soft on a 1080-wide frame.
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const OUT = 'public/assets/reels/banana-kick-dossier/media';
const COMMONS = {
  inbag: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Banana_Kick_20201201_001.jpg',
  puffs: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Banana_Kick_20201201_002.jpg',
};

async function grab(url) {
  const r = await fetch(url, {
    headers: { 'User-Agent': 'EpicKorBot/1.0 (editorial use; 5414peace@gmail.com)' },
  });
  if (!r.ok) throw new Error(`${url} -> HTTP ${r.status}`);
  return Buffer.from(await r.arrayBuffer());
}

/** Assert the source is the file the crop boxes were measured against. */
async function assertSize(input, w, h, name) {
  const m = await sharp(input).metadata();
  if (m.width !== w || m.height !== h) {
    throw new Error(`${name}: expected ${w}x${h}, got ${m.width}x${m.height} — recheck crops`);
  }
}

await mkdir(OUT, { recursive: true });
const [inbag, puffs] = await Promise.all([grab(COMMONS.inbag), grab(COMMONS.puffs)]);
await assertSize(inbag, 3000, 2000, 'inbag');
await assertSize(puffs, 2490, 1338, 'puffs');
await assertSize('public/assets/images/posts/367/banana-kick-pack-official.jpg', 1400, 727, 'pack');

const cuts = [
  ['exhibit-pack.png', 'public/assets/images/posts/367/banana-kick-pack-official.jpg',
    { left: 545, top: 70, width: 600, height: 580 }, { height: 566 }],
  ['exhibit-puffs.png', puffs, { left: 1000, top: 300, width: 1180, height: 700 }, { width: 848 }],
  ['exhibit-inbag.png', inbag, { left: 500, top: 300, width: 2200, height: 1450 }, { width: 848 }],
  ["close-texture.png", inbag, { left: 950, top: 950, width: 1600, height: 480 }, { width: 880 }],
];

const lines = [];
for (const [name, src, box, target] of cuts) {
  const info = await sharp(src).extract(box).resize({ ...target, kernel: 'lanczos3' })
    .png({ compressionLevel: 9 }).toFile(`${OUT}/${name}`);
  const ratio = (info.width / info.height).toFixed(3);
  lines.push(`${name.padEnd(20)} ${info.width}x${info.height}  ratio ${ratio}  from ${box.width}x${box.height}`);
  console.log(lines.at(-1));
}
await writeFile(`${OUT}/crops.txt`, lines.join('\n') + '\n');
