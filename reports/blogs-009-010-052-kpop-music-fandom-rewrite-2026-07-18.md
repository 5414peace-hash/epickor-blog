# Blogs 009/010/052 Rewrite QA - 2026-07-18

## Scope

- `009` — Korean hip-hop / SMTM / Seoul music-scene guide
- `010` — BTS 2026 beginner guide and post-military-return context
- `052` — K-pop birthday cafe / Seoul fan-event guide
- Reverse-link addition:
  - `291 -> 052`

## Editorial Changes

### Blog 009

- Rebuilt the Korean hip-hop article into `Korean Hip-Hop Guide: SMTM, Artists, and Seoul Scenes`.
- Corrected the outdated framing that implied `Show Me The Money` had simply ended; CJ ENM sources now support the 2026 `Show Me The Money 12` return context.
- Added practical sections on the underground/mainstream debate, Seoul scene context, discovery paths, Korean lyrics, K-pop overlap, beginner listening routes, two HTML tables, three images, two disclosed Amazon CTAs, six FAQs, internal links, and source links.

### Blog 010

- Rebuilt the BTS article into `BTS Guide 2026: Members, ARMY, Military Return, and Music`.
- Updated the military-service timeline to a post-return frame using BIGHIT, Korea.net, Yonhap, and HYBE context.
- Added a member overview table, beginner listening table, ARMY/fandom-commerce context, solo-era explanation, BTS/Korean hip-hop connection, two disclosed Amazon CTAs, three images, six FAQs, and source links.

### Blog 052

- Rebuilt the birthday-cafe article into `K-pop Birthday Cafe Guide: Seoul Fan Events Explained`.
- Reframed the post as a practical Seoul Hallyu/fan-event guide covering cup sleeves, photocards, Hongdae/Mapo routes, event schedules, etiquette, budgeting, fan-made vs official goods, and pop-up/shop distinctions.
- Added VISITKOREA and Visit Seoul source framing, two HTML tables, three images, two disclosed Amazon CTAs, internal links, six FAQs, and source links.
- Added decoded Korean-filename copies for two legacy image assets so public paths resolve reliably.

## Source / Trust Notes

- Blog 009 uses CJ ENM and CJ Newsroom as primary support for the 2026 `Show Me The Money 12` return and the show's mainstream role.
- Blog 010 uses BIGHIT official BTS profile/discography, Korea.net's 2025 discharge report, Yonhap's SUGA discharge context, and HYBE artist/company context.
- Blog 052 uses VISITKOREA and Visit Seoul birthday-cafe/Hallyu resources, plus VISITKOREA's 2025 G-DRAGON birthday-cafe-themed HiKR Station pop-up report.
- Time-sensitive details such as event schedules, cafe participation, store stock, show broadcasts, and artist activity were framed as requiring current verification.

## Automated QA

- Reviewer:
  - `052`: 100/100, 1,826 words, 14 H2 sections, 3 images, 6 FAQ Q&A
  - `009`: 100/100, 1,820 words, 14 H2 sections, 3 images, 6 FAQ Q&A
  - `010`: 100/100, 1,803 words, 14 H2 sections, 3 images, 6 FAQ Q&A
  - `291` reverse-link touch: 100/100, 2,448 words, 10 H2 sections, 4 images, 6 FAQ Q&A
- SEO/AEO audit:
  - Average score: 93/100
  - Critical: 0
  - High: 0
  - Medium: 35 -> 32
  - Low: 241
  - Low-internal-linking: 35 -> 32
  - Thin-content: 34 -> 31
  - Missing FAQ: 28 -> 25
  - Stale: 30 -> 27
- Amazon link audit:
  - 638 tagged `amazon.com` URLs
  - 251 `amzn.to` URLs
  - PASS: every direct Amazon URL uses exactly one approved tracking tag.
- `git diff --check`: passed.
- Production build:
  - `npm.cmd run build` passed.
  - 359 static pages generated.

## Deployment

- Implementation commit: `919f7ea5` — `Rewrite K-pop fandom and music guides`
- Pushed to `origin/master`.
- Vercel production deployment:
  - ID: `dpl_H2LV84LkuZx9W2hSDPqUiofuGBGX`
  - URL: `https://epickor-blog-n0hm9fei5-yhs-projects-5de403d3.vercel.app`
  - Status: Ready
  - Aliases include `https://www.epickor.com`, `https://epickor.com`, and `https://epickor-blog.vercel.app`.

## Public QA

Production checks passed on `https://www.epickor.com`:

- `https://www.epickor.com/blog/052`
  - HTTP 200
  - Expected title marker present.
  - `affiliate-inline-cta` present.
  - `FAQ` present.
- `https://www.epickor.com/blog/009`
  - HTTP 200
  - Expected title marker present.
  - `affiliate-inline-cta` present.
  - `FAQ` present.
  - Internal link to `/blog/010` present.
- `https://www.epickor.com/blog/010`
  - HTTP 200
  - Expected title marker present.
  - `affiliate-inline-cta` present.
  - `FAQ` present.
  - Internal link to `/blog/009` present.
- `https://www.epickor.com/blog/291`
  - HTTP 200
  - Reverse link to `/blog/052` present.
- Sitemap:
  - `https://www.epickor.com/sitemap.xml` contains `/blog/052`, `/blog/009`, and `/blog/010`.
- Decoded asset URLs:
  - `/assets/images/posts/052/063_EpicKor_진호.mp4_20240725_221512.172.jpg` — 200, 253,993 bytes
  - `/assets/images/posts/052/063_EpicKor_진호.mp4_20240725_221525.174.jpg` — 200, 162,030 bytes

## Result

- The post-High cleanup has begun successfully.
- Medium-priority queue reduced from 35 to 32.
- Next audit queue begins with `145`, `020`, `133`, `128`, and `126`.
- Suggested next small batch: `020` plus two short numeric-slug pages after confirming their current content and asset quality.
