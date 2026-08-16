# Image sources — Blog 394 (Korean massage chairs / Bodyfriend)

Both images are **manufacturer packshots of the exact chairs the article names and prices**,
pulled from Bodyfriend's own US store feed. The 0차 manufacturer route was run first and
succeeded — same `products.json` route that worked for Beauty of Joseon (post 388), recorded
in FACTS.md on 2026-08-16.

## 1. `bodyfriend-falcon-signature.jpg` (hero, ogImage)

- **Source:** Bodyfriend US official store `bodyfriend.com`, product `FALCON SIGNATURE`
  (listed at $9,499.99), via the store's public `products.json` feed, retrieved 2026-08-16.
- **Original:** 3001x3001 JPEG. Delivered 1100x1100, **84 KB**.
- **What it shows, verified on a contact sheet:** the Falcon Signature in dark brown — quilted
  seat, wood-tone side panel, and the enclosed motorized leg boots at the base.
- **Why it is the hero:** it is the flagship line the article prices, and the caption points at
  the leg boots deliberately — they are the component the safety section is about, so the hero
  quietly sets up the article's most important passage.

## 2. `bodyfriend-pharaoh-neo.jpg`

- **Source:** same feed, product `Pharaoh NEO` (listed at $14,990.00), retrieved 2026-08-16.
- **Original:** 1417x1417 WebP. Delivered 1000x1000 JPEG, **102 KB**.
- **What it shows:** the Pharaoh NEO in cream and gold — sculpted armrests, headrest speaker
  unit, enclosed leg boots.
- **Why here:** it sits against the pricing section as the $14,990 end of the range, and it
  carries the design argument — chairs styled as living-room centerpieces rather than medical
  equipment, which the article claims is Bodyfriend's signature move.

## Rights basis

Manufacturer product images used editorially to identify the products the article names and
prices — the established house practice (Nongshim/Samyang packshots, hy Mobility, Happycall,
Beauty of Joseon, Navien, Ilwol). No sponsorship implied; both captions credit Bodyfriend.

## Rejected

- **`Kim Tae-hee Bodyfriend BTS - 1..4.png`** (Commons) — behind-the-scenes frames from a
  Bodyfriend commercial featuring actress Kim Tae-hee. Rejected without download: whatever the
  Commons licence claims, a celebrity's likeness from an advertisement carries personality
  rights this site should not lean on, and the article does not need a celebrity to make its
  point.
- **Commons `massage chair` results** — a 1919 electrical massage chair engraving, an OTO
  (Singapore brand) chair, a Tunisian shiatsu inlay. None Korean, none current.
- **`bodyfriend.co.kr` home page images** — reachable (46 images) but all event/popup banners
  with heavy Korean promotional text, not product photography. The US Shopify feed was the
  better source and is the market the article prices anyway.
- **Falcon/Pharaoh alternate angles** (7 more frames downloaded and contact-sheeted) — front-on
  and rear views; the two 3/4 views chosen show the leg boots and overall form most clearly.
- **`Palace_Neo_1000.gif`** — animated GIF, skipped by policy (stills only in posts).

## Checks run

- **Cross-post uniqueness:** `bodyfriend` appears in no other post's `image-sources.md`.
  First use of both.
- **Size:** 84 + 102 = **186 KB** for the post.
- **Captions:** written after viewing both renders; each names only visible features, and both
  credit the manufacturer.
- `npm run audit:image-context -- --slug 394` run before commit.

## Gap worth noting

No photograph exists here of the chair **in a Korean living room** — the article's cultural
claim — or of the **child-lock control** the safety section recommends. Both are one visit to
any Korean parent's apartment away. The MINI accessory line ($149–$349) also went unphotographed;
if the staged-path CTA ever converts well, adding the MINI product shots would support it.
