"""
Sound for the 야쿠르트 / 코코 DOSSIER reel — effects only, no bed.

A derivative of the 우지 script; the synthesis is unchanged, for the reason given in the
바나나킥 script — the cohort has to sound like one format to be measurable as one.

WHAT IS DIFFERENT HERE, AND WHY
  The closing card has no evidence plate. There is no photograph of two people on Ulleungdo
  that we can honestly use, so the card is the number alone, and the kit answers by drawing it
  at 158px instead of 118px and stamping it at frame 3 instead of 26. The sound follows the
  picture: the verdict lands immediately.

  The falling tone survives from 우지 but is pulled in hard. There it dropped two octaves for a
  market share going 60% to 15%. Here the figure goes 13k to 11k — a real decline over five
  years, not a collapse — so the glide runs C5 to G4, one step down the same pentatonic table.
  A two-octave dive under a 15% fall would be the audio equivalent of a misleading chart axis.
"""
import array
import math
import wave

SR = 44100
FPS = 30

# Transcribed from DossierKit.tsx / ReelUjiDossier.tsx.
OPEN, ENTRY, CLOSE, OUTRO = 78, 84, 102, 84
YEARS = [1971, 1971, 2019, 2026, 2026]
# Per-entry shape, in the order DossierKit reveals things: (head lines, body paragraphs,
# has detail line, what fills the lower band). MUST match the spec .tsx — `verify-sync.py`
# in this folder re-derives it from the source and fails if the two disagree.
#
# 우지 used a fixed offset table instead, which was right for 우지 and wrong here: it fired a
# tick at frame 9 on a card with a one-line headline, and stayed silent at 34 on cards with a
# second body paragraph. Sound and picture disagreeing is the 2026-08-04 caption defect, and
# it is not less of a defect for being inaudible in isolation.
SHAPE = [(2, 2, True, 'ghost'),
         (2, 1, False, 'exhibit'),
         (2, 1, False, 'exhibit'),
         (2, 1, False, 'figure'),
         (2, 1, False, 'exhibit')]
# Opening stamp beats — the SAME numbers as TITLE_AT / FOOTER_AT in DossierKit.tsx. The snap
# and the invert are one event; if these two tables ever disagree the reel is out of sync with
# itself, which is exactly what happened to the caption timings on 2026-08-04.
TITLE_AT = [6, 20, 34]
FOOTER_AT = 52
STRIKE_OFFSETS = (0, 5)   # struck() inverts on d 0-2 and again on d 5-7
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

NSAMP = int((TOTAL_FRAMES / FPS + 0.9) * SR)
f2s = lambda fr: int(fr / FPS * SR)
master = array.array('d', bytes(8 * NSAMP))

# C major pentatonic, two octaves. No semitones, so nothing here can clash with anything else.
PENTA = [261.63, 293.66, 329.63, 392.00, 440.00,
         523.25, 587.33, 659.25, 783.99, 880.00]


def bell(f0, amp, tau, ms=520, partials=((1.0, 1.0, 1.0), (2.0, 0.34, 0.62), (3.0, 0.14, 0.42)),
         attack=0.0018):
    """
    A struck bell. Each partial is (ratio, amplitude, decay-multiplier): upper partials are
    quieter AND shorter, which is what makes a strike read as struck rather than as a chord —
    the brightness collapses in the first tenth of a second and a warm fundamental rings on.
    """
    n = int(SR * ms / 1000)
    buf = array.array('d', bytes(8 * n))
    for i in range(n):
        t = i / SR
        v = 0.0
        for ratio, a, dmul in partials:
            v += a * math.sin(2 * math.pi * f0 * ratio * t) * math.exp(-t / (tau * dmul))
        buf[i] = amp * v * min(1.0, t / attack)
    return buf


def two(f0, f1, amp, tau, gap_ms, ms=760):
    """Two struck notes, the second following the first. Used once, to resolve the outro."""
    a = bell(f0, amp, tau, ms)
    b = bell(f1, amp * 0.92, tau * 1.25, ms)
    n = ms * SR // 1000 + int(SR * gap_ms / 1000)
    buf = array.array('d', bytes(8 * n))
    off = int(SR * gap_ms / 1000)
    for i, v in enumerate(a):
        buf[i] += v
    for i, v in enumerate(b):
        if off + i < n:
            buf[off + i] += v
    return buf


# One element per thing that happens on screen. Nothing plays when nothing happens.
CUT = bell(130.81, 0.30, 0.115, 380,                       # a page turning: low, soft, short
           partials=((1.0, 1.0, 1.0), (2.0, 0.26, 0.55), (4.02, 0.07, 0.30)))
TYPE = bell(1046.50, 0.085, 0.038, 170,                    # a printed line: a small high tick
            partials=((1.0, 1.0, 1.0), (2.76, 0.22, 0.45)))
PLATE = bell(196.00, 0.30, 0.230, 700,                     # an exhibit landing: fuller, warmer
             partials=((1.0, 1.0, 1.0), (2.0, 0.30, 0.66), (3.0, 0.13, 0.40), (5.4, 0.05, 0.22)))
STAMP = bell(98.00, 0.40, 0.400, 1100,                     # the verdict: deep, with a tail
             partials=((1.0, 1.0, 1.0), (2.0, 0.36, 0.70), (3.0, 0.20, 0.48), (4.0, 0.09, 0.30)))
FALL = None                                                 # set below; needs the glide helper
OUTRO_HIT = two(392.00, 523.25, 0.30, 0.300, 190)          # G4 -> C5, the only resolution here
TICKS = [bell(f, 0.24, 0.150, 460,
              partials=((1.0, 1.0, 1.0), (2.0, 0.30, 0.58), (3.0, 0.11, 0.36)))
         for f in PENTA]


def stapler(amp, bright, ms=190):
    """
    A stapler snap. Two things happen when you press one: a bright metallic strike and a
    short-lived body, and the mechanism has enough mass that the top end dies almost at once.
    So the resonances are given a very fast decay and the body a slower one — that ratio is
    what separates 'snap' from 'ping'.

    The resonances are C6/G6/C7, i.e. the same pentatonic root two and three octaves up, so a
    hard mechanical sound still lands consonant with the bells ringing around it.
    """
    n = int(SR * ms / 1000)
    buf = array.array('d', bytes(8 * n))
    x = 424242
    prev = 0.0
    for i in range(n):
        t = i / SR
        x = (1103515245 * x + 12345) & 0x7FFFFFFF
        nz = x / 0x3FFFFFFF - 1.0
        prev = prev + 0.55 * (nz - prev)
        v = (nz - prev) * math.exp(-t / 0.0011) * 1.10 * bright
        v += math.sin(2 * math.pi * 1046.50 * t) * math.exp(-t / 0.0115) * 0.85 * bright
        v += math.sin(2 * math.pi * 1568.00 * t) * math.exp(-t / 0.0080) * 0.55 * bright
        v += math.sin(2 * math.pi * 2093.00 * t) * math.exp(-t / 0.0055) * 0.32 * bright
        v += math.sin(2 * math.pi * 233.08 * t) * math.exp(-t / 0.0420) * 0.42
        buf[i] = amp * v * min(1.0, t / 0.0004)
    return buf


SNAP = stapler(0.40, 1.0)          # the press
SNAP_REL = stapler(0.20, 0.62)     # the release, lighter and duller — a stapler is two sounds


def glide(f_hi, f_lo, ms, amp, tau):
    """The one non-struck sound: a tone falling, for the market share collapsing."""
    n = int(SR * ms / 1000)
    buf = array.array('d', bytes(8 * n))
    ph = 0.0
    for i in range(n):
        t = i / SR
        p = i / n
        fr = f_hi * (f_lo / f_hi) ** (p ** 0.85)
        ph += 2 * math.pi * fr / SR
        # Kept to pentatonic endpoints so it lands consonant with whatever is still ringing.
        buf[i] = amp * math.exp(-t / tau) * math.sin(ph) * min(1.0, t / 0.012)
    return buf


# C5 -> G4: one step down the pentatonic table, for a 15% decline. See the header.
FALL = glide(523.25, 392.00, 620, 0.15, 0.30)


def mix(buf, fr, gain=1.0):
    start = f2s(fr)
    for i, v in enumerate(buf):
        j = start + i
        if j >= NSAMP:
            break
        master[j] += v * gain


events = []
entry_i = 0
for c in cuts:
    kind, start = c[0], c[1]
    events.append(('cut', start, 0))
    if kind == 'open':
        for at in TITLE_AT + [FOOTER_AT]:
            events.append(('snap', start + at + STRIKE_OFFSETS[0], 0))
            events.append(('snapr', start + at + STRIKE_OFFSETS[1], 0))
    elif kind == 'entry':
        heads, bodies, detail, lower = SHAPE[entry_i]
        # Head lines land at 4 + i*5, body paragraphs at 16 + j*18, the detail line at 58.
        # Those are DossierKit's own numbers, read out of Entry(), not a table copied from
        # another reel — see the note on SHAPE above.
        for i in range(heads):
            events.append(('type', start + 4 + i * 5, 0))
        for j in range(bodies):
            events.append(('type', start + 16 + j * 18, 0))
        if detail:
            events.append(('type', start + 58, 0))
        if lower == 'exhibit':
            events.append(('plate', start + 24, 0))
        elif lower == 'ghost':
            # The ghost year fading up behind the card. 우지 left this one silent.
            events.append(('type', start + 44, 0))
        # 'figure' is sounded by its own falling tone, placed after this loop.
        entry_i += 1
    elif kind == 'span':
        _, _, dur, y0, y1 = c
        gap = y1 - y0
        # Exactly where the rendered year increments: round(y0 + gap*f/(dur-12)) steps up as
        # gap*f/(dur-12) crosses k - 0.5. The degree rises with k, so the run ascends.
        for k in range(1, gap + 1):
            f = (dur - 12) * (k - 0.5) / gap
            if f < dur:
                events.append(('tick', start + f, (k - 1) % len(PENTA)))
    elif kind == 'close':
        events.append(('stamp', start + 3, 0))
        events.append(('type', start + 26, 0))
        events.append(('type', start + 36, 0))
        events.append(('type', start + 66, 0))
    elif kind == 'outro':
        events.append(('type', start + 12, 0))
        events.append(('outro', start + 26, 0))

# The Fresh Manager headcount, the one number here that falls. Entry index 3.
entry3 = [c for c in cuts if c[0] == 'entry'][3][1]
events.append(('fall', entry3 + 30, 0))

for kind, fr, arg in sorted(events, key=lambda e: e[1]):
    if kind == 'cut':
        mix(CUT, fr)
    elif kind == 'snap':
        mix(SNAP, fr)
    elif kind == 'snapr':
        mix(SNAP_REL, fr)
    elif kind == 'type':
        mix(TYPE, fr)
    elif kind == 'plate':
        mix(PLATE, fr)
    elif kind == 'stamp':
        mix(STAMP, fr)
    elif kind == 'fall':
        mix(FALL, fr)
    elif kind == 'outro':
        mix(OUTRO_HIT, fr)
    elif kind == 'tick':
        # Slightly softer as the run climbs, so a long span shimmers instead of piling up.
        mix(TICKS[arg], fr, gain=1.0 - 0.22 * (arg / (len(PENTA) - 1)))

peak = max(abs(v) for v in master) or 1.0
gain = (10 ** (-1.5 / 20)) / peak
# A little stereo width on the tails only; the strikes stay centred so they read as one object.
DELAY = int(SR * 0.011)
out = array.array('h', bytes(2 * 2 * NSAMP))
for i in range(NSAMP):
    l = master[i] * gain
    r = (master[i] * 0.82 + master[i - DELAY] * 0.30) * gain if i >= DELAY else l
    out[2 * i] = max(-32768, min(32767, int(l * 32767)))
    out[2 * i + 1] = max(-32768, min(32767, int(r * 32767)))

path = 'output/reels/2026-08-18_yakult-dossier/bgm-dossier-bed.wav'
with wave.open(path, 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(out.tobytes())

n = lambda k: sum(1 for kk, _, _ in events if kk == k)
print(path)
print(f'  {TOTAL_FRAMES} frames  {NSAMP / SR:.2f}s  {len(events)} events  peak {peak:.3f}')
print(f'  cuts {n("cut")}  ticks {n("tick")}  type {n("type")}  plates {n("plate")}'
      f'  snaps {n("snap")}+{n("snapr")}  no bed')
