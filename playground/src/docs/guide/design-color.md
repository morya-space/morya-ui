---
title: 色彩
order: 4.51
description: 品牌色、语义色、中性色与对比度约定。
---

# 色彩

组件只消费语义化 `--m-*` 颜色变量，不维护第二套业务色板。亮 / 暗色由 `document.documentElement` 的 `data-theme` 切换（`useTheme`）。

## 原则

- **换品牌改令牌**：在主题入口覆盖 `--m-color-primary`（及派生 hover / active / bg），页面仍写 `var(--m-*)`。
- **语义先于色相**：按钮、Tag、Alert 用 `severity`，不要用裸色冒充状态。
- **暗色必须可跟随**：业务 CSS 勿写死浅色专用 hex；依赖 `[data-theme="dark"]` 覆盖。
- **不只靠颜色传达**：错误 / 成功同时给文案或图标（见 [无障碍](/docs/accessibility)）。

## 核心令牌

| Token | 默认（亮色） | 用途 |
| --- | --- | --- |
| `--m-color-primary` | `#1677ff` | 品牌主色、链接、默认主按钮 |
| `--m-color-primary-hover` | `#4096ff` | 主色悬浮 |
| `--m-color-surface` | `#ffffff` | 容器 / 卡片底 |
| `--m-color-text` | `rgba(0,0,0,0.88)` | 正文 |
| `--m-color-text-muted` | `rgba(0,0,0,0.45)` | 次要说明 |
| `--m-color-border` | `#d9d9d9` | 描边 |
| `--m-color-split` | `#f0f0f0` | 弱分割（弱于 border） |
| `--m-color-success` | `#52c41a` | 成功 |
| `--m-color-info` | `#1677ff` | 信息 |
| `--m-color-warning` / `--m-color-warn` | `#faad14` | 警告（`warn` 为别名） |
| `--m-color-danger` | `#ff4d4f` | 危险 / 错误 |
| `--m-color-help` | `#9333ea` | 帮助提示 |
| `--m-color-on-emphasis` | `#ffffff` | 实心强调面上的前景 |
| `--m-color-focus-ring` | 跟主色 | 聚焦相关 |
| `--m-opacity-disabled` | `0.55` | 禁用透明度 |

暗色示例：`--m-color-surface: #141414`，正文 `rgba(255,255,255,0.85)`。完整表见 [设计令牌](/docs/design-tokens)。

## severity 映射

| `severity` | 对应色 |
| --- | --- |
| （省略 / primary） | `--m-color-primary` |
| `secondary` | 中性次要外观 |
| `success` | `--m-color-success` |
| `info` | `--m-color-info` |
| `warning` / `warn` | `--m-color-warning` |
| `help` | `--m-color-help` |
| `danger` | `--m-color-danger` |
| `contrast` | `--m-color-contrast` 系 |

破坏性操作：按钮 / 确认用 `severity="danger"`，不要用主色冒充删除。

## 覆盖方式

```css
:root {
  --m-color-primary: #0b6e4f;
}
[data-theme="dark"] {
  --m-color-primary: #3ecf8e;
}
```

也可用 `createTheme({ seed: { colorPrimary: '…' } })` 派生 hover / bg 等（见 [主题](/docs/theme)）。在线预览：[主题编辑器](/theme-editor)。

## 建议与避免

| 建议 | 避免 |
| --- | --- |
| 主操作默认 primary，次要用 `secondary` / `outlined` | 一屏多个同等实心主按钮 |
| 错误态用 `danger` + 文案 | 只用红色边框表达错误 |
| 弱分隔用 `--m-color-split` | 到处加粗边框抢层级 |
| 聚焦用 `--m-focus-shadow` | 手写外扩 outline 与主题脱节 |

下一章：[字体与排版](/docs/design-typography)。
