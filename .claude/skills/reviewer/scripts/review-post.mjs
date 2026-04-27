#!/usr/bin/env node
/**
 * EpicKor Reviewer Agent — SEO 점수 + 품질 검증
 *
 * 실행: node .claude/skills/reviewer/scripts/review-post.mjs --draft output/drafts/166_draft.md --research output/research/166_research.json
 * 옵션: --draft     초안 MD 파일 경로 (필수)
 *       --research  research.json 경로 (팩트 체크용, 선택)
 *       --dry-run   파일 저장 없이 결과 출력만
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../../../../');

const OUTPUT_DIR = join(ROOT, 'output/review');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const draftIdx = args.indexOf('--draft');
const draftPath = draftIdx !== -1 ? args[draftIdx + 1] : null;
const researchIdx = args.indexOf('--research');
const researchPath = researchIdx !== -1 ? args[researchIdx + 1] : null;

if (!draftPath) {
  console.error('❌ --draft 옵션이 필요합니다.');
  process.exit(1);
}

// ─── 규칙 기반 SEO 점수 계산 ────────────────────────────────────

/**
 * 설계서 섹션 10의 루브릭 기준으로 SEO 점수 계산 (0~100점)
 */
function calculateSeoScore(markdown, frontmatter) {
  let score = 0;
  const issues = [];
  const suggestions = [];

  // 1. 단어 수 (20점)
  const body = markdown.replace(/^---[\s\S]*?---\n/, '').trim();
  const wordCount = body.split(/\s+/).filter(Boolean).length;
  if (wordCount >= 1800) {
    score += 20;
  } else if (wordCount >= 1200) {
    score += 10;
    issues.push(`단어 수 부족: ${wordCount}단어 (1800+ 필요)`);
  } else {
    issues.push(`단어 수 심각히 부족: ${wordCount}단어 (1800+ 필요)`);
  }

  // 2. H2 섹션 수 (10점)
  const h2Count = (markdown.match(/^## .+/gm) || []).length;
  if (h2Count >= 4) {
    score += 10;
  } else if (h2Count >= 3) {
    score += 5;
    suggestions.push(`H2 섹션 추가 권장 (현재 ${h2Count}개, 4개 이상 권장)`);
  } else {
    issues.push(`H2 섹션 부족: ${h2Count}개 (4개 이상 필요)`);
  }

  // 3. description 길이 (10점)
  const descLen = (frontmatter.description || '').length;
  if (descLen >= 120 && descLen <= 155) {
    score += 10;
  } else if ((descLen >= 100 && descLen < 120) || (descLen > 155 && descLen <= 170)) {
    score += 5;
    suggestions.push(`description 길이 조정: ${descLen}자 (120~155자 권장)`);
  } else {
    issues.push(`description 길이 문제: ${descLen}자 (120~155자 필요)`);
  }

  // 4. 메인 키워드 첫 100단어 위치 (10점)
  const first100Words = body.split(/\s+/).slice(0, 100).join(' ').toLowerCase();
  const slug = frontmatter.slug || '';
  const titleWords = (frontmatter.title || '').toLowerCase().split(/\s+/).filter(w => w.length > 4);
  const keywordInFirst100 = titleWords.some(w => first100Words.includes(w));
  if (keywordInFirst100) {
    score += 10;
  } else {
    suggestions.push('메인 키워드를 첫 100단어 내에 자연스럽게 삽입하세요.');
  }

  // 5. FAQ 섹션 (20점)
  const hasFaqSection = /## .*(?:FAQ|Frequently Asked)/i.test(markdown);
  const faqQACount = (markdown.match(/\*\*Q:/g) || []).length;
  if (hasFaqSection && faqQACount >= 3) {
    score += 20;
  } else if (hasFaqSection || faqQACount >= 1) {
    score += 10;
    suggestions.push(`FAQ 섹션 보강: Q&A ${faqQACount}개 (3개 이상 필요), FAQ H2 헤딩 ${hasFaqSection ? '있음' : '없음'}`);
  } else {
    issues.push('FAQ 섹션 없음 — GEO 최적화를 위해 필수');
    suggestions.push('## FAQ 섹션을 추가하고 **Q: ...** / Simply put... 형식으로 3개 Q&A를 작성하세요.');
  }

  // 6. 이미지 (10점)
  const imgMatches = markdown.match(/!\[.+?\]\(.+?\)/g) || [];
  const imgWithAlt = imgMatches.filter(m => m.match(/!\[.+\]/));
  if (imgMatches.length >= 2 && imgWithAlt.length === imgMatches.length) {
    score += 10;
  } else if (imgMatches.length >= 1) {
    score += 5;
    if (imgWithAlt.length < imgMatches.length) {
      issues.push('일부 이미지에 alt 텍스트가 없습니다.');
    }
    if (imgMatches.length < 2) {
      suggestions.push('이미지를 2장 이상 삽입하세요.');
    }
  } else {
    issues.push('이미지가 없습니다. 2장 이상 삽입 필요.');
  }

  // 7. 내부 링크 (10점)
  const hasInternalLink = /\[.+?\]\(https?:\/\/epickor\.com/.test(markdown) ||
    /\[.+?\]\(\/blog\//.test(markdown);
  if (hasInternalLink) {
    score += 10;
  } else {
    suggestions.push('epickor.com 내부 링크를 1개 이상 추가하세요.');
  }

  // 8. ogImage (5점)
  if (frontmatter.ogImage && frontmatter.ogImage.trim()) {
    score += 5;
  } else {
    issues.push('ogImage 필드가 비어 있습니다.');
  }

  // 9. tags (5점)
  const tags = frontmatter.tags || [];
  if (tags.length >= 3) {
    score += 5;
  } else {
    suggestions.push(`tags를 3개 이상 추가하세요 (현재 ${tags.length}개).`);
  }

  return { score, wordCount, h2Count, imgCount: imgMatches.length, faqQACount, issues, suggestions };
}

// ─── frontmatter 파싱 ─────────────────────────────────────────────

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fm = {};
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

// ─── 이미지 이슈 체크 ────────────────────────────────────────────

function checkImageIssues(markdown) {
  const issues = [];
  const imgMatches = [...markdown.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)];
  for (const m of imgMatches) {
    if (!m[1].trim()) {
      issues.push(`alt 텍스트 없는 이미지: ${m[2].slice(0, 80)}`);
    }
  }
  return issues;
}

// ─── 메인 ────────────────────────────────────────────────────────

async function main() {
  const absPath = resolve(draftPath);
  if (!existsSync(absPath)) {
    console.error(`❌ draft 파일을 찾을 수 없습니다: ${absPath}`);
    process.exit(1);
  }

  const markdown = readFileSync(absPath, 'utf8');
  const frontmatter = parseFrontmatter(markdown);
  const slug = frontmatter.slug || 'unknown';

  console.log(`🔍 리뷰 시작: ${slug}_draft.md`);

  const seoResult = calculateSeoScore(markdown, frontmatter);
  const imageIssues = checkImageIssues(markdown);

  const pass = seoResult.score >= 70 && seoResult.issues.length === 0;

  const review = {
    slug,
    pass,
    seo_score: seoResult.score,
    word_count: seoResult.wordCount,
    h2_count: seoResult.h2Count,
    img_count: seoResult.imgCount,
    faq_qa_count: seoResult.faqQACount,
    fact_issues: [],
    style_issues: [],
    image_issues: imageIssues,
    suggestions: seoResult.suggestions,
    quality_issues: seoResult.issues,
    reviewed_at: new Date().toISOString(),
    auto_retry_eligible: seoResult.score >= 50 && seoResult.score < 70,
  };

  // 결과 출력
  console.log(`\n=== 리뷰 결과 ===`);
  console.log(`결과: ${pass ? '✅ 통과' : '❌ 실패'}`);
  console.log(`SEO 점수: ${seoResult.score}/100`);
  console.log(`단어 수: ${seoResult.wordCount}`);
  console.log(`H2 섹션: ${seoResult.h2Count}개`);
  console.log(`이미지: ${seoResult.imgCount}장`);
  console.log(`FAQ Q&A: ${seoResult.faqQACount}개`);

  if (seoResult.issues.length > 0) {
    console.log('\n⚠️  필수 수정 사항:');
    seoResult.issues.forEach(i => console.log(`  - ${i}`));
  }
  if (seoResult.suggestions.length > 0) {
    console.log('\n💡 개선 제안:');
    seoResult.suggestions.forEach(s => console.log(`  - ${s}`));
  }

  if (!pass) {
    if (seoResult.score >= 50) {
      console.log('\n→ 자동 재시도 가능 (50~69점)');
    } else {
      console.log('\n→ 에스컬레이션 필요 (50점 미만)');
    }
  }

  const outputPath = join(OUTPUT_DIR, `${slug}_review.json`);
  if (!DRY_RUN) {
    writeFileSync(outputPath, JSON.stringify(review, null, 2) + '\n', 'utf8');
    console.log(`\n✅ 리뷰 결과 저장됨: ${outputPath}`);
  }

  return review;
}

main().then(review => {
  process.exit(review.pass ? 0 : 1);
}).catch(err => {
  console.error('❌ 오류:', err.message);
  process.exit(1);
});
