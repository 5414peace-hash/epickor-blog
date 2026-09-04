# Upload package — NEWSDESK 002, 올리브영 (2026-09-04)

**NOT scheduled. Awaiting the representative's phone review (sound on and off).**

| | |
|---|---|
| File | `epickor-reel-oliveyoung-news-v004.mp4` |
| Length | 28.5s (855 frames @ 30fps) |
| Format | 1080×1920, h264, 4.56 Mbps |
| Audio | AAC 192k mono, **−15.2 LUFS, peak −1.8 dBFS** |
| Caption | `instagram-caption.txt` |
| Source post | `/blog/192` — refreshed and live-verified 2026-09-04 |
| Kit | `remotion/NewsdeskKit.tsx` · spec `remotion/ReelOliveYoungNews.tsx` |
| Voice | Daniel — Steady Broadcaster (`onwK4e9ZLuTAKqWW03F9`), lane `anchor_deadpan` |
| Outro | Bank **B — DON'T ORDER BLIND**, **spoken**: "Don't order blind. It's all at epickor dot com." |

## Why this reel exists

To separate format effect from subject effect. One reel cannot tell you whether the news grammar
worked or whether Dongmyo was simply a good story. Same kit, same voice, same register, different
subject — the same reasoning that produced three DOSSIER reels rather than one.

## Audio — the bed was replaced after the representative rejected it (2026-09-04)

> *"bgm 이 너무 듣기 안좋은데,, 차라리 아예 빼거나 city noise 아주 낮춰서 넣는게 어떨까 싶어.
> 현재는 목소리보다 bgm 이 더 크게 들려서 별로임."*

**The measurement agreed, and full-band metering was what hid it.** Full band the tick bed sat
8 dB under the narration (-32.7 vs -24.3 mean), which is why it read as safe. But its content was
clicks at 1180 / 2100 / 2640 / 3200 Hz, and in the speech band the bed **peaked louder than the
voice**: 400 Hz-4 kHz max **-9.4 dB** against the narration's **-9.6 dB**. Transients sitting in
the consonant band mask speech even when their average is low.

This is the 2026-08-18 lesson - judge audio in the band that matters - applied to the opposite
failure. That entry was a bed nobody could HEAR because its weight sat at 49-245 Hz. This is a bed
that INTRUDED because its weight sat at 1-4 kHz. One metering habit catches both.

Replaced with `.claude/skills/reels/scripts/build-city-ambience.py`: broadband, **no transients at
all**, energy shaped flat from 80-700 Hz and rolled off about 18 dB/octave above it, so the
consonant band is left empty. Slow drift and a few long swells keep it from reading as hiss.
Measured separation against the narration after mixing:

| Band | Separation |
|---|---|
| 1-4 kHz (consonants) | **22.5 dB** |
| 400-800 Hz (body) | **17.1 dB** |

It is a floor, not a bed. Removing it entirely is a one-command change if that reads better.

## QA record

| Gate | Result |
|---|---|
| Frames | 855, matches the composition ✅ |
| Bitrate | 4.56 Mbps. **Below the 8 Mbps floor, and that floor is for footage kits** — seven of eight cuts are stills, so the encoder has less to carry. Letterforms checked at full resolution ✅ |
| Loudness / true peak | −15.2 LUFS, **−1.7 dBFS after AAC** (0.1 dB overshoot from the WAV's −1.8, same as the pilot) ✅ |
| Playback band 400 Hz–9 kHz | max **−1.2 dB** whole, **−4.1 dB** first 3s ✅ |
| Narration silence >0.6s inside programme | none ✅ |
| Cut boundaries −2/−1/0/+1/+2 | 8 boundaries, no flash, no black frame, no repeated endpoint. The video cut drifts frame to frame, which is how you can tell it is not frozen ✅ |
| Screen-speech agreement | beat-by-beat sheet, `qa-cutsheet.jpg`. **One mismatch found and fixed — see below** |
| Safe areas | all graphics inside the token bounds ✅ |
| Motion cards | zero, by kit design ✅ |
| Spoken outro tag | present, audible in the playback band ✅ |

## What QA caught, and what it says about the gates

**The narration said "Fourteen lanes" over a frame containing 11, 12 and 13.** The number the
sentence names was not in the picture. Nothing structural would have caught it — the frame was a
real photograph of the real place with an honest provenance grade, and every automated check
passed. Only putting the sentence under the frame and looking did.

The same pass showed one still holding 178 frames across three beats. Re-cut to four windows of
the same photograph, each proving its own line, which also lifted the cadence from 15 state
changes to 17 across the same 24.5s.

**A second failure was silent and worse.** The first boundary check reported identical luminance
— 87.1 — for all forty frames and passed. Every extraction was writing to one temp path, so
sharp's file cache returned the first image forty times. **A gate that inspects the same frame
forty times reports success.** Fixed with a unique path per frame; the real numbers are in the
table above.

## What was cut from the script, and why

The post's most quotable figure — the 센트럴 명동 타운 branch at roughly 95% foreign sales — is
**not in the reel.** The only usable photograph is titled "Olive Young Myeongdong", names no
branch, and there are nine branches in Myeongdong. A sentence about that branch over this frame
is a claim the picture cannot support.

## Video share

175 of 736 programme frames, **24%**, against a 50% aim. Structural, not lazy: two gate passes
over 1,020 candidates found no Korean cosmetics-store interior at all, and every sentence except
one names Olive Young. Filling to 50% would mean frames that do not match their sentences, which
is exactly why the 2026-08-04 batch was rejected.

## Scheduling

The Instagram calendar is full through **09-28**. First free day is **09-29**, and this reel is
not booked. It does not need a batch of three to itself — 09-25 to 09-28 already carries four —
but it should not go up before the representative has watched it on a phone.
