from pathlib import Path
import re
from login_override import LOGIN_VIEW

p = Path(__file__).resolve().parent / "fixers.py"
t = p.read_text(encoding="utf-8")
# remove broken fix_login block
t = re.sub(r"\ndef fix_login\(c: str\) -> str:.*?(?=\ndef fix_register)", "\n", t, flags=re.S)
# remove fix_login from FIXERS.update in part3 - replace entry
t = t.replace('"views/auth/LoginView.vue": fix_login,', '"views/auth/LoginView.vue": lambda c: LOGIN_VIEW,')
if "from login_override import LOGIN_VIEW" not in t:
    t = "from login_override import LOGIN_VIEW\n" + t
p.write_text(t, encoding="utf-8")
print("repaired fixers.py")
