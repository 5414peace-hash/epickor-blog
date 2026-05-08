#!/usr/bin/env node
/**
 * EpicKor Card News Brief Generator
 *
 * No LLM API is called here. This script prepares a compact card-news brief
 * from the approved draft and research data. Claude/Codex then writes
 * output/cardnews/{YYYY-MM-DD}_{slug}/script.md directly, and html-to-png.py renders it.
 *
 * 실행:
 *   node .claude/skills/cardnews/scripts/generate-slides.mjs \
 *     --draft output/drafts/166_draft.md \
 *     --research output/research/166_research.json \
 *     --slug 166
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../../../../');

const args = process.argv.slice(2);
const draftIdx = args.indexOf('--draft');
const researchIdx = args.indexOf('--research');
const slugIdx = args.indexOf('--slug');
const DRY_RUN = args.includes('--dry-run');

const draftPath = draftIdx !== -1 ? args[draftIdx + 1] : null;
const researchPath = researchIdx !== -1 ? args[researchIdx + 1] : null;
const slug = slugIdx !== -1 ? args[slugIdx + 1] : null;

if (!draftPath || !slug) {
  console.error('❌ --draft 와 --slug 옵션이 필요합니다.');
  console.error('   예: node generate-slides.mjs --draft output/drafts/166_draft.md --slug 166');
  process.exit(1);
}

function readFile(path) {
  const absPath = resolve(ROOT, path);
  if (!existsSync(absPath)) {
    console.error(`❌ 파일 없음: ${absPath}`);
    process.exit(1);
  }
  return readFileSync(absPath, 'utf8');
}

function ensureDir(dirPath) {
  const abs = resolve(ROOT, dirPath);
  if (!existsSync(abs)) mkdirSync(abs, { recursive: true });
  return abs;
}

function cardnewsFolderName(slug) {
  const date = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
  return `${date}_${slug}`;
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const frontmatter = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    frontmatter[key] = value;
  }
  return frontmatter;
}

function extractSections(markdown) {
  const body = markdown.replace(/^---[\s\S]*?---\n/, '');
  const sections = [];
  const matches = [...body.matchAll(/^##\s+(.+)$/gm)];

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : body.length;
    const heading = matches[i][1].trim();
    const text = body.slice(start, end)
      .replace(/^##\s+.+$/m, '')
      .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    sections.push({
      heading,
      excerpt: text.slice(0, 320),
    });
  }

  return sections;
}

function buildExampleScript(slug, topic) {
  return `---
slug: ${slug}
topic: ${topic}
total_cards: 6
---

## Card 01 - Cover
layout: A
point_color: Gold
image_keyword: korean culture

**Main:** [Hook title with \\n line breaks]
**Sub:** [Short teaser]

---

## Card 02 - Context
layout: B
point_color: Teal
image_keyword: korea

**Main:** [Short headline]
**Sub:** [Two short lines of insight]

---

## Card 03 - Surprise
layout: D
point_color: Gold
image_keyword: none

**Main:** [One memorable takeaway]
**Sub:** [Why it matters]

---

## Card 04 - How It Works
layout: C
point_color: Teal
image_keyword: korean daily life

**Main:** [Practical explanation]
**Sub:** [Clear supporting context]

---

## Card 05 - What Visitors Miss
layout: B
point_color: Teal
image_keyword: seoul korea

**Main:** [Reader-facing insight]
**Sub:** [Concise explanation]

---

## Card 06 - Closing
layout: A
point_color: Gold
image_keyword: korean culture

**Main:** Want to know more\\nabout Korea?
**Sub:** Follow EpicKor for more hidden stories from Korea.

---`;
}

function buildBrief(draft, research, slug) {
  const frontmatter = parseFrontmatter(draft);
  const topic = research?.topic || frontmatter.title || 'Korean Culture';
  const sections = extractSections(draft);
  const images = research?.images || [];
  const facts = research?.facts || [];
  const folderName = cardnewsFolderName(slug);

  const sectionList = sections
    .filter(s => !/faq|frequently asked|conclusion|final/i.test(s.heading))
    .slice(0, 6)
    .map((s, i) => `${i + 1}. ${s.heading}\n   ${s.excerpt}`)
    .join('\n\n');

  const factList = facts.slice(0, 6).map((f, i) => `${i + 1}. ${f}`).join('\n');
  const imageList = images.slice(0, 5)
    .map((img, i) => `${i + 1}. ${img.alt || topic} - ${img.url}\n   ${img.credit || ''}`)
    .join('\n\n');

  return `# EpicKor Card News Brief - ${slug}

## Target

- Topic: ${topic}
- Source draft: \`${draftPath}\`
- Script path to create manually: \`output/cardnews/${folderName}/script.md\`
- Render command after writing:
  \`python .claude/skills/cardnews/scripts/html-to-png.py --slug ${slug}\`

## Best Source Sections

${sectionList || '(No H2 sections found. Review the draft manually.)'}

## Fact Candidates

${factList || '(No facts found.)'}

## Image Candidates

${imageList || '(No research images found. Use image_keyword values for renderer/Pexels workflow.)'}

## Script Rules

- Create 5-8 cards.
- Card 01 must be a hook cover.
- Final card must include EPICKOR.COM in spirit through the standard closing CTA.
- Keep Main text short: about 10 words per line, using \\n where helpful.
- Keep Sub text to 1-3 short lines.
- Use layouts A/B/C/D only.
- Use point_color Gold for cover/emphasis and Teal for explanatory body cards.
- Do not introduce facts that are not in the draft or research data.

## Script Template

\`\`\`markdown
${buildExampleScript(slug, topic)}
\`\`\`
`;
}

async function main() {
  console.log(`🎨 카드뉴스 브리프 생성 시작: slug=${slug}`);

  const draft = readFile(draftPath);
  const research = researchPath && existsSync(resolve(ROOT, researchPath))
    ? JSON.parse(readFile(researchPath))
    : null;

  const folderName = cardnewsFolderName(slug);
  const outputDir = ensureDir(`output/cardnews/${folderName}`);
  ensureDir(`output/cardnews/${folderName}/images`);
  const briefPath = join(outputDir, 'script-brief.md');
  const brief = buildBrief(draft, research, slug);

  if (DRY_RUN) {
    console.log('\n=== Card news brief preview ===');
    console.log(brief.slice(0, 2000));
    return;
  }

  writeFileSync(briefPath, brief, 'utf8');

  console.log(`\n✅ 카드뉴스 브리프 생성 완료: ${briefPath}`);
  console.log(`📌 다음 단계: Claude/Codex가 output/cardnews/${folderName}/script.md를 직접 작성합니다.`);
  console.log(`   그 다음: python .claude/skills/cardnews/scripts/html-to-png.py --slug ${slug}`);
}

main().catch(err => {
  console.error('❌ 오류:', err.message);
  process.exit(1);
});
