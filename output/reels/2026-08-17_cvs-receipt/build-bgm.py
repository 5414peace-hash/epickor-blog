"""
Audio bed for the CVS Receipt reel — a thermal printer, not a song.

WHY NOT A MUSICAL BED
  The three COUNTER reels use a sine pad with ticks on the event grid. That is right for a
  designed comparison. A receipt is a machine, and the machine already makes the sound the
  format implies: the print head sweeps once per line, the paper feeds, the total chunks
  through, the stamp hits. Scoring that with a pad would be dressing a mechanism.

  It also differentiates on a platform where almost every reel is music-forward. A viewer
  scrolling past a near-silent printing sound will notice it precisely because nothing else
  in the feed sounds like that.

  Under it sits a very low room tone so the track is never actually silent — Instagram's
  normalisation and a viewer's "is my sound broken" reflex both want something there.

STRUCTURE, transcribed from ReceiptKit.tsx
  HEAD 12 · LINE 24 · TOTAL 78 · TWIST 96 · OUTRO 84, five items -> 390 frames.
"""
import array
import math
import wave

SR = 44100
FPS = 30
HEAD, LINE, TOTAL, TWIST, OUTRO = 12, 24, 78, 96, 84
NITEMS = 5
TOTAL_FRAMES = HEAD + NITEMS * LINE + TOTAL + TWIST + OUTRO
NSAMP = int((TOTAL_FRAMES / FPS + 0.4) * SR)

f2s = lambda fr: int(fr / FPS * SR)
master = array.array('d', bytes(8 * NSAMP))

# Room tone: two very low sines, barely there. Not a chord — a room.
for i in range(NSAMP):
    t = i / SR
    env = min(1.0, t / 1.0) * min(1.0, max(0.0, (NSAMP / SR - t) / 1.6))
    v = 0.30 * math.sin(2 * math.pi * 55.0 * t) + 0.18 * math.sin(2 * math.pi * 82.5 * t)
    master[i] = v * env * 0.19 * (0.86 + 0.14 * math.sin(2 * math.pi * 0.09 * t))


def lcg(seed=20260817):
    x = seed
    while True:
        x = (1103515245 * x + 12345) & 0x7FFFFFFF
        yield x / 0x3FFFFFFF - 1.0


def sweep(ms, amp, f_lo, f_hi, tau):
    """Print-head sweep: filtered noise whose centre rises, with a fast decay."""
    n = int(SR * ms / 1000)
    buf = array.array('d', bytes(8 * n))
    rng = lcg()
    prev = 0.0
    for i in range(n):
        t = i / SR
        p = i / n
        # One-pole band emulation: mix raw noise with its own smoothed copy, sliding the
        # smoothing constant to move the perceived centre frequency upward.
        a = 0.10 + 0.55 * p
        cur = next(rng)
        prev = prev + a * (cur - prev)
        buf[i] = amp * math.exp(-t / tau) * (cur - prev * 0.75)
    return buf


def thud(freq, tau, amp, click=0.0, ms=380):
    n = int(SR * ms / 1000)
    buf = array.array('d', bytes(8 * n))
    rng = lcg()
    for i in range(n):
        t = i / SR
        e = math.exp(-t / tau)
        buf[i] = amp * e * math.sin(2 * math.pi * freq * t * (1 - 0.18 * min(1.0, t / tau)))
        if click and t < 0.006:
            buf[i] += click * next(rng) * math.exp(-t / 0.0018)
    return buf


def blip(freqs, tau, amp, ms=140):
    n = int(SR * ms / 1000)
    buf = array.array('d', bytes(8 * n))
    for i in range(n):
        t = i / SR
        e = math.exp(-t / tau)
        v = sum(math.sin(2 * math.pi * fr * t) for fr in freqs) / len(freqs)
        buf[i] = amp * e * v * min(1.0, t / 0.0015)
    return buf


PRINT = sweep(105, 0.34, 900, 4200, 0.030)     # one line of thermal print
CHUNK = thud(74.0, 0.130, 0.34, click=0.05)    # the total, mechanical
STAMP = thud(58.0, 0.150, 0.38, click=0.07)    # the reversal landing
CHIP = thud(70.0, 0.130, 0.28, click=0.04)
CHIP_TOP = blip([1180.0, 1770.0], 0.055, 0.15)
MICRO = blip([2600.0, 3900.0], 0.010, 0.060)   # the total counting
PULSE = thud(48.0, 0.100, 0.16)                # quiet pace marker


def mix(buf, fr, gain=1.0):
    start = f2s(fr)
    for i, v in enumerate(buf):
        j = start + i
        if j >= NSAMP:
            break
        master[j] += v * gain


events = []
for i in range(NITEMS):
    events.append(('print', HEAD + i * LINE))

total_at = HEAD + NITEMS * LINE
events.append(('chunk', total_at))
events.append(('count', total_at + 14))

twist_at = total_at + TOTAL
events.append(('stamp', twist_at + 4))

outro_at = twist_at + TWIST
events.append(('chunk', outro_at))
events.append(('chip', outro_at + 28))

# A quiet pulse every 48 frames gives the near-silent stretches a pace without becoming music.
for fr in range(0, TOTAL_FRAMES, 48):
    events.append(('pulse', fr))

for kind, fr in events:
    if kind == 'print':
        mix(PRINT, fr)
    elif kind == 'chunk':
        mix(CHUNK, fr)
    elif kind == 'stamp':
        mix(STAMP, fr)
    elif kind == 'pulse':
        mix(PULSE, fr)
    elif kind == 'chip':
        mix(CHIP, fr)
        mix(CHIP_TOP, fr + 1)
    elif kind == 'count':
        for k in range(10):
            p = k / 9
            mix(MICRO, fr + p * 13, gain=0.7 + 0.3 * p)

peak = max(abs(v) for v in master) or 1.0
gain = (10 ** (-3.0 / 20)) / peak
DELAY = int(SR * 0.008)
out = array.array('h', bytes(2 * 2 * NSAMP))
for i in range(NSAMP):
    l = master[i] * gain
    r = master[i - DELAY] * gain if i >= DELAY else l
    out[2 * i] = max(-32768, min(32767, int(l * 32767)))
    out[2 * i + 1] = max(-32768, min(32767, int(r * 32767)))

path = 'output/reels/2026-08-17_cvs-receipt/bgm-receipt-bed.wav'
with wave.open(path, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(out.tobytes())

print(path)
print(f'  {NSAMP / SR:.2f}s  {len(events)} events  peak before norm {peak:.3f}')
print(f"  prints {sum(1 for k,_ in events if k=='print')}"
      f"  chunks {sum(1 for k,_ in events if k=='chunk')}"
      f"  pulses {sum(1 for k,_ in events if k=='pulse')}")
