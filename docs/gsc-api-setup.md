# GSC API 연결 — 1회 설정 (약 10분)

**왜 하는가**: Search Console 웹 UI 내보내기는 **1,000행이 상한**이다. API는 요청당 **25,000행**을
주고 페이지네이션으로 하루 50,000행까지 간다. **우리가 볼 수 있는 쿼리 세계가 25배 넓어진다.**
지금 파이프라인에서 가장 큰 미충족 격차다. (`docs/keyword-selection-playbook.md` §1)

**비용**: 없음. 카드 등록도 필요 없다.
(카드가 필요한 건 BigQuery 대량 내보내기 쪽이고, 그건 별개 건이다.)

**방식**: 서비스 계정. OAuth 로그인 절차나 브라우저 인증이 없어서 스크립트가 그냥 돌아간다.

---

## 대표님이 하실 일 (5단계)

### 1. Google Cloud 프로젝트 생성
[console.cloud.google.com](https://console.cloud.google.com) → 상단 프로젝트 선택기 → **새 프로젝트**
→ 이름은 아무거나 (예: `epickor-gsc`) → 만들기.

무료이고 카드 안 물어본다.

### 2. Search Console API 활성화
좌측 메뉴 **API 및 서비스 → 라이브러리** → `Google Search Console API` 검색 → **사용 설정**.

### 3. 서비스 계정 만들기
**API 및 서비스 → 사용자 인증 정보** → 상단 **+ 사용자 인증 정보 만들기** → **서비스 계정**
→ 이름 아무거나 (예: `gsc-reader`) → **만들고 계속하기** → 역할은 지정 안 해도 됨 → **완료**.

### 4. JSON 키 내려받기
방금 만든 서비스 계정 클릭 → **키** 탭 → **키 추가 → 새 키 만들기 → JSON** → 만들기.
파일이 자동으로 다운로드된다.

**그 파일을 아래 경로에 이 이름으로 저장:**
```
D:\dev\epickor-blog\.gsc-service-account.json
```
> 이 파일은 `.gitignore`에 등록돼 있어서 절대 커밋되지 않는다. 확인 완료.
> 다만 이 키는 우리 Search Console 읽기 권한을 주는 것이므로 외부에 공유하면 안 된다.

### 5. Search Console에 그 계정을 사용자로 추가 ← **이 단계를 빼먹으면 403이 난다**
JSON 파일을 열면 `"client_email"` 항목에 이런 주소가 있다:
```
gsc-reader@epickor-gsc.iam.gserviceaccount.com
```

[Search Console](https://search.google.com/search-console) → epickor.com 속성 선택
→ 좌측 하단 **설정 → 사용자 및 권한** → **사용자 추가**
→ 위 이메일 붙여넣기 → 권한 **전체(Full)** → 추가.

---

## 끝나면 실행

```bash
node scripts/gsc-fetch.mjs
```

성공하면 이런 출력이 나온다:
```
Site:       https://www.epickor.com/
Dimensions: query
Range:      2026-05-02 → 2026-07-29

  fetching rows 0–25000... 25000
  fetching rows 25000–50000... 8431

✅ 33,431 rows
   clicks 1,216 | impressions 335,211 | CTR 0.363%
   → output/gsc/api/query_2026-05-02_2026-07-29.csv
```

**1,000행에서 33,000행으로 늘어나는 게 이 작업의 전부다.**

### 다른 사용법
```bash
node scripts/gsc-fetch.mjs --dimension page          # 페이지별
node scripts/gsc-fetch.mjs --dimension query,page    # 쿼리×페이지 교차
node scripts/gsc-fetch.mjs --days 28                 # 최근 28일
node scripts/gsc-fetch.mjs --start 2026-01-01 --end 2026-03-31
```

---

## 막힐 만한 지점

| 증상 | 원인 / 해결 |
|---|---|
| `Permission denied` / 403 | 5단계를 안 했거나, 권한이 "전체"가 아님. `client_email`을 정확히 붙여넣었는지 확인 |
| 행이 0개 | 날짜 범위가 너무 최근. **GSC는 약 2일 지연**된다 (스크립트가 이미 2일 빼서 요청함) |
| 속성 불일치 | 도메인 속성이면 `GSC_SITE_URL=sc-domain:epickor.com`, URL 접두어 속성이면 `https://www.epickor.com/`. `.env.local`에 지정 가능 |
| 키 파일 못 찾음 | 경로/파일명 확인. `.env.local`의 `GSC_SERVICE_ACCOUNT_KEY`로 다른 경로 지정 가능 |

---

## ⚠️ 데이터 해석 시 반드시 지킬 것

**시계열 비교는 클릭으로만 한다. 노출과 CTR로 비교하지 않는다.**

구글이 **2025-05-13부터 2026년 4월경까지 노출을 과다 집계하는 버그**를 공식 인정했다
(클릭은 영향 없음). 우리가 가진 기존 추출본이 **전부 그 구간 안에 있다.** 그래서:

- 이전 기간과 노출/CTR을 비교하면 실제보다 나빠 보인다
- 클릭은 신뢰할 수 있다

또한 2025년 9월 `num=100` 파라미터가 사라지면서 순위 추적 도구발 유령 노출이 줄어드는 변화도 겹쳤다.

**그리고 GSC는 우리가 이미 어느 정도 노출되는 쿼리만 보여준다.** 존재감이 0인 신규 수요는
구조적으로 안 보인다. GSC는 **CTR 개선과 확장 도구**이지 신규 주제 발굴 도구가 아니다.
신규 주제는 `docs/keyword-selection-playbook.md` §4(한국어 차익거래)에서 나온다.

---

## 다음 단계 (선택)

**BigQuery 대량 내보내기**는 행 제한이 아예 없고 데이터가 영구 누적된다. 다만:
- Google Cloud 프로젝트에 **결제 수단 등록 필요** (실제 청구는 $0 예상 — 무료 한도가 월 1TiB 쿼리)
- **켠 날짜부터의 데이터만 쌓인다**

**GSC 보관 기간은 16개월 롤링이다. 하루 지나면 하루가 영구히 사라진다.**
지금 안 켜면 오늘 데이터는 2027년 말에 없어진다. 카드 등록이 걸리는 부분이라 대표님 판단이 필요하다.
