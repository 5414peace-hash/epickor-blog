# 426 — Korean toothpaste (고불소 / 2026 recalls), image sources

Two photographs from **VUCA's own store (vuca.co.kr)**, retrieved 2026-08-25, plus two EpicKor
charts. 0차 rule applied: manufacturer first, because no stock library holds a packshot of a
specific Korean toothpaste.

**Rights notice checked before use, per the rule added 2026-08-24 after Discovery Expedition.**
vuca.co.kr's footer carries only an ordinary `Copyright © VUCA. All rights reserved.` line — no
watermark on the product images, no statement declaring off-site display illegitimate. Editorial
use to identify the products discussed. No sponsorship implied or claimed.

## Why the photographs are all one brand

This is worth recording rather than hiding. The article names three brands — 2080 (애경산업),
Median (아모레퍼시픽) and VUCA (케이보은제약) — but only VUCA has an open, scrapeable official
store with clean packshots.

- **2080**: Aekyung's brand pages (`aekyung.co.kr/brand_detail?...brand_idx=61`) are JS-rendered
  and return **no image payload at all** — 23 KB of shell, zero `/files/` URLs, and Playwright
  could not get past it either. There is no separate 2080 brand site.
- **`2080.com` is not the brand.** It resolves 200 and is a **Chinese domain-parking marketplace**.
  Checking it took thirty seconds and prevented linking it in the article.
- **The six recalled 2080 tubes cannot be photographed anyway** — they were recalled, so they are
  off Korean shelves. The useful image for that section is a label diagram, not a product shot.
- **Median**: Amorepacific's site is similarly JS-gated. Not pursued once the label-diagram
  approach made a Median photo unnecessary.

## Checked and rejected

- **Wikimedia Commons**: `toothpaste Korea` and `Korean toothpaste` return **2 hits each**, both
  wrong — a **North Korean** toothpaste advertisement and a ginseng toothpaste. `2080 toothpaste`
  and `oral care Korea supermarket` return **0**. `Perioe` returns Roman coins.
- **Pexels / Unsplash**: no identifiably Korean toothpaste. A generic tube would fail the
  named-subject rule, and this article turns on what is printed on a specific tube.
- **VUCA's own promotional bundle image** (`202608/1a8c...jpg`) — clean and unwatermarked, but
  carries a `61% 새 학기 특급혜택` sale overlay burned into the artwork. That is an advertisement,
  not a packshot. Not used.

## vuca-classic-high-fluoride.jpg (1100×1100, 146KB) — hero / ogImage

Source: `vuca.co.kr/web/product/medium/202607/a97cefff527ffacd3bc9ab969fe84bed.jpg` (1000×1000).
Product: **뷰카 클래식 고불소 구취케어 비건치약, 아쿠아민트향 110g 4개입**.

Chosen as hero because the box prints **"VUCA CLASSIC HIGH FLUORIDE TOOTHPASTE"** in English
across the front. The article's opening claim is that Korea markets fluoride as a premium feature;
this image proves it without a caption having to assert it.

This is the same **뷰카 클래식 구취케어** line named in the July 2026 recall. The caption and body
are careful on this point: the recall covered **one manufacturing lot** (`20260202A1`), not the
product line, and this is the aqua-mint variant. The photograph is captioned as the line, never as
"the recalled product".

Note `/web/product/big/` returns a 150-byte error on this shop; `/medium/` is the largest
available.

## korea-toothpaste-fluoride-rules.jpg (1300×1010, 105KB)

EpicKor original chart. The two conflicting MFDS notices side by side, the 신고/허가 consequence,
and a five-point timeline from the 2014 licensing change to the manufacturing rule as it stands
today.

Built rather than sourced because **this comparison is not published anywhere in English**, and it
is the article's central claim. Figures come from the notices themselves (law.go.kr), MFDS product
registrations (nedrug.mfds.go.kr) and 건치신문 2018-11-01 / 2020-07-27.

First render overflowed the canvas twice — the dark result band ran off the right edge and the
source footer ran off the bottom. Caught by opening the file. Fixed by splitting the band across
two lines, splitting the footer, and raising the canvas from 940 to 1010 px. Same failure mode as
425's chart; worth expecting on every SVG chart with long bilingual strings.

## korean-toothpaste-label-check.jpg (1300×1060, 118KB)

EpicKor original chart. The five legally required fields on the back of a Korean toothpaste tube —
제조업자, 제조국, the mandatory `이 치약의 불소 함유량은 ○○ppm임` sentence, 제조번호, 사용기한 —
each paired with what it settles about the 2026 recalls.

Built because **no photograph can carry this**. A real back-of-tube photo would need a recalled
tube in hand, and those were collected. The diagram does the job a photo cannot.

Second render fixed a collision: row 3's English gloss ran into the right-hand annotation, and the
bottom band overflowed. Shortened both.

## vuca-junior-1450-grape.jpg (1100×1100, 126KB)

Source: `vuca.co.kr/web/product/medium/202606/7e320eb94306eb3c45d2e6199ca7f71a.jpg` (1000×1000).
Product: **뷰카 주니어 마일드 구취케어 비건 치약 포도향 110g 4개입**.

Used with the pricing section because the box prints **`1450 TOOTHPASTE`** and the tubes carry the
ppm figure — the clearest visual evidence that Korea sells 저불소 and 고불소 as separate lines.

## Cross-post uniqueness

No stock photo IDs, so `audit-image-uniqueness.mjs` has no ID to key on. vuca.co.kr imagery is new
to the repository; no other post uses it. Both charts are original to this post.
