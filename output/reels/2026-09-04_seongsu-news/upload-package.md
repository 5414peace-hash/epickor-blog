# Upload package — NEWSDESK 003, 성수 (2026-09-04)

**NOT scheduled. Awaiting the representative's phone review (sound on and off).**

| | |
|---|---|
| File | `epickor-reel-seongsu-news-v003.mp4` |
| Length | 25.5s (765 frames @ 30fps) |
| Format | 1080×1920, h264 |
| Audio | AAC 192k mono, **−14.8 LUFS, peak −1.4 dBFS** |
| Caption | `instagram-caption.txt` |
| Source post | `/blog/232` — refreshed and live-verified 2026-09-04 |
| Kit | `remotion/NewsdeskKit.tsx` · spec `remotion/ReelSeongsuNews.tsx` |
| Voice | Daniel — Steady Broadcaster (`onwK4e9ZLuTAKqWW03F9`), lane `anchor_deadpan` |
| Sound | Palette **`atelier`** — camera shutter, garment-bag zip, sewing machine, door chime |
| Outro | Bank **D — BEFORE YOU LAND**, spoken |

## Why this one is a correction, not a report

The other two reels in the batch report a number. This one corrects one, which is the thing a news
desk does that no other format does at all. Several Korean outlets ran *"two-thirds of shoppers are
foreigners"* about Musinsa Megastore Seongsu. That was **9 June 2026** — a single-day peak of 66%.
Across the first fifty days it was **just over 40%**, about ₩3bn of ₩7bn. Saying so on screen, in
the anchor's flat register, is the beat the format was built for.

Underneath it is the reversal: **Korea's biggest fashion store is not in a fashion district.** It
is in Seongsu, an old shoe-and-leather factory quarter, and guides written before April 2026 still
send people across the river to Apgujeong.

## Sound — its own vocabulary, not the other reels'

*"각각의 편에 맞는 효과음을 넣어야지 같은 효과음을 여러편에 돌려쓰지마."*

The grammar is shared with the other two — a wipe always sounds like one thing, a cut like another,
the counter always ratchets — because that is what makes the sound read as the format. The
vocabulary is this reel's own, and it comes from what Seongsu was and is:

| Event | Sound |
|---|---|
| lower third wipes in | camera shutter |
| cut changes | garment bag zipped |
| figure counts to 40% | **industrial sewing machine** — the district's own history |
| outro card rises | boutique door chime |

## QA record

| Gate | Result |
|---|---|
| Frames | 765, matches the composition ✅ |
| Loudness / true peak | −14.8 LUFS, **−1.4 dBFS after AAC** ✅ |
| Playback band 400 Hz–4 kHz | max **−2.6 dB** ✅ |
| Screen-speech agreement | beat-by-beat sheet, `qa-cutsheet.jpg`. **One defect found and fixed — below** |
| Bright foley on voiced audio | none. The script refuses to write a file otherwise ✅ |
| Upscale | **zero** — every plate is a 9:16 window, downscaled 0.48×–0.63× ✅ |
| Motion cards | zero, by kit design ✅ |

**What QA caught.** The chyron `THE PRESS SAID TWO-THIRDS` clipped its final S against the panel
edge. The kit dropped to a smaller size only past 30 characters, but the usable panel is 830px and
at 54px Archivo 800 that runs out at about 25. Fixed in the kit with three measured tiers, so it
cannot recur, and the line was shortened to `PRESS SAID TWO-THIRDS`, which reads better anyway.
Neither of the other two reels has a chyron over 23 characters, so the kit change leaves them
untouched.

**Two pauses of 0.66s and 0.73s register as silence inside the programme, and both are correct.**
They are the sentence break before the Seongsu reveal and the paragraph break into the headline
correction — an anchor's pauses, not dropouts. Nothing sounds in them because **nothing happens on
screen in them either**; the foley fires when the picture changes, which is the whole design.

## Three plates replaced after review (2026-09-04)

*"성수는 1,2,4 번째 이미지 들이 다 너무 별로다."* Right on all three, and they failed the same way:
**nothing was happening in any of them.** An empty Cheongdam boulevard of sky and road, a hazy drab
workshop, and a beige cafe that was not fashion at all. Replaced with Garosu-gil outside the
flagship, brick Seongsu with a FOREST VINTAGE sign and people crossing, and a Seongsu street full
of shoppers. The set now carries people in four frames instead of two.

**c1 needed its chyron changed too, not only its picture.** The line is "not in a fashion district",
so the frame has to BE one — and `NOT A FASHION DISTRICT` over a photo of a fashion district reads
as a claim about the picture. It now says `NOT GAROSU-GIL / 신사동`: name what is on screen, then
negate it, which is the Dongmyo opening pattern.

**sharp ignores EXIF orientation unless `.rotate()` is called.** Three portrait candidates rendered
on their side in the review sheet. Now applied in `prep-plates.mjs`.

## No video, and that is a sourcing fact rather than a shortcut

No photograph of the Musinsa building exists under a usable licence, Commons has no Gentle Monster
Seoul house, and there is no licensable Seongsu footage. So the reel is written at the level the
pictures can support: it is about the **district**, and every sentence names Seongsu rather than a
building nobody can show. Seven cuts across six beats hold the cadence at about 1.5s per state
change, the same as the two reels before it.

The one thing the frames do better than any building shot could: the kicker is a shopfront whose
neon reads **CLOSED** on a facade that reads **INDUSTRIAL** — one photograph proving both the last
line and the opening one.

## Scheduling

The Instagram calendar is full through **09-28**. First free day is **09-29**. This reel and the
other two NEWSDESK reels are unscheduled and wait on the phone review.
