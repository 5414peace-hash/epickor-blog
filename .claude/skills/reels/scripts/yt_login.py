"""
Step 1 of 2 — open YouTube Studio in a dedicated profile so the representative can sign in.

Google refuses sign-in in a Chrome launched with --remote-debugging-port, so the login
has to happen in a normal launch first. The session cookie persists in the profile, and
step 2 (`yt_read.py`) attaches over CDP to the already-signed-in browser.
Same shape as the GA4 pair recorded in FACTS.md 2026-07-26.

⚠️ --disable-sync is NOT optional. Without it, signing in switches on Chrome Sync and
pulls the representative's entire extension set into this profile, each one opening its
own onboarding tab. That happened once already (18 extensions incl. MetaMask) and the
representative asked for it not to happen again.

The profile is separate from `epickor-meta` so the Meta/Amazon sessions stay untouched.

Claude does not type credentials. The representative signs in themselves.

Usage:
  python .claude/skills/reels/scripts/yt_login.py
  → sign in, confirm the EpicKor channel is selected, then close the window.
"""
import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

PROFILE = r"D:\dev\.browser-profiles\epickor-youtube"
URL = "https://studio.youtube.com/"

with sync_playwright() as p:
    ctx = p.chromium.launch_persistent_context(
        PROFILE,
        channel="chrome",
        headless=False,
        no_viewport=True,
        args=[
            "--start-maximized",
            "--disable-sync",                    # see the warning above
            "--disable-features=ChromeWhatsNewUI",
        ],
    )
    page = ctx.pages[0] if ctx.pages else ctx.new_page()
    page.goto(URL, wait_until="domcontentloaded")
    print("YouTube Studio 창을 열었습니다.", flush=True)
    print("대표님이 직접 로그인하신 뒤, EpicKor 채널이 선택되어 있는지 확인하고 창을 닫아주세요.", flush=True)
    print("(이 스크립트는 아무것도 입력하지 않습니다. 창을 닫으면 종료됩니다.)", flush=True)

    # Hold until the representative closes the window.
    try:
        page.wait_for_event("close", timeout=1_800_000)
    except Exception:
        pass
    print("종료.", flush=True)
