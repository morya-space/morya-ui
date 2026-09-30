import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  docsManifestPlugin,
  GUIDE_DOCS_MANIFEST_ID,
} from "./docsManifestPlugin.ts";

const repoRoot = process.cwd();
const guideDir = path.join(repoRoot, "playground/src/docs/guide");

describe("docsManifestPlugin", () => {
  it("builds guide manifest from bare markdown filenames", () => {
    const plugin = docsManifestPlugin(repoRoot, guideDir);
    const code = plugin.load(`\0${GUIDE_DOCS_MANIFEST_ID}`);
    expect(code).toBeTruthy();

    const manifest = new Function(
      `return ${code!.replace("export default ", "")}`,
    )() as Record<string, Record<"zh-CN" | "en-US", Record<string, string>>>;

    expect(Object.keys(manifest).sort()).toEqual([
      "accessibility",
      "agent-skill",
      "ai-setup",
      "attrs",
      "common-props",
      "config",
      "conventions",
      "design",
      "design-color",
      "design-feedback",
      "design-layout",
      "design-spacing",
      "design-tokens",
      "design-typography",
      "for-agents",
      "introduction",
      "learning-path",
      "mcp",
      "motion",
      "quick-start",
      "recipe-admin-layout",
      "recipe-confirm-flow",
      "recipe-form-login",
      "recipe-ssr-nuxt",
      "recipe-table-filter",
      "recipe-theme-customize",
      "setup",
      "ssr",
      "theme",
      "types",
    ]);
    expect(manifest.introduction["zh-CN"].title).toBe("介绍");
    expect(manifest.conventions["zh-CN"].title).toBe("约定");
    expect(manifest["learning-path"]["en-US"].title).toBe("Learning path");
    expect(manifest["recipe-form-login"]["zh-CN"].title).toBe("登录表单");
  });
});
