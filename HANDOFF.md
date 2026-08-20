# HANDOFF - EpicKor Current Operations

> Fast-start dashboard only. Historical detail through 2026-07-11 is in `docs/handoff/HANDOFF_ARCHIVE_THROUGH_2026-07-11.md`.

## Start Here

1. Read this file.
2. Run `git status --short` and `git log -8 --oneline`.
3. Preserve unrelated dirty files.
4. Read only files named under Active Work or the user request.
5. Search the archive narrowly with `rg` only for a specific slug, decision, or incident.

## Current Snapshot - 2026-08-20 (두 채널 캘린더를 스케줄러에서 직접 읽었다)

- **유튜브 쇼츠 10편 추가 예약 완료 — 08-30~09-08.** 매니페스트 `output/youtube/bridge-2026-08-30-manifest.json`
  (영상 ID·검증 기록 포함). 목록 재확인: **08-20~09-08 20일 연속 전부 `예약됨`, 초안 0.**
  선정은 08-14 배치 실측 기준(넓은 호기심 / 보편적 불안 해소)을 따랐다 — 음식 5, 문화충격 3,
  교육 1, 도시사 1. 여행 로지스틱스(찜질방 263)와 쇼핑 니치(MU:DS 138)는 제외.
  `376` 1+1편만은 쇼핑 니치에 가까워 **이 배치에서 가장 위험한 픽으로 매니페스트에 명시**했다.
- **인스타는 이미 하루 1건이 돌고 있었다 — 다만 카드뉴스만이 아니라 릴스와 슬롯을 나눠 쓰고 있다.**
  `/latest/posts/scheduled_posts` 실측: **08-21~09-17 28일 연속, 빈 날 0.**
  `CARDNEWS_INDEX.md`만 보면 8/25~9/2·9/6~9/8·9/12가 비어 보이는데 **전부 릴스가 채우고 있다.**
  하마터면 "13일 공백, 카드뉴스 13편 신규 제작 필요"라는 틀린 결론을 낼 뻔했다.
- **그 과정에서 실제 결함 1건을 찾아 고쳤다.** `musinsa` 카드뉴스가 인덱스에는 09-17로 적혀 있는데
  플래너 실제 값은 **09-03 오후 8:00**이었고, 같은 날 05:00의 `395`와 겹쳐 하루 2건이 나가고
  09-17은 비어 있었다. FB·IG 두 행 모두 09-17 05:00으로 옮기고 전체 재스캔 —
  **28일 연속·중복 0·빈 날 0.** 인덱스는 *의도한 날짜*를 적을 뿐 예약을 재확인하지 않는 구조다.
- **통합 캘린더를 `docs/social-calendar.md`로 남겼다.** 이 착시가 재발하지 않게 하는 게 목적이다.
- **재고 상태가 두 채널이 다르다.** 인스타는 **카드뉴스 73폴더·릴스 59렌더 전량 예약 완료 — 09-17
  이후는 신규 제작이 필요**하다. 유튜브는 **미게시 릴스가 약 42편** 남아 09-08 이후는 스케줄링만 하면 된다.
- 자동화 실측 2건(FACTS 기록): `connect_over_cdp`는 **50MB 초과 파일을 못 넣어** 허브 렌더(68~100MB)가
  막혔고, **CDP `DOM.setFileInputFiles`**로 우회했다. 스튜디오 날짜 선택기는 `ytcp-scrollable-calendar`라
  **8·9·10월이 한 화면에 쌓여 있어** 월 이동이 아니라 **월 라벨 y구간 안의 날짜 셀**을 클릭해야 한다.
- **코레일 추석 예매 일정이 확정돼 `200`·`380`을 정정·배포·라이브 검증했다 (커밋 `09883d97`).**
  공지는 **8/13에 등록**돼 있었다 — 우리가 확인하고 "미발표"로 적은 바로 그날이다.
  **널리 퍼진 "8/20 KTX · 8/25 SRT"는 틀렸고**, 실제는 사전예매 **9/3~9/4**, 일반예매 **9/7~9/11**(노선별),
  잔여석 **9/11 15:00~**(역 창구는 이때부터). `200`은 **제목에 "late August"가 박혀 있어** 독자를
  한 달 틀린 시점으로 보내고 있었다 — 제목·description·표·FAQ 전면 교체, 둘 다 리뷰어 100/100.
  - **380이 던져놓은 열린 질문의 답이 나왔다.** 합병 후 SR 별도 판매가 사라지고
    **수서 출·도착 KTX가 9/10 하루를 따로 갖는다** — 서울~부산(9/11)보다 하루 빠르다.
  - **교훈: "오늘 확인했더니 공지가 없다"는 사실은 하루짜리다.** 추정 수치를 제목·description처럼
    되돌리기 비싼 자리에 넣지 않고, 재확인 날짜를 캘린더에 박는다.
- 다음 날짜 작업: **8/24 쇼츠 판정 + Studio 트래픽 소스에서 epickor.com 유입 확인**,
  **9/6~9/8 DOSSIER 완주율**, **9/23 GSC 재추출**. 추석 관련으로는 **9월 초 궁궐 무료개방 발표**가
  아직 미확정이라 `200`이 "미발표"로 열어두고 있다 — 그때 재확인한다.

## Active Work

- **D안 / DOSSIER 3편 완성 (2026-08-18, 전부 미예약).** 키트 `remotion/DossierKit.tsx`.
  **COUNTER·RECEIPT가 못 하는 "날짜 있는 단일 서사"** 를 담고, 연도가 항목 사이 여백에서
  카운트되므로 47년과 1년의 간격이 실제로 체감된다.

  | 릴스 | 출처 | 길이 | LUFS / TP | 폰 대역 첫 3초 |
  |---|---|---|---|---|
  | `2026-08-18_uji-dossier` 우지 파동 | `219` | 29.1s | -14.0 / -2.4 | -1.7 dB |
  | `2026-08-18_banana-kick-dossier` 바나나킥 | `367` | 26.1s | -13.7 / -1.9 | **-0.4 dB** |
  | `2026-08-18_yakult-dossier` 야쿠르트·코코 | `362` | 26.6s | -14.5 / -1.8 | **-0.4 dB** |

  **3편으로 만든 이유는 측정이다.** 구 포맷 완주율이 12~29%(중앙값 16%)로 17포인트 흩어져 있어
  1편으로는 포맷 효과와 소재 효과를 분리할 수 없다. 아웃트로 훅은 E/B/C로 서로 다르다.
  각 폴더에 `upload-package.md`(측정·QA·잘라낸 것과 이유), `contact-sheet.jpg`(10카드),
  `verify-sync.py`, `prep-exhibits.mjs`. **대표님 폰 리뷰(소리 on/off) 대기.**

  - **주제 후보 `364` 맛동산은 이미지 게이트에서 탈락**했다. 해태 `ht.co.kr`이 **HTTP 200에
    3.4KB 오류 페이지**를 주는 SPA라 팩샷 경로가 없고, 실물 사진은 Commons 512px 한 장뿐이라
    5카드 중 4카드가 사진 없이 남는다 — 우지 v001이 반려된 바로 그 결함이다. `281` 도시락은
    1970년대 도시락 검사 사진을 못 구해(e영상역사관 500, Commons 무) **보류**, 사진이 잡히면 1순위.
  - **DossierKit에는 넘침 보호가 없다.** 1차 렌더에서 7카드가 전시판(y920)·고스트 연도(y1160)
    밑으로 깔렸다. 안전 예산은 FACTS.md 2026-08-18 항목에 수치로 있다.

> **주의: 아래 오래된 항목들의 `output/reels/*/final/...` 경로는 더 이상 존재하지 않는다.**
> 2026-08-18에 `final/` 하위폴더를 폐지하고 납품본을 날짜 폴더 바로 아래로 올렸다.
> 파일을 찾을 때는 `final/`을 빼고 보면 된다.

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

1. **레인 상태 — 뷰티(2차)는 2026-08-15 대표님 결정으로 개방됨**(CTR 게이트가 수익 축을 재지 않았다는 판단 — FACTS 참조). 현재 뷰티 3편(`388`·`395`·`396`). 1차 레인 CTR 재판정은 다음 GSC 추출에서: 직전 측정 신규 코호트 1.11%. **뷰티 6편+가 1차 레인보다 CTR 낮으면 재검토**가 기록된 반전 조건이다.
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

- 2026-08-19 (저녁): **키워드 사이클 3회차 5편 발행 (`412`~`416`) + 발행글 정정 1건.**
  찰떡파이 · 빠다코코낫 · 자갈치 · 구운감자 · 참붕어빵. 88개 씨앗을 3배치로 돌려 고른 후보들.
  - **대표님 사진이 오류를 잡았다.** `412`의 "땅콩 크림"은 2017년 위키 미러발 오정보였고 라벨에
    땅콩이 없다. 정정 완료. **성분이 글의 축이면 미러 대신 라벨 전사본을 잡는다** (FACTS).
  - **라벨의 `제조원` 필드가 OEM 관계의 1차 증거였다** — 롯데 박스에 삼진식품이 찍혀 있다.
  - **0차 규칙 축소**: 농심USA만 팩샷을 내준다. 롯데·해태·오리온은 SPA라 바로 도표로 간다.
  - 채팅 붙여넣기 이미지는 디스크에 안 남으므로 `public/assets/images/_inbox/` 신설.

- 2026-08-19: **주간 키워드 사이클 2회차 5편 전량 발행 (`407`~`411`).**
  누네띠네 · 붕어싸만코 · 델라페 · 회오리감자 · 카스타드. 리뷰어 5편 100/100, 라이브 200 검증.
  각 글의 축은 여전히 **영어권에 존재하지 않는 한국어 출처 사실 하나**다.
  - **사진이 0장이었다 — 도표 10장을 직접 만들었다.** 다섯 주제 전부에서 워터폴 전 단계가 실패했다.
    가장 값싼 교훈: **Commons의 `Samanco`는 페루 행정구역이다.** 이제 명명된 포장 제품은
    처음부터 도표를 전제하고 시작한다 (FACTS `## images`).
  - **중복 감사를 씨앗이 아니라 메커니즘으로 해야 한다.** `409` 델라페가 `402` 얼음컵과 겹칠 뻔했다 —
    이름은 달랐지만 "파우치를 별도 얼음컵에 붓는다"는 메커니즘이 같았다. 소유권 분할 + 교차링크로 해결.
  - **`410`은 레시피 위험이 있었는데 기계를 쓰는 것으로 피했다.** 발명은 양념이 아니라 절단기다 —
    레시피를 피하는 프레임이 동시에 더 정확한 프레임이었다.
  - `332`의 중복 이미지 참조 제거로 `audit:image-context`가 전 등급 0건.

- 2026-08-18: **주간 키워드 사이클 5편 전량 발행 (`402`~`406`) + 자체 재점검.**
  얼음컵 · 쿨피스 · 김밥천국 · 오징어땅콩 · 자유시간. 전부 1차 레인(음식-구체), 전부 두 게이트
  (네이버 수요 ↔ 영어 공급) 통과분. 리뷰어 5편 모두 100/100, 서로 교차링크된 클러스터.
  - **각 글의 축은 영어권에 없는 한국어 출처 사실 하나다.** 얼음컵=CU 판매 1위·식약처 409건 중
    부적합 4건이 전부 카페 제빙기 / 쿨피스=캡사이신은 지용성이라 쿨피스는 덮을 뿐이고 우유가 잡는데
    유당불내증 때문에 못 놓음 / 김밥천국=상표권이 식별성 없음으로 거절돼 주인이 없음 /
    오징어땅콩=코팅 평균 28회, 큰 땅콩 27·작은 것 29 / 자유시간=1990년 설계의도를 지금 원조가 못 지킴.
  - **재점검이 실제 결함 2건을 잡았다: `403`·`405`에 가격이 사실상 없었다.** 리뷰어는 100/100을 줬다 —
    스펙 v1은 리뷰어의 검사 항목이 아니다. 상세는 FACTS 2026-08-18.
  - **이미지 8장을 직접 만들었다.** 4개 주제 모두 자유 이용 사진이 0장이었고 제조사 사이트 4곳이
    JS 껍데기였다. 결과적으로 도표가 팩샷보다 나았다 — 28회 코팅 단면은 사진으로 못 찍는다.

- 2026-08-18: **8/31~9/16 예약 완료 — 릴스 7 + 카드뉴스 10, 매일 05:00 KST, Facebook·Instagram 각 1건.**
  DOSSIER 3편은 9/6·9/7·9/8 연속으로 붙여 구 포맷 6편(8/25~8/30) 바로 뒤에 놓았다 — 같은 주에
  구 6 대 신 3이 되어 완주율 비교가 깨끗하다. 릴스 썸네일은 자동 추천 대신 **0번 프레임(설계된
  타이틀 카드)을 직접 업로드**했다.
  - **18건 전부 예약됨.** 무신사는 Meta 예약 상한(약 30일)에 걸려 9/17이 거부되므로 **9/3 오후 8시**에
    두 번째 게시물로 넣었다 — 그날은 하루 2건이다. 릴스가 있는 날은 코호트 측정 때문에 피했다.
  - **캡션 `**` 5편 전부 수정 완료** (라면·우지·바나나킥·야쿠르트·영수증). 예약 시각은 그대로.
  - 재사용 규칙 둘:
    - **캡션은 쓰는 즉시 검사한다** — `len(text) <= 2200`, `'**' not in text`. 인스타는 마크다운을
      렌더하지 않고, 2,200자를 넘으면 컴포저가 게시를 막는다.
    - **예약글 수정은 목록의 `ID 또는 캡션으로 검색`으로 대상을 좁힌 뒤에 한다.** 목록이 가상 스크롤이라
      인덱스·좌표·스크롤로는 뒤쪽 날짜에 닿을 수 없다. 상세는 FACTS 2026-08-18.

- 2026-08-18: **DOSSIER를 코호트로 만들었다 — 바나나킥(`367`)·야쿠르트(`362`) 2편 추가.** 상세는
  Active Work. 재사용 규칙 셋만 남긴다.
  - **사운드 스크립트를 다른 릴스에서 통째로 물려받지 말 것.** 우지의 고정 오프셋 표를 그대로
    쓰니 **5카드 중 3카드가 어긋났다** — 없는 헤드 줄에 틱, 있는 둘째 문단에 침묵. 단독으로는
    안 들려서 귀로 못 잡는다. 오프셋은 **엔트리 형태**에서 유도하고, `verify-sync.py`가 `.tsx`를
    재파싱해 대조하게 했다. 카피를 줄이자 즉시 3건을 더 잡았다.
  - **`volumedetect`·`silencedetect`는 `-v error`를 붙이면 조용히 빈 결과를 준다** (info 레벨 출력).
    2026-08-05의 "stderr로 나온다"와 **다른 함정**이고 둘 다 밟게 된다.
  - **이미지 게이트는 주제 선정 뒤가 아니라 주제 확정 *전에* 통과시킨다.** 후보 2개(`364`·`281`)를
    이 단계에서 걸러 기획 폐기를 막았다 — Reel 311(소재 0건으로 전량 폐기)의 반복을 피한 것.

- 2026-08-18: **D안 DOSSIER 키트 신설 — 날짜 있는 이야기에 릴스 형식이 생겼다.** 상세는 Active Work.
  재사용 규칙 넷만 남긴다.
  - **`remotion/`은 `tsconfig.json`의 `exclude`에 있다.** `tsc -p tsconfig.json`이 릴스 코드를 한 줄도
    안 본다 — 실제 타입 오류 4건 위에서 "깨끗함"을 반환했다. 릴스 파일은 **이름을 대서** 검사한다.
  - **AAC 인터샘플 오버슈트는 콘텐츠가 정한다. 1.8 dB는 상수가 아니다.** 어택 0의 노이즈 버스트는
    **5 dB**를 만들었다(WAV -5.0 → 디코드 -0.0). 리미터로 되사면 프로그램 레벨을 그만큼 버린다.
    **소스의 클릭 모양**(어택 0.8 ms + 8 kHz 롤오프)을 고치는 게 옳고, 비용이 없다.
  - **희소한 베드에서 라우드니스는 이벤트 수로 얻는다. 바닥(험·히스)을 올리면 1 dB당 액센트 분리가
    1 dB씩 죽는다.** LUFS의 K-weighting이 150 Hz 아래를 깎아서 저역만 있는 베드는 피크 대비 19 dB
    낮게 측정된다.
  - **첫 렌더는 정상 종료·정상 재생이면서 결함 4개를 실었다** — 레일이 글자 위에 찍힘, 9개 컷 전부
    하단 55%가 검정, 엔트리의 마지막 이벤트가 84프레임 중 16에서 끝나 2.3초 정지(376의 결함),
    "8 YEARS LATER"가 1995 위에 뜸. **전부 컨택트시트와 실측으로만 잡혔다.**
  - 커밋 `66210cad`.

- 2026-08-15: **수익 배관의 구멍 + 신규 2편 + 배포 정체 복구.** 상세는 위 Current Snapshot. 재사용 규칙 다섯만 남긴다.
  - **커밋과 배포는 다른 사건이다.** `git push` 성공은 배포 성공이 아니다. 어제 세션이 "푸시 완료"로 닫히는 동안 **사이트는 21시간 동안 옛 빌드**였다. `vercel ls` 최상단이 `● Ready`인지, 그리고 **바뀐 내용이 공개 URL에 실제로 보이는지**까지 봐야 완료다.
  - **이 저장소는 pnpm으로 설치한다.** `npm i`를 쓰면 락파일이 어긋나 모든 배포가 죽는다. 폰트처럼 파일만 얻으려는 일회성 설치는 **파일을 넣은 뒤 `package.json`에서 도로 뺀다.**
  - **단가만 보고 제휴 상품을 고르면 틀린다.** 수수료는 `단가 × 카테고리 요율`이고 요율이 10배 차이 난다(Beauty 10% / Kitchen 4.5% / **Health·Grocery 1%**). $150 홍삼이 $280 밥솥보다 못 번다.
  - **링크가 부실해 보이면 먼저 "팔 물건이 존재하는가"를 확인한다.** `153`은 링크를 갈 문제가 아니라 **아마존 US에 그 상품이 아예 없어서** 글이 독자 질문에 답하지 못하던 것이었다. 상품부터 확인했기에 콘텐츠 문제로 방향을 틀 수 있었다.
  - **글을 고칠 때 본문과 링크·이미지가 서로 반박하지 않는지 본다.** `287`은 표가 "약한 선택"이라 한 물건을 최상단에서 팔고 있었고, `385`는 이미지가 자기 섹션을 반박했으며, `153`·`386`은 내가 수정하다 모순을 만들 뻔했다. **고친 뒤 반드시 다시 읽는다.**
  - 커밋 `c2e4dbcf` `10990d11` 외.
