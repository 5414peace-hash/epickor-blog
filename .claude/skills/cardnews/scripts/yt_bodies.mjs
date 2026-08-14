#!/usr/bin/env node
/**
 * Convert Instagram card-news captions into YouTube Community post bodies.
 *
 * The two platforms need different tails. Instagram captions end with a bare
 * "epickor.com" because a URL there is not clickable anyway, plus a block of ten
 * hashtags. On YouTube Community the URL IS clickable — that is the entire reason
 * this surface is worth using — and a ten-hashtag block reads as spam next to a
 * post that is otherwise a short editorial note.
 *
 * So: drop the hashtag line, drop the "Swipe for…" instruction (there is nothing
 * to swipe on a YouTube carousel — it scrolls), and replace the domain mention
 * with the full post URL on its own line.
 *
 * Output is JSON on stdout so the scheduler reads exactly what was reviewed.
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const SLUGS = ['171', '218', '312', '257', '220', '192', '259', '184', '288', '242'];
const ROOT = 'public/assets/cardnews';

const out = {};
for (const slug of SLUGS) {
  const dir = readdirSync(ROOT).find((d) => d.endsWith(`_${slug}`));
  if (!dir) throw new Error(`no card-news folder for ${slug}`);
  const raw = readFileSync(`${ROOT}/${dir}/caption.txt`, 'utf8').trim();

  const lines = raw
    .split('\n')
    .filter((l) => !l.trim().startsWith('#'))          // hashtag block
    .filter((l) => !/^swipe\b/i.test(l.trim()));       // carousel instruction

  // Drop every existing domain mention, whatever its casing, then append one clean
  // clickable line. The captions write it four different ways — "at epickor.com",
  // "epicKor.com/blog/171", "EPICKOR.COM/blog/192" — and a case-sensitive check let
  // two of those through, so the first pass emitted the URL twice.
  let body = lines
    .filter((l) => !/epickor\.com/i.test(l))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  body += `\n\nFull guide:\nhttps://www.epickor.com/blog/${slug}`;

  out[slug] = { dir, body, chars: body.length, hasUrl: body.includes(`/blog/${slug}`) };
}

writeFileSync('.tmp/yt-bodies.json', JSON.stringify(out, null, 2));
for (const [slug, v] of Object.entries(out)) {
  console.log(`\n===== ${slug}  (${v.chars} chars, url ${v.hasUrl})  ${v.dir}`);
  console.log(v.body);
}
