# Image Sources - Blog 242

Post: Seoul Vintage Shopping: What Dongmyo Costs and When to Go

## 2026-09-03 refresh — three generic stock photos replaced with the actual market

The article names Dongmyo in its title and spends half its length on that one market, and until
today not one of its four images was taken there. All four were Pexels stock: a Seoul street
market, a wholesale alley, a shopping street, a boutique lane. Each was Korea-real and none was
the subject.

The fix came from a **Wikimedia Commons search on the romanised Korean name** (`dongmyo market`),
the method established on 2026-09-03 for the 양은냄비 card news. It returns **twelve photographs of
Dongmyo Flea Market**, all by the same contributor, all CC BY-SA 4.0 and all 4032 × 3024.

**Two of the twelve were already spoken for and were avoided:** `Dongmyo Flea Market 01.jpg` is in
Blog `053`, and Blog `129` uses the antique-stall frame (`05`/`06`). Checked before selecting, per
the cross-post uniqueness rule.

## Selected Images

| File | Source | Licence | What is in frame |
|---|---|---|---|
| `dongmyo-vintage-street.jpg` | [File:Dongmyo Flea Market 08.jpg](https://commons.wikimedia.org/wiki/File:Dongmyo_Flea_Market_08.jpg) | CC BY-SA 4.0 — Seefooddiet | Clothing rails standing on the live roadway under a yellow **동묘의 빈티지** sign, 30km/h road marking a metre away. Hero and ogImage |
| `dongmyo-stall-prices.jpg` | [File:Dongmyo Flea Market 10.jpg](https://commons.wikimedia.org/wiki/File:Dongmyo_Flea_Market_10.jpg) — **cropped**, see below | CC BY-SA 4.0 — Seefooddiet | Stall tables of folded trousers with handwritten price cards, shop sign **구제나라** |
| `seoul-vintage-clothing-racks.jpg` | Pexels [photo 28916457](https://www.pexels.com/photo/28916457/) | Pexels licence | Young Koreans in streetwear on a busy Seoul street. Hongdae section. **Retained from the previous version** |
| `dongmyo-antique-pile.jpg` | [File:Dongmyo Flea Market Jan 2024 08.jpg](https://commons.wikimedia.org/wiki/File:Dongmyo_Flea_Market_Jan_2024_08.jpg) | CC BY-SA 4.0 — Seefooddiet | Unsorted brass and ceramic stock — Buddha figures, a brass fish, gongs, bowls, portrait plaques |

Photographs taken 2024-07-17 (`08`, `10`) and 2024-01-11 (`Jan 2024 08`). The market's stall
layout and price bands are unchanged since; the article dates its price claims to September 2026
and attributes them to the cards visible in the file.

## One sign was NOT legible, and the caption says nothing about it

The first draft of the hero caption also translated the tall blue sign behind the stalls as
**구제불패** ("secondhand never loses"), read off the 380px contact sheet. Enlarged from the
4032px original it is **not readable**: a utility pole and four overhead cables cross it, and only
the first character is unambiguous. The claim was removed before publish.

This is the 양은냄비 failure in a different costume — a plausible reading of a photograph, asserted
in a caption where a reader who can read Korean would check it. **Crop and enlarge every piece of
text before quoting it, and drop the ones the pixels do not support.** The yellow sign was
enlarged the same way and is unambiguous, so it stayed.

## The crop, and why the prices drove it

`dongmyo-stall-prices.jpg` is the **only derivative crop** in this post, and it exists because the
image has a job beyond atmosphere: the handwritten cards are the article's price evidence.

At the full frame scaled to 1400px the cards were a few pixels tall and unreadable, which would
have made the caption a claim rather than something the reader can check. Cropping to
`x 0.46–0.86, y 0.36–0.86` of the original and rendering at 1180px makes them legible at article
width. **Read at full resolution before cropping**, and carried into the body text:

- **₩13,000**, **₩10,000**, **₩8,000** on cardboard tables of folded trousers
- **₩5,000** on two hanging cards over the rails
- a yellow tag reading **메이커바지 ₩8,000** — "brand-name trousers"
- shop signage **구제나라** ("Guje Land") and **수입과자 · 건강식품 · 수입식품 · 선물셋트**

This is the same technique used for the sesame-oil mill window in Blog `439`: enlarge the text
that is already in the photograph and quote it, rather than describing the picture in general terms.

## What the antique frame actually contains

`dongmyo-antique-pile.jpg` was chosen for atmosphere and turned out to carry the article's best
single detail, which only appeared on enlargement. Two bronze commemorative plaques are stacked in
the pile:

- The front one is inscribed **박정희 5.6.7.8.9대 대통령** — Park Chung-hee, fifth through ninth
  president. Read directly off the casting at full resolution; unambiguous.
- The one leaning behind it reads **제16대 대통** before a gong cuts the line off. **The name is not
  visible**, so the caption gives the ordinal and identifies the sixteenth president from public
  record rather than claiming to have read it.

Also in frame: seated and standing Buddha figures, a many-armed deity, a metre-long brass carp, two
징 (gongs), brass bowls and a bell, a wooden mask, and a Nativity figurine. **Enlarging a photo you
picked for mood is worth doing before you write its caption** — the pile was the point, but the
plaques are what make the point land.

## Removed in this pass

| File | Why |
|---|---|
| `seoul-clothing-market.jpg` | Generic Pexels Seoul market. Was the hero and ogImage for an article about a specific named market it did not show |
| `seoul-outdoor-shop.jpg` | A covered **wholesale** alley (경상도 상회, 연진상회, 전주상회). Its caption called it "the flea-market side of Seoul" — the photo showed a different kind of market than the sentence claimed |
| `seoul-shopping-alley-boutiques.jpg` | Boutique alley sitting under "How To Check Condition", which is about inspecting garments. Atmosphere only |

## Cross-post uniqueness

`npm run audit:image-uniqueness -- --slug 242` passed before the change (0 duplicate groups). The
three new files are Commons, not Pexels, so the ID-based audit does not cover them; they were
checked by hand against `053` and `129`, the only other posts in the repo using this Commons
category. The retained Pexels file (28916457) was verified unique site-wide on 2026-07-25.

## Earlier history

- **2026-07-25** — `seoul-vintage-clothing-racks.jpg` was Pexels 31783000 until it was found to
  duplicate Blog `129`; replaced with 28916457. `seoul-outdoor-shop.jpg` was Pexels 29562546, a
  three-way duplicate with Blogs `194` and `253`; its first replacement (37785270) turned out to be
  in Blog `194` as well, so it was replaced a second time. Both of those files are now gone.
- **2026-06-27** — original selection. Two generic thrift-store interiors were swapped for Seoul
  street images after the representative asked whether the images read as Korean. They did read as
  Korean. **They just never read as Dongmyo**, which is the gap this refresh closed.
