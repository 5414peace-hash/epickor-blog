# EpicKor Keyword Selection Playbook

**Created**: 2026-07-31
**Status**: Operational. Run this weekly.
**Owner**: whoever runs the Monday strategy pass.

This is the repeatable process for choosing what to write. It replaces "read the GSC export and
pick something that looks good." Every tool listed here was verified working and free on
2026-07-31 — dead and now-paid tools are listed separately in §7 so nobody re-discovers them.

**What this builds on** (read these once, not weekly):
- `CLAUDE.md` §"Topic Engine — 뾰족함이 볼륨을 이긴다" — the doctrine. This playbook is its *procedure*.
- `reports/competitor-study-v2-verified-2026-07-30.md` — the lane decision and competitor facts.
- `docs/handoff/FACTS.md` §gsc — verified numbers. Query via `node scripts/handoff.mjs facts gsc`.

**What this supersedes**: `.claude/skills/strategy/scripts/analyze-week.mjs` topic generation
(a hardcoded regex→canned-title lookup that cannot discover anything new), and the Korean
"역할/실행 순서" section of `.claude/agents/strategy-team/AGENT.md`, which instructs agents to run
a `--mode api` that does not exist.

---

## 0. The one-paragraph version

Our clicks are capped by **query mix**, not by rankings and not by writing quality. Definition
queries convert at **0.048%**, comparisons at **1.15%**, purchase-intent at **2.0%** — a 42×
spread on the same site with the same authority. So keyword selection *is* the growth lever.
The job each week is to find queries in the winnable middle — **a specific Korean thing + an
action the reader takes** — verify the SERP isn't structurally closed, and reject everything
else fast. Volume is not the target. `korean convenience store breakfast` (61 impressions,
14.75% CTR) beats `ahjussi` (20,585 impressions, 0.058%) by 340×.

---

## 0b. 용어 — 카테고리 / 레인 / 씨앗은 서로 다른 것이다

2026-08-01에 이 셋이 대화에서 뒤섞여 잘못된 결론이 나왔다. 고정한다.

| 말 | 뜻 | 예 |
|---|---|---|
| **카테고리 (대주제)** | 소재의 큰 갈래. 개수가 적고 잘 안 바뀐다 | 음식 · 문화 · 경제 · 뉴스 · 여행 · 뷰티 |
| **레인** | 우리가 **순서를 정해 거는 판돈**. 카테고리보다 훨씬 좁고 **확장 조건**이 붙는다 | 아래 3개 |
| **씨앗** | 검증할 **개별 후보 단어**. 통과 여부는 아직 모른다 | 맥콜 · 안성탕면 · 비타500 |

**레인은 카테고리가 아니다. 카테고리를 가로질러 잘라낸 조각이다.**
`음식`은 카테고리이고 `음식-구체`가 레인이다 — 같은 음식 안에서도
"김치란 무엇인가"는 레인 밖, "황치즈칩 얼마"는 레인 안이다.

현재 레인 (`CLAUDE.md` → 실행계획 챕터 1):
1. **1차** 음식-구체 (포장 과자·편의점·길거리 음식)
2. **2차** K팝 굿즈·뷰티 **제품** — 조건부 (1차 신규 코호트 CTR ≥ 1.5%)
3. **3차** 거래장벽 실용 가이드 (외국인의 한국 시스템 항해) — 분기 단위

### 이 구분이 실제로 뭘 막는가

- **"문화를 금지했다"는 잘못된 요약이다.** 금지된 것은 **정의형 쿼리 형태**이지 카테고리가 아니다.
  문화 주제라도 행동/결정 프레임이면 통과한다 (결혼식 하객 — 얼마 내나, 뭐 입나).
  2026-07~08에 이걸 "문화 카테고리 금지"로 잘못 읽고 씨앗을 음식 공산품으로만 좁혔다.
- **"레인 1의 CTR이 문화보다 14배 높다"는 근거를 오독하지 말 것.** 비교 대상이 된
  문화 0.152%는 **정의형 문화 글**의 숫자다. **행동 프레임 문화는 측정된 적이 없다.**
  없는 데이터를 근거로 카테고리를 통째로 막지 않는다.
- 새 카테고리를 탐색해 나온 결과가 곧바로 새 레인이 되는 것은 아니다.
  기존 레인(특히 3차)에 흡수되는 경우가 많다. **씨앗 배치 결과를 보고 판단한다.**

---

## 1. The free-tool discovery stack

Ordered by value per minute spent. Tiers 1–2 are the weekly workhorses; Tier 3 is for when a
candidate needs a tiebreak.

### Tier 1 — free, unlimited, no account, verified live 2026-07-31

#### 1.1 Autocomplete endpoints — the core of the whole stack

These are the highest-value free assets available, and almost nobody uses them systematically.
All return HTTP 200 unauthenticated. 30 rapid sequential Google calls produced zero throttling.

| Engine | Endpoint | Returns |
|---|---|---|
| Google (rich) | `https://www.google.com/complete/search?client=chrome&hl=en&q=QUERY` | **15** suggestions + `google:suggestrelevance` scores |
| Google (simple) | `https://suggestqueries.google.com/complete/search?client=firefox&hl=en&q=QUERY` | 10 suggestions, clean JSON |
| YouTube | `https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=QUERY` | Video-intent phrasing (`ds=yt` is the whole trick) |
| Amazon | `https://completion.amazon.com/api/2017/suggestions?mid=ATVPDKIKX0DER&alias=aps&prefix=QUERY&limit=11` | **Purchase-intent** phrasing, department-scopable via `alias=beauty` etc. |
| Bing | `https://www.bing.com/AS/Suggestions?qry=QUERY` | HTML fragment |
| DuckDuckGo | `https://duckduckgo.com/ac/?q=QUERY&type=list` | Clean JSON |

Use `client=chrome` over `client=firefox` — 50% more suggestions plus relevance scores.

**⚠️ `gl=` does not work.** We tested `gl=us`, `gl=kr`, and `gl=ph` on the same seed and got
**byte-identical results**. Suggestions are keyed to the requesting IP, not the parameter. Running
this from Seoul returns Korea-IP suggestions. `hl=en` *does* control language and works. If US-
targeted suggestions matter for a decision, run it through a US VPN or treat the output as
directionally-right-but-geo-skewed. Do not claim these are US results.

**Two expansion patterns. Use the second one.**

*Alphabet soup* — append ` a` through ` z` to a seed. Broad but noisy: a `korean corn dog` run
returned 40 suggestions of which ~30 were city names (`atlanta`, `bangalore`, `calgary`…). Those
are local-intent queries we cannot win. Useful mainly for discovering that a topic *has* local
demand, which is a reject signal for us.

*Template expansion* — **this is the one that finds winnable queries.** Wrap the seed in the
question and comparison shapes that our data says convert, instead of trawling alphabetically:

```
why is SEED        what is SEED       is SEED           SEED vs
why do SEED        how is SEED        SEED or           SEED difference
do koreans SEED    SEED worth         SEED actually     SEED taste like
```

Real output from `korean skincare`: *does korean skincare actually work · is korean skincare
better than japanese · are korean beauty products cheaper in korea · how is korean skincare
different · is korean skincare worth it*. Every one of those is a comparison/experience query —
the 1.15%+ CTR class. The alphabet-soup pass on the same seed would have buried these under
city names and product names.

Real output from `buldak`: *buldak original vs carbonara · buldak rose difference · buldak
carbonara taste like*. Real output from `samgak kimbap`: *samgak kimbap vs onigiri*.

Script: `scripts/keyword-expand.mjs` (see §5.1).

**Bonus signal — the `reddit` suffix.** When autocomplete itself suggests `... reddit`, Google's
users have learned that Google's own results are inadequate and they go to Reddit. Observed on
`best korean sunscreen reddit` and `is korean skincare actually better reddit`. Treat as a
**yellow flag**: the SERP for that query is probably Reddit-led. Not an automatic reject (see
§3 on Reddit's 2026 decline), but it means you need genuine first-person specifics to win.

**Bonus signal — shallow autocomplete is not a dead topic.** `korean convenience store breakfast`
returns only **2** suggestions. That is our single best-converting query at **14.75% CTR**. Thin
autocomplete means underserved, not worthless. Do not use suggestion count as a volume proxy and
reject on it.

#### 1.2 Wikimedia Pageviews API — free demand validation, no key, no signup

```
https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/en.wikipedia/all-access/user/{ARTICLE}/monthly/2025010100/2026070100
```

Real monthly views for `Korean_cuisine`: Jan 12,810 · Feb 10,596 · Mar 11,845 · Apr 10,796 ·
May 12,479 · Jun 11,717. This is the most underrated free tool on the list — it gives **absolute
numbers** (unlike Trends' relative index) and it works on low-volume topics where Trends returns 0.
Use it to sanity-check that an English-speaking audience cares about a Korean subject at all,
and to detect a rising subject month-over-month.

Limitation: only works for subjects that have an English Wikipedia article. Many of our best
product topics don't. Absence of an article is not evidence of no demand.

#### 1.3 Keyword Surfer (Chrome extension)

`https://surferseo.com/keyword-surfer-extension` — official copy: "100% Free. Forever." Last
updated 2026-01-29, so actively maintained. No account, no documented daily quota. Shows volume +
CPC directly on the Google SERP, keyword ideas with similarity scores, competitor word counts,
and **free CSV export**, across 70 countries.

Caveat: volumes are Surfer's own estimates, not Google's. Use for **relative ranking between
candidates**, never as an absolute forecast.

### Tier 2 — free, one-time setup, high value

#### 2.1 Google Search Console — our most underused asset

We currently do **manual UI CSV export only** (6 exports in `output/gsc/`, all Korean-locale
bundles). No API access is configured. The UI export is capped at **1,000 rows**, and that cap is
why "the queue ran dry" keeps happening — we are looking at the top 1,000 queries of a site with
far more than 1,000 queries.

**The row limits, from Google's own documentation** (`developers.google.com/search/blog/2022/10/performance-data-deep-dive`):

| Access path | Row limit |
|---|---|
| Web UI export | **1,000** |
| Search Analytics API | **25,000 per request**, `startRow` paginates to **50,000/day/site/search-type** |
| Looker Studio connector | Same **50,000/day** ceiling — **it does NOT bypass the cap** |
| BigQuery bulk export | **No row cap, accumulates indefinitely** |

The Looker Studio point is the single most mis-stated fact in SEO blog posts about GSC. It is not
an unlimited backdoor.

**Action 1 (do once, ~30 min): wire up the Search Analytics API.** 25,000 rows instead of 1,000 is
a 25× widening of the discoverable query universe. This is the highest-leverage unfilled gap in
the whole pipeline.

**Action 2 (do once, ~15 min): enable BigQuery bulk export.** Search Console charges nothing.
BigQuery's free tier is 1 TiB queries/month and 10 GiB storage/month — at our traffic this is
comfortably $0. **But it requires a Google Cloud project with billing enabled (a card on file)**
even though nothing will be charged. Get representative approval before adding the card.

Why it matters: **GSC retention is 16 months, rolling — one day gained, one day lost, daily.**
Bulk export is the only escape, and it only preserves data **from the day you switch it on**.
Every week we delay is a week permanently lost.

**Two limits nobody warns about:**
- **Anonymized queries.** Google drops queries "not issued by more than a few dozen users over a
  two-to-three month period" — they appear in chart totals but have **no row** anywhere, including
  the API. Our best-converting long tail (61 impressions) sits right at that edge. And
  "anonymized queries are omitted whenever a filter is applied," so filtered table totals will
  never reconcile with chart totals. Don't chase that discrepancy.
- **GSC only shows queries we already have *some* footprint on.** It structurally cannot reveal
  zero-footprint demand. This is already in FACTS.md and it is why a weak-position scan of the
  full 1,000-row export on 2026-07-30 returned only 3 hits, all already covered. **GSC is a
  CTR-fix and expansion tool, not a new-topic discovery tool.** New topics come from §1.4, §1.5,
  and §4.

**⚠️ Two data-integrity problems that contaminate our own baseline** — flagged because we have
been quoting these numbers as if they were clean:

1. **Google confirmed a logging bug that over-reported impressions from 2025-05-13 until early
   April 2026** — roughly 11 months. Clicks were unaffected. Inflated impressions + correct clicks
   = **artificially deflated CTR**. Every GSC export in `output/gsc/` falls inside or overlaps that
   window. Our "0.363% CTR" is too low by an unknown margin.
2. **Google removed the `&num=100` parameter in mid-September 2025.** Across 319 properties, 87.7%
   lost impressions and 77.6% lost unique ranking terms, while clicks barely moved — i.e. pre-Sept-2025
   impressions were inflated by rank-tracker bots. **Any impression or CTR comparison spanning
   September 2025 is not apples-to-apples.**

Practical rule: **compare clicks across time, not impressions or CTR.** Clicks are the only metric
unaffected by both incidents — and clicks are the representative's stated goal anyway.

#### 2.2 Bing Webmaster Tools — the only free source of real volume numbers

`https://www.bing.com/webmasters` → Keyword Research. Requires verified site ownership (we qualify).

**This is genuinely the best free volume source and the recommendation holds up in 2026.** You get
actual monthly search volumes from Microsoft Advertising data — not modeled estimates — filterable
by **country, language, and device**, with CSV export, plus it surfaces the *questions* a keyword
appeared in (directly reusable as FAQ blocks).

**There is also a free API** almost nobody mentions: `https://ssl.bing.com/webmaster/api.svc/json/`
with a key from your BWT settings. Endpoints `GetKeywordStats` (weekly broad- and strict-match
impressions) and `GetRelatedKeywords`. This is free programmatic access to real volume data — the
closest thing to a free Keyword Planner API that exists.

**Hard limits and caveats:**
- **Keyword Research timeframe: 6 months maximum** (default 3). Rarely mentioned, and it's the
  tool's sharpest constraint.
- Separately, the **Search Performance report holds 24 months** (expanded Aug 2025) — **better than
  Google's 16**. Worth exporting periodically purely as a historical hedge.
- **The accuracy caveat that SEO blogs skip:** Bing is ~5% of global search, but ~27–28% of *US
  desktop* and only ~0.6% of mobile. Its users skew desktop, US, Windows, older. Our readers are
  foreign and heavily mobile (64.7% of our impressions). **Bing volumes will systematically
  under-represent our actual demand and skew toward desktop research phrasing.** Use for relative
  ranking between keywords; never as an absolute forecast. Any "multiply Bing by 10–20×" rule you
  read is folklore — no source substantiates one.

#### 2.3 Google Trends — seasonality only, not validation

`https://trends.google.com`. CSV export still works and is free; Google documents no export volume
limit (third parties report ~15 downloads/24h per IP before throttling — observed, not documented).

**Use it for exactly two things**: (a) seasonality/timing — when does interest in a topic peak, so
we publish 6–8 weeks ahead; (b) direction — is a topic rising or decaying, via the `compare`
feature (**5 terms max**).

**Do not use it to validate a topic.** Google states: *"Trends only shows data for popular terms,
so search terms with low volume appear as '0.'"* **Zero does not mean zero searches** — it means
below the detection floor, roughly several hundred searches/month. Our best keywords (61
impressions/quarter) sit *below* that floor. Trends will return 0 for our winners. Treating that
as a reject signal would kill exactly the topics we want.

Also: it's a **sample, not a census**, and identical repeated queries have been measured returning
scores of **8 to 23** across successive exports — sampling noise dominating signal at low volume.
"Breakout" officially means **growth exceeding 5,000%**, which in practice means "this had almost
no baseline" — high upside, high noise.

**The official Trends API is an application-gated alpha** (announced 2025-07-24, still not GA, most
applicants never admitted). **Do not build a playbook step on it.** `pytrends` and the
unauthenticated HTML endpoint are effectively dead — our own direct test returned **429**.

#### 2.4 AlsoAsked — the only usable free PAA source

`https://alsoasked.com` — **3 free searches/day, refreshed daily, no account needed.**

**The depth trap:** standard search = 2 levels, ~25 questions, **1 credit**. Deep search = 3 levels,
~100 questions, **4 credits** — so deep search is impossible on the free tier. Budget the 3 daily
credits for finalist keywords only.

Why it matters: **there is no free way to scrape People Also Ask in 2026.** We tested it. Google
`/search?q=` returns a JS-required shell with zero organic results and zero PAA in the raw HTML.
Bing returns zero result blocks (a grep hit for "Related Searches" turns out to be a JavaScript
i18n string table, not results). Google SERPs have required JS rendering since ~January 2025.
AlsoAsked's 3/day is the realistic free PAA channel.

### Tier 3 — rationed, use for tiebreaks

| Source | Free limit (verified) | Use for |
|---|---|---|
| **Stack Exchange API** | **300 req/day keyless**, 10,000/day with free key | `site=travel` real Q&A about Korea travel |
| **YouTube Data API v3** | 10,000 units/day. `search.list`=100 units (→100 searches/day) but reads=**1 unit** | **Comment mining** is the cheap, underused half |
| **old.reddit.com HTML search** | No auth. 8 rapid searches → no 429. `after=` pagination works | The surviving free Reddit path |
| **arctic-shift** (`arctic-shift.photon-reddit.com`) | ≤100/request, no auth, data current to 2026-07-30 | Structured Reddit. Its `posts/search/aggregate` gives free seasonality |
| **`site:quora.com` via a search engine** | Free | Harvest question *titles* — they are literally long-tail natural-language queries |

**Reddit — the situation changed materially and most guides are stale.** Every unauthenticated
`.json` endpoint is **dead: 403**. We tested `/search.json`, `/hot.json`, `old.reddit.com/*.json`,
and `api.reddit.com` — all 403, across multiple User-Agents. Guides still claiming "10 QPM
unauthenticated" are wrong; it is empirically zero. `reddit.com/robots.txt` is now
`User-agent: * / Disallow: /` with no Googlebot carve-out — Google's access is contractual
(~$60M/yr), not technical, which means **Google is the only viable engine for `site:reddit.com`**
(Bing and DDG have little recent Reddit content).

⚠️ **Decision needed:** Reddit's free API tier is scoped to **non-commercial** use. An
Amazon-affiliate-monetized blog is plausibly commercial; the commercial rate is $0.24/1,000 calls
with manual approval. This is a grey zone. Recommendation: stick to `old.reddit.com` HTML search
and `site:reddit.com` via Google, both of which are ordinary web access, and don't build an
automated pipeline on the API.

`arctic-shift` real seasonality data for r/koreatravel monthly post volume: Dec 952 · Jan 785 ·
Feb 1,160 · Mar 1,115 · Apr 1,020 · May 796. Usable for timing travel content.

**PullPush** (`api.pullpush.io`) supports cross-subreddit search but its data is **frozen at
2025-05-19** — historical mining only. Pushshift public API, redditsearch.io, and camas.unddit.com
are all dead.

---

## 1c. 새 함정 — 디아스포라 트랩 (2026-08-01 발견)

**영어 쿼리에 `korean`이 들어 있다고 해서 한국에 대한 검색이 아니다.**
상당수는 **"자기 동네에 있는 한국식 무언가"**를 찾는 것이다.

실측:

```
korean photo booth  → near me · in delhi · in chandigarh · in kolkata
                      · in noida · in jaipur · london · brisbane · toronto
escape room korea   → koreatown · koreatown nyc · koreatown los angeles
                      · korean show · korean variety show · netflix
coin karaoke korea  → koreatown · london · near me
korea dog cafe      → korean corn dog cafe · korean corn dog cafe belgaum
```

`인생네컷`은 네이버 10개·구글 10개로 **양쪽 만점이었지만 실제로는 전멸**이다.
검색자는 서울의 인생네컷 부스를 찾는 게 아니라 **델리·토론토의 한국식 포토부스**를 찾고 있다.

**왜 위험한가**: 기존 로컬 마커 규칙(`near me`, `{도시명}`)은 씨앗에 지명이 붙은 경우를 걸렀다.
디아스포라 트랩은 **씨앗 자체는 깨끗한데 분기에서 터진다.** 분기 수만 세면 놓친다.

**필터 절차 (분기 수를 세기 전에 한다)**:
1. 분기를 **읽는다.** 세지 말고 읽는다
2. **해외 도시명**이 3개 이상 나오면 기각 (델리·런던·토론토·브리즈번…)
3. **`koreatown`**이 나오면 기각 — 미국·캐나다의 한인타운 상권 검색이다
4. **`korean {일반명사}`가 다른 제품을 뜻하지 않는지** 확인 —
   `korean corn dog cafe`가 `korea dog cafe` 분기를 오염시킨 사례가 있다

**살아남는 형태**: 분기가 **한국 안의 지명·시설·절차**를 가리킬 때만 진짜 수요다.
예: `korean school uniform rental` → `seoul` · `near lotte world` · `ewha` · `jamsil`.
이건 실제로 서울에서 그 행동을 할 사람들이다.

---

## 2. The query-shape filter

Apply to every candidate keyword. Target: **30 seconds**. Most candidates die at step 1 or 2.

### 2.1 The 30-second decision tree

```
START: you have a candidate keyword
│
├─ 1. DEFINITION MARKERS present?  ────────────────────────────► REJECT
│     "meaning" · "what does X mean" · "definition" · "explained"
│     "artinya" · "significado" · "signification" · "뜻"
│     any single Korean/foreign word alone ("ahjussi", "jeong", "SKY")
│     → Google answers in the SERP. Our measured CTR: 0.048%.
│
├─ 2. RETAILER MARKERS present?  ──────────────────────────────► REJECT
│     "where to buy" · "near me" · "price" · "cheap" · "for sale"
│     "shop" · "order online" · "delivery" · "coupon" · "discount"
│     → Verified: SERP returns Walmart/Amazon/Costco/sayweee/yami only.
│       ZERO editorial results. Unwinnable with an article.
│
│     ⚠️ EXCEPTION — "in Seoul" / "in Korea" flips this (added 2026-08-13).
│     The marker rejects PRODUCT queries, not DESTINATION queries. Scope is
│     what decides it:
│         "where to buy buldak"            → Amazon/Walmart own it. REJECT.
│         "where to buy luggage IN SEOUL"  → no retailer can occupy a city
│                                            aisle question. ACCEPT.
│     Evidence: `275` (Yongsan tech shopping) is the site's best-converting
│     page at 9.27% CTR and this rule as originally written would have killed
│     it. Six "where to buy X in seoul" seeds tested — souvenirs, skincare,
│     clothes, luggage, hanbok, glasses — all returned 12-15 branches and ALL
│     SIX carried a `reddit` suffix in the top two, i.e. Google is not
│     answering them. See `output/strategy/section_seoul-shopping-playbook.md`.
│     Still reject if the branches show foreign cities (diaspora trap, §1c).
│
├─ 3. LOCAL MARKERS present?  ─────────────────────────────────► REJECT
│     any non-Korean city/state name ("korean corn dog atlanta")
│     → Local pack owns it. We are not a local business anywhere.
│
├─ 4. PURE-VOLUME TRAP?  ──────────────────────────────────────► REJECT
│     Is it a single high-volume abstract noun with no action attached?
│     ("hallyu", "k-pop", "korean culture", "seoul")
│     → We already own two of these and they convert at ~0.09%.
│
├─ 5. ACTION TEST — the gate that matters most
│     Can you finish this sentence in ONE line, concretely?
│         "After reading this, the reader will ______."
│     ✗ "understand what X means"        → that's a definition. REJECT.
│     ✓ "know which of the 4 flavors to pick"
│     ✓ "know it costs ₩2,800 and where it's sold"
│     ✓ "know how to open the wrapper without tearing it"
│     ✓ "know whether to buy it at Olive Young or Daiso"
│
├─ 6. SPECIFICITY TEST
│     Does the keyword name a SPECIFIC Korean thing —
│     a brand, product, dish, chain, venue, or process?
│     ✗ "korean snacks"          → too broad
│     ✓ "buldak carbonara"       → specific product
│     ✓ "samgak kimbap"          → specific item
│     ✓ "mega coffee vs compose" → specific brands
│
└─ 7. WINNABLE-SHAPE CHECK — does it match a proven pattern?
      → If yes, ACCEPT and send to the SERP protocol (§3).
      → If no, it's a maybe. Only proceed if §4 gives a Korean-source edge.
```

### 2.2 The winnable shapes, ranked by our own measured CTR

| Shape | Template | Our CTR class | Example |
|---|---|---|---|
| **Purchase-adjacent comparison** | `A vs B`, `A or B`, `X difference` | **~2.0%** | `buldak original vs carbonara`, `samgak kimbap vs onigiri` |
| **Mechanism / how-it-works** | `how does X work`, `how to eat X`, `X instructions` | high | `samgak kimbap how to open`, `buldak carbonara instructions` |
| **Experience verification** | `is X worth it`, `does X actually work`, `is X really` | ~1.15% | `does korean skincare actually work` |
| **Specific-context practical** | `{specific Korean thing} + {situation}` | **14.75% observed** | `korean convenience store breakfast` |
| **Identity of a specific thing** | `what is {specific product}` | moderate | `what is deli manjoo` |

⚠️ **Note the split inside "what is."** `what is ahjussi` (a word) = REJECT — snippet-killable.
`what is deli manjoo` (a physical product you can photograph, price, and locate) = ACCEPT. The
distinguishing question: **can Google finish the answer in two sentences?** A word: yes. A
product with a price, a texture, four flavors, and a location: no.

### 2.3 Marker reference table

| Class | Markers | Verdict | Evidence |
|---|---|---|---|
| Definitional | meaning, means, definition, artinya, 뜻, what does __ mean, single foreign word | **REJECT** | 0.048% CTR measured; `ahjussi` 20,585 imp → 12 clicks |
| Retail | where to buy, price, near me, cheap, for sale, order, delivery, coupon | **REJECT** | SERP test: 100% retailers, 0 editorial |
| Local | any foreign city/region name | **REJECT** | Local pack; AIO rate only 7.9% but slots are reserved |
| Volume trap | broad abstract noun, no action | **REJECT** | SKY/ahjussi pattern, ~0.09% |
| Comparison | vs, or, difference, better than, compared to | **ACCEPT** | 1.15% measured; AIO-ambiguous (see §3.2) |
| Mechanism | how to, how does, instructions, why is, why do | **ACCEPT** | Open SERP; no domain repeated across 10 tests |
| Experience | is __ worth it, does __ actually, is __ really | **ACCEPT** | Reddit-competitive but winnable with real specifics |
| Practical context | specific thing + specific situation | **ACCEPT — best class** | 14.75% observed |

### 2.4 The language filter

**Reject non-English-language queries outright.** Indonesian queries generated **29,442
impressions and 1 click**. Malay, Indonesian, Spanish, and Portuguese "artinya/significado"
variants are the same definitional trap in another language, with worse monetization (those
markets have negligible Amazon affiliate value for us). This is a monetization decision, not a
quality judgment.

---

## 3. The SERP inspection protocol

Run only on candidates that passed §2. Budget **3–5 minutes per keyword**. Output: a score out of
100 recorded in the candidate file.

### 3.1 How to actually look at the SERP

**Always run two views.** Neither alone is sufficient.

```
View A — true organic field (what you'd be competing against):
https://www.google.com/search?q=YOUR+QUERY&udm=14&pws=0&gl=us&hl=en

View B — what the user actually sees (what's stealing the clicks):
https://www.google.com/search?q=YOUR+QUERY&pws=0&gl=us&hl=en
```

`udm=14` forces Google's "Web" view — classic 10 blue links, **no AI Overview**, no knowledge
panels, no feature widgets. It is the URL form of an officially launched feature (rolled out
2024-05-14), which makes it far more durable than `num=100` was. **There is no official way to
disable AI Overviews; `udm=14` is the reliable method.** `pws=0` disables personalization.

**Mechanics you need to know:**
- **`&num=100` is dead** — disabled mid-September 2025. Passing it now silently returns 10 results.
  Page with `&start=0,10,20…90` instead. Google caps public pagination at ~10 pages anyway.
- **Automated SERP scraping is not viable.** Google and Bing both return JS-required shells with
  zero results in raw HTML. We tested DuckDuckGo's `html.duckduckgo.com` endpoint — it worked for
  about 5 queries and then began returning empty results and challenge pages. **Do this step
  manually in an incognito browser.** Do not build a scraper; it will break and it will lie to you.
- **Never trust a `site:` result count.** John Mueller: a `site:` query "is not meant to be complete
  or used for diagnostic purposes." A documented case claimed "About 588,000 results" and yielded
  ~832 when paged through. Use `site:` to check *whether* something is indexed, never *how many*.

**Operators still working in 2026**: `site:` `intitle:` `allintitle:` `""` `-` `before:` `after:`
`filetype:` `OR`. **Degraded**: `inurl:` (field reports of partial/region-dependent results).
**Dead**: `related:` (removed 2023), `link:` (2017), `cache:` (2024). `AROUND(X)` runs but
frequently ignores the constraint — don't build on it.

### 3.2 The AIO-likelihood gate — the single most valuable check

This gate is worth more than everything else in §3 combined. Source: Ahrefs, 146,122,391 desktop
SERPs, September 2025. Baseline AIO trigger rate **20.5%**.

An AI Overview cuts position-1 CTR by **34.5%** (Ahrefs, Apr 2025), widening to **−58%** by
Dec 2025. In absolute GSC terms: position 1 earns **3.9% without an AIO, 1.6% with one.**

**Traits that RAISE AIO probability (avoid):**

| Trait | Trigger rate |
|---|---|
| Question-format query | **57.9%** (vs 15.5% non-question) |
| 7+ word query | 46.4% |
| Medical / YMYL | 44.1% |
| Health | 43.0% |
| All YMYL | 34.3% |
| Non-branded | 24.9% |
| Informational intent | 21.4% |

**Traits that LOWER AIO probability (target these):**

| Trait | Trigger rate |
|---|---|
| Navigational | **0.9%** |
| Transactional | **2.1%** |
| Shopping category | **3.2%** |
| Commercial intent | **4.3%** |
| News queries | 6.0% |
| Local | **7.9%** |
| 1-word | 9.5% |
| 3-word | 14.0% |

**What this means for us, concretely:** specific product and brand queries, price/cost queries,
and shop/market queries are **largely AIO-free**. Generic "what is / why is" culture questions are
in the 57.9% band. This is quantitative confirmation of the Topic Engine doctrine from an
independent 146M-SERP sample.

⚠️ **Honest contradiction, unresolved.** Seer Interactive reports **comparison queries trigger AIOs
at 95.4%** — flatly incompatible with Ahrefs' commercial-intent 4.3%. The likely explanation: Seer
classifies by *surface format* on a 53-brand tracked panel (heavily commercial, high-volume,
unrepresentative); Ahrefs classifies by *inferred intent* on a random sample. **Trust Ahrefs'
random 146M sample for "will my topic get an AIO."** But treat `A vs B` queries as genuinely
uncertain — this is exactly where the two best sources disagree most sharply, and comparison is
one of our recommended shapes. **Check the live SERP for comparison keywords rather than assuming.**

### 3.3 Scoring rubric — 100 points

Score each candidate. **Threshold: ≥65 to write. Below 50, reject. 50–64, park.**

| # | Check | How to judge | Points |
|---|---|---|---|
| 1 | **No AI Overview in View B** | Look at the top of the unfiltered SERP | **25** — AIO present: 0. AIO present but our type of site is *cited* in it: 10 |
| 2 | **Answer does not resolve on the SERP** | No knowledge panel, no knowledge card giving the full answer | **15** — panel/card answering it fully: 0 |
| 3 | **No reserved-intent block** | No local pack, no Top Stories, no shopping/Popular Products carousel | **15** — any present: 0 |
| 4 | **Top 3 are beatable** | See 3.4 below | **20** |
| 5 | **Freshness opening** | Visible dates on page-1 results older than ~18 months, on a query with current-info intent (prices, hours, apps, rules) | **10** |
| 6 | **Depth gap** | `site:competitor.com {topic}` shows one thin page, not a 40-page cluster | **10** |
| 7 | **Korean-source edge** | We can add ≥1 verifiable fact from a Korean source no English site has (§4) | **5** |

**Do NOT score these** — they lost their diagnostic value between 2025 and 2026 and will just add
noise:
- **Sitelinks on #1** — grew **+906%** (8.44% → 84.95% of SERPs). Present on 85% of SERPs; it
  discriminates nothing. Drop it.
- **People Also Ask** — near-universal. Its only real use is as a *proxy warning that an AIO is
  likely*, since both correlate with question-shaped intent.
- **Featured snippet** — declined **−64%** (15.41% → 5.53%) as AIOs replaced them (correlation
  −0.9, switchover March 2025). Google now falls back to a snippet when an AIO fails to generate.
  It's a residual, not a barrier.

### 3.4 Judging whether the top 3 are beatable (check #4, 20 pts)

Score 0–20 by reading the actual results. **These judgment heuristics matter more than any
authority metric.**

| What you see | Points | Reasoning |
|---|---|---|
| Thin/aggregator/AI-spun content farms | **20** | Google's **March 2026 core update explicitly demoted aggregators in favour of originators and niche specialists** (Amsive, 2,000+ domains). An aggregator-heavy SERP is now a *target*, not a wall. |
| A #1 that only mentions the topic tangentially | **20** | Strongest free beatability signal there is — Google is settling because nothing better exists. |
| Personal blogs / small niche sites, no cluster depth | **15** | Beatable with better specificity. This is `southkoreahallyu.com` territory — 153 posts, 2 people. |
| Reddit/forum thread at #1 | **10** | Yellow, not red — see below. |
| Established multi-author publisher with topical depth | **5** | e.g. `thesoulofseoul.net` (934 posts, 8 authors, 2013 domain). Hard but not closed. |
| A vertical specialist that owns the whole cluster | **0** | e.g. `90daykorean.com` owns **7 of 9** Korean-language-learning queries and **0 of the other 44**. Do not enter their wedge. |
| Official/government #1 | **5** | The informational core is closed, but the *practical* layer (what it costs, what goes wrong, what to actually do) is usually open. |

**On Reddit specifically — the calculus changed and this is worth knowing.** Reddit peaked at the
**#2 most-visible US domain in August 2025** and has fallen to **#4 as of March 2026** (SISTRIX).
The March 2026 core update hit it for **−64 visibility points** (Instagram −48, X −46,
TripAdvisor −45), while first-party originators and niche specialists gained. So a Reddit thread
at #1 is a **yellow flag, not the automatic red flag it was in 2024**. Counterweights: Reddit
bounced back partially, and it remains the **most-cited domain in AI answers at 40.1%**.

⚠️ **Honest gap:** there is **no credible quantified data on which query types Reddit dominates.**
Everything published on that question is SEO blogspam recycling an unsourced "42% of product
comparison queries" figure. We should not cite it. Build this gate from **our own observed SERPs**
instead — log what we see, week over week, and let our own record answer it.

### 3.5 Free authority checks (optional, for check #4 tiebreaks)

Verified free as of 2026-07-30:

| Tool | Free limit | Metric |
|---|---|---|
| **Keywords Everywhere DA Checker** | **500/day, no account** | Moz DA, backlinks, spam score, 4-yr trend |
| Ahrefs Website Authority Checker | No documented limit (have a free account ready) | Domain Rating |
| Semrush free account | **10 queries/day**, no card | Authority Score + **competitor** backlinks |
| Majestic free checker | "a handful"/day | **Trust Flow / Citation Flow** — catches spammy profiles DA/DR miss |
| Serpstat DR checker | 10/day, no signup | DR |
| Moz Link Explorer | **10/month** | Effectively useless — use Keywords Everywhere instead |

⚠️ **Ahrefs' free DR API requires an API key from 2026-08-10** (key is free, no unit cost).
⚠️ **OpenPageRank migrated to Keywords Everywhere; old API keys die 2026-09-30.**
⚠️ **Never mix scales.** DA (Moz), DR (Ahrefs), Authority Score (Semrush), TF/CF (Majestic), and
OPR (0–10) come from different link graphs and are not comparable.

**Honestly: skip these most weeks.** Reading the actual results (3.4) tells you more than a
number does, and the March 2026 update means authority scores are a *worse* predictor than they
used to be — Google is rewarding origination over authority.

---

## 4. Korean-language keyword arbitrage

**This is the section that no competitor can copy.** `southkoreahallyu.com` writes *"religion seems
to play a key part in Isaac Toast's philosophy"* — "seems to" is where we win, because the founding
story, the franchise count, and the store-count trend are all public in Korean.

The thesis: **a Korean-reading team can see demand forming in Korea before it becomes English
search demand.** The job is to detect a Korean-side signal, verify the English side is still empty,
and publish into the gap.

### 4.1 The Two-Curl Arbitrage Test

Before any other research, run this. It takes 10 seconds and it is the whole method in miniature.

```bash
# 1. Korean demand — does Naver build autocomplete branches for this term?
curl -s "https://ac.search.naver.com/nx/ac?q={한글용어}&st=100&r_format=json&r_enc=UTF-8&frm=nv"

# 2. English demand — does Google have anything at all?
curl -s "https://suggestqueries.google.com/complete/search?client=firefox&hl=en&q={romanized}"
```

**Live result, verified 2026-07-31:**

| Query | Result |
|---|---|
| `육포깡` (Naver) | **10 branches**: 후기 · 가격 · 편의점 · 농심 · 칼로리 · 맛 · 후추 · 매콤한맛 |
| `yukpokkang` (Google EN) | **`[]` — empty array** |

That is the arbitrage gap, measured. Naver only builds autocomplete branches for terms with real
query volume, so 10 branches with commercial modifiers (가격, 편의점, 후기) is unambiguous proof of
Korean demand at scale. An empty English array means no English site has established the term yet.

**Reading the result:**

| KR branches | EN branches | Verdict |
|---|---|---|
| ≥8 | 0 | Demand gap confirmed — **now run the coverage gate below before writing.** |
| ≥8 | 1–3 | Window closing. Coverage gate is mandatory. |
| ≥8 | ≥8 | Too late — compete on specificity (§3) or skip. |

#### ⚠️ 4.1a The coverage gate — equal in weight to Two-Curl, not a footnote

**Added 2026-07-31 after the W31 cycle caught this the hard way.**

**Two-Curl measures demand. It says nothing about supply.** An empty English autocomplete array
means *nobody searches the romanized term* — it does **not** mean *nobody has written about it*.
Those are different facts and conflating them produces a confident wrong answer.

**The case that proved it — 짜르르 (Samyang beef-tallow jjajang), W31:**
- Two-Curl: Naver 10 branches, `jjareureu` **0**, `samyang jjareureu` **0** → looked like prime arbitrage
- The intended killer angle was the 1989 우지 파동 (the beef-tallow scandal that nearly destroyed Samyang)
- **But a live SERP check found Korea Herald, Korea Times and Stripes Korea had already told that
  exact story in English.** Supply existed; demand did not.
- **No demand + existing supply is the worst quadrant there is.** Correctly parked, not written.

**So run both gates and require both to pass:**

| Gate | Question | Method | Fail condition |
|---|---|---|---|
| **Demand** (§4.1) | Does anyone search this in English? | Two-Curl | EN branches ≥8 |
| **Supply** (this gate) | Has anyone already written this in English? | Live SERP + Google News on the romanization **and** the descriptive English phrase | A major English outlet already covers the specific angle |

**Search both forms.** The romanization alone is not enough — `jjareureu` returns nothing while
`samyang beef tallow ramen` returns Korea Herald, Korea Times and Stripes Korea. If the angle you
intend to write is the one already covered, the topic is closed regardless of what autocomplete says.

**The quadrant that is actually worth writing:** English demand exists (autocomplete shows a live
descriptive suggestion, even a shallow one) **and** English coverage is thin or absent. W31's
황치즈 sat exactly there — `orion moist yellow cheese chip` is a live Google suggestion, while
English coverage was limited to Korea-domestic wire briefs about a single March price spike.
| ≤3 | 0 | No demand anywhere. Skip. Not arbitrage, just obscurity. |

⚠️ **The romanization problem is real and it cuts both ways.** An empty English array can mean
"no demand yet" *or* "everyone spells it differently." Before declaring a gap, test 2–3 spellings
(`yukpokkang` / `yukpo kkang` / `beef jerky snack korea`) and a descriptive English phrase. If the
descriptive phrase has demand but the romanization doesn't, **target the descriptive phrase and
introduce the romanization inside the article** — that is how you end up owning the term when
English demand does arrive.

### 4.1b 로마자를 네이버보다 먼저 재라 (2026-08-06 신설, W33 실측)

W33에서 씨앗 31개를 돌렸고 **기각의 최대 사유가 로마자 오염**이었다 — 6건이 여기서 죽었다:

```
mychew          -> chewy.com, mychway, mychewiq
moncher         -> moncheri, moncheri nails, moncheri bridal
dezawa          -> dezawa muse cells (줄기세포 논문)
matbam          -> matbao (베트남 호스팅)
wang kkumtturi  -> wang kun, wang kuomintang (중국 인명)
yangpa ring     -> dapivirine ring
```

**제품이 아무리 좋아도 영어 핸들이 없으면 끝난다.** 그리고 이 판정은 네이버 호출 없이 1초면 끝나므로,
**Two-Curl의 순서를 뒤집어 로마자부터 재는 편이 싸다.** 한국 수요를 확인한 뒤에 죽으면 그 확인이 낭비다.

대안 핸들이 있으면 살릴 수 있으므로 `korean {서술구}`를 같이 잰다 — `korean squid chips`는 12분기가
나왔다. 둘 다 비면 기각한다. §4.1a의 "**서술형 영어 구문을 반드시 같이 검색하라**"와 같은 방향이지만,
이건 **순서**에 관한 규칙이다.

### 4.1c 네이버 자동완성은 10건에서 잘린다 (2026-08-06)

W33 씨앗 31개가 **거의 전부 KR:10**이었다. **10은 강도가 아니라 천장이다** — 한국 수요의 크기를
개수로 비교할 수 없다. **분기의 내용을 읽어야** 한다. 실제 사례: `자갈치`는 10건이 전부 부산 자갈치시장
이라 과자 수요가 0이었고, `자갈치 과자`로 다시 재서야 진짜 신호(뜻·맛 변화·출시일)가 보였다.
구글 영문은 15건까지 반환하므로 EN 쪽은 개수 비교가 유효하다.

### 4.1d 레시피 블로그가 음식 레인 최대의 커버리지 킬러다 (2026-08-06)

W33 기각 11건 중 **3건**이 레시피 블로그에 밀렸다 — 죠리퐁(Beyond Kimchee·My Korean Kitchen·
anakjajan·Nomss), 비락식혜(Maangchi·196flavors), 호두과자(**Tasting Table 전용 기사** + VisitKorea
영문). W32c의 배홍동/비빔면도 같은 사유였다.

**판별 규칙 한 줄: 집에서 만들 수 있는 음식은 이미 누가 썼다. 공산품은 안 썼다.**
씨앗을 고를 때 "이걸 레시피로 쓸 수 있나"를 먼저 물으면 커버리지 검색을 여러 번 아낀다.

### 4.1e K팝 언급은 보너스가 아니라 커버리지 위험이다 (2026-08-06)

바나나킥(제니, 2025-03 미국 토크쇼)과 칸초(정국, Weverse 라이브) 둘 다 **연예인 순간은 이미 영어
기사가 있고 제품 설명은 없었다** — 전자는 농심 보도자료와 Yahoo Finance 신디케이션, 후자는 Sportskeeda.
**제품을 쓰면 비어 있고, 연예인을 쓰면 늦는다.** 셀럽 훅은 뉴스 후크로만 쓰고 날짜를 박아둔다.

### 4.2 The source stack — verified, free, no login unless noted

**Tier 1 — free, no login, machine-readable. Build the weekly script on these.**

| # | Source | Endpoint | What it gives |
|---|---|---|---|
| 1 | **Naver autocomplete** | `ac.search.naver.com/nx/ac?q={term}&st=100&r_format=json` | Candidate validation, zero cost. **Run every candidate through this first.** |
| 2 | **Naver DataLab Shopping Insight** ⭐ | `POST datalab.naver.com/shoppingInsight/getCategoryKeywordRank.naver` | Ranked shopping keywords per category **with age/gender/device filters** |
| 3 | **뉴스와이어 RSS** | `api.newswire.co.kr/rss/theme/101` (신상품) · `/theme/116` (사업확장) · `/region/11` (해외) | Product launches + expansion announcements |
| 4 | **식품음료신문 RSS** | `thinkfood.co.kr/rss/S1N3.xml` (수출·글로벌) · `S1N8.xml` (새상품) | The only true 수출 desk with a working feed |
| 5 | **더구루 생활경제** | `theguru.co.kr/news/section_list_all.html?sec_no=52` | Densest overseas-launch signal. **No RSS — scrape.** |
| 6 | **KTO inbound by nationality** | `POST know.tour.go.kr/stat/entryTourStatDis_DataXML.do` | 75 nationalities, monthly, no auth |

**#2 is the crown jewel.** The demographic filters genuinely work, and that is where the signal
lives. Same category (식품, `cid=50000006`), same dates, verified 2026-07-31:

- **Unfiltered** → 옥수수 · 쌀20kg · 닭가슴살 · 복숭아 · 삼계탕 *(staples — useless)*
- **`age=20&gender=f&device=mo`** → 생새우 · 바위굴 · 생새우회 · 닭가슴살 · **화과자** · **볶음너구리** · **촉촉한황치즈칩**

The filtered list is the arbitrage list. Novelty snacks surfacing among young women on mobile is
exactly what shows up in Korean shopping carts months before English food media notices.

```bash
curl -s -X POST "https://datalab.naver.com/shoppingInsight/getCategoryKeywordRank.naver" \
  -H "Referer: https://datalab.naver.com/shoppingInsight/sCategory.naver" \
  -H "X-Requested-With: XMLHttpRequest" \
  -H "Content-Type: application/x-www-form-urlencoded; charset=UTF-8" \
  --data "cid=50000006&timeUnit=date&startDate=2026-07-01&endDate=2026-07-28&age=20&gender=f&device=mo&page=1&count=20"
```

⚠️ Rate-limited and flaky — a call may 301 to `/notfound.html` and then work on retry. **Treat a
301 as "retry," not "dead."** Add backoff.

**Tier 2 — needs a key or a browser. Monthly/quarterly, not weekly.**

| # | Source | Access | Use |
|---|---|---|---|
| 7 | **Naver DataLab Open API** | `openapi.naver.com/v1/datalab/search` · **1,000 calls/day** · ⚠️ signup needs **휴대폰 인증** | Trend shape over time, 2016→now, 5 groups × 20 keywords |
| 8 | **KATI (aT) K-Food export stats** ⭐ | `kati.net/statistics/monthlyPerformanceByProduct.do` · AJAX — needs Playwright | Monthly export volume by product **and country**, HS/AG codes |
| 9 | **공정위 정보공개서 비교정보** | `franchise.ftc.go.kr/mnu/00014/program/firHope/view.do` | Store-count growth by brand, 2017–2025, 17 regions |
| 10 | **KOSIS** | `kosis.kr` · email signup only, **200 calls/min** | 온라인쇼핑동향조사 `DT_1KE10041` |

**On #7's phone verification:** this is precisely the moat. Registration requires 휴대폰 인증 and a
company name (**not** a 사업자등록번호). Trivial for a Seoul team, a hard block for a foreign
operator. State this in any pitch about why our research is defensible.

**On #9, the FTC franchise data — how store counts predict overseas launches.** A 정보공개서
contains, per brand per year: 가맹점/직영점 수 by region, **신규개점 / 계약종료 / 계약해지** counts,
가맹점 평균 매출액, and 가맹본부 재무현황. The move: pull `신규개점 − 계약종료` for 외식 subcategories
year over year. **A brand going from ~30 to ~200 domestic stores in 18 months is the standard
precursor to a US/SEA franchise announcement — and it appears here months before any press release.**
We already used this once: queue item 158 (Mega/Compose/Ediya/Paik's coffee wars) is built on
2025 FTC franchise counts.

⚠️ Caveats: data is **self-reported by 가맹본부**, **외국계 브랜드 are excluded**, and filings lag —
2025 data reflects filings made in 2026. Also `franchise.ftc.go.kr/main.do` is **404**; the site
only responds at deep paths.

**On #8's timing:** KATI states `월데이터 확정 : 다음달 15일`. June data lands ~July 15. **That
15th-of-the-month drop is a recurring arbitrage window** — check it monthly.

**네이버 지식iN is the best source for "what people actually ask"** — publicly readable, no login:
search at `kin.naver.com/search/list.naver?query={term}`, then fetch `detail.naver` links from the
raw HTML (search titles are JS-rendered; detail links are not).

### 4.3 Translating a Korean signal into an English keyword bet

A Korean signal is not yet a keyword. Run it through this:

```
Korean signal detected (e.g. 육포깡 selling 3M bags/month)
│
├─ 1. Two-Curl Test (§4.1)          → KR deep, EN empty? Continue.
│
├─ 2. Is it PHYSICAL and PORTABLE?
│     A snack/product a foreigner can buy → strong (Amazon + travel intent)
│     A place only reachable in Korea     → travel-intent only
│     A meme/word                         → ✗ REJECT (definitional trap, §2)
│
├─ 3. Pick the ENGLISH entry keyword. Not the romanization alone.
│     ✗ "yukpokkang"                        → zero demand, nobody searches it
│     ✓ "korean beef jerky snack"           → verified live demand
│     ✓ "new korean convenience store snack"
│     ✓ "{category} + korean + {action}"
│     → Then own the romanization INSIDE the article, so you rank for it
│       when English demand arrives.
│
├─ 4. Apply §2 shape filter to the English keyword. No exceptions.
│
└─ 5. Add the Korean-source fact no English site has.
      This is the point of the whole exercise: a sales figure, a store
      count, a launch date, an FTC filing, a price board photographed
      this month. Cite it.
```

**Step 5 is the deliverable.** Without a Korean-source fact, we have written the same post as
everyone else, just later.

### 4.4 Worked examples — live candidates, verified 2026-07-31

**⭐ #1 — 육포깡 (Yukpokkang), Nongshim beef-jerky cracker. The pick.**
- Launched **2026-06-08**. **1M bags week one**; **3M bags month one**; now Nongshim's **#3
  best-selling snack** behind 새우깡 and 포테토칩 (한국경제, 2026-06-22 and 2026-07-29)
- Convenience stores **imposed order limits**; production raised 600k→800k bags/week (에너지경제)
- Precedent: predecessor **먹태깡 hit 52M bags in year one**, then reached H Mart. 육포깡 is
  currently *outpacing* it
- **English coverage: one wire brief, total** (Asia Business Daily EN, 2026-06-02). No English
  Wikipedia. Nothing from CNN, NYT, Eater, or Korea Herald
- **Two-Curl Test: PASS** — 10 Naver branches, empty Google EN array (verified above)
- English entry keyword: `korean beef jerky snack` (live demand confirmed) or
  `new korean convenience store snack`

**#2 — 복소사 (Boksosa) + 편의점 믹솔로지**
- 복분자주 + 소주 + 사이다, mixed at Han River parks. **Naver DataLab index 5 (Apr 21) → 100
  (May 16) → 98 (Jun 23)**
- GS25 Han River stores: **복분자 +190.2% YoY** May 2026; bagged ice +63%
- **뚱바라떼** (Binggrae banana milk + ice cup + hazelnut coffee) — notably **started by foreign
  tourists**, which is itself the story
- **English coverage: exactly one article.** No English Wikipedia
- Strong fit: Han River convenience-store picnicking is a top-5 inbound tourist activity

**#3 — 편의점 K-beauty. Best Amazon monetization of the set, and the most durable.**
- CU cosmetics sales **+28.3% (2023), +16.5% (2024), +21.4% (Jan–Nov 2025)**; beauty-specialized
  stores ~140 → ~500 by end-2025 → **target 1,000+ in 2026**; ~70% of buyers are teens/20s
- **Seven Eleven H1 2026: beauty +30% YoY, beauty sales to foreign customers +71% YoY** ← the
  killer stat for an English travel/beauty post
- **English coverage: two Korea-domestic pieces.** Nothing from Allure, Byrdie, Refinery29, Vogue.
  Every English "where to buy K-beauty in Seoul" guide is saturated with **Olive Young and Daiso —
  convenience stores are absent from all of them**
- ⚠️ Do **not** frame as "Daiso beauty" — that angle is already crowded in English

**Also**: 샤브올데이 (revenue ₩700M→₩54B in two years, 172–174 stores, **acquired by Jollibee for
₩130B**, KFTC clearance April 2026). English coverage exists but **only as M&A** — zero English
food/travel coverage of the underlying Korean all-you-can-eat boom. Belongs in `/business/` as a
Type B-2 spotlight, and it is a textbook case of the FTC franchise signal firing before the
overseas move.

### 4.5 ⚠️ The arbitrage window is now ~8 weeks, not 12–18 months

**This is the most important finding in this section and it changes how the section should be used.**

Two strong-looking candidates were **already dead on arrival** when checked:
- **얼먹젤리** (frozen jelly) — already in Korea Herald and Korea Times (2026-02-24)
- **왁뿌볼 / 말랑이** (wax balls) — **CNN, 2026-07-04**, plus Korea Herald, Korea Times, JoongAng
  Daily, already on Amazon and TikTok Shop

**The Korea→CNN lag on a visually viral item was about 8 weeks.** Buldak's 12–18 month runway no
longer exists for anything TikTok-friendly.

**What this means operationally:**
1. **Always check English coverage before writing, not after.** A Korean-side signal is necessary
   but no longer sufficient.
2. **Visually viral items are the worst arbitrage targets** — they travel fastest. A wax ball or a
   frozen jelly is on CNN before we finish sourcing images.
3. **The durable arbitrage has moved to structural / retail / channel topics** that English media
   covers late or never: convenience-store category shifts, franchise store-count trends, export
   figures, distribution changes, price movements. Nobody at CNN writes "CU's beauty aisle grew
   21.4%." That is our permanent lane.

### 4.6 ⚠️ An uncomfortable finding worth a separate conversation

Verified inbound tourism, H1 2025 → H1 2026 (KTO, via the endpoint above; matches KTO's official
release of 10,709,919 vs 8,825,967, +21.3%, first-ever 10M half-year):

| Market | H1 2025 | H1 2026 | YoY |
|---|---:|---:|---:|
| **Taiwan** | 862,236 | 1,150,446 | **+33.4%** |
| **China** | 2,526,841 | 3,211,791 | **+27.1%** |
| **Japan** | 1,619,180 | 1,949,774 | **+20.4%** |
| UK | 85,022 | 103,787 | +22.1% |
| Indonesia | 187,689 | 224,524 | +19.6% |
| **USA** | 730,771 | 811,974 | **+11.1%** |
| **TOTAL** | 8,825,967 | 10,709,919 | **+21.3%** |

**English is the slowest-growing major inbound market.** Traditional Chinese (+33.4%), Simplified
Chinese (+27.1%), and Japanese (+20.4%) are growing 2–3× faster than English (+11.1%).

This does **not** mean abandon English — our Amazon monetization and existing 309 posts are
English, and Chinese/Japanese markets have different (and for us, weaker) affiliate economics. But
it is a real strategic question the representative should see, not something to bury. Raise it
separately; do not act on it inside this playbook.

---

## 5. The weekly operating cadence

**Total: ~3 hours, once a week.** Suggested slot: Monday morning.
**Output artifact: `output/strategy/keywords_YYYY-Www.md`** — 5 scored candidates.

> **Naming (2026-07-31, after getting it wrong).** `ww` is the **ISO week number of the run date**,
> not a counter that increments each time you run the cycle. Two cycles were run on 2026-07-31 —
> ISO week 31 — and the second was filed as `keywords_2026-W32.md`, which claimed a week that had
> not happened yet and made the next step look like "W33". Renamed to `keywords_2026-W31b.md`.
> **If you run the cycle more than once in the same ISO week, suffix the letter (`-W31b`, `-W31c`).
> Never bump the week number.** Check the actual week before naming the file:
> `python3 -c "import datetime;print(datetime.date.today().isocalendar()[1])"`.
> This matters beyond tidiness: `week_2026W30.md` defers real CTR measurements to "the W32-W33
> report", and those refer to genuine future weeks. A fake W32 file collides with a real commitment.

### Step 0 — Close last month's loop (20 min, first Monday of each month only)

Do this **before** picking anything new. Otherwise we keep guessing.

1. Pull a fresh GSC export (or API call once §2.1 Action 1 is done).
2. For each post published **6–10 weeks ago**, record: clicks, impressions, CTR, avg position.
   (Under 6 weeks is too early — the W30 report already enforces a 3–7 day quarantine for judging,
   and a real read needs longer.)
3. Append one row per post to `output/strategy/keyword-bets.csv`:
   `slug, published, target_keyword, serp_score, predicted_shape, clicks_at_8wk, ctr_at_8wk, verdict`
4. **Compare clicks, never impressions or CTR across time** — see the §2.1 warning about the GSC
   impressions bug (2025-05-13 → April 2026) and the `num=100` removal (Sept 2025). Both corrupt
   impression and CTR comparisons. Clicks are clean.
5. Answer one question in writing: **did the shapes we predicted would win, win?** If comparison
   queries underperform definitional ones two months running, the §2 filter is wrong and must be
   revised. **This is the only mechanism that keeps the playbook honest.**

### Step 1 — GSC mining for CTR fixes (30 min, weekly)

New posts are not the only lever, and usually not the best one. Ranking 5–9 with zero clicks is a
**title problem**, and fixing a title is far cheaper than writing a post.

1. Open the newest export in `output/gsc/`.
2. Filter: **position ≤10, impressions ≥200, CTR <1.5%.**
3. Exclude anything **retitled in the last 60 days** — check `git log` for the file. (W30 caught
   itself about to re-edit 090/082 with evidence that was ~94% old-title data. Don't repeat that.)
4. Exclude the known structural dead ends: **ahjussi cluster (090/210), SKY cluster (082/231)**.
   These are settled — see FACTS.md. Do not spend another retitle on them.
5. Output: up to 3 retitle candidates.

### Step 2 — Korean-side scan (45 min, weekly)

1. Pull the four feeds: 뉴스와이어 `theme/101` + `theme/116` + `region/11`, and 식품음료신문 `S1N3`/`S1N8`.
2. Scrape 더구루 `sec_no=52` for the week.
3. Pull DataLab Shopping Insight for 식품 (`cid=50000006`) and 화장품 with
   `age=20&gender=f&device=mo` — **the filtered list, not the unfiltered one**.
4. Note anything appearing in **two or more** sources. Single-source signals are noise.
5. Run the **Two-Curl Arbitrage Test** (§4.1) on each. Keep only KR-deep / EN-empty.
5a. **Run the coverage gate (§4.1a) on every survivor — mandatory, not optional.** Search both the
   romanization AND the descriptive English phrase. Two-Curl proves demand; this proves nobody has
   already written it. Both must pass. (W31: 짜르르 passed Two-Curl and failed here.)
6. **Check English coverage explicitly** — search the romanization and the descriptive phrase in
   Google News. If CNN/Korea Herald/Eater already has it, the window is closed (§4.5).
7. Output: 3–6 raw candidates.

### Step 3 — Expand and shape-filter (30 min, weekly)

1. Run `scripts/keyword-expand.mjs` (template expansion, §1.1) on each surviving candidate.
2. Apply the **§2 decision tree** to every generated keyword. This is fast — most die at step 1 or 2.
3. Cross-check each survivor against the **duplicate audit**: `content/data/topics-queue.json`,
   `content/blog/*.md` titles, and `output/final/`. Semantic overlap counts as duplicate even when
   the title differs. Record the audit line: `duplicate audit: checked queue + blog + final; excluded X, Y`.
4. Output: 5–8 shape-passing keywords.

### Step 4 — SERP inspection (45 min, weekly)

1. For each survivor, open **both** SERP views (§3.1) manually in incognito. Do not script this.
2. Score against the **§3.3 rubric**. Record the score and the reason for each deduction.
3. Keep those scoring **≥65**.
4. Output: the week's artifact — `output/strategy/keywords_YYYY-Www.md`, 5 candidates with scores.

### Step 5 — Commit to the queue (10 min, weekly)

Add winners to `topics-queue.json` with **structured** fields, not free-text notes. The current
queue buries demand evidence in unqueryable prose; `business-topics-queue.json` already has the
better schema. Adopt it:

```json
{
  "id": 182,
  "title": "Korean Beef Jerky Snack: Why Yukpokkang Sold 3 Million Bags in a Month",
  "target_keyword": "korean beef jerky snack",
  "keyword_shape": "identity_specific_product",
  "serp_score": 78,
  "serp_score_date": "2026-07-31",
  "demand_evidence": {
    "source": "naver_autocomplete + hankyung",
    "kr_branches": 10,
    "en_branches": 0,
    "detail": "3M bags in month one; Nongshim #3 snack; 한국경제 2026-07-29"
  },
  "korean_source_fact": "Production raised 600k->800k bags/week; CVS order limits imposed",
  "duplicate_audit": "checked queue + blog + final; no snack-brand overlap",
  "amazon_path": "korean snack variety pack / nongshim",
  "status": "pending"
}
```

### 5.1 The one script to write

`scripts/keyword-expand.mjs` — the only new automation this playbook needs.

**Input**: a seed term. **Output**: JSON of expanded keywords, each pre-tagged by §2 shape class
with reject markers already flagged.

It should: hit Google suggest with the **template list** from §1.1 (not alphabet soup); hit
Amazon and YouTube suggest for the same seed; hit Naver autocomplete for the Korean term if
supplied; tag every result `definitional` / `retail` / `local` / `comparison` / `mechanism` /
`experience` / `practical`; and flag the `reddit` suffix. Throttle to ~4 req/sec.

**Do not build a SERP scraper.** Google and Bing return JS shells; DuckDuckGo's HTML endpoint
worked for ~5 queries in testing and then began serving empty results and challenge pages. §4 SERP
inspection stays manual. This is a deliberate decision, not an omission.

---

## 6. Reliability: what to trust, what is noisy

Stated honestly so nobody over-weights a soft signal.

### Genuinely reliable — act on these directly

| Method | Why it's solid |
|---|---|
| **Our own GSC clicks** | First-party, and clicks are unaffected by both the impressions bug and the `num=100` removal |
| **Autocomplete presence/absence** | Direct from the engine, not modeled. Binary and reproducible — we re-ran it and got identical output |
| **Naver autocomplete branch depth** | Naver only builds branches for real query volume |
| **DataLab Shopping Insight rankings** | Real Naver commerce data. We independently reproduced the exact ranked list |
| **Manual SERP inspection** | Ground truth. Slow, but it does not lie |
| **The §2 shape filter** | Backed by our own 42× measured CTR spread across query types |
| **AIO trigger-rate table** | Ahrefs, 146M random SERPs — best methodology in the space |
| **FTC franchise store counts** | Statutory filings. Self-reported, but legally consequential |
| **KATI export figures / KTO arrivals** | Official statistics with published revision schedules |

### Noisy heuristics — directional only, never decisive

| Method | Why it's soft |
|---|---|
| **Google Trends at low volume** | Sample not census; identical queries measured 8 vs 23 across exports. **Returns 0 for our best keywords** |
| **Bing volume numbers** | Real, but ~0.6% mobile share vs our 64.7% mobile readers. Relative ranking only |
| **Keyword Surfer volumes** | Surfer's estimates, not Google's |
| **Free authority scores** | Different link graphs, not comparable. March 2026 made them *worse* predictors — Google now rewards origination over authority |
| **"Beatable #1" judgment** | Genuinely subjective. Log the call and check it in Step 0 |
| **Single-source Korean news** | 더구루 is often secondhand and uncited. Require two sources |
| **AIO coverage percentages** | Published estimates range **13%–60%**. Use the *trait table*, never a headline coverage number |

### Known-unknown — do not pretend we know this

**Which query types Reddit dominates.** Every published figure traces to SEO blogspam recycling an
unsourced "42% of product comparison queries." We will not cite it. Build this from our own logged
SERPs over time.

### 6.1 ⚠️ A correction to our own published diagnosis

`reports/competitor-study-v2-verified-2026-07-30.md` states we are **"86.4% below"** benchmark
CTR — 1,216 clicks against a predicted ~8,950. **That comparison is against the wrong curve, and
the number should not be repeated.**

Published CTR curves differ by an order of magnitude depending on data source:
- **Clickstream/meta-analysis curves** (First Page Sage et al.) put position 1 at **39.8%** and
  position 7 at **3.0%**. These reflect high-volume, well-matched, largely branded/navigational
  queries.
- **GSC-aggregate curves** (Ahrefs, 300k keywords, Dec 2025) put position 1 at **3.9%** without an
  AIO and **1.6%** with one — because GSC data is dragged down by an enormous long tail where a
  site ranks for queries it only tangentially matches.

**A site's own GSC CTR must be benchmarked against the GSC-based curve.** Applying the observed
position-7 decay (~6.5% of position 1) to the GSC anchors gives an expectation of roughly
**0.25% (no AIO)** to **0.10% (AIO present)** at position 7.81. *(This derivation is ours, not a
published figure — treat it as an estimate.)*

**Our 0.363% is at or slightly above that expectation.** We are not uniquely broken.

**Why this matters, and why it does not change the strategy:** the "we're 86% below benchmark"
framing implies a site-wide quality or CTR failure, which invites the wrong fixes (rewrite
everything, migrate URLs, redesign). The real picture is narrower and more actionable: **our
aggregate CTR is dominated by high-impression definitional queries that resolve on the SERP.**
`korean convenience store breakfast` at **14.75%** and `ahjussi` at **0.058%** on the same site with
the same authority is the whole story. **This is a query-mix problem, and query mix is exactly what
this playbook controls.** The conclusion of the competitor study — narrow to specific products with
"what is / how does it work" framing — is correct. Only its diagnostic framing needs fixing.

---

## 7. Things that sound good and do not work

Recorded so nobody spends a session rediscovering them.

### Dead or now-paid — do not put these in a tool list

| Thing | Status |
|---|---|
| **Reddit `.json` endpoints** | **403 since ~May 2026.** We tested `/search.json`, `/hot.json`, `old.reddit.com/*.json`, `api.reddit.com` — all 403, all User-Agents. Guides claiming "10 QPM unauthenticated" are stale |
| **`&num=100`** | Disabled mid-September 2025. Silently returns 10 |
| **Google / Bing SERP HTML scraping** | Both return JS-required shells with zero results. Google has required JS rendering since ~Jan 2025. A Bing grep hit for "Related Searches" is a **JS i18n string table**, not results |
| **DuckDuckGo HTML scraping at volume** | Worked for ~5 queries in our test, then empty results and challenge pages |
| **Google Trends unofficial API / pytrends** | Our direct test returned **429** |
| **Google Trends official API** | Application-gated alpha since 2025-07-24, still not GA. Most applicants never admitted |
| **`related:` / `link:` / `cache:` operators** | Removed 2023 / 2017 / 2024 |
| **`completion.amazon.com/search/complete`** | **404.** Use the `/api/2017/suggestions` path |
| **Pushshift, redditsearch.io, camas.unddit.com** | Dead. **PullPush** works but is frozen at 2025-05-19 |
| **korea.kr RSS** | Officially discontinued. List page still scrapable |
| **namu.wiki RecentChanges** | Cloudflare JS challenge; returns a 3.6 KB shell. Article pages work fine (580 KB) |
| **namu.news** | HTTP 410 Gone |
| **TikTok `creative_radar_api`** | Returns `{"code":40101,"msg":"no permission"}`. Browser automation only |
| **Instagram hashtag volume** | No free velocity metric exists in 2026 |
| **Waygook.org** | Frozen since 2019-03-23 |
| **Korea4Expats** | HTTP 500 |
| **네이버/다음 카페** | Login + per-cafe join approval + JS iframes. Manual only |
| **data.go.kr KATI mirror** (15050359) | Stale one-time snapshot |
| **old `kto.visitkorea.or.kr` monthly stats** | Dead link, widely cited. Use `know.tour.go.kr` |
| **GummySearch** | Shut down 2025-11-30 |

### Bait free tiers — technically free, practically useless

| Tool | Free tier | Verdict |
|---|---|---|
| **AnswerThePublic** | 3 searches/day; free tier **not even listed on its own pricing page** | ❌ Cut |
| **Ubersuggest** | 3/day shared across all reports, ~10 rows vs 300+ | ❌ Cut |
| **Moz Link Explorer** | 10/**month** | ❌ Use Keywords Everywhere (500/day) |
| **Keywords Everywhere** | Rich features but **volume/CPC/trend are credit-only**; their own FAQ shows **54 credits for one search** | ⚠️ Ideas only |
| **Google Keyword Planner** | Ranges only (1K–10K) without active spend — **confirmed still true in 2026** | ⚠️ Forecast workaround only |
| **DataForSEO** | No free tier ($1 trial, $50 min) | ❌ Not free |

### Methods that sound smart but mislead

1. **Using Google Trends to validate a long-tail topic.** It returns **0** below roughly several
   hundred searches/month. Our best keywords live below that floor. **This would kill exactly the
   topics we want.** Trends is for seasonality and direction only.
2. **Trusting a `site:` result count.** John Mueller: "not meant to be complete or used for
   diagnostic purposes." A documented case: "About 588,000 results" → ~832 actual.
3. **Assuming Looker Studio bypasses GSC's row cap.** It is bound by the same
   **50,000/day/site/search-type** ceiling as the API.
4. **Comparing GSC impressions or CTR across time.** The impressions bug (2025-05-13 → Apr 2026)
   and the `num=100` removal (Sept 2025) both corrupt it. **Compare clicks.**
5. **Multiplying Bing volume by 10–20× to estimate Google volume.** Folklore. No source
   substantiates any multiplier.
6. **Using `gl=` to geo-target autocomplete.** Ignored. We got byte-identical results for `us`,
   `kr`, and `ph`. Results follow the requesting IP.
7. **Treating shallow autocomplete as low value.** `korean convenience store breakfast` returns 2
   suggestions and converts at **14.75%**.
8. **Chasing high-impression definitional clusters with retitles.** 090 and 082 were both retitled
   2026-07-18 and remain flat. Settled — see FACTS.md.
9. **Gating topic selection on image availability.** Reversed by representative instruction
   2026-07-27. Topics first, images procured after via the 4-tier waterfall in `CLAUDE.md`.
10. **Reading a Korean-side signal as sufficient on its own.** The window is now ~8 weeks for
    anything visually viral (§4.5). Always check English coverage before committing.

---

## Appendix — quick reference card

```
WEEKLY (3h, Monday)
  Step 1  GSC CTR fixes      30m  → up to 3 retitle candidates
  Step 2  Korean-side scan   45m  → 3-6 raw candidates
  Step 3  Expand + filter    30m  → 5-8 shape-passing keywords
  Step 4  SERP inspection    45m  → 5 scored candidates (artifact)
  Step 5  Commit to queue    10m  → structured topics-queue entries

MONTHLY (first Monday, +20m)
  Step 0  Close the loop          → keyword-bets.csv, compare CLICKS only
  Also: KATI export data drops on the 15th

REJECT INSTANTLY
  meaning · what does X mean · artinya · 뜻 · a single foreign word
  where to buy · price · near me · cheap · order · delivery
  any foreign city name
  broad abstract noun with no action

ACCEPT
  A vs B · A or B · X difference
  how does X work · how to eat X · X instructions
  is X worth it · does X actually work
  {specific Korean thing} + {specific situation}

SERP: ≥65 to write.  AIO present = 0/25 and usually fatal.
      Aggregator-heavy SERP = target, not wall (March 2026 core update).
      Reddit #1 = yellow, not red (Reddit #2→#4 visibility, Aug 2025→Mar 2026).

TWO-CURL ARBITRAGE TEST
  ac.search.naver.com/nx/ac?q={한글}&st=100&r_format=json     → want ≥8 branches
  suggestqueries.google.com/complete/search?client=firefox&hl=en&q={romanized}
                                                              → want []
```
