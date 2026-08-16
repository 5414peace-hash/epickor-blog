# Image sources — Blog 393 (LG Styler)

Both images come from one photograph of the actual product, and the second is a deliberate
derivative crop — documented here per the house rule that a repeated source must be saved as a
distinct intentional asset with the reason recorded.

## Source photograph

- **Commons:** https://commons.wikimedia.org/wiki/File:LG_Styler,_IFA_2015.jpg
- **Author:** dambranslv — **attribution required, in the caption.**
- **Licence:** **CC BY 2.0** (derivatives permitted, which covers the crop below)
- **Original:** 3264x4896, shot at IFA Berlin 2015.
- **What it shows, verified by opening it:** an LG Styler standing open under booth signage
  reading `LG styler | Steam Clothing Care`, three garments (white shirt, blush blouse, dark
  jacket) hanging inside the lit cabinet, the water-tank area at the bottom, and a booth staff
  member holding the door open.

## 1. `lg-styler-open-ifa-2015.jpg` (hero, ogImage)

- Full frame, resized to 1000x1500, **130 KB**.
- **Why the full frame, person included:** this is a trade-show demonstration photo; the
  staffer opening the door reads as scale and use, which suits a "what is this machine"
  article. The caption states the IFA 2015 context explicitly — it is not passed off as a
  home or a Korean setting, and the timing (four years after the Korean launch, as LG took
  the category abroad) is itself part of the article's story.

## 2. `lg-styler-moving-hanger-rack.jpg` — intentional derivative crop

- Extract `left 700, top 900, 2300x900` from the same original, resized to 1200x470, **55 KB**.
- **What the crop shows, verified after rendering:** the cabinet ceiling — the white swinging
  Moving Hanger bar with three hanger slots clipped in, and the lit steam vent behind it.
- **Why a second crop of the same photo is justified:** the Moving Hanger is the invention —
  the one component that existed in no prior appliance, and the article's technology section
  is about exactly this part. No openly licensed photograph of the mechanism exists anywhere
  else (Commons has one Styler photo total). The caption identifies it as a detail crop of the
  hero image rather than presenting it as a separate photograph.

## Manufacturer route (0차) — attempted first, blocked

- `lg.com/us/styler-steam-closets` and the S3MFBN product page — **HTTP 403** to non-browser
  fetches.
- `lg.co.kr/media/release/22997` (the 10th-anniversary press release the article cites) —
  reachable but fully JS-rendered, zero extractable images.
- `live.lge.co.kr` — JS-rendered, one popup PNG only. `lgnewsroom.com` — DNS failure.
- Amazon product imagery — fetch-blocked, and marketplace imagery rights are unclear (same
  reasoning as posts 389–392).

## Rejected

- **`(제품이미지1) LG 그램 스타일.jpg`** and the other Commons "LG 스타일" press files — those
  are the **LG Gram Style laptop**, not the Styler. The Korean word 스타일 in a filename is not
  the appliance; caught by reading the filenames before downloading.
- **Samsung AirDresser** — zero usable Commons results; the AirDresser is described in prose
  and the comparison table only, with no image rather than a wrong image.

## Checks run

- **Cross-post uniqueness:** `LG Styler` / `IFA 2015` appear in no other post's
  `image-sources.md`. First use.
- **Size:** 130 + 55 = **185 KB** for the post.
- **Captions:** written after viewing both renders at full size. The hero caption names the
  trade-show setting; the detail caption names itself as a crop.
- `npm run audit:image-context -- --slug 393` run before commit.

## Gap worth noting

No openly licensed photo exists of a Styler **in a Korean home** — entryway placement, the
pants-press door, or the mirrored S3MFBN. Any Korean apartment or LG Bestshop could supply
all three in five minutes. Also missing everywhere: the Samsung AirDresser, for the
comparison section.
