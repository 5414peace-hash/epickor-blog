#!/usr/bin/env python3
"""
Office foley for a narrated NEWSDESK reel. Effects only. There is no bed.

WHY THERE IS NO BED, FOR THE THIRD TIME
  2026-08-18, on the DOSSIER drone: "ufo 처럼 나는 background 소리는 진짜 별로다."
  2026-09-04, on the NEWSDESK tick bed: "bgm 이 너무 듣기 안좋은데... 목소리보다
  bgm 이 더 크게 들려서 별로임."
  2026-09-04, on the city-noise floor that replaced it: "백색노이즈 완전 별로다."

  Three rejections, one cause. A continuous synthetic sound under a 28-second
  reel has nowhere to hide - the viewer hears it the whole time, so whatever
  character it has becomes the character of the reel. That was already written
  down in the DOSSIER builder on 2026-08-18, and two more beds were built anyway.
  Discrete events do not have the problem: they are gone before they wear out.

  The representative's own prescription, 2026-09-04: "dossier 편에 들어가는
  효과음들로 채우는게 좋을거같아. 사무용폼 (키보드, 스테이플러 등 아기자기한 소리들)."

WHY THE GAPS ARE READ FROM THE AUDIO RATHER THAN FROM A TABLE
  Every event is placed inside a silence in the narration, found by running
  silencedetect on the narration itself. There is no second table that can drift
  out of sync with the voice - which is exactly how the caption timings broke on
  2026-08-04.

  It also fixes the masking problem structurally instead of by turning things
  down. The tick bed intruded because transients at 1-4 kHz sat under speech. A
  stapler is brighter than those ticks and does not intrude, because it happens
  where there is no speech to intrude on.

Usage:
  python build-office-foley.py NARRATION.wav OUT.wav TOTAL_SECONDS
"""
import array
import math
import random
import subprocess
import sys
import wave

SR = 48000
narration, out_path, total_s = sys.argv[1], sys.argv[2], float(sys.argv[3])
# Optional: the frame the outro card appears on, in seconds. The bell goes in
# the gap just BEFORE it, as a sign-off sting. Placed after it instead, the
# bell rings under the spoken CTA - which is the masking problem this whole
# rebuild exists to remove.
outro_s = float(sys.argv[4]) if len(sys.argv) > 4 else None
rng = random.Random(20260904)

# --- find the gaps in the voice -------------------------------------------
proc = subprocess.run(
    ['ffmpeg', '-hide_banner', '-i', narration, '-af',
     'silencedetect=noise=-35dB:d=0.20', '-f', 'null', '-'],
    capture_output=True, text=True)
# silencedetect logs at info level on stderr. Passing -v error hides it entirely,
# which is how an earlier pass "found" no boundaries at all and reported success.
log = proc.stderr
gaps = []
start = None
for line in log.splitlines():
    if 'silence_start:' in line:
        start = float(line.split('silence_start:')[1].split()[0])
    elif 'silence_end:' in line and start is not None:
        end = float(line.split('silence_end:')[1].split()[0])
        gaps.append((start, end))
        start = None
if not gaps:
    print('no gaps found in the narration - refusing to guess')
    sys.exit(1)

n = int(total_s * SR)
buf = [0.0] * n


def place(at_s, samples, gain):
    at = int(at_s * SR)
    for i, v in enumerate(samples):
        j = at + i
        if 0 <= j < n:
            buf[j] += v * gain


def noise_burst(dur_s, lp_hz, hp_hz, decay, attack_ms=0.8):
    """Filtered noise with a ramped attack. The ramp matters: a zero-attack burst
    has energy to Nyquist, the AAC encoder rings on it, and that cost 5 dB of
    intersample peak between WAV and AAC when it was measured on 2026-08-18."""
    m = int(dur_s * SR)
    out = [rng.uniform(-1.0, 1.0) for _ in range(m)]
    a = math.exp(-2.0 * math.pi * lp_hz / SR)
    prev = 0.0
    for i in range(m):
        prev = (1 - a) * out[i] + a * prev
        out[i] = prev
    b = math.exp(-2.0 * math.pi * hp_hz / SR)
    prev_in = 0.0
    prev_out = 0.0
    for i in range(m):
        x = out[i]
        prev_out = b * (prev_out + x - prev_in)
        prev_in = x
        out[i] = prev_out
    atk = max(1, int(attack_ms / 1000.0 * SR))
    for i in range(m):
        e = math.exp(-decay * i / SR)
        if i < atk:
            e *= i / atk
        out[i] *= e
    return out


def struck(freq, dur_s, decay, attack_ms=0.8):
    """A struck resonance - the pitched half of a key or a stapler."""
    m = int(dur_s * SR)
    out = [0.0] * m
    atk = max(1, int(attack_ms / 1000.0 * SR))
    for i in range(m):
        t = i / SR
        e = math.exp(-decay * t)
        if i < atk:
            e *= i / atk
        out[i] = (math.sin(2 * math.pi * freq * t)
                  + 0.4 * math.sin(2 * math.pi * freq * 2.7 * t)
                  + 0.2 * math.sin(2 * math.pi * freq * 5.1 * t)) * e
    return out


def key_tap():
    """One keystroke: a dry click over a small plastic thock."""
    s = noise_burst(0.045, 5200.0, 1400.0, 190.0)
    t = struck(rng.uniform(150.0, 210.0), 0.055, 120.0)
    m = min(len(s), len(t))
    return [0.75 * s[i] + 0.5 * t[i] for i in range(m)]


def stapler():
    """Spring travel, then the punch - two events about 90 ms apart."""
    out = [0.0] * int(0.30 * SR)
    a = noise_burst(0.06, 3600.0, 900.0, 95.0)
    for i, v in enumerate(a):
        out[i] += 0.45 * v
    off = int(0.09 * SR)
    b = noise_burst(0.10, 4800.0, 700.0, 130.0)
    c = struck(120.0, 0.13, 70.0)
    for i in range(min(len(b), len(c))):
        if off + i < len(out):
            out[off + i] += 0.9 * b[i] + 0.55 * c[i]
    return out


def paper():
    """A page turned. Soft, bright, and with no attack transient to speak of."""
    m = int(0.26 * SR)
    out = noise_burst(0.26, 7000.0, 2200.0, 6.0, attack_ms=18.0)
    for i in range(m):
        out[i] *= math.sin(math.pi * i / m) ** 1.4
    return out


def pen_click():
    """Two tiny ticks, the way a retractable pen actually behaves."""
    out = [0.0] * int(0.14 * SR)
    for off, g in ((0.0, 1.0), (0.075, 0.7)):
        s = noise_burst(0.02, 6500.0, 2600.0, 320.0)
        k = int(off * SR)
        for i, v in enumerate(s):
            if k + i < len(out):
                out[k + i] += g * v
    return out


def desk_bell():
    """A small counter bell. C major pentatonic, like the DOSSIER bells, so it
    cannot clash with anything placed near it."""
    out = [0.0] * int(0.9 * SR)
    for f, g in ((1046.5, 1.0), (1567.98, 0.35), (2093.0, 0.18)):
        s = struck(f, 0.9, 4.2, attack_ms=1.2)
        for i, v in enumerate(s):
            out[i] += g * v
    return out


# --- one event per gap, chosen by how much room the gap actually has -------
bell_gap = None
if outro_s is not None:
    before = [i for i, (gs, ge) in enumerate(gaps) if gs < outro_s]
    bell_gap = before[-1] if before else None

placed = []
for gi, (gs, ge) in enumerate(gaps):
    if gi == len(gaps) - 1:
        continue  # the closing silence is where the reel ends; leave it alone
    if gi == bell_gap:
        at = gs + 0.05
        place(at, desk_bell(), 0.30)
        placed.append((at, 'bell (sign-off)'))
        continue
    at = gs + 0.06          # start after the voice has stopped
    avail = (ge - gs) - 0.10  # and finish before it resumes
    if avail <= 0.04:
        continue
    if avail >= 0.34 and gi % 3 == 1:
        place(at, stapler(), 0.55)
        placed.append((at, 'stapler'))
    elif avail >= 0.30 and gi % 3 == 2:
        place(at, paper(), 0.50)
        placed.append((at, 'paper'))
    elif avail >= 0.20:
        k = 3 if avail >= 0.30 else 2
        for j in range(k):
            place(at + j * 0.075, key_tap(), 0.42 - 0.04 * j)
        placed.append((at, 'keys x' + str(k)))
    else:
        place(at, pen_click(), 0.40)
        placed.append((at, 'pen'))

peak = max(abs(v) for v in buf) or 1.0
scale = 0.62 / peak
pcm = array.array('h', (int(max(-1.0, min(1.0, v * scale)) * 32767) for v in buf))
with wave.open(out_path, 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())

print(out_path + '  ' + format(total_s, '.2f') + 's  '
      + str(len(gaps)) + ' gaps, ' + str(len(placed)) + ' events')
for at, what in sorted(placed):
    print('   ' + format(at, '6.2f') + 's  f' + format(at * 30, '5.0f') + '  ' + what)
