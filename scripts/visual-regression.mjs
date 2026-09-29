/**
 * Key-component visual regression via Playwright + a tiny Vite fixture app.
 *
 * Baselines are platform-specific (`tests/visual/baselines/<platform>/`) because
 * Chromium font rendering differs across OS. CI compares Linux baselines.
 *
 * Usage:
 *   pnpm test:visual              # compare against baselines
 *   pnpm test:visual:update       # rewrite baselines for this OS
 *   node scripts/visual-regression.mjs --update
 *
 * Requires: pnpm exec playwright install chromium (once)
 */
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const visualRoot = path.join(repoRoot, "tests/visual");
const platform = process.platform;
const baselineDir = path.join(visualRoot, "baselines", platform);
const actualDir = path.join(visualRoot, ".actual");
const diffDir = path.join(visualRoot, ".diff");
const PORT = 5199;
const ORIGIN = `http://127.0.0.1:${PORT}`;

/** Allow tiny antialiasing noise within the same OS. */
const MAX_DIFF_RATIO = 0.01;
const PIXEL_THRESHOLD = 0.1;

const CASES = [
  { name: "button", selector: '[data-case="button"]' },
  { name: "form", selector: '[data-case="form"]' },
  { name: "feedback", selector: '[data-case="feedback"]' },
  { name: "full", selector: "[data-visual-ready]" },
];

/**
 * @param {string[]} argv
 */
export function parseArgs(argv) {
  return {
    update: argv.includes("--update") || process.env.UPDATE_SNAPSHOTS === "1",
  };
}

/**
 * @param {Buffer} buf
 */
export function sha1(buf) {
  return createHash("sha1").update(buf).digest("hex").slice(0, 12);
}

/**
 * @param {Buffer} baselineBuf
 * @param {Buffer} actualBuf
 */
export function comparePng(baselineBuf, actualBuf) {
  const baseline = PNG.sync.read(baselineBuf);
  const actual = PNG.sync.read(actualBuf);
  if (baseline.width !== actual.width || baseline.height !== actual.height) {
    return {
      ok: false,
      diffPixels: Number.POSITIVE_INFINITY,
      totalPixels: baseline.width * baseline.height,
      ratio: 1,
      reason: `size ${baseline.width}x${baseline.height} vs ${actual.width}x${actual.height}`,
      diffPng: null,
    };
  }

  const diff = new PNG({ width: baseline.width, height: baseline.height });
  const diffPixels = pixelmatch(
    baseline.data,
    actual.data,
    diff.data,
    baseline.width,
    baseline.height,
    { threshold: PIXEL_THRESHOLD },
  );
  const totalPixels = baseline.width * baseline.height;
  const ratio = diffPixels / totalPixels;
  return {
    ok: ratio <= MAX_DIFF_RATIO,
    diffPixels,
    totalPixels,
    ratio,
    reason: null,
    diffPng: PNG.sync.write(diff),
  };
}

/**
 * @param {number} ms
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * @param {string} url
 * @param {number} [timeoutMs]
 */
async function waitForServer(url, timeoutMs = 60_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(1500) });
      if (res.ok || res.status === 404) return;
    } catch {
      // retry
    }
    await sleep(400);
  }
  throw new Error(`Visual fixture server did not become ready: ${url}`);
}

/**
 * @param {import('node:child_process').ChildProcessWithoutNullStreams} child
 */
function stopProcess(child) {
  return new Promise((resolve) => {
    if (child.killed || child.exitCode != null) {
      resolve();
      return;
    }
    child.once("exit", () => resolve());
    child.kill("SIGTERM");
    setTimeout(() => {
      if (child.exitCode == null) child.kill("SIGKILL");
    }, 3000).unref?.();
  });
}

async function main() {
  const { update } = parseArgs(process.argv.slice(2));
  mkdirSync(baselineDir, { recursive: true });
  mkdirSync(actualDir, { recursive: true });
  mkdirSync(diffDir, { recursive: true });

  let playwright;
  try {
    playwright = await import("playwright");
  } catch {
    throw new Error(
      "Missing playwright. Install with: pnpm add -D playwright && pnpm exec playwright install chromium",
    );
  }

  const viteBin = path.join(repoRoot, "node_modules", "vite", "bin", "vite.js");
  if (!existsSync(viteBin)) {
    throw new Error(`Missing vite binary at ${viteBin}`);
  }

  const child = spawn(
    process.execPath,
    [
      viteBin,
      "--config",
      path.join("tests", "visual", "vite.config.ts"),
      "--host",
      "127.0.0.1",
      "--port",
      String(PORT),
    ],
    {
      cwd: repoRoot,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, BROWSER: "none" },
      windowsHide: true,
    },
  );

  let serverLog = "";
  child.stdout.on("data", (chunk) => {
    serverLog += String(chunk);
  });
  child.stderr.on("data", (chunk) => {
    serverLog += String(chunk);
  });

  /** @type {string[]} */
  const failures = [];
  let wrote = 0;

  try {
    await waitForServer(ORIGIN);
    const browser = await playwright.chromium.launch({ headless: true });
    const page = await browser.newPage({
      viewport: { width: 1024, height: 1200 },
      deviceScaleFactor: 1,
    });

    await page.goto(`${ORIGIN}/`, { waitUntil: "networkidle" });
    await page.waitForSelector("[data-visual-ready]", { timeout: 30_000 });
    await page.waitForTimeout(300);

    for (const item of CASES) {
      const locator = page.locator(item.selector).first();
      await locator.waitFor({ state: "visible", timeout: 15_000 });
      const png = await locator.screenshot({ animations: "disabled" });
      const actualPath = path.join(actualDir, `${item.name}.png`);
      writeFileSync(actualPath, png);

      const baselinePath = path.join(baselineDir, `${item.name}.png`);
      if (update || !existsSync(baselinePath)) {
        writeFileSync(baselinePath, png);
        wrote += 1;
        console.log(
          `  [WRITE] ${platform}/${item.name}.png (${sha1(png)}) ${update ? "updated" : "created"}`,
        );
        continue;
      }

      const baseline = readFileSync(baselinePath);
      const result = comparePng(baseline, png);
      if (result.ok) {
        console.log(
          `  [PASS]  ${platform}/${item.name}.png (diff ${(result.ratio * 100).toFixed(3)}%)`,
        );
        continue;
      }

      const diffPath = path.join(diffDir, `${item.name}.png`);
      if (result.diffPng) writeFileSync(diffPath, result.diffPng);
      else writeFileSync(diffPath, png);
      failures.push(
        `${item.name}: ${result.reason || `diff ${(result.ratio * 100).toFixed(3)}% (${result.diffPixels}/${result.totalPixels})`}`,
      );
      console.log(`  [FAIL]  ${platform}/${item.name}.png`);
    }

    await browser.close();
  } finally {
    await stopProcess(child);
  }

  if (failures.length) {
    console.error(
      `\nvisual-regression: ${failures.length} mismatch(es) on ${platform}`,
    );
    for (const fail of failures) console.error(`  - ${fail}`);
    console.error(
      "Update with: pnpm test:visual:update (commit tests/visual/baselines/<platform>/)",
    );
    if (serverLog.trim()) {
      console.error("\n--- vite log (tail) ---");
      console.error(serverLog.trim().split(/\r?\n/).slice(-20).join("\n"));
    }
    process.exitCode = 1;
    return;
  }

  const baselineCount = readdirSync(baselineDir).filter((name) =>
    name.endsWith(".png"),
  ).length;
  console.log(
    `\nvisual-regression: ok — ${CASES.length} case(s) on ${platform}, ${baselineCount} baseline(s)${wrote || update ? " (updated)" : ""}`,
  );
}

const isDirectRun =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
