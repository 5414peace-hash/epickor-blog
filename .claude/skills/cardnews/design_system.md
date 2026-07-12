# EpicKor Card News Design System v1.0

For the full reusable production standard, read `.claude/skills/cardnews/epickor_cardnews_quality_standard.md` first. This design system defines visual components; the quality standard defines the required workflow, scoring, fact safety, and review discipline.

## Instagram Grid Cover Rule

- Card 01 must work as the Instagram profile-grid thumbnail.
- Keep the hook text centered in a conservative safe area. Avoid left-bottom title placement for Card 01 unless the representative explicitly approves it for that upload.
- Current approved cover-photo visibility standard: Card 01 should use `layout: F`, a centered hook, and `image_opacity: 0.88` by default. This preserves the representative-approved roughly 10 percentage point increase in background photo visibility from the older `0.78` cover setting.
- For upload-ready backlog fixes, use `layout: F` and render the cover with `node .claude/skills/cardnews/scripts/render-grid-cover.mjs --slug {slug} --mirror`.
- Keep all other carousel cards in their original layout unless there is a separate readability or visual-fit issue.

## Approved Seoul After Dark Preset - 2026-07-12

Reference batch: `public/assets/cardnews/2026-07-11_081`, `2026-07-11_288`, and `2026-07-11_290`.

The representative approved `Seoul After Dark` as a reusable full-carousel preset. Use it by setting the carousel header to:

```yaml
style: seoul-after-dark
```

The deterministic Edge renderer applies the selected blue-black/gold system to Card 01 and all supporting cards while preserving the existing photo, copy, layout letter, position, and watermark requirements.

Read `.claude/skills/cardnews/seoul_after_dark_style.md` for activation, visual tokens, layout mapping, suitability rules, and QA requirements. This preset is an approved option, not the mandatory default for every topic.

## Approved Dark Black-Bar Carousel Style - 2026-07-08

Reference batch: `public/assets/cardnews/2026-07-08_257`, `2026-07-08_258`, `2026-07-08_259`, `2026-07-08_277`, `2026-07-08_278`, `2026-07-08_279`.

Use this style for high-visual EpicKor Instagram carousels when the representative approves a sharper, darker, photo-forward look. This older black-bar style remains separate from the newer `Seoul After Dark` preset.

- Format: 1080x1080, 7 cards, photo-first on every card when suitable topic images exist.
- Card 01: centered heavy title inside the Instagram grid safe area; use large condensed/bold sans text over a Korean-context photo with a dark translucent text bar. The photo should remain clearly visible, not merely atmospheric.
- Cards 02-07: use dark translucent black bars, row strips, or label panels over the photo. Keep the message direct and swipe-driven; avoid empty middles.
- Typography: bold cover hook, smaller dense body text on interior cards, 0 letter spacing unless a watermark/label requires tracking.
- Watermark: every rendered PNG must show `EPICKOR.COM`.
- Color: keep the base dark, but use one compact accent per card batch when helpful. Do not let the carousel become a single-hue decorative theme.
- Image rules: Korea-first, topic-specific, no repeated `image:` paths inside the carousel, and no cross-post duplicate source unless explicitly documented.
- Deliverables: `script.md`, `caption.txt`, `instagram-caption.md`, `image-sources.md`, `visual-review.md`, rendered `card_01.png` through `card_07.png`, and source images under `sources/`.
- Review gate: run the structural card-news review, inspect rendered PNGs card by card, and record the Visual Fit Score before showing the carousel.

## 브랜드 개요

EpicKor 카드뉴스는 한국 문화를 전하는 **프리미엄 다크 카드뉴스**다.
Instagram 1080×1080px 기준. 영어 텍스트 중심, 한국어 키워드 혼용 허용.

---

## 컬러 시스템

| 역할 | 컬러 코드 | 사용처 |
|------|-----------|--------|
| **배경** | `#111111` | 모든 카드 기본 배경 |
| **다크 배경 2** | `#1A1A1A` | 박스·패널 배경 |
| **포인트 Gold** | `#C9A84C` | 커버·강조·제목 포인트 (주색) |
| **포인트 Teal** | `#4ECDC4` | 본문형 강조·언더라인·서브 포인트 (부색) |
| **화이트** | `#FFFFFF` | 본문 텍스트 |
| **회색 텍스트** | `rgba(255,255,255,0.6)` | 서브 텍스트·캡션 |
| **구분선** | `rgba(255,255,255,0.15)` | 카드 내 구분선 |

### 포인트 컬러 선택 기준
- **커버·시리즈 번호·핵심 강조**: Gold (`#C9A84C`)
- **본문 헤드라인·언더라인·내부 링크 느낌**: Teal (`#4ECDC4`)
- 한 카드에서 두 컬러를 동시에 쓰지 않는다

---

## 타이포그래피

```css
font-family: 'Noto Sans KR', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
```

| 역할 | 크기 | 굵기 | line-height | letter-spacing |
|------|------|------|-------------|----------------|
| 커버 메인 | 52~60px | 900 | 1.2 | -0.03em |
| 섹션 타이틀 | 28~34px | 700 | 1.35 | -0.02em |
| 본문 | 16~18px | 400 | 1.85 | -0.01em |
| 서브 캡션 | 13~15px | 400 | 1.6 | 0.05em |
| 워터마크 | 11~13px | 400 | 1 | 0.12em |

- `\n` → `<br>` 변환 필수 (자동 줄바꿈에 맡기지 않음)
- 작은 텍스트 블록: `word-break: keep-all;` 적용
- 영어 단어 중간에서 줄바꿈 금지

---

## 워터마크

모든 카드 우하단 고정:
```css
position: absolute;
bottom: 28px;
right: 36px;
font-size: 11px;
font-weight: 400;
letter-spacing: 0.15em;
color: rgba(255,255,255,0.35);
text-transform: uppercase;
```
텍스트: `EPICKOR.COM`

---

## 카드 기본 쉘

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1080">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1080px;
    height: 1080px;
    overflow: hidden;
    background: #111111;
    font-family: 'Noto Sans KR', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .card {
    width: 1080px;
    height: 1080px;
    position: relative;
    overflow: hidden;
    background: #111111;
  }
  .watermark {
    position: absolute;
    bottom: 28px;
    right: 36px;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.15em;
    color: rgba(255,255,255,0.35);
    text-transform: uppercase;
  }
</style>
</head>
<body>
<div class="card">
  <!-- 카드 내용 -->
  <div class="watermark">EPICKOR.COM</div>
</div>
</body>
</html>
```

---

## 레이아웃 4종

### Type A — 커버 카드

풀 다크 배경 + 사선 Gold 액센트 + 좌하단 텍스트 블록.
커버(1번)·마무리(마지막) 카드에 사용.

```html
<div class="card" style="position:relative;">

  <!-- 배경 그라데이션 -->
  <div style="
    position:absolute; inset:0;
    background: linear-gradient(135deg, #1a1200 0%, #111111 55%, #0d0d0d 100%);
  "></div>

  <!-- Gold 사선 액센트 (우상단) -->
  <div style="
    position:absolute; top:-80px; right:-60px;
    width:400px; height:400px;
    background:#C9A84C; transform:rotate(35deg); opacity:0.10;
  "></div>
  <div style="
    position:absolute; top:70px; right:50px;
    width:5px; height:260px;
    background:#C9A84C; transform:rotate(35deg); opacity:0.5;
  "></div>

  <!-- 텍스트 블록 (좌하단) -->
  <div style="position:absolute; bottom:100px; left:88px; right:88px;">
    <!-- 포인트 선 -->
    <div style="width:44px; height:3px; background:#C9A84C; margin-bottom:24px;"></div>
    <!-- 메인 타이틀 -->
    <div style="
      font-size:54px; font-weight:900; color:#FFFFFF;
      line-height:1.2; letter-spacing:-0.03em; margin-bottom:20px;
    ">[MAIN TEXT]</div>
    <!-- 서브 텍스트 -->
    <div style="
      font-size:17px; font-weight:400; color:rgba(255,255,255,0.65);
      line-height:1.75; letter-spacing:-0.01em;
    ">[SUB TEXT]</div>
  </div>

  <div class="watermark">EPICKOR.COM</div>
</div>
```

---

### Type B — 상단 그래픽 + 하단 텍스트

상단 45% CSS 그래픽 영역 + 하단 55% 텍스트 영역.
정보 전달·사례 설명 카드에 사용.

```html
<div class="card">

  <!-- 상단 그래픽 영역 -->
  <div style="
    width:1080px; height:486px;
    position:relative; overflow:hidden;
    background: linear-gradient(135deg, #1a1200 0%, #2d1f00 50%, #111111 100%);
  ">
    <!-- 내용 연결형 시각 장치 (통계·도형·이모지 등) -->
    [VISUAL ELEMENT]
  </div>

  <!-- 하단 텍스트 영역 -->
  <div style="
    width:1080px; height:594px; background:#111111;
    padding:52px 88px;
    display:flex; flex-direction:column; justify-content:center;
  ">
    <div style="
      font-size:28px; font-weight:700; color:#C9A84C;
      line-height:1.4; letter-spacing:-0.02em;
      border-bottom:2px solid #C9A84C;
      display:inline-block; padding-bottom:4px; margin-bottom:24px;
    ">[HEADLINE]</div>
    <div style="
      font-size:17px; font-weight:400; color:#FFFFFF;
      line-height:1.85; letter-spacing:-0.01em; word-break:keep-all;
    ">[BODY TEXT]</div>
  </div>

  <div class="watermark">EPICKOR.COM</div>
</div>
```

---

### Type C — 좌우 분할

좌 텍스트(60%) + 우 그래픽(40%). 비교·대조 카드.

```html
<div class="card" style="display:flex;">

  <!-- 텍스트 영역 (좌 60%) -->
  <div style="
    width:648px; height:1080px; background:#111111;
    padding:96px 72px;
    display:flex; flex-direction:column; justify-content:center;
  ">
    <div style="width:36px; height:3px; background:#4ECDC4; margin-bottom:28px;"></div>
    <div style="
      font-size:26px; font-weight:700; color:#4ECDC4;
      line-height:1.45; letter-spacing:-0.02em;
      border-left:4px solid #4ECDC4; padding-left:18px; margin-bottom:24px;
    ">[HEADLINE]</div>
    <div style="
      font-size:16px; font-weight:400; color:#FFFFFF;
      line-height:1.85; letter-spacing:-0.01em; word-break:keep-all;
    ">[BODY TEXT]</div>
  </div>

  <!-- 그래픽 영역 (우 40%) -->
  <div style="
    width:432px; height:1080px; position:relative; overflow:hidden;
    background: linear-gradient(180deg, #1a1200 0%, #0d0d0d 100%);
  ">
    [VISUAL ELEMENT]
  </div>

  <div class="watermark">EPICKOR.COM</div>
</div>
```

---

### Type D — 인용·강조 카드

텍스트 중심. 강력한 통계·인사이트·핵심 메시지 카드.

```html
<div class="card" style="padding:88px; position:relative;">

  <!-- 시리즈 번호 -->
  <div style="
    font-size:13px; font-weight:400;
    color:rgba(255,255,255,0.4); letter-spacing:0.1em; margin-bottom:48px;
  ">[N] / [TOTAL]</div>

  <!-- 포인트 컬러 대형 타이틀 -->
  <div style="
    font-size:48px; font-weight:900; color:#C9A84C;
    line-height:1.2; letter-spacing:-0.03em; margin-bottom:36px;
  ">[MAIN TEXT]</div>

  <!-- 구분선 -->
  <div style="width:100%; height:1px; background:rgba(255,255,255,0.15); margin-bottom:36px;"></div>

  <!-- 본문 -->
  <div style="
    font-size:18px; font-weight:400; color:rgba(255,255,255,0.85);
    line-height:1.85; letter-spacing:-0.01em; word-break:keep-all;
  ">[BODY TEXT]</div>

  <!-- 우하단 Gold 장식 -->
  <div style="
    position:absolute; bottom:-60px; right:-60px;
    width:280px; height:280px;
    background:#C9A84C; transform:rotate(45deg); opacity:0.07;
  "></div>

  <div class="watermark">EPICKOR.COM</div>
</div>
```

---

## CSS 배경 그라데이션 팔레트

| 주제 | 그라데이션 |
|------|-----------|
| 문화·사회 | `linear-gradient(135deg, #1a1200 0%, #2d1f00 50%, #111111 100%)` |
| 음식·여행 | `linear-gradient(135deg, #0d1a0d 0%, #1a2d1a 50%, #0d0d0d 100%)` |
| K-pop·엔터 | `linear-gradient(135deg, #1a001a 0%, #2d002d 50%, #0d0d0d 100%)` |
| 데이터·분석 | `linear-gradient(135deg, #0d1b2a 0%, #1b263b 50%, #0d0d0d 100%)` |
| 뷰티·라이프 | `linear-gradient(135deg, #1a0d0d 0%, #2d1a1a 50%, #0d0d0d 100%)` |
| CTA·마무리 | `linear-gradient(135deg, #111111 0%, #1a1a1a 100%)` |

---

## 이미지 사용 규칙

- Photo-first gate:
  - Real-world/high-visual topics must use actual photos by default. Weddings, food, venues, travel, shopping, beauty, products, and places should normally use photos on all 7 cards.
  - If local post images are missing, weak, text-heavy, or repetitive, search Pexels or another license-safe source before using graphic-only visuals.
  - SVG/graphic-only cards are allowed only when a relevant photo cannot be found or the representative explicitly approves that style for the current task.
  - Reject visibly non-Korean locations, packaging, streets, or interiors for Korea explainers unless the card is making an international comparison.
  - Crop or edit text-heavy frames so embedded captions/UI text do not compete with the card copy.
  - Final approval requires `visual-review.md`: average Visual Fit Score >=90/100, no card below 88/100.

- 배경 이미지: Pexels에서 소싱, `output/cardnews/{slug}/images/`에 로컬 저장
- 상대경로로만 참조: `images/pexels_card_01.jpg`
- opacity: `0.30~0.50` (텍스트 가독성 우선)
- 오버레이 필수: `linear-gradient(180deg, rgba(17,17,17,0.2), rgba(17,17,17,0.8))`
- **외부 URL 직접 사용 금지** (Playwright에서 빈 박스가 됨)
- 텍스트·로고가 이미 들어간 이미지 사용 금지

---

## 품질 규칙

### 필수 확인 사항 (PNG 기준)
- [ ] 텍스트가 카드 경계 밖으로 나가지 않음
- [ ] 텍스트 겹침 없음
- [ ] 워터마크 `EPICKOR.COM` 우하단에 있음
- [ ] 카드 크기 1080×1080px
- [ ] 영어 단어 중간에서 줄바꿈 없음

### 금지 사항
- 카드 크기 이탈
- 외부 이미지 URL (`https://...`) HTML에 남기기
- 3가지 이상 컬러 혼용
- 5줄 이상 연속 텍스트 (비주얼 장치 없이)
- 모든 카드에 같은 레이아웃 반복

---

## 슬라이드 구성 가이드

| 순서 | 타입 | 역할 |
|------|------|------|
| 1 (커버) | Type A | 제목 + 핵심 훅 |
| 2~3 | Type B or D | 배경·맥락 설명 |
| 4~6 | Type C or B | 핵심 포인트 (섹션별) |
| 7~8 | Type D | 놀라운 사실·통계 |
| 마지막 | Type A | CTA + EPICKOR.COM |
