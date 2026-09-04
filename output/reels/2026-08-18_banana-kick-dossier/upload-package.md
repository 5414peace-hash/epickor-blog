# Upload package — 바나나킥 (DOSSIER)

**File**: `EPICKOR_BANANA_KICK_DOSSIER.mp4` · 784 frames / 26.1s · 1080×1920 · 30fps · **no narration**
**Kit**: `remotion/DossierKit.tsx` — spec in `remotion/ReelBananaKickDossier.tsx`
**Source post**: `367` — *Banana Kick: Korea's Banana Snack Is 1.6% Banana, and That's the Point*
**Outro hook**: bank ID **B**, `DON'T ORDER BLIND` (우지 used E, 야쿠르트 uses C — no repeat inside the cohort)

## Status

**SCHEDULED — 2026-09-28 05:00 KST, Facebook + Instagram.** Committed 2026-09-04 after the
representative confirmed all three DOSSIER reels ("3편다 컨펌이야"). Booked with
`.claude/skills/reels/scripts/schedule-meta-reel.py`, which refuses to click unless the footer
reads 예약 rather than 공유하기 and both date rows and all six time spinbuttons read back what
was asked for. Verified afterwards against the planner itself, by caption text rather than by
date alone: 바나나킥 sits on 2026-09-28 opening `Korea's m`.

Part of a four-Reel run — 09-25 동묘 (NEWSDESK) · 09-26 야쿠르트 · 09-27 우지 파동 ·
09-28 바나나킥 — placed the day after card news ends on 09-24, per the 2026-07-27 rule that
scheduling continues from the day after the last booked date.

## Structure

| Card | Stamp | Lower band |
|---|---|---|
| Open | `IT IS YELLOW. / IT IS CURVED. / IT IS CORN.` | — |
| 1 | 1978 · 05 | Exhibit A — Nongshim's brand artwork, 바나나맛 그대로 legible |
| 2 | WHAT IS IN THE BAG | Exhibit B — three puffs isolated, the banana curve |
| — | 47 years counting | — |
| 3 | 2025 · 03 | ghost year |
| — | 1 year counting | — |
| 4 | 2026 · 03 | Exhibit C — inside the bag she reached into |
| 5 | 2026 · 08 — **turn** | ghost year |
| Close | 1.6% | the other 98.4%, photographed |

## Why the turn is the one-off bag and not the viral clip

A snack going viral is weather. A fifty-year-old company printing a stranger's baby on packaging
it has decided never to sell is a deliberate act — the same species of act as 삼양 relaunching on
the anniversary of its own accusation, which is what the kit's red stamp is for.

## What was cut, and why

**The Japanese lineage.** Post `367` establishes that Matdongsan-adjacent framing does not apply
here, but `367`'s sibling fact — that Banana Kick's category descends from outside Korea — is not
in this reel at all. The post handles that in context and at length. Thirty seconds cannot, and a
half-stated version would move the comment section onto a subject the reel is not about.

**"Why a one-year-old can eat it" lost its own card.** It now shares card 4 with the clip, which
is where it belongs anyway: the question the clip raises is answered on the card that raises it.

## Known limits

- **The closing figure is stated, not read off the photograph.** 우지 could enlarge a printed
  ingredient line 2.2× and let the viewer read `우지 6.87%`. The same move fails here — Nongshim
  publishes that artwork at 1067 px and the declared-content line is two pixels tall. Enlarging it
  until it *looks* like evidence would be the defect it is meant to prevent. See
  `public/assets/reels/banana-kick-dossier/media/image-sources.md`.
- **The pack plate is narrower than the other two** (586×566 against 848 wide) because fitting it
  to the plate width would have enlarged it 1.41× on an already-enlarged source.

## Measured, on the delivered file

| | 바나나킥 | 우지 (approved reference) |
|---|---|---|
| Duration | 26.1s / 784 frames | 29.1s / 873 |
| Size · video bitrate | 5.49 MB · 1.63 Mbps | 5.10 MB · 1.33 Mbps |
| Integrated loudness | **−13.7 LUFS** | −14.0 LUFS |
| Loudness range | 10.5 LU | 11.2 LU |
| True peak | −1.9 dBFS | −2.4 dBFS |
| First 3s, 400–9000 Hz | **−0.4 dB** | −1.7 dB |

The last row is the one that matters and it is measured after AAC encoding, not on the WAV. Phone
and laptop speakers reproduce nothing below roughly 400 Hz, so a full-band meter cannot answer
"will this be audible" — that is the 2026-08-18 finding, and this file is 1.3 dB *louder* than the
approved reel in the band that plays.

**The 8 Mbps floor does not apply.** That floor is for footage kits. Flat design frames respond
almost not at all to quality changes (CRF 17 → 14 moved 1.98 → 2.43 Mbps on this kit, 23% for
three stops), which means the encoder is already at target and the content has no more information
in it. Glyph edges checked at full resolution; no artefacts.

## QA performed

- `verify-sync.py` — audio event table re-derived from the spec `.tsx`: **in sync**. It caught
  three genuine drifts when the copy was trimmed, which is what it exists for.
- `npx tsc` on the spec file **by name** — `remotion/` is in tsconfig's `exclude`, so a
  project-wide typecheck would have reported clean over any error here.
- Contact sheet, ten cards, inspected: `contact-sheet.jpg`. The first pass failed it — head lines
  wrapped to three and pushed body text under the exhibit plates on cards 2, 5 and 7. Copy was cut
  to the measured layout budget and re-rendered.
- `reels:qa-audio` was **not** run: it looks for silence inside narration spans, and this reel has
  no narration. Its silences are the design.

## Scheduled

**2026-09-07 05:00 KST**, Instagram and Facebook, via Meta Business Suite on 2026-08-18. Cover is frame 0 of the render, uploaded explicitly rather than left to Meta's auto-suggestion, because the first frame is the designed thumbnail.
