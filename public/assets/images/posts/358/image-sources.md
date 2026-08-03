# Image sources — Blog 358 (Pororo Drink)

All images are **official manufacturer product photography from Paldo (팔도)**, obtained under the
0차 sourcing rule in `CLAUDE.md`: for packaged and branded goods, the maker's own site is checked
before Pexels, Unsplash or Wikimedia Commons, because those libraries do not carry pack shots of
specific products at all.

Source site: `https://www.paldofood.co.kr/product/beverage/186` (Paldo's kids' beverage category).
Full-resolution files are served at `/data/product/{id}.png`; the listing page links the `-thumb`
variant, and dropping `-thumb` returns the larger original.

Wikimedia Commons was searched first for completeness and holds **no photograph of this product** —
`뽀로로 음료`, `Pororo drink` and `Paldo Pororo` all return either nothing or unrelated files
(Brazilian performers, a Singapore character appearance). The character exists on Commons; the
drink does not. Using a photo of the character would have broken the product-identity rule, so the
manufacturer route was the only correct one.

| File | Source file | Shows |
|---|---|---|
| `pororo-drink-lineup-paldo.jpg` | composite of the four below | Line-up hero |
| `pororo-zero-235ml-paldo.jpg` | `/data/product/210232_beverage-023.png` | Pororo Zero 235 ml, milk and strawberry |
| `big-pororo-zero-paldo.jpg` | `/data/product/205807_beverage-020.png` | Big Pororo Zero |
| `pororo-spring-water-paldo.jpg` | `/data/product/103438_beverage-008.png` | Pororo spring water, labelled 250 ml and label-free 260 ml |
| `pororo-organic-barley-tea-paldo.jpg` | `/data/product/163037_beverage-029.png` | Pororo organic barley tea |
| `pororo-red-ginseng-paldo.jpg` | `/data/product/135934_beverage-007.png` | Pororo 홍삼쏙쏙 red ginseng (downloaded, not used in the post) |

## The hero is a composite, and why

Paldo's originals are **585×466**, far smaller than Nongshim's 1500–2000 px cut-outs. Trimmed to
the product, each one is only 270–500 px wide — usable as an inline product chip, too soft for a
hero at our 1200–1600 px target.

Rather than upscale, the four cut-outs were normalised to a common height and laid out side by side
on a neutral ground (`.tmp/lineup358.cjs`), producing **1376×538 at native scale with no
enlargement**. It is an arrangement of the real product photography, not a retouch, and the caption
says so.

## Processing

Every file: flattened onto white, `trim()` to remove the square canvas padding (otherwise the
bottle sits small inside empty space), resized to a 1400 px ceiling, JPEG q86 mozjpeg. All are well
under the 250 KB working target — largest is the 124 KB hero.

## Use basis

Editorial product identification. The article names Paldo products and reviews them; the images
show those exact products. No sponsorship or endorsement is implied or claimed, and Paldo is
credited in every caption.
