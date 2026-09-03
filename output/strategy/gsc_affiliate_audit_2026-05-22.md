# EpicKor GSC + Amazon Affiliate Audit - 2026-05-22

## Inputs Checked

- GSC export folder: `output/gsc/https___www.epickor.com_-Performance-on-Search-2026-05-22/`
- Generated latest strategy report: `output/strategy/week_2026W21.md`
- SEO/AEO audit report: `reports/seo-aeo-audit.md`
- Amazon link inventory: `content/data/amazon-links.json`
- Affiliate insertion script: `.claude/skills/marketing/scripts/insert-links.mjs`
- Runtime markdown enhancer: `lib/markdown-enhancer.ts`
- Blog rendering path: `lib/blog.ts`, `app/blog/[slug]/page.tsx`

## Latest GSC Summary

- Total clicks: 407
- Total impressions: 113,117
- Average CTR: 0.36%
- Blog pages found: 127
- Queries found: 1,000
- Pending topics: 15

## Highest-Impact GSC Opportunities

| Page | Clicks | Impressions | CTR | Position | Read |
| --- | ---: | ---: | ---: | ---: | --- |
| `/blog/090` | 32 | 39,399 | 0.08% | 6.08 | Massive impression gap; title/meta/search-intent issue likely. |
| `/blog/082` | 29 | 15,359 | 0.19% | 6.91 | Strong opportunity, but low direct Amazon fit. |
| `/blog/071` | 40 | 4,593 | 0.87% | 5.92 | Best click volume among quick wins; evaluate topic/product fit before affiliate work. |
| `/blog/160` | 33 | 3,555 | 0.93% | 6.48 | Strong monetization fit because Korean sunscreen/K-beauty already maps to Amazon inventory. |
| `/blog/153` | 12 | 2,406 | 0.50% | 6.36 | Existing Amazon-enabled post; likely worth placement and CTA cleanup. |
| `/blog/055` | 10 | 2,451 | 0.41% | 7.12 | Good social/card-news candidate; product fit depends on topic. |

## Recent Post Affiliate Coverage

| Slug | `amazon: true` | Inline Amazon links | Current diagnosis |
| --- | --- | ---: | --- |
| 166 | no | 1 | Manual inline link exists, no automatic card section. |
| 167 | no | 0 | Skipped or no product fit. |
| 168 | no | 0 | Skipped or no product fit. |
| 169 | no | 0 | Skipped or no product fit. |
| 170 | no | 0 | Skipped or no product fit. |
| 171 | no | 3 | Inline food links exist, but no `amazon: true` card section. |
| 172 | no | 0 | Links were inserted into `output/final/172_final.md`, then removed after review as weak recommendations. |
| 173 | no | 3 | Inline beauty links exist, but no `amazon: true` card section. |
| 174 | no | 0 | Travel/transport topic skipped by category logic. |
| 175 | no | 0 | Shopping/travel topic skipped because `Shopping` does not map to an insertion category. |
| 176 | no | 3 | Inline beauty links exist, but no `amazon: true` card section. |
| 177 | no | 0 | Coffee/cafe topic skipped because `Coffee` and coffee-related keywords do not map to a category. |

## Why New Posts Are Not Getting Amazon Links Consistently

1. Runtime card sections are gated by `amazon: true`.
   - `lib/blog.ts` calls `enhanceMarkdownHTML(..., frontmatter.amazon === true)`.
   - Recent posts 166-177 all currently have no `amazon: true` frontmatter.
   - Therefore the polished `Helpful Shopping Picks` section only appears for posts explicitly flagged, currently older posts such as 153 and 160.

2. Publish-time insertion is separate and weaker.
   - `scripts/run-pipeline.mjs --approve {slug}` runs `.claude/skills/marketing/scripts/insert-links.mjs`.
   - That script inserts raw blockquote-style markdown links into `output/final/{slug}_final.md`.
   - It does not set `amazon: true`, does not create the runtime card section, and does not guarantee a disclosure near the inline links.

3. Category matching is too narrow.
   - `insert-links.mjs` maps `food`, `language`, `society`, `beauty`, and `kbeauty`.
   - It explicitly does not monetize many common EpicKor categories such as `travel`, `seoul`, and `shopping`.
   - It also has no mapping for `coffee`, so Blog 177 was skipped even though research had coffee-related Amazon keywords.

4. Product inventory is incomplete for several new-topic clusters.
   - There are Korean food, beauty, fashion, music, and language products.
   - There are no strong coffee/cafe, travel-prep, transit, market-shopping, or Korean BBQ sauce/cookware bundles beyond generic food/snack items.
   - Result: the system either skips links or inserts weak generic links that should be removed.

5. Quality guardrails worked once, but only manually.
   - Blog 172 received generic snack links for a Korean BBQ guide.
   - `HANDOFF.md` records that these were removed after publish because they were weak.
   - This proves the current automation can create low-intent, off-angle recommendations.

## Link Behavior Issue

Observed code path:

- Markdown content is rendered by `remark-html` in `lib/blog.ts`.
- The resulting HTML is inserted through `dangerouslySetInnerHTML` in `app/blog/[slug]/page.tsx`.
- Standard markdown links become plain `<a href="...">` tags.
- No global transformer currently adds `target="_blank"` or `rel="noopener noreferrer"` to normal external links.
- `lib/markdown-enhancer.ts` adds `target="_blank"` only for generated Amazon product-card buttons inside `amazon-affiliate-section`.

Impact:

- Inline Amazon markdown links open in the same tab.
- External citation links also open in the same tab.
- Generated Amazon card buttons open in a new tab, but most new posts are using inline links or no links.
- Preview rendering is also not identical to public rendering because `getBlogPostForPreview()` does not run the same `enhanceMarkdownHTML()` path as public blog pages.

## SEO/AEO Audit Snapshot

- Total posts: 145
- Average SEO/AEO score: 64/100
- Top repeated issues:
  - low internal linking: 134 posts
  - thin content: 119 posts
  - title length out of range: 106 posts
  - missing FAQ: 99 posts
  - stale content: 87 posts
  - missing affiliate disclosure in posts with affiliate links: 4 posts

## Overall Assessment

EpicKor has three monetization problems:

1. Demand exists but is leaking before conversion.
   - GSC impressions are meaningful, and Amazon has clicks, but conversion is zero.
   - The site needs fewer generic links and more buyer-intent landing points.

2. The affiliate system is split into two inconsistent paths.
   - Runtime card sections are controlled by `amazon: true`.
   - Publish-time inline insertions are separate and do not inherit the card UI, disclosure, or new-tab behavior.

3. Product-topic matching is not yet mature enough.
   - Good matches: K-beauty, Korean snacks, sunscreen, language workbooks.
   - Weak or missing matches: cafe/coffee, Korean BBQ tools/sauces, travel prep, market shopping, subway/travel essentials.

## Recommended Fix Order

1. Fix external link rendering globally.
   - Add a markdown-enhancer step that gives external links `target="_blank"` and `rel="noopener noreferrer"`.
   - Use `rel="nofollow sponsored noopener noreferrer"` for Amazon links.
   - Keep internal `/blog/...` links same-tab.

2. Unify affiliate insertion.
   - Decide whether new posts should use runtime card sections, inline contextual links, or both.
   - If using runtime cards, publish flow should set `amazon: true` only after product relevance passes.
   - If using inline contextual links, the renderer must still add disclosure and target/rel attributes.

3. Run a focused monetization cleanup on existing proven pages.
   - Priority 1: `/blog/160` because it has 3,555 impressions and direct K-beauty/sunscreen product fit.
   - Priority 2: `/blog/153` because it already has Amazon enabled and 2,406 impressions.
   - Priority 3: `/blog/071` or `/blog/090` after checking topic/product fit and recent edit history.

4. Expand affiliate inventory before forcing links into new posts.
   - Add high-fit products/search links for Korean BBQ sauces, ssamjang/gochujang, Korean grill/tableware, coffee mix/drip bags, travel adapters, T-money/card-wallet/travel-prep items, and market/snack bundles.

5. Make preview match public rendering.
   - Run the same enhancement path in preview so link behavior, affiliate cards, image handling, and disclosure are visible before approval.

