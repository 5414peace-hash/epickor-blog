import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/blog';
import { getAllBusinessPosts } from '@/lib/business';
import { sectionPageList } from '@/lib/section-pages';

export const revalidate = 86400;

function toValidDate(value: string): Date | undefined {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function getLatestPostDate(posts: Array<{ date: string }>): Date | undefined {
  return posts.reduce<Date | undefined>((latest, post) => {
    const date = toValidDate(post.date);
    if (!date) return latest;
    if (!latest || date.getTime() > latest.getTime()) return date;
    return latest;
  }, undefined);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllBlogPosts();
  const businessPosts = getAllBusinessPosts();
  const latestPostDate = getLatestPostDate([...posts, ...businessPosts]);
  const latestBusinessPostDate = getLatestPostDate(businessPosts);

  const sectionUrls = sectionPageList.map((section) => ({
    url: `https://www.epickor.com${section.href}`,
    ...(latestPostDate ? { lastModified: latestPostDate } : {}),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }));
  
  const blogUrls = posts.map((post) => {
    const lastModified = toValidDate(post.date);
    return {
      url: `https://www.epickor.com/blog/${post.slug}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    };
  });

  const businessUrls = businessPosts.map((post) => {
    const lastModified = toValidDate(post.date);
    return {
      url: `https://www.epickor.com/business/${post.slug}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    };
  });
  
  return [
    {
      url: 'https://www.epickor.com',
      ...(latestPostDate ? { lastModified: latestPostDate } : {}),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://www.epickor.com/business',
      ...(latestBusinessPostDate ? { lastModified: latestBusinessPostDate } : {}),
      changeFrequency: 'daily',
      priority: 0.75,
    },
    ...sectionUrls,
    {
      url: 'https://www.epickor.com/business/editor',
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    ...blogUrls,
    ...businessUrls,
  ];
}

