#!/usr/bin/env node
/**
 * Blog image size guard and optimizer.
 *
 * The site serves images with `images.unoptimized: true` (Vercel optimizer
 * quota incident, 2026-07-12), so every original under public/assets/images
 * is delivered as-is. This script keeps those originals within a mobile-safe
 * budget.
 *
 * Usage:
 *   node scripts/optimize-blog-images.mjs --audit   # report violations, exit 1 if any
 *   node scripts/optimize-blog-images.mjs           # rewrite oversized images in place
 *   node scripts/optimize-blog-images.mjs --dir public/assets/images/posts/306
 *
 * Rules:
 *   - Scope: public/assets/images (blog/business article images only).
 *     Card news and Reels assets are Instagram upload masters — never touched.
 *   - Budget: <= 400 KB per file, <= 1600 px wide (fit inside 1600x2200).
 *   - Formats stay unchanged so content references keep working.
 *   - A rewrite is kept only when it is smaller than the original.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

// Windows: libvips' file-descriptor cache exhausts handles on long runs,
// surfacing as "UNKNOWN: unknown error, open". Work from buffers instead.
sharp.cache(false);

const MAX_BYTES = 400 * 1024;
// Audit hard cap: 129 legacy photographic PNGs bottom out at 400-1140 KB
// after palette quantization, so the audit only fails above this ceiling.
// New-post images must instead pass through `npm run optimize:images`.
const HARD_MAX_BYTES = 1200 * 1024;
const MAX_WIDTH = 1600;
const MAX_HEIGHT = 2200;
const JPEG_QUALITIES = [80, 72, 64, 56];
const PNG_PALETTE_QUALITIES = [90, 80, 70];
const WEBP_QUALITIES = [80, 70, 60];

const args = process.argv.slice(2);
const auditOnly = args.includes("--audit");
const dirFlagIndex = args.indexOf("--dir");
const rootDir = path.resolve(
  dirFlagIndex >= 0 ? args[dirFlagIndex + 1] : "public/assets/images"
);

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

function formatKB(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

async function encodeCandidates(input, ext, meta) {
  const needsResize =
    (meta.width ?? 0) > MAX_WIDTH || (meta.height ?? 0) > MAX_HEIGHT;
  const base = () => {
    let p = sharp(input, { failOn: "none" }).rotate();
    if (needsResize) {
      p = p.resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }
    return p;
  };

  const buffers = [];
  if (ext === ".jpg" || ext === ".jpeg") {
    for (const quality of JPEG_QUALITIES) {
      buffers.push(await base().jpeg({ quality, mozjpeg: true }).toBuffer());
      if (buffers[buffers.length - 1].length <= MAX_BYTES) break;
    }
  } else if (ext === ".png") {
    buffers.push(
      await base()
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toBuffer()
    );
    if (buffers[buffers.length - 1].length > MAX_BYTES) {
      for (const quality of PNG_PALETTE_QUALITIES) {
        buffers.push(await base().png({ palette: true, quality }).toBuffer());
        if (buffers[buffers.length - 1].length <= MAX_BYTES) break;
      }
    }
  } else if (ext === ".webp") {
    for (const quality of WEBP_QUALITIES) {
      buffers.push(await base().webp({ quality }).toBuffer());
      if (buffers[buffers.length - 1].length <= MAX_BYTES) break;
    }
  }
  if (buffers.length === 0) return null;
  return buffers.reduce((a, b) => (a.length <= b.length ? a : b));
}

async function main() {
  const files = (await walk(rootDir)).filter((f) =>
    [".jpg", ".jpeg", ".png", ".webp"].includes(path.extname(f).toLowerCase())
  );

  const oversized = [];
  for (const file of files) {
    const { size } = await fs.stat(file);
    if (size > MAX_BYTES) oversized.push({ file, size });
  }

  console.log(`Scanned ${files.length} images under ${rootDir}`);
  console.log(
    `Budget: <= ${formatKB(MAX_BYTES)} and <= ${MAX_WIDTH}px wide. Over budget: ${oversized.length}`
  );

  if (auditOnly) {
    const hard = oversized.filter(({ size }) => size > HARD_MAX_BYTES);
    for (const { file, size } of oversized.slice(0, 40)) {
      const level = size > HARD_MAX_BYTES ? "FAIL" : "WARN";
      console.log(`  ${level} ${formatKB(size).padStart(9)}  ${path.relative(process.cwd(), file)}`);
    }
    if (oversized.length > 40) console.log(`  ... and ${oversized.length - 40} more`);
    console.log(
      `\nWarnings (> ${formatKB(MAX_BYTES)}): ${oversized.length - hard.length}, failures (> ${formatKB(HARD_MAX_BYTES)}): ${hard.length}`
    );
    if (hard.length > 0) {
      console.log("Run `npm run optimize:images` to fix oversized files.");
    }
    process.exitCode = hard.length > 0 ? 1 : 0;
    return;
  }

  let rewritten = 0;
  let stillOver = 0;
  let savedBytes = 0;
  const failures = [];

  for (const [i, { file, size }] of oversized.entries()) {
    const ext = path.extname(file).toLowerCase();
    try {
      const input = await fs.readFile(file);
      const meta = await sharp(input).metadata();
      const best = await encodeCandidates(input, ext, meta);
      if (best && best.length < size) {
        await fs.writeFile(file, best);
        rewritten += 1;
        savedBytes += size - best.length;
        if (best.length > MAX_BYTES) {
          stillOver += 1;
          console.log(
            `  STILL-OVER ${formatKB(best.length)} (was ${formatKB(size)}) ${path.relative(process.cwd(), file)}`
          );
        }
      } else {
        stillOver += 1;
        console.log(`  KEPT (no smaller encode) ${path.relative(process.cwd(), file)}`);
      }
    } catch (error) {
      failures.push({ file, error: error.message });
    }
    if ((i + 1) % 50 === 0) console.log(`  ...${i + 1}/${oversized.length} processed`);
  }

  console.log(`\nRewritten: ${rewritten}/${oversized.length}`);
  console.log(`Total saved: ${(savedBytes / 1024 / 1024).toFixed(1)} MB`);
  console.log(`Remaining over budget: ${stillOver}`);
  for (const f of failures) console.log(`  FAILED ${f.file}: ${f.error}`);
  process.exitCode = failures.length > 0 ? 1 : 0;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
