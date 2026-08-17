# Image sources — Blog 398 (Torriden Dive-In serum)

Both images from **Torriden's US store feed** (`torriden.us/products.json` — Shopify, the
FACTS-documented route that has now produced Beauty of Joseon, Bodyfriend, COSRX, Anua and
Torriden imagery). Retrieved 2026-08-17; six official frames viewed on a contact sheet.

## 1. `torriden-dive-in-serum-dropper.jpg` (hero, ogImage)

- **Source:** product `[Amazon] DIVE IN Hyaluronic Acid Serum` (US $22.50), feed index 4.
- **Original:** 1500x1500. Delivered 1100x1100, **86 KB**.
- **What it shows, verified:** the bottle upright, label `Torriden DIVE IN Serum` legible,
  dropper held above with a falling drop, plain blue field, no marketing text.
- **Why hero:** the article's claim is that the product photograph *is* the brand (no
  celebrity, no face) — so the hero is exactly that photograph.

## 2. `torriden-dive-in-texture-drop.jpg`

- **Source:** same feed, index 2.
- **Original:** 1500x1500. Delivered 1100x1100, 90 KB.
- **What it shows:** the dropper releasing a drop onto a small pool of the fluid — the
  watery-not-gel texture the article describes, with no text in frame.

## Rejected — all viewed first

- **`s1` — "DIVE IN TO DEEP HYDRATION / 48h Lasting Hydration / +14% Moisture Retention"**
  and **`s0` — "PERFECT PREP FOR MAKE UP / #1 Hydrating Serum"**: efficacy-figure marketing
  cards. Same rule as posts 395/396: publishing them imports quantified claims this article
  does not verify.
- **`s5`** — two models holding the bottle; person-selling, and it would contradict the
  article's own growth-without-a-face point.
- **`s3`** — bottle on its side; clean but weaker than the chosen pair.

## Checks run

- **Cross-post uniqueness:** `torriden` appears in no other post's or carousel's
  `image-sources.md`. First use.
- **Size:** 86 + 90 = **176 KB** for the post.
- `npm run audit:image-context -- --slug 398`: 0 critical / 0 high / 0 medium.

## Gap worth noting

No openly licensed photo shows the serum **in a Korean Olive Young aisle** — the shelf context
the growth story is about. Post 388's Olive Young storefront cannot be reused (cross-post
uniqueness), so a different OY interior/shelf photo would be the upgrade if one surfaces.
