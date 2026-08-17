# Image sources — Blog 359 (Neoguri)

All three images are **official Nongshim product photography**, taken under the 0차 sourcing rule
in `CLAUDE.md`: for a branded packaged good, the manufacturer is checked before Pexels, Unsplash or
Wikimedia Commons, because a stock library has no pack shot of a specific SKU and searching one
only produces a category photo of some other noodle.

Source: `https://nongshimusa.com/html5/imgs/products/imgs/`. Nongshim serves genuine
1500–2400 px cut-outs on a white square canvas, which is why this is the reference source recorded
in `CLAUDE.md` for Korean packaged goods.

| File | Source file | Shows |
|---|---|---|
| `neoguri-spicy-nongshim.jpg` | `neoguri_spicy.jpg` (1500×1500) | Neoguri Spicy Seafood, 120 g — hero |
| `neoguri-mild-nongshim.jpg` | `neoguri_mild.jpg` (2424×2424) | Neoguri Mild, the green bag |
| `chapagetti-nongshim.jpg` | `chapagetti.png` (1500×1500) | Chapagetti, the other half of Chapaguri |

## Why the hero is the pack and not a cooked bowl

The article's central claim is that a whole piece of kelp is in the bag. **The pack shot proves
it** — the bowl printed on the front of the Neoguri packet shows the dark green kelp square in the
soup, and the Hangul `너구리`, the `UDON TYPE NOODLES` descriptor and the `120g` weight are all
legible at this resolution. A generic photograph of a bowl of ramyun would have illustrated the
subject while proving nothing, and would have risked showing a different noodle entirely — the
failure the product-identity rule was added to prevent.

## Processing

Flattened onto white, `trim()` to strip the square canvas padding, resized to a 1400 px ceiling,
JPEG mozjpeg with quality stepped down until each file cleared 250 KB (all landed at q80,
208–246 KB). Originals were 1.0–2.5 MB, far above the working target.

## Use basis

Editorial product identification. The article names and reviews these exact Nongshim products and
credits Nongshim in every caption. No sponsorship or endorsement is implied.

## Not used

`shin_ramyun.png` was downloaded during the same pass and deleted — Shin Ramyun is covered in
Blog `346`, and reusing a pack shot across posts would breach the cross-post image uniqueness rule.

## Added 2026-08-17 — representative-supplied pack shots

Sourced by the representative from Korean retail/manufacturer product listings after a session
pass over the manufacturer sites came up short: Nongshim Korea serves pack shots at only
235–350 px, the high-resolution ones live on the US corporate site which does not carry
Korean-domestic SKUs, and none of nongshimusa.com / samyangamerica.com / orionworldusa.com
exposes a Shopify `products.json`. Editorial use for product identification.

| File | Shows |
|---|---|
| `neoguri-large-cup-official.jpg` | 너구리 큰사발 (large cup) — the format the ₩1,900 / ₩1,267 price in this post applies to. The other images are the 봉지, so the cup price had no matching photograph until now. |
