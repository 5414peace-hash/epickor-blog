#!/usr/bin/env python3
"""
render-potstamp.py — the POT STAMP visual system.

Built for the Korean kitchen-object batch that starts with the aluminium ramyun
pot (slug 438). Every card in that batch answers a question about a physical
object with a measured number, so the card is shaped like the thing that
actually carries those numbers in a Korean kitchen: the **stamped plate on the
underside of a pot** — a brushed steel band with the material, the capacity and
a figure engraved into it.

Why this is not one of the previous systems: `rx-label` and `shelf-tag` are
paper retail labels, `price-tag` is a price, `spec-sheet` and `spec-split` are
tables, `earth-gauge` is a dial, `location-slate` is a film slate,
`ticket-stub` and `entry-stamp` are travel documents. None of them is metal, and
none of them puts a single measured value in the position where a reader looks
for a verdict.

Veil (CLAUDE.md 2026-07-20): the house default buries the photograph. Here the
copy sits on the steel band rather than on the image, so photographs run at
`image_opacity` 0.82-0.92 and stay fully readable — the band supplies contrast
instead of a dark veil.

Card 01 is the Instagram profile-grid thumbnail, so in `cover` mode the steel
plate is centred rather than clamped to the bottom edge and the headline is
centre-aligned inside it (CLAUDE.md card-01 safe-area rule).

Usage: python .claude/skills/cardnews/scripts/render-potstamp.py --slug 438
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

FIELDS = ("mode", "kicker", "image", "fit", "image_position", "image_opacity",
          "image_label", "name_ko", "name_en", "stat_label", "stat_value", "stat_note")


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
        for key in FIELDS:
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
    # Single asterisks are italics. Without this, card 02's *Western silver*
    # rendered its own asterisks on screen in the first pass.
    out = re.sub(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)", r"<i>\1</i>", out)
    return out.replace("\\n", "<br>")


# A brushed-metal ground: three stacked gradients, the top one a fine repeating
# streak so the band reads as rolled steel rather than flat grey.
STEEL = (
    "repeating-linear-gradient(92deg,rgba(255,255,255,.55) 0 2px,rgba(255,255,255,0) 2px 5px),"
    "linear-gradient(180deg,#e9ebee 0%,#c6cad0 34%,#d8dbe0 62%,#b3b8bf 100%)"
)


def build_html(card, folder: Path) -> str:
    mode = card.get("mode", "stamp")
    cover = mode == "cover"
    outro = mode == "outro"
    opacity = float(card.get("image_opacity", "0.86"))
    pos = card.get("image_position", "center 50%")
    img = data_uri(folder / card["image"])
    has_stat = bool(card.get("stat_value"))

    stat_block = ""
    if has_stat:
        stat_block = f"""
        <div class="stat">
          <div class="sl">{html.escape(card.get("stat_label", ""))}</div>
          <div class="sv">{rich(card.get("stat_value", ""))}</div>
          {'<div class="sn">' + rich(card.get("stat_note", "")) + '</div>' if card.get("stat_note") else ''}
        </div>"""

    name_block = ""
    if card.get("name_en") or card.get("name_ko"):
        name_block = f"""
        <div class="names">
          <span class="ko">{html.escape(card.get("name_ko", ""))}</span>
          <span class="en">{html.escape(card.get("name_en", ""))}</span>
        </div>"""

    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
      *{{margin:0;padding:0;box-sizing:border-box}}
      body{{width:{SIZE}px;height:{SIZE}px;overflow:hidden;position:relative;background:#101215;
           font-family:"Malgun Gothic","Segoe UI",system-ui,sans-serif}}
      .bg{{position:absolute;inset:0;background-image:url('{img}');
          background-size:cover;background-position:{pos};opacity:{opacity}}}
      /* Only enough gradient to hold the watermark and kicker, not a veil over the food. */
      .top{{position:absolute;left:0;right:0;top:0;height:190px;
           background:linear-gradient(180deg,rgba(10,12,15,.72) 0%,rgba(10,12,15,0) 100%)}}
      .wm{{position:absolute;top:36px;left:42px;font-size:19px;font-weight:800;letter-spacing:.20em;
          color:rgba(255,255,255,.95);text-shadow:0 1px 7px rgba(0,0,0,.8)}}
      .kick{{position:absolute;top:33px;right:42px;font-size:16px;font-weight:800;letter-spacing:.12em;
            color:#101215;background:{STEEL};padding:9px 15px;border-radius:3px;text-align:right;
            max-width:590px;border:1px solid rgba(255,255,255,.65);
            box-shadow:0 2px 10px rgba(0,0,0,.45)}}

      /* The stamped plate. Bottom-clamped for body cards, centred for the grid thumbnail. */
      .plate{{position:absolute;background:{STEEL};
             border-top:2px solid rgba(255,255,255,.85);border-bottom:2px solid rgba(0,0,0,.28);
             box-shadow:0 -16px 42px rgba(0,0,0,.45), inset 0 2px 0 rgba(255,255,255,.5);
             {'left:64px;right:64px;top:41%;transform:translateY(-50%);padding:44px 46px 46px;border-radius:6px;border-left:2px solid rgba(255,255,255,.7);border-right:2px solid rgba(0,0,0,.2);text-align:center'
              if cover else 'left:0;right:0;bottom:0;padding:34px 46px 62px'}}}
      /* Engraved hairline that runs the width of the plate, the way a stamped rim does. */
      .rule{{height:2px;background:linear-gradient(90deg,rgba(0,0,0,.32),rgba(0,0,0,.10));
            box-shadow:0 1px 0 rgba(255,255,255,.75);margin:{'20px auto' if cover else '18px 0'};
            {'width:66%' if cover else ''}}}

      .names{{display:flex;gap:14px;align-items:baseline;{'justify-content:center' if cover else ''}}}
      .names .ko{{font-size:27px;font-weight:800;color:#14181c;letter-spacing:-.01em}}
      .names .en{{font-size:18px;font-weight:700;color:#4d555e;letter-spacing:.10em;text-transform:uppercase}}

      .main{{font-size:{'56px' if cover else '40px'};font-weight:800;color:#14181c;line-height:1.12;
            letter-spacing:-.022em;margin-top:{'6px' if cover else '4px'}}}
      .main b{{color:#a8330f}}
      .sub{{margin-top:14px;font-size:{'25px' if cover else '23px'};line-height:1.5;color:#333b44}}
      .sub b{{color:#a8330f;font-weight:800}}

      .stat{{margin-top:20px;display:inline-block;border:3px solid #14181c;border-radius:5px;
            padding:12px 22px 14px;background:rgba(255,255,255,.42)}}
      .stat .sl{{font-size:15px;font-weight:800;letter-spacing:.15em;color:#4d555e;text-transform:uppercase}}
      .stat .sv{{font-size:46px;font-weight:800;color:#a8330f;line-height:1.06;
                font-variant-numeric:tabular-nums;margin-top:3px}}
      .stat .sn{{font-size:18px;font-weight:700;color:#333b44;margin-top:5px}}

      .end{{position:absolute;left:0;right:0;bottom:13px;text-align:center;font-size:16px;font-weight:800;
           letter-spacing:.18em;color:{'#4d555e' if cover else 'rgba(20,24,28,.5)'}}}
    </style></head><body>
      <div class="bg"></div><div class="top"></div>
      <div class="wm">EPICKOR.COM</div>
      {'<div class="kick">' + html.escape(card.get("kicker", "")) + '</div>' if card.get("kicker") else ''}
      <div class="plate">
        {name_block}
        {'<div class="rule"></div>' if name_block else ''}
        <div class="main">{rich(card.get("main", ""))}</div>
        <div class="sub">{rich(card.get("sub", ""))}</div>
        {stat_block}
      </div>
      <div class="end">{'EPICKOR.COM' if outro else 'SWIPE'}</div>
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
