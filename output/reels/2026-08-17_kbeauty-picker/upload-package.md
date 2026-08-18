# Upload package — K-Beauty Picker

**File**: `EPICKOR_KBEAUTY_PICKER.mp4` · 25.2s · 1080×1920 · 30fps · 6.7 MB
**Kit**: `remotion/CounterKit.tsx` (COUNTER — new, first use)
**Render**: `v009` · video 2.02 Mbps h264 · audio AAC 192k stereo 44.1kHz

## Status

**HOLD — not scheduled.** Awaiting the representative's answers on the three questions in
`../strategy.md`, chiefly whether the 8/28–30 batch gets rebuilt on this kit. The
2026-08-17 card-news trio (395 / 392 / 394) is also on KEEP for a combined booking, so
this reel should join that same session rather than being scheduled alone.

## Audio

**Synthesised bed, no narration.** `bgm-counter-bed.wav`, built by `build-bgm.py` from the
kit's own frame numbers — 46 events: 7 cut thuds, 33 copy ticks, 4 price-counter runs,
2 domain-chip hits. Verified landing on the video cuts: frames 66/192/318/444/570/678
measure −3.7 to −5.1 dB against −7.3 to −10.7 dB mid-block.

Measured on the final file: **−14.3 LUFS integrated, −3.7 dBTP, LRA 3.5**, no silence
≥0.4s anywhere. −14 LUFS is Instagram's normalisation target, so the platform should leave
the level alone.

The three tracks in `output/bgm/youtube-audio-library/` were **not** used: their own
LICENSES.md restricts those masters to YouTube use and warns against reusing them on other
platforms. This bed is original, so it clears on any platform including YouTube Shorts.

## Checks run

| Gate | Result |
|---|---|
| Frame 0 complete (grid thumbnail) | Pass — hook headline, four panels and date line all at full opacity |
| Safe areas (top 150 / bottom 320 / side 60) | Pass |
| Action rail (x930+ below y1100) | Pass — decision grid ends y1088, footer block capped at x910 |
| Dead/blank frames | Pass — f65, f191, f677, f678 all carry copy after the out-fade removal |
| Copy overlap across cuts | Pass by construction — Sequences are strictly adjacent, so one block unmounts as the next mounts |
| Hangul renders (no tofu) | Pass — verified on all four product blocks |
| Audio/video sync | Pass — see Audio above |
| Silence gaps | Pass — none |
| True peak under 0 dBTP | Pass at −3.7 |
| Product identity (named product = shown product) | Pass — all four panels are manufacturer photography of the exact named product |
| Bitrate ≥8 Mbps | **N/A** — footage-kit rule; see the finding in `../strategy.md` |
| Narration caption band | **N/A** — no narration in this kit |

## Not yet done

- **Phone review with sound on and off.** Required by the Reels 2.1 finish gate and cannot
  be run from here. This is the representative's step.
- **Voice decision.** Four auditions in `public/assets/reels/kbeauty-picker/audio/`. If a
  voice is added, the bed needs ducking under it (roughly −8 dB with a 200ms release) and
  the ticks likely need thinning so they do not fight consonants.
- **YouTube Shorts cut.** The same file works; the bed is cleared for it. Description can
  carry a clickable link, which Instagram cannot — worth using given Shorts' measured 3×
  higher ceiling (15,182 max vs 4,829).

## Destination posts

Drives to the four beauty-lane posts, which already interlink through decision CTAs:
`395` COSRX · `396` Anua · `398` Torriden · `401` Round Lab. Caption points at
`epickor.com` only, per the in-frame URL rule.

## Scheduled

**2026-08-31 05:00 KST**, Instagram and Facebook, via Meta Business Suite on 2026-08-18. Cover is frame 0 of the render, uploaded explicitly rather than left to Meta's auto-suggestion, because the first frame is the designed thumbnail.
