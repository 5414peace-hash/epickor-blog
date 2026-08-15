# Image sources — Blog 390 (Happycall double pan)

## CORRECTION, 2026-08-16 — the original hero was wrong and has been replaced

The post shipped with a **Korean grilled-fish-and-banchan table** as its hero, and this file
argued at length that the photograph carried the article's *reason* even though it did not show
the product. **The representative rejected it on sight.** An article titled "Happycall Double
Pan" opened on a seafood spread with no pan in it.

The previous version of this file also stated flatly: *"This post has no photograph of the
product it is about, and that is a sourcing failure, not a choice."* **That statement was
wrong.** The photograph existed on the manufacturer's own mall the entire time.

### Why the first pass missed it

The 0차 manufacturer step *was* run, but it was run badly:

- The mall home page was scraped and gave 13 images — pressure pots, blenders, single pans.
  Correct observation, wrong conclusion drawn from it.
- The 양면팬 category page and the site search are JS-rendered, so both returned zero images.
- `product/detail.html?product_no=` was probed — **but only over the range 1–39.** The double
  pan is at **product_no 58**. The probe stopped 19 numbers short of the answer.
- Commons (0 files), Flickr under commercially-usable licences (0 for `happycall`), and the
  non-existent global domains were then all checked, and the conclusion "no product shot
  exists" was recorded with a full evidence table — which made a search-range mistake look
  like a proven absence.

Finding it on the retry took one search-engine query for the product URL, which surfaced
`hcmall.co.kr/product/오리진-양면팬-멀티-레드/58/` directly.

**Lesson: an exhaustive-looking table of failed attempts is not proof of absence.** Before
recording "does not exist", widen the cheapest parameter — here, a numeric range — and try the
plain search-engine route for the URL.

## 1. `happycall-origin-double-pan-red.jpg` (hero, ogImage)

- **Source:** Happycall official mall, product `오리진 양면팬 멀티 (레드)` — Origin Double Pan
  Multi (Red), `https://hcmall.co.kr/product/오리진-양면팬-멀티-레드/58/`, retrieved 2026-08-16.
- **Delivered:** 600x600 (the mall's `big` size is the maximum available), **25 KB**.
- **What it shows, verified by opening it:** the pan closed and latched — the `HAPPYCALL`
  wordmark on the top face, **the hinge visible on the left edge**, **the two handles clipped
  together on the right**, and the seam running around the rim where the gasket sits.
- **Why it is the hero.** The article's first sentence describes "two shallow pans joined by a
  hinge, a silicone gasket running the rim, a latch on the handle." This photograph shows all
  three of those things. The reader sees the mechanism before reading a word about it.
- **Rights basis:** manufacturer product image used editorially to identify the product the
  article names — the same house practice as the Nongshim and Samyang packshots and the hy
  Mobility cart photos. No sponsorship implied; the caption credits Happycall.

## 2. `korean-grilled-mackerel-saengseon-gui.jpg`

- **Source:** https://commons.wikimedia.org/wiki/File:Korean.cuisine-Saengseon_gui-01.jpg
- **Author:** karendotcom127 — attribution required, in the caption.
- **Licence:** **CC BY 2.0**
- **Original:** 2048x1536. Delivered 1200px, **99 KB**.
- **What it shows:** a single whole grilled mackerel on a white plate, Korean restaurant table,
  kimchi and banchan behind.
- **Why here:** it sits against the paragraph explaining that the hinged pan lets you turn the
  *pan* instead of the *fish*. The photo shows a fish at exactly the size and fragility that
  makes that matter. This image was not challenged and stays.

## Removed

- **`korean-grilled-fish-banchan-table.jpg`** (Mar del Este, CC BY-SA 4.0) — the original hero.
  Deleted from the repo. It was a real Korean table and correctly licensed; it simply was not
  a photograph of the article's subject.

## Rejected during sourcing

- **`Boong o bbang.jpg`** (CC BY-SA 4.0) — fish-shaped pastries, the article's origin story.
  **Rejected on country:** full-size inspection shows **traditional Chinese signage in the
  background (`雞蛋…食`)**. Almost certainly Taiwan.
- **`Gyeran-ppang bungeo-ppang.jpg`** (CC BY-SA 2.0) — filename promises bungeoppang; what is
  actually in frame is a flat round griddle of **계란빵 (egg bread)**, yolks visible, no hinged
  fish mold. A caption naming it a bungeoppang mold would have described something not present.
- **`Bungeoppang-01.jpg`** (public domain) — finished pastries on a rack, not the mold, and no
  Korean marker to confirm country.
- **`Taiyaki-Plate.JPG`** — the Japanese equivalent mold. Shows the hinge well, but a Japanese
  object in an article about a Korean invention repeats the care problem handled in post 389.
- **Flickr, licences 4/5/9/10 (commercial + derivatives):** `happycall` → **0 results**;
  `bungeoppang` → 3, all finished pastries or egg bread; `korean frying pan` → generic pans.
- **Amazon brand-store imagery** — blocked to fetch and retailer reuse rights unclear, the same
  reason `bidetking.com` was rejected for post 389.

## Checks run

- **Cross-post uniqueness:** the mackerel photo was checked against every `image-sources.md`
  under `public/assets/images/posts/` before download (`Saengseon`, `Godeungeo` → 미사용). The
  Happycall product image is first use; no other post references `hcmall.co.kr`.
- **Size:** 25 + 99 = **124 KB** for the post, down from 215 KB.
- **Captions:** written after viewing each file at full size. The hero caption names only
  features that are actually visible in the frame.

## Gap worth noting

The mall's `big` size caps at 600x600, so the hero is smaller than the 1200–1600px house
target. A larger or in-use shot — the pan **open**, with food in it — would be better still and
is trivially obtainable from any Korean kitchen or Costco Korea aisle.
