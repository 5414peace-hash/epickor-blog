# Image sources — Blog 388 (Is Korean sunscreen banned in the US?)

## CORRECTION, 2026-08-16 — the second image was wrong and has been replaced

The original second image was a **Korean skincare shop in Rotterdam** (`HARU HARU`, CC BY-SA 4.0,
Donald Trung Quoc Don). It was placed under the heading "Then Why Is It On Amazon Right Now?"
and the caption argued that Korean skincare reaches foreign buyers through specialist importers
rather than the drug-store channel.

**The representative rejected it on sight, and was right.** The article is about US FDA
regulation. The photograph was a Dutch street with a Turkish döner restaurant's menu board in
frame and a Dutch `Primera` shop next door. Nothing in it is Korean except a shop sign, and
nothing in it is American at all. The caption was doing all the work; the picture was doing none.

**The real failure was in sourcing, not in judgement.** The waterfall in `CLAUDE.md` goes
0차 manufacturer → 1차 Pexels/Commons → 2차 Korean public sources → 3차 ask → 4차 open web.
The original pass went straight to Commons, found a "Korean skincare" match, and stopped.
**Step 0 was never run for this post at all** — and step 0 is the one that had the answer.

This file's own previous version recorded the gap in writing: *"There is no photograph of a
Korean sunscreen label showing SPF 50+ PA++++ and a filter list. That single image would carry
the PA-rating section better than any prose."* The correct image was identified, written down,
and then not fetched. It took one request to a public Shopify endpoint to get it.

## 1. `olive-young-store-front.jpg` (hero, ogImage) — unchanged

- **Source:** https://commons.wikimedia.org/wiki/File:OliveYoung_store.png
- **Author:** Pkccccj — **attribution required, in the caption.**
- **Licence:** **CC BY-SA 4.0**
- **Original:** 1280x820 PNG. Delivered 1200px JPEG, mozjpeg, **87 KB**.
- **What it shows:** an illuminated Olive Young shopfront at night, signage reading
  `OLIVE YOUNG` and `HEALTH & BEAUTY STORE`.
- **Why:** the article is about where Korean sunscreen can and cannot be sold. This is the
  channel where it *is* sold, normally, at home. The article names Olive Young three times.

## 2. `beauty-of-joseon-relief-sun-spf50-label.jpg` — REPLACEMENT

- **Source:** Beauty of Joseon official store, product `Relief Sun : Rice + Probiotics
  (SPF50+ PA++++)`, listed at **$18.00**, retrieved 2026-08-16 via
  `https://beautyofjoseon.com/products.json` (the store's own public product feed).
- **Original:** 3000x3000 manufacturer product photograph.
- **Delivered:** cropped to the tube at `left 375, top 150, 2040x2550`, resized to
  **880x1100, 31 KB**.
- **What it shows, verified by cropping the label to 1000px and reading it:**
  `Beauty of Joseon` · `맑은쌀선크림` · `Relief Sun : Rice + Probiotics` · **`SPF50+ PA++++`**,
  with the 조선미녀 calligraphy mark and red seal.
- **Why this is the right image.** The article names Beauty of Joseon, and this is the single
  most-bought Korean sunscreen on Amazon — the literal answer to the heading it sits under.
  More importantly the label *is* the argument: `PA++++` is Korean/Japanese UVA notation that
  has no place on a US Drug Facts panel, which is what the body says at lines 36 and 110. The
  reader can now see the mismatch instead of being told about it.
- **Rights basis:** manufacturer product image used editorially to identify the product the
  article names, the same house practice as the Nongshim and Samyang packshots and the hy
  Mobility cart photos. No sponsorship is implied and the caption credits the manufacturer.

## Rejected

- **`Haru Haru` Rotterdam shopfront** — see the correction above. Removed from the post and
  deleted from the repo.
- **`LRP sunscreen bottle.jpg`** — Commons lists a La Roche-Posay bottle under CC BY-SA 4.0.
  The download returned an HTML error page rather than an image (4 KB, `<!DOCTYPE html>`).
  It was also the weaker choice on merit: La Roche-Posay is French, and a European bottle in
  an article about the Korea–US gap would have muddied the point.
- **Beauty of Joseon model photography** (four frames in the same feed, people holding the
  tube) — the product shot identifies the subject without putting an unrelated person's face
  into a regulatory article.

## Checks run

- **Cross-post uniqueness:** Olive Young shot is first use on this site (`192` and `028` also
  cover Olive Young; neither uses this photograph). The Beauty of Joseon product image is
  first use — no other post's `image-sources.md` references `beautyofjoseon.com`.
- **Size:** 87 + 31 = **118 KB** for the post, down from 209 KB.
- **Captions:** written after viewing each file at full size. The label caption quotes text
  that is actually legible in the delivered crop.

## Standing lesson for this repo

**If a caption has to explain why a photograph is relevant, the photograph is wrong.** The
Rotterdam caption needed two clauses of reasoning. The replacement needs none — a reader who
looks at the tube has already seen the point.
