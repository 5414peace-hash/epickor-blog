# Blogs 001-131 Weak-Content Rewrite Review

Date: 2026-07-17  
Scope: Blogs `001`, `026`, `039`, `075`, `076`, `077`, `015`, `053`, `007`, `051`, `124`, `127`, `129`, `130`, `131`, and `125`

## Outcome

The sixteen highest-priority weak posts selected for this batch were rebuilt as current, practical EpicKor guides. All sixteen now have focused search titles and descriptions, direct-answer openings, substantial section depth, two reader-facing HTML tables, six FAQ answers, contextual internal links, four selected images, and documented sources. Fourteen posts have two disclosed Amazon CTAs; Blogs 076 and 077 intentionally have none because their active political, criminal, and institutional disputes make product promotion editorially inappropriate.

## Article QA

| Blog | Review words | H2 | Tables | FAQs | Used images | Affiliate CTAs | Reviewer |
|---|---:|---:|---:|---:|---:|---:|---:|
| 001 | 2,228 | 12 | 2 | 6 | 4 | 2 | 100/100 |
| 026 | 2,216 | 13 | 2 | 6 | 4 | 2 | 100/100 |
| 039 | 2,233 | 14 | 2 | 6 | 4 | 2 | 100/100 |
| 075 | 2,204 | 12 | 2 | 6 | 4 | 2 | 100/100 |
| 076 | 2,229 | 12 | 2 | 6 | 4 | 0 | 100/100 |
| 077 | 2,220 | 12 | 2 | 6 | 4 | 0 | 100/100 |
| 015 | 2,148 | 12 | 2 | 6 | 4 | 2 | 100/100 |
| 053 | 2,186 | 12 | 2 | 6 | 4 | 2 | 100/100 |
| 007 | 2,197 | 12 | 2 | 6 | 4 | 2 | 100/100 |
| 051 | 1,900 | 12 | 2 | 6 | 4 | 2 | 100/100 |
| 124 | 2,343 | 14 | 2 | 6 | 4 | 2 | 100/100 |
| 127 | 2,056 | 12 | 2 | 6 | 4 | 2 | 100/100 |
| 129 | 1,985 | 11 | 2 | 6 | 4 | 2 | 100/100 |
| 130 | 2,187 | 12 | 2 | 6 | 4 | 2 | 100/100 |
| 131 | 2,130 | 12 | 2 | 6 | 4 | 2 | 100/100 |
| 125 | 2,201 | 12 | 2 | 6 | 4 | 2 | 100/100 |

## High-Risk Fact And Framing Corrections

- Blog 001 replaces nationality-based dating formulas with consent, communication, safety, and individual variation; Statistics Korea and the Ministry of Gender Equality and Family support the current context and help resources.
- Blog 026 now reflects the 2026 K-ETA temporary exemption, e-Arrival Card, Incheon Airport transfers, transit cards, navigation, payments, and emergency help.
- Blog 039 replaces a misleading ranked-jobs list with current sector, qualification, contract, visa, and foreign-applicant guidance using MOEL, KOSIS, Employment24, and Hi Korea.
- Blog 075 explains Korea's archery system without genetic or national-character myths and distinguishes historical Olympic results from current selection and training structures.
- Blog 076 separates the December 2024 martial-law sequence, Assembly action, impeachment judgment, criminal cases, and appeals instead of collapsing them into one outcome.
- Blog 077 clearly distinguishes a proposed 2029 coeducation direction, follow-up governance, indictments, allegations, and university damage estimates; it does not describe pending defendants as convicted.
- Blog 015 uses imported-car registration and market evidence rather than status stereotypes to explain Mercedes-Benz visibility.
- Blog 053 distinguishes Gwangjang, Majang, and Dongmyo by actual visitor purpose, opening-pattern risk, etiquette, and transit planning.
- Blog 007 separates sunscreen, gentle care, cosmetic selection, and routine consistency from genetics, miracle foods, and celebrity-selection bias.
- Blog 051 replaces the obsolete 2024 list with the 2026 Forbes Korea Power Celebrity 40 and explains the ranking method and its limits.
- Blogs 124 and 127 replace thin culture and season summaries with practical decision guides covering wedding money, dress and reception flow, and Korea's month-by-month weather tradeoffs.
- Blog 129 removes ageist “grandma fashion” framing and emphasizes consent, mixed-age street style, Dongmyo context, and the difference between observation and stereotyping.
- Blog 130 treats drinking and hoesik participation as optional, rejects coercion, and adds non-drinker scripts, transport, and safety planning.
- Blog 131 corrects the Korean-age misconception after the 2023 international-age reform and adds 2026 holiday transport, closures, food, games, and family diversity.
- Blog 125 distinguishes older nongak and pungmul traditions from the compact samulnori stage form created in Seoul in 1978; fixed cosmic and exorcism claims were removed.
- Supporting Blog 049 had its broken title and 0.6 fertility claim corrected to Statistics Korea's official 2024 total fertility rate of 0.75. Supporting Blogs 061 and 073 had visible mojibake and overgeneralized prose repaired where the new reverse links were added.

## Internal-Link Network

- Every target post now has at least two valid contextual links to other EpicKor articles; the batch contains 2-7 unique outgoing blog links per target.
- Reverse contextual links were added from Blogs `147`, `073`, `049`, `081`, `283`, `191`, `273`, `209`, `303`, `043`, `234`, `194`, `157`, `199`, `061`, `242`, `288`, and `297`.
- A mislabeled link in Blog 234 that described Blog 180 as a wedding guide was corrected to point to Blog 124.
- Automated resolution checks confirmed that every `/blog/NNN` link in the sixteen target posts maps to an existing content file.

## Image Review

- Added 64 selected article images across the sixteen post folders and one `image-sources.md` record per post.
- All 64 referenced assets exist locally and are below 400 KB; the target pages contain no unresolved image token, placeholder, or duplicate path within an article.
- Images were reviewed for direct topic fit, truthful captions, and Korea context. Blog 125's four generated editorial illustrations are explicitly labeled as illustrations in the article and source record; they are not presented as documentary photos or a named troupe.
- The sitewide image audit reports 128 legacy soft warnings above 400 KB and zero hard failures above 1.2 MB. Those warnings are pre-existing or unused legacy files; none of the 64 newly referenced target assets exceeds the budget.

## Automated And Rendered Gates

- `.claude/skills/reviewer/scripts/review-post.mjs --dry-run`: 100/100 for all sixteen posts; six FAQs recognized per post.
- `git diff --check`: passed.
- `npm run audit:amazon-links`: passed; all direct Amazon URLs use an approved tracking tag.
- `npm run audit:image-sizes`: passed with zero hard failures.
- `npm run audit:seo-aeo`: passed; sitewide average is now 86/100, with 0 critical and 61 high-priority posts.
- `npm run build`: passed; 359/359 static pages generated.
- Local production-server checks returned HTTP 200 for all sixteen routes. Each rendered page has one H1, two HTML tables, four article images plus layout images, and the expected visible CTA count (two, except zero for Blogs 076 and 077).
- Local browser visual automation was unavailable at this checkpoint because no browser surface was connected. Structural HTML, assets, responsive table wrappers, and build output were verified; public visual QA will be retried after deployment if the browser connection returns.

## Audit Impact

- Average SEO/AEO score: 83 -> 86.
- High priority: 79 -> 61.
- Thin content: 97 -> 81.
- Low internal linking: 115 -> 98.
- Missing FAQ sections: 93 -> 77.
- Stale posts: 87 -> 75.
- Title-length issues: 161 -> 143.
- Description-length issues: 16 -> 6.

## Deployment And Public QA

- Implementation commit `df0c8b7d` (`Rewrite sixteen high-priority legacy posts`) is on `origin/master`.
- Implementation deployment `dpl_FdNeQwhBdGst5DLrmbmL8oYXReUj` (`epickor-blog-34ikeuytc`) is Ready and was the deployment used for full public QA. The latest `origin/master` record deployment is also Ready and owns the `www.epickor.com`, `epickor.com`, and `epickor-blog.vercel.app` production aliases.
- Vercel cloned commit `df0c8b7`, compiled successfully, generated 359/359 static pages, and completed deployment output without an error.
- All sixteen public article routes returned HTTP 200 with the new titles and body markers; representative cache-free checks also returned the new content without a query parameter.
- All 64 referenced public image assets returned HTTP 200.
- The public sitemap contains all sixteen target routes, and all eighteen reverse-link source pages render the intended `/blog/NNN` link.
- Browser-window visual automation remained unavailable because no browser surface was connected. This is recorded as a QA limitation, not a deployment failure; production build, rendered HTML, public assets, sitemap, links, and CDN aliases all passed.
