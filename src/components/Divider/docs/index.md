---
title: Divider
category: 01 / BASIC
description: 内容分隔线。
---

# Divider

内容分隔线，可带标签。

## 引入

```ts
import { MDivider } from 'morya-ui'
```

## 基础用法

默认水平实线分隔。

```vue preview src="./demos/Basic.vue"
```

## Type

`type` 支持 `solid`、`dashed`、`dotted`。

```vue preview src="./demos/Type.vue"
```

## Align

水平分隔且带标签时，可用 `align` 控制标签位置。

```vue preview src="./demos/Align.vue"
```

## Title placement

`titlePlacement` 是 `align` 的别名。

```vue preview src="./demos/TitlePlacement.vue"
```

## Layout

`layout` 控制水平 / 垂直。

```vue preview src="./demos/Layout.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `layout` | `'horizontal' \| 'vertical'` | `'horizontal'` | 布局方向。 |
| `type` | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` | 线条样式。 |
| `align` | `'left' \| 'center' \| 'right'` | `'center'` | 水平分隔带标签时的标签对齐。 |
| `titlePlacement` | `'left' \| 'center' \| 'right'` | — | `align` 的别名；传入时优先。 |
| `label` | `string` | — | 中间标签文案。存在默认插槽时以插槽为准。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 标签内容，优先于 `label`。 |

## Events

无自定义事件。
