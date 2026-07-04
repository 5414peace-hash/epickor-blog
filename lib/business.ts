import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import { enhanceMarkdownHTML } from './markdown-enhancer';
import { processImages } from './image-resolver';
import { extractFirstImageUrl } from './markdown-images';

const contentDirectory = path.join(process.cwd(), 'content/business');

export const BUSINESS_AUTHOR_NAME = 'EpicKor Business Editor';
export const BUSINESS_AUTHOR_PROFILE_HREF = '/business/editor';

export type BusinessPostType = 'search-demand-guide' | 'client-story' | 'non-client-spotlight';
export type BusinessConsentStatus = 'not-applicable' | 'pending' | 'confirmed';
export type BusinessVideoEmbedPermission = 'not-applicable' | 'pending' | 'granted' | 'denied';

export interface BusinessPostMetadata {
  slug: string;
  title: string;
  date: string;
  description: string;
  ogImage: string;
  tags: string[];
  author: string;
  businessType: BusinessPostType;
  consentStatus: BusinessConsentStatus;
  videoEmbedPermission: BusinessVideoEmbedPermission;
  companyName?: string;
  industry?: string;
  sourceScope?: string;
}

export interface BusinessPost extends BusinessPostMetadata {
  content: string;
}

function normalizeVisibility(value: unknown): 'public' | 'private' {
  if (typeof value !== 'string') {
    return 'public';
  }

  return value.toLowerCase() === 'private' ? 'private' : 'public';
}

function parsePublishAt(value: unknown): Date | null {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

function isPostVisibleNow(data: Record<string, unknown>, now: Date = new Date()): boolean {
  const visibility = normalizeVisibility(data.visibility);
  if (visibility === 'private') {
    return false;
  }

  const publishAt = parsePublishAt(data.publishAt);
  if (publishAt && publishAt.getTime() > now.getTime()) {
    return false;
  }

  return true;
}

function isPostEligibleForStaticParams(
  data: Record<string, unknown>,
  now: Date,
  includeScheduled: boolean,
  includePrivate: boolean
): boolean {
  if (!includePrivate && normalizeVisibility(data.visibility) === 'private') {
    return false;
  }

  if (!includeScheduled && !isPostVisibleNow(data, now)) {
    return false;
  }

  return isBusinessTrustReady(data);
}

function normalizeBusinessType(value: unknown): BusinessPostType {
  const normalized = typeof value === 'string' ? value.toLowerCase().trim() : '';

  if (
    normalized === 'client-story' ||
    normalized === 'client story' ||
    normalized === 'b-1' ||
    normalized === 'type-b-1'
  ) {
    return 'client-story';
  }

  if (
    normalized === 'non-client-spotlight' ||
    normalized === 'company-spotlight' ||
    normalized === 'company spotlight' ||
    normalized === 'b-2' ||
    normalized === 'type-b-2'
  ) {
    return 'non-client-spotlight';
  }

  return 'search-demand-guide';
}

function normalizeConsentStatus(value: unknown, businessType: BusinessPostType): BusinessConsentStatus {
  if (businessType !== 'client-story') {
    return 'not-applicable';
  }

  const normalized = typeof value === 'string' ? value.toLowerCase().trim() : '';
  return normalized === 'confirmed' ? 'confirmed' : 'pending';
}

function normalizeVideoEmbedPermission(
  value: unknown,
  businessType: BusinessPostType
): BusinessVideoEmbedPermission {
  if (businessType !== 'client-story') {
    return 'not-applicable';
  }

  const normalized = typeof value === 'string' ? value.toLowerCase().trim() : '';
  if (normalized === 'granted') return 'granted';
  if (normalized === 'denied') return 'denied';
  return 'pending';
}

function isBusinessTrustReady(data: Record<string, unknown>): boolean {
  const businessType = normalizeBusinessType(data.businessType);
  if (businessType !== 'client-story') {
    return true;
  }

  return (
    normalizeConsentStatus(data.consentStatus, businessType) === 'confirmed' &&
    normalizeVideoEmbedPermission(data.videoEmbedPermission, businessType) === 'granted'
  );
}

function resolveOgImage(frontmatterOgImage: unknown, markdownBody: string): string {
  const explicit = typeof frontmatterOgImage === 'string' ? frontmatterOgImage.trim() : '';
  if (explicit) return explicit;
  return extractFirstImageUrl(markdownBody);
}

function readMarkdownFiles(): string[] {
  if (!fs.existsSync(contentDirectory)) {
    return [];
  }

  return fs.readdirSync(contentDirectory).filter((fileName) => fileName.endsWith('.md'));
}

function getSlugFromFile(fileName: string): string {
  try {
    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    if (data && data.slug && typeof data.slug === 'string') {
      return data.slug;
    }

    return fileName.replace(/\.md$/, '');
  } catch (error) {
    console.error(`Error reading business slug from ${fileName}:`, error);
    return fileName.replace(/\.md$/, '');
  }
}

function findFileBySlug(slug: string): string | null {
  if (!slug || !fs.existsSync(contentDirectory)) return null;

  for (const fileName of readMarkdownFiles()) {
    try {
      const fullPath = path.join(contentDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);

      if (data && data.slug === slug) {
        return fileName;
      }

      if (fileName.replace(/\.md$/, '') === slug) {
        return fileName;
      }
    } catch (error) {
      console.error(`Error reading business file ${fileName}:`, error);
    }
  }

  return null;
}

function buildMetadata(
  fileName: string,
  frontmatter: Record<string, unknown>,
  content: string
): BusinessPostMetadata {
  const businessType = normalizeBusinessType(frontmatter.businessType);
  const slug = (frontmatter.slug as string) || fileName.replace(/\.md$/, '');

  return {
    slug,
    title: (frontmatter.title as string) || '',
    date: (frontmatter.date as string) || '',
    description: (frontmatter.description as string) || '',
    ogImage: resolveOgImage(frontmatter.ogImage, content),
    tags: Array.isArray(frontmatter.tags) ? (frontmatter.tags as string[]) : [],
    author: (frontmatter.author as string) || BUSINESS_AUTHOR_NAME,
    businessType,
    consentStatus: normalizeConsentStatus(frontmatter.consentStatus, businessType),
    videoEmbedPermission: normalizeVideoEmbedPermission(frontmatter.videoEmbedPermission, businessType),
    companyName: typeof frontmatter.companyName === 'string' ? frontmatter.companyName : undefined,
    industry: typeof frontmatter.industry === 'string' ? frontmatter.industry : undefined,
    sourceScope: typeof frontmatter.sourceScope === 'string' ? frontmatter.sourceScope : undefined,
  };
}

export function getBusinessTypeLabel(type: BusinessPostType): string {
  if (type === 'client-story') return 'Client Story';
  if (type === 'non-client-spotlight') return 'Company Spotlight';
  return 'Operator Guide';
}

export function getAllBusinessPosts(now: Date = new Date()): BusinessPostMetadata[] {
  try {
    const posts = readMarkdownFiles()
      .map((fileName) => {
        const fullPath = path.join(contentDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        const frontmatter = data as Record<string, unknown>;

        if (!isPostVisibleNow(frontmatter, now) || !isBusinessTrustReady(frontmatter)) {
          return null;
        }

        return buildMetadata(fileName, frontmatter, content);
      })
      .filter((post): post is BusinessPostMetadata => post !== null);

    return posts.sort((a, b) => {
      const aDate = new Date(a.date).getTime();
      const bDate = new Date(b.date).getTime();

      if (Number.isNaN(aDate) || Number.isNaN(bDate)) {
        return a.date < b.date ? 1 : -1;
      }

      return bDate - aDate;
    });
  } catch (error) {
    console.error('Error reading business posts:', error);
    return [];
  }
}

export async function getBusinessPost(slug: string, now: Date = new Date()): Promise<BusinessPost | null> {
  try {
    const fileName = findFileBySlug(slug);
    if (!fileName) return null;

    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    const frontmatter = data as Record<string, unknown>;

    if (!isPostVisibleNow(frontmatter, now) || !isBusinessTrustReady(frontmatter)) {
      return null;
    }

    const processedContent = await remark()
      .use(gfm)
      .use(html, { sanitize: false })
      .process(content);

    const metadata = buildMetadata(fileName, frontmatter, content);
    let contentHtml = processedContent.toString();
    contentHtml = contentHtml.replace(/<p>\s*\{\{\s*IMAGE[_-]?\d+\s*\}\}\s*<\/p>/gim, '');
    contentHtml = processImages(contentHtml, metadata.slug, '/assets/images/business');
    contentHtml = enhanceMarkdownHTML(
      contentHtml,
      getAllBusinessPosts(now),
      metadata.tags,
      frontmatter.amazon === true,
      'business'
    );

    return {
      ...metadata,
      content: contentHtml,
    };
  } catch (error) {
    console.error(`Error reading business post ${slug}:`, error);
    return null;
  }
}

export function getAllBusinessSlugs(
  options: { includeScheduled?: boolean; includePrivate?: boolean } = {}
): string[] {
  const { includeScheduled = false, includePrivate = false } = options;

  try {
    const now = new Date();

    return readMarkdownFiles()
      .map((fileName) => {
        const fullPath = path.join(contentDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);
        const frontmatter = data as Record<string, unknown>;

        if (!isPostEligibleForStaticParams(frontmatter, now, includeScheduled, includePrivate)) {
          return null;
        }

        return getSlugFromFile(fileName);
      })
      .filter((slug): slug is string => slug !== null);
  } catch (error) {
    console.error('Error reading business slugs:', error);
    return [];
  }
}
