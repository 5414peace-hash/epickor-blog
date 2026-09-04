#!/usr/bin/env node
/**
 * Fetch Wikimedia Commons originals by file title, and VERIFY WHAT ARRIVED.
 *
 * Why this exists rather than a curl one-liner (2026-09-04, twice in one session):
 *   - A curl run hit the Bash tool's timeout part-way and left a 1.03 MB stub of a
 *     1.76 MB PNG. sharp failed with "pngload: libspng read error" only when the
 *     file was used, several steps later.
 *   - A later run was rate-limited and Wikimedia returned an HTML error page with
 *     HTTP 200. The fetcher wrote 1,964 bytes of `<!DOCTYPE html>` into a .jpg and
 *     reported "got". Nothing downstream would have said why until a render broke.
 *
 *   Both are the same failure: trusting that a file named .jpg is a JPEG. This
 *   checks magic bytes and the byte count the API reported, and retries on the
 *   429/5xx that caused the second one.
 *
 * Usage:
 *   node scripts/fetch-commons.mjs OUT_DIR "File:Something.jpg" ["File:Other.png" ...]
 */
import fs from 'node:fs';
import path from 'node:path';

const UA = 'EpicKor/1.0 (https://epickor.com; research) node-fetch';
const [outDir, ...titles] = process.argv.slice(2);
if (!outDir || titles.length === 0) {
  console.error('usage: node scripts/fetch-commons.mjs OUT_DIR "File:Name.jpg" ...');
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });

const MAGIC = [
  { ext: 'jpg', bytes: [0xff, 0xd8, 0xff] },
  { ext: 'png', bytes: [0x89, 0x50, 0x4e, 0x47] },
  { ext: 'gif', bytes: [0x47, 0x49, 0x46, 0x38] },
  { ext: 'webp', bytes: [0x52, 0x49, 0x46, 0x46] },
];

function looksLikeImage(buf) {
  return MAGIC.some(m => m.bytes.every((b, i) => buf[i] === b));
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

const api = 'https://commons.wikimedia.org/w/api.php?action=query&format=json'
  + '&prop=imageinfo&iiprop=url|size&titles=' + encodeURIComponent(titles.join('|'));
const meta = await (await fetch(api, { headers: { 'User-Agent': UA } })).json();

let failed = 0;
for (const page of Object.values(meta.query.pages)) {
  const info = page.imageinfo?.[0];
  if (!info) {
    console.log('MISSING  ' + page.title);
    failed += 1;
    continue;
  }
  const name = page.title.replace(/^File:/, '').replace(/ /g, '_');
  const dest = path.join(outDir, name);
  if (fs.existsSync(dest) && fs.statSync(dest).size === info.size) {
    console.log('have     ' + name);
    continue;
  }

  let ok = false;
  for (let attempt = 1; attempt <= 4 && !ok; attempt += 1) {
    const res = await fetch(info.url, { headers: { 'User-Agent': UA } });
    if (!res.ok) {
      if (res.status === 429 || res.status >= 500) {
        await sleep(attempt * 3000);
        continue;
      }
      console.log('HTTP ' + res.status + '  ' + name);
      break;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    // Three checks, because each one has actually failed here: the API's own byte
    // count catches a truncated transfer, the magic bytes catch an error page
    // served with HTTP 200, and a zero length catches an empty write.
    if (buf.length === 0) {
      await sleep(attempt * 3000);
      continue;
    }
    if (!looksLikeImage(buf)) {
      console.log('  attempt ' + attempt + ': not an image ('
        + buf.length + ' bytes, starts "' + buf.subarray(0, 24).toString('utf8').replace(/\s+/g, ' ') + '")');
      await sleep(attempt * 3000);
      continue;
    }
    if (buf.length !== info.size) {
      console.log('  attempt ' + attempt + ': short read '
        + buf.length + ' of ' + info.size);
      await sleep(attempt * 3000);
      continue;
    }
    fs.writeFileSync(dest, buf);
    console.log('got      ' + name + '  ' + info.width + 'x' + info.height
      + '  ' + (buf.length / 1e6).toFixed(2) + ' MB');
    ok = true;
  }
  if (!ok) {
    console.log('FAILED   ' + name);
    failed += 1;
  }
}
if (failed) {
  console.log('\n' + failed + ' file(s) did not arrive intact. Nothing was written for them.');
  process.exit(1);
}
