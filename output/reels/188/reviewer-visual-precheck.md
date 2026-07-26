# Reels 188 Reviewer Visual Precheck

Date: 2026-06-12
Reviewer Agent: Codex

## Current Status

- Source post verified: `content/blog/188.md`
- Reels script verified: `output/reels/188/script.md`
- Scene manifest created: `output/reels/188/scenes.json`
- Motion-card manifest created: `output/reels/188/motion-cards.json`
- Visual candidates created: `output/reels/188/visual-candidates.json`
- Status: `visuals_pending_review`
- Rebuilt after representative rejected the first review package presentation.

## Structure Check

- Scene count: 7
- Motion cards: 2 exactly
- Motion-card scenes: 3 and 6
- Photo/video scenes: 1, 2, 4, 5, 7
- Outro text: `epicKor.com`

## Caption Standard

- Reels 188 follows the representative-confirmed 186/187 spoken subtitle direction.
- Spoken narration captions should render as readable-band captions with max two visible lines.
- Caption beats have been planned with context-aware line breaks rather than tiny fragments.

## Rebuild Fixes

- Scene `1` dashboard thumbnail preview now reads `thumbnailOverlay` from `visual-candidates.json`.
  - Kicker: `SEOUL OR BUSAN?`
  - Title: `WHICH CITY` / `FIRST?`
  - Watermark: `EPICKOR.COM`
- Rebuilt again after representative said the Scene `1` thumbnail text was too small compared with the Reels `186` final-confirmed dashboard.
  - Restored title font to the Reels `186` confirmed dashboard size: `18`.
  - Changed candidate-card grid width from stretch-to-fill to `minmax(165px, 180px)` with `justifyContent: start`, so low-candidate scenes do not create oversized preview cards that make overlay text appear too small.
- Removed reused support candidates from other EpicKor post folders (`192`, `193`, `194`).
- Added fresh Pexels candidates for Seoul palace, Haeundae, Myeongdong, Gamcheon, and itinerary/transit closing scenes.
- Changed Scene `3` motion card from unsupported/mismatched `wrong_vs_right` to supported `split_checklist`.
- Kept Scene `6` as `receipt_stack`.

## Visual Fit Notes

- Scene 1 has a source-post palace option and a fresh Gwanghwamun/Gyeongbokgung Pexels option.
- Scene 2 has source-post Haeundae plus fresh Haeundae/Busan coastline options.
- Scene 4 has source-post Myeongdong plus fresh Myeongdong shopping/night options.
- Scene 5 has source-post Gamcheon plus fresh Gamcheon options.
- Scene 7 has fresh transit/Busan closing options instead of reused local post assets.

## Verification

- JSON parse passed for `scenes.json`, `motion-cards.json`, and `visual-candidates.json`.
- Same-dashboard non-motion candidate duplicate check passed: `16` candidates, `0` duplicates.
- Motion-card template check passed:
  - `188-card-short-trip-seoul`: `split_checklist`
  - `188-card-trip-shape-rule`: `receipt_stack`
- Local API HTTP `200`: `http://localhost:4000/api/reels/188/visuals`
- Local page HTTP `200`: `http://localhost:4000/reels-review/188`
- API payload check:
  - `7` candidate scenes
  - `2` motion cards
  - Scene `1` thumbnail overlay present as `SEOUL OR BUSAN?` / `WHICH CITY` / `FIRST?`
- Re-check after 186-style thumbnail sizing:
  - Local page HTTP `200`: `http://localhost:4000/reels-review/188`
  - Code check confirms `minmax(165px, 180px)` candidate cards and title font `18`.

## Blockers

- Representative ranking/approval is still needed before final asset preparation, TTS, and render.
