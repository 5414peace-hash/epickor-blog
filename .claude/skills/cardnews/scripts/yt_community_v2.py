"""
Compose a YouTube Community carousel post — second attempt, clean order.

What went wrong the first time: the cards were pushed straight into the hidden
<input type=file>, which did attach them but left the composer in an image-editing
state where 게시 stayed permanently disabled. The fix is to drive the visible
control the way a person does — type the body first, then click 이미지 and answer
the file chooser — and to verify the thumbnail count from the DOM before touching
anything else.

Scheduling is behind the ∨ next to 게시 (representative-confirmed).

Stages are explicit so a failure stops at a known point instead of cascading:
  --stage reset     reload the tab, clear any half-built draft
  --stage body      type the post text
  --stage images    attach the cards and verify the count
  --stage schedule  open the ∨ menu and read it
Nothing publishes without --commit.
"""
import argparse
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

PORT = 9223
SHOTS = Path(".tmp/yt-community")
POSTS = "https://www.youtube.com/@epickor/posts"

BODIES = {
  "313": (
    "Seoul with kids is easier than most parents expect. The hard parts are just never "
    "the ones you planned for.\n"
    "\n"
    "Nobody worries about safety at 9pm. Everybody underestimates how many subway exits "
    "are stairs only.\n"
    "\n"
    "What actually matters:\n"
    "• Check the elevator exit before you arrive, not after.\n"
    "• Kid-size hanbok gets you into the palaces free.\n"
    "• Children's museums let kids touch things — book timed entry.\n"
    "• Hangang is the free option that works at every age.\n"
    "• Gimbap, mandu, bulgogi and japchae are all mild.\n"
    "\n"
    "The one rule that saves the trip: one big thing per day. Three-attraction days end "
    "in tears.\n"
    "\n"
    "Full 3-day family itinerary:\n"
    "https://www.epickor.com/blog/313"
  ),
}
CARD_DIRS = {"313": "public/assets/cardnews/2026-07-20_313"}

BODY = (
    "Tteokbokki isn't one dish.\n"
    "\n"
    "Six versions share the same chewy rice cake — and ordering the right one is the "
    "difference between \"why is this so hot\" and \"why didn't anyone tell me sooner.\"\n"
    "\n"
    "The six styles Koreans actually order:\n"
    "• Classic gochujang — the default. Order twigim with it.\n"
    "• Cheese — easy mode if you're spice-shy.\n"
    "• Rabokki — add ramyeon, now it's dinner.\n"
    "• Rosé, jjajang, and the non-spicy royal-court original.\n"
    "\n"
    "Start at a market stall. Cheapest portion, best first taste.\n"
    "\n"
    "Full guide with spice levels and how to order:\n"
    "https://www.epickor.com/blog/311"
)
CARDS = sorted(Path("public/assets/cardnews/2026-07-20_311").glob("card_0*.png"))


def pick(slug):
    """Body text and card folder for a slug, falling back to 311's."""
    if slug in BODIES:
        return BODIES[slug], sorted(Path(CARD_DIRS[slug]).glob("card_0*.png"))
    return BODY, CARDS


def shot(page, name):
    SHOTS.mkdir(parents=True, exist_ok=True)
    page.screenshot(path=str(SHOTS / f"{name}.png"))
    print(f"  [shot] .tmp/yt-community/{name}.png")


def visible(page, selector):
    """First element matching `selector` that is actually laid out.

    Coordinates on this page go stale between calls because YouTube re-renders and
    scrolls under us; every previous mis-click came from reusing a remembered y.
    Always re-resolve immediately before acting.
    """
    loc = page.locator(selector)
    for i in range(loc.count()):
        bb = loc.nth(i).bounding_box()
        if bb and bb["width"] > 0 and bb["height"] > 0:
            return loc.nth(i)
    return None


def composer_state(page):
    return page.evaluate("""() => {
      const btns = [...document.querySelectorAll('button')];
      const post = btns.find(b => (b.getAttribute('aria-label')||'')==='게시'
                                  && b.getBoundingClientRect().width>0);
      const caret = btns.find(b => (b.getAttribute('aria-label')||'')==='작업 메뉴'
                                   && post && Math.abs(b.getBoundingClientRect().y-post.getBoundingClientRect().y)<10
                                   && b.getBoundingClientRect().x > post.getBoundingClientRect().x);
      const ed = document.querySelector('#contenteditable-root');
      const thumbs = [...document.querySelectorAll('img')].filter(i => {
        const r = i.getBoundingClientRect();
        return r.width > 60 && r.width < 200 && r.height > 60;
      });
      return {
        postFound: !!post, postDisabled: post ? post.disabled : null,
        caretFound: !!caret, caretDisabled: caret ? caret.disabled : null,
        textLen: ed ? (ed.innerText||'').trim().length : -1,
        thumbCount: thumbs.length,
      };
    }""")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--stage", required=True,
                    choices=["reset", "body", "images", "schedule", "state"])
    ap.add_argument("--slug", default="311")
    ap.add_argument("--commit", action="store_true")
    args = ap.parse_args()

    with sync_playwright() as pw:
        browser = pw.chromium.connect_over_cdp(f"http://127.0.0.1:{PORT}", timeout=8000)
        page = [p for p in browser.contexts[0].pages if "youtube.com" in p.url][0]
        page.bring_to_front()
        body, cards = pick(args.slug)

        if args.stage == "reset":
            page.goto(POSTS, wait_until="domcontentloaded")
            time.sleep(5)
            shot(page, "v2-01-reset")
            print(f"  {composer_state(page)}")

        elif args.stage == "body":
            box = visible(page, "#placeholder-area") or visible(page, "#contenteditable-root")
            box.scroll_into_view_if_needed()
            box.click()
            time.sleep(2)
            ed = visible(page, "#contenteditable-root")
            ed.click()
            for i, line in enumerate(body.split("\n")):
                if i:
                    page.keyboard.press("Shift+Enter")
                if line:
                    page.keyboard.type(line, delay=3)
            time.sleep(2)
            shot(page, "v2-02-body")
            print(f"  {composer_state(page)}")

        elif args.stage == "images":
            btn = visible(page, "button[aria-label='이미지 추가']")
            if btn is None:
                raise RuntimeError("no laid-out '이미지 추가' button")
            btn.scroll_into_view_if_needed()
            time.sleep(1)
            try:
                with page.expect_file_chooser(timeout=15000) as fc:
                    btn.click()
                fc.value.set_files([str(c) for c in cards])
                print("  attached via file chooser")
            except Exception as e:
                print(f"  chooser path failed ({str(e)[:60]}), using hidden input")
                inp = page.locator("input[type='file']").first
                inp.set_input_files([str(c) for c in cards])
            time.sleep(10)
            shot(page, "v2-03-images")
            print(f"  {composer_state(page)}")

        elif args.stage == "schedule":
            st = composer_state(page)
            print(f"  before: {st}")
            if not st["caretFound"]:
                raise RuntimeError("caret next to 게시 not found")
            page.evaluate("""() => {
              const btns=[...document.querySelectorAll('button')];
              const post=btns.find(b=>(b.getAttribute('aria-label')||'')==='게시'&&b.getBoundingClientRect().width>0);
              const c=btns.find(b=>(b.getAttribute('aria-label')||'')==='작업 메뉴'
                && Math.abs(b.getBoundingClientRect().y-post.getBoundingClientRect().y)<10
                && b.getBoundingClientRect().x>post.getBoundingClientRect().x);
              c.setAttribute('data-epk','caret');
            }""")
            page.locator("button[data-epk='caret']").click()
            time.sleep(2.5)
            shot(page, "v2-04-menu")
            items = page.evaluate("""() => [...document.querySelectorAll(
              'tp-yt-paper-item,[role=menuitem],yt-list-item-view-model,ytd-menu-service-item-renderer')]
              .map(e=>(e.textContent||'').trim()).filter(t=>t&&t.length<30)""")
            print(f"  menu: {items[:10]}")

        elif args.stage == "state":
            shot(page, "v2-state")
            print(f"  {composer_state(page)}")


if __name__ == "__main__":
    main()
