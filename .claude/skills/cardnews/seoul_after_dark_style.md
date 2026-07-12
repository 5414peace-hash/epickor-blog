# EpicKor Card News Preset - Seoul After Dark

Status: representative-approved reusable preset  
Approved: 2026-07-12  
Reference batch: Card News `081`, `288`, and `290`

## Purpose

`Seoul After Dark` is EpicKor's modern cinematic card-news system for photo-first Korean culture, food, travel, venue, and night-life topics. It uses deep blue-black image treatment, warm gold headlines, restrained glow, and thin editorial rules while keeping the source photography truthful and recognizable.

This is a reusable rendering preset, not permission to force every topic into a night aesthetic. Use it when the topic has strong photographic material and the darker treatment supports the subject. Keep the default bright/photo-first system for daylight, airy, beauty-texture, or highly practical topics when it produces a clearer result.

## Activation

Set the carousel-level style in `script.md`:

```yaml
---
slug: 000
topic: Example Topic
total_cards: 7
style: seoul-after-dark
---
```

No card-level style flag is required. The renderer reads the header value and applies the preset to every card.

Render with:

```powershell
node .claude\skills\cardnews\scripts\html-to-png-edge.mjs --slug 000
```

The implementation lives in `.claude/skills/cardnews/scripts/html-to-png-edge.mjs` as `renderSeoulAfterDarkHtml(card)`.

## Visual Tokens

| Role | Value |
|---|---|
| Deep blue-black base | `#06111d` |
| Primary gold headline | `#ffc94f` |
| Supporting warm ivory | `#ffe3a4` |
| Editorial gold rule | `#e7b84f` / `#f1b530` |
| Kicker surface | `rgba(5,14,24,.78-.84)` |
| Photo treatment | `saturate(1.08) contrast(1.08) brightness(.62-.66)` |

Typography uses the local rendering stack:

```css
font-family: Segoe UI, Arial, Noto Sans KR, Malgun Gothic, sans-serif;
```

Do not depend on a remote font or a live network request for rendering.

## Layout System

- Card 01 / `layout: F`: centered profile-grid-safe hook, framed kicker, small light spark, two-line gold headline, centered subcopy, and thin cross-axis rules.
- `layout: B`: lower-left editorial hierarchy so the photo remains readable above the message.
- `layout: C`: centered mid-card hierarchy for a strong single insight.
- `layout: E`: lower-right hierarchy to alternate carousel rhythm.
- `layout: D`: centered CTA/closing hierarchy.
- Every card retains the slide number, top-left EpicKor lockup, image label, and bottom-right `EPICKOR.COM` watermark.

The layout sequence should alternate rather than repeating the same alignment seven times. The renderer maps the existing EpicKor layout letters automatically.

## Image And Copy Rules

- Use an approved, topic-specific photo on every card when available.
- Preserve the original `image:`, `image_position:`, `image_zoom:`, kicker, main copy, subcopy, and image label unless a separate editorial change is approved.
- Keep Korean context visible and truthful. Dark grading must not make a weak or misleading photo acceptable.
- Never repeat the same `image:` path inside a carousel.
- Card 01 must remain readable as a profile-grid thumbnail.
- Do not imitate the gold title with an AI-generated text raster. The deterministic renderer protects spelling, punctuation, and repeatability.

## Required QA

1. Render all cards at 1080x1080.
2. Run the structural gate:

```powershell
node .claude\skills\cardnews\scripts\review-cardnews.mjs --folder output\cardnews\YYYY-MM-DD_slug
```

3. Create and inspect a high-resolution contact sheet.
4. Confirm every card shows `EPICKOR.COM`, no copy is clipped, and photos remain recognizable.
5. Record the normal Visual Fit Score in `visual-review.md`: average at least 90 and no card below 88.
6. Copy final PNGs and the contact sheet to the matching `public/assets/cardnews/` folder and verify public/output hashes match.

## Approved Reference Evidence

- `public/assets/cardnews/2026-07-11_081/` - Korean baseball culture.
- `public/assets/cardnews/2026-07-11_288/` - Seoul pojangmacha guide.
- `public/assets/cardnews/2026-07-11_290/` - Seoul palace night comparison.
- Batch QA: `output/cardnews/2026-07-11_seoul-after-dark-design-qa.md`.
- Selected-direction comparison: `output/cardnews/2026-07-11_seoul-after-dark-batch-comparison.png`.

These references prove that the preset can carry stadium, food/night-market, and heritage-place photography without changing the core visual identity.
