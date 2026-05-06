# EpicKor Reels Design System v0.1

## Format

- Canvas: 1080x1920, vertical 9:16.
- Duration target: 30-60 seconds.
- Scene count: 6-9 scenes for the MVP.
- Visual count: use 2-5 ranked images per scene when the narration contains multiple visual nouns or actions.
- Safe area: keep captions inside the central 900x1500 region when possible.
- Brand: use small `EPICKOR.COM` text, not a large logo lockup.

## Story Rhythm

- Scene 1 must hook within 2 seconds.
- Each scene should carry one idea only.
- Avoid reading the blog summary. Reels should feel like a short argument, observation, or cultural reveal.
- Use the blog post as source material, then rewrite for spoken pacing.

## Visual Rules

- Prefer direct visual matches over beautiful but generic images.
- Use source-post images first when they are relevant.
- Avoid close-up strangers, misleading celebrity/product imagery, or location claims the image cannot support.
- Record source and license notes for each candidate.
- Do not treat an image as approved until a human review status is saved.
- Avoid reusing the same image URL across scenes unless the duplicate is deliberate and recropped.
- Rank images per scene. Rank 1 is the primary shot; ranks 2-5 are cutaways.

## Subtitle Rules

- Subtitles must come from narration text, not a separate caption line that changes the wording.
- Split subtitles into short phrase beats, roughly 2-5 words each.
- Use modern short-form styling: high-contrast lower-third text, bold weight, soft shadow, and selective keyword highlight.
- Add occasional typography beats for important phrases such as `NOT AN INTERNET CAFE`, but do not replace the synced narration subtitles.

## Motion Presets

- `slow_push_in`: gentle scale from 1.00 to 1.08.
- `slow_zoom_out`: gentle scale from 1.08 to 1.00.
- `pan_left`: horizontal drift while slightly zoomed.
- `pan_right`: horizontal drift while slightly zoomed.
- `soft_cut`: clean cut with no aggressive transition.
- `fade`: brief opacity fade between scenes.
- `caption_pop`: subtle caption entrance, no bouncing gimmick.
- `match_cut`: cut between visually similar compositions.

## Voice Rules

- Narration should sound conversational, not like an article readout.
- Do not include bracketed acting directions unless they should be spoken.
- Use ElevenLabs after script approval.
- Save generated audio under `output/reels/{slug}/audio/`.

## Review Gate

- The dashboard review gate comes before Remotion rendering.
- A scene is ready for video only when one candidate is marked `approved`.
- If any scene is `pending`, `rejected`, or `replace_needed`, final rendering is blocked.
