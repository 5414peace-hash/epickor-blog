# Image sources — Blog 399 (Where to read Korean webtoons)

This is a practical app guide, and the house standard for practical guides (the 222/223/224
benchmark in CLAUDE.md) explicitly prioritizes **official screenshots and real app/page
context** over stock photography. All three images are screenshots I took directly with a
1400px viewport on 2026-08-17, each of a public homepage, each captioned with what it is,
when it was taken, and that it is for identification.

## 1. `webtoon-global-app-home.jpg` (hero, ogImage)

- **Source:** screenshot of `webtoons.com/en/` (WEBTOON's global English storefront),
  2026-08-17, Playwright, 1400x1000.
- **What it shows, verified:** Popular Series rankings and — the detail that carries the
  article's thesis — a banner for **Disney, Marvel and Star Wars stories on WEBTOON**. A
  Korean company's platform distributing American IP flagships is the "this is no longer an
  export arm" argument in one frame.
- **Why hero:** the article's core confusion is "is WEBTOON Naver?" — so the hero is the
  storefront most readers actually use, identified as such.

## 2. `naver-webtoon-korea-home.jpg`

- **Source:** screenshot of `comic.naver.com/webtoon`, 2026-08-17.
- **What it shows:** the Korean original's home with **weekday release tabs** — the visual
  evidence for the Weekday Ritual section (Koreans track series by day of week).

## 3. `kakao-page-home.jpg`

- **Source:** screenshot of `page.kakao.com`, 2026-08-17.
- **What it shows:** Kakao Page's storefront mixing webtoons and web novels — the app that
  invented the wait-until-free model the article explains.

## Rights basis

Editorial screenshots of publicly accessible homepages, used to identify the services the
article is about, at reduced resolution, with source and date stated in every caption. This
is the same practice as the corrected 222/223/224 posts the house standard names as the
benchmark. No login areas, no user data, no paywalled content in frame.

## Rejected

- **`NAVER Green Factory.jpg` / `Naver HQ.jpg`** (Commons, properly licensed) — the owner's
  building, but a building photo in an app-decision guide is decoration; the standard asks
  for the actual interface. Kept in reserve for any future Naver corporate story.
- **`Line FriendsStore BT21` series** (KOCIS) — BT21 is a BTS×LINE Friends property, not a
  webtoon product; using it would imply a false connection.
- **Commons searches for reading/manhwa-shelf photos** — zero usable results (`webtoon phone
  reading`, `manhwa bookstore Korea` both empty).

## Checks run

- **Cross-post uniqueness:** first screenshots of these properties on the site; no
  `image-sources.md` references webtoons.com, comic.naver.com or page.kakao.com imagery.
- **Size:** 180 + 167 + 138 = **485 KB** for the post.
- `npm run audit:image-context -- --slug 399`: 0 critical / 0 high / 0 medium.

## Gap worth noting

A phone-in-hand photo of someone actually scrolling a webtoon (the reading posture the whole
industry is built on) exists nowhere openly licensed. Ten seconds with any phone in Korea
would produce it.
