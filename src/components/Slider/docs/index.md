---
title: Slider
category: 02 / FORM
description: 滑动条，支持单值与区间选择。
---

# Slider

拖动选择数值。`range` 模式下使用两个滑块，绑定值为 `[min, max]`。

## 引入

```ts
import { MSlider } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Range

```vue preview src="./demos/Range.vue"
```

## Marks & vertical

`marks` 可以是数值数组，或「值 → 文案」映射。`tooltip` 在拖动时显示当前值。

```vue preview src="./demos/MarksAndVertical.zh.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number \| number[]` | `0` | 绑定值；区间模式为二元数组。 |
| `min` | `number` | `0` | 最小值。 |
| `max` | `number` | `100` | 最大值。 |
| `step` | `number` | `1` | 步进。 |
| `range` | `boolean` | `false` | 区间模式。 |
| `marks` | `number[] \| Record<number, string>` | — | 刻度；数组为值，对象为文案。 |
| `tooltip` | `boolean` | `false` | 拖动时显示当前值。 |
| `vertical` | `boolean` | `false` | 垂直方向。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `ariaLabel` | `string` | — | — |
| `errorMessage` | `string` | — | — |
| `helpText` | `string` | — | — |
| `invalid` | `boolean` | — | — |
| `label` | `string` | — | — |
| `size` | [MSizeInput](/docs/types#MSizeInput) | — | — |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `number \| number[]` | 值变化。 |

## Slots

无插槽。
