# EpicKor Reels Evaluation Rubric v0.1

Use this rubric for final rendered Instagram Reels, not for early script or visual-candidate review.

Each criterion receives a raw score from `0` to `5`.

- `5`: Excellent, viewer-impact level. A normal viewer would not notice a weakness and the beat actively helps retention, clarity, or saving/sharing.
- `4`: Good and publishable, but not exceptional. A small weakness may not break publishing, but it can reduce viewer impact.
- `3`: Usable but noticeably ordinary, unclear, rushed, generic, or less compelling than a strong Reel should be.
- `2`: Weak, revision recommended.
- `1`: Serious problem, segment likely needs remake.
- `0`: Fails or missing.

Weighted score:

```text
criterion_points = raw_score / 5 * weight
final_score = sum(criterion_points)
```

## Criteria

| ID | Criterion | Weight | What To Judge |
| --- | --- | ---: | --- |
| C01 | Hook Clarity And First 2 Seconds | 8 | The viewer understands the contrast/promise immediately and the opening frame works as a Reel thumbnail. |
| C02 | Narration-Caption Timing | 12 | Captions appear at the right frame relative to speech, with expected caption lead considered. |
| C03 | Scene Cut And Audio Boundary Sync | 10 | Scene cuts land naturally with the spoken idea and scene-level audio durations. |
| C04 | Caption Readability And Phrase Quality | 8 | Captions are exact narration, short enough, readable on mobile, and not awkward fragments. |
| C05 | Instagram Mobile Safe Area | 8 | Essential text is not hidden by profile, action rail, captions, comments, or bottom UI. |
| C06 | Visual-Narration Relevance | 8 | Each visual directly supports the current spoken idea, not just the general topic. |
| C07 | Motion-Card Fit And Density | 8 | Motion cards explain structure and follow the current two-insert standard for new Reels. They are not too frequent, too generic, or too dense. |
| C08 | Pacing And Cognitive Load | 8 | The Reel feels natural to watch, neither rushed nor slow, and the viewer can process each beat. |
| C09 | Visual Continuity, Variety, And Risk | 7 | No accidental duplicates, misleading images, privacy risk, or jarring visual style changes. |
| C10 | CTA And Brand Finish | 6 | Final CTA is clear, natural, legible, and not too hard-sell. |
| C11 | Technical Render Integrity | 9 | Correct resolution, fps, duration, audio stream, nonblank frames, no silent render, no wrong motion card. |
| C12 | Production Traceability | 8 | Props, audio, source manifests, validation, contact sheet, and render version are reproducible. |

Total: `100`.

## Viewer-Impact Calibration

This rubric must be scored from the viewer's perspective, not only from the production pipeline's perspective.

Use high scores sparingly:

- `90-100`: Exceptional. The Reel is not just technically ready; it is likely to stop scrolling, communicate the idea instantly, feel natural on mobile, and leave a clear save/share reason. No meaningful optional fix should remain.
- `80-89`: Strong and publishable, but with one or more visible weaknesses that likely keep it from feeling top-tier to viewers.
- `70-79`: Usable draft or legacy candidate. It has clear strengths, but viewers would likely notice pacing, clarity, visual relevance, or polish issues.
- `60-69`: Major rework required before publishing.
- `<60`: Rebuild the concept, script, visual system, or render approach.

Apply these caps after scoring:

- If any scene weakens the central educational idea with a merely generic or narrow visual, cap at `86`.
- If CTA or important lower text may be crowded by Instagram UI, cap at `88`.
- If motion cards create noticeable reading load or feel like filler, cap at `86`.
- If a new Reel uses more than two motion-card inserts without an explicit representative exception recorded in `HANDOFF.md`, cap at `86`.
- If the hook is clear but not thumb-stopping within roughly the first second, cap at `86`.
- If the final score is above `90`, the report must explicitly explain why a real viewer would likely call it excellent, not just cleanly produced.
- If the report contains an "optional improvement" that affects comprehension, retention, or mobile legibility, the score should usually stay below `90`.

## Accepted Baseline

Use the confirmed 2026-05-11 set as the minimum production reference:

- `170 v011`: accepted after correcting wrong-audio fallback and exact caption/narration wording. Legacy exception: 3 part-audio files.
- `171 v008`: accepted after scene-level audio, intro cleanup, safe-area fixes, and removal of the text-heavy card-news background.
- `172 v008`: accepted current benchmark for visual proof, motion-card restraint, caption placement, and CTA safety.

Future new Reels should not repeat any defect that was fixed in this set. Treat these as known hard failures, not as fresh edge cases:

- fallback/default audio render.
- widespread narration/caption wording mismatch.
- card-news PNG or text-heavy background used as a normal visual.
- motion-card footer or badge overlapping synced speech captions.
- non-final yellow typography placed in the bottom Instagram UI region.
- excessive same-looking motion cards in the middle of the Reel.

## Reporting Requirement

Every completed evaluation must include a Korean owner-facing summary when the user is Korean or the project handoff is being discussed in Korean. This summary should appear in the saved Markdown report and in the assistant's response to the user.

Include:

- Reel ranking, score, and decision.
- The main reason each Reel scored that way.
- Top fixes by priority.
- Which agent should receive each rework call.
- Paths to the saved reports or summary files.

## Hard Gates

Apply hard gates after scoring:

- No audio stream in final render: cap at `69`.
- Wrong audio source or unintended fallback audio in final render: cap at `69`.
- Validation fails with `--require-scene-audio`: cap at `69`.
- Caption text differs from narration: cap at `79`; if widespread, cap at `69`.
- Approved motion-card option is not the rendered option: cap at `69`.
- Severe mobile occlusion of hook/CTA/core caption: cap at `79`; if repeated, cap at `69`.
- Misleading or privacy-risk visual: cap at `59`.
- Text-heavy rendered graphic/card-news PNG used as an ordinary background: cap at `69`; cap at `59` if it misleads or makes the scene unreadable.

## Evidence Standards

Every score below `5` must include evidence:

- Time in seconds.
- Frame number.
- Scene number.
- What the viewer sees/hears.
- Why the issue matters.
- Which agent should fix it.

Example:

```md
- C02 / Scene 1 / 00:01.40 / frame 42:
  Caption shows "They treat it like" before the voice reaches that phrase.
  The viewer reads ahead and the hook feels mistimed.
  Route to Reels Remotion Agent for caption start-frame override.
```

## Mobile Safe-Area Checks

Use a 1080x1920 Instagram assumption:

- Top profile/name region: roughly `y=0-160`.
- Right action rail: roughly `x=930-1080`, `y=520-1500`.
- Bottom caption/comment/navigation region: roughly `y=1450-1920`.
- Core caption safe region: prefer `x=80-900`, `y=240-1420`.
- CTA may sit lower, but must remain visible in feed and Reels UI.
- Motion-card footers, badges, and bottom labels count as protected content. Synced narration captions must not overlap them.
- For `radial_burst` or other center-lockup templates, expected narration-caption region is the mid-lower gap under the main graphic, not the bottom UI region.
- Yellow emphasis typography should use deliberate line breaks and sit above the active narration caption, except final CTA typography.

## Recommended Decisions

- `90-100`: publish priority / benchmark candidate.
- `80-89`: publishable, but patch if the weakness is quick to fix.
- `70-79`: patch and rerender before using as a benchmark; publish only if timing or scope requires it.
- `60-69`: remake one or more segments.
- `<60`: rebuild concept/script/render.

## Rework Priority

Fix in this order:

1. Hard gates.
2. Caption/audio sync.
3. Hook and first 2 seconds.
4. Mobile safe-area occlusion.
5. Motion-card density and readability.
6. Visual relevance.
7. CTA polish.
