#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const slugIndex = args.indexOf('--slug');
const folderIndex = args.indexOf('--folder');
const slug = slugIndex >= 0 ? args[slugIndex + 1] : '';
const explicitFolder = folderIndex >= 0 ? args[folderIndex + 1] : '';

if (!slug && !explicitFolder) {
  console.error('Usage: node .claude/skills/cardnews/scripts/review-cardnews.mjs --slug 055');
  process.exit(2);
}

const root = process.cwd();

function findFolderBySlug(baseDir, targetSlug) {
  if (!fs.existsSync(baseDir)) return null;
  const folders = fs.readdirSync(baseDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name.endsWith(`_${targetSlug}`))
    .map((entry) => path.join(baseDir, entry.name))
    .sort();
  return folders.at(-1) || null;
}

const folder = explicitFolder
  ? path.resolve(root, explicitFolder)
  : findFolderBySlug(path.join(root, 'output', 'cardnews'), slug);

if (!folder) {
  console.error(`No card-news output folder found for slug ${slug}`);
  process.exit(1);
}

const scriptPath = path.join(folder, 'script.md');
if (!fs.existsSync(scriptPath)) {
  console.error(`Missing script.md: ${scriptPath}`);
  process.exit(1);
}

const script = fs.readFileSync(scriptPath, 'utf8');
const blocks = script.split(/\n(?=## Card\s+\d+)/g).filter((block) => /^## Card\s+\d+/m.test(block));
const cards = blocks.map((block) => {
  const number = (block.match(/^## Card\s+(\d+)/m) || [])[1] || '?';
  const image = (block.match(/^image:\s*(.*)$/m) || [])[1]?.trim() || '';
  return { number, image };
});

const failures = [];
const warnings = [];

if (!cards.length) {
  failures.push('No cards parsed from script.md.');
}

const imageCards = cards.filter((card) => card.image);
const minImageCards = Math.ceil(cards.length / 2);

if (imageCards.length === 0) {
  failures.push('No image cards found. A carousel with usable source photos must not be approved as photo-free.');
}

if (imageCards.length < minImageCards) {
  failures.push(`Only ${imageCards.length}/${cards.length} cards use images; minimum gate is ${minImageCards}/${cards.length}.`);
}

let maxConsecutiveNoImage = 0;
let currentNoImage = 0;
for (const card of cards) {
  if (card.image) {
    currentNoImage = 0;
  } else {
    currentNoImage += 1;
    maxConsecutiveNoImage = Math.max(maxConsecutiveNoImage, currentNoImage);
  }
}

if (maxConsecutiveNoImage > 2) {
  failures.push(`Found ${maxConsecutiveNoImage} consecutive image-free cards; maximum allowed without documented representative approval is 2.`);
}

const seenWithinCarousel = new Map();
for (const card of imageCards) {
  if (card.image.startsWith('/assets/')) {
    const localPath = path.join(root, 'public', card.image.replace(/^\/assets\//, 'assets/'));
    if (!fs.existsSync(localPath)) {
      failures.push(`Card ${card.number} image path does not exist: ${card.image}`);
    }
  }

  if (seenWithinCarousel.has(card.image)) {
    warnings.push(`Repeated image within carousel: ${card.image} on cards ${seenWithinCarousel.get(card.image)} and ${card.number}.`);
  } else {
    seenWithinCarousel.set(card.image, card.number);
  }
}

const publicCardnewsDir = path.join(root, 'public', 'assets', 'cardnews');
const currentFolderName = path.basename(folder);
const crossPostDuplicates = [];

if (fs.existsSync(publicCardnewsDir)) {
  for (const entry of fs.readdirSync(publicCardnewsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (entry.name === currentFolderName) continue;
    const otherScriptPath = path.join(publicCardnewsDir, entry.name, 'script.md');
    if (!fs.existsSync(otherScriptPath)) continue;
    const otherScript = fs.readFileSync(otherScriptPath, 'utf8');
    for (const card of imageCards) {
      if (card.image && otherScript.includes(card.image)) {
        crossPostDuplicates.push(`${card.image} also appears in ${entry.name}`);
      }
    }
  }
}

if (crossPostDuplicates.length) {
  failures.push(`Cross-post image duplicate(s): ${crossPostDuplicates.join('; ')}`);
}

console.log(`Card news review: ${path.relative(root, folder)}`);
console.log(`Cards: ${cards.length}`);
console.log(`Image cards: ${imageCards.length}/${cards.length}`);
console.log(`Max consecutive image-free cards: ${maxConsecutiveNoImage}`);

for (const warning of warnings) {
  console.warn(`WARN: ${warning}`);
}

if (failures.length) {
  for (const failure of failures) {
    console.error(`FAIL: ${failure}`);
  }
  process.exit(1);
}

console.log('PASS: structural image coverage gate passed. Manual PNG visual inspection is still required.');
