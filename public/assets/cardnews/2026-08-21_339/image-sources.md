# 2026-08-21_339 — Squid Game filming locations, image sources

Visual system: **location-slate** (`render-locationslate.py`), new for this batch. A film production
slate under each photograph: scene number, location name in both scripts, and the transit line that
gets you there. Chosen because every card is a place plus the way to reach it, and that pairing is
the only thing a reader needs to carry away.

Not a repeat: `ticket-stub` (2026-08-20) puts a date in the hero position, `station-sign` and
`transit-signal` are signage, `shelf-tag` and `rx-label` are retail labels. None of the 24 previous
systems is built around place-plus-route.

Veil: each card declares its own `image_opacity`, 0.66–0.82, under a bottom-weighted gradient. Cards
05 and 07 were re-rendered at higher opacity after the first contact sheet showed them reading murky.

## Cards — every image is the place its card names

| Card | File | What is in the photo | Source |
|---|---|---|---|
| 01 | yangjae-citizens-forest-station.jpg | Exit 3 canopy with the 양재시민의숲 (매헌) sign — the sign visible in the show | Commons, via post 339 |
| 02 | studio-cube-daejeon-exterior.jpg | Daejeon Expo Science Park grounds, Hanbit Tower and Expo Bridge | Commons, via post 339 |
| 03 | ifc-mall-yeouido.jpg | Yeouido skyline across the Han, Parc.1 and the IFC cluster | Commons, via post 339 |
| 04 | namsan-park.jpg | N Seoul Tower above the Namsan hillside | Commons, via post 339 |
| 05 | card_05-tapgol-park.jpg | Tapgol Park pavilion and grounds | Commons, `Tapgol Park, Seoul.jpg` CC BY-SA 4.0 |
| 06 | card_06-seogang-bridge.jpg | Seogang Bridge's red arch over the Han, Bukhansan behind | Commons, `Seogang Bridge and Bukhansan from Bamseom.jpg` PD |
| 07 | card_07-daegongwon-station.jpg | Daegongwon Station entrance, Line 4, Korean signage | Commons, `Seoul Line4 Daegongwon Station.jpg` CC BY-SA 3.0 |

Cards 01–04 reuse the source post's own photographs, which is the first step of the sourcing
waterfall. None of the seven appears in any other EpicKor carousel — checked by
`review-cardnews.mjs`, which passed at 7/7 image cards with no duplicates.

## A correction made while writing the caption

The caption first said the island was **성압도**. That was a guess at the Hangul from the Latin
spelling, and it was wrong: the island is **선갑도**, in Jawol-myeon, Ongjin County, Incheon. Post 339
carried only the romanisation, so the Hangul has been added there too.

Korean coverage also describes 선갑도 as having no regularly resident population, which sits slightly
differently from the post's "roughly four residents" — both point the same way, since neither
supports visiting, but the caption now states the ferry and residency facts rather than a count.

## Rejected
- **Photographs of the game sets, the doll, or the glass bridge.** They exist as press and promotional
  stills, and they are the one thing this carousel exists to say you cannot go and see. Putting one on
  a card about real locations would contradict the carousel's whole premise.
- **`Pagoda Park in Seoul, Corea.jpg`** and the other historical Tapgol Park images — accurate to the
  place, wrong to the claim. The card is about a Season 2 scene shot recently; a 1930s photograph
  would misdate it.
- **Generic Han River images** for card 06. The card names Seogang Bridge, so the photograph has to be
  that bridge, not the river it crosses.
