#!/usr/bin/env node
/**
 * Assemble the two build-time JSON files a Reel composition imports, from the two
 * files a human actually authors: the cut plan and the list of narration starts.
 *
 * Before this existed, remotion-props-v01.json and render-manifest.json were edited
 * by hand. That is how the 2026-08-11 batch shipped a render-manifest whose cuts had
 * no `kind` field, which crashed qa-cut-sheet with an unhelpful `padEnd` of
 * undefined, and how audio durationFrames could silently disagree with the mp3 on
 * disk after a re-record.
 *
 *   node scripts/reels-assemble.mjs props    --slug suneung --starts 10,99,495,794,1073,1213 --duration 1440
 *   node scripts/reels-assemble.mjs manifest --slug suneung
 *
 * `props` measures every mp3 itself, so durations are never stale. `manifest` reads
 * the aligned caption timings, so it must run after align-reel-captions.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const FPS = 30;
const mode = process.argv[2];
const args = {};
for (let i = 3; i < process.argv.length; i += 1) {
  if (process.argv[i].startsWith('--')) { args[process.argv[i].slice(2)] = process.argv[i + 1]; i += 1; }
}
const slug = args.slug;
if (!slug || !['props', 'manifest'].includes(mode)) {
  console.error('usage: reels-assemble.mjs <props|manifest> --slug <slug> [--starts a,b,c --duration N]');
  process.exit(1);
}
const dir = path.join('output', 'reels', slug);
const seconds = (file) => Number(execFileSync('ffprobe',
  ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString().trim());

if (mode === 'props') {
  const starts = String(args.starts).split(',').map((n) => Number(n.trim()));
  const durationInFrames = Number(args.duration);
  const audioSegments = starts.map((startFrame, i) => {
    const part = i + 1;
    const file = `voice-part-${part}.mp3`;
    const abs = path.join(dir, 'audio', file);
    if (!fs.existsSync(abs)) throw new Error(`missing ${abs}`);
    const durationSeconds = seconds(abs);
    return {
      part, file, staticFilePath: `audio/${file}`, startFrame,
      durationFrames: Math.round(durationSeconds * FPS), durationSeconds,
    };
  });
  const last = audioSegments.at(-1);
  const narrationEnd = last.startFrame + last.durationFrames;
  if (narrationEnd > durationInFrames) {
    throw new Error(`narration ends at ${narrationEnd} but composition is ${durationInFrames}`);
  }
  // Every boundary, not just the last: a gap wider than the qa-audio limit blocks the
  // render, and finding that out here costs a second instead of a ten-minute render.
  for (let i = 0; i < audioSegments.length - 1; i += 1) {
    const gap = audioSegments[i + 1].startFrame - (audioSegments[i].startFrame + audioSegments[i].durationFrames);
    // A few frames of overlap is normal and harmless: what overlaps is one file's
    // tail padding and the next file's lead padding, both silent. Only a real
    // overlap — where speech could collide — is worth blocking on.
    if (gap < -20) throw new Error(`parts ${i + 1}/${i + 2} overlap by ${-gap} frames`);
    if (gap > 16) console.warn(`  warn: ${gap}-frame gap after part ${i + 1} (${(gap / FPS).toFixed(2)}s) — run reels:gaps`);
  }
  fs.writeFileSync(path.join(dir, 'remotion-props-v01.json'),
    `${JSON.stringify({ slug, fps: FPS, width: 1080, height: 1920, durationInFrames, audioSegments }, null, 1)}\n`);
  console.log(`props: ${audioSegments.length} parts, narration ends ${narrationEnd}, composition ${durationInFrames} (${(durationInFrames / FPS).toFixed(2)}s)`);
} else {
  const plan = JSON.parse(fs.readFileSync(path.join(dir, 'cut-plan-v01.json'), 'utf8'));
  const props = JSON.parse(fs.readFileSync(path.join(dir, 'remotion-props-v01.json'), 'utf8'));
  const timings = JSON.parse(fs.readFileSync(path.join(dir, 'caption-timings-v02.json'), 'utf8'));
  const beats = (timings.beats ?? timings).map((b) => ({
    text: b.text, startFrame: b.startFrame, endFrame: b.endFrame,
  }));
  for (let i = 0; i < beats.length - 1; i += 1) {
    // libass stacks a caption that is still alive when the next one starts, which is
    // what made captions visibly hop between cuts on 2026-08-04. Enforce here too.
    if (beats[i].endFrame >= beats[i + 1].startFrame) beats[i].endFrame = beats[i + 1].startFrame - 1;
  }
  const covered = plan.reduce((n, c) => n + c.len, 0);
  if (covered !== props.durationInFrames) {
    throw new Error(`cuts cover ${covered} frames, composition is ${props.durationInFrames}`);
  }
  const manifest = {
    slug,
    durationInFrames: props.durationInFrames,
    cuts: plan.map((c) => ({
      n: c.n, from: c.from, len: c.len,
      src: `assets/reels/${slug}/media/cut-${String(c.n).padStart(2, '0')}.mp4`,
      kind: c.kind,
    })),
    beats,
  };
  fs.writeFileSync(path.join(dir, 'render-manifest.json'), `${JSON.stringify(manifest, null, 1)}\n`);
  console.log(`manifest: ${manifest.cuts.length} cuts, ${beats.length} beats, ${manifest.durationInFrames} frames`);
}
