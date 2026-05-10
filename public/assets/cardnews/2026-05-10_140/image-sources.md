# Image Sources - Card News 140

Source post: `/blog/140` - `A High-Tech Sanctuary: Why Korea's Public Toilets are the Best in the World`

## Used post-owned assets

- Card 01: `/assets/images/posts/140/140_01.jpg`
- Card 02: `/assets/images/posts/140/140_05.jpg`
- Card 03: `/assets/images/posts/140/140_02.jpg`
- Card 04: `/assets/images/posts/140/140_03.jpg`
- Card 05: `/assets/images/posts/140/140_04.jpg`
- Card 06: `/assets/images/posts/140/140_06.jpg`

## Revision note

The first finalized version used all graphic cards because the available post-owned images contain embedded short-form captions. The representative flagged that a travel-practical carousel with no photos felt underbuilt. The revised version uses six distinct post-owned photo cards and keeps card 07 as an image-free CTA so the carousel does not repeat the cover image.

## QA notes

- Cross-cardnews duplicate check found no prior card-news use of `/assets/images/posts/140/`.
- The source article contains mojibake in the FAQ line for `Open Toilet`; the card-news copy avoids that corrupted text and uses plain English guidance instead.
- `review-cardnews.mjs --slug 140` passed structural image coverage with `6/7` image cards and `1` consecutive image-free card.
- Same-carousel duplicate image path check passed; no `image:` path repeats.
- Rendered cards keep the `EPICKOR.COM` watermark.
- Instagram upload remains representative-managed.
