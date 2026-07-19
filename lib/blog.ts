import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { enhanceMarkdownHTML } from './markdown-enhancer';
import { processImages } from './image-resolver';
import { extractFirstImageUrl } from './markdown-images';

const contentDirectory = path.join(process.cwd(), 'content/blog');

interface GithubRepoConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

interface RemoteMarkdownFile {
  fileName: string;
  content: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  updatedAt?: string;
  category?: string;
  description: string;
  ogImage: string;
  tags: string[];
  author: string;
  content: string;
}

export interface BlogPostMetadata {
  slug: string;
  title: string;
  date: string;
  updatedAt?: string;
  category?: string;
  description: string;
  ogImage: string;
  tags: string[];
  author: string;
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

  if (!includeScheduled) {
    return isPostVisibleNow(data, now);
  }

  return true;
}

function resolveOgImage(frontmatterOgImage: unknown, markdownBody: string): string {
  const explicit = typeof frontmatterOgImage === 'string' ? frontmatterOgImage.trim() : '';
  if (explicit) return explicit;
  return extractFirstImageUrl(markdownBody);
}

function getGithubRepoConfig(): GithubRepoConfig {
  const repoFullName = process.env.STUDIO_REPO || '5414peace-hash/epickor-blog';
  const branch = process.env.STUDIO_BRANCH || 'master';
  const [owner, repo] = repoFullName.split('/');

  if (!owner || !repo) {
    throw new Error(`Invalid STUDIO_REPO format: ${repoFullName}`);
  }

  return {
    owner,
    repo,
    branch,
    token:
      process.env.STUDIO_GITHUB_TOKEN ||
      process.env.GITHUB_TOKEN ||
      process.env.GITHUB_PAT ||
      '',
  };
}

async function fetchRemoteMarkdownByPath(
  remotePath: string,
  fileName: string
): Promise<RemoteMarkdownFile | null> {
  try {
    const config = getGithubRepoConfig();
    const headers: Record<string, string> = {
      Accept: 'text/plain',
    };

    if (config.token) {
      headers.Authorization = `token ${config.token}`;
    }

    const url = `https://raw.githubusercontent.com/${config.owner}/${config.repo}/${config.branch}/${remotePath}`;
    const response = await fetch(url, {
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    return {
      fileName,
      content: await response.text(),
    };
  } catch (_error) {
    return null;
  }
}

async function fetchRemoteMarkdownBySlug(slug: string): Promise<RemoteMarkdownFile | null> {
  if (!slug) return null;

  return fetchRemoteMarkdownByPath(`content/blog/${slug}.md`, `${slug}.md`);
}

async function fetchRemoteMarkdownByFileName(fileName: string): Promise<RemoteMarkdownFile | null> {
  if (!fileName || !fileName.endsWith('.md')) return null;
  return fetchRemoteMarkdownByPath(`content/blog/${fileName}`, fileName);
}

/**
 * 파일명에서 YAML frontmatter의 slug를 추출하는 헬퍼 함수
 */
function getSlugFromFile(fileName: string): string {
  try {
    if (!fileName || !fileName.endsWith('.md')) {
      return fileName.replace(/\.md$/, '');
    }

    const fullPath = path.join(contentDirectory, fileName);

    if (!fs.existsSync(fullPath)) {
      return fileName.replace(/\.md$/, '');
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    if (data && data.slug && typeof data.slug === 'string') {
      return data.slug;
    }

    return fileName.replace(/\.md$/, '');
  } catch (error) {
    console.error(`Error reading slug from ${fileName}:`, error);
    return fileName.replace(/\.md$/, '');
  }
}

/**
 * slug로 파일명 찾기 (YAML slug 또는 파일명 매칭)
 */
function findFileBySlug(slug: string): string | null {
  try {
    if (!slug) return null;

    const fileNames = fs.readdirSync(contentDirectory);

    for (const fileName of fileNames) {
      if (!fileName || !fileName.endsWith('.md')) continue;

      try {
        const fullPath = path.join(contentDirectory, fileName);

        if (!fs.existsSync(fullPath)) continue;

        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        if (data && data.slug && data.slug === slug) {
          return fileName;
        }

        if (fileName.replace(/\.md$/, '') === slug) {
          return fileName;
        }
      } catch (fileError) {
        console.error(`Error reading file ${fileName}:`, fileError);
        continue;
      }
    }

    return null;
  } catch (error) {
    console.error(`Error finding file for slug ${slug}:`, error);
    return null;
  }
}

/**
 * 모든 블로그 포스트 메타데이터 가져오기 (공개 가능한 글만)
 */
export function getAllBlogPosts(now: Date = new Date()): BlogPostMetadata[] {
  try {
    const fileNames = fs.readdirSync(contentDirectory);
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName): BlogPostMetadata | null => {
        const fullPath = path.join(contentDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        const frontmatter = data as Record<string, unknown>;
        const slug = (frontmatter.slug as string) || fileName.replace(/\.md$/, '');

        if (!isPostVisibleNow(frontmatter, now)) {
          return null;
        }

        const ogImage = resolveOgImage(frontmatter.ogImage, content);

        return {
          slug,
          title: (frontmatter.title as string) || '',
          date: (frontmatter.date as string) || '',
          updatedAt: (frontmatter.updatedAt as string) || undefined,
          category: (frontmatter.category as string) || undefined,
          description: (frontmatter.description as string) || '',
          ogImage,
          tags: (frontmatter.tags as string[]) || [],
          author: (frontmatter.author as string) || 'EpicKor',
        };
      })
      .filter((post): post is BlogPostMetadata => post !== null);

    return allPostsData.sort((a, b) => {
      const aDate = new Date(a.date).getTime();
      const bDate = new Date(b.date).getTime();

      if (Number.isNaN(aDate) || Number.isNaN(bDate)) {
        return a.date < b.date ? 1 : -1;
      }

      if (bDate !== aDate) {
        return bDate - aDate;
      }

      const aSlugNumber = Number(a.slug);
      const bSlugNumber = Number(b.slug);

      if (!Number.isNaN(aSlugNumber) && !Number.isNaN(bSlugNumber)) {
        return bSlugNumber - aSlugNumber;
      }

      return b.slug.localeCompare(a.slug);
    });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

/**
 * 특정 슬러그의 블로그 포스트 가져오기
 */
export async function getBlogPost(slug: string, now: Date = new Date()): Promise<BlogPost | null> {
  try {
    const fileName = findFileBySlug(slug);
    const remoteBySlug = fileName ? null : await fetchRemoteMarkdownBySlug(slug);
    const remoteByFileName = !remoteBySlug && !fileName ? await fetchRemoteMarkdownByFileName(`${slug}.md`) : null;
    const remote = remoteBySlug || remoteByFileName;

    let resolvedFileName = fileName || '';
    let fileContents = '';

    if (remote) {
      resolvedFileName = remote.fileName;
      fileContents = remote.content;
    } else if (fileName) {
      const fullPath = path.join(contentDirectory, fileName);
      fileContents = fs.readFileSync(fullPath, 'utf8');
    } else {
      return null;
    }

    const { data, content } = matter(fileContents);

    const frontmatter = data as Record<string, unknown>;
    if (!isPostVisibleNow(frontmatter, now)) {
      return null;
    }

    const processedContent = await remark()
      .use(gfm)
      .use(html, { sanitize: false })
      .process(content);

    let contentHtml = processedContent.toString();
    contentHtml = contentHtml.replace(
      /<p>\s*\{\{\s*IMAGE[_-]?\d+\s*\}\}\s*<\/p>/gim,
      ''
    );

    const postSlug = (frontmatter.slug as string) || resolvedFileName.replace(/\.md$/, '');

    const allPosts = getAllBlogPosts(now);

    contentHtml = processImages(contentHtml, postSlug);
    contentHtml = enhanceMarkdownHTML(
      contentHtml,
      allPosts,
      (frontmatter.tags as string[]) || [],
      frontmatter.amazon === true
    );

    return {
      slug: postSlug,
      title: (frontmatter.title as string) || '',
      date: (frontmatter.date as string) || '',
      updatedAt: (frontmatter.updatedAt as string) || undefined,
      category: (frontmatter.category as string) || undefined,
      description: (frontmatter.description as string) || '',
      ogImage: resolveOgImage(frontmatter.ogImage, content),
      tags: (frontmatter.tags as string[]) || [],
      author: (frontmatter.author as string) || 'EpicKor',
      content: contentHtml,
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

/**
 * 모든 블로그 슬러그 가져오기
 * - 기본: 현재 시점에 공개 가능한 글만 반환
 * - includeScheduled=true: 미래 예약글도 포함
 * - includePrivate=true: 비공개글도 포함
 */
export function getAllBlogSlugs(options: { includeScheduled?: boolean; includePrivate?: boolean } = {}): string[] {
  const { includeScheduled = false, includePrivate = false } = options;

  try {
    const now = new Date();
    const fileNames = fs.readdirSync(contentDirectory);

    return fileNames
      .filter((fileName) => fileName.endsWith('.md'))
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
    console.error('Error reading blog slugs:', error);
    return [];
  }
}

/**
 * 미리보기용: visibility/publishAt 무시하고 포스트 가져오기
 */
export async function getBlogPostForPreview(slug: string): Promise<BlogPost | null> {
  try {
    const fileName = findFileBySlug(slug);
    const preferLocal = process.env.NODE_ENV !== 'production';
    const remoteBySlug = preferLocal ? null : await fetchRemoteMarkdownBySlug(slug);
    const remoteByFileName =
      !preferLocal && !remoteBySlug && fileName ? await fetchRemoteMarkdownByFileName(fileName) : null;
    const remote = remoteBySlug || remoteByFileName;

    let resolvedFileName = fileName || '';
    let fileContents = '';

    if (remote) {
      resolvedFileName = remote.fileName;
      fileContents = remote.content;
    } else if (fileName) {
      const fullPath = path.join(contentDirectory, fileName);
      fileContents = fs.readFileSync(fullPath, 'utf8');
    } else {
      return null;
    }

    const { data, content } = matter(fileContents);
    const frontmatter = data as Record<string, unknown>;

    const processedContent = await remark()
      .use(gfm)
      .use(html, { sanitize: false })
      .process(content);

    let contentHtml = processedContent.toString();
    contentHtml = contentHtml.replace(
      /<p>\s*\{\{\s*IMAGE[_-]?\d+\s*\}\}\s*<\/p>/gim,
      ''
    );

    const postSlug = (frontmatter.slug as string) || resolvedFileName.replace(/\.md$/, '');
    const allPosts = getAllBlogPosts();

    contentHtml = processImages(contentHtml, postSlug);
    contentHtml = enhanceMarkdownHTML(
      contentHtml,
      allPosts,
      (frontmatter.tags as string[]) || [],
      frontmatter.amazon === true
    );

    return {
      slug: postSlug,
      title: (frontmatter.title as string) || '',
      date: (frontmatter.date as string) || '',
      updatedAt: (frontmatter.updatedAt as string) || undefined,
      category: (frontmatter.category as string) || undefined,
      description: (frontmatter.description as string) || '',
      ogImage: resolveOgImage(frontmatter.ogImage, content),
      tags: (frontmatter.tags as string[]) || [],
      author: (frontmatter.author as string) || 'EpicKor',
      content: contentHtml,
    };
  } catch (error) {
    console.error(`Error reading blog post for preview ${slug}:`, error);
    return null;
  }
}

/**
 * 태그별 블로그 포스트 가져오기
 */
export function getBlogPostsByTag(tag: string): BlogPostMetadata[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter((post) => post.tags.includes(tag));
}

/**
 * 모든 태그 가져오기
 */
export function getAllTags(): string[] {
  const allPosts = getAllBlogPosts();
  const tags = new Set<string>();

  allPosts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags).sort();
}

