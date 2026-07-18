# Blogs 143/184/185/190/192/197/200/215 Low SEO Cleanup - 2026-07-18

## Scope

- Tightened overlong or audit-flagged titles for Blogs `143`, `184`, `185`, `190`, `192`, `197`, `200`, and `215`.
- Shortened overlong meta descriptions for Blogs `190` and `192`.
- Added contextual internal-link bridges to Blogs `143`, `184`, `185`, `197`, `200`, and `215`.
- Standardized FAQ question markup in Blogs `192`, `197`, and `200` so the current reviewer recognizes Q&A blocks.
- Normalized line endings on the touched blog files to keep the reviewer frontmatter parser stable.

## SEO/AEO Impact

- Sitewide average stayed at `97/100`.
- Critical: `0`
- High: `0`
- Medium: `0`
- Title length issues improved from `78` to `70`.
- Low internal-linking issues improved from `14` to `8`.
- Description length issues improved from `3` to `1`.

## Automated Review

All touched posts passed `review-post.mjs --dry-run`:

| Blog | Result | SEO score |
|---|---:|---:|
| `143` | PASS | 100/100 |
| `184` | PASS | 100/100 |
| `185` | PASS | 100/100 |
| `190` | PASS | 100/100 |
| `192` | PASS | 100/100 |
| `197` | PASS | 100/100 |
| `200` | PASS | 100/100 |
| `215` | PASS | 100/100 |

## Validation

- `npm.cmd run audit:seo-aeo` passed and regenerated `reports/seo-aeo-audit.md`.
- `npm.cmd run audit:amazon-links` passed: all direct Amazon URLs use exactly one approved tracking tag.
- `git diff --check` passed with only Windows LF/CRLF warnings.
- `npm.cmd run build` passed: 363 static pages generated.
- Implementation commit: `119745c7`.
- Pushed to `origin/master`.
- Vercel production deployment: `dpl_9bxycdxdYqfydxeDho6sB1Nxn9xL`, Ready.
- Public QA passed for `/blog/143`, `/blog/184`, `/blog/185`, `/blog/190`, `/blog/192`, `/blog/197`, `/blog/200`, `/blog/215`, and `/sitemap.xml`.

## Notes

- This was a low-risk SEO polish batch, not a factual rewrite batch. No new factual claims were introduced.
- Next safest cleanup targets from the regenerated audit are `059`, `060`, `079`, `132`, `135`, `141`, `151`, `167`, and `169`, mostly title-length-only issues.
