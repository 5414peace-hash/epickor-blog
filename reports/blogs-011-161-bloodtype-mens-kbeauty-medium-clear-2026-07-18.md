# Blogs 011/161 Blood Type and Men's K-Beauty Medium-Clear QA - 2026-07-18

## Scope

- Rewrote public Blog `011` into a 1,902-word sourced guide explaining Korean blood type personality as pop-culture small talk, not science, with MBTI context, dating etiquette, stereotypes, and current visitor framing.
- Reworked private Blog `161` while preserving `visibility: "private"`; it is now a 1,875-word structured draft on K-beauty for men, simple skincare, shaving irritation, sunscreen, beard care, and overbuying avoidance.
- Added reverse link from Blog `139` -> Blog `011`.

## Editorial Upgrades

- Blog `011` now has updated metadata including `ogImage`, two HTML tables, three images, two disclosed Amazon CTAs, internal links, six reviewer-detected FAQs, and source links.
- Blog `161` now has a valid description, shorter title, internal links, three SVG images, two disclosed Amazon CTAs, two HTML tables, six reviewer-detected FAQs, and source links while remaining private.
- Added five lightweight EpicKor SVGs:
  - `public/assets/images/posts/011/korean-blood-type-mbti-map.svg`
  - `public/assets/images/posts/011/korean-blood-type-fact-check.svg`
  - `public/assets/images/posts/161/k-beauty-men-routine-map.svg`
  - `public/assets/images/posts/161/k-beauty-men-four-step-checklist.svg`
  - `public/assets/images/posts/161/k-beauty-men-skip-first.svg`

## Fact / Risk Handling

- Blog `011`: avoided treating blood type as scientific; cited large-scale and Big Five research showing no useful personality relationship, plus Korean media context on the shift from blood type to MBTI.
- Blog `161`: avoided medical overclaiming and product-specific unsupported claims; used AAD and Cleveland Clinic guidance for cleanser, shaving, moisturizer, sunscreen, and razor-burn basics.
- Blog `161` remains private and was not publicly promoted or linked from public posts.

## Validation

- Blog `011`: reviewer passed, SEO 100/100, 1,902 words, 9 H2, 3 images, 6 FAQ.
- Blog `161`: reviewer passed, SEO 100/100, 1,875 words, 11 H2, 3 images, 6 FAQ.
- Touched source Blog `139`: reviewer passed, SEO 100/100.
- `git diff --check`: passed; Windows LF/CRLF warnings only.
- `npm.cmd run audit:seo-aeo`: passed, average 97/100.
  - Critical: 0.
  - High: 0.
  - Medium: 0.
- `npm.cmd run audit:amazon-links`: passed, 665 tagged `amazon.com` URLs and 238 `amzn.to` URLs.
- `npm.cmd run build`: passed, Next.js production build generated 363 pages.

## Deployment / Public QA

- Implementation commit: `9f4c1464` (`Resolve remaining medium SEO audit posts`)
- Pushed to `origin/master`.
- Vercel deployment: `dpl_9cRUGiWokSbYCDwJgYN6bJGENusf`
- Deployment URL: `https://epickor-blog-28yjul9rs-yhs-projects-5de403d3.vercel.app`
- Status: Ready and aliased to `www.epickor.com`.
- Public QA passed:
  - `/blog/011` returned HTTP 200 and included the expected rewritten title.
  - `/blog/139` returned HTTP 200 and included the `/blog/011` reverse link.
  - New Blog `011` SVG asset returned HTTP 200 and contained SVG markup.

## Remaining Notes

- The unrelated untracked file `reports/business-gsc-affiliate-check-2026-07-17.md` was preserved and excluded from this work.
- The SEO/AEO audit now has no critical, high, or medium-priority posts. Remaining content debt is primarily low-priority title-length/internal-link/stale cleanup.
