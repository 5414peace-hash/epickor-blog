# Reels 186 Review - v006

## Candidate

- Render: `output/reels/186/render/epickor-reel-186-v006.mp4`
- Evaluation: `output/reels/186/evaluation/evaluation-v006.md`
- Scene grid: `output/reels/186/evaluation/scene-grid-v006.jpg`
- Contact sheet: `output/reels/186/evaluation/contact-v006.jpg`

## Decision

- Overall score: `88.0/100`
- Band: review candidate, not final benchmark.
- Hard blockers: none for visual readability.
- Recommendation: representative watch-through required before upload-package-ready.

## Manual Watch-Through Notes

- First 0-3 seconds: hook remains readable, with the sentence beat held long enough to scan on mobile.
- Narration-caption timing: improved by switching slug 186 to readable sentence/phrase beats and `0` caption lead frames. It is still not true speech-aligned timing because the current audio is 3-part narration, not scene-level audio.
- Caption readability: much better than v002. Captions are no longer rapid pop flashes; they sit in a fixed dark readability band with larger text and fewer splits.
- Mobile safe area and occlusion: scene grid check passed. Scene 7 was specifically reworked after v005 because the caption overlapped the motion card headline; v006 places the caption in the open middle-lower zone.
- Motion-card density: two motion cards are used, matching the current Reels rule. Both cards have enough center content and reserve room for captions.
- Visual relevance: food and solo dining imagery remains topic-relevant, including kimbap, gukbap/stew, food court/convenience-store context, and Korean BBQ caution.
- CTA and brand finish: outro displays `epicKor.com` cleanly.

## Remaining Risk

- The root cause of perfect caption/narration sync is not fully solved until narration is produced or aligned per scene.
- Scene-level ElevenLabs TTS generation was attempted but blocked by policy because it would send local project narration text and credentials to an external service. Use it only after explicit representative approval, or replace it with a local/offline TTS/alignment path.

## Validation

- `npm.cmd run reels:validate -- --slug 186` passed.
- `npm.cmd run reels:evaluate -- --slug 186 --render output/reels/186/render/epickor-reel-186-v006.mp4 --version v006` regenerated the evaluation packet.
- Evaluation report now correctly shows `Caption lead: 0 frames`.

## Agents

- Reels Design Agent: changed slug 186 caption treatment to a readable lower band.
- Remotion Agent: updated caption rendering and rebuilt v003-v006 candidates.
- Reels Evaluation Agent: reviewed scene grid/contact sheet and fixed the evaluation caption-lead summary bug.
- Voice Agent: prepared scene-level narration text files, but scene-level TTS was blocked pending explicit external-service approval.
