# Blogs 014/041/086 Laughter, Souvenirs, and Seoul Night Rewrite QA - 2026-07-18

## Scope

- Rewrote Blog `014` from a thin laugh-clapping post into a careful Korean social-reaction guide covering laugh-clapping, heung, jeong, variety-show reaction grammar, personal boundaries, and what visitors should or should not copy.
- Rewrote Blog `041` from a thin souvenir list into a practical Korean souvenir guide covering snacks, K-beauty, red ginseng, crafts, alcohol, shopping areas, packing, customs, and gift matching.
- Rewrote Blog `086` from a stale future-city/Seoul 2025 post into a practical Seoul night guide covering Hangang, drone shows, cafes, markets, transit, taxis, safety, and realistic after-dark planning.
- Added reverse links from:
  - Blog `003` -> Blog `014`
  - Blog `029` -> Blog `041`
  - Blog `079` -> Blog `086`

## Editorial Upgrades

- Added updated title, description, tags, and `ogImage` metadata to all three target posts.
- Added two `.table-scroll` HTML tables per target post.
- Added three images per target post, including six new lightweight EpicKor SVG helper graphics:
  - `public/assets/images/posts/014/korean-laughter-context-map.svg`
  - `public/assets/images/posts/014/korean-laugh-copy-boundary.svg`
  - `public/assets/images/posts/041/korean-souvenir-choice-map.svg`
  - `public/assets/images/posts/041/korean-souvenir-packing-checklist.svg`
  - `public/assets/images/posts/086/seoul-night-route-map.svg`
  - `public/assets/images/posts/086/seoul-night-timing-checklist.svg`
- Added two disclosed Amazon affiliate CTA boxes per target post using approved sponsored/nofollow attributes.
- Added six reviewer-detected FAQ entries per target post.
- Added current/official or reliable source sections.

## Fact / Risk Handling

- Blog `014`: removed deterministic "Korean DNA" style framing and explained laugh-clapping as context-dependent social reaction. Used Encyclopedia of Korean Culture and Visit Seoul etiquette sources.
- Blog `041`: removed unsupported health and alcohol claims, reframed red ginseng as a labeled gift category rather than a cure, and added customs/packing cautions.
- Blog `086`: removed stale/futuristic 2025 claims and replaced them with current Seoul/Hangang/Outdoor Library planning context, including official 2026 Seoul Metropolitan Government pages.

## Validation

- `node .claude\skills\reviewer\scripts\review-post.mjs --draft content/blog/014-unraveling-the-unique-korean-habit-of-laughing-and-clapping-seoul-korea.md --dry-run`
  - Passed, SEO 100/100, 1,882 words, 10 H2, 3 images, 6 FAQ.
- `node .claude\skills\reviewer\scripts\review-post.mjs --draft content/blog/041-essential-souvenirs-to-pick-up-when-traveling-in-korea.md --dry-run`
  - Passed, SEO 100/100, 2,033 words, 11 H2, 3 images, 6 FAQ.
- `node .claude\skills\reviewer\scripts\review-post.mjs --draft content/blog/086-a-city-that-never-sleeps-seoul.md --dry-run`
  - Passed, SEO 100/100, 2,188 words, 11 H2, 3 images, 6 FAQ.
- Touched source checks:
  - Blog `003`: passed, SEO 100/100.
  - Blog `029`: passed, SEO 100/100.
  - Blog `079`: passed, SEO 100/100.
- `git diff --check`
  - Passed; Windows LF/CRLF warnings only.
- `npm.cmd run audit:seo-aeo`
  - Passed, average 96/100.
  - Critical: 0.
  - High: 0.
  - Medium: 2.
  - Medium posts moved 5 -> 2.
- `npm.cmd run audit:amazon-links`
  - Passed, 662 tagged `amazon.com` URLs and 239 `amzn.to` URLs.
- `npm.cmd run build`
  - Passed, Next.js production build generated 363 pages.

## Deployment / Public QA

- Implementation commit: `b2704b32` (`Rewrite Seoul night souvenirs and laughter guides`)
- Pushed to `origin/master`.
- Vercel deployment: `dpl_4CeNLKJNjpcvATHu95FizACLYjSQ`
- Deployment URL: `https://epickor-blog-ckjeyre72-yhs-projects-5de403d3.vercel.app`
- Status: Ready and aliased to `www.epickor.com`.
- Public QA passed:
  - `/blog/014`, `/blog/041`, and `/blog/086` returned HTTP 200 and included expected rewritten titles.
  - Reverse-link source pages `/blog/003`, `/blog/029`, and `/blog/079` returned HTTP 200 and included the new target links.
  - `/sitemap.xml` included `/blog/014`, `/blog/041`, and `/blog/086`.
  - Representative new SVG assets for `014`, `041`, and `086` returned HTTP 200 and contained SVG markup.

## Remaining Notes

- The unrelated untracked file `reports/business-gsc-affiliate-check-2026-07-17.md` was preserved and excluded from this work.
- After this batch, only two medium-priority audit items remain: Blog `161` and Blog `011`.
