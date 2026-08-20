---
title: 介绍
order: 1
description: Well Insight 是什么、适合谁用。
---

# 介绍

**Well Insight**（`@well-insight/ui`）是一套面向 Vue 3 的组件库，内置设计令牌、亮暗主题与动效偏好。

源码仓库：[GitHub](https://github.com/well-insight/well-insight-ui)

## 设计目标

- **可独立复用**：业务应用通过包入口引入组件与样式；发布产物为 ESM + 类型 + CSS。
- **一致体验**：尺寸、语义色、浮层行为在组件间保持同一套约定。
- **主题一体**：颜色、圆角、间距、动效走 `--wi-*` CSS 变量；`useTheme` / `useMotion` / `useDensity` 与组件同包导出。
- **文档即预览**：每个组件目录下的 `docs/index.md`（中文）与 `docs/index.en.md`（英文）支持 Markdown + 可交互 `vue preview`。

## 包结构

| 包 | 说明 |
| --- | --- |
| `@well-insight/ui` | 组件、样式、主题 API、文档站 |
| `@well-insight/ui-mcp` | （可选）MCP 服务，供支持该协议的 AI 客户端检索文档 |

## 消费方式

| 场景 | 行为 |
| --- | --- |
| 本地开发（Vite `development`） | `exports` 指向源码，热更新 |
| 对外安装 / 生产构建 | 使用 `dist` 中的 ESM、`.d.ts` 与 `styles.css` |

## 下一步

- [快速上手](/docs/quick-start)：安装与最小示例
- [指南](/docs/guide)：目录约定与文档写法
- [主题](/docs/theme)：亮暗色与动效
- [全局配置](/docs/config)：`ConfigProvider` / `createWellInsight`
- [组件](/components)：浏览全部组件与 API
