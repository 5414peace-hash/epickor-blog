#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { reelFolder } from './lib/reel-dir.mjs';

const ROOT = process.cwd();

function loadEnv() {
  const file = path.join(ROOT, '.env.local');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const value = line.trim();
    if (!value || value.startsWith('#')) continue;
    const index = value.indexOf('=');
    if (index < 1) continue;
    const key = value.slice(0, index).trim();
    const setting = value.slice(index + 1).trim();
    if (!process.env[key]) process.env[key] = setting;
  }
}

function args() {
  const result = {};
  for (let index = 2; index < process.argv.length; index += 1) {
    const key = process.argv[index];
    if (!key.startsWith('--')) continue;
    result[key.slice(2)] = process.argv[index + 1];
    index += 1;
  }
  return result;
}

loadEnv();
const input = args();
const query = input.query;
const slug = input.slug;
const count = Math.max(1, Math.min(Number(input.count || 4), 10));

if (!query || !slug || !/^[a-zA-Z0-9_-]+$/.test(slug)) {
  throw new Error('Usage: node scripts/fetch-pexels-videos.mjs --slug 292 --query "karaoke microphone" --count 4');
}
if (!process.env.PEXELS_API_KEY) throw new Error('PEXELS_API_KEY is missing.');

const params = new URLSearchParams({query, orientation: 'portrait', size: 'medium', per_page: String(count * 3)});
const response = await fetch(`https://api.pexels.com/videos/search?${params}`, {
  headers: {Authorization: process.env.PEXELS_API_KEY},
});
if (!response.ok) throw new Error(`Pexels video search failed: ${response.status} ${response.statusText}`);

const payload = await response.json();
const candidates = (payload.videos || [])
  .map((video) => {
    const files = (video.video_files || [])
      .filter((file) => file.file_type === 'video/mp4' && file.width && file.height)
      .sort((a, b) => {
        const aPortrait = a.height > a.width ? 1 : 0;
        const bPortrait = b.height > b.width ? 1 : 0;
        if (aPortrait !== bPortrait) return bPortrait - aPortrait;
        return Math.abs(a.height - 1920) - Math.abs(b.height - 1920);
      });
    const file = files[0];
    if (!file) return null;
    return {
      id: video.id,
      pageUrl: video.url,
      photographer: video.user?.name || 'Pexels contributor',
      photographerUrl: video.user?.url || '',
      duration: video.duration,
      width: file.width,
      height: file.height,
      downloadUrl: file.link,
      license: 'Pexels License',
      licenseUrl: 'https://www.pexels.com/license/',
    };
  })
  .filter(Boolean)
  .slice(0, count);

const outputDir = path.join(ROOT, 'output', 'reels', reelFolder(slug), 'pexels-video-candidates');
fs.mkdirSync(outputDir, {recursive: true});
fs.writeFileSync(path.join(outputDir, `${query.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.json`), `${JSON.stringify({query, candidates}, null, 2)}\n`);
console.log(JSON.stringify({query, candidates}, null, 2));
