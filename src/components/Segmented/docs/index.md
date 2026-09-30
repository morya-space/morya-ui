---
title: Segmented
category: 02 / FORM
description: 分段控制器，单选切换。
---

# Segmented

在互斥选项间切换视图或模式。与 [SelectButton](/components/SelectButton) 不同：Segmented 为轨道 + 选中块样式，且为 **单选** `radiogroup` 语义（非 `aria-pressed` 多选）。


## 何时使用

- 分段控制器，单选切换。

## 引入

```ts
import { MSegmented } from 'morya-ui'
```

## 基础用法

`options` 可为 `string[]` 或 `{ label, value, icon?, disabled? }[]`。

```vue preview src="./demos/Basic.vue"
```

## 通栏与圆角

`block` 均分宽度；`shape="round"` 为胶囊轨道。

```vue preview src="./demos/BlockAndShape.vue"
```

## Props

| 参数 | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | — | 当前值 |
| `options` | `string[] \| SegmentedOption[]` | — | 选项 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸 |
| `block` | `boolean` | `false` | 通栏均分 |
| `disabled` | `boolean` | `false` | 禁用整组 |
| `shape` | `'default' \| 'round'` | `'default'` | 圆角形态 |
| `label` | `string` | — | `radiogroup` 无障碍标签 |
| `name` | `string` | 自动生成 | 原生 `radio` 组名 |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) | — | 根节点透传 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | 同 `modelValue` | 选中变化 |

## 与 SelectButton

| | Segmented | SelectButton |
| --- | --- | --- |
| 视觉 | 轨道 + 浮起选中项 | 按钮组边框 |
| 多选 | 不支持 | `multiple` |
| ARIA | `radiogroup` + `radio` | `group` + `aria-pressed` |
