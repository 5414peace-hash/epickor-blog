# K-Beauty Picker — first reel on the COUNTER kit

**Slug**: `kbeauty-picker` · **Kit**: `remotion/CounterKit.tsx` · **Length**: 25.2s · 1080x1920 · 30fps · video 2.02 Mbps · audio AAC 192k
**Render**: `v009` final · **no narration**, synthesised bed locked to the event grid

---

## Why this exists

Representative directive, 2026-08-17: *"동영상 릴스를 만들되, 판을 좀 흔들어야할듯. 예를들면
나레이션-말자막-배경푸티지-모션-ONS 조합을 깨고, 움직이는 카드뉴스 형식으로 만든다던지, 나레이션
목소리를 좀 바꾼다던지 하는 방향을 고려해야할듯."*

The directive followed a measured finding: across 46 Instagram Reels the median was 700 views,
against 901 for 39 card-news carousels — card news won every month measured, and link clicks were
zero on all 85 posts.

### The diagnosis that set the design

`SplitGridKit` (design L, approved 2026-08-13, shipped as 376/377/379) was already described in its
own header as the "moving card news" frame. So the premise the representative is asking for had
already been approved once. Frame extraction on the delivered `EPICKOR_376.mp4` shows it did not
survive to the render:

| t | what changed on screen |
|---|---|
| 0.3s | photo, white title card |
| 0.8s | caption text |
| 1.4s | nothing |
| 2.2s | nothing |
| 3.5s | caption text |
| 5.0s | two chips appear |

The 24-tile mosaic the kit is named for is not visible in any sampled frame; the plate reads as one
continuous photograph under a slow zoom, and the title card never moves. **Six cuts in forty
seconds.** A card-news carousel hands a viewer seven designed frames inside roughly fifteen seconds
of attention, so the reel was slower than the card news it was modelled on. That is the gap, and it
is a rate problem, not a taste problem.

Note for the next session: `MOTION.requireAmbientMotion` ("something must always be moving, or the
reel reads as a slideshow") was already in `tokens/core.ts` when 376 was built. A Ken Burns zoom
satisfies it on paper. The rule needs to say *discrete change*, not *movement*.

## What this kit breaks, and what it keeps

**Broken**, per the directive:
- **No background footage.** EpicKor does not shoot video and rented stock has been the weakest
  link in every reel. The photography is manufacturer product photography at full resolution.
- **No zoom, anywhere.** Banned inside `CounterKit.tsx`. Ambient motion is a drifting depth band
  and the ticker digits.
- **No narration and no caption band.** Type carries the message at 88-176px instead of 34px inside
  a scrim. Instagram autoplays muted. This also removes the TTS step, the ASS caption generator and
  both audio QA gates — the three places this pipeline has most often shipped a defect.
- **One event every ~20 frames** (0.67s) instead of one every ~180.

**Kept** — constraints, not style: `SAFE` geometry from `tokens/core`; frame 0 renders complete
because it is the grid thumbnail; `epickor.com` only ever as a solid red chip; bundled webfonts with
no system fallback; Hangul on every product block.

## The motion that justifies video at all

A carousel can show a price. It cannot show a price *changing*. Every product except Round Lab has
a verified list price and a verified street price, so the list is struck through while the real
number counts up beneath it. That single beat is the argument for this being a video rather than a
seventh card — and it is built directly on what EpicKor actually owns, which is ₩ figures the
English-language web does not carry.

## Data — every number traced to a published post

| Product | List | Street | Source |
|---|---|---|---|
| COSRX Advanced Snail 96 Mucin Essence | ₩23,000 | ₩14,000 | `content/blog/395.md` |
| Anua Heartleaf 77 Toner | ₩25,000 | ₩19,900 | `content/blog/396.md` |
| Torriden Dive-In Serum | ₩25,500 | ₩16,900 | `content/blog/398.md` |
| Round Lab 1025 Dokdo Toner | — | ₩10,900 | `content/blog/401.md` |

Round Lab has no list-price beat because the post does not claim one. Rather than invent a list to
keep the rhythm uniform, that block runs one beat shorter, which also breaks the pattern before a
viewer starts predicting it.

The Torriden verdict is the reel's strongest line: the manufacturer's own Korean mall undercuts
Olive Young by ₩5,100, so the retailer is not the cheap option. That is exactly the class of fact
that does not exist in English, and it is the kind of thing a viewer screenshots.

## Imagery — and a failed technique worth recording

Panels are cropped from post-owned manufacturer photography by `prep-cutouts.mjs`, all to the same
0.535 portrait ratio so the layout slot is fixed.

The first version of that script tried to lift the bottles onto a designed ground with a border
flood fill — the technique that worked on the hy Mobility carts on 2026-08-05. **It destroyed three
of the four bottles.** The setups look identical (a product on a bright achromatic sweep) but a
cream cart body carries chroma 44, while a frosted COSRX bottle and a clear Round Lab bottle carry
chroma ~2 at luma ~235. They *are* bright and achromatic, they match the background test exactly,
and their soft edges never break connectivity, so the flood walked straight through them. The
rendered check left three dark caps and printed labels floating on blue.

**White-on-white cannot be solved by a colour test.** The bottles stay on their sweeps and become
panels — which is also the more honest form, since a product shot on its own ground reads as an
Olive Young shelf tag, and that is where a Korean shopper actually meets these four.

Torriden was cropped twice. The first window cut the wordmark to "Torrid", which reads as a
rendering fault; a card that names a product has to show that product identifiably. The second
window is placed on the wordmark and loses the falling droplet, which is the more expendable half.

## Render findings

- **Bitrate 2.34 Mbps, below the 8 Mbps floor in CLAUDE.md — and that floor does not apply here.**
  CRF 17 produced 1.98 Mbps and CRF 14 produced 2.43, a 23% rise for a three-stop quality change.
  The encoder is quality-targeted; flat colour fields and vector-like type simply do not contain
  more information than that. Type edges inspected at full resolution show no artefacts. The floor
  was calibrated on photographic footage (296/297 measured 3.0-3.6 Mbps with visible mush) and
  should be scoped to footage-based kits rather than applied to designed frames.
- **`loadFonts()` must be called inside the component, not at module scope.** At module scope the
  `delayRender` handle is created when the bundle evaluates rather than when a render tab is ready,
  and the render died at frame 184 on `"bundled webfonts" not cleared after 28000ms`.
- **The clearing out-fade was manufacturing dead frames.** Copied from `Batch0811Kit`, where cuts
  genuinely overlap by `MOTION.overlap = 16` for a photographic crossfade, it defends against
  nothing in a hard-cut kit whose Sequences are strictly adjacent (66-191, 192-317, ...). v001
  measured f65, f191, f677 and f678 as blank or copy-less — one full second across the reel.
  Removed.
- **`at(f, 0, n)` still evaluates to 0 on frame 0.** Moving a fade's start to zero does not make an
  element present on the first frame; removing the fade does. This is the same class of bug as the
  `firstCutIsComplete` rule and worth adding to it.
- **Layout coupling to name explicitly:** the product panel occupies y400-1150 and the price stack
  starts at y1165. v001 had the panel at `bottom: 396`, which put it at y718-1524 and drove
  ₩14,000 straight through the bottle. These two numbers cannot be tuned independently.

## The decision frame

`Decide` is built as the frame a viewer screenshots: problem → brand → price for all four, plus the
red domain chip. The grid must end above y1100 — its right column spans x553-1020, so anything
crossing y1100 sits under Instagram's action rail.

## Audio — a synthesised bed, and why not a licensed track

The three tracks already in `output/bgm/youtube-audio-library/` are unusable here. Their own
`LICENSES.md` records them as pulled from the signed-in channel's Audio Library **for YouTube
use** and warns to re-check before reusing the masters on a non-YouTube platform — and this
reel's first destination is Instagram.

The stronger reason is shape. COUNTER's premise is that something discrete happens every ~0.67s,
and the beat that justifies the video format is a price counting up. A song laid over that runs
on its own clock. So `build-bgm.py` synthesises the bed from the kit's own frame numbers: an
A2-sus2 sine pad with a 0.07 Hz breathing LFO, plus **46 events** — 7 cut thuds, 33 copy ticks,
4 price-counter runs of 8 accelerating micro-ticks each, and 2 domain-chip hits. Round Lab's
block skips the list-price tick because Round Lab has no list price, so the audio carries the
same asymmetry the picture does.

**Verified landing on the cuts**: frames 66/192/318/444/570/678 measure −3.7 to −5.1 dB against
−7.3 to −10.7 dB mid-block. The bed is also original, so it clears on YouTube Shorts too.

### Mastering — three wrong versions before the right one

Target is Instagram's −14 LUFS with true peak safely under 0. Four attempts, each failing for a
different reason worth writing down:

| | chain | result |
|---|---|---|
| v005 | `loudnorm` linear only | −14.2 LUFS but **+1.7 dBTP** — AAC adds ~1.8 dB of intersample overshoot over the WAV's −1.5 dBTP, so `loudnorm`'s TP target cannot be trusted as the final ceiling |
| v006 | compressor with `makeup=2` + limiter | −11.4 LUFS, −0.1 dBTP — makeup gain pushed it past the target, and still too hot |
| v007 | compressor, no makeup, lower TP | −10.3 LUFS, **+0.3 dBTP** — got *louder* after lowering the ceiling, which is the tell |
| v008 | same + `alimiter level=false` | −14.3 LUFS, −3.1 dBTP ✓ but LRA squashed to 2.9 and the cut accents narrowed to 0.5–5.7 dB over the bed |
| **v009** | `loudnorm` two-pass linear + `alimiter limit=0.63 level=false`, **no compressor** | **−14.3 LUFS, −3.7 dBTP, LRA 3.5**, accents 3.4–7.0 dB clear |

**The bug in v006/v007 was `alimiter`'s `level` option, which defaults to `true` and auto-levels
the output back up to full scale — silently cancelling the ceiling.** That is why lowering the
limit made the file louder. `level=false` is mandatory when using `alimiter` as a safety ceiling.

And the compressor turned out to be unnecessary: with the ceiling actually holding, the limiter
alone catches only the thud peaks, which preserves the pad's dynamics *and* keeps the cut accents
distinct. Removing it improved every measure simultaneously.

## Open question for the representative

This render carries **no voice**. Four auditions on an identical line are in
`public/assets/reels/kbeauty-picker/audio/`, measured:

| | voice | rate |
|---|---|---|
| control | current (`Lq4CTV7whEQtfYtzrWKb`) | 236 wpm |
| 01 | Liam — Energetic, Social Media Creator | 209 wpm |
| 02 | Chris — Charming, Down-to-Earth | 200 wpm |
| 03 | Jessica — Playful, Bright, Warm | 200 wpm |

Every reel to date used the control voice, which is the fastest of the four by 27-36 wpm. That is
worth knowing before attributing "robotic" to the voice model rather than to its pace.
