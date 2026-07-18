# Blogs 072/078/080 Rewrite and Deployment QA - 2026-07-18

## Summary

Rewrote and published the next high-priority legacy content-debt batch:

- Blog `072`: Korean intensity culture, covering food contrast, ppalli-ppalli speed, work pressure, sports discipline, and balance.
- Blog `078`: Korea theme parks guide comparing Everland, Lotte World, and Korean Folk Village by weather, transit, family fit, and trip style.
- Blog `080`: Korean proverbs guide explaining kimchi soup, tiger, lamp, needle-thief, and speech-reciprocity sayings in cultural context.

Implementation commit: `cf342a09` (`Rewrite intensity theme parks and proverbs posts`)

Production deployment:

- Deployment URL: `https://epickor-blog-cqhn8btab-yhs-projects-5de403d3.vercel.app`
- Vercel deployment ID: `dpl_7SZtKFTraFao354v9EbAgJi2XLuw`
- Status: Ready
- Aliases verified: `https://www.epickor.com`, `https://epickor.com`, `https://epickor-blog.vercel.app`

## Content Improvements

Each rewritten post now includes:

- Updated `date`, SEO title, description, tags, and `ogImage`.
- 1,800+ review-counted words.
- 12-14 H2 sections.
- Two real HTML tables wrapped in `table-scroll`.
- Three article images.
- Two disclosed Amazon affiliate CTA boxes with sponsored/nofollow attributes.
- Six FAQ Q&A pairs.
- Internal links to related EpicKor posts.
- External source links using official or reliable references.

## Source Framing Used

`072` used Korean intensity / speed / food / work context from:

- World Bank Republic of Korea overview.
- OECD Employment Outlook 2026 Korea country note.
- OECD Korea work/family balance analysis.
- Korea.net kimchi soup and naengmyeon food-culture materials.
- VISITKOREA cold buckwheat noodle context.

`078` used theme-park visitor-planning context from:

- Everland official operating-hours and attraction-status page.
- Lotte World Adventure official English site and Magic Pass page.
- Visit Seoul Lotte World Adventure guide.
- VISITKOREA Korean Folk Village guide.
- Korean Folk Village official English site.

`080` used proverb and language context from:

- National Institute of Korean Language learner resources.
- Korean Learners' Dictionary entries for tiger and speech-reciprocity proverbs.
- Korea.net kimchi soup / kimchi culture context.

## Internal Links Added

New or strengthened reverse links were added from:

- Blog `056` -> `/blog/072`
- Blog `066` -> `/blog/078`
- Blog `026` -> `/blog/078`
- Blog `068` -> `/blog/080`

Existing reverse link:

- Blog `035` already linked to `/blog/080`.

## Automated Checks

- `node .claude/skills/reviewer/scripts/review-post.mjs --draft content/blog/072-korea-a-country-of-unconditional-extremes.md`
  - Passed, 100/100, 1,861 words, 12 H2, 3 images, 6 FAQ Q&A.
- `node .claude/skills/reviewer/scripts/review-post.mjs --draft content/blog/078-koreas-top-theme-parks-everland-lotte-world-and-the-hidden-gem.md`
  - Passed, 100/100, 1,832 words, 14 H2, 3 images, 6 FAQ Q&A.
- `node .claude/skills/reviewer/scripts/review-post.mjs --draft content/blog/080-dont-drink-kimchi-soup-before-its-ready-top-5-korean-proverbs-with-life-lessons.md`
  - Passed, 100/100, 1,851 words, 13 H2, 3 images, 6 FAQ Q&A.
- `npm.cmd run audit:seo-aeo`
  - Passed and regenerated `reports/seo-aeo-audit.md`.
- `npm.cmd run audit:amazon-links`
  - Passed: 625 tagged amazon.com URLs, 264 amzn.to URLs.
- `git diff --check`
  - Passed; only normal Windows LF/CRLF warnings.
- `npm.cmd run build`
  - Passed; generated 359 static pages.

## SEO/AEO Movement

Before this batch:

- Average SEO/AEO score: 91/100
- High-priority posts: 11
- Low internal linking: 46
- Thin content: 45
- Missing FAQ: 39
- Stale posts: 38

After this batch:

- Average SEO/AEO score: 92/100
- High-priority posts: 8
- Low internal linking: 43
- Thin content: 42
- Missing FAQ: 36
- Stale posts: 37

## Public QA

Verified after deployment was Ready:

- `https://www.epickor.com/blog/072` returned HTTP 200 with expected title/CTA/FAQ markers.
- `https://www.epickor.com/blog/078` returned HTTP 200 with expected title/topic markers.
- `https://www.epickor.com/blog/080` returned HTTP 200 with expected title/topic markers.
- `https://www.epickor.com/sitemap.xml` returned HTTP 200 and included `/blog/072`, `/blog/078`, and `/blog/080`.
- Six newly committed decoded image assets returned HTTP 200.
- Reverse-link source pages returned HTTP 200 and contained the expected links:
  - `/blog/056` contained `/blog/072`.
  - `/blog/066` contained `/blog/078`.
  - `/blog/026` contained `/blog/078`.
  - `/blog/068` contained `/blog/080`.
  - `/blog/035` contained `/blog/080`.

## Notes

- The reviewer decodes percent-encoded image URLs before checking local files, so decoded image copies were committed for the six used legacy Korean-filename assets.
- Unused decoded copies generated during preparation were removed before commit.
- The unrelated untracked file `reports/business-gsc-affiliate-check-2026-07-17.md` was preserved and not committed.
- The next rewrite queue now starts at `087/088/003`, followed by `013/063/073`, then `081/091/052` depending on strategy fit and operational risk.
