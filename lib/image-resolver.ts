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
export function resolveImagePaths(html: string, postSlug: string): string {
  const postId = extractPostId(postSlug);
  
  // Match all <img> tags
  const imgPattern = /<img([^>]*)src="([^"]+)"([^>]*)>/g;
  
  return html.replace(imgPattern, (match, before, src, after) => {
    // Skip if already an absolute URL or external image
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('//')) {
      return match;
    }
    
    // Extract filename from path
    const filename = src.split('/').pop() || src;
    
    // Construct new path
    const newSrc = `/assets/images/posts/${postId}/${filename}`;
    
    return `<img${before}src="${newSrc}"${after}>`;
  });
}

/**
 * Force center alignment for all images
 */
export function centerAlignImages(html: string): string {
  // Add center alignment class to all <p> tags containing images
  return html.replace(/<p>(<img[^>]*>)<\/p>/g, '<p class="image-center">$1</p>');
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
export function processImages(html: string, postSlug: string): string {
  let processed = html;
  
  // 1. Resolve image paths
  processed = resolveImagePaths(processed, postSlug);
  
  // 2. Center align all images
  processed = centerAlignImages(processed);
  
  // 3. Auto grid layout for consecutive images
  processed = autoGridLayout(processed);
  
  return processed;
}
