#!/usr/bin/env node
/**
 * Google Search Console — Search Analytics API pull.
 *
 * Why this exists: the GSC web UI export caps at 1,000 rows. The API returns
 * 25,000 per request and paginates via startRow to 50,000/day/site/search-type.
 * That is a 25x widening of the query universe we can actually see.
 * (docs/keyword-selection-playbook.md §1)
 *
 * Auth: service account. No OAuth flow, no browser, no card on file.
 * Setup is documented in docs/gsc-api-setup.md — the representative does 4 clicks
 * in Google Cloud + 1 in Search Console, once.
 *
 * Usage:
 *   node scripts/gsc-fetch.mjs                       # last 3 months, queries
 *   node scripts/gsc-fetch.mjs --dimension page      # pages instead of queries
 *   node scripts/gsc-fetch.mjs --days 28
 *   node scripts/gsc-fetch.mjs --start 2026-05-01 --end 2026-07-31
 *   node scripts/gsc-fetch.mjs --dimension query,page   # cross-tab
 *
 * Output: output/gsc/api/{dimension}_{start}_{end}.csv  (+ .json)
 *
 * IMPORTANT measurement caveat, see docs/checkpoints/ and FACTS.md:
 * Google confirmed an impressions over-reporting bug from 2025-05-13 through
 * ~April 2026. Compare CLICKS across time. Do not trend impressions or CTR
 * across that boundary.
 */

import { google } from 'googleapis';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ─── .env.local loader (same pattern as the other scripts here) ───
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

const SITE_URL = process.env.GSC_SITE_URL || 'https://www.epickor.com/';
const KEY_FILE = process.env.GSC_SERVICE_ACCOUNT_KEY || join(ROOT, '.gsc-service-account.json');

const args = process.argv.slice(2);
function arg(name, fallback) {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
}

const dimensions = arg('dimension', 'query').split(',').map(s => s.trim());
const days = parseInt(arg('days', '90'), 10);

// GSC data lags ~2 days; asking for today returns nothing and looks like a bug.
const today = new Date();
const defaultEnd = new Date(today.getTime() - 2 * 86400000).toISOString().slice(0, 10);
const defaultStart = new Date(today.getTime() - (days + 2) * 86400000).toISOString().slice(0, 10);
const startDate = arg('start', defaultStart);
const endDate = arg('end', defaultEnd);

const ROW_LIMIT = 25000;      // API max per request
const DAILY_CAP = 50000;      // per day / site / search type

function fail(msg, hint) {
  console.error(`\n❌ ${msg}`);
  if (hint) console.error(`\n${hint}`);
  process.exit(1);
}

if (!existsSync(KEY_FILE)) {
  fail(
    `Service account key not found: ${KEY_FILE}`,
    `Setup is a one-time, ~10 minute job. Full walkthrough:\n` +
    `  docs/gsc-api-setup.md\n\n` +
    `Short version:\n` +
    `  1. console.cloud.google.com → create a project (free, no card)\n` +
    `  2. Enable "Google Search Console API"\n` +
    `  3. Create a service account → create a JSON key → save it as\n` +
    `     ${KEY_FILE}\n` +
    `  4. In Search Console → Settings → Users and permissions →\n` +
    `     add the service account's email as a "Full" user\n\n` +
    `The key file is gitignored. Never commit it.`
  );
}

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });

  const searchconsole = google.searchconsole({ version: 'v1', auth });

  console.log(`\nSite:       ${SITE_URL}`);
  console.log(`Dimensions: ${dimensions.join(' x ')}`);
  console.log(`Range:      ${startDate} → ${endDate}\n`);

  const rows = [];
  let startRow = 0;

  while (startRow < DAILY_CAP) {
    process.stdout.write(`  fetching rows ${startRow}–${startRow + ROW_LIMIT}... `);
    let res;
    try {
      res = await searchconsole.searchanalytics.query({
        siteUrl: SITE_URL,
        requestBody: { startDate, endDate, dimensions, rowLimit: ROW_LIMIT, startRow },
      });
    } catch (e) {
      const m = e?.errors?.[0]?.message || e.message;
      if (String(m).match(/permission|forbidden|403/i)) {
        fail(
          `Permission denied for ${SITE_URL}`,
          `The service account can authenticate but isn't authorized on this property.\n` +
          `In Search Console → Settings → Users and permissions, add the service\n` +
          `account email (found in ${KEY_FILE}, field "client_email") as a user.\n\n` +
          `Also confirm GSC_SITE_URL matches the property EXACTLY — a domain property\n` +
          `is "sc-domain:epickor.com", a URL-prefix property is "https://www.epickor.com/".`
        );
      }
      throw e;
    }

    const batch = res.data.rows || [];
    console.log(`${batch.length}`);
    rows.push(...batch);
    if (batch.length < ROW_LIMIT) break;   // last page
    startRow += ROW_LIMIT;
  }

  if (!rows.length) {
    console.log('\n⚠️  Zero rows. Usually means the date range is too recent (GSC lags ~2 days)');
    console.log('    or the property has no data for this search type.');
    return;
  }

  const outDir = join(ROOT, 'output/gsc/api');
  mkdirSync(outDir, { recursive: true });
  const stem = `${dimensions.join('-')}_${startDate}_${endDate}`;

  const header = [...dimensions, 'clicks', 'impressions', 'ctr', 'position'];
  const esc = v => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v);
  const csv = [
    header.join(','),
    ...rows.map(r => [
      ...r.keys.map(esc),
      r.clicks,
      r.impressions,
      (r.ctr * 100).toFixed(4),
      r.position.toFixed(2),
    ].join(',')),
  ].join('\n');

  writeFileSync(join(outDir, `${stem}.csv`), csv + '\n', 'utf8');
  writeFileSync(join(outDir, `${stem}.json`), JSON.stringify(rows, null, 2), 'utf8');

  const clicks = rows.reduce((s, r) => s + r.clicks, 0);
  const impr = rows.reduce((s, r) => s + r.impressions, 0);

  console.log(`\n✅ ${rows.length.toLocaleString()} rows`);
  console.log(`   clicks ${clicks.toLocaleString()} | impressions ${impr.toLocaleString()} | CTR ${(clicks / impr * 100).toFixed(3)}%`);
  console.log(`   → output/gsc/api/${stem}.csv`);

  if (rows.length >= DAILY_CAP) {
    console.log(`\n⚠️  Hit the ${DAILY_CAP.toLocaleString()}/day ceiling — narrow the date range to see the rest.`);
  }
  console.log(`\nReminder: compare CLICKS over time, not impressions or CTR.`);
  console.log(`Google over-reported impressions 2025-05-13 → ~2026-04 (see FACTS.md).`);
}

main().catch(e => {
  console.error('\n❌ Unexpected failure:', e.message);
  process.exit(1);
});
