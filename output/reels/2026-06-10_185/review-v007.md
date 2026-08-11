# Reels 185 Review - v007

- Final candidate: `output/reels/185/render/epickor-reel-185-v007.mp4`
- Upload package: `output/final/reels/185/EPICKOR_185.mp4`
- Evaluation packet: `output/reels/185/evaluation/evaluation-v007.md`
- Contact sheet: `output/reels/185/evaluation/contact-v007.jpg`
- Scene grid: `output/reels/185/evaluation/scene-grid-v007.jpg`

## Representative Fixes

- Fixed the Scene 4 timing drift that started around the `goes to recover` narration by adding slug `185` scene-duration overrides for part-02.
- Rebalanced Scene 4-6 durations to `144 / 108 / 136` frames so the part-02 audio boundary is no longer governed only by rough narration-weight allocation.
- Reworked the Scene 4 caption beat from the isolated `goes to recover.` beat into `It is where` / `Seoul goes` / `to recover.` for steadier phrase pacing.
- Changed the final on-screen domain caption and outro text to `epicKor.com`.
- Kept spoken narration as `EpicKor dot com.` so the audio pronunciation stays natural while the screen uses the clean URL form.

## Verification

- `npm.cmd run reels:props -- --slug 185 --audio-version v002`
- `npm.cmd run reels:validate -- --slug 185` passed.
- `npm.cmd run reels:render -- --slug 185 --version v007 --audio-version v002`
- `npm.cmd run reels:evaluate -- --slug 185 --render output/reels/185/render/epickor-reel-185-v007.mp4 --version v007`
- `ffprobe` confirmed H.264 1080x1920 video with AAC audio, duration `37.717s`.
- Manual contact-sheet check confirmed the final screen displays `epicKor.com`.

## Remaining Notes

- Machine findings still note 3-part audio rather than scene-level audio, plus two short terminal beats (`task.`, `jjimjilbang,`) and Scene 7 length. These are inherited from the approved v004 structure and are not blockers for this representative-requested timing/domain fix.
