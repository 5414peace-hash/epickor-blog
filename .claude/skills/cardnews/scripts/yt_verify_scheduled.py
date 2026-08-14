"""
Read back the YouTube Community 예약됨 tab and print every scheduled post.

Written as a file rather than an inline -c because the list-parsing JS needs real
newlines and Korean literals, and both get mangled by shell escaping.

The list lazy-loads inside its own scroll container, so it is scrolled repeatedly
before reading — a single read reports only the first few rows, which is exactly
the failure that once made a full schedule look half-empty.
"""
import sys
import time

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

JS = """
() => {
  const posts = [...document.querySelectorAll('ytd-backstage-post-thread-renderer')];
  return posts.map(p => {
    const lines = (p.innerText || '').split('\\n').map(s => s.trim()).filter(Boolean);
    const when = lines.find(s => s.includes('예정')) || '(시각 없음)';
    const head = lines.find(s => s.length > 25 && !s.includes('예정')) || '';
    const imgs = p.querySelectorAll('img').length;
    return { when, head: head.slice(0, 44), imgs };
  });
}
"""


def main():
    with sync_playwright() as pw:
        browser = pw.chromium.connect_over_cdp("http://127.0.0.1:9223", timeout=8000)
        page = [p for p in browser.contexts[0].pages if "youtube.com" in p.url][0]
        page.bring_to_front()
        page.goto("https://www.youtube.com/@epickor/posts", wait_until="domcontentloaded")
        time.sleep(5)
        page.get_by_text("예약됨", exact=True).first.click()
        time.sleep(5)
        for _ in range(10):
            page.mouse.wheel(0, 1400)
            time.sleep(1.1)
        rows = page.evaluate(JS)
        print(f"예약됨 항목: {len(rows)}건\n")
        for r in rows:
            print(f"  {r['when']:<34} | img {r['imgs']:>2} | {r['head']}")


if __name__ == "__main__":
    main()
