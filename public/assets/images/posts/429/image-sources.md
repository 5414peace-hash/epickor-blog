# Blog 429 — Maxim vs G7 — image sources

Three product photographs from manufacturer/brand sites plus one EpicKor chart. Photographs are used
for **product identification** in an editorial comparison, per CLAUDE.md's 0차 sourcing rule. No
sponsorship, affiliation or endorsement by Dongsuh Foods or Trung Nguyên is implied or claimed.

| File | What it shows | Source | Note |
|---|---|---|---|
| `maxim-mocha-gold-mild-100-sticks.jpg` | 맥심 모카골드 마일드 커피믹스, 100-stick box | `dongsuh.co.kr/images/temp/temp_product_10.png` (official Maxim brand page) | The flagship. Hero + ogImage |
| `maxim-mocha-gold-zero-sugar.jpg` | 맥심 모카골드 제로슈가, 50 + 20 stick boxes | `dongsuh.co.kr/images/temp/temp_product_11.png` | The current line extension — relevant because the article's story is a market that stopped shrinking |
| `trung-nguyen-g7-3in1-coffeemix.jpg` | Trung Nguyên G7 3-in-1 Coffeemix box and stick | `g7coffee.co.in/wp-content/uploads/2025/02/3in1.png` | See sourcing note below |
| `korea-coffee-cups-per-person.jpg` | EpicKor chart — 405 / 318 / 152 cups per person per year | Made for this post | Figures cited in the post's Sources section |

**G7 sourcing note, stated plainly:** `g7coffee.co.in` is a Trung Nguyên **regional brand site for
India**, not the corporate site at `trungnguyenlegend.com`. The corporate site's only G7 assets that
resolved were a 2018 thumbnail and a logo; `trungnguyenlegend.us` (the US store) served a
collection banner that is just the logo mark on white, useless as a packshot. The regional site's
image is the actual product. Recorded here rather than described as "official Trung Nguyên" because
the distinction is real.

**Technical notes for the next person:**
- Dongsuh's brand page names its product shots `temp_product_N.png`, which looks like placeholder
  scaffolding but is the real 500×500 packshot set. Do not skip them on the filename.
  Mapping found: `_6` 화이트골드 · `_7` 슈프림골드 · `_10` 모카골드 마일드 · `_11` 모카골드 제로슈가.
  A `Referer` header was not required here, unlike jangsoomarket in post 427.
- Both product sources are transparent PNGs; flattened onto white before JPEG encoding, otherwise
  the alpha renders black.
- **emart.ssg.com returns 403 to fetching** — the price in this post came from search-result
  listings and a second retailer, not from scraping the store page.

**Cross-post uniqueness:** none of these source URLs appears in any other post's `image-sources.md`.
Not stock photos, so no Pexels/Unsplash photo ID applies.

**Size:** 24 + 38 + 24 + 33 = 119KB for the post.
