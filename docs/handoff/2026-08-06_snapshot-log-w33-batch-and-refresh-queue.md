# Snapshot log — 2026-08-06 to 2026-08-07

W33 keyword cycle, five new posts, two business deep dives, five refreshes, and the
refresh queue that should stop the next session re-deriving the list from scratch.

Rotated out of root `HANDOFF.md` on 2026-08-07. Prior snapshot:
`2026-08-05_snapshot-log-hub-reels-rebuild.md`.

---

## Published — 10 posts

**New (W33 cycle, 5):** `367` 바나나킥 · `368` 썬 · `369` 고래밥 · `370` 뿌셔뿌셔 · `371` 칸초.
All reviewer 100/100 (2,311–2,345 words), live 200, image audit critical/high 0, cross-post
duplication 0. `next_slug` is `372`.

**Business B-2 (2):** `/business/ottogi-otoki-company-deep-dive` (2,557w) ·
`/business/pulmuone-company-deep-dive` (2,260w). Both 100/100, live 200.

**Refreshes (5):** `275` 용산 · `274` 롤파크 (pre-queue) · `259` 빙수 · `128` 약과 ·
`219` 라면 트렌드 (queue items 1–3).

---

## W33 keyword cycle: 31 seeds → 5 survivors

Full record: `output/strategy/keywords_2026-W33.md`. Order changed per the previous
cycle's recommendation — **dedup audit (cheapest) → Two-Curl demand → coverage (most
expensive) → imagery**.

Two rules came out of the 11 rejections, now in the playbook as §4.1b–4.1e:

1. **Measure romanisation before Naver.** Six seeds died on romanisation pollution
   (`mychew`→chewy.com, `moncher`→moncheri, `dezawa`→stem-cell papers, `matbam`→matbao).
   That test costs a second; dying after confirming Korean demand wastes the confirmation.
2. **Recipe blogs are this lane's biggest coverage killer.** Three of eleven (죠리퐁,
   비락식혜, 호두과자). **Anything a home cook can make is already written; packaged goods
   are not.**

The batch's shared character: all five correct something the English web currently states
incorrectly, and every correction came from reading manufacturer catalogues and
Korean-language sources rather than searching better. 고래밥 is universally written as
"nine shapes" in English; Orion's official chart shows **16**. 썬 sells abroad as "Orion
Sun Chips", a name **Orion does not use** — discontinued after a January 2016 fire,
relaunched April 2018 from a new Miryang line as 돌아온 썬.

**Kancho survived a total sourcing failure.** Tier 0 (Lotte Wellfood is client-rendered,
`/brand/hero/*` returns 500) and tier 1 (Commons: zero files) both failed. Tier 3 — the
representative supplying four photographs — resolved it, and it ended up the
best-evidenced of the five.

---

## Business section: two counter-examples

The section had seven B-2 deep dives and every food one told the same story: a Korean
brand overseas buyers learned to recognise. These two are the cases that story cannot hold.

**Rejected on coverage first.** CJ Olive Young has a Harvard Business School case study,
Fortune, Beauty Independent, CoStar and a dedicated April 2026 deep dive elsewhere.
hy (Fresh Manager) was already covered by Korea Herald, Korea Times, EconoTimes and Korea
Bizwire under a "threatening Coupang" angle. Both are too crowded to add to.

### Otoki — the company that did not export

- Over **85% of Korea's powdered curry market**; FY2025 revenue **₩3.6745tn** (+3.8%) with
  operating profit **down 20.2% to ₩177.3bn**, margin 4.8%. Revenue up, profit down a
  fifth — the case for going abroad in two numbers.
- Overseas share **10.8% in Q1 2025** against Samyang's 84.5% and Nongshim's 37%. Rose to
  11.5% by Q1 2026.
- The sharpest number is not the ratio: **Jin Ramen is the only Otoki product in Korea's
  ramyun top ten.** Nongshim has five, Samyang and Paldo two each.
- The 2030 answer is three buildings — Gumi ₩200bn export-only plant (2026–2029, 120
  jobs), La Mirada California (2027, ₩56.5bn), Global Logistics Center (April 2026).
  Until La Mirada opens, **over 98% of US-sold product is imported**, and the Korean
  ramyun tariff went 0% → 10% (April 2025) → **15% (1 August 2025)**.
- **The buyer-facing lead is the name**: OTTOGI → OTOKI, August 2024, Korean 오뚜기
  unchanged, both spellings live across filings, packaging and marketplaces. The article
  opens with this because it is what actually breaks procurement work.
- Indonesia is the better-designed play: MUI halal certification late 2024, ahead of
  Indonesia's **mandatory halal deadline of October 2026**, halal Jin Ramen launched
  November 2025 with BTS's Jin as campaign face. Indonesia is the world's #2 instant
  noodle market — 14.68bn servings in 2023, ~12% of global demand.

### Pulmuone — the opposite route

- Nasoya, Wildwood, Azumaya and Soga are all Pulmuone and **none say Korea on the pack**,
  because a US shopper buys tofu as protein, not cuisine.
- It bought **Nasoya from Vitasoy in March 2016 for about $50m** instead of building
  recognition, and has led the US tofu market **eleven consecutive years**. 2025 US tofu
  revenue ₩224.2bn (~$155m), roughly double 2021. High-protein tofu ₩15.6bn → ₩41.5bn
  over four years — an American protein trend, not a Korean food trend.
- **The part English coverage skips: the overseas division still lost ₩16.3bn in 2025**,
  and the trend is not clean — ₩45.5bn (2022) → ₩22.2bn (2023) → ₩5.5bn (2024) → ₩16.3bn
  (2025). Fresh tofu is a cold-chain product, which is why the US business lost money for
  two decades and why the fix is plants on both coasts. China profitable, Japan shrinking.

Both articles were sourced tier-0. Otoki's own global-network pages carry its overseas
buildings **with the new OTOKI signage visible**, so the rebrand section is evidenced by a
photograph rather than asserted.

---

## Refresh queue — written down at last

`content/data/refresh-queue.json`, regenerated with `npm run refresh:queue`.

**Why it exists.** CLAUDE.md has stated the refresh *order* since 2026-07-31 but the list
was never written, so every session re-derived it with a throwaway script and the count
moved — 20 one day, 56 the next, depending entirely on regex looseness. The rule's own
"16편" was never a list either; it was a count of GSC click clusters. And on 2026-08-06 the
two refreshes came from the click-top group instead of the food lane, skipping the stated
order, because there was nothing to check against.

**Design: tiers are editorial, gaps are measured.** Whether a post is a product piece or a
culture piece is a judgement a regex cannot make, so tier 1 and 2 are explicit slug lists
in the generator. The gap columns (₩, Hangul, year stamp, word count) are read from the
files every run, so a post leaves the queue when it is actually fixed rather than when
someone ticks it off. `status` and `note` survive regeneration.

**Sorting inside a tier is by impressions, not clicks.** Clicks top out at 7 across all 52
posts, which cannot order anything. This is not the banned comparison — the clicks-only
rule exists because Google over-counted impressions from 2025-05-13 to 2026-04 and forbids
comparing them *across time*; ranking pages inside one export is a different operation, and
the 2026-07-24 pull is outside that window.

**Four filter false positives recorded with reasons** rather than silently dropped: `261`
and `265` are semiconductors caught by "chip", `260` and `287` are appliances.

**One cohort stands out:** 18 of the original 52 have a year stamp in the title AND zero ₩
AND zero Hangul — same period, same template, same weakness. Probably worth taking as a
block.

State on rotation: **49 pending** (tier1 8, tier2 10, tier3 31), 21 recorded as refreshed.

---

## The five refreshes, and what they had in common

**Every one of them was located by a hedge sentence.** Seven consecutive cases now:

| Slug | The hedge | What was actually there |
|---|---|---|
| `198` | "if the venue is outside central Seoul" | Waterbomb moved to Goyang KINTEX; the title sent readers to the wrong city |
| `200` | vague on dates | Bookable dates existed |
| `275` | "public background sources describe it as" | Najin buildings demolished across 2025–26; 용리단길 is the reason to go now |
| `274` | "check official announcements" | 450 seats, ₩10,000/₩7,500, one-minute sellouts, and not every LCK match is in Seoul |
| `259` | "cafe menus, seasonal fruit, hotel prices change often, so verify" | The entire price structure |
| `128` | "carries a memory of a time when sweetness felt precious" | Two royal bans and a caning penalty |
| `219` | "look for creamy, saucy, onion/garlic notes" | Two named products and a Korea-only pasta |

### `259` 빙수 — a 15x price spread the article never mentioned

Bingsu means ₩9,900 at Sulbing and ₩149,000 at the Four Seasons on the same afternoon.
애망빙 is an annual Korean news story with a price history: **₩27,000** when the Shilla
brought it from its Jeju property (2008) to Seoul in **2011**, then ₩83,000 (2022),
₩98,000 (2023), ₩110,000 (2025), **₩130,000 (2026)** — 4.8x, and +18.2% year on year.
The number that *explains* rather than reports it: **one Jeju apple mango costs about
₩25,000 retail and fruit is over 70% of the selling price.**

Season dates mattered more than prices and none were present: Shilla Seoul and Signiel
close 31 August, JW Marriott Dongdaemun 3 September, Four Seasons and InterContinental
Parnas 30 September; Lotte Hotel World already closed 30 June; The Plaza is not running it.
Le Meridien Myeongdong sells the only **single-person** portion, ₩42,000.

Sulbing history restored: started **2010 in Busan as 시루** by Jeong Sun-hee, incorporated
2013, 雪氷 = snow ice, and the injeolmi bowl created the modern snow-texture format. 490+
franchises by 2018. Delivery menu runs ~₩1,000 higher per item than in store.

Corrected a framing English writing gets wrong — bingsu as "the Korean kakigori". The
shaved-ice-and-syrup format did arrive that way in 1910–45, but **shaved ice with sweet red
bean is the Korean part**, and 서빙고 was a royal ice house long before either.

2,378 → 2,634 words, ₩ 0 → 52, Korean terms 0 → 16.

### `128` 약과 — the name is the idiom

The *Goryeosa* legal prohibitions record an order in **1192** to use tree fruits and nuts
in place of 유밀과, and another ban in **1353**, both citing grain, honey and oil
consumption pushing prices up. Joseon restricted it to 헌수, 혼인 and 제향 with **장 60대**
otherwise. (Namu gives 곤장 80대 for a related offence; the encyclopedia's figure with its
stated condition was used rather than the bigger number.)

**The better find is the idiom.** Yakgwa was valuable enough to be given as a bribe, and
when wild ginseng and deer antler velvet became the going rate, people dismissed it —
이건 약과네. **"이 정도면 약과다" is now everyday Korean for "this is nothing."** A
luxury's name became the word for trivial because the luxury got out-bribed.

The modern half was equally abstract. Missing was **약케팅** (약과 + 티케팅), coined
around **장인약과 in Uijeongbu**, which sells through its own site **Mon/Wed/Fri 5pm, one
box per person**. Its hero product is **파지약과**, the broken pieces — the seconds became
the headline item. Prices read off the maker's shop, and **three of seven items were out of
stock while reading**, which is better evidence than any adjective. Also named
버들골수제약과 (Chuncheon, pastry-style, more 조청) and 타래약과 (Damyang, hand-twisted,
ginger and cinnamon), plus **CU's +158.6% year on year**.

2,141 → 2,497 words, ₩ 0 → 9, Korean terms 0 → 30.

### `219` 라면 트렌드 — the first one where the facts, not the spec, were wrong

Titled "Korean Ramen Trends 2026" and describing the creamy-spicy wave, which is the 2024
story. **2026 is the premium year**: 삼양1963 (3 Nov 2025, **₩1,900**) and 신라면 골드
(2 Jan 2026, **₩1,500**) against a standard packet near ₩1,000, with Korean reporting
through late 2025 describing a run of launches breaking ₩1,500.

**The Samyang launch date is the story.** On **3 November 1989** an anonymous letter told
prosecutors the company fried its noodles in industrial-grade beef tallow. Executives were
arrested; the tallow was edible; the **Supreme Court acquitted on 26 August 1997** — by
which point the Dobong-dong plant had closed for three months and market share had gone
from about **60% to 15%**. Samyang relaunched **3 November 2025, thirty-six years to the
day, with a noodle fried in beef tallow.** Seven million packets a month five months in.

Shin Ramyun Gold is not simply a richer Shin Ramyun: **standard uses beef and shiitake
broth, Gold specifies a chicken broth base.**

**투움바 파스타 is Outback Steakhouse Korea's signature dish**, on the menu since 2001,
named after an Australian city it has no connection to. **Outback Australia never served
it**; it survives mainly in Korea and Brazil. So the "Australian" pasta behind a Korean
ramyun flavour is one Australians cannot order. Products the article never named:
**신라면 툼바** (Sept 2024) and Samyang's **파스타테이블 투움바파스타** (Nov 2018, first).

Buying advice reversed accordingly — Buldak Carbonara is stocked internationally now, so
it wastes suitcase space; the premium tier is what does not export. Counterweight added
next to it: ₩1,900 is double a standard packet, so buy one to taste, not a case.

2,200 → 2,502 words, ₩ 0 → 18, Korean terms 0 → 17.

---

## Commits

`51b45747` ramyun reel title ONS · `22e7f44b` two business deep dives · `ce7d282e` FACTS +
HANDOFF · `59b4016e` refresh queue · `adf67ada` refresh 259 · `bb9f26a8` refresh 128 ·
`614ec390` refresh 219.
