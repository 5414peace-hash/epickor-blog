#!/usr/bin/env node
/**
 * Download finalized Reels visual assets into public/assets/reels/{slug}.
 *
 * Usage:
 *   node .claude/skills/reels/scripts/prepare-assets.mjs --slug 170
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

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function extensionForSource(src) {
  const clean = String(src || '').split(/[?#]/)[0].toLowerCase();
  const ext = path.extname(clean);
  if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return ext === '.jpeg' ? '.jpg' : ext;
  return '.jpg';
}

function sceneRankName(sceneNumber, rank, src) {
  return `scene-${String(sceneNumber).padStart(2, '0')}-rank-${String(rank).padStart(2, '0')}${extensionForSource(src)}`;
}

async function downloadImage(url, outputPath, { allowExisting = false } = {}) {
  if (allowExisting && fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
    return { skipped: true, bytes: fs.statSync(outputPath).size };
  }

  if (String(url || '').startsWith('/assets/')) {
    const localSourcePath = path.join(ROOT, 'public', String(url).replace(/^\/assets\//, 'assets/'));
    if (!fs.existsSync(localSourcePath)) {
      throw new Error(`Local asset not found: ${url}`);
    }
    fs.copyFileSync(localSourcePath, outputPath);
    return { skipped: false, bytes: fs.statSync(outputPath).size };
  }

  let response;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    response = await fetch(url, {
      headers: {
        'User-Agent': 'EpicKorReelsAssetPrep/1.0 (https://www.epickor.com; editorial asset preparation)',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
      },
      redirect: 'follow',
    });
    if (response.ok || ![429, 500, 502, 503, 504].includes(response.status) || attempt === 3) break;
    await new Promise((resolve) => setTimeout(resolve, 1500 * attempt));
  }
  if (!response.ok) {
    throw new Error(`Image download failed: ${response.status} ${response.statusText} ${url}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(outputPath, buffer);
  return { skipped: false, bytes: buffer.length };
}

const { slug } = parseArgs();

if (!slug || !/^[a-zA-Z0-9_-]+$/.test(slug)) {
  console.error('Usage: --slug {safe-slug}');
  process.exit(1);
}

const reelDir = path.join(ROOT, 'output', 'reels', slug);
const approvedPath = path.join(reelDir, 'approved-visuals.json');
const outputAssetDir = path.join(ROOT, 'public', 'assets', 'reels', slug);
const manifestPath = path.join(reelDir, 'asset-manifest.json');

if (!fs.existsSync(approvedPath)) {
  console.error(`Missing finalized visual manifest: ${path.relative(ROOT, approvedPath)}`);
  process.exit(1);
}

fs.mkdirSync(outputAssetDir, { recursive: true });

const approved = readJson(approvedPath);
if (!approved.finalizedAt) {
  console.error('approved-visuals.json does not include finalizedAt. Finalize visual review before preparing assets.');
  process.exit(1);
}

const previousManifest = fs.existsSync(manifestPath) ? readJson(manifestPath) : { scenes: [] };
function previousSourceFor(sceneNumber, rank) {
  const previousScene = previousManifest.scenes?.find((scene) => scene.number === sceneNumber);
  return previousScene?.images?.find((image) => image.rank === rank)?.src;
}

const manifest = {
  slug,
  source: path.relative(ROOT, approvedPath).replace(/\\/g, '/'),
  generatedAt: new Date().toISOString(),
  scenes: [],
};

for (const scene of approved.scenes || []) {
  const images = [];
  const selectedImages = Array.isArray(scene.selectedImages) ? scene.selectedImages : [];

  for (let index = 0; index < selectedImages.length; index += 1) {
    const rank = index + 1;
    const fileName = sceneRankName(scene.number, rank, selectedImages[index]);
    const outputPath = path.join(outputAssetDir, fileName);
    const result = await downloadImage(selectedImages[index], outputPath, {
      allowExisting: previousSourceFor(scene.number, rank) === selectedImages[index],
    });
    const publicPath = `/assets/reels/${slug}/${fileName}`;

    images.push({
      rank,
      src: selectedImages[index],
      file: path.relative(ROOT, outputPath).replace(/\\/g, '/'),
      publicPath,
      bytes: result.bytes,
      downloaded: !result.skipped,
    });
  }

  manifest.scenes.push({
    number: scene.number,
    images,
  });
}

writeJson(manifestPath, manifest);
console.log(`Saved ${path.relative(ROOT, manifestPath)}`);
console.log(`Assets directory ${path.relative(ROOT, outputAssetDir)}`);
