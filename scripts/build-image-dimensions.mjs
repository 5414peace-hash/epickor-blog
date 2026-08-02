#!/usr/bin/env node
/**
 * Generate the portrait-image manifest consumed by lib/image-dimensions.ts.
 *
 * Why a manifest instead of reading the files when the page renders:
 * `public/` is 1.7 GB. An earlier version of this feature called
 * `readFileSync` under `public/` from inside the blog route, and Next.js
 * traced that directory into the serverless bundle — the `blog/[slug]`
 * function came out at 418 MB against a 250 MB limit and the deployment was
 * rejected. The build succeeded; only the deploy failed, so it is worth
 * remembering that a green build does not mean this is safe to reintroduce.
 *
 * Only the header bytes of each image are parsed, and only paths whose aspect
 * ratio crosses the portrait threshold are written out, which keeps the
 * manifest small enough to import without thinking about it.
 *
 * Run automatically as part of `npm run build`. Safe to run by hand after
 * adding images.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, openSync, readSync, closeSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCAN_DIRS = ['assets/images/posts', 'assets/images/business'];
const OUT_FILE = path.join(ROOT, 'lib', 'generated', 'portrait-images.json');

// Matches isPortraitImage(). Near-square photographs look fine under the normal
// rules; only genuinely tall images (4:5 and beyond) need special handling.
const PORTRAIT_RATIO = 1.2;

function readJpeg(buf) {
  // Walk the marker chain to a Start Of Frame segment. Taking the first size
  // in the file would pick up an EXIF thumbnail and give the wrong aspect.
  let offset = 2;
  while (offset < buf.length - 9) {
    if (buf[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buf[offset + 1];
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
    }
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    const length = buf.readUInt16BE(offset + 2);
    if (length < 2) return null;
    offset += 2 + length;
  }
  return null;
}

function readPng(buf) {
  if (buf.length < 24) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function readWebp(buf) {
  const fourCC = buf.toString('ascii', 12, 16);
  if (fourCC === 'VP8X' && buf.length >= 30) {
    return {
      width: 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16)),
      height: 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16)),
    };
  }
  if (fourCC === 'VP8 ' && buf.length >= 30) {
    return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }
  if (fourCC === 'VP8L' && buf.length >= 25) {
    const bits = buf.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  return null;
}

function dimensionsOf(filePath) {
  // Read only the head of the file. Some source images are several MB and
  // there are well over a thousand of them.
  let fd;
  try {
    fd = openSync(filePath, 'r');
    const head = Buffer.alloc(65536);
    const bytes = readSync(fd, head, 0, 65536, 0);
    const buf = head.subarray(0, bytes);
    if (buf[0] === 0xff && buf[1] === 0xd8) return readJpeg(buf);
    if (buf.toString('ascii', 1, 4) === 'PNG') return readPng(buf);
    if (buf.toString('ascii', 0, 4) === 'RIFF') return readWebp(buf);
    return null;
  } catch {
    return null;
  } finally {
    if (fd !== undefined) closeSync(fd);
  }
}

function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

const portrait = [];
let scanned = 0;
let unreadable = 0;

for (const relDir of SCAN_DIRS) {
  const absDir = path.join(ROOT, 'public', relDir);
  if (!existsSync(absDir)) continue;
  for (const file of walk(absDir)) {
    scanned += 1;
    const size = dimensionsOf(file);
    if (!size || !size.width || !size.height) {
      unreadable += 1;
      continue;
    }
    if (size.height / size.width >= PORTRAIT_RATIO) {
      const webPath = '/' + path.relative(path.join(ROOT, 'public'), file).split(path.sep).join('/');
      portrait.push(webPath);
    }
  }
}

portrait.sort();
mkdirSync(path.dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, JSON.stringify(portrait, null, 0) + '\n', 'utf8');

const previous = existsSync(OUT_FILE) ? portrait.length : 0;
console.log(
  `[image-dimensions] scanned ${scanned} images, ${portrait.length} portrait, ` +
    `${unreadable} unreadable -> ${path.relative(ROOT, OUT_FILE)} ` +
    `(${(readFileSync(OUT_FILE).length / 1024).toFixed(1)} KB)`
);
if (unreadable > 0) {
  console.log(`[image-dimensions] ${unreadable} file(s) had no parsable header and are treated as landscape.`);
}
void previous;
