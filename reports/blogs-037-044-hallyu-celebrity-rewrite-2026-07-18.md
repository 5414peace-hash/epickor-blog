# Blogs 037/042/044 Hallyu Celebrity Rewrite QA - 2026-07-18

## Scope

This batch continued the legacy content-debt cleanup after the `002/006/023/024/025` deployment. The SEO/AEO audit queue identified Blogs `037`, `042`, and `044` as the next worst high-priority posts: all had roughly 380-403 words, no internal links, no FAQ section, stale dates, and no reliable source framing.

Implementation commit: `982f5402` (`Rewrite Hallyu celebrity legacy posts`).

Production deployment: `dpl_Gmgb6QRyHEStkNTPKgFnmPRfcq83`, Ready and aliased to:

- `https://www.epickor.com`
- `https://epickor.com`
- `https://epickor-blog.vercel.app`

## Rewritten Posts

| Slug | New title | Review count | Main upgrade |
|---|---|---:|---|
| `037` | `Cha Eun-woo Guide: ASTRO, K-Dramas, and Face Genius` | 2,179 words | Reframed from appearance-only praise into a Hallyu idol/actor/branding guide with current military-service context. |
| `042` | `Kim Soo-hyun Drama Fees: Hallyu Star Economics Explained` | 1,960 words | Reframed fee rumors as unconfirmed entertainment-market reporting and explained K-drama star economics. |
| `044` | `BTS V Military Service Guide: SDT, Discharge, and Comeback` | 1,996 words | Updated from pre-discharge fan framing to confirmed 2025 discharge, fan etiquette, and BTS return-era context. |

All three now include:

- 13 H2 sections.
- 3 article images each.
- 2 HTML `.table-scroll` tables.
- 6 FAQ entries.
- Internal links to related EpicKor posts.
- 2 disclosed affiliate CTAs with sponsored/no-follow attributes.
- External sources opened in new tabs with `rel="noopener noreferrer"`.

## Image Notes

- Blog `037` retained three existing EpicKor-owned/legacy visual-package frames and gave them clearer contextual captions.
- Blog `042` retained its existing hero and added two lightweight EpicKor editorial SVG diagrams:
  - `/assets/images/posts/042/kdrama-star-economics.svg`
  - `/assets/images/posts/042/kdrama-fee-rumor-filter.svg`
- Blog `044` retained three existing EpicKor-owned/legacy visual-package frames. Two percent-encoded filenames were double-encoded in Markdown so the local image reviewer and static serving path both resolve correctly.

## Reverse-Link Pass

Added contextual links into the new/rebuilt celebrity cluster from:

- Blog `002` -> Blog `044`.
- Blog `025` -> Blogs `037` and `042`.
- Blog `051` -> Blogs `037`, `042`, and `044`.
- Blog `291` -> Blog `044`.

## Validation

| Check | Result |
|---|---|
| `node .claude\skills\reviewer\scripts\review-post.mjs --draft ...037...` | Pass, 100/100 |
| `node .claude\skills\reviewer\scripts\review-post.mjs --draft ...042...` | Pass, 100/100 |
| `node .claude\skills\reviewer\scripts\review-post.mjs --draft ...044...` | Pass, 100/100 after image URL encoding fix |
| `git diff --check` | No whitespace errors; CRLF warnings only |
| `npm.cmd run audit:seo-aeo` | Pass; average 87/100 |
| `npm.cmd run audit:amazon-links` | Pass; 604 tagged amazon.com URLs, 284 amzn.to URLs |
| `npm.cmd run build` | Pass; 359 static pages generated |
| Built HTML/RSC spot check | New titles, SVG image path, and reverse links found in build output |
| Vercel production inspect | `dpl_Gmgb6QRyHEStkNTPKgFnmPRfcq83` Ready, production target, `www.epickor.com` alias attached |
| Public QA | `/blog/037`, `/blog/042`, `/blog/044` HTTP 200 with expected title/table/CTA markers |
| Public sitemap QA | `/sitemap.xml` HTTP 200 and contains `/blog/037`, `/blog/042`, `/blog/044` |
| Public reverse-link QA | `/blog/002`, `/025`, `/051`, `/291` HTTP 200 and contain expected links into `037/042/044` |

## Audit Delta

Compared with the post-`002/006/023/024/025` audit:

- High-priority posts: `44 -> 41`.
- Low internal linking: `81 -> 78`.
- Thin content: `78 -> 75`.
- Missing FAQ section: `72 -> 69`.
- Stale posts: `70 -> 67`.
- Average score remains `87/100`, with average word count up from `1627 -> 1644`.

## Source Set Used

- Cha Eun-woo / `037`:
  - <https://about.netflix.com/en/news/the-wonderfools-confirmed-for-production>
  - <https://www.netflix.com/tudum/articles/the-wonderfools-release-date-news>
  - <https://en.yna.co.kr/view/AEN20250529006400315>
  - <https://www.mcst.go.kr/english/policy/pressView.jsp?pSeq=511>
- Kim Soo-hyun / `042`:
  - <https://www.goldmedalist.com/en/artistView/soohyun_kim>
  - <https://www.netflix.com/tudum/articles/queen-of-tears-release-date-news>
  - <https://www.netflix.com/gu/title/81707950>
  - <https://en.yna.co.kr/view/AEN20250321006300315>
  - <https://www.mcst.go.kr/english/policy/pressView.jsp?pSeq=511>
- BTS V / `044`:
  - <https://weverse.io/bts/notice/9371>
  - <https://weverse.io/bts/notice/27681>
  - <https://www.korea.net/NewsFocus/Culture/view?articleId=272922>
  - <https://bighitsmusic.com/bts/kor/discography/v>

## Next Recommended Batch

The next audit queue begins with `046`, `047`, and `050`, each still scoring 62 with thin content, no internal links, missing FAQ, and stale metadata. A similar three-post batch should reduce the high-priority count from 41 to 38 if all pass.
