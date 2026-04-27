#!/usr/bin/env python3
"""
EpicKor Card News — HTML to PNG Converter

script.md를 읽어 카드별 HTML을 생성하고 Playwright로 1080x1080 PNG로 변환한다.
design_system.md의 레이아웃 규칙을 따른다.

실행: python .claude/skills/cardnews/scripts/html-to-png.py --slug 166
      python .claude/skills/cardnews/scripts/html-to-png.py --slug 166 --card 01  (특정 카드만)
"""

import argparse
import os
import re
import sys
import json
from pathlib import Path

# ─── 경로 설정 ────────────────────────────────────────────────────

SCRIPT_DIR = Path(__file__).parent
ROOT = SCRIPT_DIR / '../../../../'
ROOT = ROOT.resolve()

def get_output_dir(slug):
    return ROOT / f'output/cardnews/{slug}'

def get_images_dir(slug):
    d = get_output_dir(slug) / 'images'
    d.mkdir(parents=True, exist_ok=True)
    return d

# ─── script.md 파서 ───────────────────────────────────────────────

def parse_script(script_path):
    """script.md를 파싱하여 카드 목록 반환"""
    content = Path(script_path).read_text(encoding='utf-8')
    cards = []

    # 카드 블록 분리 (## Card XX 기준)
    card_blocks = re.split(r'^## Card \d+', content, flags=re.MULTILINE)

    # 헤더 블록 파싱 (slug, topic)
    header = card_blocks[0] if card_blocks else ''
    slug_match = re.search(r'slug:\s*(\S+)', header)
    topic_match = re.search(r'topic:\s*(.+)', header)
    slug = slug_match.group(1) if slug_match else 'unknown'
    topic = topic_match.group(1).strip() if topic_match else 'Korean Culture'

    for i, block in enumerate(card_blocks[1:], 1):
        lines = block.strip().split('\n')

        # 역할 추출 (첫 줄: " — Cover" 형태)
        role_line = lines[0].strip() if lines else ''
        role_match = re.search(r'—\s*(.+)', role_line)
        role = role_match.group(1).strip() if role_match else f'Card {i}'

        card = {
            'number': i,
            'role': role,
            'layout': 'B',
            'point_color': 'Gold',
            'image_keyword': 'korea',
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
            elif line.startswith('**Main:**'):
                card['main_text'] = line.replace('**Main:**', '').strip()
            elif line.startswith('**Sub:**'):
                card['sub_text'] = line.replace('**Sub:**', '').strip()

        cards.append(card)

    return slug, topic, cards


# ─── 컬러 매핑 ────────────────────────────────────────────────────

COLORS = {
    'Gold': '#C9A84C',
    'Teal': '#4ECDC4',
    'White': '#FFFFFF',
    'Background': '#111111',
    'Dark2': '#1A1A1A',
}

def point_color(card):
    return COLORS.get(card['point_color'], COLORS['Gold'])

# ─── 텍스트 처리 ──────────────────────────────────────────────────

def to_html_text(text):
    """\\n → <br>, **텍스트** → <strong> 변환"""
    text = text.replace('\\n', '<br>')
    text = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', text)
    return text

# ─── HTML 생성 ────────────────────────────────────────────────────

WATERMARK_HTML = '''
  <div style="
    position:absolute; bottom:28px; right:36px;
    font-size:11px; font-weight:400;
    letter-spacing:0.15em; color:rgba(255,255,255,0.35);
    text-transform:uppercase;
  ">EPICKOR.COM</div>
'''

CARD_SHELL_START = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=1080">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;900&display=swap');
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  body {{
    width:1080px; height:1080px; overflow:hidden;
    background:#111111;
    font-family:'Noto Sans KR','Malgun Gothic','Apple SD Gothic Neo',sans-serif;
    -webkit-font-smoothing:antialiased;
  }}
  .card {{
    width:1080px; height:1080px;
    position:relative; overflow:hidden;
    background:#111111;
  }}
</style>
</head>
<body>
<div class="card">
'''

CARD_SHELL_END = '''
</div>
</body>
</html>'''


def build_type_a(card):
    """Type A — 커버/마무리 카드"""
    pc = point_color(card)
    main = to_html_text(card['main_text'])
    sub = to_html_text(card['sub_text'])

    return f'''
  <!-- 배경 그라데이션 -->
  <div style="position:absolute;inset:0;
    background:linear-gradient(135deg,#1a1200 0%,#111111 55%,#0d0d0d 100%);
  "></div>

  <!-- 사선 액센트 -->
  <div style="position:absolute;top:-80px;right:-60px;
    width:400px;height:400px;background:{pc};transform:rotate(35deg);opacity:0.10;
  "></div>
  <div style="position:absolute;top:70px;right:50px;
    width:5px;height:260px;background:{pc};transform:rotate(35deg);opacity:0.5;
  "></div>

  <!-- 텍스트 블록 -->
  <div style="position:absolute;bottom:100px;left:88px;right:88px;">
    <div style="width:44px;height:3px;background:{pc};margin-bottom:24px;"></div>
    <div style="
      font-size:54px;font-weight:900;color:#FFFFFF;
      line-height:1.2;letter-spacing:-0.03em;margin-bottom:20px;
    ">{main}</div>
    <div style="
      font-size:17px;font-weight:400;color:rgba(255,255,255,0.65);
      line-height:1.75;letter-spacing:-0.01em;word-break:keep-all;
    ">{sub}</div>
  </div>
  {WATERMARK_HTML}'''


def build_type_b(card):
    """Type B — 상단 그래픽 + 하단 텍스트"""
    pc = point_color(card)
    main = to_html_text(card['main_text'])
    sub = to_html_text(card['sub_text'])

    return f'''
  <!-- 상단 그래픽 영역 -->
  <div style="
    width:1080px;height:486px;position:relative;overflow:hidden;
    background:linear-gradient(135deg,#1a1200 0%,#2d1f00 50%,#111111 100%);
  ">
    <!-- 장식 요소 -->
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
  </div>

  <!-- 하단 텍스트 영역 -->
  <div style="
    width:1080px;height:594px;background:#111111;
    padding:52px 88px;
    display:flex;flex-direction:column;justify-content:center;
  ">
    <div style="
      font-size:28px;font-weight:700;color:{pc};
      line-height:1.4;letter-spacing:-0.02em;
      border-bottom:2px solid {pc};
      display:inline-block;padding-bottom:4px;margin-bottom:24px;
    ">{main}</div>
    <div style="
      font-size:17px;font-weight:400;color:#FFFFFF;
      line-height:1.85;letter-spacing:-0.01em;word-break:keep-all;
    ">{sub}</div>
  </div>
  {WATERMARK_HTML}'''


def build_type_c(card):
    """Type C — 좌우 분할"""
    pc = point_color(card)
    main = to_html_text(card['main_text'])
    sub = to_html_text(card['sub_text'])

    return f'''
  <div style="display:flex;width:1080px;height:1080px;">
    <!-- 텍스트 영역 (좌 60%) -->
    <div style="
      width:648px;height:1080px;background:#111111;
      padding:96px 72px;
      display:flex;flex-direction:column;justify-content:center;
    ">
      <div style="width:36px;height:3px;background:{pc};margin-bottom:28px;"></div>
      <div style="
        font-size:26px;font-weight:700;color:{pc};
        line-height:1.45;letter-spacing:-0.02em;
        border-left:4px solid {pc};padding-left:18px;margin-bottom:24px;
      ">{main}</div>
      <div style="
        font-size:16px;font-weight:400;color:#FFFFFF;
        line-height:1.85;letter-spacing:-0.01em;word-break:keep-all;
      ">{sub}</div>
    </div>

    <!-- 그래픽 영역 (우 40%) -->
    <div style="
      width:432px;height:1080px;position:relative;overflow:hidden;
      background:linear-gradient(180deg,#1a1200 0%,#0d0d0d 100%);
    ">
      <div style="
        position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
        width:180px;height:180px;border-radius:50%;
        border:1px solid {pc};opacity:0.4;
      "></div>
      <div style="
        position:absolute;top:30%;left:20%;
        width:3px;height:200px;background:{pc};opacity:0.3;transform:rotate(20deg);
      "></div>
    </div>
  </div>
  {WATERMARK_HTML}'''


def build_type_d(card, total):
    """Type D — 인용/강조 카드"""
    pc = point_color(card)
    main = to_html_text(card['main_text'])
    sub = to_html_text(card['sub_text'])
    num = card['number']

    return f'''
  <div style="padding:88px;position:relative;width:1080px;height:1080px;">
    <!-- 시리즈 번호 -->
    <div style="
      font-size:13px;font-weight:400;
      color:rgba(255,255,255,0.4);letter-spacing:0.1em;margin-bottom:48px;
    ">{num:02d} / {total:02d}</div>

    <!-- 메인 타이틀 -->
    <div style="
      font-size:48px;font-weight:900;color:{pc};
      line-height:1.2;letter-spacing:-0.03em;margin-bottom:36px;
    ">{main}</div>

    <!-- 구분선 -->
    <div style="width:100%;height:1px;background:rgba(255,255,255,0.15);margin-bottom:36px;"></div>

    <!-- 본문 -->
    <div style="
      font-size:18px;font-weight:400;color:rgba(255,255,255,0.85);
      line-height:1.85;letter-spacing:-0.01em;word-break:keep-all;
    ">{sub}</div>

    <!-- 우하단 장식 -->
    <div style="
      position:absolute;bottom:-60px;right:-60px;
      width:280px;height:280px;
      background:{pc};transform:rotate(45deg);opacity:0.07;
    "></div>
  </div>
  {WATERMARK_HTML}'''


def build_card_html(card, total):
    layout = card['layout'].upper().strip()

    if layout == 'A':
        body = build_type_a(card)
    elif layout == 'B':
        body = build_type_b(card)
    elif layout == 'C':
        body = build_type_c(card)
    elif layout == 'D':
        body = build_type_d(card, total)
    else:
        body = build_type_b(card)  # fallback

    return CARD_SHELL_START + body + CARD_SHELL_END


# ─── PNG 변환 ─────────────────────────────────────────────────────

def convert_to_png(html_path, png_path):
    """Playwright로 HTML → 1080×1080 PNG 변환"""
    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print('❌ playwright가 설치되지 않았습니다.')
        print('   pip install playwright && playwright install chromium')
        sys.exit(1)

    html_url = 'file:///' + str(html_path).replace('\\', '/')

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1080, 'height': 1080})
        page.goto(html_url)
        page.wait_for_timeout(1000)  # 웹폰트 로딩 대기
        page.screenshot(
            path=str(png_path),
            clip={'x': 0, 'y': 0, 'width': 1080, 'height': 1080}
        )
        browser.close()


# ─── 메인 ────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description='EpicKor Card News HTML→PNG Converter')
    parser.add_argument('--slug', required=True, help='포스트 슬러그 (예: 166)')
    parser.add_argument('--card', help='특정 카드 번호만 변환 (예: 01)')
    args = parser.parse_args()

    slug = args.slug
    output_dir = get_output_dir(slug)
    script_path = output_dir / 'script.md'

    if not script_path.exists():
        print(f'❌ script.md 없음: {script_path}')
        print(f'   먼저 generate-slides.mjs를 실행하세요.')
        sys.exit(1)

    print(f'🎨 카드뉴스 HTML→PNG 변환 시작: slug={slug}')

    _, topic, cards = parse_script(script_path)
    total = len(cards)

    print(f'   슬라이드 수: {total}장')

    target_cards = cards
    if args.card:
        target_num = int(args.card)
        target_cards = [c for c in cards if c['number'] == target_num]
        if not target_cards:
            print(f'❌ Card {args.card} 없음')
            sys.exit(1)

    success_count = 0
    for card in target_cards:
        num_str = f'{card["number"]:02d}'
        html_path = output_dir / f'card_{num_str}.html'
        png_path = output_dir / f'card_{num_str}.png'

        # HTML 생성
        html = build_card_html(card, total)
        html_path.write_text(html, encoding='utf-8')

        # PNG 변환
        try:
            convert_to_png(html_path, png_path)
            print(f'   ✅ card_{num_str}.png — {card["layout"]} / {card["role"]}')
            success_count += 1
        except Exception as e:
            print(f'   ❌ card_{num_str}.png 변환 실패: {e}')
            print(f'      HTML은 저장됨: {html_path}')

    print(f'\n🎉 완료! {success_count}/{len(target_cards)}장 PNG 생성')
    print(f'   저장 위치: output/cardnews/{slug}/')

    if success_count < len(target_cards):
        failed = len(target_cards) - success_count
        print(f'   ⚠️  {failed}장 실패 — HTML 파일로 저장되었습니다.')


if __name__ == '__main__':
    main()
