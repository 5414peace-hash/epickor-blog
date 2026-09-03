# EpicKor All Public Affiliate Cleanup - 2026-05-22

## Scope

- Cleaned all public blog posts after the GSC top 50 affiliate refresh.
- Current public/private count from local content:
  - Public/default-public posts: 140
  - Private posts: 5

## Completed

- Every public blog post now has exactly two `.affiliate-inline-cta` boxes.
- Legacy blockquote affiliate patterns such as `> 🛒 **Recommended**` were removed from public posts.
- Existing hand-written top-50 CTAs were preserved.
- Lower-priority public posts were filled using the marketing inserter script.
- UTF-8 BOM introduced during mechanical formatting was removed from all blog markdown files.

## Automation Updates

- `.claude/skills/marketing/scripts/insert-links.mjs`
  - No longer skips posts only because Amazon links already exist.
  - Removes legacy blockquote affiliate blocks before inserting.
  - Supports both `##` and `###` section structures.
  - Inserts the missing number of CTA boxes rather than blindly duplicating.
  - Adds safer spacing around CTA blocks.
  - Uses title terms as product-matching context.
  - Ignores overly broad scoring terms such as `korean`, `korea`, `guide`, and `seoul`.

## Product Data Updates

- `content/data/amazon-links.json`
  - Added broader fallback/search products for:
    - Korean phrasebooks
    - Korean culture/history books
    - Korea travel essentials
    - K-pop/K-drama fan goods
    - Korean beauty starter products
    - Korean food starter packs
  - Reclassified the Homi product away from broad `Culture` to avoid overuse as a generic fallback.

## Verification

- Audit result:
  - Public posts: 140
  - Public posts not matching exactly two CTA boxes: 0
  - Public posts with legacy blockquote affiliate blocks: 0
  - Blog markdown files with UTF-8 BOM: 0
- `node --check .claude\skills\marketing\scripts\insert-links.mjs`: passed.
- `content/data/amazon-links.json`: JSON parse passed.
- `npm.cmd run build`: passed.
- Built HTML spot-check for `/blog/001`, `/blog/076`, `/blog/155`, `/blog/171`, `/blog/175`, `/blog/082`, and `/blog/176` contains CTA markup plus Amazon links with `target="_blank"` and `rel="nofollow sponsored noopener noreferrer"`.

## Follow-Up

- After deploy, monitor Amazon Associates clicks and GSC behavior for:
  - CTA density impact on high-impression pages.
  - Posts where broad fallback links were used because no exact product match exists.
  - `/blog/074-the-world-of-underground-shopping-malls-in-korea` redirect consolidation.
  - `/blog/133` versus `/blog/170` PC-bang query split.
