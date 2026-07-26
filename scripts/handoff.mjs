#!/usr/bin/env node
/**
 * handoff.mjs — read the handoff corpus in slices instead of whole files.
 *
 * The archive is ~1.2MB. Loading it to answer "what did we decide about OneLink?"
 * wastes a session's context and is why verified work kept getting re-derived.
 * This prints only the matching neighbourhoods.
 *
 *   node scripts/handoff.mjs facts [domain]   verified-facts ledger, optionally one section
 *   node scripts/handoff.mjs find <term...>   search the whole corpus, ranked, with context
 *   node scripts/handoff.mjs slug <n>         everything recorded about one post slug
 *   node scripts/handoff.mjs map              what each archive file covers
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

const ROOT = process.cwd();
const HANDOFF = join(ROOT, 'HANDOFF.md');
const ARCHIVE_DIR = join(ROOT, 'docs', 'handoff');
const FACTS = join(ARCHIVE_DIR, 'FACTS.md');

const [cmd, ...rest] = process.argv.slice(2);

const read = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : '');
const corpus = () => {
  const files = [];
  if (existsSync(HANDOFF)) files.push(HANDOFF);
  if (existsSync(ARCHIVE_DIR)) {
    for (const f of readdirSync(ARCHIVE_DIR)) {
      if (f.endsWith('.md')) files.push(join(ARCHIVE_DIR, f));
    }
  }
  return files;
};

// Freshness beats completeness: a 2026-07-26 line about deploys overrides a 2026-07-11 one.
const dateOf = (s) => (s.match(/20\d{2}-\d{2}-\d{2}/) || [''])[0];

function cmdFacts(domain) {
  const txt = read(FACTS);
  if (!txt) return console.error('No FACTS.md yet — create docs/handoff/FACTS.md.');
  if (!domain) return console.log(txt);
  const sections = txt.split(/^## /m);
  const hit = sections.find((s) => s.toLowerCase().startsWith(domain.toLowerCase()));
  if (!hit) {
    const names = sections.slice(1).map((s) => s.split('\n')[0].trim());
    return console.error(`No section "${domain}". Available: ${names.join(', ')}`);
  }
  console.log('## ' + hit.trimEnd());
}

function cmdFind(terms) {
  if (!terms.length) return console.error('usage: handoff.mjs find <term...>');
  const res = [];
  for (const file of corpus()) {
    const lines = read(file).split(/\r?\n/);
    lines.forEach((line, i) => {
      const low = line.toLowerCase();
      const score = terms.filter((t) => low.includes(t.toLowerCase())).length;
      if (score) res.push({ file, i, line, score, date: dateOf(line) });
    });
  }
  if (!res.length) return console.log('(no match)');

  // All terms matched beats some; newer beats older; FACTS.md beats prose.
  res.sort((a, b) =>
    b.score - a.score ||
    (b.date > a.date ? 1 : b.date < a.date ? -1 : 0) ||
    (a.file.endsWith('FACTS.md') ? -1 : 1)
  );

  const LIMIT = 25;
  for (const r of res.slice(0, LIMIT)) {
    const rel = r.file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
    console.log(`\n── ${rel}:${r.i + 1}  [${r.score}/${terms.length} terms]`);
    console.log(r.line.trim().slice(0, 900));
  }
  if (res.length > LIMIT) console.log(`\n… ${res.length - LIMIT} more matches (narrow the terms)`);
}

function cmdSlug(n) {
  if (!n) return console.error('usage: handoff.mjs slug <number>');
  // Bare numbers are noisy, so require a slug-shaped context around them.
  const pat = new RegExp(`(?:^|[^\\d])${n}(?:[^\\d]|$)`);
  const kw = /blog|slug|post|card|reel|publish|deploy|image/i;
  let found = 0;
  for (const file of corpus()) {
    const lines = read(file).split(/\r?\n/);
    lines.forEach((line, i) => {
      if (pat.test(line) && kw.test(line)) {
        const rel = file.replace(ROOT + '\\', '').replace(ROOT + '/', '').replace(/\\/g, '/');
        console.log(`\n── ${rel}:${i + 1}`);
        console.log(line.trim().slice(0, 900));
        found++;
      }
    });
  }
  if (!found) console.log(`(nothing recorded for slug ${n})`);
}

function cmdMap() {
  console.log('file                                                    lines    size  covers');
  for (const file of corpus()) {
    const txt = read(file);
    const lines = txt.split(/\r?\n/);
    const dates = [...txt.matchAll(/20\d{2}-\d{2}-\d{2}/g)].map((m) => m[0]).sort();
    const span = dates.length ? `${dates[0]} → ${dates[dates.length - 1]}` : '(undated)';
    const kb = Math.round(statSync(file).size / 1024);
    console.log(
      `${basename(file).padEnd(54)} ${String(lines.length).padStart(6)} ${String(kb + 'K').padStart(6)}  ${span}`
    );
    // Section headings tell you what is inside without opening it.
    const heads = lines.filter((l) => /^##\s/.test(l)).map((l) => l.replace(/^##\s*/, '').trim());
    if (heads.length) console.log('    ' + heads.slice(0, 12).join(' · ') + (heads.length > 12 ? ' …' : ''));
  }
}

switch (cmd) {
  case 'facts': cmdFacts(rest[0]); break;
  case 'find':  cmdFind(rest); break;
  case 'slug':  cmdSlug(rest[0]); break;
  case 'map':   cmdMap(); break;
  default:
    console.log(`handoff.mjs — slice the handoff corpus instead of loading it

  node scripts/handoff.mjs facts [domain]   verified facts (amazon, ga4, deploy, gsc, images, …)
  node scripts/handoff.mjs find <term...>   ranked search with context across all handoff files
  node scripts/handoff.mjs slug <n>         everything recorded about one post slug
  node scripts/handoff.mjs map              what each archive file covers`);
}
