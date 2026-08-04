# Image sources — Blog 364 (Matdongsan)

| File | Source | Original | Licence | Credit |
|---|---|---|---|---|
| `matdongsan-in-bag.jpg` | [File:맛동산 사진.jpg](https://commons.wikimedia.org/wiki/File:%EB%A7%9B%EB%8F%99%EC%82%B0_%EC%82%AC%EC%A7%84.jpg) | 512×512 | **CC BY-SA 2.0 KR** | 박찹쌀 |
| `karinto-japan.jpg` | [File:Karintō 002.jpg](https://commons.wikimedia.org/wiki/File:Karint%C5%8D_002.jpg) | 3747×2488 | **CC0** | Ocdp |
| `yugwa-korean-hangwa.jpg` | [File:Korean.desserts-Yugwa-01.jpg](https://commons.wikimedia.org/wiki/File:Korean.desserts-Yugwa-01.jpg) | 1600×1200 | **CC BY-SA 2.0** | abex |

All three attributions are carried in the article captions, as the licences require.

## The image gate passed here, unlike Dashida

This post was written straight after `363`, where **no free-licensed pack shot existed anywhere**. Matdongsan
was checked the same way before writing, and the result was different: **Commons holds exactly one real
photograph of the product**, `맛동산 사진.jpg`, and it is a good one — shot inside the opened bag with the
Haitai packaging visible at the edges and individual peanut fragments legible on the glaze.

That single file is why this topic was written now. Had it been absent, the post would have gone back to the
queue as `blocked_no_imagery` rather than shipping with a category substitute.

**The manufacturer route was tried first and failed the same way CJ did.** `ht.co.kr` is a JS-rendered SPA
that returns the same HTML shell for `/sitemap.xml`, `/robots.txt`, and every guessed image path — probes
appear to return HTTP 200 but the payload is a 3.4 KB error page, not an image. Verified by downloading one
and checking the file type against a known-good asset (`/img/og/og.jpg`, a real 197 KB JPEG). No Haitai pack
shot was obtainable.

## The two comparison images are the argument

The article's central correction is that Matdongsan **looks like Korean traditional confection but descends
from Japanese karintō**. Two photographs carry that better than any amount of prose:

- `karinto-japan.jpg` — the same short fried sticks in the same glaze, but **darker** (brown sugar) and
  **bare** where Matdongsan is rolled in peanut. Shot on white, so the coating difference is unmissable.
- `yugwa-korean-hangwa.jpg` — 유과, the Korean traditional sweet people assume Matdongsan is related to.
  Rice-based, puffed, coated in grain, pale. Structurally a different object.

**The Japanese image is foreign on purpose.** As with `363`, the Korea-first rule carves out explicit
international comparison, and a Korean photo in that slot would be the actual error.

Chosen deliberately: `Karintō 002.jpg` over `Karintō 001.jpg` (both CC0, same photographer) because 002 is
on a clean white ground where 001 is on cream, and the point being made is about surface colour and coating.

For 유과, the higher-resolution CC0 option (`Omija-cha and yugwa.jpg`, 3264×4912) was downloaded and
**rejected after cropping** — the yugwa sits in that frame's background and goes soft when enlarged, and its
pieces are ring-shaped, where the article is comparing against Matdongsan's **sticks**. The lower-resolution
`Korean.desserts-Yugwa-01.jpg` shows bar-shaped 유과 sharply and makes the better comparison.

## One rejection worth recording

Pexels **36220303** was found under `korean market interior`, passed the uniqueness audit, and was
**rejected on inspection**: it is a Korean-*themed* shop somewhere else, not a shop in Korea. The sign reads
`GANGNAM MARKET`, but the wall menu is in a Southeast Asian language and there is a SPAM poster. **A Pexels
`alt` string is the uploader's description, not evidence of location** — the same trap as the 8K Manila fish
market that topped the first footage-gate run. Downloaded, viewed, deleted.

## The hero is 512 px, and that was the right trade

`matdongsan-in-bag.jpg` is upscaled from 512×512 to 900×900 (lanczos3, light sharpen). That is below the
1200–1600 px working target and it is the only image on the page that is.

It was kept because the Blog Reference Image Standard's governing test is **whether the image shows the exact
named subject**, and this is the only free-licensed photograph of Matdongsan in existence. A sharper generic
Korean-snack-aisle photo would score worse under the standard, not better — and the one such candidate found
turned out not to be in Korea at all.

## Processing

`sharp`, JPEG q82–86 mozjpeg. 128–190 KB each, **459 KB** for the post — comfortably inside the 1 MB target.
