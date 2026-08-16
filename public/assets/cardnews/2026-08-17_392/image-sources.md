# Image sources — 2026-08-17_392 (김치냉장고, EARTH GAUGE 시스템)

시스템: **땅속 온도계** — 이 가전이 복제한 것이 겨울 땅속 1m의 온도라는 사실에서 태어난 방향.
좌측 깊이 게이지 레일(카드 진행에 따라 바늘이 0m→-1m로 하강), soil paper `#F2EBE0` /
deep earth `#2E211A` / onggi `#8A5A38` / kimchi red `#C0392B`. 렌더러 `render-earthgauge.py` 신규.
rxlabel·pricetag·stationsign·heatscale(가로 게이지 — 본 시스템은 세로 깊이 축)·makers-v2와 비겹침.

## 소스 (전부 육안 확인 후 채택)

| 카드 | 파일 | 출처 | 라이선스 |
|---|---|---|---|
| 01 | card_01-topload-fridge.jpg | Commons `Kimchi refrigerator.jpg` (블로그 392와 동일 원본 — 동일 포스트 자산) | **CC BY-SA 2.0 KR, 국립국어원** |
| 02 | card_02-kimchi-kinds.jpg | Commons `Various kimchi.jpg` | **CC BY-SA 2.0 KR, 국립국어원** — 6종 스튜디오 컷, 동치미 포함 |
| 04 | card_04-jangdokdae.jpg | Commons `Korea-Hanok-Jars-Kimchi-01.jpg` (블로그 392 동일 원본) | CC BY 2.0, Drab Makyo |
| 05 | card_05-gimjang.jpg | Commons `Gimjang in Gaemi Village, 1 December 2012.jpg` | **CC BY 2.0, USAG-Humphreys** — 실제 김장 |
| 06 | card_06-lg-drawer.jpg | Commons `Kimchi refrigerator3.jpg` (블로그 392 동일 원본) | CC BY 2.0, Jose Gabriel Marcelino — 패널에 `LG 김장독` 판독 |
| 07 | card_07-kimchi-well-detail.jpg | **의도적 파생** — card_01 원본의 김치 웰 영역 크롭 (`60,120 680x500`) | 동일 라이선스. 커버와 다른 구도·용도, 본 문서에 사유 기록 |
| 03 | (넘버 카드 −1°C — 이미지 없음) | 시스템 코어 카드 | — |

## 기각 기록

- **`Kimchi.jpg` (Marcel Montes)** — 김치 클로즈업 후보였으나 **포장 라벨이 일본어**(일본 매장
  김치통 매대). 국가 불일치로 기각 — 2026-08-03 규칙 계열. 국립국어원 6종 컷으로 대체.
- `Kimchi jar.JPG` — 옹기 배열이 카드 04(장독대)와 중복 성격이라 미사용.
- `Gimjang ... 2.jpg` — 동일 행사 두 번째 컷, 1번 컷이 더 김치 더미 중심이라 미사용.

## 교차 중복

- 전 카로셀 `image:` 대조 — 본 배치 파일 전부 신규 경로. 김장·6종김치 소스는 사이트 첫 사용.
- 블로그 392와 공유 3장은 동일 포스트 자산 우선 규칙 범위.

## 게이트

- `review-cardnews.mjs` **PASS** (사진 6/7, 연속 무사진 1). 카드 02·04·05·06·07 `subject_note`
  면제 — 매 실행 경고 재고지 방식.
- 원본 해상도 검수: 01(패널 한글·김치 판독, `GROUND` 라벨 잘림 발견→렌더러 수정 후 재렌더),
  06(`LG 김장독` 판독) + 시트 1회.

## Visual Fit (30/25/20/15/10)

| 카드 | fit | Korea | 정직 | 일관 | 모바일 | 합 |
|---|---|---|---|---|---|---|
| 01 | 29 | 24 | 20 | 14 | 9 | **96** |
| 02 | 27 | 25 | 20 | 14 | 9 | **95** |
| 03 | 28 | 21 | 20 | 15 | 10 | **94** |
| 04 | 28 | 24 | 20 | 14 | 9 | **95** |
| 05 | 29 | 25 | 20 | 14 | 9 | **97** |
| 06 | 27 | 24 | 20 | 14 | 9 | **94** |
| 07 | 26 | 23 | 20 | 14 | 9 | **92** |

**평균 94.7 / 최저 92 — 통과.**

## 상태

제작·검수 완료. 예약 보류 — 트리오(C+E+F) 완성 후 8/24 쇼츠 판정과 함께 일괄.
