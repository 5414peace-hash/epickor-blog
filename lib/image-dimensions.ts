import portraitImages from './generated/portrait-images.json';

/**
 * Orientation lookup for local post images.
 *
 * Why this exists: layout decisions depend on whether an image is portrait.
 * A 1080x1920 Reels thumbnail and a 1400x900 photograph cannot use the same
 * rules — a portrait image at full column width becomes taller than the phone
 * screen, and in the hero it gets cropped through the middle of its headline.
 * CSS has no aspect-ratio selector, so orientation has to be resolved while
 * the HTML is being built.
 *
 * Why a generated manifest rather than reading the files here: `public/` is
 * 1.7 GB. A first version of this read image headers with `readFileSync` at
 * render time, and Next.js traced `public/` into the serverless bundle — the
 * `blog/[slug]` function came out at 418 MB against a 250 MB limit and the
 * deployment was rejected. Note that the build itself passed, so a green
 * `next build` is not evidence that filesystem access here is safe.
 *
 * The manifest is produced by `scripts/build-image-dimensions.mjs`, which runs
 * as part of `npm run build`. It is committed so that dev and preview work
 * without a separate step. After adding images, either run a build or run that
 * script directly; an image missing from the manifest is simply treated as
 * landscape, which is the pre-existing behaviour.
 */

const portraitSet = new Set<string>(portraitImages as string[]);

/**
 * True when an image is meaningfully taller than it is wide (height/width of
 * at least 1.2). The threshold keeps near-square photographs out of the
 * portrait branch — those look fine under the normal rules, and only genuinely
 * tall images, including every 9:16 Reels frame, need the constrained
 * treatment.
 *
 * Unknown paths — remote URLs, SVGs, and anything not in the manifest — return
 * false so callers fall back to the normal layout.
 */
export function isPortraitImage(srcPath: string): boolean {
  if (!srcPath || !srcPath.startsWith('/')) return false;
  if (portraitSet.has(srcPath)) return true;

  // Post filenames are sometimes percent-encoded in markdown but stored
  // decoded on disk, and occasionally the reverse, so check both spellings.
  try {
    const decoded = decodeURIComponent(srcPath);
    if (decoded !== srcPath && portraitSet.has(decoded)) return true;
  } catch {
    // Malformed escape sequence — nothing further to try.
  }
  try {
    const encoded = encodeURI(srcPath);
    if (encoded !== srcPath && portraitSet.has(encoded)) return true;
  } catch {
    // Ditto.
  }

  return false;
}
