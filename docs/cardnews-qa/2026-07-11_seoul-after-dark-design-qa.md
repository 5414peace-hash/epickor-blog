# Product Design QA - Card News 081/288/290 Seoul After Dark Restyle

- source visual truth path: `output/cardnews/2026-07-11_290/seoul-after-dark-reference.png`
- implementation cover comparison: `output/cardnews/2026-07-11_seoul-after-dark-batch-comparison.png`
- implementation contact sheets:
  - `output/cardnews/2026-07-11_081/contact-sheet.jpg`
  - `output/cardnews/2026-07-11_288/contact-sheet.jpg`
  - `output/cardnews/2026-07-11_290/contact-sheet.jpg`
- viewport: 21 static Instagram cards at `1080x1080`
- state: final rendered batch

## Findings

- No actionable P0/P1/P2 findings remain.

## Required Fidelity Surfaces

- Fonts and typography: Passed. All 21 cards use the selected heavy gold headline, framed kicker, ivory support copy, page number, and two EPICKOR.COM marks. Copy is unclipped and readable at contact-sheet scale.
- Spacing and layout rhythm: Passed. Covers retain the centered profile-grid safe area. Supporting cards alternate left, centered, and right-aligned compositions while preserving consistent margins and headline/subhead rhythm.
- Colors and visual tokens: Passed. Deep blue-black overlays, warm gold accents, subtle glow, thin gold rules, and controlled image darkening carry the selected direction across baseball, pojangmacha, and palace photography.
- Image quality and asset fidelity: Passed. All 21 approved source photographs remain in place with 21 unique rendered hashes. No generated substitute, duplicate path, broken image, or misleading country/context image was introduced.
- Copy and content: Passed. Original card copy, Korean-context labels, slide numbers, and EPICKOR.COM text remain intact. The Korean payment phrase on Card 288-06 renders correctly as `Kadeu dwaeyo?`.

## Full-view Comparison Evidence

The four-frame comparison places the selected Image Gen direction beside the three implemented covers. All three preserve the selected centered cinematic hierarchy, gold-on-blue-black palette, thin gold axes, and corner branding while retaining their own approved photography.

The three 2160x1080 contact sheets provide focused card-by-card evidence for all supporting layouts. No additional crop was required because each card is displayed at 540x540 with headline, subhead, watermark, and photo context readable.

## Comparison History

- Initial batch implementation: no P0/P1/P2 findings. The selected visual system translated cleanly to all three topics. The generated reference's subtle metallic headline texture remains a P3-only difference; the deterministic render uses a cleaner solid gold for repeatability and mobile clarity.

## Verification

- Structural review passed for `081`, `288`, and `290`.
- 21/21 images are exactly 1080x1080.
- Each seven-card set has seven unique output hashes.
- Public and output asset hashes match after final copy.
- Manual visual review completed on all three high-resolution contact sheets.

## Follow-up Polish

- P3: A shared raster gold texture may be considered later if a more metallic title surface is preferred across the entire brand system.

final result: passed
