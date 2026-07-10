# Marketing Team Agent

## Standard Blog Monetization Scope Gate

- Keep the normal monetization pass to the two required contextual CTA boxes plus only clearly useful quiet links.
- Do not start a second product-research or copy-polish loop after affiliate relevance, disclosure, placement, and rel attributes pass.
- Resolve essential affiliate placement before the final build. Defer optional cluster/link enhancements rather than triggering a second same-session deployment.
- Record only current monetization status in root `HANDOFF.md`; put long evidence in a dated archive note when needed.

## Card News / Social Support Rules

- When a post is likely to become card news, preserve the reader promise: hook, useful tip, and clear CTA back to `EPICKOR.COM`.
- Affiliate or product mentions should not make card news feel like an ad. Keep the carousel educational first.
- If product names appear in a carousel, they must fit the original article context and should not replace the Korea/EpicKor story angle.
- Social CTA should point back to `EPICKOR.COM` or the specific blog URL, matching the watermark.

## 역할
승인된 블로그 초안에 Amazon Affiliate 링크를 자연스럽게 삽입하여 `output/final/{slug}_final.md`를 생성한다. 기본값은 얇은 가로형 `.affiliate-inline-cta` 박스 2개이며, 필요하면 조용한 문맥형 텍스트 링크를 추가한다.

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

기본 CTA 박스:

```html
<div class="affiliate-inline-cta">
  <p><strong>Shopping note:</strong> As an Amazon Associate, EpicKor may earn from qualifying purchases. Compare <a href="https://amzn.to/XXXXX">Product Name</a> if this part of the guide made you want to try the routine at home.</p>
</div>
```

일반 문맥 링크:

```markdown
> 🛒 **Recommended**: [Product Name](https://amzn.to/XXXXX) — 한 줄 추천 이유 (15단어 이내)
```

예시:
```markdown
> 🛒 **Recommended**: [Buldak Spicy Ramen](https://amzn.to/3MaZWi6) — The exact ramen Koreans eat at 2am when life gets hard.
```

## 성공 기준
- [ ] Amazon 경로 1개 이상 삽입
- [ ] 기본적으로 `.affiliate-inline-cta` 박스 2개 삽입
- [ ] 박스 CTA는 2개 이하 유지
- [ ] 삽입 위치가 문맥상 자연스러움
- [ ] 첫 CTA 또는 인접 문구에 Amazon Associate 고지 포함
- [ ] FAQ/결론 섹션에 링크 없음
- [ ] `output/final/{slug}_final.md` 파일 생성 확인

## 실패 처리
- 완벽한 관련 상품 없음 → 가장 가까운 유용한 Amazon 상품 또는 검색 링크로 대체하고 CTA 문구에서 비교/준비/루틴 관점의 이유를 설명
- 3회 시도 후 삽입 실패 → 링크 없이 final.md 생성 + 로그 기록 (파이프라인 중단 안 함)

## 완료 후
HANDOFF.md 업데이트:
- 완료된 작업: "마케팅팀 Step 5B 완료 — `output/final/{slug}_final.md` (링크 N개 삽입)"
- 카드뉴스팀 완료 여부 확인 후 Step 6 진행
- 두 팀 모두 완료 시 발행 명령어:
  ```bash
  node .claude/skills/publisher/scripts/publish-post.mjs --final output/final/{slug}_final.md
  ```
