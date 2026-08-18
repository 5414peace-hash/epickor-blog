# Upload package — 우지 파동 (DOSSIER prototype)

**File**: `EPICKOR_UJI_DOSSIER.mp4` · 29.1s · 1080×1920 · 30fps · 5.3 MB · **no narration**
**Audio-only copy**: `EPICKOR_UJI_DOSSIER-audio-only.m4a`, for testing the sound in isolation
**Render**: `v004` · video 1.36 Mbps h264 CRF 14 · audio AAC 192k
**Kit**: `remotion/DossierKit.tsx` (**D안 / DOSSIER**, first use)
**Source post**: `219` — *Korean Ramen Went Premium: Why a Packet Now Costs ₩1,900*

> **There is now exactly one video file in this tree**, and it is this one. The silent
> `-video-only` working renders have been deleted rather than renamed, because renaming them
> was not enough.

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

## The opening, and why it was wrong

The card that opens the reel used to be a **still**. Frame 0 has to render complete because it
is the grid thumbnail, and that requirement quietly turned into "animate nothing" — so the
first 1.8 seconds of a 29-second reel were a static page, which is the worst possible place to
spend them. Representative: *"맨 처음 인트로에 나오는 문장이 더 임펙트 있어야할듯 … 색이
바뀌면서 깜빡깜빡 거리면서 효과음이 이쁜게 같이 나온다던가 (스테이플러 찰칵 거리는 소리)."*

The two requirements only conflict if the animation is an **entrance**. Every line is present
and final on frame 0 — the thumbnail is still the finished headline — and the motion is a
**stamp passing down them**: ACCUSED, then DESTROYED, then INNOCENT, each inverting to a solid
red block twice before reverting, then the footer. Hard cuts, no fades: a stamp has either
landed or it has not, and a ramp at 112px reads as a glow rather than an impact.

Each invert carries a **stapler snap** — a bright metallic strike with a very fast decay over a
slower body, which is the ratio that separates *snap* from *ping*. The press is full and the
release 9 dB lighter, because a stapler is two sounds. Resonances are C6/G6/C7, the pentatonic
root two and three octaves up, so a hard mechanical sound still lands consonant with the bells.

`TITLE_AT` / `FOOTER_AT` are **exported from `DossierKit.tsx` and read by `build-bgm.py`**. The
snap and the invert are one event; a beat table living in two files is a table that will
eventually disagree, which is exactly how the captions drifted on 2026-08-04. Measured on the
final: press frames −3.0 dB, release frames −12.0 dB, and −57.1 dB between them.

## Audio — effects only, no bed

**The drone is gone.** Three versions of a sustained bed were built and all three were wrong;
the last was the worst, because chasing audibility on a phone gave the motor vibrato partials
at 392/588/784 Hz and a stack of detuned vibrato sines is exactly the sound of a flying saucer.
Representative's verdict: *"ufo 처럼 나는 background 소리는 진짜 별로다 그냥 없는게 나을듯."*

A continuous synthetic tone under a 28-second reel has nowhere to hide — the viewer hears it
the whole time, so whatever character it has becomes the character of the reel. Discrete events
do not have that problem; they are gone before they can wear out.

So: silence between events, and every event a struck bell. Fast attack, harmonic partials that
collapse in the first tenth of a second, a warm tail. **Every pitch comes from one C major
pentatonic table**, which has no semitone in it, so any combination is consonant — and that
matters here more than usual, because the year counter fires 62 times, at one point every 2.6
frames, and the tails overlap. Chromatic, that is a pile-up. Pentatonic, it is a music box.

The run rises: tick *k* of a span takes degree *k* mod 10 of a two-octave table, so crossing a
gap is an ascending figure and a longer gap simply gets more of it. Sound and picture say the
same thing, which was the point of the ratchet in the first place.

| | |
|---|---|
| Loudness | **−14.41 LUFS** |
| True peak | **−2.85 dBTP** after AAC |
| LRA | **9.7**, against 2.1 for the drone version — the strikes actually punch now |
| Longest gap between strikes | 1.4s, on an entry card. Intended: an effects-only track has real silence in it and no processing should "fix" that |

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
| Through a phone speaker (>400 Hz, <9 kHz) | **−24.3 dB** over the first three seconds, against **−33.8 dB** for the CVS shelf-tag reel |

### On "소리가 안들림" — reported twice

The first report was the silent working renders: every Remotion output carries an empty AAC
track, measured −91.0 dB across every reel folder in this repo. Renaming them was not enough,
so they are deleted; the deliverable is the only video file left.

The second report was **the bed itself, and the meters were the wrong instrument.** Integrated
loudness said −14.9 LUFS and a phone-band simulation said it was *louder* than a reel already
accepted — both true, and both useless, because the bed's weight sat at 49–245 Hz. A third of
the headroom was spent on a 49 Hz fundamental that no phone or laptop speaker reproduces, and
the peak normalisation then pushed everything audible down to make room for it.

**A bed you cannot hear on the device it is watched on is silent, whatever the meter says.**
The motor now sings at 392/588/784 Hz with vibrato, the ratchet has a resonant body at
1.6/2.5/3.7 kHz instead of being a bare noise burst, and the shutter has a mechanical clack
over its thud. The low end is kept only to give the machine a body on headphones. That is
+9.5 dB where a small speaker works, at the *same* integrated loudness.

The lesson generalises past this reel: measure the playback band, not the full band.

## Not yet done

- **Phone review, sound on and off.** Representative's step.
- **Second subject**, to prove the kit is a tool rather than a design.

## Scheduled

**2026-09-06 05:00 KST**, Instagram and Facebook, via Meta Business Suite on 2026-08-18. Cover is frame 0 of the render, uploaded explicitly rather than left to Meta's auto-suggestion, because the first frame is the designed thumbnail.
