# Image sources — Blog 362 (Korean Yakult / COCO cart)

| File | Source | Original | Licence / basis | Credit |
|---|---|---|---|---|
| `coco-cart-official.jpg` | [hy Mobility, COCO 3.0 product page](https://www.hymobility.net/ko/coco30) | 1280×853 PNG | Manufacturer official product image, editorial product identification | hy Mobility |
| `coco-cart-side.jpg` | [hy Mobility homepage](https://www.hymobility.net/ko) | 1500×1313 JPEG | Manufacturer official product image, editorial product identification | hy Mobility |
| `yakult-premium-light.jpg` | [Fredit product page, prdId 4351](https://m.fredit.co.kr/product/prdProductDetails.do?prdId=4351) | 720×720 JPEG | Manufacturer official product image (hy's own storefront), editorial product identification | hy |
| `seoul-convenience-store-night.jpg` | [Pexels photo 28529894](https://www.pexels.com/photo/night-view-of-7-eleven-store-in-seoul-28529894/) | 4672×7008 | Pexels licence | Paul Bill |

## Why the 0차 rule decided this set

The article names two specific products — the **COCO 3.0 cart** and **야쿠르트 프리미엄 라이트** — so the
manufacturer route was mandatory, and it was also the only route that worked.

**Wikimedia Commons has no Korean Yakult at all.** A search returns Yakult photographed in Singapore,
China, Scotland, Mexico, Taiwan, and Japan — and nothing from Korea. Under the Korea-first rule those are
all disqualifying for a Korea explainer, so none was used. Commons likewise returned **zero** results for
the COCO cart under `Yakult Korea cart`, `코코 카트`, `프레시매니저`, or `hy Coco cart`.

That left the makers. **hy Mobility** is the hy subsidiary that actually builds COCO, and its product
pages carry clean official renders of the exact generation the article describes. The Yakult bottle came
from **Fredit**, which is hy's own online storefront, so it is a first-party product image rather than a
retailer photo.

## What each image is doing

- `coco-cart-official.jpg` — the hero, and the thing the article promises to explain. Cream body, four
  wheels, handlebars, digital display, and hy's Korean slogan **신선한 가치로 건강한 습관을** legible on the
  flank. Trimmed to remove the studio white margin, then resized to 1200 px wide.
- `coco-cart-side.jpg` — the side profile, which is what makes the "chest freezer with a steering column"
  proportion readable. Placed in the specifications section.
- `yakult-premium-light.jpg` — the Korean-market bottle with **야쿠르트 / 프리미엄 라이트 / 균주번호 HY2782**
  all legible, gold foil seal intact, poured into a glass beside it. The glass is doing evidential work:
  the article's central claim is that this is a *liquid* and not a spoonable yogurt, and the photograph
  shows it pouring.
- `seoul-convenience-store-night.jpg` — placed in the "how to actually buy one" section, where the
  article's advice is to skip the cart and use a convenience store. Korea is verifiable in the frame from
  the Hangul signage (**가깝고 편리한 행복충전소**, **와인판매점**, **노래연습장**).

## Both cart images are renders, and the captions say so

The hy Mobility images are product renders, not photographs. Captions credit them as **"Official product
image, hy Mobility"** rather than implying a street photo. Under the Blog Reference Image Standard the
governing test is whether the image shows the exact named subject, and an official manufacturer image of
COCO 3.0 does — where a generic Seoul street photo would not, because it would not contain a COCO at all.

A real street photograph of a cart in traffic would be a better hero. None was available under a usable
licence; Commons had nothing and the Korean news photos of carts in the road are all rights-reserved.

## Uniqueness

`scripts/audit-image-uniqueness.mjs --check-id` was run at selection time, before download.

- **31735910** ("Korean drinks in a convenience store fridge in Seoul") was the first choice and was
  **rejected — already used by post 186.** This is exactly the case the audit exists for.
- **28529894** returned clean and was used.

The three manufacturer images are first-use on this site.

## KTO photo API: checked, and empty for this topic

The KTO photo API was queried with the repository's key and responded normally, confirming the key works.
It returned **0 results for 야쿠르트** and one irrelevant result for 편의점. The bank is a tourism and
heritage archive — useful for places, useless for brands and packaged products. Recorded so the next
session does not re-run this check.

## Processing

Resized with `sharp`, JPEG q82–88 mozjpeg. 44–228 KB each, post total well under the 1 MB target.
