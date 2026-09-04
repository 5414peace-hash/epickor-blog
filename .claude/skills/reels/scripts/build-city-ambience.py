#!/usr/bin/env python3
# ============================================================================
# REJECTED 2026-09-04, the same day it was written. DO NOT USE.
#
# 대표님: "백색노이즈 완전 별로다. 넣지말자 차라리."
#
# It measured exactly as designed - 22.5 dB under the voice at 1-4 kHz, energy
# confined below 800 Hz - and it was still wrong, because the problem was never
# the level. A continuous synthetic sound under a 28-second reel has nowhere to
# hide; the viewer hears it for the whole reel, so its character becomes the
# reel's character. Shaped noise is still noise.
#
# This was the SECOND bed rejected in one day and the THIRD overall: the DOSSIER
# drone went on 2026-08-18 ("ufo 처럼 나는 background 소리는 진짜 별로다"), the
# NEWSDESK tick bed that morning, this by the afternoon. The conclusion had been
# written down in the DOSSIER builder in August and was not applied here.
#
# Use .claude/skills/reels/scripts/build-office-foley.py instead: discrete events
# in the gaps between sentences, no continuous layer at all.
# ============================================================================
"""
Low city ambience for the NEWSDESK kit. Replaces the synthesised tick bed.

WHY THE TICK BED WAS WRONG (2026-09-04, representative: "bgm 이 너무 듣기 안좋은데,
목소리보다 bgm 이 더 크게 들려서 별로임")
  It was not a level mistake, it was a placement mistake, and full-band metering hid
  it. Full band the bed sat 8 dB under the narration (-32.7 vs -24.3 mean). But its
  content was clicks at 1180 / 2100 / 2640 / 3200 Hz, and measured in the speech band
  the bed PEAKED LOUDER THAN THE VOICE: 400 Hz-4 kHz max -9.4 dB against the
  narration's -9.6 dB. Transients in the consonant band read as loud and mask speech
  even when their average is low.

  This is the same lesson as 2026-08-18 - judge audio in the band that matters, not
  full band - applied to the opposite question. That entry was about a bed being
  INAUDIBLE because its weight sat at 49-245 Hz. The mirror failure is a bed being
  INTRUSIVE because its weight sits at 1-4 kHz. One metering habit catches both.

THE DESIGN
  Speech intelligibility lives mostly in 1-4 kHz, so that band is left empty. The
  ambience is broadband noise shaped to sit flat from about 80 to 700 Hz and roll off
  steeply above it - which is roughly what distant traffic actually sounds like, and
  is also a band phone speakers still reproduce, so it is not a headphone-only bed.
  There are no transients at all. Slow drift plus a few long swells keep it from
  reading as hiss.

  Verified by measurement, not by ear: the caller should check the ambience is at
  least ~18 dB under the narration in 1-4 kHz before shipping.

Usage:
  python .claude/skills/reels/scripts/build-city-ambience.py OUT.wav SECONDS [PEAK]
"""
import array
import math
import random
import sys
import wave

SR = 48000
out_path = sys.argv[1]
seconds = float(sys.argv[2])
peak_target = float(sys.argv[3]) if len(sys.argv) > 3 else 0.16

n = int(seconds * SR)
rng = random.Random(20260904)

# --- broadband source ------------------------------------------------------
buf = [rng.uniform(-1.0, 1.0) for _ in range(n)]


def one_pole_lp(sig, hz):
    a = math.exp(-2.0 * math.pi * hz / SR)
    prev = 0.0
    for i in range(len(sig)):
        prev = (1 - a) * sig[i] + a * prev
        sig[i] = prev
    return sig


def one_pole_hp(sig, hz):
    a = math.exp(-2.0 * math.pi * hz / SR)
    prev_in = 0.0
    prev_out = 0.0
    for i in range(len(sig)):
        x = sig[i]
        prev_out = a * (prev_out + x - prev_in)
        prev_in = x
        sig[i] = prev_out
    return sig


# Three cascaded low-passes at 700 Hz give about -18 dB/octave above it, so by
# 2 kHz - the middle of the consonant band - the ambience is ~28 dB down.
for _ in range(3):
    buf = one_pole_lp(buf, 700.0)
# Trim the sub-bass a phone cannot reproduce and a listener only feels as rumble.
buf = one_pole_hp(buf, 70.0)

# --- slow movement ---------------------------------------------------------
# Two very slow LFOs plus a few long swells. Nothing here is fast enough to read
# as an event; the point is only that the floor is not perfectly static.
swells = [(rng.uniform(0, seconds), rng.uniform(3.0, 6.0), rng.uniform(0.15, 0.35))
          for _ in range(max(2, int(seconds / 7)))]
for i in range(n):
    t = i / SR
    env = 1.0
    env *= 1.0 + 0.18 * math.sin(2 * math.pi * 0.07 * t)
    env *= 1.0 + 0.11 * math.sin(2 * math.pi * 0.13 * t + 1.3)
    for (at, width, depth) in swells:
        d = (t - at) / width
        if -1.5 < d < 1.5:
            env *= 1.0 + depth * math.exp(-d * d * 2.0)
    # 0.4 s fade at each end so the bed does not click in or out
    if t < 0.4:
        env *= t / 0.4
    if seconds - t < 0.4:
        env *= max(0.0, (seconds - t) / 0.4)
    buf[i] *= env

# --- normalise -------------------------------------------------------------
peak = max(abs(v) for v in buf) or 1.0
scale = peak_target / peak
pcm = array.array('h', (int(max(-1.0, min(1.0, v * scale)) * 32767) for v in buf))
with wave.open(out_path, 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())

print(f'{out_path}  {seconds:.2f}s  peak {20 * math.log10(peak_target):.1f} dBFS  '
      f'{len(swells)} swells, no transients')
