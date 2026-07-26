# Reels 229 QA Review - Final Candidate

## Status

Visual selection has been reopened for representative dashboard review. v004 remains archived as the latest rendered reference, but it is no longer treated as the final visual-approved candidate after representative feedback on image fit and thumbnail design.

- Latest rendered reference: `output/reels/229/render/epickor-reel-229-v004.mp4`
- Reopened dashboard: `http://localhost:4000/reels-review/229`
- Thumbnail concepts page: `http://localhost:4000/assets/reels/229/thumbnail-concepts/index.html`
- Evaluation packet: `output/reels/229/evaluation/evaluation-v004.md`
- Contact sheet: `output/reels/229/evaluation/contact-v004.jpg`
- Scene grid: `output/reels/229/evaluation/scene-grid-v004.jpg`
- Key frame checks:
  - Intro Taegeukgi/title: `output/reels/229/evaluation/intro-frame-v004.png`
  - CTA split line: `output/reels/229/evaluation/cta-frame-v004.png`
  - `epicKor.com` caption beat: `output/reels/229/evaluation/cta-site-frame-v004.png`
  - Black-screen outro: `output/reels/229/evaluation/outro-frame-v004.png`

## Checks

- Strategy file exists and records Reels Viral Fit Score: `90/100`.
- Voice lane selected: `male_friend`.
- Male voice audition file generated: `output/reels/229/audio/audition-v001-male_friend.mp3` (`9.52s`).
- Scene-level voice files are present for render audio version `v002`.
- Thumbnail directions recorded: Mystery, Mistake, Decision; selected Mystery.
- Scene count: 7 plus black-screen outro.
- Motion-card count: exactly one, Scene 5.
- Final selected visuals are stored as 1080x1920 crops in `public/assets/reels/229/approved-crops/`.
- Dashboard gate passed with 30 photo candidates and 30 source-family rows.
- Render readiness validation passed with `--require-scene-audio`.
- v004 evaluation score: `92.3/100`, pass / ready for representative review.
- Technical audio checks: aac stereo stream exists, mean volume `-20.7 dB`, max volume `-3.9 dB`, no clipping indicated; only a 0.708s mid-roll pause and 3.274s intentional outro tail were detected by silence scan.

## Revision Notes From v002

1. Increased photo/background cuts from 6 to 11 so footage changes more often.
2. Added secondary visual support for Scenes 1, 2, 3, 4, and 6.
3. Added a small tilted Taegeukgi behind the intro title.
4. Removed the incorrect yellow `WORLD CUP BRUNCH` thumbnail kicker.
5. Split the final CTA caption into `More Korean culture guide at` and `epicKor.com`.
6. Added a centered black-screen `epicKor.com` motion-typography outro.

## Reopened Review Notes

- Representative judged the selected images still not appropriate enough and requested direct dashboard selection.
- Photo-scene ranks were cleared in `visual-candidates.json`.
- `scenes.json` status is now `visual_review_pending`.
- `approved-visuals.json` is marked `reopened_for_representative_selection`.
- Taegeukgi intro accent was removed from `remotion/ReelComposition.tsx`.
- Three static thumbnail design concepts were created under `public/assets/reels/229/thumbnail-concepts/`.

## Manual Visual Review Notes

1. Scene 1 thumbnail hook is centered and readable: `WHY THE FLOOR?`.
2. The Taegeukgi is subtle and behind the title, not a competing foreground element.
3. Photo sequence now supports the logic with more frequent changes: floor-life interiors -> hanok entrance/interior -> ondol/agungi -> low-table rooms -> three-zone rule -> slipper mistake -> hanok outro.
4. Scene 5 motion card uses exactly one payoff insert and keeps the center filled.
5. Captions stay in the lower readable band and do not overlap key card rows or outro text.
6. S6 includes a neutral slipper/tile support cut; narration avoids claiming it is a Korea-specific photo.
7. Black outro cleanly centers `epicKor.com` as the final motion-graphic brand beat.

## Remaining Human Check

- Codex cannot make a human-ear judgment on the final male voice tone. Representative review should listen once for tone preference before scheduling/upload.
