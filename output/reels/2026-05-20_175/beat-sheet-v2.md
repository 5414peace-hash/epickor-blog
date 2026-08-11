# Reel 175 v2 — Beat Sheet (process v3)

나레이션/TTS(Chris)는 v001 그대로 — 리젝 사유는 대본이 아니라 클립 중복이었다.
총 1140f = 38.0s. 13컷 ≈ 3초/컷. 영상 10슬롯 / 이미지 3슬롯(23%). 첫 컷 영상.
자막은 개선된 그룹핑으로 재생성(123/123 단어, 절 단위 22카드).

**v001과 소재가 하나도 겹치지 않는다.** v001의 클립은 전부 과거 릴스 재사용(훅은 4개 릴스 중복)
이거나 일본 골목이었고, 이번 풀은 전부 신규 + 원장 통과 + 국가 양성 증거.

| # | 프레임 | 나레이션 | 화면 | 소스 · 국가 증거 |
| --- | --- | --- | --- | --- |
| B1 | 0–105 | two huge markets / do both | **V** market-stalls A (trim 10) | Pexels 38433424, FREE VIDEO HAPPY. 줄무늬 차양 + 신발·옷 좌판의 한국 재래시장 |
| B2 | 105–174 | waste a whole day | **V** jongno-alley A (trim 20) | Pexels 32214386, 슬러그 "seoul-s-jongno-district" — 익선동 한옥골목 인파 |
| B3 | 174–248 | not the same kind of place | **V** seoul-street (trim 20) | Pexels 34676841, 슬러그 "seoul" + 한글 도로표지·서울버스 |
| B4 | 248–312 | **Namdaemun** is a daytime thing. | **I** sungnyemun-gate | Commons, CC BY-SA 2.0, Jeon Han(Korea.net 공식 촬영). **숭례문 + 수문장 근위병** |
| B5 | 312–424 | morning / eat too much / buy stuff | **V** market-stalls B (trim 160) | 같은 시장 다른 구간 (타임코드 비중첩) |
| B6 | 424–500 | by evening it's closing up | **V** cheonggyecheon (trim 30) | Pexels 38109939, 청계천 산책로 — 하루가 저무는 무드 |
| B7 | 500–562 | **Dongdaemun** does the exact opposite. | **I** heunginjimun-gate | Commons, CC BY-SA 4.0, Tristan Surtel. **흥인지문 + 서울 초록버스** |
| B8 | 562–637 | doesn't wake up until it's dark | **V** doota A (trim 30) | Pexels 36294726 — **DOOSAN 타워·DOOTA.COM·평화시장·패션타운 간판 전부 프레임에** |
| B9 | 637–737 | wholesale buildings keep going till dawn | **V** night-cross A (trim 30) | Pexels 26690701, Timo Volz — **서울 야간** (정지 STOP·광화문/서울역/명동역 표지판·한국은행 구관) |
| B10 | 737–819 | one question / shopping in daylight, | **V** doota B (trim 350) | 두타 다른 구간 — "낮" 쪽 화면 |
| B11 | 819–871 | or after midnight? | **V** night-cross B (trim 250) | 야간 다른 구간 — "자정" 쪽 화면. 낮/밤 교차편집이 질문을 시각화 |
| B12 | 871–936 | Pick one. Do it properly. | **V** jongno-alley B (trim 160) | 같은 골목 다른 구간 |
| B13 | 936–1140 | Skip the other one / enjoy your trip + 아웃트로 | **V** cheonggyecheon B (trim 350) | 청계천 다른 구간 + `BEFORE YOU LAND` 칩 |

## v001 대비 해소된 문제

- **야간 페이오프가 진짜 서울 밤이 됐다.** v001은 야간 소재가 없어 약국거리 핑퐁 프록시로 때웠고
  "동대문"을 화면으로 증명 못 했다. v2는 두타·평화시장(동대문 실물) + 서울 야간 교차로를 확보,
  B10↔B11 낮/밤 교차편집이 "daylight or after midnight" 질문 자체를 화면으로 만든다.
- **이름의 주인인 두 성문이 정체성 앵커**: 숭례문(근위병) ↔ 흥인지문(서울버스). 대칭 구도.
- 클립당 세그먼트는 전부 타임코드 비중첩, 컷 길이 ≤ 소스 가용 길이.

## BGM
Ziggy — "Walk the Walk" (`input/BGM/`), 42s 트림, 0.11 볼륨, 페이드 인/아웃. 220(Hold Me)과 다른 트랙.
