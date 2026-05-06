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

function sceneRankName(sceneNumber, rank) {
  return `scene-${String(sceneNumber).padStart(2, '0')}-rank-${String(rank).padStart(2, '0')}.jpg`;
}

async function downloadImage(url, outputPath) {
  if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
    return { skipped: true, bytes: fs.statSync(outputPath).size };
  }

  const response = await fetch(url);
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
    const fileName = sceneRankName(scene.number, rank);
    const outputPath = path.join(outputAssetDir, fileName);
    const result = await downloadImage(selectedImages[index], outputPath);
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

const manifestPath = path.join(reelDir, 'asset-manifest.json');
writeJson(manifestPath, manifest);
console.log(`Saved ${path.relative(ROOT, manifestPath)}`);
console.log(`Assets directory ${path.relative(ROOT, outputAssetDir)}`);
