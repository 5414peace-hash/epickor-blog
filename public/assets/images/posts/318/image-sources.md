# Image sources for Blog 318 (Lookism in Korea)

All three images are real Korea photography (Pexels), manually opened and inspected for
Korea-first authenticity and section-level relevance. Sensitive-topic note: no image
mocks or singles out an individual's appearance; captions are neutral.

- `myeongdong-beauty-signs.jpg` (og/hero) - A Myeongdong mochi/fresh-fruit street stall with a Missha cosmetics store sign visible behind it. Pexels 32014934: https://images.pexels.com/photos/32014934/pexels-photo-32014934.jpeg (this is the SECOND replacement - see correction note below)
- `subway-clinic-ad.jpg` - A Seoul subway passage with a large illuminated clinic advertisement (Korean-language eye-clinic lightbox, GRAN SEOUL MALL signage). Illustrates the "clinic ads in the commute" beat; caption says "clinic advertising," not plastic surgery specifically, to stay accurate. Pexels 31826590: https://images.pexels.com/photos/31826590/pexels-photo-31826590.jpeg
- `seoul-street.jpg` - Central Seoul street scene (Gwanghwamun/Sejong-daero area, Chosun Ilbo building visible). Captioned as "central Seoul," NOT as Gangnam, to stay location-accurate. Pexels 35007594: https://images.pexels.com/photos/35007594/pexels-photo-35007594.jpeg

Rejected during review: Pexels 13068364 (sleek beauty-store interior with zero Korean context -
could be any country; fails the Korea-first gate).

Downloaded and inspected 2026-07-24. All optimized/checked <=250 KB.

**2026-07-25 correction (round 1):** The original hero image (Pexels 31925324) was discovered to
already be in use as the hero image on Blog 239 (and Blog 192 before that) — a cross-post
duplicate that should never have been selected. Replaced with Pexels 31925334. See `HANDOFF.md`
2026-07-25 entry for the full incident record and the three other posts (237, 239, 242) that were
also corrected in the same pass.

**2026-07-25 correction (round 2):** The round-1 replacement (Pexels photo ID ending "...334")
turned out to ALSO already be in use, as Blog 315's `myeongdong-street-scene.jpg` (315 published
2026-07-22, earlier than 318, so it keeps that photo) - the first-pass duplicate check used a
regex that missed fully-slugified Pexels URLs, where the numeric ID trails a long descriptive
slug (e.g. a URL ending in a multi-word description followed by a dash and the ID) rather than
following `photo/` directly. The uniqueness script's regex was fixed to also catch trailing IDs,
and THIS replacement (photo 32014934) was verified against the corrected full-site scan before
selection. (Note: this note intentionally avoids writing the old photo ID in a dash-prefixed
slug-URL shape, since `scripts/audit-image-uniqueness.mjs` would otherwise flag this historical
prose as a live duplicate reference.)
