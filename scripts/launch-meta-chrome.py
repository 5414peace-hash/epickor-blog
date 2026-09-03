r"""Hold system Chrome open on the EpicKor Meta Business Suite profile.

Run this first; every other Meta script connects to it over CDP at
http://localhost:9222 rather than launching its own browser.

Why it is tracked here rather than in .tmp/ (2026-09-03):
  `.tmp/` is gitignored, so this launcher and the calendar reader beside it
  were being rewritten from scratch every few sessions while the scheduler,
  which happens to be tracked, survived untouched. Shared by cardnews and
  reels, hence `scripts/` rather than one skill's folder.

  python scripts/launch-meta-chrome.py     # leave running in the background

Profile: D:\dev\.browser-profiles\epickor-meta — a FIXED path on purpose.
It used to live in the session scratchpad, whose path changes every session,
so the login was lost every time (fixed 2026-08-09).

  * **대표님이 직접 로그인하신다. Claude는 자격증명을 입력하지 않는다.**
  * **--disable-sync is not optional.** 2026-07-26: signing into Google in a
    throwaway profile without it turned on Chrome Sync and pulled the
    representative's 18 extensions (MetaMask, Glasp, Thunderbit) into a temp
    profile, with windows appearing unprompted on their machine.
  * **Closing the last page terminates Chrome.** Other scripts must open and
    close their own tabs and never touch this holder tab; the loop below
    re-creates it if something closes it anyway.
"""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace", line_buffering=True)

PROFILE = Path(r"D:\dev\.browser-profiles\epickor-meta")
HOME = "https://business.facebook.com/latest/home"
PROFILE.mkdir(parents=True, exist_ok=True)

with sync_playwright() as p:
    ctx = p.chromium.launch_persistent_context(
        user_data_dir=str(PROFILE),
        channel="chrome",
        headless=False,
        viewport={"width": 1280, "height": 720},
        args=["--remote-debugging-port=9222", "--start-maximized",
              "--no-first-run", "--no-default-browser-check", "--disable-sync"],
    )
    page = ctx.pages[0] if ctx.pages else ctx.new_page()
    page.goto(HOME, wait_until="domcontentloaded")
    print(f"LAUNCHED profile={PROFILE}")
    print("CDP endpoint: http://localhost:9222")
    while True:
        try:
            if not ctx.pages:
                ctx.new_page().goto(HOME, wait_until="domcontentloaded")
            ctx.pages[0].wait_for_timeout(30000)
        except Exception:
            try:
                ctx.new_page()
            except Exception as e:
                print("context gone:", e)
                break
