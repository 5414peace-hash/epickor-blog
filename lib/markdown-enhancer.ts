/**
 * Advanced Markdown Content Enhancer
 * - Parallel image grid (2 consecutive images → 50:50 layout)
 * - Lazy loading for all images
 * - YouTube embed conversion
 * - Internal link rich cards
 * - Amazon product cards with styled UI
 * - AUTO-INJECTION: Amazon cards inserted at runtime (middle + bottom)
 */

export interface AmazonProduct {
  name: string;
  url: string;
  description: string;
  tags?: string[]; // Tags for smart matching
}

export const AMAZON_PRODUCTS: Record<string, AmazonProduct> = {
  korean_snack: {
    name: "Korean Snack Box",
    url: "https://amzn.to/4bubOGe",
    description: "Bring the taste of Korea to your home with this authentic snack collection",
    tags: ['Food', 'Travel', 'Shopping']
  },
  bibigo_seaweed: {
    name: "Bibigo Seaweed Snack",
    url: "https://amzn.to/4qhhWVZ",
    description: "Crispy, savory Korean seaweed snacks perfect for any time",
    tags: ['Food']
  },
  yakgwa: {
    name: "Yakgwa (Honey Cookie)",
    url: "https://amzn.to/3O5pcqu",
    description: "Traditional Korean honey cookies with a delightful sweet flavor",
    tags: ['Food', 'Culture']
  },
  buldak_ramen: {
    name: "Buldak Spicy Ramen",
    url: "https://amzn.to/3MaZWi6",
    description: "Experience the legendary spicy Korean ramen",
    tags: ['Food', 'Shopping']
  },
  buldak_tteokbokki: {
    name: "Buldak Tteokbokki",
    url: "https://amzn.to/4ae69Sg",
    description: "Spicy Korean rice cakes ready in minutes",
    tags: ['Food']
  },
  dokdo_toner: {
    name: "Round Lab Dokdo Toner",
    url: "https://amzn.to/4twhKFk",
    description: "Hydrating K-beauty toner for radiant skin",
    tags: ['Woman', 'Beauty', 'Shopping']
  },
  dokdo_cleanser: {
    name: "Round Lab Dokdo Cleanser",
    url: "https://amzn.to/3M4Q09W",
    description: "Gentle K-beauty cleanser for daily skincare",
    tags: ['Woman', 'Beauty', 'Shopping']
  },
  ssamjang: {
    name: "Ssamjang (Soybean Paste)",
    url: "https://amzn.to/467PaA7",
    description: "Essential Korean dipping sauce for BBQ and wraps",
    tags: ['Food', 'Culture']
  },
  gochujang: {
    name: "Gochujang (Chili Paste)",
    url: "https://amzn.to/3UuA6fM",
    description: "The iconic Korean chili paste that adds depth to any dish",
    tags: ['Food', 'Culture']
  },
  hangeul_workbook: {
    name: "Hangeul Workbook",
    url: "https://amzn.to/3Zgx6Qq",
    description: "Master the Korean alphabet with this beginner-friendly guide",
    tags: ['Culture', 'Education']
  },
  ramen_pot: {
    name: "Yellow Ramen Pot",
    url: "https://amzn.to/495n6oT",
    description: "The iconic Korean ramen pot for authentic cooking experience",
    tags: ['Food', 'Shopping']
  },
  chopsticks: {
    name: "Stainless Steel Chopsticks",
    url: "https://amzn.to/3M9S92F",
    description: "Traditional Korean metal chopsticks for everyday use",
    tags: ['Food', 'Culture', 'Shopping']
  }
};

/**
 * Smart product matching based on post tags and content
 */
export function selectProductsForPost(tags: string[], contentHtml: string): AmazonProduct[] {
  const products = Object.values(AMAZON_PRODUCTS);
  
  // Score each product based on tag overlap
  const scoredProducts = products.map(product => {
    let score = 0;
    
    // Tag matching (highest priority)
    if (product.tags) {
      const matchingTags = product.tags.filter(tag => 
        tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
      );
      score += matchingTags.length * 10;
    }
    
    // Content matching (secondary)
    const contentLower = contentHtml.toLowerCase();
    if (product.tags) {
      product.tags.forEach(tag => {
        if (contentLower.includes(tag.toLowerCase())) {
          score += 2;
        }
      });
    }
    
    // Keyword matching
    if (contentLower.includes('food') || contentLower.includes('eat')) {
      if (product.tags?.includes('Food')) score += 5;
    }
    if (contentLower.includes('beauty') || contentLower.includes('skin')) {
      if (product.tags?.includes('Beauty') || product.tags?.includes('Woman')) score += 5;
    }
    
    return { product, score };
  });
  
  // Sort by score and return top products
  scoredProducts.sort((a, b) => b.score - a.score);
  
  // Return top 3 products (1 for middle, 2 for bottom)
  return scoredProducts.slice(0, 3).map(item => item.product);
}

/**
 * Generate Amazon product card HTML
 */
function generateProductCard(product: AmazonProduct): string {
  return `
    <div class="amazon-product-card">
      <h4>${product.name}</h4>
      <p>${product.description}</p>
      <a href="${product.url}" rel="nofollow sponsored" target="_blank" class="product-button">Shop on Amazon →</a>
    </div>
  `;
}

/**
 * Insert middle Amazon card (after first H2/H3, excluding Keywords section)
 */
export function insertMiddleAmazonCard(html: string, product: AmazonProduct): string {
  // Check if card already exists
  if (html.includes("Editor's Pick")) {
    return html; // Already has card, skip
  }
  
  // Strategy 1: Insert after first H2 (main section heading)
  const h2Match = html.match(/(<h2[^>]*>.*?<\/h2>)/);
  if (h2Match) {
    const h2Index = html.indexOf(h2Match[0]) + h2Match[0].length;
    const cardHtml = `
<h3>Editor's Pick</h3>
${generateProductCard(product)}
<p class="amazon-disclaimer"><em>As an Amazon Associate, we earn from qualifying purchases.</em></p>
`;
    return html.slice(0, h2Index) + cardHtml + html.slice(h2Index);
  }
  
  // Strategy 2: Insert after first H3 that's NOT "Keywords"
  const h3Matches = html.match(/<h3[^>]*>.*?<\/h3>/g);
  if (h3Matches) {
    for (const h3 of h3Matches) {
      if (!h3.toLowerCase().includes('keyword')) {
        const h3Index = html.indexOf(h3) + h3.length;
        const cardHtml = `
<h3>Editor's Pick</h3>
${generateProductCard(product)}
<p class="amazon-disclaimer"><em>As an Amazon Associate, we earn from qualifying purchases.</em></p>
`;
        return html.slice(0, h3Index) + cardHtml + html.slice(h3Index);
      }
    }
  }
  
  // Strategy 3: Insert after 4th paragraph (middle of content)
  const paragraphs = html.match(/<p[^>]*>.*?<\/p>/g);
  if (paragraphs && paragraphs.length >= 4) {
    const fourthParagraph = paragraphs[3];
    const insertIndex = html.indexOf(fourthParagraph) + fourthParagraph.length;
    const cardHtml = `
<h3>Editor's Pick</h3>
${generateProductCard(product)}
<p class="amazon-disclaimer"><em>As an Amazon Associate, we earn from qualifying purchases.</em></p>
`;
    return html.slice(0, insertIndex) + cardHtml + html.slice(insertIndex);
  }
  
  return html; // Fallback: no insertion
}

/**
 * Insert bottom Amazon cards (before Keywords section or at end)
 */
export function insertBottomAmazonCards(html: string, products: AmazonProduct[]): string {
  // Check if cards already exist
  if (html.includes("Editor's Picks for You")) {
    return html; // Already has cards, skip
  }
  
  // Take 2 products for bottom section
  const bottomProducts = products.slice(0, 2);
  if (bottomProducts.length === 0) {
    return html;
  }
  
  const cardHtml = `
<h3>Editor's Picks for You</h3>
<div class="amazon-product-grid">
  ${bottomProducts.map(p => generateProductCard(p)).join('')}
</div>
<p class="amazon-disclaimer"><em>As an Amazon Associate, we earn from qualifying purchases.</em></p>
`;
  
  // Strategy 1: Insert before Keywords section
  const keywordsMatch = html.match(/(<h3[^>]*>Keywords<\/h3>)/i);
  if (keywordsMatch) {
    const keywordsIndex = html.indexOf(keywordsMatch[0]);
    return html.slice(0, keywordsIndex) + cardHtml + html.slice(keywordsIndex);
  }
  
  // Strategy 2: Insert before last horizontal rule
  const lastHrMatch = html.lastIndexOf('<hr>');
  if (lastHrMatch !== -1) {
    return html.slice(0, lastHrMatch) + cardHtml + html.slice(lastHrMatch);
  }
  
  // Strategy 3: Append at end
  return html + cardHtml;
}

/**
 * Add lazy loading to all images
 */
export function addLazyLoadingToImages(html: string): string {
  return html.replace(/<img([^>]*)>/g, (match, attributes) => {
    if (attributes.includes('loading=')) {
      return match; // Already has loading attribute
    }
    return `<img${attributes} loading="lazy">`;
  });
}

/**
 * Convert consecutive images to parallel grid
 */
export function convertToParallelImageGrid(html: string): string {
  // Match two consecutive <p><img></p> patterns
  const pattern = /(<p><img[^>]*><\/p>)\s*(<p><img[^>]*><\/p>)/g;
  
  return html.replace(pattern, (match, img1, img2) => {
    return `<div class="image-grid-2">${img1}${img2}</div>`;
  });
}

/**
 * Convert YouTube links to embeds
 */
export function convertYouTubeLinksToEmbeds(html: string): string {
  // Match YouTube URLs (various formats)
  const youtubePattern = /<p><a[^>]*href="(https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)[^"]*)"[^>]*>.*?<\/a><\/p>/g;
  
  html = html.replace(youtubePattern, (match, fullUrl, videoId) => {
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
  
  // Also handle plain text YouTube links
  const plainYoutubePattern = /<p>(https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)[^<]*)<\/p>/g;
  
  return html.replace(plainYoutubePattern, (match, fullUrl, videoId) => {
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

/**
 * Convert internal blog links to rich cards
 */
export function convertInternalLinksToCards(html: string, allPosts: any[]): string {
  // Match epickor.com/blog/XXX links
  const internalLinkPattern = /<a[^>]*href="https?:\/\/(?:www\.)?epickor\.com\/blog\/([^"]+)"[^>]*>([^<]+)<\/a>/g;
  
  return html.replace(internalLinkPattern, (match, slug, linkText) => {
    // Find the post by slug
    const post = allPosts.find(p => p.slug === slug);
    
    if (!post) {
      return match; // Keep original link if post not found
    }
    
    return `
      <a href="/blog/${slug}" class="internal-link-card">
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

/**
 * Apply all enhancements to HTML content
 * NEW: Auto-inject Amazon cards based on post tags
 */
export function enhanceMarkdownHTML(
  html: string, 
  allPosts: any[] = [],
  postTags: string[] = []
): string {
  let enhanced = html;
  
  // 1. Add lazy loading to images
  enhanced = addLazyLoadingToImages(enhanced);
  
  // 2. Convert consecutive images to parallel grid
  enhanced = convertToParallelImageGrid(enhanced);
  
  // 3. Convert YouTube links to embeds
  enhanced = convertYouTubeLinksToEmbeds(enhanced);
  
  // 4. Convert internal links to rich cards
  if (allPosts.length > 0) {
    enhanced = convertInternalLinksToCards(enhanced, allPosts);
  }
  
  // 5. AUTO-INJECT Amazon cards
  const selectedProducts = selectProductsForPost(postTags, enhanced);
  
  // Insert middle card (1 product)
  if (selectedProducts.length > 0) {
    enhanced = insertMiddleAmazonCard(enhanced, selectedProducts[0]);
  }
  
  // Insert bottom cards (2 products)
  if (selectedProducts.length >= 2) {
    enhanced = insertBottomAmazonCards(enhanced, selectedProducts.slice(1, 3));
  }
  
  return enhanced;
}

/**
 * Generate JSON-LD structured data for Amazon products
 */
export function generateProductSchema(products: AmazonProduct[]): string {
  const productSchemas = products.map(product => ({
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "url": product.url,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Amazon"
      }
    }
  }));
  
  const schema = {
    "@context": "https://schema.org",
    "@graph": productSchemas
  };
  
  return JSON.stringify(schema);
}
