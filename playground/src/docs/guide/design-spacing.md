---
title: 间距
order: 4.53
description: 间距阶梯、密度缩放与组件内边距约定。
---

# 间距

垂直 / 水平节奏统一走 `--m-space-*`。`useDensity` 写入 `data-m-density` 后，会同步缩放间距与控件高度，不必在每个页面手写 compact 样式。

## 原则

- **用阶梯，不写魔法数**：区块间距优先 `--m-space-4` / `--m-space-6`；紧凑组内用 `1`–`3`。
- **密度全局一次**：`compact` | `comfortable` | `spacious`，经 `useDensity` / `MConfigProvider` / `createMoryaUI`。
- **控件内边距另有 token**：`--m-control-padding-x-*`、`--m-button-padding-x-*`，不要用 space 阶梯硬撑控件。
- **布局组件承接节奏**：相邻控件用 `MSpace` / `MFlex` / `MGrid`，见 [布局](/docs/design-layout)。

## 间距阶梯（comfortable / 默认）

| Token | 值 | 常见用途 |
| --- | --- | --- |
| `--m-space-1` | `0.25rem` | 图标与文字间隙、极紧凑 |
| `--m-space-2` | `0.5rem` | 控件组内、表单项微距 |
| `--m-space-3` | `0.75rem` | 字段内区块 |
| `--m-space-4` | `1rem` | 内容块默认间距 |
| `--m-space-5` | `1.25rem` | 区块呼吸 |
| `--m-space-6` | `1.5rem` | 分区间距 |
| `--m-space-8` | `2rem` | 大分区 / 页边 |

`compact` 示例：`--m-space-4` → `0.85rem`，`--m-control-height-medium` → `28px`。  
`spacious` 示例：`--m-space-4` → `1.15rem`，medium 高度 → `40px`。

## 密度 API

```ts
import { useDensity } from 'morya-ui'

const { preference, setDensity } = useDensity()
setDensity('compact') // 'compact' | 'comfortable' | 'spacious'
```

应用级：`createMoryaUI({ density: 'compact' })` 或 `<MConfigProvider density="compact">`。详见 [主题](/docs/theme)、[全局配置](/docs/config)。

## 圆角（常与间距一起改）

| Token | 用途 |
| --- | --- |
| `--m-radius-control` / `--m-border-radius` | 输入 / 按钮等控件 |
| `--m-radius-sm` | 小标签、徽标 |
| `--m-radius-md` / `--m-radius-lg` | 卡片、面板 |
| `--m-radius-full` | 胶囊 / 圆形 |

## 建议与避免

| 建议 | 避免 |
| --- | --- |
| 同源对齐：卡片内统一 `space-4` | 同屏混用 `8px` / `12px` / `14px` 随意值 |
| 筛选条与表格用同一密度 | 局部 `transform: scale` 假装 compact |
| 通栏操作用 `fluid` + 外层 space | 用巨大 margin 把按钮「顶」到视觉中心 |

下一章：[布局](/docs/design-layout)。
