# Blogs 163/164/165 SEO Rewrite QA - 2026-07-18

## Scope

- Rewrote `content/blog/163.md` as `Seongsu vs Hannam Guide: Seoul's Trend Neighborhoods`.
- Rewrote `content/blog/164.md` as `Korean Streetwear Guide: Seoul Fashion, Brands, and Fit`.
- Rewrote `content/blog/165.md` as `K-Living Guide: Korean Warm Minimalism for Small Homes`.
- Added reverse internal links from:
  - Blog `047` -> `/blog/163`
  - Blog `085` -> `/blog/164`
  - Blog `296` -> `/blog/165`
- Preserved unrelated untracked file `reports/business-gsc-affiliate-check-2026-07-17.md`.

## Editorial Improvements

- Converted three weak trend/lifestyle posts into practical evergreen guides with clearer search intent:
  - `163`: Seongsu vs Hannam itinerary, route, budget, shopping, gallery, cafe, and etiquette decisions.
  - `164`: Korean streetwear silhouette, Seoul shopping routes, sizing, quality checks, and styling logic.
  - `165`: K-living warm minimalism, hanok influence, small-home zones, floor culture, lighting, storage, and rental-friendly choices.
- Added updated frontmatter descriptions, tags, and local `ogImage` values.
- Added two reader-facing HTML tables per post using `.table-scroll`.
- Added three lightweight EpicKor SVG article images per post.
- Added two disclosed Amazon affiliate CTAs per post.
- Added six FAQs per post.
- Added practical internal links to adjacent EpicKor guides and reverse links from already-public pages.

## Source / Trust Notes

- Blog `163` uses current Visit Seoul / Seoul city sources for Seongsu, Hannam, and etiquette context.
- Blog `164` uses official Seoul Fashion Week / Seoul city and Visit Seoul context for fashion-week and shopping-route framing.
- Blog `165` uses Korean history, Korea.net, Seoul Hanok, and Hanssem company context for hanok influence and Korean home-design framing.
- Variable hours, pop-ups, exhibitions, store inventory, and brand stock are framed as check-before-you-go details rather than fixed promises.

## Automated Review

- `163`: PASS, 100/100, 1,900 words, 14 H2 sections, 3 images, 6 FAQs.
- `164`: PASS, 100/100, 1,842 words, 14 H2 sections, 3 images, 6 FAQs.
- `165`: PASS, 100/100, 1,873 words, 15 H2 sections, 3 images, 6 FAQs.
- Touched source posts also passed:
  - `047`: 100/100
  - `085`: 100/100
  - `296`: 100/100 after parser-safe line-ending normalization.

## SEO / AEO Audit

- Sitewide SEO/AEO average: 94/100.
- Critical: 0.
- High: 0.
- Medium posts: 26 -> 23.
- Low internal linking: 27 -> 24.
- Thin posts: 25 -> 22.
- Missing description: 5 -> 2.
- Missing FAQ remains 21.
- Stale remains 26.
- Current next queue begins with `029`, `032`, `027`, `028`, `034`, `040`, `048`, `058`, `162`.

## Affiliate / Technical QA

- Amazon audit passed:
  - 644 tagged `amazon.com` URLs.
  - 251 `amzn.to` URLs.
  - All direct Amazon URLs use approved tracking tags.
- `git diff --check` passed.
- Production build passed:
  - Next.js 16.1.6 / Turbopack.
  - 362 static pages generated.

## Deployment

- Implementation commit: `210b77bb` (`Rewrite Seoul trends fashion and K-living guides`).
- Pushed to `origin/master`.
- Vercel production deployment: `dpl_5rHwCdabNT9cqquSoehyPdDMpjKn`.
- Deployment URL: `https://epickor-blog-ctrbz3iyr-yhs-projects-5de403d3.vercel.app`.
- Aliases verified:
  - `https://www.epickor.com`
  - `https://epickor.com`
  - `https://epickor-blog.vercel.app`

## Public QA

All checks returned HTTP 200 and expected markers:

- `https://www.epickor.com/blog/163`
- `https://www.epickor.com/blog/164`
- `https://www.epickor.com/blog/165`
- `https://www.epickor.com/blog/047` contains `/blog/163`.
- `https://www.epickor.com/blog/085` contains `/blog/164`.
- `https://www.epickor.com/blog/296` contains `/blog/165`.
- `https://www.epickor.com/sitemap.xml` contains `/blog/163`, `/blog/164`, and `/blog/165`.
- Representative assets:
  - `/assets/images/posts/163/seongsu-hannam-neighborhood-map.svg`
  - `/assets/images/posts/164/k-fashion-silhouette-map.svg`
  - `/assets/images/posts/165/k-living-warm-minimalism-palette.svg`

## Result

This batch reduced the current medium/low-link/thin queue by three more posts while adding monetizable, evergreen guides in Seoul travel, K-fashion, and Korean home/lifestyle categories. It also improved internal crawl paths into the newly rewritten guides from relevant existing pages.

## Recommended Next Work

1. Rewrite the next safest high-leverage queue batch: `029/032/027`.
2. Follow with `028/034/040` if the first batch passes cleanly.
3. Continue capped reverse internal-link additions from strong recent guides to the remaining low-link pages.
