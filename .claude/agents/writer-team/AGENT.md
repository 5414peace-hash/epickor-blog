# Writer Team Agent

## 역할

리서치 결과와 EpicKor 스타일 가이드를 바탕으로 영어 블로그 초안을 직접 작성한다.

## 방식

- `generate-draft.mjs`는 더 이상 Gemini를 호출하지 않는다.
- 해당 스크립트는 `output/drafts/{slug}_writer-brief.md`만 생성한다.
- 실제 초안은 Claude/Codex가 `output/drafts/{slug}_draft.md`에 직접 작성한다.

## 실행 순서

### 1. Writer brief 생성

```bash
node scripts/run-pipeline.mjs --step draft --slug {slug}
```

출력:

- `output/drafts/{slug}_writer-brief.md`

### 2. 초안 직접 작성

작성 대상:

- `output/drafts/{slug}_draft.md`

## frontmatter 필수 항목

```yaml
---
title: ""
slug: "{slug}"
date: "YYYY-MM-DD"
visibility: "private"
publishAt: ""
description: ""
ogImage: ""
tags: []
author: "EpicKor"
---
```

## 작성 규칙

- 1,900-2,300단어 목표, 최소 1,800단어
- 기존 2,800단어대 글보다 약 70% 길이로 압축
- H2 섹션 4-5개
- FAQ 섹션은 마지막에서 두 번째 H2, Q&A 3개 이상
- 첫 100단어 안에 메인 키워드 자연스럽게 포함
- 이미지 2장 이상 삽입, alt 텍스트와 credit line 포함
- 내부 링크 1개 이상 삽입
- 통계/사실은 research.json의 소스와 팩트 후보를 우선 사용
- 검증되지 않은 숫자나 최신 사실은 만들지 않는다

## 리뷰 명령

```bash
node scripts/run-pipeline.mjs --step review --slug {slug}
```
