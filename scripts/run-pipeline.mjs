#!/usr/bin/env node
/**
 * EpicKor Pipeline Orchestrator
 *
 * API-free writing flow:
 *   1. research  - DuckDuckGo + Pexels -> output/research/{slug}_research.json
 *   2. draft     - writer brief -> Claude/Codex writes output/drafts/{slug}_draft.md
 *   3. review    - rule-based SEO/quality review
 *   4. approval  - human preview approval
 *   5. publish   - Amazon links + GitHub publish
 *
 * 실행:
 *   node scripts/run-pipeline.mjs --slug 166
 *   node scripts/run-pipeline.mjs --step research --slug 166
 *   node scripts/run-pipeline.mjs --step draft --slug 166
 *   node scripts/run-pipeline.mjs --step review --slug 166
 *   node scripts/run-pipeline.mjs --approve 166
 *   node scripts/run-pipeline.mjs --dry-run
 *   node scripts/run-pipeline.mjs --step research --slug 166 --force
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

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

const HANDOFF_PATH = join(ROOT, 'HANDOFF.md');
const QUEUE_PATH = join(ROOT, 'content/data/topics-queue.json');
const OUTPUT_DIR = join(ROOT, 'output');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const FORCE = args.includes('--force');
const stepIdx = args.indexOf('--step');
const step = stepIdx !== -1 ? args[stepIdx + 1] : null;
const slugIdx = args.indexOf('--slug');
const requestedSlug = slugIdx !== -1 ? String(args[slugIdx + 1]) : null;
const approveIdx = args.indexOf('--approve');
const approveSlug = approveIdx !== -1 ? String(args[approveIdx + 1]) : null;
const strategyFlag = args.includes('--strategy');

function log(msg) { console.log(msg); }
function logSection(title) {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`  ${title}`);
  console.log('='.repeat(50));
}

function runScript(scriptPath, scriptArgs = '') {
  const dryRunFlag = DRY_RUN ? '--dry-run' : '';
  const cmd = `node "${scriptPath}" ${scriptArgs} ${dryRunFlag}`.trim();
  log(`  $ ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: ROOT });
}

function readHandoff() {
  if (!existsSync(HANDOFF_PATH)) return '';
  return readFileSync(HANDOFF_PATH, 'utf8');
}

function writeHandoff(content) {
  if (!DRY_RUN) writeFileSync(HANDOFF_PATH, content, 'utf8');
}

function updateHandoffTimestamp(agent) {
  const handoff = readHandoff();
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  writeHandoff(handoff.replace(
    /# 최종 업데이트:.*/,
    `# 최종 업데이트: ${now} | 업데이트한 에이전트: ${agent}`
  ));
}

function readQueue() {
  if (!existsSync(QUEUE_PATH)) return { topics: [] };
  return JSON.parse(readFileSync(QUEUE_PATH, 'utf8'));
}

function writeQueue(queue) {
  if (!DRY_RUN) writeFileSync(QUEUE_PATH, JSON.stringify(queue, null, 2) + '\n', 'utf8');
}

function getNextSlug() {
  const blogDir = join(ROOT, 'content/blog');
  const blogFiles = existsSync(blogDir) ? readdirSync(blogDir) : [];
  const blogNums = blogFiles
    .map(f => parseInt(f.match(/^(\d+)/)?.[1] || '0', 10))
    .filter(n => n > 0);

  const queue = readQueue();
  const queueNums = (queue.topics || [])
    .map(t => parseInt(String(t.generated_slug || '0'), 10))
    .filter(n => n > 0);

  const nums = [...blogNums, ...queueNums];
  return String(nums.length > 0 ? Math.max(...nums) + 1 : 166);
}

function selectTopic(slug) {
  const queue = readQueue();
  const topics = queue.topics || [];
  const targetSlug = slug || getNextSlug();

  let topic = topics.find(t => String(t.generated_slug || '') === targetSlug);
  if (!topic) topic = topics.find(t => t.status === 'pending');
  if (!topic && !slug) topic = topics.find(t => t.status === 'in_progress' && t.generated_slug);

  if (!topic) return { queue, topic: null, slug: targetSlug };
  return { queue, topic, slug: String(topic.generated_slug || targetSlug) };
}

function markTopicInProgress(queue, topicId, slug) {
  const topic = queue.topics?.find(t => t.id === topicId);
  if (!topic) return;
  topic.status = 'in_progress';
  topic.generated_slug = String(slug);
  queue.last_updated = new Date().toISOString().split('T')[0];
  writeQueue(queue);
}

function checkStrategyDue() {
  const handoff = readHandoff();
  const lastAnalysisMatch = handoff.match(/마지막 전략 분석:\s*(.+)/);
  if (!lastAnalysisMatch || lastAnalysisMatch[1].includes('미실시')) return true;

  const lastDate = new Date(lastAnalysisMatch[1].trim());
  const daysSince = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
  return daysSince >= 7;
}

function pathsFor(slug) {
  return {
    researchPath: join(OUTPUT_DIR, `research/${slug}_research.json`),
    draftPath: join(OUTPUT_DIR, `drafts/${slug}_draft.md`),
    writerBriefPath: join(OUTPUT_DIR, `drafts/${slug}_writer-brief.md`),
    reviewPath: join(OUTPUT_DIR, `review/${slug}_review.json`),
    finalPath: join(OUTPUT_DIR, `final/${slug}_final.md`),
  };
}

function setPreviewPending(slug, draftPath) {
  const handoff = readHandoff();
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const localPreviewUrl = `http://localhost:4000/preview/${slug}`;
  const productionPreviewNote = 'Actual-token production preview must be HTTP-verified before sharing; placeholder-token preview URLs are forbidden.';

  const previewBlock = `## 사람 검토 대기

- 슬러그: **${slug}**
- draft 파일: \`${draftPath}\`
- 로컬 미리보기 URL: ${localPreviewUrl}
- 프로덕션 미리보기: ${productionPreviewNote}
- 승인/거절: 위 URL에서 버튼 클릭
- 대기 시작: ${now}
`;

  writeHandoff(handoff.replace(
    /## 사람 검토 대기[\s\S]*?(?=\n---|\n## |$)/,
    previewBlock
  ));
}

async function stepResearch(topic, slug) {
  logSection('Step 1: 리서치팀');
  const { researchPath } = pathsFor(slug);

  if (existsSync(researchPath) && !FORCE) {
    log(`  ✅ research.json 이미 존재: ${researchPath}`);
    return researchPath;
  }

  const { webSearch } = await import('../.claude/skills/research/scripts/web-search.mjs');
  const { fetchPexelsImages } = await import('../.claude/skills/research/scripts/pexels-fetch.mjs');

  const topicTitle = topic.topic || topic.title;
  log(`  🔍 DuckDuckGo 리서치: "${topicTitle}"`);

  let searchResult = { sources: [], facts: [], amazon_keywords: [] };
  try {
    searchResult = await webSearch(topicTitle, 5);
  } catch (err) {
    log(`  ❌ 웹 검색 실패: ${err.message}`);
    log('     리서치 품질이 부족하므로 여기서 중단합니다.');
    process.exit(1);
  }

  const usableSources = (searchResult.sources || []).filter(s => s.url && s.title);
  if (usableSources.length < 3) {
    log(`  ❌ 사용 가능한 소스 부족: ${usableSources.length}건 (최소 3건 필요)`);
    log('     topic 또는 검색 스크립트를 보완한 뒤 다시 실행하세요.');
    process.exit(1);
  }

  log('  🖼️  Pexels 이미지 검색...');
  const imgKeyword = (topic.keywords?.[0] || topicTitle) + ' Korea';
  let images = [];
  try {
    images = await fetchPexelsImages(imgKeyword, 3);
    if (images.length < 2) images = await fetchPexelsImages('Korean culture', 3);
  } catch (err) {
    log(`  ❌ Pexels 실패: ${err.message}`);
    process.exit(1);
  }

  if (images.length < 2) {
    log(`  ❌ 이미지 부족: ${images.length}장 (최소 2장 필요)`);
    log('     PEXELS_API_KEY 또는 검색 키워드를 확인하세요.');
    process.exit(1);
  }

  const research = {
    topic: topicTitle,
    slug: String(slug),
    keywords: topic.keywords || [],
    category: topic.category || '',
    tags: topic.tags || [],
    sources: searchResult.sources || [],
    images,
    facts: searchResult.facts || [],
    amazon_keywords: topic.amazon_hint !== 'none'
      ? [topic.amazon_hint || topic.amazon_category || '', ...(searchResult.amazon_keywords || [])].filter(Boolean)
      : searchResult.amazon_keywords || [],
    researched_at: new Date().toISOString(),
    research_note: 'Generated without Gemini. Claude/Codex must verify source quality while drafting.',
  };

  if (!DRY_RUN) {
    writeFileSync(researchPath, JSON.stringify(research, null, 2) + '\n', 'utf8');
  }
  log(`  ✅ research.json 저장: ${researchPath}${DRY_RUN ? ' [DRY RUN]' : ''}`);
  log(`     소스: ${research.sources.length}건, 이미지: ${research.images.length}장, 팩트 후보: ${research.facts.length}건`);
  return researchPath;
}

async function stepDraftBrief(researchPath, slug) {
  logSection('Step 2: 라이터팀');
  const { draftPath, writerBriefPath } = pathsFor(slug);

  if (existsSync(draftPath)) {
    log(`  ✅ draft.md 이미 존재: ${draftPath}`);
    return { draftPath, draftExists: true };
  }

  runScript(
    join(ROOT, '.claude/skills/writer/scripts/generate-draft.mjs'),
    `--research "${researchPath}" --slug ${slug}`
  );

  log('\n  ⏸️  자동 LLM 호출 없이 여기서 멈춥니다.');
  log(`     Writer brief: ${writerBriefPath}`);
  log(`     Claude/Codex가 직접 작성할 파일: ${draftPath}`);
  return { draftPath, draftExists: false };
}

async function stepReview(draftPath, researchPath, slug) {
  logSection('Step 3: 리뷰어팀');
  const { reviewPath } = pathsFor(slug);

  if (!existsSync(draftPath)) {
    log(`  ❌ draft 파일 없음: ${draftPath}`);
    log('     먼저 Claude/Codex가 writer brief를 바탕으로 draft.md를 작성해야 합니다.');
    return null;
  }

  try {
    runScript(
      join(ROOT, '.claude/skills/reviewer/scripts/review-post.mjs'),
      `--draft "${draftPath}" --research "${researchPath}"`
    );
  } catch {
    // review-post.mjs exits 1 on failed review; still writes review.json.
  }

  if (!existsSync(reviewPath)) {
    log('  ⚠️  review.json 생성 실패. 에스컬레이션 필요.');
    return null;
  }

  const review = JSON.parse(readFileSync(reviewPath, 'utf8'));
  log(`\n  SEO 점수: ${review.seo_score}/100`);
  return review;
}

function stagePrivatePreview(slug, draftPath) {
  logSection('Step 4A: 미리보기용 private 포스트 준비');
  runScript(
    join(ROOT, '.claude/skills/publisher/scripts/publish-post.mjs'),
    `--final "${draftPath}" --visibility private`
  );
}

async function stepPublish(slug) {
  logSection('Step 6: 발행팀');
  const { finalPath } = pathsFor(slug);

  if (!existsSync(finalPath)) {
    log(`  ❌ final.md 없음: ${finalPath}`);
    return;
  }

  runScript(
    join(ROOT, '.claude/skills/publisher/scripts/publish-post.mjs'),
    `--final "${finalPath}" --visibility public`
  );
}

async function prepareTopicAndResearch() {
  const { queue, topic, slug } = selectTopic(requestedSlug);
  if (!topic) {
    log('❌ topics-queue.json에 진행할 주제가 없습니다.');
    process.exit(1);
  }

  log(`\n📌 선택된 주제: "${topic.topic || topic.title}" (슬러그: ${slug})`);
  markTopicInProgress(queue, topic.id, slug);
  const researchPath = await stepResearch(topic, slug);
  return { topic, slug, researchPath };
}

async function runReviewAndPreview(slug, researchPath) {
  const { draftPath } = pathsFor(slug);
  const review = await stepReview(draftPath, researchPath, slug);

  if (!review || !review.pass) {
    log('❌ 리뷰 실패 또는 보류. draft를 수정한 뒤 review 단계를 다시 실행하세요.');
    log(`   node scripts/run-pipeline.mjs --step review --slug ${slug}`);
    return;
  }

  logSection('Step 4: 사람 검토 대기');
  stagePrivatePreview(slug, draftPath);

  log('\n✅ 리뷰 통과! 사람 검토가 필요합니다.');
  log('\n미리보기 URL:');
  log(`  로컬: http://localhost:4000/preview/${slug}`);
  log('  프로덕션: actual PREVIEW_SECRET_TOKEN으로 HTTP 200 검증 후에만 공유. placeholder URL 금지.');
  log('\n승인/거절 방법:');
  log('  1. 위 URL 접속하여 내용 확인');
  log('  2. [승인 후 발행] 또는 [거절] 버튼 클릭');
  log(`  3. 승인 후: node scripts/run-pipeline.mjs --approve ${slug}`);

  setPreviewPending(slug, draftPath);
  updateHandoffTimestamp('Reviewer -> 사람 검토 대기');
}

async function runFullPipeline() {
  logSection('EpicKor 파이프라인 시작');

  if (checkStrategyDue()) {
    log('\n💡 7일 이상 전략 분석을 하지 않았습니다. 필요하면 --strategy 플래그로 확인하세요.\n');
  }

  const { slug, researchPath } = await prepareTopicAndResearch();
  const { draftExists } = await stepDraftBrief(researchPath, slug);

  if (!draftExists) {
    log('\n📌 다음 작업: writer brief를 읽고 초안을 직접 작성한 뒤 리뷰를 실행하세요.');
    log(`   node scripts/run-pipeline.mjs --step review --slug ${slug}`);
    updateHandoffTimestamp('Research -> Writer brief');
    return;
  }

  await runReviewAndPreview(slug, researchPath);
}

async function runStep(stepName) {
  if (stepName === 'research') {
    await prepareTopicAndResearch();
    updateHandoffTimestamp('Research');
    return;
  }

  if (stepName === 'draft') {
    const { slug, researchPath } = await prepareTopicAndResearch();
    await stepDraftBrief(researchPath, slug);
    updateHandoffTimestamp('Writer brief');
    return;
  }

  if (stepName === 'review') {
    const slug = requestedSlug || getNextSlug();
    const { researchPath } = pathsFor(slug);
    if (!existsSync(researchPath)) {
      log(`❌ research 파일 없음: ${researchPath}`);
      log(`   먼저 실행: node scripts/run-pipeline.mjs --step research --slug ${slug}`);
      process.exit(1);
    }
    await runReviewAndPreview(slug, researchPath);
    return;
  }

  log(`❌ 알 수 없는 step: ${stepName}`);
  log('   사용 가능: research, draft, review');
  process.exit(1);
}

async function runApprove(slug) {
  logSection(`승인 처리: 슬러그 ${slug}`);

  const { researchPath, draftPath, finalPath } = pathsFor(slug);

  if (!existsSync(draftPath)) {
    log(`❌ draft 파일 없음: ${draftPath}`);
    process.exit(1);
  }

  logSection('Step 5B: 마케팅팀 (Amazon 링크)');
  const researchArg = existsSync(researchPath) ? `--research "${researchPath}"` : '';
  try {
    runScript(
      join(ROOT, '.claude/skills/marketing/scripts/insert-links.mjs'),
      `--draft "${draftPath}" ${researchArg} --out "${finalPath}"`
    );
  } catch {
    log('  ⚠️  Amazon 링크 삽입 실패. 링크 없이 진행합니다.');
    if (!DRY_RUN) copyFileSync(draftPath, finalPath);
  }

  await stepPublish(slug);
  updateHandoffTimestamp('Publisher');
}

if (approveSlug) {
  await runApprove(approveSlug);
} else if (strategyFlag) {
  logSection('전략팀 분석');
  log('전략 분석은 현재 수동으로 진행됩니다.');
  log('GSC CSV를 output/gsc/ 폴더에 넣거나 직접 analyze-week.mjs를 실행하세요.');
} else if (step) {
  await runStep(step);
} else {
  await runFullPipeline();
}
