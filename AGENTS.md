# EpicKor Blog - Codex/Codex 운영 가이드

## COO_BRIEF

- 역할: 한국문화/여행/라이프스타일 기반 해외 SEO 블로그와 소셜 콘텐츠 퍼널.
- 최종 목적: EpicKor 자체가 별도 브랜드가 되어 Amazon affiliate와 콘텐츠 수익화로 이어지는 구조를 만든다.
- 핵심 퍼널: Instagram Reels/card news -> EpicKor.com 방문 -> Amazon affiliate 클릭 -> 수익화.
- 운영 리듬: 카드뉴스는 Tuesday/Wednesday/Thursday, Reels는 Friday/Saturday/Sunday 기준으로 관리한다.
- 주의: VDOLAB 본진과 별도 수익화 퍼널이지만, 콘텐츠 운영 품질과 자동화 경험은 다른 프로젝트에 참고 자산이 된다.

## EpicKor North Star

- EpicKor's ultimate business goal is Amazon affiliate monetization through the combined loop of Instagram Reels, Instagram card news, and EpicKor.com website content.
- Do not treat content production as the final goal. Reels and card news should warm attention, reveal proven topics, and drive people toward useful website guides that can naturally support Amazon affiliate clicks.
- When choosing next work, always consider whether the task improves at least one part of this funnel: Instagram reach/quality -> website visits -> Amazon affiliate clicks -> Amazon earnings.
- Protect the current upload rhythm while optimizing for monetization: Tuesday/Wednesday/Thursday card news, Friday/Saturday/Sunday Reels.

## EpicKor Business Section Strategy v3

- EpicKor is adding a separate business/industry section without reducing the existing culture, travel, lifestyle, shopping, card-news, or Reels operating rhythm.
- The business section goal is not a general NYT-style expansion. It should become a niche trade-media surface that introduces Korean SMEs, industries, sourcing paths, and market-entry context to overseas buyers, operators, and Korea-market researchers.
- Strategic parent-company context: Tripclip is a 10-year video-production company and export-voucher supplier. The business section should strengthen the position "a production company that also owns a working overseas-facing Korea media channel."
- Use `/business/` as the separate URL area for business posts. Do not fold business content into normal `/blog/` posts once the route exists.
- Do not redesign the whole site around business content before the 2026-10-05 review. Add minimal navigation and routing only.
- Maintain the content ratio target after launch: culture section 3 posts/day plus business section 1 post/day, roughly culture 3 : business 1.
- Business posts are not a separate paid-placement or sponsored-content monetization product at launch, but they should still include relevant Amazon affiliate links/CTAs under the normal Amazon Affiliate Placement Rules unless the representative explicitly says to omit them. Keep the links practical, subtle, and useful for business readers, such as Korea business books, sourcing books, trade-show planning tools, market-research books, or travel/work essentials.
- Business posts must be in English. Company names should use official English names first.

### Business Content Types

- Type A: Search-demand guide.
  - Audience: overseas buyers sourcing from Korea and operators researching Korean market entry.
  - Examples: `how to find suppliers in Korea`, `K-beauty OEM/ODM`, `Korean cosmetics wholesale`, `Korea {industry} industry explained`, `doing business in Korea`.
  - Tone: practical operator guide, not broad news commentary.
  - Statistics, regulations, export figures, and institutional claims must come from official or highly reliable sources such as Korean government, public agencies, trade associations, official company materials, filings, or clearly cited research. Do not use unverifiable numbers. Label estimates as estimates.
- Type B-1: Client story.
  - Only use companies for which Tripclip actually produced video work. Proposal-only companies are not B-1 candidates.
  - Representative must select the target and secure client consent before writing starts.
  - Publicly embeddable production video is mandatory. Consent must cover both sensitive information and video embedding.
  - Free placement for now. If later converted to paid placement, sponsored disclosure is mandatory.
  - Add only one short Tripclip production-credit line at the end.
- Type B-2: Non-client company spotlight.
  - Use only public information such as official website, press releases, filings, public interviews, and news.
  - No consent is required, no video embed, and no Tripclip credit.
  - Keep the tone editorial: discovering interesting Korean companies for overseas readers. Do not write vendor brag copy.

### Business Workflow And Trust Rules

- Weekly business topic lists require representative approval before drafting. After topic approval, Type A and B-2 posts may move through the pipeline autonomously.
- B-1 client stories are blocked until representative confirms client selection and consent. Do not draft first and ask later.
- Do not invent fake authors, fake headshots, fake credentials, or fictional editorial personas.
- Business posts should use a transparent brand/team byline such as `EpicKor Business Editor` by default. Do not create fake individual authors, fake headshots, or fictional credentials. Real-name bylines are optional only if the representative explicitly approves them later.
- Create and maintain a business editor profile page describing EpicKor's business editorial desk and Tripclip's 10 years of video production and export-voucher field experience.
- Guide posts and company stories should link to each other inside `/business/` to build section depth and session continuity.
- Business posts can enter the Reels/social candidate pool, but do not auto-distribute all business posts to social. Representative selection remains required.
- The 2026-10-05 review gate decides whether to expand the section and start a larger site redesign. Track `/business/` impressions, clicks, overseas IP traffic, buyer-like traffic, and inbound company/client interest against the starting GSC baseline.

### Business Technical Backlog

- Add `/business/` routing and category structure while preserving the existing culture post structure.
- Add Business to navigation with minimal disruption.
- Add sitemap coverage and GSC submission path for `/business/`.
- Add three templates: search-demand guide, client story with video embed/credit, and non-client spotlight without embed/credit.
- Add metadata fields for business post type, B-1 consent status, and video embed permission.
- Add `/business/` separated GSC/analytics reporting and a baseline snapshot before launch.
- Add a weekly topic-candidate approval workflow; approved topics may proceed, unapproved topics must not be drafted.

## Editorial Category Rules

- Every new public blog post must declare one explicit frontmatter `category`: `Issues`, `Travel`, `Food & Shopping`, `Beauty & Lifestyle`, or `Culture`. Business-section posts remain under `/business/` and are labeled `Business` by route; do not duplicate them into `Issues` merely because they discuss a company or industry.
- Use `Issues` only for date-anchored public controversies, policy or regulatory changes, politics, labor disputes, institutional failures, and significant social debates that require ongoing fact updates.
- Use `Culture` for people, broadcasting, entertainment, customs, language, history, and social-life explainers when the post is not primarily a current public controversy.
- The `/issues/` page must select posts from explicit `category: "Issues"` metadata. Do not infer issue membership from title, description, tags, or broad labels such as `Business`, `Trend`, `Politics`, or `Education`.
- When an issue post becomes materially stale, update its facts and `updatedAt`, or remove the `Issues` category until it is current enough for the issue hub.

## Amazon Affiliate Placement Rules

- Every new or meaningfully updated blog post should include Amazon affiliate opportunities unless the representative explicitly says to omit them.
- Default to two slim horizontal `.affiliate-inline-cta` boxes per monetized post: one in the middle body after the reader has enough context, and one later near a practical decision, packing, shopping, or next-step section.
- Do not use more than two visible CTA boxes in a normal article unless the representative approves it. Extra Amazon links, if needed, should stay as quiet contextual text links.
- Use the most relevant product available in `content/data/amazon-links.json`. If no perfect product exists, use the closest useful Amazon link or search link and explain why it is still worth comparing.
- CTA copy should create a reason to click without sounding like a hard sell: compare before a trip, build a simple kit, recreate the routine at home, or avoid buying the wrong item.
- The first affiliate CTA or nearby copy must include an Amazon Associate disclosure.
- All Amazon links must open in a new tab and render with `rel="nofollow sponsored noopener noreferrer"`. Other external links must also open in a new tab with `rel="noopener noreferrer"`.
- Preserve editorial trust: the article should still feel like a useful Korea guide first, not an ad page.

## Agoda Affiliate Placement Rules

- Use Agoda by default only when a travel post has natural accommodation or booking intent, such as where-to-stay decisions, city or neighborhood comparisons, overnight airport/layover planning, hotel-access logistics, or itineraries that require choosing a base. Do not force Agoda into entry-document, transit-only, or general culture posts where accommodation is not part of the reader's decision.
- Keep the normal ceiling of two visible affiliate CTA boxes per article. On an Agoda-ready travel post, replace the weaker Amazon CTA with one Agoda CTA instead of adding a third box. Retain the other Amazon CTA only when trip gear or another product remains genuinely useful.
- Start with undated city, area, or airport-area deep links under the approved EpicKor Agoda CID. Do not hard-code check-in/check-out dates. All Agoda links must open in a new tab and use `rel="nofollow sponsored noopener noreferrer"`.
- The first Agoda CTA or nearby copy must clearly disclose that EpicKor may earn a commission from qualifying bookings at no extra cost to the reader.
- Track Agoda clicks separately with `affiliate_agoda_click`, including the content slug/type, CTA context, CID, and destination identifier when available.
- Expand in stages only when click data supports it: city comparison -> neighborhood or use-case accommodation guide -> carefully selected property comparisons. Review pilot click data for at least 2-4 weeks before broad rollout.
- Do not call a hotel article a firsthand review unless EpicKor or the approved bylined reviewer actually stayed there. Without a real stay, label it as a comparison, shortlist, booking guide, or verified property overview based on current official/public information.
- Before linking a specific property, verify location, airport/station access, current official property information, and variable booking terms. Tell readers to confirm dates, taxes, cancellation conditions, room type, and final price on Agoda rather than presenting a cached price as permanent.

## Card News Brand Rules

- Do not jump to downstream production before the current content stage is actually complete. For a new blog post, "draft written", "review passed", or "build passed" does not mean published. Before starting related Reels or card news, explicitly confirm the blog's final review, publish/deploy status, and public URL verification, unless the representative directly asks to skip ahead.
- Card news is a social carousel, not a blog excerpt. Each card needs one clear message and a reason to swipe.
- Every card must have a relevant image. For real-world/high-visual topics, photo-first is mandatory; do not let a carousel become SVG-only or graphic-only unless the representative explicitly approves that exception in the current task.
- If the post does not have enough suitable images, source usable external photos before falling back to generated/graphic visuals. Prefer post-owned images first, then Pexels or other license-safe sources, then generated/owned visuals when search fails.
- Every card should carry a Korea/EpicKor angle through `kicker:` text, such as `KOREA SPF GUIDE`, `SEOUL TRAVEL TIP`, or `K-BEAUTY TEXTURE MAP`.
- Every rendered card must show `EPICKOR.COM` as the watermark text. Do not use only `EpicKor` as the watermark label.
- Card 01 is also the Instagram profile-grid thumbnail. Keep its main text centered inside a conservative safe area, not pinned to the left or bottom edge, so the hook remains readable in the grid view.
- Card-news output folders use the date-prefixed convention `YYYY-MM-DD_{slug}`, for example `public/assets/cardnews/2026-05-08_090/`. Keep `public/assets/cardnews/CARDNEWS_INDEX.md` updated for manual upload-status tracking.
- Card-news images must be fresh and varied. Do not reuse the same `image:` path within one carousel.
- Reviewer must reject repeated `image:` paths inside the same carousel. Do not treat same-carousel duplicates as warnings. If a repeated crop is truly needed, save it as a separate intentional derivative asset and document the reason in `image-sources.md` and `HANDOFF.md`.
- Do not reuse an image that already appears in another card-news carousel for a different post. Similar search keywords are not an excuse; select a new visual, new crop, or new source so each post has its own image identity.
- Card-news images for Korea explainers must be Korea-first. Use visibly Korean places, Korean products, Korean signage, Korean packaging, or Korea-shot source metadata whenever the topic is Korean daily life, Korean food, travel, beauty, shopping, or culture.
- Do not use images that are visibly from another country for Korea explainers. Foreign-language packaging, non-Korean convenience store brands, non-Korean streetscapes, or clearly non-Korean store interiors are disqualifying unless the card is explicitly making an international comparison.
- If a topic-specific Korean image cannot be found, use a culturally neutral close-up, generated/owned visual, or a documented crop rather than a visibly foreign stock image. A graphic-only substitute is a last resort and must be recorded.
- Photo coverage gate: when the source post has usable post-owned photos or external photos can be sourced, the carousel must not become photo-free or mostly graphic-only. For a 7-card high-visual carousel, use photos on at least 5 cards; food, venues, travel, weddings, shopping, beauty, products, and places should normally use photos on all 7 cards.
- Do not allow 3 or more consecutive image-free cards unless the representative explicitly approves it and the exception is recorded in `HANDOFF.md`.
- High-visual topics such as cars, food, travel places, shopping, beauty, celebrities, products, and venues should normally use photos on 5+ cards in a 7-card carousel. If the same source subject truly must appear more than once, save clearly distinct derivative assets with different paths and document the reason; never repeat the same `image:` path.
- Before final save, Reviewer must compare the candidate `image:` values against existing `public/assets/cardnews/*/script.md` files and flag any cross-post duplicates.
- Reviewer must inspect rendered PNGs card by card for image relevance, mobile readability, watermark presence, and swipe logic.
- Card-news visual approval requires a written Visual Fit Score: direct topic fit 30, Korea/context fit 25, no misleading/text/watermark risk 20, carousel variety/coherence 15, rendered mobile quality 10. Do not show the user a carousel unless the average is at least 90/100 and no individual card is below 88/100. Any misleading country/context mismatch caps that card at 59; graphic-only use where a photo could be sourced caps that card at 79.
- Before recording "Reviewer visually inspected" in `HANDOFF.md`, run `node .Codex/skills/cardnews/scripts/review-cardnews.mjs --slug {slug}` after rendering. The script passing is not enough by itself; it is the structural gate before manual PNG inspection.
- Record card news agent roles and rendered-image review in `HANDOFF.md`.

## Instagram Revival Card News Strategy

- EpicKor should build a backlog of 30 high-quality card news carousels before treating card news as a fully new-topic channel.
- Instagram upload rhythm confirmed by the representative: Tuesday/Wednesday/Thursday are card-news upload days, and Friday/Saturday/Sunday are Reels upload days. Treat this as the default operating calendar unless the representative overrides it.
- Prioritize card news topics from historically validated demand:
  - Past EpicKor Instagram Reels that earned high views or strong engagement.
  - EpicKor GSC pages/queries with proven impressions, clicks, or clear search demand.
  - Recently improved posts only when they overlap with proven Reels/GSC demand or have strong visual/social potential.
- Do not default to brand-new, unvalidated card-news topics while the Instagram account is being reactivated after a long posting pause.
- The near-term Instagram recovery sequence is:
  1. Produce 10-30 card news assets from proven Reels/GSC topics.
  2. Gradually improve carousel quality, hooks, visual relevance, and swipe logic.
  3. Continue publishing new EpicKor.com posts in parallel.
  4. Build or improve Reels production automation during the card-news ramp.
  5. Use card news posting to warm the Instagram account back up.
  6. Resume Reels uploads once the account has regained activity and content rhythm.
- Strategy Team must consider this Instagram revival plan when recommending the next card-news target.

## Instagram Reels Production MVP Strategy

- Reels production runs in parallel with the 30-card-news revival backlog. It must not replace the active card-news sequence.
- Current production reality: card-news backlog is larger than Reels inventory. When recommending next work, protect enough Reels supply for the Friday/Saturday/Sunday upload rhythm.
- Reels must be produced from newly written EpicKor posts going forward. Existing older posts may continue to support card-news backlog work, but do not start a new Reel from an older/existing post unless the representative explicitly requests an exception.
- For new Reels, the required sequence is: write new post -> representative final review -> publish/deploy -> public URL verification -> Reels production.
- Instagram scheduling pattern: prepare and schedule content in batches of 3 Reels plus 3 card-news carousels. Do not recommend uploading/scheduling a single approved Reel by itself unless the representative explicitly asks. If one Reel in a batch is ready early, keep it as upload-package-ready until the other two Reels in the batch are also ready.
- Current batch pattern example: Reels 173, 174, and 175 should be completed first, then scheduled together as a 3-Reel batch. Existing prepared card-news assets should also be scheduled as a 3-carousel batch.
- Reels should start with newly published EpicKor posts, especially posts with strong social hooks and clear visual scenes.
- Starting 2026-07-14, Blog `293` Reels 2.0 V04 is representative-rejected and must not be used as the creative baseline. Keep the proven pre-293 Reel structure, then improve its hook, voice, video mix, and single motion-card treatment under the Reels 2.1 recovery standard in `.claude/skills/reels/creative_performance_standard.md`.
- Every new Reels candidate must pass the Reels Creative Performance Standard before script, dashboard, TTS, or rendering work. Save the creative brief and Viral Fit Score in `output/reels/{slug}/strategy.md`.
- The first Reels goal is not full automation. Build one MVP, note friction, then upgrade the pipeline.
- Every Reels project should use numbered scene files under `output/reels/{slug}/`.
- Human visual approval is required before final Remotion rendering.
- The visual review dashboard should answer one question quickly: does this image fit this numbered scene?
- During Reels visual research, keep a short list of strong topic-relevant images that were found but not selected for the Reel. If they improve the source post, add them back into the blog post after the Reel visual search instead of replacing already usable post images. For Blog 176 specifically, keep the current two images and use the Reels research pass to find additional Korean jjimjilbang-related images for the article if suitable.
- New Reels should use exactly one motion-card insert for a normal 32-42 second Reel by default. Do not use two or more motion cards unless the representative explicitly requests a slug-specific exception and it is recorded in `HANDOFF.md`.
- Place the single motion card around 60-75% as the payoff. It must use a full-bleed topic-relevant image or video background with a controlled dim/blur veil and a semi-transparent card; plain black motion-card screens are not allowed.
- Write the narration around that motion card: include a spoken setup, synchronize each row/reveal to the corresponding narration beat, and finish with a payoff line. The card cannot be an unrelated summary pasted over the script.
- Reels motion cards must not look empty in the middle. Avoid or revise templates/copy combinations that leave the center visually hollow; prefer center-filled rows, checklists, boards, receipts, or clearly occupied focal layouts.
- Reels motion cards must reserve a clean narration-caption zone. The spoken subtitle layer must not overlap card rows, labels, footer text, badges, or CTA text; if a template uses lower-card content, move the caption placement or redesign the card before rendering.
- Write new Reels narration in natural conversational American English and choose either `male_friend` or `female_culture_travel` before TTS. Female narration is fully acceptable and may be preferred for culture, food, travel, lifestyle, and warning/mistake angles. Keep it clear and non-slangy; avoid stiff essay/blog phrasing, lecture tone, or overly polished written-English sentences.
- Generate an 8-12 second voice audition for a new or changed voice lane. Use natural speaking speed by default; do not apply a blanket `0.8x` slowdown. Reject robotic pauses, drawn-out words, and calm blog-read cadence before full TTS.
- Reels narration should be generated in short parts, around three parts for a 35-45 second Reel, rather than one full script file. This reduces slow or uneven voice behavior.
- Reels subtitles must follow context-aware phrase beats. Do not split tiny fragments such as `is`, `and`, or `to your` onto their own screen unless the fragment is intentionally designed as a typography beat.
- Reels subtitle timing should feel slightly proactive: the caption should appear just before, or exactly as, the narration lands. A small lead such as 6 frames at 30fps is acceptable when it makes the pacing feel more responsive.
- Reels playback-continuity gate is mandatory before a render can be called final:
  - Probe every selected video with `ffprobe` and record source FPS, total frames, `trimBefore`, and required composition frames in `output/reels/{slug}/continuity-manifest.json`.
  - Do not use a hard `loop` when a scene outlasts its usable footage. Use a second distinct clip, or pre-render a forward/reverse ping-pong proxy with the duplicated endpoint removed. Reverse playback must be prepared as a proxy rather than improvised inside the final composition.
  - Use frame-accurate final-render playback such as Remotion `OffthreadVideo`; do not rely on legacy browser video looping for exact cut timing.
  - Do not naively convert 25fps footage to 30fps by duplicating frames. Keep a native cadence, replace the source, or create a reviewed interpolation proxy. Reject optical-flow artifacts, ghosting, and duplicate-frame judder.
  - Cross-media changes need a 12-22 frame opacity overlap. Never mount an opaque replacement background while the incoming photo/video is still transparent. Scene transitions must fully cover or crossfade the underlying cut.
  - Inspect every source endpoint, internal media change, and scene boundary at `-2, -1, 0, +1, +2` frames. Any flash, hard reset, repeated endpoint, or motion jump blocks approval.
- Reels text and caption-safety gate is mandatory:
  - Plan critical ONS line breaks explicitly at 1080x1920. Use a deliberate `<br>` or `whiteSpace: nowrap`; do not let the browser decide a phrase break. Never separate grammar units such as `BEFORE YOU USE / IT`, articles from nouns, prepositions from objects, or auxiliary verbs from complements.
  - Reserve the actual narration-caption band dynamically. The default lower exclusion begins at `y=1400`; all ONS, card rows, labels, footer copy, and CTA copy must end at or above `y=1340`, leaving at least 60px before the caption band. If the longest caption begins higher, its measured top edge becomes the exclusion boundary.
  - Check the longest two-line narration caption in every ONS and motion-card scene at full 1080x1920 resolution. Moving only the caption `bottom` value is not proof of clearance.
  - A contact sheet is not sufficient for motion QA. Review the full rendered video on a phone with sound on and off; any flash, judder, unplanned wrap, orphan word, or caption/ONS collision blocks final status.
- Reels render files must be versioned, such as `epickor-reel-{slug}-v005.mp4`; do not overwrite previous candidate renders during review.
- The first scene is both the thumbnail and intro. Prepare three 3-5-word thumbnail directions (`Mystery`, `Mistake`, `Decision`) and three spoken opening variants, then select the pair with the clearest stakes. Do not begin on black, a generic mood shot, or a topic-title restatement; show direct visual proof or action in the first frame.
- Final Reels should include a clean `epicKor.com` outro when appropriate.
- Reels outro/CTA text should use `epickor.com` only. Do not show post-specific paths such as `/blog/{slug}` inside the video frame because viewers cannot click them.
- Reels visual sourcing priority:
  1. EpicKor-owned, official, licensed, or otherwise usable real vertical video.
  2. Real vertical images already used by the source post or found during topic-specific research.
  3. Pexels or other usable external vertical assets.
  4. Generated images or video only when direct real material cannot fill a safe supporting beat.
- Google AI Pro subscription credits may be used manually through Flow/Whisk for selected 3-5 second bridge or establishing shots. Gemini Developer API billing is separate and must not be enabled, funded, or automated without explicit representative approval.
- AI-generated visuals must remain at or below 25% of selected photo/video cuts. They must not carry factual proof, Korean text/signage, property/brand claims, or delicate human/hand/object mechanics unless artifact-free under frame-by-frame review.
- Reels image orientation and placement rule:
  - For Reels, source vertical images first. This is the default, not an optional polish step.
  - More than 50% of selected photo cuts must be found/source vertical images.
  - If suitable found vertical images are genuinely unavailable, generated vertical images may be used, but keep them within 25% of selected photo cuts.
  - If a horizontal image is unavoidable, keep horizontal exceptions to roughly 10-15% of selected photo cuts and render each one as a centered 1:1 square image, not as a full-width/landscape frame.
  - For current Remotion output, horizontal exceptions should use `fitMode: "square_center"`.
  - Do not approve a Reel only because the vertical/horizontal portion and layout look good. The image must also directly fit the scene topic.
  - Source true 9:16 material whenever possible; do not simulate vertical quality with repeated zooms on horizontal stills. Keep all first-frame copy and key subjects inside the conservative profile-grid safe area.
- Reels Korea-context visual rule:
  - EpicKor Reels about Korea must use visibly Korean, topic-specific images whenever reasonably findable.
  - "Looks vaguely Asian" or "generic city/food/travel mood" is not enough.
  - Incheon Airport scenes should show Incheon Airport, AREX, Korean airport signage, Korea airport transit, or clearly Korea-relevant airport/train context.
  - Seoul running scenes should show Seoul, Han River, Korean running paths, Korean night streets, or Korean running-crew context.
  - Korean department-store food hall scenes should show Korean department-store basements, Seoul food halls, Korean bakery/dessert counters, Korean packaged snacks, Korean signage/receipts/restrooms/seating, or close direct food-hall evidence.
  - The representative has explicitly approved using direct web/reference images for Reels when they are the best topic fit. Do not reject a strong Korean-context image only from excessive copyright anxiety; record the source in `image-sources.md` and keep the visual truthful to the topic.
  - Reviewer must reject non-Korean or misleading country/context visuals when Korean-topic visuals are reasonably available, even if the crop, motion, and visual rhythm look good.
- Reels visual variety and duplicate gate:
  - Do not approve a Reel just because repeated images have different filenames, crops, or zoom positions. A copied crop, same source photo, same article photo set, same scene/session, or visually near-identical subject is still a duplicate risk.
  - In one normal 35-45 second Reel, no single source family should appear more than once unless the scene is explicitly about returning to that exact place/object and the exception is documented in `image-sources.md` and `HANDOFF.md`.
  - No two adjacent photo cuts may come from the same source family or look like the same moment/place from a different crop.
  - No thumbnail/opening image source family may be reused later in the Reel.
  - Reviewer must inspect the scene grid for visual fatigue: repeated skyline, same food counter, same airport hall/escalator, same runner group, same table/flatlay, or same store interior should block approval even when the file paths are unique.
  - Approval requires a written Reels Visual Variety Score: source-family uniqueness 30, scene-to-scene variety 25, direct topic/Korea fit 25, rendered mobile quality 10, no visual fatigue in opening/outro 10. Minimum average is 92/100 and no individual scene below 90/100.
- Reels 2.1 human-made finish gate is a hard reject, regardless of internal score, for: corporate-deck structure, generic stock mood, repeated templates, plain-black information screens, warped objects or hands, broken Korean text/signage, over-smooth AI motion, mismatched lighting, excessive still-image zooms, unnatural narration, or any scene that visibly feels AI-generated. Review the final candidate on a phone with sound both on and off. Representative rejection overrides all internal scores.
- Record Reels agent roles, dashboard review status, blockers, and next improvements in `HANDOFF.md`.

## Handoff And Strategy Check Rules

- At session start, read the root `HANDOFF.md` fast-start dashboard, then run `git status --short` and `git log -8 --oneline`. Do not load files under `docs/handoff/` by default.
- Search a Handoff archive only for a specific slug, decision, incident, or older rule, using `rg`, and read only the narrow matching range.
- Read the latest `output/strategy/week_*.md` only when choosing strategy or the next topic, not for every implementation task.
- Do not recommend a page as the next target only from GSC impressions or CTR. First check whether that page was already rewritten, published, or verified recently.
- Before recommending or drafting any new blog topic, run a duplicate-topic check against both `content/data/topics-queue.json` and existing `content/blog/` posts. Search the exact title terms, core keywords, and close variants with `rg`; if a topic is already `done`, has a `generated_slug`, or is substantially covered by an existing post, do not treat it as a new-post candidate. Recommend either a refresh/expansion of the existing slug or choose a genuinely distinct topic.
- Treat weekly strategy report "Recommended New Topics" lists as suggestions, not approvals. If a strategy report conflicts with current `topics-queue.json`, `HANDOFF.md`, or existing published content, the newer concrete repository state wins.
- When choosing the next EpicKor task, explicitly apply the Strategy Team perspective: GSC opportunity, recency of prior edits, monetization potential, visual/card-news potential, and operational risk.
- After completing a meaningful EpicKor task, recommend the next work as priority 1, 2, and 3. For each priority, include the reason, expected impact, and any dependency or blocker. Priority 1 should be the safest/highest-leverage next move, not simply the newest idea.
- In normal completion replies, naturally include the next recommended move instead of waiting for the representative to ask. Keep it brief unless the representative asks for deeper planning.
- If Strategy Team guidance conflicts with recent `HANDOFF.md` or git history, prefer the newer concrete work record and explain the conflict to the user.
- If a completed task is missing from `HANDOFF.md`, add a correction entry before using that area for future prioritization.

## Blog Table Rules

- Any comparison, shortcut, recommendation matrix, product match, itinerary, checklist-by-category, or summary grid in a blog post must be inserted as a real table, not as loose aligned text.
- Prefer an HTML `<table>` wrapped in `<div class="table-scroll">` for important reader-facing tables so the rendered article looks clean on desktop and mobile.
- Reviewer must inspect rendered table sections in the browser. If a table looks like unstyled text, cramped columns, or broken mobile layout, the post is not ready.

> epickor.com | 한국 문화·여행·라이프스타일 영어 블로그
> 이 파일과 `HANDOFF.md`를 읽으면 현재 파이프라인을 바로 이어받을 수 있다.

---

## 프로젝트 기본 정보

| 항목 | 내용 |
|------|------|
| 사이트 | epickor.com |
| GitHub | 5414peace-hash/epickor-blog (branch: master) |
| 배포 | Vercel - master push 시 자동 배포 |
| 스택 | Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 |
| 글 작성 | Codex/Codex가 직접 작성 |
| 리서치 | DuckDuckGo keyless search + Pexels API |
| 수익화 | Amazon Affiliate |
| 최신 슬러그 | 166 -> 다음 글: 167 |

---

## 환경 변수

```bash
STUDIO_GITHUB_TOKEN=      # GitHub PAT (content/blog/ 커밋 권한)
PEXELS_API_KEY=           # Pexels 이미지 API
PREVIEW_SECRET_TOKEN=     # 프로덕션 /preview/[slug]?token=XXX 접근 토큰
```

---

## Communication Rule

- Address the user respectfully as "대표님" in Korean conversation.
- Do not use casual Korean speech (`반말`). Use polite, professional Korean (`존댓말`) by default.
- Keep explanations easy to understand, but maintain a respectful executive-facing tone.

---

## Render/Image Gate

Reviewer and Publisher agents must verify rendered images, not just markdown syntax.

- Local `/assets/` image paths must exist under `public/assets/`.
- Before asking the user to approve a preview, open the preview page and check that no broken image icons are visible.
- After publish/deploy, check the public URL again. If images are broken, the task is not complete.
- Record which agent performed this rendered-image check in `HANDOFF.md`.

## Blog Reference Image Standard

- Use corrected Blogs `222`, `223`, and `224` as the benchmark: real reference photos/screenshots with direct section-level value, not generic mood images or decorative graphics.
- Captions must never compensate for weak relevance. `not a specific`, `not the actual`, `general image`, `category illustration`, `similar to`, `stand-in`, `without implying`, and `included to show` are hard-reject phrases; replace or remove that image.
- When a real place, event, program, product, app, interface, venue, company, or institution is named, use the exact subject whenever a usable public/official/reference image is reasonably available. Vaguely Korean or Asian context is insufficient.
- Public articles may not be SVG-only. SVG diagrams are allowed only as useful supplements after sufficient direct real-photo or exact-screenshot coverage; high-visual topics should be real-image-led throughout.
- Do not expose internal AI/sourcing explanations in reader captions. `AI-generated`, `EpicKor generated visual`, fictional stand-ins, and generic proxy visuals are blocked when direct real references can reasonably be sourced.
- Credits should briefly state what the image actually shows and name the creator/source. Do not explain what it is not, why a proxy was used, or how it was generated.
- Before approval, run `npm run audit:image-context -- --slug {slug}`, inspect the rendered desktop and mobile page, and record a Blog Image Fit Score. Critical/high findings block publication.

Do not use or fund the Gemini Developer API without explicit representative approval. Google AI Pro's included Flow/Whisk credits may be used manually for scoped visual experiments under the Reels rules; subscription credits do not make API calls free.

---

## 파이프라인 흐름

이 파이프라인은 완전 자동 글쓰기 흐름이 아니다. API 할당량 문제를 없애기 위해 리서치와 검증은 스크립트가 돕고, 글과 카드뉴스 문안은 Codex/Codex가 직접 작성한다.

### Step 1 - 리서치 자동 생성

```bash
node scripts/run-pipeline.mjs --step research --slug 166
```

출력:

- `output/research/166_research.json`

내부 동작:

- DuckDuckGo keyless search로 소스/팩트 후보 수집
- Pexels API로 이미지 후보 수집

### Step 2 - Writer brief 생성

```bash
node scripts/run-pipeline.mjs --step draft --slug 166
```

출력:

- `output/drafts/166_writer-brief.md`

그 다음 Codex/Codex가 직접 작성:

- `output/drafts/166_draft.md`

초안은 반드시 `visibility: "private"`로 시작한다.

### Step 3 - 리뷰

```bash
node scripts/run-pipeline.mjs --step review --slug 166
```

출력:

- `output/review/166_review.json`

리뷰 통과 기준:

- `pass: true`
- `seo_score >= 70`

중요: 이 자동 리뷰는 형식/SEO 검사다. 다음 항목은 Codex/Codex가 사람 검토 전에 반드시 별도로 확인한다.

- 본문에 나온 작품명, 인물, 공개일, 플랫폼은 공식 사이트나 신뢰 가능한 최신 출처로 확인한다.
- 확인이 약한 작품은 "지금 볼 추천작"처럼 단정하지 않고, "추적할 작품" 또는 "공개 여부 확인 필요"로 낮춰 쓴다.
- 이미지가 글 주제와 직접 맞는지 확인한다. 예: K-drama 추천 글에는 일반 서울 풍경보다 TV/스트리밍/시청 분위기 이미지가 낫다.
- 사용자 지적으로 수정한 경우, `HANDOFF.md`와 최종 답변에 어떤 agent가 어떤 일을 했는지 요약한다.

### Step 4 - 사람 검토

리뷰 통과 후 미리보기 URL을 사람에게 전달한다.

```text
로컬: http://localhost:4000/preview/166
프로덕션: placeholder 토큰 URL을 쓰지 말 것. `.env.local`의 실제 `PREVIEW_SECRET_TOKEN`으로 URL을 만들고 HTTP 200과 글 제목/승인 컨트롤을 검증한 뒤에만 공유한다.
```

승인 전에는 발행하지 않는다.

### Step 5A - 카드뉴스

승인 후 카드뉴스 브리프를 만든다.

```bash
node .Codex/skills/cardnews/scripts/generate-slides.mjs \
  --draft output/drafts/166_draft.md \
  --research output/research/166_research.json \
  --slug 166
```

출력:

- `output/cardnews/YYYY-MM-DD_166/script-brief.md`

그 다음 Codex/Codex가 직접 작성:

- `output/cardnews/YYYY-MM-DD_166/script.md`

PNG 렌더:

```bash
python .Codex/skills/cardnews/scripts/html-to-png.py --slug 166
```

### Step 5B/6 - Amazon 링크 삽입 및 발행

사람 승인 후:

```bash
node scripts/run-pipeline.mjs --approve 166
```

내부 동작:

- Amazon 링크 삽입 -> `output/final/166_final.md`
- GitHub에 `content/blog/166.md` 커밋
- Vercel 자동 배포

---

## 핵심 파일 경로

```text
content/blog/                 발행된 포스트
content/data/topics-queue.json 주제 큐
content/data/amazon-links.json Amazon 링크 DB
output/research/              research.json
output/drafts/                writer brief 및 draft.md
output/review/                review.json
output/final/                 final.md
output/cardnews/YYYY-MM-DD_{slug}/ script.md 및 card PNG
output/reels/YYYY-MM-DD_{slug}/       한 릴스의 전부 — 컷플랜·매니페스트·나레이션·후보 렌더
output/reels/YYYY-MM-DD_{slug}/final/ 납품본 MP4 + instagram-caption.txt + upload-package.md
public/assets/reels/{slug}/           런타임 자산(컷 미디어·오디오) — 여기는 날짜를 붙이지 않는다
.Codex/skills/               팀별 스크립트
.Codex/agents/               팀별 운영 지침
```

> **릴스 폴더 명명 (2026-08-11)**: 아래 문서 전반에 나오는 `output/reels/{slug}/`는 실제로는
> `output/reels/YYYY-MM-DD_{slug}/`다. **한 릴스는 한 폴더**이고, 납품본은 그 안의 `final/`에 있다.
> **종전 `output/final/reels/` 트리는 흡수·삭제됐다** — 블로그 글 최종본 디렉터리 안에 얹혀 있어
> 혼란의 원인이었다. 재분리하지 말 것. **스크립트에는 계속 맨 슬러그를 넘긴다**
> (`--slug cheonggyecheon`) — `scripts/lib/reel-dir.mjs`의 `reelFolder()`가 날짜 폴더로 풀어주고,
> 폴더가 없으면 오늘 날짜로 만든다. `public/assets/reels/`만 예외로 날짜를 붙이지 않는다.

---

## 품질 기준

| 항목 | 배점 |
|------|------|
| 단어 수 1,800 이상 | 20 |
| H2 4개 이상 | 10 |
| description 120-155자 | 10 |
| 메인 키워드 첫 100단어 내 | 10 |
| FAQ Q&A 3개 이상 | 20 |
| 이미지 2장 이상 + alt | 10 |
| 내부 링크 1개 이상 | 10 |
| ogImage 있음 | 5 |
| tags 3개 이상 | 5 |

---

## 운영 주의점

- 로컬에서는 `http://localhost:4000/preview/{slug}`로 바로 검토한다.
- 프로덕션 preview에는 토큰을 붙인다.
- GitHub API로 글을 올리면 원격 master가 로컬보다 앞서갈 수 있다. 다음 코드 push 전에는 반드시 원격 상태를 확인한다.
- dirty main worktree를 피하기 위해 임시 Git worktree가 필요하면 `D:\dev` 루트에 만들지 말고 repo 내부의 명확한 임시 위치를 쓴다. 예: `D:\dev\epickor-blog\.tmp\worktrees\publish-{slug}` 또는 `D:\dev\epickor-blog\.codex-deploy\...`.
- 임시 worktree는 작업 완료 후 같은 세션에서 `git worktree remove {path}`로 제거하고, `git worktree list --porcelain` 및 `Test-Path {path}`로 잔여 등록/폴더가 없는지 확인한다.
- Amazon 링크는 모든 신규/주요 수정 글에 기본 포함한다. 관련 상품이 약하면 가장 가까운 Amazon 상품 또는 검색 링크를 문맥형 CTA로 넣고, 기본값은 얇은 `.affiliate-inline-cta` 박스 2개다.
- 최종 보고에는 이번 작업에 관여한 agent와 역할을 적는다. 예: Research Agent=소스/이미지 수집, Writer Agent=초안 작성/수정, Reviewer Agent=형식 검사+수동 사실/이미지 검토, Publisher Agent=private preview 반영.

---

## 이어받기 프롬프트

```text
루트 HANDOFF.md의 Fast Start 순서대로 현재 상태만 확인하고 작업을 이어서 진행해줘.
docs/handoff 아카이브는 특정 슬러그나 과거 결정이 필요할 때만 rg로 좁게 검색해.
설계서는 epickor-agent-design-v2.md를 참고해.
```


---

## [종료] 세션 종료 필수 규칙 (COO 보고 포함)

> 이 규칙은 선택이 아닌 의무다. 세션 종료 전 반드시 아래 두 단계를 모두 완료한다.

### Step 1 -- 이 폴더의 HANDOFF.md 현재 상태 업데이트
루트 `HANDOFF.md`는 250줄 이하의 fast-start 대시보드로 유지한다 (safe-write 사용):
- Current Snapshot, Active Work, Blockers, Next Recommended Work를 실제 상태로 갱신
- Recent Change는 최근 10건만 유지
- 긴 타임라인, 증거, 완료 세부사항은 `docs/handoff/YYYY-MM-DD_<topic>.md`에 기록
- 재사용할 규칙은 HANDOFF에만 남기지 말고 `CLAUDE.md`, `AGENTS.md`, 관련 `.claude/agents/*/AGENT.md`에 반영

### Step 2 -- D:\dev\HANDOFF.md 에 COO 요약 보고
D:\dev\HANDOFF.md 파일을 열어 해당 프로젝트 섹션에 아래 형식으로 기록을 추가한다
(safe-write 사용. 최근 20회분 유지. 21번째부터 오래된 것 -> HANDOFF_ARCHIVE.md 이동):

## [프로젝트명] | YYYY-MM-DD HH:MM
- 완료: [이번 세션 완료 항목 -- 한두 줄 요약]
- 진행중: [현재 진행 중인 작업 + 진행률]
- 다음 할 일: [다음 세션 첫 번째 할 일]
- 블로커: [없으면 "없음"]
- 메모: [COO가 알아야 할 특이사항, 없으면 "-"]

### [체크] 종료 체크리스트
세션을 닫기 전 아래를 확인한다:
- [ ] 이 폴더의 HANDOFF.md 업데이트 완료 (safe-write 사용)
- [ ] D:\dev\HANDOFF.md 의 이 프로젝트 섹션 기록 추가 완료 (safe-write 사용)
- [ ] CEO에게 세션 종료 보고 (완료 내용 한 줄 요약, 존댓말)
