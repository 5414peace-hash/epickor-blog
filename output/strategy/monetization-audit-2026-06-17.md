# EpicKor Monetization Audit - 2026-06-17

## Scope

- GSC source: `output/gsc/https___www.epickor.com_-Performance-on-Search-2026-06-17`
- GSC filter: Web search, last 3 months
- Instagram source: representative-provided Professional Dashboard screenshots, recent 30 days
- Amazon source: representative-provided Amazon Associates dashboard screenshot
- Rule: do not infer missing dashboard values beyond the supplied screenshots and local files.

## Baseline

### Google Search Console

- Clicks: 654
- Impressions: 197,044
- Average CTR: 0.33%
- Device split:
  - Mobile: 434 clicks / 120,190 impressions / 0.36% CTR
  - Desktop: 209 clicks / 73,967 impressions / 0.28% CTR
  - Tablet: 11 clicks / 2,887 impressions / 0.38% CTR
- Country leaders by clicks:
  - United States: 132 clicks / 56,429 impressions / 0.23% CTR
  - India: 81 clicks / 29,150 impressions / 0.28% CTR
  - Korea: 80 clicks / 7,202 impressions / 1.11% CTR
  - Singapore: 29 clicks / 4,181 impressions / 0.69% CTR

### GSC Change Versus 2026-06-01 Export

- 2026-06-01 export: 533 clicks / 144,691 impressions / 0.37% CTR
- 2026-06-17 export: 654 clicks / 197,044 impressions / 0.33% CTR
- Directional read: visibility grew, but CTR softened.
- Caveat: both exports are rolling "last 3 months" reports, not fixed-date cohort comparisons.

### Instagram

- Views: 38,000
- Reached accounts: 12,000
- Interactions: 1,132
- Engaged accounts: 616
- Profile activity: 285
- Profile visits: 276
- External link taps: 8
- Followers: 14,000
- Read: reach and engagement exist, but profile-to-link movement is weak.

### Amazon Associates

- Last 30 days dashboard:
  - Clicks: 42
  - Total commissions: $0.00
  - Total bounties: $0.00
- This month summary:
  - Clicks: 15
  - Ordered items: 0
  - Shipped items: 0
  - Earnings: $0.00
  - Conversion: 0.00%
- Read: affiliate clicks exist, but order conversion is not yet proven.

## Highest-Impact Page Signals

### Top GSC Pages

| Slug | Clicks | Impressions | CTR | Position | Read |
|---|---:|---:|---:|---:|---|
| 071 | 89 | 8,823 | 1.01% | 6.05 | Best current search click asset; snack monetization fit. |
| 090 | 81 | 85,567 | 0.09% | 6.48 | Massive CTR leak; culture/language monetization fit is weak. |
| 167 | 57 | 6,704 | 0.85% | 8.38 | Entertainment demand; affiliate intent likely soft. |
| 082 | 44 | 26,249 | 0.17% | 7.13 | CTR leak; education/culture monetization fit is weak. |
| 160 | 26 | 2,438 | 1.07% | 7.41 | Strongest direct Amazon fit among top pages. |
| 171 | 25 | 673 | 3.71% | 7.05 | Good CTR; food-at-home monetization fit. |

### Top Query Clusters

- Deli Manjoo cluster:
  - `deli manjoo`: 12 clicks / 2,252 impressions / 0.53% CTR
  - `duli manjoo`: 11 clicks / 337 impressions / 3.26% CTR
  - `doli manjoo`: 9 clicks / 272 impressions / 3.31% CTR
  - `delimanjoo`: 8 clicks / 1,396 impressions / 0.57% CTR
- Ahjussi cluster:
  - `ahjussi meaning`: 7 clicks / 22,896 impressions / 0.03% CTR
  - `ahjussi`: 6 clicks / 9,622 impressions / 0.06% CTR
  - `ahjussi in korean`: 4 clicks / 2,785 impressions / 0.14% CTR
- Education cluster:
  - `sky universities korea`: 5 clicks / 1,177 impressions / 0.42% CTR
  - `sky university`: 1 click / 2,829 impressions / 0.04% CTR

## Diagnosis

EpicKor is not failing at attention. It is weak at conversion architecture.

The current system can create reach through Reels and visibility through SEO. The missing piece is a short, clear path from Instagram interest to a controlled EpicKor hub, then to high-intent guides, then to Amazon comparison moments.

## Immediate Work Plan

1. Build `/instagram` as the controlled Instagram/Littly destination.
2. Keep Littly simple: one main hub button plus one current Reel guide.
3. Improve Amazon fit on the first money pages: `/blog/160`, `/blog/171`, `/blog/071`.
4. Improve CTR pages separately: `/blog/090`, `/blog/082`.
5. Expand the Amazon link database with travel-prep products because recent posts skew travel and festival planning.

## Measurement Plan

- Littly should measure first-button clicks to `/instagram`.
- Internal links from `/instagram` use UTM parameters:
  - `utm_source=instagram`
  - `utm_medium=littly`
  - `utm_campaign=profile_hub`
- Recheck after 7-14 days:
  - Instagram profile visits
  - Instagram external link taps
  - Littly button clicks
  - GSC clicks and CTR for 071, 082, 090, 160, 171
  - Amazon clicks and ordered items

## Near-Term Targets

- Instagram external link taps: 8 per 30 days -> 20+ per 30 days
- Profile visit to external tap rate: 2.9% -> 5%+
- `/blog/090` CTR: 0.09% -> 0.20%+ as first milestone
- `/blog/082` CTR: 0.17% -> 0.30%+ as first milestone
- Amazon: move from 42 clicks / 0 orders to enough click volume to judge product fit; do not claim conversion failure before a larger sample.
