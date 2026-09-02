from pathlib import Path
import re
p = Path(__file__).resolve().parent / "fixers.py"
t = p.read_text(encoding="utf-8-sig")
if "def fix_login_view" not in t:
    t = t.replace(
        "from login_override import LOGIN_VIEW\n",
        "from login_override import LOGIN_VIEW\n\ndef fix_login_view(c: str) -> str:\n    return LOGIN_VIEW\n\n",
    )
    t = t.replace(
        '"views/auth/LoginView.vue": lambda c: LOGIN_VIEW,',
        '"views/auth/LoginView.vue": fix_login_view,',
    )
p.write_text(t, encoding="utf-8")
print("fixed BOM and login handler")
