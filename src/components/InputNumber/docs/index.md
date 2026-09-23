---
title: InputNumber
category: 02 / FORM
description: 数字输入框，支持步进按钮、上下限与尺寸。
---

# InputNumber

数字输入。可显示增减按钮，并按 `min` / `max` / `step` 约束取值。

## 引入

```ts
import { MInputNumber } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Buttons

```vue preview src="./demos/Buttons.vue"
```

## Precision & placement

`precision` 控制小数位。`button-placement="right"` 把增减按钮放到右侧。`clearable` 可清空。

```vue preview src="./demos/PrecisionAndPlacement.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number \| null` | `null` | 绑定值。 |
| `label` | `string` | — | 标签文案。 |
| `min` | `number` | — | 最小值。 |
| `max` | `number` | — | 最大值。 |
| `step` | `number` | `1` | 步进。 |
| `precision` | `number` | — | 小数位数。 |
| `showButtons` | `boolean` | `false` | 显示增减按钮。 |
| `buttonPlacement` | `'both' \| 'right'` | `'both'` | 按钮位置。 |
| `clearable` | `boolean` | `false` | 显示清空。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。 |
| `fluid` | `boolean` | `false` | 宽度撑满。 |
| `invalid` | `boolean` | `false` | 校验失败态。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `errorMessage` | `string` | — | — |
| `helpText` | `string` | — | — |
| `id` | `string` | — | — |
| `readonly` | `boolean` | — | — |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `number \| null` | 值变化。 |
| `blur` | — | — |
| `change` | — | — |
| `focus` | — | — |

## Methods

| 方法 | 说明 |
| --- | --- |
| `focus()` | 聚焦底层输入框。 |
| `blur()` | 使底层输入框失焦。 |
| `select()` | 选中输入框的全部文本。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `prefix` | 前缀。 |
| `suffix` | 后缀。 |
