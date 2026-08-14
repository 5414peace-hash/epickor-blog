"""
Schedule a batch of card-news carousels to YouTube Community, one per day at 23:00.

Everything here encodes something that cost a session to learn:

 1. BODY FIRST, IMAGES SECOND. Attaching images to an empty composer leaves 게시
    permanently disabled. Typing the body first keeps it enabled throughout.
 2. YouTube renders clock times with U+202F (narrow no-break space), not a normal
    space. `12:00 AM` never matches; `12:00\u202fAM` does. Every text comparison on
    a time in this file uses NBSP explicitly. This single character is why the time
    dropdown looked "unclickable" for an entire session.
 3. Never reuse a coordinate. The page re-renders and scrolls between calls, so
    each element is re-resolved immediately before it is used.
 4. The date and time controls are `tp-yt-paper-button#date-picker` and
    `#time-picker` inside `ytd-date-time-picker-renderer`.
 5. Picking a date can reset the time, so the time is always set AFTER the date.
 6. A gate runs immediately before every commit: button must read 예약, the body
    must be long enough and carry THIS slug's URL, at least 7 thumbnails must be
    attached, and the date/time labels must read back what was asked for. The gate
    has already caught one empty draft that would otherwise have been published.

Usage:
  python .claude/skills/cardnews/scripts/yt_schedule_batch.py --start 2026-08-16
  python .claude/skills/cardnews/scripts/yt_schedule_batch.py --start 2026-08-16 --commit
"""
import argparse
import json
import sys
import time
from datetime import date, timedelta
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

PORT = 9223
POSTS = "https://www.youtube.com/@epickor/posts"
SHOTS = Path(".tmp/yt-community")
NBSP = "\u202f"
TIME_LABEL = f"11:00{NBSP}PM"
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

ORDER = ["171", "218", "312", "257", "220", "192", "259", "184", "288", "242"]


def shot(page, name):
    SHOTS.mkdir(parents=True, exist_ok=True)
    page.screenshot(path=str(SHOTS / f"{name}.png"))


def state(page):
    return page.evaluate("""() => {
      const btns=[...document.querySelectorAll('button')];
      const b=btns.find(x=>{const t=(x.textContent||'').trim();
        return (t==='예약'||t==='게시') && x.getBoundingClientRect().width>0;});
      const ed=document.querySelector('#contenteditable-root');
      const th=[...document.querySelectorAll('img')].filter(i=>{
        const r=i.getBoundingClientRect(); return r.width>60 && r.width<200 && r.height>60;});
      const t=document.querySelector('#time-label-text');
      const d=document.querySelector('#date-picker');
      return {label:b?b.textContent.trim():null, disabled:b?b.disabled:null,
              text:ed?(ed.innerText||'').trim():'', thumbs:th.length,
              time:t?t.textContent.trim():null, date:d?d.textContent.trim():null};
    }""")


def visible(page, sel):
    loc = page.locator(sel)
    for i in range(loc.count()):
        bb = loc.nth(i).bounding_box()
        if bb and bb["width"] > 0 and bb["height"] > 0:
            return loc.nth(i)
    return None


def compose(page, body, cards):
    page.goto(POSTS, wait_until="domcontentloaded")
    time.sleep(5)
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
            page.keyboard.type(line, delay=2)
    time.sleep(2)

    btn = visible(page, "button[aria-label='이미지 추가']")
    btn.scroll_into_view_if_needed()
    time.sleep(1)
    try:
        with page.expect_file_chooser(timeout=12000) as fc:
            btn.click()
        fc.value.set_files(cards)
    except Exception:
        page.locator("input[type='file']").first.set_input_files(cards)
    time.sleep(9)


def open_scheduler(page):
    page.evaluate("""() => {
      const btns=[...document.querySelectorAll('button')];
      const post=btns.find(b=>(b.getAttribute('aria-label')||'')==='게시' && b.getBoundingClientRect().width>0);
      const c=btns.find(b=>(b.getAttribute('aria-label')||'')==='작업 메뉴'
        && Math.abs(b.getBoundingClientRect().y-post.getBoundingClientRect().y)<10
        && b.getBoundingClientRect().x>post.getBoundingClientRect().x);
      c.setAttribute('data-epk','caret');
    }""")
    page.locator("button[data-epk='caret']").click()
    time.sleep(2)
    page.get_by_text("게시물 예약", exact=True).first.click()
    time.sleep(3)


def set_date(page, d: date):
    """Open the calendar and click the day cell, scoped to the right month block."""
    page.locator("tp-yt-paper-button#date-picker").first.click()
    time.sleep(2)
    ok = page.evaluate(
        """({day, header}) => {
          const all=[...document.querySelectorAll('*')].filter(e=>e.children.length===0
            && e.getBoundingClientRect().width>0);
          const head=all.find(e=>(e.textContent||'').trim().toUpperCase()===header);
          if(!head) return 'no-month-header';
          const hy=head.getBoundingClientRect().y;
          // Day cells belonging to this month sit BELOW its header and above the next
          // month's; without that scope, September's 1-5 can shadow August's.
          const next=all.filter(e=>/^[A-Z]{3} \\d{4}$/.test((e.textContent||'').trim().toUpperCase())
            && e.getBoundingClientRect().y>hy).sort((a,b)=>a.getBoundingClientRect().y-b.getBoundingClientRect().y)[0];
          const ny = next ? next.getBoundingClientRect().y : 1e9;
          const cell=all.find(e=>{const t=(e.textContent||'').trim(); const r=e.getBoundingClientRect();
            return t===String(day) && r.width>8 && r.width<70 && r.y>hy && r.y<ny;});
          if(!cell) return 'no-cell';
          cell.scrollIntoView({block:'center'});
          cell.setAttribute('data-epk','day');
          return 'ok';
        }""",
        {"day": d.day, "header": f"{MONTHS[d.month - 1].upper()} {d.year}"},
    )
    if ok != "ok":
        raise RuntimeError(f"date {d}: {ok}")
    page.locator("[data-epk='day']").first.click()
    time.sleep(2.5)


def set_time(page):
    page.locator("tp-yt-paper-button#time-picker").first.click()
    time.sleep(2)
    found = page.evaluate(
        """(t) => {
          const el=[...document.querySelectorAll('tp-yt-paper-item,[role=option],li')]
            .find(e=>(e.textContent||'').trim()===t && e.getBoundingClientRect().width>0);
          if(!el) return false;
          el.scrollIntoView({block:'center'}); el.setAttribute('data-epk','time'); return true;
        }""",
        TIME_LABEL,
    )
    if not found:
        raise RuntimeError("11:00 PM option not found")
    page.locator("[data-epk='time']").first.click()
    time.sleep(2)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--start", required=True, help="YYYY-MM-DD of the first 23:00 slot")
    ap.add_argument("--commit", action="store_true")
    ap.add_argument("--only", help="comma-separated slugs, for retries")
    args = ap.parse_args()

    bodies = json.loads(Path(".tmp/yt-bodies.json").read_text(encoding="utf-8"))
    y, m, d = (int(x) for x in args.start.split("-"))
    start = date(y, m, d)
    slugs = args.only.split(",") if args.only else ORDER

    results = []
    with sync_playwright() as pw:
        browser = pw.chromium.connect_over_cdp(f"http://127.0.0.1:{PORT}", timeout=8000)
        page = [p for p in browser.contexts[0].pages if "youtube.com" in p.url][0]
        page.bring_to_front()

        for i, slug in enumerate(slugs):
            when = start + timedelta(days=ORDER.index(slug) if args.only else i)
            info = bodies[slug]
            cards = [str(p) for p in sorted(Path(f"public/assets/cardnews/{info['dir']}").glob("card_0*.png"))]
            label = f"{slug} -> {when} 23:00"
            print(f"\n== {label}  ({len(cards)} cards)")
            try:
                compose(page, info["body"], cards)
                open_scheduler(page)
                set_date(page, when)
                set_time(page)

                st = state(page)
                want_date = f"{MONTHS[when.month-1]} {when.day}, {when.year}"
                gate = (
                    st["label"] == "예약" and not st["disabled"]
                    and len(st["text"]) > 200
                    and f"/blog/{slug}" in st["text"]
                    and st["thumbs"] >= 7
                    and st["time"] == TIME_LABEL
                    and st["date"] == want_date
                )
                print(f"   gate: label={st['label']} thumbs={st['thumbs']} "
                      f"date={st['date']!r} want={want_date!r} time={st['time']!r} -> {gate}")
                if not gate:
                    shot(page, f"batch-fail-{slug}")
                    results.append((slug, str(when), "GATE FAIL"))
                    continue
                if not args.commit:
                    results.append((slug, str(when), "dry (not committed)"))
                    continue
                page.evaluate("""() => {const b=[...document.querySelectorAll('button')]
                    .find(x=>(x.textContent||'').trim()==='예약' && x.getBoundingClientRect().width>0);
                    b.setAttribute('data-epk','go');}""")
                page.locator("[data-epk='go']").first.click()
                time.sleep(7)
                results.append((slug, str(when), "scheduled"))
            except Exception as e:
                shot(page, f"batch-error-{slug}")
                results.append((slug, str(when), f"ERROR {str(e)[:70]}"))

    print("\n===== 결과 =====")
    for s, w, r in results:
        print(f"  {s}  {w} 23:00  {r}")


if __name__ == "__main__":
    main()
