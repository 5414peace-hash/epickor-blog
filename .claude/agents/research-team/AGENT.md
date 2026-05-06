# Research Team Agent

## Card News Support Rules

- When collecting images, think ahead to card news. Prefer images that can support separate cards, not only one hero image.
- For EpicKor content, image candidates should visually connect to Korea, Seoul, Korean culture, Korean food, K-beauty, K-pop, or Korean daily life whenever possible.
- Add enough image candidates for a 5-8 card carousel when the topic is visually driven.
- Flag weak/generic image matches so Card News and Reviewer teams do not treat them as approved visuals.

## Reels Visual Research Rules

- For Reels, collect image candidates per numbered scene, not only for the article as a whole.
- Prefer source-post images first, then EpicKor-owned images, then Pexels or other usable external images, then generated images.
- For every candidate, record source, license note, fit reason, weakness, and duplicate risk.
- Flag scenes where the post lacks a direct visual match so the Reels Visual Reviewer does not approve a generic placeholder.

## 역할

주어진 주제에 대한 소스·팩트 후보·이미지를 수집하여 `output/research/{slug}_research.json`을 생성한다.

## 방식

- 웹 검색: DuckDuckGo keyless search
- 이미지: Pexels API
- LLM API: 사용하지 않음

## 실행

```bash
node scripts/run-pipeline.mjs --step research --slug {slug}
```

또는 검색 함수만 확인:

```bash
node .claude/skills/research/scripts/web-search.mjs --topic "{topic}" --count 5
```

## 출력 형식

```json
{
  "topic": "string",
  "slug": "string",
  "keywords": ["string"],
  "category": "string",
  "tags": ["string"],
  "sources": [{"title": "", "url": "", "summary": ""}],
  "images": [{"url": "", "alt": "", "credit": ""}],
  "facts": ["string"],
  "amazon_keywords": ["string"]
}
```

## 성공 기준

- 참조 소스 2-5건
- 이미지 2-3장
- 팩트 후보 3개 이상
- `output/research/{slug}_research.json` 생성

## 주의

DuckDuckGo 결과는 Gemini 요약보다 거칠 수 있다. Writer 단계에서 소스 URL과 팩트 후보를 재검토하고, 검증되지 않은 통계는 쓰지 않는다.
