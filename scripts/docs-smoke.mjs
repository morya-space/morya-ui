/**
 * Docs site smoke + lightweight a11y checks against SEO prerender shells
 * produced by `pnpm build:docs:pages` / `applyDocsSeo`.
 *
 * Checks:
 * - Every collected SEO route has an index.html shell
 * - <title>, meta description, canonical, seo-prerender article + h1
 * - Basic a11y: html[lang], landmark/main/article presence, no empty title
 * - sitemap.xml / robots.txt / llms.txt exist at site root
 *
 * Usage:
 *   node scripts/docs-smoke.mjs
 *   node scripts/docs-smoke.mjs --dist playground/dist
 *   pnpm check:docs-smoke
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { collectDocsSeoPages, SITE_ORIGIN } from "./docs-seo.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

/**
 * @param {string[]} argv
 */
export function parseArgs(argv) {
  /** @type {{ distDir: string }} */
  const opts = {
    distDir: path.join(repoRoot, "playground/dist"),
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dist" && argv[i + 1]) {
      opts.distDir = path.resolve(argv[i + 1]);
      i += 1;
    }
  }
  return opts;
}

/**
 * @param {string} distDir
 * @param {string} routePath
 */
export function routeHtmlPath(distDir, routePath) {
  if (!routePath) return path.join(distDir, "index.html");
  return path.join(distDir, ...routePath.split("/"), "index.html");
}

/**
 * @param {string} html
 * @param {string} label
 */
export function assertSeoShell(html, label) {
  /** @type {string[]} */
  const errors = [];

  if (!/<title>[^<]+<\/title>/i.test(html)) {
    errors.push(`${label}: missing non-empty <title>`);
  }
  if (!/<meta\s+name="description"\s+content="[^"]+"/i.test(html)) {
    errors.push(`${label}: missing meta description`);
  }
  if (!/<link\s+rel="canonical"\s+href="https?:\/\//i.test(html)) {
    errors.push(`${label}: missing absolute canonical`);
  }
  if (!/data-seo-prerender/i.test(html)) {
    errors.push(`${label}: missing seo-prerender article`);
  }
  if (!/<article[^>]*>[\s\S]*?<h1[^>]*>[^<]+<\/h1>/i.test(html)) {
    errors.push(`${label}: missing article > h1`);
  }
  if (!/<html[^>]*\slang=["'][^"']+["']/i.test(html)) {
    errors.push(`${label}: missing html[lang]`);
  }
  // Basic landmark: article or main or role=main
  if (
    !/<article\b/i.test(html) &&
    !/<main\b/i.test(html) &&
    !/role=["']main["']/i.test(html)
  ) {
    errors.push(`${label}: missing landmark (article/main)`);
  }

  return errors;
}

/**
 * @param {string} [distDir]
 */
export function runDocsSmoke(distDir = path.join(repoRoot, "playground/dist")) {
  if (!existsSync(path.join(distDir, "index.html"))) {
    throw new Error(
      `Missing docs dist at ${distDir}. Run: pnpm build:docs:pages`,
    );
  }

  /** @type {string[]} */
  const errors = [];
  const pages = collectDocsSeoPages();

  for (const asset of ["sitemap.xml", "robots.txt", "llms.txt"]) {
    const assetPath = path.join(distDir, asset);
    if (!existsSync(assetPath)) {
      errors.push(`missing site asset: ${asset}`);
      continue;
    }
    const text = readFileSync(assetPath, "utf8");
    if (!text.trim()) errors.push(`empty site asset: ${asset}`);
    if (asset === "robots.txt" && !text.includes("Sitemap:")) {
      errors.push("robots.txt missing Sitemap line");
    }
    if (asset === "sitemap.xml" && !text.includes(SITE_ORIGIN)) {
      errors.push("sitemap.xml missing SITE_ORIGIN");
    }
    if (asset === "llms.txt" && !/^# morya-ui/m.test(text)) {
      errors.push("llms.txt missing # morya-ui heading");
    }
  }

  // Full SEO shell for every collected page (can be 100+; keep fast — no browser).
  for (const page of pages) {
    const htmlPath = routeHtmlPath(distDir, page.routePath);
    const label = page.routePath || "/";
    if (!existsSync(htmlPath)) {
      errors.push(`${label}: missing ${path.relative(repoRoot, htmlPath)}`);
      continue;
    }
    const html = readFileSync(htmlPath, "utf8");
    errors.push(...assertSeoShell(html, label));
  }

  // Spotlight routes: also ensure key interactive SPA shells are present.
  const spotlight = [
    "",
    "docs/quick-start",
    "docs/for-agents",
    "components",
    "components/Button",
    "theme-editor",
    "changelog",
  ];
  for (const routePath of spotlight) {
    const htmlPath = routeHtmlPath(distDir, routePath);
    if (!existsSync(htmlPath)) {
      errors.push(`spotlight missing: ${routePath || "/"}`);
    }
  }

  return {
    pageCount: pages.length,
    errorCount: errors.length,
    errors,
    distDir,
  };
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const result = runDocsSmoke(opts.distDir);
  if (result.errorCount) {
    console.error(`docs-smoke: ${result.errorCount} issue(s)\n`);
    for (const err of result.errors.slice(0, 40)) {
      console.error(`  - ${err}`);
    }
    if (result.errors.length > 40) {
      console.error(`  … and ${result.errors.length - 40} more`);
    }
    process.exitCode = 1;
    return;
  }
  console.log(
    `docs-smoke: ok — ${result.pageCount} SEO shells + sitemap/robots/llms in ${result.distDir}`,
  );
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  try {
    main();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
