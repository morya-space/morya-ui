---
title: Listbox
category: 02 / FORM
description: 列表形式的单选或多选控件，可筛选。
---

# Listbox

以列表呈现选项，支持单选、多选与过滤。

## 引入

```ts
import { MListbox } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| Array` | — | 绑定值。 |
| `options` | `{ label, value, disabled? }[]` | — | 选项。 |
| `multiple` | `boolean` | `false` | 多选。 |
| `filter` | `boolean` | `false` | 显示筛选框。 |
| `listStyle` | `string` | — | 列表内联样式。 |
| `virtual` | `boolean` | 自动 | `true` 强制虚拟列表；`false` 关闭；默认选项 ≥80 时开启。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `emptyMessage` | `string` | — | — |
| `invalid` | `boolean` | — | — |
| `size` | [MSizeInput](/docs/types#MSizeInput) | — | — |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | 同 `modelValue` | 值变化。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `option` | 选项 `{ option }`。 |
