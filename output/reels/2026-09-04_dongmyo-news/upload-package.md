# Upload package — NEWSDESK 001, 동묘 (2026-09-04)

**Representative approved the render 2026-09-04** ("괜찮은거같아 이걸로가자"), after the phone review.

| | |
|---|---|
| File | **`epickor-reel-dongmyo-news-v004.mp4`** (v003 replaced — see Repairs) |
| Length | 28.7s (860 frames @ 30fps) |
| Format | 1080×1920, h264, **8.2 Mbps** |
| Audio | AAC 192k mono, **−15.1 LUFS, peak −1.8 dBFS** |
| Caption | `instagram-caption.txt` |
| Source post | `/blog/242` — refreshed 2026-09-03, live-verified |
| Kit | `remotion/NewsdeskKit.tsx` · spec `remotion/ReelDongmyoNews.tsx` |
| Voice | Daniel — Steady Broadcaster (`onwK4e9ZLuTAKqWW03F9`), lane `anchor_deadpan` |
| Outro | Bank **C — LOCALS KNOW THE REST**, **now spoken**: "The locals know the rest. So does epickor dot com." |

## SCHEDULED — 2026-09-25 05:00 KST, Facebook + Instagram

Committed 2026-09-04 through `.claude/skills/reels/scripts/schedule-meta-reel.py`. The script
refuses to click unless the footer reads 예약 rather than 공유하기, and unless both date rows and
all six time spinbuttons read back what was asked for. They did:

```
  date[0] = '2026년 9월 25일'      time[0] = ['오전', '5', '0']
  date[1] = '2026년 9월 25일'      time[1] = ['오전', '5', '0']
  footer reads 예약, date and time verified -- committing
```

**The caption was verified against the source file, not just typed.** The scheduler now carries
the same read-back gate the card-news one got on 2026-09-03, after Meta's hashtag helper rotated
two of five carousel captions to start with the trailing hashtag block. This caption contains
both a hashtag block and `epickor.com`, so both triggers were present. It matched on attempt 1.

**The batch this completes.** The representative confirmed the three DOSSIER reels on 2026-09-04
("3편다 컨펌이야"), which makes four approved Reels. Card news filled 09-05 through 09-24 with no
gap — planner-read, not taken from the index — so the four run 09-25 to 09-28, one a day at 05:00,
per the 2026-07-27 rule that scheduling continues from the day after the last booked date.

| Date | Reel | Kit |
|---|---|---|
| 09-25 | 동묘 — this one | NEWSDESK |
| 09-26 | 야쿠르트 | DOSSIER |
| 09-27 | 우지 파동 | DOSSIER |
| 09-28 | 바나나킥 | DOSSIER |

## Repairs after the first ship (2026-09-04) — v003 → v004

Both were found while building NEWSDESK 002, by reading the rules the second reel had to follow.
Neither would have been caught by re-watching v003, because neither looks wrong; they are wrong
against things written down elsewhere.

**1. The outro was silent.** The CTA bank has required a spoken tag naming the domain since Reel
377, on the representative's 2026-08-13 instruction — *"마지막에 epickor.com 을 한번 나레이션으로
읽어주면 좋은데"*. A viewer watching with sound cannot read a chip. The bank's own text says
silent outros are "no longer a default and no longer an option", and this shipped silent anyway.

Added as narration **part 4** rather than by regenerating part 3. Part 3 is what beat 8 was
measured from; regenerating it would have moved boundaries that are already correct. The tag lands
at f732 against an outro opening at f729, so the picture leads the voice by three frames.
Reel length 804 → 860 frames.

**2. `credit: 'SEOUL METRO'` on a Pexels clip.** The kit renders that field as `SOURCE: {credit}`.
Seoul Metro published the ridership figure; it did not supply the footage — a generic Korean market
clip from Pexels. **On a format whose entire premise is labelling provenance honestly, that was the
one label that lied.** Removed, and the field's meaning is now documented in `NewsdeskKit.tsx` so
it cannot recur by accident.

**This changes a render the representative already approved**, so v004 needs a fresh look before
it replaces the scheduled 09-25 post. If it is approved, the scheduled post has to be deleted and
re-created — Meta cannot swap the media on a scheduled Reel.

## QA record

| Gate | Result |
|---|---|
| Bitrate ≥8 Mbps (≥10 high motion) | **10.0 Mbps** ✅ |
| Narration silence >0.6s inside programme | none — only the outro, silent by rule ✅ |
| Cut boundaries −2/−1/0/+1/+2 | 6 boundaries, no flash, no black frame, no repeated endpoint ✅ |
| True peak after AAC | **−2.3 dBTP**, overshoot 0.1 dB from the WAV ✅ |
| Playback band 400Hz–9kHz | max **−3.7 dB** ✅ |
| Safe areas | all graphics inside y150–y1600 and x60–x900 ✅ |
| Caption overlap | every beat ends where the next begins; two are never live ✅ |
| Motion cards | zero, by kit design ✅ |
| Screen-speech agreement | every cut carries a provenance grade; the one mismatch found in build was corrected — see below |

## What the next NEWSDESK reel should learn from this one

- **Read the tokens before laying out.** The first design put the ticker at y1850, which
  `SAFE.bottom = 320` makes invisible, in a format whose argument is that the ticker carries the
  information speed. `SAFE.actionRail` also takes x930+ below y1100.
- **Enlarge the photograph before writing the line over it.** The kicker said "shirts start at
  ₩1,000" — true of the market, not true of that frame, whose cards read 13,000 / 10,000 / 8,000
  on trousers. Re-recorded to describe what is visible.
- **Country match beats action.** Two clips that acted the beat better were European flea markets;
  a third was Korean but let Sungnyemun fill the frame while the line was about a different place.
- **Budget the script from measured speech, not word count.** Daniel runs 2.01 words/sec, so a
  26-second reel is about 40 usable words. The first script overran by two seconds.

## Topic fit for this kit

NEWSDESK wants a post with **a dated institutional fact and a reversal**. `242` had both: a Seoul
Metro release and an obituary the numbers contradict. Candidates with the same shape on the site:

- `192` Olive Young — foreign share of offline sales 2% (2022) → 33%, ₩1 trillion passed in
  August 2026, and a store that prints PLEASE PREPARE YOUR PHYSICAL PASSPORT on fourteen tills.
- `232` K-fashion — Musinsa Megastore Seongsu, opened 24 April 2026, foreign customers 40%+ of
  its first fifty days, and a Korean headline overstating it as two-thirds that we can correct
  on screen. Two Gentle Monster buildings people confuse is a second story in the same post.

Both are strong. Neither needs new research — the figures are already sourced in the posts.
