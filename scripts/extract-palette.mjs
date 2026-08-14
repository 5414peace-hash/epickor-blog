#!/usr/bin/env node
/**
 * Derive a reel's theme palette from the footage it is actually cut from.
 *
 * Why this exists: "pick something that suits the topic" reliably collapses back
 * to the same two defaults (cream + serif, or near-black + one neon). Sampling the
 * clips forces a different palette per subject and, as a side effect, guarantees
 * the text sits on colours that belong to the frame instead of fighting it.
 *
 * Procedure (mirrors the rule in CLAUDE.md):
 *   1. sample frames from the reel's own cut media
 *   2. k-means the pixels into 5 clusters in Lab-ish space
 *   3. largest cluster -> canvas, darkened but KEEPING its chroma (never pure black)
 *   4. clusters 2-3 -> accents, saturation pushed so they lift off the canvas
 *   5. highlight -> a hue the footage barely contains, so emphasis reads
 *   6. caption plate style decided by measured clip luma + its variance
 *
 * Usage:
 *   node scripts/extract-palette.mjs --slug 376
 *   node scripts/extract-palette.mjs --slug 376 --json
 */
import { readFileSync, existsSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const arg = (n, d = null) => {
  const i = args.indexOf(`--${n}`);
  return i === -1 ? d : args[i + 1];
};
const slug = arg('slug');
const asJson = args.includes('--json');
if (!slug) {
  console.error('usage: node scripts/extract-palette.mjs --slug 376');
  process.exit(1);
}

/* ---------- locate the reel and its cut media ---------- */
const reelDir = (() => {
  const hit = readdirSync('output/reels').find((d) => d.endsWith(`_${slug}`));
  if (!hit) throw new Error(`no output/reels/*_${slug}`);
  return join('output/reels', hit);
})();

const manifest = JSON.parse(readFileSync(join(reelDir, 'render-manifest.json'), 'utf8'));
const clips = manifest.cuts
  .map((c) => c.src ?? c.media)
  .filter(Boolean)
  .map((m) => join('public', m));

const present = clips.filter(existsSync);
if (present.length === 0) throw new Error(`no cut media found under public/ for ${slug}`);

/* ---------- colour helpers ---------- */
const toHex = ([r, g, b]) =>
  '#' + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn;
  const s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  let h;
  if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0));
  else if (mx === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return [h * 60, s, l];
}

function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360 / 360;
  if (s === 0) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t) => {
    t = (t + 1) % 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [f(h + 1 / 3) * 255, f(h) * 255, f(h - 1 / 3) * 255];
}

/* ---------- sample ---------- */
const SAMPLE = 96; // px per side; enough for cluster structure, cheap to run
const pixels = [];
const perClip = [];

for (const file of present) {
  const { data, info } = await sharp(file)
    .resize(SAMPLE, SAMPLE, { fit: 'cover' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  let lumaSum = 0;
  const lumas = [];
  for (let i = 0; i < data.length; i += info.channels) {
    const px = [data[i], data[i + 1], data[i + 2]];
    pixels.push(px);
    const y = 0.299 * px[0] + 0.587 * px[1] + 0.114 * px[2];
    lumaSum += y;
    lumas.push(y);
  }
  const mean = lumaSum / lumas.length;
  const sd = Math.sqrt(lumas.reduce((a, y) => a + (y - mean) ** 2, 0) / lumas.length);
  perClip.push({ file, meanLuma: +mean.toFixed(1), sd: +sd.toFixed(1) });
}

/* ---------- k-means ---------- */
function kmeans(pts, k, iters = 24) {
  // deterministic seeding: spread across the sorted-by-luma range, so two runs on
  // the same footage give the same palette and a diff is meaningful.
  const sorted = [...pts].sort(
    (a, b) => (0.299 * a[0] + 0.587 * a[1] + 0.114 * a[2]) - (0.299 * b[0] + 0.587 * b[1] + 0.114 * b[2]),
  );
  let cent = Array.from({ length: k }, (_, i) => sorted[Math.floor(((i + 0.5) / k) * sorted.length)].slice());
  let assign = new Array(pts.length).fill(0);
  for (let it = 0; it < iters; it++) {
    let moved = false;
    for (let i = 0; i < pts.length; i++) {
      let best = 0, bd = Infinity;
      for (let c = 0; c < k; c++) {
        const d = (pts[i][0] - cent[c][0]) ** 2 + (pts[i][1] - cent[c][1]) ** 2 + (pts[i][2] - cent[c][2]) ** 2;
        if (d < bd) { bd = d; best = c; }
      }
      if (assign[i] !== best) { assign[i] = best; moved = true; }
    }
    const sum = Array.from({ length: k }, () => [0, 0, 0, 0]);
    for (let i = 0; i < pts.length; i++) {
      const a = assign[i];
      sum[a][0] += pts[i][0]; sum[a][1] += pts[i][1]; sum[a][2] += pts[i][2]; sum[a][3]++;
    }
    cent = sum.map((s, i) => (s[3] ? [s[0] / s[3], s[1] / s[3], s[2] / s[3]] : cent[i]));
    if (!moved) break;
  }
  const counts = new Array(k).fill(0);
  assign.forEach((a) => counts[a]++);
  return cent
    .map((c, i) => ({ rgb: c, share: counts[i] / pts.length }))
    .sort((a, b) => b.share - a.share);
}

const clusters = kmeans(pixels, 5);

/* ---------- derive the palette ---------- */
// 3. Largest cluster becomes the canvas: pushed dark, chroma deliberately kept.
const [ch, cs, cl] = rgbToHsl(...clusters[0].rgb);
const canvas = toHex(hslToRgb(ch, Math.max(0.14, Math.min(cs, 0.34)), 0.085));
const canvasLift = toHex(hslToRgb(ch, Math.max(0.16, Math.min(cs, 0.38)), 0.17));

// 4. Next clusters become accents, saturation raised so they separate from the
//    canvas. The second accent must also separate from the FIRST: raw cluster order
//    on 376 gave #b0703b (30deg) and #c6a753 (45deg), two warm golds that read as
//    one colour on screen. Require 40deg of hue distance and walk down the
//    clusters until it is met, rather than taking rank 2 and 3 blindly.
const hueGap = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
const lift = ({ rgb }) => {
  const [h, s, l] = rgbToHsl(...rgb);
  return { h, hex: toHex(hslToRgb(h, Math.min(0.92, Math.max(s * 1.55, 0.5)), Math.min(0.62, Math.max(l, 0.46)))) };
};
const pool = clusters.slice(1).map(lift);
const primary = pool[0];
const secondary = pool.slice(1).find((c) => hueGap(c.h, primary.h) >= 40) ?? pool[1];
const accents = [primary.hex, secondary.hex];
const accentHueGap = Math.round(hueGap(primary.h, secondary.h));

// 5. Highlight = the emptiest hue bucket. If everything is already there, take the
//    complement of the canvas instead.
const hist = new Array(12).fill(0);
for (const p of pixels) {
  const [h, s] = rgbToHsl(...p);
  if (s > 0.18) hist[Math.floor(h / 30) % 12]++;
}
const emptiest = hist.indexOf(Math.min(...hist));
const highlight = toHex(hslToRgb(emptiest * 30 + 15, 0.86, 0.58));

// 6. Caption plate from measured clip brightness and its variance.
const meanLuma = perClip.reduce((a, c) => a + c.meanLuma, 0) / perClip.length;
const meanSd = perClip.reduce((a, c) => a + c.sd, 0) / perClip.length;
const plate =
  meanLuma > 120 || meanSd > 58 ? 'scrim'
  : meanSd > 40 ? 'glass'
  : 'bare';

const result = {
  slug,
  sampledClips: perClip,
  clusters: clusters.map((c) => ({ hex: toHex(c.rgb), share: +(c.share * 100).toFixed(1) })),
  measured: { meanLuma: +meanLuma.toFixed(1), meanSd: +meanSd.toFixed(1), accentHueGap },
  palette: { canvas, canvasLift, accent: accents, highlight, plate },
};

const out = join(reelDir, 'palette.json');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify(result, null, 2));

if (asJson) { console.log(JSON.stringify(result, null, 2)); process.exit(0); }

console.log(`\n팔레트 추출 — ${slug}  (${present.length} clips)\n`);
for (const c of perClip) console.log(`  ${c.file.split(/[\\/]/).pop().padEnd(26)} luma ${String(c.meanLuma).padStart(5)}  sd ${String(c.sd).padStart(5)}`);
console.log(`\n  지배색 (면적순)`);
for (const c of result.clusters) console.log(`    ${c.hex}  ${String(c.share).padStart(5)}%`);
console.log(`\n  -> canvas    ${canvas}   (최대면적 ${result.clusters[0].hex} 를 어둡게, 채도 유지)`);
console.log(`  -> canvasLift ${canvasLift}   (광원 블롭용)`);
console.log(`  -> accent    ${accents.join("  ")}   (색조 간격 ${accentHueGap}도)`);
console.log(`  -> highlight ${highlight}   (푸티지에 가장 없는 색조 버킷 ${emptiest * 30}-${emptiest * 30 + 30}deg)`);
console.log(`  -> plate     ${plate}   (luma ${result.measured.meanLuma} / sd ${result.measured.meanSd})`);
console.log(`\n저장: ${out}\n`);
