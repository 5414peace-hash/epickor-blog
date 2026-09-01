# Blog 432 — Fucidin vs Madecassol — image sources

Three manufacturer packshots, two of them composited into EpicKor charts. **No stock library was used**
— Pexels and Unsplash have no photograph of a specific Korean pharmacy product, and a generic tube of
ointment would be exactly the "plausible substitute" the Blog Reference Image Standard rejects.

| File | What it shows | Source | Note |
|---|---|---|---|
| `korean-wound-ointment-decision.jpg` | EpicKor chart — stage 1 (Fucidin / Madecassol Care, pharmacy) vs stage 2 (plain Madecassol, Daiso ₩5,000), plus the cica connection | Made for this post | Ingredients and classifications read from the manufacturer pages below |
| `madecassol-vs-madecassol-care.jpg` | EpicKor comparison — the green 마데카솔연고 box against the yellow-green 마데카솔케어 box, with class, ingredient and label instruction under each | Composite of two Dongkook Pharm packshots: `dkpharm.co.kr/upload/product/174/마데카솔 8g연고_흰배경.jpg` and `/upload/product/140/마데카솔 케어.jpg` | Manufacturer images used for **product identification**. No sponsorship implied |
| `fucidin-ointment-dongwha.jpg` | 후시딘연고 10g tube | `dong-wha.co.kr/product/pimage/85_img1.jpg` (official product page, t_idx=85) | Same basis |

**Why the comparison image is a composite rather than two separate photographs.** The article's central
claim is that two boxes carry the same brand name and opposite instructions. A reader who cannot read
Korean cannot see that from the packshots alone — the labels have to be adjacent to the products, which
means one image, not two. Korean shoppers use box colour to tell them apart, so the colours are the
point and both boxes are shown at the same scale on white.

**Facts that came off these images rather than from prose sources:** the Fucidin tube carries Dongwha
Pharm's `SINCE 1897` mark, and the green Madecassol box carries `100% 식물성분`, which is exactly the claim
that makes a foreign buyer assume all Madecassol is plant-only.

**Technical notes for the next person:**
- Both `dkpharm.co.kr` and `dong-wha.co.kr` serve product images from predictable paths and accept a
  `Referer`. Dongkook's filenames are **Korean and must be percent-encoded** before `curl` will fetch them.
- `dong-wha.co.kr` refused a direct HTTPS connection to its product page in one tool but served the
  image fine over `http` with a browser user-agent.
- The generator `.tmp/make-432-assets.mjs` deletes its downloaded sources on success, so every stage is
  guarded with `fs.existsSync` — a re-render to fix a layout bug would otherwise crash. Same lesson as
  post 430; it is now standard in these scripts.

**Cross-post uniqueness:** none of these three source URLs appears in any other post's `image-sources.md`,
checked before download. Manufacturer images, so no Pexels/Unsplash photo ID applies.

**Size:** 85 + 105 + 17 = 207KB for the post.
