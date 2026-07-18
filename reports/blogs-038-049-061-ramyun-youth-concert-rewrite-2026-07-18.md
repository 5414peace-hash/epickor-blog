# Blogs 038/049/061 Ramyun, Youth Pressure, and Concert Culture Rewrite QA - 2026-07-18

## Scope

- Rewrote Blog `038` from a thin ramen trend post into a practical Korean ramyun guide covering ramyun vs ramen, Shin, Buldak, Chapaghetti/Chapaguri, kimchi/stew-style choices, spice control, package reading, and beginner buying logic.
- Rewrote Blog `049` from a broad youth-problems post into a careful explainer on Hell Joseon, N-po, work pressure, housing/education costs, gender/fertility context, gat-saeng, and how visitors should read the topic without flattening Korean youth.
- Rewrote Blog `061` from a thin concert-singalong/noraebang post into a practical Korean concert culture guide covering ttechang, fan chants, noraebang, light sticks, etiquette, first-time visitor mistakes, and concert preparation.
- Added reverse links from:
  - Blog `277` -> Blog `038`
  - Blog `079` -> Blog `049`
  - Blog `003` -> Blog `061`

## Editorial Upgrades

- Added updated title, description, tags, and `ogImage` metadata to all three target posts.
- Added two `.table-scroll` HTML tables per target post.
- Added three images per target post, including five new lightweight EpicKor SVG helper graphics:
  - `public/assets/images/posts/038/korean-ramyun-choice-map.svg`
  - `public/assets/images/posts/038/korean-ramyun-topping-map.svg`
  - `public/assets/images/posts/049/korea-youth-pressure-map.svg`
  - `public/assets/images/posts/061/korean-concert-crowd-map.svg`
  - `public/assets/images/posts/061/korean-concert-prep-map.svg`
- Added two disclosed Amazon affiliate CTA boxes per target post using approved sponsored/nofollow attributes.
- Added six reviewer-detected FAQ entries per target post.
- Added current/official or high-reliability source sections.

## Fact / Risk Handling

- Blog `038`: replaced unsupported popularity claims with WINA 2024 Korea instant-noodle demand data and current Nongshim/Samyang source context.
- Blog `049`: used Statistics Korea/Korea.net and OECD framing for fertility, work-family, and structural pressure context; avoided treating slang terms as universal claims about all young Koreans.
- Blog `061`: avoided overclaiming exact noraebang counts or universal concert behavior; explained ttechang as a colloquial concert-culture term and grounded noraebang context in Korea.net/Visit Seoul resources.

## Validation

- `node .claude\skills\reviewer\scripts\review-post.mjs --draft content/blog/038-discover-the-spicy-and-flavorful-world-of-korean-ramen.md --dry-run`
  - Passed, SEO 100/100, 1,903 words, 13 H2, 3 images, 6 FAQ.
- `node .claude\skills\reviewer\scripts\review-post.mjs --draft content/blog/049-the-challenges-facing-south-koreas-younger-generation.md --dry-run`
  - Passed, SEO 100/100, 1,852 words, 12 H2, 3 images, 6 FAQ.
- `node .claude\skills\reviewer\scripts\review-post.mjs --draft content/blog/061-discover-the-unique-korean-concert-experience-that-moves-global-superstars-seoul-korea.md --dry-run`
  - Passed, SEO 100/100, 1,850 words, 13 H2, 3 images, 6 FAQ.
- Touched source checks:
  - Blog `003`: passed, SEO 100/100.
  - Blog `079`: passed, SEO 100/100.
  - Blog `277`: passed, SEO 90/100; existing missing-FAQ suggestion remains because the post predates the current FAQ standard.
- `git diff --check`
  - Passed; Windows LF/CRLF warnings only.
- `npm.cmd run audit:seo-aeo`
  - Passed, average 96/100.
  - Critical: 0.
  - High: 0.
  - Medium: 5.
- `npm.cmd run audit:amazon-links`
  - Passed, 659 tagged `amazon.com` URLs and 242 `amzn.to` URLs.
- `npm.cmd run build`
  - Passed, Next.js production build generated 363 pages.

## Deployment / Public QA

- Implementation commit: `b74a97e1` (`Rewrite ramyun youth and concert guides`)
- Pushed to `origin/master`.
- Vercel deployment: `dpl_9e7HXBf9HwP937fqTj3fxsqHbhhA`
- Deployment URL: `https://epickor-blog-lilcwtdi1-yhs-projects-5de403d3.vercel.app`
- Status: Ready and aliased to `www.epickor.com`.
- Public QA passed:
  - `/blog/038`, `/blog/049`, `/blog/061` returned HTTP 200 and included expected rewritten titles.
  - Reverse-link source pages `/blog/003`, `/blog/079`, and `/blog/277` returned HTTP 200 and included the new target links.
  - `/sitemap.xml` included `/blog/038`, `/blog/049`, and `/blog/061`.
  - New SVG assets for `038`, `049`, and `061` returned HTTP 200 and contained SVG markup.

## Remaining Notes

- The unrelated untracked file `reports/business-gsc-affiliate-check-2026-07-17.md` was preserved and excluded from this work.
- After this batch, the SEO/AEO audit still reports 5 medium-priority posts and 15 stale posts; those remain the safest next content-debt targets.
