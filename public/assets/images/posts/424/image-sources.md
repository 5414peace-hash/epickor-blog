# 424 — McDonald's Korea / 한국의 맛, image sources

All four from **McDonald's Korea's own site (mcdonalds.co.kr)**, retrieved 2026-08-24. 0차 rule:
for a branded product the manufacturer's own site comes first, because no stock library holds a
packshot of a specific menu item.

Editorial use to identify the products discussed. No sponsorship implied or claimed.

## How they were retrieved — mcdonalds.co.kr is a hard SPA
`/kor/menu/list.do` returns a **12 KB shell** and `/kor/menu/burger` a 65 KB shell that is almost
entirely CSS. There is no static markup to scrape.

- `/api/v1/...` exists in the bundle but every guessed path (`/menu/burger`, `/menus/burger`,
  `/menu/list?type=burger`, plain `/menu`) returns the app's own 404 JSON.
- It is Nuxt (`window.__NUXT__`), but `/_payload.json` for the route also 404s.
- **Playwright worked.** Headless Chromium, `networkidle`, then scroll to trigger lazy loads, then
  read `img.currentSrc` plus `alt` from the DOM. Script kept at
  `.tmp/topicstudy/mcd_scrape.py` / `mcd2.py`. Yields 13 images at **772×530** with meaningful
  Korean alt text, and the page's own Korean + **official English** product names.
- **The full 22-item grid did not render headless** — repeated scrolling produced the same 13
  images and 1,070 characters of text. The recommend-slider items are what is retrievable.
  Not a blocker here; the four chosen cover the argument.

Downloaded as PNG with transparency, flattened onto white, re-encoded JPEG q86.

## jinju-pepper-cream-cheese-burger.jpg (772×530, 49KB) — hero / ogImage
`/upload/2026/08/Corp_PC_VIEW_772x530_고추크림치즈비프버거_EVM_02.png`
alt: 신제품 진주 고추 크림치즈 비프 버거 세트_콜라 m 사이즈, 후렌치 후라이 m 사이즈 포함
Hero because the **green flecks in the cream cheese sauce are visible** — that is the Jinju pepper,
and the article's whole argument is that a named county's crop is physically in the product.
The chilli-shaped NEW badge also dates the item without a caption having to.

## mcspicy-shanghai-burger-meal.jpg (772×530, 47KB)
`/upload/product/pcfile/1723562660091.png`
alt: 맥스파이시 상하이 버거 세트 제품 사진_감자튀김과 콜라 M사이즈 포함
The permanent Korea-only fixture, as opposed to the limited-run programme item.

## jeju-green-tangerine-mcfizz.jpg (772×530, 19KB)
`/upload/2026/08/Corp_PC_view_772x530_제주풋귤맥피즈.png`
alt: 신제품 제주 풋귤 맥피즈 미디엄
Shows the regional-ingredient idea is not confined to burgers. 풋귤 is the unripened green Jeju
tangerine, a distinct ingredient in Korea rather than unripe fruit.

## big-mac-meal-korea.jpg (772×530, 47KB)
`/upload/2025/08/빅맥®_세트.png`
alt: 빅맥 세트 감자튀김과 콜라M사이즈 포함 제품 사진
**Deliberately the control image.** The article's closing argument is that the Big Mac is on the
Korean board so a reader can measure how far the rest has drifted; the piece needs the familiar
object on the page for that to land.

## Checked and rejected
- **Wikimedia Commons / Pexels / Unsplash** — no McDonald's Korea product photography. Generic
  burger stock would fail the rule that an image must show the named subject, and this article
  turns on one specific sauce.
- **Korean news photographs** of the 한국의 맛 launches — copyrighted press images.
- **Burger King Korea** (`burgerking.co.kr`) — also a hard SPA, 5.7 KB shell. Not pursued; the
  article is McDonald's-centred and did not need it.

## Cross-post uniqueness
No stock photo IDs used, so `audit-image-uniqueness.mjs` has no ID to key on. New to the
repository; no other post uses mcdonalds.co.kr imagery.
