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
    .replace(/epickor\s+dot\s+com/g, 'epickor com')
    .replace(/epickor\.com/g, 'epickor com')
    .replace(/\bone\s+one\s+nine\b/g, '119')
    .replace(/\bone\s+three\s+three\s+zero\b/g, '1330')
    .replace(/\bone\s+three\s+three\s+nine\b/g, '1339')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function textLines(text, explicit) {
  if (Array.isArray(explicit) && explicit.length) return explicit.map(String).filter(Boolean);
  return String(text || '').split(/\s*\|\s*/).map((line) => line.trim()).filter(Boolean);
}

function maxLineLength(lines) {
  return lines.reduce((max, line) => Math.max(max, String(line || '').replace(/\s+/g, ' ').trim().length), 0);
}

function validateMotionCardText(card) {
  const template = card.templateId || card.layout || 'editorial_box';
  const headlineLines = textLines(card.headline, card.headlineLines);
  const subheadLines = textLines(card.subhead, card.subheadLines);
  const footerLines = textLines(card.footer, card.footerLines);
  const bulletLines = (card.bullets || []).flatMap((bullet) => textLines(bullet));
  const totalLines = headlineLines.length + subheadLines.length + footerLines.length + bulletLines.length;
  const headlineLimit = template === 'radial_burst' ? 12 : 24;
  const bulletLimit = ['radial_burst', 'split_checklist', 'menu_board', 'wrapper_tabs', 'kinetic_steps'].includes(template) ? 24 : 30;
  const totalLimit = template === 'radial_burst' ? 11 : 13;

  if (headlineLines.length > 3) {
    fail(
      `Motion card headline is too tall for Scene ${card.sceneNumber}: ${card.id}.`,
      `template=${template}, lines=${headlineLines.length}`
    );
  }
  if (subheadLines.length > 2 || footerLines.length > 2) {
    fail(
      `Motion card support text is too dense for Scene ${card.sceneNumber}: ${card.id}.`,
      `subheadLines=${subheadLines.length}, footerLines=${footerLines.length}`
    );
  }
  if (maxLineLength(headlineLines) > headlineLimit) {
    fail(
      `Motion card headline line is too long for stable layout in Scene ${card.sceneNumber}: ${card.id}.`,
      `maxChars=${maxLineLength(headlineLines)}, limit=${headlineLimit}`
    );
  }
  if (maxLineLength(bulletLines) > bulletLimit) {
    fail(
      `Motion card bullet text is too long for stable layout in Scene ${card.sceneNumber}: ${card.id}.`,
      `maxChars=${maxLineLength(bulletLines)}, limit=${bulletLimit}`
    );
  }
  if (totalLines > totalLimit) {
    fail(
      `Motion card has too many visible text lines for Scene ${card.sceneNumber}: ${card.id}.`,
      `template=${template}, lines=${totalLines}, limit=${totalLimit}`
    );
  }
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

const numericSlug = Number(slug);
const usesStrictTextBudget = !Number.isFinite(numericSlug) || numericSlug >= 175;
const usesTwoMotionCardLimit = !Number.isFinite(numericSlug) || numericSlug >= 176;
const maxCaptionWords = usesStrictTextBudget ? 5 : 7;
const maxCaptionChars = usesStrictTextBudget ? 26 : 40;
const maxMotionCards = usesTwoMotionCardLimit ? 2 : Number.POSITIVE_INFINITY;

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
if (approvedMotionCards.length > maxMotionCards) {
  fail(
    `Too many approved motion cards for current Reels standard: ${approvedMotionCards.length}.`,
    `max=${maxMotionCards}; new Reels should use two motion-card inserts unless the representative records an explicit exception.`
  );
}
const approvedMotionByScene = new Map();
for (const card of approvedMotionCards) {
  if (approvedMotionByScene.has(card.sceneNumber)) {
    fail(`Multiple approved motion cards for Scene ${card.sceneNumber}.`);
  }
  if (usesStrictTextBudget) validateMotionCardText(card);
  approvedMotionByScene.set(card.sceneNumber, card);
}

const propMotionCards = props.motionCards || [];
if (propMotionCards.length > maxMotionCards) {
  fail(
    `Too many motion cards reached Remotion props: ${propMotionCards.length}.`,
    `max=${maxMotionCards}; remove extra motion-card scenes before rendering.`
  );
}
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

  for (const [index, beat] of (propScene.captionBeats || []).entries()) {
    const normalizedBeat = normalizeWords(beat);
    const wordCount = normalizedBeat ? normalizedBeat.split(' ').length : 0;
    const charCount = String(beat || '').replace(/\s+/g, ' ').trim().length;
    const usesReadableBand = propScene.captionStyle === 'readable_band';
    const captionWordLimit = usesReadableBand ? 18 : maxCaptionWords;
    const captionCharLimit = usesReadableBand ? 120 : maxCaptionChars;
    const explicitLines = String(beat || '').split(/\r?\n/).length;
    const allowsBilingualReadableCaption = usesReadableBand && explicitLines === 2;
    if (!allowsBilingualReadableCaption && /[.!?]\s+\S/.test(String(beat || ''))) {
      fail(
        `Caption beat crosses a sentence boundary in Scene ${sourceScene.number}, beat ${index + 1}.`,
        `beat="${beat}"`
      );
    }
    if (wordCount > captionWordLimit || charCount > captionCharLimit) {
      fail(
        `Caption beat is too long for stable one-line sizing in Scene ${sourceScene.number}, beat ${index + 1}.`,
        `words=${wordCount}/${captionWordLimit}, chars=${charCount}/${captionCharLimit}, beat="${beat}"`
      );
    }
    if (usesReadableBand) {
      if (explicitLines > 2) {
        fail(
          `Readable caption beat has too many explicit lines in Scene ${sourceScene.number}, beat ${index + 1}.`,
          `lines=${explicitLines}/2, beat="${beat}"`
        );
      }
      const starts = propScene.captionBeatStartFrames || [];
      const start = starts[index] ?? Math.floor((index / Math.max(propScene.captionBeats.length, 1)) * propScene.durationFrames);
      const next = starts[index + 1] ?? propScene.durationFrames;
      if (next - start < 30) {
        fail(
          `Readable caption beat is too short in Scene ${sourceScene.number}, beat ${index + 1}.`,
          `frames=${next - start}/30, beat="${beat}"`
        );
      }
    }
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
