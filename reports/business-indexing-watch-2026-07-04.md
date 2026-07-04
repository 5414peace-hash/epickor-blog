# Business Indexing Watch - 2026-07-04

## Scope

This report starts the post-launch indexing watch for the new EpicKor `/business/` section.

Tracked URLs:

- `https://www.epickor.com/business`
- `https://www.epickor.com/business/editor`
- `https://www.epickor.com/business/how-to-find-suppliers-in-korea`
- `https://www.epickor.com/business/k-beauty-oem-odm-korea`
- `https://www.epickor.com/business/korea-trade-shows-overseas-buyers`

## Current Public Status

- `https://www.epickor.com/sitemap.xml` returned `200`.
- Public sitemap contains all five tracked business URLs above.
- The three published business post pages previously returned `200` after the image rebalance deployment.
- The 12 newly added business post image assets returned `200`.

## GSC Baseline

Latest local GSC exports available:

- `output/gsc/https___www.epickor.com_-Performance-on-Search-2026-04-27`
- `output/gsc/https___www.epickor.com_-Performance-on-Search-2026-05-22`
- `output/gsc/https___www.epickor.com_-Performance-on-Search-2026-06-01`
- `output/gsc/https___www.epickor.com_-Performance-on-Search-2026-06-17`

Latest checked export:

- `output/gsc/https___www.epickor.com_-Performance-on-Search-2026-06-17`

Search performed:

- `/business`
- `business`

Result:

- Business-section rows found: `0`
- Business-section clicks: `0`
- Business-section impressions: `0`

This is expected because the `/business/` section did not exist publicly during the latest local GSC export window.

## GSC Action Path

Manual GSC step still required:

- Submit or revalidate `https://www.epickor.com/sitemap.xml` in Google Search Console.
- Use URL Inspection for the three first business posts after sitemap discovery:
  - `/business/how-to-find-suppliers-in-korea`
  - `/business/k-beauty-oem-odm-korea`
  - `/business/korea-trade-shows-overseas-buyers`

Codex could not complete the actual GSC submission from this environment because no authenticated GSC tool/API session is available in the current workspace.

## Watch Queries

Track buyer/operator intent queries first:

- `how to find suppliers in Korea`
- `Korean suppliers`
- `Korea sourcing`
- `buyKOREA`
- `tradeKorea`
- `GobizKOREA`
- `K-beauty OEM Korea`
- `Korean cosmetics ODM`
- `cosmetics manufacturer Korea`
- `Korea trade shows buyers`
- `KOTRA trade events`
- `Korea B2B matching`

## Watch Metrics

Use this launch baseline for the 2026-10-05 review:

- `/business/` clicks and impressions.
- Query-level buyer/operator intent impressions.
- Country mix, especially overseas markets outside Korea.
- Pages receiving first impressions.
- Any inbound company/client interest mentioning business posts.
- Amazon affiliate CTA clicks from business posts if tracking becomes available.

## Next Check

Run the next comparison after the first post-launch GSC export is available. A practical first review window is 7-14 days after deployment, then weekly until the 2026-10-05 section review.
