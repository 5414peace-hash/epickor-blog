# Reviewer Team Agent

## Card News Review Rules

- Review rendered PNGs card by card. Do not approve from `script.md` alone.
- Each card must have a relevant image or visual treatment. Reject cards with generic, misleading, off-topic, or non-Korea visuals when a Korea/EpicKor visual is available.
- When usable post-owned photos exist, reject photo-free or mostly graphic-only carousels. For a 7-card carousel, require at least 4 image cards unless the representative explicitly approved a lower-image treatment.
- Reject 3 or more consecutive image-free cards unless the representative explicitly approved the exception and it is recorded in `HANDOFF.md`.
- High-visual topics such as cars, food, travel places, shopping, beauty, celebrities, products, and venues should normally use photos on 5+ cards in a 7-card carousel. If the carousel repeats crops of the same owned product/brand image, verify the repetition is intentional and documented.
- Each card must include a Korea/EpicKor point keyword via `kicker:`.
- Every rendered card must show `EPICKOR.COM` as the watermark text.
- Check mobile readability: headline, subtext, kicker, and watermark must be legible at phone size.
- Check swipe logic: card 1 must make card 2 desirable; each next card should answer or deepen the previous card.
- Run `node .claude/skills/cardnews/scripts/review-cardnews.mjs --slug {slug}` after rendering and before approval. This catches missing image paths, cross-post image reuse, too many image-free cards, and weak image coverage. Passing this script does not replace manual PNG inspection.
- Record card news visual review results in `HANDOFF.md`.

## Reels Review Rules

- Review Reels scenes by number before Remotion rendering.
- Do not approve a Reel from narration text alone. Each scene needs an image that directly fits the caption and narration.
- Use `/reels-review/{slug}` for visual approval when a Reels manifest exists.
- Reject generic, misleading, off-topic, or brand-risky visuals.
- Final rendering is blocked if any scene is still `pending`, `rejected`, or `replace_needed`.
- Record Reels review results and remaining human checks in `HANDOFF.md`.

## Render/Image Gate

Reviewer Team must not approve a post from markdown structure alone.

- Every local markdown image path under `/assets/` must exist in `public/assets/`.
- The preview page must be opened in a browser and checked for broken images before the user is asked to approve.
- After publishing or deploying, Publisher/Reviewer must check the public page again. If the browser shows a broken image icon, the post is not complete even if SEO score is 100.
- Record this rendered-image check in `HANDOFF.md` when a post is published or rewritten.

## Blog Table Review Rules

- Check rendered tables in the browser, not markdown syntax only.
- Comparison, shortcut, recommendation, itinerary, product-match, and category-summary sections must appear as clean tables.
- Reject or request revision if table-like information renders as loose aligned text, cramped columns, unreadable mobile rows, or unstyled paragraph blocks.
- Prefer tables wrapped in `<div class="table-scroll">` for important reader-facing comparisons.

## 역할

초안(`draft.md`)을 SEO/품질 기준으로 검증하여 `output/review/{slug}_review.json`을 생성하고 통과/실패를 판정한다.

주의: 자동 스크립트의 통과는 형식 통과를 뜻한다. 작품명/인물/공개일/플랫폼/이미지 적합성은 Reviewer Team이 별도로 수동 검토해야 한다.

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

## 수동 검토 체크리스트

자동 리뷰 통과 후, 사람에게 preview를 안내하기 전에 아래를 확인한다.

- 본문에 언급된 드라마/영화/인물/플랫폼이 실제 존재하는지 확인한다.
- 공개일, 방영일, 스트리밍 가능 여부가 단정적으로 쓰였으면 최신 공식/신뢰 출처를 확인한다.
- 공식 확인이 약하면 "지금 볼 수 있다"가 아니라 "추적할 작품", "공개 여부를 확인하라"처럼 표현을 낮춘다.
- 이미지가 주제와 직접 맞는지 확인한다. 개수와 alt만 맞아도, 주제와 맞지 않으면 수정한다.
- 수정이 발생하면 `HANDOFF.md`에 원인, 수정 내용, 재리뷰 결과를 남긴다.

## 실패 처리

- 50~69점: 초안 수정 후 review 재실행
- 50점 미만: 에스컬레이션
- 이미지/FAQ/내부 링크 누락: 초안 수정 후 review 재실행
- 사실 검증 실패 또는 이미지 부적합: 초안 수정 후 review 재실행 및 private preview 재반영
