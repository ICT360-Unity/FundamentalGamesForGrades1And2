#!/usr/bin/env python3
"""
Netizen Badge Quest — build script
Bundles index.html + css/ + js/ + data/ + assets/ into ONE self-contained file:
    dist/index.html
Run:  python build.py
"""
import base64
import pathlib
import re

ROOT = pathlib.Path(__file__).resolve().parent
OUT = ROOT / "dist" / "index.html"
MIME = {".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg", ".webp": "image/webp", ".mp3": "audio/mpeg", ".wav": "audio/wav"}


def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")


def main():
    html = read("index.html")

    # 1. Inline local stylesheets
    html = re.sub(r'<link rel="stylesheet" href="(css/[^"]+)">',
                  lambda m: "<style>\n" + read(m.group(1)) + "\n</style>", html)

    # 2. Inline local scripts (data/ and js/)
    html = re.sub(r'<script src="((?:js|data)/[^"]+)"></script>',
                  lambda m: "<script>\n" + read(m.group(1)) + "\n</script>", html)

    # 3. Replace every asset path (in HTML, CSS or JS strings) with a data URI
    cache = {}

    def to_uri(m):
        rel = m.group(1)
        if rel not in cache:
            f = ROOT / rel
            cache[rel] = "data:%s;base64,%s" % (MIME[f.suffix.lower()], base64.b64encode(f.read_bytes()).decode())
        return cache[rel]

    html = re.sub(r'(?:\.\./)?(assets/[\w\-/]+\.(?:svg|png|jpe?g|webp|mp3|wav))', to_uri, html)

    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(html, encoding="utf-8")
    print("Built %s (%.1f KB, %d assets inlined)" % (OUT.relative_to(ROOT), OUT.stat().st_size / 1024, len(cache)))


if __name__ == "__main__":
    main()
