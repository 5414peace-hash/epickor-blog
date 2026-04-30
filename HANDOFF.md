# HANDOFF - EpicKor Agent Teams v2

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
# 최종 업데이트: 2026-04-27 07:45:24 | 업데이트한 에이전트: Publisher

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
