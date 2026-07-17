# Blogs 132-151 Legacy Thin-Post Rewrite Review

Date: 2026-07-17  
Scope: Blogs `132`, `135`, `138`, `141`, `142`, `143`, and `151`

## Outcome

Seven legacy posts in the 130-160 content-debt range were rewritten from roughly 340-450-word thin pages into current EpicKor guide format. Each post now has a current 2026 framing, practical H2 structure, two reader-facing HTML tables, six FAQs, useful internal links, two disclosed Amazon affiliate CTAs, and a fresh topic-fit image package with source records.

## Article QA

| Blog | Review words | H2 | Tables | FAQs | Used images | Affiliate CTAs | Reviewer |
|---|---:|---:|---:|---:|---:|---:|---:|
| 132 | 2,022 | 9 | 2 | 6 | 4 | 2 | 100/100 |
| 135 | 1,940 | 9 | 2 | 6 | 4 | 2 | 100/100 |
| 138 | 2,045 | 9 | 2 | 6 | 4 | 2 | 100/100 |
| 141 | 1,917 | 9 | 2 | 6 | 4 | 2 | 100/100 |
| 142 | 1,927 | 9 | 2 | 6 | 3 | 2 | 100/100 |
| 143 | 2,009 | 10 | 2 | 6 | 4 | 2 | 100/100 |
| 151 | 1,978 | 10 | 2 | 6 | 5 | 2 | 100/100 |

## Research And Corrections

- Blog 132 was updated around the current clubs of Son Heung-min, Kim Min-jae, and Lee Kang-in using KFA and official club sources.
- Blog 135 separates the modern surname system from older clan and royal-lineage history, using Statistics Korea, the National Institute of Korean History, and the Constitutional Court.
- Blog 138 now directs lost-property reports to Police Civil Service 24. The old LOST112 service moved there on 2026-01-26, so the legacy instruction was removed.
- Blog 141 avoids inventing a citywide group-running ban and instead explains actual Han River route, courtesy, and safety decisions with Seoul sources.
- Blog 142 uses the current Military Manpower Administration service lengths and records that all seven BTS members completed required service by June 2025.
- Blogs 143 and 151 use current VISITKOREA, Visit Seoul, and Templestay guidance for salon planning and Seoul temple etiquette.

## Image Review

- Replaced all legacy Reels-frame image references with 28 optimized Pexels/Wikimedia assets.
- Added one `image-sources.md` record per post.
- Hash comparison across `public/assets/images/posts` found no duplicate content for the 28 new files.
- Manual contact-sheet inspection confirmed topic and Korea-context fit for all used assets. Blog 143 intentionally uses culturally neutral salon-process close-ups where a verified Korean salon interior was not available; no misleading foreign signage is visible.
- `npm run audit:image-sizes` passed with no target image above the 1.2 MB failure threshold. Existing sitewide >400 KB warnings remain legacy warn-only items.

## Automated And Rendered Gates

- `.claude/skills/reviewer/scripts/review-post.mjs --dry-run`: 100/100 for all seven posts.
- `npm run audit:seo-aeo`: passed; sitewide average is now 82/100, with 0 critical and 87 high-priority posts.
- `npm run audit:amazon-links`: passed.
- `npm run audit:image-sizes`: passed.
- `npm run build`: passed; 359/359 static pages generated.
- Local HTTP render checks: all seven `/blog/{slug}` routes returned 200, with two rendered tables, affiliate CTA markup, and the expected new image references.
- Full browser layout inspection could not be run because neither the in-app browser nor connected Chrome exposed an available browser session. Source images were inspected directly, and local rendered structure plus the production build were used as the available gates; no claim of browser-based responsive visual approval is made.

## Deployment And Public QA

To be recorded after the production deployment and public URL verification.
