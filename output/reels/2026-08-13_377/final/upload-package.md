# Reel 377 Upload Package — "Korea made them prove it"

- **Status**: awaiting representative phone review (sound on and off). Not yet approved.
- **Source post**: `content/blog/377.md` → https://epickor.com/blog/377
- **Frame design**: Spec Sheet (design H, MATCH 02) — `remotion/SpecSheetKit.tsx`, first use
- **Candidate render**: `output/reels/2026-08-13_377/epickor-reel-377-v001.mp4`
- **Caption**: `output/reels/2026-08-13_377/final/instagram-caption.txt`
- **Strategy**: `output/reels/2026-08-13_377/strategy.md`

## Spec

| | |
|---|---|
| Duration | 39.6s (1186 frames @ 30fps) |
| Resolution | 1080×1920 |
| Video bitrate | ~15.2 Mbps (floor is 10 Mbps for heavy motion) |
| Cuts | 6 pages + a spoken outro (specimen / specimen / lineup / callout / specimen / tally) |
| Ground | **Light paper.** 376 shipped on ink; two reels in a batch sharing a value key read as one template. |
| Motion cards | 0 — the spec rows are the page, and the payoff is a reveal |
| Voice lane | `male_friend`, ElevenLabs, 3 parts |
| Outro CTA | `C — LOCALS KNOW THE REST`, **spoken**, saying the domain aloud |
| Viral Fit Score | 88/100 (threshold 80) |

## Gates

| Gate | Result |
|---|---|
| `reels:qa-audio` | **PASS** — no silence ≥0.6s inside narration (span 0.47–37.60s) |
| `reels:qa-cuts` | **PASS** — all six pages show what the narration says at that moment. Sheet: `cut-sheet-v001.jpg` |
| Frame luminance | 196–225. Bright by design; the DARK flag is not in play. |
| Caption safe zone | `left:72 right:128 bottom:410`, unchanged |
| Copy floor | Page furniture ends at y=1308; caption band starts at 1418 |
| Korea-first | Manufacturer pack shots from HK inno.N's own site + a CC0 해장국 photograph |
| **Phone review** | **OUTSTANDING — representative, sound on and off** |

## The spoken outro, first use

Representative instruction 2026-08-13: *"마지막에 epickor.com 을 한번 나레이션으로 읊어주면 좋은데, 그건
다음편에는 그렇게하자."*

The tag is the last two beats of **voice part 3**, not a fourth clip, so the forced alignment carries
it and the caption band stays live over the closing plate. The narration text spells it
`epickor dot com` because TTS reads a bare URL as letters; `rebuild-timeline.mjs` rewrites that back to
`epickor.com` in the caption so the viewer never sees the spelling. Verified in the render: the closing
caption reads "The rest is at epickor.com."

## One editorial safeguard, built into the frame

Cut 6 is the only page with **no product on it**, and that is not a variety decision. The narration
there says three products could not produce evidence and lost the right to the claim. Neither the
article nor the Korean reporting names them, so a branded pack shot under that sentence would accuse a
company the evidence does not accuse. The `tally` page mode exists for that reason.

The same care runs through the copy: the page footer reads *"A floor on advertising honesty — not a
medical endorsement"*, which is the post's own framing. The reel must not let 25/28 imply the
survivors are proven cures.

## Assets

Seven Condition SKUs fetched from HK inno.N's product page at 1106×1106 (1.25× larger than the two
copies already in the post) and keyed off their studio white with the saturation flood-fill recipe from
CLAUDE.md — a brightness cut deletes pale product bodies, and `sharp.trim()` cannot be trusted here.
Editorial product identification; no sponsorship implied and none exists.

The badge turned out **legible** in the crop, contrary to the first estimate in `strategy.md`, so the
leader line points at real type rather than gesturing at a smudge. The frame still prints the English,
because a viewer who does not read Korean needs the sentence either way.

## Scheduling

Not yet scheduled. Batch of three: **376 (approved)**, 377 (this one), 379 (Busan fireworks, MATCH 03 —
waiting on the ticket-opening announcement). Schedule all three together once 379 is done, from the day
after the last scheduled slot, 05:00 KST.
