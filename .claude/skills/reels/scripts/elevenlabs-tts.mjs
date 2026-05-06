#!/usr/bin/env node
/**
 * EpicKor Reels Voice Agent helper.
 * Generates narration audio for one approved script text file.
 *
 * Usage:
 *   node .claude/skills/reels/scripts/elevenlabs-tts.mjs --slug 170 --text output/reels/170/voiceover.txt
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

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

function loadDotEnvLocal() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return;

  const text = fs.readFileSync(envPath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index === -1) continue;
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim();
    if (key && !process.env[key]) process.env[key] = value;
  }
}

loadDotEnvLocal();

const args = parseArgs();
const slug = args.slug;
const textPath = args.text;
const outputName = args.output || 'narration.mp3';
const apiKey = process.env.ELEVENLABS_API_KEY;
const voiceId = process.env.ELEVENLABS_VOICE_ID;
const modelId = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2';
const stability = Number(process.env.ELEVENLABS_STABILITY || '0.5');
const similarityBoost = Number(process.env.ELEVENLABS_SIMILARITY_BOOST || '0.8');
const style = Number(process.env.ELEVENLABS_STYLE || '0.3');
const speakerBoost = String(process.env.ELEVENLABS_SPEAKER_BOOST || 'true').toLowerCase() === 'true';

if (!slug || !textPath) {
  console.error('Usage: --slug {slug} --text {path}');
  process.exit(1);
}

if (!apiKey || !voiceId) {
  console.error('Missing ELEVENLABS_API_KEY or ELEVENLABS_VOICE_ID in .env.local.');
  process.exit(1);
}

const absoluteTextPath = path.resolve(ROOT, textPath);
const text = fs.readFileSync(absoluteTextPath, 'utf8').trim();
const outputDir = path.join(ROOT, 'output', 'reels', slug, 'audio');
const publicOutputDir = path.join(ROOT, 'public', 'assets', 'reels', slug, 'audio');
fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(publicOutputDir, { recursive: true });

const response = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
  {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      model_id: modelId,
      voice_settings: {
        stability,
        similarity_boost: similarityBoost,
        style,
        use_speaker_boost: speakerBoost,
      },
    }),
  }
);

if (!response.ok) {
  const errorText = await response.text();
  throw new Error(`ElevenLabs TTS failed: ${response.status} ${errorText.slice(0, 200)}`);
}

const audio = Buffer.from(await response.arrayBuffer());
const safeOutputName = path.basename(outputName);
const outputPath = path.join(outputDir, safeOutputName);
const publicOutputPath = path.join(publicOutputDir, safeOutputName);
fs.writeFileSync(outputPath, audio);
fs.writeFileSync(publicOutputPath, audio);
console.log(`Saved ${path.relative(ROOT, outputPath)}`);
console.log(`Saved ${path.relative(ROOT, publicOutputPath)}`);
