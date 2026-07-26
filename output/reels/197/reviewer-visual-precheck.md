# Reels 197 Visual Dashboard Precheck

- Slug: `197`
- Topic: `Boryeong Mud Festival 2026`
- Dashboard frame: Reels 196 fixed button frame
- Dashboard: `.tmp/reel197-review-share/index.html`
- Candidate sheet: `output/reels/197/evaluation/candidate-sheet-v001.jpg`

## Scene Structure

- Scenes: 7
- Photo-led scenes: S1, S2, S3, S5, S6, S7
- Motion-card scenes: S4 only
- Motion-card note: representative explicitly requested one motion-card insert for this Reel.

## Candidate Depth

- Photo candidates: 18 total
- Photo candidate count: 3 per photo-led scene
- Motion-card options: 3 for S4
- Duplicate `src` paths: none

## Sources

- Official 2026 event/date/program verification: `https://mudfestival.or.kr/festival/view`
- Source post assets: `public/assets/images/posts/197/`
- Additional Commons assets: `public/assets/reels/197/candidates/`
- Derivative vertical crops: `public/assets/reels/197/derivatives/`

## Gate Results

- `npm.cmd run reels:dashboard-gate -- --slug 197` passed.
- Gate output:
  - Photo candidates: 18
  - Photo source families: 10
- Gate warnings:
  - Some source families appear twice across different scenes.
  - This is documented and kept within the gate limit; no exact image path repeats inside the dashboard.

## Manual Visual Review

- Inspected `output/reels/197/evaluation/candidate-sheet-v001.jpg`.
- Thumbnail lockup uses `BORYEONG 2026 / MUD FEST / SURVIVAL / EPICKOR.COM`.
- Motion-card text no longer clips in the candidate sheet.
- Most candidate slots use real Boryeong Mud Festival / Daecheon Beach photos.
- Official 2026 program images are retained only where they improve current-event/date/zone accuracy.
