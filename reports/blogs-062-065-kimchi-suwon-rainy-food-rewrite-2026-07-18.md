# Blogs 062/064/065 Kimchi + Suwon + Rainy Food Rewrite — 2026-07-18

## Scope

- Rewrote Blog `062` into `Museum Kimchikan Guide: Kimchi, Kimjang, and Insadong Visit Tips`.
- Rewrote Blog `064` into `Suwon Day Trip Guide: Hwaseong Fortress, Haenggung, and Food`.
- Rewrote Blog `065` into `Korean Rainy Day Food: Pajeon, Makgeolli, Noodles, and Soups`.
- Added reverse/internal-link support from Blogs `050`, `060`, `149`, and `159`.

## Editorial Improvements

- Converted three high-priority thin/stale legacy posts into 1,800+ word practical guides.
- Added two HTML tables and six FAQ questions to each rewritten post.
- Preserved existing EpicKor-owned image/video assets and corrected percent-encoded image paths for static checks.
- Added two disclosed Amazon affiliate CTAs to each rewritten post.
- Reduced unsupported broad claims and replaced them with official-source framing:
  - `062`: Museum Kimchikan official/VisitKorea details, UNESCO kimjang framing, allergy/program caution.
  - `064`: UNESCO/Korea.net Hwaseong history, practical transit/walking/day-trip planning.
  - `065`: broader rainy-day food guide to avoid duplicating Blog `149`, with no-alcohol and rainy-season planning.

## Source Basis

- Museum Kimchikan official English site.
- VisitKorea Museum Kimchikan listing.
- UNESCO Kimjang intangible heritage page.
- UNESCO World Heritage Centre Hwaseong Fortress page.
- Korea.net Hwaseong Fortress background.
- VisitKorea/Korea.net makgeolli and Korean drinking context from the linked drink cluster.

## Validation

- `node .claude\skills\reviewer\scripts\review-post.mjs --draft content\blog\062-experience-traditional-korean-kimchi-making-at-museum-kimchikan-in-insadong.md` — pass, 100/100.
- `node .claude\skills\reviewer\scripts\review-post.mjs --draft content\blog\064-discover-the-unique-blend-of-history-and-modernity-in-suwon-just-a-short-ride-from-seoul.md` — pass, 100/100.
- `node .claude\skills\reviewer\scripts\review-post.mjs --draft content\blog\065-korean-soul-food-on-a-rainy-day.md` — pass, 100/100.
- `npm.cmd run audit:seo-aeo` — pass, average 88/100.
- `npm.cmd run audit:amazon-links` — pass, 607 tagged amazon.com URLs and 284 amzn.to URLs.
- `npm.cmd run build` — pass, 359 static pages generated.
- `git diff --check` — pass; CRLF warnings only.

## Audit Movement

- High-priority queue moved from 35 to 32 posts after this batch.
- Low-internal-linking issue count moved from 72 to 69 posts.
- Thin-content issue count moved from 69 to 66 posts.
- Missing FAQ issue count moved from 63 to 60 posts.
- Stale-content issue count moved from 61 to 58 posts.

## Deployment QA Plan

Git-connected production deployment:

- Commit: `30aadc4c` (`Rewrite kimchi Suwon and rainy food posts`)
- Deployment: `dpl_9nhW8Kr4c21ovMnKu9zVc5VmyCkt`
- Production alias: `www.epickor.com`
- Status: Ready

Public QA results:

- `/blog/062`, `/blog/064`, and `/blog/065` returned HTTP 200 and expected title markers.
- Each rewritten public page contains `.affiliate-inline-cta`, `<table>`, and FAQ markers.
- `sitemap.xml` contains `/blog/062`, `/blog/064`, and `/blog/065`.
- Reverse/source links from `/blog/050`, `/blog/060`, `/blog/149`, and `/blog/159` are present publicly.
