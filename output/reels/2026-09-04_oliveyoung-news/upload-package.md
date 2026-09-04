# Upload package — NEWSDESK 002, 올리브영 (2026-09-04)

**NOT scheduled. Awaiting the representative's phone review (sound on and off).**

| | |
|---|---|
| File | `epickor-reel-oliveyoung-news-v006.mp4` |
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

## Audio — every sound is a visual event (2026-09-04, fourth attempt)

Three beds were rejected before this, and then a first foley pass was rejected too:

| Attempt | Verdict |
|---|---|
| DOSSIER drone (2026-08-18) | *"ufo 처럼 나는 background 소리는 진짜 별로다"* |
| Tick bed | *"목소리보다 bgm 이 더 크게 들려서 별로임"* |
| Low city-noise floor | *"백색노이즈 완전 별로다. 넣지말자 차라리."* |
| Foley dropped into gaps | *"규칙도 없이 효과음 넣은거야? ... dossier 편처럼 text 움직임에 맞춰서라던지 숫자올라가는거라든지"* |

The last one is the instructive rejection. That pass searched the narration for silences and
dropped a sound into each, choosing by `gap_index % 3`. **Nothing about any sound had anything to
do with what was on screen.** It was filler with a plausible-looking rule, which reads as designed
and is therefore worse than filler with no rule at all.

**`build-newsdesk-foley.py` is driven by the picture.** One visual event, one sound, always the
same sound:

| Event in `NewsdeskKit.tsx` | Sound | Why |
|---|---|---|
| lower third wipes in (8 frames) | keystroke | the chyron is typed on |
| cut changes | page turn | a new document |
| figure counts up (38 frames) | counter ratchet | the digits are rolling |
| outro card rises (12 frames) | desk bell | sign-off |

Frames come from the reel's spec as JSON, the way the DOSSIER builder transcribes its kit's
constants. If the spec moves and the JSON does not, the reel goes audibly out of sync — which is
the failure you want, rather than a silent drift.

**Masking is solved by register and lead, not by volume.** Visual events land where sentences
start, so bright sounds (keystroke, page turn) are placed 3–5 frames early, inside the silence
that precedes the beat — a sound slightly ahead of a wipe still reads as causing it. Sounds that
must run under speech are low instead: the counter sits at 200–380 Hz, entirely below the
consonant band, and a cut with no beat on it gets a document thud rather than a page turn.

**The script refuses to write a file where a bright event lands on voiced audio.** The one
permitted exception is the sign-off bell, which has to ring on the outro card, and the outro card
rises on the same frame the CTA line begins; it is allowed only because what overlaps is a tail
already 12 dB below its own peak.

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
