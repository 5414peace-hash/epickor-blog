# Upload package — 우지 파동 (DOSSIER prototype)

**File**: `EPICKOR_UJI_DOSSIER.mp4` · 23.0s · 1080×1920 · 30fps · 3.8 MB
**Kit**: `remotion/DossierKit.tsx` (**D안 / DOSSIER**, first use)
**Render**: `v002` · video 1.19 Mbps h264 CRF 14 · audio AAC 192k · **no narration**
**Source post**: `219` — *Korean Ramen Went Premium: Why a Packet Now Costs ₩1,900*

## Status

**PROTOTYPE — not scheduled, and not part of tonight's batch.** Tonight's booking is the three
COUNTER reels plus the card-news trio (395 / 392 / 394). This is a fourth format for review.

## Why this exists

COUNTER and RECEIPT are both **lists**. The site's best material is single-subject and
**dated** — 우지 파동, Coway's 1998 IMF sale, Winia's liquidation, 약과's two bans, 라운드랩's
Dokdo day. None of those is a comparison, so no existing kit could hold them and they had no
Reels form at all.

Like RECEIPT, this kit needs **zero photography**. That was the constraint that blocked a whole
session, so both post-COUNTER kits are built to route around it.

## What it does that a carousel cannot

The power of a timeline is the **gap** between two dates, and a swipe destroys it: 1989 to 1997
in half a second. Here the years count in the gutter *between* entries, so the reader waits out
eight years and then twenty-eight. That is the only way elapsed time is ever felt.

**The accelerando is free, and it is the best thing in the reel.** A span runs
`22 + 2.4·years` frames, clamped at 74. So the 8-year gap gets 41 frames (5.12 per year) and
the 28-year gap gets 74 (2.64 per year) — the *longer* wait ticks *faster*. Nothing was written
to make that happen; it falls out of the clamp, and it is the right dramatic shape.

## The beats, all transcribed from `219`

| | Stamp | Fact |
|---|---|---|
| 1 | 1989 · 11 · 03 | Anonymous letter to prosecutors: industrial-grade beef tallow. Executives arrested |
| 2 | Within 3 months | Dobong-dong plant shuts ~3 months; share roughly **60% → 15%** |
| 3 | 1997 · 08 · 26 | Tallow was edible. Supreme Court acquits — nearly eight years on |
| 4 | 2025 · 11 · 03 | 삼양1963 launches. Same date, 36 years later. Fried in beef tallow |
| close | — | **우지 6.87%** printed on the front of a 131 g packet |

Sources on `219`: ZDNet Korea, Kyunghyang Shinmun, Lawtimes. The closing card credits them
on screen — a factual reel should say where the facts came from.

**Entry 2 deliberately shares entry 1's year.** The counter only runs where the year advances,
so the reel cuts straight from the letter to the damage, and the first span then reads
"8 YEARS LATER", matching the post's "nearly eight years after the accusation". Dating the
collapse to 1990 would have produced a seven-year count that quietly contradicted the article.

## Palette — the record, not the product

`FILM_DEFAULT`, unchanged: `#0E1114` ground, `#E9E4D8` emulsion, `#D4452F` stamp. The other
four reels take their palette from the product because they are *about* products. This one is
about a legal record. 1989 newspaper archives are physically stored on microfilm, and microfilm
is white type on black — so the reel looks like the thing it is assembled from. It is also the
first EpicKor reel on a dark ground and the first to use `FONTS.serif`, so it separates from
the grid on two axes at once.

## Audio

Synthesised bed, 86 events — a microfilm reader rather than a score. Motor hum with wow, a
shutter per cut, a **ratchet click per year**, type ticks per printed line, a stamp on the
verdict. The ratchet is the only element in any EpicKor bed driven by a number the picture is
also showing, and its tick times are computed from the kit's own timing formula so they cannot
drift out of sync.

Measured on the final file: **−14.8 LUFS, −2.8 dBTP, no silence ≥0.4s.** Cut frames read
−3.0 dB against −6.8 dB mid-cut (3.8 dB separation, inside the 3.4–7.0 band of the shipped
reels).

## Checks run

| Gate | Result |
|---|---|
| Frame 0 complete (grid thumbnail) | Pass — YAVG 40.2, title + sub + footer all fully rendered |
| Hook/head lines fit unbroken | Pass — all ≤13 chars at 104px serif |
| Rail vs text collision | **Fixed** — rail and copy both sat at x96, so a tick rendered through the T of "THEN NOTHING, UNTIL". Rail now owns x84, copy starts at x172 |
| Hollow lower half | **Fixed** — first render left the bottom ~55% black on all nine cuts. Each card now has a lower anchor: ghosted year, span bar, or source credit |
| Information rate | **Fixed** — entries' last event landed at frame 16 of 84, then held still for 2.3s (reel 376's exact defect). Body split into two printed paragraphs plus a late detail line: 5 events per entry |
| "N YEARS LATER" honesty | **Fixed** — appeared at `duration−22`, announcing "8 YEARS LATER" over a counter still reading 1995. Now lands only on arrival |
| Figure bar scale | **Fixed** — scaled to its own max, so 60% drew a *full* bar. `scale: 100` added |
| Hangul renders | Pass — 우지 파동 · 삼양1963 · 우지 6.87% · 131g |
| Type at full resolution | Pass — clean glyph edges at 1.19 Mbps; flat design, consistent with the CRF-insensitivity finding |
| True peak under 0 dBTP | Pass at −2.8 |

## Not yet done

- **Phone review, sound on and off.** Representative's step.
- **Second subject to prove the kit is a tool, not a design** — the same test COUNTER passed on
  its second and third use.
