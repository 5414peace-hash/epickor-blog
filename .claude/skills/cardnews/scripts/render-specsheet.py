#!/usr/bin/env python3
"""
Card renderer for the "Spec Sheet" visual system — the Korean Makers batch.

Why not reuse the previous renderers: the house rule since 2026-07-20 is that
every batch designs its own direction. The ramyun batch argued about a scale
(paper ground, one numeral, heat bar); the convenience-store batch argued about
price (shelf tag, barcode foot); the Seoul batch argued about place (station
sign). This batch argues about *manufacturing* — six Korean factories behind
global products — and the object that already carries that argument is the
engineering sheet: graph-paper ground, a drawing frame with corner ticks, a
red inspection stamp, and a title block along the foot instead of a barcode.

Everything hangs on that metaphor:
- ground: fine graph grid on near-white, the opposite pole from the dark batch
- product panel: white field inside a thin ink frame with drawing-corner ticks;
  official white-background manufacturer cutouts sit on it natively
- one enormous spec numeral per card where the argument is a number
- a rotated red stamp (MADE IN KOREA / EST. 1955 / VERIFIED) as the accent
- foot: an engineering title block — ruled cells, not a barcode

Layout honours the standing card rules: EPICKOR.COM on every card, card 01
hook centred in the profile-grid safe area, product cards declare name_ko /
name_en, image_label records what the photo actually shows.
"""

import argparse
import io
import re
import sys
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

SCRIPT_DIR = Path(__file__).parent
ROOT = (SCRIPT_DIR / '../../../../').resolve()

PAPER = '#F7F6F2'
GRID_MINOR = 'rgba(28,32,38,0.055)'
GRID_MAJOR = 'rgba(28,32,38,0.11)'
INK = '#1C2026'
CARD = '#FFFFFF'
STAMP = '#C8271E'
MUTE = 'rgba(28,32,38,0.56)'
RULE = 'rgba(28,32,38,0.24)'

MONO = "'Consolas','DejaVu Sans Mono','Courier New',monospace"
SANS = "'Segoe UI',Arial,'Noto Sans KR','Malgun Gothic',sans-serif"

FOOT_TOP = 972


def esc(text):
    return (text or '').replace('\\n', '<br>')


def fit_size(text, column_px, cap, factor=0.74):
    words = [w for w in re.split(r'\s+|<br>', esc(text).replace('<br>', ' ')) if w]
    if not words:
        return cap
    def width(word):
        han = sum(1 for c in word if '가' <= c <= '힣')
        return han * 1.02 + (len(word) - han) * factor
    widest = max(width(w) for w in words) or 1
    return max(26, min(cap, int(column_px / widest)))


def parse_script(path):
    text = Path(path).read_text(encoding='utf-8')
    blocks = re.split(r'^## Card \d+', text, flags=re.MULTILINE)
    meta = {}
    for line in blocks[0].splitlines():
        if ':' in line and not line.startswith('#'):
            k, _, v = line.partition(':')
            meta[k.strip()] = v.strip().strip('"')

    keys = ('kicker', 'image', 'image_label', 'name_ko', 'name_en', 'num',
            'num_label', 'stamp', 'note', 'mode', 'fit', 'accent')
    cards = []
    for block in blocks[1:]:
        card = {k: '' for k in keys}
        card['mode'] = 'item'
        card['fit'] = 'contain'
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
        if card.get('main') or card['name_ko'] or card['num']:
            cards.append(card)
    return meta, cards


def grid_ground():
    """Graph paper: minor lines every 24px, major every 120px."""
    return f'''
  <div style="position:absolute;inset:0;background:{PAPER};"></div>
  <div style="position:absolute;inset:0;z-index:1;background-image:
    linear-gradient({GRID_MINOR} 1px, transparent 1px),
    linear-gradient(90deg,{GRID_MINOR} 1px, transparent 1px),
    linear-gradient({GRID_MAJOR} 1px, transparent 1px),
    linear-gradient(90deg,{GRID_MAJOR} 1px, transparent 1px);
    background-size:24px 24px,24px 24px,120px 120px,120px 120px;"></div>'''


def corner_ticks(left, top, w, h, z=18):
    """Drawing-frame corner marks around a rectangle."""
    t = 26
    common = f'position:absolute;z-index:{z};width:{t}px;height:{t}px;border-color:{INK};border-style:solid;'
    return f'''
  <div style="{common}left:{left-6}px;top:{top-6}px;border-width:3px 0 0 3px;"></div>
  <div style="{common}left:{left+w-t+6}px;top:{top-6}px;border-width:3px 3px 0 0;"></div>
  <div style="{common}left:{left-6}px;top:{top+h-t+6}px;border-width:0 0 3px 3px;"></div>
  <div style="{common}left:{left+w-t+6}px;top:{top+h-t+6}px;border-width:0 3px 3px 0;"></div>'''


def stamp(text, accent=STAMP, rot=-7, size=21):
    if not text:
        return ''
    return f'''
    <div style="display:inline-block;transform:rotate({rot}deg);border:4px solid {accent};
      color:{accent};font-family:{MONO};font-weight:900;font-size:{size}px;
      letter-spacing:0.18em;padding:9px 18px;border-radius:5px;
      box-shadow:inset 0 0 0 2px rgba(200,39,30,0.0);opacity:0.92;">{text}</div>'''


def watermark(no):
    return f'''
  <div style="position:absolute;left:44px;top:34px;z-index:30;display:flex;
    align-items:center;gap:12px;">
    <div style="width:30px;height:30px;border:2.5px solid {INK};display:flex;
      align-items:center;justify-content:center;font-size:12px;font-weight:900;
      color:{INK};background:{CARD};">EK</div>
    <div style="font-size:14px;font-weight:900;letter-spacing:0.22em;color:{INK};">
      EPICKOR.COM</div>
  </div>
  <div style="position:absolute;right:44px;top:34px;z-index:30;font-family:{MONO};
    font-size:14px;font-weight:800;letter-spacing:0.14em;color:{MUTE};">{no}</div>'''


def title_block(meta, card, index, total):
    """The engineering title block: ruled cells along the foot."""
    cells = [
        ('SERIES', meta.get('series', 'KOREAN MAKERS')),
        ('SUBJECT', meta.get('subject', '')),
        ('CHECKED', meta.get('checked', 'AUG 2026')),
        ('SHEET', f'{index:02d} / {total:02d}'),
    ]
    tds = ''.join(
        f'''<div style="flex:{2 if i==1 else 1};border-left:{'' if i==0 else f'2px solid {INK}'};
          padding:10px 18px 12px;display:flex;flex-direction:column;justify-content:center;">
          <div style="font-family:{MONO};font-size:11px;font-weight:800;color:{MUTE};
            letter-spacing:0.16em;">{k}</div>
          <div style="font-family:{MONO};font-size:17px;font-weight:900;color:{INK};
            letter-spacing:0.05em;white-space:nowrap;overflow:hidden;">{v}</div>
        </div>''' for i, (k, v) in enumerate(cells))
    return f'''
  <div style="position:absolute;left:44px;right:44px;top:{FOOT_TOP}px;height:64px;
    background:{CARD};border:3px solid {INK};z-index:26;display:flex;">{tds}</div>'''


def photo_panel(card, left, top, w, h, pad=26):
    if not card['image']:
        return ''
    contain = card['fit'] != 'cover'
    inner = ('max-width:100%;max-height:100%;object-fit:contain;'
             if contain else 'width:100%;height:100%;object-fit:cover;')
    return f'''
  <div style="position:absolute;left:{left}px;top:{top}px;width:{w}px;height:{h}px;
    z-index:14;background:{CARD};border:3px solid {INK};overflow:hidden;
    display:flex;align-items:center;justify-content:center;
    padding:{pad if contain else 0}px;">
    <img src="{card['image']}" alt="{card['image_label']}" style="{inner}display:block;">
  </div>
  {corner_ticks(left, top, w, h)}
  <div style="position:absolute;left:{left}px;top:{top+h+12}px;width:{w}px;z-index:14;
    font-family:{MONO};font-size:15px;font-weight:700;letter-spacing:0.06em;
    color:{MUTE};text-transform:uppercase;line-height:1.4;">{card['image_label']}</div>'''


def build(meta, card, index, total):
    accent = card['accent'] or meta.get('accent', STAMP)
    no = f"NO. {meta.get('doc', 'KM')}-{index:02d}"

    if card['mode'] == 'cover':
        # centred hook inside the profile-grid safe area; product contained below.
        # The stamp sits pinned across the panel's top-right corner like a real
        # inspection mark — clipping the frame, never the product.
        return f'''
  {grid_ground()}
  {photo_panel(card, 300, 560, 480, 340, pad=20)}
  <div style="position:absolute;left:672px;top:586px;z-index:24;">
    {stamp(card['stamp'], accent, rot=8, size=19)}
  </div>
  <div style="position:absolute;left:110px;right:110px;top:132px;z-index:20;
    text-align:center;">
    <div style="display:inline-block;font-family:{MONO};font-size:18px;font-weight:800;
      letter-spacing:0.2em;color:{accent};border:2.5px solid {accent};
      padding:7px 16px;margin-bottom:26px;background:{CARD};">{card['kicker']}</div>
    <div style="font-size:{fit_size(card['main'], 820, 84)}px;font-weight:950;color:{INK};
      line-height:1.04;letter-spacing:-0.02em;word-break:keep-all;">{esc(card['main'])}</div>
    <div style="margin-top:22px;font-size:26px;font-weight:650;color:{MUTE};
      line-height:1.4;word-break:keep-all;max-width:760px;margin-left:auto;
      margin-right:auto;">{esc(card['sub'])}</div>
  </div>
  {title_block(meta, card, index, total)}
  {watermark(no)}'''

    if card['mode'] == 'number':
        # one enormous spec numeral, no photo
        return f'''
  {grid_ground()}
  <div style="position:absolute;left:88px;right:88px;top:170px;z-index:20;">
    <div style="font-family:{MONO};font-size:19px;font-weight:800;letter-spacing:0.18em;
      color:{accent};">{card['kicker']}</div>
    <div style="margin-top:36px;font-size:{fit_size(card['num'], 900, 300, 0.62)}px;
      font-weight:950;color:{INK};line-height:0.98;letter-spacing:-0.04em;
      font-variant-numeric:tabular-nums;">{esc(card['num'])}</div>
    <div style="margin-top:20px;font-size:33px;font-weight:900;color:{INK};
      line-height:1.2;word-break:keep-all;">{esc(card['num_label'])}</div>
    <div style="margin-top:26px;padding-top:22px;border-top:2px dotted {RULE};
      max-width:820px;font-size:25px;font-weight:650;color:{MUTE};line-height:1.45;
      word-break:keep-all;">{esc(card['sub'])}</div>
    <div style="margin-top:30px;">{stamp(card['stamp'], accent)}</div>
  </div>
  {title_block(meta, card, index, total)}
  {watermark(no)}'''

    if card['mode'] == 'end':
        return f'''
  {grid_ground()}
  {photo_panel(card, 300, 470, 480, 330, pad=20)}
  <div style="position:absolute;left:100px;right:100px;top:140px;z-index:20;
    text-align:center;">
    <div style="display:inline-block;font-family:{MONO};font-size:18px;font-weight:800;
      letter-spacing:0.2em;color:{accent};border:2.5px solid {accent};
      padding:7px 16px;margin-bottom:24px;background:{CARD};">{card['kicker']}</div>
    <div style="font-size:{fit_size(card['main'], 800, 68)}px;font-weight:950;color:{INK};
      line-height:1.06;word-break:keep-all;">{esc(card['main'])}</div>
    <div style="margin-top:18px;font-size:25px;font-weight:650;color:{MUTE};
      line-height:1.42;word-break:keep-all;">{esc(card['sub'])}</div>
  </div>
  <div style="position:absolute;left:0;right:0;top:852px;z-index:22;text-align:center;">
    <div style="display:inline-block;padding:20px 44px;background:{STAMP};color:#FFFFFF;
      font-size:30px;font-weight:900;letter-spacing:0.08em;">EPICKOR.COM</div>
  </div>
  {title_block(meta, card, index, total)}
  {watermark(no)}'''

    # default: item — text column left, photo panel right
    COL = 452
    kicker = f'''
    <div style="font-family:{MONO};font-size:17px;font-weight:800;letter-spacing:0.16em;
      color:{accent};margin-bottom:14px;">{card['kicker']}</div>''' if card['kicker'] else ''

    name_block = ''
    if card['name_en']:
        name_block += f'''
    <div style="font-size:{fit_size(card['name_en'], COL, 62)}px;font-weight:950;color:{INK};
      line-height:1.05;letter-spacing:-0.015em;word-break:keep-all;">{esc(card['name_en'])}</div>'''
    if card['name_ko']:
        name_block += f'''
    <div style="margin-top:10px;font-size:{fit_size(card['name_ko'], COL, 40)}px;
      font-weight:900;color:{MUTE};line-height:1.1;word-break:keep-all;">{esc(card['name_ko'])}</div>'''
    if not name_block and card.get('main'):
        name_block = f'''
    <div style="font-size:{fit_size(card['main'], COL, 58)}px;font-weight:950;color:{INK};
      line-height:1.08;word-break:keep-all;">{esc(card['main'])}</div>'''

    num_block = ''
    if card['num']:
        num_block = f'''
    <div style="margin-top:24px;font-size:{fit_size(card['num'], COL, 104, 0.62)}px;
      font-weight:950;color:{accent};line-height:1.0;letter-spacing:-0.03em;
      font-variant-numeric:tabular-nums;">{esc(card['num'])}</div>'''
        if card['num_label']:
            num_block += f'''
    <div style="margin-top:8px;font-family:{MONO};font-size:17px;font-weight:800;
      color:{INK};letter-spacing:0.08em;">{esc(card['num_label'])}</div>'''

    note = f'''
    <div style="margin-top:20px;padding-top:18px;border-top:2px dotted {RULE};
      font-size:22px;font-weight:700;color:{INK};line-height:1.38;
      word-break:keep-all;">{esc(card['note'])}</div>''' if card['note'] else ''

    stamp_block = f'''
    <div style="margin-top:24px;">{stamp(card['stamp'], accent, rot=-5, size=18)}</div>''' if card['stamp'] else ''

    return f'''
  {grid_ground()}
  {photo_panel(card, 576, 140, 452, 640)}
  <div style="position:absolute;left:64px;width:{COL}px;top:150px;height:700px;z-index:20;
    display:flex;flex-direction:column;justify-content:center;">
    {kicker}
    {name_block}
    {num_block}
    <div style="margin-top:22px;font-size:23px;font-weight:650;color:{MUTE};
      line-height:1.44;word-break:keep-all;">{esc(card['sub'])}</div>
    {note}
    {stamp_block}
  </div>
  {title_block(meta, card, index, total)}
  {watermark(no)}'''


SHELL = '''<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=1080"><style>
 * {{ margin:0; padding:0; box-sizing:border-box; }}
 body {{ width:1080px; height:1080px; overflow:hidden; background:{paper};
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
            html = SHELL.format(paper=PAPER, sans=SANS,
                                body=build(meta, card, i, total))
            html_path = out_dir / f'card_{i:02d}.html'
            html_path.write_text(html, encoding='utf-8')
            page.goto(html_path.as_uri())
            page.wait_for_timeout(420)
            page.screenshot(path=str(out_dir / f'card_{i:02d}.png'))
            print(f'  card_{i:02d}.png  {(card.get("name_en") or card.get("main",""))[:40]}')
        browser.close()


if __name__ == '__main__':
    main()
