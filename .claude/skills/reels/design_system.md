# EpicKor Reels Design System v0.1

For new Reels after 2026-06-24, also follow `.claude/skills/reels/creative_performance_standard.md`. That file controls creative gates, Reels Viral Fit Score, thumbnail variants, one-motion-card policy, voice lanes, and performance postmortems.

## Format

- Canvas: 1080x1920, vertical 9:16.
- Duration target: 32-42 seconds for normal Reels; 30-60 seconds only when the representative approves a topic-specific reason.
- Scene count: 6-7 scenes for normal Reels; 8-9 scenes only when the narration remains fast, clear, and low-load.
- Visual count: use 2-5 ranked images per scene when the narration contains multiple visual nouns or actions.
- Safe area: keep captions inside the central 900x1500 region when possible.
- Brand: use small `EPICKOR.COM` text, not a large logo lockup.

## Accepted Quality Bar

The first confirmed Reels set is:

- `170 v011`
- `171 v008`
- `172 v008`

New Reels should be built to this standard on the first full render:

- creative brief and Reels Viral Fit Score recorded before production.
- a thumb-stopping first second and a selected `Mystery`, `Mistake`, or `Decision` thumbnail direction.
- scene-level final audio.
- exact narration-matched subtitles.
- clean intro thumbnail/title lockup with live speech captions below the title.
- raw, relevant background images without embedded editorial/card-news text.
- varied motion-card structures with no large empty centers.
- compact narration captions protected from motion-card footers and Instagram UI.
- deliberate typography line breaks and safe placement.
- final CTA readable in the Instagram mobile safe area.
- final outro/CTA displays `epickor.com` only, not post-specific paths such as `/blog/{slug}`.

## Story Rhythm

- Scene 1 must hook within 1.5 seconds.
- Each scene should carry one idea only.
- Avoid reading the blog summary. Reels should feel like a short argument, observation, or cultural reveal.
- Use the blog post as source material, then rewrite for spoken pacing.
- Every script should include one surprising detail, one outsider misconception or mistake, one practical takeaway, and one save/share reason.
- If the opening sentence could start a blog paragraph unchanged, rewrite it before visual research.

## Visual Rules

- Prefer direct visual matches over beautiful but generic images.
- Use source-post images first when they are relevant.
- If the representative marks an image as replacement-needed because the subject is wrong, treat it as an off-topic failure. Replace it with a direct scene-proof image from the exact brand, place, object, activity, or category before offering broad stock backups.
- Avoid close-up strangers, misleading celebrity/product imagery, or location claims the image cannot support.
- Record source and license notes for each candidate.
- Do not treat an image as approved until a human review status is saved.
- Avoid reusing the same image URL across scenes unless the duplicate is deliberate and recropped.
- Candidate images should not repeat across different scene candidate sets during review. If a visual belongs to a motion-card background, do not also present it as a normal stock-image candidate in another scene.
- Rendered card-news PNGs and images with large embedded editorial text should not be mixed into ordinary Reels image candidate grids or used as scene backgrounds. They are allowed only for intentional intro thumbnails, graphic inserts, or explicitly approved card-style moments.
- Rank images per scene. Rank 1 is the primary shot; ranks 2-5 are cutaways.

## Subtitle Rules

- Subtitles must come from narration text, not a separate caption line that changes the wording.
- Caption beats must preserve the exact narration wording in order. Do not paraphrase captions to make them punchier; use typography beats for editorial emphasis instead.
- Starting with Reels 186, spoken narration subtitles use the readable-band style by default: each caption beat should be a natural sentence or phrase group with deliberate line breaks, and no rendered beat may exceed two lines.
- For readable-band captions, split subtitles into sentence-level or phrase-level beats that can be read as one thought, then insert manual line breaks where the spoken context naturally turns.
- For legacy `phrase_pop` captions only, split subtitles into short phrase beats, roughly 2-5 words each.
- Keep narration subtitle size visually stable across a Reel. Do not shrink long subtitle beats to fit; split or line-break the narration instead. The render-readiness validator applies a stricter one-line budget to legacy `phrase_pop` captions and a two-line readable budget to readable-band captions.
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

- Use motion cards sparingly. For a normal 35-45 second Reel, use exactly one insert by default. Do not use two or more motion cards unless the representative explicitly approves a slug-specific exception and it is recorded in `HANDOFF.md`.
- The single motion-card insert should normally appear around 60-75% of the Reel as the payoff board, checklist, receipt, decision table, mistake list, or rule card.
- Do not use a motion card as Scene 1 unless the representative explicitly approves it; Scene 1 should normally be a photo/video-led hook and thumbnail frame.
- Review the motion-card insert in chronological scene order. If Scene 4 uses the motion card, the Scene 4 section should show the Scene 4 motion-card options before moving to Scene 5.
- A motion-card scene should offer multiple design options, and exactly one option should be approved for that scene.
- Final Remotion props must include only the approved motion-card option for each scene. Pending alternatives are review UI data, not render data.
- Intro scenes should stay clean when they are designed as thumbnail or hook frames.
- Motion cards may replace the large normal subtitle layer, but the scene must still include a compact synced narration subtitle unless the card copy exactly matches the spoken narration.
- Compact synced narration subtitles must not overlap motion-card footers, chips, labels, or badges. Center-lockup templates such as `radial_burst` must reserve the mid-lower area directly below the main graphic for narration captions instead of using the bottom safe area.
- Motion-card subtitle placement is template-specific. `receipt_stack` captions sit in the open receipt body above the barcode/footer; `morning_route` captions sit below the route rows and above the footer; `stamp_stack` captions sit between the stamp panels and the verification/footer area. `editorial_box`, `split_checklist`, `zone_compare`, and `kit_grid` must reserve a clean lower caption band, with the card content ending above that band. Never place synced narration captions where they overlap card rows, labels, footer text, badges, or CTA text.
- Yellow typography beats should sit above the active narration subtitle by default. Use explicit `|` line breaks for two-part phrases such as `ONLINE GAME|OFFLINE GAME`; do not let comma-separated emphasis text wrap at the bottom edge.
- Bottom typography placement is reserved for final CTA moments only.
- Final outro/CTA text should use `epickor.com` only. Do not show post-specific paths such as `/blog/{slug}` inside Reels, because viewers cannot click them from the video frame.
- Put a black overlay over the approved scene background, then render the motion card as live Remotion layers.
- Motion-card design must come from the script's meaning. Do not simply reuse the previous Reel's structures because they are available.
- Motion-card previews must fill the central visual field with the main information. Do not cluster the headline at the top and the answer/list at the bottom while leaving a large empty middle. For list, route, checklist, menu, and step templates, place the primary rows/chips/panels around the vertical center in both dashboard preview and Remotion render.
- Motion-card text budgets are hard limits, not visual suggestions: max 3 headline lines, max 2 subhead lines, max 2 footer lines, no headline line over 12 characters on `radial_burst` or 24 characters on other dense card templates, and no more than 11 visible text lines for `radial_burst` or 13 for other dense templates. Rewrite or change templates before approval if the card would exceed these limits.
- `radial_burst` center lockups should not stack four single-word headline lines. Pair them into two compact lines, move words to chips, or use a different template so the center, surrounding chips, footer, and synced narration caption do not collide.
- For consecutive Reels, the Motion Design Agent must check the last accepted Reel and intentionally vary at least two of these: layout structure, color family, shape language, information metaphor, reveal order, or density.
- The reusable motion-card library must maintain distinct template families before future selection: `zone_compare`, `kit_grid`, `editorial_box`, `kinetic_steps`, `menu_board`, `radial_burst`, `split_checklist`, `convenience_tray`, `morning_route`, `wrapper_tabs`, `receipt_stack`, and `stamp_stack`.
- The single boxed/card-like insert should reinterpret the content with a strong visual structure:
  - concept map or radial chips for explaining several meanings
  - menu/signboard for food or options
  - vertical process/checklist for etiquette, steps, or warnings
  - receipt/checklist for packing, shopping, mistakes, or save-worthy rules
- Food/convenience-store topics can use receipt strips, shelf labels, barcode bands, tray grids, wrapper tabs, price-tag rows, fridge-door panels, or route-map choices when those match the narration.
- Do not make two cards that are only color variants of the same dark panel.
- Control English line breaks explicitly with `headlineLines`, `subheadLines`, and `footerLines` when the text is shown in a fixed 9:16 card layout.
- Default reusable templates live at `.claude/skills/reels/motion-card-templates.json`; slug-specific overrides can live at `output/reels/{slug}/motion-card-templates.json`.

## Voice Rules

- Narration should sound conversational, not like an article readout.
- Do not include bracketed acting directions unless they should be spoken.
- Choose one voice lane before TTS: `male_friend` or `female_culture_travel`.
- For important batch openers, new topics, or a changed voice lane, generate an 8-12 second audition sample before full scene-level TTS.
- Do not alternate male/female voices inside one short Reel unless the script is intentionally written as call-and-response and the representative approves it.
- Use ElevenLabs after script approval.
- Save generated audio under `output/reels/{slug}/audio/`.
- Generate final audio per scene using `narration-{version}-scene-##.mp3` naming. Multi-scene narration files are allowed for review/reference, but final scene timing must be based on actual scene audio durations or explicit timestamps.

## Review Gate

- Before dashboard or TTS work, confirm `output/reels/{slug}/strategy.md` includes the Reels Viral Fit Score, hook archetype, thumbnail direction candidates, selected voice lane, and single motion-card role.
- The dashboard review gate comes before Remotion rendering.
- A scene is ready for video only when one candidate is marked `approved`.
- If any scene is `pending`, `rejected`, or `replace_needed`, final rendering is blocked.
- Before final render, build props and run `npm run reels:validate -- --slug {slug} --require-scene-audio`. The validator must pass with exact narration/caption text, approved-only motion cards, matching primary visuals, and scene-level audio timing.
- Confirm the render command uses the intended `--audio-version`. A final candidate rendered from fallback `audio/narration.mp3` is invalid unless it was explicitly approved as the intended final audio source.
- For legacy Reels that do not have scene-level audio, document the exception in `HANDOFF.md`; do not copy that exception into new Reels.

## Post-Render Evaluation Gate

- After a final candidate render, run `npm.cmd run reels:evaluate -- --slug {slug} --render {render path} --version {version}`.
- The Reels Evaluation Agent must score the render with `.claude/skills/reels/evaluation_rubric.md`.
- Any hard gate blocks publishing even if the numeric score is otherwise high.
- Any caption/audio timing defect must include scene number, second, frame, and the exact caption phrase.
- Spot-check stills are required for:
  - intro/title/caption placement.
  - each motion-card scene.
  - yellow emphasis typography scenes.
  - final CTA scene.
- Rework instructions must be routed to the responsible agent:
  - Script defects -> Reels Script Agent.
  - Visual defects -> Reels Visual Research Agent or Reels Visual Reviewer Agent.
  - Motion-card defects -> Reels Motion Design Agent.
  - Timing/safe-area/render defects -> Reels Remotion Agent.
  - Audio defects -> Reels Voice Agent.
