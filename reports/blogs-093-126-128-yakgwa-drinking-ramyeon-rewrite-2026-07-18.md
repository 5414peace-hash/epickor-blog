# Blogs 093/126/128 Rewrite QA - 2026-07-18

## Scope

- `128` — yakgwa / halmaenial dessert / Korean honey cookie guide
- `126` — Korean drinking games / soju-table etiquette / safety guide
- `093` — Korean ramyeon / bag vs cup / Hangang machine ramyeon guide
- Reverse-link additions and touches:
  - `071 -> 128`
  - `060 -> 126`
  - `059 -> 093`

## Editorial Changes

### Blog 128

- Rebuilt the yakgwa post into `Yakgwa Guide: Why Korea's Honey Cookie Became Cool Again`.
- Added practical sections on what yakgwa is, why it returned through the halmaenial trend, traditional vs modern styles, texture, Seoul buying routes, cafe versions, home serving, health-claim boundaries, and first-timer mistakes.
- Added two HTML tables, three images, two disclosed Amazon CTAs, internal links, six FAQs, and source links.

### Blog 126

- Rebuilt the drinking-games post into `Korean Drinking Games Guide: Rules, Etiquette, and Safety`.
- Reframed the topic away from forced-drinking spectacle and toward table rhythm, etiquette, consent, refusal scripts, safer nightlife, and the difference between friend nights and hierarchy-heavy dinners.
- Added two HTML tables, four images, two disclosed Amazon CTAs, internal links, six FAQs, and source links including WHO alcohol-safety context.

### Blog 093

- Rebuilt the ramyeon post into `Korean Ramyeon Guide: Bag vs Cup Noodles and How to Choose`.
- Updated the old vague consumption claim with WINA 2024 demand/per-person data and added practical sections on bag ramyeon, cup ramyeon, Hangang machine ramyeon, spice labels, toppings, etiquette, souvenirs, and traveler choice logic.
- Fixed the broken legacy image markdown path by copying the same local image to a parser-safe filename: `/assets/images/posts/093/093_ramyeon_legacy_frame.jpg`.
- Added one lightweight EpicKor SVG explainer image at `/assets/images/posts/093/bag-vs-cup-ramyeon-choice-map.svg`.
- Added two HTML tables, three images, two disclosed Amazon CTAs, internal links, six FAQs, and source links.

### Reverse-link source posts

- Added a yakgwa trend link from Blog `071` to Blog `128`.
- Added a drinking-games/safety link from Blog `060` to Blog `126`.
- Added a ramyeon choice link from Blog `059` to Blog `093`.
- Normalized Blog `071` line endings so the existing frontmatter can be parsed by the current reviewer.

## Source / Trust Notes

- Blog `128` uses VISITKOREA and Korea.net yakgwa, K-dessert, convenience-store, and Gen Z dessert references.
- Blog `126` uses VISITKOREA, Visit Seoul, Korea.net, and WHO sources to balance cultural explanation with alcohol-safety and refusal guidance.
- Blog `093` uses WINA 2024 demand data plus VISITKOREA ramyeon, CU Ramyun Library, convenience-store, and Hangang ramyeon references.
- Time-sensitive details such as cafe lineups, store products, convenience-store flavors, venue hours, and alcohol availability are framed as requiring current local verification.

## Automated QA

- Reviewer:
  - `128`: 100/100, 1,982 words, 12 H2 sections, 3 images, 6 FAQ Q&A
  - `126`: 100/100, 2,087 words, 14 H2 sections, 4 images, 6 FAQ Q&A
  - `093`: 100/100, 1,889 words, 13 H2 sections, 3 images, 6 FAQ Q&A
  - `071` reverse-link touch: 100/100, 2,103 words, 11 H2 sections, 5 images, 5 FAQ Q&A
  - `060` reverse-link touch: 100/100, 1,879 words, 12 H2 sections, 3 images, 6 FAQ Q&A
  - `059` reverse-link touch: 100/100, 1,862 words, 11 H2 sections, 3 images, 6 FAQ Q&A
- SEO/AEO audit:
  - Average score: 94/100
  - Critical: 0
  - High: 0
  - Medium: 29 -> 26
  - Low-internal-linking: 30 -> 27
  - Thin-content: 28 -> 25
  - Missing FAQ: 24 -> 21
  - Stale: 26
- Amazon link audit:
  - 639 tagged `amazon.com` URLs
  - 250 `amzn.to` URLs
  - PASS: every direct Amazon URL uses exactly one approved tracking tag.
- `git diff --check`: passed with Windows LF/CRLF warnings only.
- Production build:
  - `npm.cmd run build` passed.
  - 359 static pages generated.

## Deployment

- Implementation commit: `a4c59c77` — `Rewrite yakgwa drinking games and ramyeon guides`
- Pushed to `origin/master`.
- Vercel production deployment:
  - ID: `dpl_68dMXpppEH5cdQYuU4H9JR1gsxax`
  - URL: `https://epickor-blog-hx8mac0p2-yhs-projects-5de403d3.vercel.app`
  - Status: Ready
  - Aliases include `https://www.epickor.com`, `https://epickor.com`, and `https://epickor-blog.vercel.app`.

## Public QA

Production checks passed on `https://www.epickor.com`:

- `https://www.epickor.com/blog/128`
  - HTTP 200
  - Expected title marker present.
  - `affiliate-inline-cta` present.
  - `FAQ` present.
- `https://www.epickor.com/blog/126`
  - HTTP 200
  - Expected title marker present.
  - `affiliate-inline-cta` present.
  - `FAQ` present.
- `https://www.epickor.com/blog/093`
  - HTTP 200
  - Expected title marker present.
  - `affiliate-inline-cta` present.
  - `FAQ` present.
- Reverse-link source pages:
  - `https://www.epickor.com/blog/071` contains `/blog/128`.
  - `https://www.epickor.com/blog/060` contains `/blog/126`.
  - `https://www.epickor.com/blog/059` contains `/blog/093`.
- Sitemap:
  - `https://www.epickor.com/sitemap.xml` contains `/blog/128`, `/blog/126`, and `/blog/093`.
- Asset URLs:
  - `/assets/images/posts/128/128_01.jpg` — HTTP 200
  - `/assets/images/posts/126/126_01.jpg` — HTTP 200
  - `/assets/images/posts/093/bag-vs-cup-ramyeon-choice-map.svg` — HTTP 200
  - `/assets/images/posts/093/093_ramyeon_legacy_frame.jpg` — HTTP 200

## Result

- Medium-priority queue reduced from 29 to 26.
- Overall SEO/AEO average remains 94/100 with Critical 0 and High 0.
- Current top rewrite queue begins with `163`, `165`, `029`, `032`, `164`, `027`, `028`, `034`, `040`, `048`, `058`, and `162`.
- Suggested next safe batch: `163/165/164`, because all three lack descriptions, have low internal linking, and can likely reduce the Medium queue without touching image-heavy legacy food pages.
