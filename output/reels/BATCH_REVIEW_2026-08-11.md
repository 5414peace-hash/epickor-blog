# Batch review — 2026-08-11 (cheonggyecheon / sungnyemun / suneung)

Three Reels for the 8/16 gap. All three are QA-passed and awaiting representative
phone review with sound on and off, which is the only remaining gate.

## Delivery candidates

| | file | frames | duration | bitrate |
|---|---|---|---|---|
| **D** | `output/reels/cheonggyecheon/epickor-reel-cheonggyecheon-v003.mp4` | 1363 | 45.46s | **16.1 Mbps** |
| **E** | `output/reels/sungnyemun/epickor-reel-sungnyemun-v002.mp4` | 1451 | 48.38s | **13.0 Mbps** |
| **F** | `output/reels/suneung/epickor-reel-suneung-v003.mp4` | 1420 | 47.36s | **13.9 Mbps** |

All 1080×1920 at 30fps. The Reels 2.2 encoding floor is ≥8 Mbps, ≥10 with heavy
motion; all three clear the higher figure.

**Superseded, do not upload:** D v001/v002, E v001, F v001/v002.

## Gate results

| gate | D | E | F |
|---|---|---|---|
| `reels:qa-audio` (no ≥0.6s hole inside narration) | **PASS** | **PASS** | **PASS** |
| `reels:qa-cuts` (screen/word pairing, per-cut luma) | **PASS** | **PASS** | PASS, one noted |
| Caption beats overlapping | 0 | 0 | 0 |
| Word coverage | 165/165 | 166/166 | 148/148 |
| Video share | 100% | 100% | **58.8%** |
| Cuts / average length | 8 / 5.7s | 10 / 4.8s | 10 / 4.7s |

### The audio gate blocked the first render of all three

v001 failed with 0.65–0.81s narration holes against a 0.6s limit. The cause was
not the 9-frame design gap between parts (0.30s) but **ElevenLabs' own lead-in
padding**, 0.10–0.17s per file. Fixed by trimming the lead and re-padding the
tail so durations — and therefore every downstream frame number — held, then
pulling the offending parts forward (D 12 then a further 3, E 7, F 4 frames).

`npm run reels:gaps` was written during this and predicts what the gate will
report straight from the mp3s, in seconds instead of after a ten-minute render.
It runs **0.04s low** against the gate, because the gate measures the mixed track
with a 0.3s detection window while this reads individual files at 0.05s. Its
working limit is therefore set to 0.54s, not 0.6s. That calibration is measured,
not assumed: D predicted 0.58s and the gate reported 0.62s.

### One luma note on F, accepted deliberately

F cut 4 (juniors saluting) measures **luma 43**, under the documented floor of 60.
It is being accepted, and the reasoning matters more than the number:

The floor exists because of a 2026-08-04 failure where a near-black frame ran
under narration it contradicted — a luma-28 shot under "clear lemon-lime soda".
Here the source is genuinely a dim, overcast street with navy school uniforms;
**the subject is bright and legible and the caption over it reads "No horns within
two hundred metres of a school", which is exactly what the picture shows.** The
average is pulled down by the dark blur plate below the fitted image, not by the
subject. Brightening further would make an overcast Korean November look lit.

The still-plate darkening was reduced from -0.16 to -0.06 in this pass, which
lifted the other three stills: cut 2 from 67 to 77, cut 6 from 84 to **95**, cut 9
from 68 to 74. At 95 the Korean print on the marker pen is now readable.

## What each Reel is

### D — Cheonggyecheon, `/travel`, system **EXCAVATION**
Hook is a contradiction in frame one: water on screen, "you're looking at a
highway" in the ear. The signature gesture is the only one of its kind in the
batch — **HIGHWAY is drawn, a survey-yellow rule is dragged through it, and
A STREAM rises underneath.** Verified at f300/330/347/380.

Captions are a flat survey-tape bar with a hazard end-cap: no radius, no soft
shadow, deliberately site signage rather than a subtitle box.

The 9:16 crop is unusually lucky here. The stream is a vertical corridor between
buildings, so the crop *improves* the composition instead of destroying it — the
opposite of the wide-landscape failure that killed the `namsan-hillside` candidate.

### E — Sungnyemun, `/culture`, system **RECORD**
A paper index card with a monospace field label, dark type on cream — the inverse
tonal choice from the other two. Captions are the same index card, which makes
this the only Reel in EpicKor's history with dark-on-light subtitles.

The payoff is the batch's only stamp: **NATIONAL TREASURE No.1 struck through in
ember, with 국보 숭례문 landing on top of it**, over the gate itself. Ten of ten
cuts are the gate or its market, so no screen/word mismatch is structurally
possible, and cut 10 returns to the opening arch as a bookend under "It's just
Sungnyemun."

### F — Suneung, `/culture` or `375`, system **HOLD**
Departure-board rows flip in one per narration beat. An **AIRSPACE HOLD countdown**
runs from f296 to f796 — the only persistent element in the batch — and is
**removed before the final cut**, because the last beat is not data, it is the
parents at the gate.

Planned as the stills-led experiment that would miss the 50% video floor. **It
measures 58.8% video and the prediction was wrong.** The assumption was that the
only honest footage would be of the exam itself; the script also names a school,
streets and an intersection, and all of those exist as Korea-verified footage.
The reusable lesson: *a topic with no footage of its core usually has footage for
everything said around it.*

## Sourcing honesty

D and E are built entirely on **1920×1080 sources needing a 1.78× upscale** to
9:16 (one E cut at 1.33×). Inside the permitted band — CLAUDE.md allows FHD at
1.78× and rejects HD at 2.67× — but a visible step down from the previous batch,
which had 8K and 60fps material. The trade was deliberate: the first version of
this batch used the 8K palace and blossom footage and was rejected in one line,
*주제가 재미없어*.

F's video is the best in the batch: **all four clips are 4K, cropped at 0.89× —
a downscale, no upscaling at all.**

## Remaining gate

Representative phone playback with sound on and off. Any flash, judder, unplanned
wrap, orphan word or caption collision blocks final status, and representative
rejection overrides every score above.

## After approval

Schedule 8/16, 8/17, 8/18 at 05:00 KST on Facebook and Instagram, in one 3-Reel
batch. Procedure and its eight traps are in `docs/handoff/FACTS.md` under
`## instagram / social` — the dangerous one is that a new Reel defaults to
`지금 공유하기` and the footer button says `공유하기` (publish now), so the script
refuses to click unless the footer reads `예약`.

Outro CTA IDs are deliberately different across the three so a viewer who sees all
of them in one week is not sold the same way three times: **THERE'S MORE** (open
loop) · **LOCALS KNOW THE REST** (insider) · **WE WROTE IT ALL DOWN** (reassurance).
