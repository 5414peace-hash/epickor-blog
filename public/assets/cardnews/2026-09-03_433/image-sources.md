# Card news 2026-09-03_433 — image sources

Seven photographs, one per card, no path repeated. Four come from the source post; three were
sourced for this carousel from Wikimedia Commons.

| Card | File | What is in frame | Source | Licence |
|---|---|---|---|---|
| 01 | `two-jjigae-ttukbaegi.jpg` | Two dark earthenware ttukbaegi on wooden trivets, the right one still bubbling off the heat | Post 433 → `File:Korean_stew-Two_jjigae_in_ttukbaegi-01.jpg` | **CC BY-SA 3.0** — Junho Jung |
| 02 | `dolsot-bare-stone-pot.jpg` | An **empty grey-black stone dolsot** with a steel rim band, steaming on a wooden trivet | `File:Dolsot.jpg` | **CC BY-SA 2.0 KR** — 국립국어원 |
| 03 | `sundubu-jjigae-bubbling.jpg` | Sundubu-jjigae bubbling with a raw egg dropped in at the table | Post 433 → `File:Korean_stew-Sundubu_jjigae-05.jpg` | **CC BY-SA 2.0** — titanium22 |
| 04 | `doenjang-jjigae-ttukbaegi.jpg` | Doenjang-jjigae in a black earthenware ttukbaegi, tofu and chillies on a board beside it | `File:Doenjang-jjigae_4.jpg` | **CC0** — 이동원 |
| 05 | `ttukbaegi-bulgogi.jpg` | Ttukbaegi bulgogi — brothy bulgogi with vegetables in a dark clay pot | Post 433 → `File:Ttukbaegi-bulgogi.jpg` | **CC0** — hyun chun kim |
| 06 | `obunjagi-ttukbaegi.jpg` | Obunjagi ttukbaegi — Jeju abalone stew with shrimp and clams in a black clay pot | `File:Korean_cuisine-Jeju_Island-Obunjagi_ttukbaegi-02.jpg` | **CC BY-SA 3.0** — 아침꿀물 (Flickr) |
| 07 | `dolsot-bibimbap.jpg` | Dolsot bibimbap — rice, vegetables and egg yolk in a grey stone bowl | Post 433 → `File:Dolsot-bibimbap.jpg` | **CC BY 2.0** — Sous Chef |

**All three new files came from a Commons API search on romanised Korean** (`ttukbaegi`, `dolsot`),
the method established earlier the same day when an English-descriptor search wrongly concluded that
no gold 양은냄비 existed. `File:Dolsot.jpg` is the find that matters here: an **empty** stone pot, so
card 02 can show the material the card is talking about rather than a dish sitting in it.

## What the review script caught, and why it was right twice

`review-cardnews.mjs` failed this deck on two separate passes, and both were real.

**First pass — I had used `name_ko` for concepts.** Card 04 was named **숨구멍** (the pores) and card
05 **쌀뜨물** (rice water). Neither is a thing you can photograph in this deck, so the gate correctly
reported that the card named something its image did not show. **The name field is for the object in
the frame, not for the idea the card teaches.** Card 04 was renamed to **뚝배기**, which is what the
photograph actually contains; card 05 dropped its name block entirely, and 쌀뜨물 stayed in the body
where it belongs.

**Second pass — the label was in the wrong script.** Card 04 then named 뚝배기 while its label said
"black earthenware **ttukbaegi**". Same object, different alphabet, so the string comparison still
failed. Added the hangul to the label. **This one is a checker limitation rather than a content
error, and it is worth knowing: the gate matches strings, so a label has to carry the name in the
same script the card uses.**

## Rejections

- **`File:Gyeranjjim.jpg`** — steamed egg is exactly what the article says a ttukbaegi is for, but the
  file is **740 × 493**, well under a 1080 card. Not upscaled.
- **`File:Ttukbaegi-spaghetti.jpg`** — real and Korean, but a novelty dish that would have argued
  against the deck's point about what the pot is for.

**Cross-carousel uniqueness:** the three new Commons files appear in no other post or carousel; the
four post-owned files are used here for their own post's carousel, which the reuse rule permits.

## Renderer

`pot-stamp` (`.claude/skills/cardnews/scripts/render-potstamp.py`), second deck in the kitchen batch
after 438. No changes needed — the italic, padding and cover-position fixes made during 438 carried
over cleanly.

**Visual Fit Score: average 98.6, lowest card 97** (01: 98 · 02: 100 · 03: 99 · 04: 98 · 05: 97 ·
06: 98 · 07: 100). Card 05 loses points honestly: its photograph is bulgogi while the copy is about
washing, so it is the one card whose image supports the deck rather than the sentence.
Structural gate PASS, 7/7 image cards, 0 consecutive image-free cards.
