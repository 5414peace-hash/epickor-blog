# 2026-08-20_200 — Chuseok 2026 train booking, image sources

Visual system: **ticket-stub** (`render-ticketstub.py`), new for this batch. Cream stub with a
punched edge over the photograph, the date set as the largest element. Chosen because the content
is a date-to-route mapping and the failure mode the carousel exists to prevent is arriving on the
wrong morning — so the date has to be the thing a reader carries away from each card.

Not a repeat of an existing system: `station-sign` and `transit-signal` are signage, `shelf-tag`
and `rx-label` are retail and pharmacy labels. None of the 23 previous systems puts a date in the
hero position.

Veil: per CLAUDE.md 2026-07-20, the house default buries photographs. Each card declares its own
`image_opacity` in the 0.55–0.68 band over a bottom-weighted gradient, so the trains stay legible.

## Cards — every image is the subject its card names

| Card | File | What is actually in the photo | Licence |
|---|---|---|---|
| 01 | card_01-ktx-seoul.jpg | Korail train at Seoul Station beside the 서울 / Seoul nameboard | CC0 |
| 02 | card_02-seoul-platform.jpg | Seoul Station platforms and tracks | Attribution |
| 03 | card_03-ktx-sancheon.jpg | KTX-Sancheon high-speed trainset | CC BY-SA 4.0 |
| 04 | card_04-mugunghwa.jpg | Mugunghwa-ho consist behind Korail locomotive 8280 | CC BY-SA 4.0 |
| 05 | card_05-suseo-station.jpg | Suseo Station exterior with SRT signage | CC BY-SA 4.0 |
| 06 | card_06-ktx-seoul-2.jpg | KTX trainset marked KTX 한국고속철도 | CC0 |
| 07 | card_07-suseo-hall.jpg | Suseo Station concourse | CC BY-SA 4.0 |

All seven from Wikimedia Commons, downloaded from the originals at
`upload.wikimedia.org/wikipedia/commons/{a}/{ab}/{name}`.

**Card 04 and card 05 declare `name_ko`/`name_en` and are checked against their `image_label` by
`review-cardnews.mjs`.** 무궁화호 sits on a photograph of an actual Mugunghwa consist; 수서역 sits
on a photograph of Suseo Station with its own signage. This is the gate added after the 2026-08-03
Chapagetti incident, where a card named one product and showed another.

**Card 01 is captioned by what is visible, not by its filename.** The Commons file is titled
"KTX in Seoul" but the train in frame does not read as a KTX; the 서울 nameboard is the subject.
The card claims the station, not the trainset.

## Rejected
- **`Korail Mugunghwa Ho Old Ticket.jpg`** (public domain) — an appealing fit for a ticket-themed
  carousel, and rejected because it is an *old* ticket. A carousel about a 2026 booking schedule
  showing a discontinued ticket format invites exactly the wrong inference.
- **Seoul metro platform series** (`Seoul-metro-…-station-platform-…jpg`) — these are subway
  platforms, not intercity rail. Chuseok booking is a Korail intercity subject; a subway photo
  would be a plausible Korean scene attached to the wrong system.
- **Thumbnail URLs** (`/thumb/…/1600px-…`) returned HTTP 400 and, at 1920px, HTML. The originals
  resolve cleanly; use `upload.wikimedia.org/wikipedia/commons/{a}/{ab}/{name}` directly.

## Cross-post uniqueness
Checked against every existing carousel by `review-cardnews.mjs`: no repeats within this carousel
and no cross-post duplicates. None of these seven files has appeared on EpicKor before.

## Source post
`/blog/200` — refreshed 2026-08-20 against Korail's official notice
(2026년 추석 연휴 승차권 예매 안내문, posted 13 August 2026) and its attached timetable.
Every date and time on these cards comes from that notice.
