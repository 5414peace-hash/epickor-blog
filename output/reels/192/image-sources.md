# Reels 192 Image Sources

## Combined Dashboard Correction - 2026-06-16

- Representative clarified that the new real-source pass should not remove the existing candidate images.
- Corrected approach:
  - Keep the new Olive Young real-source candidates first in each photo scene.
  - Append the existing source-post, Pexels, and generated candidates after the new candidates for side-by-side review.
  - Keep motion-card scenes as single `Select` choices, not Rank 1 / Rank 2.
- Rebuilt dashboard output:
  - `.tmp/reel192-review-share/index.html`
  - `output/reels/192/candidate-contact-sheet-v6-combined-source.jpg`
- Dashboard gate result after combined rebuild:
  - `npm.cmd run reels:dashboard-gate -- --slug 192` passed.
  - Photo candidates: 44.
  - Photo source families: 34.
  - Warnings are documented source callbacks or preserved legacy-source duplicates across two scenes; no candidate file path is duplicated.

## Real-Source Rebuild - 2026-06-16

- Representative rejected the previous dashboard because the visual pool still felt bland, did not show Olive Young signage, and leaned too much on generated support visuals.
- This v5 rebuild originally replaced the generated-v2/generated-v3 photo candidate pool, but the combined-dashboard correction above now preserves those earlier candidates as additional review options.
- New real-source candidate folder:
  - `public/assets/reels/192/commons/`
  - `public/assets/reels/192/real-v4/`
- Download method:
  - Wikimedia Commons original/redirect downloads initially returned HTTP 429 from `upload.wikimedia.org`.
  - Retried through `commons.wikimedia.org/wiki/Special:Redirect/file/...` with a descriptive User-Agent.
- Commons sources used:
  - `File:Olive Young Myeongdong.jpg`
    - Source page: https://commons.wikimedia.org/wiki/File:Olive_Young_Myeongdong.jpg
    - Author: Sgroey
    - License: CC BY-SA 4.0
    - Use: Scene 1 and Scene 7 real Olive Young sign/checkout candidates.
  - `File:OliveYoung store.png`
    - Source page: https://commons.wikimedia.org/wiki/File:OliveYoung_store.png
    - Author: Pkccccj
    - License: CC BY-SA 4.0
    - Use: Scene 1 and Scene 7 clean Olive Young storefront/sign candidates; Scene 4 motion-card background C.
  - `Category:Olive Young Wonju`
    - Source page: https://commons.wikimedia.org/wiki/Category:Olive_Young_Wonju
    - Use: real Olive Young interior/product shelf candidates for Scenes 1, 3, 5, and 6.
    - Note: file-level licenses are listed on the Commons file description pages; derived 9:16 crops were made for review.
- Pexels real-photo backups used where an exact Olive Young visual did not fit the scene action:
  - `pexels-beauty-shelf-browsing-7755519.jpg` for Scene 3 backup.
  - `pexels-skincare-shopping-cart-5632404.jpg` and `pexels-cosmetics-sale-bag-5632393.jpg` for Scene 5 backups.
  - `pexels-packed-open-suitcase-8933565.jpg` for Scene 6 packing constraint.
  - `pexels-cosmetic-tubes-brush-12969358.jpg` for Scene 7 product-texture backup.
- Dashboard gate result after rebuild:
  - `npm.cmd run reels:dashboard-gate -- --slug 192` passed.
  - Photo candidates: 15.
  - Photo source families: 10.
  - Warnings are deliberate limited callbacks where the same Commons real Olive Young source appears in two different scenes; no source family is used more than twice.
- Motion-card dashboard UX:
  - Motion-card scenes now use a single `Select` button plus `Replace`, not Rank 1 / Rank 2.
  - Scene 4 motion-card backgrounds were also changed from generated images to real-source derivatives.

## Source Post Images

- `/assets/images/posts/192/seoul-beauty-shopping-street.jpg`
  - Source: Blog 192 local asset / Pexels Theodore Nguyen
  - License: Pexels license
  - Use: scene 1 candidate and motion-card background option.

- `/assets/images/posts/192/cosmetics-shelf-browsing.jpg`
  - Source: Blog 192 local asset / Pexels
  - License: Pexels license
  - Use: scene 1 candidate and motion-card background option.

- `/assets/images/posts/192/skincare-label-shopping.jpg`
  - Source: Blog 192 local asset / Pexels
  - License: Pexels license
  - Use: scene 3 candidate.

- `/assets/images/posts/192/skincare-products-flatlay.jpg`
  - Source: Blog 192 local asset / Pexels
  - License: Pexels license
  - Use: scene 5 candidate and motion-card background option.

## Pexels Downloads

## EpicKor Generated Support Visuals

- `/assets/reels/192/generated-v2/kbeauty-drugstore-aisle.png`
  - Source: EpicKor generated image, created 2026-06-15.
  - Use: scene 1 candidate.
  - Note: Korean K-beauty drugstore aisle, no readable brand logos, not an actual Olive Young location.

- `/assets/reels/192/generated-v2/skincare-label-compare.png`
  - Source: EpicKor generated image, created 2026-06-15.
  - Use: scene 3 candidate.
  - Note: Hands comparing skincare labels in a K-beauty aisle, no readable brand logos.

- `/assets/reels/192/generated-v2/smart-kbeauty-haul.png`
  - Source: EpicKor generated image, created 2026-06-15.
  - Use: scene 5 candidate.
  - Note: Compact first-time K-beauty haul with sunscreen stick, toner pads, lip tint, patches, and travel mini.

- `/assets/reels/192/generated-v2/travel-minis-suitcase.png`
  - Source: EpicKor generated image, created 2026-06-15.
  - Use: scene 6 candidate.
  - Note: Travel minis and compact K-beauty pouch next to a suitcase.

- `/assets/reels/192/generated-v2/seoul-kbeauty-outro.png`
  - Source: EpicKor generated image, created 2026-06-15.
  - Use: scene 7 candidate.
  - Note: Seoul K-beauty shopping outro with logo-free bag and compact products.

## EpicKor Generated Support Visuals - 2026-06-15 v3 Replacement Pass

- Search note: Wikimedia Commons was checked as a non-Pexels source. `File:OliveYoung store.png` was found as CC BY-SA 4.0, but direct download from `upload.wikimedia.org` returned HTTP 429 in this environment. Other Commons search results were visibly foreign cosmetics stores or unrelated PDFs, so they were rejected for Korea-context risk.

- `/assets/reels/192/generated-v3/s3-aisle-walk-first-a.png`
  - Source: EpicKor generated image, created 2026-06-15.
  - Use: scene 3 replacement candidate.
  - Note: 9:16 K-beauty aisle with a traveler calmly comparing two products; no readable brand logos.

- `/assets/reels/192/generated-v3/s3-aisle-walk-first-b.png`
  - Source: EpicKor generated image, created 2026-06-15.
  - Use: rejected after manual inspection for scene 3 because it repeated the same shopper/aisle visual family as candidate B.
  - Note: 9:16 Korean-style beauty aisle, walk-first framing with strong vertical crop safety.

- `/assets/reels/192/generated-v3/s3-basket-pause-c.png`
  - Source: EpicKor generated image, created 2026-06-15.
  - Use: scene 3 replacement candidate.
  - Note: 9:16 K-beauty aisle with a small two-product basket; added to reduce same-model/same-angle repetition.

- `/assets/reels/192/generated-v3/s5-one-one-one-flatlay-a.png`
  - Source: EpicKor generated image, created 2026-06-15.
  - Use: scene 5 replacement candidate.
  - Note: 9:16 one need / one curiosity / one small gift flatlay, no readable brand logos.

- `/assets/reels/192/generated-v3/s5-one-one-one-basket-b.png`
  - Source: EpicKor generated image, created 2026-06-15.
  - Use: scene 5 replacement candidate.
  - Note: 9:16 compact K-beauty basket with three intentional purchases.

- `/assets/reels/192/generated-v3/s5-one-one-one-pouch-c.png`
  - Source: EpicKor generated image, created 2026-06-15.
  - Use: scene 5 replacement candidate.
  - Note: 9:16 travel pouch interpretation of the 1-1-1 rule.

- `/assets/reels/192/generated-v3/s6-travel-pouch-suitcase-c.png`
  - Source: EpicKor generated image, created 2026-06-15.
  - Use: scene 6 replacement candidate.
  - Note: 9:16 travel pouch with sunscreen, lip tint, patches, serum, and suitcase; strongest safe-crop option.

- `/assets/reels/192/generated-v3/s6-travel-minis-suitcase-a.png`
  - Source: EpicKor generated image, created 2026-06-15.
  - Use: scene 6 replacement candidate.
  - Note: 9:16 travel-minis packing setup, no readable brand logos.

- `/assets/reels/192/generated-v3/s6-compact-vs-bulky-b.png`
  - Source: EpicKor generated image, created 2026-06-15.
  - Use: scene 6 replacement candidate.
  - Note: 9:16 compact-versus-bulky routine comparison.

- `/assets/reels/192/generated-v3-motion/s4-rule-grid-bg-a.png`
  - Source: derivative copy of EpicKor generated v3 support visual, created 2026-06-15.
  - Use: scene 4 motion-card background.
  - Note: Separate path used to avoid exact file-path reuse between photo candidates and motion-card backgrounds.

- `/assets/reels/192/generated-v3-motion/s4-rule-receipt-bg-b.png`
  - Source: derivative copy of EpicKor generated v3 support visual, created 2026-06-15.
  - Use: scene 4 motion-card background.
  - Note: Separate path used to avoid exact file-path reuse between photo candidates and motion-card backgrounds.

- `/assets/reels/192/generated-v3-motion/s4-rule-zone-bg-c.png`
  - Source: derivative copy of EpicKor generated v3 support visual, created 2026-06-15.
  - Use: scene 4 motion-card background.
  - Note: Separate path used to avoid exact file-path reuse between photo candidates and motion-card backgrounds. On 2026-06-16 the paired Scene 4 C motion card was rebuilt from the broken comparison template to `menu_board`; the background file path remains usable even though the old file name contains `zone`.

## Scene 4 Motion-Card Repair - 2026-06-16

- Representative flagged the motion-card portion for Reels 192 as still broken.
- Root cause found during the repair: the previous Scene 4 C option used a comparison template whose actual Remotion render includes unrelated hardcoded labels, which is wrong for an Olive Young shopping rule.
- Scene 4 motion-card options now use only safer supported templates:
  - A: `kit_grid` / recommended #1 / Need, Curiosity, Gift, Stop.
  - B: `receipt_stack` / recommended #2 / Real need, Curiosity, Small gift, Rest waits.
  - C: `menu_board` / recommended #3 / Need item, Curiosity, Tiny gift, Exit.
- Static review dashboard was rebuilt so motion cards preview the card structure, not just background images.

- `/assets/reels/192/candidates/pexels-myeongdong-night-shopping-33019190.jpg`
  - Source: Pexels / Saksham Vikram
  - URL: https://images.pexels.com/photos/33019190/pexels-photo-33019190.jpeg
  - License: Pexels license
  - Use: scene 1 candidate.

- `/assets/reels/192/candidates/pexels-beauty-shelf-browsing-7755519.jpg`
  - Source: Pexels / shelf browsing candidate 7755519
  - URL: https://images.pexels.com/photos/7755519/pexels-photo-7755519.jpeg
  - License: Pexels license
  - Use: scene 3 candidate, replacing an over-repeated Theodore Nguyen street source during the 2026-06-15 gate repair.

- `/assets/images/posts/192/skincare-label-shopping.jpg`
  - Source: Blog 192 local asset / Pexels
  - License: Pexels license
  - Use: scene 3 candidate, replacing a missing lipstick-display candidate during the 2026-06-15 gate repair.

- `/assets/reels/192/candidates/pexels-skincare-shopping-cart-5632404.jpg`
  - Source: Pexels / Kaboompics
  - URL: https://images.pexels.com/photos/5632404/pexels-photo-5632404.jpeg
  - License: Pexels license
  - Use: scene 5 candidate and motion-card background option.

- `/assets/reels/192/candidates/pexels-beauty-products-flatlay-5632324.jpg`
  - Source: Pexels / Kaboompics
  - URL: https://images.pexels.com/photos/5632324/pexels-photo-5632324.jpeg
  - License: Pexels license
  - Use: scene 5 candidate and motion-card background option.

- `/assets/reels/192/candidates/pexels-cosmetics-sale-bag-5632393.jpg`
  - Source: Pexels / Kaboompics
  - URL: https://images.pexels.com/photos/5632393/pexels-photo-5632393.jpeg
  - License: Pexels license
  - Use: scene 6 candidate and motion-card background option.

- `/assets/reels/192/candidates/pexels-seoul-vendors-signage-29562548.jpg`
  - Source: Pexels / Alexander London
  - URL: https://images.pexels.com/photos/29562548/pexels-photo-29562548.jpeg
  - License: Pexels license
  - Use: scene 6 candidate.

- `/assets/reels/192/candidates/pexels-packed-open-suitcase-8933565.jpg`
  - Source: Pexels / Timur Weber
  - URL: https://images.pexels.com/photos/8933565/pexels-photo-8933565.jpeg
  - License: Pexels license
  - Use: scene 6 backup candidate for the packing-space point.

- `/assets/reels/192/candidates/pexels-myeongdong-market-street-31925334.jpg`
  - Source: Pexels / Theodore Nguyen
  - URL: https://images.pexels.com/photos/31925334/pexels-photo-31925334.jpeg
  - License: Pexels license
  - Use: scene 7 candidate.

- `/assets/reels/192/candidates/pexels-cosmetics-cart-neutral-5650049.jpg`
  - Source: Pexels / Kaboompics
  - URL: https://images.pexels.com/photos/5650049/pexels-photo-5650049.jpeg
  - License: Pexels license
  - Use: scene 7 candidate.

## Rejected / Not Used

- Actual Olive Young storefront images were not used because no license-safe local asset was available during this pass.
- Generic product images are not described as actual Olive Young products or store interiors.
