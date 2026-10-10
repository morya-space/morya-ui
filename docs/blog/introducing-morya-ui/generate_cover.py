"""Generate a Juejin cover image (1200x675) for the Morya UI blog post.

Renders a minimal HTML template via headless Chromium (Playwright) and saves a
screenshot to ``assets/cover-juejin.png``.

Usage:
    python generate_cover.py
"""

from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
OUT = HERE / "assets" / "cover-juejin.png"

LOGO_SVG = """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none" role="img" aria-label="Morya UI">
  <defs>
    <linearGradient id="m-bg" x1="24" y1="8" x2="104" y2="120" gradientUnits="userSpaceOnUse">
      <stop stop-color="#3b82f6"/>
      <stop offset="1" stop-color="#1d4ed8"/>
    </linearGradient>
    <linearGradient id="m-mark" x1="36" y1="36" x2="92" y2="92" gradientUnits="userSpaceOnUse">
      <stop stop-color="#fff" stop-opacity=".98"/>
      <stop offset="1" stop-color="#fff" stop-opacity=".82"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="28" fill="url(#m-bg)"/>
  <path
    fill="url(#m-mark)"
    d="M28 88 40.5 42h10.2l5.8 24.6L62.3 42h10l5.9 24.6L84 42h10.2L106 88h-11.4L83.6 56.8 77.8 88h-9.9l-5.8-31.2L56.3 88H44.9L39.4 56.8 28 88Z"
  />
</svg>
"""

HTML = f"""
<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<style>
  * {{ margin: 0; padding: 0; box-sizing: border-box; }}
  html, body {{
    width: 1200px; height: 675px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
      "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
    -webkit-font-smoothing: antialiased;
  }}
  body {{
    background: linear-gradient(135deg, #1677ff 0%, #0958d9 100%);
    color: #fff;
    position: relative;
    overflow: hidden;
  }}

  /* grid pattern */
  body::before {{
    content: "";
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse at center, black 40%, transparent 75%);
  }}

  /* soft radial highlight */
  body::after {{
    content: "";
    position: absolute;
    width: 900px; height: 900px;
    top: -350px; right: -250px;
    background: radial-gradient(circle, rgba(255,255,255,0.14), transparent 65%);
    pointer-events: none;
  }}

  /* left content */
  .content {{
    position: absolute;
    left: 100px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    max-width: 520px;
  }}

  .logo-row {{
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 32px;
  }}
  .logo {{
    width: 72px; height: 72px;
    border-radius: 18px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    flex-shrink: 0;
  }}
  .logo svg {{
    display: block;
    width: 100%; height: 100%;
    border-radius: 18px;
  }}
  .version {{
    font-size: 18px;
    color: rgba(255,255,255,0.75);
    font-weight: 500;
    letter-spacing: 0.02em;
  }}

  h1 {{
    font-size: 84px;
    font-weight: 700;
    letter-spacing: -0.04em;
    line-height: 1.05;
    color: #fff;
    margin-bottom: 20px;
  }}

  .tagline {{
    font-size: 26px;
    font-weight: 400;
    color: rgba(255,255,255,0.88);
    letter-spacing: 0.01em;
    line-height: 1.5;
  }}

  /* floating component cards on the right */
  .components {{
    position: absolute;
    right: 60px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 5;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }}

  .comp-card {{
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 12px;
    padding: 16px 20px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    display: flex;
    align-items: center;
    gap: 12px;
  }}

  .comp-card.primary-btn {{
    width: fit-content;
    margin-left: auto;
  }}
  .btn-primary {{
    background: rgba(255,255,255,0.95);
    color: #1677ff;
    border: none;
    padding: 10px 24px;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
  }}

  .comp-card.input-field {{
    width: 320px;
  }}
  .input {{
    flex: 1;
    background: rgba(255,255,255,0.95);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 14px;
    color: #333;
  }}
  .input::placeholder {{
    color: #999;
  }}

  .comp-card.tags {{
    gap: 8px;
  }}
  .tag {{
    background: rgba(255,255,255,0.2);
    color: #fff;
    padding: 5px 12px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: 500;
    border: 1px solid rgba(255,255,255,0.25);
  }}
  .tag.success {{ background: rgba(82,196,26,0.3); border-color: rgba(82,196,26,0.4); }}
  .tag.warning {{ background: rgba(250,173,20,0.3); border-color: rgba(250,173,20,0.4); }}
  .tag.error {{ background: rgba(255,77,79,0.3); border-color: rgba(255,77,79,0.4); }}

  .comp-card.progress {{
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    width: 280px;
  }}
  .progress-bar {{
    height: 6px;
    background: rgba(255,255,255,0.2);
    border-radius: 3px;
    overflow: hidden;
  }}
  .progress-fill {{
    height: 100%;
    background: rgba(255,255,255,0.9);
    border-radius: 3px;
  }}
  .progress-label {{
    font-size: 12px;
    color: rgba(255,255,255,0.8);
    font-weight: 500;
  }}

  .comp-card.color-picker {{
    gap: 10px;
  }}
  .color-swatch {{
    width: 32px; height: 32px;
    border-radius: 6px;
    border: 2px solid rgba(255,255,255,0.3);
    cursor: pointer;
  }}

  /* decorative orbs */
  .orb {{
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,255,255,0.15), transparent 70%);
    pointer-events: none;
  }}
  .orb-1 {{ width: 300px; height: 300px; top: 10%; left: 5%; }}
  .orb-2 {{ width: 200px; height: 200px; bottom: 15%; right: 30%; }}
</style>
</head>
<body>
  <div class="orb orb-1"></div>
  <div class="orb orb-2"></div>

  <div class="content">
    <div class="logo-row">
      <div class="logo">{LOGO_SVG}</div>
      <div class="version">v0.4.3</div>
    </div>
    <h1>Morya UI</h1>
    <p class="tagline">开源 Vue 3 组件库<br>107 个组件 · TypeScript · 主题定制</p>
  </div>

  <div class="components">
    <div class="comp-card primary-btn">
      <button class="btn-primary">Primary Button</button>
    </div>

    <div class="comp-card input-field">
      <input class="input" placeholder="请输入内容..." />
    </div>

    <div class="comp-card tags">
      <span class="tag success">Success</span>
      <span class="tag warning">Warning</span>
      <span class="tag error">Error</span>
    </div>

    <div class="comp-card progress">
      <div class="progress-label">Loading... 68%</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: 68%"></div>
      </div>
    </div>

    <div class="comp-card color-picker">
      <div class="color-swatch" style="background: #1677ff"></div>
      <div class="color-swatch" style="background: #7c3aed"></div>
      <div class="color-swatch" style="background: #52c41a"></div>
      <div class="color-swatch" style="background: #ea580c"></div>
    </div>
  </div>
</body>
</html>
"""


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        context = browser.new_context(
            viewport={"width": 1200, "height": 675},
            device_scale_factor=2,
            color_scheme="light",
        )
        page = context.new_page()
        page.set_content(HTML, wait_until="networkidle")
        page.wait_for_timeout(200)
        page.screenshot(path=str(OUT), full_page=False)
        browser.close()
    print(f"wrote {OUT}")


if __name__ == "__main__":
    main()
