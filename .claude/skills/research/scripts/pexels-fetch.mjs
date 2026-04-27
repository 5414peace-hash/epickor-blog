#!/usr/bin/env node
/**
 * Pexels API 이미지 검색 — EpicKor Research Team
 *
 * 실행: node .claude/skills/research/scripts/pexels-fetch.mjs --query "seoul korea" --count 3
 * 옵션: --query   검색 키워드 (영어)
 *       --count   반환할 이미지 수 (기본 3)
 *       --dry-run 실제 다운로드 없이 URL만 출력
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
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

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const queryIdx = args.indexOf('--query');
const query = queryIdx !== -1 ? args[queryIdx + 1] : null;
const countIdx = args.indexOf('--count');
const count = countIdx !== -1 ? parseInt(args[countIdx + 1]) || 3 : 3;

/**
 * Pexels에서 이미지를 검색하고 결과 배열 반환
 * @param {string} keyword 검색 키워드
 * @param {number} num 반환 수
 * @returns {Promise<Array<{url: string, alt: string, credit: string, width: number, height: number}>>}
 */
export async function fetchPexelsImages(keyword, num = 3) {
  if (!PEXELS_API_KEY) {
    console.warn('  ⚠️  PEXELS_API_KEY 없음. 이미지 소싱을 건너뜁니다.');
    return [];
  }
  const searchQuery = keyword.includes('Korea') || keyword.includes('korean')
    ? keyword
    : `${keyword} Korea`;

  const params = new URLSearchParams({
    query: searchQuery,
    per_page: String(Math.min(num * 3, 15)), // 여유분 확보 후 상위 선택
    orientation: 'landscape',
    size: 'large',
  });

  const res = await fetch(`https://api.pexels.com/v1/search?${params}`, {
    headers: { Authorization: PEXELS_API_KEY },
  });

  if (!res.ok) {
    throw new Error(`Pexels API 오류: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  if (!data.photos || data.photos.length === 0) {
    // Korea 키워드 없이 재시도
    const fallbackParams = new URLSearchParams({
      query: keyword,
      per_page: String(Math.min(num * 2, 10)),
      orientation: 'landscape',
      size: 'large',
    });
    const fallbackRes = await fetch(`https://api.pexels.com/v1/search?${fallbackParams}`, {
      headers: { Authorization: PEXELS_API_KEY },
    });
    const fallbackData = await fallbackRes.json();
    if (!fallbackData.photos || fallbackData.photos.length === 0) {
      return [];
    }
    return fallbackData.photos.slice(0, num).map(formatPhoto);
  }

  return data.photos.slice(0, num).map(formatPhoto);
}

function formatPhoto(photo) {
  const baseUrl = (photo.src.large2x || photo.src.large || '').replace(/\?.*$/, '');
  return {
    url: `${baseUrl}?auto=compress&cs=tinysrgb&w=1200`,
    alt: photo.alt || `Photo from Pexels`,
    credit: `Photo by ${photo.photographer} on Pexels`,
    width: photo.width,
    height: photo.height,
    pexels_id: photo.id,
  };
}

// CLI 직접 실행
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  if (!PEXELS_API_KEY) {
    console.error('❌ PEXELS_API_KEY 환경변수가 없습니다. .env.local에 추가하세요.');
    process.exit(1);
  }
  if (!query) {
    console.error('❌ --query 옵션이 필요합니다. 예: --query "korean food"');
    process.exit(1);
  }
  console.log(`🔍 Pexels 검색: "${query}" (${count}장)${DRY_RUN ? ' [DRY RUN]' : ''}`);
  try {
    const images = await fetchPexelsImages(query, count);
    if (images.length === 0) {
      console.log('⚠️  검색 결과가 없습니다.');
    } else {
      images.forEach((img, i) => {
        console.log(`\n[${i + 1}] ${img.credit}`);
        console.log(`    URL: ${img.url}`);
        console.log(`    Alt: ${img.alt}`);
      });
      console.log(`\n✅ ${images.length}장 반환됨`);
    }
  } catch (err) {
    console.error('❌ Pexels API 오류:', err.message);
    process.exit(1);
  }
}
