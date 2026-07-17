# Blogs 046/047/050 Food + Yongsan Rewrite — 2026-07-18

## Scope

- Rewrote Blog `046` into a practical guide: `Free Side Dishes in Korea: Banchan, Service, and Refills`.
- Rewrote Blog `047` into a current neighborhood guide: `Yongsan Seoul Guide: Park, War Memorial, Cafes, and Food`.
- Rewrote Blog `050` into a practical cultural guide: `Korean Banchan Guide: Side Dishes, Kimchi, and Table Rules`.
- Added reverse/internal-link support from Blogs `169`, `209`, `266`, and `302`.
- Corrected a discovered internal-link quality issue where multiple existing posts pointed "Seoul subway guide" text to Blog `165`, which is not a subway post. Updated the observed instances to Blog `174` and corrected two nearby mismatched internal links.

## Editorial Improvements

- Converted three thin/stale legacy posts into 1,800+ word intent-matched guides.
- Added two HTML tables and six FAQ questions to each rewritten post.
- Preserved existing EpicKor-owned images and video embeds while fixing percent-encoded image paths for static checks.
- Added two disclosed Amazon affiliate CTAs to each rewritten post.
- Used official/reliable sources for current and cultural facts:
  - VisitKorea Korean food overview.
  - UNESCO kimjang page.
  - Republic of Korea Permanent Delegation to UNESCO jang-making culture notice.
  - VisitKorea War Memorial of Korea listing.
  - MOLIT Yongsan returned-site access notice.

## Validation

- `node .claude\skills\reviewer\scripts\review-post.mjs --draft content\blog\046-korea-gives-food-even-if-you-dont-order-it.md` — pass, 100/100.
- `node .claude\skills\reviewer\scripts\review-post.mjs --draft content\blog\047-newest-hotspots-in-seoul-korea-yongsan.md` — pass, 100/100.
- `node .claude\skills\reviewer\scripts\review-post.mjs --draft content\blog\050-discover-the-unique-charm-of-korean-banchan-culture.md` — pass, 100/100.
- `npm.cmd run audit:seo-aeo` — pass, average 88/100.
- `npm.cmd run audit:amazon-links` — pass, 605 tagged amazon.com URLs and 285 amzn.to URLs.
- `npm.cmd run build` — pass, 359 static pages generated.

## Audit Movement

- SEO/AEO average moved to 88/100.
- High-priority queue moved to 38 posts.
- Low-internal-linking issue count moved to 75 posts.
- Thin-content issue count moved to 72 posts.
- Missing FAQ issue count moved to 66 posts.

## Deployment QA Plan

Git-connected production deployment:

- Commit: `04fa2d83` (`Rewrite food and Yongsan legacy posts`)
- Deployment: `dpl_146wawjQ9kd8LMxzM6L7B5n3cTa2`
- Production alias: `www.epickor.com`
- Status: Ready

Public QA results:

- `/blog/046`, `/blog/047`, `/blog/050` returned HTTP 200 and expected title markers.
- Each rewritten public page contains `.affiliate-inline-cta`, `<table>`, and FAQ markers.
- `sitemap.xml` contains `/blog/046`, `/blog/047`, and `/blog/050`.
- Reverse/source links from `/blog/169`, `/blog/209`, `/blog/266`, and `/blog/302` are present publicly.
- Corrected source pages `055/159/166/167/168/169/180/188/189/201/230/231/233` no longer contain `/blog/165` in public HTML.
