#!/usr/bin/env python3
"""
render-showroom.py — 2026-08-17_394 (안마의자/바디프렌드) 전용 비주얼 시스템.

시스템: 쇼룸 명판 (SHOWROOM MENU). 프리미엄 쇼룸/스파 메뉴판의 명판 형식 —
아이보리 지면, 샴페인 골드 이중 프레임, 에스프레소 세리프 디스플레이, 중앙 명판.
카드 06(안전)은 **의도적 시스템 파단**: 옐로/블랙 해저드 — 소비자원 경고 내용이 요구.

기존 배치와의 구분: rxlabel(임상 점선 필드) · earthgauge(흙+세로 게이지) ·
pricetag/stationsign/heatscale · makers-v2(다크 파일 폴더 — 본 시스템은 라이트 아이보리)와
팔레트·형태 언어 비겹침.

팔레트  ivory #F5F0E6 / espresso #2B211B / champagne #B99A5B /
        hairline #E2D8C4  ·  hazard: #F2C230 / #141210
"""
import re, argparse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
CARD = 1080

IVORY = '#F5F0E6'; ESP = '#2B211B'; CHAMP = '#B99A5B'; HAIR = '#E2D8C4'; SOFT = '#7A6A56'
HZ_Y = '#F2C230'; HZ_K = '#141210'

FIELDS = ('mode', 'kicker', 'image', 'image_label', 'image_position', 'name_en',
          'name_ko', 'num', 'num_label', 'note', 'fit', 'subject_note')


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


def frame(hazard=False):
    a, b = (HZ_K, HZ_K) if hazard else (CHAMP, HAIR)
    return (f'<div style="position:absolute;inset:20px;border:2.5px solid {a};"></div>'
            f'<div style="position:absolute;inset:30px;border:1px solid {b};"></div>')


def watermark(hazard=False):
    ink = HZ_K if hazard else ESP
    dia = HZ_K if hazard else CHAMP
    return f'''
    <div style="position:absolute;top:48px;left:60px;display:flex;align-items:center;gap:12px;z-index:9;">
      <div style="width:16px;height:16px;background:{dia};transform:rotate(45deg);"></div>
      <div style="font:800 15px Arial;letter-spacing:.22em;color:{ink};">EPICKOR.COM</div>
    </div>'''


def kick(kicker, hazard=False):
    return (f'<div style="position:absolute;top:52px;right:60px;font:700 15px Arial;'
            f'letter-spacing:.24em;color:{HZ_K if hazard else SOFT};">{esc(kicker)}</div>')


def foot(i, total, checked, hazard=False):
    on = HZ_K if hazard else CHAMP
    off = '#8a8578' if hazard else HAIR
    dias = ''.join(
        f'<div style="width:11px;height:11px;transform:rotate(45deg);background:{on if n == i else off};"></div>'
        for n in range(1, total + 1))
    return f'''
    <div style="position:absolute;left:60px;right:60px;bottom:44px;display:flex;
                justify-content:space-between;align-items:center;">
      <div style="display:flex;gap:9px;">{dias}</div>
      <div style="font:600 13px Arial;letter-spacing:.14em;color:{HZ_K if hazard else SOFT};">{esc(checked)}</div>
    </div>'''


def photo_panel(card, h, fit='cover'):
    lab = card.get('image_label', '')
    tag = (f'<div style="position:absolute;right:16px;bottom:14px;background:{IVORY};'
           f'border:1px solid {CHAMP};padding:5px 12px;font:600 13px Arial;color:{ESP};">{esc(lab)}</div>') if lab else ''
    return f'''
    <div style="position:relative;height:{h}px;overflow:hidden;background:#fff;
                outline:1px solid {HAIR};">
      <img src="{card.get('image', '')}" style="width:100%;height:100%;object-fit:{fit};
           object-position:{card.get('image_position', 'center center')};">
      {tag}
    </div>'''


def plaque(card):
    rows = ''
    if card.get('name_en'):
        rows += f'<div style="font:800 29px Georgia,\'Malgun Gothic\';color:{ESP};margin-top:14px;">{esc(card["name_en"])}</div>'
    if card.get('name_ko'):
        rows += f'<div style="font:700 24px \'Malgun Gothic\';color:{SOFT};margin-top:8px;">{esc(card["name_ko"])}</div>'
    return rows


def build(card, i, total, meta):
    checked = meta.get('checked', '')
    mode = card.get('mode', 'photo')
    hazard = mode == 'hazard'

    if mode == 'cover':
        inner = f'''
        {photo_panel(card, 480, card.get('fit', 'cover'))}
        <div style="text-align:center;margin-top:34px;">
          <div style="display:inline-block;border-top:2.5px solid {CHAMP};border-bottom:2.5px solid {CHAMP};
                      padding:20px 8px;">
            <div style="font:800 56px Georgia,'Malgun Gothic';line-height:1.12;color:{ESP};">{esc(card.get('main'))}</div>
          </div>
          <div style="font:400 24px Georgia,'Malgun Gothic';line-height:1.5;color:{SOFT};margin-top:22px;
                      max-width:800px;margin-left:auto;margin-right:auto;">{esc(card.get('sub'))}</div>
        </div>'''
    elif mode == 'number':
        inner = f'''
        <div style="margin-top:40px;text-align:center;border:1px solid {CHAMP};padding:52px 40px 44px;background:#FBF8F1;">
          <div style="font:700 17px Arial;letter-spacing:.26em;color:{SOFT};">{esc(card.get('num_label'))}</div>
          <div style="font:900 200px Georgia;line-height:1;color:{ESP};margin-top:8px;">{esc(card.get('num'))}</div>
          <div style="width:90px;height:2.5px;background:{CHAMP};margin:30px auto 0;"></div>
          <div style="font:800 33px 'Malgun Gothic',Georgia;color:{ESP};margin-top:24px;">{esc(card.get('main'))}</div>
        </div>
        <div style="font:400 24px Georgia,'Malgun Gothic';line-height:1.52;color:{SOFT};margin-top:28px;text-align:center;">{esc(card.get('sub'))}</div>'''
    elif hazard:
        stripes = ('repeating-linear-gradient(45deg,' + HZ_Y + ' 0 26px,' + HZ_K + ' 26px 52px)')
        photo = photo_panel(card, 300, card.get('fit', 'cover')) if card.get('image') else ''
        inner = f'''
        <div style="height:34px;background:{stripes};"></div>
        <div style="margin-top:26px;font:900 46px 'Arial Black','Malgun Gothic';line-height:1.15;color:{HZ_K};">{esc(card.get('main'))}</div>
        <div style="margin-top:18px;">{photo}</div>
        <div style="font:700 24px 'Malgun Gothic',Arial;line-height:1.45;color:{HZ_K};margin-top:20px;">{esc(card.get('sub'))}</div>
        <div style="margin-top:16px;font:900 22px Arial;color:{HZ_K};background:{IVORY};
                    display:inline-block;padding:8px 14px;border:3px solid {HZ_K};">{esc(card.get('note'))}</div>'''
    else:
        note = (f'<div style="margin-top:14px;font:700 20px Arial;color:{CHAMP};">{esc(card.get("note"))}</div>'
                ) if card.get('note') else ''
        inner = f'''
        {photo_panel(card, 430, card.get('fit', 'cover'))}
        <div style="margin-top:26px;font:800 41px Georgia,'Malgun Gothic';line-height:1.2;color:{ESP};">{esc(card.get('main'))}</div>
        {plaque(card)}
        <div style="font:400 23px Georgia,'Malgun Gothic';line-height:1.5;color:{SOFT};margin-top:16px;">{esc(card.get('sub'))}</div>
        {note}'''

    bg = HZ_Y if hazard else IVORY
    return f'''<!doctype html><meta charset="utf-8">
<body style="margin:0;width:{CARD}px;height:{CARD}px;position:relative;background:{bg};
             font-family:Georgia,'Malgun Gothic',serif;overflow:hidden;">
  {frame(hazard)}
  {watermark(hazard)}
  {kick(card.get('kicker', ''), hazard)}
  <div style="position:absolute;top:120px;left:60px;right:60px;bottom:100px;">{inner}</div>
  {foot(i, total, checked, hazard)}
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
