# Image Sources For Blog 215

Reviewer visual fit target: 95/100 average. Used images are stored locally under `/assets/images/posts/215/`.

Important review note: two Pexels supermarket snack-aisle candidates were rejected for final article use because they looked non-Korean and could mislead readers. Final used set prioritizes visibly Korean packaging, menus, and street-food context.

- `shin-ramyun-package-components.jpg`
  - Source: Wikimedia Commons, File: 신라면(봉지면) 구성품.jpg.
  - Author: K-foodie.
  - License: CC BY-SA 4.0.
  - URL: https://commons.wikimedia.org/wiki/File:%EC%8B%A0%EB%9D%BC%EB%A9%B4(%EB%B4%89%EC%A7%80%EB%A9%B4)_%EA%B5%AC%EC%84%B1%ED%92%88.jpg
  - Fit: Real Korean product packaging with visible Hangeul and ingredient-label context.
  - Duplicate check: filename and source were not present in prior `content/blog` or `public/assets/images/posts` before selection.
  - Visual Fit Score: 99/100.
- `seoul-market-food-stall-ingredients.jpg`
  - Source: Pexels, photo ID 31858132, Photo by Theodore Nguyen.
  - URL: https://images.pexels.com/photos/31858132/pexels-photo-31858132.jpeg
  - Fit: Seoul market food stall with Korean menu signs and ingredients; strong for restaurant/menu ingredient questions.
  - Duplicate check: `rg 31858132` returned no prior blog/card-news asset usage before selection.
  - Visual Fit Score: 98/100.
- `seoul-street-food-stall-allergen-questions.jpg`
  - Source: Pexels, photo ID 32211598, Photo by Theodore Nguyen.
  - URL: https://images.pexels.com/photos/32211598/pexels-photo-32211598.jpeg
  - Fit: Korean street-food stall with visible ramen/tteokbokki packaging and menu information.
  - Duplicate check: `rg 32211598` returned no prior blog/card-news asset usage before selection.
  - Visual Fit Score: 98/100.
- `seoul-shop-package-carrying.jpg`
  - Source: Pexels, photo ID 32028720, Photo by Theodore Nguyen.
  - URL: https://images.pexels.com/photos/32028720/pexels-photo-32028720.jpeg
  - Fit: Korean street and packaging context; used as a general label/product-page reminder, not as a food-specific claim.
  - Duplicate check: `rg 32028720` returned no prior blog/card-news asset usage before selection.
  - Visual Fit Score: 94/100.

## 2026-08-12 리프레시 — 파일 변경 없음, 캡션 4건 재작성

**교체 시도는 했고 실패했다.** 이번 리프레시의 핵심 주장이 "알레르기 표시는 법으로 **바탕색이 구분된
별도 칸**에 들어가니 성분표를 읽지 말고 그 칸을 찾아라"인데, **그 칸이 실제로 찍힌 사진이 필요했다.**
Wikimedia Commons를 5개 검색어로 뒤졌으나 **전부 0건**이다:
`Korean food label nutrition` / `원재료명 식품 표시` / `Korean food package back label` /
`Korean nutrition facts label` / `food label South Korea ingredients`.

포장 뒷면 라벨은 **스톡·공공 아카이브에 존재하지 않는 범주**다(제품 팩샷조차 그런데 라벨은 더하다).
그래서 그 설명은 사진 대신 **본문 텍스트로** 처리했다. 기록해 두는 이유는 다음 세션이 같은 검색을
반복하지 않게 하기 위해서다.

| 파일 | 사진에 실제로 있는 것 | 캡션 조치 |
|---|---|---|
| `shin-ramyun-package-components.jpg` | 신라면 봉지 + 면 덩어리 + 스프 2봉(분말 10.5g·후레이크 1.5g). **면 덩어리가 뒷면 라벨을 가리고 있어 알레르기 칸은 안 보인다** | 종전엔 "라벨에 이 모든 게 들어간다"고 했는데 정작 안 보인다. **보이는 것으로 말이 되는 사실**로 교체 — 인쇄면이 셋이고 **알레르기 표시는 겉봉지에 있지 스프 봉지에는 없다**(스프엔 중량·제조원뿐) |
| `seoul-market-food-stall-ingredients.jpg` | 서울 시장 노점 + 한글 메뉴판 | "메뉴판이 라벨 역할" → **"여기엔 위 규칙이 하나도 적용되지 않는다"** 로 전환. 규제 라벨과 노점의 차이가 이 글의 실제 경계선이다 |
| `seoul-street-food-stall-allergen-questions.jpg` | 라면·떡볶이 포장이 섞인 노점 | 포장은 규제 라벨이 있고 **팬 안에서 벌어지는 일은 없다**는 대비로 재기술 |
| `seoul-shop-package-carrying.jpg` | 봉투를 든 사람, 거리 | "앞면은 분위기, 뒷면이 규제된 부분"으로 압축 |

**교훈(0차 소싱 규칙의 한계).** CLAUDE.md의 소싱 워터폴 0차는 "포장 제품이면 제조사 공식 사이트"인데,
**제조사도 자기 제품의 뒷면 라벨 사진은 올리지 않는다** — 올리는 건 앞면 팩샷이다. 라벨·서식·규제 화면이
필요한 주제는 **사진이 아예 없는 범주**로 보고 처음부터 텍스트 설계를 하는 편이 빠르다.
