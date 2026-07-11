# COSMAX Business Spotlight Review - 2026-07-11

## Scope

- Type: B-2 non-client company spotlight.
- Public-information-only framing; no consent required, no video embed, no Tripclip credit, and no client relationship implied.
- Proposed public path: `/business/cosmax-korean-beauty-odm-deep-dive`.

## Content Review

- Title: `COSMAX Deep Dive 2026: The ODM Engine Behind Global K-Beauty`.
- Reviewer-counted words: 2,701.
- H2 sections: 11.
- FAQ items: 5.
- Real HTML tables: 2, each wrapped in `.table-scroll`.
- Affiliate CTA boxes: 2; first box includes Amazon Associate disclosure.
- External anchors: 11; invalid `target`/`rel` attributes: 0.
- Internal Business links: COSMAX page links to five existing Business guides; reverse links were added from the OEM/ODM and cosmetics-wholesale guides.
- Editorial framing distinguishes company claims from EpicKor analysis and explicitly says the article is not a supplier endorsement or investment advice.
- Old sustainability-report figures were removed from the live quantitative argument; the article does not present dated 2022 scale figures as current 2026 performance.

## Image Review

Official raster assets: 7 total, including hero; body images: 6.

| Image | Direct fit /40 | Korea/context /20 | Official source /15 | Unique /15 | Text/logo risk /5 | Render /5 | Total |
|---|---:|---:|---:|---:|---:|---:|---:|
| COSMAX workplace/logo hero | 40 | 20 | 15 | 15 | 5 | 5 | 100 |
| COSMAX research laboratory | 40 | 20 | 15 | 15 | 5 | 5 | 100 |
| COSMAX package-design process | 38 | 20 | 15 | 15 | 5 | 5 | 98 |
| COSMAX Korean factory | 40 | 20 | 15 | 15 | 5 | 5 | 100 |
| COSMAX production containers | 39 | 20 | 15 | 15 | 5 | 5 | 99 |
| COSMAX/Keminova Cosmoprof 2026 booth | 40 | 19 | 15 | 15 | 5 | 5 | 99 |
| COSMAX/Keminova February 2026 signing | 40 | 19 | 15 | 15 | 5 | 5 | 99 |

- Average Blog Image Fit Score: 99.3/100.
- Lowest individual score: 98/100.
- Exact SHA-256 duplicates against existing `public/assets/images/**`: 0.
- Each image is a different official scene/source subject; no derivative crop duplication.
- Official Storyblok CDN derivatives reduced the seven-image transfer set from roughly 9MB to about 1.0MB without changing content or crop.
- Manual image inspection passed before and after optimization.

## Build And Render Review

- `npm.cmd run build -- --webpack`: PASS; 330/330 static pages generated.
- New route generated at `/business/cosmax-korean-beauty-odm-deep-dive`.
- Built HTML contains the title, hero, body images, two tables, two CTA boxes, FAQ, official sources, and valid affiliate/external link attributes.
- Local page, all seven image URLs, sitemap, and two reverse-link pages returned HTTP 200.
- Sitemap contains the new Business path.
- Browser desktop inspection: hero/title/metadata/body typography/table/image sections rendered; no document-level horizontal overflow.
- Browser mobile inspection at 390x844: document width remains contained; tables use `overflow-x: auto`; title, hero, tags, body, and imagery remain within the mobile layout.
- Lazy-loaded body images showed valid natural dimensions when scrolled into view; no loaded broken image remained.

## Reviewer Decision

PASS for publication. No unresolved content, image, link, build, or layout blocker remains.
