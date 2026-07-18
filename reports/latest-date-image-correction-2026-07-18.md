# Latest/date/image correction - 2026-07-18

## Why this correction was needed

The representative correctly flagged two quality problems in the 2026-07-17/18 legacy-improvement work:

1. Some rewritten legacy posts were being treated as approved even though their article images were lightweight EpicKor SVG helper graphics rather than highly relevant real topic images.
2. Legacy posts had their `date` frontmatter changed to the rewrite date, which caused old posts to appear as if they were newly published in the home/latest feeds.
3. The Latest surfaces were too shallow for the current publishing volume.

## Corrections made

- Restored original publish dates for all legacy posts that had been moved to `2026-07-17` or `2026-07-18`.
- Added `updatedAt` separately so legacy improvements can still be recorded without changing the original publish order.
  - `updatedAt: "2026-07-17"` added to 38 legacy posts.
  - `updatedAt: "2026-07-18"` added to 73 legacy posts.
  - Legacy posts still dated `2026-07-17` or `2026-07-18`: 0.
- Updated the public article and preview templates to show a small updated date only when `updatedAt` differs from `date`.
- Updated the SEO/AEO audit and sitemap logic to use `updatedAt` for freshness/lastmod while preserving `date` for published-order sorting.
- Expanded Latest surfaces:
  - Home page now pulls 20 latest posts and displays 12 cards.
  - `/latest` now pulls 48 posts, shows a larger main list, and exposes older recent posts through an "And more recent posts" section.
  - Feed language changed from `Updated` to `Newest` where the surface is intended to mean publication order.
- Added same-date sorting by numeric slug descending so newest same-day posts appear as `305 -> 304 -> 303` rather than filesystem order.

## Latest ordering verification

Top 20 after correction:

1. `2026-07-17` - Blog `305` - Bojagi Wrapping Guide 2026
2. `2026-07-17` - Blog `304` - Jeonju Day Trip from Seoul 2026
3. `2026-07-17` - Blog `303` - Korean Skincare Routine Order 2026
4. `2026-07-15` - Blog `302` - What Do Koreans Eat for Breakfast?
5. `2026-07-15` - Blog `301` - Ajumma Meaning
6. `2026-07-14` - Blog `300` - Seoul Museum Gift Shop Guide 2026
7. `2026-07-14` - Blog `299` - Korean Cookware Starter Guide 2026
8. `2026-07-14` - Blog `298` - Seoul Stationery Shopping Guide 2026
9. `2026-07-13` - Blog `297` - Korean Traditional Desserts Guide 2026
10. `2026-07-13` - Blog `296` - Seoul Hanok Experience Guide 2026
11. `2026-07-13` - Blog `295` - Korean Temple Food Guide 2026
12. `2026-07-13` - Blog `294` - Why Korean Chopsticks Are Metal
13. `2026-07-12` - Blog `293` - Seoul Bookstore and Library Guide 2026
14. `2026-07-12` - Blog `292` - Korean Coin Noraebang Guide 2026
15. `2026-07-12` - Blog `291` - K-Pop Photocard Guide 2026
16. `2026-07-11` - Blog `290` - Seoul Palace Night Guide 2026
17. `2026-07-11` - Blog `289` - Korean Board Game Cafe Guide 2026
18. `2026-07-11` - Blog `288` - Korean Pojangmacha Guide 2026
19. `2026-07-10` - Blog `287` - Korean BBQ Grill for Home 2026
20. `2026-07-10` - Blog `286` - Korea's Bonus Shock

## Real-image correction

Audit found SVG-only article-image packages on Blogs `161`, `162`, `163`, `164`, and `165`.

- Blog `161` remains private, so it is recorded as a follow-up candidate before any public release.
- Public Blogs `162`, `163`, `164`, and `165` were corrected now.
- Each public target now has three real raster images, optimized under the current article-image budget.
- Source records were added beside each image package:
  - `public/assets/images/posts/162/image-sources.md`
  - `public/assets/images/posts/163/image-sources.md`
  - `public/assets/images/posts/164/image-sources.md`
  - `public/assets/images/posts/165/image-sources.md`

Replacement assets:

- Blog `162`: Korean red ginseng roots, Korean red ginseng product, red ginseng slices.
- Blog `163`: Seongsu cafe/storefront context, Seongsu brick storefront, Hannam art/culture street context.
- Blog `164`: Hongdae street-style area, Hongdae shopping street, DDP/fashion-district context.
- Blog `165`: inside hanok room, hanok kitchen/agungi, traditional hanok front.

## Remaining image-quality follow-up

This correction removes the urgent public SVG-only issue for `162-165`, but it does not claim that every older mixed-image post has the same visual standard as Blogs `290-300`.

Follow-up recommended before continuing broad rewrite/title batches:

- Review private Blog `161` before publishing because it is still SVG-only.
- Run a mixed-image visual-quality audit on older rewritten posts that have at least one raster image but may still rely on SVG helper graphics, including likely candidates such as `005`, `019`, `032`, `034`, `042`, `048`, `058`, and `093`.
- Update the reviewer policy: automated SEO/reviewer pass does not equal visual approval. Meaningfully rewritten public posts should have a separate image-relevance gate before final approval.

## Validation

- `npm.cmd run audit:seo-aeo` - pass, average `99/100`.
- `npm.cmd run audit:amazon-links` - pass.
- `npm.cmd run audit:image-sizes -- --dir public\assets\images\posts\162` - pass, 0 over budget.
- `npm.cmd run audit:image-sizes -- --dir public\assets\images\posts\163` - pass, 0 over budget.
- `npm.cmd run audit:image-sizes -- --dir public\assets\images\posts\164` - pass, 0 over budget.
- `npm.cmd run audit:image-sizes -- --dir public\assets\images\posts\165` - pass, 0 over budget.
- `git diff --check` - pass, CRLF warnings only.
- `npm.cmd run build` - pass, 363 static pages.
