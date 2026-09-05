"""Mechanical CTA repairs that need no editorial judgment.

For every public post NOT in the hand-rebuilt set:
  1. If a .affiliate-inline-cta box has no button, add ONE button pointing at the
     first Amazon product (/dp/) link inside the box, using that link's anchor text.
     Boxes whose only links are searches are left alone (a "See it" button on a bare
     search is the thing this whole pass is trying to stop).
  2. If the post has no .affiliate-topline, build one from the first box's first
     product link and anchor text, and place it under the hero image caption.

Everything else (moving the first box earlier, replacing filler products, replacing
search links) needs a human read of the post and is done in the hand batches.

Usage: python scripts/cta-mechanical-pass.py [--dry]
"""
import re
import glob
import sys

exec(open('scripts/cta-lib.py', encoding='utf-8').read())

DRY = '--dry' in sys.argv
DONE = {'198', '218', '274', '200', '171', '170', '181', '071', '339', '363', '344', '275', '223', '203', '374',
        '255', '347', '089', '141', '338', '321', '140', '006', '310', '382', '043', '350',
        '227', '074', '233', '365', '194', '360', '175', '257', '302', '153', '145', '124'}

DP = re.compile(r'<a href="(https?://(?:www\.|us\.)?amazon\.com/(?:[A-Za-z0-9-]+/)?dp/[A-Z0-9]{10})[^"]*"[^>]*>([\s\S]*?)</a>')

changed = 0
buttons_added = 0
toplines_added = 0
for p in sorted(glob.glob('content/blog/*.md')):
    t = open(p, encoding='utf-8').read()
    m = re.search(r'^slug: "([^"]+)"', t, re.M)
    if not m or 'visibility: "public"' not in t or m.group(1) in DONE:
        continue
    orig = t
    # 1. buttons
    for b in reversed(boxes(t)):
        html = b.group(0)
        if 'affiliate-cta-button' in html:
            continue
        links = DP.findall(html)
        if not links:
            continue
        url, text = links[0]
        text = re.sub(r'<[^>]+>', '', text).strip()
        text = re.sub(r'\s+', ' ', text)
        if not text or len(text) > 70:
            text = 'it'
        label = f'See {text} on Amazon' if text != 'it' else 'See it on Amazon'
        if re.search(r'on Amazon', text, re.I):
            label = text
        button = f'\n  <a class="affiliate-cta-button" href="{url}{A}" {R}>{label}</a>\n</div>'
        new = html[:-len('</div>')].rstrip() + button
        t = t[:b.start()] + new + t[b.end():]
        buttons_added += 1
    # 2. topline
    if 'affiliate-topline' not in t:
        bx = boxes(t)
        if bx:
            links = DP.findall(bx[0].group(0))
            if links:
                url, text = links[0]
                text = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', text)).strip()
                if text and len(text) <= 80 and re.search(r'!\[[^\]]*\]\([^)]+\)\n', t):
                    try:
                        t = add_topline(t, topline(f'{text} — on Amazon', url))
                        toplines_added += 1
                    except AssertionError:
                        pass
    if t != orig:
        changed += 1
        if not DRY:
            save(p, t)
print(f'posts changed {changed} | buttons added {buttons_added} | toplines added {toplines_added} | dry={DRY}')
