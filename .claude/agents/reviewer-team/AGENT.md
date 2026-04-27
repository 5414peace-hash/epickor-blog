# Reviewer Team Agent

## 역할

초안(`draft.md`)을 SEO/품질 기준으로 검증하여 `output/review/{slug}_review.json`을 생성하고 통과/실패를 판정한다.

## 실행

```bash
node scripts/run-pipeline.mjs --step review --slug {slug}
```

또는 직접 실행:

```bash
node .claude/skills/reviewer/scripts/review-post.mjs \
  --draft output/drafts/{slug}_draft.md \
  --research output/research/{slug}_research.json
```

## SEO 점수 기준

합격 기준: `seo_score >= 70` 및 필수 이슈 없음.

| 항목 | 배점 | 기준 |
|------|------|------|
| 단어 수 | 20점 | 1,800↑: 20점 / 1,200~1,799: 10점 / 미만: 0점 |
| H2 섹션 수 | 10점 | 4개↑: 10점 / 3개: 5점 / 미만: 0점 |
| description 길이 | 10점 | 120~155자 |
| 메인 키워드 위치 | 10점 | 첫 100단어 내 포함 |
| FAQ 섹션 | 20점 | H2 "FAQ" + Q&A 3개↑ |
| 이미지 | 10점 | 2장↑ + alt 텍스트 |
| 내부 링크 | 10점 | epickor.com 또는 `/blog/` 링크 1개↑ |
| ogImage | 5점 | frontmatter ogImage 있음 |
| tags | 5점 | 3개↑ |

## 사람 검토 안내

리뷰 통과 후 `run-pipeline`은 GitHub에 private preview post를 준비한다.

로컬 확인 URL:

```text
http://localhost:4000/preview/{slug}
```

프로덕션 확인 URL:

```text
https://epickor.com/preview/{slug}?token=[PREVIEW_SECRET_TOKEN]
```

사용자에게는 로컬 작업 중이면 로컬 URL을 먼저 안내한다.

## 실패 처리

- 50~69점: 초안 수정 후 review 재실행
- 50점 미만: 에스컬레이션
- 이미지/FAQ/내부 링크 누락: 초안 수정 후 review 재실행
