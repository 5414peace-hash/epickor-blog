# Image sources — Blog 377 (Korean hangover drinks)

| File | Source | Terms | What it shows |
|---|---|---|---|
| `condition-sticks-human-trial-badge.jpg` | HK inno.N official brand page, `inno-n.com/assets/front/pc/img/pr/condition/con_list-04.png` | Manufacturer pack shot, editorial product-identification use | Seven Condition sticks — zero-sugar, plum, green apple, choco, mint-choco. **Each sachet carries the `숙취개선효과 인체적용시험완료` badge**, which is the article's central fact printed on the product |
| `condition-bottle-hangover-technology.jpg` | HK inno.N, `con_list-01.png` | Same | The 1992 bottle format, still sold, carrying the same human-trial badge |
| `haejangguk-hangover-soup.jpg` | Commons `File:Haejangguk (hangover soup).jpg` | **CC0** | 해장국 — the remedy the article ends on |

## Why the manufacturer site

This is the 0차 step in the sourcing waterfall (CLAUDE.md, 2026-08-03): for a packaged branded
product, the maker's own site is the first place to look, because stock libraries and public
archives do not hold pack shots of specific commercial goods **as a category**. Confirmed again
here — Wikimedia Commons returned **zero** results for Korean hangover products across three
query shapes, while the official page returned seven products at 1106×1106 on clean white.

Use is editorial product identification. It does not imply any sponsorship or relationship, and
no such relationship exists.

**The badge is why these images earn their place.** The post's load-bearing fact is that Korea
began requiring human trial evidence for hangover claims on 1 January 2025. Both pack shots show
that requirement discharged, in print, on the front of the product — which a stock photo of a
convenience store could never do, and which an AI-generated image would render as unreadable
pseudo-Hangul.

## Processing

- Pack shots arrive on a wide white plate, so `sharp.trim({threshold: 8})` removes it before
  resizing; the product then fills the frame. trim() keys off the top-left pixel, which is pure
  white here — the 2026-08-05 failure was a cream-coloured product where that assumption broke.
- Flattened onto white (PNG source has alpha), mozjpeg q82.
- **149KB / 43KB / 207KB, 399KB for the post** — comfortably inside both the 400KB per-image gate
  and the 1MB per-post budget.
- The sticks image finishes at 882px wide rather than the usual 1200–1600 because that is its
  native size after the plate is trimmed. Not upscaled.

## Uniqueness

No Commons or manufacturer file used here appears in any other post's `image-sources.md`.
`Haejangguk (hangover soup).jpg` is not referenced elsewhere in the repo.
