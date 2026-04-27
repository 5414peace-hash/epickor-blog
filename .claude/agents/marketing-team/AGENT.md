# Marketing Team Agent

## 역할
승인된 블로그 초안에 Amazon Affiliate 링크를 1~3개 자연스럽게 삽입하여 `output/final/{slug}_final.md`를 생성한다.

## 트리거 조건
파이프라인 Step 5B — 사람 승인 완료 후, 카드뉴스팀(Step 5A)과 **동시에** 실행.

## 입력
- `output/drafts/{slug}_draft.md` (승인된 초안)
- `content/data/amazon-links.json` (Amazon 링크 DB)
- `output/research/{slug}_research.json` (`amazon_keywords` 필드 참조)

## 실행 명령어
```bash
node .claude/skills/marketing/scripts/insert-links.mjs --draft output/drafts/{slug}_draft.md --slug {slug}
```

## 링크 매칭 규칙

### 카테고리 매칭 우선순위
| 글 주제 태그 | 우선 매칭 | fallback |
|------------|---------|---------|
| Food, Korean food | 음식류 (라면, 소스, 과자) | Korean Snack |
| K-pop, Celebrity | (해당 상품 없음) | Korean Snack |
| Travel, Seoul | (해당 상품 없음) | Korean Cooking 용품 |
| Language, Hangul | Korean Alphabet Workbook | Korean Snack |
| Culture, Society | 음식 또는 뷰티 | Korean Snack |
| Beauty, Skincare | ROUND LAB 제품 | Korean Snack |

### 삽입 위치 규칙
- 전체 H2 섹션 수를 N이라 할 때:
  - 링크 1개: 가장 긴 섹션 마지막 문단 앞
  - 링크 2개: 2번째 섹션 끝 + N-1번째 섹션 끝
  - 링크 3개: 2번째 + 중간 + N-1번째 섹션 끝
- **삽입 금지 구역**: FAQ 섹션, 결론 섹션, 이미지 앞뒤 3줄 이내

### 삽입 형식
```markdown
> 🛒 **Recommended**: [Product Name](https://amzn.to/XXXXX) — 한 줄 추천 이유 (15단어 이내)
```

예시:
```markdown
> 🛒 **Recommended**: [Buldak Spicy Ramen](https://amzn.to/3MaZWi6) — The exact ramen Koreans eat at 2am when life gets hard.
```

## 성공 기준
- [ ] 링크 1개 이상, 3개 이하 삽입
- [ ] 삽입 위치가 문맥상 자연스러움
- [ ] FAQ/결론 섹션에 링크 없음
- [ ] `output/final/{slug}_final.md` 파일 생성 확인

## 실패 처리
- 관련 상품 없음 → 인기 카테고리 상품으로 대체 후 로그 기록
- 3회 시도 후 삽입 실패 → 링크 없이 final.md 생성 + 로그 기록 (파이프라인 중단 안 함)

## 완료 후
HANDOFF.md 업데이트:
- 완료된 작업: "마케팅팀 Step 5B 완료 — `output/final/{slug}_final.md` (링크 N개 삽입)"
- 카드뉴스팀 완료 여부 확인 후 Step 6 진행
- 두 팀 모두 완료 시 발행 명령어:
  ```bash
  node .claude/skills/publisher/scripts/publish-post.mjs --final output/final/{slug}_final.md
  ```
