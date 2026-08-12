# Image sources — Blog 378 (Seoul International Fireworks Festival 2026)

| File | Source | License | What it shows |
|---|---|---|---|
| `seoul-fireworks-festival-han-river.jpg` | Commons `File:Korean Fireworks Festival.jpg`, EchoL-777 | **CC BY-SA 4.0** | The 2025 festival itself — gold bursts over the Han River with a lit bridge and the far-bank skyline. **Dated 2025-09-27**, the exact date of the 2025 edition, shot at Yeouido |
| `yeouido-hangang-park-before-fireworks.jpg` | Commons `File:20250927 여의도한강공원.jpg`, Striker9498 | **CC BY-SA 4.0** | Yeouido Hangang Park near Mapo Bridge, **timestamped 2025-09-27 18:43:15** — mats down and the riverbank full an hour and a quarter before the 8:00pm show |
| `han-river-path-after-fireworks.jpg` | Commons `File:After firework festival.JPG`, Yt1646 | **CC BY-SA 3.0** | The riverside path jammed with people and cyclists immediately after the 2012 festival ended (2012-10-06 21:15) |

## Why these three

The article's argument is that the view is not the problem — arriving and leaving are. Each
image carries one leg of that argument, and **two of the three are timestamped evidence rather
than illustration**:

- The park photo's EXIF time (18:43) *is* the claim "the ground runs out long before the show."
  A generic crowd photo could not make that point; this one dates itself.
- The exodus photo shows the specific failure mode the transit section describes — a single
  narrow riverside path carrying the outflow.
- The hero is the actual event from the most recent edition, with the bridge and far bank in
  frame. A fireworks photo without the river and bridge would be a generic fireworks photo,
  which fails our own specificity standard.

## Processing

- **The hero arrived sideways.** `File:Korean Fireworks Festival.jpg` is stored 4032×3024 with
  EXIF orientation 6, so it must be run through `sharp().rotate()` *before* any `extract()` —
  the true post-rotation frame is 3024×4032 portrait. On first inspection the un-rotated version
  looked like a landscape shot with a blurred window frame down the right edge; that "frame" was
  the **Han River surface**, rotated 90°. Note that `sharp(p).rotate().metadata()` still reports
  the *stored* dimensions — to get real post-rotation dimensions you must `.toBuffer()` first
  and read metadata off the buffer.
- Hero crop: `extract({left:0, top:1260, width:3024, height:2268})` from the rotated frame — a
  4:3 landscape holding the gold bursts, the red low-level bursts, the bridge light strip, and
  the far-bank skyline. Tighter 3:2 crops lost either the bridge or the top burst.
- **Fireworks compress badly.** Sensor noise across a large black sky resists JPEG: 1500px q82
  landed at 312KB. Settled at **1400px q76 = 234KB**. The other two are ordinary scenes and
  compress normally at 1500px/1400px.
- **234KB / 109KB / 102KB, 445KB for the post** — inside the 400KB per-image gate and well
  inside the 1MB per-post budget.

## Uniqueness

Checked against every `image-sources.md` in `public/assets/images/posts/` before download. None
of these three Commons files appears in any other post. Note the near-miss during sourcing:
a Commons search for `han river fireworks night` returns **Da Nang, Vietnam** results high up
(the Han River there, plus the DIFF festival). Those are country mismatches and were rejected.
