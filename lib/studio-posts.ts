import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content/blog');

export type PostVisibility = 'public' | 'private';
export type PostStatus = 'public' | 'private' | 'scheduled';

export interface StudioPostListItem {
  slug: string;
  title: string;
  date: string;
  visibility: PostVisibility;
  publishAt: string;
  status: PostStatus;
  lastModified: string;
  fileName: string;
}

function normalizeVisibility(value: unknown): PostVisibility {
  if (typeof value !== 'string') {
    return 'public';
  }
  return value.toLowerCase() === 'private' ? 'private' : 'public';
}

function normalizeString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function computePostStatus(visibility: PostVisibility, publishAt: string, now: Date): PostStatus {
  if (visibility === 'private') {
    return 'private';
  }

  if (!publishAt) {
    return 'public';
  }

  const parsed = new Date(publishAt);
  if (!Number.isNaN(parsed.getTime()) && parsed.getTime() > now.getTime()) {
    return 'scheduled';
  }

  return 'public';
}

export function getStudioPosts(now: Date = new Date()): StudioPostListItem[] {
  try {
    const fileNames = fs.readdirSync(contentDirectory).filter((fileName) => fileName.endsWith('.md'));
    const items = fileNames.map((fileName) => {
      const fullPath = path.join(contentDirectory, fileName);
      const stat = fs.statSync(fullPath);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      const frontmatter = data as Record<string, unknown>;

      const slug = normalizeString(frontmatter.slug) || fileName.replace(/\.md$/, '');
      const title = normalizeString(frontmatter.title) || '(Untitled)';
      const date = normalizeString(frontmatter.date);
      const visibility = normalizeVisibility(frontmatter.visibility);
      const publishAt = normalizeString(frontmatter.publishAt);
      const status = computePostStatus(visibility, publishAt, now);

      return {
        slug,
        title,
        date,
        visibility,
        publishAt,
        status,
        lastModified: stat.mtime.toISOString(),
        fileName,
      };
    });

    return items.sort((a, b) => {
      const aDate = new Date(a.date).getTime();
      const bDate = new Date(b.date).getTime();

      if (!Number.isNaN(aDate) && !Number.isNaN(bDate)) {
        return bDate - aDate;
      }

      return b.lastModified.localeCompare(a.lastModified);
    });
  } catch (error) {
    console.error('Failed to load studio posts:', error);
    return [];
  }
}

