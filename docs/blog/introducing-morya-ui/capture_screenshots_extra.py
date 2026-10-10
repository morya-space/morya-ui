"""Capture extra docs-site screenshots missing from the main script."""
from __future__ import annotations

from pathlib import Path

from playwright.sync_api import sync_playwright

BASE = "http://localhost:5182"
OUT = Path(__file__).resolve().parent / "assets"
VIEWPORT = {"width": 1440, "height": 900}


def wait_ready(page) -> None:
    page.wait_for_load_state("domcontentloaded")
    try:
        page.wait_for_load_state("networkidle", timeout=15000)
    except Exception:
        page.wait_for_timeout(800)
    page.wait_for_timeout(400)


def shot(page, name: str) -> None:
    path = OUT / name
    page.screenshot(path=str(path), full_page=False, type="png")
    print(f"wrote {path}")


def ensure_light(page) -> None:
    dark = page.evaluate("() => document.documentElement.getAttribute('data-theme') === 'dark'")
    if dark:
        page.locator(
            "button.site-icon-btn[aria-label*='浅色'], button.site-icon-btn[aria-label*='light']"
        ).first.click()
        page.wait_for_timeout(300)


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        page = browser.new_page(viewport=VIEWPORT, device_scale_factor=1.5)

        for url, name in [
            ("/docs/theme", "03-theme-docs.png"),
            ("/docs/agent-mcp", "08-mcp.png"),
            ("/docs/mcp", "08-mcp.png"),
        ]:
            try:
                page.goto(f"{BASE}{url}", wait_until="domcontentloaded")
                wait_ready(page)
                ensure_light(page)
                # Skip 404-ish pages: heuristic — page title contains "404" / "不存在"
                title = page.title()
                if "404" in title or "不存在" in title:
                    print(f"skip {url}: looks like 404 ({title})")
                    continue
                shot(page, name)
                print(f"ok {url} -> {name}")
                if name == "08-mcp.png":
                    break
            except Exception as exc:  # noqa: BLE001
                print(f"fail {url}: {exc}")

        browser.close()


if __name__ == "__main__":
    main()
