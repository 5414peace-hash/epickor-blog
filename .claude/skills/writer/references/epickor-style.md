# EpicKor Writing Style Guide v1.0

## 브랜드 포지셔닝

EpicKor는 한국 문화의 "인사이더 친구" 포지션이다.
독자는 한국에 관심은 많지만 아직 잘 모르는 영어권 외국인.
우리는 관광 가이드북이 아니라, 한국을 잘 아는 친구가 솔직하게 알려주는 느낌으로 쓴다.

## 핵심 원칙

### 1. 훅(Hook) — 첫 100단어가 전부다

독자가 스크롤을 멈추게 만드는 문장으로 시작한다.

좋은 훅 패턴:
- "Most foreigners get this completely wrong..."
- "Here's what nobody tells you about [topic]..."
- "I've seen so many tourists make this mistake..."
- "You've probably heard of [X], but did you know..."
- 충격적 통계: "Over 73% of Koreans do [X] every single day."

나쁜 훅 패턴 (절대 금지):
- "Korea is a fascinating country..."
- "In this article, we will explore..."
- "Have you ever wondered..."  ← 너무 흔함

### 2. 톤 — 친구가 카페에서 말하듯

- 2인칭(you) 적극 사용: "You'll notice...", "Trust me, you want to..."
- 짧은 문장과 긴 문장을 섞는다. 단조롭지 않게.
- 줄임말 자연스럽게: "it's", "you'll", "don't"
- 가끔 한국어 단어 그대로 사용 + 설명: "The concept of nunchi (눈치) is..."
- 유머는 자연스럽게, 억지로 넣지 않는다

### 3. 구조 — 독자가 스캔할 수 있게

- H2 섹션 4~6개 (각 400~700단어)
- 각 H2는 명확한 약속을 제목에 담는다: "Why Koreans Never Split the Bill" (O) / "Payment Culture" (X)
- 불릿 리스트는 섹션당 최대 1개, 5항목 이하
- 굵은 텍스트(**bold**)는 핵심 키워드에만, 남용 금지

### 4. SEO/AEO/GEO 필수 요소

- **메인 키워드**: 첫 100단어 내 자연스럽게 1회 삽입
- **FAQ 섹션**: 마지막에서 두 번째 H2로 배치. 최소 3개 질문-답변 형식
  - 형식: "**Q: What is [X]?**" → "Simply put, [X] is..."
  - GEO 효과: AI 검색 답변에 인용되기 좋은 형식
- **AEO 문장**: 본문에 2~3개. "What makes [X] unique is...", "[X] refers to..."

### 5. 이미지 캡션

- 모든 이미지에 alt 텍스트 필수
- 형식: `![descriptive alt text](image_url)`
- 캡션 텍스트는 이미지 바로 아래 이탤릭체: `*Caption describing the image*`

### 6. 마무리 (결론)

- 요약은 최소화, 대신 독자에게 "다음 행동"을 제안
- CTA 예시: "Next time you're in Seoul, try...", "Want to dive deeper? Check out..."
- 마지막 문장은 기억에 남게: 짧고 강하게

### 7. 절대 금지 목록

- "In conclusion, we have explored..."
- 같은 키워드를 한 문단에 3번 이상 반복
- 수동태 남용
- 5줄 이상 연속 불릿 리스트
- 사실 확인 안 된 통계 인용 (research.json의 sources에 없는 내용)
- 500단어 미만 섹션 (H2 기준)

### 8. EpicKor 잘된 글 레퍼런스 키워드 (GSC 클릭 높은 주제 패턴)

- 한국 사회 개념 설명: "samchon", "pali-pali culture", "nunchi"
- 한국 교육/입시: "SKY university", "수능"
- 음식 비교: "pyongyang naengmyeon vs naengmyeon"
- 연예인 관련: "wonyoung ism"
→ 이 패턴들을 새 주제 선정에 참조한다

## 목표 길이 & 구조

| 요소 | 기준 |
|------|------|
| 총 단어 수 | 1,900~2,300단어 |
| H2 섹션 수 | 4~5개 |
| 섹션당 단어 | 300~500단어 |
| 이미지 | 2~3장 (Pexels, 본문 삽입) |
| FAQ 섹션 | 필수 (Q&A 3개 이상) |
| description | 120~155자 |
| tags | 3개 이상 |
| ogImage | 첫 번째 Pexels 이미지 URL |

## Frontmatter 형식

```markdown
---
title: "Title Here (SEO optimized, 50-60 chars)"
slug: "166"
date: "2026-04-24"
visibility: "private"
publishAt: ""
description: "120~155자 메타 설명. 메인 키워드 포함."
ogImage: "https://images.pexels.com/photos/XXXXX/..."
tags: ['Korea', 'Culture', 'Travel']
author: "EpicKor"
---
```

> **visibility**: 발행 전 = `private` (미리보기 전용), 승인 후 = `public`
