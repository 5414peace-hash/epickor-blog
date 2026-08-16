# Image sources — Blog 395 (COSRX Snail 96)

Both images are **manufacturer packshots of the exact product from COSRX's own store feed**
(`cosrx.com/products.json`, the same public Shopify route recorded in FACTS.md that produced
the Beauty of Joseon and Bodyfriend images). Retrieved 2026-08-16. The 0차 manufacturer step
was run first and produced 13 official frames to choose from.

## 1. `cosrx-snail-96-essence-bottle.jpg` (hero, ogImage)

- **Source:** COSRX official store, product `Advanced Snail 96 Mucin Power Essence`
  (US list $25.00), feed image index 10.
- **Original:** 800x1067. Delivered 800x1067, **20 KB**.
- **What it shows, verified on a contact sheet:** the 100ml bottle upright on plain white —
  white body, black pump cap, the yellow-and-black label legible.
- **Why it is the hero:** a clean packshot of the exact product, no marketing copy in frame.
  The caption's one editorial point — that the packaging has barely changed since 2014 —
  is verifiable against any old review photo.

## 2. `cosrx-snail-96-three-sizes.jpg`

- **Source:** same feed, image index 9 (`800x1067____231120` series).
- **Original:** 800x1067. Delivered 800x1067, **48 KB**.
- **What it shows:** the 100ml, 50ml and 30ml bottles lined up by height, each size labeled.
- **Why here:** it sits against the buying section and carries the article's most practical
  advice — start with the 30ml because texture decides this product — and the size-confusion
  warning (lookalike listings pricing the 50ml near the 100ml's price).

## Rejected — the interesting ones

- **The mucin-string shot** (feed index 1, `Snail96Essence_8.jpg`): the tipped bottle with
  strings of mucin dripping — the single most product-defining visual COSRX has. **Rejected
  because it is fused into an infographic**: "Key Ingredients / 96% ... ✓ Improves uneven skin
  tone ✓ Fades dark spots & Scars". Publishing it whole would import efficacy claims this
  article deliberately does not endorse (the article's whole honest-section argument is that
  mucin is *not* an active). A salvage crop was attempted at `left 368, 432x560` and **failed
  on inspection** — truncated text fragments ("nts", "ate(Mucin)", "n tone") entered the frame
  and read as broken. Recorded so the next session does not re-attempt the same crop.
- **"GLOBAL NO.1* ESSENCE / 800K SOLD!" and "13M SOLD!" cards** (indexes 0, and the Snail 92
  set) — asterisked superlative claims we have not verified; same import problem.
- **"No Snails are Harmed!" card** (index 7) — describes the mesh-and-dark-room harvesting the
  article covers, but as a manufacturer marketing card. The article states the method in its
  own prose with sourcing instead.
- **"Real Reviews" model card** (index 5) and the model-applying shot (index 6) — a person's
  face selling testimonial claims; not needed.
- **Snail 92 cream packshot** (`s92_0`) — clean and usable, but the article is about the
  essence; the cream appears only as a routine mention. Kept unused rather than padding.

## Checks run

- **Cross-post uniqueness:** `cosrx` appears in no other post's `image-sources.md`. First use.
- **Size:** 20 + 48 = **68 KB** — the lightest image set of the appliance-and-beauty run.
- **Captions:** written after viewing; each names only what is in frame.
- `npm run audit:image-context -- --slug 395` run before commit.

## Gap worth noting

The unused mucin-texture visual is the one that sells the product's identity. If COSRX ever
publishes the drip shot as a clean image without the infographic text — or if a hand-with-
essence texture photo can be taken — it would replace nothing and add the one thing this
post's images cannot show: what 96% mucin looks like in motion.
