"""Capture blog article screenshots from local docs playground."""
from __future__ import annotations

import shutil
from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = "http://localhost:5182"
ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent / "assets"
GOLDEN_SRC = ROOT / "ai-design-config" / "docs" / "golden-pages" / "list-page.vue"
GOLDEN_DST = (
    ROOT
    / "playground"
    / "src"
    / "views"
    / "components-demos-view"
    / "components"
    / "GoldenListShot.vue"
)
VIEWPORT = {"width": 1440, "height": 900}


def wait_ready(page) -> None:
    page.wait_for_load_state("domcontentloaded")
    try:
        page.wait_for_load_state("networkidle", timeout=15000)
    except Exception:
        page.wait_for_timeout(800)
    page.wait_for_timeout(400)


def shot(page, name: str, full_page: bool = False) -> None:
    path = OUT / name
    page.screenshot(path=str(path), full_page=full_page, type="png")
    print(f"wrote {path}")


def ensure_light(page) -> None:
    dark = page.evaluate("() => document.documentElement.getAttribute('data-theme') === 'dark'")
    if dark:
        page.locator(
            "button.site-icon-btn[aria-label*='浅色'], button.site-icon-btn[aria-label*='light']"
        ).first.click()
        page.wait_for_timeout(300)


def ensure_dark(page) -> None:
    dark = page.evaluate("() => document.documentElement.getAttribute('data-theme') === 'dark'")
    if not dark:
        page.locator(
            "button.site-icon-btn[aria-label*='暗'], button.site-icon-btn[aria-label*='Dark']"
        ).first.click()
        page.wait_for_timeout(400)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    created_golden = False
    if not GOLDEN_DST.exists():
        shutil.copyfile(GOLDEN_SRC, GOLDEN_DST)
        created_golden = True
        print(f"temp demo: {GOLDEN_DST}")

    try:
        with sync_playwright() as p:
            # System Chrome — avoids downloading Playwright browsers.
            browser = p.chromium.launch(channel="chrome", headless=True)
            page = browser.new_page(viewport=VIEWPORT, device_scale_factor=1.5)

            page.goto(f"{BASE}/", wait_until="domcontentloaded")
            wait_ready(page)
            ensure_light(page)
            shot(page, "01-docs-home.png")
            shot(page, "cover.png")

            page.goto(f"{BASE}/components", wait_until="domcontentloaded")
            wait_ready(page)
            ensure_light(page)
            shot(page, "02-components-catalog.png")

            page.goto(f"{BASE}/components/Button", wait_until="domcontentloaded")
            wait_ready(page)
            ensure_light(page)
            shot(page, "04-button-preview.png")

            ensure_dark(page)
            wait_ready(page)
            shot(page, "03-theme-dark.png")
            ensure_light(page)

            page.goto(f"{BASE}/components/Table", wait_until="domcontentloaded")
            wait_ready(page)
            ensure_light(page)
            shot(page, "05-table-preview.png")

            page.goto(f"{BASE}/components/Layout", wait_until="domcontentloaded")
            wait_ready(page)
            ensure_light(page)
            shot(page, "06-layout-shell.png")

            page.goto(f"{BASE}/components-demos", wait_until="domcontentloaded")
            wait_ready(page)
            menu_item = page.get_by_text("GoldenListShot", exact=True)
            if menu_item.count():
                menu_item.first.click()
                page.wait_for_timeout(1000)
                container = page.locator(".component-container")
                if container.count():
                    container.first.screenshot(path=str(OUT / "07-golden-list.png"))
                    print(f"wrote {OUT / '07-golden-list.png'}")
                else:
                    shot(page, "07-golden-list.png")
            else:
                print("WARN: GoldenListShot not found, falling back to Layout page")
                page.goto(f"{BASE}/components/Layout", wait_until="domcontentloaded")
                wait_ready(page)
                shot(page, "07-golden-list.png")

            page.goto(f"{BASE}/docs/ai-setup", wait_until="domcontentloaded")
            wait_ready(page)
            ensure_light(page)
            shot(page, "08-ai-setup.png")

            page.goto(f"{BASE}/docs/design-tokens", wait_until="domcontentloaded")
            wait_ready(page)
            ensure_light(page)
            shot(page, "09-tokens.png")

            browser.close()
    finally:
        if created_golden and GOLDEN_DST.exists():
            GOLDEN_DST.unlink()
            print(f"removed temp demo: {GOLDEN_DST}")


if __name__ == "__main__":
    main()
