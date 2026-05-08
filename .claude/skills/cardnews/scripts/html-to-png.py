#!/usr/bin/env python3
"""
EpicKor Card News HTML to PNG converter.

Reads output/cardnews/{slug}/script.md or output/cardnews/{YYYY-MM-DD}_{slug}/script.md,
writes card_XX.html files, and renders 1080x1080 PNG files with Playwright.
"""

import argparse
import re
import sys
from pathlib import Path


SCRIPT_DIR = Path(__file__).parent
ROOT = (SCRIPT_DIR / '../../../../').resolve()


def get_output_dir(slug):
    base = ROOT / 'output/cardnews'
    exact = base / slug
    if exact.exists():
        return exact

    prefixed = sorted(
        p for p in base.glob(f'????-??-??_{slug}')
        if p.is_dir()
    )
    if prefixed:
        return prefixed[-1]

    return exact


def parse_script(script_path):
    content = Path(script_path).read_text(encoding='utf-8')
    cards = []
    card_blocks = re.split(r'^## Card \d+', content, flags=re.MULTILINE)

    header = card_blocks[0] if card_blocks else ''
    slug_match = re.search(r'slug:\s*(\S+)', header)
    topic_match = re.search(r'topic:\s*(.+)', header)
    slug = slug_match.group(1) if slug_match else 'unknown'
    topic = topic_match.group(1).strip() if topic_match else 'Korean Culture'

    for i, block in enumerate(card_blocks[1:], 1):
        lines = block.strip().split('\n')
        role = lines[0].replace('-', '').strip() if lines else f'Card {i}'
        card = {
            'number': i,
            'role': role,
            'layout': 'B',
            'point_color': 'Gold',
            'image_keyword': 'korea',
            'image': '',
            'image_position': 'center center',
            'image_opacity': '',
            'image_zoom': '1',
            'image_tone': '',
            'image_label': '',
            'theme': 'dark',
            'kicker': '',
            'main_text': '',
            'sub_text': '',
        }

        for line in lines[1:]:
            line = line.strip()
            if line.startswith('layout:'):
                card['layout'] = line.split(':', 1)[1].strip()
            elif line.startswith('point_color:'):
                card['point_color'] = line.split(':', 1)[1].strip()
            elif line.startswith('image_keyword:'):
                card['image_keyword'] = line.split(':', 1)[1].strip()
            elif line.startswith('image:'):
                card['image'] = line.split(':', 1)[1].strip()
            elif line.startswith('image_position:'):
                card['image_position'] = line.split(':', 1)[1].strip()
            elif line.startswith('image_opacity:'):
                card['image_opacity'] = line.split(':', 1)[1].strip()
            elif line.startswith('image_zoom:'):
                card['image_zoom'] = line.split(':', 1)[1].strip()
            elif line.startswith('image_tone:'):
                card['image_tone'] = line.split(':', 1)[1].strip()
            elif line.startswith('image_label:'):
                card['image_label'] = line.split(':', 1)[1].strip()
            elif line.startswith('theme:'):
                card['theme'] = line.split(':', 1)[1].strip()
            elif line.startswith('kicker:'):
                card['kicker'] = line.split(':', 1)[1].strip()
            elif line.startswith('**Main:**'):
                card['main_text'] = line.replace('**Main:**', '').strip()
            elif line.startswith('**Sub:**'):
                card['sub_text'] = line.replace('**Sub:**', '').strip()

        cards.append(card)

    return slug, topic, cards


COLORS = {
    'Gold': '#C9A84C',
    'Teal': '#4ECDC4',
    'White': '#FFFFFF',
    'Background': '#111111',
    'Dark2': '#1A1A1A',
}


def point_color(card):
    return COLORS.get(card['point_color'], COLORS['Gold'])


def is_bright(card):
    return (card.get('theme') or '').strip().lower() in ('bright', 'light', 'morning')


def text_colors(card):
    if is_bright(card):
        return {
            'bg': '#F6F8F4',
            'panel': 'rgba(255,255,255,0.88)',
            'ink': '#161A18',
            'muted': '#3F4B45',
            'line': 'rgba(22,26,24,0.16)',
        }
    return {
        'bg': '#111111',
        'panel': 'rgba(17,17,17,0.34)',
        'ink': '#FFFFFF',
        'muted': 'rgba(255,255,255,0.78)',
        'line': 'rgba(255,255,255,0.15)',
    }


def to_html_text(text):
    text = text.replace('\\n', '<br>')
    return re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)


def resolve_image_src(card):
    value = (card.get('image') or '').strip()
    if not value:
        return ''
    if value.startswith('http://') or value.startswith('https://'):
        return value
    if value.startswith('/'):
        image_path = ROOT / 'public' / value.lstrip('/')
    else:
        image_path = ROOT / value
    if image_path.exists():
        return image_path.resolve().as_uri()
    return ''


WATERMARK_HTML = '''
  <div style="
    position:absolute;top:34px;left:42px;z-index:20;
    display:flex;align-items:center;gap:12px;
    color:rgba(255,255,255,0.74);
  ">
    <div style="width:30px;height:30px;border:1.5px solid rgba(255,255,255,0.55);
      display:flex;align-items:center;justify-content:center;
      font-size:12px;font-weight:900;letter-spacing:0.02em;">EK</div>
    <div style="font-size:12px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;">
      EPICKOR.COM
    </div>
  </div>
  <div style="
    position:absolute;bottom:30px;right:36px;z-index:20;
    padding:9px 14px;border:1px solid rgba(255,255,255,0.18);
    background:rgba(17,17,17,0.34);backdrop-filter:blur(8px);
    font-size:11px;font-weight:700;letter-spacing:0.16em;
    color:rgba(255,255,255,0.58);text-transform:uppercase;
  ">EPICKOR.COM</div>
'''


def watermark_html(card):
    if not is_bright(card):
        return WATERMARK_HTML
    return '''
  <div style="
    position:absolute;top:34px;left:42px;z-index:20;
    display:flex;align-items:center;gap:12px;
    color:rgba(22,26,24,0.70);
  ">
    <div style="width:30px;height:30px;border:1.5px solid rgba(22,26,24,0.44);
      display:flex;align-items:center;justify-content:center;
      font-size:12px;font-weight:900;letter-spacing:0.02em;">EK</div>
    <div style="font-size:12px;font-weight:800;letter-spacing:0.18em;text-transform:uppercase;">
      EPICKOR.COM
    </div>
  </div>
  <div style="
    position:absolute;bottom:30px;right:36px;z-index:20;
    padding:9px 14px;border:1px solid rgba(22,26,24,0.16);
    background:rgba(255,255,255,0.74);backdrop-filter:blur(8px);
    font-size:11px;font-weight:800;letter-spacing:0.16em;
    color:rgba(22,26,24,0.58);text-transform:uppercase;
  ">EPICKOR.COM</div>
'''


CARD_SHELL_START = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1080">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    width:1080px; height:1080px; overflow:hidden;
    background:#111111;
    font-family:'Segoe UI',Arial,'Noto Sans KR','Malgun Gothic','Apple SD Gothic Neo',sans-serif;
    -webkit-font-smoothing:antialiased;
  }
  .card {
    width:1080px; height:1080px;
    position:relative; overflow:hidden;
    background:#111111;
  }
</style>
</head>
<body>
<div class="card">
'''


CARD_SHELL_END = '''
</div>
</body>
</html>'''


def image_layer_full(img, card=None, opacity='0.36'):
    if not img:
        return ''
    card = card or {}
    if card.get('image_opacity'):
        opacity = card['image_opacity']
    position = card.get('image_position') or 'center center'
    zoom = card.get('image_zoom') or '1'
    tone = (card.get('image_tone') or '').lower()
    if is_bright(card):
        overlay = '''
  <div style="position:absolute;inset:0;
    background:linear-gradient(180deg,rgba(255,255,255,0.05) 0%,rgba(246,248,244,0.38) 58%,rgba(246,248,244,0.78) 100%);
  "></div>
'''
    elif tone == 'food':
        overlay = '''
  <div style="position:absolute;inset:0;
    background:linear-gradient(180deg,rgba(255,248,235,0.02) 0%,rgba(17,17,17,0.16) 52%,rgba(17,17,17,0.46) 100%);
  "></div>
'''
    else:
        overlay = '''
  <div style="position:absolute;inset:0;
    background:linear-gradient(180deg,rgba(17,17,17,0.24) 0%,rgba(17,17,17,0.92) 78%);
  "></div>
'''
    return f'''
  <img src="{img}" style="
    position:absolute;inset:0;width:100%;height:100%;
    object-fit:cover;object-position:{position};
    transform:scale({zoom});transform-origin:{position};
    opacity:{opacity};filter:saturate(1.12) contrast(1.04);
  ">
  {overlay}
'''


def kicker_html(card, pc):
    kicker = (card.get('kicker') or '').strip()
    if not kicker:
        return ''
    if is_bright(card):
        return f'''
    <div style="
      display:inline-flex;align-items:center;width:max-content;
      padding:9px 13px;margin-bottom:22px;
      border:1px solid {pc};background:rgba(255,255,255,0.82);
      color:#161A18;font-size:16px;font-weight:900;
      letter-spacing:0.12em;text-transform:uppercase;
      box-shadow:0 8px 22px rgba(22,26,24,0.08);
    ">{kicker}</div>
    '''
    return f'''
    <div style="
      display:inline-flex;align-items:center;width:max-content;
      padding:9px 13px;margin-bottom:22px;
      border:1px solid {pc};background:rgba(17,17,17,0.34);
      color:{pc};font-size:16px;font-weight:800;
      letter-spacing:0.12em;text-transform:uppercase;
    ">{kicker}</div>
    '''


def image_label_html(card, pc, side='left'):
    label = (card.get('image_label') or '').strip()
    if not label:
        return ''
    anchor = 'left:28px;' if side == 'left' else 'right:28px;'
    notch_anchor = 'left:-8px;' if side == 'left' else 'right:-8px;'
    notch_rotate = '45deg'
    bg = 'rgba(255,255,255,0.88)' if is_bright(card) else 'rgba(17,17,17,0.72)'
    txt = '#161A18' if is_bright(card) else '#FFFFFF'
    shadow = '0 10px 24px rgba(22,26,24,0.14)' if is_bright(card) else '0 10px 28px rgba(0,0,0,0.34)'
    return f'''
      <div style="
        position:absolute;bottom:76px;{anchor}z-index:12;
        display:inline-flex;align-items:center;gap:9px;
        padding:11px 15px 11px 17px;
        background:{bg};
        border:1px solid {pc};
        color:{txt};font-size:18px;font-weight:900;
        letter-spacing:0.02em;text-transform:none;
        box-shadow:{shadow};
      ">
        <span style="
          position:absolute;top:50%;{notch_anchor}
          width:14px;height:14px;background:{bg};
          border-left:1px solid {pc};border-bottom:1px solid {pc};
          transform:translateY(-50%) rotate({notch_rotate});
        "></span>
        <span style="
          width:8px;height:8px;border-radius:50%;
          background:{pc};display:inline-block;z-index:2;
        "></span>
        <span style="position:relative;z-index:2;">{label}</span>
      </div>
    '''


def build_type_a(card):
    pc = point_color(card)
    main = to_html_text(card['main_text'])
    sub = to_html_text(card['sub_text'])
    img = resolve_image_src(card)
    kicker = kicker_html(card, pc)
    colors = text_colors(card)

    if is_bright(card):
        return f'''
  <div style="position:absolute;inset:0;background:{colors['bg']};"></div>
  {image_layer_full(img, card, '0.50')}
  <div style="position:absolute;top:-90px;right:-70px;
    width:430px;height:430px;background:#FFCF33;transform:rotate(35deg);opacity:0.34;
  "></div>
  <div style="position:absolute;top:110px;right:88px;
    width:7px;height:260px;background:{pc};transform:rotate(35deg);opacity:0.80;
  "></div>

  <div style="
    position:absolute;bottom:82px;left:74px;right:74px;
    padding:46px 52px 48px;
    background:{colors['panel']};
    border:1px solid rgba(22,26,24,0.10);
    box-shadow:0 24px 70px rgba(22,26,24,0.14);
  ">
    {kicker}
    <div style="width:58px;height:5px;background:{pc};margin-bottom:30px;"></div>
    <div style="
      font-size:68px;font-weight:900;color:{colors['ink']};
      line-height:1.06;margin-bottom:26px;
    ">{main}</div>
    <div style="
      font-size:30px;font-weight:700;color:{colors['muted']};
      line-height:1.35;word-break:keep-all;
    ">{sub}</div>
  </div>
  {watermark_html(card)}'''

    return f'''
  <div style="position:absolute;inset:0;
    background:linear-gradient(135deg,#1a1200 0%,#111111 55%,#0d0d0d 100%);
  "></div>
  {image_layer_full(img, card, '0.38')}

  <div style="position:absolute;top:-80px;right:-60px;
    width:400px;height:400px;background:{pc};transform:rotate(35deg);opacity:0.10;
  "></div>
  <div style="position:absolute;top:70px;right:50px;
    width:5px;height:260px;background:{pc};transform:rotate(35deg);opacity:0.5;
  "></div>

  <div style="position:absolute;bottom:100px;left:88px;right:88px;">
    {kicker}
    <div style="width:58px;height:5px;background:{pc};margin-bottom:30px;"></div>
    <div style="
      font-size:72px;font-weight:900;color:#FFFFFF;
      line-height:1.05;margin-bottom:28px;
    ">{main}</div>
    <div style="
      font-size:30px;font-weight:500;color:rgba(255,255,255,0.78);
      line-height:1.35;word-break:keep-all;
    ">{sub}</div>
  </div>
  {watermark_html(card)}'''


def build_type_b(card):
    pc = point_color(card)
    main = to_html_text(card['main_text'])
    sub = to_html_text(card['sub_text'])
    img = resolve_image_src(card)
    kicker = kicker_html(card, pc)
    colors = text_colors(card)
    visual = image_layer_full(img, card, '0.62') if img else f'''
    <div style="
      position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
      width:200px;height:200px;border-radius:50%;
      border:2px solid {pc};opacity:0.3;
    "></div>
    <div style="
      position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
      width:120px;height:120px;border-radius:50%;
      background:{pc};opacity:0.08;
    "></div>
    '''

    return f'''
  <div style="
    width:1080px;height:486px;position:relative;overflow:hidden;
    background:{colors['bg'] if is_bright(card) else 'linear-gradient(135deg,#1a1200 0%,#2d1f00 50%,#111111 100%)'};
  ">
    {visual}
  </div>

  <div style="
    width:1080px;height:594px;background:{colors['bg']};
    padding:62px 88px;
    display:flex;flex-direction:column;justify-content:center;
  ">
    {kicker}
    <div style="
      font-size:54px;font-weight:900;color:{pc};
      line-height:1.14;
      border-bottom:3px solid {pc};
      display:inline-block;padding-bottom:12px;margin-bottom:32px;
    ">{main}</div>
    <div style="
      font-size:30px;font-weight:700;color:{colors['ink']};
      line-height:1.42;word-break:keep-all;
    ">{sub}</div>
  </div>
  {watermark_html(card)}'''


def build_type_c(card):
    pc = point_color(card)
    main = to_html_text(card['main_text'])
    sub = to_html_text(card['sub_text'])
    img = resolve_image_src(card)
    kicker = kicker_html(card, pc)
    colors = text_colors(card)
    visual = image_layer_full(img, card, '0.56') if img else f'''
      <div style="
        position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
        width:180px;height:180px;border-radius:50%;
        border:1px solid {pc};opacity:0.4;
      "></div>
      <div style="
        position:absolute;top:30%;left:20%;
        width:3px;height:200px;background:{pc};opacity:0.3;transform:rotate(20deg);
      "></div>
    '''

    return f'''
  <div style="display:flex;width:1080px;height:1080px;">
    <div style="
      width:648px;height:1080px;background:{colors['bg']};
      padding:86px 72px;
      display:flex;flex-direction:column;justify-content:center;
    ">
      <div style="width:52px;height:5px;background:{pc};margin-bottom:30px;"></div>
      {kicker}
      <div style="
        font-size:52px;font-weight:900;color:{pc};
        line-height:1.12;
        border-left:6px solid {pc};padding-left:22px;margin-bottom:34px;
      ">{main}</div>
      <div style="
        font-size:29px;font-weight:700;color:{colors['ink']};
        line-height:1.45;word-break:keep-all;
      ">{sub}</div>
    </div>

    <div style="
      width:432px;height:1080px;position:relative;overflow:hidden;
      background:{colors['bg'] if is_bright(card) else 'linear-gradient(180deg,#1a1200 0%,#0d0d0d 100%)'};
    ">
      {visual}
      {image_label_html(card, pc, 'left')}
    </div>
  </div>
  {watermark_html(card)}'''


def build_type_e(card):
    pc = point_color(card)
    main = to_html_text(card['main_text'])
    sub = to_html_text(card['sub_text'])
    img = resolve_image_src(card)
    kicker = kicker_html(card, pc)
    colors = text_colors(card)
    visual = image_layer_full(img, card, '0.56') if img else f'''
      <div style="
        position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
        width:180px;height:180px;border-radius:50%;
        border:1px solid {pc};opacity:0.4;
      "></div>
      <div style="
        position:absolute;top:30%;left:20%;
        width:3px;height:200px;background:{pc};opacity:0.3;transform:rotate(20deg);
      "></div>
    '''

    return f'''
  <div style="display:flex;width:1080px;height:1080px;">
    <div style="
      width:432px;height:1080px;position:relative;overflow:hidden;
      background:{colors['bg'] if is_bright(card) else 'linear-gradient(180deg,#1a1200 0%,#0d0d0d 100%)'};
    ">
      {visual}
      {image_label_html(card, pc, 'right')}
    </div>

    <div style="
      width:648px;height:1080px;background:{colors['bg']};
      padding:86px 72px;
      display:flex;flex-direction:column;justify-content:center;
    ">
      <div style="width:52px;height:5px;background:{pc};margin-bottom:30px;"></div>
      {kicker}
      <div style="
        font-size:52px;font-weight:900;color:{pc};
        line-height:1.12;
        border-left:6px solid {pc};padding-left:22px;margin-bottom:34px;
      ">{main}</div>
      <div style="
        font-size:29px;font-weight:700;color:{colors['ink']};
        line-height:1.45;word-break:keep-all;
      ">{sub}</div>
    </div>
  </div>
  {watermark_html(card)}'''


def build_type_d(card, total):
    pc = point_color(card)
    main = to_html_text(card['main_text'])
    sub = to_html_text(card['sub_text'])
    img = resolve_image_src(card)
    kicker = kicker_html(card, pc)
    num = card['number']
    colors = text_colors(card)

    return f'''
  <div style="position:absolute;inset:0;background:{colors['bg']};"></div>
  {image_layer_full(img, card, '0.40')}
  <div style="padding:88px;position:relative;width:1080px;height:1080px;z-index:5;">
    <div style="
      font-size:16px;font-weight:500;
      color:{'rgba(22,26,24,0.44)' if is_bright(card) else 'rgba(255,255,255,0.4)'};letter-spacing:0.1em;margin-bottom:48px;
    ">{num:02d} / {total:02d}</div>
    {kicker}

    <div style="
      font-size:72px;font-weight:900;color:{pc if not is_bright(card) else colors['ink']};
      line-height:1.08;margin-bottom:44px;
    ">{main}</div>

    <div style="width:100%;height:2px;background:{colors['line']};margin-bottom:44px;"></div>

    <div style="
      font-size:32px;font-weight:700;color:{colors['muted']};
      line-height:1.42;word-break:keep-all;
    ">{sub}</div>

    <div style="
      position:absolute;bottom:-60px;right:-60px;
      width:280px;height:280px;
      background:{pc};transform:rotate(45deg);opacity:0.07;
    "></div>
  </div>
  {watermark_html(card)}'''


def build_card_html(card, total):
    layout = card['layout'].upper().strip()
    if layout == 'A':
        body = build_type_a(card)
    elif layout == 'B':
        body = build_type_b(card)
    elif layout == 'C':
        body = build_type_c(card)
    elif layout == 'E':
        body = build_type_e(card)
    elif layout == 'D':
        body = build_type_d(card, total)
    else:
        body = build_type_b(card)

    return CARD_SHELL_START + body + CARD_SHELL_END


def convert_to_png(html_path, png_path):
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print('Playwright is not installed.')
        print('Run: pip install playwright && playwright install chromium')
        sys.exit(1)

    html_url = 'file:///' + str(html_path).replace('\\', '/')
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1080, 'height': 1080})
        page.goto(html_url)
        page.wait_for_timeout(1000)
        page.screenshot(
            path=str(png_path),
            clip={'x': 0, 'y': 0, 'width': 1080, 'height': 1080},
        )
        browser.close()


def main():
    parser = argparse.ArgumentParser(description='EpicKor card news HTML to PNG converter')
    parser.add_argument('--slug', required=True, help='Post slug, e.g. 160')
    parser.add_argument('--card', help='Render one card number, e.g. 01')
    args = parser.parse_args()

    slug = args.slug
    output_dir = get_output_dir(slug)
    script_path = output_dir / 'script.md'

    if not script_path.exists():
        print(f'Missing script.md: {script_path}')
        sys.exit(1)

    print(f'Starting card news render: slug={slug}')
    _, topic, cards = parse_script(script_path)
    total = len(cards)
    print(f'   Topic: {topic}')
    print(f'   Cards: {total}')

    target_cards = cards
    if args.card:
        target_num = int(args.card)
        target_cards = [c for c in cards if c['number'] == target_num]
        if not target_cards:
            print(f'Missing Card {args.card}')
            sys.exit(1)

    success_count = 0
    for card in target_cards:
        num_str = f'{card["number"]:02d}'
        html_path = output_dir / f'card_{num_str}.html'
        png_path = output_dir / f'card_{num_str}.png'

        html = build_card_html(card, total)
        html_path.write_text(html, encoding='utf-8')

        try:
            convert_to_png(html_path, png_path)
            html_path.unlink(missing_ok=True)
            print(f'   OK card_{num_str}.png ({card["layout"]} / {card["role"]})')
            success_count += 1
        except Exception as e:
            print(f'   Failed card_{num_str}.png: {e}')
            print(f'      HTML saved: {html_path}')

    rel_output = output_dir.relative_to(ROOT).as_posix()
    print(f'\nDone. {success_count}/{len(target_cards)} PNG generated')
    print(f'   Output: {rel_output}/')

    if success_count < len(target_cards):
        failed = len(target_cards) - success_count
        print(f'   Warning: {failed} card(s) failed; inspect the saved HTML files.')
    else:
        print('   Temporary card HTML files were removed after successful render.')


if __name__ == '__main__':
    main()
