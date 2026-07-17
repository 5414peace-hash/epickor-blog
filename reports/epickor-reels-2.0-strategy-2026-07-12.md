# EpicKor Reels 2.0 Strategy

Date: 2026-07-12  
Scope: A clean-sheet redesign of the EpicKor Reel format and production system. This is not a comparison with past Reels.

## Executive decision

EpicKor should stop treating a Reel as a narrated carousel. The new core product should be a 45-60 second, video-first mini guide that gives one useful answer, demonstrates it visually, and leaves the viewer with a decision rule worth saving or sending.

The target format is a hybrid:

- 45-60% moving footage: owned footage, licensed footage, official reusable footage, or carefully generated AI video.
- 20-30% motion graphics: maps, comparisons, timelines, checklists, receipts, menus, diagrams, or annotated screen-style layouts.
- 10-20% still images: only when the image itself is evidence or when a purposeful 2.5D/motion-template treatment adds meaning.
- 5-10% brand/CTA: integrated into the story, not a detached commercial ending.

This is a production target, not a rigid frame-by-frame quota. A topic with excellent real footage can use more footage; a practical comparison can use more explanatory graphics.

## What is structurally wrong today

The current system has good operational controls, but its media grammar is too narrow:

1. The renderer is image-led. `ReelComposition.tsx` renders scene visuals through `Img`; it does not yet have a first-class video-clip scene type.
2. Most visual movement is simulated camera movement on a still: pan, drift, push, or zoom. This changes the crop but rarely changes the information.
3. The content model is one sentence per scene. In a 40-second, seven-scene structure, this often produces a list of claims rather than a small story with proof, surprise, and payoff.
4. Motion cards are treated as occasional inserts rather than an explanatory visual language. They can look polished while still feeling like interruptions.
5. The opening promise is usually text over a visual. It does not consistently show a change, conflict, demonstration, human action, or surprising result in the first seconds.
6. The outro spends scarce attention on a generic destination instead of completing the viewer's thought and creating a specific reason to visit the article.
7. Quality gates emphasize visual fit and duplicate avoidance, but do not yet score information value, moment-to-moment change, curiosity, entertainment, or proof.

The likely audience response is therefore predictable: the Reel may look clean, but it can feel like a short blog summary being read over pictures. More generated pictures or stronger zooms would not solve that.

## New editorial promise

Every Reel must answer one viewer question:

> “What will I understand, avoid, choose, or do differently after watching this?”

Each Reel should contain:

- one tension or misconception;
- three to five concrete facts, steps, or decision criteria;
- at least one visual proof or demonstration;
- one Korea-specific detail that a generic travel/lifestyle account would not give;
- one memorable payoff line;
- one natural save, send, or article-click reason.

“More information” should not mean cramming more narration into the same slideshow. It means turning claims into visible evidence and a clear decision.

## Recommended episode architecture

### Default 50-second guide

| Time | Story job | Preferred visual treatment |
|---|---|---|
| 0:00-0:02 | Cold open: show the problem/result before explaining | Real or generated action clip, before/after, rapid comparison, or a human reaction |
| 0:02-0:07 | Promise and stakes | Presenter/POV clip plus bold on-screen question |
| 0:07-0:18 | Context: why the obvious answer is incomplete | Two or three short clips with annotations |
| 0:18-0:34 | Main value: three useful points | Demonstration footage intercut with maps, comparisons, receipts, or checklists |
| 0:34-0:44 | Korea-specific proof/example | Official/owned/local footage, package/signage detail, map, price or process evidence |
| 0:44-0:50 | Decision rule and payoff | Saveable motion board over continuing footage |
| 0:50-0:55 | Specific CTA if needed | “Get the full map/checklist/comparison at epickor.com” |

Not every Reel needs 55 seconds. The correct length is the shortest version that delivers a complete payoff. A dense buying guide can run 55-70 seconds; a single cultural reveal may work in 30-40 seconds. “Short” is not the goal; completed viewer value is.

## Three repeatable format families

### 1. Korea Decision Guide

Use for shopping, transport, itinerary, products, and practical travel.

- Hook: “Do not choose X until you check this.”
- Body: show three options, one visible comparison, one mistake.
- Payoff: a simple decision tree.
- Funnel: detailed comparison/table/product links on EpicKor.

### 2. Korea Visual Explainer

Use for culture, systems, etiquette, food, and everyday life.

- Hook: show the unfamiliar behavior/object first.
- Body: what it is, why it exists, how people actually use it.
- Payoff: one sentence that changes how the viewer sees Korea.
- Funnel: deeper cultural context and practical examples on EpicKor.

### 3. Korea Mini Mission

Use for places, routes, food crawls, and things to do.

- Hook: a concrete mission with a constraint: time, budget, neighborhood, weather, or fandom.
- Body: movement through three beats; map/progress graphics make the viewer feel forward motion.
- Payoff: final result plus a reusable route/checklist.
- Funnel: full itinerary/map/details on EpicKor.

These families create recognizability without making every Reel look mass-produced.

## Visual sourcing policy

### Priority order

1. EpicKor/Tripclip-owned original video.
2. Official tourism, government, venue, brand, or client footage with explicit reuse permission or supplied media rights.
3. Commercially licensed stock video with a recorded license.
4. Original AI video generated from EpicKor-owned or licensed source images.
5. Original motion graphics, screen recreations, maps, diagrams, and data visuals.
6. Still photography with a purposeful motion-template treatment.
7. Third-party YouTube material only after a documented rights decision.

### YouTube rule

Do not use `yt-dlp` or another downloader as a general footage library. YouTube says users cannot download other users' videos through its standard download feature, and an uploaded video's default license is the Standard YouTube License. Credit alone does not grant reuse rights.

A YouTube-hosted clip may enter production only if one of these is recorded in `image-sources.md` or a new `clip-sources.md`:

- EpicKor/Tripclip owns the upload and underlying audio/video rights;
- the rights holder supplied written permission for commercial social use;
- the upload is clearly CC BY and commercial reuse/attribution conditions are satisfied;
- the material is verifiably public domain;
- legal review has approved a genuinely transformative quotation/criticism use.

Even a very short clip is not automatically safe, and adding captions, cropping, speed changes, or voiceover does not automatically make it fair use. Strip third-party audio unless it is separately licensed.

### Preferred way to use YouTube

Use YouTube primarily as research and shot-reference material:

- identify what a place, process, product, or event actually looks like;
- write a shot list from it;
- recreate the needed shot with owned footage, licensed stock, an official media asset, motion graphics, or AI generation;
- keep the URL as a reference, not as an automatic source file.

## Higgsfield/Kling role

Higgsfield/Kling should provide selected moving shots, not generate an entire Reel end to end.

Best uses:

- animate an original vertical hero image into a 2-5 second establishing shot;
- add subtle human/environment motion where the exact action is non-critical;
- create impossible but clearly illustrative transitions;
- maintain a recurring original EpicKor host/guide character if disclosure and consistency are handled;
- generate start-to-end movement between two controlled frames;
- restyle EpicKor-owned footage or create visual metaphors.

Avoid or manually verify:

- readable Korean signage, labels, prices, timetables, maps, product controls, and factual UI;
- exact landmarks or branded interiors where hallucination would mislead;
- food preparation steps where incorrect hand/object physics changes the advice;
- celebrity likenesses and copyrighted characters;
- long continuous shots that reveal temporal drift.

Recommended production rule: generate 3-5 second clips, cut before artifacts become visible, preserve narration and captions in Remotion, and treat AI-native audio as optional ambience rather than the factual voice track. Store the source image, prompt, model/version, generation date, output, and commercial-use basis.

Higgsfield currently advertises image/video input, first/last frames, motion control, video editing, and multiple video models including Kling. Its Kling 3.0 page advertises up to 15-second generations and multi-shot capability, while API access is described as an enterprise-plan capability. Therefore, do not design automation around a public Higgsfield API until the account's actual API access, terms, cost, rate limits, and export rights are confirmed.

## Still-image treatment

A still image can remain when it has evidence value, but it must be designed as a shot rather than dropped behind subtitles.

Approved treatments:

- 2.5D depth/parallax with foreground and background separation;
- annotated crop: circle, pointer, highlight, measurement, label, or step marker;
- multi-panel compare with a moving selection state;
- map route or timeline built from the still;
- object cutout moving within a branded editorial layout;
- kinetic photo collage with three different evidence images;
- before/after or wrong/right reveal;
- a “receipt,” “menu,” “field note,” or “packing desk” template whose items appear with narration.

Unapproved as a default: a full-screen image held for five to six seconds with only a slow zoom and subtitles.

## Human presence and voice

EpicKor needs a recognizable point of view. Full-time on-camera hosting is not mandatory, but at least one form of human presence should appear in most Reels:

- a real host speaking to camera;
- hands demonstrating an object/process;
- POV walking, buying, opening, tasting, navigating, or comparing;
- a recurring voice with conversational reactions and opinions;
- an explicitly synthetic recurring guide used consistently and transparently.

The narration should sound like someone helping a friend, not reading article headings. It should use short spoken clauses, contrast, anticipation, and specific nouns. A useful target is roughly 105-145 spoken words for 45-60 seconds, adjusted after actual TTS timing. The opening must not spend time introducing the topic; it should begin at the interesting part.

## Sound design

Voice alone makes a Reel feel unfinished. Add a controlled sound layer:

- low-volume licensed music or Instagram-cleared music chosen during upload;
- 4-8 purposeful sound cues per Reel: click, stamp, swipe, train chime, bag zip, sizzle, page flip, transition hit;
- short location ambience under selected clips;
- small silence/drop before the payoff when it improves attention.

Do not bake copyrighted trending audio into the master unless the rights allow cross-platform and commercial reuse. Keep a clean master, narration stem, SFX stem, and music-free export.

## Technical redesign

### New scene types

Extend the Reel schema and Remotion renderer beyond `photo` and `motion_card`:

- `video_clip`: owned/licensed/generated MP4 with trim, crop, speed, and optional muted source audio;
- `presenter`: host/POV clip with captions and optional cutaway;
- `motion_explainer`: map, comparison, diagram, timeline, process, or decision tree;
- `photo_motion`: 2.5D/annotated/collage treatment, not generic Ken Burns;
- `evidence`: source-backed screenshot, package, sign, price, map, or official fact with attribution;
- `transition`: maximum 0.3-0.6 seconds and only when it advances the idea.

Remotion should add `OffthreadVideo`/video rendering support, per-clip trims, playback rate, transitions, source-audio controls, lower-third/source labels, and audio ducking. The current special-case title and caption logic should be replaced gradually with data-driven templates.

### New source manifest

Each visual asset should record:

- `assetType`: owned, official-permission, stock-license, CC-BY, public-domain, AI-generated, or reference-only;
- owner/source URL;
- license/permission evidence and commercial-use status;
- downloaded/generated date;
- original audio rights;
- AI model, prompt, input asset, and disclosure requirement;
- factual-risk flags such as signage, price, map, product, likeness, or location.

Reference-only assets must be blocked automatically from final rendering.

### New review gates

Add four scores before human approval:

| Score | Weight | Pass question |
|---|---:|---|
| Viewer Value | 30 | Does the Reel deliver a complete, specific answer with 3-5 useful points? |
| Retention Design | 25 | Does something meaningful change every 1.5-3 seconds without becoming frantic? |
| Visual Proof | 20 | Are key claims demonstrated, annotated, or evidenced rather than merely narrated? |
| Originality/Brand | 15 | Is the EpicKor point of view clear and is the work substantially original? |
| Funnel Fit | 10 | Is there a natural reason to save, send, or visit the relevant guide? |

Suggested pass: average 90/100, no category below 85, and a hard fail for unclear rights, misleading generated detail, or reference-only material in a render.

## Measurement plan

Do not judge the redesign from raw views alone. For every Reel record:

- reach and non-follower reach;
- 3-second hold rate;
- average watch time and average percentage watched;
- completion rate;
- replays if available;
- sends/shares per reach;
- saves per reach;
- profile visits;
- website sessions attributed to Instagram;
- article CTA clicks and Amazon affiliate clicks from that traffic.

Use Trial Reels, where available, to test opening and format with non-followers before the main audience. Change only one or two major variables per test so results remain interpretable.

## Pilot: one three-Reel batch

Do not rebuild the whole pipeline before proving the format. Produce one batch of three newly published, representative-approved topics using three different format families.

### Reel A: Decision Guide

- 50-60 seconds.
- Real/licensed/generated clips plus an animated comparison and final decision tree.
- Test variable: problem-first cold open versus option-first cold open.

### Reel B: Visual Explainer

- 40-50 seconds.
- One striking visual behavior/object, two proof clips, one diagram, one Korea-specific explanation.
- Test variable: human/POV opening versus pure visual mystery.

### Reel C: Mini Mission

- 50-65 seconds.
- Route/progress structure, map motion, real place/food/activity clips, result at the end.
- Test variable: time constraint versus budget constraint.

For each pilot Reel, make two first-three-second variants and one shared body. Review the opening variants first; only then finish all audio and rendering. Publish/schedule as the required three-Reel batch.

## Implementation phases

### Phase 0 — Rights and access check (0.5-1 day)

- Confirm Higgsfield plan, API availability, commercial terms, credits, rate limits, and export specs.
- Inventory owned Tripclip/EpicKor vertical footage that can legally be reused.
- Choose licensed stock providers and document license storage.

### Phase 1 — Format prototype (2-4 days)

- Select three new, published, publicly verified posts.
- Write 45-60 second storyboards, not article summaries.
- Produce one rough Reel using manual Higgsfield generation and local Remotion assembly.
- Validate whether motion, information density, and workflow time are acceptable before automation.

### Phase 2 — Renderer upgrade (3-6 days)

- Add video-clip support and new scene schema.
- Add clip trim/crop/speed, transitions, SFX/music stems, attribution overlays, and rights manifest validation.
- Add two modular explanatory motion templates and one 2.5D still template.

### Phase 3 — Three-Reel pilot and review (3-7 days)

- Complete the three-format batch.
- Human-review every final MP4 on a phone with sound on and off.
- Test opening variants via Trial Reels where available.

### Phase 4 — Scale only what works

- Keep winning hook/format combinations.
- Automate prompt packages and render assembly only after manual output proves reliable.
- Build a reusable vertical B-roll library and a rights-cleared source registry.

## Immediate priority order

1. Rights/access inventory and three-topic selection. Highest leverage because it determines what can be produced safely and repeatedly.
2. One 50-second hybrid prototype with real/generated video, motion explainer, SFX, and a specific payoff. This tests the concept before engineering expansion.
3. Add first-class video support and rights metadata to the renderer, then produce the full three-Reel batch.

The key standard is simple: every EpicKor Reel should feel like a small, authored Korea video—not a blog excerpt with moving pictures.

