# Footage Gate — 2026-07-26 batch

Run **before** any strategy or storyboard work, per the 2026-07-21 rule created after Reel 311 was
scrapped (10 queries, 29 candidates, zero usable vertical tteokbokki footage) with its whole plan
already written. Method: Pexels video API, `orientation=portrait`, then **frames inspected in an
ffmpeg contact sheet** — titles were not trusted.

## Titles lie — measured again this run

Confirming the known trap with fresh evidence. Portrait results returned for:

| Query | What actually came back |
| --- | --- |
| `namdaemun market` | Peru potato harvest, Tagaytay (Philippines) flower shops, Indian night snacks |
| `korean fried chicken` | a sandwich and fries, a schnitzel, stir-fried noodles in a wok |
| `naengmyeon` | Indonesian mi goreng packaging, ramen soup, ice cubes in a glass |
| `jjimjilbang` | hanbok display, traditional dance, a hansik meal spread |
| `korean convenience store` | a man in a cafe, a generic supermarket aisle |

**Fix that worked:** anchor every query to Korea by place, not by dish name — `seoul street food`,
`gwangjang market seoul`, `myeongdong street`, `korea traditional market`, `seoul subway`.
Dish names alone pull the same dish from other countries.

## PASS

- **Korean street food / market** — 40 unique portrait clips. Real motion events confirmed on frame:
  gloved hands pressing and flipping hotteok on a street griddle, a bubbling ttukbaegi stew, pork
  belly on a round Korean grill. Korea confirmed by Hangul signage (약 pharmacy signs, 중구 banners),
  Korean tableware, and Myeongdong/Seoul landmarks in the wide shots.
- **Seoul subway** — 13 unique portrait clips. Korea confirmed by yellow tactile paving with the
  blue/orange platform stripe, Hangul station signage, Seoul Station exterior, Namsan Tower.
  Motion event: a crowd pouring off an escalator in a green-ceilinged transfer corridor.
  **Exclude one Turkish subway clip** (Türkiye flag on the train livery) that the query pulled in.

## FAIL — do not plan a Reel on these

- **PC bang.** 7 portrait results total. Only one reads as a PC bang at all (a gaming chair in a dark
  room with red-lit rigs) and it is a static object with no motion event. The rest were a Korean
  observatory, an elevated highway, a woman in a cafe, a man on a couch with a laptop, and a posed
  gamer portrait. A PC bang Reel would be still-image zooms, which is a Reels 2.1 hard reject.
  **Blog post 327 is unaffected** — Wikimedia Commons has 13 authentic Korean PC bang photographs,
  and stills are fine for an article. This gate is about video only.
- **Naengmyeon, Korean fried chicken, jjimjilbang** — no Korea-verified footage found this run.

## Selected for production

| Slug | Post | Hook motion (verified on frame) | Outro CTA |
| --- | --- | --- | --- |
| 220 | Korean Subway Snacks Guide | gloved hands pressing hotteok on the griddle | B `DON'T ORDER BLIND` |
| 174 | Seoul Subway Etiquette | crowd pouring off the escalator / packed silent car | C `LOCALS KNOW THE REST` |
| 175 | Namdaemun vs Dongdaemun | night market alley lighting up under neon | D `BEFORE YOU LAND` |

Three different outro mechanisms, no consecutive repeats, per the rotation rule.

---

## Second sweep, 2026-07-27 — Korean night footage does not exist on Pexels

Reel 175's payoff needed a Korean market after dark. The originally selected clip
(`38522593`) was **cut at high-resolution frame inspection**: alongside 충무김밥 and
24시간 in Hangul it carries 新宿 (Shinjuku), Shibuya on a screen, KATSUSA, and Japanese
noren. It may be a Japan-themed alley inside Korea, but it reads as Japan and cannot be
verified, so the same standard that rejected `28869249` applies.

A replacement sweep ran seven Korea-anchored queries and frame-checked **57 unique
portrait clips**. Every night result was somewhere else:

| ID | Query | What the frame actually shows |
| --- | --- | --- |
| 18662592 | `myeongdong night` | Tokyo — katakana トラノコ |
| 19743526 | `myeongdong night` | **渋谷センター街** (Shibuya Center-gai), Japanese flag, ファミリーマート |
| 31387611 | `korean night street neon` | **ハラペコ食堂 "Korean Dining"** — a Korean restaurant in Japan |
| 30682979 | `myeongdong night` | **Türkiye** — KÜTAHYA BELEDİYESİ |
| 15961928 | `myeongdong night` | **Türkiye** — YENİ YILA YENİ BAŞLANGIÇ |
| 29235948, 29235880 | `korean night street neon` | Vietnam |

**Exactly one verified Korean night clip exists in this pool:** `38489828`, a rainy
street with Hangul 약 pharmacy signage (희구약국 / 이비인후과 / Since 1952).

**Resolution.** The night beats run on a forward/reverse **ping-pong proxy** of that one
clip (12.9s usable, duplicated endpoint removed) — never a hard loop, per the continuity
rule. On-screen copy was changed so it never claims to be Dongdaemun after dark: it now
reads `AFTER DARK / It doesn't stop`, which is what the frame can prove. The
`NAMDAEMUN` label was also removed from the 방산시장 shot, because Bangsan Market is not
Namdaemun and putting that name on screen would have been false.

**Open item for the representative:** Reel 175's narration says Dongdaemun runs till dawn,
but the footage can only show Korea after dark, not that market. Judgement call is yours —
the alternative was shipping a Tokyo alley, which I would not do.
