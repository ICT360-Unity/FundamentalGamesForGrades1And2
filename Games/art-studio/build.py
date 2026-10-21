#!/usr/bin/env python3
"""Bundle Winter Scene Workshop into one self-contained file: dist/index.html

- Inlines css/*.css, data/*.js and js/*.js
- Turns every "assets/....svg|png|jpg" path into a data: URI
Run:  python build.py
"""
import base64, mimetypes, os, re

HERE = os.path.dirname(os.path.abspath(__file__))

def read(rel):
    with open(os.path.join(HERE, rel), encoding="utf-8") as f:
        return f.read()

def data_uri(rel):
    path = os.path.join(HERE, rel)
    mime = mimetypes.guess_type(path)[0] or "application/octet-stream"
    if rel.endswith(".svg"):
        mime = "image/svg+xml"
    with open(path, "rb") as f:
        return "data:%s;base64,%s" % (mime, base64.b64encode(f.read()).decode("ascii"))

def main():
    html = read("index.html")
    html = re.sub(r'<link rel="stylesheet" href="(css/[^"]+)">',
                  lambda m: "<style>\n%s\n</style>" % read(m.group(1)), html)
    html = re.sub(r'<script src="((?:js|data)/[^"]+)"></script>',
                  lambda m: "<script>\n%s\n</script>" % read(m.group(1)).replace("</script", "<\\/script"), html)
    missing = []
    def swap(m):
        rel = m.group(1)
        if not os.path.exists(os.path.join(HERE, rel)):
            missing.append(rel)
            return rel
        return data_uri(rel)
    html = re.sub(r'(assets/[A-Za-z0-9_\-/]+\.(?:svg|png|jpg|jpeg|webp|gif))', swap, html)
    os.makedirs(os.path.join(HERE, "dist"), exist_ok=True)
    out = os.path.join(HERE, "dist", "index.html")
    with open(out, "w", encoding="utf-8") as f:
        f.write(html)
    print("Built %s (%.0f KB)" % (out, os.path.getsize(out) / 1024))
    if missing:
        print("WARNING: missing assets:", ", ".join(sorted(set(missing))))

if __name__ == "__main__":
    main()
