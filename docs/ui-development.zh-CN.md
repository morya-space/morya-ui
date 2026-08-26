# UI 包开发

[English](./ui-development.md) · [中文](./ui-development.zh-CN.md)

`@well-insight/ui` 维护者说明（构建、文档站、发版）。外部引用方请看 [根 README（中文）](../README.zh-CN.md)；贡献环境见 [DEVELOPMENT.zh-CN.md](./DEVELOPMENT.zh-CN.md)。

## 构建

```bash
pnpm build
```

产物在 `dist/`（`index.js`、`index.d.ts`、`styles.css`、`resolver.js`，以及每个组件的 kebab-case 子路径如 `button/index.js`）。`@well-insight/ui/button` 会带上该组件及其依赖的 JS 与样式。

构建流程（`pnpm build`）会自动执行：

1. `scripts/prepare-on-demand.mjs` — 生成各组件 `style.ts` 并在 `index.ts` 注入样式 side-effect  
2. `scripts/generate-exports.mjs` — 同步 `package.json` 的 `exports` / `sideEffects` 与 `src/resolver-map.ts`  
3. `vite build` — 全量入口 + `resolver`  
4. `vite build --mode on-demand` — 各组件独立 chunk  
5. `scripts/emit-style-entries.mjs` — 输出 `dist/<slug>/style.js` 与 `style.css`

组件样式写在 `src/components/<Name>/styles.css`，由 `src/styles/index.css` `@import` 聚合。主题 token 仍在 `src/theme/styles.css`。

### 全量 vs 按需（构建层面）

- **全量入口**（`src/index.ts` → `dist/index.js`）：直接从各 `.vue`  re-export，不经过组件 `index.ts`，避免把按需样式 side-effect 打进主包；配合 `@well-insight/ui/styles.css` 使用。
- **按需入口**（`src/components/<Name>/index.ts` → `dist/<slug>/index.js`）：独立 chunk，自动 `import './style'`，带上 theme、base 与依赖组件 CSS。

两种产物由同一次 `pnpm build` 生成，互不冲突。

## 文档站

```bash
pnpm dev          # http://localhost:5182
pnpm build:docs
pnpm preview
```

组件文档：`src/components/*/docs/index.md` 与 `index.en.md`。更新日志页读取根目录 `CHANGELOG.md` / `CHANGELOG.en.md`。

## 仅发布到 npm

不写 CHANGELOG、不打 tag；先改好 `version`：

```bash
pnpm release:npm
```

## 完整发版

分步执行或一键编排，详见 [scripts/README.md](../scripts/README.md)。默认同时发布 `@well-insight/ui` 与 `@well-insight/ui-mcp`：

```bash
pnpm release:prepare -- --dry-run   # 预览
pnpm release:prepare                # 写版本与 CHANGELOG（含 MCP 版本同步）
pnpm release:build                  # UI + MCP
pnpm release:commit                 # 提交 release 文件
# … branch / publish / tag / push

pnpm release                        # 一键跑完全部步骤（含 MCP）
pnpm release -- --no-push           # 本地发版，不 push
pnpm release -- --no-mcp            # 只发 UI
```

发布前检查：`version` 与 CHANGELOG 一致；`build` / `typecheck` / `test` 通过；`files` 包含 `dist` 与 `CHANGELOG.md`；peer 为 `vue`。

## MCP 包

`@well-insight/ui-mcp` 为可选 stdio 服务，供支持 [MCP](https://modelcontextprotocol.io/) 的客户端检索文档（不替代安装 `@well-insight/ui`）。对外说明见文档站 [MCP](/docs/mcp)；实现见 [packages/ui-mcp/README.md](../packages/ui-mcp/README.md)。

完整 UI 发版已包含 MCP。仅需单独重发 MCP 时：

```bash
pnpm mcp:build
pnpm release:mcp -- --dry-run
pnpm release:mcp
```
