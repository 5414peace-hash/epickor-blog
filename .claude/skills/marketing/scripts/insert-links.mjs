#!/usr/bin/env node
/**
 * EpicKor Marketing Agent — Amazon 링크 매칭·삽입
 *
 * 실행: node .claude/skills/marketing/scripts/insert-links.mjs --draft output/drafts/166_draft.md --research output/research/166_research.json
 * 옵션: --draft     초안 MD 파일 경로 (필수)
 *       --research  research.json 경로 (amazon_keywords 참조용)
 *       --dry-run   파일 저장 없이 결과 출력만
 *       --out       최종 파일 저장 경로 (없으면 output/final/{slug}_final.md)
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../../../../');

// .env.local 자동 로딩
const envPath = join(ROOT, '.env.local');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim();
    if (k && !process.env[k]) process.env[k] = v;
  }
}

const AMAZON_LINKS_PATH = join(ROOT, 'content/data/amazon-links.json');
const OUTPUT_DIR = join(ROOT, 'output/final');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const draftIdx = args.indexOf('--draft');
const draftPath = draftIdx !== -1 ? args[draftIdx + 1] : null;
const researchIdx = args.indexOf('--research');
const researchPath = researchIdx !== -1 ? args[researchIdx + 1] : null;
const outIdx = args.indexOf('--out');
const outPath = outIdx !== -1 ? args[outIdx + 1] : null;

if (!draftPath) {
  console.error('❌ --draft 옵션이 필요합니다.');
  process.exit(1);
}

// ─── 카테고리 매칭 규칙 (설계서 섹션 11) ──────────────────────

const TAG_TO_CATEGORY = {
  food: 'Food',
  koreanfood: 'Food',
  kpop: null, // fallback
  celebrity: null,
  travel: null,
  seoul: null,
  language: 'Culture',
  hangul: 'Culture',
  hangeul: 'Culture',
  society: 'Culture',
  beauty: 'Beauty',
  skincare: 'Beauty',
  kbeauty: 'Beauty',
};

function matchCategory(tags, amazonKeywords) {
  const allKeys = [
    ...(tags || []).map(t => t.toLowerCase()),
    ...(amazonKeywords || []).map(k => k.toLowerCase()),
  ];

  for (const key of allKeys) {
    for (const [pattern, category] of Object.entries(TAG_TO_CATEGORY)) {
      if (key.includes(pattern) && category) return category;
    }
  }
  return null;
}

function selectProducts(amazonLinks, category, maxCount = 3) {
  const all = amazonLinks.products || amazonLinks || [];
  const matched = all.filter(p => (p.category || '').toLowerCase() === category.toLowerCase());
  if (matched.length >= 1) return matched.slice(0, maxCount);

  // fallback: 카테고리 상관없이 인기순
  const fallback = all.filter(p => p.featured || p.popular);
  if (fallback.length >= 1) return fallback.slice(0, maxCount);
  return all.slice(0, maxCount);
}

// ─── 삽입 위치 결정 (설계서 섹션 11) ──────────────────────────

function insertLinksIntoBody(body, products) {
  if (products.length === 0) return body;

  // H2 섹션 분리
  const sections = body.split(/(?=^## )/m);
  if (sections.length < 2) {
    // 섹션이 없으면 끝에 추가
    return body + '\n\n' + buildProductBlock(products);
  }

  // FAQ/결론 섹션 식별
  const skipPatterns = /^## .*(?:FAQ|Frequently Asked|Conclusion|Final|Wrap|Summary)/i;
  const insertableSections = sections
    .map((s, i) => ({ index: i, section: s, skip: skipPatterns.test(s.trim()) }))
    .filter(s => !s.skip && s.index > 0);

  const N = sections.length;
  const insertPositions = new Set();

  if (products.length === 1 && insertableSections.length > 0) {
    // 가장 긴 섹션 끝
    const longest = insertableSections.reduce((a, b) =>
      a.section.length > b.section.length ? a : b
    );
    insertPositions.add(longest.index);
  } else if (products.length === 2 && insertableSections.length >= 2) {
    insertPositions.add(insertableSections[0].index);
    insertPositions.add(insertableSections[insertableSections.length - 1].index);
  } else if (products.length >= 3 && insertableSections.length >= 3) {
    insertPositions.add(insertableSections[0].index);
    const mid = Math.floor(insertableSections.length / 2);
    insertPositions.add(insertableSections[mid].index);
    insertPositions.add(insertableSections[insertableSections.length - 1].index);
  }

  // 링크를 하나씩 각 위치에 삽입
  const productArr = products.slice(0, 3);
  let productIdx = 0;

  const modifiedSections = sections.map((section, i) => {
    if (insertPositions.has(i) && productIdx < productArr.length) {
      const product = productArr[productIdx++];
      return section.trimEnd() + '\n\n' + buildSingleProductLine(product) + '\n';
    }
    return section;
  });

  return modifiedSections.join('');
}

function buildSingleProductLine(product) {
  const reason = product.reason || product.description || 'Perfect for Korean culture enthusiasts.';
  const shortReason = reason.slice(0, 100);
  return `> 🛒 **Recommended**: [${product.name}](${product.url}) — ${shortReason}`;
}

function buildProductBlock(products) {
  const lines = products.map(p => buildSingleProductLine(p));
  return lines.join('\n\n');
}

// ─── frontmatter 파싱 ─────────────────────────────────────────────

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
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

// ─── 메인 ────────────────────────────────────────────────────────

async function main() {
  const absPath = resolve(draftPath);
  if (!existsSync(absPath)) {
    console.error(`❌ draft 파일 없음: ${absPath}`);
    process.exit(1);
  }

  if (!existsSync(AMAZON_LINKS_PATH)) {
    console.error(`❌ amazon-links.json 없음: ${AMAZON_LINKS_PATH}`);
    process.exit(1);
  }

  const markdown = readFileSync(absPath, 'utf8');
  const frontmatter = parseFrontmatter(markdown);
  const slug = frontmatter.slug || 'unknown';
  const amazonLinks = JSON.parse(readFileSync(AMAZON_LINKS_PATH, 'utf8'));

  // research.json의 amazon_keywords 참조
  let amazonKeywords = [];
  if (researchPath && existsSync(researchPath)) {
    const research = JSON.parse(readFileSync(researchPath, 'utf8'));
    amazonKeywords = research.amazon_keywords || [];
  }

  console.log(`🛒 Amazon 링크 삽입: ${slug}_draft.md`);
  console.log(`   Tags: ${frontmatter.tags.join(', ')}`);
  console.log(`   Amazon keywords: ${amazonKeywords.join(', ') || '없음'}`);

  const category = matchCategory(frontmatter.tags, amazonKeywords);
  console.log(`   매칭 카테고리: ${category || '관련 상품 없음'}`);

  if (!category) {
    console.log('   관련도가 낮아 Amazon 링크 삽입을 건너뜁니다.');
    const finalPath = outPath || join(OUTPUT_DIR, `${slug}_final.md`);
    if (!DRY_RUN) {
      writeFileSync(finalPath, markdown, 'utf8');
      console.log(`   원문 그대로 저장: ${finalPath}`);
    }
    return;
  }

  const products = selectProducts(amazonLinks, category, 3);
  console.log(`   선택된 상품: ${products.length}개`);

  if (products.length === 0) {
    console.log('⚠️  삽입할 Amazon 링크가 없습니다. amazon-links.json을 확인하세요.');
    // 링크 없이 그대로 final로 복사
    const finalPath = outPath || join(OUTPUT_DIR, `${slug}_final.md`);
    if (!DRY_RUN) {
      writeFileSync(finalPath, markdown, 'utf8');
      console.log(`   링크 없이 저장: ${finalPath}`);
    }
    return;
  }

  products.forEach((p, i) => console.log(`   [${i + 1}] ${p.name} — ${p.url}`));

  // 이미 링크가 있으면 스킵
  if (/amzn\.to|amazon\.com/.test(markdown)) {
    console.log('⚠️  이미 Amazon 링크가 있습니다. 삽입 건너뜀.');
    const finalPath = outPath || join(OUTPUT_DIR, `${slug}_final.md`);
    if (!DRY_RUN) writeFileSync(finalPath, markdown, 'utf8');
    return;
  }

  // frontmatter와 본문 분리
  const fmMatch = markdown.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/);
  const fmStr = fmMatch ? fmMatch[1] : '';
  const body = fmMatch ? fmMatch[2] : markdown;

  const modifiedBody = insertLinksIntoBody(body, products);
  const finalMarkdown = fmStr + modifiedBody;

  const finalPath = outPath || join(OUTPUT_DIR, `${slug}_final.md`);

  if (DRY_RUN) {
    console.log('\n=== 삽입 결과 미리보기 (처음 2000자) ===');
    console.log(finalMarkdown.slice(0, 2000));
  } else {
    writeFileSync(finalPath, finalMarkdown, 'utf8');
    console.log(`\n✅ Amazon 링크 삽입 완료: ${finalPath}`);
  }
}

main().catch(err => {
  console.error('❌ 오류:', err.message);
  process.exit(1);
});
