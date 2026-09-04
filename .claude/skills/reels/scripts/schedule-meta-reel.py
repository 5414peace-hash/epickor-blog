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
     Read their state from aria-valuetext. input_value() is ALWAYS '' on these,
     so an `input_value() == "오전"` loop never terminates early -- it just
     presses ArrowUp its maximum number of times and lands wherever that puts
     it. That silently scheduled a card-news batch to 오후 once.
  7. Refuse to click unless the footer reads 예약, and unless both date fields
     and all spinbuttons read back what was asked for.
"""
import sys, os, re, time
from playwright.sync_api import sync_playwright
sys.stdout.reconfigure(encoding="utf-8", errors="replace")

VIDEO, CAPTION, DAY, AMPM, HOUR, MINUTE = sys.argv[1:7]
CE = 'div[contenteditable="true"]'
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


def spin_text(el):
    """The visible state of a date/time spinbutton.

    input_value() returns '' for every one of these, so anything that compares
    against it is comparing against nothing.
    """
    for attr in ("aria-valuetext", "aria-valuenow"):
        v = el.get_attribute(attr)
        if v:
            return v.strip()
    try:
        return (el.evaluate("e => e.parentElement.innerText") or "").strip()
    except Exception:
        return ""


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
    # THIS SECTION IS A GATE, NOT A TYPIST. On 2026-09-03 the card-news
    # scheduler typed 1,794 characters correctly and Meta moved the trailing
    # hashtag line to the FRONT of two of five posts: the hashtag helper and
    # the URL auto-linker each reset the caret to offset 0 mid-line, so
    # everything typed after that point lands at the start. It is timing
    # dependent -- the other three posts in the same hour were clean -- so
    # neither inspection nor a screenshot is a gate, and the pre-commit
    # screenshot only ever shows the middle of a scrolled editor. The only
    # gate is reading the editor back and comparing it to the source file.
    text = open(CAPTION, encoding="utf-8").read().strip()
    # 2026-09-05: Instagram caps a caption at 2,200 characters. The composer
    # shows a red banner and the 다음 button stays on 만들기 while REPORTING a
    # successful click, so the run burned a 10-minute wait before anyone saw
    # it. Refuse before the upload rather than after.
    # Meta counts UTF-16 code units, not characters: every emoji is 2, and a
    # 🗓️/▪️ with a variation selector is 3. A 2,197-character caption was
    # refused by the composer on 2026-09-05. Count the way Meta counts, and
    # keep a margin.
    u16 = len(text.encode("utf-16-le")) // 2
    if u16 > 2150:
        log(f"REFUSING: caption is {u16} UTF-16 units ({len(text)} chars); Instagram limit is 2,200 units. Nothing uploaded.")
        sys.exit(1)

    ed = None
    for i in range(page.locator(CE).count()):
        cand = page.locator(CE).nth(i)
        if cand.is_visible():
            ed = cand
            break
    if ed is None:
        log("REFUSING: no visible caption editor"); sys.exit(1)
    ed.scroll_into_view_if_needed()

    def norm(t):
        # whitespace-insensitive: the editor renders blank lines differently
        # from the file, but a relocated block still shows up as a mismatch.
        return "".join(t.split())

    want = norm(text)
    for attempt in range(1, 4):
        ed.click(); page.wait_for_timeout(700)
        page.keyboard.press("Control+a")
        page.keyboard.press("Delete")
        page.wait_for_timeout(500)
        for i, line in enumerate(text.splitlines()):
            if i:
                page.keyboard.press("Shift+Enter")
            # insert_text, NOT type(): per-character key events wake the
            # helpers described above. One input event per line does not,
            # and it is far faster besides.
            page.keyboard.insert_text(line)
            if "#" in line or ".kr" in line or ".com" in line or "http" in line:
                page.wait_for_timeout(500)
                page.keyboard.press("Escape")
                page.wait_for_timeout(250)
        page.wait_for_timeout(1200)
        got = norm(ed.inner_text())
        if got == want:
            log(f"caption verified ({len(text)} chars, attempt {attempt})")
            break
        log(f"  caption MISMATCH attempt {attempt}: got {len(got)}, want {len(want)}")
        log(f"    got  starts: {got[:60]!r}")
        log(f"    want starts: {want[:60]!r}")
    else:
        log("REFUSING: caption never matched the source. Nothing scheduled.")
        sys.exit(1)

    # 3. copyright scan then two 다음 ---------------------------------------
    end = time.time() + 600
    while time.time() < end:
        if "확인 중" not in page.inner_text("body"):
            break
        page.wait_for_timeout(8000)
    log("copyright scan clear")

    for step in ("수정", "공유하기"):
        # 2026-09-05: the 다음 button can sit at aria-disabled="true" for a while
        # AFTER "확인 중" has left the page (the video is still being processed).
        # Playwright then retries the click for 30s and dies with a timeout. Wait
        # for the button to actually enable, up to ten minutes, before clicking.
        end = time.time() + 600
        cands = []
        while time.time() < end:
            cands = [c for c in footer_button(page, "다음")
                     if c[2].get_attribute("aria-disabled") != "true"]
            if cands:
                break
            page.wait_for_timeout(5000)
        if not cands:
            log(f"no enabled 다음 button before {step} after 10 min")
            page.screenshot(path=".tmp/reel-next-disabled.png")
            sys.exit(1)
        cands[0][2].click()
        page.wait_for_timeout(9000)
        body = page.inner_text("body")
        if "2,200자" in body or "2200자" in body:
            log("REFUSING: composer says the Instagram caption exceeds 2,200 chars; still on 만들기")
            page.screenshot(path=".tmp/reel-caption-too-long.png")
            sys.exit(1)
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
    rows = len(spins) // 3
    log(f"time rows: {rows}")
    for row in range(rows):
        ampm, hh, mm = spins[row*3], spins[row*3+1], spins[row*3+2]
        ampm.scroll_into_view_if_needed(); ampm.click(); page.wait_for_timeout(350)
        # ArrowUp toggles 오전/오후. Read the real state, never input_value().
        for _ in range(4):
            if spin_text(ampm) == AMPM:
                break
            page.keyboard.press("ArrowUp"); page.wait_for_timeout(400)
        hh.click(); page.wait_for_timeout(300); page.keyboard.type(HOUR)
        page.wait_for_timeout(450)
        mm.click(); page.wait_for_timeout(300); page.keyboard.type(MINUTE)
        page.wait_for_timeout(600)
    page.keyboard.press("Escape"); page.wait_for_timeout(1500)

    shot = f".tmp/reel-pre-commit-{os.path.basename(VIDEO)[:28]}.png"
    page.screenshot(path=shot)
    log("pre-commit screenshot:", shot)

    # 7. verify everything BEFORE the commit, then commit ---------------------
    bad = []
    dates_now = [d.get_attribute("value") for d in date_inputs(page)]
    for i, v in enumerate(dates_now):
        log(f"  date[{i}] = {v!r}")
        # The field reformats on blur: '2026-8-25' at pick time becomes
        # '2026년 8월 25일' by the time it is verified. Pull the numbers out
        # rather than matching the surface string.
        nums = re.findall(r"\d+", v or "")
        if len(nums) < 3 or int(nums[2]) != int(DAY):
            bad.append(f"date row {i} reads {v!r}, wanted day {DAY}")
    if len(dates_now) < 2:
        bad.append(f"expected 2 date rows (Facebook + Instagram), saw {len(dates_now)}")

    spins = [e for e in page.locator('[role="spinbutton"]').all() if e.is_visible()]
    for row in range(len(spins) // 3):
        got = [spin_text(s) for s in spins[row*3:row*3+3]]
        log(f"  time[{row}] = {got}")
        if got[0] != AMPM:
            bad.append(f"time row {row} is {got[0]!r}, wanted {AMPM}")
        if got[1].lstrip("0") != HOUR.lstrip("0"):
            bad.append(f"time row {row} hour is {got[1]!r}, wanted {HOUR}")
        if got[2].lstrip("0") != MINUTE.lstrip("0"):
            bad.append(f"time row {row} minute is {got[2]!r}, wanted {MINUTE}")

    ok = footer_button(page, "예약")
    if not ok:
        bad.append("footer does not read 예약 (it would publish immediately)")
    if bad:
        log("REFUSING — nothing clicked:")
        for b in bad:
            log(f"   {b}")
        # Short hold: the pre-commit screenshot above is already the evidence,
        # and a refusal costs the whole upload anyway — no reason to also sit
        # here for ten minutes before the run can be retried.
        log(f"see {shot}; holding 90s then closing")
        page.wait_for_timeout(90000)
        sys.exit(1)
    log("footer reads 예약, date and time verified -- committing")
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
