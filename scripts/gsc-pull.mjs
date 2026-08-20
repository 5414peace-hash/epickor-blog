#!/usr/bin/env node
// Zero-dependency GSC Search Analytics puller (raw fetch, OAuth refresh token).
// Why: gsc-fetch.mjs (googleapis) hung >120s on load in this environment
// (2026-08-20); the raw-fetch pattern from blog-news answers in seconds.
// Credentials: secrets/gsc_oauth_client.json + secrets/gsc_oauth_token.json
// (gitignored; readonly scope; the 5414 account owns https://www.epickor.com/).
//
// Usage:
//   node scripts/gsc-pull.mjs --dimensions date --start 2026-05-18 --end 2026-08-18
//   node scripts/gsc-pull.mjs --dimensions query,page --limit 25000
//   node scripts/gsc-pull.mjs --dimensions page --page-contains /business/
// Output: output/gsc/api/{dims}_{start}_{end}.csv (+ .json), or --stdout.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const SITE = process.env.GSC_SITE_URL || 'https://www.epickor.com/';
const args = process.argv.slice(2);
const getArg = (n, f = null) => { const i = args.indexOf(n); return i === -1 ? f : (args[i + 1] ?? f); };
const hasFlag = (n) => args.includes(n);
const fail = (m) => { console.error(`ERROR: ${m}`); process.exit(1); };

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const clientPath = path.join(ROOT, 'secrets/gsc_oauth_client.json');
const tokenPath = path.join(ROOT, 'secrets/gsc_oauth_token.json');
if (!fs.existsSync(clientPath) || !fs.existsSync(tokenPath)) fail(`credentials missing in ${path.join(ROOT, 'secrets')}`);
const cfgRaw = readJson(clientPath); const cfg = cfgRaw.installed || cfgRaw.web;
let token = readJson(tokenPath);

async function jfetch(url, opts) {
  const res = await fetch(url, opts);
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) fail(`HTTP ${res.status}: ${data?.error?.message || data?.error_description || text}`);
  return data;
}

async function accessToken() {
  if (token.access_token && token.expiry_date && Date.now() < Number(token.expiry_date)) return token.access_token;
  const data = await jfetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: cfg.client_id, client_secret: cfg.client_secret,
      refresh_token: token.refresh_token, grant_type: 'refresh_token',
    }),
  });
  token = { ...token, access_token: data.access_token, expiry_date: Date.now() + (data.expires_in || 3600) * 1000 - 60000 };
  fs.writeFileSync(tokenPath, JSON.stringify(token, null, 2) + '\n');
  return token.access_token;
}

const dims = (getArg('--dimensions', 'query')).split(',').map(s => s.trim());
const days = parseInt(getArg('--days', '90'), 10);
const today = Date.now();
const end = getArg('--end', new Date(today - 2 * 86400000).toISOString().slice(0, 10));
const start = getArg('--start', new Date(today - (days + 2) * 86400000).toISOString().slice(0, 10));
const limit = Number(getArg('--limit', '25000'));

const filters = [];
if (getArg('--contains')) filters.push({ dimension: 'query', operator: 'contains', expression: getArg('--contains') });
if (getArg('--page-contains')) filters.push({ dimension: 'page', operator: 'contains', expression: getArg('--page-contains') });

async function main() {
  const at = await accessToken();
  const rows = [];
  let startRow = 0;
  while (rows.length < 100000) {
    const body = { startDate: start, endDate: end, dimensions: dims, rowLimit: Math.min(limit, 25000), startRow, dataState: 'all' };
    if (filters.length) body.dimensionFilterGroups = [{ filters }];
    const data = await jfetch(
      `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(SITE)}/searchAnalytics/query`,
      { method: 'POST', headers: { Authorization: `Bearer ${at}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
    );
    const batch = data.rows || [];
    rows.push(...batch);
    process.stderr.write(`  rows ${startRow}+${batch.length}\n`);
    if (batch.length < Math.min(limit, 25000) || rows.length >= limit) break;
    startRow += batch.length;
  }
  const header = [...dims, 'clicks', 'impressions', 'ctr', 'position'];
  const esc = v => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v);
  const lines = [header.join(','), ...rows.map(r =>
    [...r.keys.map(esc), r.clicks, r.impressions, (r.ctr * 100).toFixed(4), r.position.toFixed(2)].join(','))];
  if (hasFlag('--stdout')) { console.log(lines.join('\n')); }
  else {
    const outDir = path.join(ROOT, 'output/gsc/api');
    fs.mkdirSync(outDir, { recursive: true });
    const suffix = getArg('--suffix', '');
    const stem = `${dims.join('-')}${suffix}_${start}_${end}`;
    fs.writeFileSync(path.join(outDir, `${stem}.csv`), lines.join('\n') + '\n');
    const clicks = rows.reduce((s, r) => s + r.clicks, 0), impr = rows.reduce((s, r) => s + r.impressions, 0);
    console.log(`${rows.length} rows | clicks ${clicks} | impressions ${impr} -> output/gsc/api/${stem}.csv`);
  }
}
main().catch(e => fail(e.stack || e.message));
