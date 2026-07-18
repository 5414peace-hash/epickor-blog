# Blogs 236-270 Low Title Cleanup — 2026-07-18

## Scope

- Target posts: `236/237/238/239/241/242/268/269/270`
- Issue class: low-priority `title-length-out-of-range`
- Work type: metadata title tightening plus FAQ marker normalization for reviewer/AEO parsing

## Changes

- Shortened the audit-flagged titles while preserving the core search intent:
  - `236`: Seoul personal color analysis booking/results
  - `237`: Korean fragrance shopping and Seoul perfume route intent
  - `238`: Korea autumn foliage route intent
  - `239`: Korean hair-care shopping categories
  - `241`: Seoul self-photo studio booking/makeup/outfit intent
  - `242`: Seoul vintage shopping route intent
  - `268`: Korean cushion shade guide and 17/21/23 tone intent
  - `269`: Korean beauty-device LED/EMS/Medicube intent
  - `270`: Seoul salt-bread bakery route intent
- Normalized FAQ question markers from heading-style questions to `**Q: ...**` so the current automated reviewer detects existing FAQ blocks correctly.
- Normalized touched blog-file line endings to avoid the current reviewer frontmatter parser edge case.
- No new factual claims, affiliate placements, image changes, or body rewrites were introduced.

## Validation

- Individual reviewer checks: 100/100 for all nine posts.
- `npm.cmd run audit:seo-aeo`: passed.
  - Average SEO/AEO score: 98/100 -> 99/100.
  - `title-length-out-of-range`: 35 posts -> 26 posts.
  - Critical: 0, High: 0, Medium: 0, Low: 273.
- `npm.cmd run audit:amazon-links`: passed.
- `git diff --check`: passed.
- `npm.cmd run build`: passed; 363 static pages generated.

## Current Status

- Implementation commit `485c9a23` is on `origin/master`.
- Vercel production deployment `https://epickor-blog-eh1cqyzm5-yhs-projects-5de403d3.vercel.app` is Ready.
- Public QA passed for all nine pages on `www.epickor.com` plus sitemap entries.

## Next Queue After This Batch

- Continue low title cleanup with `271/272/273/274/275/276/278/280/281`.
- Then continue `282/284/285/286/291/292/293/294/295`, followed by remaining title-only items visible after the next audit.
- Stale-content and low-internal-linking items remain separate later workstreams after title cleanup.
