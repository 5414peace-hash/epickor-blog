# Card news — Korean Ramyun (Heat Scale) 이미지 출처

전부 **EpicKor가 이미 발행한 글에서 검증된 사진**을 잘라 쓴 것이다. 새로 조달한 외부 이미지는 없다.

| 카드 | 파일 | 원본 글 | 원출처 / 라이선스 |
|---|---|---|---|
| 01 커버 | `card_02-spicy-korean-noodles.jpg` | 326 | Pexels License |
| 02 기준점 | `card_06-ramen-chopsticks.jpg` | 219 | Pexels License |
| 03 안성탕면 | `card_01-ansungtangmyun-powder.jpg` | 346 | Mobius6, CC BY-SA 4.0 (Wikimedia) |
| 04 신라면 | `card_03-shin-ramyun-powder.jpg` | 346 | Mobius6, CC BY-SA 4.0 (Wikimedia) |
| 05 불닭 사다리 | `card_04-spicy-ramen-bowl.jpg` | 219 | Pexels License |
| 06 짜파게티 | `card_05-seafood-ramyeon-bowl.jpg` | 038 | 정이의 아카이브, CC BY (공유마당) |
| 07 마무리 | — (이미지 없음, 다크 CTA 카드) | — | — |

**캐러셀 내 중복 없음** — 6장 전부 서로 다른 파일이다.

## 교체 기록

- **탈락: `048/efd079cc-...png` (까르보불닭 히어로).** 1차 렌더에 넣었다가 PNG 검수에서 뺐다.
  그 파일은 사진이 아니라 **"POPULARITY OF CARBO BULDAK" 텍스트가 박힌 그래픽**이라, 카드 안에서
  우리 헤드라인과 남의 헤드라인이 겹치고 단어가 잘려 나갔다. 219의 실제 라면 사진으로 교체.
  → 배치마다 PNG를 한 장씩 열어보는 이유가 이것이다.

## 비주얼 시스템 — "Heat Scale"

`html-to-png.py`의 레이아웃 A~F는 전부 **어두운 베일 위 텍스트**다. 이 배치의 논지는
**숫자끼리의 비교**라 그 템플릿으로는 표현이 안 된다. 그래서 전용 렌더러
`.claude/skills/cardnews/scripts/render-heatscale.py`를 새로 썼다 (2026-07-20 규칙: 표현이
안 되면 렌더러를 확장하거나 따로 만든다. 기본 템플릿으로 되돌아가지 않는다).

- 종이색(#F7F4EE) 바탕 — 다크 베일의 정반대. 그리드에서 기존 캐러셀과 구분된다.
- 카드마다 거대한 숫자 하나, 그리고 **가장 매운 공식 불닭(13,200)을 100%로 잡은 히트바**.
  캐러셀의 논지("유명한 그것은 극단이 아니다")를 말로 하지 않고 보이게 한다.
- 사진은 액자 패널에 담는다. 텍스트 뒤로 깔아 뭉개지 않는다.
- **카드 01은 인스타 프로필 그리드 썸네일**이므로 헤드라인을 중앙 안전영역에 두고,
  사진은 하단 밴드로 뺐다. 좌측 정렬 초안은 그리드 크기에서 첫 단어가 잘렸다.
