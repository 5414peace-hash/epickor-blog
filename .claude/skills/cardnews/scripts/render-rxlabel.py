#!/usr/bin/env python3
"""
render-rxlabel.py — 2026-08-17_395 (COSRX Snail 96) 전용 비주얼 시스템.

시스템: 처방 라벨 (RX LABEL). 브랜드명이 문자 그대로 Cosmetics+RX라서 주제에서
태어난 방향이다. 임상 종이 위의 조제 라벨 — 필드 룰, 점선, 조제 스탬프, 큰 값 필드.
기존 배치와의 구분: pricetag(노랑 선반 태그)·stationsign(역명판)·heatscale(매움 게이지)·
makers-v2(다크 파일 폴더)와 팔레트·형태 언어가 모두 다르다.

팔레트  paper #F6F4EF / ink #17150F / gold #C8A03C (코스알엑스 라벨 금색, 소량) /
        rule #D8D2C4 / stamp red #B3342B (카드당 1회 이하)
"""
import re, sys, argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
CARD = 1080

PAPER = '#F6F4EF'; INK = '#17150F'; GOLD = '#C8A03C'
RULE = '#D8D2C4'; RED = '#B3342B'; SOFT = '#6E6A5E'

FIELDS = ('mode', 'kicker', 'image', 'image_label', 'image_position', 'name_en',
          'name_ko', 'num', 'num_label', 'stamp', 'note', 'fit')


def parse_script(path):
    text = Path(path).read_text(encoding='utf-8')
    head = re.search(r'^---\n(.*?)\n---', text, re.S).group(1)
    meta = dict(re.findall(r'^(\w+):\s*"?(.*?)"?\s*$', head, re.M))
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
    return meta, cards


def esc(t):
    return (t or '').replace('&', '&amp;').replace('<', '&lt;').replace('\\n', '<br>')


def img_src(card, slug):
    return card.get('image', '')


def watermark():
    """전 카드 좌상단 — 약국명 슬롯에 EPICKOR.COM (하드 규칙)."""
    return f'''
    <div style="position:absolute;top:44px;left:56px;display:flex;align-items:center;gap:12px;z-index:9;">
      <div style="width:34px;height:34px;border:2px solid {INK};border-radius:50%;
                  display:flex;align-items:center;justify-content:center;
                  font:700 19px Georgia,serif;color:{INK};">R<span style="font-size:12px;">x</span></div>
      <div style="font:800 15px 'Arial';letter-spacing:.22em;color:{INK};">EPICKOR.COM</div>
    </div>'''


def head_rule(kicker):
    return f'''
    <div style="position:absolute;top:104px;left:56px;right:56px;border-bottom:2.5px solid {INK};
                padding-bottom:10px;display:flex;justify-content:flex-end;">
      <div style="font:700 16px 'Arial';letter-spacing:.26em;color:{SOFT};">{esc(kicker)}</div>
    </div>'''


def foot(i, total, checked):
    dots = ''.join(
        f'<div style="width:9px;height:9px;border-radius:50%;'
        f'background:{GOLD if n == i else RULE};"></div>' for n in range(1, total + 1))
    return f'''
    <div style="position:absolute;left:56px;right:56px;bottom:40px;display:flex;
                justify-content:space-between;align-items:center;border-top:1.5px solid {RULE};padding-top:16px;">
      <div style="display:flex;gap:7px;">{dots}</div>
      <div style="font:600 13px 'Arial';letter-spacing:.14em;color:{SOFT};">{esc(checked)}</div>
    </div>'''


def dotted(label, value, size=30, vcolor=INK, weight=800):
    return f'''
    <div style="display:flex;align-items:baseline;gap:14px;margin-top:20px;">
      <div style="font:700 15px 'Arial';letter-spacing:.18em;color:{SOFT};white-space:nowrap;">{esc(label)}</div>
      <div style="flex:1;border-bottom:2px dotted {RULE};"></div>
      <div style="font:{weight} {size}px 'Malgun Gothic','Arial';color:{vcolor};text-align:right;">{esc(value)}</div>
    </div>'''


def photo_panel(card, slug, h=470, fit='cover'):
    src = img_src(card, slug)
    pos = card.get('image_position', 'center center')
    lab = card.get('image_label', '')
    tag = (f'<div style="position:absolute;right:14px;bottom:12px;background:{PAPER};'
           f'border:1.5px solid {INK};padding:5px 12px;font:600 13px Arial;color:{INK};">{esc(lab)}</div>'
           ) if lab else ''
    return f'''
    <div style="position:relative;height:{h}px;border:2.5px solid {INK};background:#fff;overflow:hidden;">
      <img src="{src}" style="width:100%;height:100%;object-fit:{fit};object-position:{pos};">
      {tag}
    </div>'''


def stamp(text):
    if not text: return ''
    return f'''
    <div style="position:absolute;right:64px;top:150px;transform:rotate(7deg);
                border:3.5px solid {RED};color:{RED};padding:10px 18px;
                font:800 21px 'Arial';letter-spacing:.14em;opacity:.9;">{esc(text)}</div>'''


def build(card, i, total, meta):
    slug = meta.get('slug', '395')
    checked = meta.get('checked', '')
    mode = card.get('mode', 'photo')
    inner = ''

    if mode == 'cover':
        # 커버는 프로필 그리드 썸네일 — 헤드라인을 좌우 중앙, 세로도 안전영역 중심부에 둔다.
        inner = f'''
        {photo_panel(card, slug, h=440, fit=card.get('fit', 'cover'))}
        <div style="margin-top:40px;text-align:center;">
          <div style="font:800 62px 'Arial Black','Malgun Gothic';line-height:1.1;color:{INK};">{esc(card.get('main'))}</div>
          <div style="font:400 24px Georgia,'Malgun Gothic';line-height:1.5;color:{SOFT};margin-top:22px;
                      max-width:820px;margin-left:auto;margin-right:auto;">{esc(card.get('sub'))}</div>
        </div>'''

    elif mode == 'number':
        inner = f'''
        <div style="margin-top:40px;border:2.5px solid {INK};padding:52px 48px 44px;background:#fff;">
          <div style="font:700 17px Arial;letter-spacing:.24em;color:{SOFT};">{esc(card.get('num_label'))}</div>
          <div style="font:900 220px 'Arial Black';line-height:1;color:{INK};margin-top:12px;">{esc(card.get('num'))}</div>
          <div style="border-top:2px dotted {RULE};margin-top:34px;padding-top:26px;
                      font:800 34px 'Malgun Gothic','Arial';color:{INK};">{esc(card.get('main'))}</div>
        </div>
        <div style="font:400 24px Georgia,'Malgun Gothic';line-height:1.52;color:{SOFT};margin-top:30px;">{esc(card.get('sub'))}</div>'''

    else:  # photo
        rows = ''
        if card.get('name_en'):
            rows += dotted('SUBJECT', card['name_en'], size=31)
        if card.get('name_ko'):
            rows += dotted('KO', card['name_ko'], size=27, vcolor=SOFT, weight=700)
        note = (f'<div style="margin-top:18px;font:700 21px Arial;color:{RED};">{esc(card.get("note"))}</div>'
                ) if card.get('note') else ''
        inner = f'''
        {photo_panel(card, slug, h=440, fit=card.get('fit', 'cover'))}
        <div style="margin-top:30px;font:800 43px 'Malgun Gothic','Arial';line-height:1.2;color:{INK};">{esc(card.get('main'))}</div>
        <div style="margin-top:8px;">{rows}</div>
        <div style="font:400 23px Georgia,'Malgun Gothic';line-height:1.5;color:{SOFT};margin-top:20px;">{esc(card.get('sub'))}</div>
        {note}'''

    return f'''<!doctype html><meta charset="utf-8">
<body style="margin:0;width:{CARD}px;height:{CARD}px;position:relative;background:{PAPER};
             font-family:'Arial','Malgun Gothic',sans-serif;overflow:hidden;">
  <div style="position:absolute;inset:22px;border:1.5px solid {RULE};"></div>
  {watermark()}
  {head_rule(card.get('kicker', ''))}
  {stamp(card.get('stamp', ''))}
  <div style="position:absolute;top:150px;left:56px;right:56px;bottom:96px;">{inner}</div>
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
