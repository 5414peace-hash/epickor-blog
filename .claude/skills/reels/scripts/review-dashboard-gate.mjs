#!/usr/bin/env node
/**
 * Gate a Reels visual-review dashboard before it is shown to the representative.
 *
 * This catches two chronic failure modes:
 * - thumbnail overlays drifting away from the accepted EpicKor style;
 * - thin or repetitive visual candidate sets disguised as choice.
 *
 * Usage:
 *   npm.cmd run reels:dashboard-gate -- --slug 198
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

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function fail(message, details = '') {
  console.error(`FAIL: ${message}`);
  if (details) console.error(details);
  process.exitCode = 1;
}

function warn(message, details = '') {
  console.warn(`WARN: ${message}`);
  if (details) console.warn(details);
}

function normalizeText(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function publicPathToDisk(src) {
  const clean = String(src || '').split(/[?#]/)[0];
  if (!clean.startsWith('/assets/')) return null;
  return path.join(ROOT, 'public', clean.replace(/^\//, ''));
}

function sourceFamily(candidate) {
  const explicit = normalizeText(candidate.sourceFamily || candidate.originalAsset || candidate.sourceAsset);
  if (explicit) return explicit.toLowerCase();
  const source = normalizeText(candidate.source).toLowerCase();
  if (/derivative crop from blog/i.test(candidate.source || '') && !explicit) {
    return '__missing_derivative_family__';
  }
  if (source) return source;
  const src = normalizeText(candidate.src).toLowerCase();
  return src.replace(/-(vertical|left|right|hero|stage|crop|outro|wide|detail)\.jpe?g$/i, '.jpg');
}

function sceneByNumber(items, number) {
  return items.find((item) => Number(item.number) === Number(number));
}

function isApprovedThinException(candidatesFile, sceneNumber) {
  const exceptions = candidatesFile.representativeApprovedThinDashboardExceptions || [];
  return exceptions.some((item) => Number(item.sceneNumber) === Number(sceneNumber) && item.reason);
}

function validateThumbnail(candidatesFile, standard) {
  const sceneOne = sceneByNumber(candidatesFile.scenes || [], 1);
  if (!sceneOne) {
    fail('Missing Scene 1 candidate scene for thumbnail review.');
    return;
  }
  const overlay = sceneOne.thumbnailOverlay || {};
  const required = standard.requiredOverlay || {};
  const titleLines = Array.isArray(overlay.titleLines) ? overlay.titleLines.map(normalizeText).filter(Boolean) : [];

  if (overlay.templateId !== standard.templateId) {
    fail(
      'Scene 1 thumbnail overlay does not declare the accepted EpicKor thumbnail template.',
      `expected templateId="${standard.templateId}", got "${overlay.templateId || '(missing)'}"`
    );
  }
  if (overlay.style !== required.style) {
    fail(
      'Scene 1 thumbnail overlay style drifted from the accepted recent Reels style.',
      `expected style="${required.style}", got "${overlay.style || '(missing)'}"`
    );
  }
  if (overlay.watermark !== required.watermark) {
    fail('Scene 1 thumbnail watermark must be EPICKOR.COM.', `got "${overlay.watermark || '(missing)'}"`);
  }
  if (titleLines.length !== required.titleLineCount) {
    fail('Scene 1 thumbnail must use exactly two title lines.', `got ${titleLines.length}`);
  }
  for (const line of titleLines) {
    if (line !== line.toUpperCase()) {
      fail('Scene 1 thumbnail title lines must be uppercase.', line);
    }
    if (line.length > required.maxTitleLineChars) {
      fail(
        'Scene 1 thumbnail title line is too long for the accepted centered lockup.',
        `"${line}" is ${line.length} chars; limit ${required.maxTitleLineChars}`
      );
    }
  }
  if (overlay.staticSubtitle || overlay.subtitle || overlay.caption) {
    fail('Scene 1 thumbnail overlay must not include a static subtitle under the title.');
  }
}

function validateCandidateDepth({ scenesFile, candidatesFile, motionCardsFile, minPhotoCandidates, minImportantCandidates }) {
  const motionSceneNumbers = new Set((motionCardsFile.cards || []).map((card) => Number(card.sceneNumber)));
  const sceneNumbers = (scenesFile.scenes || []).map((scene) => Number(scene.number));
  const lastScene = Math.max(...sceneNumbers);
  const photoCandidateRows = [];

  for (const scene of scenesFile.scenes || []) {
    const number = Number(scene.number);
    if (motionSceneNumbers.has(number)) continue;
    const candidateScene = sceneByNumber(candidatesFile.scenes || [], number);
    const count = candidateScene?.candidates?.filter((candidate) => candidate.src).length || 0;
    const required = number === 1 || number === lastScene ? minImportantCandidates : minPhotoCandidates;
    if (count < required && !isApprovedThinException(candidatesFile, number)) {
      fail(
        `Scene ${number} has too few photo candidates for representative review.`,
        `got ${count}; required ${required}. Add stronger source diversity or record a representative-approved exception.`
      );
    }
    for (const candidate of candidateScene?.candidates || []) {
      if (!candidate.src) continue;
      photoCandidateRows.push({ scene: number, candidate, family: sourceFamily(candidate) });
      const diskPath = publicPathToDisk(candidate.src);
      if (diskPath && !fs.existsSync(diskPath)) {
        fail(`Candidate image path is missing for Scene ${number}: ${candidate.src}`);
      }
    }
  }

  for (const sceneNumber of [...new Set((motionCardsFile.cards || []).map((card) => Number(card.sceneNumber)))]) {
    const count = (motionCardsFile.cards || []).filter((card) => Number(card.sceneNumber) === sceneNumber).length;
    if (count < 3) {
      fail(`Motion-card Scene ${sceneNumber} has too few design options.`, `got ${count}; required 3.`);
    }
  }

  return photoCandidateRows;
}

function validateSourceDiversity(photoCandidateRows) {
  const byFamily = new Map();
  for (const row of photoCandidateRows) {
    const rows = byFamily.get(row.family) || [];
    rows.push(row);
    byFamily.set(row.family, rows);
    if (row.family === '__missing_derivative_family__') {
      fail(
        `Derivative candidate is missing sourceFamily/originalAsset metadata in Scene ${row.scene}.`,
        `${row.candidate.id}: add sourceFamily or originalAsset so derivative reuse can be audited.`
      );
    }
  }

  const photoScenes = new Set(photoCandidateRows.map((row) => row.scene));
  const uniqueFamilies = [...byFamily.keys()].filter((family) => family !== '__missing_derivative_family__');
  const requiredFamilies = Math.max(photoScenes.size + 1, 6);

  if (uniqueFamilies.length < requiredFamilies) {
    fail(
      'Photo candidate set is too repetitive across source families.',
      `unique source families ${uniqueFamilies.length}; required at least ${requiredFamilies}. Do not fill the dashboard mostly with crops from the same few source images.`
    );
  }

  for (const [family, rows] of byFamily.entries()) {
    if (family === '__missing_derivative_family__') continue;
    const scenes = [...new Set(rows.map((row) => row.scene))].sort((a, b) => a - b);
    if (rows.length > 2) {
      fail(
        'Too many candidates come from the same source family.',
        `family="${family}" appears ${rows.length} times across scenes ${scenes.join(', ')}. Use new images, generated assets, or clearly different source material.`
      );
    } else if (scenes.length > 1) {
      warn(
        'Same source family appears in multiple scenes.',
        `family="${family}" across scenes ${scenes.join(', ')}. This is only acceptable when the callback is deliberate and documented.`
      );
    }
  }
}

const args = parseArgs();
const slug = String(args.slug || '');
if (!slug || !/^[a-zA-Z0-9_-]+$/.test(slug)) {
  console.error('Usage: --slug {safe-slug}');
  process.exit(1);
}

const minPhotoCandidates = Number(args['min-photo-candidates'] || 5);
const minImportantCandidates = Number(args['min-important-candidates'] || 5);
const reelDir = path.join(ROOT, 'output', 'reels', reelFolder(slug));
const scenesPath = path.join(reelDir, 'scenes.json');
const candidatesPath = path.join(reelDir, 'visual-candidates.json');
const motionCardsPath = path.join(reelDir, 'motion-cards.json');
const standardPath = path.join(ROOT, '.claude', 'skills', 'reels', 'thumbnail-style-standard.json');

for (const filePath of [scenesPath, candidatesPath, motionCardsPath, standardPath]) {
  if (!fs.existsSync(filePath)) fail(`Missing required gate file: ${path.relative(ROOT, filePath)}`);
}
if (process.exitCode) process.exit(process.exitCode);

const scenesFile = readJson(scenesPath);
const candidatesFile = readJson(candidatesPath);
const motionCardsFile = readJson(motionCardsPath);
const standard = readJson(standardPath);

validateThumbnail(candidatesFile, standard);
const photoCandidateRows = validateCandidateDepth({
  scenesFile,
  candidatesFile,
  motionCardsFile,
  minPhotoCandidates,
  minImportantCandidates,
});
validateSourceDiversity(photoCandidateRows);

if (process.exitCode) process.exit(process.exitCode);

console.log(`Reels ${slug} dashboard gate passed.`);
console.log(`Photo candidates: ${photoCandidateRows.length}`);
console.log(`Photo source families: ${new Set(photoCandidateRows.map((row) => row.family)).size}`);
