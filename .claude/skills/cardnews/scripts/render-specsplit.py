#!/usr/bin/env python3
"""
render-specsplit.py — the SPEC SPLIT visual system.

Built for the Bacchus D vs F carousel (slug 344), where the whole story is two
almost identical objects separated by three numbers. So the card puts the product
on a clean pale ground and stacks the numbers beside it as labelled chips, rather
than burying either under a photograph.

Why this is not one of the previous systems: `ticket-stub` and `location-slate`
are both dark, full-bleed photographs with a plate over them. This one is **light
and cutout-led** — which is the point, because a bottle shot against a pale ground
reads as a product comparison in a feed and a dark card does not. `shelf-tag` is a
retail price tag and `rx-label` is a pharmacy label; neither leads with the object.

Cards may be `image_fit: contain` (transparent product cutouts, sat on the ground)
or `cover` (real photographs, filling a panel). Both are supported because this
carousel mixes manufacturer cutouts with real photographs.

Usage: python .claude/skills/cardnews/scripts/render-specsplit.py --slug 344
"""
import argparse
import base64
import html
import mimetypes
import re
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[4]
SIZE = 1080
GROUND = "#eef4f2"
INK = "#0f1b18"
ACCENT = "#c8102e"


def parse_script(path: Path):
    text = path.read_text(encoding="utf-8")
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if m:
        text = text[m.end():]
    cards = []
    for block in re.split(r"\n---\n", text):
        if "## Card" not in block:
            continue
        card = {"number": re.search(r"## Card\s*(\d+)", block).group(1)}
        for key in ("mode", "kicker", "image", "image_fit", "image_label",
                    "name_ko", "name_en",
                    "stat1_label", "stat1_value", "stat2_label", "stat2_value",
                    "stat3_label", "stat3_value"):
            mm = re.search(rf"^{key}:\s*(.+)$", block, re.M)
            if mm:
                card[key] = mm.group(1).strip()
        for key, label in (("main", "Main"), ("sub", "Sub")):
            mm = re.search(rf"\*\*{label}:\*\*\s*(.+?)(?=\n\*\*|\n##|\Z)", block, re.S)
            if mm:
                card[key] = mm.group(1).strip()
        cards.append(card)
    return cards


def data_uri(p: Path) -> str:
    mime = mimetypes.guess_type(p.name)[0] or "image/jpeg"
    return f"data:{mime};base64," + base64.b64encode(p.read_bytes()).decode()


def rich(s: str) -> str:
    out = html.escape(s)
    out = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", out)
    return out.replace("\\n", "<br>")


def build_html(card, folder: Path) -> str:
    mode = card.get("mode", "spec")
    cover = mode == "cover"
    img = data_uri(folder / card["image"])
    contain = card.get("image_fit", "contain") == "contain"

    stats = ""
    for i in (1, 2, 3):
        lab = card.get(f"stat{i}_label")
        val = card.get(f"stat{i}_value")
        if lab and val:
            stats += (f'<div class="st"><div class="sl">{html.escape(lab)}</div>'
                      f'<div class="sv">{html.escape(val)}</div></div>')
    stats = f'<div class="stats">{stats}</div>' if stats else ""

    name = ""
    if card.get("name_ko") or card.get("name_en"):
        name = (f'<div class="name"><span class="nk">{html.escape(card.get("name_ko",""))}</span>'
                f'<span class="ne">{html.escape(card.get("name_en",""))}</span></div>')

    stage_h = 560 if cover else 520
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
      *{{margin:0;padding:0;box-sizing:border-box}}
      body{{width:{SIZE}px;height:{SIZE}px;overflow:hidden;position:relative;background:{GROUND};
           font-family:"Malgun Gothic","Segoe UI",system-ui,sans-serif;color:{INK};
           display:flex;flex-direction:column}}
      .top{{display:flex;justify-content:space-between;align-items:flex-start;padding:34px 44px 0}}
      .wm{{font-size:19px;font-weight:800;letter-spacing:.20em;color:{INK}}}
      .kick{{font-size:16px;font-weight:800;letter-spacing:.13em;color:#fff;background:{ACCENT};
            padding:8px 14px;border-radius:4px;max-width:560px;text-align:right}}
      .stage{{height:{stage_h}px;margin:10px 44px 0;border-radius:18px;overflow:hidden;position:relative;
             background:{'#e2ebe8' if contain else '#0f1b18'}}}
      .stage img{{position:absolute;inset:0;width:100%;height:100%;
                 object-fit:{'contain' if contain else 'cover'};
                 padding:{'22px' if contain else '0'}}}
      .body{{flex:1;padding:22px 44px 0;display:flex;flex-direction:column}}
      .name{{display:flex;align-items:baseline;gap:14px}}
      .nk{{font-size:30px;font-weight:800}}
      .ne{{font-size:20px;color:#5c6b66;letter-spacing:.03em}}
      .stats{{display:flex;gap:10px;margin-top:14px;flex-wrap:wrap}}
      .st{{background:#fff;border:1px solid #d3e0dc;border-radius:11px;padding:11px 16px;min-width:150px}}
      .sl{{font-size:14px;font-weight:800;letter-spacing:.09em;text-transform:uppercase;color:#6b7a75}}
      .sv{{font-size:26px;font-weight:800;margin-top:3px;font-variant-numeric:tabular-nums}}
      .main{{margin-top:{'20px' if cover else '18px'};font-size:{'56px' if cover else '38px'};
            font-weight:800;line-height:1.1;letter-spacing:-.02em;text-wrap:balance}}
      .sub{{margin-top:13px;font-size:23px;line-height:1.48;color:#3c4a46}}
      .sub b{{color:{ACCENT};font-weight:800}}
      .foot{{margin-top:auto;padding:0 44px 22px;font-size:16px;font-weight:800;letter-spacing:.18em;
            color:#8b9a95;text-align:center}}
    </style></head><body>
      <div class="top"><div class="wm">EPICKOR.COM</div>
        {'<div class="kick">' + html.escape(card.get("kicker","")) + '</div>' if card.get("kicker") else '<div></div>'}
      </div>
      <div class="stage"><img src="{img}"></div>
      <div class="body">
        {name}{stats}
        <div class="main">{rich(card.get("main",""))}</div>
        <div class="sub">{rich(card.get("sub",""))}</div>
      </div>
      <div class="foot">{'EPICKOR.COM' if mode == 'outro' else 'SWIPE'}</div>
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

    cards = parse_script(folder / "script.md")
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
