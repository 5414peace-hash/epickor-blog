"""
Read the published-post list from Meta Suite and dump it raw.

READ-ONLY. Navigates, scrolls, screenshots, prints. Clicks nothing that
changes state.

Why raw rather than parsed: the last capture (2026-07-30) was done by hand
through the object-insights detail view, and metrics.json records the column
order it saw. Column order is not a stable contract. So this script's job is
to get the text out intact; parsing happens afterwards against the dump, where
a wrong guess is cheap to fix.

Traps inherited from meta-read-scheduled.py, already paid for once:
  - The list lazy-loads inside its own scroll container. page.mouse.wheel
    scrolls the window, not the list, and silently under-reports.
  - Account defaults to VDOLAB. asset_id in the URL pins epickorsnippets.

Usage:
  python .tmp/meta-read-published.py [out_path]
"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

PROFILE = r"D:\dev\.browser-profiles\epickor-meta"
ASSET = "asset_id=1187482087784752&business_id=1214459297026761"
URLS = [
    ("published", f"https://business.facebook.com/latest/posts/published_posts?{ASSET}"),
]
OUT = Path(sys.argv[1] if len(sys.argv) > 1 else ".tmp/meta-published-dump.txt")

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

SCROLL = """
() => {
  const el = document.querySelector('[data-scroller="1"]');
  if (el) { el.scrollTop = el.scrollTop + el.clientHeight * 0.8; return el.scrollTop; }
  window.scrollBy(0, 800); return window.scrollY;
}
"""


def log(*a):
    print(*a, flush=True)


with sync_playwright() as p:
    ctx = p.chromium.launch_persistent_context(
        PROFILE, channel="chrome", headless=False, no_viewport=True,
        args=["--start-maximized", "--remote-debugging-port=9222"])
    page = ctx.pages[0] if ctx.pages else ctx.new_page()

    chunks = []
    for name, url in URLS:
        log(f"--- {name} ---")
        page.goto(url, wait_until="domcontentloaded")
        page.wait_for_timeout(14000)

        body = page.inner_text("body")
        if "로그인" in body[:2000] or "Log in" in body[:2000]:
            log("NOT LOGGED IN — 대표님이 직접 로그인하셔야 합니다. 창을 열어둡니다.")
            page.wait_for_timeout(600000)
            sys.exit(2)

        extra = page.evaluate(FIND_SCROLLER)
        log(f"scroll container overflow: {extra}px")

        seen = {body}
        stale = 0
        for i in range(80):
            page.evaluate(SCROLL)
            page.wait_for_timeout(1200)
            t = page.inner_text("body")
            if t in seen:
                stale += 1
                if stale >= 6:
                    log(f"settled after {i} scrolls")
                    break
            else:
                stale = 0
                seen.add(t)

        final = page.inner_text("body")
        chunks.append(f"===== {name} :: {url} =====\n{final}\n")
        page.screenshot(path=f".tmp/meta-{name}-list.png", full_page=False)
        log(f"captured {len(final)} chars, screenshot .tmp/meta-{name}-list.png")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(chunks), encoding="utf-8")
    log(f"wrote {OUT}")

    ctx.close()
