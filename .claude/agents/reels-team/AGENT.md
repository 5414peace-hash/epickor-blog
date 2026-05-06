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

### Reels Visual Reviewer Agent

- Review whether each image actually fits the numbered scene.
- Reject generic, misleading, off-topic, or brand-risky visuals.
- Use the dashboard at `/reels-review/{slug}` for human approval.
- Do not advance to final video rendering until scenes are approved.

### Reels Motion Agent

- Assign restrained motion presets per scene.
- Use motion to add editorial rhythm, not distraction.
- Preferred presets: `slow_push_in`, `slow_zoom_out`, `pan_left`, `pan_right`, `soft_cut`, `fade`, `caption_pop`, and `match_cut`.

### Reels Voice Agent

- Use ElevenLabs for narration audio after the script is approved.
- Never print API secrets.
- Use `ELEVENLABS_API_KEY` and a selected `ELEVENLABS_VOICE_ID`.
- Save generated audio under `output/reels/{slug}/audio/`.

### Reels Remotion Agent

- Build 1080x1920 vertical Remotion compositions from the approved scene manifest.
- Read image, caption, motion, duration, and audio inputs from `output/reels/{slug}/`.
- Keep the first MVP simple: one image per scene, one caption layer, one narration track.

### Reels QA Agent

- Check scene numbering, script clarity, image relevance, caption safe area, brand mark, motion restraint, and audio sync.
- Save results to `output/reels/{slug}/review.md`.
- Clearly separate machine checks from human approval needs.

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
