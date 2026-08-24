# 423 — 햇반 (Hetbahn) image sources

Three photographs from **CJ's own newsroom** (`img.newsroom.cj.net`), downloaded 2026-08-24, plus
one EpicKor chart. This follows the 0차 rule in `CLAUDE.md`: for a packaged branded product the
manufacturer's own material is the first place to look, because no stock library holds a packshot
of a specific product.

Editorial use to identify the product under discussion. No sponsorship implied or claimed.

## hetbahn-210g-bowl.jpg (830×625, 27KB) — hero / ogImage
Source: `img.newsroom.cj.net/wp-content/uploads/2022/07/Hetbahn-Long-Shelf-Life.jpg`
The standard 210 g bowl, three-quarter view, with the 햇반 logo, the English "Cooked White Rice"
line, the weight and the energy figure all legible. Chosen as hero because the article is a
reading of this package and the reader needs to recognise the object on a shelf.

**Noted honestly in the caption:** this bowl prints **310 kcal** while the current version in
`hetbahn-lid-cooking-panel.jpg` prints **315 kcal**. Both are CJ images from the same 2022 batch.
Rather than pick one silently, the article states 310–315 and the caption points at the
difference — the two photographs are visibly different label revisions.

## hetbahn-lid-cooking-panel.jpg (750×422, 48KB)
Source: `img.newsroom.cj.net/wp-content/uploads/2022/07/image-246.png`, re-encoded to JPEG.
A still from CJ's own consumer explainer video (알 포인트, EP.01). Top-down on a wooden table,
showing the **cooking-instruction panel on the right of the lid** — 1개 2분 / 2개 3분 / 끓는물 10분.
That panel is the evidence for the article's central claim that the no-microwave method is printed
on the package, so this image is argumentative, not decorative.

**The frame carries a burned-in Korean subtitle and the programme's logo.** Kept rather than
cropped out, because the subtitle — "이 구멍을 통해 곰팡이가 생기게 되는 거야", mould gets in through
a hole — is itself the source for the article's warning to check the film before buying. The
caption says what the overlay is and where it comes from rather than leaving the reader to guess.

## hetbahn-aseptic-filling-line.jpg (750×422, 59KB)
Source: `img.newsroom.cj.net/wp-content/uploads/2022/07/image-245.png`, re-encoded to JPEG.
The filling line: stainless dosing heads over a conveyor of bowls, some empty and some already
holding rice. Supports the aseptic-packaging section, which is otherwise an abstract claim about
clean rooms. Same programme overlay as above, same reasoning.

## hetbahn-cooking-methods.jpg (1200×760, 64KB)
EpicKor original chart, built from the Korean instruction panel. Three rows — 전자레인지 1개 2분,
전자레인지 2개 3분, 끓는 물 10분 — with the Korean and the English on each, and the footer rule
that the film stays on for the boiling method. Rendered as SVG and rasterised with sharp.

Built rather than cropped because the panel in `hetbahn-lid-cooking-panel.jpg` is legible enough
to verify but too small to read as a standalone instruction at article width.

## Checked and rejected
- **cjfoods.com** — does not resolve. **cjthemarket.com** — returns an empty body to a plain
  request. **hetbahn.co.kr**, printed on the package itself — does not resolve.
- **cj.co.kr brand page images** — Hetbahn packaging composites exist but only at **315×315**,
  too small for article use.
- **Wikimedia Commons / Pexels / Unsplash** — no 햇반 packshots. Searches return generic bowls of
  cooked rice, which would fail the rule that an image must show the named subject.

## Cross-post uniqueness
No stock photo IDs used, so `audit-image-uniqueness.mjs` has no ID to key on. These are
manufacturer images new to the repository; no other post uses CJ Newsroom imagery.
