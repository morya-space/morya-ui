---
title: SelectButton
category: 02 / FORM
description: 按钮组形式的单选或多选控件。
---

# SelectButton

以按钮组呈现选项，支持单选与多选。

## 引入

```ts
import { WdSelectButton } from '@well-insight/ui'
```

## Basic

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdSelectButton } from '@well-insight/ui'

const value = ref('center')
const options = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
]
</script>

<template>
  <WdSelectButton v-model="value" :options="options" />
</template>
```

## Multiple

```vue preview
<script setup lang="ts">
import { ref } from 'vue'
import { WdSelectButton } from '@well-insight/ui'

const value = ref(['left'])
const options = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
]
</script>

<template>
  <WdSelectButton v-model="value" :options="options" multiple />
</template>
```

## Props

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| boolean \| Array` | — | 绑定值。 |
| `options` | `{ label, value, disabled? }[]` | — | 选项列表。 |
| `multiple` | `boolean` | `false` | 多选。 |
| `size` | `'small' \| 'large' \| 'sm' \| 'md' \| 'lg'` | — | 尺寸。 |
| `invalid` | `boolean` | `false` | 校验失败态。 |
| `disabled` | `boolean` | `false` | 禁用整组。 |

## Events

| 事件名 | 参数 | 说明 |
| --- | --- | --- |
| `update:modelValue` | 同 `modelValue` | 值变化。 |
