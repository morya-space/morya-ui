---
title: AutoComplete
category: 02 / FORM
description: 输入时给出建议列表，可本地过滤或由父级提供。
---

# AutoComplete

输入建议补全；`complete` 事件便于父级异步加载。

## 引入

```ts
import { MAutoComplete } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.zh.vue"
```

## Size

```vue preview src="./demos/Size.vue"
```

## Options & loading

`suggestions` 可传字符串或 `{ label, value }`。`loading` / `clearable` 控制加载与清空。

```vue preview src="./demos/OptionsAndLoading.zh.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string` | `''` | 输入值。 |
| `suggestions` | `(string \| { label: string; value: string })[]` | `[]` | 建议列表。 |
| `loading` | `boolean` | `false` | 加载中。 |
| `clearable` | `boolean` | `false` | 显示清空按钮。 |
| `dropdown` | `boolean` | `false` | 显示下拉按钮。 |
| `placeholder` | `string` | — | 占位。 |
| `size` | [MSizeInput](/docs/types#MSizeInput) | — | `small` / `large`；可继承 ConfigProvider。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `teleport` | `boolean` | `true` | 浮层 Teleport；默认挂到 `body`。 |
| `appendTo` | `string \| HTMLElement \| 'self' \| false` | `'body'` | 挂载目标；`'self'` / `false` 就地渲染。 |
| `transition` | `string \| false` | `'scale-fade'` | 进出场动效预设；`false` / `'none'` 关闭。见[动效](/docs/motion)。 |
| `virtual` | `boolean` | 自动 | `true` 强制虚拟列表；`false` 关闭；默认建议项 ≥80 时开启。 |
| `emptyMessage` | `string` | — | — |
| `errorMessage` | `string` | — | — |
| `helpText` | `string` | — | — |
| `id` | `string` | — | — |
| `invalid` | `boolean` | — | — |
| `label` | `string` | — | — |
| `pt` | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string` | 值变化。 |
| `complete` | `query: string` | 请求补全。 |
| `clear` | — | 点击清除时触发。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `item` | 选项项 `{ option }`。 |
| `empty` | 无匹配结果。 |
