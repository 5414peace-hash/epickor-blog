import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const REPORTS_DIR = path.join(process.cwd(), 'reports');
const MARKDOWN_REPORT_PATH = path.join(REPORTS_DIR, 'seo-aeo-audit.md');

const DEFAULT_TARGETS = {
  titleMin: 45,
  titleMax: 65,
  descriptionMin: 110,
  descriptionMax: 160,
  minWords: 700,
  minTags: 3,
  minH2: 3,
  staleDays: 180,
};

const targets = loadTargets();
const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.md')).sort();

function loadTargets() {
  const configPath = path.join(process.cwd(), 'content', 'data', 'seo-aeo-targets.json');
  if (!fs.existsSync(configPath)) {
    return DEFAULT_TARGETS;
  }

  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    return { ...DEFAULT_TARGETS, ...config };
  } catch (error) {
    console.warn('[seo-aeo-audit] Failed to parse custom targets, using defaults.', error);
    return DEFAULT_TARGETS;
  }
}

function countWords(text) {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;
}

function countHeadings(markdown, level) {
  const regex = new RegExp(`^${'#'.repeat(level)}\\s+`, 'gm');
  return (markdown.match(regex) || []).length;
}

function countInternalLinks(markdown) {
  const links = markdown.match(/\[[^\]]+\]\(([^)]+)\)/g) || [];
  return links.filter((link) => link.includes('/blog/') || link.includes('/category/')).length;
}

function countAffiliateLinks(markdown) {
  const links = markdown.match(/\[[^\]]+\]\(([^)]+)\)/g) || [];
  return links.filter((link) => /(amzn\.to|amazon\.)/i.test(link)).length;
}

function detectFaq(markdown) {
  return /(^|\n)#{2,3}\s*(faq|frequently asked questions|q&a|questions|자주 묻는 질문)/im.test(markdown);
}

function detectDisclosure(markdown) {
  return /(amazon associate|affiliate|qualifying purchases|as an amazon associate|제휴|수수료)/i.test(markdown);
}

function scorePost(metrics) {
  let score = 100;

  if (metrics.titleLength < targets.titleMin || metrics.titleLength > targets.titleMax) score -= 10;
  if (metrics.descriptionLength < targets.descriptionMin || metrics.descriptionLength > targets.descriptionMax) score -= 10;
  if (metrics.words < targets.minWords) score -= Math.min(25, Math.ceil((targets.minWords - metrics.words) / 40));
  if (metrics.tagsCount < targets.minTags) score -= (targets.minTags - metrics.tagsCount) * 5;
  if (metrics.h2Count < targets.minH2) score -= (targets.minH2 - metrics.h2Count) * 6;
  if (!metrics.hasFaq) score -= 12;
  if (!metrics.hasDisclosure && metrics.affiliateLinks > 0) score -= 8;
  if (metrics.internalLinks < 2) score -= 8;

  return Math.max(0, score);
}

function classifyPriority(score) {
  if (score < 45) return 'critical';
  if (score < 65) return 'high';
  if (score < 80) return 'medium';
  return 'low';
}

const now = new Date();

const results = files.map((file) => {
  const fullPath = path.join(BLOG_DIR, file);
  const source = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(source);

  const slug = String(data.slug || file.replace(/\.md$/, ''));
  const title = String(data.title || '');
  const description = String(data.description || '');
  const tags = Array.isArray(data.tags) ? data.tags : [];
  const date = data.date ? new Date(data.date) : null;

  const metrics = {
    titleLength: title.length,
    descriptionLength: description.length,
    words: countWords(content),
    tagsCount: tags.length,
    h2Count: countHeadings(content, 2),
    h3Count: countHeadings(content, 3),
    internalLinks: countInternalLinks(content),
    affiliateLinks: countAffiliateLinks(content),
    hasFaq: detectFaq(content),
    hasDisclosure: detectDisclosure(content),
  };

  const issues = [];
  if (!title) issues.push('missing-title');
  if (!description) issues.push('missing-description');
  if (!data.date) issues.push('missing-date');
  if (!Array.isArray(data.tags) || tags.length === 0) issues.push('missing-tags');
  if (title && (metrics.titleLength < targets.titleMin || metrics.titleLength > targets.titleMax)) issues.push('title-length-out-of-range');
  if (description && (metrics.descriptionLength < targets.descriptionMin || metrics.descriptionLength > targets.descriptionMax)) issues.push('description-length-out-of-range');
  if (metrics.words < targets.minWords) issues.push('thin-content');
  if (metrics.tagsCount < targets.minTags) issues.push('low-tag-depth');
  if (metrics.h2Count < targets.minH2) issues.push('low-heading-depth');
  if (!metrics.hasFaq) issues.push('missing-faq-section');
  if (!metrics.hasDisclosure && metrics.affiliateLinks > 0) issues.push('missing-affiliate-disclosure-in-post');
  if (metrics.internalLinks < 2) issues.push('low-internal-linking');

  const ageDays = date ? Math.floor((now - date) / (1000 * 60 * 60 * 24)) : null;
  if (ageDays !== null && ageDays > targets.staleDays) {
    issues.push('stale-content');
  }

  const seoAeoScore = scorePost(metrics);

  return {
    file,
    slug,
    url: `/blog/${slug}`,
    date: date ? date.toISOString().slice(0, 10) : null,
    ageDays,
    metrics,
    seoAeoScore,
    priority: classifyPriority(seoAeoScore),
    issues,
  };
});

const issueCounts = Object.fromEntries(
  [...results.flatMap((result) => result.issues)]
    .reduce((map, issue) => map.set(issue, (map.get(issue) || 0) + 1), new Map())
    .entries()
);

const summary = {
  generatedAt: new Date().toISOString(),
  totalPosts: results.length,
  averageScore: Math.round(results.reduce((sum, item) => sum + item.seoAeoScore, 0) / Math.max(results.length, 1)),
  averageWords: Math.round(results.reduce((sum, item) => sum + item.metrics.words, 0) / Math.max(results.length, 1)),
  averageTitleLength: Math.round(results.reduce((sum, item) => sum + item.metrics.titleLength, 0) / Math.max(results.length, 1)),
  averageDescriptionLength: Math.round(results.reduce((sum, item) => sum + item.metrics.descriptionLength, 0) / Math.max(results.length, 1)),
  stalePosts: results.filter((item) => item.issues.includes('stale-content')).length,
  priorityBreakdown: {
    critical: results.filter((item) => item.priority === 'critical').length,
    high: results.filter((item) => item.priority === 'high').length,
    medium: results.filter((item) => item.priority === 'medium').length,
    low: results.filter((item) => item.priority === 'low').length,
  },
  issueCounts,
};

const topRiskPosts = [...results]
  .sort((a, b) => a.seoAeoScore - b.seoAeoScore)
  .slice(0, 25);

const markdown = `# SEO + AEO Content Audit\n\nGenerated: ${summary.generatedAt}\n\n## Overall Snapshot\n- Total posts: ${summary.totalPosts}\n- Average SEO/AEO score: ${summary.averageScore}/100\n- Average word count: ${summary.averageWords}\n- Average title length: ${summary.averageTitleLength}\n- Average description length: ${summary.averageDescriptionLength}\n- Stale posts (>${targets.staleDays} days): ${summary.stalePosts}\n\n## Priority Breakdown\n- Critical: ${summary.priorityBreakdown.critical}\n- High: ${summary.priorityBreakdown.high}\n- Medium: ${summary.priorityBreakdown.medium}\n- Low: ${summary.priorityBreakdown.low}\n\n## Top Issue Frequency\n${Object.entries(summary.issueCounts)
  .sort((a, b) => b[1] - a[1])
  .map(([issue, count]) => `- ${issue}: ${count} posts (${Math.round((count / summary.totalPosts) * 100)}%)`)
  .join('\n')}\n\n## Rewrite Priority Queue (Top 25)\n| slug | score | priority | words | h2 | internal_links | affiliate_links | issues |\n|---|---:|---|---:|---:|---:|---:|---|\n${topRiskPosts
  .map(
    (item) => `| ${item.slug} | ${item.seoAeoScore} | ${item.priority} | ${item.metrics.words} | ${item.metrics.h2Count} | ${item.metrics.internalLinks} | ${item.metrics.affiliateLinks} | ${item.issues.join(', ')} |`
  )
  .join('\n')}\n\n## Targets\n- Title length: ${targets.titleMin}-${targets.titleMax}\n- Description length: ${targets.descriptionMin}-${targets.descriptionMax}\n- Minimum words: ${targets.minWords}\n- Minimum tags: ${targets.minTags}\n- Minimum H2: ${targets.minH2}\n`;

fs.mkdirSync(REPORTS_DIR, { recursive: true });
fs.writeFileSync(MARKDOWN_REPORT_PATH, markdown, 'utf8');

console.log(`Audit complete: ${MARKDOWN_REPORT_PATH}`);
console.log(`Average score: ${summary.averageScore}/100`);
