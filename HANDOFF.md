# HANDOFF - EpicKor Current Operations

> Fast-start dashboard only. Historical detail through 2026-07-11 is in `docs/handoff/HANDOFF_ARCHIVE_THROUGH_2026-07-11.md`.

## Start Here

1. Read this file.
2. Run `git status --short` and `git log -8 --oneline`.
3. Preserve unrelated dirty files.
4. Read only files named under Active Work or the user request.
5. Search the archive narrowly with `rg` only for a specific slug, decision, or incident.

## Current Snapshot - 2026-07-12

- Latest normal posts: Blogs `291`-`293` — K-pop Photocard, Korean Coin Noraebang, and Seoul Bookstore/Library guides.
- Public URLs: `https://www.epickor.com/blog/291`, `/292`, and `/293`; all verified HTTP 200 with the expected title.
- Blogs 291-293 contain 2,233-2,360 review-counted words, four images, two HTML tables, two affiliate CTAs, and six FAQs each.
- Automated SEO review: 100/100 for all three.
- Full production build: 342 static pages generated successfully.
- Local rendered QA: all 12 article images loaded with nonzero dimensions; all six tables and six affiliate CTAs rendered; no page-level horizontal overflow.
- Image package: official KTO/Seoul sources, one Pexels Starfield image, and six generated illustrative images with real artists/brands excluded. Generated PNGs were optimized to 156-225 KB JPEGs.
- Three reverse links were added from Blogs 193, 170, and 251.
- Production commit `933c9019` is on `origin/master`; Vercel deployment `epickor-blog-3qmmu5fiw` is Ready and aliased to `www.epickor.com`.
- Public QA verified 12/12 image assets HTTP 200, all three sitemap entries, and reverse links from Blogs 193, 170, and 251.
- Sitewide thumbnail outage diagnosed on 2026-07-12: original assets returned HTTP 200, while Vercel `/_next/image` returned HTTP 402 `OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED` after the image-transformation quota was exhausted.
- `next.config.ts` now sets `images.unoptimized: true`, so all `next/image` surfaces use direct source URLs instead of the failing optimizer. Production deployment `epickor-blog-4otrp4yvf` is Ready and aliased to `www.epickor.com`; public mobile checks confirmed the Blog 291 hero and the first two Latest thumbnails loaded at nonzero natural dimensions from direct asset URLs.
- Latest Business post remains the COSMAX B-2 deep dive.
- Card-news batches `081/288/290` and `036/170/287` remain representative-confirmed and ready for scheduling.
- Existing unrelated dirty files remain: `reports/seo-aeo-audit.md`, `design-qa.md`, and `docs/issues-post-playbook.md`.

## Active Work

- Status: none.
- Blogs 291-293 research, writing, review, image package, build, deployment, and public verification are 100% complete.
- Thumbnail hotfix deployment and public rendered verification are complete.
- Review record: `reports/blogs-291-293-review-2026-07-12.md`.

## Blockers / Decisions Needed

- No content or technical blocker.
- Do not begin Reels/card news until public deployment and URL verification are complete.
- Social reuse still requires representative selection and the 3-Reel/3-carousel batch rhythm.

## Next Recommended Work

1. Schedule card news 081/288/290 on the next Tuesday/Wednesday/Thursday slots. Impact: activates the confirmed revival batch. Dependency: representative scheduling.
2. Protect enough newly published Reels inventory for the Friday/Saturday/Sunday rhythm; consider 291 and 292 only as a representative-selected future social batch. Impact: strong visual hooks without displacing the current backlog. Dependency: representative selection and the new-post-only Reels rule.
3. Hold Blogs 291-293 unchanged while GSC/GA4 data accumulates. Impact: preserves a clean baseline for affiliate-heavy, social-heavy, and evergreen intent. Dependency: 7-14 days of crawl and event volume.

## Standard Blog Guardrails

- Freeze scope before drafting; target 2,200-2,800 words when intent warrants it.
- Use official/current sources for operational facts and label variable prices/hours.
- Every new or meaningfully updated post gets two slim affiliate CTAs unless explicitly omitted.
- Add real HTML tables for comparisons and inspect rendered table wrappers.
- After review/private-preview actions, fetch origin and inspect divergence before publication.
- Verify local build/render, public pages, all local assets, sitemap, and reverse links once each unless a failure appears.

## Recent Change

- 2026-07-12: Diagnosed the sitewide broken-thumbnail incident as Vercel image optimizer quota exhaustion (direct asset 200 vs optimized request 402), deployed the global direct-image bypass, and verified Blog 291 plus Latest thumbnails on the public mobile layout.
- 2026-07-12: Published and publicly verified Blogs 291-293; production deployment Ready, three pages and 12 assets HTTP 200, sitemap entries and three reverse links confirmed.
- 2026-07-12: Replaced six generated 2.1-2.5 MB PNGs with visually equivalent 156-225 KB JPEGs before deployment.
- 2026-07-12: Publisher review created three remote private-preview commits; local public final was merged without losing unrelated work.
- 2026-07-12: Public browser QA fixed Vercel image-optimizer quota failures on card-news surfaces with direct static images.
- 2026-07-12: Representative confirmed the second Seoul After Dark batch 036/170/287.
- 2026-07-12: Representative confirmed the first Seoul After Dark batch 081/288/290 and approved the reusable style.
- 2026-07-11: Published and publicly verified Blogs 288-290.

## Agents / Roles Involved

- Strategy/Research role: confirmed semantic separation from 290 existing posts; verified KTO, Visit Seoul, Seoul Metropolitan Government, Kyobo/Youngpoong, and Starfield facts.
- Writer role: produced three 2,200-2,400-word practical guides with comparison tables, FAQs, internal links, and two CTAs each.
- Image role: sourced six official/Pexels images, generated six copyright-safe illustrative images, rejected one irrelevant doll image, and optimized generated files.
- Reviewer role: completed SEO 100 reviews, fact framing, affiliate/link checks, hash-duplicate check, 342-route build, rendered image/table/CTA checks, and overflow checks.
- Publisher role: synchronized remote private previews with local public finals and prepared the scoped deployment commits.
- Engineering/Reviewer role: reproduced the optimizer 402, confirmed source assets remained healthy, implemented the global bypass, and verified the generated Blog 291 HTML uses the direct hero asset URL.

## Maintenance Contract

- Keep this file under 250 lines and focused on current state.
- Update the existing sections instead of stacking transcripts.
- Correct this dashboard whenever newer git/file evidence conflicts with it.
- Session close also requires updating `D:\dev\HANDOFF.md` with the COO summary.

## Completion Note - 2026-07-17 Blogs 303-305 + APR

- Blogs `303`-`305` and Business B-2 `apr-medicube-global-beauty-tech-deep-dive` are published and publicly verified. Commit `56d36927` is on `origin/master`; Vercel deployment `dpl_8NsReFHG6pNbB5BTk234RYcgUKxm` is Ready and aliased to `www.epickor.com`.
- Automated review is 100/100 for all four. They contain 18 used article visuals, 9 HTML tables, 8 disclosed affiliate CTAs, and 24 FAQs. Official/cultural/company source records are stored with each image package.
- Public QA passed four pages, 18/18 used assets, four sitemap entries, and six reverse links. Exact 390px DevTools QA confirmed document width 390 with all article images decoded, correct table/CTA counts, clean title wrapping, and only intended table-local overflow.
- Detailed review: `reports/blogs-303-305-apr-review-2026-07-17.md`. Next general slug is `306`; next business topic ID is `14`. Do not start related Reels or card news unless the representative selects them under the current batch rules.
