---
title: Radio
category: 02 / FORM
description: 单选框。支持 invalid。
---

# Radio

单选框。

## 引入

```ts
import { MRadio } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Invalid

```vue preview src="./demos/Invalid.vue"
```

## Disabled

```vue preview src="./demos/Disabled.vue"
```

## Group

```vue preview src="./demos/Group.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| boolean` | — | 当前选中值。 |
| `value` | `string \| number \| boolean` | — | **必填**，本选项的值。 |
| `label` | `string` | — | 标签文案；也可用默认插槽。 |
| `id` | `string` | — | 原生 id。 |
| `name` | `string` | — | 原生 name（同组需一致）。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。 |
| `invalid` | `boolean` | `false` | 校验失败态。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `required` | `boolean` | `false` | 原生 required。 |
| `pt` | [ControlPassThrough](/docs/types#ControlPassThrough) `{ root?, input? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string \| number \| boolean` | 选中值变化。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 自定义标签，优先于 `label`。 |
