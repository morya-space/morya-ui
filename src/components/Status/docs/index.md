---
title: Status
category: 01 / BASIC
description: 行内状态指示，圆点加文案。
---

# Status

用于表格、详情标题旁等场景，以圆点 + 文案展示业务状态。比 [Tag](/components/Tag) 更轻；需要分类标签或可关闭时用 Tag。

## 引入

```ts
import { MStatus } from 'morya-ui'
```

## 基础用法

通过 `label` 或默认插槽展示文案。

```vue preview src="./demos/Basic.vue"
```

## Severity

使用 `severity` 定义语义色；默认 `secondary`（中性）。兼容旧值 `warning`（映射为 `warn`）。

```vue preview src="./demos/Severity.vue"
```

## Size & Processing

`size` 支持 `small` / `large`；`processing` 为圆点脉冲动画。

```vue preview src="./demos/Processing.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `label` | `string` | — | 状态文案。存在默认插槽内容时以插槽为准。 |
| `severity` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warn' \| 'help' \| 'danger' \| 'contrast' \| 'warning'` | `'secondary'` | 语义色。`warning` 为兼容别名，映射为 `warn`。 |
| `processing` | `boolean` | `false` | 圆点脉冲动画。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。 |
| `color` | `string` | — | 自定义颜色，覆盖 `severity`。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 状态文案。 |

## 无障碍

- 根节点使用 `role="status"`。
- 不要仅靠颜色区分状态；保持可见文案。

## Events

无自定义事件。
