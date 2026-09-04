# Sources — NEWSDESK 002, 올리브영

## Photographs — all Wikimedia Commons, CC BY-SA 4.0

| Plate | Commons file | Author / date | Treatment |
|---|---|---|---|
| `still_aisle.jpg` | [File:OliveYoung Skin-care zone.jpg](https://commons.wikimedia.org/wiki/File:OliveYoung_Skin-care_zone.jpg) | Pkccccj, 2021-05-22 | 1080×1440 fitted over a blurred cover of itself. A 9:16 crop would have taken a 1.33× upscale and cut the shelving. |
| `still_storefront.jpg` | [File:OliveYoung store.png](https://commons.wikimedia.org/wiki/File:OliveYoung_store.png) | Pkccccj, 2021-05-07 | 1280×820 landscape, same blur-cover treatment. A 9:16 crop of it would be 461 px wide — a 2.34× upscale. |
| `still_makeup.jpg` | [File:OliveYoung Make-up zone.jpg](https://commons.wikimedia.org/wiki/File:OliveYoung_Make-up_zone.jpg) | Pkccccj, 2021-05-22 | as the aisle |
| `still_checkout_hall.jpg` | [File:Olive Young Myeongdong.jpg](https://commons.wikimedia.org/wiki/File:Olive_Young_Myeongdong.jpg) | Sgroey, 2024-08-19 | window L1850 w1453 → 1080×1920, **0.74× (downscale only)** |
| `still_checkout_lanes.jpg` | same original | same | window L2520 w708, 1.53× |
| `still_checkout_rows.jpg` | same original | same | window L1500 top500 w1100, 0.98× |
| `still_checkout_sign.jpg` | same original | same | window L700 top600 w1000, 1.08× |

**The four checkout plates are one photograph, four framings.** That is deliberate and it is the
allowed form of reuse: distinct derivative assets with their own paths, each existing to prove a
different sentence. The rule they satisfy is the one against repeating an identical `image:` path,
not a rule against returning to a subject.

**The window offsets were chosen by reading the picture, not by eye on a thumbnail.** At L1000 the
sign strip reads "SICAL PASSPORT"; at L560 it loses "TAX REFUND"; only L700 fits the whole phrase
`PREPARE YOUR PHYSICAL PASSPORT (FOR IMMEDIATE TAX REFUND)`. Checked at 1:1 pixels.

**`still_checkout_hall` replaced an earlier window at L1505.** That one contained lanes 11, 12 and
13 — and the narration says "Fourteen lanes." The first QA cut sheet caught it.

## Video — Pexels, licensed

| Clip | Pexels | Treatment |
|---|---|---|
| `cut_street_night.mp4` | [31801692](https://www.pexels.com/video/31801692/) — "vibrant night shopping street in seoul" | 3840×2160 → centre crop 1215×2160 → 1080×1920, no upscale. Source 23.976fps remapped 1:1 to 30fps with `setpts=PTS/1.2513`, so every source frame becomes exactly one output frame. Window 3.9–12.2s. |

**Why the frame rate was remapped rather than converted.** 23.976 → 30 by frame duplication repeats
every fourth frame, which is the judder CLAUDE.md forbids. Remapping 1:1 duplicates and interpolates
nothing; motion runs 25% quicker, which on a walking crowd reads as brisk. The window avoids a
passer-by whose back fills the frame before 3.9s and again after about 12s.

**The API's own metadata is not trustworthy on this clip.** An earlier survey reported it at 60fps;
every downloadable variant is 23.976. Frame rate is read from the file that will actually be used.

## Sourced and not used

- `32214385` — a busy Jongno alley seen from above. Nothing needed it. Screen-speech agreement
  beats a video-share target, and padding with an unmatched frame is exactly what got the
  2026-08-04 batch rejected.
- `31727285`, `31727146`, `31727147`, `31737273` — **rejected on subject despite Pexels slugs that
  say "myeongdong".** Three show the Bank of Korea's stone head office; one is an empty paved plaza.
  Neither a cosmetics store nor a shopping street.
- `36718310` — already used in the Dongmyo reel. Cross-reel reuse.

## Figures

Every number on screen and in the caption comes from `/blog/192`, refreshed and live-verified
2026-09-04, which cites CJ Olive Young corporate and Korean retail coverage 2026, the Korean
tourist VAT refund rules, and Olive Young product listings checked September 2026.
