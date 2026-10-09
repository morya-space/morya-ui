import assert from "node:assert/strict";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  absoluteUrl,
  buildLlmsTxt,
  buildRobotsTxt,
  buildSitemapXml,
  englishDocPath,
  injectSeoIntoHtml,
  parseYamlFrontmatter,
  prepareMarkdownBody,
  resolveLlmsMeta,
  SITE_ORIGIN,
} from "./docs-seo.mjs";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

function closeTag(name) {
  return "<" + "/" + name + ">";
}

describe("docs-seo", () => {
  it("parses frontmatter and strips preview fences", () => {
    const raw = `---
title: Button
description: trigger actions
---

# Button

hello

\`\`\`vue preview src="./demos/Basic.vue"
\`\`\`

more
`;
    assert.deepEqual(parseYamlFrontmatter(raw), {
      title: "Button",
      description: "trigger actions",
    });
    const body = prepareMarkdownBody(raw);
    assert.match(body, /hello/);
    assert.match(body, /more/);
    assert.equal(body.includes("preview"), false);
  });

  it("injects meta and seo body into spa shell", () => {
    const html = [
      "<!doctype html>",
      "<html>",
      "  <head>",
      "    <meta",
      '      name="description"',
      '      content="old"',
      "    />",
      '    <meta property="og:title" content="old" />',
      '    <link rel="canonical" href="https://example.com/" />',
      "    <title>Old" + closeTag("title"),
      "  " + closeTag("head"),
      "  <body>",
      '    <div id="app"></div>',
      "  " + closeTag("body"),
      closeTag("html"),
    ].join("\n");

    const next = injectSeoIntoHtml(html, {
      title: "Quick start · Morya UI",
      description: "Install and use Morya UI",
      canonical: `${SITE_ORIGIN}/docs/quick-start`,
      bodyHtml: "<p>Install</p>",
    });

    assert.match(next, /Quick start · Morya UI/);
    assert.match(next, /Install and use Morya UI/);
    assert.match(next, new RegExp(`${SITE_ORIGIN}/docs/quick-start`));
    assert.match(next, /data-seo-prerender/);
    assert.match(next, /<p>Install<\/p>/);
  });

  it("builds sitemap and robots", () => {
    const sitemap = buildSitemapXml([
      "",
      "docs/quick-start",
      "components/Button",
    ]);
    assert.match(sitemap, new RegExp(`<loc>${absoluteUrl(SITE_ORIGIN, "")}`));
    assert.match(sitemap, new RegExp(`<loc>${SITE_ORIGIN}/docs/quick-start`));
    assert.match(
      buildRobotsTxt(),
      new RegExp(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`),
    );
  });

  it("builds llms.txt index", () => {
    const txt = buildLlmsTxt([
      {
        routePath: "docs/quick-start",
        title: "快速上手 · Morya UI",
        description: "安装依赖",
        llmsTitle: "Quick start",
        llmsDescription: "Install morya-ui",
      },
      {
        routePath: "docs/for-agents",
        title: "面向 Agent · Morya UI",
        description: "Agent 入口",
        llmsTitle: "For agents",
        llmsDescription: "Agent entry",
      },
      {
        routePath: "components/Button",
        title: "Button · Morya UI",
        description: "按钮用于触发即时动作。",
        llmsTitle: "Button",
        llmsDescription: "Trigger actions",
      },
      {
        routePath: "theme-editor",
        title: "Theme editor · Morya UI",
        description: "Live theme editor",
      },
    ]);
    assert.match(txt, /^# morya-ui/m);
    assert.match(txt, /`type`/);
    assert.match(txt, new RegExp(`${SITE_ORIGIN}/docs/quick-start`));
    assert.match(txt, /\[Quick start\]/);
    assert.match(txt, /Install morya-ui/);
    assert.equal(txt.includes("快速上手"), false);
    assert.match(txt, /Trigger actions/);
    assert.match(txt, new RegExp(`${SITE_ORIGIN}/llms.txt`));
    assert.match(txt, /components\/Button/);
  });

  it("resolves English doc path and llms meta", () => {
    assert.equal(
      englishDocPath("playground/src/docs/guide/quick-start.md"),
      "playground/src/docs/guide/quick-start.en.md",
    );
    assert.equal(
      englishDocPath("src/components/Button/docs/index.md"),
      "src/components/Button/docs/index.en.md",
    );

    const guideMeta = resolveLlmsMeta(
      path.join(repoRoot, "playground/src/docs/guide/quick-start.md"),
      { title: "快速上手", description: "安装依赖" },
    );
    assert.equal(guideMeta.title, "Quick start");
    assert.match(guideMeta.description, /Install/);

    const buttonMeta = resolveLlmsMeta(
      path.join(repoRoot, "src/components/Button/docs/index.md"),
      { title: "Button", description: "按钮用于触发即时动作。" },
    );
    assert.equal(buttonMeta.title, "Button");
    assert.match(buttonMeta.description, /Button triggers/);
  });
});
