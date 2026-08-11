#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { reelFolder } from '../../../../scripts/lib/reel-dir.mjs';

const args = process.argv.slice(2);
const slugIndex = args.indexOf('--slug');
if (slugIndex === -1 || !args[slugIndex + 1]) {
  console.error('Usage: node review-reel-continuity.mjs --slug {slug}');
  process.exit(2);
}

const slug = args[slugIndex + 1];
const projectDir = process.cwd();
const reelDir = resolve(projectDir, 'output', 'reels', reelFolder(slug));
const manifestPath = resolve(reelDir, 'continuity-manifest.json');
if (!existsSync(manifestPath)) {
  console.error(`FAIL: missing ${manifestPath}`);
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const errors = [];
const glueWord = /\b(?:a|an|the|and|or|but|to|of|for|in|on|at|by|with|before|after|is|are|was|were|be|been|being|do|does|did|have|has|had|will|would|can|could|should|your|you)\s*$/i;

for (const media of manifest.media ?? []) {
  const sourcePath = resolve(reelDir, 'render-public', media.source);
  if (!existsSync(sourcePath)) {
    errors.push(`${media.scene}: missing media ${media.source}`);
    continue;
  }

  let probe;
  try {
    const raw = execFileSync('ffprobe', [
      '-v', 'error',
      '-select_streams', 'v:0',
      '-show_entries', 'stream=avg_frame_rate,nb_frames,duration',
      '-of', 'json',
      sourcePath,
    ], { encoding: 'utf8' });
    probe = JSON.parse(raw).streams?.[0];
  } catch (error) {
    errors.push(`${media.scene}: ffprobe failed for ${media.source}: ${error.message}`);
    continue;
  }

  const [numerator, denominator] = String(probe.avg_frame_rate).split('/').map(Number);
  const fps = numerator / denominator;
  const totalFrames = Number(probe.nb_frames || Math.floor(Number(probe.duration) * fps));
  const trimBefore = Number(media.trimBefore || 0);
  const requiredFrames = Number(media.requiredFrames);
  const availableFrames = totalFrames - trimBefore;

  if (Math.abs(fps - Number(manifest.compositionFps)) > 0.001) {
    errors.push(`${media.scene}: ${media.source} is ${fps.toFixed(3)}fps, expected ${manifest.compositionFps}fps CFR`);
  }
  if (availableFrames < requiredFrames) {
    errors.push(`${media.scene}: ${media.source} has ${availableFrames} usable frames but needs ${requiredFrames}`);
  }
  if (media.mode === 'hard_loop') {
    errors.push(`${media.scene}: hard_loop is prohibited`);
  }
  console.log(`MEDIA ${media.scene}: ${media.source} | ${fps.toFixed(3)}fps | ${availableFrames}/${requiredFrames} usable | ${media.mode}`);
}

const exclusionTop = Number(manifest.captionExclusionTop);
const minGap = Number(manifest.minimumCaptionGap);
for (const block of manifest.textBlocks ?? []) {
  if (Number(block.maxBottom) + minGap > exclusionTop) {
    errors.push(`${block.scene}/${block.id}: bottom ${block.maxBottom} leaves less than ${minGap}px before caption y=${exclusionTop}`);
  }
}

for (const plan of manifest.textPlans ?? []) {
  const lines = plan.lines ?? [];
  for (let index = 0; index < lines.length - 1; index += 1) {
    if (glueWord.test(lines[index])) {
      errors.push(`${plan.scene}/${plan.id}: semantic orphan risk after "${lines[index]}"`);
    }
  }
}

if (errors.length) {
  console.error('\nCONTINUITY GATE: FAIL');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`\nCONTINUITY GATE: PASS (${slug})`);
