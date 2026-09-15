---
title: Accordion
category: 03 / DATA
description: 可折叠面板组。支持单开 / 多开，tabs 配置 header 与 disabled。
---

# Accordion

可折叠面板，用于在有限空间内组织分组内容。

## 引入

```ts
import { MAccordion } from 'morya-ui'
```

## 基础用法

```vue preview src="./demos/Basic.vue"
```

## Multiple

```vue preview src="./demos/Multiple.vue"
```

## Extra

`#extra` 渲染在标题右侧；点击不会切换展开。

```vue preview src="./demos/Extra.vue"
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| string[]` | — | 当前展开的 tab key；多开时为数组。 |
| `multiple` | `boolean` | `false` | 允许多个面板同时展开。 |
| `tabs` | `{ value: string; header: string; disabled?: boolean }[]` | — | 面板列表。 |
| `defaultValue` | `string \| string[]` | — | — |
| `pt` | [RootPassThrough](/docs/types#RootPassThrough) `{ root? }` | — | DOM 透传，见 [样式与 attrs](/docs/attrs). |


## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `string \| string[]` | 展开项变化。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `[tab.value]` | 对应面板内容，插槽名与 `tabs[].value` 一致。 |
| `extra` | 标题右侧扩展，`{ tab }`；点击不会折叠。 |
