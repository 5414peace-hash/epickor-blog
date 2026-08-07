# Image sources — Blog 174

Created 2026-08-08. This folder previously had **no source record at all**, and that turned out to
matter: `pexels-31892087.jpg` here was the same Pexels photo (31892087) as `140`'s
`seoul-subway-platform-pexels.jpg`. `npm run audit:image-uniqueness` reported zero duplicates on
2026-08-07 because it keys off documented photo IDs in `image-sources.md` — with no record here,
this post was not in the comparison set at all. A missing source file does not fail the check; it
removes the post from the check. All four old files were unreferenced after the rewrite and were
deleted.

- `seoul-metro-pregnant-priority-seats.jpg` — Wikimedia Commons, "Designated seats for pregnant
  women of Seoul Metro Line 1 in 2018" by Garam, CC BY. Shows the pink 임산부 배려석 at both ends
  of the bank, a yellow priority seat, grey general seats, the wall placards and the pink floor
  decals in one frame — which is why it is the hero: the article's central correction is that these
  are different seat categories, and the photo proves it without a diagram.
  Source: https://commons.wikimedia.org/wiki/File:Designated_seats_for_pregnant_women_of_Seoul_Metro_Line_1_in_2018.jpg
- `seoul-station-escalator.jpg` — Wikimedia Commons, "Gusan Station Way Out(Escalator)," CC BY 3.0.
  Illustrates the escalator-policy section. Source: https://commons.wikimedia.org/wiki/File:Gusan_Station_Way_Out(Escalator).JPG
- `euljiro-4ga-platform-screen-doors.jpg` — Wikimedia Commons,
  "Seoul-metro-204-Euljiro-4ga-station-platform-20181122-082334" by LERK, CC BY-SA 4.0. Platform
  screen doors and floor markings for the boarding-flow section. Replaces the duplicated Pexels
  platform shot. Source: https://commons.wikimedia.org/wiki/File:Seoul-metro-204-Euljiro-4ga-station-platform-20181122-082334.jpg

95–149KB each at 1300px wide. The card-news carousel `2026-07-15_174` keeps its own separate
image set under `public/assets/cardnews/`, so nothing there is affected.
