import assert from "node:assert/strict";
import path from "node:path";
import { describe, it } from "node:test";
import { assertSeoShell, routeHtmlPath } from "./docs-smoke.mjs";

describe("docs-smoke helpers", () => {
  it("builds route html paths", () => {
    assert.equal(
      routeHtmlPath(path.join("/tmp", "dist"), ""),
      path.join("/tmp", "dist", "index.html"),
    );
    assert.equal(
      routeHtmlPath(path.join("/tmp", "dist"), "components/Button"),
      path.join("/tmp", "dist", "components", "Button", "index.html"),
    );
  });

  it("accepts a valid seo shell", () => {
    const html = `<!doctype html>
<html lang="zh-CN">
  <head>
    <title>Button · Morya UI</title>
    <meta name="description" content="Button" />
    <link rel="canonical" href="https://morya-space.github.io/morya-ui/components/Button" />
  </head>
  <body>
    <div id="app">
      <article class="seo-prerender" data-seo-prerender>
        <h1>Button</h1>
        <p>hi</p>
      </article>
    </div>
  </body>
</html>`;
    assert.deepEqual(assertSeoShell(html, "components/Button"), []);
  });

  it("flags missing a11y / seo pieces", () => {
    const html = `<html><head><title></title></head><body><div id="app"></div></body></html>`;
    const errors = assertSeoShell(html, "broken");
    assert.ok(errors.length >= 3);
  });
});
