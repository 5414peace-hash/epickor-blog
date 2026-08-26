# HANDOFF - EpicKor Current Operations

> Fast-start dashboard only. Historical detail through 2026-07-11 is in `docs/handoff/HANDOFF_ARCHIVE_THROUGH_2026-07-11.md`.

## Start Here

1. Read this file.
2. Run `git status --short` and `git log -8 --oneline`.
3. Preserve unrelated dirty files.
4. Read only files named under Active Work or the user request.
5. Search the archive narrowly with `rg` only for a specific slug, decision, or incident.

## Current Snapshot - 2026-08-25 (챕터 2 중간점검 · 발행 8편 · 순위 레인 착수)

> 8/21~22 이틀치 상세는 `docs/handoff/2026-08-22_snapshot-log-seeds-gate-and-link-repair.md`.
> 수치·규칙은 `docs/handoff/FACTS.md`에 들어가 있으니 **먼저 `node scripts/handoff.mjs facts`**.

**8/26 — 재재점검: 측정의 한계선을 그었다.** *(쉬운 한 장: https://claude.ai/code/artifact/e6aba4db-14fa-4452-bd7c-6e59875cb531)*

- **"재점검마다 새 사실이 나온다"의 원인은 내 규율이 아니라 분포였다.** 클릭 지니계수 **0.768**,
  페이지 7%가 클릭의 50%. 이 위의 집계는 전부 소수 항목 진술이라 네 번의 반전이 같은 형태였다.
- **부트스트랩으로 내 숫자에 오차범위를 붙였다. "리프레시가 51% 높다"는 CI [−1.15, +3.79]로 0을 포함**한다.
  8월신규−대조군, 6월−8월도 전부 0을 포함. **그날 두 번 보고한 수치가 노이즈와 구별되지 않았다.**
- **9/23 리프레시 판정은 오염 이전에 검정력이 없었다** — d=0.306, 필요 **168편/군**, 보유 32편.
  짝지은 설계(164쌍)·순위 지표(501편) 둘 다 구제 실패. **판정은 돌리되 "판정 불가"로 결론낸다.**
- **살아남는 것: 3배 이상 효과.** 쿼리 형태 13배·순위대 6.7배는 CI가 안 겹치고 7/31부터 안 흔들렸다.
  **1.5~2배는 이 데이터량으로 영원히 판정 불가 — 재점검을 더 해도 안 된다.**
- **대안: 단일 페이지·지목 고노출 쿼리·순위 관찰.** `deli manjoo` 6.8→6.7→7.8로 월간 1위 안팎만 움직인다.
  **집단 비교는 168편, 단일 관찰은 1편.** `071` 설계가 이미 맞았다.
- **8/17주 329클릭 — 완결 주 최고치**(직전 267).

**8/25 오후 — 챕터 2 중간점검 (`docs/checkpoints/2026-08-25_중간점검-챕터2.md`). GSC를 API로 새로 뽑아 채웠다.**

- **게이트 5/7 달성.** 미달은 신규 코호트 CTR과 Trazy — 단 CTR 게이트는 8/20에 **지표 정의가 틀렸다**고 판정됐다.
- **성장의 출처: 새 글 +271클릭.** (같은 날 붙였던 "총 클릭 ≈ 편수 × 2.3"은 8/26에 **오도**로 판정 — 분포가 이야기다.)
- **"노출의 87%가 5위 밖"의 실제 공략 가능분은 15.5%**다 — 나머지는 dead-end 4편(162,396노출)·내비게이셔널·비영어·정의형.
- **푸시 레인 스코어러의 구멍 둘을 고쳤다** (커밋 `5d2d8fca`): ① `deadShare`가 쿼리 *형태*만 봐서
  **비영어 시장을 못 걸렀다** — `167`이 노출의 65%가 아랍어·러시아어·벵골어인데 2순위였다.
  `foreignShare` 신설로 `167`·`055`·`135`가 빠졌다. ② 소스 교차추출이 **25,000행 상한에 잘려**
  사이트 클릭 1,900 중 302만 담고 있었다. `gsc-fetch.mjs --page` 신설로 페이지 단위 정밀 추출 가능.
- **`153` 이삭토스트 갱신 — 푸시 레인 첫 작업분.** 클러스터 전체가 8.9~10.8위이고 `where to buy`는
  10.8위인데 **CTR 2.8%**로 이미 전환 중이다. 공백은 키워드가 아니라 **사실**이었다 —
  2026-04 해외 전용 수출 결정과 그 이유(가맹점 매출 보호), 그리고 **브랜드 과일잼 계획**이
  `isaac toast jam`(168노출·8.9위·클릭 0)의 답이다. 판정 9/23, **순위로**.

**8/25 오전 — 씨앗 라운드 2회, 발행 2편, 기각 2건, 보류 1건.**

- **`426` 치약 · `425` 수건 발행.** 치약의 축은 리콜이 아니라 **불소 규제**(허가 1,500ppm인데 표준제조기준 1,000ppm),
  수건의 축은 **단위 번역**(수·그램 ↔ GSM). 둘 다 1차 출처 직접 확인, 상세는 FACTS.
- **보조배터리 기각** — 규제 핸들로 나온 첫 사례라 각도는 진짜였는데 **Korea.net·VisitKorea 영문 공식 +
  HaniSeoul 전용 가이드**가 현행 2개 제한까지 반영했다. LCK와 같은 벽.
- **LCK 기각** — 커버리지가 두꺼웠다(homesinkor 2026 티켓 가이드 + VisitSeoul + **영문 위키 `LoL Park`**).
  **교훈: "빈 각도"와 "내 편집 구상"을 구별할 것.** 조사분(**장소가 `치지직 롤파크`로 개명**, 구매 채널 2개,
  1인 2매 합산 적용)은 기존 글 보강용으로 FACTS에 남겼다.
- **핫팩 보류 (큐 `207`, `blocked_seasonal`)** — 한국 각도는 실재(70℃·KC마크·다이소 실가격)하지만
  **겨울 상품이라 8월에 쓰면 "이번 달 가격"이 온라인 전용이 된다**(`163`과 같은 사유). **재개 11월.**
  이미지도 막혔다 — 커먼즈의 핫팩은 전부 일본 카이로다.

**8/24에 한 것** — 판정 1건 · 주제 스터디 290씨앗/축19 · 발행 6편(비즈니스 3 + `422`·`423`·`424`) · `/business/` 스키마 복구 · 보류 1건.
  상세는 `docs/handoff/2026-08-24_snapshot-log-topic-study.md`, 재사용 규칙은 FACTS 2026-08-24.

**8/21~22에 한 것** (상세: `docs/handoff/2026-08-22_snapshot-log-seeds-gate-and-link-repair.md`)

- **`npm run seeds:check` 신설** — 발행 4~8주 글의 생사를 GSC로 판정해 주간 3편을 지목한다.
  근거는 발행 전 예측 불가 실측(`output/strategy/breakout-prediction_2026-08-21.md`).
- **리프레시 5편**(`218`·`194`·`268`·`248`·`musinsa`) — **5편 모두 결함이 "빠진 항목"이 아니라
  "틀렸거나 없는 사실"이었다.** 체크리스트로는 안 잡히는 종류다.
- **신규 3편**: 위닉스 딥다이브 · `420` 항공사 · `421` 공항 (뒤 둘은 대표님 구술에서 나왔고 서로 물려 있다).
- **정비**: 내부링크 고아 80→36 · 리다이렉트 링크 18→0 · **FAQ 스키마 40편 복구** · 아마존 검색 링크 선별 교체 170개.

**다음에 손댈 것**

- **[날짜] 8/31 쇼츠 재판독.** 판정 기준은 판정 문서 §8에 적어뒀다. 브릿지 6편(8/24~8/29,
  `bridge-2026-08-24-manifest.json`)이 표본에 더해진다.
- **[대표님 5분 · 최우선] 아마존 대시보드.** 7/27 이후 **클릭 수와 주문 수**만 보면 된다.
  151일 남은 시한에 3건 중 1건이고 **8/21 링크 대수리의 효과를 모른다.** 1건이 29일 걸린 것은
  전환율 기준 클릭 ~9회인데 7월 측정은 월 35회였다 — 리태그 후 클릭이 떨어졌을 가능성을 확인해야 한다.
- **[대표님 결정] North Star 문장.** 검색만 작동하는데 문장에는 인스타→사이트→아마존만 있다.
  (A) 인스타 다리를 고친다(유튜브 커뮤니티는 눌린다는 실측 있음) 또는 (B) 검색을 문장에 명시한다.
  릴스·카드뉴스 리듬이 걸린 문제라 임의로 정하지 않는다.
- **[대표님 5분] 큐 `167` 해제** (블로그 `167`과 다른 것 — K-Culture Station).
  네이버예약에서 **빅뱅 코스모스 본전시**의 **관람료와 장소/출구 표기**를 확인해주시면 블로커 ①②가 풀린다.
- **순위 레인 다음 타깃.** 레인 재생성 결과 `153`은 작업 완료. 남은 것 중 **`043`·`256`은 리프레시 실험
  대조군이라 9/23까지 금지**, `071`은 실험 중. 착수 가능: `140`(공중화장실 — 단 `389`와 비데 자기잠식
  가능성, 9월 재측정) · `365` · `360` · `345` · `231` · `329`.
- **Tier 2 잔여 2건** (LCK는 8/25 커버리지 기각): 교복 대여 · 라이선스 패션 — **둘 다 이미지에서 막혀 있다.**
- **0칸 스캔 미착수분**: 텀블러·보온병 / 도마·칼 / 침구·베개. 방법은 스터디 문서 §16·§18.
- **씨앗 게이트 신규 지목 소진** — 다음은 쿨다운 중 결손 13편(`255`는 8/24 처리).
- **비즈니스 후보가 다시 비었다.** 2026-08-24 목록(`output/strategy/business-candidates_2026-08-24.md`)의
  승인 2편을 그날 다 썼다. 남은 것은 **네오플램**(비상장·공개자료 얇음)과 **바낙스**(커버리지 부분 실패,
  1973년 일본 합작 출발)뿐이고 **볼빅은 기각**(영문 기업사 기존). **다음 글은 새 후보 발굴부터이고
  집필 전 대표님 승인이 필요하다.**
- **후보 선정 규칙이 하나 바뀌었다**: 수요 측정은 제조업 후보를 못 가른다(2회 연속 전원 천장).
  **커버리지 게이트를 먼저 돌린다.** 그리고 상장 여부는 크기가 아니라 **"사실로 쓸 문서가 있는가"**의
  대리 지표로 읽는다 — 단, 글라스락에서 확인했듯 **지주 편입 비상장 자회사는 그 이점이 없다.**
- **아마존 검색 링크 699개는 의도적으로 남겼다** — 카테고리형 앵커에는 검색 페이지가 정직한 답이다. 되돌리지 말 것.

## Active Work

- **D안 / DOSSIER 3편 완성 (2026-08-18, 전부 미예약). 대표님 폰 리뷰(소리 on/off) 대기.**
  우지 파동(`219`) · 바나나킥(`367`) · 야쿠르트(`362`), 각 26~29초, 전부 -14 LUFS 부근.
  **3편인 이유는 측정이다** — 구 포맷 완주율이 12~29%로 흩어져 있어 1편으로는 포맷 효과와
  소재 효과를 분리할 수 없다. 수치·탈락 후보·키트 주의사항은
  `docs/handoff/2026-08-18_dossier-reels-detail.md`.

- **카드뉴스 `2026-07-15_musinsa`/`124`/`174` 최종본 확정** — 21장, 세 비주얼 시스템, Visual Fit 97.7/95.1/98.1, 구조검사 7/7 + 육안 검토 완료. **`174`는 2026-07-20 인스타·유튜브 커뮤니티 예약 완료. 무신사·`124`는 예약 대기.**

- **아고다 파일럿은 배포·QA 완료** (`188`·`257`, `affiliate_agoda_click` 발화, CID `1968802` 302 확인). 확대는 아래 Blockers 조건을 따른다.
- **2026-07 릴스 2.1 회복기와 블로그 `291`~`293` 기록은 `docs/handoff/2026-07_reels-2.1-and-blogs-291-293-active-work.md`로 내렸다** (대기 액션 없음). **`293` V04는 대표님 반려로 종결** — 발행·기준선 사용 금지.

## Blockers / Decisions Needed

- **대표님 판단 대기 (2026-08-14 기준 3건).**
  ① **비즈니스 다음 후보** — 오로라월드·위닉스·락앤락 중 방향. 락앤락은 소유구조(2017 홍콩계 PE 인수) 확인이 선행.
  ② **UI/UX 리디자인 5안** — `docs/design/uiux-2026-08/`. 대표님이 "나중에 할 것"이라 명시했으므로 먼저 꺼내지 말 것.
  ③ **`typescript.tsserver.maxTsServerMemory` 3072 → 2048** 하향 여부 — 대표님 자동완성 체감에 직접 영향이라 임의 변경하지 않았다.

- **URL 통합·삭제는 하지 않는다 (2026-08-14 대표님 지시).** 다이소 `218`/`148` 등 중복 통합을 제안했다가 **"url 수정할 생각을 왜 해? 하지마"**로 종결됐다. 재론 금지. 중복은 그대로 두고 9/23 판정 때 데이터로만 본다.

- **리프레시 트랙은 2026-09-23 판정까지 정지.** 일일 리듬이 "신규 2 + 리프레시 1"인데 **리프레시가 0**인 상태가 40일간 이어진다. 의도된 정지이지만 리듬의 3분의 1이 비는 것을 인지할 것. `074`·`206`·`223`이 측정군이라 손댈 수 없다.

- **비즈니스 글은 미리보기에서 승인 버튼이 나오지 않는다. 이건 버그가 아니라 의도다.** `/api/preview/approve`·`reject`가 경로를 `content/blog/{slug}.md`로 **무조건** 만들기 때문에, 비즈니스 슬러그로 승인을 누르면 발행이 아니라 **`content/blog/`에 유령 파일이 생기고** 거부는 없는 경로를 지우려 한다. 비즈니스 발행은 git으로 한다.

- Blog `293` V04는 반려로 종결. 유튜브 업로드 후보에서도 제외한다(디스크 파일은 V03이라 동일 여부 미확인).
- 소셜 재사용은 여전히 대표님 선택 + 3편 배치 리듬을 따른다.

## Next Recommended Work

> **Read this list against the newest Current Snapshot before acting on or repeating any line.** Entries here have gone stale within a day before and produced a wrong session-close report. Snapshots are the work record; this is a convenience list.

**[날짜 고정] 2026-08-31 — 유튜브 쇼츠 10편 재판독** (7편이 전부 8일을 넘기는 날).
8/14~8/23 게시분, **"넓은 문화 호기심 + 보편적 불안 해소" 가설의 검증.** 기준은
`output/strategy/youtube-shorts-verdict_2026-08-24.md` §8. **유입은 이미 확정 실패**(28일 6세션·0.025%)라
남은 질문은 주제 가설뿐이고, 음수면 쇼츠를 접는 것도 결론에 포함된다.

0a. **[완료] 코레일 추석 예매 — 2026-08-13 공지 확인됨.** `200`이 확정 날짜(우선 9/3~4, 일반 9/7~11,
잔여 9/11 15:00)로 갱신됐고 `380`도 반영됐다. 8/20에 예상했던 날짜는 전부 틀렸고 실제 공지가 늦었다.

0c. **[날짜 있음] 2026-09-01 — `225` 재작성.** KTX·SRT 통합으로 "둘 중 무엇을 고를까"라는 글의 전제 자체가 사라진다. 지금은 상단 업데이트 고지만 붙여둔 상태다. 본문 35군데가 없어질 사업자를 비교하고 있다.

0d. **[대표님 판단 대기] 비즈니스 다음 후보.** 나비엔 발행 완료. 남은 후보는 **오로라월드·위닉스·락앤락**이고 **수요만 쟀고 커버리지 게이트는 미실시**다. **락앤락은 2017년 홍콩계 PE(Affinity) 인수라 소유구조 규칙 확인이 먼저**다. 문서 `output/strategy/business-candidates_2026-08-14.md`.


0f. **서울 쇼핑 코너 — 백로그가 얇다.** 8/14 게이트에서 상위 4개가 전부 혼잡/기각(안경은 전용 도메인이 클러스터를 소유해 **하드 기각**). 남은 것은 문구·을지로 공구·중고카메라이고 수요 미측정. **중복 통합(다이소 218/148)은 9/23 이후** — 그때 GSC를 새로 뽑으니 통합 전후를 우리 데이터로 잴 수 있다.
0. **[날짜 고정] 2026-09-23 — 편의점 클러스터 + 리프레시 프로그램 동시 판정.** GSC에서 **같은 "지난 3개월" 창**으로 새 추출본을 받아 `output/gsc/`에 넣고 `npm run cluster:judge`. 기준선은 2026-08-12에 찍었다(`output/strategy/cluster-baseline_convenience-store.md`). **이 판정 전에 다음 패키지를 클러스터 방식으로 짜는 것은 근거 없는 반복이다.** 스크립트가 같은 추출본이면 스스로 거부하고, "차이 없음"도 하나의 결론으로 낸다 — 중간을 취해 "긍정적"이라 부르지 말 것. **같은 날 리프레시 트랙도 판정한다 — `npm run refresh:judge`** (기준선 `output/strategy/refresh-baseline.md`, 35편 치료군 / 30쌍 엄격 부분집합 72대72 / 큐 잔여 22편 제2 대조군). **GSC 한 번 뽑으면 둘 다 끝난다.**

0b. **[날짜 있음] 가을 행사 패키지 — 남은 3편.** 사이클 `output/strategy/keywords_2026-W34.md`(대표님 승인 완료, `378`·`379` 발행됨).
   - **자라섬재즈 — 9월 2주 집필.** 10/9~11 가평, 한불수교 140주년 프랑스 포커스, 1일권 ₩88,000. **제목에 Korea 명시 필수** — "Jarasum"만으로는 Korea 게이트 불통.
   - **에버랜드 할로윈 — 블로커.** 2026 기간 **미발표**. 스펙 v1이 이번 달 사실을 요구하므로 발표 전 집필 불가. **8월 말 에버랜드 공식 재확인.**
   - **서울빛초롱 — 10월 1주.** 11/1~1/31 청계천은 **2차 출처**다. 집필 시 서울시 공식으로 **반드시 재검증** — 부산 예매 건에서 2차 출처가 틀렸던 전례가 있다.
   - **부산 예매 발표 감시.** `379`는 "2026 예매 미공개"를 전제로 썼다. 2025 리듬대로면 **얼리버드가 8월 하순**이다. 발표되면 `379`에 실제 날짜·가격을 반영한다.

1. **레인 상태 — 뷰티(2차)는 2026-08-15 대표님 결정으로 개방됨**(CTR 게이트가 수익 축을 재지 않았다는 판단 — FACTS 참조). 현재 뷰티 3편(`388`·`395`·`396`). 1차 레인 CTR 재판정은 다음 GSC 추출에서: 직전 측정 신규 코호트 1.11%. **뷰티 6편+가 1차 레인보다 CTR 낮으면 재검토**가 기록된 반전 조건이다.
2. **리프레시 트랙(`refresh-queue.json`) — 2026-09-23 판정까지 중단.** **단 `seeds:check` 게이트는 여기 해당하지 않는다** — 대상이 겹치지 않음을 `218` 작업 때 확인했다. 계획서가 "45편 효과를 판정한 뒤 계속 여부를 결정한다"고 게이트를 걸었는데 **판정 없이 35편을 더 태웠다**(08-06~08-12). 2026-08-12에 뒤늦게 기준선을 찍었으므로(`refresh-baseline.md`) **이제는 판정이 가능하다 — 그때까지 큐를 더 소진하지 않는다.** 남은 25편은 그대로 두는 것이 제2 대조군으로서 값어치가 있다(22편이 기준선에 기록됨). 판정이 양수로 나오면 재개하고, "차이 없음"이면 슬롯을 신규 1차 레인에 넘긴다.
3. **`용리단길`이 `/seoul` 허브 신규 글 1순위 후보.** `275`를 쓰면서 실측이 이미 쌓였다 — 신용산역 2번 출구·용산역 1번 출구에서 도보 5~10분, 한강로2가 골목, 아모레퍼시픽 신사옥이 촉발, 미쉐린 가이드가 용산 동네 가이드 발행. **허브에 동네 12곳이 있는데 용리단길이 없다.** 익선동·연남동과 같은 층위다.
4. **비즈니스 섹션 다음 후보는 커버리지 게이트를 먼저 통과시킨다.** 오뚜기·풀무원으로 B-2가 9편이 됐고 식품 쏠림(삼양·오뚜기·풀무원)이 생겼다. **2026-08-09 대표님 지시로 대기업·상장사 후보는 전부 기각·재론 금지** (하이트진로·대상 종가·BGF/GS리테일 포함). JMW형 중소기업만, 게이트 1번은 "영어권 기획기사가 이미 있는가"다 — FACTS 참조. **주간 비즈니스 주제는 집필 전 대표님 승인이 필요하다** — 초안부터 쓰지 말 것.
5. **릴스 지표 기록 — 8/13·14·15 게시 후.** 예약은 2026-08-07에 완료했다(위 스냅샷). 게시되면 1h/24h/7d 조회·저장·공유·시청완료율을 `output/reels/metrics.json`에 남긴다. 저장소에 실측 조회 데이터가 아직 0건이고, **측정 없이는 조회수를 설계할 수 없다**는 게 Reels 2.2 진단의 핵심이었다.
6. **W34 씨앗 축 변경 검토.** W33은 씨앗 31개에 5개를 건졌고 기각 사유 다수가 "수요 없음"이 아니라 **"이미 누가 썼음"**이었다. 개별 제품 열거가 마르고 있다는 신호.
7. **`189` 꼬깔콘 — 대표님 답변 대기.** 커버리지는 통과했고 훅도 좋은데(손가락에 끼워 빼먹는다) 구글 분기가 2개뿐이다. W33에서 세 가지 표현으로 재검사했으나 4/0/8로 동일했다. **단독 발행 vs 기존 스낵 글에 섹션으로 편입** 미결.
8. **릴스 지표 기록** — `174`(7/31), `326`/`321`/`320`(8/1~8/3)이 착지했는데 `output/reels/metrics.json`에 아직 없다. 측정 없이는 조회수를 설계할 수 없다는 게 Reels 2.2 진단의 핵심이었다.
9. **아마존 클릭 효과 판정 (2~3주 뒤)** — 버튼(08-01)과 한 줄 링크 273편(08-01)의 합산 성적표는 **클릭 수가 35에서 얼마나 움직이는지**다. 전환율은 이미 11.43%라 병목은 클릭 수이고, 재신청 계정 `epickor-20`의 **180일 내 판매 3건** 시한에 직결된다.
10. **사진 적은 글 나머지 53편 보강** — 08-02에 6편 완료. 세로 이미지는 **그대로 둔다**(대표님 판정). **KTO API는 장소 주제에만** — 브랜드·제품엔 무효임이 08-04에 확인됐다.
11. **보류 항목** — 뷰티 주제(Neogen, Biodance, Medicube-vs)는 **2차 레인 게이트 통과 전까지 보류**(위 1번). Creatrip 제휴는 **폐기**(재론 금지). **UI/UX 리디자인 5안은 대표님이 "나중에 할 것"이라 명시** — 먼저 꺼내지 말 것.
12. **배포 게이트 규칙** — 로컬 `next build`를 상시 검증 게이트로 쓰지 말 것(이 머신에서 워커 60초 초과로 실패하며 자원 문제가 아니다 — `.next` 0.22GB·디스크 112GB 여유). `npx tsc --noEmit`이 실질 검사(21초). **빌드를 다른 무거운 node 작업과 같은 메시지에서 병렬로 보내면 확실히 죽는다.** dev 서버를 띄웠으면 `TaskStop` 후 포트가 닫혔는지 확인 — `.next/dev/lock`이 남으면 다음 기동이 500으로 죽는다.

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

- 2026-08-25 (오후): **챕터 2 중간점검 + 순위 레인 착수.** 재사용 규칙 셋.
  - **집계 지표는 세 번째로 거짓말을 했다.** "옛 글 −16%"가 하락 3편(끝난 축제)을 빼자 +29.8%가 됐다.
    **집계 차이를 보면 중앙값과 상위 제거 검정을 반드시 같이 돌린다**는 규칙이 또 값을 했다.
  - **"노출의 87%가 5위 밖"을 기회로 읽지 말 것.** 실제 공략 가능분은 **15.5%**다 — 나머지는
    dead-end 4편·내비게이셔널·비영어·정의형. 큰 숫자를 기회로 보고하기 전에 빼야 할 것을 먼저 뺀다.
  - **순위 기회는 "형태"만으로 못 고른다. 시장도 봐야 한다.** CTR 1.42%로 사이트 평균 3배인 페이지가
    노출의 65%가 아랍어·러시아어였다. **아마존에 닿을 수 없는 클릭은 순위를 올릴 이유가 안 된다.**

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

> 그 이전 항목은 `docs/handoff/2026-08_recent-change-log.md`로 내렸다.
