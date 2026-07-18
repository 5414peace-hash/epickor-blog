# Public blog image reference cleanup - 2026-07-18

## Reason

After the stricter SVG replacement pass, a narrower audit was added for images that public blog posts actually reference. This avoids two recurring problems:

- Public posts depending on percent-encoded legacy filenames such as `%25EC...`.
- Public posts directly serving referenced PNG assets above the current 400 KB article-image budget.

This pass did not rewrite article text, publish dates, titles, descriptions, affiliate CTAs, or source claims. It only changed image file references and added optimized/safe sibling files.

## Changes

- Added `npm.cmd run audit:image-refs`.
- Added `scripts/audit-blog-image-references.mjs` to check public blog `ogImage`, Markdown images, and HTML image tags.
- Replaced `32` percent-encoded legacy frame references with safe ASCII `legacy-frame-xx.jpg` copies.
- Converted `76` referenced PNG assets above 400 KB to JPG siblings and updated the active public blog references.
- Touched `54` public blog Markdown files only for image URL swaps.
- Preserved the original legacy image files instead of deleting them.

## Verification

- `npm.cmd run audit:image-refs` - pass.
  - Referenced local images: `1181`.
  - Missing: `0`.
  - Percent-encoded references resolving only after decode: `0`.
  - SVG references: `0`.
  - Over 400 KB: `0`.
  - Over 1200 KB: `0`.
- `rg "%25" content\blog` - no matches.
- `git diff --check` - pass, CRLF warnings only.
- `npm.cmd run audit:seo-aeo` - pass, average `99/100`.
- `npm.cmd run audit:amazon-links` - pass.
- `npm.cmd run build` - pass, 363 static pages.
- Implementation commit `e01d1a8f` is on `origin/master`.
- Vercel deployment `dpl_6wLPUHz4LqTugDEmYT2whTLe2XE8` (`https://epickor-blog-51s5umrxd-yhs-projects-5de403d3.vercel.app`) is Ready and aliased to `www.epickor.com`.
- Public QA passed representative pages `029`, `044`, `203`, `205`, `248`, and `285`.
  - New JPG or `legacy-frame-xx.jpg` markers are present in public HTML.
  - Removed PNG or `%25EC` markers are absent from public HTML.
  - Representative replacement image assets return HTTP 200.

## Notes

The active public references are now cleaner than the broader file tree. Some original PNG or percent-encoded files may remain in `public/assets/images/posts/` as unreferenced legacy assets, but they are no longer used by public blog Markdown or `ogImage`.
