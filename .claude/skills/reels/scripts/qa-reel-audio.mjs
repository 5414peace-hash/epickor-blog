#!/usr/bin/env node
/**
 * Narration audio gate for a rendered Reel.
 *
 * Why this exists (2026-08-05): the hub-drinks/ramyun/seoul batch was delivered
 * after a QA pass that only measured video — cut-boundary luma. Nobody measured
 * the audio. All three shipped with a hole in the narration:
 *
 *   hub-drinks v005   16.0s - 26.3s   -91.0 dB   (digital silence, 10.3s)
 *   hub-seoul  v002    7.6s - 18.0s   -91.0 dB   (10.4s)
 *   hub-ramyun v003    6.0s - 12.6s   -91.0 dB   (6.7s)
 *
 * The source mp3s were intact and the mix reproduced clean, so the defect was
 * a stale render — which is exactly the class of failure a gate catches and a
 * code review does not. Render QA has to measure the artifact, not the inputs.
 *
 * Usage:
 *   node .claude/skills/reels/scripts/qa-reel-audio.mjs --file <mp4> [--max-gap 0.6]
 *   node .claude/skills/reels/scripts/qa-reel-audio.mjs --file <mp4> --manifest <render-manifest.json>
 *
 * With --manifest the narration span is taken from the caption beats, so a gap
 * before the first word or after the last is not counted against the render.
 * Exit code 1 blocks the deliverable.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';

const argv = process.argv.slice(2);
const arg = (k, d) => {
  const i = argv.indexOf(`--${k}`);
  return i === -1 ? d : argv[i + 1];
};

const file = arg('file');
const maxGap = Number(arg('max-gap', '0.6'));
const manifestPath = arg('manifest');
if (!file) {
  console.error('usage: --file <mp4> [--manifest <render-manifest.json>] [--max-gap 0.6]');
  process.exit(2);
}

const probe = (args) => execFileSync('ffprobe', args, { encoding: 'utf8' }).trim();

/**
 * silencedetect and volumedetect report on STDERR, at info level. execFileSync
 * returns stdout only, so the first version of this gate read an empty string
 * and passed a render with a 10.3s hole in it. spawnSync gives both streams.
 */
function analyse(filters, extra = []) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-nostats', ...extra, '-i', file, '-af', filters, '-f', 'null', '-'],
    { encoding: 'utf8', maxBuffer: 1 << 26 });
  return `${r.stdout || ''}${r.stderr || ''}`;
}

const hasAudio = probe(['-v', 'error', '-select_streams', 'a:0', '-show_entries', 'stream=codec_name', '-of', 'csv=p=0', file]);
if (!hasAudio) {
  console.error(`FAIL  ${file} has no audio stream at all.`);
  process.exit(1);
}

const duration = Number(probe(['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]));

// Narration span: first beat start to last beat end, else the whole file.
let spanStart = 0;
let spanEnd = duration;
if (manifestPath) {
  const m = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const fps = m.fps || 30;
  spanStart = m.beats[0].startFrame / fps;
  spanEnd = m.beats[m.beats.length - 1].endFrame / fps;
}

const out = analyse(`silencedetect=n=-40dB:d=${Math.min(maxGap, 0.3)}`);
const events = [...out.matchAll(/silence_(start|end): ([0-9.]+)/g)].map((x) => [x[1], Number(x[2])]);

const gaps = [];
let open = null;
for (const [kind, at] of events) {
  if (kind === 'start') open = at;
  else if (open !== null) { gaps.push([open, at]); open = null; }
}
if (open !== null) gaps.push([open, duration]);

// Only gaps that sit inside the narration span are defects.
const inside = gaps
  .map(([s, e]) => [Math.max(s, spanStart), Math.min(e, spanEnd)])
  .filter(([s, e]) => e - s >= maxGap);

console.log(`${file}`);
console.log(`  duration ${duration.toFixed(2)}s | narration span ${spanStart.toFixed(2)}-${spanEnd.toFixed(2)}s | gap limit ${maxGap}s`);

if (!inside.length) {
  console.log(`  PASS  no silence >= ${maxGap}s inside the narration.`);
  process.exit(0);
}

for (const [s, e] of inside) {
  const mean = /mean_volume: ([-0-9.]+)/.exec(
    analyse('volumedetect', ['-ss', String(s), '-to', String(e)]),
  );
  console.log(`  GAP   ${s.toFixed(2)}s - ${e.toFixed(2)}s  (${(e - s).toFixed(2)}s)  mean ${mean ? mean[1] : '?'} dB`);
}
console.log(`  FAIL  ${inside.length} narration gap(s). Do not deliver this render.`);
process.exit(1);
