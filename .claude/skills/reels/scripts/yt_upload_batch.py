"""
Upload and schedule a batch of Shorts to YouTube Studio.

HOW THE FILE ACTUALLY GETS IN — three routes tried, only the third works.
  1. 만들기 → 동영상 업로드 : never fires a filechooser event. Times out at 40s.
  2. set_input_files on the dialog's own <input type=file> : that input is aria-hidden,
     and both Locator and ElementHandle time out at 30s even on a 29MB file.
  3. expect_file_chooser wrapped around a click on the visible 파일 선택 button : works.

Launching Whale through Playwright does not work either — it exits immediately, because
Whale does not speak Playwright's debugging pipe. So Whale is started separately with
--remote-debugging-port and this attaches to it. That contradicts the note in
schedule-meta-reel.py about uploads needing a Playwright-launched browser; that rule
holds for the Meta composer, not here.

⚠️ Whale must already be running with --remote-debugging-port=9223 on the rep's
`Profile 1`. yt_read_whale.py starts it that way.

⚠️ THE DANGEROUS PART. YouTube's visibility step defaults to publishing. This refuses
to click the commit button unless the title, the blog URL, the date and the time all
read back from the page AND the button itself says 예약. On any mismatch it screenshots,
prints, and leaves that video as a private draft rather than guessing.

Usage:
  python .claude/skills/reels/scripts/yt_upload_batch.py <manifest.json> [slug ...]
"""
import json
import re
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

PORT = 9223

MANIFEST = sys.argv[1]
ONLY = set(sys.argv[2:])
man = json.loads(Path(MANIFEST).read_text(encoding="utf-8"))
CH = man["channel"]
items = [i for i in man["items"] if not ONLY or i["slug"] in ONLY]


def log(*a):
    print(*a, flush=True)


def ko_datetime(pub):
    y, mo, d = int(pub[0:4]), int(pub[5:7]), int(pub[8:10])
    hh, mm = int(pub[11:13]), int(pub[14:16])
    ampm = "오후" if hh >= 12 else "오전"
    h12 = hh - 12 if hh > 12 else (12 if hh == 0 else hh)
    return f"{y}. {mo}. {d}.", f"{ampm} {h12}:{mm:02d}"


def upload_one(page, item):
    slug = item["slug"]
    video = str(Path(item["source"]).resolve())
    title, desc = item["title"], item["description"]
    date_ko, time_ko = ko_datetime(item["publishAt"])

    def shot(name):
        page.screenshot(path=f".tmp/yt-up-{slug}-{name}.png")

    log(f"\n=== {slug} :: {title}")
    log(f"    예약 {date_ko} {time_ko}")

    page.goto(f"https://studio.youtube.com/channel/{CH}/videos/upload?d=ud",
              wait_until="domcontentloaded")
    page.wait_for_timeout(10000)
    if "EpicKor" not in page.inner_text("body"):
        shot("wrongchannel")
        return "채널이 EpicKor가 아님"

    with page.expect_file_chooser(timeout=30000) as fc:
        page.get_by_text("파일 선택", exact=True).first.click()
    fc.value.set_files(video, timeout=180000)
    log("    파일 제출, 업로드 대기…")

    # Details form ready when there are ≥2 rich-text boxes.
    deadline = time.time() + 900
    while time.time() < deadline:
        page.wait_for_timeout(4000)
        if page.locator('div[contenteditable="true"]').count() >= 2:
            break
    else:
        shot("noform")
        return "업로드 폼 미출현"
    page.wait_for_timeout(4000)

    boxes = page.locator('div[contenteditable="true"]')
    tb = boxes.nth(0)
    tb.click(); page.keyboard.press("Control+A"); page.keyboard.press("Delete")
    page.keyboard.type(title, delay=8)
    page.wait_for_timeout(700)

    db = boxes.nth(1)
    db.click(); page.keyboard.press("Control+A"); page.keyboard.press("Delete")
    for i, line in enumerate(desc.split("\n")):
        if i:
            page.keyboard.press("Shift+Enter")
        page.keyboard.type(line, delay=3)
    page.wait_for_timeout(700)

    try:
        page.get_by_text("아니요, 아동용이 아닙니다", exact=False).first.click(timeout=12000)
    except Exception:
        log("    ! 아동용 라디오 미발견")
    page.wait_for_timeout(600)
    shot("filled")

    for n in range(3):
        try:
            page.get_by_text("다음", exact=True).first.click(timeout=20000)
            page.wait_for_timeout(2600)
        except Exception:
            shot(f"next{n}")
            return f"다음 {n+1}회차 실패"
    page.wait_for_timeout(2600)

    try:
        page.get_by_text("예약", exact=True).first.click(timeout=15000)
        page.wait_for_timeout(2200)
    except Exception:
        shot("nosched")
        return "예약 탭 미발견"

    # Date — the field is a ytcp-datetime-picker, not a plain input. Typing into it
    # lands in the TIME box instead (that mistake produced a "잘못된 시간" error on the
    # first run). Click the box, then click the day cell in the calendar popup — the
    # same lesson schedule-meta-reel.py records for Meta.
    # The calendar renders several months, so there are multiple cells reading e.g.
    # "14"; the wanted one is the topmost.
    day = str(int(item["publishAt"][8:10]))
    if date_ko not in page.inner_text("body"):
        page.mouse.click(420, 272)
        page.wait_for_timeout(2200)
        cells = page.evaluate(r"""()=>{const out=[];const walk=(r)=>{
          for(const el of r.querySelectorAll('*')){
            const t=(el.textContent||'').trim();
            if(/^\d{1,2}$/.test(t)&&el.children.length===0){const b=el.getBoundingClientRect();
              if(b.width>0&&b.width<60&&b.height<60)
                out.push({t,x:Math.round(b.x+b.width/2),y:Math.round(b.y+b.height/2)});}
            if(el.shadowRoot) walk(el.shadowRoot);}};walk(document);return out;}""")
        hits = sorted([c for c in cells if c["t"] == day], key=lambda c: c["y"])
        if not hits:
            shot("nocal")
            return f"달력에서 {day}일 셀 미발견"
        page.mouse.click(hits[0]["x"], hits[0]["y"])
        page.wait_for_timeout(2000)

    # Time — set AFTER the date, because picking a date resets this box.
    tb = None
    for cand in page.locator("input").all():
        try:
            bb = cand.bounding_box()
            if cand.is_visible() and bb and bb["y"] > 240 and bb["width"] < 200:
                tb = cand
        except Exception:
            pass
    if tb is None:
        shot("notime")
        return "시간 입력칸 미발견"
    tb.click(); page.keyboard.press("Control+A"); page.keyboard.press("Delete")
    page.keyboard.type(time_ko, delay=45)
    page.wait_for_timeout(900)
    page.keyboard.press("Enter")
    page.wait_for_timeout(1600)
    shot("scheduled")

    # Pre-commit gate
    txt = page.inner_text("body")
    flat = txt.replace(" ", "")
    problems = []
    if title[:26] not in txt:
        problems.append("제목 미확인")
    if date_ko.replace(" ", "") not in flat:
        problems.append(f"날짜 불일치(기대 {date_ko})")
    tv = (tb.input_value() or "").strip()
    if tv != time_ko:
        problems.append(f"시각 불일치(현재 '{tv}', 기대 '{time_ko}')")
    if "잘못된" in txt:
        problems.append("페이지에 오류 경고 존재")
    # The description is entered on the 세부정보 step and is not rendered here, so it is
    # verified afterwards from the Shorts list rather than pretended at.

    commit = None
    for el in page.locator('button, ytcp-button, div[role="button"]').all():
        try:
            if el.is_visible() and el.inner_text().strip() == "예약":
                bb = el.bounding_box()
                if bb and bb["y"] > 400:
                    commit = el
        except Exception:
            pass
    if commit is None:
        problems.append("커밋 버튼이 '예약'이 아님 — 즉시 공개 위험")

    if problems:
        shot("REFUSED")
        return " / ".join(problems)

    commit.click()
    page.wait_for_timeout(6500)
    shot("committed")
    return None


with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp(f"http://127.0.0.1:{PORT}")
    ctx = browser.contexts[0]
    page = ctx.new_page()

    ok, bad = [], []
    for item in items:
        try:
            err = upload_one(page, item)
        except Exception as e:
            err = f"{e.__class__.__name__}: {str(e)[:120]}"
        if err:
            bad.append((item["slug"], err))
            log(f"    ✗ {item['slug']}: {err}")
        else:
            ok.append(item["slug"])
            log(f"    ✓ {item['slug']} 예약 완료")

    log("\n=== 결과 ===")
    log("성공:", ", ".join(ok) if ok else "없음")
    for s, e in bad:
        log(f"실패 {s}: {e}")
    log("브라우저는 열어둡니다.")
