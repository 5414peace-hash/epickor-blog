# Visual Review - 2026-08-08_cuckoo (spec-sheet system)

Structural gate: PASS (3 subject-note exemptions eye-confirmed).
All 7 PNGs inspected at full resolution.

| Card | Topic fit /30 | Korea fit /25 | No-mislead /20 | Variety /15 | Mobile /10 | Total |
|---|---|---|---|---|---|---|
| 01 cover | 29 | 24 | 20 | 14 | 9 | 96 |
| 02 OEM era | 28 | 24 | 19 | 14 | 9 | 94 |
| 03 abandonment | 28 | 24 | 19 | 14 | 9 | 94 |
| 04 98% number | 29 | 24 | 20 | 14 | 10 | 97 |
| 05 70% number | 29 | 24 | 20 | 14 | 10 | 97 |
| 06 rental twist | 28 | 24 | 19 | 14 | 9 | 94 |
| 07 CTA | 28 | 24 | 19 | 14 | 9 | 94 |

Average 95.1, min 94 — passes.
Two consecutive number cards (04-05) are deliberate: the bet, then the scoreboard — the
carousel's dramatic pivot carried by typography. All product images are Cuckoo's own official
cutouts; CUCKOO wordmark visible on every product card.

## v2 (2026-08-08) — 대표님 피드백 반영 재설계
- 피드백: 캐러셀 3개 디자인이 유사 / 텍스트 겹침·줄간격 / 카드 위 한국어 두 줄 / 문체 딱딱함 / 1장 강화.
- 조치: 캐러셀별 독립 비주얼 시스템으로 전면 재렌더 (renderer: render-makers-v2.py, style=cuckoo 참조).
  카피 전면 구어체 리라이트. 한국어는 캐러셀당 한 줄 낙관 요소로만. 렌더 후 오버플로 자동 게이트 추가.
- 눈검수: 7장 전부 1080px 원본으로 확인. 겹침·고아줄·프레임 침범 없음. 워터마크/카드01 세이프존 확인.
- Visual Fit v2: 전 카드 90+ (커버 96, 최저 91). 구조 게이트 PASS (subject_note 면제 전부 눈확인).
