---
title: AI 接入
order: 9
description: 用 @morya-ui/setup 一键安装组件库、Agent Skill、Cursor 规则与 MCP。
---

# AI 接入

面向 **用 AI 生成业务页面** 的业务项目。推荐用 [`@morya-ui/setup`](https://www.npmjs.com/package/@morya-ui/setup) 一次装好组件库与 AI 侧配置；日常手写代码仍可只 `pnpm add morya-ui`。

## 一键命令

在业务项目根目录：

```bash
npx @morya-ui/setup
```

会依次：

1. 安装 `morya-ui`（按锁文件选用 pnpm / yarn / npm）
2. 复制 `DESIGN.md`、Agent Skill、Cursor rules、黄金样例与检查脚本
3. 合并 `.cursor/mcp.json`，接入 [`@morya-ui/mcp`](https://www.npmjs.com/package/@morya-ui/mcp)
4. 尝试在入口注入 `import 'morya-ui/styles.css'`
5. 若缺失则追加 `check:colors` 脚本

完成后 **重启 Cursor**（或重载 MCP），生成页面前让 Agent 先读 `DESIGN.md`。

## 常用选项

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

示例：已装库，只补 MCP：

```bash
npx @morya-ui/setup --skip-install --skip-template --skip-styles --skip-scripts
```

## 会落到项目里的内容

| 路径 | 作用 |
| --- | --- |
| `DESIGN.md` | AI 设计第一信源 |
| `.agents/skills/morya-ui-pages/` | 页面生成 Agent Skill（说明见 [Agent Skill](/docs/agent-skill)） |
| `.cursor/rules/` | Cursor 常驻规则 |
| `docs/`、`design-tokens/`、`src/examples/` | 组件索引、黄金样例、令牌 |
| `scripts/check-raw-colors.mjs` | 裸色值扫描 |
| `.cursor/mcp.json` | Cursor MCP（`npx -y @morya-ui/mcp`） |

模板源在仓库 [`design-kit/`](https://github.com/morya-space/morya-ui/tree/main/design-kit)；CLI 细节见 [`packages/setup`](https://github.com/morya-space/morya-ui/tree/main/packages/setup)。

## 与 Skill / MCP 的关系

- **Setup**：一次性把库 + AI 配置装进项目  
- **[Agent Skill](/docs/agent-skill)**：按需指导如何用 `morya-ui` 做页面  
- **MCP**：运行时检索真实组件 API / 示例  

工具列表与多客户端配置见 [Agent MCP](/docs/mcp)。只想手写配置 MCP、不跑 setup 时，也可直接按该页操作。

## 下一步

- [Agent Skill](/docs/agent-skill)：`morya-ui-pages` 何时用、表面地图  
- [Agent MCP](/docs/mcp)：工具与客户端配置  
- [快速上手](/docs/quick-start)：手写安装与最小示例  
- [组件](/components)：浏览 API 与预览
