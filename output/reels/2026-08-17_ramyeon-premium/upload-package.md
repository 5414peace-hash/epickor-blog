# Upload package — Premium Ramyeon

**File**: `EPICKOR_RAMYEON_PREMIUM.mp4` · 21.0s · 1080×1920 · 30fps · 5.7 MB
**Kit**: `remotion/CounterKit.tsx` (COUNTER, second use — this is the reuse test)
**Render**: `v005` · video 2.16 Mbps h264 · audio AAC 192k · **no narration**
**Source post**: `content/blog/219.md`

## Status

**HOLD — not scheduled.** Joins the combined booking session with the 2026-08-17 card-news
trio (395 / 392 / 394) and the K-Beauty Picker reel.

## What this proves

COUNTER was built for one reel and this is the test of whether it is a tool. Two things
had to come out of the kit before it could carry a second topic:

- **Palette.** It was a module constant sampled from a skincare hero plate. Now a `Palette`
  prop; the beauty values ship as `PALETTE_KBEAUTY`.
- **Copy.** The hook and decision headlines were hard-coded. The first ramyeon render called
  three packets *"FOUR KOREAN BOTTLES. ONE IS YOURS."* and credited *"Real Olive Young
  prices"* for two launch prices. Now a `Copy` prop. **The contact sheet caught this; the
  render succeeded and the file played fine.**

Everything else — geometry, timing, the ticker, the strike, the cut rhythm, the chip — was
reused unchanged.

## The motion runs the other way

On the beauty reel the price fell: list struck, real price counting up under it. Here it
rises. Post 219 is titled "Why a Packet Now Costs ₩1,900", so ₩1,000 is struck and the
number climbs to ₩1,500 and then ₩1,900. A rise is the more surprising direction, and it is
the article's thesis rather than a decoration on it.

Block one carries no strike: ₩1,000 is the reference the other two are priced against, not
a price that moved. Same precedent as Round Lab on the beauty reel.

## Palette

Sampled from `093/shin-ramyun-bag-official.jpg`, the one pack shot already in the repo:
black `#030202` at 35.8% and Shin red `#ea1c24` at 23.8%, chroma 206. The red is the price
colour verbatim, because on a Korean ramyeon shelf that red *is* the price tag. Cream ground,
brick accent. Nothing carried over from the beauty reel.

The three packs also escalate visually in the order the prices do — red, gold, cream.

## Audio

Synthesised bed, `build-bgm.py`, locked to this reel's grid: **36 events** — 6 cut thuds,
25 copy ticks, 3 price-counter runs, 2 domain-chip hits. Pad is G2 sus2, a tone below the
beauty reel's A2, for a warmer ground. Block 0 skips the list-price tick, mirroring the
picture.

Measured on the final file: **−14.1 LUFS, −3.6 dBTP, no silence ≥0.4s**. Cut frames
66/192/318/444/552 read −3.6 to −4.0 dB against −6.9 to −9.0 dB mid-block.

**Mastering note worth keeping:** the first mux measured **−0.0 dBTP** with the same chain
that gave the beauty reel −3.7. Clamping harder fixed the peak but flattened the cut accents
to 1–3 dB. The actual fix was a **2-pole high-pass at 40 Hz** — the G2 pad and the 58 Hz
thud were generating sub-40 energy that nothing can hear but that eats headroom. Removing it
gave the best numbers of any attempt: safe peak *and* 5.1 dB of accent separation.

## Checks run

| Gate | Result |
|---|---|
| Frame 0 complete (grid thumbnail) | Pass — hook, three packs and the source line all at full opacity |
| Safe areas / action rail | Pass — decision grid ends above y1100 |
| Dead or copy-less frames | Pass |
| Hangul renders | Pass — 신라면 · 신라면 골드 · 삼양1963 · 우지 6.87% |
| Product identity (named product = shown product) | Pass — all three are official pack shots of the exact named packet |
| Panel resolution | Pass — subject boxes 900×1099, 748×909, 498×613; upscale 0.61–0.91× |
| Audio/video sync | Pass — see above |
| True peak under 0 dBTP | Pass at −3.6 |
| Copy belongs to this reel | Pass — fixed after the v001 contact sheet |

## Not yet done

- **Phone review, sound on and off.** Representative's step; required by the Reels 2.1 gate.
- **YouTube Shorts cut.** Same file works — the bed is original so it clears there too, and
  the description can carry a clickable link.

## Post updated alongside

`content/blog/219.md` gained the 우지 6.87% / 131 g detail read off the packaging. The post
told the 우지 파동 story but never said the relaunched product prints its beef tallow
percentage on the front of the bag, which is the line that closes the loop.

## Scheduled

**2026-09-01 05:00 KST**, Instagram and Facebook, via Meta Business Suite on 2026-08-18. Cover is frame 0 of the render, uploaded explicitly rather than left to Meta's auto-suggestion, because the first frame is the designed thumbnail.
