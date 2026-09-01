---
title: Listbox
category: 02 / FORM
description: 列表形式的单选或多选控件，可筛选。
---

# Listbox

以列表呈现选项，支持单选、多选与过滤。

## 引入

```ts
import { WiListbox } from '@well-insight/ui'
```

## 基础用法

```vue preview
<script setup lang="ts">
import { WiListbox } from '@well-insight/ui'
import { ref } from 'vue'

const value = ref('a')
const options = [
  { label: 'Apple', value: 'a' },
  { label: 'Banana', value: 'b' },
  { label: 'Cherry', value: 'c' },
]
</script>

<template>
  <WiListbox v-model="value" :options="options" filter list-style="max-height: 12rem" />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| Array` | — | 绑定值。 |
| `options` | `{ label, value, disabled? }[]` | — | 选项。 |
| `multiple` | `boolean` | `false` | 多选。 |
| `filter` | `boolean` | `false` | 显示筛选框。 |
| `listStyle` | `string` | — | 列表内联样式。 |
| `disabled` | `boolean` | `false` | 禁用。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | 同 `modelValue` | 值变化。 |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `option` | 选项 `{ option }`。 |
