#!/usr/bin/env python3
"""
Build a single self-contained file: dist/index.html

- Inlines css/style.css
- Inlines every local <script src="..."> (data + js)
- Inlines every SVG in assets/ as a data URI (window.ASSET_DATA)

The Google Fonts link is kept; if it is blocked, the game falls back to system fonts.
Usage:  python3 build.py
"""
import base64
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "index.html"
OUT = ROOT / "dist" / "index.html"


def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")


def main():
    html = SRC.read_text(encoding="utf-8")

    # 1. stylesheet
    html = re.sub(
        r'<link rel="stylesheet" href="(css/[^"]+)">',
        lambda m: "<style>\n" + read(m.group(1)) + "\n</style>",
        html,
    )

    # 2. assets as data URIs
    assets = {}
    for f in sorted((ROOT / "assets").glob("*.svg")):
        b64 = base64.b64encode(f.read_bytes()).decode("ascii")
        assets[f.stem] = "data:image/svg+xml;base64," + b64
    asset_script = "<script>window.ASSET_DATA = " + json.dumps(assets) + ";</script>\n  "

    # 3. local scripts
    def inline_script(m):
        src = m.group(1)
        code = read(src).replace("</script>", "<\\/script>")
        prefix = asset_script if src == "js/assets.js" else ""
        return prefix + "<script>\n/* " + src + " */\n" + code + "\n</script>"

    html = re.sub(r'<script src="((?:js|data)/[^"]+)"></script>', inline_script, html)

    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(html, encoding="utf-8")
    print(f"Built {OUT.relative_to(ROOT)}  ({OUT.stat().st_size / 1024:.1f} KB)")


if __name__ == "__main__":
    main()
