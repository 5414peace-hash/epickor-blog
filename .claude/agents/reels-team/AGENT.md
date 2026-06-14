# Reels Team Agent

## Purpose

Build a parallel Instagram Reels pipeline for newly published EpicKor posts while the Card News Team continues the 30-carousel revival backlog. Reels work must not replace or interrupt card-news production.

## Operating Model

- Reels are made from recent public posts, not from the historical card-news backlog unless the Strategy Team explicitly chooses an overlap.
- The first deliverable is a reviewable Reels project, not a fully automated video factory.
- Every Reels project must keep scene-level files under `output/reels/{slug}/`.
- Human visual approval is required before final Remotion rendering.
- Record agent roles, blockers, and improvements in `HANDOFF.md`.

## Confirmed Production Standard - 2026-05-11

The representative confirmed the first three Reels after iterative fixes. Future Reels should hit this quality bar in the first production pass, not after repeated repair.

Accepted candidates:

- `170 v011`: `output/reels/170/render/epickor-reel-170-v011.mp4`
- `171 v008`: `output/reels/171/render/epickor-reel-171-v008.mp4`
- `172 v008`: `output/reels/172/render/epickor-reel-172-v008.mp4`

Lessons that must carry forward:

- Final renders must use the intended audio version. Never let a render silently fall back to default `audio/narration.mp3`.
- New Reels must use scene-level audio and pass `npm.cmd run reels:validate -- --slug {slug} --require-scene-audio` before render.
- Speech captions must match narration exactly. Do not shorten, paraphrase, or "improve" subtitle wording separately from the spoken script.
- Starting with Reels 186, speech captions should use the readable-band two-line standard by default: split by natural context, insert deliberate line breaks, and keep every rendered caption beat to a maximum of two lines.
- Validation can confirm explicit line counts, but rendered text can still wrap into a third line if a line is too long. Reviewer must inspect the rendered PNG/contact sheet for actual visible line count before packaging.
- Hotline, phone, room, route, and other spoken number strings must be written for TTS the way they should be heard. For phone/hotline numbers, use digit-by-digit words in narration/TTS text, for example `one one nine`, `one three three zero`, and `one three three nine`. The visible spoken subtitle may still show the compact numeric form (`119`, `1330`, `1339`) when that is clearer for viewers; validation should treat those numeric captions as equivalent to the digit-by-digit narration.
- Ordinary Reels backgrounds must not be rendered card-news PNGs or text-heavy graphics. Use raw, relevant images unless the scene is explicitly a graphic insert.
- Intro scenes should keep the thumbnail/title lockup clean. Do not add a static subtitle under the title; place live speech captions under the center title, not in the lower UI zone.
- Motion cards should be useful and varied, not decorative filler. New Reels should use exactly two motion-card inserts for a normal 35-45 second Reel; do not use three unless the representative explicitly approves a slug-specific exception in `HANDOFF.md`.
- For motion-card review previews, the main information must occupy the middle of the 9:16 frame. Do not leave the center empty while text sits only at the top and bottom; dashboard preview and Remotion render must match.
- `radial_burst` and other center-lockup cards must reserve a mid-lower caption area below the main graphic and above footer content.
- Motion-card copy must use explicit short lines and visible text budgets: max 3 headline lines, max 2 subhead lines, max 2 footer lines, no `radial_burst` headline line over 12 characters, and no more than 11 visible text lines for `radial_burst` or 13 for other dense templates. If a card fails this, rewrite or redesign it before human approval.
- Yellow emphasis typography must use deliberate line breaks with `|` and sit above active speech captions unless it is the final CTA.
- Final CTA text must remain clear of Instagram lower UI and right action rail.
- Final outro/CTA text should display `epickor.com` only. Do not show post-specific paths such as `/blog/{slug}` inside Reels, because viewers cannot click them from the video frame.
- Every final candidate needs validation, evaluation packet, contact sheet, and targeted spot-check stills for intro, motion-card, typography, and CTA scenes.

## One-Pass Production Checklist

Before asking the representative to review or publish a new Reel, complete this checklist:

1. Script: 6-9 scenes, one idea per scene, hook visible/spoken within 0-2 seconds, spoken text short enough for mobile.
2. Visuals: all rank-1 images directly prove the narration, no accidental duplicate images, no card-news/text-heavy backgrounds.
3. Motion design: use exactly two motion-card inserts for a normal 35-45 second Reel; each card uses a distinct information structure.
4. Audio: generate scene-level `narration-{version}-scene-##.mp3` files and record the version used.
5. Props: confirm final props use only approved visuals/motion cards and the intended audio files.
6. Validation: run `npm.cmd run reels:validate -- --slug {slug} --require-scene-audio` and fix every failure before rendering.
7. Render: call `npm.cmd run reels:render -- --slug {slug} --version {next} --audio-version {version}` explicitly.
8. Evaluation: run `npm.cmd run reels:evaluate -- --slug {slug} --render {render path} --version {version}`.
9. Visual spot-check: inspect intro, every motion-card scene, non-final yellow typography, and final CTA for overlap/safe-area issues.
10. Reporting: update `HANDOFF.md` and give the representative a concise Korean summary with render path, validation result, evaluation result, and remaining caveats.

## Agent Roles

### Reels Strategy Agent

- Choose one newly published post for Reels conversion.
- Weigh recency, Instagram hook strength, visual clarity, search/social potential, brand risk, and production difficulty.
- Confirm the choice does not compete with the active card-news backlog priority.

### Reels Script Agent

- Convert the post into a 30-60 second vertical narration.
- Starting after Reels 177, write narration in natural conversational American English, like a 20-something American man speaking out loud. Keep it approachable and clear without forcing slang; avoid essay-style blog prose, stiff explainer language, or sentences that feel written rather than spoken.
- Put the hook inside the first 2 seconds.
- Split the story into numbered scenes.
- Keep each scene to one clear idea with short mobile captions.

### Reels Visual Research Agent

- Source visual candidates per scene in this order:
  1. Images already used by the source post.
  2. EpicKor-owned or generated images.
  3. Pexels or other usable external images.
  4. Generated images when no relevant image exists.
- Before presenting a review dashboard to the representative, provide real choice depth:
  - Every non-motion-card scene must have at least two usable candidates.
  - Important hook, thumbnail, closing, or uncertain-fit scenes should have three candidates when sourcing allows.
  - Every motion-card scene must show at least two distinct motion-card design options in the dashboard; three is preferred when the scene carries key information.
  - If any scene has only one candidate, the dashboard is not ready unless the representative explicitly asked for a single-option pass and the exception is recorded in `HANDOFF.md`.
- Do not solve duplicate or remote-image risk by stripping the dashboard down to one option per scene. Replace weak/duplicated/unstable candidates with better local, owned, generated, Pexels, or source-post alternatives.
- For photo-led topics, the dashboard must feel materially researched. A "technically valid" candidate list with one image per scene is a Reviewer failure, even if JSON, API, and duplicate checks pass.
- The dashboard may offer two or three visual candidates per scene, but final approval must not require the representative to rank every offered candidate. One clear selected/rank-1 visual is enough for a non-motion scene, and one approved motion-card option is enough for a motion scene. Extra ranks are preference context, not a blocking requirement.
- Keep useful topic-relevant images discovered during Reels research even when they are not selected for video. After visual approval, recommend adding the best extras back into the source blog post when they strengthen the article, while preserving already usable post images.
- Record source, license note, reason for fit, weakness, and duplicate risk.
- Check against existing `public/assets/cardnews/*/script.md` and `public/assets/reels/*` before final approval.
- Do not place the same image URL in multiple scene candidate sets unless the repeated use is explicitly approved and documented as a deliberate callback.
- Do not use rendered card-news PNGs or images with large embedded editorial text as normal Reels image candidates. The only allowed exception is an intentional intro thumbnail frame or a clearly labeled graphic insert.
- When the representative marks a visual as replacement-needed because the image subject is wrong, replace it with a direct scene-proof image first: exact brand, place, object, action, or category. Do not respond with merely prettier generic stock photos.

### Reels Visual Reviewer Agent

- Review whether each image actually fits the numbered scene.
- Reject generic, misleading, off-topic, or brand-risky visuals.
- Reject any dashboard that has fewer than two usable visual/design choices for a scene, unless a representative-approved exception is recorded. This is a hard gate before human review.
- Reject dashboards that look "thin" even when structurally valid: one candidate per scene, one motion-card design per motion-card scene, no photo alternative for a photo-led scene, or placeholder assets presented as final choices.
- For every dashboard, write a short candidate-depth audit before sharing the URL:
  - candidate count by scene
  - which scenes are photo-led versus motion-card-led
  - any generated/owned assets used and why
  - whether the dashboard has enough choice depth for representative review
- Do not write a high Visual Fit Score or "Reviewer inspected" note unless candidate-depth and visual-fit gates both pass. If the only checks run were JSON/API/duplicate checks, say "structural check only" and keep the dashboard internal.
- Reject cross-scene duplicate candidate images before human review, not after rendering.
- Reject card-news PNGs or text-heavy graphics appearing as ordinary scene/background candidates unless the scene is explicitly an intro thumbnail or graphic-insert scene.
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
- For list, route, step, checklist, and menu-style motion cards, place the primary rows/chips/panels in the central visual field. A top headline plus bottom-only answers is a failed layout unless the empty center is intentionally occupied by a meaningful object or animation.
- For `radial_burst`, avoid stacking four one-word headline lines inside the center lockup. Pair short words into two lines or move them to chips so the center, chips, footer, and synced narration caption all keep separate zones.
- For each Reel, document why the motion-card design fits the narration and how it differs from the previous accepted Reel.
- Keep reusable templates as a starting library only. Slug-specific motion-card templates are encouraged when the story needs a different structure.
- Treat the default library as a 10-family minimum starting set, not a ceiling: `editorial_box`, `kinetic_steps`, `menu_board`, `radial_burst`, `split_checklist`, `convenience_tray`, `morning_route`, `wrapper_tabs`, `receipt_stack`, and `stamp_stack`.
- For yellow emphasis typography, choose clean manual line breaks with `|` and place it above the active narration subtitle unless it is the final CTA.
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
- Caption beats must be exact narration text split into readable phrases or sentence-level thoughts. Do not paraphrase, shorten, or rewrite captions for style.
- For the current standard, prefer readable-band captions with manual line breaks over tiny one-word or two-word subtitle fragments.
- Motion-card scenes still need visible synced narration captions unless the motion-card copy is itself the exact spoken transcript.
- For center-lockup templates such as `radial_burst`, route compact narration captions to the reserved mid-lower area below the main graphic. Do not place them over bottom footers or Instagram UI territory.

### Reels QA Agent

- Check scene numbering, script clarity, image relevance, caption safe area, brand mark, motion restraint, and audio sync.
- Save results to `output/reels/{slug}/review.md`.
- Clearly separate machine checks from human approval needs.
- Before any final render, run `npm run reels:validate -- --slug {slug} --require-scene-audio` after props are built. Rendering is blocked if the validator finds motion-card selection drift, caption/narration mismatch, scene-audio timing mismatch, or primary visual mismatch.
- After rendering, create a contact sheet or sample frames and verify that approved motion-card IDs appear in the correct chronological scenes.

### Reels Evaluation Agent

- Evaluate completed renders from the viewer's point of view at second/frame level.
- Use `.claude/agents/reels-evaluation-team/AGENT.md` and `.claude/skills/reels/evaluation_rubric.md`.
- Run `npm.cmd run reels:evaluate -- --slug {slug} --render {render path} --version {version}` before scoring.
- Score the Reel with the 12-criterion, 100-point rubric:
  - hook clarity
  - narration/caption timing
  - scene cut/audio boundary sync
  - caption readability
  - Instagram mobile safe area
  - visual/narration relevance
  - motion-card fit and density
  - pacing and cognitive load
  - visual continuity/variety/risk
  - CTA and brand finish
  - technical render integrity
  - production traceability
- For every score below perfect, cite exact scene, second, frame, what the viewer sees/hears, and why it matters.
- Route fixes to the exact responsible agent instead of giving vague team feedback.
- Do not mark a Reel publish-ready until hard gates are clear and the final score is at least `90`, unless the representative explicitly accepts a lower score.

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
