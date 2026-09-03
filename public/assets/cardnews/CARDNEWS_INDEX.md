# EpicKor Card News Index

Folder naming rule: `YYYY-MM-DD_slug`

The date is the card-news production/final-save date from `HANDOFF.md`.
Instagram upload is representative-managed. As of 2026-07-02, the representative confirmed all card-news assets listed through `2026-06-28_249` are approved and scheduled. Rows produced afterward keep their own upload status.

**2026-09-03 — the 09-20~09-24 batch, and a caption bug that had never been caught.**
Five carousels scheduled in one sitting, giving **09-04 through 09-24, 21 consecutive days, zero gaps**.
Two of them scheduled with **silently rotated captions**: Meta's `#` helper and URL auto-linker reset the
caret to offset 0 mid-typing, so whatever was typed next landed at the front of the post. `438` opened with
its hashtag block; `223` split inside `k-eta.g|o.kr` on line 26 and wrapped around. **The pre-commit
screenshot cannot catch this** — the editor is scrolled and only ever shows its middle. The fix is in two
parts: `insert_text` instead of per-character typing, and reading the editor back and comparing it to
`caption.txt` before anything is clicked. Four of six retype passes failed on the first attempt, so the
retry loop is not decorative. Both bad posts were repaired in place with `fix-meta-caption.py` rather than
deleted and re-uploaded.

**2026-08-21 — `2026-08-20_200` 추석 예매편을 2026-09-02 오후 8:00에 예약했다.**
대표님 지시대로 기존 예약을 밀지 않고 **같은 날짜에 겹쳐** 올렸다 — 그날 05:00은 편의점 가격표 카로셀이라 15시간 간격이다. **날짜를 09-02로 잡은 것은 카드 03이 9/3–4 우선예매를 싣고 있기 때문이다** — 그 다음날부터는 카드 하나가 이미 지난 일을 안내하게 된다. 일반예매 9/7 오픈까지는 5일 여유가 남는다.

**2026-08-20 correction (two separate errors, both found by reading the Meta planner instead of this file):**

1. `musinsa` was recorded here as `2026-09-17 05:00` but the planner actually had it on **2026-09-03 오후 8:00**, on top of the `395` carousel already at 05:00 that day. So 09-03 carried two Instagram posts 15 hours apart and 09-17 was empty. Both rows (FB + IG) were moved to 2026-09-17 05:00 via 게시물 상세 → 옵션 → 게시물 관리 → 게시물 일정 조정, and the full list re-read: **2026-08-21 through 09-17, 28 consecutive days, zero empty days, zero doubles.** Writing the intended date here is not the same as verifying the scheduled one.

2. This table lists card news only, so the missing dates in it read like holes in the Instagram calendar. They are not. **Instagram runs one post per day shared between card news and Reels** (2026-07-27 rule), and every date absent from this table is covered by a Reel. Do not plan new card-news production off the gaps in this table — read `/latest/posts/scheduled_posts` for the real calendar.

**2026-07-26 correction:** rows `311`/`312`/`313` still read "ready for representative scheduling" long after Claude had actually scheduled them through Meta Business Suite on 2026-07-21 (planner-verified; see the `HANDOFF.md` 2026-07-21 snapshot). Whoever schedules a row must update its Upload status in the same session — a stale row here caused a session-close report to wrongly tell the representative that scheduling was still outstanding.

| Folder | Slug | Topic | Cards | Production status | Upload status |
|---|---:|---|---:|---|---|
| `2026-04-30_071` | 071 | Deli Manjoo Korea Subway Snack | 7 | final | scheduled by representative |
| `2026-05-02_064` | 064 | Suwon Day Trip From Seoul | 7 | final | scheduled by representative |
| `2026-05-02_068` | 068 | Korean Language Learning | 7 | final | scheduled by representative |
| `2026-05-02_135` | 135 | Korean Kim Surname History | 7 | final | scheduled by representative |
| `2026-05-02_153` | 153 | Isaac Toast Sauce Korea Breakfast | 7 | final | scheduled by representative |
| `2026-05-02_160` | 160 | Korean Sunscreen Texture Guide | 7 | final | scheduled by representative |
| `2026-05-02_168` | 168 | Korean Hiking Culture | 7 | final | scheduled by representative |
| `2026-05-02_169` | 169 | Seoul Neighborhood Choice Guide | 7 | final | scheduled by representative |
| `2026-05-03_003` | 003 | Korean Noraebang Karaoke Songs | 7 | final | scheduled by representative |
| `2026-05-03_132` | 132 | Korean Football Stars in Europe | 7 | final | scheduled by representative |
| `2026-05-03_159` | 159 | Not Seoul But Gyeongju Korea Travel | 7 | final | scheduled by representative |
| `2026-05-06_038` | 038 | 4 Korean Ramen You Must Try | 7 | final | scheduled by representative |
| `2026-05-07_171` | 171 | Korean Convenience Store Breakfast | 7 | final confirmed | scheduled by representative |
| `2026-05-08_008` | 008 | Korean Garlic Culture | 7 | final | scheduled by representative |
| `2026-05-08_043` | 043 | Jang Wonyoung and Wonyoungism | 7 | final | scheduled by representative |
| `2026-05-08_082` | 082 | SKY Universities in Korea | 7 | final confirmed | scheduled by representative |
| `2026-05-08_090` | 090 | Ahjussi Meaning in Korean | 6 | final confirmed | scheduled by representative |
| `2026-05-10_011` | 011 | Korean Blood Type Personality Myth | 8 | final revised | scheduled by representative |
| `2026-05-10_015` | 015 | Mercedes-Benz Status Culture in Korea | 7 | final revised | scheduled by representative |
| `2026-05-10_055` | 055 | Pali Pali Korean Fast Culture | 7 | final revised | scheduled by representative |
| `2026-05-10_062` | 062 | Kimchi Culture and Museum Kimchikan | 7 | final revised | scheduled by representative |
| `2026-05-10_074` | 074 | Seoul Underground Shopping Malls | 7 | final | scheduled by representative |
| `2026-05-10_140` | 140 | Korea Public Restroom Travel Tips | 7 | final revised | scheduled by representative |
| `2026-05-30_184` | 184 | Korean Four-Cut Photo Booths | 7 | final | scheduled by representative |
| `2026-06-10_192` | 192 | Olive Young Korea Shopping Guide | 7 | final | scheduled by representative |
| `2026-06-13_195` | 195 | Centre Pompidou Hanwha Seoul | 7 | final reviewed | scheduled by representative |
| `2026-06-13_196` | 196 | Korea World Cup Brunch Watch Culture | 7 | final reviewed | scheduled by representative |
| `2026-06-13_197` | 197 | Boryeong Mud Festival 2026 Packing Guide | 7 | final reviewed | scheduled by representative |
| `2026-06-20_204` | 204 | Korea Summer Packing List 2026 | 7 | final reviewed | scheduled by representative |
| `2026-06-20_216` | 216 | Korea Hands-Free Travel Guide | 7 | final reviewed | scheduled by representative |
| `2026-06-20_219` | 219 | Korean Ramen Trends 2026 | 7 | final reviewed | scheduled by representative |
| `2026-06-20_218` | 218 | Daiso Korea Must-Buy Guide | 7 | final reviewed | scheduled by representative |
| `2026-06-20_220` | 220 | Korean Subway Snacks Guide | 7 | final reviewed | scheduled by representative |
| `2026-06-20_221` | 221 | Seoul Rainy Day Itinerary | 7 | final reviewed | scheduled by representative |
| `2026-06-28_239` | 239 | Korean Hair Care Shopping Guide | 7 | final reviewed | scheduled by representative |
| `2026-06-28_241` | 241 | Seoul Self Photo Studio Guide | 7 | final reviewed | scheduled by representative |
| `2026-06-28_242` | 242 | Seoul Vintage Shopping Guide | 7 | final reviewed | scheduled by representative |
| `2026-06-28_247` | 247 | Korean Pet Parent Culture 2026 | 7 | final reviewed | scheduled by representative |
| `2026-06-28_248` | 248 | Seoul Running Crew Culture 2026 | 7 | final reviewed | scheduled by representative |
| `2026-06-28_249` | 249 | Korean Dating Rules 2026 | 7 | final reviewed | scheduled by representative |
| `2026-07-08_257` | 257 | Incheon Airport Layover Guide 2026 | 7 | final approved + caption ready | scheduled 2026-08-04 05:00 KST (Meta Suite, planner-verified 07-29) |
| `2026-07-08_258` | 258 | Noryangjin Fish Market Guide 2026 | 7 | final approved + caption ready | scheduled 2026-08-05 05:00 KST (Meta Suite, planner-verified 07-29) |
| `2026-07-08_259` | 259 | Korean Bingsu Guide 2026 | 7 | final approved + caption ready | scheduled 2026-08-06 05:00 KST (Meta Suite, planner-verified 07-29) |
| `2026-07-08_277` | 277 | Korean Pantry Starter Kit 2026 | 7 | final approved + caption ready | scheduled 2026-08-07 05:00 KST (Meta Suite, planner-verified 07-29) |
| `2026-07-08_278` | 278 | Korean Instant Coffee Mix Guide 2026 | 7 | final approved + caption ready | scheduled 2026-08-08 05:00 KST (Meta Suite, planner-verified 07-29) |
| `2026-07-08_279` | 279 | Korean Seaweed Snack Guide 2026 | 7 | final approved + caption ready | scheduled 2026-08-09 05:00 KST (Meta Suite, planner-verified 07-29) |
| `2026-07-11_081` | 081 | Why Korean Baseball Feels Like a Three-Hour Concert | 7 | final confirmed + Seoul After Dark 7-card restyle + caption ready | scheduled 2026-09-15 05:00 KST (Meta Suite, 2026-08-18) |
| `2026-07-11_288` | 288 | Korean Pojangmacha First-Visit Guide | 7 | final confirmed + Seoul After Dark 7-card restyle + caption ready | scheduled 2026-09-13 05:00 KST (Meta Suite, 2026-08-18) |
| `2026-07-11_290` | 290 | Seoul Four-Palace Night Comparison | 7 | final confirmed + Seoul After Dark 7-card restyle + caption ready | scheduled 2026-09-14 05:00 KST (Meta Suite, 2026-08-18) |
| `2026-07-12_036` | 036 | The Umbrella Protocol: Why Koreans Refuse to Get Wet | 7 | final confirmed + Seoul After Dark + caption ready | scheduled 2026-09-11 05:00 KST (Meta Suite, 2026-08-18) |
| `2026-07-12_170` | 170 | Korean PC Bang Culture | 7 | final confirmed + Seoul After Dark + caption ready | scheduled 2026-09-10 05:00 KST (Meta Suite, 2026-08-18) |
| `2026-07-12_287` | 287 | Korean BBQ Grill for Home | 7 | final confirmed + Seoul After Dark + caption ready | scheduled 2026-09-09 05:00 KST (Meta Suite, 2026-08-18) |
| `2026-07-15_musinsa` | musinsa | MUSINSA Business: Seoul Fashion Commerce | 7 | final approved + editorial system + caption ready | scheduled 2026-09-17 05:00 KST — **corrected 2026-08-20**, had actually been sitting on 09-03 오후 8:00 (planner-verified after the move) |
| `2026-07-15_124` | 124 | Korean Wedding Culture: The Modern K-Wedding Code | 7 | final approved + modern hanji system + caption ready | scheduled 2026-09-16 05:00 KST (Meta Suite, 2026-08-18) |
| `2026-07-15_174` | 174 | Seoul Subway Etiquette: The Quiet Signal System | 7 | final approved + transit signal system + caption ready | Instagram and YouTube Community scheduled for 2026-07-20 22:00 KST |
| `2026-07-20_311` | 311 | Tteokbokki: Six Styles, One Rice Cake | 7 | final + bunsik-red system + caption ready | scheduled 2026-07-23 05:00 KST (Meta Suite, planner-verified 07-21) |
| `2026-07-20_312` | 312 | K-Beauty Ingredients Decoded: Snail, Cica, Propolis, Rice | 7 | final + ingredient-decoder system + caption ready | scheduled 2026-07-24 05:00 KST (Meta Suite, planner-verified 07-21) |
| `2026-07-20_313` | 313 | Seoul With Kids: What Parents Get Wrong | 7 | final + family-seoul system + caption ready | scheduled 2026-07-25 05:00 KST (Meta Suite, planner-verified 07-21) |
| 2026-08-02_ramyun | Korean Ramyun — Heat Scale | 7 | 제작완료·검수완료 (2026-08-03 개정: 제품 사진 전량 교체) | scheduled 2026-08-10 05:00 KST (Meta Suite, planner-verified 08-03) | /ramyun 허브 |
| 2026-08-03_convenience-store | Korean Convenience Store — Shelf Tag | 7 | 제작완료·검수완료 | scheduled 2026-08-11 05:00 KST (Meta Suite, planner-verified 08-03) | /convenience-store 허브 |
| 2026-08-04_seoul | Seoul by Neighbourhood — Station Sign | 7 | 제작완료·검수완료 | scheduled 2026-08-12 05:00 KST (Meta Suite, planner-verified 08-03) | /seoul 허브 |
| `2026-08-08_samick` | samick | Korean Makers 01: Samick Guitars (v2 sunburst) | 7 | final · 대표 컨펌 (08-08) | scheduled 2026-08-16 05:00 KST (Meta Suite, planner-verified 08-09) |
| `2026-08-08_dorco` | dorco | Korean Makers 02: Dorco Blades (v2 blade) | 7 | final · 대표 컨펌 (08-08) | scheduled 2026-08-17 05:00 KST (Meta Suite, planner-verified 08-09) |
| `2026-08-08_cuckoo` | cuckoo | Korean Makers 03: Cuckoo Rice Cookers (v2 homedrama) | 7 | final · 대표 컨펌 (08-08) | scheduled 2026-08-18 05:00 KST (Meta Suite, planner-verified 08-09) |
| `2026-08-08_monami` | monami | Korean Makers 04: Monami 153 (notebook) | 7 | final · 검수완료 | scheduled 2026-08-19 05:00 KST (Meta Suite, planner-verified 08-09) |
| `2026-08-08_jmw` | jmw | Korean Makers 05: JMW Dryers (windtunnel) | 7 | final · 검수완료 | scheduled 2026-08-20 05:00 KST (Meta Suite, planner-verified 08-09) |
| `2026-08-08_hurom` | hurom | Korean Makers 06: Hurom Juicers (freshpress) | 7 | final · 검수완료 | scheduled 2026-08-21 05:00 KST (Meta Suite, planner-verified 08-09) |
| `2026-08-09_winwin` | winwin | Korean Makers 07: Win&Win Archery (target) | 7 | final · 검수완료 | scheduled 2026-08-22 05:00 KST (Meta Suite, planner+card-order verified 08-10) |
| `2026-08-09_otoki` | otoki | Korean Makers 08: Otoki (timer) | 7 | final · 검수완료 | scheduled 2026-08-23 05:00 KST (Meta Suite, planner+card-order verified 08-10) |
| `2026-08-09_pulmuone` | pulmuone | Korean Makers 09: Pulmuone (coldchain) | 7 | final · 검수완료 | scheduled 2026-08-24 05:00 KST (Meta Suite, planner+card-order verified 08-10) |
| `2026-08-17_395` | 395 | COSRX Snail 96 — RX Label | 7 | 제작완료·검수완료 (VF 93.9) | scheduled 2026-09-03 05:00 KST (Meta Suite, 2026-08-18)| /blog/395 |
| `2026-08-17_392` | 392 | Kimchi Refrigerator — Earth Gauge | 7 | 제작완료·검수완료 (VF 94.7) | scheduled 2026-09-04 05:00 KST (Meta Suite, 2026-08-18)| /blog/392 |
| `2026-08-17_394` | 394 | Korean Massage Chairs — Showroom Menu | 7 | 제작완료·검수완료 (VF 93.3) | scheduled 2026-09-05 05:00 KST (Meta Suite, 2026-08-18)| /blog/394 |
| `2026-08-20_200` | 200 | Chuseok 2026 Train Tickets: Your Route Has Its Own Booking Day | 7 | rendered + structural gate PASS + caption ready | **scheduled 2026-09-02 오후 8:00 KST** (Meta Suite, list-verified 08-21, FB+IG both rows). Second post that day — the 05:00 slot holds the convenience-store shelf-tag carousel — per the representative's instruction to overlap rather than displace. Date chosen because card 03 carries the 3–4 Sep priority sale, so 09-02 is the last day on which every dated stage on every card is still ahead of the reader. |
| `2026-08-21_339` | 339 | Squid Game Filming Locations: The Arena Was a Soundstage, These Places Are Real | 7 | rendered + structural gate PASS + caption ready | **scheduled 2026-09-18 05:00 KST** (Meta Suite, list-verified 08-21, FB+IG). |
| `2026-08-21_344` | 344 | Bacchus D vs F: The Smaller Bottle Is the Stronger One | 7 | rendered + structural gate PASS + caption ready | **scheduled 2026-09-19 05:00 KST** (Meta Suite, list-verified 08-21, FB+IG). |
| `2026-08-21_194` | 194 | Korean Gift-Giving: The Gift Is Fine, the Meaning Might Not Be | 7 | rendered + structural gate PASS + caption ready | **SCHEDULED 2026-09-21 05:00 KST** (FB + IG), planner-verified. Lands three days before Chuseok (09-24–26), inside the 09-21–23 window this row had been holding for. Caption was clean on the first pass — the only one of the three scheduled that hour that was. |
| `2026-09-03_433` | 433 | Korean Ttukbaegi vs Dolsot, and Why Koreans Never Use Dish Soap | 7 | rendered + structural gate PASS + caption ready | **SCHEDULED 2026-09-23 05:00 KST** (FB + IG), planner-verified. First carousel scheduled after the caption read-back gate went in; verified on attempt 1. |
| `2026-09-03_435` | 435 | Korean Kimchi Containers: The Press Plate Matters More Than the Lid | 7 | rendered + structural gate PASS + caption ready | **SCHEDULED 2026-09-24 05:00 KST** (FB + IG), planner-verified. Verified on attempt 1. |
| `2026-09-03_438` | 438 | Korean Ramen Pots: Is the Aluminium One Safe? | 7 | rendered + structural gate PASS + caption ready | **SCHEDULED 2026-09-22 05:00 KST** (FB + IG), planner-verified. **Caption repaired after scheduling** — the trailing hashtag block jumped to offset 0 and the post opened `#epickorKorea tested 56 ramyun pots...` with no hashtags at the end. Both rows fixed via 게시물 수정. |
| `2026-08-21_223` | 223 | Korea e-Arrival Card vs K-ETA: 22 Countries Are Exempt, and the Paid One Cancels the Free One | 7 | rendered + structural gate PASS + caption ready | **SCHEDULED 2026-09-20 05:00 KST** (FB + IG), planner-verified. Went first because it carries no date pressure, which freed 09-21 for `194` before Chuseok. **Its caption had to be repaired after scheduling** — Meta rotated it during typing, splitting line 26 inside `k-eta.g|o.kr` so the post opened `o.kr — Korean government sites end in .go.kr` and ended mid-line. Fixed in place via 게시물 수정 on both rows and re-read character-for-character against `caption.txt`. |
