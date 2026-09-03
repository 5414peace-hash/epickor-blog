# Card news 2026-09-03_438 — image sources

Seven photographs, one per card, no path repeated. Three come from the source post; four were
sourced for this carousel and checked against the used-ID list before download.

| Card | File | What is in frame | Source | Licence |
|---|---|---|---|---|
| 01 | `stainless-pot-butane-stove-soju.jpg` | Shallow two-handled stainless pot of red stew on a portable butane burner, two 새로 soju bottles behind | Pexels `15622966`, 세훈 예 | Pexels licence |
| 02 | `yangeun-naembi-gold-pot.jpg` | **Gold anodised 양은냄비** — gold body and lid, two side handles, black knob, dark ground | `commons.wikimedia.org` `File:Yangeun-naembi_2.jpg` | **CC BY 2.0** — The Marmot |
| 03 | `rabokki-in-metal-pot.jpg` | Rabokki — rice cakes and ramyun in red broth — in a plain metal pot | Post 438 → Pexels `32196399`, Theodore Nguyen | Pexels licence |
| 04 | `kimchi-ramyun-in-pot.jpg` | Kimchi ramyun cooking in a metal pot, Korean noodle packet behind | Post 438 → Pexels `8836444`, makafood | Pexels licence |
| 05 | `kimchi-bowl-tongs.jpg` | Baechu kimchi in a brown ceramic bowl with metal tongs | Pexels `8956770`, makafood | Pexels licence |
| 06 | `metal-pot-and-ttukbaegi.jpg` | Korean table: shallow metal pot of stew beside a brown earthenware ttukbaegi, Korean spoon and chopsticks | Pexels `15622968`, 세훈 예 | Pexels licence |
| 07 | `korean-restaurant-metal-griddle.jpg` | Korean restaurant table, square stainless griddle of seafood and glass noodles, banchan and glasses | Pexels `8954072`, makafood | Pexels licence |

## The subject gate decided the mapping, not the topic

The 2026-08-03 rule — **a card that names a product must show that product** — is what set which
photograph went where, and it forced one change during production.

Card 05 was first drafted as **김치찌개**, because that is the dish with the top reading (9.86 mg/kg).
The available photograph is **kimchi in a bowl**, not the stew. Rather than caption a banchan bowl as
a stew, the card's named subject was changed to **김치** and the jjigae figure moved into the body
text where it belongs. The photograph now matches the name on the card exactly.

**The review script caught a second one.** `review-cardnews.mjs` failed card 02 because its
`image_label` did not name the product the card names. The label was accurate but generic
("a hammered-finish metal pot..."). The photograph genuinely is a 양은냄비 — it is 국립국어원's
reference image for that headword — so the label was rewritten to say so. **The fix was to make the
label name the object, not to weaken the card.** *(Superseded: that photograph was itself wrong — see
"Card 02 was corrected" at the end.)*

## Rejections

- **Pexels `9508457`** — "instant noodles cooking outdoors on a portable camping stove." It is a
  titanium camping pot and nothing in frame is Korean. A card naming 양은냄비 cannot run it.
- **Pexels `5059930`** — Pexels calls it "a couple enjoys steaming street food in a vibrant Seoul
  market," and it is Korea, but the frame is **black and white** and the subjects are an **elderly
  couple at a market stall**. Wrong register for this deck. (Rejected for blog 249 the same day, for
  a different reason — the alt text keeps promising things the file does not deliver.)

**Cross-carousel uniqueness:** all four newly sourced IDs were checked against every
`image-sources.md` under `posts/`, `business/` and `cardnews/` before download — 264 IDs already in
use, none of these among them. The three post-owned files are used here for **their own** post's
carousel, which the reuse rule permits; none appears in another carousel.

## Renderer note — `pot-stamp`

New visual system for this batch (`.claude/skills/cardnews/scripts/render-potstamp.py`): a brushed
steel plate, the way the underside of a pot carries its material and capacity stamped into it. Copy
sits on the plate rather than on the photograph, so images run at **0.84–0.92 opacity** with no dark
veil — the CLAUDE.md 2026-07-20 warning about the house default burying food does not apply here.

**Three defects found only by opening the PNGs, all fixed:**
1. `rich()` handled `**bold**` but not single-asterisk italics, so card 02 printed
   `*Western silver*` with its asterisks visible.
2. Plate bottom padding of 40px let a three-line `sub` collide with the SWIPE / EPICKOR.COM footer on
   cards 05 and 07. Raised to 62px.
3. The cover plate at `top:50%` sat exactly over the pot — the subject of the whole carousel was
   hidden behind the headline. Moved to `top:41%`, which keeps card 01's text inside the Instagram
   grid safe area while letting the pot show below it.

**Visual Fit Score: average 98, lowest card 97** (01: 98 · 02: 99 · 03: 97 · 04: 99 · 05: 98 ·
06: 98 · 07: 97). Structural gate `review-cardnews.mjs` PASS, 7/7 image cards, 0 consecutive
image-free cards.

## ⚠️ Card 02 was corrected after the representative reviewed it

The first render put a **silver** pot on the card that names 양은냄비. **양은냄비 is gold** — that is
how anyone in Korea recognises one — so the card named a product and showed something else, which is
exactly the failure the 2026-08-03 rule exists to stop.

**The structural gate could not catch it.** `review-cardnews.mjs` compares the card's name against the
`image_label`, and the label honestly said "aluminium 양은냄비". Both name and label were the right
words; the *photograph* was the wrong object. **A label check verifies wording, not colour or
identity — only opening the file does that, and the file has to be judged against what the reader
already knows the thing looks like.**

**It also inverted the card's argument.** The card says *the name says nickel silver, the pot is
aluminium*. A silver pot visually confirms the wrong name. The gold pot is what makes the sentence
land.

Fixed by sourcing `File:Yangeun-naembi 2.jpg` from Commons (CC BY 2.0, The Marmot) — found via a
Commons **API search on the romanised Korean term**, which is what the original pass never ran. The
source is cropped from the top (1015×1016 → 1015×716) because the square original left the pot in the
lower half, where the steel plate covered it. Blog 438's hero was replaced with the same photograph
and its sourcing note corrected; that post had inherited the same silver pot.
