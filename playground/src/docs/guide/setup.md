---
title: 一键接入
order: 3
description: 用 @morya-ui/setup 安装组件库，并按需写入样式、Agent 配置与 MCP。
---

# 一键接入

[`@morya-ui/setup`](https://www.npmjs.com/package/@morya-ui/setup) 用于在业务 Vue 项目中接入 `morya-ui`：安装依赖、注入样式，并可一并写入 Agent Skill、Cursor 规则与 MCP。手写安装见 [快速上手](/docs/quick-start)；AI 生成页面的约定见 [AI 接入](/docs/ai-setup)。

## 命令

在业务项目根目录执行：

```bash
npx @morya-ui/setup
```

默认会：

1. 安装 `morya-ui`（按锁文件选用 pnpm / yarn / npm）
2. 复制 `DESIGN.md`、Agent Skill、Cursor rules、黄金样例与检查脚本
3. 合并 `.cursor/mcp.json`，接入 [`@morya-ui/mcp`](https://www.npmjs.com/package/@morya-ui/mcp)
4. 尝试在入口注入 `import 'morya-ui/styles.css'`，并写入 `morya-app-shell.css`
5. 若缺失则追加 `check:colors` 脚本

也可以按场景选用：

```bash
# 只安装组件库并注入样式
npx @morya-ui/setup app

# 已装库时，只写入 AI 配置与 MCP
npx @morya-ui/setup ai
```

完成后若写入了 MCP，请 **重启 Cursor**（或重载 MCP）。生成页面前让 Agent 先读 `DESIGN.md`。

## 选项

| Flag | 说明 |
| --- | --- |
| `--cwd <dir>` | 目标项目根（默认当前目录） |
| `--pm pnpm\|yarn\|npm` | 指定包管理器 |
| `--force` | 覆盖已有模板文件与 `morya-ui` MCP 条目 |
| `--dry-run` | 只打印将要执行的操作 |
| `--skip-install` | 不安装依赖 |
| `--skip-template` | 不复制 skill / rules / docs |
| `--skip-mcp` | 不写 MCP 配置 |
| `--skip-styles` | 不注入样式 import |
| `--skip-scripts` | 不改 `package.json` scripts |

默认 **不覆盖** 已有文件；只有 `--force` 才会覆盖模板与 MCP 条目。

示例：只补 MCP：

```bash
npx @morya-ui/setup ai --skip-template --skip-scripts
```

## 会落到项目里的内容

| 路径 | 作用 |
| --- | --- |
| `DESIGN.md` | AI 设计第一信源 |
| `.agents/skills/morya-ui-pages/` | 页面生成 Agent Skill（见 [Agent Skill](/docs/agent-skill)） |
| `.cursor/rules/` | Cursor 常驻规则 |
| `docs/`、`design-tokens/`、`src/examples/` | 组件索引、黄金样例、令牌 |
| `scripts/check-raw-colors.mjs` | 裸色值扫描 |
| `.cursor/mcp.json` | Cursor MCP（`npx -y @morya-ui/mcp`） |
| `src/styles/morya-app-shell.css` | 页面高度链（默认命令或 `app` 写入） |

模板源在仓库 [`design-kit/`](https://github.com/morya-space/morya-ui/tree/main/design-kit)。CLI 不调用 `app.use(MoryaUI)`，也不改 `App.vue`。

## 冲突策略

- 模板文件与 `.cursor/rules/*`：目标已存在则跳过（除非 `--force`）
- `.cursor/mcp.json`：合并其它 server；已有 `morya-ui` 条目则跳过（除非 `--force`）
- `check:colors`：仅在缺失时追加（除非 `--force`）
- 样式：找到入口且尚未引入时才注入

## 下一步

- [快速上手](/docs/quick-start)：组件用法与最小示例  
- [AI 接入](/docs/ai-setup)：用 AI 生成业务页面时如何配合 Skill / MCP  
- [Agent Skill](/docs/agent-skill) · [Agent MCP](/docs/mcp)  
- [组件](/components)：浏览 API 与预览
