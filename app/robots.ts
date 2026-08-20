import { MetadataRoute } from 'next';

/**
 * /studio, /preview and /admin are internal tools that were returning 200 with
 * no noindex until 2026-08-20 — crawlable, indexable, and burning crawl budget.
 * They are blocked here AND carry a noindex robots meta (their layouts), since
 * robots.txt alone stops crawling but not indexing of an already-known URL.
 *
 * No AI-crawler-specific rules on purpose: GPTBot, ClaudeBot, PerplexityBot
 * and friends are welcome on the public content — being read by answer
 * engines is the point of this site, not a threat to it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/studio', '/preview/', '/admin', '/api/'],
    },
    sitemap: 'https://www.epickor.com/sitemap.xml',
  };
}
