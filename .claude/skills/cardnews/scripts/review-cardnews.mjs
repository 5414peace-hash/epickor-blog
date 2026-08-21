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

// Carousels used to be built under output/cardnews, but nothing has been written
// there since 2026-08-09 - production moved to public/assets/cardnews. Looking in
// only the old place made `--slug 223` exit with "No card-news output folder found",
// which reads like "nothing to review" rather than "wrong directory", and this is a
// mandatory gate. Check both, newest wins.
const folder = explicitFolder
  ? path.resolve(root, explicitFolder)
  : (findFolderBySlug(path.join(root, 'public', 'assets', 'cardnews'), slug)
     || findFolderBySlug(path.join(root, 'output', 'cardnews'), slug));

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
  const image = (block.match(/^image:[ \t]*(.*)$/m) || [])[1]?.trim() || '';
  const imageLabel = (block.match(/^image_label:[ \t]*(.*)$/m) || [])[1]?.trim() || '';
  const nameKo = (block.match(/^name_ko:[ \t]*(.*)$/m) || [])[1]?.trim() || '';
  const nameEn = (block.match(/^name_en:[ \t]*(.*)$/m) || [])[1]?.trim() || '';
  const subjectNote = (block.match(/^subject_note:[ \t]*(.*)$/m) || [])[1]?.trim() || '';
  return { number, image, imageLabel, nameKo, nameEn, subjectNote };
});

/**
 * Product identity, checked against the card's own words.
 *
 * Added 2026-08-03 after a carousel shipped with a photograph of red seafood
 * ramyeon on the card headed CHAPAGHETTI — a black bean noodle with no broth
 * and no chili. The mismatch was not hidden: the block declared
 *
 *   image_label: Seafood ramyeon in a stainless bowl with a Korean spoon
 *   **Main:** CHAPAGHETTI
 *
 * on adjacent lines, and nothing read one against the other. Every gate in
 * place asked whether an image existed, never whether it was the thing the
 * card names. This is the cheapest possible version of that question.
 */
function normalise(text) {
  return text.toLowerCase().replace(/\\n/g, ' ').replace(/[^a-z0-9가-힣]+/g, '');
}

/**
 * Matched on tokens, not as one contiguous string.
 *
 * The first cut compared the whole name against the label as a substring and
 * failed BANANA MILK against "Binggrae banana flavoured milk in its jar-shaped
 * bottle" — every word present, one adjective in between. A gate that cries
 * wolf on a correct card is worse than no gate, because the next person learns
 * to skip the output. Requiring every token of the name to appear somewhere in
 * the label still fails the case this exists for: CHAPAGHETTI against a label
 * about seafood ramyeon shares no token at all.
 */
/**
 * Korean administrative suffixes, dropped before matching.
 *
 * MULLAE-DONG against "…working steel workshops in Mullae" was the second
 * false failure this gate produced. -dong is the ward suffix, not part of the
 * place name, and a photograph captioned with the bare name is still a
 * photograph of the right place. Same for -gu, -ro and -gil.
 */
const PLACE_SUFFIXES = new Set(['dong', 'gu', 'gun', 'ro', 'gil', 'si', 'eup', 'myeon']);

function nameIsInLabel(name, label) {
  const flat = normalise(label);
  const tokens = name
    .replace(/\\n/g, ' ')
    .split(/[\s/·,\-–—]+/)
    .map((t) => normalise(t))
    .filter((t) => t.length >= 3 && !PLACE_SUFFIXES.has(t));
  if (!tokens.length) return false;
  return tokens.every((t) => flat.includes(t));
}

const failures = [];
const warnings = [];

if (!cards.length) {
  failures.push('No cards parsed from script.md.');
}

for (const card of cards) {
  if (!card.image) continue;
  if (!card.imageLabel) {
    warnings.push(`Card ${card.number}: image has no image_label, so its subject cannot be checked.`);
    continue;
  }
  const names = [card.nameKo, card.nameEn].filter(Boolean);
  if (!names.length) continue;
  const matched = names.some((n) => nameIsInLabel(n, card.imageLabel));
  if (!matched && card.subjectNote) {
    // A card can head a concept rather than a product — an end-of-day markdown
    // card legitimately shows the food that gets marked down. The exemption is
    // a warning rather than a silent pass, so the reason is restated on every
    // single run instead of being written once and forgotten.
    warnings.push(`Card ${card.number}: subject exemption claimed — "${card.subjectNote}". Confirm by eye.`);
    continue;
  }
  if (!matched) {
    failures.push(
      `Card ${card.number}: names "${[card.nameKo, card.nameEn].filter(Boolean).join(' / ').replace(/\\n/g, ' ')}" ` +
        `but its image is labelled "${card.imageLabel}". A card that names a product must show that product.`
    );
  }
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
    failures.push(`Repeated image within carousel: ${card.image} on cards ${seenWithinCarousel.get(card.image)} and ${card.number}. Use a different source, crop saved as a separate asset, or an image-free graphic card.`);
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
