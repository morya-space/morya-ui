import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const srcDir = "D:/Users/chenw/Downloads";
const outDir = path.join(root, "src/components/Empty/illustrations");

const files = {
  "暂无相关内容.svg": "no-content",
  "搜索结果�?svg": "no-result",
  "没有新消�?svg": "no-message",
  "没有日程.svg": "no-schedule",
  "没有问题.svg": "no-issue",
  "网络出错.svg": "network-error",
  "服务器错�?svg": "server-error",
  "开发中.svg": "building",
  "客户流失率高.svg": "churn-high",
  "营销转化率低.svg": "conversion-low",
  "客户活跃度低.svg": "activity-low",
  "客户画像不清�?svg": "profile-unclear",
  "客户录入不规�?svg": "input-irregular",
  "销售回款周期长.svg": "payment-cycle-long",
};

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function cleanSvg(raw) {
  let s = raw
    .replace(/<\?xml[^>]*>/i, "")
    .replace(/<!DOCTYPE[^>]*>/i, "")
    .replace(
      /\s+(?:node-id|sillyvg|template-height|template-width|group-id|target-height|target-width|target-x|target-y)="[^"]*"/gi,
      "",
    );

  const refIds = new Set();
  for (const match of s.matchAll(/url\(#([^)]+)\)/g)) refIds.add(match[1]);
  for (const match of s.matchAll(/(?:xlink:href|href)="#([^"]+)"/g)) {
    refIds.add(match[1]);
  }

  const map = new Map();
  let index = 0;
  for (const id of refIds) {
    map.set(id, `__MID_${index++}__`);
  }

  s = s.replace(/\sid="([^"]+)"/g, (_full, id) => {
    if (map.has(id)) return ` id="${map.get(id)}"`;
    if (/^[\d,]+$/.test(id) || /[\u4e00-\u9fff]/.test(id) || id.includes(",")) {
      return "";
    }
    const next = `__MID_${index++}__`;
    map.set(id, next);
    return ` id="${next}"`;
  });

  for (const [from, to] of map) {
    const esc = escapeRegExp(from);
    s = s.replace(new RegExp(`url\\(#${esc}\\)`, "g"), `url(#${to})`);
    s = s.replace(
      new RegExp(`(xlink:href|href)="#${esc}"`, "g"),
      `$1="#${to}"`,
    );
  }

  const needsXlink = /xlink:/.test(s);
  s = s.replace(/<svg\b([^>]*)>/i, (_full, attrs) => {
    const viewBox = (attrs.match(/viewBox="([^"]+)"/i) || [])[1];
    const width = (attrs.match(/\bwidth="([^"]+)"/i) || [])[1];
    const height = (attrs.match(/\bheight="([^"]+)"/i) || [])[1];
    const vb =
      viewBox || (width && height ? `0 0 ${width} ${height}` : "0 0 250 120");
    return needsXlink
      ? `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${vb}" fill="none" aria-hidden="true" focusable="false">`
      : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" fill="none" aria-hidden="true" focusable="false">`;
  });

  return s.replace(/>\s+</g, "><").trim();
}

fs.mkdirSync(outDir, { recursive: true });

const catalog = [];
for (const [file, key] of Object.entries(files)) {
  const raw = fs.readFileSync(path.join(srcDir, file), "utf8");
  const cleaned = cleanSvg(raw);
  const outFile = path.join(outDir, `${key}.svg`);
  fs.writeFileSync(outFile, `${cleaned}\n`, "utf8");
  catalog.push({ key, file: `${key}.svg`, bytes: Buffer.byteLength(cleaned) });
  console.log("wrote", key, cleaned.length);
}

fs.writeFileSync(
  path.join(outDir, "_manifest.json"),
  `${JSON.stringify(catalog, null, 2)}\n`,
);

const { spawnSync } = await import("node:child_process");
const generated = spawnSync(
  process.execPath,
  [path.join(__dirname, "generate-result-illustration-catalog.mjs")],
  { stdio: "inherit" },
);
if (generated.status) process.exit(generated.status);

console.log("done", catalog.length);
