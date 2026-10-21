"""Memory Movers | build.py
Bundles index.html + css/ + data/ + js/ + assets/ into ONE self-contained file: dist/index.html.
Run after editing anything:  python build.py
"""
import base64, json, os, re

ROOT = os.path.dirname(os.path.abspath(__file__))
read = lambda p: open(os.path.join(ROOT, p), encoding="utf-8").read()

def b64_folder(folder, ext, mime):
    d = os.path.join(ROOT, folder)
    return {f[:-len(ext)]: f"data:{mime};base64," + base64.b64encode(open(os.path.join(d, f), "rb").read()).decode()
            for f in sorted(os.listdir(d)) if f.endswith(ext)}

html = read("index.html")
html = re.sub(r'<link rel="stylesheet" href="(css/[^"]+)">', lambda m: "<style>\n" + read(m.group(1)) + "\n</style>", html)

assets = {"images": b64_folder("assets/images", ".png", "image/png"),
          "audio": b64_folder("assets/audio", ".wav", "audio/wav")}
first = True
def inline_script(m):
    global first
    out = ""
    if first:
        out = "<script>window.MM_ASSETS = " + json.dumps(assets) + ";</script>\n"
        first = False
    return out + "<script>\n" + read(m.group(1)) + "\n</script>"
html = re.sub(r'<script src="((?:js|data)/[^"]+)"></script>', inline_script, html)

os.makedirs(os.path.join(ROOT, "dist"), exist_ok=True)
with open(os.path.join(ROOT, "dist", "index.html"), "w", encoding="utf-8") as f:
    f.write(html)
print(f"dist/index.html  {round(len(html) / 1024)} KB")
