#!/usr/bin/env python3
"""
NEWSDESK audio bed — synthesised against this reel's own frame grid.

WHY SYNTHESISE
  The three tracks in output/bgm/youtube-audio-library/ cannot go on Instagram: their own
  LICENSES.md warns they were pulled "for YouTube use" and need re-checking before any other
  platform. More importantly, a purchased track cannot land on this grid. Every accent below is
  placed on a frame number taken from the composition, so the bed hits when the lower third
  wipes and when the figure starts counting. A bought loop can never do that.

WHAT THE MEASUREMENTS SAY (2026-08-18, established after the representative twice reported
"소리가 안 들림" on a bed that metered fine)
  * Judge audibility in the PLAYBACK band, not full-band. The DOSSIER bed was -14.9 LUFS and
    still inaudible on a phone because its weight sat at 49-245 Hz, and a 49 Hz fundamental ate
    a third of the headroom for a component no phone speaker reproduces.
  * So: sustained content at 392-784 Hz with vibrato, clicks with a 1.6-3.7 kHz resonant body,
    and only as much low end as a headphone needs for body. Same LUFS, +9.5 dB of audible.
  * Do NOT buy loudness by raising a hum or hiss floor. LUFS is K-weighted so it barely counts
    below 150 Hz, and every dB of floor costs exactly one dB of accent separation (measured:
    hum 0.20 -> 7.2 dB separation, hum 0.40 -> 1.4 dB). Loudness comes from adding EVENTS.
  * Clicks must have an attack ramp of about 0.8 ms and a one-pole rolloff above ~8 kHz. A
    zero-attack burst has energy to Nyquist, the AAC encoder's MDCT rings on it, and the file
    gains 5 dB of intersample peak between WAV and AAC. With the ramp that overshoot went
    5.0 -> 0.1 dB and loudness went UP 0.6 dB.

STRUCTURE
  A quiet room tone runs under the whole package. Each beat boundary gets a tick — that is the
  kit's engine made audible, one event per state change. Cut boundaries get a heavier accent.
  The figure gets a rising count texture. Everything stops at the outro, because the outro is
  specified silent so the close lands on image.
"""
import array
import math
import wave

SR = 48000
FPS = 30
TOTAL_FRAMES = 804
BED_END_FRAME = 729  # outro is silent by rule

# Frame grid, taken from ReelDongmyoNews.tsx. Kept as literals so a change there that is not
# mirrored here shows up as an audible desync rather than silently drifting.
CUTS = [0, 179, 271, 446, 569, 632]
BEATS = [0, 124, 179, 271, 387, 446, 569, 632]
FIGURE_FROM, FIGURE_DUR = 271, 116

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
    """A resonant tick. Attack ramp and one-pole rolloff are what keep AAC from ringing."""
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
        prev = (1 - a) * raw + a * prev  # one-pole low-pass
        out[i] = prev
    return out


def tone(freq, dur_s, vib_hz=4.7, vib_cents=9.0):
    """A sustained voice in the phone band. Vibrato is what stops it reading as a test tone."""
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


# --- room tone: two stacked fifths inside the phone band, very quiet -------------------
bed_s = BED_END_FRAME / FPS
add(0, tone(196.0 * 2, bed_s, vib_hz=3.1, vib_cents=6.0), 0.045)  # G3 -> 392 Hz
add(0, tone(293.66 * 2, bed_s, vib_hz=4.3, vib_cents=8.0), 0.030)  # D4 -> 587 Hz

# --- one tick per beat: the state-change grid, made audible ----------------------------
for i, fr in enumerate(BEATS):
    # alternate two pitches so a run of beats does not read as a metronome
    f = 2100.0 if i % 2 == 0 else 2640.0
    add(f2s(fr), click(f, 0.16, 34.0), 0.30)

# --- heavier accent on a cut change ----------------------------------------------------
for fr in CUTS:
    add(f2s(fr), click(1180.0, 0.30, 15.0), 0.34)
    add(f2s(fr), click(148.0, 0.24, 22.0, rolloff_hz=2600.0), 0.16)  # headphone body only

# --- the figure: a short accelerating tick run under the count-up -----------------------
start = f2s(FIGURE_FROM)
dur = FIGURE_DUR / FPS
k = 0
t = 0.0
while t < dur * 0.72:
    add(start + int(t * SR), click(3200.0, 0.05, 90.0), 0.10)
    k += 1
    t += 0.16 * math.exp(-k * 0.055) + 0.035
# and a landing on the settle
add(start + int(dur * 0.74 * SR), click(880.0, 0.42, 9.0), 0.40)

# --- normalise to a working peak; the real ceiling is set at mux ------------------------
peak = max(abs(v) for v in buf) or 1.0
target = 0.40  # deliberately conservative: narration is the programme, this is under it
scale = target / peak
pcm = array.array('h', (int(max(-1.0, min(1.0, v * scale)) * 32767) for v in buf))

out = 'output/reels/2026-09-04_dongmyo-news/audio/bed.wav'
with wave.open(out, 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())

print(f'{out}  {n_total/SR:.2f}s  peak {20*math.log10(peak*scale):.1f} dBFS  '
      f'{len(BEATS)} beat ticks, {len(CUTS)} cut accents, {k} figure ticks')
