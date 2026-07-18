# Sitewide SVG image replacement - 2026-07-18

## Reason

After the representative objected to rewritten posts passing with SVG helper graphics instead of relevant images, the image gate was tightened again from "recent legacy rewrites only" to the stricter sitewide public-post standard:

- Public Markdown body images and `ogImage` should not point to SVG files.
- Topic-fit raster images should be preferred, with source records for new external assets.
- Automated SEO/reviewer scores do not count as image approval.

## Scope

The remaining public posts with SVG references were:

`261`, `265`, `268`, `269`, `270`, `271`, `272`, `273`, `275`, `276`, `283`, `287`, `305`

These were mostly newer posts with one supporting map/logo/decision SVG alongside raster images, but they were still corrected to align with the stricter visual standard.

## Changes

- Replaced all 13 remaining SVG body-image slots with raster images.
- Used existing unused raster assets where available:
  - Blog `272`: `toy-store-plush-display.jpg`
  - Blog `287`: `home-korean-bbq-electric-grill.webp`
- Added new Pexels raster images for the other replacements:
  - Blog `261`: stock-market trading monitors.
  - Blog `265`: semiconductor circuit-board close-up.
  - Blog `268`: makeup shade testing.
  - Blog `269`: LED skincare treatment.
  - Blog `270`: bakery bread display.
  - Blog `271`: under-eye patch skincare routine.
  - Blog `273`: car camping campsite.
  - Blog `275`: South Korea Kodak/camera store.
  - Blog `276`: barber tools.
  - Blog `283`: ballot box and ballot-hands election images.
  - Blog `305`: fabric-wrapped gift.
- Converted Blog `276`'s referenced generated PNG images to JPG siblings and updated references so all scoped referenced images stay under 400KB.
- Updated each affected `image-sources.md` file with the new source details.

## Verification

- Sitewide public SVG check: pass.
  - Public Markdown body images plus `ogImage`: `0` SVG references.
- Targeted referenced-image check for the 13 corrected posts: pass.
  - No SVG references.
  - No missing local image files.
  - No referenced image above 400KB.
- Contact sheet review: passed for the 13 corrected posts after manual visual inspection.
- `npm.cmd run audit:seo-aeo` - pass, average `99/100`.
- `npm.cmd run audit:amazon-links` - pass.
- `git diff --check` - pass, CRLF warnings only.
- `npm.cmd run build` - pass, 363 static pages.
- Implementation commit `018bc818` is on `origin/master`.
- Vercel deployment `dpl_BbJ8AA46eukBsFTXdKSBPKhJGtj6` (`https://epickor-blog-f6gwinvh3-yhs-projects-5de403d3.vercel.app`) is Ready and aliased to `www.epickor.com`.
- Public QA passed for representative pages `261`, `268`, `276`, `283`, `287`, and `305`.
  - New raster image markers are present in the public HTML.
  - Removed SVG markers are absent from the public HTML.
  - Representative replacement image assets return HTTP 200.

## Follow-up discovered

A broader referenced-image audit also surfaced pre-existing non-SVG image debt in older posts:

- Some older public posts still reference percent-encoded image filenames that the narrow local check reports as missing.
- Some older public posts still reference PNG images above 400KB.

This was not part of the SVG replacement pass, and no current SVG references remain. Recommended next work is a separate "broken/oversized referenced image cleanup" pass that resolves those older encoded paths and converts oversized referenced PNGs to optimized JPG/WebP siblings.
