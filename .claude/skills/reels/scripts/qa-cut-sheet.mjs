#!/usr/bin/env node
/**
 * Per-cut contact sheet: one frame from the middle of every cut, captioned with
 * the narration line that is being spoken over it.
 *
 * Why this exists (2026-08-05): the 2026-08-04 batch shipped six cuts whose
 * picture contradicted the words — an 8K skyline under "mass-produced hanok",
 * grilled pork under a claim about Sprite's launch date, a Neoguri bag under
 * "it was this brand". Each was only visible once rendered, and nothing in the
 * pipeline put the frame and the sentence side by side. This does.
 *
 *   node .claude/skills/reels/scripts/qa-cut-sheet.mjs \
 *     --file <mp4> --manifest <render-manifest.json> --out <sheet.jpg>
 *
 * Also reports the mean luma of each sampled frame, because two near-black
 * stills shipped in the same batch (luma 16 and 28) and neither was noticed.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import sharp from 'sharp';

const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(`--${k}`); return i === -1 ? d : argv[i + 1]; };

const file = arg('file');
const manifestPath = arg('manifest');
const out = arg('out', '.tmp/cut-sheet.jpg');
const cols = Number(arg('cols', '6'));
if (!file || !manifestPath) {
  console.error('usage: --file <mp4> --manifest <render-manifest.json> [--out sheet.jpg] [--cols 6]');
  process.exit(2);
}

const m = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const fps = m.fps || 30;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cutsheet-'));

const TW = 260, TH = 462, LABEL = 78;

const tiles = [];
const rows = [];

for (const c of m.cuts) {
  // Sample past the incoming crossfade so the frame shows this cut, not the last.
  const at = (c.from + Math.min(20, Math.floor(c.len / 2)) + 8) / fps;
  const png = path.join(tmp, `c${c.n}.png`);
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-ss', String(at), '-i', file,
    '-frames:v', '1', png], { stdio: ['ignore', 'ignore', 'pipe'] });

  const st = await sharp(png).stats();
  const luma = Math.round(st.channels.slice(0, 3).reduce((a, ch) => a + ch.mean, 0) / 3);

  const frame = c.from + Math.floor(c.len / 2);
  const beat = m.beats.find((b) => frame >= b.startFrame && frame <= b.endFrame)
    || m.beats.filter((b) => b.startFrame <= frame).pop();

  rows.push({ n: c.n, kind: c.kind, luma, at, text: beat ? beat.text : '(no narration)', src: c.src });
  tiles.push({ png, n: c.n, kind: c.kind, luma, text: beat ? beat.text : '' });
}

const gridRows = Math.ceil(tiles.length / cols);
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const composites = [];
for (let i = 0; i < tiles.length; i++) {
  const t = tiles[i];
  const x = (i % cols) * TW, y = Math.floor(i / cols) * (TH + LABEL);
  composites.push({ input: await sharp(t.png).resize(TW - 6, TH - 6).png().toBuffer(), left: x + 3, top: y + 3 });
  const words = t.text.length > 46 ? `${t.text.slice(0, 44)}…` : t.text;
  const warn = t.luma < 40 ? ' #ff5555' : '#9fd8e4';
  composites.push({
    input: Buffer.from(
      `<svg width="${TW}" height="${LABEL}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${TW}" height="${LABEL}" fill="#0b1418"/>
        <text x="6" y="20" font-family="Arial" font-size="15" font-weight="bold" fill="${warn.trim()}">
          ${t.n} ${t.kind} luma ${t.luma}</text>
        <text x="6" y="44" font-family="Arial" font-size="14" fill="#ffffff">${esc(words.slice(0, 34))}</text>
        <text x="6" y="64" font-family="Arial" font-size="14" fill="#ffffff">${esc(words.slice(34))}</text>
      </svg>`),
    left: x, top: y + TH,
  });
}

await sharp({ create: { width: cols * TW, height: gridRows * (TH + LABEL), channels: 3, background: '#0b1418' } })
  .composite(composites).jpeg({ quality: 88 }).toFile(out);

fs.rmSync(tmp, { recursive: true, force: true });

console.log(`${out}  (${tiles.length} cuts)`);
const dark = rows.filter((r) => r.luma < 40);
if (dark.length) console.log(`  DARK: ${dark.map((r) => `cut ${r.n} (luma ${r.luma})`).join(', ')}`);
for (const r of rows) {
  console.log(`  ${String(r.n).padStart(2)} ${r.kind.padEnd(5)} luma ${String(r.luma).padStart(3)}  "${r.text}"`);
}
