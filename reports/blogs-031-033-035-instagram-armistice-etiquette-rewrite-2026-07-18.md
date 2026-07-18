# Blogs 031/033/035 Legacy Rewrite and Deployment QA - 2026-07-18

## Scope

- Rewrote Blog `031` into a guide to Korean celebrity Instagram influence, BLACKPINK/BTS platform power, actor growth patterns, and Hallyu brand conversion.
- Rewrote Blog `033` into a careful guide to the Korean War Armistice, the DMZ, South Korea's calm under recurring tension, and practical visitor safety context.
- Rewrote Blog `035` into a practical conflict-avoidance guide covering nunchi, honorifics, face-saving, family respect, sensitive national topics, and travel friction.
- Added reverse links from `085/291` to `031`, from `026/084` to `033`, and from `033` to `035`; existing `001 -> 035` remains verified.
- Added decoded filename copies for five legacy `%EC...` image assets so reviewer/static/public paths resolve correctly.

## Final Post Structure

| Blog | Topic | Reviewer Score | Words | H2 Sections | Images | FAQ Q&A |
|---|---|---:|---:|---:|---:|---:|
| `031` | Korean celebrity Instagram, fandom, brand power | 100/100 | 2,055 | 10 | 3 | 6 |
| `033` | Korean War Armistice, DMZ, travel safety context | 100/100 | 1,936 | 10 | 3 | 6 |
| `035` | Korean conflict avoidance, nunchi, etiquette | 100/100 | 2,019 | 11 | 3 | 6 |

Each rewritten post includes:

- Updated `2026-07-18` frontmatter with public visibility, description, tags, `ogImage`, and `author`.
- Two HTML tables wrapped in `.table-scroll`.
- Three article images.
- Two disclosed affiliate CTA boxes with approved Amazon links and `rel="nofollow sponsored noopener noreferrer"`.
- Internal links and related EpicKor guide sections.
- Six FAQ entries.
- Source/further-reading links.

## Verification

- `node .claude/skills/reviewer/scripts/review-post.mjs --draft content/blog/031-discover-the-most-followed-korean-celebrities-on-instagram.md` passed.
- `node .claude/skills/reviewer/scripts/review-post.mjs --draft content/blog/033-the-unending-ceasefire-understanding-south-koreas-ongoing-tensions-with-north-korea.md` passed.
- `node .claude/skills/reviewer/scripts/review-post.mjs --draft content/blog/035-how-to-avoid-fighting-with-koreans-3-essential-tips.md` passed.
- `npm.cmd run audit:seo-aeo` passed.
- `npm.cmd run audit:amazon-links` passed.
- `git diff --check` passed.
- `npm.cmd run build` passed, generating 359 static pages.

## SEO/AEO Audit Delta

After this batch:

- Average SEO/AEO score: 90 -> 91.
- High-priority posts: 20 -> 17.
- Low-internal-linking posts: 55 -> 52.
- Thin-content posts: 54 -> 51.
- Missing FAQ posts: 48 -> 45.
- Stale posts: 47 -> 44.
- Next top queue starts with `045`, `054`, `056`, `067`, `068`, and `069`.

## Commits and Deployment

- Implementation commit: `8fe6162e` (`Rewrite Instagram armistice and etiquette posts`).
- Reverse-link correction commit: `33788711` (`Add armistice conflict guide reverse link`).
- Final Vercel deployment: `dpl_wfAMGTrKcxtCTgAPsnqnYrGDEoeQ`.
- Final deployment URL: `https://epickor-blog-lxqsb4rxi-yhs-projects-5de403d3.vercel.app`.
- Production aliases verified:
  - `https://www.epickor.com`
  - `https://epickor.com`
  - `https://epickor-blog.vercel.app`

## Public QA

Public checks passed after final deployment:

- `https://www.epickor.com/blog/031`: HTTP 200; title/content marker, `affiliate-inline-cta`, `<table`, and FAQ marker found.
- `https://www.epickor.com/blog/033`: HTTP 200; title/content marker, `affiliate-inline-cta`, `<table`, and FAQ marker found.
- `https://www.epickor.com/blog/035`: HTTP 200; title/content marker, `affiliate-inline-cta`, `<table`, and FAQ marker found.
- Sitemap includes `/blog/031`, `/blog/033`, and `/blog/035`.
- Newly referenced decoded image assets returned HTTP 200:
  - `/assets/images/posts/031/031_EpicKor_요순.mp4_20240715_221437.789.jpg`
  - `/assets/images/posts/031/031_EpicKor_요순.mp4_20240715_221442.629.jpg`
  - `/assets/images/posts/031/031_EpicKor_요순.mp4_20240715_221447.669.jpg`
  - `/assets/images/posts/035/035_epickor_휘수.mp4_20240716_220554.209.jpg`
  - `/assets/images/posts/035/035_epickor_휘수.mp4_20240716_220559.740.jpg`
- Reverse-link checks passed:
  - `085 -> /blog/031`
  - `291 -> /blog/031`
  - `026 -> /blog/033`
  - `084 -> /blog/033`
  - `001 -> /blog/035`
  - `033 -> /blog/035`

## Notes

- A first deployment (`dpl_Aq7Z58oYHUdYp34LT31bTtPz5UDN`) reached Ready, but public QA caught the missing `033 -> /blog/035` reverse link. The correction was committed and deployed as `dpl_wfAMGTrKcxtCTgAPsnqnYrGDEoeQ`.
- The unrelated untracked `reports/business-gsc-affiliate-check-2026-07-17.md` was preserved and intentionally not committed.
