import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const ROOT = process.cwd();
const BLOG_DIR = path.join(ROOT, 'content', 'blog');
const SURFACE_PATH = path.join(ROOT, 'content', 'data', 'editorial-surface.json');
const REPORT_PATH = path.join(ROOT, 'reports', 'editorial-surface-review.md');

const args = process.argv.slice(2);
const shouldWrite = args.includes('--write');
const dateArg = args.find((arg) => arg.startsWith('--date='));
const today = dateArg ? new Date(`${dateArg.split('=')[1]}T00:00:00`) : new Date();

const surfaceKeywords = {
  travel: [
    'airport',
    'arex',
    'busan',
    'gyeongju',
    'hangang',
    'incheon',
    'jeju',
    'koreatravel',
    'seoultravel',
    'travel',
    'trip',
  ],
  'food-shopping': [
    'bakery',
    'blindbox',
    'cafe',
    'character',
    'convenience',
    'food',
    'grocery',
    'koreanfood',
    'koreashopping',
    'pantry',
    'seoulshopping',
    'snack',
    'store',
  ],
  'beauty-lifestyle': [
    'beauty',
    'beautyshopping',
    'k-beauty',
    'kbeauty',
    'koreanskincare',
    'oliveyoung',
    'skincare',
    'spf',
    'sunscreen',
  ],
  culture: [
    'culture',
    'education',
    'etiquette',
    'koreanculture',
    'koreanlanguage',
    'koreansociety',
    'language',
    'social',
  ],
};

function parseDate(value) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function daysBetween(a, b) {
  const dayMs = 24 * 60 * 60 * 1000;
  return Math.floor((a.setHours(0, 0, 0, 0) - b.setHours(0, 0, 0, 0)) / dayMs);
}

function normalize(value) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function isVisible(frontmatter) {
  const visibility = String(frontmatter.visibility || 'public').toLowerCase();
  if (visibility === 'private') return false;

  if (frontmatter.publishAt) {
    const publishAt = parseDate(frontmatter.publishAt);
    if (publishAt && publishAt.getTime() > today.getTime()) return false;
  }

  return true;
}

function readPosts() {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const fullPath = path.join(BLOG_DIR, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const parsed = matter(fileContents);
      const frontmatter = parsed.data || {};
      if (!isVisible(frontmatter)) return null;

      return {
        slug: String(frontmatter.slug || fileName.replace(/\.md$/, '')),
        title: String(frontmatter.title || ''),
        description: String(frontmatter.description || ''),
        date: String(frontmatter.date || ''),
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags.map(String) : [],
        ogImage: String(frontmatter.ogImage || ''),
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const aDate = parseDate(a.date)?.getTime() || 0;
      const bDate = parseDate(b.date)?.getTime() || 0;
      return bDate - aDate;
    });
}

function matchesSurface(post, surfaceKey) {
  if (surfaceKey === 'home') return true;
  const haystack = normalize([post.title, ...post.tags].join(' '));
  return (surfaceKeywords[surfaceKey] || []).some((keyword) => haystack.includes(normalize(keyword)));
}

function scorePost(post, surfaceKey) {
  const haystack = normalize([post.title, post.description, ...post.tags].join(' '));
  const postDate = parseDate(post.date);
  const age = postDate ? daysBetween(new Date(today), new Date(postDate)) : 999;

  const searchOpportunity = Math.min(
    25,
    8 +
      (/\bguide\b|\bbest\b|\bhow\b|\bwhat\b|\bwhere\b/.test(haystack) ? 8 : 0) +
      (post.description.length >= 120 ? 4 : 0) +
      Math.min(post.tags.length, 5)
  );

  const seasonWords = ['summer', 'july', 'august', 'festival', 'rain', 'packing', 'airport', 'travel'];
  const seasonality = Math.min(
    20,
    (age <= 14 ? 8 : age <= 45 ? 5 : 2) +
      seasonWords.reduce((score, word) => score + (haystack.includes(word) ? 2 : 0), 0)
  );

  const moneyWords = [
    'amazon',
    'beauty',
    'buy',
    'device',
    'gift',
    'grocery',
    'oliveyoung',
    'pantry',
    'shopping',
    'skincare',
    'snack',
    'sunscreen',
  ];
  const monetizationOrBusinessValue = Math.min(
    20,
    5 + moneyWords.reduce((score, word) => score + (haystack.includes(word) ? 2 : 0), 0)
  );

  const visualAndSocialPotential = Math.min(
    15,
    (post.ogImage ? 8 : 0) +
      (/\bseoul\b|\bkorea\b|\bfood\b|\bbeauty\b|\bshopping\b|\bairport\b|\bhangang\b/.test(haystack) ? 5 : 2)
  );

  const freshnessAndAccuracy = age <= 14 ? 10 : age <= 45 ? 7 : age <= 120 ? 5 : 3;
  const sectionDiversity = matchesSurface(post, surfaceKey) ? 10 : surfaceKey === 'home' ? 8 : 0;

  return {
    total:
      searchOpportunity +
      seasonality +
      monetizationOrBusinessValue +
      visualAndSocialPotential +
      freshnessAndAccuracy +
      sectionDiversity,
    searchOpportunity,
    seasonality,
    monetizationOrBusinessValue,
    visualAndSocialPotential,
    freshnessAndAccuracy,
    sectionDiversity,
  };
}

function slotSlugs(slots) {
  return (slots || []).map((slot) => slot.slug).filter(Boolean);
}

function currentHeroSlug(surfaceConfig) {
  return surfaceConfig?.hero?.slug || '';
}

function getNewCandidates(posts, surfaceKey, windowDays = 7) {
  return posts
    .filter((post) => {
      const postDate = parseDate(post.date);
      if (!postDate) return false;
      const age = daysBetween(new Date(today), postDate);
      return age >= 0 && age <= windowDays && matchesSurface(post, surfaceKey);
    })
    .map((post) => ({
      post,
      score: scorePost(post, surfaceKey),
    }))
    .sort((a, b) => b.score.total - a.score.total);
}

function getPinnedSlugs(surfaceConfig) {
  return [
    surfaceConfig.hero?.slug,
    ...slotSlugs(surfaceConfig.secondary),
    ...slotSlugs(surfaceConfig.popular),
    ...slotSlugs(surfaceConfig.plan),
    ...slotSlugs(surfaceConfig.reels),
    ...slotSlugs(surfaceConfig.startHere),
    ...slotSlugs(surfaceConfig.recommended),
  ].filter(Boolean);
}

function buildSurfaceReview(surfaceKey, surfaceConfig, posts) {
  const dueDate = parseDate(surfaceConfig.nextReviewDate);
  const isDue = dueDate ? dueDate.getTime() <= today.setHours(0, 0, 0, 0) : false;
  const heroSlug = currentHeroSlug(surfaceConfig);
  const heroPost = posts.find((post) => post.slug === heroSlug);
  const heroScore = heroPost ? scorePost(heroPost, surfaceKey) : null;
  const newCandidates = getNewCandidates(posts, surfaceKey);
  const topCandidate = newCandidates[0];
  const pinned = new Set(getPinnedSlugs(surfaceConfig));
  const unpinnedCandidates = newCandidates.filter(({ post }) => !pinned.has(post.slug));
  const topUnpinned = unpinnedCandidates[0];
  const comparisonCandidate = topUnpinned || topCandidate;

  let recommendation = 'Maintain current hero.';
  if (!heroPost) {
    recommendation = 'Review required: current hero slug is missing.';
  } else if (isDue && comparisonCandidate && comparisonCandidate.score.total >= heroScore.total + 8) {
    recommendation = `Consider replacing hero with ${comparisonCandidate.post.slug}.`;
  } else if (!isDue && comparisonCandidate && comparisonCandidate.score.total >= heroScore.total + 12) {
    recommendation = `Watch candidate ${comparisonCandidate.post.slug}; not due yet.`;
  }

  return {
    surfaceKey,
    reviewCadence: surfaceConfig.reviewCadence,
    nextReviewDate: surfaceConfig.nextReviewDate,
    isDue,
    heroPost,
    heroScore,
    newCandidates: newCandidates.slice(0, 5),
    recommendation,
  };
}

function renderCandidateLine(candidate) {
  return `  - ${candidate.post.slug}: ${candidate.post.title} (${candidate.score.total}/100)`;
}

function renderReport(surfaceData, posts) {
  const home = surfaceData.surfaces.home;
  const categoryKeys = ['travel', 'food-shopping', 'beauty-lifestyle', 'culture'];
  const surfaceReviews = [
    buildSurfaceReview('home', home, posts),
    ...categoryKeys.map((key) => buildSurfaceReview(key, surfaceData.surfaces[key], posts)),
  ];

  const lines = [
    '# EpicKor Editorial Surface Review',
    '',
    `Generated: ${formatDate(today)}`,
    `Selection mode: ${surfaceData.selectionMode}`,
    `Randomization: ${surfaceData.randomization}`,
    '',
    '## Policy',
    '',
    `- Home cadence: ${surfaceData.reviewPolicy.homeCadence} (${surfaceData.reviewPolicy.homeReviewDay})`,
    `- Category cadence: ${surfaceData.reviewPolicy.categoryCadence} (${surfaceData.reviewPolicy.categoryReviewDay})`,
    `- Automatic sections: ${surfaceData.reviewPolicy.automaticSections.join(', ')}`,
    `- Manual sections: ${surfaceData.reviewPolicy.manualSections.join(', ')}`,
    '',
    '## Surface Checks',
    '',
  ];

  for (const review of surfaceReviews) {
    lines.push(`### ${review.surfaceKey}`);
    lines.push('');
    lines.push(`- Due now: ${review.isDue ? 'yes' : 'no'}`);
    lines.push(`- Next review date: ${review.nextReviewDate}`);
    lines.push(`- Cadence: ${review.reviewCadence}`);
    lines.push(
      `- Current hero: ${
        review.heroPost ? `${review.heroPost.slug} - ${review.heroPost.title}` : 'missing'
      }`
    );
    lines.push(`- Current hero score: ${review.heroScore ? `${review.heroScore.total}/100` : 'n/a'}`);
    lines.push(`- Recommendation: ${review.recommendation}`);
    lines.push('- New 7-day candidates:');
    if (review.newCandidates.length === 0) {
      lines.push('  - None found for this surface.');
    } else {
      lines.push(...review.newCandidates.map(renderCandidateLine));
    }
    lines.push('');
  }

  return `${lines.join('\n')}\n`;
}

const surfaceData = JSON.parse(fs.readFileSync(SURFACE_PATH, 'utf8'));
const posts = readPosts();
const report = renderReport(surfaceData, posts);

if (shouldWrite) {
  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, report, 'utf8');
}

process.stdout.write(report);
