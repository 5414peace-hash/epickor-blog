#!/usr/bin/env python3
"""
Sound for a narrated NEWSDESK reel. Effects only, driven by the picture.

WHY THERE IS NO BED (2026-08-18, then twice more on 2026-09-04)
  A continuous synthetic sound under a 28-second reel has nowhere to hide: the
  viewer hears it the whole way through, so whatever character it has becomes
  the character of the reel. Three were rejected - a drone, a tick bed, and a
  shaped-noise floor that measured 22 dB under the voice and was still wrong.
  Level was never the problem.

THE FIRST RULE: ONE VISUAL EVENT, ONE SOUND
  "dossier 편처럼 text 움직임에 맞춰서라던지 숫자올라가는거라든지 그렇게 효과음이
  맞게 적용되야지 막 그냥 아무렇게나 넣으라는게 아니지." (2026-09-04)

  The pass before this searched the narration for silences and dropped a sound
  into each, choosing by gap_index % 3. Nothing about any sound had anything to
  do with what was on screen. Filler with a plausible-looking rule reads as
  designed, which makes it worse than filler with none.

THE SECOND RULE: THE SOUND COMES FROM THE SUBJECT
  "각각의 편에 맞는 효과음을 넣어야지 같은 효과음을 여러편에 돌려쓰지마." (2026-09-04)

  | event in NewsdeskKit.tsx        | market (동묘)   | store (올리브영)  | atelier (성수)   |
  |---------------------------------|----------------|-----------------|-----------------|
  | lower third wipes in (8 frames) | hanger on rail | barcode scanner | camera shutter  |
  | cut changes                     | clothes pushed | cap snapped     | garment bag zip |
  | figure counts up (38 frames)    | coins counted  | receipt printer | sewing machine  |
  | outro card rises (12 frames)    | coin in a tin  | till chime      | door chime      |

  The grammar is shared - a wipe always sounds like one thing, a cut like
  another - because that is what makes the sound read as the format rather than
  as decoration. The vocabulary is not. Same structure, new material every reel,
  exactly as the card-news rule requires a new visual system every batch.

  Frames come from the reel's spec as JSON, the way the DOSSIER builder
  transcribes its kit's constants. If the spec moves and the JSON does not, the
  reel goes audibly out of sync, which is the failure you want.

THE THIRD RULE: BRIGHT SOUNDS ONLY WHERE THERE IS NO VOICE
  Visual events land where sentences start, so a sound tied to one lands where
  the voice does. Resolved by register and by lead, never by volume:
    * Bright sounds sit 3-5 frames EARLY, inside the silence before the beat. A
      sound slightly ahead of a wipe still reads as causing it, and it finishes
      before the voice starts.
    * Anything that must run under speech is LOW - the counter sits below
      400 Hz, out of the consonant band - so it cannot mask a word.
  The script refuses to write a file where a bright event lands on voiced audio.

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
FIGURE = spec.get('figure')        # {"from": f, "dur": d, "value": v} or null
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


def blend(a, b, ga, gb):
    """Sum two layers, keeping the LONGER. Truncating to the shorter one silently
    cut the hanger ring from 200 ms to 50 ms and took its whole character with it -
    a bug that produced a sound nobody would recognise while looking correct."""
    m = max(len(a), len(b))
    out = [0.0] * m
    for i, v in enumerate(a):
        out[i] += ga * v
    for i, v in enumerate(b):
        out[i] += gb * v
    return out


# ---- market: 동묘, a flea market reached by subway --------------------------

def m_wipe():
    """A hanger pushed along a steel rail. Inharmonic partials, short ring."""
    return blend(struck(1760.0, 0.20, 26.0, partials=((1.0, 1.0), (2.31, 0.5), (3.77, 0.22))),
                 noise(0.05, 7000.0, 2400.0, 150.0), 0.8, 0.35)


def m_cut():
    """A pile of clothes pushed aside."""
    m = int(0.15 * SR)   # must fit inside LEAD_CUT (167 ms); see add()
    out = noise(0.15, 2600.0, 380.0, 7.0, attack_ms=22.0)
    for i in range(m):
        out[i] *= math.sin(math.pi * i / m) ** 1.2
    return out


def m_count():
    """Coins counted onto a table. LOW - it runs under the anchor."""
    return blend(struck(300.0, 0.045, 140.0, partials=((1.0, 1.0), (2.4, 0.35))),
                 noise(0.028, 620.0, 260.0, 240.0), 0.7, 0.5)


def m_sign():
    """A coin dropped into a tin."""
    out = [0.0] * int(0.5 * SR)
    for f, g in ((1174.7, 1.0), (1864.7, 0.4), (2489.0, 0.2)):
        for i, v in enumerate(struck(f, 0.5, 9.0, attack_ms=1.0, partials=((1.0, 1.0),))):
            out[i] += g * v
    return out


# ---- store: 올리브영, a beauty hall with fourteen tills ---------------------

def s_wipe():
    """A barcode scanner - the one sound every reader of this story has heard."""
    m = int(0.06 * SR)
    out = [0.0] * m
    atk = max(1, int(1.2 / 1000.0 * SR))
    for i in range(m):
        t = i / SR
        e = 1.0 if i > atk else i / atk
        if t > 0.045:
            e *= max(0.0, (0.06 - t) / 0.015)
        out[i] = (math.sin(2 * math.pi * 2793.0 * t)
                  + 0.25 * math.sin(2 * math.pi * 5586.0 * t)) * e
    return out


def s_cut():
    """A cap snapped shut on a bottle."""
    return blend(noise(0.04, 6000.0, 1800.0, 260.0),
                 struck(300.0, 0.05, 150.0), 0.8, 0.45)


def s_count():
    """A receipt printer. LOW, so it can run under the anchor."""
    return blend(noise(0.026, 420.0, 180.0, 300.0),
                 struck(210.0, 0.036, 170.0, partials=((1.0, 1.0), (2.0, 0.3))), 0.6, 0.7)


def s_sign():
    """The till chime at the end of a sale."""
    out = [0.0] * int(0.5 * SR)
    for f, g in ((1318.5, 1.0), (1975.5, 0.4), (2637.0, 0.18)):
        for i, v in enumerate(struck(f, 0.5, 9.0, attack_ms=1.2, partials=((1.0, 1.0),))):
            out[i] += g * v
    return out


# ---- atelier: 성수, a shoe-factory district that became a fashion one -------

def a_wipe():
    """A camera shutter: mirror, then curtain."""
    out = [0.0] * int(0.11 * SR)
    for off, g, lp, hp, dec in ((0.0, 0.9, 6500.0, 1600.0, 240.0),
                                (0.035, 1.0, 5200.0, 1100.0, 190.0)):
        k = int(off * SR)
        for i, v in enumerate(noise(0.05, lp, hp, dec)):
            if k + i < len(out):
                out[k + i] += g * v
    return out


def a_cut():
    """A garment bag zipped. Noise through a rising high-pass."""
    m = int(0.15 * SR)   # must fit inside LEAD_CUT (167 ms); see add()
    src = [rng.uniform(-1.0, 1.0) for _ in range(m)]
    out = [0.0] * m
    pin = 0.0
    pout = 0.0
    for i in range(m):
        hp = 900.0 + 2600.0 * (i / m)
        b = math.exp(-2.0 * math.pi * hp / SR)
        x = src[i]
        pout = b * (pout + x - pin)
        pin = x
        out[i] = pout * math.sin(math.pi * i / m) ** 0.8
    return out


def a_count():
    """An industrial sewing machine. LOW, and the district's own history."""
    return blend(struck(170.0, 0.040, 160.0, partials=((1.0, 1.0), (2.2, 0.4), (3.1, 0.15))),
                 noise(0.024, 350.0, 140.0, 280.0), 0.75, 0.45)


def a_sign():
    """A boutique door chime."""
    out = [0.0] * int(0.55 * SR)
    for f, g in ((1568.0, 1.0), (2349.3, 0.38), (3136.0, 0.16)):
        for i, v in enumerate(struck(f, 0.55, 9.5, attack_ms=1.0, partials=((1.0, 1.0),))):
            out[i] += g * v
    return out


PALETTES = {
    'market': {'wipe': m_wipe, 'cut': m_cut, 'count': m_count, 'sign': m_sign,
               'names': ('hanger on rail', 'clothes pushed aside', 'coins counted', 'coin in a tin')},
    'store': {'wipe': s_wipe, 'cut': s_cut, 'count': s_count, 'sign': s_sign,
              'names': ('barcode scanner', 'cap snapped shut', 'receipt printer', 'till chime')},
    'atelier': {'wipe': a_wipe, 'cut': a_cut, 'count': a_count, 'sign': a_sign,
                'names': ('camera shutter', 'garment bag zip', 'sewing machine', 'door chime')},
}


def doc_thud():
    """LOW and palette-neutral. For a cut that lands under speech and therefore
    cannot take the palette's bright cut sound."""
    return blend(noise(0.05, 320.0, 90.0, 90.0),
                 struck(115.0, 0.13, 60.0, partials=((1.0, 1.0), (2.1, 0.25))), 0.55, 0.8)


PAL = PALETTES[spec['palette']]
snd_wipe, snd_cut, snd_count, snd_sign = PAL['wipe'], PAL['cut'], PAL['count'], PAL['sign']
W_NAME, C_NAME, R_NAME, S_NAME = PAL['names']

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


def voice_onset_after(t):
    """When the voice next starts, at or after t."""
    for st, en in silences:
        if st <= t <= en:
            return en
    return None


# --- place the events ------------------------------------------------------
LEAD_WIPE = 3    # frames
LEAD_CUT = 5
LEAD_SIGN = 4
events = []
bright_on_voice = []
allowed = []


def add(kind, at_s, samples, gain, bright):
    """Bright events must ATTACK in silence. They may ring past the voice onset
    only if what overlaps is an already-decayed tail - at least 10 dB below the
    event's own peak. That exception exists for one sound: the sign-off has to
    land on the outro card, and the outro card rises on the same frame the CTA
    line begins, so an overlap there is structural rather than sloppy."""
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
    add(W_NAME, f2s(f - LEAD_WIPE), snd_wipe(), 0.52, True)

for f in CUTS:
    if f == 0:
        continue
    if f in beatset:
        add(C_NAME, f2s(f - LEAD_CUT), snd_cut(), 0.44, True)
    else:
        # A picture change with no sentence change happens mid-speech, so it gets
        # the low treatment rather than being dragged out of position.
        add('doc thud (low)', f2s(f), doc_thud(), 0.40, False)

if FIGURE:
    fr, fd = FIGURE['from'], FIGURE['dur']
    run = min(38, fd - 6)          # matches the kit's interpolate range
    # One click per digit, EXCEPT that clicks are never closer than 45 ms. The
    # click itself is 25-45 ms long, so packing 46 of them into a 38-frame roll
    # would overlap them into a buzz rather than a mechanism.
    MIN_GAP = 0.045
    steps = max(1, min(int(round(FIGURE.get('value', 30))), int((run / FPS) / MIN_GAP)))
    for k in range(steps):
        # Ease the way the number does, so the clicks crowd where the digits
        # crowd instead of running at a rate the picture is not keeping.
        p = (k + 1) / steps
        eased = 1 - (1 - p) ** 2.2
        add(R_NAME, f2s(fr) + eased * (run / FPS), snd_count(), 0.30, False)

add(S_NAME, f2s(OUTRO - LEAD_SIGN), snd_sign(), 0.30, True)

if bright_on_voice:
    print('REFUSING: a bright event would land on voiced audio:')
    for kind, at in bright_on_voice:
        print('   ' + kind + ' at ' + format(at, '.3f') + 's (f' + format(at * 30, '.0f') + ')')
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
print(out_path + '  ' + format(TOTAL / FPS, '.2f') + 's  ' + str(len(events))
      + ' events  palette=' + spec['palette'])
for k in sorted(kinds):
    print('   ' + k.ljust(22) + ' x' + str(kinds[k]))
print('   every bright event attacks in narration silence')
for kind, at, down in allowed:
    print('   ' + kind + ' at ' + format(at, '.3f') + 's rings into the voice at '
          + format(down, '.1f') + ' dB below its own peak (allowed)')
