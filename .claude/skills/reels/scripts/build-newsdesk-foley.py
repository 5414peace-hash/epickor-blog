#!/usr/bin/env python3
"""
Office foley for a narrated NEWSDESK reel, driven by the picture.

WHY THIS REPLACES build-office-foley.py (2026-09-04)
  대표님: "지금 한가지 소리로 언발란스하게 규칙도 없이 효과음 넣은거야? ... dossier
  편처럼 text 움직임에 맞춰서라던지 숫자올라가는거라든지 그렇게 효과음이 맞게
  적용되야지 막 그냥 아무렇게나 넣으라는게 아니지."

  Correct, and the criticism is precise. The previous version searched the
  narration for silences and dropped a sound into each one, choosing by
  `gap_index % 3`. Nothing about the sound had anything to do with what was on
  screen. That is not sound design, it is filler.

  DOSSIER worked because every sound WAS a visual event: the stamp snapped, the
  plate inverted, the year counter ran. Its builder says so in as many words -
  "the sound and the picture are saying the same thing again". This script takes
  that literally.

THE RULE: ONE VISUAL EVENT, ONE SOUND, ALWAYS THE SAME SOUND

  | event in NewsdeskKit.tsx          | sound          | why                       |
  |-----------------------------------|----------------|---------------------------|
  | lower third wipes in (8 frames)   | keystroke      | the chyron is typed on    |
  | cut changes                       | page turn      | a new document            |
  | figure counts up (38 frames)      | counter ratchet| the digits are rolling    |
  | outro card rises (12 frames)      | desk bell      | sign-off                  |

  Frames come from the reel's spec, passed in as JSON, the way the DOSSIER
  builder transcribes DossierKit's constants. If the spec changes and this is not
  updated, the reel goes audibly out of sync, which is the failure you want.

AND THE SECOND RULE: BRIGHT SOUNDS ONLY WHERE THERE IS NO VOICE

  Visual events land where sentences start, so a sound tied to one lands where
  the voice does. The tick bed was rejected this morning for exactly that -
  transients at 1-4 kHz sitting under speech mask consonants.

  Resolved by register and by lead, not by volume:
    * Keystroke and page turn are BRIGHT, so they are placed a few frames EARLY,
      inside the silence that precedes the beat. A sound 3-5 frames ahead of a
      wipe still reads as causing it - broadcast has always cut sound slightly
      ahead of picture - and it finishes before the voice starts.
    * The counter runs UNDER speech by necessity, since the figure animates while
      the anchor is talking. So it is LOW - 200-380 Hz, below the consonant band
      entirely - and it reads as a mechanical counter rather than a click track.
    * A cut with no beat on it also lands under speech, and gets the same low
      treatment: a document thud rather than a page turn.

  The script measures the result and refuses to write a file where a bright event
  overlaps voiced audio, rather than trusting the arithmetic.

Usage:
  python build-newsdesk-foley.py NARRATION.wav OUT.wav SPEC.json
"""
import array
import json
import math
import random
import subprocess
import sys
import wave

SR = 48000
FPS = 30
narration_path, out_path, spec_path = sys.argv[1], sys.argv[2], sys.argv[3]
spec = json.load(open(spec_path, encoding='utf-8'))
rng = random.Random(20260904)

CUTS = spec['cuts']                # frame each cut begins
BEATS = spec['beats']              # frame each lower third wipes in
FIGURE = spec.get('figure')        # {"from": f, "dur": d} or null
OUTRO = spec['outro']              # frame the outro card rises
TOTAL = spec['total']              # composition length in frames

n = int(TOTAL / FPS * SR)
buf = [0.0] * n


def f2s(frame):
    return frame / FPS


def place(at_s, samples, gain):
    at = int(at_s * SR)
    for i, v in enumerate(samples):
        j = at + i
        if 0 <= j < n:
            buf[j] += v * gain


def noise(dur_s, lp_hz, hp_hz, decay, attack_ms=0.8):
    """Filtered noise with a ramped attack. The ramp is not cosmetic: a
    zero-attack burst has energy to Nyquist, AAC's MDCT rings on it, and that
    cost 5 dB of intersample peak between WAV and AAC when measured 2026-08-18."""
    m = int(dur_s * SR)
    out = [rng.uniform(-1.0, 1.0) for _ in range(m)]
    a = math.exp(-2.0 * math.pi * lp_hz / SR)
    prev = 0.0
    for i in range(m):
        prev = (1 - a) * out[i] + a * prev
        out[i] = prev
    b = math.exp(-2.0 * math.pi * hp_hz / SR)
    pin = 0.0
    pout = 0.0
    for i in range(m):
        x = out[i]
        pout = b * (pout + x - pin)
        pin = x
        out[i] = pout
    atk = max(1, int(attack_ms / 1000.0 * SR))
    for i in range(m):
        e = math.exp(-decay * i / SR)
        if i < atk:
            e *= i / atk
        out[i] *= e
    return out


def struck(freq, dur_s, decay, attack_ms=0.8, partials=((1.0, 1.0), (2.7, 0.4), (5.1, 0.2))):
    m = int(dur_s * SR)
    out = [0.0] * m
    atk = max(1, int(attack_ms / 1000.0 * SR))
    for i in range(m):
        t = i / SR
        e = math.exp(-decay * t)
        if i < atk:
            e *= i / atk
        v = 0.0
        for mult, g in partials:
            v += g * math.sin(2 * math.pi * freq * mult * t)
        out[i] = v * e
    return out


# --- the four sounds -------------------------------------------------------

def keystroke():
    """BRIGHT. One key: a dry click over a small plastic thock. 55 ms, so it fits
    inside a 3-frame lead with room to spare."""
    s = noise(0.045, 5200.0, 1400.0, 190.0)
    t = struck(rng.uniform(160.0, 200.0), 0.055, 120.0)
    return [0.75 * s[i] + 0.5 * t[i] for i in range(min(len(s), len(t)))]


def page_turn():
    """BRIGHT. A sheet lifted and dropped. Deliberately short - 150 ms - so a
    5-frame lead contains it entirely."""
    m = int(0.15 * SR)
    out = noise(0.15, 7000.0, 2400.0, 9.0, attack_ms=14.0)
    for i in range(m):
        out[i] *= math.sin(math.pi * i / m) ** 1.3
    return out


def ratchet_click():
    """LOW. One digit of a mechanical counter. 200-380 Hz, no content in the
    consonant band, so it can run under the anchor without masking anything."""
    s = noise(0.030, 380.0, 200.0, 260.0)
    t = struck(240.0, 0.040, 150.0, partials=((1.0, 1.0), (1.9, 0.3)))
    return [0.6 * s[i] + 0.7 * t[i] for i in range(min(len(s), len(t)))]


def doc_thud():
    """LOW. A folder set down. For a cut that lands under speech."""
    s = noise(0.05, 320.0, 90.0, 90.0)
    t = struck(115.0, 0.13, 60.0, partials=((1.0, 1.0), (2.1, 0.25)))
    return [0.55 * s[i] + 0.8 * t[i] for i in range(min(len(s), len(t)))]


def desk_bell():
    """BRIGHT. C major pentatonic, as in the DOSSIER bells, so it cannot clash."""
    out = [0.0] * int(0.5 * SR)
    for f, g in ((1046.5, 1.0), (1567.98, 0.35), (2093.0, 0.18)):
        s = struck(f, 0.5, 9.0, attack_ms=1.2, partials=((1.0, 1.0),))
        for i, v in enumerate(s):
            out[i] += g * v
    return out


# --- where the voice is ----------------------------------------------------
proc = subprocess.run(
    ['ffmpeg', '-hide_banner', '-i', narration_path, '-af',
     'silencedetect=noise=-35dB:d=0.12', '-f', 'null', '-'],
    capture_output=True, text=True)
# silencedetect logs at info level on stderr; -v error hides it and the check
# then silently finds nothing and passes.
silences = []
start = None
for line in proc.stderr.splitlines():
    if 'silence_start:' in line:
        start = float(line.split('silence_start:')[1].split()[0])
    elif 'silence_end:' in line and start is not None:
        silences.append((start, float(line.split('silence_end:')[1].split()[0])))
        start = None


def silent_at(t0, t1):
    return any(s <= t0 and t1 <= e for s, e in silences)


# --- place the events ------------------------------------------------------
LEAD_KEY = 3    # frames
LEAD_PAGE = 5
LEAD_BELL = 4
events = []
bright_on_voice = []
allowed = []


def voice_onset_after(t):
    """When the voice next starts, at or after t."""
    for st, en in silences:
        if st <= t <= en:
            return en
    return None


def add(kind, at_s, samples, gain, bright):
    """Bright events must ATTACK in silence. They may ring past the voice onset
    only if what overlaps is an already-decayed tail - at least 10 dB below the
    event's own peak. That exception exists for one sound: the sign-off bell has
    to land on the outro card, and the outro card rises on the same frame the CTA
    line begins, so an overlap is structural rather than sloppy. Anything whose
    body would sit on the voice is refused."""
    dur = len(samples) / SR
    if bright and at_s > 0.05 and not silent_at(at_s, at_s + dur):
        onset = voice_onset_after(at_s)
        ok = False
        if onset is not None and onset > at_s:
            peak_ev = max(abs(v) for v in samples) or 1.0
            i = int((onset - at_s) * SR)
            tail = max((abs(v) for v in samples[i:]), default=0.0)
            down = 20 * math.log10((tail / peak_ev) + 1e-9)
            ok = down <= -10.0
            if ok:
                allowed.append((kind, at_s, down))
        if not ok:
            bright_on_voice.append((kind, at_s))
    place(at_s, samples, gain)
    events.append((at_s, kind))


beatset = set(BEATS)
for f in BEATS:
    if f == 0:
        continue  # the reel opens on the first word; nothing goes over it
    add('keystroke', f2s(f - LEAD_KEY), keystroke(), 0.52, True)

for f in CUTS:
    if f == 0:
        continue
    if f in beatset:
        add('page turn', f2s(f - LEAD_PAGE), page_turn(), 0.44, True)
    else:
        # A picture change with no sentence change: it happens mid-speech, so it
        # gets the low treatment instead of being dragged out of position.
        add('doc thud', f2s(f), doc_thud(), 0.40, False)

if FIGURE:
    fr, fd = FIGURE['from'], FIGURE['dur']
    run = min(38, fd - 6)          # matches the kit's interpolate range
    # One click per digit, EXCEPT that clicks are never closer than 45 ms. The
    # click itself is 30-40 ms long, so packing 46 of them into a 38-frame roll
    # would overlap them into a buzz rather than a mechanism. The cap keeps it
    # reading as a counter; DOSSIER's ran at roughly one every 2.6 frames.
    MIN_GAP = 0.045
    steps = max(1, min(int(round(FIGURE.get('value', 30))),
                       int((run / FPS) / MIN_GAP)))
    for k in range(steps):
        # Ease the same way the number does, so the clicks crowd where the digits
        # crowd instead of running at a constant rate the picture is not keeping.
        p = (k + 1) / steps
        eased = 1 - (1 - p) ** 2.2
        at = f2s(fr) + eased * (run / FPS)
        add('ratchet', at, ratchet_click(), 0.30, False)

add('desk bell', f2s(OUTRO - LEAD_BELL), desk_bell(), 0.30, True)

if bright_on_voice:
    print('REFUSING: a bright event would land on voiced audio:')
    for kind, at in bright_on_voice:
        print(f'   {kind} at {at:.3f}s (f{at * 30:.0f})')
    sys.exit(1)

peak = max(abs(v) for v in buf) or 1.0
pcm = array.array('h', (int(max(-1.0, min(1.0, v * (0.62 / peak))) * 32767) for v in buf))
with wave.open(out_path, 'wb') as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())

kinds = {}
for _, k in events:
    kinds[k] = kinds.get(k, 0) + 1
print(out_path + '  ' + format(TOTAL / FPS, '.2f') + 's  ' + str(len(events)) + ' events')
for k in sorted(kinds):
    print('   ' + k.ljust(11) + ' x' + str(kinds[k]))
print('   every bright event attacks in narration silence')
for kind, at, down in allowed:
    print('   ' + kind + ' at ' + format(at, '.3f') + 's rings into the voice at '
          + format(down, '.1f') + ' dB below its own peak (allowed)')
