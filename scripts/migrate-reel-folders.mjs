#!/usr/bin/env node
/**
 * One-time migration: date-prefix every reel folder in both trees, and point the
 * code at the new names.
 *
 *   output/reels/294            -> output/reels/2026-07-14_294
 *   output/final/reels/294      -> output/final/reels/2026-07-14_294
 *
 * The date is the earliest file mtime across BOTH trees for that reel, so the two
 * trees end up keyed identically — which is the actual ask: one reel, one name,
 * working files and delivered file side by side and in chronological order.
 *
 * git history is useless as the date source here: `output/reels/**` was largely
 * untracked until 2026-08-11, so `git log` reports today for almost every folder.
 * File mtimes survived and match the known production history.
 *
 * Run with --apply. Without it, prints the plan and touches nothing.
 */
import fs from 'node:fs';
import path from 'node:path';

const APPLY = process.argv.includes('--apply');
const dates = JSON.parse(fs.readFileSync('.tmp/reel-dates.json', 'utf8'));
const TREES = ['output/reels', 'output/final/reels'];
const say = (...a) => console.log(...a);

/* ------------------------------------------------------------ 1. folders */

let moved = 0;
for (const tree of TREES) {
  if (!fs.existsSync(tree)) continue;
  for (const name of fs.readdirSync(tree)) {
    const from = path.join(tree, name);
    if (!fs.statSync(from).isDirectory()) continue;
    if (/^\d{4}-\d{2}-\d{2}_/.test(name)) continue;          // already migrated
    if (!dates[name]) { say(`  skip  ${from}  (not a reel)`); continue; }
    const to = path.join(tree, `${dates[name]}_${name}`);
    say(`  move  ${from}  ->  ${to}`);
    if (APPLY) fs.renameSync(from, to);
    moved += 1;
  }
}

/* -------------------------------------------------- 2. remotion imports */

const IMPORT = /(\.\.\/output\/reels\/)([A-Za-z0-9_-]+)(\/)/g;
let tsxEdits = 0;
for (const file of fs.readdirSync('remotion').filter((f) => f.endsWith('.tsx'))) {
  const p = path.join('remotion', file);
  const before = fs.readFileSync(p, 'utf8');
  const after = before.replace(IMPORT, (m, pre, name, post) => (
    dates[name] && !/^\d{4}-\d{2}-\d{2}_/.test(name) ? `${pre}${dates[name]}_${name}${post}` : m
  ));
  if (after !== before) {
    say(`  edit  ${p}`);
    if (APPLY) fs.writeFileSync(p, after);
    tsxEdits += 1;
  }
}

/* ------------------------------------------------------- 3. script paths */

const SCRIPTS = [
  ...fs.readdirSync('scripts').filter((f) => f.endsWith('.mjs')).map((f) => path.join('scripts', f)),
  ...fs.readdirSync('.claude/skills/reels/scripts').filter((f) => f.endsWith('.mjs'))
    .map((f) => path.join('.claude/skills/reels/scripts', f)),
];
const SUBS = [
  [/'output', 'reels', slug/g, "'output', 'reels', reelFolder(slug)"],
  [/'output', 'final', 'reels', slug/g, "'output', 'final', 'reels', reelFolder(slug)"],
  [/output\/reels\/\$\{slug\}/g, 'output/reels/${reelFolder(slug)}'],
];
let scriptEdits = 0;
for (const p of SCRIPTS) {
  if (p.endsWith('migrate-reel-folders.mjs') || p.includes('lib')) continue;
  let text = fs.readFileSync(p, 'utf8');
  const before = text;
  for (const [pattern, replacement] of SUBS) text = text.replace(pattern, replacement);
  if (text === before) continue;
  if (!text.includes('reel-dir.mjs')) {
    const rel = p.startsWith('scripts') ? './lib/reel-dir.mjs' : '../../../../scripts/lib/reel-dir.mjs';
    // Insert after the final import so the helper is in scope before first use.
    const lines = text.split('\n');
    const last = lines.reduce((acc, l, i) => (/^import .*from '.*';?$/.test(l) ? i : acc), -1);
    lines.splice(last + 1, 0, `import { reelFolder } from '${rel}';`);
    text = lines.join('\n');
  }
  say(`  edit  ${p}`);
  if (APPLY) fs.writeFileSync(p, text);
  scriptEdits += 1;
}

say(`\n${APPLY ? 'applied' : 'DRY RUN'}: ${moved} folders, ${tsxEdits} compositions, ${scriptEdits} scripts`);
if (!APPLY) say('re-run with --apply');
