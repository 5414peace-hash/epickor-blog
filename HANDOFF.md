# HANDOFF - EpicKor Agent Teams v2
# 최종 업데이트: 2026-04-27 06:49:58 | 업데이트한 에이전트: Reviewer -> 사람 검토 대기

---

## 최신 상태 - 2026-04-27

- 166번 글은 공개 발행 완료.
- Pexels 썸네일 표시 문제는 `next.config.ts`의 이미지 도메인 허용으로 해결됨.
- 로컬 `master`는 `origin/master`와 동기화했고, 자동화 개선 커밋 `4bd94d5`를 GitHub에 push 완료.
- `npm.cmd run build` 통과. 남은 경고는 `metadataBase` 미설정 경고뿐.
- 로컬 실행 산출물은 `.gitignore`에 추가함: `output/`, `.codex-deploy/`, `package-lock.json`, `.claude/settings.local.json` 등.
- 안전 보관 stash가 2개 남아 있음:
  - `stash@{0}`: 원격과 겹치던 로컬 160-165 글 파일
  - `stash@{1}`: 동기화 전 tracked 로컬 수정분
- 다음 글은 167번으로 시작했고, 비공개 preview 준비 완료.
- 167번 주제는 topics queue의 ID 8:
  `The Best Korean Dramas of 2026 That You're Missing Right Now`
- 167번 생성 결과:
  - research: `output/research/167_research.json`
  - writer brief: `output/drafts/167_writer-brief.md`
  - draft: `output/drafts/167_draft.md`
  - review: `output/review/167_review.json`
  - review 통과: SEO 100/100, 단어 수 1,900, 이미지 3장, FAQ 4개
  - 사용자 지적으로 사실/이미지 재검토 완료:
    - `Bloodhounds Season 2`는 추천 본문에서 제거
    - Netflix 공식/Tudum에서 확인되는 `Sold Out on You`로 대체
    - Pexels 이미지는 서울 풍경 이미지에서 TV/스트리밍/시청 분위기 이미지로 교체
  - GitHub private preview commit 완료: `content/blog/167.md`
  - 로컬 preview URL: `http://localhost:4000/preview/167`
  - production preview URL: `https://epickor.com/preview/167?token=[PREVIEW_SECRET_TOKEN]`
- 167번 작업 agent별 최종 역할:
  - Research Agent: DuckDuckGo/Pexels로 초기 소스와 이미지 후보 수집
  - Writer Agent: `167_writer-brief.md` 기준으로 초안 작성 후 Bloodhounds 제거, Sold Out on You 대체, 이미지 교체
  - Reviewer Agent: SEO/형식 자동 리뷰 실행, 사용자 지적 후 사실 검증/이미지 적합성 수동 재검토 규칙 보강
  - Publisher Agent: 수정된 167번 글을 GitHub private preview로 재반영
  - Human Reviewer: Bloodhounds와 이미지 부적합 문제 발견
- 다음 액션: 사용자가 preview 확인 후 승인하면 `node scripts/run-pipeline.mjs --approve 167` 실행.

---

## 현재 결론

Gemini API 의존성을 제거하는 방향으로 전환했다. 앞으로 글 작성과 카드뉴스 문안 작성은 Claude/Codex가 직접 수행하고, Node 스크립트는 리서치 수집·브리프 생성·리뷰·발행 보조만 담당한다.

---

## 프로젝트 핵심 정보

| 항목 | 내용 |
|------|------|
| 사이트 | epickor.com - 한국 문화/여행/음식/K-pop 영어 블로그 |
| GitHub | 5414peace-hash/epickor-blog (branch: master) |
| 배포 | Vercel - master push 시 자동 배포 |
| 스택 | Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 |
| 글 작성 | Claude/Codex 직접 작성 |
| 리서치 | DuckDuckGo keyless search + Pexels API |
| 수익화 | Amazon Affiliate |
| 현재 최신 슬러그 | 166 -> 다음 신규 글: 167 |

---

## 완료된 전환 작업

- [x] `.claude/skills/research/scripts/web-search.mjs`
  - Gemini 호출 제거
  - `GEMINI_API_KEY` 요구 제거
  - DuckDuckGo HTML/Instant Answer 기반 keyless search로 변경

- [x] `.claude/skills/writer/scripts/generate-draft.mjs`
  - Gemini 초안 생성 제거
  - `output/drafts/{slug}_writer-brief.md` 생성 방식으로 변경
  - 실제 초안은 Claude/Codex가 `output/drafts/{slug}_draft.md`에 직접 작성

- [x] `.claude/skills/cardnews/scripts/generate-slides.mjs`
  - Gemini 카드뉴스 스크립트 생성 제거
  - `output/cardnews/{slug}/script-brief.md` 생성 방식으로 변경
  - 실제 카드뉴스 문안은 Claude/Codex가 `script.md`에 직접 작성

- [x] `scripts/run-pipeline.mjs`
  - `--slug` 처리 추가
  - `--step research|draft|review` 단독 실행 흐름 보정
  - 완전 자동 작성 대신 writer brief 생성 후 중지하도록 변경

- [x] `CLAUDE.md`, `.env.local.example`
  - Gemini 관련 안내 제거
  - API-free writing flow로 문서 갱신

- [x] Writer length 기준 변경
  - 기존 2,800단어대 글이 너무 길어 앞으로 1,900-2,300단어 목표
  - Reviewer 최소 단어 수 기준도 1,800단어로 조정

---

## Phase 6 테스트 결과

- [x] `node scripts/run-pipeline.mjs --step research --slug 166 --force`
  - 성공: `output/research/166_research.json`
  - DuckDuckGo 소스 5건 확보
  - 팩트 후보 5건 확보
  - Pexels 이미지 3장 확보

- [x] `node scripts/run-pipeline.mjs --step draft --slug 166`
  - 성공: `output/drafts/166_writer-brief.md`
  - 성공: `output/drafts/166_draft.md` 직접 작성 완료

- [x] `node scripts/run-pipeline.mjs --step review --slug 166`
  - 성공: `output/review/166_review.json`
  - SEO 점수 100/100
  - 단어 수 2,831
  - GitHub에 `content/blog/166.md` private preview post 커밋 완료

- [x] Preview route 로컬 확인
  - dev URL: `http://localhost:4000/preview/166`
  - HTTP 200 확인
  - 글 제목 렌더 확인
  - `Approve and publish` 버튼 렌더 확인

- [x] `npm.cmd run build`
  - 성공
  - 남은 경고: `metadataBase` 미설정 경고만 있음

- [x] 사람 승인 후 최종 발행
  - `node scripts/run-pipeline.mjs --approve 166`
  - Amazon 링크 삽입 완료: `output/final/166_final.md`
  - GitHub `content/blog/166.md` public 업데이트 완료
  - `topics-queue.json` ID 7 -> `done`
  - 공개 URL 확인: `https://www.epickor.com/blog/166` HTTP 200

- [x] 166번 썸네일 복구
  - `next.config.ts`에 `images.pexels.com` 허용 추가
  - GitHub master 직접 업데이트 커밋: `0ee2997a`
  - Vercel 이미지 최적화 URL HTTP 200 확인

- [x] 이번 프로세스 회고 후 재발 방지 보강
  - Reviewer Agent 문서의 단어 수 기준을 1,800단어로 통일
  - `run-pipeline.mjs`의 다음 slug 계산이 topics queue의 `generated_slug`도 보도록 수정
  - slug가 지정됐을 때 엉뚱한 `in_progress` 주제를 잡지 않도록 topic 선택 로직 수정
  - 리서치 소스 3건 미만 또는 이미지 2장 미만이면 파이프라인 중단
  - 일반 문화 글에는 관련도 낮은 Amazon 링크를 삽입하지 않도록 수정
  - topics queue ID 8을 `pending`으로 복구

---

## 다음에 해야 할 작업

- 다음 신규 글은 167번으로 진행
- 필요하면 166번 카드뉴스 생성:
  `node .claude/skills/cardnews/scripts/generate-slides.mjs --draft output/drafts/166_draft.md --research output/research/166_research.json --slug 166`

---

## 사람 검토 대기

- 슬러그: **167**
- draft 파일: `D:\dev\epickor-blog\output\drafts\167_draft.md`
- 로컬 미리보기 URL: http://localhost:4000/preview/167
- 프로덕션 미리보기 URL: https://epickor.com/preview/167?token=[PREVIEW_SECRET_TOKEN]
- 승인/거절: 위 URL에서 버튼 클릭
- 대기 시작: 2026-04-27 06:49:58

---

## 환경 변수

필요:

```bash
STUDIO_GITHUB_TOKEN=
PEXELS_API_KEY=
PREVIEW_SECRET_TOKEN=
```

불필요:

```bash
GEMINI_API_KEY=
GEMINI_MODEL=
```

---

## 현재 주의점

- `content/data/topics-queue.json`에서 7번은 `done` 처리됨. 8번은 `pending`으로 복구됨.
- DuckDuckGo 기반 리서치는 Gemini 검색보다 요약 품질이 약할 수 있다. 초안 작성 시 소스 URL과 팩트 후보를 반드시 사람이/Claude가 재검토해야 한다.
- 카드뉴스는 `script-brief.md` 생성 후 `script.md`를 직접 작성해야 PNG 렌더가 가능하다.
- production preview가 동작하려면 이번 로컬 코드 변경(`app/preview`, `app/api/preview`, `next.config.ts`, pipeline scripts 등)을 GitHub master에 반영해야 한다.
- 로컬 git은 현재 `origin/master`와 diverge 상태다. GitHub API로 직접 올린 166번 글과 `next.config.ts` 원격 커밋 때문에, 다음 코드 push 전에는 fetch/rebase 또는 별도 정리 커밋 전략이 필요하다.

---

## 진행률

| Phase | 상태 |
|-------|------|
| Phase 0: 기반 세팅 | 완료 |
| Phase 1: 핵심 스크립트 | Gemini 제거 방식으로 수정 완료 |
| Phase 2: 미리보기 시스템 | 완료 |
| Phase 3: AGENT.md | 완료 |
| Phase 4: 카드뉴스 | 브리프 생성 방식으로 수정 완료 |
| Phase 5: CLAUDE.md | 갱신 완료 |
| Phase 6: 전체 테스트 | 166번 발행 완료 |
