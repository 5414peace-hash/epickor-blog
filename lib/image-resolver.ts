/**
 * Dynamic Image Path Resolver
 * - Resolves all image paths to /assets/images/posts/[post_id]/ at runtime
 * - Auto-centers all images
 * - Converts consecutive images to 50:50 grid
 */

import { isPortraitImage } from './image-dimensions';

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
 * Mark portrait images so CSS can treat them differently.
 *
 * A 9:16 image under the normal rules renders screen-width by 1.78x that in
 * height, which on a phone is taller than the viewport — it stops reading as
 * an illustration inside an article and becomes a full-bleed interruption.
 * Landscape photographs have no such problem, so the constraint has to be
 * applied selectively, and CSS cannot ask about aspect ratio on its own.
 */
function tagPortrait(imgTag: string): boolean {
  const src = imgTag.match(/src="([^"]+)"/)?.[1];
  return src ? isPortraitImage(src) : false;
}

/**
 * Force center alignment for all images
 */
export function centerAlignImages(html: string): string {
  // Markdown images followed immediately by an italic caption become
  // <p><img><em>caption</em></p>. Split that into valid block markup.
  html = html.replace(
    /<p>\s*(<img[^>]*>)\s*(<em>[\s\S]*?<\/em>)\s*<\/p>/g,
    (_match, img: string, caption: string) => {
      const portrait = tagPortrait(img) ? ' is-portrait' : '';
      return `<figure class="image-figure${portrait}"><p class="image-center">${img}</p><figcaption>${caption}</figcaption></figure>`;
    }
  );

  // Add class to remaining image-only paragraphs.
  html = html.replace(/<p>\s*(<img[^>]*>)\s*<\/p>/g, (_match, img: string) => {
    const portrait = tagPortrait(img) ? ' is-portrait' : '';
    return `<p class="image-center${portrait}">${img}</p>`;
  });

  return html;
}

/**
 * Convert consecutive images to 50:50 grid with proper spacing
 */
export function autoGridLayout(html: string): string {
  // Match two consecutive <p><img></p> patterns
  const pattern = /(<p class="image-center[^"]*"><img[^>]*><\/p>)\s*(<p class="image-center[^"]*"><img[^>]*><\/p>)/g;

  return html.replace(pattern, (match, img1, img2) => {
    return `<div class="image-grid-2">${img1}${img2}</div>`;
  });
}

/**
 * Collapse duplicate and legacy image-grid wrappers into a single grid.
 *
 * Three separate things wrap image pairs: `autoGridLayout` here,
 * `convertToParallelImageGrid` in markdown-enhancer, and a hand-written
 * `<div class="image-grid-2up">` that an old admin bulk-update tool baked into
 * a number of post files. Running them in sequence produced
 * `.image-grid-2up > .image-grid-2 > .image-grid-2`, and because each grid
 * splits its container in half, the images ended up a quarter of the column
 * width with the right half of the row empty. Observed live on `082`.
 *
 * Rather than trying to make every producer aware of the others, normalise at
 * the end: strip the legacy wrapper and flatten any nesting.
 */
export function normalizeImageGrids(html: string): string {
  // The legacy wrapper has no styles on the site, so it only ever added a
  // nesting level. Unwrap it.
  html = html.replace(
    /<div class="image-grid-2up">\s*([\s\S]*?)\s*<\/div>\s*(?=<\/div>|<[a-z]|$)/g,
    (match, inner: string) => (inner.includes('image-grid-2') ? inner : match)
  );

  // Flatten grid-inside-grid, repeatedly, since nesting can be several deep.
  let previous: string;
  do {
    previous = html;
    html = html.replace(
      /<div class="image-grid-2">\s*(<div class="image-grid-2">[\s\S]*?<\/div>)\s*<\/div>/g,
      '$1'
    );
  } while (html !== previous);

  return html;
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

  // 4. Collapse legacy and duplicate grid wrappers
  processed = normalizeImageGrids(processed);

  return processed;
}
