# Reel 229 Thumbnail Concepts

Representative requested the Taegeukgi be removed and the intro thumbnail be redesigned more creatively.

## Concept Files

- Concept 01: `public/assets/reels/229/thumbnail-concepts/concept-01-floor-room.png`
  - Hook: `FLOOR IS THE ROOM`
  - Direction: documentary mystery
- Concept 02: `public/assets/reels/229/thumbnail-concepts/concept-02-shoes-stop.png`
  - Hook: `SHOES STOP HERE`
  - Direction: threshold warning
- Concept 03: `public/assets/reels/229/thumbnail-concepts/concept-03-step-wrong.png`
  - Hook: `DON'T STEP WRONG`
  - Direction: mistake hook

## Review Page

- Local page: `http://localhost:4000/assets/reels/229/thumbnail-concepts/index.html`
- The review page now includes per-concept `Copy image` and `Copy URL` buttons.

## Notes

- No Taegeukgi is used.
- PNG files are the representative-facing review/copy files. SVG source files are kept only as editable sources.
- `Copy image` attempts to place the PNG itself on the clipboard; if the browser blocks image clipboard access, it falls back to copying the PNG URL.
- 2026-06-24 representative decision: Reel 229 uses Concept 01.
- Thumbnail direction rotation starts now: next Reel uses Concept 02, the following Reel uses Concept 03, then repeat 01 -> 02 -> 03 unless the representative overrides it.
- Concept 01 was ported into `remotion/ReelComposition.tsx` and rendered in `output/reels/229/render/epickor-reel-229-v006.mp4`.
