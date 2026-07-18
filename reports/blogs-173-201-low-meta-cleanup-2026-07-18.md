# Blogs 173/175/181/191/194/195/198/199/201 Low Meta Cleanup - 2026-07-18

## Scope

- Tightened audit-flagged titles for Blogs `173`, `175`, `181`, `194`, `195`, `198`, `199`, and `201`.
- Shortened the remaining overlong description on Blog `191`.
- Normalized FAQ question markup in Blogs `194`, `195`, `198`, `199`, and `201` so the current reviewer recognizes Q&A blocks.
- Normalized line endings on the touched blog files after mixed newline behavior blocked frontmatter parsing in early review checks.

## SEO/AEO Impact

- Sitewide average improved from `97/100` to `98/100`.
- Critical: `0`
- High: `0`
- Medium: `0`
- Title length issues improved from `61` to `53`.
- Description length issues improved from `1` to `0`.
- Low internal-linking stayed at `8`.

## Automated Review

All touched posts passed `review-post.mjs --dry-run`:

| Blog | Result | SEO score |
|---|---:|---:|
| `173` | PASS | 100/100 |
| `175` | PASS | 100/100 |
| `181` | PASS | 100/100 |
| `191` | PASS | 100/100 |
| `194` | PASS | 100/100 |
| `195` | PASS | 100/100 |
| `198` | PASS | 100/100 |
| `199` | PASS | 100/100 |
| `201` | PASS | 100/100 |

## Validation

- `npm.cmd run audit:seo-aeo` passed and regenerated `reports/seo-aeo-audit.md`.
- `npm.cmd run audit:amazon-links` passed: all direct Amazon URLs use exactly one approved tracking tag.
- `git diff --check` passed with only Windows LF/CRLF warnings.
- `npm.cmd run build` passed: 363 static pages generated.

## Notes

- This was a metadata and FAQ-structure cleanup batch, not a factual rewrite batch.
- Next safest targets from the regenerated audit are `202`, `203`, `204`, `205`, `206`, `212`, `213`, `214`, and `216`, mostly title-length-only.
