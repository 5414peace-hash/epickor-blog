# Reels 198 Reviewer Visual Precheck

## Candidate Depth

- Scene 1: photo-led, 2 candidates.
- Scene 2: photo-led, 2 candidates.
- Scene 3: motion-card-led, 3 design options.
- Scene 4: photo-led, 3 candidates.
- Scene 5: motion-card-led, 3 design options.
- Scene 6: photo-led, 2 candidates.
- Scene 7: photo-led, 2 candidates.

## Visual Fit Notes

- All candidates use Blog 198 approved EpicKor-generated support visuals or derivative crops from those visuals.
- The dashboard is support-visual based, not official Waterbomb documentary imagery.
- The strongest direct-topic scenes are 1, 2, 4, 5, and 6.
- No photo-led candidate path repeats across scenes.
- Near-duplicate crop options were removed after contact-sheet inspection.
- Motion cards are exactly two scenes: 3 and 5.

## Gate Status

Structural/candidate-depth precheck passes for representative visual review.

Blocked before final render:

- Human visual approval in `/reels-review/198`.
- Scene-level TTS audio.
- `npm.cmd run reels:prepare-assets -- --slug 198`.
- `npm.cmd run reels:props -- --slug 198 --audio-version {version}`.
- `npm.cmd run reels:validate -- --slug 198 --require-scene-audio`.
