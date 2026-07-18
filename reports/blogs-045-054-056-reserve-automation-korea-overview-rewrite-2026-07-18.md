# Blogs 045/054/056 Rewrite and Deployment QA - 2026-07-18

## Summary

Rewrote and published the next high-priority legacy content-debt batch:

- Blog `045`: Korean reserve force training, lunch boxes, and duty context.
- Blog `054`: Korea's automated convenience culture, from Hangang ramyeon machines to unmanned stores and robots.
- Blog `056`: South Korea explained through K-pop, rapid growth, tragedy, safety systems, and resilience.

Implementation commit: `bd8a5e29` (`Rewrite reserve automation and Korea overview posts`)

Production deployment:

- Deployment URL: `https://epickor-blog-n1qs7h3pd-yhs-projects-5de403d3.vercel.app`
- Vercel deployment ID: `dpl_862sFL5SHJSaSHyWrDxxLKp5GR1W`
- Status: Ready
- Aliases verified: `https://www.epickor.com`, `https://epickor.com`, `https://epickor-blog.vercel.app`

## Content Improvements

Each rewritten post now includes:

- Updated `date`, SEO title, description, and tags.
- 1,800+ review-counted words.
- 10 H2 sections.
- Two real HTML tables wrapped in `table-scroll`.
- Three article images.
- Two disclosed Amazon affiliate CTA boxes with sponsored/nofollow attributes.
- Six FAQ Q&A pairs.
- Internal links to related EpicKor posts.
- External source links using official or reliable references.

## Source Framing Used

`045` used Korean military/reserve context from:

- Military Manpower Administration reserve-force information.
- Ministry of National Defense reserve-training information.
- Korea law/directive materials on reserve education.
- Korean government policy reporting on military meal improvements.

`054` used automation and unmanned-store context from:

- VISITKOREA Hangang ramyeon coverage.
- Seoul Metropolitan Government survey reporting on unmanned food stores.
- MFDS food-safety guidance and inspection reporting.

`056` used national-context framing from:

- World Bank Korea overview.
- OECD Korea innovation policy review and economic-performance context.
- Korea disaster/safety overview from MOIS.

## Internal Links Added

New source-post reverse links were added from:

- Blog `033` -> `/blog/045`
- Blog `038` -> `/blog/054`
- Blog `012` -> `/blog/054`
- Blog `085` -> `/blog/056`
- Blog `030` -> `/blog/056`

## Automated Checks

- `node .claude/skills/reviewer/scripts/review-post.mjs --draft content/blog/045-a-peek-at-korean-soldiers-lunch.md`
  - Passed, 100/100, 1,828 words, 10 H2, 3 images, 6 FAQ Q&A.
- `node .claude/skills/reviewer/scripts/review-post.mjs --draft content/blog/054-discover-koreas-automated-innovations-from-ramen-machines-to-car-washes.md`
  - Passed, 100/100, 1,816 words, 10 H2, 3 images, 6 FAQ Q&A.
- `node .claude/skills/reviewer/scripts/review-post.mjs --draft content/blog/056-unveiling-korea-from-k-pop-to-historic-triumphs-and-tragedies.md`
  - Passed, 100/100, 1,814 words, 10 H2, 3 images, 6 FAQ Q&A.
- `npm.cmd run audit:seo-aeo`
  - Passed and regenerated `reports/seo-aeo-audit.md`.
- `npm.cmd run audit:amazon-links`
  - Passed: 623 tagged amazon.com URLs, 267 amzn.to URLs.
- `git diff --check`
  - Passed; only normal Windows LF/CRLF warnings.
- `npm.cmd run build`
  - Passed; generated 359 static pages.

## SEO/AEO Movement

Before this batch:

- Average SEO/AEO score: 91/100
- High-priority posts: 17
- Low internal linking: 52
- Thin content: 51
- Missing FAQ: 45
- Stale posts: 44

After this batch:

- Average SEO/AEO score: 91/100
- High-priority posts: 14
- Low internal linking: 49
- Thin content: 48
- Missing FAQ: 42
- Stale posts: 41

## Public QA

Verified after deployment was Ready:

- `https://www.epickor.com/blog/045` returned HTTP 200 with expected title/CTA/FAQ markers.
- `https://www.epickor.com/blog/054` returned HTTP 200 with expected title/topic markers.
- `https://www.epickor.com/blog/056` returned HTTP 200 with expected title/source markers.
- `https://www.epickor.com/sitemap.xml` returned HTTP 200 and included `/blog/045`, `/blog/054`, and `/blog/056`.
- Six newly committed decoded image assets returned HTTP 200.
- Reverse-link source pages returned HTTP 200 and contained the expected links:
  - `/blog/033` contained `/blog/045`.
  - `/blog/038` contained `/blog/054`.
  - `/blog/012` contained `/blog/054`.
  - `/blog/085` contained `/blog/056`.
  - `/blog/030` contained `/blog/056`.

## Notes

- Two initially copied but unused decoded image files were removed before commit so only referenced assets were committed.
- The unrelated untracked file `reports/business-gsc-affiliate-check-2026-07-17.md` was preserved and not committed.
- The next rewrite queue now starts at `067/068/069`, followed by `072/078/080`, then `087/088/003` depending on strategy fit and operational risk.
