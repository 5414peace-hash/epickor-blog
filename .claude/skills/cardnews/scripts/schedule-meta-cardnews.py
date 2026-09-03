"""Schedule one card-news carousel on Meta Business Suite.

Usage:
  python .claude/skills/cardnews/scripts/schedule-meta-cardnews.py <slug-dir> <DAY> <AMPM> <HOUR> <MINUTE> [--commit]

  <slug-dir>  e.g. public/assets/cardnews/2026-08-08_samick
  <DAY>       day-of-month as it appears in the calendar popup, e.g. "16"
  <AMPM>      오전 | 오후
  <HOUR>      "5"
  <MINUTE>    "00"
  --commit    actually click 예약. Without it the script stops one click short
              and screenshots, which is how every new date/asset should be
              rehearsed first.

Traps this encodes (2026-08-09 실측):
  * The composer's default footer button is **게시** — immediate publish. The
    only thing that flips it to 예약 is the switch beside "날짜 및 시간 설정".
    We refuse to click unless the footer literally reads 예약.
  * Meta Suite opens on **VDOLAB** by default. We navigate with EpicKor's
    asset_id and assert the page says EpicKor before touching anything.
  * The file input does not exist until "사진/동영상 추가" is clicked, so the
    upload must go through expect_file_chooser; all 7 PNGs go in one set_files.
  * There are **two** date rows (Facebook and Instagram). Both must be set, or
    one surface publishes immediately.
  * Dates must be picked from the calendar popup: typing leaves the popup open
    and it swallows the click on the second row.
  * Caption newlines are Shift+Enter. A bare Enter submits.
  * **The caption file is `caption.txt`.** It was `instagram-caption.md`,
    which this script hard-coded; the name changed after the 8/16 batch and
    the script was not run again until 2026-09-03, when it crashed on the
    first folder. It now accepts either and logs which one it read.
  * **Meta can silently reorder the caption while it is being typed.**
    2026-09-03: the trailing hashtag line jumped to offset 0 and the post
    scheduled as '#epickorKorea tested 56 ramyun pots...'. The editor is
    read back and compared against the file before anything is clicked.
"""
import sys
import os
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

SLUG_DIR = Path(sys.argv[1])
DAY, AMPM, HOUR, MINUTE = sys.argv[2:6]
COMMIT = '--commit' in sys.argv

ASSET = '1187482087784752'
BIZ = '1214459297026761'
COMPOSER = (f'https://business.facebook.com/latest/composer/'
            f'?asset_id={ASSET}&business_id={BIZ}')


def log(*a):
    print(*a, flush=True)


def caption_text(path: Path) -> str:
    lines = path.read_text(encoding='utf-8').splitlines()
    # drop the markdown heading our files carry; it is a filing label, not copy
    while lines and (lines[0].startswith('#') or not lines[0].strip()):
        lines.pop(0)
    return '\n'.join(lines).strip()


def footer_buttons(page):
    out = []
    for el in page.locator('div[role="button"], button').all():
        try:
            if not el.is_visible():
                continue
            box = el.bounding_box()
            if not box or box['y'] < 600 or box['x'] < 380:
                continue
            out.append(((el.inner_text() or '').strip(), el))
        except Exception:
            pass
    return out


def date_inputs(page):
    return [e for e in page.locator('input').all()
            if e.is_visible() and not e.get_attribute('role')
            and (e.get_attribute('value') or '').startswith('20')]


cards = sorted(SLUG_DIR.glob('card_0*.png'))
assert len(cards) == 7, f'expected 7 cards, found {len(cards)} in {SLUG_DIR}'
cap_file = next((SLUG_DIR / n for n in ('caption.txt', 'instagram-caption.md')
                 if (SLUG_DIR / n).exists()), None)
assert cap_file, f'no caption.txt or instagram-caption.md in {SLUG_DIR}'
caption = caption_text(cap_file)
log(f'{SLUG_DIR.name}: {len(cards)} cards, caption {cap_file.name} {len(caption)} chars, '
    f'target {DAY}일 {AMPM} {HOUR}:{MINUTE}, commit={COMMIT}')

with sync_playwright() as p:
    b = p.chromium.connect_over_cdp('http://localhost:9222')
    ctx = b.contexts[0]
    # A composer holding media fires beforeunload on navigate, and a sync-API
    # dialog handler blows up inside the greenlet. Sidestep it: close the old
    # tabs (page.close skips beforeunload) and work in a fresh one.
    # Work in our own tab and never touch the launcher's: closing the launcher's
    # page kills its keep-alive loop, and closing the LAST page terminates
    # Chrome outright (learned twice on 2026-08-09).
    page = ctx.new_page()
    page.set_viewport_size({'width': 1280, 'height': 900})

    # 0. fresh composer on the right asset ---------------------------------
    page.set_default_timeout(90000)
    page.goto(COMPOSER, wait_until='domcontentloaded', timeout=90000)
    page.wait_for_timeout(9000)
    body = page.inner_text('body')
    if 'EpicKor' not in body:
        log('REFUSING: composer does not show EpicKor'); sys.exit(1)
    if 'VDOLAB' in body or 'Vdolab' in body:
        log('REFUSING: VDOLAB visible in composer'); sys.exit(1)
    log('composer open on EpicKor')

    # 1. upload the 7 cards in one shot ------------------------------------
    with page.expect_file_chooser(timeout=45000) as fc:
        page.get_by_text('사진/동영상 추가', exact=True).first.click()
    fc.value.set_files([str(c) for c in cards])
    log('files handed to chooser')

    end = time.time() + 300
    while time.time() < end:
        page.wait_for_timeout(4000)
        t = page.inner_text('body')
        if '업로드 중' not in t and '처리 중' not in t:
            imgs = page.locator('img[src^="blob:"], img[src*="scontent"]').count()
            if imgs >= 7:
                break
    page.wait_for_timeout(3000)
    log('upload settled')

    # 2. caption ------------------------------------------------------------
    # After the upload there are two contenteditables and the FIRST is hidden
    # (detached preview shell); taking `.first` throws on scroll. Take the first
    # *visible* one.
    ed = None
    for i in range(page.locator('div[contenteditable="true"]').count()):
        cand = page.locator('div[contenteditable="true"]').nth(i)
        if cand.is_visible():
            ed = cand
            break
    if ed is None:
        log('REFUSING: no visible caption editor'); sys.exit(1)
    ed.scroll_into_view_if_needed()

    def norm(t):
        # whitespace-insensitive: the editor renders blank lines differently
        # from the file, but a relocated block still shows up as a mismatch.
        return ''.join(t.split())

    # 2b. Type the caption, then READ THE EDITOR BACK before trusting it.
    # On 2026-09-03 a run typed all 1,794 characters and Meta moved the
    # trailing hashtag line to the FRONT, scheduling a post that opened
    # '#epickorKorea tested 56 ramyun pots...' with no hashtags at the end.
    # The caret resets to offset 0 when the '#' helper opens, so whatever is
    # typed next lands at the start. It is timing-dependent -- two posts
    # scheduled in the same hour were clean -- so inspection is not a gate,
    # and the pre-commit screenshot only ever shows the middle of a scrolled
    # editor. Compare against the source file and retype on mismatch.
    want = norm(caption)
    for attempt in range(1, 4):
        ed.click()
        page.wait_for_timeout(700)
        page.keyboard.press('Control+a')
        page.keyboard.press('Delete')
        page.wait_for_timeout(500)
        for i, line in enumerate(caption.splitlines()):
            if i:
                page.keyboard.press('Shift+Enter')
            # insert_text, NOT type(): character-by-character key events wake
            # Meta's hashtag helper and its URL auto-linker, and both reset the
            # caret to offset 0 mid-line. That is what rotated two captions on
            # 2026-09-03 -- 438 split before its hashtag block, 223 split inside
            # 'k-eta.g|o.kr' on line 26. insert_text delivers the line as one
            # input event, and is far faster besides.
            page.keyboard.insert_text(line)
            if '#' in line or '.kr' in line or '.com' in line or 'http' in line:
                page.wait_for_timeout(500)
                page.keyboard.press('Escape')
                page.wait_for_timeout(250)
        page.wait_for_timeout(1200)
        got = norm(ed.inner_text())
        if got == want:
            log(f'caption typed and verified (attempt {attempt})')
            break
        log(f'  caption MISMATCH attempt {attempt}: got {len(got)} chars, '
            f'want {len(want)}')
        log(f'    got  starts: {got[:60]!r}')
        log(f'    want starts: {want[:60]!r}')
    else:
        log('REFUSING: caption never matched the source. Nothing scheduled.')
        sys.exit(1)

    # 3. the schedule switch — this is the whole safety story ---------------
    lbl = page.get_by_text('날짜 및 시간 설정', exact=True).first
    lbl.scroll_into_view_if_needed()
    page.wait_for_timeout(600)
    lb = lbl.bounding_box()
    sw = None
    for el in page.locator('[role="switch"]').all():
        try:
            if el.is_visible() and abs(el.bounding_box()['y'] - lb['y']) < 40:
                sw = el
                break
        except Exception:
            pass
    if sw is None:
        log('REFUSING: schedule switch not found'); sys.exit(1)
    if sw.get_attribute('aria-checked') != 'true':
        sw.click()
        page.wait_for_timeout(2500)
    if sw.get_attribute('aria-checked') != 'true':
        log('REFUSING: schedule switch did not turn on'); sys.exit(1)
    log('schedule switch ON')

    # 4. both date rows via the calendar popup ------------------------------
    for idx in range(2):
        ins = date_inputs(page)
        if idx >= len(ins):
            log(f'REFUSING: date row {idx} missing'); sys.exit(1)
        ins[idx].click()
        page.wait_for_timeout(1200)
        picked = False
        cells = page.get_by_text(DAY, exact=True)
        for i in range(cells.count()):
            el = cells.nth(i)
            try:
                box = el.bounding_box()
                if el.is_visible() and box and box['width'] < 60 and box['height'] < 60:
                    el.click()
                    picked = True
                    break
            except Exception:
                pass
        page.wait_for_timeout(1200)
        log(f'  date[{idx}] picked={picked} -> {ins[idx].get_attribute("value")!r}')

    page.keyboard.press('Escape')
    page.wait_for_timeout(800)

    # 5. times: three spinbuttons per row -----------------------------------
    spins = [e for e in page.locator('[role="spinbutton"]').all() if e.is_visible()]
    for row in range(len(spins) // 3):
        ampm, hh, mm = spins[row*3], spins[row*3+1], spins[row*3+2]
        ampm.scroll_into_view_if_needed()
        ampm.click()
        page.wait_for_timeout(350)
        # The AM/PM spinbutton's .value is always '' — the state lives in
        # aria-valuetext, and ArrowUp toggles it. Comparing input_value() here
        # silently left every post at 오후 (caught on the 8/16 rehearsal).
        for _ in range(3):
            if ampm.get_attribute('aria-valuetext') == AMPM:
                break
            page.keyboard.press('ArrowUp')
            page.wait_for_timeout(400)
        if ampm.get_attribute('aria-valuetext') != AMPM:
            log(f'REFUSING: row {row} AM/PM stuck at '
                f'{ampm.get_attribute("aria-valuetext")!r}')
            sys.exit(1)
        hh.click(); page.wait_for_timeout(300); page.keyboard.type(HOUR)
        page.wait_for_timeout(400)
        mm.click(); page.wait_for_timeout(300); page.keyboard.type(MINUTE)
        page.wait_for_timeout(500)
    page.keyboard.press('Escape')
    page.wait_for_timeout(1200)

    for i, d in enumerate(date_inputs(page)):
        log(f'  final date[{i}] = {d.get_attribute("value")!r}')
    rows = page.locator('[role="spinbutton"]').first.evaluate(
        "() => Array.from(document.querySelectorAll('[role=\"spinbutton\"]'))"
        ".map(e => e.getAttribute('aria-valuetext'))")
    log('  final time parts =', rows)
    bad = [i for i, v in enumerate(rows) if i % 3 == 0 and v != AMPM]
    if bad:
        log(f'REFUSING: AM/PM wrong on row(s) {bad}: {rows}')
        sys.exit(1)

    # NOTE: hour and minute cannot be read back from this form (measured
    # 2026-09-03: both aria-valuetext AND .value are empty on those two
    # spinbuttons; only AM/PM exposes state). Their real gates are the
    # pre-commit screenshot, which renders '오전 05:00' as text, and reading
    # the scheduled list afterwards with read-meta-scheduled.py.

    shot = f'.tmp/meta-precommit-{SLUG_DIR.name}.png'
    page.screenshot(path=shot)
    log('pre-commit shot:', shot)

    # 6. commit, guarded ----------------------------------------------------
    labels = [t for t, _ in footer_buttons(page)]
    log('footer:', labels)
    sched = [el for t, el in footer_buttons(page) if t == '예약']
    if not sched:
        log('REFUSING: footer does not read 예약. Nothing clicked.')
        sys.exit(1)
    if not COMMIT:
        log('DRY RUN — footer reads 예약; stopping without clicking.')
        page.close()
        sys.exit(0)

    sched[0].click()
    log('clicked 예약')
    end = time.time() + 300
    while time.time() < end:
        page.wait_for_timeout(5000)
        t = page.inner_text('body')
        if '예약 중' not in t and '게시물 만들기' not in t:
            break
    page.screenshot(path=f'.tmp/meta-committed-{SLUG_DIR.name}.png')
    page.close()
    log('DONE')
