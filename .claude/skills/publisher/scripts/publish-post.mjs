#!/usr/bin/env node
/**
 * EpicKor Publisher Agent — GitHub API로 포스트 발행
 *
 * 실행: node .claude/skills/publisher/scripts/publish-post.mjs --final output/final/166_final.md
 * 옵션: --final     최종 MD 파일 경로 (필수)
 *       --dry-run   실제 커밋 없이 결과 출력만
 *       --visibility public|private (기본 public — 최종 발행 시, private — 미리보기 준비)
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

const GITHUB_TOKEN = process.env.STUDIO_GITHUB_TOKEN || process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
const GITHUB_OWNER = '5414peace-hash';
const GITHUB_REPO = 'epickor-blog';
const GITHUB_BRANCH = 'master';

const TOPICS_QUEUE_PATH = join(ROOT, 'content/data/topics-queue.json');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const finalIdx = args.indexOf('--final');
const finalPath = finalIdx !== -1 ? args[finalIdx + 1] : null;
const visIdx = args.indexOf('--visibility');
const visibility = visIdx !== -1 ? args[visIdx + 1] : 'public';

if (!finalPath) {
  console.error('❌ --final 옵션이 필요합니다.');
  process.exit(1);
}

if (!GITHUB_TOKEN && !DRY_RUN) {
  console.error('❌ STUDIO_GITHUB_TOKEN 환경변수가 없습니다.');
  process.exit(1);
}

// ─── frontmatter 파싱/수정 ────────────────────────────────────────

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return { slug: 'unknown' };
  const fm = {};
  for (const line of match[1].split('\n')) {
    const eq = line.indexOf(':');
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    const val = line.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    fm[key] = val;
  }
  return fm;
}

function setVisibility(markdown, vis) {
  return markdown.replace(
    /^(visibility:\s*)["\']?(?:public|private)["\']?/m,
    `$1"${vis}"`
  );
}

// ─── GitHub API ──────────────────────────────────────────────────

async function githubRequest(method, path, body) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res;
}

async function getFileSha(filePath) {
  const res = await githubRequest('GET', `contents/${filePath}?ref=${GITHUB_BRANCH}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`파일 조회 실패: ${res.status}`);
  const data = await res.json();
  return data.sha || null;
}

async function commitFile(filePath, content, message, sha) {
  const body = {
    message,
    content: Buffer.from(content, 'utf8').toString('base64'),
    branch: GITHUB_BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await githubRequest('PUT', `contents/${filePath}`, body);
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub 커밋 실패 (${res.status}): ${err.slice(0, 300)}`);
  }
  return await res.json();
}

// ─── topics-queue.json 업데이트 ──────────────────────────────────

async function markTopicDone(slug) {
  if (!existsSync(TOPICS_QUEUE_PATH)) return;
  const queue = JSON.parse(readFileSync(TOPICS_QUEUE_PATH, 'utf8'));
  const topic = queue.topics?.find(t => String(t.generated_slug) === String(slug) || String(t.id) === String(slug));
  if (topic) {
    topic.status = 'done';
    topic.generated_slug = slug;
    topic.generated_date = new Date().toISOString().split('T')[0];
    writeFileSync(TOPICS_QUEUE_PATH, JSON.stringify(queue, null, 2) + '\n', 'utf8');
    console.log(`   topics-queue.json 업데이트: ID ${topic.id} → done`);

    // pending 남은 수 체크
    const pendingCount = queue.topics.filter(t => t.status === 'pending').length;
    if (pendingCount <= 10) {
      console.log(`⚠️  topics-queue.json에 pending 주제가 ${pendingCount}개 남았습니다. 전략팀 주제 보충 권장.`);
    }
  }
}

// ─── HANDOFF.md 업데이트 ─────────────────────────────────────────

function updateHandoff(slug, vercelUrl) {
  const handoffPath = join(ROOT, 'HANDOFF.md');
  if (!existsSync(handoffPath)) return;
  const content = readFileSync(handoffPath, 'utf8');
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const updated = content
    .replace(/# 최종 업데이트:.*/, `# 최종 업데이트: ${now} | 업데이트한 에이전트: Publisher`)
    .replace(/## 사람 검토 대기[\s\S]*?(?=\n---|\n## )/, `## 사람 검토 대기\n\n- 현재 없음\n`);
  writeFileSync(handoffPath, updated, 'utf8');
}

// ─── 메인 ────────────────────────────────────────────────────────

async function main() {
  const absPath = resolve(finalPath);
  if (!existsSync(absPath)) {
    console.error(`❌ final 파일 없음: ${absPath}`);
    process.exit(1);
  }

  let markdown = readFileSync(absPath, 'utf8');
  const frontmatter = parseFrontmatter(markdown);
  const slug = frontmatter.slug;

  if (!slug) {
    console.error('❌ frontmatter에서 slug를 찾을 수 없습니다.');
    process.exit(1);
  }

  // visibility를 요청값으로 설정
  markdown = setVisibility(markdown, visibility);

  const targetPath = `content/blog/${slug}.md`;
  const isPrivatePreview = visibility === 'private';
  console.log(`${isPrivatePreview ? '👀 미리보기 준비' : '🚀 발행 시작'}: ${targetPath} (visibility: ${visibility})`);
  if (DRY_RUN) console.log('   [DRY RUN — 실제 커밋 없음]');

  if (DRY_RUN) {
    console.log('\n=== 발행될 frontmatter ===');
    const fmBlock = markdown.match(/^---\n[\s\S]*?\n---/)?.[0] || '';
    console.log(fmBlock);
    console.log('\n✅ DRY RUN 완료');
    return;
  }

  // 재시도 로직
  let lastErr;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      console.log(`   GitHub API 호출 중... (시도 ${attempt}/3)`);
      const sha = await getFileSha(targetPath);
      const commitMsg = isPrivatePreview
        ? (sha ? `draft: update private preview post ${slug}` : `draft: add private preview post ${slug}`)
        : (sha ? `update: post ${slug}` : `feat: add post ${slug}`);

      await commitFile(targetPath, markdown, commitMsg, sha);
      console.log(`   ✅ 커밋 성공: ${commitMsg}`);

      if (!isPrivatePreview) {
        // topics-queue.json 업데이트
        await markTopicDone(slug);
      }

      const vercelUrl = `https://epickor.com/blog/${slug}`;
      if (!isPrivatePreview) {
        updateHandoff(slug, vercelUrl);
      }

      if (isPrivatePreview) {
        console.log(`\n✅ 미리보기용 private 포스트 준비 완료!`);
        console.log(`   Preview route: https://epickor.com/preview/${slug}?token=[PREVIEW_SECRET_TOKEN]`);
      } else {
        console.log(`\n🎉 발행 완료!`);
        console.log(`   URL: ${vercelUrl}`);
        console.log(`   (Vercel 배포 완료까지 1~2분 소요)`);
      }
      return;
    } catch (err) {
      lastErr = err;
      if (attempt < 3) {
        console.log(`   ⚠️  실패 (${err.message.slice(0, 80)}). 재시도 중...`);
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  console.error(`❌ 3회 시도 후 실패: ${lastErr.message}`);
  console.error('   HANDOFF.md의 에스컬레이션 섹션에 기록하세요.');
  process.exit(1);
}

main().catch(err => {
  console.error('❌ 오류:', err.message);
  process.exit(1);
});
