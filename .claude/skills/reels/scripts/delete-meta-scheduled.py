"""Delete scheduled Meta Business Suite posts that match a date AND a caption prefix.

Why this exists (2026-09-05): Meta cannot swap the media on a scheduled Reel. When a
render is superseded after scheduling (Dongmyo v003 -> v008: silent outro, a false
SOURCE credit, captions 0.6s late), the only path is delete + re-create. Deleting by
date alone is unsafe because the planner shows one row per platform and, on
2026-08-20, two different posts once shared a timestamp. So a row is deleted only
when BOTH the day stamp and the caption opening match.

Usage:
  python .claude/skills/reels/scripts/delete-meta-scheduled.py "<YYYY-MM-DD>" "<caption prefix>" [--commit]

Without --commit it opens each matching row's menu, prints the menu items, saves a
screenshot, and closes the menu. Nothing is deleted. Run that first, read the
screenshot, then run again with --commit.

Launches its own persistent context on the fixed profile; close the launcher Chrome
first (the profile lock otherwise yields a logged-out fresh profile).
"""
import re, sys, time
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace", line_buffering=True)

DATE, PREFIX = sys.argv[1], sys.argv[2]
COMMIT = "--commit" in sys.argv
Y, MO, D = (int(x) for x in DATE.split("-"))
STAMP_RE = re.compile(rf"{Y}년\s*{MO}월\s*{D}일")
PROFILE = r"D:\dev\.browser-profiles\epickor-meta"
LIST_URL = ("https://business.facebook.com/latest/posts/scheduled_posts"
            "?asset_id=1187482087784752&business_id=1214459297026761")


def log(*a):
    print(*a, flush=True)


def norm(t):
    return "".join(t.split())


def find_rows(page):
    """Planner rows are `tr[role=row]` and carry the FULL caption in their text
    (2,053 chars for the Dongmyo row on 2026-09-05), so match on the row, not on
    a size-capped ancestor. One row per platform: a day is normally two rows."""
    out = []
    for tr in page.locator('tr[role="row"]').all():
        try:
            t = tr.inner_text()
        except Exception:
            continue
        if STAMP_RE.search(t) and norm(PREFIX) in norm(t):
            out.append(tr)
    return out


with sync_playwright() as p:
    ctx = p.chromium.launch_persistent_context(
        PROFILE, channel="chrome", headless=False, no_viewport=True,
        args=["--no-first-run", "--no-default-browser-check", "--disable-sync",
              "--start-maximized"])
    page = ctx.pages[0] if ctx.pages else ctx.new_page()
    page.set_default_timeout(90000)
    page.goto(LIST_URL, wait_until="domcontentloaded")
    page.wait_for_timeout(11000)
    if page.locator('input[type="password"]').count():
        log("NOT LOGGED IN — 대표님 로그인 필요"); sys.exit(2)
    if "EpicKor" not in page.inner_text("body"):
        log("WRONG ASSET — EpicKor not on page"); sys.exit(2)

    # scroll the virtualised list until the target date is in the DOM
    FIND_SCROLLER = """() => { let best=null,bestH=0; for (const el of document.querySelectorAll('*')) { const s=getComputedStyle(el); if(!/(auto|scroll)/.test(s.overflowY)) continue; const extra=el.scrollHeight-el.clientHeight; if(extra>bestH && el.clientHeight>200){bestH=extra;best=el;} } if(best) best.setAttribute('data-scroller','1'); return bestH; }"""
    def scroll_to_stamp():
        extra = page.evaluate(FIND_SCROLLER)
        for _ in range(40):
            if STAMP_RE.search(page.inner_text("body")):
                return True
            if extra:
                page.evaluate("() => {const e=document.querySelector('[data-scroller]'); if(e) e.scrollTop += e.clientHeight*0.8;}")
            else:
                page.mouse.wheel(0, 700)
            page.wait_for_timeout(1000)
        return False
    page.set_viewport_size({"width": 1400, "height": 950})
    scroll_to_stamp()

    deleted = 0
    for attempt in range(6):
        rows = find_rows(page)
        log(f"matching rows on screen: {len(rows)}")
        if not rows:
            break
        row = rows[0]
        row.scroll_into_view_if_needed(); page.wait_for_timeout(600)
        log("row text:", repr(row.inner_text()[:160]))
        # the row's own menu button: prefer one inside the row, else the nearest
        # '드롭다운 열기' button on the same line
        btn = None
        inner = row.locator('div[role="button"]:has-text("드롭다운 열기")')
        if inner.count():
            btn = inner.first
        if btn is None:
            log("no menu button found for this row"); page.screenshot(path=".tmp/delete-no-menu.png"); sys.exit(1)
        btn.click(); page.wait_for_timeout(2500)

        def visible_menu_items():
            sel = ('[role="menuitem"], [role="menuitemcheckbox"], [role="menu"] div[role="button"], '
                   '[role="menu"] a, [role="dialog"] [role="menuitem"]')
            return [e for e in page.locator(sel).all() if e.is_visible()]

        items = visible_menu_items()
        if not items:
            # 2026-09-05: clicking the row's 드롭다운 opened the post DETAIL PANEL
            # ("게시물 상세 정보") instead of a menu, and ticked the row's checkbox.
            # The panel has its own "..." button top-right, and a "지금 게시"
            # button bottom-right that would publish immediately -- never touch it.
            # The panel's 옵션 button can render a few seconds after the panel
            # itself (a run on 2026-09-05 saw only 닫기 and correctly refused).
            # Poll for it rather than reading the header once.
            opt = None
            for _ in range(8):
                panel = page.get_by_text("게시물 상세 정보", exact=True)
                if panel.count():
                    hb = panel.first.bounding_box()
                    for b in page.locator('div[role="button"], button').all():
                        try:
                            if not b.is_visible():
                                continue
                            txt = (b.inner_text() or "").strip()
                            if "지금 게시" in txt:
                                continue
                            bb = b.bounding_box()
                            if txt.startswith("옵션") and bb and hb and abs(bb["y"] - hb["y"]) < 160:
                                opt = b
                                break
                        except Exception:
                            pass
                if opt is not None:
                    break
                page.wait_for_timeout(1500)
            if opt is None:
                log("panel 옵션 button never appeared")
            else:
                opt.click(); page.wait_for_timeout(2000)
                items = visible_menu_items()
        labels = [e.inner_text().strip() for e in items]
        log("menu items:", labels)
        if not labels:
            log("visible 삭제 texts:", [e.inner_text().strip()[:40] for e in page.get_by_text("삭제").all() if e.is_visible()])
        page.screenshot(path=f".tmp/delete-menu-{attempt}.png")
        # a photo row says 게시물 삭제, a Reel row says 릴스 삭제 (2026-09-05)
        target = next((e for e, l in zip(items, labels) if l.endswith("삭제") and "임시" not in l), None)
        if not COMMIT or target is None:
            log("dry run" if not COMMIT else "no 삭제 item — refusing")
            page.keyboard.press("Escape"); page.wait_for_timeout(800)
            if not COMMIT:
                break
            sys.exit(1)
        target.click(); page.wait_for_timeout(2000)
        # confirmation dialog
        confirm = [e for e in page.locator('div[role="dialog"] div[role="button"], div[role="dialog"] button').all() if e.is_visible()]
        clabels = [e.inner_text().strip() for e in confirm]
        log("dialog buttons:", clabels)
        page.screenshot(path=f".tmp/delete-confirm-{attempt}.png")
        ok = next((e for e, l in zip(confirm, clabels) if l.endswith("삭제") or l == "확인"), None)
        if ok is None:
            log("no confirm button — refusing"); page.keyboard.press("Escape"); sys.exit(1)
        ok.click(); page.wait_for_timeout(4000)
        deleted += 1
        log(f"deleted row {deleted}")
        page.reload(wait_until="domcontentloaded"); page.wait_for_timeout(9000)
        scroll_to_stamp()

    log(f"DONE — deleted {deleted} row(s)" if COMMIT else "DONE — dry run, nothing deleted")
    ctx.close()
