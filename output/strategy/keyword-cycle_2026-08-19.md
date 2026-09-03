# Weekly keyword cycle — 2026-08-19

Lane: **1차 (음식-구체)**. 2차 (K팝 굿즈·뷰티) remains closed until the 2026-09-23 GSC pull
confirms the 1차 cohort CTR gate. Previous cycle shipped `402`–`406`.

## Method run

Romanization first (§4.1b), then Naver, then the supply gate (§4.1a). 14 seeds tested.

## Candidates, ranked

| # | Seed | KR | EN romaji | EN descriptive | English coverage | Verdict |
|---|---|---|---|---|---|---|
| 1 | **누네띠네** | 10 (incl. `이름`) | **1, clean** | 10 (polluted by 달고나/squid game) | **none found** | Best arbitrage |
| 2 | **붕어싸만코** | 10 | 2 | **10** (`fish shaped ice cream sandwich`, `red bean`) | Allrecipes + Korea Herald, both on the Costco export angle | Strong; write the product, not the export |
| 3 | **델라페** | 10 | 10 — and the branches are the product line | 0 | one Chosun price brief | W31 황치즈 quadrant |
| 4 | **회오리감자** | 10 | dead (`hunger games`) | 10 (`near me`, `frozen`, `machine`) | listicle only | Viable, recipe risk |
| 5 | **카스타드** | 10 (incl. `원조`) | 8 | 1 | Korea JoongAng recall story; Lotte/Orion taste test | Window closing; recall is honest-notes material |

## Rejected, with reason

- **어묵국물** — KR branches are 레시피/만들기. Recipe territory (§4.1d).
- **웨하스** — romanization resolves to **whatsapp**. Also KR polluted by Loacker and Manner.
- **뻥튀기** — EN carries `where to buy` (retail marker) and `recipe`.
- **떡꼬치** — `recipe`, `near me`, `sauce`. Recipe plus local markers.
- **군고구마** — romanization 2; KR branches are mostly 군고구마바, an ice-cream product, not the food.
- **오예스** — romanization resolves to `what is oh no in korean`.
- **홈런볼** — EN 10, already `deprioritized` in the queue.
- **편의점커피** — real demand but sits on top of `402`, `278` and `027`. Cluster expansion, not new.
- **커피우유** — viable but weaker than the five above; hold as a reserve seed.

## Dedup

Checked against all 373 published titles and the queue. No conflicts. Two adjacencies to cross-link
rather than avoid: `335` (ice cream ranking) **does not mention 붕어싸만코** — verified by grep, it
covers 메로나, 죠스바, 스크류바 and 월드콘 — and `128` Yakgwa / `Kancho` sit near 누네띠네 without
overlapping it.

---

## Shipped — 2026-08-19

All five candidates published, deployed and verified HTTP 200. Reviewer 100/100 on each.

| Slug | Seed | The fact the post is built on | Words |
|---|---|---|---|
| `407` | 누네띠네 | The name is a bilingual pun on the Italian *sfogliatine glassate* it was copied from | 2,042 |
| `408` | 붕어싸만코 | 싸만코 = 싸고 많고, "cheap and plentiful" — and the fish shape came **fourteen years after** the name (square 1976, fish 1 Mar 1990) | 1,842 |
| `409` | 델라페 | CU's private label cut price **twice into 10–12% annual growth** — Feb 2025 (커피플레이션) and 11 Mar 2026 (₩900), landing under 컴포즈커피 | 1,871 |
| `410` | 회오리감자 | Invented 2006 by 이봉구 from a **persimmon-peeling machine**; 회오리 is a trademark, so half of Korea's stalls write 스프링감자; the machine wants the small low-grade potatoes farmers could not sell | 2,051 |
| `411` | 카스타드 | Lotte is 원조 (1989 KR / 1986 JP), Orion copied in 2004 — the **mirror image of Choco Pie** — and Orion's 계란을 듬뿍 box has 23.39% egg against Lotte's 24% | 1,852 |

### What the cycle got right

The romanization-first method held. Every one of the five had a Korean-source fact with **no English
equivalent anywhere**, which is the only thing that makes a 1차-lane post defensible against the
retail SERPs.

### What to carry forward

- **델라페 nearly collided with `402`.** The dedup pass at candidate stage looked at the *seed*
  (델라페) and not at the *mechanic* (a pouch poured into a separately bought ice cup), which `402`
  already owned. It was resolved by splitting ownership — `402` keeps the ice cup, the hygiene data
  and the "why sold separately" explanation; `409` takes the brand, the lineup and the price history
  — and cross-linking. **Check the mechanic, not just the noun.**
- **`409` supersedes a claim in `402`.** `402` says the convenience-store route is "no cheaper" than
  Korea's low-cost café chains at ₩1,800–2,000. CU's March 2026 ₩900 line makes that false at CU
  specifically (~₩1,500 bundled). `402` has not been amended; do it on its next refresh rather than
  opening a published post for one sentence.
- **No usable photograph existed for any of the five.** Ten EpicKor charts were built instead. This
  is now the normal outcome for named packaged products, not the exception — see the 0차 sourcing
  step in CLAUDE.md.
- **회오리감자 carried recipe risk and avoided it by writing the machine.** The invention is the
  cutter, not the seasoning, so the anti-recipe framing was also the more accurate one.
