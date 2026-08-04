import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/blog';
import { getAllBusinessPosts } from '@/lib/business';
import { getAllCardNews } from '@/lib/card-news';
import { sectionPageList } from '@/lib/section-pages';

export const revalidate = 86400;

function toValidDate(value: string): Date | undefined {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function getPostFreshnessDate(post: { date: string; updatedAt?: string }): Date | undefined {
  return toValidDate(post.updatedAt || post.date);
}

function getLatestPostDate(posts: Array<{ date: string; updatedAt?: string }>): Date | undefined {
  return posts.reduce<Date | undefined>((latest, post) => {
    const date = getPostFreshnessDate(post);
    if (!date) return latest;
    if (!latest || date.getTime() > latest.getTime()) return date;
    return latest;
  }, undefined);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllBlogPosts();
  const businessPosts = getAllBusinessPosts();
  const cardNewsItems = getAllCardNews();
  const latestPostDate = getLatestPostDate([...posts, ...businessPosts]);
  const latestBusinessPostDate = getLatestPostDate(businessPosts);
  const latestCardNewsDate = getLatestPostDate(cardNewsItems);

  const sectionUrls = sectionPageList.map((section) => ({
    url: `https://www.epickor.com${section.href}`,
    ...(latestPostDate ? { lastModified: latestPostDate } : {}),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }));
  
  const blogUrls = posts.map((post) => {
    const lastModified = getPostFreshnessDate(post);
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

  const cardNewsUrls = cardNewsItems.map((item) => {
    const lastModified = toValidDate(item.date);
    return {
      url: `https://www.epickor.com/card-news/${item.slug}`,
      ...(lastModified ? { lastModified } : {}),
      changeFrequency: 'monthly' as const,
      priority: 0.65,
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
      url: 'https://www.epickor.com/guides',
      ...(latestPostDate ? { lastModified: latestPostDate } : {}),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: 'https://www.epickor.com/ramyun',
      ...(latestPostDate ? { lastModified: latestPostDate } : {}),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: 'https://www.epickor.com/convenience-store',
      ...(latestPostDate ? { lastModified: latestPostDate } : {}),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: 'https://www.epickor.com/drinks',
      ...(latestPostDate ? { lastModified: latestPostDate } : {}),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: 'https://www.epickor.com/seoul',
      ...(latestPostDate ? { lastModified: latestPostDate } : {}),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    },
    {
      url: 'https://www.epickor.com/business',
      ...(latestBusinessPostDate ? { lastModified: latestBusinessPostDate } : {}),
      changeFrequency: 'daily',
      priority: 0.75,
    },
    {
      url: 'https://www.epickor.com/latest',
      ...(latestPostDate ? { lastModified: latestPostDate } : {}),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://www.epickor.com/issues',
      ...(latestPostDate ? { lastModified: latestPostDate } : {}),
      changeFrequency: 'daily',
      priority: 0.84,
    },
    {
      url: 'https://www.epickor.com/card-news',
      ...(latestCardNewsDate ? { lastModified: latestCardNewsDate } : {}),
      changeFrequency: 'weekly',
      priority: 0.82,
    },
    ...sectionUrls,
    {
      url: 'https://www.epickor.com/business/editor',
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    ...blogUrls,
    ...businessUrls,
    ...cardNewsUrls,
  ];
}

