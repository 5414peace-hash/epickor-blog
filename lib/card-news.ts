import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getAllBlogPosts, type BlogPostMetadata } from './blog';

const cardNewsDirectory = path.join(process.cwd(), 'public/assets/cardnews');

export interface CardNewsSlide {
  index: number;
  kicker: string;
  main: string;
  sub: string;
  imageLabel: string;
  renderedImage: string;
  sourceImage: string;
}

export interface CardNewsItem {
  folder: string;
  slug: string;
  topic: string;
  date: string;
  dateLabel: string;
  totalCards: number;
  caption: string;
  coverImage: string;
  href: string;
  blogHref: string;
  label: string;
  description: string;
  blogPost?: BlogPostMetadata;
  slides: CardNewsSlide[];
}

function readFileIfExists(filePath: string): string {
  if (!fs.existsSync(filePath)) return '';
  return fs.readFileSync(filePath, 'utf8').trim();
}

function cleanInline(value: string): string {
  return value
    .replace(/\\n/g, ' ')
    .replace(/\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractField(block: string, field: string): string {
  const match = block.match(new RegExp(`^${field}:\\s*(.+)$`, 'im'));
  return match ? match[1].trim() : '';
}

function extractBoldField(block: string, field: string): string {
  const match = block.match(new RegExp(`^\\*\\*${field}:\\*\\*\\s*(.+)$`, 'im'));
  return match ? match[1].trim() : '';
}

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getFolderParts(folder: string): { date: string; slugFromFolder: string } | null {
  const match = folder.match(/^(\d{4}-\d{2}-\d{2})_(.+)$/);
  if (!match) return null;
  return {
    date: match[1],
    slugFromFolder: match[2],
  };
}

function normalizeCaption(caption: string, topic: string, slug: string): string {
  if (caption) return caption;

  return `${topic}\n\nFull guide: epickor.com/blog/${slug}`;
}

function topicLabel(topic: string, blogPost?: BlogPostMetadata): string {
  const text = `${topic} ${(blogPost?.tags || []).join(' ')}`.toLowerCase();

  if (/food|shopping|market|bingsu|pantry|coffee|seaweed|snack|grocery|ramen|toast|daiso/.test(text)) {
    return 'Food & Shopping';
  }
  if (/airport|layover|seoul|travel|trip|itinerary|festival|packing/.test(text)) return 'Travel';
  if (/beauty|skincare|sunscreen|olive young|makeup|lifestyle|hair/.test(text)) return 'Beauty & Lifestyle';
  if (/business|supplier|company|industry|export|market entry/.test(text)) return 'Business';
  return 'Culture';
}

function fallbackDescription(slides: CardNewsSlide[], blogPost?: BlogPostMetadata): string {
  if (blogPost?.description) return blogPost.description;

  const firstSub = slides.find((slide) => slide.sub)?.sub;
  if (firstSub) return cleanInline(firstSub);

  const firstMain = slides.find((slide) => slide.main)?.main;
  return firstMain ? cleanInline(firstMain) : 'Swipe through this EpicKor card-news carousel.';
}

function parseSlides(scriptContent: string, folder: string): CardNewsSlide[] {
  const blocks = scriptContent
    .split(/\n---\s*\n/g)
    .filter((block) => /^##\s+Card\s+\d+/im.test(block));

  return blocks.map((block, arrayIndex) => {
    const cardMatch = block.match(/^##\s+Card\s+(\d+)/im);
    const index = cardMatch ? Number(cardMatch[1]) : arrayIndex + 1;
    const padded = String(index).padStart(2, '0');

    return {
      index,
      kicker: extractField(block, 'kicker'),
      main: extractBoldField(block, 'Main'),
      sub: extractBoldField(block, 'Sub'),
      imageLabel: extractField(block, 'image_label'),
      renderedImage: `/assets/cardnews/${folder}/card_${padded}.png`,
      sourceImage: extractField(block, 'image'),
    };
  });
}

function buildCardNewsItem(folder: string, blogPostMap: Map<string, BlogPostMetadata>): CardNewsItem | null {
  const parts = getFolderParts(folder);
  if (!parts) return null;

  const folderPath = path.join(cardNewsDirectory, folder);
  const scriptPath = path.join(folderPath, 'script.md');

  if (!fs.existsSync(scriptPath)) {
    return null;
  }

  const scriptContent = fs.readFileSync(scriptPath, 'utf8');
  const { data, content } = matter(scriptContent);
  const frontmatter = data as Record<string, unknown>;
  const slug = parts.slugFromFolder;
  const topic = String(frontmatter.topic || `EpicKor Card News ${slug}`);
  const slides = parseSlides(content, folder);

  if (slides.length === 0) {
    return null;
  }

  const caption = normalizeCaption(readFileIfExists(path.join(folderPath, 'caption.txt')), topic, slug);
  const blogPost = blogPostMap.get(slug);
  const totalCards =
    typeof frontmatter.total_cards === 'number'
      ? frontmatter.total_cards
      : slides.length;
  const articlePath =
    typeof frontmatter.article_path === 'string' && frontmatter.article_path.startsWith('/')
      ? frontmatter.article_path
      : `/blog/${slug}`;

  return {
    folder,
    slug,
    topic,
    date: parts.date,
    dateLabel: formatDate(parts.date),
    totalCards,
    caption,
    coverImage: `/assets/cardnews/${folder}/card_01.png`,
    href: `/card-news/${slug}`,
    blogHref: articlePath,
    label: topicLabel(topic, blogPost),
    description: fallbackDescription(slides, blogPost),
    blogPost,
    slides,
  };
}

export function getAllCardNews(): CardNewsItem[] {
  if (!fs.existsSync(cardNewsDirectory)) {
    return [];
  }

  const blogPostMap = new Map(getAllBlogPosts().map((post) => [post.slug, post]));

  return fs
    .readdirSync(cardNewsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => buildCardNewsItem(entry.name, blogPostMap))
    .filter((item): item is CardNewsItem => item !== null)
    .sort((a, b) => {
      if (a.date !== b.date) return b.date.localeCompare(a.date);

      const aSlug = Number(a.slug);
      const bSlug = Number(b.slug);
      if (!Number.isNaN(aSlug) && !Number.isNaN(bSlug)) return bSlug - aSlug;

      return b.slug.localeCompare(a.slug);
    });
}

export function getCardNewsBySlug(slug: string): CardNewsItem | null {
  return getAllCardNews().find((item) => item.slug === slug) || null;
}

export function getAllCardNewsSlugs(): string[] {
  return getAllCardNews().map((item) => item.slug);
}
