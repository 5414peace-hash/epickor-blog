#!/usr/bin/env python3
"""
Card renderer for the "Station Sign" visual system — Seoul neighbourhood batch.

Third system, third direction, per the 2026-07-20 house rule that every batch
designs its own rather than repeating a template.

  Heat Scale (ramyun)     warm paper, one huge numeral, gradient heat bar
  Shelf Tag (convenience) cold white card, monospaced price, barcode foot
  Station Sign (Seoul)    dark platform ground, line-colour roundel, name plate

Why this one: the hub's argument is that Seoul is not one city and you should
pick the neighbourhood before you book. Every entry in lib/seoul.ts already
carries its nearest station and the lines that serve it, and the object that
carries exactly that information in Korea is the platform name plate — the
line-numbered roundel, the Korean name set large with the romanisation beneath
it, and the previous/next strip along the foot. The data was already shaped
like the sign; this renders it as one.

Line colours are Seoul Metro's official values, so a reader who has stood on
the platform recognises the neighbourhood's line before reading a word.

Dark ground, deliberately — the other two systems are light, so the three sets
do not sit in the Instagram grid looking like one another. It is not the dark
veil the house rule warns about: photographs sit in clean panels at full
strength, never washed out behind text.

Card order follows the representative's 2026-08-03 instruction: Korean name
large at the top left, romanised name under it, then the figure, then the copy.
"""

import argparse
import io
import re
import sys
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

SCRIPT_DIR = Path(__file__).parent
ROOT = (SCRIPT_DIR / '../../../../').resolve()

GROUND = '#15181C'
PANEL = '#1E2329'
TEXT = '#FFFFFF'
MUTE = 'rgba(255,255,255,0.60)'
FAINT = 'rgba(255,255,255,0.16)'

SANS = "'Segoe UI',Arial,'Noto Sans KR','Malgun Gothic',sans-serif"

# Seoul Metro's official line colours.
LINES = {
    '1': '#0052A4', '2': '#00A84D', '3': '#EF7C1C', '4': '#00A5DE',
    '5': '#996CAC', '6': '#CD7C2F', '7': '#747F00', '8': '#E6186C',
    '9': '#BB8336', 'A': '#0090D2', 'K': '#77C4A3',
}

FOOTER_TOP = 940


def parse_script(path):
    text = Path(path).read_text(encoding='utf-8')
    blocks = re.split(r'^## Card \d+', text, flags=re.MULTILINE)
    meta = {}
    for line in blocks[0].splitlines():
        if ':' in line and not line.startswith('#'):
            k, _, v = line.partition(':')
            meta[k.strip()] = v.strip().strip('"')

    keys = ('kicker', 'image', 'image_label', 'note', 'mode', 'name_ko',
            'name_en', 'lines', 'station', 'time', 'stay', 'subject_note')
    cards = []
    for block in blocks[1:]:
        card = {k: '' for k in keys}
        card['mode'] = 'stop'
        for line in block.splitlines():
            s = line.strip()
            for key in keys:
                if s.startswith(key + ':'):
                    card[key] = s.split(':', 1)[1].strip()
            if s.startswith('**Main:**'):
                card['main'] = s.replace('**Main:**', '').strip()
            elif s.startswith('**Sub:**'):
                card['sub'] = s.replace('**Sub:**', '').strip()
        card.setdefault('main', '')
        card.setdefault('sub', '')
        if card.get('main') or card['name_ko']:
            cards.append(card)
    return meta, cards


def esc(text):
    return (text or '').replace('\\n', '<br>')


def fit_size(text, column_px, cap, factor=0.76):
    words = [w for w in re.split(r'\s+|<br>', esc(text).replace('<br>', ' ')) if w]
    longest = max((len(w) for w in words), default=1)
    return max(28, min(cap, int(column_px / (longest * factor))))


def roundels(spec, size=64):
    """The line-numbered discs from the platform sign.

    Kept to the real colours because that is the entire point — someone who has
    used Line 6 knows the ochre disc before they read Noksapyeong.
    """
    out = []
    for token in [t.strip() for t in (spec or '').split(',') if t.strip()]:
        colour = LINES.get(token[0].upper(), '#8A8A8A')
        label = token if len(token) <= 2 else token[:2]
        out.append(
            f'<div style="width:{size}px;height:{size}px;border-radius:50%;'
            f'background:{colour};display:flex;align-items:center;'
            f'justify-content:center;color:#FFFFFF;font-size:{int(size * 0.46)}px;'
            f'font-weight:900;flex:none;">{label}</div>')
    if not out:
        return ''
    return ('<div style="display:flex;gap:12px;align-items:center;">'
            + ''.join(out) + '</div>')


def watermark(dark=True):
    colour = 'rgba(255,255,255,0.62)' if dark else 'rgba(20,20,20,0.55)'
    border = 'rgba(255,255,255,0.42)' if dark else 'rgba(20,20,20,0.42)'
    return f'''
  <div style="position:absolute;top:40px;left:52px;z-index:30;
    display:flex;align-items:center;gap:12px;color:{colour};">
    <div style="width:30px;height:30px;border:2px solid {border};
      display:flex;align-items:center;justify-content:center;
      font-size:12px;font-weight:900;">EK</div>
    <div style="font-size:12px;font-weight:900;letter-spacing:0.2em;">EPICKOR.COM</div>
  </div>'''


def foot(card, index, total):
    """The platform strip. On a real sign it names the stations either side;
    here it carries the station this neighbourhood is reached from, so the card
    answers 'how do I get there' without spending a line of copy on it."""
    left = card['station'] or 'SEOUL'
    return f'''
  <div style="position:absolute;left:0;right:0;top:{FOOTER_TOP}px;bottom:0;
    background:{PANEL};border-top:1px solid {FAINT};z-index:22;
    display:flex;align-items:center;justify-content:space-between;padding:0 60px;">
    <div style="display:flex;align-items:center;gap:18px;">
      {roundels(card['lines'], 40)}
      <div style="font-size:22px;font-weight:800;color:{TEXT};letter-spacing:0.02em;">
        {left}</div>
    </div>
    <div style="font-size:19px;font-weight:900;color:{MUTE};letter-spacing:0.1em;">
      {index:02d} / {total:02d}</div>
  </div>'''


def build(card, index, total):
    if card['mode'] == 'cover':
        return f'''
  <div style="position:absolute;inset:0;background:{GROUND};"></div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:336px;overflow:hidden;z-index:10;">
    <img src="{card['image']}" alt="{card['image_label']}"
      style="width:100%;height:100%;object-fit:cover;display:block;">
  </div>
  <div style="position:absolute;left:0;right:0;bottom:336px;height:10px;z-index:12;
    background:linear-gradient(90deg,{LINES['1']} 0 16.6%,{LINES['2']} 16.6% 33.2%,
      {LINES['3']} 33.2% 49.8%,{LINES['4']} 49.8% 66.4%,{LINES['5']} 66.4% 83%,
      {LINES['6']} 83% 100%);"></div>
  <div style="position:absolute;left:96px;right:96px;top:140px;height:530px;z-index:20;
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    text-align:center;overflow:hidden;">
    <div style="font-size:19px;font-weight:900;letter-spacing:0.2em;color:{MUTE};
      margin-bottom:26px;">{card['kicker']}</div>
    <div style="font-size:{fit_size(card['main'], 850, 80)}px;font-weight:950;color:{TEXT};
      line-height:1.05;letter-spacing:-0.02em;">{esc(card['main'])}</div>
    <div style="margin-top:26px;max-width:760px;font-size:26px;font-weight:650;
      color:{MUTE};line-height:1.42;word-break:keep-all;">{esc(card['sub'])}</div>
  </div>
  {watermark()}'''

    if card['mode'] == 'end':
        return f'''
  <div style="position:absolute;inset:0;background:{GROUND};"></div>
  <img src="{card['image']}" alt="{card['image_label']}"
    style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
    opacity:0.28;z-index:2;">
  <div style="position:absolute;inset:0;z-index:3;
    background:linear-gradient(180deg,rgba(21,24,28,0.72),rgba(21,24,28,0.92));"></div>
  <div style="position:absolute;left:88px;right:88px;top:50%;transform:translateY(-50%);
    z-index:20;text-align:center;">
    <div style="font-size:19px;font-weight:900;letter-spacing:0.2em;color:{MUTE};
      margin-bottom:28px;">{card['kicker']}</div>
    <div style="font-size:{fit_size(card['main'], 860, 78)}px;font-weight:950;
      color:{TEXT};line-height:1.05;">{esc(card['main'])}</div>
    <div style="margin-top:28px;font-size:27px;font-weight:650;
      color:rgba(255,255,255,0.78);line-height:1.42;word-break:keep-all;">
      {esc(card['sub'])}</div>
    <div style="display:inline-block;margin-top:44px;padding:20px 40px;
      background:{LINES['2']};color:#FFFFFF;font-size:29px;font-weight:900;
      letter-spacing:0.06em;">EPICKOR.COM</div>
  </div>
  {watermark()}'''

    COL = 452

    time_block = f'''
    <div style="margin-top:26px;display:flex;align-items:baseline;gap:12px;">
      <div style="font-size:{fit_size(card['time'], COL, 62)}px;font-weight:950;
        color:{LINES['2']};line-height:1.0;letter-spacing:-0.02em;">{card['time']}</div>
    </div>
    <div style="margin-top:8px;font-size:17px;font-weight:800;letter-spacing:0.12em;
      color:{MUTE};text-transform:uppercase;">TIME IT ACTUALLY TAKES</div>''' if card['time'] else ''

    stay = f'''
    <div style="display:inline-block;margin-top:20px;padding:8px 16px;
      border:2px solid {FAINT};font-size:17px;font-weight:900;letter-spacing:0.1em;
      color:{TEXT};text-transform:uppercase;">{card['stay']}</div>''' if card['stay'] else ''

    note = f'''
    <div style="margin-top:22px;padding-left:18px;border-left:4px solid {LINES['3']};
      font-size:22px;font-weight:700;color:{TEXT};line-height:1.36;
      word-break:keep-all;">{esc(card['note'])}</div>''' if card['note'] else ''

    return f'''
  <div style="position:absolute;inset:0;background:{GROUND};"></div>
  <div style="position:absolute;right:72px;top:150px;width:404px;height:600px;z-index:16;
    overflow:hidden;border:1px solid {FAINT};">
    <img src="{card['image']}" alt="{card['image_label']}"
      style="width:100%;height:100%;object-fit:cover;display:block;">
  </div>
  <div style="position:absolute;right:72px;top:768px;width:404px;z-index:16;
    font-size:15px;font-weight:800;letter-spacing:0.08em;color:{MUTE};
    text-transform:uppercase;line-height:1.4;">{card['image_label']}</div>
  <div style="position:absolute;left:72px;width:{COL}px;top:150px;height:600px;z-index:20;
    display:flex;flex-direction:column;justify-content:center;">
    <div style="margin-bottom:20px;">{roundels(card['lines'])}</div>
    <div style="font-size:{fit_size(card['name_ko'], COL, 86)}px;font-weight:950;
      color:{TEXT};line-height:1.05;letter-spacing:-0.02em;">{esc(card['name_ko'])}</div>
    <div style="margin-top:10px;font-size:{fit_size(card['name_en'], COL, 44)}px;
      font-weight:900;color:{MUTE};line-height:1.08;letter-spacing:0.04em;
      text-transform:uppercase;">{esc(card['name_en'])}</div>
    {time_block}
    <div style="margin-top:22px;font-size:23px;font-weight:650;color:{MUTE};
      line-height:1.42;word-break:keep-all;">{esc(card['sub'])}</div>
    {note}
    {stay}
  </div>
  {foot(card, index, total)}
  {watermark()}'''


SHELL = '''<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=1080"><style>
 * {{ margin:0; padding:0; box-sizing:border-box; }}
 body {{ width:1080px; height:1080px; overflow:hidden; background:{ground};
   font-family:{sans}; -webkit-font-smoothing:antialiased; }}
 .card {{ width:1080px; height:1080px; position:relative; overflow:hidden; }}
</style></head><body><div class="card">{body}</div></body></html>'''


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--slug', required=True)
    args = ap.parse_args()

    base = ROOT / 'output/cardnews'
    matches = sorted(p for p in base.glob(f'????-??-??_{args.slug}') if p.is_dir())
    out_dir = matches[-1] if matches else base / args.slug
    script = out_dir / 'script.md'
    if not script.exists():
        print('script.md not found:', script)
        sys.exit(1)

    meta, cards = parse_script(script)
    total = len(cards)
    print(f'{total} cards -> {out_dir}')

    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1080, 'height': 1080})
        for i, card in enumerate(cards, start=1):
            html = SHELL.format(ground=GROUND, sans=SANS, body=build(card, i, total))
            html_path = out_dir / f'card_{i:02d}.html'
            html_path.write_text(html, encoding='utf-8')
            page.goto(html_path.as_uri())
            page.wait_for_timeout(420)
            page.screenshot(path=str(out_dir / f'card_{i:02d}.png'))
            print(f'  card_{i:02d}.png  {(card.get("name_ko") or card.get("main",""))[:34]}')
        browser.close()


if __name__ == '__main__':
    main()
