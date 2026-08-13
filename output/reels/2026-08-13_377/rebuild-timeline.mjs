#!/usr/bin/env node
/**
 * Reel 377 — rebuild the audio timeline, re-align, and derive the cut plan.
 *
 * Same discipline as 376: cut boundaries come from beat indices, never from
 * literals, so re-timing the narration moves the cuts with it.
 *
 * New here: the outro is NOT silent. From this reel on the close is spoken and it
 * says the domain out loud (representative instruction 2026-08-13). The tag lives
 * at the end of voice part 3 rather than in a fourth clip, so the forced alignment
 * carries it — which means `outroFrom` is a BEAT index, not the end of speech.
 *
 *   node output/reels/2026-08-13_377/rebuild-timeline.mjs [gapFrames]
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const DIR = 'output/reels/2026-08-13_377';
const FPS = 30;
const LEAD = 12;
const GAP = Number(process.argv[2] || 7);
/** Frames held after the last spoken word, so the chip is not cut off. */
const TAIL = 58;

/** First beat index of each cut. Cut 1 always starts at frame 0. */
const CUT_FIRST_BEAT = [0, 5, 8, 12, 15, 19];
/** "Koreans already know which ones to skip. / The rest is at epickor dot com." */
const OUTRO_FIRST_BEAT = 22;

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
const total = speechEnd + TAIL;

fs.writeFileSync(`${DIR}/remotion-props-v01.json`, `${JSON.stringify({
  slug: '377', fps: FPS, width: 1080, height: 1920, durationInFrames: total, audioSegments: segments,
}, null, 2)}\n`);

/* 2. re-align (the ElevenLabs alignment itself is cached on disk) ---------- */

execFileSync('node', ['.claude/skills/reels/scripts/align-reel-captions.mjs', '--slug', '377', '--version', 'v02'], {
  stdio: 'inherit',
});
const beats = JSON.parse(fs.readFileSync(`${DIR}/caption-timings-v02.json`, 'utf8')).beats
  // The narration spells the domain out so TTS does not read it as letters. The
  // caption should not repeat that spelling back at the viewer.
  .map((b) => ({ ...b, text: b.text.replace(/epickor dot com/gi, 'epickor.com') }));

/* 3. cuts, derived from the beats ----------------------------------------- */

// Specimen filenames live in prep-plates.mjs; the cut-to-specimen mapping is the
// composition's business, so the manifest only carries frames here.
const starts = CUT_FIRST_BEAT.map((b, n) => (n === 0 ? 0 : beats[b].startFrame));
const outroFrom = beats[OUTRO_FIRST_BEAT].startFrame;
const cuts = starts.map((from, n) => ({
  n: n + 1,
  from,
  len: (n === starts.length - 1 ? outroFrom : starts[n + 1]) - from,
  kind: 'specimen',
}));

fs.writeFileSync(`${DIR}/render-manifest.json`, `${JSON.stringify({
  slug: '377', fps: FPS, width: 1080, height: 1920,
  durationInFrames: total,
  outroFrom,
  cuts,
  beats: beats.map((b) => ({ text: b.text, startFrame: b.startFrame, endFrame: b.endFrame })),
  audio: segments.map((s) => ({ part: s.part, startFrame: s.startFrame })),
}, null, 2)}\n`);

for (const c of cuts) {
  console.log(`C${c.n} ${String(c.from).padStart(4)} len ${String(c.len).padStart(3)} ${(c.len / FPS).toFixed(1)}s`);
}
console.log(`outro ${outroFrom}-${total} (${((total - outroFrom) / FPS).toFixed(1)}s, spoken) | total ${(total / FPS).toFixed(1)}s`);
