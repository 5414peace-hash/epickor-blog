# Blogs 048/058/162 Rewrite QA - 2026-07-18

## Scope

- Blog `048`: rewrote the stale Carbo Buldak post into a practical Korean ramen guide covering product identity, viral growth, cooking method, buying choices, spice safety, and K-food context.
- Blog `058`: rewrote the stale summer K-pop post into a seasonal-listening guide covering Korean 2030 habits, SISTAR as a case study, current chart checks, playlist structure, and international-fan interpretation.
- Blog `162`: replaced a private health-overclaim draft with a public Korean red ginseng guide covering formats, MFDS label checks, NCCIH safety cautions, gift culture, brand/heritage signals, and practical buying logic.
- Added lightweight EpicKor SVG assets for Blogs `048`, `058`, and `162`.
- Added reverse links from `029/277 -> 048`, `002/291 -> 058`, and `175/263 -> 162`.
- Fixed two legacy Amazon CTA attributes in Blog `175` while adding the red-ginseng context links.

## Verification

- `node .claude\skills\reviewer\scripts\review-post.mjs --draft content/blog/048-the-carbo-buldak-popularity.md --dry-run`: 100/100, 1,926 words, 10 H2, 3 images, 6 FAQ.
- `node .claude\skills\reviewer\scripts\review-post.mjs --draft content/blog/058-2030-koreans-summer-k-pop-hits.md --dry-run`: 100/100, 1,924 words, 10 H2, 3 images, 6 FAQ.
- `node .claude\skills\reviewer\scripts\review-post.mjs --draft content/blog/162.md --dry-run`: 100/100, 1,845 words, 11 H2, 3 images, 6 FAQ.
- `npm.cmd run audit:seo-aeo`: passed; average 95/100, critical 0, high 0, medium 14, thin 13, missing FAQ 13, stale 18.
- `npm.cmd run audit:amazon-links`: passed; 651 tagged amazon.com URLs and 248 amzn.to URLs, every direct Amazon URL uses exactly one approved tracking tag.
- `git diff --check`: passed; Windows CRLF warnings only.
- `npm.cmd run build`: passed; 363 static/SSG pages generated.

## Deployment and Public QA

- Implementation commit: `83d60ed1` (`Rewrite Buldak summer K-pop and ginseng guides`).
- Pushed to `origin/master`.
- Vercel production deployment: `dpl_BVdBZa1ikA1uYv6NatfqNM4kEYar`.
- Aliases confirmed: `https://www.epickor.com`, `https://epickor.com`, `https://epickor-blog.vercel.app`, and git/project aliases.
- Public QA passed:
  - `/blog/048` contains `Carbo Buldak Guide`.
  - `/blog/058` contains `Summer K-Pop Guide`.
  - `/blog/162` contains `Korean Red Ginseng Guide`.
  - `/blog/029` contains `/blog/048` reverse link.
  - `/blog/263` contains `/blog/162` reverse link.
  - `/sitemap.xml` contains `/blog/048`, `/blog/058`, and `/blog/162`.

## Notes

- Blog `162` was handled conservatively because it is a wellness topic. The rewrite avoids disease-treatment, prevention, guaranteed immunity, and biohacking claims, and directs readers to professional advice when medication, pregnancy, diabetes, surgery, bleeding risk, autoimmune concerns, children, or breastfeeding are involved.
- Blog `291` still has older mojibake artifacts outside this task's link insertion area. It should be considered for a future light cleanup pass, but the current batch did not expand into a full `291` rewrite.
