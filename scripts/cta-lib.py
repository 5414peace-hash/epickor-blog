"""Helpers for rebuilding affiliate CTAs as product cards.

Why (2026-09-05, representative): impressions and clicks rose through August but Amazon
clicks did not. Measured across 378 public posts: since August the one-line topline link
under the hero fell from 86% of posts to 40%, the first Amazon link moved from the 14% mark
of the body to 35%, product (/dp/) links fell from 1.7 to 0.5 per post, and 78% of links
became bare Amazon searches. These helpers rebuild a post's CTAs into the agreed standard:

  * a topline link under the hero (product-specific, not a search)
  * the first box at the post's first decision moment (usually right after the Quick Guide
    or the first "what to buy/pack" section), never past ~30%
  * every box is a CARD: product name in bold with one line of what it is, one line of why
    this one, the disclosure, and ONE button
  * at most two boxes; extra products ride as inline links inside the card text

Usage from a batch script:
    import sys; sys.path.insert(0, 'scripts'); from cta_lib import *
"""
import re
import glob

DISC = '<em>As an Amazon Associate, EpicKor earns from qualifying purchases at no extra cost to you.</em>'
A = '?tag=epickor-20'
R = 'target="_blank" rel="nofollow sponsored noopener noreferrer"'


def find(slug):
    for p in glob.glob('content/blog/*.md'):
        if re.search(r'^slug: "%s"' % re.escape(slug), open(p, encoding='utf-8').read(), re.M):
            return p
    raise SystemExit('no post ' + slug)


def load(slug):
    p = find(slug)
    return p, open(p, encoding='utf-8').read()


def save(p, t):
    open(p, 'w', encoding='utf-8', newline='\n').write(t)


def boxes(t):
    return list(re.finditer(r'<div class="affiliate-inline-cta">[\s\S]*?</div>', t))


def link(text, url):
    return f'<a href="{url}{A}" {R}>{text}</a>'


def card(lead, body, url, button, disclose=True):
    return ('<div class="affiliate-inline-cta">\n'
            f'  <p><strong>{lead}</strong> {body}' + (' ' + DISC if disclose else '') + '</p>\n'
            f'  <a class="affiliate-cta-button" href="{url}{A}" {R}>{button}</a>\n'
            '</div>')


def topline(text, url):
    return (f'<p class="affiliate-topline"><a href="{url}{A}" {R}>{text}</a>'
            '<span class="affiliate-topline-note">Affiliate link. As an Amazon Associate, EpicKor earns from qualifying purchases at no extra cost to you.</span></p>')


def replace_box(t, idx, new):
    m = boxes(t)[idx]
    return t[:m.start()] + new + t[m.end():]


def remove_box(t, idx):
    m = boxes(t)[idx]
    s, e = m.start(), m.end()
    while e < len(t) and t[e] == '\n':
        e += 1
    return t[:s] + t[e:]


def insert_before_heading(t, heading, html):
    m = re.search(r'^## ' + re.escape(heading), t, re.M)
    assert m, 'no heading ' + heading
    return t[:m.start()] + html + '\n\n' + t[m.start():]


def add_topline(t, html):
    assert 'affiliate-topline' not in t, 'topline already present'
    m = re.search(r'!\[[^\]]*\]\([^)]+\)\n\*[^\n]*\*\n', t) or re.search(r'!\[[^\]]*\]\([^)]+\)\n', t)
    assert m, 'no image to hang the topline under'
    return t[:m.end()] + '\n' + html + '\n' + t[m.end():]


def replace_topline(t, html):
    return re.sub(r'<p class="affiliate-topline">[\s\S]*?</p>', lambda _: html, t, count=1)


def report(slug, t):
    body = re.sub(r'^---[\s\S]*?---\n', '', t)
    n = len(body.split())
    tl = re.search(r'affiliate-topline', body)
    bx = [round(len(body[:m.start()].split()) / n * 100) for m in re.finditer(r'affiliate-inline-cta', body)]
    print(slug, 'topline@', round(len(body[:tl.start()].split()) / n * 100) if tl else None,
          'boxes@', bx, 'buttons', body.count('affiliate-cta-button'),
          'search-links', len(re.findall(r'amazon\.com/s\?k=', body)))
