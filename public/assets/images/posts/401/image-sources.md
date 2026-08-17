# Image sources — Blog 401 (Round Lab Dokdo Toner)

Both images are **the brand's own product cards, served from its primary retail channel** —
Round Lab's Olive Young listing (`image.oliveyoung.co.kr` CDN), retrieved 2026-08-17. The 0차
manufacturer route dead-ended first, which is recorded because one finding matters beyond
this post.

## The sourcing path, recorded

- `roundlab.co.kr` — reachable but fully JS-rendered (1 static image, a nav gif).
- **`roundlab.us` — a parked domain serving ad-tech beacons (`l.cdn-fileserver.com/bping`),
  NOT the brand.** Recorded as a hard warning: it looks like an official US domain and is
  not. Do not link or source from it.
- `global.oliveyoung.com` search — SPA that defeats both urllib and a networkidle Playwright
  wait on the search route.
- **`oliveyoung.co.kr` product page (`goodsNo=A000000132162`) — server-rendered on first
  request**; five `image.oliveyoung.co.kr` product-card URLs extracted and all five
  downloaded and contact-sheeted. A second page request minutes later returned 403 — the KR
  OY site rate-limits fast, so harvest on the first hit.

## 1. `roundlab-dokdo-toner-bottle.jpg` (hero, ogImage)

- **Source:** OY product card `A00000013216227ko.jpg`.
- **Delivered:** 900x900, **16 KB**.
- **What it shows, verified:** the 200ml bottle alone on white — label with the Dokdo islet
  ink drawing and `1025 독도토너` text. No badges, no model, no claims.

## 2. `dokdo-toner-sizes-awards.jpg`

- **Source:** OY product card `A00000013216236ko.jpg`.
- **Delivered:** 1000x1000, 74 KB.
- **What it shows:** the 500ml and 200ml with Olive Young Awards badges — "2025 OLIVE YOUNG
  AWARDS · 6yrs 연속 수상 · 1위".
- **Why a badge card is acceptable here when efficacy cards were rejected on 395/396/398:**
  an award badge is a **verifiable factual claim, not an efficacy percentage** — and this one
  did work: the badge's "6yrs" superseded my press source (five years through 2024),
  correcting the article's own number to six through 2025. The image is evidence, cited as
  such in the caption.

## Rights basis

Official product imagery of the exact product the article covers, distributed by the brand
through its primary retailer, used editorially for identification — the established house
practice. Captions attribute "via the brand's Olive Young listing."

## Rejected

- **`35ko`** — model shot; person-selling, rejected as on every post in this series.
- **`37ko`** — near-duplicate of 36ko with tighter crop; one badge card is enough.
- **`38ko`** — boxed set card with heavy Korean promo copy.

## Checks run

- **Cross-post uniqueness:** first Round Lab imagery on the site; no other `image-sources.md`
  references these files or the OY CDN for this product.
- **Size:** 16 + 74 = **90 KB** — the lightest set of the series.
- `npm run audit:image-context -- --slug 401`: 0 critical / 0 high / 0 medium.

## Gap worth noting

No openly licensed photo of **Ulleungdo/Dokdo waters** was sourced — the name-story section
could carry one; KTO's photo library (KOGL) likely has Ulleungdo seascapes if this post is
refreshed.
