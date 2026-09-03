# Image Sources - Blog 232

Post: K-Fashion Shopping in Seoul: The Flagship Addresses and When They Open

## 2026-09-04 refresh — same four photographs, rewritten captions

**No image was replaced, and that was the decision rather than the default.**

The article names five venues (Musinsa Megastore Seongsu, Haus Nowhere Seoul, Haus Dosan, Amomento
Hannam, Songzio's Galerie Noir) and the Blog Reference Image Standard says to use the exact subject
when a usable public image is reasonably available. It is not available here:

- **Wikimedia Commons has no photograph of any of the five buildings.** Searched by romanised
  Korean per the established method — `musinsa`, `haus dosan`, `haus nowhere`, `gentle monster`,
  `seongsu`, `apgujeong`, `ttukseom-ro`. `musinsa` returns pop-up event portraits of idols;
  `haus nowhere` returns two celebrity photographs from the September 2025 opening. Neither is the
  building, and this article explicitly warns readers against guides that use idol photos in place
  of naming a brand — using them here would contradict its own advice.
- **The 0차 manufacturer-site rule does not transfer.** That rule exists for *product
  identification* — a packshot of a specific SKU that stock libraries structurally do not carry.
  A retail interior is the brand's own creative asset for a retail-experience piece, which is
  weaker ground, so it was not taken.
- **One Commons candidate was rejected on subject.** `File:Seongsu-dong storefronts.jpg`
  (CC BY-SA 4.0, CartoonChess, 2022) is a genuine Seongsu backstreet, but the storefront in frame is
  **MYC CAFE** — a cafe. Adding it to a K-fashion article would have needed a caption explaining why
  a cafe is there, and a caption that explains away its image is a hard-reject signal.

So the four existing neighbourhood photographs stayed, and **the captions were rewritten to carry
route facts instead of mood.** That is where the refresh's value went:

| File | Old caption | New caption carries |
|---|---|---|
| `seongsu-evening-street.jpg` | "one of Seoul's concept-retail neighborhoods" | Both Seongsu addresses (성수이로 62, 뚝섬로 433) and the fifteen-minute walk between them |
| `garosu-gil-night.jpg` | "Garosu-gil shopping street at night" | That Garosu-gil is a walking street *between* stops, and the two flagships worth planning are ten minutes east |
| `cheongdam-fashion-street.jpg` | "useful context for Korea's designer lane" | Where Galerie Noir and Haus Dosan actually sit relative to it (압구정로42길 and 46길) |
| `hongdae-shopping-street.jpg` | "casual browsing, accessories, beauty" | Plus the opening-hours contrast — Hongdae opens and closes later than the Apgujeong houses |

A photograph of a street can do real work if the caption tells you what is on that street. None of
these did before.

## Used Images

- `seongsu-evening-street.jpg`
  - Source: Wikimedia Commons, [File:Evening street in Seongsu-dong.jpg](https://commons.wikimedia.org/wiki/File:Evening_street_in_Seongsu-dong.jpg)
  - Credit: CartoonChess / Wikimedia Commons, **CC BY-SA 4.0**, shot 2021-04-22
  - Use: hero and ogImage, Seongsu leg.
- `garosu-gil-night.jpg`
  - Source: Wikimedia Commons, [File:Garosu-gil at night.jpg](https://commons.wikimedia.org/wiki/File:Garosu-gil_at_night.jpg)
  - Use: Musinsa section, as the walking link between Apgujeong stops.
- `cheongdam-fashion-street.jpg`
  - Source: Wikimedia Commons, [File:Cheongdam Intersection.jpg](https://commons.wikimedia.org/wiki/File:Cheongdam_Intersection.jpg)
  - Use: Songzio section. Original file was re-saved as standard JPEG after a local viewer decode warning.
- `hongdae-shopping-street.jpg`
  - Source: Wikimedia Commons, [File:Street hongdae Seoul.jpg](https://commons.wikimedia.org/wiki/File:Street_hongdae_Seoul.jpg)
  - Use: neighbourhood route, Hongdae leg. Visible people are incidental street-scene figures.

Follow each Commons file page for its licence terms and attribution.

## File weights, and one that needed the long edge capped

`images.unoptimized: true` means the original bytes ship, so the working target is 150–250KB.
Two files were over: `hongdae-shopping-street.jpg` at 363KB and `garosu-gil-night.jpg` at 307KB.

**Capping width alone did nothing to the Hongdae file, because it is portrait: 1600 × 1708.** The
first pass looped over widths of 1500/1400/1280, none of which reduced a 1600-wide image enough to
matter, fell through to a re-encode of the full-size original, and produced **377KB — larger than
the 363KB it started at**, because the source had been saved with different chroma subsampling.
Capping the **long edge** instead fixed it. Final sizes:

| File | Before | After |
|---|---|---|
| `hongdae-shopping-street.jpg` | 1600 × 1708, 363KB | 1199 × 1280, 234KB |
| `garosu-gil-night.jpg` | 1600 × 1067, 307KB | 1500 × 1000, 234KB |
| `seongsu-evening-street.jpg` | 1600 × 1200, 249KB | 1400 × 1050, 227KB |
| `cheongdam-fashion-street.jpg` | 230KB | unchanged |

Folder total 921KB, under the 1MB-per-post guideline. **Resize on the long edge, not the width —
a tall image sails through a width cap untouched.**

## Unrelated fix found while restoring links

The pre-refresh version linked `/blog/162` as *"K-beauty skincare guide."* Blog `162` is
**"Korean Red Ginseng Guide: Benefits, Safety, and Buying Tips."** The label had been wrong since
publication. Relabelled correctly and moved into the Myeongdong/Hongdae paragraph, where ginseng is
an actual gift-shop purchase, rather than left as a skincare claim it never supported.

## Cross-post uniqueness

All four files are Commons rather than Pexels, so the ID-based audit does not cover them. Checked by
hand: none of the four Commons file names appears in any other post's `image-sources.md`.
