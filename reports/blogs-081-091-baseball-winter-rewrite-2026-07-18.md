# Blogs 081/091 Rewrite QA - 2026-07-18

## Scope

- `081` — Korean baseball / KBO cheering guide
- `091` — Korea winter travel / ski, skate, snow-trip guide
- Reverse-link corrections:
  - `060 -> 081`
  - `073 -> 091`

## Editorial Changes

### Blog 081

- Rebuilt the old thin KBO/baseball post into a practical guide titled `Korean Baseball Guide: KBO Cheering, Tickets, and Food`.
- Added current source framing around KBO stadium culture, Jamsil Stadium logistics, ticket planning, food, merch, cheering etiquette, and first-game expectations.
- Added updated metadata including `ogImage`, two HTML table sections, three article images, two disclosed Amazon affiliate CTA boxes, internal links, six FAQs, and source links.
- Preserved the original EpicKor video embed and added decoded Korean-filename copies for the three legacy image assets so static/public paths resolve reliably.

### Blog 091

- Rebuilt the old thin winter post into a practical guide titled `Korea Winter Travel Guide: Skiing, Skating, and Snow Trips`.
- Added current source framing around Korea ski resorts, Dec-Feb winter travel timing, shuttle/accommodation planning, winter festivals, skating, Seoul snow days, packing, and safety checks.
- Added updated metadata including `ogImage`, two HTML table sections, four article images, two disclosed Amazon affiliate CTA boxes, internal links, six FAQs, and source links.
- Preserved the original EpicKor video embed and added decoded Korean-filename copies for the three legacy image assets so static/public paths resolve reliably.

## Source / Trust Notes

- Blog 081 used official/reliable travel and baseball context including VISITKOREA KBO cheer-culture guidance, Visit Seoul Jamsil Stadium information, Seoul Government live-sports context, and the official KBO English site.
- Blog 091 used VISITKOREA winter travel and ski-resort guidance, including its ski resort list, winter leisure guide, Yongpyong resort page, winter festival page, and winter travel planning article.
- Variable details such as ticket availability, ski slope operation, weather, shuttle routes, and festival schedules were framed as items to confirm near travel dates.

## Automated QA

- Reviewer:
  - `081`: 100/100, 1,929 words, 13 H2 sections, 3 images, 6 FAQ Q&A
  - `091`: 100/100, 2,111 words, 15 H2 sections, 4 images, 6 FAQ Q&A
  - `073` link-touch verification: 100/100, 2,076 words, 14 H2 sections, 4 images, 6 FAQ Q&A
- SEO/AEO audit:
  - Average score: 93/100
  - Critical: 0
  - High: 0
  - Medium: 35
  - Low: 238
  - Low-internal-linking: 35
  - Thin-content: 34
  - Missing FAQ: 28
  - Stale: 30
- Amazon link audit:
  - 635 tagged `amazon.com` URLs
  - 254 `amzn.to` URLs
  - PASS: every direct Amazon URL uses exactly one approved tracking tag.
- `git diff --check`: passed.
- Production build:
  - `npm.cmd run build` passed.
  - 359 static pages generated.

## Deployment

- Implementation commit: `f9ecc454` — `Rewrite Korean baseball and winter travel posts`
- Pushed to `origin/master`.
- Vercel production deployment:
  - ID: `dpl_BnfUoPKffxCsWEw38SRzdyZxLVpn`
  - URL: `https://epickor-blog-kgced9l1z-yhs-projects-5de403d3.vercel.app`
  - Status: Ready
  - Aliases include `https://www.epickor.com`, `https://epickor.com`, and `https://epickor-blog.vercel.app`.

## Public QA

Production checks passed on `https://www.epickor.com`:

- `https://www.epickor.com/blog/081`
  - HTTP 200
  - Expected title marker present.
  - `affiliate-inline-cta` present.
  - `FAQ` present.
- `https://www.epickor.com/blog/091`
  - HTTP 200
  - Expected title marker present.
  - `affiliate-inline-cta` present.
  - `FAQ` present.
- Reverse links:
  - `https://www.epickor.com/blog/060` contains `/blog/081`.
  - `https://www.epickor.com/blog/073` contains `/blog/091`.
- Sitemap:
  - `https://www.epickor.com/sitemap.xml` contains `/blog/081` and `/blog/091`.
- Decoded asset URLs:
  - `/assets/images/posts/081/108_epickor_휘수.mp4_20250108_221737.337.jpg` — 200, 357,752 bytes
  - `/assets/images/posts/081/108_epickor_휘수.mp4_20250108_221755.102.jpg` — 200, 298,026 bytes
  - `/assets/images/posts/081/108_epickor_휘수.mp4_20250108_221815.209.jpg` — 200, 355,685 bytes
  - `/assets/images/posts/091/119_epickor_민호_bgm제거.mp4_20250121_222658.194.jpg` — 200, 332,242 bytes
  - `/assets/images/posts/091/119_epickor_민호_bgm제거.mp4_20250121_222715.324.jpg` — 200, 380,658 bytes
  - `/assets/images/posts/091/119_epickor_민호_bgm제거.mp4_20250121_222741.424.jpg` — 200, 286,667 bytes

## Result

- The high-priority SEO/AEO queue is now cleared: `High: 2 -> 0`.
- The next rewrite queue begins at medium-priority pages such as `052`, `145`, `009`, `010`, `020`, `133`, `128`, and `126`.
- Suggested next work is a smaller medium-priority cleanup pass, not another emergency high-priority sprint.
