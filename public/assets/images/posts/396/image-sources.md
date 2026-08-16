# Image sources — Blog 396 (Anua Heartleaf 77 toner)

Both images from **Anua's own US store feed** (`anua.us/products.json` — the store is Shopify,
the same public route recorded in FACTS.md that produced the Beauty of Joseon, Bodyfriend and
COSRX images). Retrieved 2026-08-16. Seven official frames were pulled and viewed on a contact
sheet before selection.

## 1. `anua-heartleaf-77-toner-bottle.jpg` (hero, ogImage)

- **Source:** Anua US official store, product `Heartleaf 77 Soothing Toner` (US list $23.00),
  feed image index 0.
- **Original:** 2000x2000. Delivered 1000x1000, **21 KB**.
- **What it shows, verified:** the clear bottle upright on plain white, label reading
  `Anua 77+` and `HEARTLEAF 77+ HYALURON` — zero marketing copy in frame.
- **Why it is the hero:** clean packshot of the exact product, and the visible `77+ HYALURON`
  label lets the caption explain the renewed-formula naming that confuses buyers comparing
  listings.

## 2. `anua-heartleaf-77-ingredient-list.jpg`

- **Source:** same feed, index 6 — Anua's ingredient-list disclosure card.
- **Original:** 2000x2000. Delivered 1000x1000, **87 KB**.
- **What it shows:** the INCI ingredient list, first line
  `Heartleaf Flower/Leaf/Stem Extract (77%)`, followed by purified water.
- **Why this text card is acceptable when the others were rejected:** an ingredient list is a
  **regulated disclosure, not a claim** — ingredient order by concentration is law, not
  marketing. The article's central factual point is that the 77% is the formula's base rather
  than garnish, and this card is the primary evidence for that sentence. It is used as a
  document exhibit, captioned as such — the same logic as post 385's coverage-spec image.

## Rejected — all viewed on the contact sheet first

- **`t3` — "Significant Decrease In Sebum Amount / 49.55% After 2 Weeks"** and
  **`t2` — "100% agreed the product helped soothe"**: manufacturer efficacy-test cards.
  Publishing them would import quantified efficacy claims this article does not verify —
  the same reasoning that rejected the COSRX infographic on post 395.
- **`t1`, `t4`** — product cards with claim copy ("Hydrates and calms irritated, sensitive
  skin") over the bottle; weaker versions of the same problem.
- **`t5`** — a model applying the toner; a person selling testimonial warmth, not needed.

## Checks run

- **Cross-post uniqueness:** `anua` appears in no other post's `image-sources.md`; post 160
  mentions the brand's sunscreen but carries no Anua imagery. First use of both.
- **Size:** 21 + 87 = **108 KB** for the post.
- **Captions:** written after viewing; the ingredient-card caption explicitly names it as the
  ingredient list, not a photograph.
- `npm run audit:image-context -- --slug 396`: 0 critical / 0 high / 0 medium.

## Gap worth noting

No openly licensed photograph of **the plant itself** — 어성초 growing, or the dried herb —
appears in the manufacturer feed, and Commons was not searched this pass since the two
manufacturer frames carried the article. A real photo of *Houttuynia cordata* in a Korean
setting would strengthen the folk-medicine section if this post is ever refreshed; the plant
is common enough in Korea that any summer field walk could produce one.
