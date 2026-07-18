#!/usr/bin/env node
/**
 * Audit image references used by public blog posts.
 *
 * This is narrower than `audit:image-sizes`: it checks only images that are
 * actually referenced from public Markdown posts or frontmatter `ogImage`.
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const MAX_WARN_BYTES = 400 * 1024;
const MAX_FAIL_BYTES = 1200 * 1024;
const IMAGE_EXT_RE = /\.(avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i;

function formatKB(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

function cleanUrl(url) {
  return String(url || "")
    .trim()
    .replace(/^["']|["']$/g, "")
    .split("#")[0]
    .split("?")[0];
}

function publicPathFromUrl(url) {
  const cleaned = cleanUrl(url);
  if (!cleaned.startsWith("/assets/images/")) return null;
  return cleaned;
}

function extractMarkdownImages(markdown) {
  const refs = [];
  const markdownImageRe = /!\[[^\]]*]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
  for (const match of markdown.matchAll(markdownImageRe)) {
    refs.push({ type: "markdown", url: match[1] });
  }

  const htmlImageRe = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  for (const match of markdown.matchAll(htmlImageRe)) {
    refs.push({ type: "html", url: match[1] });
  }
  return refs;
}

function statPublicAsset(assetPath) {
  const rawRelative = assetPath.replace(/^\/+/, "");
  const rawPath = path.join(PUBLIC_DIR, rawRelative);
  if (fs.existsSync(rawPath)) {
    return { exists: true, filePath: rawPath, matched: "raw", stat: fs.statSync(rawPath) };
  }

  try {
    const decodedRelative = decodeURIComponent(rawRelative);
    const decodedPath = path.join(PUBLIC_DIR, decodedRelative);
    if (fs.existsSync(decodedPath)) {
      return {
        exists: true,
        filePath: decodedPath,
        matched: "decoded",
        stat: fs.statSync(decodedPath),
      };
    }
  } catch {
    // Invalid URI escape; report as missing below.
  }

  return { exists: false, filePath: rawPath, matched: "missing", stat: null };
}

const rows = [];
for (const file of fs.readdirSync(BLOG_DIR).filter((name) => name.endsWith(".md")).sort()) {
  const fullPath = path.join(BLOG_DIR, file);
  const source = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(source);
  if (data.visibility === "private") continue;

  const slug = String(data.slug || file.replace(/\.md$/, ""));
  const refs = [];
  if (data.ogImage) refs.push({ type: "ogImage", url: data.ogImage });
  refs.push(...extractMarkdownImages(content));

  const seen = new Set();
  for (const ref of refs) {
    const assetPath = publicPathFromUrl(ref.url);
    if (!assetPath || !IMAGE_EXT_RE.test(assetPath)) continue;
    const key = `${ref.type}\0${assetPath}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const info = statPublicAsset(assetPath);
    rows.push({
      slug,
      type: ref.type,
      assetPath,
      exists: info.exists,
      matched: info.matched,
      filePath: info.filePath,
      size: info.stat?.size || 0,
      ext: path.extname(assetPath).toLowerCase(),
    });
  }
}

const missing = rows.filter((row) => !row.exists);
const decodedOnly = rows.filter((row) => row.matched === "decoded");
const svg = rows.filter((row) => row.ext === ".svg");
const overWarn = rows.filter((row) => row.exists && row.size > MAX_WARN_BYTES);
const overFail = rows.filter((row) => row.exists && row.size > MAX_FAIL_BYTES);

console.log(`Public blog referenced image audit`);
console.log(`Referenced local images: ${rows.length}`);
console.log(`Missing: ${missing.length}`);
console.log(`Percent-encoded references resolving only after decode: ${decodedOnly.length}`);
console.log(`SVG references: ${svg.length}`);
console.log(`Over ${formatKB(MAX_WARN_BYTES)}: ${overWarn.length}`);
console.log(`Over ${formatKB(MAX_FAIL_BYTES)}: ${overFail.length}`);

function printRows(title, list, limit = 80) {
  if (list.length === 0) return;
  console.log(`\n${title}`);
  for (const row of list.slice(0, limit)) {
    const rel = path.relative(process.cwd(), row.filePath);
    const size = row.exists ? ` ${formatKB(row.size).padStart(8)}` : "";
    console.log(`  ${row.slug.padStart(3)} ${row.type.padEnd(8)}${size} ${row.assetPath} -> ${rel}`);
  }
  if (list.length > limit) console.log(`  ... and ${list.length - limit} more`);
}

printRows("Missing references", missing);
printRows("Decoded-only references", decodedOnly);
printRows(`Referenced images over ${formatKB(MAX_WARN_BYTES)}`, overWarn);
printRows("SVG references", svg);

if (missing.length > 0 || svg.length > 0 || overFail.length > 0) {
  process.exitCode = 1;
}
