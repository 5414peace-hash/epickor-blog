# EpicKor Card News Quality Standard

Purpose: this document preserves the production standard proven on EpicKor's 2026-06-20 card-news batches. Another project or agent should be able to read this file and produce Instagram card news at the same level, adapted to that project's own brand, topic, and audience.

Use this as the quality bar whenever a representative asks for "EpicKor-level" card news.

## North Star

Card news is not a blog excerpt. It is a social carousel that must earn a swipe, save, share, and site visit.

The final asset should feel:

- Useful enough to save.
- Clear enough to understand on a phone.
- Fun enough to keep swiping.
- Trustworthy enough to represent the brand.
- Designed enough that it does not look like screenshots of article paragraphs.

For EpicKor, every carousel should support the funnel:

Instagram attention -> EpicKor.com visit -> useful guide reading -> affiliate or monetization opportunity.

For another project, replace the funnel destination with that project's own business goal, but keep the same discipline: social content should move users toward a valuable next step.

## Required Deliverables

For each carousel, produce a complete folder with:

- `card_01.png` through the final card, normally 7 cards.
- `script.md`.
- `caption.txt`.
- `image-sources.md`.
- `visual-review.md`.
- `sources/` when derivative crops or extra assets are used.

For batch-level QA, produce a self-review file when requested or when multiple carousels are produced together.

## Card Count And Flow

Default high-quality Instagram carousel: 7 cards.

Recommended structure:

1. Cover: strong centered hook, not a generic title.
2. First rule: the immediate practical framing.
3. Mistake or hidden logic: why people get it wrong.
4. Decision rule: what to do instead.
5. Context or example: make the advice feel real.
6. Skip/warning/save tip: the card users save.
7. Closing CTA: full guide or next step.

Each card needs one clear message. If a card needs two ideas, split it or rewrite it.

## Cover Standard

Card 01 must work as the Instagram profile-grid thumbnail.

Use this as the default cover treatment unless the representative asks otherwise:

- `layout: F`.
- Centered hook text.
- Conservative safe area; do not pin the hook to the left or bottom edge.
- Bright photo-first cover when the topic has real-world visuals.
- `image_opacity: 0.88` for the current approved EpicKor bright cover treatment.
- Background photo should be visible enough to identify the topic, while text remains readable.

Do not regress to the older low-visibility cover look. The 2026-06-20 standard deliberately made the cover photo about 10 percentage points more visible than the older `0.78` cover baseline.

## Copywriting Standard

Write for a phone screen.

Good card-news copy:

- Sounds like a sharp human insight, not a blog paragraph.
- Gives one rule, mistake, or decision per card.
- Uses concrete nouns and verbs.
- Avoids generic "ultimate guide" filler.
- Makes the user think, "I should save this."
- Keeps facts inside the source article or verified sources.

Examples of strong hook styles:

- "Your cute summer suitcase is lying."
- "Your suitcase should not be the main character."
- "Stop buying ramen by spice level."
- "Rain does not ruin Seoul. Bad routing does."

Avoid:

- Long explanatory sentences.
- Clickbait that the article cannot support.
- Claims such as "always," "guaranteed," or "best" unless proven.
- Advice that could become medical, legal, immigration, airline, or safety guidance without caveats.

## Fact Safety

Card news can simplify, but it must not invent.

Before finalizing:

- Check the source post's factual boundaries.
- Keep official/current-condition claims conditional when needed.
- Use "verify" wording for rules that can change, such as airline eligibility, airport services, event dates, visa/travel requirements, prices, schedules, or health guidance.
- Do not turn a cautious blog paragraph into an absolute social-card claim.

Examples:

- Seoul Station City Airport Terminal: say to verify airline, flight, hours, and ticket rules before relying on it.
- Weather/rain/heat: tell readers to check current forecast or official weather sources.
- Food/allergens: do not guarantee dietary safety from visuals or packaging alone.

## Image Standard

Every card should have a relevant image.

For travel, food, shopping, beauty, places, products, venues, and daily-life explainers, photo-first is the default. Generated/owned visuals are acceptable when they are intentionally produced for the topic and clearly support the card.

Image priority:

1. Post-owned images.
2. Project-owned or generated images.
3. License-safe external images.
4. Carefully documented derivative crops.
5. Graphic-only fallback only when photo sourcing genuinely fails or the representative approves.

Never repeat the same `image:` path inside one carousel.

If the same source subject is needed twice, save a separate derivative crop with a new path and document why in `image-sources.md`.

For Korea/EpicKor:

- Prefer visibly Korean places, signage, products, packaging, food, streets, shops, or Korea-shot source metadata.
- Reject visibly foreign streets, packaging, interiors, or non-Korean context unless the card is explicitly comparative.

For another project, replace "Korea" with the project's domain-specific context standard. The rule is the same: the image must not quietly lie about the topic.

## Rendering Standard

Final PNGs must be:

- `1080x1080`.
- Mobile-readable.
- Free of text overlap.
- Free of clipped words.
- Watermarked with the required project domain; EpicKor uses `EPICKOR.COM`.
- Visually inspected after rendering, not only syntax-checked.

After rendering, create or inspect a contact sheet. Look for:

- Kicker bar and headline crowding.
- Tiny subtitles.
- Text pushed too low.
- Watermark missing or hidden.
- Background image too washed out or too distracting.
- Same-looking cards repeating too many times.

If a human notices overlap or crowding, fix and re-render. Passing a script is not enough.

## Structural Gates

Before presenting or calling a carousel finished:

- Run the project structural review script if available.
- Confirm every local image path exists.
- Confirm no repeated `image:` path inside the carousel.
- Check against existing carousel scripts for cross-post image reuse.
- Confirm final PNG dimensions.
- Confirm each card has the watermark.

For EpicKor:

```bash
node .claude/skills/cardnews/scripts/review-cardnews.mjs --folder public/assets/cardnews/YYYY-MM-DD_slug
```

## Visual Fit Score

Every finished carousel needs a written `visual-review.md`.

Use this 100-point visual fit model:

- Direct topic fit: 30.
- Context/domain fit: 25.
- No misleading text/watermark/copyright/context risk: 20.
- Carousel variety and coherence: 15.
- Rendered mobile quality: 10.

Approval rule:

- Average must be at least `90/100`.
- No individual card should be below `88/100`.
- Misleading country/context mismatch caps a card at `59`.
- Graphic-only use where a photo could reasonably be sourced caps a card at `79`.

## 10-Point Self Review For Batches

When multiple carousels are produced, score each carousel against these 10 criteria, each out of 10:

1. First-card hook and grid-thumbnail strength.
2. Swipe logic and story progression.
3. Practical save/share value.
4. Fact safety and source-boundary discipline.
5. Image topic fit and context fit.
6. Image variety and duplicate-risk control.
7. Mobile readability, text hierarchy, and no overlap.
8. Brand consistency and required watermark presence.
9. Caption/upload-package readiness.
10. Funnel value: website CTA, affiliate adjacency, lead capture, or other business next step.

Pass rule:

- Total must be over `90/100`.
- If a carousel scores under 90, revise and rerender.
- If any hard gate fails, the score does not matter; fix the hard gate first.

EpicKor reference batch scores from 2026-06-20:

- `204`: `95.0/100`.
- `216`: `93.9/100` after spacing correction.
- `219`: `95.0/100` after spacing correction.
- `218`: `96.2/100`.
- `220`: `94.6/100`.
- `221`: `96.0/100`.

## Caption Standard

Each carousel should include `caption.txt`.

A good caption:

- Extends the hook without repeating all cards.
- Gives a short save-worthy summary.
- Points to the full guide or next step.
- Uses a small, relevant hashtag set.
- Does not sound like an ad wall.

## Documentation Standard

`image-sources.md` must explain:

- The image path used per card.
- The source or ownership basis.
- Why derivative crops were created.
- Any rejected misleading or duplicate sources when relevant.
- Whether a neutral image is being used only as a concept visual.

`visual-review.md` must explain:

- Structural gate status.
- Manual rendered-PNG inspection status.
- Per-card score and notes.
- Average and lowest score.
- Pass/fail decision.

For meaningful work, update the project handoff with:

- What was produced.
- What was rendered and inspected.
- Scores and blockers.
- Upload/deploy status.
- Next recommended action.

## Transfer To Other Projects

When another project wants to learn from EpicKor:

1. Keep the workflow, gates, score model, and social-copy discipline.
2. Replace EpicKor's domain details with the project's own brand, watermark, audience, and funnel.
3. Replace Korea/context fit with the project's truth standard.
4. Preserve the "no generic visuals, no repeated image paths, no unverified claims, no text overlap" rules.
5. Always visually inspect rendered PNGs before calling the work done.

The EpicKor standard is not just a visual style. It is a production discipline.
