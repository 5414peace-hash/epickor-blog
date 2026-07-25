#!/usr/bin/env node
/**
 * Audit cross-post image reuse for blog/business posts.
 *
 * Card-news carousels already have a "no repeated image across posts" rule and a
 * reviewer check (see CLAUDE.md). Blog/business post images never had an equivalent
 * check, which is how Pexels photo 31925324 ended up as the hero image of three
 * separate posts (192, 239, 318) before anyone noticed (2026-07-25 incident).
 *
 * This script parses every `public/assets/images/**\/image-sources.md` file, pulls out
 * the source photo ID from each Pexels/Unsplash/etc. URL, and flags any ID that shows
 * up in more than one post folder. It does NOT do perceptual/byte-hash comparison
 * (that already exists elsewhere and provably misses same-source-different-compression
 * cases) - it keys off the documented source URL, which is the only reliable identity
 * for "did we already use this exact photo."
 *
 * Usage:
 *   node scripts/audit-image-uniqueness.mjs                 # full site scan
 *   node scripts/audit-image-uniqueness.mjs --slug 318       # only report groups touching this slug
 *   node scripts/audit-image-uniqueness.mjs --check-id 31925334   # is this ID already used anywhere?
 *
 * Exit code 1 if any duplicate group is found (slug-scoped runs only fail on groups
 * that include the target slug), so this can gate a publish step the same way
 * audit:image-refs and audit:amazon-links do.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const IMAGES_DIR = path.join(ROOT, "public", "assets", "images");

const args = new Map();
for (let i = 0; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith("--")) args.set(a.slice(2), process.argv[i + 1]);
}
const slugFilter = args.get("slug") || null;
const checkId = args.get("check-id") || null;

function findImageSourceFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...findImageSourceFiles(full));
    } else if (entry.isFile() && entry.name.toLowerCase() === "image-sources.md") {
      out.push(full);
    }
  }
  return out;
}

function slugFromPath(file) {
  // public/assets/images/posts/{slug}/image-sources.md
  // public/assets/images/business/{slug}/image-sources.md
  const rel = path.relative(IMAGES_DIR, file).split(path.sep);
  return rel.length >= 2 ? `${rel[0]}/${rel[1]}` : rel[0];
}

// Matches Pexels/Unsplash/Pixabay-style numeric photo IDs embedded in a URL. Two shapes
// both occur in this codebase's image-sources.md files:
//   .../photos/31925324/pexels-photo-31925324.jpeg
//   https://www.pexels.com/photo/31925324/
//   https://www.pexels.com/photo/outdoor-shop-in-seoul-bustling-...-29562546/  (slugified,
//     id is a TRAILING number after the descriptive slug, not right after "photo/")
const ID_RE_PREFIX = /photo[s]?[/_-]?(\d{5,})/gi;
const ID_RE_TRAILING = /-(\d{5,})\/?(?=["'`)\s]|$)/g;

function extractIds(content) {
  const ids = new Set();
  for (const m of content.matchAll(ID_RE_PREFIX)) ids.add(m[1]);
  for (const m of content.matchAll(ID_RE_TRAILING)) ids.add(m[1]);
  return ids;
}

const files = findImageSourceFiles(IMAGES_DIR);
const idToSlugs = new Map();

for (const file of files) {
  const slug = slugFromPath(file);
  const content = fs.readFileSync(file, "utf8");
  for (const id of extractIds(content)) {
    if (!idToSlugs.has(id)) idToSlugs.set(id, new Set());
    idToSlugs.get(id).add(slug);
  }
}

if (checkId) {
  const slugs = idToSlugs.get(checkId);
  if (slugs && slugs.size) {
    console.log(`Photo ID ${checkId} is ALREADY USED by: ${[...slugs].join(", ")}`);
    console.log("Pick a different source photo.");
    process.exit(1);
  }
  console.log(`Photo ID ${checkId} is not used anywhere on the site yet. Safe to use.`);
  process.exit(0);
}

const dupGroups = [...idToSlugs.entries()].filter(([, slugs]) => slugs.size > 1);

console.log(`Scanned ${files.length} image-sources.md files, ${idToSlugs.size} unique source photo IDs.`);
console.log(`Cross-post duplicate photo IDs: ${dupGroups.length}`);

let relevantDups = dupGroups;
if (slugFilter) {
  relevantDups = dupGroups.filter(([, slugs]) => [...slugs].some((s) => s.endsWith(`/${slugFilter}`) || s === slugFilter));
  console.log(`Duplicate groups touching slug "${slugFilter}": ${relevantDups.length}`);
}

for (const [id, slugs] of dupGroups) {
  console.log(`  - photo ${id}: ${[...slugs].sort().join(", ")}`);
}

if (relevantDups.length > 0) {
  console.log("\nFAIL: cross-post image duplication found.");
  process.exit(1);
}

console.log("\nPASS: no cross-post image duplication" + (slugFilter ? ` involving ${slugFilter}` : "") + ".");
