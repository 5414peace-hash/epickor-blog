import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { enhanceMarkdownHTML } from './markdown-enhancer';

const contentDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
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
  description: string;
  ogImage: string;
  tags: string[];
  author: string;
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
    
    // YAML frontmatter에 slug 필드가 있으면 우선 사용
    if (data && data.slug && typeof data.slug === 'string') {
      return data.slug;
    }
    
    // fallback: 파일명에서 slug 추출
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
        
        // YAML slug가 일치하는 경우
        if (data && data.slug && data.slug === slug) {
          return fileName;
        }
        
        // fallback: 파일명이 일치하는 경우
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
 * 모든 블로그 포스트 메타데이터 가져오기 (날짜 내림차순)
 */
export function getAllBlogPosts(): BlogPostMetadata[] {
  try {
    const fileNames = fs.readdirSync(contentDirectory);
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => {
        const fullPath = path.join(contentDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);
        
        // YAML slug 우선, fallback은 파일명
        const slug = data.slug || fileName.replace(/\.md$/, '');
        
        // ogImage fallback: 본문의 첫 번째 이미지 추출
        let ogImage = data.ogImage || '';
        if (!ogImage) {
          const imgMatch = content.match(/!\[.*?\]\((.+?)\)/);
          if (imgMatch && imgMatch[1]) {
            ogImage = imgMatch[1];
          }
        }

        return {
          slug,
          title: data.title || '',
          date: data.date || '',
          description: data.description || '',
          ogImage,
          tags: data.tags || [],
          author: data.author || 'EpicKor',
        };
      });

    // 날짜 내림차순 정렬 (최신 블로그가 먼저)
    return allPostsData.sort((a, b) => {
      if (a.date < b.date) {
        return 1;
      } else {
        return -1;
      }
    });
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

/**
 * 특정 슬러그의 블로그 포스트 가져오기
 */
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    // slug로 파일 찾기 (YAML slug 또는 파일명 매칭)
    const fileName = findFileBySlug(slug);
    
    if (!fileName) {
      return null;
    }
    
    const fullPath = path.join(contentDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // 마크다운을 HTML로 변환
    const processedContent = await remark()
      .use(gfm)
      .use(html, { sanitize: false })
      .process(content);
    
    let contentHtml = processedContent.toString();
    
    // Apply advanced enhancements
    const allPosts = getAllBlogPosts();
    contentHtml = enhanceMarkdownHTML(contentHtml, allPosts);
    
    // YAML slug 우선, fallback은 파일명
    const postSlug = data.slug || fileName.replace(/\.md$/, '');

    return {
      slug: postSlug,
      title: data.title || '',
      date: data.date || '',
      description: data.description || '',
      ogImage: data.ogImage || '',
      tags: data.tags || [],
      author: data.author || 'EpicKor',
      content: contentHtml,
    };
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

/**
 * 모든 블로그 슬러그 가져오기 (정적 경로 생성용)
 */
export function getAllBlogSlugs(): string[] {
  try {
    const fileNames = fs.readdirSync(contentDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => getSlugFromFile(fileName));
  } catch (error) {
    console.error('Error reading blog slugs:', error);
    return [];
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
