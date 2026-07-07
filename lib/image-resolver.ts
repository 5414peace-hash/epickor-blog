/**
 * Dynamic Image Path Resolver
 * - Resolves all image paths to /assets/images/posts/[post_id]/ at runtime
 * - Auto-centers all images
 * - Converts consecutive images to 50:50 grid
 */

/**
 * Extract post ID from slug (e.g., "088-unique-things" → "088")
 */
export function extractPostId(slug: string): string {
  const match = slug.match(/^(\d+)/);
  return match ? match[1] : slug;
}

/**
 * Resolve image paths dynamically
 * Converts any image path to /assets/images/posts/[post_id]/filename
 */
export function resolveImagePaths(
  html: string,
  postSlug: string,
  assetBasePath: string = '/assets/images/posts'
): string {
  const postId = extractPostId(postSlug);
  
  // Match all <img> tags
  const imgPattern = /<img([^>]*)src="([^"]+)"([^>]*)>/g;
  
  return html.replace(imgPattern, (match, before, src, after) => {
    const rawSrc = String(src || '').trim();
    if (!rawSrc) {
      return '';
    }

    let decodedSrc = rawSrc;
    try {
      decodedSrc = decodeURIComponent(rawSrc);
    } catch (_e) {
      // Keep original value.
    }

    // Ignore unresolved template placeholders such as {{IMAGE_1}}.
    if (/\{\{[^}]+\}\}/.test(decodedSrc)) {
      return '';
    }

    // Skip if already an absolute URL or external image
    if (rawSrc.startsWith('http://') || rawSrc.startsWith('https://') || rawSrc.startsWith('//')) {
      return match;
    }

    // Preserve explicit site asset paths. These may intentionally reference
    // another post's deployed image folder.
    if (rawSrc.startsWith('/assets/')) {
      return match;
    }
    
    // Extract filename from path
    const filename = rawSrc.split('/').pop() || rawSrc;
    
    // Construct new path
    const normalizedBasePath = assetBasePath.replace(/\/$/, '');
    const newSrc = `${normalizedBasePath}/${postId}/${filename}`;
    
    return `<img${before}src="${newSrc}"${after}>`;
  });
}

/**
 * Force center alignment for all images
 */
export function centerAlignImages(html: string): string {
  // Markdown images followed immediately by an italic caption become
  // <p><img><em>caption</em></p>. Split that into valid block markup.
  html = html.replace(
    /<p>\s*(<img[^>]*>)\s*(<em>[\s\S]*?<\/em>)\s*<\/p>/g,
    '<figure class="image-figure"><p class="image-center">$1</p><figcaption>$2</figcaption></figure>'
  );

  // Add class to remaining image-only paragraphs.
  html = html.replace(/<p>\s*(<img[^>]*>)\s*<\/p>/g, '<p class="image-center">$1</p>');

  return html;
}

/**
 * Convert consecutive images to 50:50 grid with proper spacing
 */
export function autoGridLayout(html: string): string {
  // Match two consecutive <p><img></p> patterns
  const pattern = /(<p class="image-center"><img[^>]*><\/p>)\s*(<p class="image-center"><img[^>]*><\/p>)/g;
  
  return html.replace(pattern, (match, img1, img2) => {
    return `<div class="image-grid-2">${img1}${img2}</div>`;
  });
}

/**
 * Apply all image processing
 */
export function processImages(
  html: string,
  postSlug: string,
  assetBasePath: string = '/assets/images/posts'
): string {
  let processed = html;
  
  // 1. Resolve image paths
  processed = resolveImagePaths(processed, postSlug, assetBasePath);
  
  // 2. Center align all images
  processed = centerAlignImages(processed);
  
  // 3. Auto grid layout for consecutive images
  processed = autoGridLayout(processed);
  
  return processed;
}
