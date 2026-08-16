#!/usr/bin/env python3
"""
render-earthgauge.py — 2026-08-17_392 (김치냉장고) 전용 비주얼 시스템.

시스템: 땅속 온도계 (EARTH GAUGE). 이 가전이 복제한 것이 겨울 땅속 1m의 온도라는
사실에서 태어난 방향. 좌측에 지표(0)에서 -1m까지 내려가는 깊이 게이지 레일,
흙 팔레트, 김치 레드는 게이지 바늘과 강조에만.

기존 배치와의 구분: rxlabel(임상 종이·점선 필드) · pricetag(노랑 태그) ·
stationsign · heatscale(가로 매움 게이지 — 이쪽은 세로 깊이 게이지로 축이 다름) ·
makers-v2(다크 파일)와 팔레트·형태 언어 비겹침.

팔레트  soil paper #F2EBE0 / deep earth #2E211A / onggi #8A5A38 /
        kimchi red #C0392B / faint rule #DACCB8
"""
import re, argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
CARD = 1080

PAPER = '#F2EBE0'; INK = '#2E211A'; ONGGI = '#8A5A38'
RED = '#C0392B'; RULE = '#DACCB8'; SOFT = '#75604F'

FIELDS = ('mode', 'kicker', 'image', 'image_label', 'image_position', 'name_en',
          'name_ko', 'num', 'num_label', 'note', 'fit', 'subject_note', 'depth')


def parse_script(path):
    text = Path(path).read_text(encoding='utf-8')
    cards = []
    for block in re.split(r'\n## Card \d+[^\n]*\n', text)[1:]:
        c = {}
        for k in FIELDS:
            m = re.search(rf'^{k}:\s*(.+)$', block, re.M)
            if m: c[k] = m.group(1).strip()
        m = re.search(r'\*\*Main:\*\*\s*(.+)', block)
        if m: c['main'] = m.group(1).strip()
        m = re.search(r'\*\*Sub:\*\*\s*(.+)', block)
        if m: c['sub'] = m.group(1).strip()
        cards.append(c)
    meta = dict(re.findall(r'^(\w+):\s*"?(.*?)"?\s*$',
                re.search(r'^---\n(.*?)\n---', text, re.S).group(1), re.M))
    return meta, cards


def esc(t):
    return (t or '').replace('&', '&amp;').replace('<', '&lt;').replace('\\n', '<br>')


def gauge_rail(i, total, depth_label):
    """좌측 깊이 게이지 — 지표 0에서 아래로. 바늘(레드)이 카드 진행도만큼 내려간다."""
    frac = i / total
    ticks = ''
    for n in range(11):
        y = 150 + n * 80
        major = n % 5 == 0
        ticks += (f'<div style="position:absolute;top:{y}px;left:0;width:{18 if major else 10}px;'
                  f'height:2px;background:{ONGGI};"></div>')
    needle_y = 150 + int(800 * frac)
    return f'''
    <div style="position:absolute;top:0;bottom:0;left:34px;width:60px;">
      <div style="position:absolute;top:150px;bottom:130px;left:0;width:2.5px;background:{ONGGI};"></div>
      {ticks}
      <div style="position:absolute;top:124px;left:-4px;font:800 12px Arial;color:{SOFT};letter-spacing:.12em;">GROUND</div>
      <div style="position:absolute;top:{needle_y - 7}px;left:-7px;width:15px;height:15px;
                  background:{RED};border-radius:50%;border:2.5px solid {PAPER};box-shadow:0 0 0 2px {RED};"></div>
      <div style="position:absolute;top:{needle_y - 8}px;left:24px;font:800 14px Arial;color:{RED};white-space:nowrap;">{esc(depth_label)}</div>
    </div>'''


def watermark():
    return f'''
    <div style="position:absolute;top:44px;left:56px;display:flex;align-items:center;gap:12px;z-index:9;">
      <div style="width:34px;height:34px;background:{RED};display:flex;align-items:center;justify-content:center;">
        <div style="width:14px;height:14px;border:2.5px solid {PAPER};border-radius:50% 50% 4px 4px;"></div>
      </div>
      <div style="font:800 15px Arial;letter-spacing:.22em;color:{INK};">EPICKOR.COM</div>
    </div>'''


def header(kicker):
    return f'''
    <div style="position:absolute;top:50px;right:56px;font:700 16px Arial;letter-spacing:.24em;color:{SOFT};">{esc(kicker)}</div>
    <div style="position:absolute;top:104px;left:120px;right:56px;border-bottom:2.5px solid {INK};"></div>'''


def foot(i, total, checked):
    boxes = ''.join(
        f'<div style="width:22px;height:8px;background:{RED if n == i else RULE};"></div>'
        for n in range(1, total + 1))
    return f'''
    <div style="position:absolute;left:120px;right:56px;bottom:40px;display:flex;
                justify-content:space-between;align-items:center;border-top:1.5px solid {RULE};padding-top:15px;">
      <div style="display:flex;gap:6px;">{boxes}</div>
      <div style="font:600 13px Arial;letter-spacing:.14em;color:{SOFT};">{esc(checked)}</div>
    </div>'''


def photo_panel(card, h, fit='cover'):
    lab = card.get('image_label', '')
    tag = (f'<div style="position:absolute;left:14px;bottom:12px;background:{INK};'
           f'color:{PAPER};padding:5px 12px;font:600 13px Arial;">{esc(lab)}</div>') if lab else ''
    return f'''
    <div style="position:relative;height:{h}px;border:3px solid {INK};background:#fff;overflow:hidden;">
      <img src="{card.get('image', '')}" style="width:100%;height:100%;object-fit:{fit};
           object-position:{card.get('image_position', 'center center')};">
      {tag}
    </div>'''


def build(card, i, total, meta):
    checked = meta.get('checked', '')
    mode = card.get('mode', 'photo')
    depth = card.get('depth', f'-{i * 100 // total}cm')

    if mode == 'cover':
        inner = f'''
        {photo_panel(card, 470, card.get('fit', 'cover'))}
        <div style="margin-top:38px;text-align:center;">
          <div style="font:800 60px 'Arial Black','Malgun Gothic';line-height:1.1;color:{INK};">{esc(card.get('main'))}</div>
          <div style="font:400 24px Georgia,'Malgun Gothic';line-height:1.5;color:{SOFT};margin-top:20px;
                      max-width:800px;margin-left:auto;margin-right:auto;">{esc(card.get('sub'))}</div>
        </div>'''
    elif mode == 'number':
        inner = f'''
        <div style="margin-top:36px;background:{INK};padding:56px 48px 48px;">
          <div style="font:700 17px Arial;letter-spacing:.24em;color:{RULE};">{esc(card.get('num_label'))}</div>
          <div style="font:900 230px 'Arial Black';line-height:1;color:{PAPER};margin-top:10px;">{esc(card.get('num'))}<span style="color:{RED};">.</span></div>
          <div style="border-top:2px solid {ONGGI};margin-top:30px;padding-top:24px;
                      font:800 33px 'Malgun Gothic','Arial';color:{PAPER};">{esc(card.get('main'))}</div>
        </div>
        <div style="font:400 24px Georgia,'Malgun Gothic';line-height:1.5;color:{SOFT};margin-top:28px;">{esc(card.get('sub'))}</div>'''
    else:
        rows = ''
        if card.get('name_en'):
            rows += (f'<div style="display:flex;align-items:baseline;gap:14px;margin-top:16px;">'
                     f'<div style="width:64px;height:3px;background:{RED};"></div>'
                     f'<div style="font:800 30px \'Malgun Gothic\',Arial;color:{INK};">{esc(card["name_en"])}</div></div>')
        if card.get('name_ko'):
            rows += (f'<div style="display:flex;align-items:baseline;gap:14px;margin-top:10px;">'
                     f'<div style="width:64px;height:3px;background:{RULE};"></div>'
                     f'<div style="font:700 26px \'Malgun Gothic\';color:{SOFT};">{esc(card["name_ko"])}</div></div>')
        note = (f'<div style="margin-top:16px;font:700 21px Arial;color:{RED};">{esc(card.get("note"))}</div>'
                ) if card.get('note') else ''
        inner = f'''
        {photo_panel(card, 430, card.get('fit', 'cover'))}
        <div style="margin-top:26px;font:800 42px 'Malgun Gothic','Arial';line-height:1.2;color:{INK};">{esc(card.get('main'))}</div>
        {rows}
        <div style="font:400 23px Georgia,'Malgun Gothic';line-height:1.5;color:{SOFT};margin-top:18px;">{esc(card.get('sub'))}</div>
        {note}'''

    return f'''<!doctype html><meta charset="utf-8">
<body style="margin:0;width:{CARD}px;height:{CARD}px;position:relative;background:{PAPER};
             font-family:'Arial','Malgun Gothic',sans-serif;overflow:hidden;">
  {gauge_rail(i, total, depth)}
  {watermark()}
  {header(card.get('kicker', ''))}
  <div style="position:absolute;top:146px;left:120px;right:56px;bottom:96px;">{inner}</div>
  {foot(i, total, checked)}
</body>'''


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--slug', required=True)
    a = ap.parse_args()
    base = ROOT / 'public' / 'assets' / 'cardnews' / f'2026-08-17_{a.slug}'
    meta, cards = parse_script(base / 'script.md')
    total = len(cards)
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch()
        page = b.new_page(viewport={'width': CARD, 'height': CARD})
        for i, card in enumerate(cards, 1):
            hp = base / f'card_{i:02d}.html'
            hp.write_text(build(card, i, total, meta), encoding='utf-8')
            page.goto(hp.as_uri())
            page.wait_for_timeout(420)
            page.screenshot(path=str(base / f'card_{i:02d}.png'))
            print(f'card_{i:02d}.png')
        b.close()


if __name__ == '__main__':
    main()
