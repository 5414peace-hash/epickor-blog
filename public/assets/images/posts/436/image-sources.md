# Blog 436 — Korean Humidifiers — image sources

Three manufacturer photographs and two EpicKor charts.

| File | What it shows | Source | Licence / credit |
|---|---|---|---|
| `miro-humidifier-disassembled-underwater.jpg` | The humidifier separated into six parts, photographed underwater | `gomiro3.dothome.co.kr/images/nr07s/NR07S_all.jpg` (MIRO official detail page) | Manufacturer image, **product identification**. No sponsorship implied |
| `miro-humidifying-engine-washable.jpg` | The 가습엔진 transducer module fully submerged | Same source page | Same basis |
| `miro-humidifier-in-a-home.jpg` | The assembled humidifier on a glass table in a living room | Same source page | Same basis |
| `korean-humidifier-types-compared.jpg` | EpicKor chart — 초음파식 / 가열식 / 복합식 and what each does to the tank water | Made for this post | Method descriptions cited in the article's Sources |
| `miro-korea-lineup-vs-amazon.jpg` | EpicKor chart — the Korean store lineup with prices against the four models Amazon US lists | Made for this post | Korean prices read off the maker's own store 2026-09-02 |

**The photographs are carrying the article's central claim, not decorating it.** The piece argues that
Korean buyers choose on whether the machine comes apart; the exploded underwater shot *is* that claim,
and the submerged-engine shot is the specific part every other humidifier tells you never to wet. A
stock photo of mist coming out of a white box could not do either job.

**⚠️ Korea-first ruled out the obvious Commons file.** `File:Ultrasonic humidifier.jpg` is public domain
and is exactly the right product category, but it is a **Vitek**, a Russian brand — disqualifying for a
Korea explainer. Pexels has 4,147 humidifier photos and every usable one is a generic non-Korean mood
shot. **The 0차 rule (manufacturer site first) supplied everything here**; nothing below it would have.

**Technical notes:**
- MIRO serves its detail imagery from a secondary host, `gomiro3.dothome.co.kr`, over plain `http`; it
  needs a browser user-agent and a `Referer` of `https://www.gomiro.com/`.
- These are Korean e-commerce **상세페이지 strips** — one file is `860 × 19551`. Slice into tiles and
  look at them before cropping; the useful photographs sit at specific offsets inside the strip and
  there is no way to know where without viewing it.
- Marketing headlines were cropped off each photograph so they read as product references rather than
  as advertisements. The small maker credit line at the bottom of the exploded shot was cropped too.
- The charts are **vertical stacked cards**. The first render still produced two collisions — the
  Korean card label overlapped its English sub-label because the offset was hard-coded, and the footer
  ran under the watermark. Both were only visible by opening the JPEG. **Measure the label instead of
  guessing its width, and wrap the footer inside the width the watermark leaves free.**

**Cross-post uniqueness:** no other post's `image-sources.md` references `gomiro`, `miro.co.kr` or
`dothome`, checked before download. Note that `scripts/audit-image-uniqueness.mjs` keys off
Pexels/Unsplash photo IDs and cannot see manufacturer URLs, so this check is manual.

**Size:** 28 + 37 + 32 + chart + chart ≈ 300KB across five images.
