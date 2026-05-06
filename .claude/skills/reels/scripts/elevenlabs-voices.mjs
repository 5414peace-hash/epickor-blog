#!/usr/bin/env node
/**
 * EpicKor Reels Voice Agent helper.
 * Lists ElevenLabs voices without printing secrets.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

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

const apiKey = process.env.ELEVENLABS_API_KEY;

if (!apiKey) {
  console.error('Missing ELEVENLABS_API_KEY. Add it to .env.local before listing voices.');
  process.exit(1);
}

const response = await fetch('https://api.elevenlabs.io/v1/voices', {
  headers: {
    'xi-api-key': apiKey,
  },
});

if (!response.ok) {
  const text = await response.text();
  throw new Error(`ElevenLabs voice list failed: ${response.status} ${text.slice(0, 200)}`);
}

const data = await response.json();
const voices = Array.isArray(data.voices) ? data.voices : [];

for (const voice of voices) {
  console.log(`${voice.voice_id}\t${voice.name || 'Untitled voice'}`);
}
