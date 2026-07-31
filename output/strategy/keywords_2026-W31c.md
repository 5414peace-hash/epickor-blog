# 주간 키워드 사이클 — 2026-W31 (3회차, 대용량 배치)

**실행일**: 2026-07-31 (ISO 31주차 3회차) · **절차**: `docs/keyword-selection-playbook.md` §5
**목적**: 소량 정밀 방식이 하루 리듬을 못 먹인다는 진단에 따라, **한 주치 재고를 한 번에 확보**하는 대용량 배치.

> **대표님 승인 필요**: ✅ 표시 항목. ⏸ 보류·❌ 기각은 기록용이다.

---

## 왜 방식을 바꿨나

| | 1·2회차 (소량 정밀) | 3회차 (대용량 배치) |
|---|---|---|
| 씨앗 확보 | 생각나는 대로 13개 | **묶음별 체계적 열거 32개** |
| 통과 | **3개** | **9개** |
| 확보 분량 | 1.5일치 | **한 주치에 근접** |

하루 리듬은 신규 2편 = 주 14편인데 1·2회차 방식으로는 3개가 한계였다.
**주제가 고갈된 게 아니라 탐색 범위가 좁았던 것**이 확인됐다.
레인 1(음식-구체) 공간을 묶음별로 세면 90~120개 규모이고, 오늘까지 손댄 건 14개뿐이다.

---

## 요약 — 신규 집필 후보 9개

| # | 후보 | 타겟 쿼리 | 커버리지 확인 | 판정 |
|---|---|---|---|---|
| 1 | 안성탕면 vs 신라면 | `ansungtangmyun vs shin ramyun` | ✅ 확인 완료 — 전용 기사 없음 | ✅ **집필** |
| 2 | 계란빵 | `korean egg bread` (+ pan/mold) | ⏳ 미확인 | ✅ 집필 (확인 후) |
| 3 | 기름장 (참기름+소금) | `korean sesame oil dipping sauce` | ⏳ 미확인 | ✅ 집필 (확인 후) |
| 4 | 회오리감자 | `tornado potato korean name` | ⏳ 미확인 | ✅ 집필 (확인 후) |
| 5 | 냉동김밥 | `frozen kimbap how to cook` | ⏳ 미확인 | ✅ 집필 (확인 후) |
| 6 | 너구리 | `neoguri ramen hacks` | ⏳ 미확인 | ✅ 집필 (확인 후) |
| 7 | 할랄 한국 과자 | `{제품} halal` × 5제품 | ⚠️ **경쟁 있음** | ⏸ 조건부 — 아래 참조 |
| 8 | 비타500 | `vita 500 korean drink benefits` | ⏳ 미확인 | ✅ 집필 (확인 후) |
| 9 | 밀키스 | `milkis korean drink` | ⏳ 미확인 | ✅ 집필 (확인 후) |

**정직한 상태**: 9개 중 **커버리지까지 확인한 건 2개**(1번 통과, 7번 경쟁 확인)다.
나머지 7개는 Two-Curl·쿼리형태·중복 감사는 통과했으나 **영어 공급 확인이 남았다.**
1·2회차에서 최상위 후보 2개가 바로 이 단계에서 죽었으므로, **집필 착수 전 반드시 개별 확인한다.**

---

## 규모로만 보이는 발견 — `halal`

제품 하나씩 볼 때는 안 보이다가 32개를 훑으니 드러난 패턴이다.
**서로 다른 한국 과자 5개에 `halal`이 자동완성으로 붙어 있다.**

```
choco pie korean halal
neoguri ramen halal
ansungtangmyun halal
home run ball snack halal      (오늘 앞선 배치)
yonsei cream bread halal       (오늘 앞선 배치)
```

제품별 호기심이 아니라 **한국 과자 전반에 대한 체계적 미해결 질문**이다.
한국을 찾는 무슬림 여행자는 크고 늘어나는 층인데, 개별 제품 단위로 답하는 페이지가 없다.

**다만 커버리지 게이트가 애매하다.** `halalcodecheck.com`이 2026년 전용 기사
("Halal Snacks in South Korea: What to Buy at CU, GS25 and 7-Eleven")를 냈고 Creatrip에도 있다.
Korea Times급 통신사는 아니지만 비어 있지도 않다.

**차별화 가능한 각도**: 기존 커버리지는 전부 "추천 목록"이다. 그런데 실제 수요는
**제품 단위 판정**(`너구리는 할랄인가?`)이다. 제품별 인증 여부를 표로 답하면 다른 물건이 된다.
한국어 출처로 **KMF(한국이슬람교중앙회) 인증 체계**를 설명할 수 있는 것도 우리 우위다.

> ⚠️ **집필 시 필수 규칙**: 할랄 여부는 독자의 종교적 실천에 직접 영향을 주는 사실 주장이다.
> **포장에 KMF·MUI·JAKIM 로고가 인쇄된 것만 "인증됨"으로 쓴다.** 성분표를 보고 추정하지 않는다.
> 인증이 없는 제품은 **"인증 없음"이라고만 쓰고 "하람"이라고 단정하지 않는다.**
> 확인 불가한 제품은 확인 불가로 남긴다. 이 규칙을 못 지키겠으면 주제를 버린다.

---

## ✅ 1. 안성탕면 vs 신라면 — 집필 (커버리지 확인 완료)

**제목안**: `Ansungtangmyun vs Shin Ramyun: Which Korean Ramyun to Buy First`
**타겟**: `ansungtangmyun vs shin ramyun` · **쿼리 형태**: comparison (최상급)

```
네이버 "안성탕면" → 10개
구글EN "ansungtangmyun" → 10개, 그중 "ansungtangmyun vs shin ramyun" 실재
                          + halal · meaning · ingredients · flavour
```

**커버리지 (확인 완료)**: **전용 대조 기사가 없다.** myfreshdash·linguasia·lookatkorea의
"베스트 한국 라면" 리스티클 안에 한 줄씩 언급될 뿐이고, Quora와 위키백과가 상위에 섞여 있다.
쿼리는 실재하는데 그 질문만 다루는 페이지가 없다 — 344(박카스)와 같은 구조다.

**핵심 답 (조사 중 확보)**: 신라면은 고추 베이스, **안성탕면은 된장(soybean paste) 베이스**다.
"덜 맵다"가 아니라 **국물의 계열이 다르다**는 게 진짜 답이고, 영어 리스티클은
"milder"로만 뭉개고 있다. 1983년 출시, 2023년까지 누적 160억 그릇 이상.

**중복 감사**: `038`(Korean Ramyun Guide)이 두 제품을 나열하지만 대조하지 않는다.
**클러스터 확장으로 라벨한다.** 발행 시 `038`에서 이 글로 내부링크를 건다.

---

## ✅ 2. 계란빵 — 집필 (커버리지 확인 필요)

**제목안**: `Korean Egg Bread (Gyeranppang): Street Stalls, Price, and Making It at Home`
**타겟**: `korean egg bread` · **쿼리 형태**: identity + how-to

```
구글EN "korean egg bread" → 10개
  recipe · calories · maker · mold · pan · with pancake mix · street food · myeongdong · near me
```

**왜 좋은가**: **레인 1에서 드물게 아마존 제휴가 자연스럽다.** `korean egg bread maker`,
`mold`, `pan`이 자동완성에 있다 — 실물 상품 수요다. 레인 1 대부분이 한국 내수 식품이라
제휴가 약했는데 이건 다르다.

**보유 자산**: `220`(지하철 간식) 리프레시에서 계란빵 개당 ₩1,500 확보 완료.
**중복 감사**: `220`에 한 줄 언급뿐. 전용 글 없음.

---

## ✅ 3. 기름장 — 집필 (커버리지 확인 필요)

**제목안**: `Korean Sesame Oil and Salt Dip: The BBQ Sauce Nobody Explains`
**타겟**: `korean sesame oil dipping sauce` · **쿼리 형태**: mechanism

```
구글EN "korean sesame oil" → 10개
  dipping sauce · dipping sauce recipe · salt dip · brands · spinach · cucumber · noodles
```

**왜 좋은가**: 고깃집에서 참기름+소금(기름장)이 왜 나오는지, 쌈장과 언제 갈라 쓰는지
영어로 설명하는 데가 거의 없다. `083`(쌈장)에서 2:1 비율을 준 것과 같은 방식으로
**"비율과 용도"**를 주면 된다. `172`(한국BBQ)·`083`과 상호 링크되어 클러스터가 깊어진다.

---

## ✅ 4. 회오리감자 — 집필 (커버리지 확인 필요)

**제목안**: `Tornado Potato in Korea: The Korean Name, the Stalls, and What It Costs`
**타겟**: `tornado potato korean name` · **쿼리 형태**: identity (정답이 명확)

```
구글EN "tornado potato korea" → 10개
  korean name · frozen · street food · spiral potato · tornado fries
```

**`tornado potato korean name`**이 자동완성에 있다 — 이름을 몰라서 못 찾고 있다는 뜻이다.
회오리감자라는 답 하나로 쿼리가 해결되고, 그다음 어디서 파는지·얼마인지로 이어진다.

---

## ✅ 5. 냉동김밥 — 집필 (커버리지 확인 필요, 프레임 주의)

**제목안**: `Korean Frozen Gimbap: How to Cook It So It Isn't Soggy`
**타겟**: `frozen kimbap how to cook`, `frozen kimbap in air fryer` · **쿼리 형태**: mechanism

```
구글EN "frozen gimbap" → 10개
  costco · aldi · hmart · walmart · near me · nz · canada  ← 소매 마커 (금지 프레임)
  how to cook · in air fryer                                ← 여기가 우리 자리
```

> ⚠️ **소매 마커가 우세하다.** "where to buy" 프레임으로 쓰면 코스트코·월마트에 진다.
> **반드시 조리법 프레임으로만 쓴다.** 이 구분을 놓치면 기각 대상이다.

---

## ✅ 6. 너구리 — 집필 (커버리지 확인 필요, 사실 확인 주의)

**제목안**: `Neoguri Ramen: Korea's Seafood Noodle, and the Hacks Koreans Actually Use`
**타겟**: `neoguri ramen hacks` · **쿼리 형태**: mechanism

```
구글EN "neoguri ramen" → 10개
  hacks · recipe · seafood · cup · halal · calories · review
  cancer  ← 주의
```

> ⚠️ **`neoguri ramen cancer`가 자동완성에 있다.** 건강 위해 관련 질의이므로
> **공식 발표·규제기관 자료로만** 다루고, 확인되지 않으면 아예 언급하지 않는다.
> 트래픽을 노리고 불안을 증폭하는 서술은 하지 않는다.

**보유 자산**: `038`에 짜파구리 맥락 있음. 중복 아니라 클러스터 확장.

---

## ✅ 8·9. 비타500 / 밀키스 — 집필 (커버리지 확인 필요)

**비타500 제목안**: `Vita 500: Korea's Vitamin Drink, and Whether It Actually Does Anything`
```
구글EN → benefits · is vita 500 good for you · ingredients · reddit
```
**344(박카스)와 같은 구조**다 — 작은 병에 든 기능성 음료, 효능 질문이 수요를 만든다.
같은 주의사항도 그대로 적용: **효능을 단정하지 않고 표기 성분과 유통 구조만 설명한다.**
344와 상호 링크하면 "한국의 작은 병 음료" 클러스터가 만들어진다.

**밀키스 제목안**: `Milkis: Korea's Milk Soda Explained, and Which Flavor to Start With`
```
구글EN → korean drink · flavors · ingredients · zero · banana
```
탄산에 우유를 섞은 조합이 외국인에게 낯설다는 게 그대로 검색어에 나온다.

---

## ❌ 기각 — 영어 수요 없음

자동완성 분기 수가 결정적이었다. 한국에서 아무리 유명해도 **영어로 아무도 안 찾으면
1등을 해도 트래픽이 0**이다.

| 후보 | 영어 분기 | 비고 |
|---|---|---|
| 왕뚜껑 | **0** | |
| 미원 | **0** | |
| 맥콜 | 0~3 | 네이버에 `맥콜 통일교` 같은 재밌는 각도가 있으나 영어 수요 없음 |
| 오징어땅콩 | 3 | |
| 햇반 | 3 | `korean instant rice`로는 10개지만 브랜드 각도 약함 |
| 데미소다 | 4 | |
| 핫바 | 4 | |
| 맛동산 | 5 | |
| 죠스바 | 2 | |
| 월드콘 | 6 | |

## ❌ 기각 — 오염·정체성 불일치

- **명랑핫도그**: 영어 자동완성이 `korean corn dog brandon fl`(미국 플로리다)로 오염
- **빼빼로**: `peperoncino`·`peperomia`·`pepperoni`로 오염. 단 **`pepero day in korea`는 실재** —
  11월 11일 페페로데이 자체를 타겟하면 살아날 수 있다. **11월 시즌에 재검토** (id 유지)
- **포카리스웨트**: 일본 오츠카 제품이다. EpicKor 정체성에 안 맞는다
- **초코파이·붕어싸만코**: 영어 수요는 크나 **수출품이라 영어 커버리지 존재 가능성 높음**.
  `samanco ice cream`은 `costco`·`where to buy` 등 **소매 마커 우세**라 금지 프레임이기도 하다
- **김밥천국**: `kimbap price in korea`·`is korean kimbap healthy`는 쓸 만하나 브랜드 각도가 약함
- **호떡**: `meaning`·`in english` 등 정의형 우세. 단 `220`에서 이미 가격을 다뤘다
- **꼬깔콘**: `meaning` 우세, 나머지는 얇음

---

## 승인 요청

**신규 집필 8건 + 조건부 1건(할랄)**

승인해 주시면:
1. 커버리지 미확인 7건을 **먼저 일괄 확인**한다 (여기서 탈락이 나올 수 있음 — 1·2회차 전례)
2. 살아남은 것부터 **하루 2편 리듬으로 연속 발행**한다. 중간에 멈추지 않는다
3. 모든 제목에 **한국 지시어**를 포함한다 (2026-07-31 신설 게이트, 리뷰어 하드 블로커)
4. 할랄은 위 필수 규칙을 지킬 수 있을 때만 착수한다

**다음 사이클(W32, 8월 3일 월요일)부터는 이 대용량 방식을 기본으로 한다.**
