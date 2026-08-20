# EpicKor social calendar — measured state, 2026-08-20

Both channels read directly from their schedulers on 2026-08-20, not from any index file.

- **Instagram** (`/latest/posts/scheduled_posts`, Meta Business Suite): one post per day, 05:00 KST,
  each post being two rows (FB `EpicKor` + IG `epickorsnippets`). Card news and Reels **share** this
  one slot per the 2026-07-27 rule — that is why `CARDNEWS_INDEX.md` looks full of holes when it is not.
- **YouTube Shorts** (Studio → 콘텐츠 → Shorts → 예약됨): one Short per day, 21:00 KST.

Both were verified with a gap/duplicate scan, not by eye.

| Date | Instagram 05:00 | YouTube Shorts 21:00 |
|---|---|---|
| 08-20 | (published) jmw 카드뉴스 | Korea reversed the escalator rule |
| 08-21 | hurom 카드뉴스 | Ajumma, ahjumma, and the line |
| 08-22 | winwin 카드뉴스 | Webtoon vertical scroll |
| 08-23 | otoki 카드뉴스 | Pharmacy, clinic, or ER |
| 08-24 | pulmuone 카드뉴스 | 179 Korean Drinking Table Rules |
| 08-25 | cheonggyecheon 릴스 | 172 Korean BBQ Etiquette |
| 08-26 | sungnyemun 릴스 | 259 Korean Bingsu |
| 08-27 | suneung 릴스 | 170 How Many PC Bangs |
| 08-28 | 379 부산불꽃축제 릴스 | 178 Korean Food Delivery |
| 08-29 | 376 CVS 1+1 릴스 | 184 Korean Photo Booths |
| 08-30 | 377 숙취해소제 릴스 | 311 Tteokbokki, and How Hot They Get |
| 08-31 | kbeauty-picker 릴스 | suneung The Day Korea Grounds Every Plane |
| 09-01 | ramyeon-premium 릴스 | 302 What Do Koreans Eat for Breakfast? |
| 09-02 | cvs-shelf-tag 릴스 | 321 BHC vs BBQ vs Kyochon |
| 09-03 | 395 COSRX 카드뉴스 | 177 Why Koreans Spend Hours in Cafes |
| 09-04 | 392 김치냉장고 카드뉴스 | 171 Convenience Store Breakfast |
| 09-05 | 394 안마의자 카드뉴스 | cheonggyecheon Seoul Tore Down a Freeway |
| 09-06 | uji-dossier 릴스 | 191 Korean University Life |
| 09-07 | banana-kick-dossier 릴스 | 376 Convenience Store 1+1 |
| 09-08 | yakult-dossier 릴스 | sungnyemun The Wood Is From 2013 |
| 09-09 | 287 BBQ 그릴 카드뉴스 | — |
| 09-10 | 170 PC방 카드뉴스 | — |
| 09-11 | 036 우산 카드뉴스 | — |
| 09-12 | cvs-receipt 릴스 | — |
| 09-13 | 288 포장마차 카드뉴스 | — |
| 09-14 | 290 4대궁 야간 카드뉴스 | — |
| 09-15 | 081 야구 카드뉴스 | — |
| 09-16 | 124 결혼식 카드뉴스 | — |
| 09-17 | musinsa 카드뉴스 (moved here 08-20) | — |

## Runway

- **Instagram runs dry after 09-17.** Every produced carousel and every produced Reel is now scheduled —
  73 card-news folders and 59 reel renders, nothing left unassigned. Extending past 09-17 needs new production.
- **YouTube runs dry after 09-08**, but not for lack of material: about 42 existing reel renders have never
  been posted to YouTube. Extending there is a scheduling job, not a production job.
- Those two facts are asymmetric on purpose. Instagram consumes new work; YouTube is still draining a backlog.

## What went wrong before this pass

`CARDNEWS_INDEX.md` recorded `musinsa` at 09-17 while the planner actually had it at **09-03 오후 8:00**,
sharing the day with the `395` carousel at 05:00. Nobody caught it because the index records the *intended*
date at scheduling time and nothing re-reads the planner afterwards. Both rows were moved to 09-17 05:00 and
the whole list re-scanned: 08-21 → 09-17, 28 consecutive days, zero empty, zero doubled.

Read the scheduler, not the index. The index is a production record; it is not evidence of a schedule.
