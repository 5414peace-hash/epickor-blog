# Blog 437 — Korean Exfoliating Towels — image sources

Two official retailer photographs, one Wikimedia Commons photograph, two EpicKor charts.

| File | What it shows | Source | Licence / credit |
|---|---|---|---|
| `korean-italy-towel-yellow-black-stripes.jpg` | Daiso's 등밀이용 긴 때 타월 in yellow, three black stripes, on a stone surface with soap | `daisomall.co.kr` product `pdNo=99534702` | Retailer image, **product identification**. No sponsorship implied |
| `korean-back-scrubber-handle.jpg` | 핸들형 때타올 — pink plastic wand with a green detachable scrub head | `daisomall.co.kr` product `pdNo=41110` | Same basis |
| `korean-exfoliating-mitt-purple.jpg` | A purple exfoliating mitt held in one hand | `commons.wikimedia.org/wiki/File:Korean_Exfoliating_Mitt.jpg` | **CC BY-SA 4.0** — OliviaLyu |
| `italy-towel-colour-claim.jpg` | EpicKor chart — the colour claim in English listings against Korean sources | Made for this post | Both sides cited in the article's Sources |
| `italy-towel-how-to-use.jpg` | EpicKor chart — soak first, once a week at most, the back needs a tool | Made for this post | Prices read on Daiso's own store 2026-09-02 |

**The three photographs each answer a different sentence.** The Daiso strip is the product in its
Korean retail form, and its stripes are the detail Korean descriptions single out. The handled wand
exists in the article because `korean exfoliating towel for back` is one of the top autocomplete
queries and this is literally the answer. The Commons mitt is there because the **mitt is the export
form** — English listings show mitts where Korean shops show flat cloths — and no retailer shot could
make that point as plainly as a photograph of a mitt on a hand.

**⚠️ The hero caption was wrong on first write and had to be corrected.** It called the image "the
classic form: a coarse rectangle", but `pdNo=99534702` is the **등밀이용 긴 때 타월**, the 88 × 24cm
back strip — a different SKU from the square bath cloth the sentence described. **Check which SKU a
retailer image actually is before writing a caption that classifies it**, especially when the article
later distinguishes those SKUs by name.

**Stripe count was verified against the file, not assumed.** Korean reference text describes
"까만 두 줄" — two black lines — but this particular towel has **three**. The alt text says three
because that is what the photograph shows; the body text makes no claim about a fixed stripe count.

**Technical notes:**
- Daiso serves product imagery from `cdn.daisomall.co.kr/file/PD/{yyyymmdd}/...`; a browser
  user-agent and a `Referer` of `https://www.daisomall.co.kr/` are enough.
- The Daiso hero arrives at 2580 × 3437 and 2.5MB. Resized to 1150px wide at q78 → 213KB, inside the
  150–250KB working target rather than the 400KB gate.
- Charts reuse the generator built for post 436, which measures the Korean label width instead of
  hard-coding an offset. Both rendered clean on the first attempt this time; they were still opened
  and checked by eye.

**Cross-post uniqueness:** no other post's `image-sources.md` references `daisomall` or
`Korean_Exfoliating_Mitt`, checked before download with underscore/space normalisation.
`scripts/audit-image-uniqueness.mjs` keys off Pexels/Unsplash IDs and cannot see either source.

**Size:** 213 + 14 + 166 + chart + chart ≈ 620KB across five images.
