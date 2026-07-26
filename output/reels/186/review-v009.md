# Reels 186 Review - v009

## Candidate

- Render: `output/reels/186/render/epickor-reel-186-v009.mp4`
- Evaluation: `output/reels/186/evaluation/evaluation-v009.md`
- Scene grid: `output/reels/186/evaluation/scene-grid-v009.jpg`
- Contact sheet: `output/reels/186/evaluation/contact-v009.jpg`

## Decision

- Overall score: `90.0/100`
- Band: representative review candidate.
- Hard blockers: none found in rendered image review.
- Recommendation: representative watch-through required, with special attention to the newly generated Scene 7 Korean phrase audio.

## Fixes From Representative Feedback

- Subtitle max line rule:
  - Readable-band captions now render with explicit `pre-line` handling and a 2-line clamp.
  - Validation now fails if a readable caption beat has more than 2 explicit lines.
  - Scene 5 was re-split after v008 because the 2-line clamp caused text truncation; v009 removes that truncation.
- Narration-caption timing:
  - Root cause found: Reels 186 audio part mapping was wrong.
  - Actual `voiceover-part-03.txt` starts with Scene 6, but props previously mapped part 2 to Scenes 4-6 and part 3 to Scenes 7-8.
  - Fixed slug 186 mapping to:
    - part 1: Scenes 1-3
    - part 2: Scenes 4-5
    - part 3: Scenes 6-8
  - Caption lead remains `0 frames`.
- Scene 7 phrase replacement:
  - Spoken-caption beat changed to:
    - `Say: hona-ja muk-u-do joa-yo?`
    - `혼자 먹어도 좋아요?`
  - Scene 7 motion-card slips were also updated from the old `Honja / meogeodo / dwaeyo?` wording to the new expression.
  - Part-03 audio was regenerated as `narration-v002-part-03.mp3` through ElevenLabs after explicit approval.

## Validation

- `npm.cmd run reels:validate -- --slug 186` passed.
- `npm.cmd run reels:evaluate -- --slug 186 --render output/reels/186/render/epickor-reel-186-v009.mp4 --version v009` completed.
- Render facts:
  - Duration: `35.307s`
  - Resolution: `1080x1920`
  - Audio: AAC 48kHz stereo
  - Motion cards: `2`
  - Caption lead: `0 frames`

## Remaining Note

- The Reel still uses 3 audio segments, not true scene-level audio. The part mapping is now corrected, so the major timing offset is fixed, but future Reels should move to scene-level audio or forced alignment for tighter caption timing.

## Agents

- Voice Agent: regenerated v002 part-03 audio with the updated Scene 7 phrase.
- Remotion Agent: corrected slug 186 audio part mapping, caption beats, 2-line rendering clamp, and rendered v007-v009.
- Reels Evaluation Agent: inspected v007/v008/v009 grids and caught the lingering Scene 7 motion-card wording and Scene 5 truncation.
