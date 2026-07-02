# Reels Team Agent

## Purpose

Build a parallel Instagram Reels pipeline for newly published EpicKor posts while the Card News Team continues the 30-carousel revival backlog. Reels work must not replace or interrupt card-news production.

## Operating Model

- Reels are made from recent public posts, not from the historical card-news backlog unless the Strategy Team explicitly chooses an overlap.
- The first deliverable is a reviewable Reels project, not a fully automated video factory.
- Every Reels project must keep scene-level files under `output/reels/{slug}/`.
- Human visual approval is required before final Remotion rendering.
- Record agent roles, blockers, and improvements in `HANDOFF.md`.
- For all new Reels after 2026-06-24, read and apply `.claude/skills/reels/creative_performance_standard.md` before strategy, script, visual research, TTS, dashboard, or render work.
- When the representative asks, "다음 릴스는 뭘로 해볼까?" or equivalent, first provide the numbered titles of completed/published posts that do not yet have a Reels render. Treat recent newly published posts as the default candidate pool; include older posts only when the representative asks for an exception or when Strategy Team explicitly justifies an overlap.

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
- Motion cards should be useful and varied, not decorative filler. New Reels should use exactly one motion-card insert for a normal 35-45 second Reel by default; do not use two or more unless the representative explicitly approves a slug-specific exception in `HANDOFF.md`.
- The single motion-card insert should normally appear around 60-75% of the Reel as the payoff board, checklist, receipt, decision table, mistake list, or rule card. Do not use a motion card as Scene 1 unless explicitly approved.
- For motion-card review previews, the main information must occupy the middle of the 9:16 frame. Do not leave the center empty while text sits only at the top and bottom; dashboard preview and Remotion render must match.
- `radial_burst` and other center-lockup cards must reserve a mid-lower caption area below the main graphic and above footer content.
- Motion-card copy must use explicit short lines and visible text budgets: max 3 headline lines, max 2 subhead lines, max 2 footer lines, no `radial_burst` headline line over 12 characters, and no more than 11 visible text lines for `radial_burst` or 13 for other dense templates. If a card fails this, rewrite or redesign it before human approval.
- Yellow emphasis typography must use deliberate line breaks with `|` and sit above active speech captions unless it is the final CTA.
- Final CTA text must remain clear of Instagram lower UI and right action rail.
- Final outro/CTA text should display `epickor.com` only. Do not show post-specific paths such as `/blog/{slug}` inside Reels, because viewers cannot click them from the video frame.
- Every final candidate needs validation, evaluation packet, contact sheet, and targeted spot-check stills for intro, motion-card, typography, and CTA scenes.
- Before showing any new `/reels-review/{slug}` dashboard or static review fallback to the representative, run:
  `npm.cmd run reels:dashboard-gate -- --slug {slug}`.
  This is a hard pre-review gate, not a suggestion. If it fails, do not show the dashboard. Fix the thumbnail style, candidate depth, and source diversity first.
- Visual review dashboards must keep a stable fixed-button frame unless the representative explicitly requests a redesign: scene-by-scene cards, photo buttons `Rank 1 / Rank 2 / Rank 3 / Replace`, motion-card buttons `Select / Replace`, no dropdown selectors, and a bottom copy-ready summary string like `S1 1:A / 2:B / 3:C | S2 1:C`.
- As of 2026-06-17, the representative-approved dashboard response format is the canonical handoff contract for visual approval: `S1 1:D@24/52 / 2:A@63/48 | S2 1:A@54/51 / 2:C@89/50 / 3:D@92/54 | S4 A`. Photo entries may include crop focus as `Letter@x/y`; motion-card scenes use the selected letter only, such as `S4 A`.
- When a representative response includes crop coordinates, treat those coordinates as production instructions, not comments. Before `approved-visuals.json`, generate final 1080x1920 crop derivatives from the original/source image using the supplied `x/y` focus point, then use those derivatives in asset prep and Remotion props.
- Representative ranking messages are dashboard feedback, not render approval. Do not advance to TTS, props, or video rendering unless the representative explicitly says to produce/render/finalize the Reel after all requested replacements are resolved.
- `Replace` means the candidate is rejected and must be replaced with a new, better candidate in a revised dashboard. It does not mean "exclude this candidate and continue production."
- Rank values are preference signals, not disposal instructions. If the representative gives only Rank 1 and Rank 2, remaining unranked high-quality candidates should stay available as candidate inventory or be used to fill Rank 3 in the next dashboard when useful; do not silently throw them away.
- Thumbnail style is locked by `.claude/skills/reels/thumbnail-style-standard.json`. Scene 1 must declare the accepted `templateId`, use the recent centered title lockup, exactly two uppercase title lines, and `EPICKOR.COM`.
- Scene 1 dashboard previews must visibly render the thumbnail text overlay on top of every S1 candidate image. Metadata alone is not enough. Use the Reels 186/189 confirmed small centered style: at the old 180px card width, kicker about `9px`, title about `18px`, watermark about `8px`, scaled proportionally for larger static cards. Keep the image inspectable; do not let thumbnail text fill the whole candidate.
- For wide or landscape source photos, the dashboard candidate must show the actual 9:16 crop that would be used in the Reel, not just the original source. Inspect the 9:16 crop for subject visibility. If the crop shows mostly empty sky/water/wall or loses the main object/person/sign, adjust crop anchor, make a deliberate derivative crop, or reject the candidate. Record a render motion hint such as `pan_left`, `pan_right`, `slow_push_in`, or `slow_zoom_out` when a wide image needs controlled movement to reveal the subject.
- Photo candidate depth for new Reels must be materially reviewable: default minimum is five candidates for every photo-led scene, including hook and outro. Do not use fewer than five options unless the representative explicitly approves a thin-dashboard exception or a documented real-search blocker remains, and record the exception in `visual-candidates.json` and `HANDOFF.md`.
- Derivative crops do not count as fresh visual sourcing by themselves. Every derivative candidate must include `sourceFamily` or `originalAsset` metadata, and the dashboard must not be filled mostly with crops from the same few source images.
- Do not create extra post-render HTML review UIs unless the representative asks for one. After a render, provide the video path plus the contact sheet and scene grid paths; keep dashboard review and final render review as separate, minimal outputs.
- Do not source visuals from isolated scene keywords only. Start from the Reel's whole topic and keep that visual world alive across all scenes. Practical scenes such as transport, packing, phone protection, or CTA still need topic-contextual images first. For example, in a Boryeong Mud Festival Reel, later logistics/protection/outro scenes should still show Boryeong Mud Festival, Daecheon Beach, muddy crowds, festival staff/signage, or mud-event context before falling back to generic transport or beach objects.
- Default candidate depth for photo-led dashboard scenes is now five image candidates per scene. The representative may rank only one, two, or three of them; unranked good candidates remain reserve inventory. Use fewer than five only when five genuinely usable, non-duplicate, quality-passing candidates cannot be sourced, and record the exception in `visual-candidates.json` and `HANDOFF.md`.

## Creative Performance Upgrade - 2026-06-24

This upgrade applies to all new Reels after the confirmed `196/197/198` batch.

- Every candidate must receive a `Reels Viral Fit Score` in `output/reels/{slug}/strategy.md` before production. Default pass threshold is `80/100`.
- A newly published post is only the candidate pool. It is not enough to justify a Reel if the short-form angle is weak.
- Every Reels strategy brief must include hook archetype, first-frame promise, viewer misconception, open loop, payoff, save/share reason, selected voice lane, three thumbnail directions, and the single motion-card role.
- Script work must optimize for curiosity, tension, and spoken entertainment, not blog summarization.
- Scene 1 must stop the scroll within 1.5 seconds and work as the grid thumbnail.
- Thumbnail copy must be prepared in three directions before selection: `Mystery`, `Mistake`, and `Decision`; default copy length is 3-5 words.
- Voice work must support two default lanes: `male_friend` and `female_culture_travel`. Use an 8-12 second audition sample for important batch openers, changed voice lanes, or new voice IDs.
- Motion design defaults to one payoff insert, not two structural inserts.
- Evaluation must judge viewer impact and share/save reason. Technical correctness alone cannot produce a `90+` score.
- After publishing, record hook archetype, thumbnail variant, voice lane, motion-card count/placement, and available performance metrics such as 1h/24h/7d views, saves, shares/sends, comments, profile visits, and external link taps.

## Dashboard Approval And Crop Standard - 2026-06-17

Use the Reels 197 v5 dashboard as the current standard for representative visual approval.

- Build the dashboard as fixed scene-by-scene cards with five photo candidates A-E for photo-led scenes whenever possible.
- Show each photo through the actual 9:16 crop viewport that would be used in the Reel.
- For landscape or wide sources, the visible crop must be draggable. The dashboard must provide a `Lock Crop` action that records the focus point in the copy string as `@x/y`.
- Photo buttons remain `Rank 1 / Rank 2 / Rank 3 / Replace`. Motion-card buttons remain `Select / Replace`, and motion-card choices appear inside their numbered scene, not in a separate preface.
- The bottom copy string is the source of truth for finalization. Preserve the representative's scene order, rank order, selected letters, and crop coordinates exactly.
- If the representative says to produce/render after sending the copy string, finalize the Reel by applying the crop coordinates to derivative assets before running asset prep, props, validation, render, and evaluation.
- Record the exact representative approval string in `scenes.json`, `visual-candidates.json`, `approved-visuals.json`, and `HANDOFF.md`.

## One-Pass Production Checklist

Before asking the representative to review or publish a new Reel, complete this checklist:

1. Strategy: Reels Viral Fit Score, hook archetype, thumbnail directions, selected voice lane, and single motion-card role are recorded before production.
2. Script: 6-7 scenes by default, one idea per scene, hook visible/spoken within 0-1.5 seconds, spoken text short enough for mobile, and an explicit save/share reason.
3. Visuals: all rank-1 images directly prove the narration, no accidental duplicate images, no card-news/text-heavy backgrounds, and Scene 1 has thumb-stop power.
4. Motion design: use exactly one motion-card insert for a normal 35-45 second Reel; the card is a payoff/rule/checklist/receipt/decision insert, not decorative filler.
5. Audio: generate scene-level `narration-{version}-scene-##.mp3` files and record the version used; audition changed voice lanes before full TTS.
6. Props: confirm final props use only approved visuals/motion cards and the intended audio files.
7. Validation: run `npm.cmd run reels:validate -- --slug {slug} --require-scene-audio` and fix every failure before rendering.
8. Render: call `npm.cmd run reels:render -- --slug {slug} --version {next} --audio-version {version}` explicitly.
9. Evaluation: run `npm.cmd run reels:evaluate -- --slug {slug} --render {render path} --version {version}`.
10. Visual spot-check: inspect intro, the single motion-card scene, non-final yellow typography, and final CTA for overlap/safe-area issues.
11. Reporting: update `HANDOFF.md` and give the representative a concise Korean summary with render path, validation result, evaluation result, and remaining caveats.

## Agent Roles

### Reels Strategy Agent

- Choose one newly published post for Reels conversion.
- Weigh recency, Instagram hook strength, visual clarity, search/social potential, brand risk, and production difficulty.
- Confirm the choice does not compete with the active card-news backlog priority.
- Score the candidate with the `Reels Viral Fit Score` from `.claude/skills/reels/creative_performance_standard.md`.
- Reject or defer candidates below `80/100` unless the representative explicitly approves a Reels exception.
- Write the creative brief before Script Agent work: hook archetype, first-frame promise, misconception, tension, payoff, save/share reason, voice lane, three thumbnail directions, and one motion-card role.

### Reels Script Agent

- Convert the post into a 32-42 second vertical narration by default.
- Starting after Reels 177, write narration in natural conversational American English. Starting 2026-06-24, write for the selected voice lane: `male_friend` or `female_culture_travel`. Keep it approachable and clear without forcing slang; avoid essay-style blog prose, stiff explainer language, or sentences that feel written rather than spoken.
- Put the hook inside the first 1.5 seconds.
- Split the story into numbered scenes.
- Keep each scene to one clear idea with short mobile captions.
- Build the story as `hook -> concrete scene -> misconception/twist -> practical rule -> payoff/save cue`.
- Include one surprising concrete detail, one outsider misconception or mistake, one useful takeaway, and one explicit reason to save/share.
- Draft at least three hook options before locking the script. Weak blog-summary openers should be rejected before visual research.

### Reels Visual Research Agent

- Source visual candidates per scene in this order:
  1. Images already used by the source post.
  2. EpicKor-owned or generated images.
  3. Pexels or other usable external images.
  4. Generated images when no relevant image exists.
- Before presenting a review dashboard to the representative, provide real choice depth:
  - Every non-motion-card scene should have five usable candidates by default.
  - Important hook, thumbnail, closing, or uncertain-fit scenes must not be thin; use five candidates unless a documented sourcing blocker remains after a real search pass.
  - Every motion-card scene must show at least two distinct motion-card design options in the dashboard; three is preferred when the scene carries key information.
  - Motion-card options are not ranked. They appear inside their numbered scene as graphic previews and the representative selects exactly one option with `Select`; `Replace` means rebuild that option. Never show `Rank 1 / Rank 2 / Rank 3` buttons for motion-card candidates.
  - If any scene has only one candidate, the dashboard is not ready unless the representative explicitly asked for a single-option pass and the exception is recorded in `HANDOFF.md`.
- For Scene 1, source and crop for thumb-stop power first: the candidate must work as a feed hook and profile-grid thumbnail, not just a factual match.
- Produce visual candidates that support the selected `Mystery`, `Mistake`, or `Decision` thumbnail direction.
- Do not solve duplicate or remote-image risk by stripping the dashboard down to one option per scene. Replace weak/duplicated/unstable candidates with better local, owned, generated, Pexels, or source-post alternatives.
- For photo-led topics, the dashboard must feel materially researched. A "technically valid" candidate list with one image per scene is a Reviewer failure, even if JSON, API, and duplicate checks pass.
- The dashboard should offer five visual candidates per photo-led scene whenever possible. Final approval must not require the representative to rank every offered candidate, but unranked good candidates remain reserve inventory and can be reused in revised dashboards for the same Reel.
- For topic-led Reels, do not let later scenes visually drift into generic stock just because the narration mentions logistics, packing, or protection. Search and rank topic-specific images first, then use generic support images only when they still preserve the Reel's overall context and are clearly labeled as fallback/support.
- Keep useful topic-relevant images discovered during Reels research even when they are not selected for video. After visual approval, recommend adding the best extras back into the source blog post when they strengthen the article, while preserving already usable post images.
- Record source, license note, reason for fit, weakness, and duplicate risk.
- Check against existing `public/assets/cardnews/*/script.md` and `public/assets/reels/*` before final approval.
- Do not place the same image URL, same original asset, same `sourceFamily`, same shoot/crop family, or a near-identical composition in multiple scene candidate sets unless the repeated use is explicitly approved and documented as a deliberate callback.
- Do not use low-quality image sources: visibly pixelated, blurry, heavily compressed, tiny thumbnails, watermarked preview images, distorted upscales, unreadable screenshots, or crops that fall apart at 1080x1920. If a source is useful only for factual reference but not render quality, label it reference-only and do not present it as a selectable visual candidate.
- Do not use rendered card-news PNGs or images with large embedded editorial text as normal Reels image candidates. The only allowed exception is an intentional intro thumbnail frame or a clearly labeled graphic insert.
- When the representative marks a visual as replacement-needed because the image subject is wrong, replace it with a direct scene-proof image first: exact brand, place, object, action, or category. Do not respond with merely prettier generic stock photos.

### Reels Visual Reviewer Agent

- Review whether each image actually fits the numbered scene.
- Reject generic, misleading, off-topic, or brand-risky visuals.
- Reject Scene 1 if it is merely relevant but not likely to stop a scroll. The first frame must combine a strong visual subject with the selected thumbnail promise.
- Reject dashboards that do not show three thumbnail copy directions somewhere in the strategy/review notes before final Scene 1 selection.
- Reject any dashboard that has fewer than two usable visual/design choices for a scene, unless a representative-approved exception is recorded. This is a hard gate before human review.
- Reject dashboards that look "thin" even when structurally valid: one candidate per scene, one motion-card design per motion-card scene, no photo alternative for a photo-led scene, or placeholder assets presented as final choices.
- Reject dashboards that pass by path uniqueness but fail source diversity: repeated crops, same-shoot derivatives, same original asset, or multiple nearly identical compositions across scenes are not real choice depth.
- Reject dashboards that include visibly low-resolution, broken, pixelated, blurry, over-compressed, watermarked preview, or distorted-upscale image candidates. A visually weak image is not acceptable just because it is topically correct.
- Treat duplicate image sources as a hard dashboard failure, not a post-render cleanup item. Check exact paths, source URLs, original assets, source families, and near-duplicate compositions before sharing.
- Run `npm.cmd run reels:dashboard-gate -- --slug {slug}` before writing "Reviewer precheck passed" or sharing the review URL/file. A failure means the dashboard is internal-only.
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
- Use exactly one motion-card scene for a normal 35-45 second Reel by default.
- Place the motion card where it pays off the tension, normally around 60-75% of the Reel. Do not place it as Scene 1 unless the representative explicitly approves it.
- If the story seems to need two motion cards, send it back to Reels Script Agent first to simplify the narration; use a second card only with a slug-specific representative exception recorded in `HANDOFF.md`.
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
- For a motion-card scene, provide multiple design options for that scene and approve exactly one option with `Select / Replace`, not rank buttons. If the representative says "use one card motion" for a Reel, that means one motion-card insert scene in the script; the dashboard may still show A/B/C design options for that one scene unless the representative explicitly asks for a single design option.

### Reels Voice Agent

- Use ElevenLabs for narration audio after the script is approved.
- Never print API secrets.
- Use `ELEVENLABS_API_KEY` and a selected `ELEVENLABS_VOICE_ID`.
- Maintain two default voice lanes: `male_friend` and `female_culture_travel`.
- Confirm the selected voice lane from `output/reels/{slug}/strategy.md` before TTS.
- For important batch openers, new voice IDs, changed voice lanes, or weak first-pass delivery, generate an 8-12 second audition sample before full scene-level TTS.
- If the voice sounds like a calm article readout, route back to Script Agent for punchier spoken wording or regenerate with a better voice setting.
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
- Confirm the creative brief exists and includes Reels Viral Fit Score, selected voice lane, thumbnail direction, and one motion-card role before final render.
- Confirm a normal 35-45 second Reel has no more than one motion-card insert unless a representative exception is recorded.
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
  - narration entertainment and naturalness
  - narration/caption timing
  - scene cut/audio boundary sync
  - caption readability
  - Instagram mobile safe area
  - visual/narration relevance
  - motion-card fit and density
  - pacing and cognitive load
  - visual continuity/variety/risk
  - CTA, save/share reason, and brand finish
  - technical render integrity and traceability
- For every score below perfect, cite exact scene, second, frame, what the viewer sees/hears, and why it matters.
- Route fixes to the exact responsible agent instead of giving vague team feedback.
- Do not mark a Reel publish-ready until hard gates are clear and the final score is at least `90`, unless the representative explicitly accepts a lower score.
- Do not award `90+` for technical cleanliness alone. The Reel needs a thumb-stopping first second, natural/entertaining narration, and a clear save/share reason.

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
