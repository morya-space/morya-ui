# UI 包开发

[English](./ui-development.md) · [中文](./ui-development.zh-CN.md)

`morya-ui` 维护者说明（构建、文档站、发版）。外部引用方请看 [根 README（中文）](../README.zh-CN.md)；贡献环境见 [DEVELOPMENT.zh-CN.md](./DEVELOPMENT.zh-CN.md)。

## 构建

```bash
pnpm build
```

产物在 `dist/`（`index.js`、`index.d.ts`、`styles.css`、`resolver.js`，以及每个组件的 kebab-case 子路径如 `button/index.js`）。`morya-ui/button` 会带上该组件及其依赖的 JS 与样式。

构建流程（`pnpm build`）会自动执行：

1. `scripts/prepare-on-demand.mjs` — 生成各组件 `style.ts` 并在 `index.ts` 注入样式 side-effect  
2. `scripts/generate-exports.mjs` — 同步 `package.json` 的 `exports` / `sideEffects` 与 `src/resolver-map.ts`  
3. `vite build` — 全量入口 + `resolver`  
4. `vite build --mode on-demand` — 各组件独立 chunk  
5. `scripts/emit-style-entries.mjs` — 输出 `dist/<slug>/style.js` 与 `style.css`

组件样式写在 `src/components/<Name>/styles.css`，由 `src/styles/index.css` `@import` 聚合。主题 token 仍在 `src/theme/styles.css`。

### 全量 vs 按需（构建层面）

- **全量入口**（`src/index.ts` → `dist/index.js`）：直接从各 `.vue`  re-export，不经过组件 `index.ts`，避免把按需样式 side-effect 打进主包；配合 `morya-ui/styles.css` 使用。
- **按需入口**（`src/components/<Name>/index.ts` → `dist/<slug>/index.js`）：独立 chunk，自动 `import './style'`，带上 theme、base 与依赖组件 CSS。

两种产物由同一次 `pnpm build` 生成，互不冲突。

## 文档站

```bash
pnpm dev          # http://localhost:5182
pnpm build:docs
pnpm preview
```

组件文档：`src/components/*/docs/index.md` 与 `index.en.md`。更新日志页读取根目录 `CHANGELOG.md` / `CHANGELOG.en.md`。对外指南页在 `playground/src/docs/guide/`（介绍、快速开始、主题等）；**不要**把贡献者约定写进文档站侧栏。

### 组件目录

每个公开组件推荐：

```text
src/components/Button/
├── Button.vue
├── types.ts
├── index.ts
├── Button.test.ts
└── docs/
    ├── index.md
    ├── index.en.md
    └── demos/           # 可交互示例 SFC；中英文 md 用 src 引用
        └── Basic.vue
```

- **前缀**：组件导出为 `M*`，CSS 类为 `.m-*`。
- **类型**：Props / Emits 放在 `types.ts`，并从包入口再导出。
- **测试**：用户行为导向的 Vitest + Vue Test Utils。

### 写组件文档

在 `docs/index.md`（中文）和 `docs/index.en.md`（英文）顶部写 frontmatter：

```md
---
title: Button
category: 01 / PRIMITIVE
description: 触发动作的按钮
---
```

正文用 Markdown。可交互示例写成 `docs/demos/*.vue`，中英文通过：

````md
```vue preview src="./demos/Basic.vue"
```
````

引用；布局优先 UnoCSS 工具类。两种语言的 `category` 保持一致（英文缺失则回退中文）。分类前缀决定侧栏排序，例如：

| 前缀 | 分类 |
| --- | --- |
| `00 / GUIDE` | 指南类（如 ConfigProvider） |
| `01 / PRIMITIVE` | 基础 |
| `02 / FORM` | 表单 |
| `03 / OVERLAY` | 浮层 |

Attrs / `pt` 落点约定见对外页 [样式与 attrs](https://morya-space.github.io/morya-ui/docs/attrs)。写组件文档时：

- Props / Events 表里的 PascalCase 类型名会链到文末 **类型** 小节或 [API 类型](https://morya-space.github.io/morya-ui/docs/types)；可用 `pnpm docs:sync-type-sections` 从 `types.ts` 补全。
- Props 表加上 `pt`（若有）及 DOM 键名。
- 字段组件：事件在原生控件，其它 fallthrough 在 field 根；`placeholder` / `name` 等优先写 props。

### 浮层与图标约定

浮层默认 Teleport 到 `body`，支持 `teleport` / `appendTo`（`'self'` 就地渲染）。动效：`m-fade`（模态）、`m-scale-fade`（锚定菜单）、`m-slide-fade`（Toast）、`m-message-slide`（Message）。全局挂载点用 ConfigProvider 的 `appendTo`。

- **系统图标**：`MIcon` + `name`。
- **业务图标**：应用侧传入，不要往组件库堆全量 SVG。

## 仅发布到 npm

不写 CHANGELOG、不打 tag；先改好 `version`：

```bash
pnpm release:npm
```

## 完整发版

分步执行或一键编排，详见 [scripts/README.md](../scripts/README.md)。默认同时发布 `morya-ui` 与 `@morya-ui/mcp`：

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

`@morya-ui/mcp` 为可选 stdio 服务，供支持 [MCP](https://modelcontextprotocol.io/) 的客户端检索文档（不替代安装 `morya-ui`）。对外说明见文档站 [MCP](/docs/mcp)；实现见 [packages/ui-mcp/README.md](../packages/ui-mcp/README.md)。

完整 UI 发版已包含 MCP。仅需单独重发 MCP 时：

```bash
pnpm mcp:build
pnpm release:mcp -- --dry-run
pnpm release:mcp
```
