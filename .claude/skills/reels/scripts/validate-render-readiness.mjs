#!/usr/bin/env node
/**
 * Validate that finalized Reel data is safe to render.
 *
 * Usage:
 *   npm run reels:validate -- --slug 171 --require-scene-audio
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i += 1) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const next = args[i + 1];
      if (!next || next.startsWith('--')) {
        parsed[key] = true;
      } else {
        parsed[key] = next;
        i += 1;
      }
    }
  }
  return parsed;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function normalizeWords(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/epickor\.com/g, 'epickor com')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function fail(message, details = '') {
  console.error(`FAIL: ${message}`);
  if (details) console.error(details);
  process.exitCode = 1;
}

const args = parseArgs();
const slug = args.slug;
const requireSceneAudio = Boolean(args['require-scene-audio']);

if (!slug || !/^[a-zA-Z0-9_-]+$/.test(slug)) {
  console.error('Usage: --slug {safe-slug} [--require-scene-audio]');
  process.exit(1);
}

const reelDir = path.join(ROOT, 'output', 'reels', slug);
const publicDir = path.join(ROOT, 'public', 'assets', 'reels', slug);
const scenesPath = path.join(reelDir, 'scenes.json');
const approvedPath = path.join(reelDir, 'approved-visuals.json');
const motionCardsPath = path.join(reelDir, 'motion-cards.json');
const propsPath = path.join(reelDir, 'remotion-props.json');

for (const filePath of [scenesPath, approvedPath, motionCardsPath, propsPath]) {
  if (!fs.existsSync(filePath)) fail(`Missing required file: ${path.relative(ROOT, filePath)}`);
}

if (process.exitCode) process.exit(process.exitCode);

const scenesFile = readJson(scenesPath);
const approvedFile = readJson(approvedPath);
const motionCardsFile = readJson(motionCardsPath);
const props = readJson(propsPath);

if (scenesFile.status !== 'visuals_approved') {
  fail('scenes.json is not finalized as visuals_approved.');
}

if (!approvedFile.finalizedAt) {
  fail('approved-visuals.json has no finalizedAt timestamp.');
}

const approvedMotionCards = (motionCardsFile.cards || []).filter((card) => card.reviewStatus === 'approved');
const approvedMotionByScene = new Map();
for (const card of approvedMotionCards) {
  if (approvedMotionByScene.has(card.sceneNumber)) {
    fail(`Multiple approved motion cards for Scene ${card.sceneNumber}.`);
  }
  approvedMotionByScene.set(card.sceneNumber, card);
}

const propMotionCards = props.motionCards || [];
for (const card of propMotionCards) {
  if (card.reviewStatus !== 'approved') {
    fail(`Unapproved motion card reached Remotion props: ${card.id}`);
  }
  const approved = approvedMotionByScene.get(card.sceneNumber);
  if (!approved || approved.id !== card.id) {
    fail(`Motion card mismatch for Scene ${card.sceneNumber}.`, `Props=${card.id}, approved=${approved?.id || 'none'}`);
  }
}

for (const [sceneNumber, card] of approvedMotionByScene.entries()) {
  const propCard = propMotionCards.find((item) => item.sceneNumber === sceneNumber);
  if (!propCard) {
    fail(`Approved motion card missing from props for Scene ${sceneNumber}.`, card.id);
  }
}

for (const sourceScene of scenesFile.scenes || []) {
  const propScene = (props.scenes || []).find((scene) => scene.number === sourceScene.number);
  if (!propScene) {
    fail(`Scene ${sourceScene.number} missing from Remotion props.`);
    continue;
  }

  const sourceNarration = normalizeWords(sourceScene.subtitleText || sourceScene.narration);
  const propCaptions = normalizeWords((propScene.captionBeats || []).join(' '));
  if (sourceNarration !== propCaptions) {
    fail(`Caption beats do not exactly match narration for Scene ${sourceScene.number}.`, `narration="${sourceNarration}"\ncaption="${propCaptions}"`);
  }

  const approvedScene = (approvedFile.scenes || []).find((scene) => scene.number === sourceScene.number);
  const approvedPrimary = approvedScene?.selectedImages?.[0] || approvedScene?.selectedImage;
  const propPrimary = propScene.images?.[0]?.sourceUrl;
  if (approvedPrimary && propPrimary && approvedPrimary !== propPrimary) {
    fail(`Primary visual mismatch for Scene ${sourceScene.number}.`, `props="${propPrimary}"\napproved="${approvedPrimary}"`);
  }

  for (const image of propScene.images || []) {
    const assetPath = path.join(publicDir, String(image.staticFilePath || '').replace(/^assets\/reels\/[^/]+\//, ''));
    if (!fs.existsSync(assetPath)) {
      fail(`Rendered asset missing for Scene ${sourceScene.number}: ${image.staticFilePath}`);
    }
  }
}

if (requireSceneAudio) {
  const audioSegments = props.audioSegments || [];
  if (audioSegments.length !== (props.scenes || []).length) {
    fail(`Scene-level audio required, but audio segment count is ${audioSegments.length} for ${(props.scenes || []).length} scenes.`);
  }

  for (const scene of props.scenes || []) {
    const segment = audioSegments.find((item) => item.sceneNumber === scene.number);
    if (!segment) {
      fail(`Missing scene-level audio segment for Scene ${scene.number}.`);
      continue;
    }
    if (segment.startFrame !== scene.startFrame || segment.durationFrames !== scene.durationFrames) {
      fail(`Audio segment timing mismatch for Scene ${scene.number}.`);
    }
    const audioPath = path.join(publicDir, String(segment.staticFilePath || '').replace(/^assets\/reels\/[^/]+\//, ''));
    if (!fs.existsSync(audioPath)) {
      fail(`Scene audio file missing for Scene ${scene.number}: ${segment.staticFilePath}`);
    }
  }
}

if (process.exitCode) process.exit(process.exitCode);

console.log(`Reel ${slug} render readiness validation passed.`);
