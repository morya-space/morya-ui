from pathlib import Path
import os
m = Path(__file__).resolve().parent / "rewrite-all-vue-utf8.mjs"
t = m.read_text(encoding="utf-8")
print("has files object", "const files = {" in t)
print("writeFileSync utf8", "writeFileSync(target, content, 'utf8')" in t)
print("login title", "智学云 · 教育管理后台" in t)
print("root join", "join(dirname(fileURLToPath(import.meta.url)), '..', 'src')" in t)
root = Path(__file__).resolve().parent.parent / "src"
hits = []
for dp, _, fs in os.walk(root):
    for f in fs:
        if f.endswith(".vue"):
            txt = (Path(dp) / f).read_text(encoding="utf-8")
            if 'severity="primary"' in txt:
                hits.append(str(Path(dp) / f))
print("primary buttons", len(hits))
