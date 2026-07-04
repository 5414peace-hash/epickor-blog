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
  // 1. First, wrap standalone <img> tags with <p class="image-center">
  // Match: <img> NOT already inside <p> tags
  html = html.replace(/(<img[^>]*>)/g, (match) => {
    // Check if already wrapped in <p>
    return `<p class="image-center">${match}</p>`;
  });
  
  // 2. Clean up double-wrapped <p><p class="image-center"><img></p></p>
  html = html.replace(/<p>(<p class="image-center"><img[^>]*><\/p>)<\/p>/g, '$1');
  
  // 3. Add class to existing <p><img></p> patterns
  html = html.replace(/<p>(<img[^>]*>)<\/p>/g, '<p class="image-center">$1</p>');
  
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
