"""
Schedule one Reel end to end. Consolidates everything learned doing the first.

Usage:
  python .tmp/reel-schedule-one.py <video> <caption.txt> <day> <ampm> <hour> <minute>

Sequence and the traps at each step:
  1. Launch (not attach). Playwright refuses >50MB uploads to a browser it did
     not launch, and these renders are 58-130MB.
  2. Upload, then WAIT OUT "저작권이 있는 콘텐츠 확인 중". The 다음 button is
     inert while that runs but reports a successful click, so the page silently
     stays on 만들기.
  3. 다음 twice: 만들기 -> 수정 -> 공유하기. Target the footer button by
     geometry; get_by_text("다음").first resolves to something else.
  4. Pick 예약 in 예약 옵션. The footer flips 공유하기 -> 예약. That flip is the
     only guard against publishing immediately.
  5. Dates: click the field, then click the day cell in the calendar popup.
     Typing works but leaves the popup open, and it then swallows the click on
     the second row.
  6. Times: three spinbuttons per row (오전/오후, 시간, 분), default 오후 12:19.
     Zone shows Asia/Jayapura -- UTC+9, no DST, same wall clock as KST.
  7. Refuse to click unless the footer reads 예약.
"""
import sys, os, time
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

VIDEO, CAPTION, DAY, AMPM, HOUR, MINUTE = sys.argv[1:7]
PROFILE = r"D:\dev\.browser-profiles\epickor-meta"
COMPOSER = ("https://business.facebook.com/latest/reels_composer/"
            "?asset_id=1187482087784752&business_id=1214459297026761")


def log(*a):
    print(*a, flush=True)


def footer_button(page, text=None):
    """Buttons in the composer footer bar, optionally filtered by exact text."""
    out = []
    for el in page.locator('div[role="button"], button').all():
        try:
            if not el.is_visible():
                continue
            box = el.bounding_box()
            if not box or box["y"] < 560 or box["x"] < 1200:
                continue
            t = el.inner_text().strip()
            if text is None or t == text:
                out.append((box, t, el))
        except Exception:
            pass
    return out


def date_inputs(page):
    return [e for e in page.locator('input').all()
            if e.is_visible() and not e.get_attribute("role")
            and (e.get_attribute("value") or "")[:2] == "20"]


with sync_playwright() as p:
    ctx = p.chromium.launch_persistent_context(
        PROFILE, channel="chrome", headless=False, no_viewport=True,
        args=["--start-maximized", "--remote-debugging-port=9222"])
    page = ctx.pages[0] if ctx.pages else ctx.new_page()
    page.goto(COMPOSER, wait_until="domcontentloaded")
    page.wait_for_timeout(9000)

    # 1. upload -------------------------------------------------------------
    with page.expect_file_chooser(timeout=45000) as fc:
        page.get_by_text("동영상 추가", exact=True).first.click()
    fc.value.set_files(VIDEO)
    log(f"uploading {os.path.basename(VIDEO)} ({os.path.getsize(VIDEO)/1e6:.0f} MB)")
    # "동영상 추가" never disappears -- the add-media buttons stay on screen, so
    # the first version of this loop burned the full 15-minute cap every run.
    # The composer shows the filename and "100%" once the transfer completes.
    base = os.path.basename(VIDEO)
    end = time.time() + 900
    while time.time() < end:
        page.wait_for_timeout(5000)
        t = page.inner_text("body")
        if base in t and "100%" in t:
            break
    page.wait_for_timeout(4000)
    log("upload settled")

    # 2. caption ------------------------------------------------------------
    text = open(CAPTION, encoding="utf-8").read().strip()
    ed = page.locator('div[contenteditable="true"]').first
    ed.scroll_into_view_if_needed(); ed.click(); page.wait_for_timeout(600)
    for i, line in enumerate(text.split("\n")):
        if i:
            page.keyboard.press("Shift+Enter")
        page.keyboard.type(line, delay=3)
    log(f"caption typed ({len(text)} chars)")

    # 3. copyright scan then two 다음 ---------------------------------------
    end = time.time() + 600
    while time.time() < end:
        if "확인 중" not in page.inner_text("body"):
            break
        page.wait_for_timeout(8000)
    log("copyright scan clear")

    for step in ("수정", "공유하기"):
        cands = footer_button(page, "다음")
        if not cands:
            log(f"no 다음 button before {step}"); sys.exit(1)
        cands[0][2].click()
        page.wait_for_timeout(9000)
        log(f"advanced -> {step}")

    # 4. schedule option ----------------------------------------------------
    page.get_by_text("예약 옵션", exact=True).first.scroll_into_view_if_needed()
    page.wait_for_timeout(1000)
    opt = page.get_by_text("예약", exact=True)
    if opt.count() != 1:
        log(f"unexpected 예약 matches: {opt.count()}"); sys.exit(1)
    opt.first.click()
    page.wait_for_timeout(3000)
    log("예약 option selected")

    # 5. dates via the calendar --------------------------------------------
    for idx in range(2):
        ins = date_inputs(page)
        if idx >= len(ins):
            log(f"date row {idx} missing"); sys.exit(1)
        ins[idx].click()
        page.wait_for_timeout(1200)
        picked = False
        for i in range(page.get_by_text(DAY, exact=True).count()):
            el = page.get_by_text(DAY, exact=True).nth(i)
            try:
                box = el.bounding_box()
                if el.is_visible() and box and box["x"] < 560 and box["width"] < 60:
                    el.click(); picked = True; break
            except Exception:
                pass
        page.wait_for_timeout(1500)
        log(f"  date row {idx}: picked={picked} -> {ins[idx].get_attribute('value')!r}")

    # 6. times --------------------------------------------------------------
    page.keyboard.press("Escape"); page.wait_for_timeout(700)
    spins = [e for e in page.locator('[role="spinbutton"]').all() if e.is_visible()]
    for row in range(len(spins) // 3):
        ampm, hh, mm = spins[row*3], spins[row*3+1], spins[row*3+2]
        ampm.scroll_into_view_if_needed(); ampm.click(); page.wait_for_timeout(350)
        for _ in range(3):
            if ampm.input_value() == AMPM:
                break
            page.keyboard.press("ArrowUp"); page.wait_for_timeout(350)
        hh.click(); page.wait_for_timeout(300); page.keyboard.type(HOUR)
        page.wait_for_timeout(450)
        mm.click(); page.wait_for_timeout(300); page.keyboard.type(MINUTE)
        page.wait_for_timeout(600)
    page.keyboard.press("Escape"); page.wait_for_timeout(1500)

    shot = f".tmp/reel-pre-commit-{os.path.basename(VIDEO)[:28]}.png"
    page.screenshot(path=shot)
    log("pre-commit screenshot:", shot)
    for i, d in enumerate(date_inputs(page)):
        log(f"  date[{i}] = {d.get_attribute('value')!r}")

    # 7. commit, guarded ----------------------------------------------------
    ok = footer_button(page, "예약")
    if not ok:
        log("REFUSING: footer does not read 예약. Nothing clicked.")
        page.wait_for_timeout(600000)
        sys.exit(1)
    log("footer reads 예약 -- committing")
    ok[0][2].click()

    end = time.time() + 900
    while time.time() < end:
        page.wait_for_timeout(8000)
        if "예약 중" not in page.inner_text("body"):
            log("processing finished")
            break
    else:
        log("still showing 예약 중 after 15 min (upload may still be in flight)")
    page.screenshot(path=".tmp/reel-committed.png")
    log("DONE")
