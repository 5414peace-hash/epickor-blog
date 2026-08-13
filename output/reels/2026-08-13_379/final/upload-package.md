# Reel 379 Upload Package — "The bridge is the launcher"

- **Status**: **SCHEDULED 2026-08-28 05:00 KST** (Meta Suite, FB EpicKor + IG epickorsnippets), representative-confirmed 2026-08-13.
- **Source post**: `content/blog/379.md` → https://epickor.com/blog/379
- **Frame design**: Timeline (design O, MATCH 03) — `remotion/TimelineKit.tsx`, first use
- **Candidate render**: `output/reels/2026-08-13_379/epickor-reel-379-v002.mp4`
- **Caption**: `output/reels/2026-08-13_379/final/instagram-caption.txt`
- **Strategy**: `output/reels/2026-08-13_379/strategy.md`

## Spec

| | |
|---|---|
| Duration | 38.1s (1141 frames @ 30fps) |
| Resolution | 1080×1920 |
| Video bitrate | ~13.8 Mbps |
| Cuts | 6 + a spoken outro |
| Frame | Media band across the top, a large amber readout beneath, a calendar rail underneath that |
| Motion cards | 0 |
| Voice lane | `male_friend`, ElevenLabs, 3 parts |
| Outro CTA | `D — BEFORE YOU LAND`, **spoken**, saying the domain aloud |
| Viral Fit Score | 85/100 (threshold 80) |

## Gates

| Gate | Result |
|---|---|
| `reels:qa-audio` | **PASS** — no silence ≥0.6s inside narration (span 0.40–36.10s) |
| `reels:qa-cuts` | **PASS** — all six cuts show what the narration says at that moment. Sheet: `cut-sheet-v002.jpg` |
| Frame luminance | 44–71. v001 flagged **DARK** on cut 2 at 35; the night-pylon crop was tightened onto the lit structure (46 → 63 on the plate). |
| Caption safe zone | `left:72 right:128 bottom:410`, unchanged |
| Copy floor | Rail stops end at ~1262; caption band starts at 1418 |
| Licensing | Every plate public domain or already documented in the post. See below. |
| Representative review | **CONFIRMED 2026-08-13** |

## The rail moves backwards, on purpose

The post's advice is a date problem: the show is 7 November, and the only thing a reader has to act on
falls in late August. The rail runs `LATE AUG → 1 SEP → NOV 7`, and when the narration reaches tickets
the head jumps **from the right end back to the left**. That is the argument drawn rather than narrated.
Do not smooth it into a monotonic sweep.

## The 2026 dates are not published, and the frame says so

The official site lists the date and venue and nothing else; the notice board has not moved since
November 2025. A timeline graphic implies certainty it does not have unless it is labelled, so:

- HUD reads `2025 PATTERN` / `2026 UNCONFIRMED` on both ticket cuts.
- The `LATE AUG` and `1 SEP` stops are 2025 dates. Only `NOV 7` is a confirmed 2026 fact.
- Cut 4's readout sits under the label *"When to watch, if 2026 follows"*.
- The narration hedges in the same sentence.

**If the 2026 ticket announcement lands before this is scheduled**, update the post first, then re-run
`rebuild-timeline.mjs` — nothing in `Reel379.tsx` is hand-timed except the rail head.

## One asset was deliberately left out

Commons holds the single best image for this reel — `2008 Busan Firework Festival-Niagara1.JPG`, the
cascade falling from the bridge deck, which is the article's central visual claim. **It is CC BY-SA
2.0 kr**, and ShareAlike would propagate to the whole video, which is not available to brand content.
Attribution-only material was skipped too rather than carry a credit in frame. Do not revisit without
re-checking the licence.

## Plates

Six band plates at 1080×1000 plus a 9:16 outro plate. `crowd-waiting` was re-cropped upward after a
silhouettes-only frame measured **luma 18** — the range that shipped a black frame on 2026-08-04.
Including the burst line above the heads lifted it to 119.

`Busan_Firework_Festival_2008-1.jpg` (PD, RedMosQ) is the same shoot as the post's hero and is used as
a **resolution upgrade** of it, 3648×2736 against 1400×1050 — not as a second distinct image.

## Scheduling

This completes the batch of three: **376 (approved)**, **377**, **379**. Schedule all three together
from the day after the last scheduled slot, 05:00 KST, once 377 and 379 clear phone review.
