#!/usr/bin/env node
/**
 * EpicKor Strategy Agent - GSC CSV weekly analysis
 *
 * Usage:
 *   node .claude/skills/strategy/scripts/analyze-week.mjs --mode csv --input output/gsc
 *   node .claude/skills/strategy/scripts/analyze-week.mjs --mode csv --input output/gsc --update-queue
 *
 * The script reads Google Search Console CSV exports, writes a weekly strategy
 * report, and optionally tops up topics-queue.json only when pending topics are
 * below the configured minimum.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '../../../../');

const args = process.argv.slice(2);
const mode = valueAfter('--mode') || 'csv';
const inputArg = valueAfter('--input') || 'output/gsc';
const updateQueue = args.includes('--update-queue');
const minPending = Number(valueAfter('--min-pending') || 10);

if (mode !== 'csv') {
  console.error('Only --mode csv is currently implemented. Use GSC export CSV files.');
  process.exit(1);
}

function valueAfter(flag) {
  const idx = args.indexOf(flag);
  return idx === -1 ? null : args[idx + 1];
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  const clean = text.replace(/^\uFEFF/, '');

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    const next = clean[i + 1];
    if (ch === '"' && inQuotes && next === '"') {
      cell += '"';
      i++;
    } else if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (ch === '\r' && next === '\n') i++;
      row.push(cell);
      if (row.some(v => v.trim() !== '')) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += ch;
    }
  }

  row.push(cell);
  if (row.some(v => v.trim() !== '')) rows.push(row);
  if (rows.length === 0) return [];

  const headers = rows[0].map(h => h.trim());
  return rows.slice(1).map(values => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = (values[i] || '').trim();
    });
    return obj;
  });
}

function numberValue(value) {
  return Number(String(value || '').replace(/[%,$,\s]/g, '')) || 0;
}

function percentValue(value) {
  return numberValue(value);
}

function findLatestGscDir(inputPath) {
  const abs = resolve(ROOT, inputPath);
  if (!existsSync(abs)) {
    throw new Error(`GSC input directory not found: ${abs}`);
  }

  const candidates = [];
  if (existsSync(join(abs, '페이지.csv'))) candidates.push(abs);

  for (const item of readdirSync(abs, { withFileTypes: true })) {
    if (!item.isDirectory()) continue;
    const dir = join(abs, item.name);
    if (existsSync(join(dir, '페이지.csv'))) candidates.push(dir);
  }

  if (candidates.length === 0) {
    throw new Error(`No GSC export folder containing 페이지.csv found under ${abs}`);
  }

  return candidates
    .map(dir => ({ dir, mtime: statSync(dir).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)[0].dir;
}

function loadCsv(dir, fileName) {
  const path = join(dir, fileName);
  if (!existsSync(path)) return [];
  return parseCsv(readFileSync(path, 'utf8'));
}

function normalizePage(row) {
  return {
    page: row['인기 페이지'] || row['Page'] || '',
    clicks: numberValue(row['클릭수'] || row['Clicks']),
    impressions: numberValue(row['노출'] || row['Impressions']),
    ctr: percentValue(row['CTR']),
    position: numberValue(row['게재 순위'] || row['Position']),
  };
}

function normalizeQuery(row) {
  return {
    query: row['인기 검색어'] || row['Query'] || '',
    clicks: numberValue(row['클릭수'] || row['Clicks']),
    impressions: numberValue(row['노출'] || row['Impressions']),
    ctr: percentValue(row['CTR']),
    position: numberValue(row['게재 순위'] || row['Position']),
  };
}

function slugFromUrl(url) {
  const match = String(url).match(/\/blog\/([^/?#]+)/);
  return match ? match[1] : '';
}

function isoWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  return { year: d.getUTCFullYear(), week: String(weekNo).padStart(2, '0') };
}

function topicIdeasFromQueries(queries) {
  const text = queries.map(q => q.query.toLowerCase()).join('\n');
  const ideas = [];

  const push = (title, category, keywords, amazon = 'none') => {
    if (!ideas.some(i => i.title === title)) {
      ideas.push({ title, category, keywords, amazon_hint: amazon });
    }
  };

  if (/ssamjang/.test(text)) {
    push('What Is Ssamjang? Korea\'s Essential BBQ Sauce Explained', 'food', ['ssamjang', 'what is ssamjang', 'Korean BBQ sauce'], 'Food');
  }
  if (/kimchi/.test(text)) {
    push('Kimchi Culture Explained: Why Korea Treats Fermentation Like Identity', 'food', ['kimchi culture', 'kimchi Korea', 'Korean fermentation'], 'Food');
  }
  if (/sky universit/.test(text)) {
    push('Korean University Rankings Explained Beyond SKY', 'society', ['Korean university rankings', 'SKY universities', 'top universities in Korea'], 'none');
  }
  if (/ahjussi|samchon|oppa/.test(text)) {
    push('Oppa, Samchon, Ahjussi: Korean Male Terms Without the Awkwardness', 'language', ['oppa vs ahjussi', 'samchon meaning', 'Korean male terms'], 'none');
  }
  if (/pali|ppalli/.test(text)) {
    push('Korean Speed Culture in Daily Life: Ppalli Ppalli Beyond the Stereotype', 'culture', ['pali pali culture', 'ppalli ppalli', 'Korean speed culture'], 'none');
  }
  if (/isaac toast/.test(text)) {
    push('Korean Toast Culture: Why Sweet Breakfast Sandwiches Work So Well', 'food', ['Korean toast', 'Isaac Toast sauce', 'Korean breakfast sandwich'], 'Food');
  }
  if (/manjoo|deli manjoo/.test(text)) {
    push('Korean Subway Snacks Guide: Deli Manjoo, Fish Bread, and More', 'food', ['Deli Manjoo', 'Korean subway snacks', 'Korean custard snack'], 'Food');
  }
  if (/subway/.test(text)) {
    push('Seoul Subway Etiquette: The Quiet Rules Tourists Miss', 'travel', ['Seoul subway etiquette', 'Korea subway rules', 'Korea travel tips'], 'Travel');
  }

  const fallback = [
    ['Korean Convenience Store Breakfast: What Locals Actually Buy', 'food', ['Korean convenience store breakfast', 'GS25 breakfast', 'CU Korea food'], 'Food'],
    ['Why Korean Cafes Feel Different: Space, Design, and Daily Escape', 'culture', ['Korean cafe culture', 'Seoul cafes', 'Korea lifestyle'], 'none'],
    ['Korean Delivery Apps Explained: Baemin, Coupang Eats, and the No-Wait Life', 'culture', ['Korean delivery apps', 'Baemin Korea', 'Coupang Eats'], 'Food'],
    ['Korean Sauna Etiquette: Jjimjilbang Rules for First-Time Visitors', 'travel', ['Korean sauna etiquette', 'jjimjilbang rules', 'Korean spa guide'], 'Beauty'],
  ];

  for (const [title, category, keywords, amazon] of fallback) {
    push(title, category, keywords, amazon);
  }

  return ideas.slice(0, 10);
}

function loadTopicsQueue() {
  const path = join(ROOT, 'content/data/topics-queue.json');
  if (!existsSync(path)) return { path, data: { topics: [] } };
  return { path, data: JSON.parse(readFileSync(path, 'utf8')) };
}

function maybeUpdateQueue(ideas, pendingCount) {
  const { path, data } = loadTopicsQueue();
  const topics = Array.isArray(data.topics) ? data.topics : [];
  if (!updateQueue || pendingCount >= minPending) {
    return { updated: false, added: [], pendingCount };
  }

  const existingTitles = new Set(topics.map(t => String(t.title || '').toLowerCase()));
  const maxId = topics.reduce((max, t) => Math.max(max, Number(t.id) || 0), 0);
  const toAdd = ideas
    .filter(idea => !existingTitles.has(idea.title.toLowerCase()))
    .slice(0, minPending - pendingCount)
    .map((idea, idx) => ({
      id: maxId + idx + 1,
      title: idea.title,
      keywords: idea.keywords,
      category: idea.category,
      tags: idea.keywords.map(k => k.replace(/\s+/g, '')).slice(0, 5),
      amazon_category: idea.amazon_hint === 'none' ? 'None' : idea.amazon_hint,
      status: 'pending',
      created_at: new Date().toISOString().slice(0, 10),
    }));

  if (toAdd.length > 0) {
    data.topics = topics.concat(toAdd);
    data.last_updated = new Date().toISOString().slice(0, 10);
    writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }

  return { updated: toAdd.length > 0, added: toAdd, pendingCount: pendingCount + toAdd.length };
}

function markdownTable(rows, headers) {
  const out = [];
  out.push(`| ${headers.join(' | ')} |`);
  out.push(`| ${headers.map(() => '---').join(' | ')} |`);
  for (const row of rows) {
    out.push(`| ${headers.map(h => String(row[h] ?? '').replace(/\|/g, '\\|')).join(' | ')} |`);
  }
  return out.join('\n');
}

function main() {
  const gscDir = findLatestGscDir(inputArg);
  const pages = loadCsv(gscDir, '페이지.csv').map(normalizePage).filter(r => r.page);
  const queries = loadCsv(gscDir, '검색어 수.csv').map(normalizeQuery).filter(r => r.query);
  const pageRows = pages
    .filter(p => /\/blog\//.test(p.page))
    .sort((a, b) => b.impressions - a.impressions);
  const queryRows = queries.sort((a, b) => b.impressions - a.impressions);

  const lowCtrPages = pageRows
    .filter(p => p.impressions >= 500 && p.ctr < 1)
    .slice(0, 15);
  const quickWins = pageRows
    .filter(p => p.position <= 8 && p.impressions >= 200 && p.ctr < 1.5)
    .slice(0, 15);
  const topicIdeas = topicIdeasFromQueries(queryRows);

  const { data: topicData } = loadTopicsQueue();
  const pendingCount = (topicData.topics || []).filter(t => t.status === 'pending').length;
  const queueResult = maybeUpdateQueue(topicIdeas, pendingCount);

  // The Korean GSC "검색 노출.csv" export is a search-appearance breakdown,
  // not a sitewide summary. Use page rows for stable totals.
  const totalClicks = pages.reduce((sum, p) => sum + p.clicks, 0);
  const totalImpressions = pages.reduce((sum, p) => sum + p.impressions, 0);
  const avgCtr = totalImpressions ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00';

  const { year, week } = isoWeek(new Date());
  const outDir = join(ROOT, 'output/strategy');
  mkdirSync(outDir, { recursive: true });
  const reportPath = join(outDir, `week_${year}W${week}.md`);

  const topPages = pageRows.slice(0, 10).map(p => ({
    Page: p.page.replace('https://www.epickor.com', ''),
    Clicks: p.clicks,
    Impressions: p.impressions,
    CTR: `${p.ctr}%`,
    Position: p.position,
  }));

  const lowCtrTable = lowCtrPages.map(p => ({
    Page: p.page.replace('https://www.epickor.com', ''),
    Impressions: p.impressions,
    CTR: `${p.ctr}%`,
    Position: p.position,
    Action: 'Title/meta refresh or answer search intent better',
  }));

  const queryTable = queryRows.slice(0, 20).map(q => ({
    Query: q.query,
    Clicks: q.clicks,
    Impressions: q.impressions,
    CTR: `${q.ctr}%`,
    Position: q.position,
  }));

  const ideaLines = topicIdeas.map((idea, idx) =>
    `${idx + 1}. **${idea.title}** (${idea.category}) - keywords: ${idea.keywords.join(', ')}`
  );

  const report = `# EpicKor Weekly Strategy Report - ${year} W${week}

## Input

- GSC folder: \`${gscDir.replace(ROOT, '').replace(/^[\\/]/, '')}\`
- Mode: CSV
- Queue update: ${updateQueue ? 'enabled' : 'disabled'}

## Performance Summary

- Total clicks: ${totalClicks}
- Total impressions: ${totalImpressions}
- Average CTR: ${avgCtr}%
- Blog pages found: ${pageRows.length}
- Queries found: ${queryRows.length}
- Pending topics: ${queueResult.pendingCount}

## Top Blog Pages

${markdownTable(topPages, ['Page', 'Clicks', 'Impressions', 'CTR', 'Position'])}

## Low CTR / High Impression Opportunities

${markdownTable(lowCtrTable, ['Page', 'Impressions', 'CTR', 'Position', 'Action'])}

## Quick-Win Pages

${quickWins.map((p, idx) => `${idx + 1}. ${p.page.replace('https://www.epickor.com', '')} - ${p.impressions} impressions, ${p.ctr}% CTR, position ${p.position}`).join('\n')}

## Top Queries

${markdownTable(queryTable, ['Query', 'Clicks', 'Impressions', 'CTR', 'Position'])}

## Recommended New Topics

${ideaLines.join('\n')}

## Queue Status

- Pending count before update: ${pendingCount}
- Minimum pending target: ${minPending}
- Added to queue: ${queueResult.added.length}
${queueResult.added.map(t => `  - ${t.id}: ${t.title}`).join('\n') || '- No queue update needed.'}

## Recommended Next Actions

1. Wait 3-7 days before judging CTR changes on today's rewritten posts.
2. Continue technical SEO cleanup: metadataBase is fixed when this script is run after the current patch.
3. Pick one monetizable post for Amazon link cleanup: \`/blog/160\` or \`/blog/153\`.
4. Create card news for one already-improved post, preferably \`/blog/160\` or \`/blog/071\`.
`;

  writeFileSync(reportPath, report, 'utf8');

  console.log(`Strategy report written: ${reportPath}`);
  console.log(`Total clicks/impressions/CTR: ${totalClicks}/${totalImpressions}/${avgCtr}%`);
  console.log(`Pending topics: ${queueResult.pendingCount}`);
  if (queueResult.added.length) {
    console.log(`Added ${queueResult.added.length} topics to topics-queue.json`);
  }
}

try {
  main();
} catch (err) {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
