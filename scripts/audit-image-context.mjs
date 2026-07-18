#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const args = process.argv.slice(2);
const INCLUDE_PRIVATE = args.includes("--include-private");
const slugIndex = args.indexOf("--slug");
const ONLY_SLUG = slugIndex >= 0 ? args[slugIndex + 1] : "";
const CONTENT_GROUPS = [
  { type: "blog", dir: path.join(ROOT, "content", "blog"), assetRoot: "posts" },
  { type: "business", dir: path.join(ROOT, "content", "business"), assetRoot: "business" },
];

const IMAGE_RE = /!\[([^\]]*)]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/g;
const IMAGE_EXT_RE = /\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i;
const DEFENSIVE_PATTERNS = [
  /not (?:a|the) (?:specific|actual|real|verified|official)\b/i,
  /general (?:[^.]{0,35} )?(?:image|photo|scene|studio)\b/i,
  /category illustration/i,
  /included to show/i,
  /without implying/i,
  /not presented as/i,
  /not (?:labelled|labeled) as/i,
  /not a verified/i,
  /not an official/i,
  /not from (?:the|this|a)\b/i,
  /similar to (?:the|a|what)\b/i,
  /(?:visual )?stand-in/i,
  /stock (?:photo|image)/i,
  /shows? the (?:kind|type) of/i,
  /illustrative (?:scene|image|visual)/i,
  /generated (?:scene|image|visual)/i,
  /support visual/i,
  /editorial illustration/i,
];
const GENERIC_ALT_PATTERNS = [
  /similar to/i,
  /represents?\b/i,
  /illustrates?\b/i,
  /shows? the (?:kind|type)\b/i,
  /stand-in/i,
  /stock-market charts/i,
  /close-up circuit board/i,
];

function normalizeSlug(data, file) {
  return String(data.slug || file.replace(/\.md$/i, ""));
}

function cleanUrl(url) {
  return String(url || "").trim().replace(/^['"]|['"]$/g, "").split(/[?#]/)[0];
}

function resolveAsset(type, assetRoot, slug, url) {
  const cleaned = cleanUrl(url);
  if (!cleaned || /^https?:\/\//i.test(cleaned) || cleaned.startsWith("data:")) return null;
  let relative;
  if (cleaned.startsWith("/")) relative = cleaned.replace(/^\/+/, "");
  else relative = path.posix.join("assets", "images", assetRoot, slug, cleaned);
  const filePath = path.join(PUBLIC_DIR, ...relative.split("/"));
  return { publicPath: `/${relative}`, filePath };
}

function captionAfter(content, endIndex) {
  const tail = content.slice(endIndex);
  const match = tail.match(/^\s*\r?\n\s*\*([^\n]+)\*/);
  return match ? match[1].trim() : "";
}

function matchingPatterns(text, patterns) {
  return patterns.filter((pattern) => pattern.test(text)).map((pattern) => pattern.source);
}

const posts = [];
const findings = [];

for (const group of CONTENT_GROUPS) {
  if (!fs.existsSync(group.dir)) continue;
  for (const file of fs.readdirSync(group.dir).filter((name) => name.endsWith(".md")).sort()) {
    const contentPath = path.join(group.dir, file);
    const source = fs.readFileSync(contentPath, "utf8");
    const parsed = matter(source);
    if (!INCLUDE_PRIVATE && parsed.data.visibility === "private") continue;
    const slug = normalizeSlug(parsed.data, file);
    if (ONLY_SLUG && slug !== ONLY_SLUG) continue;
    const title = String(parsed.data.title || slug);
    const images = [];

    if (parsed.data.ogImage) {
      const resolved = resolveAsset(group.type, group.assetRoot, slug, parsed.data.ogImage);
      images.push({ kind: "ogImage", alt: title, url: String(parsed.data.ogImage), caption: "", resolved });
    }

    for (const match of parsed.content.matchAll(IMAGE_RE)) {
      const url = match[2];
      if (!IMAGE_EXT_RE.test(cleanUrl(url))) continue;
      images.push({
        kind: "body",
        alt: match[1].trim(),
        url,
        caption: captionAfter(parsed.content, match.index + match[0].length),
        resolved: resolveAsset(group.type, group.assetRoot, slug, url),
      });
    }

    const bodyImages = images.filter((image) => image.kind === "body");
    const uniqueBodyPaths = new Set(bodyImages.map((image) => image.resolved?.publicPath || image.url));
    const sourceRecord = path.join(PUBLIC_DIR, "assets", "images", group.assetRoot, slug, "image-sources.md");
    const postFindings = [];

    if (bodyImages.length === 0) postFindings.push({ severity: "high", code: "NO_BODY_IMAGES", detail: "No body images" });
    if (bodyImages.length > 0 && bodyImages.every((image) => /\.svg$/i.test(cleanUrl(image.url)))) {
      postFindings.push({ severity: "critical", code: "SVG_ONLY", detail: `${bodyImages.length} body images are all SVG` });
    }
    if (bodyImages.some((image) => /\.svg$/i.test(cleanUrl(image.url)))) {
      postFindings.push({ severity: "info", code: "SVG_BODY_IMAGE", detail: `${bodyImages.filter((image) => /\.svg$/i.test(cleanUrl(image.url))).length} SVG body image(s); mixed-media use requires manual relevance review` });
    }
    if (bodyImages.length >= 2 && uniqueBodyPaths.size < bodyImages.length) {
      postFindings.push({ severity: "medium", code: "DUPLICATE_BODY_IMAGE", detail: `${bodyImages.length - uniqueBodyPaths.size} repeated body reference(s)` });
    }
    if (bodyImages.length > 0 && !fs.existsSync(sourceRecord)) {
      postFindings.push({ severity: "info", code: "MISSING_SOURCE_RECORD", detail: path.relative(ROOT, sourceRecord) });
    }

    for (const image of images) {
      const combined = `${image.alt}\n${image.caption}`;
      const defensive = matchingPatterns(combined, DEFENSIVE_PATTERNS);
      if (defensive.length) {
        postFindings.push({
          severity: "critical",
          code: "DEFENSIVE_OR_PROXY_COPY",
          detail: `${image.kind}: ${image.caption || image.alt}`,
          image: image.resolved?.publicPath || image.url,
        });
      }
      const genericAlt = matchingPatterns(image.alt, GENERIC_ALT_PATTERNS);
      if (image.kind === "body" && genericAlt.length && !defensive.length) {
        postFindings.push({ severity: "medium", code: "GENERIC_ALT_RISK", detail: image.alt, image: image.resolved?.publicPath || image.url });
      }
      if (/\b(?:generated|editorial illustration|illustrative image|illustrative scene|generated visual|support visual)\b/i.test(`${image.url} ${combined}`)) {
        postFindings.push({ severity: "medium", code: "GRAPHIC_OR_GENERATED_RISK", detail: image.caption || image.alt, image: image.resolved?.publicPath || image.url });
      }
      if (image.resolved && !fs.existsSync(image.resolved.filePath)) {
        postFindings.push({ severity: "critical", code: "MISSING_ASSET", detail: image.resolved.publicPath, image: image.resolved.publicPath });
      }
    }

    for (const finding of postFindings) findings.push({ type: group.type, slug, title, ...finding });
    posts.push({
      type: group.type,
      slug,
      title,
      contentPath: path.relative(ROOT, contentPath),
      sourceRecord: fs.existsSync(sourceRecord) ? path.relative(ROOT, sourceRecord) : "",
      imageCount: bodyImages.length,
      images: bodyImages.map((image) => ({
        url: image.resolved?.publicPath || image.url,
        alt: image.alt,
        caption: image.caption,
        ext: path.extname(cleanUrl(image.url)).toLowerCase(),
        exists: image.resolved ? fs.existsSync(image.resolved.filePath) : null,
      })),
      findings: postFindings,
    });
  }
}

const rank = { critical: 0, high: 1, medium: 2, info: 3 };
findings.sort((a, b) => rank[a.severity] - rank[b.severity] || a.type.localeCompare(b.type) || a.slug.localeCompare(b.slug));

const summary = {
  generatedAt: new Date().toISOString(),
  auditedPosts: posts.length,
  includedPrivate: INCLUDE_PRIVATE,
  slugFilter: ONLY_SLUG,
  bodyImages: posts.reduce((sum, post) => sum + post.imageCount, 0),
  affectedPosts: new Set(findings.map((finding) => `${finding.type}:${finding.slug}`)).size,
  critical: findings.filter((finding) => finding.severity === "critical").length,
  high: findings.filter((finding) => finding.severity === "high").length,
  medium: findings.filter((finding) => finding.severity === "medium").length,
  info: findings.filter((finding) => finding.severity === "info").length,
};

const report = { summary, findings, posts };
const reportPath = path.join(ROOT, "reports", "image-context-audit.json");
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

console.log("Public article image-context audit");
console.log(`Audited posts: ${summary.auditedPosts}`);
console.log(`Body images: ${summary.bodyImages}`);
console.log(`Affected posts: ${summary.affectedPosts}`);
console.log(`Critical findings: ${summary.critical}`);
console.log(`High findings: ${summary.high}`);
console.log(`Medium findings: ${summary.medium}`);
console.log(`Informational findings: ${summary.info}`);
console.log(`Report: ${path.relative(ROOT, reportPath)}`);

for (const finding of findings) {
  console.log(`${finding.severity.toUpperCase().padEnd(8)} ${finding.type}/${finding.slug} ${finding.code}: ${finding.detail}`);
}

if (findings.some((finding) => finding.severity === "critical" || finding.severity === "high")) process.exitCode = 1;
