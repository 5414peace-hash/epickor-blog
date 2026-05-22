#!/usr/bin/env node
/**
 * EpicKor Amazon affiliate link inserter.
 *
 * Usage:
 *   node .claude/skills/marketing/scripts/insert-links.mjs --draft output/drafts/166_draft.md --research output/research/166_research.json
 *
 * Options:
 *   --draft     Required markdown draft path.
 *   --research  Optional research JSON path. Uses amazon_keywords when present.
 *   --dry-run   Print a preview instead of writing.
 *   --out       Output path. Defaults to output/final/{slug}_final.md.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../../../../');

const envPath = join(ROOT, '.env.local');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (key && !process.env[key]) process.env[key] = value;
  }
}

const AMAZON_LINKS_PATH = join(ROOT, 'content/data/amazon-links.json');
const OUTPUT_DIR = join(ROOT, 'output/final');
const DEFAULT_CTA_COUNT = 2;

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const draftIdx = args.indexOf('--draft');
const draftPath = draftIdx !== -1 ? args[draftIdx + 1] : null;
const researchIdx = args.indexOf('--research');
const researchPath = researchIdx !== -1 ? args[researchIdx + 1] : null;
const outIdx = args.indexOf('--out');
const outPath = outIdx !== -1 ? args[outIdx + 1] : null;

if (!draftPath) {
  console.error('Missing required --draft option.');
  process.exit(1);
}

const TAG_TO_CATEGORY = {
  beauty: 'Beauty',
  skincare: 'Beauty',
  kbeauty: 'Beauty',
  'k-beauty': 'Beauty',
  sunscreen: 'Beauty',
  spf: 'Beauty',
  oliveyoung: 'Beauty',
  food: 'Food',
  koreanfood: 'Food',
  breakfast: 'Food',
  snack: 'Food',
  cafe: 'Coffee',
  coffee: 'Coffee',
  koreancafe: 'Coffee',
  shopping: 'Shopping',
  koreashopping: 'Shopping',
  souvenir: 'Shopping',
  travel: 'Travel',
  koreatravel: 'Travel',
  tourist: 'Travel',
  itinerary: 'Travel',
  seoul: 'Travel',
  language: 'Culture',
  hangul: 'Culture',
  hangeul: 'Culture',
  history: 'Culture',
  politics: 'Culture',
  social: 'Culture',
  society: 'Culture',
  culture: 'Culture',
  kpop: 'Culture',
  'k-pop': 'Culture',
  kdrama: 'Culture',
  'k-drama': 'Culture',
  drama: 'Culture',
  celebrity: 'Culture',
  idol: 'Culture',
  cinema: 'Culture',
  movie: 'Culture',
  concert: 'Culture',
  relationship: 'Culture',
  design: 'Culture',
  art: 'Culture',
  trend: 'Culture',
  gaming: 'Shopping',
  technology: 'Shopping',
  sports: 'Shopping',
  lifestyle: 'Shopping',
  life: 'Shopping',
  fashion: 'Fashion',
  music: 'Music',
};

const FALLBACK_CATEGORIES = ['Food', 'Shopping', 'Beauty', 'Coffee', 'Culture', 'Travel'];
const STOP_CONTEXT_TERMS = new Set([
  'korea',
  'korean',
  'south',
  'guide',
  'best',
  'ultimate',
  'culture',
  'travel',
  'seoul',
  'thing',
  'things',
]);

function normalizeKey(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function matchCategory(tags, amazonKeywords) {
  const allKeys = [...(tags || []), ...(amazonKeywords || [])].map(normalizeKey);

  for (const key of allKeys) {
    for (const [pattern, category] of Object.entries(TAG_TO_CATEGORY)) {
      if (key.includes(normalizeKey(pattern))) return category;
    }
  }

  return null;
}

function selectProducts(amazonLinks, category, contextTerms = [], maxCount = DEFAULT_CTA_COUNT) {
  const all = amazonLinks.products || amazonLinks || [];
  const scored = all
    .map((product, index) => ({
      product,
      index,
      score: scoreProduct(product, category, contextTerms),
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index);

  const selected = scored
    .filter(item => item.score > 0)
    .slice(0, maxCount)
    .map(item => item.product);

  for (const fallbackCategory of FALLBACK_CATEGORIES) {
    for (const product of all) {
      if (selected.length >= maxCount) return selected;
      const isSameCategory = normalizeKey(product.category) === normalizeKey(fallbackCategory);
      const isAlreadySelected = selected.some(p => p.url === product.url);
      if (isSameCategory && !isAlreadySelected) selected.push(product);
    }
  }

  for (const product of all) {
    if (selected.length >= maxCount) break;
    if (!selected.some(p => p.url === product.url)) selected.push(product);
  }

  return selected;
}

function scoreProduct(product, category, contextTerms) {
  let score = 0;
  if (category && normalizeKey(product.category) === normalizeKey(category)) score += 6;

  const productText = normalizeKey([
    product.name,
    product.description,
    product.category,
    ...(product.tags || []),
  ].join(' '));

  for (const term of contextTerms || []) {
    const key = normalizeKey(term);
    if (key.length < 4) continue;
    if (STOP_CONTEXT_TERMS.has(key)) continue;
    if (productText.includes(key)) score += 4;
  }

  return score;
}

function countCtaBoxes(markdown) {
  return (markdown.match(/affiliate-inline-cta/g) || []).length;
}

function removeLegacyAffiliateBlocks(markdown) {
  return markdown
    .split(/\r?\n/)
    .filter(line => !/^>\s*.*(?:Recommended|\?썟|🛒).*(?:amzn\.to|amazon\.com)/i.test(line))
    .join('\n')
    .replace(/\n{4,}/g, '\n\n\n');
}

function insertLinksIntoBody(body, products, neededCount = DEFAULT_CTA_COUNT) {
  if (!products.length || neededCount <= 0) return body;

  const ctaProducts = products.slice(0, neededCount);
  const sections = body.split(/(?=^#{2,3} )/m);
  if (sections.length < 2) {
    return `${body.trimEnd()}\n\n${ctaProducts.map((product, index) => buildCtaBox(product, index === 0)).join('\n\n')}\n`;
  }

  const skipPatterns = /^#{2,3} .*(?:FAQ|Frequently Asked|Conclusion|Final|Wrap|Summary|Easiest Rule|Video Insight)/i;
  const insertableSections = sections
    .map((section, index) => ({ index, section, skip: skipPatterns.test(section.trim()) }))
    .filter(item => item.index > 0 && !item.skip);

  if (!insertableSections.length) {
    return `${body.trimEnd()}\n\n${ctaProducts.map((product, index) => buildCtaBox(product, index === 0)).join('\n\n')}\n`;
  }

  const insertPositions = new Set();
  insertPositions.add(insertableSections[0].index);
  if (ctaProducts.length > 1 && insertableSections.length > 1) {
    insertPositions.add(insertableSections[Math.max(1, insertableSections.length - 2)].index);
  }

  let productIdx = 0;

  const modifiedSections = sections.map((section, index) => {
    if (!insertPositions.has(index) || productIdx >= ctaProducts.length) return section;
    const product = ctaProducts[productIdx];
    const isFirstCta = productIdx === 0;
    productIdx += 1;
    return `${section.trimEnd()}\n\n${buildCtaBox(product, isFirstCta)}\n\n`;
  });

  let nextBody = modifiedSections.join('');
  while (productIdx < ctaProducts.length) {
    nextBody = `${nextBody.trimEnd()}\n\n${buildCtaBox(ctaProducts[productIdx], productIdx === 0)}\n`;
    productIdx += 1;
  }

  return nextBody;
}

function buildCtaBox(product, includeDisclosure) {
  const rawReason = (product.reason || product.description || 'Useful for readers who want to compare a related Korean product.').replace(/\s+/g, ' ').trim();
  const reason = /[.!?]$/.test(rawReason) ? rawReason : `${rawReason}.`;
  const disclosure = includeDisclosure
    ? 'As an Amazon Associate, EpicKor may earn from qualifying purchases. '
    : '';

  return [
    '<div class="affiliate-inline-cta">',
    `  <p><strong>Worth comparing:</strong> ${disclosure}${escapeHtml(reason)} Start with <a href="${escapeAttribute(product.url)}">${escapeHtml(product.name)}</a>.</p>`,
    '</div>',
  ].join('\n');
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/"/g, '&quot;');
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { slug: 'unknown', tags: [] };

  const fm = { tags: [] };
  for (const line of match[1].split('\n')) {
    const eq = line.indexOf(':');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    const val = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (key === 'tags') {
      fm.tags = (val.match(/['"]([^'"]+)['"]/g) || []).map(t => t.replace(/['"]/g, ''));
    } else {
      fm[key] = val;
    }
  }
  return fm;
}

async function main() {
  const absPath = resolve(draftPath);
  if (!existsSync(absPath)) {
    console.error(`Draft file not found: ${absPath}`);
    process.exit(1);
  }

  if (!existsSync(AMAZON_LINKS_PATH)) {
    console.error(`amazon-links.json not found: ${AMAZON_LINKS_PATH}`);
    process.exit(1);
  }

  const originalMarkdown = readFileSync(absPath, 'utf8').replace(/^\uFEFF/, '');
  const markdown = removeLegacyAffiliateBlocks(originalMarkdown);
  const frontmatter = parseFrontmatter(markdown);
  const slug = frontmatter.slug || 'unknown';
  const amazonLinks = JSON.parse(readFileSync(AMAZON_LINKS_PATH, 'utf8'));

  let amazonKeywords = [];
  if (researchPath && existsSync(researchPath)) {
    const research = JSON.parse(readFileSync(researchPath, 'utf8'));
    amazonKeywords = research.amazon_keywords || [];
  }

  console.log(`Amazon link insertion: ${slug}`);
  console.log(`   Tags: ${frontmatter.tags.join(', ') || 'none'}`);
  console.log(`   Amazon keywords: ${amazonKeywords.join(', ') || 'none'}`);

  const currentCtaCount = countCtaBoxes(markdown);
  const neededCtaCount = Math.max(0, DEFAULT_CTA_COUNT - currentCtaCount);
  console.log(`   Existing CTA boxes: ${currentCtaCount}`);
  console.log(`   Needed CTA boxes: ${neededCtaCount}`);

  if (neededCtaCount === 0) {
    console.log('   CTA target already met. Copying cleaned markdown.');
    const finalPath = outPath || join(OUTPUT_DIR, `${slug}_final.md`);
    if (!DRY_RUN) writeFileSync(finalPath, markdown, 'utf8');
    return;
  }

  const category = matchCategory(frontmatter.tags, amazonKeywords);
  const contextTerms = [
    frontmatter.title,
    ...(frontmatter.title || '').split(/[^A-Za-z0-9]+/),
    ...frontmatter.tags,
    ...amazonKeywords,
  ].filter(Boolean);

  const products = selectProducts(
    amazonLinks,
    category,
    contextTerms,
    neededCtaCount
  );

  console.log(`   Matched category: ${category || 'fallback'}`);
  console.log(`   Selected products: ${products.length}`);
  products.forEach((product, index) => console.log(`   [${index + 1}] ${product.name} -> ${product.url}`));

  if (!products.length) {
    console.log('   No Amazon products available. Copying draft unchanged.');
    const finalPath = outPath || join(OUTPUT_DIR, `${slug}_final.md`);
    if (!DRY_RUN) writeFileSync(finalPath, markdown, 'utf8');
    return;
  }

  const fmMatch = markdown.match(/^(---\r?\n[\s\S]*?\r?\n---\r?\n)([\s\S]*)$/);
  const fmStr = fmMatch ? fmMatch[1] : '';
  const body = fmMatch ? fmMatch[2] : markdown;
  const finalMarkdown = fmStr + insertLinksIntoBody(body, products, neededCtaCount);
  const finalPath = outPath || join(OUTPUT_DIR, `${slug}_final.md`);

  if (DRY_RUN) {
    console.log('\n=== Preview ===');
    console.log(finalMarkdown.slice(0, 2500));
  } else {
    writeFileSync(finalPath, finalMarkdown, 'utf8');
    console.log(`Amazon link insertion complete: ${finalPath}`);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
