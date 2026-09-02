from pathlib import Path
p = Path(__file__).resolve().parent / "make_all.py"
t = p.read_text(encoding="utf-8")
t = t.replace(".read_text(encoding=\"utf-8\")", ".read_text(encoding=\"utf-8\", errors=\"replace\")")
p.write_text(t, encoding="utf-8")
print("make_all read with replace")
