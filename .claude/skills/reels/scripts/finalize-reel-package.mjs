#!/usr/bin/env node
/**
 * Promote a representative-confirmed Reel candidate to the final upload filename.
 *
 * Usage:
 *   npm run reels:finalize -- --slug 258 --candidate 01
 *   npm run reels:finalize -- --slug 258 --candidate 01 --force
 */

import fs from 'node:fs';
import path from 'node:path';
import { reelFolder } from '../../../../scripts/lib/reel-dir.mjs';

const ROOT = process.cwd();

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (let i = 0; i < args.length; i += 1) {
    if (!args[i].startsWith('--')) continue;
    const key = args[i].slice(2);
    const next = args[i + 1];
    if (!next || next.startsWith('--')) {
      parsed[key] = true;
    } else {
      parsed[key] = next;
      i += 1;
    }
  }
  return parsed;
}

function normalizeCandidateLabel(value) {
  if (!value) return null;
  const match = String(value).trim().match(/^v?(\d+)$/i);
  if (!match) return null;
  const number = Number(match[1]);
  if (!Number.isInteger(number) || number < 1) return null;
  return number < 100 ? String(number).padStart(2, '0') : String(number).padStart(3, '0');
}

function latestCandidate(finalDir, slug) {
  if (!fs.existsSync(finalDir)) return null;
  const pattern = new RegExp(`^EPICKOR_${slug}_(\\d{2,3})\\.mp4$`);
  return fs.readdirSync(finalDir)
    .map((name) => ({ name, match: name.match(pattern) }))
    .filter((item) => item.match)
    .sort((a, b) => Number(a.match[1]) - Number(b.match[1]))
    .at(-1)?.name || null;
}

function safeRelative(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

const args = parseArgs();
const slug = String(args.slug || '');
const force = Boolean(args.force);

if (!slug || !/^[a-zA-Z0-9_-]+$/.test(slug)) {
  console.error('Usage: npm run reels:finalize -- --slug {safe-slug} [--candidate 01] [--force]');
  process.exit(1);
}

const finalDir = path.join(ROOT, 'output', 'final', 'reels', reelFolder(slug));
if (!fs.existsSync(finalDir)) {
  console.error(`Missing final Reel directory: ${safeRelative(finalDir)}`);
  process.exit(1);
}

const candidateLabel = normalizeCandidateLabel(args.candidate || args.version);
const candidateName = candidateLabel
  ? `EPICKOR_${slug}_${candidateLabel}.mp4`
  : latestCandidate(finalDir, slug);

if (!candidateName) {
  const existingFinal = path.join(finalDir, `EPICKOR_${slug}.mp4`);
  if (fs.existsSync(existingFinal)) {
    console.log(`Already finalized: ${safeRelative(existingFinal)}`);
    process.exit(0);
  }
  console.error(`No candidate MP4 found in ${safeRelative(finalDir)}.`);
  process.exit(1);
}

const candidatePath = path.join(finalDir, candidateName);
const finalPath = path.join(finalDir, `EPICKOR_${slug}.mp4`);

if (!fs.existsSync(candidatePath)) {
  console.error(`Missing candidate MP4: ${safeRelative(candidatePath)}`);
  process.exit(1);
}

if (fs.existsSync(finalPath)) {
  if (!force) {
    console.error(`Refusing to overwrite existing final MP4: ${safeRelative(finalPath)}. Pass --force if this confirmation supersedes it.`);
    process.exit(1);
  }
  fs.unlinkSync(finalPath);
}

fs.renameSync(candidatePath, finalPath);

const candidatePattern = new RegExp(`^EPICKOR_${slug}_\\d{2,3}\\.mp4$`);
for (const name of fs.readdirSync(finalDir)) {
  if (candidatePattern.test(name)) {
    fs.unlinkSync(path.join(finalDir, name));
  }
}

console.log(`Finalized ${safeRelative(finalPath)}`);
