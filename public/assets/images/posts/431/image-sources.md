# Blog 431 — Korean Pain Patches — image sources

One manufacturer packshot, one Wikimedia Commons photograph, one EpicKor chart.

| File | What it shows | Source | License / credit |
|---|---|---|---|
| `korean-pain-patch-where-to-buy.jpg` | EpicKor decision card — convenience-store patches (methyl salicylate, 24h) against pharmacy NSAID patches (ketoprofen 30mg, sunlight warning) | Made for this post | Classifications per Korea's 안전상비의약품 list and MFDS safety letters, cited in the article |
| `ketotop-original-40-patches.jpg` | 케토톱 플라스타 오리지날, 40-patch pack | `handok.co.kr/uploads/product/20250702/1b962cac-a003-4c9e-ba18-a106438d2688.jpg` (official Handok product page, idx=92) | Manufacturer image, used for **product identification** in an editorial guide. No sponsorship or endorsement implied |
| `korean-convenience-store-gs25.jpg` | GS25 storefront on a Korean street | `commons.wikimedia.org/wiki/File:GS25_Donggu-dongchon-ro_branch_20161009_100716.jpg` | **CC BY-SA 4.0** — LERK |

**The packshot is doing evidence work, not decoration.** The pack front carries
`케토프로펜 30mg 함유`, the `일반의약품` classification badge, the `10.3 × 6.8cm` patch size and the printed
indications. Those are the article's central facts, read off the manufacturer's own image rather than
taken from a retailer's description — which is why the 0차 rule (manufacturer site first) mattered here.

**A photo we did not use, and why — this is the second time it has been caught.**
Commons' Korean pharmacy photographs (`Pharmacy Jongno 3`, `20200312 Siheung pharmacy 1`) look like the
obvious hero for an article about buying medicine in Korea. They are **COVID-era mask-purchase notices**:
`Pharmacy Jongno 3` is a rotated shot of a paper sign about mask rationing, with no pharmacy interior
visible at all. Post `344` had already inspected and rejected them for the same reason, and its
`image-sources.md` note is what flagged it here before the file went anywhere near the draft.
**The rejection note in a sibling post did the work a filename never could.** Keep writing them.

**Technical notes:**
- Handok's product page serves thumbnails at `/uploads/product/{date}/thumb/thumb2_{uuid}.jpg`.
  **Strip `thumb/thumb2_` to get the original** — 700×550 rather than a thumbnail.
- `jeilpharm.co.kr`'s product image path returned an 87-byte error page even with a `Referer`, so
  제일쿨파프 has no packshot here; the decision card carries it by name instead.

**Cross-post uniqueness:** the Handok URL and the Commons file appear in no other post's
`image-sources.md`, checked before download. Not stock-library photos, so no Pexels/Unsplash ID applies.

**Size:** 107 + 42 + 179 = 328KB for the post.
