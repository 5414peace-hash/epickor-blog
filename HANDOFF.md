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
- Intended public URLs: `https://www.epickor.com/blog/291`, `/292`, and `/293`.
- Blogs 291-293 contain 2,233-2,360 review-counted words, four images, two HTML tables, two affiliate CTAs, and six FAQs each.
- Automated SEO review: 100/100 for all three.
- Full production build: 342 static pages generated successfully.
- Local rendered QA: all 12 article images loaded with nonzero dimensions; all six tables and six affiliate CTAs rendered; no page-level horizontal overflow.
- Image package: official KTO/Seoul sources, one Pexels Starfield image, and six generated illustrative images with real artists/brands excluded. Generated PNGs were optimized to 156-225 KB JPEGs.
- Three reverse links were added from Blogs 193, 170, and 251.
- Local publication commit `3f715104` was merged with remote private-preview commits in `0d31334c`; final optimization/review/Handoff commit remains before push.
- Latest Business post remains the COSMAX B-2 deep dive.
- Card-news batches `081/288/290` and `036/170/287` remain representative-confirmed and ready for scheduling.
- Existing unrelated dirty files remain: `reports/seo-aeo-audit.md`, `design-qa.md`, and `docs/issues-post-playbook.md`.

## Active Work

- Blogs 291-293 are written, reviewed, built, and locally rendered.
- Remaining: commit optimization/review/Handoff, fetch/divergence check, push master, monitor Vercel, and verify three public pages/assets/sitemap.
- Review record: `reports/blogs-291-293-review-2026-07-12.md`.

## Blockers / Decisions Needed

- No content or technical blocker.
- Do not begin Reels/card news until public deployment and URL verification are complete.
- Social reuse still requires representative selection and the 3-Reel/3-carousel batch rhythm.

## Next Recommended Work

1. Complete and verify the Blogs 291-293 deployment. Impact: adds one affiliate-heavy, one social-heavy, and one evergreen search asset. Dependency: Vercel deployment.
2. Schedule card news 081/288/290 on the next Tuesday/Wednesday/Thursday slots. Impact: activates the confirmed revival batch. Dependency: representative scheduling.
3. After deployment, evaluate 291-293 for a future three-asset social batch, prioritizing 291 and 292. Impact: strong visual hooks and clear funnel potential. Dependency: representative selection and current Reels inventory.

## Standard Blog Guardrails

- Freeze scope before drafting; target 2,200-2,800 words when intent warrants it.
- Use official/current sources for operational facts and label variable prices/hours.
- Every new or meaningfully updated post gets two slim affiliate CTAs unless explicitly omitted.
- Add real HTML tables for comparisons and inspect rendered table wrappers.
- After review/private-preview actions, fetch origin and inspect divergence before publication.
- Verify local build/render, public pages, all local assets, sitemap, and reverse links once each unless a failure appears.

## Recent Change

- 2026-07-12: Completed research, writing, SEO review, 12-image package, affiliate placement, reverse links, 342-page build, and local render QA for Blogs 291-293.
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

## Maintenance Contract

- Keep this file under 250 lines and focused on current state.
- Update the existing sections instead of stacking transcripts.
- Correct this dashboard whenever newer git/file evidence conflicts with it.
- Session close also requires updating `D:\dev\HANDOFF.md` with the COO summary.
