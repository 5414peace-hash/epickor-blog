import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('..', import.meta.url)));
const CONTENT_DIRS = ['content/blog', 'content/business'];
const CATALOG_PATH = 'content/data/amazon-links.json';
const APPROVED_TAGS = new Set([
  'epickor2026-20',
  'epickor-food-20',
  'epickor-travel-20',
  'epickor-beauty-20',
  'epickor-books-20',
  'epickor-gear-20',
]);
const TEXT_EXTENSIONS = new Set(['.md', '.mdx', '.json']);
const AMAZON_URL_RE = /https:\/\/(?:www\.)?(?:amazon\.com|amzn\.to)[^\s"'<>\)\]]+/gi;

function walk(directory) {
  const absolute = join(ROOT, directory);

  try {
    return readdirSync(absolute).flatMap((name) => {
      const path = join(absolute, name);
      return statSync(path).isDirectory() ? walk(join(directory, name)) : [path];
    });
  } catch (error) {
    if (error?.code === 'ENOENT') return [];
    throw error;
  }
}

function findAmazonUrls(path) {
  const text = readFileSync(path, 'utf8');
  return [...text.matchAll(AMAZON_URL_RE)].map((match) => ({
    raw: match[0],
    url: match[0].replaceAll('&amp;', '&'),
  }));
}

const files = [
  ...CONTENT_DIRS.flatMap(walk),
  join(ROOT, CATALOG_PATH),
].filter((path) => TEXT_EXTENSIONS.has(extname(path).toLowerCase()));

const issues = [];
const counts = { amazon: 0, short: 0, tagged: 0 };

for (const path of files) {
  for (const candidate of findAmazonUrls(path)) {
    let url;

    try {
      url = new URL(candidate.url);
    } catch {
      issues.push({ path, url: candidate.raw, reason: 'invalid URL' });
      continue;
    }

    const host = url.hostname.toLowerCase();
    if (host === 'amzn.to') {
      counts.short += 1;
      continue;
    }

    counts.amazon += 1;
    const tags = url.searchParams.getAll('tag');

    if (tags.length !== 1) {
      issues.push({ path, url: candidate.url, reason: `expected one tag parameter, found ${tags.length}` });
      continue;
    }

    if (!APPROVED_TAGS.has(tags[0])) {
      issues.push({ path, url: candidate.url, reason: `unapproved tag: ${tags[0]}` });
      continue;
    }

    counts.tagged += 1;
  }
}

console.log(`Amazon link audit: ${counts.tagged} tagged amazon.com URLs, ${counts.short} amzn.to URLs`);

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(`- ${relative(ROOT, issue.path)}: ${issue.reason}\n  ${issue.url}`);
  }
  process.exitCode = 1;
} else {
  console.log('PASS: every direct Amazon URL uses exactly one approved tracking tag.');
}
