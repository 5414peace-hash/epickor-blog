#!/usr/bin/env node
/**
 * Reel 376 — rebuild the audio timeline, re-align, and derive the cut plan.
 *
 * Run this instead of hand-editing frame numbers. Cut boundaries come from beat
 * indices, not from literals, so re-timing the narration (which is what forced
 * the first rebuild) moves the cuts with it rather than silently desyncing them.
 *
 * Why the gap shrank from 21 frames to 7 (QA 2026-08-13): `reels:qa-audio` blocked
 * v001 with 0.92s and 0.87s narration gaps against a 0.6s limit. `silencedetect` at
 * -45dB finds nothing in the mp3s, so the parts are not padded with digital silence
 * — they simply trail off and start quietly, and about 0.2s at each seam sits under
 * the gate's floor. The nominal gap therefore has to be shorter than the audible one.
 *
 *   node output/reels/2026-08-13_376/rebuild-timeline.mjs [gapFrames]
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const DIR = 'output/reels/2026-08-13_376';
const FPS = 30;
const LEAD = 10;                                   // frames of head before part 1
const GAP = Number(process.argv[2] || 7);
const OUTRO_FRAMES = 135;

/** First beat index of each cut. Cut 1 always starts at frame 0. */
const CUT_FIRST_BEAT = [0, 6, 9, 14, 18, 21];

const dur = (p) =>
  Number(execFileSync('ffprobe', [
    '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p,
  ]).toString().trim());

/* 1. audio timeline ------------------------------------------------------- */

const segments = [];
let cursor = LEAD;
for (let part = 1; part <= 3; part += 1) {
  const file = `voice-part-${part}.mp3`;
  const seconds = dur(`${DIR}/audio/${file}`);
  const frames = Math.round(seconds * FPS);
  segments.push({
    part, file, staticFilePath: `audio/${file}`,
    startFrame: cursor, durationFrames: frames, durationSeconds: seconds,
  });
  cursor += frames + GAP;
}
const speechEnd = segments.at(-1).startFrame + segments.at(-1).durationFrames;
const total = speechEnd + OUTRO_FRAMES;

fs.writeFileSync(`${DIR}/remotion-props-v01.json`, `${JSON.stringify({
  slug: '376', fps: FPS, width: 1080, height: 1920, durationInFrames: total, audioSegments: segments,
}, null, 2)}\n`);

/* 2. re-align (the ElevenLabs alignment itself is cached on disk) ---------- */

execFileSync('node', ['.claude/skills/reels/scripts/align-reel-captions.mjs', '--slug', '376', '--version', 'v02'], {
  stdio: 'inherit',
});
const beats = JSON.parse(fs.readFileSync(`${DIR}/caption-timings-v02.json`, 'utf8')).beats;

/* 3. cuts, derived from the beats ----------------------------------------- */

// Plate filenames live in prep-plates.mjs only. Keeping a second copy here meant
// renaming the plates left the manifest pointing at deleted files, which surfaces
// as an opaque "source image cannot be decoded" at render time.
const PLATES = JSON.parse(fs.readFileSync(`${DIR}/media-report.json`, 'utf8'))
  .plates.sort((a, b) => a.cut - b.cut).map((p) => p.file);
if (PLATES.length !== CUT_FIRST_BEAT.length) {
  throw new Error(`media-report.json has ${PLATES.length} plates for ${CUT_FIRST_BEAT.length} cuts`);
}

const starts = CUT_FIRST_BEAT.map((b, n) => (n === 0 ? 0 : beats[b].startFrame));
const cuts = starts.map((from, n) => ({
  n: n + 1,
  from,
  len: (n === starts.length - 1 ? beats.at(-1).endFrame : starts[n + 1]) - from,
  src: `assets/reels/376/media/${PLATES[n]}`,
  kind: 'still',
}));

fs.writeFileSync(`${DIR}/render-manifest.json`, `${JSON.stringify({
  slug: '376', fps: FPS, width: 1080, height: 1920,
  durationInFrames: total,
  outroFrom: beats.at(-1).endFrame,
  cuts,
  beats: beats.map((b) => ({ text: b.text, startFrame: b.startFrame, endFrame: b.endFrame })),
  audio: segments.map((s) => ({ part: s.part, startFrame: s.startFrame })),
}, null, 2)}\n`);

for (const c of cuts) {
  console.log(`C${c.n} ${String(c.from).padStart(4)} len ${String(c.len).padStart(3)} ${(c.len / FPS).toFixed(1)}s`);
}
console.log(`outro ${beats.at(-1).endFrame}-${total} | total ${(total / FPS).toFixed(1)}s | gap ${GAP}f`);
for (const s of segments) {
  console.log(`  part ${s.part}: ${s.startFrame}-${s.startFrame + s.durationFrames}`);
}
