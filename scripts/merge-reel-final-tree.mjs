#!/usr/bin/env node
/**
 * Fold output/final/reels/ into output/reels/, so one reel is one folder.
 *
 *   output/final/reels/2026-07-14_294/EPICKOR_294_03.mp4
 *     -> output/reels/2026-07-14_294/final/EPICKOR_294_03.mp4
 *
 * Direction matters and it is not arbitrary. `output/final/` is the blog-post
 * finals directory (166_final.md, 167_final.md, ...); reels were nested inside
 * it, which is the actual source of "why is this in two places". Everything
 * else about a reel — cut plan, manifest, narration, audio, candidates — already
 * lives in output/reels/, and that is where CLAUDE.md and every script point.
 *
 * The delivery tree is NOT a copy of the working tree. Measured 2026-08-11:
 * 120 of its files (2.91 GB) exist nowhere else, including the only copies of
 * 13 early reels (170-184) that never had a working folder. It is gitignored,
 * so a delete is unrecoverable. Nothing here deletes before its content is
 * confirmed present at the destination.
 *
 * Second pass removes true redundancy: a file in the reel root that is
 * byte-identical to one now under final/ (a candidate render and the delivered
 * copy of it) loses the root copy.
 *
 * Run with --apply. Without it, prints the plan and touches nothing.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const APPLY = process.argv.includes('--apply');
const SRC = path.join('output', 'final', 'reels');
const DST = path.join('output', 'reels');
const say = (...a) => console.log(...a);
const MB = (n) => `${(n / 1048576).toFixed(1)}MB`;

const sha = (f) => crypto.createHash('sha1').update(fs.readFileSync(f)).digest('hex');
const key = (f) => `${fs.statSync(f).size}:${sha(f)}`;

function walk(root, pre = '') {
  const out = [];
  for (const e of fs.readdirSync(root, { withFileTypes: true })) {
    const abs = path.join(root, e.name);
    if (e.isDirectory()) out.push(...walk(abs, `${pre}${e.name}/`));
    else out.push({ rel: pre + e.name, abs });
  }
  return out;
}

/* ------------------------------------------------- 1. move the delivery files */

let moved = 0; let movedBytes = 0; let skipped = 0;
const collisions = [];

for (const folder of fs.readdirSync(SRC)) {
  const from = path.join(SRC, folder);
  if (!fs.statSync(from).isDirectory()) continue;
  const finalDir = path.join(DST, folder, 'final');

  for (const f of walk(from)) {
    const to = path.join(finalDir, f.rel);
    if (fs.existsSync(to)) {
      // Same content already there: the move is a no-op, drop the source.
      if (key(to) === key(f.abs)) {
        if (APPLY) fs.unlinkSync(f.abs);
        skipped += 1;
        continue;
      }
      collisions.push(`${folder}/${f.rel}`);   // different content, same name
      continue;
    }
    const size = fs.statSync(f.abs).size;
    say(`  move  ${folder}/${f.rel}  (${MB(size)})`);
    if (APPLY) {
      fs.mkdirSync(path.dirname(to), { recursive: true });
      fs.renameSync(f.abs, to);
    }
    moved += 1; movedBytes += size;
  }
}

if (collisions.length) {
  say(`\n  !! ${collisions.length} name collision(s) with DIFFERENT content — left in place:`);
  collisions.forEach((c) => say(`     ${c}`));
}

/* ------------------------------------------- 2. drop root copies of delivered files */

let deduped = 0; let dedupedBytes = 0;
for (const folder of fs.readdirSync(DST)) {
  const finalDir = path.join(DST, folder, 'final');
  const root = path.join(DST, folder);
  if (!fs.existsSync(finalDir) || !fs.statSync(root).isDirectory()) continue;

  const delivered = new Set(walk(finalDir).map((f) => key(f.abs)));
  for (const e of fs.readdirSync(root, { withFileTypes: true })) {
    if (!e.isFile()) continue;
    const abs = path.join(root, e.name);
    if (!delivered.has(key(abs))) continue;
    const size = fs.statSync(abs).size;
    say(`  dedup ${folder}/${e.name}  (${MB(size)}, identical to a file under final/)`);
    if (APPLY) fs.unlinkSync(abs);
    deduped += 1; dedupedBytes += size;
  }
}

/* ------------------------------------------------------------ 3. remove the old tree */

let removed = false;
if (APPLY && !collisions.length) {
  const leftovers = walk(SRC);
  if (leftovers.length) {
    say(`\n  !! ${leftovers.length} file(s) still in ${SRC} — NOT removing it`);
    leftovers.slice(0, 10).forEach((f) => say(`     ${f.rel}`));
  } else {
    fs.rmSync(SRC, { recursive: true });
    removed = true;
  }
}

say(`\n${APPLY ? 'applied' : 'DRY RUN'}: moved ${moved} (${MB(movedBytes)}), `
  + `already-present ${skipped}, deduped ${deduped} (${MB(dedupedBytes)})`
  + (removed ? `, removed ${SRC}` : ''));
if (!APPLY) say('re-run with --apply');
