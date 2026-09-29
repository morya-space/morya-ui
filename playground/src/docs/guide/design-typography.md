---
title: 字体与排版
order: 4.52
description: 字号阶梯、字重、控件字号与中西文混排约定。
---

# 字体与排版

排版令牌分两层：**组件正文阶梯**（`--m-font-size-xs` … `lg`）与 **展示阶梯**（`xl` … `3xl`，用于标题 / KPI）。控件高度配套字号走 `--m-control-font-*`，可随密度变化。

## 原则

- 正文默认约 `14px`（`--m-font-size-md` / `--m-font-size`），控件文案默认字重 `400`（`--m-font-weight`）。
- 层级靠阶梯与字重，不靠随意放大或加粗一整屏。
- 品牌字体只改 `--m-font-sans`（或 seed `fontFamily`），组件继续消费令牌。
- 中西混排优先系统栈；自定义字体时保证中文回退。

## 字号阶梯

| Token | 约等于 | 用途 |
| --- | --- | --- |
| `--m-font-size-xs` | `0.75rem` | 辅助、Tag 小号 |
| `--m-font-size-sm` | `0.8125rem` | 次要说明、紧凑表 |
| `--m-font-size-md` | `0.875rem`（14px） | 组件正文默认 |
| `--m-font-size-lg` | `1.125rem` | 区块小标题 |
| `--m-font-size-xl` | `1.25rem` | 页面小标题 |
| `--m-font-size-2xl` | `1.5rem` | 页面标题 |
| `--m-font-size-3xl` | `1.75rem` | 展示 / KPI |

字体族：`--m-font-sans`（系统 UI 栈 + Noto Sans / Emoji）。

## 字重

| Token | 值 | 用途 |
| --- | --- | --- |
| `--m-font-weight` | `400` | 控件与正文默认 |
| `--m-font-weight-medium` | `500` | 强调标签、导航项 |
| `--m-font-weight-strong` | `600` | 标题、关键数字 |

按钮等组件若覆写 `--m-button-font-weight`，应局部且克制。

## 控件字号（随 size / 密度）

舒适密度下常见高度（`:root` 基准；`compact` / `spacious` 会改写）：

| Size | 高度 token | 字号 token |
| --- | --- | --- |
| `small` | `--m-control-height-small`（24px） | `--m-control-font-small`（14px） |
| `medium` | `--m-control-height-medium`（32px） | `--m-control-font-medium`（14px） |
| `large` | `--m-control-height-large`（40px） | `--m-control-font-large`（15px） |

`size` 也可写 `sm` / `md` / `lg` 别名；未传时继承 [全局配置](/docs/config) 的 `size`。详见 [主题](/docs/theme)。

## 建议与避免

| 建议 | 避免 |
| --- | --- |
| 标题用展示阶梯，正文固定在 `md` | 一页混用过多字号 |
| 强调用 `medium` / `strong` 字重 | 整段加粗代替层级 |
| 纯图标按钮补 `aria-label` | 缩小字号充当「次要」却失去可读性 |
| 表头 / 辅助用 `sm` / muted 色 | 用过浅灰字充当禁用（禁用另有 token） |

完整变量：[设计令牌](/docs/design-tokens)。下一章：[间距](/docs/design-spacing)。
