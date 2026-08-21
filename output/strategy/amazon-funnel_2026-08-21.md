# Amazon funnel — diagnosis and repair, 2026-08-21

The previous Associates account was closed on 2026-07-27 for failing to produce three
qualifying sales in 180 days. The response at the time was to reapply and retag 975 links.
**Nobody diagnosed why the links did not earn.** The same 180-day clock is now running on
`epickor-20` and expires **2027-01-23**. This is that diagnosis.

## Where the chain actually breaks

Measured against a GSC page-level pull for 2026-05-24 → 2026-08-19 (462 pages, 1,871 clicks,
446,526 impressions — the "348 clicks per quarter" figure still quoted in places is from
2026-07-24 and is badly stale; weekly clicks tripled over the summer).

| Step | State |
|---|---|
| Impression → site visit | Fine. 1,871 clicks in 88 days, growing |
| Does the page carry a link | Fine. **325 of the 327** trafficked post pages do |
| Is it placed well | Fine. Top pages have two CTA boxes, first link 7–20% into the body |
| **What does it link to** | **This is the break** |

## The break, quantified

- 1,403 Amazon links across the site.
- The **20 most-placed targets account for 41% of all placements**.
- The top ten are **all keyword searches, not products**. `korea travel essentials` was on
  **50 posts**. A target used on 50 unrelated articles is filler by definition.
- A search link lands the reader on an Amazon results page — no product, no price, no picture.
  They have to start shopping from nothing.

And a second, separate failure: the **newest product posts never used the product database.**
Thirteen recent posts carried 32 search links and **zero** product links, while
`content/data/amazon-links.json` already held 126 curated products, 89 with real ASINs. This is
a process hole, not legacy debt — it would have repeated on every future post.

## Verification method

Amazon returns 503 to automated fetches, so ASINs cannot be confirmed by fetching. A
**domain-restricted web search (`allowed_domains: ["amazon.com"]`) returns real listings with
ASINs and full titles**, which is enough to verify that a product exists and is the right one.
No representative login was needed. Record this — it is the difference between "we cannot fix
this without Associates Central" and "we can fix it now."

## What was changed

**Stage 1 — the 13 recent product posts.** 0 product links → 19.

| Post | Now links |
|---|---|
| 405 오징어땅콩 | Orion Peanut & Squid Ball, 98g × 7 |
| 411 카스타드 | **both Orion and Lotte** — the article's own comparison |
| 412 찰떡파이 | Cheongwoo's, the company in the patent case the article describes |
| 413 빠다코코낫 | Lotte Butter Coconut, the actual product |
| 414 자갈치 | Nongshim Tako Chips — the bag in the article's own photograph |
| 416 참붕어빵 | a real 참붕어빵, 8 pieces |
| 417 꼬깔콘 | Lotte Kkokkalcorn original |
| 344 박카스 | Dong-A Bacchus-D, plus Vita 500 as the named rival |
| 347 비타500 | Vita 500, 10 bottles |
| 402 얼음컵 | Maxim Mocha Gold — the stick you actually pour into the cup |

**Stage 2 — the top-traffic pages** (the top 25 carry ~70% of all clicks).

| Post | Clicks | Was | Now |
|---|---:|---|---|
| 198 워터밤 | 152 | `korea travel essentials` | waterproof phone pouch — the article's own top pick |
| 197 보령머드 | 13 | same | same |
| 171 편의점 아침 | 64 | `kewpie japanese mayonnaise` | Kewpie 12oz × 2 |
| 153 이삭토스트 | 20 | same | same |
| 167 K-드라마 | 85 | `korean snack` | 50-piece Korean snack box |
| 194 선물 예절 | 20 | `korean snack` | same box, as the gift the article is about |
| 218 다이소 | 56 | 5 generic searches | Korea plug adapter + 10,000mAh power bank |
| 140 화장실 | 25 | `korea travel essentials` | Korea plug adapter, with the 220V/Type F reason stated |
| 174 지하철 예절 | 14 | same | same |
| 141 한강 러닝 | 11 | `portable power bank travel` | Anker 10,000mAh |
| 233 KBO | 12 | same | same |
| 275 용산 | 40 | same | same, and the copy now uses it as a price anchor |
| 363 다시다 | 13 | `dashida korean beef stock` | Dasida **beef** 500g — the title says beef |
| 006 자전거 도난 | 20 | two bike-lock searches | Kryptonite New York U-lock + Keeper 712 chain |

`006` is the clearest illustration of the whole problem: a post about bicycle theft linking
"heavy duty bike lock" as a **search**. The intent was perfect and the product was missing.

Twelve verified ASINs were added to `amazon-links.json` (126 → 138) so the next product post
has somewhere to look.

## Low-intent pages — CORRECTED 2026-08-21, same day

**An earlier version of this document said these pages were "not worth further link work" and
that their clicks "should not be reported as a monetisation opportunity." The representative
rejected that, and was right.** The rule already in CLAUDE.md says the opposite: *"If no perfect
product exists, use the closest useful Amazon link or search link and explain why it is still
worth comparing."* There is no option that reads "leave it empty." As the representative put it,
putting a representative Korean item, a travel product, or a light impulse buy — cosmetics, a
book, snacks — is a hundred times better than putting nothing.

The genuine finding underneath was still real, but it was **misdiagnosis, not absence**: these
pages carried badly matched products, and treating them as hopeless was the wrong conclusion.

| Post | Clicks | Was | Now |
|---|---:|---|---|
| `090` 아저씨 뜻 | **161** — the site's #1 page | Topline pushed a Hangul **writing workbook**, a study commitment, at someone who looked up one word | Topline is now a **50-piece Korean snack box** — the lowest-commitment yes for a curious reader. The workbook stays on the CTA that actually argues for it, and The Kpop Dictionary stays where it fits best |
| `082` SKY 대학 | 42 | Same workbook on the topline | **Lonely Planet Korean phrasebook** — lighter, and closer to what a Korea-curious reader actually buys |
| `210` 호칭 | 12 | Two keyword searches, no product at all | Lonely Planet phrasebook + The Kpop Dictionary. Forms of address *is* a language question; the products were simply missing |
| `274` 롤파크 | 54 | `gaming headset` and `league of legends merch` searches | **HyperX Cloud II** and **Riot's official LoL figures.** The CTA copy here was already sound — "if the tickets are gone the LCK broadcast is free and the difference is mostly audio", and "know what a piece costs before the venue shop" — only the products were missing |

Together these carry **269 clicks, 15% of site traffic**. Low purchase intent is not zero
intent, and the fix is a lighter, better-matched product, not a shrug.

## Three posts had no Amazon link at all — fixed

A full scan found **three posts carrying no affiliate link of any kind**, which is a direct
breach of the standing rule:

- `387` Korean highballs — the article even has a section titled *What to Actually Buy* with no
  link in it. Now carries Libbey highball glasses, framed on the article's own argument: Korea
  taxes the canned version as a spirit, and building it at home escapes that maths.
- `076` martial law crisis and `077` the Dongduk dispute — political and social conflict pieces
  where a large CTA box would read as monetising the conflict. Both now carry a **single quiet
  further-reading line** to an English introduction to Korean politics, with the disclosure
  inline. That is the tasteful version of the rule, not an exemption from it.

Site-wide: **0 posts now have no Amazon link.**

## Stage 3 — the top-100 pass, 2026-08-21

The representative's correction ("something buyable beats nothing") changed the value of this
work. The long tail was previously described as low-value because those pages have few clicks;
what the correction made clear is that the *placement* is already there on every one of them —
only the destination is wrong. Fixing a destination is cheap.

Scope: the **top 100 pages by clicks** for 2026-05-24 → 2026-08-19.

| | Before | After |
|---|---:|---:|
| Keyword-search links in the top 100 | **222** | **0** |
| Distinct filler search terms | 95 | 0 |
| Posts in the top 100 with **no** product link | **48** | **0** |
| Product (`/dp/`) links across the top 100 | ~145 | **328** |

63 posts were edited. Every one still passes the reviewer at 100/100, and the site builds.

**Where the filler was concentrated.** Twelve terms carried half of all 222 links:
`korean culture history book` (15), `korean phrasebook` (14), `kpop kdrama fan goods` (13),
`travel document organizer` (10), `travel card pouch` (9), `korean snack` (9),
`korean food starter pack` (8), `digital luggage scale travel` (7), `korea travel essentials` (7),
`packing tape mailers shipping supplies` (5), `korean snack box` (5), `travel tissue packs` (4).
Each is now one named, verified product.

**49 verified ASINs were added to `amazon-links.json`** (138 → 187, of which 150 now carry a real
ASIN). Each carries `usedBy` and a `verified` stamp, so the next post has somewhere to look
instead of inventing another search string.

### Substitutions that were editorial decisions, not SKU swaps

Several of these pages were not "hard to monetise" — they were pointed at the wrong thing.

- `043` Jang Wonyoung and `025` Kim Go-eun both linked **fashion sunglasses**. What fans copy from
  either is skin, not eyewear. Now COSRX snail essence and Torriden Dive-In respectively.
- `170` and `133` PC bang linked **korean snack**. The single most-ordered item at a PC bang
  counter is instant ramyeon; both now link Shin Ramyun.
- `137` Korean winter padding linked **black puffer coat** — an item nobody buys sight-unseen by
  ASIN. Now Korean-made hand warmers, which is the half of the Korean winter system a visitor
  actually can buy ahead.
- `227` and `020` linked **packing tape and mailers** for shipping purchases home. For anything
  under ~20kg a folding duffel flown as extra checked baggage beats EMS, so that is the link now.
- `298` Seoul stationery linked **reading journals and book tabs**, which are internationally
  generic. The one genuinely Korean item on a Hottracks shelf is the Monami 153.
- `015` linked a **USB-C car charger**; a power bank does the same job and leaves the car with you.
- `213` no-trash-cans said in its own copy *"we link the category and not a product"* — that
  sentence was written to excuse a search link, and it is gone.

### Second-pass repairs

The rule recorded in the previous stage — **a link change must re-read its own paragraph** — caught
real damage again. A first pass produced 15 broken or redundant sentences: `255` lost its verb
("…and Korean seaweed snacks before buying random souvenirs"), `258` lost its clause ending,
`134`/`289`/`319`/`345`/`379`/`383` each said the same thing twice on either side of the swap, and
`350` orphaned a headlamp with no product behind it. All were found by stripping HTML from the diff
and reading the result as prose, which is now the standard check for this kind of pass.

### Compliance scan, separate from the click list

A site-wide sweep of all **1,375** Amazon anchors found **2** that were missing `target="_blank"`
and the full `rel` attribute entirely — `334` (pet funerals) and `336` (samgak kimbap), neither in
the top 100. Both were breaches of the standing placement rule that nothing in the click-ranked
work would have surfaced. Site-wide malformed anchors: **0**.

### Still undone

**811 keyword-search links remain across the ~230 posts below the top 100.** They were left
deliberately: the same work costs the same per post and returns far less. The 49-product database
now makes that pass much faster whenever it is worth doing.

## What this means for the 180-day clock

Amazon works on the **product lane** — the food-specific posts — and that lane is three weeks
old and has not ranked yet. The three qualifying sales will come from those posts maturing,
not from repairing legacy links. Repairing the links is still correct, because it is cheap and
it is the only lever available before the lane matures, but it should not be mistaken for the
mechanism.

## Left undone, deliberately

- **~45 posts still carry `korea travel essentials`, 41 carry `portable power bank travel`,
  44 carry `korean culture history book`.** These are the long tail below the top 25. They were
  left because each one needs its sentence rewritten, not just its URL swapped — see below.
- `travel card pouch` / `travel document organizer` remain on `218`, `223`, `227`, `255`, `275`.
  These are weak generic products where the honest fix is a better *idea* for the CTA, not a
  better SKU. That is a content decision, not a link swap.
- `227` shipping has seven searches and no products; the categories (luggage scale, mailers)
  are apt but low-traffic.

## Rule learned the hard way, twice, in one session

**Swapping a link without re-reading the sentence around it is its own bug.** Two defects were
created and caught inside this same task:

- `344`'s button read "Bacchus-D on Amazon" while pointing at a travel-essentials search — the
  anchor was updated and the URL was not.
- `415` was still talking about reading Korean food labels above a link to potato chips — the
  URL was updated and the copy was not.

Both directions of the same mistake. Any link change must re-read its own paragraph.

## Substitutes must say they are substitutes

Three products genuinely are not sold on Amazon: **자유시간, 구운감자, and Orion's own 참붕어빵
box.** Those posts now link the closest real thing and say so in the first sentence of the CTA.
A substitute presented as the product is worse than no link at all.
