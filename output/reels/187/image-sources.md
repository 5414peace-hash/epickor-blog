# Reels 187 Image Sources - Rebuilt Dashboard

- Date: 2026-06-11
- Active dashboard: `https://reel187-dashboard.vercel.app`
- Active candidate manifest: `output/reels/187/visual-candidates.json`

## Source Policy Applied

- Rebuilt against the Reels 186 final-confirm dashboard standard.
- No candidate `src` is repeated across the active manifest.
- Scene 1 candidates all use the same thumbnail overlay frame for fair comparison.
- Pexels IDs already detected in Reels 186 or prior public/cardnews assets were excluded where practical.
- Exact miyeokguk/yeot images were not available from the current safe-source pass; weak substitutes are labeled as weak rather than treated as exact.

## Candidate Counts

- Scene 1: 6 candidates
- Scene 2: 5 candidates
- Scene 3: 6 candidates
- Scene 4: 4 owned motion/graphic candidates
- Scene 5: 6 candidates
- Scene 6: 4 owned motion/graphic candidates
- Scene 7: 12 keyword-grouped candidates
- Total: 43 candidates

## Key Existing Source-Post Images

- `/assets/images/posts/187/korea-no-4th-floor-elevator.jpg`
  - Wikimedia Commons / namho / CC BY 2.0
  - Used only as Scene 1 candidate A.
- `/assets/reels/187/candidates/korea-no-4th-floor-elevator-scene2.jpg`
  - Derivative copy of the same Wikimedia Commons / namho / CC BY 2.0 source-post image.
  - Used as Scene 2 candidate A because the representative requested restoring the exact F-instead-of-4 elevator source for the matching sentence.
- `/assets/images/posts/187/red-pens.jpg`
  - Wikimedia Commons / DigitDiva / CC BY-SA 4.0
  - Used only as Scene 3 fallback candidate E.
- `/assets/images/posts/187/korean-fans-timer.jpg`
  - Wikimedia Commons / Na-Rae Han / public domain
  - Used only as Scene 5 candidate A.

## Pexels Source Notes

The active Pexels URLs and photo IDs are embedded directly in `output/reels/187/visual-candidates.json` so the dashboard can show a large review pool without downloading every candidate before representative approval.

For dashboard reliability, Pexels candidates were also mirrored into `.tmp/reel187-dashboard/assets/remote/pexels-{id}.jpg` before Vercel deployment so mobile review is not dependent on Pexels hotlink loading.

For final rendering, download only the representative-approved candidates into the canonical `public/assets/reels/187/` render path and record the final selected IDs in the asset manifest.
