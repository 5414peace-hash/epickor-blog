#!/usr/bin/env python3
"""
Card renderer for the "Shelf Tag" visual system — convenience store batch.

Why not reuse the Heat Scale renderer: the house rule since 2026-07-20 is that
every batch designs its own direction rather than repeating a template, because
a grid of identical carousels flattens the brand. The ramyun batch argued about
a *scale*, so it got a paper ground, one enormous numeral and a heat bar. This
batch argues about *price* — eight dated figures, each verified in a post — and
the object that already carries that argument in Korea is the shelf price tag
under the product: white card, black product name, the price in red, a barcode
along the bottom, and a coloured flash when there is a promotion.

So this system is: cold white rather than warm paper, a monospaced tabular
price rather than a display numeral, dotted leader rules rather than a gradient
bar, and a real barcode strip where the Heat Scale put its dark footer. Nothing
is shared with the other renderer except the 1080x1080 canvas and the
EPICKOR.COM watermark requirement.

Card order follows the representative's 2026-08-03 layout instruction, the same
as the ramyun rebuild: Korean name large at the top left, romanised name under
it (two lines where it needs them), then the figure large, then the copy.
"""

import argparse
import io
import re
import sys
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

SCRIPT_DIR = Path(__file__).parent
ROOT = (SCRIPT_DIR / '../../../../').resolve()

INK = '#141414'
CARD = '#FFFFFF'
FIELD = '#E4E4DF'
PRICE = '#D6151B'
FLASH = '#FFD400'
MUTE = 'rgba(20,20,20,0.55)'
RULE = 'rgba(20,20,20,0.22)'

MONO = "'Consolas','DejaVu Sans Mono','Courier New',monospace"
SANS = "'Segoe UI',Arial,'Noto Sans KR','Malgun Gothic',sans-serif"

FOOTER_TOP = 936


def parse_script(path):
    text = Path(path).read_text(encoding='utf-8')
    blocks = re.split(r'^## Card \d+', text, flags=re.MULTILINE)
    meta = {}
    for line in blocks[0].splitlines():
        if ':' in line and not line.startswith('#'):
            k, _, v = line.partition(':')
            meta[k.strip()] = v.strip().strip('"')

    keys = ('kicker', 'image', 'image_label', 'price', 'price_note', 'note',
            'mode', 'name_ko', 'name_en', 'fit', 'flash', 'as_of')
    cards = []
    for block in blocks[1:]:
        card = {k: '' for k in keys}
        card['mode'] = 'item'
        card['fit'] = 'cover'
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
    """Same measured factor as the Heat Scale renderer, for the same reason:
    a fixed display size silently pushes a long word into whatever sits beside
    it, and that only shows up in the PNG."""
    words = [w for w in re.split(r'\s+|<br>', esc(text).replace('<br>', ' ')) if w]
    longest = max((len(w) for w in words), default=1)
    return max(28, min(cap, int(column_px / (longest * factor))))


def barcode(seed):
    """A barcode strip, drawn rather than imported.

    It is the part of a Korean shelf tag everyone recognises without reading,
    and it does the job the Heat Scale's gradient bar did — giving every card a
    common foot so the set reads as one system. Widths are derived from the
    card text so no two cards carry an identical pattern; nothing is encoded,
    and nothing pretends to be a real product code.
    """
    bars = []
    value = sum(ord(c) for c in (seed or 'epickor')) or 7
    for i in range(58):
        value = (value * 1103515245 + 12345) % 2147483648
        w = 2 + (value >> 16) % 5
        gap = 2 + (value >> 8) % 3
        bars.append(f'<span style="display:inline-block;width:{w}px;height:100%;'
                    f'background:{INK};margin-right:{gap}px;"></span>')
    return ''.join(bars)


def watermark_rail(right_text):
    return f'''
  <div style="position:absolute;left:0;right:0;top:0;height:88px;background:{INK};
    z-index:30;display:flex;align-items:center;justify-content:space-between;
    padding:0 48px;">
    <div style="display:flex;align-items:center;gap:12px;color:#FFFFFF;">
      <div style="width:30px;height:30px;border:2px solid rgba(255,255,255,0.55);
        display:flex;align-items:center;justify-content:center;
        font-size:12px;font-weight:900;">EK</div>
      <div style="font-size:13px;font-weight:900;letter-spacing:0.2em;">EPICKOR.COM</div>
    </div>
    <div style="font-size:13px;font-weight:900;letter-spacing:0.14em;
      color:rgba(255,255,255,0.72);font-family:{MONO};">{right_text}</div>
  </div>'''


def foot(index, total, seed):
    return f'''
  <div style="position:absolute;left:0;right:0;top:{FOOTER_TOP}px;bottom:0;
    background:{CARD};border-top:3px solid {INK};z-index:22;
    display:flex;align-items:center;justify-content:space-between;
    padding:0 56px;">
    <div style="height:56px;display:flex;align-items:flex-end;overflow:hidden;
      width:520px;">{barcode(seed)}</div>
    <div style="font-family:{MONO};font-size:19px;font-weight:800;color:{MUTE};
      letter-spacing:0.1em;">{index:02d} / {total:02d}</div>
  </div>'''


def photo(card):
    if not card['image']:
        return ''
    contain = card['fit'] == 'contain'
    inner = ('max-width:100%;max-height:100%;object-fit:contain;'
             if contain else 'width:100%;height:100%;object-fit:cover;')
    return f'''
  <div style="position:absolute;left:576px;right:72px;top:150px;height:600px;
    z-index:16;border:3px solid {INK};overflow:hidden;background:{CARD};
    display:flex;align-items:center;justify-content:center;
    padding:{'22px' if contain else '0'};">
    <img src="{card['image']}" alt="{card['image_label']}" style="{inner}display:block;">
  </div>
  <div style="position:absolute;left:576px;right:72px;top:766px;z-index:16;
    font-family:{MONO};font-size:15px;font-weight:700;letter-spacing:0.06em;
    color:{MUTE};text-transform:uppercase;line-height:1.4;">
    {card['image_label']}</div>'''


def build(card, index, total, checked):
    seed = (card.get('name_ko') or card.get('main') or '') + str(index)

    if card['mode'] == 'cover':
        return f'''
  <div style="position:absolute;inset:0;background:{FIELD};"></div>
  <div style="position:absolute;left:0;right:0;bottom:0;height:352px;overflow:hidden;
    border-top:4px solid {INK};z-index:10;">
    <img src="{card['image']}" alt="{card['image_label']}"
      style="width:100%;height:100%;object-fit:cover;display:block;">
  </div>
  <div style="position:absolute;left:76px;right:76px;top:150px;height:460px;z-index:20;
    background:{CARD};border:4px solid {INK};box-shadow:16px 16px 0 rgba(20,20,20,0.14);
    display:flex;flex-direction:column;align-items:center;justify-content:center;
    text-align:center;padding:0 54px;overflow:hidden;">
    <div style="background:{FLASH};padding:8px 18px;font-size:19px;font-weight:900;
      letter-spacing:0.16em;color:{INK};margin-bottom:26px;">{card['kicker']}</div>
    <div style="font-size:{fit_size(card['main'], 800, 76)}px;font-weight:950;color:{INK};
      line-height:1.05;letter-spacing:-0.02em;">{esc(card['main'])}</div>
    <div style="margin-top:24px;max-width:740px;font-size:25px;font-weight:650;
      color:{MUTE};line-height:1.4;word-break:keep-all;">{esc(card['sub'])}</div>
  </div>
  {watermark_rail(checked)}'''

    if card['mode'] == 'end':
        return f'''
  <div style="position:absolute;inset:0;background:{INK};"></div>
  <img src="{card['image']}" alt="{card['image_label']}"
    style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
    opacity:0.30;z-index:2;">
  <div style="position:absolute;inset:0;z-index:3;
    background:linear-gradient(180deg,rgba(20,20,20,0.70),rgba(20,20,20,0.90));"></div>
  <div style="position:absolute;left:88px;right:88px;top:50%;transform:translateY(-50%);
    z-index:20;text-align:center;">
    <div style="display:inline-block;background:{FLASH};padding:8px 18px;font-size:19px;
      font-weight:900;letter-spacing:0.16em;color:{INK};margin-bottom:30px;">
      {card['kicker']}</div>
    <div style="font-size:{fit_size(card['main'], 860, 78)}px;font-weight:950;
      color:#FFFFFF;line-height:1.05;">{esc(card['main'])}</div>
    <div style="margin-top:30px;font-size:27px;font-weight:650;
      color:rgba(255,255,255,0.80);line-height:1.42;word-break:keep-all;">
      {esc(card['sub'])}</div>
    <div style="display:inline-block;margin-top:44px;padding:20px 40px;background:{PRICE};
      color:#FFFFFF;font-size:29px;font-weight:900;letter-spacing:0.06em;">
      EPICKOR.COM</div>
  </div>
  {watermark_rail(checked)}'''

    COL = 448

    flash = f'''
    <div style="display:inline-block;background:{FLASH};padding:7px 15px;font-size:17px;
      font-weight:900;letter-spacing:0.14em;color:{INK};margin-bottom:18px;">
      {card['flash']}</div>''' if card['flash'] else ''

    kicker = f'''
    <div style="font-family:{MONO};font-size:17px;font-weight:800;letter-spacing:0.14em;
      color:{PRICE};margin-bottom:12px;">{card['kicker']}</div>''' if card['kicker'] else ''

    headline = card['name_ko'] or card.get('main', '')
    name_ko = f'''
    <div style="font-size:{fit_size(headline, COL, 82)}px;font-weight:950;color:{INK};
      line-height:1.05;letter-spacing:-0.02em;">{esc(headline)}</div>''' if headline else ''

    name_en = f'''
    <div style="margin-top:10px;font-size:{fit_size(card['name_en'], COL, 44)}px;
      font-weight:900;color:{MUTE};line-height:1.08;letter-spacing:0.02em;
      text-transform:uppercase;">{esc(card['name_en'])}</div>''' if card['name_en'] else ''

    # The price is monospaced and tabular. It is a till figure, not a headline
    # numeral, and setting it in the display face would make this batch look
    # like the last one.
    price_block = ''
    if card['price']:
        size = max(52, min(96, int(COL / (len(card['price']) * 0.62))))
        price_block = f'''
    <div style="margin-top:24px;font-family:{MONO};font-size:{size}px;font-weight:900;
      color:{PRICE};line-height:1.0;letter-spacing:-0.02em;
      font-variant-numeric:tabular-nums;">{card['price']}</div>'''
        if card['price_note']:
            price_block += f'''
    <div style="margin-top:8px;font-family:{MONO};font-size:17px;font-weight:700;
      color:{MUTE};letter-spacing:0.06em;">{card['price_note']}</div>'''

    note = f'''
    <div style="margin-top:20px;padding-top:18px;border-top:2px dotted {RULE};
      font-size:22px;font-weight:700;color:{INK};line-height:1.36;
      word-break:keep-all;">{esc(card['note'])}</div>''' if card['note'] else ''

    return f'''
  <div style="position:absolute;inset:0;background:{FIELD};"></div>
  <div style="position:absolute;left:48px;right:48px;top:118px;height:722px;
    background:{CARD};border:3px solid {INK};z-index:8;
    box-shadow:12px 12px 0 rgba(20,20,20,0.10);"></div>
  {photo(card)}
  <div style="position:absolute;left:76px;width:{COL}px;top:150px;height:616px;z-index:20;
    display:flex;flex-direction:column;justify-content:center;">
    {flash}
    {kicker}
    {name_ko}
    {name_en}
    {price_block}
    <div style="margin-top:22px;font-size:23px;font-weight:650;color:{MUTE};
      line-height:1.42;word-break:keep-all;">{esc(card['sub'])}</div>
    {note}
  </div>
  {foot(index, total, seed)}
  {watermark_rail(checked)}'''


SHELL = '''<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=1080"><style>
 * {{ margin:0; padding:0; box-sizing:border-box; }}
 body {{ width:1080px; height:1080px; overflow:hidden; background:{field};
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
    checked = meta.get('checked', 'PRICES CHECKED AUG 2026')
    total = len(cards)
    print(f'{total} cards -> {out_dir}')

    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1080, 'height': 1080})
        for i, card in enumerate(cards, start=1):
            html = SHELL.format(field=FIELD, sans=SANS,
                                body=build(card, i, total, checked))
            html_path = out_dir / f'card_{i:02d}.html'
            html_path.write_text(html, encoding='utf-8')
            page.goto(html_path.as_uri())
            page.wait_for_timeout(420)
            page.screenshot(path=str(out_dir / f'card_{i:02d}.png'))
            print(f'  card_{i:02d}.png  {(card.get("name_ko") or card.get("main",""))[:34]}')
        browser.close()


if __name__ == '__main__':
    main()
