# Blogs 066/070/079 Content-Debt Rewrite Review - 2026-07-18

## Scope

Rewrote the next high-priority legacy content-debt batch:

- Blog `066`: Hangang swimming pools and water playgrounds in Seoul
- Blog `070`: Korean dramas on Netflix watch-first guide
- Blog `079`: Living in Seoul for a month

The goal was to replace thin/outdated legacy posts with current, practical, monetizable guides that support EpicKor's search, reader-trust, internal-linking, and Amazon affiliate funnel.

## Editorial Changes

### Blog 066

- Reframed from a vague "six Han River pools" essay into a current 2026 Hangang pool guide.
- Added 2026 season dates, hours, site type distinction, prices, swim-cap rule, water-entry breaks, weather-suspension warning, packing checklist, and site-selection advice.
- Corrected the outdated assumption that all six locations are full swimming pools; the 2026 official lineup is two swimming pools plus four water playgrounds.
- Added internal links to Seoul summer, heatwave, rainy season, packing, payment, subway, Hangang picnic, and Hangang Bus guides.
- Added two disclosed Amazon CTAs for sunscreen and compact umbrella search intent.

### Blog 070

- Reframed from a generic K-drama culture essay into a 2026 Netflix K-drama watch-first guide.
- Used Netflix's own 2025 engagement reporting and 2026 Korea slate framing as source context.
- Added availability caveat because Netflix catalog access varies by country and date.
- Organized recommendations by viewer mood: global phenomenon, emotional family story, medical rescue, youth action, historical genre, and classics.
- Added internal links to the 2026 drama guide, Kim Soo-hyun, Kim Go-eun, Korean traditional games, K-pop photocard, and Korean culture guides.
- Added two disclosed Amazon CTAs for K-drama fan goods and Korean culture/history books.

### Blog 079

- Reframed from a sociological "Seoul sabbatical" essay into a practical one-month Seoul living guide.
- Added entry/arrival-card caveats, K-ETA caution, neighborhood strategy, transit setup, Climate Card update, app friction, budget reality, laundry and weekly rhythm.
- Avoided legal advice; readers are told to verify nationality-specific rules through official Korean government/consular sources.
- Added internal links to first-time Korea, eSIM, payment, maps, neighborhoods, subway etiquette, laundry, luggage delivery, stationery, and cookware guides.
- Added two disclosed Amazon CTAs for travel card pouch and compact umbrella search intent.

## Reverse/Internal Link Pass

Added contextual reverse links from existing posts:

- To Blog `066`: `183`, `204`
- To Blog `070`: `025`, `042`, `167`
- To Blog `079`: `026`, `169`, `201`, `222`

These were added only where the destination naturally extends the reader's next decision, rather than as a broad sitewide link injection.

## Automated Review

Reviewer script:

- `066`: 100/100, 2,303 words, 8 H2, 3 images, 6 FAQ Q&A
- `070`: 100/100, 2,256 words, 8 H2, 3 images, 6 FAQ Q&A
- `079`: 100/100, 2,337 words, 9 H2, 3 images, 6 FAQ Q&A

Sitewide audits:

- `npm.cmd run audit:seo-aeo`: pass, average SEO/AEO score `89/100`
- Priority movement: high-priority posts `32 -> 29`
- Issue movement: low-internal-linking `69 -> 64`, thin content `66 -> 63`, missing FAQ `60 -> 57`, stale posts `58 -> 56`
- `npm.cmd run audit:amazon-links`: pass, all direct Amazon URLs use exactly one approved tracking tag
- `npm.cmd run build`: pass, 359 static pages generated
- `git diff --check`: pass; only expected Windows LF/CRLF warnings

## Deployment

Pending at the time of this initial report. Deployment ID, alias status, and public QA will be appended after commit, push, and Vercel verification.

## Notes

- Preserved unrelated untracked file: `reports/business-gsc-affiliate-check-2026-07-17.md`
- No Reels or card-news production was started; this was strictly a blog/content-debt and internal-linking batch.
