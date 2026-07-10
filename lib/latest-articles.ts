import type { BlogPostMetadata } from '@/lib/blog';
import { getAllBlogPosts } from '@/lib/blog';
import type { BusinessPostMetadata } from '@/lib/business';
import { getAllBusinessPosts, getBusinessTypeLabel } from '@/lib/business';

export type LatestArticleSource = 'blog' | 'business';

export interface LatestArticle {
  slug: string;
  href: string;
  title: string;
  description: string;
  date: string;
  image: string;
  label: string;
  source: LatestArticleSource;
  tags: string[];
  detail?: string;
}

function includesAny(value: string, patterns: string[]): boolean {
  return patterns.some((pattern) => value.includes(pattern));
}

function getBlogLabel(post: BlogPostMetadata): string {
  const haystack = [post.title, post.description, ...post.tags].join(' ').toLowerCase();

  if (includesAny(haystack, ['politic', 'president', 'democraticparty', 'peoplepowerparty', 'election'])) {
    return 'Politics';
  }

  if (includesAny(haystack, ['youtube', 'podcast', 'creator', 'digitalmedia', 'trend'])) {
    return 'Trend';
  }

  if (includesAny(haystack, ['business', 'supplier', 'industry', 'sourcing', 'company'])) {
    return 'Business';
  }

  if (includesAny(haystack, ['school', 'education', 'university', 'student', 'campus'])) {
    return 'Education';
  }

  if (includesAny(haystack, ['travel', 'airport', 'subway', 'hotel', 'itinerary', 'transit', 'packing'])) {
    return 'Travel';
  }

  if (includesAny(haystack, ['food', 'shopping', 'snack', 'coffee', 'bakery', 'kimchi', 'dosirak', 'pantry'])) {
    return 'Food & Shopping';
  }

  if (includesAny(haystack, ['beauty', 'skincare', 'sunscreen', 'fashion', 'lifestyle'])) {
    return 'Beauty & Lifestyle';
  }

  return 'Culture';
}

function toBlogArticle(post: BlogPostMetadata): LatestArticle {
  return {
    slug: post.slug,
    href: `/blog/${post.slug}`,
    title: post.title,
    description: post.description,
    date: post.date,
    image: post.ogImage,
    label: getBlogLabel(post),
    source: 'blog',
    tags: post.tags,
    detail: post.tags[0],
  };
}

function toBusinessArticle(post: BusinessPostMetadata): LatestArticle {
  return {
    slug: post.slug,
    href: `/business/${post.slug}`,
    title: post.title,
    description: post.description,
    date: post.date,
    image: post.ogImage,
    label: 'Business',
    source: 'business',
    tags: post.tags,
    detail: post.industry || getBusinessTypeLabel(post.businessType),
  };
}

function dateValue(value: string): number {
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function slugValue(value: string): number {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export function getLatestArticles(limit?: number, now: Date = new Date()): LatestArticle[] {
  const articles = [
    ...getAllBlogPosts(now).map(toBlogArticle),
    ...getAllBusinessPosts(now).map(toBusinessArticle),
  ].sort((a, b) => {
    const dateDelta = dateValue(b.date) - dateValue(a.date);
    if (dateDelta !== 0) return dateDelta;
    return slugValue(b.slug) - slugValue(a.slug);
  });

  return typeof limit === 'number' ? articles.slice(0, limit) : articles;
}
