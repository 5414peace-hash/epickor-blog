# Batch review — 2026-08-11 (cheonggyecheon / sungnyemun / suneung)

Three Reels for the 8/16 gap. **Second pass**, rebuilt against representative review of
the first candidates. QA gate results are at the bottom.

## What the review said, and what was done about it

| # | Note | Change |
|---|---|---|
| 1 | Suneung intro has no thumbnail-grade ONS | New centred hero card, legible at **frame 0** |
| 2 | Suneung outro narration is cut off | It was never there — the reel ended on **7.3s of silence**. All three now end on a spoken CTA |
| 3 | Plenty of generic city footage, almost nothing of the crush at the exam-hall gate | 4 more Korea.net exam-day photographs added; gate material now **51% of screen time**, up from ~14% |
| 4 | Sungnyemun design looks old | Rebuilt as a **현판** — see below |
| 5 | Cheonggyecheon footage repeats left-right | Confirmed and fixed: **3 distinct sources → 7** |
| 6 | All three top ONS designs are weak | All three rebuilt on different anchors, faces and gestures |

### 5 was exactly right, and the diagnosis is worth keeping

The old plan ran **8 cuts on 3 source clips**, and put `31714020` at cuts 1, 4 and 8 with
pan direction alternating right → left → right. Same picture, sliding one way then the
other, three times. The rule now: **one pan direction per source, for the whole reel**,
and a source may only recur as a deliberate bookend, far apart.

Two clips also contradicted their own sentence — the words said *six lanes of elevated
motorway* while the picture showed the stream. Those beats now show Seoul traffic, which
is both more varied and more accurate.

### 6: the ONS designs were different decoration on identical bones

All three were a left-aligned stack at top ~240: small label → huge condensed uppercase →
mono note. Same anchor, same rhythm, and the condensed face resolved to **Arial Narrow** on
Windows, which is what read as dated. Three things now differ by construction:

| | anchor | face | gesture |
|---|---|---|---|
| **D** | full-width section band | Bahnschrift (DIN) | a lid lifting off |
| **E** | vertical plaque, left edge | Constantia + HANBatang | a board hung, a seal stamped |
| **F** | centred card | Segoe UI Black + Consolas | split-flap |

### 4: Sungnyemun is now built on the gate's own plaque

Of Seoul's great gates, **only Sungnyemun's signboard is written vertically**. The
traditional explanation is geomancy: 禮 is 火 in 오행, so the name was hung as a rising
flame to press down the fire energy of Gwanaksan — fire fought with fire. Then the gate
burned, and the plaque itself fell and broke apart in the 2008 fire; it was restored in
July 2009. Source: ko.wikipedia 숭례문 — *"관악산의 화기에 대응하기 위하여 세로로 달았다고 전해진다"*.

So the ONS **is** a vertical hanging plaque — lacquer ground, 단청 border in 뇌록/장단/황,
崇禮門 brushed in top to bottom in HANBatang — and the "National Treasure No.1" correction
lands as a red **낙관** seal rather than a bordered box. Captions stay 한지 cream, so plaque
and paper come from the same material world. The fact is folk tradition, not documented
intent, so it is carried by the graphic and stated as tradition in the caption; it is not
asserted in narration.

## Sourcing

**Suneung.** The Korea.net / KOCIS exam-day series (Kyungbock High, 12 Nov 2014, CC BY-SA 2.0)
has **eleven** files; the first pass used three. All eight unused ones were opened and viewed —
the series description is identical across every file, so filenames prove nothing — and four
were added: the packed street with a broadcast crane, the cheer squad with the test-site
banner legible, students with a `SKY` sign, and a school flag under the education-office banner.

Those photographs are 3232–5312px wide, which changed the treatment: a true 9:16 window out
of them is a **downscale (0.46×–1.03×)**, so the stills are now full-bleed with a slow pan,
with no blur plate and no upscaling anywhere. That also retires the luma problem from the
first pass — the dark frames were the blur bands, not the pictures.

**Cheonggyecheon.** Three new sources, each checked by opening frames:

- `31801546` **accepted** — Cheonggyecheon at dusk. Identified by the stepping-stone bridge,
  both bank walkways, the mural retaining wall and street lights above. The only verified
  non-daylight Cheonggyecheon in the pool, and the one frame that shows water below and road
  above together, which is what *"three degrees cooler down here than the street up there"* means.
- `37656898` **rejected** — "peaceful urban waterfall". Fourteen frames, locked-off camera,
  no Korean signage, no identifying structure, and Cheonggyecheon's waterfall is a vertical
  water wall rather than a rock cascade. Unverifiable country beats good resolution.
- `37870428` / `37971704` **rejected** — both the same Bank of Korea junction as cut 2.
  `28314121` (Gangnam-daero) used instead, so no two cuts share a location.

**Sungnyemun — a constraint, stated plainly.** The review only faulted this reel's design,
but once repetition was named as a problem it had to be checked here too, and this reel is
worse on paper: 11 cuts on 6 sources, with `29078559` carrying four of them. A fresh gate run
(382 candidates) found **no usable additional footage of this gate**. The one promising hit,
`37984339` "bustling seoul intersection with ancient gate", was opened and **rejected — it is
not Sungnyemun**, it is a driving shot past a gate near Gyeongbokgung. Putting the wrong gate
in a reel about this gate would be a worse failure than repetition. Everything else Korea-named
and unused was palaces, guard ceremonies or Suwon.

This is structural, not a shortcut: the reel is about one building, so every cut has to contain
it, and Pexels holds six clips that do. What was done instead — each repeated cut now aims its
crop window at a **different band of the source** (`focusX`/`panSpan`), so four cuts off one
28-second clip frame four different parts of the street rather than the same one four times.

`31801546` is 23.976fps against a 30fps timeline. Accepted for a slow dusk scene, with the
media builder changed to resample **before** the crop so at least the pan itself is smooth at
30 — previously the rate conversion ran after the crop and a 24fps source panned in 24-step
judder. Fast-motion beats still take 30fps sources only.

## Tools added or fixed this pass

- `scripts/reels-assemble.mjs` — builds `remotion-props` and `render-manifest` from the cut
  plan and the narration starts. Both were hand-edited before, which is how the first pass
  shipped a manifest whose cuts had no `kind` and crashed `qa-cut-sheet`.
- `build-cut-media.mjs` — `mode:"fill"` for stills, and `fps` moved before `crop`.
- `footage-gate.mjs` — now reads clip ids out of cut plans. It only matched Pexels **URLs**
  before, and cut plans store a bare numeric `src`, so every clip this batch spent would have
  been offered again as fresh in the next gate run. That is the same repetition problem, one
  batch downstream.

## Third pass — caption form, and a defect it exposed

Captions are *read*, so they take the written form even where narration has to spell things
out for the TTS. Sixteen beats changed: `epickor dot com` → **`epickor.com`** (3), spoken
years → digits (**2003 · 2013 · 2008 · 2006 · 2021**), and figures carrying a unit
(**5.8 kilometres · 386 billion won · 35,000 people · 35/25 minutes · 200 metres ·
3 kilometres · 3 degrees**). Small counts stay as words — "two years", "five hours",
"nine hours", "sixty-nine year old" — which is the ordinary typographic line.

Re-reading the beats to make that change surfaced **three cards that ended mid-phrase**,
which CLAUDE.md forbids outright, and which every gate had passed:

| reel | was | now |
|---|---|---|
| E | `"…you're looking"` / `"at was cut in 2013."` | one card |
| E | `"and we wrote all"` / `"of it down…"` | one card |
| F | `"and what to avoid if you"` / `"are in Korea that day."` | one card |

Two of the three were introduced by the outro lines written earlier the same day. Merged
cards run 43–50 characters, well inside the card.

The rule is now enforced in `reels-assemble.mjs`, but **as a printed candidate list, not an
automatic merge** — a mechanical rule cannot decide this. The same scan flags
`"Twenty years ago this exact spot"` / `"was six lanes of elevated motorway,"`, which is a
deliberate subject-then-reveal beat and must stay split. What separates the two cases is
whether the first card ends on a complete noun phrase, which a regex cannot see. So the
merge list is explicit and evidence-driven, and every future batch prints its candidates.

## Delivery

Working candidate and delivered copy, both under the same dated key:

| | delivered | frames | duration | bitrate |
|---|---|---|---|---|
| **D** | `output/final/reels/2026-08-11_cheonggyecheon/EPICKOR_cheonggyecheon_06.mp4` | 1490 | 49.69s | 16.1 Mbps |
| **E** | `output/final/reels/2026-08-11_sungnyemun/EPICKOR_sungnyemun_05.mp4` | 1550 | 51.69s | 16.1 Mbps |
| **F** | `output/final/reels/2026-08-11_suneung/EPICKOR_suneung_05.mp4` | 1420 | 47.36s | 16.6 Mbps |

All 1080×1920 at 30fps. The Reels 2.2 floor is ≥8 Mbps, ≥10 with heavy motion.

**Superseded, do not upload:** D v001–v005, E v001–v004, F v001–v004.

## Gate results

Re-run against the final files, not the previous pass:

| gate | D v006 | E v005 | F v005 |
|---|---|---|---|
| `reels:qa-audio` (no ≥0.6s hole inside narration) | **PASS** | **PASS** | **PASS** |
| `reels:qa-cuts` (screen/word pairing, per-cut luma) | PASS, one noted | **PASS** | **PASS** |
| Distinct sources / cuts | 7 / 8 | 6 / 11 | 9 / 10 |
| Lowest per-cut luma | 54 (noted) | 91 | 63 |
| Caption beats overlapping | 0 | 0 | 0 |
| Caption beats | 33 | 33 | 29 |

Changed captions were also pulled as full-resolution crops of the caption band rather than
read off the contact sheet — the sheet scales down far enough to have produced one false
collision alarm already this batch.

**D cut 7 measures luma 54**, under the documented floor of 60, and is accepted. The floor
exists because of a 2026-08-04 failure where a near-black frame ran under narration it
contradicted. Here the shot *is* dusk — that is the whole reason it was chosen — and the line
over it is *"cooler down here than the street up there"* while the picture shows exactly that:
the stream below, the street lights above. Brightening it would make an evening look like
daytime and destroy the point of the cut.

Suneung's lowest is now **63**, up from 43 on the first pass, with no override needed. The
dark frames there were the blur plates, not the photographs; dropping the plates fixed it.

**Suneung video share is 43%**, down from 58.8%. That is the direct cost of the change asked
for — real exam-morning material only exists as press stills, and CLAUDE.md already ranks
screen/word agreement above the video ratio. Reported, not hidden.

Outro CTA IDs stay deliberately different so a viewer who sees all three in one week is not
sold the same way three times: **THERE'S MORE** (open loop) · **LOCALS KNOW THE REST**
(insider) · **WE WROTE IT ALL DOWN** (reassurance). Each is now spoken as well as shown.

## Remaining gate

Representative phone playback with sound on and off. Any flash, judder, unplanned wrap,
orphan word or caption collision blocks final status, and representative rejection overrides
every score here.

## After approval

Schedule 8/16, 8/17, 8/18 at 05:00 KST on Facebook and Instagram, in one 3-Reel batch.
Procedure and its eight traps are in `docs/handoff/FACTS.md` under `## instagram / social` —
the dangerous one is that a new Reel defaults to `지금 공유하기`, so the script refuses to click
unless the footer reads `예약`.
