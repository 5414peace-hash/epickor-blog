"""
Screenshot the Emergency Ready App listing as a reference image for Blog 382.

Read-only, headless, throwaway browser context — deliberately NOT the epickor-meta
profile. Nothing here should touch a logged-in session.

The Blog Reference Image Standard asks for the real interface when an article tells
a reader to install something. A stock photo of a phone would fail that test.
"""
import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

URL = ("https://play.google.com/store/apps/details"
       "?id=kr.go.safekorea.emergencyready&hl=en")
OUT = "public/assets/images/posts/382/emergency-ready-app-listing.png"

with sync_playwright() as p:
    b = p.chromium.launch(headless=True)
    page = b.new_page(viewport={"width": 1280, "height": 900}, locale="en-US")
    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_timeout(6000)
    body = page.inner_text("body")[:400]
    print("HEAD:", body.replace("\n", " | ")[:300])
    page.screenshot(path=OUT)
    print("wrote", OUT)
    b.close()
