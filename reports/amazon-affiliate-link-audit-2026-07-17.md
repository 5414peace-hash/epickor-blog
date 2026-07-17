# Amazon Affiliate Link Audit — 2026-07-17

## Decision

Do not replace the sitewide manually constructed Amazon search links. Amazon Associates Central validates the shared `epickor2026-20` tag, and Amazon's current Program Policies explicitly allow associates to create their own Special Links when the correct tag and formatting are present.

## Repository Findings

- Blog content contains 790 Amazon URL occurrences across 268 posts.
- 499 are direct `amazon.com` search-result links.
  - 498 used exactly one `tag=epickor2026-20` parameter before this correction.
  - One link in Blog 136 had no tag and was corrected locally.
- 291 are `amzn.to` short-link occurrences.
- The 499 search links resolve to 171 unique URLs; the short links resolve to 40 unique URLs.
- The most repeated search links are broad fallbacks rather than broken tracking links:
  - Korean culture/history books: 45 occurrences.
  - Korea travel essentials: 44 occurrences.
  - Korean phrasebooks: 29 occurrences.
  - Portable travel power banks: 28 occurrences.
  - Korean food starter packs: 26 occurrences.

After the Blog 136 correction, the reusable repository audit reports:

- 567 direct `amazon.com` occurrences with one approved tracking tag.
- 324 `amzn.to` occurrences.
- Zero direct Amazon URLs with a missing, duplicate, or unapproved tag across blog content, business content, and the Amazon link catalog.

Run the guard with:

```powershell
npm.cmd run audit:amazon-links
```

## Associates Central Verification

Verified read-only through the representative's logged-in Chrome session:

- Associates Central displays Store ID `epickor2026-20`.
- The Tracking ID report selector contains only `epickor2026-20`, so the combined report currently equals that ID's report.
- Last-30-day report, updated July 15, 2026: 15 clicks, 4 ordered items, 4 shipped items, and $4.18 earnings.
- Current-month summary: 9 clicks, 4 ordered items, 4 shipped items, 44.44% conversion, and $4.18 earnings.
- Amazon's own Link Checker returned success for both:
  - A representative manually constructed search link using `tag=epickor2026-20`.
  - A representative `amzn.to` short link.
- Link Checker states that the tested link tags to a valid tag or sub-tag for the account.

The dashboard also says the account has made two qualifying sales and is awaiting Amazon's account review. Link tracking is functioning, but final account approval remains a separate Amazon compliance gate.

## Official Policy Basis

- Amazon Associates Program Policies state that Special Links may be created by the associate or supplied by Amazon. A direct Amazon URL must include the assigned Associate ID or tracking ID as the `tag` parameter.
- The same policy explicitly permits links to product-list pages, including Amazon search results, when the associate page contains relevant original content.
- SiteStripe is a convenient link generator, not the only valid way to create a tracked link.
- Amazon prohibits artificially generated clicks. No self-click experiment was used as evidence; Associates Link Checker and the account report are the correct verification surfaces.

Official sources:

- https://affiliate-program.amazon.com/help/operating/policies
- https://affiliate-program.amazon.com/help/operating/agreement/
- https://affiliate-program.amazon.com/help/node/topic/GJMMT7G4C8K4Y3AY

## Recommended Attribution Design

The existing links are valid, but one shared tracking ID cannot identify which category caused an Amazon-side sale. The efficient improvement is not a 790-link replacement for validity. It is a staged attribution upgrade:

1. Keep all current valid links live.
2. Continue using GA4 `affiliate_amazon_click`, which already records page, content slug, CTA context, search query, link text, and affiliate tag.
3. Use a small set of category tracking IDs in Associates Central for future or high-value links: Food, Travel, Beauty, Books/Culture, and Shopping/Gear.
4. Apply the new IDs first to the highest-traffic and highest-purchase-intent pages, then compare Amazon Tracking ID reports with GA4 outbound-click reports.
5. Replace broad generic search links gradually only when product relevance or conversion data justifies it. Do not replace them merely because they were manually assembled.

## Implementation Update

The representative approved all three follow-up actions on July 17, 2026.

Created in Associates Central and individually validated with Amazon Link Checker:

- `epickor-food-20`
- `epickor-travel-20`
- `epickor-beauty-20`
- `epickor-books-20`
- `epickor-gear-20`

First staged deployment scope:

| Tracking ID | Pilot pages | Direct links changed | Rationale |
|---|---|---:|---|
| `epickor-food-20` | 071, 153, 171 | 4 | Highest current food/snack/breakfast monetization fit |
| `epickor-beauty-20` | 160 | 2 | Strongest direct Amazon fit among high-GSC pages |
| `epickor-travel-20` | 223 | 2 | Clear pre-flight document and card-pouch intent |
| `epickor-books-20` | 082, 090 | 2 | High-traffic education/language attribution test |
| `epickor-gear-20` | 006, 136 | 3 | Practical lock and shopping/gear attribution test |

The Blog 071 late CTA was narrowed from a broad Korean-food starter-pack search to Korean custard cake snacks. Blog 006's generic travel-lock search was narrowed to a compact cable bike lock. Blogs 082 and 090 now use more specific beginner-study and polite-expression searches. Existing direct-product `amzn.to` links were preserved because they remain valid and may convert better than a search page.

Verification completed before publication:

- All five new IDs appear in Manage Your Tracking IDs.
- All five IDs passed Amazon Link Checker.
- `npm.cmd run audit:amazon-links` passed with zero missing, duplicate, or unapproved direct-link tags.
- Next.js Webpack production build passed with 359 generated routes.
- Built HTML for all nine touched pages contains the intended category tag.
- All 13 category-tagged direct links render with `target="_blank"` and `rel="nofollow sponsored noopener noreferrer"`.
- The production bundle still contains `affiliate_amazon_click` instrumentation.

## Chrome Capability Boundary

With the logged-in Chrome session, Codex inspected Associates reports, validated links, created the five approved Tracking IDs, and confirmed the account state. The same surface can be used later for SiteStripe product links and report review.
