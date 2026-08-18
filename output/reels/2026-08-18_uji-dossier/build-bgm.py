"""
Audio bed for the 우지 파동 DOSSIER reel — a microfilm reader, not a song.

WHY THIS SOUND
  The three COUNTER reels use a sine pad on the event grid; the RECEIPT reel uses a thermal
  printer. The principle each time is the same: score the MECHANISM the format implies, not
  the mood of the topic. This reel's mechanism is an archive reader — a motor hum with a
  little wow in it, a shutter as each page advances, and a ratchet that clicks once per year
  as the counter crosses a gap.

  The ratchet is the point. It is the only element in any EpicKor bed driven by a number the
  picture is also showing, so the sound and the image are the same event.

THE ACCELERANDO IS FREE, AND IT IS THE BEST THING HERE
  The kit gives a span 22 + 2.4*years frames, clamped at 74. So the 8-year gap gets 41 frames
  (~3.6 frames per year) and the 28-year gap gets 74 (~2.2 frames per year). The longer wait
  therefore TICKS FASTER, and the second span audibly presses where the first one plodded.
  Nothing was written to make that happen; it falls out of the clamp, and it is exactly the
  right dramatic shape. So the tick times are COMPUTED from the kit's own formula below rather
  than typed in, and they stay correct if the timing is ever retuned.

KEY
  49.0 Hz + 73.4 Hz, a fifth — the same interval as the receipt bed's room tone, a tone lower.
  Institutional rather than musical. Nothing here resolves, because the story does not.
"""
import array
import math
import wave

SR = 44100
FPS = 30

# Transcribed from DossierKit.tsx / ReelUjiDossier.tsx.
OPEN, ENTRY, CLOSE, OUTRO = 54, 84, 102, 84
YEARS = [1963, 1989, 1989, 1997, 2025]
# Entries carrying an exhibit plate instead of a second body paragraph and a detail line. Their
# events are different, so the bed has to know: a plate landing is one heavy press, not three
# ticks of type. A click with nothing happening on screen is worse than no click.
EXHIBIT_AT = {0, 4}
span_frames = lambda gap: min(74, max(26, round(22 + gap * 2.4)))

cuts = []
cur = 0
cuts.append(('open', cur, OPEN)); cur += OPEN
for i, y in enumerate(YEARS):
    cuts.append(('entry', cur, ENTRY)); cur += ENTRY
    nxt = YEARS[i + 1] if i + 1 < len(YEARS) else None
    if nxt and nxt > y:
        d = span_frames(nxt - y)
        cuts.append(('span', cur, d, y, nxt)); cur += d
cuts.append(('close', cur, CLOSE)); cur += CLOSE
cuts.append(('outro', cur, OUTRO)); cur += OUTRO
TOTAL_FRAMES = cur

NSAMP = int((TOTAL_FRAMES / FPS + 0.4) * SR)
f2s = lambda fr: int(fr / FPS * SR)
master = array.array('d', bytes(8 * NSAMP))

# Reader motor: a fifth, with slow wow. A perfectly steady tone reads as a synth pad; a motor
# drifts, so the pitch moves by a fraction of a percent.
for i in range(NSAMP):
    t = i / SR
    env = min(1.0, t / 1.1) * min(1.0, max(0.0, (NSAMP / SR - t) / 1.8))
    wow = 1.0 + 0.0035 * math.sin(2 * math.pi * 0.37 * t)
    # A motor's harmonic series, not two tones. This is both physically right and the only
    # efficient way to make the bed measure: LUFS is K-weighted, which discounts 49 Hz by
    # about 10 dB, so a bed living entirely under 150 Hz reads far quieter than it sounds.
    # Broadband hiss buys loudness too, but it buys it by RAISING THE FLOOR, which is exactly
    # what destroys accent separation — measured 2.5 dB at hiss 0.17 against 8.4 dB at 0.07.
    # Harmonics of the fundamental land in the K-weighted band at a fraction of the headroom
    # cost, because they are periodic rather than dense.
    # BALANCE, not just content. The first version put 0.34 into a 49 Hz fundamental — a
    # third of the headroom spent on a frequency no phone or laptop speaker reproduces, which
    # then forced everything audible down through the peak normalisation. The low end is now
    # only enough to give the machine a body on headphones; the weight sits at 392-784 Hz,
    # where a small speaker actually works.
    v = (0.15 * math.sin(2 * math.pi * 49.0 * t * wow)
         + 0.11 * math.sin(2 * math.pi * 73.4 * t * wow)
         + 0.10 * math.sin(2 * math.pi * 98.0 * t * wow + 1.1)
         + 0.10 * math.sin(2 * math.pi * 147.0 * t + 2.3)
         + 0.09 * math.sin(2 * math.pi * 196.0 * t + 0.4)
         + 0.09 * math.sin(2 * math.pi * 245.0 * t + 1.9)
         + 0.19 * math.sin(2 * math.pi * 392.0 * t * (1 + 0.004 * math.sin(2 * math.pi * 5.5 * t)))
         + 0.11 * math.sin(2 * math.pi * 588.0 * t * (1 + 0.005 * math.sin(2 * math.pi * 4.1 * t)))
         + 0.06 * math.sin(2 * math.pi * 784.0 * t + 0.8))
    master[i] = v * env * 0.42 * (0.88 + 0.12 * math.sin(2 * math.pi * 0.11 * t))


# Film hiss. Not decoration — a reader running film has a broadband floor, and without it
# this bed is ALL below 150 Hz, where the K-weighting behind LUFS discounts it heavily. The
# first master measured -22.1 LUFS at a -3.0 dBFS peak: a 19 dB crest, so reaching -14 meant
# either 9 dB of limiting (which flattened the ratchets, the one thing worth hearing) or
# adding mid-band energy. Hiss is the honest way to add it, and it costs almost no headroom
# because it never peaks.
def _hiss():
    x = 987654321
    lo = 0.0
    hi = 0.0
    for i in range(NSAMP):
        x = (1103515245 * x + 12345) & 0x7FFFFFFF
        n = x / 0x3FFFFFFF - 1.0
        hi = hi + 0.35 * (n - hi)      # keep above ~500 Hz by subtracting the slow part
        lo = lo + 0.06 * (n - lo)      # and roll off the very top so it is air, not fizz
        t = i / SR
        env = min(1.0, t / 1.4) * min(1.0, max(0.0, (NSAMP / SR - t) / 1.8))
        master[i] += (hi - lo) * 0.09 * env


_hiss()


def lcg(seed=20260818):
    x = seed
    while True:
        x = (1103515245 * x + 12345) & 0x7FFFFFFF
        yield x / 0x3FFFFFFF - 1.0


def thud(freq, tau, amp, click=0.0, ms=380, bend=0.18):
    n = int(SR * ms / 1000)
    buf = array.array('d', bytes(8 * n))
    rng = lcg()
    for i in range(n):
        t = i / SR
        e = math.exp(-t / tau)
        buf[i] = amp * e * math.sin(2 * math.pi * freq * t * (1 - bend * min(1.0, t / tau)))
        if click and t < 0.006:
            buf[i] += click * next(rng) * math.exp(-t / 0.0018)
    return buf


def tick(ms, amp, tau, bright=0.72):
    """
    Short high-passed noise. `bright` is the one-pole coefficient: higher = thinner.

    THE ATTACK RAMP AND THE TOP ROLL-OFF ARE NOT POLISH — THEY ARE THE AAC FIX.
    A raw noise burst with an instant edge carries energy to Nyquist, and AAC's MDCT rings on
    it: the first master measured -5.0 dBFS as WAV and -0.0 dBFS decoded back out of the mp4,
    a **5 dB** overshoot rather than the ~1.8 dB seen on the earlier, smoother beds. Buying
    that back with the limiter would have cost 5 dB of programme level on a bed already
    fighting for it. A 0.8 ms attack and a one-pole roll-off above roughly 8 kHz still read as
    a click at 30 fps and give the encoder something it can represent.
    """
    n = int(SR * ms / 1000)
    buf = array.array('d', bytes(8 * n))
    rng = lcg()
    prev = 0.0
    sm = 0.0
    for i in range(n):
        t = i / SR
        cur = next(rng)
        prev = prev + (1 - bright) * (cur - prev)
        hp = cur - prev
        sm = sm + 0.42 * (hp - sm)
        buf[i] = amp * math.exp(-t / tau) * sm * min(1.0, t / 0.0008)
    return buf


def blip(freqs, tau, amp, ms=140):
    n = int(SR * ms / 1000)
    buf = array.array('d', bytes(8 * n))
    for i in range(n):
        t = i / SR
        v = sum(math.sin(2 * math.pi * fr * t) for fr in freqs) / len(freqs)
        buf[i] = amp * math.exp(-t / tau) * v * min(1.0, t / 0.0015)
    return buf


def glide(f_hi, f_lo, ms, amp, tau):
    """A tone falling from f_hi to f_lo. Used once, for the market share collapsing."""
    n = int(SR * ms / 1000)
    buf = array.array('d', bytes(8 * n))
    ph = 0.0
    for i in range(n):
        t = i / SR
        p = i / n
        fr = f_hi * (f_lo / f_hi) ** (p ** 0.8)
        ph += 2 * math.pi * fr / SR
        buf[i] = amp * math.exp(-t / tau) * math.sin(ph) * min(1.0, t / 0.01)
    return buf


def pawl(ms, amp, tau, freqs):
    """A ratchet click with a body: noise transient plus damped resonances."""
    n = int(SR * ms / 1000)
    buf = array.array('d', bytes(8 * n))
    rng = lcg()
    prev = 0.0
    for i in range(n):
        t = i / SR
        cur = next(rng)
        prev = prev + 0.30 * (cur - prev)
        v = (cur - prev) * math.exp(-t / 0.0016) * 0.55
        for k, fr in enumerate(freqs):
            v += math.sin(2 * math.pi * fr * t) * math.exp(-t / tau) / (1.6 + k)
        buf[i] = amp * v * min(1.0, t / 0.0006)
    return buf


SHUTTER = thud(62.0, 0.145, 0.36, click=0.075)       # a page advancing (the body)
SHUTTER_TOP = pawl(70, 0.26, 0.020, (520.0, 880.0, 1450.0))  # ...and the mechanism (audible)
STAMP = thud(52.0, 0.180, 0.44, click=0.10, ms=520)  # the verdict landing
RATCHET = pawl(46, 0.34, 0.013, (1660.0, 2480.0, 3720.0))   # one year
# One line of type. Deliberately fuller than a click: at 11 ms / 0.115 it was inaudible, and
# the entry cards — five sixths of the reel's running time — had nothing in them. Loudness on
# a bed this sparse has to come from MORE EVENTS, never from a louder floor; raising the hum
# or the hiss buys the same decibel and costs a decibel of accent separation every time
# (measured: 7.2 dB separation at hum 0.20 against 1.4 dB at hum 0.40, for 3.9 dB of level).
TYPE = tick(23, 0.24, 0.0055, bright=0.78)
SHIFT = thud(96.0, 0.075, 0.13, ms=200, bend=0.30)   # paper settling under a printed line
CHIP = thud(70.0, 0.130, 0.28, click=0.04)
CHIP_TOP = blip([1180.0, 1770.0], 0.055, 0.15)
FALL = glide(320.0, 96.0, 900, 0.20, 0.40)           # 60% -> 15%
PULSE = thud(44.0, 0.110, 0.15)
PLATE = thud(88.0, 0.100, 0.30, click=0.06, ms=260, bend=0.34)   # an exhibit landing


def mix(buf, fr, gain=1.0):
    start = f2s(fr)
    for i, v in enumerate(buf):
        j = start + i
        if j >= NSAMP:
            break
        master[j] += v * gain


events = []
for c in cuts:
    kind, start = c[0], c[1]
    events.append(('shutter', start))
    if kind == 'entry':
        # Head line 1, head line 2, body paragraph 1, body paragraph 2, detail — matching
        # Entry()'s at(f, 4 + i*5), at(f, 16 + i*18) and at(f, 58). Five ticks across the cut
        # rather than three in its first half: an entry whose last event lands at frame 16 of
        # 84 is a still picture for 2.3 seconds, which is reel 376's measured defect.
        idx = sum(1 for c in cuts[:cuts.index(c)] if c[0] == 'entry')
        if idx in EXHIBIT_AT:
            for off in (4, 9, 16):
                events.append(('type', start + off))
            events.append(('plate', start + 24))     # the print pressed onto the page
        else:
            for off in (4, 9, 16, 34, 58):
                events.append(('type', start + off))
    elif kind == 'span':
        _, _, dur, y0, y1 = c
        # Exactly where the rendered year increments: round(y0 + gap*f/(dur-12)) steps up as
        # gap*f/(dur-12) crosses k - 0.5.
        gap = y1 - y0
        for k in range(1, gap + 1):
            f = (dur - 12) * (k - 0.5) / gap
            if f < dur:
                events.append(('ratchet', start + f))
    elif kind == 'close':
        events.append(('stamp', start + 3))
        events.append(('type', start + 26))
        events.append(('type', start + 36))
    elif kind == 'outro':
        events.append(('type', start + 12))
        events.append(('chip', start + 26))

# The figure in entry 2 — the one number that falls.
entry2 = [c for c in cuts if c[0] == 'entry'][1][1]
events.append(('fall', entry2 + 30))

# A quiet pace marker through the sparse stretches, off the cut grid so it never doubles.
for fr in range(20, TOTAL_FRAMES, 46):
    events.append(('pulse', fr))

for kind, fr in sorted(events, key=lambda e: e[1]):
    if kind == 'shutter':
        mix(SHUTTER, fr)
        mix(SHUTTER_TOP, fr + 1)
    elif kind == 'stamp':
        mix(STAMP, fr)
    elif kind == 'ratchet':
        mix(RATCHET, fr)
    elif kind == 'type':
        mix(TYPE, fr)
        mix(SHIFT, fr + 1, gain=0.8)
    elif kind == 'fall':
        mix(FALL, fr)
    elif kind == 'pulse':
        mix(PULSE, fr)
    elif kind == 'plate':
        mix(PLATE, fr)
        mix(TYPE, fr + 3, gain=0.7)
    elif kind == 'chip':
        mix(CHIP, fr)
        mix(CHIP_TOP, fr + 1)

peak = max(abs(v) for v in master) or 1.0
gain = (10 ** (-3.0 / 20)) / peak
DELAY = int(SR * 0.008)
out = array.array('h', bytes(2 * 2 * NSAMP))
for i in range(NSAMP):
    l = master[i] * gain
    r = master[i - DELAY] * gain if i >= DELAY else l
    out[2 * i] = max(-32768, min(32767, int(l * 32767)))
    out[2 * i + 1] = max(-32768, min(32767, int(r * 32767)))

path = 'output/reels/2026-08-18_uji-dossier/bgm-dossier-bed.wav'
with wave.open(path, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(out.tobytes())

n = lambda k: sum(1 for kk, _ in events if kk == k)
print(path)
print(f'  {TOTAL_FRAMES} frames  {NSAMP / SR:.2f}s  {len(events)} events  peak {peak:.3f}')
print(f'  shutters {n("shutter")}  ratchets {n("ratchet")}  type {n("type")}  pulses {n("pulse")}')
for c in cuts:
    if c[0] == 'span':
        _, s, d, y0, y1 = c
        print(f'  span {y0}->{y1}: f{s}, {d} frames, {y1 - y0} ticks,'
              f' {d / (y1 - y0):.2f} frames/tick')
