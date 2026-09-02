from pathlib import Path
import re
p = Path(__file__).resolve().parent / "fixers.py"
t = p.read_bytes().decode("utf-8-sig")
# remove login_override import from top if misplaced
t = re.sub(r"^from login_override import LOGIN_VIEW\s*\n", "", t)
t = re.sub(r"^def fix_login_view\(c: str\) -> str:\s*\n\s*return LOGIN_VIEW\s*\n\s*\n", "", t)
if "from login_override import LOGIN_VIEW" not in t:
    # insert after __future__ block
    t = t.replace(
        "from __future__ import annotations\n\n",
        "from __future__ import annotations\n\nfrom login_override import LOGIN_VIEW\n\n",
    )
if "def fix_login_view" not in t:
    t = t.replace(
        "def _r(content: str, *pairs: tuple[str, str]) -> str:",
        "def fix_login_view(c: str) -> str:\n    return LOGIN_VIEW\n\n\ndef _r(content: str, *pairs: tuple[str, str]) -> str:",
    )
t = t.replace(
    '"views/auth/LoginView.vue": fix_login,',
    '"views/auth/LoginView.vue": fix_login_view,',
)
t = t.replace(
    '"views/auth/LoginView.vue": lambda c: LOGIN_VIEW,',
    '"views/auth/LoginView.vue": fix_login_view,',
)
p.write_text(t, encoding="utf-8")
print("fixers structure fixed")

# patch make_all for login fallback
mp = Path(__file__).resolve().parent / "make_all.py"
mt = mp.read_text(encoding="utf-8")
if "login_override" not in mt:
    mt = mt.replace(
        "from fixers import apply_fixes",
        "from fixers import apply_fixes\nfrom login_override import LOGIN_VIEW",
    )
    mt = mt.replace(
        "        files[rel] = fix_content(rel, raw, patches)",
        "        if rel == \"views/auth/LoginView.vue\":\n            files[rel] = LOGIN_VIEW\n        else:\n            files[rel] = fix_content(rel, raw, patches)",
    )
    mp.write_text(mt, encoding="utf-8")
    print("make_all login override")
