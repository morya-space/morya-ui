---
title: Switch
category: 02 / FORM
description: 开关。
---

# Switch

开关控件。

## 引入

```ts
import { MSwitch } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Invalid & inputId

`inputId` 是 `id` 的别名。

```vue preview src="./demos/InvalidAndInputid.vue"
```

## Disabled

```vue preview src="./demos/Disabled.vue"
```

## Loading & text

```vue preview src="./demos/LoadingAndText.zh.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `false` | 开关状态。 |
| `label` | `string` | — | 标签文案；也可用默认插槽。 |
| `id` | `string` | — | 原生 id。 |
| `inputId` | `string` | — | `id` 的别名。 |
| `name` | `string` | — | 原生 name。 |
| `value` | `string` | — | 原生 value。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。 |
| `loading` | `boolean` | `false` | 加载中，阻止切换。 |
| `checkedText` | `string` | — | 开启时轨道文案。 |
| `uncheckedText` | `string` | — | 关闭时轨道文案。 |
| `invalid` | `boolean` | `false` | 校验失败态。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `required` | `boolean` | `false` | 原生 required。 |
| `pt` | [ControlPassThrough](/docs/types#ControlPassThrough) `{ root?, input? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 状态变化。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 自定义标签，优先于 `label`。 |
