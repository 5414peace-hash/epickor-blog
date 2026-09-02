# Blog 435 — Korean Kimchi Containers — image sources

Two manufacturer product photographs, two Wikimedia Commons photographs, one EpicKor chart.

| File | What it shows | Source | License / credit |
|---|---|---|---|
| `kimchi-container-size-and-press-plate.jpg` | EpicKor chart — 7L and 3.2L drawn to scale sharing a 26 × 17cm footprint, plus a cross-section of the press plate against no press plate | Made for this post | Dimensions and 골마지 mechanism cited in the article |
| `stainless-kimchi-containers.jpg` | Rectangular stainless kimchi containers with clear lids, side by side | `locknlock.com/kor/image/product/2021/06/23/46641597lcqw.jpg` | Manufacturer image, **product identification**. No sponsorship implied |
| `kimchi-container-air-valve.jpg` | A hand pressing the one-way air valve on the lid | `locknlock.com/kor/image/product/2021/06/23/46641587dsjs.jpg` | Same basis |
| `gimjang-communal-kimchi-making.jpg` | Kimjang — communal kimchi-making at a long table | `commons.wikimedia.org/wiki/File:Gimjang_in_Gaemi_Village,_1_December_2012.jpg` | **CC BY 2.0** — USAG-Humphreys |
| `kimchi-in-glass-jars.jpg` | Three glass jars of kimchi | `commons.wikimedia.org/wiki/File:Kimchi_in_jar.jpg` | **CC BY 4.0** — Shisma |

**Each photograph answers a sentence in the article.** The side-by-side stainless shot shows the
rectangular shape the fridge-tiling argument predicts. The valve close-up is the only way to show that
the button on the lid is a vent rather than a latch. The kimjang photograph supplies the volume that
explains why 10L containers exist. The glass jars are deliberately the *contrast* — the Western
default, named as such in the caption rather than presented as the Korean norm.

**⚠️ A cross-post duplicate check nearly failed on a formatting detail.** Two of the obvious Commons
candidates — `Kimchi_refrigerator3.jpg` and `Korea-Hanok-Jars-Kimchi-01.jpg` — are **already used by
post 392**. The first check missed this because the search string used **spaces** while
`image-sources.md` records the filenames with **underscores**, so both came back "free".
**Normalise underscores, spaces and hyphens before comparing filenames**; a raw substring search on a
Commons title is not a duplicate check. `scripts/audit-image-uniqueness.mjs` keys off Pexels/Unsplash
photo IDs and does not cover Commons filenames at all, so this one is manual.

**Technical notes:**
- `locknlock.com` serves product images from `/kor/image/product/{yyyy}/{mm}/{dd}/{id}.jpg` and accepts
  a `Referer`. The IDs come from the product page HTML.
- The chart is a **single vertical composition with two stacked panels**. Horizontal multi-column
  layouts have collided their labels on five posts (426, 428, 429, 433, 434); this one does not use one.

**Cross-post uniqueness (verified with normalised names):** the two Lock&Lock URLs and both Commons
files appear in no other post's `image-sources.md`.

**Size:** 113 + 86 + 236 + 110 + chart = about 660KB across five images.
