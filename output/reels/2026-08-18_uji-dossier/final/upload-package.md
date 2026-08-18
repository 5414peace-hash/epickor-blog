# Upload package — 우지 파동 (DOSSIER prototype)

**File**: `EPICKOR_UJI_DOSSIER.mp4` · 28.3s · 1080×1920 · 30fps · 5.3 MB · **no narration**
**Render**: `v004` · video 1.36 Mbps h264 CRF 14 · audio AAC 192k
**Kit**: `remotion/DossierKit.tsx` (**D안 / DOSSIER**, first use)
**Source post**: `219` — *Korean Ramen Went Premium: Why a Packet Now Costs ₩1,900*

> **Play the file in `final/`.** The `*-video-only.mp4` files in the folder root are Remotion's
> renders and carry a **silent** AAC track — that is true of every reel folder in this repo, and
> it is what "소리가 안들림" turned out to be on 2026-08-18. The mastered audio exists only on
> the muxed final.

## Status

**PROTOTYPE — not scheduled, and not part of tonight's batch.**

## What changed after the first review (2026-08-18)

The representative's verdict on v002: design fine, **but with zero imagery an unfamiliar story
is not comprehensible.** That is correct, and it is a limit on this *reel*, not on the kit —
DOSSIER still runs image-free, but a subject nobody has heard of has to show itself.

Two changes:

**1. A 1963 origin card.** The reel used to open on the accusation, so a viewer met "Samyang
Foods" for the first time as a defendant and had no idea what the company or the product was.
It now opens where the post opens: 삼양라면, the first instant noodle made in Korea. The 26-year
counter that follows also does real work — it establishes an ordinary, successful company
*before* anything happens to it, so the collapse has something to fall from.

**2. Three exhibits, all from the manufacturer.** Provenance and rejected alternatives in
`public/assets/reels/uji-dossier/media/image-sources.md`; crops are reproducible via
`prep-exhibits.mjs`, which fails loudly if Samyang republishes the source sheet at a new size.

| Card | Exhibit | What it actually is |
|---|---|---|
| 1963 | A | Samyang's own 1960s TV advertisement — `우리나라 최초의 INSTANT 라면! 三養라면` |
| 2025 | B | The 삼양1963 retail packet, front |
| Close | — | The print line along the bottom of that packet, enlarged 2.2× |

**The closing exhibit is the reason the reel works now.** At 2.2× you can read
`제품 중 우지 6.87%, 비프추출물 1.05%(우정육 14.8%), 사골풍미분 1.02% 함유.` and
`중량 : 131 g` **in the photograph**. Every figure the closing card claims is visible in the
evidence, so the drawn 6.87% stamp is now a restatement rather than the only proof. Upscaling
normally fails review; it holds here because the source is a vector product render, and the
glyph edges were checked at full resolution.

**1989–1997 deliberately carry no exhibit.** No era-appropriate imagery exists that we can use,
and a modern packet or a stock ramyeon bowl on a 1989 card would be the 2026-08-03 카드뉴스
defect exactly — an image that contradicts the card naming it. Those three cards stay
typographic, and the collapse card has its own 60% → 15% figure.

## What it does that a carousel cannot

The power of a timeline is the **gap**, and a swipe destroys it. Here the years count in the
gutter *between* entries, so the reader waits out 26 years, then 8, then 28.

**The accelerando is free.** A span runs `22 + 2.4·years` frames, clamped at 74 — so the 8-year
gap gets 5.12 frames per year and the 28-year gap gets 2.64. The *longer* wait ticks *faster*.
Nothing was written to make that happen.

## The beats, all transcribed from `219`

| | Stamp | Fact |
|---|---|---|
| 1 | 1963 | 삼양라면 launches. By the late 1980s Samyang holds roughly 60% of the market |
| 2 | 1989 · 11 · 03 | Anonymous letter to prosecutors: industrial-grade beef tallow. Executives arrested |
| 3 | Within 3 months | Dobong-dong plant shuts ~3 months; share roughly **60% → 15%** |
| 4 | 1997 · 08 · 26 | Tallow was edible. Supreme Court acquits — nearly eight years on |
| 5 | 2025 · 11 · 03 | 삼양1963 launches. Same date, 36 years later. Fried in beef tallow |
| close | — | **우지 6.87%** printed on the front of a 131 g packet |

Sources on `219`: ZDNet Korea, Kyunghyang Shinmun, Lawtimes — credited on the closing card.

**Entry 3 deliberately shares entry 2's year.** The counter only runs where the year advances,
so the reel cuts straight from the letter to the damage, and the next span reads "8 YEARS
LATER", matching the post's "nearly eight years after the accusation".

## Palette

`FILM_DEFAULT`: `#0E1114` ground, `#E9E4D8` emulsion, `#D4452F` stamp. 1989 newspaper archives
are stored on microfilm and microfilm is white type on black, so a story assembled out of the
record looks like the record. First EpicKor reel on a dark ground and first on `FONTS.serif`.

## Audio

Synthesised bed — a microfilm reader, not a score. Motor hum with wow, a shutter per cut, a
**ratchet click per year**, type ticks per printed line, a stamp on the verdict. Tick times are
computed from the kit's own timing formula, so they cannot drift out of sync with the picture.

## Checks run

| Gate | Result |
|---|---|
| Frame 0 complete (grid thumbnail) | Pass |
| Head lines fit unbroken | Pass — all ≤13 chars at 104px serif |
| Rail vs text collision | Fixed in v002 — rail owns x84, copy starts at x172 |
| Hollow lower half | Fixed in v002; exhibits now occupy that band on three cards |
| Exhibit legibility | **Fixed in v004** — v003 ran plates at 420×310 beside a narrow caption column and they read as postage stamps. Now up to 848×566 with the caption at full width beneath |
| Image matches the card that names it | Pass — no exhibit on any card without era-appropriate material |
| Information rate | Fixed in v002 — 5 events per entry |
| Hangul renders | Pass |
| True peak under 0 dBTP | Pass at −2.36 |

## Measured on the final file

| | |
|---|---|
| Loudness | **−14.88 LUFS** (Instagram's target is −14) |
| True peak | **−2.36 dBTP**, measured *after* AAC, not before |
| Silence ≥0.4s | none |
| Cut/quiet separation | 3.4 dB |
| Above 500 Hz — what a phone speaker actually reproduces | **−22.6 LUFS**, i.e. 4.5 dB *louder* than the CVS shelf-tag reel that plays fine |

That last row is there because of the "소리가 안들림" report: it was not the bed. The bed is
audible and, in the band a phone can reproduce, louder than a reel already accepted. The file
played was one of the silent `-video-only` renders.

## Not yet done

- **Phone review, sound on and off.** Representative's step.
- **Second subject**, to prove the kit is a tool rather than a design.
