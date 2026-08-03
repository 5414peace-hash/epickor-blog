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

Layout revision, 2026-08-03. The first cut anchored the text block to the top,
floated a 372px photo square beside it and pinned the heat bar near the bottom.
Everything below the photo and above the bar was empty — roughly a third of the
frame carrying nothing, which reads as an unfinished card rather than as space.
Now the frame is divided with no remainder: a left text column and a right
column holding the photograph with the note beneath it, both running the full
height, over a dark footer band that carries the scale. The photo panel is
close to square because the products are shot as flat-lays; a tall panel would
crop the sachets out of the very pictures that make the argument.

The product name is fitted to the column rather than set at a fixed size. A
fixed 56px silently overflowed ANSUNGTANGMYUN into the photograph, which is the
kind of fault that only shows up in the PNG, never in the markup.
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
            'name_ko': '', 'name_en': '', 'fit': 'cover',
        }
        for line in block.splitlines():
            s = line.strip()
            for key in ('kicker', 'image', 'image_label', 'shu', 'shu_label',
                        'note', 'mode', 'name_ko', 'name_en', 'fit'):
                if s.startswith(key + ':'):
                    card[key] = s.split(':', 1)[1].strip()
            if s.startswith('**Main:**'):
                card['main'] = s.replace('**Main:**', '').strip()
            elif s.startswith('**Sub:**'):
                card['sub'] = s.replace('**Sub:**', '').strip()
        if card['main'] or card['name_ko']:
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


FOOTER_TOP = 928


def fit_size(text, column_px, cap, factor=0.76):
    """Shrink a display line until its longest word fits the column.

    Measuring the longest *word* rather than the whole line is what matters: a
    line can wrap, a word cannot, and it is the unwrappable word that punches
    through the column edge into whatever sits beside it. ANSUNGTANGMYUN is the
    worst case in this batch and is why the factor is measured rather than
    guessed — at 0.615 it still crossed into the photograph, because black-
    weight caps in this face run about 0.75em wide, not 0.6em.
    """
    words = [w for w in re.split(r'\s+|<br>', esc(text).replace('<br>', ' ')) if w]
    longest = max((len(w) for w in words), default=1)
    return max(30, min(cap, int(column_px / (longest * factor))))


def heat_bar(shu, index, total):
    """The scale, carried in a dark footer band across the foot of every card.

    Drawn even at zero. An empty bar on the Chapaghetti card is not a missing
    element — no chili is the fact that card exists to state, and the bar says
    it without a word.
    """
    try:
        value = int(str(shu or 0).replace(',', ''))
    except ValueError:
        value = 0
    pct = min(100.0, value / MAX_SHU * 100)
    return f'''
  <div style="position:absolute;left:0;right:0;top:{FOOTER_TOP}px;bottom:0;
    background:{INK};z-index:22;padding:36px 88px 0;">
    <div style="height:20px;border:2px solid rgba(255,255,255,0.85);
      background:rgba(255,255,255,0.10);position:relative;">
      <div style="position:absolute;left:0;top:0;bottom:0;width:{pct:.1f}%;
        background:linear-gradient(90deg,#F2B705 0%,{HEAT} 100%);"></div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;
      margin-top:14px;font-size:18px;font-weight:800;
      color:rgba(255,255,255,0.72);letter-spacing:0.05em;">
      <span>0 SHU</span>
      <span>{MAX_SHU:,} SHU — hottest official Buldak</span>
      <span style="color:#FFFFFF;">{index:02d} / {total:02d}</span>
    </div>
  </div>'''


def right_column(card):
    """The product panel.

    Two fits, and the difference matters. A retail pack shot is `contain` on
    white: cropping a packet to fill the frame cuts the brand mark off the very
    thing the card is naming, and the packet is the evidence. A photograph is
    `cover`: letterboxing one onto white reads as a mistake, not as product
    photography. The script says which, per card.
    """
    if not card['image']:
        return ''
    contain = card['fit'] == 'contain'
    inner = ('max-width:100%;max-height:100%;object-fit:contain;'
             if contain else 'width:100%;height:100%;object-fit:cover;')
    return f'''
  <div style="position:absolute;left:580px;right:80px;top:126px;
    height:604px;z-index:16;border:4px solid {INK};overflow:hidden;
    background:{'#FFFFFF' if contain else '#DED8CE'};
    box-shadow:14px 14px 0 rgba(22,20,18,0.10);
    display:flex;align-items:center;justify-content:center;
    padding:{'26px' if contain else '0'};">
    <img src="{card['image']}" alt="{card['image_label']}"
      style="{inner}display:block;">
  </div>
  <div style="position:absolute;left:580px;right:80px;top:752px;
    z-index:16;font-size:16px;font-weight:800;letter-spacing:0.08em;
    color:{MUTE};text-transform:uppercase;line-height:1.35;">
    {card['image_label']}</div>'''


def build(card, index, total):
    kicker = f'''<div style="font-size:18px;font-weight:900;letter-spacing:0.18em;
      color:{HEAT};margin-bottom:14px;">{card['kicker']}</div>''' if card['kicker'] else ''

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

  <div style="position:absolute;left:104px;right:104px;top:132px;height:470px;
    z-index:20;display:flex;flex-direction:column;align-items:center;
    justify-content:center;text-align:center;overflow:hidden;">
    <div style="font-size:20px;font-weight:900;letter-spacing:0.2em;
      color:{HEAT};margin-bottom:24px;">{card['kicker']}</div>
    <div style="font-size:{fit_size(card['main'], 872, 78)}px;font-weight:950;
      color:{INK};line-height:1.04;letter-spacing:-0.02em;">{esc(card['main'])}</div>
    <div style="margin-top:26px;max-width:790px;font-size:26px;font-weight:650;
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
        # Backed with a photograph rather than left as a flat dark screen. A
        # plain black end card reads as the carousel running out rather than
        # finishing, and this batch can afford a picture on all seven.
        backdrop = f'''
  <img src="{card['image']}" alt="{card['image_label']}"
    style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
    display:block;opacity:0.34;z-index:2;">
  <div style="position:absolute;inset:0;z-index:3;
    background:linear-gradient(180deg,rgba(22,20,18,0.72) 0%,rgba(22,20,18,0.88) 100%);"></div>
''' if card['image'] else ''
        return f'''
  <div style="position:absolute;inset:0;background:{INK};"></div>
  {backdrop}
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

    # The product card, ordered as the representative specified on 2026-08-03:
    # Korean name large at the top left, the romanised name under it (allowed
    # to break over two lines rather than shrink to fit), then the heat figure
    # large, then the prose. One column, read straight down — the earlier
    # split-column version scattered the same information across the card and
    # made the reader hunt for the number.
    COL = 468

    shu_block = ''
    if card['shu']:
        text = shu_display(card['shu'])
        size = max(96, min(158, int((COL - 78) / (len(text) * 0.58))))
        shu_block = f'''
    <div style="display:flex;align-items:baseline;gap:12px;margin-top:26px;">
      <div style="font-size:{size}px;font-weight:950;color:{HEAT};line-height:0.86;
        letter-spacing:-0.03em;">{text}</div>
      <div style="font-size:29px;font-weight:900;color:{INK};">SHU</div>
    </div>'''
    elif card['shu_label']:
        shu_block = f'''
    <div style="margin-top:26px;font-size:{fit_size(card['shu_label'], COL, 96)}px;
      font-weight:950;color:{COOL};line-height:1.0;">{card['shu_label']}</div>'''

    # Cards that name a product lead with the Korean; the two that make an
    # argument rather than name a packet fall back to their headline in the
    # same slot, so the set keeps one shape.
    headline = card['name_ko'] or card['main']
    name_ko = f'''
    <div style="font-size:{fit_size(headline, COL, 86)}px;font-weight:950;
      color:{INK};line-height:1.04;letter-spacing:-0.02em;">{esc(headline)}</div>
    ''' if headline else ''

    # The English name is allowed to run to two lines on an explicit break
    # rather than shrink — ANSUNGTANGMYUN set small enough to fit on one line
    # would be smaller than the body copy underneath it.
    name_en = f'''
    <div style="margin-top:10px;font-size:{fit_size(card['name_en'], COL, 46)}px;
      font-weight:900;color:{MUTE};line-height:1.08;letter-spacing:0.02em;
      text-transform:uppercase;">{esc(card['name_en'])}</div>
    ''' if card['name_en'] else ''

    note = f'''
    <div style="margin-top:20px;padding-left:18px;border-left:5px solid {INK};
      font-size:23px;font-weight:700;color:{INK};line-height:1.34;
      word-break:keep-all;">{esc(card['note'])}</div>''' if card['note'] else ''

    return f'''
  <div style="position:absolute;inset:0;background:{PAPER};"></div>
  {right_column(card)}
  <div style="position:absolute;left:80px;width:{COL}px;top:126px;
    height:{FOOTER_TOP - 166}px;z-index:20;display:flex;flex-direction:column;
    justify-content:center;">
    {kicker}
    {name_ko}
    {name_en}
    {shu_block}
    <div style="margin-top:26px;font-size:24px;font-weight:650;color:{MUTE};
      line-height:1.4;word-break:keep-all;">{esc(card['sub'])}</div>
    {note}
  </div>
  {heat_bar(card['shu'], index, total)}
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
