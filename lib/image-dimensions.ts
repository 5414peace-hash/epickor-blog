import { readFileSync, existsSync } from 'fs';
import path from 'path';

/**
 * Synchronous intrinsic-dimension reader for local images under `public/`.
 *
 * Why this exists: layout decisions depend on whether an image is portrait.
 * A 1080x1920 Reels thumbnail and a 1400x900 photograph cannot use the same
 * rules — a portrait image at full column width becomes taller than the phone
 * screen, and in the hero it gets cropped through the middle of its headline.
 * CSS has no aspect-ratio selector, so orientation has to be resolved while
 * the HTML is being built.
 *
 * Why not sharp: the markdown pipeline (`processImages`) is synchronous and is
 * called from `getBlogPost`. Making it async would ripple through blog.ts and
 * business.ts. Reading the header bytes ourselves is a few dozen lines and
 * needs no new dependency.
 *
 * Only the header is parsed, and results are cached for the process, so a full
 * site build reads each file once.
 */

export interface ImageDimensions {
  width: number;
  height: number;
}

const cache = new Map<string, ImageDimensions | null>();

function readJpeg(buf: Buffer): ImageDimensions | null {
  // Walk the marker chain looking for a Start Of Frame segment, which is
  // where the real dimensions live. EXIF thumbnails earlier in the file would
  // give the wrong answer, so we must not just grab the first size we see.
  let offset = 2;
  while (offset < buf.length - 9) {
    if (buf[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buf[offset + 1];
    // SOF0-SOF15, excluding DHT (c4), JPG (c8) and DAC (cc)
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
    }
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    offset += 2 + buf.readUInt16BE(offset + 2);
  }
  return null;
}

function readPng(buf: Buffer): ImageDimensions | null {
  // IHDR is always the first chunk, at a fixed offset.
  if (buf.length < 24) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function readWebp(buf: Buffer): ImageDimensions | null {
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

/**
 * Resolve the intrinsic size of a site-relative image path such as
 * `/assets/images/posts/082/082_frame_5.jpg`. Returns null for remote URLs,
 * SVGs, unreadable files, and anything whose header we cannot parse — callers
 * must treat null as "unknown" and fall back to their neutral layout.
 */
export function getImageDimensions(srcPath: string): ImageDimensions | null {
  if (!srcPath || !srcPath.startsWith('/')) return null;
  if (cache.has(srcPath)) return cache.get(srcPath) ?? null;

  let result: ImageDimensions | null = null;
  // Post filenames are sometimes percent-encoded in markdown but stored decoded
  // on disk (and occasionally the reverse), so try both spellings.
  const candidates = [srcPath];
  try {
    const decoded = decodeURIComponent(srcPath);
    if (decoded !== srcPath) candidates.push(decoded);
  } catch {
    // Malformed escape sequence — the raw path is the only candidate we have.
  }

  for (const candidate of candidates) {
    const filePath = path.join(process.cwd(), 'public', candidate);
    if (!existsSync(filePath)) continue;
    try {
      const fd = readFileSync(filePath);
      const head = fd.subarray(0, Math.min(fd.length, 65536));
      if (head[0] === 0xff && head[1] === 0xd8) result = readJpeg(head);
      else if (head.toString('ascii', 1, 4) === 'PNG') result = readPng(head);
      else if (head.toString('ascii', 0, 4) === 'RIFF') result = readWebp(head);
    } catch {
      result = null;
    }
    if (result) break;
  }

  cache.set(srcPath, result);
  return result;
}

/**
 * True when an image is meaningfully taller than it is wide. The 1.2 threshold
 * keeps near-square photographs out of the portrait branch — those look fine
 * under the normal rules, and only genuinely tall images (4:5 and beyond,
 * including every 9:16 Reels frame) need the constrained treatment.
 */
export function isPortraitImage(srcPath: string): boolean {
  const dimensions = getImageDimensions(srcPath);
  if (!dimensions || !dimensions.width) return false;
  return dimensions.height / dimensions.width >= 1.2;
}
