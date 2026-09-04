# Upload package — 야쿠르트 / 코코 (DOSSIER)

**File**: `EPICKOR_YAKULT_DOSSIER.mp4` · 797 frames / 26.6s · 1080×1920 · 30fps · **no narration**
**Kit**: `remotion/DossierKit.tsx` — spec in `remotion/ReelYakultDossier.tsx`
**Source post**: `362` — *Korean Yakult: Not Yogurt, and Its Delivery Fridge Needs a Driving Licence*
**Outro hook**: bank ID **C**, `LOCALS KNOW THE REST` (우지 used E, 바나나킥 uses B)

## Status

**SCHEDULED — 2026-09-26 05:00 KST, Facebook + Instagram.** Committed 2026-09-04 after the
representative confirmed all three DOSSIER reels ("3편다 컨펌이야"). Booked with
`.claude/skills/reels/scripts/schedule-meta-reel.py`, which refuses to click unless the footer
reads 예약 rather than 공유하기 and both date rows and all six time spinbuttons read back what
was asked for. Verified afterwards against the planner itself, by caption text rather than by
date alone: 야쿠르트 sits on 2026-09-26 opening `In Korea `.

Part of a four-Reel run — 09-25 동묘 (NEWSDESK) · 09-26 야쿠르트 · 09-27 우지 파동 ·
09-28 바나나킥 — placed the day after card news ends on 09-24, per the 2026-07-27 rule that
scheduling continues from the day after the last booked date.

## Structure

| Card | Stamp | Lower band |
|---|---|---|
| Open | `A FRIDGE. / IN TRAFFIC. / BY LAW.` | — |
| 1 | 1971 | ghost year |
| 2 | WHAT IS IN THE BOTTLE | Exhibit A — the bottle beside a poured glass |
| — | 48 years counting | — |
| 3 | 2019 · 03 | Exhibit B — the COCO cart, cream three-quarter |
| — | 7 years counting | — |
| 4 | 2026 · 04 | figure, 13k → 11k |
| 5 | 도로교통법 · 원동기장치자전거 — **turn** | Exhibit C — side profile on black |
| Close | 2 · 울릉도 · 2명 | — |

## Two reversals, and the reel commits to the second

The post carries both — the drink is not what visitors think it is, and the vehicle is legally not
what it looks like. The opening card and card 2 dispatch the first in about four seconds, because
it is a definition and definitions do not sustain a reel. The card that gets the red stamp is the
Road Traffic Act, because that fact exists only in Korean-language sources and is the reason a
visitor who has *seen* this cannot explain what they saw.

## The closing card has no photograph, deliberately

It closes on the number of Fresh Managers on Ulleungdo: two. There is no usable photograph of
those two people or that route, and an island stock shot would be decoration standing in for
evidence. The kit answers a media-free close by drawing the figure at 158 px instead of 118 px,
so the number carries the card alone. `hangul: '울릉도 · 2명'` sits under it.

## What was cut, and why

- **The Fresh Manager working conditions** — 개인사업자 status, 12.5 years average tenure, ~161
  customers a day. Card 3 carries an exhibit, which caps its text at three lines; the cart's own
  specifications won that space because the card is about the cart.
- **"Korean coverage says plainly that it does not work."** The honest half of the licence story —
  that many ride the pavement anyway and it is a recognised grey zone, not rule-breaking. It is in
  the Instagram caption in full. Card 5 had room for the law or the workaround, not both, and the
  law is the part that surprises.

## Known limits

- **`exhibit-cart-side.png` is a 1.08× enlargement.** hy publishes that view with 682×482 of
  usable subject. Kept because it is the only framing that reads as a chest freezer with a
  steering column, and because it arrives already shot on black.
- **Both cart images are CAD renders, not photographs**, and the captions say so.

## Measured, on the delivered file

| | 야쿠르트 | 우지 (approved reference) |
|---|---|---|
| Duration | 26.6s / 797 frames | 29.1s / 873 |
| Size · video bitrate | 4.96 MB · 1.43 Mbps | 5.10 MB · 1.33 Mbps |
| Integrated loudness | **−14.5 LUFS** | −14.0 LUFS |
| Loudness range | 9.6 LU | 11.2 LU |
| True peak | −1.8 dBFS | −2.4 dBFS |
| First 3s, 400–9000 Hz | **−0.4 dB** | −1.7 dB |

Measured after AAC encoding, not on the WAV. The bottom row is the one that decides audibility on
a phone, and this file is 1.3 dB louder there than the approved reel.

**Getting there took a second pass.** A single-pass `loudnorm` landed at −15.9 LUFS and would not
move: the bed peaks at −1.5 dBFS against −14.7 LUFS integrated, so reaching −14 while holding a
−4 dBFS ceiling was arithmetically impossible and the filter correctly chose the ceiling. Since
this material's measured AAC overshoot is about **0 dB** — the stapler attack ramp inherited from
우지 already fixed that — the ceiling was moved to −2 and the file lands at −14.5 with −1.8 dBTP.
Dynamics were not traded for it: LRA 9.6 against 우지's 11.2.

## QA performed

- `verify-sync.py` — audio event table re-derived from the spec `.tsx`: **in sync**.
- `npx tsc` on the spec file by name, not project-wide.
- Contact sheet, ten cards, inspected: `contact-sheet.jpg`. The first pass failed it on four cards
  — text under the exhibit plates on 3, 5 and 7, and the detail line under the ghost year on 2.
  Copy cut to the measured budget and re-rendered.
- `reels:qa-audio` **not** run: no narration, so its silence test does not apply.

## Scheduled

**2026-09-08 05:00 KST**, Instagram and Facebook, via Meta Business Suite on 2026-08-18. Cover is frame 0 of the render, uploaded explicitly rather than left to Meta's auto-suggestion, because the first frame is the designed thumbnail.
