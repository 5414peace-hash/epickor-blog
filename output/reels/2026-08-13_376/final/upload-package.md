# Reel 376 Upload Package — "The tag decides, not the app"

- **Status**: **representative-approved 2026-08-13** ("좋아 이걸로 마무리하자"). Upload-package-ready — hold
  until Reels 377 and 379 are finished, then schedule the three together.
- **Source post**: `content/blog/376.md` → https://epickor.com/blog/376
- **Frame design**: Split Grid (design L, MATCH 01) — `remotion/SplitGridKit.tsx`, first use
- **Candidate render**: `output/reels/2026-08-13_376/epickor-reel-376-v006.mp4`
- **Superseded, kept for comparison**: `v003` (grid on every cut, background repeated)
- **Caption**: `output/reels/2026-08-13_376/final/instagram-caption.txt`
- **Strategy**: `output/reels/2026-08-13_376/strategy.md`

## Spec

| | |
|---|---|
| Duration | 40.5s (1215 frames @ 30fps) |
| Resolution | 1080×1920 |
| Video bitrate | ~14.0 Mbps (floor is 10 Mbps for heavy motion) |
| Cuts | 6 + outro, each on its own grid treatment (assemble / cards / lift / lift / quiet / shutOpen) |
| Source photographs | 5, no background repeated between cuts |
| Motion cards | 0 — per the 2026-07-21 rule the payoff is a visual reveal |
| Voice lane | `male_friend`, ElevenLabs, 3 parts |
| Outro CTA | `B — DON'T ORDER BLIND` (mistake avoidance; unused in the recent batch) |
| Viral Fit Score | 86/100 (threshold 80) |

## Gates

| Gate | Result |
|---|---|
| `reels:qa-audio` | **PASS** on v006 — no silence ≥0.6s inside narration. v001 **FAILED** at 0.92s / 0.87s and was rebuilt. |
| `reels:qa-cuts` | **PASS** on v006 — all six cuts show what the narration says at that moment, no DARK flags. Sheet: `cut-sheet-v006.jpg` |
| Frame luminance | 49–107 across the six cuts. v004 flagged **DARK** on cut 2 at 37 and the veils were cut back. |
| Plate luminance | 99–128 across six plates (the 2026-08-04 failure was 16) |
| Plate upscale | 1.03×–2.48×, all under the 2.67× reject line |
| Caption safe zone | `left:72 right:128 bottom:410`, ported unchanged from `Batch0811Kit` |
| Copy floor | Label tiles restricted to grid rows 1–3; `GridScene` throws if one is placed outside |
| Korea-first | All five source photographs are Korea-shot with Korean signage and packaging |
| Representative review | **APPROVED 2026-08-13** |

## What changed between renders

- **v001 → v002**: audio gate blocked it. Inter-part gap cut from 21 frames to 7 (the mp3s are not
  padded with digital silence — they trail off quietly, and ~0.2s at each seam sits under the gate's
  floor). Cut boundaries and tile entry frames were then re-derived from beat indices rather than
  hand-edited, so the next re-time moves everything together.
- **v002 → v003**: the `EVERY GUIDE` tile on cut 5 clipped the G of the GS25 fascia. Moved one column
  left.
- **v003 → v004** (representative review): two notes, both taken. *"백그라운드 이미지가 두번씩 연속으로
  나오는건 좀 아닌거 같다"* — cuts 1–2 were two crops of one photograph and cuts 5–6 two framings of
  one storefront. Re-sourced the cluster and found `171/korean-convenience-store-breakfast.jpg`, a shelf
  of four real pink `2+1` tags, which takes the hook and is also a far better grid thumbnail.
  *"전체를 다 이렇게 하는게 맞나"* — no. The grid now appears and resolves per cut instead of
  persisting, so the hook's tags and the payoff's ATM both land whole.
- **v004 → v005**: `qa-cuts` flagged cut 2 DARK at luma 37 and the other cuts had drifted to 72–88 once
  the top scrim was stacked on the full-frame veils. Veils cut back; the scrim keeps the top rail
  legible on its own.
- **v005 → v006** (representative review): *"1+1 2+1 할때 카드형식으로 바뀌는 인트로 좋았는데 그걸
  없애버렸네. 그걸 살려다오."* The v004 rework had stripped the two flipping cards off the hook to
  avoid covering the plate's own pink tags. Restored, moved to row 3 with the opening card lifted to
  y=580, so the tags keep rows 0–1 and the flip survives — the dissolve now resolves *into* two cards
  instead of into a bare photograph.

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

## Carried to the next reel

The representative accepted this one as final but flagged one thing for 377 onward: *"마지막에
epickor.com 을 한번 나레이션으로 윺어주면 좋은데, 그건 다음편에는 그렇게하자."* The outro
here closes silent on the red chip. `output/reels/outro-cta-bank.md` has been rewritten: the spoken
tag is now required and must say the domain aloud, written into voice part 3 so the alignment carries
it. Do not re-derive this — the bank's old "default is silent" line is what produced the silent close.

## Scheduling

Not yet scheduled. Per the batch rule, hold as upload-package-ready until two more Reels are finished,
then schedule the three together from the day after the last scheduled slot, 05:00 KST.

## Measurement flag

`376` sits in the convenience-store hub cluster, which is under difference-in-differences measurement
with a judgment date of **2026-09-23**. This Reel is an intervention on the treatment arm inside the
window. Record it when `npm run cluster:judge` runs, or it contaminates the reading silently.
