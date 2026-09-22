---
title: AI 接入
order: 12
description: 用 AI 生成业务页面时，如何配合 @morya-ui/setup、Agent Skill 与 MCP。
---

# AI 接入

面向 **用 AI 生成业务页面** 的业务项目。先用 [`@morya-ui/setup`](https://www.npmjs.com/package/@morya-ui/setup) 把库与 AI 配置装进项目（命令与选项见 [一键接入](/docs/setup)），再按本文约定生成页面。

日常手写代码仍可只 `pnpm add morya-ui`，见 [快速上手](/docs/quick-start)。

## 推荐流程

1. 在业务项目根目录执行 `npx @morya-ui/setup`（或已装库时用 `npx @morya-ui/setup ai`）
2. **重启 Cursor**（或重载 MCP）
3. 生成页面前让 Agent 先读 `DESIGN.md`，需要时再读黄金样例与 [Agent Skill](/docs/agent-skill)
4. 不确定组件 API 时走 [Agent MCP](/docs/mcp)，不要臆造 props

## 与 Skill / MCP 的关系

- **[一键接入](/docs/setup)**：把库与 AI 配置写入项目  
- **[Agent Skill](/docs/agent-skill)**：按需指导如何用 `morya-ui` 做页面  
- **MCP**：运行时检索真实组件 API / 示例  

工具列表与多客户端配置见 [Agent MCP](/docs/mcp)。也可以不跑 setup，按该页手写 MCP。

## 下一步

- [一键接入](/docs/setup)：`@morya-ui/setup` 命令与落地文件  
- [Agent Skill](/docs/agent-skill)：`morya-ui-pages` 何时用、表面地图  
- [Agent MCP](/docs/mcp)：工具与客户端配置  
- [快速上手](/docs/quick-start)：手写安装与最小示例  
- [组件](/components)：浏览 API 与预览
