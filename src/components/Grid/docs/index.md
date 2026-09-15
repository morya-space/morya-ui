---
title: Grid
category: 06 / LAYOUT
description: 基于 CSS Grid 的响应式栅格，配合 GridItem 控制跨列。
---

# Grid

24 列栅格布局（可用 `cols` 调整）。子项请使用 `MGridItem`（别名 `MGi`）。

## 引入

```ts
import { MGrid, MGridItem } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Span & Offset

```vue preview src="./demos/SpanAndOffset.vue"
```

## Responsive

`cols` / `xGap` / `yGap` 与 `MGridItem` 的 `span` / `offset` 均支持响应式字符串，例如 `1 s:2 m:3`（断点：`xs` `s` `m` `l` `xl` `2xl`）。

当 `cols` / 间距是普通数字、但 item 仍要用响应式 `span` 时，请打开 `itemResponsive`。

```vue preview src="./demos/Responsive.vue"
```

## Collapsed

```vue preview src="./demos/Collapsed.zh.vue"
```

## Grid Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `cols` | `number \| string` | `24` | 列数，支持 `"1 s:2 m:3"` 响应式写法。 |
| `xGap` / `yGap` | `number \| string` | `0` | 列 / 行间距（px），同样支持响应式字符串。 |
| `responsive` | `'self' \| 'screen'` | `'self'` | 响应式依据容器宽度或视口宽度。 |
| `itemResponsive` | `boolean` | `false` | 强制按宽度解析 item 的 `span` / `offset`（即使 `cols` 为数字）。 |
| `collapsed` | `boolean` | `false` | 折叠超出行数的项。 |
| `collapsedRows` | `number` | `1` | 折叠时可见行数。 |
| `layoutShiftDisabled` | `boolean` | `false` | 关闭折叠/布局计算，退化为纯 CSS Grid。 |
| `itemStyle` | `string \| object` | — | 应用到每个 GridItem 的样式。 |

## GridItem Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `span` | `number \| string` | `1` | 跨列数。 |
| `offset` | `number \| string` | `0` | 左侧偏移列数。 |
| `suffix` | `boolean` | `false` | 折叠时固定在末尾（常用于「展开」）。 |

## GridItem Slots

| 插槽名 | 参数 | 说明 |
| --- | --- | --- |
| `default` | `{ overflow }` | 内容；`overflow` 表示是否有被折叠隐藏的项。 |

## Events

无自定义事件。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 栅格子项。 |
