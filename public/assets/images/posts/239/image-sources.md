# Image Sources - Blog 239

Post: Korean Hair Care Shopping Guide 2026

## Korean-Context And Duplicate Review - 2026-06-27

Representative asked to double-check whether the images read as Korean. The first Korea-fit pass improved the article, but a later SHA-256 duplicate check found that two Myeongdong images were exact copies of existing Blog 207 assets. A second replacement pass also found two attempted Pexels replacements already used in Blogs 211 and 237, so the final set below uses distinct image hashes.

## Selected Images

1. `myeongdong-kbeauty-cosmetics-street.jpg`
   - Source: Pexels, photo 32014943 (was 31925324 until 2026-07-25)
   - Photographer: Pexels contributor
   - URL: https://images.pexels.com/photos/32014943/pexels-photo-32014943.jpeg
   - Use: Hero/OG image.
   - Visual review: Colorful "Seoul" sign landmark art installation on a Myeongdong street; location confirmed by the photo's own #myeongdong/#zaemiro hashtags visible in-frame.
   - Duplicate review (2026-07-25): The original photo 31925324 passed the 2026-06-27 SHA-256
     exact-file-hash duplicate check at the time, but was in fact already the hero image of Blog
     192 (published 2026-06-10) — SHA-256 comparison only catches byte-identical files, and each
     post's copy had been compressed independently to a different file, so the hashes never
     matched even though the source photo was the same. It was later also copied into Blog 318
     as a third use. Replaced here with a source verified unique by Pexels ID against every
     `image-sources.md` on the site (see `scripts/audit-image-uniqueness.mjs`), which is the
     correct check going forward — not file-hash comparison. See `HANDOFF.md` 2026-07-25.

2. `scalp-serum-dropper.jpg`
   - Source: Pexels, photo 28994390
   - Photographer: Beyzanur K.
   - URL: https://www.pexels.com/photo/28994390/
   - Use: Scalp tonic and root-care section.
   - Visual review: Neutral close-up, not a Korean-place image. Kept as a product-use support image because it explains the scalp-tonic action without misleading foreign retail context.
   - Duplicate review: Not an exact hash duplicate of another `public/assets/images/posts/` image.

3. `myeongdong-kcosmetics-hair-street-night.jpg`
   - Source: Pexels, photo 33019200
   - Photographer: Saksham Vikram
   - URL: https://images.pexels.com/photos/33019200/pexels-photo-33019200.jpeg
   - Use: Hair treatment and product-selection section.
   - Visual review: Strong Seoul/Myeongdong night-shopping context with visible Korea cosmetics, mask, and hair signage.
   - Duplicate review: Not an exact hash duplicate of another `public/assets/images/posts/` image.

4. `salon-hair-treatment.jpg`
   - Source: Pexels, photo 7755663
   - Photographer: RDNE Stock project
   - URL: https://www.pexels.com/photo/7755663/
   - Use: Salon/head-spa context section.
   - Visual review: Neutral salon-treatment support image. Kept because it explains the service workflow and does not show a misleading foreign storefront, packaging, or country-specific sign.
   - Duplicate review: Not an exact hash duplicate of another `public/assets/images/posts/` image.

## Replaced / Removed From Markdown

- `korean-hair-wash-salon.jpg`
  - Reason: Topic-relevant but not visibly Korean; too weak as the first image for a Korean hair-care guide.
- `hair-care-products-flatlay.jpg`
  - Reason: Topic-relevant but visually generic and not Korea-coded; replaced with Seoul/K-beauty street context.
- `myeongdong-kbeauty-shopping-street.jpg`
  - Reason: Exact hash duplicate of `public/assets/images/posts/207/myeongdong-shopping-day.jpg`; removed after duplicate review.
- `seoul-night-kbeauty-street.jpg`
  - Reason: Exact hash duplicate of `public/assets/images/posts/207/seoul-night-beauty-street.jpg`; removed after duplicate review.
- `myeongdong-street-shopping-route.jpg`
  - Reason: Exact hash duplicate of `public/assets/images/posts/211/myeongdong-beauty-street-market.jpg`; removed after duplicate review.
- `myeongdong-kcosmetics-night-street.jpg`
  - Reason: Exact hash duplicate of `public/assets/images/posts/237/myeongdong-night-shopping-street.jpg`; removed after duplicate review.

## Reviewer Notes

- Final visible set: 2 Korea-context beauty/hair-shopping images plus 2 neutral product/service support images.
- No visible foreign retail setting remains in the article.
- SHA-256 duplicate check passed after the final replacement pass.
- Manual image inspection completed after replacement.
