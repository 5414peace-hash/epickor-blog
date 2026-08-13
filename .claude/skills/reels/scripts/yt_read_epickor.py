"""
Switch to the EpicKor channel and read its Shorts list.

YouTube Studio defaults to VDOLAB — the same default-account trap Meta Suite has.
Read-only: navigates, scrolls, screenshots. The only click is the channel switcher,
which changes nothing about the channel itself.

Attaches to the Whale instance already running on 9223 (started by yt_read_whale.py).
"""
import re
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

PORT = 9223
SWITCHER = "https://www.youtube.com/channel_switcher?next=%2F"

FIND_SCROLLER = """
() => {
  let best=null,bestH=0;
  for (const el of document.querySelectorAll('*')) {
    const s=getComputedStyle(el);
    if(!/(auto|scroll)/.test(s.overflowY))continue;
    const x=el.scrollHeight-el.clientHeight;
    if(x>bestH&&el.clientHeight>200){bestH=x;best=el;}
  }
  if(best)best.setAttribute('data-scroller','1');
  return bestH;
}
"""
SCROLL = """
() => { const el=document.querySelector('[data-scroller="1"]');
  if(el){el.scrollTop+=el.clientHeight*0.8;return el.scrollTop;}
  window.scrollBy(0,800);return window.scrollY; }
"""


def log(*a):
    print(*a, flush=True)


with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp(f"http://127.0.0.1:{PORT}")
    ctx = browser.contexts[0]
    page = ctx.pages[0] if ctx.pages else ctx.new_page()

    # 1. Which channels does this account own?
    page.goto(SWITCHER, wait_until="domcontentloaded")
    page.wait_for_timeout(6000)
    txt = page.inner_text("body")
    log("채널 목록:", " | ".join(l for l in txt.split("\n") if l.strip())[:400])
    page.screenshot(path=".tmp/yt-switcher.png")

    # 2. Click the EpicKor entry.
    target = None
    for el in page.locator("a, ytd-account-item-renderer, #contents *").all():
        try:
            if not el.is_visible():
                continue
            t = el.inner_text().strip()
            if t and re.search(r"epickor|에픽코", t, re.I) and len(t) < 120:
                target = el
                break
        except Exception:
            pass
    if target is None:
        log("EpicKor 채널을 스위처에서 못 찾음. 스크린샷 확인 필요: .tmp/yt-switcher.png")
        sys.exit(2)

    log("EpicKor 항목 클릭:", target.inner_text().strip()[:60])
    target.click()
    page.wait_for_timeout(8000)

    # 3. Studio for the now-current channel.
    page.goto("https://studio.youtube.com/", wait_until="domcontentloaded")
    page.wait_for_timeout(9000)
    head = page.inner_text("body")[:300].replace("\n", " | ")
    log("STUDIO HEAD:", head[:220])

    m = re.search(r"/channel/(UC[\w-]+)", page.url) or re.search(r"channel/(UC[\w-]+)", page.content())
    ch = m.group(1) if m else None
    log("channel:", ch)
    if not ch:
        sys.exit(3)

    for view, name in [("videos/short", "shorts"), ("videos/upload", "uploads"), ("posts", "community")]:
        page.goto(f"https://studio.youtube.com/channel/{ch}/{view}", wait_until="domcontentloaded")
        page.wait_for_timeout(9000)
        page.evaluate(FIND_SCROLLER)
        seen, stale = set(), 0
        for _ in range(40):
            page.evaluate(SCROLL)
            page.wait_for_timeout(1100)
            t = page.inner_text("body")
            if t in seen:
                stale += 1
                if stale >= 5:
                    break
            else:
                stale = 0
                seen.add(t)
        out = Path(f".tmp/yt-{name}.txt")
        out.write_text(page.inner_text("body"), encoding="utf-8")
        page.screenshot(path=f".tmp/yt-{name}.png")
        log(f"  {name}: {out} ({len(page.inner_text('body'))} chars)")

    log("완료. 브라우저는 열어둡니다.")
