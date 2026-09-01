---
title: OrderList
category: 06 / DATA
description: 列表拖拽与上下按钮排序。
---

# OrderList

支持拖拽手柄重排（原生 HTML5 DnD，无外部拖拽库），并保留上下按钮作为键盘友好备选。

## 引入

```ts
import { WiOrderList } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiOrderList } from '@well-insight/ui'
import { ref } from 'vue'

const items = ref(['设计', '开发', '测试', '发布'])
</script>

<template>
  <WiOrderList v-model="items" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `unknown[]` | `[]` | 列表数据。 |
| `dataKey` | `string` | — | 对象项的唯一键。 |
| `listStyle` | `string \| object` | — | 列表样式。 |
| `dragdrop` | `boolean` | `true` | 是否启用拖拽。 |

## Slots

| 插槽 | 说明 |
| --- | --- |
| `item` | `{ item, index }` 自定义项。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | `unknown[]` | 顺序变化。 |
| `reorder` | `unknown[]` | 拖拽或按钮重排后。 |
