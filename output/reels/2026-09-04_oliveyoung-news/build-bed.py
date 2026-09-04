#!/usr/bin/env python3
"""
NEWSDESK audio bed for the Olive Young reel, synthesised on this reel's frame grid.

Same construction as the Dongmyo pilot, and for the same reasons, so only the
differences are worth writing down here:

  * The bed stops at frame 736 as before, but for a different reason. Dongmyo's
    outro was silent, which was a rule miss; this one carries the spoken tag
    "Don't order blind. It's all at epickor dot com." Ending the bed under it
    puts the domain in clear air rather than competing with a drone.
  * The figure run is 62 frames rather than 116, because the number is 33 rather
    than 46.3 and the sentence carrying it is short. A tick run longer than its
    sentence reads as a machine that has not noticed the anchor moved on.

The measurement rules that produced the sound are in CLAUDE.md and were
established after the representative twice reported "소리가 안 들림" on a bed
that metered fine full-band: content lives at 392-784 Hz, clicks get a
1.6-3.7 kHz body, loudness comes from adding events rather than raising a floor,
and every click gets a 0.8 ms attack ramp so the AAC encoder does not ring on it.
"""
import array
import math
import wave

SR = 48000
FPS = 30
TOTAL_FRAMES = 855
BED_END_FRAME = 736  # the spoken outro tag runs from here in clear air

# Frame grid, taken from ReelOliveYoungNews.tsx. Kept as literals so a change
# there that is not mirrored here shows up as an audible desync rather than
# drifting silently.
CUTS = [0, 90, 171, 233, 408, 486, 530, 598]
BEATS = [0, 171, 233, 365, 408, 486, 530, 598]
FIGURE_FROM, FIGURE_DUR = 171, 62

n_total = int(TOTAL_FRAMES / FPS * SR)
buf = [0.0] * n_total


def f2s(frame):
    return int(frame / FPS * SR)


def add(at, samples, gain=1.0):
    for i, v in enumerate(samples):
        j = at + i
        if 0 <= j < n_total:
            buf[j] += v * gain


def click(freq, dur_s, decay, attack_ms=0.8, rolloff_hz=8000.0):
    """A resonant tick. The attack ramp and one-pole rolloff are what keep AAC
    from ringing: a zero-attack burst has energy to Nyquist and gained 5 dB of
    intersample peak between WAV and AAC when measured on 2026-08-18."""
    n = int(dur_s * SR)
    out = [0.0] * n
    prev = 0.0
    a = math.exp(-2.0 * math.pi * rolloff_hz / SR)
    atk = max(1, int(attack_ms / 1000.0 * SR))
    for i in range(n):
        t = i / SR
        env = math.exp(-decay * t)
        if i < atk:
            env *= i / atk
        raw = math.sin(2 * math.pi * freq * t) * env
        raw += 0.35 * math.sin(2 * math.pi * freq * 2.02 * t) * env
        prev = (1 - a) * raw + a * prev
        out[i] = prev
    return out


def tone(freq, dur_s, vib_hz=4.7, vib_cents=9.0):
    """A sustained voice inside the phone band. The vibrato is what stops it
    reading as a test tone."""
    n = int(dur_s * SR)
    out = [0.0] * n
    phase = 0.0
    for i in range(n):
        t = i / SR
        det = 1.0 + (vib_cents / 1200.0) * math.sin(2 * math.pi * vib_hz * t)
        phase += 2 * math.pi * freq * det / SR
        env = min(1.0, t / 0.35) * min(1.0, (dur_s - t) / 0.5 if dur_s - t > 0 else 0.0)
        out[i] = (math.sin(phase) + 0.22 * math.sin(2 * phase)) * env
    return out


bed_s = BED_END_FRAME / FPS
add(0, tone(196.0 * 2, bed_s, vib_hz=3.1, vib_cents=6.0), 0.045)   # 392 Hz
add(0, tone(293.66 * 2, bed_s, vib_hz=4.3, vib_cents=8.0), 0.030)  # 587 Hz

for i, fr in enumerate(BEATS):
    f = 2100.0 if i % 2 == 0 else 2640.0
    add(f2s(fr), click(f, 0.16, 34.0), 0.30)

for fr in CUTS:
    add(f2s(fr), click(1180.0, 0.30, 15.0), 0.34)
    add(f2s(fr), click(148.0, 0.24, 22.0, rolloff_hz=2600.0), 0.16)

start = f2s(FIGURE_FROM)
dur = FIGURE_DUR / FPS
k = 0
t = 0.0
while t < dur * 0.72:
    add(start + int(t * SR), click(3200.0, 0.05, 90.0), 0.10)
    k += 1
    t += 0.16 * math.exp(-k * 0.055) + 0.035
add(start + int(dur * 0.74 * SR), click(880.0, 0.42, 9.0), 0.40)

peak = max(abs(v) for v in buf) or 1.0
target = 0.40  # narration is the programme; this sits under it
scale = target / peak
pcm = array.array('h', (int(max(-1.0, min(1.0, v * scale)) * 32767) for v in buf))

out = 'output/reels/2026-09-04_oliveyoung-news/audio/bed.wav'
with wave.open(out, 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())

print(f'{out}  {n_total/SR:.2f}s  peak {20*math.log10(peak*scale):.1f} dBFS  '
      f'{len(BEATS)} beat ticks, {len(CUTS)} cut accents, {k} figure ticks')
