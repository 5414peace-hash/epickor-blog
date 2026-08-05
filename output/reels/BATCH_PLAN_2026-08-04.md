# Reels batch plan — category Reels, 2026-08-04

## What changed, and why the old plan was wrong

The previous plan evaluated footage **one post at a time**, and on that basis seven of ten topics
failed. That framing was the error, not the footage.

Representative's correction: build Reels by **category**, the way the card news and the hubs work.
Two things follow immediately.

**The pool stops being a slice and becomes the whole inventory.** The Dashida Reel had six
Korea-verified clips because it was allowed only "Dashida footage." A *Korean ramyun* Reel may use
every cooking clip we have.

**Stills stop being a fallback and become a job.** Under the new spec — **12–19 assets per Reel,
50%+ video, first scene video** — video carries the *scenes* and stills carry the *products*. That
dissolves the wall this whole week ran into: stock has no Korean pack shots, and **we already own
241 of them** across four hubs.

## Spec for this batch

| | Old | **New** |
|---|---|---|
| Assets per ~30s | 6–8 | **12–19** |
| Average cut | ~4–5s | **~1.6–2.5s** |
| Video share | 5 of 7 scenes | **≥50%, and the first scene is video** |
| Motion cards | 0 | 0 (unchanged, 2026-07-21) |

## Inventory this is drawn from

| Source | Count |
|---|---|
| Korea-verified video, 4K+ (16 gate runs, deduplicated) | **68** |
| Our own stills — convenience-store hub | 90 |
| Our own stills — ramyun hub | 57 |
| Our own stills — drinks hub | 47 |
| Our own stills — seoul hub | 47 |
| **Stills total** | **241** |

At 6–10 video clips per Reel with no reuse, 68 clips is roughly seven to eleven Reels of headroom.
A three-Reel batch is comfortable.

---

## Reel A — Korean Drinks → `/drinks`

**Thesis:** half the names on this shelf point at the wrong thing.
**Hook (video, motion in frame 1):** `4629216` — samgyeopsal on the grill, **7680×4320**, tongs
moving. The drink is what you order *with this*.
**Payoff:** the COCO cart — the drink that comes to your door on a refrigerator that is legally a
moped.

**Video — 6 clips, all Korea-verified**

| ID | Res | fps | What |
|---|---|---|---|
| `4629216` | **7680** | 23.98 | samgyeopsal grilling — **hook** |
| `37122144` | 3840 | 30 | Korean BBQ table, raw platter |
| `4768006` | 3840 | 29.97 | Korean table, soju bottle and banchan |
| `31801692` | 3840 | 23.98 | night shopping street, Seoul |
| `29233121` | 3840 | 23.98 | daytime street, 노래연습장 signage |
| `38567383` | 3840 | 30 | busy Seoul street |
| `28982709` | 3840 | 23.98 | nightlife, Korean streets |
| `37931943` | 3840 | 30 | busy urban street, Seoul |

**Stills — 8, all ours, all product-identified**
Chilsung bottles (KOCIS 4K) · Chilsung poured glass · Chilsung Zero can · Yakult Premium Light ·
COCO cart official · Milkis bottles · Bacchus F · Vita 500

**Total 16 assets · video 50% · ~1.9s per cut**

---

## Reel B — Korean Ramyun → `/ramyun`

**Thesis:** the packet everyone is scared of loses to one fresh Korean pepper.
**Hook (video, motion in frame 1):** `5337020` — 뚝배기 on an open flame, broth boiling.
**Payoff:** the Scoville reveal, which is the hub's own verified table.

**Video — 7 clips**

| ID | Res | fps | What |
|---|---|---|---|
| `5337020` | 4096 | 29.97 | 뚝배기 on flame, boiling — **hook** |
| `5337023` | 4096 | 29.97 | 뚝배기 with tofu |
| `35510473` | 3840 | 24 | kimchi stew, steel pot |
| `30729530` | 3840 | 23.98 | kimchi stew, black pot |
| `29117384` | 3840 | **60** | sizzling stir fry — slow-mo headroom |
| `34930003` | 3840 | 24 | kimchi and pork on griddle |
| `31421612` | 3840 | 23.98 | steaming pot, lid and condensation — **replaces the 25 fps clip** |
| `10085055` | 3840 | 24 | water at a rolling boil, steel pot |

> **`9508689` (camping noodles) was cut for being 25 fps.** CLAUDE.md forbids padding 25→30, and
> substitution is cleaner than an interpolation proxy. The two replacements are **country-neutral
> close-ups**, which the rules permit explicitly when a Korea-specific shot cannot be found — a pot
> lid venting steam belongs to no country. Both carry real boiling motion.
>
> **`32121505` was rejected** despite being 4K60 with a real noodle-lift action: the stall setup and
> bowls do not read Korean, and its slug is silent on country. Three separate traps this week came
> from assuming a silent slug was safe.

**Stills — 7**
Jin Ramen bowl · Jin mild pack · Jin spicy pack · Neoguri packet · Neoguri kelp ·
Ansungtangmyun noodle+powder · Buldak

**Total 15 assets · video 53% · ~2.0s per cut**

> **`5337020` and `5337023` are 뚝배기** — Korean earthenware — but their Pexels slugs say only
> "boiling tofu in a pot" and "boiling soup", so the country filter reads them as *silent*, not
> foreign. Confirmed by opening the frames. This is the case CLAUDE.md flags.

---

## Reel C — Seoul Neighbourhoods → `/seoul`

**Thesis:** twelve neighbourhoods, and the famous one is the one locals leave.
**Hook (video, motion in frame 1):** `37583766` — royal guard parade at the palace gate, **60 fps**,
people marching. Or `31801696` for a night-first cut.
**Payoff:** Euljiro's day-to-night turn — the same alley, machine shop to bar.

**Video — 8 clips**

| ID | Res | fps | What |
|---|---|---|---|
| `37583766` | 3840 | **60** | guard parade, palace gate — **hook** |
| `37448948` | **7680** | 24 | hanok roofs with N Seoul Tower |
| `34267134` | 3840 | **60** | aerial, traditional village homes |
| `29233125` | 3840 | **59.94** | hanbok crowd at Gyeongbokgung |
| `34267123` | 3840 | **60** | traditional market street |
| `31801696` | 3840 | 23.98 | nightlife, 와우산로 19길 sign in frame |
| `28987855` | 3840 | 23.98 | street guitarist at night, 노래방 neon |
| `31801544` | 3840 | 23.98 | Gwanghwamun street |

**Stills — 8**
Ikseon-dong hanok alley · Euljiro · Yeonnam · Mangwon · Haebangchon · Mullae · Bukchon · Seochon

**Total 16 assets · video 50% · ~1.9s per cut.** Four clips at 59.94–60 fps give real slow-motion range, which no
other Reel in this batch has.

---

## Allocation check

**24 distinct video clips across three Reels. Zero collisions** — verified programmatically, no
clip appears in two Reels. Two are 8K, four are 59.94–60 fps.

| Reel | Video | Stills | Total | Video share | Cut length |
|---|---|---|---|---|---|
| A drinks | 8 | 8 | **16** | **50%** | ~1.9s |
| B ramyun | 8 | 7 | **15** | **53%** | ~2.0s |
| C seoul | 8 | 8 | **16** | **50%** | ~1.9s |

All three land inside the 12–19 band, all clear the 50% video floor, and every hook is video.

## Open items before production

1. **Mixed cadence per Reel.** A is 24/30, B is 24/30 with one 60, C is 24/60. Set each composition
   to 30 fps and pull 60 fps sources natively; do not stretch the 23.98s.
2. **Each Reel now points at a hub, not a post.** That is a better funnel than the old
   single-post Reels, and the three hubs are new enough to need the inbound traffic.
3. **Still-heavy stretches.** With ~1.6–2.5s cuts, three consecutive stills would read as a
   slideshow. Interleave so no more than two stills run back to back.

## What this batch does not solve

**Traditional performance is our richest untapped pool — 21 Korea-verified clips at 4K, eight of
them 59.94/60 fps — and we still have no current post for it.** Reel C borrows four of them under
the Seoul banner. A dedicated post on palace ceremonies would unlock the rest with footage already
in hand, which is the reverse of our usual constraint.
