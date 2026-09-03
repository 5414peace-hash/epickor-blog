"""Read the EpicKor Meta Business Suite scheduled-post calendar. Read-only.

Why this file exists in the repo rather than .tmp/ (2026-09-03):
  This reader had been rewritten from scratch three times (v1, v2, a CDP
  version) because every copy lived in `.tmp/`, which is gitignored. The
  scheduler beside it was tracked and survived; the reader was not and did not.
  **The calendar is the only honest record of what is scheduled** — the index
  file `public/assets/cardnews/CARDNEWS_INDEX.md` records intent, and on
  2026-08-20 the two disagreed (`musinsa` filed as 09-17, actually 09-03 오후
  8:00, doubled up on another post). So this has to be cheap to re-run.

Usage:
  # against the Chrome the launcher is already holding open (preferred)
  python .claude/skills/cardnews/scripts/read-meta-scheduled.py

  # standalone, when no launcher is running
  python .claude/skills/cardnews/scripts/read-meta-scheduled.py --own-browser

Traps this encodes:
  * **Do not launch a persistent context on a profile another process holds.**
    Chrome locks the user-data-dir; the second launch either fails or starts a
    fresh profile with no login. Connect over CDP when the launcher is up.
  * **The login check must look for a password field.** v1 tested
    `'로그인' in body[:2000]`, which is true on a *logged-in* page too (the
    account menu contains the word) and made it bail on a healthy session.
  * **stdout is block-buffered when not a TTY**, so an unflushed script looks
    hung. line_buffering=True.
  * The list is **virtualised**: rows not scrolled into view are not in the
    DOM. Scroll the inner scroller to the end or the tail is silently missing.
  * The list shows one row per platform, so a normal day is **two rows**
    (Facebook + Instagram) at the same timestamp. Distinct timestamps, not row
    count, is the number of scheduled days.
"""
import re, sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace", line_buffering=True)

OWN = "--own-browser" in sys.argv
PROFILE = r"D:\dev\.browser-profiles\epickor-meta"
LIST_URL = ("https://business.facebook.com/latest/posts/scheduled_posts"
            "?asset_id=1187482087784752&business_id=1214459297026761")
STAMP = re.compile(
    r"(20\d\d)년\s*(\d+)월\s*(\d+)일\s*\S*?요일\s*(오전|오후)?\s*(\d+):(\d+)")

FIND_SCROLLER = """
() => {
  let best = null, bestH = 0;
  for (const el of document.querySelectorAll('*')) {
    const s = getComputedStyle(el);
    if (!/(auto|scroll)/.test(s.overflowY)) continue;
    const extra = el.scrollHeight - el.clientHeight;
    if (extra > bestH && el.clientHeight > 200) { bestH = extra; best = el; }
  }
  if (best) best.setAttribute('data-scroller', '1');
  return bestH;
}
"""


def harvest(page):
    page.set_viewport_size({"width": 1400, "height": 950})
    page.set_default_timeout(90000)
    page.goto(LIST_URL, wait_until="domcontentloaded", timeout=90000)
    page.wait_for_timeout(11000)
    if page.locator('input[type="password"]').count():
        print("NOT LOGGED IN — 대표님 로그인 필요")
        return None
    if "EpicKor" not in page.inner_text("body"):
        print("WRONG ASSET — EpicKor not on page")
        return None
    print("logged in, asset=EpicKor")

    extra = page.evaluate(FIND_SCROLLER)
    print("scroller extra height:", extra)
    seen = {}
    for _ in range(40):
        txt = page.inner_text("body")
        for m in STAMP.finditer(txt):
            y, mo, d, ap, hh, mm = m.groups()
            key = (int(y), int(mo), int(d), ap or "", int(hh), int(mm))
            # keep the raw slice: on 2026-09-03 the 오전/오후 group came back
            # empty for every row, and a stamp without it cannot confirm a
            # 05:00 schedule against a 05:00 PM one.
            seen.setdefault(key, txt[max(0, m.start() - 12):m.end() + 16]
                            .replace("\n", " | "))
        if extra:
            page.evaluate("() => {const e=document.querySelector('[data-scroller]');"
                          "if(e) e.scrollTop += e.clientHeight*0.8;}")
        else:
            page.mouse.wheel(0, 700)
        page.wait_for_timeout(1100)
    return seen


with sync_playwright() as p:
    if OWN:
        ctx = p.chromium.launch_persistent_context(
            PROFILE, channel="chrome", headless=False, no_viewport=True,
            args=["--no-first-run", "--no-default-browser-check",
                  "--disable-sync"])
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        seen = harvest(page)
    else:
        b = p.chromium.connect_over_cdp("http://localhost:9222")
        page = b.contexts[0].new_page()
        try:
            seen = harvest(page)
        finally:
            page.close()   # never close the launcher's own tab

    if seen is None:
        sys.exit(2)
    rows = sorted(seen)
    print(f"\n--- {len(rows)} distinct timestamps ---")
    days = {}
    for y, mo, d, ap, hh, mm in rows:
        days.setdefault((y, mo, d), set()).add(f"{ap or '??'} {hh}:{mm:02d}")
    for k in sorted(days):
        print(f"{k[0]}-{k[1]:02d}-{k[2]:02d}  {' , '.join(sorted(days[k]))}")
    print("\n--- raw slice of the first row (check 오전/오후 renders here) ---")
    if rows:
        print("   ", repr(seen[rows[0]]))
