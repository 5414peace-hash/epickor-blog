# Reels batch plan — 2026-08-11 (the 8/16 gap)

## The gap

`drinks` 8/13 · `ramyun` 8/14 · `seoul` 8/15 are scheduled and verified. **Nothing after 8/15.**
Card news covers 8/16–8/24, so Reels are the side that goes dark first. This batch fills it.

## Gate first, as required

Five topics were gated before any thesis was written. **Every verdict below came from opening
contact frames, not from reading counts.** Three failed.

| Topic | Korea-named | Verdict | Why |
|---|---|---|---|
| **palace ceremony / traditional performance** | 145 | **PASS** | drums, flags, marching, sword work — real motion events, subject survives the 9:16 band |
| **hanok / village / palace** | 91 | **PASS** | dancheong, lanterns, hanbok crowds, fortress; distinct register from the above |
| **han river / park / nature** | 49 | **PASS** | blossoms, bridges, river; **6 of 11 are native vertical** |
| korea-convenience-store | 97 | **FAIL** | **zero convenience stores.** Pool is Seoul streets, Myeongdong cathedral, a bank, city buses |
| jokbal-bossam | 31 | **FAIL** | pool is **grilled** pork; the article's thesis is boiled vs braised. Footage would contradict the script |

### The two failures are the same two failures we already documented

**korea-convenience-store is `yakult-cart` again.** High Korea-named count, none of the object.
CU/GS25/7-Eleven interiors are not a category stock libraries carry, exactly like commercial pack
shots. Do not re-gate this topic hoping for a different result; the answer is our own 90
convenience-store stills, not video.

**jokbal-bossam is `chilsung-cider` again.** Chilsung failed because every "pour" was cola —
opaque, contradicting an article about *clear* soda. Here every pork clip is on a grill, contradicting
an article about *boiled* bossam and *braised* jokbal. One clip (`34921939`, native 1080×1920,
slug says pig trotters) may be real jokbal, but a Reel cannot stand on one uncertain clip.

## Why counts had to be thrown away

Per-gate counts double-count heavily — `seoul-park` (110), `korea-palace-ceremony` (124),
`namsan-hillside` (71) and `korea-convenience-store` (74) largely return the *same* generic Seoul
footage. Deduplicating every gate run against every clip already spent on Reels 294–302 and the
hub batch gives the real inventory:

**202 unused Korea-verified clips at ≥1080 tall**, distributed as:

| group | total | vertical | 4K+ | ≥59fps |
|---|---|---|---|---|
| street / city / transit | 71 | 11 | 21 | 12 |
| unclassified | 54 | 8 | 15 | 3 |
| **hanok / village / palace** | **29** | 6 | 9 | 4 |
| food / cooking | 16 | 5 | 4 | 2 |
| **han river / park / nature** | **11** | 6 | 4 | 3 |
| **ceremony / guard / parade** | **10** | 1 | 8 | 4 |
| market / street food | 6 | 2 | 0 | 0 |
| night / neon | 3 | 1 | 1 | 2 |
| hanbok / costume | 2 | 2 | 0 | 1 |

`food / cooking` was rejected as a third Reel despite having 16 clips: **nine of the sixteen are
Korean BBQ grilling**, which was already the visual spine of Reel A (drinks). Repeating it would
trip the Reels 2.1 hard reject for repeated templates.

## The batch — three registers, zero collisions

Verified programmatically: **no clip appears in two Reels.**

### Reel D — Traditional performance → `/culture`
**Register:** loud. Red, teal, gold; drums, flags, marching, sword work.
**Thesis candidate:** the ceremony at the palace gate is free, runs on a fixed daily schedule, and
most visitors walk straight past it on the way to the ticket office.
**Pool: 12 clips, 274s, 8 at 4K+, 5 at ≥59fps.**

| ID | Res | fps | s | What |
|---|---|---|---|---|
| `29117383` | 3840 | **60** | 16 | guard ceremony at palace — **hook candidate** |
| `29233127` | 3840 | 59.94 | 15 | **drum performance** — a real motion event |
| `29240314` | 3840 | 59.94 | 25 | guard ceremony, close row |
| `29242638` | 3840 | 59.94 | 12 | parade, colourful flags |
| `36459509` | 1080×1920 | 30 | **59** | traditional dance festival — **native vertical, long** |
| `36459510` | 1920 | 30 | **72** | traditional dance performance |
| `29240315` | 3840 | 23.98 | 15 | ceremony, drum being struck |
| `29240313` · `29242640` · `29233129` | 3840 | 23.98 | 11/10/7 | ceremony variants |
| `30012658` | 1080×1920 | 59.94 | 16 | hanbok fashion show — **native vertical** |
| `34921915` | 1080×1920 | 30 | 16 | hanbok display, indoor |

### Reel E — Palaces and hanok → `/culture` or `290`
**Register:** architectural and calm. Dancheong green-and-red, wood, stone, lanterns, water.
**Thesis candidate:** the palace grounds are wrapped in bus lanes and office towers — the contrast
is the story, not the buildings alone.
**Pool: 29 clips, 348s, 9 at 4K+, 6 native vertical.**
Standouts: `34267133` (60fps dancheong pavilion) · `38462443` (59.93fps Gwanghwamun with city
buses in frame) · `29354413` (temple lanterns with wish tags) · `29233126` (59.94fps hanbok crowd)
· `15981227` (Museom village wooden bridge) · `37515906` (**8K** Suwon Hwaseong) · `28103732`
(Dongsipjagak tower beside a crosswalk).

> **Open item:** `32676829` / `32676830` are Suwon Hwaseong **martial-arts reenactment** — warriors
> mid-swing, the best pure action in the whole pool — but both are **25fps**. CLAUDE.md forbids
> padding 25→30. Either keep them as native-cadence beats or leave them out; do not interpolate.

### Reel F — Han River and Seoul's green side → `/travel` or `267`
**Register:** open and airy. Blossom pink, water, sky, mountains.
**Thesis candidate:** the river is not scenery you look at, it is where the city actually goes.
**Pool: 11 clips, 203s, 6 native vertical, 3 at ≥59fps.**
Standouts: `32257242` and `32242945` (4K 59.94fps cherry blossom, **native vertical**) ·
`37763965` (Seoullo bridge over the Han, native vertical 59.89fps) · `12079562` (36s, **trains
crossing the railway bridge** — motion event) · `38259254` (4K aerial riverside at sunset) ·
`36949171` (Namsan tower with blossoms, native vertical).

**This is the most vertical-native Reel we have ever had material for** — six of eleven need no crop
at all, which removes the single biggest quality tax on the format.

## Open items before production

1. **Stills.** The 241-still inventory is food and product hubs; it does not serve culture Reels.
   `374` just added four usable culture stills (Sejong statue night with the Hunminjeongeum
   projection, statue in daylight, the Haerye opening page, the multi-language 축하합니다 projection).
   Confirm the remaining still count per Reel against the 12–19 asset band before writing cut plans.
2. **No post anchors the ceremony Reel.** The 2026-08-04 plan already flagged this: *"a dedicated
   post on palace ceremonies would unlock the rest with footage already in hand."* That is still
   true and is now the cheapest content win available — the footage is verified and sitting here.
3. **Mixed cadence.** D is 24/30/60, E is 24/25/30/60, F is 30/60. Set each composition to 30fps and
   pull the 60fps sources natively. Do not stretch 23.98 or 25.
4. **Assembly is Remotion, not ffmpeg** — ONS, kicker chips, the red `epickor.com` outro chip,
   watermark, TextGate and the 16-frame overlap come only from the kit.
5. **Both QA gates are mandatory on every candidate**: `reels:qa-audio` (blocks on any ≥0.6s hole
   inside narration) and `reels:qa-cuts` (contact sheet with each cut's spoken line — this is what
   caught six screen/word mismatches on 2026-08-05).
6. **Outro CTA IDs must differ across D/E/F.** Candidates: `LOCALS KNOW THE REST` (culture) for D,
   `BEFORE YOU LAND` (travel) for E, `THERE'S MORE` for F.
