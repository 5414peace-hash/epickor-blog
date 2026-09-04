# Sources — NEWSDESK 003, 성수

## Photographs — all Wikimedia Commons, CC BY-SA 4.0, all by CartoonChess

Every original is **4032×3024**, so a 9:16 window is 1701×3024 and the 1080×1920 plate is a
**0.63× downscale. There is no upscale anywhere in this reel.**

| Plate | Commons file | Window | Carries |
|---|---|---|---|
| `c1_cheongdam.jpg` | [File:Cheongdam Intersection.jpg](https://commons.wikimedia.org/wiki/File:Cheongdam_Intersection.jpg) | centre | the district it is *not* |
| `c2_industrial.jpg` | [File:Industrial buildings in Seongsu-dong.jpg](https://commons.wikimedia.org/wiki/File:Industrial_buildings_in_Seongsu-dong.jpg) | x0.45 | "old factories" — a workshop with towers behind it |
| `c3_intersection.jpg` | [File:Small intersection in Seongsu-dong.jpg](https://commons.wikimedia.org/wiki/File:Small_intersection_in_Seongsu-dong.jpg) | centre | "and now this" — white wall, red block |
| `c4_storefronts.jpg` | [File:Seongsu-dong storefronts.jpg](https://commons.wikimedia.org/wiki/File:Seongsu-dong_storefronts.jpg) | centre | the shops visitors come for |
| `c5_evening.jpg` | [File:Evening street in Seongsu-dong.jpg](https://commons.wikimedia.org/wiki/File:Evening_street_in_Seongsu-dong.jpg) | centre | "that was one day" |
| `c6_night.jpg` | [File:Urban nightscape of Seongsu-dong.jpg](https://commons.wikimedia.org/wiki/File:Urban_nightscape_of_Seongsu-dong.jpg) | centre | the 40% figure |
| `c7_closed.jpg` | [File:A closed shop in Seongsu-dong.jpg](https://commons.wikimedia.org/wiki/File:A_closed_shop_in_Seongsu-dong.jpg) | x0.45 | the kicker |

**Two windows are off-centre on purpose.** `c2` and `c7` each carry text the narration depends on —
the workshop's Korean signage and the shopfront's neon `CLOSED` — and a centre crop clipped them.
That is the failure the Olive Young cut sheet caught when "Fourteen lanes" ran over lanes 11–13.

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
