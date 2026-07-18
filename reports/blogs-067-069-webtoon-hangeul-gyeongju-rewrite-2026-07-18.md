# Blogs 067/068/069 Rewrite and Deployment QA - 2026-07-18

## Summary

Rewrote and published the next high-priority legacy content-debt batch:

- Blog `067`: Korean webtoons as a mobile-scroll storytelling and K-drama adaptation pipeline.
- Blog `068`: Hangeul, Korean learning, honorifics, apps, and beginner study strategy.
- Blog `069`: Gyeongju first-timer travel guide covering Silla history, UNESCO temple sites, tomb walks, Hwangnidan-gil, and route planning.

Implementation commit: `a33d02fe` (`Rewrite webtoon Hangeul and Gyeongju posts`)

Production deployment:

- Deployment URL: `https://epickor-blog-6sbgeoweu-yhs-projects-5de403d3.vercel.app`
- Vercel deployment ID: `dpl_2JhveKSTDETHJnibUHkJhc8EMALg`
- Status: Ready
- Aliases verified: `https://www.epickor.com`, `https://epickor.com`, `https://epickor-blog.vercel.app`

## Content Improvements

Each rewritten post now includes:

- Updated `date`, SEO title, description, tags, and `ogImage`.
- 1,800+ review-counted words.
- 12-13 H2 sections.
- Two real HTML tables wrapped in `table-scroll`.
- Three article images.
- Two disclosed Amazon affiliate CTA boxes with sponsored/nofollow attributes.
- Six FAQ Q&A pairs.
- Internal links to related EpicKor posts.
- External source links using official or reliable references.

## Source Framing Used

`067` used webtoon/IP context from:

- Korea.net / MCST reporting on the Korean webtoon industry survey.
- WEBTOON Entertainment IPO announcement.
- NAVER Corp's WEBTOON Nasdaq listing story.
- SEC filing context.

`068` used Korean-language context from:

- Korea.net Hunminjeongeum and King Sejong background.
- National Institute of Korean Language Hangeul principles.
- King Sejong Institute Foundation learning app and Online KSI resources.
- Duolingo 2025 language report as a commercial learner-interest signal.

`069` used Gyeongju travel and heritage context from:

- Gyeongju official tourism pages.
- VISITKOREA Korean cultural heritage and Gyeongju Historic Areas.
- VISITKOREA Bulguksa/Seokguram and newer Gyeongju trend coverage.

## Internal Links Added

New or strengthened reverse links were added from:

- Blog `070` -> `/blog/067`
- Blog `085` -> `/blog/067` and `/blog/068`
- Blog `026` -> `/blog/068`
- Blog `084` -> `/blog/069`
- Blog `064` -> `/blog/069`

Existing reverse link:

- Blog `030` already linked to `/blog/067`.

## Automated Checks

- `node .claude/skills/reviewer/scripts/review-post.mjs --draft content/blog/067-that-movie-drama-was-made-from-a-korean-webtoon.md`
  - Passed, 100/100, 1,872 words, 12 H2, 3 images, 6 FAQ Q&A.
- `node .claude/skills/reviewer/scripts/review-post.mjs --draft content/blog/068-uncover-the-truth-about-learning-korean-challenges-and-tips-for-beginners.md`
  - Passed, 100/100, 1,801 words, 12 H2, 3 images, 6 FAQ Q&A.
- `node .claude/skills/reviewer/scripts/review-post.mjs --draft content/blog/069-not-seoul-but-gyeongju-a-cultural-journey.md`
  - Passed, 100/100, 1,807 words, 13 H2, 3 images, 6 FAQ Q&A.
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
- High-priority posts: 14
- Low internal linking: 49
- Thin content: 48
- Missing FAQ: 42
- Stale posts: 41

After this batch:

- Average SEO/AEO score: 91/100
- High-priority posts: 11
- Low internal linking: 46
- Thin content: 45
- Missing FAQ: 39
- Stale posts: 38

## Public QA

Verified after deployment was Ready:

- `https://www.epickor.com/blog/067` returned HTTP 200 with expected title/CTA/FAQ markers.
- `https://www.epickor.com/blog/068` returned HTTP 200 with expected title/source markers.
- `https://www.epickor.com/blog/069` returned HTTP 200 with expected title/topic markers.
- `https://www.epickor.com/sitemap.xml` returned HTTP 200 and included `/blog/067`, `/blog/068`, and `/blog/069`.
- Six newly committed decoded image assets returned HTTP 200.
- Reverse-link source pages returned HTTP 200 and contained the expected links:
  - `/blog/070` contained `/blog/067`.
  - `/blog/085` contained `/blog/067` and `/blog/068`.
  - `/blog/026` contained `/blog/068`.
  - `/blog/084` contained `/blog/069`.
  - `/blog/064` contained `/blog/069`.

## Notes

- The reviewer decodes percent-encoded image URLs before checking local files, so decoded image copies were committed for the six used legacy Korean-filename assets.
- During cleanup, a temporary encoding mismatch on Korean filename paths was corrected by using percent-encoded URLs in markdown plus decoded local asset copies for reviewer/static/public resolution.
- The unrelated untracked file `reports/business-gsc-affiliate-check-2026-07-17.md` was preserved and not committed.
- The next rewrite queue now starts at `072/078/080`, followed by `087/088/003`, then `013/063/073` depending on strategy fit and operational risk.
