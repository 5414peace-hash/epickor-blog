#!/usr/bin/env node
/**
 * audit-reel-clip-uniqueness.mjs — the Reels counterpart of audit-image-uniqueness.
 *
 * Born 2026-07-27: the representative rejected a whole batch partly because its
 * hook clips had already appeared in earlier Reels (one of them four times).
 * The dedup check had been "grep whatever IDs I remember", which is not a check.
 *
 * Ledger sources (actual use, NOT candidate lists):
 *   - output/reels/{slug}/clip-sources.md   (the per-Reel provenance record)
 *   - output/reels/{slug}/image-sources.md
 *   - remotion/*.tsx                        (compositions reference files like name-12345678.mp4)
 * Candidate JSONs (pexels-video-candidates/, _cand.json) are deliberately ignored —
 * being considered is not being used.
 *
 * Reuse rule: a Pexels ID fails if it is recorded under a DIFFERENT slug.
 * Same-slug reuse (e.g. rebuilding a rejected version) is allowed.
 *
 *   node scripts/audit-reel-clip-uniqueness.mjs --scan               # print full ledger
 *   node scripts/audit-reel-clip-uniqueness.mjs --check-id 12345678 --slug 220
 *   node scripts/audit-reel-clip-uniqueness.mjs --check-ids 1,2,3 --slug 220
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

const ROOT = process.cwd();

/**
 * Reels that were scrapped BEFORE any render shipped. Their clip-sources.md
 * records a failed footage-gate evaluation, not viewer-seen usage, so they must
 * not poison the ledger. 311 is the tteokbokki Reel abandoned at planning on
 * 2026-07-21 (0 usable clips found); the 311 CARD NEWS that did publish shares
 * the number but no video clips.
 */
const SCRAPPED_SLUGS = new Set(['311']);

const args = {};
for (let i = 2; i < process.argv.length; i += 1) {
  if (process.argv[i].startsWith('--')) { args[process.argv[i].slice(2)] = process.argv[i + 1] ?? true; i += 1; }
}

// Pexels video/photo IDs are 6-9 digits. Shorter numbers (frame counts, years)
// and longer ones (timestamps) are noise.
const ID_RE = /(?<![\d])(\d{6,9})(?![\d])/g;

function idsIn(text) {
  const out = new Set();
  for (const m of text.matchAll(ID_RE)) out.add(m[1]);
  return out;
}

function buildLedger() {
  const ledger = new Map(); // id -> Set(slugs)
  const add = (id, slug) => {
    if (!ledger.has(id)) ledger.set(id, new Set());
    ledger.get(id).add(slug);
  };

  const reelsDir = join(ROOT, 'output', 'reels');
  if (existsSync(reelsDir)) {
    for (const slug of readdirSync(reelsDir)) {
      const dir = join(reelsDir, slug);
      if (!statSync(dir).isDirectory() || SCRAPPED_SLUGS.has(slug)) continue;
      for (const name of ['clip-sources.md', 'image-sources.md']) {
        const p = join(dir, name);
        if (!existsSync(p)) continue;
        for (const id of idsIn(readFileSync(p, 'utf8'))) add(id, slug);
      }
    }
  }

  const remotionDir = join(ROOT, 'remotion');
  if (existsSync(remotionDir)) {
    for (const f of readdirSync(remotionDir)) {
      if (!f.endsWith('.tsx')) continue;
      const slugMatch = f.match(/Reel(\d{3})/);
      const slug = slugMatch ? slugMatch[1] : `remotion:${f}`;
      for (const id of idsIn(readFileSync(join(remotionDir, f), 'utf8'))) add(id, slug);
    }
  }
  return ledger;
}

const ledger = buildLedger();

if (args.scan) {
  const rows = [...ledger.entries()].sort((a, b) => b[1].size - a[1].size);
  console.log(`ledger: ${rows.length} distinct IDs across actual-use records`);
  for (const [id, slugs] of rows) {
    if (slugs.size > 1) console.log(`  ${id}  used by ${[...slugs].join(', ')}`);
  }
  process.exit(0);
}

const slug = String(args.slug || '');
const ids = args['check-ids'] ? String(args['check-ids']).split(',') : args['check-id'] ? [String(args['check-id'])] : [];
if (!ids.length || !slug) {
  console.error('usage: --check-id {pexelsId} --slug {slug}   |   --check-ids a,b,c --slug {slug}   |   --scan');
  process.exit(2);
}

let fail = 0;
for (const id of ids.map((s) => s.trim()).filter(Boolean)) {
  const users = [...(ledger.get(id) ?? [])].filter((s) => s !== slug);
  if (users.length) { console.log(`FAIL ${id} — already used by Reel ${users.join(', ')}`); fail += 1; }
  else console.log(`OK   ${id}`);
}
process.exit(fail ? 1 : 0);
