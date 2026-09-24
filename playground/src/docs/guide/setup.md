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
2. 复制 `DESIGN.md`、Agent Skill、Cursor rules 与检查脚本
3. 合并 `.cursor/mcp.json`，接入 [`@morya-ui/mcp`](https://www.npmjs.com/package/@morya-ui/mcp)
4. 尝试在入口注入 `import 'morya-ui/styles.css'`
5. 若缺失则追加 `check:colors` 脚本

也可以按场景选用：

```bash
# 只安装组件库并注入样式
npx @morya-ui/setup app

# 已装库时，只写入 AI 配置与 MCP
npx @morya-ui/setup ai

# 非交互：默认 skill / 指定 / 全部
npx @morya-ui/setup ai --yes
npx @morya-ui/setup ai --skills=morya-ui-pages,frontend-design,impeccable
npx @morya-ui/setup ai --skills=all
```

在 TTY 下，`full` / `ai` 会提示勾选可选 Agent Skill（必选 `morya-ui-pages` 始终写入）。可选 companion 通过 [skills CLI](https://skills.sh/) 安装**最新版**。完成后若写入了 MCP，请 **重启 Cursor**（或重载 MCP）。生成页面前让 Agent 先读 `DESIGN.md`。

## 选项

| Flag | 说明 |
| --- | --- |
| `--cwd <dir>` | 目标项目根（默认当前目录） |
| `--pm pnpm\|yarn\|npm` | 指定包管理器 |
| `--skills <list>` | 逗号分隔的 skill id，或 `all`（跳过交互提示） |
| `--yes` / `-y` | 使用默认 skill，不提示 |
| `--force` | 覆盖已有模板文件与 `morya-ui` MCP 条目 |
| `--dry-run` | 只打印将要执行的操作 |
| `--skip-install` | 不安装依赖 |
| `--skip-template` | 不复制 skill / rules / docs（也不装 companion） |
| `--skip-mcp` | 不写 MCP 配置 |
| `--skip-styles` | 不注入样式 import |
| `--skip-scripts` | 不改 `package.json` scripts |

模板文件默认 **不覆盖**；只有 `--force` 才会覆盖模板与 MCP 条目。勾选的 companion skill 会始终拉取最新版。

### Skills

| Id | 默认 | 安装方式 | 作用 |
| --- | --- | --- | --- |
| `morya-ui-pages` | 必选 | 包内 template | 用 `M*` + 黄金布局生成页面 |
| `frontend-design` | 可选 | skills CLI（`anthropics/skills` 最新） | Express / 品牌向视觉味觉 |
| `fixing-accessibility` | 可选 | skills CLI（`ibelick/ui-skills` 最新） | 无障碍审计与定向修复 |
| `impeccable` | 可选 | skills CLI（`pbakaus/impeccable` 最新） | 命名化 polish / 审计 / 改版 |

目录：[`packages/setup/catalog/skills.json`](https://github.com/morya-space/morya-ui/blob/main/packages/setup/catalog/skills.json)。

示例：只补 MCP：

```bash
npx @morya-ui/setup ai --skip-template --skip-scripts
```

## 会落到项目里的内容

| 路径 | 作用 |
| --- | --- |
| `DESIGN.md` | AI 设计第一信源（原则、应用根、令牌摘要、禁止项） |
| `.agents/skills/morya-ui-pages/` | 页面生成 Agent Skill（见 [Agent Skill](/docs/agent-skill)） |
| `.agents/skills/<optional>/` | 勾选时由 skills CLI 写入的最新 companion |
| `.cursor/rules/` | Cursor 常驻规则 |
| `scripts/check-raw-colors.mjs` | 裸色值扫描 |
| `.cursor/mcp.json` | Cursor MCP（`npx -y @morya-ui/mcp`） |

模板源在仓库 [`design-kit/`](https://github.com/morya-space/morya-ui/tree/main/design-kit)。CLI 不调用 `app.use(MoryaUI)`，也不改 `App.vue`。

## 冲突策略

- 模板文件与 `.cursor/rules/*`：目标已存在则跳过（除非 `--force`）
- Companion skills（skills CLI）：勾选时始终安装/更新为最新版
- `.cursor/mcp.json`：合并其它 server；已有 `morya-ui` 条目则跳过（除非 `--force`）
- `check:colors`：仅在缺失时追加（除非 `--force`）
- 样式：找到入口且尚未引入时才注入

## 下一步

- [快速上手](/docs/quick-start)：组件用法与最小示例  
- [AI 接入](/docs/ai-setup)：用 AI 生成业务页面时如何配合 Skill / MCP  
- [Agent Skill](/docs/agent-skill) · [Agent MCP](/docs/mcp)  
- [组件](/components)：浏览 API 与预览
