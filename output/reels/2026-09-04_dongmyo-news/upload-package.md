# Upload package — NEWSDESK 001, 동묘 (2026-09-04)

**Representative approved the render 2026-09-04** ("괜찮은거같아 이걸로가자"), after the phone review.

| | |
|---|---|
| File | `epickor-reel-dongmyo-news-v003.mp4` |
| Length | 26.8s (804 frames @ 30fps) |
| Format | 1080×1920, h264, **10.0 Mbps** |
| Audio | AAC 192k mono, **−15.5 LUFS, TP −2.3 dBTP** |
| Caption | `instagram-caption.txt` |
| Source post | `/blog/242` — refreshed 2026-09-03, live-verified |
| Kit | `remotion/NewsdeskKit.tsx` · spec `remotion/ReelDongmyoNews.tsx` |
| Voice | Daniel — Steady Broadcaster (`onwK4e9ZLuTAKqWW03F9`), lane `anchor_deadpan` |
| Outro | Bank **C — LOCALS KNOW THE REST** |

## NOT scheduled yet, and that is the rule rather than an oversight

CLAUDE.md: *"Instagram scheduling pattern: prepare and schedule content in batches of 3 Reels plus
3 card-news carousels. Do not recommend uploading/scheduling a single approved Reel by itself
unless the representative explicitly asks."*

This is one approved Reel. It waits for two more.

**Calendar state (planner-verified 2026-09-04):** card news fills 09-04 through 09-24 with no gap.
Instagram runs one post a day shared between Reels and card news, so **the first free slot for this
is 09-25.**

**The two candidates to complete the batch:**
1. The three DOSSIER reels finished 2026-08-18 (우지 파동 · 바나나킥 · 야쿠르트) are still waiting
   on the representative's phone review. If any two pass, the batch is complete immediately.
2. Otherwise, two more NEWSDESK reels. See the note on topic fit below.

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
