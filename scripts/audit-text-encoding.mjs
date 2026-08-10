#!/usr/bin/env node
/**
 * audit-text-encoding.mjs
 *
 * Catches text that has been destroyed by a UTF-8 -> legacy-codepage round trip.
 *
 * Why this exists: on 2026-08-10 the live page /blog/071 was rendering `?<FFFD>리만<FFFD>?`
 * where `델리만쥬` should have been, and /blog/296 had four smart quotes replaced by
 * `?<FFFD>...??`. Both were reader-visible on published pages and neither the reviewer,
 * the build, nor any image audit noticed, because the files were still valid UTF-8 —
 * they just contained replacement characters.
 *
 * The likely cause is a PowerShell `Set-Content` / `Out-File` without `-Encoding utf8`
 * (it defaults to the system ANSI codepage, cp949 on this machine). The archive records a
 * "line endings normalized" pass over 071 on 2026-07-18, which fits.
 *
 * Two signatures are checked:
 *   1. U+FFFD REPLACEMENT CHARACTER — something was decoded as the wrong encoding.
 *   2. cp1252 mojibake — UTF-8 bytes read as Latin-1/cp1252 ("â€œ", "ì•", "Ã©").
 *
 * Usage:
 *   npm run audit:encoding            # scan content/ and public/assets/
 *   npm run audit:encoding -- --fix   # only reports; there is no safe automatic fix,
 *                                     # because the original characters are unrecoverable
 *                                     # from the damaged bytes alone. Restore from git or
 *                                     # retype the phrase by hand.
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOTS = ['content', 'public/assets'];
const EXTENSIONS = new Set(['.md', '.mdx', '.json', '.txt', '.html']);

const REPLACEMENT = '�';
// UTF-8 lead bytes decoded as cp1252 produce these prefixes.
const CP1252_MOJIBAKE = /â€[œť]|â€"|Ã[-¿]|ì[-¿][-¿]|ê°|í•/;

function walk(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
      walk(full, out);
    } else if (EXTENSIONS.has(path.extname(e.name))) {
      out.push(full);
    }
  }
  return out;
}

const findings = [];

for (const root of ROOTS) {
  for (const file of walk(root)) {
    const text = fs.readFileSync(file, 'utf8');
    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => {
      const hasReplacement = line.includes(REPLACEMENT);
      const hasMojibake = CP1252_MOJIBAKE.test(line);
      if (!hasReplacement && !hasMojibake) return;
      findings.push({
        file,
        line: i + 1,
        kind: hasReplacement ? 'REPLACEMENT_CHAR' : 'CP1252_MOJIBAKE',
        // Show the damaged region with escapes so the terminal codepage cannot hide it.
        excerpt: JSON.stringify(line.trim().slice(0, 160)),
      });
    });
  }
}

if (findings.length === 0) {
  console.log(`PASS: no corrupted text found in ${ROOTS.join(', ')}.`);
  process.exit(0);
}

console.log(`FAIL: ${findings.length} corrupted line(s) found.\n`);
for (const f of findings) {
  console.log(`  ${f.kind}  ${f.file}:${f.line}`);
  console.log(`    ${f.excerpt}\n`);
}
console.log('These characters cannot be recovered from the damaged bytes. Restore the phrase');
console.log('from git history (git log -p -- <file>) or retype it, and make sure whatever');
console.log('wrote the file used UTF-8 — in PowerShell, pass -Encoding utf8 explicitly.');
process.exit(1);
