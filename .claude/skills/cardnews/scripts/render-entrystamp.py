#!/usr/bin/env python3
"""
render-entrystamp.py — the ENTRY STAMP visual system.

Built for the Korea entry-paperwork carousel (slug 223). The subject is a form,
so the card is a form: a cream document sheet laid on immigration navy, with a
photo window punched into it, ruled field rows, a rotated red stamp carrying the
card's one hard number, and a machine-readable strip along the bottom edge.

Why this is not one of the previous systems: `ticket-stub` leads on a date,
`location-slate` on a place plus its transit line, `spec-split` on a product and
its numbers, `swap-card` on a pair of opposites. None of them frames the photo
inside a document, and none has field rows — which is the whole point here,
because the reader's actual task is filling in labelled fields.

The stamp is deliberately a design motif and not a reproduction: it carries our
own copy (a fee, a count, a domain suffix), never anything that could pass for an
official mark.

Usage: python .claude/skills/cardnews/scripts/render-entrystamp.py --slug 223
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
NAVY = "#0d1a2b"
CREAM = "#f4efe4"
INK = "#1b1f26"
STAMP = "#b01e28"
MUTED = "#6b6154"
RULE = "#d9d0be"


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
                    "stamp", "col_a", "col_b", "image_position"):
            mm = re.search(rf"^{key}:\s*(.+)$", block, re.M)
            if mm:
                card[key] = mm.group(1).strip()
        # repeatable keys
        card["rows"] = re.findall(r"^rows:\s*(.+)$", block, re.M)
        card["pairs"] = re.findall(r"^pair:\s*(.+)$", block, re.M)
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
    out = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<i>\1</i>", out)
    return out.replace("\\n", "<br>")


def split_kv(line: str):
    """`LABEL | value` -> (label, value). A row with no pipe is all value."""
    if "|" in line:
        a, b = line.split("|", 1)
        return a.strip(), b.strip()
    return "", line.strip()


def build_html(card, folder: Path) -> str:
    mode = card.get("mode", "form")
    img = data_uri(folder / card["image"])
    n = int(card["number"])

    # The window is flexible rather than fixed. Text height varies a lot between a
    # cover and a five-row list, and a fixed window left card 02 with a squashed
    # crop above a band of dead cream. Letting the photo absorb the slack keeps the
    # sheet exactly full on every card and gives the densest cards the smallest,
    # not the most awkward, image.
    min_win = 200 if mode == "form" else 300
    pos = card.get("image_position", "center")

    body_parts = []
    if mode == "compare":
        heads = (f'<div class="ch"><span>{html.escape(card.get("col_a",""))}</span>'
                 f'<span>{html.escape(card.get("col_b",""))}</span></div>')
        rows = "".join(
            f'<div class="cr"><span>{html.escape(a)}</span><span>{html.escape(b)}</span></div>'
            for a, b in (split_kv(p) for p in card.get("pairs", [])))
        body_parts.append(f'<div class="cmp">{heads}{rows}</div>')
    elif card.get("rows"):
        rows = "".join(
            f'<div class="fr"><span class="fl">{html.escape(a)}</span>'
            f'<span class="fv">{html.escape(b)}</span></div>'
            for a, b in (split_kv(r) for r in card["rows"]))
        body_parts.append(f'<div class="fields">{rows}</div>')

    stamp = ""
    if card.get("stamp"):
        stamp = f'<div class="stamp">{html.escape(card["stamp"])}</div>'

    mrz = ("EPICKOR.COM&lt;&lt;KOREA&lt;ENTRY&lt;GUIDE&lt;&lt;"
           + "&lt;" * 18 + f"{n:02d}07")

    main_size = {"cover": 62, "outro": 50}.get(mode, 42)
    sub_size = 23 if mode in ("cover", "outro") else 21

    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
      *{{margin:0;padding:0;box-sizing:border-box}}
      body{{width:{SIZE}px;height:{SIZE}px;overflow:hidden;background:{NAVY};
           font-family:"Malgun Gothic","Segoe UI",system-ui,sans-serif;color:{INK};
           display:flex;align-items:center;justify-content:center}}
      .sheet{{width:1004px;height:1004px;background:{CREAM};position:relative;
             display:flex;flex-direction:column;
             box-shadow:0 10px 34px rgba(0,0,0,.45)}}
      .hdr{{display:flex;justify-content:space-between;align-items:baseline;
           padding:22px 40px 12px;font-family:Consolas,"Courier New",monospace;
           font-size:16px;letter-spacing:.16em;color:{MUTED};font-weight:700;flex:none}}
      .hdr .wm{{color:{INK}}}
      .hdr .kick{{color:{STAMP}}}
      .winwrap{{margin:0 40px;position:relative;flex:1;min-height:{min_win}px;display:flex}}
      .win{{flex:1;overflow:hidden;border:1px solid {RULE};background:{NAVY}}}
      .win img{{width:100%;height:100%;object-fit:cover;object-position:{pos};display:block}}
      .body{{padding:26px 40px 0;display:flex;flex-direction:column;flex:none}}
      .main{{font-size:{main_size}px;font-weight:800;line-height:1.08;letter-spacing:-.02em}}
      .sub{{margin-top:12px;font-size:{sub_size}px;line-height:1.5;color:#463f36}}
      .sub b{{color:{STAMP};font-weight:800}}
      .fields{{margin-top:0;padding-top:16px;display:flex;flex-direction:column}}
      .fr{{display:flex;gap:16px;padding:9px 0;border-top:1px solid {RULE};align-items:baseline}}
      .fr:last-child{{border-bottom:1px solid {RULE}}}
      .fl{{flex:0 0 200px;font-family:Consolas,"Courier New",monospace;font-size:15px;
          letter-spacing:.10em;color:{MUTED};font-weight:700}}
      .fv{{flex:1;font-size:20px;line-height:1.32;font-weight:600}}
      .cmp{{margin-top:0;padding-top:16px}}
      .ch{{display:flex;gap:18px;padding-bottom:8px}}
      .ch span{{flex:1;font-family:Consolas,"Courier New",monospace;font-size:15px;
               letter-spacing:.10em;color:{MUTED};font-weight:700}}
      .cr{{display:flex;gap:18px;border-top:1px solid {RULE};padding:10px 0}}
      .cr:last-child{{border-bottom:1px solid {RULE}}}
      .cr span{{flex:1;font-size:20px;line-height:1.3;font-weight:600}}
      .cr span:last-child{{color:{STAMP}}}
      .stamp{{position:absolute;bottom:-24px;right:-8px;z-index:2;
             border:4px solid {STAMP};color:{STAMP};padding:9px 18px;
             transform:rotate(-7deg);background:rgba(244,239,228,.90);
             font-family:Consolas,"Courier New",monospace;font-weight:700;
             font-size:34px;letter-spacing:.04em;line-height:1;
             box-shadow:0 2px 0 rgba(176,30,40,.20)}}
      .mrz{{flex:none;margin-top:16px;padding:12px 40px 16px;border-top:1px solid {RULE};
           font-family:Consolas,"Courier New",monospace;font-size:19px;letter-spacing:.06em;
           color:#9a9081;white-space:nowrap;overflow:hidden}}
    </style></head><body>
      <div class="sheet">
        <div class="hdr">
          <span class="wm">EPICKOR.COM</span>
          <span class="kick">{html.escape(card.get("kicker",""))}</span>
          <span>{n:02d} / 07</span>
        </div>
        <div class="winwrap"><div class="win"><img src="{img}"></div>{stamp}</div>
        <div class="body">
          <div class="main">{rich(card.get("main",""))}</div>
          <div class="sub">{rich(card.get("sub",""))}</div>
          {"".join(body_parts)}
        </div>
        <div class="mrz">{mrz}</div>
      </div>
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
