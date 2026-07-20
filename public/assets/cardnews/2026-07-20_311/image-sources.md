# Image sources for card news 2026-07-20_311 (Tteokbokki)

All seven cards use a distinct image. No image path repeats inside this carousel, and none of these
files appear in any other card-news carousel.

- `card_01-tteokbokki-classic.jpg` - Classic tteokbokki takeout tray with garaetteok, boiled egg, and Korean packaging text. Post-owned image from Blog 311. "Garaetteok Tteokbokki", CC0, via Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Garaetteok_Tteokbokki.jpg
- `card_02-garaetteok-closeup.jpg` - Close-up of cylindrical garaetteok rice cakes with sesame, onion, and chili. Post-owned image from Blog 311. "Korean rice cake (tteokbokki)", CC0, via Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Korean_rice_cake_(tteokbokki).jpg
- `card_03-tteokbokki-twigim.jpg` - Red gochujang tteokbokki topped with twigim in a Korean bunsik shop. Photo by Hoony Kim on Pexels, photo ID 18283713: https://www.pexels.com/photo/soup-on-plate-18283713/
- `card_04-cheese-tteokbokki.jpg` - Cheese tteokbokki on a hot plate with kimchi banchan alongside. "Korean.snacks-Cheese tteokbokki", CC BY-SA 2.0, via Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Korean.snacks-Cheese_tteokbokki.jpg
- `card_05-rabokki.jpg` - Rabokki: garaetteok and instant ramyeon in thick red sauce. Post-owned image from Blog 311. "Rabokki - SOJU 2024-06-02", CC0, via Wikimedia Commons: https://commons.wikimedia.org/wiki/File:Rabokki_-_SOJU_2024-06-02.jpg
- `card_06-soy-tteokbokki.jpg` - Non-spicy soy-sauce style tteokbokki with boiled eggs and sesame. Photo by Ratryoshka on Pexels, photo ID 35366769: https://www.pexels.com/photo/delicious-tteokbokki-with-boiled-eggs-on-a-lace-tablecloth-35366769/
- `card_07-street-stall.jpg` - Korean market street-food stall with Korean won price signs and grilled corn skewers. Post-owned image from Blog 311. Photo by Huy Phan on Pexels, photo ID 19271596: https://www.pexels.com/photo/food-stand-in-a-korean-market-19271596/

Prepared 2026-07-20. Four images are post-owned (reused from the published Blog 311 image set, per the
post-owned-first sourcing rule); three were newly sourced for this carousel. Every image was opened and
manually inspected at full resolution before and after rendering. One rejected candidate was dropped:
a Wikimedia eomuk-skewer photo that added no tteokbokki information beyond the existing stall image.

Render notes: the default renderer veil (rgba 0.24 -> 0.92) buried the food, so all seven cards use
`image_tone: food` with tuned `image_opacity`. Full-bleed layouts where text sits over the photo
(cards 03 and 07, layout D) use 0.60-0.62 so the gold headline keeps contrast; split-panel layouts
(B/C/E) use 0.86. Card 02 was restored to the unbrightened post original after the first pass rendered
oversaturated yellow and hid the top-left watermark.
