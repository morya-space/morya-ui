---
title: 面向 Agent
order: 11.5
description: 给编码 Agent / LLM 的文档入口：先读什么、再调什么工具。
---

# 面向 Agent

本页是 **编码 Agent / LLM** 使用 Morya UI 文档站的总入口。业务项目里生成页面时，按下面顺序加载；不要臆造 props 或堆砌文档之外的 API。

机器可读索引：[llms.txt](/llms.txt)（站点根路径，构建文档站时生成）。

## 推荐顺序

1. [一键接入](/docs/setup) / [AI 接入](/docs/ai-setup) — 把库、Skill、规则、MCP 装进业务项目  
2. [Agent Skill](/docs/agent-skill) — `morya-ui-pages`：页面类型与组合约定  
3. [Agent MCP](/docs/mcp) — 运行时查真实 Props / Events / 示例  
4. 具体组件页：`/components/{PascalCaseName}`（如 [/components/Button](/components/Button)）

不确定 API 时：**先 MCP / 文档，禁止猜测。**

## 必读约定

| 主题 | 链接 |
| --- | --- |
| 公共 props / Semantic DOM | [Common Props](/docs/common-props) |
| class / style / `pt` 落点 | [样式与 attrs](/docs/attrs) |
| 命名与 severity | [约定](/docs/conventions) |
| 设计令牌 `--m-*` | [设计令牌](/docs/design-tokens) |

## 硬规则（摘要）

- 只组合文档中的 `M*` 组件与 `--m-*` token  
- 外观词表：`severity` / `variant` / `size`；不要引入文档之外的 prop 名  
- 选型按场景与角色判断，不照抄其他库的同名 props  
- 反馈：短结果用 `message`；摘要+详情或异步感用 `toast`；确认用 Confirm 系列  

## 速查

- 组件总览：[/components](/components)  
- 主题即时预览：[/theme-editor](/theme-editor)  
- 更新日志：[/changelog](/changelog)  
- LLM 索引：[/llms.txt](/llms.txt)  
- 站点地图：[/sitemap.xml](/sitemap.xml)
