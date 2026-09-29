import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { gzipSync } from "node:zlib";
import {
  checkSizeLimit,
  formatBytes,
  parseSizeLimit,
} from "./check-size-limit.mjs";

describe("check-size-limit", () => {
  it("parses size limits", () => {
    assert.equal(parseSizeLimit("160 KB"), 160 * 1024);
    assert.equal(parseSizeLimit("50KB"), 50 * 1024);
    assert.equal(parseSizeLimit(1024), 1024);
    assert.equal(parseSizeLimit("100 b"), 100);
    assert.match(formatBytes(1536), /1\.5 KB/);
  });

  it("measures gzip size against budget", () => {
    const root = mkdtempSync(path.join(tmpdir(), "morya-size-"));
    mkdirSync(path.join(root, "dist"), { recursive: true });
    const payload = Buffer.from(
      "export const x = " + JSON.stringify("x".repeat(2000)),
    );
    writeFileSync(path.join(root, "dist/index.js"), payload);
    const gzip = gzipSync(payload, { level: 9 }).length;

    const pass = checkSizeLimit(
      [{ name: "bundle", path: "dist/index.js", limit: gzip + 64 }],
      root,
    );
    assert.equal(pass[0].ok, true);
    assert.equal(pass[0].size, gzip);

    const fail = checkSizeLimit(
      [{ name: "bundle", path: "dist/index.js", limit: Math.max(1, gzip - 1) }],
      root,
    );
    assert.equal(fail[0].ok, false);
  });
});
