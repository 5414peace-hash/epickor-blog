# Image sources — Blog 390 (Happycall double pan)

**This post has no photograph of the product it is about, and that is a sourcing failure, not
a choice.** The full manufacturer-first waterfall was run and it dead-ended. Both images used
here carry the article's *argument* — the Korean grilled-fish problem the pan was built to
solve — and both were opened on a contact sheet and judged before either caption was written.

## The product-shot waterfall, and where each step failed

The 0차 rule says a packaged/branded product goes to the manufacturer first. It was tried:

| Step | Result |
|---|---|
| `happycall.co.kr` (official corporate site) | **DNS timeout** from this environment, repeatedly |
| `hcmall.co.kr` (official Cafe24 mall) — home page | Reachable. **13 product images pulled and viewed — not one is a double pan.** |
| `hcmall.co.kr` category `cate_no=26` (양면팬) | 142 KB of HTML, **0 product images** — list is JS-rendered |
| `hcmall.co.kr` search `keyword=양면팬` | Same: JS-rendered, 0 images, 0 `product_no` |
| `hcmall.co.kr/sitemap.xml` | Static pages only, no products |
| `/exec/front/Product/ApiProductList` | HTTP 200, **16-byte empty body** |
| `product/detail.html?product_no=1..39` probe | 0 titles returned |
| `happycall.com` / `happycallglobal.com` / `global.happycall.co.kr` | **None of these domains resolve.** No English manufacturer site exists. |
| Wikimedia Commons, `Happycall` | **0 files.** Also 0 for `double sided pan`. |
| Amazon US listings / brand store | Blocked to fetch (HTTP 500), and retailer imagery has unclear reuse rights — same reason `bidetking.com` was rejected for post 389 |

**The finding worth keeping from that sweep:** the manufacturer's own front page currently
sells **pressure pots and blenders**. Of 13 images, seven are pressure pots, one is a blender,
four are ordinary single pans, one is a lifestyle shot. The double pan that built the company
is not being pushed on the company's own home page — which is a fact the article now states.

One useful corroboration did come out of it: a **`27주년` (27th anniversary) badge** on a
product image, consistent with the June 1999 founding date the article cites.

## 1. `korean-grilled-fish-banchan-table.jpg` (hero, ogImage)

- **Source:** https://commons.wikimedia.org/wiki/File:Korean_cuisine-grilled_fish_and_banchans_2015-08-13.jpg
- **Author:** Mar del Este — **attribution required, in the caption.**
- **Licence:** **CC BY-SA 4.0**
- **Original:** 4128x2322. Delivered 1400px, **116 KB**.
- **What it shows, verified by opening it:** a Korean table — a whole grilled fish on a plate,
  ringed by banchan (crab, spicy stir-fry, stews) in the ordinary Korean dish arrangement.
- **Why it is the hero.** The article's thesis is that this pan exists because Korean
  apartments cannot cook this dish comfortably. The photo is the dish, in its real context,
  at the center of a normal spread. A product shot would have illustrated the object; this
  illustrates the reason.

## 2. `korean-grilled-mackerel-saengseon-gui.jpg`

- **Source:** https://commons.wikimedia.org/wiki/File:Korean.cuisine-Saengseon_gui-01.jpg
- **Author:** karendotcom127 — attribution required, in the caption.
- **Licence:** **CC BY 2.0**
- **Original:** 2048x1536. Delivered 1200px, 99 KB.
- **What it shows:** a single whole grilled mackerel on a white plate, Korean restaurant table,
  kimchi and banchan behind.
- **Why here:** it sits against the paragraph explaining that the hinged pan lets you turn the
  *pan* instead of the *fish*. The photo shows a fish at exactly the size and fragility that
  makes that matter.

## Rejected — and why

- **`Boong o bbang.jpg`** (CC BY-SA 4.0, 2448x2448) — fish-shaped pastries, which is precisely
  the article's origin story. **Rejected on country.** Opening it at full size shows
  **traditional Chinese signage in the background (`雞蛋…食`) and a non-Korean URL.** This is
  almost certainly Taiwan. Captioning it as Korean 붕어빵 would have been the 2026-08-03
  card-news failure repeated in a blog post.
- **`Gyeran-ppang bungeo-ppang.jpg`** (CC BY-SA 2.0, 3264x1836) — filename promises bungeoppang.
  **What is actually in frame is a flat round griddle of 계란빵 (egg bread)**, egg yolks visible,
  no hinged fish mold anywhere. Calling it "the bungeoppang mold" would have been an accurate-
  sounding caption describing something not in the picture.
- **`Bungeoppang-01.jpg`** (public domain, 1024x768) — a rack of finished fish pastries on a
  grill. Shows the *output* of the mold, not the mold; no Korean marker visible to confirm
  country. Weak on both counts, so not used.
- **`Taiyaki-Plate.JPG`** — the Japanese equivalent mold. Would have shown the hinge mechanism
  well, but bungeoppang's Japanese ancestor in an article about a Korean invention repeats the
  exact care problem handled in post 389 with the TOTO panel, without 389's justification
  (there the Japanese origin *was* the paragraph's subject).
- **Korean apartment kitchen interiors** — searched; Commons returns Hong Kong and Japanese
  results plus an unrelated Korean interior series. Nothing usable for the ventilation argument.

## Checks run

- **Cross-post uniqueness:** both files checked against every `image-sources.md` in
  `public/assets/images/posts/` before download — `Saengseon`, `Godeungeo`, `grilled fish and
  banchans`, `Bungeoppang`, `Gyeran-ppang`, `Boong o bbang` all returned **미사용**. First use
  of both on this site.
- **Size:** 116 + 99 = **215 KB** delivered; post folder 220 KB total.
- **Captions:** written after viewing each file at full resolution. Both name what is actually
  in frame and carry the required CC attribution. Neither apologises for its image.
- `npm run audit:image-context -- --slug 390`: **0 critical, 0 high, 0 medium.**

## Gap worth noting

**A photograph of an open Happycall double pan with food in it** is the single most valuable
missing image on this post, and unlike post 389's missing Korean bidet panel, this one is
trivially obtainable — any Korean home or any Costco Korea aisle. If a Korea-side photo ever
becomes possible, this post is the first place to spend it.
