# Competitor Study v2 — Verified, Adversarially Fact-Checked

**Date**: 2026-07-30
**Supersedes**: `competitor-study-creatrip-trazy-landscape-2026-07-30.md` (v1). Read this file instead; v1 contains claims this pass refuted.
**Method**: 9 research passes. v1's headline claims were then attacked by an adversarial fact-check and re-tested by an independent 53-query sweep using different queries.

---

## 0. Executive summary

**We do not have a ranking problem. We have a promise problem.**

251 indexed pages, **335,211 impressions, average position 7.81** — and **1,216 clicks (0.363%)**. Benchmark CTR for that position curve predicts ~8,950. We are **86.4% below** what our own rankings should yield. The gap is ~7,700 clicks/quarter.

The cause is visible in one comparison. `southkoreahallyu.com` — **two British bloggers in London, 153 posts** (half our 309), using photos from a 2023 trip — outranks and out-clicks us. Their every post contains prices, exact menu items, and store-level operational facts. Ours promise definitions.

**The three decisions that follow**: (1) do NOT migrate URLs, (2) narrow to specific Korean products/food with "what is / how does it work" framing — never "where to buy", (3) compete on the one thing no competitor can copy: **we are in Korea and can read Korean.**

---

## 1. Three claims I made and then had to retract

Recorded because the pattern matters more than the individual errors.

| Claim I made | What verification found |
|---|---|
| "Creatrip affiliate is 6-8%, not 40%" | **Wrong.** 40% was right. I "corrected" a correct figure by trusting a blog page that was an Apr–Dec 2025 promo, superseded by a 2025-09-29 revamp. The page had its own expiry date printed on it. |
| "URL migration is the highest-leverage fix" | **Refuted.** See §3. Google explicitly calls this "some risk + usually no gain." Our own site contains a natural experiment disproving it. |
| "The #1 competitor is one solo blogger" | **Wrong.** `thesoulofseoul.net` has **8 author accounts**, 934 posts, a 2013 domain, and contributors including an ex-Korea Times copy editor. Not a barrier-free target. |

**Lesson**: in all three cases I found one source, stopped, and asserted. The fix is asking "is this source current, and is this correlation or causation?" before reporting.

---

## 2. What is actually true about the landscape

Two independent sweeps (54 queries, then 53 *different* queries) agree:

| | v1 sweep | Independent re-test |
|---|---|---|
| Distinct domains | ~270 / 54 queries | **297 / 53 queries** |
| Appeared exactly once | ~180 (67%) | **228 (77%)** |
| Top domain share | 22% | **13.2%** |
| Korean government sites | 12 appearances | **3 queries (5.7%)** |

**Fragmentation is confirmed and is a property of the space, not an artifact.** No incumbent. Government presence is even weaker than first measured — confined to topics government literally administers (visa, official programs).

**But "low barrier" was overstated.** The two "AI content farm" sites cited as proof:
- `korea-insider.com`: **273 pages, not 349** — the count *fell*. **Stopped publishing 2026-06-02**, dark for 8 weeks. 1-year domain registration, WHOIS-private, byline "Team Korea Insider." Classic churn-and-burn. Its current ranking is the *lagging* state of a decayed site.
- `koreapeek.com`: 155 posts, still ~1/day, 1-year domain, anonymous "Ted K" persona claiming "35 years in Korea," and its first post is stamped **the exact day the domain was registered** — synthetic dates.

**Honest read: a content farm can buy a SERP position in ~10 weeks. Nothing shows it can hold one.**

### The one real example of niche domination
**`90daykorean.com` owns Korean-language-learning**: **7 of 9** language queries (78%), and **0 of the other 44**. Founded 2013 on one sharp wedge (a 90-minute hangul challenge), expanded only within that vertical, monetizes through a paid course — not affiliate. Named co-founders, ~8 named native coaches.

This is the "dominate one segment, then widen" thesis working in the real world. The sober caveats: **12 years**, real named humans with credentials, and a product the SERP can't commoditize.

---

## 3. The URL question — settled, do not migrate

**Google, John Mueller, answering this exact proposal (2022):**
> "Will it help the site? Very, very rarely… Will a change negatively affect the site for a while? Probably. **Some risk + usually no gain**."

Also: *"Keywords in URLs are overrated"* (2017); *"Even changing from `?id=12345` to `/cheese` wouldn't be a big/noticeable thing on its own"* (Jan 2025).

**Our own site already disproves it.** `/blog/074` (numeric) and `/blog/074-the-world-of-underground-shopping-malls-in-korea` (keyword) are both indexed on identical content: **position 8.0 vs 7.9.** And our two *worst*-CTR pages (090, 082) already have keyword filenames — applying the v1 logic to our own data would "prove" keyword URLs hurt, which shows the logic is worthless.

**And the slug is invisible where it matters.** Google removed URL paths from mobile SERPs entirely (Jan 2025). **64.7% of our impressions are mobile** — and mobile CTR (0.39%) already beats desktop (0.32%).

**Decision: no migration.** The only defensible version is **keyword slugs for new posts only** — free, zero risk, matches Google's own readability guidance.

### Where the effort goes instead, by evidence strength
1. **Title/meta surgery** — the only lever with real controlled evidence (SearchPilot server-side split tests: +5.2%, +8.5%, +10%, +17.5%). Exactly matches our profile: ranks fine, no clicks. **But 090/082 were retitled 2026-07-18 — measure that in the next GSC pull before touching them again.**
2. **Stop counting definitional impressions as opportunity.** 43% of our impression mass (79,929) sits on queries Google answers in the SERP: **0.058% CTR**. `ahjussi meaning` gets 0.03% *at position 6.1*. Unwinnable by design.
3. **Internal linking** — real split tests: +25%, +7%, +5%. Zero risk, compounds across 309 posts.
4. Content refresh discipline — plausible; headline stats are vendor self-report.

---

## 4. The lane — our own data plus the SERP evidence agree

### Our lane performance
| Lane | Pages w/ data | Clicks | Impressions | CTR |
|---|---|---|---|---|
| **Food (specific)** | 45 | 113 | 9,553 | **1.183%** |
| Shopping/product | 39 | 110 | 18,584 | 0.592% |
| Culture explainer | 55 | 172 | **32,085** | **0.536%** |
| *Site-wide* | *309* | *1,234* | *339,670* | *0.36%* |

**Food converts 2.2× culture and 3.3× the site average — and we have 118 posts in culture versus 55 in food.** Most resource in the worst lane.

### The critical split inside the product lane
| Query shape | Who wins | Verdict |
|---|---|---|
| **"where to buy X"** | Retailers only — sayweee ×5, instacart, Walmart, Target, Amazon. **Zero editorial results.** | **Closed. Unwinnable with articles.** |
| **"what is X / how does it work / X vs Y"** | No authority. `epickor.com/blog/171` at **#7**, `/blog/071` at **#7**, `samgak kimbap how to open` → a 2014 Blogspot post at #1 | **Open, and we're already in it.** |

Across 10 product queries, **no domain appeared more than once except Amazon and Wikipedia.** No Korea publisher has assembled this lane.

**This directly changes the approved pending batch**: Ppushu Ppushu framed as "where to buy" loses. Framed as "what it is / how you eat it / why it's crushed in the bag" wins.

---

## 5. What the two real competitors actually do

### southkoreahallyu.com — the closest match to us, and they're beating us
Caroline & Neil, **London-based**, a country vertical spun off `cktravels.com` in June 2025. **153 posts. 13 months old.** Amazon tags `southkoreahallyu-20/-21`.

Their entire moat is **date-stamped transactional numbers**:
> "As of **summer 2025**, a **500ml can of Cass beer** in Korean convenience stores usually costs **2,800 Won**… the **660ml bottles** are roughly the same price"

Their Isaac Toast post (competing directly with our Blog `153`) does it in **1,103 words**:
> exact June-2025 menu prices · "**kiosks have a language setting you can change to English**" · "**most branches don't have toilets**" · "Myeongdong has a **no photography policy**" · "**quotes from the Bible on the food wrapping**" · "**the sauce inside often drips on your first bite**"

Six facts that require standing in the store. That's the whole moat, in 1,100 words.

**Their Amazon architecture — directly copyable:**
- **One hub post** (`/south-korea-packing-list-travel-essentials/`) carries ~28 Amazon links, one per H2 section
- Topical posts carry **0–3** contextual links to the exact Korean product described (brand name as anchor text: `Nongshim (농심)` → Shin Ramyun)
- **No CTA boxes, no buttons, no cards.** Just a bolded text link ending in `>`: *"**Check out neck pillows on Amazon >**"*
- About half are **Amazon search links**, not ASINs — never go out of stock, never need maintenance
- **They tell you not to buy**: *"you can also buy really cheap power packs in **Daiso from 3,000 Won**"* — right beside the affiliate link

Their real revenue is tours/hotels (Klook ×3 IDs, Viator 23 links in one post, GetYourGuide, Booking, Agoda), not Amazon.

### thesoulofseoul.net — the maintenance operation
934 posts, 8 authors, 2013 domain. **632 of 934 posts (68%) modified in the last 19 months — ~50 posts/month.**

The mechanic worth stealing: **she renders only `Last Updated on July 24, 2026`** and hides the publish date (both stay in schema). A reader landing on a 2017 post sees a 6-day-old page. Her titles carry **no year stamps** at all, so they never go stale.

Her structure: a `Quick Guide` `<table>` immediately after the intro (*"Best exits: Seongsu Station Exit 3 or 4 | Days needed: 1–2 | Distance from Busan: 30 min by KTX"*), then every H3 is a **named venue with Hangul** — `Museum Kimchikan (뮤지엄김치간)` — with a fixed Address / Directions / Hours block including the **subway exit number**.

Monetization: **zero Amazon links.** Mediavine display + Klook/Booking/Agoda/**Creatrip** + a **$25** Gumroad itinerary pack + her own 7-day tour.

---

## 6. Our actual advantages — the part no competitor can copy

1. **They cannot read Korean.** SKH writes *"religion **seems to** play a key part in Isaac Toast's philosophy."* The founding story, franchise count, and store-count trend are all public in Korean. 나무위키, 네이버 플레이스 리뷰, 다나와 가격, 공정위 정보공개서, KOSIS, 서울시 공고 are entirely closed to them. **"Seems to" is exactly where we win on the same keyword.**
2. **Their prices are decaying.** SKH's whole edge is stamped *"based on our last visit in May 2025"* — **14 months stale today**, and staler every day until their next flight. We can re-verify a convenience-store price board in an afternoon. **"Korean Convenience Store Prices — Checked This Month" beats them on the only axis they compete on.**
3. **Neither cites sources.** ~85% of their external links are affiliate. Our business-section sourcing standard applied to culture/food posts is a genuine differentiator nobody in this space offers.
4. **Coverage gaps**: no Gangneung, Yeosu, Tongyeong, Chuncheon, Ulsan, Mokpo. No practical-living content (pharmacy navigation, delivery apps, admin setup).
5. **Neither runs short-form video.** SKH's distribution is a Facebook group; Soul of Seoul's is Pinterest.

**The honest counterweight**: Hallie's *"I came to Seoul in 2006 and I'm still here"* and *"my husband is from Busan"* do E-E-A-T work we cannot replicate — a Korean team saying "I've lived in Seoul 20 years" carries no signal to a foreign reader, because of course we have. Our authority claim has to be built on **verifiable Korean-source access**, not personal narrative.

---

## 7. Craft changes — adoptable this week, no new assets

| Change | Source | Note |
|---|---|---|
| Render **`Last Updated`**, hide publish date (keep both in schema) | Soul of Seoul | template change |
| **Drop year stamps from titles**; let the updated-line carry freshness | Soul of Seoul | ours currently go stale |
| **`Quick Guide` table** as the first element after the intro | Soul of Seoul | we already mandate `table-scroll` |
| **Hangul in every venue heading** — `Museum Kimchikan (뮤지엄김치간)` | both | free, and *easier* for us |
| Fixed **Address / Directions / Hours** block, **with the subway exit number** | Soul of Seoul | free |
| **Date-stamp every price**: "As of July 2026, ₩2,800" | SKH | our single sharpest weapon |
| Meta descriptions **200–260 chars** packed with surprising facts | Soul of Seoul | **contradicts our 120–155자 rubric — change the rubric** |
| **`+ Photos`** and a specific number in title tags | SKH | free |
| **`* * * You might like – [link] * * *`** dividers between H2s | SKH | fixes our internal-link density immediately |
| Amazon CTA = **bolded text link + `>`**, half of them search links | SKH | simpler than our boxes |
| **One packing-list hub** with 25+ Amazon links; topical posts carry 0–2 | SKH | one post |
| **Recommend against buying** when Daiso is cheaper, beside the affiliate link | SKH | free trust, more credible from us |

---

## 8. Monetization — verified

| | Creatrip | Trazy |
|---|---|---|
| Commission | **"Up to 40%"** (ceiling; category-varying; no public rate card) | 4% |
| Cookie | 30 days | **6 months** |
| Threshold | 50,000 KRW | $100/mo |
| Cash cycle | **~3 months** (confirms on service *use*) | 45 days after month-end |
| Korean entity? | **Individuals yes** (3.3% 원천징수 = Korean domestic rate). **법인 undetermined** | No restriction found |
| Exclusivity | None | None |
| Placement | — | **Own website only (§2.10)** — not Instagram |
| Excluded | Accommodation, insurance, shopping, language schools → **no Agoda conflict** | — |

**⚠️ Decline Creatrip's medical category.** 의료법 §27(3) bars 환자 유인·알선 and paid foreign-patient attraction generally requires 외국인환자 유치업자 등록. A Korean corporate entity taking referral commission carries materially more exposure than a foreign blogger. Skipping that one category removes the risk at negligible cost.

**Action**: email `partner@creatrip.com` — *"파트너 계약 주체를 법인 사업자로 등록할 수 있습니까? 가능하다면 3.3% 원천징수 대신 세금계산서 발행 방식으로 정산됩니까?"* plus asking whether individual-name contracting is an acceptable fallback.

**Disclosure conflict**: Creatrip requires top-of-post disclosure with exact wording and rejects hedging. Our rule places it mid-body at the first CTA. Fix: one top-of-article line covering all programs.

---

## 9. Recommended direction

**Narrow to: specific Korean food and everyday products, framed as "what it is / how it works / A vs B", verified from Korean sources with this-month prices.**

Why this and not something else:
- Our own best-converting lane (1.183% CTR, 3.3× site average)
- The SERP is genuinely unowned — no domain appeared twice across 10 product queries
- We already rank #7 on two of them with weak competition above us
- It is the one lane where **Korean-language access and physical presence produce facts competitors literally cannot obtain**
- It feeds Amazon naturally, and the approved Ppushu Ppushu / K-beauty batch already sits in it

What that means concretely:
- **Stop** producing culture explainers as the default (118 posts, 0.536% CTR, structurally snippet-killed)
- **Never** frame a post as "where to buy X" — retailers own that SERP absolutely
- **Every** product post carries: this-month price, Korean brand name in Hangul, where it's actually sold, one Korean-source fact no English site has, and an honest "don't buy this if…"
- Keep the Reels pipeline pointed at the same lane — it's the one distribution asset neither competitor has

**Open questions for the representative**: how hard to narrow (stop culture entirely, or cap it?); whether to email Creatrip about 법인 eligibility now; and whether to change the meta-description rubric that currently forces us into the 120–155자 range these competitors ignore.

---

## Verification status
**Adversarially tested and survived**: fragmentation; food-lane CTR advantage; the "where to buy" vs "what is" split; competitor craft specifics (raw HTML fetched).
**Refuted during this study**: URL migration leverage; "one solo blogger" narrative; "349 pages in 3 months" as durable-low-barrier evidence.
**Could not determine**: Creatrip 법인 eligibility; Creatrip per-category rates; whether southkoreahallyu runs display ads (reCAPTCHA blocked raw HTML).
**Single-point observations, not rank tracking**: all SERP positions. One locale, one day.
