# Reels Team Agent

## Purpose

Build a parallel Instagram Reels pipeline for newly published EpicKor posts while the Card News Team continues the 30-carousel revival backlog. Reels work must not replace or interrupt card-news production.

## Operating Model

- Reels are made from recent public posts, not from the historical card-news backlog unless the Strategy Team explicitly chooses an overlap.
- The first deliverable is a reviewable Reels project, not a fully automated video factory.
- Every Reels project must keep scene-level files under `output/reels/{slug}/`.
- Human visual approval is required before final Remotion rendering.
- Record agent roles, blockers, and improvements in `HANDOFF.md`.

## Agent Roles

### Reels Strategy Agent

- Choose one newly published post for Reels conversion.
- Weigh recency, Instagram hook strength, visual clarity, search/social potential, brand risk, and production difficulty.
- Confirm the choice does not compete with the active card-news backlog priority.

### Reels Script Agent

- Convert the post into a 30-60 second vertical narration.
- Put the hook inside the first 2 seconds.
- Split the story into numbered scenes.
- Keep each scene to one clear idea with short mobile captions.

### Reels Visual Research Agent

- Source visual candidates per scene in this order:
  1. Images already used by the source post.
  2. EpicKor-owned or generated images.
  3. Pexels or other usable external images.
  4. Generated images when no relevant image exists.
- Record source, license note, reason for fit, weakness, and duplicate risk.
- Check against existing `public/assets/cardnews/*/script.md` and `public/assets/reels/*` before final approval.
- Do not place the same image URL in multiple scene candidate sets unless the repeated use is explicitly approved and documented as a deliberate callback.
- Do not use rendered card-news PNGs as normal Reels image candidates. The only allowed exception is an intentional intro thumbnail frame or a clearly labeled graphic insert.

### Reels Visual Reviewer Agent

- Review whether each image actually fits the numbered scene.
- Reject generic, misleading, off-topic, or brand-risky visuals.
- Reject cross-scene duplicate candidate images before human review, not after rendering.
- Reject card-news PNGs appearing as ordinary scene candidates unless the scene is explicitly an intro thumbnail or graphic-insert scene.
- Use the dashboard at `/reels-review/{slug}` for human approval.
- Do not advance to final video rendering until scenes are approved.

### Reels Motion Agent

- Assign restrained motion presets per scene.
- Use motion to add editorial rhythm, not distraction.
- Preferred presets: `slow_push_in`, `slow_zoom_out`, `pan_left`, `pan_right`, `soft_cut`, `fade`, `caption_pop`, and `match_cut`.

### Reels Motion Design Agent

- Design motion-card inserts from the script, not from a fixed template habit.
- Before choosing a motion-card structure, identify the scene's content logic: list, map, process, comparison, warning, receipt, shelf, route, timeline, or object anatomy.
- Adapt color, tone, layout geometry, and visual metaphor to the specific post topic.
- Avoid repeating the same motion-card structures in consecutive Reels unless the script genuinely calls for the same structure.
- For each Reel, document why the motion-card design fits the narration and how it differs from the previous accepted Reel.
- Keep reusable templates as a starting library only. Slug-specific motion-card templates are encouraged when the story needs a different structure.
- In the review dashboard, motion-card choices must appear inside their numbered scene. Do not show motion cards as a separate top-level block before the scene sequence.
- For a motion-card scene, provide multiple design options for that scene and approve exactly one option.

### Reels Voice Agent

- Use ElevenLabs for narration audio after the script is approved.
- Never print API secrets.
- Use `ELEVENLABS_API_KEY` and a selected `ELEVENLABS_VOICE_ID`.
- Save generated audio under `output/reels/{slug}/audio/`.
- For final rendering, prefer scene-level audio files named `narration-{version}-scene-01.mp3`, `scene-02.mp3`, and so on. Do not rely on multi-scene audio plus estimated word-count timing for final output, because it can desync narration, scene cuts, and subtitles.
- If segmented narration is also kept for review, treat it as draft/reference audio unless the final validation proves scene boundaries match the spoken timing.

### Reels Remotion Agent

- Build 1080x1920 vertical Remotion compositions from the approved scene manifest.
- Read image, caption, motion, duration, and audio inputs from `output/reels/{slug}/`.
- Keep the first MVP simple: one image per scene, one caption layer, one narration track.
- Use only approved motion-card options in final props. Never pass pending/rejected alternatives to Remotion, because scene-number lookup can accidentally render the wrong option.
- Caption beats must be exact narration text split into readable phrases. Do not paraphrase, shorten, or rewrite captions for style.
- Motion-card scenes still need visible synced narration captions unless the motion-card copy is itself the exact spoken transcript.

### Reels QA Agent

- Check scene numbering, script clarity, image relevance, caption safe area, brand mark, motion restraint, and audio sync.
- Save results to `output/reels/{slug}/review.md`.
- Clearly separate machine checks from human approval needs.
- Before any final render, run `npm run reels:validate -- --slug {slug} --require-scene-audio` after props are built. Rendering is blocked if the validator finds motion-card selection drift, caption/narration mismatch, scene-audio timing mismatch, or primary visual mismatch.
- After rendering, create a contact sheet or sample frames and verify that approved motion-card IDs appear in the correct chronological scenes.

## Required Files

- `output/reels/{slug}/strategy.md`
- `output/reels/{slug}/script.md`
- `output/reels/{slug}/scenes.json`
- `output/reels/{slug}/visual-candidates.json`
- `output/reels/{slug}/approved-visuals.json`
- `output/reels/{slug}/review.md`
- `public/assets/reels/{slug}/` after assets are finalized.

## Success Criteria

- The source post is a recent public post with a clear Reels hook.
- All scenes have numbered narration, caption, visual intent, candidate images, motion, duration, and review status.
- The user can approve or reject visual candidates without reading raw JSON.
- Reels work is recorded in `HANDOFF.md` with next improvements.
