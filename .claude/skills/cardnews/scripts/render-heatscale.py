#!/usr/bin/env python3
"""
Card renderer for the "Heat Scale" visual system.

Why a separate renderer: html-to-png.py's layouts A–F are all variations of
text over a dark-veiled photograph. This batch is about numbers — Scoville
figures that only mean something next to each other — and a veil-and-headline
template cannot show a scale. The house rule since 2026-07-20 is that when the
existing layouts cannot express a batch's direction, you extend or write a new
renderer rather than falling back to the default template.

The system: paper-white ground, one enormous numeral per card, a heat bar that
fills further as the carousel progresses, and the photograph held in a framed
panel rather than washed out behind text. Deliberately the opposite of the dark
veil, so this carousel does not look like every other one in the grid.

Output is 1080x1080 PNG, same as the main renderer, with the same EPICKOR.COM
watermark requirement.
"""

import argparse
import io
import re
import sys
from pathlib import Path

# Windows consoles default to cp949 here and card copy contains characters it
# cannot encode. Without this the render dies on a print, not on the artwork.
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

SCRIPT_DIR = Path(__file__).parent
ROOT = (SCRIPT_DIR / '../../../../').resolve()

# The hottest official Buldak. Bars are drawn against it so the carousel's
# whole argument — that the famous one is not extreme — is visible, not stated.
MAX_SHU = 13200

INK = '#161412'
PAPER = '#F7F4EE'
HEAT = '#E2481C'
COOL = '#2F6F5B'
MUTE = 'rgba(22,20,18,0.55)'


def parse_script(path):
    text = Path(path).read_text(encoding='utf-8')
    blocks = re.split(r'^## Card \d+', text, flags=re.MULTILINE)
    header = blocks[0]
    meta = {}
    for line in header.splitlines():
        if ':' in line and not line.startswith('#'):
            k, _, v = line.partition(':')
            meta[k.strip()] = v.strip().strip('"')

    cards = []
    for block in blocks[1:]:
        card = {
            'kicker': '', 'main': '', 'sub': '', 'image': '', 'image_label': '',
            'shu': '', 'shu_label': '', 'note': '', 'mode': 'scale',
        }
        for line in block.splitlines():
            s = line.strip()
            for key in ('kicker', 'image', 'image_label', 'shu', 'shu_label', 'note', 'mode'):
                if s.startswith(key + ':'):
                    card[key] = s.split(':', 1)[1].strip()
            if s.startswith('**Main:**'):
                card['main'] = s.replace('**Main:**', '').strip()
            elif s.startswith('**Sub:**'):
                card['sub'] = s.replace('**Sub:**', '').strip()
        if card['main']:
            cards.append(card)
    return meta, cards


def esc(text):
    return (text or '').replace('\\n', '<br>')


def shu_display(shu):
    """Scoville figures need a thousands separator — 3400 on a card reads as a
    year before it reads as a measurement."""
    try:
        return f'{int(str(shu).replace(",", "")):,}'
    except ValueError:
        return str(shu)


def watermark():
    return f'''
  <div style="position:absolute;top:38px;left:48px;z-index:30;
    display:flex;align-items:center;gap:12px;color:{MUTE};">
    <div style="width:30px;height:30px;border:2px solid rgba(22,20,18,0.42);
      display:flex;align-items:center;justify-content:center;
      font-size:12px;font-weight:900;">EK</div>
    <div style="font-size:12px;font-weight:900;letter-spacing:0.2em;">EPICKOR.COM</div>
  </div>'''


def heat_bar(shu):
    """Full-width scale with the card's value marked on it."""
    if not shu:
        return ''
    try:
        value = int(str(shu).replace(',', ''))
    except ValueError:
        return ''
    pct = max(2.0, min(100.0, value / MAX_SHU * 100))
    return f'''
  <div style="position:absolute;left:96px;right:96px;bottom:150px;z-index:20;">
    <div style="height:22px;border:3px solid {INK};background:#FFFFFF;position:relative;">
      <div style="position:absolute;left:0;top:0;bottom:0;width:{pct}%;
        background:linear-gradient(90deg,#F2B705 0%,{HEAT} 100%);"></div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:12px;
      font-size:19px;font-weight:800;color:{MUTE};letter-spacing:0.04em;">
      <span>0 SHU</span><span>{MAX_SHU:,} SHU — hottest official Buldak</span>
    </div>
  </div>'''


def photo_panel(card):
    if not card['image']:
        return ''
    return f'''
  <div style="position:absolute;right:88px;top:118px;width:372px;height:372px;
    border:4px solid {INK};overflow:hidden;background:#DED8CE;z-index:14;
    box-shadow:16px 16px 0 rgba(22,20,18,0.10);">
    <img src="{card['image']}" alt="{card['image_label']}"
      style="width:100%;height:100%;object-fit:cover;display:block;">
  </div>'''


def build(card, index, total):
    kicker = f'''<div style="font-size:20px;font-weight:900;letter-spacing:0.2em;
      color:{HEAT};margin-bottom:26px;">{card['kicker']}</div>''' if card['kicker'] else ''

    if card['mode'] == 'cover':
        # Card 01 doubles as the Instagram profile-grid thumbnail, so the hook
        # is centred inside a conservative safe area rather than set against an
        # edge — at grid size a left-aligned block loses its first word to the
        # crop. The photograph becomes a full-width band along the bottom,
        # which keeps the composition centred without abandoning the system.
        return f'''
  <div style="position:absolute;inset:0;background:{PAPER};"></div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:300px;
    overflow:hidden;background:#DED8CE;z-index:10;
    border-top:5px solid {INK};">
    <img src="{card['image']}" alt="{card['image_label']}"
      style="width:100%;height:100%;object-fit:cover;display:block;">
  </div>

  <div style="position:absolute;left:110px;right:110px;top:150px;height:440px;
    z-index:20;display:flex;flex-direction:column;align-items:center;
    justify-content:center;text-align:center;overflow:hidden;">
    <div style="font-size:20px;font-weight:900;letter-spacing:0.2em;
      color:{HEAT};margin-bottom:24px;">{card['kicker']}</div>
    <div style="font-size:78px;font-weight:950;color:{INK};line-height:1.02;
      letter-spacing:-0.02em;">{esc(card['main'])}</div>
    <div style="margin-top:26px;max-width:760px;font-size:27px;font-weight:650;
      color:{MUTE};line-height:1.38;word-break:keep-all;">{esc(card['sub'])}</div>
  </div>

  <div style="position:absolute;left:96px;right:96px;bottom:352px;z-index:20;">
    <div style="height:22px;border:3px solid {INK};background:#FFFFFF;position:relative;">
      <div style="position:absolute;left:0;top:0;bottom:0;
        width:{max(2.0, min(100.0, int(str(card['shu'] or 0).replace(',', '') or 0) / MAX_SHU * 100)):.1f}%;
        background:linear-gradient(90deg,#F2B705 0%,{HEAT} 100%);"></div>
    </div>
    <div style="display:flex;justify-content:space-between;margin-top:12px;
      font-size:19px;font-weight:800;color:{MUTE};">
      <span>0 SHU</span><span>SWIPE →</span>
    </div>
  </div>
  {watermark()}'''

    if card['mode'] == 'end':
        return f'''
  <div style="position:absolute;inset:0;background:{INK};"></div>
  <div style="position:absolute;left:96px;right:96px;top:50%;transform:translateY(-50%);
    z-index:20;text-align:center;">
    <div style="font-size:20px;font-weight:900;letter-spacing:0.2em;
      color:#F2B705;margin-bottom:30px;">{card['kicker']}</div>
    <div style="font-size:80px;font-weight:950;color:#FFFFFF;line-height:1.02;">
      {esc(card['main'])}</div>
    <div style="margin-top:32px;font-size:29px;font-weight:650;
      color:rgba(255,255,255,0.78);line-height:1.4;word-break:keep-all;">
      {esc(card['sub'])}</div>
    <div style="display:inline-block;margin-top:48px;padding:20px 40px;
      background:{HEAT};color:#FFFFFF;font-size:30px;font-weight:900;
      letter-spacing:0.06em;">EPICKOR.COM</div>
  </div>
  <div style="position:absolute;top:38px;left:48px;z-index:30;
    display:flex;align-items:center;gap:12px;color:rgba(255,255,255,0.62);">
    <div style="width:30px;height:30px;border:2px solid rgba(255,255,255,0.42);
      display:flex;align-items:center;justify-content:center;
      font-size:12px;font-weight:900;">EK</div>
    <div style="font-size:12px;font-weight:900;letter-spacing:0.2em;">EPICKOR.COM</div>
  </div>'''

    # Default: the scale card. One number, big.
    shu_block = ''
    if card['shu']:
        # Six-character figures like 13,200 run into the photo panel at the
        # display size that suits four-character ones, so the type scales down
        # rather than the panel moving — the panel position is what keeps the
        # cards reading as a set.
        text = shu_display(card['shu'])
        size = 150 if len(text) <= 5 else 124
        shu_block = f'''
    <div style="display:flex;align-items:baseline;gap:14px;margin-top:8px;">
      <div style="font-size:{size}px;font-weight:950;color:{HEAT};line-height:0.9;
        letter-spacing:-0.03em;">{text}</div>
      <div style="font-size:32px;font-weight:900;color:{INK};">SHU</div>
    </div>'''
    elif card['shu_label']:
        shu_block = f'''
    <div style="font-size:96px;font-weight:950;color:{COOL};line-height:1.0;
      margin-top:8px;">{card['shu_label']}</div>'''

    note = f'''<div style="margin-top:26px;padding-left:20px;
      border-left:5px solid {INK};font-size:25px;font-weight:700;
      color:{INK};line-height:1.34;word-break:keep-all;">{esc(card['note'])}</div>''' if card['note'] else ''

    return f'''
  <div style="position:absolute;inset:0;background:{PAPER};"></div>
  {photo_panel(card)}
  <div style="position:absolute;left:88px;right:500px;top:140px;z-index:20;">
    {kicker}
    <div style="font-size:56px;font-weight:950;color:{INK};line-height:1.04;
      letter-spacing:-0.01em;">{esc(card['main'])}</div>
    {shu_block}
    <div style="margin-top:24px;font-size:26px;font-weight:650;color:{MUTE};
      line-height:1.38;word-break:keep-all;">{esc(card['sub'])}</div>
    {note}
  </div>
  {heat_bar(card['shu'])}
  <div style="position:absolute;right:96px;bottom:76px;z-index:20;
    font-size:20px;font-weight:900;color:{MUTE};letter-spacing:0.1em;">
    {index:02d} / {total:02d}</div>
  {watermark()}'''


SHELL = '''<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=1080"><style>
 * {{ margin:0; padding:0; box-sizing:border-box; }}
 body {{ width:1080px; height:1080px; overflow:hidden; background:{paper};
   font-family:'Segoe UI',Arial,'Noto Sans KR','Malgun Gothic',sans-serif;
   -webkit-font-smoothing:antialiased; }}
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
            html = SHELL.format(paper=PAPER, body=build(card, i, total))
            html_path = out_dir / f'card_{i:02d}.html'
            html_path.write_text(html, encoding='utf-8')
            page.goto('file:///' + str(html_path).replace('\\', '/'))
            page.wait_for_timeout(450)
            png = out_dir / f'card_{i:02d}.png'
            page.screenshot(path=str(png))
            print(f'  card_{i:02d}.png  {card["main"][:44]}')
        browser.close()


if __name__ == '__main__':
    main()
