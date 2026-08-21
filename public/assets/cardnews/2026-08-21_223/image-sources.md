# 2026-08-21_223 — Korea entry paperwork, image sources

Visual system: **entry-stamp** (`render-entrystamp.py`), new for this batch. The subject is a
form, so the card is a form — a cream document sheet on immigration navy, a photo window punched
into it, ruled field rows, a rotated red stamp carrying the card's one hard number, and a
machine-readable strip along the bottom edge.

Not a repeat: `ticket-stub` leads on a date, `location-slate` on a place plus its transit line,
`spec-split` on a product and its numbers, `swap-card` on a pair of opposites. None of them
frames the photo inside a document, and none has labelled field rows — which is the point here,
because the reader's actual task is filling in labelled fields.

**The stamp is a design motif, not a reproduction.** It carries our own copy — a fee, a count, a
domain suffix — and never anything that could be mistaken for an official mark.

## Cards

| Card | File | What is in it | Source |
|---|---|---|---|
| 01 | icn-terminal-04.jpg | Incheon T1 concourse, Airstar Avenue, Korean signage, gate boards | Commons `File:ICN 04.jpg`, Andrzej Otrębski, CC BY-SA 4.0, 2023-12-13 |
| 02 | kis-signage.jpg | The Korea Immigration Service crest on an immigration counter | Commons `File:Korea Immigration Service logo at the Incheon International Airport.jpg`, Vuong Tri Binh, CC BY-SA 4.0, 2016-02-04 |
| 03 | korea-e-arrival-card-portal-screen.jpg | The official e-Arrival Card portal landing screen | already in post 223; see that post's `image-sources.md` |
| 04 | official-keta-homepage-screen.jpg | The official K-ETA homepage | already in post 223 |
| 05 | icn-terminal-05.jpg | Incheon departures board — 출발 / 出発 / Departures | Commons `File:ICN 05.jpg`, Andrzej Otrębski, CC BY-SA 4.0, 2023-12-13 |
| 06 | keta-official-warning-screen.jpg | The official K-ETA warning about non-official sites and agencies | already in post 223 |
| 07 | kis-entry-slip-dates.jpg | Entry confirmation slip — date of entry, permitted-until date, status B-2, INCHEON AIRPORT | derivative crop of Commons `File:ROK KIS Immigration Entry Slip.jpg`, Ominae, CC BY-SA 4.0, 2018-10-30 |

Coverage: **7/7 cards carry a real image** — four photographs and three screenshots of the actual
official interfaces the carousel tells the reader to use. No card is graphic-only.

The three screenshots are the post's own and are the right class of image here under the Blog
Reference Image Standard: a card that names `e-arrivalcard.go.kr` should show that portal, not a
mood photo of an airport.

## Two images were corrected after looking at the render

**Card 07 named a field the photo had cropped off.** The slip is portrait (3024×4032) and the
window is landscape, so `object-fit: cover` cut the top and the bottom. What it cut at the bottom
was **PERMITTED UNTIL** — the exact line the copy points at ("the permitted-until date … is how
long you may stay"). Same family as the 2026-08-03 Chapagetti card: the copy named something the
picture did not show. Fixed with a deliberate derivative crop, `kis-entry-slip-dates.jpg`, framed
so every element the copy mentions is legible: date of entry, permitted-until with the B-2 status,
INCHEON AIRPORT, the 법무부 watermark, and the QR carrying the ministry crest.

**Cards 04 and 06 were cropping through the screenshots' own headlines**, so card 06 opened on a
half-cut "for K-ETA". Both now set `image_position: center top`. Card 06 gained the whole "Beware
of NON-OFFICIAL Websites and Agencies for K-ETA" banner, which is the card's argument stated by
the government itself; card 04 gained the "Official Website of the Government" lockup, which does
the same job on the card about paying ₩10,000.

## A layout fault the first render exposed

The window started as a fixed height per mode. Card 02 carries five field rows, so its window was
squeezed to 250px — which both cropped the immigration crest and left a band of dead cream between
the copy and the rows. The window is now flexible (`flex:1`, min 200px) and absorbs whatever the
text does not use, so the sheet is exactly full on every card and the densest card gets a smaller
image rather than an awkward one.

## Sourcing note

Pexels has effectively no Korean immigration or arrival-hall imagery. The two genuinely Korean
airport photos it does return — `31649603` (Incheon interior) and `32211611` (AREX entrance) —
are **already used by posts 205 and 257**, caught by `audit-image-uniqueness --check-id` before
download. Its passport results are all the wrong country (Ukrainian, Russian, Filipino, Polish),
which on a Korea entry carousel would be the country-mismatch trap outright. Wikimedia Commons
carried the whole set instead, including the one image that makes the payoff card work.

## Facts checked before writing, 2026-08-21

K-ETA portal plus Ministry of Justice notices carried by MOFA embassy postings: temporary
exemption confirmed running 1 Jan – 31 Dec 2026, fee ₩10,000, processing generally within 72
hours, nothing announced for 2027. The ministry's own notice states that exempt nationals may
still apply in order to receive benefits including **별도의 입국신고서 작성 생략** — skipping the
separate arrival declaration. That is the carousel's central claim, confirmed in Korean at source.
