'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { GA_MEASUREMENT_ID } from '@/lib/analytics-config';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function toSnakeCase(value: string): string {
  return value.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`).replace(/^_/, '');
}

function buildEventParams(element: HTMLElement): Record<string, string> {
  const params: Record<string, string> = {};

  Object.entries(element.dataset).forEach(([key, value]) => {
    if (!key.startsWith('analytics') || key === 'analyticsEvent' || !value) return;
    params[toSnakeCase(key.replace(/^analytics/, ''))] = value;
  });

  return params;
}

function cleanParam(value: string, maxLength = 120): string {
  return value.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function isAmazonAffiliateUrl(url: URL): boolean {
  const host = url.hostname.toLowerCase();
  const isAmazonHost = host === 'amazon.com' || host.endsWith('.amazon.com') || host === 'amzn.to';

  if (!isAmazonHost) return false;
  if (host === 'amzn.to') return true;

  return url.searchParams.has('tag');
}

function isAgodaAffiliateUrl(url: URL): boolean {
  const host = url.hostname.toLowerCase();
  const isAgodaHost = host === 'agoda.com' || host.endsWith('.agoda.com');

  return isAgodaHost && url.searchParams.has('cid');
}

function getContentContext(pathname: string): Pick<AmazonAffiliateEventParams, 'content_type' | 'content_slug'> {
  const [, contentType, contentSlug] = pathname.match(/^\/(blog|business)\/([^/?#]+)/) || [];

  return {
    content_type: contentType || 'site',
    content_slug: contentSlug || '',
  };
}

interface AmazonAffiliateEventParams {
  affiliate_domain: string;
  affiliate_tag: string;
  content_slug: string;
  content_type: string;
  cta_context: string;
  link_path: string;
  link_query: string;
  link_text: string;
  page_path: string;
}

interface AgodaAffiliateEventParams {
  affiliate_cid: string;
  affiliate_domain: string;
  content_slug: string;
  content_type: string;
  cta_context: string;
  destination_id: string;
  destination_type: string;
  link_path: string;
  link_text: string;
  page_path: string;
}

/**
 * Where on the page the affiliate link sits. Registered GA4 dimension `cta_context`
 * used to carry only two values (inside a box / not), which cannot answer the
 * question the representative asked on 2026-09-05: do links placed earlier get
 * clicked more? Values now:
 *   topline      - the one-line link under the hero image
 *   quickguide   - a link inside the Quick Guide table (first table of the post)
 *   box1 / box2… - the n-th .affiliate-inline-cta box in document order
 *   table        - any other table
 *   inline       - a plain link in running text
 */
function getCtaContext(link: HTMLAnchorElement): string {
  if (link.closest('.affiliate-topline')) return 'topline';
  const box = link.closest('.affiliate-inline-cta');
  if (box) {
    const boxes = Array.from(document.querySelectorAll('.affiliate-inline-cta'));
    const index = boxes.indexOf(box as Element);
    return index === -1 ? 'box' : `box${index + 1}`;
  }
  const table = link.closest('table');
  if (table) {
    const tables = Array.from(document.querySelectorAll('.blog-content table, article table'));
    return tables.indexOf(table) === 0 ? 'quickguide' : 'table';
  }
  return 'inline';
}

function buildAmazonAffiliateParams(link: HTMLAnchorElement): AmazonAffiliateEventParams | null {
  let url: URL;

  try {
    url = new URL(link.href, window.location.origin);
  } catch {
    return null;
  }

  if (!isAmazonAffiliateUrl(url)) return null;

  const pathname = window.location.pathname;
  const contentContext = getContentContext(pathname);
  const affiliateTag = url.searchParams.get('tag') || (url.hostname.toLowerCase() === 'amzn.to' ? 'amzn_shortlink' : '');
  const query = url.searchParams.get('k') || url.searchParams.get('keywords') || '';
  const ctaContext = getCtaContext(link);

  return {
    affiliate_domain: url.hostname,
    affiliate_tag: affiliateTag,
    content_slug: contentContext.content_slug,
    content_type: contentContext.content_type,
    cta_context: ctaContext,
    link_path: cleanParam(`${url.hostname}${url.pathname}`),
    link_query: cleanParam(query),
    link_text: cleanParam(link.innerText || link.textContent || ''),
    page_path: pathname,
  };
}

function buildAgodaAffiliateParams(link: HTMLAnchorElement): AgodaAffiliateEventParams | null {
  let url: URL;

  try {
    url = new URL(link.href, window.location.origin);
  } catch {
    return null;
  }

  if (!isAgodaAffiliateUrl(url)) return null;

  const pathname = window.location.pathname;
  const contentContext = getContentContext(pathname);
  const cityId = url.searchParams.get('city') || '';

  return {
    affiliate_cid: cleanParam(url.searchParams.get('cid') || ''),
    affiliate_domain: url.hostname,
    content_slug: contentContext.content_slug,
    content_type: contentContext.content_type,
    cta_context: getCtaContext(link),
    destination_id: cleanParam(cityId),
    destination_type: cityId ? 'city' : 'other',
    link_path: cleanParam(`${url.hostname}${url.pathname}`),
    link_text: cleanParam(link.innerText || link.textContent || ''),
    page_path: pathname,
  };
}

export default function AnalyticsEvents() {
  const pathname = usePathname();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !window.gtag) return;

    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: pathname,
    });
  }, [pathname]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const element = target?.closest<HTMLElement>('[data-analytics-event]');
      const eventName = element?.dataset.analyticsEvent;
      const affiliateLink = target?.closest<HTMLAnchorElement>('a[href]');

      if (!window.gtag) return;

      if (eventName && element) {
        window.gtag('event', eventName, buildEventParams(element));
      }

      if (affiliateLink) {
        const amazonAffiliateParams = buildAmazonAffiliateParams(affiliateLink);
        if (amazonAffiliateParams) {
          window.gtag('event', 'affiliate_amazon_click', amazonAffiliateParams);
        }

        const agodaAffiliateParams = buildAgodaAffiliateParams(affiliateLink);
        if (agodaAffiliateParams) {
          window.gtag('event', 'affiliate_agoda_click', agodaAffiliateParams);
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return null;
}
