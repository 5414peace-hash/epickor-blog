# Card News Team Agent

Before producing or reviewing card news, read `.claude/skills/cardnews/epickor_cardnews_quality_standard.md`. That file is the reusable EpicKor-level quality bar for this project and for other agents/projects that want to learn this card-news workflow.

## Card News Visual Brand Rules

- Every card must have a relevant image. For real-world/high-visual topics, photo-first is mandatory; SVG-only or graphic-only carousels are not acceptable unless the representative explicitly approves that exception in the current task.
- Use the post's own images first. If the post lacks enough suitable images, source usable external photos before falling back to generated/graphic visuals. Pexels or other license-safe sources should be searched when the local assets are missing, weak, too text-heavy, or too repetitive.
- Avoid generic or misleading visuals. For EpicKor, prefer Korea, Seoul, Korean culture, Korean food, K-beauty, K-pop, or Korean daily-life context where relevant.
- For Korea explainers, image selection is Korea-first. Prefer visibly Korean locations, products, signage, packaging, or source pages that explicitly describe the image as taken in South Korea.
- Reject images that are clearly from another country when the card is explaining Korea. If no Korean-specific image exists, use a culturally neutral close-up, generated/owned visual, or a documented crop instead of foreign-looking stock. Graphic-only substitutes are a last resort and must be recorded.
- For a 7-card high-visual carousel, use photos on at least 5 cards; food, venues, travel, weddings, shopping, beauty, products, and places should normally use photos on all 7 cards.
- Reject text-heavy source frames unless cropped or edited so embedded captions, UI labels, or unrelated words do not compete with the card copy.
- Before final presentation, produce `visual-review.md` with card-by-card Visual Fit Scores. Do not present the carousel unless the average is at least 90/100 and no individual card is below 88/100.
- Every card must include a concise `kicker:` line that gives the Korea/EpicKor angle, such as `KOREA SPF GUIDE`, `SEOUL SKINCARE RULE`, or `K-BEAUTY TEXTURE MAP`.
- Every rendered card must show `EPICKOR.COM` as the watermark text. Do not use only `EpicKor` as the watermark label.
- The first card must create curiosity strong enough to make the user swipe to card 2.
- Card 01 cover standard: use the current approved bright grid-cover treatment by default (`layout: F`, centered hook, conservative safe area, `image_opacity: 0.88`). This keeps the background photo about 10 percentage points more visible than the older `0.78` cover baseline while preserving title readability. Do not lower Card 01 back to the older opacity unless the representative explicitly asks.
- Use large mobile-readable typography. A card is not done if it only looks readable at full desktop size.
- After rendering, visually inspect all PNGs, not only `script.md`.

## 역할

승인된 블로그 초안을 바탕으로 Instagram용 카드뉴스(5-8장, 1080x1080 PNG)를 만든다.

## 방식

- `generate-slides.mjs`는 더 이상 Gemini를 호출하지 않는다.
- 해당 스크립트는 `output/cardnews/{YYYY-MM-DD}_{slug}/script-brief.md`만 생성한다.
- 실제 카드뉴스 스크립트는 Claude/Codex가 `output/cardnews/{YYYY-MM-DD}_{slug}/script.md`에 직접 작성한다.
- PNG 렌더는 `html-to-png.py`가 담당한다.

## 실행 순서

### 1. 카드뉴스 브리프 생성

```bash
node .claude/skills/cardnews/scripts/generate-slides.mjs \
  --draft output/drafts/{slug}_draft.md \
  --research output/research/{slug}_research.json \
  --slug {slug}
```

출력:

- `output/cardnews/{YYYY-MM-DD}_{slug}/script-brief.md`

### 2. 카드뉴스 스크립트 직접 작성

작성 대상:

- `output/cardnews/{YYYY-MM-DD}_{slug}/script.md`

형식은 `script-brief.md`의 템플릿을 따른다.

### 3. PNG 렌더

```bash
python .claude/skills/cardnews/scripts/html-to-png.py --slug {slug}
```

출력:

- `output/cardnews/{YYYY-MM-DD}_{slug}/card_01.png`
- `output/cardnews/{YYYY-MM-DD}_{slug}/card_02.png`
- ...

## 성공 기준

- 카드 5장 이상
- 각 PNG 1080x1080
- 텍스트 잘림 없음
- 커버와 클로징 카드 포함
- research/draft에 없는 사실 추가 금지
