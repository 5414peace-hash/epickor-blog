# Business Company Deep Dives - 2026-07-09

## Scope

- Added two EpicKor Business Type B-2 non-client company spotlights.
- Posts:
  - `/business/toss-viva-republica-deep-dive`
  - `/business/musinsa-company-deep-dive`
- Byline: `EpicKor Business Editor`
- Consent status: `not-applicable`
- Video embed permission: `not-applicable`
- Tripclip production credit: omitted, because both posts are public-information-only non-client spotlights.

## Source Review

### Toss / Viva Republica

Primary public sources checked:

- Toss official English homepage: `https://toss.im/en`
- Toss official team page: `https://toss.im/en/team`
- Toss in Numbers official report: `https://toss.im/tossfeed/edition/data-report/en/toss-in-numbers`
- Toss Bank official site: `https://tossbank.com/`
- Toss Securities official site: `https://www.tossinvest.com/`
- Toss Place official site: `https://tossplace.com/`

Editorial handling:

- Used official adoption and product-scope claims.
- Avoided unsourced private-company revenue, valuation, or profitability claims.
- Framed the article as fintech strategy and public company context, not investment advice.

### MUSINSA

Primary public sources checked:

- MUSINSA corporate page: `https://corp.musinsa.com/`
- MUSINSA Newsroom Q1 2026 performance release: `https://newsroom.musinsa.com/newsroom-menu/2026-0527`
- MUSINSA Newsroom 2026 summer Black Friday release: `https://newsroom.musinsa.com/newsroom-menu/2026-0626`
- MUSINSA Global page: `https://global.musinsa.com/choose-location`

Editorial handling:

- Used company-reported 2026 figures with source-date framing.
- Distinguished public signals from audited long-form analysis.
- Kept buyer/operator checks separate from consumer fashion commentary.

## Duplicate And Trust Review

- Existing `/business/` posts were reviewed before drafting. None covered Toss, Viva Republica, MUSINSA, Korean fintech super apps, or MUSINSA as a company deep dive.
- Existing consumer/culture EpicKor content may touch Korean fashion or shopping, but does not duplicate these B-2 business spotlights.
- `content/data/business-topics-queue.json` was updated with representative-approved topics 11 and 12.
- Queue item 3 was corrected from `candidate` to `approved` because it already had approval and a published `/business/` path.

## Verification Results

- Structure check passed for both posts: public visibility, 120-155 character descriptions, 2 affiliate CTA boxes each, 2+ tables each, 4+ H2 sections, 3+ FAQ items, 1,800+ words, and no missing local image paths.
- `npm.cmd run audit:seo-aeo` passed on 2026-07-09 with average score 78/100.
- `npm.cmd run build` passed on 2026-07-09. Build output included `/business/toss-viva-republica-deep-dive` and `/business/musinsa-company-deep-dive`.
- Local server check passed on `http://localhost:4000`:
  - Toss page: HTTP 200; HTML included title, table markup, and affiliate CTA markup; 4 article images returned HTTP 200.
  - MUSINSA page: HTTP 200; HTML included title, table markup, and affiliate CTA markup; 3 article images returned HTTP 200.
- In-app browser UI inspection could not run because the browser backend was unavailable in this Codex session. The fallback HTTP and image-resource verification was recorded instead.

## Agent Roles

- Strategy Agent: selected both topics as approved B-2 non-client company spotlights and checked duplicate risk against existing business coverage.
- Research Agent: gathered official public company sources and current 2026 MUSINSA newsroom figures.
- Writer Agent: drafted both English posts with public-info framing, source sections, internal links, tables, and Amazon affiliate CTAs.
- Reviewer Agent: checked metadata, image paths, affiliate attributes, source links, build output, local page HTML, and local image-resource responses.
