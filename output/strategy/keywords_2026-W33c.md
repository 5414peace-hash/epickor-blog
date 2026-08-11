# Keyword cycle — 2026-W33c (run 2026-08-11)

> **Naming.** 2026-08-11 is ISO week **33**. `W33b` ran 2026-08-10, so this takes `c`.
> Never bump the week number (playbook §5).

**Result: 1 cluster expansion, 0 clean new topics — and the pending queue is not a buffer.**

The second finding is the one that matters. `topics-queue.json` shows **9 pending** topics, which
reads like two weeks of runway. Re-gated against current rules, **7 of the 9 are unwritable**. The
queue is effectively empty and has been since the rules tightened; nothing was re-checked after.

---

## 1. Method

W33b hunted new things across 4 axes and returned 0. The 2026-08-10 correction was that the axis
itself was wrong — journalists have already worked the new-things ground — and that the topics
which survived came from scanning **our own corpus** for subjects it keeps mentioning but has never
given a post to. That method was recorded as reproducible and never written down, so this cycle
built it: `scripts/find-untitled-concepts.mjs`.

It also built `scripts/keyword-expand.mjs`, which playbook §5.1 has specified since 2026-07-31 and
which nobody wrote — every cycle until now retyped the curl commands by hand.

### The corpus scan found its own top seam already mined

342 posts, 1,492 Hangul terms. At ≥5 posts and never titled, **3 rows**; at ≥3, **26**. That is
thin *because it worked*: 된장·족발·보쌈·한옥스테이 were the top of this list on 2026-08-10 and became
`372`–`375`. The seam regenerates as the corpus grows, but it does not regenerate weekly.

---

## 2. What killed what

### 2a. Already ours — 5 seeds

The scan's first version reported these as untitled opportunities. They are not:

| seed | actually owned by |
|---|---|
| 삼각김밥 | `336` Samgak Kimbap (Triangle Kimbap): The Engineering Behind… |
| 미역국 | `021` Miyeokguk Guide: Why Koreans Eat Seaweed Soup on Birthdays |
| 떡볶이 | `311` Tteokbokki: Korea's Spicy Rice Cakes, Types and Spice Levels |
| 신라면 | `346` Ansungtangmyun vs Shin Ramyun: Which Korean Ramyun to Buy First |
| 아메리카노 | `027` Iced Americano in Korea |

**All five were false negatives in the tool, not in the corpus** — see §5. Every one would have
been proposed as a fresh topic.

### 2b. Coverage gate — 5 seeds

| seed | what already exists in English |
|---|---|
| 한강라면 | koreacheatsheet, holykoly (2026), aaronandclaire, tripzilla, enko — four dedicated guides |
| 순한맛 (non-spicy ramyun) | "Top 5 Non-Spicy Korean Instant Ramen" ×2 sites, Extrabux 10-best, Soul of Seoul 13-best, Yahoo Lifestyle 17-tried. Plus our own `361` Jin Ramen Mild vs Spicy |
| 해찬들 / gochujang halal | halalcodecheck.com has a dedicated *"Is Shin Ramyun Halal? What the Label Doesn't Tell You (2026)"*; SeekersGuidance, HalalSpy, sahabah, sitehalal all cover it |
| 제로 (zero-sugar) | **Korea Times, 2025-08**, *"Zero sugar, zero guilt? Inside the 'zero' soju revolution"* — including the Korea Consumer Agency debunk (2.85–13.87% fewer calories; ordinary soju is already 0.12g/100ml) that was going to be our angle |
| 김자반 / 조미김 | `gimjaban recipe`, `costco gimjaban` — recipe-blog territory, playbook §4.1d |

§4.1d held again: **home-makeable food is already written; packaged goods are not.** Three of these
five died to recipe or listicle supply.

### 2c. Not topics — the rest

`공유마당` is an image-licence source; `종로`/`홍대`/`이태원` are district names; `가역`·`사랑`·`개입`·
`민호`·`오리지널`·`골드`·`대두` are sentence fragments or generic nouns.

---

## 3. The queue re-gate — the actionable finding

CLAUDE.md requires pending topics to re-pass the lane, query-shape and spec gates before drafting.
That had not been done since the rules changed. Applying them:

| id | topic | verdict |
|---|---|---|
| 147 | Gapjil **Explained** | **REJECT** — definition marker + single Korean word. Our measured shape CTR: 0.048% |
| 155 | Korean Corn Dogs **Explained** | **REJECT** — definition marker, *and* the playbook's own documented diaspora trap (`korean corn dog` → atlanta · bangalore · calgary) |
| 162 | Dalgona **Explained** | **REJECT** — definition marker; globally saturated since 2021 |
| 164 | Cream Cheese Garlic Bread: **Where to Find** | **REJECT** — retail/local marker; its own note says "recipe blogs worldwide" |
| 168 | K-Beauty on TikTok Shop | **BLOCKED** — 2차 레인. Gate is 1차 신규 코호트 CTR ≥1.5%; last measured 1.11%. Not a quality judgment |
| 154 | Saju Cafes: What a Session Costs | **REJECT** — shape passes, supply does not. k-saju.co.kr, KoreaPeek (2026), letseoul (2026), ivisitkorea, sajumuse, bestofkorea; prices already published (₩20,000–35,000) |
| 158 | Coffee Chain Wars: Mega vs Compose vs Ediya vs Paik's | **REJECT** — best shape in the queue (brand comparison, FTC store-count edge), but Seoulz *"Korea Coffee Franchise 2026: The 1,500-Won Trap"*, Korea Herald *"Budget or bougie"*, KED Global and Seoul Economic Daily EN already cover the comparison **and** the store counts |
| 163 | 7-Eleven Strawberry Sandwich | **PARK** — English editorial supply genuinely thin (results are TikTok discovery pages + one southkoreahallyu listicle), but **Naver returns only 2 branches**. Thin Korean demand means no Korean-source edge, which is the whole point of the lane. Also seasonal: strawberry sando is a Dec–Apr product |
| 167 | Seoul tunnel K-content hub | **PARK** — not re-verified this cycle; news-shaped, needs a current check before it can be judged |

**Four of these were rejected on the title alone.** No research was required; the markers are in the
titles as written. They have been sitting in the queue since 2026-07-27.

---

## 4. The one survivor — a labelled expansion, not a clean new topic

**Korean convenience-store sandwiches** (egg sando / strawberry sando).

- **Shape**: `korean convenience store sandwiches` · `korean convenience store egg sandwich` ·
  `korean convenience store strawberry sandwich` — 8 live English descriptive branches, sitting in
  the same cluster as `korean convenience store breakfast`, **our single best-converting query at
  14.75% CTR**.
- **Korean side**: 편의점 디저트 returns 10 branches including 신상 (new items), 추천, 조합 (combos).
- **Honest label**: this is a **cluster expansion of `171` (Korean Convenience Store Breakfast)**,
  not a clean new topic. `171` names sandwiches but does not rank them, price them, or say which
  chain carries what. `059` is the general food guide.
- **Why it is still worth writing**: it expands the highest-CTR cluster we own with the spec-v1
  material that cluster lacks — this month's prices, chain-by-chain lineup, and the Korean-source
  detail (제조사, 유통기한 rules) that no English page carries.
- **Amazon path**: weak. Convenience-store sandwiches are not purchasable abroad. Recommend the
  post carry one contextual Amazon link at most and be judged on traffic, not revenue.

---

## 5. Tools built, and the defects they exposed

`scripts/find-untitled-concepts.mjs` — corpus scan. `scripts/keyword-expand.mjs` — romanization
check, Two-Curl and template expansion in one batched pass (playbook §5.1, specified 07-31).

The ownership matcher took four corrections, each caught by a known-answer regression rather than
by review, and each would have re-proposed a written topic:

| defect | case | fix |
|---|---|---|
| Handle learning is unusable | 삼각김밥 has **one** `English (한글)` pair in 342 posts, and it is mid-sentence lowercase (`counter with a triangle gimbap`) | Romanize the Hangul and match against titles |
| Mention density is unusable | `336` writes the Hangul **once** and English thereafter, so the owner looks identical to a passing mention | same |
| Gemination | `tteokboki` vs title `Tteokbokki` | collapse repeated letters |
| Vowel and `sh` | `sinramyeon` vs title `Shin Ramyun` | fold `eo`→`u`, `sh`→`s` |
| Hard `c` | `amerikano` vs title `Americano` | fold `c`→`k`, parking `ch`/`j` first |
| Cluster finals | `dalk` vs title `Buldak` — 닭 is pronounced *dak* | finals take their pronounced value |

Regression set, re-run after every matcher change: 삼각김밥→336, 된장→373, 족발/보쌈→372, 미역국→021,
떡볶이→311, 신라면→346, 아메리카노→027, 한강라면→nothing.

**Known limitation**: the English-side scan (`--english`) works but is buried under template
boilerplate — *Amazon Associate* (340 posts), *Quick Answer* (153), *Further Reading* (65),
*Wikimedia Commons* (61). It needs a scaffolding stopword list before it is usable. Left in with
this noted rather than shipped as if it were ready.

---

## 6. Recommendation

1. **Write the convenience-store sandwich expansion** — labelled as an expansion of `171`, not sold
   as a new topic. It is the only candidate that cleared demand, supply and lane this cycle.
2. **Clear the dead queue entries** — mark 147/155/162/164 rejected with the rule that killed them,
   so they stop reading as runway. 168 stays blocked pending the lane gate.
3. **Re-run the corpus scan monthly, not weekly.** The seam refills as posts accumulate; running it
   every week will keep returning the same thin list.
4. **Next cycle's untried axis**: finish the English-side scan by adding the scaffolding stopword
   list. `Starfield Library` (9 posts) and `Dokdo Toner` (10) surfaced through the boilerplate,
   which suggests the axis has real content underneath it.

Representative approval required before drafting (CLAUDE.md: 주간 산출물 → 승인 → 집필 큐).
