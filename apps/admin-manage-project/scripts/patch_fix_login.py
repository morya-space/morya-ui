from pathlib import Path
import re
p = Path(__file__).resolve().parent / "fixers.py"
t = p.read_text(encoding="utf-8")
new_fix_login = '''
def fix_login(c: str) -> str:
    return _r(
        c,
        ("summary: '????', detail: '????'", "summary: '登录成功', detail: '欢迎回来'"),
        ("const message = err instanceof Error ? err.message : '????'", "const message = err instanceof Error ? err.message : '登录失败'"),
        ("error.value = '??? MFA ???????123456?'", "error.value = '需要 MFA 验证，演示验证码 123456'"),
        ("summary: '????', life: 2500 })", "summary: '验证成功', life: 2500 })"),
        ("err instanceof Error ? err.message : '????'", "err instanceof Error ? err.message : '验证失败'"),
        ("<h1>???", "<h1>智学云 · 教育管理后台</h1>\\n      <!-- was h1"),
        ("还没有账号？</h1>", ""),
        ("<p>???? admin / admin123", "<p>演示账号 admin / admin123"),
        ("MFA 123456</p>", "· MFA 123456</p>"),
        ("label=\\"MFA ???\\"", "label=\\"MFA 验证码\\""),
        (">?????</WiButton>", ">完成验证</WiButton>"),
        ("{ label: '????', value: 'password' }, { label: '?????', value: 'otp' }]", "{ label: '账号密码', value: 'password' }, { label: '邮箱验证码', value: 'otp' }]"),
        ("<WiFormItem label=\\"??\\" name=\\"account\\"", "<WiFormItem label=\\"账号\\" name=\\"account\\""),
        ("<WiFormItem v-if=\\"tab === 'password'\\" label=\\"??\\"", "<WiFormItem v-if=\\"tab === 'password'\\" label=\\"密码\\""),
        ("<WiFormItem v-else label=\\"?????\\"", "<WiFormItem v-else label=\\"邮箱验证码\\""),
        (">?????</WiButton>", ">获取验证码</WiButton>"),
        (">??</WiButton>", ">登录</WiButton>"),
        ("<p class=\\"login-page__footer\\">\\n        ??????\\n", "<p class=\\"login-page__footer\\">\\n        还没有账号？\\n"),
        (">??</RouterLink>", ">注册</RouterLink>"),
        ("<!-- was h1", ""),
    )
'''
# replace fix_login function
t = re.sub(r"def fix_login\(c: str\) -> str:.*?(?=\ndef fix_register)", new_fix_login + "\n", t, flags=re.S)
p.write_text(t, encoding="utf-8")
print("patched fix_login")
