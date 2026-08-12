# Package — Korean Convenience Store hub

**Status**: proposal, 2026-08-11. Representative directed the shift from per-item topic hunting to
a hub package and supplied most of the spoke ideas below.

---

## 1. Why this package, stated honestly

Two claims were made for hub-building. They are not equally solid and should not be treated as if
they were:

- **Measured (ours)**: `korean convenience store breakfast` converts at **14.75%** against a site
  average of 0.189% — 78×. This is first-party GSC data and it is the reason to pick *this* hub
  over any other.
- **Assumed (industry practice)**: that a dense cluster lifts its own members through internal
  links and topical authority. Widely held, standard practice, **and we have never measured it.**
  It is a reasonable bet, not evidence.

The package is justified by the first claim alone. The second is upside.

Two supporting facts: per-item hunting has now returned 5 → 0 → 1 across W33/W33b/W33c, and the
representative visits convenience stores near-daily, which is a real sourcing advantage for the
"you have to be standing there to know this" details spec v1 demands.

---

## 2. The finding that changes the plan: the cluster already exists

**64 posts mention convenience stores 3+ times. About 20 are substantially about them.**

| | post |
|---|---|
| 57× | `171` Korean Convenience Store Breakfast: What Locals Buy ← **the 14.75% page** |
| 49× | `345` Yonsei Cream Bread |
| 45× | `059` Korean Convenience Store Food Guide: Dosirak and Snacks |
| 39× | `335` Korean Convenience Store Ice Cream, Ranked |
| 26× | `336` Samgak Kimbap: The Engineering Behind… |
| 25× | `343` Orion Moist Yellow Cheese Chip |
| 23× | `344` Bacchus D vs F |
| 22× | `347` Vita 500 |
| 21× | `029` Korean Snacks Guide |
| 17× | `032` Viyott · `186` Honbap and Honsul |
| 15× | `358` Pororo Drink |
| 14× | `054` Automated Convenience Culture · `209` Grocery Store Tourism · `281` Korean Dosirak |
| 13× | `267` Seoul Night Picnic |
| 10× | `302` Korean Breakfast · `048` Carbo Buldak |
| 9× | `362` Korean Yakult · `366` Pocachip |
| 7× | `250` Wellness Snacks · `360` Milkis |

### CORRECTION (same day): the hub exists too

An earlier version of this file said "there is no hub page — this is a pile, not a cluster." **That
was wrong and it was not checked before it was written.** `app/convenience-store/page.tsx` has been
live at `/convenience-store` for some time: 268 lines, a four-chain comparison table (CU · GS25 ·
7-Eleven · Emart24 with each chain's exclusives), a price table stamped **August 2026**, a nine-row
how-it-works table, guide groups linking ~20 posts, and `HubLd` + `BreadcrumbLd` structured data.
`lib/convenience-store.ts` holds the data.

So the cluster is not unlinked either. Which means the remaining gaps are **narrower and more
specific than "write the hub"** — and the hub itself tells us where they are.

### The gap finder: hub rows that answer in one line and link nothing

A row that states an answer but carries no `slug` is a question the hub raises and no post supports.
Measured against `lib/convenience-store.ts`:

| | row | hub's whole answer | post |
|---|---|---|---|
| HOW_TO | Opening hours | "Usually 24 hours" | **none** |
| HOW_TO | **1+1 and 2+1** | "Take the free one yourself" | **none** |
| HOW_TO | **Parcels and ATMs** | "Both, at most branches" | **none** |
| HOW_TO | Foreign cards · Transport cards | | `201` |
| HOW_TO | End-of-day markdown | | `171` |
| HOW_TO | Microwave/hot water · Seating · Bins | | `054` · `186` · `213` |
| PRICES | all 8 rows | | `336` `345` `171` `347` `344` `346` |

**14 of 17 rows already have a post. Three do not.** That is the spoke list, and it is measured
rather than brainstormed. (It also confirms the sandwich withdrawal in §7: the PRICES sandwich row
already points at `171`.)

**So the job is:**

1. **Write the missing spokes** — §4, now down to three candidates.
2. **Link them back into the hub** by adding the `slug` to those rows, which is a one-line change.
3. **Do not re-write what is already deep.** Snacks, drinks, ice cream, dosirak and breakfast are
   covered well. Adding another snack post is the per-item habit in a new costume.

---

## 3. What the English competition actually looks like

Searched 2026-08-11. The field is **listicle "ultimate guides"**:
hungrypursuit *"The Ultimate Korean Convenience Store Guide (2026)"*, seoulxon *"1+1 Deals, Food,
and What to Say Like a Local"*, koreahowto *"17 Secrets Tourists Never Discover"*, koreatripexpert
*"7 Best Hacks (2026)"*, seoulplate, discoverrealkorea, whatinseoulkorea, haetek.

**Do not compete by writing a better ultimate guide.** Two reasons:

- Playbook §3.4: the **March 2026 core update explicitly demoted aggregators in favour of
  originators and niche specialists** (Amsive, 2,000+ domains). A listicle-dense SERP is a target
  for depth, not for a bigger listicle.
- We would be entering with one page against eight. Our actual advantage is the opposite shape —
  we already own **20 deep single-subject pages** they answer in one line each.

**The winning move is a hub that is a router, not a summary**: it names the decision a reader is
making and sends them to the page that answers it properly.

---

## 4. The gaps — representative's brainstorm, gated

### 4a. Verified open, and strong

**① 1+1 / 2+1, and whether a foreigner can actually use the "keep" feature**

- We mention `1+1` in **10+ posts** (`028`, `278`, `335`, `358`–`368`) and have **never explained
  it**. Same "mentioned everywhere, never titled" pattern that produced `372`–`375`.
- English guides *do* cover the mechanic. But every one of them goes vague at the same place:
  the app feature "**may not be practical for short-term tourists without a Korean phone number.**"
  That hedge is the opening — CLAUDE.md: *얼버무린 문장이 리프레시에서 가장 값어치 있는 자리다.*
- The answerable question nobody answers: **can a visitor without a Korean number register 우리동네GS
  or 포켓CU, and if not, what do they lose?** That is a 거래장벽 (3차 레인) question with a definite
  answer, and it is worth more than restating that 1+1 exists.
- ⚠️ **Requires field verification before drafting** — app signup flow, whether 본인인증 blocks a
  foreign number, whether the counter can hold the item without the app.

**② 숙취해소제 — the gel-stick generation**

- `022` carries "Hangover Drinks" in its title but the body mentions hangovers ~10 times total.
  It is a passing section, not coverage.
- The representative's angle is the story: **여명808 was effectively the only option and was hard to
  get down**; the category has since split into gels, sticks and jellies (상쾌환 and successors)
  that are engineered to be swallowable. That is a product-evolution narrative with Korean sources
  and no English equivalent that we have found.
- ⚠️ Coverage gate not yet run.

### 4b. Plausible, gate not yet run

**③ Convenience-store PB / chain-exclusive products** — the ramyeon you can only buy at CU, GS25's
own line, emart24's. `250` covers Olive Young's PB, not convenience stores'. Fits the lane exactly
(packaged goods, nameable, priceable).

**④ The chain landscape** — how many chains, who owns them, what each is actually best at. `059` is
a food guide, not a brand map. Risk: reads like a listicle unless it is built on FTC franchise
store counts, which we have used before (queue item 158) and which no English page uses.

**⑤ Sandwich lineage and the Japan comparison** — is Korea's convenience-store food following Japan
or diverging? The representative's read is that **dosirak has diverged hard** (김혜자·백종원 lines,
both already ours in `059`/`281`). Genuinely interesting, but it is an essay-shaped topic and needs
a concrete action frame before it passes §2.

**⑥ Beer — 4 cans for ₩10,000** — the bundle pricing itself is untouched (`060`/`179` cover drinking
culture, not the shelf economics). Small but very concrete.

### 4c. Weak — recommend dropping

**⑦ Popcorn / snack variety** — this is a listicle, and snacks are our most saturated internal area.

**⑧ "What Korea's convenience stores DON'T have"** — clever inversion, but an absence is hard to
source and impossible to verify. High chance of ending up as unsupported assertion.

---

## 5. Proposed shape

The hub and its Eat / Drink / Snack branches already exist and are populated. What is missing sits
in one branch:

```
/convenience-store   [EXISTS — chains table, Aug-2026 prices, 9-row how-to, ~20 guides]
 |
 ├── Eat        171 · 059 · 336 · 281 · 335          [full]
 ├── Drink      344 · 347 · 360 · 362 · 358          [full]
 ├── Snack      029 · 343 · 366 · 367 · 370          [full]
 └── Navigate   201 cards · 054 machines · 186 seating · 213 bins · 171 markdown
                ① 1+1 / 2+1 and the app keep feature   [MISSING — hub row has no post]
                ② parcels, ATMs and the other services [MISSING — hub row has no post]
                ③ hangover remedies                    [MISSING — not even a hub row]
```

**Three posts, not twelve.** The depth already exists; what the hub lacks is the *navigate* branch,
which is also the 3차 레인 (거래장벽) material we have barely touched.

**Note what this means about the lane.** These three are not food posts. They are "how do I operate
this system as a foreigner" posts, which is the 3rd lane, entered here through the door of a food
cluster that already ranks. That is a cheaper way in than opening the lane cold.

---

## 6. Recommended order

1. **① 1+1 / 2+1 and the app keep feature.** Biggest gap, most-referenced unexplained thing on the
   site (`1+1` appears in 10+ posts, explained in none), and the English competition all hedges at
   the same spot.
   **The blocking fact is now half-resolved, and the answer is better than expected.** The
   representative photographed all three signup screens on 2026-08-11:

   | chain | entry paths | Korean identity required to enter? |
   |---|---|---|
   | **emart24** (Shinsegae Point integrated) | 신한인증서 · 휴대폰인증 · 카드인증 — **nothing else** | **Yes.** Step 1 of 4 *is* 본인인증, and all three methods presuppose a Korean bank, carrier or card |
   | **GS25** (우리동네GS) | Kakao · Naver · **Apple** · phone · **email ID** | No — Apple and email do not presuppose a Korean line |
   | **CU** (포켓CU) | Naver · Kakao · **Apple** · biometric · ID | No — same |

   **So "you need a Korean phone number" is not one policy, it is three, and the English guides
   flattened them.** One chain is genuinely closed; two have global entry paths. No English page
   makes that distinction. That difference is the article.

   **RESOLVED 2026-08-11: social login is not a way around it.** The representative tapped Apple on
   both GS25 and CU; both then demand 본인인증. The gate belongs to the app, not the identity
   provider, so the social buttons only carry you as far as the wall. **All three chains are closed
   without Korean identity infrastructure.**

   **This inverts the angle, and improves it.** The line is not chain-by-chain, it is
   **visitor vs resident**:

   - 본인인증 binds to a Korean carrier line **in your own name** (or a Korean bank certificate or
     Korean card). A foreign resident with an ARC and their own line **can**. A short-term visitor
     on roaming or a tourist prepaid SIM **cannot** — tourist SIMs are generally not registrable
     in the holder's name against an ARC.
   - **1+1 and 2+1 themselves work for everyone.** They apply at the till with no app. Only the
     *banking the extra item for later* part needs the app. English guides run the two together,
     which is where the confusion comes from.

   **So the post is a correction, and a clean one:** eight English guides promote "save the free
   item in the app and grab it later" as a headline tip, and the reader they are writing for is
   precisely the reader who cannot do it. Same shape as `374` (the Hangeul museum guides send
   people to a building closed until 2028) and `198` (the festival moved cities). Those are our
   strongest posts.

   **No longer blocked. Ready to draft.**
2. **② parcels / ATMs / services.** Convenience store as infrastructure, not shop — 택배, ATM, bill
   payment. Run the coverage gate first.
3. **③ hangover remedies.** `022` has "Hangover Drinks" in its title and ~10 mentions in the body,
   so it is a passing section, not coverage. Coverage gate not yet run.
4. **Then add the `slug` to those three hub rows** so the hub routes into them.
5. Re-measure the cluster after ~6 weeks. **This is also how we finally test the assumption in
   §1** — if the new links do nothing for clicks on the existing 20, we will know, and we should
   stop believing it.

**Dropped from the earlier draft**: ④ chain landscape (the hub's four-chain table already does
this), ⑥ beer bundle pricing (too thin for a post; belongs as a PRICES row), ⑤ sandwich lineage
(essay-shaped, no action frame), ⑦ popcorn, ⑧ what Korea lacks.

---

## 7. Housekeeping this replaces

The W33c recommendation to write "convenience-store sandwiches" as a standalone expansion is
**withdrawn**. It was the last item standing after a filter, not a choice, and the representative
was right that those are different things. The sandwich material belongs inside the hub's Eat
branch or as a section of an existing post, not as its own orphan page.
