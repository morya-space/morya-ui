---
title: ToggleButton
category: 02 / FORM
description: 在开/关两种标签状态间切换的按钮。
---

# ToggleButton

布尔切换按钮，可配置开/关文案与图标。

## 引入

```ts
import { MToggleButton } from 'morya-ui'
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
| `modelValue` | `boolean` | `false` | 是否开启。 |
| `onLabel` / `offLabel` | `string` | `On` / `Off` | 文案。 |
| `onIcon` / `offIcon` | `string` | — | 可选图标字符。 |
| `size` | [MSizeInput](/docs/types#MSizeInput) | — | `small` / `large`；可继承 ConfigProvider。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `boolean` | 值变化。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 按钮内容。 |
