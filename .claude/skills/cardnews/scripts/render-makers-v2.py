#!/usr/bin/env python3
"""
Korean Makers batch — v2 renderer. Three carousels, three distinct visual systems.

2026-08-08 대표님 피드백으로 전면 재설계:
- 캐러셀 3개가 "포인트 컬러만 다른 같은 세계"였다 → 각자 이야기에 맞는 시스템으로 분리.
  * samick  = "sunburst"  : 기타 바디의 선버스트 피니시를 그라운드로 쓰는 빈티지 카탈로그.
                            Georgia 세리프, 크림/브라스, 기타 줄 디바이더, 프렛 도트 진행표시.
  * dorco   = "blade"     : 면도날의 사선(edge)을 레이아웃 장치로 쓰는 정밀 스틸 미니멀.
                            Bahnschrift(DIN) 컨덴스드, 콜드 화이트/잉크/스틸블루, 레드 헤어라인.
  * cuckoo  = "homedrama" : 90년대 안방극장. 아치(밥솥 돔) 프레임, 라운디드 타입,
                            EP 배지, 하단 채널바. 크림/브라운/레드/골드.
- 텍스트 겹침 재발 방지: 본문은 전부 플로우 레이아웃(flex column + gap)이라 겹칠 수 없고,
  렌더 후 각 [data-flow] 컨테이너의 오버플로를 JS로 실측해 FAIL을 출력한다.
- 카드 위 한국어는 카드당 최대 한 줄, 디자인 요소(세로 낙관/작은 각인)로만 배치한다.
"""

import argparse
import io
import re
import sys
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

SCRIPT_DIR = Path(__file__).parent
ROOT = (SCRIPT_DIR / '../../../../').resolve()

KEYS = ('kicker', 'image', 'image_label', 'name_ko', 'name_en', 'num',
        'num_label', 'stamp', 'note', 'mode', 'fit', 'accent', 'ko_line', 'verdict')


def esc(text):
    return (text or '').replace('\\n', '<br>')


def lines_of(text):
    return [t for t in (text or '').split('\\n') if t.strip()]


def fit_size(text, column_px, cap, factor=0.62):
    """Line-aware sizing: with explicit \\n breaks, size the type so the longest
    line fits the column — this is what kills orphan-word wraps ("MIGHT" alone
    on its own line). Char width ≈ factor em for latin, 1.02 em for Hangul,
    0.32 em for spaces."""
    lines = [ln for ln in (text or '').split('\\n') if ln.strip()]
    if not lines:
        return cap
    def line_units(line):
        u = 0.0
        for c in line:
            if '가' <= c <= '힣':
                u += 1.02
            elif c == ' ':
                u += 0.32
            else:
                u += factor
        return u
    widest = max(line_units(ln) for ln in lines) or 1
    return max(24, min(cap, int(column_px / widest)))


def parse_script(path):
    text = Path(path).read_text(encoding='utf-8')
    blocks = re.split(r'^## Card \d+', text, flags=re.MULTILINE)
    meta = {}
    for line in blocks[0].splitlines():
        if ':' in line and not line.startswith('#'):
            k, _, v = line.partition(':')
            meta[k.strip()] = v.strip().strip('"')
    cards = []
    for block in blocks[1:]:
        card = {k: '' for k in KEYS}
        card['mode'] = 'item'
        card['fit'] = 'contain'
        for line in block.splitlines():
            s = line.strip()
            for key in KEYS:
                if s.startswith(key + ':'):
                    card[key] = s.split(':', 1)[1].strip()
            if s.startswith('**Main:**'):
                card['main'] = s.replace('**Main:**', '').strip()
            elif s.startswith('**Sub:**'):
                card['sub'] = s.replace('**Sub:**', '').strip()
        card.setdefault('main', '')
        card.setdefault('sub', '')
        if card.get('main') or card['name_en'] or card['num']:
            cards.append(card)
    return meta, cards


# ============================================================ SUNBURST (samick)

SB_CREAM = '#F5EBD3'
SB_CREAM70 = 'rgba(245,235,211,0.74)'
SB_CREAM50 = 'rgba(245,235,211,0.52)'
SB_BRASS = '#E4B75E'
SB_DARK = '#2A160B'
SB_SERIF = "Georgia,'Times New Roman',serif"
SB_MONO = "'Consolas','Courier New',monospace"
SB_KO = "'Malgun Gothic','Segoe UI',sans-serif"


def sb_ground():
    return f'''
  <div style="position:absolute;inset:0;background:
    radial-gradient(circle at 50% 36%, #E9A94F 0%, #C07A33 40%, #7A4520 70%, #45250F 100%);"></div>
  <div style="position:absolute;inset:0;background:
    radial-gradient(circle at 50% 46%, rgba(0,0,0,0) 52%, rgba(22,10,3,0.5) 100%);"></div>
  <div style="position:absolute;inset:26px;border:1.5px solid rgba(245,235,211,0.45);z-index:5;"></div>
  <div style="position:absolute;inset:36px;border:1px solid rgba(245,235,211,0.22);z-index:5;"></div>'''


def sb_watermark(no):
    return f'''
  <div style="position:absolute;left:56px;top:52px;z-index:30;display:flex;align-items:center;gap:12px;">
    <div style="width:30px;height:30px;border:2px solid {SB_CREAM};display:flex;align-items:center;
      justify-content:center;font-family:{SB_SERIF};font-size:13px;font-weight:700;color:{SB_CREAM};">EK</div>
    <div style="font-family:{SB_MONO};font-size:14px;font-weight:700;letter-spacing:0.24em;color:{SB_CREAM};">EPICKOR.COM</div>
  </div>
  <div style="position:absolute;right:56px;top:56px;z-index:30;font-family:{SB_MONO};
    font-size:13px;font-weight:700;letter-spacing:0.18em;color:{SB_CREAM50};">SERIAL {no}</div>'''


def sb_foot(meta, index, total):
    dots = ''.join(
        f'<div style="width:{11 if d == index else 9}px;height:{11 if d == index else 9}px;border-radius:50%;'
        + (f'background:{SB_BRASS};box-shadow:0 0 0 3px rgba(228,183,94,0.28);'
           if d == index else 'background:rgba(245,235,211,0.34);')
        + '"></div>'
        for d in range(1, total + 1))
    return f'''
  <div style="position:absolute;left:70px;right:70px;top:1006px;z-index:26;display:flex;
    align-items:center;justify-content:space-between;">
    <div style="font-family:{SB_MONO};font-size:12px;font-weight:700;letter-spacing:0.2em;
      color:{SB_CREAM50};">{meta.get('series','KOREAN MAKERS')} · FILE 01</div>
    <div style="display:flex;gap:12px;align-items:center;">{dots}</div>
    <div style="font-family:{SB_MONO};font-size:12px;font-weight:700;letter-spacing:0.2em;
      color:{SB_CREAM50};">{index:02d} / {total:02d}</div>
  </div>'''


def sb_strings(width=150, center=True):
    rows = ''.join(
        f'<div style="height:{h}px;background:rgba(245,235,211,{o});"></div>'
        for h, o in ((1, .30), (1, .34), (1.5, .38), (1.5, .42), (2, .46), (2.5, .5)))
    margin = 'margin-left:auto;margin-right:auto;' if center else ''
    return f'<div style="width:{width}px;{margin}display:flex;flex-direction:column;gap:5px;">{rows}</div>'


def sb_kicker(text):
    return f'''<div style="font-family:{SB_MONO};font-size:16px;font-weight:700;
      letter-spacing:0.26em;color:{SB_BRASS};">{text}</div>'''


def sb_chip(text):
    if not text:
        return ''
    return f'''<div style="display:inline-block;background:{SB_BRASS};color:{SB_DARK};
      font-family:{SB_MONO};font-size:15px;font-weight:700;letter-spacing:0.16em;
      padding:8px 18px;">{text}</div>'''


def sb_plate(card, w, h):
    if not card['image']:
        return ''
    fitmode = ('width:100%;height:100%;object-fit:cover;' if card['fit'] == 'cover'
               else 'max-width:100%;max-height:100%;object-fit:contain;')
    return f'''
  <div style="width:{w}px;">
    <div style="height:{h}px;background:{SB_CREAM};padding:12px;
      box-shadow:0 18px 48px rgba(20,10,3,0.5);">
      <div style="width:100%;height:100%;overflow:hidden;background:#FFFFFF;display:flex;
        align-items:center;justify-content:center;">
        <img src="{card['image']}" alt="{card['image_label']}" style="{fitmode}display:block;"></div>
    </div>
    <div style="margin-top:12px;font-family:{SB_MONO};font-size:12px;font-weight:700;
      letter-spacing:0.1em;color:{SB_CREAM50};text-transform:uppercase;
      line-height:1.4;">{card['image_label']}</div>
  </div>'''


def sb_koline(card):
    """세로 낙관 — 카드당 최대 한 줄의 한국어, 좌측 프레임을 따라 세운다."""
    if not card['ko_line']:
        return ''
    return f'''
  <div style="position:absolute;left:47px;top:0;bottom:0;z-index:24;display:flex;
    align-items:center;justify-content:center;">
    <div style="writing-mode:vertical-rl;font-family:{SB_KO};font-size:14px;font-weight:600;
      letter-spacing:0.42em;color:rgba(245,235,211,0.62);">{card['ko_line']}</div>
  </div>'''


def build_sunburst(meta, card, index, total):
    no = f"SMK-{index:02d}"
    mode = card['mode']

    if mode == 'cover':
        return f'''
  {sb_ground()}
  {sb_koline(card)}
  <div data-flow="1" style="position:absolute;left:120px;right:120px;top:112px;height:880px;
    z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:26px;text-align:center;">
    {sb_kicker(card['kicker'])}
    <div style="font-family:{SB_SERIF};font-size:{fit_size(card['main'], 800, 88, 0.74)}px;
      font-weight:700;color:{SB_CREAM};line-height:1.05;letter-spacing:-0.01em;
      text-shadow:0 4px 30px rgba(20,10,3,0.45);">{esc(card['main'])}</div>
    {sb_strings()}
    <div style="font-family:{SB_SERIF};font-style:italic;font-size:25px;color:{SB_CREAM70};
      line-height:1.5;max-width:720px;">{esc(card['sub'])}</div>
    {sb_chip(card['stamp'])}
    {sb_plate(card, 470, 260)}
  </div>
  {sb_foot(meta, index, total)}
  {sb_watermark(no)}'''

    if mode == 'number':
        return f'''
  {sb_ground()}
  {sb_koline(card)}
  <div data-flow="1" style="position:absolute;left:120px;right:120px;top:120px;height:860px;
    z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:24px;text-align:center;">
    {sb_kicker(card['kicker'])}
    <div style="font-family:{SB_SERIF};font-size:{fit_size(card['num'], 780, 280, 0.58)}px;
      font-weight:700;color:{SB_BRASS};line-height:0.95;letter-spacing:-0.02em;
      text-shadow:0 6px 40px rgba(20,10,3,0.5);">{esc(card['num'])}</div>
    <div style="font-family:{SB_SERIF};font-size:31px;font-weight:700;color:{SB_CREAM};
      line-height:1.3;max-width:760px;">{esc(card['num_label'])}</div>
    {sb_strings()}
    <div style="font-family:{SB_SERIF};font-style:italic;font-size:24px;color:{SB_CREAM70};
      line-height:1.52;max-width:760px;">{esc(card['sub'])}</div>
    {sb_chip(card['stamp'])}
  </div>
  {sb_foot(meta, index, total)}
  {sb_watermark(no)}'''

    if mode == 'end':
        return f'''
  {sb_ground()}
  {sb_koline(card)}
  <div data-flow="1" style="position:absolute;left:120px;right:120px;top:112px;height:880px;
    z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:26px;text-align:center;">
    {sb_kicker(card['kicker'])}
    <div style="font-family:{SB_SERIF};font-size:{fit_size(card['main'], 780, 76, 0.74)}px;
      font-weight:700;color:{SB_CREAM};line-height:1.06;">{esc(card['main'])}</div>
    <div style="font-family:{SB_SERIF};font-style:italic;font-size:24px;color:{SB_CREAM70};
      line-height:1.5;max-width:700px;">{esc(card['sub'])}</div>
    {sb_plate(card, 440, 240)}
    <div style="background:{SB_BRASS};color:{SB_DARK};font-family:{SB_SERIF};font-weight:700;
      font-size:28px;letter-spacing:0.1em;padding:16px 42px;">EPICKOR.COM</div>
  </div>
  {sb_foot(meta, index, total)}
  {sb_watermark(no)}'''

    # item: text left, catalog plate right
    head = card['name_en'] or card['main']
    num_block = ''
    if card['num']:
        num_block = f'''
    <div style="font-family:{SB_SERIF};font-size:{fit_size(card['num'], 430, 92, 0.58)}px;
      font-weight:700;color:{SB_BRASS};line-height:1;">{esc(card['num'])}</div>
    <div style="font-family:{SB_MONO};font-size:14px;font-weight:700;letter-spacing:0.14em;
      color:{SB_CREAM70};">{esc(card['num_label'])}</div>'''
    note = ''
    if card['note']:
        note = f'''
    <div style="border-left:3px solid {SB_BRASS};padding-left:16px;font-family:{SB_SERIF};
      font-style:italic;font-size:20px;color:{SB_CREAM70};line-height:1.45;">{esc(card['note'])}</div>'''
    return f'''
  {sb_ground()}
  {sb_koline(card)}
  <div style="position:absolute;left:104px;right:76px;top:120px;height:860px;z-index:20;
    display:flex;align-items:center;gap:44px;">
    <div data-flow="1" style="flex:1.08;display:flex;flex-direction:column;gap:20px;min-width:0;">
      {sb_kicker(card['kicker'])}
      <div style="font-family:{SB_SERIF};font-size:{fit_size(head, 440, 56)}px;font-weight:700;
        color:{SB_CREAM};line-height:1.1;letter-spacing:-0.005em;">{esc(head)}</div>
      {sb_strings(120, center=False)}
      <div style="font-family:{SB_SERIF};font-size:22px;color:{SB_CREAM70};
        line-height:1.52;">{esc(card['sub'])}</div>
      {num_block}
      {note}
    </div>
    <div data-flow="1" style="flex:0 0 420px;">{sb_plate(card, 420, 560)}</div>
  </div>
  {sb_foot(meta, index, total)}
  {sb_watermark(no)}'''


# ============================================================ BLADE (dorco)

BL_BG = '#F3F6F9'
BL_INK = '#10202E'
BL_STEEL = 'rgba(16,32,46,0.56)'
BL_STEEL35 = 'rgba(16,32,46,0.36)'
BL_BLUE = '#1E5F9E'
BL_RED = '#C8271E'
BL_DIN = "'Bahnschrift','Segoe UI',Arial,sans-serif"
BL_KO = "'Malgun Gothic','Segoe UI',sans-serif"


def bl_ground():
    return f'''
  <div style="position:absolute;inset:0;background:
    linear-gradient(180deg,#FAFCFE 0%,{BL_BG} 34%,#E9EEF4 100%);"></div>
  <div style="position:absolute;inset:0;background:
    repeating-linear-gradient(180deg,rgba(16,32,46,0.026) 0 1px,transparent 1px 7px);"></div>'''


def bl_micro(text, color=BL_BLUE):
    return f'''<div style="font-family:{BL_DIN};font-weight:600;font-size:14px;
      letter-spacing:0.3em;color:{color};text-transform:uppercase;">{text}</div>'''


def bl_watermark():
    return f'''
  <div style="position:absolute;left:56px;top:50px;z-index:30;display:flex;align-items:center;gap:12px;">
    <div style="width:30px;height:30px;border:2.5px solid {BL_INK};display:flex;align-items:center;
      justify-content:center;font-family:{BL_DIN};font-size:12px;font-weight:700;color:{BL_INK};">EK</div>
    <div style="font-family:{BL_DIN};font-size:14px;font-weight:700;letter-spacing:0.26em;
      color:{BL_INK};">EPICKOR.COM</div>
  </div>'''


def bl_ticks(index, total, right_px=56):
    bars = ''.join(
        f'<div style="width:4px;height:{26 if d == index else 16}px;'
        + (f'background:{BL_BLUE};' if d == index else f'background:{BL_STEEL35};')
        + '"></div>'
        for d in range(1, total + 1))
    return f'''
  <div style="position:absolute;right:{right_px}px;top:48px;z-index:30;display:flex;gap:7px;
    align-items:flex-start;">{bars}</div>'''


def bl_foot(meta, index, total):
    return f'''
  <div style="position:absolute;left:56px;right:56px;top:1014px;z-index:26;
    border-top:2px solid {BL_INK};padding-top:10px;display:flex;
    justify-content:space-between;align-items:center;">
    <div style="font-family:{BL_DIN};font-weight:600;font-size:12px;letter-spacing:0.28em;
      color:{BL_STEEL};">DORCO — KOREAN MAKERS · FILE 02</div>
    <div style="font-family:{BL_DIN};font-weight:700;font-size:12px;letter-spacing:0.28em;
      color:{BL_INK};">{index:02d} / {total:02d}</div>
  </div>'''


def bl_edge(top, width=1130, rot=-2.5):
    """The blade edge: an ink line with a red hairline glint, running parallel
    to (and just above) the photo's clipped top edge. The rotation must match
    the photo clip slope — a steeper angle sends the line through the text."""
    return f'''
  <div style="position:absolute;left:0;top:{top}px;width:{width}px;z-index:8;
    transform:rotate({rot}deg);transform-origin:left center;">
    <div style="height:3px;background:{BL_INK};"></div>
    <div style="height:1.5px;background:{BL_RED};margin-top:7px;"></div>
  </div>'''


def bl_koline(card):
    if not card['ko_line']:
        return ''
    return f'''
  <div style="position:absolute;right:60px;top:0;bottom:0;z-index:24;display:flex;
    align-items:center;">
    <div style="writing-mode:vertical-rl;font-family:{BL_KO};font-size:13px;font-weight:600;
      letter-spacing:0.42em;color:{BL_STEEL35};">{card['ko_line']}</div>
  </div>'''


def bl_photo(card, w, h, clip='polygon(0 7%, 100% 0, 100% 100%, 0 100%)'):
    if not card['image']:
        return ''
    fitmode = ('width:100%;height:100%;object-fit:cover;' if card['fit'] == 'cover'
               else 'max-width:92%;max-height:92%;object-fit:contain;')
    return f'''
  <div style="width:{w}px;height:{h}px;overflow:hidden;clip-path:{clip};background:#FFFFFF;
    display:flex;align-items:center;justify-content:center;
    box-shadow:0 16px 44px rgba(16,32,46,0.16);">
    <img src="{card['image']}" alt="{card['image_label']}" style="{fitmode}display:block;"></div>'''


def build_blade(meta, card, index, total):
    mode = card['mode']

    if mode == 'cover':
        return f'''
  {bl_ground()}
  {bl_koline(card)}
  <div data-flow="1" style="position:absolute;left:88px;right:110px;top:140px;height:420px;
    z-index:20;display:flex;flex-direction:column;gap:22px;justify-content:center;">
    {bl_micro(card['kicker'])}
    <div style="font-family:{BL_DIN};font-stretch:77%;font-weight:700;
      font-size:{fit_size(card['main'], 860, 96, 0.5)}px;color:{BL_INK};line-height:1.02;
      letter-spacing:0.005em;text-transform:uppercase;">{esc(card['main'])}</div>
    <div style="display:flex;align-items:center;gap:16px;">
      <div style="width:54px;height:2px;background:{BL_RED};"></div>
      {bl_micro(card['stamp'], BL_INK)}
    </div>
    <div style="font-family:{BL_DIN};font-weight:400;font-size:24px;color:{BL_STEEL};
      line-height:1.5;max-width:700px;">{esc(card['sub'])}</div>
  </div>
  {bl_edge(654, rot=-2.5)}
  <div style="position:absolute;left:0;right:0;top:610px;height:390px;z-index:6;overflow:hidden;">
    <img src="{card['image']}" alt="{card['image_label']}"
      style="width:100%;height:130%;object-fit:cover;object-position:center 30%;display:block;
      clip-path:polygon(0 14%, 100% 2%, 100% 100%, 0 100%);"></div>
  <div style="position:absolute;left:88px;top:962px;z-index:22;font-family:{BL_DIN};
    font-weight:600;font-size:12px;letter-spacing:0.22em;color:#FFFFFF;
    text-shadow:0 1px 8px rgba(16,32,46,0.7);text-transform:uppercase;">{card['image_label']}</div>
  {bl_foot(meta, index, total)}
  {bl_watermark()}
  {bl_ticks(index, total)}'''

    if mode == 'number':
        return f'''
  {bl_ground()}
  {bl_edge(290, rot=-14)}
  {bl_koline(card)}
  <div data-flow="1" style="position:absolute;left:96px;right:120px;top:140px;height:840px;
    z-index:20;display:flex;flex-direction:column;gap:26px;justify-content:center;">
    {bl_micro(card['kicker'])}
    <div style="font-family:{BL_DIN};font-stretch:80%;font-weight:700;
      font-size:{fit_size(card['num'], 820, 290, 0.52)}px;color:{BL_INK};line-height:0.96;
      letter-spacing:-0.01em;font-variant-numeric:tabular-nums;">{esc(card['num'])}</div>
    <div style="font-family:{BL_DIN};font-weight:600;font-size:27px;color:{BL_BLUE};
      line-height:1.3;letter-spacing:0.04em;text-transform:uppercase;
      max-width:780px;">{esc(card['num_label'])}</div>
    <div style="width:54px;height:2px;background:{BL_RED};"></div>
    <div style="font-family:{BL_DIN};font-weight:400;font-size:24px;color:{BL_STEEL};
      line-height:1.55;max-width:760px;">{esc(card['sub'])}</div>
    {bl_micro(card['stamp'], BL_INK)}
  </div>
  {bl_foot(meta, index, total)}
  {bl_watermark()}
  {bl_ticks(index, total)}'''

    if mode == 'end':
        return f'''
  {bl_ground()}
  {bl_koline(card)}
  <div data-flow="1" style="position:absolute;left:88px;right:110px;top:130px;height:430px;
    z-index:20;display:flex;flex-direction:column;gap:22px;justify-content:center;">
    {bl_micro(card['kicker'])}
    <div style="font-family:{BL_DIN};font-stretch:77%;font-weight:700;
      font-size:{fit_size(card['main'], 860, 86, 0.5)}px;color:{BL_INK};line-height:1.04;
      text-transform:uppercase;">{esc(card['main'])}</div>
    <div style="font-family:{BL_DIN};font-weight:400;font-size:23px;color:{BL_STEEL};
      line-height:1.5;max-width:700px;">{esc(card['sub'])}</div>
    <div style="display:inline-flex;"><div style="background:{BL_INK};color:#FFFFFF;
      font-family:{BL_DIN};font-weight:700;font-size:26px;letter-spacing:0.12em;
      padding:16px 40px;">EPICKOR.COM</div></div>
  </div>
  {bl_edge(664, rot=-2.4)}
  <div style="position:absolute;left:0;right:0;top:620px;height:380px;z-index:6;overflow:hidden;">
    <img src="{card['image']}" alt="{card['image_label']}"
      style="width:100%;height:132%;object-fit:cover;object-position:center 35%;display:block;
      clip-path:polygon(0 14%, 100% 2%, 100% 100%, 0 100%);"></div>
  {bl_foot(meta, index, total)}
  {bl_watermark()}
  {bl_ticks(index, total)}'''

    # item: text left, diagonally-cut photo right.
    # The edge is drawn as two under-layers sharing the photo's clip geometry
    # (offset a few % further left), so the ink line and red glint always run
    # exactly parallel to the photo edge — a free-rotated divider drifts.
    head = card['name_en'] or card['main']
    num_block = ''
    if card['num']:
        num_block = f'''
    <div style="font-family:{BL_DIN};font-stretch:82%;font-weight:700;
      font-size:{fit_size(card['num'], 430, 88, 0.55)}px;color:{BL_BLUE};line-height:1;
      font-variant-numeric:tabular-nums;">{esc(card['num'])}</div>
    <div style="font-family:{BL_DIN};font-weight:600;font-size:14px;letter-spacing:0.2em;
      color:{BL_INK};text-transform:uppercase;">{esc(card['num_label'])}</div>'''
    note = ''
    if card['note']:
        note = f'''
    <div style="border-left:2px solid {BL_RED};padding-left:16px;font-family:{BL_DIN};
      font-weight:400;font-size:19px;color:{BL_INK};line-height:1.45;">{esc(card['note'])}</div>'''
    return f'''
  {bl_ground()}
  <div style="position:absolute;right:0;top:0;height:1002px;width:430px;z-index:4;
    background:{BL_RED};clip-path:polygon(16.5% 0, 100% 0, 100% 100%, 0.5% 100%);"></div>
  <div style="position:absolute;right:0;top:0;height:1002px;width:430px;z-index:5;
    background:{BL_BG};clip-path:polygon(17.5% 0, 100% 0, 100% 100%, 1.5% 100%);"></div>
  <div style="position:absolute;right:0;top:0;height:1002px;width:430px;z-index:6;
    background:{BL_INK};clip-path:polygon(19.5% 0, 100% 0, 100% 100%, 3.5% 100%);"></div>
  <div style="position:absolute;right:0;top:0;height:1002px;width:430px;z-index:7;overflow:hidden;">
    <img src="{card['image']}" alt="{card['image_label']}"
      style="width:118%;height:100%;object-fit:cover;display:block;
      clip-path:polygon(22% 0, 100% 0, 100% 100%, 6% 100%);"></div>
  <div data-flow="1" style="position:absolute;left:88px;width:500px;top:130px;height:850px;
    z-index:20;display:flex;flex-direction:column;gap:20px;justify-content:center;">
    {bl_micro(card['kicker'])}
    <div style="font-family:{BL_DIN};font-stretch:78%;font-weight:700;
      font-size:{fit_size(head, 490, 58, 0.5)}px;color:{BL_INK};line-height:1.08;
      text-transform:uppercase;">{esc(head)}</div>
    <div style="font-family:{BL_DIN};font-weight:400;font-size:22px;color:{BL_STEEL};
      line-height:1.55;">{esc(card['sub'])}</div>
    {num_block}
    {note}
  </div>
  <div style="position:absolute;right:24px;top:948px;z-index:22;font-family:{BL_DIN};
    font-weight:600;font-size:12px;letter-spacing:0.18em;color:#FFFFFF;
    text-shadow:0 1px 8px rgba(16,32,46,0.75);text-transform:uppercase;
    max-width:380px;text-align:right;">{card['image_label']}</div>
  {bl_foot(meta, index, total)}
  {bl_watermark()}
  {bl_ticks(index, total, right_px=478)}'''


# ============================================================ HOMEDRAMA (cuckoo)

HD_CREAM = '#FBF3E2'
HD_BROWN = '#43301F'
HD_BROWN70 = 'rgba(67,48,31,0.72)'
HD_BROWN45 = 'rgba(67,48,31,0.45)'
HD_RED = '#C8271E'
HD_GOLD = '#D9A441'
HD_ROUND = "'Arial Rounded MT Bold','Segoe UI',sans-serif"
HD_BODY = "'Segoe UI','Malgun Gothic',sans-serif"


def hd_ground():
    return f'''
  <div style="position:absolute;inset:0;background:{HD_CREAM};"></div>
  <div style="position:absolute;inset:24px;border:3px solid {HD_BROWN};border-radius:46px;z-index:5;"></div>
  <div style="position:absolute;inset:33px;border:1.5px solid {HD_GOLD};border-radius:38px;z-index:5;"></div>'''


def hd_watermark():
    return f'''
  <div style="position:absolute;left:64px;top:56px;z-index:30;display:flex;align-items:center;gap:12px;">
    <div style="width:32px;height:32px;border:3px solid {HD_BROWN};border-radius:10px;display:flex;
      align-items:center;justify-content:center;font-family:{HD_ROUND};font-size:12px;
      color:{HD_BROWN};">EK</div>
    <div style="font-family:{HD_ROUND};font-size:14px;letter-spacing:0.2em;
      color:{HD_BROWN};">EPICKOR.COM</div>
  </div>'''


def hd_badge(text, bg=HD_RED, fg='#FFFFFF'):
    if not text:
        return ''
    return f'''<div style="display:inline-block;background:{bg};color:{fg};
      font-family:{HD_ROUND};font-size:16px;letter-spacing:0.14em;padding:9px 22px;
      border-radius:999px;text-transform:uppercase;">{text}</div>'''


def hd_foot(meta, index, total):
    return f'''
  <div style="position:absolute;left:64px;right:64px;top:1002px;height:44px;z-index:26;
    background:{HD_BROWN};border-radius:999px;display:flex;align-items:center;
    justify-content:space-between;padding:0 26px;">
    <div style="font-family:{HD_ROUND};font-size:12px;letter-spacing:0.18em;color:{HD_CREAM};">CH · EPICKOR</div>
    <div style="font-family:{HD_ROUND};font-size:12px;letter-spacing:0.18em;color:{HD_GOLD};">KOREAN MAKERS · FILE 03</div>
    <div style="font-family:{HD_ROUND};font-size:12px;letter-spacing:0.18em;color:{HD_CREAM};">EP {index:02d}/{total:02d}</div>
  </div>'''


def hd_arch(card, w, h):
    if not card['image']:
        return ''
    return f'''
  <div style="width:{w}px;">
    <div style="height:{h}px;background:#FFFFFF;border:5px solid {HD_BROWN};
      border-radius:{w // 2}px {w // 2}px 26px 26px;overflow:hidden;display:flex;
      align-items:flex-end;justify-content:center;box-shadow:0 14px 34px rgba(67,48,31,0.18),
      inset 0 0 0 3px {HD_GOLD};padding:18px;">
      <img src="{card['image']}" alt="{card['image_label']}"
        style="max-width:100%;max-height:96%;object-fit:contain;display:block;"></div>
    <div style="margin-top:12px;font-family:{HD_BODY};font-weight:600;font-size:12.5px;
      letter-spacing:0.08em;color:{HD_BROWN45};text-transform:uppercase;text-align:center;
      line-height:1.4;">{card['image_label']}</div>
  </div>'''


def hd_koline(card):
    if not card['ko_line']:
        return ''
    return f'''
  <div style="position:absolute;left:0;right:0;top:962px;z-index:24;text-align:center;
    font-family:{HD_BODY};font-weight:600;font-size:14px;letter-spacing:0.34em;
    color:{HD_BROWN45};">{card['ko_line']}</div>'''


def hd_main_twotone(main, cap, col_px):
    parts = lines_of(main)
    size = fit_size(main, col_px, cap, 0.66)
    if len(parts) >= 2:
        first = f'<span style="color:{HD_RED};">{parts[0]}</span>'
        rest = '<br>'.join(parts[1:])
        body = f'{first}<br>{rest}'
    else:
        body = esc(main)
    return f'''<div style="font-family:{HD_ROUND};font-size:{size}px;color:{HD_BROWN};
      line-height:1.08;letter-spacing:0.005em;">{body}</div>'''


def build_homedrama(meta, card, index, total):
    mode = card['mode']

    if mode == 'cover':
        return f'''
  {hd_ground()}
  {hd_koline(card)}
  <div data-flow="1" style="position:absolute;left:110px;right:110px;top:110px;height:850px;
    z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:24px;text-align:center;">
    {hd_badge(card['kicker'])}
    {hd_main_twotone(card['main'], 84, 800)}
    <div style="font-family:{HD_BODY};font-weight:500;font-size:24px;color:{HD_BROWN70};
      line-height:1.5;max-width:720px;">{esc(card['sub'])}</div>
    {hd_badge(card['stamp'], HD_GOLD, HD_BROWN)}
    {hd_arch(card, 330, 300)}
  </div>
  {hd_foot(meta, index, total)}
  {hd_watermark()}'''

    if mode == 'number':
        return f'''
  {hd_ground()}
  {hd_koline(card)}
  <div data-flow="1" style="position:absolute;left:110px;right:110px;top:120px;height:840px;
    z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:22px;text-align:center;">
    {hd_badge(card['kicker'])}
    <div style="font-family:{HD_ROUND};font-size:{fit_size(card['num'], 760, 270, 0.62)}px;
      color:{HD_RED};line-height:0.95;font-variant-numeric:tabular-nums;">{esc(card['num'])}</div>
    <div style="font-family:{HD_ROUND};font-size:30px;color:{HD_BROWN};line-height:1.3;
      max-width:760px;">{esc(card['num_label'])}</div>
    <div style="width:120px;height:4px;border-radius:99px;background:{HD_GOLD};"></div>
    <div style="font-family:{HD_BODY};font-weight:500;font-size:23px;color:{HD_BROWN70};
      line-height:1.55;max-width:760px;">{esc(card['sub'])}</div>
    {hd_badge(card['stamp'], HD_GOLD, HD_BROWN)}
  </div>
  {hd_foot(meta, index, total)}
  {hd_watermark()}'''

    if mode == 'end':
        return f'''
  {hd_ground()}
  {hd_koline(card)}
  <div data-flow="1" style="position:absolute;left:110px;right:110px;top:110px;height:850px;
    z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:24px;text-align:center;">
    {hd_badge(card['kicker'])}
    {hd_main_twotone(card['main'], 68, 780)}
    <div style="font-family:{HD_BODY};font-weight:500;font-size:23px;color:{HD_BROWN70};
      line-height:1.5;max-width:700px;">{esc(card['sub'])}</div>
    {hd_arch(card, 300, 270)}
    <div style="background:{HD_RED};color:#FFFFFF;font-family:{HD_ROUND};font-size:27px;
      letter-spacing:0.1em;padding:16px 44px;border-radius:999px;">EPICKOR.COM</div>
  </div>
  {hd_foot(meta, index, total)}
  {hd_watermark()}'''

    # item: text left, arch photo right
    head = card['name_en'] or card['main']
    num_block = ''
    if card['num']:
        num_block = f'''
    <div style="font-family:{HD_ROUND};font-size:{fit_size(card['num'], 440, 86, 0.62)}px;
      color:{HD_RED};line-height:1;font-variant-numeric:tabular-nums;">{esc(card['num'])}</div>
    <div style="font-family:{HD_ROUND};font-size:15px;letter-spacing:0.14em;color:{HD_BROWN};
      text-transform:uppercase;">{esc(card['num_label'])}</div>'''
    note = ''
    if card['note']:
        note = f'''
    <div style="background:#FFFFFF;border-radius:18px;padding:16px 20px;
      border-left:5px solid {HD_GOLD};font-family:{HD_BODY};font-weight:500;font-size:19px;
      color:{HD_BROWN};line-height:1.45;box-shadow:0 8px 20px rgba(67,48,31,0.08);">{esc(card['note'])}</div>'''
    return f'''
  {hd_ground()}
  {hd_koline(card)}
  <div style="position:absolute;left:100px;right:84px;top:120px;height:840px;z-index:20;
    display:flex;align-items:center;gap:40px;">
    <div data-flow="1" style="flex:1.15;display:flex;flex-direction:column;gap:19px;min-width:0;">
      {hd_badge(card['kicker'])}
      <div style="font-family:{HD_ROUND};font-size:{fit_size(head, 470, 54, 0.66)}px;
        color:{HD_BROWN};line-height:1.12;">{esc(head)}</div>
      <div style="font-family:{HD_BODY};font-weight:500;font-size:21.5px;color:{HD_BROWN70};
        line-height:1.52;">{esc(card['sub'])}</div>
      {num_block}
      {note}
    </div>
    <div data-flow="1" style="flex:0 0 370px;">{hd_arch(card, 370, 470)}</div>
  </div>
  {hd_foot(meta, index, total)}
  {hd_watermark()}'''


# ============================================================ NOTEBOOK (monami)

NB_PAPER = '#FBF8F1'
NB_INK = '#26241F'
NB_INK70 = 'rgba(38,36,31,0.72)'
NB_INK45 = 'rgba(38,36,31,0.45)'
NB_BLUE = '#1B3FAB'
NB_RED = '#D23B2E'
NB_LINE = 'rgba(27,63,171,0.13)'
NB_SANS = "'Segoe UI',Arial,sans-serif"
NB_HAND = "'Ink Free','Segoe Print','Segoe UI',cursive"
NB_MONO = "'Consolas','Courier New',monospace"
NB_KO = "'Malgun Gothic','Segoe UI',sans-serif"


def nb_ground():
    return f'''
  <div style="position:absolute;inset:0;background:{NB_PAPER};"></div>
  <div style="position:absolute;inset:0;background:
    repeating-linear-gradient(180deg,transparent 0 45px,{NB_LINE} 45px 46.5px);"></div>
  <div style="position:absolute;left:118px;top:0;bottom:0;width:1.5px;
    background:rgba(210,59,46,0.45);"></div>'''


def nb_watermark():
    return f'''
  <div style="position:absolute;left:52px;top:34px;z-index:30;display:flex;align-items:center;gap:12px;">
    <div style="width:30px;height:30px;border:2.5px solid {NB_INK};display:flex;align-items:center;
      justify-content:center;font-family:{NB_SANS};font-size:12px;font-weight:900;color:{NB_INK};
      background:#FFFFFF;">EK</div>
    <div style="font-family:{NB_SANS};font-size:14px;font-weight:900;letter-spacing:0.24em;
      color:{NB_INK};">EPICKOR.COM</div>
  </div>'''


def nb_tally(index):
    """바를 정(正)식 획 진행표시 — 5획 묶음(세로 4 + 사선 1) + 나머지."""
    groups = []
    left = index
    while left > 0:
        n = min(left, 5)
        bars = ''.join(f'<div style="width:4px;height:26px;background:{NB_INK};"></div>' for _ in range(min(n, 4)))
        cross = ('<div style="position:absolute;left:-4px;top:10px;width:44px;height:4px;'
                 f'background:{NB_INK};transform:rotate(-24deg);"></div>') if n == 5 else ''
        groups.append(f'<div style="position:relative;display:flex;gap:7px;">{bars}{cross}</div>')
        left -= n
    return f'<div style="display:flex;gap:16px;align-items:center;">{"".join(groups)}</div>'


def nb_foot(index, total):
    return f'''
  <div style="position:absolute;left:52px;right:52px;top:1008px;z-index:26;
    border-top:2px solid rgba(38,36,31,0.22);padding-top:11px;display:flex;
    justify-content:space-between;align-items:center;">
    <div style="font-family:{NB_MONO};font-size:12px;font-weight:700;letter-spacing:0.2em;
      color:{NB_INK45};">MONAMI — KOREAN MAKERS · FILE 04</div>
    {nb_tally(index)}
    <div style="font-family:{NB_MONO};font-size:12px;font-weight:700;letter-spacing:0.2em;
      color:{NB_INK45};">p.{index:02d} / {total:02d}</div>
  </div>'''


def nb_kicker(text):
    return f'''<div style="font-family:{NB_HAND};font-size:26px;font-weight:700;
      color:{NB_RED};letter-spacing:0.04em;">{text}</div>'''


def nb_stamp(text):
    if not text:
        return ''
    return f'''<div style="display:inline-block;transform:rotate(-3deg);border:3px double {NB_RED};
      color:{NB_RED};font-family:{NB_MONO};font-weight:700;font-size:17px;letter-spacing:0.16em;
      padding:8px 16px;border-radius:4px;opacity:0.9;">{text}</div>'''


def nb_photo(card, w, h):
    if not card['image']:
        return ''
    fitmode = ('width:100%;height:100%;object-fit:cover;' if card['fit'] == 'cover'
               else 'max-width:100%;max-height:100%;object-fit:contain;')
    return f'''
  <div style="width:{w}px;position:relative;">
    <div style="background:#FFFFFF;padding:12px;box-shadow:0 12px 30px rgba(38,36,31,0.18);">
      <div style="height:{h}px;overflow:hidden;display:flex;align-items:center;justify-content:center;">
        <img src="{card['image']}" alt="{card['image_label']}" style="{fitmode}display:block;"></div>
    </div>
    <div style="position:absolute;left:50%;top:-14px;width:130px;height:30px;margin-left:-65px;
      background:rgba(233,222,187,0.88);transform:rotate(-3deg);
      box-shadow:0 2px 6px rgba(38,36,31,0.12);"></div>
    <div style="margin-top:12px;font-family:{NB_MONO};font-size:12px;font-weight:700;
      letter-spacing:0.08em;color:{NB_INK45};text-transform:uppercase;
      line-height:1.4;">{card['image_label']}</div>
  </div>'''


def nb_koline(card):
    if not card['ko_line']:
        return ''
    return f'''
  <div style="position:absolute;left:56px;top:0;bottom:0;z-index:24;display:flex;
    align-items:center;justify-content:center;">
    <div style="writing-mode:vertical-rl;font-family:{NB_KO};font-size:14px;font-weight:600;
      letter-spacing:0.4em;color:rgba(27,63,171,0.6);">{card['ko_line']}</div>
  </div>'''


def build_notebook(meta, card, index, total):
    mode = card['mode']

    if mode == 'cover':
        return f'''
  {nb_ground()}
  {nb_koline(card)}
  <div data-flow="1" style="position:absolute;left:180px;right:120px;top:104px;height:880px;
    z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:24px;text-align:center;">
    {nb_kicker(card['kicker'])}
    <div style="font-family:{NB_SANS};font-size:{fit_size(card['main'], 760, 82, 0.68)}px;
      font-weight:900;color:{NB_INK};line-height:1.06;letter-spacing:-0.015em;">{esc(card['main'])}</div>
    <div style="width:150px;height:5px;background:{NB_BLUE};border-radius:99px;"></div>
    <div style="font-family:{NB_SANS};font-weight:500;font-size:24px;color:{NB_INK70};
      line-height:1.5;max-width:700px;">{esc(card['sub'])}</div>
    {nb_stamp(card['stamp'])}
    {nb_photo(card, 470, 240)}
  </div>
  {nb_foot(index, total)}
  {nb_watermark()}'''

    if mode == 'number':
        note = ''
        if card['note']:
            note = f'''
    <div style="font-family:{NB_HAND};font-size:23px;font-weight:700;color:{NB_RED};
      line-height:1.35;max-width:720px;">{esc(card['note'])}</div>'''
        return f'''
  {nb_ground()}
  {nb_koline(card)}
  <div data-flow="1" style="position:absolute;left:180px;right:120px;top:110px;height:870px;
    z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:22px;text-align:center;">
    {nb_kicker(card['kicker'])}
    <div style="font-family:{NB_SANS};font-size:{fit_size(card['num'], 720, 250, 0.62)}px;
      font-weight:900;color:{NB_BLUE};line-height:0.98;letter-spacing:-0.03em;
      font-variant-numeric:tabular-nums;">{esc(card['num'])}</div>
    <div style="font-family:{NB_SANS};font-size:29px;font-weight:800;color:{NB_INK};
      line-height:1.3;max-width:740px;">{esc(card['num_label'])}</div>
    <div style="font-family:{NB_SANS};font-weight:500;font-size:23px;color:{NB_INK70};
      line-height:1.52;max-width:740px;">{esc(card['sub'])}</div>
    {note}
    {nb_stamp(card['stamp'])}
  </div>
  {nb_foot(index, total)}
  {nb_watermark()}'''

    if mode == 'end':
        return f'''
  {nb_ground()}
  {nb_koline(card)}
  <div data-flow="1" style="position:absolute;left:180px;right:120px;top:104px;height:880px;
    z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:24px;text-align:center;">
    {nb_kicker(card['kicker'])}
    <div style="font-family:{NB_SANS};font-size:{fit_size(card['main'], 740, 74, 0.68)}px;
      font-weight:900;color:{NB_INK};line-height:1.06;">{esc(card['main'])}</div>
    <div style="font-family:{NB_SANS};font-weight:500;font-size:23px;color:{NB_INK70};
      line-height:1.5;max-width:700px;">{esc(card['sub'])}</div>
    {nb_photo(card, 440, 230)}
    <div style="background:{NB_BLUE};color:#FFFFFF;font-family:{NB_SANS};font-weight:900;
      font-size:27px;letter-spacing:0.1em;padding:16px 42px;">EPICKOR.COM</div>
  </div>
  {nb_foot(index, total)}
  {nb_watermark()}'''

    # item: text left, taped photo right
    head = card['name_en'] or card['main']
    num_block = ''
    if card['num']:
        num_block = f'''
    <div style="font-family:{NB_SANS};font-size:{fit_size(card['num'], 430, 84, 0.62)}px;
      font-weight:900;color:{NB_BLUE};line-height:1;font-variant-numeric:tabular-nums;">{esc(card['num'])}</div>
    <div style="font-family:{NB_MONO};font-size:14px;font-weight:700;letter-spacing:0.16em;
      color:{NB_INK};text-transform:uppercase;">{esc(card['num_label'])}</div>'''
    note = ''
    if card['note']:
        note = f'''
    <div style="font-family:{NB_HAND};font-size:22px;font-weight:700;color:{NB_RED};
      line-height:1.35;">{esc(card['note'])}</div>'''
    return f'''
  {nb_ground()}
  {nb_koline(card)}
  <div style="position:absolute;left:170px;right:84px;top:110px;height:870px;z-index:20;
    display:flex;align-items:center;gap:44px;">
    <div data-flow="1" style="flex:1.1;display:flex;flex-direction:column;gap:19px;min-width:0;">
      {nb_kicker(card['kicker'])}
      <div style="font-family:{NB_SANS};font-size:{fit_size(head, 460, 54, 0.68)}px;
        font-weight:900;color:{NB_INK};line-height:1.12;letter-spacing:-0.01em;">{esc(head)}</div>
      <div style="width:120px;height:4px;background:{NB_BLUE};border-radius:99px;"></div>
      <div style="font-family:{NB_SANS};font-weight:500;font-size:21.5px;color:{NB_INK70};
        line-height:1.52;">{esc(card['sub'])}</div>
      {num_block}
      {note}
    </div>
    <div data-flow="1" style="flex:0 0 400px;">{nb_photo(card, 400, 460)}</div>
  </div>
  {nb_foot(index, total)}
  {nb_watermark()}'''


# ============================================================ WINDTUNNEL (jmw)

WT_BG = '#191C20'
WT_LIGHT = '#ECEFF2'
WT_MUTE = 'rgba(236,239,242,0.62)'
WT_MUTE35 = 'rgba(236,239,242,0.36)'
WT_ORANGE = '#FF7A3D'
WT_RING = 'rgba(236,239,242,0.09)'
WT_DISPLAY = "'Segoe UI Black','Segoe UI',Arial,sans-serif"
WT_SANS = "'Segoe UI',Arial,sans-serif"
WT_MONO = "'Consolas','Courier New',monospace"
WT_KO = "'Malgun Gothic','Segoe UI',sans-serif"


def wt_ground(cx=810, cy=430):
    rings = ''.join(
        f'<div style="position:absolute;left:{cx - r}px;top:{cy - r}px;width:{2*r}px;height:{2*r}px;'
        f'border:1.5px solid {WT_RING};border-radius:50%;"></div>'
        for r in (150, 260, 380, 510))
    return f'''
  <div style="position:absolute;inset:0;background:
    radial-gradient(circle at 68% 34%, #22262C 0%, {WT_BG} 55%, #131519 100%);"></div>
  {rings}'''


def wt_watermark():
    return f'''
  <div style="position:absolute;left:56px;top:48px;z-index:30;display:flex;align-items:center;gap:12px;">
    <div style="width:30px;height:30px;border:2.5px solid {WT_LIGHT};display:flex;align-items:center;
      justify-content:center;font-family:{WT_SANS};font-size:12px;font-weight:900;
      color:{WT_LIGHT};">EK</div>
    <div style="font-family:{WT_SANS};font-size:14px;font-weight:900;letter-spacing:0.24em;
      color:{WT_LIGHT};">EPICKOR.COM</div>
  </div>'''


def wt_power(index, total):
    bars = ''.join(
        f'<div style="width:6px;height:{10 + d * 2.4}px;'
        + (f'background:{WT_ORANGE};' if d <= index else f'background:{WT_MUTE35};')
        + 'border-radius:2px;"></div>'
        for d in range(1, total + 1))
    return f'<div style="display:flex;gap:6px;align-items:flex-end;">{bars}</div>'


def wt_foot(index, total):
    return f'''
  <div style="position:absolute;left:56px;right:56px;top:1010px;z-index:26;
    border-top:1.5px solid rgba(236,239,242,0.2);padding-top:11px;display:flex;
    justify-content:space-between;align-items:center;">
    <div style="font-family:{WT_MONO};font-size:12px;font-weight:700;letter-spacing:0.22em;
      color:{WT_MUTE35};">JMW — KOREAN MAKERS · FILE 05</div>
    {wt_power(index, total)}
    <div style="font-family:{WT_MONO};font-size:12px;font-weight:700;letter-spacing:0.22em;
      color:{WT_MUTE};">{index:02d} / {total:02d}</div>
  </div>'''


def wt_micro(text, color=WT_ORANGE):
    return f'''<div style="font-family:{WT_MONO};font-weight:700;font-size:15px;
      letter-spacing:0.3em;color:{color};text-transform:uppercase;">{text}</div>'''


def wt_verdict(card):
    # NOTE: chips inside a left-aligned flex column must carry align-self:flex-start,
    # or the column's default `stretch` pulls them to full width.
    v = card['verdict']
    if v == 'myth':
        return f'''<div style="position:relative;display:inline-block;align-self:flex-start;border:2.5px solid {WT_MUTE35};
      color:{WT_MUTE};font-family:{WT_DISPLAY};font-style:italic;font-size:19px;
      letter-spacing:0.22em;padding:8px 20px;">MYTH
      <div style="position:absolute;left:-6px;right:-6px;top:50%;height:3px;
        background:#D8422F;transform:rotate(-6deg);"></div></div>'''
    if v == 'fact':
        return f'''<div style="display:inline-block;align-self:flex-start;background:{WT_ORANGE};color:{WT_BG};
      font-family:{WT_DISPLAY};font-style:italic;font-size:19px;letter-spacing:0.22em;
      padding:9px 22px;">FACT</div>'''
    return ''


def wt_stamp(text):
    if not text:
        return ''
    return f'''<div style="display:inline-block;align-self:flex-start;border:2.5px solid {WT_ORANGE};color:{WT_ORANGE};
      font-family:{WT_MONO};font-weight:700;font-size:16px;letter-spacing:0.2em;
      padding:9px 18px;">{text}</div>'''


def wt_circle(card, d):
    if not card['image']:
        return ''
    return f'''
  <div style="width:{d + 34}px;">
    <div style="width:{d + 34}px;height:{d + 34}px;border:1.5px solid rgba(255,122,61,0.55);
      border-radius:50%;display:flex;align-items:center;justify-content:center;">
      <div style="width:{d}px;height:{d}px;border-radius:50%;background:#FFFFFF;overflow:hidden;
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 20px 60px rgba(0,0,0,0.5);">
        <img src="{card['image']}" alt="{card['image_label']}"
          style="max-width:86%;max-height:86%;object-fit:contain;display:block;"></div>
    </div>
    <div style="margin-top:14px;font-family:{WT_MONO};font-size:12px;font-weight:700;
      letter-spacing:0.08em;color:{WT_MUTE35};text-transform:uppercase;text-align:center;
      line-height:1.4;">{card['image_label']}</div>
  </div>'''


def wt_koline(card):
    if not card['ko_line']:
        return ''
    return f'''
  <div style="position:absolute;right:58px;top:0;bottom:0;z-index:24;display:flex;
    align-items:center;">
    <div style="writing-mode:vertical-rl;font-family:{WT_KO};font-size:13px;font-weight:600;
      letter-spacing:0.42em;color:{WT_MUTE35};">{card['ko_line']}</div>
  </div>'''


def build_windtunnel(meta, card, index, total):
    mode = card['mode']

    if mode == 'cover':
        # full-width headline on top, then sub text beside the product circle —
        # a narrow column can't hold the italic display caps without widows.
        return f'''
  {wt_ground()}
  {wt_koline(card)}
  <div data-flow="1" style="position:absolute;left:88px;right:100px;top:118px;height:864px;
    z-index:20;display:flex;flex-direction:column;gap:26px;justify-content:center;">
    {wt_micro(card['kicker'], WT_MUTE)}
    <div style="font-family:{WT_DISPLAY};font-style:italic;
      font-size:{fit_size(card['main'], 860, 82, 0.75)}px;color:{WT_LIGHT};line-height:1.05;
      letter-spacing:-0.01em;text-transform:uppercase;">{esc(card['main'])}</div>
    <div style="display:flex;align-items:center;gap:16px;">
      <div style="width:54px;height:3px;background:{WT_ORANGE};"></div>
      {wt_micro(card['stamp'])}
    </div>
    <div style="display:flex;align-items:center;gap:44px;">
      <div style="flex:1;font-family:{WT_SANS};font-weight:400;font-size:23px;color:{WT_MUTE};
        line-height:1.55;">{esc(card['sub'])}</div>
      <div style="flex:0 0 360px;">{wt_circle(card, 326)}</div>
    </div>
  </div>
  {wt_foot(index, total)}
  {wt_watermark()}'''

    if mode == 'number':
        return f'''
  {wt_ground(cx=880, cy=320)}
  {wt_koline(card)}
  <div data-flow="1" style="position:absolute;left:96px;right:130px;top:130px;height:850px;
    z-index:20;display:flex;flex-direction:column;gap:26px;justify-content:center;">
    {wt_micro(card['kicker'], WT_MUTE)}
    <div style="font-family:{WT_DISPLAY};font-style:italic;
      font-size:{fit_size(card['num'], 800, 300, 0.6)}px;color:{WT_LIGHT};line-height:0.95;
      letter-spacing:-0.02em;font-variant-numeric:tabular-nums;">{esc(card['num'])}</div>
    <div style="font-family:{WT_SANS};font-weight:700;font-size:27px;color:{WT_ORANGE};
      line-height:1.35;max-width:760px;">{esc(card['num_label'])}</div>
    <div style="font-family:{WT_SANS};font-weight:400;font-size:23px;color:{WT_MUTE};
      line-height:1.55;max-width:760px;">{esc(card['sub'])}</div>
    {wt_stamp(card['stamp'])}
  </div>
  {wt_foot(index, total)}
  {wt_watermark()}'''

    if mode == 'end':
        return f'''
  {wt_ground(cx=540, cy=760)}
  {wt_koline(card)}
  <div data-flow="1" style="position:absolute;left:110px;right:110px;top:100px;height:890px;
    z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:24px;text-align:center;">
    {wt_micro(card['kicker'], WT_MUTE)}
    <div style="font-family:{WT_DISPLAY};font-style:italic;
      font-size:{fit_size(card['main'], 800, 70, 0.75)}px;color:{WT_LIGHT};line-height:1.06;
      text-transform:uppercase;">{esc(card['main'])}</div>
    <div style="font-family:{WT_SANS};font-weight:400;font-size:22px;color:{WT_MUTE};
      line-height:1.52;max-width:700px;">{esc(card['sub'])}</div>
    {wt_circle(card, 300)}
    <div style="background:{WT_ORANGE};color:{WT_BG};font-family:{WT_DISPLAY};font-style:italic;
      font-size:26px;letter-spacing:0.1em;padding:15px 42px;">EPICKOR.COM</div>
  </div>
  {wt_foot(index, total)}
  {wt_watermark()}'''

    # item: text left, circular product right
    head = card['name_en'] or card['main']
    num_block = ''
    if card['num']:
        num_block = f'''
    <div style="font-family:{WT_DISPLAY};font-style:italic;
      font-size:{fit_size(card['num'], 430, 84, 0.6)}px;color:{WT_ORANGE};line-height:1;
      font-variant-numeric:tabular-nums;">{esc(card['num'])}</div>
    <div style="font-family:{WT_MONO};font-size:14px;font-weight:700;letter-spacing:0.18em;
      color:{WT_LIGHT};text-transform:uppercase;">{esc(card['num_label'])}</div>'''
    note = ''
    if card['note']:
        note = f'''
    <div style="border-left:2.5px solid {WT_ORANGE};padding-left:16px;font-family:{WT_SANS};
      font-weight:400;font-size:19px;color:{WT_MUTE};line-height:1.5;">{esc(card['note'])}</div>'''
    return f'''
  {wt_ground(cx=830, cy=470)}
  {wt_koline(card)}
  <div style="position:absolute;left:88px;right:80px;top:120px;height:860px;z-index:20;
    display:flex;align-items:center;gap:40px;">
    <div data-flow="1" style="flex:1.2;display:flex;flex-direction:column;gap:19px;min-width:0;">
      {wt_micro(card['kicker'], WT_MUTE)}
      {wt_verdict(card)}
      <div style="font-family:{WT_DISPLAY};font-style:italic;
        font-size:{fit_size(head, 500, 54, 0.72)}px;color:{WT_LIGHT};line-height:1.1;
        text-transform:uppercase;">{esc(head)}</div>
      <div style="font-family:{WT_SANS};font-weight:400;font-size:21px;color:{WT_MUTE};
        line-height:1.55;">{esc(card['sub'])}</div>
      {num_block}
      {note}
    </div>
    <div data-flow="1" style="flex:0 0 380px;">{wt_circle(card, 346)}</div>
  </div>
  {wt_foot(index, total)}
  {wt_watermark()}'''


# ============================================================ FRESHPRESS (hurom)

FP_MIST = '#F5F8F1'
FP_INK = '#22402E'
FP_INK70 = 'rgba(34,64,46,0.72)'
FP_LEAF = 'rgba(34,64,46,0.5)'
FP_LEAF30 = 'rgba(34,64,46,0.3)'
FP_GREEN = '#4C8C34'
FP_LIGHTF = "'Segoe UI Semilight','Segoe UI Light','Segoe UI',sans-serif"
FP_SANS = "'Segoe UI',Arial,sans-serif"
FP_KO = "'Malgun Gothic','Segoe UI',sans-serif"


def fp_ground():
    return f'''
  <div style="position:absolute;inset:0;background:{FP_MIST};"></div>
  <div style="position:absolute;inset:0;background:
    radial-gradient(circle at 82% 14%, rgba(76,140,52,0.09) 0%, transparent 42%),
    radial-gradient(circle at 8% 92%, rgba(76,140,52,0.06) 0%, transparent 36%);"></div>'''


def fp_watermark():
    return f'''
  <div style="position:absolute;left:60px;top:48px;z-index:30;display:flex;align-items:center;gap:12px;">
    <div style="width:30px;height:30px;border:2px solid {FP_INK};border-radius:50%;display:flex;
      align-items:center;justify-content:center;font-family:{FP_SANS};font-size:11.5px;
      font-weight:700;color:{FP_INK};">EK</div>
    <div style="font-family:{FP_SANS};font-size:14px;font-weight:700;letter-spacing:0.26em;
      color:{FP_INK};">EPICKOR.COM</div>
  </div>'''


def fp_glassfill(index, total):
    fill = int(46 * index / total)
    return f'''
  <div style="width:16px;height:58px;border:1.5px solid {FP_INK};border-radius:3px 3px 7px 7px;
    position:relative;overflow:hidden;">
    <div style="position:absolute;left:0;right:0;bottom:0;height:{fill}px;
      background:{FP_GREEN};"></div>
  </div>'''


def fp_foot(index, total):
    return f'''
  <div style="position:absolute;left:60px;right:60px;top:1004px;z-index:26;display:flex;
    justify-content:space-between;align-items:center;">
    <div style="font-family:{FP_SANS};font-weight:600;font-size:12px;letter-spacing:0.28em;
      color:{FP_LEAF};">HUROM — KOREAN MAKERS · FILE 06</div>
    <div style="display:flex;align-items:center;gap:14px;">
      {fp_glassfill(index, total)}
      <div style="font-family:{FP_SANS};font-weight:600;font-size:12px;letter-spacing:0.28em;
        color:{FP_INK};">{index:02d} / {total:02d}</div>
    </div>
  </div>'''


def fp_kicker(text):
    return f'''<div style="font-family:{FP_SANS};font-weight:700;font-size:14px;
      letter-spacing:0.32em;color:{FP_GREEN};text-transform:uppercase;">{text}</div>'''


def fp_drops(center=True):
    drops = ''.join(
        f'<div style="width:{s}px;height:{s}px;background:{FP_GREEN};opacity:{o};'
        'border-radius:0 50% 50% 50%;transform:rotate(45deg);"></div>'
        for s, o in ((13, .9), (10, .65), (7, .4)))
    margin = 'justify-content:center;' if center else ''
    return f'<div style="display:flex;gap:12px;align-items:center;{margin}">{drops}</div>'


def fp_stamp(text):
    if not text:
        return ''
    return f'''<div style="display:inline-block;border:1.5px solid {FP_GREEN};color:{FP_GREEN};
      font-family:{FP_SANS};font-weight:700;font-size:14px;letter-spacing:0.24em;
      padding:10px 22px;border-radius:999px;text-transform:uppercase;">{text}</div>'''


def fp_glass(card, w, h):
    if not card['image']:
        return ''
    return f'''
  <div style="width:{w}px;">
    <div style="height:{h}px;background:#FFFFFF;border:1.5px solid {FP_LEAF30};
      border-radius:24px 24px {int(w * 0.42)}px {int(w * 0.42)}px;overflow:hidden;display:flex;
      align-items:center;justify-content:center;padding:26px 22px 34px;
      box-shadow:0 16px 40px rgba(34,64,46,0.12);">
      <img src="{card['image']}" alt="{card['image_label']}"
        style="max-width:100%;max-height:100%;object-fit:contain;display:block;"></div>
    <div style="margin-top:13px;font-family:{FP_SANS};font-weight:600;font-size:12px;
      letter-spacing:0.1em;color:{FP_LEAF};text-transform:uppercase;text-align:center;
      line-height:1.45;">{card['image_label']}</div>
  </div>'''


def fp_koline(card):
    if not card['ko_line']:
        return ''
    return f'''
  <div style="position:absolute;left:62px;top:0;bottom:0;z-index:24;display:flex;
    align-items:center;">
    <div style="writing-mode:vertical-rl;font-family:{FP_KO};font-size:13px;font-weight:600;
      letter-spacing:0.42em;color:{FP_LEAF30};">{card['ko_line']}</div>
  </div>'''


def build_freshpress(meta, card, index, total):
    mode = card['mode']

    if mode == 'cover':
        return f'''
  {fp_ground()}
  {fp_koline(card)}
  <div style="position:absolute;left:104px;right:84px;top:120px;height:860px;z-index:20;
    display:flex;align-items:center;gap:48px;">
    <div data-flow="1" style="flex:1.2;display:flex;flex-direction:column;gap:24px;min-width:0;">
      {fp_kicker(card['kicker'])}
      <div style="font-family:{FP_LIGHTF};font-weight:300;
        font-size:{fit_size(card['main'], 560, 74, 0.72)}px;color:{FP_INK};line-height:1.1;
        letter-spacing:-0.005em;">{esc(card['main'])}</div>
      {fp_drops(center=False)}
      <div style="font-family:{FP_SANS};font-weight:400;font-size:23px;color:{FP_INK70};
        line-height:1.55;">{esc(card['sub'])}</div>
      <div style="display:flex;">{fp_stamp(card['stamp'])}</div>
    </div>
    <div data-flow="1" style="flex:0 0 380px;">{fp_glass(card, 380, 560)}</div>
  </div>
  {fp_foot(index, total)}
  {fp_watermark()}'''

    if mode == 'number':
        return f'''
  {fp_ground()}
  {fp_koline(card)}
  <div data-flow="1" style="position:absolute;left:130px;right:130px;top:120px;height:860px;
    z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:24px;text-align:center;">
    {fp_kicker(card['kicker'])}
    <div style="font-family:{FP_LIGHTF};font-weight:300;
      font-size:{fit_size(card['num'], 760, 280, 0.58)}px;color:{FP_GREEN};line-height:0.98;
      letter-spacing:-0.02em;font-variant-numeric:tabular-nums;">{esc(card['num'])}</div>
    <div style="font-family:{FP_SANS};font-weight:600;font-size:28px;color:{FP_INK};
      line-height:1.35;max-width:760px;">{esc(card['num_label'])}</div>
    {fp_drops()}
    <div style="font-family:{FP_SANS};font-weight:400;font-size:23px;color:{FP_INK70};
      line-height:1.55;max-width:740px;">{esc(card['sub'])}</div>
    {fp_stamp(card['stamp'])}
  </div>
  {fp_foot(index, total)}
  {fp_watermark()}'''

    if mode == 'end':
        return f'''
  {fp_ground()}
  {fp_koline(card)}
  <div data-flow="1" style="position:absolute;left:120px;right:120px;top:104px;height:880px;
    z-index:20;display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:24px;text-align:center;">
    {fp_kicker(card['kicker'])}
    <div style="font-family:{FP_LIGHTF};font-weight:300;
      font-size:{fit_size(card['main'], 760, 66, 0.72)}px;color:{FP_INK};
      line-height:1.1;">{esc(card['main'])}</div>
    <div style="font-family:{FP_SANS};font-weight:400;font-size:22px;color:{FP_INK70};
      line-height:1.52;max-width:700px;">{esc(card['sub'])}</div>
    {fp_glass(card, 300, 340)}
    <div style="background:{FP_GREEN};color:#FFFFFF;font-family:{FP_SANS};font-weight:700;
      font-size:25px;letter-spacing:0.12em;padding:16px 44px;border-radius:999px;">EPICKOR.COM</div>
  </div>
  {fp_foot(index, total)}
  {fp_watermark()}'''

    # item: text left, glass photo right
    head = card['name_en'] or card['main']
    num_block = ''
    if card['num']:
        num_block = f'''
    <div style="font-family:{FP_LIGHTF};font-weight:300;
      font-size:{fit_size(card['num'], 430, 84, 0.58)}px;color:{FP_GREEN};line-height:1;
      font-variant-numeric:tabular-nums;">{esc(card['num'])}</div>
    <div style="font-family:{FP_SANS};font-weight:700;font-size:14px;letter-spacing:0.2em;
      color:{FP_INK};text-transform:uppercase;">{esc(card['num_label'])}</div>'''
    note = ''
    if card['note']:
        note = f'''
    <div style="border-top:1.5px solid {FP_LEAF30};padding-top:14px;font-family:{FP_SANS};
      font-weight:500;font-size:19px;color:{FP_INK};line-height:1.5;">{esc(card['note'])}</div>'''
    return f'''
  {fp_ground()}
  {fp_koline(card)}
  <div style="position:absolute;left:110px;right:84px;top:120px;height:860px;z-index:20;
    display:flex;align-items:center;gap:44px;">
    <div data-flow="1" style="flex:1.15;display:flex;flex-direction:column;gap:20px;min-width:0;">
      {fp_kicker(card['kicker'])}
      <div style="font-family:{FP_LIGHTF};font-weight:300;
        font-size:{fit_size(head, 480, 54, 0.6)}px;color:{FP_INK};line-height:1.14;">{esc(head)}</div>
      {fp_drops(center=False)}
      <div style="font-family:{FP_SANS};font-weight:400;font-size:21.5px;color:{FP_INK70};
        line-height:1.55;">{esc(card['sub'])}</div>
      {num_block}
      {note}
    </div>
    <div data-flow="1" style="flex:0 0 370px;">{fp_glass(card, 370, 500)}</div>
  </div>
  {fp_foot(index, total)}
  {fp_watermark()}'''


# ============================================================ shell + harness

BUILDERS = {'sunburst': build_sunburst, 'blade': build_blade, 'homedrama': build_homedrama,
            'notebook': build_notebook, 'windtunnel': build_windtunnel,
            'freshpress': build_freshpress}
GROUNDS = {'sunburst': '#45250F', 'blade': BL_BG, 'homedrama': HD_CREAM,
           'notebook': NB_PAPER, 'windtunnel': WT_BG, 'freshpress': FP_MIST}

SHELL = '''<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">
<meta name="viewport" content="width=1080"><style>
 * {{ margin:0; padding:0; box-sizing:border-box; }}
 body {{ width:1080px; height:1080px; overflow:hidden; background:{ground};
   -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; }}
 .card {{ width:1080px; height:1080px; position:relative; overflow:hidden; }}
</style></head><body><div class="card">{body}</div></body></html>'''

OVERFLOW_JS = '''() => {
  const bad = [];
  document.querySelectorAll('[data-flow]').forEach((el, i) => {
    if (el.scrollHeight > el.clientHeight + 4)
      bad.push(`flow#${i} overflow ${el.scrollHeight - el.clientHeight}px`);
    const r = el.getBoundingClientRect();
    if (r.bottom > 1002) bad.push(`flow#${i} bottom ${Math.round(r.bottom)} past 1002`);
  });
  return bad;
}'''


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
    style = meta.get('style', '')
    if style not in BUILDERS:
        print('unknown style:', style)
        sys.exit(1)
    build = BUILDERS[style]
    total = len(cards)
    print(f'{total} cards [{style}] -> {out_dir}')

    problems = []
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1080, 'height': 1080})
        for i, card in enumerate(cards, start=1):
            html = SHELL.format(ground=GROUNDS[style], body=build(meta, card, i, total))
            html_path = out_dir / f'card_{i:02d}.html'
            html_path.write_text(html, encoding='utf-8')
            page.goto(html_path.as_uri())
            page.wait_for_timeout(420)
            bad = page.evaluate(OVERFLOW_JS)
            for b in bad:
                problems.append(f'card_{i:02d}: {b}')
            page.screenshot(path=str(out_dir / f'card_{i:02d}.png'))
            print(f'  card_{i:02d}.png  {(card.get("name_en") or card.get("main", ""))[:44]}'
                  + ('  [OVERFLOW]' if bad else ''))
        browser.close()

    if problems:
        print('\nOVERFLOW FAIL:')
        for b in problems:
            print(' ', b)
        sys.exit(2)
    print('overflow gate: clean')


if __name__ == '__main__':
    main()
