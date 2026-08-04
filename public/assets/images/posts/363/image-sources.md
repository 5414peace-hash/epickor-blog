# Image sources — Blog 363 (Dashida vs Dashi)

| File | Source | Original | Licence | Credit |
|---|---|---|---|---|
| `korean-beef-stew-stone-pot.jpg` | [Pexels photo 8952367](https://www.pexels.com/photo/8952367/) | 4928×3264 | Pexels licence | makafood |
| `korean-beef-soup-table.jpg` | [Pexels photo 15876424](https://www.pexels.com/photo/15876424/) | 4160×6240 | Pexels licence | 세훈 예 |
| `katsuobushi-bonito-flakes.jpg` | [File:Katsuobushi 02.jpg](https://commons.wikimedia.org/wiki/File:Katsuobushi_02.jpg) | 2848×2136 | **CC BY-SA 3.0** | Sakurai Midori |
| `kombu-drying-hokkaido.jpg` | [File:Japan, Hokkaido, drying kelp 1.jpg](https://commons.wikimedia.org/wiki/File:Japan,_Hokkaido,_drying_kelp_1.jpg) | 4967×3340 | **CC BY 4.0** | Marie-Sophie Mejan |
| `dasida-1975-tv-ad.jpg` | [CJ CheilJedang Dasida brand page](https://www.cj.co.kr/en/brands/dasida) | 1140×640 | Brand-archive image, editorial use for product history | CJ CheilJedang |

Both Commons licences require attribution, and both photographers are named in the article captions.

## The Japanese images are Japanese on purpose

The Korea-first rule bars foreign imagery in a Korea explainer. It does not apply to `katsuobushi-bonito-flakes.jpg`
and `kombu-drying-hokkaido.jpg`, because this article is **explicitly an international comparison** — the case
the rule carves out. These two images illustrate the *dashi* half of the comparison, and a Korean photo there
would be the actual error.

The Korean half of the article carries Korean images: two Korea-verified soup photos and CJ's own 1975 archive frame.

## There is no free-licensed Dashida pack shot. Anywhere.

The 0차 rule sends packaged goods to the manufacturer first, and that was tried properly before falling back:

| Route | Result |
|---|---|
| **CJ brand page** (`cj.co.kr/kr/brands/dasida`, and the `/en/` mirror) | Product images exist but are served at **200×128** — thumbnail only, unusable |
| **CJ TheMarket** (`cjthemarket.com`, CJ's own shop) | Product pages are JS-rendered; the open CDN only exposed banners at 582×240 and grid thumbnails at 132–264 px |
| **Emart / SSG** listing | JS-rendered, no image URLs in the served HTML |
| **Wikimedia Commons** | `Dasida`, `다시다`, `Korean seasoning powder`, `Korean soup stock powder`, and `Category:Condiments of Korea` all returned **zero** relevant results — the hits were 19th-century Italian newspapers and seed catalogues |
| **Wikipedia** | Both the Korean and English `다시다` / `Dasida` articles exist and **contain no images at all** |
| **Openverse** | **0 results** |

This is the pattern CLAUDE.md already records — stock libraries and public archives do not contain specific
commercial pack shots as a category. It is now confirmed for this product specifically, so the next session
does not repeat the search.

**No AI substitute was generated.** A synthesised Dasida box would carry fabricated Korean packaging text on a
real, identifiable commercial product, which is exactly what the Reels and card-news rules hard-reject. The
article names the box in Korean (**쇠고기 다시다**) and describes it in text instead.

## The 1975 advertising frame

`dasida-1975-tv-ad.jpg` is the find of this post. It is a frame from CJ's original launch campaign reading
**"11월 20일 다시다 탄생"** — *November 20, Dasida is born* — hosted in CJ's own brand archive on its corporate
site. It is used in the history section for editorial product identification, credited to CJ CheilJedang, and
it independently corroborates the 20 November 1975 launch date the article states.

At 1140×640 it is the only image on the page that could not be sourced at higher resolution, which is
appropriate for a 50-year-old broadcast frame.

## Uniqueness

`scripts/audit-image-uniqueness.mjs --check-id` was run on every Pexels candidate **before** download.
**8952367**, **15876424**, and **8954150** all returned clean; the first two were used. The Commons and CJ
images are first-use on this site.

## Processing

Resized with `sharp`, JPEG q80–86 mozjpeg. 44–284 KB each, post total under 720 KB.
