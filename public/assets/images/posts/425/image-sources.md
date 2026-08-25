# 425 — 송월타올 (Songwol) Korean towels, image sources

Three photographs from **Songwol's own corporate site (songwol.co.kr)**, retrieved 2026-08-25,
plus one EpicKor chart. 0차 rule: manufacturer first, because no stock library holds a packshot of
a specific brand's towel.

**Checked for a rights notice before using them, per the rule added on 2026-08-24 after Discovery
Expedition.** Songwol's product images carry **no watermark and no off-site warning**. The site
footer carries an ordinary copyright line, nothing declaring off-site display illegitimate.
Editorial use to identify the products discussed. No sponsorship implied or claimed.

## How they were retrieved
songwol.co.kr is WordPress. Homepage images are served as `-450x450` thumbnails; **stripping the
size suffix returns the original**, which here is **4500 × 4500**. Downscaled to 1200 px for the
article.

**One trap worth recording:** several filenames are Korean, and reading the HTML as UTF-8 with
`errors='ignore'` mangles them so the URLs 404. Percent-encode the *path* with
`urllib.parse.quote(parts.path, safe='/')` and they resolve.

## songwol-woven-brand-border.jpg (1200×1200, 127KB) — hero / ogImage
Source: `songwol.co.kr/wp-content/uploads/2026/07/{한글파일명}.jpg` (4500×4500 original).
Four folded towels with **SONGWOL woven into the border**. Chosen as hero because the article's
practical question — you were handed a Korean towel, what is it — is answered at exactly that spot,
and the brand mark is in the weave rather than on a tag.

## korean-towel-gsm-conversion.jpg (1300×880, 103KB)
EpicKor original chart. Six current Songwol products with their Korean spec (수 / gram / cm), the
selling price, and the GSM computed from weight ÷ area. Rendered as SVG, rasterised with sharp.

Built rather than sourced because **this conversion does not exist anywhere** — it is the article's
central claim, and a table of somebody else's numbers could not carry it. GSM figures are EpicKor
calculations, stated as such in the chart footer and in the Sources section.

First render had two layout faults caught by looking at it: the title overflowed the canvas and the
last row sat under the footnote. Fixed by breaking the title over two lines and raising the canvas
to 880 px.

## songwol-hotel-collection-labels.jpg (1200×1200, 209KB)
Source: `songwol.co.kr/wp-content/uploads/2026/08/{한글파일명}.jpg` (4500×4500 original).
Four striped Hotel Collection towels with the **woven HOTEL COLLECTION PREMIUM corner label**
legible. Supports the section on reading what you have been given.

## songwol-solid-towel-stack.jpg (1200×1200, 161KB)
Source: `songwol.co.kr/wp-content/uploads/2026/03/{한글파일명}.png` (4500×4500 original).
The plain hotel line in four colours, showing the woven border band. Used with the buying advice.

## Checked and rejected
- **Wikimedia Commons / Pexels / Unsplash** — no Songwol and no identifiably Korean towels.
  A generic towel photograph would fail the named-subject rule, and this article turns on a
  specific brand's spec labels.
- **The homepage lifestyle banners** (1284×512, bathroom scenes) — clean and unwatermarked, but
  2.5:1 crops that show a bathroom rather than the towel's construction. Not used.
- **A 답례품 towel with a printed family name and date** would be the ideal image for the gift-culture
  section and **could not be sourced**: those are made by small custom-weaving shops and no
  open-licensed photograph exists. That section runs on text rather than a substitute image.

## Cross-post uniqueness
No stock photo IDs used, so `audit-image-uniqueness.mjs` has no ID to key on. New to the
repository; no other post uses songwol.co.kr imagery.
