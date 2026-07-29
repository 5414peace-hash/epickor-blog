# Image sources for Blog 337 (Korean Reality Dating Shows)

This post covers Single's Inferno, I Am Solo, Heart Signal, Transit Love, and similar Netflix/TVING
reality dating formats. Actual screenshots, promotional stills, and cast photos from these shows are
Netflix/TVING/broadcaster copyrighted material and are NOT used. Following the same pattern as Blog
331 (Korean Modern Art), every image here is independently real, license-verified photography of
something genuinely relevant to the article's context (the real filming region, the real product
category cast members use on camera, and the general at-home streaming habit), not a repackaged show
still.

- `jeju-island-coast.jpg` (hero/og) - Real coastline view near Hamdeok area, Jeju Island, South Korea:
  calm turquoise water, a headland, and a coastal walking path at golden-hour light. Jeju is
  independently confirmed by research as the real-world location used for Single's Inferno's later
  "Paradise" segments and reportedly for Transit Love Season 3, so this is captioned in the article as
  "Jeju Island, the real location used for later segments of these shows" - not as a frame from any
  show. Photo by Jongeun Kim via Pexels, photo ID 16910080, license: Pexels License (free for
  commercial use, no attribution required): https://www.pexels.com/photo/view-of-the-hamdeok-beach-in-south-korea-16910080/
- `korean-skincare-products.jpg` - Real Missha "M Perfect Cover B.B. Cream" product photography (tube,
  applicator, and stacked retail boxes with legible Korean-market packaging). Missha is a real,
  widely-recognized Korean beauty brand, used here as an honest generic illustration for the article's
  section on the real K-beauty products/skincare routines cast members use on camera - this is not
  presented as a specific product actually used by any named cast member, only as a genuine example of
  the product category. Photo by Natallia via Pexels, photo ID 13534508, license: Pexels License
  (free for commercial use, no attribution required): https://www.pexels.com/photo/close-up-shot-of-beauty-products-on-pink-surface-13534508/
- `streaming-tv-living-room.jpg` - Real photo of a person holding a remote in front of a TV showing a
  blurred, generic multi-thumbnail streaming-browse layout (no legible logos, titles, or show art).
  Used to support the general "which show to watch" / at-home streaming framing without implying it
  shows any specific service's real interface or copyrighted show artwork. Photo by cottonbro studio
  via Pexels, photo ID 12956039, license: Pexels License (free for commercial use, no attribution
  required): https://www.pexels.com/photo/a-close-up-shot-of-a-person-using-a-tv-remote-controller-12956039/

All three photo IDs checked with `node scripts/audit-image-uniqueness.mjs --check-id {id}` before
finalizing - none are used by any other post on the site (posts or business).

Rejected during selection:
- Pexels 12721805 (COSRX serum bottles) and 13794473 (Pyunkang Yul jar) - both real Korean skincare
  products and otherwise good fits, but already used as `kbeauty-cosrx-products.jpg` and a companion
  image in Blog 312's `image-sources.md`. Dropped for cross-post reuse, not image quality.
  `amuse` cushion compact (Pexels 12678574) was also considered for the skincare slot and is a fine,
  genuinely Korean, unused alternative if this image ever needs to be swapped later.
- Pexels 987586, 5202925, 4009402, 13806260, 5202917, 2726370 (TV-watching photos with a legible
  "NETFLIX" wordmark/logo visible on screen) - rejected to avoid using a real streaming service's
  brand logo/UI even though it is not show-specific artwork; `streaming-tv-living-room.jpg` (12956039)
  keeps the same "watching something at home" idea with a fully blurred, unbranded screen instead.
- Several other Jeju coastline candidates (Pexels 34350149, 34350262, 34350263, 34374340, 34374350,
  16663090-92, 11937832, 29134982) were reviewed and are all real, usable Jeju photos, but
  `jeju-island-coast.jpg` (16910080) was preferred for its warmer light and clearer sense of a
  resort/paradise-like coastline, matching the "Paradise" segment framing. Note: Pexels 33097914
  (Seongsan Ilchulbong, Jeju) is already used in Blog 154 and was avoided here for cross-post
  uniqueness even though it was not a top candidate for this post anyway.

Downloaded and optimized 2026-07-30 with `sharp` (resize to fit inside 1400-1500px wide,
mozjpeg quality tuned per image). All three verified as genuine JPEG photographs via `file` before
placement (not HTML error pages).
