# Reels 187 Reviewer Visual Precheck

- Date: 2026-06-11 21:05 KST
- Slug: 187
- Source post: `content/blog/187.md`
- Public dashboard: `https://reel187-dashboard.vercel.app`
- Dashboard type: temporary standalone Vercel production alias, not main EpicKor site.

## Status

- Representative rejected multiple Reels 187 dashboard passes because they were still thinner and more repetitive than the Reels 186 final-confirm dashboard.
- Rebuilt the candidate pool and dashboard again to match the 186 standard more closely.
- Final Remotion render has not started.
- Human visual approval is still required before asset selection and render.

## What Was Wrong Before

- Candidate pools were too small.
- The same source images appeared in multiple scenes.
- Scene 7 did not separately cover all sentence keywords.
- Scene 1 mixed normal image cards and graphic cards, so thumbnail candidates were not comparable.
- Ranking buttons were initially missing.

## 186 Benchmark Applied

- `output/reels/186/visual-candidates.json` and 186 reviewer notes were used as the comparison reference.
- Rebuilt `output/reels/187/visual-candidates.json`:
  - Scene 1: 6 candidates
  - Scene 2: 5 candidates
  - Scene 3: 6 candidates
  - Scene 4: 4 owned motion/graphic candidates
  - Scene 5: 6 candidates
  - Scene 6: 4 owned motion/graphic candidates
  - Scene 7: 12 keyword-grouped candidates
  - Total: 43 candidates
- Duplicate gate:
  - Local manifest duplicate `src` count: 0
  - Remote deployed manifest duplicate `src` count: 0
- Scene 1 thumbnail gate:
  - All Scene 1 candidates now render in the same thumbnail-style overlay frame.
  - Overlay text: `KOREA SUPERSTITIONS` / `TINY RULES` / `PEOPLE NOTICE` / `EPICKOR.COM`.

## New Source Work

- Re-ran Pexels searches for:
  - Korean superstition / Seoul everyday context
  - Seoul/elevator/button context
  - red pen / name-writing context
  - Korean/electric fan context
  - exam / Korean soup / shoes / Seoul night / stone wall context
- Excluded Pexels IDs already detected in Reels 186 or prior public/cardnews assets where practical.
- Added source summary:
  - `output/reels/187/image-sources.md`
- Exact miyeokguk/yeot images remain limited from safe sources. Weak soup/sticky-food substitutes are explicitly labeled as weak rather than disguised as exact.

## Scene Notes

- Scene 1: 6 candidates, all same thumbnail frame.
- Scene 2: 5 elevator/transit candidates; generic elevator options are labeled as weaker Korea-specificity because Scene 1 owns the exact Korean F-button image.
- Scene 3: 6 red-ink/name-writing candidates; action images now lead over static red pens.
- Scene 4: 4 owned motion/graphic candidates for the red-name rule; this remains motion-card slot 1 of 2.
- Scene 5: 6 fan candidates; source-post Korean fan timer remains strongest but low-res.
- Scene 6: 4 owned motion/graphic candidates for the timer etiquette beat; this remains motion-card slot 2 of 2.
- Scene 7: 12 grouped candidates covering exam, soup/food, sticky/rice-cake, partner/shoes, wall, night, and save-cue contexts.

## Access Verification

- `https://reel187-dashboard.vercel.app` returned HTTP 200.
- `https://reel187-dashboard.vercel.app/visual-candidates.json` returned HTTP 200.
- Representative clarification pass:
  - `Copy` was renamed to `Copy ranking`.
  - `Clear` was renamed to `Clear choices`.
  - Helper text now explains that copy only copies the ranking summary and clear resets local browser selections.
  - Scene 2 restored the exact Korean F-button elevator source as a separate documented derivative path:
    - `/assets/reels/187/candidates/korea-no-4th-floor-elevator-scene2.jpg`
  - Last-part Pexels images are served through local dashboard static assets under `/assets/remote/pexels-{id}.jpg` to reduce mobile image loading failures.
  - Final outro requirement is explicitly shown as `epicKor.com`.
- Remote deployed manifest check:
  - scenes: 7
  - total candidates: 44
  - duplicate `src`: 0
- HTML body check confirmed:
  - `thumbnail-overlay`
  - `Your ranking summary`
  - `rank-btn`
  - `Known Weak Points`
  - `Copy ranking`
  - `Clear choices`
  - `epicKor.com`
- JSON body check confirmed:
  - `187-s2-a-korean-f-elevator-restored`
  - `finalOutroText`
  - `epicKor.com`
- Sample static asset checks returned HTTP 200:
  - `/assets/remote/pexels-8742649.jpg`
  - `/assets/korea-no-4th-floor-elevator-scene2.jpg`

## Verification Limitation

- Browser screenshot verification was attempted earlier through Node REPL, but `playwright` was not installed in that runtime.
- Fallback verification used deployed HTTP checks, HTML/JSON body checks, and local/remote duplicate-src validation.

## Agents

- Research/Visual Agent: re-sourced Pexels candidates, excluded detected prior-use IDs where practical, and rebuilt Scene 7 as keyword groups.
- Reviewer Agent: enforced duplicate-src gate, Scene 1 thumbnail uniformity gate, weak-fit labels, and ranking UI presence before sharing.
- Publisher/Ops Agent: redeployed the improved external dashboard to the same production alias.
