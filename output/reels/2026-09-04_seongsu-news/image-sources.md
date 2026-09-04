# Sources — NEWSDESK 003, 성수

## Photographs — all Wikimedia Commons, licence per row below

Sources run 3000×4000 to 4032×3024, so every 9:16 window is a **0.48× to 0.63× downscale. There is
no upscale anywhere in this reel.**

| Plate | Commons file | Licence | Carries |
|---|---|---|---|
| `c1_garosugil.jpg` | [File:Apple 가로수길 01.jpg](https://commons.wikimedia.org/wiki/File:Apple_가로수길_01.jpg) | CC BY 2.0 kr | the district it is *not* — Garosu-gil, 신사동 |
| `c2_brick.jpg` | [File:Seongsu Street 01.jpg](https://commons.wikimedia.org/wiki/File:Seongsu_Street_01.jpg) | CC BY 4.0 | "old factories" — brick, a FOREST VINTAGE sign, people crossing |
| `c3_intersection.jpg` | [File:Small intersection in Seongsu-dong.jpg](https://commons.wikimedia.org/wiki/File:Small_intersection_in_Seongsu-dong.jpg) | CC BY-SA 4.0 — CartoonChess | "and now this" — white wall, red block |
| `c4_crowd.jpg` | [File:Seongsu Street.jpg](https://commons.wikimedia.org/wiki/File:Seongsu_Street.jpg) | CC BY 4.0 | the shops visitors come for — a street full of them |
| `c5_evening.jpg` | [File:Evening street in Seongsu-dong.jpg](https://commons.wikimedia.org/wiki/File:Evening_street_in_Seongsu-dong.jpg) | CC BY-SA 4.0 — CartoonChess | "that was one day" |
| `c6_night.jpg` | [File:Urban nightscape of Seongsu-dong.jpg](https://commons.wikimedia.org/wiki/File:Urban_nightscape_of_Seongsu-dong.jpg) | CC BY-SA 4.0 — CartoonChess | the 40% figure |
| `c7_closed.jpg` | [File:A closed shop in Seongsu-dong.jpg](https://commons.wikimedia.org/wiki/File:A_closed_shop_in_Seongsu-dong.jpg) | CC BY-SA 4.0 — CartoonChess | the kicker |

## Three plates were replaced (2026-09-04)

*"성수는 1,2,4 번째 이미지 들이 다 너무 별로다."* Correct on all three, and they failed the same
way: **nothing was happening in any of them.** c1 was an empty Cheongdam boulevard of sky and
road; c2 a hazy drab workshop; c4 a beige cafe that was not fashion at all. The replacements each
carry people and commerce, which is what all three sentences are about — the set now has people in
four frames instead of two.

**c1 also needed its chyron changed, not just its picture.** The line is "Korea's biggest fashion
store is not in a fashion district", so the frame has to BE a fashion district — and a lower third
reading `NOT A FASHION DISTRICT` over a photo of one would read as a claim about the picture. It
now reads `NOT GAROSU-GIL / 신사동`, which names what is on screen and negates it: the Dongmyo
opening pattern.

**EXIF orientation has to be applied explicitly.** `Seongsu Street.jpg` and `Seongsu Street 01.jpg`
are portrait frames that sharp renders on their side unless `.rotate()` is called with no argument.
Three candidates came out sideways in the review sheet before this was added to `prep-plates.mjs`.

**`c7` is off-centre on purpose.** It carries text the narration depends on — the shopfront's neon
`CLOSED` — and a centre crop clipped it. That is the failure the Olive Young cut sheet caught when
"Fourteen lanes" ran over lanes 11–13.

**`c7` is the frame of the batch.** A shopfront whose neon reads `CLOSED`, on a facade that reads
`VERANDA INDUSTRIAL`. One photograph proves the last line ("nothing there opens before eleven") and
the opening one ("old factories") at the same time.

## No video

These Seongsu frames are the only material that exists under a usable licence. There is **no
photograph of the Musinsa Megastore building** on Commons, no Gentle Monster Seoul house, and no
licensable Seongsu footage. The reel is therefore written at the level the pictures can support —
it is about the **district**, and no sentence names a building that cannot be shown.

## Downloads were verified, after two silent failures the same day

`scripts/fetch-commons.mjs` checks magic bytes and the byte count the API reports, and retries on
429/5xx. Both checks earned their place: a curl run left a truncated PNG that only failed several
steps later inside sharp, and a rate-limited fetch wrote 1,964 bytes of `<!DOCTYPE html>` into a
`.jpg` and reported success. Three of the six files here arrived broken on the first pass and were
re-fetched.

## Figures

Every number on screen and in the caption comes from `/blog/232`, refreshed and live-verified
2026-09-04.
