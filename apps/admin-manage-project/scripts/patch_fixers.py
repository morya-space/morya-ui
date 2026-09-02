from pathlib import Path
p = Path(__file__).resolve().parent / "fixers.py"
t = p.read_text(encoding="utf-8")
t = t.replace(' enrollment 趋势', '选课趋势')
p.write_text(t, encoding="utf-8")
print("fixed reports title")
