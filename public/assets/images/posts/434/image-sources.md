# Blog 434 — Hwalmyungsu / K.O.D — image sources

Three manufacturer packshots and two EpicKor charts. **Wikimedia Commons has no Hwalmyungsu image at
all** — searches for `Hwalmyungsu`, `활명수` and related terms return nothing — and Pexels/Unsplash have
no photograph of a specific Korean pharmacy product. The 0차 rule (manufacturer site first) supplied
everything usable here.

| File | What it shows | Source | Note |
|---|---|---|---|
| `hwalmyungsu-timeline.jpg` | EpicKor chart — 1897 founding, 1910 trademark 514, 1919 liaison office, 1967 carbonation, 1996 Guinness, 2026 K.O.D | Made for this post | Dates cited in the article's Sources section |
| `hwalmyungsu-pharmacy-vs-convenience.jpg` | EpicKor chart — 까스활명수-큐 (일반의약품, pharmacy) against 까스활 / 미인활 (의약외품, convenience store) | Made for this post | Classification per Dongwha product information and Korean press |
| `hwalmyungsu-product-family.jpg` | The whole line: original bottle, 까스활명수-큐, 꼬마활명수 sticks, 활명수-유 pouches | `dong-wha.co.kr/product/pimage/20250227040816_2502_whalmyungsu01.jpg` | Manufacturer image for **product identification**. No sponsorship implied |
| `gas-hwalmyungsu-q.jpg` | 까스활명수-큐액, green box and bottle | `dong-wha.co.kr/product/pimage/415_img2.jpg` | Same basis |
| `hwalmyungsu-original.jpg` | The original non-carbonated 활명수, brown bottle and red/white box | `dong-wha.co.kr/product/pimage/415_img1.jpg` | Same basis — this is the format the US K.O.D is based on |

**The two packshots are carrying the article's central contrast.** The piece argues that what America
is getting in September is not what Koreans drink, so the green carbonated box and the brown still
bottle need to be seen next to each other rather than described. They are shown as separate images at
matched width for that reason.

**⚠️ The timeline was rebuilt after a bad first render — and this is the fifth time in this class.**
A six-column horizontal timeline gives each caption about 210px, which is not enough for a sentence:
every label overlapped its neighbours. **Rebuilt as vertical rows**, which give the text the full page
width and keep the year column scannable. Posts 426, 428, 429 and 433 all hit the same wall in
different forms. **Horizontal multi-column timelines are not worth attempting again** — go vertical
from the start, and open the rendered JPEG regardless, because no script catches this.

**Technical notes:**
- `dong-wha.co.kr` refuses an HTTPS connection to its product pages from some clients but serves the
  images fine over `http` with a browser user-agent and a `Referer`. Same finding as post 432.
- Product image paths are predictable: `/product/pimage/{t_idx}_img{n}.jpg` plus a dated hero file.
- The generator `.tmp/make-434-assets.mjs` deletes its `src-` files on success; the sources were
  re-fetched to re-render the timeline. Guard new generators with `fs.existsSync` from the start.

**Cross-post uniqueness:** none of the three Dongwha URLs appears in another post's `image-sources.md`,
checked before download. Post 432 uses a different Dongwha path (`85_img1.jpg`, the Fucidin tube).

**Size:** 81 + 72 + 106 + 43 + 38 = 340KB for the post, across five images.
