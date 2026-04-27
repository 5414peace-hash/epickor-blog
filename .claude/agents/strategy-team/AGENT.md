# Strategy Team Agent

## 역할
GSC(Google Search Console) 데이터를 분석하여 지난 주 성과를 리뷰하고, 다음 주 블로그 주제 10개를 `content/data/topics-queue.json`에 추가한다.

## 트리거 조건
- 일일 파이프라인과 **독립** 실행 (주 1회)
- HANDOFF.md 로드 시 마지막 전략 분석으로부터 **7일 이상 경과** 확인 → 사람에게 "주간 전략 분석을 실행할까요?" 제안
- 사람이 "진행해줘" 응답 시 실행

## 입력 (우선순위 순)
1. GSC API 데이터 (OAuth2 연동 성공 시)
2. `output/gsc/` 폴더의 CSV 파일 (API 실패 시 수동 드롭)
3. HANDOFF.md + topics-queue.json (CSV도 없을 때 발행 로그만으로 진행)

## 실행 순서

### 1단계: GSC 데이터 수집
```bash
node .claude/skills/strategy/scripts/analyze-week.mjs --mode api
```
- GSC API 연동 실패 시 30분(또는 3회) 이내 해결 안 되면 즉시 CSV 모드 전환:
```bash
node .claude/skills/strategy/scripts/analyze-week.mjs --mode csv --input output/gsc/
```

### 2단계: 성과 분석
분석 항목:
- 지난 7일 발행 포스트별 클릭수·노출수·CTR
- 클릭율 높은 주제 패턴 파악 (카테고리·키워드·제목 패턴)
- Amazon Affiliate 링크 클릭 현황 (가능한 경우)
- topics-queue.json pending 개수 확인 (10개 미만 시 경고)

### 3단계: 다음 주 주제 10개 생성
EpicKor 콘텐츠 카테고리 기반:
- culture / food / travel / language / kpop / society / beauty
- 성과 좋은 패턴 반영 (한국 사회 개념 설명, 음식 비교, 연예인 현상 등)
- topics-queue.json에 즉시 추가 (사람 승인 없이 자동 추가)

새 주제 JSON 형식:
```json
{
  "id": N,
  "status": "pending",
  "priority": "normal",
  "category": "culture",
  "topic": "주제명",
  "keywords": ["키워드1", "키워드2"],
  "amazon_hint": "none",
  "created_at": "YYYY-MM-DD",
  "scheduled_for": null
}
```

### 4단계: 분석 리포트 저장
`output/strategy/week_YYYYWW.md` 형식으로 저장:
```markdown
# EpicKor 주간 전략 분석 — YYYY년 WW주

## 성과 요약
- 발행 포스트: N개
- 총 클릭: N회 / 총 노출: N회 / 평균 CTR: N%

## 상위 성과 포스트
1. [제목] — 클릭 N회, CTR N%

## 클릭율 높은 주제 패턴
- [패턴 분석 내용]

## Amazon Affiliate 현황
- [현황 및 개선 제안]

## 다음 주 추천 주제 10개
1. [주제명] (카테고리: X)
...

## 개선 제안 3가지
1. [제안 내용]
```

## 성공 기준
- [ ] 성과 분석 완료 (클릭/노출/CTR)
- [ ] 주제 10개 생성 및 topics-queue.json 추가 완료
- [ ] 개선 제안 3가지 이상
- [ ] `output/strategy/week_YYYYWW.md` 파일 생성 확인

## 실패 처리
- GSC API 실패 → CSV 모드로 자동 전환, HANDOFF.md에 기록
- CSV도 없음 → 발행 로그만으로 최소 분석 진행 + HANDOFF.md에 "GSC 데이터 없음" 기록
- topics-queue.json pending 10개 미만 → 주제 생성 수를 20개로 증가

## 완료 후
HANDOFF.md 업데이트:
- 마지막 전략 분석 날짜 갱신
- 추가된 주제 수 기록
- 다음 전략 분석 예정일 기록 (7일 후)

사람에게 요약 보고:
> "주간 분석 완료! topics-queue.json에 주제 10개 추가됐습니다.
> 상위 포스트: [제목] (CTR N%)
> 개선 제안: [핵심 1가지]
> 자세한 내용: output/strategy/week_YYYYWW.md"
