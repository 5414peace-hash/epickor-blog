# EpicKor Blog - Claude/Codex 운영 가이드

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
- **매 배치마다 그 주제에 맞는 새로운 비주얼 시스템을 설계한다. 같은 템플릿을 반복하지 않는다.** (2026-07-20 대표님 지시) 어두운 배경에 딤 베일을 씌우는 기본 템플릿을 매번 재사용하면 인스타 그리드에서 모든 캐러셀이 똑같아 보이고 브랜드가 납작해진다. 떡볶이 길거리 음식과 K-뷰티 성분 해설이 같은 비주얼을 쓸 이유가 없다.
  - `script.md`를 쓰기 전에 그 주제만의 방향(팔레트, 타이포 처리, 레이아웃 리듬, 사진을 다루는 방식)을 먼저 정한다. `style:` 필드에 이름만 적지 말고 실제 렌더에 반영한다.
  - 아래 "Card News Render Settings"의 다크 베일 값은 **여러 선택지 중 하나**이지 하우스 스타일이 아니다.
  - 현재 `html-to-png.py`의 레이아웃(A~F)으로 그 방향을 표현할 수 없으면, 렌더러를 확장하거나 그 배치용 카드 HTML을 따로 만든다. 표현이 안 된다고 기본 템플릿으로 되돌아가지 않는다.
  - 바꾸지 않는 것: 전 카드 `EPICKOR.COM` 워터마크, Korea-first 사진 기준, 카드 01의 프로필 그리드 가독성, 이미지 경로 중복 금지.
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
- Before recording "Reviewer visually inspected" in `HANDOFF.md`, run `node .claude/skills/cardnews/scripts/review-cardnews.mjs --slug {slug}` after rendering. The script passing is not enough by itself; it is the structural gate before manual PNG inspection.
- Record card news agent roles and rendered-image review in `HANDOFF.md`.

### Card News Render Settings (2026-07-20 실측) — 다크 템플릿을 쓸 때만 해당

> 이 값들은 기존 다크 템플릿을 선택했을 때의 실측 세팅이다. **기본값으로 삼지 말 것.** 새 배치는 위의
> "매 배치마다 새로운 비주얼 시스템" 규칙이 우선한다.

- `html-to-png.py`의 기본 베일은 `rgba(17,17,17,0.24) -> 0.92`이고 `image_opacity` 기본값은 `0.36`이다. **이 기본값으로 렌더하면 사진이 거의 검게 묻힌다.** 첫 떡볶이 렌더에서 음식이 안 보이는 카드가 나왔다.
- 렌더러는 카드별 `image_tone: food`(베일이 `0.16 -> 0.46`으로 완화)와 `image_opacity`를 이미 지원한다. 사진 기반 카로셀은 **항상 이 둘을 명시**한다.
- 검증된 값:
  - 텍스트가 사진 위에 얹히는 풀블리드 레이아웃(`D`, 밝은 이미지의 `F`): `image_opacity: 0.58~0.74`. 그래야 금색 헤드라인 대비가 유지된다.
  - 텍스트가 단색 패널에 있는 분할 레이아웃(`B`, `C`, `E`): `image_opacity: 0.80~0.86`.
- **소스 이미지를 미리 밝게 보정해서 해결하려 하지 말 것.** 채도가 튀어 카드가 인공적으로 보이고 좌상단 워터마크까지 안 보이게 된다. 원본을 그대로 쓰고 `image_opacity`로 조절한다.
- 좁은 세로 크롭이 생기는 레이아웃(`C`의 우측 패널)에서는 헤드라인이 말하는 대상이 잘려나갈 수 있다. 렌더 후 반드시 확인하고, 잘리면 풀블리드 레이아웃으로 바꾼다.

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
- Starting 2026-07-14, Blog `293` Reels 2.0 V04 is representative-rejected and must not be used as the creative baseline. Keep the proven pre-293 Reel structure, then improve its hook, voice, video mix, and single motion-card treatment under the Reels 2.1 recovery standard.
- Starting 2026-06-24, every new Reels candidate must pass the Reels Creative Performance Standard in `.claude/skills/reels/creative_performance_standard.md` before script, dashboard, TTS, or rendering work.
- Strategy Team must assign a `Reels Viral Fit Score` out of 100 before production. Default threshold is `>=80`; topics below 80 should be routed to card news, blog refresh, or held for a stronger angle unless the representative explicitly approves a Reels exception.
- New Reels must start from a creative brief saved in `output/reels/{slug}/strategy.md`: hook archetype, first-frame promise, viewer misconception, payoff, save/share reason, voice lane, thumbnail variants, one motion-card role, and funnel expectation.
- The first Reels goal is not full automation. Build one MVP, note friction, then upgrade the pipeline.
- Every Reels project should use numbered scene files under `output/reels/{slug}/`.
- Human visual approval is required before final Remotion rendering.
- The visual review dashboard should answer one question quickly: does this image fit this numbered scene?
- During Reels visual research, keep a short list of strong topic-relevant images that were found but not selected for the Reel. If they improve the source post, add them back into the blog post after the Reel visual search instead of replacing already usable post images. For Blog 176 specifically, keep the current two images and use the Reels research pass to find additional Korean jjimjilbang-related images for the article if suitable.
- **2026-07-21 규칙 변경 (대표님 승인): 페이오프 자리의 모션카드를 없앤다.** 종전에는 "모션카드 1장을 60~75% 지점 페이오프로" 규정했으나, 그러면 릴스의 결말이 영상이 아니라 문서가 되어 정보 전달형으로 흐른다. 실제로 최근 세대는 기획서가 정교해졌는데도 도달이 나빠졌고, `creative_performance_standard.md`도 "너무 정보 중심이 됐다"고 진단하고 있다.
  - **페이오프는 시각적 리빌이어야 한다.** 마지막 반전은 화면에서 벌어지는 일로 보여준다. 보드/체크리스트/표로 대체하지 않는다.
  - 모션카드는 **기본 0장**이다. 꼭 필요하면 중반 이전의 **짧은 비트**로만 쓰고, 페이오프 자리에는 두지 않는다.
  - 이 변경 이후의 릴스는 정보 나열이 아니라 **하나의 놀라움**을 증명하는 구조로 만든다.
- 참고(구 규칙, 2026-07-21 이전 릴스에만 적용): 35-45초 릴스에 모션카드 1장, 60-75% 지점 페이오프 배치.

### Footage Gate — 주제 확정 전에 소재부터 확인한다 (2026-07-21 필수)

- **EpicKor는 릴스용 영상을 직접 촬영하지 않는다. 이번에도, 앞으로도.** (대표님 2026-07-21) 촬영 제안을 다시 올리지 말 것. 모든 릴스는 이미 존재하는 소재(스톡 세로영상, 라이선스/CC, 공식 기관 영상, 기존 보유 이미지)만으로 조립한다. "없는 컷은 찍으면 된다"는 선택지가 없다.
- **따라서 제작 순서를 뒤집는다.** 종전 순서(발행글 선정 → `strategy.md` 작성 → 소재 탐색)는 실패한다. Reel 311에서 전략·씬플랜·ONS·스토리보드를 다 만든 뒤에야 Pexels에 쓸 만한 세로 떡볶이 영상이 **0건**(10쿼리·29후보)이라는 걸 발견해 기획 전체가 폐기됐다. 기록: `output/reels/311/clip-sources.md`.
- **올바른 순서**:
  1. 발행글 중 후보 주제를 여러 개 추린다.
  2. **소재 게이트 먼저** — 각 후보에 대해 세로 영상을 검색하고 **컨택트시트를 눈으로 확인**한다. 동작 사건이 필요한 컷을 실제·국가정합 영상이 덮을 때만 통과.
  3. 통과한 주제에 한해 `strategy.md`와 스토리보드를 쓴다. 이미 손에 든 클립을 중심으로 구성한다.
- **동작 사건은 만들어낼 수 없다.** 치즈가 끊기는 것, 면이 올라오는 것, 김이 오르는 것은 카메라 무브가 아니라 피사체의 변화다. 정지컷 줌으로 대체 불가하고, AI 이미지→영상은 음식 조리·팩트 증거에 금지되어 있다. **핵심 비트가 동작 사건인데 소재가 없으면 실행을 낮추지 말고 주제를 바꾼다.**
- 정지컷은 **소수**로만 허용한다. 302 기준: 7씬 중 5씬 video-led, 나머지는 진짜 클립이 없을 때의 정확한 증거. "보여주기" 비트는 정지컷+절제된 푸시인이 정당하지만, 다수를 정지컷으로 채우면 Reels 2.1 하드리젝트(`excessive still-image zooms`)다.
- 검색어의 알려진 함정: `tteokbokki`는 이탈리아 파스타·일본 오뎅을, `korean ramyeon`은 인도네시아 Indomie를 반환한다. **검색 결과를 제목만 보고 믿지 말고 반드시 프레임을 본다.**

### Reels 2.2 구조 기준 (2026-07-21, 3세대 실측 분석 기반)

- **씬 쿼터를 버린다.** 40초에 7씬(씬당 5.7초)은 슬라이드쇼 박자다. **3막·4~6컷**으로 가고, 강한 샷은 6~8초 그대로 둔다.
- **훅은 자막이 아니라 화면으로 만든다.** 첫 프레임에 주장의 물리적 증거가 있어야 하고, 첫 1.5초에 완결되는 움직임(젓가락이 들어옴, 치즈가 늘어남, 김이 오름)이 있어야 한다. 스톡 위에 타이포만 얹는 훅 금지.
- **인코딩 하한선(신설)**: `1080x1920 30fps` 기준 **≥8 Mbps**, 모션이 많으면 **≥10 Mbps**. 기존 ffprobe QA는 코덱·길이만 봐서 이 누수를 못 잡았다. 실측: 사람 편집 세대는 20~51 Mbps였는데 최근 296/297은 **3.0~3.6 Mbps**로 떨어져 모션이 뭉갠다.
- **길이와 fps는 콘텐츠가 정한다.** 소재가 시네마틱하면 24fps 허용, 페이오프가 필요하면 50~60초 허용. 사람 편집 세대는 42~67초로 편차를 뒀고 그게 고조회였다. **보간 편법 금지** — 25fps 소스를 30fps로 늘리지 말고 네이티브를 쓰거나 교체한다.
- **측정 없이는 "조회수 폭발"을 설계할 수 없다.** 저장소에 실제 조회 데이터가 0건이다. 발행 후 1h/24h/7d 조회·저장·공유·시청완료율을 `output/reels/metrics.json`에 기록한다.
- The single motion card must use a full-bleed topic-relevant image or video background with a controlled dim/blur veil and a semi-transparent card. Plain black motion-card screens are not allowed.
- Write the narration around the card: include a spoken setup, synchronize each row/reveal with its narration beat, and finish with a payoff line. The card cannot be an unrelated summary pasted over the script.
- Reels motion cards must not look empty in the middle. Avoid or revise templates/copy combinations that leave the center visually hollow; prefer center-filled rows, checklists, boards, receipts, or clearly occupied focal layouts.
- Reels motion cards must reserve a clean narration-caption zone. The spoken subtitle layer must not overlap card rows, labels, footer text, badges, or CTA text; if a template uses lower-card content, move the caption placement or redesign the card before rendering.
- Starting after Reels 177, write new Reels narration in natural conversational American English. Starting 2026-06-24, choose a voice lane before TTS: `male_friend` or `female_culture_travel`. Keep it clear, non-slangy, and more entertaining than a blog summary; avoid stiff essay phrasing, lecture tone, or overly polished written-English sentences.
- For important batch openers, new topics, or a changed voice lane, generate an 8-12 second voice audition before full scene-level TTS.
- Use natural speaking speed by default; do not apply a blanket `0.8x` slowdown. Reject robotic pauses, drawn-out words, and calm blog-read cadence before full TTS.
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
- The first scene must be designed as both the hook and thumbnail. Prepare three thumbnail copy directions before selection: `Mystery`, `Mistake`, and `Decision`, with 3-5 word copy that does not merely restate the blog title.
- Prepare three spoken opening variants as well, then select the thumbnail/narration pair with the clearest stakes. Do not begin on black, a generic mood shot, or a topic-title restatement; show direct visual proof or action in the first frame.
- Final Reels should include a clean `epicKor.com` outro when appropriate.
- Reels outro/CTA text should use `epickor.com` only. Do not show post-specific paths such as `/blog/{slug}` inside the video frame because viewers cannot click them.
- **아웃트로에는 URL만 두지 말고 갈 이유를 붙인다 (2026-07-21 신설).** 후킹 문구 6종을 `output/reels/outro-cta-bank.md`에 두고 **주제에 맞춰 골라 돌려쓴다**: `THERE'S MORE`(미완결·범용) / `DON'T ORDER BLIND`(실수회피·음식/쇼핑) / `LOCALS KNOW THE REST`(인사이더·문화/에티켓) / `BEFORE YOU LAND`(시점압박·여행) / `WE WROTE IT ALL DOWN`(안심·가이드) / `NO PAYWALL. NO APP.`(마찰제거·범용). 심리 기제가 서로 달라야 돌려써도 물리지 않는다. 연속 릴스에 같은 ID를 쓰지 않는다.
- **`epickor.com`은 반드시 솔리드 빨간 칩(흰 글씨)으로 렌더한다.** 영상 위에 빨간 글씨로 얹으면 따뜻하거나 복잡한 배경에서 안 읽힌다 — 실제로 한국 간판/차양 위에서 판독 불가였다. 칩으로 처리하면 어떤 배경에서도 동일하게 읽히고, 전 릴스에 걸쳐 일관된 브랜드 마크가 된다.
- Reels visual sourcing priority:
  1. EpicKor-owned, official, licensed, or otherwise usable real vertical video.
  2. Real vertical images already used by the source post or found during topic-specific research.
  3. Pexels or other usable external vertical assets.
  4. Generated images or video only when direct real material cannot fill a safe supporting beat.
- Google AI Pro subscription credits may be used manually through Flow/Whisk for selected 3-5 second bridge or establishing shots. Gemini Developer API billing is separate and must not be enabled, funded, or automated without explicit representative approval.
- AI-generated visuals must remain at or below 25% of selected photo/video cuts. They must not carry factual proof, Korean text/signage, property/brand claims, or delicate human/hand/object mechanics unless artifact-free under frame-by-frame review.
- Source true 9:16 material whenever possible; do not simulate vertical quality with repeated zooms on horizontal stills. Keep all first-frame copy and key subjects inside the conservative profile-grid safe area.
- Reels 2.1 human-made finish gate is a hard reject, regardless of internal score, for: corporate-deck structure, generic stock mood, repeated templates, plain-black information screens, warped objects or hands, broken Korean text/signage, over-smooth AI motion, mismatched lighting, excessive still-image zooms, unnatural narration, or any scene that visibly feels AI-generated. Review the final candidate on a phone with sound both on and off. Representative rejection overrides all internal scores.
- Record Reels agent roles, dashboard review status, blockers, and next improvements in `HANDOFF.md`.
- After publishing a Reel, record hook archetype, thumbnail variant, voice lane, motion-card count/placement, and available performance metrics such as 1h/24h/7d views, saves, shares/sends, comments, profile visits, and external link taps.

## Handoff And Strategy Check Rules

- At session start, read the root `HANDOFF.md` fast-start dashboard, then run `git status --short` and `git log -8 --oneline`. Do not load files under `docs/handoff/` by default.
- Search a Handoff archive only for a specific slug, decision, incident, or older rule, using `rg`, and read only the narrow matching range.
- Read the latest `output/strategy/week_*.md` only when choosing strategy or the next topic, not for every implementation task.
- Do not recommend a page as the next target only from GSC impressions or CTR. First check whether that page was already rewritten, published, or verified recently.
- When choosing the next EpicKor task, explicitly apply the Strategy Team perspective: GSC opportunity, recency of prior edits, monetization potential, visual/card-news potential, and operational risk.
- Before recommending any "new blog post" topics, read `.claude/agents/strategy-team/AGENT.md` and perform a duplicate-topic audit against `content/data/topics-queue.json`, `content/blog/*.md`, `output/final/`, recent `HANDOFF.md` correction notes, and the latest strategy report. Do not rely on a strategy report's "Recommended New Topics" list until it has been deduped against already published or substantially covered topics.
- Treat semantic/search-intent overlap as duplicate even when the title is different. If a topic is a refresh, cluster expansion, spin-off, or deliberate retread, label it that way and state the existing slug plus the reason; do not present it as a clean new topic.
- Known covered examples that must not be recommended as fresh new posts without a stated retread reason: Ssamjang -> Blog `083`/BBQ support in `172`; Korean baseball/KBO culture -> Blog `081`; Korean Toast/Isaac Toast -> Blog `153` and breakfast support in `171`; Korea pharmacy/healthcare basics -> Blogs `190` and `173`; travel payment/transit app setup -> Blogs `201`, `205`, `222`, and `223`.
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

## Blog Reference Image Standard

- Use the corrected Blogs `222`, `223`, and `224` as the current benchmark for article images: images should be real reference photos/screenshots with direct section-level relevance, not generic mood photos or decorative editorial graphics.
- For practical guides, prioritize official screenshots, real app/form/page context, public-domain/Creative Commons files, real Korea-location photos, actual storefronts, real products, real food, or real event/place images that help the reader understand the specific task.
- Do active web/source research when Pexels returns only broad stock imagery. A visually pleasant Korea photo is not enough for a post about a specific app, form, show, venue, product, process, or fan route.
- A caption must never apologize for or explain away a weak image. Phrases such as `not a specific`, `not the actual`, `general image`, `category illustration`, `similar to`, `stand-in`, `without implying`, and `included to show` are hard-reject signals: replace the image or remove it.
- If the article names a real place, event, program, product, app, interface, venue, company, or institution, use that exact subject when a usable public/official/reference image is reasonably available. A merely plausible Korean or Asian scene is not enough.
- Public articles must never be SVG-only. An SVG diagram may appear only as a useful supplement after the article already has sufficient direct real-image coverage; high-visual subjects should use real photographs or exact screenshots throughout.
- Do not publish visible `AI-generated`, `EpicKor generated visual`, fictional-product, or generic-proxy captions when a direct real reference can reasonably be sourced. Keep reader-facing credits short: what the image actually shows, then creator/source.
- Generated or editorial graphics are fallback options only when direct real reference images cannot be used safely or clearly, or when the representative explicitly approves that exception. Record the reason in `image-sources.md` and `HANDOFF.md`.
- Reviewer must score blog images against this standard before approval. If a direct real reference image was reasonably available but a generic/graphic substitute was used, that image should fail visual review.
- Before approval, run `npm run audit:image-context -- --slug {slug}` and inspect the rendered desktop and mobile article. Critical/high findings block publication.

### Cross-Post Image Uniqueness (all posts, not just card news)

- The "do not reuse an image across posts" rule already applied to card news (see Card News Brand Rules) but never applied to regular blog/business post images until a 2026-07-25 incident: Pexels photo `31925324` was used as the hero image of three separate posts (`192`, `239`, `318`) over six weeks because nothing checked for it. The rule now applies to every image in `public/assets/images/posts/` and `public/assets/images/business/`, not just card news.
- Before selecting any Pexels/Unsplash/stock photo for a post, run `node scripts/audit-image-uniqueness.mjs --check-id {photoId}` (or the full scan `npm run audit:image-uniqueness`) and reject any candidate already flagged as used by another post. Do this at selection time, not after the draft is written — it is much cheaper to pick a different photo than to redo a hero image after publish.
- **Do not rely on SHA-256/byte-hash duplicate checks for this.** An earlier ad hoc version of this check (see Blog `239`'s `image-sources.md` history) compared file hashes and reported "not a duplicate" for the exact photo above, because each post's copy had been compressed independently to different bytes even though the source photo was identical. Hash comparison only catches literal copy-paste of the same file; it does not catch "same Pexels ID, downloaded and compressed twice." Always key the check off the documented source URL/photo ID in `image-sources.md`, which is what `scripts/audit-image-uniqueness.mjs` does.
- Record the source photo ID in `image-sources.md` for every image, in a `photos/{id}` or `photo/{id}` URL pattern, so the audit script can parse it. Entries that only paste a bare CDN URL without the recognizable ID pattern will silently escape the check.
- `npm run audit:image-uniqueness` with no `--slug` runs a full site-wide scan and is useful for periodic cleanup sweeps, not just per-post gating.

Do not use or fund the Gemini Developer API without explicit representative approval. Google AI Pro's included Flow/Whisk credits may be used manually for scoped visual experiments under the Reels rules; subscription credits do not make API calls free.

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
프로덕션: placeholder 토큰 URL을 쓰지 말 것. `.env.local`의 실제 `PREVIEW_SECRET_TOKEN`으로 URL을 만들고 HTTP 200과 글 제목/승인 컨트롤을 검증한 뒤에만 공유한다.
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
- dirty main worktree를 피하기 위해 임시 Git worktree가 필요하면 `D:\dev` 루트에 만들지 말고 repo 내부의 명확한 임시 위치를 쓴다. 예: `D:\dev\epickor-blog\.tmp\worktrees\publish-{slug}` 또는 `D:\dev\epickor-blog\.codex-deploy\...`.
- 임시 worktree는 작업 완료 후 같은 세션에서 `git worktree remove {path}`로 제거하고, `git worktree list --porcelain` 및 `Test-Path {path}`로 잔여 등록/폴더가 없는지 확인한다.
- Amazon 링크는 모든 신규/주요 수정 글에 기본 포함한다. 관련 상품이 약하면 가장 가까운 Amazon 상품 또는 검색 링크를 문맥형 CTA로 넣고, 기본값은 얇은 `.affiliate-inline-cta` 박스 2개다.
- 최종 보고에는 이번 작업에 관여한 agent와 역할을 적는다. 예: Research Agent=소스/이미지 수집, Writer Agent=초안 작성/수정, Reviewer Agent=형식 검사+수동 사실/이미지 검토, Publisher Agent=private preview 반영.

---

## Deployment Operations (2026-07-20 확인된 실제 동작)

이 항목들은 2026-07-20 배포 중 직접 확인한 사실이다. 추측이 아니라 실측이므로 다음 발행 때 그대로 따른다.

- **git push만으로는 배포되지 않는다.** master에 push해도 Vercel 자동 배포가 트리거되지 않았다. 발행 후 반드시 수동으로 배포한다:
  `npx vercel deploy --prod --archive=tgz --yes`
- **`vercel` CLI는 배포 성공 후에도 프로세스가 종료되지 않는다.** CLI 종료를 기다리지 말 것. 성공 판정은 다음 두 가지로 한다:
  1. `npx vercel ls epickor-blog --yes` 최상단 배포가 `● Ready`
  2. 공개 URL이 HTTP 200
  타임아웃/exit 1은 실패가 아닐 수 있으므로 반드시 위 두 가지로 재확인한다. 매달린 node 프로세스는 종료해도 배포에 영향 없다.
- **대용량 폴더는 `.gitignore`와 `.vercelignore` 양쪽에 모두 넣어야 한다.** 2026-07-20에 `history reels/`(4.9GB 영상)가 `.vercelignore`에 없어서 배포마다 5GB를 아카이빙했다. node 메모리가 3.6GB까지 치솟고 20분 넘게 Vercel에 배포 등록조차 되지 않았다. `.tmp` 사고와 동일 유형이다.
  - 주의: `history/` 패턴은 **`history reels/`를 매칭하지 못한다.** 공백이 들어간 폴더명은 별도 라인으로 정확히 적는다.
  - 증상 체크리스트: 배포가 10분 넘게 `Deploying...`에서 멈춤 + node RAM 2GB 초과 + `vercel ls`에 새 배포 없음 → 즉시 중단하고 `.vercelignore` 누락부터 확인한다.
  - repo 루트에 새 대용량 폴더(영상/원본 소스)를 만들면 그 자리에서 두 ignore 파일에 추가한다.

## Meta Business Suite 자동화 절차 (2026-07-21 실측 확립)

카드뉴스/릴스 업로드는 이제 Claude가 Meta Suite로 직접 예약한다. 아래는 실제로 성공한 절차다.

- **브라우저 기동**: 시스템 Chrome을 Playwright `launch_persistent_context`로 띄운다.
  - 전용 프로필: `{scratchpad}/meta-profile` (대표님 기존 Chrome 프로필은 실행 중이라 잠겨 있고, 다른 로그인 세션에 접근하지 않기 위해서도 전용 프로필을 쓴다)
  - `channel="chrome"`, `headless=False`, `args=["--remote-debugging-port=9222","--start-maximized"]`
  - 런처는 백그라운드로 살려두고, 이후 스크립트는 `connect_over_cdp("http://localhost:9222")`로 재접속한다.
- **로그인은 대표님이 직접 한다. Claude는 자격증명을 절대 입력하지 않는다.** 전용 프로필이라 최초 1회만 필요하고 이후 세션은 로그인 상태가 유지된다.
- **좌표 환산 주의**: 뷰포트는 1280x720인데 스크린샷은 1.25배로 저장된다. 스크린샷에서 읽은 좌표는 **1.25로 나눠서** `mouse.click`에 넘긴다. 이걸 놓쳐서 첫 클릭이 빗나갔다.
- **계정 전환**: 좌상단 드롭다운(페이지 좌표 약 `106,98`) → 자산 목록에서 `epickorsnippets` 선택. 기본이 VDOLAB이므로 **매번 확인**한다.
- **이미지 업로드**: 파일 입력은 DOM에 미리 없다. `사진 추가` → `데스크톱에서 업로드`를 `page.expect_file_chooser()`로 감싸 클릭하고 `chooser.set_files([7장 경로])`로 한 번에 주입한다. OS 파일창을 띄우지 않는다.
- **캡션**: `div[contenteditable='true']` 첫 번째 요소. 비어 있을 때 높이가 20px라 "높이 60px 이상" 같은 필터로 찾으면 놓친다. `scroll_into_view_if_needed()` 후 클릭하고, 줄바꿈은 **`Shift+Enter`**로 입력한다(Enter는 쓰지 않는다).
- **⚠️ 가장 위험한 지점**: 새 게시물은 기본이 **`게시`(즉시 발행)** 다. 예약 섹션의 `날짜 및 시간 설정` 토글을 켜야 버튼이 **`예약`**으로 바뀐다. **버튼 라벨이 `예약`인지 반드시 스크린샷으로 확인한 뒤** 누른다. 2026-07-21에 312/313에서 토글이 꺼진 채였고, 확인하지 않았으면 즉시 발행될 뻔했다.
- **시간 입력**: `오후 12:55` 형태의 분할 필드다. AM/PM 세그먼트 클릭 → `ArrowUp`으로 오전 전환 → `ArrowRight` → 시 입력 → 분 세그먼트 클릭 후 분 입력.
- **검증**: 예약 후 플래너(`content_calendar`)에서 날짜/시각/썸네일/캐러셀 아이콘을 눈으로 확인한다.
- **주의**: Meta Suite 예약 목록은 **모바일 앱으로 올린 게시물을 보여주지 않는다.** 목록이 비어 있다고 "예약 없음"으로 단정하지 말 것.

## 이미지 용량 목표 (400KB는 상한이지 목표가 아니다)

- `next.config.ts`에 `images.unoptimized: true`가 설정되어 있어 **원본 파일이 그대로 사용자에게 전송된다.** Next.js가 리사이즈해 주지 않는다.
- 따라서 본문 이미지는 **150~250KB, 가로 1200~1600px를 실질 목표**로 한다. `optimize-blog-images.mjs`는 400KB 미만이 되면 압축을 멈추므로, 큰 원본을 받으면 397KB 같은 상한 근처 파일이 그대로 남는다.
- 원본을 받을 때부터 과도하게 큰 소스(1920px, 800KB~1.2MB)를 피하고, 필요하면 최적화 후 크기를 확인해 한 번 더 줄인다.
- 참고 실측(2026-07-20): Codex 발행분 306~310은 이미지당 평균 73~232KB(포스트당 220~728KB), Claude Code 발행분 311~313은 평균 240~339KB(포스트당 940~1,356KB)로 약 2배 무거웠다. 전부 400KB 게이트는 통과했지만 상한에 붙어 있었다.
- 발행 전 `npm run audit:image-sizes`뿐 아니라 **포스트 폴더 합계**도 확인한다. 포스트당 이미지 총합 1MB 초과면 줄인다.
- 주의: `npm run audit:image-context -- --slug {slug}`는 공용 리포트 `reports/image-context-audit.json`을 **단일 포스트 결과로 덮어쓴다.** 빠른 확인엔 `--slug`를 써도 되지만, 그 리포트를 커밋하기 전에는 반드시 `npm run audit:image-context`(전체)를 다시 돌려 사이트 전체 결과로 복구한다. 2026-07-20에 이 실수로 292개 포스트 리포트가 1개짜리로 축소된 커밋이 나갔고 다음 커밋에서 복구했다.

## 분량 기준

- 리뷰어 통과 최소치는 1,800단어지만 **그건 하한이다.** 실제 목표는 `2,200~2,800단어`(HANDOFF Standard Blog Guardrails)다.
- 참고 실측(2026-07-20): Codex 발행분 306~310은 2,213~3,707단어, Claude Code 발행분 311~313+비즈니스는 1,847~2,069단어로 짧았다. 리뷰어 100/100은 분량 충분을 뜻하지 않는다.

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
