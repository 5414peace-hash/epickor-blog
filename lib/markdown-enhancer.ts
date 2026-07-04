/**
 * Advanced Markdown Content Enhancer
 * - Lazy loading for all images
 * - Parallel image grid for consecutive images
 * - YouTube embed conversion
 * - Internal link rich cards
 * - Conservative Amazon affiliate cards
 */

import fs from 'fs';
import path from 'path';

interface InternalPostReference {
  slug: string;
  title: string;
  description?: string;
  ogImage?: string;
}

export interface AmazonProduct {
  id?: string;
  name: string;
  url: string;
  description: string;
  price?: string;
  category?: string;
  image?: string;
  tags?: string[];
}

const AMAZON_LINKS_PATH = path.join(process.cwd(), 'content/data/amazon-links.json');
const MIN_PRODUCT_SCORE = 24;
const MAX_AFFILIATE_PRODUCTS = 2;
const GENERIC_TOKENS = new Set([
  'the',
  'and',
  'for',
  'with',
  'korean',
  'korea',
  'style',
  'pack',
  'set',
  'box',
  'food',
  'snack',
  'shopping',
  'browse',
  'amazon',
]);

function normalizeText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(/\s+/)
    .filter((token) => token.length >= 3 && !GENERIC_TOKENS.has(token));
}

function sanitizeProduct(input: unknown): AmazonProduct | null {
  if (!input || typeof input !== 'object') return null;
  const raw = input as Record<string, unknown>;
  const name = String(raw.name || '').trim();
  const url = String(raw.url || '').trim();
  if (!name || !url) return null;

  return {
    id: String(raw.id || '').trim() || undefined,
    name,
    url,
    description: String(raw.description || '').trim(),
    price: String(raw.price || '').trim(),
    category: String(raw.category || '').trim(),
    image: String(raw.image || '').trim(),
    tags: Array.isArray(raw.tags)
      ? raw.tags.map((tag) => String(tag).trim()).filter(Boolean)
      : [],
  };
}

export function getAmazonProducts(): AmazonProduct[] {
  try {
    if (!fs.existsSync(AMAZON_LINKS_PATH)) return [];
    const parsed = JSON.parse(fs.readFileSync(AMAZON_LINKS_PATH, 'utf8')) as { products?: unknown[] };
    if (!Array.isArray(parsed.products)) return [];
    return parsed.products
      .map((item) => sanitizeProduct(item))
      .filter((item): item is AmazonProduct => item !== null);
  } catch (_error) {
    return [];
  }
}

export const AMAZON_PRODUCTS: Record<string, AmazonProduct> = Object.fromEntries(
  getAmazonProducts().map((product, index) => [product.id || String(index + 1), product])
);

export function selectProductsForPost(tags: string[], contentHtml: string): AmazonProduct[] {
  const products = getAmazonProducts();
  const postTags = tags.map((tag) => normalizeText(tag));
  const contentLower = normalizeText(contentHtml);
  const combinedSignals = `${postTags.join(' ')} ${contentLower}`;

  const scoredProducts = products.map((product) => {
    let score = 0;
    let strongSignal = false;

    for (const productTag of product.tags || []) {
      const normalizedProductTag = normalizeText(productTag);
      if (!normalizedProductTag) continue;

      if (postTags.some((postTag) => postTag === normalizedProductTag)) {
        score += 40;
        strongSignal = true;
      } else if (
        postTags.some((postTag) => postTag.includes(normalizedProductTag)) ||
        contentLower.includes(normalizedProductTag)
      ) {
        score += 24;
        strongSignal = true;
      }
    }

    const matchingNameTokens = tokenize(product.name).filter((token) => combinedSignals.includes(token));
    if (matchingNameTokens.length > 0) {
      score += matchingNameTokens.length * 12;
      strongSignal = true;
    }

    const category = normalizeText(product.category || '');
    if (category && postTags.some((postTag) => postTag === category || postTag.includes(category))) {
      score += 8;
    }

    return { product, score, strongSignal };
  });

  return scoredProducts
    .filter((item) => item.strongSignal && item.score >= MIN_PRODUCT_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_AFFILIATE_PRODUCTS)
    .map((item) => item.product);
}

function generateProductCard(product: AmazonProduct): string {
  const price = product.price ? `<span class="amazon-product-price">${product.price}</span>` : '';

  return `
    <div class="amazon-product-card">
      <div class="amazon-product-card-content">
        <h4 class="amazon-product-name">${product.name}</h4>
        ${product.description ? `<p class="amazon-product-description">${product.description}</p>` : ''}
        ${price}
        <a href="${product.url}" rel="nofollow sponsored noopener noreferrer" target="_blank" class="product-button">View on Amazon</a>
      </div>
    </div>
  `;
}

export function insertAmazonAffiliateSection(html: string, products: AmazonProduct[]): string {
  if (html.includes('amazon-affiliate-section')) return html;

  const selectedProducts = products.slice(0, MAX_AFFILIATE_PRODUCTS);
  if (selectedProducts.length === 0) return html;

  const cardHtml = `
<aside class="amazon-affiliate-section" aria-label="Related shopping picks">
  <h3 class="amazon-section-title">Helpful Shopping Picks</h3>
  <div class="amazon-products-grid">
    ${selectedProducts.map((product) => generateProductCard(product)).join('')}
  </div>
  <p class="amazon-disclaimer"><em>As an Amazon Associate, we earn from qualifying purchases.</em></p>
</aside>
`;

  const lateSectionMatch = html.match(
    /<h2[^>]*>[^<]*(?:FAQ|Frequently Asked|Conclusion|Final|The Easiest Rule|Bottom Line)[^<]*<\/h2>/i
  );
  if (lateSectionMatch) {
    const insertIndex = html.indexOf(lateSectionMatch[0]);
    return html.slice(0, insertIndex) + cardHtml + html.slice(insertIndex);
  }

  const lastHrMatch = html.lastIndexOf('<hr>');
  if (lastHrMatch !== -1) {
    return html.slice(0, lastHrMatch) + cardHtml + html.slice(lastHrMatch);
  }

  return html + cardHtml;
}

export function addLazyLoadingToImages(html: string): string {
  return html.replace(/<img([^>]*)>/g, (match, attributes) => {
    if (attributes.includes('loading=')) {
      return match;
    }
    return `<img${attributes} loading="lazy">`;
  });
}

export function convertToParallelImageGrid(html: string): string {
  const pattern = /(<p[^>]*><img[^>]*><\/p>)[\s\n\r]*(<p[^>]*><img[^>]*><\/p>)/g;

  return html.replace(pattern, (_match, img1, img2) => {
    return `<div class="image-grid-2">${img1}${img2}</div>`;
  });
}

export function convertYouTubeLinksToEmbeds(html: string): string {
  const youtubePattern =
    /<p><a[^>]*href="(https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)[^"]*)"[^>]*>.*?<\/a><\/p>/g;

  html = html.replace(youtubePattern, (_match, _fullUrl, videoId) => {
    return `
      <div class="youtube-embed-container">
        <iframe
          width="100%"
          height="400"
          src="https://www.youtube.com/embed/${videoId}"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>
    `;
  });

  const plainYoutubePattern =
    /<p>(https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)[^<]*)<\/p>/g;

  return html.replace(plainYoutubePattern, (_match, _fullUrl, videoId) => {
    return `
      <div class="youtube-embed-container">
        <iframe
          width="100%"
          height="400"
          src="https://www.youtube.com/embed/${videoId}"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>
    `;
  });
}

function mergeRel(existingRel: string, required: string[]): string {
  const values = new Set(
    existingRel
      .split(/\s+/)
      .map((item) => item.trim())
      .filter(Boolean)
  );

  for (const item of required) {
    values.add(item);
  }

  return Array.from(values).join(' ');
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href) && !/^https?:\/\/(?:www\.)?epickor\.com(?:\/|$)/i.test(href);
}

function isAmazonHref(href: string): boolean {
  return /^https?:\/\/(?:www\.)?(?:amzn\.to|amazon\.com)\b/i.test(href);
}

export function addTargetToExternalLinks(html: string): string {
  return html.replace(/<a\b([^>]*)>/gi, (match, attributes: string) => {
    const hrefMatch = attributes.match(/\bhref=(["'])(.*?)\1/i);
    if (!hrefMatch) return match;

    const href = hrefMatch[2];
    if (!isExternalHref(href)) return match;

    let nextAttributes = attributes;

    if (/\btarget=/i.test(nextAttributes)) {
      nextAttributes = nextAttributes.replace(/\btarget=(["'])(.*?)\1/i, 'target="_blank"');
    } else {
      nextAttributes += ' target="_blank"';
    }

    const requiredRel = isAmazonHref(href)
      ? ['nofollow', 'sponsored', 'noopener', 'noreferrer']
      : ['noopener', 'noreferrer'];

    if (/\brel=/i.test(nextAttributes)) {
      nextAttributes = nextAttributes.replace(/\brel=(["'])(.*?)\1/i, (_relMatch, _quote, relValue) => {
        return `rel="${mergeRel(relValue, requiredRel)}"`;
      });
    } else {
      nextAttributes += ` rel="${requiredRel.join(' ')}"`;
    }

    return `<a${nextAttributes}>`;
  });
}

export function convertInternalLinksToCards(
  html: string,
  allPosts: InternalPostReference[],
  basePath: 'blog' | 'business' = 'blog'
): string {
  const internalLinkPattern = new RegExp(
    `<a[^>]*href="(?:https?:\\/\\/(?:www\\.)?epickor\\.com)?\\/${basePath}\\/([^"]+)"[^>]*>([^<]+)<\\/a>`,
    'g'
  );

  return html.replace(internalLinkPattern, (match, slug) => {
    const post = allPosts.find((item) => item.slug === slug);

    if (!post) {
      return match;
    }

    return `
      <a href="/${basePath}/${slug}" class="internal-link-card">
        <div class="internal-link-card-content">
          ${post.ogImage ? `<img src="${post.ogImage}" alt="${post.title}" loading="lazy" />` : '<div class="internal-link-card-placeholder">EK</div>'}
          <div class="internal-link-card-text">
            <h4>${post.title}</h4>
            <p>${post.description || ''}</p>
          </div>
        </div>
      </a>
    `;
  });
}

export function enhanceMarkdownHTML(
  html: string,
  allPosts: InternalPostReference[] = [],
  postTags: string[] = [],
  enableAffiliate: boolean = false,
  internalLinkBasePath: 'blog' | 'business' = 'blog'
): string {
  let enhanced = html;

  enhanced = addLazyLoadingToImages(enhanced);
  enhanced = convertToParallelImageGrid(enhanced);
  enhanced = convertYouTubeLinksToEmbeds(enhanced);

  if (allPosts.length > 0) {
    enhanced = convertInternalLinksToCards(enhanced, allPosts, internalLinkBasePath);
  }

  if (enableAffiliate) {
    const selectedProducts = selectProductsForPost(postTags, enhanced);
    enhanced = insertAmazonAffiliateSection(enhanced, selectedProducts);
  }

  enhanced = addTargetToExternalLinks(enhanced);

  return enhanced;
}

export function generateProductSchema(products: AmazonProduct[]): string {
  const productSchemas = products
    .filter((product) => product.price && product.image)
    .map((product) => ({
      '@type': 'Product',
      name: product.name,
      description: product.description,
      url: product.url,
      image: product.image,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: product.url,
      },
    }));

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': productSchemas,
  });
}
