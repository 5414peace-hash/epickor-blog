# Card news 2026-09-03_435 — image sources

Six photographs and one diagram, one per card, no path repeated. Four assets come from the source
post; three were pulled from Lock&Lock's own product pages for this carousel.

| Card | File | What is in frame | Source | Licence |
|---|---|---|---|---|
| 01 | `kimchi-container-carried.jpg` | Two hands lifting a large brushed stainless kimchi container by its folding handles, kimchi visible through the lid | `locknlock.com/kor/image/product/2021/06/23/46641568dyxd.jpg` | Manufacturer image, **product identification**. No sponsorship implied |
| 02 | `stainless-kimchi-containers.jpg` | Rectangular stainless 김치통 with clear locking lids, side by side | Post 435 → `locknlock.com` `46641597lcqw.jpg` | Same basis |
| 03 | `press-plate-diagram.jpg` | EpicKor diagram — cross-section of kimchi held under brine by a 누름판 against kimchi floating clear of it | Made for post 435, recomposed for this card | Mechanism cited in the article |
| 04 | `kimchi-container-air-valve.jpg` | A hand pressing the one-way air valve on the clear lid | Post 435 → `locknlock.com` `46641587dsjs.jpg` | Same basis |
| 05 | `kimchi-packed-in-container.jpg` | An open stainless container packed with whole cabbage kimchi, lid propped beside it | `locknlock.com/kor/image/product/2021/06/23/46633956xqyr.jpg` | Same basis |
| 06 | `stainless-container-latch.jpg` | A hand releasing the locking latch on the clear lid | `locknlock.com/kor/image/product/2021/06/23/46641628zrtv.jpg` | Same basis |
| 07 | `gimjang-communal.jpg` | 김장 — a long outdoor table of people making kimchi together in pink gloves | Post 435 → `File:Gimjang_in_Gaemi_Village,_1_December_2012.jpg` | **CC BY 2.0** — USAG-Humphreys |

## The one image that does not exist

**Card 03 is a diagram because a photograph of a 누름판 could not be sourced**, and that is worth
recording rather than glossing. The 0차 path was tried properly: Lock&Lock's own product pages
(the breathing STS container page yields six images ≥400px, all of them used or considered here),
their 프레스 김치통 category page (returns no product imagery), and a Commons API search on both
`kimchi container` and the romanised `nureumpan` (nothing). **The component this whole carousel is
named after is not publicly photographed by the company that sells it.**

The chart is the honest substitute and arguably the better one: it is a **cross-section**, showing
kimchi held under brine against kimchi floating clear of it, which no photograph of a flat plate
would convey. It is scored down anyway (94) rather than excused.

**The chart also had to be rebuilt for a square card.** The post's version is 1400 × 980 and covers
two subjects; dropped into a 1080 card at `background-size: cover` it cropped mid-word — the first
render read "…ea the fridge picks the contai…". Fixed in the asset rather than the renderer: the
press-plate half was cropped out (1320 × 400), scaled to 1010px, and composited onto a 1080 square
filled with the chart's own ground colour (`rgb(251,248,243)`, sampled from the file) so it sits in
the band above the steel plate. **`pot-stamp` is a photo system; wide diagrams have to be squared up
before they reach it.**

## The gate failed this deck three times, all for the same reason

`review-cardnews.mjs` compares the card's `name_ko` / `name_en` against `image_label` as **strings**,
so a label describing the right object in the wrong script still fails. Cards 02, 03 and 07 named
김치통, 누름판 and 김장 while their labels said "kimchi containers", "press plate" and "Kimjang".
Adding the hangul fixed the first two; card 07 needed one more pass because the label romanised it
**kimjang** while the card said **gimjang** — the revised romanisation the post and the Commons file
both use. **Keep one romanisation per object across the label, the name and the file name.**

## Cross-carousel uniqueness

The three new Lock&Lock URLs appear in no other post or carousel; the four post-owned assets are used
here for their own post's carousel, which the reuse rule permits. `kimchi-in-glass-jars.jpg` from the
post was not needed and is not included.

## Renderer

`pot-stamp`, third and last deck in the kitchen batch after 438 and 433. No code changes.

**Visual Fit Score: average 98.0, lowest card 94** (01: 99 · 02: 98 · 03: 94 · 04: 99 · 05: 100 ·
06: 96 · 07: 100). Structural gate PASS, 7/7 image cards, 0 consecutive image-free cards.
Six of seven cards carry photographs, above the 5-of-7 floor.
