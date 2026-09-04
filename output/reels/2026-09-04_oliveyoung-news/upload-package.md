# Upload package — NEWSDESK 002, 올리브영 (2026-09-04)

**NOT scheduled. Awaiting the representative's phone review (sound on and off).**

| | |
|---|---|
| File | `epickor-reel-oliveyoung-news-v005.mp4` |
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

## Audio — effects only, no bed. Three beds were rejected before this (2026-09-04)

| Attempt | Verdict |
|---|---|
| Synthesised tick bed | *"bgm 이 너무 듣기 안좋은데... 목소리보다 bgm 이 더 크게 들려서 별로임"* |
| Low city-noise floor | *"백색노이즈 완전 별로다. 넣지말자 차라리."* |
| (and on DOSSIER, 2026-08-18) | *"ufo 처럼 나는 background 소리는 진짜 별로다"* |

**One cause, three times.** A continuous synthetic sound under a 28-second reel has nowhere to
hide: the viewer hears it the whole way through, so whatever character it has becomes the
character of the reel. Level does not fix that — the city floor measured 22.5 dB under the voice
in the consonant band and was still wrong. **The conclusion was already written down in the
DOSSIER builder in August and was not applied here.**

The representative's own prescription: *"dossier 편에 들어가는 효과음들로 채우는게 좋을거같아.
사무용폼 (키보드, 스테이플러 등 아기자기한 소리들)."*

**Now: `build-office-foley.py`.** Keyboard bursts, a stapler, paper turns, a pen click, and one
desk bell as a sign-off — **placed inside the silences in the narration**, which are found by
running silencedetect on the narration itself rather than kept in a second table that could drift
out of sync with the voice.

That also removes the masking problem structurally rather than by turning things down. A stapler
is brighter than the rejected ticks and does not intrude, because it happens where there is no
speech to intrude on. Measured across the whole reel: of 347 windows where the voice is active,
**only 4 carry any foley above −40 dB**, and the loudest of those sits **12.7 dB under the voice**
— the tail of the sign-off bell decaying into the CTA.

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
