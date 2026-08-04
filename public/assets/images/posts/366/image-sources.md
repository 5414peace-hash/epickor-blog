# Image sources — Blog 366 (Pocachip)

| File | Source | Original | Licence / basis | Credit |
|---|---|---|---|---|
| `pocachip-original-onion-bags.jpg` | [Orion official product catalogue](https://www.orionworld.com/goods/list/26) | 468×468 PNG (transparent) | Manufacturer official product image, editorial product identification | Orion |
| `pocachip-chips-plate.jpg` | [File:포카칩 사진.jpg](https://commons.wikimedia.org/wiki/File:%ED%8F%AC%EC%B9%B4%EC%B9%A9_%EC%82%AC%EC%A7%84.jpg) | 684×512 | **CC BY 2.0 KR** | 박둘리 |
| `swingchip-chips-plate.jpg` | [File:스윙칩 사진.jpg](https://commons.wikimedia.org/wiki/File:%EC%8A%A4%EC%9C%99%EC%B9%A9_%EC%82%AC%EC%A7%84.jpg) | 512×512 | **CC BY-SA 2.0 KR** | 박찹쌀 |

Both Commons attributions are carried in the article captions, as the licences require.

## Orion is the first manufacturer site this month that actually works

The 0차 rule has been failing all week — CJ serves 200×128 thumbnails, Haitai serves an SPA shell. **Orion is
server-rendered and honest**, and it is worth recording the difference:

- Real routes: `/goods/list/{id}?category={code}`, with product names and image paths in the served HTML.
- Pack shots at `/upload/goods/{hash}.png` — **468×468 transparent PNG cutouts**.
- **Its 404s are real 404s** (245–256 bytes). Haitai's site returns HTTP 200 with a 3.4 KB error page for
  every guessed path, so probes there look like hits and are not. Orion can be probed normally.

468 px is the maximum served — `/original/`, `/big/`, `/goods_org/` variants all genuinely 404.

## The hero is one image doing three jobs

`pocachip-original-onion-bags.jpg` was chosen because Orion's catalogue entry for 포카칩 is **not a single
bag** — it is Original and Onion photographed together. That single file carries:

- **포카칩** in Hangul with `Original` and `Onion` in English — the exact two products the article tells the
  reader to choose between
- the blue/green colour coding the article uses as a shorthand throughout
- and the gold badge reading **100% 국산 햇감자**, which is the claim the seasonal-potato section
  interrogates. **The claim being examined is printed inside the image.**

Trimmed of its transparent margin, flattened to white, then upscaled 468 → 1200 px with lanczos3 and light
sharpening. That is a 2.6× upscale and it is the weakest image on the page technically — accepted because
under the Blog Reference Image Standard the governing test is whether the image shows the exact named
subject, and no larger official file exists.

## The two Commons photos are a matched pair, and that is the point

The article's central buying decision is **포카칩 vs 스윙칩**, and the difference is physical: thin and flat
against thick and ridged. These two files show it directly.

They were also shot by different photographers in different bowls, so the comparison is not staged by us —
`pocachip-chips-plate.jpg` shows flat, translucent-edged chips; `swingchip-chips-plate.jpg` shows deep
parallel ridges. Placed adjacent in the comparison section, they carry the table.

(Incidentally, 박찹쌀 also shot the Matdongsan photograph used on `364`. Different subject, different file —
no reuse.)

## What was rejected

The Commons plate photo was **not** used as the hero despite being the largest real photograph available,
because it shows chips out of the bag with **no packaging** — product identity rests entirely on the
uploader's filename. The Orion cutout, upscaled and imperfect, proves what the article is about. Resolution
lost, identity gained.

Orion's 스윙칩 catalogue image (까르보나라불닭맛) was downloaded and **not used** — bag art showing ridges is
weaker evidence than a photograph of the actual ridged chips, which Commons provided.

## Uniqueness

`scripts/audit-image-uniqueness.mjs` keys off stock photo IDs and does not parse Commons filenames or
manufacturer paths, so uniqueness was confirmed by searching every existing `image-sources.md` for these
Commons titles and the Orion hash. No prior use of any of the three.

## Processing

`sharp`, JPEG q86–88 mozjpeg. 112–171 KB each, **407 KB** for the post.
