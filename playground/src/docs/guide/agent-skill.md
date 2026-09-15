---
title: Agent Skill
order: 10
description: 消费方 morya-ui-pages skill：何时触发、与 rules/MCP 分工、页面类型地图。
---

# Agent Skill

消费方用 AI 生成 **基于 `morya-ui` 的业务页面** 时，应加载 **`morya-ui-pages`** skill。它规定组件契约、页面类型与工作流；**不是**组件库源码里写新组件用的 skill。

安装方式见 [AI 接入](/docs/ai-setup)（`npx @morya-ui/setup` 会复制到项目）。本文说明 skill **是什么、何时用、和其它配置怎么分工**。

## 装到哪里

```text
.agents/skills/morya-ui-pages/
├── SKILL.md
└── references/          # 布局、表面、令牌、反馈、检查清单等
```

支持 Agent Skills 自动发现的客户端（如 Cursor）会从 `.agents/skills` 读取。生成列表 / 表单 / 登录 / 落地等页面前，应优先匹配本 skill。

源文件在仓库 [`ai-design-config/.agents/skills/morya-ui-pages/`](https://github.com/morya-space/morya-ui/tree/main/ai-design-config/.agents/skills/morya-ui-pages)，随 `@morya-ui/setup` 的 template 同步。

## 何时触发

典型话术或主题：

- `morya-ui`、`M*` 组件、`--m-*` 令牌、黄金样例
- 后台 / 列表 / 表单 / 仪表盘 / 详情 / 设置
- 登录 / 注册 / 空状态 / 向导 / 落地页 / 官网

**优先于**通用 `frontend-design`、Impeccable、UI-UX-Pro-Max 等：那些只能当审美参考；栈是 morya-ui 时以本 skill 为准。

**不要**用于：纯后端、或在本仓库 `src/components` 里新增组件库组件。

## 与其它配置的分工

| 层 | 角色 |
| --- | --- |
| [AI 接入](/docs/ai-setup) / `@morya-ui/setup` | 一次性把库 + skill + rules + MCP 装进项目 |
| **`morya-ui-pages` skill** | 按需工作流：选表面、读黄金样例、组 `M*`、自检 |
| `.cursor/rules/` | 编辑器常驻短规则（设计系统、组件用法、布局） |
| `DESIGN.md` | 项目设计第一信源；与 skill 冲突时以项目 `DESIGN.md` 为准 |
| [Agent MCP](/docs/mcp) | 运行时查真实 Props / Events / 示例，禁止臆造 API |

两层始终生效：

1. **契约** — 只用 `M*` 与 `--m-*`，API 以 MCP / 文档为准  
2. **工艺** — 先定表面类型，再做视觉；后台偏克制，落地 / 品牌向可有意表达，但仍上令牌、上组件

## 页面类型（Surface）地图

| 车道 | 典型表面 | 优先参考 |
| --- | --- | --- |
| **Ops** | 列表、表单、仪表盘、详情、设置、筛选抽屉 | 黄金样例 + skill `page-layouts` |
| **Account** | 登录、注册、邀请、重置密码、个人资料 | skill `surfaces` § Account |
| **Flow** | 引导、空状态、向导、成功页 | skill `surfaces` § Flow |
| **System** | 404、无权限、维护中 | skill `surfaces` § System |
| **Express** | 营销落地、定价、功能展示 | skill `surfaces` + `visual-craft` |
| **Overlay** | 以 Dialog / Drawer / CommandMenu 为主界面 | skill `surfaces` § Overlay |

不确定时：后台默认 Ops → 最近黄金样例；对外营销 → Express。

## Agent 推荐工作流（摘要）

1. 钉死主体、受众、表面、第一屏单一任务  
2. 优先 MCP：`recommend_page` → `get_golden_page` → `get_component` / `get_example`  
3. 无 MCP 时读项目内 `docs/golden-pages/` 与 skill `references/`  
4. 反馈默认 `message`；`toast` 仅 summary+detail / 异步感（见项目 `docs/feedback-message-vs-toast.md`）  
5. 交付前对照 skill 检查清单；有 MCP 时跑 `validate_page`

细节与硬边界以项目内 `SKILL.md` 为准，本文不重复全文。

## 下一步

- [AI 接入](/docs/ai-setup)：安装 skill 与其它 AI 配置  
- [Agent MCP](/docs/mcp)：工具与客户端配置  
- [快速上手](/docs/quick-start)：手写安装组件库  
- [组件](/components)：浏览 API
