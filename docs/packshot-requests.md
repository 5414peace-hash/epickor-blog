# Pack-shot requests — food lane (raised 2026-08-17)

The COUNTER reel kit (`remotion/CounterKit.tsx`) is blocked on imagery, not data. Every price
below is already verified and date-stamped in a published post; what is missing is a product
photograph of the **correct format** at usable resolution.

Drop files in `output/packshots-incoming/` using the filename in each row. That folder is
gitignored — files get processed and moved into `public/assets/images/posts/{slug}/` with a
provenance line added to that post's `image-sources.md`.

## Why format matters more than anything else here

A convenience-store price is specific to a package. `361` prices the **cup**; `359` prices the
**large cup**. Every ramyeon photograph in the repo is a **packet**. Pairing a cup price with a
packet photo would reproduce the 2026-08-03 카드뉴스 defect exactly — a card naming
짜파게티 while showing a red seafood ramyeon — which is why the product-identity gate exists.

## Spec — all six

| | Requirement | Why |
|---|---|---|
| Resolution | **short edge ≥ 800px**, 1200px+ preferred | A reel panel is a 0.535 portrait crop at 430×806. Blog images were sourced against a ≤400KB/≤1600px gate where 600px was fine, which is why they fail here |
| Framing | Whole product, **wordmark fully readable** | A crop that cut "Torriden" to "Torrid" had to be redone; `milkis-can.jpg` is shot side-on so 밀키스 wraps out of frame |
| Background | Plain white or single-colour studio sweep | Manufacturer product shots. A plate of cooked noodles is not a pack shot |
| Format | **Exactly as specified below** | See the note above |

Best sources, in order: the manufacturer's own product detail page → 올리브영 / 쿠팡 / 이마트몰
product images (usually the official pack shot) → CU / GS25 app product images.

---

## Group A — needed for the 2+1 reel (2 items)

The other two items for this reel are already in hand: 포카칩 66g (1200×901) and
밀키스 250ml (1400×1400).

**1. 오뚜기 진라면 매운맛 — 컵라면**
- Format: **컵 (cup). NOT the 봉지.**
- Paired price: ₩1,100 listed → ₩825 on 3+1 or 2+1, checked 3 August 2026 across emart24, CU and 7-Eleven — `content/blog/361.md`
- Filename: `jin-ramen-spicy-cup-official.jpg`
- Note: 순한맛 or 약간매운맛 cups are also fine — all three list at the same ₩1,100. 매운맛 is the most recognisable.

**2. 농심 너구리 큰사발**
- Format: **큰사발 (large cup/bowl). NOT the 봉지.**
- Paired price: ₩1,900 listed at CU → ₩1,267 on 2+1, checked 3 August 2026 — `content/blog/359.md`
- Filename: `neoguri-large-cup-official.jpg`

---

## Group B — needed for the premium-ramyeon reel (2 items)

This is the stronger topic of the two: the price rise *is* the article's thesis, so the
strike-through on ₩1,000 counting up to ₩1,900 is the argument rather than decoration. Block one
is already in hand — 신라면 봉지 at 900×1099.

**3. 농심 신라면 골드**
- Format: **봉지 (packet).**
- Paired price: ₩1,500, launched 2 January 2026, about 1.5× standard 신라면 — `content/blog/219*.md`
- Filename: `shin-ramyun-gold-packet-official.jpg`
- Note: recorded as hard to source — Nongshim Korea serves pack shots at only 235–350px, and the
  high-resolution ones live on the US corporate site, which does not carry Korean-domestic
  launches. 쿠팡 or 이마트몰 is the likelier find.

**4. 삼양 삼양1963**
- Format: **봉지 (packet).**
- Paired price: ₩1,900 at convenience stores, launched 3 November 2025 — `content/blog/219*.md`
- Filename: `samyang-1963-packet-official.jpg`
- Note: this product carries the best fact on the page — it relaunched on the same calendar date
  the company was accused over the 우지 파동, thirty-six years later, and it is fried in beef
  tallow. It is the reel's payoff block, so this one matters most.

---

## Group C — optional, gives the 2+1 reel spare items (2 items)

**5. 롯데 죠스바** — individual ice bar wrapper. ₩1,500 at CU since a July 2023 rise → roughly
₩800–1,000 on a 2+1 (`content/blog/335.md`). Filename: `jaws-bar-official.jpg`.
No image of this product exists in the repo at all.

**6. 팔도 뽀로로 음료 235ml** — bottle. ₩1,500 listed → ₩1,000 on a 2+1 at CU and GS25
(`content/blog/358.md`). Filename: `pororo-drink-235ml-official.jpg`.
The repo copy is **155×141**, which is unusable — it looked acceptable in a contact sheet and was
only caught by reading the metadata.

---

## Already usable — do not re-source

| File | Size | Product |
|---|---|---|
| `093/shin-ramyun-bag-official.jpg` | 900×1099 | 신라면 봉지 |
| `093/shin-cup-official.jpg` | 900×1008 | 신라면 컵 |
| `359/neoguri-spicy-nongshim.jpg` | 1165×1468 | 너구리 봉지 |
| `359/neoguri-mild-nongshim.jpg` | 1400×1705 | 너구리 순한맛 봉지 |
| `361/chapagetti-nongshim.jpg` (in 359) | 1127×1419 | 짜파게티 봉지 |
| `366/pocachip-original-onion-bags.jpg` | 1200×901 | 포카칩 오리지널·어니언 |
| `360/milkis-can.jpg` | 1400×1400 | 밀키스 250ml 캔 |
| `392/lg-kimchi-fridge-drawer-type.jpg` | 1200×1600 | LG 김치냉장고 |
| `393/lg-styler-open-ifa-2015.jpg` | 1000×1500 | LG 스타일러 |
