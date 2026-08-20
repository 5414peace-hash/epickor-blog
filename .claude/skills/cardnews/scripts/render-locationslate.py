#!/usr/bin/env python3
"""
render-locationslate.py — the LOCATION SLATE visual system.

Built for the Squid Game filming-location carousel (slug 339). The content is a
list of real places with a scene attached to each and a transit line that gets
you there, so the card is shaped like a film production slate: a scene number, a
location name in both scripts, and the line you ride, stacked under the
photograph of the place itself.

Why this is not one of the previous systems: `ticket-stub` puts a date in the
hero position, `station-sign` and `transit-signal` are signage, `shelf-tag` and
`rx-label` are retail labels. None of them is built around a place plus the way
to reach it, which is the only thing a reader of this carousel needs to leave
with.

Veil (CLAUDE.md 2026-07-20): the house default buries a photograph. Each card
declares `image_opacity` in the 0.66-0.72 band under a gradient weighted to the
bottom, where the slate sits, so the location stays legible above it.

Usage: python .claude/skills/cardnews/scripts/render-locationslate.py --slug 339
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
        for key in ("mode", "kicker", "scene", "place_en", "place_ko", "transit",
                    "image", "fit", "image_position", "image_opacity", "image_label"):
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


def rich(s: str) -> str:
    """Escape, then re-enable the **bold** the script uses for one emphasis per card."""
    out = html.escape(s)
    out = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", out)
    return out.replace("\\n", "<br>")


def build_html(card, folder: Path) -> str:
    mode = card.get("mode", "slate")
    cover = mode == "cover"
    opacity = float(card.get("image_opacity", "0.70"))
    pos = card.get("image_position", "center 50%")
    img = data_uri(folder / card["image"])

    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
      *{{margin:0;padding:0;box-sizing:border-box}}
      body{{width:{SIZE}px;height:{SIZE}px;overflow:hidden;position:relative;background:#0a0a0b;
           font-family:"Malgun Gothic","Segoe UI",system-ui,sans-serif}}
      .bg{{position:absolute;inset:0;background-image:url('{img}');
          background-size:cover;background-position:{pos};opacity:{opacity}}}
      .veil{{position:absolute;inset:0;background:
            linear-gradient(180deg,rgba(8,8,10,.66) 0%,rgba(8,8,10,.06) 28%,rgba(8,8,10,.55) 60%,rgba(8,8,10,.95) 100%)}}
      .wm{{position:absolute;top:36px;left:42px;font-size:19px;font-weight:800;letter-spacing:.20em;
          color:rgba(255,255,255,.94);text-shadow:0 1px 6px rgba(0,0,0,.7)}}
      .kick{{position:absolute;top:36px;right:42px;font-size:16px;font-weight:800;letter-spacing:.13em;
            color:#0a0a0b;background:#e8ff3a;padding:8px 14px;border-radius:4px;text-align:right;max-width:600px}}
      /* clapper stripe — the one motif that says "film" without a word */
      .clap{{position:absolute;left:0;right:0;bottom:{'562px' if cover else '404px'};height:26px;
            background:repeating-linear-gradient(115deg,#f4f4f2 0 34px,#0a0a0b 34px 68px)}}
      .slate{{position:absolute;left:0;right:0;bottom:0;padding:{'34px 46px 150px' if cover else '34px 46px 40px'};
             background:linear-gradient(180deg,rgba(10,10,11,.86) 0%,#0a0a0b 22%)}}
      .row{{display:flex;align-items:flex-start;gap:20px}}
      .scene{{flex:none;width:88px;height:88px;border:3px solid #e8ff3a;border-radius:8px;
             display:flex;flex-direction:column;align-items:center;justify-content:center;color:#e8ff3a}}
      .scene .l{{font-size:12px;font-weight:800;letter-spacing:.14em}}
      .scene .n{{font-size:36px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums}}
      .who{{flex:1;min-width:0}}
      .en{{font-size:36px;font-weight:800;color:#fff;line-height:1.12;letter-spacing:-.01em}}
      .ko{{font-size:25px;font-weight:700;color:#e8ff3a;margin-top:5px}}
      .tx{{display:inline-block;margin-top:11px;font-size:18px;font-weight:700;color:#0a0a0b;
          background:#f4f4f2;padding:6px 13px;border-radius:20px}}
      .main{{margin-top:{'26px' if cover else '22px'};font-size:{'58px' if cover else '38px'};font-weight:800;
            color:#fff;line-height:1.1;letter-spacing:-.02em}}
      .sub{{margin-top:14px;font-size:23px;line-height:1.48;color:#d6d3d1}}
      .sub b{{color:#e8ff3a;font-weight:800}}
      .end{{position:absolute;left:0;right:0;bottom:12px;text-align:center;font-size:16px;font-weight:800;
           letter-spacing:.18em;color:rgba(255,255,255,.45)}}
    </style></head><body>
      <div class="bg"></div><div class="veil"></div>
      <div class="wm">EPICKOR.COM</div>
      {'<div class="kick">' + html.escape(card.get("kicker", "")) + '</div>' if card.get("kicker") else ''}
      <div class="clap"></div>
      <div class="slate">
        <div class="row">
          <div class="scene"><div class="l">SCENE</div><div class="n">{html.escape(card.get("scene", ""))}</div></div>
          <div class="who">
            <div class="en">{html.escape(card.get("place_en", ""))}</div>
            <div class="ko">{html.escape(card.get("place_ko", ""))}</div>
            <span class="tx">{html.escape(card.get("transit", ""))}</span>
          </div>
        </div>
        <div class="main">{rich(card.get("main", ""))}</div>
        <div class="sub">{rich(card.get("sub", ""))}</div>
      </div>
      <div class="end">{'EPICKOR.COM' if mode == 'outro' else 'SWIPE'}</div>
    </body></html>"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--slug", required=True)
    ap.add_argument("--card")
    args = ap.parse_args()

    folders = sorted((ROOT / "public/assets/cardnews").glob(f"*_{args.slug}"), reverse=True)
    if not folders:
        sys.exit(f"no folder for slug {args.slug}")
    folder = folders[0]

    _, cards = parse_script(folder / "script.md")
    if args.card:
        cards = [c for c in cards if int(c["number"]) == int(args.card)]

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={"width": SIZE, "height": SIZE}, device_scale_factor=1)
        for card in cards:
            page.set_content(build_html(card, folder), wait_until="load")
            page.wait_for_timeout(320)
            out = folder / f"card_{int(card['number']):02d}.png"
            page.screenshot(path=str(out))
            print(f"  {out.name}")
        browser.close()
    print(f"rendered {len(cards)} cards -> {folder}")


if __name__ == "__main__":
    main()
