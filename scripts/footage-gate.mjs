#!/usr/bin/env node
/**
 * Footage gate - survey vertical-usable video for a Reels topic BEFORE writing strategy.
 *
 * CLAUDE.md requires footage to be verified before a Reels topic is committed (Reel 311
 * died after a full strategy/storyboard was written, because zero usable vertical
 * tteokbokki clips existed). The existing scripts/fetch-pexels-videos.mjs hardcodes
 * orientation=portrait, which threw away most of the pool.
 *
 * 2026-08-03, representative's call: a landscape clip cropped to 9:16 is legitimate
 * footage, not a still-image zoom, and a slow pan of the crop window is a camera move
 * rather than fabricated motion. So landscape is in - but only where the crop survives.
 *
 *   3840x2160 -> centre crop 1215x2160 -> 1080x1920            no upscale at all
 *   1920x1080 -> centre crop  607x1080 -> 1080x1920            1.78x upscale
 *   1280x720  -> centre crop  405x720  -> 1080x1920            2.67x upscale, rejected
 *
 * The counts Pexels reports are worthless on their own - "korean street food" claims
 * 8,000 results and returns Thai and Chinese stalls. So this script's real output is a
 * contact sheet where every frame carries a 9:16 crop guide, and the decision is made
 * by looking at it. Nothing here approves a clip.
 *
 * Usage:
 *   node scripts/footage-gate.mjs --topic ramyeon --query "korean ramyeon" --query "instant noodles cooking"
 *   node scripts/footage-gate.mjs --topic seoul-night --query "seoul at night" --pages 2
 *
 * Writes to output/footage/{topic}/ : contact.html, candidates.json
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

function loadEnv() {
  const file = path.join(ROOT, '.env.local');
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const index = trimmed.indexOf('=');
    if (index < 1) continue;
    const key = trimmed.slice(0, index).trim();
    if (!process.env[key]) process.env[key] = trimmed.slice(index + 1).trim();
  }
}

function parseArgs() {
  const out = {query: []};
  for (let i = 2; i < process.argv.length; i += 1) {
    const key = process.argv[i];
    if (!key.startsWith('--')) continue;
    const value = process.argv[i + 1];
    if (key === '--query') out.query.push(value);
    else out[key.slice(2)] = value;
    i += 1;
  }
  return out;
}

loadEnv();
const input = parseArgs();
const topic = input.topic;
const queries = input.query;
const pages = Math.max(1, Math.min(Number(input.pages || 1), 3));

if (!topic || !/^[a-zA-Z0-9_-]+$/.test(topic) || queries.length === 0) {
  console.error('Usage: node scripts/footage-gate.mjs --topic ramyeon --query "korean ramyeon" [--query "..."] [--pages 2]');
  process.exit(2);
}
if (!process.env.PEXELS_API_KEY) throw new Error('PEXELS_API_KEY is missing from .env.local');

const HEADERS = {
  Authorization: process.env.PEXELS_API_KEY,
  'User-Agent': 'EpicKor/1.0 (https://epickor.com)',
};

const TARGET_W = 1080;
const TARGET_H = 1920;

/**
 * How a clip would reach 1080x1920, and what that costs in resolution.
 * `scale` below 1 means we are throwing pixels away (free); above 1 means upscaling.
 */
function classify(video) {
  const {width: w, height: h} = video;
  if (h > w) {
    const scale = TARGET_W / w;
    if (w >= 1080) return {verdict: 'native', crop: `${w}x${h}`, scale, note: 'already vertical'};
    if (w >= 720) return {verdict: 'upscale', crop: `${w}x${h}`, scale, note: 'vertical but under 1080 wide'};
    return {verdict: 'reject', crop: `${w}x${h}`, scale, note: 'too small'};
  }
  const cropW = Math.round((h * 9) / 16);
  const scale = TARGET_W / cropW;
  if (cropW >= 1080) return {verdict: 'native', crop: `${cropW}x${h}`, scale, note: '4K+ landscape, crop is free'};
  if (cropW >= 600) return {verdict: 'upscale', crop: `${cropW}x${h}`, scale, note: 'FHD landscape, crop then upscale'};
  return {verdict: 'reject', crop: `${cropW}x${h}`, scale, note: 'crop would be under 600px wide'};
}

/* Pexels ignores the "korean" half of a query constantly: "korean market food stall" returns a
   Metro Manila rice stall, "tteokbokki" returns Italian pasta, "korean ramyeon" returns Indomie.
   The Pexels slug is the only description we get, and it is usually honest about the country even
   when the search was not - the Manila clip says "metro manila" right in it. So the slug is worth
   reading before any frame is. Foreign hits are dropped and counted, never silently cut. */
const FOREIGN = /\b(manila|philippin|filipino|bangkok|thai|thailand|vietnam|hanoi|saigon|japan|tokyo|osaka|kyoto|china|chinese|beijing|shanghai|taiwan|taipei|hong kong|indonesia|jakarta|bali|malaysia|singapore|india|indian|mumbai|delhi|nepal|turkey|istanbul|mexic|italy|italian|spain|paris|london|new york)\w*/i;
const KOREA = /\b(korea|korean|seoul|busan|jeju|incheon|daegu|gwangju|hanbok|hangul|gyeongbok|bukchon|myeongdong|gangnam|hongdae|kimchi|bibimbap|tteokbokki|soju|makgeolli|jjigae|bulgogi|samgyeopsal)\w*/i;

async function search(query, orientation, page) {
  const params = new URLSearchParams({query, orientation, per_page: '80', page: String(page)});
  const url = `https://api.pexels.com/videos/search?${params}`;
  /* Retry transient 5xx. Without this a single 504 on the third of five queries
     throws away every candidate the first two collected, and the whole survey has
     to be re-run from scratch - which happened on 2026-09-04. Client errors (a bad
     key, a malformed query) are not retried, because repeating them cannot help. */
  let lastStatus = 0;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const res = await fetch(url, {headers: HEADERS});
    if (res.ok) {
      const body = await res.json();
      return body.videos || [];
    }
    lastStatus = res.status;
    if (res.status < 500 && res.status !== 429) break;
    await new Promise(r => setTimeout(r, attempt * 2500));
  }
  throw new Error(`Pexels ${lastStatus} for "${query}" (${orientation} p${page})`);
}

/** Clip ids already used by a published Reel, so the sheet never offers them again. */
function usedClipIds() {
  const used = new Set();
  const dir = path.join(ROOT, 'output', 'reels');
  if (!fs.existsSync(dir)) return used;
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, {withFileTypes: true})) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(md|json)$/.test(entry.name)) {
        const text = fs.readFileSync(full, 'utf8');
        for (const m of text.matchAll(/pexels\.com\/video\/[a-z0-9-]*?(\d{5,})/gi)) used.add(m[1]);
        for (const m of text.matchAll(/video-files\/(\d{5,})/g)) used.add(m[1]);
      }
      // Cut plans record the clip as a bare numeric `src`, never as a URL, so the
      // two URL patterns above missed every clip this batch actually spent. The
      // gate would have gone on offering them as fresh in later runs — the exact
      // repetition problem the 2026-08-11 review raised, one batch downstream.
      if (/^cut-plan.*\.json$/.test(entry.name)) {
        for (const cut of JSON.parse(fs.readFileSync(full, 'utf8'))) {
          if (cut.kind === 'video' && /^\d{5,}$/.test(String(cut.src))) used.add(String(cut.src));
        }
      }
    }
  };
  walk(dir);
  return used;
}

const used = usedClipIds();
const seen = new Map();
const dropped = {foreign: [], resolution: 0};

for (const query of queries) {
  for (const orientation of ['portrait', 'landscape']) {
    for (let page = 1; page <= pages; page += 1) {
      const videos = await search(query, orientation, page);
      for (const video of videos) {
        if (seen.has(video.id)) {
          seen.get(video.id).queries.add(query);
          continue;
        }
        const verdict = classify(video);
        if (verdict.verdict === 'reject') {
          dropped.resolution += 1;
          continue;
        }
        // The Pexels slug is the only text description we get; tags[] is always empty.
        const slug = (video.url.match(/\/video\/([a-z0-9-]+)-\d+\/?$/) || [, ''])[1].replace(/-/g, ' ');
        const foreign = slug.match(FOREIGN);
        if (foreign) {
          dropped.foreign.push(`${video.id} (${foreign[0]}) ${slug}`);
          continue;
        }
        const files = (video.video_files || []).filter((f) => f.file_type === 'video/mp4');
        const best = files.sort((a, b) => b.width * b.height - a.width * a.height)[0];
        seen.set(video.id, {
          id: video.id,
          url: video.url,
          slug,
          korea: KOREA.test(slug),
          width: video.width,
          height: video.height,
          duration: video.duration,
          fps: best ? best.fps : null,
          author: video.user?.name || '',
          frames: (video.video_pictures || []).map((p) => p.picture),
          alreadyUsed: used.has(String(video.id)),
          queries: new Set([query]),
          ...verdict,
        });
      }
      await new Promise((r) => setTimeout(r, 400));
    }
  }
}

const candidates = [...seen.values()]
  .map((c) => ({...c, queries: [...c.queries]}))
  .sort((a, b) => {
    // Country relevance outranks pixels. A 4K clip of the wrong country is worth nothing,
    // and sorting by resolution alone put a Manila rice stall at the top of the first run.
    if (a.korea !== b.korea) return a.korea ? -1 : 1;
    if (a.alreadyUsed !== b.alreadyUsed) return a.alreadyUsed ? 1 : -1;
    const rank = (v) => (v.verdict === 'native' ? 0 : 1);
    if (rank(a) !== rank(b)) return rank(a) - rank(b);
    return a.scale - b.scale;
  });

const outDir = path.join(ROOT, 'output', 'footage', topic);
fs.mkdirSync(outDir, {recursive: true});
fs.writeFileSync(path.join(outDir, 'candidates.json'), JSON.stringify({topic, queries, candidates}, null, 2));

/* Contact sheet. Three frames per clip, each with the 9:16 centre crop drawn on top and
   the discarded sides dimmed, plus faint left/right guides showing where a pan could
   travel. The judgement being made is "does the subject survive the crop", which no
   count or keyword can answer. */
const FRAME_W = 300;
function cropOverlay(c) {
  if (c.height > c.width) return '';
  const pct = ((c.height * 9) / 16 / c.width) * 100;
  const side = (100 - pct) / 2;
  return `<span class="guide" style="--pct:${pct.toFixed(2)}%;--side:${side.toFixed(2)}%"></span>`;
}

const cards = candidates
  .map((c, i) => {
    const picks = [c.frames[1], c.frames[Math.floor(c.frames.length / 2)], c.frames[c.frames.length - 2]].filter(Boolean);
    const frames = picks
      .map((src) => `<div class="fr"><img src="${src}" loading="lazy" width="${FRAME_W}">${cropOverlay(c)}</div>`)
      .join('');
    const fpsFlag = c.fps && ![24, 25, 30, 50, 60].includes(Math.round(c.fps)) ? ' odd-fps' : '';
    return `<article class="card ${c.verdict}${c.alreadyUsed ? ' used' : ''}${c.korea ? ' kr' : ''}">
  <header>
    <b>#${i + 1}</b>
    ${c.korea ? '<span class="kr-tag">KR</span>' : '<span class="dim">unnamed country</span>'}
    <span class="v">${c.verdict === 'native' ? 'NATIVE' : `UPSCALE ${c.scale.toFixed(2)}x`}</span>
    <span class="dim">${c.width}x${c.height} - crop ${c.crop} - ${c.duration}s - ${c.fps || '?'}fps${fpsFlag}</span>
    ${c.alreadyUsed ? '<span class="used-tag">ALREADY USED</span>' : ''}
  </header>
  <div class="frames">${frames}</div>
  <footer><a href="${c.url}" target="_blank">${c.id}</a> - ${c.slug} - <i>${c.author}</i> - <span class="dim">${c.queries.join(' / ')}</span></footer>
</article>`;
  })
  .join('\n');

const nativeCount = candidates.filter((c) => c.verdict === 'native').length;
const krCount = candidates.filter((c) => c.korea).length;
const html = `<!doctype html><meta charset="utf-8"><title>Footage gate: ${topic}</title>
<style>
  body{background:#14161a;color:#e8e6e1;font:13px/1.5 ui-sans-serif,system-ui;margin:0;padding:20px}
  h1{font-size:19px;margin:0 0 4px}
  .sum{color:#9aa0a6;margin-bottom:18px}
  .card{border:1px solid #2b2f36;border-radius:8px;padding:10px;margin-bottom:12px;background:#1b1e23}
  .card.native{border-color:#2f6b46}
  .card.used{opacity:.45}
  header{display:flex;gap:10px;align-items:baseline;margin-bottom:8px;flex-wrap:wrap}
  .v{font-weight:700;color:#8fd6a8}
  .upscale .v{color:#e0b35c}
  .dim{color:#8b9097}
  .odd-fps{color:#e07b6a}
  .used-tag{background:#5a2a2a;padding:1px 6px;border-radius:3px;font-size:11px}
  .kr-tag{background:#1e4a72;color:#cfe4fb;padding:1px 6px;border-radius:3px;font-size:11px;font-weight:700}
  .card.kr{border-color:#3a5f86}
  .frames{display:flex;gap:8px;overflow-x:auto}
  .fr{position:relative;flex:0 0 auto;line-height:0}
  .fr img{display:block;border-radius:3px}
  /* dim what the 9:16 crop throws away; dashed rails show how far a pan could travel */
  .guide{position:absolute;inset:0;pointer-events:none;
    background:linear-gradient(90deg,
      rgba(10,12,15,.72) 0, rgba(10,12,15,.72) var(--side),
      transparent var(--side), transparent calc(var(--side) + var(--pct)),
      rgba(10,12,15,.72) calc(var(--side) + var(--pct)), rgba(10,12,15,.72) 100%);
    border-left:1px dashed rgba(255,255,255,.28);border-right:1px dashed rgba(255,255,255,.28);
    box-sizing:border-box}
  footer{margin-top:7px;color:#9aa0a6}
  a{color:#7fb4ff}
</style>
<h1>Footage gate - ${topic}</h1>
<p class="sum">${candidates.length} candidates from ${queries.length} queries
  - <b>${krCount}</b> name Korea in the slug, <b>${nativeCount}</b> need no upscale.
  Dropped: ${dropped.foreign.length} named another country, ${dropped.resolution} too small.<br>
  Bright band = what survives the 9:16 crop. Judge the band, not the frame.
  "unnamed country" means the slug is silent, not that it is Korean - those still have to be looked at.</p>
${cards}
`;
fs.writeFileSync(path.join(outDir, 'contact.html'), html);

console.log(`topic:      ${topic}`);
console.log(`queries:    ${queries.join(' | ')}`);
console.log(`candidates: ${candidates.length} (Korea-named ${krCount}, native ${nativeCount}, upscale ${candidates.length - nativeCount}, already used ${candidates.filter((c) => c.alreadyUsed).length})`);
console.log(`dropped:    ${dropped.foreign.length} named another country, ${dropped.resolution} too small`);
for (const line of dropped.foreign.slice(0, 3)) console.log(`            e.g. ${line}`);
console.log(`sheet:      ${path.relative(ROOT, path.join(outDir, 'contact.html'))}`);
console.log('\nNothing is approved until the sheet is looked at.');
