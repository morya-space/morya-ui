---
title: 介绍
order: 1
description: Morya UI 是什么、适合谁用、如何开始。
---

# 介绍

**Morya UI**（`morya-ui`）是一套**开源**的 Vue 3 组件库，内置设计令牌、亮暗主题、国际化与交互式文档。

- **文档站**：[morya-space.github.io/morya-ui](https://morya-space.github.io/morya-ui/)
- **源码**：[GitHub](https://github.com/morya-space/morya-ui)
- **npm**：[`morya-ui`](https://www.npmjs.com/package/morya-ui)

## 为什么选择 Morya UI

| | |
| --- | --- |
| **88 个组件** | 基础、表单、导航、数据展示、布局、反馈一应俱全 |
| **主题系统** | `--m-*` 设计令牌，亮/暗色、`useTheme` / `useDensity` / `useMotion` 同包导出 |
| **TypeScript** | Composition API 编写，Props / Emits / locale 完整类型 |
| **按需加载** | ESM 子路径 + `MoryaUIResolver`，支持 tree-shaking |
| **文档即预览** | 每个组件自带 Markdown + 可交互 `vue preview` |

## 适用场景

- 管理后台、运营平台、SaaS 控制台
- 需要统一视觉语言的中大型 Vue 3 应用
- 希望开箱即用主题、浮层与表单能力的团队

## 包结构

| 包 | 说明 |
| --- | --- |
| `morya-ui` | 组件、样式、主题 API、文档站源码 |
| `@morya-ui/mcp` | （可选）MCP 服务，供支持该协议的 AI 客户端检索文档 |

## 安装

```bash
pnpm add morya-ui
```

需要 Vue 3（推荐 3.5 及以上）。支持 [Nuxt / Astro / Vite SSR 等](/docs/ssr)。详见 [快速上手](/docs/quick-start)。

## 下一步

- [快速上手](/docs/quick-start)：安装与最小示例
- [主题](/docs/theme)：亮暗色与动效
- [设计令牌](/docs/design-tokens)：全部 `--m-*` 变量与用途
- [全局配置](/docs/config)：`ConfigProvider` / `createMoryaUI`
- [无障碍](/docs/accessibility)：键盘、表单与浮层约定
- [组件](/components)：浏览全部组件与 API
- [参与贡献](https://github.com/morya-space/morya-ui/blob/main/CONTRIBUTING.zh-CN.md)
