# Blogs 002-025 Content-Debt Rewrite and Link Pass Review

Date: 2026-07-18 KST

## Scope

Full rewrite:

- Blog `002` - Korean soft power icons
- Blog `006` - Bicycle theft in Korea
- Blog `023` - Gangnam plastic surgery / medical tourism
- Blog `024` - Korean work culture
- Blog `025` - Kim Go-eun

Capped internal-link pass:

- Source pages: `005`, `019`, `021`, `022`, `027`, `028`, `029`, `032`, `034`, `040`, `048`, `058`
- Main destinations: `002`, `006`, `023`, `024`, `025`, plus strong recent or rebuilt pages including `026`, `050`, `053`, `059`, `127`, `138`, `190`, `218`, `219`, `270`, `291`, `292`, `293`, `299`, `302`, `303`, and the Samyang business deep dive.

## Editorial Result

The five full rewrites replaced thin or trust-risk pages with current, sourced, reader-first guides:

| Slug | New Focus | Word Count | H2 | Images | Tables | FAQ | Automated Review |
|---|---|---:|---:|---:|---:|---:|---:|
| 002 | Soft power icons without mojibake or cultural-hegemony overclaiming | 2,411 | 12 | 3 | 2 | 6 | 100/100 |
| 006 | Practical Seoul cycling and bicycle-theft prevention, removing unsafe absolute claims | 2,329 | 12 | 3 | 2 | 6 | 100/100 |
| 023 | Medical-tourism safety checklist, registered institutions, broker risk, recovery planning | 1,848 | 12 | 3 | 2 | 6 | 100/100 |
| 024 | Current work culture, 52-hour framework, hoesik, alcohol risk, and work-life balance | 2,109 | 12 | 3 | 2 | 6 | 100/100 |
| 025 | Kim Go-eun career guide centered on film/drama work and Exhuma box-office context | 2,030 | 12 | 3 | 2 | 6 | 100/100 |

## Source Control and Trust Notes

- `002` uses official MCST/Korea.net/KOFIC/LAFC source links for Hallyu, BTS envoy context, national image, Bong Joon-ho/Parasite, and Son's current club context.
- `006` uses Seoul Metropolitan Government/TOPIS/Korea.kr/National Police source links for public bike rules, bicycle safety, and reporting/statistics context.
- `023` uses Medical Korea and Gangnam Medical Tour source links for foreign-patient registration, malpractice-insurance framing, partner organization criteria, and illegal broker reporting.
- `024` uses MOEL and OECD source links for the working-hour framework, hours-worked context, and harmful alcohol-use framing.
- `025` uses KOFIC/KOBIZ source links for Kim Go-eun, Exhuma, and box-office context.

## Monetization and Link Result

- Each full rewrite includes two slim affiliate CTA placements with clear first-disclosure language.
- Amazon link audit passed after the edits: 602 tagged `amazon.com` URLs and 286 `amzn.to` URLs; every direct Amazon URL uses exactly one approved tracking tag.
- The internal-link pass added one "Related EpicKor Guides" section to 12 older low-link pages. This reduced sitewide low-internal-linking issues from 98 to 81.

## SEO/AEO Result

After `npm.cmd run audit:seo-aeo`:

- Average SEO/AEO score: 86 -> 87
- High-priority posts: 61 -> 44
- Low-internal-linking issues: 98 -> 81
- Thin-content issues: 81 -> 78
- Missing FAQ issues: 77 -> 72
- Stale posts: 75 -> 70
- New top rewrite queue starts at `037/042/044/046/047/...`; `002/006/023/024/025` are no longer in the top queue.

## Build and Render Checks

Validation completed:

- `node .claude/skills/reviewer/scripts/review-post.mjs --draft ...` passed 100/100 for all five rewritten posts.
- `npm.cmd run audit:amazon-links` passed.
- `npm.cmd run audit:seo-aeo` regenerated `reports/seo-aeo-audit.md`.
- `npm.cmd run build` passed: 359 static pages generated successfully.
- Built HTML spot-check confirmed the five rewritten routes contain rendered table wrappers, affiliate CTA markup, article images, FAQ markup, and the expected new titles.
- Built HTML spot-check confirmed the internal-link pass renders `Related EpicKor Guides` sections in the affected older pages.

## Deployment QA

Implementation commit:

- `578803b6` - `Rewrite next legacy content debt batch`

Production deployment:

- Vercel deployment: `dpl_5xYLXFWwJis3WMeSGTKJ6JTELKHf`
- Deployment URL: `https://epickor-blog-8sg310uj5-yhs-projects-5de403d3.vercel.app`
- Aliases confirmed by `vercel inspect`: `https://www.epickor.com`, `https://epickor.com`, `https://epickor-blog.vercel.app`, and Git/master aliases.

Public checks on `https://www.epickor.com`:

| Check | Result |
|---|---|
| `/blog/002` | HTTP 200, expected title, table markup, affiliate CTA markup |
| `/blog/006` | HTTP 200, expected title, table markup, affiliate CTA markup |
| `/blog/023` | HTTP 200, expected title, table markup, affiliate CTA markup |
| `/blog/024` | HTTP 200, expected title, table markup, affiliate CTA markup |
| `/blog/025` | HTTP 200, expected title, table markup, affiliate CTA markup |
| `/sitemap.xml` | Contains `/blog/002`, `/blog/006`, `/blog/023`, `/blog/024`, and `/blog/025` |
| Representative internal-link source pages | `/blog/005`, `/027`, `/028`, `/029`, `/040`, `/048`, `/058` returned HTTP 200 and contained `Related EpicKor Guides` |

Note: a manual `npx.cmd vercel --prod --yes` upload attempt hit Vercel's free upload API limit (`api-upload-free`). This did not block the release because the GitHub-connected production deployment was created from the pushed commit and reached Ready with the production aliases.

## Monitoring Link

The previous 16-post legacy cluster should still be monitored separately. Baseline and check windows are recorded in:

`reports/legacy-cluster-monitoring-baseline-2026-07-18.md`

Google Search Console data should be compared no earlier than the 2026-07-21 to 2026-07-22 KST window because performance data is delayed.
