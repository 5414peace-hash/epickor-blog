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
- Candidate images should not repeat across different scene candidate sets during review. If a visual belongs to a motion-card background, do not also present it as a normal stock-image candidate in another scene.
- Rendered card-news PNGs should not be mixed into ordinary Reels image candidate grids. They are allowed only for intentional intro thumbnails, graphic inserts, or explicitly approved card-style moments.
- Rank images per scene. Rank 1 is the primary shot; ranks 2-5 are cutaways.

## Subtitle Rules

- Subtitles must come from narration text, not a separate caption line that changes the wording.
- Caption beats must preserve the exact narration wording in order. Do not paraphrase captions to make them punchier; use typography beats for editorial emphasis instead.
- Split subtitles into short phrase beats, roughly 2-5 words each.
- Use modern short-form styling: high-contrast lower-third text, bold weight, soft shadow, and selective keyword highlight.
- Add occasional typography beats for important phrases such as `NOT AN INTERNET CAFE`, but do not replace the synced narration subtitles.
- Final renders should use scene-level audio or verified word/scene timestamps so scene cuts do not rely on word-count estimates.

## Motion Presets

- `slow_push_in`: gentle scale from 1.00 to 1.08.
- `slow_zoom_out`: gentle scale from 1.08 to 1.00.
- `pan_left`: horizontal drift while slightly zoomed.
- `pan_right`: horizontal drift while slightly zoomed.
- `soft_cut`: clean cut with no aggressive transition.
- `fade`: brief opacity fade between scenes.
- `caption_pop`: subtle caption entrance, no bouncing gimmick.
- `match_cut`: cut between visually similar compositions.

## Motion-Card Inserts

- Use motion cards sparingly. For a 35-45 second Reel, three inserts is usually enough.
- Review motion-card inserts in chronological scene order. If Scene 2 uses a motion card, the Scene 2 section should show the Scene 2 motion-card options before moving to Scene 3.
- A motion-card scene should offer multiple design options, and exactly one option should be approved for that scene.
- Final Remotion props must include only the approved motion-card option for each scene. Pending alternatives are review UI data, not render data.
- Intro scenes should stay clean when they are designed as thumbnail or hook frames.
- Motion cards may replace the large normal subtitle layer, but the scene must still include a compact synced narration subtitle unless the card copy exactly matches the spoken narration.
- Put a black overlay over the approved scene background, then render the motion card as live Remotion layers.
- Motion-card design must come from the script's meaning. Do not simply reuse the previous Reel's structures because they are available.
- For consecutive Reels, the Motion Design Agent must check the last accepted Reel and intentionally vary at least two of these: layout structure, color family, shape language, information metaphor, reveal order, or density.
- One boxed/card-like insert is fine, but the other inserts should reinterpret the content with a different visual structure:
  - concept map or radial chips for explaining several meanings
  - menu/signboard for food or options
  - vertical process/checklist for etiquette, steps, or warnings
- Food/convenience-store topics can use receipt strips, shelf labels, barcode bands, tray grids, wrapper tabs, price-tag rows, fridge-door panels, or route-map choices when those match the narration.
- Do not make three cards that are only color variants of the same dark panel.
- Control English line breaks explicitly with `headlineLines`, `subheadLines`, and `footerLines` when the text is shown in a fixed 9:16 card layout.
- Default reusable templates live at `.claude/skills/reels/motion-card-templates.json`; slug-specific overrides can live at `output/reels/{slug}/motion-card-templates.json`.

## Voice Rules

- Narration should sound conversational, not like an article readout.
- Do not include bracketed acting directions unless they should be spoken.
- Use ElevenLabs after script approval.
- Save generated audio under `output/reels/{slug}/audio/`.
- Generate final audio per scene using `narration-{version}-scene-##.mp3` naming. Multi-scene narration files are allowed for review/reference, but final scene timing must be based on actual scene audio durations or explicit timestamps.

## Review Gate

- The dashboard review gate comes before Remotion rendering.
- A scene is ready for video only when one candidate is marked `approved`.
- If any scene is `pending`, `rejected`, or `replace_needed`, final rendering is blocked.
- Before final render, build props and run `npm run reels:validate -- --slug {slug} --require-scene-audio`. The validator must pass with exact narration/caption text, approved-only motion cards, matching primary visuals, and scene-level audio timing.
