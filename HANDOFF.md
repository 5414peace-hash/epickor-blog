# HANDOFF - EpicKor Agent Teams v2

## Latest Update - 2026-05-09 Reels 171 Final Render Complete

- Task: Finalize approved Reels 171 after representative completed the dashboard final step.
- Final visual approval:
  - `/reels-review/171` status reached `visuals_approved`.
  - Finalized timestamp in `output/reels/171/approved-visuals.json`: `2026-05-09T12:35:56.933Z`.
  - Approved motion inserts:
    - Scene 2: `171-2-motion-a` (`convenience_tray`).
    - Scene 4: `171-4-motion-c` (`receipt_stack`).
    - Scene 5: `171-5-motion-b` (`morning_route`).
- Production completed:
  - Prepared local and remote assets into `public/assets/reels/171/`.
  - Generated segmented ElevenLabs narration:
    - `output/reels/171/audio/narration-v001-part-01.mp3`
    - `output/reels/171/audio/narration-v001-part-02.mp3`
    - `output/reels/171/audio/narration-v001-part-03.mp3`
  - Built Remotion props with slug-specific caption beats and 171-specific audio grouping:
    - Part 1: Scenes 1-2.
    - Part 2: Scenes 3-4.
    - Part 3: Scenes 5-7.
  - Rendered final MP4:
    - `output/reels/171/render/epickor-reel-171-v001.mp4`
- Render verification:
  - `ffprobe`: H.264 video, AAC audio, `1080x1920`, `30fps`, duration `36.885333s`, size `30,977,886` bytes.
  - QA contact sheet: `output/reels/171/qa/contact-v001.jpg`.
  - Visual spot-check confirmed chronological scene flow and approved motion-card inserts in their correct scene positions.
- Pipeline fixes made during finalization:
  - `.claude/skills/reels/scripts/prepare-assets.mjs` can now copy local `/assets/...` candidates and uses a browser-like user agent/retry for remote downloads.
  - `.claude/skills/reels/scripts/build-remotion-props.mjs` now uses slug-specific caption beats and part grouping for 171.
  - `remotion/ReelComposition.tsx` now renders the 171 thumbnail text dynamically instead of using the old PC-bang hardcoded wording.
  - `.claude/skills/reels/scripts/render-reel.mjs` now launches Windows `.cmd` tools through `cmd.exe /d /s /c`, fixing `spawnSync npx.cmd EINVAL`.
- Verification commands:
  - `node --check .claude\skills\reels\scripts\render-reel.mjs`: passed.
  - `npm.cmd run reels:prepare-assets -- --slug 171`: passed after remote retry handling.
  - `npm.cmd run reels:props -- --slug 171 --audio-version v001`: passed.
  - `npm.cmd run reels:render -- --slug 171 --audio-version v001 --dry-run`: passed.
  - `npm.cmd run reels:render -- --slug 171 --audio-version v001`: passed.
- Upload note:
  - Instagram upload remains representative-managed; Codex should not present upload as an automated next action.

### Correction - Reels 171 v002 Sync and Motion Selection Fix

- Representative found the v001 render unacceptable:
  - Narration did not align reliably with the visual scene cuts.
  - Caption text did not exactly match the spoken narration.
  - The selected motion-card options were not always applied.
- Root causes:
  - `remotion/ReelComposition.tsx` selected the first motion card matching `sceneNumber`, so pending option A could render even when option B or C was approved.
  - `build-remotion-props.mjs` passed all non-rejected motion cards into Remotion instead of approved-only motion cards.
  - 171 caption beat overrides paraphrased the narration instead of preserving exact spoken text.
  - Final timing used multi-scene audio files and word-count allocation, which is too approximate for scene/narration sync.
- Fixes:
  - Remotion now selects only `reviewStatus: "approved"` motion cards.
  - `build-remotion-props.mjs` now passes approved-only motion cards.
  - 171 caption beats now exactly match narration wording.
  - Final v002 audio was regenerated per scene:
    - `narration-v002-scene-01.mp3` through `narration-v002-scene-07.mp3`.
  - Props now use seven scene-level audio segments, so each scene duration is based on its actual audio file.
  - Motion-card and thumbnail scenes now include compact synced narration captions.
  - Added `npm run reels:validate` via `.claude/skills/reels/scripts/validate-render-readiness.mjs`.
  - Updated Reels agent/design-system instructions to require approved-only motion props, exact narration captions, scene-level final audio, and render-readiness validation before final render.
- Corrected render:
  - `output/reels/171/render/epickor-reel-171-v002.mp4`
  - `ffprobe`: H.264 video, AAC audio, `1080x1920`, `30fps`, duration `35.648000s`, size `29,096,450` bytes.
  - QA contact sheet: `output/reels/171/qa/contact-v002.jpg`.
  - Validation passed: `npm.cmd run reels:validate -- --slug 171 --require-scene-audio`.
  - Build passed: `npm.cmd run build`.

## Latest Update - 2026-05-09 Reels 171 Review Project Ready

- Task: Review representative's idea to produce one new Reel and prepare a dashboard-reviewable project.
- Source post:
  - `/blog/171` - `Korean Convenience Store Breakfast: What Locals Buy`
  - Reason: recent public post, strong Instagram hook, low production risk, and already vetted Korea-first visuals from Card News 171.
- Created Reels project:
  - `output/reels/171/strategy.md`
  - `output/reels/171/script.md`
  - `output/reels/171/scenes.json`
  - `output/reels/171/visual-candidates.json`
  - `output/reels/171/motion-cards.json`
  - `output/reels/171/approved-visuals.json`
  - `output/reels/171/review.md`
  - `output/reels/171/voiceover.txt`
  - `output/reels/171/voiceover-v001-part-01.txt` through `part-03.txt`
- Editorial direction:
  - Working title: `Korean Convenience Store Breakfast Is Not Fancy`
  - Hook: tourists look for a special Korean breakfast, while locals often solve the morning at a convenience store.
  - Seven-scene flow: local hook, small-choice breakfast logic, triangle gimbap, choose-by-morning map, wrapper tip, seating etiquette, simple local order CTA.
- Visual/motion setup:
  - Every scene has at least three visual candidates.
  - Candidate sources prioritize source-post and Card News 171 vetted Korea-first images.
  - Initial motion-card pass repeated too much of Reels 170's structure.
  - Representative asked to avoid treating motion cards as script-independent design shells.
  - Added `Reels Motion Design Agent` guidance to `.claude/agents/reels-team/AGENT.md`.
  - Added script-specific motion-card design rules to `.claude/skills/reels/design_system.md`.
  - Revised 171 with three script-specific motion-card templates:
    - Scene 2: `convenience_tray` - light morning shelf/tray grid for rice, bread, coffee, milk, eggs.
    - Scene 4: `morning_route` - route-map decision structure for choosing by morning type.
    - Scene 5: `wrapper_tabs` - triangle-gimbap wrapper process diagram.
  - Added `output/reels/171/motion-card-templates.json`.
  - Updated Remotion and dashboard preview code so these templates render as distinct structures, not renamed old cards.
  - Follow-up representative feedback:
    - Motion cards should be reviewed in scene order, not in a separate top section.
    - A motion-card scene should show multiple motion-design options inside that numbered scene.
    - Normal image candidates must not repeat across scenes.
    - Card-news PNGs must not appear as ordinary image candidates.
  - Corrected dashboard/data flow:
    - Removed top-level Motion Card Review section.
    - Motion design choices now appear inside Scene 2, Scene 4, and Scene 5.
    - Each motion scene has exactly three options, and approving one option supersedes any other approved option for that scene.
    - Final visual approval now treats a motion-card scene as complete when one motion design is approved.
    - Added `receipt_stack` template for convenience-store receipt-style design variation.
    - Rebuilt visual candidates so normal scene image candidates have no cross-scene duplicates.
    - Removed card-news PNGs from normal visual candidates, keeping only Scene 1's intentional intro-thumbnail candidate.
  - Status remains `visual_review_pending`; final rendering is intentionally blocked until human dashboard approval.
- Verification:
  - JSON parse check passed for `scenes.json`, `visual-candidates.json`, `motion-cards.json`, and `approved-visuals.json`.
  - JSON parse check passed for `motion-card-templates.json`.
  - `node --check .claude\skills\reels\scripts\build-remotion-props.mjs`: passed.
  - `node --check .claude\skills\reels\scripts\render-reel.mjs`: passed.
  - `npx.cmd tsc --noEmit`: passed.
  - `npm.cmd run build`: passed.
  - Normal image candidate duplicate check: `0`.
  - Card-news PNG violation check: `0` outside the approved Scene 1 intro-thumbnail exception.
  - Motion options per scene: Scene 2 = 3, Scene 4 = 3, Scene 5 = 3.
  - Local dashboard check passed:
    - `http://localhost:4000/reels-review/171` returned `200`.
    - Page contains the 171 title and Motion Card Review section.
    - API returns the 171-specific template IDs: `convenience_tray`, `morning_route`, `wrapper_tabs`.
  - Dev server was started on port `4000` for representative review.
  - Current gate:
  - Representative completed a review pass.
  - Approved so far:
    - Scene 1 image ranking complete.
    - Scene 2 motion card: `171-2-motion-a` (`convenience_tray`).
    - Scene 3 image ranking complete.
    - Scene 4 motion card: `171-4-motion-c` (`receipt_stack`).
    - Scene 5 motion card: `171-5-motion-b` (`morning_route`).
    - Scene 6 image ranking complete.
  - Fixed review-pass API bug that incorrectly marked approved motion-card scenes as replacement-needed.
  - Scene 7 remains the only actual blocker.
  - Scene 7 replacement candidates were refreshed with four Korea/gimbap-oriented options.
  - Next human action: review and rank Scene 7 candidates in `http://localhost:4000/reels-review/171`, then finalize visual review.
  - After final visual approval, next steps are segmented ElevenLabs narration, `reels:prepare-assets`, `reels:props`, dry-run render, and versioned MP4 render.

## Latest Update - 2026-05-08 Card News 043 and 008 Complete

- Task: Produce both next recommended card-news priorities after representative approved proceeding with Priority 1 and 2.
- Source posts:
  - `/blog/043` - `Why Is Jang Wonyoung So Popular? Wonyoungism Explained`
  - `/blog/008` - `Why Koreans Eat So Much Garlic: Culture Explained`
- Produced Card News 043:
  - Working folder: `output/cardnews/2026-05-08_043/`
  - Publish asset folder: `public/assets/cardnews/2026-05-08_043/`
  - Includes `card_01.png` through `card_07.png`, `script.md`, `caption.txt`, `instagram-caption.md`, and `image-sources.md`.
  - Card flow: Wonyoung as a K-pop language, born-idol precision, Lucky Vicky, Wonyoungism lifestyle, fashion signal, perfection criticism, and full-guide CTA.
  - Visual sourcing: used post-owned assets from `public/assets/images/posts/043/`; two cards use graphic treatment to avoid reusing duplicate Wonyoung frames within the carousel.
- Produced Card News 008:
  - Working folder: `output/cardnews/2026-05-08_008/`
  - Publish asset folder: `public/assets/cardnews/2026-05-08_008/`
  - Includes `card_01.png` through `card_07.png`, `script.md`, `caption.txt`, `instagram-caption.md`, and `image-sources.md`.
  - Card flow: garlic as foundation, Korean kitchen base, Dangun myth, distributed garlic frequency, table map, BBQ wrap logic, and full-guide CTA.
  - Visual sourcing: used only relevant post-owned garlic/Dangun assets from `public/assets/images/posts/008/`; unrelated K-drama/person images and the foreign-chef comparison frame were intentionally excluded for Korea-first visual quality.
- Verification:
  - Rendered both sets successfully:
    - `python .claude\skills\cardnews\scripts\html-to-png.py --slug 043`
    - `python .claude\skills\cardnews\scripts\html-to-png.py --slug 008`
  - All fourteen public PNGs are `1080x1080`.
  - Temporary `card_*.html` count is `0`.
  - Cross-post duplicate check found no prior card-news use of `/assets/images/posts/043/` or `/assets/images/posts/008/` before these outputs.
  - Reviewer visually inspected all rendered cards for readability, watermark presence, image relevance, and swipe logic.
- Tracking:
  - Added both folders to `public/assets/cardnews/CARDNEWS_INDEX.md`.
  - Instagram upload remains representative-managed; do not present upload as a Codex next action.

## Latest Update - 2026-05-08 Card News Folder Date Prefix Cleanup

- Representative requested card-news folder cleanup because numeric-only folders made it hard to track production/upload state over time.
- New folder naming convention:
  - `YYYY-MM-DD_slug`
  - Example: `public/assets/cardnews/2026-05-08_090/`
- Renamed both working and public card-news folders:
  - `output/cardnews/{slug}` -> `output/cardnews/YYYY-MM-DD_{slug}`
  - `public/assets/cardnews/{slug}` -> `public/assets/cardnews/YYYY-MM-DD_{slug}`
- Current public folders:
  - `2026-04-30_071`
  - `2026-05-02_064`
  - `2026-05-02_068`
  - `2026-05-02_135`
  - `2026-05-02_153`
  - `2026-05-02_160`
  - `2026-05-02_168`
  - `2026-05-02_169`
  - `2026-05-03_003`
  - `2026-05-03_132`
  - `2026-05-03_159`
  - `2026-05-06_038`
  - `2026-05-07_171`
  - `2026-05-08_082`
  - `2026-05-08_090`
- Added `public/assets/cardnews/CARDNEWS_INDEX.md` for manual tracking:
  - folder
  - slug
  - topic
  - card count
  - production status
  - upload status
- Updated caption files so `Asset folder:` lines point to the renamed public folders.
- Updated pipeline compatibility:
  - `.claude/skills/cardnews/scripts/html-to-png.py` now accepts `--slug 090` and resolves `output/cardnews/2026-05-08_090/`.
  - `.claude/skills/cardnews/scripts/generate-slides.mjs` now creates new briefs under `output/cardnews/YYYY-MM-DD_{slug}/`.
  - `CLAUDE.md` and card-news agent instructions now document the date-prefixed convention.
- Verification:
  - No numeric-only directories remain under `output/cardnews` or `public/assets/cardnews`.
  - No `instagram-caption.md` still points to `public/assets/cardnews/{slug}/`.
  - `node --check .claude\skills\cardnews\scripts\generate-slides.mjs` passed.
  - `python -m py_compile .claude\skills\cardnews\scripts\html-to-png.py` passed.
  - Render compatibility check passed:
    - `python .claude\skills\cardnews\scripts\html-to-png.py --slug 090 --card 06`
    - Output resolved to `output/cardnews/2026-05-08_090/`.
- Important:
  - Public asset URLs now use the date-prefixed folder names.
  - Instagram upload remains representative-managed; Codex should not present upload as a next task.

## Latest Update - 2026-05-08 Card News 082 Complete

- Task: Produce next GSC-backed card news after representative confirmed Card News 090.
- Source post:
  - Public blog: `/blog/082`
  - Topic: `SKY Universities in Korea: SNU, Korea, Yonsei Explained`
  - Strategy reason: latest weekly strategy showed `/blog/082` as a high-impression, low-CTR opportunity; it had no existing card-news folder.
- Produced folders:
  - Working folder: `output/cardnews/082/`
  - Publish asset folder: `public/assets/cardnews/082/`
- Includes:
  - `card_01.png` through `card_07.png`
  - `script.md`
  - `caption.txt`
  - `instagram-caption.md`
  - `image-sources.md`
- Card flow:
  - SKY is not just a ranking
  - SNU / Korea / Yonsei acronym
  - SNU as academic peak
  - Korea University school spirit
  - Yonsei global and polished image
  - SKY as powerful but not destiny
  - social-pressure CTA to full guide
- Visual sourcing:
  - Used only post-owned assets from `public/assets/images/posts/082/`.
  - No new external Pexels or third-party image IDs were introduced.
  - Cross-post duplicate check found no prior card-news use of the 082 image paths.
- Verification:
  - Render command: `python .claude\skills\cardnews\scripts\html-to-png.py --slug 082`
  - Rendered all seven PNGs successfully.
  - Reworked the first render to better preserve school/college logo visibility and avoid awkward vertical-frame crops.
  - All seven public PNGs are `1080x1080`.
  - Temporary `card_*.html` count is `0`.
  - Reviewer visually inspected rendered cards for image relevance, school/logo visibility, text readability, watermark presence, and swipe logic.
- Upload note:
  - Representative handles Instagram upload independently. Do not present upload as a Codex next action.

## Latest Update - 2026-05-08 Card News 090 Final Confirmation

- Representative confirmed the revised Card News 090 version.
- Treat 090 as final complete for production planning.
- Instagram upload remains representative-managed; do not present upload as a Codex next action.
- Next operational work moved to the next GSC-backed card-news priority: `/blog/082` SKY Universities.

## Latest Update - 2026-05-08 Card News 090 Visual Rework

- Representative feedback:
  - Initial 090 card-news images were poorly placed.
  - Handsome/oppa faces should be visible.
  - Text should not heavily cover faces.
  - Black/tone-down treatment made visuals too hard to see.
- Revision:
  - Reworked `output/cardnews/090/script.md` from a dark 7-card carousel to a brighter 6-card carousel.
  - Switched to mostly text-separated layouts (`B`, `C`, `E`) so faces remain visible and text does not sit over key faces.
  - Removed the extra seventh card to avoid repeating the same 090 image source.
  - Re-rendered the carousel and replaced public assets under `public/assets/cardnews/090/`.
- Final revised output:
  - `card_01.png` through `card_06.png`
  - `script.md`
  - `caption.txt`
  - `instagram-caption.md`
  - `image-sources.md`
- Verification:
  - Rendered successfully with `python .claude\skills\cardnews\scripts\html-to-png.py --slug 090` and one follow-up render for card 05.
  - All six public PNGs are `1080x1080`.
  - Temporary `card_*.html` count is `0`.
  - Public folder now contains six card PNGs; old `card_07.png` was removed.
  - Reviewer visually rechecked the revised cards for face visibility, reduced black overlay, text separation, watermark presence, and swipe logic.

## Latest Update - 2026-05-08 Card News 090 Complete

- Task: Produce Priority 1 card news for `/blog/090`.
- Source post:
  - Public blog: `/blog/090`
  - Topic: `Ahjussi Meaning in Korean: Samchon vs Oppa Explained`
  - GSC opportunity used for prioritization: high impressions and very low CTR from the latest weekly strategy report.
- Produced folders:
  - Working folder: `output/cardnews/090/`
  - Publish asset folder: `public/assets/cardnews/090/`
- Includes:
  - `card_01.png` through `card_07.png`
  - `script.md`
  - `caption.txt`
  - `instagram-caption.md`
  - `image-sources.md`
- Card flow:
  - ahjussi is not just "mister"
  - real meaning and emotional temperature
  - oppa / samchon / ahjussi comparison
  - why the word can feel sensitive
  - tourist-safe wording tip
  - Korean social media/aura logic
  - full guide CTA
- Visual sourcing:
  - Used post-owned assets from `public/assets/images/posts/090/`.
  - No new external Pexels or third-party image IDs were introduced.
  - Cross-post duplicate check found no previous card-news use of the 090 image paths.
- Verification:
  - Render command: `python .claude\skills\cardnews\scripts\html-to-png.py --slug 090`
  - Rendered all seven PNGs successfully.
  - All public PNGs are `1080x1080`.
  - Temporary `card_*.html` files count is `0`.
  - Reviewer visually inspected all seven rendered PNGs for readability, watermark presence, image relevance, and swipe logic.
- Upload note:
  - Representative handles Instagram upload independently. Do not present upload as the next Codex task.

## Latest Update - 2026-05-08 Card News 171 Final Confirmation

- Representative confirmed Card News 171 is final complete.
- Instagram upload is intentionally owner-managed by the representative; do not keep presenting upload as a Codex next action.
- Treat 171 as done for production planning:
  - Blog post published and verified.
  - Card news rendered, revised, deployed, and human-confirmed.
  - Caption files remain available under `public/assets/cardnews/171/` for representative use.
- Next work should move on to the next content/optimization priority rather than revisiting 171 upload logistics.

## Latest Update - 2026-05-07 Post 171 Publish and Card News

- Blog post 171 was approved, published, and verified:
  - Public URL: `https://www.epickor.com/blog/171`
  - Topic: `Korean Convenience Store Breakfast: What Locals Buy`
  - Vercel deployment failure was fixed by updating `pnpm-lock.yaml` for the newly added Remotion dependencies.
  - Final deployment status: Vercel production `Ready`.
  - Public URL check returned `200`, and sitemap contains `/blog/171`.
- Card News 171 was produced from the published post:
  - Working folder: `output/cardnews/171/`
  - Publish asset folder: `public/assets/cardnews/171/`
  - Includes:
    - `card_01.png` through `card_07.png`
    - `script.md`
    - `caption.txt`
    - `instagram-caption.md`
  - Card flow:
    - local morning hook
    - small-choice breakfast logic
    - triangle gimbap starter
    - decision map by morning type
    - triangle gimbap wrapper tip
    - convenience-store seating manners
    - simple local order CTA
  - Render/review checks:
    - `python .claude\skills\cardnews\scripts\html-to-png.py --slug 171` rendered all seven PNGs.
    - Card 04 label was adjusted from `Bread + coffee` to `Light breakfast` after visual review.
    - All PNGs are `1080x1080`.
    - Temporary `card_*.html` files were removed after render.
    - Existing card-news scripts were checked for duplicate Pexels IDs `31735910`, `33675546`, and `15957254`; matches only appear in 171 outputs.
    - Reviewer visually inspected all seven rendered cards for readability, watermark presence, and image relevance.
  - Next gate:
    - Human review of `public/assets/cardnews/171/card_01.png` through `card_07.png`.
    - If approved, upload the carousel using `public/assets/cardnews/171/instagram-caption.md`.
- Card News 171 revision after visual feedback:
  - Feedback:
    - Only card 02 image felt appropriate.
    - The overall tone was too black/dark for a convenience-store breakfast topic.
  - Updates:
    - Added a reproducible `theme: morning` option to `.claude/skills/cardnews/scripts/html-to-png.py`.
    - The new theme keeps existing card-news defaults unchanged unless a card explicitly opts in.
    - Re-rendered 171 with a brighter convenience-store morning style: light panels, dark readable text, teal/gold accents, and softer image overlays.
    - Replaced all non-card-02 visuals with more relevant convenience-store / packaged-food / gimbap-oriented images.
    - Card 02 retained the Korean drink-fridge image.
  - Verification:
    - `python -m py_compile .claude\skills\cardnews\scripts\html-to-png.py` passed.
    - `python .claude\skills\cardnews\scripts\html-to-png.py --slug 171` rendered all seven PNGs.
    - All seven public PNGs are `1080x1080`.
    - Temporary `card_*.html` files were removed after render.
    - New image IDs appear only in 171 outputs when checked against existing card-news scripts.
- Card News 171 second visual correction:
  - Feedback:
    - Card 02 and 07 were acceptable, but cards 01/03/04/05/06 used visibly non-Korean imagery.
    - EpicKor Korea explainers must prioritize Korean visuals, or at minimum culturally neutral visuals.
  - Guideline update:
    - `CLAUDE.md` and `.claude/agents/cardnews-team/AGENT.md` now require Korea-first imagery for Korea explainers.
    - Visibly foreign stock images are disallowed unless the card is explicitly an international comparison.
    - If no Korean-specific image exists, use a neutral close-up, graphic treatment, or generated/owned visual.
  - Image replacement:
    - Card 01: Korean GS25 convenience-store exterior.
    - Card 03: samgak gimbap / triangle rice ball image.
    - Card 04: Korean convenience-store sandwich image.
    - Card 05: Korean triangle gimbap image.
    - Card 06: CU convenience store in Busan.
    - Card 02 and Card 07 were kept.
  - Attribution:
    - Added `public/assets/cardnews/171/image-sources.md`.
  - Verification:
    - Re-rendered all seven cards, then re-rendered card 06 after replacing a weak image.
    - All seven final PNGs are `1080x1080`.
    - Temporary HTML files were removed.
    - Checked old non-Korean Pexels IDs no longer appear in public card-news scripts.
- Card News 171 cover title tweak:
  - Feedback:
    - On card 01, separate `KOREAN` from `CONVENIENCE STORE` and add a color point.
  - Update:
    - Card 01 main title now uses `<span style="color:#C9A84C">KOREAN</span>\nCONVENIENCE STORE\nbreakfast is not fancy.`
    - Re-rendered only `card_01.png`.
    - Copied the updated `card_01.png` and `script.md` into `public/assets/cardnews/171/`.
  - Deployment/verification:
    - Commit: `09c8308 Adjust breakfast card cover title`.
    - Vercel production deploy reached `Ready`.
    - Public checks passed:
      - `https://www.epickor.com/assets/cardnews/171/card_01.png` returned `200`.
      - `https://www.epickor.com/assets/cardnews/171/script.md` contains the gold `KOREAN` span.

## Latest Update - 2026-05-07 Reels 170 Motion Card Experiment

- Task: Add a less-static Reels format where about half of the Reel uses moving 9:16 card-news/PPT-style inserts over approved background images.
- Follow-up content pipeline:
  - Added new topic queue item ID 31:
    - `Korean Convenience Store Breakfast: What Locals Actually Buy`
    - generated slug `171`
  - Ran research with network access:
    - `output/research/171_research.json`
    - 5 sources, 3 image candidates, 5 fact candidates.
  - Generated writer brief:
    - `output/drafts/171_writer-brief.md`
  - Wrote private draft:
    - `output/drafts/171_draft.md`
    - copied to `content/blog/171.md` with `visibility: "private"` for local preview.
  - Automated review passed:
    - `output/review/171_review.json`
    - SEO 100/100.
    - Reviewer word count 2,188.
    - H2 sections 7, images 2, FAQ Q&A 5.
  - Build passed after adding the draft:
    - `npm.cmd run build`
  - Local preview checks:
    - `http://localhost:4002/preview/171` returned 200.
    - Preview HTML contains the title, `triangle gimbap`, and Pexels image URLs.
    - `http://localhost:4002/blog/171` returns 404 because the post is correctly private.
  - Current gate:
    - Human review of private preview `/preview/171`.
    - If approved, publish slug 171.
- Follow-up fix:
  - Representative reported that approve buttons did not work on `http://localhost:4002/reels-review/170`.
  - Root cause was `next start` serving the page in production mode, where local write APIs were blocked unless `ALLOW_REELS_REVIEW_WRITE=true`.
  - API now permits write requests from localhost hosts while keeping non-local production writes blocked.
  - Status messages now show before the finalized-state panel so save failures are visible.
  - Approval API was tested with `motion-card-02`: approve returned `200`, then the card was reset to `pending`.
- Motion card design adjustment:
  - Cards now vary by layout rather than sharing one repeated card shell:
    - stacked list
    - three-step quick-start
    - menu-board
    - checklist
  - Internal production notes in card footers were replaced with audience-facing footer text.
  - Additional still-frame QA rendered:
    - `output/reels/170/render/qa-v006-motion-card-03.png`
    - `output/reels/170/render/qa-v006-motion-card-07.png`
- Baseline preservation:
  - Accepted Reels 170 v005 remains the current final baseline:
    - `output/reels/170/render/epickor-reel-170-v005.mp4`
  - New work is a v006 experiment path, not a replacement until human review approves it.
- Added motion-card manifest:
  - `output/reels/170/motion-cards.json`
  - Cards planned for scenes 2, 3, 5, and 7.
  - Planned card duration is about 20.4 seconds out of the 38.9 second v005 timing, close to the requested 50% mix.
  - Each card uses a 50% black overlay over the approved scene background.
- Review dashboard update:
  - `/reels-review/170` now includes a Motion Card Review section.
  - The section shows 9:16 previews, background image, overlay, motion preset, duration, and approve/revise buttons.
  - API route `/api/reels/170/visuals` now returns and updates motion-card review status.
- Remotion update:
  - `build-remotion-props.mjs` reads optional `motion-cards.json`.
  - `ReelComposition.tsx` renders a live `MotionCardLayer` for matching scenes instead of static card PNGs.
  - Motion-card scenes replace the regular central caption/typography layer so the screen does not become overcrowded.
- Verification:
  - `node --check .claude/skills/reels/scripts/build-remotion-props.mjs`: passed.
  - `npx tsc --noEmit`: passed.
  - `npm.cmd run build`: passed.
  - `npm run reels:props -- --slug 170 --audio-version v005`: passed.
  - `npm run reels:render -- --slug 170 --audio-version v005 --dry-run`: passed and generated `output/reels/170/remotion-props-render-v006.json`.
  - Remotion compositions passed with `--public-dir public/assets/reels/170`.
  - Still-frame QA rendered:
    - `output/reels/170/render/qa-v006-motion-card-02.png`
    - `output/reels/170/render/qa-v006-motion-card-05.png`
  - Local dashboard checked at:
    - `http://localhost:4002/reels-review/170`
- Current gate:
  - Human review should open the dashboard and approve/revise the four motion cards.
  - If approved, render `epickor-reel-170-v006.mp4` and watch through for pacing, readability, and whether the card inserts feel helpful rather than too dense.
- Render follow-up:
  - Human approved all four motion cards.
  - Rendered:
    - `output/reels/170/render/epickor-reel-170-v006.mp4`
  - Render input:
    - `output/reels/170/remotion-props-render-v006.json`
  - ffprobe passed:
    - H.264 video, 1080x1920, 30fps.
    - AAC audio.
    - Duration: 38.677333 seconds.
    - Size: 23,577,650 bytes, about 23.6 MB.
  - Current gate is human watch-through for whether v006 improves pacing and visual interest over v005 without becoming too dense.
- v007 revision after human feedback:
  - Feedback:
    - Four motion cards are too many; use three.
    - Reveals should track narration more gradually.
    - Cards need structurally different styles, not just color changes.
    - Keep one boxed/menu-like style, but allow other cards to be non-box layouts.
    - Build about five reusable templates and let template selection happen alongside scene/background review.
  - Updated motion-card plan:
    - `output/reels/170/motion-cards.json`
    - Scene 2: `radial_burst`
    - Scene 5: `menu_board`
    - Scene 7: `split_checklist`
    - Scene 3 motion card removed.
  - Added template library:
    - `output/reels/170/motion-card-templates.json`
    - Templates: `editorial_box`, `kinetic_steps`, `menu_board`, `radial_burst`, `split_checklist`.
  - Dashboard/API update:
    - `/api/reels/170/visuals` returns three motion cards and five templates.
    - Template update action saves the selected template to `motion-cards.json` and resets that card to `pending`.
    - `/reels-review/170` shows template selection buttons on each motion-card preview.
  - Remotion update:
    - `ReelComposition.tsx` now renders structurally different template components.
    - Item reveals use scene-duration based timing so list/chip/check items enter more gradually with narration.
  - Verification:
    - `npx tsc --noEmit`: passed.
    - `npm.cmd run build`: passed.
    - `npm run reels:render -- --slug 170 --audio-version v005 --dry-run`: passed and prepared `output/reels/170/remotion-props-render-v007.json`.
    - Still frames rendered:
      - `output/reels/170/render/qa-v007-motion-card-02.png`
      - `output/reels/170/render/qa-v007-motion-card-05.png`
      - `output/reels/170/render/qa-v007-motion-card-07.png`
  - Current gate:
    - Human review of the three v007 motion cards and template choices.
    - If approved, render `output/reels/170/render/epickor-reel-170-v007.mp4`.
- v007 shape/line-break correction after screenshot feedback:
  - Feedback:
    - The three review previews still felt like one repeated dark-card format with color changes.
    - Keep one boxed/card format only; the other two should reinterpret the content as logic, shapes, or process.
    - English line breaks must be intentional and not awkward.
  - Updates:
    - `motion-cards.json` now includes explicit `headlineLines`, `subheadLines`, and `footerLines`.
    - Scene 2 is now a concept-map/radial-chip motion (`PC BANG / MEANS / MORE` with `PLAY`, `EAT`, `WATCH`, `HANG OUT` chips).
    - Scene 5 remains the single boxed/menu-board style.
    - Scene 7 is now a vertical etiquette-process rail with staggered action rows.
    - `/reels-review/170` dashboard previews now render template-specific structures instead of one generic dark card shell.
    - Remotion uses the same explicit line stacks for the rendered motion cards.
  - Verification:
    - `npx.cmd tsc --noEmit`: passed.
    - `npm.cmd run build`: passed.
    - `npm.cmd run reels:render -- --slug 170 --audio-version v005 --dry-run`: passed and refreshed `output/reels/170/remotion-props-render-v007.json`.
    - Remotion still QA passed with slug-local public dir:
      - `output/reels/170/render/qa-v007-motion-card-02.png`
      - `output/reels/170/render/qa-v007-motion-card-05.png`
      - `output/reels/170/render/qa-v007-motion-card-07.png`
  - Current gate:
    - Human review the refreshed dashboard/stills, approve the three motion cards, then render `output/reels/170/render/epickor-reel-170-v007.mp4`.
  - Render follow-up:
    - Human approved all three v007 motion cards.
    - Rendered `output/reels/170/render/epickor-reel-170-v007.mp4`.
    - Render input: `output/reels/170/remotion-props-render-v007.json`.
    - ffprobe passed: H.264 video, 1080x1920, 30fps; AAC audio; duration 38.677333 seconds; size 26,486,866 bytes.
    - Dashboard UX clarification: `Finalize visual review` is the image-selection finalization gate and remains disabled after `visuals_approved`; a new `motion_cards_approved` status panel now shows that the motion-card pass is render-ready.
    - Human confirmed v007.
    - Treat `output/reels/170/render/epickor-reel-170-v007.mp4` as the accepted motion-card candidate for Reels 170.
    - Next operational work should preserve the v007 lessons as the reusable motion-card standard before starting the next Reel/card-news task.
  - Reusable template follow-up:
    - Added default motion-card template library at `.claude/skills/reels/motion-card-templates.json`.
    - `build-remotion-props.mjs`, `/api/reels/{slug}/visuals`, and `/reels-review/{slug}` now fall back to that default library when `output/reels/{slug}/motion-card-templates.json` is absent.
    - Slug-specific template files can still override the defaults.
    - `render-reel.mjs` now prints child-process spawn errors before exiting so Remotion/Chrome launch failures are visible.
    - Documented the accepted v007 motion-card standard in `remotion/README.md` and `.claude/skills/reels/design_system.md`.
    - Verification passed: `node --check` for render/build props helpers, `npx.cmd tsc --noEmit`, `npm.cmd run build`, and `npm.cmd run reels:render -- --slug 170 --audio-version v005 --dry-run`.

## Latest Update - 2026-05-06 End-of-Day Handoff

- Session status:
  - Representative decided to pause and continue tomorrow.
  - Current working tree is clean except for the pre-existing untracked `input/` folder.
  - `output/cardnews/*/card_*.html` count is `0`.
- Pushed commits from today's working sequence:
  - `b5d457e` - Add Reels baseline pipeline and ramen card news
  - `3ec46f3` - Update ramen card news cover image
  - `a666f50` - Add ramen card news Instagram caption
  - `0a126c6` - Add emoji caption text for ramen card news
  - `1e6501f` - Add Instagram captions for card news backlog
  - `d4611d5` - Remove temporary card news HTML after render
- Card News 038 status:
  - Final publish folder:
    - `public/assets/cardnews/038/`
  - Includes:
    - `card_01.png` through `card_07.png`
    - `script.md`
    - `caption.txt`
    - `instagram-caption.md`
  - Cover was updated to reuse the Buldak flavor collage image from card 04.
  - Caption now includes restrained emoji for Instagram use.
- All completed card news folders now have upload captions:
  - `public/assets/cardnews/{003,038,064,068,071,132,135,153,159,160,168,169}/caption.txt`
  - `public/assets/cardnews/{003,038,064,068,071,132,135,153,159,160,168,169}/instagram-caption.md`
  - Matching working copies were also placed under `output/cardnews/{slug}/`.
- Card news HTML cleanup:
  - Existing `output/cardnews/*/card_*.html` files were deleted because they are render intermediates, not edit sources.
  - `.claude/skills/cardnews/scripts/html-to-png.py` now deletes temporary `card_*.html` after successful PNG render.
  - If rendering fails, the HTML is intentionally left for debugging.
  - Verified with `038 --card 01`: PNG rendered, temporary HTML removed.
- Reels 170 status:
  - Final accepted render remains:
    - `output/reels/170/render/epickor-reel-170-v005.mp4`
  - Future Reels should follow the accepted v005 standard:
    - 3-part ElevenLabs `eleven_turbo_v2` narration for ~35-45 sec Reels.
    - Context-aware caption beats.
    - Slightly proactive caption timing, v005 used a 6-frame lead at 30fps.
    - Designed thumbnail-style first scene.
    - Clean `epicKor.com` outro.
    - Versioned render filenames; do not overwrite candidates.
  - Generic render helper exists:
    - `npm run reels:render -- --slug 170 --audio-version v005`
  - The helper uses slug-local Remotion public dir to avoid copying the whole site `public/` folder.
- Operating rule updates:
  - `CLAUDE.md` now says completion replies should naturally include the next recommended move.
  - Future next-task recommendations should list priority 1/2/3 with reason, impact, and blockers.
- Next recommended work for tomorrow:
  1. Write a new blog post: **Korean Convenience Store Breakfast: What Locals Actually Buy**.
     - Reason: good search potential, strong food/travel utility, easy future card-news/Reels conversion.
     - Avoid overlap: existing Isaac Toast, Deli Manjoo, and ramen posts are adjacent but not duplicate.
  2. Alternative new post: **Seoul Subway Etiquette: The Quiet Rules Tourists Miss**.
     - Reason: evergreen travel utility and good internal links from Deli Manjoo/subway-related posts.
  3. Optimization fallback: monetize/cleanup `/blog/160` or `/blog/153`.
     - Reason: both have GSC signal and practical commercial angles, but this is lower priority than restarting the new-post pipeline.

## Latest Update - 2026-05-06 Card News 038 Caption Package / Next-Reply Rule Save

- Task: Continue after the representative asked to proceed with the recommended next actions.
- Saved operating behavior:
  - Updated `CLAUDE.md` so normal completion replies should naturally include the next recommended move without waiting for the representative to ask.
- Card News 038 upload support:
  - Created `output/cardnews/038/instagram-caption.md`.
  - Includes:
    - Primary Instagram caption.
    - Short caption variant.
    - Hashtag set.
    - Posting note.
- Current next operational step:
  - Push the completed local commits to `origin/master`.
  - Then use `public/assets/cardnews/038/` plus `output/cardnews/038/instagram-caption.md` for Instagram upload.

## Latest Update - 2026-05-06 Priority 1/2/3 Execution

- Task: Execute the agreed next-work sequence in priority order after Reels 170 v005 was accepted.
- Priority 1 - Reels 170 final baseline save/stabilization:
  - Confirmed Reels 170 v005 remains the accepted MVP baseline.
  - Current final render remains:
    - `output/reels/170/render/epickor-reel-170-v005.mp4`
  - Preserved the accepted standard in `CLAUDE.md` and this handoff.
- Priority 2 - Card News 038:
  - Created `output/cardnews/038/script.md`.
  - Rendered 7 PNG cards:
    - `output/cardnews/038/card_01.png`
    - `output/cardnews/038/card_02.png`
    - `output/cardnews/038/card_03.png`
    - `output/cardnews/038/card_04.png`
    - `output/cardnews/038/card_05.png`
    - `output/cardnews/038/card_06.png`
    - `output/cardnews/038/card_07.png`
  - Copied publish-ready files to:
    - `public/assets/cardnews/038/`
  - Used only source-post images from `public/assets/images/posts/038/`; no Pexels or external images were needed.
  - Visual QA performed by Codex:
    - Checked all rendered cards for image relevance, readable text, and `EPICKOR.COM` watermark presence.
    - Adjusted cards 3 and 6 from split image layouts to top-image layouts to avoid awkward source-caption cropping.
    - Reduced final CTA background opacity so text remains readable.
- Priority 3 - Reels pipeline improvement:
  - Added generic render helper:
    - `.claude/skills/reels/scripts/render-reel.mjs`
  - Added `npm run reels:render`.
  - The helper:
    - Builds props unless `--skip-props` is passed.
    - Auto-selects the next non-overwriting render version, such as `v006`.
    - Refuses to overwrite an existing render.
    - Creates render-specific props with asset paths rewritten for slug-local Remotion public roots.
    - Passes `--public-dir public/assets/reels/{slug}` so Remotion does not copy the whole site `public/` directory during regular renders.
  - Updated `remotion/Root.tsx` with a reusable `EpicKorReel` composition while keeping legacy `EpicKorReel170`.
  - Updated `remotion/README.md` and `.claude/skills/reels/scripts/remotion-plan.md`.
- Verification:
  - `node --check .claude/skills/reels/scripts/render-reel.mjs` passed.
  - `npm run reels:render -- --slug 170 --audio-version v005 --dry-run` passed and selected `output/reels/170/render/epickor-reel-170-v006.mp4`.
  - `npx remotion compositions remotion/Root.tsx --props output/reels/170/remotion-props-render-v006.json --public-dir public/assets/reels/170` passed and listed:
    - `EpicKorReel`
    - `EpicKorReel170`

## Latest Update - 2026-05-06 Next-Task Priority Recommendation Rule

- Task: Preserve the user's preference for how Codex/Claude should recommend follow-up work after a task is completed.
- Updated `CLAUDE.md` under `Handoff And Strategy Check Rules`.
- New rule:
  - After completing a meaningful EpicKor task, recommend the next work as priority 1, 2, and 3.
  - Each priority should include the reason, expected impact, and any dependency or blocker.
  - Priority 1 should be the safest/highest-leverage next move, not simply the newest idea.
- Current implication:
  - Future next-task recommendations should combine `HANDOFF.md`, latest weekly strategy, recent git/worktree state, monetization, visual/social potential, and operational risk.

## Latest Update - 2026-05-06 Reels 170 Final Accepted Baseline

- Task: Record the accepted Reels 170 final candidate and preserve the production standard for future Reels.
- Final accepted render:
  - `output/reels/170/render/epickor-reel-170-v005.mp4`
- Accepted baseline for future Reels:
  - Generate narration in short segments, around three parts for a 35-45 second Reel.
  - Use context-aware subtitle beats instead of mechanical word chunks.
  - Avoid isolated fragments such as `is`, `and`, or `to your` unless intentionally used as a typography moment.
  - Subtitle timing should be slightly proactive; the v005 baseline uses a 6-frame lead at 30fps.
  - The first scene should be designed strongly enough to work as a thumbnail when the hook supports it.
  - Keep numbered/versioned render filenames and do not overwrite review candidates.
  - Add a clean `epicKor.com` outro when appropriate.
- Updated records:
  - `CLAUDE.md`
  - `output/reels/170/review.md`
  - `HANDOFF.md`
- Current gate:
  - Reels 170 can be treated as the current MVP quality baseline.
  - Next Reels work should start from the v005 timing, caption, voice segmentation, thumbnail, and outro rules.

## Latest Update - 2026-05-06 Reels 170 Caption Lead / Final CTA Update

- Task: Apply user feedback after v004.
- User feedback:
  - v004 is better, but subtitles still feel slightly delayed after narration.
  - Captions should appear a bit earlier so narration lands right after the text appears.
  - Final/outro sentence line break still felt awkward.
- Corrections:
  - Updated `remotion/ReelComposition.tsx` caption timing with a 6-frame lead, about 0.2 seconds at 30fps.
  - Changed final CTA narration to: `Read the full Korean PC bang guide on EpicKor.com.`
  - Added v005 text files:
    - `output/reels/170/voiceover-v005-part-01.txt`
    - `output/reels/170/voiceover-v005-part-02.txt`
    - `output/reels/170/voiceover-v005-part-03.txt`
  - Copied v003 part 1/2 audio to v005 part 1/2 because their text did not change.
  - Regenerated v005 part 3 audio with ElevenLabs `eleven_turbo_v2`.
  - Built props with `--audio-version v005`.
- Render:
  - `output/reels/170/render/epickor-reel-170-v005.mp4`
  - Size: about 25.5 MB.
  - ffprobe: H.264 video, AAC audio, 38.869333 seconds.
- QA:
  - `output/reels/170/render/qa-v005-frame-034.png` confirms the revised final CTA line flow.
  - `output/reels/170/render/qa-v005-frame-037.png` confirms the `epicKor.com` outro remains clean.
- Current gate:
  - Human watch-through for whether the 6-frame caption lead feels snappy without feeling too early.
  - If more exact sync is required, use timestamped TTS/forced alignment.

## Latest Update - 2026-05-06 Reels 170 Three-Part Voice/Thumbnail Render

- Task: Rebuild Reels 170 again after user feedback on remaining narration/subtitle mismatch and render versioning.
- User feedback:
  - Narration and subtitles were closer than before, but still mismatched in many places.
  - Generate narration in about three parts instead of one full text block to reduce slow/uneven voice behavior.
  - Caption beats should preserve context; avoid fragments like `is` appearing alone.
  - First sentence should work as a designed thumbnail-style image.
  - Add final `epicKor.com` outro.
  - New renders must use numbered filenames instead of overwriting existing mp4s.
- Audio changes:
  - Split narration into three text files:
    - `output/reels/170/voiceover-v003-part-01.txt`
    - `output/reels/170/voiceover-v003-part-02.txt`
    - `output/reels/170/voiceover-v003-part-03.txt`
  - Generated three ElevenLabs `eleven_turbo_v2` audio files:
    - `output/reels/170/audio/narration-v003-part-01.mp3`
    - `output/reels/170/audio/narration-v003-part-02.mp3`
    - `output/reels/170/audio/narration-v003-part-03.mp3`
    - and matching public copies under `public/assets/reels/170/audio/`.
- Code changes:
  - `.claude/skills/reels/scripts/elevenlabs-tts.mjs` now supports `--output` so TTS files can be versioned.
  - `.claude/skills/reels/scripts/build-remotion-props.mjs` now accepts `--audio-version v003`, detects three part files, creates `audioSegments`, allocates scene durations within each audio part, and uses context-aware caption beat overrides.
  - `remotion/types.ts` supports `audioSegments` and `outro`.
  - `remotion/ReelComposition.tsx` supports segmented audio, a designed thumbnail-style first scene, a centered `epicKor.com` outro, and a transition-opacity fix.
- Render outputs:
  - `output/reels/170/render/epickor-reel-170-v003.mp4` was generated first.
  - QA found a dark transition boundary in `v003`.
  - Fixed the transition opacity and rendered final candidate:
    - `output/reels/170/render/epickor-reel-170-v004.mp4`
    - Size: about 26 MB.
    - ffprobe: H.264 video, AAC audio, 39.594667 seconds.
- QA frames:
  - `output/reels/170/render/qa-v004-frame-001.png`
  - `output/reels/170/render/qa-v004-frame-014.png`
  - `output/reels/170/render/qa-v004-frame-028.png`
  - `output/reels/170/render/qa-v004-frame-038.png`
- Current gate:
  - Human watch-through of `epickor-reel-170-v004.mp4` for exact subtitle feel and voice pacing.
  - If more precision is still needed, move to timestamped TTS or forced alignment rather than proportional caption timing.

## Latest Update - 2026-05-06 Reels 170 Turbo Voice/Subtitle Correction

- Task: Rebuild Reels 170 after user feedback on voice quality, subtitle sync, and text placement.
- User feedback:
  - The narration generated with `eleven_multilingual_v2` was poor.
  - Narration and subtitles did not match closely enough.
  - Narration subtitles should be centered on screen.
  - ONS typography should move down toward the lower area where captions were previously shown.
- Corrections:
  - Changed `.env.local` `ELEVENLABS_MODEL_ID` to `eleven_turbo_v2`.
  - Regenerated ElevenLabs narration:
    - `output/reels/170/audio/narration.mp3`
    - `public/assets/reels/170/audio/narration.mp3`
  - Updated `.claude/skills/reels/scripts/build-remotion-props.mjs` so props are based on generated audio duration.
    - It tries `ffprobe` first.
    - If `ffprobe` cannot be spawned, it estimates duration from the ElevenLabs `mp3_44100_128` output bitrate.
    - Scene durations are now reallocated by narration text weight instead of fixed 42-second scene timings.
  - Updated `remotion/ReelComposition.tsx`:
    - Narration captions are now centered.
    - ONS typography beats are now positioned in the lower area.
- Rendered replacement:
  - `output/reels/170/render/epickor-reel-170.mp4`
  - Size: about 28.1 MB.
  - ffprobe check: H.264 video, AAC audio, 40.320 seconds.
- QA:
  - JSON parse check passed for `voice-status.json` and `remotion-props.json`.
  - Extracted QA frames:
    - `output/reels/170/render/qa-frame-003.png`
    - `output/reels/170/render/qa-frame-017.png`
    - `output/reels/170/render/qa-frame-031.png`
  - Visual spot check: center captions and lowered ONS placement are reflected in rendered frames.
- Current gate:
  - Human watch-through is still needed for voice tone and exact subtitle feel.
  - If voice timing is still not precise enough, next improvement should use ElevenLabs timestamped generation or a separate forced-alignment step instead of proportional scene timing.

## Latest Update - 2026-05-06 Reels 170 Audio Render

- Task: Continue Reels 170 MVP after visual approval by generating ElevenLabs narration and rendering the first audio+video mp4.
- Environment status:
  - `.env.local` now has present values for `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`, and `ELEVENLABS_MODEL_ID`.
  - Corrected `ELEVENLABS_MODEL_ID` from `Eleven_Turbo_v2` to `eleven_multilingual_v2` because ElevenLabs returned `model_not_found` for the previous value.
- Commands run:
  - `npm run reels:tts -- --slug 170 --text output/reels/170/voiceover.txt`
  - `npm run reels:props -- --slug 170`
  - `npm run reels:render:170`
- Generated audio:
  - `output/reels/170/audio/narration.mp3`
  - `public/assets/reels/170/audio/narration.mp3`
- Generated render:
  - `output/reels/170/render/epickor-reel-170.mp4`
  - Size: about 29 MB.
  - ffprobe check: H.264 video, AAC audio, 42.048 seconds.
- Updated files:
  - `.env.local`
  - `output/reels/170/voice-status.json`
  - `output/reels/170/remotion-props.json`
  - `output/reels/170/review.md`
  - `HANDOFF.md`
- Current gate:
  - Human QA should watch the rendered mp4 for voice tone, crop, motion, subtitle readability, and whether any gaming visual feels too generic or non-Korean.
  - Remotion still copies the full `public/` directory during render, around 700 MB, so asset handling remains the next pipeline optimization.
- Agent roles performed by Codex:
  - Reels Voice Agent: generated ElevenLabs narration and fixed model ID configuration.
  - Reels Remotion Agent: rebuilt props and rendered the first audio+video mp4.
  - Reels QA Agent: verified output codecs/duration and recorded the next human review gate.
- Next:
  - Human watch-through of `output/reels/170/render/epickor-reel-170.mp4`.
  - If approved, decide whether to package/export for Instagram posting or first optimize Remotion public asset handling.

## Latest Update - 2026-05-04 Reels Production MVP Scaffold

- Task: Start a parallel Reels production pipeline for newly published posts while the 30-card-news Instagram revival backlog continues.
- Strategic context:
  - Card News Team should keep producing the historical high-signal carousel backlog.
  - Reels Team is a separate new-post-to-video track designed to turn recently published EpicKor posts into 9:16 vertical Reels.
  - The first goal is a reviewable MVP, not full automation.
- First MVP target:
  - `/blog/170` Korean PC Bang Culture: Why Gaming Cafes Matter.
  - Selected because it is the newest published post in the handoff record, not a historical card-news backlog item, and has a clear short-form hook: PC bang is not just an internet cafe.
- Added operating docs:
  - `.claude/agents/reels-team/AGENT.md`
  - `.claude/skills/reels/design_system.md`
  - Updated `CLAUDE.md` with Reels MVP strategy and `output/reels/{slug}/` path.
  - Updated Strategy, Research, and Reviewer agent docs with Reels-specific rules.
- Created Reels 170 project files:
  - `output/reels/170/strategy.md`
  - `output/reels/170/script.md`
  - `output/reels/170/voiceover.txt`
  - `output/reels/170/scenes.json`
  - `output/reels/170/visual-candidates.json`
  - `output/reels/170/approved-visuals.json`
  - `output/reels/170/review.md`
- Dashboard MVP:
  - Added local review route `/reels-review/170`.
  - Added API route `/api/reels/170/visuals`.
  - Dashboard shows scene number, narration, caption, visual intent, motion, duration, image candidates, and approve/reject/replace controls.
  - Approval writes back to `scenes.json`, `visual-candidates.json`, and `approved-visuals.json`.
- ElevenLabs/Remotion scaffold:
  - Added `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`, and `ELEVENLABS_MODEL_ID` to `.env.local.example`.
  - Added `npm run reels:voices` and `npm run reels:tts` helpers.
  - Added `.claude/skills/reels/scripts/remotion-plan.md`; Remotion package installation and final rendering are intentionally deferred until visual approval is working.
- Current review notes:
  - Scene 5 needs a better PC bang food image before final rendering.
  - The current MVP uses three source-post Pexels images heavily; final production should reduce repetition with additional approved candidates or distinct crops.
  - No ElevenLabs API call was made yet because `.env.local` currently has no ElevenLabs variables.
- Verification:
  - JSON parse check passed for Reels manifests.
  - `npm.cmd run build` passed.
  - Local dev check returned 200 for `http://localhost:4000/reels-review/170`.
  - Local API check returned 200 for `http://localhost:4000/api/reels/170/visuals`.
- Agent roles performed by Codex:
  - Reels Strategy Agent: selected MVP target.
  - Reels Script Agent: wrote the first 8-scene narration.
  - Reels Visual Research Agent: mapped source-post image candidates and flagged missing food visual.
  - Reels Visual Reviewer Agent: created the dashboard approval gate.
  - Reels Motion Agent: assigned initial motion presets.
  - Reels Voice Agent: scaffolded ElevenLabs helpers without exposing secrets.
  - Reels Remotion Agent: documented the planned composition scaffold.
  - Reels QA Agent: created initial review notes and verified build/dashboard.
- Next:
  - Use `/reels-review/170` to approve/reject the current candidate images.
  - Source a direct PC bang food image for scene 5.
  - After visual approval feels comfortable, install Remotion packages and build the first 1080x1920 composition.

### Follow-up - 2026-05-04 Reels 170 Scene 5 Food Candidates

- Task: Continue the Reels 170 MVP by resolving the weakest visual slot: Scene 5, PC bang food.
- Research action:
  - Ran Pexels searches for `ramen gaming desk food` and `noodles computer desk`.
  - No local EpicKor-owned PC bang food image was found under `public/assets/images/posts/170/`.
- Updated files:
  - `output/reels/170/scenes.json`
  - `output/reels/170/visual-candidates.json`
  - `output/reels/170/review.md`
- Added Scene 5 candidates:
  - `170-5-a`: noodles beside a laptop/workstation; strongest desk/seat-function match but not Korea-specific.
  - `170-5-b`: Korean ramen close-up; strongest ramyeon/Korea food match but lacks computer context.
  - `170-5-c`: dark instant ramen close-up; mood-compatible backup but least context-specific.
- Verification:
  - Reels JSON parse check passed.
  - Local API `http://localhost:4000/api/reels/170/visuals` returned 200 and included `170-5-a` and `170-5-b`.
- Current gate:
  - Human visual approval is still required at `http://localhost:4000/reels-review/170`.
  - Final Remotion rendering remains blocked until every scene has one approved image.

### Follow-up - 2026-05-04 Reels 170 Visual Review Completion UX

- User feedback:
  - The dashboard allowed approve/reject/replace, but had no completion button or next-step signal after review.
- Current human review result:
  - Scenes 1, 2, 3, and 5 are approved.
  - Scenes 4, 6, 7, and 8 are marked `replace_needed`.
- UX correction:
  - Added `Finalize visual review` button to `/reels-review/{slug}`.
  - The button stays disabled until every scene has one approved visual.
  - Finalize API returns a clear 409 with missing scene numbers when review is incomplete.
- Replacement candidates added:
  - Scene 4: `170-4-c`, `170-4-d` for fresh social gaming/hangout visuals.
  - Scene 6: `170-6-b`, `170-6-c` for wider gaming-room/culture-scale visuals.
  - Scene 7: `170-7-b`, `170-7-c` for quieter visitor/seat visuals.
  - Scene 8: `170-8-b`, `170-8-c` for CTA background visuals.
- Verification:
  - Reels JSON parse check passed.
  - `npm.cmd run build` passed.
  - Local API finalize test correctly returned 409 and listed missing scenes `4, 6, 7, 8`.
  - Local dashboard returned 200 and includes `Finalize visual review` plus new replacement candidate IDs.
- Next:
  - User should approve one replacement candidate for scenes 4, 6, 7, and 8.
  - Then click `Finalize visual review`.
  - After finalization, proceed to audio setup and Remotion composition scaffold.

### Follow-up - 2026-05-04 Reels 170 Ranking Dashboard Redesign

- User feedback:
  - One image per scene will make the final Reel feel too static.
  - The dashboard images were too large and hard to scan.
  - Captions should not drift away from narration; subtitles should follow the narration wording.
  - Strong phrases should sometimes become typography moments.
  - `Finalize visual review` should appear at both the top and bottom.
  - TravelHippo can be used as a read-only reference for Remotion and ElevenLabs patterns.
- Reference read-only review:
  - Read `D:\dev\travelhippo\CLAUDE.md`, `scripts/generate_narration.py`, `scripts/build_props.py`, and Remotion subtitle/type files.
  - Did not modify anything under `D:\dev\travelhippo`.
  - Useful lessons copied conceptually: ASCII Remotion asset paths, `selected assets -> composition props`, ElevenLabs voice settings, and synced subtitle style.
- Dashboard changes:
  - Replaced one-image approval flow with Rank 1-5 buttons per candidate.
  - Reduced thumbnail size to a compact scene-scanning layout.
  - Scene narration now appears horizontally above the candidate image grid.
  - `Finalize visual review` appears at top and bottom.
  - Finalization now requires at least two ranked visuals per scene.
- Manifest changes:
  - `output/reels/170/scenes.json` now includes `subtitleText`, `subtitleStyle`, `selectedImages`, and `typographyBeats`.
  - `output/reels/170/visual-candidates.json` now has about five candidates per scene and `rank` fields.
  - Prior approved choices for scenes 1, 2, 3, and 5 were preserved as Rank 1.
  - Scenes 4, 6, 7, and 8 have fresh replacement candidates ready for ranking.
- Voice/env changes:
  - Added ElevenLabs placeholders to `.env.local` without printing secret values.
  - Added TravelHippo-style ElevenLabs voice settings: stability, similarity boost, style, and speaker boost.
- Verification:
  - Reels JSON parse check passed.
  - `npm.cmd run build` passed.
  - Local dashboard returned 200 and includes ranking/finalize UI plus new candidates.
- Next:
  - Rank at least two images per scene in `/reels-review/170`.
  - Click bottom or top `Finalize visual review`.
  - After finalization, generate ElevenLabs narration and build the first Remotion composition using multiple ranked images per scene.

## Latest Update - 2026-05-03 Card News 132 Visual/Name Correction

- Task: Apply user review feedback to Card News 132 after initial save.
- User feedback:
  - The carousel became too abstract and removed too many player names from the article/source context.
  - Card 02 did not show Son Heung-min's face clearly.
  - Card 01 would be stronger with a natural globe and Taegeukgi design element.
  - Player photos should have small name-tag labels so viewers can tell who is being shown without overloading the main copy.
- Corrections:
  - Added renderer support for `image_label:` and a small tag-style overlay on vertical image panels.
  - Replaced Card 01 cover with `cardnews-132-global-taegeuk-cover.png`, a dark stadium/tunnel image with subtle globe and Taegeukgi elements.
  - Replaced Card 02 image with `son-heung-min-commons-2023.jpg` so Son Heung-min's face is clearly visible.
  - Added player/source-context tags:
    - Card 02: `Son Heung-min`
    - Card 03: `Kim Ji-soo`
    - Card 04: `Lee Jae-sung`
    - Card 05: `Oh Hyeon-gyu`
  - Revised Card 03 copy to explicitly mention Kim Min-jae and Lee Kang-in from the article context.
- Attribution:
  - Added `public/assets/images/posts/132/ATTRIBUTION.md` for the Wikimedia Commons Son Heung-min image.
- Renderer/Reviewer role:
  - `python .claude/skills/cardnews/scripts/html-to-png.py --slug 132` generated 7/7 PNGs.
  - Copied updated rendered PNGs into `public/assets/cardnews/132/`.

## Latest Update - 2026-05-03 Card News 132 Final Save

- Task: Continue Instagram revival card-news production with priority 7 from the 30-item backlog.
- Target:
  - `/blog/132` Global Icons: Why Korean Footballers are Dominating the World Stage.
  - Reels signal from PDF audit: `Korean Football Stars in Europe`, approximately 116K views.
- User direction:
  - If the target article already has good source imagery, use it where it fits.
  - Apply this as a general card-news production rule going forward, not only for `/blog/038`.
- Card News 132 output:
  - `output/cardnews/132/script.md`
  - `output/cardnews/132/card_01.png` through `output/cardnews/132/card_07.png`
- Saved final tracked assets to:
  - `public/assets/cardnews/132/card_01.png` through `public/assets/cardnews/132/card_07.png`
  - `public/assets/cardnews/132/script.md`
  - Generated support images under `public/assets/images/posts/132/`:
    - `cardnews-132-stadium-tunnel.png`
    - `cardnews-132-youth-training.png`
    - `cardnews-132-night-fans.png`
- Card News Team role:
  - Built a 7-card carousel around the hook: Korean football is now a global signal in Europe.
  - Flow: global cover hook -> Son effect -> next wave -> player range -> Europe beyond one league -> youth/system explanation -> full guide CTA.
  - Used the article's existing football/player images where they were contextually strong, with crop/zoom adjustments to reduce embedded source text.
- Renderer/Reviewer role:
  - Ran global duplicate-image check across `public/assets/cardnews/*/script.md`: `NO_DUPLICATE_IMAGES`.
  - `python .claude/skills/cardnews/scripts/html-to-png.py --slug 132` generated 7/7 PNGs.
  - Visually checked rendered cards and adjusted source-image crops where embedded original captions were too visible.
- Next:
  - Continue Instagram revival backlog with priority 8 `/blog/038` Korean ramen you must try.
  - For `/blog/038`, first inspect article images and use any strong in-post source images before generating or sourcing replacements.

## Latest Update - 2026-05-03 Card News 003 Cover Image Replacement

- Task: Apply follow-up user review feedback to Card News 003 Card 01.
- User feedback:
  - Card 01 intro still did not feel changed enough.
  - Replace the image itself with a simple dark four-person silhouette visual; the existing `/blog/003` cover image no longer needs to be used.
- Corrections:
  - Generated a new square dark cinematic four-person silhouette image with no text, no logos, and no recognizable faces.
  - Saved the project asset to `public/assets/images/posts/003/cardnews-003-four-silhouettes.png`.
  - Updated Card 01 to use the new silhouette image.
  - Re-rendered `output/cardnews/003/card_01.png` and copied it to `public/assets/cardnews/003/card_01.png`.
- Renderer/Reviewer role:
  - Visually checked Card 01 after render: four dark silhouettes read clearly behind the headline, with no embedded source text.

## Latest Update - 2026-05-03 Card News 003 Second Visual Correction

- Task: Apply follow-up user review feedback to Card News 003.
- User feedback:
  - Card 01 should use the existing image as the four black-silhouette group visual.
  - Card 03 is good and should remain the model.
  - Cards 04-06 should avoid face-cropping by using the same side-vertical-image treatment as Card 03, with alternating image sides.
- Corrections:
  - Card 01 now uses the existing cover image with a centered crop and lower opacity so the four-silhouette composition reads more clearly behind the hook.
  - Added renderer layout `E`, mirroring layout `C` with the vertical image panel on the left and text on the right.
  - Cards 03-06 now alternate image side rhythm: right, left, right, left.
  - Card 04 and Card 06 moved from full/top background treatments into the new left vertical image panel layout.
  - Card 05 stays in the right vertical image panel layout and has image positioning adjusted toward the face.
- Renderer/Reviewer role:
  - `python .claude/skills/cardnews/scripts/html-to-png.py --slug 003` generated 7/7 PNGs.
  - Copied updated rendered PNGs into `public/assets/cardnews/003/`.
  - Ran global duplicate-image check across `public/assets/cardnews/*/script.md`: `NO_DUPLICATE_IMAGES`.

## Latest Update - 2026-05-03 Card News 003 Visual Correction

- Task: Apply user review feedback to Card News 003 visuals.
- User feedback:
  - Cards introducing the individual singers should use the existing matching video captures from `/blog/003`, not unrelated generic photos.
  - Card 01 should keep the existing cover image but adjust positioning toward the image side.
  - Card 02 should replace the previous mic/talking scene because it did not read as singing.
- Corrections:
  - Card 01 keeps `/assets/images/posts/003/d1adafad-ab6e-4a7e-8bb1-d10d6d036429.png`, with the image positioned on the left image side and opacity reduced so the embedded source text does not fight the new card copy.
  - Card 02 now uses a group singing/karaoke-style visual instead of the previous speaking-into-a-mic image.
  - Cards 03-06 now use the existing local video captures for Kim Beom-su, Naul, Park Hyo-shin, and Lee-su:
    - `/assets/images/posts/003/002_EpicKor_Snippets_%ED%9C%98%EC%88%98.mp4_20240703_143118.403.jpg`
    - `/assets/images/posts/003/002_EpicKor_Snippets_%ED%9C%98%EC%88%98.mp4_20240703_143126.700.jpg`
    - `/assets/images/posts/003/002_EpicKor_Snippets_%ED%9C%98%EC%88%98.mp4_20240703_143128.868.jpg`
    - `/assets/images/posts/003/002_EpicKor_Snippets_%ED%9C%98%EC%88%98.mp4_20240703_143130.860.jpg`
- Renderer/Reviewer role:
  - `python .claude/skills/cardnews/scripts/html-to-png.py --slug 003` generated 7/7 PNGs.
  - Copied updated rendered PNGs into `public/assets/cardnews/003/`.
  - Ran global duplicate-image check across `public/assets/cardnews/*/script.md`: `NO_DUPLICATE_IMAGES`.
- Next:
  - Commit this Card News 003 visual correction before continuing the backlog.

## Latest Update - 2026-05-03 Card News 003 Final Save

- Task: Continue Instagram revival card-news production with priority 6 from the 30-item backlog.
- Target:
  - `/blog/003` The Sociology of the Bang / Korean noraebang culture.
  - Reels signal from PDF audit: `Top 5 Songs Korean Men Sing at Karaoke`, approximately 95K views.
- Mapping:
  - Verified the audit/backlog mapping points to `content/blog/003-discover-the-icons-behind-koreas-favorite-karaoke-hits.md`.
  - Because the older blog post is more about noraebang sociology than an exact ranked song list, the carousel uses the Reel hook while avoiding unsupported exact ranking claims.
- Card News 003 output:
  - `output/cardnews/003/script.md`
  - `output/cardnews/003/card_01.png` through `output/cardnews/003/card_07.png`
- Saved final tracked assets to:
  - `public/assets/cardnews/003/card_01.png` through `public/assets/cardnews/003/card_07.png`
  - `public/assets/cardnews/003/script.md`
- Card News Team role:
  - Built a 7-card carousel around the social question: why Korean men often choose emotional, high-note ballads in noraebang.
  - Flow: cover hook -> private-room stage -> ballad rule -> high-note moment -> Kim-Na-Park-Lee vocal fantasy -> group bonding -> full noraebang guide CTA.
  - Added Korea/EpicKor angle through per-card `kicker:` text such as `KOREAN NORAEBANG CULTURE`, `KOREA PRIVATE ROOM RULE`, `KOREAN BALLAD ENERGY`, and `EPICKOR CULTURE GUIDE`.
- Visual role:
  - Used the existing `/blog/003` Reel-style Kim-Na-Park-Lee visual for the cover to preserve historical Instagram signal.
  - Used fresh Pexels karaoke/microphone/singing visuals for the supporting cards.
  - Avoided exact reuse of existing public card-news `image:` values.
- Renderer/Reviewer role:
  - Ran duplicate-image check across `public/assets/cardnews/*/script.md` before rendering: `NO_DUPLICATE_IMAGES`.
  - `python .claude/skills/cardnews/scripts/html-to-png.py --slug 003` generated 7/7 PNGs.
  - Visually opened rendered cards 01-07.
  - Confirmed no visible text overflow, `EPICKOR.COM` watermark on every card, and a coherent swipe flow.
- Next:
  - Continue Instagram revival backlog with priority 7 `/blog/132` Korean football stars in Europe after verifying the exact Reel mapping.
  - Consider committing Card News 003 assets before producing another carousel.

## Latest Update - 2026-05-03 Card News 159 Final Save

- Task: Continue Instagram revival card-news production with priority 5 from the 30-item backlog.
- Target:
  - `/blog/159` Best Places to Visit in Korea: 2026 Travel Guide.
  - Reels signal from PDF audit: `Not Seoul but Gyeongju`, approximately 93K views.
- Strategic choice:
  - Used `/blog/159` as the CTA article instead of the older `/blog/069` because 159 is the stronger current public Korea-route guide and includes Gyeongju in a first-trip itinerary context.
  - Framed the carousel around the proven Reel hook `Not Seoul? Pick Gyeongju.`
- Card News 159 output:
  - `output/cardnews/159/script.md`
  - `output/cardnews/159/card_01.png` through `output/cardnews/159/card_07.png`
- Saved final tracked assets to:
  - `public/assets/cardnews/159/card_01.png` through `public/assets/cardnews/159/card_07.png`
  - `public/assets/cardnews/159/script.md`
- Card News Team role:
  - Built a 7-card carousel around the travel-alternative hook: Gyeongju as the quieter, older Korea that complements Seoul and Busan.
  - Flow: cover hook -> why Gyeongju works -> outdoor museum feeling -> slower pace -> first-timer anchors -> Busan pairing rule -> full Korea route guide CTA.
  - Added Korea/EpicKor angle through per-card `kicker:` text such as `KOREA TRAVEL ALTERNATIVE`, `OLD KOREA SHORTCUT`, `GYEONGJU HISTORY MAP`, and `EPICKOR KOREA GUIDE`.
- Visual role:
  - Used fresh Gyeongju/Bulguksa/Pagoda/Pavilion Pexels visuals that do not repeat existing public card-news `image:` values.
  - Avoided reusing `/blog/159` article images that already overlapped with other card-news scripts.
- Renderer/Reviewer role:
  - Ran duplicate-image check across `public/assets/cardnews/*/script.md` before rendering: `NO_DUPLICATE_IMAGES`.
  - `python .claude/skills/cardnews/scripts/html-to-png.py --slug 159` generated 7/7 PNGs.
  - Visually opened rendered cards 01-07.
  - Confirmed no visible text overflow, `EPICKOR.COM` watermark on every card, relevant Gyeongju visuals, and a coherent swipe flow.
- Next:
  - Continue the Instagram revival backlog with priority 6 `/blog/003` Korean karaoke songs / noraebang culture after verifying the exact Reel mapping, or first commit the accumulated card-news asset changes so the local worktree does not keep growing.

## Latest Update - 2026-05-03 Card News Duplicate-Image Debt Cleanup

- Task: Clean the duplicate-image debt identified after Card News 068 before continuing Instagram revival production.
- Scope:
  - `public/assets/cardnews/071/script.md`
  - `public/assets/cardnews/135/script.md`
  - `public/assets/cardnews/169/script.md`
  - matching source scripts under `output/cardnews/071`, `output/cardnews/135`, and `output/cardnews/169`
- Corrections:
  - Card News 071 no longer repeats `output/cardnews/071/images/delimanjoo/delimanjoo_02.jpg` across all cards.
  - Card News 071 now uses distinct Deli Manjoo / station / brand visual treatments across cards 01-07.
  - Card News 135 no longer repeats the same Pexels URL internally.
  - Card News 169 no longer repeats the same Hongdae/Seoul Pexels URL internally.
  - The previous cross-post duplicate between 135 and 169 was removed.
- Renderer/Reviewer role:
  - Ran global duplicate-image check across `public/assets/cardnews/*/script.md`.
  - Result after cleanup: `NO_DUPLICATE_IMAGES`.
  - Re-rendered affected carousels:
    - `python .claude/skills/cardnews/scripts/html-to-png.py --slug 071`
    - `python .claude/skills/cardnews/scripts/html-to-png.py --slug 135`
    - `python .claude/skills/cardnews/scripts/html-to-png.py --slug 169`
  - Render results: 7/7 PNGs generated for 071, 135, and 169.
  - Visually checked changed cards:
    - 071 cards 01-07, with special attention to cards 02, 05, and 07 after removing subtitle-overlap frames.
    - 135 cards 02 and 07.
    - 169 cards 02 and 03.
  - Copied updated rendered PNGs to `public/assets/cardnews/071/`, `public/assets/cardnews/135/`, and `public/assets/cardnews/169/`.
- Current note:
  - `public/assets/cardnews/064/`, `068/`, `135/`, and `168/` are present as untracked folders in the local worktree, so the next git cleanup/commit should include the intended final public card-news assets before more production accumulates.
- Next:
  - Continue Instagram revival production with priority 5: Gyeongju angle.
  - Recommended target: use `/blog/159` as the CTA article and build the carousel around the proven Reel hook `Not Seoul but Gyeongju`.

## Latest Update - 2026-05-02 Card News 068 Final Save

- Task: Continue Instagram revival card-news production with priority 4 from the 30-item backlog.
- Target:
  - `/blog/068` Is Korean Difficult to Learn?
  - Reels signal from PDF audit: approximately 141K views.
- Card News 068 output:
  - `output/cardnews/068/script.md`
  - `output/cardnews/068/card_01.png` through `output/cardnews/068/card_07.png`
- Saved final tracked assets to:
  - `public/assets/cardnews/068/card_01.png` through `public/assets/cardnews/068/card_07.png`
  - `public/assets/cardnews/068/script.md`
- Card News Team role:
  - Built a 7-card carousel around the language-learning hook: Korean feels approachable at the alphabet level, then becomes interesting through sound blocks, grammar, speech levels, and context.
  - Flow: cover question -> Hangul is the easy part -> syllable-block logic -> grammar/particles -> honorific speech levels -> beginner order -> full guide CTA.
  - Added Korea/EpicKor angle through per-card `kicker:` text such as `KOREAN LANGUAGE TRUTH`, `HANGUL FIRST`, `KOREAN READING RULE`, `GRAMMAR REALITY CHECK`, and `EPICKOR LANGUAGE GUIDE`.
- Visual role:
  - Incorporated selected `/blog/068` owned motion-graphic frames on cards 01-04 because their embedded text/charts are intentional EpicKor visual assets, not random subtitle noise.
  - Kept cards 05-07 on fresh Pexels study/conversation visuals to avoid making the carousel too text-dense.
  - Tuned opacity and positioning on the motion-graphic frames so the original visual information supports the new card copy without overpowering it.
- Renderer/Reviewer role:
  - Confirmed no duplicate `image:` URLs inside 068 before and after final save.
  - Confirmed 068 image URLs do not duplicate existing public card-news scripts.
  - `python .claude/skills/cardnews/scripts/html-to-png.py --slug 068` generated 7/7 PNGs.
  - Visually opened rendered cards 01-07, then re-opened updated cards 01-04 after incorporating owned motion-graphic frames.
  - Confirmed no visible text overflow, `EPICKOR.COM` watermark on every card, and a coherent swipe flow.
- User-requested visual correction after final save:
  - Card 01: kept the owned motion-graphic cover but adjusted opacity/position/zoom so the background text feels less oversized and no image-edge gap appears.
  - Card 04: replaced the motion-graphic frame with a text-free study/discussion photo to remove English text overlap behind the headline.
  - Card 07: replaced the generic photo with a relevant owned Korean-pronunciation motion-graphic frame, tuned low enough to support the CTA.
  - Re-rendered 7/7 PNGs, visually checked cards 01, 04, and 07, copied the updated assets to `public/assets/cardnews/068/`, and reconfirmed no duplicate 068 image URLs internally or against other public card-news scripts.
- Existing duplicate-image debt found during global check:
  - `public/assets/cardnews/071/script.md` repeats `output/cardnews/071/images/delimanjoo/delimanjoo_02.jpg` across multiple cards.
  - `public/assets/cardnews/135/script.md` repeats one Pexels URL internally.
  - `public/assets/cardnews/169/script.md` repeats one Pexels URL internally.
  - `public/assets/cardnews/135/script.md` and `public/assets/cardnews/169/script.md` also share one Pexels URL.
  - These were pre-existing relative to 068 and should be cleaned before relying on a global "no duplicates" guarantee.
- Next:
  - Either clean the existing duplicate-image debt in 071/135/169, or continue backlog production with 069/159 after applying the same duplicate-image check.

## Latest Update - 2026-05-02 Card News Image Reuse Correction

- User feedback:
  - Card News 064 cards 01, 04, and 07 had weak image choices.
  - Card News 064 cards 02, 04, and 07 reused the same image, making the carousel visually repetitive.
  - Card News 168 reused several images already used in Card News 064, which is not acceptable for different post numbers.
- Corrections:
  - Updated `output/cardnews/064/script.md` and `public/assets/cardnews/064/script.md`.
  - Replaced Card News 064:
    - Card 01 cover image with a cleaner Suwon/Hwaseong fortress visual.
    - Card 04 image with a different Suwon/Hwaseong street-gate visual.
    - Card 07 CTA image with a separate Suwon city-view visual.
  - Updated `output/cardnews/168/script.md` and `public/assets/cardnews/168/script.md`.
  - Replaced Card News 168 images that overlapped with 064:
    - Card 02 subway image.
    - Card 04 hiking/gear image.
    - Card 05 post-hike food image.
    - Card 06 first-route image.
    - Card 07 CTA image.
- Render/Reviewer role:
  - Re-rendered both carousels:
    - `python .claude/skills/cardnews/scripts/html-to-png.py --slug 064`
    - `python .claude/skills/cardnews/scripts/html-to-png.py --slug 168`
  - Visually opened corrected key cards.
  - Confirmed public saved scripts for 064 and 168 have no duplicate `image:` values between them.
- Rule update:
  - Added new image uniqueness rules to `CLAUDE.md`.
  - Future card-news agents must not reuse the same image within a carousel unless the user explicitly approves a repeated brand/product visual.
  - Future card-news agents must not reuse an image already used by another post's card-news carousel.
  - Reviewer must compare candidate `image:` values against existing `public/assets/cardnews/*/script.md` before final save.
- Next:
  - Continue production with Card News 068 only after applying the duplicate-image check before rendering and before final save.

## Latest Update - 2026-05-02 Card News 168 Final Save

- Task: Continue Instagram revival card-news production with priority 3 from the 30-item backlog.
- Target:
  - `/blog/168` Korean Hiking Culture / Seoul hiking spots.
  - Reels signal from PDF audit: approximately 145K views.
- Card News 168 output:
  - `output/cardnews/168/script.md`
  - `output/cardnews/168/card_01.png` through `output/cardnews/168/card_07.png`
- Saved final tracked assets to:
  - `public/assets/cardnews/168/card_01.png` through `public/assets/cardnews/168/card_07.png`
  - `public/assets/cardnews/168/script.md`
- Card News Team role:
  - Built a 7-card carousel around the cultural observation: Korean weekends often mean mountains.
  - Flow: cover question -> Saturday subway clue -> hiking close to daily life -> gear culture -> post-hike food loop -> first-timer route -> full guide CTA.
  - Added Korea/EpicKor angle through per-card `kicker:` text such as `KOREAN WEEKEND CULTURE`, `SEOUL MORNING CLUE`, `KOREAN HIKING STYLE`, and `EPICKOR HIKING GUIDE`.
- Visual role:
  - Used the recently published `/blog/168` Pexels mountain, fortress trail, skyline, and food-context images.
  - Kept the carousel visually tied to mountains, subway access, trail culture, and post-hike food.
- Renderer/Reviewer role:
  - `python .claude/skills/cardnews/scripts/html-to-png.py --slug 168` generated 7/7 PNGs.
  - Visually opened rendered cards 01-07.
  - Confirmed no visible text overflow, `EPICKOR.COM` watermark on every card, and a coherent swipe flow.
- Next:
  - Continue Instagram revival production with Card News 068, then 069/159.

## Latest Update - 2026-05-02 Card News 064 Final Save

- Task: Continue Instagram revival card-news production with priority 2 from the 30-item backlog.
- Target:
  - `/blog/064` Instead of Seoul, Pick Suwon.
  - Reels signal from PDF audit: approximately 657K views.
- Card News 064 output:
  - `output/cardnews/064/script.md`
  - `output/cardnews/064/card_01.png` through `output/cardnews/064/card_07.png`
- Saved final tracked assets to:
  - `public/assets/cardnews/064/card_01.png` through `public/assets/cardnews/064/card_07.png`
  - `public/assets/cardnews/064/script.md`
- Card News Team role:
  - Built a 7-card carousel around the travel decision hook: choose Suwon as a Seoul alternative.
  - Flow: cover hook -> why Suwon feels close but different -> fortress walk -> Haenggung-dong newtro street -> Suwon galbi/food stop -> simple one-day route -> full guide CTA.
  - Added Korea/EpicKor angle through per-card `kicker:` text such as `SEOUL DAY TRIP IDEA`, `KOREA TRAVEL SHORTCUT`, `HWASEONG FORTRESS`, and `EPICKOR SUWON GUIDE`.
- Visual role:
  - Used the existing `/blog/064` Reel-style cover image to preserve the proven Instagram hook.
  - Replaced or darkened old video-frame images where embedded subtitles conflicted with new card text.
  - Used clean Suwon street, fortress, subway, and Korean BBQ visuals for readability and relevance.
- Renderer/Reviewer role:
  - `python .claude/skills/cardnews/scripts/html-to-png.py --slug 064` generated 7/7 PNGs.
  - Visually opened rendered cards after correction.
  - Confirmed no visible text overflow, `EPICKOR.COM` watermark on every card, and a coherent swipe flow.
- Next:
  - Continue Instagram revival production with Card News 168, then 068 and 069/159.

## Latest Update - 2026-05-02 Card News 135 Final Save and 30-Item Backlog

- Task: Create the first Instagram revival card news from the validated Reels audit and list the next 30 card-news priorities.
- Strategic output:
  - Created `output/strategy/cardnews_priority_backlog_2026-05-02.md`.
  - The backlog numbers 30 card-news targets by historical Reels signal, article readiness, GSC support, visual/card-news potential, monetization potential, and production risk.
  - Priority 1 remains `/blog/135` Why Are There So Many Kims in Korea?
  - Next recommended production sequence: `/blog/064`, `/blog/168`, `/blog/068`, then `/blog/069` or `/blog/159`.
- Card News 135 output:
  - `output/cardnews/135/script.md`
  - `output/cardnews/135/card_01.png` through `output/cardnews/135/card_07.png`
- Saved final tracked assets to:
  - `public/assets/cardnews/135/card_01.png` through `public/assets/cardnews/135/card_07.png`
  - `public/assets/cardnews/135/script.md`
- Card News Team role:
  - Built a 7-card carousel around the proven Reels hook: why Kim became so common in Korea.
  - Flow: cover mystery -> 1-in-5 scale -> Silla royal roots -> Joseon status shift -> bon-gwan explanation -> Gimhae/Gyeongju clan distinction -> full guide CTA.
  - Added Korea/EpicKor angle through per-card `kicker:` text such as `KOREAN NAME MYSTERY`, `KOREA SURNAME FACT`, `SILLA ROYAL ROOTS`, and `EPICKOR KOREA GUIDE`.
- Visual role:
  - Used the existing `/blog/135` Reel-style image for the cover to preserve historical Instagram signal.
  - Used Seoul street, Gyeongju/palace, and existing Kim clan map visuals for context cards.
  - Replaced a first render of card 04 because an old embedded video caption conflicted with the new text.
- Renderer/Reviewer role:
  - `python .claude/skills/cardnews/scripts/html-to-png.py --slug 135` generated 7/7 PNGs.
  - Visually opened rendered cards 01-07.
  - Confirmed no visible text overflow, `EPICKOR.COM` watermark on every card, and a coherent swipe flow.
- Next:
  - Continue Instagram revival production with Card News 064, then 168, 068, and 069/159.

## Latest Update - 2026-05-02 Instagram Reels Audit From PDF

- User provided `input/Instagram-05-02-2026_08_09_PM.pdf` and asked Codex to review it and lead the next move.
- PDF inspection:
  - The PDF is image-only, not text/OCR data.
  - It contains two tall embedded Instagram grid screenshots.
  - Extracted local review images:
    - `output/strategy/instagram_pdf_image_1.jpg`
    - `output/strategy/instagram_pdf_image_2.jpg`
- Audit output:
  - Created `output/strategy/instagram_reels_audit_2026-05-02.md`.
  - Counts are approximate manual readings from the screenshot and should be verified later through Meta/Instagram Insights or direct post-level review.
- Strategic conclusion:
  - The revival strategy is validated by the historical Reels grid.
  - Strongest visible themes are Korean cultural mysteries, everyday surprises, Seoul alternatives, food/social rules, and practical travel helpers.
- Highest readable candidate:
  - `Why Are There So Many Kims in Korea?` at about `135.3만` views.
  - Matching article exists: `/blog/135`.
- Recommended next production task:
  - Create Card News 135 first.
  - Then continue with the first cluster: `/blog/064` Suwon, `/blog/168` hiking, `/blog/068` Korean learning, `/blog/069` or `/blog/159` Gyeongju.
- Agent ownership:
  - Strategy Team owns the ranking/backlog.
  - Research Team verifies exact views, titles, URLs, captions, and matching blog posts.
  - Card News Team produces 3-carousels-at-a-time from the verified backlog.
  - Reviewer Team checks rendered PNG readability and image relevance.
  - Marketing Team owns upload calendar and recovery signal tracking.

## Latest Update - 2026-05-02 Instagram Revival Card News Strategy

- User confirmed the latest card-news quality direction and approved the completed card-news work.
- Strategic decision:
  - EpicKor should first build roughly 30 card news carousels before relying on brand-new card-news topics.
  - Priority topics should come from historically validated demand:
    - Past EpicKor Instagram Reels with the highest views or strongest engagement.
    - EpicKor GSC topics/pages/queries with proven search demand.
    - Recently improved blog posts only when they overlap with proven Reels/GSC demand or have unusually strong visual/social potential.
- Rationale:
  - EpicKor Instagram Reels uploads have been paused for about a year.
  - Restarting with completely new card-news topics may feel abrupt.
  - A better recovery path is to warm the Instagram account with proven topics that already worked as Reels or search content.
- Operating plan:
  - Produce 10-30 card news assets from proven Reels/GSC topics.
  - Keep improving carousel hooks, image relevance, mobile readability, and swipe logic during production.
  - Continue new EpicKor.com blog publishing in parallel.
  - Build or improve Reels production automation during this same ramp period.
  - Once Instagram activity is warmed up through card news, resume Reels uploads with stronger timing and a fuller content backlog.
- Rule update:
  - Added `Instagram Revival Card News Strategy` to `CLAUDE.md`.
  - Future next-task recommendations must consider past high-performing Reels and GSC demand before selecting card-news targets.
- Pending:
  - Locate or compile historical EpicKor Instagram Reels performance data.
  - Build a 30-item card-news priority backlog ranked by Reels performance, GSC demand, visual potential, and production risk.

## Latest Update - 2026-05-02 New Post 170 Published

- Task: Create and publish the next new topic from the pending queue.
- Topic queue:
  - ID 11: `Korean PC Bang Culture: Gaming Cafes That Changed the World`
  - Generated slug: `170`
  - Status: `done`
- Output:
  - `output/research/170_research.json`
  - `output/drafts/170_writer-brief.md`
  - `output/drafts/170_draft.md`
  - `output/review/170_review.json`
  - `output/final/170_final.md`
  - `content/blog/170.md`
- Published title:
  - `Korean PC Bang Culture: Why Gaming Cafes Matter`
- Writer role:
  - Wrote a 2,288-word guide explaining Korean PC bang culture as gaming space, social hangout, food-ordering system, and esports foundation.
  - Added a real HTML first-timer table wrapped in `<div class="table-scroll">`.
  - Added internal link to `/blog/169`.
  - Kept Amazon links out because marketing guardrails found no strongly relevant product match.
- Image role:
  - Replaced weak generic Seoul street images with gaming lounge, internet cafe, and gaming setup Pexels images.
  - Removed Korean `PC방`/`피시방` strings from the public body after detecting encoding risk in GitHub-published markdown; used ASCII `PC bang` wording instead.
- Reviewer/Publisher role:
  - Auto review passed after final cleanup: SEO 100/100, 2,288 words, 7 H2 sections, 3 images, 4 FAQ Q&A.
  - GitHub private preview commit succeeded, then public publish commit succeeded.
  - `npm.cmd run build` passed after local sync and cleanup.
- Public verification:
  - `https://www.epickor.com/blog/170?codex_public_check=20260502a` returned 200.
  - Public HTML contained the new title and `table-scroll`.
  - Public HTML did not contain `PC방`, `피시방`, or known mojibake strings.
  - Public HTML did not contain `Helpful Shopping Picks`, confirming no weak Amazon section was inserted.
  - All 3 Pexels image URLs used by the post returned HTTP 200.

## Latest Update - 2026-05-02 Card News 169 Final Save

- Task: Create and finalize `/blog/169` Seoul neighborhood card news assets.
- Output:
  - `output/cardnews/169/script-brief.md`
  - `output/cardnews/169/script.md`
  - `output/cardnews/169/card_01.png` through `output/cardnews/169/card_07.png`
- Saved final tracked assets to:
  - `public/assets/cardnews/169/card_01.png` through `public/assets/cardnews/169/card_07.png`
  - `public/assets/cardnews/169/script.md`
- Card News Team role:
  - Built a 7-card carousel around a clear travel decision: choose Hongdae, Itaewon, or Gangnam by mood, not by ranking.
  - Flow: cover question -> mood rule -> Hongdae -> Itaewon -> Gangnam -> one-night shortcut -> full guide CTA.
  - Added Korea/EpicKor angle through per-card `kicker:` text such as `SEOUL NEIGHBORHOOD GUIDE`, `SEOUL TRAVEL RULE`, `HONGDAE ENERGY MAP`, and `EPICKOR SEOUL GUIDE`.
- Visual role:
  - Used Seoul-relevant Pexels images from the 169 post and additional image searches for Hongdae/Itaewon/Gangnam street context.
  - Kept each card visually tied to Seoul streets, nightlife, or modern city atmosphere.
- Renderer/Reviewer role:
  - `python .claude/skills/cardnews/scripts/html-to-png.py --slug 169` generated 7/7 PNGs.
  - Visually opened rendered cards 01-07.
  - Confirmed no visible text overflow, `EPICKOR.COM` watermark on every card, and a coherent swipe flow.
- Next:
  - Continue with the next pending topic queue article, slug 170.

## Latest Update - 2026-05-02 New Post 169 Published

- Task: Create and publish the next new topic from the pending queue.
- Topic queue:
  - ID 10: `Hongdae vs Itaewon vs Gangnam: Seoul's Neighborhoods Decoded`
  - Generated slug: `169`
  - Status: `done`
- Output:
  - `output/research/169_research.json`
  - `output/drafts/169_writer-brief.md`
  - `output/drafts/169_draft.md`
  - `output/review/169_review.json`
  - `output/final/169_final.md`
  - `content/blog/169.md`
- Published title:
  - `Hongdae vs Itaewon vs Gangnam: Seoul Guide`
- Writer role:
  - Wrote a 2,296-word Seoul neighborhood decision guide for international travelers.
  - Framed the article around practical neighborhood choice: Hongdae for youth/night energy, Itaewon for global food and social flexibility, Gangnam for polished modern Seoul.
  - Added 2 real HTML tables wrapped in `<div class="table-scroll">`.
  - Added internal links to `/blog/160` and `/blog/165`.
  - Used official VisitKorea, Visit Seoul, and Visit Gangnam facts to stabilize the neighborhood claims.
  - Kept Amazon links out because marketing guardrails found no strongly relevant product match.
- Image role:
  - Used 3 Seoul-relevant Pexels images: lively street/shopping scene, Itaewon night street, and modern Seoul/Gangnam-style street scene.
- Reviewer/Publisher role:
  - Auto review passed: SEO 100/100, 2,296 words, 7 H2 sections, 3 images, 4 FAQ Q&A.
  - GitHub private preview commit succeeded, then public publish commit succeeded.
  - `npm.cmd run build` passed.
- Public verification:
  - `https://www.epickor.com/blog/169?codex_public_check=20260502a` returned 200.
  - Public HTML contained the new title, `table-scroll`, and expected Hongdae intro text.
  - Public HTML did not contain `Helpful Shopping Picks`, confirming no weak Amazon section was inserted.
  - All 3 Pexels image URLs used by the post returned HTTP 200.

## Latest Update - 2026-05-02 Card News 160 Final Save

- Task: Finalize the already-rendered `/blog/160` Korean sunscreen card news assets.
- Saved final tracked assets to:
  - `public/assets/cardnews/160/card_01.png` through `public/assets/cardnews/160/card_07.png`
  - `public/assets/cardnews/160/script.md`
- Source artifacts:
  - `output/cardnews/160/card_01.png` through `output/cardnews/160/card_07.png`
  - `output/cardnews/160/script.md`
- Renderer/Reviewer note:
  - Re-opened rendered cards 01-07 before final save.
  - Confirmed no visible text overflow in reviewed PNGs.
  - Confirmed `EPICKOR.COM` watermark appears on every card.
  - Confirmed the carousel still follows the K-beauty texture-first story: SPF mistake -> texture problem -> rule -> quick match -> starter picks -> reapply tip -> full guide CTA.
- Next:
  - Continue with the next pending topic queue article, slug 169.

## Latest Update - 2026-05-02 New Post 168 Published

- Task: Create and publish the next new topic from the pending queue.
- Topic queue:
  - ID 9: `Korean Hiking Culture: Why Every Weekend Koreans Hit the Mountains`
  - Generated slug: `168`
  - Status: `done`
- Output:
  - `output/research/168_research.json`
  - `output/drafts/168_writer-brief.md`
  - `output/drafts/168_draft.md`
  - `output/review/168_review.json`
  - `output/final/168_final.md`
  - `content/blog/168.md`
- Published title:
  - `Korean Hiking Culture: Why Weekends Mean Mountains`
- Writer role:
  - Wrote a 2,149-word guide explaining Korean hiking culture as weekend rhythm, social life, health routine, and seasonal travel habit.
  - Added a real HTML comparison table wrapped in `<div class="table-scroll">`.
  - Added internal link to `/blog/165`.
  - Kept Amazon links out because marketing guardrails found no strongly relevant product match.
- Image role:
  - Used 3 Pexels images relevant to Korean mountains, Seoul fortress trails, and skyline viewpoints.
  - Replaced a non-ASCII Pexels credit with ASCII `Nui MALAMA` to avoid display/encoding risk.
- Reviewer/Publisher role:
  - Auto review passed: SEO 100/100, 2,149 words, 6 H2 sections, 3 images, 4 FAQ Q&A.
  - `npm.cmd run build` passed.
  - GitHub private preview commit succeeded, then public publish commit succeeded.
- Public verification:
  - `https://www.epickor.com/blog/168?codex_public_check=20260502a` returned 200.
  - Public HTML contained the new title, `table-scroll`, and corrected `Nui MALAMA` credit.
  - Public HTML did not contain the old non-ASCII credit string.
  - Public HTML did not contain `Helpful Shopping Picks`, confirming no weak Amazon section was inserted.
  - All 3 Pexels image URLs used by the post returned HTTP 200.

## Latest Update - 2026-05-02 Card News 153 Final Save

- Task: Finalize the already-approved `/blog/153` Isaac Toast card news assets.
- Saved final tracked assets to:
  - `public/assets/cardnews/153/card_01.png` through `public/assets/cardnews/153/card_07.png`
  - `public/assets/cardnews/153/script.md`
- Source artifacts:
  - `output/cardnews/153/card_01.png` through `output/cardnews/153/card_07.png`
  - `output/cardnews/153/script.md`
- Reviewer note:
  - Final saved files preserve the previously reviewed version with Isaac Toast-specific food images, readable text layout, and `EPICKOR.COM` watermark.
- Next:
  - Continue with the next new article from the pending topic queue.

## Latest Update - 2026-05-01 Card News 153 Draft Render

- Task: Create card news draft for the already-improved `/blog/153` Isaac Toast article.
- Output:
  - `output/cardnews/153/script-brief.md`
  - `output/cardnews/153/script.md`
  - `output/cardnews/153/card_01.png` through `output/cardnews/153/card_07.png`
- Card News Team role:
  - Built a 7-card carousel around one clear story: Isaac Toast is memorable because its sweet sauce creates a Korean sweet-savory breakfast hook.
  - Flow: sauce hook -> what Isaac Toast is -> why the sauce is famous -> dan-jjan sweet/salty logic -> first order -> Myeongdong travel breakfast -> full guide CTA.
  - Added Korea/EpicKor angle through per-card `kicker:` text such as `KOREAN BREAKFAST GUIDE`, `KOREA TASTE LOGIC`, `KOREAN DAN-JJAN RULE`, and `SEOUL TRAVEL BREAKFAST`.
- Visual role:
  - Avoided existing 153 video-frame captures because they contained embedded text/signage.
  - Downloaded Isaac Toast official menu image candidates from `isaac-toast.co.kr` under ignored local output assets.
  - Used official Isaac Toast sandwich images only for rendered cards.
  - Used `image_tone: Food` and per-card crop/zoom controls to keep the food bright and appetizing.
- Renderer/Reviewer role:
  - `python .claude/skills/cardnews/scripts/html-to-png.py --slug 153` generated 7/7 PNGs.
  - Visually opened rendered cards 01-07.
  - Adjusted cards 02 and 05 after the first render because text and product imagery overlapped.
  - Confirmed the corrected cards use text-free Isaac Toast images, preserve readability, and show `EPICKOR.COM` watermark.
- Pending:
  - Await user approval before saving final tracked assets to `public/assets/cardnews/153/`.
- Note:
  - `output/` is gitignored, so these rendered card-news files are local workspace artifacts unless intentionally copied to a tracked public asset path later.
  - No separate subagent process was spawned in Codex. Codex performed the Card News Team, Visual, Renderer, and Reviewer roles directly and recorded the responsibility split here.

### Follow-up - 2026-04-30 Card News 071 Visual Correction

- User feedback:
  - The first 071 card-news version used existing video-frame captures with embedded text, which reduced visual appeal.
  - For food card news, images should be text-free and appetizing; heavy dark opacity should be avoided.
  - Image selection should stay specific to Deli Manjoo, not generic custard/pastry imagery.
- Changes:
  - Removed generic Pexels pastry/street-food candidates from the 071 local card-news image folder.
  - Sourced Deli Manjoo-specific official site image candidates from `delimanjoo.kr`.
  - Updated `output/cardnews/071/script.md` to use Deli Manjoo-specific images/crops only.
  - Updated `.claude/skills/cardnews/scripts/html-to-png.py` with optional per-card controls:
    - `image_position`
    - `image_opacity`
    - `image_zoom`
    - `image_tone: Food`
  - Food tone uses a lighter image overlay so food does not render overly black while preserving text readability.
- Renderer/Reviewer role:
  - Re-rendered all 7 PNGs with `python .claude/skills/cardnews/scripts/html-to-png.py --slug 071`.
  - Reviewed rendered cards after correction.
  - Confirmed the revised cards use Deli Manjoo-specific imagery and avoid the prior embedded video-caption text issue.
  - Confirmed `EPICKOR.COM` watermark remains present.
- Note:
  - Local rendered outputs remain under ignored `output/cardnews/071/`.
  - The renderer option update is tracked because it improves future food/card-news customization without changing existing defaults.

### Follow-up - 2026-04-30 Card News 071 Final Save

- User approved the revised 071 card-news version.
- Saved final tracked assets to:
  - `public/assets/cardnews/071/card_01.png` through `public/assets/cardnews/071/card_07.png`
  - `public/assets/cardnews/071/script.md`
- These files preserve the final approved version outside ignored `output/` artifacts.

## Latest Update - 2026-04-30 Card News 071

- Task: Create card news for the already-improved `/blog/071` Deli Manjoo article.
- Output:
  - `output/cardnews/071/script-brief.md`
  - `output/cardnews/071/script.md`
  - `output/cardnews/071/card_01.png` through `output/cardnews/071/card_07.png`
- Card News Team role:
  - Built a 7-card carousel around one clear story: Deli Manjoo is the warm custard subway snack Koreans recognize by smell.
  - Flow: hook -> what it is -> taste -> station smell -> commute culture -> Myeongdong tip -> full guide CTA.
  - Added Korea/EpicKor angle through per-card `kicker:` text such as `SEOUL SUBWAY SNACK`, `KOREAN SNACK GUIDE`, and `MYEONGDONG FOOD TIP`.
- Visual role:
  - Used existing post-owned `/assets/images/posts/071/...` images for every card.
  - No Pexels images were needed.
- Renderer/Reviewer role:
  - `python .claude/skills/cardnews/scripts/html-to-png.py --slug 071` generated 7/7 PNGs.
  - Visually opened rendered cards 01-07.
  - Confirmed no visible text overflow in reviewed PNGs.
  - Confirmed `EPICKOR.COM` watermark appears on the cards.
  - Confirmed each card has a relevant Deli Manjoo/subway snack visual.
- Note:
  - `output/` is gitignored, so these rendered card-news files are local workspace artifacts unless intentionally force-added later.
  - No separate subagent process was spawned in Codex. Codex performed the Card News Team, Visual, Renderer, and Reviewer roles directly and recorded the responsibility split here.

## Latest Update - 2026-04-30 Production Redeploy and Public Verification

- Task: Resolve mismatch where local/origin `master` contained recent rewrites, but production `www.epickor.com` initially still showed stale content for some pages.
- Build/deploy:
  - Local `npm.cmd run build`: passed.
  - `npx.cmd vercel --prod --yes`: completed successfully.
  - Production alias confirmed by Vercel CLI: `https://www.epickor.com`.
- Public content verification after redeploy:
  - `/blog/074`: 200 and contains `Seoul Underground Shopping Malls: Best Stations Guide`.
  - `/blog/153`: 200 and contains `Isaac Toast Sauce: Korea's Famous Sweet Breakfast`.
  - `/blog/160`: 200 and contains `Best Korean Sunscreens 2026: 7 K-Beauty SPF Picks`.
  - `/blog/071`: 200 and contains `What Is Deli Manjoo? Korea's Subway Custard Snack`.
  - `/blog/008`: 200 and contains `Why Koreans Eat So Much Garlic: Culture Explained`.
  - `/blog/043`: 200 and contains `Why Is Jang Wonyoung So Popular? Wonyoungism Explained`.
  - `/blog/055`: 200 and contains `What Does Pali Pali Mean? Korea's Fast Culture`.
- Public image verification:
  - `/blog/074`: 3/3 local asset URLs returned 200.
  - `/blog/153`: 4/4 local asset URLs returned 200.
  - `/blog/160`: 2/2 local asset URLs returned 200.
  - `/blog/071`: 5/5 local asset URLs returned 200.
  - `/blog/008`: 4/4 local asset URLs returned 200.
  - `/blog/043`: 5/5 local asset URLs returned 200.
  - `/blog/055`: 5/5 local asset URLs returned 200.
- Amazon affiliate guardrail verification:
  - `Helpful Shopping Picks` and `View on Amazon` appear on `/blog/153` and `/blog/160`.
  - They do not appear on checked non-Amazon pages: `/blog/074`, `/blog/071`, `/blog/008`, `/blog/043`, `/blog/055`.
- Canonical redirect verification:
  - Public `/blog/074-the-world-of-underground-shopping-malls-in-korea` returns 308 to `/blog/074`.
- Strategy note:
  - Do not start another GSC rewrite solely from the 2026 W18 report until recent rewrites have had time to collect fresh GSC data.
  - Next best operating task remains card news for an already-improved post, preferably `/blog/071`, unless the user asks for a different priority.
- Note:
  - No separate subagent process was spawned in Codex. Codex performed the Publisher and Reviewer roles directly and recorded the responsibility split here.

## Latest Update - 2026-04-28 GSC Rewrite 074

- Task: Fix `/blog/074` URL duplication and rewrite the post for GSC CTR/search intent.
- Target metrics from GSC export:
  - `/blog/074`: 3 clicks / 1,602 impressions / 0.19% CTR / average position 10.11.
  - `/blog/074-the-world-of-underground-shopping-malls-in-korea`: 1 click / 1,407 impressions / 0.07% CTR / average position 8.06.
- URL/canonical diagnosis:
  - Public checks showed both `/blog/074` and `/blog/074-the-world-of-underground-shopping-malls-in-korea` returned 200.
  - Cause: file name was `074-the-world-of-underground-shopping-malls-in-korea.md`, while frontmatter slug was `074`; `findFileBySlug` could resolve both.
- URL/canonical changes:
  - Updated `app/blog/[slug]/page.tsx`.
  - Added canonical metadata based on `post.slug`, not the requested URL slug.
  - Updated Open Graph URL to use `post.slug`.
  - Added `permanentRedirect('/blog/{post.slug}')` when a non-canonical filename slug resolves to a post with a different frontmatter slug.
  - Local alias check: `/blog/074-the-world-of-underground-shopping-malls-in-korea` now returns 308 to `/blog/074`.
- Search intent used:
  - `seoul subway station underground shopping mall multiple lines`
  - `gangnam station underground shopping mall`
  - `hongdae station underground shopping mall`
  - `underground shopping seoul`
- Writer role:
  - Rewrote title to `Seoul Underground Shopping Malls: Best Stations Guide`.
  - Rebuilt the post around COEX Mall, Gangnam Station Underground Shopping Center, Goto Mall/Express Bus Terminal, and the Hongdae clarification.
  - Added practical shopping guidance, route/time planning, and FAQ.
  - Removed broken mojibake, placeholder comments, and thin report-style structure.
- Table/Image role:
  - Added 3 clean HTML tables wrapped in `<div class="table-scroll">`.
  - Preserved existing 074 image assets and set a local `ogImage`.
  - Kept 3 relevant body images.
- Reviewer role:
  - Title length: 53 characters.
  - Description length: 146 characters.
  - Word count: 1,987.
  - H2 sections: 9.
  - Images: 3.
  - Tables: 3.
  - Confirmed no known mojibake strings, placeholder image comments, empty `ogImage`, or internal notes.
  - Local `/blog/074?codex_check=20260428` returned 200.
  - Local alias URL returned 308 to `/blog/074`.
  - `npm.cmd run build`: passed.
  - Public `/blog/074?codex_public_check=20260428b` returned 200 after deploy.
  - Public page contained the new title and rendered tables.
  - Public page no longer contained known mojibake or placeholder strings.
  - Public `/blog/074-the-world-of-underground-shopping-malls-in-korea?codex_redirect_check=20260428` returned 308 to `/blog/074`.
- Note:
  - No separate subagent process was spawned in Codex. Codex performed the Strategy, SEO/canonical, Writer, Image, and Reviewer roles directly and recorded the responsibility split here.

## Latest Update - 2026-04-28 GSC Rewrite 159

- Task: Improve `/blog/159` from GSC data and repair public-quality issues.
- Target metrics from GSC export:
  - `/blog/159`: 3 clicks / 1,244 impressions / 0.24% CTR / average position 6.11.
- Reason for priority:
  - `/blog/090` and `/blog/082` were already recently changed or verified, so they should not be judged again until GSC has time to update.
  - `/blog/159` had no recent rewrite record and had clear quality risks.
- Research/Strategy role:
  - Checked `HANDOFF.md`, latest `output/strategy/week_2026W18.md`, and recent git history before choosing the target.
  - Used Pexels image sourcing for relevant Korea travel visuals.
- Writer role:
  - Replaced the overlong report-style title with `Best Places to Visit in Korea: 2026 Travel Guide`.
  - Rebuilt the article around first-time Korea travel intent: Seoul, Busan, Gyeongju, Jeju, Gangneung, Jeonju, route planning, and FAQ.
  - Removed speculative/fake future claims such as 6G tourism infrastructure and removed internal operator notes from the public body.
  - Added practical tables for destination choice and itinerary length.
  - Added internal links to `/blog/165` and `/blog/154`.
- Image/metadata role:
  - Fixed empty `ogImage`.
  - Removed the unrelated raw GitHub `/posts/150/` image.
  - Added 4 relevant Pexels images:
    - Seoul palace image.
    - Busan coastline image.
    - Gyeongju pavilion image.
    - Jeju village image.
- Reviewer role:
  - Confirmed title length: 48 characters.
  - Confirmed description length: 134 characters.
  - Confirmed 10 H2 sections and 4 body images.
  - Confirmed no remaining `Representative`, `Technical Guide`, `File ID`, `Please proceed`, empty `ogImage`, raw GitHub image, or known mojibake strings in `content/blog/159.md`.
  - Confirmed all 4 Pexels image URLs returned HTTP 200.
  - `npm.cmd run build`: passed.
  - Local rendered page `http://localhost:4000/blog/159?codex_check=20260428` returned 200 and contained the new title/image references.
- Note:
  - No separate subagent process was spawned in Codex. Codex performed the Strategy, Research, Writer, Image, and Reviewer roles directly and recorded the responsibility split here.

### Follow-up - Table Rendering and Agent Memory

- User feedback:
  - Shortcut/comparison sections must render as clean tables, not loose aligned text.
  - Current system changes should be saved if not already committed.
- Changes:
  - Converted the two `/blog/159` comparison sections to HTML tables wrapped in `<div class="table-scroll">`.
  - Added global blog table styling in `app/globals.css` for desktop/mobile readability.
  - Added `Blog Table Rules` to `CLAUDE.md`.
  - Added table rules to:
    - Strategy Team: identify table-worthy sections during rewrite recommendations.
    - Writer Team: write comparison/shortcut/recommendation/itinerary sections as real tables.
    - Reviewer Team: inspect rendered tables in browser and reject loose aligned text.
- Verification:
  - Local `/blog/159?codex_table_check=20260428` returned 200.
  - Rendered HTML contained 2 `<table>` elements and `table-scroll` wrappers.

## Latest Update - 2026-04-28 Card News 160 Revision

- Task: Rebuild `/blog/160` card news after user feedback that the first version had small text, weak information structure, and a weak first-card hook.
- Output:
  - `output/cardnews/160/script.md`
  - `output/cardnews/160/card_01.png` through `output/cardnews/160/card_07.png`
- Card News Team role:
  - Reframed the carousel around one clear narrative: do not buy Korean sunscreen by viral hype; choose by skin texture and use case.
  - Rewrote the hook card to `The SPF mistake K-beauty fans make`.
  - Rebuilt the flow as: hook -> problem -> rule -> quick skin-type match -> product direction -> reapply rule -> full guide CTA.
- Renderer/Template role:
  - Updated `.claude/skills/cardnews/scripts/html-to-png.py`.
  - Added stable `image:` support for local `/assets/images/...` paths in `script.md`.
  - Removed Google Font dependency and used local system font fallbacks.
  - Increased card typography substantially for mobile readability.
- Reviewer role:
  - Manually opened rendered PNGs for cards 01-07.
  - Confirmed no visible text overflow in the reviewed rendered cards.
  - Confirmed the first card now has stronger curiosity and the second/third cards continue the story.
- Note:
  - No separate subagent process was spawned in Codex. Codex performed the Card News Team, Renderer, and Reviewer roles directly and recorded the responsibility split here.

### Follow-up - Visual Brand Revision

- User feedback:
  - Each card should have a relevant image.
  - `epickor.com` watermark should feel more polished on every card.
  - Because EpicKor targets people interested in Korea, each card should carry a Korea/K-beauty hook or point keyword.
- Changes:
  - Downloaded additional Pexels card-news images into `output/cardnews/160/images/`.
  - Added `kicker:` support to the card script parser.
  - Added per-card point keywords such as `KOREA SPF GUIDE`, `SEOUL SKINCARE RULE`, and `K-BEAUTY TEXTURE MAP`.
  - Upgraded watermark treatment with a subtle top-left `EK EPICKOR.COM` brand mark and bottom-right `EPICKOR.COM` badge.
  - Re-rendered all 7 PNGs.
- Reviewer notes:
  - Replaced weaker non-K-beauty/NIVEA card visuals on cards 02 and 04 with existing `/blog/160` K-beauty product/store images.
  - Checked rendered cards 01-07 visually after re-render.

### Follow-up - Watermark and Agent Rule Update

- User feedback:
  - Watermark should use `EPICKOR.COM`.
  - The process and rules from this card-news revision should be updated across the agent teams.
- Changes:
  - Updated `.claude/skills/cardnews/scripts/html-to-png.py` so the top-left brand text and bottom-right badge both show `EPICKOR.COM`.
  - Re-rendered all 7 cards for `/blog/160`.
  - Updated `CLAUDE.md` with global Card News Brand Rules.
  - Updated all agent instructions:
    - Research Team: source image candidates with card-news usage in mind.
    - Writer Team: surface 5-8 carousel-friendly takeaways and Korea/EpicKor context.
    - Card News Team: require relevant visuals, `kicker:`, `EPICKOR.COM` watermark, mobile typography, and rendered PNG review.
    - Reviewer Team: review rendered cards for image relevance, watermark, readability, and swipe logic.
    - Marketing Team: keep social CTAs aligned with `EPICKOR.COM` and avoid ad-first carousel framing.
    - Strategy Team: recommend carousel angles and note visual readiness.
- Verification:
  - Python syntax check passed.
  - `python .claude/skills/cardnews/scripts/html-to-png.py --slug 160` generated 7/7 PNGs.
  - Manually opened representative cards 01, 03, and 07 and confirmed `EPICKOR.COM` appears in the watermark.

### Follow-up - Handoff and Strategy Priority Rule Correction

- User asked whether `CLAUDE.md` already required checking `HANDOFF.md` and using the Strategy Agent perspective before deciding what to do next.
- Finding:
  - `CLAUDE.md` mentioned `HANDOFF.md`, but did not explicitly require a handoff + latest strategy + git-history check before next-task recommendations.
  - Strategy Team rules described GSC analysis, but did not clearly block recommending recently rewritten pages.
- Changes:
  - Added global `Handoff And Strategy Check Rules` to `CLAUDE.md`.
  - Added `Next-Task Priority Rules` to `.claude/agents/strategy-team/AGENT.md`.
  - Future next-task recommendations must check `HANDOFF.md`, latest `output/strategy/week_*.md`, and git history when the handoff may be incomplete.
- Correction:
  - `/blog/090` was already rewritten in git commit `9d2abca` on 2026-04-27 17:32 KST (`Rewrite ahjussi meaning post for GSC CTR`), but this was missing from `HANDOFF.md`.
  - Do not recommend `/blog/090` again as a fresh GSC rewrite target until enough post-change GSC data has accumulated, unless the user explicitly asks to revisit it.

## Latest Update - 2026-04-28 Technical SEO and Strategy Agent

- Task: Resume the original EpicKor operating plan beyond GSC rewrites.
- Technical SEO:
  - Added `metadataBase: new URL("https://www.epickor.com")` to `app/layout.tsx`.
  - `npm.cmd run build` now passes without the previous `metadataBase` warning.
- Strategy Agent:
  - Created `.claude/skills/strategy/scripts/analyze-week.mjs`.
  - CSV mode now reads GSC exports under `output/gsc/`.
  - Generated weekly report: `output/strategy/week_2026W18.md`.
  - Current GSC totals from page CSV: 282 clicks / 70,977 impressions / 0.40% average CTR.
  - Pending topic queue count: 22, so no automatic topic additions were needed.
  - Script supports `--update-queue`, but only tops up queue when pending topics are below the minimum.
- Recommended next operating work:
  - Amazon monetization cleanup for `/blog/160` and `/blog/153`.
  - Card news generation for one improved post, preferably `/blog/160` or `/blog/071`.
  - Continue GSC rewrites later after 3-7 days of post-change data.

## Latest Update - 2026-04-28 GSC Rewrite 055 and 153

- Task: Improve `/blog/055` and `/blog/153` from GSC data for better CTR.
- `/blog/055` target metrics: 8 clicks / 1,105 impressions / 0.72% CTR / average position 5.13.
- `/blog/055` search intent: `pali pali korean`, `pali pali in korean`, `pali pali culture`, `what is pali pali in korean`.
- `/blog/055` changes:
  - Rewrote title to `What Does Pali Pali Mean? Korea's Fast Culture`.
  - Rebuilt body around meaning, history, restaurants, delivery/apps, traveler guidance, cost of speed, and FAQ.
  - Added structured HTML table and internal link to `/blog/165`.
  - Preserved existing image assets and added stable ASCII copies `055_frame_1.jpg` through `055_frame_4.jpg`.
- `/blog/153` target metrics: 9 clicks / 1,420 impressions / 0.63% CTR / average position 3.95.
- `/blog/153` search intent: `isaac toast sauce`, `isaac toast`, `isaac toast kiwi sauce`, `what is isaac toast`.
- `/blog/153` changes:
  - Rewrote title to `Isaac Toast Sauce: Korea's Famous Sweet Breakfast`.
  - Added missing slug/description/visibility frontmatter.
  - Rebuilt body around Isaac Toast sauce, first-time menu picks, Myeongdong, ordering, home sauce imitation, and FAQ.
  - Added structured HTML table and internal link to `/blog/071`.
- Verification:
  - `/blog/055` Reviewer Agent: 100/100, 1,912 words, 10 H2 sections, 5 images, 5 FAQ entries.
  - `/blog/153` Reviewer Agent: 100/100, 1,973 words, 10 H2 sections, 4 images, 5 FAQ entries.
  - `npm.cmd run build`: passed.
  - Local rendered pages `/blog/055` and `/blog/153` returned 200.
  - Local image URLs for all used 055 and 153 assets returned 200.
- Next step: Commit/push/deploy, then verify public `/blog/055`, `/blog/153`, and public image URLs.

## Latest Update - 2026-04-28 GSC Rewrite 071

- Task: Improve `/blog/071` from GSC data for better CTR.
- Target metrics from GSC export: 7 clicks / 2,298 impressions / 0.3% CTR / average position 5.58.
- Search intent found in query export: `deli manjoo`, `delimanjoo`, `what is manjoo`, `manjoo korean snack`.
- Changes:
  - Rewrote title to `What Is Deli Manjoo? Korea's Subway Custard Snack`.
  - Rebuilt body around what Deli Manjoo is, taste, name meaning, subway smell, Myeongdong Station, how to eat/order, and traveler guidance.
  - Added structured HTML table and FAQ.
  - Added internal link to `/blog/029`.
  - Preserved existing image assets and added stable ASCII copies `071_frame_1.jpg` through `071_frame_4.jpg`.
- Verification:
  - Reviewer Agent: 100/100, 1,926 words, 11 H2 sections, 5 images, 5 FAQ entries.
  - `npm.cmd run build`: passed.
  - Local rendered page: `http://localhost:4000/blog/071?codex_check=20260428` returned 200.
  - Local image URLs for all 5 071 assets returned 200.
- Next step: Commit/push/deploy, then verify public `/blog/071` and public image URLs.

## Latest Update - 2026-04-28 GSC Rewrite 008

- Task: Improve `/blog/008` from GSC data for better CTR.
- Target metrics from GSC export: 16 clicks / 2,400 impressions / 0.67% CTR / average position 5.04.
- Search intent found in query export: `korean garlic`, `why do koreans eat so much garlic`, `garlic in korea`, `korean pickled garlic`.
- Changes:
  - Rewrote title to `Why Koreans Eat So Much Garlic: Culture Explained`.
  - Removed unsafe unsupported claim that Korea is definitively `#1` in global garlic consumption.
  - Rebuilt body around Dangun myth, Korean BBQ, kimchi, banchan, fermentation, health beliefs, and common garlic uses.
  - Added structured HTML table for where garlic appears on a Korean table.
  - Added FAQ and internal link to `/blog/083`.
  - Preserved existing image assets.
- Verification:
  - Reviewer Agent: 100/100, 1,940 words, 10 H2 sections, 4 images, 5 FAQ entries.
  - `npm.cmd run build`: passed.
  - Local rendered page: `http://localhost:4000/blog/008?codex_check=20260428` returned 200.
  - Local image URLs for all 4 used 008 assets returned 200.
- Next step: Commit/push/deploy, then verify public `/blog/008` and public image URLs.

## Latest Update - 2026-04-28 GSC Rewrite 043

- Task: Improve `/blog/043` from GSC data for better CTR.
- Target metrics from GSC export: 16 clicks / 3,494 impressions / 0.46% CTR / average position 10.55.
- Search intent found in query export: `jang won-young`, `why is jang wonyoung so popular`, `wonyoungism`, `Lucky Vicky`.
- Changes:
  - Rewrote title to `Why Is Jang Wonyoung So Popular? Wonyoungism Explained`.
  - Removed unsupported large-number claim and broken encoded characters.
  - Rebuilt body around Jang Wonyoung, IVE, IZ*ONE, Lucky Vicky, Wonyoungism, fashion, criticism, and K-pop idol image.
  - Added FAQ and internal link to `/blog/010`.
  - Preserved existing image assets and added stable ASCII copies `043_frame_1.jpg` through `043_frame_4.jpg`.
- Verification:
  - Reviewer Agent: 100/100, 1,910 words, 10 H2 sections, 5 images, 5 FAQ entries.
  - `npm.cmd run build`: passed.
  - Local rendered page: `http://localhost:4000/blog/043?codex_check=20260428` returned 200.
  - Local image URLs for all 5 043 assets returned 200.
- Next step: Commit/push/deploy, then verify public `/blog/043` and public image URLs.

## Latest Update - 2026-04-28 GSC Rewrite 160

- Task: Improve `/blog/160` from GSC data for better CTR.
- Target metrics from GSC export: 23 clicks / 2,877 impressions / 0.8% CTR / average position 5.83.
- Changes:
  - Rewrote title to `Best Korean Sunscreens 2026: 7 K-Beauty SPF Picks`.
  - Fixed broken/truncated meta description.
  - Replaced GitHub raw image URLs with local `/assets/images/posts/160/...` paths.
  - Reworked body around search intent: best Korean sunscreens, skin-type picks, usage guidance, FAQ.
  - Cleaned quick-pick section into a structured HTML table.
  - Preserved existing image assets.
  - Added communication rule in `CLAUDE.md`: address the user as `대표님`, no casual Korean speech.
- Verification:
  - Reviewer Agent: 100/100, 2,333 words, 7 H2 sections, 2 images, 5 FAQ entries.
  - `npm.cmd run build`: passed.
  - Local rendered page: `http://localhost:4000/blog/160?codex_table=20260428` returned 200.
  - Local image URLs for both 160 assets returned 200.
- Next step: Commit/push/deploy, then verify public `/blog/160` and public image URLs.

## Latest Update - 2026-04-27 Render/Image Gate

- Issue found: Reviewer allowed posts based on markdown/SEO checks without verifying rendered browser images.
- Root cause: `review-post.mjs` counted image markdown and alt text, but did not fail when local `/assets/` files were missing. Publisher also needed a public-page image check after deploy.
- Fix applied:
  - `review-post.mjs` now checks that local `/assets/` image paths exist under `public/assets/`.
  - A post now fails review if `image_issues` are present.
  - `CLAUDE.md` and Reviewer Team instructions now require preview/public rendered-image checks before approval/publish completion.
- 082 verification:
  - Local reviewer passed after the new image-file check.
  - Public `https://www.epickor.com/blog/082` returned the new SKY title.
  - Public image URLs for 082 returned HTTP 200 for all 9 images.
- Agent responsibility:
  - Reviewer Agent: markdown SEO + local image file existence + manual rendered preview check.
  - Publisher Agent: post-publish public URL check, including visible images.
  - Human Reviewer: final content judgment, but should not have to catch broken-image plumbing.
# 최종 업데이트: 2026-05-07 03:43:47 | 업데이트한 에이전트: Publisher

---

## 최신 상태 - 2026-04-27

- 166번 글은 공개 발행 완료.
- Pexels 썸네일 표시 문제는 `next.config.ts`의 이미지 도메인 허용으로 해결됨.
- 로컬 `master`는 `origin/master`와 동기화했고, 자동화 개선 커밋 `4bd94d5`를 GitHub에 push 완료.
- `npm.cmd run build` 통과. 남은 경고는 `metadataBase` 미설정 경고뿐.
- 로컬 실행 산출물은 `.gitignore`에 추가함: `output/`, `.codex-deploy/`, `package-lock.json`, `.claude/settings.local.json` 등.
- 안전 보관 stash가 2개 남아 있음:
  - `stash@{0}`: 원격과 겹치던 로컬 160-165 글 파일
  - `stash@{1}`: 동기화 전 tracked 로컬 수정분
- 167번 글은 preview 승인 후 공개 발행 완료.
- 167번 주제는 topics queue의 ID 8:
  `The Best Korean Dramas of 2026 That You're Missing Right Now`
- 167번 생성 결과:
  - research: `output/research/167_research.json`
  - writer brief: `output/drafts/167_writer-brief.md`
  - draft: `output/drafts/167_draft.md`
  - review: `output/review/167_review.json`
  - review 통과: SEO 100/100, 단어 수 1,900, 이미지 3장, FAQ 4개
  - 사용자 지적으로 사실/이미지 재검토 완료:
    - `Bloodhounds Season 2`는 추천 본문에서 제거
    - Netflix 공식/Tudum에서 확인되는 `Sold Out on You`로 대체
    - Pexels 이미지는 서울 풍경 이미지에서 TV/스트리밍/시청 분위기 이미지로 교체
  - GitHub private preview commit 완료: `content/blog/167.md`
  - GitHub public publish commit 완료: `content/blog/167.md`
  - 로컬 preview URL: `http://localhost:4000/preview/167`
  - production preview URL: `https://epickor.com/preview/167?token=[PREVIEW_SECRET_TOKEN]`
  - public URL: `https://www.epickor.com/blog/167`
  - approval 후처리 완료: Amazon 링크는 관련도 낮아 생략, topics queue ID 8은 `done`
- 167번 작업 agent별 최종 역할:
  - Research Agent: DuckDuckGo/Pexels로 초기 소스와 이미지 후보 수집
  - Writer Agent: `167_writer-brief.md` 기준으로 초안 작성 후 Bloodhounds 제거, Sold Out on You 대체, 이미지 교체
  - Reviewer Agent: SEO/형식 자동 리뷰 실행, 사용자 지적 후 사실 검증/이미지 적합성 수동 재검토 규칙 보강
  - Publisher Agent: 수정된 167번 글을 GitHub private preview로 재반영
  - Human Reviewer: Bloodhounds와 이미지 부적합 문제 발견
- 다음 액션: 168번 신규 글 시작.

---

## 현재 결론

Gemini API 의존성을 제거하는 방향으로 전환했다. 앞으로 글 작성과 카드뉴스 문안 작성은 Claude/Codex가 직접 수행하고, Node 스크립트는 리서치 수집·브리프 생성·리뷰·발행 보조만 담당한다.

---

## 프로젝트 핵심 정보

| 항목 | 내용 |
|------|------|
| 사이트 | epickor.com - 한국 문화/여행/음식/K-pop 영어 블로그 |
| GitHub | 5414peace-hash/epickor-blog (branch: master) |
| 배포 | Vercel - master push 시 자동 배포 |
| 스택 | Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 |
| 글 작성 | Claude/Codex 직접 작성 |
| 리서치 | DuckDuckGo keyless search + Pexels API |
| 수익화 | Amazon Affiliate |
| 현재 최신 슬러그 | 166 -> 다음 신규 글: 167 |

---

## 완료된 전환 작업

- [x] `.claude/skills/research/scripts/web-search.mjs`
  - Gemini 호출 제거
  - `GEMINI_API_KEY` 요구 제거
  - DuckDuckGo HTML/Instant Answer 기반 keyless search로 변경

- [x] `.claude/skills/writer/scripts/generate-draft.mjs`
  - Gemini 초안 생성 제거
  - `output/drafts/{slug}_writer-brief.md` 생성 방식으로 변경
  - 실제 초안은 Claude/Codex가 `output/drafts/{slug}_draft.md`에 직접 작성

- [x] `.claude/skills/cardnews/scripts/generate-slides.mjs`
  - Gemini 카드뉴스 스크립트 생성 제거
  - `output/cardnews/{slug}/script-brief.md` 생성 방식으로 변경
  - 실제 카드뉴스 문안은 Claude/Codex가 `script.md`에 직접 작성

- [x] `scripts/run-pipeline.mjs`
  - `--slug` 처리 추가
  - `--step research|draft|review` 단독 실행 흐름 보정
  - 완전 자동 작성 대신 writer brief 생성 후 중지하도록 변경

- [x] `CLAUDE.md`, `.env.local.example`
  - Gemini 관련 안내 제거
  - API-free writing flow로 문서 갱신

- [x] Writer length 기준 변경
  - 기존 2,800단어대 글이 너무 길어 앞으로 1,900-2,300단어 목표
  - Reviewer 최소 단어 수 기준도 1,800단어로 조정

---

## Phase 6 테스트 결과

- [x] `node scripts/run-pipeline.mjs --step research --slug 166 --force`
  - 성공: `output/research/166_research.json`
  - DuckDuckGo 소스 5건 확보
  - 팩트 후보 5건 확보
  - Pexels 이미지 3장 확보

- [x] `node scripts/run-pipeline.mjs --step draft --slug 166`
  - 성공: `output/drafts/166_writer-brief.md`
  - 성공: `output/drafts/166_draft.md` 직접 작성 완료

- [x] `node scripts/run-pipeline.mjs --step review --slug 166`
  - 성공: `output/review/166_review.json`
  - SEO 점수 100/100
  - 단어 수 2,831
  - GitHub에 `content/blog/166.md` private preview post 커밋 완료

- [x] Preview route 로컬 확인
  - dev URL: `http://localhost:4000/preview/166`
  - HTTP 200 확인
  - 글 제목 렌더 확인
  - `Approve and publish` 버튼 렌더 확인

- [x] `npm.cmd run build`
  - 성공
  - 남은 경고: `metadataBase` 미설정 경고만 있음

- [x] 사람 승인 후 최종 발행
  - `node scripts/run-pipeline.mjs --approve 166`
  - Amazon 링크 삽입 완료: `output/final/166_final.md`
  - GitHub `content/blog/166.md` public 업데이트 완료
  - `topics-queue.json` ID 7 -> `done`
  - 공개 URL 확인: `https://www.epickor.com/blog/166` HTTP 200

- [x] 166번 썸네일 복구
  - `next.config.ts`에 `images.pexels.com` 허용 추가
  - GitHub master 직접 업데이트 커밋: `0ee2997a`
  - Vercel 이미지 최적화 URL HTTP 200 확인

- [x] 이번 프로세스 회고 후 재발 방지 보강
  - Reviewer Agent 문서의 단어 수 기준을 1,800단어로 통일
  - `run-pipeline.mjs`의 다음 slug 계산이 topics queue의 `generated_slug`도 보도록 수정
  - slug가 지정됐을 때 엉뚱한 `in_progress` 주제를 잡지 않도록 topic 선택 로직 수정
  - 리서치 소스 3건 미만 또는 이미지 2장 미만이면 파이프라인 중단
  - 일반 문화 글에는 관련도 낮은 Amazon 링크를 삽입하지 않도록 수정
  - topics queue ID 8을 `pending`으로 복구

---

## 다음에 해야 할 작업

- 다음 신규 글은 167번으로 진행
- 필요하면 166번 카드뉴스 생성:
  `node .claude/skills/cardnews/scripts/generate-slides.mjs --draft output/drafts/166_draft.md --research output/research/166_research.json --slug 166`

---

## 사람 검토 대기

- 현재 없음

---

## 환경 변수

필요:

```bash
STUDIO_GITHUB_TOKEN=
PEXELS_API_KEY=
PREVIEW_SECRET_TOKEN=
```

불필요:

```bash
GEMINI_API_KEY=
GEMINI_MODEL=
```

---

## 현재 주의점

- `content/data/topics-queue.json`에서 7번은 `done` 처리됨. 8번은 `pending`으로 복구됨.
- DuckDuckGo 기반 리서치는 Gemini 검색보다 요약 품질이 약할 수 있다. 초안 작성 시 소스 URL과 팩트 후보를 반드시 사람이/Claude가 재검토해야 한다.
- 카드뉴스는 `script-brief.md` 생성 후 `script.md`를 직접 작성해야 PNG 렌더가 가능하다.
- production preview가 동작하려면 이번 로컬 코드 변경(`app/preview`, `app/api/preview`, `next.config.ts`, pipeline scripts 등)을 GitHub master에 반영해야 한다.
- 로컬 git은 현재 `origin/master`와 diverge 상태다. GitHub API로 직접 올린 166번 글과 `next.config.ts` 원격 커밋 때문에, 다음 코드 push 전에는 fetch/rebase 또는 별도 정리 커밋 전략이 필요하다.

---

## 진행률

| Phase | 상태 |
|-------|------|
| Phase 0: 기반 세팅 | 완료 |
| Phase 1: 핵심 스크립트 | Gemini 제거 방식으로 수정 완료 |
| Phase 2: 미리보기 시스템 | 완료 |
| Phase 3: AGENT.md | 완료 |
| Phase 4: 카드뉴스 | 브리프 생성 방식으로 수정 완료 |
| Phase 5: CLAUDE.md | 갱신 완료 |
| Phase 6: 전체 테스트 | 166번 발행 완료 |
 
---

## Latest Update - 2026-04-28 Amazon Affiliate Guardrail

- Reworked runtime Amazon insertion so it reads from `content/data/amazon-links.json` instead of a separate hardcoded product list in `lib/markdown-enhancer.ts`.
- Added conservative matching:
  - products need strong tag/content relevance;
  - max 2 cards per post;
  - one affiliate section near FAQ/conclusion instead of mid-article and bottom spam.
- Added an explicit frontmatter gate:
  - Amazon cards render only when a post has `amazon: true`.
  - Currently enabled for:
    - `content/blog/160.md` Korean sunscreen
    - `content/blog/153.md` Isaac Toast
- Added relevant Amazon search links for Korean sunscreen, sun sticks, Korean toast tools, and sweet breakfast ingredients.
- Updated Studio Amazon Links UI/API type support to preserve product `tags`.
- Removed automatic product JSON-LD injection from blog pages because the previous schema used generic/fake product details and could create SEO risk.
- Verification:
  - `npm.cmd run build` passed.
  - Static HTML check shows `Helpful Shopping Picks` appears only in `.next/server/app/blog/153.html` and `.next/server/app/blog/160.html`.

Next recommended step:

- Commit, push, deploy, then verify production `/blog/160` and `/blog/153` include the affiliate section and other pages do not.

---

## Latest Update - 2026-04-28 Amazon Link Inventory Follow-Up

- Clarified Amazon state:
  - Auto-rendered Amazon cards are gated by `amazon: true`.
  - Current auto-card posts: `153`, `160`.
  - Some posts can still contain inline Amazon links directly in markdown.
- Added new representative-provided links to `content/data/amazon-links.json`:
  - Loop Station: `https://amzn.to/3ZMKSub`
  - Vocal Microphone: `https://amzn.to/4b0pyrm`
  - Men's Luxury Blazer: `https://amzn.to/4rYfeWu`
  - Fashion Sunglasses: `https://amzn.to/4kTVIZe`
- Replaced generic Amazon search links with affiliate links:
  - `content/blog/156.md`: loop station and vocal microphone links
  - `content/blog/136.md`: men's luxury blazer and fashion sunglasses links
- Left unlabeled URLs pending because the product names/categories were not provided:
  - `https://amzn.to/4kHI4YW`
  - `https://amzn.to/3OSRe8Y`
- Verification:
  - `amazon-links.json` parses successfully.
  - `npm.cmd run build` passed.

Recommended future process:

- When an article needs monetization and no matching Amazon product exists, ask the representative for the exact affiliate link instead of inserting generic search links.

---

## Latest Update - 2026-05-04 Reels Review Pass Workflow

- Added a two-step Reels visual approval flow for `/reels-review/170`:
  - `Submit review pass` saves the current human review state and records scenes that need replacement sourcing.
  - `Finalize visual review` remains the hard gate before voice/Remotion work and requires at least two ranked visuals per scene.
- Submitted the current visual review pass for slug `170`.
- Generated:
  - `output/reels/170/review-pass.json`
  - `output/reels/170/replacement-requests.json`
- Scene 5 was the only blocker after the first pass. It had one ranked ramen visual and four replacement requests.
- Sourced replacement-ready Scene 5 candidates for fried rice, Korean drinks, snacks/drink at keyboard, and snack/soda cutaway.
- Current status: `output/reels/170/scenes.json` is `replacement_candidates_ready`.
- Next human action: open `http://localhost:4000/reels-review/170`, rank at least one more Scene 5 visual, then finalize visual review if the scene feels strong enough.

---

## Latest Update - 2026-05-04 Reels Finalize UX Feedback

- Human finalized slug `170`, but the dashboard feedback was too subtle.
- Reset `output/reels/170/scenes.json` from `visuals_approved` back to `visuals_ranked` so the representative can press `Finalize visual review` again.
- Removed the temporary `finalizedAt` field from `output/reels/170/approved-visuals.json`; ranked visual selections were preserved.
- Improved `/reels-review/[slug]` UX:
  - Buttons now show `Saving review pass...` or `Finalizing...` while writing.
  - Success/follow-up messages appear as a large top status panel instead of a small text line.
  - Finalized state disables further ranking/replacement buttons and shows the next step: ElevenLabs voice, then Remotion preview.
  - `Submit review pass` clearly records replacement sourcing needs without acting as final approval.

---

## Latest Update - 2026-05-04 Reels Voice/Remotion MVP

- Human finalized slug `170`; API/status now reports `visuals_approved`.
- ElevenLabs execution is blocked because `.env.local` has placeholders but no values for:
  - `ELEVENLABS_API_KEY`
  - `ELEVENLABS_VOICE_ID`
- Recorded voice blocker in `output/reels/170/voice-status.json`.
- Added scripts:
  - `.claude/skills/reels/scripts/prepare-assets.mjs`
  - `.claude/skills/reels/scripts/build-remotion-props.mjs`
- Updated ElevenLabs TTS helper so future narration audio is saved both to:
  - `output/reels/{slug}/audio/narration.mp3`
  - `public/assets/reels/{slug}/audio/narration.mp3`
- Downloaded finalized visual assets for slug `170` into `public/assets/reels/170/`.
- Generated:
  - `output/reels/170/asset-manifest.json`
  - `output/reels/170/remotion-props.json`
- Installed matching Remotion packages:
  - `remotion@4.0.457`
  - `@remotion/cli@4.0.457`
- Added Remotion scaffold:
  - `remotion/Root.tsx`
  - `remotion/ReelComposition.tsx`
  - `remotion/types.ts`
  - `remotion/README.md`
- Confirmed composition with `npx remotion compositions ...`:
  - `EpicKorReel170`
  - `1080x1920`
  - `30fps`
  - `1260 frames / 42 seconds`
- Started visual-only Remotion Studio at `http://localhost:4001`.
- Rendered preview frame:
  - `output/reels/170/preview-frame-010.png`
- Note: Remotion currently copies the whole existing `public/` directory, around 700MB during bundling. Next improvement should use a dedicated Remotion public directory or otherwise reduce copied assets before regular rendering.
- `npm.cmd run build` passed after Remotion install and scaffold.
- `npm install` reported 6 vulnerabilities. Do not run `npm audit fix --force` without a separate risk review.
