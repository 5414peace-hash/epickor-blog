# Blog 438 — Korean Ramen Pots (aluminium safety) — image sources

One Korean institutional photograph, two Pexels photographs, two EpicKor charts.

| File | What it shows | Source | Licence / credit |
|---|---|---|---|
| `yangeun-naembi-gold-pot.jpg` | **Gold anodised aluminium 양은냄비** — gold body, gold lid, two side handles, black knob, dark ground | `commons.wikimedia.org/wiki/File:Yangeun-naembi_2.jpg` | **CC BY 2.0** — The Marmot |
| `kimchi-ramyun-simmering-in-pot.jpg` | Kimchi ramyun cooking in a metal pot, Korean noodle packet behind | `pexels.com/photo/close-up-photo-of-a-pot-with-noodles-and-kimchi-8836444/` | Pexels licence — makafood, `photos/8836444` |
| `rabokki-in-aluminium-pot.jpg` | Rabokki — rice cakes and ramyun in red broth — in a plain metal pot | `pexels.com/photo/delicious-korean-tteokbokki-and-ramen-dish-32196399/` | Pexels licence — Theodore Nguyen, `photos/32196399` |
| `aluminium-pot-leaching-measured.jpg` | EpicKor chart — coated vs uncoated leaching, and the by-dish figures | Made for this post | Study cited in the article's Sources |
| `aluminium-pot-care-rules.jpg` | EpicKor chart — the three care rules the numbers depend on | Made for this post | Korean care guidance, cited in Sources |

**The hero is an institutional reference photo, which is the right register for this article.**
국립국어원's file is the 양은냄비 as a *defined object* rather than as a mood — appropriate for a piece
whose first argument is that the name describes a metal the pot no longer contains. The two Pexels
photographs then show the pot doing the two things the study measured: kimchi with acid and salt, and
a gochujang-based broth.

**⚠️ The cross-post uniqueness check rejected three of four first-choice photos.** Pexels `32196405`
is already in post 299, `8915969` and `35064871` in 323, and `32196404` in 048 — all returned by the
obvious "korean ramen pot" query, all unusable. **Filter the Pexels response against the used-ID list
before looking at any of them**; picking visually and then checking wastes the selection. The two
survivors here were found that way.

**⚠️ CORRECTED 2026-09-03 — the claim below was wrong, and the representative caught it.**

> ~~No gold/yellow pot exists in the licence-safe sources, and the article was retitled because of it.
> The draft title said "the yellow aluminium one"; Pexels has no Korean gold anodised pot and Commons
> has one 양은냄비 file, which is silver.~~

**Commons has two gold ones**, `File:Yangeun-naembi 1.jpg` and `2.jpg`, CC BY 2.0 by The Marmot,
about 1015px square. The original sourcing pass found only `File:Nickel_silver_pot.jpg` — a **silver**
pot — and concluded the gold one did not exist. It did. The hero and the card-news deck both ran a
silver pot on a page whose subject is the gold one, until the representative pointed out that
**양은냄비 is yellow-gold**, which every Korean knows on sight.

**Why the first search missed it:** it ran on English descriptors and category browsing
(`Sesame oil`-style category walks, `korean aluminium pot`). The file is titled with the **romanised
Korean**, so it only surfaces on a Commons **API search for `yangeun naembi`**. **Search Commons by
romanised Korean term through the API before concluding a Korean object is unphotographed.**

**The error also worked against the argument.** The section's point is *the name says nickel silver,
the metal is aluminium* — and a silver pot visually agrees with the wrong name. The gold pot makes
the sentence land. A wrong image is not only inaccurate here; it was arguing the opposite case.

The title stays **"the aluminium one"** — that is a query match (`korean aluminum pot safe`), not a
sourcing compromise, and the body now states the gold colour as the shop-floor identification cue.

`yangeun-naembi-aluminium-pot.jpg` (the 국립국어원 silver pot) **is left in the folder unreferenced.**
It is a legitimate CC BY-SA 2.0 KR reference photo of the older silver form and may be worth a second
image later; it is not deleted, and it is not currently used by the post.

**Chart generator notes (two new traps, both caught only by opening the JPEG):**
- **Do not pre-split a bullet into lines.** Each array element is wrapped independently, so two
  near-full-width strings wrap again and leave orphan fragments — the first render produced lines
  reading just "film off" and "soon as". Pass one short sentence per element.
- **The heading does not wrap.** A heading long enough to reach the right edge simply touches it;
  shorten it rather than trusting the layout.

**Size:** 49 + 120 + 122 + chart + chart ≈ 500KB across five images.
