# Blogs 134-158 Legacy Thin-Post Rewrite Review

Date: 2026-07-17  
Scope: Blogs `134`, `140`, `144`, `146`, `147`, `148`, `149`, and `158`

## Outcome

Eight high-priority legacy posts were rebuilt as current EpicKor practical guides. Each article now has a direct-answer opening, current framing, 11-13 H2 sections, two reader-facing HTML tables, six FAQ answers, contextual internal links, two disclosed Amazon affiliate CTAs, and four topic-fit images with source documentation.

## Article QA

| Blog | Review words | H2 | Tables | FAQs | Used images | Affiliate CTAs | Reviewer |
|---|---:|---:|---:|---:|---:|---:|---:|
| 134 | 1,978 | 11 | 2 | 6 | 4 | 2 | 100/100 |
| 140 | 1,846 | 11 | 2 | 6 | 4 | 2 | 100/100 |
| 144 | 1,848 | 11 | 2 | 6 | 4 | 2 | 100/100 |
| 146 | 1,923 | 12 | 2 | 6 | 4 | 2 | 100/100 |
| 147 | 1,825 | 11 | 2 | 6 | 4 | 2 | 100/100 |
| 148 | 1,905 | 12 | 2 | 6 | 4 | 2 | 100/100 |
| 149 | 1,847 | 12 | 2 | 6 | 4 | 2 | 100/100 |
| 158 | 1,886 | 13 | 2 | 6 | 4 | 2 | 100/100 |

## Content And Link Corrections

- Blog 134 now distinguishes official, unofficial, current, discontinued, and collectible K-pop goods instead of treating all merchandise as one market.
- Blog 140 gives traveler-first restroom guidance and separates common facilities from viral novelty claims. Blog 222 now provides an incoming contextual link.
- Blog 144 separates standard Paju DMZ tours from Panmunjeom/JSA access and emphasizes current route and security checks.
- Blog 146 corrects Mosu's current Michelin status after reopening instead of repeating its pre-closure three-star status.
- Blogs 147-149 replace broad culture stereotypes with practical, optional, and context-sensitive guidance.
- Blog 158 reframes "real Korean food" as situation-based everyday eating rather than a single authenticity checklist.
- Reverse contextual links were added from Blogs 222, 291, 295, 298, 299, 302, 303, 304, and 305. Additional outbound links were added where the sitewide audit found only one internal link.

## Image Review

- Added 32 selected article images across the eight post folders and one `image-sources.md` record per post.
- Every selected image is below the 400 KB soft budget and has a directly matching local source file.
- Local production-server HTTP checks returned 200 for 32/32 referenced article assets.
- The sitewide image audit still reports 129 legacy PNG warnings above 400 KB, with zero hard failures above 1.2 MB. None belongs to this new image set.

## Automated And Rendered Gates

- `.claude/skills/reviewer/scripts/review-post.mjs --dry-run`: 100/100 for all eight posts; six FAQs recognized per post.
- `npm run audit:seo-aeo`: passed; local sitewide average is 83/100, with 0 critical and 79 high-priority posts.
- `npm run audit:amazon-links`: passed; all direct Amazon URLs use an approved tracking tag.
- `npm run audit:image-sizes`: passed with zero hard failures.
- `npm run build`: passed; 359/359 static pages generated.
- Desktop browser QA at the normal viewport found matching titles/H1s, two tables, two Amazon links, six FAQ questions, and no document-level overflow on all eight routes.
- Mobile browser QA at 390 px found no document-level overflow on all eight routes; tables remain inside their intended local scroll containers.
- Visual spot checks passed the Blog 134 desktop hero/article opening and Blog 140 mobile hero/breadcrumb/tag layout.

## Audit Impact

- Average SEO/AEO score: 82 -> 83.
- High priority: 87 -> 79.
- Thin content: 105 -> 97.
- Low internal linking: 123 -> 119.
- Low heading depth: 11 -> 3.
- Missing descriptions: 9 -> 5.

## Deployment And Public QA

- Pending implementation commit, production deployment, public page/asset/sitemap/reverse-link verification.
