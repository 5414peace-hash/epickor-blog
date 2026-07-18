# Blogs 020/133/145 Rewrite QA - 2026-07-18

## Scope

- `145` — naengmyeon / Pyongyang vs Hamheung / Seoul ordering guide
- `020` — Korean moving / ladder trucks / packing movers guide
- `133` — Korean PC bang first-visit / food / kiosk / etiquette guide
- Reverse-link additions and touches:
  - `299 -> 145`
  - `088 -> 020`
  - `170 -> 133`

## Editorial Changes

### Blog 145

- Rebuilt the naengmyeon post into `Naengmyeon Guide: Pyongyang, Hamheung, and How to Eat It`.
- Added practical sections on Pyongyang vs Hamheung styles, broth balance, vinegar/mustard timing, scissors etiquette, Seoul place-checking, first-order strategy, food pairings, and common first-timer mistakes.
- Added two HTML tables, three images, two disclosed Amazon CTAs, internal links, six FAQs, and source links.

### Blog 020

- Rebuilt the Korean moving post into `Korean Moving Guide: Ladder Trucks, Packing Movers, and Tips`.
- Reframed the viral ladder-truck topic as a useful resident/traveler explanation of `pojang-isa`, apartment access, elevator reservations, contracts, damage checks, and moving-day risks.
- Added two HTML tables, three images, two disclosed Amazon CTAs, internal links, six FAQs, source links, and preserved the original embedded video context.

### Blog 133

- Rebuilt the PC bang post into `PC Bang Guide: Food, Kiosk, Etiquette, and First Visit Tips`.
- Separated the practical first-visit guide from the broader PC bang culture overview in Blog `170`.
- Added sections on first-visit flow, seat/kiosk friction, food ordering, etiquette, foreign-visitor blockers, payment/time strategy, esports tourism, non-gamer use cases, safety, and a first-timer plan.
- Added two HTML tables, three images, two disclosed Amazon CTAs, internal links, six FAQs, and source links.

### Reverse-link source posts

- Added a restaurant-side noodle/scissors link from Blog `299` to Blog `145`.
- Added a dense-city moving-system link from Blog `088` to Blog `020`.
- Added a practical PC bang first-visit link from Blog `170` to Blog `133`.
- Fixed Blog `170`'s existing external `ogImage` metadata to a local image path and added two FAQ entries so the touched source page passes the current reviewer cleanly.

## Source / Trust Notes

- Blog `145` uses Korea.net, VISITKOREA, and Visit Seoul resources for naengmyeon definitions, regional style distinctions, and Seoul food-place context.
- Blog `020` uses Korea Consumer Agency, IBS foreigner-living guidance, and Korea Customs moving-household-effects guidance for practical moving risk and access framing.
- Blog `133` uses VISITKOREA and Visit Seoul gaming/esports resources for PC bang, T1 Base Camp, LoL Park, and gaming-culture context.
- Time-sensitive details such as restaurant hours, PC bang payment flows, game-account access, moving-company prices, building rules, and event availability are framed as requiring current local verification.

## Automated QA

- Reviewer:
  - `145`: 100/100, 1,803 words, 13 H2 sections, 3 images, 6 FAQ Q&A
  - `020`: 100/100, 1,848 words, 14 H2 sections, 3 images, 6 FAQ Q&A
  - `133`: 100/100, 1,865 words, 14 H2 sections, 3 images, 6 FAQ Q&A
  - `088` reverse-link touch: 100/100, 2,228 words, 14 H2 sections, 4 images, 6 FAQ Q&A
  - `170` reverse-link/metainfo touch: 100/100, 2,558 words, 7 H2 sections, 3 images, 6 FAQ Q&A
  - `299` reverse-link touch: 100/100, 2,078 words, 8 H2 sections, 4 images, 6 FAQ Q&A
- SEO/AEO audit:
  - Average score: 94/100
  - Critical: 0
  - High: 0
  - Medium: 32 -> 29
  - Low-internal-linking: 32 -> 30
  - Thin-content: 31 -> 28
  - Missing FAQ: 25 -> 24
  - Stale: 27 -> 26
- Amazon link audit:
  - 639 tagged `amazon.com` URLs
  - 250 `amzn.to` URLs
  - PASS: every direct Amazon URL uses exactly one approved tracking tag.
- `git diff --check`: passed with Windows LF/CRLF warnings only.
- Production build:
  - `npm.cmd run build` passed.
  - 359 static pages generated.

## Deployment

- Implementation commit: `4e0211cf` — `Rewrite naengmyeon moving and PC bang guides`
- Pushed to `origin/master`.
- Vercel production deployment:
  - ID: `dpl_F7KeJfwRuzZDJMDt51eQT3PK6EpC`
  - URL: `https://epickor-blog-m7cq4thim-yhs-projects-5de403d3.vercel.app`
  - Status: Ready
  - Aliases include `https://www.epickor.com`, `https://epickor.com`, and `https://epickor-blog.vercel.app`.

## Public QA

Production checks passed on `https://www.epickor.com`:

- `https://www.epickor.com/blog/145`
  - HTTP 200
  - Expected title marker present.
  - `affiliate-inline-cta` present.
  - `FAQ` present.
- `https://www.epickor.com/blog/020`
  - HTTP 200
  - Expected title marker present.
  - `affiliate-inline-cta` present.
  - `FAQ` present.
- `https://www.epickor.com/blog/133`
  - HTTP 200
  - Expected title marker present.
  - `affiliate-inline-cta` present.
  - `FAQ` present.
- Reverse-link source pages:
  - `https://www.epickor.com/blog/299` contains `/blog/145`.
  - `https://www.epickor.com/blog/088` contains `/blog/020`.
  - `https://www.epickor.com/blog/170` contains `/blog/133`.
- Sitemap:
  - `https://www.epickor.com/sitemap.xml` contains `/blog/145`, `/blog/020`, and `/blog/133`.
- Asset URLs:
  - `/assets/images/posts/145/145_01.jpg` — HTTP 200
  - `/assets/images/posts/020/379243b2-fce4-4cbf-865d-23a097060703.png` — HTTP 200
  - `/assets/images/posts/133/133_01.jpg` — HTTP 200

## Result

- The post-High cleanup continued successfully.
- Medium-priority queue reduced from 32 to 29.
- Overall SEO/AEO average increased to 94/100.
- Current top rewrite queue begins with `128`, `126`, `163`, `165`, `029`, `032`, `093`, `164`, then the remaining short/stale numeric posts.
- Suggested next safe batch: `128/126/093`, because all three are very thin, lack FAQs/internal links, and can likely reduce the Medium queue without touching complex business or route code.
