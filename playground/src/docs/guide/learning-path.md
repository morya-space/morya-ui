---
title: 学习路径
order: 1.5
description: 按 5 分钟 / 半小时 / 深入 三档，从安装到主题、配方与定制。
---

# 学习路径

优先服务**应用开发者**；其次是主题定制；Agent / LLM 见文末入口。按你手头时间选一档即可，不必从上到下读完。

## 5 分钟上手

把库装进项目并渲染第一个组件。

1. 安装依赖（或用一键脚本）：见 [快速上手](/docs/quick-start)、[一键接入](/docs/setup)
2. 引入样式，注册 / 按需导入组件
3. 渲染 `Button`、`Input` 等基础控件，确认主题样式已生效
4. 去 [组件总览](/components) 查你要用的组件 API

| 目标               | 文档                          |
| ------------------ | ----------------------------- |
| 安装与最小示例     | [快速上手](/docs/quick-start) |
| 一键装库 + AI 配置 | [一键接入](/docs/setup)       |
| 组件目录           | [组件](/components)           |

## 半小时接入

能独立做一页业务：主题、全局配置、样式约定，再跟一个配方。

1. [主题](/docs/theme)：亮暗、密度；需要时看 [设计令牌](/docs/design-tokens)
2. [全局配置](/docs/config)：`ConfigProvider` / `createMoryaUI`
3. [样式与 attrs](/docs/attrs)：fallthrough、`pt`、事件落点（可补读 [Common Props](/docs/common-props)）
4. 选一条配方落地：
   - [登录表单](/docs/recipe-form-login)
   - [表格筛选](/docs/recipe-table-filter)

| 目标                 | 文档                                                                        |
| -------------------- | --------------------------------------------------------------------------- |
| 亮暗 / 密度          | [主题](/docs/theme)                                                         |
| 全局行为             | [全局配置](/docs/config)                                                    |
| class / style / `pt` | [样式与 attrs](/docs/attrs)                                                 |
| 配方                 | [登录表单](/docs/recipe-form-login) · [表格筛选](/docs/recipe-table-filter) |

## 深入定制

统一视觉语言、动效、SSR、无障碍，或接入 Agent。

| 方向             | 文档                            |
| ---------------- | ------------------------------- |
| 设计原则与章节   | [设计语言](/docs/design)        |
| `--m-*` 全集     | [设计令牌](/docs/design-tokens) |
| 动效偏好与预设   | [动效](/docs/motion)            |
| Nuxt / Astro 等  | [SSR](/docs/ssr)                |
| 键盘、表单、浮层 | [无障碍](/docs/accessibility)   |
| Agent / LLM      | [面向 Agent](/docs/for-agents)  |

主题即时预览：[主题编辑器](/theme-editor)。
