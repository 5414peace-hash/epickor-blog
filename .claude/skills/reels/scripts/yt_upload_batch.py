"""
Upload and schedule a batch of Shorts to YouTube Studio.

WHY THIS LAUNCHES INSTEAD OF ATTACHING — the trap is already in this repo, in
`schedule-meta-reel.py`: *"Playwright refuses >50MB uploads to a browser it did not
launch."* Attaching over CDP to the running Whale made both Locator and ElementHandle
set_input_files time out at 30s on a 29MB file. Launching Whale through Playwright,
pointed at the representative's existing profile, keeps the Google session (the block
is on *signing in*, not on *being signed in*) and makes uploads work.

⚠️ Whale must be CLOSED before this runs — Chromium refuses a second instance on the
same user-data-dir.

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

WHALE = r"C:\Program Files (x86)\Naver\Naver Whale\Application\whale.exe"
USER_DATA = str(Path.home() / "AppData/Local/Naver/Naver Whale/User Data")
PROFILE_DIR = "Profile 1"

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

    page.locator('input[type="file"]').first.set_input_files(video, timeout=120000)
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

    # Date
    try:
        di = page.locator('input[aria-label*="날짜"], tp-yt-paper-input input').first
        di.click(); page.keyboard.press("Control+A")
        page.keyboard.type(date_ko, delay=25); page.keyboard.press("Enter")
        page.wait_for_timeout(1500)
    except Exception:
        pass

    # Time
    for cand in page.locator("input").all():
        try:
            v = (cand.input_value() or "").strip()
            if re.match(r"^(오전|오후)\s*\d{1,2}:\d{2}$", v):
                cand.click(); page.keyboard.press("Control+A")
                page.keyboard.type(time_ko, delay=25); page.keyboard.press("Enter")
                break
        except Exception:
            pass
    page.wait_for_timeout(1800)
    shot("scheduled")

    # Pre-commit gate
    txt = page.inner_text("body")
    flat = txt.replace(" ", "")
    problems = []
    if title[:26] not in txt:
        problems.append("제목 미확인")
    if f"epickor.com/blog/{slug}" not in txt:
        problems.append("블로그 URL 미확인")
    if date_ko.replace(" ", "") not in flat:
        problems.append(f"날짜 불일치(기대 {date_ko})")
    if time_ko.replace(" ", "") not in flat:
        problems.append(f"시각 불일치(기대 {time_ko})")

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
    ctx = p.chromium.launch_persistent_context(
        USER_DATA,
        executable_path=WHALE,
        headless=False,
        no_viewport=True,
        args=[f"--profile-directory={PROFILE_DIR}", "--disable-sync", "--start-maximized"],
    )
    page = ctx.pages[0] if ctx.pages else ctx.new_page()

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
