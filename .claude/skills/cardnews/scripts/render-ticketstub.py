#!/usr/bin/env python3
"""
render-ticketstub.py — the TICKET STUB visual system.

Built for the Chuseok 2026 train-booking carousel (slug 200), where the content
is a date-to-route mapping and the emotional hook is turning up on the wrong
morning. A ticket is the object the whole topic is about, so the card is shaped
like one: a cream stub with a punched edge sitting on the photograph, the date
set in the largest type on the card, and the route printed underneath it.

Why this is not one of the existing 23 systems: `station-sign` and
`transit-signal` are signage, `shelf-tag` and `rx-label` are retail and pharmacy
labels. None of them puts a date in the hero position, which is the one thing a
reader of this carousel needs to leave with.

Veil note (CLAUDE.md 2026-07-20): the house default of rgba(17,17,17,0.24→0.92)
buries a photograph. Every card here declares its own `image_opacity` in the
0.55–0.62 band, and the veil is a soft bottom-weighted gradient rather than a
flat wash, so the trains stay legible while the stub keeps its contrast.

Usage: python .claude/skills/cardnews/scripts/render-ticketstub.py --slug 200
"""
import argparse
import base64
import html
import re
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[4]
SIZE = 1080


def parse_script(path: Path):
    text = path.read_text(encoding="utf-8")
    fm = {}
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                fm[k.strip()] = v.strip().strip('"')
        text = text[m.end():]

    cards = []
    for block in re.split(r"\n---\n", text):
        if "## Card" not in block:
            continue
        card = {"number": re.search(r"## Card\s*(\d+)", block).group(1)}
        for key in ("mode", "kicker", "image", "fit", "image_position",
                    "image_opacity", "image_label", "name_ko", "name_en",
                    "ticket_date", "ticket_time"):
            mm = re.search(rf"^{key}:\s*(.+)$", block, re.M)
            if mm:
                card[key] = mm.group(1).strip()
        for key, label in (("main", "Main"), ("sub", "Sub")):
            mm = re.search(rf"\*\*{label}:\*\*\s*(.+?)(?=\n\*\*|\n##|\Z)", block, re.S)
            if mm:
                card[key] = mm.group(1).strip()
        cards.append(card)
    return fm, cards


def data_uri(p: Path) -> str:
    return "data:image/jpeg;base64," + base64.b64encode(p.read_bytes()).decode()


def build_html(card, folder: Path) -> str:
    mode = card.get("mode", "photo")
    opacity = float(card.get("image_opacity", "0.58"))
    pos = card.get("image_position", "center 50%")
    img = data_uri(folder / card["image"])
    main = html.escape(card.get("main", "")).replace("\\n", "<br>")
    sub = html.escape(card.get("sub", ""))
    kicker = html.escape(card.get("kicker", ""))
    date = html.escape(card.get("ticket_date", ""))
    time = html.escape(card.get("ticket_time", ""))
    name_ko = html.escape(card.get("name_ko", ""))
    name_en = html.escape(card.get("name_en", ""))

    # The stub. Cards that carry a date get the date block; the rest get a
    # wider text stub so the cover and outro do not look like empty tickets.
    if mode == "ticket" and date:
        stub_head = f"""
          <div class="dateline">
            <div class="date">{date}</div>
            <div class="time">{time}</div>
          </div>
          <div class="perf"></div>"""
    else:
        stub_head = ""

    subject = ""
    if name_ko or name_en:
        subject = f'<div class="subject"><span class="ko">{name_ko}</span><span class="en">{name_en}</span></div>'

    cover = "cover" if mode == "cover" else ""

    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
      *{{margin:0;padding:0;box-sizing:border-box}}
      body{{width:{SIZE}px;height:{SIZE}px;overflow:hidden;position:relative;
           font-family:"Malgun Gothic","Segoe UI",system-ui,sans-serif;background:#0d0d0f}}
      .bg{{position:absolute;inset:0;background-image:url('{img}');
          background-size:cover;background-position:{pos};opacity:{opacity}}}
      .veil{{position:absolute;inset:0;background:
            linear-gradient(180deg,rgba(10,10,12,.62) 0%,rgba(10,10,12,.10) 34%,rgba(10,10,12,.46) 68%,rgba(10,10,12,.88) 100%)}}
      .wm{{position:absolute;top:38px;left:44px;font-size:19px;font-weight:800;
          letter-spacing:.20em;color:rgba(255,255,255,.92);text-shadow:0 1px 6px rgba(0,0,0,.6)}}
      .kick{{position:absolute;top:38px;right:44px;font-size:17px;font-weight:800;
            letter-spacing:.13em;color:#fff;background:#c8102e;padding:9px 15px;border-radius:5px;
            max-width:640px;text-align:right}}
      .stub{{position:absolute;left:52px;right:52px;bottom:{"210px" if cover else "52px"};background:#f7f4ec;
            border-radius:12px;padding:{"40px 42px 38px" if cover else "34px 40px 34px"};
            box-shadow:0 22px 60px rgba(0,0,0,.55)}}
      .stub::before,.stub::after{{content:"";position:absolute;top:50%;width:26px;height:26px;
            background:#0d0d0f;border-radius:50%;transform:translateY(-50%)}}
      .stub::before{{left:-13px}} .stub::after{{right:-13px}}
      .dateline{{display:flex;align-items:baseline;gap:20px}}
      .date{{font-size:76px;font-weight:800;letter-spacing:-.03em;color:#0d0d0f;line-height:.95;
            font-variant-numeric:tabular-nums}}
      .time{{font-size:26px;font-weight:700;color:#8a8378;letter-spacing:.02em;
            font-variant-numeric:tabular-nums}}
      .perf{{margin:22px 0 20px;border-top:3px dashed #cfc7b6}}
      .main{{font-size:{"62px" if cover else "40px"};font-weight:800;letter-spacing:-.02em;
            line-height:1.12;color:#0d0d0f;text-wrap:balance}}
      .sub{{margin-top:16px;font-size:24px;line-height:1.5;color:#4a453d}}
      .subject{{margin-top:20px;display:flex;align-items:center;gap:14px;
               border-top:1px solid #ddd5c4;padding-top:16px}}
      .subject .ko{{font-size:27px;font-weight:800;color:#0d0d0f}}
      .subject .en{{font-size:20px;color:#8a8378;letter-spacing:.04em}}
      .site{{position:absolute;left:0;right:0;bottom:16px;text-align:center;font-size:17px;
            font-weight:800;letter-spacing:.18em;color:rgba(255,255,255,.55)}}
    </style></head><body>
      <div class="bg"></div><div class="veil"></div>
      <div class="wm">EPICKOR.COM</div>
      {'<div class="kick">' + kicker + '</div>' if kicker else ''}
      <div class="stub">{stub_head}
        <div class="main">{main}</div>
        <div class="sub">{sub}</div>
        {subject}
      </div>
      {'<div class="site">SWIPE</div>' if mode != "outro" else '<div class="site">EPICKOR.COM</div>'}
    </body></html>"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True)
    ap.add_argument("--card")
    args = ap.parse_args()

    folders = sorted(
        (ROOT / "public/assets/cardnews").glob(f"*_{args.slug}"), reverse=True
    )
    if not folders:
        sys.exit(f"no folder for slug {args.slug}")
    folder = folders[0]

    fm, cards = parse_script(folder / "script.md")
    if args.card:
        cards = [c for c in cards if c["number"] == args.card.zfill(2).lstrip("0") or c["number"] == args.card]

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": SIZE, "height": SIZE},
                                device_scale_factor=1)
        for card in cards:
            page.set_content(build_html(card, folder), wait_until="load")
            page.wait_for_timeout(320)
            out = folder / f"card_{int(card['number']):02d}.png"
            page.screenshot(path=str(out))
            print(f"  {out.name}")
        browser.close()
    print(f"rendered {len(cards)} cards → {folder}")


if __name__ == "__main__":
    main()
