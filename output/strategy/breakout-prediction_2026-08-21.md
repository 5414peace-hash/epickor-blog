# Can a breakout be predicted? — measured, 2026-08-21

The representative asked the right question: 델리만주(`071`), 아저씨(`090`) and SKY(`082`) were not
predicted. Nobody chose them expecting this. So — can the next one be chosen on purpose?

This is the measurement. Data: GSC page/query pulls 2026-05-24 → 2026-08-19, the daily page pull for
2026-08-01 → 08-18, and the seven trailing-window snapshot exports from 2026-04-27 to 2026-08-07.

## 1. The distribution is extreme

| | |
|---|---|
| Pages with click data | 354 |
| Clicks in the window | 1,804 |
| Top 10 pages | **45.5% of all clicks** |
| Top 1 page by impressions | **41.9% of all impressions** |
| Pages with **zero** clicks | **137 (39%)** |
| Median clicks per page | **1** |

A median seed returns nothing. This is the shape that makes prediction hard and makes portfolio
thinking correct.

## 2. Nothing knowable before publishing separates a winner from a corpse

Cohort: 63 posts published 2026-01-01 → 2026-06-10, split by whether they had ≥2 clicks or 0 clicks
in the snapshot ending 2026-07-08.

| Feature at publish time | Winners (n=30) | Dead (n=33) | Ratio |
|---|---:|---:|---:|
| Word count | 2467 | 2223 | 1.11 |
| Distinct Korean terms in body | 5.77 | 3.61 | 1.60 |
| Title length | 58.6 | 58.1 | **1.01** |
| Proper nouns in title | 7.93 | 7.76 | **1.02** |
| Title has a colon | 0.90 | 1.00 | 0.90 |
| Title has a number | 0.17 | 0.09 | 1.83 |
| Title starts how/what/why | 0.17 | 0.06 | 2.75 |

Category produced no split at all (28 win / 31 dead in the same category). The two ratios above 1.8
rest on 5 posts versus 2, and 5 versus 3. There is no signal here.

## 3. The representative's own example is the trap, not the pattern

The obvious hypothesis from 델리만주 / 아저씨: **a romanized Korean word in the title head.** Tested
across all 327 pages with data:

| | n | mean clicks | median clicks | mean impressions | median impressions |
|---|---:|---:|---:|---:|---:|
| Romanized Korean term in title head | 28 | **12.29** | 1 | 7,591 | 163 |
| Without | 299 | **4.67** | 1 | 706 | 171 |

A 2.6× win — until the repository's own rule is applied. **Remove the top 3 from each group:**

| | mean clicks | median |
|---|---:|---:|
| Romanized Korean term | **1.44** | 1 |
| Without | **3.70** | 1 |

**It reverses.** The entire effect is `090`, `071` and `043`. The other 25 posts carrying that exact
feature perform *worse* than average, and the medians were identical (1 vs 1) the whole time. The
impression gap is the same illusion: 10.7× on the mean, 0.95× on the median.

This is the third time this shape has appeared in this repo — 2026-07-31 (장소+결정 2.8배, carried by
워터밤 alone) and 2026-08-20 (제목 행동 단서 1.7배, carried by three refreshes). It was caught before
acting this time, which is what the rule is for.

**Conclusion: there is no pre-publication predictor. Choosing the next 델리만주 on purpose is not a
strategy that exists.**

## 4. But the outcome is decided early, and it is readable

This is the finding that replaces prediction.

**Disjoint windows** — early = the snapshot ending 2026-07-08, late = 2026-08-01→08-18 only. No
overlap, so no mechanical autocorrelation. Cohort: 75 posts published 2026-01-01 → 2026-06-10.

- **Spearman (early clicks, August clicks) = 0.630**
- Posts with **0 clicks** at 4–8 weeks: **33 posts → 2 clicks total in August.** Zero of them reached 3.
- Posts with **≥2 clicks** at 4–8 weeks: **30 posts → 84% of all August clicks from the cohort.**

40% of the cohort produced 84% of the return, and membership was already determined by week 8.

## 5. Dead posts do not revive — and effort is being spent on them right now

Refresh work between 2026-07-28 and 2026-08-14, split by whether the page had clicks *before* the
refresh. Posts published after the before-snapshot are excluded, since a new post reads as zero for
reasons that have nothing to do with being dead.

| Refresh target | n | August clicks |
|---|---:|---:|
| Had **0** clicks before (`018 029 032 038 062 083 093 172`) | 8 | **0** |
| Had ≥1 click before | 17 | **71** |

Eight refreshes returned nothing at all. **`content/data/refresh-queue.json` sorts by impressions
within each tier**, which is how high-impression zero-click pages keep arriving at the front of the
queue. The reasoning behind that choice was sound — clicks in the queue topped out at 7, so clicks
cannot *rank* the queue. But the fix is not a different sort. It is a **filter**: a page with zero
clicks should not enter the queue at all.

## 6. Depth raises the hit rate, and it survives the outlier test

Posts published since 2026-04-01 (n=253), measured on August clicks, split at the median length of
2,346 words:

| | n | hit rate | mean clicks | mean after removing top 5 |
|---|---:|---:|---:|---:|
| Longer half | 127 | **48%** | 2.05 | **1.47** |
| Shorter half | 126 | **38%** | 1.06 | **0.64** |

The 2.3× gap holds after stripping the top five from each side. Banded, the hit rate is monotonic:
36% (<2000w) → 41% → 47% → 47% → 63% (3400w+, n=8, and that band's mean collapses from 3.75 to 1.67
once 추석 `200` and `175` are removed — so the median split above is the honest version).

**"More seeds, each cheaper" is therefore the wrong move.** Thin seeds germinate less often.

## 7. Hit rate is already improving

August clicks by publication cohort:

| Cohort | posts | Aug clicks | clicks/post | hit rate |
|---|---:|---:|---:|---:|
| 2024 | 84 | 77 | 0.92 | **21%** |
| 2026 Q1 | 46 | 47 | 1.02 | **37%** |
| 2026 Q2 | 91 | 167 | 1.84 | **41%** |
| 2026-07 | 88 | 126 | 1.43 | **44%** |
| 2026-08 | 74 | 100 | 1.35 | **45%** |

Topic selection has roughly doubled its hit rate since 2024. The weekly keyword cycle is working.
It is simply capped near 45% — which is what an unpredictable game looks like when you play it well.

## What follows

Prediction is not available. Three things are:

1. **A 4–6 week tripwire.** Nobody currently reads the week-4 number, which is why refresh effort
   keeps landing on corpses. Pull GSC weekly, evaluate each post's clicks in its own 28–56 day
   window, promote at ≥2, abandon at 0.
2. **Exclude zero-click pages from `refresh-queue.json`.** A filter, not a sort. Eight refreshes
   returned zero clicks; that is the recoverable waste.
3. **Keep seeds deep.** 48% vs 38% hit rate across the median length split, and it survives outlier
   removal.

The lever on volume is real but secondary: at the current 45% hit rate and ~1.4 clicks per post per
18 days, every additional seed is worth about 0.6 clicks a fortnight in expectation — and the
expectation is the only thing that is knowable, because the individual outcome is not.
