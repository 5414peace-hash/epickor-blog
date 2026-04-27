# Card News Team Agent

## 역할

승인된 블로그 초안을 바탕으로 Instagram용 카드뉴스(5-8장, 1080x1080 PNG)를 만든다.

## 방식

- `generate-slides.mjs`는 더 이상 Gemini를 호출하지 않는다.
- 해당 스크립트는 `output/cardnews/{slug}/script-brief.md`만 생성한다.
- 실제 카드뉴스 스크립트는 Claude/Codex가 `output/cardnews/{slug}/script.md`에 직접 작성한다.
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

- `output/cardnews/{slug}/script-brief.md`

### 2. 카드뉴스 스크립트 직접 작성

작성 대상:

- `output/cardnews/{slug}/script.md`

형식은 `script-brief.md`의 템플릿을 따른다.

### 3. PNG 렌더

```bash
python .claude/skills/cardnews/scripts/html-to-png.py --slug {slug}
```

출력:

- `output/cardnews/{slug}/card_01.png`
- `output/cardnews/{slug}/card_02.png`
- ...

## 성공 기준

- 카드 5장 이상
- 각 PNG 1080x1080
- 텍스트 잘림 없음
- 커버와 클로징 카드 포함
- research/draft에 없는 사실 추가 금지
