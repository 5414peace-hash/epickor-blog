# Blogs 306/307 and Business Medical Device Guide - Publish Review

Date: 2026-07-18

## Scope

- Added Blog `306`: `K-pop Idol Training in Seoul 2026: Tourist Class Guide`
- Added Blog `307`: `Seoul Kids Cafe Guide 2026: Public Play Spaces`
- Added Business post: `Korean Medical Device Suppliers 2026: Buyer Due Diligence Guide`
- Updated `content/data/topics-queue.json`:
  - Queue ID `25` marked done as Blog `306`
  - New queue ID `128` added and marked done as Blog `307`
  - `next_slug` advanced to `308`

## Content Structure

| Post | Words | Images | Tables | Affiliate CTAs | FAQs |
|---|---:|---:|---:|---:|---:|
| Blog 306 | 2,801 | 3 | 2 | 2 | 6 |
| Blog 307 | 2,579 | 3 | 2 | 2 | 6 |
| Business medical device guide | 2,663 | 3 | 2 | 2 | 6 |

## Image Fit Review

- Blog `306` uses real raster images for Seoul K-pop/Hallyu street context and dance-practice/instruction context. Captions explicitly avoid claiming that generic studio images are specific Seoul K-pop academies.
- Blog `307` uses real raster images for kids-cafe-style indoor play, ball-pit/soft-play context, and Seoul family outdoor context. Captions avoid claiming that Pexels images are specific Seoul public facilities.
- The business post uses real raster images for dental implant instruments and ultrasound medical equipment. Captions avoid implying a specific Korean supplier or product endorsement.
- Source records were added under each image folder:
  - `public/assets/images/posts/306/image-sources.md`
  - `public/assets/images/posts/307/image-sources.md`
  - `public/assets/images/business/korean-medical-device-suppliers/image-sources.md`

## Validation

- `npm.cmd run audit:image-refs`: PASS
  - Referenced local images: `1189`
  - Missing: `0`
  - SVG references: `0`
  - Over 400 KB: `0`
- `npm.cmd run audit:amazon-links`: PASS
  - Direct Amazon URLs use approved tracking tags.
- `npm.cmd run audit:seo-aeo`: PASS
  - Average score: `100/100`
- `git diff --check`: PASS
  - CRLF warnings only for generated/touched text files.
- `npm.cmd run build`: PASS
  - Static pages generated: `366/366`
- Build-output HTML checks passed:
  - `/blog/306` includes title, hero image, `table-scroll`, and `affiliate-inline-cta`
  - `/blog/307` includes title, hero image, `table-scroll`, and `affiliate-inline-cta`
  - `/business/korean-medical-device-suppliers` includes title, hero image, `table-scroll`, and `affiliate-inline-cta`
  - Sitemap output includes all three new URLs.

## Operational Notes

- A broad `npm.cmd run optimize:images` pass began touching unrelated legacy PNG files. It was stopped and all accidental image changes under old post folders were reverted. The final worktree only keeps the new article files/images, queue update, audit report, and this publish review.
- Existing unrelated untracked `reports/business-gsc-affiliate-check-2026-07-17.md` remains preserved and excluded from this scope.

## Deployment Status

- Commit: `67bc367d` (`Publish blogs 306 307 and medical device guide`)
- Pushed to `origin/master`.
- Vercel production deployment: `https://epickor-blog-8g10ldoyb-yhs-projects-5de403d3.vercel.app`
- Deployment status: Ready.
- First direct deploy attempt failed because Vercel rejected more than 15,000 uploaded files. The same commit was redeployed successfully with `--archive=tgz`.
- Public `www.epickor.com` QA passed:
  - `https://www.epickor.com/blog/306`: HTTP `200`, title/image/affiliate markers present.
  - `https://www.epickor.com/blog/307`: HTTP `200`, title/image/affiliate markers present.
  - `https://www.epickor.com/business/korean-medical-device-suppliers`: HTTP `200`, title/image/affiliate markers present.
  - `https://www.epickor.com/sitemap.xml`: HTTP `200`, new blog and business URLs present.
