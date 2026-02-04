/**
 * Advanced Markdown Content Enhancer
 * - Parallel image grid (2 consecutive images → 50:50 layout)
 * - Lazy loading for all images
 * - YouTube embed conversion
 * - Internal link rich cards
 * - Amazon product cards with styled UI
 */

export interface AmazonProduct {
  name: string;
  url: string;
  description: string;
}

export const AMAZON_PRODUCTS: Record<string, AmazonProduct> = {
  korean_snack: {
    name: "Korean Snack Box",
    url: "https://amzn.to/4bubOGe",
    description: "Bring the taste of Korea to your home with this authentic snack collection"
  },
  bibigo_seaweed: {
    name: "Bibigo Seaweed Snack",
    url: "https://amzn.to/4qhhWVZ",
    description: "Crispy, savory Korean seaweed snacks perfect for any time"
  },
  yakgwa: {
    name: "Yakgwa (Honey Cookie)",
    url: "https://amzn.to/3O5pcqu",
    description: "Traditional Korean honey cookies with a delightful sweet flavor"
  },
  buldak_ramen: {
    name: "Buldak Spicy Ramen (Carbonara)",
    url: "https://amzn.to/3MaZWi6",
    description: "Experience the viral Korean fire noodles with creamy carbonara twist"
  },
  buldak_tteokbokki: {
    name: "Buldak Tteokbokki",
    url: "https://amzn.to/4ae69Sg",
    description: "Spicy Korean rice cakes ready in minutes"
  },
  dokdo_toner: {
    name: "Round Lab Dokdo Toner",
    url: "https://amzn.to/4twhKFk",
    description: "Korea's #1 toner for hydrated, glowing skin"
  },
  dokdo_cleanser: {
    name: "Round Lab Dokdo Cleanser",
    url: "https://amzn.to/3M4Q09W",
    description: "Gentle yet effective Korean cleanser for all skin types"
  },
  ssamjang: {
    name: "Ssamjang (Soybean Paste)",
    url: "https://amzn.to/467PaA7",
    description: "Essential Korean dipping sauce for BBQ and wraps"
  },
  gochujang: {
    name: "Gochujang (Chili Paste)",
    url: "https://amzn.to/3UuA6fM",
    description: "The iconic Korean chili paste that adds depth to any dish"
  },
  hangeul_workbook: {
    name: "Hangeul Workbook",
    url: "https://amzn.to/3Zgx6Qq",
    description: "Master the Korean alphabet with this beginner-friendly guide"
  },
  ramen_pot: {
    name: "Yellow Ramen Pot",
    url: "https://amzn.to/495n6oT",
    description: "The iconic Korean ramen pot for authentic cooking experience"
  },
  chopsticks: {
    name: "Stainless Steel Chopsticks",
    url: "https://amzn.to/3M9S92F",
    description: "Traditional Korean metal chopsticks for everyday use"
  }
};

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
  
  return html.replace(youtubePattern, (match, fullUrl, videoId) => {
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
 * Enhance Amazon affiliate section with styled product cards
 */
export function enhanceAmazonAffiliateSection(html: string): string {
  // Find the "Editor's Picks for You" section
  const editorPicksPattern = /<h3[^>]*>Editor's Picks for You<\/h3>([\s\S]*?)(?=<p><em>As an Amazon Associate|$)/;
  
  return html.replace(editorPicksPattern, (match, content) => {
    // Extract product links
    const productPattern = /<p><strong><a href="([^"]+)"[^>]*>([^<]+)<\/a><\/strong><br\s*\/?>\s*([^<]+)<\/p>/g;
    
    let products: Array<{url: string, name: string, description: string}> = [];
    let productMatch;
    
    while ((productMatch = productPattern.exec(content)) !== null) {
      products.push({
        url: productMatch[1],
        name: productMatch[2],
        description: productMatch[3]
      });
    }
    
    if (products.length === 0) {
      return match; // Keep original if no products found
    }
    
    // Generate styled product cards
    const productCards = products.map(product => `
      <div class="amazon-product-card">
        <div class="amazon-product-card-content">
          <h4 class="amazon-product-name">${product.name}</h4>
          <p class="amazon-product-description">${product.description}</p>
          <a 
            href="${product.url}" 
            rel="nofollow sponsored" 
            target="_blank"
            class="amazon-product-button"
          >
            Shop on Amazon →
          </a>
        </div>
      </div>
    `).join('');
    
    return `
      <div class="amazon-affiliate-section">
        <h3 class="amazon-section-title">Editor's Picks for You</h3>
        <div class="amazon-products-grid">
          ${productCards}
        </div>
      </div>
    `;
  });
}

/**
 * Apply all enhancements to HTML content
 */
export function enhanceMarkdownHTML(html: string, allPosts: any[] = []): string {
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
  
  // 5. Enhance Amazon affiliate section
  enhanced = enhanceAmazonAffiliateSection(enhanced);
  
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
