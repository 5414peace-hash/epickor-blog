# Blogs 013/063/073 Content-Debt Rewrite QA - 2026-07-18

## Scope

- Rewrote Blog `013` into `Korean Etiquette Guide: Habits Locals Notice Most`.
- Rewrote Blog `063` into `Seoul Hiking Guide: Easy, Scenic, and Challenging Trails`.
- Rewrote Blog `073` into `Things to Know Before Traveling to Korea: 2026 Guide`.
- Added reverse links:
  - Blog `035` -> `/blog/013`
  - Blog `226` -> `/blog/063`
  - Blog `026` already linked to `/blog/073` and was publicly verified.
- Added six decoded Korean-filename image copies for Blogs `063` and `073` so reviewer, static build, and public asset requests resolve correctly.
- Preserved unrelated untracked file: `reports/business-gsc-affiliate-check-2026-07-17.md`.

## Editorial Improvements

### Blog 013

- Updated title, description, tags, date, and `ogImage`.
- Reframed the post from abstract "foreign habits Koreans find puzzling" into a practical visitor etiquette guide.
- Covered shoes indoors, two-hand exchanges, quiet transit, indirect refusals, eye contact, dining etiquette, public affection, and nunchi.
- Added two HTML tables, three article images, two affiliate CTAs, six FAQs, internal links, and source links.

### Blog 063

- Updated title, description, tags, date, and `ogImage`.
- Rebuilt the post as a Seoul hiking guide comparing Namsan, Inwangsan, Achasan, Bukhansan, and Gwanaksan.
- Added route-selection logic, seasonal safety, packing, gear, hiking culture, trail etiquette, and first-timer plan.
- Added two HTML tables, four article images, two affiliate CTAs, six FAQs, internal links, and source links.

### Blog 073

- Updated title, description, tags, date, and `ogImage`.
- Rebuilt the post as a 2026 Korea travel-prep guide covering K-ETA/e-Arrival checks, local map apps, T-money, payment backups, emergency numbers, weather, etiquette, food/allergy planning, and phone-battery preparation.
- Removed overconfident "safest country" style claims and replaced them with practical safety framing.
- Added two HTML tables, four article images, two affiliate CTAs, six FAQs, internal links, and source links.

## Automated QA

- `node .claude/skills/reviewer/scripts/review-post.mjs --draft content/blog/013-cultural-curiosities-what-koreans-find-puzzling-about-foreign-habits.md --dry-run`
  - Result: pass
  - Score: 100/100
  - Words: 1,901
  - H2: 13
  - Images: 3
  - FAQ Q&A: 6
- `node .claude/skills/reviewer/scripts/review-post.mjs --draft content/blog/063-discover-the-best-mountains-for-hiking-in-seoul-from-easy-to-advanced-trails.md --dry-run`
  - Result: pass
  - Score: 100/100
  - Words: 2,058
  - H2: 15
  - Images: 4
  - FAQ Q&A: 6
- `node .claude/skills/reviewer/scripts/review-post.mjs --draft content/blog/073-5-things-you-must-know-before-traveling-to-korea.md --dry-run`
  - Result: pass
  - Score: 100/100
  - Words: 2,048
  - H2: 14
  - Images: 4
  - FAQ Q&A: 6

## Sitewide QA

- `npm.cmd run audit:seo-aeo`
  - Passed.
  - Average score: 93/100.
  - High-priority posts reduced from 5 to 2.
  - Low-internal-linking reduced from 40 to 37.
  - Thin content reduced from 39 to 36.
  - Missing FAQ reduced from 33 to 30.
  - Stale posts reduced from 34 to 31.
- `npm.cmd run audit:amazon-links`
  - Passed.
  - 632 tagged direct Amazon URLs.
  - 257 `amzn.to` URLs.
  - Every direct Amazon URL uses exactly one approved tracking tag.
- `git diff --check`
  - Passed.
  - Only normal Windows LF/CRLF warnings appeared.
- `npm.cmd run build`
  - Passed.
  - 359 static pages generated.

## Deployment

- Implementation commit: `81fc99e4` (`Rewrite etiquette hiking and Korea travel tips`)
- Pushed to `origin/master`.
- Vercel deployment: `dpl_ktvUoNfqNExhCKxhTvMcqeJMHbc6`
- Deployment URL: `https://epickor-blog-iggtjj7lz-yhs-projects-5de403d3.vercel.app`
- Status: Ready
- Aliases verified:
  - `https://www.epickor.com`
  - `https://epickor.com`
  - `https://epickor-blog.vercel.app`

## Public QA

Verified HTTP 200 and expected markers on:

- `https://www.epickor.com/blog/013`
  - Checked title marker, `affiliate-inline-cta`, `FAQ`, and `shoes indoors`.
- `https://www.epickor.com/blog/063`
  - Checked title marker, `affiliate-inline-cta`, `FAQ`, and `Bukhansan`.
- `https://www.epickor.com/blog/073`
  - Checked title marker, `affiliate-inline-cta`, `FAQ`, and `K-ETA`.
- `https://www.epickor.com/sitemap.xml`
  - Confirmed `/blog/013`, `/blog/063`, and `/blog/073`.
- Reverse-link source pages:
  - `/blog/035` contains `/blog/013`.
  - `/blog/226` contains `/blog/063`.
  - `/blog/026` contains `/blog/073`.
- Decoded image asset URLs:
  - `/assets/images/posts/063/087_epickor_%ED%9C%98%EC%88%98.mp4_20240807_143414.978.jpg`
  - `/assets/images/posts/063/087_epickor_%ED%9C%98%EC%88%98.mp4_20240807_143433.796.jpg`
  - `/assets/images/posts/063/087_epickor_%ED%9C%98%EC%88%98.mp4_20240807_143454.156.jpg`
  - `/assets/images/posts/073/105_epickor_%ED%9C%98%EC%88%98.mp4_20240919_111436.961.jpg`
  - `/assets/images/posts/073/105_epickor_%ED%9C%98%EC%88%98.mp4_20240919_111504.075.jpg`
  - `/assets/images/posts/073/105_epickor_%ED%9C%98%EC%88%98.mp4_20240919_111530.055.jpg`

## Next Queue After This Batch

The remaining high-priority rewrite queue is:

1. Blog `081`
2. Blog `091`

Recommended next work: complete `081/091` together, then begin the medium-priority cleanup from `052/145/009` or a capped internal-link pass across low-link pages.
