---
title: 设计语言
order: 4.5
description: Morya 设计原则与 Design Spec 章节入口。
---

# 设计语言

Morya UI 是一套**令牌驱动**的 Vue 3 组件库：颜色、间距、圆角、字号与动效统一走 `--m-*`，交互词表用 `severity` / `variant` / `size`，全局行为由 `MConfigProvider`、`useTheme`、`useDensity`、`useMotion` 协同。

本文是 Design Spec 总览。原则摘要来自仓库 [`design-kit/DESIGN.md`](https://github.com/morya-space/morya-ui/blob/main/design-kit/DESIGN.md)；完整变量目录见 [设计令牌](/docs/design-tokens)。

## 原则

1. **组件优先**：交互与布局优先用库内 `M*`，避免手写等价 DOM。
2. **令牌优先**：页面与业务样式只消费 `--m-*`；禁止在业务代码写裸 `#hex` / `rgb()`（换品牌改主题入口）。
3. **语义一致**：主操作用 `type="primary"`；破坏性操作用 `danger` / `color="danger"` 或确认流。
4. **可访问**：控件有可访问名称；纯图标按钮提供 `aria-label`；浮层可键盘关闭。
5. **单一事实源**：API 以组件文档 / MCP 为准，勿臆造 prop。

## 章节

| 章节                                  | 内容                                       |
| ------------------------------------- | ------------------------------------------ |
| [色彩](/docs/design-color)            | 品牌色、语义色、中性面、对比与覆盖         |
| [字体与排版](/docs/design-typography) | 字号阶梯、字重、控件字号                   |
| [间距](/docs/design-spacing)          | `--m-space-*` 节奏与密度缩放               |
| [布局](/docs/design-layout)           | `MLayout` / `MPage*` / `MSpace` 与页面框架 |
| [动效](/docs/motion)                  | 设计原则、时长、缓动、减弱与 API           |
| [反馈](/docs/design-feedback)         | Message / Toast / Dialog / Alert 层级      |

工程接入另见 [主题](/docs/theme)、[全局配置](/docs/config)、[约定](/docs/conventions)、[Common Props](/docs/common-props)。

## 主题编辑器

在线调色、密度与动效预览：[主题编辑器](/theme-editor)（独立交互路由）。编程侧用 `createTheme` / `useTheme`，见 [主题](/docs/theme)。
