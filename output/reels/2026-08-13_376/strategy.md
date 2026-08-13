# Reel 376 — "The tag decides, not the app"

**Source post**: `content/blog/376.md` — Korean convenience store 1+1 and 2+1 deals
**Frame design**: **L — Split Grid** (from the 2026-08-13 design sheet, MATCH 01)
**Folder**: `output/reels/2026-08-13_376/`
**Runtime target**: 40s · 6 cuts · 1080x1920 · 30fps
**Voice lane**: `male_friend`
**Outro CTA**: `B — DON'T ORDER BLIND` (mistake avoidance; fits shopping; unused in the recent batch)

---

## Reels Viral Fit Score — 86/100

| Axis | Score | Reasoning |
|---|---|---|
| Hook strength | 18/20 | First frame is a real `2+1` banner on a CU freezer — physical proof before a word is spoken. Not a mood shot. |
| Misconception payload | 20/20 | The reel inverts the single most-repeated English-guide tip. That tip is wrong for the viewer watching. |
| Payoff is a reveal, not a list | 17/20 | The gate lands on a storefront ATM — identity hardware in frame. Visual, not a card. |
| Save/share reason | 16/20 | "Don't waste time in the app" is actionable before landing. Save-worthy for a first Seoul trip. |
| Footage risk | 15/20 | **All stills.** The frame design supplies the motion (see below). Docked 5 — no motion event exists in any source. |

Threshold is 80. Passes.

## Why this topic gets the Split Grid frame

EpicKor does not shoot video, and post `376` has three stills and no clips. The Footage Gate would
normally block a topic whose key beat is an action event. **This reel has no action event to lose** —
its subject is a *sticker on a shelf*, a static object by nature. So the deficiency is structural, not
accidental, and the frame has to carry the motion instead of the footage.

Split Grid does exactly that: the image is diced into a mosaic and the tiles arrive, flip, and lock on
their own schedule. The motion is authored, so it is unaffected by the source being still.

Two of the five photos are *already grids* — the CU freezer bins (`335`) and the GS25 shelf-edge tag row
(`376`) — so the mosaic lands on structure that is really in the photograph rather than being imposed on
it. That alignment is the reason this topic was matched to this frame and not to H or L's siblings.

## Hook archetype

**Contradiction of an authority.** Every English-language Korea guide tells you to save the free item in
the chain's app and collect it later. The reel accepts that premise for 25 seconds, then removes it.

## First-frame promise

A real blue `2+1` product strip on a CU ice-cream freezer, with `1+1` mosaic tiles landing over it and
the headline `THE TAG DECIDES, / NOT THE APP`. The promise: there is a rule here you are getting wrong.

## Viewer misconception

*"Korean convenience-store deals need the chain's app, a membership card, or a minimum spend."*
False on all three. The deal is settled at the shelf edge and requires nothing.

*"And the app lets me bank the free one for later."*
True — and unavailable to almost every viewer, because sign-up runs through Korean identity
verification. Signing in with Apple or Google does not route around it; the gate is inside the app.

## Payoff

The final cut is a GS25 storefront with a bank ATM standing in the doorway. The mosaic locks into a
closed grid over it as the narration says the sign-up needs Korean ID. The image and the sentence say
the same thing at the same moment.

## Save/share reason

A visitor can act on this in the first hour of the trip: take the second item off the shelf now, and do
not spend time trying to register for an app that will reject you.

## Motion card

**Zero.** Per the 2026-07-21 rule, the payoff must be a visual reveal, not a board. The Split Grid tiles
are part of the frame, not an information card.

## Thumbnail / opening variants

| Direction | On-screen copy | Spoken opener |
|---|---|---|
| **Mistake** (selected) | `THE TAG DECIDES, / NOT THE APP` | "Half the fridge is wearing a sticker." |
| Mystery | `WHY IS IT FREE?` | "Nobody scans anything for this." |
| Decision | `TAKE TWO. PAY ONCE.` | "You are allowed to just take the second one." |

Selected **Mistake**: it states the reel's actual thesis and sets up the app reversal, so the thumbnail
and the payoff are the same idea rather than two unrelated ones.

## Funnel expectation

`376` sits in the convenience-store hub cluster and is one of the hub's spokes. The reel points to
`epickor.com` only. Cluster-lift measurement is already running with judgment date **2026-09-23**; this
reel publishes inside that window, so record it as an intervention on the treatment arm when the
judgment runs — otherwise it contaminates the reading silently.

## Cut plan — final

Cut boundaries are **derived from the forced alignment**, not chosen in advance. FACTS 2026-08-04:
*"스토리보드를 먼저 짜고 나레이션을 맞추면 반드시 어긋난다."* Narration was recorded first, aligned, and
the cuts were then placed on beat boundaries. Measured narration rate for this voice is 233 wpm
(`ELEVENLABS_VOICE_ID=Lq4CTV7whEQtfYtzrWKb`), so the first 107-word script would have run 27s, not 40 —
it was rewritten to 144 words before any cutting.

| # | Frames | Sec | Plate | Grid behaviour | Spoken beat |
|---|---|---|---|---|---|
| 1 | 0–243 | 8.1 | `c1-2plus1-freezer` | 24 tiles assemble on a diagonal stagger; opening card rises; `1+1` and `2+1` flip in on their words | half the fridge is wearing a sticker |
| 2 | 244–348 | 3.5 | `c2-app-giftcards` | Three label tiles land on the three negations | no card / no coupon / no app |
| 3 | 349–552 | 6.8 | `c3-shelf-tags` | `₩` tag tile, then `SHELF EDGE`, then `NO SCAN` | it's settled at the shelf edge |
| 4 | 553–735 | 6.1 | `c4-icecream-bins` | Mosaic sits on the real bin lattice; `TAKE TWO` → `1+1` → `SAVE IT?` | lug a second ice cream around Seoul |
| 5 | 736–877 | 4.7 | `c5-gs25-storefront` | `EVERY GUIDE` bone tag, then `BUT` | the tip every English guide hands you |
| 6 | 878–1079 | 6.7 | `c6-gs25-atm-tight` | **Seams close to zero and the grid dims to a 2×2 spotlight on the ATM** | Korean identity verification |
| — | 1080–1215 | 4.5 | back cover | `DON'T ORDER BLIND` + red `epickor.com` chip over the dimmed storefront | silent |

Total **40.5s**. Narration 35.2s across three parts.

These frames are **generated, not chosen**. `rebuild-timeline.mjs` places the three mp3s, re-runs the
forced alignment, and derives every cut boundary from a beat index; `Reel376.tsx` derives every tile's
entry frame the same way. Re-timing the narration moves all of it together. Do not hand-edit frames.

The inter-part gap is **7 frames**, not the 21 first used. `reels:qa-audio` blocked v001 with 0.92s and
0.87s narration gaps against its 0.6s limit. `silencedetect` at -45 dB finds nothing in the mp3s, so
they are not padded — they trail off and start quietly, and roughly 0.2s at each seam falls under the
gate's floor. The nominal gap has to be shorter than the audible one.

### Plates

Six 1080×1920 plates from five source photographs, built by `prep-plates.mjs`; crop boxes, upscale
factors and measured luminance are recorded in `media-report.json`. Upscale runs 1.03×–2.48×, all under
the 2.67× reject line. Luminance runs 99–133 — the 2026-08-04 failure was a plate at 16.

Cuts 1 and 2 are different regions of one photograph, saved as separate assets so no path repeats.
Cuts 5 and 6 are a wide/tight pair of one storefront, so the payoff lands as a push-in rather than a
cut to something new.

## Caption safe zone

Ported from `remotion/Batch0811Kit.tsx` unchanged: `left:72 / right:128 / bottom:410`, `minHeight:92`.
All frame furniture — headline, tile labels, kicker, ticker — ends at or above `y=1340`.
This was verified against Instagram's UI overlay on 2026-08-13; earlier demos sat at `bottom:130–250`,
which is inside the UI.

## Verification notes

- The `2+1` strip in cut 1 is **really in the photograph** (CU ice-cream freezer, blue product banner).
  No promotional claim is overlaid onto a product that is not actually on promotion.
- Cut 3's tags are real GS25 shelf-edge tags showing real ₩ prices. The frame does **not** overlay
  `1+1` or `2+1` onto that shelf, because those specific bottles' promotion status is not verifiable
  from the photo.
- All five photos are Korea-shot, Korean-signage, Korean-packaging. Korea-first satisfied.

## Agent roles

- Strategy: frame match, viral-fit scoring, cut plan
- Research: photo audit across the cluster (`171`, `335`, `336`, `376`) for grid-compatible stills
- Writer: narration (3 parts), captions, ONS copy
- Reviewer: `reels:qa-audio` + `reels:qa-cuts` + phone review before final
