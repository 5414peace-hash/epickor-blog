# Research Team Agent

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
