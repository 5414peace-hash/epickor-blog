"""
Read YouTube Studio's content list through Naver Whale.

WHY WHALE. 2026-08-14: Google refused sign-in in the Playwright-launched Chrome
(dedicated profile `epickor-youtube`), which is the failure mode FACTS.md already
records for GA4. The representative signed in with Whale instead. Whale is
Chromium, so CDP works the same way.

⚠️ THIS USES THE REPRESENTATIVE'S REAL BROWSER PROFILE (`Profile 1`), not a
throwaway. Detected by cookie mtime: Default was last written in 2022, Profile 1
minutes ago. That means everything they are signed into is reachable from this
session. So:
  - READ ONLY. Navigate, scroll, screenshot, print. Click nothing that changes state.
  - Touch only studio.youtube.com. Do not enumerate or read other tabs.
  - Leave the browser open at the end so they are not interrupted twice.

Chromium refuses a second instance on the same user-data-dir, so Whale must be
CLOSED before this runs. It is relaunched here with the debug port; the session
persists because it is the same profile on disk.

Usage:
  1. 대표님이 웨일을 완전히 종료
  2. python .claude/skills/reels/scripts/yt_read_whale.py
"""
import re
import subprocess
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

WHALE = r"C:\Program Files (x86)\Naver\Naver Whale\Application\whale.exe"
USER_DATA = str(Path.home() / "AppData/Local/Naver/Naver Whale/User Data")
PROFILE_DIR = "Profile 1"
PORT = 9223
STUDIO = "https://studio.youtube.com/"
OUT = Path(".tmp/youtube-content-dump.txt")

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
  if (el) { el.scrollTop += el.clientHeight * 0.8; return el.scrollTop; }
  window.scrollBy(0, 800); return window.scrollY;
}
"""


def log(*a):
    print(*a, flush=True)


proc = subprocess.Popen([
    WHALE,
    f"--remote-debugging-port={PORT}",
    f"--user-data-dir={USER_DATA}",
    f"--profile-directory={PROFILE_DIR}",
    "--disable-sync",
    STUDIO,
])
log(f"웨일을 디버그 포트 {PORT}로 재실행했습니다. 연결 대기…")
time.sleep(12)

with sync_playwright() as p:
    for attempt in range(6):
        try:
            browser = p.chromium.connect_over_cdp(f"http://127.0.0.1:{PORT}")
            break
        except Exception as e:
            log(f"  재시도 {attempt+1}/6 ({e.__class__.__name__})")
            time.sleep(5)
    else:
        log("CDP 연결 실패. 웨일이 완전히 종료된 상태였는지 확인해 주세요.")
        sys.exit(2)

    ctx = browser.contexts[0]
    page = None
    for pg in ctx.pages:
        if "youtube.com" in (pg.url or ""):
            page = pg
            break
    if page is None:
        page = ctx.new_page()
    page.goto(STUDIO, wait_until="domcontentloaded")
    page.wait_for_timeout(10000)

    body = page.inner_text("body")[:600]
    log("HEAD:", body.replace("\n", " | ")[:220])
    if "로그인" in body or "Sign in" in body:
        log("로그인 상태가 아닙니다. 웨일에서 먼저 로그인해 주세요.")
        sys.exit(3)

    # Channel content list, sorted by newest.
    m = re.search(r"/channel/(UC[\w-]+)", page.url) or re.search(r"/channel/(UC[\w-]+)", page.content())
    channel = m.group(1) if m else None
    log("channel:", channel)

    target = f"https://studio.youtube.com/channel/{channel}/videos/short" if channel else None
    if target:
        page.goto(target, wait_until="domcontentloaded")
        page.wait_for_timeout(9000)

    page.evaluate(FIND_SCROLLER)
    seen = set()
    stale = 0
    for _ in range(40):
        page.evaluate(SCROLL)
        page.wait_for_timeout(1200)
        t = page.inner_text("body")
        if t in seen:
            stale += 1
            if stale >= 5:
                break
        else:
            stale = 0
            seen.add(t)

    final = page.inner_text("body")
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(final, encoding="utf-8")
    page.screenshot(path=".tmp/youtube-content-list.png")
    log(f"저장: {OUT} ({len(final)} chars), 스크린샷 .tmp/youtube-content-list.png")
    log("브라우저는 열어둡니다. 계속 쓰셔도 됩니다.")
