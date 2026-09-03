#!/usr/bin/env node
/**
 * Duplicate-topic audit for candidate blog topics.
 *
 *   node scripts/topic-dedup.mjs tanghulu 탕후루
 *   node scripts/topic-dedup.mjs --terms "maxim,커피믹스,coffee mix"
 *
 * Why this exists (2026-09-03):
 *   Two keyword cycles in a row passed a candidate that was already published,
 *   and both times the miss had the same shape — the audit searched BODIES for
 *   the Korean word and never searched TITLES for the romanised one.
 *     - 2026-08-26: 맥심 커피믹스 passed with "전용 제목 0". Blog `278`,
 *       "Maxim Coffee Mix: Korea Invented the Coffee Stick", had been live
 *       since 2026-07-08.
 *     - 2026-09-03: 붕어빵 looked clean on a hangul title grep. Blog `416`,
 *       "Cham Bungeoppang: The Korean Fish Snack...", had been live since
 *       2026-08-19 — and `071` was already linking to it.
 *   The posts are written in English, so hangul appears in bodies only where
 *   somebody chose to gloss it. **Romanised term x title line is the axis that
 *   actually catches duplicates**, and it is the one a human skips.
 *
 * A TITLE hit is a hard block. Body hits are context: they usually mean the
 * topic is covered as a section somewhere, which makes a new post a spin-off
 * that has to be labelled as one (CLAUDE.md: "리트레드면 그렇게 라벨한다").
 *
 * This checks internal coverage only. It does NOT answer whether the English
 * web already covers the topic — that gate runs first and lives outside the
 * repo (CLAUDE.md 2026-08-25).
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
let terms = [];
const ti = args.indexOf('--terms');
if (ti !== -1 && args[ti + 1]) terms = args[ti + 1].split(',');
// Guard the -1 case: with no --terms flag, ti+1 is 0 and a naive filter drops
// the FIRST positional term silently. Caught on this script's own first run,
// where `topic-dedup.mjs maxim bungeoppang` audited only bungeoppang.
const skip = ti === -1 ? -1 : ti + 1;
terms = terms.concat(args.filter((a, i) => !a.startsWith('--') && i !== skip));
terms = terms.map((t) => t.trim()).filter(Boolean);

if (!terms.length) {
  console.error('usage: node scripts/topic-dedup.mjs <term> [term...]');
  console.error('       pass BOTH the romanised and the hangul form of a name.');
  process.exit(1);
}

const dirs = ['content/blog', 'content/business', 'output/final'].filter(existsSync);
const docs = [];
for (const dir of dirs) {
  for (const f of readdirSync(dir).filter((n) => n.endsWith('.md'))) {
    const path = join(dir, f);
    const raw = readFileSync(path, 'utf8');
    const m = raw.match(/^title:\s*"?(.*?)"?\s*$/m);
    docs.push({ path, title: m ? m[1] : '', body: raw });
  }
}

const queuePath = 'content/data/topics-queue.json';
const queue = existsSync(queuePath) ? readFileSync(queuePath, 'utf8') : '';

console.log(`Scanned ${docs.length} documents across ${dirs.join(', ')}\n`);

let blocked = 0;
for (const term of terms) {
  const re = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const titleHits = docs.filter((d) => re.test(d.title));
  const bodyHits = docs.filter((d) => !re.test(d.title) && re.test(d.body));
  const queueHit = re.test(queue);

  console.log(`── ${term}`);
  if (titleHits.length) {
    blocked++;
    console.log(`   BLOCK — ${titleHits.length} TITLE match(es):`);
    for (const d of titleHits) console.log(`     ${d.path}\n       "${d.title}"`);
  } else {
    console.log('   titles: clean');
  }
  if (bodyHits.length) {
    console.log(`   body mentions in ${bodyHits.length} doc(s) — a new post here is a SPIN-OFF, label it:`);
    for (const d of bodyHits.slice(0, 8)) console.log(`     ${d.path}`);
    if (bodyHits.length > 8) console.log(`     ... and ${bodyHits.length - 8} more`);
  } else {
    console.log('   bodies: clean');
  }
  console.log(`   topics-queue.json: ${queueHit ? 'PRESENT — check its status' : 'absent'}`);
  console.log('');
}

console.log(blocked
  ? `RESULT: ${blocked} of ${terms.length} term(s) blocked on an existing title.`
  : `RESULT: no title collisions across ${terms.length} term(s). Internal absence is not a green light — run the English coverage gate before drafting.`);
process.exit(blocked ? 1 : 0);
