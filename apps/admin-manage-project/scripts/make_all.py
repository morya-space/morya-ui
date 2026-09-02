# -*- coding: utf-8 -*-
import json
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT = SCRIPT_DIR.parent / "src"

RELS = [
    "layouts/AdminLayout.vue",
    "views/academic/BatchOpsView.vue",
    "views/academic/ClassesView.vue",
    "views/academic/CoursesView.vue",
    "views/academic/EnrollmentFormView.vue",
    "views/academic/StudentsView.vue",
    "views/academic/TeachersView.vue",
    "views/academic/WorkflowView.vue",
    "views/security/UsersView.vue",
    "views/security/RolesView.vue",
    "views/security/PermissionsView.vue",
    "views/security/DataScopeView.vue",
    "views/security/AuditLogsView.vue",
    "views/system/MessageCenterView.vue",
    "views/system/SchedulerView.vue",
    "views/system/DictionaryView.vue",
    "views/analytics/ReportsView.vue",
    "views/analytics/ErrorMonitorView.vue",
    "views/extras/RecycleBinView.vue",
    "views/auth/LoginView.vue",
    "views/auth/RegisterView.vue",
    "views/dashboard/DashboardView.vue",
]

from data_admin import ADMIN_LAYOUT
from fixers import apply_fixes
from login_override import LOGIN_VIEW

def decode_vue_unicode(text: str) -> str:
    import re
    def repl(m):
        return chr(int(m.group(1), 16))
    return re.sub(r"\\u([0-9a-fA-F]{4})", repl, text)

def load_patches():
    p = SCRIPT_DIR / "patches.json"
    if not p.exists():
        return {}
    raw = json.loads(p.read_text(encoding="utf-8", errors="replace"))
    return {k: [tuple(x) for x in v] for k, v in raw.items()}

def fix_content(rel: str, content: str, patches) -> str:
    if rel == "layouts/AdminLayout.vue":
        return decode_vue_unicode(ADMIN_LAYOUT)
    out = apply_fixes(rel, content)
    for old, new in patches.get(rel, []):
        out = out.replace(old, new)
    return out

def main():
    patches = load_patches()
    files = {}
    for rel in RELS:
        raw = (ROOT / rel).read_text(encoding="utf-8", errors="replace")
        if rel == "views/auth/LoginView.vue":
            files[rel] = LOGIN_VIEW
        else:
            files[rel] = fix_content(rel, raw, patches)

    mjs_path = SCRIPT_DIR / "rewrite-all-vue-utf8.mjs"
    body = "import { writeFileSync, mkdirSync } from 'node:fs'\n"
    body += "import { dirname, join } from 'node:path'\n"
    body += "import { fileURLToPath } from 'node:url'\n\n"
    body += "const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'src')\n\n"
    body += f"const files = {json.dumps(files, ensure_ascii=False, indent=2)}\n\n"
    body += "for (const [rel, content] of Object.entries(files)) {\n"
    body += "  const target = join(root, rel)\n"
    body += "  mkdirSync(dirname(target), { recursive: true })\n"
    body += "  writeFileSync(target, content, 'utf8')\n"
    body += "  console.log('wrote', rel)\n"
    body += "}\n"
    mjs_path.write_text(body, encoding="utf-8")
    print("wrote", mjs_path)

if __name__ == "__main__":
    main()
