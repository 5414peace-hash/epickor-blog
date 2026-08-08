# Visual Review - 2026-08-08_samick (spec-sheet system)

Structural gate: PASS (review-cardnews.mjs; 4 subject-note exemptions eye-confirmed below).
All 7 PNGs inspected at full resolution.

| Card | Topic fit /30 | Korea fit /25 | No-mislead /20 | Variety /15 | Mobile /10 | Total |
|---|---|---|---|---|---|---|
| 01 cover | 28 | 24 | 19 | 14 | 9 | 94 |
| 02 Hondo | 28 | 23 | 19 | 14 | 9 | 93 |
| 03 pedal steel | 27 | 24 | 19 | 14 | 9 | 93 |
| 04 ~50% number | 29 | 24 | 20 | 14 | 10 | 97 |
| 05 fall | 27 | 24 | 19 | 14 | 9 | 93 |
| 06 Steinway/Seiler | 29 | 24 | 19 | 14 | 9 | 95 |
| 07 CTA | 27 | 24 | 19 | 14 | 9 | 93 |

Average 94.0, min 93 — passes the ≥90 avg / ≥88 min gate.
Exemption eye-checks: card 02 image IS a named OEM product (Hondo); card 03 image IS a
Samick-branded instrument; cards 05-06 are concept cards showing the subject company's own
products, with Seiler named in card 06's note line. No mismatch of the 짜파게티-class.
Notes: cover stamp deliberately clips the panel frame (inspection-mark aesthetic); "58" of
EST. 1958 partially over dark area but legible at mobile size.

## v2 (2026-08-08) — 대표님 피드백 반영 재설계
- 피드백: 캐러셀 3개 디자인이 유사 / 텍스트 겹침·줄간격 / 카드 위 한국어 두 줄 / 문체 딱딱함 / 1장 강화.
- 조치: 캐러셀별 독립 비주얼 시스템으로 전면 재렌더 (renderer: render-makers-v2.py, style=samick 참조).
  카피 전면 구어체 리라이트. 한국어는 캐러셀당 한 줄 낙관 요소로만. 렌더 후 오버플로 자동 게이트 추가.
- 눈검수: 7장 전부 1080px 원본으로 확인. 겹침·고아줄·프레임 침범 없음. 워터마크/카드01 세이프존 확인.
- Visual Fit v2: 전 카드 90+ (커버 96, 최저 91). 구조 게이트 PASS (subject_note 면제 전부 눈확인).
