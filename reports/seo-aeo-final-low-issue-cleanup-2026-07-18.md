# SEO/AEO final low-issue cleanup - 2026-07-18

## Reason

After the high-priority weak-content, image, latest-feed, and legacy cleanup passes, the remaining SEO/AEO audit issues were low-priority structural issues:

- `title-length-out-of-range`: 26 posts.
- `stale-content`: 15 posts.
- `low-internal-linking`: 8 posts.

This pass clears those remaining audit issues without rewriting article bodies or changing publish dates.

## Changes

- Shortened or clarified titles for 26 newer posts while preserving the search intent and year marker.
- Added `updatedAt: "2026-07-18"` to 15 already-reviewed public posts that were still being treated as stale because they only had their original publish date.
- Added contextual internal-link bridge sentences to 8 low-link posts:
  - `008` -> Korean BBQ ssam and kimchi jjigae.
  - `032` -> Korean snacks and micro-convenience.
  - `055` -> Korea work culture and micro-convenience.
  - `074` -> Korean souvenirs and Seoul tech shopping.
  - `133` -> Seoul LoL Park/LCK and board game cafes.
  - `142` -> BTS and BTS V military-service context.
  - `168` -> Seoul hiking routes and Korea rainy season.
  - `180` -> Seoul hanok experiences and palace nights.
- Regenerated `reports/seo-aeo-audit.md`.

## Verification

- `npm.cmd run audit:seo-aeo` - pass, average `100/100`.
  - Stale posts: `0`.
  - Top issue frequency: none.
  - Targeted residual issue query: `0` posts.
- `npm.cmd run audit:amazon-links` - pass.
- `npm.cmd run audit:image-refs` - pass.
  - Referenced local images: `1181`.
  - Missing: `0`.
  - Decode-only paths: `0`.
  - SVG references: `0`.
  - Over 400 KB: `0`.
- `git diff --check` - pass, CRLF warnings only.
- `npm.cmd run build` - pass, 363 static pages.

## Deployment and public QA

- Implementation commit: `6b4f0592` on `origin/master`.
- Vercel deployment: `dpl_FmEZUvAkLKE1y4SPg4wYwLBaxgcF`.
- Deployment URL: `https://epickor-blog-43ui0cjem-yhs-projects-5de403d3.vercel.app`.
- Production alias: `www.epickor.com`.
- Public QA passed for representative pages:
  - `008`: confirmed `updatedAt` marker and new links to `/blog/266` and `/blog/282`.
  - `032`: confirmed new links to `/blog/029` and `/blog/088`.
  - `133`: confirmed new links to `/blog/274` and `/blog/289`.
  - `142`: confirmed new links to `/blog/010` and `/blog/044`.
  - `271`: confirmed shortened public title.
  - `291`: confirmed shortened public title.
  - `305`: confirmed shortened public title.

## Notes

This pass intentionally keeps original `date` values unchanged. It uses `updatedAt` for freshness so Latest ordering remains based on actual publication dates rather than maintenance edits.
