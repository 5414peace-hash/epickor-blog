# Keyword cycle — 2026-W33b (run 2026-08-10)

> **Naming.** 2026-08-10 is ISO week **33**, not 34. The existing `keywords_2026-W33.md` was run on
> 2026-08-05 (ISO week 32) and is misnamed; rather than renaming a committed artifact this run takes
> the `b` suffix per the playbook rule "never bump the week number."

**Result: no clean new topic survived. 39 seeds across 4 axes, 0 clean passes, 2 marginal.**

This is the honest output, not a shortfall to be papered over. The 2026-07-27 precedent in
`CLAUDE.md` applies: when the cycle runs dry, surface CTR-fix candidates rather than forcing a weak
or duplicate "new" topic. §5 of this file does that.

---

## 1. What was run

Seed axis was deliberately changed from W33's "individual packaged snack" frame, which
[W33 itself flagged as thinning](keywords_2026-W33.md) — 31 seeds burned for 5 survivors, with most
rejections being *"someone already wrote it"* rather than *"no demand."*

| Axis | Seeds | Rationale |
|---|---:|---|
| A. 편의점 PB · 냉동 · 음료 신제품 | 10 | The originally planned new frame |
| B. 트렌드 디저트·음료 브랜드 | 12 | 요아정 · 컵빙수 · 하이볼 · 제로슈거 소주 등 |
| C. 외국인이 마주치는 평범한 한국 시스템 | 12 | Pivot after A/B died — the shape our own winners have |
| D. 최근 바뀐 한국 교통 제도 | 5 | Our Korean-source edge should be strongest here |
| **Total** | **39** | |

Order used (playbook §4.1b — romanization first, it is the cheapest kill):
**romanization handle → descriptive EN phrase → Naver demand → local dedup → coverage gate.**

---

## 2. What killed what

### 2a. Romanization / entity pollution — 4 seeds

| Seed | Handle tested | What came back |
|---|---|---|
| 세븐셀렉트 | `seven select` | US 7-Eleven's own brand (`seven select water`, `replenish`). Wrong entity. |
| 유어스 (GS25 PB) | `youus` | `youtube`, `youus hotel jeju`. Swallowed. |
| 하츄핑 | `hachuping` | `hachuping coloring pages` — the kids' character, not the drink collab. |
| 코인노래방 | `coin noraebang price` | 2 branches, one of them `cheapest crypto coins`. |

### 2b. Local dedup — 4 seeds

| Seed | Killed by | Note |
|---|---|---|
| 컵빙수 | `259` Korean Bingsu Guide | 259 already owns the **price** frame (₩9,900 vs ₩...). |
| 웨이팅 앱 / 캐치테이블 | `214` Korea Reservation Culture | 214 names CatchTable 7×, incl. the phone-number problem. |
| 물품보관함 | `216` Korea Hands-Free Travel | "Lockers and Luggage" is the whole subtitle. |
| 무인 사진관 | `184` + `241` | Four-cut booths and self photo studios both published. |

### 2c. Coverage gate — the big one, 6 seeds

Every one of these passed demand and dedup, then died on supply.

| Seed | English supply found |
|---|---|
| **저가커피 / 메가커피** | Korea Herald ×3 (incl. *"Low-cost, high-margin: How Mega Coffee is outperforming Starbucks Korea"*), Stripes Korea *"5 cheap Korean coffee chains"*, KED Global. Both the business angle **and** the visitor-list angle are taken. |
| **요아정 (Yoajung)** | English Wikipedia article, Little Steps HK, TIGER TIMES, SeommerDays (*Yoajung vs Yogurt World*), Creatrip, THISTOKYO. |
| **만화카페** | **Korea Herald** *[Weekender] Comic book cafes*, **Korea Times** *Evolution of 'manhwa' cafe*, TheSmartLocal, South of Seoul. |
| **ATM 외국카드** | Seven dedicated 2026-dated English guides: sdboard, discoverrealkorea, seoulnotes, behindkorea, korealivingguide, koreatravellab, goingkorea. |
| **기후동행카드** | Seoul Metropolitan Government (official EN), VISITKOREA, 10mag, Seoulnotes, Enkostay, koreatravellab, lacha, travelguideh. |
| **대형마트 의무휴업** | Died earlier — no English handle at all (`korean mart closed sunday` = 0, alt = 2). |

### 2d. Diaspora trap — 2 seeds

`무한리필` → `korean all you can eat bbq near me`, `탕후루`/`마라탕` → `near me`. Local-intent US
restaurant queries we cannot win (playbook §1c).

---

## 3. The structural finding

**The 3차 레인 (거래장벽 실용 가이드) is now saturated, and not by news outlets.** It is saturated by a
*class* of small English Korea-blogs — citygramseoul, seoulnotes, behindkorea, koreatravellab,
goingkorea, discoverrealkorea, lacha, travelguideh, 10mag — that publish freshly-dated 2026 guides
on every practical visitor topic within weeks of it becoming searchable.

That changes the arbitrage maths. Our edge was **"Korean sources have numbers and dates where
English hedges."** These sites are Korea-resident too, and they hedge much less than the 2024-era
listicles we were beating. On ATM alone there are seven of them, all current.

Two consequences worth carrying forward:

1. **A shallow-but-live English autocomplete is no longer evidence of a gap.** It now often means
   "this cluster is actively farmed." The coverage gate has to run *before* any enthusiasm, not as
   a final check — this run it killed 6 seeds that had already passed everything else.
2. **1차 레인 thinning (W33) + 3차 레인 saturation (this run) is the same signal from two sides.**
   The winnable middle is narrowing on the topics we have been fishing in. That is a strategy
   question for the representative, not something the weekly cycle can solve by trying harder.

---

## 4. Marginal survivors — not recommended without a decision

Two seeds survived every gate but only weakly. Recording them rather than promoting them.

| Candidate | Demand | Supply | Verdict |
|---|---|---|---|
| **지하철 급행 vs 완행** (`seoul express subway`) | EN 10 (`seoul subway express trains`, `korea express subway`), KR 10. Clean dedup — `202` is airport-only, `174` is etiquette. | citygramseoul has a dedicated Line-9 express-vs-local guide; several general subway guides. No major outlet. | **Competable but crowded.** Would need a genuinely better artifact (which lines actually have express, what breaks the plan) to beat incumbents. |
| **버스 환승 할인** (`seoul bus transfer`) | EN 10 (`transfer fee`, `transfer time`), KR 10. Zero dedup hits across all posts. | **Seoul Metropolitan Government's own English page** + citygramseoul + naruinfo. | **Weakest link is the official page**, which will outrank us on a rules question. Only worth it reframed as a decision ("when the discount breaks"), not as a rules explainer. |

Neither scores high enough to recommend on its own. Both are listed so the next cycle does not
re-discover and re-test them.

---

## 5. The honest alternative — CTR fixes (playbook §5 Step 1)

Mined from `output/gsc/…2026-08-07/검색어 수.csv` (1,000 rows). Filter: position ≤10,
impressions ≥200, CTR <1.5%. 104 rows matched; 68 were the known structural dead ends
(ahjussi/ajussi/ajeossi cluster, SKY cluster, ajumma, `artinya`/`itu apa` Indonesian definitional).
**36 remained.** Excluding anything content-edited in the last 60 days (`200` refreshed 08-04,
`074` refreshed 08-07) leaves these:

| Rank | Query | Impressions | Clicks | CTR | Position | Post |
|---:|---|---:|---:|---:|---:|---|
| 1 | `deli manjoo` + `delimanjoo` | **6,097** | 25 | 0.34–0.46% | 7.0–7.3 | `071` |
| 2 | `isaac toast sauce` | 1,118 | 5 | 0.45% | 9.3 | `153` |

**`deli manjoo` is the strongest CTR-fix candidate on the site right now that is not a dead end.**
The reasoning matters: this is a *product* query, not a definition query, and FACTS already records
that the same cluster converts — `deli manjoo recipe` runs **5.13%** CTR. So the demand is real and
the cluster is winnable; 6,097 impressions at 0.4% is a title/snippet problem, not a query-shape
problem. `071` was last touched 2026-08-02 for images only, so the 60-day retitle exclusion does not
apply.

`isaac toast sauce` sits at position 9.3, which reads as a **ranking** problem more than a title
problem. Lower confidence; listed second for that reason.

**Newly confirmed dead ends** (add to the exclusion list, do not spend a retitle):
`naver webtoon` (1,029 imp, 0 clicks, **position 4.0**) and `naver series` (927 imp, 0 clicks,
position 5.7) — brand-navigational queries where the searcher wants naver.com. Structurally
identical to the ahjussi class: good position, zero clicks, nothing a title can fix.

---

## 6. Recommendation to the representative

1. **Do not publish a new post off this cycle.** Nothing cleared the bar.
2. **Approve the `071` deli manjoo retitle** as this week's highest-leverage move — 6,097 monthly
   impressions currently converting at 0.4% in a cluster proven to convert at 5.13%.
3. **Decide the lane question.** 1차 레인 is thinning and 3차 레인 is saturated. The options are
   (a) open 2차 레인 (K-beauty/K-pop product) early despite the CTR gate not being met,
   (b) keep refreshing and fixing titles while the next GSC pull settles the 45-post refresh cohort,
   or (c) find a fourth lane. This is above the weekly cycle's pay grade.

**Duplicate audit line:** checked `content/data/topics-queue.json`, all `content/blog/*.md` titles
and bodies, and `output/final/`; excluded 컵빙수 (`259`), 웨이팅앱 (`214`), 물품보관함 (`216`),
무인사진관 (`184`/`241`), 코인노래방 (`003`, also died on romanization), 의사방문 (`190`),
배달비 (`178`), 무인점포 (`054`).
