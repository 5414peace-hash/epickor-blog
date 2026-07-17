#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let index = 0; index < args.length; index += 1) {
    if (!args[index].startsWith('--')) continue;
    parsed[args[index].slice(2)] = args[index + 1];
    index += 1;
  }
  return parsed;
}

function loadDotEnvLocal() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator < 1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (key && !process.env[key]) process.env[key] = value;
  }
}

function groupWords(words, segment, fps) {
  const sentences = [];
  let currentSentence = [];
  for (const word of words) {
    currentSentence.push(word);
    if (/[.!?]$/.test(word.text)) {
      sentences.push(currentSentence);
      currentSentence = [];
    }
  }
  if (currentSentence.length) sentences.push(currentSentence);

  const groups = [];
  for (const sentence of sentences) {
    const groupCount = Math.max(1, Math.ceil(sentence.length / 7));
    const baseSize = Math.floor(sentence.length / groupCount);
    let extra = sentence.length % groupCount;
    let cursor = 0;
    for (let index = 0; index < groupCount; index += 1) {
      const size = baseSize + (extra > 0 ? 1 : 0);
      extra -= extra > 0 ? 1 : 0;
      groups.push(sentence.slice(cursor, cursor + size));
      cursor += size;
    }
  }

  const beats = groups.map((group) => {
    const localStart = Math.max(0, group[0].start - 0.16);
    const localEnd = Math.min(segment.durationSeconds, group.at(-1).end + 0.22);
    return {
      part: segment.part,
      text: group.map((word) => word.text).join(' ').replace(/\s+([,.;!?])/g, '$1'),
      startFrame: segment.startFrame + Math.max(0, Math.floor(localStart * fps)),
      endFrame: segment.startFrame + Math.min(segment.durationFrames, Math.ceil(localEnd * fps)),
      sourceStartSeconds: Number(group[0].start.toFixed(3)),
      sourceEndSeconds: Number(group.at(-1).end.toFixed(3)),
      wordCount: group.length,
    };
  });
  return beats.map((beat, index) => ({
    ...beat,
    endFrame: beats[index + 1] ? Math.max(beat.startFrame + 1, beats[index + 1].startFrame - 1) : beat.endFrame,
  }));
}

async function requestAlignment(apiKey, audioPath, text) {
  const form = new FormData();
  const audio = fs.readFileSync(audioPath);
  form.append('file', new Blob([audio]), path.basename(audioPath));
  form.append('text', text);
  const response = await fetch('https://api.elevenlabs.io/v1/forced-alignment', {
    method: 'POST',
    headers: { 'xi-api-key': apiKey },
    body: form,
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Forced alignment failed (${response.status}): ${body.slice(0, 400)}`);
  }
  return response.json();
}

loadDotEnvLocal();
const args = parseArgs();
const slug = args.slug;
const version = args.version || 'v02';
const apiKey = process.env.ELEVENLABS_API_KEY;

if (!slug) throw new Error('Usage: node align-reel-captions.mjs --slug {slug} [--version v02]');
if (!apiKey) throw new Error('Missing ELEVENLABS_API_KEY in .env.local.');

const reelDir = path.join(ROOT, 'output', 'reels', slug);
const propsPath = path.join(reelDir, 'remotion-props-v01.json');
const props = JSON.parse(fs.readFileSync(propsPath, 'utf8'));
const allBeats = [];
const parts = [];

for (const segment of props.audioSegments) {
  const audioPath = path.join(reelDir, 'audio', segment.file);
  const textPath = path.join(reelDir, `voice-part-${segment.part}.txt`);
  const transcript = fs.readFileSync(textPath, 'utf8').replace(/\uFEFF/g, '').trim();
  const alignmentPath = path.join(reelDir, 'audio', `alignment-part-${segment.part}.json`);
  let alignment;
  if (fs.existsSync(alignmentPath) && args.refresh !== 'true') {
    alignment = JSON.parse(fs.readFileSync(alignmentPath, 'utf8'));
  } else {
    alignment = await requestAlignment(apiKey, audioPath, transcript);
    fs.writeFileSync(alignmentPath, `${JSON.stringify(alignment, null, 2)}\n`);
  }
  if (!Array.isArray(alignment.words) || alignment.words.length === 0) {
    throw new Error(`No aligned words returned for ${slug} part ${segment.part}.`);
  }
  const spokenWords = alignment.words.filter((word) => word.text.trim().length > 0);
  const beats = groupWords(spokenWords, segment, props.fps);
  allBeats.push(...beats);
  parts.push({
    part: segment.part,
    transcript,
    alignmentLoss: alignment.loss,
    wordCount: spokenWords.length,
    beatCount: beats.length,
    firstWordStart: spokenWords[0].start,
    lastWordEnd: spokenWords.at(-1).end,
  });
}

const result = {
  slug,
  version,
  fps: props.fps,
  generatedAt: new Date().toISOString(),
  method: 'ElevenLabs Forced Alignment against the approved narration transcript',
  captionLeadFrames: 5,
  safeZone: { left: 76, right: 76, bottom: 410, maxWidth: 928 },
  parts,
  beats: allBeats,
  coverage: {
    transcriptWords: parts.reduce((sum, part) => sum + part.wordCount, 0),
    captionWords: allBeats.reduce((sum, beat) => sum + beat.wordCount, 0),
    audioParts: parts.length,
  },
};

const outputPath = path.join(reelDir, `caption-timings-${version}.json`);
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(`Saved ${path.relative(ROOT, outputPath)}`);
console.log(`Coverage ${result.coverage.captionWords}/${result.coverage.transcriptWords} words across ${allBeats.length} beats.`);
