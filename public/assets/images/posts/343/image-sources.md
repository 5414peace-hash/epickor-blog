# Image sources for Blog 343 (Orion Moist Yellow Cheese Chip / 오리온 촉촉한 황치즈칩)

## Settled fact: no image of the actual product exists under a usable licence

**Do not re-search this.** Two independent research passes (2026-07-30, 2026-07-31) confirmed
there is **no freely-licensed photograph of 오리온 촉촉한 황치즈칩 anywhere**:

- Wikimedia Commons: zero results for the product, in Korean or English.
- Pexels: zero. Unsplash: zero. "korean snacks" on Pexels returns street food, not packaged goods.
- Orion's own product and press photos are distributed under press-release terms ("오리온 제공").
  That is editorial press-distribution licensing, not a free licence, and it is **not usable on a
  monetised affiliate site**.
- Why no user photos circulate under a free licence: the chip is a limited edition, it has **no
  export SKU**, and it sold out on release, so the only images in circulation are retail listings,
  resale listings, and press photos — all copyrighted.

Consequently this post carries **no image of the product itself**. Every image below is captioned
for what it positively *is*. Per the Blog Reference Image Standard, no caption hedges ("similar to",
"not the actual product", "shown for illustration") — such a caption is a hard reject, and the fix
is to replace the image, never to patch the caption.

---

## Images used

### 1. `korean-convenience-store-ramyeon-wall-hongdae.jpg` — RECOMMENDED HERO
- **Proposed caption:** "Floor-to-ceiling shelves of Korean instant ramyeon at the Ramyun Library
  shop in Hongdae, Seoul."
- **Source:** "24 hours Ramyeon Ramen convenience store (South Korea)", via Wikimedia Commons:
  https://commons.wikimedia.org/wiki/File:24_hours_Ramyeon_Ramen_convenience_store_(South_Korea).jpg
- **Original:** Flickr, https://www.flickr.com/photos/fri13th/53691620984/
- **Photographer:** lazy fri13th
- **Licence:** **CC BY 2.0** — attribution required. Credit line must name the photographer and
  the licence. Shot 2024-03-09; source 4032×3024.
- **Why it fits:** the article is about a packaged snack selling out on Korean retail shelves. This
  is a real Korean shop interior packed wall-to-wall with Korean packaged goods and visible price
  tags — Korean packaging and hangul signage throughout ("라면 RAMYUN Library", 농심, 진라면).
  It is the closest genuine visual to the retail scarcity the post describes.
- **Delivered:** 1600×1200, 290 KB, EXIF/GPS stripped.

### 2. `orion-kimchi-flavoured-potato-chips.jpg`
- **Proposed caption:** "Orion's kimchi-flavoured potato chips, one of the snacks the company sells
  year-round."
- **Source:** "Orion Korean kimchi flavored potato chips", via Wikimedia Commons:
  https://commons.wikimedia.org/wiki/File:Orion_Korean_kimchi_flavored_potato_chips.jpg
- **Photographer:** Fumikas Sagisavas (own work)
- **Licence:** **CC0 1.0 Public Domain Dedication** — no attribution required (credited anyway).
  Shot 2024-09-05; source 4000×3000.
- **Why it fits:** it is a product from the **same manufacturer** discussed in the article, from
  Orion's permanent lineup rather than the limited edition. The caption asserts only what the CC0
  uploader documented, and makes no reference to the cheese chip.
- **Note:** the chips are shown out of the bag, so no Korean packaging is visible. This is a
  culturally neutral close-up, which the Korea-first rule explicitly permits as a fallback — the
  disqualifying case is a *visibly foreign* image, which this is not.
- **Delivered:** 1400×1050, 239 KB.

### 3. `gs25-convenience-store-itaewon-seoul.jpg`
- **Proposed caption:** "A GS25 convenience store on a corner in Itaewon, Seoul."
- **Source:** Pexels photo 34714140,
  https://www.pexels.com/photo/street-corner-in-itaewon-seoul-with-gs25-storefront-34714140/
- **Photographer:** Katja Engkusen, https://www.pexels.com/@katja-engkusen-2157420955
- **Licence:** Pexels licence — free commercial use, attribution not required.
- **Location verified in-frame:** the storefront reads "GS25 이태원점" (Itaewon branch) and the
  blue street plate reads "녹사평대로40길 / Noksapyeong-daero 40-gil", a real street in Yongsan-gu,
  Seoul. Location is proven by the image itself, not by the stock caption.
- **Processing:** source is portrait (3264×4928). Cropped to landscape around the storefront,
  keeping the branch sign and street plate legible. No colour manipulation.
- **Delivered:** 1500×1023, 290 KB.

---

## Rejected candidates — recorded so they are not re-tried

| Candidate | Verdict | Reason |
|---|---|---|
| Pexels **36981899** (was flagged in prior research as "best interior option, verified Korean") | **REJECTED — not Korea** | Visual inspection contradicts the earlier note. The frame shows a **Wall's** ice-cream freezer (a Unilever brand not sold in Korean 7-Elevens), Häagen-Dazs, a reversed "SAINT LAURENT" storefront reflection, and **zero hangul anywhere**. The Pexels alt text never claimed Korea. Almost certainly Southeast Asia or Europe. Disqualified under the Korea-first rule. |
| Pexels **20124001** (GS25 "entrance") | **REJECTED — Vietnam** | Signage in the frame is **Vietnamese**: "KHU GHẾ / VỰC NGỒI / SEATING AREA" and "LẦU 1". This is a GS25 in Vietnam, not Korea. |
| Pexels **34357798** | **REJECTED** | Labelled only "Asian", country unverified. |
| Pexels 28529894, 38581313 | Not used | Verified Korean but portrait-only and duplicative of image 3's role. Available if a future post needs them. |
| Pexels **36522093** (7-Eleven, Nami Island, Gapyeong) | Verified Korean, **held as backup** | Genuinely Korea — "Nami Island" appears on the storefront with hangul shop signs alongside. Passed dedup. Not used only because Blog `316` is already a Nami Island post and image 3 (Seoul) fits an urban sellout story better. Safe to use later. |
| Commons `File:GS25 alcohol selection seoul.jpg` (CC BY-SA 4.0) | Not used | Real Seoul GS25, but the shelves shown are **alcohol**, not snacks — weak topical fit for a snack-scarcity article, and portrait 3024×4032. |
| Commons `File:Daiso_Namdaemun-ro_No.1_store.jpg` | Unusable | Returns 404; filename does not exist. |
| Commons Korean CVS snack-aisle interiors | None exist | ~110 GS25 results on Commons are almost entirely exteriors. Daiso Korea is exteriors only. |
| Pexels "snack aisle" | Disqualified | Results are predominantly Mexico / US / Russia. |

## Dedup checks performed (2026-07-31)

- `node scripts/audit-image-uniqueness.mjs --check-id {id}` run on all six Pexels candidates
  (36981899, 34714140, 20124001, 28529894, 38581313, 36522093) — **all reported "not used anywhere
  on the site yet. Safe to use."**
- Grepped every `public/assets/images/posts/*/image-sources.md` and
  `public/assets/images/business/*/image-sources.md` for the Commons filenames, the Flickr photo ID
  53691620984, and each photographer name. No image reuse found. Two near-miss matches were checked
  and cleared:
  - "Fumikas" appears in `business/korean-health-supplement-suppliers/image-sources.md`, but for a
    **different** CC0 file (`Red_ginseng_slices_(20240124).jpg`) — same photographer, different image.
  - "Nami Island" appears in `posts/316/image-sources.md`, but for Commons **tree/landscape** photos,
    not any candidate here.
- All three delivered files verified as real JPEGs with `file` after download and after optimisation.


---

## 편집상 제외 — orion-kimchi-flavoured-potato-chips.jpg (2026-07-31)

**소싱은 정상이었으나 편집 판단으로 삭제했다. 라이선스 문제가 아니다.**

- 원본: Wikimedia Commons `File:Orion_Korean_kimchi_flavored_potato_chips.jpg`, CC0 1.0, Fumikas Sagisavas
- 제외 사유 두 가지:
  1. **글의 핵심 논지와 시각적으로 충돌한다.** 이 글은 "촉촉한 황치즈칩은 칩이 아니라 쿠키다"를
     별도 섹션으로 설명하는데, 감자칩 사진을 실으면 그 설명을 정면으로 반박한다.
  2. **사진에 봉지·브랜드가 보이지 않는다.** 나무 테이블 위 낱개 칩 더미라, 캡션이 주장하는
     "오리온 김치맛"을 독자가 사진으로 확인할 수 없다. 파일명만 근거로 브랜드를 단정하는 셈이 된다.

**다시 쓰지 말 것.** 오리온 제품이라는 이유만으로는 이 글에 맞지 않는다.
향후 이 글에 4번째 이미지가 필요하면 검증된 백업을 쓴다: Pexels 36522093 (남이섬 7-Eleven,
간판에 "Nami Island" 판독 가능), 28529894 / 38581313 (서울 7-Eleven 세로 구도).
