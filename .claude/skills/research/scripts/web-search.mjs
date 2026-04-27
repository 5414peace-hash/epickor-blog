#!/usr/bin/env node
/**
 * Keyless web research wrapper - EpicKor Research Team
 *
 * Uses DuckDuckGo without an API key. It returns compact source summaries and
 * fact candidates for Claude/Codex to verify and use while writing.
 *
 * 실행:
 *   node .claude/skills/research/scripts/web-search.mjs --query "Korean age system"
 *   node .claude/skills/research/scripts/web-search.mjs --topic "Korean age system" --count 5
 */

const { fileURLToPath } = await import('url');

const __filename = fileURLToPath(import.meta.url);

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const queryIdx = args.indexOf('--query');
const topicIdx = args.indexOf('--topic');
const keywordsIdx = args.indexOf('--keywords');
const countIdx = args.indexOf('--count');

const query = queryIdx !== -1
  ? args[queryIdx + 1]
  : topicIdx !== -1
    ? args[topicIdx + 1]
    : null;
const keywords = keywordsIdx !== -1
  ? args[keywordsIdx + 1].split(',').map(k => k.trim()).filter(Boolean)
  : [];
const count = countIdx !== -1 ? parseInt(args[countIdx + 1], 10) || 5 : 5;

function stripHtml(value = '') {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeDuckUrl(rawUrl = '') {
  try {
    const url = new URL(rawUrl.startsWith('//') ? `https:${rawUrl}` : rawUrl);
    const redirected = url.searchParams.get('uddg');
    return redirected ? decodeURIComponent(redirected) : rawUrl;
  } catch {
    return rawUrl;
  }
}

function extractResultBlocks(html) {
  const blocks = html.match(/<div class="result[\s\S]*?(?=<div class="result|<\/body>)/g) || [];
  return blocks;
}

function parseDuckHtml(html, sourceCount) {
  const sources = [];

  for (const block of extractResultBlocks(html)) {
    const linkMatch = block.match(/<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/);
    if (!linkMatch) continue;

    const snippetMatch = block.match(/<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/)
      || block.match(/<div[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/div>/);

    const url = decodeDuckUrl(linkMatch[1]);
    if (!/^https?:\/\//.test(url)) continue;

    const title = stripHtml(linkMatch[2]);
    const summary = stripHtml(snippetMatch?.[1] || '');
    if (!title || sources.some(s => s.url === url)) continue;

    sources.push({ title, url, summary });
    if (sources.length >= sourceCount) break;
  }

  return sources;
}

function pickMetaDescription(html) {
  const patterns = [
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i,
    /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["'][^>]*>/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["'][^>]*>/i,
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return stripHtml(match[1]);
  }

  const paragraph = html.match(/<p[^>]*>([\s\S]{80,600}?)<\/p>/i);
  return paragraph?.[1] ? stripHtml(paragraph[1]).slice(0, 280) : '';
}

async function enrichSource(source) {
  if (source.summary) return source;

  try {
    const res = await fetch(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 EpicKorResearch/1.0',
        Accept: 'text/html',
      },
    });
    if (!res.ok) return source;

    const html = await res.text();
    const summary = pickMetaDescription(html);
    return summary ? { ...source, summary } : source;
  } catch {
    return source;
  }
}

async function duckduckgoHtmlSearch(searchQuery, sourceCount = 5) {
  const params = new URLSearchParams({ q: searchQuery });
  const res = await fetch(`https://duckduckgo.com/html/?${params}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 EpicKorResearch/1.0',
      Accept: 'text/html',
    },
  });

  if (!res.ok) {
    throw new Error(`DuckDuckGo HTML search failed: ${res.status} ${res.statusText}`);
  }

  return parseDuckHtml(await res.text(), sourceCount);
}

/**
 * DuckDuckGo Instant Answer API - useful fallback, keyless.
 */
export async function duckduckgoSearch(searchQuery) {
  const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&format=json&no_html=1&skip_disambig=1`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.AbstractText) {
      return {
        title: data.Heading || searchQuery,
        url: data.AbstractURL || '',
        summary: data.AbstractText,
      };
    }
    return null;
  } catch {
    return null;
  }
}

function buildFactCandidates(sources, topic) {
  const facts = [];
  for (const source of sources) {
    if (!source.summary || source.summary.length < 45) continue;
    if (/if you$/i.test(source.summary.trim())) continue;
    facts.push(`${source.summary} (Source: ${source.title})`);
  }

  if (facts.length === 0) {
    facts.push(`Research topic needs manual verification while drafting: ${topic}`);
  }

  return facts.slice(0, 8);
}

function buildAmazonKeywords(topic, sourceKeywords = []) {
  const text = `${topic} ${sourceKeywords.join(' ')}`.toLowerCase();
  const keywords = [];

  if (/food|snack|bbq|kimchi|tteokbokki|street food|drink|soju|makgeolli/.test(text)) {
    keywords.push('Korean snack', 'Korean cookbook');
  }
  if (/beauty|skin|skincare|k-beauty|spa|jjimjilbang/.test(text)) {
    keywords.push('Korean skincare', 'K-beauty');
  }
  if (/travel|seoul|busan|jeju|dmz|subway|hiking/.test(text)) {
    keywords.push('Korea travel guide');
  }
  if (/language|hangul|culture|age|tradition|superstition|webtoon/.test(text)) {
    keywords.push('Korean culture book');
  }

  return [...new Set(keywords)].slice(0, 4);
}

/**
 * Keyless web search used by scripts/run-pipeline.mjs.
 *
 * @param {string} topic 검색 주제
 * @param {number} sourceCount 수집할 소스 수
 * @returns {Promise<{sources: Array, facts: Array, amazon_keywords: Array}>}
 */
export async function webSearch(topic, sourceCount = 5) {
  const searchQuery = `${topic} Korea explanation facts`;
  let sources = [];

  try {
    sources = await duckduckgoHtmlSearch(searchQuery, sourceCount);
  } catch (err) {
    console.warn(`  ⚠️  DuckDuckGo HTML 검색 실패: ${err.message}`);
  }

  if (sources.length < 2) {
    const instant = await duckduckgoSearch(searchQuery);
    if (instant && !sources.some(s => s.url === instant.url)) {
      sources.unshift(instant);
    }
  }

  sources = await Promise.all(sources.map(enrichSource));
  sources = sources.filter(source => source.url && source.title);

  return {
    sources: sources.slice(0, sourceCount),
    facts: buildFactCandidates(sources, topic),
    amazon_keywords: buildAmazonKeywords(topic, keywords),
  };
}

if (process.argv[1] === __filename) {
  if (!query) {
    console.error('❌ --query 또는 --topic 옵션이 필요합니다. 예: --query "Korean age system"');
    process.exit(1);
  }

  console.log(`🔍 키 없는 웹 검색: "${query}" (소스 ${count}개)${DRY_RUN ? ' [DRY RUN]' : ''}`);
  try {
    const result = await webSearch(query, count);
    console.log('\n=== 검색 결과 ===');
    console.log(JSON.stringify(result, null, 2));
    console.log(`\n✅ 소스 ${result.sources?.length || 0}건, 팩트 후보 ${result.facts?.length || 0}건`);
  } catch (err) {
    console.error('❌ 검색 오류:', err.message);
    process.exit(1);
  }
}
