# Blogs 005/019/021 Rewrite QA - 2026-07-18

## Scope

- Blog `005`: narrowed the old Korean hip-hop sociology post into a focused Show Me The Money guide explaining TV format, producer visibility, clips/streaming/meme flywheel, underground-vs-overground tension, and how to watch SMTM without mistaking it for the whole Korean hip-hop scene.
- Blog `019`: rewrote the thin Jeju/Busan/Gyeongju post into a Korea travel triangle decision guide covering destination fit, trip length, season, transport friction, and first-trip route choices.
- Blog `021`: rewrote the miyeokguk birthday post into a careful Korean seaweed soup guide covering birthday symbolism, postpartum tradition, ingredients, etiquette, exam superstition, cooking tips, and health-claim caution.
- Added SVG helper assets for Blogs `005` and `019`.
- Added reverse links from `009 -> 005`, `188/225 -> 019`, and `279/302 -> 021`.
- Cleaned Blog `188` legacy frontmatter/line endings so the touched source page passes the current reviewer.

## Verification

- `node .claude\skills\reviewer\scripts\review-post.mjs --draft content/blog/005-exploring-koreas-hip-hop-scene-the-rise-of-show-me-the-money.md --dry-run`: 100/100, 1,900 words, 11 H2, 3 images, 6 FAQ.
- `node .claude\skills\reviewer\scripts\review-post.mjs --draft content/blog/019-korean-travel-destinations-loved-by-koreans.md --dry-run`: 100/100, 1,925 words, 11 H2, 3 images, 6 FAQ.
- `node .claude\skills\reviewer\scripts\review-post.mjs --draft content/blog/021-discover-the-tradition-of-eating-seaweed-soup-on-korean-birthdays.md --dry-run`: 100/100, 1,810 words, 10 H2, 3 images, 6 FAQ.
- Touched source checks: `009` 100/100, `188` 95/100, `225` pass at 90/100, `279` pass at 90/100, `302` 100/100.
- `npm.cmd run audit:seo-aeo`: passed; average 96/100, critical 0, high 0, medium 11, thin 10, missing FAQ 10, stale 15.
- `npm.cmd run audit:amazon-links`: passed; 654 tagged amazon.com URLs and 247 amzn.to URLs, every direct Amazon URL uses exactly one approved tracking tag.
- `git diff --check`: passed; Windows CRLF warnings only.
- `npm.cmd run build`: passed; 363 static/SSG pages generated.

## Deployment and Public QA

- Implementation commit: `1a2faff1` (`Rewrite SMTM travel triangle and miyeokguk guides`).
- Pushed to `origin/master`.
- Vercel production deployment: `dpl_HGJFJgRZhyNae39KZMHDWRDj7QHe`.
- Aliases confirmed: `https://www.epickor.com`, `https://epickor.com`, `https://epickor-blog.vercel.app`, and git/project aliases.
- Public QA passed:
  - `/blog/005` contains `Show Me The Money Guide`.
  - `/blog/019` contains `Korea Travel Triangle Guide`.
  - `/blog/021` contains `Miyeokguk Guide`.
  - `/blog/009` contains `/blog/005` reverse link.
  - `/blog/188` contains `/blog/019` reverse link.
  - `/blog/302` contains `/blog/021` reverse link.
  - `/sitemap.xml` contains `/blog/005`, `/blog/019`, and `/blog/021`.

## Notes

- Blog `021` deliberately avoids treating miyeokguk as medical advice. It preserves the Korean postpartum/birthday cultural meaning while cautioning readers about thyroid, pregnancy, breastfeeding, postpartum, and medical-condition contexts.
- Blog `005` is now differentiated from Blog `009`: `009` remains the broad Korean hip-hop map, while `005` is the SMTM/TV-franchise explainer.
