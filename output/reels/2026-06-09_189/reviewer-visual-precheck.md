# Reels 189 Reviewer Visual Precheck

Date: 2026-06-12
Reviewer Agent: Codex

## Current Status

- Source post verified: `content/blog/189.md`
- Reels script verified: `output/reels/189/script.md`
- Scene manifest rebuilt: `output/reels/189/scenes.json`
- Motion-card manifest rebuilt: `output/reels/189/motion-cards.json`
- Visual candidates rebuilt: `output/reels/189/visual-candidates.json`
- Status: `visuals_pending_review`

## Dashboard Standards Applied

- Scene `1` thumbnail uses short overlay text:
  - Kicker: `SEOUL DMZ TOUR`
  - Title: `NOT ONE` / `PLACE`
  - Watermark: `EPICKOR.COM`
- The review UI already uses the Reels `186` final-confirmed candidate card sizing:
  - candidate grid `minmax(165px, 180px)`
  - Scene 1 title font `18`
- No repeated candidate `src` paths inside `visual-candidates.json`.
- Exactly `2` motion cards:
  - Scene `2`: `stamp_stack`
  - Scene `6`: `kit_grid`

## Visual Fit Notes

- Scene `1`: source-post Imjingak locomotive is the default thumbnail candidate.
- Scene `3`: JSA/Panmunjom Wikimedia image supports the line that JSA is not automatically included.
- Scene `4`: source-post Dora Observatory supports the controlled-viewpoint line.
- Scene `5`: neutral passport/travel-document image supports passport checks without faking a DMZ checkpoint.
- Scene `7`: source-post Third Tunnel area supports the final practical warning and avoids repeating Scene `1`.

## Blockers

- Representative ranking/approval is required before asset prep, TTS, or rendering.
- Wikimedia candidate attribution should be rechecked if a non-source-post Wikimedia image is selected for final render.

## Scene 5 Replacement Pass

- Representative submitted review and specifically requested Scene `5` use a DMZ / Second or Third Tunnel style visual instead of the generic passport/document candidates.
- Removed the passport/suitcase candidates from Scene `5`.
- Replaced Scene `5` candidates with:
  - A: `/assets/images/posts/189/third-tunnel-area.jpg`
  - B: Wikimedia `Third Tunnel of Aggression 01` 1280px thumbnail
  - C: Wikimedia `Third Tunnel of Aggression 04` 1280px thumbnail
- Scene `5` now prioritizes the line's controlled-route/military-rules/access-change meaning instead of the passport-check subphrase alone.
- Duplicate cleanup:
  - Scene `7` candidate A previously reused `/assets/images/posts/189/third-tunnel-area.jpg`.
  - Replaced it with Wikimedia `Third Tunnel of Aggression 09` 1280px thumbnail so Scene `5` can use the local Third Tunnel image without same-dashboard path duplication.

## Verification

- JSON parse passed for:
  - `output/reels/189/scenes.json`
  - `output/reels/189/motion-cards.json`
  - `output/reels/189/visual-candidates.json`
- Same-dashboard non-motion candidate duplicate check passed:
  - `12` non-motion candidates
  - `0` duplicate `src` paths
- Local image existence check passed:
  - `/assets/images/posts/189/dmz-imjingak-locomotive.jpg`
  - `/assets/images/posts/189/dora-observatory.jpg`
  - `/assets/images/posts/189/third-tunnel-area.jpg`
- Motion-card template check passed:
  - `189-card-access-layers`: `stamp_stack`
  - `189-card-dmz-kit`: `kit_grid`
- Remote image URL checks passed with HTTP `200` for key Wikimedia/Pexels candidates.
- Local API HTTP `200`: `http://localhost:4000/api/reels/189/visuals`
- Local page HTTP `200`: `http://localhost:4000/reels-review/189`
- API payload confirms:
  - `7` candidate scenes
  - `2` motion cards
  - Scene `1` thumbnail overlay: `SEOUL DMZ TOUR` / `NOT ONE` / `PLACE`

## Known Limitation

- Automated browser screenshot QA could not be run because the available Node MCP toolset does not expose a JS execution tool and this repo does not have Playwright installed.
- Structural/API/page checks passed, but representative visual inspection remains required before finalizing.
