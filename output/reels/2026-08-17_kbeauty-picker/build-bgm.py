"""
Synthesise the audio bed for the K-Beauty Picker reel, locked to its event grid.

WHY THIS IS SYNTHESISED RATHER THAN LICENSED
  The three tracks already in `output/bgm/youtube-audio-library/` cannot be used here.
  Their own LICENSES.md says they were pulled from the signed-in channel's Audio
  Library "for YouTube use" and warns to re-check before reusing the masters on a
  non-YouTube platform — and this reel's first destination is Instagram.

  More importantly, a stock track is the wrong shape for this kit. COUNTER's whole
  premise is that a discrete thing happens roughly every 0.67s, and the one beat that
  justifies the video format at all is a price counting up. A song laid over that is
  decoration running on its own clock. A bed built from the kit's own frame numbers
  makes the information rate audible: every cut lands on a low thud, every copy beat
  on a soft tick, and the price count gets a run of micro-ticks that no purchased
  track could ever line up with.

  It is also unambiguously clear to use anywhere, which the licensed masters are not.

STRUCTURE
  One long pad (three sine partials, slow breathing LFO) plus four short elements
  rendered once each and mixed in at their frame offsets. The event map below is
  transcribed from CounterKit.tsx, so if the kit's beat frames move, these move too.

  Round Lab has no list-price beat, so block 3 skips that tick. The audio mirrors the
  visual asymmetry rather than papering over it.
"""
import array
import math
import wave

SR = 44100
FPS = 30
HOOK, BLOCK, DECIDE, OUTRO = 66, 126, 108, 78
NPROD = 4
TOTAL_FRAMES = HOOK + NPROD * BLOCK + DECIDE + OUTRO          # 756
# A little tail so the final decay is not clipped by the mux.
NSAMP = int((TOTAL_FRAMES / FPS + 0.35) * SR)


def f2s(frame):
    return int(frame / FPS * SR)


master = array.array('d', bytes(8 * NSAMP))

# ------------------------------------------------------------------ #
# Pad. A2 root with a fifth and a ninth — open sus2, so it commits to neither major
# nor minor and stays out of the way. The 0.07 Hz LFO is the audible counterpart of
# the drifting depth band in the picture.
# ------------------------------------------------------------------ #
PARTIALS = [(110.00, 0.34), (164.81, 0.22), (246.94, 0.13), (440.00, 0.035)]
dur = NSAMP / SR
for i in range(NSAMP):
    t = i / SR
    # 1.4s in, 2.2s out.
    env = min(1.0, t / 1.4) * min(1.0, max(0.0, (dur - t) / 2.2))
    breathe = 0.82 + 0.18 * math.sin(2 * math.pi * 0.07 * t)
    v = 0.0
    for freq, amp in PARTIALS:
        # A hair of detune between the channels is added later; here it is mono.
        v += amp * math.sin(2 * math.pi * freq * t)
    master[i] = v * env * breathe * 0.30


# ------------------------------------------------------------------ #
# Elements. Each is generated once and added at every offset it occurs.
# ------------------------------------------------------------------ #
def lcg(seed=20260817):
    """Deterministic noise. A fixed generator keeps successive builds identical."""
    x = seed
    while True:
        x = (1103515245 * x + 12345) & 0x7FFFFFFF
        yield x / 0x3FFFFFFF - 1.0


def thud(freq, tau, amp, click=0.0, ms=420):
    n = int(SR * ms / 1000)
    buf = array.array('d', bytes(8 * n))
    rng = lcg()
    for i in range(n):
        t = i / SR
        e = math.exp(-t / tau)
        # Slight downward pitch sweep, which is what makes a thud read as a hit
        # rather than as a tone.
        v = math.sin(2 * math.pi * freq * t * (1 - 0.18 * min(1.0, t / tau)))
        buf[i] = amp * e * v
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
        # 1.5ms attack, or the onset clicks.
        buf[i] = amp * e * v * min(1.0, t / 0.0015)
    return buf


CUT = thud(58.0, 0.115, 0.34, click=0.045)
CHIP = thud(70.0, 0.140, 0.30, click=0.04)
CHIP_TOP = blip([1180.0, 1770.0], 0.055, 0.17)
TICK = blip([1800.0, 2700.0], 0.022, 0.115)
MICRO = blip([2400.0, 3600.0], 0.012, 0.075)
RESOLVE = blip([1200.0, 1800.0, 2400.0], 0.070, 0.145)


def mix(buf, at_frame, gain=1.0):
    start = f2s(at_frame)
    for i, v in enumerate(buf):
        j = start + i
        if j >= NSAMP:
            break
        master[j] += v * gain


# ------------------------------------------------------------------ #
# Event map, transcribed from CounterKit.tsx.
# ------------------------------------------------------------------ #
events = []

# Hook: one cut, then the four panels arriving on the stagger at f0/4/8/12.
events.append(('cut', 0))
for i in range(NPROD):
    events.append(('tick', i * 4))

# Product blocks. `list` is omitted for Round Lab, index 3.
BEATS = [(3, 'tick'), (26, 'tick'), (40, 'tick'), (58, 'list'), (72, 'count'),
         (84, 'tick'), (98, 'tick')]
for bi in range(NPROD):
    base = HOOK + bi * BLOCK
    events.append(('cut', base))
    for local, kind in BEATS:
        if kind == 'list' and bi == 3:
            continue                       # Round Lab has no list price to strike
        events.append(('tick' if kind == 'list' else kind, base + local))

# Decision grid: cut, four cards, footer line, domain chip.
d = HOOK + NPROD * BLOCK
events.append(('cut', d))
for local in (8, 17, 26, 35, 48):
    events.append(('tick', d + local))
events.append(('chip', d + 60))

# Outro: cut, subline, domain chip.
o = d + DECIDE
events.append(('cut', o))
events.append(('tick', o + 16))
events.append(('chip', o + 28))

for kind, fr in events:
    if kind == 'cut':
        mix(CUT, fr)
    elif kind == 'tick':
        mix(TICK, fr)
    elif kind == 'chip':
        mix(CHIP, fr)
        mix(CHIP_TOP, fr + 1)
    elif kind == 'count':
        # The price ticker runs 11 frames. Eight micro-ticks accelerate across it, then
        # one resolving blip on the frame the number settles. This is the signature
        # sound of the kit and the reason a bespoke bed beats a licensed track.
        for k in range(8):
            p = k / 7
            mix(MICRO, fr + p * p * 10, gain=0.7 + 0.3 * p)
        mix(RESOLVE, fr + 11)

# ------------------------------------------------------------------ #
# Normalise to -3 dBFS peak, then write a lightly widened stereo pair. The tiny
# inter-channel delay on the pad gives it width without touching transient timing.
# ------------------------------------------------------------------ #
peak = max(abs(v) for v in master) or 1.0
gain = (10 ** (-3.0 / 20)) / peak
DELAY = int(SR * 0.008)

out = array.array('h', bytes(2 * 2 * NSAMP))
for i in range(NSAMP):
    left = master[i] * gain
    right = master[i - DELAY] * gain if i >= DELAY else left
    out[2 * i] = max(-32768, min(32767, int(left * 32767)))
    out[2 * i + 1] = max(-32768, min(32767, int(right * 32767)))

path = 'output/reels/2026-08-17_kbeauty-picker/bgm-counter-bed.wav'
with wave.open(path, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(out.tobytes())

print(f'{path}')
print(f'  {NSAMP / SR:.2f}s  {len(events)} events  peak before norm {peak:.3f}')
print(f'  cuts {sum(1 for k, _ in events if k == "cut")}'
      f'  ticks {sum(1 for k, _ in events if k == "tick")}'
      f'  counts {sum(1 for k, _ in events if k == "count")}'
      f'  chips {sum(1 for k, _ in events if k == "chip")}')
