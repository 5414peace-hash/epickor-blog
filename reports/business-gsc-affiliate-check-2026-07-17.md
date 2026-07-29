# Business GSC and Affiliate Check — 2026-07-17

## Decision summary

- The `/business/` section has moved beyond its zero-impression launch baseline: the newest local GSC export contains **19 impressions and 0 clicks across two business pages**.
- The first visible result is discovery, not yet traffic. Both pages average positions around 7.5–7.9, but the sample is too small to infer stable ranking or CTR.
- Amazon tracking and sales are functioning. The limiting factor remains qualified click volume and category/page attribution, not a broken affiliate tag.
- The Agoda pilot is only a few days old and has no saved post-launch click/booking export in the repository. Keep the two-page pilot unchanged until the required 2–4 week observation window is complete.

## GSC comparison

Launch baseline recorded on 2026-07-04 from the 2026-06-17 export:

- Business rows: `0`
- Business impressions: `0`
- Business clicks: `0`

Newest local export checked:

- Folder: `output/gsc/https___www.epickor.com_-Performance-on-Search-2026-07-08`
- Export chart window: 2026-04-06 through 2026-07-05
- Business rows found: `2`
- Business impressions: `19`
- Business clicks: `0`

| Business page | Clicks | Impressions | CTR | Average position |
|---|---:|---:|---:|---:|
| `/business/how-to-find-suppliers-in-korea` | 0 | 15 | 0% | 7.93 |
| `/business/k-beauty-oem-odm-korea` | 0 | 4 | 0% | 7.50 |
| **Total** | **0** | **19** | **0%** | — |

Interpretation:

- Google discovered and surfaced the first two business guides shortly after launch.
- The page export does not reveal the exact query for those 19 impressions. The query export contains no clearly attributable supplier/OEM/ODM term for these pages, likely because of GSC privacy/volume thresholds.
- Other business URLs were absent from this export. Most were published or updated after the export's 2026-07-05 endpoint, so absence is not an indexing failure signal.
- Recheck after a fresh export covers at least 7–14 post-publication days for the newer posts. Use page-plus-query filters in GSC when possible.

## Business measurement status

The current repository contains ten public business Markdown posts. The launch baseline and indexing-watch documents remain valid, but this report supersedes their “no business rows yet” measurement.

For the 2026-10-05 review, continue tracking:

1. `/business/` clicks and impressions by page.
2. Buyer/operator-intent queries, not broad Korea news terms.
3. Country mix and overseas traffic in analytics.
4. Amazon outbound clicks by business slug and CTA context.
5. Inbound company or buyer enquiries that mention a business article.

No authenticated GSC API/session or fresh GA4 export is stored in this workspace, so country mix, buyer-like sessions, and conversion events cannot be numerically verified from local files in this check.

## Amazon status

The newest recorded read-only Associates Central verification is in `reports/amazon-affiliate-link-audit-2026-07-17.md`:

- Report updated by Amazon through 2026-07-15.
- Last 30 days: 15 clicks, 4 ordered items, 4 shipped items, `$4.18` earnings.
- Current month: 9 clicks, 4 ordered items, 4 shipped items, 44.44% conversion, `$4.18` earnings.
- Store ID `epickor2026-20` and the five category tracking IDs were validated with Amazon Link Checker.
- The repository audit reports zero missing, duplicate, or unapproved direct-link tags after the Blog 136 correction.

An earlier HANDOFF snapshot lists 17 last-30-day clicks and 6 current-month clicks from a 2026-07-14 view. Amazon reporting windows and update timing can change the displayed snapshot; the dated 2026-07-17 audit is the latest direct verification and should be used for this report.

Conclusion: sales proof is promising but too small for page-level optimization. Preserve the staged category-ID pilot and compare Amazon reports with GA4 `affiliate_amazon_click` after more clicks accumulate.

## Agoda status

- Pilot pages: Blogs `188` and `257`.
- Affiliate CID: `1968802`.
- The global analytics listener emits `affiliate_agoda_click` with content slug/type, CTA context, CID, and destination city ID.
- Three public destination links were previously verified for Seoul, Busan, and Incheon.
- No Agoda partner-report export or GA4 event export newer than pilot launch is saved in the repository.

The pilot was published around 2026-07-14, making it approximately three days old at this check. That is below the operating rule's minimum 2–4 week review window. Do not add more pages or property-level links yet.

## Next measurement checkpoints

- Export GSC again after the data window includes the newer business posts for at least 7–14 days.
- Review `affiliate_amazon_click` by slug/category alongside the five Associates tracking-ID reports when the pilot has a meaningful click sample.
- Review `affiliate_agoda_click` and Agoda partner reporting no earlier than two weeks after launch; prefer four weeks if event volume is sparse.
- Keep the 2026-10-05 business-section expansion gate unchanged.
