# Blogs 003/087/088 Content-Debt Rewrite QA - 2026-07-18

## Scope

- Rewrote Blog `087` from a thin old-restaurant/MICHELIN post into `Seoul Nopo Restaurant Guide: Old Shops, Michelin, and Soup`.
- Rewrote Blog `088` from a thin "only in Korea" post into `Unique Things in Korea: Small Conveniences, Trust, and Transit`.
- Rewrote Blog `003` from a thin abstract karaoke/bang-culture post into `Korean Noraebang Guide: Karaoke Rooms, Ballads, and Etiquette`.
- Added reverse links:
  - Blog `302` -> `/blog/087`
  - Blog `054` -> `/blog/088`
  - Blog `292` -> `/blog/003`
- Added six decoded Korean-filename image copies for Blogs `087` and `088` so reviewer, static build, and public asset requests resolve correctly.
- Preserved unrelated untracked file: `reports/business-gsc-affiliate-check-2026-07-17.md`.

## Editorial Improvements

### Blog 087

- Updated title, description, tags, date, and `ogImage`.
- Expanded into a practical Seoul nopo guide covering Imun Seolnongtang, Woo Lae Oak, Mijin, MICHELIN context, seolleongtang ordering, nopo etiquette, and route planning.
- Added two HTML tables, three article images, two affiliate CTAs, six FAQs, source links, and internal links to related EpicKor food/travel guides.
- Source framing used MICHELIN, VISITKOREA, and Visit Seoul pages for current restaurant and guide context.

### Blog 088

- Updated title, description, tags, date, and `ogImage`.
- Reframed the post away from exaggerated "impossible to steal" language and toward accurate micro-convenience systems: elevator cancel buttons, restaurant call bells, heated bus-stop seats, subway climate control, lost-item channels, convenience stores, weather-aware public design, and kiosks.
- Added two HTML tables, four article images, two affiliate CTAs, six FAQs, source links, and internal links to first-time travel, banchan, subway etiquette, convenience-store food, rainy-day food, and Seoul stay guides.
- Source framing used Seoul Metropolitan Government, Visit Seoul, LOST112, and restaurant-practice context.

### Blog 003

- Updated title, description, tags, date, and `ogImage`.
- Rebuilt the post as a practical noraebang guide covering traditional noraebang, coin noraebang, ballads, K-pop song choice, remote controls, etiquette, workplace/social hierarchy, first-visit song strategy, and streaming-era relevance.
- Added two HTML tables, three article images, two affiliate CTAs, six FAQs, source links, and internal links to nunchi, photocard, Hangeul, pojangmacha, and coin noraebang guides.
- Source framing used Korea.net, Visit Seoul, and KOFICE/Hallyu research context.

## Automated QA

- `node .claude/skills/reviewer/scripts/review-post.mjs --draft content/blog/087-100-years-old-korean-restaurant-and-michelin-star.md --dry-run`
  - Result: pass
  - Score: 100/100
  - Words: 2,100
  - H2: 13
  - Images: 3
  - FAQ Q&A: 6
- `node .claude/skills/reviewer/scripts/review-post.mjs --draft content/blog/088-unique-things-youll-only-find-in-korea.md --dry-run`
  - Result: pass
  - Score: 100/100
  - Words: 2,200
  - H2: 14
  - Images: 4
  - FAQ Q&A: 6
- `node .claude/skills/reviewer/scripts/review-post.mjs --draft content/blog/003-discover-the-icons-behind-koreas-favorite-karaoke-hits.md --dry-run`
  - Result: pass
  - Score: 100/100
  - Words: 2,103
  - H2: 15
  - Images: 3
  - FAQ Q&A: 6

## Sitewide QA

- `npm.cmd run audit:seo-aeo`
  - Passed.
  - Average score: 92/100.
  - High-priority posts reduced from 8 to 5.
  - Low-internal-linking reduced from 43 to 40.
  - Thin content reduced from 42 to 39.
  - Missing FAQ reduced from 36 to 33.
  - Stale posts reduced from 37 to 34.
- `npm.cmd run audit:amazon-links`
  - Passed.
  - 629 tagged direct Amazon URLs.
  - 260 `amzn.to` URLs.
  - Every direct Amazon URL uses exactly one approved tracking tag.
- `git diff --check`
  - Passed after trimming FAQ trailing whitespace.
  - Only normal Windows LF/CRLF warnings remained before commit.
- `npm.cmd run build`
  - Passed.
  - 359 static pages generated.

## Deployment

- Implementation commit: `801bfba9` (`Rewrite nopo convenience and noraebang posts`)
- Pushed to `origin/master`.
- Vercel deployment: `dpl_4kfbBPv2zg6YCRFDZ2B4FJWmXE7D`
- Deployment URL: `https://epickor-blog-ahn3fveif-yhs-projects-5de403d3.vercel.app`
- Status: Ready
- Aliases verified:
  - `https://www.epickor.com`
  - `https://epickor.com`
  - `https://epickor-blog.vercel.app`

## Public QA

Verified HTTP 200 and expected markers on:

- `https://www.epickor.com/blog/087`
  - Checked title marker, `affiliate-inline-cta`, `FAQ`, and `Imun Seolnongtang`.
- `https://www.epickor.com/blog/088`
  - Checked title marker, `affiliate-inline-cta`, `FAQ`, and `heated bus-stop`.
- `https://www.epickor.com/blog/003`
  - Checked title marker, `affiliate-inline-cta`, `FAQ`, and `coin noraebang`.
- `https://www.epickor.com/sitemap.xml`
  - Confirmed `/blog/087`, `/blog/088`, and `/blog/003`.
- Reverse-link source pages:
  - `/blog/302` contains `/blog/087`.
  - `/blog/054` contains `/blog/088`.
  - `/blog/292` contains `/blog/003`.
- Decoded image asset URLs:
  - `/assets/images/posts/087/114_epickor_%EB%AF%BC%ED%98%B8.mp4_20250113_222420.074.jpg`
  - `/assets/images/posts/087/114_epickor_%EB%AF%BC%ED%98%B8.mp4_20250113_222501.936.jpg`
  - `/assets/images/posts/087/114_epickor_%EB%AF%BC%ED%98%B8.mp4_20250113_223203.480.jpg`
  - `/assets/images/posts/088/115_epickor_%EA%B1%B4%EC%88%9C.mp4_20250114_231046.938.jpg`
  - `/assets/images/posts/088/115_epickor_%EA%B1%B4%EC%88%9C.mp4_20250114_231110.277.jpg`
  - `/assets/images/posts/088/115_epickor_%EA%B1%B4%EC%88%9C.mp4_20250114_231116.236.jpg`

## Next Queue After This Batch

The remaining high-priority rewrite queue is:

1. Blog `013`
2. Blog `063`
3. Blog `073`
4. Blog `081`
5. Blog `091`

Recommended next batch: `013/063/073`, because all three remain high-priority with thin content, missing FAQ, weak internal links, and stale/metadata issues.
