---
title: InputColor
category: 02 / FORM
description: 颜色选择，支持色板与十六进制文本。
---

# InputColor

通过原生色板与文本框编辑 hex 颜色。

## 何时使用

- 表单需要选择或输入十六进制颜色时。
- 需要预设色块（`swatches`）即可，不需要完整独立取色面板。

## 引入

```ts
import { MInputColor } from "morya-ui";
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Swatches

`swatches` 提供快捷色板。

```vue preview src="./demos/Swatches.vue"
```

## Props

| 参数         | 类型                                                                                   | 默认值      | 说明                                      |
| ------------ | -------------------------------------------------------------------------------------- | ----------- | ----------------------------------------- |
| `modelValue` | `string`                                                                               | `'#000000'` | 十六进制颜色。                            |
| `swatches`   | `string[]`                                                                             | —           | 快捷色板。                                |
| `disabled`   | `boolean`                                                                              | `false`     | 禁用。                                    |
| `id`         | `string`                                                                               | —           | 色板 input id。                           |
| `invalid`    | `boolean`                                                                              | —           | —                                         |
| `label`      | `string`                                                                               | —           | —                                         |
| `size`       | [MSizeInput](/docs/types#MSizeInput)                                                   | —           | —                                         |
| `pt`         | [FieldPassThrough](/docs/types#FieldPassThrough) `{ root?, label?, control?, input? }` | —           | DOM 透传，见 [样式与 attrs](/docs/attrs). |

## Events

| 事件名              | 参数     | 说明       |
| ------------------- | -------- | ---------- |
| `update:modelValue` | `string` | 颜色变化。 |

## 功能边界

选色实现是**原生色板 + hex 文本 + 可选 swatches**，不是完整的面板级取色体验。

## Slots

| 插槽名    | 说明               |
| --------- | ------------------ |
| `trigger` | 自定义颜色触发器。 |
