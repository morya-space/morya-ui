"""Capture morya-admin screenshots used in the blog article."""
from __future__ import annotations

from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = "http://localhost:5173"
OUT = Path(__file__).resolve().parent / "assets"
VIEWPORT = {"width": 1440, "height": 900}


def wait_ready(page, extra_ms: int = 400) -> None:
    page.wait_for_load_state("domcontentloaded")
    try:
        page.wait_for_load_state("networkidle", timeout=15000)
    except Exception:
        page.wait_for_timeout(800)
    page.wait_for_timeout(extra_ms)


def shot(page, name: str) -> None:
    path = OUT / name
    page.screenshot(path=str(path), full_page=False, type="png")
    print(f"wrote {path}")


def ensure_light(page) -> None:
    dark = page.evaluate("() => document.documentElement.getAttribute('data-theme') === 'dark'")
    if dark:
        # Best-effort: look for a theme toggle button by aria-label
        btn = page.locator(
            "button[aria-label*='浅色'], button[aria-label*='light'], button[aria-label*='切换']"
        ).first
        try:
            btn.click(timeout=2000)
            page.wait_for_timeout(300)
        except Exception:
            pass


def login(page) -> None:
    page.goto(f"{BASE}/login", wait_until="domcontentloaded")
    wait_ready(page, 600)
    # Inputs are prefilled (admin / 123456); just click the primary submit button.
    submit = page.locator("button[type='submit'], button:has-text('登录')").first
    submit.click()
    page.wait_for_url("**/dashboard**", timeout=10000)
    wait_ready(page, 800)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        context = browser.new_context(viewport=VIEWPORT, device_scale_factor=1.5)
        page = context.new_page()

        # 1. Login page (unauthenticated)
        page.goto(f"{BASE}/login", wait_until="domcontentloaded")
        wait_ready(page, 800)
        ensure_light(page)
        shot(page, "10-admin-login.png")

        # 2. Sign in
        login(page)
        ensure_light(page)

        # 3. Dashboard
        page.goto(f"{BASE}/dashboard", wait_until="domcontentloaded")
        wait_ready(page, 1000)
        shot(page, "11-admin-dashboard.png")

        # 4. User management
        page.goto(f"{BASE}/system/user", wait_until="domcontentloaded")
        wait_ready(page, 1000)
        shot(page, "12-admin-users.png")

        # 5. Order management
        page.goto(f"{BASE}/business/order", wait_until="domcontentloaded")
        wait_ready(page, 1000)
        shot(page, "13-admin-orders.png")

        # 6. Layout settings drawer — header has a button with aria-label="布局设置"
        page.goto(f"{BASE}/dashboard", wait_until="domcontentloaded")
        wait_ready(page, 600)
        settings_btn = page.locator("button[aria-label='布局设置']").first
        settings_btn.click(timeout=5000)
        page.wait_for_timeout(700)
        shot(page, "14-admin-settings.png")

        browser.close()


if __name__ == "__main__":
    main()
