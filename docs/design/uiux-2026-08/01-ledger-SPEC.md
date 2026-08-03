# A안 — The Ledger (검증 원장) 구현 스펙

목업: `01-ledger.html` (이 파일 하나로 데스크톱/모바일 반응형 전부 표현)

## 콘셉트 한 줄

**"크롬(화면 골격) 자체가 증거를 나른다."**
잉크·순백·단일 적색·헤어라인 룰. 날짜 찍힌 검증 칩과 모노스페이스 가격이
카드·표·본문 어디에나 붙는다. 조용하지만, 어떤 페이지를 열어도
"이 사이트는 확인하고 쓴다"가 화면만으로 전달된다.

## 디자인 토큰

```css
:root{
  --ink:      #131312;  /* 텍스트·룰·표 헤더 */
  --paper:    #FFFFFF;  /* 바탕 */
  --faint:    #F7F6F2;  /* 아티클 밴드·호버 (웜 뉴트럴) */
  --rule:     #E5E2DB;  /* 헤어라인 */
  --mute:     #6B6862;
  --red:      #C8102E;  /* 유일한 강조색 — 태극기 적색 계열 */
  --red-deep: #A00D25;  /* 호버 */
}
```

**색 규칙: 강조색은 red 하나다.** 섹션별 색(파랑/핑크/보라/초록)은 전부 폐지.
섹션 구분은 색이 아니라 `kicker`(모노 캡스 라벨)가 한다.

## 타이포그래피

| 역할 | 서체 | 지금 코드에서 바꿀 것 |
|---|---|---|
| 디스플레이(제목·로고) | **Newsreader** 600/800 (+ Noto Serif KR 600/900 한글) | `font-serif`(=Times 기본값) 전면 대체 |
| UI·본문 | **Inter** 400/600/700/800 | 유지 (이미 로드 중) |
| 데이터(날짜·가격·킥커·메타) | **IBM Plex Mono** 500/600 | 신규 — `tabular-nums` 필수 |

- next/font로 3종 self-host: `Newsreader`, `IBM_Plex_Mono`, `Noto_Serif_KR`(subset 최소화).
- `globals.css:12-13`의 죽은 `--font-geist-*` 토큰 제거.

## 시그니처 디바이스

1. **팩트 칩 `.chip`** — 흰 바탕, 1px rule 보더, 모노 10.5px, 레터스페이싱 .12em,
   앞에 6px 빨간 점. 변형 `.chip.plain`은 검은 점.
   문안 규칙: `PRICES CHECKED AUG 2026` / `LAST UPDATED AUG 2026` / `SOURCED IN KOREAN`
   / `1–2 HOURS`. **홈 카드·허브 카드·아티클 메타 전부에 배치** — 지금은 허브에만 있는
   검증 신호를 사이트 전역 UI로 승격하는 것이 이 안의 핵심.
2. **가격 조각 `.price`** — IBM Plex Mono 600, red, `tabular-nums`. 본문 인라인·칩 안·표 안 공통.
3. **원장 표 `table.ledger`** — 잉크색 헤더 행(흰 모노 캡스), 헤어라인 행 구분,
   품명 셀에 한글 병기 서브라인. caption은 모노 캡스로 `THE LEDGER — VERIFIED AUG 2026`.
4. **한글 가니시** — 제목 아래 `Noto Serif KR` 한 줄(예: 리드의 `안성탕면 대 신라면 —`),
   허브 카드의 `서울, 동네별로`. Korea-first 신호를 UI 언어로.

## 컴포넌트 매핑 (수정 대상 파일)

| 화면 요소 | 목업 클래스 | 실제 코드 대상 |
|---|---|---|
| 유틸리티 바(날짜·검증 문구) | `.utility` | `app/layout.tsx` header 위에 신규 |
| 마스트헤드+내비 | `.masthead` `nav.main` | `app/layout.tsx:41-91` 교체. 내비 7개로 축소(Latest 끝), 호버는 red 밑줄 단일화. 모바일 햄버거 신규(현 가로스크롤+배지 잘림 버그 해소) |
| 리드 스토리 | `.lead` | `app/page.tsx` hero 영역(OverlayStoryCard 대체) — 사진 위 텍스트 오버레이 폐지, 사진과 텍스트 분리 |
| 스토리 리스트 | `.story` | `app/page.tsx` secondary/popular — 카드 대신 룰 구분 리스트 |
| TODAY IN KOREA | `.today` | `PopularRail` — 세리프 대형 번호, 썸네일 제거(현재 판독불가 카드뉴스 축소판 문제 해소) |
| 가이드 카드 | `.guides .guide` | `app/guides/page.tsx`·홈 타일 — 보더 그리드, 하단에 칩+개수 |
| 아티클 헤더 | `.article` | `app/blog/[slug]` — 풀블리드 히어로 폐지, 제목 선행(폴드 문제 해소), 메타 칩 행 |
| 본문 표 | `table.ledger` | `globals.css .blog-content table` 스킨 |
| 어필리에이트 CTA | `.cta` | `.affiliate-inline-cta` 재스킨 — 노랑 박스 폐지, 잉크 보더+빨간 버튼 |
| 인용/핵심 | `.verdict` | `.section-belt` 계열 통합 — 좌측 3px red 보더 하나로 |

## 하지 않는 것

- URL·라우팅·헤딩 레벨·스키마·본문 마크다운 무변경.
- 본문 이미지 처리(`image-grid`, portrait 로직) 무변경.
- 색만 바뀌는 곳은 Tailwind 클래스 치환으로 처리(구조 변경 최소).

## 구현 순서 (단계별 배포 가능)

1. 토큰+폰트(next/font) → `globals.css` (반나절)
2. 헤더/푸터 + 모바일 메뉴 → `layout.tsx` (반나절)
3. 아티클 크롬(제목 선행·메타 칩·표·CTA) → 313편 일괄 적용 (1일)
4. 홈 재배치(리드/스토리/투데이/가이드) (1일)
5. 허브 3종 스킨 정합 (반나절)

## 목업에서 확인된 주의점

- 모바일 유틸리티 바 문구가 길면 줄바꿈 — 구현 시 모바일에서는 날짜만 남길 것.
- `.price`의 en-dash(–)가 취소선처럼 보일 수 있음 → 범위 표기는 `1,200–1,900` 대신
  칩 분리 또는 `~` 사용 검토.
