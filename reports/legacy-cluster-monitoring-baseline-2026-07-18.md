# Legacy Cluster Monitoring Baseline - 2026-07-18

Scope:

- Previously rewritten high-priority legacy cluster: Blogs `001/026/039`, `075/076/077`, `015/053/007`, and `051/124/127/129/130/131/125`.
- Current follow-up work shipped in this pass: Blogs `002/006/023/024/025` and a capped internal-link pass across `005/019/021/022/027/028/029/032/034/040/048/058`.

## Why This Baseline Exists

The just-published legacy cluster should not be judged immediately after deployment. Google Search Console performance data is delayed, and Google documentation notes that performance data is normally available after a delay of about two to three days. The practical monitoring window is therefore:

- First indexing/performance check: 2026-07-21 to 2026-07-22 KST.
- Seven-day stability check: 2026-07-25 to 2026-07-26 KST.
- Compare against the pre-rewrite export below, not against same-day impressions.

Primary official references:

- Google Search Console performance data availability: https://support.google.com/webmasters/answer/96568
- Google URL Inspection / indexing status workflow: https://support.google.com/webmasters/answer/9012289
- Google sitemap guidance: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

## Pre-Rewrite GSC Baseline

Source export:

`output/gsc/https___www.epickor.com_-Performance-on-Search-2026-07-08`

Filter:

- Search type: web
- Export window: last 3 months
- Chart coverage: 2026-04-06 through 2026-07-05

| Slug | Clicks | Impressions | CTR | Avg. Position |
|---|---:|---:|---:|---:|
| 001 | 0 | 60 | 0% | 13.88 |
| 026 | 0 | 8 | 0% | 8.50 |
| 039 | 11 | 972 | 1.13% | 10.65 |
| 075 | 1 | 119 | 0.84% | 10.50 |
| 076 | 0 | 0 | 0% | - |
| 077 | 0 | 112 | 0% | 18.96 |
| 015 | 8 | 634 | 1.26% | 7.89 |
| 053 | 0 | 0 | 0% | - |
| 007 | 0 | 54 | 0% | 22.24 |
| 051 | 2 | 920 | 0.22% | 10.18 |
| 124 | 11 | 357 | 3.08% | 6.36 |
| 127 | 0 | 38 | 0% | 12.26 |
| 129 | 3 | 373 | 0.80% | 6.06 |
| 130 | 6 | 373 | 1.61% | 6.61 |
| 131 | 0 | 70 | 0% | 10.97 |
| 125 | 4 | 115 | 3.48% | 6.29 |

Baseline totals:

- Clicks: 46
- Impressions: 4,205
- Pages with visible impressions: 14 of 16

## Monitoring Checklist

At the first check window:

1. Confirm the 16 legacy URLs still return HTTP 200.
2. Confirm sitemap entries remain present.
3. Spot-check titles/descriptions in the deployed HTML.
4. In GSC, compare impressions, clicks, CTR, and average position against the baseline table.
5. Record whether the two zero-impression pages (`076` and `053`) gained any visibility.

At the seven-day check window:

1. Compare each page against the baseline, not only the cluster total.
2. Flag winners: higher impressions with stable or improved CTR.
3. Flag mixed pages: higher impressions but lower CTR after title change.
4. Flag pages needing title/description revision: impressions up, CTR near zero, position not worse.
5. Do not broadly rewrite the same cluster again unless data shows a clear issue.

## Current Follow-Up Edits To Track Separately

The 2026-07-18 pass should be evaluated separately because it affects a different group:

- Full rewrites: `002`, `006`, `023`, `024`, `025`.
- Internal-link source pages: `005`, `019`, `021`, `022`, `027`, `028`, `029`, `032`, `034`, `040`, `048`, `058`.

Expected impact:

- `002/006/023/024/025`: trust, freshness, title/description quality, FAQ coverage, table coverage, and monetization readiness.
- 12-source internal-link pass: better crawl paths from older thin posts into stronger current guides and affiliate-ready pages.
- The previous 16-post cluster: should remain stable long enough to observe crawl and ranking response.

## Decision Rule

Use data before making another broad legacy pass on the same cluster:

- If impressions rise but CTR falls, revise titles/descriptions only.
- If impressions and clicks rise, leave the pages stable.
- If a page remains invisible after the seven-day check, inspect indexing status and internal links before rewriting content again.
- If affiliate clicks rise from linked pages, expand internal links and CTA tuning in small batches rather than replacing whole articles.
