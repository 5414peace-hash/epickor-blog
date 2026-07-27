# Reel 220 v2 — Beat Sheet (process v3)

Narration/TTS/정렬은 v001 그대로(대표님 리젝 사유가 대본이 아니라 클립이었음). 총 1345f = 44.8s.
15비트 ≈ 3초/비트. 영상 10슬롯 / 이미지 5슬롯(33% ≈ "30% 정도"). 첫 비트는 영상.

**컷 프레임은 자막 강제정렬 실측값에서 산출** (`caption-timings-v01.json`) — 나레이션 단어와
화면이 어긋날 수 없음.

| # | 프레임 | 나레이션(해당 구간) | 화면 | 소스 · 검증 |
| --- | --- | --- | --- | --- |
| B1 | 8–99 | Okay so — that smell / ten seconds after | **V** griddle-work segA (trim 40) | Pexels 4551328, cottonbro studio 서울 길거리음식 시리즈. 국가중립 클로즈업, 외국 증거 없음 |
| B2 | 99–204 | you come up **the stairs** in Seoul it hits you | **I** sinchon-exit | Commons `Seoul-metro-240-Sinchon-station-entrance-2` CC BY-SA 4.0, LERK. **신촌역 2번출구 한글 간판** |
| B3 | 136→204 구간 내 | you're gonna stop walking | (B2에 흡수 — 계단 이미지가 두 문장을 받음) | 15슬롯 유지 위해 B3은 별도 컷 없음 |
| B4 | 204–234 | **It's hotteok.** | **I** hotteok-busan | Commons `Ssiat-hotteok` CC BY-SA 2.0, bryan..., **부산 GPS 좌표**. 노점 배경의 실물 씨앗호떡 |
| B5 | 234–342 | Brown sugar… pressed flat on a griddle | **V** griddle-work segB (trim 230) | 4551328 다른 구간, 스패출러 누르는 동작 |
| B6 | 342–425 | sidewalk… dollar fifty | **V** street-day segA (trim 20) | Pexels 36412260 "busy-street-market-in-**south-korean**-city", 안경·환전 한글 간판 |
| B7 | 425–556 | these stalls aren't random | **V** shinsegae segA (trim 20) | Pexels 31727226, 신세계 본점 + 한국 버스. 남대문 인접 |
| B8 | 556–594 | parked right where you come out of the station | **V** shinsegae segB (trim 150) | ⚠️ 최약 매칭 #1 — 역 출구 영상이 Pexels에 없음. B2의 실제 역 이미지가 맥락 선증명, 여기선 도심 상권으로 받음 |
| B9 | 594–657 | That's the entire business model. | **V** street-day segB (trim 130) | 36412260 다른 구간(시장 노점 열) |
| B10 | 657–753 | Fish-shaped bread… red bean | **I** bungeoppang-stall | 포스트 220 보유. 잉어빵 현수막 |
| B11 | 753–834 | Steamed dumplings… fist | **I** mandu-vendor | 포스트 220 보유. 손만두 현수막 |
| B12 | 834–901 | Fried stuff on sticks that you dip | **V** dip-skewer (trim 30) | Pexels 4551330, cottonbro 동일 시리즈. 꼬치 딥 동작 그대로 |
| B13 | 901–998 | A pot of broth… since morning | **V** kimchi-pot (trim 20) | ⚠️ 최약 매칭 #2 — Pexels에 어묵국물 영상 없음(11556562는 311 사용). 끓는 한국 솥(김치)으로 대체. Dyon Siregar |
| B14 | 998–1104 | None of it is a meal… two bucks | **I** hanbok-stall | 포스트 220 보유. **₩3,000 가격표가 실제로 프레임에** |
| B15 | 1104–1345 | eat it standing up… which exit + 아웃트로 | **V** rain-yak (trim 0) | Pexels 38489829 "rainy-day-in-a-**korean**-shopping-street", 약국 한글 네온 |

## 게이트 통과 기록

- **원장**: 신규 ID 전부 `audit-reel-clip-uniqueness.mjs --slug 220` OK (4551328/4551330/36412260/31727226/11588425/38489829 + Commons 2)
- **국가**: 장소 컷 4개(B2/B6/B7/B15)는 한글 간판 또는 슬러그/GPS로 양성 확인. 클로즈업 3개(B1/B5/B12/B13)는 외국 증거 없음 + 한국 소재 시리즈
- **탈락 처리**: jongno-street 37632317(교회 광장 — 음식 무관), street-shops 38489830(38489829와 동일 장소 — 릴스 내 반복), 34572817·12153167·29844136(국가 양성 증거 없음), 일본 34141287·34983118, 터키 35480733, 인도 37157122, 비엔나 34141853
- **컷≤소스**: 최장 세그 131f(4.4s) ≤ 모든 소스 잔여 길이. 동일 클립 세그먼트는 타임코드 비중첩
- **BGM**: Cosmonkey — Hold Me (태그: Travel·Lifestyle·City·Groovy), 나레이션 대비 −20dB, 인 0.5s/아웃 1.5s 페이드

## 대표님 판단 요청 (정직 신고)

⚠️ 2곳이 완벽 매칭이 아닙니다: **B8**(역 출구 대사 ↔ 도심 상권 화면), **B13**(국물 대사 ↔ 김치솥 화면).
한국 확정 소재가 Pexels에 존재하지 않아 차선을 썼습니다. 이 2컷만 nanobanana 생성(승인 시) 또는
다른 방법으로 교체할지, 이대로 갈지 렌더 확인 후 결정해 주세요.
