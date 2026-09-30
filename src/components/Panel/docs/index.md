---
title: Panel
category: 03 / DATA
description: 带可选折叠的内容面板。
---

# Panel

用于分组展示内容的面板，可开启折叠。

## 引入

```ts
import { MPanel } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.zh.vue"
```

## Size

```vue preview src="./demos/Size.zh.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `header` | `string` | — | 标题文本。 |
| `toggleable` | `boolean` | `false` | 是否可折叠。 |
| `collapsed` | `boolean` | `false` | 折叠状态。 |
| `modelValue` | `boolean` | — | `collapsed` 的 `v-model` 别名。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。 |
| `defaultCollapsed` | `boolean` | — | — |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:collapsed` | `boolean` | 折叠状态变化。 |
| `update:modelValue` | `boolean` | 同 `update:collapsed`。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 面板内容。 |
| `header` | 自定义标题。 |
| `footer` | 底部区域；折叠时隐藏。 |
