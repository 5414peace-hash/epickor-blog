#!/usr/bin/env python3
"""
render-swapcard.py — the SWAP CARD visual system.

Built for the Korean gift-etiquette carousel (slug 194). Every card in it is a
pair: a thing not to give, and the thing to give instead. So the card is split
hard across the middle — photograph and the avoided item above, the alternative
on a contrasting band below — because a reader who takes only the bottom half has
still taken the useful half.

Why this is not one of the previous systems: `ticket-stub` leads on a date,
`location-slate` on a place plus its transit line, `spec-split` on a product and
its numbers. None of them is a paired opposite, and none of them divides the card
into two halves that mean different things.

The structure carries the tone too. A taboo list can read as scolding; giving
every "do not" an immediate "instead" keeps it useful rather than superstitious,
which is how the source article frames it.

Usage: python .claude/skills/cardnews/scripts/render-swapcard.py --slug 194
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
INK = "#171310"
CREAM = "#faf6ef"
AVOID = "#b3261e"
INSTEAD = "#0f6b4f"


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
        for key in ("mode", "kicker", "image", "image_label", "subject_note",
                    "avoid_label", "avoid_why", "instead_label"):
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
    mode = card.get("mode", "swap")
    cover = mode == "cover"
    img = data_uri(folder / card["image"])

    swap = ""
    if card.get("avoid_label"):
        swap = f"""
      <div class="pair">
        <div class="line avoid">
          <span class="mark">✕</span>
          <span class="txt"><b>{html.escape(card["avoid_label"])}</b><br>
            <span class="why">{html.escape(card.get("avoid_why", ""))}</span></span>
        </div>
        <div class="line instead">
          <span class="mark">✓</span>
          <span class="txt"><b>{html.escape(card.get("instead_label", ""))}</b></span>
        </div>
      </div>"""

    photo_h = 560 if cover else 400
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
      *{{margin:0;padding:0;box-sizing:border-box}}
      body{{width:{SIZE}px;height:{SIZE}px;overflow:hidden;background:{CREAM};color:{INK};
           font-family:"Malgun Gothic","Segoe UI",system-ui,sans-serif;display:flex;flex-direction:column}}
      .photo{{height:{photo_h}px;position:relative;flex:none;overflow:hidden}}
      .photo img{{width:100%;height:100%;object-fit:cover}}
      .shade{{position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,12,10,.72) 0%,rgba(15,12,10,.20) 22%,rgba(15,12,10,0) 40%)}}
      .wm{{position:absolute;top:32px;left:42px;font-size:19px;font-weight:800;letter-spacing:.20em;
          color:rgba(255,255,255,.95);text-shadow:0 1px 6px rgba(0,0,0,.65)}}
      .kick{{position:absolute;top:32px;right:42px;font-size:16px;font-weight:800;letter-spacing:.13em;
            color:#fff;background:{AVOID};padding:8px 14px;border-radius:4px;max-width:520px;text-align:right}}
      .body{{flex:1;padding:{'30px 46px 0' if cover else '26px 46px 0'};display:flex;flex-direction:column}}
      .main{{font-size:{'54px' if cover else '40px'};font-weight:800;line-height:1.1;letter-spacing:-.02em;
            text-wrap:balance}}
      .sub{{margin-top:13px;font-size:23px;line-height:1.46;color:#4a423b}}
      .sub b{{color:{AVOID};font-weight:800}}
      .pair{{margin-top:auto;margin-bottom:18px;display:flex;flex-direction:column;gap:9px}}
      .line{{display:flex;align-items:flex-start;gap:14px;border-radius:12px;padding:14px 18px}}
      .avoid{{background:#fbeceb;border:1px solid #f0cfcc}}
      .instead{{background:#e8f4ef;border:1px solid #c5e2d7}}
      .mark{{font-size:26px;font-weight:800;line-height:1.1;flex:none}}
      .avoid .mark{{color:{AVOID}}} .instead .mark{{color:{INSTEAD}}}
      .txt{{font-size:23px;line-height:1.34}}
      .avoid .txt b{{color:{AVOID}}} .instead .txt b{{color:{INSTEAD}}}
      .why{{font-size:20px;color:#6b6058}}
      .foot{{padding:0 46px 20px;text-align:center;font-size:16px;font-weight:800;letter-spacing:.18em;color:#a89e94}}
    </style></head><body>
      <div class="photo"><img src="{img}"><div class="shade"></div>
        <div class="wm">EPICKOR.COM</div>
        {'<div class="kick">' + html.escape(card.get("kicker","")) + '</div>' if card.get("kicker") else ''}
      </div>
      <div class="body">
        <div class="main">{rich(card.get("main",""))}</div>
        <div class="sub">{rich(card.get("sub",""))}</div>
        {swap}
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
