# Blogs 016/017/030 Legacy Rewrite and Deployment QA - 2026-07-18

## Scope

- Rewrote Blog `016` from a short Suzy/flirting explainer into a sourced guide to Bae Suzy's "Nation's First Love" image, Korean celebrity charm, and Korean flirting cues.
- Rewrote Blog `017` from a short 24-hour Seoul essay into a practical 24-hour Seoul route covering morning markets, daytime neighborhoods, dinner, late-night transit, Owl Bus context, and safety.
- Rewrote Blog `030` from a short Choi Min-sik profile into a sourced Korean-cinema guide covering *Oldboy*, *The Admiral: Roaring Currents*, *Exhuma*, and broader Korean film context.
- Added reverse internal links from Blogs `001`, `007`, `026`, `079`, `084`, `040`, and `067`.
- Added decoded filename copies for four legacy image assets so the reviewer and deployed pages resolve the referenced local image paths correctly.

## Final Post Structure

| Blog | Topic | Reviewer Score | Words | H2 Sections | Images | FAQ Q&A |
|---|---|---:|---:|---:|---:|---:|
| `016` | Suzy, first-love image, Korean flirting cues | 100/100 | 2,686 | 12 | 3 | 6 |
| `017` | 24-hour Seoul route, nightlife, transit, safety | 100/100 | 2,612 | 13 | 3 | 6 |
| `030` | Choi Min-sik, *Oldboy*, *Exhuma*, Korean cinema | 100/100 | 2,295 | 11 | 3 | 6 |

Each rewritten post includes:

- Updated `2026-07-18` frontmatter with public visibility, description, tags, `ogImage`, and `author`.
- Two real HTML tables wrapped in `.table-scroll`.
- Two disclosed affiliate CTA boxes using approved Amazon links and `rel="nofollow sponsored noopener noreferrer"`.
- Related EpicKor internal links.
- Six FAQ entries.
- Source/further-reading links to official or reliable pages.

## Source Notes

- Blog `016` uses KoBiz/Korean Film Council and Netflix official pages for Bae Suzy and recent projects.
- Blog `017` uses Seoul Metropolitan Government pages for Owl Bus and bus/night-service context.
- Blog `030` uses KoBiz/Korean Film Council and Yonhap/Korea Herald-linked records for *Exhuma* and 2024 admissions context.

## Verification

- `node .claude/skills/reviewer/scripts/review-post.mjs --draft content/blog/016-suzy-flirting-the-unique-charm-of-koreas-nations-first-love.md` passed.
- `node .claude/skills/reviewer/scripts/review-post.mjs --draft content/blog/017-seoul-in-24-hours-your-ultimate-adventure.md` passed.
- `node .claude/skills/reviewer/scripts/review-post.mjs --draft content/blog/030-discover-the-journey-of-koreas-beloved-10-million-actor-min-sik-choi.md` passed.
- `npm.cmd run audit:seo-aeo` passed.
- `npm.cmd run audit:amazon-links` passed.
- `npm.cmd run build` passed twice after the final reverse-link correction, generating 359 static pages.
- `git diff --check` passed.

## SEO/AEO Audit Delta

After this batch:

- Average SEO/AEO score: 90/100.
- High-priority posts: 23 -> 20.
- Low-internal-linking posts: 58 -> 55.
- Thin-content posts: 57 -> 54.
- Missing FAQ posts: 51 -> 48.
- Stale posts: 50 -> 47.
- Next top queue starts with `031`, `033`, `035`, `045`, `054`, and `056`.

## Commits and Deployment

- Implementation commit: `822c179d` (`Rewrite Suzy Seoul day and Choi posts`).
- Reverse-link correction commit: `2e672a19` (`Add first-time Korea reverse link`).
- Final Vercel deployment: `dpl_4Bv2LwxL5SuP5a5fq51WYkdJ3yrL`.
- Final deployment URL: `https://epickor-blog-flhx67vc5-yhs-projects-5de403d3.vercel.app`.
- Production aliases verified on final deployment:
  - `https://www.epickor.com`
  - `https://epickor.com`
  - `https://epickor-blog.vercel.app`

## Public QA

Public checks passed after final deployment:

- `https://www.epickor.com/blog/016`: HTTP 200; title/content marker, `affiliate-inline-cta`, `<table`, and FAQ marker found.
- `https://www.epickor.com/blog/017`: HTTP 200; title/content marker, `affiliate-inline-cta`, `<table`, and FAQ marker found.
- `https://www.epickor.com/blog/030`: HTTP 200; title/content marker, `affiliate-inline-cta`, `<table`, and FAQ marker found.
- Sitemap includes `/blog/016`, `/blog/017`, and `/blog/030`.
- Newly referenced decoded image assets returned HTTP 200:
  - `/assets/images/posts/017/017_EpicKor_요순.mp4_20240711_105445.994.jpg`
  - `/assets/images/posts/017/017_EpicKor_요순.mp4_20240711_105458.633.jpg`
  - `/assets/images/posts/030/030_epickor_진호.mp4_20240715_105938.085.jpg`
  - `/assets/images/posts/030/030_epickor_진호.mp4_20240715_105949.316.jpg`
- Reverse-link checks passed:
  - `001 -> /blog/016`
  - `007 -> /blog/016`
  - `026 -> /blog/016`
  - `026 -> /blog/017`
  - `079 -> /blog/017`
  - `084 -> /blog/017`
  - `040 -> /blog/030`
  - `067 -> /blog/030`

## Notes

- A first deployment (`dpl_2SqK8wVZjrpt4MZnH6GMTArQ69GD`) reached Ready, but public QA caught the missing `026 -> /blog/016` reverse link. The final correction was committed and deployed as `dpl_4Bv2LwxL5SuP5a5fq51WYkdJ3yrL`.
- The unrelated untracked `reports/business-gsc-affiliate-check-2026-07-17.md` was preserved and intentionally not committed.
