#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { reelFolder } from '../../../../scripts/lib/reel-dir.mjs';

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

/**
 * 2026-07-27: the old even-split-by-7 produced grammar breaks the representative
 * rejected on Reel 220 v2 — "nobody tells / you", "it hits / you". Captions now
 * split at punctuation first, then before conjunctions, and never end a card on
 * a word that grammatically requires the next one.
 */
const BAD_ENDINGS = new Set([
  'a', 'an', 'the', 'of', 'to', 'in', 'on', 'at', 'for', 'with', 'from', 'by',
  'your', 'my', 'our', 'their', 'his', 'her', 'its', 'is', 'are', 'was', 'be',
  'been', "that's", "it's", "you're", "they're", 'gonna', 'and', 'or', 'but',
  'tells', 'hits', 'makes', 'gets', 'takes', 'gives', 'lets', 'nobody', 'so',
  // subjects and phrasal-verb halves stranded from what follows ("where you |
  // come", "you come | up the stairs") — only enforced when the word carries no
  // punctuation, since "it hits you," is a legitimate card ending.
  'you', 'i', 'we', 'they', 'he', 'she', 'it', 'who', 'come', 'came', 'go',
  'went', 'get', 'got', 'after', 'before', 'where', 'when', 'while', 'as',
]);
const clean = (t) => t.toLowerCase().replace(/[^a-z']/g, '');
/** A word followed by spoken punctuation may end a card regardless of the list. */
const hasPunct = (t) => /[,.!?;:—]$/.test(t.trim());

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
    // 1) split at spoken punctuation: commas, dashes, semicolons
    let chunks = [];
    let cur = [];
    for (const w of sentence) {
      cur.push(w);
      if (/[,—;:]$/.test(w.text.trim()) || /—$/.test(w.text.trim())) { chunks.push(cur); cur = []; }
    }
    if (cur.length) chunks.push(cur);

    // 2) any chunk still too long splits before a conjunction, else at midpoint
    const sized = [];
    for (const chunk of chunks) {
      if (chunk.length <= 9) { sized.push(chunk); continue; }
      let cutAt = -1;
      for (let i = 3; i < chunk.length - 2; i += 1) {
        if (['and', 'but', 'because', 'which', 'that', 'so'].includes(clean(chunk[i].text))) cutAt = i;
      }
      if (cutAt < 3) cutAt = Math.ceil(chunk.length / 2);
      sized.push(chunk.slice(0, cutAt), chunk.slice(cutAt));
    }

    // 3) never end a card on a word that needs the next one — shift it forward
    for (let i = 0; i < sized.length - 1; i += 1) {
      while (
        sized[i].length > 1 &&
        !hasPunct(sized[i].at(-1).text) &&
        BAD_ENDINGS.has(clean(sized[i].at(-1).text))
      ) {
        sized[i + 1].unshift(sized[i].pop());
      }
    }
    // 4) a card must not START with a stranded object pronoun — but only when
    // the previous card ended mid-clause. If it ended on punctuation, a leading
    // pronoun is the SUBJECT of a new clause ("...morning, | you eat way too
    // much") and must stay where it is.
    for (let i = 1; i < sized.length; i += 1) {
      while (
        sized[i].length > 1 &&
        !hasPunct(sized[i - 1].at(-1).text) &&
        /^(you|it|me|them|him|her|us)[,.]?$/i.test(sized[i][0].text.trim())
      ) {
        sized[i - 1].push(sized[i].shift());
      }
    }
    // 5) merge any leftover tiny fragment into its neighbour
    for (let i = sized.length - 1; i >= 0; i -= 1) {
      if (sized[i].length <= 2 && sized.length > 1) {
        if (i > 0) sized[i - 1].push(...sized[i]);
        else sized[i + 1].unshift(...sized[i]);
        sized.splice(i, 1);
      }
    }
    groups.push(...sized.filter((g) => g.length));
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

const reelDir = path.join(ROOT, 'output', 'reels', reelFolder(slug));
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
