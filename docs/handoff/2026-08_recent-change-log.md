# Recent Change 아카이브 — 2026-08

- 2026-08-25 (오후): **챕터 2 중간점검 + 순위 레인 착수.** 재사용 규칙 셋.
  - **집계 지표는 세 번째로 거짓말을 했다.** "옛 글 −16%"가 하락 3편(끝난 축제)을 빼자 +29.8%가 됐다.
    **집계 차이를 보면 중앙값과 상위 제거 검정을 반드시 같이 돌린다**는 규칙이 또 값을 했다.
  - **"노출의 87%가 5위 밖"을 기회로 읽지 말 것.** 실제 공략 가능분은 **15.5%**다 — 나머지는
    dead-end 4편·내비게이셔널·비영어·정의형. 큰 숫자를 기회로 보고하기 전에 빼야 할 것을 먼저 뺀다.
  - **순위 기회는 "형태"만으로 못 고른다. 시장도 봐야 한다.** CTR 1.42%로 사이트 평균 3배인 페이지가
    노출의 65%가 아랍어·러시아어였다. **아마존에 닿을 수 없는 클릭은 순위를 올릴 이유가 안 된다.**

- 2026-08-26: **발행 2 + 푸시 4 + 아마존 역방향 1회차.** 재사용 규칙 넷.
  - **손대면 안 되는 목록은 산문이 아니라 데이터에서 읽는다.** 다음 타깃으로 추천한 `140`·`274`가
    9/23 실험군이었다. 이어받은 금지목록 `043·256·071`은 **`071`이 실험군도 아니면서** 둘이 빠져 있었다.
    8/25에 `153`으로 같은 사고를 내고 기록만 했더니 하루 만에 재발할 뻔했다. **큐가 이제 자동 표시한다.**
  - **실험군 슬러그는 여섯 군데를 합쳐야 나온다** — `treatment`/`control`/`queueArm`의 `.slugs`,
    `tightSubset`의 두 배열, `pairs[]`의 양쪽. **한 군데만 보면 놓친다** (합계 91개).
  - **"잘 팔린다"와 "영어 글이 없다"는 독립이 아니다.** 아마존에 상품을 올리는 동기와 그 상품
    영어 블로그를 쓰는 동기가 같은 돈에서 나온다. 역방향 7건이 전부 커버리지에서 죽은 구조적 이유다.
  - **바꾼 것이 계측을 깨뜨릴 수 있다.** 인스타 바이오를 벌거벗은 도메인으로 바꾸면 인앱 브라우저가
    referrer를 지워 `direct`에 묻힌다 — **개선이 관측 불가를 만든 사례.** `/ig`로 막았다.

- 2026-08-25: **씨앗 라운드 2회 — `425` 수건, `426` 치약.** 재사용 규칙 셋.
  - **자체 제목 0칸 스캔이 세 번 연속 통했다** (`423`·`425`·`426`). 반면 **영어 자동완성에서 출발하는
    방식은 200회 가까이 연속 실패**다. 씨앗은 우리 커버리지의 구멍에서 뽑고, 영어는 검증에만 쓴다.
  - **뉴스가 사건을 점유했다고 주제가 죽은 게 아니다.** 치약 리콜은 Korea Times·JoongAng이 이미 썼지만
    `does korean toothpaste have fluoride`는 소비자용 답이 0건이었다. **사건이 아니라 그 사건을 낳은
    구조를 쓰면 자리가 남는다.** 반대로 **공식 기관이 영어로 직접 쓰는 주제**(보조배터리 규제 —
    Korea.net·VisitKorea)는 들어갈 자리가 없다.
  - **이미지를 집필 전에 본 것이 처음으로 값을 했다.** 회수된 제품은 사진이 존재할 수 없다는 걸 먼저
    알았기에 그 섹션을 팩샷이 아니라 **라벨 도해**로 설계했다. `2080.com`이 브랜드가 아니라 중국
    도메인 판매 사이트인 것도 그때 걸렀다.

- 2026-08-24: **쇼츠 1차 배치 판정 + 오로라월드 발행 + `/business/` 스키마 복구.** 상세는 Current Snapshot.
  재사용 규칙 넷만 남긴다.
  - **쇼츠는 8일이면 끝난다 (+0.7~1.3%/이후 10일).** 8일 이상끼리는 나이를 무시하고 비교해도 되고 7일 미만은 안 된다.
  - **조회수보다 Shorts 피드 비중을 먼저 본다** — 아줌마 편은 20%(나머지 84~98%). **배포 사고를 콘텐츠 실패로 잘못 배우지 않으려면 이 순서여야 한다.**
  - **유튜브는 사이트로 안 보낸다** — 28일 6세션·조회의 0.025%. 쇼츠는 계속 올리되 **퍼널 작업으로 세지 않는다.**
  - **컴포넌트가 경로를 하드코딩하면 그 라우트는 조용히 아무것도 안 낸다.** `ArticleLd`의 `/blog/` 하드코딩으로
    비즈니스 27편이 JSON-LD를 하나도 안 내고 있었다. **없는 건 에러를 내지 않으므로 라이브 HTML을 grep해야 발견된다.** `01b6cf3b`.

- 2026-08-21: **씨앗 판정 게이트 신설·보정 + 리프레시 2편.** `npm run seeds:check`로 발행 4~8주 글의
  생사를 판정하고 주간 3편을 지목한다. 발행 전 예측은 불가능하다는 실측이 근거
  (`output/strategy/breakout-prediction_2026-08-21.md`). 게이트가 고른 `218`·`194`·`268` 리프레시 3편.
  **2회차가 이미 작업한 글을 다시 지목해 세 군데를 고쳤다** — `updatedAt`을 암묵적 `worked`로 읽기,
  이벤트 글의 제목 연도는 결손 아님, 결손 있는 글 우선. 커밋 `17a68488`·`ded0b957`·`097ffea9`·`e96eaa7a`.

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

> 루트 `HANDOFF.md`의 Recent Change는 최근 10건만 유지한다. 밀려난 항목이 여기로 온다 (최신이 위).

- 2026-08-07: 오전 — 비즈니스 딥다이브 2편(오뚜기=수출 안 한 회사 / 풀무원=미국 브랜드를 산 회사) + 리프레시 4편(`259` 빙수 ₩9,900~149,000 / `128` 약과 두 번 금지 / `219` 라면 프리미엄 원년 / `281` 도시락 검사·혜자와 창렬) + 릴스 3편 예약(8/13~15, 05:00 KST, 목록 6줄 실측). 오후 — 리프레시 `278` 커피믹스(1976년 세계 최초 발명, 조필제 101세 별세, 스틱 절반이 설탕) + **GSC 8/7 추출 전량 점검**: 분기 클릭 기준선 348→**1,576** 정정(쿼리 CSV는 클릭의 25%만 표시), 주간 클릭 기저 ~2배, 리프레시 코호트 372→513, 신규 코호트 CTR 1.11%(판정 이름). **대표님 지시로 재검토를 돌려 내 오류 2건 적발** — `167` 재추천(8/3 기리프레시, git log 미확인)과 무측정 추정 1건. `043` 장원영은 정의형 dead-end로 차단 등재. **큐 사각지대 수리**: 음식 필터가 가리던 행동형 6편(`074` 지하상가 9,613노출 등)을 TIER2 추가, 53편 대기. 카드뉴스 3종(용산·롤파크·약과, `approved-dark-black-bar` 스타일) 제안 — 승인 대기. 상세: `docs/handoff/2026-08-07_snapshot-log-gsc-review-and-am-session.md`.

- 2026-08-06: W33 사이클(씨앗 31 → 5)을 돌리고 **신규 5편 + 리프레시 2편**을 발행했다. 신규 `367` 바나나킥 · `368` 썬 · `369` 고래밥 · `370` 뿌셔뿌셔 · `371` 칸초, 리프레시 `275` 용산 테크쇼핑 · `274` 롤파크. 전부 100/100·라이브 200. **다섯 편의 공통점은 영어권이 틀리게 적어놓은 것을 교정한다는 것이고, 그 교정은 전부 제조사 카탈로그와 한국어 출처를 직접 읽어서 나왔다** — 고래밥은 영어권 전부가 "9종"이라 쓰는데 오리온 공식 도표는 **16종**(캐릭터 이름까지 말장난: 돌고래=엔돌핀, 흰동가리=아네모네), 썬은 해외에서 "Orion Sun Chips"로 팔리는데 **오리온이 그 이름을 쓰지 않는다**(펩시코 라이선스 만료로 개명 → 2016-01 화재로 단종 → 2018-04 밀양 새 라인에서 '돌아온 썬', 3년 만에 1억 개). **기각 11건이 규칙 두 개를 남겼다**: 로마자를 네이버보다 먼저 재라(6건이 `mychew`→chewy.com 류로 죽었다), 그리고 **레시피 블로그가 이 레인 최대의 커버리지 킬러다**(3건) — 집에서 만들 수 있는 것은 이미 누가 썼고 못 만드는 공산품은 안 썼다. **칸초는 자동 조달 0차·1차가 다 막혔는데(롯데웰푸드 클라이언트 렌더 + `/brand/hero/*` 500, Commons 0건) 대표님이 사진 4장을 주셔서 살았고, 결과적으로 증거가 가장 단단한 글이 됐다.** 리프레시 둘은 **4회 연속 같은 패턴** — 얼버무린 문장이 곧 리프레시 지점이다. `275`는 "public background sources describe it as"로 현재 상태를 피하며 독자를 **철거가 진행 중인 나진상가**로 보내고 있었고(대표님 정정: "철거 부지"는 과장, 정확히는 **존재하되 B2C가 아님**, 그리고 지금 용산에 가는 이유는 **용리단길**), `274`는 **450석·₩10,000·1분 매진**과 **T1 홈그라운드가 인천**이라는 사실을 하나도 안 적고 "공식 발표를 확인하세요"로 끝내고 있었다. `next_slug`는 **`372`**.

- 2026-08-05: 어제 납품한 허브 릴스 3편이 **대표님 평가 3/100으로 반려**됐고, 원인은 렌더가 아니라 **파이프라인을 잘못 탄 것**이었다 — ffmpeg로 직접 조립하느라 `remotion/Batch0726Kit.tsx`를 통째로 건너뛰었는데, 그 키트가 ONS·키커칩·아웃트로 빨간 칩·워터마크·고정위치 자막을 **전부** 공급하고 다른 어떤 경로도 공급하지 않는다. 3라운드에 걸쳐 재제작해 v016으로 완성(예약은 "일단 킵" 지시로 보류). **실측으로 특정한 결함들**: 나레이션 구멍(drinks 16.0~26.3초 **-91.0 dB**), 자막 튐(ASS 33줄 중 **29줄이 4프레임씩 겹침** — libass가 동시 자막을 위로 쌓는다), ONS 전무, **첫 컷이 f10~f11에서 시작해 프레임 0~10이 빈 배경**(휘도 37), 그리고 라면편의 **옥수수 고명**(대표님 지적 — 한국 라면 조리법이 아니다, Pexels 9508xxx 캠핑 시리즈 전체의 특징). **영구 산출물은 게이트 2종** — `reels:qa-audio`(나레이션 구간 0.6초+ 무음이면 차단), `reels:qa-cuts`(컷마다 프레임 + 그 위에 흐르는 문장). 후자가 화면-말 불일치 6건을 잡았다. 게이트 작성 중 함정: `silencedetect`는 **stderr**로 쓰는데 `execFileSync`는 stdout만 반환해 1차 버전이 **10.3초 구멍 있는 파일을 PASS 시켰다**. 상세: `docs/handoff/2026-08-05_snapshot-log-hub-reels-rebuild.md`.

- 2026-08-04 (2nd session): Ran the W32c cycle on the new method and published both approvals — `365` Chilsung Cider and `366` Pocachip — plus refreshed `200` (Chuseok). Day total: 5 new posts, 2 refreshes, all 100/100 and live-verified. **The method change worked and its first finding was uncomfortable: sales rank is inversely correlated with opportunity.** The Korean feed scan surfaced the actual top sellers, and the coverage gate killed them — Choco Pie to Korea Herald/Korea Times/ZenKimchi, and 새우깡, Korea's No.1 snack two years running, to **our own 029**, which already carries the 1971 origin, the 아리랑→아리깡 naming and August pricing. W31b learned this law about viral products; it holds for the biggest steady sellers too. The exploitable band is a product that is ordinary in Korea and a line item in an English listicle. `365` survived on a **correction rather than a gap** — every English page calls Chilsung "Korea's answer to Sprite" and it launched 1950 against Sprite's 1961, while the real demand sits in `is korean cider alcoholic / halal / caffeinated`, a cluster those pages skip and which exists only because "cider" means fermented apple in English. `366` survived on a clean gap: No.2 by revenue, fastest grower, no English explainer, and the hook is that **Onion (1988) predates Original (1992)** so the default blue bag is the later one. Also established manufacturer-site behaviour for three companies — Orion is server-rendered with **real 404s**, CJ serves 200×128 thumbnails, and Haitai returns **HTTP 200 with a 3.4 KB error page for every guessed path**, detectable only by checking the file type. `200` repeated `198`'s failure exactly: it told readers to book "as soon as tickets open" and never said when, because it was written before Korail published. Now: KTX 20 August, SRT 25 August, Chuseok 25 September, no substitute holiday — plus the Korail–SR merger cutting KTX fares ~10% from September. Unannounced items (palace free days, toll waivers) were left unstated with a warning that searching returns 2024 dates as current. `next_slug` is now `367`.

- 2026-08-04 (execution session): Published `362` (Korean Yakult and the COCO cart) and `363` (Dashida vs Dashi), and refreshed `198` (Waterbomb) — all three reviewer 100/100, live-verified, image audit clean. **The Yakult angle came from the representative and beat mine**: I proposed a product comparison, they directed a culture piece on the Fresh Manager's rolling refrigerator. Validated after the fact — Google carries `yakult cart korea` and `yakult vs yogurt`, and Naver carries an entire cart cluster (면허·속도·신고·렌탈) that English has no answer for. The load-bearing fact is legal: COCO is a 원동기장치자전거 under the Road Traffic Act, so a 4 km/h fridge is legally required to ride in traffic and banned from the pavement, which is exactly the thing visitors are confused by. `363` confirmed its own approval rationale — the top English page answering `dashida vs dashi` contradicts itself inside one paragraph ("both beef stock", then anchovy vs bonito), and the real correction is that they are not the same category at all: dashida's counterpart is Hondashi, which is not a coincidence because 이병철 commissioned dashida in 1975 as a Korean answer to 미원 modelled on it. **`198` turned out to be a factual repair, not a spec pass** — it was written as a forward-looking preview of an event that ended 26 July, and its weakest passages were the ones hedging on an unconfirmed venue; meanwhile Waterbomb had moved from 잠실 to KINTEX in **Goyang** in 2024 for a redevelopment running to 2033, so the word "Seoul" in the title was sending readers to the wrong city. New standing rule in CLAUDE.md: check whether a refresh target is still *true* before applying spec v1, and treat hedged sentences as the highest-value target. Also established with two products that **no free-licensed pack shot exists for specific commercial goods** — Commons has Korean Yakult from six countries but not Korea, and Dasida returns zero across Commons, both Wikipedias, and Openverse — so the 0차 manufacturer rule is the only path, not a preference; concrete working and non-working manufacturer image routes are now in FACTS. The uniqueness audit again caught a hero candidate already owned by `186` at selection time. `next_slug` is now `364`.

- 2026-08-03: 발행 4편(신규 `358` 뽀로로 음료 / `359` 너구리, 리프레시 `167` K-드라마, 비즈니스 ICONIX). W32 키워드 사이클 씨앗 21 → 통과 3. **가장 값진 결과는 지난 회차 재검사다** — W31c가 커버리지 게이트를 돌리지 않은 채 9건을 "집필" 판정해 큐에 넣었는데, 돌려보니 6건 중 5건이 죽었다(계란빵은 Maangchi·Judy Joo 등이 전용 글 보유, 냉동김밥은 영어권에서 100% Trader Joe's 프레임). **대표님 지시로 릴스 소재 전제를 뒤집었다** — 가로 16:9를 9:16으로 크롭해 쓴다. Reel 311은 소재가 없어서가 아니라 세로만 봐서 죽었고, 같은 주제를 가로까지 열자 한국 명시 50건·업스케일 불필요 333건이 나왔다. `npm run footage:gate` 신설(9:16 크롭 가이드 + 슬러그 국가 필터, 해상도보다 국가 정합 우선 — 해상도순으로 정렬했더니 8K 마닐라 게시장이 1위였다). **대표님 판정으로 KTO 이미지 사용을 승인**하고 내 라이선스 우려를 철회했다. 비즈니스 글 미리보기 경로 신설(승인 버튼은 의도적 제외 — 두 API가 `content/blog/`로 하드코딩돼 있어 누르면 유령 파일이 생긴다). **PC 메모리 부족의 절반이 내 누수였다** — `TaskStop`이 dev 서버 손자 프로세스를 남겨 978MB 고아가 떠 있었고, 정리하니 여유가 1.09→2.09GB가 됐다. 로컬 `next build`는 메모리로 실패하며 `NODE_OPTIONS`로 안 풀리므로 배포 게이트로 쓰지 않는다.

- 2026-08-01~02: 아마존 CTA 노출 실측 후 얇은 한 줄 링크를 273편에 롤아웃(첫 링크 중앙값 38% → 14%). 조용히 손실을 내던 결함 3건 수정 — 제휴 태그 없는 아마존 링크 12개(글 5편), CRLF 파일 프론트매터를 못 읽던 리뷰어, 3중 중첩 이미지 그리드. 레거시 3편(136·155·156) 전면 재작성 — **길이가 아니라 이미지가 문제였다**: 세 편 모두 텍스트가 구워진 세로 소셜 그래픽을 본문·ogImage로 썼고, 두 편은 alt가 실제 이미지와 달랐으며, 156은 실존 인물 얼굴이 변형돼 있었다. 신규 2편(354 망원동 / 355 익선동) 발행, 사진 적은 6편에 가로 사진 11장 보강. 대표님 폰 제보로 모바일 이미지 레이아웃 3건 수정. **배포가 한 번 실패했고 그게 가장 값진 기록이다** — 이미지 방향 판별을 위해 `public/`(1.7GB)을 런타임에 읽었더니 Next가 함수 번들에 끌어넣어 418MB(한도 250MB)로 거부됐는데, **`next build`는 로컬·Vercel 양쪽에서 성공했다.** 빌드 초록불은 배포 안전의 증거가 아니다. 빌드 시점 매니페스트(42KB)로 전환해 해결.

- 2026-07-31 (execution session): Ran a second keyword cycle (9 evaluated, 2 approved; ISO week 31, filed as `keywords_2026-W31b.md` after an initial mislabel as W32) and published both — `344` Bacchus D vs F and `345` Yonsei Cream Bread — plus `161`, a finished K-beauty post stranded as a private draft since February. Cleared the entire food-specific refresh backlog — 14 posts brought to 제품 글 스펙 v1, all live-verified. The cycle's most useful output was a rejection: the two highest-demand candidates (Culinary Class Wars chestnut tiramisu, 두쫀쿠) both failed the coverage gate because Korea Times, Stripes Korea, VisitKorea English and Seoul Economic Daily English had already covered them — **viral in Korea means published in English within days by higher-authority outlets, so select on coverage gap rather than novelty.** Two defects found and fixed: `run-pipeline.mjs --step review` run on a published post pushed `visibility: private` (404-ing the site's highest-CTR food page) and overwrote the body from a stale draft, deleting 5 internal links and both Amazon CTAs — recovered, and now barred in CLAUDE.md and FACTS; and the reviewer's image check was failing real files whose names contain literal percent-sequences. Also established that Wikimedia Commons carries direct photos of Korean commercial products when searched by Korean product name — including labels printing the exact volumes 344 argues about.

- 2026-07-30 (metrics pass): Captured real Meta Business Suite performance data for Reels 220 (1 day old) and 175 (published same day), and in the process discovered Reels 311/312/313 (scheduled 07-26/27/28) had been sitting in `scheduled_pending_measurement` unread for 4 days despite actually having published — all three are now fully captured on both platforms. Key findings in `output/reels/metrics.json`: Facebook is dead weight for this account (5 of 7 FB Reel posts got ~0 views; only 2 got real numbers, no clear pattern why); Reel-vs-carousel on the same topic is mixed, not a clean win for either format (311's Reel beat its carousel 2,000 vs 972 views, but 312 and 313's carousels each beat their own Reel); completion rate ranged 12-29% with today's 175 the best result so far (29%, also best-ever saves at 5). Reel 174 and the 326/321/320 batch haven't published yet (land 7/31 through 8/3).

- 2026-07-30: Published the 3 topics deferred from 2026-07-29's approved list — Blogs `337` (Korean reality dating shows compared), `338` (virtual K-pop idols: real performer vs. AI-generated), `339` (Squid Game filming locations). Representative declined topic 8 (Sleep Cafes) this session. 338/339 both needed copyright-safe image sourcing (virtual idol character designs and TV-show sets are agency/studio IP, not free-use even under a CC-tagged Commons upload) — solved with real photography of genuinely connected context (Gocheok Sky Dome, Daejeon Expo Science Park exterior, confirmed real Seoul filming locations) instead. Caught and fixed a real duplicate-H2-heading bug in 338 (introduced by a multi-edit sequence, missed by the automated reviewer, caught by a full-page screenshot) before publishing. A `git stash push`/`pop` meant to protect a data-file edit accidentally popped an unrelated pre-existing stash from other work, causing a merge conflict; recovered cleanly via `git restore --staged --worktree` without touching or losing the other stash. All 3 published, image-verified, and live-checked. `next_slug` is now `340`.

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
