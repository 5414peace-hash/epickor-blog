# Image sources — Blog 381 (Korean Spam gift sets)

All four images are **official manufacturer product photography from CJ CheilJedang's own store**
(`cjthemarket.com`), fetched 2026-08-13. This follows the 0차 rule in `CLAUDE.md`: for a packaged
branded product, the manufacturer's own site comes before Pexels, Unsplash or Commons — those
libraries do not contain pack shots of a specific SKU at all, and searching them only produces
"a similar-looking box", which is the failure mode the rule exists to prevent.

Wikimedia Commons was checked for `Chuseok gift set`, `Korean department store gift` and
`추석 선물세트`: **one loosely related file, no gift-set pack shots.** Nothing usable.

Editorial product identification. No sponsorship exists or is implied.

## Files

| File | Source URL | Set | Delivered |
|---|---|---|---|
| `spam-gift-set-1ho.jpg` (hero, ogImage) | `img.cjthemarket.com/images/file/product/241/20260730181054818.jpg` | 스팸1호, prdCd 40232109 | 1080x1080, 166 KB |
| `spam-gift-set-3ho.jpg` | `img.cjthemarket.com/images/file/product/986/20260730181140206.jpg` | 스팸3호, prdCd 40232111 | 1080x1080, 149 KB |
| `spam-gift-set-8ho.jpg` | `img.cjthemarket.com/images/file/product/868/20260730181509454.jpg` | 스팸8호, prdCd 40232115 | 1080x1080, 143 KB |
| `spam-complex-teuk-ho.jpg` | `img.cjthemarket.com/images/file/product/784/20260731112859303.jpg` | 스팸복합 특호, prdCd 40232177 | 1080x1080, 139 KB |

Total 597 KB, under the 1 MB per-post ceiling.

## How to fetch these again

The listing page carries structured data in `data-*` attributes, which is where the SKU codes,
list prices and selling prices in the article came from:

```
https://www.cjthemarket.com/pc/search?query=스팸 선물세트
→ data-prdCd / data-prdNm / data-prdSalePr / data-prdSalePrLast / data-prdSaleDcRateLast
  / data-prdRvwScor / data-prdRvwCnt
```

**The product detail pages (`/pc/prod/prodDetail`, `/mo/prod/prodDetail`) are useless** — they
render empty or JS-only, and the composition is baked into a long marketing JPEG rather than
markup. Do not spend time on them.

Strip the `?SF=webp&RS=299x299` query string from the thumbnail URL to get the 1080x1080 original.
A `Referer: https://www.cjthemarket.com/` header is required.

## The images ARE the source for the composition claims

This is the unusual part of this post and worth recording. The article states can counts and
gram weights per set — 1호 = 12 x 340g, 3호 = 6 x 340g + 6 x 200g, 8호 = 9 x 200g, 12호 = 8 x 200g.
**Those were counted off these photographs**, where the `340 g` and `200 g (680 kcal)` printing on
each can face is legible at 1080px. Korean retail listings carry compositions too, but they are
secondary, inconsistent between shops, and frequently describe a previous year's box — the same
category of source that produced the wrong Busan ticket dates in Blog 379.

Because the photographs are published in the article, a reader can check the claim against the
same evidence the writer used. Keep it that way if these sets are re-priced next season.

`spam-complex-teuk-ho.jpg` is doing the same job for the 복합 range: it visibly contains eight
200g cans, four small flat cans, three 백설 bottles and two grinders, which is the whole argument
that a 복합 box costs more and holds less ham.

## Checks run

- **Cross-post uniqueness:** first CJ CheilJedang images on the site. `audit-image-uniqueness.mjs`
  keys off Pexels/Unsplash `photos/{id}` patterns and does not cover manufacturer CDNs, so the
  full source URLs are recorded above instead.
- **Korea-first:** Korean-market packaging, Korean product names (스팸 클래식), Korean
  environmental notice text on the box band.
- **Caption honesty:** every caption states what the photograph actually shows and credits
  CJ CheilJedang. No caption apologises for or explains away the image.
