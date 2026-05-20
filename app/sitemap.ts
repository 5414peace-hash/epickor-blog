import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/blog';

export const revalidate = 86400;

function toValidDate(value: string): Date | undefined {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function getLatestPostDate(posts: ReturnType<typeof getAllBlogPosts>): Date | undefined {
  return posts.reduce<Date | undefined>((latest, post) => {
    const date = toValidDate(post.date);
    if (!date) return latest;
    if (!latest || date.getTime() > latest.getTime()) return date;
    return latest;
  }, undefined);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllBlogPosts();
  const latestPostDate = getLatestPostDate(posts);
  
  const blogUrls = posts.map((post) => {
    const lastModified = toValidDate(post.date);
    return {
      url: `https://www.epickor.com/blog/${post.slug}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    };
  });
  
  return [
    {
      url: 'https://www.epickor.com',
      ...(latestPostDate ? { lastModified: latestPostDate } : {}),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...blogUrls,
  ];
}

