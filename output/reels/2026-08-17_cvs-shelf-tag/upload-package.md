# Upload package — CVS Shelf Tag

**File**: `EPICKOR_CVS_SHELF_TAG.mp4` · 25.2s · 1080×1920 · 30fps · 7.3 MB
**Kit**: `remotion/CounterKit.tsx` (COUNTER, third use)
**Render**: `v003` · video 2.31 Mbps h264 · audio AAC 192k · **no narration**
**Source posts**: `361` · `359` · `360` · `366` · funnels to `376`

## Status

**HOLD — not scheduled.** Third of three COUNTER reels held for one combined booking session
with the 2026-08-17 card-news trio (395 / 392 / 394).

## Why this topic

`korean convenience store breakfast` is the site's highest-CTR query — **14.75% on 61
impressions**, the measurement the whole "pointed beats voluminous" thesis rests on. This
reel sits in that cluster.

It is also a rebuild of **reel 376's subject**. 376 was the convenience-store deals reel
whose frame extraction proved the old kit was slower than card news. Running the same topic
through COUNTER gives the cleanest comparison available: identical subject, two kits.

**It could not have been made honestly before today.** Both ramyeon prices in the repo are
for CUP formats, and every ramyeon photograph was a packet until the representative supplied
the two cup shots. Pairing a cup price with a packet photo is the 2026-08-03 카드뉴스 defect.

## The thesis, and its one honest complication

The listed price is not what Koreans pay — but there are **two** mechanisms, not one. Three
blocks show a promotion; Pocachip shows a different shelf entirely. The `where` line names
the mechanism on every block, so the reel does not pretend they are the same thing, and the
break gives block four a payoff.

| Product | List | Real | Mechanism | Source |
|---|---|---|---|---|
| 진라면 매운맛 컵 | ₩1,100 | ₩825 | 3+1 / 2+1, three chains, 3 Aug 2026 | `361` |
| 너구리 큰사발 | ₩1,900 | ₩1,267 | 2+1 at CU, 3 Aug 2026 | `359` |
| 밀키스 250ml | ₩1,500 | ₩1,000 | 2+1 at GS25 | `360` |
| 포카칩 66g | ₩1,700 | ₩1,100 | **supermarket multipack — not a promotion** | `366` |

## Palette — the store, not the pack

Sampled across all four finished panels: red dominates at hue 355–358 with chroma to 210,
then neutral grey at hue 205–207. The ramyeon reel already owns warm cream with red on it,
so this one takes the **cool half** of the measurement — fluorescent grey-white ground,
steel-slate accent, the measured `#ED1B2D` as the price. That is also the truer read of the
subject: the products are red but the shop is cool light and grey shelving, and this reel is
about the shelf tag.

Three reels, three palettes, all measured from their own products. Nothing carried over.

## Panels — a different fit rule from the ramyeon reel

Those were three packets of near-identical aspect, so filling 74% of the panel height gave
consistent cards. This reel mixes shapes: two cups near square (0.96, 0.99), a tall narrow
can, and a wide two-bag shot. So the product is fitted inside 92% of panel width by 88% of
height, whichever binds, and centred. The panel stays a constant 0.535; only the margin
varies. A square product can only fill about half a 0.535 portrait's height, and that is
fine — it still renders ~370px wide.

**Padding colour is measured per image.** The first pass padded everything white and the
Milkis panel showed a visible grey rectangle, because that shot sits on a grey gradient
sweep. Matching each pack's own border median makes the pad invisible.

The Jin Ramen cup arrived letterboxed in a 1920×1280 canvas; the border-deviation trim
removed the bars for free, which is exactly why the trim is measured rather than using
`sharp.trim()` — that keys off the top-left pixel, which here is inside a black bar.

## Audio

Synthesised bed, 47 events. Grid is identical to the beauty reel (four products, all with a
list price), so only the key differs: **B2 sus2**, a tone above the beauty reel's A2 —
brighter, for a fluorescent-lit subject.

Measured on the final file: **−14.2 LUFS, −3.7 dBTP, LRA 3.7, no silence ≥0.4s**. Cut frames
66/192/318/444/570/678 read −3.7 to −4.0 dB against −7.4 to −9.3 dB mid-block. The 40 Hz
2-pole high-pass found on the ramyeon reel is in the chain from the start here.

## Checks run

| Gate | Result |
|---|---|
| Frame 0 complete (grid thumbnail) | Pass |
| Hook lines fit unbroken | **Fixed** — 'THE SHELF TAG' overflowed 118px and the browser orphaned 'TAG' on its own line. Now 'THE TAG'. Nothing throws; caught on the contact sheet |
| Safe areas / action rail | Pass |
| Hangul renders | Pass — 진라면 매운맛 컵 · 너구리 큰사발 · 밀키스 · 포카칩 |
| Product identity (price format = photo format) | Pass — cup prices on cup photos, for the first time |
| Panel resolution | Pass — subjects 939×975, 499×504, 1398×1312, 1195×900 |
| Audio/video sync | Pass |
| True peak under 0 dBTP | Pass at −3.7 |

## Not yet done

- **Phone review, sound on and off.** Representative's step.
- **YouTube Shorts cut.** Bed is original, so it clears there; the description can carry a
  clickable link.

## Scheduled

**2026-09-02 05:00 KST**, Instagram and Facebook, via Meta Business Suite on 2026-08-18. Cover is frame 0 of the render, uploaded explicitly rather than left to Meta's auto-suggestion, because the first frame is the designed thumbnail.
