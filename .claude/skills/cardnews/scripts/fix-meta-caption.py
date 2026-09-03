"""Repair the caption of an ALREADY-SCHEDULED Meta post, in place.

  python .claude/skills/cardnews/scripts/fix-meta-caption.py       "<row title prefix>" <slug-dir> [--commit]

Without --commit it stops before saving and screenshots to .tmp/fix-precommit.png.

Why this exists (2026-09-03): Meta silently rotated two captions while they
were being typed -- 438 opened with its trailing hashtag block, 223 split
inside 'k-eta.g|o.kr' on line 26 and wrapped around. Re-uploading seven images
to fix text is wasteful, and 게시물 수정 edits the post in place.

Traps this encodes, all measured the same day:

  * **Each scheduled day is TWO rows** (Facebook + Instagram) and 게시물 수정
    edits ONE of them. Run this once per bad row; the prefix search reports how
    many rows still start with the bad text.
  * **Match on prefix, never substring.** A repaired caption still contains the
    bad row's opening hashtags near its end, so `.first` on a substring
    re-opens the row that is already correct. That happened on the first 438
    repair and silently wasted a pass.
  * **The confirm button in the edit dialog is labelled 예약**, the same as the
    composer's, not 저장.
  * **The '고정된 바로가기' tooltip intercepts pointer events** over the editor;
    it must be dismissed, and only it -- never click a bare 확인.
  * **Verify by reading the editor back.** The first retype attempt failed on
    every single run here (truncated, or rotated again); the second passed.
"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding="utf-8", errors="replace", line_buffering=True)

FRAG = sys.argv[1]
SLUG_DIR = Path(sys.argv[2])
COMMIT = '--commit' in sys.argv
LIST_URL = ("https://business.facebook.com/latest/posts/scheduled_posts"
            "?asset_id=1187482087784752&business_id=1214459297026761")

def caption_text(path):
    lines = path.read_text(encoding='utf-8').splitlines()
    while lines and (lines[0].startswith('#') or not lines[0].strip()):
        lines.pop(0)
    return chr(10).join(lines).strip()

cap_file = next((SLUG_DIR / n for n in ('caption.txt', 'instagram-caption.md')
                 if (SLUG_DIR / n).exists()), None)
caption = caption_text(cap_file)
norm = lambda t: ''.join(t.split())
want = norm(caption)
print(f'{SLUG_DIR.name}: {cap_file.name}, {len(caption)} chars, commit={COMMIT}')

def dismiss_pin_notice(page):
    """The '고정된 바로가기가 메인 메뉴의 이 페이지에 표시됩니다' tooltip sits on top
    of the composer and swallows clicks ('확인' intercepts pointer events).
    Scope the click to that notice so we never confirm something else."""
    for _ in range(3):
        hit = False
        for e in page.get_by_text('확인', exact=True).all():
            try:
                if not e.is_visible():
                    continue
                ctx = e.evaluate("n => (n.closest('div[role=\"dialog\"]')"
                                 " || n.parentElement.parentElement.parentElement)"
                                 ".innerText || ''")
                if '고정된 바로가기' in ctx:
                    e.click(); hit = True
                    page.wait_for_timeout(900)
            except Exception:
                pass
        if not hit:
            return

with sync_playwright() as p:
    b = p.chromium.connect_over_cdp("http://localhost:9222")
    page = b.contexts[0].new_page()
    page.set_viewport_size({"width": 1400, "height": 950})
    page.set_default_timeout(60000)
    page.goto(LIST_URL, wait_until="domcontentloaded")
    page.wait_for_timeout(11000)
    dismiss_pin_notice(page)

    # Match on PREFIX, not substring. A caption that has already been repaired
    # still CONTAINS the bad row's opening hashtags near its end, so .first on
    # a substring re-opens the row that is already correct -- which is exactly
    # what happened on the first 438 repair (2026-09-03).
    n = page.evaluate('''(frag) => {
      let n = 0;
      for (const el of document.querySelectorAll('span,div')) {
        if (el.children.length) continue;
        const t = (el.textContent||'').trim();
        if (t.length > 120 && t.startsWith(frag)) {
          el.setAttribute('data-fixtarget','1'); n++;
        }
      }
      return n;
    }''', FRAG)
    print('rows starting with fragment:', n)
    if not n:
        print('REFUSING: no row starts with that fragment'); page.close(); sys.exit(1)
    el = page.locator('[data-fixtarget]').first
    el.scroll_into_view_if_needed(); page.wait_for_timeout(1200)
    box = el.bounding_box()
    btn = None
    for b2 in page.locator('div[role="button"], button').all():
        try:
            if not b2.is_visible(): continue
            bb = b2.bounding_box()
            if bb and abs(bb['y']+bb['height']/2-(box['y']+box['height']/2)) < 22 \
               and bb['x'] > box['x']+box['width'] and bb['width'] < 70:
                btn = b2; break
        except Exception: pass
    if btn is None:
        print('REFUSING: row menu button not found'); page.close(); sys.exit(1)
    btn.click(); page.wait_for_timeout(2500)
    page.get_by_text('게시물 관리', exact=True).first.hover()
    page.wait_for_timeout(2200)
    page.get_by_text('게시물 수정', exact=True).first.click()
    print('opened 게시물 수정')
    page.wait_for_timeout(12000)
    dismiss_pin_notice(page)
    page.screenshot(path=".tmp/fix-editor-open.png")

    ed = None
    for i in range(page.locator('div[contenteditable="true"]').count()):
        c = page.locator('div[contenteditable="true"]').nth(i)
        if c.is_visible():
            ed = c; break
    if ed is None:
        print('REFUSING: no visible editor'); page.close(); sys.exit(1)
    print('current text len:', len(ed.inner_text()))
    print('current starts  :', repr(ed.inner_text()[:80]))

    ok = False
    for attempt in range(1, 4):
        ed.scroll_into_view_if_needed(); ed.click(); page.wait_for_timeout(700)
        page.keyboard.press('Control+a'); page.keyboard.press('Delete')
        page.wait_for_timeout(600)
        for i, line in enumerate(caption.splitlines()):
            if i:
                page.keyboard.press('Shift+Enter')
            page.keyboard.insert_text(line)
            if '#' in line or '.kr' in line or '.com' in line or 'http' in line:
                page.wait_for_timeout(500)
                page.keyboard.press('Escape')
                page.wait_for_timeout(250)
        page.wait_for_timeout(1500)
        got = norm(ed.inner_text())
        if got == want:
            print(f'caption verified (attempt {attempt})'); ok = True; break
        print(f'  MISMATCH {attempt}: got {len(got)} want {len(want)}')
        print('   got :', repr(got[:70]))
        print('   want:', repr(want[:70]))
    if not ok:
        print('REFUSING: caption never matched. Nothing saved.')
        page.screenshot(path=".tmp/fix-mismatch.png"); page.close(); sys.exit(1)

    page.screenshot(path=".tmp/fix-precommit.png")
    labels = []
    for e2 in page.locator('div[role="button"], button').all():
        try:
            if not e2.is_visible(): continue
            bb = e2.bounding_box()
            if bb and bb['y'] > 700:
                labels.append(((e2.inner_text() or '').strip(), e2))
        except Exception: pass
    print('footer:', [t for t, _ in labels])
    # the edit dialog's confirm button is labelled 예약, same as the composer's
    save = [e for t, e in labels
            if t in ('예약', '저장', '업데이트', '변경 사항 저장', '완료')]
    if not save:
        print('NO SAVE BUTTON FOUND — nothing clicked.'); page.close(); sys.exit(1)
    if not COMMIT:
        print('DRY RUN — save button present, stopping.'); page.close(); sys.exit(0)
    save[0].click(); print('clicked save')
    page.wait_for_timeout(12000)
    page.screenshot(path=".tmp/fix-committed.png")
    page.close()
    print('DONE')
