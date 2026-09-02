from pathlib import Path
p = Path(__file__).resolve().parent / "make_all.py"
t = p.read_text(encoding="utf-8")
if "data_overrides" not in t:
    t = t.replace(
        "from data_admin import ADMIN_LAYOUT",
        "from data_admin import ADMIN_LAYOUT\nfrom data_overrides import OVERRIDES",
    )
    old = """def fix_content(rel: str, content: str, patches) -> str:
    if rel == \"layouts/AdminLayout.vue\":
        return decode_vue_unicode(ADMIN_LAYOUT)
    out = content
    for old, new in patches.get(rel, []):
        out = out.replace(old, new)
    return out"""
    new = """def fix_content(rel: str, content: str, patches) -> str:
    if rel in OVERRIDES:
        return OVERRIDES[rel]
    if rel == \"layouts/AdminLayout.vue\":
        return decode_vue_unicode(ADMIN_LAYOUT)
    out = content
    for old, new in patches.get(rel, []):
        out = out.replace(old, new)
    return out"""
    t = t.replace(old, new)
    p.write_text(t, encoding="utf-8")
    print("patched make_all.py")
