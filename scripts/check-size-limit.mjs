/**
 * Bundle size gate for dist/ artifacts (antd-style size budget, zero deps).
 *
 * Reads `.size-limit.json` entries:
 *   { name, path, limit: "160 KB" | "160KB" | bytes number, gzip?: true }
 *
 * Usage:
 *   node scripts/check-size-limit.mjs
 *   pnpm check:size
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const configPath = path.join(repoRoot, ".size-limit.json");

/**
 * @param {string | number} limit
 * @returns {number} bytes
 */
export function parseSizeLimit(limit) {
  if (typeof limit === "number" && Number.isFinite(limit)) return limit;
  const raw = String(limit).trim();
  const match = raw.match(/^([\d.]+)\s*(b|byte|bytes|kb|kib|mb|mib)?$/i);
  if (!match) {
    throw new Error(`Invalid size limit: ${JSON.stringify(limit)}`);
  }
  const value = Number(match[1]);
  const unit = (match[2] || "b").toLowerCase();
  if (unit === "kb" || unit === "kib") return Math.round(value * 1024);
  if (unit === "mb" || unit === "mib") return Math.round(value * 1024 * 1024);
  return Math.round(value);
}

/**
 * @param {number} bytes
 */
export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * @param {{ path: string, gzip?: boolean }} entry
 * @param {string} [root]
 */
export function measureEntry(entry, root = repoRoot) {
  const filePath = path.resolve(root, entry.path);
  if (!existsSync(filePath)) {
    throw new Error(`Missing build artifact: ${entry.path} (run pnpm build first)`);
  }
  const raw = readFileSync(filePath);
  const size = entry.gzip === false ? raw.length : gzipSync(raw, { level: 9 }).length;
  return { filePath, raw: raw.length, size };
}

/**
 * @param {unknown} config
 * @param {string} [root]
 */
export function checkSizeLimit(config, root = repoRoot) {
  if (!Array.isArray(config) || config.length === 0) {
    throw new Error("size-limit config must be a non-empty array");
  }

  /** @type {{ name: string, path: string, limit: string, ok: boolean, size: number, max: number, ratio: number }[]} */
  const results = [];

  for (const item of config) {
    if (!item || typeof item !== "object") continue;
    const entry = /** @type {{ name?: string, path?: string, limit?: string | number, gzip?: boolean }} */ (
      item
    );
    if (!entry.path || entry.limit == null) {
      throw new Error(`Invalid size-limit entry: ${JSON.stringify(item)}`);
    }
    const max = parseSizeLimit(entry.limit);
    const measured = measureEntry(
      { path: entry.path, gzip: entry.gzip !== false },
      root,
    );
    const ok = measured.size <= max;
    results.push({
      name: entry.name || entry.path,
      path: entry.path,
      limit: typeof entry.limit === "number" ? formatBytes(entry.limit) : String(entry.limit),
      ok,
      size: measured.size,
      max,
      ratio: measured.size / max,
    });
  }

  return results;
}

function main() {
  if (!existsSync(configPath)) {
    throw new Error(`Missing ${path.relative(repoRoot, configPath)}`);
  }
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  const results = checkSizeLimit(config);
  let failed = 0;

  console.log("size-limit (gzip unless noted):\n");
  for (const row of results) {
    const mark = row.ok ? "PASS" : "FAIL";
    const pct = `${Math.round(row.ratio * 100)}%`;
    console.log(
      `  [${mark}] ${row.name}: ${formatBytes(row.size)} / ${row.limit} (${pct})  (${row.path})`,
    );
    if (!row.ok) failed += 1;
  }

  if (failed) {
    console.error(`\nsize-limit: ${failed} budget(s) exceeded`);
    process.exitCode = 1;
    return;
  }
  console.log(`\nsize-limit: ${results.length} check(s) passed`);
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
