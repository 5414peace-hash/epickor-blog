# Business / Kovea deep dive — image sources

Two manufacturer packshots and one EpicKor chart. No stock photography.

| File | What it shows | Source | Licence / credit |
|---|---|---|---|
| `kovea-container-stove-official.jpg` | Stainless folding camping burner, box body open, pot supports extended, butane canister loaded through the side | `kovea.co.kr/web/product/big/202509/4c541ba19a6ebb71630ab4230cd9c267.jpg` | Manufacturer product image, editorial identification use |
| `kovea-k1-burner-official.jpg` | Kovea K1 canister-top burner, four serrated pot-support arms folded out, perforated burner head, black control knob | `kovea.co.kr/web/product/big/202605/9906e9b3f05fde48cd56059bea3cc7cc.png` | Manufacturer product image, editorial identification use |
| `kovea-oem-evidence-ladder.jpg` | EpicKor chart — the four tiers of proof behind the OEM claims | Made for this post | Sources named on the chart and in the article |

**Sourced under the 0차 rule (manufacturer site first).** Stock libraries have no packshot of a
specific Korean burner model, so Pexels/Commons were never the right place to look. The Cafe24 `big`
size returns **1024px** here, which is under our usual 1200–1600px body target but is the largest the
shop serves; both files land at 37–41KB.

## ⚠️ Two images were rejected after inspection, and the second rejection matters

**`코베아 부루스타 가스레인지` was pulled.** It is listed on kovea.co.kr and reads as a Kovea product
from the listing title alone, but the packshot carries **`BLUE STAR` branding and the model code
`BSR-2601`**. It is a distributed product, not Kovea's own. The caption drafted for it — "the direct
descendant of what Kovea started making in 1982" — would have been flatly false.

**The confirmation came from the article research, not from the shop.** The NewDaily profile
(1 June 2025) lists Kovea's own products as 가스 토치, **가스 곤로(러브스타)**, 2구 버너, 컨테이너
스토브, 화덕. **Kovea's portable range is 러브스타 / Lovestar, not 부루스타.** A search of the shop
for 러브스타 returns nothing, which is itself consistent: the shop is Vision Kovea's distribution
storefront and it openly carries partner brands (Trango, Nature Hike, 247PACK, Lodge).

**`티탄큐브` was also pulled** — no competing brand mark on it, but no independent corroboration that
it is Kovea-manufactured either, and after the Bluestar find that inference was no longer safe to make.

**The rule this establishes: on a distributor's storefront, a product listing under the company's
name is not evidence the company made it.** The 0차 rule says go to the manufacturer's site first —
but `kovea.co.kr` is the *distributor's* site wearing the manufacturer's name, and the two Kovea
web properties (`kovea.com` corporate, `kovea.co.kr` shop) are not the same thing. Corroborate the
specific model against press or an overseas retailer before captioning it as the company's own work.

**How the two survivors were corroborated.**
- **Container Stove** — named as a Kovea product in the NewDaily profile's own product list.
- **K1** — sold on Amazon US as `KOVEA K1` (`B08L65RVP9`) and on eBay as `KOVEA Camp K1 KB-0408`,
  so the model is Kovea-branded in markets outside the company's own storefront.

Both were also opened at full resolution and the captions written against what is actually in frame.
The first draft caption said the Container Stove was shown "with its carry bag" — the product *name*
includes 캐리백, but **there is no bag in the photograph**; it shows the stove with a canister.

## Chart note

`kovea-oem-evidence-ladder.jpg` uses the vertical stacked-card generator (`.tmp/make-kovea-charts.mjs`).
**One new trap:** the inline sub-label sits at `advance(label) + 18px`, and the shared 0.52em Latin
estimate under-measures capital-heavy strings — `Snow Peak LiteMax` collided with its sub-label while
`Markill · Vaude · Edelrid` had a loose gap from the same constant. Raised the Latin factor to **0.62**,
which clears every string in this deck. Only visible by opening the JPEG.

**Size:** 38 + 41 + 179 ≈ 258KB across three images.
