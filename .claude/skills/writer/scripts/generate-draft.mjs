#!/usr/bin/env node
/**
 * EpicKor Writer Brief Generator
 *
 * This script no longer calls an LLM API. It prepares a writing brief from
 * research.json and the EpicKor style guide. Claude/Codex then writes the
 * actual draft markdown directly.
 *
 * 실행:
 *   node .claude/skills/writer/scripts/generate-draft.mjs --research output/research/166_research.json --slug 166
 *
 * 출력:
 *   output/drafts/166_writer-brief.md
 *   사람이/Claude가 작성할 대상: output/drafts/166_draft.md
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../../../../');
const STYLE_GUIDE_PATH = join(__dirname, '../references/epickor-style.md');
const OUTPUT_DIR = join(ROOT, 'output/drafts');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const researchIdx = args.indexOf('--research');
const researchPath = researchIdx !== -1 ? args[researchIdx + 1] : null;
const slugIdx = args.indexOf('--slug');
const forcedSlug = slugIdx !== -1 ? args[slugIdx + 1] : null;

if (!researchPath) {
  console.error('❌ --research 옵션이 필요합니다.');
  console.error('   예: node generate-draft.mjs --research output/research/166_research.json --slug 166');
  process.exit(1);
}

function today() {
  return new Date().toISOString().split('T')[0];
}

function getNextSlug() {
  const blogDir = join(ROOT, 'content/blog');
  if (!existsSync(blogDir)) return 166;
  const nums = readdirSync(blogDir)
    .map(f => parseInt(f.match(/^(\d+)/)?.[1] || '0', 10))
    .filter(n => n > 0);
  return nums.length > 0 ? Math.max(...nums) + 1 : 166;
}

function truncateDescription(text, max = 155) {
  if (!text || text.length <= max) return text || '';
  return text.slice(0, max - 3) + '...';
}

function yamlList(values = []) {
  return `[${values.map(v => `'${String(v).replace(/'/g, "''")}'`).join(', ')}]`;
}

function buildDraftSkeleton(research, slug) {
  const title = research.topic || `EpicKor Blog ${slug}`;
  const description = truncateDescription(
    `A friendly EpicKor guide to ${title}, written for international readers who want the real Korean context.`,
    155
  );
  const tags = research.tags || research.keywords?.slice(0, 4) || ['Korea', 'Korean Culture', 'Travel'];
  const ogImage = research.images?.[0]?.url || '';

  return `---
title: "${title.replace(/"/g, '\\"')}"
slug: "${slug}"
date: "${today()}"
visibility: "private"
publishAt: ""
description: "${description.replace(/"/g, '\\"')}"
ogImage: "${ogImage.replace(/"/g, '\\"')}"
tags: ${yamlList(tags.length >= 3 ? tags : [...tags, 'Korea', 'Korean Culture'].slice(0, 4))}
author: "EpicKor"
---

[Claude/Codex writes the full draft here.]
`;
}

function buildBrief(research, slug, styleGuide) {
  const sources = (research.sources || [])
    .slice(0, 8)
    .map((s, i) => `${i + 1}. ${s.title || 'Untitled'}\n   URL: ${s.url || '(none)'}\n   Summary: ${s.summary || '(no summary)'}`)
    .join('\n\n');

  const facts = (research.facts || [])
    .slice(0, 12)
    .map((fact, i) => `${i + 1}. ${fact}`)
    .join('\n');

  const images = (research.images || [])
    .slice(0, 3)
    .map((img, i) => `${i + 1}. ![${img.alt || research.topic}](${img.url})\n   ${img.credit || ''}`)
    .join('\n\n');

  const skeleton = buildDraftSkeleton(research, slug);

  return `# EpicKor Writer Brief - ${slug}

## Target

- Topic: ${research.topic}
- Slug: ${slug}
- Draft path to create manually: \`output/drafts/${slug}_draft.md\`
- Review command after writing:
  \`node .claude/skills/reviewer/scripts/review-post.mjs --draft output/drafts/${slug}_draft.md --research output/research/${slug}_research.json\`

## Required Draft Skeleton

\`\`\`markdown
${skeleton.trim()}
\`\`\`

## Research Sources

${sources || '(No sources found. Use cautious general context and avoid unverifiable statistics.)'}

## Fact Candidates

${facts || '(No fact candidates found. Do not invent statistics.)'}

## Images To Use

${images || '(No images found. Draft may fail review until images are added.)'}

## Keywords

${(research.keywords || []).join(', ') || '(none)'}

## Writing Requirements

- Write in English for international readers interested in Korean culture.
- Target 1,900-2,300 words; review requires at least 1,800 words.
- Keep posts about 70% as long as the previous 2,800-word drafts.
- Use 4-5 H2 sections.
- Include a FAQ H2 as the second-to-last section with at least 3 Q&A pairs.
- Include the main keyword naturally in the first 100 words.
- Insert at least 2 images from the research data with alt text and credit lines.
- Add at least one internal EpicKor link, such as \`/blog/160\` through \`/blog/165\`, only where it fits naturally.
- Keep \`visibility: "private"\` until preview approval.
- Use only verifiable facts from the research data or clearly general cultural context. Do not invent statistics.

## EpicKor Style Guide

${styleGuide || '(Style guide not found.)'}
`;
}

async function main() {
  const researchAbsPath = resolve(researchPath);
  if (!existsSync(researchAbsPath)) {
    console.error(`❌ research 파일을 찾을 수 없습니다: ${researchAbsPath}`);
    process.exit(1);
  }

  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  const research = JSON.parse(readFileSync(researchAbsPath, 'utf8'));
  const slug = forcedSlug || research.slug || String(getNextSlug());
  const styleGuide = existsSync(STYLE_GUIDE_PATH) ? readFileSync(STYLE_GUIDE_PATH, 'utf8') : '';
  const brief = buildBrief(research, slug, styleGuide);
  const briefPath = join(OUTPUT_DIR, `${slug}_writer-brief.md`);

  research.slug = String(slug);

  console.log(`✍️  Writer brief 생성: "${research.topic}" (slug: ${slug})`);
  if (DRY_RUN) {
    console.log('\n=== Writer brief preview ===');
    console.log(brief.slice(0, 2000));
    return;
  }

  writeFileSync(briefPath, brief, 'utf8');
  writeFileSync(researchAbsPath, JSON.stringify(research, null, 2) + '\n', 'utf8');

  console.log(`\n✅ Writer brief 저장됨: ${briefPath}`);
  console.log(`📌 다음 단계: Claude/Codex가 output/drafts/${slug}_draft.md를 직접 작성합니다.`);
}

main().catch(err => {
  console.error('❌ 오류:', err.message);
  process.exit(1);
});
