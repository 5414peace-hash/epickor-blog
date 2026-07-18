# Blogs 018/022/036 Rewrite QA - 2026-07-18

## Scope

- Rewrote Blog `018` into `Korean Fried Chicken Guide: Chimaek, Crunch, and Ordering Tips`.
- Rewrote Blog `022` into `Korean Food Scissors Guide: Practical Tools and Hangover Drinks`.
- Rewrote Blog `036` into `Korea Rainy Season Guide: Umbrellas, Jangma, and Travel Tips`.
- Preserved public slugs and improved titles, descriptions, tags, `ogImage`, source framing, reader-first affiliate placement, tables, FAQ, and related-link sections.
- Added four SVG support images:
  - `public/assets/images/posts/022/korean-practical-tools-map.svg`
  - `public/assets/images/posts/022/hangover-drink-label-check.svg`
  - `public/assets/images/posts/036/korea-rainy-season-timeline.svg`
  - `public/assets/images/posts/036/seoul-rainy-day-pack-map.svg`

## Editorial Changes

### Blog 018

- Removed unsupported "87,000 restaurants" style overclaim.
- Reframed Korean fried chicken as a practical travel/food guide: chimaek, flavors, ordering, delivery, portion choice, non-alcoholic options, and picnic/hotel use cases.
- Used VisitKorea and Koreana source framing for Korean fried chicken and chimaek.
- Added two HTML tables, three images, two affiliate CTAs, and six FAQ entries.

### Blog 022

- Removed unsafe "proven hangover cure" language.
- Reframed the article as a practical guide to Korean food scissors, table tools, convenience culture, and hangover drinks.
- Used Korea.net K-Scissors, NIAAA hangover guidance, PubMed-indexed Hovenia study context, Korea.kr, and MFDS claim-substantiation sources.
- Added two HTML tables, three images, two affiliate CTAs, and six FAQ entries.

### Blog 036

- Removed exaggerated "refuse to get wet," unsupported survey, and rain/hair-loss framing.
- Reframed the article as a practical Korea rainy-season and umbrella etiquette guide.
- Used KMA rainy-season normal data, KMA weather-service context, and VisitKorea travel basics.
- Added two HTML tables, three images, two affiliate CTAs, and six FAQ entries.

## Internal Links Added

- Blog `299` -> Blog `022`.
- Blog `060` -> Blog `022`.
- Blog `267` -> Blog `018`.
- Blog `199` -> Blog `036`.
- Blog `221` -> Blog `036`.

## Validation

- `node .claude\skills\reviewer\scripts\review-post.mjs --draft content/blog/018-discover-the-global-craze-for-korean-chicken-travel-korea.md --dry-run`
  - Pass, SEO 100/100, 1,992 words, 13 H2, 3 images, 6 FAQ.
- `node .claude\skills\reviewer\scripts\review-post.mjs --draft content/blog/022-discover-unique-korean-items-from-hangover-relievers-to-food-scissors.md --dry-run`
  - Pass, SEO 100/100, 1,811 words, 10 H2, 3 images, 6 FAQ.
- `node .claude\skills\reviewer\scripts\review-post.mjs --draft content/blog/036-cultural-differences-in-umbrella-use-why-koreans-always-carry-one.md --dry-run`
  - Pass, SEO 100/100, 2,084 words, 13 H2, 3 images, 6 FAQ.
- Touched source-page checks:
  - Blog `060`: pass, SEO 100/100.
  - Blog `199`: pass, SEO 90/100 after LF normalization so reviewer could parse frontmatter.
  - Blog `221`: pass, SEO 90/100.
  - Blog `267`: pass, SEO 90/100.
  - Blog `299`: pass, SEO 100/100.
- `git diff --check`: pass, with expected Windows CRLF warnings only.
- `npm.cmd run audit:seo-aeo`: pass, average 96/100.
  - Critical: 0.
  - High: 0.
  - Medium: 8.
  - Thin-content: 7.
  - Missing FAQ: 7.
  - Stale: 15.
- `npm.cmd run audit:amazon-links`: pass.
  - 656 tagged amazon.com URLs.
  - 245 amzn.to URLs.
- `npm.cmd run build`: pass.
  - 363 static pages generated.

## Deployment

- Implementation commit: `52ab904d` (`Rewrite chicken tools and umbrella guides`).
- Vercel deployment: `dpl_G96Lx1bX8aWRBa68YfxamCQRaKsZ`.
- Deployment URL: `https://epickor-blog-p1aj2a2pl-yhs-projects-5de403d3.vercel.app`.
- Aliased domains confirmed:
  - `https://www.epickor.com`
  - `https://epickor.com`
  - `https://epickor-blog.vercel.app`

## Public QA

Confirmed HTTP 200 and required markers on:

- `https://www.epickor.com/blog/018`
  - Title marker, affiliate CTA, table wrapper, FAQ, hero image.
- `https://www.epickor.com/blog/022`
  - Title marker, affiliate CTA, table wrapper, FAQ, new SVG marker.
- `https://www.epickor.com/blog/036`
  - Title marker, affiliate CTA, table wrapper, FAQ, new SVG marker.
- Reverse-link source pages:
  - `https://www.epickor.com/blog/299` includes `/blog/022`.
  - `https://www.epickor.com/blog/060` includes `/blog/022` and `/blog/018`.
  - `https://www.epickor.com/blog/267` includes `/blog/018`.
  - `https://www.epickor.com/blog/199` includes `/blog/036`.
  - `https://www.epickor.com/blog/221` includes `/blog/036`.
- `https://www.epickor.com/sitemap.xml` includes `/blog/018`, `/blog/022`, and `/blog/036`.
- Public asset checks:
  - `https://www.epickor.com/assets/images/posts/022/korean-practical-tools-map.svg`
  - `https://www.epickor.com/assets/images/posts/022/hangover-drink-label-check.svg`
  - `https://www.epickor.com/assets/images/posts/036/korea-rainy-season-timeline.svg`
  - `https://www.epickor.com/assets/images/posts/036/seoul-rainy-day-pack-map.svg`

## Notes

- Unrelated untracked file intentionally preserved and excluded: `reports/business-gsc-affiliate-check-2026-07-17.md`.
- Next SEO/AEO queue after this batch begins with Blogs `038/049/061`, then `086/161/041/014/011`.
