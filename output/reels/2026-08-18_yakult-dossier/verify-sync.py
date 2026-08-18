# -*- coding: utf-8 -*-
"""
Fail if build-bgm.py and the spec .tsx disagree about what happens on screen.

WHY THIS EXISTS
  build-bgm.py places every sound on the frame where DossierKit reveals the thing it belongs
  to. Those frames are derived from each entry's shape — how many headline lines, how many
  body paragraphs, whether there is a detail line, and what fills the lower band. That shape
  lives in the .tsx, and it was hand-copied into the audio script.

  Hand-copied tables drift. The first version of this reel's audio inherited 우지's fixed
  offsets and was wrong on three of five cards before anyone listened to it — a tick on a
  headline line that does not exist, silence on a body paragraph that does. Neither is audible
  on its own, which is exactly why it needs a check rather than an ear.

Run it after editing either file. Exit 1 means the reel is out of sync with itself.
"""
import io
import re
import sys

SPEC = 'remotion/ReelYakultDossier.tsx'
BGM = 'output/reels/2026-08-18_yakult-dossier/build-bgm.py'


def arr_len(block, key):
    m = re.search(key + r':\s*\[(.*?)\]', block, re.S)
    if not m:
        return 0
    # No escaped quotes to worry about: the specs use typographic apostrophes inside
    # single-quoted strings, so a plain non-greedy match is exact here.
    return len(re.findall(r"'([^']*)'", m.group(1)))


def from_spec(path):
    s = io.open(path, encoding='utf-8').read()
    body = s[s.index('entries: ['):s.index('\n  close: {')]
    parts = re.split(r'\n    \{\n', body)[1:]
    shape, years = [], []
    for p in parts:
        years.append(int(re.search(r'year:\s*(\d{4})', p).group(1)))
        lower = ('exhibit' if 'exhibit: {' in p
                 else 'figure' if 'figure: {' in p else 'ghost')
        shape.append((arr_len(p, 'head'), arr_len(p, 'body'),
                      bool(re.search(r'\n      detail:', p)), lower))
    return shape, years


def from_bgm(path):
    s = io.open(path, encoding='utf-8').read()
    shape = eval(re.search(r'^SHAPE = (\[.*?\])\n', s, re.S | re.M).group(1))
    years = eval(re.search(r'^YEARS = (\[.*?\])\n', s, re.S | re.M).group(1))
    return [tuple(x) for x in shape], years


a_shape, a_years = from_spec(SPEC)
b_shape, b_years = from_bgm(BGM)
bad = False
if a_years != b_years:
    print(f'YEARS  spec={a_years}  bgm={b_years}')
    bad = True
for i, (a, b) in enumerate(zip(a_shape, b_shape)):
    flag = 'OK ' if a == b else 'BAD'
    if a != b:
        bad = True
    print(f'  entry {i}  {flag}  spec={a}  bgm={b}')
if len(a_shape) != len(b_shape):
    print(f'entry count  spec={len(a_shape)}  bgm={len(b_shape)}')
    bad = True
print('OUT OF SYNC' if bad else 'in sync')
sys.exit(1 if bad else 0)
