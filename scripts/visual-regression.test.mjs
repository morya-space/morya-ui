import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PNG } from "pngjs";
import { comparePng, parseArgs, sha1 } from "./visual-regression.mjs";

function solidPng(width, height, rgba = [0, 0, 0, 255]) {
  const img = new PNG({ width, height });
  for (let i = 0; i < width * height; i += 1) {
    const o = i * 4;
    img.data[o] = rgba[0];
    img.data[o + 1] = rgba[1];
    img.data[o + 2] = rgba[2];
    img.data[o + 3] = rgba[3];
  }
  return PNG.sync.write(img);
}

describe("visual-regression helpers", () => {
  it("parses update flag", () => {
    assert.equal(parseArgs(["--update"]).update, true);
    assert.equal(parseArgs([]).update, false);
  });

  it("hashes and matches identical pngs", () => {
    const a = solidPng(8, 8, [10, 20, 30, 255]);
    const b = solidPng(8, 8, [10, 20, 30, 255]);
    assert.equal(sha1(a).length, 12);
    const result = comparePng(a, b);
    assert.equal(result.ok, true);
    assert.equal(result.diffPixels, 0);
  });

  it("flags size mismatches and large diffs", () => {
    const a = solidPng(8, 8, [0, 0, 0, 255]);
    const b = solidPng(4, 4, [0, 0, 0, 255]);
    const size = comparePng(a, b);
    assert.equal(size.ok, false);
    assert.match(String(size.reason), /size/);

    const c = solidPng(8, 8, [255, 0, 0, 255]);
    const color = comparePng(a, c);
    assert.equal(color.ok, false);
    assert.ok(color.diffPixels > 0);
  });
});
