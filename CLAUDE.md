# EpicKor Blog - Claude/Codex 운영 가이드

## EpicKor North Star

- EpicKor's ultimate business goal is Amazon affiliate monetization through the combined loop of Instagram Reels, Instagram card news, and EpicKor.com website content.
- Do not treat content production as the final goal. Reels and card news should warm attention, reveal proven topics, and drive people toward useful website guides that can naturally support Amazon affiliate clicks.
- When choosing next work, always consider whether the task improves at least one part of this funnel: Instagram reach/quality -> website visits -> Amazon affiliate clicks -> Amazon earnings.
- Protect the current upload rhythm while optimizing for monetization: Tuesday/Wednesday/Thursday card news, Friday/Saturday/Sunday Reels.

## Amazon Affiliate Placement Rules

- Every new or meaningfully updated blog post should include Amazon affiliate opportunities unless the representative explicitly says to omit them.
- Default to two slim horizontal `.affiliate-inline-cta` boxes per monetized post: one in the middle body after the reader has enough context, and one later near a practical decision, packing, shopping, or next-step section.
- Do not use more than two visible CTA boxes in a normal article unless the representative approves it. Extra Amazon links, if needed, should stay as quiet contextual text links.
- Use the most relevant product available in `content/data/amazon-links.json`. If no perfect product exists, use the closest useful Amazon link or search link and explain why it is still worth comparing.
- CTA copy should create a reason to click without sounding like a hard sell: compare before a trip, build a simple kit, recreate the routine at home, or avoid buying the wrong item.
- The first affiliate CTA or nearby copy must include an Amazon Associate disclosure.
- All Amazon links must open in a new tab and render with `rel="nofollow sponsored noopener noreferrer"`. Other external links must also open in a new tab with `rel="noopener noreferrer"`.
- Preserve editorial trust: the article should still feel like a useful Korea guide first, not an ad page.

## Card News Brand Rules

- Do not jump to downstream production before the current content stage is actually complete. For a new blog post, "draft written", "review passed", or "build passed" does not mean published. Before starting related Reels or card news, explicitly confirm the blog's final review, publish/deploy status, and public URL verification, unless the representative directly asks to skip ahead.
- Card news is a social carousel, not a blog excerpt. Each card needs one clear message and a reason to swipe.
- Every card must have a relevant image. For real-world/high-visual topics, photo-first is mandatory; do not let a carousel become SVG-only or graphic-only unless the representative explicitly approves that exception in the current task.
- If the post does not have enough suitable images, source usable external photos before falling back to generated/graphic visuals. Prefer post-owned images first, then Pexels or other license-safe sources, then generated/owned visuals when search fails.
- Every card should carry a Korea/EpicKor angle through `kicker:` text, such as `KOREA SPF GUIDE`, `SEOUL TRAVEL TIP`, or `K-BEAUTY TEXTURE MAP`.
- Every rendered card must show `EPICKOR.COM` as the watermark text. Do not use only `EpicKor` as the watermark label.
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
- Before recording "Reviewer visually inspected" in `HANDOFF.md`, run `node .claude/skills/cardnews/scripts/review-cardnews.mjs --slug {slug}` after rendering. The script passing is not enough by itself; it is the structural gate before manual PNG inspection.
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
- The first Reels goal is not full automation. Build one MVP, note friction, then upgrade the pipeline.
- Every Reels project should use numbered scene files under `output/reels/{slug}/`.
- Human visual approval is required before final Remotion rendering.
- The visual review dashboard should answer one question quickly: does this image fit this numbered scene?
- During Reels visual research, keep a short list of strong topic-relevant images that were found but not selected for the Reel. If they improve the source post, add them back into the blog post after the Reel visual search instead of replacing already usable post images. For Blog 176 specifically, keep the current two images and use the Reels research pass to find additional Korean jjimjilbang-related images for the article if suitable.
- New Reels should use exactly two motion-card inserts for a normal 35-45 second Reel. Do not use three motion cards anymore unless the representative explicitly requests an exception for that specific Reel and it is recorded in `HANDOFF.md`.
- Reels motion cards must not look empty in the middle. Avoid or revise templates/copy combinations that leave the center visually hollow; prefer center-filled rows, checklists, boards, receipts, or clearly occupied focal layouts.
- Reels motion cards must reserve a clean narration-caption zone. The spoken subtitle layer must not overlap card rows, labels, footer text, badges, or CTA text; if a template uses lower-card content, move the caption placement or redesign the card before rendering.
- Starting after Reels 177, write new Reels narration in natural conversational American English, like a 20-something American man explaining the topic out loud. Keep it clear and non-slangy; avoid stiff essay/blog phrasing, lecture tone, or overly polished written-English sentences.
- Reels narration should be generated in short parts, around three parts for a 35-45 second Reel, rather than one full script file. This reduces slow or uneven voice behavior.
- Reels subtitles must follow context-aware phrase beats. Do not split tiny fragments such as `is`, `and`, or `to your` onto their own screen unless the fragment is intentionally designed as a typography beat.
- Reels subtitle timing should feel slightly proactive: the caption should appear just before, or exactly as, the narration lands. A small lead such as 6 frames at 30fps is acceptable when it makes the pacing feel more responsive.
- Reels render files must be versioned, such as `epickor-reel-{slug}-v005.mp4`; do not overwrite previous candidate renders during review.
- The first scene should be designed strongly enough to work as a thumbnail when the hook supports it.
- Final Reels should include a clean `epicKor.com` outro when appropriate.
- Reels visual sourcing priority:
  1. Images already used by the source post.
  2. EpicKor-owned or generated images.
  3. Pexels or other usable external images.
  4. Generated images when no relevant source image exists.
- Record Reels agent roles, dashboard review status, blockers, and next improvements in `HANDOFF.md`.

## Handoff And Strategy Check Rules

- Before deciding what EpicKor should do next, read `HANDOFF.md`, the latest `output/strategy/week_*.md`, and relevant git history if the handoff may be incomplete.
- Do not recommend a page as the next target only from GSC impressions or CTR. First check whether that page was already rewritten, published, or verified recently.
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
| 글 작성 | Claude/Codex가 직접 작성 |
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

Gemini API는 더 이상 사용하지 않는다.

---

## 파이프라인 흐름

이 파이프라인은 완전 자동 글쓰기 흐름이 아니다. API 할당량 문제를 없애기 위해 리서치와 검증은 스크립트가 돕고, 글과 카드뉴스 문안은 Claude/Codex가 직접 작성한다.

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

그 다음 Claude/Codex가 직접 작성:

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

중요: 이 자동 리뷰는 형식/SEO 검사다. 다음 항목은 Claude/Codex가 사람 검토 전에 반드시 별도로 확인한다.

- 본문에 나온 작품명, 인물, 공개일, 플랫폼은 공식 사이트나 신뢰 가능한 최신 출처로 확인한다.
- 확인이 약한 작품은 "지금 볼 추천작"처럼 단정하지 않고, "추적할 작품" 또는 "공개 여부 확인 필요"로 낮춰 쓴다.
- 이미지가 글 주제와 직접 맞는지 확인한다. 예: K-drama 추천 글에는 일반 서울 풍경보다 TV/스트리밍/시청 분위기 이미지가 낫다.
- 사용자 지적으로 수정한 경우, `HANDOFF.md`와 최종 답변에 어떤 agent가 어떤 일을 했는지 요약한다.

### Step 4 - 사람 검토

리뷰 통과 후 미리보기 URL을 사람에게 전달한다.

```text
로컬: http://localhost:4000/preview/166
프로덕션: https://epickor.com/preview/166?token=[PREVIEW_SECRET_TOKEN]
```

승인 전에는 발행하지 않는다.

### Step 5A - 카드뉴스

승인 후 카드뉴스 브리프를 만든다.

```bash
node .claude/skills/cardnews/scripts/generate-slides.mjs \
  --draft output/drafts/166_draft.md \
  --research output/research/166_research.json \
  --slug 166
```

출력:

- `output/cardnews/YYYY-MM-DD_166/script-brief.md`

그 다음 Claude/Codex가 직접 작성:

- `output/cardnews/YYYY-MM-DD_166/script.md`

PNG 렌더:

```bash
python .claude/skills/cardnews/scripts/html-to-png.py --slug 166
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
output/reels/{slug}/          Reels scene manifest, visual candidates, review notes, and audio
.claude/skills/               팀별 스크립트
.claude/agents/               팀별 운영 지침
```

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
- Amazon 링크는 모든 신규/주요 수정 글에 기본 포함한다. 관련 상품이 약하면 가장 가까운 Amazon 상품 또는 검색 링크를 문맥형 CTA로 넣고, 기본값은 얇은 `.affiliate-inline-cta` 박스 2개다.
- 최종 보고에는 이번 작업에 관여한 agent와 역할을 적는다. 예: Research Agent=소스/이미지 수집, Writer Agent=초안 작성/수정, Reviewer Agent=형식 검사+수동 사실/이미지 검토, Publisher Agent=private preview 반영.

---

## 이어받기 프롬프트

```text
HANDOFF.md 파일을 읽고 작업을 이어서 진행해줘.
설계서는 epickor-agent-design-v2.md를 참고해.
```
