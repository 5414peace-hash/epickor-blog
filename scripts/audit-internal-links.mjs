#!/usr/bin/env node
/**
 * Internal-link audit: the three things the reviewer does not check.
 *
 * Why this exists (2026-09-01). The reviewer scores a post as passing with one
 * outbound internal link. That leaves three real defects invisible, and all
 * three were found by hand on the same day:
 *
 *   1. BROKEN   — the target slug does not exist.
 *   2. MISLABEL — the anchor text describes a different article than the one it
 *                 points at. Post 173 offered a "K-beauty routine guide" that
 *                 led to the red ginseng post; post 162 offered a "Korean food
 *                 starter pack guide" that led to an article about an actor's
 *                 drama fees. A link-count check can never see this.
 *   3. ORPHAN   — nothing links *to* the post. Outbound links help the reader;
 *                 inbound links are the half that helps the page. Posts 430 and
 *                 432 were published with zero inbound links and nothing flagged.
 *
 * Usage:
 *   node scripts/audit-internal-links.mjs              # whole site
 *   node scripts/audit-internal-links.mjs --slug 433   # one post, both directions
 *   node scripts/audit-internal-links.mjs --orphans    # only the orphan list
 *
 * The MISLABEL check is a heuristic and is meant to be read, not obeyed: it
 * flags a link when the anchor shares no meaningful word with the target's
 * title or tags. Expect false positives on deliberately conversational anchors
 * ("why Korea built a fridge for one food"), which is why they print as REVIEW
 * rather than FAIL. Only BROKEN is a hard error.
 */
import fs from 'node:fs';
import path from 'node:path';

const args = {};
for (let i = 2; i < process.argv.length; i += 1) {
  if (process.argv[i].startsWith('--')) args[process.argv[i].slice(2)] = process.argv[i + 1] ?? true;
}

const DIR = 'content/blog';
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.md'));

/** Slug is the numeric prefix; filenames may carry a descriptive tail. */
const slugOf = (f) => f.replace(/\.md$/, '').split('-')[0];

const posts = new Map();
for (const f of files) {
  const raw = fs.readFileSync(path.join(DIR, f), 'utf8');
  const title = (raw.match(/^title:\s*"(.+)"/m) || [])[1] || '';
  const tags = (raw.match(/^tags:\s*\[(.*)\]/m) || [])[1] || '';
  posts.set(slugOf(f), { file: f, raw, title, tags });
}

const STOP = new Set([
  'the', 'a', 'an', 'and', 'or', 'of', 'for', 'to', 'in', 'on', 'at', 'is', 'it', 'what',
  'why', 'how', 'guide', 'korea', 'korean', 'koreans', 'your', 'you', 'with', 'that', 'this',
  'explained', 'about', 'from', 'not', 'our', 'epickor', 'vs', 'which', 'does', 'do', 'are',
]);
const words = (s) =>
  new Set(
    s.toLowerCase().replace(/[^a-z0-9가-힣\s]/g, ' ').split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w)),
  );

const inbound = new Map([...posts.keys()].map((s) => [s, new Set()]));
const findings = [];
const LINK = /\[([^\]]+)\]\(\/blog\/(\d+)\)/g;

for (const [slug, post] of posts) {
  let m;
  LINK.lastIndex = 0;
  while ((m = LINK.exec(post.raw))) {
    const [, anchor, target] = m;
    if (!posts.has(target)) {
      findings.push({ level: 'BROKEN', slug, anchor, target, note: 'target slug does not exist' });
      continue;
    }
    if (target === slug) {
      findings.push({ level: 'REVIEW', slug, anchor, target, note: 'post links to itself' });
      continue;
    }
    inbound.get(target).add(slug);
    const t = posts.get(target);
    const a = words(anchor);
    const titleWords = words(`${t.title} ${t.tags}`);
    const shared = [...a].filter((w) => titleWords.has(w));
    if (a.size && shared.length === 0) {
      findings.push({
        level: 'REVIEW', slug, anchor, target,
        note: `anchor shares no word with target title — "${t.title}"`,
      });
    }
  }
}

const orphans = [...inbound.entries()]
  .filter(([, from]) => from.size === 0)
  .map(([slug]) => slug)
  .sort();

if (args.slug) {
  const s = String(args.slug);
  const p = posts.get(s);
  if (!p) { console.error(`no post ${s}`); process.exit(2); }
  console.log(`\n${s} — ${p.title}\n`);
  console.log('  OUT:');
  LINK.lastIndex = 0;
  let m; let n = 0;
  while ((m = LINK.exec(p.raw))) {
    n += 1;
    const t = posts.get(m[2]);
    console.log(`    "${m[1]}" -> ${m[2]} : ${t ? t.title : '*** MISSING ***'}`);
  }
  if (!n) console.log('    (none)');
  const from = [...inbound.get(s)].sort();
  console.log(`\n  IN (${from.length}): ${from.length ? from.join(', ') : '*** ORPHAN — nothing links here ***'}\n`);
  process.exit(0);
}

if (!args.orphans) {
  const broken = findings.filter((f) => f.level === 'BROKEN');
  const review = findings.filter((f) => f.level === 'REVIEW');
  console.log(`\nInternal link audit — ${posts.size} posts\n`);
  console.log(`  BROKEN: ${broken.length}   REVIEW: ${review.length}   ORPHANS: ${orphans.length}\n`);
  for (const f of broken) console.log(`  BROKEN  ${f.slug}: "${f.anchor}" -> /blog/${f.target} (${f.note})`);
  for (const f of review) console.log(`  REVIEW  ${f.slug}: "${f.anchor}" -> ${f.target} — ${f.note}`);
}

console.log(`\nORPHANS (${orphans.length}) — no post links to these:\n`);
console.log(orphans.length ? `  ${orphans.join(' ')}\n` : '  (none)\n');

process.exit(findings.some((f) => f.level === 'BROKEN') ? 1 : 0);
