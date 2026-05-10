#!/usr/bin/env node
/**
 * Build Remotion input props from finalized Reels manifests.
 *
 * Usage:
 *   node .claude/skills/reels/scripts/build-remotion-props.mjs --slug 170
 */

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const FPS = 30;

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i += 1) {
    if (args[i].startsWith('--')) {
      parsed[args[i].slice(2)] = args[i + 1];
      i += 1;
    }
  }
  return parsed;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function splitCaption(text) {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean);
  const beats = [];
  for (let i = 0; i < words.length; i += 4) {
    beats.push(words.slice(i, i + 4).join(' '));
  }
  return beats;
}

const captionBeatOverridesBySlug = {
  170: {
    1: [
      'Foreigners hear "PC bang"',
      'and think internet cafe.',
      'But in Korea,',
      'it means something different.',
    ],
    2: [
      'A PC bang is',
      'a gaming lounge,',
      'a snack bar,',
      'and an esports room.',
    ],
    3: [
      'You pay by time,',
      'sit at a powerful computer,',
      'log in,',
      'and start playing instantly.',
    ],
    4: [
      'The social part matters.',
      'Friends sit in rows,',
      'play together,',
      'and turn online games',
      'into an offline plan.',
    ],
    5: [
      'Then comes the food.',
      'In many PC bangs,',
      'ramyeon and fried rice',
      'come right to your seat.',
    ],
    6: [
      'That frictionless setup',
      'helped make gaming feel normal',
      'in Korea,',
      'not hidden in a bedroom.',
    ],
    7: [
      'So if you visit Seoul,',
      'try one respectfully.',
      'Do not film strangers.',
      'Order something simple.',
      'Feel how local the room is.',
    ],
    8: [
      'Read the full',
      'Korean PC bang guide',
      'on EpicKor.com.',
    ],
  },
  171: {
    1: [
      'Tourists look for',
      'a special Korean breakfast.',
      'Locals often solve',
      'the morning at',
      'a convenience store.',
    ],
    2: [
      'A Korean convenience store breakfast',
      'is not one menu.',
      'It is tiny choices:',
      'rice, bread, coffee,',
      'milk, eggs.',
    ],
    3: [
      'The safest first pick',
      'is triangle gimbap.',
      'Rice, filling, and seaweed',
      'in one neat',
      'commute food.',
    ],
    4: [
      'Match the order',
      'to your day.',
      'Walking a lot?',
      'Choose rice.',
      'Not hungry yet?',
      'Bread and coffee.',
    ],
    5: [
      'If you try triangle gimbap,',
      'the wrapper matters.',
      'Pull tab one first,',
      'then the side wrappers.',
    ],
    6: [
      'And if the store has seats,',
      'keep it quick.',
      'Eat, tidy up,',
      'and leave space',
      'for the next person.',
    ],
    7: [
      'Try the simple local order:',
      'triangle gimbap,',
      'one drink,',
      'and one small extra.',
      'Full guide on EpicKor.com.',
    ],
  },
};

function getCaptionBeats(scene, reelSlug) {
  return captionBeatOverridesBySlug[reelSlug]?.[scene.number] || splitCaption(scene.subtitleText || scene.narration);
}

function captionBeatWeight(beat) {
  const text = String(beat || '');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const pauses = (text.match(/[,:;.!?]/g) || []).length;
  return Math.max(1, words + pauses * 0.45);
}

function getCaptionBeatStartFrames(beats, durationFrames) {
  if (!beats.length) return [];
  const weights = beats.map(captionBeatWeight);
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  let cursor = 0;
  return beats.map((_, index) => {
    const start = index === 0 ? 0 : Math.min(durationFrames - 1, Math.round(cursor));
    cursor += (weights[index] / total) * durationFrames;
    return start;
  });
}

function getAudioDurationSeconds(filePath) {
  if (!fs.existsSync(filePath)) return null;

  const result = spawnSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', filePath],
    { encoding: 'utf8' }
  );

  if (result.status === 0) {
    const duration = Number(String(result.stdout || '').trim());
    if (Number.isFinite(duration) && duration > 0) return duration;
  }

  if (filePath.toLowerCase().endsWith('.mp3')) {
    const bytes = fs.statSync(filePath).size;
    const elevenLabsOutputBitrate = 128000;
    const estimated = (bytes * 8) / elevenLabsOutputBitrate;
    return Number.isFinite(estimated) && estimated > 0 ? estimated : null;
  }

  return null;
}

function narrationWeight(scene) {
  const text = String(scene.subtitleText || scene.narration || '');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const sentencePauses = (text.match(/[.!?]/g) || []).length;
  return Math.max(1, words + sentencePauses * 1.8);
}

const parsedArgs = parseArgs();
const { slug } = parsedArgs;
const audioVersion = parsedArgs['audio-version'] || parsedArgs.audioVersion || '';

if (!slug || !/^[a-zA-Z0-9_-]+$/.test(slug)) {
  console.error('Usage: --slug {safe-slug}');
  process.exit(1);
}

const reelDir = path.join(ROOT, 'output', 'reels', slug);
const scenesPath = path.join(reelDir, 'scenes.json');
const approvedPath = path.join(reelDir, 'approved-visuals.json');
const assetManifestPath = path.join(reelDir, 'asset-manifest.json');
const motionCardsPath = path.join(reelDir, 'motion-cards.json');
const motionCardTemplatesPath = path.join(reelDir, 'motion-card-templates.json');
const defaultMotionCardTemplatesPath = path.join(ROOT, '.claude', 'skills', 'reels', 'motion-card-templates.json');
const scenesFile = readJson(scenesPath);
const audioFileName = audioVersion ? `narration-${audioVersion}.mp3` : 'narration.mp3';
const audioPath = path.join(reelDir, 'audio', audioFileName);
const publicAudioPath = path.join(ROOT, 'public', 'assets', 'reels', slug, 'audio', audioFileName);
const partGroupsBySlug = {
  170: [
    { part: 1, scenes: [1, 2, 3] },
    { part: 2, scenes: [4, 5, 6] },
    { part: 3, scenes: [7, 8] },
  ],
  171: [
    { part: 1, scenes: [1, 2] },
    { part: 2, scenes: [3, 4] },
    { part: 3, scenes: [5, 6, 7] },
  ],
};
const partGroups = partGroupsBySlug[slug] || [
  { part: 1, scenes: [1, 2, 3] },
  { part: 2, scenes: [4, 5, 6] },
  { part: 3, scenes: [7, 8] },
];
const partAudio = audioVersion
  ? partGroups.map((group) => {
      const fileName = `narration-${audioVersion}-part-${String(group.part).padStart(2, '0')}.mp3`;
      const outputPath = path.join(reelDir, 'audio', fileName);
      const publicPath = path.join(ROOT, 'public', 'assets', 'reels', slug, 'audio', fileName);
      const durationSeconds = getAudioDurationSeconds(publicPath) || getAudioDurationSeconds(outputPath);
      return {
        ...group,
        fileName,
        outputPath,
        publicPath,
        durationSeconds,
      };
    })
  : [];
const sceneAudio = audioVersion
  ? scenesFile.scenes.map((scene) => {
      const fileName = `narration-${audioVersion}-scene-${String(scene.number).padStart(2, '0')}.mp3`;
      const outputPath = path.join(reelDir, 'audio', fileName);
      const publicPath = path.join(ROOT, 'public', 'assets', 'reels', slug, 'audio', fileName);
      const durationSeconds = getAudioDurationSeconds(publicPath) || getAudioDurationSeconds(outputPath);
      return {
        sceneNumber: scene.number,
        fileName,
        outputPath,
        publicPath,
        durationSeconds,
      };
    })
  : [];
const hasSceneAudio = sceneAudio.length > 0 && sceneAudio.every((scene) => fs.existsSync(scene.publicPath) && scene.durationSeconds);
const hasPartAudio = !hasSceneAudio && partAudio.length > 0 && partAudio.every((part) => fs.existsSync(part.publicPath) && part.durationSeconds);

const approvedFile = readJson(approvedPath);
const assetManifest = fs.existsSync(assetManifestPath) ? readJson(assetManifestPath) : { scenes: [] };
const motionCardsFile = fs.existsSync(motionCardsPath) ? readJson(motionCardsPath) : { cards: [] };
const motionCardTemplatesFile = fs.existsSync(motionCardTemplatesPath)
  ? readJson(motionCardTemplatesPath)
  : fs.existsSync(defaultMotionCardTemplatesPath)
    ? readJson(defaultMotionCardTemplatesPath)
    : { templates: [] };

if (scenesFile.status !== 'visuals_approved' || !approvedFile.finalizedAt) {
  console.error('Visuals are not finalized. Press Finalize visual review before building Remotion props.');
  process.exit(1);
}

const audioDurationSeconds = hasPartAudio
  ? partAudio.reduce((total, part) => total + part.durationSeconds, 0)
  : hasSceneAudio
    ? sceneAudio.reduce((total, scene) => total + scene.durationSeconds, 0)
  : getAudioDurationSeconds(publicAudioPath) || getAudioDurationSeconds(audioPath);
const baseDurationSeconds = scenesFile.scenes.reduce((total, scene) => total + Number(scene.expectedDurationSeconds || 5), 0);
const targetDurationSeconds = audioDurationSeconds || baseDurationSeconds;
const targetFrames = Math.max(1, Math.ceil(targetDurationSeconds * FPS));
const totalWeight = scenesFile.scenes.reduce((total, scene) => total + narrationWeight(scene), 0);

let startFrame = 0;
const sceneDurations = new Map();

if (hasSceneAudio) {
  for (const scene of sceneAudio) {
    sceneDurations.set(scene.sceneNumber, Math.max(1, Math.ceil(scene.durationSeconds * FPS)));
  }
} else if (hasPartAudio) {
  for (const part of partAudio) {
    const partScenes = scenesFile.scenes.filter((scene) => part.scenes.includes(scene.number));
    const partFrames = Math.max(1, Math.ceil(part.durationSeconds * FPS));
    const partWeight = partScenes.reduce((total, scene) => total + narrationWeight(scene), 0);
    let allocated = 0;
    partScenes.forEach((scene, index) => {
      const isLastInPart = index === partScenes.length - 1;
      const frames = isLastInPart
        ? partFrames - allocated
        : Math.max(60, Math.round((narrationWeight(scene) / partWeight) * partFrames));
      sceneDurations.set(scene.number, frames);
      allocated += frames;
    });
  }
}

const scenes = scenesFile.scenes.map((scene, index) => {
  const isLastScene = index === scenesFile.scenes.length - 1;
  const proportionalFrames = Math.round((narrationWeight(scene) / totalWeight) * targetFrames);
  const fallbackFrames = Math.round(Number(scene.expectedDurationSeconds || 5) * FPS);
  const durationFrames = sceneDurations.get(scene.number) || (isLastScene ? targetFrames - startFrame : Math.max(60, audioDurationSeconds ? proportionalFrames : fallbackFrames));
  const assets = assetManifest.scenes.find((item) => item.number === scene.number)?.images || [];
  const captionBeats = getCaptionBeats(scene, slug);
  const remotionScene = {
    number: scene.number,
    startFrame,
    durationFrames,
    durationSeconds: durationFrames / FPS,
    narration: scene.subtitleText || scene.narration,
    captionBeats,
    captionBeatStartFrames: getCaptionBeatStartFrames(captionBeats, durationFrames),
    typographyBeats: scene.typographyBeats || [],
    motion: scene.motion,
    images: assets.map((asset) => ({
      rank: asset.rank,
      publicPath: asset.publicPath,
      staticFilePath: String(asset.publicPath || '').replace(/^\//, ''),
      sourceUrl: asset.src,
    })),
  };
  startFrame += durationFrames;
  return remotionScene;
});

const audioSegments = hasPartAudio
  ? partAudio.map((part) => {
      const firstScene = scenes.find((scene) => part.scenes.includes(scene.number));
      const durationFrames = part.scenes.reduce((total, number) => total + (sceneDurations.get(number) || 0), 0);
      return {
        part: part.part,
        file: path.relative(ROOT, part.outputPath).replace(/\\/g, '/'),
        publicPath: `/assets/reels/${slug}/audio/${part.fileName}`,
        staticFilePath: `assets/reels/${slug}/audio/${part.fileName}`,
        startFrame: firstScene?.startFrame || 0,
        durationFrames,
        durationSeconds: durationFrames / FPS,
      };
    })
  : hasSceneAudio
    ? sceneAudio.map((audio) => {
        const scene = scenes.find((item) => item.number === audio.sceneNumber);
        return {
          part: audio.sceneNumber,
          sceneNumber: audio.sceneNumber,
          file: path.relative(ROOT, audio.outputPath).replace(/\\/g, '/'),
          publicPath: `/assets/reels/${slug}/audio/${audio.fileName}`,
          staticFilePath: `assets/reels/${slug}/audio/${audio.fileName}`,
          startFrame: scene?.startFrame || 0,
          durationFrames: scene?.durationFrames || Math.ceil(audio.durationSeconds * FPS),
          durationSeconds: (scene?.durationFrames || Math.ceil(audio.durationSeconds * FPS)) / FPS,
        };
      })
  : [];

const approvedMotionCards = (motionCardsFile.cards || []).filter((card) => card.reviewStatus === 'approved');

const outroFrames = 60;

const props = {
  slug,
  title: scenesFile.title,
  width: 1080,
  height: 1920,
  fps: FPS,
  durationFrames: startFrame + outroFrames,
  durationSeconds: (startFrame + outroFrames) / FPS,
  finalizedAt: approvedFile.finalizedAt,
  audio: !hasPartAudio && fs.existsSync(publicAudioPath)
    ? {
        file: path.relative(ROOT, audioPath).replace(/\\/g, '/'),
        publicPath: `/assets/reels/${slug}/audio/${audioFileName}`,
        staticFilePath: `assets/reels/${slug}/audio/${audioFileName}`,
      }
    : null,
  audioSegments,
  outro: {
    startFrame,
    durationFrames: outroFrames,
    text: 'epicKor.com',
  },
  brand: {
    label: 'EpicKor',
    cta: 'EPICKOR.COM',
  },
  subtitleStyle: scenesFile.subtitleStyle || {
    mode: 'narration_synced',
    preset: 'modern_reels_phrase_pop',
  },
  scenes,
  motionCards: approvedMotionCards,
  motionCardTemplates: motionCardTemplatesFile.templates || [],
};

const outputPath = path.join(reelDir, 'remotion-props.json');
writeJson(outputPath, props);
console.log(`Saved ${path.relative(ROOT, outputPath)}`);
