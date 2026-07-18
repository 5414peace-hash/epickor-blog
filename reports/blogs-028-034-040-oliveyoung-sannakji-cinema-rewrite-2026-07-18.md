# Blogs 028/034/040 SEO Rewrite QA - 2026-07-18

## Scope

- Rewrote Blog `028`: Olive Young / K-beauty shopping.
- Rewrote Blog `034`: San-nakji / Korean live octopus.
- Rewrote Blog `040`: Korean cinema and iconic lines.
- Added reverse links:
  - Blog `303` -> `/blog/028`
  - Blog `053` -> `/blog/034`
  - Blog `002` -> `/blog/040`
- Added `public/assets/images/posts/034/sannakji-safety-checklist.svg`.
- Preserved unrelated untracked file `reports/business-gsc-affiliate-check-2026-07-17.md`.

## Editorial Improvements

- `028` became `Olive Young Korea Guide: What to Buy Without Overbuying`.
  - Added tourist store strategy, rankings caveat, sunscreen/toner-pad/cream logic, tax refund cautions, and overbuying traps.
- `034` became `San-nakji Guide: Korean Live Octopus, Safety, and Etiquette`.
  - Added clear choking-risk guidance, who should skip it, alternatives, ordering tips, and non-challenge framing.
- `040` became `Korean Cinema Guide: Iconic Films and Lines to Know`.
  - Reframed around film context, KOFIC data, cultural quotability, and minimal direct quotation to avoid overusing protected dialogue.

## Automated Review

- `028`: PASS, 100/100, 2,028 words, 13 H2 sections, 3 images, 6 FAQs.
- `034`: PASS, 100/100, 1,880 words, 14 H2 sections, 3 images, 6 FAQs.
- `040`: PASS, 100/100, 1,885 words, 14 H2 sections, 3 images, 6 FAQs.
- Touched source posts also passed:
  - `002`: 100/100
  - `053`: 100/100
  - `303`: 100/100

## SEO / AEO Audit

- Average SEO/AEO score: 95/100.
- Critical: 0.
- High: 0.
- Medium posts: 20 -> 17.
- Thin posts: 19 -> 16.
- Missing FAQ: 18 -> 15.
- Stale posts: 23 -> 20.
- Current queue begins with `048`, `058`, `162`, `005`, `019`, `021`, `022`, `018`, `036`, `038`.

## Technical QA

- Amazon link audit passed:
  - 645 tagged `amazon.com` URLs.
  - 249 `amzn.to` URLs.
  - All direct Amazon URLs use approved tracking tags.
- `git diff --check` passed.
- Production build passed with 362 static pages generated.

## Deployment

- Implementation commit: `2d23fdb1` (`Rewrite Olive Young sannakji and Korean cinema guides`).
- Vercel production deployment: `dpl_HPKr3PKGGpZZN9RyhTzMrfZTdh5A`.
- Deployment URL: `https://epickor-blog-91tmfpy6w-yhs-projects-5de403d3.vercel.app`.
- Aliases verified: `www.epickor.com`, `epickor.com`, and Vercel project aliases.

## Public QA

All checks returned HTTP 200 and expected markers:

- `/blog/028`
- `/blog/034`
- `/blog/040`
- `/blog/303` contains `/blog/028`
- `/blog/053` contains `/blog/034`
- `/blog/002` contains `/blog/040`
- `/sitemap.xml` contains `/blog/028`, `/blog/034`, `/blog/040`
- `/assets/images/posts/034/sannakji-safety-checklist.svg`

## Recommended Next Work

1. Rewrite `048/058/162`; handle `162` carefully because it has missing description plus internal-link issues.
2. Continue with `005/019/021` after that.
3. Keep source-link and safety handling strict for food, film, health/beauty, and current shopping claims.
