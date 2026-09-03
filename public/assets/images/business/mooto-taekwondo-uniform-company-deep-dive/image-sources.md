# Business / Mooto deep dive — image sources

Two manufacturer product photographs and one EpicKor chart. No stock photography.

| File | What it shows | Source | Licence / credit |
|---|---|---|---|
| `mooto-basic45-kukkiwon-dobok.jpg` | Practitioner in the white BASIC 4.5 dobok, black V-neck, Kukkiwon badges at chest and shoulder, MOOTO chest logo, black belt, black ground | `moototr1864.cdn-nhncommerce.com/data/editor/goods/211222/basic_white_kukkiwon_1_1000_1_010213.jpg` | Manufacturer product image, editorial identification use |
| `mooto-taebek3-poomsae-uniform.jpg` | Practitioner in the gold TAEBEK 3 poomsae top with black collar and navy trousers, K-TIGERS embroidered belt, dark blue ground | `moototr1864.cdn-nhncommerce.com/data/editor/goods/260611/c4ca4238a0b923820dcc509a6f75849b_090926.jpg` | Manufacturer product image, editorial identification use |
| `mooto-wt-recognition-map.jpg` | EpicKor chart — where Mooto sits on the WT Recognised Brand Chart 2026_v3 | Made for this post | WT chart and company sources, listed in the article |

**Sourced under the 0차 rule (manufacturer site first).** Both photographs are Mooto's own product
imagery from its NHN Commerce storefront.

## Both photographs were cropped to remove the company's marketing copy

The 1000px-wide source files are **advertising layouts**, not bare packshots: each is a tall composite
with a Korean/English sales headline set above the photograph (*"전세계 태권도인에게 사랑받는 무토의
전천후 기본 도복"*, *"태백 3, 사범의 기준을 입다"*). Publishing them whole would have put the
manufacturer's slogans on an editorial page.

Cropping the photograph out of the ad is the right move and it is also the only way to get usable
resolution here — the plain packshot endpoints (`_detail_`, `_magnify_`, list thumbnails) top out at
**575×575 or 340×340**, well below body-image standard, while the `/data/editor/` composites are
1000px wide. Crops taken: `ed1` from y=660 (1000×1298) and `tb-ed1` from y=1660 (1000×1090). Both
land at 88–106KB.

## Brand-mark check, after the Kovea lesson

The 2026-09-03 Kovea post established that a product listed on a company-named storefront is not
proof the company made it — `kovea.co.kr` turned out to be a distributor shop carrying a `BLUE STAR`
packshot. So both files here were inspected at full resolution for foreign marks before use.

- **Result: MOOTO wordmarks and Kukkiwon badges only** across the whole `010001` uniform category —
  no competing brand appears. `mooto.com` is the brand's own store, not a mixed distributor shop.
- **One third-party mark is present and the caption does not hide it**: the belt in the poomsae photo
  is embroidered **K-TIGERS** (a Korean demonstration team), with a personal name in Korean beside it.
  The caption reports the belt as photographed. **No sponsorship relationship is asserted**, because
  none was verified.

## What the images had to support

The article's two load-bearing claims are that Mooto's value is the **Kukkiwon/WT badge** rather than
the sewing, and that **country of origin varies inside one catalogue**. So the hero is the model whose
product page states *South Korea* and whose badges are legible at chest and shoulder, and the second
photograph is the model whose page states *Myanmar*. The captions name each origin. **Both origins were
read off Mooto's own English product pages on 2026-09-03**, not inferred.

## Chart note

`mooto-wt-recognition-map.jpg` uses the vertical stacked-card generator (`.tmp/make-mooto-charts.mjs`),
copied from the Kovea deck with the **0.62 Latin advance factor** already applied — that fix was needed
because the 0.52em estimate under-measures capital-heavy strings and collided an inline sub-label.
Rendered and opened; no collisions, footer clears the watermark.

**Size:** 88 + 106 + chart ≈ 370KB across three images.
