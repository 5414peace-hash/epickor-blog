# Reel 376 Upload Package — "The tag decides, not the app"

- **Status**: awaiting representative phone review (sound on and off). Not yet approved.
- **Source post**: `content/blog/376.md` → https://epickor.com/blog/376
- **Frame design**: Split Grid (design L, MATCH 01) — `remotion/SplitGridKit.tsx`, first use
- **Candidate render**: `output/reels/2026-08-13_376/epickor-reel-376-v003.mp4`
- **Caption**: `output/reels/2026-08-13_376/final/instagram-caption.txt`
- **Strategy**: `output/reels/2026-08-13_376/strategy.md`

## Spec

| | |
|---|---|
| Duration | 40.5s (1215 frames @ 30fps) |
| Resolution | 1080×1920 |
| Video bitrate | ~13.3 Mbps (floor is 10 Mbps for heavy motion) |
| Cuts | 6 + outro |
| Motion cards | 0 — per the 2026-07-21 rule the payoff is a visual reveal |
| Voice lane | `male_friend`, ElevenLabs, 3 parts |
| Outro CTA | `B — DON'T ORDER BLIND` (mistake avoidance; unused in the recent batch) |
| Viral Fit Score | 86/100 (threshold 80) |

## Gates

| Gate | Result |
|---|---|
| `reels:qa-audio` | **PASS** on v002 — no silence ≥0.6s inside narration. v001 **FAILED** at 0.92s / 0.87s and was rebuilt. |
| `reels:qa-cuts` | **PASS** on v002 — all six cuts show what the narration says at that moment. Sheet: `cut-sheet-v002.jpg` |
| Plate luminance | 99–133 across six plates (the 2026-08-04 failure was 16) |
| Plate upscale | 1.03×–2.48×, all under the 2.67× reject line |
| Caption safe zone | `left:72 right:128 bottom:410`, ported unchanged from `Batch0811Kit` |
| Copy floor | Label tiles restricted to grid rows 1–3; `GridScene` throws if one is placed outside |
| Korea-first | All five source photographs are Korea-shot with Korean signage and packaging |
| **Phone review** | **OUTSTANDING — representative, sound on and off** |

## What changed between renders

- **v001 → v002**: audio gate blocked it. Inter-part gap cut from 21 frames to 7 (the mp3s are not
  padded with digital silence — they trail off quietly, and ~0.2s at each seam sits under the gate's
  floor). Cut boundaries and tile entry frames were then re-derived from beat indices rather than
  hand-edited, so the next re-time moves everything together.
- **v002 → v003**: the `EVERY GUIDE` tile on cut 5 clipped the G of the GS25 fascia. Moved one column
  left.

## Accuracy notes

Every claim in the video and the caption is carried by the source post:

- 1+1 needs no card, coupon, app or minimum — post §"how the deal works".
- GS25 banks the free item as **나만의 냉장고** (now inside 우리동네GS); CU runs it inside **포켓CU**.
- All three chains gate account creation on **본인인증**; Apple sign-in routes into that request rather
  than around it. The gate belongs to the store app, not the login provider.
- **7-Eleven is not mentioned in post 376** and was removed from a caption draft that had claimed it.
- No promotional claim is overlaid onto a product whose promotion status is unverifiable. The `2+1`
  strip visible in cut 1 is really in the photograph; the GS25 liquor shelf in cut 3 carries only the
  `₩` label, because those bottles' promotion status cannot be read from the photo.

## Scheduling

Not yet scheduled. Per the batch rule, hold as upload-package-ready until two more Reels are finished,
then schedule the three together from the day after the last scheduled slot, 05:00 KST.

## Measurement flag

`376` sits in the convenience-store hub cluster, which is under difference-in-differences measurement
with a judgment date of **2026-09-23**. This Reel is an intervention on the treatment arm inside the
window. Record it when `npm run cluster:judge` runs, or it contaminates the reading silently.
