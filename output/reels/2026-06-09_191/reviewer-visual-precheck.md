# Reels 191 Visual Dashboard Precheck

Date: 2026-06-12

## Scope

- Source post: `content/blog/191.md`
- Dashboard: `http://localhost:4000/reels-review/191`
- Non-motion scenes: 1, 3, 5, 6, 7
- Motion-card scenes: 2, 4

## Candidate Depth Audit

- Scene 1: 2 photo candidates, no repeated path.
- Scene 2: 3 motion-card design candidates.
- Scene 3: 2 photo candidates, no repeated path.
- Scene 4: 3 motion-card design candidates.
- Scene 5: 4 photo candidates, no repeated path.
- Scene 6: 4 photo candidates, no repeated path.
- Scene 7: 4 photo candidates, no repeated path.

Total:

- 16 photo candidates across 5 non-motion scenes.
- 6 motion-card options across 2 motion-card scenes.
- 0 repeated `image`/`src` paths across photo candidate scenes.

## Visual Fit Notes

- Korea-first coverage is strongest in scenes 1 and 3 through the source-post Korea University and Yonsei images.
- Scene 1 thumbnail candidate uses large readable title lines: `STUDY HARD` / `PLAY HARDER`.
- Scene 5 now has four study/career-prep options: laptop study, wide library, outdoor laptop work, and two-student laptop study.
- Scene 6 intentionally avoids misleading alcohol/party stock and now has four choices: Seoul exterior, group-study pressure, campus socializing, and Seoul youth street life.
- Scene 7 now has four outro choices: campus steps, campus walking, young Seoul smartphone, and Seoul skyline/young people.
- Motion-card scene 2 has split-compare, receipt, and checklist options.
- Motion-card scene 4 has grid, board, and stamp options.

## Checks Run

- JSON parse and local file existence check: passed after the scene 5/6/7 expansion.
- Same-dashboard photo candidate duplicate path check: passed, `0`.
- Motion-card background file existence check: passed.
- Local page HTTP check: `http://localhost:4000/reels-review/191` returned 200.
- Visuals API check after expansion returned `minRankedVisualsPerScene: 1` and reflected 16 photo candidates plus 6 motion-card options.
- Expanded contact sheet created and inspected: `output/reels/191/visual-contact-sheet-expanded.jpg`.
- Static image HTTP check: representative new candidate image returned 200.
- Build check: `npm.cmd run build` passed.

## Caveats

- Direct browser screenshot QA through Playwright was blocked because this project does not currently have Playwright installed locally and the Node REPL browser path failed with a host asset-path error.
- Manual visual review was performed on `output/reels/191/visual-contact-sheet.jpg`, not on a full interactive browser screenshot.
- Generic Pexels student/library candidates are marked as weaker Korea-context fallbacks inside `visual-candidates.json`; added Seoul-specific scene 6/7 options to improve Korea context.

## Reviewer Status

Structural and contact-sheet visual precheck passed after the scene 5/6/7 expansion. Dashboard is ready for representative review, with the caveat that some scene 5 campus/library options remain generic while scene 6/7 now include stronger Seoul-context alternatives.

## Scene 7 Replacement Pass - 2026-06-12

- Representative submitted the dashboard, and saved state showed scene 7 marked `replace_needed` for all four prior options.
- Do not proceed to TTS/render until scene 7 is selected and final visual approval is locked.
- Replaced scene 7 options with five stronger candidates:
  - `191-s7-korea-university-outro-crop`
  - `191-s7-yonsei-outro-crop`
  - `191-s7-korea-music-hall-outro-crop`
  - `191-s7-seoul-crossing-people`
  - `191-s7-campus-graduates`
- The first three are Korea-specific campus/outro options using separate derivative paths; they are documented in `image-sources.md` as intentional callback candidates, not accidental same-path reuse.
- Created `output/reels/191/scene7-replacement-contact.jpg` and inspected it.
- Verification:
  - Scene counts now: S1=2, S3=2, S5=4, S6=4, S7=5.
  - Total photo candidates: 17.
  - Duplicate candidate paths: 0.
  - Scene 7 candidate files all exist.
  - API now returns `Next: review the refreshed replacement candidates for scene 7.`
  - Scenes 1-6 are approved/selected; scene 7 remains the only replacement-needed scene.
