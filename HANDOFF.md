# HANDOFF - EpicKor Current Operations

> Fast-start dashboard only. Historical detail through 2026-07-11 is in `docs/handoff/HANDOFF_ARCHIVE_THROUGH_2026-07-11.md`.

## Start Here

1. Read this file.
2. Run `git status --short` and `git log -8 --oneline`.
3. Preserve unrelated dirty files.
4. Read only files named under Active Work or the user request.
5. Search the archive narrowly with `rg` only for a specific slug, decision, or incident.

## Current Snapshot - 2026-08-14 (유튜브 첫 실측 + 서울 쇼핑 코너 개시 + 비즈니스 재가동)

- **신규 5편 발행, 전부 라이브 검증.** 8/13 `380`(KTX·SRT 통합)·`381`(스팸 선물세트)·`382`(사이렌 vs 재난문자), 8/14 `383`(서울 캐리어)·`384`(광장시장 구제상가), 그리고 비즈니스 `navien-tankless-water-heater-deep-dive`.
- **유튜브를 처음으로 실측했다. 인스타와 정반대로 작동한다.** @EpicKor 구독 510, 쇼츠 30편, 누적 42,933뷰. **같은 DMZ 릴스가 인스타 2,172뷰/저장27인데 유튜브 203뷰다.** 7~8월 배치(나이 동일) 하위 3개가 전부 쇼핑·활동·서비스 니치(MU:DS 138·헤어살롱 138·러닝 200)이고 상위 4개가 전부 넓은 문화 호기심 또는 보편적 불안 해소(노래방 1,668·파전 1,605·공중화장실 1,506·사회규칙 1,392). **인스타 저장수로 유튜브 업로드를 고르면 안 된다** — 그 기준으로 짠 1순위 목록을 폐기하고 다시 짰다. 원장 `output/reels/metrics.json`, 스터디 `output/youtube/UPLOAD_STUDY_2026-08-14.md`.
- **쇼츠 10편 예약 완료 (8/14~8/23 매일 21:00).** 176 찜질방 → 294 금속젓가락 → 186 혼밥 → 187 미신 → 326 매운맛 → 182 직장문화 → 174 지하철 → 301 아줌마 → 181 웹툰 → 190 의료. 목록에서 독립 재검증(예약됨 10건, 빈 날 0). 매니페스트 `output/youtube/tier1-2026-08-14-manifest.json`.
- **서울 쇼핑 코너 착수(대표님 승인).** 신설이 아니라 **방치된 자산**이었다 — 기존 54편이 이미 클릭 239/노출 23,481/**CTR 1.018%**로 사이트 평균(0.390%)의 2.6배다. 운영서 `section_seoul-shopping-playbook.md`, 기준선 원장 `section_seoul-shopping-baseline.json`. **`where to buy`를 즉시 기각하던 플레이북 §2 규칙이 우리 1위 글(`275`, 9.27%)을 죽일 뻔해 예외를 명시했다** — 범위가 다르다(`where to buy buldak`은 아마존이 먹지만 `...in Seoul`은 목적지 쿼리다).
- **아마존 재신청 계정에 실판매 1건 발생** (커미션 $2 미만). 3건 중 1건, 기한 **2027-01-23**. "전환은 되는데 클릭이 병목"이라는 진단이 유효하다.
- **비즈니스 섹션 5일 만에 재가동.** 파세코를 1순위로 올렸다가 **SERP 실사에서 기각**하고 나비엔으로 교체·발행했다. 후보 문서 `business-candidates_2026-08-14.md`.

## Active Work

- Card-news batch `2026-07-15_musinsa`, `2026-07-15_124`, and `2026-07-15_174` is final. It contains 21 photo-first 1080x1080 PNGs, three distinct systems (`Seoul Fashion Commerce`, `Modern Hanji Invitation`, `Transit Signal System`), captions, source records, contact sheets, and Visual Fit reviews. Structural review passed 7/7 images for every carousel; manual original-resolution review found no clipping, overlap, broken image, or missing `EPICKOR.COM`. Visual Fit averages are 97.7, 95.1, and 98.1. Card News `174` is scheduled for 2026-07-20 22:00 KST on both Instagram and YouTube Community. Meta Planner showed the exact caption and `오후 10:00 Instagram`; YouTube's `예약됨` tab showed the exact caption, clickable `https://www.epickor.com/blog/174` link, seven image-detail links, and post ID `Ugkxks1jhEdJAUbyrgUMKqLmIZDMLWHOobv1`. The YouTube image composer supports up to 10 images/GIFs with aspect ratios from 2:5 through 5:2, so the seven 1:1 card-news PNGs are natively supported. MUSINSA and Blog `124` remain ready for scheduling. MUSINSA is the representative-approved Business-slot age exception; Blog 124 legacy broadcast stills were excluded; Subway Card 03 was upgraded to an actual Seoul Metro priority-seat CC image.

- Agoda pilot is published: Blog `188` compares Seoul/Busan Agoda stays, Blog `257` links to Incheon accommodation with airport-filter guidance, and the global analytics listener emits `affiliate_agoda_click` with CID, content slug/type, CTA context, and destination city ID. Commit `15c4fc64` is on `origin/master`; Vercel deployment `epickor-blog-qz9bhmw89` is Ready.
- Agoda pilot QA passed locally and publicly: all three partner URLs preserve CID `1968802` and return HTTP 302 to the intended city search; ESLint and the 346-page production build passed; public Blogs 188/257 returned HTTP 200 with disclosure/link markup; the deployed JS bundle contains `affiliate_agoda_click`; and all eight article images returned public HTTP 200.
- Status: the representative rejected Blog `293` Reels 2.0 V04 as worse than the established pre-293 format. It must not be published or used as the baseline.
- Reels 2.1 recovery rules are now recorded in `AGENTS.md`, `CLAUDE.md`, `.claude/skills/reels/creative_performance_standard.md`, and `reports/epickor-reels-2.1-recovery-spec-2026-07-14.md`.
- First recovery prototype: Blog `294` (Korean metal chopsticks/sujeo), Viral Fit 92/100. The representative approved the corrected Porcelain Daylight storyboard and final V03 at `output/reels/2026-07-14_294/final/EPICKOR_294_03.mp4` (33.56s, 1080x1920, H.264/AAC). It uses a frame-one Korean-table hook, the approved bright editorial system, a natural-speed female voice, four real 9:16 video sources, three purposeful article stills, exactly one transparent three-row card over moving Korean BBQ footage, and zero generated visuals.
- V03 QA: full-resolution key frames/contact sheet, frame-one hook, scene-start media, card-row timing, caption collision, outro, ffprobe, and silence scans passed. Viewer-Impact Score is 95/100 and Visual Variety Score is 98/100 in `output/reels/2026-07-14_294/review-v03.md`. The upload-ready English caption is synchronized at `output/reels/2026-07-14_294/final/instagram-caption.txt` and beside the final MP4. V01/V02 and all three KEEP directions remain preserved.
- Reel 296 `Hanok After Dark` V02 is the current representative-review candidate at `output/reels/2026-07-13_296/final/EPICKOR_296_02.mp4` (36.05s, 1080x1920, H.264/AAC). The representative found V01's manually timed summary captions incomplete and too low. V02 uses forced alignment against all three approved TTS parts, covers 107/107 spoken words in 20 phrase beats with zero internal gaps/overlaps, and places the single narration lane 410px above the bottom edge. Final contact-sheet, five full-resolution keyframes, ffprobe, and silence QA passed in `output/reels/2026-07-13_296/review-v02.md`. V01 is superseded and must not be uploaded.
- Reel 297 `Dessert Switch` V02 is the current representative-review candidate at `output/reels/2026-07-13_297/final/EPICKOR_297_02.mp4` (36.05s, 1080x1920, H.264/AAC). V01 used scene summaries rather than full narration captions and placed them too low. V02 covers 108/108 spoken words in 20 forced-aligned phrase beats with zero internal gaps/overlaps, uses the same 410px safe caption lane, and removes competing low decorative copy. Final contact-sheet, five full-resolution keyframes, ffprobe, and silence QA passed in `output/reels/2026-07-13_297/review-v02.md`. V01 is superseded and must not be uploaded.
- Reels `299/301/302` continuity-corrected finals were representative-approved on 2026-07-16. Use only `output/reels/2026-07-14_299/final/EPICKOR_299_02.mp4` (36.84s), `output/reels/2026-07-15_301/final/EPICKOR_301_02.mp4` (40.73s), and `output/reels/2026-07-15_302/final/EPICKOR_302_03.mp4` (40.70s), all 1080x1920 30fps H.264/AAC. V01/V02 predecessors are superseded. Hard browser loops were removed; 301/302 short card footage uses endpoint-deduplicated ping-pong proxies, 299's 25fps opener uses a reviewed 30fps interpolation proxy, final playback uses `OffthreadVideo`, and 21-frame wipes fully occlude cuts. Critical ONS phrases are explicitly nowrap/planned. The default caption exclusion is y=1400 with information ending by y=1340. Continuity manifests, source-range probes, TypeScript, contact sheets, former-reset turnaround strips, 302 full-resolution caption clearance, ffprobe, and silence scans passed. Clean ASCII-safe English Instagram captions are stored as `instagram-caption.txt` beside each approved MP4 and synchronized in `output/reels/{slug}/`. Reviews: 299/301 use `review-v02.md`; 302 uses `review-v03.md`.
- YouTube BGM review candidates were added on 2026-07-20 without changing the representative-approved visual streams: `299/EPICKOR_299_03_BGM.mp4`, `301/EPICKOR_301_03_BGM.mp4`, and `302/EPICKOR_302_04_BGM.mp4`. They use three tracks verified in the signed-in EpicKor YouTube Audio Library (`Limo Ride`, `Tiptoe Out the Back`, `Blue Dream`), narration-normalized sidechain ducking, and new AAC audio only. Final measurements are `-16.7/-16.3/-17.2 LUFS` with true peaks `-2.5/-1.6/-1.4 dBFS`; all are 1080x1920, 30fps, 48kHz stereo, and duration-matched. Review dashboard: `output/bgm/review-299-301-302.html`; source/license record: `output/bgm/youtube-audio-library/LICENSES.md`. These are not upload-approved until representative phone review with sound on.
- Post-V02 design exploration is complete: `01 Porcelain Daylight`, `02 Steel After Dark`, and `03 Sujeo Switch` are all representative-directed KEEP directions under `output/reels/2026-07-14_294/design/directions/`. Porcelain Daylight is the selected design system for the current Reel 294 revision.
- The selected direction has been expanded into seven static frames. The first `storyboard-v01` exposed title clipping, low-contrast boundary crossings, tight line spacing, and excess empty space. Corrected `storyboard-v02` preserves v01, uses clean source backgrounds, and fixes all seven frames; manual PNG review confirmed no duplicate embedded captions, clipped headlines, or text collisions.
- Strategy record: `reports/epickor-reels-2.0-strategy-2026-07-12.md`.
- Autonomous operating contract: `reports/epickor-reels-2.0-autonomous-pilot-2026-07-12.md`.
- Final pilot candidate: `output/reels/2026-07-12_293/final/EPICKOR_293_04.mp4` (50.05s, 1080x1920, H.264/AAC).
- Pilot review: `output/reels/2026-07-12_293/review.md`; quality average 92/100 and Visual Variety Score 96/100.
- Recovery decision: preserve the concise pre-293 Reel structure and improve it to 32-42 seconds with a direct-action first frame, stronger thumbnail/narration hook, natural voice, more real vertical footage, and exactly one transparent motion card over a topic-relevant image/video background.
- YouTube-hosted video is reference-only by default; final use requires ownership, written permission, suitable CC/public-domain status, or approved transformative quotation.
- Google AI Pro credits may be used manually through Flow/Whisk for selected 3-5 second bridge/establishing shots. Gemini Developer API is separately billed and must not be activated, funded, or automated without explicit representative approval. Generated visuals remain capped at 25% and cannot carry factual proof or delicate hand/object mechanics.
- Blogs 291-293 research, writing, review, image package, build, deployment, and public verification are 100% complete.
- Thumbnail hotfix deployment and public rendered verification are complete.
- Review record: `reports/blogs-291-293-review-2026-07-12.md`.

## Blockers / Decisions Needed

- **대표님 판단 대기 (2026-08-14 기준 3건).**
  ① **비즈니스 다음 후보** — 오로라월드·위닉스·락앤락 중 방향. 락앤락은 소유구조(2017 홍콩계 PE 인수) 확인이 선행.
  ② **UI/UX 리디자인 5안** — `docs/design/uiux-2026-08/`. 대표님이 "나중에 할 것"이라 명시했으므로 먼저 꺼내지 말 것.
  ③ **`typescript.tsserver.maxTsServerMemory` 3072 → 2048** 하향 여부 — 대표님 자동완성 체감에 직접 영향이라 임의 변경하지 않았다.

- **URL 통합·삭제는 하지 않는다 (2026-08-14 대표님 지시).** 다이소 `218`/`148` 등 중복 통합을 제안했다가 **"url 수정할 생각을 왜 해? 하지마"**로 종결됐다. 재론 금지. 중복은 그대로 두고 9/23 판정 때 데이터로만 본다.

- **리프레시 트랙은 2026-09-23 판정까지 정지.** 일일 리듬이 "신규 2 + 리프레시 1"인데 **리프레시가 0**인 상태가 40일간 이어진다. 의도된 정지이지만 리듬의 3분의 1이 비는 것을 인지할 것. `074`·`206`·`223`이 측정군이라 손댈 수 없다.

- **비즈니스 글은 미리보기에서 승인 버튼이 나오지 않는다. 이건 버그가 아니라 의도다.** `/api/preview/approve`·`reject`가 경로를 `content/blog/{slug}.md`로 **무조건** 만들기 때문에, 비즈니스 슬러그로 승인을 누르면 발행이 아니라 **`content/blog/`에 유령 파일이 생기고** 거부는 없는 경로를 지우려 한다. 비즈니스 발행은 git으로 한다.

- Agoda 파일럿은 2페이지 배포 완료. `affiliate_agoda_click` 데이터 2~4주 검토 전까지 확대 금지.
- Blog `293` V04는 반려로 종결. 유튜브 업로드 후보에서도 제외한다(디스크 파일은 V03이라 동일 여부 미확인).
- 소셜 재사용은 여전히 대표님 선택 + 3편 배치 리듬을 따른다.

## Next Recommended Work

> **Read this list against the newest Current Snapshot before acting on or repeating any line.** Entries here have gone stale within a day before and produced a wrong session-close report. Snapshots are the work record; this is a convenience list.


0a. **[날짜 있음] 2026-08-20 — 코레일 추석 예매 공지 확인.** `200`(제목·표·FAQ)과 `380`이 **"8/20 KTX / 8/25 SRT 예상, 공식 미발표"**로 나가 있다. 한국 블로그가 일제히 그 날짜를 쓰지만 **코레일·SR 공지사항 어디에도 2026 추석 공지가 없다**(2026-08-14 직접 확인). 발표되면 두 글을 확정 날짜로 올린다. **부산 예매 오보와 같은 계열이라 2차 출처로 확정하지 말 것.**

0c. **[날짜 있음] 2026-09-01 — `225` 재작성.** KTX·SRT 통합으로 "둘 중 무엇을 고를까"라는 글의 전제 자체가 사라진다. 지금은 상단 업데이트 고지만 붙여둔 상태다. 본문 35군데가 없어질 사업자를 비교하고 있다.

0d. **[대표님 판단 대기] 비즈니스 다음 후보.** 나비엔 발행 완료. 남은 후보는 **오로라월드·위닉스·락앤락**이고 **수요만 쟀고 커버리지 게이트는 미실시**다. **락앤락은 2017년 홍콩계 PE(Affinity) 인수라 소유구조 규칙 확인이 먼저**다. 문서 `output/strategy/business-candidates_2026-08-14.md`.

0e. **[8/24 이후] 유튜브 쇼츠 10편 성적 판정.** 8/14~8/23 게시. **"넓은 문화 호기심 + 보편적 불안 해소" 가설의 검증**이고, 맞으면 2차 10편을 같은 기준으로 짠다. **아직 확인 못 한 것: 설명란 링크로 epickor.com 유입이 실제로 나오는가** — Studio 분석 탭 트래픽 소스. 유튜브를 쓰는 이유 자체의 검증이다.

0f. **서울 쇼핑 코너 — 백로그가 얇다.** 2026-08-14 게이트에서 상위 4개(안경·여행가방·기념품·한복)가 전부 혼잡/기각. 안경은 전용 도메인이 클러스터를 소유해 **하드 기각**. 남은 것은 문구·을지로 공구·중고카메라이고 **수요를 안 쟀다**. **매일 쇼핑으로 쓸 수는 없다** — 다른 축과 섞는다. **중복 통합(다이소 218/148 등)은 9/23 이후로 미뤘다** — 카니발라이제이션도 검증 안 된 통념이고, 그때 GSC를 새로 뽑으니 **통합 전후를 재서 우리 데이터로 처음 확인**하는 게 낫다.
0. **[날짜 고정] 2026-09-23 — 편의점 클러스터 + 리프레시 프로그램 동시 판정.** GSC에서 **같은 "지난 3개월" 창**으로 새 추출본을 받아 `output/gsc/`에 넣고 `npm run cluster:judge`. 기준선은 2026-08-12에 찍었다(`output/strategy/cluster-baseline_convenience-store.md`). **이 판정 전에 다음 패키지를 클러스터 방식으로 짜는 것은 근거 없는 반복이다.** 스크립트가 같은 추출본이면 스스로 거부하고, "차이 없음"도 하나의 결론으로 낸다 — 중간을 취해 "긍정적"이라 부르지 말 것. **같은 날 리프레시 트랙도 판정한다 — `npm run refresh:judge`** (기준선 `output/strategy/refresh-baseline.md`, 35편 치료군 / 30쌍 엄격 부분집합 72대72 / 큐 잔여 22편 제2 대조군). **GSC 한 번 뽑으면 둘 다 끝난다.**

0b. **[날짜 있음] 가을 행사 패키지 — 남은 3편.** 사이클 `output/strategy/keywords_2026-W34.md`(대표님 승인 완료, `378`·`379` 발행됨).
   - **자라섬재즈 — 9월 2주 집필.** 10/9~11 가평, 한불수교 140주년 프랑스 포커스, 1일권 ₩88,000. **제목에 Korea 명시 필수** — "Jarasum"만으로는 Korea 게이트 불통.
   - **에버랜드 할로윈 — 블로커.** 2026 기간 **미발표**. 스펙 v1이 이번 달 사실을 요구하므로 발표 전 집필 불가. **8월 말 에버랜드 공식 재확인.**
   - **서울빛초롱 — 10월 1주.** 11/1~1/31 청계천은 **2차 출처**다. 집필 시 서울시 공식으로 **반드시 재검증** — 부산 예매 건에서 2차 출처가 틀렸던 전례가 있다.
   - **부산 예매 발표 감시.** `379`는 "2026 예매 미공개"를 전제로 썼다. 2025 리듬대로면 **얼리버드가 8월 하순**이다. 발표되면 `379`에 실제 날짜·가격을 반영한다.

1. **레인 판정 — 8/7 추출에서 1차 측정 완료, 개방은 보류 유지.** 신규 코호트 CTR 1.11%(성숙분 1.28%)로 **게이트 1.5% 미달이지만 절반이 발행 7일 미만·노출 50 미만이라 판정 이르다.** `344` 1.97%·`347` 2.17%는 개별 통과, `345` 0.40% 미달. 스낵 시리즈(`358`~`371`)는 노출 자체가 미착지. **다음 추출(1~2주 뒤)에서 재판정 — 그 전까지 뷰티(2차 레인) 계속 보류.**
2. **리프레시 트랙 — 2026-09-23 판정까지 중단.** 계획서가 "45편 효과를 판정한 뒤 계속 여부를 결정한다"고 게이트를 걸었는데 **판정 없이 35편을 더 태웠다**(08-06~08-12). 2026-08-12에 뒤늦게 기준선을 찍었으므로(`refresh-baseline.md`) **이제는 판정이 가능하다 — 그때까지 큐를 더 소진하지 않는다.** 남은 25편은 그대로 두는 것이 제2 대조군으로서 값어치가 있다(22편이 기준선에 기록됨). 판정이 양수로 나오면 재개하고, "차이 없음"이면 슬롯을 신규 1차 레인에 넘긴다.
3. **`용리단길`이 `/seoul` 허브 신규 글 1순위 후보.** `275`를 쓰면서 실측이 이미 쌓였다 — 신용산역 2번 출구·용산역 1번 출구에서 도보 5~10분, 한강로2가 골목, 아모레퍼시픽 신사옥이 촉발, 미쉐린 가이드가 용산 동네 가이드 발행. **허브에 동네 12곳이 있는데 용리단길이 없다.** 익선동·연남동과 같은 층위다.
4. **비즈니스 섹션 다음 후보는 커버리지 게이트를 먼저 통과시킨다.** 오뚜기·풀무원으로 B-2가 9편이 됐고 식품 쏠림(삼양·오뚜기·풀무원)이 생겼다. **2026-08-09 대표님 지시로 대기업·상장사 후보는 전부 기각·재론 금지** (하이트진로·대상 종가·BGF/GS리테일 포함). JMW형 중소기업만, 게이트 1번은 "영어권 기획기사가 이미 있는가"다 — FACTS 참조. **주간 비즈니스 주제는 집필 전 대표님 승인이 필요하다** — 초안부터 쓰지 말 것.
5. **릴스 지표 기록 — 8/13·14·15 게시 후.** 예약은 2026-08-07에 완료했다(위 스냅샷). 게시되면 1h/24h/7d 조회·저장·공유·시청완료율을 `output/reels/metrics.json`에 남긴다. 저장소에 실측 조회 데이터가 아직 0건이고, **측정 없이는 조회수를 설계할 수 없다**는 게 Reels 2.2 진단의 핵심이었다.
6. **W34 씨앗 축을 바꿔야 할 수 있다.** W33에서 **씨앗 31개를 태워 5개**를 건졌고, 기각 사유의 다수가 "수요 없음"이 아니라 **"이미 누가 썼음"**이었다. 1차 레인의 미검증 개별 제품이 줄고 있다는 신호다. 다음엔 개별 제품 열거 대신 **편의점 PB·냉동식품·음료 신제품** 같은 다른 랭킹 프레임을 쓰거나, 리프레시 비중을 늘린다.
7. **`189` 꼬깔콘 — 대표님 답변 대기.** 커버리지는 통과했고 훅도 좋은데(손가락에 끼워 빼먹는다) 구글 분기가 2개뿐이다. W33에서 세 가지 표현으로 재검사했으나 4/0/8로 동일했다. **단독 발행 vs 기존 스낵 글에 섹션으로 편입** 미결.
8. **릴스 지표 기록** — `174`(7/31), `326`/`321`/`320`(8/1~8/3)이 착지했는데 `output/reels/metrics.json`에 아직 없다. 측정 없이는 조회수를 설계할 수 없다는 게 Reels 2.2 진단의 핵심이었다.
9. **아마존 클릭 효과 판정 (2~3주 뒤)** — 버튼(08-01)과 한 줄 링크 273편(08-01)의 합산 성적표는 **클릭 수가 35에서 얼마나 움직이는지**다. 전환율은 이미 11.43%라 병목은 클릭 수이고, 재신청 계정 `epickor-20`의 **180일 내 판매 3건** 시한에 직결된다.
10. **사진 적은 글 나머지 53편 보강** — 08-02에 6편 완료. 세로 이미지는 **그대로 둔다**(대표님 판정). **KTO API는 장소 주제에만** — 브랜드·제품엔 무효임이 08-04에 확인됐다.
11. **보류 항목** — 뷰티 주제(Neogen, Biodance, Medicube-vs)는 **2차 레인 게이트 통과 전까지 보류**(위 1번). Creatrip 제휴는 **폐기**(재론 금지). **UI/UX 리디자인 5안은 대표님이 "나중에 할 것"이라 명시** — 먼저 꺼내지 말 것.
12. **배포 게이트 규칙** — 로컬 `next build`를 검증 게이트로 쓰지 말 것(이 머신에서 메모리로 실패하며 `NODE_OPTIONS`로 안 풀린다). `npx tsc --noEmit`이 실질 검사다. **dev 서버를 띄웠으면 `TaskStop` 후 포트가 실제로 닫혔는지 확인** — 안 그러면 1GB가 남고, `.next/dev/lock`을 쥔 채로 남으면 다음 기동이 500으로 죽는다(2026-08-05 실측).

## Social Distribution Next Actions

1. After 22:00 KST on 2026-07-20, verify that Card News `174` published successfully on both Instagram `@epickorsnippets` and the EpicKor YouTube Community tab. Check all seven cards in order, first-card crop, caption integrity, and the YouTube clickable `/blog/174` link. The Instagram duplicate was created from an initial channel misunderstanding but remains intentionally active because the representative ended the session without requesting cancellation.
2. Monitor the 17 scheduled legacy YouTube Shorts from Reel `137` through `158`: one Public Short per day at 21:00 KST from 2026-07-21 through 2026-08-06. Check the first two releases for processing quality, title/description rendering, comments, impressions, views, and `epickor.com` referral behavior before changing the cadence. Durable manifest: `output/youtube/legacy-shorts-137-158-manifest.json`.
3. If the Card News `174` Community-post result is clean, use the proven YouTube workflow for the remaining approved carousels. YouTube supports up to 10 images/GIFs per Community post and accepts the current seven-card 1:1 packages. Candidate queue begins with `2026-07-15_124` and `2026-07-15_musinsa`, followed by the rows marked `ready for representative scheduling` in `public/assets/cardnews/CARDNEWS_INDEX.md`.
4. Preserve the operating cadence unless the representative changes it: Instagram card news Tuesday/Wednesday/Thursday, Instagram Reels Friday/Saturday/Sunday, YouTube Shorts daily at 21:00 during the current legacy batch. Decide a separate YouTube Community cadence after the first 1-3 posts; a practical starting test is Tuesday/Wednesday/Thursday at 22:00, one hour after the Short.
5. Improve the Instagram website funnel before scaling carousel uploads. Instagram caption URLs are not reliably clickable, so choose and implement either a stable EpicKor profile link, a lightweight link hub, or a campaign-specific bio-link rotation. YouTube Community URLs are clickable and should keep the full `https://www.epickor.com/...` form.
6. Phone-review the BGM variants for Reels `299/301/302` with sound on before treating them as upload masters. If approved, use the measured narration-first BGM mix as the starting point for the next three new-post Reels; if rejected, keep the approved voice-only versions.
7. Threads revival, broader Facebook/X distribution, and repeatable cross-channel reporting remain strategy work. Before adding channels, finish the Instagram/YouTube scheduling SOP and track per-post reach, saves, comments, website referrals, and affiliate clicks so distribution effort can be compared channel by channel.

## Standard Blog Guardrails

- Freeze scope before drafting; target 2,200-2,800 words when intent warrants it.
- Use official/current sources for operational facts and label variable prices/hours.
- Every new or meaningfully updated post gets two slim affiliate CTAs unless explicitly omitted.
- Add real HTML tables for comparisons and inspect rendered table wrappers.
- After review/private-preview actions, fetch origin and inspect divergence before publication.
- Verify local build/render, public pages, all local assets, sitemap, and reverse links once each unless a failure appears.

## Recent Change

- 2026-08-14: **신규 5편 + 유튜브 첫 실측 + 쇼핑 코너 개시 + 비즈니스 재가동.** 상세는 위 Current Snapshot. 재사용 규칙 여섯만 남긴다.
  - **플랫폼마다 원하는 게 다르다. 한쪽 지표로 다른 쪽을 고르지 마라.** 인스타 저장수로 유튜브 1순위를 짰다가 실측에서 통째로 뒤집혔다 — 같은 DMZ 영상이 2,172뷰 대 203뷰다. **유튜브는 넓은 호기심·보편적 불안 해소, 인스타는 저장할 실용.**
  - **"영어 수요가 있다"로는 부족하다. 그 수요가 어느 나라에 있는지를 봐야 한다.** 파세코가 자동완성 15분기로 후보 최상위였는데 **그 15분기가 전부 파키스탄·동남아**였고 SERP는 알리바바+현지 소매 100%였다. **자동완성은 국가를 말해주지 않고 SERP가 말해준다** — 게이트에 추가했다.
  - **수요가 크다는 건 비어 있다는 뜻이 아니라 답이 부실하다는 뜻일 수 있다.** `where to buy X in seoul` 6종 전부 reddit 접미사가 1~2번이었는데, 정작 상위 4개 백로그(안경·여행가방·기념품·한복)가 전부 커버리지에서 걸렸다. 안경은 **전용 도메인이 클러스터를 소유**해 하드 기각.
  - **노출이 크다고 기회가 아니다. 봇일 수 있다.** `074`가 코너 노출의 41%(9,613)에 클릭 11인데, 따옴표 연산자 쿼리 21건(2,329노출·클릭0·평균 6.5위)이 전부 이 글을 향한다. **다만 그걸 빼도 0.15%라 진짜 문제도 함께 있다** — 처음에 "봇이라 왜곡"이라 말한 건 과장이었다.
  - **유튜브 업로드 자동화 함정 4개** (FACTS 상세): 구글이 크롬 로그인을 막아 **웨일 프로필**을 쓴다 / Studio 기본 채널이 **VDOLAB**이라 채널 ID로 직접 들어간다 / 파일 투입은 **`파일 선택` 버튼 + expect_file_chooser만** 작동한다 / **CDP 연결 브라우저는 50MB 상한**이라 최근 세대 릴스(62~125MB)는 유튜브용 사본이 따로 필요하다.
  - **날짜 필드는 타이핑하면 시간 칸으로 들어간다.** 유튜브 예약에서 `잘못된 시간` 오류가 났고 **커밋 게이트가 막았다.** 달력 셀을 클릭해야 하고(Meta와 같은 교훈), **날짜를 고르면 시간이 초기화되므로 시간은 반드시 나중**이다.
  - 커밋 `0f13f58d` `c33eb362` `a4f44432` `0f0a4fa9` `117848b9`.


- 2026-08-12: **신규 3편(`377`·`378`·`379`)·리프레시 1편(`145`) 발행 + 클러스터 측정 기준선 + 다음 대주제 결정.** (`376`은 날짜가 바뀌기 직전인 08-11자다.) 상세는 위 Current Snapshot. 재사용 규칙 여섯만 남긴다.
  - **대조군은 결과를 보기 전에 정한다. 그리고 클릭뿐 아니라 발행일까지 맞춘다.** 클릭만 맞추면 클릭 0인 신규 글이 클릭 0인 최고참 글과 짝지어지는데, 새 글은 개입과 무관하게 색인만으로 자라므로 **평범한 성장이 개입 효과로 둔갑한다.** 이번엔 10편이 그 상태였다.
  - **잡음 하한은 비교가 실제로 기대는 기저로 계산한다.** 전체 총합을 기준으로 삼으면 하한이 부풀어 **진짜 효과를 "판정 불가"로 묻는다** — 리허설에서 기저 12의 +10이 ±17에 묻혔다. 그리고 **한 항목이 총합의 80%를 넘으면 그 총합은 그 항목에 대한 판정**이므로, 편중에 흔들리지 않는 부수 지표를 반드시 같이 둔다.
  - **측정의 입력이 gitignore에 걸려 있지 않은지 확인한다.** `output/gsc/`가 통째로 미추적이라 기준선을 재현·감사할 방법이 없었다. **미추적 기준선은 실험을 약화시키는 게 아니라 삭제한다.** (같은 유형: `continuity-manifest.json`, 릴스 텍스트 산출물.)
  - **계획 단계의 2차 출처 수치는 출처와 함께 적고, 공식 확인 전까지 확정으로 쓰지 않는다.** W34 후보표에 "부산 예매 10/1 오픈"이라 적었는데 블로그 출처였고 **공식은 2026 예매를 아직 발표조차 안 했다.** 게다가 그 오류 때문에 **시점 판단이 반대 방향으로 틀렸다** — 9월 초가 아니라 지금이 적기였다(2025 리듬대로면 얼리버드가 열흘 앞). 글은 "미공개"를 그대로 쓰고 언제 지켜볼지를 알려주는 구성으로 갔다.
  - **파이프라인 스텝은 부작용이 있다고 가정하고, 돌린 뒤 `git status`로 확인한다.** `--step research`가 **읽기 전용이 아니었다** — 큐에서 제 주제(갑질)를 골라 `in_progress`로 바꿔놨다. `--step review`가 발행글을 망가뜨린 것과 같은 계열이라 CLAUDE.md에 경고를 나란히 넣었다.
  - **리프레시는 이미지를 안 건드려도 캡션을 전수 재검한다.** `145`의 낡은 캡션 3개가 사진을 반박하고 있었고(자동 검사는 전부 통과), **내가 같은 초안에서 평양식 물냉면에 "Bibim style"이라는 새 오캡션을 달았다.** 더 미묘한 함정: 리프레시가 본문에 **"메밀면은 회색·반점, 밀면은 순백"** 이라는 식별 기준을 넣는 순간, 면이 흰 기존 사진이 **무해한 자료에서 본문을 반증하는 자료로 바뀐다.** 사실을 촘촘히 넣을수록 기존 사진과 충돌할 표면이 늘어난다.
- 2026-08-11: **릴스 3편 재작업 완료 → 8/25·26·27 예약, 그리고 릴스 폴더 체계 통합.** 상세는 위 Current Snapshot. 세 가지만 재사용 규칙으로 남긴다.
  - **"중복이니 지우자"는 지시는 실측 뒤에 실행한다.** `output/final/reels/`를 지우라는 지시를 그대로 따랐으면 **2.91GB·120파일**이 날아갔다 — 그중 24개가 작업 폴더 없는 릴스 13편의 **유일한 사본**이었고 `output/*`는 gitignore라 복구 불가다. **크기 일치는 동일성의 증거가 아니다(SHA로 대조).** 삭제가 아니라 **이동 후 빈 트리 제거**면 지시한 결과(창구 하나)를 손실 0으로 얻는다.
  - **예약 목록은 자체 스크롤 컨테이너 안에서 lazy-load 된다.** `page.mouse.wheel`은 창을 굴려서 첫 읽기가 **5건 → 실제 13건**이었다. 그대로 갔으면 **이미 카드뉴스가 있는 날에 릴스를 겹쳐** 넣었다. 컨테이너의 `scrollTop`을 직접 올린다.
  - **패치 스크립트가 코드를 줄 단위로 삽입하면 CRLF 파일에서 어긋난다.** `split('\n')`이 남긴 `\r` 때문에 `$` 앵커가 안 맞아 **셔뱅 위에 import가 들어가 7개 파일이 파싱 불가**가 됐다. 그리고 블록 주석 안의 `output/reels/*/final/`은 `*/`가 주석을 닫는다. **둘 다 전 파일 `node --check`로만 잡혔다** — 패치 후 필수.
  - 커밋 `140654a8` `0e6316cf` `919fb891` `dc4ab939`.

- 2026-08-10 (밤): **`071` CTR 작업이 라이브 렌더링 버그 발견으로 바뀌었다.** `/blog/071`이 `델리만쥬` 자리에 **`?<FFFD>리만<FFFD>?`**를 프로덕션에서 렌더하고 있었고, `296`은 스마트 따옴표 4곳이 같은 방식으로 부서져 있었다. **파일이 여전히 유효한 UTF-8이라 리뷰어·빌드·이미지 감사가 전부 통과시켰다.** 원인은 UTF-8→cp949 왕복(PowerShell `Set-Content`가 `-Encoding utf8` 없이는 ANSI로 쓴다). 둘 다 복구·라이브 검증 완료. **게이트 신설 `npm run audit:encoding`** — 수정 전 파일로 먼저 검증해 5줄 전부 잡고 exit 1 하는 것을 확인한 뒤 채택했다. 커밋 `0c915576`.
  - **동시에 `071` 제목 수정 계획을 폐기했다 (오진).** GSC 실측에서 **CTR이 제목이 아니라 순위를 따라간다**(1~3위 3.33% / 3~5위 2.12% / 5~8위 0.52%). 6,097노출의 정체는 헤드 2개(`deli manjoo`·`delimanjoo`)이고 **둘 다 7위**인데, 그 SERP는 **Yelp·Postmates·브랜드 공식몰**이 점유한 로컬/구매 의도라 해설글로 못 이긴다. 상한은 **분기당 +10~20클릭**이지 +100이 아니고, 제목을 바꾸면 **이미 버는 149클릭/분기**를 건다. 저위험 수정만 적용: description에 프랜차이즈 사실 앞세우기 + 한 단어 `Delimanjoo` 표기(2,610노출인데 본문에 2번뿐이었다), 명동 문단 얼버무림 → "1998년 명동역 4호선 1호점" 직설.
  - **덤으로 나온 편집적 발견**: 최고 전환 클러스터가 **오타**다 — `duli/doli/dooli manjoo` 계열이 **1,704노출·44클릭·2.58%**(노출의 18%인데 클릭의 49%). 소리로 듣고 친 검색어이므로 이 페이지의 독자는 **실물을 이미 만난 사람**이다.

- 2026-08-10 (저녁): **계절 2편 `374` 한글날 · `375` 수능 발행** — 둘 다 날짜가 고정된 주제라 **10월/11월이 아니라 8월에 써야** 순위가 붙는다. 커밋 `0e1ba268`.
  - `374`의 리드는 영어권 여행 글이 통째로 틀린 지점이다: **국립한글박물관은 방문객에게 2024-10부터 닫혀 있고**, 2025-02-01 그 증축공사 용접 중 화재가 나 **2028년 하반기까지(목표 2028-10) 휴관**이다. 올해 나온 가이드도 여전히 거기로 안내한다. 대체는 **세종이야기**(광화문광장 지하, 무료, **금요일만 21:00까지**) — 그리고 **2026-10-09가 금요일**이다. 여기에 2026년 10월이 **연휴 두 번**(개천절 10/3토→대체 10/5월, 한글날 10/9금)이라는 예약 정보와, **2005년부터 동결된 궁 관람료 ₩3,000/₩1,000이 2027-01-01에 오른다**는 시의성을 붙였다. 날짜사(11/4 가갸날 → 1940년 안동 해례본 발견 → 10/9, 북한은 1/15)는 한국어 출처에서만 나온다.
  - `375`는 커버리지가 **정확히 0편**이었다. 영어 듣기 35분간 **전국 항공기 이착륙 통제(약 140편 조정, 비행 중 3km 이상 대기)** + **포 사격·전차 이동 중단**, 증시 10:00~16:30, 시험장 200m 차량 통제. 응시 554,174명(7년 최다, 졸업생 28.9%)으로 재수 산업을 숫자 하나로 보여줬다.
  - **이미지 8장 전부 커먼즈.** Korea.net 수능 11장 세트와 한글날 세트는 **모든 파일의 description이 동일**해서 파일명에 프레임 정보가 없다 — 전부 내려받아 눈으로 보고 골랐다(`372` 교훈의 적용). 한글날 세트는 촬영일이 **2012-12-28 공휴일 재지정 축하 행사**라 겨울 사진을 가을인 척하지 않도록 본문에 명시했다.

- 2026-08-10 (오후): **"신규 주제 고갈" 보고를 대표님이 반려했고, 재점검 결과 시장이 아니라 방법이 문제였다.** W33b에서 후보 0개를 올렸는데 오류 3가지 — ① 커버리지 게이트가 "영어권에 글이 있나"를 물어서 **"그 각도가 선점됐나"**를 안 물었다 ② 시드 축이 전부 *새것* 탐색이라 기자들이 가장 많이 판 자리를 팠다 ③ **GSC UI 내보내기 1,000행 절단면**을 시장의 끝으로 착각했다. **교정법(재현 가능): 발행 371편 본문을 스캔해 "여러 글이 언급하는데 제목이 된 적 없는 개념"을 뽑는다.** 된장 14편·한옥스테이 7편·보쌈 7편·족발 5편, 그리고 수능·한글날 **커버리지 0**. 여기서 나온 `372`(족발vs보쌈, 2,284단어)·`373`(된장vs고추장, 2,197단어)도 같은 날 발행했고, `372`는 대표님이 **사진이 한국 것이 아니라고 지적**해 교체했다 — 커먼즈 파일명이 `Korean cuisine-Bossam-01`인데 실제로는 중국식 밀전병이 곁들여 있었다. **파일명이 아니라 곁들이를 본다.**

- 2026-08-09 (저녁): **딥다이브 후보 기준 전복 + 윈앤윈 발행.** 대표님이 상장 대기업 후보(하이트진로·대상 종가·BGF/GS리테일)를 전부 기각 — 딥다이브 코너는 무료 대기업 소개가 아니라 **트립클립 수출바우처 영상에 "EpicKor 기획기사"를 패키지로 붙이는 미래 상품의 포트폴리오**다(CLAUDE.md에 규칙화). JMW형 중소기업 5후보를 발굴해 재검증했더니 **영어권 커버리지 확인에서 4개가 무너졌다**: DAC/헬리녹스는 Outside Magazine이 "The King of Tents" 대형 피처를 이미 썼고, 영주대장간 호미는 UPI·Quartz가 2019~20에 보도했고, 레오폴드는 실체가 수입·유통이고, HJC는 중견 규모+기존 커버리지. **교훈: 후보 발굴 게이트의 1번은 "영어권 기획기사가 이미 있는가"다** — 수출 90% 기업일수록 해외 업계 매체가 먼저 써놨을 확률이 높다. 유일한 합격 **윈앤윈**을 심층 조사해 발행(`/business/winwin-archery-company-deep-dive`, 100/100, 라이브 200): 박경래(1975 1세대 국가대표→1985 세계선수권 코치)가 연봉 1억을 버리고 전재산 5억으로 카본에 베팅한 1993년 창업, 애틀랜타 1996 장비 수모→1997 초중등 국산 활 의무화, **야마하 2002 철수 인수(일본 등록 선수 80~90%가 윈앤윈)**, 삼익스포츠(삼익악기 1975 활 사업부, 피아노 현 노하우) 2015 파산으로 FILE 01과 서사 연결, 파리 2024 **128명 중 65명 위아위스**, 매출 260억(수출 95%)·특허 46개·그래핀 라이저. 이미지는 wiawis.com 공식 팩샷 2점(0차).

- 2026-08-09 (오후): **리프레시 큐 Tier 2를 12편 한 배치로 비웠다** — `175` 남대문vs동대문 · `233` KBO · `263` 삼계탕 · `255` 백화점 푸드홀 · `062` 김치간 · `311` 떡볶이 · `258` 노량진 · `288` 포장마차 · `267` 한강 피크닉 · `254` 화채 · `270` 소금빵 · `315` 명동. 전부 리뷰어 100/100. **큐는 43 → 31편(전부 T3)으로 줄었고 T2는 0이다.**
  - **대표님이 "왜 하루 1편이냐, 다 하면 안 되냐"고 물었고 그 지적이 옳았다.** 1편/일은 실행계획의 리듬 규칙이지 상한이 아니고, 7/31에 이미 한 세션에 14편을 처리한 전례가 있었다. 다만 T3 31편은 스펙이 잘 안 붙는 층이라 **효과 측정 뒤에 판단**하기로 하고 T2만 털었다.
  - **이번 배치에서 가장 값나간 건 또 사실 오류였다 (5회 연속).** `233`은 **잠실야구장이 2026시즌 후 철거**되고 LG·두산이 2027~2031년 서울올림픽주경기장으로 옮긴다는 걸 한 줄도 안 쓰고 있었다 — 즉 올해가 45년 만의 마지막 시즌인데 그 사실이 없었다. `175`는 더 나빴다: **남대문을 "저녁까지 하는 시장"처럼 써놨는데 실제로는 07:00~17:00에 일요일 휴무가 많다.** 동대문과 이름이 비슷하다는 이유로 영어권이 통째로 오해하는 지점이다. `263`은 제목이 "Boknal 2026"인데 본문은 **"정확한 2026년 날짜는 한국 달력을 확인하라"**고 얼버무리고 있었다(실제: 초복 7/15·중복 7/25·말복 8/14, 20일 간격의 **월복** 해).
  - **"요금을 확인하세요"는 리프레시 대상 문장이다.** `258`은 그 문장을 여덟 번 반복하면서 **금액을 한 번도 안 썼다** — 실제 초장집 상차림비는 **1인 ₩4,000, 매운탕을 안 시키면 ₩6,000**이다. `255`는 푸드홀 가이드인데 **영업시간이 한 줄도 없었다**(전 백화점 20:00 마감, 더현대 식당가만 22:00).
  - **큐 자동 이탈 조건은 `won > 0 && hangul >= 3`이다** (`scripts/build-refresh-queue.mjs`). ₩만 넣고 한글을 2개만 넣으면 고쳤는데도 큐에 남는다 — 254·270·315가 그렇게 남아서 한글을 보강했다. 제목 연도 스탬프는 `yearInTitle`로 표시만 되고 이탈 조건이 아니다(그래도 스펙이므로 254·270 제목에서 뺐다).
  - 리뷰어 함정: FAQ를 `###`나 `##`로 쓰면 **Q&A 0개로 집계돼 실패**한다. `**Q: ...**` 형식이어야 한다(255·258·267·254에서 발생). `311`은 제목 Korea 게이트에 걸렸다 — "Tteokbokki Guide 2026"에 한국 지시어가 없었다.

- 2026-08-09: **Korean Makers 6편을 카피 폴리시 후 재렌더하고 8/16~21 Meta 예약까지 완료**했다. 대표님 지적("한국어 번역이 AI가 쓴 것처럼 딱딱하다, 영어도 그런가")에 대한 진단: 어색함의 대부분은 **직역 탓**이었고(영어 수사구조를 그대로 이식 + 전부 ~습니다체), 영어 자체에도 대시 남용과 캐러셀마다 반복되는 공식("Here's the part nobody sees" 류)이 남아 있었다. 둘 다 수정 — 영어 42장 본문 재작성 후 재렌더, 검토용 한국어는 직역이 아니라 **한국어로 다시 쓴 재작성본**으로 교체. **웹 반영 누락도 이때 발견**: 커밋 3개가 로컬에만 있어 라이브가 구버전이었다(푸시 후 42장 바이트 단위 일치 검증). **Meta 예약 자동화를 카드뉴스용으로 신설** (`.claude/skills/cardnews/scripts/schedule-meta-cardnews.py`) — 6편 × (Facebook+Instagram) 12건 전부 오전 5:00, 플래너 육안 검증 완료.
  - **실측 함정 4건 (전부 스크립트에 반영)**: ① 업로드 후 `contenteditable`이 2개가 되고 **첫 번째가 hidden**이라 `.first`는 예외가 난다 → 보이는 첫 요소를 쓴다. ② AM/PM 스핀버튼의 `.value`는 **항상 빈 문자열**이고 상태는 `aria-valuetext`에 있다 — `input_value()`로 비교하면 조건이 영영 안 맞아 **전 게시물이 오후로 예약된다**(8/16 리허설에서 잡았다). ③ 마지막 탭을 닫으면 **Chrome이 통째로 종료**되어 다음 `new_page()`가 TargetClosedError를 낸다 — 런처 탭은 건드리지 말고 자기 탭만 쓴다. ④ 미디어가 있는 컴포저에서 이동하면 beforeunload가 뜨는데 **sync API의 dialog 핸들러는 greenlet에서 터진다** — 새 탭으로 우회한다.
  - 영속 프로필은 `D:\dev\.browser-profiles\epickor-meta`다. **스크래치패드에 만들면 세션마다 로그인이 날아간다** (이번에 한 번 헛돌았다).

- 2026-08-08 (배치 1 컨펌 + 배치 2 완성): **대표님이 v2 배치 1(삼익·도루코·쿠쿠)을 컨펌**했고, 같은 원칙으로 배치 2 — 모나미=**연습장**(줄노트·빨간 여백선·테이프 사진·바를 정(正) 획 진행표시·Ink Free 손글씨), JMW=**윈드터널**(차콜+모터 동심원 링·원형 제품 패널·**MYTH/FACT 판정 배지**·파워바), 휴롬=**프레시 프레스**(미스트 그린·유리잔형 프레임·물방울 디바이더·주스 채움 진행표시) — 21장을 제작해 같은 아티팩트 링크로 검토 요청했다. 이미지 0차 실측 추가: **모나미 공식몰은 JS 렌더라 Commons가 실물 1순위**(153 실물 3파일 확보), **jmwkorea.com은 메인 페이지의 `it_id` 목록 → `/data/item/{id}/{MODEL}.png`로 팩샷 확장**(PHANTOM·AIRJET 2기종 신규), **hurom.com은 Shopify `products.json`으로 전 카탈로그 열람**(H101·H200·CP50 신규). 렌더러 교훈 추가: 왼쪽 정렬 flex column 안의 칩/배지는 `align-self:flex-start`가 없으면 전폭으로 늘어난다(MYTH 배지·GIMHAE 필 실측); 폰트 폭 계수는 Segoe UI Black italic caps 0.75, Segoe 900 mixed 0.68, Segoe Light caps 0.72. 구조 게이트 3종 PASS, 42장 전수 눈검수. 예약 제안: 8/16~21 6일 연속 (05:00 KST) — 배치 2 컨펌 대기.

- 2026-08-08 (v2 재설계): **Korean Makers 카드뉴스 배치 1을 대표님 피드백으로 전면 재설계했다.** 피드백 5개: ① 캐러셀 3개가 "포인트 컬러만 다른 같은 세계"다 → 각자 이야기에 맞는 시스템으로 분리(삼익=**선버스트 카탈로그**: 기타 바디 피니시 그라운드+Georgia 세리프+기타줄 디바이더+프렛도트, 도루코=**블레이드**: 면도날 사선을 레이아웃으로 쓰는 DIN 스틸 미니멀+레드 헤어라인 글린트, 쿠쿠=**안방극장**: 아치 돔 프레임+라운디드 타입+EP 배지+채널바). ② 텍스트 겹침/줄간격 → 렌더러를 플로우 레이아웃으로 재구축(`render-makers-v2.py`)하고 **렌더 후 오버플로 JS 실측 게이트** 추가. 사선 요소는 자유 회전 대신 **사진 클립과 동일 폴리곤 레이어**로 그려야 평행이 유지된다(자유 회전은 각도가 어긋나 본문을 관통했다). ③ 카드 위 한국어는 캐러셀당 **한 줄 세로 낙관**으로만. ④ 영어 카피 전면 구어체 리라이트(1장 최우선). ⑤ 재제안은 아티팩트 링크로. **줄 단위 fit**: 헤드라인 크기는 단어가 아니라 \n으로 나뉜 **가장 긴 줄**로 계산해야 고아줄("MIGHT" 단독 줄)이 없어진다 — 세리프 대문자는 글자폭 0.74em, DIN 컨덴스드 0.5em. 구조 게이트 3종 PASS, 21장 전수 눈검수 완료. 예약(8/16~18)은 대표 승인 대기.
